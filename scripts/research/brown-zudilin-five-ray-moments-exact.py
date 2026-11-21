"""Exact Brown--Zudilin five-ray moment certificate.

The exact path starts from equation (23) of Brown--Zudilin v3, reduces its
integer-parameter 3F2 factors to rational functions of x, log(1-x), and
Li_2(x), then evaluates the resulting Laurent-HPL integral in the formal MZV
basis through weight five. No numerical reconstruction or PSLQ step is used.

Requires SymPy 1.14. Examples:
    python brown_zudilin_five_ray_moments_exact.py --simplex
    python brown_zudilin_five_ray_moments_exact.py --rectangle
"""

from __future__ import annotations

from collections import Counter
from functools import lru_cache
from itertools import product
from math import factorial

import sympy as sp


z = sp.symbols("z", positive=True)
xx, LL, UU = sp.symbols("xx LL UU")
Z2, Z3, Z4, Z5, Z23, REGPOLE = sp.symbols("Z2 Z3 Z4 Z5 Z23 REGPOLE")


def prefactor(v):
    v1, v2, v3, v4, v5 = v
    return sp.Rational(
        factorial(v4)
        * factorial(v4 + v5)
        * factorial(v2)
        * factorial(v3 + v4)
        * factorial(v1)
        * factorial(v4),
        factorial(v4 + 1)
        * factorial(v4 + v5 + v2 + 1)
        * factorial(v3 + v4 + v1 + 1)
        * factorial(v4 + 1),
    )


def total_degree_indices(degree: int):
    return [v for v in product(range(degree + 1), repeat=5) if sum(v) <= degree]


@lru_cache(None)
def shuffles(left: tuple[int, ...], right: tuple[int, ...]):
    """Shuffle product of two HPL words, with multiplicities."""
    if not left:
        return Counter({right: 1})
    if not right:
        return Counter({left: 1})
    out = Counter()
    for word, multiplicity in shuffles(left[1:], right).items():
        out[(left[0],) + word] += multiplicity
    for word, multiplicity in shuffles(left, right[1:]).items():
        out[(right[0],) + word] += multiplicity
    return out


def shuffle_product(left: Counter, right: Counter):
    out = Counter()
    for u, cu in left.items():
        for v, cv in right.items():
            for word, multiplicity in shuffles(u, v).items():
                out[word] += cu * cv * multiplicity
    return out


def hpl_power_words(log_power: int, dilog_power: int):
    """Expand log(1-x)^a Li_2(x)^b in the HPL shuffle basis.

    H_1(x)=-log(1-x), H_{0,1}(x)=Li_2(x).
    """
    out = Counter({(): sp.Integer(1)})
    for _ in range(log_power):
        out = shuffle_product(out, Counter({(1,): -1}))
    for _ in range(dilog_power):
        out = shuffle_product(out, Counter({(0, 1): 1}))
    return out


def word_to_indices(word: tuple[int, ...]):
    if not word or word[0] != 0 or word[-1] != 1:
        raise ValueError(f"not a convergent MZV word: {word}")
    indices = []
    zeros = 0
    for bit in word:
        if bit == 0:
            zeros += 1
        else:
            indices.append(zeros + 1)
            zeros = 0
    if zeros:
        raise ValueError(f"trailing zero in MZV word: {word}")
    return tuple(indices)


@lru_cache(None)
def mzv_word(word: tuple[int, ...]):
    """Exact reduction of every convergent binary HPL endpoint of weight <=5."""
    ind = word_to_indices(word)
    weight = sum(ind)
    table = {
        (2,): Z2,
        (3,): Z3,
        (2, 1): Z3,
        (4,): Z4,
        (3, 1): Z4 / 4,
        (2, 2): 3 * Z4 / 4,
        (2, 1, 1): Z4,
        (5,): Z5,
        (4, 1): 2 * Z5 - Z23,
        (3, 2): 3 * Z23 - sp.Rational(11, 2) * Z5,
        (2, 3): -2 * Z23 + sp.Rational(9, 2) * Z5,
        (3, 1, 1): 2 * Z5 - Z23,
        (2, 2, 1): 3 * Z23 - sp.Rational(11, 2) * Z5,
        (2, 1, 2): -2 * Z23 + sp.Rational(9, 2) * Z5,
        (2, 1, 1, 1): Z5,
    }
    try:
        return table[ind]
    except KeyError as error:
        raise ValueError(f"missing MZV reduction {ind}, weight {weight}") from error


