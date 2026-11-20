from __future__ import annotations

import unittest
from fractions import Fraction
from functools import lru_cache
from math import factorial

import mpmath as mp


F = Fraction
Matrix = tuple[tuple[Fraction, ...], ...]


def _transpose(matrix: Matrix) -> Matrix:
    return tuple(
        tuple(matrix[i][j] for i in range(len(matrix)))
        for j in range(len(matrix[0]))
    )


def _matmul(left: Matrix, right: Matrix) -> Matrix:
    assert len(left[0]) == len(right)
    return tuple(
        tuple(
            sum(
                (left[i][k] * right[k][j] for k in range(len(right))),
                F(0),
            )
            for j in range(len(right[0]))
        )
        for i in range(len(left))
    )


def _subtract(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] - right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def _add(left: Matrix, right: Matrix) -> Matrix:
    return tuple(
        tuple(left[i][j] + right[i][j] for j in range(len(left[0])))
        for i in range(len(left))
    )


def _scale(scalar: Fraction, matrix: Matrix) -> Matrix:
    return tuple(tuple(scalar * value for value in row) for row in matrix)


def _norm_squared(vector: Matrix) -> Fraction:
    assert len(vector[0]) == 1
    return _matmul(_transpose(vector), vector)[0][0]


def _identity(size: int) -> Matrix:
    return tuple(
        tuple(F(int(i == j)) for j in range(size)) for i in range(size)
    )


def _shift(matrix: Matrix, sigma: Fraction) -> Matrix:
    return tuple(
        tuple(
            matrix[i][j] + (sigma if i == j else F(0))
            for j in range(len(matrix))
        )
        for i in range(len(matrix))
    )


def _outer(left: tuple[Fraction, ...], right: tuple[Fraction, ...]) -> Matrix:
    return tuple(tuple(x * y for y in right) for x in left)


def _inverse(matrix: Matrix) -> Matrix:
    size = len(matrix)
    assert all(len(row) == size for row in matrix)
    augmented = [
        list(row) + list(identity_row)
        for row, identity_row in zip(matrix, _identity(size))
    ]

    for column in range(size):
        pivot = next(row for row in range(column, size) if augmented[row][column] != 0)
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]
        pivot_value = augmented[column][column]
        augmented[column] = [value / pivot_value for value in augmented[column]]
        for row in range(size):
            if row == column:
                continue
            factor = augmented[row][column]
            augmented[row] = [
                value - factor * pivot_entry
                for value, pivot_entry in zip(augmented[row], augmented[column])
            ]

    return tuple(tuple(row[size:]) for row in augmented)


def _determinant(matrix: Matrix) -> Fraction:
    size = len(matrix)
    work = [list(row) for row in matrix]
    determinant = F(1)
    for column in range(size):
        pivot = next((row for row in range(column, size) if work[row][column] != 0), None)
        if pivot is None:
            return F(0)
        if pivot != column:
            work[column], work[pivot] = work[pivot], work[column]
            determinant = -determinant
        pivot_value = work[column][column]
        determinant *= pivot_value
        for row in range(column + 1, size):
            factor = work[row][column] / pivot_value
            for entry in range(column, size):
                work[row][entry] -= factor * work[column][entry]
    return determinant


def _block(
    upper_left: Matrix,
    upper_right: Matrix,
    lower_left: Matrix,
    lower_right: Matrix,
) -> Matrix:
    upper = tuple(upper_left[i] + upper_right[i] for i in range(len(upper_left)))
    lower = tuple(lower_left[i] + lower_right[i] for i in range(len(lower_left)))
    return upper + lower


def _check_n1_source_cauchy_parity_countermodel_and_rank_one_commutator() -> None:
    modes = (F(-1), F(0), F(1))
    source_b = (F(-1), F(0), F(1))
    diagonal = (F(0), F(10), F(0))
    eta = (F(1), F(1), F(1))

    q = tuple(
        tuple(
            diagonal[i]
            if i == j
            else (source_b[i] - source_b[j]) / (modes[i] - modes[j])
            for j in range(3)
        )
        for i in range(3)
    )
    expected_q = (
        (F(0), F(1), F(1)),
        (F(1), F(10), F(1)),
        (F(1), F(1), F(0)),
    )
    assert q == expected_q
    assert q == _transpose(q)

    inversion = (
        (F(0), F(0), F(1)),
        (F(0), F(1), F(0)),
        (F(1), F(0), F(0)),
    )
    assert _matmul(q, inversion) == _matmul(inversion, q)

    mode_operator = (
        (F(-1), F(0), F(0)),
        (F(0), F(0), F(0)),
        (F(0), F(0), F(1)),
    )
    assert _subtract(
        _matmul(mode_operator, q), _matmul(q, mode_operator)
    ) == _subtract(_outer(source_b, eta), _outer(eta, source_b))

    # Rational parity bases: (V_0, V_-1 + V_1) and (V_1 - V_-1).
    # They differ from the note's normalized bases only by exact positive scales.
    plus_basis = (
        (F(0), F(1)),
        (F(1), F(0)),
        (F(0), F(1)),
    )
    minus_basis = ((F(-1),), (F(0),), (F(1),))
    q_plus = ((F(10), F(2)), (F(1), F(1)))
    q_minus = ((F(-1),),)
    assert _matmul(q, plus_basis) == _matmul(plus_basis, q_plus)
    assert _matmul(q, minus_basis) == _matmul(minus_basis, q_minus)

    plus_gram = _matmul(_transpose(plus_basis), plus_basis)
    plus_form = _matmul(plus_gram, q_plus)
    assert plus_gram == ((F(1), F(0)), (F(0), F(2)))
    assert plus_form == ((F(10), F(2)), (F(2), F(2)))
    assert plus_form == _transpose(plus_form)
    assert plus_form[0][0] == 10
    assert _determinant(q_plus) == 8
    assert _determinant(plus_form) == 16
    assert q_minus == ((F(-1),),)

    d_low = ((F(0), F(1)),)
    assert _matmul(mode_operator, plus_basis) == _matmul(minus_basis, d_low)
    eta_covector = _matmul((eta,), plus_basis)
    assert eta_covector == ((F(1), F(2)),)
    parity_commutator = _subtract(_matmul(d_low, q_plus), _matmul(q_minus, d_low))
    assert parity_commutator == ((F(1), F(2)),)
    assert parity_commutator == _matmul(((F(1),),), eta_covector)


def _check_two_plus_two_schur_and_resolvent_identities_at_exact_shifts() -> None:
    d_block = ((F(5), F(1)), (F(1), F(4)))
    coupling = ((F(1), F(0)), (F(1), F(1)))
    h_block = ((F(3), F(1)), (F(1), F(2)))
    b_matrix = _block(d_block, _transpose(coupling), coupling, h_block)
    inclusion = ((F(1), F(0)), (F(0), F(1)), (F(0), F(0)), (F(0), F(0)))

    expected = {
        F(0): (
            ((F(1, 5), F(-1, 5)), (F(2, 5), F(3, 5))),
            ((F(22, 5), F(3, 5)), (F(3, 5), F(17, 5))),
        ),
        F(1, 5): (
            ((F(30, 151), F(-25, 151)), (F(55, 151), F(80, 151))),
            ((F(3501, 755), F(96, 151)), (F(96, 151), F(2771, 755))),
        ),
        F(7, 3): (
            ((F(30, 199), F(-9, 199)), (F(39, 199), F(48, 199))),
            ((F(4171, 597), F(160, 199)), (F(160, 199), F(3637, 597))),
        ),
    }

    for sigma, (expected_s, expected_sigma) in expected.items():
        shifted_h = _shift(h_block, sigma)
        shifted_b = _shift(b_matrix, sigma)
        s_operator = _matmul(_inverse(shifted_h), coupling)
        sigma_block = _subtract(
            _shift(d_block, sigma),
            _matmul(_transpose(coupling), s_operator),
        )
        harmonic_lift = _identity(2) + tuple(
            tuple(-value for value in row) for row in s_operator
        )

        assert s_operator == expected_s
        assert sigma_block == expected_sigma
        assert sigma_block == _transpose(sigma_block)
        assert sigma_block[0][0] > 0
        assert _determinant(sigma_block) > 0

        included_sigma = _matmul(inclusion, sigma_block)
        assert _matmul(shifted_b, harmonic_lift) == included_sigma
        assert _matmul(
            _transpose(harmonic_lift), _matmul(shifted_b, harmonic_lift)
        ) == sigma_block
        assert _determinant(shifted_b) == _determinant(
            shifted_h
        ) * _determinant(sigma_block)
        assert _matmul(_inverse(shifted_b), inclusion) == _matmul(
            harmonic_lift, _inverse(sigma_block)
        )


def _check_all_shift_metric_rotation_countermodel() -> None:
    for integer_m in (2, 3, 5, 17, 101):
        m = F(integer_m)
        b_matrix = (
            (m + 3, F(1), F(2)),
            (F(1), F(1), F(0)),
            (F(2), F(0), F(2)),
        )
        assert _determinant(b_matrix) == 2 * m

        h_block = ((F(1), F(0)), (F(0), F(2)))
        coupling = ((F(1),), (F(2),))
        sigma_zero = ((m,),)
        assert _subtract(
            ((m + 3,),),
            _matmul(_transpose(coupling), _matmul(_inverse(h_block), coupling)),
        ) == sigma_zero

        g = F(1, 2)
        dangerous = (
            (F(1, 4), F(0), F(0)),
            (F(0), F(0), F(0)),
            (F(0), F(0), F(0)),
        )
        positive_part = _add(_shift(b_matrix, -g), dangerous)
        assert positive_part[0][0] > 0
        assert _determinant(
            tuple(tuple(positive_part[i][j] for j in range(2)) for i in range(2))
        ) > 0
        assert _determinant(positive_part) == F(3, 4) * (m - F(23, 12))
        assert _add(_shift(positive_part, g), _scale(F(-1), dangerous)) == b_matrix

        metric = (
            (F(1), F(0), F(0)),
            (F(0), (1 + m * m) / 2, (1 - m * m) / 2),
            (F(0), (1 - m * m) / 2, (1 + m * m) / 2),
        )
        e_zero = ((F(1),), (F(0),), (F(0),))
        b_e_zero = _matmul(b_matrix, e_zero)
        b_squared_e_zero = _matmul(b_matrix, b_e_zero)
        krylov_matrix = tuple(
            tuple(column[row][0] for column in (e_zero, b_e_zero, b_squared_e_zero))
            for row in range(3)
        )
        assert _determinant(krylov_matrix) == 2

        e_one = ((F(0),), (F(1),), (F(0),))
        cyclic_endpoint = _matmul(_inverse(b_matrix), e_one)
        assert cyclic_endpoint == (
            (-1 / m,),
            (1 + 1 / m,),
            (1 / m,),
        )
        assert _norm_squared(_matmul(metric, cyclic_endpoint)) == (
            m**4 / 2 + (1 + 2 / m) ** 2 / 2 + 1 / (m * m)
        )

        inclusion = ((F(1),), (F(0),), (F(0),))
        endpoint = _matmul(_inverse(b_matrix), inclusion)
        assert endpoint == ((1 / m,), (-1 / m,), (-1 / m,))
        assert _norm_squared(_matmul(metric, endpoint)) == F(3) / (m * m)

        shifted = _matmul(_inverse(_shift(b_matrix, F(1))), inclusion)
        denominator = m + F(13, 6)
        assert shifted == (
            (1 / denominator,),
            (-F(1, 2) / denominator,),
            (-F(2, 3) / denominator,),
        )
        assert _norm_squared(_matmul(metric, shifted)) == (
            m**4 + 121
        ) / (2 * (6 * m + 13) ** 2)


def _check_odd_multiplier_dangerous_exterior_identities() -> None:
    u_shift = F(1, 7)
    b_matrix = (
        (F(107, 40), F(1, 2), F(1, 3)),
        (F(1, 2), F(3, 4), F(1, 6)),
        (F(1, 3), F(1, 6), F(29, 18)),
    )
    q_matrix = _shift(b_matrix, u_shift)
    d_block = tuple(tuple(b_matrix[i][j] for j in range(2)) for i in range(2))
    coupling = ((F(1, 3), F(1, 6)),)
    h_block = ((F(29, 18),),)
    inclusion = ((F(1), F(0)), (F(0), F(1)), (F(0), F(0)))
    t_ext = tuple(tuple(-q_matrix[i][j] for j in range(3)) for i in range(2))

    sigma_zero = _subtract(
        d_block,
        _matmul(_transpose(coupling), _matmul(_inverse(h_block), coupling)),
    )
    assert sigma_zero == (
        (F(3023, 1160), F(27, 58)),
        (F(27, 58), F(85, 116)),
    )
    assert _determinant(sigma_zero) == F(1571, 928)

    for sigma in (F(0), F(1, 5), F(7, 3)):
        shifted_h = _shift(h_block, sigma)
        s_operator = _matmul(_inverse(shifted_h), coupling)
        harmonic_lift = _identity(2) + tuple(
            tuple(-value for value in row) for row in s_operator
        )
        sigma_block = _subtract(
            _shift(d_block, sigma),
            _matmul(_transpose(coupling), s_operator),
        )
        exterior_sigma = _add(
            _scale(sigma - u_shift, _identity(2)),
            _scale(F(-1), _matmul(t_ext, harmonic_lift)),
        )
        shifted_b = _shift(b_matrix, sigma)
        assert exterior_sigma == sigma_block
        assert _matmul(shifted_b, harmonic_lift) == _matmul(inclusion, sigma_block)
        assert _matmul(_inverse(shifted_b), inclusion) == _matmul(
            harmonic_lift, _inverse(sigma_block)
        )


def _check_rank_one_commutator_does_not_control_fixed_threshold_leakage() -> None:
    p_plus = (
        (F(9, 25), F(12, 25)),
        (F(12, 25), F(16, 25)),
    )
    p_minus = (
        (F(9, 73), F(24, 73)),
        (F(24, 73), F(64, 73)),
    )
    identity = _identity(2)
    derivative = ((F(1), F(0)), (F(0), F(2)))
    f_plus = _subtract(identity, p_plus)
    f_minus = _subtract(identity, p_minus)

    assert _matmul(p_plus, p_plus) == p_plus
    assert _matmul(p_minus, p_minus) == p_minus
    assert _transpose(p_plus) == p_plus
    assert _transpose(p_minus) == p_minus

    a_matrix = _subtract(_scale(F(2), p_plus), identity)
    b_matrix = _subtract(_scale(F(2), p_minus), identity)
    commutator_coefficient = _subtract(
        _matmul(derivative, a_matrix),
        _matmul(b_matrix, derivative),
    )
    assert commutator_coefficient == (
        (F(864, 1825), F(-648, 1825)),
        (F(2304, 1825), F(-1728, 1825)),
    )
    assert _determinant(commutator_coefficient) == 0
    assert commutator_coefficient != ((F(0), F(0)), (F(0), F(0)))

    forward_leakage = _matmul(f_minus, _matmul(derivative, p_plus))
    reverse_leakage = _matmul(p_minus, _matmul(derivative, f_plus))
    assert forward_leakage == ((F(0), F(0)), (F(0), F(0)))
    assert reverse_leakage == (
        (F(-432, 1825), F(324, 1825)),
        (F(-1152, 1825), F(864, 1825)),
    )
    reverse_gram = _matmul(_transpose(reverse_leakage), reverse_leakage)
    assert _determinant(reverse_gram) == 0
    assert reverse_gram[0][0] + reverse_gram[1][1] == F(1296, 1825)

    for epsilon in (F(1, 3), F(1, 17), F(1, 101)):
        tau = F(1)
        r_plus = _add(_scale(tau, identity), _scale(epsilon, a_matrix))
        r_minus = _add(_scale(tau, identity), _scale(epsilon, b_matrix))
        commutator = _subtract(
            _matmul(derivative, r_plus),
            _matmul(r_minus, derivative),
        )
        assert commutator == _scale(epsilon, commutator_coefficient)
        assert _determinant(commutator) == 0
        assert _matmul(
            p_minus, _matmul(commutator, f_plus)
        ) == _scale(-2 * epsilon, reverse_leakage)
        assert _matmul(
            f_minus, _matmul(commutator, p_plus)
        ) == ((F(0), F(0)), (F(0), F(0)))


