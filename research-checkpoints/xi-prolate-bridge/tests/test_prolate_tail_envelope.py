import json
from fractions import Fraction
from pathlib import Path
import unittest

import mpmath as mp

from prolate_tail_envelope import (
    LOCKED_A4_FORMULA,
    LOCKED_BETA_FORMULA,
    LOCKED_BUMP_TERM,
    LOCKED_CPSI_FORMULA,
    LOCKED_D_FORMULA,
    LOCKED_DEFECT_FORMULA,
    LOCKED_ENDPOINT_TERM,
    LOCKED_FOURIER_CONVENTION,
    LOCKED_MODE_TERM,
    parse_lambda_fraction,
    prolate_tail_envelope,
    require_locked_formulas,
    serialize_prolate_tail,
)


ROOT = Path(__file__).resolve().parents[1]


class ProlateTailEnvelopeTests(unittest.TestCase):
    def setUp(self):
        mp.mp.dps = 100

    def test_lambda2_exact_integer_data_and_strict_hypotheses(self):
        bound = prolate_tail_envelope("2", 12, 80)
        self.assertEqual(bound.lambda_exact, Fraction(2))
        self.assertEqual(bound.shannon_floor, 16)
        self.assertEqual(bound.leading_gap_integer, 5)
        self.assertEqual(bound.prime_cutoff, 4)
        self.assertLessEqual(bound.D.upper, mp.mpf("0.5"))
        self.assertLess(bound.primitive_defect_constant.upper, 8)
        self.assertGreater(bound.mu_margin.lower, 0)

    def test_combined_bound_contains_sum_of_separate_blocks(self):
        bound = prolate_tail_envelope("2", 12, 80)
        self.assertLessEqual(
            bound.total_bound.lower,
            bound.mode_term.lower + bound.bump_term.lower,
        )
        self.assertGreaterEqual(
            bound.total_bound.upper,
            bound.mode_term.upper + bound.bump_term.upper,
        )
        self.assertGreater(bound.mode_term.lower, bound.bump_term.upper)
        self.assertGreater(bound.corrected_endpoint_bound.lower, 0)
        self.assertLess(bound.corrected_endpoint_bound.upper, bound.total_bound.lower)

    def test_explicit_bump_constant_is_finite_and_below_rational_decimal(self):
        bound = prolate_tail_envelope("2", 12, 80)
        self.assertGreater(bound.Cpsi.lower, 43)
        self.assertLess(bound.Cpsi.upper, mp.mpf("43.408"))

    def test_binary64_and_subthreshold_lambda_are_rejected(self):
        for value in (2.0, mp.mpf("2")):
            with self.subTest(value=type(value).__name__):
                with self.assertRaises(TypeError):
                    parse_lambda_fraction(value)  # type: ignore[arg-type]
                with self.assertRaises(TypeError):
                    prolate_tail_envelope(value, 12, 80)  # type: ignore[arg-type]
        for value in ("1.999", "3/2"):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    prolate_tail_envelope(value, 12, 80)

    def test_fourier_sign_mutation_is_rejected(self):
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2", 12, 80, fourier="exp(-2*pi*i*x*xi)"
            )

    def test_lambda_vs_lambda_squared_and_krd_exponent_mutations_are_rejected(self):
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2", 12, 80, beta="(2/pi^2)*log(200*lambda+25)"
            )
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2",
                12,
                80,
                D_formula="10*exp(-(floor(2*lambda^2)-11)/beta)",
            )

    def test_unsquared_concentration_and_wrong_mode_constant_are_rejected(self):
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2", 12, 80, defect="d_n=1-chi_n"
            )
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2",
                12,
                80,
                mode_term=(
                    "8*pi*a4*(1+2*sqrt(2)*lambda)*lambda^(3/2)*sqrt(D)"
                ),
            )
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2",
                12,
                80,
                endpoint_term=(
                    "16*pi*a4*(1+2*sqrt(2)*lambda)*sqrt(lambda^2*D)"
                ),
            )

    def test_unit_norm_combination_normalization_is_rejected(self):
        with self.assertRaises(ValueError):
            prolate_tail_envelope(
                "2", 12, 80, normalization="unit_norm_h_lambda"
            )

    def test_all_lock_strings_are_serialized_verbatim(self):
        payload = serialize_prolate_tail(prolate_tail_envelope("2", 12, 80))
        formulas = payload["locked_formulas"]
        self.assertEqual(formulas["Fourier"], LOCKED_FOURIER_CONVENTION)
        self.assertEqual(formulas["beta"], LOCKED_BETA_FORMULA)
        self.assertEqual(formulas["concentration"], LOCKED_DEFECT_FORMULA)
        self.assertEqual(formulas["D"], LOCKED_D_FORMULA)
        self.assertEqual(formulas["a4"], LOCKED_A4_FORMULA)
        self.assertEqual(formulas["Cpsi"], LOCKED_CPSI_FORMULA)
        self.assertEqual(formulas["mode_term"], LOCKED_MODE_TERM)
        self.assertEqual(formulas["bump_term"], LOCKED_BUMP_TERM)
        self.assertEqual(formulas["endpoint_term"], LOCKED_ENDPOINT_TERM)
        self.assertFalse(payload["full_residual_claim"])
        self.assertFalse(payload["equation_5_2_claim"])
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")

    def test_source_hashes_match_p2_lock(self):
        payload = serialize_prolate_tail(prolate_tail_envelope("2", 12, 80))
        lock = json.loads((ROOT / "P2_SOURCE_LOCK.json").read_text())
        self.assertEqual(
            payload["source_chain"]["KRD_sha256"],
            lock["binding_sources"][0]["vendored_sha256"],
        )
        self.assertEqual(
            payload["source_chain"]["dependency_sha256"],
            lock["binding_sources"][1]["vendored_sha256"],
        )

    def test_far_prime_pairing_bound_tracks_N_and_remains_positive(self):
        small = prolate_tail_envelope("2", 2, 80)
        large = prolate_tail_envelope("2", 12, 80)
        self.assertGreater(small.far_prime_pairing.lower, 0)
        self.assertGreater(large.far_prime_pairing.lower, 0)
        self.assertGreater(large.test_vector_C.lower, small.test_vector_C.upper)
        self.assertGreater(large.far_prime_pairing.lower, small.far_prime_pairing.upper)

    def test_require_locked_formulas_accepts_only_exact_source_contract(self):
        require_locked_formulas()
        with self.assertRaises(ValueError):
            require_locked_formulas(Cpsi="unspecified O(1)")


if __name__ == "__main__":
    unittest.main()