@lru_cache(None)
def hpl_moment(power: int, word: tuple[int, ...]):
    """Analytically regularised integral int_0^1 x^power H_word(x) dx.

    For every combined hypergeometric integrand used below the pole parts cancel,
    and this recursion equals the ordinary convergent integral. It follows by
    swapping the outer HPL integration with x, separately for letters 0 and 1.
    """
    if not word:
        if power == -1:
            return REGPOLE
        return sp.Rational(1, power + 1)
    if power == -1:
        return mzv_word((0,) + word)
    head, tail = word[0], word[1:]
    if head == 0:
        # The lower endpoint contributes when H_word starts in exact order
        # -power-1. This rational term is essential for the projected tail.
        lower = hpl_taylor_coefficient(word, -power - 1) if power <= -2 else 0
        return sp.cancel(
            (mzv_word(word) - lower - hpl_moment(power, tail)) / (power + 1)
        )
    if power >= 0:
        return sp.cancel(
            sum(hpl_moment(k, tail) for k in range(power + 1)) / (power + 1)
        )
    # power <= -2: (1-x^(p+1))/(1-x) is a finite negative Laurent sum.
    lower = hpl_taylor_coefficient(word, -power - 1)
    return sp.cancel(
        -(sum(hpl_moment(-k, tail) for k in range(1, -power)) + lower)
        / (power + 1)
    )


@lru_cache(None)
def hpl_taylor_series(word: tuple[int, ...], order: int):
    """Taylor coefficients [x^0,...,x^order] of an HPL word ending in 1."""
    if order < 0:
        return tuple()
    if not word:
        return (sp.Integer(1),) + (sp.Integer(0),) * order
    tail = hpl_taylor_series(word[1:], order)
    out = [sp.Integer(0)] * (order + 1)
    if word[0] == 0:
        for n in range(1, order + 1):
            out[n] = sp.cancel(tail[n] / n)
    else:
        running = sp.Integer(0)
        for n in range(order):
            running += tail[n]
            out[n + 1] = sp.cancel(running / (n + 1))
    return tuple(out)


def hpl_taylor_coefficient(word: tuple[int, ...], power: int):
    if power < 0:
        return sp.Integer(0)
    return hpl_taylor_series(word, power)[power]


def x_hyper(a: int, b: int, c: int, d: int, e: int):
    """Exact 3F2(-x/(1-x)) in Q(x,L,Li2)."""
    f = sp.hyperexpand(sp.hyper([a, b, c], [d, e], -z))
    f = f.subs(sp.exp_polar(sp.I * sp.pi), -1)
    f = f.xreplace(
        {
            sp.log(z + 1): -LL,
            sp.polylog(2, -z): -UU - LL**2 / 2,
        }
    )
    return sp.factor(sp.cancel(sp.together(f.subs(z, xx / (1 - xx)))))


def exact_x_integrand(v):
    v1, v2, v3, v4, v5 = v
    left = x_hyper(
        v2 + v4 + 1,
        v4 + 1,
        v4 + v5 + 1,
        v4 + 2,
        v4 + v5 + v2 + 2,
    )
    right = x_hyper(
        v3 + v4 + 1,
        v4 + 1,
        v1 + v4 + 1,
        v3 + v4 + v1 + 2,
        v4 + 2,
    )
    density = (
        prefactor(v)
        * left
        * right
        * xx ** (v4 + 1)
        / (1 - xx) ** (2 * v4 + 2)
    )
    return sp.factor(sp.cancel(sp.together(density)))


