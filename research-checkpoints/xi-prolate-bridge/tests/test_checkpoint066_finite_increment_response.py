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

import checkpoint066_finite_increment_response as producer  # noqa: E402
import checkpoint066_finite_increment_response_replay as verifier  # noqa: E402


ARTIFACTS = ROOT / "artifacts" / "checkpoint066_finite_increment_response"


class Checkpoint066FiniteIncrementResponseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.raw40 = (ARTIFACTS / "lambda2_N4_T1_dps40_producer.json").read_bytes()
        cls.raw80 = (ARTIFACTS / "lambda2_N4_T1_dps80_producer.json").read_bytes()
        cls.payload40 = verifier.strict_json_loads(cls.raw40)
        cls.payload80 = verifier.strict_json_loads(cls.raw80)
        cls.stored40 = json.loads(
            (ARTIFACTS / "lambda2_N4_T1_dps40_replay.json").read_text()
        )
        cls.stored80 = json.loads(
            (ARTIFACTS / "lambda2_N4_T1_dps80_replay.json").read_text()
        )
        cls.fresh40 = verifier.replay_payload(
            deepcopy(cls.payload40), verifier._sha256_bytes(cls.raw40)
        )
        cls.fresh80 = verifier.replay_payload(
            deepcopy(cls.payload80), verifier._sha256_bytes(cls.raw80)
        )

    def test_exact_inputs_and_strict_json_fail_closed(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce("2", 4, 1.0, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.Checkpoint066Error, "locked"):
            producer.produce("4", 4, "1", 40)
        with self.assertRaisesRegex(producer.Checkpoint066Error, "40 or 80"):
            producer.produce("2", 4, "1", 60)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"x":1.0}')
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier.strict_json_loads('{"x":"1","x":"2"}')
        with self.assertRaisesRegex(verifier.ReplayError, "invalid"):
            verifier.strict_json_loads(b"\xff")
        for token in ("nan", "inf", "-inf"):
            with self.subTest(token=token), self.assertRaisesRegex(
                verifier.ReplayError, "nonfinite"
            ):
                verifier.strict_json_loads(json.dumps({"x": token}))

        changed = deepcopy(self.payload40)
        changed["inputs"]["L"] = mp.nstr(
            mp.mpf(changed["inputs"]["L"]) + mp.mpf("1e-15"), 40
        )
        with self.assertRaisesRegex(verifier.ReplayError, "noncanonical"):
            verifier._validate_contract(changed)

    def test_contract_source_lock_normalization_and_dependencies(self) -> None:
        verifier._validate_contract(self.payload40)
        payload = self.payload40
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["claim_class"], "FINITE_POINT_DIAGNOSTIC")
        self.assertFalse(payload["analytic_uniform_claim"])
        self.assertIn("only U=q", payload["provenance"]["ground_transfer_scope"])
        self.assertIn("extra q-U term", payload["provenance"]["ground_transfer_scope"])
        self.assertIn("A_R", payload["provenance"]["ground_transfer_scope"])
        self.assertIn("not included", payload["provenance"]["source_cauchy_factor_replay"])
        self.assertTrue(any("Ritz shift U<q" in item for item in payload["limitations"]))
        self.assertTrue(any("A_R" in item for item in payload["limitations"]))
        self.assertTrue(any("det O_s" in item for item in payload["limitations"]))
        self.assertIn(
            "exp(-i*t*x)", payload["locked_conventions"]["fourier_transform"]
        )
        self.assertIn(
            "equation (3.19)", payload["locked_conventions"]["prime_block_sign"]
        )
        guard = payload["source_guard"]
        self.assertEqual(guard["prime_power_inventory"], [2, 3, 4])
        self.assertGreater(mp.mpf(guard["even_gap_at_q"]), 0)
        self.assertGreater(mp.mpf(guard["odd_gap_at_q"]), 0)
        self.assertGreaterEqual(mp.mpf(guard["K_T_minimum_eigenvalue"]), 0)
        self.assertLessEqual(mp.mpf(guard["K_T_maximum_eigenvalue"]), 1)
        regression = payload["normalization_regression"]
        self.assertFalse(regression["unit_normalized_replacement_allowed"])
        self.assertNotEqual(
            mp.mpf(regression["source_limiting_Xi_transform_scalar"]),
            mp.mpf(regression["unit_normalized_limiting_Xi_transform_scalar"]),
        )
        self.assertTrue(
            {
                "src/prolate_state.py",
                "src/weil_matrix.py",
                "verifier/independent_replay.py",
                "notes/SECANT_BULK_POSITIVE_DETERMINANT_RESPONSE.md",
                "notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md",
                "notes/SECANT_GRAPH_SIGNED_LEAKAGE_GATE.md",
                "DIRECT_RH_ATTACK.md",
                "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md",
                "notes/PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md",
                "notes/PROLATE_COMPLETE_LEAKAGE_HIGHER_RITZ_NO_GO.md",
                "notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md",
                "notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md",
                "notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md",
                "notes/RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md",
            }.issubset(payload["dependency_sha256"])
        )

    def test_live_two_vector_ritz_shift_and_sector_gaps(self) -> None:
        ritz = self.payload80["ritz_geometry"]
        q = mp.mpf(ritz["q"])
        u = mp.mpf(ritz["two_dimensional_ritz_u"])
        rho = mp.mpf(ritz["residual_r"])
        c_R = mp.mpf(ritz["c_R"])
        expected = (q + c_R - mp.sqrt((c_R - q) ** 2 + 4 * rho**2)) / 2
        self.assertLess(abs(u - expected), mp.mpf("1e-70"))
        self.assertLess(u, q)
        self.assertGreater(mp.mpf(ritz["q_minus_u"]), 0)
        self.assertLess(
            mp.mpf(ritz["residual_direction_norm_defect"]), mp.mpf("1e-70")
        )
        self.assertLess(
            abs(mp.mpf(ritz["ritz_characteristic_residual"])), mp.mpf("1e-70")
        )

        response = self.payload80["finite_increment_response"]
        q_case = response["raw_q"]
        u_case = response["two_dimensional_ritz_u"]
        self.assertEqual(response["shift_order"], ["raw_q", "two_dimensional_ritz_u"])
        self.assertEqual(mp.mpf(q_case["q_minus_U"]), 0)
        self.assertGreater(mp.mpf(q_case["odd_gap_at_U"]), 0)
        self.assertGreater(mp.mpf(u_case["odd_gap_at_U"]), mp.mpf(q_case["odd_gap_at_U"]))
        self.assertLess(
            abs(
                mp.mpf(u_case["odd_gap_at_U"])
                - mp.mpf(q_case["odd_gap_at_U"])
                - mp.mpf(ritz["q_minus_u"])
            ),
            mp.mpf("1e-70"),
        )

    def test_finite_log_increment_equivalence_and_bounds(self) -> None:
        response = self.payload80["finite_increment_response"]
        self.assertEqual(mp.mpf(response["theta"]), 1)
        self.assertEqual(
            mp.mpf(response["homotopy_increment_s_equals_theta_r"]),
            mp.mpf(response["ridge_r"]),
        )
        for label in response["shift_order"]:
            with self.subTest(label=label):
                case = response[label]
                F = mp.mpf(case["log_increment_F"])
                S = mp.mpf(case["soft_trace_S"])
                self.assertGreater(F, 0)
                self.assertGreater(S, 0)
                self.assertLessEqual(F, S)
                self.assertLessEqual(S, F / mp.log(2))
                self.assertLess(
                    abs(S - mp.mpf(case["X_trace"])), mp.mpf("1e-70")
                )
                x_values = [mp.mpf(value) for value in case["X_eigenvalues"]]
                self.assertGreaterEqual(min(x_values), 0)
                self.assertLessEqual(max(x_values), 1)
                self.assertLess(
                    abs(
                        mp.mpf(case["determinant_ratio"])
                        - mp.exp(F)
                    ),
                    mp.mpf("1e-70"),
                )

    def test_nested_secant_increment_and_nonlinear_bounds(self) -> None:
        response = self.payload80["finite_increment_response"]
        for label in response["shift_order"]:
            with self.subTest(label=label):
                case = response[label]
                nested = case["nested_secant"]
                F = mp.mpf(case["log_increment_F"])
                S = mp.mpf(case["soft_trace_S"])
                G = mp.mpf(nested["G_bulk_increment"])
                J = mp.mpf(nested["J_graph_increment"])
                H_bulk = mp.mpf(nested["H_bulk"])
                H_graph = mp.mpf(nested["H_graph"])
                self.assertGreater(mp.mpf(nested["short_delta"]), 0)
                self.assertGreater(mp.mpf(nested["delta_plus"]), 0)
                self.assertLess(abs(F - G - J), mp.mpf("1e-69"))
                self.assertLess(abs(S - H_bulk - H_graph), mp.mpf("1e-69"))
                self.assertLessEqual(G, H_bulk)
                self.assertLessEqual(H_bulk, G / mp.log(2))
                self.assertLessEqual(mp.expm1(J), H_graph)
                self.assertLessEqual(H_graph, 2 * (-mp.expm1(-J)))
                for field in (
                    "short_delta_determinant_residual",
                    "delta_plus_determinant_residual",
                    "soft_split_residual",
                    "F_minus_G_plus_J",
                ):
                    self.assertLess(abs(mp.mpf(nested[field])), mp.mpf("1e-69"), field)

    def test_doubled_precision_selected_values_are_stable(self) -> None:
        low = self.payload40
        high = self.payload80
        ritz_fields = ("two_dimensional_ritz_u", "q_minus_u", "c_R")
        for field in ritz_fields:
            left = mp.mpf(low["ritz_geometry"][field])
            right = mp.mpf(high["ritz_geometry"][field])
            self.assertLess(
                abs(left - right) / max(1, abs(left), abs(right)),
                mp.mpf("1e-30"),
                field,
            )
        for label in ("raw_q", "two_dimensional_ritz_u"):
            for field in ("soft_trace_S", "log_increment_F", "odd_gap_at_U"):
                left = mp.mpf(low["finite_increment_response"][label][field])
                right = mp.mpf(high["finite_increment_response"][label][field])
                self.assertLess(
                    abs(left - right) / max(1, abs(left), abs(right)),
                    mp.mpf("1e-30"),
                    f"{label}.{field}",
                )

    def test_fresh_independent_replays_match_stored_outputs(self) -> None:
        self.assertTrue(self.fresh40["replay_agrees"])
        self.assertTrue(self.fresh80["replay_agrees"])
        self.assertEqual(self.fresh40, self.stored40)
        self.assertEqual(self.fresh80, self.stored80)
        self.assertEqual(len(self.fresh40["independent_gates"]), 45)
        self.assertIn(
            "summed logarithms",
            self.fresh40["independent_paths"]["log_determinants"],
        )
        verifier_text = (
            ROOT / "verifier" / "checkpoint066_finite_increment_response_replay.py"
        ).read_text()
        self.assertNotIn("import checkpoint066_finite_increment_response", verifier_text)

    def test_repaired_hash_cannot_hide_numeric_or_normalization_tamper(self) -> None:
        changed = deepcopy(self.payload40)
        changed["finite_increment_response"]["raw_q"]["log_increment_F"] = "1"
        changed["section_sha256"]["finite_increment_response"] = verifier._raw_hash(
            changed["finite_increment_response"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)

        changed = deepcopy(self.payload40)
        changed["ritz_geometry"]["two_dimensional_ritz_u"] = changed["ritz_geometry"]["q"]
        changed["section_sha256"]["ritz_geometry"] = verifier._raw_hash(
            changed["ritz_geometry"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)

        changed = deepcopy(self.payload40)
        changed["normalization_regression"]["unit_normalized_replacement_allowed"] = True
        changed["section_sha256"]["normalization_regression"] = verifier._raw_hash(
            changed["normalization_regression"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "normalization"):
            verifier.replay_payload(changed)

    def test_source_convention_gap_claim_and_provenance_adversaries(self) -> None:
        changed = deepcopy(self.payload40)
        changed["locked_conventions"]["fourier_transform"] = (
            "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"
        )
        with self.assertRaisesRegex(verifier.ReplayError, "convention"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_guard"]["prime_power_inventory"] = [2, 3]
        changed["section_sha256"]["source_guard"] = verifier._raw_hash(
            changed["source_guard"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_guard"]["odd_gap_at_q"] = "0"
        changed["section_sha256"]["source_guard"] = verifier._raw_hash(
            changed["source_guard"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "nonpositive"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["analytic_uniform_claim"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "asymptotic"):
            verifier._validate_contract(changed)

        for key in ("zeta_zero_table_read", "global_weil_positivity_assumed"):
            changed = deepcopy(self.payload40)
            changed["provenance"][key] = True
            with self.subTest(key=key), self.assertRaisesRegex(
                verifier.ReplayError, "provenance"
            ):
                verifier._validate_contract(changed)

    def test_pinned_source_runtime_cached_boolean_and_dependency_tampers(self) -> None:
        changed_hashes = dict(producer.PINNED_SOURCE_SHA256)
        changed_hashes["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(producer.Checkpoint066Error, "pinned source"):
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
        changed["dependency_sha256"][
            "notes/RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md"
        ] = "0" * 64
        with self.assertRaisesRegex(verifier.ReplayError, "dependency"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["finite_increment_response"]["passed"] = True
        changed["section_sha256"]["finite_increment_response"] = verifier._raw_hash(
            changed["finite_increment_response"]
        )
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
