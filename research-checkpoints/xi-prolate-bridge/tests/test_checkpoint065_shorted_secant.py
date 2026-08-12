from __future__ import annotations

from copy import deepcopy
import hashlib
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import checkpoint065_shorted_secant as producer  # noqa: E402
import checkpoint065_shorted_secant_replay as verifier  # noqa: E402


ARTIFACTS = ROOT / "artifacts" / "checkpoint065_shorted_secant"


class Checkpoint065ShortedSecantTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.raw40 = (ARTIFACTS / "lambda2_N4_T1_dps40_producer.json").read_bytes()
        cls.raw80 = (ARTIFACTS / "lambda2_N4_T1_dps80_producer.json").read_bytes()
        cls.payload40 = verifier.strict_json_loads(cls.raw40)
        cls.payload80 = verifier.strict_json_loads(cls.raw80)
        cls.stored40 = json.loads((ARTIFACTS / "lambda2_N4_T1_dps40_replay.json").read_text())
        cls.stored80 = json.loads((ARTIFACTS / "lambda2_N4_T1_dps80_replay.json").read_text())
        cls.fresh40 = verifier.replay_payload(deepcopy(cls.payload40), verifier._sha256_bytes(cls.raw40))
        cls.fresh80 = verifier.replay_payload(deepcopy(cls.payload80), verifier._sha256_bytes(cls.raw80))

    def test_exact_inputs_and_strict_json_fail_closed(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce("2", 4, 1.0, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.Checkpoint065Error, "locked"):
            producer.produce("4", 4, "1", 40)
        with self.assertRaisesRegex(producer.Checkpoint065Error, "40 or 80"):
            producer.produce("2", 4, "1", 60)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"x":1.0}')
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier.strict_json_loads('{"x":"1","x":"2"}')
        with self.assertRaisesRegex(verifier.ReplayError, "invalid"):
            verifier.strict_json_loads(b"\xff")
        for token in ("nan", "inf", "-inf"):
            with self.subTest(token=token), self.assertRaisesRegex(verifier.ReplayError, "nonfinite"):
                verifier.strict_json_loads(json.dumps({"x": token}))

        changed = deepcopy(self.payload40)
        changed["inputs"]["L"] = mp.nstr(
            mp.mpf(changed["inputs"]["L"]) + mp.mpf("1e-15"), 40
        )
        with self.assertRaisesRegex(verifier.ReplayError, "noncanonical"):
            verifier._validate_contract(changed)

    def test_contract_source_lock_and_normalization_regression(self) -> None:
        verifier._validate_contract(self.payload40)
        payload = self.payload40
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["claim_class"], "FINITE_POINT_DIAGNOSTIC")
        self.assertFalse(payload["analytic_uniform_claim"])
        self.assertIn("exp(-i*t*x)", payload["locked_conventions"]["fourier_transform"])
        self.assertIn("equation (3.19)", payload["locked_conventions"]["prime_block_sign"])
        self.assertEqual(payload["source_guard"]["prime_power_inventory"], [2, 3, 4])
        self.assertGreater(mp.mpf(payload["source_guard"]["even_gap_at_q"]), 0)
        self.assertGreater(mp.mpf(payload["source_guard"]["odd_gap_at_q"]), 0)
        regression = payload["normalization_regression"]
        self.assertFalse(regression["unit_normalized_replacement_allowed"])
        self.assertNotEqual(
            mp.mpf(regression["source_limiting_Xi_transform_scalar"]),
            mp.mpf(regression["unit_normalized_limiting_Xi_transform_scalar"]),
        )
        self.assertFalse(payload["provenance"]["zeta_zero_table_read"])
        self.assertFalse(payload["provenance"]["global_weil_positivity_assumed"])
        self.assertTrue(
            {
                "src/prolate_state.py",
                "src/weil_matrix.py",
                "verifier/independent_replay.py",
                "verifier/residual_ridged_fixed_window_replay.py",
                "notes/SECANT_SHORTED_RECIPROCAL_FESHBACH.md",
                "notes/TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md",
                "notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md",
            }.issubset(payload["dependency_sha256"])
        )

    def test_regularized_feshbach_and_reserve_envelope(self) -> None:
        case = self.payload80["shorted_reciprocal"]["regularized"]
        rank = mp.mpf(case["rank_one_soft_contribution"])
        bulk = mp.mpf(case["deflated_bulk_soft_contribution"])
        reserve = mp.mpf(case["reserve_sum"])
        self.assertGreater(mp.mpf(case["delta_r"]), 0)
        self.assertGreater(mp.mpf(case["tilted_capture"]), 0)
        self.assertGreaterEqual(bulk, 0)
        self.assertLess(abs(mp.mpf(case["soft_trace_identity_residual"])), mp.mpf("1e-70"))
        self.assertLess(abs(mp.mpf(case["reserve_identity_residual"])), mp.mpf("1e-70"))
        self.assertLessEqual(mp.mpf(case["reserve_envelope_lower"]), reserve)
        self.assertLessEqual(reserve, mp.mpf(case["reserve_envelope_upper"]))
        self.assertGreater(rank, 1000 * bulk)
        self.assertGreater(mp.mpf(case["normalized_rank_one_reserve"]), 1000 * mp.mpf(case["normalized_deflated_bulk_reserve"]))

        for a, x in ((mp.mpf("0"), mp.mpf("1")), (mp.mpf("1.1"), mp.mpf("1")), (mp.mpf("0.5"), mp.mpf("-1"))):
            with self.subTest(a=a, x=x), self.assertRaisesRegex(
                verifier.ReplayError, "reserve domain"
            ):
                verifier._reserve_envelope_root(a, x)

        base_live = {
            "source_hermitian_defect": mp.mpf("0"),
            "source_inversion_defect": mp.mpf("0"),
            "kappa_even_defect": mp.mpf("0"),
            "z0_even_defect": mp.mpf("0"),
            "z0_imaginary_defect": mp.mpf("0"),
            "secant_orthogonality_defect": mp.mpf("0"),
            "omega_norm_defect": mp.mpf("0"),
            "r": mp.mpf("1"),
            "B_values": mp.matrix([1]),
            "odd_values": mp.matrix([1]),
            "epsilon": mp.mpf("1"),
            "c2": mp.mpf("1"),
            "K_values": mp.matrix([0, 1]),
            "D0": mp.mpf("1"),
            "D0_rhs": mp.mpf("1"),
            "residual_pythagoras": mp.mpf("0"),
        }
        gates = verifier._base_prerequisite_gates(
            base_live, mp.mpf("1e-10"), mp.mpf("1e-20")
        )
        self.assertTrue(all(gates.values()))
        base_live["omega_norm_defect"] = mp.mpf("1")
        self.assertFalse(
            verifier._base_prerequisite_gates(
                base_live, mp.mpf("1e-10"), mp.mpf("1e-20")
            )["base_secant_normalized"]
        )

    def test_unregularized_shorted_minimum_identities(self) -> None:
        case = self.payload80["shorted_reciprocal"]["unregularized"]
        self.assertGreater(mp.mpf(case["delta_0"]), 0)
        for field in (
            "determinant_identity_residual",
            "inverse_rayleigh_identity_residual",
            "Bv_minus_delta_omega_norm",
            "v0_energy_minus_delta",
            "H0_identity_residual",
        ):
            self.assertLess(abs(mp.mpf(case[field])), mp.mpf("1e-69"), field)
        self.assertGreater(mp.mpf(case["rank_one_H0_contribution"]), 1000 * mp.mpf(case["deflated_bulk_H0_contribution"]))
        self.assertGreaterEqual(mp.mpf(case["delta0_over_minimum_B_eigenvalue"]), 1)

    def test_graph_load_vector_identity(self) -> None:
        case = self.payload80["shorted_reciprocal"]["graph_load"]
        direct = [mp.mpf(value) for value in case["a0_F_direct"]]
        rebuilt = [mp.mpf(value) for value in case["alpha_bF_plus_beta_g"]]
        self.assertEqual(len(direct), 3)
        self.assertLess(max(abs(left - right) for left, right in zip(direct, rebuilt)), mp.mpf("1e-70"))
        self.assertLess(mp.mpf(case["identity_residual_norm"]), mp.mpf("1e-70"))

    def test_doubled_precision_selected_values_are_stable(self) -> None:
        selections = (
            ("regularized", "delta_r"),
            ("regularized", "delta_over_epsilon_plus_r"),
            ("regularized", "tilted_capture"),
            ("regularized", "rank_one_soft_contribution"),
            ("regularized", "deflated_bulk_soft_contribution"),
            ("regularized", "reserve_sum"),
            ("unregularized", "delta_0"),
            ("unregularized", "rank_one_H0_contribution"),
            ("unregularized", "deflated_bulk_H0_contribution"),
        )
        low_root = self.payload40["shorted_reciprocal"]
        high_root = self.payload80["shorted_reciprocal"]
        for subsection, field in selections:
            low = mp.mpf(low_root[subsection][field])
            high = mp.mpf(high_root[subsection][field])
            self.assertLess(abs(low - high) / max(1, abs(low), abs(high)), mp.mpf("1e-30"), field)

    def test_fresh_independent_replays_match_stored_outputs(self) -> None:
        self.assertTrue(self.fresh40["replay_agrees"])
        self.assertTrue(self.fresh80["replay_agrees"])
        self.assertEqual(self.fresh40, self.stored40)
        self.assertEqual(self.fresh80, self.stored80)
        self.assertEqual(len(self.fresh40["independent_gates"]), 28)
        self.assertIn("Si/Ci", self.fresh40["independent_paths"]["time_band"])
        verifier_text = (ROOT / "verifier" / "checkpoint065_shorted_secant_replay.py").read_text()
        self.assertNotIn("import checkpoint065_shorted_secant", verifier_text)

    def test_repaired_hash_cannot_hide_metric_or_normalization_tamper(self) -> None:
        changed = deepcopy(self.payload40)
        changed["shorted_reciprocal"]["regularized"]["delta_r"] = "1"
        changed["section_sha256"]["shorted_reciprocal"] = verifier._raw_hash(changed["shorted_reciprocal"])
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)

        changed = deepcopy(self.payload40)
        changed["normalization_regression"]["unit_normalized_replacement_allowed"] = True
        changed["section_sha256"]["normalization_regression"] = verifier._raw_hash(changed["normalization_regression"])
        with self.assertRaisesRegex(verifier.ReplayError, "normalization"):
            verifier.replay_payload(changed)

    def test_source_convention_gap_claim_and_provenance_adversaries(self) -> None:
        changed = deepcopy(self.payload40)
        changed["locked_conventions"]["fourier_transform"] = "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"
        with self.assertRaisesRegex(verifier.ReplayError, "convention"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_guard"]["prime_power_inventory"] = [2, 3]
        changed["section_sha256"]["source_guard"] = verifier._raw_hash(changed["source_guard"])
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_guard"]["even_gap_at_q"] = "0"
        changed["section_sha256"]["source_guard"] = verifier._raw_hash(changed["source_guard"])
        with self.assertRaisesRegex(verifier.ReplayError, "nonpositive"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["analytic_uniform_claim"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "asymptotic"):
            verifier._validate_contract(changed)

        for key in ("zeta_zero_table_read", "global_weil_positivity_assumed"):
            changed = deepcopy(self.payload40)
            changed["provenance"][key] = True
            with self.subTest(key=key), self.assertRaisesRegex(verifier.ReplayError, "provenance"):
                verifier._validate_contract(changed)

    def test_pinned_source_runtime_cached_boolean_and_dependency_tampers(self) -> None:
        changed_hashes = dict(producer.PINNED_SOURCE_SHA256)
        changed_hashes["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(producer.Checkpoint065Error, "pinned source"):
            producer.validate_pinned_source_hashes(changed_hashes)
        with self.assertRaisesRegex(verifier.ReplayError, "pinned source"):
            verifier._validate_pinned_source_hashes(changed_hashes)

        changed = deepcopy(self.payload40)
        changed["runtime"]["mpmath"] = "tampered"
        with self.assertRaisesRegex(verifier.ReplayError, "runtime"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["dependency_sha256"]["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(verifier.ReplayError, "dependency"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["shorted_reciprocal"]["passed"] = True
        changed["section_sha256"]["shorted_reciprocal"] = verifier._raw_hash(changed["shorted_reciprocal"])
        with self.assertRaisesRegex(verifier.ReplayError, "cached producer boolean"):
            verifier._validate_contract(changed)

    def test_artifact_manifest_hashes(self) -> None:
        lines = (ARTIFACTS / "SHA256SUMS").read_text().splitlines()
        self.assertEqual(len(lines), 5)
        for line in lines:
            expected, name = line.split("  ", 1)
            actual = hashlib.sha256((ARTIFACTS / name).read_bytes()).hexdigest()
            self.assertEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
