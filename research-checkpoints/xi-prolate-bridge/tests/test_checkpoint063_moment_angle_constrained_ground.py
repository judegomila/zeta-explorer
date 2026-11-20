from __future__ import annotations

from copy import deepcopy
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import checkpoint063_moment_angle_constrained_ground as producer  # noqa: E402
import checkpoint063_moment_angle_constrained_ground_replay as verifier  # noqa: E402


ARTIFACTS = ROOT / "artifacts" / "checkpoint063_moment_angle_constrained_ground"


class Checkpoint063MomentAngleConstrainedGroundTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.raw40 = (ARTIFACTS / "lambda2_N4_dps40_producer.json").read_bytes()
        cls.raw80 = (ARTIFACTS / "lambda2_N4_dps80_producer.json").read_bytes()
        cls.payload40 = verifier.strict_json_loads(cls.raw40)
        cls.payload80 = verifier.strict_json_loads(cls.raw80)
        cls.stored40 = verifier.strict_json_loads(
            (ARTIFACTS / "lambda2_N4_dps40_replay.json").read_bytes(),
            "stored replay",
        )
        cls.stored80 = verifier.strict_json_loads(
            (ARTIFACTS / "lambda2_N4_dps80_replay.json").read_bytes(),
            "stored replay",
        )
        cls.fresh40 = verifier.replay_payload(
            deepcopy(cls.payload40), verifier._sha256_bytes(cls.raw40)
        )
        cls.fresh80 = verifier.replay_payload(
            deepcopy(cls.payload80), verifier._sha256_bytes(cls.raw80)
        )

    def test_exact_inputs_binary64_and_duplicate_json_are_rejected(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, 40, 30)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.PilotError, "locked"):
            producer.produce("5/2", 4, 40, 30)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"lambda":2.0}')
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier.strict_json_loads('{"x":"1","x":"2"}')

    def test_source_conventions_inventory_and_claim_boundary_are_locked(self) -> None:
        verifier.validate_contract(self.payload40)
        self.assertEqual(self.payload40["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(self.payload40["analytic_uniform_claim"])
        self.assertEqual(
            self.payload40["locked_conventions"]["prime_block_sign"],
            "minus in Q=pole-archimedean-prime, as in source equation (3.19)",
        )
        self.assertEqual(
            [item["n"] for item in self.payload40["source_inventory"]["prime_powers"]],
            [2, 3, 4],
        )
        self.assertFalse(self.payload40["provenance"]["zeta_zero_table_read"])
        self.assertFalse(self.payload40["provenance"]["global_weil_positivity_assumed"])
        self.assertIn(
            "eta_m(u) only",
            self.payload40["locked_conventions"]["angle_output_scope"],
        )
        self.assertTrue(
            any("Theta/Phi" in item for item in self.payload40["limitations"])
        )

    def test_direct_and_analytic_even_moment_coefficients_agree(self) -> None:
        mp.mp.dps = 80
        N = 4
        L = 2 * mp.log(mp.mpf("2"))
        complement = mp.matrix(N + 1, N)
        for j in range(N):
            complement[j + 1, j] = 1
        direct = producer._direct_even_moment_columns(N, L, complement)
        analytic = verifier.analytic_even_moment_columns(N, L, complement)
        self.assertLess(verifier._max_abs(direct - analytic), mp.mpf("1e-70"))

    def test_direct_and_analytic_projected_pole_vectors_agree(self) -> None:
        mp.mp.dps = 80
        N = 4
        L = 2 * mp.log(mp.mpf("2"))
        direct_plus, direct_minus = producer._direct_pole_vectors(N, L)
        analytic_plus, analytic_minus = verifier.analytic_pole_vectors(N, L)
        self.assertLess(verifier._max_abs(direct_plus - analytic_plus), mp.mpf("1e-70"))
        self.assertLess(verifier._max_abs(direct_minus - analytic_minus), mp.mpf("1e-70"))
        constrained = self.payload40["constrained_ground"]
        self.assertLess(mp.mpf(constrained["pole_even_rank_one_defect"]), mp.mpf("1e-35"))
        self.assertLess(mp.mpf(constrained["pole_odd_rank_one_defect"]), mp.mpf("1e-35"))

    def test_verifier_uses_transformed_archimedean_origin_path(self) -> None:
        formula_path = self.fresh40["independent_formula_paths"]["source_matrix"]
        self.assertIn("x=L*t^2 transformed", formula_path)
        self.assertIn("analytic origin value", formula_path)
        self.assertIn("no finite-epsilon surrogate", formula_path)
        verifier_text = (
            ROOT / "verifier" / "checkpoint063_moment_angle_constrained_ground_replay.py"
        ).read_text()
        self.assertNotIn("matrix_from_source,", verifier_text)
        self.assertNotIn("eps * integrand", verifier_text)
        self.assertNotIn("eps*integrand", verifier_text)

    def test_regularized_moment_floors_match_both_exact_formulas(self) -> None:
        mp.mp.dps = 80
        profiles = self.payload40["moment_profiles"]
        self.assertEqual([record["m"] for record in profiles], [1, 2, 3, 4])
        previous_ratio = mp.mpf("0")
        for record in profiles:
            floor_resolvent = mp.mpf(record["floor_from_resolvent"])
            floor_schur = mp.mpf(record["floor_from_complete_schur"])
            ratio = mp.mpf(record["r_over_floor"])
            self.assertGreater(floor_resolvent, 0)
            self.assertLess(abs(floor_resolvent - floor_schur), mp.mpf("1e-35"))
            self.assertLess(
                abs(mp.mpf(record["determinant_identity_signed_residual"])),
                mp.mpf("1e-35"),
            )
            self.assertGreaterEqual(ratio, previous_ratio)
            self.assertLessEqual(ratio, 1)
            previous_ratio = ratio

    def test_angle_profile_crosses_declared_live_spectral_layers(self) -> None:
        mp.mp.dps = 80
        expected_ranks = [0, 1, 1, 2, 3, 4]
        expected_alphas = list(producer.PROFILE_ALPHA_TEXTS)
        for record in self.payload40["moment_profiles"]:
            angles = record["angle_profile"]
            self.assertEqual(
                [angle["alpha_equals_u_over_r"] for angle in angles],
                expected_alphas,
            )
            self.assertEqual(
                [angle["spectral_projector_rank"] for angle in angles],
                expected_ranks,
            )
            ratio = mp.mpf(record["r_over_floor"])
            for angle in angles:
                eta = mp.mpf(angle["eta"])
                lower = mp.mpf(angle["lower_bound_for_r_over_c"])
                upper = mp.mpf(angle["upper_bound_for_r_over_c"])
                self.assertGreaterEqual(eta, -mp.mpf("1e-35"))
                self.assertLessEqual(eta, 1 + mp.mpf("1e-35"))
                self.assertLessEqual(lower, ratio + mp.mpf("1e-35"))
                self.assertLessEqual(ratio, upper + mp.mpf("1e-35"))
                self.assertGreater(
                    mp.mpf(angle["distance_to_nearest_B_eigenvalue"]), 0
                )

    def test_constrained_ground_and_labelled_critical_load_identities(self) -> None:
        mp.mp.dps = 80
        result = self.payload40["constrained_ground"]
        zeta = mp.mpf(result["constrained_ground_zeta"])
        a1 = mp.mpf(result["nonpole_minimum"])
        a2 = mp.mpf(result["nonpole_second_eigenvalue_a2"])
        critical_load = mp.mpf(result["critical_load_s_c"])
        self.assertLess(a1, zeta)
        self.assertLess(zeta, a2)
        self.assertGreater(critical_load, 1)
        self.assertGreater(mp.mpf(result["critical_load_margin_s_c_minus_1"]), 0)
        self.assertLess(abs(mp.mpf(result["paired_resolvent_signed_residual"])), mp.mpf("1e-35"))
        self.assertLess(abs(mp.mpf(result["crossing_even_minus_zeta"])), mp.mpf("1e-35"))
        self.assertLess(abs(mp.mpf(result["crossing_odd_minus_zeta"])), mp.mpf("1e-35"))
        self.assertGreater(mp.mpf(result["source_odd_minus_even_ground_gap"]), 0)
        self.assertGreater(mp.mpf(result["odd_labelled_factor_at_load_1"]), 0)
        self.assertTrue(result["source_unit_load_before_crossing_point_diagnostic"])

    def test_full_determinant_square_does_not_replace_labelled_orientation(self) -> None:
        mp.mp.dps = 80
        result = self.payload40["constrained_ground"]
        ratio = mp.mpf(result["full_determinant_ratio_at_load_1"])
        square = mp.mpf(result["perfect_square_value_at_load_1"])
        labelled = mp.mpf(result["odd_labelled_factor_at_load_1"])
        self.assertGreater(ratio, 0)
        self.assertGreater(labelled, 0)
        self.assertLess(abs(ratio - square), mp.mpf("1e-35"))
        self.assertLess(abs(mp.mpf(result["perfect_square_signed_residual"])), mp.mpf("1e-35"))
        self.assertNotEqual(ratio, labelled)

    def test_actual_constrained_ground_replays_labelled_B_U_chi_reserve(self) -> None:
        mp.mp.dps = 80
        result = self.payload40["constrained_ground"]
        self.assertIn("existential identity regression", result["constrained_trial_kind"])
        self.assertTrue(result["labelled_trial_is_point_only_not_interval"])
        self.assertGreater(mp.mpf(result["labelled_trial_B_U_point_floor"]), 0)
        self.assertGreater(mp.mpf(result["labelled_trial_chi_U"]), 0)
        self.assertGreater(mp.mpf(result["labelled_trial_load_lower_bound"]), 1)
        self.assertLess(
            abs(mp.mpf(result["constrained_trial_norm_defect"])), mp.mpf("1e-35")
        )
        self.assertLess(
            abs(mp.mpf(result["constrained_trial_w_orthogonality_defect"])),
            mp.mpf("1e-35"),
        )
        self.assertLess(
            abs(mp.mpf(result["constrained_trial_energy_minus_zeta"])),
            mp.mpf("1e-35"),
        )
        self.assertLess(
            abs(mp.mpf(result["labelled_trial_load_bound_minus_s_c"])),
            mp.mpf("1e-35"),
        )
        self.assertLessEqual(
            mp.mpf(result["labelled_trial_inverse_free_load_lower_bound"]),
            mp.mpf(result["labelled_trial_load_lower_bound"]),
        )

    def test_fresh_independent_replays_match_stored_outputs_at_both_precisions(self) -> None:
        self.assertTrue(self.fresh40["replay_agrees"])
        self.assertTrue(self.fresh80["replay_agrees"])
        self.assertEqual(self.fresh40, self.stored40)
        self.assertEqual(self.fresh80, self.stored80)
        self.assertIn("closed endpoint recurrence", self.fresh40["independent_formula_paths"]["physical_moments"])
        verifier_text = (ROOT / "verifier" / "checkpoint063_moment_angle_constrained_ground_replay.py").read_text()
        self.assertNotIn("import checkpoint063_moment_angle_constrained_ground as", verifier_text)

    def test_doubled_precision_selected_values_are_stable(self) -> None:
        mp.mp.dps = 100
        for key in (
            "constrained_ground_zeta",
            "critical_load_s_c",
            "critical_load_margin_s_c_minus_1",
            "source_odd_minus_even_ground_gap",
            "labelled_trial_B_U_point_floor",
            "labelled_trial_chi_U",
            "labelled_trial_load_lower_bound",
        ):
            low = mp.mpf(self.payload40["constrained_ground"][key])
            high = mp.mpf(self.payload80["constrained_ground"][key])
            self.assertLess(abs(low - high) / max(1, abs(high)), mp.mpf("1e-30"))
        for low_record, high_record in zip(
            self.payload40["moment_profiles"], self.payload80["moment_profiles"]
        ):
            for key in ("floor_from_resolvent", "r_over_floor"):
                low = mp.mpf(low_record[key])
                high = mp.mpf(high_record[key])
                self.assertLess(abs(low - high) / max(1, abs(high)), mp.mpf("1e-30"))

    def test_contract_rejects_claim_formula_inventory_and_raw_tampers(self) -> None:
        changed = deepcopy(self.payload40)
        changed["terminal_state"] = "P0_DIAGNOSTIC_PASS"
        with self.assertRaisesRegex(verifier.ReplayError, "terminal-state"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["locked_formulas"]["critical_load"] += " without sector labels"
        with self.assertRaisesRegex(verifier.ReplayError, "formula"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_inventory"]["prime_powers"].append("junk")
        changed["section_sha256"]["source_inventory"] = verifier._raw_hash(
            changed["source_inventory"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power inventory"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["residual_geometry"]["B_even_complement_at_q"][0][0] = "0"
        with self.assertRaisesRegex(verifier.ReplayError, "section hash"):
            verifier.validate_contract(changed)

    def test_repaired_hash_cannot_hide_false_critical_load(self) -> None:
        changed = deepcopy(self.payload40)
        changed["constrained_ground"]["critical_load_s_c"] = "2"
        changed["section_sha256"]["constrained_ground"] = verifier._raw_hash(
            changed["constrained_ground"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)


if __name__ == "__main__":
    unittest.main()