def _check_anchor_chart_and_negative_reserve_countermodel() -> None:
    kappa_zero = F(3, 5)
    anchor_tail = ((F(4, 5),), (F(0),))
    chart_gram = _add(
        _identity(2),
        _scale(1 / (kappa_zero * kappa_zero), _matmul(anchor_tail, _transpose(anchor_tail))),
    )
    chart_gram_inverse = _subtract(
        _identity(2), _matmul(anchor_tail, _transpose(anchor_tail))
    )
    assert chart_gram == ((F(25, 9), F(0)), (F(0), F(1)))
    assert chart_gram_inverse == ((F(9, 25), F(0)), (F(0), F(1)))
    assert _matmul(chart_gram, chart_gram_inverse) == _identity(2)
    assert _determinant(chart_gram) == 1 / (kappa_zero * kappa_zero)

    mode_numbers = ((F(1), F(0)), (F(0), F(2)))
    inverse_square_root = ((F(3, 5), F(0)), (F(0), F(1)))
    orthonormal_derivative = _matmul(mode_numbers, inverse_square_root)
    assert _determinant(orthonormal_derivative) ** 2 == F(36, 25)
    assert _determinant(orthonormal_derivative) ** 2 == (
        F(2) ** 2 * kappa_zero**2
    )

    even_complement = ((F(3, 4), F(2, 3)), (F(2, 3), F(5, 8)))
    odd_block = ((F(-1, 4), F(-1, 6)), (F(-1, 6), F(-1, 8)))
    assert even_complement[0][0] > 0
    assert _determinant(even_complement) == F(7, 288)
    assert odd_block[0][0] < 0
    assert _determinant(odd_block) == F(1, 288)

    pulled_odd = _matmul(mode_numbers, _matmul(odd_block, mode_numbers))
    assert pulled_odd == ((F(-1, 4), F(-1, 3)), (F(-1, 3), F(-1, 2)))

    # The physical columns are sqrt(2) times these rational columns.
    rational_columns = (
        (F(3, 4), F(-1, 4)),
        (F(5, 4), F(-3, 16)),
    )
    completed_core = _add(
        pulled_odd,
        _scale(F(2), _matmul(rational_columns, _transpose(rational_columns))),
    )
    assert completed_core == (
        (F(1), F(157, 96)),
        (F(157, 96), F(345, 128)),
    )
    assert completed_core[0][0] > 0
    assert _determinant(completed_core) == F(191, 9216)

    load = _scale(
        F(2),
        _matmul(
            _transpose(rational_columns),
            _matmul(_inverse(completed_core), rational_columns),
        ),
    )
    assert load == (
        (F(225, 191), F(24, 191)),
        (F(24, 191), F(927, 191)),
    )
    reserve = _subtract(_identity(2), load)
    assert reserve == (
        (F(-34, 191), F(-24, 191)),
        (F(-24, 191), F(-736, 191)),
    )
    assert reserve[0][0] < 0
    assert reserve[1][1] < 0
    assert _determinant(reserve) == F(128, 191)


def _check_trace_selected_joint_spectral_buffer() -> None:
    lower = F(1, 2)
    upper = F(3, 4)
    plus_spectrum = (F(1, 8), F(17, 32), F(21, 32), F(7, 8))
    minus_spectrum = (F(1, 4), F(19, 32), F(23, 32))
    interior = sorted(
        {
            value
            for value in plus_spectrum + minus_spectrum
            if lower < value < upper
        }
    )
    augmented = [lower, *interior, upper]
    gaps = [
        (augmented[index + 1] - augmented[index], augmented[index])
        for index in range(len(augmented) - 1)
    ]
    longest = max(length for length, _ in gaps)
    left_endpoint = next(left for length, left in gaps if length == longest)
    threshold = left_endpoint + longest / 2

    assert interior == [F(17, 32), F(19, 32), F(21, 32), F(23, 32)]
    assert longest == F(1, 16)
    assert left_endpoint == F(17, 32)
    assert threshold == F(9, 16)
    assert longest >= (upper - lower) / (len(interior) + 1)

    plus_low = [value for value in plus_spectrum if value < threshold]
    plus_high = [value for value in plus_spectrum if value >= threshold]
    minus_low = [value for value in minus_spectrum if value < threshold]
    minus_high = [value for value in minus_spectrum if value >= threshold]
    gamma_one = min(plus_high) - max(minus_low)
    gamma_two = min(minus_high) - max(plus_low)
    assert gamma_one >= longest
    assert gamma_two == longest
    assert F(1) - threshold >= F(1, 4)


def _check_rank_two_combined_load_characteristic_polynomial() -> None:
    # The two rank-one terms are individually nonorthogonal, but their
    # cancellation leaves diag(6, 1).  This checks the cross sign in S.
    r_vector = (F(1), F(1))
    d_vector = (F(0), F(-1))
    e_vector = (F(6), F(0))
    t_vector = (F(-6), F(1))
    operator = _subtract(
        _outer(r_vector, e_vector),
        _outer(d_vector, t_vector),
    )
    assert operator == ((F(6), F(0)), (F(0), F(1)))

    r_norm = sum((value * value for value in r_vector), F(0))
    d_norm = sum((value * value for value in d_vector), F(0))
    e_norm = sum((value * value for value in e_vector), F(0))
    t_norm = sum((value * value for value in t_vector), F(0))
    r_d = sum((x * y for x, y in zip(r_vector, d_vector)), F(0))
    t_e = sum((x * y for x, y in zip(t_vector, e_vector)), F(0))
    s_coefficient = r_norm * e_norm + d_norm * t_norm - 2 * r_d * t_e
    d_coefficient = _determinant(
        ((r_norm, r_d), (r_d, d_norm))
    ) * _determinant(((e_norm, t_e), (t_e, t_norm)))
    assert s_coefficient == 37
    assert d_coefficient == 36
    assert s_coefficient**2 - 4 * d_coefficient == 35**2
    assert (s_coefficient + 35) / 2 == 36

    gram = _matmul(_transpose(operator), operator)
    assert gram == ((F(36), F(0)), (F(0), F(1)))
    assert gram[0][0] + gram[1][1] == s_coefficient
    assert _determinant(gram) == d_coefficient


def _check_endpoint_transform_and_positive_symbol_sqrt_n_obstruction() -> None:
    with mp.workdps(90):
        pi = mp.pi
        length = 2 * pi
        t_value = mp.mpf("0.37")
        mode_cutoff = 7
        finite_sum = mp.fsum(
            1 / (t_value - n) for n in range(-mode_cutoff, mode_cutoff + 1)
        )
        endpoint_transform = (
            2 * mp.sin(length * t_value / 2) / length * finite_sum
        )
        tail_sum = mp.nsum(
            lambda index: 1 / (index**2 - t_value**2),
            [mode_cutoff + 1, mp.inf],
        )
        tail_identity = (
            4
            * t_value
            * mp.sin(length * t_value / 2)
            / length
            * tail_sum
        )
        assert abs(
            endpoint_transform - mp.cos(length * t_value / 2) - tail_identity
        ) < mp.mpf("1e-80")

        omega_next = 2 * pi * (mode_cutoff + 1) / length
        upper_bound = (
            abs(t_value)
            * length
            / (
                pi**2
                * mode_cutoff
                * (1 - (abs(t_value) / omega_next) ** 2)
            )
        )
        assert abs(endpoint_transform - mp.cos(length * t_value / 2)) <= upper_bound

        # D_N is even and cannot detect a Fourier-sign mutation by itself.
        # A centered single mode at the positive half-grid does detect it.
        half_grid = pi / length
        for mode in (-3, -1, 0, 2, 5):
            mode_frequency = 2 * pi * mode / length
            centered_phase = mp.mpf(-1) ** mode
            minus_sign_transform = (
                centered_phase
                / mp.sqrt(length)
                * 2
                * mp.sin((mode_frequency - half_grid) * length / 2)
                / (mode_frequency - half_grid)
            )
            plus_sign_transform = (
                centered_phase
                / mp.sqrt(length)
                * 2
                * mp.sin((mode_frequency + half_grid) * length / 2)
                / (mode_frequency + half_grid)
            )
            assert abs(
                pi / mp.sqrt(length) * minus_sign_transform
                + mp.mpf(2) / (2 * mode - 1)
            ) < mp.mpf("1e-80")
            assert abs(
                pi / mp.sqrt(length) * plus_sign_transform
                - mp.mpf(2) / (2 * mode + 1)
            ) < mp.mpf("1e-80")
            if mode != 0:
                assert abs(minus_sign_transform - plus_sign_transform) > mp.mpf("1e-6")

        gamma = mp.mpf(3) / 5
        normalized_loads = []
        for cutoff in (8, 32, 128, 512):
            nonzero_modes = [
                mp.mpf(n) for n in range(-cutoff, cutoff + 1) if n != 0
            ]
            sine_norm_squared = mp.fsum(
                (2 * n / (mp.mpf(1) / 4 - n * n)) ** 2 / length
                for n in nonzero_modes
            )
            cosine_tail_norm_squared = mp.fsum(
                (1 / (mp.mpf(1) / 4 - n * n)) ** 2 / length
                for n in nonzero_modes
            )
            cosine_tail_endpoint = mp.fsum(
                1 / (mp.mpf(1) / 4 - n * n) / length
                for n in nonzero_modes
            )
            endpoint_far_squared = (
                2 * cutoff / length
                - cosine_tail_endpoint**2 / cosine_tail_norm_squared
            )
            assert gamma * sine_norm_squared > mp.mpf("0.3")
            assert gamma * cosine_tail_norm_squared > mp.mpf("0.3")
            assert endpoint_far_squared > 0

            oriented_load = (
                length
                * gamma
                / pi
                * mp.sqrt(sine_norm_squared * endpoint_far_squared)
            )
            normalized_loads.append(oriented_load / mp.sqrt(cutoff))

        assert all(
            left < right
            for left, right in zip(normalized_loads, normalized_loads[1:])
        )
        assert abs(normalized_loads[-1] - gamma * length / pi) < mp.mpf("0.004")


def _check_exact_fraction_endpoint_atom_counterfamily() -> None:
    cutoff = 32
    modes = tuple(range(-cutoff, 0)) + tuple(range(1, cutoff + 1))
    endpoint = tuple(F(1) for _ in modes)
    sine = tuple(F(4 * mode, 4 * mode * mode - 1) for mode in modes)
    cosine = tuple(F(-2, 4 * mode * mode - 1) for mode in modes)

    assert tuple(F(mode) * value for mode, value in zip(modes, cosine)) == tuple(
        -value / 2 for value in sine
    )
    assert tuple(F(mode) * value for mode, value in zip(modes, sine)) == tuple(
        one - value / 2 for one, value in zip(endpoint, cosine)
    )

    # This is the rationally scaled positive two-atom commutator.
    for row, mode_row in enumerate(modes):
        for column, mode_column in enumerate(modes):
            commutator_entry = (
                F(mode_row) * cosine[row] * cosine[column]
                - sine[row] * sine[column] * F(mode_column)
            )
            assert commutator_entry == -sine[row] * endpoint[column]

    sine_norm_squared = sum((value * value for value in sine), F(0))
    cosine_norm_squared = sum((value * value for value in cosine), F(0))
    endpoint_cosine = sum(cosine, F(0))
    assert sine_norm_squared == 32 * sum(
        (F(n * n, (4 * n * n - 1) ** 2) for n in range(1, cutoff + 1)),
        F(0),
    )
    assert cosine_norm_squared == 8 * sum(
        (F(1, (4 * n * n - 1) ** 2) for n in range(1, cutoff + 1)),
        F(0),
    )
    assert endpoint_cosine == F(-4 * cutoff, 2 * cutoff + 1)

    scaled_load_squared = sine_norm_squared * (
        2 * cutoff - endpoint_cosine**2 / cosine_norm_squared
    )
    assert F(9) < scaled_load_squared / cutoff < F(10)

    positive_cosine = tuple(F(-2, 4 * n * n - 1) for n in range(1, cutoff + 1))
    moment_zero = sum((value * value for value in positive_cosine), F(0))
    moment_one = sum(
        (F(n * n) * value * value for n, value in enumerate(positive_cosine, 1)),
        F(0),
    )
    moment_two = sum(
        (F(n**4) * value * value for n, value in enumerate(positive_cosine, 1)),
        F(0),
    )
    saturation_cross_squared = (
        moment_two / moment_one - moment_one / moment_zero
    )
    assert F(12) < saturation_cross_squared < F(13)

    # A nonzero odd base requires the residual metric.  Projecting the new
    # derivative image directly would miss the (4,-3) direction.
    base_vector = ((F(3, 5),), (F(4, 5),))
    base_projector = _matmul(base_vector, _transpose(base_vector))
    derivative_image = ((F(1),), (F(0),))
    residual_image = _matmul(
        _subtract(_identity(2), base_projector), derivative_image
    )
    residual_gram = _matmul(_transpose(residual_image), residual_image)
    residual_projector = _matmul(
        residual_image,
        _matmul(_inverse(residual_gram), _transpose(residual_image)),
    )
    assert residual_gram == ((F(16, 25),),)
    assert residual_projector == (
        (F(16, 25), F(-12, 25)),
        (F(-12, 25), F(9, 25)),
    )
    assert _add(base_projector, residual_projector) == _identity(2)
    second_axis = ((F(0),), (F(1),))
    assert _norm_squared(_matmul(_matmul(
        derivative_image, _transpose(derivative_image)
    ), second_axis)) == 0
    assert _norm_squared(_matmul(residual_projector, second_axis)) == F(9, 25)

    # At the positive half-grid, the finite endpoint sum and its tail both
    # telescope exactly.  The opposite Fourier sign differs on every
    # nonconstant single mode.
    half_grid_endpoint = 2 * sum(
        (F(1, 1 - 2 * mode) for mode in range(-cutoff, cutoff + 1)),
        F(0),
    )
    assert half_grid_endpoint == F(2, 2 * cutoff + 1)
    tail_truncation = sum(
        (F(1, 4 * n * n - 1) * 4 for n in range(cutoff + 1, 4 * cutoff + 1)),
        F(0),
    )
    assert tail_truncation == F(2, 2 * cutoff + 1) - F(2, 8 * cutoff + 1)
    source_mode = 2
    assert F(-2, 2 * source_mode - 1) != F(2, 2 * source_mode + 1)


def _check_rank_deficient_residual_saturation_projector() -> None:
    derivative = (
        (F(1), F(1), F(1)),
        (F(0), F(2), F(3)),
        (F(0), F(0), F(1)),
    )
    inclusion = (
        (F(1), F(0)),
        (F(0), F(1)),
        (F(0), F(0)),
    )
    base_projector = (
        (F(1), F(0), F(0)),
        (F(0), F(0), F(0)),
        (F(0), F(0), F(0)),
    )
    base_complement = _subtract(_identity(3), base_projector)
    residual_image = _matmul(
        base_complement, _matmul(derivative, inclusion)
    )
    residual_gram = _matmul(_transpose(residual_image), residual_image)
    residual_gram_dagger = ((F(0), F(0)), (F(0), F(1, 4)))
    residual_gram_dagger_half = ((F(0), F(0)), (F(0), F(1, 2)))
    assert residual_image == (
        (F(0), F(0)),
        (F(0), F(2)),
        (F(0), F(0)),
    )
    assert residual_gram == ((F(0), F(0)), (F(0), F(4)))

    new_projector = _matmul(
        residual_image,
        _matmul(residual_gram_dagger, _transpose(residual_image)),
    )
    saturated_projector = _add(base_projector, new_projector)
    assert new_projector == (
        (F(0), F(0), F(0)),
        (F(0), F(1), F(0)),
        (F(0), F(0), F(0)),
    )
    assert saturated_projector == (
        (F(1), F(0), F(0)),
        (F(0), F(1), F(0)),
        (F(0), F(0), F(0)),
    )
    assert _matmul(saturated_projector, saturated_projector) == saturated_projector

    far_projector = (
        (F(0), F(0), F(0)),
        (F(0), F(0), F(0)),
        (F(0), F(0), F(1)),
    )
    slope = (
        (F(0), F(0)),
        (F(0), F(0)),
        (F(1), F(0)),
    )
    derivative_far_slope = _matmul(
        derivative, _matmul(far_projector, slope)
    )
    assert derivative_far_slope == (
        (F(1), F(0)),
        (F(3), F(0)),
        (F(1), F(0)),
    )

    new_part = _matmul(new_projector, derivative_far_slope)
    residual_metric_part = _matmul(
        residual_gram_dagger_half,
        _matmul(_transpose(residual_image), derivative_far_slope),
    )
    assert new_part == (
        (F(0), F(0)),
        (F(3), F(0)),
        (F(0), F(0)),
    )
    assert residual_metric_part == (
        (F(0), F(0)),
        (F(3), F(0)),
    )
    assert _matmul(_transpose(new_part), new_part) == _matmul(
        _transpose(residual_metric_part), residual_metric_part
    ) == ((F(9), F(0)), (F(0), F(0)))

    complete_part = _matmul(saturated_projector, derivative_far_slope)
    reconstructed_part = _add(
        _matmul(base_projector, derivative_far_slope),
        _matmul(
            residual_image,
            _matmul(
                residual_gram_dagger,
                _matmul(_transpose(residual_image), derivative_far_slope),
            ),
        ),
    )
    assert complete_part == reconstructed_part == (
        (F(1), F(0)),
        (F(3), F(0)),
        (F(0), F(0)),
    )
    assert _matmul(_transpose(complete_part), complete_part) == (
        (F(10), F(0)),
        (F(0), F(0)),
    )


