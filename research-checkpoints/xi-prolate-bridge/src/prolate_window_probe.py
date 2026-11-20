#!/usr/bin/env python3
"""Source-limit-normalized prolate windows for finite Weil diagnostics.

This is an exploratory path separate from the P0 producer and verifier.  Its
basis is defined only from prolate eigenfunctions, the arithmetic map, the
explicit inversion projections, and the Euclidean Gram matrix.  The Weil
matrix is supplied only after that basis has been fixed.

The window normalization follows CCM-PROLATE-2023 equation (29).  At finite
lambda the origin ratio in that equation is replaced by an integral ratio so
that each compactly supported prolate combination has exactly zero integral:

  psi^+_{ell,lambda} = h_{4 ell,lambda}
      - (int h_{4 ell,lambda}/int h_{0,lambda}) h_{0,lambda},

  psi^-_{ell,lambda} = -h_{4 ell+2,lambda}
      + (int h_{4 ell+2,lambda}/int h_{2,lambda}) h_{2,lambda}.

The coefficient of the high-index function is therefore source-limit fixed
to +1 in the plus family and -1 in the minus family.  The second formula is a
Fourier-sign-minus family of spatially even functions; "minus" does not mean
spatially odd.  After applying E, the plus/minus images are explicitly
projected by (I+J)/2 and (I-J)/2.  No finite-lambda inversion parity is
assumed.

All results are arbitrary-precision point diagnostics, not interval
certificates or asymptotic estimates.
"""
from __future__ import annotations

from dataclasses import dataclass
import argparse
import json
from pathlib import Path
from typing import Callable, Iterable, Sequence

import mpmath as mp

from prolate_state import (
    logarithmic_breakpoints,
    normalized_even_basis_values,
    prolate_matrix_quadrature,
    prolate_matrix_recurrence,
    source_combination,
)
from weil_matrix import blocks_split, parse_decimal


SOURCE_PINS = {
    "finite_weil_matrix": {
        "id": "CCM-ZST-v1",
        "version": "arXiv:2511.22755v1",
        "sha256": "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b",
    },
    "prolate_window_limit": {
        "id": "CCM-PROLATE-2023",
        "version": "arXiv:2310.18423v2",
        "equation": "(29)",
        "sha256": "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e",
    },
}


def _real_inner(x: mp.matrix, y: mp.matrix) -> mp.mpf:
    return (x.T * y)[0]


def _vector_norm(x: mp.matrix) -> mp.mpf:
    value = _real_inner(x, x)
    if value < 0 and abs(value) < mp.eps * 100:
        value = mp.mpf("0")
    return mp.sqrt(value)


def _max_abs(A: mp.matrix) -> mp.mpf:
    if A.rows == 0 or A.cols == 0:
        return mp.mpf("0")
    return max(abs(A[i, j]) for i in range(A.rows) for j in range(A.cols))


def _columns(items: Sequence[mp.matrix]) -> mp.matrix:
    if not items:
        return mp.matrix(0, 0)
    out = mp.matrix(items[0].rows, len(items))
    for j, item in enumerate(items):
        if item.cols != 1 or item.rows != out.rows:
            raise ValueError("column dimensions do not agree")
        for i in range(out.rows):
            out[i, j] = item[i]
    return out


def _matrix_column(A: mp.matrix, j: int) -> mp.matrix:
    return mp.matrix([A[i, j] for i in range(A.rows)])


def _identity(n: int) -> mp.matrix:
    return mp.eye(n)


def hermite_origin(label: int) -> mp.mpf:
    """Value at zero of the locked L2-normalized Hermite function h_label."""
    if label < 0 or label % 2:
        raise ValueError("the window construction uses nonnegative even labels")
    m = label // 2
    return (
        (-1) ** m
        * mp.power(2, mp.mpf("0.25") - m)
        * mp.sqrt(mp.factorial(2 * m))
        / mp.factorial(m)
    )


@dataclass
class GeneralProlateMode:
    lambda_text: str
    label: int
    eigenvalue: mp.mpf
    coefficients: mp.matrix

    @property
    def lam(self) -> mp.mpf:
        return parse_decimal(self.lambda_text)

    def __call__(self, x: mp.mpf) -> mp.mpf:
        x = mp.mpf(x)
        if abs(x) > self.lam:
            return mp.mpf("0")
        basis = normalized_even_basis_values(x / self.lam, self.coefficients.rows)
        return mp.fsum(
            self.coefficients[i] * basis[i] for i in range(self.coefficients.rows)
        ) / mp.sqrt(self.lam)

    def integral(self) -> mp.mpf:
        return mp.sqrt(2 * self.lam) * self.coefficients[0]

    def value_at_zero(self) -> mp.mpf:
        return self(mp.mpf("0"))


def general_prolate_modes(
    lambda_text: str,
    labels: Iterable[int],
    basis_size: int,
    dps: int,
    assembly: str = "recurrence",
) -> dict[int, GeneralProlateMode]:
    """Build fixed-sign even prolate modes from one recurrence assembly.

    The label-n mode is the n/2-th eigenvector in the even Legendre sector.
    Its sign is chosen to match sign(h_n(0)), which is essential for labels
    congruent to 2 modulo 4 and extends the existing h_0/h_4 convention.
    """
    mp.mp.dps = dps
    labels = sorted(set(labels))
    if not labels:
        raise ValueError("at least one prolate label is required")
    if any(label < 0 or label % 2 for label in labels):
        raise ValueError("all prolate labels must be nonnegative and even")
    if max(labels) // 2 >= basis_size:
        raise ValueError("prolate basis is too small for the requested label")

    if assembly == "recurrence":
        A = prolate_matrix_recurrence(lambda_text, basis_size, dps)
    elif assembly == "quadrature":
        A = prolate_matrix_quadrature(lambda_text, basis_size, dps)
    else:
        raise ValueError("assembly must be 'recurrence' or 'quadrature'")
    eigenvalues, eigenvectors = mp.eigsy(A)
    result: dict[int, GeneralProlateMode] = {}
    zero_basis = normalized_even_basis_values(mp.mpf("0"), basis_size)
    for label in labels:
        column = label // 2
        coeff = mp.matrix([eigenvectors[i, column] for i in range(basis_size)])
        at_zero = mp.fsum(coeff[i] * zero_basis[i] for i in range(basis_size))
        desired_sign = 1 if hermite_origin(label) > 0 else -1
        if desired_sign * at_zero < 0:
            coeff = -coeff
            at_zero = -at_zero
        if desired_sign * at_zero <= 0:
            raise ArithmeticError("unable to orient a prolate mode at the origin")
        result[label] = GeneralProlateMode(
            lambda_text=lambda_text,
            label=label,
            eigenvalue=eigenvalues[column],
            coefficients=coeff,
        )
    return result


@dataclass
class CodimensionTwoCorrection:
    """Exact finite-Galerkin correction satisfying integral=f(0)=0."""

    lambda_text: str
    h_coefficients: mp.matrix
    g_coefficients: mp.matrix
    f_coefficients: mp.matrix
    a4: mp.mpf
    a0: mp.mpf
    correction_scalar_c: mp.mpf
    inferred_chi: dict[int, mp.mpf]
    correction_scalar_chi_formula: mp.mpf

    @property
    def lam(self) -> mp.mpf:
        return parse_decimal(self.lambda_text)

    def _evaluate(self, coefficients: mp.matrix, x: mp.mpf) -> mp.mpf:
        x = mp.mpf(x)
        if abs(x) > self.lam:
            return mp.mpf("0")
        values = normalized_even_basis_values(x / self.lam, coefficients.rows)
        return mp.fsum(coefficients[i] * values[i] for i in range(coefficients.rows)) / mp.sqrt(
            self.lam
        )

    def h(self, x: mp.mpf) -> mp.mpf:
        return self._evaluate(self.h_coefficients, x)

    def g(self, x: mp.mpf) -> mp.mpf:
        return self._evaluate(self.g_coefficients, x)

    def f(self, x: mp.mpf) -> mp.mpf:
        return self._evaluate(self.f_coefficients, x)

    def _integral(self, coefficients: mp.matrix) -> mp.mpf:
        return mp.sqrt(2 * self.lam) * coefficients[0]

    def h_integral(self) -> mp.mpf:
        return self._integral(self.h_coefficients)

    def g_integral(self) -> mp.mpf:
        return self._integral(self.g_coefficients)

    def f_integral(self) -> mp.mpf:
        return self._integral(self.f_coefficients)


