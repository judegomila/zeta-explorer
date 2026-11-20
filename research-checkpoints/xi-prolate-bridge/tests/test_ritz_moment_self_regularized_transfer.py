from __future__ import annotations

from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md"


def c_ritz_squared(delta: mp.mpf) -> mp.mpf:
    if delta == 0:
        return mp.mpf(1)
    alpha = 1 / delta**2
    if alpha <= mp.mpf("0.5"):
        return 1 + 2 / alpha
    root = mp.sqrt(1 + 6 * alpha)
    return 1 + 4 * (2 * root - 1) / (3 * (root - 1) ** 2)


def a_ritz(delta: mp.mpf) -> mp.mpf:
    if delta <= 1:
        return 1 + delta + delta * (1 + delta) ** 2 / 2
    return 1 + delta + 2 * delta**2


def norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt((vector.conjugate().T * vector)[0].real)


def inverse(matrix: mp.matrix) -> mp.matrix:
    result = mp.matrix(matrix.rows)
    for column in range(matrix.cols):
        unit = mp.matrix(matrix.rows, 1)
        unit[column] = 1
        result[:, column] = mp.lu_solve(matrix, unit)
    return result


def trace(matrix: mp.matrix) -> mp.mpf:
    return mp.fsum(matrix[j, j] for j in range(min(matrix.rows, matrix.cols)))


def hermitian_min(matrix: mp.matrix) -> mp.mpf:
    values = mp.eighe((matrix + matrix.conjugate().T) / 2, eigvals_only=True)
    return values[0]


def sharp_family(
    delta: mp.mpf, h: mp.mpf, tau_fraction: mp.mpf
) -> tuple[mp.matrix, mp.matrix, mp.matrix]:
    r = mp.mpf(1)
    d = delta
    total = d + h
    moment = r**2 / d
    a0 = r**2 / total - h
    schur_load = moment - a0
    tau = schur_load + tau_fraction * (moment - schur_load)
    lower = h * schur_load / (tau - schur_load)
    cross = mp.sqrt(tau * lower)
    B = mp.matrix([[moment, cross], [cross, lower]])
    b = mp.matrix([r, 0])
    Q = mp.matrix(
        [
            [d, r, 0],
            [r, moment, cross],
            [0, cross, lower],
        ]
    )
    return B, b, Q


class RitzMomentSelfRegularizedTransferTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 90

    def test_piecewise_constants_endpoints_and_safe_polynomial(self) -> None:
        root_two = mp.sqrt(2)
        self.assertLess(
            abs(c_ritz_squared(root_two) - 5), mp.mpf("1e-80")
        )
        self.assertEqual(a_ritz(mp.mpf(0)), 1)
        self.assertEqual(a_ritz(mp.mpf(1)), 4)
        for text in ("1e-12", "0.01", "0.5", "1", "2", "10"):
            delta = mp.mpf(text)
            self.assertGreaterEqual(c_ritz_squared(delta), 1)
            self.assertLessEqual(
                a_ritz(delta), (1 + delta) * (1 + 2 * delta)
            )
        self.assertLess(
            abs(a_ritz(mp.mpf("1e-30")) - 1), mp.mpf("2e-30")
        )

    def test_sharp_norm_family_and_ritz_moment(self) -> None:
        for delta in (mp.mpf("0.1"), mp.mpf("1"), mp.mpf("2")):
            alpha = 1 / delta**2
            if alpha > mp.mpf("0.5"):
                t0 = (mp.sqrt(1 + 6 * alpha) - 2) / 3
                h = delta * t0
            else:
                h = mp.mpf("1e-12")
            B, b, Q = sharp_family(delta, h, mp.mpf("0.999999999999"))
            values = mp.eigsy(Q, eigvals_only=True)
            z = mp.lu_solve(B + h * mp.eye(2), b)
            z2 = norm(z) ** 2
            self.assertLess(abs(values[0] + h), mp.mpf("1e-70"))
            self.assertLess(abs(mp.det(Q[:2, :2])), mp.mpf("1e-70"))
            self.assertLessEqual(z2, c_ritz_squared(delta) + mp.mpf("1e-60"))
            if delta != 2:
                self.assertLess(
                    c_ritz_squared(delta) - z2, mp.mpf("1e-7")
                )
            moment = B[0, 0]
            self.assertLess(abs(delta * moment - 1), mp.mpf("1e-80"))
            bound = a_ritz(delta) * inverse(B + mp.eye(2))
            self.assertGreaterEqual(
                hermitian_min(bound - z * z.T), -mp.mpf("1e-70")
            )

    def test_complex_hermitian_rounded_shift_case(self) -> None:
        d = mp.mpf("0.3")
        r = mp.mpf(1)
        cross = mp.mpc("0.5", "0.2")
        B = mp.matrix(
            [
                [mp.mpf(2), cross.conjugate()],
                [cross, mp.mpf(3)],
            ]
        )
        b = mp.matrix([r, 0])
        Q = mp.matrix(3)
        Q[0, 0] = d
        Q[0, 1] = r
        Q[1, 0] = r
        for i in range(2):
            for j in range(2):
                Q[i + 1, j + 1] = B[i, j]
        values = mp.eighe(Q, eigvals_only=True)
        h = -values[0]
        z = mp.lu_solve(B + h * mp.eye(2), b)
        self.assertGreater(h, 0)
        self.assertLessEqual(d * B[0, 0], r**2)
        fixed = d + h - (b.conjugate().T * z)[0].real
        self.assertLess(abs(fixed), mp.mpf("1e-75"))
        operator_bound = a_ritz(d / r) * r * inverse(B + r * mp.eye(2))
        self.assertGreaterEqual(
            hermitian_min(operator_bound - z * z.conjugate().T),
            -mp.mpf("1e-70"),
        )

    def test_positive_determinant_response_controls_observation(self) -> None:
        d = mp.mpf("0.4")
        r = mp.mpf(1)
        B = mp.matrix([[mp.mpf(2), mp.mpf("0.3")], [mp.mpf("0.3"), 3]])
        b = mp.matrix([r, 0])
        Q = mp.matrix(
            [[d, r, 0], [r, B[0, 0], B[0, 1]], [0, B[1, 0], B[1, 1]]]
        )
        mu = mp.eigsy(Q, eigvals_only=True)[0]
        h = -mu
        z = mp.lu_solve(B + h * mp.eye(2), b)
        K = mp.matrix([[mp.mpf("0.7"), mp.mpf("0.1")], [mp.mpf("0.1"), mp.mpf("0.2")]])
        D = B + r * mp.eye(2)
        H = r * trace(inverse(D) * K)
        F = mp.log(mp.det(D + r * K) / mp.det(D))
        actual = (z.T * K * z)[0]
        self.assertGreaterEqual(F, 0)
        self.assertLessEqual(F, H)
        self.assertLessEqual(H, F / mp.log(2))
        self.assertLessEqual(actual, a_ritz(d / r) * H)

    def test_coefficient_one_regression_is_rejected(self) -> None:
        d = r = B = mp.mpf(2)
        z = mp.mpf(1)
        coefficient_one = r / (B + r)
        self.assertGreater(z**2, coefficient_one)
        self.assertLessEqual(z**2, a_ritz(d / r) * coefficient_one)

    def test_arbitrary_nonritz_shift_has_no_ratio_only_ridge(self) -> None:
        d = mp.mpf(2)
        r = mp.mpf(3)
        c0 = mp.mpf(1)
        previous = mp.mpf(0)
        for epsilon in (mp.mpf("1e-5"), mp.mpf("1e-10"), mp.mpf("1e-20")):
            second = (r**2 - c0 * epsilon) / (d - c0)
            B = mp.diag([epsilon, second])
            b = mp.matrix(
                [mp.sqrt(c0 * epsilon), mp.sqrt((d - c0) * second)]
            )
            z = mp.lu_solve(B, b)
            self.assertLess(
                abs((b.T * mp.lu_solve(B, b))[0] - d), mp.mpf("1e-70")
            )
            moment = (b.T * B * b)[0] / r**2
            self.assertGreater(d * moment, r**2)
            required = (z.T * (B + r * mp.eye(2)) * z)[0] / r
            self.assertGreater(required, previous)
            previous = required
        self.assertGreater(previous, mp.mpf("1e18"))

    def test_note_keeps_claim_and_source_scope_explicit(self) -> None:
        text = NOTE.read_text()
        for required in (
            "u\\leq U\\leq q",
            "A_{\\rm R}",
            "minus-prime",
            "1<n<=lambda^2",
            "e^{-itx}",
            "does not by itself make",
            "equation (5.2)",
            "P0_INVALIDATED",
            "No zeta-zero",
            "table and no global",
            "no global Weil positivity",
        ):
            self.assertIn(required, text)


if __name__ == "__main__":
    unittest.main()