def _check_positive_saturated_metric_block_and_cyclic_span() -> None:
    retained = ((F(5),), (F(-1),))
    far = ((F(-1),), (F(-5),))
    retained_projector = _scale(
        F(1, 26), _matmul(retained, _transpose(retained))
    )
    far_projector = _scale(F(1, 26), _matmul(far, _transpose(far)))
    assert _matmul(retained_projector, retained_projector) == retained_projector
    assert _matmul(far_projector, far_projector) == far_projector
    assert _add(retained_projector, far_projector) == _identity(2)

    positive_direction = _add(_scale(F(2), retained), far)
    positive_block = _scale(
        F(1, 26), _matmul(positive_direction, _transpose(positive_direction))
    )
    complete_block = _add(far_projector, positive_block)
    assert complete_block == (
        (F(41, 13), F(-29, 13)),
        (F(-29, 13), F(37, 13)),
    )
    assert _determinant(complete_block) == F(4)

    def normalized_block_entry(left: Matrix, right: Matrix) -> Fraction:
        return _matmul(
            _transpose(left), _matmul(complete_block, right)
        )[0][0] / 26

    assert normalized_block_entry(retained, retained) == F(4)
    assert normalized_block_entry(retained, far) == F(2)
    assert normalized_block_entry(far, retained) == F(2)
    assert normalized_block_entry(far, far) == F(2)
    assert F(4) - F(2) * F(1, 2) * F(2) == F(2)
    assert _matmul(
        far_projector, _matmul(complete_block, far_projector)
    ) == _scale(F(2), far_projector)

    ordinary_slope = _scale(
        F(1, 2),
        _matmul(
            far_projector,
            _matmul(complete_block, retained_projector),
        ),
    )
    assert ordinary_slope == _scale(
        F(1, 26), _matmul(far, _transpose(retained))
    )
    assert _matmul(ordinary_slope, retained) == far

    derivative = ((F(1), F(0)), (F(0), F(2)))
    metric = _matmul(_transpose(derivative), derivative)
    assert metric == ((F(1), F(0)), (F(0), F(4)))
    moment_zero = _norm_squared(retained)
    moment_one = _matmul(
        _transpose(retained), _matmul(metric, retained)
    )[0][0]
    moment_two = _matmul(
        _transpose(retained), _matmul(_matmul(metric, metric), retained)
    )[0][0]
    assert (moment_zero, moment_one, moment_two) == (F(26), F(29), F(41))
    metric_leakage_squared = moment_two / moment_one - moment_one / moment_zero
    assert metric_leakage_squared == F(225, 754)

    derivative_retained = _matmul(derivative, retained)
    derivative_far = _matmul(derivative, far)
    derivative_retained_projector = _scale(
        F(1, 29),
        _matmul(derivative_retained, _transpose(derivative_retained)),
    )
    direct_leakage = _matmul(
        derivative_retained_projector,
        _matmul(derivative, far_projector),
    )
    direct_leakage_squared = sum(
        (value * value for row in direct_leakage for value in row), F(0)
    )
    assert direct_leakage_squared == metric_leakage_squared
    assert _matmul(_transpose(derivative_retained), derivative_far)[0][0] == F(15)

    metric_retained = _matmul(metric, retained)
    vandermonde = tuple(
        (retained[row][0], metric_retained[row][0]) for row in range(2)
    )
    assert vandermonde == ((F(5), F(5)), (F(-1), F(-4)))
    assert _determinant(vandermonde) == F(-15)
    assert _matmul(far_projector, metric_retained) == _scale(F(15, 26), far)


def _check_cancellation_preserving_load_necessary_bound() -> None:
    left_boundary = (F(3), F(0))
    left_derivative = (F(2), F(0))
    right_endpoint = (F(4), F(0))
    right_anchor = (F(1), F(0))
    combined = _subtract(
        _outer(left_boundary, right_endpoint),
        _outer(left_derivative, right_anchor),
    )
    assert combined == ((F(10), F(0)), (F(0), F(0)))
    operator_norm_squared = F(100)
    hilbert_schmidt_squared = sum(
        (value * value for row in combined for value in row), F(0)
    )
    assert hilbert_schmidt_squared == operator_norm_squared
    assert hilbert_schmidt_squared <= 2 * operator_norm_squared

    boundary_norm = F(3)
    derivative_norm = F(2)
    endpoint_norm = F(4)
    mixed_inner_product = F(4)
    lower_expression = (
        boundary_norm**2 * endpoint_norm**2
        - 2
        * boundary_norm
        * derivative_norm
        * mixed_inner_product
    )
    assert lower_expression == F(96)
    assert lower_expression <= 2 * operator_norm_squared

    # Squared form of R <= (DC + sqrt(D^2 C^2 + 2 E^2 nu^2))/E^2.
    nonradical_left = (
        boundary_norm * endpoint_norm**2
        - derivative_norm * mixed_inner_product
    )
    radical_squared = (
        derivative_norm**2 * mixed_inner_product**2
        + 2 * endpoint_norm**2 * operator_norm_squared
    )
    assert nonradical_left == F(40)
    assert nonradical_left**2 <= radical_squared


def _check_complex_rank_two_gram_conjugation_order() -> None:
    gaussian = tuple[Fraction, Fraction]

    def add(left: gaussian, right: gaussian) -> gaussian:
        return (left[0] + right[0], left[1] + right[1])

    def subtract(left: gaussian, right: gaussian) -> gaussian:
        return (left[0] - right[0], left[1] - right[1])

    def multiply(left: gaussian, right: gaussian) -> gaussian:
        return (
            left[0] * right[0] - left[1] * right[1],
            left[0] * right[1] + left[1] * right[0],
        )

    def conjugate(value: gaussian) -> gaussian:
        return (value[0], -value[1])

    def absolute_squared(value: gaussian) -> Fraction:
        return value[0] ** 2 + value[1] ** 2

    def inner(
        left: tuple[gaussian, ...], right: tuple[gaussian, ...]
    ) -> gaussian:
        value = (F(0), F(0))
        for left_entry, right_entry in zip(left, right):
            value = add(value, multiply(conjugate(left_entry), right_entry))
        return value

    left_boundary = ((F(1), F(1)), (F(2), F(-1)))
    left_derivative = ((F(2), F(0)), (F(-1), F(2)))
    right_endpoint = ((F(1), F(-2)), (F(3), F(1)))
    right_anchor = ((F(-1), F(1)), (F(2), F(0)))

    combined = tuple(
        tuple(
            subtract(
                multiply(left_boundary[row], conjugate(right_endpoint[column])),
                multiply(left_derivative[row], conjugate(right_anchor[column])),
            )
            for column in range(2)
        )
        for row in range(2)
    )
    assert combined == (
        ((F(1), F(5)), (F(0), F(2))),
        ((F(1), F(4)), (F(7), F(-9))),
    )
    hilbert_schmidt_squared = sum(
        (absolute_squared(value) for row in combined for value in row), F(0)
    )
    assert hilbert_schmidt_squared == F(177)

    norm_boundary = sum((absolute_squared(value) for value in left_boundary), F(0))
    norm_derivative = sum(
        (absolute_squared(value) for value in left_derivative), F(0)
    )
    norm_endpoint = sum((absolute_squared(value) for value in right_endpoint), F(0))
    norm_anchor = sum((absolute_squared(value) for value in right_anchor), F(0))
    correct_cross = multiply(
        inner(left_boundary, left_derivative),
        inner(right_anchor, right_endpoint),
    )
    formula_scalar = (
        norm_boundary * norm_endpoint
        + norm_derivative * norm_anchor
        - 2 * correct_cross[0]
    )
    assert formula_scalar == hilbert_schmidt_squared

    wrong_cross = multiply(
        inner(left_boundary, left_derivative),
        inner(right_endpoint, right_anchor),
    )
    wrong_scalar = (
        norm_boundary * norm_endpoint
        + norm_derivative * norm_anchor
        - 2 * wrong_cross[0]
    )
    assert wrong_scalar == F(165)
    assert wrong_scalar != hilbert_schmidt_squared

    determinant = subtract(
        multiply(combined[0][0], combined[1][1]),
        multiply(combined[0][1], combined[1][0]),
    )
    determinant_squared = absolute_squared(determinant)
    discriminant = hilbert_schmidt_squared**2 - 4 * determinant_squared
    assert determinant_squared == F(4176)
    assert discriminant == F(14625) > 0


def _check_exact_pole_row_formula_and_asymptotic() -> None:
    with mp.workdps(80):
        length = mp.mpf("4.3")
        half_length = length / 2
        for mode in (1, 2, 7):
            omega = 2 * mp.pi * mode / length
            coefficient_integral = mp.quad(
                lambda x: (
                    -1j
                    * mp.mpf(-1) ** mode
                    * mp.sqrt(2 / length)
                    * mp.sin(omega * x)
                    * mp.sinh(x / 2)
                ),
                [-half_length, half_length],
            )
            coefficient_formula = (
                2j
                * mp.sqrt(2)
                * omega
                * mp.sinh(length / 4)
                / (mp.sqrt(length) * (omega**2 + mp.mpf(1) / 4))
            )
            assert abs(coefficient_integral - coefficient_formula) < mp.mpf("1e-70")

        limiting_ratio = (
            2
            * length
            * mp.sinh(length / 4) ** 2
            / (mp.pi**2 * (mp.sinh(length / 2) - length / 2))
        )
        errors = []
        for cutoff in (64, 256, 1024):
            denominator = mp.fsum(
                (2 * mp.pi * mode / length) ** 2
                / ((2 * mp.pi * mode / length) ** 2 + mp.mpf(1) / 4) ** 2
                for mode in range(1, cutoff + 1)
            )
            numerator = mp.fsum(
                mode**2
                * (2 * mp.pi * mode / length) ** 2
                / ((2 * mp.pi * mode / length) ** 2 + mp.mpf(1) / 4) ** 2
                for mode in range(1, cutoff + 1)
            )
            errors.append(abs(numerator / denominator / cutoff - limiting_ratio))
        assert errors[0] > errors[1] > errors[2]
        assert errors[-1] < mp.mpf("0.00025")


def _check_one_dimensional_boundary_leverage_formula() -> None:
    with mp.workdps(70):
        length = mp.mpf("3")
        half_length = length / 2
        support = mp.mpf("0.7")

        def kernel(value: mp.mpf) -> mp.mpf:
            if value == 0:
                return support / mp.pi
            return mp.sin(support * value) / (mp.pi * value)

        def moment_zero() -> mp.mpf:
            return mp.quad(
                lambda t: mp.sin(half_length * t) ** 2 / (2 * mp.pi),
                [-support, support],
            )

        def moment(mode: int) -> mp.mpf:
            omega = 2 * mp.pi * mode / length
            return mp.quad(
                lambda t: (
                    mp.sin(half_length * t) ** 2
                    / (t**2 - omega**2)
                    / (2 * mp.pi)
                ),
                [-support, support],
            )

        j0 = moment_zero()
        c_v = length**2 * j0 / mp.pi**2
        for mode in (1, 2):
            omega = 2 * mp.pi * mode / length
            direct = mp.quad(
                lambda x: (
                    mp.conj(
                        mp.mpf(-1) ** mode
                        * 1j
                        * mp.sqrt(2 / length)
                        * mp.sin(omega * x)
                    )
                    * length
                    / (2 * mp.pi * 1j)
                    * (kernel(x + half_length) - kernel(x - half_length))
                ),
                [-half_length, half_length],
            )
            formula = 2 * mp.sqrt(2 * length) * omega * moment(mode) / mp.pi
            assert abs(direct - formula) < mp.mpf("1e-60")

        continuum = mp.quad(
            lambda u: (kernel(u) - kernel(length - u)) ** 2,
            [0, length],
        ) / (2 * (kernel(0) - kernel(length)))
        cutoff = 8
        finite = (
            8
            / (length * j0)
            * mp.fsum(
                (2 * mp.pi * mode / length) ** 2 * moment(mode) ** 2
                for mode in range(1, cutoff + 1)
            )
        )
        tail_bound = 32 * c_v / (9 * length * cutoff)
        assert continuum > finite
        assert continuum - finite < tail_bound


def _check_boundary_trace_flow_and_high_mode_lower_bound() -> None:
    with mp.workdps(70):
        length = mp.mpf("3")
        half_length = length / 2
        support = mp.mpf("0.7")

        def kernel(value: mp.mpf) -> mp.mpf:
            if value == 0:
                return support / mp.pi
            return mp.sin(support * value) / (mp.pi * value)

        j0 = mp.quad(
            lambda t: mp.sin(half_length * t) ** 2 / (2 * mp.pi),
            [-support, support],
        )
        c_v = length**2 * j0 / mp.pi**2
        trace_one_derivative = kernel(0) - kernel(length)
        trace_two_derivative = 2 * mp.quad(
            lambda y: (
                kernel(half_length - y) - kernel(half_length + y)
            )
            ** 2,
            [0, half_length],
        )
        continuum = mp.quad(
            lambda u: (kernel(u) - kernel(length - u)) ** 2,
            [0, length],
        ) / (2 * (kernel(0) - kernel(length)))
        assert abs(trace_one_derivative - 2 * j0) < mp.mpf("1e-65")
        assert abs(
            trace_two_derivative / (2 * trace_one_derivative) - continuum
        ) < mp.mpf("1e-65")

        cutoff = 8
        weighted_sum = mp.mpf(0)
        for mode in range(1, cutoff + 1):
            omega = 2 * mp.pi * mode / length
            assert omega > support
            jn = mp.quad(
                lambda t: (
                    mp.sin(half_length * t) ** 2
                    / (t**2 - omega**2)
                    / (2 * mp.pi)
                ),
                [-support, support],
            )
            assert jn < 0
            assert -jn >= j0 / omega**2
            weighted_sum += omega**2 * jn**2
        rho_finite = 8 * weighted_sum / (length * j0)
        explicit_lower = (
            2
            * c_v
            / length
            * mp.fsum(mp.mpf(1) / mode**2 for mode in range(1, cutoff + 1))
        )
        assert rho_finite >= explicit_lower


def _check_endpoint_persistence_envelope_constants() -> None:
    with mp.workdps(70):
        envelope_height = mp.mpf("2")
        endpoint = mp.sqrt(mp.exp(2 * envelope_height) - 1) / 2
        first_moment = 2 * mp.quad(
            lambda t: (
                t
                * (
                    envelope_height
                    - mp.log(1 + 4 * t**2) / 2
                )
                / (2 * mp.pi)
            ),
            [0, endpoint],
        )
        first_moment_formula = (
            mp.exp(2 * envelope_height) - 2 * envelope_height - 1
        ) / (16 * mp.pi)
        assert abs(first_moment - first_moment_formula) < mp.mpf("1e-65")

        length = mp.mpf("3")
        half_length = length / 2
        support = mp.mpf("0.7")

        def kernel(value: mp.mpf) -> mp.mpf:
            if value == 0:
                return support / mp.pi
            return mp.sin(support * value) / (mp.pi * value)

        j0 = mp.quad(
            lambda t: mp.sin(half_length * t) ** 2 / (2 * mp.pi),
            [-support, support],
        )
        actual_first_moment = support**2 / (2 * mp.pi)
        continuum = mp.quad(
            lambda u: (kernel(u) - kernel(length - u)) ** 2,
            [0, length],
        ) / (2 * (kernel(0) - kernel(length)))
        persistence_lower = min(
            length * j0 / 4,
            j0**2 / (4 * actual_first_moment),
        )
        assert continuum >= persistence_lower > 0


