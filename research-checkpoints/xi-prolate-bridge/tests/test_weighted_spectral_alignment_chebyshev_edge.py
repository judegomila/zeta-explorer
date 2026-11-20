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

import weighted_spectral_alignment_chebyshev_edge as producer  # noqa: E402
from verifier import weighted_spectral_alignment_chebyshev_edge_replay as verifier  # noqa: E402


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


class WeightedSpectralAlignmentChebyshevEdgeTests(unittest.TestCase):
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
        expected_prime_counts = {"5": 4, "9": 12}
        for (p, dps), payload in self.runs.items():
            with self.subTest(p=p, dps=dps):
                report = self._replay(payload)
                self.assertEqual(report["schema"], verifier.REPLAY_SCHEMA)
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(report["reconstructed"]["exact_fixture_groups"], 4)
                self.assertEqual(report["reconstructed"]["transcendental_interval_count"], 27)
                self.assertEqual(report["reconstructed"]["source_dependency_count"], 10)
                self.assertEqual(
                    report["reconstructed"]["prime_power_count"], expected_prime_counts[p]
                )
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(self._bytes(payload)).hexdigest(),
                )
                self.assertTrue(report["checks"]["formula_tree_independent"])
                self.assertFalse(report["checks"]["producer_booleans_trusted"])

    def test_inventory_and_deterministic_serialization(self) -> None:
        self.assertEqual(
            set(self.base),
            {
                "schema", "source_lock", "inputs", "terminal_state",
                "source_conventions", "claim_boundary", "certificate",
                "arithmetic_libraries",
            },
        )
        self.assertEqual(
            set(self.base["certificate"]),
            {
                "weighted_central_fixture", "exterior_k_width_fixture",
                "odd_first_moment_fixture", "inclusive_prime_powers",
                "transcendental_intervals", "checks",
            },
        )
        self.assertEqual(len(self.base["certificate"]["checks"]), 18)
        self.assertTrue(all(self.base["certificate"]["checks"].values()))
        self.assertEqual(
            self._bytes(producer.produce("5", "80")),
            self._bytes(producer.produce("5", "80")),
        )

    def test_live_source_lock_and_dependency_hashes(self) -> None:
        lock_path = ROOT / producer.LOCK
        lock_hash = hashlib.sha256(lock_path.read_bytes()).hexdigest()
        self.assertEqual(lock_hash, verifier.EXPECTED_SOURCE_LOCK_SHA256)
        self.assertEqual(self.base["source_lock"]["sha256"], lock_hash)
        dependency_hashes = self.base["source_lock"]["dependency_hashes"]
        self.assertEqual(set(dependency_hashes), verifier.EXPECTED_DEPENDENCY_PATHS)
        self.assertEqual(len(dependency_hashes), 10)
        for relative, expected in dependency_hashes.items():
            with self.subTest(dependency=relative):
                self.assertEqual(
                    hashlib.sha256((ROOT / relative).read_bytes()).hexdigest(), expected
                )

    def test_all_intervals_nest_at_doubled_precision(self) -> None:
        for p in ("5", "9"):
            low = interval_inventory(
                self.runs[p, "80"]["certificate"]["transcendental_intervals"]
            )
            high = interval_inventory(
                self.runs[p, "160"]["certificate"]["transcendental_intervals"]
            )
            self.assertEqual(set(low), set(high))
            self.assertEqual(len(low), 27)
            for name in low:
                with self.subTest(p=p, interval=name):
                    low_lo = dyadic(low[name]["dyadic"]["lower"])
                    low_hi = dyadic(low[name]["dyadic"]["upper"])
                    high_lo = dyadic(high[name]["dyadic"]["lower"])
                    high_hi = dyadic(high[name]["dyadic"]["upper"])
                    self.assertLessEqual(low_lo, high_lo)
                    self.assertLessEqual(high_hi, low_hi)

    def test_weighted_central_fixture_rejects_uniform_overcharge(self) -> None:
        case = self.base["certificate"]["weighted_central_fixture"]
        self.assertEqual(rational(case["unweighted_alpha_squared"]), 1)
        self.assertEqual(rational(case["weighted_rho"]), Fraction(1, 100))
        self.assertEqual(rational(case["high_trace"]), Fraction(1, 100))
        self.assertEqual(rational(case["old_unweighted_coarse_bound"]), Fraction(101, 100))
        self.assertTrue(case["weighted_bound_is_sharp"])
        payload = self._payload()
        payload["certificate"]["weighted_central_fixture"]["weighted_rho"] = {
            "numerator": "1", "denominator": "10"
        }
        self._reject(payload, "weighted_central")

    def test_exterior_k_width_equalities_and_open_endpoint(self) -> None:
        case = self.base["certificate"]["exterior_k_width_fixture"]
        self.assertEqual(
            rational(case["trace_lower_equality"]["trace_on_H"]), Fraction(107, 100)
        )
        self.assertEqual(
            rational(case["trace_upper_equality"]["trace_on_H"]), Fraction(123, 100)
        )
        self.assertEqual(
            rational(case["operator_upper_equality"]["operator_norm_on_H"]),
            Fraction(73, 100),
        )
        endpoint = case["open_threshold_endpoint"]
        self.assertEqual(endpoint["strict_high_rank"], 1)
        self.assertEqual(rational(endpoint["low_tail_including_endpoint"]), Fraction(1, 2))
        rank = case["effective_rank_count"]
        self.assertEqual(rational(rank["p_plus_chi_over_sigma"]), Fraction(61, 25))
        self.assertEqual(rank["floor_p_plus_chi_over_sigma"], 2)
        payload = self._payload()
        payload["certificate"]["exterior_k_width_fixture"]["open_threshold_endpoint"][
            "strict_high_rank"
        ] = 2
        self._reject(payload, "exterior")

    def test_odd_same_first_moment_can_pass_or_fail(self) -> None:
        case = self.base["certificate"]["odd_first_moment_fixture"]
        a = case["same_first_moment_profile_A"]
        b = case["same_first_moment_profile_B"]
        for key in ("mu", "rho_1", "d_1_b_mu_minus_rho_1", "first_moment_upper"):
            self.assertEqual(a[key], b[key])
        self.assertEqual(rational(a["nonlinear_edge_deficit"]), Fraction(27, 80))
        self.assertEqual(rational(b["nonlinear_edge_deficit"]), Fraction(33, 80))
        self.assertEqual(rational(a["exact_shifted_load"]), Fraction(9, 8))
        self.assertEqual(rational(b["exact_shifted_load"]), Fraction(39, 40))
        self.assertFalse(a["strict_load_pass"])
        self.assertTrue(b["strict_load_pass"])
        endpoint = case["sharp_endpoint_profile"]
        self.assertEqual(rational(endpoint["exact_shifted_load"]), Fraction(4, 3))
        self.assertEqual(endpoint["exact_shifted_load"], endpoint["first_moment_upper"])

    def test_inclusive_prime_powers_and_minus_sign(self) -> None:
        expected = {
            "5": [2, 3, 4, 5],
            "9": [2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 17, 19],
        }
        for p in ("5", "9"):
            case = self.runs[p, "80"]["certificate"]["inclusive_prime_powers"]
            self.assertEqual([item["n"] for item in case["inventory"]], expected[p])
            self.assertEqual(case["prime_block_sign"], "minus")
            self.assertEqual(case["endpoint_rule"], "include every prime power n with 4*n<=p^2")
            self.assertFalse(case["individual_prime_blocks_absolutized_in_level_sets"])
        payload = self._payload()
        del payload["certificate"]["inclusive_prime_powers"]["inventory"][2]
        self._reject(payload, "prime")
        payload = self._payload()
        payload["certificate"]["inclusive_prime_powers"]["prime_block_sign"] = "plus"
        self._reject(payload, "prime")
        payload = self._payload()
        payload["certificate"]["inclusive_prime_powers"]["lambda_squared_numerator"] = "5"
        self._reject(payload, "prime")

    def test_convention_and_claim_promotions_are_rejected(self) -> None:
        mutations = [
            ("fourier_sign", "fhat(t)=integral f(x)*exp(+i*t*x)dx"),
            ("inversion", "reflection dropped"),
            ("prime_endpoint", "n<lambda^2"),
            ("source_interval", "unit-normalized source"),
            ("spectral_endpoint", "closed high threshold"),
        ]
        for key, value in mutations:
            with self.subTest(convention=key):
                payload = self._payload()
                payload["source_conventions"]["locked_conventions"][key] = value
                self._reject(payload, "source conventions")
        for key in (
            "actual_weighted_central_capture_claimed",
            "actual_exterior_alignment_claimed",
            "actual_odd_reserve_claimed",
            "global_weil_positivity_assumed",
            "zeros_assumed_real",
            "rank_only_capture_claimed",
            "equation_5_2_claimed",
            "determinant_limit_claimed",
            "unit_source_normalization_substituted",
        ):
            with self.subTest(claim=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload, "claim boundary")

    def test_interval_and_diagnostic_claim_forgery_is_rejected(self) -> None:
        payload = self._payload()
        payload["certificate"]["transcendental_intervals"][
            "actual_exterior_alignment_claimed"
        ] = True
        self._reject(payload, "interval metadata")
        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"][
            "chebyshev_r_0"
        ]
        interval["dyadic"]["lower"] = interval["dyadic"]["upper"]
        self._reject(payload, "interval")

    def test_input_caps_are_checked_before_interval_initialization(self) -> None:
        bad = [
            (5, "80"), ("05", "80"), ("7", "80"), ("999999", "80"),
            ("5", 80), ("5", "080"), ("5", "81"), ("5", "80.0"),
        ]
        with mock.patch.object(
            producer, "_interval_probes", side_effect=AssertionError("interval path reached")
        ):
            for p, dps in bad:
                with self.subTest(p=p, dps=dps):
                    with self.assertRaises((TypeError, ValueError)):
                        producer.produce(p, dps)

    def test_runtime_mismatch_is_rejected_before_interval_probe(self) -> None:
        with mock.patch.object(producer.mp, "__version__", "0.0.0"), mock.patch.object(
            producer, "_interval_probes", side_effect=AssertionError("interval path reached")
        ):
            with self.assertRaisesRegex(RuntimeError, "runtime mismatch"):
                producer.produce("5", "80")

    def test_strict_json_rejects_binary64_duplicates_and_noncanonical_bytes(self) -> None:
        raw = self._bytes(self.base)
        binary64 = raw.replace(b'"central_degree_exact": 2', b'"central_degree_exact": 2.0')
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads(binary64, "binary64 fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x":1,"x":1}', "duplicate fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "canonical"):
            verifier.replay(self.base, producer_bytes=b"{}\n")

    def test_code_paths_do_not_read_secrets_or_import_each_other(self) -> None:
        producer_source = (ROOT / "src" / "weighted_spectral_alignment_chebyshev_edge.py").read_text()
        verifier_source = (
            ROOT / "verifier" / "weighted_spectral_alignment_chebyshev_edge_replay.py"
        ).read_text()
        for label, source in (("producer", producer_source), ("verifier", verifier_source)):
            with self.subTest(path=label):
                imported, secret_names = secret_ast_findings(source)
                self.assertEqual(imported, set())
                self.assertEqual(secret_names, set())
        self.assertNotIn("import weighted_spectral_alignment_chebyshev_edge", verifier_source)
        self.assertNotIn("from src", verifier_source)
        self.assertFalse(
            self.base["claim_boundary"]["source_admissions"]["zeta_zero_table_read"]
        )
        self.assertFalse(
            self.base["claim_boundary"]["source_admissions"]["cached_matrix_read"]
        )

    def test_shared_arithmetic_limitation_is_serialized(self) -> None:
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertIn("mpmath.iv 1.4.1", libraries["libraries"])
        self.assertIn("share", libraries["independence_limitation"])
        report = self._replay(self.base)
        self.assertEqual(report["arithmetic_libraries"], libraries)


if __name__ == "__main__":
    unittest.main()
