from __future__ import annotations

from copy import deepcopy
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from verifier import live_prolate_krylov_schur_audit as replay


ROOT = Path(__file__).resolve().parents[1]


def number(value: str) -> Decimal:
    return Decimal(value)


class LiveProlateKrylovSchurAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.report = replay.audit(ROOT)
        cls.by_N = {pilot["N"]: pilot for pilot in cls.report["pilots"]}

    def test_locked_inputs_and_independent_matrix_paths_are_replayed(self) -> None:
        self.assertEqual(self.report["formal_state"], "P0_INVALIDATED")
        self.assertEqual(self.report["claim_class"], "POINT_DIAGNOSTIC")
        self.assertFalse(self.report["uses_cached_eigenvalues_or_pass_booleans"])
        self.assertFalse(self.report["uses_assumed_real_zeta_zeros"])
        self.assertFalse(self.report["assumes_global_weil_positivity"])

        n4 = self.by_N[4]
        balls = n4["matrix_ball_checks"]
        self.assertTrue(balls["four_way_entry_intersection_nonempty"])
        self.assertTrue(balls["producer_verifier_overlap_at_256_and_512_bits"])
        self.assertTrue(balls["doubled_precision_overlap_for_each_path"])
        self.assertLess(
            number(n4["raw_block_matrix_vs_ball_intersection_midpoint_max_abs"]),
            Decimal("1e-30"),
        )
        for pilot in self.report["pilots"]:
            checks = pilot["source_validation"]
            self.assertLess(number(checks["block_formula_max_abs_defect"]), Decimal("1e-32"))
            self.assertLess(number(checks["source_cauchy_max_abs_defect"]), Decimal("1e-32"))
            self.assertLess(number(checks["symmetry_max_abs_defect"]), Decimal("1e-32"))
            self.assertLess(
                number(checks["coefficient_state_vs_cached_kappa_defect"]),
                Decimal("1e-32"),
            )

    def test_N3_three_vector_shift_rescues_the_point_odd_gate_before_closure(self) -> None:
        pilot = self.by_N[3]
        self.assertEqual(pilot["full_even_krylov_dimension"], 4)
        self.assertTrue(pilot["three_vector_space_is_proper"])
        self.assertEqual(pilot["minimal_passing_dimension_among_q_u_U3"], 3)
        q_gate, u_gate, u3_gate = pilot["gates"]

        self.assertFalse(q_gate["point_gate_pass"])
        self.assertFalse(u_gate["point_gate_pass"])
        self.assertTrue(u3_gate["point_gate_pass"])
        self.assertTrue(all(number(gate["shifted_transverse_floor"]) > 0 for gate in pilot["gates"]))
        self.assertLess(number(q_gate["schur_short"]), Decimal("-2.20e-6"))
        self.assertLess(number(u_gate["schur_short"]), Decimal("-3.82e-7"))
        self.assertGreater(number(u3_gate["schur_short"]), Decimal("2.38e-6"))
        self.assertLess(number(u3_gate["upper_shift"]), Decimal("9.89e-7"))
        self.assertGreater(number(u3_gate["odd_floor_margin"]), Decimal("2.36e-6"))
        self.assertGreater(number(pilot["krylov_orthogonalization_pivots"][3]), Decimal("0.006"))

    def test_N4_raw_q_gate_already_passes_and_lower_shifts_improve_it(self) -> None:
        pilot = self.by_N[4]
        self.assertEqual(pilot["full_even_krylov_dimension"], 5)
        self.assertTrue(pilot["three_vector_space_is_proper"])
        self.assertEqual(pilot["minimal_passing_dimension_among_q_u_U3"], 1)
        q_gate, u_gate, u3_gate = pilot["gates"]
        self.assertTrue(all(gate["point_gate_pass"] for gate in pilot["gates"]))
        self.assertGreater(number(q_gate["shifted_transverse_floor"]), Decimal("1.156e-3"))
        self.assertGreater(number(q_gate["schur_short"]), Decimal("2.23e-7"))
        self.assertLess(number(q_gate["schur_short"]), Decimal("2.24e-7"))
        self.assertLess(number(q_gate["upper_shift"]), Decimal("8.00e-8"))
        self.assertLess(number(u_gate["upper_shift"]), number(q_gate["upper_shift"]))
        self.assertLess(number(u3_gate["upper_shift"]), number(u_gate["upper_shift"]))
        self.assertGreater(number(u_gate["schur_short"]), number(q_gate["schur_short"]))
        self.assertGreater(number(u3_gate["schur_short"]), number(u_gate["schur_short"]))

    def test_weighted_solves_are_recomputed_and_small_residuals_are_reported(self) -> None:
        expected_even_tau = {
            3: (Decimal("0.0588"), Decimal("0.0598")),
            4: (Decimal("0.0309"), Decimal("0.0311")),
        }
        expected_odd_solve = {
            3: (Decimal("0.0846"), Decimal("0.0848")),
            4: (Decimal("0.0377"), Decimal("0.0378")),
        }
        for N, pilot in self.by_N.items():
            lower_tau, upper_tau = expected_even_tau[N]
            lower_odd, upper_odd = expected_odd_solve[N]
            for gate in pilot["gates"]:
                tau = number(gate["even_weighted_solve_tau"])
                odd_solve = number(gate["odd_transverse_solve_norm"])
                self.assertGreater(tau, lower_tau)
                self.assertLess(tau, upper_tau)
                self.assertGreater(odd_solve, lower_odd)
                self.assertLess(odd_solve, upper_odd)
                self.assertLess(
                    number(gate["even_weighted_solve_residual_norm"]), Decimal("1e-80")
                )
                self.assertLess(
                    number(gate["odd_transverse_solve_residual_norm"]), Decimal("1e-80")
                )
                self.assertLess(
                    number(gate["schur_determinant_identity_abs_defect"]), Decimal("1e-80")
                )

    def test_cached_spectral_numbers_and_booleans_are_not_inputs(self) -> None:
        path, expected_hash = replay.RAW_INPUTS[3]
        payload = replay._load_json(replay._checked_path(ROOT, path, expected_hash))
        baseline = replay.audit_payload(payload, 3)
        mutated = deepcopy(payload)
        mutated["residual_gap"] = {
            "q": "999999",
            "two_dimensional_ritz_upper_u": "-999999",
            "inversion_odd_sector_floor": "123",
        }
        mutated["sector_refined_bridge_diagnostic_pass"] = True
        mutated["finite_residual_gap_hypotheses_diagnostic_pass"] = True
        replayed = replay.audit_payload(mutated, 3)
        self.assertEqual(baseline["q"], replayed["q"])
        self.assertEqual(baseline["gates"], replayed["gates"])

    def test_changed_sign_endpoint_or_binary64_state_is_rejected(self) -> None:
        path, expected_hash = replay.RAW_INPUTS[3]
        payload = replay._load_json(replay._checked_path(ROOT, path, expected_hash))

        wrong_sign = deepcopy(payload)
        wrong_sign["provenance"]["prime_block_sign"] = "plus"
        with self.assertRaisesRegex(replay.AuditError, "provenance"):
            replay.audit_payload(wrong_sign, 3)

        omitted_endpoint = deepcopy(payload)
        omitted_endpoint["source_enumeration"]["terms"] = omitted_endpoint[
            "source_enumeration"
        ]["terms"][:-1]
        with self.assertRaisesRegex(replay.AuditError, "2,3,4"):
            replay.audit_payload(omitted_endpoint, 3)

        wrong_fourier_sign = deepcopy(payload)
        wrong_fourier_sign["normalizations"]["Fourier_mode_sign"] = (
            "U_n uses exp(-2*pi*i*n*x/L)"
        )
        with self.assertRaisesRegex(replay.AuditError, "normalization"):
            replay.audit_payload(wrong_fourier_sign, 3)

        binary64 = deepcopy(payload)
        binary64["projection"]["coefficients_modes_minusN_to_N"][0] = 0.1
        with self.assertRaisesRegex(replay.AuditError, "binary64"):
            replay.audit_payload(binary64, 3)

        dropped_reflection = deepcopy(payload)
        dropped_reflection["raw_matrices"]["prime_unsigned"][0][1] = "0"
        with self.assertRaises(replay.AuditError):
            replay.audit_payload(dropped_reflection, 3)

    def test_hash_mutation_is_rejected_before_parsing(self) -> None:
        path, expected_hash = replay.RAW_INPUTS[3]
        source = ROOT / path
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "pilot.json"
            target.write_bytes(source.read_bytes() + b"\n")
            with self.assertRaisesRegex(replay.AuditError, "hash mismatch"):
                replay._checked_path(Path(directory), "pilot.json", expected_hash)

    def test_historical_point_replay_is_not_upgraded_by_later_state_balls(self) -> None:
        self.assertTrue(self.report["interval_inputs_still_required"])
        for pilot in self.report["pilots"]:
            self.assertFalse(pilot["projected_state_interval_enclosure"])
            self.assertTrue(
                pilot["historical_replay_does_not_consume_checkpoint_0_56_state_balls"]
            )
            self.assertEqual(pilot["claim_scope"], "finite point diagnostic only")

    def test_compact_artifact_replays_and_has_local_hashes(self) -> None:
        artifact_root = ROOT / "artifacts" / "live_prolate_krylov_schur_audit"
        sums: dict[str, str] = {}
        for line in (artifact_root / "SHA256SUMS").read_text(encoding="ascii").splitlines():
            digest, name = line.split("  ", 1)
            sums[name] = digest
        for name, expected in sums.items():
            actual = hashlib.sha256((artifact_root / name).read_bytes()).hexdigest()
            self.assertEqual(actual, expected)

        artifact = json.loads(
            (artifact_root / "lambda2_N3_N4_point_diagnostic.json").read_text(
                encoding="utf-8"
            )
        )
        self.assertEqual(artifact["formal_state"], "P0_INVALIDATED")
        artifact_by_N = {pilot["N"]: pilot for pilot in artifact["pilots"]}
        for N in (3, 4):
            self.assertEqual(
                artifact_by_N[N]["minimal_passing_dimension_among_q_u_U3"],
                self.by_N[N]["minimal_passing_dimension_among_q_u_U3"],
            )
            for compact, full in zip(artifact_by_N[N]["shifts"], self.by_N[N]["gates"]):
                self.assertLess(
                    abs(number(compact["upper_shift"]) - number(full["upper_shift"])),
                    Decimal("1e-30"),
                )
                self.assertLess(
                    abs(number(compact["schur_short"]) - number(full["schur_short"])),
                    Decimal("1e-30"),
                )


if __name__ == "__main__":
    unittest.main()
