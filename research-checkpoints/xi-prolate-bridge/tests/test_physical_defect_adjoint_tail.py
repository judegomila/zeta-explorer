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

import physical_defect_adjoint_tail as producer  # noqa: E402
from verifier import physical_defect_adjoint_tail_replay as verifier  # noqa: E402


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
    """Return syntax-level secret-access findings without scanning strings."""
    tree = ast.parse(source)
    imported_roots: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imported_roots.update(alias.name.split(".", 1)[0] for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imported_roots.add(node.module.split(".", 1)[0])
    forbidden_imports = imported_roots & {"os", "dotenv"}
    names = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    attributes = {
        node.attr for node in ast.walk(tree) if isinstance(node, ast.Attribute)
    }
    secret_symbols = (names | attributes) & {"environ", "getenv"}
    return forbidden_imports, secret_symbols


class PhysicalDefectAdjointTailTests(unittest.TestCase):
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

    def test_all_four_deterministic_runs_replay(self) -> None:
        for p in ("5", "9"):
            for dps in ("80", "160"):
                with self.subTest(p=p, dps=dps):
                    payload = self.runs[p, dps]
                    report = self._replay(payload)
                    self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                    self.assertEqual(
                        report["reconstructed"]["transcendental_interval_count"], 7
                    )
                    self.assertEqual(
                        report["reconstructed"]["source_dependency_count"], 16
                    )
                    self.assertTrue(report["checks"]["formula_tree_independent"])
                    self.assertFalse(report["checks"]["producer_booleans_trusted"])
                    self.assertEqual(
                        report["producer_binding"]["sha256"],
                        hashlib.sha256(self._bytes(payload)).hexdigest(),
                    )

    def test_top_level_and_certificate_inventory(self) -> None:
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
                "cap_free_weighted_capture", "exact_coframe_loss",
                "shifted_odd_and_positive_excess", "transcendental_intervals",
                "checks",
            },
        )

    def test_interval_nesting_at_doubled_precision(self) -> None:
        for p in ("5", "9"):
            low_values = self.runs[p, "80"]["certificate"]["transcendental_intervals"]["values"]
            high_values = self.runs[p, "160"]["certificate"]["transcendental_intervals"]["values"]
            self.assertEqual(set(low_values), set(high_values))
            for key in low_values:
                with self.subTest(p=p, key=key):
                    low = low_values[key]["dyadic"]
                    high = high_values[key]["dyadic"]
                    low_lo, low_hi = dyadic(low["lower"]), dyadic(low["upper"])
                    high_lo, high_hi = dyadic(high["lower"]), dyadic(high["upper"])
                    self.assertLessEqual(low_lo, high_lo)
                    self.assertLessEqual(high_hi, low_hi)

    def test_deterministic_serialization(self) -> None:
        first = producer.produce("5", "80")
        second = producer.produce("5", "80")
        self.assertEqual(self._bytes(first), self._bytes(second))

    def test_weighted_capture_and_source_competitor_exact(self) -> None:
        weighted = self.base["certificate"]["cap_free_weighted_capture"]
        capture = weighted["least_squares_capture"]
        competitor = weighted["full_source_competitor"]
        self.assertEqual(rational(capture["residual_trace"]), Fraction(14, 3))
        self.assertEqual(rational(capture["captured_trace"]), Fraction(28, 3))
        self.assertEqual(rational(capture["total_trace"]), Fraction(14))
        self.assertEqual(rational(competitor["competitor_cost"]), Fraction(144, 25))
        self.assertEqual(rational(competitor["cost_above_infimum"]), Fraction(82, 75))

    def test_cap_cancellation_exact(self) -> None:
        cap = self.base["certificate"]["cap_free_weighted_capture"]["cap_cancellation"]
        self.assertEqual(cap["capped_excess_values"], cap["cap_free_values"])
        self.assertEqual(
            [rational(value) for value in cap["cap_free_values"]],
            [Fraction(7), Fraction(2), Fraction(0), Fraction(0)],
        )

    def test_central_band_trace_is_not_one_state_claim(self) -> None:
        central = self.base["certificate"]["cap_free_weighted_capture"][
            "central_band_necessity_fixture"
        ]
        self.assertEqual(
            central["D_central"],
            [
                [R(6), R(0), R(0)],
                [R(0), R(3), R(0)],
                [R(0), R(0), R(0)],
            ],
        )
        self.assertEqual(
            central["domination_remainder_D_minus_A_T_band"],
            [[R(0), R(0), R(0)] for _ in range(3)],
        )
        self.assertTrue(central["domination_verified"])
        self.assertEqual(rational(central["residual_band_trace"]), Fraction(1, 2))
        self.assertEqual(rational(central["residual_trace"]), Fraction(3))
        self.assertTrue(central["strict_budget_antecedent"])
        self.assertEqual(rational(central["necessary_trace_upper_bound"]), Fraction(2, 3))
        self.assertFalse(central["one_state_estimate_promoted_to_trace"])

    def test_invalid_central_domination_fixture_rejected(self) -> None:
        payload = self._payload()
        central = payload["certificate"]["cap_free_weighted_capture"][
            "central_band_necessity_fixture"
        ]
        central["D_central"] = [
            [R(9), R(0), R(0)],
            [R(0), R(1), R(0)],
            [R(0), R(0), R(4)],
        ]
        central["domination_remainder_D_minus_A_T_band"] = [
            [R(3), R(0), R(0)],
            [R(0), R(-2), R(0)],
            [R(0), R(0), R(4)],
        ]
        central["domination_verified"] = False
        central["residual_trace"] = R(14, 3)
        central["strict_budget_antecedent"] = False
        self._reject(payload, "cap_free_weighted_capture")

    def test_exact_coframe_rank_one_correction(self) -> None:
        coframe = self.base["certificate"]["exact_coframe_loss"]
        self.assertEqual(coframe["loss_from_exact_formula"], coframe["loss_from_direct_projection"])
        self.assertEqual(rational(coframe["rho_norm_A_squared"]), Fraction(1, 2))
        self.assertEqual(rational(coframe["beta_E"]), Fraction(1, 6))
        self.assertEqual(rational(coframe["rho_plus_beta_E"]), Fraction(2, 3))
        self.assertEqual(rational(coframe["old_cauchy_Theta"]), Fraction(5, 6))
        self.assertEqual(
            rational(coframe["normalized_volume_det_I_minus_loss"]), Fraction(1, 3)
        )
        self.assertNotEqual(coframe["source_gram_C_star_C"], [[R(1), R(0)], [R(0), R(1)]])

    def test_omitting_coframe_rank_one_correction_rejected(self) -> None:
        payload = self._payload()
        coframe = payload["certificate"]["exact_coframe_loss"]
        zero = [[R(0), R(0)], [R(0), R(0)]]
        coframe["A_star_e"] = [R(0), R(0)]
        coframe["rank_one_correction"] = zero
        coframe["loss_from_exact_formula"] = copy.deepcopy(coframe["A_star_A"])
        coframe["loss_from_direct_projection"] = copy.deepcopy(coframe["A_star_A"])
        coframe["beta_E"] = R(0)
        coframe["rho_plus_beta_E"] = R(1, 2)
        coframe["exact_loss_norm"] = R(1, 2)
        coframe["normalized_volume_det_I_minus_loss"] = R(1, 2)
        self._reject(payload, "exact_coframe_loss")

    def test_nonzero_chi_oracles(self) -> None:
        odd = self.base["certificate"]["shifted_odd_and_positive_excess"]
        zero = odd["unshifted_beta_zero_nonzero_chi"]
        one = odd["shifted_beta_one_nonzero_chi"]
        self.assertEqual(rational(zero["chi_beta"]), Fraction(43, 216))
        self.assertEqual(rational(zero["load_direct"]), Fraction(43, 216))
        self.assertEqual(rational(zero["load_if_chi_omitted"]), Fraction(43, 180))
        self.assertEqual(rational(one["chi_beta"]), Fraction(5, 18))
        self.assertEqual(rational(one["load_direct"]), Fraction(5, 18))
        self.assertEqual(rational(one["load_if_chi_omitted"]), Fraction(5, 12))

    def test_moment_hierarchy_is_nonincreasing_and_above_load(self) -> None:
        case = self.base["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_beta_one_nonzero_chi"
        ]
        values = [rational(value) for value in case["U_0_through_4"]]
        exact = rational(case["load_direct"])
        self.assertTrue(all(left >= right for left, right in zip(values, values[1:])))
        self.assertTrue(all(value >= exact for value in values))
        self.assertEqual(values[0], Fraction(13, 18))
        self.assertEqual(values[1], Fraction(5, 12))

    def test_moment_difference_and_remainder_formula_rhs_arrays(self) -> None:
        odd = self.base["certificate"]["shifted_odd_and_positive_excess"]
        for label in (
            "unshifted_beta_zero_nonzero_chi",
            "shifted_beta_one_nonzero_chi",
        ):
            with self.subTest(label=label):
                case = odd[label]
                self.assertEqual(
                    case["successive_U_differences"],
                    case["successive_U_difference_formula_rhs"],
                )
                self.assertEqual(
                    case["U_minus_exact_load"],
                    case["U_minus_exact_load_formula_rhs"],
                )
                self.assertTrue(
                    all(
                        rational(value) >= 0
                        for value in case["successive_U_difference_formula_rhs"]
                        + case["U_minus_exact_load_formula_rhs"]
                    )
                )

    def test_mutated_moment_formula_rhs_rejected(self) -> None:
        for field in (
            "successive_U_difference_formula_rhs",
            "U_minus_exact_load_formula_rhs",
        ):
            with self.subTest(field=field):
                payload = self._payload()
                case = payload["certificate"]["shifted_odd_and_positive_excess"][
                    "shifted_beta_one_nonzero_chi"
                ]
                case[field][0] = R(0)
                self._reject(payload, "shifted_odd_and_positive_excess")

    def test_aligned_positive_excess_identity(self) -> None:
        excess = self.base["certificate"]["shifted_odd_and_positive_excess"][
            "aligned_positive_excess"
        ]
        self.assertEqual(rational(excess["sherman_morrison_correction"]), Fraction(4, 33))
        self.assertEqual(rational(excess["compensated_load_direct"]), Fraction(31, 198))
        self.assertEqual(excess["compensated_load_formula"], excess["compensated_load_direct"])
        self.assertFalse(excess["transverse_operator_norm_used_as_reserve"])

    def test_shifted_floor_rejects_nonpositive_reserve(self) -> None:
        one_direction = self.base["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_one_direction"
        ]
        self.assertEqual(
            rational(one_direction["strict_floor_2"]["schur_reserve"]), Fraction(1, 2)
        )
        self.assertTrue(one_direction["strict_floor_2"]["strict_pass"])
        self.assertEqual(
            rational(one_direction["rejected_floor_5_over_2"]["schur_reserve"]),
            Fraction(-1, 6),
        )
        self.assertFalse(one_direction["rejected_floor_5_over_2"]["strict_pass"])

    def test_load_one_equality_is_not_strict_and_positive_pole_is_rejected(self) -> None:
        oracle = self.base["certificate"]["shifted_odd_and_positive_excess"][
            "load_one_equality_oracle"
        ]
        self.assertEqual(rational(oracle["load_direct"]), Fraction(1))
        self.assertEqual(
            oracle["shifted_odd_matrix"], [[R(3), R(0)], [R(0), R(0)]]
        )
        self.assertEqual(
            [rational(value) for value in oracle["shifted_odd_principal_minors"]],
            [Fraction(3), Fraction(0)],
        )
        self.assertFalse(oracle["strict_pass"])
        self.assertEqual(
            oracle["wrong_positive_pole_matrix"],
            [[R(3), R(0)], [R(0), R(4)]],
        )
        self.assertTrue(oracle["wrong_positive_pole_matrix_is_positive"])
        self.assertTrue(oracle["wrong_positive_pole_sign_rejected"])

        equality_payload = self._payload()
        equality = equality_payload["certificate"][
            "shifted_odd_and_positive_excess"
        ]["load_one_equality_oracle"]
        equality["strict_pass"] = True
        self._reject(equality_payload, "shifted_odd_and_positive_excess")

        sign_payload = self._payload()
        mutated = sign_payload["certificate"]["shifted_odd_and_positive_excess"][
            "load_one_equality_oracle"
        ]
        mutated["shifted_odd_matrix"] = copy.deepcopy(
            mutated["wrong_positive_pole_matrix"]
        )
        mutated["shifted_odd_principal_minors"] = copy.deepcopy(
            mutated["wrong_positive_pole_principal_minors"]
        )
        mutated["wrong_positive_pole_sign_rejected"] = False
        self._reject(sign_payload, "shifted_odd_and_positive_excess")

    def test_unshifted_transverse_block_substitution_rejected(self) -> None:
        one_direction = self.base["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_one_direction"
        ]
        self.assertEqual(
            rational(one_direction["unshifted_transverse_wrong_reserve"]),
            Fraction(3, 4),
        )
        self.assertFalse(one_direction["unshifted_transverse_substituted"])

        payload = self._payload()
        mutated = payload["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_one_direction"
        ]
        strict = mutated["strict_floor_2"]
        strict["transverse_C_beta"] = R(4)
        strict["schur_reserve"] = copy.deepcopy(
            mutated["unshifted_transverse_wrong_reserve"]
        )
        mutated["unshifted_transverse_substituted"] = True
        self._reject(payload, "shifted_odd_and_positive_excess")

    def test_source_lock_hash_and_dependency_inventory(self) -> None:
        lock = ROOT / producer.LOCK
        self.assertEqual(
            hashlib.sha256(lock.read_bytes()).hexdigest(),
            verifier.EXPECTED_SOURCE_LOCK_SHA256,
        )
        self.assertEqual(
            set(self.base["source_lock"]["dependency_hashes"]),
            verifier.EXPECTED_DEPENDENCY_PATHS,
        )

    def test_shared_library_limitation_serialized(self) -> None:
        libraries = self.base["arithmetic_libraries"]
        self.assertTrue(libraries["shared_library_with_verifier"])
        self.assertIn("mpmath.iv", libraries["independence_limitation"])

    def test_source_convention_mutations_rejected(self) -> None:
        mutations = {
            "source_interval": "[-log(lambda),log(lambda)]",
            "physical_interval": "[-lambda,lambda]",
            "fourier_sign": "fhat(t)=integral f(x)*exp(+i*t*x)dx",
            "inversion": "inversion reflection dropped",
            "prime_endpoint": "prime powers n<=lambda only",
            "prime_sign": "m_lambda=2*theta_prime+2*prime_sum",
            "pole_signs": "both poles positive",
            "source_gram": "C^*C replaced by identity",
        }
        for key, value in mutations.items():
            with self.subTest(key=key):
                payload = self._payload()
                payload["source_conventions"]["locked_conventions"][key] = value
                self._reject(payload, "source conventions")

    def test_all_admission_promotions_rejected(self) -> None:
        for key in self.base["claim_boundary"]["source_admissions"]:
            with self.subTest(key=key):
                payload = self._payload()
                payload["claim_boundary"]["source_admissions"][key] = True
                self._reject(payload, "claim boundary")

    def test_unit_normalization_promotion_rejected(self) -> None:
        payload = self._payload()
        payload["claim_boundary"]["source_admissions"][
            "unit_source_normalization_substituted"
        ] = True
        self._reject(payload)

    def test_weighted_one_state_promotion_rejected(self) -> None:
        payload = self._payload()
        payload["certificate"]["cap_free_weighted_capture"][
            "central_band_necessity_fixture"
        ]["one_state_estimate_promoted_to_trace"] = True
        self._reject(payload, "cap_free_weighted_capture")

    def test_source_gram_identity_substitution_rejected(self) -> None:
        payload = self._payload()
        payload["certificate"]["exact_coframe_loss"]["source_gram_C_star_C"] = [
            [R(1), R(0)], [R(0), R(1)]
        ]
        self._reject(payload, "exact_coframe_loss")

    def test_dropping_chi_rejected(self) -> None:
        payload = self._payload()
        case = payload["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_beta_one_nonzero_chi"
        ]
        case["chi_beta"] = R(0)
        case["load_from_chord_identity"] = copy.deepcopy(case["load_if_chi_omitted"])
        self._reject(payload, "shifted_odd_and_positive_excess")

    def test_unshifted_floor_substitution_rejected(self) -> None:
        payload = self._payload()
        shifted = payload["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_beta_one_nonzero_chi"
        ]
        unshifted = payload["certificate"]["shifted_odd_and_positive_excess"][
            "unshifted_beta_zero_nonzero_chi"
        ]
        shifted["M_beta_inverse"] = copy.deepcopy(unshifted["M_beta_inverse"])
        self._reject(payload, "shifted_odd_and_positive_excess")

    def test_nonpositive_floor_cannot_be_reported_as_pass(self) -> None:
        payload = self._payload()
        rejected = payload["certificate"]["shifted_odd_and_positive_excess"][
            "shifted_one_direction"
        ]["rejected_floor_5_over_2"]
        rejected["strict_pass"] = True
        self._reject(payload, "shifted_odd_and_positive_excess")

    def test_exact_coframe_fixture_cannot_be_promoted(self) -> None:
        payload = self._payload()
        payload["certificate"]["exact_coframe_loss"][
            "exact_coframe_on_physical_family_claimed"
        ] = True
        self._reject(payload, "exact_coframe_loss")

    def test_interval_probe_cannot_be_promoted(self) -> None:
        payload = self._payload()
        payload["certificate"]["transcendental_intervals"][
            "physical_capture_or_coframe_estimate_claimed"
        ] = True
        self._reject(payload, "interval probe")

    def test_interval_reversal_and_excess_width_rejected(self) -> None:
        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"][
            "physical_length_L"
        ]
        interval["dyadic"]["lower"], interval["dyadic"]["upper"] = (
            interval["dyadic"]["upper"],
            interval["dyadic"]["lower"],
        )
        interval["decimal"][0], interval["decimal"][1] = (
            interval["decimal"][1],
            interval["decimal"][0],
        )
        self._reject(payload, "reversed")

        payload = self._payload()
        interval = payload["certificate"]["transcendental_intervals"]["values"][
            "physical_length_L"
        ]
        interval["dyadic"]["lower"] = [0, "0", 0, 0]
        interval["dyadic"]["upper"] = [0, "8", 0, 4]
        interval["decimal"] = ["0.0", "8.0"]
        self._reject(payload)

    def test_binary64_and_duplicate_json_rejected(self) -> None:
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier._strict_json_loads('{"x": 0.5}', "binary64 fixture")
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier._strict_json_loads('{"x": 1, "x": 2}', "duplicate fixture")

    def test_noncanonical_inputs_rejected(self) -> None:
        for p, dps in (("05", "80"), ("5.0", "80"), ("4", "80"), ("5", "080"), ("5", "49")):
            with self.subTest(p=p, dps=dps):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(p, dps)

    def test_input_caps_are_enforced_before_interval_arithmetic(self) -> None:
        huge_numerator = "9" * 10_000
        cap_pattern = r"(?i)(maximum|at most|too long|above maximum)"
        for p, dps in ((huge_numerator, "80"), ("5", "1001")):
            with self.subTest(path="producer", p_length=len(p), dps=dps):
                with mock.patch.object(
                    producer,
                    "_interval_probes",
                    side_effect=AssertionError("interval arithmetic reached"),
                ) as interval_probes:
                    with self.assertRaisesRegex((TypeError, ValueError), cap_pattern):
                        producer.produce(p, dps)
                    interval_probes.assert_not_called()

            with self.subTest(path="verifier", p_length=len(p), dps=dps):
                payload = self._payload()
                payload["inputs"]["lambda_numerator_text"] = p
                payload["inputs"]["dps_text"] = dps
                with mock.patch.object(
                    verifier,
                    "_interval_targets",
                    side_effect=AssertionError("interval arithmetic reached"),
                ) as interval_targets:
                    with self.assertRaisesRegex(verifier.ReplayError, cap_pattern):
                        self._replay(payload)
                    interval_targets.assert_not_called()

    def test_pinned_mpmath_runtime_mismatch_fails_before_intervals(self) -> None:
        version_pattern = r"(?i)(mpmath|runtime|version)"
        with (
            mock.patch.object(producer.mp, "__version__", "0.0.0"),
            mock.patch.object(
                producer,
                "_interval_probes",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as interval_probes,
        ):
            with self.assertRaisesRegex((ValueError, RuntimeError), version_pattern):
                producer.produce("5", "80")
            interval_probes.assert_not_called()

        with (
            mock.patch.object(verifier.mp, "__version__", "0.0.0"),
            mock.patch.object(
                verifier,
                "_interval_targets",
                side_effect=AssertionError("interval arithmetic reached"),
            ) as interval_targets,
        ):
            with self.assertRaisesRegex(verifier.ReplayError, version_pattern):
                self._replay(self._payload())
            interval_targets.assert_not_called()

    def test_producer_bytes_are_bound(self) -> None:
        payload = self._payload()
        altered_bytes = self._bytes(payload) + b" "
        with self.assertRaises(verifier.ReplayError):
            verifier.replay(payload, producer_bytes=altered_bytes)

    def test_terminal_state_and_claim_class_cannot_change(self) -> None:
        payload = self._payload()
        payload["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        self._reject(payload, "terminal state")
        payload = self._payload()
        payload["claim_boundary"]["claim_class"] = "CERTIFIED"
        self._reject(payload, "claim boundary")

    def test_producer_and_verifier_read_no_environment(self) -> None:
        paths = (
            ROOT / "src" / "physical_defect_adjoint_tail.py",
            ROOT / "verifier" / "physical_defect_adjoint_tail_replay.py",
        )
        for path in paths:
            with self.subTest(path=path.relative_to(ROOT).as_posix()):
                findings = secret_ast_findings(path.read_text(encoding="utf-8"))
                self.assertEqual(findings, (set(), set()))

        ordinary_strings = '''
NOTICE = "os dotenv environ getenv are ordinary words here"
def describe() -> str:
    return "do not read environment variables"
'''
        self.assertEqual(secret_ast_findings(ordinary_strings), (set(), set()))
        forbidden_syntax = (
            "import os",
            "from dotenv import load_dotenv",
            "value = environ",
            "value = client.getenv('NAME')",
        )
        for source in forbidden_syntax:
            with self.subTest(forbidden_source=source):
                self.assertNotEqual(secret_ast_findings(source), (set(), set()))

    def test_verifier_imports_no_producer(self) -> None:
        source = (ROOT / "verifier" / "physical_defect_adjoint_tail_replay.py").read_text(
            encoding="utf-8"
        )
        tree = ast.parse(source)
        imported = {
            alias.name
            for node in ast.walk(tree)
            if isinstance(node, ast.Import)
            for alias in node.names
        }
        imported.update(
            node.module
            for node in ast.walk(tree)
            if isinstance(node, ast.ImportFrom) and node.module
        )
        self.assertNotIn("physical_defect_adjoint_tail", imported)

    def test_live_lock_mutation_is_detected_before_replay(self) -> None:
        with mock.patch.object(
            verifier,
            "EXPECTED_SOURCE_LOCK_SHA256",
            "0" * 64,
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "source-lock hash"):
                self._replay(self._payload())


if __name__ == "__main__":
    unittest.main()
