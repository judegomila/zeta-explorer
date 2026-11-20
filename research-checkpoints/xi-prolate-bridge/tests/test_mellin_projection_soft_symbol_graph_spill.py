from __future__ import annotations

import ast
import copy
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

import mellin_projection_soft_symbol_graph_spill as producer  # noqa: E402
from verifier import mellin_projection_soft_symbol_graph_spill_replay as verifier  # noqa: E402


def rational(value: dict[str, str] | int) -> Fraction:
    if isinstance(value, int):
        return Fraction(value)
    return Fraction(int(value["numerator"]), int(value["denominator"]))


def dyadic(raw: list[object]) -> Fraction:
    sign, mantissa_text, exponent, _bits = raw
    mantissa = int(str(mantissa_text))
    signed = -mantissa if sign else mantissa
    exponent = int(exponent)
    return (
        Fraction(signed * 2**exponent)
        if exponent >= 0
        else Fraction(signed, 2 ** (-exponent))
    )


def interval_inventory(value: object, path: str = "") -> dict[str, dict[str, object]]:
    found: dict[str, dict[str, object]] = {}
    if isinstance(value, dict):
        if set(value) == {"decimal", "dyadic"}:
            found[path] = value
        else:
            for key, child in value.items():
                child_path = f"{path}.{key}" if path else key
                found.update(interval_inventory(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.update(interval_inventory(child, f"{path}[{index}]"))
    return found


def secret_ast_findings(source: str) -> tuple[set[str], set[str]]:
    tree = ast.parse(source)
    imported_roots: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imported_roots.update(alias.name.split(".", 1)[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imported_roots.add(node.module.split(".", 1)[0])
    names = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    attributes = {node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)}
    return imported_roots & {"os", "dotenv"}, (names | attributes) & {"environ", "getenv"}


class MellinProjectionSoftSymbolGraphSpillTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.runs: dict[tuple[str, str], dict[str, object]] = {}
        for p in ("5", "9"):
            for dps in ("80", "160"):
                cls.runs[p, dps] = producer.produce(p, dps)
        cls.base = cls.runs["5", "80"]

    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (
            json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n"
        ).encode("utf-8")

    def _payload(self) -> dict[str, object]:
        return copy.deepcopy(self.base)

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        return verifier.replay(payload, producer_bytes=self._bytes(payload))

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    def test_all_four_pilots_replay_and_bind_exact_bytes(self) -> None:
        expected_schedules = {"5": 3, "9": 5}
        expected_prime_counts = {"5": 4, "9": 12}
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                report = self._replay(payload)
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(report["reconstructed"]["source_dependency_count"], 18)
                self.assertEqual(report["reconstructed"]["external_source_byte_count"], 4)
                self.assertEqual(report["reconstructed"]["mellin_interval_count"], 17)
                self.assertEqual(report["reconstructed"]["pole_prime_interval_count"], 4)
                self.assertEqual(
                    report["reconstructed"]["schedule_N_star_exact"],
                    expected_schedules[p],
                )
                self.assertEqual(
                    report["reconstructed"]["prime_power_count"],
                    expected_prime_counts[p],
                )
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(self._bytes(payload)).hexdigest(),
                )

    def test_inventory_checks_and_deterministic_serialization(self) -> None:
        self.assertEqual(
            set(self.base),
            {
                "schema", "source_lock", "inputs", "terminal_state",
                "source_conventions", "claim_boundary", "certificate",
                "arithmetic_libraries",
            },
        )
        self.assertEqual(len(self.base["certificate"]["checks"]), 28)
        self.assertTrue(all(self.base["certificate"]["checks"].values()))
        self.assertEqual(
            self._bytes(producer.produce("5", "80")),
            self._bytes(producer.produce("5", "80")),
        )

    def test_live_source_lock_dependency_and_external_hashes(self) -> None:
        lock_path = ROOT / producer.LOCK
        lock_hash = hashlib.sha256(lock_path.read_bytes()).hexdigest()
        self.assertEqual(lock_hash, verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(self.base["source_lock"]["sha256"], lock_hash)
        dependencies = self.base["source_lock"]["dependency_hashes"]
        externals = self.base["source_lock"]["external_source_hashes"]
        self.assertEqual(set(dependencies), verifier.EXPECTED_DEPENDENCY_PATHS)
        self.assertEqual(set(externals), verifier.EXPECTED_EXTERNAL_PATHS)
        for relative, expected in {**dependencies, **externals}.items():
            with self.subTest(path=relative):
                self.assertEqual(
                    hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(),
                    expected,
                )

    def test_all_intervals_nest_at_doubled_precision(self) -> None:
        for p in ("5", "9"):
            low = interval_inventory(self.runs[p, "80"]["certificate"])
            high = interval_inventory(self.runs[p, "160"]["certificate"])
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 21)
            for name in low:
                with self.subTest(p=p, interval=name):
                    low_lo = dyadic(low[name]["dyadic"]["lower"])
                    low_hi = dyadic(low[name]["dyadic"]["upper"])
                    high_lo = dyadic(high[name]["dyadic"]["lower"])
                    high_hi = dyadic(high[name]["dyadic"]["upper"])
                    self.assertLessEqual(low_lo, high_lo)
                    self.assertLessEqual(high_hi, low_hi)

    def test_source_scalar_derivatives_and_unit_normalization_guard(self) -> None:
        case = self.base["certificate"]["normalization_and_derivative_fixture"]
        self.assertEqual(rational(case["xi_transform_scalar"]), Fraction(1, 4))
        self.assertEqual(
            rational(case["second_log_derivative_polynomial"][-1]["coefficient"]),
            Fraction(-75, 8),
        )
        self.assertTrue(case["unit_norm_limiting_scalar_rejected"])
        payload = self._payload()
        payload["certificate"]["normalization_and_derivative_fixture"][
            "xi_transform_scalar"
        ] = {"numerator": "1", "denominator": "1"}
        self._reject(payload, "normalization")

    def test_soft_symbol_keeps_gray_mass_and_layer_separation(self) -> None:
        case = self.base["certificate"]["soft_symbol_fixture"]
        self.assertEqual(rational(case["gray_term"]), Fraction(3, 16))
        self.assertEqual(rational(case["difference_term"]), Fraction(1, 16))
        self.assertEqual(rational(case["chi_X"]), Fraction(1, 4))
        self.assertEqual(rational(case["layer_average_left"]), Fraction(1, 2))
        payload = self._payload()
        payload["certificate"]["soft_symbol_fixture"]["gray_term"] = {
            "numerator": "0", "denominator": "1"
        }
        self._reject(payload, "soft_symbol")

    def test_effective_tail_endpoint_and_bv_branches(self) -> None:
        case = self.base["certificate"]["effective_tail_and_bv_fixture"]
        self.assertEqual(case["r_sigma_open"], 1)
        self.assertEqual(rational(case["low_tail_including_endpoint"]), Fraction(3, 5))
        self.assertTrue(case["endpoint_retained_low"])
        self.assertTrue(case["bv_piecewise_oracles"]["junction"]["branches_meet"])
        payload = self._payload()
        payload["certificate"]["effective_tail_and_bv_fixture"]["r_sigma_open"] = 2
        self._reject(payload, "effective_tail")

    def test_graph_equation_without_spill_is_rejected(self) -> None:
        case = self.base["certificate"]["graph_spill_fixture"]
        self.assertTrue(case["low_graph_equation_exact"])
        self.assertEqual(rational(case["Gamma_squared"]), Fraction(1, 4))
        self.assertEqual(rational(case["rho_B"]), Fraction(5, 32))
        self.assertTrue(case["bad_spill_countermodel"]["omission_fails"])
        payload = self._payload()
        payload["certificate"]["graph_spill_fixture"]["Gamma_squared"] = {
            "numerator": "0", "denominator": "1"
        }
        self._reject(payload, "graph_spill")

    def test_odd_harmonic_short_and_monotone_remainders(self) -> None:
        case = self.base["certificate"]["odd_harmonic_moment_fixture"]
        short = case["harmonic_short"]
        self.assertEqual(rational(short["load"]), Fraction(43, 50))
        self.assertEqual(short["scalar_short_direct"], short["scalar_short_from_load"])
        hierarchy = case["monotone_remainder"]
        self.assertEqual(
            [rational(value) for value in hierarchy["remainder_exact"]],
            [Fraction(1, 9), Fraction(1, 27), Fraction(1, 81), Fraction(1, 243)],
        )
        self.assertTrue(hierarchy["nonincreasing"])

    def test_fixed_moments_can_have_opposite_load_signs(self) -> None:
        case = self.base["certificate"]["odd_harmonic_moment_fixture"][
            "same_moments_opposite_load"
        ]
        self.assertEqual(case["moments_plus"], case["moments_minus"])
        self.assertEqual(rational(case["load_plus"]), Fraction(59, 58))
        self.assertEqual(rational(case["load_minus"]), Fraction(57, 58))
        payload = self._payload()
        payload["certificate"]["odd_harmonic_moment_fixture"][
            "same_moments_opposite_load"
        ]["load_plus"] = {"numerator": "57", "denominator": "58"}
        self._reject(payload, "odd_harmonic")

    def test_inclusive_prime_powers_minus_sign_and_no_zero_values(self) -> None:
        expected = {
            "5": [2, 3, 4, 5],
            "9": [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
        }
        for p in ("5", "9"):
            case = self.runs[p, "80"]["certificate"][
                "prime_power_and_pole_prime_fixture"
            ]
            self.assertEqual([item["n"] for item in case["inventory"]], expected[p])
            self.assertEqual(case["prime_block_sign"], "minus")
            self.assertTrue(case["paths_overlap"])
            self.assertEqual(case["zero_series_values"], [])
        payload = self._payload()
        payload["certificate"]["prime_power_and_pole_prime_fixture"][
            "prime_block_sign"
        ] = "plus"
        self._reject(payload, "pole-prime")
        payload = self._payload()
        del payload["certificate"]["prime_power_and_pole_prime_fixture"]["inventory"][2]
        self._reject(payload, "pole-prime")
        payload = self._payload()
        payload["certificate"]["prime_power_and_pole_prime_fixture"][
            "zero_series_values"
        ] = ["14.134725"]
        self._reject(payload, "pole-prime")

    def test_schedule_and_center_are_diagnostics_only(self) -> None:
        self.assertEqual(
            self.runs["5", "80"]["certificate"]["mellin_projection_intervals"][
                "schedule_N_star_exact"
            ],
            3,
        )
        self.assertEqual(
            self.runs["9", "80"]["certificate"]["mellin_projection_intervals"][
                "schedule_N_star_exact"
            ],
            5,
        )
        self.assertFalse(
            self.base["certificate"]["mellin_projection_intervals"][
                "source_delta_finite_value_supplied"
            ]
        )
        self.assertTrue(self.base["certificate"]["checks"]["c0_is_center_not_limit"])

    def test_convention_and_claim_promotions_are_rejected(self) -> None:
        for key, value in (
            ("fourier", "positive exponent"),
            ("inversion", "reflection dropped"),
            ("prime_block", "plus sign and strict endpoint"),
            ("limiting_transform", "Khat=Xi"),
        ):
            with self.subTest(convention=key):
                payload = self._payload()
                payload["source_conventions"]["locked_conventions"][key] = value
                self._reject(payload, "source conventions")
        for key in (
            "actual_central_graph_spill_rate_claimed",
            "actual_exterior_alignment_claimed",
            "actual_odd_reserve_claimed",
            "global_weil_positivity_assumed",
            "zeros_assumed_on_critical_line",
            "equation_5_2_claimed",
            "determinant_limit_claimed",
            "smoothed_chebyshev_little_oh_assumed",
            "unit_source_normalization_substituted",
        ):
            with self.subTest(claim=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload, "claim boundary")

    def test_input_caps_precede_interval_initialization(self) -> None:
        bad = [
            (5, "80"), ("05", "80"), ("7", "80"), ("999999", "80"),
            ("5", 80), ("5", "080"), ("5", "81"), ("5", "80.0"),
        ]
        with mock.patch.object(
            producer,
            "_mellin_projection_intervals",
            side_effect=AssertionError("interval path reached"),
        ):
            for p, dps in bad:
                with self.subTest(p=p, dps=dps):
                    with self.assertRaises((TypeError, ValueError)):
                        producer.produce(p, dps)

    def test_runtime_mismatch_precedes_interval_probe(self) -> None:
        with mock.patch.object(producer.mp, "__version__", "0.0.0"), mock.patch.object(
            producer,
            "_mellin_projection_intervals",
            side_effect=AssertionError("interval path reached"),
        ):
            with self.assertRaisesRegex(RuntimeError, "runtime mismatch"):
                producer.produce("5", "80")

    def test_strict_json_and_noncanonical_bytes_are_rejected(self) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads('{"x":1.0}', "binary64 fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x":1,"x":1}', "duplicate fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "canonical"):
            verifier.replay(self.base, producer_bytes=b"{}\n")

    def test_interval_forgery_is_rejected(self) -> None:
        payload = self._payload()
        interval = payload["certificate"]["mellin_projection_intervals"]["values"][
            "c0"
        ]
        interval["dyadic"]["lower"] = interval["dyadic"]["upper"]
        self._reject(payload, "Mellin.c0")
        payload = self._payload()
        payload["certificate"]["mellin_projection_intervals"][
            "source_delta_finite_value_supplied"
        ] = True
        self._reject(payload, "Mellin interval metadata")

    def test_code_paths_do_not_read_secrets_or_import_each_other(self) -> None:
        producer_source = (
            ROOT / "src" / "mellin_projection_soft_symbol_graph_spill.py"
        ).read_text()
        verifier_source = (
            ROOT / "verifier" / "mellin_projection_soft_symbol_graph_spill_replay.py"
        ).read_text()
        for label, source in (("producer", producer_source), ("verifier", verifier_source)):
            with self.subTest(path=label):
                imported, secret_names = secret_ast_findings(source)
                self.assertEqual(imported, set())
                self.assertEqual(secret_names, set())
        self.assertNotIn("import mellin_projection_soft_symbol_graph_spill", verifier_source)
        self.assertNotIn("from src", verifier_source)
        self.assertFalse(
            self.base["claim_boundary"]["source_admissions"]["decimal_zero_list_read"]
        )
        self.assertFalse(
            self.base["claim_boundary"]["source_admissions"]["environment_secret_read"]
        )

    def test_shared_arithmetic_limitation_is_serialized(self) -> None:
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertIn("mpmath.iv 1.4.1", libraries["libraries"])
        self.assertIn("share", libraries["independence_limitation"])
        self.assertEqual(self._replay(self.base)["arithmetic_libraries"], libraries)


if __name__ == "__main__":
    unittest.main()