@lru_cache(None)
def exact_period(v):
    """Evaluate I(a(v)) exactly in the formal MZV basis through weight five."""
    density = exact_x_integrand(v)
    numerator, denominator = map(sp.expand, sp.fraction(density))
    denominator_poly = sp.Poly(denominator, xx)
    terms = denominator_poly.terms()
    if len(terms) != 1:
        raise ValueError(f"non-monomial denominator {denominator}")
    (den_power,), den_coeff = terms[0]
    poly = sp.Poly(numerator, xx, LL, UU)
    answer = 0
    for (x_power, log_power, dilog_power), coefficient in poly.terms():
        words = hpl_power_words(log_power, dilog_power)
        p = x_power - den_power
        for word, multiplicity in words.items():
            answer += (
                sp.Rational(coefficient, den_coeff)
                * multiplicity
                * hpl_moment(p, word)
            )
    return sp.factor(sp.expand(answer))


@lru_cache(None)
def projected_rational_moment(v):
    """Return I'(a(v)); for v!=0, Q(v)=0 and I'=half the rational part of I."""
    if not any(v):
        raise ValueError("the origin has I'(0)=zeta(5), not a rational tail")
    period = exact_period(tuple(v))
    extra = period.free_symbols - {Z2}
    if extra:
        raise AssertionError(f"uncancelled MZVs for {v}: {extra}; {period}")
    return sp.factor(period.subs(Z2, 0) / 2)


def add_indices(left, right):
    return tuple(a + b for a, b in zip(left, right))


def exact_tail_matrix(indices):
    indices = [tuple(index) for index in indices]
    moments = {
        add_indices(left, right): projected_rational_moment(add_indices(left, right))
        for left in indices
        for right in indices
    }
    return sp.Matrix(
        [[moments[add_indices(left, right)] for right in indices] for left in indices]
    )


def exact_signature(matrix):
    """Inertia by rational symmetric Schur complements."""
    work = sp.MutableDenseMatrix(matrix)
    positive = negative = zero = 0
    size = work.rows
    pivot = 0
    while pivot < size:
        diagonal = next((i for i in range(pivot, size) if work[i, i] != 0), None)
        if diagonal is not None:
            if diagonal != pivot:
                work.row_swap(pivot, diagonal)
                work.col_swap(pivot, diagonal)
            value = work[pivot, pivot]
            if value > 0:
                positive += 1
            else:
                negative += 1
            for i in range(pivot + 1, size):
                for j in range(i, size):
                    reduced = sp.cancel(
                        work[i, j] - work[i, pivot] * work[j, pivot] / value
                    )
                    work[i, j] = work[j, i] = reduced
            pivot += 1
            continue
        pair = next(
            (
                (i, j)
                for i in range(pivot, size)
                for j in range(i + 1, size)
                if work[i, j] != 0
            ),
            None,
        )
        if pair is None:
            zero += size - pivot
            break
        i, j = pair
        if i != pivot:
            work.row_swap(pivot, i)
            work.col_swap(pivot, i)
        if j != pivot + 1:
            work.row_swap(pivot + 1, j)
            work.col_swap(pivot + 1, j)
        value = work[pivot, pivot + 1]
        positive += 1
        negative += 1
        for i in range(pivot + 2, size):
            for j in range(i, size):
                reduced = sp.cancel(
                    work[i, j]
                    - (
                        work[i, pivot] * work[j, pivot + 1]
                        + work[i, pivot + 1] * work[j, pivot]
                    )
                    / value
                )
                work[i, j] = work[j, i] = reduced
        pivot += 2
    return positive, negative, zero


