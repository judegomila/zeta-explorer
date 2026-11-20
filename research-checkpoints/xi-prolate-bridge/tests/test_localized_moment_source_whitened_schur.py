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

import localized_moment_source_whitened_schur as producer  # noqa: E402
from verifier import localized_moment_source_whitened_schur_replay as verifier  # noqa: E402


def R(numerator: int, denominator: int = 1) -> dict[str, str]:
    return {"numerator": str(numerator), "denominator": str(denominator)}


class LocalizedMomentSourceWhitenedSchurTests(unittest.TestCase):
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

    def test_p5_p7_metadata_and_deterministic_serialization(self) -> None:
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
                    "LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR_COMPONENT_REPLAY_PASS",
                )
                self.assertEqual(report["terminal_state"], "P0_INVALIDATED")
                self.assertEqual(
                    report["producer_binding"]["sha256"],
                    hashlib.sha256(raw).hexdigest(),
                )
                self.assertTrue(report["checks"]["upper_one_rebuilt_from_stop_gain_breakpoints"])
                self.assertTrue(report["checks"]["variance_rebuilt_from_pairwise_differences"])
                self.assertTrue(report["checks"]["shorted_load_rebuilt_from_feature_resolvent"])
                self.assertTrue(report["checks"]["full_signed_schur_rebuilt_in_physical_and_feature_spaces"])
                self.assertFalse(report["producer_pass_boolean_trusted"])

    def test_localized_energy_beats_total_moment_and_preserves_cancellation(self) -> None:
        model = self._regressions()["localized_prime_energy_and_variance"]
        self.assertEqual(model["atom_weights"], [R(1), R(1)])
        self.assertEqual(model["archimedean_values"], [R(10), R(10)])
        self.assertEqual(model["prime_values"], [R(4), R(-4)])
        self.assertEqual(model["combined_values"], [R(2), R(18)])
        self.assertEqual(model["ell_b"], R(10))
        self.assertEqual(model["ell_w"], R(2))
        self.assertEqual(model["localized_prime_energy"], R(16))
        self.assertEqual(model["stop_gain_dual_value"], R(16))
        self.assertEqual(model["total_prime_second_moment"], R(32))
        self.assertEqual(model["localized_comparison_floor"], R(2))
        self.assertEqual(model["mean_variance_floor"], R(2))
        self.assertEqual(model["strict_margin"]["reserve"], R(1))
        self.assertTrue(model["strict_margin"]["passes"])
        self.assertEqual(model["equality_boundary"]["reserve"], R(0))
        self.assertFalse(model["equality_boundary"]["passes"])
        self.assertEqual(model["total_moment_separated_test"]["left_square"], R(81))
        self.assertEqual(model["total_moment_separated_test"]["right_four_M"], R(128))
        self.assertFalse(model["total_moment_separated_test"]["passes"])

    def test_mean_variance_witness_and_edge_cases(self) -> None:
        main = self._regressions()["localized_prime_energy_and_variance"]
        self.assertEqual(main["mean"], R(10))
        self.assertEqual(main["variance"], R(64))
        self.assertEqual(main["sigma"], R(8))
        self.assertEqual(main["stop_loss_g"], R(10))
        self.assertEqual(main["stop_loss_eta"], R(8))
        self.assertEqual(main["stop_loss_V"], R(8))

        edges = self._regressions()["mean_variance_edge_cases"]
        zero = edges["sigma_zero"]
        self.assertEqual(zero["mass"], R(3))
        self.assertEqual(zero["variance"], R(0))
        self.assertEqual(zero["g"], R(5))
        self.assertEqual(zero["V"], R(0))
        self.assertEqual(zero["reserve"], R(1))
        self.assertTrue(zero["passes"])

        one = edges["mass_one_nonconstant"]
        self.assertEqual(one["mass"], R(1))
        self.assertEqual(one["mean"], R(10))
        self.assertEqual(one["variance"], R(16))
        self.assertEqual(one["ell"], R(10))
        self.assertEqual(one["allocation"], [R(1, 2), R(1, 2)])
        self.assertEqual(one["eta"], R(5))
        self.assertEqual(one["quadratic_stop_loss_bound"], R(4))
        self.assertEqual(one["V"], R(7, 2))
        self.assertEqual(one["reserve"], R(3, 2))

    def test_hermitian_trace_variance_floor_is_reconstructed_without_eigenvectors(self) -> None:
        model = self._regressions()["hermitian_trace_variance"]
        self.assertEqual(
            model["matrix"],
            [[R(306, 25), R(-192, 25)], [R(-192, 25), R(194, 25)]],
        )
        self.assertEqual(model["trace"], R(20))
        self.assertEqual(model["mean"], R(10))
        self.assertEqual(model["trace_centered_square"], R(128))
        self.assertEqual(model["variance"], R(64))
        self.assertEqual(model["sigma"], R(8))
        self.assertEqual(model["trace_variance_floor"], R(2))
        self.assertEqual(model["determinant"], R(36))
        self.assertEqual(model["characteristic_at_floor"], R(0))
        self.assertTrue(model["floor_is_exact"])

    def test_shorted_source_contraction_passes_when_scalar_reserve_fails(self) -> None:
        model = self._regressions()["positive_shorted_source_contraction"]
        self.assertEqual(model["G_plus"], [[R(5), R(0)], [R(0), R(1)]])
        self.assertEqual(
            model["effective_negative_load"],
            [[R(2), R(0)], [R(0), R(0)]],
        )
        self.assertEqual(model["exact_schur"], [[R(3), R(0)], [R(0), R(1)]])
        self.assertEqual(model["theta"], R(2, 5))
        self.assertEqual(model["certified_quotient_floor"], R(3, 5))
        self.assertTrue(model["anisotropic_contraction_passes"])
        scalar = model["scalar_reserve"]
        self.assertEqual(scalar["left_rho_beta"], R(3, 4))
        self.assertEqual(scalar["right_eta_mu"], R(1, 4))
        self.assertFalse(scalar["passes"])
        scaled = model["nonisometric_source_metric"]
        self.assertEqual(scaled["A"], [[R(2), R(0)], [R(0), R(1)]])
        self.assertEqual(scaled["Delta"], [[R(1, 4), R(0)], [R(0), R(1)]])
        self.assertEqual(scaled["g_A_star_A"], [[R(4), R(0)], [R(0), R(1)]])
        self.assertNotEqual(scaled["g_A_star_A"], scaled["wrong_g_identity"])
        self.assertEqual(scaled["G_plus"], [[R(20), R(0)], [R(0), R(1)]])
        self.assertEqual(scaled["negative_pullback"], [[R(8), R(0)], [R(0), R(0)]])
        self.assertEqual(scaled["pulled_schur"], [[R(12), R(0)], [R(0), R(1)]])
        self.assertEqual(scaled["theta"], R(2, 5))

    def test_complete_signed_feature_identity_retains_source_metric(self) -> None:
        model = self._regressions()["complete_signed_feature_contraction"]
        self.assertEqual(model["B"], [[R(4), R(2)], [R(2), R(2)]])
        self.assertEqual(model["B_determinant"], R(4))
        self.assertEqual(model["high_block"], R(2))
        self.assertEqual(model["physical_schur"], R(2))
        self.assertEqual(model["M_H"], [[R(2), R(0)], [R(0), R(-1)]])
        self.assertEqual(
            model["M_H_inverse"],
            [[R(1, 2), R(0)], [R(0), R(-1)]],
        )
        self.assertEqual(model["source_gram_A_star_A"], R(4))
        self.assertNotEqual(
            model["source_gram_A_star_A"],
            model["wrong_isometric_baseline"],
        )
        self.assertEqual(model["G"], R(12))
        self.assertEqual(model["negative_feature_pullback"], R(4))
        self.assertEqual(model["pulled_schur"], R(8))
        self.assertEqual(model["theta_full"], R(1, 3))
        self.assertEqual(model["physical_quotient_floor"], R(2))
        self.assertTrue(model["complete_contraction_passes"])
        boundary = model["equality_boundary"]
        self.assertEqual(boundary["B"], [[R(0), R(0)], [R(0), R(2)]])
        self.assertEqual(boundary["high_block"], R(2))
        self.assertEqual(boundary["theta_full"], R(1))
        self.assertEqual(boundary["physical_schur"], R(0))
        self.assertFalse(boundary["passes"])

    def test_quantitative_coframe_necessity_excludes_rank_only_shortcut(self) -> None:
        model = self._regressions()["quantitative_coframe_necessity"]
        self.assertEqual(model["rank_A"], 2)
        self.assertEqual(model["A_star_A"], [[R(1, 9), R(0)], [R(0), R(1)]])
        self.assertEqual(model["Delta"], [[R(9), R(0)], [R(0), R(1)]])
        self.assertEqual(model["mu"], R(1, 9))
        self.assertEqual(model["necessary_gram_floor"], R(1, 9))
        self.assertFalse(model["qualitative_rank_determines_uniform_floor"])

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

    def test_source_hashes_are_final_and_note_has_no_tab_escape_damage(self) -> None:
        note = (ROOT / producer.NOTE).read_text(encoding="utf-8")
        self.assertNotIn("\t", note)
        self.assertIn("\\boxed", note)
        for value in producer.PINNED_HASHES.values():
            self.assertRegex(value, r"^[0-9a-f]{64}$")
        with mock.patch.object(
            producer,
            "PINNED_HASHES",
            {producer.NOTE: "TO_BE_FINALIZED", producer.LOCK: producer.PINNED_HASHES[producer.LOCK]},
        ):
            with self.assertRaisesRegex(ValueError, "unfinalized source hash"):
                producer._verified_source_hashes()
        with mock.patch.object(
            verifier,
            "PINNED_HASHES",
            {verifier.LOCK: verifier.PINNED_HASHES[verifier.LOCK]},
        ):
            with self.assertRaisesRegex(verifier.ReplayError, "note and lock"):
                verifier._source_hashes()

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
        for field, value in (
            ("N", 8),
            ("N_rule", "floor(lambda^2)"),
            ("model_scope", "physical pilot"),
        ):
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_schedule_metadata"][field] = value
            with self.subTest(schedule=field):
                self._reject(payload, "certificate")

        mutations = {
            "fourier_sign": "fhat(t)=integral f(y)*exp(+i*t*y) dy",
            "prime_endpoint": "prime powers n<lambda^2 only",
            "prime_sign": "m_lambda=2*theta_prime+2*S_lambda",
            "inversion": "reflection omitted",
            "source_normalization": "unit norm",
            "finite_parity": "Fourier residue equals inversion parity",
        }
        for field, value in mutations.items():
            payload = producer.produce(5, 80)
            payload["locked_conventions"][field] = value
            with self.subTest(convention=field):
                self._reject(payload, "locked_conventions")

    def test_every_regression_section_has_an_independent_tamper_rejection(self) -> None:
        changes = (
            ("localized_prime_energy_and_variance", "localized_prime_energy", R(32)),
            ("mean_variance_edge_cases", "mass_one_nonconstant", {
                **self._regressions()["mean_variance_edge_cases"]["mass_one_nonconstant"],
                "ell": R(6),
            }),
            ("hermitian_trace_variance", "trace_variance_floor", R(3)),
            ("positive_shorted_source_contraction", "theta", R(1)),
            ("complete_signed_feature_contraction", "source_gram_A_star_A", R(1)),
            ("quantitative_coframe_necessity", "rank_A", 1),
        )
        for section, field, value in changes:
            payload = producer.produce(5, 80)
            payload["certificate"]["exact_regressions"][section][field] = value
            with self.subTest(section=section, field=field):
                self._reject(payload, "certificate")

    def test_strict_boundaries_and_shorting_scope_cannot_be_promoted(self) -> None:
        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["localized_prime_energy_and_variance"]["equality_boundary"]["passes"] = True
        self._reject(payload, "certificate")

        payload = producer.produce(5, 80)
        payload["certificate"]["exact_regressions"]["positive_shorted_source_contraction"]["theta"] = R(1)
        self._reject(payload, "certificate")

        payload = producer.produce(5, 80)
        payload["source_admissions"]["shorted_criterion_claimed_necessary_for_original"] = True
        self._reject(payload, "source_admissions")

        payload = producer.produce(5, 80)
        payload["source_admissions"]["source_metric_replaced_by_identity"] = True
        self._reject(payload, "source_admissions")

    def test_all_mandatory_failure_admissions_are_rejected(self) -> None:
        required = {
            "binary64_parameters_used",
            "cached_weil_matrix_read",
            "zeta_zero_table_read",
            "zeros_assumed_real",
            "global_weil_positivity_assumed",
            "prime_power_endpoint_omitted",
            "lambda_squared_mixed_with_lambda",
            "prime_block_sign_changed",
            "inversion_reflection_dropped",
            "unit_source_normalization_substituted",
            "nonpositive_complementary_gap_reported_as_pass",
            "real_axis_eigenvalue_agreement_substituted_for_determinant_convergence",
        }
        self.assertTrue(required.issubset(producer.SOURCE_ADMISSIONS))
        for field in producer.SOURCE_ADMISSIONS:
            payload = producer.produce(5, 80)
            payload["source_admissions"][field] = True
            with self.subTest(field=field):
                self._reject(payload, "source_admissions")

    def test_producer_admission_guard_rejects_every_promotion(self) -> None:
        for field in producer.SOURCE_ADMISSIONS:
            promoted = copy.deepcopy(producer.SOURCE_ADMISSIONS)
            promoted[field] = True
            with self.subTest(field=field):
                with self.assertRaisesRegex(ValueError, "claim boundary"):
                    producer.validate_source_admissions(promoted)

    def test_claim_scope_remains_explicitly_unresolved(self) -> None:
        payload = producer.produce(5, 80)
        not_proved = payload["claim_scope"]["not_proved"]
        self.assertIn("equation (5.2) of DIRECT_RH_ATTACK.md", not_proved)
        self.assertIn("the Riemann hypothesis", not_proved)
        self.assertFalse(payload["source_admissions"]["rh_proved"])
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")

    def test_verifier_does_not_import_producer(self) -> None:
        source = (
            ROOT / "verifier" / "localized_moment_source_whitened_schur_replay.py"
        ).read_text(encoding="utf-8")
        tree = ast.parse(source)
        imported: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imported.update(alias.name for alias in node.names)
            elif isinstance(node, ast.ImportFrom) and node.module:
                imported.add(node.module)
        self.assertNotIn("localized_moment_source_whitened_schur", imported)
        self.assertNotIn("src.localized_moment_source_whitened_schur", imported)


if __name__ == "__main__":
    unittest.main()
