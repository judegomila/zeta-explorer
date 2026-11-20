from __future__ import annotations

import copy
from fractions import Fraction
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

from prufer_same_parity_gap import (  # noqa: E402
    _serialize_interval,
    canonical_report,
    evaluate_gap_bound,
    exact_c0_oracles,
    require_locked_formulas,
)
from prufer_same_parity_gap_replay import replay_artifact  # noqa: E402


class PruferSameParityGapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 100

    def artifact(self, dps: int = 80) -> dict[str, object]:
        return json.loads(json.dumps(canonical_report(dps)))

    @staticmethod
    def dyadic_value(endpoint: dict[str, object]) -> Fraction:
        sign = endpoint["sign"]
        mantissa = int(endpoint["mantissa_decimal_text"])
        exponent = endpoint["binary_exponent"]
        value = Fraction(mantissa)
        if exponent >= 0:
            value *= 2**exponent
        else:
            value /= 2 ** (-exponent)
        return -value if sign else value

    def exact_interval(self, value: dict[str, object]) -> tuple[Fraction, Fraction]:
        return (
            self.dyadic_value(value["lower_exact_dyadic"]),
            self.dyadic_value(value["upper_exact_dyadic"]),
        )

    def test_exact_c0_legendre_oracles(self) -> None:
        rows = exact_c0_oracles(4)
        self.assertEqual(
            [row["mu_m_at_c0"] for row in rows], [0, 2, 6, 12, 20]
        )
        self.assertEqual(
            [row["phase_derivative_at_mu_m"] for row in rows],
            [mp.mpf(1), mp.mpf(1) / 3, mp.mpf(4) / 5,
             mp.mpf(4) / 63, mp.mpf(64) / 81],
        )

    def test_exact_half_line_norm_oracle(self) -> None:
        rows = exact_c0_oracles(4)
        self.assertEqual(
            [row["half_line_L2_norm_squared"] for row in rows],
            [1, mp.mpf(1) / 3, mp.mpf(1) / 5,
             mp.mpf(1) / 7, mp.mpf(1) / 9],
        )

    def test_c0_lifted_phase_axis_oracle(self) -> None:
        rows = exact_c0_oracles(4)
        self.assertEqual(
            [row["lifted_phase_in_units_of_pi"] for row in rows],
            [0, mp.mpf(1) / 2, 1, mp.mpf(3) / 2, 2],
        )

    def test_same_parity_index_is_n_plus_two_r(self) -> None:
        report = evaluate_gap_bound("3/2", 3, 2, 80)
        self.assertEqual(report["j"], 7)
        self.assertEqual(report["j"] - report["n"], 2 * report["r"])

    def test_canonical_bound_remains_strictly_positive(self) -> None:
        interval = canonical_report(80)["outward_intervals"]["gap_lower_bound"]
        lower, upper = self.exact_interval(interval)
        self.assertGreater(lower, 0)
        self.assertLess(upper, Fraction(1, 10**100))

    def test_large_c_serialized_bound_does_not_underflow(self) -> None:
        evaluation = evaluate_gap_bound("100", 0, 2, 80)
        serialized = _serialize_interval(
            evaluation["intervals"]["gap_lower_bound"], 92
        )
        lower, upper = self.exact_interval(serialized)
        self.assertGreater(lower, 0)
        self.assertGreaterEqual(upper, lower)
        self.assertLess(
            serialized["lower_exact_dyadic"]["binary_exponent"], -100000
        )

    def test_zero_bandwidth_bound_uses_exact_legendre_scale(self) -> None:
        evaluation = evaluate_gap_bound("0", 0, 2, 80)
        K_squared = evaluation["intervals"]["K_squared"]
        self.assertLessEqual(K_squared.lower, 20)
        self.assertGreaterEqual(K_squared.upper, 20)
        self.assertEqual(exact_c0_oracles(4)[4]["mu_m_at_c0"], 20)

    def test_doubled_precision_intervals_overlap(self) -> None:
        low = canonical_report(80)["outward_intervals"]
        high = canonical_report(160)["outward_intervals"]
        for key in low:
            with self.subTest(key=key):
                low_lower, low_upper = self.exact_interval(low[key])
                high_lower, high_upper = self.exact_interval(high[key])
                self.assertLessEqual(
                    max(low_lower, high_lower), min(low_upper, high_upper)
                )

    def test_rejects_binary64_lambda(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            evaluate_gap_bound(2.0, 0, 2, 80)  # type: ignore[arg-type]

    def test_rejects_nonintegral_or_bool_indices(self) -> None:
        with self.assertRaisesRegex(TypeError, "exact integer"):
            evaluate_gap_bound("2", True, 2, 80)  # type: ignore[arg-type]
        with self.assertRaisesRegex(ValueError, "at least 1"):
            evaluate_gap_bound("2", 0, 0, 80)

    def test_locked_safe_K_contains_two_c_squared(self) -> None:
        with self.assertRaisesRegex(ValueError, "safe K squared"):
            evaluate_gap_bound(
                "2", 0, 2, 80,
                K_squared="max(1,c^2+j*(j+1))",
            )

    def test_locked_gap_rejects_wrong_exponent(self) -> None:
        with self.assertRaisesRegex(ValueError, "gap"):
            evaluate_gap_bound(
                "2", 0, 2, 80,
                gap="(16*r*pi/(225*K^2))*exp(-pi*K)",
            )

    def test_locked_gap_rejects_wrong_prefactor(self) -> None:
        with self.assertRaisesRegex(ValueError, "gap"):
            evaluate_gap_bound(
                "2", 0, 2, 80,
                gap="(8*r*pi/(225*K^2))*exp(-2*pi*K)",
            )

    def test_locked_phase_rejects_principal_argument(self) -> None:
        with self.assertRaisesRegex(ValueError, "lifted phase"):
            require_locked_formulas(phase="principal_arg(u(0)+i*u'(0))")

    def test_locked_phase_target_rejects_m_pi(self) -> None:
        with self.assertRaisesRegex(ValueError, "phase target"):
            require_locked_formulas(phase_target="phi(mu_m)=m*pi")

    def test_locked_operator_rejects_sign_change(self) -> None:
        with self.assertRaisesRegex(ValueError, "operator"):
            require_locked_formulas(
                operator="+d/dx((1-x^2)*dy/dx)+c^2*x^2*y=mu*y"
            )

    def test_locked_endpoint_normalization_rejects_unit_norm(self) -> None:
        with self.assertRaisesRegex(ValueError, "endpoint normalization"):
            require_locked_formulas(endpoint_normalization="integral_-1^1|y|^2=1")

    def test_differential_eigenvalue_is_mu_not_chi(self) -> None:
        with self.assertRaisesRegex(ValueError, "differential eigenvalue symbol"):
            require_locked_formulas(differential_symbol="chi")

    def test_independent_replay(self) -> None:
        result = replay_artifact(self.artifact(), 100)
        self.assertTrue(result["exact_dyadic_endpoint_parse_pass"])
        self.assertTrue(result["all_interval_containments_pass"])
        self.assertTrue(result["exact_c0_legendre_oracles_pass"])
        self.assertFalse(result["numerical_sturm_solver_used"])
        self.assertFalse(result["growing_window_conditioning_proved"])

    def test_verifier_imports_no_producer_module(self) -> None:
        text = (ROOT / "verifier/prufer_same_parity_gap_replay.py").read_text()
        self.assertNotIn("from prufer_same_parity_gap import", text)
        self.assertNotIn("import prufer_same_parity_gap", text)

    def test_replay_rejects_terminal_promotion(self) -> None:
        artifact = self.artifact()
        artifact["terminal_state"] = "P0_EXACT_FORMULAS_PASS"
        with self.assertRaisesRegex(ValueError, "terminal state"):
            replay_artifact(artifact)

    def test_replay_rejects_cached_bound_tamper(self) -> None:
        artifact = self.artifact()
        unit = {
            "sign": 0,
            "mantissa_decimal_text": "1",
            "binary_exponent": 0,
        }
        artifact["outward_intervals"]["gap_lower_bound"] = {
            "endpoint_format": "signed_mantissa_times_2_power_v1",
            "lower_exact_dyadic": copy.deepcopy(unit),
            "upper_exact_dyadic": copy.deepcopy(unit),
            "decimal_display_only": ["1", "1"],
        }
        with self.assertRaisesRegex(ValueError, "gap_lower_bound"):
            replay_artifact(artifact)

    def test_replay_does_not_trust_decimal_display(self) -> None:
        artifact = self.artifact()
        artifact["outward_intervals"]["gap_lower_bound"][
            "decimal_display_only"
        ] = ["1", "1"]
        self.assertTrue(replay_artifact(artifact)["all_interval_containments_pass"])

    def test_replay_rejects_numeric_dyadic_mantissa(self) -> None:
        artifact = self.artifact()
        artifact["outward_intervals"]["gap_lower_bound"][
            "lower_exact_dyadic"
        ]["mantissa_decimal_text"] = 1.0
        with self.assertRaisesRegex(TypeError, "mantissa"):
            replay_artifact(artifact)

    def test_replay_rejects_binary64_exact_input(self) -> None:
        artifact = self.artifact()
        artifact["exact_input"]["lambda_rational_text"] = 2.0
        with self.assertRaisesRegex(ValueError, "exact .* input"):
            replay_artifact(artifact)

    def test_replay_rejects_wrong_same_parity_index(self) -> None:
        artifact = self.artifact()
        artifact["exact_input"]["j_integer"] = 5
        with self.assertRaisesRegex(ValueError, "exact .* input"):
            replay_artifact(artifact)

    def test_replay_rejects_c0_oracle_tamper(self) -> None:
        artifact = self.artifact()
        artifact["c0_legendre_oracles"][4]["phase_derivative_at_mu_m"] = "1"
        with self.assertRaisesRegex(ValueError, "Legendre oracle"):
            replay_artifact(artifact)

    def test_replay_rejects_formula_tamper(self) -> None:
        artifact = self.artifact()
        artifact["locked_formulas"]["K_squared"] = "max(1,c^2+j*(j+1))"
        with self.assertRaisesRegex(ValueError, "formula"):
            replay_artifact(artifact)

    def test_replay_rejects_proof_constant_tamper(self) -> None:
        artifact = self.artifact()
        artifact["proof_constants_exact"]["center_Cauchy_lower_coefficient"] = "32/225"
        with self.assertRaisesRegex(ValueError, "proof constant"):
            replay_artifact(artifact)

    def test_replay_rejects_claim_promotion(self) -> None:
        artifact = self.artifact()
        artifact["theorem_flags"]["growing_window_conditioning_proved"] = True
        with self.assertRaisesRegex(ValueError, "flags"):
            replay_artifact(artifact)

    def test_replay_rejects_cached_eigenvalue_injection(self) -> None:
        artifact = self.artifact()
        artifact["actual_prolate_eigenvalue_gap"] = "190.47"
        with self.assertRaisesRegex(ValueError, "cached numerical"):
            replay_artifact(artifact)

    def test_replay_rejects_provenance_tamper(self) -> None:
        artifact = self.artifact()
        artifact["provenance_sha256"]["src/prufer_same_parity_gap.py"] = "0" * 64
        with self.assertRaisesRegex(ValueError, "provenance"):
            replay_artifact(artifact)


if __name__ == "__main__":
    unittest.main()
