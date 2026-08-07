import hashlib
import json
from pathlib import Path
import sys
import unittest

import mpmath as mp

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from chebyshev_hankel_bound import (
    LOCKED_KERNEL_FORMULA,
    LOCKED_PNT_A,
    LOCKED_PNT_ALPHA,
    LOCKED_PNT_FORMULA,
    LOCKED_SOURCE_SHA256,
    chebyshev_hankel_moments,
    require_locked_source,
    serialize_chebyshev_hankel,
)

class ChebyshevHankelBoundTests(unittest.TestCase):
    def setUp(self):
        mp.mp.dps = 100

    def test_uniform_moment_bounds_are_finite_and_positive(self):
        result = chebyshev_hankel_moments(80)
        self.assertGreater(result.C_minus1_upper_expression.lower, 0)
        self.assertGreater(result.C0_upper.lower, 0)
        self.assertGreater(result.C1_upper.lower, result.C0_upper.upper)
        self.assertLess(result.C_minus1_upper_expression.upper, 1012)
        self.assertLess(result.C0_upper.upper, 159)
        self.assertLess(result.C1_upper.upper, 794)

    def test_square_root_intervals_cover_squared_bounds(self):
        result = chebyshev_hankel_moments(80)
        self.assertLessEqual(
            result.C0_upper.lower**2,
            result.C0_squared_upper_expression.upper,
        )
        self.assertGreaterEqual(
            result.C0_upper.upper**2,
            result.C0_squared_upper_expression.lower,
        )
        self.assertLessEqual(
            result.C1_upper.lower**2,
            result.C1_squared_upper_expression.upper,
        )
        self.assertGreaterEqual(
            result.C1_upper.upper**2,
            result.C1_squared_upper_expression.lower,
        )

    def test_old_abstract_decimal_and_changed_alpha_are_rejected(self):
        with self.assertRaises(ValueError):
            chebyshev_hankel_moments(80, A="9.22106")
        with self.assertRaises(ValueError):
            chebyshev_hankel_moments(80, alpha="0.8476")

    def test_split_or_sign_mutated_kernel_is_rejected(self):
        with self.assertRaises(ValueError):
            chebyshev_hankel_moments(
                80,
                kernel_formula=(
                    "delta_star(x)=1-exp(-x)*psi(exp(x))"
                ),
            )
        with self.assertRaises(ValueError):
            chebyshev_hankel_moments(
                80,
                kernel_formula=(
                    "delta_star(x)=1+exp(-x)*psi(exp(x))-(1/2)*exp(-x)*log(1-exp(-2*x))"
                ),
            )

    def test_pnt_parenthesization_mutation_is_rejected(self):
        with self.assertRaises(ValueError):
            chebyshev_hankel_moments(
                80,
                pnt_formula=(
                    "abs(psi(X)-X)/X < A*(log X)^(3/2)*exp(-alpha*log X)"
                ),
            )

    def test_precision_must_be_exact_integer(self):
        for value in (80.0, mp.mpf("80"), True):
            with self.subTest(value=type(value).__name__):
                with self.assertRaises(TypeError):
                    chebyshev_hankel_moments(value)  # type: ignore[arg-type]
        with self.assertRaises(ValueError):
            chebyshev_hankel_moments(20)

    def test_v3_pdf_hash_and_lock_formula_match(self):
        lock = json.loads((ROOT / "P3_SOURCE_LOCK.json").read_text())
        source = lock["binding_sources"][0]
        pdf = ROOT / source["vendored_path"]
        digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
        self.assertEqual(digest, LOCKED_SOURCE_SHA256)
        self.assertEqual(digest, source["vendored_sha256"])
        self.assertIn(LOCKED_PNT_A, lock["locked_formulas"]["source_bound"])
        self.assertIn(LOCKED_PNT_ALPHA, lock["locked_formulas"]["source_bound"])

    def test_serialization_preserves_claim_boundary_and_raw_intervals(self):
        payload = serialize_chebyshev_hankel(chebyshev_hankel_moments(80))
        self.assertEqual(payload["terminal_state"], "P0_INVALIDATED")
        self.assertFalse(payload["signed_lower_bound_claim"])
        self.assertFalse(payload["equation_5_2_claim"])
        self.assertEqual(payload["locked_formulas"]["PNT"], LOCKED_PNT_FORMULA)
        self.assertEqual(
            payload["locked_formulas"]["combined_kernel"], LOCKED_KERNEL_FORMULA
        )
        for value in payload["outward_intervals"].values():
            self.assertEqual(len(value), 2)
            self.assertTrue(all(isinstance(endpoint, str) for endpoint in value))

    def test_require_locked_source_accepts_exact_contract(self):
        require_locked_source()


if __name__ == "__main__":
    unittest.main()
