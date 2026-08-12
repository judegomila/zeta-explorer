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

import physical_leverage_shorted_schur as producer  # noqa: E402
from verifier import physical_leverage_shorted_schur_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


class PhysicalLeverageShortedSchurTests(unittest.TestCase):
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

    def test_p5_p7_exact_schedule_and_deterministic_serialization(self) -> None:
        expected = {5: 7, 7: 13}
        for p, N in expected.items():
            for dps in (80, 160):
                first = producer.produce(p, dps)
                second = producer.produce(p, dps)
                self.assertEqual(
                    json.dumps(first, indent=2, sort_keys=True),
                    json.dumps(second, indent=2, sort_keys=True),
                )
                self.assertEqual(first["terminal_state"], "P0_INVALIDATED")
                schedule = first["certificate"]["exact_schedule"]
                self.assertEqual(schedule["lambda"], R(p, 2))
                self.assertEqual(schedule["N"], N)
                self.assertIn("not a physical Weil pilot", schedule["model_scope"])
                self.assertEqual(
                    first["arithmetic"]["precision_mode"],
                    "exact rational arithmetic",
                )

    def test_p5_p7_replay_at_base_and_doubled_precision(self) -> None:
        for p, N in ((5, 7), (7, 13)):
            for dps in (80, 160):
                payload = producer.produce(p, dps)
                raw = self._bytes(payload)
                report = verifier.replay(payload, producer_bytes=raw)
                self.assertEqual(
                    report["status"],
                    "PHYSICAL_LEVERAGE_SHORTED_SCHUR_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
                self.assertEqual(
                    report["reconstructed_certificate"]["exact_schedule"]["N"], N
                )
                self.assertTrue(report["checks"]["Krein_short_reconstructed"])
                self.assertTrue(report["checks"]["leverage_trace_identity_pass"])
                self.assertTrue(
                    report["checks"]["equality_and_supercritical_reserves_rejected"]
                )
                self.assertFalse(report["checks"]["producer_booleans_trusted"])
                self.assertFalse(report["claim_boundary"]["finite_input_anchor_nonzero"])
                self.assertFalse(report["claim_boundary"]["signed_sector_floor"])

    def test_success_model_short_cross_reserve_and_glued_factor(self) -> None:
        success = self._regressions()["shorted_schur_success"]
        self.assertEqual(success["C_short_K"], [[R(0), R(0)], [R(0), R(1)]])
        self.assertEqual(success["alpha"], R(5))
        self.assertEqual(success["beta"], R(3))
        self.assertEqual(success["mu"], R(2))
        self.assertEqual(success["rho"], R(1))
        self.assertEqual(success["eta"], R(4))
        self.assertEqual(success["actual_cross_norm_squared"], R(1))
        self.assertEqual(success["automatic_cross_upper"], R(3))
        self.assertEqual(success["strict_reserve"], R(5))
        self.assertEqual(success["chi_bar_squared"], R(3, 4))
        self.assertEqual(success["glued_factor_discriminant"], R(4))
        self.assertEqual(success["glued_lower_factor"], R(1, 2))
        self.assertEqual(
            success["anisotropic_schur"],
            [[R(7, 4), R(0)], [R(0), R(5)]],
        )
        self.assertEqual(success["sufficient_leverage_sum"], R(4, 5))

    def test_scalar_success_equality_and_supercritical_models(self) -> None:
        regressions = self._regressions()
        success = regressions["scalar_success"]
        self.assertEqual(success["C_short_K"], [[R(4)]])
        self.assertEqual(success["mu"], R(7, 4))
        self.assertEqual(success["strict_reserve"], R(5))
        self.assertEqual(success["comparator"], [[R(7), R(-1)], [R(-1), R(3)]])
        self.assertEqual(success["comparator_determinant"], R(20))
        self.assertEqual(success["B_determinant"], R(43))
        self.assertEqual(success["sufficient_leverage_sum"], R(3, 8))
        self.assertTrue(success["strict_condition_holds"])
        self.assertTrue(success["full_B_psd"])

        equality = regressions["strictness_equality"]
        self.assertEqual(equality["strict_reserve"], R(0))
        self.assertEqual(equality["comparator_determinant"], R(0))
        self.assertEqual(equality["B_determinant"], R(0))
        self.assertEqual(equality["sufficient_leverage_sum"], R(1))
        self.assertFalse(equality["strict_condition_holds"])
        self.assertTrue(equality["full_B_psd"])

        failure = regressions["supercritical_failure"]
        self.assertEqual(failure["strict_reserve"], R(-1))
        self.assertEqual(failure["comparator_determinant"], R(-4))
        self.assertEqual(failure["B_determinant"], R(-4))
        self.assertEqual(failure["sufficient_leverage_sum"], R(9, 8))
        self.assertFalse(failure["strict_condition_holds"])
        self.assertFalse(failure["full_B_psd"])

    def test_singular_C_HH_uses_moore_penrose_inverse_and_range_condition(self) -> None:
        singular = self._regressions()["singular_C_HH_pseudoinverse"]
        self.assertEqual(singular["C_HH_rank"], 1)
        self.assertEqual(singular["C_HH"], [[R(4), R(0)], [R(0), R(0)]])
        self.assertEqual(
            singular["C_HH_dagger"],
            [[R(1, 4), R(0)], [R(0), R(0)]],
        )
        self.assertEqual(
            singular["range_compatibility_residual"],
            [[R(0), R(0)], [R(0), R(0)]],
        )
        self.assertEqual(singular["C_short_K"], [[R(1), R(0)], [R(0), R(2)]])

        raw = [
            [Fraction(4), Fraction(0)],
            [Fraction(0), Fraction(0)],
        ]
        dagger = producer._pseudoinverse(raw)
        self.assertEqual(dagger, [[Fraction(1, 4), Fraction(0)], [Fraction(0), Fraction(0)]])
        self.assertEqual(
            producer._matmul(producer._matmul(raw, dagger), raw),
            raw,
        )

    def test_capture_does_not_control_positive_part_raw_cross(self) -> None:
        model = self._regressions()["capture_does_not_control_raw_cross"]
        self.assertEqual(model["negative_part_high_compression"], R(0))
        self.assertEqual(model["low_floor"], R(2))
        self.assertEqual(model["B_HH"], R(11))
        self.assertEqual(model["raw_cross_squared"], R(36))
        self.assertEqual(model["low_floor_times_high_floor"], R(22))
        self.assertEqual(model["B_determinant"], R(-6))
        self.assertTrue(model["diagonal_blocks_positive"])
        self.assertFalse(model["full_B_psd"])
        self.assertFalse(model["capture_implies_raw_cross_control"])

        promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
        promoted["capture_implies_raw_cross_control"] = True
        with self.assertRaisesRegex(ValueError, "claim boundary"):
            producer.validate_source_admissions(promoted)

        promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
        promoted["diagonal_blocks_imply_full_positivity"] = True
        with self.assertRaisesRegex(ValueError, "claim boundary"):
            producer.validate_source_admissions(promoted)

        promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
        promoted["nonstrict_reserve_reported_as_pass"] = True
        with self.assertRaisesRegex(ValueError, "claim boundary"):
            producer.validate_source_admissions(promoted)

    def test_exact_physical_leverage_trace_identity_with_singular_gram(self) -> None:
        leverage = self._regressions()["physical_leverage_trace_identity"]
        self.assertEqual(leverage["G_rank"], 2)
        self.assertEqual(
            leverage["G_dagger"],
            [
                [R(1, 8), R(0), R(1, 8)],
                [R(0), R(1, 4), R(0)],
                [R(1, 8), R(0), R(1, 8)],
            ],
        )
        self.assertEqual(leverage["total_trace"], R(6))
        self.assertEqual(leverage["captured_trace"], R(4))
        self.assertEqual(leverage["direct_high_trace"], R(2))
        self.assertEqual(leverage["difference_high_trace"], R(2))
        self.assertEqual(leverage["trace_based_high_floor"], R(1))

    def test_anchor_scaling_is_exact_and_does_not_claim_finite_p_nonvanishing(self) -> None:
        anchor = self._regressions()["anchor_scaling_arithmetic"]
        self.assertEqual(anchor["a4_fourth_power"], R(9, 2048))
        self.assertEqual(anchor["a4_inverse_fourth_power"], R(2048, 9))
        self.assertEqual(
            anchor["a4_inverse_square"],
            {"rational_coefficient": R(32, 3), "square_root_radicand": 2},
        )
        self.assertEqual(anchor["projected_anchor_identity"], "p4=a4^(-1)*P_N*k_lambda^+")
        self.assertFalse(anchor["threshold_effective"])
        self.assertFalse(anchor["finite_p_nonzero_claimed"])
        self.assertFalse(
            producer.produce(5, 80)["source_admissions"][
                "finite_p_projected_anchor_nonzero_claimed"
            ]
        )

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
                for item in value.values():
                    visit(item)
            elif isinstance(value, list):
                for item in value:
                    visit(item)

        visit(producer.produce(5, 80))

    def test_source_hash_hook_rejects_unfinalized_placeholders(self) -> None:
        with mock.patch.object(
            producer,
            "PINNED_HASHES",
            {
                producer.NOTE: "TO_BE_FINALIZED",
                producer.LOCK: producer.PINNED_HASHES[producer.LOCK],
            },
        ):
            with self.assertRaisesRegex(ValueError, "placeholder not finalized"):
                producer._verified_source_hashes()

    def test_exact_bytes_and_binary64_are_rejected(self) -> None:
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

    def test_schedule_and_convention_mutations_are_reconstructed(self) -> None:
        schedule_mutations = (
            ("N", 8),
            ("N_rule", "floor(lambda^2)"),
            ("model_scope", "physical pilot"),
        )
        for field, value in schedule_mutations:
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_schedule"][field] = value
            with self.subTest(schedule_field=field):
                self._reject(payload, "certificate reconstruction")

        convention_mutations = {
            "source_interval": "[-log(lambda),log(lambda)] with Lebesgue measure and zero extension",
            "physical_interval": "[-lambda,lambda] with Lebesgue measure and zero extension",
            "fourier_sign": "fhat(t)=integral f(y)*exp(+i*t*y) dy",
            "prime_endpoint": "prime powers n<lambda^2 only",
            "inversion": "reflection dropped",
            "positive_negative_split": "C-R is norm-bounded before shorting",
        }
        for field, value in convention_mutations.items():
            payload = producer.produce(5, 80)
            payload["locked_conventions"][field] = value
            with self.subTest(convention=field):
                self._reject(payload, "locked_conventions")

    def test_each_exact_regression_section_has_a_tamper_rejection(self) -> None:
        changes = (
            ("shorted_schur_success", "mu", R(3)),
            ("scalar_success", "B_determinant", R(44)),
            ("strictness_equality", "strict_condition_holds", True),
            ("supercritical_failure", "full_B_psd", True),
            ("singular_C_HH_pseudoinverse", "C_HH_rank", 2),
            ("capture_does_not_control_raw_cross", "B_determinant", R(-5)),
            ("physical_leverage_trace_identity", "captured_trace", R(5)),
            ("anchor_scaling_arithmetic", "finite_p_nonzero_claimed", True),
        )
        for section, field, value in changes:
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_regressions"][section][field] = value
            with self.subTest(section=section, field=field):
                self._reject(payload, "certificate reconstruction")

    def test_nonstrict_and_claim_promotions_are_rejected(self) -> None:
        promotions = (
            "finite_p_projected_anchor_nonzero_claimed",
            "capture_implies_raw_cross_control",
            "diagonal_blocks_imply_full_positivity",
            "nonstrict_reserve_reported_as_pass",
            "physical_high_floor_claimed",
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

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["strictness_equality"][
            "strict_condition_holds"
        ] = True
        self._reject(payload, "certificate reconstruction")

    def test_verifier_does_not_import_producer(self) -> None:
        source = (ROOT / "verifier" / "physical_leverage_shorted_schur_replay.py").read_text(
            encoding="utf-8"
        )
        tree = ast.parse(source)
        imported: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module)
        self.assertNotIn("physical_leverage_shorted_schur", imported)
        self.assertNotIn("src.physical_leverage_shorted_schur", imported)


if __name__ == "__main__":
    unittest.main()
