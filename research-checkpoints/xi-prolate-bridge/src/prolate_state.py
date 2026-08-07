#!/usr/bin/env python3
"""Source-normalized finite prolate comparison state.

The binding definitions are CCM arXiv:2511.22755v1 (7.5)--(7.12).
After x=lambda*z the even prolate operator is

  -d/dz ((1-z^2)d/dz) + (2*pi*lambda^2)^2 z^2,  -1 <= z <= 1.

We diagonalize its Rayleigh--Ritz matrix in the orthonormal even Legendre
basis.  Finite truncations are diagnostics; convergence is checked by a
second truncation and an independently assembled quadrature matrix.
"""
from __future__ import annotations

from dataclasses import dataclass
from functools import cached_property
import mpmath as mp

from weil_matrix import decimal_square_floor, parse_decimal, require_source_normalization


def _z_up(l: int) -> mp.mpf:
    """Coefficient of normalized P_{l+1} in z times normalized P_l."""
    return mp.mpf(l + 1) / mp.sqrt((2*l + 1)*(2*l + 3))


def _z_down(l: int) -> mp.mpf:
    return mp.mpf('0') if l == 0 else mp.mpf(l) / mp.sqrt((2*l - 1)*(2*l + 1))


def prolate_matrix_recurrence(lambda_text: str, basis_size: int, dps: int) -> mp.matrix:
    """Even-sector Galerkin matrix from the exact Legendre recurrence."""
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam <= 1 or basis_size < 3:
        raise ValueError("require lambda>1 and even Legendre basis_size>=3")
    c = 2*mp.pi*lam**2
    A = mp.matrix(basis_size)
    for i in range(basis_size):
        l = 2*i
        A[i, i] = l*(l+1) + c**2*(_z_up(l)**2 + _z_down(l)**2)
        if i+1 < basis_size:
            value = c**2*_z_up(l)*_z_up(l+1)
            A[i, i+1] = value
            A[i+1, i] = value
    return A


def _legendre_values(z: mp.mpf, max_degree: int) -> list[mp.mpf]:
    values = [mp.mpf('1')]
    if max_degree == 0:
        return values
    values.append(z)
    for l in range(1, max_degree):
        values.append(((2*l+1)*z*values[l]-l*values[l-1])/(l+1))
    return values


def normalized_even_basis_values(z: mp.mpf, basis_size: int) -> list[mp.mpf]:
    p = _legendre_values(z, 2*(basis_size-1))
    return [mp.sqrt(mp.mpf(4*i+1)/2)*p[2*i] for i in range(basis_size)]


def prolate_matrix_quadrature(lambda_text: str, basis_size: int, dps: int) -> mp.matrix:
    """Independent reconstruction using source differential form integrals.

    This deliberately does not call the z^2 recurrence used by the producer.
    """
    mp.mp.dps = dps
    lam = parse_decimal(lambda_text)
    if lam <= 1 or basis_size < 3:
        raise ValueError("require lambda>1 and even Legendre basis_size>=3")
    c = 2*mp.pi*lam**2
    A = mp.matrix(basis_size)
    for i in range(basis_size):
        li = 2*i
        # The differential term is diagonal in Legendre degree and z^2 has
        # degree two, so orthogonality makes entries with |i-j|>1 exactly 0.
        for j in range(i, min(basis_size, i+2)):
            lj = 2*j
            potential = c**2*mp.quad(
                lambda z: z*z*normalized_even_basis_values(z, basis_size)[i]
                          *normalized_even_basis_values(z, basis_size)[j],
                [-1, 0, 1],
            )
            value = potential + (li*(li+1) if i == j else 0)
            A[i,j] = value
            A[j,i] = value
    return A


def _value_at_zero(coefficients: mp.matrix) -> mp.mpf:
    basis = normalized_even_basis_values(mp.mpf('0'), coefficients.rows)
    return mp.fsum(coefficients[i]*basis[i] for i in range(coefficients.rows))


@dataclass
class ProlateEigenfunction:
    lambda_text: str
    label: int
    eigenvalue: mp.mpf
    coefficients: mp.matrix
    dps: int

    @cached_property
    def lam(self) -> mp.mpf:
        return parse_decimal(self.lambda_text)

    def __call__(self, x: mp.mpf) -> mp.mpf:
        x = mp.mpf(x)
        if abs(x) > self.lam:
            return mp.mpf('0')
        basis = normalized_even_basis_values(x/self.lam, self.coefficients.rows)
        # lambda^{-1/2} converts unit norm in dz to unit norm in dx.
        return mp.fsum(self.coefficients[i]*basis[i] for i in range(self.coefficients.rows))/mp.sqrt(self.lam)

    def integral(self) -> mp.mpf:
        # Only normalized P_0 has nonzero integral on [-1,1].
        return mp.sqrt(2*self.lam)*self.coefficients[0]