def row_column_delta(full_indices, rational_moments):
    """Brown 7.4 row-LCM/column-gcd normalisation for the full moment matrix."""
    zero = (0, 0, 0, 0, 0)

    def coefficients(left, right):
        if left == zero and right == zero:
            return sp.Integer(1), sp.Integer(0)
        return sp.Integer(0), rational_moments[add_indices(left, right)]

    row_lcms = []
    for left in full_indices:
        denominators = [
            int(sp.denom(coefficient))
            for right in full_indices
            for coefficient in coefficients(left, right)
        ]
        row_lcms.append(sp.ilcm(*denominators))
    column_gcds = []
    for right in full_indices:
        integers = [
            abs(int(coefficient * row_lcms[row]))
            for row, left in enumerate(full_indices)
            for coefficient in coefficients(left, right)
            if coefficient
        ]
        column_gcds.append(sp.igcd(*integers))
    delta = sp.Rational(sp.prod(row_lcms), sp.prod(column_gcds))
    return sp.factor(delta), row_lcms, column_gcds


def audit_simplex_degree_two():
    tail = [index for index in total_degree_indices(2) if any(index)]
    matrix = exact_tail_matrix(tail)
    determinant = sp.factor(matrix.det(method="domain-ge"))
    expected = -sp.Rational(
        1395169784123560157429938265866653629,
        2**139 * 3**43,
    )
    assert determinant == expected
    signature = exact_signature(matrix)
    assert signature == (13, 7, 0)
    vector = sp.Matrix([projected_rational_moment(index) for index in tail])
    schur = sp.factor((vector.T * matrix.inv() * vector)[0])
    expected_schur = sp.Rational(
        10323703950151992936310,
        9902213688255569033633,
    )
    assert schur == expected_schur
    full = total_degree_indices(2)
    needed = {
        add_indices(left, right): projected_rational_moment(add_indices(left, right))
        for left in full
        for right in full
        if any(add_indices(left, right))
    }
    delta, row_lcms, column_gcds = row_column_delta(full, needed)
    assert delta == 2**139 * 3**50
    return determinant, signature, schur, delta, row_lcms, column_gcds


def audit_rectangle_degree_one():
    full = list(product(range(2), repeat=5))
    tail = [index for index in full if any(index)]
    needed_indices = [index for index in product(range(3), repeat=5) if any(index)]
    moments = {index: projected_rational_moment(index) for index in needed_indices}
    matrix = sp.Matrix(
        [[moments[add_indices(left, right)] for right in tail] for left in tail]
    )
    determinant = sp.factor(matrix.det(method="domain-ge"))
    expected = sp.Rational(
        1319743526081805410693971630177432681092241,
        2**224 * 3**92 * 5,
    )
    assert determinant == expected
    signature = exact_signature(matrix)
    assert signature == (19, 12, 0)
    vector = sp.Matrix([moments[index] for index in tail])
    schur = sp.factor((vector.T * matrix.inv() * vector)[0])
    expected_schur = sp.Rational(
        360532385112623748392840562,
        347836582574967045455337059,
    )
    assert schur == expected_schur
    delta, row_lcms, column_gcds = row_column_delta(full, moments)
    assert delta == 2**237 * 3**102 * 5
    return determinant, signature, schur, delta, row_lcms, column_gcds


if __name__ == "__main__":
    import argparse
    import time

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--simplex", action="store_true", help="audit 0<|alpha|<=2")
    parser.add_argument("--rectangle", action="store_true", help="audit {0,1}^5")
    args = parser.parse_args()
    if not args.simplex and not args.rectangle:
        args.simplex = True

    print("base", exact_period((0, 0, 0, 0, 0)))
    print("symmetric-2", exact_period((2, 2, 2, 2, 2)))
    if args.simplex:
        start = time.perf_counter()
        determinant, signature, schur, delta, _, _ = audit_simplex_degree_two()
        print("simplex-tail-determinant", determinant)
        print("simplex-tail-signature", signature)
        print("simplex-schur", schur)
        print("simplex-delta", sp.factorint(delta))
        print("simplex-seconds", round(time.perf_counter() - start, 3))
    if args.rectangle:
        start = time.perf_counter()
        determinant, signature, schur, delta, _, _ = audit_rectangle_degree_one()
        print("rectangle-tail-determinant", determinant)
        print("rectangle-tail-signature", signature)
        print("rectangle-schur", schur)
        print("rectangle-delta", sp.factorint(delta))
        print("rectangle-seconds", round(time.perf_counter() - start, 3))
