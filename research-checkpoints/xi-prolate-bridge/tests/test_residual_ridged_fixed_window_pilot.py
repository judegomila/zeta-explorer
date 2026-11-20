from __future__ import annotations

from copy import deepcopy
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "verifier"))

import residual_ridged_fixed_window_pilot as producer  # noqa: E402
import residual_ridged_fixed_window_replay as verifier  # noqa: E402


ARTIFACTS = ROOT / "artifacts" / "residual_ridged_fixed_window"


class ResidualRidgedFixedWindowPilotTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.raw40 = (ARTIFACTS / "lambda2_N4_T1_dps40_producer.json").read_bytes()
        cls.payload40 = verifier.strict_json_loads(cls.raw40)
        cls.replay40 = verifier.strict_json_loads(
            (ARTIFACTS / "lambda2_N4_T1_dps40_replay.json").read_bytes(),
            "stored replay",
        )
        cls.raw80 = (ARTIFACTS / "lambda2_N4_T1_dps80_producer.json").read_bytes()
        cls.payload80 = verifier.strict_json_loads(cls.raw80)
        cls.replay80 = verifier.strict_json_loads(
            (ARTIFACTS / "lambda2_N4_T1_dps80_replay.json").read_bytes(),
            "stored replay",
        )
        cls.fresh_replay40 = verifier.replay_payload(
            deepcopy(cls.payload40), verifier._sha256_bytes(cls.raw40)
        )
        cls.fresh_replay80 = verifier.replay_payload(
            deepcopy(cls.payload80), verifier._sha256_bytes(cls.raw80)
        )

    def test_exact_text_and_binary64_parameters_are_rejected(self) -> None:
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce_pilot(2.0, 4, "1", 30, 8)  # type: ignore[arg-type]
        with self.assertRaisesRegex(TypeError, "binary64"):
            producer.produce_pilot("2", 4, 1.0, 30, 8)  # type: ignore[arg-type]
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.strict_json_loads('{"lambda": 2.0}')
        changed = deepcopy(self.payload40)
        changed["inputs"]["lambda"] = 2.0
        with self.assertRaisesRegex(verifier.ReplayError, "binary64"):
            verifier.validate_contract(changed)

    def test_locked_fourier_prime_and_normalization_provenance(self) -> None:
        verifier.validate_contract(self.payload40)
        self.assertEqual(self.payload40["inputs"]["T"], "1")
        self.assertEqual(
            [item["n"] for item in self.payload40["source_inventory"]["prime_powers"]],
            [2, 3, 4],
        )
        self.assertEqual(self.payload40["locked_conventions"]["prime_block_sign"], "minus")
        self.assertEqual(
            self.payload40["locked_conventions"]["Fourier_sign"],
            producer.FOURIER_CONVENTION,
        )
        self.assertEqual(
            self.payload40["locked_conventions"]["prolate_normalization"],
            "source_limit_h",
        )
        self.assertEqual(self.payload40["runtime"]["mpmath"], mp.__version__)
        self.assertEqual(self.payload40["runtime"]["python"], sys.version.split()[0])

    def test_fourier_sign_prime_omission_and_unit_normalization_are_rejected(self) -> None:
        changed = deepcopy(self.payload40)
        changed["locked_conventions"]["Fourier_sign"] = changed["locked_conventions"][
            "Fourier_sign"
        ].replace("+2*pi", "-2*pi")
        with self.assertRaisesRegex(verifier.ReplayError, "Fourier_sign"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_inventory"]["prime_powers"].pop()
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["normalization"]["unit_normalized_replacement_allowed"] = True
        with self.assertRaisesRegex(verifier.ReplayError, "unit-normalized"):
            verifier.validate_contract(changed)

    def test_prime_inventory_rejects_trailing_junk_and_wrong_shape(self) -> None:
        changed = deepcopy(self.payload40)
        changed["source_inventory"]["prime_powers"].append("junk")
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power inventory"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["source_inventory"]["prime_powers"][0]["unchecked"] = "junk"
        with self.assertRaisesRegex(verifier.ReplayError, "prime-power inventory"):
            verifier.validate_contract(changed)

    def test_direct_quadrature_and_analytic_time_band_assemblies_agree(self) -> None:
        mp.mp.dps = 70
        N = 3
        # L=8 puts nonzero Fourier frequencies inside [-T,T], exercising
        # removable nodes and both Si/Ci sign branches.
        L = mp.mpf("8")
        T = mp.mpf("1")
        # Select the nonconstant even Fourier modes as a deterministic test
        # subspace.  No source matrix or producer K_T is supplied to the
        # analytic path.
        complement = mp.matrix(N + 1, N)
        for j in range(N):
            complement[j + 1, j] = 1
        direct, _ = producer.time_band_quadrature(N, L, T, complement)
        even, _ = verifier._sector_bases(N)
        analytic_full = verifier.time_band_analytic_full(N, L, T)
        analytic = complement.T * (even.T * analytic_full * even) * complement
        defect = verifier._max_abs(direct - analytic)
        self.assertLess(defect, mp.mpf("1e-45"))

    def test_time_band_is_hermitian_positive_contraction(self) -> None:
        mp.mp.dps = 60
        raw = self.payload40["raw_values"]["K_T_even_complement"]
        K = verifier._matrix_from_text(raw, "K_T")
        values, _ = mp.eigsy((K + K.T) / 2)
        self.assertLess(verifier._max_abs(K - K.T), mp.mpf("1e-35"))
        self.assertGreater(values[0], -mp.mpf("1e-35"))
        self.assertLess(values[-1], 1 + mp.mpf("1e-35"))

    def test_nonpositive_raw_q_sector_gap_is_rejected(self) -> None:
        mp.mp.dps = 50
        with self.assertRaisesRegex(producer.PilotInputError, "even-complement"):
            producer.require_positive_source_gates(mp.matrix([[-1]]), mp.matrix([[1]]))
        with self.assertRaisesRegex(producer.PilotInputError, "odd-sector"):
            producer.require_positive_source_gates(mp.matrix([[1]]), mp.matrix([[0]]))

    def test_physical_splice_inequality_and_complete_schur_are_serialized(self) -> None:
        mp.mp.dps = 60
        scalars = self.payload40["scalars"]
        lhs = mp.mpf(scalars["splice_lhs"])
        rhs = mp.mpf(scalars["splice_rhs"])
        slack = mp.mpf(scalars["splice_slack"])
        self.assertGreater(mp.mpf(scalars["regularized_physical_schur"]), 0)
        self.assertGreaterEqual(slack, 0)
        self.assertAlmostEqual(float(rhs - lhs), float(slack), places=14)
        self.assertIn(
            "H[H(B+rI)H]^-1H",
            self.payload40["physical_splice"]["schur_definition"],
        )

    def test_doubled_precision_artifacts_are_stable(self) -> None:
        mp.mp.dps = 100
        self.assertTrue(self.fresh_replay40["replay_agrees"])
        self.assertTrue(self.fresh_replay80["replay_agrees"])
        self.assertEqual(
            self.fresh_replay40["producer_sha256"], self.replay40["producer_sha256"]
        )
        self.assertEqual(
            self.fresh_replay80["producer_sha256"], self.replay80["producer_sha256"]
        )
        self.assertEqual(self.fresh_replay40, self.replay40)
        self.assertEqual(self.fresh_replay80, self.replay80)
        for name in (
            "q",
            "r",
            "even_gap_at_q",
            "odd_gap_at_q",
            "soft_trace",
            "splice_slack",
        ):
            low = mp.mpf(self.payload40["scalars"][name])
            high = mp.mpf(self.payload80["scalars"][name])
            self.assertLess(abs(low - high) / max(1, abs(high)), mp.mpf("1e-30"))

    def test_independent_source_replay_reconstructs_the_pilot(self) -> None:
        result = self.fresh_replay40
        self.assertTrue(result["replay_agrees"])
        self.assertTrue(all(result["independently_reconstructed_gates"].values()))
        self.assertIn("Si/Ci", result["formula_paths"]["time_band"])
        self.assertTrue(result["producer_values_used_only_for_comparison"])

    def test_reported_nonpositive_gap_and_raw_matrix_tamper_are_rejected(self) -> None:
        changed = deepcopy(self.payload40)
        changed["scalars"]["even_gap_at_q"] = "0"
        # Repairing the raw-value hashes cannot make a false reported gap
        # pass, because the verifier reconstructs it from source parameters.
        changed["raw_value_sha256"]["scalars.even_gap_at_q"] = verifier._raw_hash("0")
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)

        changed = deepcopy(self.payload40)
        changed["raw_values"]["K_T_even_complement"][0][0] = "0"
        with self.assertRaisesRegex(verifier.ReplayError, "hash mismatch"):
            verifier.validate_contract(changed)

    def test_derived_claim_tampers_are_rejected(self) -> None:
        for section, name in (
            ("inputs", "L"),
            ("normalization", "a4"),
            ("normalization", "h_zero_integral_defect"),
            ("matrix_structural_values", "inversion_commutator_defect"),
        ):
            with self.subTest(section=section, name=name):
                changed = deepcopy(self.payload40)
                changed[section][name] = "0.125"
                with self.assertRaisesRegex(verifier.ReplayError, "hash mismatch"):
                    verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["physical_splice"]["schur_definition"] += " + 0"
        with self.assertRaisesRegex(verifier.ReplayError, "schur_definition"):
            verifier.validate_contract(changed)

        changed = deepcopy(self.payload40)
        changed["time_band_quadrature_nodes"][1] = "0.125"
        with self.assertRaisesRegex(verifier.ReplayError, "hash mismatch"):
            verifier.validate_contract(changed)

        # Even if an attacker repairs all affected raw hashes, source replay
        # independently reconstructs each derived value and rejects the set.
        changed = deepcopy(self.payload40)
        for section, name in (
            ("inputs", "L"),
            ("normalization", "a4"),
            ("normalization", "h_zero_integral_defect"),
            ("matrix_structural_values", "inversion_commutator_defect"),
        ):
            changed[section][name] = "0.125"
            key = f"{section}.{name}"
            changed["raw_value_sha256"][key] = verifier._raw_hash("0.125")
        changed["time_band_quadrature_nodes"][1] = "0.125"
        changed["raw_value_sha256"]["time_band_quadrature_nodes"] = verifier._raw_hash(
            changed["time_band_quadrature_nodes"]
        )
        with self.assertRaisesRegex(verifier.ReplayError, "disagreement"):
            verifier.replay_payload(changed)


if __name__ == "__main__":
    unittest.main()