def compact_bump_phi(x: mp.mpf) -> mp.mpf:
    """Explicit even C-infinity bump supported in (-1,1), with phi(0)=1."""
    x = mp.mpf(x)
    if abs(x) >= 1:
        return mp.mpf("0")
    return mp.e ** (1 - 1 / (1 - x * x))


def compact_zero_integral_psi(x: mp.mpf) -> mp.mpf:
    """psi(x)=2phi(2x)-phi(x): psi(0)=1 and integral psi=0."""
    x = mp.mpf(x)
    return 2 * compact_bump_phi(2 * x) - compact_bump_phi(x)


@dataclass
class InvisibleCodimensionTwoCorrection:
    """A compact correction invisible to E on [1/lambda,lambda]."""

    source_h: CodimensionTwoCorrection
    scale_a: mp.mpf
    amplitude: mp.mpf

    @property
    def lam(self) -> mp.mpf:
        return self.source_h.lam

    def bump(self, x: mp.mpf) -> mp.mpf:
        return compact_zero_integral_psi(mp.mpf(x) / self.scale_a)

    def f(self, x: mp.mpf) -> mp.mpf:
        return self.source_h.h(x) - self.amplitude * self.bump(x)

    def bump_arithmetic_transform(self, u: mp.mpf) -> mp.mpf:
        """E(amplitude*psi_a)(u), evaluated from its finite support."""
        u = mp.mpf(u)
        if u <= 0:
            raise ValueError("u must be positive")
        count = int(mp.floor(self.scale_a / u))
        return self.amplitude * mp.sqrt(u) * mp.fsum(
            self.bump(m * u) for m in range(1, count + 1)
        )


def invisible_codimension_two_correction(
    source_h: CodimensionTwoCorrection,
) -> InvisibleCodimensionTwoCorrection:
    """Preserve E(h_lambda) identically while enforcing h(0)=int h=0.

    Choose a=1/(2lambda).  Since supp(psi_a) is contained in (-a,a), every
    arithmetic sample m*u with u in [1/lambda,lambda] lies outside the support:

      m*u >= 1/lambda = 2a > a.

    Hence E(h-h(0)psi_a)=E(h) throughout the source interval, before either
    inversion projection or the finite Fourier projection.
    """
    a = 1 / (2 * source_h.lam)
    if not a < 1 / source_h.lam:
        raise ArithmeticError("invisible-corrector support does not clear the arithmetic samples")
    amplitude = source_h.h(0)
    return InvisibleCodimensionTwoCorrection(source_h=source_h, scale_a=a, amplitude=amplitude)