def prolate_eigenfunction(
    lambda_text: str,
    label: int,
    basis_size: int,
    dps: int,
    assembly: str = "recurrence",
) -> ProlateEigenfunction:
    require_source_normalization("source_limit_h")
    if label not in (0, 4):
        raise ValueError("P0 only permits source labels 0 and 4")
    matrix = (prolate_matrix_recurrence if assembly == "recurrence" else prolate_matrix_quadrature)(
        lambda_text, basis_size, dps
    )
    eigenvalues, eigenvectors = mp.eigsy(matrix)
    column = label//2  # even-sector ordering: labels 0,2,4,...
    coeff = mp.matrix([eigenvectors[i,column] for i in range(basis_size)])
    if _value_at_zero(coeff) < 0:
        coeff = -coeff
    return ProlateEigenfunction(lambda_text, label, eigenvalues[column], coeff, dps)


@dataclass
class ProlateCombination:
    h0: ProlateEigenfunction
    h4: ProlateEigenfunction
    a4: mp.mpf
    a0: mp.mpf

    @property
    def lambda_text(self) -> str:
        return self.h0.lambda_text

    @cached_property
    def lam(self) -> mp.mpf:
        return self.h0.lam

    @cached_property
    def coefficients(self) -> mp.matrix:
        return self.a4*self.h4.coefficients-self.a0*self.h0.coefficients

    def __call__(self, x: mp.mpf) -> mp.mpf:
        x=mp.mpf(x)
        if abs(x)>self.lam:
            return mp.mpf('0')
        values=normalized_even_basis_values(x/self.lam,self.coefficients.rows)
        return mp.fsum(self.coefficients[i]*values[i] for i in range(self.coefficients.rows))/mp.sqrt(self.lam)

    def integral(self) -> mp.mpf:
        return self.a4*self.h4.integral()-self.a0*self.h0.integral()


def source_combination(
    lambda_text: str,
    basis_size: int,
    dps: int,
    assembly: str = "recurrence",
) -> ProlateCombination:
    h0 = prolate_eigenfunction(lambda_text, 0, basis_size, dps, assembly)
    h4 = prolate_eigenfunction(lambda_text, 4, basis_size, dps, assembly)
    a4 = mp.sqrt(3)/mp.power(2, mp.mpf(11)/4)
    a0 = a4*h4.integral()/h0.integral()
    return ProlateCombination(h0, h4, a4, a0)


def hermite_limit_h(x: mp.mpf) -> mp.mpf:
    x = mp.mpf(x)
    return mp.pi*x*x*(2*mp.pi*x*x-3)*mp.exp(-mp.pi*x*x)/2


def locked_h_positive_mellin(s: mp.mpc) -> mp.mpc:
    """Exact Mellin transform integral_0^inf h(x)x^(s-1)dx.

    The factor 1/8 is important: together with zeta(s), the locked source
    formulas yield completed_xi(s)/4, exposing a factor-four inconsistency in
    CCM-ZST-v1 Lemma 7.1 as printed.
    """
    s=mp.mpc(s)
    return s*(s-1)*mp.power(mp.pi,-s/2)*mp.gamma(s/2)/8


def completed_xi(s: mp.mpc) -> mp.mpc:
    s=mp.mpc(s)
    return s*(s-1)*mp.power(mp.pi,-s/2)*mp.gamma(s/2)*mp.zeta(s)/2


def locked_limit_transform(z: mp.mpc) -> mp.mpc:
    s=mp.mpf('0.5')-1j*mp.mpc(z)
    return mp.zeta(s)*locked_h_positive_mellin(s)


def arithmetic_transform(h: ProlateCombination, u: mp.mpf) -> mp.mpf:
    """E(h)(u), with source zero extension and no assumed J parity."""
    u = mp.mpf(u)
    if u <= 0:
        raise ValueError("u must be positive")
    count = int(mp.floor(h.lam/u))
    return mp.sqrt(u)*mp.fsum(h(m*u) for m in range(1, count+1))


def arithmetic_transform_even(h: ProlateCombination, u: mp.mpf) -> mp.mpf:
    return (arithmetic_transform(h,u)+arithmetic_transform(h,1/u))/2


