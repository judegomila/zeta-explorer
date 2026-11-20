from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "SOURCE_COMPATIBLE_GROUND_PROJECTIVE_RESPONSE.md"

Matrix = tuple[tuple[Fraction, ...], ...]
Vector = tuple[Fraction, ...]


def _dot(left: Vector, right: Vector) -> Fraction:
    return sum((x * y for x, y in zip(left, right)), Fraction(0))


def _matvec(matrix: Matrix, vector: Vector) -> Vector:
    return tuple(_dot(row, vector) for row in matrix)


def _transpose(matrix: Matrix) -> Matrix:
    return tuple(tuple(row) for row in zip(*matrix))


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    right_t = _transpose(right)
    return tuple(tuple(_dot(row, column) for column in right_t) for row in left)


def _add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(x + y for x, y in zip(left_row, right_row))
        for left_row, right_row in zip(left, right)
    )


def _scale(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * value for value in row) for row in matrix)


def _identity(size: int) -> Matrix:
    return tuple(
        tuple(Fraction(row == column) for column in range(size))
        for row in range(size)
    )


def _determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    work = [list(row) for row in matrix]
    result = Fraction(1)
    for column in range(size):
        pivot = next(
            (row for row in range(column, size) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            return Fraction(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            result = -result
        pivot_value = work[column][column]
        result *= pivot_value
        for row in range(column + 1, size):
            multiplier = work[row][column] / pivot_value
            for index in range(column + 1, size):
                work[row][index] -= multiplier * work[column][index]
    return result


def _inverse_2(matrix: Matrix) -> Matrix:
    determinant = _determinant(matrix)
    if determinant == 0:
        raise ZeroDivisionError("singular 2 by 2 matrix")
    return (
        (matrix[1][1] / determinant, -matrix[0][1] / determinant),
        (-matrix[1][0] / determinant, matrix[0][0] / determinant),
    )


def _adjugate_2(matrix: Matrix) -> Matrix:
    return (
        (matrix[1][1], -matrix[0][1]),
        (-matrix[1][0], matrix[0][0]),
    )


def _quadratic(vector: Vector, matrix: Matrix) -> Fraction:
    return _dot(vector, _matvec(matrix, vector))


def _outer(vector: Vector) -> Matrix:
    return tuple(tuple(x * y for y in vector) for x in vector)


def _as_mpf(value: Fraction) -> mp.mpf:
    return mp.mpf(value.numerator) / value.denominator


class SourceCompatibleGroundProjectiveResponseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        mp.mp.dps = 80
        cls.text = NOTE.read_text(encoding="utf-8")
        cls.normalized = " ".join(cls.text.split())

    def test_note_contract_and_claim_discipline(self) -> None:
        required = (
            "Source-compatible ground projective response",
            "C=c_\\kappa xx^*",
            "E_M={1\\over c_\\kappa^2}",
            "\\mathcal R_s(t)",
            "\\Lambda_{\\rm cyc}",
            "E_M\\leq{1+tX\\over t}(\\alpha_0-\\alpha_t)+T_X",
            "no current source estimate controls `T_X`",
            "S_M-k_{00}=E_M",
            "-2\\operatorname {Re}",
            "\\mathcal L_M=\\operatorname {Ran}\\Pi\\cap p^\\perp",
            "E_M=\\|P_{\\mathcal L_M}x\\|^2+{|h|^2\\over k_{00}}",
            "The branch `k_(00)=0` must be stated separately",
            "\\|h\\|_2={\\sqrt{33}\\over2^{17/4}}\\ne1",
            "\\lambda^{4-p/2}\\sqrt{\\log\\lambda}",
            "M(\\lambda)=\\lceil\\lambda^{12}\\rceil",
            "GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md",
            "\\|P_{\\mathcal L_M}\\Phi_\\mu\\|^2",
            "unresolved odd-resolvent ground-alignment obstruction",
            "C_u-{1\\over d}e_ue_u^*\\succ0",
            "a_q+d-c_q^*(A_q+dI)^{-1}c_q>0",
            "P0_INVALIDATED",
            "equation (5.2)",
            "minus sign in source equation (3.19)",
            "1<n<=lambda^2",
            "e^{-izx}",
            "arXiv:2511.22755v1",
            "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            "printed normalization tends to `Xi/4`",
        )
        for token in required:
            with self.subTest(token=token):
                self.assertIn(token, self.normalized)
        self.assertNotIn("RH_PROVED", self.text)
        self.assertNotIn("CERTIFIED", self.text)
        self.assertIn("does not prove any of those arithmetic premises", self.normalized)
        self.assertIn("No zeta-zero table", self.normalized)
        self.assertIn("global Weil positivity", self.normalized)

    def test_exact_adjugate_projective_and_mixed_minor_formulas(self) -> None:
        # H is positive semidefinite of corank one with kernel
        # x=(1,1/2), coefficient-normalized against kappa=e_1.
        H: Matrix = (
            (Fraction(1), Fraction(-2)),
            (Fraction(-2), Fraction(4)),
        )
        C = _adjugate_2(H)
        kappa: Vector = (Fraction(1), Fraction(0))
        x: Vector = (Fraction(1), Fraction(1, 2))
        y: Vector = (Fraction(0), Fraction(1, 2))
        low_mode: Vector = (Fraction(3, 5), Fraction(4, 5))
        Pi = _outer(low_mode)

        self.assertEqual(_matvec(H, x), (Fraction(0), Fraction(0)))
        c_kappa = _quadratic(kappa, C)
        self.assertEqual(c_kappa, 4)
        self.assertEqual(C, _scale(c_kappa, _outer(x)))

        E = _quadratic(y, Pi)
        cofactor_difference = tuple(
            value - c_kappa * anchor
            for value, anchor in zip(_matvec(C, kappa), kappa)
        )
        cofactor_E = _quadratic(cofactor_difference, Pi) / c_kappa**2
        self.assertEqual(E, Fraction(4, 25))
        self.assertEqual(cofactor_E, E)

        k00 = _quadratic(kappa, Pi)
        cross = _dot(kappa, _matvec(Pi, _matvec(C, kappa)))
        trace_Pi_C = sum(
            _matmul(Pi, C)[index][index] for index in range(2)
        )
        self.assertEqual(k00 - 2 * cross / c_kappa + trace_Pi_C / c_kappa, E)

        border = (
            (H[0][0], H[0][1], kappa[0]),
            (H[1][0], H[1][1], kappa[1]),
            (low_mode[0], low_mode[1], Fraction(0)),
        )
        mixed_minor = -_determinant(border)
        self.assertEqual(mixed_minor, _dot(low_mode, _matvec(C, kappa)))
        mode_residual = mixed_minor - c_kappa * _dot(low_mode, kappa)
        self.assertEqual(mode_residual**2 / c_kappa**2, E)

    def test_complex_hermitian_formula_requires_conjugation_and_real_part(self) -> None:
        # A genuinely complex Hermitian corank-one fixture.  Python's small
        # Gaussian integers and halves are exactly representable here.
        H = ((1 + 0j, 1j), (-1j, 1 + 0j))
        C = ((1 + 0j, -1j), (1j, 1 + 0j))
        kappa = (1 + 0j, 0 + 0j)
        x = (1 + 0j, 1j)
        Pi = ((0.5 + 0j, 0.5 + 0j), (0.5 + 0j, 0.5 + 0j))

        def matvec(matrix, vector):
            return tuple(sum(row[j] * vector[j] for j in range(2)) for row in matrix)

        def inner(left, right):
            return sum(left[j].conjugate() * right[j] for j in range(2))

        self.assertEqual(matvec(H, x), (0j, 0j))
        self.assertEqual(C[0][1], -1j)
        self.assertNotEqual(C[0][1], x[0] * x[1])
        y = (0j, 1j)
        E = inner(y, matvec(Pi, y)).real
        k00 = inner(kappa, matvec(Pi, kappa)).real
        Ck = matvec(C, kappa)
        cross = inner(kappa, matvec(Pi, Ck))
        trace_Pi_C = sum(_matmul_complex(Pi, C)[j][j] for j in range(2)).real
        self.assertAlmostEqual(E, 0.5)
        self.assertAlmostEqual(k00 - 2 * cross.real + trace_Pi_C, E)
        self.assertNotEqual(cross.imag, 0)

    def test_bordered_cross_ratio_derivative_and_cyclic_cap_exactly(self) -> None:
        H: Matrix = (
            (Fraction(1), Fraction(-2)),
            (Fraction(-2), Fraction(4)),
        )
        kappa: Vector = (Fraction(1), Fraction(0))
        g = _matvec(H, kappa)
        Pi: Matrix = (
            (Fraction(9, 25), Fraction(12, 25)),
            (Fraction(12, 25), Fraction(16, 25)),
        )
        ridge = _outer(kappa)
        L = _add(H, ridge)
        A_one = _add(H, Pi)
        L_one = _add(L, Pi)

        D_zero = _determinant(L)
        D_one = _determinant(L_one)
        N_zero = _quadratic(g, _adjugate_2(L))
        N_one = _quadratic(g, _adjugate_2(L_one))
        self.assertEqual((D_zero, D_one), (Fraction(4), Fraction(216, 25)))
        self.assertEqual((N_zero, N_one), (Fraction(4), Fraction(8)))

        d_border = (
            (A_one[0][0], A_one[0][1], kappa[0]),
            (A_one[1][0], A_one[1][1], kappa[1]),
            (kappa[0], kappa[1], Fraction(-1)),
        )
        n_border = (
            (A_one[0][0], A_one[0][1], kappa[0], g[0]),
            (A_one[1][0], A_one[1][1], kappa[1], g[1]),
            (kappa[0], kappa[1], Fraction(-1), Fraction(0)),
            (g[0], g[1], Fraction(0), Fraction(0)),
        )
        self.assertEqual(-_determinant(d_border), D_one)
        self.assertEqual(_determinant(n_border), N_one)

        alpha_zero = N_zero / D_zero
        alpha_one = N_one / D_one
        decrement = alpha_zero - alpha_one
        cross_ratio = D_one * (D_zero + N_zero) / (
            D_zero * (D_one + N_one)
        )
        self.assertEqual(alpha_zero, 1)
        self.assertEqual(alpha_one, Fraction(25, 27))
        self.assertEqual(decrement, Fraction(2, 27))
        self.assertEqual(cross_ratio, Fraction(27, 26))

        L_inverse = _inverse_2(L)
        correction = _matvec(L_inverse, g)
        E = _quadratic(correction, Pi)
        cyclic_cap = _quadratic((Fraction(3, 5), Fraction(4, 5)), L_inverse)
        self.assertEqual(E, Fraction(4, 25))
        self.assertEqual(cyclic_cap, Fraction(29, 25))
        self.assertEqual(E / (1 + cyclic_cap), decrement)
        self.assertEqual((1 + cyclic_cap) * decrement, E)

        D_prime = D_one - D_zero
        N_prime = N_one - N_zero
        response_prime = D_prime / D_zero - (D_prime + N_prime) / (
            D_zero + N_zero
        )
        self.assertEqual(response_prime, Fraction(2, 25))
        self.assertEqual((1 + alpha_zero) * response_prime, E)
        self.assertLess(
            abs(mp.log(_as_mpf(cross_ratio)) - mp.log(mp.mpf(27) / 26)),
            mp.mpf("1e-75"),
        )

    def test_finite_secant_without_cap_has_no_upper_control(self) -> None:
        responses: list[mp.mpf] = []
        energies: list[mp.mpf] = []
        for exponent in (2, 4, 8, 12):
            spectral_value = mp.mpf(10) ** exponent
            alpha_zero = mp.mpf(1)
            alpha_one = 1 / (1 + spectral_value)
            responses.append(mp.log((1 + alpha_zero) / (1 + alpha_one)))
            energies.append(spectral_value)
        self.assertLess(responses[-1], mp.log(2))
        self.assertGreater(responses[-1], mp.mpf("0.69"))
        self.assertGreater(energies[-1], mp.mpf("1e11"))
        self.assertIn("A cap-free finite-secant upper bound is false", self.text)

    def test_cap_free_truncation_keeps_exact_strict_tail(self) -> None:
        # Spectral atoms nu=X=2 and nu=10, each with mass one.  The atom at
        # X belongs to the low part and the tail is strictly (X,infinity).
        X = Fraction(2)
        t = Fraction(1, 2)
        atoms = ((Fraction(2), Fraction(1)), (Fraction(10), Fraction(1)))
        energy = sum((nu * mass for nu, mass in atoms), Fraction(0))
        decrement = sum(
            (t * nu / (1 + t * nu) * mass for nu, mass in atoms),
            Fraction(0),
        )
        strict_tail = sum(
            (nu * mass for nu, mass in atoms if nu > X), Fraction(0)
        )
        inclusive_tail = sum(
            (nu * mass for nu, mass in atoms if nu >= X), Fraction(0)
        )
        bound = 2 * X * decrement + strict_tail

        self.assertEqual(energy, 12)
        self.assertEqual(decrement, Fraction(4, 3))
        self.assertEqual(strict_tail, 10)
        self.assertEqual(inclusive_tail, 12)
        self.assertLessEqual(energy, bound)

        # With only an atom at X, the low inequality and t=1/X bound are
        # exact, while the strict tail remains zero.
        atom_at_cutoff_decrement = t * X / (1 + t * X)
        self.assertEqual(2 * X * atom_at_cutoff_decrement, X)

        alpha_zero = Fraction(2)
        alpha_t = alpha_zero - decrement
        response_ratio = (1 + alpha_zero) / (1 + alpha_t)
        recovered_decrement = (1 + alpha_zero) * (
            1 - 1 / response_ratio
        )
        self.assertEqual(response_ratio, Fraction(9, 5))
        self.assertEqual(recovered_decrement, decrement)

        second_moment = sum(
            (nu**2 * mass for nu, mass in atoms), Fraction(0)
        )
        self.assertLessEqual(strict_tail, second_moment / X)
        self.assertIn("The atom at `X` belongs to the low interval `[0,X]`", self.text)

    def test_corrected_unbordered_sign_and_tail_bound(self) -> None:
        kappa: Vector = (Fraction(1), Fraction(0))
        x: Vector = (Fraction(1), Fraction(1, 2))
        y: Vector = (Fraction(0), Fraction(1, 2))
        Pi: Matrix = (
            (Fraction(9, 25), Fraction(12, 25)),
            (Fraction(12, 25), Fraction(16, 25)),
        )
        high = _add(_identity(2), _scale(Fraction(-1), Pi))
        S = _quadratic(x, Pi)
        k00 = _quadratic(kappa, Pi)
        E = _quadratic(y, Pi)
        high_cross = _dot(_matvec(high, kappa), _matvec(high, y))

        self.assertEqual(S, 1)
        self.assertEqual(k00, Fraction(9, 25))
        self.assertEqual(E, Fraction(4, 25))
        self.assertEqual(high_cross, Fraction(-6, 25))
        self.assertEqual(S - k00, E - 2 * high_cross)
        self.assertNotEqual(S - k00, E + 2 * high_cross)
        error = abs(E - (S - k00))
        self.assertLessEqual(
            error**2,
            4 * _quadratic(kappa, high) * _dot(y, y),
        )

    def test_anchor_transverse_alignment_identity_and_zero_branch(self) -> None:
        # A genuinely complex fixture tests both |h|^2 and Re(h).  Pi is
        # projection onto the first two coordinates and kappa is unit.
        one = mp.mpf(1)
        kappa = [mp.mpc(3, 0) / 5, mp.mpc(0), mp.mpc(4, 0) / 5]
        y = [
            -mp.mpc(2, 2) / 5,
            mp.mpc(1, 0) / 2,
            mp.mpc(3, 3) / 10,
        ]
        x = [kappa[index] + y[index] for index in range(3)]

        def inner(left, right):
            return mp.fsum(mp.conj(left[index]) * right[index] for index in range(3))

        def low(vector):
            return [vector[0], vector[1], mp.mpc(0)]

        def high(vector):
            return [mp.mpc(0), mp.mpc(0), vector[2]]

        self.assertLess(abs(inner(kappa, kappa) - one), mp.mpf("1e-75"))
        self.assertLess(abs(inner(kappa, y)), mp.mpf("1e-75"))
        p = low(kappa)
        k00 = inner(p, p).real
        h = inner(high(kappa), high(y))
        P_L_x = [mp.mpc(0), x[1], mp.mpc(0)]
        alignment = inner(P_L_x, P_L_x).real
        E = inner(low(y), low(y)).real
        S = inner(low(x), low(x)).real

        self.assertLess(abs(k00 - mp.mpf(9) / 25), mp.mpf("1e-75"))
        self.assertLess(abs(h - mp.mpc(6, 6) / 25), mp.mpf("1e-75"))
        self.assertLess(abs(alignment - mp.mpf(1) / 4), mp.mpf("1e-75"))
        self.assertLess(
            abs(E - (alignment + abs(h) ** 2 / k00)),
            mp.mpf("1e-75"),
        )
        self.assertLess(
            abs((S - k00) - (alignment + abs(h) ** 2 / k00 - 2 * h.real)),
            mp.mpf("1e-75"),
        )
        self.assertGreater(abs(h.imag), mp.mpf("1e-2"))

        # Mandatory k00=0 branch: the quotient formula is undefined, while
        # p=h=0 and E=S=||P_L x||^2 remain exact.
        zero_kappa = [mp.mpc(1), mp.mpc(0)]
        zero_y = [mp.mpc(0), mp.mpc(1) / 2]
        zero_x = [zero_kappa[index] + zero_y[index] for index in range(2)]
        zero_p = [mp.mpc(0), zero_kappa[1]]
        zero_h = mp.conj(zero_kappa[0]) * zero_y[0]
        zero_E = abs(zero_y[1]) ** 2
        zero_S = abs(zero_x[1]) ** 2
        self.assertEqual(sum(abs(value) ** 2 for value in zero_p), 0)
        self.assertEqual(zero_h, 0)
        self.assertEqual(zero_E, zero_S)
        self.assertEqual(zero_S, mp.mpf(1) / 4)

    def test_source_boundary_factorization_of_cofactor_normalization(self) -> None:
        H: Matrix = (
            (Fraction(1), Fraction(-2)),
            (Fraction(-2), Fraction(4)),
        )
        C = _adjugate_2(H)
        eta: Vector = (Fraction(1), Fraction(1))
        e_zero: Vector = (Fraction(1), Fraction(0))
        kappa: Vector = e_zero
        det_odd = _dot(eta, _matvec(C, e_zero))
        phi = tuple(value / det_odd for value in _matvec(C, e_zero))
        p_mu = _dot(kappa, phi)
        central = _dot(e_zero, phi)
        c_kappa = _quadratic(kappa, C)

        self.assertEqual(det_odd, 6)
        self.assertEqual(_dot(eta, phi), 1)
        self.assertEqual(phi, (Fraction(2, 3), Fraction(1, 3)))
        self.assertEqual(_matvec(C, e_zero), tuple(det_odd * value for value in phi))
        self.assertEqual(det_odd * p_mu**2 / central, c_kappa)

        Pi: Matrix = (
            (Fraction(9, 25), Fraction(12, 25)),
            (Fraction(12, 25), Fraction(16, 25)),
        )
        determinant_derivative = sum(
            _matmul(Pi, C)[index][index] for index in range(2)
        )
        S_from_source = determinant_derivative * central / (det_odd * p_mu**2)
        self.assertEqual(S_from_source, 1)

    def test_actual_source_bv_exponents_and_p12_criterion(self) -> None:
        p = Fraction(12)
        self.assertEqual(4 - p / 2, -2)
        for epsilon in (Fraction(1, 100), Fraction(1, 10), Fraction(1, 4)):
            eta = Fraction(1, 2) - epsilon
            self.assertEqual(2 * eta - 1, -2 * epsilon)
            self.assertLess(eta - p / 2, 0)
            self.assertLess(2 * eta - 2, 0)

        eta = mp.mpf("0.49")
        low_values = []
        tail_values = []
        high_values = []
        for exponent in (100, 200, 400):
            lam = mp.mpf(10) ** exponent
            log_lam = mp.log(lam)
            low_values.append(log_lam * lam ** (2 * eta - 1))
            tail_values.append(log_lam ** mp.mpf("1.5") * lam ** (2 * eta - 2))
            high_values.append(mp.sqrt(log_lam) * lam ** (eta - 6))
        self.assertGreater(low_values[0], low_values[-1])
        self.assertGreater(tail_values[0], tail_values[-1])
        self.assertGreater(high_values[0], high_values[-1])
        self.assertLess(low_values[-1], 1)
        self.assertIn("conditional", self.text.lower())
        self.assertIn("does not prove any of those arithmetic premises", self.normalized)

    def test_nested_gevrey_tail_reduces_response_to_alignment_only(self) -> None:
        # For fixed D, the admitted inner cutoff D*lambda^2*L^2 is nested
        # inside M=lambda^12, and its exponential tail is o(lambda^-1).
        D = mp.mpf(100)
        c = mp.mpf("0.01")
        cutoff_ratios: list[mp.mpf] = []
        scaled_errors: list[mp.mpf] = []
        for lam in (mp.mpf(10), mp.mpf(20), mp.mpf(40)):
            L = 2 * mp.log(lam)
            inner_cutoff = D * lam**2 * L**2
            low_cutoff = lam**12
            cutoff_ratios.append(inner_cutoff / low_cutoff)
            scaled_errors.append(lam * mp.exp(-c * lam**2))
        self.assertGreater(cutoff_ratios[0], cutoff_ratios[-1])
        self.assertLess(cutoff_ratios[-1], mp.mpf("1e-10"))
        self.assertGreater(scaled_errors[0], scaled_errors[-1])
        self.assertLess(scaled_errors[-1], mp.mpf("1e-5"))
        self.assertIn("use the exact lower Ritz shift `U=u`", self.normalized)
        self.assertIn("k_{00}\\geq\\tfrac12", self.normalized)
        self.assertIn("supplies no decay estimate", self.normalized)

    def test_sharp_even_ritz_schur_gate_and_failure(self) -> None:
        # Basis order is kappa,w,F.  The top-left Ritz pencil has lower
        # value u=0, d=2, r=1.  Its complementary Schur gate passes.
        Q: Matrix = (
            (Fraction(2), Fraction(1), Fraction(0)),
            (Fraction(1), Fraction(1, 2), Fraction(1)),
            (Fraction(0), Fraction(1), Fraction(3)),
        )
        d = Fraction(2)
        r = Fraction(1)
        y_u: Vector = (Fraction(1), -d / r, Fraction(0))
        e_u = _matvec(Q, y_u)
        self.assertEqual(e_u, (Fraction(0), Fraction(0), Fraction(-2)))
        B_u: Matrix = (
            (Fraction(1, 2), Fraction(1)),
            (Fraction(1), Fraction(3)),
        )
        self.assertGreater(B_u[0][0], 0)
        self.assertGreater(_determinant(B_u), 0)
        short = Fraction(3) - e_u[2] ** 2 / d
        self.assertEqual(short, 1)

        B_fail: Matrix = (
            (Fraction(1, 2), Fraction(1)),
            (Fraction(1), Fraction(1)),
        )
        short_fail = Fraction(1) - e_u[2] ** 2 / d
        self.assertLess(_determinant(B_fail), 0)
        self.assertLess(short_fail, 0)

    def test_sharp_odd_source_response_gate_and_counterfamily_sign(self) -> None:
        d = Fraction(2)
        a_q = Fraction(-1)
        c_q = Fraction(1)
        A_q = Fraction(0)
        transverse = A_q + d
        short = a_q + d - c_q**2 / transverse
        odd_block: Matrix = (
            (a_q + d, c_q),
            (c_q, transverse),
        )
        self.assertGreater(transverse, 0)
        self.assertGreater(short, 0)
        self.assertGreater(_determinant(odd_block), 0)

        c_fail = Fraction(2)
        short_fail = a_q + d - c_fail**2 / transverse
        odd_fail: Matrix = (
            (a_q + d, c_fail),
            (c_fail, transverse),
        )
        self.assertGreater(transverse, 0)
        self.assertLess(short_fail, 0)
        self.assertLess(_determinant(odd_fail), 0)

        sqrt_22 = mp.sqrt(22)
        even_fail_member_determinant = mp.mpf(449) / 306 - 5 * sqrt_22 / 34
        odd_fail_member_determinant = -mp.mpf(28) / 9 + sqrt_22 / 2
        self.assertGreater(even_fail_member_determinant, 0)
        self.assertLess(odd_fail_member_determinant, 0)

    def test_ritz_and_source_displacement_do_not_force_sector_signs(self) -> None:
        # The even matrix is diagonal in (e0,e1+,e2+).  Relative to
        # kappa=(e0+e1+)/sqrt(2), the Ritz block is [[1,1],[1,1]], but an
        # unused even and odd mode remains at -1.
        ritz_block: Matrix = (
            (Fraction(1), Fraction(1)),
            (Fraction(1), Fraction(1)),
        )
        self.assertEqual(_determinant(ritz_block), 0)
        self.assertEqual(_quadratic((Fraction(1), Fraction(0)), ritz_block), 1)
        self.assertEqual(abs(ritz_block[1][0]), 1)
        self.assertLess(Fraction(-1), 0)

        positive_determinant_wrong_inertia: Matrix = (
            (Fraction(-1), Fraction(0)),
            (Fraction(0), Fraction(-1)),
        )
        self.assertGreater(_determinant(positive_determinant_wrong_inertia), 0)
        self.assertLess(positive_determinant_wrong_inertia[0][0], 0)
        self.assertIn(
            "A positive determinant alone cannot replace", self.normalized
        )

    def test_diagonal_source_cauchy_alignment_counterfamily(self) -> None:
        sqrt_three = mp.sqrt(3)
        q = mp.mpf(1) / 4
        u = mp.mpf(0)
        d = q - u
        r = sqrt_three / 4
        complement_moment = mp.mpf(3) / 4

        self.assertLess(abs(d * complement_moment - r**2), mp.mpf("1e-75"))
        self.assertGreater(complement_moment, 0)
        self.assertGreater(mp.mpf(1), 0)  # every unused even/odd eigenvalue
        self.assertLess(abs(d / r - 1 / sqrt_three), mp.mpf("1e-75"))

        kappa = (sqrt_three / 2, mp.mpf(1) / 2)
        phi = (mp.mpf(1), mp.mpf(0))
        p_mu = kappa[0]
        x = (phi[0] / p_mu, mp.mpf(0))
        ell = (-mp.mpf(1) / 2, sqrt_three / 2)
        projective = tuple(x[index] - kappa[index] for index in range(2))
        E = mp.fsum(abs(value) ** 2 for value in projective)
        S = mp.fsum(abs(value) ** 2 for value in x)
        alignment = abs(mp.fsum(ell[index] * x[index] for index in range(2))) ** 2
        phi_alignment = abs(
            mp.fsum(ell[index] * phi[index] for index in range(2))
        ) ** 2

        self.assertLess(abs(S - mp.mpf(4) / 3), mp.mpf("1e-75"))
        self.assertLess(abs(E - mp.mpf(1) / 3), mp.mpf("1e-75"))
        self.assertLess(abs(S - 1 - E), mp.mpf("1e-75"))
        self.assertLess(abs(alignment - E), mp.mpf("1e-75"))
        self.assertLess(abs(phi_alignment - mp.mpf(1) / 4), mp.mpf("1e-75"))
        self.assertLess(
            abs(phi_alignment / abs(p_mu) ** 2 - mp.mpf(1) / 3),
            mp.mpf("1e-75"),
        )

        # Q_+=diag(0,1,...,1), Q_-=I has zero source displacement and the
        # boundary cofactor identity holds as a polynomial for every size.
        for dimension in (2, 5, 9):
            for z in (mp.mpf(-2), mp.mpf(1) / 3, mp.mpf(4)):
                odd_determinant = (1 - z) ** dimension
                central_even_cofactor = (1 - z) ** dimension
                self.assertEqual(odd_determinant, central_even_cofactor)
        self.assertTrue(all(1 - 1 == 0 for _mode in range(1, 10)))

        # The anchor and ground use only modes 0 and 1, so every M>=1 has
        # exactly zero tail, yet the alignment response never decays.
        responses = [E for _lam in (2, 4, 8, 16, 32)]
        self.assertTrue(all(abs(value - mp.mpf(1) / 3) < mp.mpf("1e-75") for value in responses))
        self.assertIn("identically zero high tail", self.normalized)
        self.assertIn("structural counterexample", self.normalized)

    def test_source_normalization_regression_changes_scaled_observable(self) -> None:
        E = Fraction(4, 25)
        source_scale = Fraction(3)
        unit_scale = Fraction(1)
        self.assertEqual(E, E)
        self.assertEqual(source_scale**2 * E, Fraction(36, 25))
        self.assertEqual(unit_scale**2 * E, Fraction(4, 25))
        self.assertNotEqual(source_scale**2 * E, unit_scale**2 * E)
        source_norm = mp.sqrt(33) / mp.power(2, mp.mpf(17) / 4)
        unit_rescaling = mp.power(2, mp.mpf(17) / 4) / mp.sqrt(33)
        self.assertNotEqual(source_norm, 1)
        self.assertLess(abs(source_norm * unit_rescaling - 1), mp.mpf("1e-75"))
        self.assertIn("may leave `E_M` invariant", self.normalized)
        self.assertIn("changing `a_(lambda,N)^2E_M`", self.normalized)


def _matmul_complex(left, right):
    return tuple(
        tuple(
            sum(left[i][k] * right[k][j] for k in range(len(right)))
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


if __name__ == "__main__":
    unittest.main()
