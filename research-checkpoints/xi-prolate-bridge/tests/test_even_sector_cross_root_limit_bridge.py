from __future__ import annotations

from fractions import Fraction
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
NOTE = ROOT / "notes" / "EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md"
F = Fraction


def _poly_trim(polynomial: list[Fraction]) -> list[Fraction]:
    out = polynomial[:]
    while len(out) > 1 and out[-1] == 0:
        out.pop()
    return out


def _poly_add(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    out = [F(0) for _ in range(max(len(left), len(right)))]
    for index, value in enumerate(left):
        out[index] += value
    for index, value in enumerate(right):
        out[index] += value
    return _poly_trim(out)


def _poly_scale(value: Fraction, polynomial: list[Fraction]) -> list[Fraction]:
    return _poly_trim([value * coefficient for coefficient in polynomial])


def _poly_mul(left: list[Fraction], right: list[Fraction]) -> list[Fraction]:
    out = [F(0) for _ in range(len(left) + len(right) - 1)]
    for i, left_value in enumerate(left):
        for j, right_value in enumerate(right):
            out[i + j] += left_value * right_value
    return _poly_trim(out)


def _poly_product(polynomials: list[list[Fraction]]) -> list[Fraction]:
    out = [F(1)]
    for polynomial in polynomials:
        out = _poly_mul(out, polynomial)
    return out


def _poly_value(polynomial: list[Fraction], value: Fraction) -> Fraction:
    out = F(0)
    for coefficient in reversed(polynomial):
        out = out * value + coefficient
    return out


def _raw_mode_polynomial(
    central: Fraction,
    positive: list[Fraction],
) -> list[Fraction]:
    """Return p_x(y) in ascending powers of y."""
    count = len(positive)
    full_product = _poly_product(
        [[F(-(index * index)), F(1)] for index in range(1, count + 1)]
    )
    out = _poly_scale(central, full_product)
    for index, coefficient in enumerate(positive, start=1):
        omitted = _poly_product(
            [
                [F(-(other * other)), F(1)]
                for other in range(1, count + 1)
                if other != index
            ]
        )
        out = _poly_add(out, _poly_scale(2 * coefficient, [F(0)] + omitted))
    return _poly_trim(out)


def _substitute_square(polynomial: list[Fraction]) -> list[Fraction]:
    out = [F(0) for _ in range(2 * (len(polynomial) - 1) + 1)]
    for degree, coefficient in enumerate(polynomial):
        out[2 * degree] = coefficient
    return _poly_trim(out)


def _determinant_resolvent_numerator(
    central: Fraction,
    positive: list[Fraction],
) -> list[Fraction]:
    """Return det(D-sI) sum_j x_j/(j-s), exactly as a polynomial in s."""
    count = len(positive)
    modes = list(range(-count, count + 1))
    coefficients = {
        mode: central if mode == 0 else positive[abs(mode) - 1]
        for mode in modes
    }
    out = [F(0)]
    for omitted in modes:
        factors = [[F(mode), F(-1)] for mode in modes if mode != omitted]
        out = _poly_add(
            out,
            _poly_scale(coefficients[omitted], _poly_product(factors)),
        )
    return _poly_trim(out)


def _matvec(
    matrix: list[list[Fraction]],
    vector: list[Fraction],
) -> list[Fraction]:
    return [
        sum((entry * value for entry, value in zip(row, vector)), F(0))
        for row in matrix
    ]


def _dot(left: list[Fraction], right: list[Fraction]) -> Fraction:
    return sum((a * b for a, b in zip(left, right)), F(0))


def _rank(matrix: list[list[Fraction]]) -> int:
    work = [row[:] for row in matrix]
    rows = len(work)
    columns = len(work[0]) if rows else 0
    pivot_row = 0
    for column in range(columns):
        pivot = next(
            (row for row in range(pivot_row, rows) if work[row][column] != 0),
            None,
        )
        if pivot is None:
            continue
        work[pivot_row], work[pivot] = work[pivot], work[pivot_row]
        divisor = work[pivot_row][column]
        work[pivot_row] = [value / divisor for value in work[pivot_row]]
        for row in range(rows):
            if row == pivot_row:
                continue
            factor = work[row][column]
            if factor:
                work[row] = [
                    value - factor * pivot_value
                    for value, pivot_value in zip(work[row], work[pivot_row])
                ]
        pivot_row += 1
        if pivot_row == rows:
            break
    return pivot_row


def _source_cauchy_matrix(
    count: int,
    positive_b: list[Fraction],
    diagonal: list[Fraction],
) -> list[list[Fraction]]:
    """Build modes -N,...,N; diagonal is indexed by absolute mode."""
    modes = list(range(-count, count + 1))
    b = {
        mode: F(0)
        if mode == 0
        else (positive_b[mode - 1] if mode > 0 else -positive_b[-mode - 1])
        for mode in modes
    }
    matrix: list[list[Fraction]] = []
    for mode in modes:
        row: list[Fraction] = []
        for other in modes:
            if mode == other:
                row.append(diagonal[abs(mode)])
            else:
                row.append((b[mode] - b[other]) / F(mode - other))
        matrix.append(row)
    return matrix


def _assert_source_cauchy(
    testcase: unittest.TestCase,
    matrix: list[list[Fraction]],
    positive_b: list[Fraction],
) -> None:
    count = (len(matrix) - 1) // 2
    modes = list(range(-count, count + 1))
    b = {
        mode: F(0)
        if mode == 0
        else (positive_b[mode - 1] if mode > 0 else -positive_b[-mode - 1])
        for mode in modes
    }
    for i, mode in enumerate(modes):
        testcase.assertEqual(matrix[i][i], matrix[-i - 1][-i - 1])
        for j, other in enumerate(modes):
            testcase.assertEqual(matrix[i][j], matrix[j][i])
            testcase.assertEqual(matrix[i][j], matrix[-i - 1][-j - 1])
            if i != j:
                testcase.assertEqual(
                    matrix[i][j],
                    (b[mode] - b[other]) / F(mode - other),
                )


def _raw_even_operator(matrix: list[list[Fraction]]) -> list[list[Fraction]]:
    """Restriction in raw coordinates (x_0,x_1,...,x_N), without sqrt(2)."""
    count = (len(matrix) - 1) // 2
    columns: list[list[Fraction]] = []
    for shell in range(count + 1):
        vector = [F(0) for _ in range(2 * count + 1)]
        if shell == 0:
            vector[count] = F(1)
        else:
            vector[count - shell] = F(1)
            vector[count + shell] = F(1)
        image = _matvec(matrix, vector)
        columns.append([image[count + row] for row in range(count + 1)])
    return [
        [columns[column][row] for column in range(count + 1)]
        for row in range(count + 1)
    ]


class EvenSectorCrossRootLimitBridgeTests(unittest.TestCase):
    def test_raw_mode_polynomial_equals_exact_determinant_resolvent_numerator(self) -> None:
        central = F(5, 7)
        positive = [F(-2, 3), F(4, 5), F(1, 9)]
        polynomial_y = _raw_mode_polynomial(central, positive)
        from_raw_formula = _substitute_square(polynomial_y)
        from_determinant = _determinant_resolvent_numerator(central, positive)
        self.assertEqual(from_raw_formula, from_determinant)

        boundary = central + 2 * sum(positive, F(0))
        self.assertEqual(polynomial_y[-1], boundary)

        # Exact rational part of the transform at s=1/2:
        # sum_j x_j/(s-j)=p_x(s^2)/(s*product_n(s^2-n^2)).
        s = F(1, 2)
        paired_resolvent = central / s + sum(
            (
                coefficient / (s - index)
                + coefficient / (s + index)
                for index, coefficient in enumerate(positive, start=1)
            ),
            F(0),
        )
        denominator = s
        for index in range(1, len(positive) + 1):
            denominator *= s * s - index * index
        self.assertEqual(
            paired_resolvent,
            _poly_value(polynomial_y, s * s) / denominator,
        )

    def test_boundary_zero_ground_is_closed_limit_of_nonzero_boundary_grounds(self) -> None:
        # At epsilon=0 this is the all-ones matrix.  Its even ground
        # x=(1,-2,1) has c=0 and p_x=2.
        limiting_matrix = _source_cauchy_matrix(1, [F(1)], [F(1), F(1)])
        limiting_x = [F(1), F(-2), F(1)]
        _assert_source_cauchy(self, limiting_matrix, [F(1)])
        self.assertEqual(_matvec(limiting_matrix, limiting_x), [F(0)] * 3)
        self.assertEqual(sum(limiting_x), 0)
        self.assertEqual(_raw_mode_polynomial(F(-2), [F(1)]), [F(2)])
        self.assertEqual(_matvec(limiting_matrix, [F(1)] * 3), [F(3)] * 3)

        # A diagonal-only Cauchy-preserving perturbation has c=epsilon,
        # one negative real y-root, and tends back to the constant polynomial.
        for epsilon in (F(1, 2), F(1, 3), F(1, 5)):
            diagonal = [F(2) / (F(2) - epsilon), F(1) - epsilon]
            matrix = _source_cauchy_matrix(1, [F(1)], diagonal)
            vector = [F(1), -F(2) + epsilon, F(1)]
            _assert_source_cauchy(self, matrix, [F(1)])
            self.assertEqual(_matvec(matrix, vector), [F(0)] * 3)
            self.assertEqual(sum(vector), epsilon)
            polynomial = _raw_mode_polynomial(vector[1], [vector[2]])
            self.assertEqual(polynomial, [F(2) - epsilon, epsilon])
            self.assertEqual(
                -polynomial[0] / polynomial[1],
                -(F(2) - epsilon) / epsilon,
            )
            # The second even eigenvalue is the positive trace of the
            # two-dimensional even restriction; zero is its simple ground.
            other_even = diagonal[0] + diagonal[1] + F(1)
            self.assertGreater(other_even, 0)

    def test_zero_central_coefficient_needs_no_x0_hypothesis(self) -> None:
        matrix = _source_cauchy_matrix(1, [F(0)], [F(1), F(0)])
        vector = [F(1), F(0), F(1)]
        _assert_source_cauchy(self, matrix, [F(0)])
        self.assertEqual(_matvec(matrix, vector), [F(0)] * 3)
        self.assertEqual(sum(vector), F(2))
        self.assertEqual(_raw_mode_polynomial(F(0), [F(1)]), [F(0), F(2)])

        # The other even direction V_0 has eigenvalue one, while the odd
        # direction has eigenvalue zero.  The even ground is simple although
        # the full eigenvalue is not simple.
        self.assertEqual(_matvec(matrix, [F(0), F(1), F(0)]), [F(0), F(1), F(0)])
        self.assertEqual(_matvec(matrix, [F(1), F(0), F(-1)]), [F(0)] * 3)

    def test_n1_simple_even_ground_can_have_negative_odd_block(self) -> None:
        matrix = _source_cauchy_matrix(1, [F(1)], [F(2), F(0)])
        even_ground = [F(1), F(-1), F(1)]
        even_other = [F(1), F(2), F(1)]
        odd = [F(1), F(0), F(-1)]
        _assert_source_cauchy(self, matrix, [F(1)])
        self.assertEqual(_matvec(matrix, even_ground), [F(0)] * 3)
        self.assertEqual(_matvec(matrix, even_other), [3 * value for value in even_other])
        self.assertEqual(_matvec(matrix, odd), [-value for value in odd])
        self.assertEqual(sum(even_ground), F(1))
        self.assertEqual(_raw_mode_polynomial(F(-1), [F(1)]), [F(1), F(1)])

    def test_nonextremal_even_eigenvector_can_have_nonreal_y_roots(self) -> None:
        matrix = _source_cauchy_matrix(
            2,
            [F(-6), F(-6)],
            [F(-5), F(-26, 5), F(13, 5)],
        )
        vector = [F(5, 6), F(-5, 6), F(1), F(-5, 6), F(5, 6)]
        _assert_source_cauchy(self, matrix, [F(-6), F(-6)])
        self.assertEqual(_matvec(matrix, vector), [F(0)] * 5)

        # The even zero eigenspace is one-dimensional, but V_0 has negative
        # Rayleigh value, so this simple even eigenvector is not extremal.
        self.assertEqual(_rank(_raw_even_operator(matrix)), 2)
        v0 = [F(0), F(0), F(1), F(0), F(0)]
        self.assertEqual(_dot(v0, _matvec(matrix, v0)), F(-5))

        polynomial = _raw_mode_polynomial(F(1), [F(-5, 6), F(5, 6)])
        self.assertEqual(polynomial, [F(4), F(0), F(1)])
        discriminant = polynomial[1] ** 2 - 4 * polynomial[2] * polynomial[0]
        self.assertEqual(discriminant, F(-16))

    def test_note_locks_source_conventions_and_claim_boundary(self) -> None:
        text = NOTE.read_text(encoding="utf-8")
        self.assertIn("P0_INVALIDATED", text)
        self.assertIn("e^{-izt}", text)
        self.assertIn("minus sign in source (3.19)", text)
        self.assertIn("n<=lambda^2", text)
        self.assertIn("does not prove", text)
        self.assertIn("locally uniform convergence", text)
        self.assertIn("full-`L2` eigenvector estimate", text)
        self.assertIn("signed even alignment/action estimate", text)
        self.assertIn(
            "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
            text,
        )

        forbidden = (
            "RH_" + "PROVED",
            "CERT" + "IFIED",
        )
        for token in forbidden:
            with self.subTest(token=token):
                self.assertNotIn(token, text)


if __name__ == "__main__":
    unittest.main()
