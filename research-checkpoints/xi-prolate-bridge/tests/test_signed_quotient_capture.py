from __future__ import annotations

import ast
import copy
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

import signed_quotient_capture as producer  # noqa: E402
from verifier import signed_quotient_capture_replay as verifier  # noqa: E402


class SignedQuotientCaptureTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

    def _replay(self, payload: dict[str, object]) -> dict[str, object]:
        raw = self._bytes(payload)
        return verifier.replay(payload, producer_bytes=raw)

    def _reject(self, payload: dict[str, object], pattern: str | None = None) -> None:
        context = (
            self.assertRaisesRegex(verifier.ReplayError, pattern)
            if pattern is not None
            else self.assertRaises(verifier.ReplayError)
        )
        with context:
            self._replay(payload)

    @staticmethod
    def _interval_width(payload: dict[str, object]) -> object:
        interval = payload["certificate"]["transition_ceiling_argument"]
        dps = payload["input"]["interval_decimal_digits"]
        lower = verifier._raw_endpoint(interval["dyadic"]["lower"], "lower", dps)
        upper = verifier._raw_endpoint(interval["dyadic"]["upper"], "upper", dps)
        return upper - lower

    def test_p5_p7_replay_at_base_and_doubled_precision(self) -> None:
        expected = {
            5: {"N": 7, "q": 5, "n_star": 36, "r_plus": 7, "r_minus": 8},
            7: {"N": 13, "q": 5, "n_star": 60, "r_plus": 13, "r_minus": 14},
        }
        for p, oracle in expected.items():
            low = producer.produce(p, 80)
            high = producer.produce(p, 160)
            self.assertEqual(self._bytes(low), self._bytes(producer.produce(p, 80)))
            for payload in (low, high):
                raw = self._bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                self.assertEqual(
                    report["status"], "SIGNED_QUOTIENT_CAPTURE_COMPONENT_REPLAY_PASS"
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"], hashlib.sha256(raw).hexdigest()
                )
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                self.assertFalse(
                    report["claim_boundary"][
                        "matched_bandwidth_projected_anchor_nonzero"
                    ]
                )
                self.assertFalse(
                    report["claim_boundary"]["positive_physical_high_floor"]
                )
                exact = payload["certificate"]["exact_schedule"]
                self.assertEqual(exact["N"], oracle["N"])
                self.assertEqual(exact["q"], oracle["q"])
                self.assertEqual(exact["n_star"], oracle["n_star"])
                self.assertEqual(exact["r_plus_buffered"], oracle["r_plus"])
                self.assertEqual(exact["r_minus_buffered"], oracle["r_minus"])
                self.assertTrue(exact["projected_anchor_nonzero_hypothesis_required"])
                self.assertFalse(exact["projected_anchor_nonzero_proved"])
                self.assertEqual(
                    exact["ambient_even_complement_dimension_if_anchor_nonzero"],
                    oracle["N"],
                )
                self.assertTrue(
                    exact["even_target_count_meets_dimension_if_anchor_nonzero"]
                )
                self.assertTrue(exact["odd_target_count_exceeds_dimension"])
                self.assertFalse(exact["coframe_proved"])
                self.assertEqual(payload["arithmetic"]["library"], "mpmath.iv 1.4.1")
            self.assertLessEqual(self._interval_width(high), self._interval_width(low))

    def test_exact_quotient_cross_and_shift_models(self) -> None:
        regressions = producer.produce(5, 80)["certificate"]["exact_regressions"]
        quotient = regressions["noninjective_quotient_saturation"]
        self.assertEqual(
            quotient["P0"],
            [
                [producer._rational(producer.Fraction(1, 2)), producer._rational(producer.Fraction(0)), producer._rational(producer.Fraction(1, 2))],
                [producer._rational(producer.Fraction(0)), producer._rational(producer.Fraction(1)), producer._rational(producer.Fraction(0))],
                [producer._rational(producer.Fraction(1, 2)), producer._rational(producer.Fraction(0)), producer._rational(producer.Fraction(1, 2))],
            ],
        )
        self.assertEqual(quotient["P0_A_star_B_A_P0"], quotient["P0"])

        cross = regressions["cross_identity_and_shift_cancellation"]
        expected_row = [
            {"numerator": "10", "denominator": "1"},
            {"numerator": "21", "denominator": "1"},
        ]
        self.assertEqual(cross["P_H_B_P_K_Delta_inverse_half"], [expected_row])
        self.assertEqual(cross["P_H_B_A"], [expected_row])
        self.assertEqual(cross["P_H_Q_A"], [expected_row])
        self.assertEqual(cross["norm_squared"], {"numerator": "541", "denominator": "1"})

        erosion = regressions["shift_erosion_saturation"]
        self.assertEqual(
            erosion["normalized_shifted"],
            [
                [{"numerator": "26", "denominator": "3"}, {"numerator": "0", "denominator": "1"}],
                [{"numerator": "0", "denominator": "1"}, {"numerator": "7", "denominator": "1"}],
            ],
        )
        self.assertEqual(erosion["eroded_floor"], {"numerator": "7", "denominator": "1"})
        self._replay(producer.produce(5, 80))

    def test_exact_capture_cross_sign_and_ridge_models(self) -> None:
        regressions = producer.produce(5, 80)["certificate"]["exact_regressions"]
        capture = regressions["rank_conditioning_capture_obstruction"]
        self.assertEqual(capture["dangerous_rank"], 1)
        self.assertEqual(capture["physical_dimension"], 2)
        self.assertEqual(capture["s_squared"], {"numerator": "16", "denominator": "25"})
        self.assertEqual(capture["rotated_extreme_s_squared"], {"numerator": "1", "denominator": "1"})

        cross = regressions["exact_capture_cross_obstruction"]
        self.assertEqual(cross["high_compression"], {"numerator": "11", "denominator": "1"})
        self.assertEqual(cross["cross_norm_squared"], {"numerator": "36", "denominator": "1"})
        self.assertEqual(cross["low_floor_times_high_floor"], {"numerator": "22", "denominator": "1"})
        self.assertEqual(cross["low_schur_complement"][0][0], {"numerator": "-3", "denominator": "11"})
        self.assertEqual(cross["determinant"], {"numerator": "-6", "denominator": "1"})

        signed = regressions["signed_sampling_obstruction"]
        self.assertEqual(signed["positive_gram"], {"numerator": "2", "denominator": "1"})
        self.assertEqual(signed["signed_form"], {"numerator": "-2", "denominator": "1"})
        reserve = regressions["strict_cross_reserve_equality_obstruction"]
        self.assertEqual(reserve["chi_squared"], reserve["mu"])
        self.assertEqual(reserve["chi_squared"], reserve["eta"])
        self.assertFalse(reserve["strict_reserve_holds"])

        ridge = regressions["ridge_capture_majorant"]
        self.assertEqual(ridge["F_at_residual_eigenvalue"], {"numerator": "9", "denominator": "8"})
        self.assertEqual(ridge["captured_trace"], {"numerator": "81", "denominator": "200"})
        self.assertEqual(ridge["leakage_score"], {"numerator": "18", "denominator": "25"})
        self.assertTrue(ridge["capture_bound_holds"])
        self._replay(producer.produce(5, 80))

    def test_producer_and_reconstructor_reject_nonexact_or_off_schedule_inputs(self) -> None:
        for value in (True, 5.0, 4, 3):
            with self.subTest(value=value, path="producer"):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value, 80)  # type: ignore[arg-type]
            with self.subTest(value=value, path="verifier"):
                with self.assertRaises(verifier.ReplayError):
                    verifier.reconstruct(value, 80)  # type: ignore[arg-type]
        for value in (False, 80.0, 49):
            with self.subTest(value=value, parameter="dps"):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, value)  # type: ignore[arg-type]

    def test_exact_bytes_duplicate_keys_and_binary64_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)
        changed = copy.deepcopy(payload)
        changed["input"]["lambda_numerator"] = 7
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(changed, producer_bytes=raw)
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(b'{"p":5,"p":7}', "adversarial")
        payload["input"]["lambda_numerator"] = 5.0
        self._reject(payload, "binary64|non-integer JSON number")

    def test_schedule_mutations_are_reconstructed(self) -> None:
        for field, value in (
            ("N", 8),
            ("q", 6),
            ("n_star", 37),
            ("r_plus_buffered", 8),
            ("r_minus_buffered", 7),
            ("ambient_even_complement_dimension_if_anchor_nonzero", 8),
        ):
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_schedule"][field] = value
            with self.subTest(field=field):
                self._reject(payload, "schedule reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_schedule"]["lambda"] = {
            "numerator": "25",
            "denominator": "4",
        }
        self._reject(payload, "schedule reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_schedule"]["coframe_proved"] = True
        self._reject(payload, "schedule reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_schedule"]["projected_anchor_nonzero_proved"] = True
        self._reject(payload, "schedule reconstruction")

    def test_mandatory_convention_and_claim_failures_are_rejected(self) -> None:
        convention_mutations = {
            "source_interval": "[-log(lambda),log(lambda)] with Lebesgue measure and zero extension",
            "physical_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
            "fourier_sign": "fhat(t)=integral f(y)*exp(+i*t*y) dy",
            "prime_endpoint": "prime powers n<lambda^2 only",
            "prime_sign": "m_lambda=2*theta_prime+2*sum Lambda(n)/sqrt(n)*cos(t*log(n))",
            "inversion": "reflection dropped",
            "matched_schedule": "lambda and lambda^2 are interchangeable",
            "matched_even_count_scope": "projected-anchor nonvanishing assumed silently",
        }
        for field, value in convention_mutations.items():
            payload = producer.produce(5, 80)
            payload["locked_conventions"][field] = value
            with self.subTest(field=field):
                self._reject(payload, "locked_conventions")

        promotion_fields = (
            "binary64_parameters_used",
            "cached_weil_matrix_read",
            "cached_dangerous_eigenvectors_read",
            "zeta_zero_table_read",
            "zeros_assumed_real",
            "global_weil_positivity_assumed",
            "nonpositive_complementary_gap_reported_as_pass",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
            "projected_anchor_nonzero_at_matched_bandwidth_claimed",
            "signed_low_comparison_claimed",
            "strict_cross_reserve_claimed",
            "physical_coframe_claimed",
            "signed_sector_floor_claimed",
            "equation_5_2_claimed",
            "determinant_limit_claimed",
            "rh_proved",
        )
        for field in promotion_fields:
            payload = producer.produce(5, 80)
            payload["source_admissions"][field] = True
            with self.subTest(field=field):
                self._reject(payload, "source_admissions")

        payload = producer.produce(5, 80)
        payload["source_admissions"]["inversion_reflection_retained"] = False
        self._reject(payload, "source_admissions")

        payload = producer.produce(5, 80)
        payload["claim_scope"]["proved"].append("equation (5.2) of DIRECT_RH_ATTACK.md")
        self._reject(payload, "claim_scope")

        payload = producer.produce(5, 80)
        payload["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        self._reject(payload, "terminal_state")

    def test_regression_mutations_are_reconstructed_not_trusted(self) -> None:
        changes = (
            ("noninjective_quotient_saturation", "mu", "2"),
            ("cross_identity_and_shift_cancellation", "norm_squared", "542"),
            ("shift_erosion_saturation", "eroded_floor", "8"),
            ("rank_conditioning_capture_obstruction", "s_squared", "17"),
            ("exact_capture_cross_obstruction", "determinant", "-5"),
            ("signed_sampling_obstruction", "signed_form", "2"),
            ("ridge_capture_majorant", "leakage_score", "19"),
        )
        for section, field, numerator in changes:
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_regressions"][section][field]["numerator"] = numerator
            with self.subTest(section=section, field=field):
                self._reject(payload, "regression reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["strict_cross_reserve_equality_obstruction"]["strict_reserve_holds"] = True
        self._reject(payload, "regression reconstruction")

    def test_raw_dyadic_overwide_noncanonical_and_non_enclosing_intervals_rejected(self) -> None:
        payload = producer.produce(5, 80)
        endpoint = payload["certificate"]["transition_ceiling_argument"]["dyadic"]["upper"]
        endpoint[3] += 1
        self._reject(payload, "bit count")

        payload = producer.produce(5, 80)
        interval = payload["certificate"]["transition_ceiling_argument"]
        interval["dyadic"] = {
            "lower": [0, "0", 0, 0],
            "upper": [0, "1", 20, 1],
        }
        interval["decimal"] = ["0.0", "1048576.0"]
        self._reject(payload, "precision-tight|transition ceiling")

        payload = producer.produce(5, 80)
        interval = payload["certificate"]["transition_ceiling_argument"]
        interval["dyadic"] = {
            "lower": [0, "0", 0, 0],
            "upper": [0, "0", 0, 0],
        }
        interval["decimal"] = ["0.0", "0.0"]
        self._reject(payload, "does not enclose")

        payload = producer.produce(5, 80)
        interval = payload["certificate"]["transition_ceiling_argument"]
        decimal = interval["decimal"][0]
        interval["decimal"][0] = decimal[:-1] + ("1" if decimal[-1] != "1" else "2")
        self._reject(payload, "decimal text")

        payload = producer.produce(5, 80)
        interval = payload["certificate"]["transition_ceiling_argument"]
        interval["dyadic"]["upper"][2] = 100000
        self._reject(payload, "exponent budget")

    def test_source_hashes_are_rehashed_and_declared_exactly(self) -> None:
        payload = producer.produce(5, 80)
        payload["source_hashes"][producer.NOTE] = "0" * 64
        self._reject(payload, "source-hash inventory")

        payload = producer.produce(5, 80)
        with mock.patch.dict(
            verifier.PINNED_HASHES, {verifier.NOTE: "0" * 64}, clear=False
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "source byte hash"):
                self._replay(payload)

    def test_verifier_imports_neither_producer_nor_project_helpers(self) -> None:
        source = (ROOT / "verifier/signed_quotient_capture_replay.py").read_text(
            encoding="utf-8"
        )
        tree = ast.parse(source)
        modules: list[str] = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                modules.extend(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                modules.append(node.module)
        self.assertNotIn("signed_quotient_capture", modules)
        forbidden = {
            "quotient_exterior_preconditioner",
            "block_quotient_action",
            "compressed_multiplier_trace",
            "weil_matrix",
        }
        self.assertTrue(forbidden.isdisjoint(modules))


if __name__ == "__main__":
    unittest.main()
