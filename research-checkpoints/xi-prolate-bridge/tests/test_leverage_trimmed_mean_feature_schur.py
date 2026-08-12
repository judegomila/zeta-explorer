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
sys.path.insert(0, str(ROOT / "src"))

import leverage_trimmed_mean_feature_schur as producer  # noqa: E402
from verifier import leverage_trimmed_mean_feature_schur_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


class LeverageTrimmedMeanFeatureSchurTests(unittest.TestCase):
    @staticmethod
    def _bytes(payload: dict[str, object]) -> bytes:
        return (json.dumps(payload, indent=2, sort_keys=True) + "\n").encode("utf-8")

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

    @staticmethod
    def _regressions() -> dict[str, object]:
        return producer.produce(5, 80)["certificate"]["exact_regressions"]

    def test_p5_p7_exact_metadata_and_deterministic_serialization(self) -> None:
        for p, N in ((5, 7), (7, 13)):
            for dps in (80, 160):
                first = producer.produce(p, dps)
                second = producer.produce(p, dps)
                self.assertEqual(
                    json.dumps(first, indent=2, sort_keys=True),
                    json.dumps(second, indent=2, sort_keys=True),
                )
                self.assertEqual(first["terminal_state"], "P0_INVALIDATED")
                schedule = first["certificate"]["exact_schedule_metadata"]
                self.assertEqual(schedule["lambda"], R(p, 2))
                self.assertEqual(schedule["N"], N)
                self.assertIn("not a physical Weil pilot", schedule["model_scope"])

    def test_p5_p7_clean_room_replay_at_base_and_doubled_labels(self) -> None:
        for p in (5, 7):
            for dps in (80, 160):
                payload = producer.produce(p, dps)
                raw = self._bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                self.assertEqual(
                    report["result"],
                    "LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
                self.assertTrue(report["checks"]["exterior_volume_rebuilt_by_double_minors"])
                self.assertTrue(report["checks"]["trimmed_mean_rebuilt_from_stop_loss_dual"])
                self.assertTrue(report["checks"]["negative_round_trip_rebuilt_from_feature_resolvent"])
                self.assertFalse(report["producer_pass_boolean_trusted"])

    def test_exterior_trimmed_mean_direct_floor_and_odd_strictness(self) -> None:
        model = self._regressions()["exterior_trimmed_stop_loss"]
        self.assertEqual(model["rank"], 2)
        self.assertEqual(model["E_rank"], R(8))
        self.assertEqual(model["kappa_H_atoms"], [R(1), R(1), R(1), R(1)])
        self.assertEqual(model["appended_exterior_volumes"], [R(8)] * 4)
        self.assertEqual(model["atom_masses"], [R(1, 2)] * 4)
        self.assertEqual(model["total_mass"], R(2))
        self.assertEqual(model["ell_b"], R(1))
        self.assertEqual(model["ell_w"], R(1, 2))
        self.assertEqual(model["prime_second_moment"], R(1, 16))
        self.assertEqual(model["sqrt_prime_second_moment"], R(1, 4))
        self.assertEqual(model["stop_loss_g"], R(3, 2))
        self.assertEqual(model["stop_loss_V"], R(1))
        self.assertEqual(model["stop_loss_floor"], R(1, 2))
        strict, equality = model["pole_models"]
        self.assertEqual(strict["surcharge"], R(1, 8))
        self.assertEqual(strict["reserve"], R(3, 8))
        self.assertTrue(strict["strict_pass"])
        self.assertEqual(equality["surcharge"], R(1, 2))
        self.assertEqual(equality["reserve"], R(0))
        self.assertFalse(equality["strict_pass"])

    def test_selector_capacity_is_not_an_ordinary_mean(self) -> None:
        model = self._regressions()["exterior_trimmed_stop_loss"]
        weights = [Fraction(1, 2)] * 4
        values = [Fraction(-1, 2), Fraction(3, 2), Fraction(5), Fraction(6)]
        normalized_full_mean = sum((a * b for a, b in zip(weights, values)), Fraction(0)) / 2
        self.assertEqual(normalized_full_mean, Fraction(3))
        self.assertNotEqual(model["ell_w"], R(3))
        ell, allocation, threshold = producer._trimmed_mean(weights, values)
        self.assertEqual(ell, Fraction(1, 2))
        self.assertEqual(allocation, [Fraction(1, 2), Fraction(1, 2), 0, 0])
        self.assertEqual(threshold, Fraction(3, 2))
        with self.assertRaisesRegex(ValueError, "mass must be at least one"):
            producer._trimmed_mean([Fraction(1, 4)], [Fraction(0)])

    def test_singular_positive_short_uses_moore_penrose_and_feature_residual(self) -> None:
        model = self._regressions()["singular_positive_feature_short"]
        expected = [[R(1), R(1)], [R(1), R(2)]]
        self.assertEqual(model["rank_C_HH"], 1)
        self.assertEqual(model["C_HH"], [[R(4), R(0)], [R(0), R(0)]])
        self.assertEqual(
            model["C_HH_pseudoinverse"],
            [[R(1, 4), R(0)], [R(0), R(0)]],
        )
        self.assertEqual(model["short_from_blocks"], expected)
        self.assertEqual(model["short_from_features"], expected)
        raw = [[Fraction(4), Fraction(0)], [Fraction(0), Fraction(0)]]
        dagger = producer._pseudoinverse_psd(raw)
        self.assertEqual(dagger, [[Fraction(1, 4), 0], [0, 0]])
        self.assertEqual(producer._matmul(producer._matmul(raw, dagger), raw), raw)

    def test_nonunit_g_round_trip_neumann_tail_and_combined_floor(self) -> None:
        model = self._regressions()["negative_round_trip_and_tail"]
        self.assertEqual(model["g"], R(2))
        self.assertEqual(model["rho"], R(1))
        self.assertEqual(model["V_H"], R(5, 4))
        expected_load = [[R(2), R(0)], [R(0), R(8, 7)]]
        self.assertEqual(model["physical_round_trip_load"], expected_load)
        self.assertEqual(model["feature_round_trip_load"], expected_load)
        self.assertEqual(model["partial_sum_m2"], [[R(3, 2), R(0)], [R(0), R(9, 8)]])
        self.assertEqual(model["exact_tail_m2"], [[R(1, 2), R(0)], [R(0), R(1, 56)]])
        self.assertEqual(model["moment_tail_bound_m2"], [[R(1, 2), R(0)], [R(0), R(1, 32)]])
        self.assertEqual(model["exact_combined_floor"], [[R(1), R(1)], [R(1), R(20, 7)]])
        self.assertEqual(model["moment_certificate_floor"], [[R(1), R(1)], [R(1), R(91, 32)]])
        self.assertEqual(model["exact_floor_determinant"], R(13, 7))
        self.assertEqual(model["certificate_floor_determinant"], R(59, 32))
        self.assertEqual(model["trace_majorant"], [[R(8, 3), R(0)], [R(0), R(8, 3)]])
        self.assertEqual(model["norm_majorant"], [[R(2), R(0)], [R(0), R(2)]])

    def test_trace_norm_orientation_and_overshorting_boundaries(self) -> None:
        regressions = self._regressions()
        trace = regressions["trace_is_not_spectral_necessity"]
        self.assertEqual(trace["rho"], R(9, 16))
        self.assertEqual(trace["V_H"], R(9, 8))
        self.assertTrue(trace["spectral_inverse_exists"])
        self.assertFalse(trace["trace_test_passes"])

        orientation = regressions["oriented_load_countermodel"]
        self.assertEqual(orientation["shared_rho"], R(1, 4))
        self.assertEqual(orientation["shared_V_H"], R(1, 4))
        self.assertEqual(orientation["shared_R_KK"], R(1))
        self.assertEqual(orientation["aligned_effective_load"], R(4, 3))
        self.assertEqual(orientation["orthogonal_effective_load"], R(1))
        self.assertFalse(orientation["diagonal_data_determine_orientation"])

        over = regressions["over_shorting_countermodel"]
        self.assertEqual(over["determinant_B"], R(7))
        self.assertEqual(over["C_short"], R(0))
        self.assertEqual(over["fully_shorted_low"], R(-1))
        self.assertTrue(over["B_positive_definite"])
        self.assertFalse(over["fully_shorted_test_passes"])

    def test_normalized_coframe_tail_strict_boundary(self) -> None:
        model = self._regressions()["normalized_coframe_tail"]
        self.assertEqual(model["trace_L_F"], R(16, 25))
        self.assertEqual(model["frame_determinant"], R(9, 25))
        self.assertTrue(model["strict_trace_certificate_passes"])
        self.assertEqual(model["boundary_trace_L_F"], R(1))
        self.assertEqual(model["boundary_frame_determinant"], R(0))
        self.assertFalse(model["boundary_passes"])

    def test_mobius_divisor_convolution_reconstructs_only_first_target(self) -> None:
        model = self._regressions()["mobius_divisor_convolution"]
        self.assertEqual(model["mobius_values"], [1, -1, -1, 0, -1, 1])
        self.assertEqual(model["divisor_convolution_coefficients"], [1, 0, 0, 0, 0, 0])
        self.assertEqual(model["reconstructed_first_target"], R(2))
        self.assertEqual(model["visible_source_model"], [R(2), R(-1), R(0)])
        self.assertEqual(model["central_hole_correction_model"], [R(0), R(0), R(-2)])
        self.assertEqual(model["corrected_zero_integral_source_model"], [R(2), R(-1), R(-2)])
        self.assertEqual(model["physical_image_before_correction"], [R(2), R(1)])
        self.assertEqual(model["physical_image_after_correction"], [R(2), R(1)])
        self.assertFalse(model["central_hole_correction_changes_physical_image"])
        self.assertIn("oracle", model["scope"])

    def test_nonexact_and_off_schedule_inputs_are_rejected(self) -> None:
        for value in (True, 5.0, 4, 3):
            with self.subTest(value=value):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(value, 80)  # type: ignore[arg-type]
        for value in (False, 80.0, 49):
            with self.subTest(dps=value):
                with self.assertRaises((TypeError, ValueError)):
                    producer.produce(5, value)  # type: ignore[arg-type]

    def test_payload_contains_no_binary_floats(self) -> None:
        def visit(value: object) -> None:
            self.assertNotIsInstance(value, float)
            if isinstance(value, dict):
                for child in value.values():
                    visit(child)
            elif isinstance(value, list):
                for child in value:
                    visit(child)

        visit(producer.produce(5, 80))

    def test_source_hash_hook_rejects_unfinalized_pin(self) -> None:
        note = (ROOT / producer.NOTE).read_text(encoding="utf-8")
        self.assertIn("\\tfrac12", note)
        self.assertNotIn("\t", note)
        with mock.patch.object(
            producer,
            "PINNED_HASHES",
            {producer.NOTE: "TO_BE_FINALIZED", producer.LOCK: producer.PINNED_HASHES[producer.LOCK]},
        ):
            with self.assertRaisesRegex(ValueError, "unfinalized source hash"):
                producer._verified_source_hashes()

    def test_exact_bytes_duplicate_keys_binary64_and_noncanonical_rationals_rejected(self) -> None:
        payload = producer.produce(5, 80)
        raw = self._bytes(payload)
        with self.assertRaisesRegex(verifier.ReplayError, "exact producer artifact bytes"):
            verifier.replay(payload)

        changed = copy.deepcopy(payload)
        changed["input"]["lambda_numerator"] = 7
        with self.assertRaisesRegex(verifier.ReplayError, "do not decode exactly"):
            verifier.replay(changed, producer_bytes=raw)

        changed = producer.produce(5, 80)
        changed["input"]["lambda_numerator"] = 5.0
        self._reject(changed, "binary64|non-integer JSON number")

        with self.assertRaisesRegex(verifier.ReplayError, "duplicate JSON object key"):
            verifier._strict_json_loads(b'{"p":5,"p":7}', "adversarial")
        with self.assertRaisesRegex(verifier.ReplayError, "not reduced"):
            verifier._parse_rational({"numerator": "2", "denominator": "4"}, "bad")

    def test_schedule_and_locked_convention_mutations_are_rejected(self) -> None:
        for field, value in (("N", 8), ("N_rule", "floor(lambda^2)"), ("model_scope", "physical pilot")):
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_schedule_metadata"][field] = value
            with self.subTest(schedule=field):
                self._reject(payload, "certificate reconstruction")

        mutations = {
            "fourier_sign": "fhat(t)=integral f(y)*exp(+i*t*y) dy",
            "prime_endpoint": "prime powers n<lambda^2 only",
            "prime_sign": "m_lambda=2*theta_prime+2*S_lambda",
            "inversion": "reflection omitted",
            "source_normalization": "unit norm",
        }
        for field, value in mutations.items():
            payload = producer.produce(5, 80)
            payload["locked_conventions"][field] = value
            with self.subTest(convention=field):
                self._reject(payload, "locked_conventions")

    def test_every_regression_section_has_an_independent_tamper_rejection(self) -> None:
        changes = (
            ("exterior_trimmed_stop_loss", "E_rank", R(9)),
            ("singular_positive_feature_short", "rank_C_HH", 2),
            ("negative_round_trip_and_tail", "rho", R(2)),
            ("trace_is_not_spectral_necessity", "trace_test_passes", True),
            ("oriented_load_countermodel", "aligned_effective_load", R(1)),
            ("over_shorting_countermodel", "fully_shorted_test_passes", True),
            ("normalized_coframe_tail", "boundary_passes", True),
            ("mobius_divisor_convolution", "reconstructed_first_target", R(3)),
        )
        for section, field, value in changes:
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_regressions"][section][field] = value
            with self.subTest(section=section, field=field):
                self._reject(payload, "certificate reconstruction")

    def test_nonstrict_odd_pole_rho_tail_and_claim_promotions_are_rejected(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["exterior_trimmed_stop_loss"]["pole_models"][1]["strict_pass"] = True
        self._reject(payload, "certificate reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["negative_round_trip_and_tail"]["rho"] = R(2)
        self._reject(payload, "certificate reconstruction")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["negative_round_trip_and_tail"]["moment_tail_bound_m2"] = [[R(1, 4), R(0)], [R(0), R(1, 32)]]
        self._reject(payload, "certificate reconstruction")

        promotions = (
            "prime_power_endpoint_omitted",
            "prime_block_sign_changed",
            "inversion_reflection_dropped",
            "unit_source_normalization_substituted",
            "trimmed_selector_capacity_omitted",
            "odd_pole_surcharge_omitted",
            "nonstrict_reserve_reported_as_pass",
            "trace_failure_interpreted_as_spectral_failure",
            "physical_schedule_bound_claimed",
            "signed_sector_floor_claimed",
            "equation_5_2_claimed",
            "determinant_limit_claimed",
            "rh_proved",
        )
        for field in promotions:
            payload = producer.produce(5, 80)
            payload["source_admissions"][field] = True
            with self.subTest(promotion=field):
                self._reject(payload, "source_admissions")

    def test_producer_admission_guard_rejects_promotions(self) -> None:
        for field in producer.SOURCE_ADMISSIONS:
            if producer.SOURCE_ADMISSIONS[field]:
                continue
            promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
            promoted[field] = True
            with self.subTest(field=field):
                with self.assertRaisesRegex(ValueError, "claim boundary"):
                    producer.validate_source_admissions(promoted)

    def test_verifier_does_not_import_producer(self) -> None:
        source = (ROOT / "verifier" / "leverage_trimmed_mean_feature_schur_replay.py").read_text(
            encoding="utf-8"
        )
        tree = ast.parse(source)
        imported: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module)
        self.assertNotIn("leverage_trimmed_mean_feature_schur", imported)
        self.assertNotIn("src.leverage_trimmed_mean_feature_schur", imported)


if __name__ == "__main__":
    unittest.main()
