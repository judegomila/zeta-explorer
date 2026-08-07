from __future__ import annotations

from pathlib import Path
import sys
import unittest

import mpmath as mp

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from anisotropic_schur import anisotropic_schur_point_bound


class AnisotropicSchurTests(unittest.TestCase):
    def setUp(self) -> None:
        mp.mp.dps = 70

    def test_scalar_Schur_fails_while_matrix_lower_model_succeeds(self) -> None:
        low = mp.matrix([[1, 0], [0, 1000]])
        coupling = mp.matrix([[mp.mpc(0, "0.9"), 10]])
        high = mp.matrix([[1]])
        report = anisotropic_schur_point_bound(low, coupling, high)

        scalar_bound = 1 - (mp.mpf("0.9") ** 2 + 10**2)
        self.assertLess(scalar_bound, 0)
        self.assertGreater(report["lower_schur_floor"], 0)
        self.assertTrue(report["finite_point_positivity"])
        self.assertGreaterEqual(
            report["exact_S_minus_S0_floor"], -mp.mpf("1e-60")
        )

    def test_complex_forcing_bound_covers_direct_solution(self) -> None:
        low = mp.matrix([[1, mp.mpc("0.02", "0.01")], [mp.mpc("0.02", "-0.01"), 1000]])
        coupling = mp.matrix([[mp.mpc(0, "0.9"), 10]])
        high = mp.matrix([[mp.mpf("1.3")]])
        low_forcing = mp.matrix([mp.mpc("0.01", "0.03"), mp.mpc("0.2", "-0.1")])
        high_forcing = mp.matrix([mp.mpc("0.03", "0.04")])
        report = anisotropic_schur_point_bound(
            low, coupling, high, low_forcing, high_forcing
        )
        forced = report["forced_bound"]
        self.assertIsNotNone(forced)
        assert forced is not None
        self.assertGreaterEqual(
            forced["T_AS"] + mp.mpf("1e-60"),
            forced["direct_point_solution_norm"],
        )
        self.assertGreaterEqual(forced["upper_minus_direct_norm"], -mp.mpf("1e-60"))

    def test_inaccurate_high_solve_is_paid_for_by_residual(self) -> None:
        low = mp.matrix([[4, mp.mpf("0.2")], [mp.mpf("0.2"), 9]])
        coupling = mp.matrix([[mp.mpf("0.3"), mp.mpf("0.4")]])
        high = mp.matrix([[3]])
        low_forcing = mp.matrix([mp.mpf("0.7"), mp.mpf("-0.2")])
        high_forcing = mp.matrix([mp.mpf("1.1")])
        zero_high_solve = mp.matrix(1, 1)
        report = anisotropic_schur_point_bound(
            low,
            coupling,
            high,
            low_forcing,
            high_forcing,
            high_approximate_solution=zero_high_solve,
        )
        forced = report["forced_bound"]
        assert forced is not None
        self.assertGreater(abs(forced["e"][0]), 1)
        self.assertGreaterEqual(
            forced["T_AS"] + mp.mpf("1e-60"),
            forced["direct_point_solution_norm"],
        )

    def test_exact_zero_forcing_has_exact_zero_bound(self) -> None:
        low = mp.matrix([[2]])
        coupling = mp.matrix([[mp.mpf("0.1")]])
        high = mp.matrix([[3]])
        report = anisotropic_schur_point_bound(
            low, coupling, high, mp.matrix([0]), mp.matrix([0])
        )
        forced = report["forced_bound"]
        assert forced is not None
        self.assertEqual(forced["F"], 0)
        self.assertEqual(forced["Z"], 0)
        self.assertEqual(forced["T_AS"], 0)

    def test_nonpositive_high_floor_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            anisotropic_schur_point_bound(
                mp.matrix([[2]]), mp.matrix([[mp.mpf("0.1")]]), mp.matrix([[0]])
            )

    def test_nonhermitian_positive_model_is_rejected(self) -> None:
        low = mp.matrix([[2, 0], [0, 3]])
        coupling = mp.matrix([[mp.mpf("0.1"), mp.mpf("0.2")]])
        high = mp.matrix([[4]])
        nonhermitian_model = mp.matrix(
            [[mp.mpc(1, 100), 0], [0, mp.mpc(1, -55)]]
        )
        with self.assertRaisesRegex(ValueError, "must be Hermitian"):
            anisotropic_schur_point_bound(
                low,
                coupling,
                high,
                mp.matrix([1, 0]),
                mp.matrix([0]),
                positive_model=nonhermitian_model,
            )

    def test_Loewner_order_does_not_imply_inverse_vector_norm_order(self) -> None:
        # D<=S, but ||S^-1 f||>||D^-1 f||.  The theorem deliberately uses
        # the D-energy Cauchy--Schwarz estimate instead of this false shortcut.
        D = mp.matrix([[1, 0], [0, 100]])
        v = mp.matrix([mp.mpf("-3.19826258"), mp.mpf("-9.50399665")])
        S = D + v * v.T
        f = mp.matrix([mp.mpf("0.00651499"), mp.mpf("-1.12386623")])
        self.assertGreater(mp.norm(mp.lu_solve(S, f)), mp.norm(mp.lu_solve(D, f)))


if __name__ == "__main__":
    unittest.main()