def codimension_two_correction(
    modes: dict[int, GeneralProlateMode],
) -> CodimensionTwoCorrection:
    """Correct the locked h_lambda in the zero-integral h_2/h_0 direction.

    If I_n=int h_{n,lambda}, set

      h_lambda = a4 h_4 - a0 h_0,   a0=a4 I_4/I_0,
      g_lambda = h_2 - (I_2/I_0)h_0,
      c_lambda = h_lambda(0)/g_lambda(0),
      f_lambda = h_lambda-c_lambda g_lambda.

    Both h_lambda and g_lambda have zero integral, while f_lambda also
    vanishes at zero.  The correction does not replace the locked P0 state;
    it is audited as a separate prospective radical-domain input.
    """
    try:
        h0, h2, h4 = modes[0], modes[2], modes[4]
    except KeyError as exc:
        raise ValueError("codimension-two correction requires labels 0,2,4") from exc
    I0, I2, I4 = h0.integral(), h2.integral(), h4.integral()
    if I0 == 0:
        raise ArithmeticError("h_0 has zero integral")
    a4 = mp.sqrt(3) / mp.power(2, mp.mpf(11) / 4)
    a0 = a4 * I4 / I0
    h_coefficients = a4 * h4.coefficients - a0 * h0.coefficients
    g_coefficients = h2.coefficients - (I2 / I0) * h0.coefficients

    lam = h0.lam
    zero_values = normalized_even_basis_values(mp.mpf("0"), h0.coefficients.rows)

    def at_zero(coefficients: mp.matrix) -> mp.mpf:
        return mp.fsum(
            coefficients[i] * zero_values[i] for i in range(coefficients.rows)
        ) / mp.sqrt(lam)

    g_zero = at_zero(g_coefficients)
    if g_zero == 0:
        raise ArithmeticError("codimension-two correction direction vanishes at zero")
    c = at_zero(h_coefficients) / g_zero
    f_coefficients = h_coefficients - c * g_coefficients

    inferred_chi: dict[int, mp.mpf] = {}
    for label, mode in ((0, h0), (2, h2), (4, h4)):
        fourier_sign = (-1) ** (label // 2)
        denominator = fourier_sign * mode.value_at_zero()
        if denominator == 0:
            raise ArithmeticError("cannot infer compressed Fourier eigenvalue at zero")
        inferred_chi[label] = mode.integral() / denominator
    chi_formula = (
        a4
        * (h4.value_at_zero() / h2.value_at_zero())
        * (inferred_chi[0] - inferred_chi[4])
        / (inferred_chi[0] + inferred_chi[2])
    )
    return CodimensionTwoCorrection(
        lambda_text=h0.lambda_text,
        h_coefficients=h_coefficients,
        g_coefficients=g_coefficients,
        f_coefficients=f_coefficients,
        a4=a4,
        a0=a0,
        correction_scalar_c=c,
        inferred_chi=inferred_chi,
        correction_scalar_chi_formula=chi_formula,
    )


@dataclass
class ProlateWindow:
    family: str
    target: GeneralProlateMode
    base: GeneralProlateMode
    target_coefficient: mp.mpf
    base_coefficient: mp.mpf

    @property
    def lambda_text(self) -> str:
        return self.target.lambda_text

    @property
    def lam(self) -> mp.mpf:
        return self.target.lam

    @property
    def coefficients(self) -> mp.matrix:
        return (
            self.target_coefficient * self.target.coefficients
            + self.base_coefficient * self.base.coefficients
        )

    def __call__(self, x: mp.mpf) -> mp.mpf:
        x = mp.mpf(x)
        if abs(x) > self.lam:
            return mp.mpf("0")
        values = normalized_even_basis_values(x / self.lam, self.coefficients.rows)
        return mp.fsum(
            self.coefficients[i] * values[i] for i in range(self.coefficients.rows)
        ) / mp.sqrt(self.lam)

    def integral(self) -> mp.mpf:
        return mp.sqrt(2 * self.lam) * self.coefficients[0]

    def value_at_zero(self) -> mp.mpf:
        return self(mp.mpf("0"))

    def source_limit_base_coefficient(self) -> mp.mpf:
        if self.family == "plus":
            return -hermite_origin(self.target.label) / hermite_origin(0)
        if self.family == "minus":
            return hermite_origin(self.target.label) / hermite_origin(2)
        raise ValueError("unknown family")


def make_prolate_window(
    modes: dict[int, GeneralProlateMode], family: str, target_label: int
) -> ProlateWindow:
    """Make an exact-zero-integral finite-lambda deformation of source (29)."""
    if family == "plus":
        if target_label < 4 or target_label % 4:
            raise ValueError("plus targets are labels 4,8,12,...")
        base_label = 0
        target_coefficient = mp.mpf("1")
    elif family == "minus":
        if target_label < 6 or target_label % 4 != 2:
            raise ValueError("minus targets are labels 6,10,14,...")
        base_label = 2
        target_coefficient = mp.mpf("-1")
    else:
        raise ValueError("family must be 'plus' or 'minus'")
    try:
        target = modes[target_label]
        base = modes[base_label]
    except KeyError as exc:
        raise ValueError("required prolate mode was not assembled") from exc
    base_integral = base.integral()
    if base_integral == 0:
        raise ArithmeticError("base prolate mode has zero integral")
    base_coefficient = -target_coefficient * target.integral() / base_integral
    return ProlateWindow(
        family=family,
        target=target,
        base=base,
        target_coefficient=target_coefficient,
        base_coefficient=base_coefficient,
    )


def compressed_fourier_eigenvalue(mode: GeneralProlateMode) -> mp.mpf:
    """Recover the finite prolate concentration eigenvalue ``chi_n``.

    In the locked normalization,

      integral h_(n,lambda)
        = (-1)^(n/2) chi_n h_(n,lambda)(0).

    This reconstructs ``chi_n`` from the independently assembled differential
    eigenfunction instead of importing a cached concentration eigenvalue.
    """
    sign = (-1) ** (mode.label // 2)
    denominator = sign * mode.value_at_zero()
    if denominator == 0:
        raise ArithmeticError("cannot recover chi_n from a zero origin value")
    return mode.integral() / denominator


def additive_concentration_defect(mode: GeneralProlateMode) -> mp.mpf:
    """Return ``1-chi_n^2`` in the locked real-even Fourier convention."""
    chi = compressed_fourier_eigenvalue(mode)
    defect = 1 - chi * chi
    tolerance = mp.power(10, -max(12, mp.mp.dps // 2))
    if defect < 0 and abs(defect) <= tolerance:
        defect = mp.mpf("0")
    if defect < 0:
        raise ArithmeticError("negative prolate concentration defect; increase precision")
    return defect


def prolate_window_mode_coordinates(window: ProlateWindow) -> dict[int, mp.mpf]:
    """Sparse coordinates of a window in the orthonormal prolate-mode basis."""
    return {
        window.target.label: window.target_coefficient,
        window.base.label: window.base_coefficient,
    }


def prolate_concentration_gram(
    modes: dict[int, GeneralProlateMode],
    coefficient_columns: Sequence[dict[int, mp.mpf]],
) -> mp.matrix:
    """Exact finite-Galerkin additive leakage Gram in prolate coordinates.

    If ``P`` is time limitation to ``[-lambda,lambda]``, unitarity of the
    additive Fourier transform and

      P F h_n = (-1)^(n/2) chi_n h_n

    give

      <(1-P)F h_n,(1-P)F h_m>=(1-chi_n^2) delta_nm.

    Hence a source coefficient matrix ``C`` has the positive Gram
    ``C^* diag(1-chi_n^2) C``.  No Weil matrix enters this construction.
    """
    count = len(coefficient_columns)
    if count == 0:
        raise ValueError("at least one source coefficient column is required")
    labels = set().union(*(column.keys() for column in coefficient_columns))
    missing = labels.difference(modes)
    if missing:
        raise ValueError(f"missing prolate modes for labels {sorted(missing)}")
    defects = {label: additive_concentration_defect(modes[label]) for label in labels}
    gram = mp.matrix(count)
    for i, left in enumerate(coefficient_columns):
        for j, right in enumerate(coefficient_columns):
            gram[i, j] = mp.fsum(
                left.get(label, 0) * right.get(label, 0) * defects[label]
                for label in labels
            )
    return gram


def relative_positive_model_audit(
    effective_operator: mp.matrix | None,
    positive_model: mp.matrix,
) -> dict[str, object] | None:
    """Compare an effective Schur operator with a locked positive model.

    The returned spectrum is that of

      D^(-1/2) S D^(-1/2),

    where ``S`` is the point Schur complement and ``D`` is the prolate
    concentration-defect Gram.  Positive eigenvalues prove only the finite
    point positivity of ``S``.  They are not interval enclosures or uniform
    asymptotic bounds.
    """
    if effective_operator is None:
        return None
    if effective_operator.rows != positive_model.rows or effective_operator.cols != positive_model.cols:
        raise ValueError("effective operator and positive model dimensions differ")
    values, vectors = mp.eigsy(positive_model)
    if values[0] <= 0:
        raise ArithmeticError("prolate concentration model is not positive definite")
    inverse_root = (
        vectors
        * mp.diag([1 / mp.sqrt(values[i]) for i in range(values.rows)])
        * vectors.T
    )
    relative = inverse_root * effective_operator * inverse_root
    relative = (relative + relative.T) / 2
    relative_values, _ = mp.eigsy(relative)
    center = (relative_values[0] + relative_values[-1]) / 2
    radius = (relative_values[-1] - relative_values[0]) / 2
    relative_radius = radius / center if center > 0 else None
    return {
        "model_eigenvalues": values,
        "model_inverse_square_root": inverse_root,
        "relative_operator": relative,
        "relative_eigenvalues": relative_values,
        "center_scalar": center,
        "relative_radius_about_center": relative_radius,
    }


def arithmetic_transform_window(window: ProlateWindow, u: mp.mpf) -> mp.mpf:
    """Locked arithmetic map E(f)(u)=sqrt(u) sum_{m>=1} f(mu)."""
    u = mp.mpf(u)
    if u <= 0:
        raise ValueError("u must be positive")
    count = int(mp.floor(window.lam / u))
    return mp.sqrt(u) * mp.fsum(window(m * u) for m in range(1, count + 1))


def logarithmic_parity_image(window: ProlateWindow, t: mp.mpf, parity: str) -> mp.mpf:
    """Explicit (I+J)/2 or (I-J)/2 arithmetic image on 0<=t<=L."""
    L = 2 * mp.log(window.lam)
    u = mp.exp(t) / window.lam
    direct = arithmetic_transform_window(window, u)
    reflected = arithmetic_transform_window(window, 1 / u)
    if parity == "plus":
        return (direct + reflected) / 2
    if parity == "minus":
        return (direct - reflected) / 2
    raise ValueError("parity must be 'plus' or 'minus'")


def fourier_sector_projection(
    k_t: Callable[[mp.mpf], mp.mpf],
    L: mp.mpf,
    N: int,
    breakpoints: Sequence[mp.mpf],
    parity: str,
    direct_error: bool = True,
) -> dict[str, object]:
    """Project an explicitly parity-fixed real function into one J sector.

    Returned coordinates use the real orthonormal sector bases

      e_0, (V_n+V_-n)/sqrt(2), n>=1,
      (V_n-V_-n)/sqrt(2), n>=1.

    For the minus sector a harmless global phase i has been applied, so the
    coordinates are real.  This is equivalent to the sine basis.
    """
    if N < 0:
        raise ValueError("N must be nonnegative")
    if len(breakpoints) < 2:
        raise ValueError("at least two integration breakpoints are required")

    pieces = list(zip(breakpoints[:-1], breakpoints[1:]))
    if parity not in ("plus", "minus"):
        raise ValueError("parity must be 'plus' or 'minus'")

    # Each arithmetic summation range is constant inside a piece, hence k_t
    # is analytic there.  Evaluate all Fourier coefficients at the same
    # Gauss--Legendre nodes so the expensive arithmetic image is computed once
    # per node, not once per mode.  mpmath's cached rule uses 3*2^(degree-1)
    # nodes.  A one-degree-lower replay is retained as a point diagnostic.
    quadrature_degree = 5 if mp.mp.dps <= 35 else 6 if mp.mp.dps <= 70 else 7

    def coefficient_replay(degree: int, include_norms: bool):
        count = N + 1 if parity == "plus" else N
        sums = [mp.mpf("0") for _ in range(count)]
        norm_sq = mp.mpf("0")
        sampled: list[tuple[mp.mpf, mp.mpf, mp.mpf]] = []
        for a, b in pieces:
            nodes = mp.mp._gauss_legendre.get_nodes(a, b, degree, mp.mp.prec)
            for t, weight in nodes:
                value = k_t(t)
                if parity == "plus":
                    for n in range(N + 1):
                        sums[n] += (
                            weight
                            * value
                            * mp.cos(2 * mp.pi * n * t / L)
                            / mp.sqrt(L)
                        )
                else:
                    for n in range(1, N + 1):
                        sums[n - 1] += (
                            weight
                            * value
                            * mp.sin(2 * mp.pi * n * t / L)
                            / mp.sqrt(L)
                        )
                if include_norms:
                    norm_sq += weight * value * value
                    sampled.append((t, weight, value))
        return sums, norm_sq, sampled

    scalar_coefficients, continuous_norm_sq_value, sampled = coefficient_replay(
        quadrature_degree, direct_error
    )
    lower_coefficients, _, _ = coefficient_replay(quadrature_degree - 1, False)
    lower_degree_disagreement = max(
        abs(a - b) for a, b in zip(scalar_coefficients, lower_coefficients)
    ) if scalar_coefficients else mp.mpf("0")

    if parity == "plus":
        coordinates = mp.matrix(
            [scalar_coefficients[0]]
            + [mp.sqrt(2) * scalar_coefficients[n] for n in range(1, N + 1)]
        )

        def projected(t: mp.mpf) -> mp.mpf:
            return (
                scalar_coefficients[0]
                + 2
                * mp.fsum(
                    scalar_coefficients[n] * mp.cos(2 * mp.pi * n * t / L)
                    for n in range(1, N + 1)
                )
            ) / mp.sqrt(L)

    else:
        coordinates = mp.matrix([mp.sqrt(2) * value for value in scalar_coefficients])

        def projected(t: mp.mpf) -> mp.mpf:
            return 2 * mp.fsum(
                scalar_coefficients[n - 1] * mp.sin(2 * mp.pi * n * t / L)
                for n in range(1, N + 1)
            ) / mp.sqrt(L)

    projection_error_sq = None
    continuous_norm_sq = None
    if direct_error:
        continuous_norm_sq = continuous_norm_sq_value
        projection_error_sq = mp.fsum(
            weight * (value - projected(t)) ** 2 for t, weight, value in sampled
        )
    return {
        "sector_coordinates": coordinates,
        "scalar_fourier_coefficients": scalar_coefficients,
        "projected_norm_sq": _real_inner(coordinates, coordinates),
        "continuous_norm_sq": continuous_norm_sq,
        "projection_error_sq_direct": projection_error_sq,
        "Gauss_Legendre_degree": quadrature_degree,
        "Gauss_Legendre_nodes_per_piece": 3 * 2 ** (quadrature_degree - 1),
        "lower_degree_coefficient_disagreement_max_abs": lower_degree_disagreement,
    }


def project_prolate_window(
    window: ProlateWindow, N: int, parity: str, direct_error: bool = True
) -> dict[str, object]:
    if parity != window.family:
        raise ValueError("window family and explicit inversion parity must agree")
    L = 2 * mp.log(window.lam)
    points = logarithmic_breakpoints(window.lambda_text)
    return fourier_sector_projection(
        lambda t: logarithmic_parity_image(window, t, parity),
        L,
        N,
        points,
        parity,
        direct_error=direct_error,
    )


def gram_orthonormalize(raw: mp.matrix, dps: int) -> dict[str, object]:
    """Symmetric (Loewdin) orthonormalization using only the Euclidean Gram."""
    if raw.cols == 0 or raw.rows < raw.cols:
        raise ValueError("raw window matrix must have independent candidate columns")
    gram = raw.T * raw
    values, vectors = mp.eigsy(gram)
    threshold = mp.power(10, -max(12, dps // 2))
    if values[0] <= threshold:
        raise ArithmeticError("prolate-window Gram matrix is singular or underresolved")
    invroot = vectors * mp.diag([1 / mp.sqrt(values[i]) for i in range(values.rows)]) * vectors.T
    basis = raw * invroot
    defect = _max_abs(basis.T * basis - mp.eye(raw.cols))
    return {
        "gram": gram,
        "gram_eigenvalues": values,
        "gram_condition_number": values[-1] / values[0],
        "inverse_square_root": invroot,
        "basis": basis,
        "orthonormality_defect_max_abs": defect,
    }


def canonical_complement(occupied: mp.matrix, dimension: int, dps: int) -> mp.matrix:
    """Deterministic coordinate complement; no Weil spectral data are used."""
    if occupied.rows != dimension:
        raise ValueError("occupied basis has the wrong ambient dimension")
    if occupied.cols > dimension:
        raise ValueError("occupied basis is overcomplete")
    defect = _max_abs(occupied.T * occupied - mp.eye(occupied.cols))
    if defect > mp.power(10, -max(8, dps // 3)):
        raise ArithmeticError("occupied columns are not sufficiently orthonormal")
    columns = [_matrix_column(occupied, j) for j in range(occupied.cols)]
    complement: list[mp.matrix] = []
    threshold = mp.power(10, -max(10, dps // 2))
    for index in range(dimension):
        v = mp.matrix(dimension, 1)
        v[index] = 1
        for _ in range(2):
            for column in columns + complement:
                v -= column * _real_inner(column, v)
        norm = _vector_norm(v)
        if norm > threshold:
            complement.append(v / norm)
        if len(complement) == dimension - occupied.cols:
            break
    if len(complement) != dimension - occupied.cols:
        raise ArithmeticError("failed to construct the deterministic complement")
    return _columns(complement) if complement else mp.matrix(dimension, 0)


def sector_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    d = 2 * N + 1
    even = mp.matrix(d, N + 1)
    odd = mp.matrix(d, N)
    even[N, 0] = 1
    for k in range(1, N + 1):
        even[N + k, k] = 1 / mp.sqrt(2)
        even[N - k, k] = 1 / mp.sqrt(2)
        odd[N + k, k - 1] = 1 / mp.sqrt(2)
        odd[N - k, k - 1] = -1 / mp.sqrt(2)
    return even, odd


def _minimum_eigenvalue(A: mp.matrix) -> mp.mpf | None:
    if A.rows == 0:
        return None
    values, _ = mp.eigsy(A)
    return values[0]


def _operator_norm_rectangular(C: mp.matrix) -> mp.mpf:
    if C.rows == 0 or C.cols == 0:
        return mp.mpf("0")
    values, _ = mp.eigsy(C.T * C)
    value = values[-1]
    if value < 0 and abs(value) < mp.eps * 100:
        value = mp.mpf("0")
    return mp.sqrt(value)


def shifted_window_block(
    shifted_operator: mp.matrix,
    low_basis: mp.matrix,
    occupied_prefix: mp.matrix,
    dps: int,
    forcing: mp.matrix | None = None,
) -> dict[str, object]:
    """Evaluate a deterministic low/high split after its basis is fixed."""
    occupied = _columns(
        [_matrix_column(occupied_prefix, j) for j in range(occupied_prefix.cols)]
        + [_matrix_column(low_basis, j) for j in range(low_basis.cols)]
    )
    high_basis = canonical_complement(occupied, shifted_operator.rows, dps)
    low_block = low_basis.T * shifted_operator * low_basis
    high_block = high_basis.T * shifted_operator * high_basis
    coupling = high_basis.T * shifted_operator * low_basis
    a = _minimum_eigenvalue(low_block)
    G = _minimum_eigenvalue(high_block)
    c = _operator_norm_rectangular(coupling)
    schur_scalar = None
    matrix_schur_lower_model = None
    matrix_schur_lower_floor = None
    exact_schur = None
    exact_schur_floor = None
    forcing_report = None
    if a is not None and G is not None and G > 0:
        schur_scalar = a - c * c / G
        # H>=G I implies H^(-1)<=G^(-1)I in Loewner order.  Retaining the
        # complete coupling Gram therefore gives the rigorous point lower
        # model
        #
        #   L-C^*H^(-1)C >= L-C^*C/G.
        #
        # This can remain positive even when the scalarized bound
        # lambda_min(L)-||C||^2/G is negative.
        matrix_schur_lower_model = low_block - coupling.T * coupling / G
        matrix_schur_lower_floor = _minimum_eigenvalue(matrix_schur_lower_model)
        high_inverse = mp.inverse(high_block)
        exact_schur = low_block - coupling.T * high_inverse * coupling
        exact_schur_floor = _minimum_eigenvalue(exact_schur)
        if forcing is not None:
            low_forcing = low_basis.T * forcing
            high_forcing = high_basis.T * forcing
            effective_low_forcing = (
                low_forcing - coupling.T * high_inverse * high_forcing
            )
            low_solution = mp.lu_solve(exact_schur, effective_low_forcing)
            high_solution = high_inverse * (high_forcing - coupling * low_solution)
            reconstructed_solution = low_basis * low_solution + high_basis * high_solution
            complement_basis = _columns(
                [_matrix_column(low_basis, j) for j in range(low_basis.cols)]
                + [_matrix_column(high_basis, j) for j in range(high_basis.cols)]
            )
            compressed_operator = complement_basis.T * shifted_operator * complement_basis
            compressed_forcing = complement_basis.T * forcing
            direct_solution = complement_basis * mp.lu_solve(
                compressed_operator, compressed_forcing
            )
            forcing_report = {
                "low_forcing": low_forcing,
                "high_forcing": high_forcing,
                "effective_low_forcing_after_high_elimination": effective_low_forcing,
                "low_solution": low_solution,
                "high_solution": high_solution,
                "low_solution_norm": _vector_norm(low_solution),
                "high_solution_norm": _vector_norm(high_solution),
                "full_solution_norm": _vector_norm(reconstructed_solution),
                "direct_compressed_complement_solve_norm": _vector_norm(direct_solution),
                "block_vs_direct_solution_defect": _vector_norm(
                    reconstructed_solution - direct_solution
                ),
            }
            if matrix_schur_lower_floor is not None and matrix_schur_lower_floor > 0:
                # Forced anisotropic Schur theorem with X=0, D=S_0, and the
                # exact point high solve z_0=H^(-1)y_H (so its residual e is
                # zero).  This is a point diagnostic; a certificate must
                # replace every quantity by an outward-rounded enclosure.
                model_values, model_vectors = mp.eigsy(matrix_schur_lower_model)
                model_inverse_root = (
                    model_vectors
                    * mp.diag(
                        [1 / mp.sqrt(model_values[i]) for i in range(model_values.rows)]
                    )
                    * model_vectors.T
                )
                high_particular = high_inverse * high_forcing
                effective_forcing_model = low_forcing - coupling.T * high_particular
                forcing_energy = _vector_norm(
                    model_inverse_root * effective_forcing_model
                )
                theta = _operator_norm_rectangular(coupling * model_inverse_root) / G
                high_particular_norm = _vector_norm(high_particular)
                forced_bound = mp.sqrt(
                    forcing_energy**2 / matrix_schur_lower_floor
                    + (high_particular_norm + theta * forcing_energy) ** 2
                )
                forcing_report["anisotropic_matrix_Schur_bound"] = {
                    "D": matrix_schur_lower_model,
                    "d": matrix_schur_lower_floor,
                    "high_particular_z0": high_particular,
                    "high_residual_e": mp.matrix(high_forcing.rows, 1),
                    "F": forcing_energy,
                    "Theta": theta,
                    "Z": high_particular_norm,
                    "T": forced_bound,
                    "choice": "X=0; D=low-C^T*C/G; z0=high^(-1)*y_high",
                }
    return {
        "low_block": low_block,
        "high_block": high_block,
        "low_high_coupling": coupling,
        "low_floor_a": a,
        "high_floor_G": G,
        "coupling_operator_norm_c": c,
        "schur_scalar_a_minus_c2_over_G": schur_scalar,
        "matrix_schur_lower_model": matrix_schur_lower_model,
        "matrix_schur_lower_floor": matrix_schur_lower_floor,
        "exact_point_schur_complement": exact_schur,
        "exact_point_schur_floor": exact_schur_floor,
        "forcing_report": forcing_report,
        "high_basis": high_basis,
        "basis_definition": "prolate_windows_then_twice_reorthogonalized_coordinate_vectors",
    }


def _parse_labels(text: str) -> list[int]:
    try:
        values = [int(part.strip()) for part in text.split(",") if part.strip()]
    except ValueError as exc:
        raise argparse.ArgumentTypeError("labels must be comma-separated integers") from exc
    if not values:
        raise argparse.ArgumentTypeError("at least one label is required")
    return values


def _serialize_real(value: mp.mpf | None, digits: int) -> str | None:
    return None if value is None else mp.nstr(value, digits)


def _serialize_vector(vector: mp.matrix, digits: int) -> list[str]:
    return [mp.nstr(vector[i], digits) for i in range(vector.rows)]


def _serialize_matrix(A: mp.matrix, digits: int) -> list[list[str]]:
    return [[mp.nstr(A[i, j], digits) for j in range(A.cols)] for i in range(A.rows)]


def _window_record(window: ProlateWindow, projection: dict[str, object], digits: int) -> dict:
    error_sq = projection["projection_error_sq_direct"]
    norm_sq = projection["continuous_norm_sq"]
    target_chi = compressed_fourier_eigenvalue(window.target)
    base_chi = compressed_fourier_eigenvalue(window.base)
    return {
        "family": window.family,
        "target_label": window.target.label,
        "base_label": window.base.label,
        "target_coefficient": _serialize_real(window.target_coefficient, digits),
        "finite_integral_ratio_base_coefficient": _serialize_real(window.base_coefficient, digits),
        "source_limit_base_coefficient": _serialize_real(
            window.source_limit_base_coefficient(), digits
        ),
        "zero_integral_defect": _serialize_real(window.integral(), digits),
        "finite_value_at_zero": _serialize_real(window.value_at_zero(), digits),
        "target_prolate_eigenvalue": _serialize_real(window.target.eigenvalue, digits),
        "base_prolate_eigenvalue": _serialize_real(window.base.eigenvalue, digits),
        "target_compressed_Fourier_eigenvalue_chi": _serialize_real(
            target_chi, digits
        ),
        "base_compressed_Fourier_eigenvalue_chi": _serialize_real(base_chi, digits),
        "target_additive_concentration_defect_1_minus_chi_squared": _serialize_real(
            1 - target_chi * target_chi, digits
        ),
        "base_additive_concentration_defect_1_minus_chi_squared": _serialize_real(
            1 - base_chi * base_chi, digits
        ),
        "sector_coordinates": _serialize_vector(projection["sector_coordinates"], digits),
        "scalar_fourier_coefficients": [
            _serialize_real(value, digits) for value in projection["scalar_fourier_coefficients"]
        ],
        "projected_norm": _serialize_real(mp.sqrt(projection["projected_norm_sq"]), digits),
        "continuous_norm": _serialize_real(mp.sqrt(norm_sq), digits) if norm_sq is not None else None,
        "projection_error_direct": (
            _serialize_real(mp.sqrt(error_sq), digits) if error_sq is not None and error_sq >= 0 else None
        ),
        "Gauss_Legendre_degree": projection["Gauss_Legendre_degree"],
        "Gauss_Legendre_nodes_per_piece": projection["Gauss_Legendre_nodes_per_piece"],
        "lower_degree_coefficient_disagreement_max_abs": _serialize_real(
            projection["lower_degree_coefficient_disagreement_max_abs"], digits
        ),
    }


def _correction_record(correction: CodimensionTwoCorrection, digits: int) -> dict:
    h_norm = _vector_norm(correction.h_coefficients)
    g_norm = _vector_norm(correction.g_coefficients)
    f_norm = _vector_norm(correction.f_coefficients)
    correction_norm = abs(correction.correction_scalar_c) * g_norm
    return {
        "definition": {
            "g_lambda": "h_(2,lambda) - [I_2/I_0] h_(0,lambda)",
            "c_lambda": "h_lambda(0)/g_lambda(0)",
            "f_lambda": "h_lambda-c_lambda*g_lambda",
            "I_n": "integral_R h_(n,lambda)(x) dx",
        },
        "a4": _serialize_real(correction.a4, digits),
        "a0_lambda": _serialize_real(correction.a0, digits),
        "h_integral_defect": _serialize_real(correction.h_integral(), digits),
        "g_integral_defect": _serialize_real(correction.g_integral(), digits),
        "f_integral_defect": _serialize_real(correction.f_integral(), digits),
        "h_value_at_zero": _serialize_real(correction.h(0), digits),
        "g_value_at_zero": _serialize_real(correction.g(0), digits),
        "f_value_at_zero_defect": _serialize_real(correction.f(0), digits),
        "correction_scalar_c": _serialize_real(correction.correction_scalar_c, digits),
        "correction_scalar_chi_formula": _serialize_real(
            correction.correction_scalar_chi_formula, digits
        ),
        "correction_scalar_formula_defect": _serialize_real(
            correction.correction_scalar_c - correction.correction_scalar_chi_formula,
            digits,
        ),
        "inferred_compressed_Fourier_eigenvalues": {
            str(label): _serialize_real(value, digits)
            for label, value in correction.inferred_chi.items()
        },
        "chi_identity": "I_n=(-1)^(n/2)*chi_n*h_(n,lambda)(0)",
        "chi_formula": (
            "c_lambda=a4*[h_(4,lambda)(0)/h_(2,lambda)(0)]"
            "*(chi_0-chi_4)/(chi_0+chi_2)"
        ),
        "h_L2_norm": _serialize_real(h_norm, digits),
        "g_L2_norm": _serialize_real(g_norm, digits),
        "f_L2_norm": _serialize_real(f_norm, digits),
        "correction_L2_norm": _serialize_real(correction_norm, digits),
        "correction_relative_to_h_L2": _serialize_real(correction_norm / h_norm, digits),
        "normalization_discipline": (
            "the locked P0 h_lambda is retained as h; f is a separately serialized correction"
        ),
    }


def _invisible_correction_record(
    correction: InvisibleCodimensionTwoCorrection, digits: int
) -> dict:
    # Numerical quadrature is only a replay of the exact scaling identity
    # integral(2 phi(2x)-phi(x))=0; the identity itself is the proof input.
    psi_integral_quadrature = mp.quad(
        compact_zero_integral_psi, [-1, mp.mpf("-0.5"), 0, mp.mpf("0.5"), 1]
    )
    psi_norm_sq = mp.quad(
        lambda x: compact_zero_integral_psi(x) ** 2,
        [-1, mp.mpf("-0.5"), 0, mp.mpf("0.5"), 1],
    )
    correction_norm = abs(correction.amplitude) * mp.sqrt(correction.scale_a * psi_norm_sq)
    sample_u = [1 / correction.lam, mp.mpf("1"), correction.lam]
    sample_values = [correction.bump_arithmetic_transform(u) for u in sample_u]
    return {
        "primary_status": "EXACT_STATE_PRESERVING_CORRECTION_IDENTITY",
        "phi_definition": (
            "phi(x)=exp(1-1/(1-x^2)) for |x|<1 and 0 otherwise"
        ),
        "psi_definition": "psi(x)=2phi(2x)-phi(x)",
        "psi_even": True,
        "psi_value_at_zero": _serialize_real(compact_zero_integral_psi(0), digits),
        "psi_integral_exact_identity": "2*(1/2)*integral(phi)-integral(phi)=0",
        "psi_integral_quadrature_audit": _serialize_real(psi_integral_quadrature, digits),
        "scale_a": _serialize_real(correction.scale_a, digits),
        "scale_choice": "a=1/(2lambda)",
        "support": "supp(psi_a) subset (-a,a)",
        "source_h_value_at_zero_amplitude": _serialize_real(correction.amplitude, digits),
        "corrected_function": "f_tilde=h_lambda-h_lambda(0)*psi_a",
        "corrected_value_at_zero_defect": _serialize_real(correction.f(0), digits),
        "corrected_integral_defect": _serialize_real(
            correction.source_h.h_integral(), digits
        ),
        "correction_L2_norm_quadrature": _serialize_real(correction_norm, digits),
        "arithmetic_invisibility_proof": (
            "for u in [1/lambda,lambda] and m>=1, m*u>=1/lambda=2a>a"
        ),
        "arithmetic_sample_u": [_serialize_real(u, digits) for u in sample_u],
        "arithmetic_bump_transform_samples": [
            _serialize_real(value, digits) for value in sample_values
        ],
        "maximum_possible_supported_terms_on_source_interval": 0,
        "consequence": (
            "E(f_tilde)=E(h_lambda) pointwise on [1/lambda,lambda], so J-evenization and P_N are unchanged exactly"
        ),
        "domain_caveat": (
            "this corrector supplies f(0)=integral(f)=0 without changing E on the source interval; the BV Mellin lemma applies, but the individual noncompact pole/archimedean/prime tail distributions still require separate regularization bounds"
        ),
    }


def analyze_prolate_windows(
    lambda_text: str,
    N: int,
    dps: int,
    prolate_basis_size: int,
    even_labels: Sequence[int] = (8, 12),
    odd_labels: Sequence[int] = (6, 10),
    direct_projection_error: bool = True,
    quadrature_crosscheck: bool = True,
) -> dict[str, object]:
    """Run a finite prolate-defined energy-window diagnostic."""
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam <= 1 or N < 1:
        raise ValueError("require lambda>1 and N>=1")
    even_labels = list(even_labels)
    odd_labels = list(odd_labels)
    if any(label < 8 or label % 4 for label in even_labels):
        raise ValueError("even-complement labels must be 8,12,16,...")
    if any(label < 6 or label % 4 != 2 for label in odd_labels):
        raise ValueError("odd-window labels must be 6,10,14,...")
    if len(even_labels) > N or len(odd_labels) > N:
        raise ValueError("too many windows for the finite parity sector")

    labels = {0, 2, 4, *even_labels, *odd_labels}
    modes = general_prolate_modes(lambda_text, labels, prolate_basis_size, dps)
    correction = codimension_two_correction(modes)
    invisible_correction = invisible_codimension_two_correction(correction)
    quadrature_correction = None
    quadrature_mode_disagreement = None
    if quadrature_crosscheck:
        quadrature_modes = general_prolate_modes(
            lambda_text, {0, 2, 4}, prolate_basis_size, dps, assembly="quadrature"
        )
        quadrature_correction = codimension_two_correction(quadrature_modes)
        quadrature_mode_disagreement = max(
            _max_abs(modes[label].coefficients - quadrature_modes[label].coefficients)
            for label in (0, 2, 4)
        )
    anchor_window = make_prolate_window(modes, "plus", 4)
    even_windows = [make_prolate_window(modes, "plus", label) for label in even_labels]
    odd_windows = [make_prolate_window(modes, "minus", label) for label in odd_labels]

    anchor_projection = project_prolate_window(
        anchor_window, N, "plus", direct_error=direct_projection_error
    )
    anchor_raw = anchor_projection["sector_coordinates"]
    anchor_norm = _vector_norm(anchor_raw)
    if anchor_norm == 0:
        raise ArithmeticError("projected comparison anchor is zero")
    kappa = anchor_raw / anchor_norm

    even_projection_records = [
        project_prolate_window(window, N, "plus", direct_error=direct_projection_error)
        for window in even_windows
    ]
    odd_projection_records = [
        project_prolate_window(window, N, "minus", direct_error=direct_projection_error)
        for window in odd_windows
    ]

    even_deflated_columns = []
    anchor_source_coordinates = prolate_window_mode_coordinates(anchor_window)
    even_deflated_source_coordinates: list[dict[int, mp.mpf]] = []
    for projection in even_projection_records:
        vector = projection["sector_coordinates"]
        even_deflated_columns.append(vector - kappa * _real_inner(kappa, vector))
    for window, projection in zip(even_windows, even_projection_records):
        vector = projection["sector_coordinates"]
        anchor_multiple = _real_inner(anchor_raw, vector) / (anchor_norm * anchor_norm)
        source_coordinates = prolate_window_mode_coordinates(window)
        even_deflated_source_coordinates.append(
            {
                label: source_coordinates.get(label, 0)
                - anchor_multiple * anchor_source_coordinates.get(label, 0)
                for label in set(source_coordinates).union(anchor_source_coordinates)
            }
        )
    even_raw = _columns(even_deflated_columns)
    odd_raw = _columns([record["sector_coordinates"] for record in odd_projection_records])
    even_gram = gram_orthonormalize(even_raw, dps)
    odd_gram = gram_orthonormalize(odd_raw, dps)
    even_low = even_gram["basis"]
    odd_low = odd_gram["basis"]

    # This positive model is fixed before Q is assembled.  In the raw source
    # window coordinates it is C^T diag(1-chi_n^2) C.  Congruence by the same
    # Gram inverse square root used for the finite state basis puts it in the
    # deterministic orthonormal low coordinates.
    even_concentration_raw = prolate_concentration_gram(
        modes, even_deflated_source_coordinates
    )
    odd_source_coordinates = [
        prolate_window_mode_coordinates(window) for window in odd_windows
    ]
    odd_concentration_raw = prolate_concentration_gram(modes, odd_source_coordinates)
    even_concentration_model = (
        even_gram["inverse_square_root"].T
        * even_concentration_raw
        * even_gram["inverse_square_root"]
    )
    odd_concentration_model = (
        odd_gram["inverse_square_root"].T
        * odd_concentration_raw
        * odd_gram["inverse_square_root"]
    )

    # Only now, after every low-window basis vector is fixed, assemble Q.
    modes_Q, prime_terms, pole, arch, prime, Q = blocks_split(lambda_text, N, dps)
    full_even, full_odd = sector_bases(N)
    Q_even = full_even.T * Q * full_even
    Q_odd = full_odd.T * Q * full_odd
    q = _real_inner(kappa, Q_even * kappa)
    b = Q_even * kappa - q * kappa
    residual_norm = _vector_norm(b)
    if residual_norm == 0:
        residual_direction_rayleigh = None
        shift_u = q
    else:
        residual_direction = b / residual_norm
        residual_direction_rayleigh = _real_inner(
            residual_direction, Q_even * residual_direction
        )
        shift_u = (
            q
            + residual_direction_rayleigh
            - mp.sqrt((residual_direction_rayleigh - q) ** 2 + 4 * residual_norm**2)
        ) / 2

    shifted_even = Q_even - shift_u * mp.eye(N + 1)
    shifted_odd = Q_odd - shift_u * mp.eye(N)
    even_block = shifted_window_block(
        shifted_even, even_low, _columns([kappa]), dps, forcing=b
    )
    odd_block = shifted_window_block(shifted_odd, odd_low, mp.matrix(N, 0), dps)
    even_relative_model = relative_positive_model_audit(
        even_block["exact_point_schur_complement"], even_concentration_model
    )
    odd_relative_model = relative_positive_model_audit(
        odd_block["exact_point_schur_complement"], odd_concentration_model
    )
    even_relative_lower_model = relative_positive_model_audit(
        even_block["matrix_schur_lower_model"], even_concentration_model
    )
    odd_relative_lower_model = relative_positive_model_audit(
        odd_block["matrix_schur_lower_model"], odd_concentration_model
    )
    if even_relative_model is not None and even_block["forcing_report"] is not None:
        effective_forcing = even_block["forcing_report"][
            "effective_low_forcing_after_high_elimination"
        ]
        model_inverse_forcing = mp.lu_solve(even_concentration_model, effective_forcing)
        center = even_relative_model["center_scalar"]
        center_model_solution = model_inverse_forcing / center if center != 0 else None
        even_relative_model["model_inverse_effective_forcing"] = model_inverse_forcing
        even_relative_model["center_scaled_model_solution"] = center_model_solution
        even_relative_model["center_scaled_model_solution_defect"] = (
            _vector_norm(
                center_model_solution - even_block["forcing_report"]["low_solution"]
            )
            if center_model_solution is not None
            else None
        )
    low_residual_couplings = even_low.T * b
    residual_capture_fraction = (
        _real_inner(low_residual_couplings, low_residual_couplings) / residual_norm**2
        if residual_norm > 0
        else mp.mpf("1")
    )

    # Algebraic audit against the existing P0 source combination.  The two
    # compactly supported functions differ only by the locked positive a4.
    source_anchor = source_combination(
        lambda_text, prolate_basis_size, dps, assembly="recurrence"
    )
    anchor_scale_defect = _max_abs(
        anchor_window.coefficients - source_anchor.coefficients / source_anchor.a4
    )

    def gram_record(record: dict[str, object]) -> dict[str, object]:
        return {
            "raw_gram": _serialize_matrix(record["gram"], dps),
            "gram_eigenvalues": _serialize_vector(record["gram_eigenvalues"], dps),
            "gram_condition_number": _serialize_real(record["gram_condition_number"], dps),
            "inverse_square_root": _serialize_matrix(record["inverse_square_root"], dps),
            "orthonormality_defect_max_abs": _serialize_real(
                record["orthonormality_defect_max_abs"], dps
            ),
        }

    def block_record(record: dict[str, object]) -> dict[str, object]:
        forcing = record["forcing_report"]
        return {
            "low_block": _serialize_matrix(record["low_block"], dps),
            "high_block": _serialize_matrix(record["high_block"], dps),
            "low_high_coupling": _serialize_matrix(record["low_high_coupling"], dps),
            "low_floor_a": _serialize_real(record["low_floor_a"], dps),
            "high_floor_G": _serialize_real(record["high_floor_G"], dps),
            "coupling_operator_norm_c": _serialize_real(
                record["coupling_operator_norm_c"], dps
            ),
            "schur_scalar_a_minus_c2_over_G": _serialize_real(
                record["schur_scalar_a_minus_c2_over_G"], dps
            ),
            "matrix_schur_lower_model_low_minus_CtC_over_G": (
                _serialize_matrix(record["matrix_schur_lower_model"], dps)
                if record["matrix_schur_lower_model"] is not None
                else None
            ),
            "matrix_schur_lower_floor": _serialize_real(
                record["matrix_schur_lower_floor"], dps
            ),
            "exact_point_schur_complement": (
                _serialize_matrix(record["exact_point_schur_complement"], dps)
                if record["exact_point_schur_complement"] is not None
                else None
            ),
            "exact_point_schur_floor": _serialize_real(
                record["exact_point_schur_floor"], dps
            ),
            "forcing_resolvent_decomposition": (
                {
                    "low_forcing": _serialize_vector(forcing["low_forcing"], dps),
                    "high_forcing": _serialize_vector(forcing["high_forcing"], dps),
                    "effective_low_forcing_after_high_elimination": _serialize_vector(
                        forcing["effective_low_forcing_after_high_elimination"], dps
                    ),
                    "low_solution": _serialize_vector(forcing["low_solution"], dps),
                    "high_solution": _serialize_vector(forcing["high_solution"], dps),
                    "low_solution_norm": _serialize_real(forcing["low_solution_norm"], dps),
                    "high_solution_norm": _serialize_real(forcing["high_solution_norm"], dps),
                    "full_solution_norm": _serialize_real(forcing["full_solution_norm"], dps),
                    "direct_compressed_complement_solve_norm": _serialize_real(
                        forcing["direct_compressed_complement_solve_norm"], dps
                    ),
                    "block_vs_direct_solution_defect": _serialize_real(
                        forcing["block_vs_direct_solution_defect"], dps
                    ),
                    "anisotropic_matrix_Schur_bound": (
                        {
                            "D": _serialize_matrix(
                                forcing["anisotropic_matrix_Schur_bound"]["D"], dps
                            ),
                            "d": _serialize_real(
                                forcing["anisotropic_matrix_Schur_bound"]["d"], dps
                            ),
                            "high_particular_z0": _serialize_vector(
                                forcing["anisotropic_matrix_Schur_bound"][
                                    "high_particular_z0"
                                ],
                                dps,
                            ),
                            "high_residual_e": _serialize_vector(
                                forcing["anisotropic_matrix_Schur_bound"][
                                    "high_residual_e"
                                ],
                                dps,
                            ),
                            "F": _serialize_real(
                                forcing["anisotropic_matrix_Schur_bound"]["F"], dps
                            ),
                            "Theta": _serialize_real(
                                forcing["anisotropic_matrix_Schur_bound"]["Theta"],
                                dps,
                            ),
                            "Z": _serialize_real(
                                forcing["anisotropic_matrix_Schur_bound"]["Z"], dps
                            ),
                            "T": _serialize_real(
                                forcing["anisotropic_matrix_Schur_bound"]["T"], dps
                            ),
                            "choice": forcing["anisotropic_matrix_Schur_bound"][
                                "choice"
                            ],
                            "claim_scope": (
                                "finite arbitrary-precision point bound; not an interval enclosure"
                            ),
                        }
                        if "anisotropic_matrix_Schur_bound" in forcing
                        else None
                    ),
                }
                if forcing is not None
                else None
            ),
            "basis_definition": record["basis_definition"],
        }

    def concentration_model_record(
        raw_model: mp.matrix,
        orthonormal_model: mp.matrix,
        relative_audit: dict[str, object] | None,
        lower_relative_audit: dict[str, object] | None,
    ) -> dict[str, object]:
        model_values, _ = mp.eigsy(orthonormal_model)
        record: dict[str, object] = {
            "raw_source_window_Gram": _serialize_matrix(raw_model, dps),
            "orthonormal_low_basis_model": _serialize_matrix(orthonormal_model, dps),
            "orthonormal_low_basis_model_eigenvalues": _serialize_vector(
                model_values, dps
            ),
            "construction": (
                "C^T diag(1-chi_n^2) C, followed by the same source-state Gram congruence; assembled before Q"
            ),
            "Weil_eigenvectors_used": False,
            "point_relative_audit": None,
            "point_relative_audit_matrix_Schur_lower_model": None,
        }
        if relative_audit is not None:
            relative_record: dict[str, object] = {
                "operator": "D^(-1/2) S D^(-1/2)",
                "S": "exact point low Schur complement after deterministic high elimination",
                "relative_operator": _serialize_matrix(
                    relative_audit["relative_operator"], dps
                ),
                "relative_eigenvalues": _serialize_vector(
                    relative_audit["relative_eigenvalues"], dps
                ),
                "center_scalar": _serialize_real(
                    relative_audit["center_scalar"], dps
                ),
                "relative_radius_about_center": _serialize_real(
                    relative_audit["relative_radius_about_center"], dps
                ),
                "claim_scope": (
                    "finite arbitrary-precision point comparison only; not an interval or uniform estimate"
                ),
            }
            if "model_inverse_effective_forcing" in relative_audit:
                relative_record.update(
                    {
                        "model_inverse_effective_forcing": _serialize_vector(
                            relative_audit["model_inverse_effective_forcing"], dps
                        ),
                        "model_inverse_effective_forcing_norm": _serialize_real(
                            _vector_norm(
                                relative_audit["model_inverse_effective_forcing"]
                            ),
                            dps,
                        ),
                        "center_scaled_model_solution": _serialize_vector(
                            relative_audit["center_scaled_model_solution"], dps
                        ),
                        "center_scaled_model_solution_norm": _serialize_real(
                            _vector_norm(
                                relative_audit["center_scaled_model_solution"]
                            ),
                            dps,
                        ),
                        "center_scaled_model_solution_defect_from_exact_low_solution": _serialize_real(
                            relative_audit[
                                "center_scaled_model_solution_defect"
                            ],
                            dps,
                        ),
                    }
                )
            record["point_relative_audit"] = relative_record
        if lower_relative_audit is not None:
            record["point_relative_audit_matrix_Schur_lower_model"] = {
                "operator": "D^(-1/2) S_0 D^(-1/2)",
                "S_0": "low-C^T*C/G matrix lower model",
                "relative_operator": _serialize_matrix(
                    lower_relative_audit["relative_operator"], dps
                ),
                "relative_eigenvalues": _serialize_vector(
                    lower_relative_audit["relative_eigenvalues"], dps
                ),
                "center_scalar": _serialize_real(
                    lower_relative_audit["center_scalar"], dps
                ),
                "relative_radius_about_center": _serialize_real(
                    lower_relative_audit["relative_radius_about_center"], dps
                ),
                "claim_scope": (
                    "finite arbitrary-precision point comparison only; not an interval or uniform estimate"
                ),
            }
        return record

    return {
        "terminal_state": "P0_INVALIDATED",
        "claim_class": "FINITE_NONCERTIFIED_PROLATE_WINDOW_DIAGNOSTIC_ONLY",
        "analytic_uniform_claim": False,
        "source_pins": SOURCE_PINS,
        "inputs": {
            "lambda": lambda_text,
            "N": N,
            "precision_decimal_digits": dps,
            "prolate_even_legendre_basis_size": prolate_basis_size,
            "even_complement_target_labels": even_labels,
            "odd_target_labels": odd_labels,
            "modes": modes_Q,
            "prime_power_terms": [
                {"n": n, "Lambda": _serialize_real(value, dps)} for n, value in prime_terms
            ],
        },
        "normalizations": {
            "prolate_modes": (
                "L2([-lambda,lambda],dx) unit norm; sign matches locked normalized Hermite h_n(0)"
            ),
            "plus_window": (
                "h_(4ell,lambda) - [integral h_(4ell,lambda)/integral h_(0,lambda)] h_(0,lambda)"
            ),
            "minus_window": (
                "-h_(4ell+2,lambda) + [integral h_(4ell+2,lambda)/integral h_(2,lambda)] h_(2,lambda)"
            ),
            "minus_meaning": "Fourier-sign-minus family; every input function is spatially even",
            "arithmetic_transform": "E(f)(u)=sqrt(u) sum_(m>=1) f(m*u)",
            "logarithmic_domain": "u=exp(t)/lambda, 0<=t<=2log(lambda)",
            "inversion": "Jk(t)=k(2log(lambda)-t), applied explicitly",
            "plus_projection": "(E(f)+J E(f))/2, cosine Fourier coordinates",
            "minus_projection": "(E(f)-J E(f))/2, sine coordinates with a global phase i",
            "Fourier_mode_sign": "U_n(t)=exp(+2*pi*i*n*t/L)/sqrt(L)",
            "Gram_orthonormalization": "symmetric G^(-1/2) using G=W^T W",
            "even_complement_deflation": "ordinary L2 deflation (I-kappa kappa^T) before Gram",
        },
        "codimension_two_invisible_correction": _invisible_correction_record(
            invisible_correction, dps
        ),
        "optional_prolate_h2_codimension_two_crosscheck": {
            "recurrence_assembly": _correction_record(correction, dps),
            "quadrature_assembly": (
                _correction_record(quadrature_correction, dps)
                if quadrature_correction is not None
                else None
            ),
            "recurrence_quadrature_mode_coefficient_disagreement_max_abs": _serialize_real(
                quadrature_mode_disagreement, dps
            ),
            "role": (
                "optional prolate cross-check; the invisible bump is primary because it leaves E(h_lambda) unchanged exactly"
            ),
        },
        "anchor": {
            "window": _window_record(anchor_window, anchor_projection, dps),
            "kappa_sector_coordinates": _serialize_vector(kappa, dps),
            "source_combination_divided_by_a4_coefficient_defect_max_abs": _serialize_real(
                anchor_scale_defect, dps
            ),
            "q": _serialize_real(q, dps),
            "combined_residual_norm": _serialize_real(residual_norm, dps),
            "residual_direction_rayleigh_c": _serialize_real(
                residual_direction_rayleigh, dps
            ),
            "two_dimensional_ritz_shift_u": _serialize_real(shift_u, dps),
        },
        "even_windows": [
            _window_record(window, projection, dps)
            for window, projection in zip(even_windows, even_projection_records)
        ],
        "odd_windows": [
            _window_record(window, projection, dps)
            for window, projection in zip(odd_windows, odd_projection_records)
        ],
        "even_Gram_audit": gram_record(even_gram),
        "odd_Gram_audit": gram_record(odd_gram),
        "shifted_even_window_decomposition": block_record(even_block),
        "shifted_odd_window_decomposition": block_record(odd_block),
        "even_additive_concentration_model": concentration_model_record(
            even_concentration_raw,
            even_concentration_model,
            even_relative_model,
            even_relative_lower_model,
        ),
        "odd_additive_concentration_model": concentration_model_record(
            odd_concentration_raw,
            odd_concentration_model,
            odd_relative_model,
            odd_relative_lower_model,
        ),
        "anchor_to_even_window_couplings": _serialize_vector(low_residual_couplings, dps),
        "combined_residual_squared_fraction_in_selected_even_windows": _serialize_real(
            residual_capture_fraction, dps
        ),
        "assembly_discipline": {
            "prolate_low_basis_fixed_before_Weil_assembly": True,
            "Weil_eigenvectors_used_to_define_basis": False,
            "Weil_matrix_path": "source closed pole/archimedean/prime formulas via blocks_split",
            "high_basis": (
                "twice-reorthogonalized canonical coordinate vectors after fixed prolate windows"
            ),
        },
        "limitations": [
            "All values are arbitrary-precision point diagnostics, not intervals or balls.",
            "The finite integral-ratio deformation is explicit and has the source equation (29) as its fixed-index limit, but it is not asserted by the source as an asymptotic uniform in growing labels.",
            "The selected windows do not control all fixed or transition prolate indices on an unbounded schedule.",
            "The additive concentration-defect Gram is a positive comparison model, not an identity with the signed Weil Schur complement.",
            "The displayed relative spectra use the point high-block inverse and therefore do not certify a Schur complement.",
            "A positive low block or Schur scalar at finitely many points would not prove an asymptotic coercivity estimate.",
            "The prolate Galerkin eigenfunctions are not infinite-dimensional enclosures.",
            "The recurrence/quadrature prolate cross-check covers labels 0,2,4; the higher pilot windows use the recurrence assembly only.",
            "The prolate and Weil computations share mpmath in this diagnostic.",
            "No Weil positivity, zeta-zero list, RH conclusion, or determinant-convergence claim is used.",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lambda", dest="lambda_text", required=True)
    parser.add_argument("--N", type=int, required=True)
    parser.add_argument("--dps", type=int, default=35)
    parser.add_argument("--prolate-basis-size", type=int, default=30)
    parser.add_argument("--even-labels", type=_parse_labels, default=[8, 12])
    parser.add_argument("--odd-labels", type=_parse_labels, default=[6, 10])
    parser.add_argument("--skip-direct-projection-error", action="store_true")
    parser.add_argument("--skip-quadrature-crosscheck", action="store_true")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = analyze_prolate_windows(
        args.lambda_text,
        args.N,
        args.dps,
        args.prolate_basis_size,
        even_labels=args.even_labels,
        odd_labels=args.odd_labels,
        direct_projection_error=not args.skip_direct_projection_error,
        quadrature_crosscheck=not args.skip_quadrature_crosscheck,
    )
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text)
    print(text, end="")


if __name__ == "__main__":
    main()