def _check_central_lobe_constant_and_narrow_band_obstruction() -> None:
    with mp.workdps(70):
        j_value = 2 / mp.pi - mp.mpf(1) / 2

        def scaled_kernel(value: mp.mpf) -> mp.mpf:
            if value == 1:
                return mp.mpf(1)
            return 4 * mp.cos(mp.pi * value / 2) / (
                mp.pi * (1 - value**2)
            )

        central_constant = mp.quad(
            lambda y: (scaled_kernel(y) - scaled_kernel(1 - y)) ** 2,
            [0, 1],
        ) / (4 * j_value)
        assert abs(
            central_constant - mp.mpf("0.0471233973017")
        ) < mp.mpf("1e-13")

        length = mp.mpf("3")
        half_length = length / 2
        mass = mp.mpf("0.2")
        frequency = mp.pi / length

        def atomic_kernel(value: mp.mpf) -> mp.mpf:
            return 2 * mass * mp.cos(frequency * value)

        boundary_norm_squared = mp.quad(
            lambda x: abs(
                length
                / (2 * mp.pi * 1j)
                * (
                    atomic_kernel(x + half_length)
                    - atomic_kernel(x - half_length)
                )
            )
            ** 2,
            [-half_length, half_length],
        )
        feature_energy = 2 * mass * length**2 / mp.pi**2
        expected_boundary_norm = 2 * mass**2 * length**3 / mp.pi**2
        assert abs(boundary_norm_squared - expected_boundary_norm) < mp.mpf("1e-65")
        assert abs(
            boundary_norm_squared / feature_energy - mass * length
        ) < mp.mpf("1e-65")

        def sinc(value: mp.mpf) -> mp.mpf:
            return mp.mpf(1) if value == 0 else mp.sin(value) / value

        atomic_feature = feature_energy
        atomic_boundary = expected_boundary_norm
        feature_errors: list[mp.mpf] = []
        boundary_errors: list[mp.mpf] = []
        quotient_errors: list[mp.mpf] = []
        for half_width in (mp.mpf("0.06"), mp.mpf("0.03"), mp.mpf("0.015")):
            height = mass * mp.pi / half_width

            feature_from_bands = (
                length**2
                / mp.pi**2
                * height
                / mp.pi
                * mp.quad(
                    lambda t: mp.sin(length * t / 2) ** 2,
                    [frequency - half_width, frequency + half_width],
                )
            )
            feature_from_sinc = (
                mass
                * length**2
                / mp.pi**2
                * (1 + sinc(length * half_width))
            )
            assert abs(feature_from_bands - feature_from_sinc) < mp.mpf("1e-65")

            def band_kernel(value: mp.mpf) -> mp.mpf:
                return (
                    2
                    * mass
                    * mp.cos(frequency * value)
                    * sinc(half_width * value)
                )

            boundary_from_kernel = length**2 / (4 * mp.pi**2) * mp.quad(
                lambda u: (
                    band_kernel(u) - band_kernel(length - u)
                )
                ** 2,
                [0, length],
            )
            boundary_from_sinc = mass**2 * length**2 / mp.pi**2 * mp.quad(
                lambda u: mp.cos(frequency * u) ** 2
                * (
                    sinc(half_width * u)
                    + sinc(half_width * (length - u))
                )
                ** 2,
                [0, length],
            )
            assert abs(boundary_from_kernel - boundary_from_sinc) < mp.mpf("1e-65")

            quotient = boundary_from_kernel / feature_from_bands
            feature_errors.append(abs(feature_from_bands / atomic_feature - 1))
            boundary_errors.append(abs(boundary_from_kernel / atomic_boundary - 1))
            quotient_errors.append(abs(quotient / (mass * length) - 1))

        # Rectangular bands approach, but do not equal, the atomic formulas.
        for errors in (feature_errors, boundary_errors, quotient_errors):
            assert errors[0] > 0
            assert errors[1] < errors[0] / 3
            assert errors[2] < errors[1] / 3


