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

import log_feature_capture_alignment as producer  # noqa: E402
from verifier import log_feature_capture_alignment_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


def rational(value: dict[str, str] | int) -> Fraction:
    if isinstance(value, int):
        return Fraction(value)
    return Fraction(int(value["numerator"]), int(value["denominator"]))


def dyadic(raw: list[object]) -> Fraction:
    sign, mantissa_text, exponent, _bits = raw
    mantissa = int(str(mantissa_text))
    numerator = -mantissa if sign else mantissa
    exponent = int(exponent)
    return (
        Fraction(numerator * 2**exponent)
        if exponent >= 0
        else Fraction(numerator, 2 ** (-exponent))
    )


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


class LogFeatureCaptureAlignmentTests(unittest.TestCase):
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

    def test_all_deterministic_runs_replay(self) -> None:
        for key, payload in self.runs.items():
            with self.subTest(run=key):
                report = self._replay(payload)
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
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
                "central_taylor_angle", "exact_source_tail", "odd_pole_taylor",
                "directional_moment_remainder", "positive_excess_necessity",
                "spectral_alignment", "rank_orientation_countermodels",
                "transcendental_intervals", "checks",
            },
        )
        self.assertEqual(
            self._bytes(producer.produce("5", "80")),
            self._bytes(producer.produce("5", "80")),
        )

    def test_interval_nesting_and_safe_exact_r(self) -> None:
        for p in ("5", "9"):
            low = self.runs[p, "80"]
            high = self.runs[p, "160"]
            expected_r = 3 * int(p).bit_length()
            self.assertEqual(low["inputs"]["r_exact_integer"], expected_r)
            self.assertEqual(high["inputs"]["r_exact_integer"], expected_r)
            low_values = low["certificate"]["transcendental_intervals"]["values"]
            high_values = high["certificate"]["transcendental_intervals"]["values"]
            self.assertEqual(set(low_values), set(high_values))
            for name in low_values:
                with self.subTest(p=p, value=name):
                    low_d = low_values[name]["dyadic"]
                    high_d = high_values[name]["dyadic"]
                    low_lo, low_hi = dyadic(low_d["lower"]), dyadic(low_d["upper"])
                    high_lo, high_hi = dyadic(high_d["lower"]), dyadic(high_d["upper"])
                    self.assertLessEqual(low_lo, high_lo)
                    self.assertLessEqual(high_hi, low_hi)
            margin = low_values["safe_r_minus_three_L_over_two"]["dyadic"]
            self.assertGreater(dyadic(margin["lower"]), 0)

    def test_central_angle_fixture_and_mutations(self) -> None:
        case = self.base["certificate"]["central_taylor_angle"]
        self.assertEqual(rational(case["alpha_squared"]), Fraction(16, 25))
        self.assertEqual(rational(case["central_defect_trace"]), Fraction(16, 25))
        self.assertEqual(case["central_defect_trace"], case["angle_upper_bound_squared"])
        self.assertTrue(case["angle_bound_is_equality"])
        self.assertFalse(case["physical_angle_estimate_claimed"])

        payload = self._payload()
        payload["certificate"]["central_taylor_angle"]["alpha_squared"] = R(3, 5)
        self._reject(payload, "central")
        payload = self._payload()
        payload["certificate"]["central_taylor_angle"]["physical_angle_estimate_claimed"] = True
        self._reject(payload, "central")

    def test_exact_source_tail_identity_and_scale(self) -> None:
        case = self.base["certificate"]["exact_source_tail"]
        self.assertEqual(case["T_B_X"], [[R(1), R(0)], [R(0), R(1)]])
        self.assertEqual(case["P_H_P_V"], [[R(0), R(0)], [R(0), R(1)]])
        self.assertEqual(
            case["P_H_P_V"], case["P_H_T_I_minus_P_F_B_X_P_V"]
        )
        self.assertTrue(case["identity_exact"])
        self.assertEqual(case["conditional_source_tail_squared_budget"], "2*L/lambda^3")
        self.assertEqual(case["conditional_alpha_squared_upper"], "L/lambda")
        self.assertTrue(case["big_o_is_not_a_strict_threshold"])
        self.assertFalse(case["physical_source_tail_estimate_claimed"])

        payload = self._payload()
        payload["certificate"]["exact_source_tail"]["P_H_T_I_minus_P_F_B_X_P_V"] = [
            [R(0), R(0)], [R(0), R(0)]
        ]
        self._reject(payload, "source.tail")
        payload = self._payload()
        payload["certificate"]["exact_source_tail"]["big_o_is_not_a_strict_threshold"] = False
        self._reject(payload, "source.tail")

    def test_odd_taylor_metadata_and_interval_mutation(self) -> None:
        odd = self.base["certificate"]["odd_pole_taylor"]
        self.assertTrue(odd["odd_sector_only"])
        self.assertEqual(odd["r_exact_integer"], 9)
        self.assertFalse(odd["physical_odd_pole_capture_claimed"])
        values = self.base["certificate"]["transcendental_intervals"]["values"]
        tail = values["odd_pole_taylor_tail_squared_upper"]["dyadic"]
        self.assertGreaterEqual(dyadic(tail["lower"]), 0)

        payload = self._payload()
        payload["certificate"]["odd_pole_taylor"]["odd_sector_only"] = False
        self._reject(payload, "odd")
        payload = self._payload()
        payload["certificate"]["odd_pole_taylor"]["r_exact_integer"] = 8
        self._reject(payload, "odd")

    def test_exact_directional_moment_remainders(self) -> None:
        case = self.base["certificate"]["directional_moment_remainder"]
        self.assertEqual(rational(case["exact_load"]), Fraction(7, 6))
        self.assertEqual(
            [rational(value) for value in case["U_0_through_4"]],
            [Fraction(2), Fraction(7, 5), Fraction(31, 25),
             Fraction(149, 125), Fraction(147, 125)],
        )
        self.assertEqual(
            case["exact_U_minus_load"], case["reconstructed_remainder_formula"]
        )
        for remainder, bound in zip(
            case["exact_U_minus_load"], case["geometric_remainder_upper"]
        ):
            self.assertLessEqual(rational(remainder), rational(bound))
        self.assertTrue(case["U_monotone"])
        self.assertFalse(case["strict_odd_load_claimed"])

        for field in ("reconstructed_remainder_formula", "geometric_remainder_upper"):
            with self.subTest(field=field):
                payload = self._payload()
                payload["certificate"]["directional_moment_remainder"][field][0] = R(0)
                self._reject(payload, "moment")

    def test_positive_excess_axis_necessity_and_boundary(self) -> None:
        case = self.base["certificate"]["positive_excess_necessity"]
        passing = case["strict_pass"]
        boundary = case["equality_boundary_rejected"]
        transverse = case["transverse_orientation_counterexample"]
        self.assertEqual(rational(case["necessary_rhs"]), 16)
        self.assertEqual(rational(passing["pole_axis_energy"]), 20)
        self.assertTrue(passing["strict_positive"])
        self.assertEqual(rational(boundary["pole_axis_energy"]), 16)
        self.assertTrue(boundary["singular"])
        self.assertFalse(boundary["strict_positive"])
        self.assertEqual(transverse["compensated_odd_matrix"], [[R(-1), R(0)], [R(0), R(6)]])

        payload = self._payload()
        payload["certificate"]["positive_excess_necessity"]["p_nonzero"] = False
        self._reject(payload, "positive.excess")
        payload = self._payload()
        payload["certificate"]["positive_excess_necessity"]["equality_boundary_rejected"]["strict_positive"] = True
        self._reject(payload, "positive.excess")

    def test_spectral_open_sufficiency_closed_necessity(self) -> None:
        case = self.base["certificate"]["spectral_alignment"]
        sufficient = case["sufficient_open_low_mass"]
        necessary = case["necessary_closed_low_mass"]
        endpoint = case["eigenvalue_sigma_boundary"]
        self.assertEqual(rational(sufficient["a_open"]), Fraction(1, 16))
        self.assertEqual(rational(sufficient["a_closed"]), Fraction(1, 8))
        self.assertEqual(rational(sufficient["load_exact"]), Fraction(3, 16))
        self.assertEqual(sufficient["load_exact"], sufficient["load_upper"])
        self.assertTrue(sufficient["strict_pass"])
        self.assertEqual(rational(necessary["a_closed"]), Fraction(1, 2))
        self.assertEqual(rational(necessary["load_exact"]), Fraction(3, 4))
        self.assertTrue(necessary["necessary_condition_holds"])
        self.assertEqual(rational(endpoint["a_open"]), 0)
        self.assertEqual(rational(endpoint["a_closed"]), 1)
        self.assertEqual(rational(endpoint["load_exact"]), 1)
        self.assertFalse(endpoint["strict_pass"])

        payload = self._payload()
        payload["certificate"]["spectral_alignment"]["eigenvalue_sigma_boundary"]["a_closed"] = R(0)
        self._reject(payload, "spectral")
        payload = self._payload()
        payload["certificate"]["spectral_alignment"]["eigenvalue_sigma_boundary"]["strict_pass"] = True
        self._reject(payload, "spectral")

    def test_rank_orientation_and_exterior_countermodels(self) -> None:
        cases = self.base["certificate"]["rank_orientation_countermodels"]
        rank = cases["rank_two_orientation"]
        exterior = cases["central_only_does_not_control_exterior"]
        self.assertEqual(rank["common_rank"], 2)
        self.assertEqual(rational(rank["good_residual_trace"]), Fraction(5, 16))
        self.assertEqual(rational(rank["bad_residual_trace"]), 5)
        self.assertEqual(rational(rank["good_alpha_squared"]), 0)
        self.assertEqual(rational(rank["bad_alpha_squared"]), 1)
        self.assertTrue(rank["rank_alone_does_not_control_capture"])
        self.assertEqual(rational(exterior["central_defect"]), 0)
        self.assertEqual(rational(exterior["exterior_defect"]), 7)
        self.assertFalse(exterior["central_capture_promoted_to_full_defect"])

        payload = self._payload()
        payload["certificate"]["rank_orientation_countermodels"]["rank_two_orientation"]["bad_residual_trace"] = R(5, 16)
        self._reject(payload, "rank")
        payload = self._payload()
        payload["certificate"]["rank_orientation_countermodels"]["central_only_does_not_control_exterior"]["central_capture_promoted_to_full_defect"] = True
        self._reject(payload, "central")

    def test_interval_reversal_and_excess_width_rejected(self) -> None:
        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"]["physical_length_L"]
        interval["dyadic"]["lower"], interval["dyadic"]["upper"] = (
            interval["dyadic"]["upper"], interval["dyadic"]["lower"]
        )
        interval["decimal"][0], interval["decimal"][1] = (
            interval["decimal"][1], interval["decimal"][0]
        )
        self._reject(payload, "reversed")

        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"]["physical_length_L"]
        interval["dyadic"]["lower"] = [0, "0", 0, 0]
        interval["dyadic"]["upper"] = [0, "8", 0, 4]
        interval["decimal"] = ["0.0", "8.0"]
        self._reject(payload)

    def test_source_lock_and_dependency_inventory(self) -> None:
        lock = ROOT / producer.LOCK
        self.assertEqual(
            hashlib.sha256(lock.read_bytes()).hexdigest(),
            verifier.EXPECTED_SOURCE_LOCK_SHA256,
        )
        self.assertEqual(
            set(self.base["source_lock"]["dependency_hashes"]),
            verifier.EXPECTED_DEPENDENCY_PATHS,
        )

    def test_source_convention_formula_and_admission_mutations_rejected(self) -> None:
        for section in ("locked_conventions", "locked_formulas"):
            for key in self.base["source_conventions"][section]:
                with self.subTest(section=section, key=key):
                    payload = self._payload()
                    payload["source_conventions"][section][key] = "mutated"
                    self._reject(payload, "source convention")
        for key in self.base["claim_boundary"]["source_admissions"]:
            with self.subTest(admission=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload, "claim boundary")

    def test_claim_and_terminal_promotions_rejected(self) -> None:
        payload = self._payload()
        payload["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        self._reject(payload, "terminal")
        payload = self._payload()
        payload["claim_boundary"]["claim_class"] = "CERTIFIED"
        self._reject(payload, "claim boundary")
        payload = self._payload()
        payload["certificate"]["transcendental_intervals"]["strict_threshold_supplied"] = True
        self._reject(payload, "interval")

    def test_noncanonical_inputs_and_caps_before_interval_arithmetic(self) -> None:
        for p, dps in (
            ("05", "80"), ("5.0", "80"), ("4", "80"),
            ("5", "080"), ("5", "49"),
        ):
            with self.subTest(p=p, dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, dps)
        huge = "9" * 10_000
        for p, dps in ((huge, "80"), ("5", "1001")):
            with self.subTest(path="producer", p_length=len(p), dps=dps):
                with mock.patch.object(
                    producer, "_interval_probes",
                    side_effect=AssertionError("interval arithmetic reached"),
                ) as probes:
                    with self.assertRaisesRegex((TypeError, ValueError), r"(?i)(at most|maximum)"):
                        producer.produce(p, dps)
                    probes.assert_not_called()
            with self.subTest(path="verifier", p_length=len(p), dps=dps):
                payload = self._payload()
                payload["inputs"]["lambda_numerator_text"] = p
                payload["inputs"]["dps_text"] = dps
                with mock.patch.object(
                    verifier, "_interval_targets",
                    side_effect=AssertionError("interval arithmetic reached"),
                ) as targets:
                    with self.assertRaisesRegex(verifier.ReplayError, r"(?i)(at most|maximum)"):
                        self._replay(payload)
                    targets.assert_not_called()

    def test_runtime_mismatch_fails_before_intervals(self) -> None:
        with (
            mock.patch.object(producer.mp, "__version__", "0.0.0"),
            mock.patch.object(
                producer, "_interval_probes",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as probes,
        ):
            with self.assertRaisesRegex(RuntimeError, r"(?i)(mpmath|runtime|version)"):
                producer.produce("5", "80")
            probes.assert_not_called()
        with (
            mock.patch.object(verifier.mp, "__version__", "0.0.0"),
            mock.patch.object(
                verifier, "_interval_targets",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as targets,
        ):
            with self.assertRaisesRegex(verifier.ReplayError, r"(?i)(mpmath|runtime|version)"):
                self._replay(self._payload())
            targets.assert_not_called()

    def test_binary64_duplicate_json_and_bound_bytes_rejected(self) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads('{"x": 0.5}', "binary64 fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x": 1, "x": 2}', "duplicate fixture")
        with self.assertRaises(verifier.ReplayError):
            verifier.replay(self.base, producer_bytes=self._bytes(self.base) + b" ")

    def test_no_environment_access_and_verifier_import_independence(self) -> None:
        paths = (
            ROOT / "src" / "log_feature_capture_alignment.py",
            ROOT / "verifier" / "log_feature_capture_alignment_replay.py",
        )
        for path in paths:
            with self.subTest(path=path.name):
                self.assertEqual(
                    secret_ast_findings(path.read_text(encoding="utf-8")),
                    (set(), set()),
                )
        verifier_source = paths[1].read_text(encoding="utf-8")
        tree = ast.parse(verifier_source)
        imports = {
            alias.name
            for node in ast.walk(tree)
            if isinstance(node, ast.Import)
            for alias in node.names
        }
        imports.update(
            node.module
            for node in ast.walk(tree)
            if isinstance(node, ast.ImportFrom) and node.module
        )
        self.assertNotIn("log_feature_capture_alignment", imports)

    def test_shared_arithmetic_limitation_serialized(self) -> None:
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertIn("mpmath.iv", libraries["independence_limitation"])

    def test_live_source_lock_mutation_detected(self) -> None:
        with mock.patch.object(verifier, "EXPECTED_SOURCE_LOCK_SHA256", "0" * 64):
            with self.assertRaisesRegex(verifier.ReplayError, "source-lock hash"):
                self._replay(self._payload())


if __name__ == "__main__":
    unittest.main()