def logarithmic_breakpoints(lambda_text: str) -> list[mp.mpf]:
    """Arithmetic discontinuities of ``k_lambda^+`` in logarithmic coordinates.

    Put ``u=exp(t)/lambda`` on ``0 <= t <= L=2 log(lambda)``.  The
    ``E(h)(u)`` summation changes at ``t=log(lambda^2/m)``, while its inversion
    reflection ``E(h)(1/u)`` changes at ``t=log(m)``.  Both families are
    required: except in special cases they are not the same finite set.
    """
    lam = parse_decimal(lambda_text)
    L = 2*mp.log(lam)
    # The cutoff is evaluated in exact decimal arithmetic; using
    # floor(mpf(lambda)**2) can lose or invent the final integer at finite dps.
    bound = decimal_square_floor(lambda_text)
    pts = {mp.mpf('0'), L}
    for m in range(1,bound+1):
        reflected = mp.log(m)
        forward = L-reflected  # exactly log(lambda^2/m), symmetry-preserving
        if 0 < reflected < L:
            pts.add(reflected)
        if 0 < forward < L:
            pts.add(forward)
    return sorted(pts)


def projected_even_state(h: ProlateCombination, N: int) -> dict[str, object]:
    """Project ``k_lambda^+`` into ``E_N`` and integrate the residual directly.

    The locked logarithmic basis is

      ``U_n(t) = exp(+2*pi*i*n*t/L)/sqrt(L)``.

    Thus its coefficient is obtained with the conjugate (negative) Fourier
    sign.  Inversion evenness ``k(t)=k(L-t)`` and reality make the coefficients
    real, so the implementation uses the equivalent cosine integral.  The
    projection error is the piecewise integral of ``|k-P_N k|^2`` itself;
    ``||k||^2-||P_N k||^2`` is retained only as a diagnostic cross-check because
    that subtraction loses all meaningful digits when the tail is small.
    """
    if N < 0:
        raise ValueError("N must be nonnegative")
    lam = h.lam
    L = 2*mp.log(lam)
    points = logarithmic_breakpoints(h.lambda_text)
    def kp_t(t):
        return arithmetic_transform_even(h, mp.exp(t)/lam)
    coeff_nonnegative = []
    for n in range(N+1):
        integrand = lambda t, n=n: kp_t(t)*mp.cos(2*mp.pi*n*t/L)/mp.sqrt(L)
        coeff_nonnegative.append(mp.fsum(mp.quad(integrand,[a,b]) for a,b in zip(points[:-1],points[1:])))

    def projected_t(t):
        # c_{-n}=c_n is real, hence the paired positive/negative modes give
        # 2*c_n*cos(2*pi*n*t/L).  This is exactly the positive-sign U_n basis;
        # no Fourier-sign convention is changed by the cosine simplification.
        paired_modes = mp.fsum(
            2*coeff_nonnegative[n]*mp.cos(2*mp.pi*n*t/L)
            for n in range(1,N+1)
        )
        return (coeff_nonnegative[0]+paired_modes)/mp.sqrt(L)

    direct_error_sq = mp.fsum(
        mp.quad(lambda t: (kp_t(t)-projected_t(t))**2,[a,b])
        for a,b in zip(points[:-1],points[1:])
    )
    if direct_error_sq <= 0:
        raise ArithmeticError("direct projection-error square is nonpositive; increase dps")

    norm_sq = mp.fsum(mp.quad(lambda t: kp_t(t)**2,[a,b]) for a,b in zip(points[:-1],points[1:]))
    projected_norm_sq = coeff_nonnegative[0]**2 + 2*mp.fsum(c*c for c in coeff_nonnegative[1:])
    parseval_error_sq = norm_sq-projected_norm_sq
    parseval_error = mp.sqrt(parseval_error_sq) if parseval_error_sq > 0 else None
    direct_error = mp.sqrt(direct_error_sq)
    vector = mp.matrix([coeff_nonnegative[abs(n)] for n in range(-N,N+1)])
    projected_norm = mp.sqrt(projected_norm_sq)
    if projected_norm == 0:
        raise ArithmeticError("projected prolate state is zero")
    return {
        "coefficients": vector,
        "kappa": vector/projected_norm,
        "state_norm": mp.sqrt(norm_sq),
        "projected_norm": projected_norm,
        "projection_error": direct_error,
        "projection_error_method": "direct_residual_quadrature",
        "projection_error_parseval_crosscheck": parseval_error,
        "projection_error_parseval_error_sq": parseval_error_sq,
        "projection_error_squared_crosscheck_discrepancy": direct_error_sq-parseval_error_sq,
        "projection_error_crosscheck_discrepancy": (
            abs(direct_error-parseval_error) if parseval_error is not None else None
        ),
        "breakpoints": points,
    }