def _check_growing_multilobe_model_constant() -> None:
    # Odd M gives an especially simple exact union of M complete positive
    # cosine lobes.  It has the same endpoint layers and limiting coefficient
    # as the even-M source theorem in Section 16.
    with mp.workdps(60):
        d_value = 4 / mp.pi - 1
        j_value = d_value / 2

        def lobe_transform(value: mp.mpf) -> mp.mpf:
            if abs(value - 1) < mp.mpf("1e-50"):
                return mp.pi / 2
            return 2 * mp.cos(mp.pi * value / 2) / (1 - value**2)

        def dirichlet_kernel(order: int, value: mp.mpf) -> mp.mpf:
            denominator = mp.sin(mp.pi * value)
            if abs(denominator) < mp.mpf("1e-50"):
                return mp.mpf(order)
            return mp.sin(mp.pi * order * value) / denominator

        def model_kernel(order: int, value: mp.mpf) -> mp.mpf:
            return (
                2
                / mp.pi
                * lobe_transform(value)
                * dirichlet_kernel(order, value)
            )

        ratios: list[mp.mpf] = []
        quotient_coefficients: list[mp.mpf] = []
        for order in (9, 17, 33):
            endpoint_difference = model_kernel(order, 0) - model_kernel(order, 1)
            assert abs(endpoint_difference - order * d_value) < mp.mpf("1e-50")

            mesh = [mp.mpf(index) / (2 * order) for index in range(2 * order + 1)]
            model_energy = mp.quad(
                lambda y: (
                    model_kernel(order, y) - model_kernel(order, 1 - y)
                )
                ** 2,
                mesh,
            )
            ratios.append(model_energy / (order * d_value**2))

            scaled_quotient = model_energy / (2 * endpoint_difference)
            assert scaled_quotient > 0
            quotient_coefficients.append(scaled_quotient)
            assert abs(scaled_quotient - j_value * ratios[-1]) < mp.mpf("1e-50")

        assert ratios[0] < ratios[1] < ratios[2] < 1
        assert ratios[-1] > mp.mpf("0.94")
        assert quotient_coefficients[0] < quotient_coefficients[1] < quotient_coefficients[2]
        assert abs(quotient_coefficients[-1] - j_value) < mp.mpf("0.01")
        assert j_value > mp.mpf("0.13")

        # The periodic core and every farther contribution have opposite
        # signs in each protected low J_n coefficient.
        order = 5
        mode = 1

        def low_mode_integrand(value: mp.mpf) -> mp.mpf:
            denominator = value**2 - (2 * mp.pi * mode) ** 2
            if abs(denominator) < mp.mpf("1e-50"):
                return mp.mpf(0)
            return (
                4
                * max(mp.cos(value), mp.mpf(0))
                * mp.sin(value / 2) ** 2
                / denominator
            )

        centers = [
            2 * mp.pi * index
            for index in range(-(order - 1) // 2, (order - 1) // 2 + 1)
        ]
        core_low_mode = mp.fsum(
            mp.quad(
                low_mode_integrand,
                [center - mp.pi / 2, center, center + mp.pi / 2],
            )
            for center in centers
        )
        outer_center = 2 * mp.pi * ((order + 1) // 2)
        outer_low_mode = mp.quad(
            low_mode_integrand,
            [outer_center - mp.pi / 2, outer_center, outer_center + mp.pi / 2],
        )
        assert core_low_mode < 0 < outer_low_mode


def _check_even_multilobe_exact_integral_and_fourier_constants() -> None:
    # Section 16 uses even M.  Integrate the clipped positive cosine lobes
    # directly, including the two half-lobes at the truncation endpoints.
    with mp.workdps(70):
        half_lobe = mp.pi / 2
        a_zero = mp.quad(
            lambda x: 4 * mp.cos(x),
            [-half_lobe, 0, half_lobe],
        ) / (2 * mp.pi)
        a_one = mp.quad(
            lambda x: 4 * mp.cos(x) * mp.exp(-1j * x),
            [-half_lobe, 0, half_lobe],
        ) / (2 * mp.pi)
        assert abs(a_zero - 4 / mp.pi) < mp.mpf("1e-65")
        assert abs(a_one - 1) < mp.mpf("1e-65")

        d_value = 4 / mp.pi - 1
        for order in (2, 4, 8):
            boundary = mp.pi * order
            positive_segments: list[tuple[mp.mpf, mp.mpf]] = []
            for lobe_index in range(-order // 2, order // 2 + 1):
                center = 2 * mp.pi * lobe_index
                left = max(-boundary, center - half_lobe)
                right = min(boundary, center + half_lobe)
                if left < right:
                    positive_segments.append((left, right))

            k_zero = mp.fsum(
                mp.quad(lambda x: 4 * mp.cos(x), [left, right])
                for left, right in positive_segments
            ) / (2 * mp.pi)
            k_one = mp.fsum(
                mp.quad(
                    lambda x: 4 * mp.cos(x) * mp.exp(1j * x),
                    [left, right],
                )
                for left, right in positive_segments
            ) / (2 * mp.pi)

            assert abs(k_zero - order * a_zero) < mp.mpf("1e-64")
            assert abs(k_one - order * a_one) < mp.mpf("1e-64")
            assert abs(k_zero - k_one - order * d_value) < mp.mpf("1e-64")


def _check_adjacent_even_multilobe_covariance_regression() -> None:
    # For even M, split [-pi M, pi M] into M copies of [0, 2 pi].  This
    # gives a stable closed transform and lets us replay the signed
    # covariance with the adjacent M-to-2M annulus without nested quadrature.
    with mp.workdps(40):
        half_lobe = mp.pi / 2

        def sinc(value: mp.mpf) -> mp.mpf:
            if abs(value) < mp.mpf("1e-15"):
                return 1 - value**2 / 6 + value**4 / 120
            return mp.sin(value) / value

        def cosc(value: mp.mpf) -> mp.mpf:
            if abs(value) < mp.mpf("1e-15"):
                return value / 2 - value**3 / 24 + value**5 / 720
            return (1 - mp.cos(value)) / value

        def even_cell_factor(value: mp.mpf) -> mp.mpf:
            cosine_integral = half_lobe / 2 * (
                sinc((1 - value) * half_lobe)
                + sinc((1 + value) * half_lobe)
            )
            sine_integral = half_lobe / 2 * (
                cosc((value + 1) * half_lobe)
                + cosc((value - 1) * half_lobe)
            )
            return 4 / mp.pi * (
                mp.cos(mp.pi * value) * cosine_integral
                + mp.sin(mp.pi * value) * sine_integral
            )

        def even_dirichlet(order: int, value: mp.mpf) -> mp.mpf:
            if abs(value) < mp.mpf("1e-30"):
                return mp.mpf(order)
            if abs(value - 1) < mp.mpf("1e-30"):
                return -mp.mpf(order)
            return mp.sin(mp.pi * order * value) / mp.sin(mp.pi * value)

        def model_kernel(order: int, value: mp.mpf) -> mp.mpf:
            return even_cell_factor(value) * even_dirichlet(order, value)

        def boundary_profile(order: int, value: mp.mpf) -> mp.mpf:
            return model_kernel(order, value) - model_kernel(order, 1 - value)

        d_value = 4 / mp.pi - 1
        relative_covariances: list[mp.mpf] = []
        linear_covariances: list[mp.mpf] = []
        normalized_energies: list[mp.mpf] = []
        for order in (4, 8, 16):
            assert abs(
                model_kernel(order, 0)
                - model_kernel(order, 1)
                - order * d_value
            ) < mp.mpf("1e-35")

            mesh = [
                mp.mpf(index) / (2 * order)
                for index in range(2 * order + 1)
            ]
            inner_energy = mp.quadgl(
                lambda y: boundary_profile(order, y) ** 2,
                mesh,
            )
            adjacent_covariance = mp.quadgl(
                lambda y: boundary_profile(order, y)
                * (
                    boundary_profile(2 * order, y)
                    - boundary_profile(order, y)
                ),
                mesh,
            )
            assert inner_energy > 0
            normalized_energies.append(inner_energy / (order * d_value**2))
            relative_covariances.append(abs(adjacent_covariance) / inner_energy)
            linear_covariances.append(abs(adjacent_covariance) / order)

        # I_M/(M d^2) tends to one, whereas the adjacent-annulus covariance
        # is lower order than both I_M and M.  The separated finite values
        # below are regression witnesses, not an extrapolation claim.
        assert normalized_energies[0] > normalized_energies[1] > normalized_energies[2] > 1
        assert relative_covariances[0] > relative_covariances[1] > relative_covariances[2]
        assert linear_covariances[0] > linear_covariances[1] > linear_covariances[2]
        assert relative_covariances[2] < 3 * relative_covariances[0] / 5
        assert linear_covariances[2] < 2 * linear_covariances[0] / 5


def _check_single_atom_edge_constant_and_far_cross_kernel() -> None:
    with mp.workdps(70):
        delta = mp.mpf(2)
        local_limit = delta ** (mp.mpf(5) / 2) / (15 * mp.pi)
        scaled_values: list[mp.mpf] = []

        for sigma in (mp.mpf(20), mp.mpf(80), mp.mpf(320)):
            active_angle = mp.acos(1 - delta / (2 * sigma))
            local_difference = mp.quad(
                lambda theta: (
                    delta - 2 * sigma * (1 - mp.cos(theta))
                )
                * (1 - mp.cos(theta)),
                [-active_angle, active_angle],
            ) / (2 * mp.pi)
            scaled_values.append(sigma ** (mp.mpf(3) / 2) * local_difference)

        errors = [abs(value - local_limit) for value in scaled_values]
        assert errors[1] < errors[0] / 3
        assert errors[2] < errors[1] / 3

        gamma_coefficient = (
            mp.mpf(1)
            / 2
            * mp.gamma(6)
            / (15 * mp.pi * mp.gamma(mp.mpf(7) / 2))
        )
        assert abs(
            gamma_coefficient - 32 / (15 * mp.pi ** (mp.mpf(3) / 2))
        ) < mp.mpf("1e-65")

        half_length = mp.mpf("1.7")
        low_radius = mp.mpf("0.4")
        far_radius = mp.mpf("0.9")
        assert far_radius >= 2 * low_radius
        for low_frequency in (mp.mpf(0), mp.mpf("0.2"), low_radius):
            for high_frequency in (far_radius, mp.mpf("1.4"), mp.mpf(3)):
                cross_kernel = (
                    mp.sin(half_length * (low_frequency - high_frequency))
                    / (low_frequency - high_frequency)
                    - mp.sin(half_length * (low_frequency + high_frequency))
                    / (low_frequency + high_frequency)
                )
                assert abs(cross_kernel) <= 3 / high_frequency


def _check_single_atom_finite_carrier_modulation_quotient_regression() -> None:
    # This is a deterministic high-precision regression for the local edge
    # packet, not a certified estimate for the arithmetic source.  The smooth
    # cutoff avoids inserting a jump at the finite delta endpoint.
    with mp.workdps(55):
        delta_edges = tuple(
            mp.mpf(value)
            for value in (
                "0",
                "0.25",
                "0.5",
                "0.75",
                "1",
                "1.5",
                "2",
                "3",
                "4",
                "5",
                "7",
                "10",
                "14",
                "15",
                "17",
                "20",
            )
        )
        delta_rule = mp.gauss_quadrature(16, "legendre")
        carrier_rule = mp.gauss_quadrature(12, "legendre")

        def mapped_rule(rule, left: mp.mpf, right: mp.mpf):
            nodes, weights = rule
            midpoint = (left + right) / 2
            radius = (right - left) / 2
            return tuple(
                (midpoint + radius * nodes[index], radius * weights[index])
                for index in range(len(nodes))
            )

        def quotient(sigma: mp.mpf, carrier: int) -> tuple[mp.mpf, mp.mpf]:
            envelope_quadrature: list[tuple[mp.mpf, mp.mpf, mp.mpf]] = []
            for left, right in zip(delta_edges, delta_edges[1:]):
                for delta, weight in mapped_rule(delta_rule, left, right):
                    active_angle = mp.acos(1 - delta / (2 * sigma))
                    d_sigma = (
                        (delta - 2 * sigma)
                        * (active_angle - mp.sin(active_angle))
                        + 2
                        * sigma
                        * (
                            mp.sin(active_angle)
                            - active_angle / 2
                            - mp.sin(2 * active_angle) / 4
                        )
                    ) / mp.pi
                    if delta <= 15:
                        cutoff = mp.mpf(1)
                    else:
                        taper = (20 - delta) / 5
                        cutoff = taper**2 * (3 - 2 * taper)
                    edge_coordinate = mp.exp(-delta)
                    jacobian_weight = weight * edge_coordinate
                    envelope_quadrature.append(
                        (
                            edge_coordinate,
                            jacobian_weight * cutoff * d_sigma,
                            jacobian_weight * cutoff**2 * d_sigma**2,
                        )
                    )

            packet_mass = mp.fsum(
                linear_weight
                for _, linear_weight, _ in envelope_quadrature
            )
            packet_energy = mp.fsum(
                square_weight
                for _, _, square_weight in envelope_quadrature
            )

            def packet_transform(frequency: mp.mpf) -> mp.mpf:
                return mp.fsum(
                    linear_weight * mp.cos(frequency * edge_coordinate)
                    for edge_coordinate, linear_weight, _ in envelope_quadrature
                )

            # The n=0 and n=1 sidebands give D(y)-D(C-y).  Retaining the
            # finite carrier C exercises their cancellation before squaring.
            difference_energy = mp.mpf(0)
            for left_integer in range(0, carrier, 4):
                left = mp.mpf(left_integer)
                right = mp.mpf(min(left_integer + 4, carrier))
                for frequency, weight in mapped_rule(
                    carrier_rule, left, right
                ):
                    difference = packet_transform(
                        frequency
                    ) - packet_transform(carrier - frequency)
                    difference_energy += weight * difference**2

            # These are the numerator and denominator normalizations in
            # (13.9), after the common outer-edge scale has been cancelled.
            boundary_energy = difference_energy / mp.pi**2
            endpoint_difference = packet_mass / mp.pi
            finite_carrier_quotient = boundary_energy / (
                2 * endpoint_difference
            )
            parseval_limit = packet_energy / (2 * packet_mass)
            return finite_carrier_quotient, parseval_limit

        coefficient = 32 / (15 * mp.pi ** (mp.mpf(3) / 2))
        carrier_capture: list[mp.mpf] = []
        finite_scaled: list[mp.mpf] = []
        limit_scaled: list[mp.mpf] = []
        for sigma_integer, carrier in ((20, 64), (80, 128), (320, 256)):
            sigma = mp.mpf(sigma_integer)
            finite_value, limiting_value = quotient(sigma, carrier)
            target = coefficient * sigma ** (-mp.mpf(3) / 2)
            assert 0 < finite_value < limiting_value
            carrier_capture.append(finite_value / limiting_value)
            finite_scaled.append(finite_value / target)
            limit_scaled.append(limiting_value / target)

        # The finite packet captures progressively more of its Parseval
        # energy as the carrier separation doubles.  Wide intervals make
        # this a robust numerical regression rather than a precision claim.
        assert mp.mpf("0.25") < carrier_capture[0] < mp.mpf("0.29")
        assert mp.mpf("0.39") < carrier_capture[1] < mp.mpf("0.43")
        assert mp.mpf("0.52") < carrier_capture[2] < mp.mpf("0.57")
        assert all(
            finite_scaled[index] < finite_scaled[index + 1] < 1
            for index in range(2)
        )

        # The independently normalized packet limit approaches the Section
        # 18 coefficient as Sigma grows; no gamma-integral value is inserted
        # into the transform or the finite-carrier numerator.
        limit_errors = [abs(value - 1) for value in limit_scaled]
        assert limit_errors[1] < limit_errors[0] / 3
        assert limit_errors[2] < limit_errors[1] / 5
        assert limit_errors[2] < mp.mpf("0.001")


def _check_mesoscopic_phase_average_closed_form() -> None:
    # Replay the positive-part phase average before using its closed form.
    # The change theta = centered_angle + alpha merely puts the moving active
    # half-circle on a fixed quadrature interval.
    with mp.workdps(60):
        nodes, weights = mp.gauss_quadrature(32, "legendre")

        def gauss_integral(function, left: mp.mpf, right: mp.mpf) -> mp.mpf:
            midpoint = (left + right) / 2
            radius = (right - left) / 2
            return radius * mp.fsum(
                weights[index] * function(midpoint + radius * nodes[index])
                for index in range(len(nodes))
            )

        def phase_average(t_value: mp.mpf) -> mp.mpf:
            amplitude = 4 / mp.sqrt(1 + 4 * t_value**2)
            alpha = mp.atan(2 * t_value)
            return gauss_integral(
                lambda centered_angle: amplitude
                * max(mp.cos(centered_angle), mp.mpf(0))
                * (1 - mp.cos(centered_angle + alpha)),
                -mp.pi / 2,
                mp.pi / 2,
            ) / (2 * mp.pi)

        for t_value in map(mp.mpf, ("0", "0.17", "0.8", "2.4")):
            expected_density = (
                4 / (mp.pi * mp.sqrt(1 + 4 * t_value**2))
                - 1 / (1 + 4 * t_value**2)
            )
            assert abs(phase_average(t_value) - expected_density) < mp.mpf(
                "1e-28"
            )

        for endpoint_text in ("0.2", "1", "3", "8"):
            endpoint = mp.mpf(endpoint_text)
            panel_count = int(mp.ceil(endpoint))
            panel_edges = tuple(
                endpoint * panel / panel_count
                for panel in range(panel_count + 1)
            )
            quadrature = mp.fsum(
                gauss_integral(
                    phase_average,
                    panel_edges[index],
                    panel_edges[index + 1],
                )
                for index in range(panel_count)
            )
            closed_form = (
                2 / mp.pi * mp.asinh(2 * endpoint)
                - mp.atan(2 * endpoint) / 2
            )
            assert abs(quadrature - closed_form) < mp.mpf("1e-27")


def _mesoscopic_h(value: mp.mpf) -> mp.mpf:
    return 2 / mp.pi**2 * mp.besselk(0, abs(value) / 2) - (
        mp.exp(-value / 2) / 2 if value > 0 else mp.mpf(0)
    )


@lru_cache(maxsize=1)
def _positive_mesoscopic_h_quadrature_samples() -> tuple[
    tuple[mp.mpf, mp.mpf, mp.mpf], ...
]:
    # Fixed arbitrary-precision quadrature for (0, infinity).  On (0, 1),
    # s=exp(-u) resolves the logarithmic K_0 singularity.  The two omitted
    # tails start at exp(-160) and 160, below the regression tolerances.
    nodes, weights = mp.gauss_quadrature(32, "legendre")

    def mapped_rule(left: mp.mpf, right: mp.mpf):
        midpoint = (left + right) / 2
        radius = (right - left) / 2
        return tuple(
            (midpoint + radius * nodes[index], radius * weights[index])
            for index in range(len(nodes))
        )

    samples: list[tuple[mp.mpf, mp.mpf, mp.mpf]] = []
    near_edges = tuple(map(mp.mpf, (0, 1, 2, 4, 8, 16, 32, 64, 160)))
    for left, right in zip(near_edges, near_edges[1:]):
        for log_coordinate, log_weight in mapped_rule(left, right):
            value = mp.exp(-log_coordinate)
            measure_weight = log_weight * value
            samples.append((value, measure_weight, _mesoscopic_h(value)))

    far_edges = tuple(map(mp.mpf, (1, 2, 4, 8, 16, 32, 64, 160)))
    for left, right in zip(far_edges, far_edges[1:]):
        for value, measure_weight in mapped_rule(left, right):
            samples.append((value, measure_weight, _mesoscopic_h(value)))
    return tuple(samples)


def _check_mesoscopic_bessel_profile_mass_and_energy() -> None:
    with mp.workdps(55):
        samples = _positive_mesoscopic_h_quadrature_samples()
        profile_mass = mp.fsum(
            measure_weight * profile_value
            for _, measure_weight, profile_value in samples
        )
        profile_energy = 2 * mp.fsum(
            measure_weight * profile_value**2
            for _, measure_weight, profile_value in samples
        )

        assert abs(profile_mass - (2 / mp.pi - 1)) < mp.mpf("1e-30")
        assert abs(
            profile_energy - (mp.mpf(1) / 2 - 4 / mp.pi**2)
        ) < mp.mpf("1e-36")

        # Exercise the one-sided exponential term independently of the
        # positive-axis integrals above.
        sample = mp.mpf("1.7")
        assert abs(
            _mesoscopic_h(-sample) - _mesoscopic_h(sample)
            - mp.exp(-sample / 2) / 2
        ) < mp.mpf("1e-50")


def _check_small_band_sinc_packet_covariance_limits() -> None:
    with mp.workdps(55):
        samples = _positive_mesoscopic_h_quadrature_samples()
        d_value = 4 / mp.pi - 1
        full_target = 2 * (2 / mp.pi - 1) / d_value
        annulus_target = -1 / d_value
        full_errors: list[mp.mpf] = []
        annulus_errors: list[mp.mpf] = []

        for bandwidth in map(mp.mpf, ("0.2", "0.1", "0.05", "0.025")):
            def sinc_packet(value: mp.mpf) -> mp.mpf:
                if value == 0:
                    return d_value * bandwidth / mp.pi
                return d_value * mp.sin(bandwidth * value) / (mp.pi * value)

            core_norm = d_value**2 * bandwidth / mp.pi
            full_covariance = 2 * mp.fsum(
                measure_weight * sinc_packet(value) * profile_value
                for value, measure_weight, profile_value in samples
            )
            annulus_covariance = full_covariance - core_norm
            full_ratio = full_covariance / core_norm
            annulus_ratio = annulus_covariance / core_norm

            assert full_ratio < 0
            assert annulus_ratio < full_ratio
            full_errors.append(abs(full_ratio - full_target))
            annulus_errors.append(abs(annulus_ratio - annulus_target))

        assert all(
            full_errors[index + 1] < 3 * full_errors[index] / 10
            for index in range(3)
        )
        assert all(
            annulus_errors[index + 1] < 3 * annulus_errors[index] / 10
            for index in range(3)
        )
        assert full_errors[-1] < mp.mpf("0.005")
        assert annulus_errors[-1] < mp.mpf("0.005")


def _check_zero_energy_outer_covariance_convention() -> None:
    with mp.workdps(70):
        length = mp.mpf(3)
        central_mass = mp.mpf("0.2")
        outer_mass = mp.mpf("0.7")

        def central_kernel(value: mp.mpf) -> mp.mpf:
            return 2 * central_mass * mp.cos(mp.pi * value / length)

        def null_outer_kernel(value: mp.mpf) -> mp.mpf:
            return 2 * outer_mass * mp.cos(2 * mp.pi * value / length)

        def energy(kernel) -> mp.mpf:
            return (
                length**2
                / (2 * mp.pi**2)
                * (kernel(0) - kernel(length))
            )

        def boundary_norm_squared(kernel) -> mp.mpf:
            return length**2 / (4 * mp.pi**2) * mp.quad(
                lambda u: (kernel(u) - kernel(length - u)) ** 2,
                [0, length],
            )

        central_energy = energy(central_kernel)
        outer_energy = energy(null_outer_kernel)
        central_norm = boundary_norm_squared(central_kernel)
        outer_norm = boundary_norm_squared(null_outer_kernel)
        combined_norm = boundary_norm_squared(
            lambda value: central_kernel(value) + null_outer_kernel(value)
        )
        cross = length**2 / (4 * mp.pi**2) * mp.quad(
            lambda u: 2
            * (central_kernel(u) - central_kernel(length - u))
            * (null_outer_kernel(u) - null_outer_kernel(length - u)),
            [0, length],
        )

        assert central_energy > 0
        assert abs(outer_energy) < mp.mpf("1e-65")
        assert outer_norm < mp.mpf("1e-65")
        assert abs(combined_norm - central_norm - outer_norm - cross) < mp.mpf("1e-65")
        assert abs(
            combined_norm / (central_energy + outer_energy)
            - central_norm / central_energy
        ) < mp.mpf("1e-65")


def _check_fixed_cutoff_haar_product_and_endpoint() -> None:
    # This is only the fixed finite prime-torus identity; it asserts no
    # finite-time or parameter-uniform equidistribution rate.
    with mp.workdps(80):
        log2 = mp.log(2)
        log3 = mp.log(3)
        a = log2 / mp.sqrt(2)
        b = log2 / 2  # The inclusive endpoint prime power 2^2=4.
        c = log3 / mp.sqrt(3)

        factor2_quadrature = mp.quad(
            lambda theta: mp.exp(
                2 * (a * mp.cos(theta) + b * mp.cos(2 * theta))
            ),
            [0, 2 * mp.pi],
        ) / (2 * mp.pi)
        factor3 = mp.besseli(0, 2 * c)
        product_quadrature = factor2_quadrature * factor3

        cutoff = 24
        factor2_bessel = mp.fsum(
            mp.besseli(2 * index, 2 * a) * mp.besseli(index, 2 * b)
            for index in range(-cutoff, cutoff + 1)
        )
        product_bessel = factor2_bessel * factor3
        assert abs(product_quadrature - product_bessel) < mp.mpf("1e-70")

        endpoint_omitted = mp.besseli(0, 2 * a) * factor3
        assert abs(product_bessel - endpoint_omitted) > mp.mpf("0.3")

        variance_quadrature = mp.quad(
            lambda theta: (a * mp.cos(theta) + b * mp.cos(2 * theta)) ** 2,
            [0, 2 * mp.pi],
        ) / (2 * mp.pi) + c**2 / 2
        variance_exact = (a**2 + b**2 + c**2) / 2
        assert abs(variance_quadrature - variance_exact) < mp.mpf("1e-70")


def _check_pseudoinverse_boundary_leverage_lower_bound() -> None:
    eigenvalues = (F(3), F(1), F(1, 4))
    boundary = (F(3), F(1), F(1, 4))
    threshold = F(3, 2)
    feature_energy = F(5)

    boundary_norm_squared = sum((value**2 for value in boundary), F(0))
    pseudoinverse_energy = sum(
        (value**2 / eigenvalue for value, eigenvalue in zip(boundary, eigenvalues)),
        F(0),
    )
    retained_norm_squared = boundary[0] ** 2
    strong_lower = boundary_norm_squared - threshold * pseudoinverse_energy
    coarse_lower = boundary_norm_squared - threshold * feature_energy

    assert pseudoinverse_energy == F(17, 4) <= feature_energy
    assert retained_norm_squared == F(9)
    assert retained_norm_squared >= strong_lower > coarse_lower > 0


def _check_pole_forcing_identity_and_tail_bound() -> None:
    with mp.workdps(80):
        length = mp.mpf("4.3")
        half_length = length / 2
        sinh_quarter = mp.sinh(length / 4)
        forcing_scale = mp.sqrt(2 * length) * sinh_quarter / mp.pi
        cutoff = 7

        zero_pole_coefficient = mp.quad(
            lambda x: mp.cosh(x / 2) / mp.sqrt(length),
            [-half_length, half_length],
        )
        assert abs(
            4 * sinh_quarter / mp.sqrt(length) - zero_pole_coefficient
        ) < mp.mpf("1e-75")

        pole_norm_partial = mp.mpf(0)
        for mode in range(1, cutoff + 1):
            omega = 2 * mp.pi * mode / length
            theta = omega**2 / (omega**2 + mp.mpf(1) / 4)
            beta = (
                2j
                * mp.sqrt(2)
                * omega
                * sinh_quarter
                / (mp.sqrt(length) * (omega**2 + mp.mpf(1) / 4))
            )
            pole_norm_partial += abs(beta) ** 2
            pole_plus_coefficient = mp.quad(
                lambda x: (
                    mp.mpf(-1) ** mode
                    * mp.sqrt(2 / length)
                    * mp.cos(omega * x)
                    * mp.cosh(x / 2)
                ),
                [-half_length, half_length],
            )
            endpoint_coefficient = mp.sqrt(2 / length)
            forcing_from_physical_identity = (
                1j
                * length
                / (4 * mp.pi)
                * (4 * sinh_quarter * endpoint_coefficient - pole_plus_coefficient)
            )
            assert abs(mode * beta - 1j * forcing_scale * theta) < mp.mpf("1e-75")
            assert abs(
                forcing_from_physical_identity - 1j * forcing_scale * theta
            ) < mp.mpf("1e-75")

        full_pole_norm = mp.sinh(length / 2) - length / 2
        tail = full_pole_norm - pole_norm_partial
        tail_bound = 2 * length * sinh_quarter**2 / (mp.pi**2 * cutoff)
        assert 0 <= tail <= tail_bound


def _check_exact_pole_multiplier_load_tradeoff() -> None:
    # Deliberately nonsymmetric: this catches every T versus T* orientation.
    derivative = ((F(1), F(2)), (F(0), F(3)))
    odd_retained = ((F(1), F(0)), (F(0), F(0)))
    odd_discarded = _subtract(_identity(2), odd_retained)
    even_discarded = _identity(2)
    pole = ((F(3),), (F(4),))
    retained_pole = _matmul(odd_retained, pole)
    discarded_pole = _matmul(odd_discarded, pole)
    residual_direction = ((F(0),), (F(1),))
    assert retained_pole == ((F(3),), (F(0),))
    assert discarded_pole == ((F(0),), (F(4),))
    assert discarded_pole == _scale(F(4), residual_direction)

    multiplier_cross = _matmul(
        odd_retained, _matmul(derivative, even_discarded)
    )
    sharp_odd_projector = _add(
        odd_retained,
        _matmul(residual_direction, _transpose(residual_direction)),
    )
    sharp_cross = _matmul(
        sharp_odd_projector, _matmul(derivative, even_discarded)
    )
    pole_forcing = _matmul(_transpose(derivative), pole)
    assert multiplier_cross == ((F(1), F(2)), (F(0), F(0)))
    assert sharp_odd_projector == _identity(2)
    assert sharp_cross == derivative
    assert pole_forcing == ((F(3),), (F(18),))
    assert _matmul(_transpose(sharp_cross), pole) == pole_forcing
    assert _matmul(sharp_cross, pole) == ((F(11),), (F(12),)) != pole_forcing

    pole_row = _matmul(
        _transpose(residual_direction),
        _matmul(derivative, even_discarded),
    )
    rho_squared = _norm_squared(_transpose(pole_row))
    assert pole_row == ((F(0), F(3)),)
    assert rho_squared == F(9)
    assert _norm_squared(discarded_pole) == F(16)
    assert _norm_squared(_matmul(
        _transpose(derivative), discarded_pole
    )) == F(144)
    cancellation_vector = _subtract(
        pole_forcing,
        _matmul(_transpose(multiplier_cross), retained_pole),
    )
    assert cancellation_vector == ((F(0),), (F(12),))
    assert _norm_squared(cancellation_vector) == (
        rho_squared * _norm_squared(discarded_pole)
    )

    # A gap-one Sylvester fixture realizes ||X|| = nu_2/ell_* = sqrt(5).
    even_concentration = _identity(2)
    odd_concentration = ((F(2), F(0)), (F(0), F(0)))
    commutator = _subtract(
        _matmul(derivative, even_concentration),
        _matmul(odd_concentration, derivative),
    )
    oriented_numerator = _matmul(
        odd_retained, _matmul(commutator, even_discarded)
    )
    assert commutator == ((F(-1), F(-2)), (F(0), F(3)))
    assert oriented_numerator == ((F(-1), F(-2)), (F(0), F(0)))
    nu_over_gap_squared = F(5)
    assert multiplier_cross == ((F(1), F(2)), (F(0), F(0)))

    pole_norm_squared = _norm_squared(pole)
    forcing_norm_squared = _norm_squared(pole_forcing)
    sharp_cross_gram = _matmul(_transpose(sharp_cross), sharp_cross)
    orthogonal_row_gram = _add(
        _matmul(_transpose(multiplier_cross), multiplier_cross),
        _matmul(_transpose(pole_row), pole_row),
    )
    assert pole_norm_squared == F(25)
    assert forcing_norm_squared == F(333)
    assert sharp_cross_gram == orthogonal_row_gram == (
        (F(1), F(2)),
        (F(2), F(13)),
    )
    assert rho_squared + nu_over_gap_squared == F(14)

    # The larger eigenvalue of the last Gram has polynomial x^2-14x+9.
    # Its Rayleigh lower bound on the pole vector is exactly 333/25.
    forcing_rayleigh = forcing_norm_squared / pole_norm_squared
    assert forcing_rayleigh == F(333, 25) > F(7)
    assert forcing_rayleigh**2 - 14 * forcing_rayleigh + 9 == F(-36, 625)
    assert rho_squared + nu_over_gap_squared > forcing_rayleigh


def _check_pole_deleted_green_gate_collapse() -> None:
    pole_deleted = ((F(3), F(1)), (F(1), F(2)))
    derivative = ((F(1), F(2)), (F(0), F(1)))
    pole = ((F(1),), (F(0),))
    pole_outer = _matmul(pole, _transpose(pole))
    odd_complete = _subtract(pole_deleted, _scale(F(2), pole_outer))
    forcing = _matmul(_transpose(derivative), pole)
    pulled_deleted = _matmul(
        _transpose(derivative), _matmul(pole_deleted, derivative)
    )
    pulled_complete = _matmul(
        _transpose(derivative), _matmul(odd_complete, derivative)
    )

    assert odd_complete == ((F(1), F(1)), (F(1), F(2)))
    assert forcing == ((F(1),), (F(2),))
    assert pulled_deleted == ((F(3), F(7)), (F(7), F(18)))
    assert pulled_complete == ((F(1), F(3)), (F(3), F(10)))
    assert pulled_complete == _subtract(
        pulled_deleted,
        _scale(F(2), _matmul(forcing, _transpose(forcing))),
    )

    deleted_inverse = _inverse(pole_deleted)
    pulled_inverse = _inverse(pulled_deleted)
    pole_green = _matmul(
        _transpose(pole), _matmul(deleted_inverse, pole)
    )[0][0]
    forcing_green = _matmul(
        _transpose(forcing), _matmul(pulled_inverse, forcing)
    )[0][0]
    delta = F(1) - 2 * pole_green
    assert pole_green == forcing_green == F(2, 5)
    assert delta == F(1, 5)

    load_columns = _identity(2)
    completed_core = _add(
        pulled_complete,
        _matmul(load_columns, _transpose(load_columns)),
    )
    reserve = _subtract(
        _identity(2),
        _matmul(
            _transpose(load_columns),
            _matmul(_inverse(completed_core), load_columns),
        ),
    )
    assert completed_core == ((F(2), F(3)), (F(3), F(11)))
    assert reserve == ((F(2, 13), F(3, 13)), (F(3, 13), F(11, 13)))
    assert _determinant(reserve) == F(1, 13)
    assert _determinant(reserve) == (
        _determinant(pulled_deleted) / _determinant(completed_core) * delta
    )

    odd_floor_difference = _subtract(
        odd_complete, _scale(delta, pole_deleted)
    )
    pulled_floor_difference = _subtract(
        pulled_complete, _scale(delta, pulled_deleted)
    )
    assert _determinant(odd_floor_difference) == 0
    assert _determinant(pulled_floor_difference) == 0
    assert odd_floor_difference[0][0] >= 0
    assert pulled_floor_difference[0][0] >= 0

    pole_moment = _matmul(
        _transpose(pole), _matmul(pole_deleted, pole)
    )[0][0]
    forcing_moment = _matmul(
        _transpose(forcing), _matmul(pulled_deleted, forcing)
    )[0][0]
    assert pole_moment == F(3) > 2 * _norm_squared(pole) ** 2
    assert forcing_moment == F(103) > 2 * _norm_squared(forcing) ** 2


def _check_transverse_green_critical_load_and_shift_monotonicity() -> None:
    # p=2e_0, so mu=4 and the transverse space is the second coordinate.
    pole = ((F(2),), (F(0),))
    pole_norm_squared = _norm_squared(pole)
    assert pole_norm_squared == F(4)

    for shift, expected_schur, expected_delta in (
        (F(0), F(14, 5), F(7, 27)),
        (F(1), F(7, 4), F(7, 39)),
    ):
        completed = (
            (F(11) - shift, F(1)),
            (F(1), F(5) - shift),
        )
        complete_odd = _subtract(
            completed,
            _scale(F(2), _matmul(pole, _transpose(pole))),
        )
        alpha = complete_odd[0][0]
        transverse = complete_odd[1][1]
        cross = complete_odd[1][0]
        schur_short = alpha - cross**2 / transverse
        delta = F(1) - 2 * _matmul(
            _transpose(pole), _matmul(_inverse(completed), pole)
        )[0][0]

        assert schur_short == expected_schur
        assert delta == expected_delta
        assert delta == schur_short / (2 * pole_norm_squared + schur_short)
        assert _determinant(complete_odd) == transverse * schur_short

    # Exact finite-shift form of s'_U=-1-||D_U^{-1}c||^2.
    s_zero = F(14, 5)
    s_one = F(7, 4)
    assert s_one - s_zero == -F(1) * (F(1) + F(1, 5 * 4))
    assert F(7, 39) < F(7, 27)


def _check_all_shift_harmonic_forcing_cancellation() -> None:
    size = F(3)
    retained = ((F(1), F(0)), (F(0), F(0)))
    far = _subtract(_identity(2), retained)
    concentration = ((F(3, 2), F(0)), (F(0), F(6, 5)))
    derivative = ((F(0), size), (F(1), F(0)))
    pole = ((F(2),), (F(0),))
    even_block = ((F(2), F(1, 9)), (F(1, 9), F(1)))
    odd_block = ((F(2), F(1, 3)), (F(1, 3), F(1)))
    even_positive = _subtract(
        even_block, _subtract(_scale(F(2), _identity(2)), concentration)
    )
    odd_positive = _add(
        _subtract(
            odd_block, _subtract(_scale(F(2), _identity(2)), concentration)
        ),
        _scale(F(2), _matmul(pole, _transpose(pole))),
    )
    assert even_positive == ((F(3, 2), F(1, 9)), (F(1, 9), F(1, 5)))
    assert odd_positive == ((F(19, 2), F(1, 3)), (F(1, 3), F(1, 5)))
    assert _determinant(even_positive) > 0
    assert _determinant(odd_positive) > 0

    displacement = _subtract(
        _matmul(derivative, even_block), _matmul(odd_block, derivative)
    )
    assert displacement == ((F(0), F(-3)), (F(1), F(-8, 9)))
    commutator = _subtract(
        _matmul(derivative, concentration),
        _matmul(concentration, derivative),
    )
    assert commutator == ((F(0), F(-9, 10)), (F(3, 10), F(0)))

    forcing = _matmul(_transpose(derivative), pole)
    assert forcing == ((F(0),), (F(6),))
    assert _norm_squared(forcing) / _norm_squared(pole) == F(9)
    assert (
        -derivative[0][1] * even_block[1][0]
        + odd_block[1][0] * derivative[1][0]
    ) == 0

    for sigma in (F(0), F(1, 2), F(2)):
        even_slope = even_block[1][0] / (even_block[1][1] + sigma)
        odd_slope = odd_block[1][0] / (odd_block[1][1] + sigma)
        first_cross = derivative[0][1]
        second_cross = derivative[1][0]
        assert even_slope == F(1, 9) / (1 + sigma)
        assert odd_slope == F(1, 3) / (1 + sigma)
        assert -first_cross * even_slope + odd_slope * second_cross == 0
        composed = first_cross * even_slope
        assert composed == F(1, 3) / (1 + sigma)
        assert composed == (
            even_slope * forcing[1][0] / F(2)
        )

        pole_deleted = _add(
            _shift(odd_block, sigma),
            _scale(F(2), _matmul(pole, _transpose(pole))),
        )
        green_delta = F(1) - 2 * _matmul(
            _transpose(pole), _matmul(_inverse(pole_deleted), pole)
        )[0][0]
        expected_green_delta = (
            (F(2) + sigma) * (F(1) + sigma) - F(1, 9)
        ) / (
            (F(10) + sigma) * (F(1) + sigma) - F(1, 9)
        )
        assert pole_deleted == (
            (F(10) + sigma, F(1, 3)),
            (F(1, 3), F(1) + sigma),
        )
        assert green_delta == expected_green_delta >= F(7, 39)


def _check_shrinking_window_fixed_reserve_zero_composition() -> None:
    for integer_k in (2, 3, 5):
        k = F(integer_k)
        derivative_scale = k**2
        retained_value = F(3) / (4 * k)
        discarded_value = F(1) / (16 * k)
        gap_difference = F(11) / (16 * k)
        concentration = (
            (retained_value, F(0)),
            (F(0), discarded_value),
        )
        derivative = (
            (F(0), derivative_scale),
            (F(1), F(0)),
        )
        pole = ((F(2),), (F(0),))
        even_block = (
            (F(2), k ** -4),
            (k ** -4, F(1)),
        )
        odd_block = (
            (F(2), k ** -2),
            (k ** -2, F(1)),
        )
        even_positive = _subtract(
            even_block, _subtract(_identity(2), concentration)
        )
        odd_positive = _add(
            _subtract(
                odd_block, _subtract(_identity(2), concentration)
            ),
            _scale(F(2), _matmul(pole, _transpose(pole))),
        )

        assert even_positive == (
            (F(1) + retained_value, k ** -4),
            (k ** -4, discarded_value),
        )
        assert odd_positive == (
            (F(9) + retained_value, k ** -2),
            (k ** -2, discarded_value),
        )
        assert _determinant(even_positive) > 0
        assert _determinant(odd_positive) > 0
        assert _determinant(even_block) == F(2) - k ** -8 > 0
        assert _determinant(odd_block) == F(2) - k ** -4 > 0

        commutator = _subtract(
            _matmul(derivative, concentration),
            _matmul(concentration, derivative),
        )
        assert commutator == (
            (F(0), -derivative_scale * gap_difference),
            (gap_difference, F(0)),
        )
        nu_two = derivative_scale * gap_difference
        gap = F(1) / (8 * k)
        assert nu_two == F(11) * k / 16
        assert nu_two / gap == F(11) * k**2 / 2

        feature_energy = k
        boundary_norm_squared = F(3, 4)
        rho = boundary_norm_squared / feature_energy
        cutoff = F(1) / (8 * k)
        scalar_excess = boundary_norm_squared - cutoff * feature_energy
        assert rho == F(3) / (4 * k)
        assert scalar_excess == F(5, 8) >= F(1, 2)

        for sigma in (F(0), F(1, 2), F(2)):
            even_slope = k ** -4 / (1 + sigma)
            odd_slope = k ** -2 / (1 + sigma)
            assert -derivative_scale * even_slope + odd_slope == 0

            pole_deleted = _add(
                _shift(odd_block, sigma),
                _scale(F(2), _matmul(pole, _transpose(pole))),
            )
            green_delta = F(1) - 2 * _matmul(
                _transpose(pole), _matmul(_inverse(pole_deleted), pole)
            )[0][0]
            expected_delta = (
                (F(2) + sigma) * (F(1) + sigma) - k ** -4
            ) / (
                (F(10) + sigma) * (F(1) + sigma) - k ** -4
            )
            assert green_delta == expected_delta >= F(31, 159)


def _check_separated_sine_kernel_identity_and_remainder_bound() -> None:
    # Replay (20.15) directly, then isolate its signed 1/s leading term.
    # Every decimal enters mpmath as text; no binary64 value is admitted.
    with mp.workdps(100):
        cases = (
            ("3.75", "0.37", "0.8", "2.6", "2.6"),
            ("7.125", "1.1", "1.9", "4.2", "5.75"),
            ("11.3", "0.125", "2.5", "7.75", "19.5"),
        )
        tolerance = mp.mpf("1e-85")

        for l_text, t_text, cap_text, radius_text, s_text in cases:
            length, t, cap, radius, s = map(
                mp.mpf,
                (l_text, t_text, cap_text, radius_text, s_text),
            )
            assert 0 < t < cap < radius <= s
            half_length = length / 2
            cross_kernel = (
                mp.sin(half_length * (t - s)) / (t - s)
                - mp.sin(half_length * (t + s)) / (t + s)
            )
            kernel_product = (
                mp.sin(half_length * t)
                * mp.sin(half_length * s)
                * cross_kernel
            )
            identity_right_side = (
                s * mp.sin(length * s) * mp.sin(half_length * t) ** 2
                - t * mp.sin(length * t) * mp.sin(half_length * s) ** 2
            ) / (t**2 - s**2)
            assert abs(kernel_product - identity_right_side) <= tolerance * (
                1 + abs(identity_right_side)
            )

            leading_term = (
                -mp.sin(length * s) * mp.sin(half_length * t) ** 2 / s
            )
            remainder = kernel_product - leading_term
            exact_remainder = (
                -t**2
                * mp.sin(length * s)
                * mp.sin(half_length * t) ** 2
                / (s * (s**2 - t**2))
                + t
                * mp.sin(length * t)
                * mp.sin(half_length * s) ** 2
                / (s**2 - t**2)
            )
            assert abs(remainder - exact_remainder) <= tolerance * (
                1 + abs(exact_remainder)
            )

            separation_reserve = 1 - cap**2 / radius**2
            remainder_majorant = (
                cap**2 / s**3 + t / s**2
            ) / separation_reserve
            assert separation_reserve > 0
            assert abs(remainder) <= remainder_majorant


def _check_fks_squared_radius_error_decay_regression() -> None:
    # This is a finite high-precision diagnostic for (20.2), not an
    # extrapolated asymptotic assertion.  It evaluates exactly the explicit
    # right side of (19.7), freshly with R=T^2 in place of T.
    with mp.workdps(100):
        coefficient = mp.mpf("9.22022")
        exponent = mp.mpf("0.8476836")
        c_psi = 1 + coefficient * (3 / exponent) ** 3 * mp.exp(-3)
        c_gamma = -mp.digamma(mp.mpf(1) / 4) + mp.log(mp.pi)
        powers = tuple(map(mp.mpf, ("40000", "90000", "160000", "250000")))
        scaled_errors: list[mp.mpf] = []

        for length in powers:
            lam = mp.exp(length / 2)
            t_scale = mp.exp(
                exponent * mp.sqrt(length) / (4 * mp.sqrt(2))
            )
            radius = t_scale**2
            radius_from_formula = mp.exp(
                exponent * mp.sqrt(length) / (2 * mp.sqrt(2))
            )
            assert abs(radius / radius_from_formula - 1) < mp.mpf("1e-90")
            assert length / 2 >= (3 / exponent) ** 2

            epsilon_one = (
                coefficient
                * length ** (mp.mpf(3) / 2)
                * mp.exp(-exponent * mp.sqrt(length))
            )
            epsilon_half = (
                coefficient
                * (length / 2) ** (mp.mpf(3) / 2)
                * mp.exp(-exponent * mp.sqrt(length / 2))
            )
            q_radius = mp.sqrt(radius**2 + mp.mpf(1) / 4)
            eta_radius = (
                (
                    c_gamma
                    + 12
                    + mp.mpf(1) / 2 * mp.log(1 + 4 * radius**2)
                )
                / lam
                + 2 * epsilon_one
                + 4
                * q_radius
                * ((c_psi + 1) / mp.sqrt(lam) + epsilon_half)
            )
            assert eta_radius > 0
            scaled_errors.append(radius * eta_radius**2)

        assert all(
            later < earlier * mp.mpf("1e-10")
            for earlier, later in zip(scaled_errors, scaled_errors[1:])
        )
        assert scaled_errors[0] < mp.mpf("2e-10")
        assert scaled_errors[-1] < mp.mpf("3e-47")


def _check_near_quadratic_dyadic_left_endpoint_and_proxy_scaling() -> None:
    # Replay the finite geometric sums behind (21.2).  Decimal endpoints are
    # parsed exactly as Fractions, so the dyadic cover and its minimal K do not
    # pass through binary64.
    endpoint_cases = (
        ("3.125", "97.75"),
        ("0.125", "64"),
        ("17.25", "1000.5"),
    )
    with mp.workdps(100):
        sqrt_two = mp.sqrt(2)
        geometric_constant = 1 / (sqrt_two - 1)
        tolerance = mp.mpf("1e-90")
        assert abs(geometric_constant - (sqrt_two + 1)) < tolerance

        for t_text, y_text in endpoint_cases:
            t_exact = F(t_text)
            y_exact = F(y_text)
            assert 0 < t_exact < y_exact

            k = 0
            while (2**k) * t_exact < y_exact:
                k += 1
            assert k > 0
            assert (2 ** (k - 1)) * t_exact < y_exact
            assert y_exact <= (2**k) * t_exact

            left_endpoints = tuple((2**j) * t_exact for j in range(k))
            exact_left_sum = sum(left_endpoints, F(0))
            assert exact_left_sum == t_exact * (2**k - 1)
            assert exact_left_sum <= 2 * y_exact

            t_mp = mp.mpf(t_text)
            y_mp = mp.mpf(y_text)
            sqrt_left_sum = mp.fsum(mp.sqrt(t_mp * 2**j) for j in range(k))
            geometric_sum = (
                mp.sqrt(t_mp)
                * (sqrt_two**k - 1)
                * geometric_constant
            )
            assert abs(sqrt_left_sum - geometric_sum) <= tolerance * (
                1 + abs(geometric_sum)
            )
            assert sqrt_left_sum <= mp.sqrt(2 * y_mp) * geometric_constant

        # Finite high-precision scaling diagnostic for the three terms in
        # (21.2), at Y=lambda^2/(L log L).  The unit-coefficient proxies
        # A_2=L^2 and C_ms=lambda^2 L encode only the pinned exponents in
        # (18.19); these numerical checks do not assert an asymptotic theorem.
        beta = mp.mpf("0.8476836") / (4 * sqrt_two)
        normalized_rows: list[tuple[mp.mpf, mp.mpf, mp.mpf, mp.mpf]] = []
        for length_text in ("400", "900", "1600", "2500"):
            length = mp.mpf(length_text)
            lam = mp.exp(length / 2)
            t_scale = mp.exp(beta * mp.sqrt(length))
            y_scale = lam**2 / (length * mp.log(length))
            assert t_scale < y_scale

            k = int(mp.ceil(mp.log(y_scale / t_scale) / mp.log(2)))
            assert 2 ** (k - 1) * t_scale < y_scale
            assert y_scale <= 2**k * t_scale

            a_two_proxy = length**2
            c_ms_proxy = lam**2 * length
            a_two_term = 4 * y_scale * mp.sqrt(a_two_proxy) / lam**2
            c_ms_term = (
                2
                * mp.sqrt(2 * mp.pi)
                * geometric_constant
                * mp.sqrt(y_scale * c_ms_proxy)
                / lam**2
            )
            dyadic_term = k * (lam + 1) / lam**2
            total_proxy = a_two_term + c_ms_term + dyadic_term

            assert abs(a_two_term - 4 / mp.log(length)) < tolerance
            assert abs(
                c_ms_term
                - 2
                * mp.sqrt(2 * mp.pi)
                * geometric_constant
                / mp.sqrt(mp.log(length))
            ) < tolerance
            normalized_rows.append(
                (a_two_term, c_ms_term, dyadic_term, total_proxy)
            )

        for column in range(4):
            values = tuple(row[column] for row in normalized_rows)
            assert all(later < earlier for earlier, later in zip(values, values[1:]))


def _check_high_moment_prime_group_and_positive_part_constants() -> None:
    with mp.workdps(100):
        tolerance = mp.mpf("1e-75")
        c_zero = 3 + 2 * mp.sqrt(2)

        # The finite geometric ratio in (22.3) must retain every prime
        # power in its group.  Its worst all-range value occurs at p=2.
        for prime_text in ("2", "3", "5", "11", "29"):
            q = 1 / mp.sqrt(mp.mpf(prime_text))
            for radius in (1, 2, 5, 11, 23):
                numerator = mp.fsum(q**r for r in range(1, radius + 1)) ** 2
                denominator = mp.fsum(q ** (2 * r) for r in range(1, radius + 1))
                direct_ratio = numerator / denominator
                closed_ratio = (
                    (1 + q)
                    / (1 - q)
                    * (1 - q**radius)
                    / (1 + q**radius)
                )
                assert abs(direct_ratio - closed_ratio) < tolerance
                assert direct_ratio <= c_zero

        # Replay the exact scalar maximizer and the central-binomial
        # relaxation used in (22.9)--(22.11).
        for k in range(1, 25):
            critical = mp.mpf(2 * k) / (2 * k - 1)
            kappa = (
                mp.mpf(4) ** k
                * mp.mpf(2 * k - 1) ** (2 * k - 1)
                / mp.mpf(2 * k) ** (2 * k)
            )
            critical_value = 4**k * (critical - 1) / critical ** (2 * k)
            assert abs(critical_value - kappa) < tolerance

            for numerator in range(1, 80):
                z = 1 + mp.mpf(numerator) / 17
                assert 4**k * (z - 1) / z ** (2 * k) <= kappa + tolerance

            central_binomial = F(1)
            for j in range(1, k + 1):
                central_binomial *= F(k + j, j)
            assert 4 * k * central_binomial**2 >= 16**k


def _check_high_moment_coefficient_and_mean_value_bounds() -> None:
    with mp.workdps(100):
        tolerance = mp.mpf("1e-88")
        c_zero = 3 + 2 * mp.sqrt(2)

        # Inclusive x=4 source polynomial: n=4 is the first nontrivial
        # prime power and is deliberately kept in the convolution.
        log_two = mp.log(2)
        base = {
            2: log_two / mp.sqrt(2),
            3: mp.log(3) / mp.sqrt(3),
            4: log_two / 2,
        }
        a_two = mp.fsum(abs(value) ** 2 for value in base.values())
        for k in range(1, 5):
            coefficients = {1: mp.mpf(1)}
            for _ in range(k):
                product: dict[int, mp.mpf] = {}
                for left_index, left_value in coefficients.items():
                    for right_index, right_value in base.items():
                        index = left_index * right_index
                        product[index] = product.get(index, mp.mpf(0)) + (
                            left_value * right_value
                        )
                coefficients = product

            a_k = mp.fsum(abs(value) ** 2 for value in coefficients.values())
            bound = (
                mp.mpf(2) ** (3 * k + 1)
                * mp.factorial(k)
                / mp.binomial(2 * k, k)
                * (c_zero * a_two) ** k
            )
            assert a_k <= bound

        without_prime_power = dict(base)
        del without_prime_power[4]
        assert mp.fsum(abs(value) ** 2 for value in without_prime_power.values()) < a_two

        # Independent endpoint replay of (22.7) for a generic logarithmic
        # polynomial.  All decimal inputs are parsed directly by mpmath.
        coefficients_complex = {
            2: mp.mpc(mp.mpf("1.25"), mp.mpf("-0.375")),
            3: mp.mpc(mp.mpf("-0.625"), mp.mpf("0.5")),
            7: mp.mpc(mp.mpf("0.1875"), mp.mpf("0.75")),
        }
        x_left = mp.mpf("2.375")
        energy = mp.fsum(abs(value) ** 2 for value in coefficients_complex.values())
        endpoint_integral = mp.mpc(0)
        for m, b_m in coefficients_complex.items():
            for n, b_n in coefficients_complex.items():
                if m == n:
                    oscillatory_integral = x_left
                else:
                    frequency = mp.log(mp.mpf(m) / n)
                    oscillatory_integral = (
                        mp.exp(2j * x_left * frequency)
                        - mp.exp(1j * x_left * frequency)
                    ) / (1j * frequency)
                endpoint_integral += b_m * mp.conj(b_n) * oscillatory_integral

        def endpoint_h_log(endpoint: mp.mpf) -> mp.mpc:
            shifted = {
                m: value * mp.exp(1j * endpoint * mp.log(m))
                for m, value in coefficients_complex.items()
            }
            result = mp.mpc(0)
            for m, b_m in shifted.items():
                for n, b_n in shifted.items():
                    if m != n:
                        result += b_m * mp.conj(b_n) / mp.log(mp.mpf(m) / n)
            return result

        h_log_left = endpoint_h_log(x_left)
        h_log_right = endpoint_h_log(2 * x_left)
        hilbert_replay = x_left * energy - 1j * (h_log_right - h_log_left)

        assert abs(endpoint_integral.imag) < tolerance
        assert abs(endpoint_integral - hilbert_replay) < tolerance
        assert abs(h_log_left) <= mp.pi * 7 * energy
        assert abs(h_log_right) <= mp.pi * 7 * energy
        assert endpoint_integral.real <= (x_left + 2 * mp.pi * 7) * energy


def _check_subquadratic_tail_bypass_constants_and_schedule() -> None:
    with mp.workdps(100):
        tolerance = mp.mpf("1e-90")

        # Directly replay the parity-kernel bounds in (23.4)--(23.5).
        length = mp.mpf("7.25")
        mode_count = 5
        omega_n = tuple(2 * mp.pi * n / length for n in range(1, mode_count + 1))
        y_cutoff = mp.mpf("2.25") * omega_n[-1]
        for multiplier in ("1", "1.5", "3", "11"):
            t = y_cutoff * mp.mpf(multiplier)
            sine = mp.sin(length * t / 2)
            even_kernel = 4 * sine**2 / (length * t**2)
            odd_kernel = mp.mpf(0)
            for omega in omega_n:
                denominator = t**2 - omega**2
                even_kernel += 8 * t**2 * sine**2 / (length * denominator**2)
                odd_kernel += 8 * omega**2 * sine**2 / (length * denominator**2)

            even_bound = (4 + F(128, 9) * mode_count) / (length * t**2)
            odd_bound = (
                F(128, 9)
                * mp.fsum(omega**2 for omega in omega_n)
                / (length * t**4)
            )
            assert even_kernel <= even_bound + tolerance
            assert odd_kernel <= odd_bound + tolerance

        # High-precision schedule replay.  W=L^3 is only the proved scale
        # proxy from (18.20), not a numerical assertion about the source.
        normalized_rows: list[tuple[mp.mpf, mp.mpf, mp.mpf]] = []
        for length_text in ("160", "240", "320", "400"):
            length = mp.mpf(length_text)
            lam = mp.exp(length / 2)
            mode_count = int(mp.ceil(lam * length**3))
            y_cutoff = lam**2 / (length * mp.log(length))
            omega_max = 2 * mp.pi * mode_count / length
            assert y_cutoff >= 2 * omega_max

            w_proxy = length**3
            s_two = F(mode_count * (mode_count + 1) * (2 * mode_count + 1), 6)
            eps_plus = (
                (4 + mp.mpf(128) * mode_count / 9)
                * w_proxy
                / (mp.pi * length * y_cutoff)
            )
            eps_minus = (
                512
                * mp.pi
                * s_two.numerator
                * w_proxy
                / (9 * length**3 * y_cutoff**3 * s_two.denominator)
            )
            b_out = (
                16
                * mp.sqrt(2)
                / (3 * mp.pi)
                * mp.sqrt(mp.mpf(s_two.numerator) / (s_two.denominator * length))
                * w_proxy
                / y_cutoff
            )
            normalized_rows.append(
                (eps_plus * mp.sqrt(lam), eps_minus, b_out / (lam * length))
            )

        for column in range(3):
            values = tuple(row[column] for row in normalized_rows)
            assert all(later < earlier for earlier, later in zip(values, values[1:]))
        assert normalized_rows[-1][0] < mp.mpf("1e-25")
        assert normalized_rows[-1][2] < mp.mpf("1e-60")


def _check_local_feature_floor_and_resolvent_transfer() -> None:
    # Exact rational instance of the direct-sum Cauchy step in (23.10).
    g_in = (F(1, 4), F(4), F(4))
    tau = F(1)
    projection = (F(0), F(1), F(1))
    b_in = (F(1, 2), F(3), F(4))
    z = (F(0), F(3), F(4))
    c_in = F(29, 4)

    assert g_in[0] <= tau
    assert b_in[0] ** 2 <= tau * c_in
    projected_norm_squared = sum(
        (projection[index] * b_in[index]) ** 2 for index in range(3)
    )
    z_norm_squared = sum(value**2 for value in z)
    overlap = sum(left * right for left, right in zip(z, b_in))
    local_right_side = overlap**2 / z_norm_squared - tau * c_in
    assert projected_norm_squared >= local_right_side > 0

    # Independent finite resolvent replay of (23.19).
    with mp.workdps(100):
        a_zero = (mp.mpf(3), mp.mpf(5))
        perturbation = (mp.mpf("0.25"), mp.mpf("0.125"))
        c_zero = (mp.mpf(2), mp.mpf(-1))
        e_vector = (mp.mpf("0.1"), mp.mpf("0.05"))
        epsilon = mp.mpf("0.25")
        gamma = mp.mpf(3)

        z_zero = tuple(c_zero[index] / a_zero[index] for index in range(2))
        full_solution = tuple(
            (c_zero[index] - e_vector[index])
            / (a_zero[index] - perturbation[index])
            for index in range(2)
        )
        difference_norm = mp.sqrt(
            mp.fsum(
                (full_solution[index] - z_zero[index]) ** 2
                for index in range(2)
            )
        )
        z_zero_norm = mp.sqrt(mp.fsum(value**2 for value in z_zero))
        bound = epsilon * (1 + z_zero_norm) / (gamma - epsilon)

        assert min(
            a_zero[index] - perturbation[index] for index in range(2)
        ) >= gamma - epsilon
        assert difference_norm <= bound


def _check_first_odd_weighted_discrepancy_gate() -> None:
    with mp.workdps(100):
        tolerance = mp.mpf("1e-88")
        amplitude = mp.mpf("0.375")

        for length_text in ("5.5", "13", "47"):
            length = mp.mpf(length_text)

            def q_one(height: mp.mpf) -> mp.mpf:
                phase = 2 * mp.pi * height / length
                return (
                    2 * (1 - height / length) * mp.cos(phase)
                    + mp.sin(phase) / mp.pi
                )

            def q_one_prime(height: mp.mpf) -> mp.mpf:
                phase = 2 * mp.pi * height / length
                return -4 * mp.pi / length * (1 - height / length) * mp.sin(phase)

            assert abs(q_one(length)) < tolerance
            for fraction_text in ("0.125", "0.375", "0.625", "0.875"):
                height = length * mp.mpf(fraction_text)
                numerical_derivative = mp.diff(q_one, height)
                assert abs(numerical_derivative - q_one_prime(height)) < tolerance

            # D_A=-A sin(2*pi*h/L) has the exact gate value -pi*A.
            gate = (
                4
                * mp.pi
                / length
                * mp.quad(
                    lambda height: -amplitude
                    * mp.sin(2 * mp.pi * height / length)
                    * (1 - height / length)
                    * mp.sin(2 * mp.pi * height / length),
                    [0, length],
                )
            )
            assert abs(gate + mp.pi * amplitude) < tolerance

        # Replay the exact second moment of the archimedean tail Levy
        # density and the sign of the normal-form scalar.
        sigma_integral = 2 * mp.quad(
            lambda height: height**2
            * mp.exp(-mp.mpf("2.5") * height)
            / (1 - mp.exp(-2 * height)),
            [0, 1, mp.inf],
        )
        sigma_closed = mp.zeta(3, mp.mpf("1.25")) / 2
        assert abs(sigma_integral - sigma_closed) < tolerance

        c_normal_form = mp.digamma(mp.mpf("0.25")) - mp.log(mp.pi) + 4
        assert c_normal_form < mp.mpf("-1.37")

        # These Taylor and Levy-moment identities fix the first four
        # coefficients of the first-mode archimedean-tail asymptotic.
        def two_minus_overlap(unit_height: mp.mpf) -> mp.mpf:
            return 2 - (
                2 * (1 - unit_height) * mp.cos(2 * mp.pi * unit_height)
                + mp.sin(2 * mp.pi * unit_height) / mp.pi
            )

        taylor_coefficients = tuple(
            mp.diff(two_minus_overlap, mp.mpf(0), order) / factorial(order)
            for order in range(2, 6)
        )
        expected_coefficients = (
            4 * mp.pi**2,
            -8 * mp.pi**2 / 3,
            -4 * mp.pi**4 / 3,
            16 * mp.pi**4 / 15,
        )
        for actual, expected in zip(taylor_coefficients, expected_coefficients):
            assert abs(actual - expected) < tolerance

        expected_tail_coefficients = (
            mp.pi**2 * mp.zeta(3, mp.mpf("1.25")),
            -mp.pi**2 * mp.zeta(4, mp.mpf("1.25")),
            -mp.pi**4 * mp.zeta(5, mp.mpf("1.25")),
            2 * mp.pi**4 * mp.zeta(6, mp.mpf("1.25")),
        )
        for order, overlap_coefficient, expected in zip(
            range(2, 6), taylor_coefficients, expected_tail_coefficients
        ):
            levy_moment = (
                factorial(order)
                * mp.zeta(order + 1, mp.mpf("1.25"))
                / 2 ** (order + 1)
            )
            assert abs(overlap_coefficient * levy_moment - expected) < tolerance


def _check_first_odd_carrier_kernel_and_center() -> None:
    with mp.workdps(100):
        tolerance = mp.mpf("1e-85")
        x = mp.mpf(4)
        length = mp.log(x)
        omega = 2 * mp.pi / length
        carrier = mp.mpf("0.5") - 1j * omega
        atoms = (
            (mp.mpf(2), mp.log(2)),
            (mp.mpf(3), mp.log(3)),
            (mp.mpf(4), mp.log(2)),
        )

        def q_one(height: mp.mpf) -> mp.mpf:
            return (
                2 * (1 - height / length) * mp.cos(omega * height)
                + mp.sin(omega * height) / mp.pi
            )

        direct = mp.fsum(
            weight * number ** (-mp.mpf("0.5")) * q_one(mp.log(number))
            for number, weight in atoms
        ) - mp.quad(
            lambda number: number ** (-mp.mpf("0.5")) * q_one(mp.log(number)),
            [1, x],
        )

        f_zero = mp.fsum(
            weight * number ** (-carrier) for number, weight in atoms
        ) - mp.quad(lambda number: number ** (-carrier), [1, x])
        f_one = mp.fsum(
            weight
            * number ** (-carrier)
            * mp.log(x / number)
            for number, weight in atoms
        ) - mp.quad(
            lambda number: number ** (-carrier) * mp.log(x / number),
            [1, x],
        )
        f_zero_prime = -mp.fsum(
            weight * mp.log(number) * number ** (-carrier)
            for number, weight in atoms
        ) + mp.quad(
            lambda number: mp.log(number) * number ** (-carrier),
            [1, x],
        )
        reconstructed = mp.re(2 * f_one / length - 1j * f_zero / mp.pi)

        assert abs(direct - reconstructed) < tolerance
        assert abs(f_one - (length * f_zero + f_zero_prime)) < tolerance

        # The inclusive endpoint atom contributes zero only to the combined
        # real carrier, not to F_0 as a complex quantity.
        endpoint_f_zero = atoms[-1][1] * x ** (-carrier)
        endpoint_combined = mp.re(-1j * endpoint_f_zero / mp.pi)
        assert abs(q_one(length)) < tolerance
        assert abs(endpoint_combined) < tolerance
        assert abs(endpoint_f_zero) > mp.mpf("0.1")

        for z in (
            mp.mpc("0.7", "0.4"),
            mp.mpc("-0.25", "1.1"),
        ):
            transform = mp.quad(
                lambda height: q_one(height) * mp.exp(z * height),
                [0, length],
            )
            closed = (
                -2 * z / (z**2 + omega**2)
                - 4
                * omega**2
                / length
                * (mp.exp(z * length) - 1)
                / (z**2 + omega**2) ** 2
            )
            assert abs(transform - closed) < tolerance

            averaged_kernel = mp.mpf("0.5") * (
                2 / (length * (z + 1j * omega) ** 2)
                - 1j / (mp.pi * (z + 1j * omega))
                + 2 / (length * (z - 1j * omega) ** 2)
                + 1j / (mp.pi * (z - 1j * omega))
            )
            kernel_closed = -4 * omega**2 / (
                length * (z**2 + omega**2) ** 2
            )
            assert abs(averaged_kernel - kernel_closed) < tolerance

        def h_function(s: mp.mpc) -> mp.mpc:
            return -mp.diff(mp.zeta, s) / mp.zeta(s) - 1 / (s - 1)

        midpoint = mp.mpf("0.5")
        c_normal_form = mp.digamma(mp.mpf("0.25")) - mp.log(mp.pi) + 4
        assert abs(2 * h_function(midpoint) - c_normal_form) < tolerance
        second_derivative = mp.diff(h_function, midpoint, 2)
        expected_second = -mp.zeta(3, mp.mpf("1.25")) / 4
        assert abs(second_derivative - expected_second) < mp.mpf("1e-78")


def _check_odd_multimode_partial_fraction_filter() -> None:
    # Coefficients are in the locked centered parity basis.  Its endpoint
    # phase is already part of V_n, so transform formula (13.3) introduces
    # no further alternating sign.
    for degree in range(1, 10):
        coefficients = tuple(
            F(
                2 * (-1) ** (degree - mode) * mode,
                factorial(degree - mode) * factorial(degree + mode),
            )
            for mode in range(1, degree + 1)
        )
        norm_squared = sum((value**2 for value in coefficients), F(0))
        norm_closed = F(
            2 * degree**2 * factorial(4 * degree),
            (4 * degree - 1) * factorial(2 * degree) ** 4,
        )
        assert norm_squared == norm_closed

        # Equivalently, the rational filter vanishes through order 2d-2
        # at infinity and its first surviving moment is exactly one.
        for moment_index in range(degree):
            moment = sum(
                (
                    coefficients[mode - 1]
                    * mode ** (2 * moment_index + 1)
                    for mode in range(1, degree + 1)
                ),
                F(0),
            )
            assert moment == F(int(moment_index == degree - 1))

        for squared_argument in (
            F(-1, 2),
            F(1, 2),
            F(degree**2) + F(1, 2),
        ):
            partial_fractions = sum(
                (
                    coefficients[mode - 1]
                    * mode
                    / (squared_argument - mode**2)
                    for mode in range(1, degree + 1)
                ),
                F(0),
            )
            product = F(1)
            for mode in range(1, degree + 1):
                product *= squared_argument - mode**2
            assert partial_fractions == 1 / product

    with mp.workdps(80):
        radius = 1 / mp.sqrt(2)
        integral = (
            mp.log(1 - radius**2)
            - 2
            + 2 * mp.atanh(radius) / radius
        )

        # Monotonicity of log(1-r^2*x^2) gives these finite right-Riemann
        # sum bounds with an O(1), rather than O(d), endpoint loss.
        for degree in (1, 2, 5, 20, 100):
            log_product = mp.fsum(
                mp.log(1 - radius**2 * mode**2 / degree**2)
                for mode in range(1, degree + 1)
            )
            assert degree * integral + mp.log(1 - radius**2) <= log_product
            assert log_product <= degree * integral

        bracket = 4 * (1 - mp.log(radius)) + 2 * integral
        rate_per_first_ordinate = radius * bracket / (2 * mp.pi)
        simplified_rate = 2 * mp.atanh(radius) / mp.pi
        assert abs(rate_per_first_ordinate - simplified_rate) < mp.mpf("1e-75")

        threshold = 3 * mp.pi / (4 * mp.atanh(radius))
        assert rate_per_first_ordinate > mp.mpf("0.56")
        assert mp.mpf("2.67") < threshold < mp.mpf("2.68")


def _check_live_shift_sampling_identity_and_log_loss() -> None:
    # A finite exact model of ZK=0 and R=K-p.  The positive sampling
    # identity is exact even though the associated signed bilinear sum can
    # cancel completely.
    sample_p = (complex(7, 0), complex(0, 7))
    sample_k = (complex(0, 0), complex(0, 0))
    sample_r = tuple(left - right for left, right in zip(sample_k, sample_p))

    assert sample_r == tuple(-value for value in sample_p)
    epsilon_r = sum(abs(value) ** 2 for value in sample_r)
    epsilon_p = sum(abs(value) ** 2 for value in sample_p)
    signed_pairing = sum(value**2 for value in sample_p)
    assert epsilon_r == epsilon_p == 98
    assert signed_pairing == 0

    a_squared = F(7, 2)
    u_shift = F(epsilon_p) / a_squared
    normalized_sampling = F(epsilon_p) / a_squared
    assert u_shift == normalized_sampling == 28

    # The currently proved E_N^2=O(lambda^-1) leaves precisely the L^3
    # factor in the compact-BV shift estimate.  The stated stronger target
    # removes it.
    with mp.workdps(80):
        for length_text in ("10", "25", "80"):
            length = mp.mpf(length_text)
            lam = mp.exp(length / 2)
            current_error_squared = 1 / lam
            improved_error_squared = 1 / (lam * length**4)
            current_scaled = lam * length**3 * current_error_squared
            improved_scaled = lam * length**3 * improved_error_squared
            assert abs(current_scaled - length**3) < mp.mpf("1e-70")
            assert abs(improved_scaled - 1 / length) < mp.mpf("1e-70")


def _check_signed_floor_action_and_projective_angle_countermodels() -> None:
    # Exact Gram-difference model (24.15).
    s = F(1, 3)
    r_matrix = ((F(2), F(0)), (F(0), F(1)))
    c_matrix = ((F(1), s), (s, F(1)))
    identity = _identity(2)
    b_matrix = _subtract(_add(identity, c_matrix), r_matrix)

    assert _determinant(c_matrix) == 1 - s**2 > 0
    assert b_matrix == ((F(0), s), (s, F(1)))
    assert b_matrix[1][1] == 1
    assert b_matrix[1][0] == s

    with mp.workdps(100):
        s_mp = mp.mpf(s.numerator) / s.denominator
        ground = (1 - mp.sqrt(1 + 4 * s_mp**2)) / 2
        assert ground < 0
        assert abs(s_mp / (1 - ground)) > mp.mpf("0.25")

    # Raw high-frequency separation can be destroyed exactly by the
    # retained spectral projection.
    large = F(100)
    boundary = (F(1), F(0))
    derivative = (F(1), large)
    projector = ((F(1), F(0)), (F(0), F(0)))
    boundary_column = tuple((value,) for value in boundary)
    derivative_column = tuple((value,) for value in derivative)
    projected_boundary = _matmul(projector, boundary_column)
    projected_derivative = _matmul(projector, derivative_column)

    assert projected_boundary == projected_derivative
    raw_cosine_squared = F(1, 1 + large**2)
    assert raw_cosine_squared < F(1, 10000)


class ExactFractionParityMultiplierSchurTests(unittest.TestCase):
    def test_n1_source_cauchy_parity_countermodel_and_rank_one_commutator(self) -> None:
        _check_n1_source_cauchy_parity_countermodel_and_rank_one_commutator()

    def test_two_plus_two_schur_and_resolvent_identities_at_exact_shifts(self) -> None:
        _check_two_plus_two_schur_and_resolvent_identities_at_exact_shifts()

    def test_all_shift_metric_rotation_countermodel(self) -> None:
        _check_all_shift_metric_rotation_countermodel()

    def test_odd_multiplier_dangerous_exterior_identities(self) -> None:
        _check_odd_multiplier_dangerous_exterior_identities()

    def test_rank_one_commutator_does_not_control_fixed_threshold_leakage(self) -> None:
        _check_rank_one_commutator_does_not_control_fixed_threshold_leakage()

    def test_anchor_chart_and_negative_reserve_countermodel(self) -> None:
        _check_anchor_chart_and_negative_reserve_countermodel()

    def test_trace_selected_joint_spectral_buffer(self) -> None:
        _check_trace_selected_joint_spectral_buffer()

    def test_rank_two_combined_load_characteristic_polynomial(self) -> None:
        _check_rank_two_combined_load_characteristic_polynomial()

    def test_endpoint_transform_and_positive_symbol_sqrt_n_obstruction(self) -> None:
        _check_endpoint_transform_and_positive_symbol_sqrt_n_obstruction()

    def test_exact_fraction_endpoint_atom_counterfamily(self) -> None:
        _check_exact_fraction_endpoint_atom_counterfamily()

    def test_rank_deficient_residual_saturation_projector(self) -> None:
        _check_rank_deficient_residual_saturation_projector()

    def test_positive_saturated_metric_block_and_cyclic_span(self) -> None:
        _check_positive_saturated_metric_block_and_cyclic_span()

    def test_cancellation_preserving_load_necessary_bound(self) -> None:
        _check_cancellation_preserving_load_necessary_bound()

    def test_complex_rank_two_gram_conjugation_order(self) -> None:
        _check_complex_rank_two_gram_conjugation_order()

    def test_exact_pole_row_formula_and_asymptotic(self) -> None:
        _check_exact_pole_row_formula_and_asymptotic()

    def test_one_dimensional_boundary_leverage_formula(self) -> None:
        _check_one_dimensional_boundary_leverage_formula()

    def test_boundary_trace_flow_and_high_mode_lower_bound(self) -> None:
        _check_boundary_trace_flow_and_high_mode_lower_bound()

    def test_endpoint_persistence_envelope_constants(self) -> None:
        _check_endpoint_persistence_envelope_constants()

    def test_central_lobe_constant_and_narrow_band_obstruction(self) -> None:
        _check_central_lobe_constant_and_narrow_band_obstruction()

    def test_growing_multilobe_model_constant(self) -> None:
        _check_growing_multilobe_model_constant()

    def test_even_multilobe_exact_integral_and_fourier_constants(self) -> None:
        _check_even_multilobe_exact_integral_and_fourier_constants()

    def test_adjacent_even_multilobe_covariance_regression(self) -> None:
        _check_adjacent_even_multilobe_covariance_regression()

    def test_single_atom_edge_constant_and_far_cross_kernel(self) -> None:
        _check_single_atom_edge_constant_and_far_cross_kernel()

    def test_single_atom_finite_carrier_modulation_quotient_regression(self) -> None:
        _check_single_atom_finite_carrier_modulation_quotient_regression()

    def test_mesoscopic_phase_average_closed_form(self) -> None:
        _check_mesoscopic_phase_average_closed_form()

    def test_mesoscopic_bessel_profile_mass_and_energy(self) -> None:
        _check_mesoscopic_bessel_profile_mass_and_energy()

    def test_small_band_sinc_packet_covariance_limits(self) -> None:
        _check_small_band_sinc_packet_covariance_limits()

    def test_zero_energy_outer_covariance_convention(self) -> None:
        _check_zero_energy_outer_covariance_convention()

    def test_fixed_cutoff_haar_product_and_endpoint(self) -> None:
        _check_fixed_cutoff_haar_product_and_endpoint()

    def test_pseudoinverse_boundary_leverage_lower_bound(self) -> None:
        _check_pseudoinverse_boundary_leverage_lower_bound()

    def test_pole_forcing_identity_and_tail_bound(self) -> None:
        _check_pole_forcing_identity_and_tail_bound()

    def test_exact_pole_multiplier_load_tradeoff(self) -> None:
        _check_exact_pole_multiplier_load_tradeoff()

    def test_pole_deleted_green_gate_collapse(self) -> None:
        _check_pole_deleted_green_gate_collapse()

    def test_transverse_green_critical_load_and_shift_monotonicity(self) -> None:
        _check_transverse_green_critical_load_and_shift_monotonicity()

    def test_all_shift_harmonic_forcing_cancellation(self) -> None:
        _check_all_shift_harmonic_forcing_cancellation()

    def test_shrinking_window_fixed_reserve_zero_composition(self) -> None:
        _check_shrinking_window_fixed_reserve_zero_composition()

    def test_separated_sine_kernel_identity_and_remainder_bound(self) -> None:
        _check_separated_sine_kernel_identity_and_remainder_bound()

    def test_fks_squared_radius_error_decay_regression(self) -> None:
        _check_fks_squared_radius_error_decay_regression()

    def test_near_quadratic_dyadic_left_endpoint_and_proxy_scaling(self) -> None:
        _check_near_quadratic_dyadic_left_endpoint_and_proxy_scaling()

    def test_high_moment_prime_group_and_positive_part_constants(self) -> None:
        _check_high_moment_prime_group_and_positive_part_constants()

    def test_high_moment_coefficient_and_mean_value_bounds(self) -> None:
        _check_high_moment_coefficient_and_mean_value_bounds()

    def test_subquadratic_tail_bypass_constants_and_schedule(self) -> None:
        _check_subquadratic_tail_bypass_constants_and_schedule()

    def test_local_feature_floor_and_resolvent_transfer(self) -> None:
        _check_local_feature_floor_and_resolvent_transfer()

    def test_first_odd_weighted_discrepancy_gate(self) -> None:
        _check_first_odd_weighted_discrepancy_gate()

    def test_first_odd_carrier_kernel_and_center(self) -> None:
        _check_first_odd_carrier_kernel_and_center()

    def test_odd_multimode_partial_fraction_filter(self) -> None:
        _check_odd_multimode_partial_fraction_filter()

    def test_live_shift_sampling_identity_and_log_loss(self) -> None:
        _check_live_shift_sampling_identity_and_log_loss()

    def test_signed_floor_action_and_projective_angle_countermodels(self) -> None:
        _check_signed_floor_action_and_projective_angle_countermodels()
