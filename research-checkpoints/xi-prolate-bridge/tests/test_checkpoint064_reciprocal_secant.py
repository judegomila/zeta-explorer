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

import checkpoint064_reciprocal_secant as producer  # noqa: E402
import checkpoint064_reciprocal_secant_replay as verifier  # noqa: E402


ARTIFACTS = ROOT / "artifacts" / "checkpoint064_reciprocal_secant"


def vector(values: list[str]) -> mp.matrix:
    return mp.matrix([mp.mpf(value) for value in values])


class Checkpoint064ReciprocalSecantTests(unittest.TestCase):
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

    def test_exact_inputs_binary64_duplicates_and_wrong_point_are_rejected(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce(2.0, 4, "1", 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce("2", 4, 1.0, 40)  # type: ignore[arg-type]
        with self.assertRaisesRegex(producer.Checkpoint064Error, "locked"):
            producer.produce("4", 4, "1", 40)
        with self.assertRaisesRegex(producer.Checkpoint064Error, "40 or 80"):
            producer.produce("2", 4, "1", 50)
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"lambda":2.0}')
        with self.assertRaisesRegex(verifier.ReplayError, "duplicate"):
            verifier.strict_json_loads('{"x":"1","x":"2"}')
        with self.assertRaisesRegex(verifier.ReplayError, "invalid"):
            verifier.strict_json_loads(b"\xff")
        for token in ("nan", "+inf", "-inf"):
            with self.subTest(token=token), self.assertRaisesRegex(
                verifier.ReplayError, "nonfinite"
            ):
                verifier.strict_json_loads(json.dumps({"x": token}))

    def test_source_lock_conventions_inventory_and_dependencies(self) -> None:
        verifier._validate_contract(self.payload40)
        payload = self.payload40
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertEqual(payload["claim_class"], "FINITE_POINT_DIAGNOSTIC")
        self.assertFalse(payload["analytic_uniform_claim"])
        self.assertIn("exp(-i*t*x)", payload["locked_conventions"]["fourier_transform"])
        self.assertIn("equation (3.19)", payload["locked_conventions"]["prime_block_sign"])
        self.assertIn("V_-n", payload["locked_conventions"]["inversion"])
        self.assertEqual(
            [item["n"] for item in payload["source_inventory"]["prime_powers"]],
            [2, 3, 4],
        )
        self.assertFalse(payload["provenance"]["zeta_zero_table_read"])
        self.assertFalse(payload["provenance"]["global_weil_positivity_assumed"])
        self.assertTrue(any("30-mode Galerkin" in item for item in payload["limitations"]))
        self.assertTrue(any("not outward-rounded" in item for item in payload["limitations"]))
        for pdf in (
            "vendor/CCM-ZST-2511.22755v1.pdf",
            "vendor/CCM-PROLATE-2310.18423v2.pdf",
        ):
            self.assertEqual(len(payload["dependency_sha256"][pdf]), 64)

    def test_coordinated_source_lock_mutation_is_rejected_by_immutable_pins(self) -> None:
        self.assertEqual(producer.PINNED_SOURCE_SHA256, verifier.PINNED_SOURCE_SHA256)
        changed = dict(producer.PINNED_SOURCE_SHA256)
        changed["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(producer.Checkpoint064Error, "pinned source"):
            producer.validate_pinned_source_hashes(changed)
        with self.assertRaisesRegex(verifier.ReplayError, "pinned source"):
            verifier._validate_pinned_source_hashes(changed)

        coordinated_payload = deepcopy(self.payload40)
        coordinated_payload["dependency_sha256"]["P0_SOURCE_LOCK.json"] = "0" * 64
        with self.assertRaisesRegex(verifier.ReplayError, "dependency hash"):
            verifier._validate_contract(coordinated_payload)

    def test_direct_and_transformed_limiting_projection_agree(self) -> None:
        mp.mp.dps = 70
        L = 2 * mp.log(2)
        direct, _pointwise_tail, _coefficient_tail = (
            producer._limiting_projection_direct(4, L, producer.ARITHMETIC_SUM_CUTOFF)
        )
        transformed, imaginary_defect = verifier._limiting_projection_transformed(
            4, L, mp.mpf(2), verifier.ARITHMETIC_SUM_CUTOFF
        )
        self.assertLess(verifier._max_abs(direct - transformed), mp.mpf("1e-55"))
        self.assertLess(imaginary_defect, mp.mpf("1e-65"))

    def test_unit_normalization_changes_the_locked_limiting_scalar(self) -> None:
        mp.mp.dps = 80
        case = self.payload80["normalization"]
        norm = mp.sqrt(33) / mp.power(2, mp.mpf(17) / 4)
        multiplier = 1 / norm
        self.assertLess(abs(mp.mpf(case["limiting_h_L2_norm"]) - norm), mp.mpf("1e-75"))
        self.assertLess(
            abs(mp.mpf(case["unit_normalization_limit_multiplier"]) - multiplier),
            mp.mpf("1e-75"),
        )
        self.assertNotEqual(multiplier, 1)
        self.assertNotEqual(
            mp.mpf(case["unit_normalized_limiting_Xi_transform_scalar"]),
            mp.mpf(case["source_limiting_Xi_transform_scalar"]),
        )
        self.assertFalse(case["unit_normalized_replacement_allowed"])

        changed = deepcopy(self.payload40)
        changed["normalization"]["unit_normalized_replacement_allowed"] = True
        changed["section_sha256"]["normalization"] = verifier._raw_hash(
            changed["normalization"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "normalization"):
            verifier.replay_payload(changed)

    def test_secant_geometry_and_D0_identity(self) -> None:
        mp.mp.dps = 80
        case = self.payload40["secant_geometry"]
        normalization = self.payload40["normalization"]
        source = self.payload40["source_geometry"]
        kappa = vector(normalization["kappa_modes_minusN_to_N"])
        z0 = vector(case["z0_limiting_projection_modes_minusN_to_N"])
        secant = vector(case["secant_t_modes_minusN_to_N"])
        alpha = mp.mpf(case["alpha"])
        beta = mp.mpf(case["beta"])
        d = mp.mpf(case["d_signed_residual_coordinate"])
        epsilon = mp.mpf(case["epsilon"])
        r = mp.mpf(source["residual_r"])
        b_perp = mp.mpf(case["b_perp_norm"])
        self.assertLess(verifier._max_abs(z0 - alpha * kappa - secant), mp.mpf("1e-35"))
        self.assertLess(abs((kappa.T * secant)[0]), mp.mpf("1e-35"))
        self.assertLess(abs(verifier._norm(secant) - beta), mp.mpf("1e-35"))
        self.assertLess(
            abs(
                mp.mpf(case["D0_direct"])
                - 2 * alpha * beta * d
                - beta**2 * epsilon
            ),
            mp.mpf("1e-35"),
        )
        self.assertLess(abs(r**2 - d**2 - b_perp**2), mp.mpf("1e-35"))
        self.assertGreater(epsilon, 0)
        self.assertGreater(mp.mpf(case["c2_fixed_window_capture"]), 0)

    def test_gaps_and_time_band_contraction_are_positive(self) -> None:
        source = self.payload40["source_geometry"]
        self.assertGreater(mp.mpf(source["even_gap_at_q"]), 0)
        self.assertGreater(mp.mpf(source["odd_gap_at_q"]), 0)
        self.assertGreaterEqual(mp.mpf(source["K_T_eigenvalue_min"]), 0)
        self.assertLessEqual(mp.mpf(source["K_T_eigenvalue_max"]), 1)
        self.assertLess(mp.mpf(source["hermitian_defect"]), mp.mpf("1e-35"))
        self.assertLess(
            mp.mpf(source["inversion_commutator_defect"]), mp.mpf("1e-35")
        )

    def test_soft_trace_reciprocal_and_block_bounds(self) -> None:
        case = self.payload40["reciprocal_soft_trace"]
        soft = mp.mpf(case["soft_trace_S"])
        upper = mp.mpf(case["r_times_H0_upper"])
        lower = mp.mpf(case["one_vector_block_lower"])
        remainder = mp.mpf(case["soft_trace_minus_block_lower_tilted_remainder"])
        self.assertGreater(soft, 0)
        self.assertGreaterEqual(upper, soft)
        self.assertLessEqual(lower, soft)
        self.assertGreaterEqual(remainder, 0)
        self.assertLess(abs(soft - lower - remainder), mp.mpf("1e-35"))
        self.assertGreaterEqual(mp.mpf(case["reciprocal_crowding_reserve"]), 1)

    def test_spectral_weights_reconstruct_profile_and_bounds(self) -> None:
        mp.mp.dps = 80
        profile = self.payload40["spectral_profile"]
        source = self.payload40["source_geometry"]
        reciprocal = self.payload40["reciprocal_soft_trace"]
        eigenvalues = [mp.mpf(value) for value in profile["B_eigenvalues"]]
        weights = [mp.mpf(value) for value in profile["K_weights_in_B_eigenbasis"]]
        r = mp.mpf(source["residual_r"])
        soft = mp.fsum(r * weight / (eigenvalue + r) for eigenvalue, weight in zip(eigenvalues, weights))
        H0 = mp.fsum(weight / eigenvalue for eigenvalue, weight in zip(eigenvalues, weights))
        self.assertTrue(all(value > 0 for value in eigenvalues))
        self.assertTrue(all(value >= 0 for value in weights))
        self.assertLess(abs(soft - mp.mpf(reciprocal["soft_trace_S"])), mp.mpf("1e-35"))
        self.assertLess(abs(H0 - mp.mpf(reciprocal["H0_reciprocal_trace"])), mp.mpf("1e-32"))
        for record in profile["reciprocal_tail_profile"]:
            self.assertGreaterEqual(mp.mpf(record["upper_minus_soft_trace"]), 0)
            self.assertGreaterEqual(mp.mpf(record["Phi"]), 0)
            self.assertGreaterEqual(mp.mpf(record["H_reciprocal_tail"]), 0)

    def test_fresh_independent_replays_match_stored_outputs(self) -> None:
        self.assertTrue(self.fresh40["replay_agrees"])
        self.assertTrue(self.fresh80["replay_agrees"])
        self.assertEqual(self.fresh40, self.stored40)
        self.assertEqual(self.fresh80, self.stored80)
        self.assertIn("Si/Ci", self.fresh40["independent_paths"]["time_band"])
        self.assertIn(
            "incomplete-gamma", self.fresh40["independent_paths"]["limiting_projection"]
        )
        self.assertIn("mpmath", self.fresh40["shared_library_limitation"])
        verifier_text = (
            ROOT / "verifier" / "checkpoint064_reciprocal_secant_replay.py"
        ).read_text()
        self.assertNotIn("import checkpoint064_reciprocal_secant", verifier_text)

    def test_doubled_precision_selected_values_are_stable(self) -> None:
        mp.mp.dps = 100
        selections = (
            ("source_geometry", "residual_r"),
            ("source_geometry", "even_gap_at_q"),
            ("secant_geometry", "alpha"),
            ("secant_geometry", "beta"),
            ("secant_geometry", "epsilon"),
            ("secant_geometry", "c2_fixed_window_capture"),
            ("secant_geometry", "r_over_epsilon"),
            ("reciprocal_soft_trace", "soft_trace_S"),
            ("reciprocal_soft_trace", "H0_reciprocal_trace"),
            ("reciprocal_soft_trace", "reciprocal_crowding_reserve"),
        )
        for section, field in selections:
            low = mp.mpf(self.payload40[section][field])
            high = mp.mpf(self.payload80[section][field])
            self.assertLess(
                abs(low - high) / max(1, abs(low), abs(high)),
                mp.mpf("1e-30"),
                f"{section}.{field}",
            )

    def test_repaired_hash_cannot_hide_omitted_secant_orthogonalization(self) -> None:
        changed = deepcopy(self.payload40)
        changed["secant_geometry"]["secant_t_modes_minusN_to_N"] = deepcopy(
            changed["secant_geometry"]["z0_limiting_projection_modes_minusN_to_N"]
        )
        changed["section_sha256"]["secant_geometry"] = verifier._raw_hash(
            changed["secant_geometry"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)

    def test_fourier_prime_gap_and_asymptotic_adversaries_are_rejected(self) -> None:
        changed = deepcopy(self.payload40)
        changed["locked_conventions"]["fourier_transform"] = (
            "hat(f)(t)=integral f(x)*exp(+i*t*x) dx"
        )
        with self.assertRaisesRegex(verifier.ReplayError, "convention"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_inventory"]["prime_powers"] = changed["source_inventory"][
            "prime_powers"
        ][:-1]
        changed["section_sha256"]["source_inventory"] = verifier._raw_hash(
            changed["source_inventory"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_geometry"]["even_gap_at_q"] = "0"
        changed["section_sha256"]["source_geometry"] = verifier._raw_hash(
            changed["source_geometry"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "nonpositive"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["analytic_uniform_claim"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "asymptotic"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["limitations"][-1] = (
            "real-axis eigenvalue agreement substitutes for locally uniform "
            "determinant convergence"
        )
        with self.assertRaisesRegex(verifier.ReplayError, "limitation"):
            verifier._validate_contract(changed)

    def test_zero_positivity_lambda_reflection_and_cached_boolean_adversaries(self) -> None:
        changed = deepcopy(self.payload40)
        changed["provenance"]["zeta_zero_table_read"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "provenance"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["provenance"]["global_weil_positivity_assumed"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "provenance"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["inputs"]["lambda"] = "4"
        with self.assertRaisesRegex(verifier.ReplayError, "lambda"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["locked_conventions"]["inversion"] = "reflection omitted"
        with self.assertRaisesRegex(verifier.ReplayError, "convention"):
            verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["normalization"]["passed"] = True
        changed["section_sha256"]["normalization"] = verifier._raw_hash(
            changed["normalization"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "cached producer boolean"):
            verifier._validate_contract(changed)

    def test_nonfinite_L_and_runtime_metadata_tampers_are_rejected(self) -> None:
        for token in ("nan", "inf", "-inf"):
            changed = deepcopy(self.payload40)
            changed["inputs"]["L"] = token
            with self.subTest(token=token), self.assertRaisesRegex(
                verifier.ReplayError, "nonfinite"
            ):
                verifier._validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["runtime"]["mpmath"] = "tampered"
        with self.assertRaisesRegex(verifier.ReplayError, "runtime"):
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
