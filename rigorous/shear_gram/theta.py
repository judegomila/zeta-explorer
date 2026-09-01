"""Cancellation-preserving theta evaluation of the shifted Riemann Xi function.

The completed-zeta evaluator in :mod:`rigorous.shear_gram.xi` is excellent for
ordinary point evaluation, but the de Branges numerator is a difference of two
order-one quantities whose signal is order ``a``.  This module instead computes

``A_a(z)`` and ``C_a(z) = B_a(z) / a``

directly from Riemann's theta kernel.  In particular, it never obtains ``C`` by
subtracting ``Xi(z-i*a)`` and ``Xi(z+i*a)``.  Every omitted part of the theta
integral is covered by an explicit nonnegative Arb bound.

The result is still a pointwise, finite numerical enclosure.  It does not make
an RH claim and is not, by itself, a global positivity proof.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from flint import acb, arb, ctx, fmpq

from .errors import NonFiniteError, ShearGramError
from .exact import canonical_rational
from .xi import E_a as completed_E_a
from .xi import E_sharp_a as completed_E_sharp_a

_I = acb(0, 1)
_THREE_HALVES = fmpq(3, 2)
_TAIL_EPSILON = fmpq(1)
_MAX_THETA_TERMS = 4096
_MAX_CUTOFF_U = fmpq(32)
_INTEGRAL_DEG_LIMIT = 256
_INTEGRAL_EVAL_LIMIT = 100_000
_INTEGRAL_DEPTH_LIMIT = 30


class ThetaInputError(ShearGramError, ValueError):
    """An input is not an exact, bounded theta-evaluator parameter."""


class ThetaEvaluationError(ShearGramError):
    """A rigorous theta evaluation could not be completed."""


def _arb_record(value: arb, precision_bits: int) -> dict[str, str]:
    digits = max(25, int(precision_bits * 0.30103) + 12)
    return {
        "ball": value.str(digits, radius=True, more=True),
        "lowerEnclosure": value.lower().str(digits, radius=True, more=True),
        "upperEnclosure": value.upper().str(digits, radius=True, more=True),
    }


def _acb_record(value: acb, precision_bits: int) -> dict[str, Any]:
    return {
        "real": _arb_record(value.real, precision_bits),
        "imag": _arb_record(value.imag, precision_bits),
    }


@dataclass(frozen=True)
class ThetaTailBound:
    """Explicit tail split for one theta component.

    ``retained_u`` bounds terms ``1 <= n <= N`` on ``[U, infinity)``.
    ``omitted_n`` bounds every term ``n > N`` on ``[0, infinity)``.  These
    regions are disjoint from the numerically integrated rectangle
    ``1 <= n <= N, 0 <= u <= U`` and together cover its complement.
    """

    q: arb
    retained_u: arb
    omitted_n: arb
    total: arb
    epsilon: fmpq | None = None

    def as_record(self, precision_bits: int) -> dict[str, Any]:
        record: dict[str, Any] = {
            # For B/a this is the majorant exponent q+epsilon, not the
            # physical q=2(a+|Im z|), which is recorded on ThetaComponents.
            "boundExponentQ": _arb_record(self.q, precision_bits),
            "retainedTermsUTail": _arb_record(self.retained_u, precision_bits),
            "omittedThetaTermsAllU": _arb_record(
                self.omitted_n, precision_bits
            ),
            "total": _arb_record(self.total, precision_bits),
        }
        if self.epsilon is not None:
            record["epsilon"] = canonical_rational(self.epsilon)
        return record


@dataclass(frozen=True)
class ThetaComponents:
    r"""Rigorous enclosures of ``A_a`` and ``C_a=B_a/a``.

    The stored ``A_integral`` and ``B_over_a_integral`` contain only the
    rigorously integrated finite ``(n,u)`` rectangle.  ``A`` and ``B_over_a``
    additionally include the explicit tail errors.
    """

    z_real: fmpq
    z_imag: fmpq
    a: fmpq
    cutoff_u: fmpq
    theta_terms: int
    precision_bits: int
    beta: fmpq
    q: fmpq
    A_integral: acb
    B_over_a_integral: acb
    A_tail: ThetaTailBound
    B_over_a_tail: ThetaTailBound
    A: acb
    B_over_a: acb
    E: acb
    E_sharp: acb

    def as_record(self, precision_bits: int | None = None) -> dict[str, Any]:
        bits = self.precision_bits if precision_bits is None else precision_bits
        return {
            "normalization": (
                "Xi(z)=8*integral_0^infinity Phi(u)*cos(2*z*u)du"
            ),
            "components": (
                "E_a(z)=A_a(z)-i*a*C_a(z); "
                "E_a#(z)=A_a(z)+i*a*C_a(z); C_a=B_a/a"
            ),
            "precisionBits": bits,
            "node": {
                "re": canonical_rational(self.z_real),
                "im": canonical_rational(self.z_imag),
            },
            "a": canonical_rational(self.a),
            "beta": canonical_rational(self.beta),
            "q": canonical_rational(self.q),
            "cutoffU": canonical_rational(self.cutoff_u),
            "thetaTerms": self.theta_terms,
            "finiteRectangle": {
                "A": _acb_record(self.A_integral, bits),
                "BOverA": _acb_record(self.B_over_a_integral, bits),
            },
            "tails": {
                "A": self.A_tail.as_record(bits),
                "BOverA": self.B_over_a_tail.as_record(bits),
            },
            "enclosures": {
                "A": _acb_record(self.A, bits),
                "BOverA": _acb_record(self.B_over_a, bits),
                "E": _acb_record(self.E, bits),
                "Esharp": _acb_record(self.E_sharp, bits),
            },
            "finitePointwiseOnly": True,
            "rhClaim": False,
            "rhSolved": False,
            "claimComplete": False,
        }


@dataclass(frozen=True)
class ThetaCrosscheckResult:
    """Independent overlap test against completed-zeta Xi evaluation."""

    performed: bool
    overlap: bool
    reason: str
    E_overlap: bool = False
    E_sharp_overlap: bool = False
    components: ThetaComponents | None = None
    completed_E: acb | None = None
    completed_E_sharp: acb | None = None
    used_for_verdict: bool = False

    def as_record(self, precision_bits: int | None = None) -> dict[str, Any]:
        bits = int(ctx.prec) if precision_bits is None else precision_bits
        record: dict[str, Any] = {
            "performed": self.performed,
            "overlap": self.overlap,
            "EOverlap": self.E_overlap,
            "EsharpOverlap": self.E_sharp_overlap,
            "reason": self.reason,
            "usedForVerdict": self.used_for_verdict,
            "finitePointwiseOnly": True,
            "rhClaim": False,
            "rhSolved": False,
            "claimComplete": False,
        }
        if self.components is not None:
            record["theta"] = self.components.as_record(bits)
        if self.completed_E is not None and self.completed_E_sharp is not None:
            record["completedXi"] = {
                "E": _acb_record(self.completed_E, bits),
                "Esharp": _acb_record(self.completed_E_sharp, bits),
            }
        return record


def _validate_exact_inputs(
    z_real: fmpq,
    z_imag: fmpq,
    a: fmpq,
    cutoff_u: fmpq,
    theta_terms: int,
) -> None:
    for name, value in (
        ("z_real", z_real),
        ("z_imag", z_imag),
        ("a", a),
        ("cutoff_u", cutoff_u),
    ):
        if not isinstance(value, fmpq):
            raise ThetaInputError(f"{name} must be flint.fmpq")
    if a < 0:
        raise ThetaInputError("a must be nonnegative")
    if cutoff_u <= 0 or cutoff_u > _MAX_CUTOFF_U:
        raise ThetaInputError(
            f"cutoff_u must lie in (0,{canonical_rational(_MAX_CUTOFF_U)}]"
        )
    if type(theta_terms) is not int or not (1 <= theta_terms <= _MAX_THETA_TERMS):
        raise ThetaInputError(
            f"theta_terms must be an integer in [1,{_MAX_THETA_TERMS}]"
        )


def _require_finite_acb(value: acb, stage: str) -> acb:
    if not isinstance(value, acb) or not value.is_finite():
        raise NonFiniteError(stage)
    return value


def _require_nonnegative_finite_arb(value: arb, stage: str) -> arb:
    if not isinstance(value, arb) or not value.is_finite():
        raise NonFiniteError(stage)
    if value.lower() < 0:
        raise ThetaEvaluationError(f"negative tail enclosure at {stage}")
    return value


def _phi_truncated(u: acb, theta_terms: int) -> acb:
    r"""Return ``sum_{n=1}^N Phi_n(u)`` using ACB arithmetic."""

    pi = acb.pi()
    exp_4u = (4 * u).exp()
    exp_5u = (5 * u).exp()
    exp_9u = (9 * u).exp()
    result = acb(0)
    for n in range(1, theta_terms + 1):
        n2 = n * n
        result += (
            2 * pi * pi * n2 * n2 * exp_9u - 3 * pi * n2 * exp_5u
        ) * (-pi * n2 * exp_4u).exp()
    return result


def _single_A_tail(q: arb, n: int, cutoff_u: arb) -> arb:
    r"""Explicit ``n``-term A-tail ``F_n(q,U)``.

    .. math::
       F_n(q,U)=4\pi^2n^4(\pi n^2)^{-\alpha}
       \Gamma(\alpha,\pi n^2e^{4U}),\quad
       \alpha=(9+q)/4.
    """

    pi = arb.pi()
    n2 = n * n
    alpha = (9 + q) / 4
    base = pi * n2
    lower_gamma_argument = base * (4 * cutoff_u).exp()
    power = (-alpha * base.log()).exp()
    result = (
        4
        * pi
        * pi
        * n2
        * n2
        * power
        * lower_gamma_argument.gamma_upper(alpha)
    )
    return _require_nonnegative_finite_arb(result, f"tail.F[{n}]")


def _A_tail_bound(
    q: arb, theta_terms: int, cutoff_u: arb
) -> ThetaTailBound:
    """Bound the complement of the finite theta integration rectangle."""

    retained_u = arb(0)
    for n in range(1, theta_terms + 1):
        retained_u += _single_A_tail(q, n, cutoff_u)

    first_omitted = theta_terms + 1
    pi = arb.pi()
    geometric_ratio = (
        arb(fmpq((first_omitted + 1) ** 4, first_omitted**4))
        * (-pi * (2 * first_omitted + 1)).exp()
    )
    denominator = 1 - geometric_ratio
    if not denominator.is_finite() or not denominator > 0:
        raise ThetaEvaluationError("omitted-theta-term geometric ratio is not < 1")
    omitted_n = _single_A_tail(q, first_omitted, arb(0)) / denominator
    retained_u = _require_nonnegative_finite_arb(retained_u, "tail.retained_u")
    omitted_n = _require_nonnegative_finite_arb(omitted_n, "tail.omitted_n")
    total = _require_nonnegative_finite_arb(
        retained_u + omitted_n, "tail.total"
    )
    return ThetaTailBound(q, retained_u, omitted_n, total)


def _B_over_a_tail_bound(
    q: arb, theta_terms: int, cutoff_u: arb
) -> ThetaTailBound:
    r"""Bound the ``C=B/a`` tail by ``2*T_A(q+1)``.

    The pointwise inequalities

    ``sinh(2*a*u)/a <= 2*u*exp(2*a*u)`` and ``u <= exp(u)``

    give this bound uniformly for ``a >= 0`` (with the continuous value at
    ``a=0``).
    """

    shifted = _A_tail_bound(q + 1, theta_terms, cutoff_u)
    retained_u = _require_nonnegative_finite_arb(
        2 * shifted.retained_u, "tail.B_over_a.retained_u"
    )
    omitted_n = _require_nonnegative_finite_arb(
        2 * shifted.omitted_n, "tail.B_over_a.omitted_n"
    )
    total = _require_nonnegative_finite_arb(
        retained_u + omitted_n, "tail.B_over_a.total"
    )
    return ThetaTailBound(
        shifted.q,
        retained_u,
        omitted_n,
        total,
        epsilon=_TAIL_EPSILON,
    )


def _inflate_complex(value: acb, absolute_error: arb, stage: str) -> acb:
    """Add a rectangular enclosure covering a complex error of known modulus."""

    value = _require_finite_acb(value, f"{stage}.value")
    error = _require_nonnegative_finite_arb(absolute_error, f"{stage}.error")
    # A modulus bound T implies both |Re(error)| <= T and |Im(error)| <= T.
    # The arb radius constructor rounds its radius upward.
    symmetric_error = arb(0, error.upper())
    return _require_finite_acb(
        acb(value.real + symmetric_error, value.imag + symmetric_error), stage
    )


def theta_components(
    z_real: fmpq,
    z_imag: fmpq,
    a: fmpq,
    cutoff_u: fmpq,
    theta_terms: int,
) -> ThetaComponents:
    r"""Compute cancellation-preserving theta enclosures of ``A`` and ``B/a``.

    All mathematical inputs must be exact :class:`flint.fmpq` values.  The
    current ``flint.ctx.prec`` controls the working precision.  The finite
    integrals are evaluated by Arb's rigorous complex integrator.
    """

    _validate_exact_inputs(z_real, z_imag, a, cutoff_u, theta_terms)
    precision_bits = int(ctx.prec)
    beta = abs(z_imag)
    q_exact = 2 * (a + beta)
    q = arb(q_exact)
    cutoff_ball = arb(cutoff_u)
    z = acb(z_real, z_imag)
    a_ball = acb(a)

    def A_integrand(u: acb, _analytic: bool) -> acb:
        return (
            8
            * _phi_truncated(u, theta_terms)
            * (2 * a_ball * u).cosh()
            * (2 * z * u).cos()
        )

    def B_over_a_integrand(u: acb, _analytic: bool) -> acb:
        # sinc(i*x)=sinh(x)/x, so this is sinh(2*a*u)/a with a
        # cancellation-free, entire continuation equal to 2*u at a=0.
        stable_hyperbolic_quotient = 2 * u * (_I * 2 * a_ball * u).sinc()
        return (
            8
            * _phi_truncated(u, theta_terms)
            * stable_hyperbolic_quotient
            * (2 * z * u).sin()
        )

    try:
        A_integral = acb.integral(
            A_integrand,
            acb(0),
            acb(cutoff_u),
            deg_limit=_INTEGRAL_DEG_LIMIT,
            eval_limit=_INTEGRAL_EVAL_LIMIT,
            depth_limit=_INTEGRAL_DEPTH_LIMIT,
        )
        B_over_a_integral = acb.integral(
            B_over_a_integrand,
            acb(0),
            acb(cutoff_u),
            deg_limit=_INTEGRAL_DEG_LIMIT,
            eval_limit=_INTEGRAL_EVAL_LIMIT,
            depth_limit=_INTEGRAL_DEPTH_LIMIT,
        )
    except Exception as error:
        raise ThetaEvaluationError(
            f"Arb theta integration failed: {type(error).__name__}"
        ) from error

    A_integral = _require_finite_acb(A_integral, "theta.A_integral")
    B_over_a_integral = _require_finite_acb(
        B_over_a_integral, "theta.B_over_a_integral"
    )
    A_tail = _A_tail_bound(q, theta_terms, cutoff_ball)
    B_over_a_tail = _B_over_a_tail_bound(q, theta_terms, cutoff_ball)
    A = _inflate_complex(A_integral, A_tail.total, "theta.A")
    B_over_a = _inflate_complex(
        B_over_a_integral, B_over_a_tail.total, "theta.B_over_a"
    )
    E = _require_finite_acb(A - _I * a_ball * B_over_a, "theta.E")
    E_sharp = _require_finite_acb(
        A + _I * a_ball * B_over_a, "theta.E_sharp"
    )
    return ThetaComponents(
        z_real=z_real,
        z_imag=z_imag,
        a=a,
        cutoff_u=cutoff_u,
        theta_terms=theta_terms,
        precision_bits=precision_bits,
        beta=beta,
        q=q_exact,
        A_integral=A_integral,
        B_over_a_integral=B_over_a_integral,
        A_tail=A_tail,
        B_over_a_tail=B_over_a_tail,
        A=A,
        B_over_a=B_over_a,
        E=E,
        E_sharp=E_sharp,
    )


def theta_completed_xi_crosscheck(
    z_real: fmpq,
    z_imag: fmpq,
    a: fmpq,
    cutoff_u: fmpq,
    theta_terms: int,
) -> ThetaCrosscheckResult:
    """Compare theta enclosures with an independent completed-Xi evaluation.

    Invalid inputs raise :class:`ThetaInputError`.  Any arithmetic or
    integration failure is converted to a non-passing result; callers must not
    treat either failure or non-overlap as evidence for a mathematical claim.
    """

    _validate_exact_inputs(z_real, z_imag, a, cutoff_u, theta_terms)
    try:
        components = theta_components(
            z_real, z_imag, a, cutoff_u, theta_terms
        )
        z = acb(z_real, z_imag)
        a_ball = acb(a)
        direct_E = _require_finite_acb(
            completed_E_a(z, a_ball), "theta_crosscheck.completed_E"
        )
        direct_E_sharp = _require_finite_acb(
            completed_E_sharp_a(z, a_ball),
            "theta_crosscheck.completed_E_sharp",
        )
        E_overlap = components.E.overlaps(direct_E)
        E_sharp_overlap = components.E_sharp.overlaps(direct_E_sharp)
        overlap = E_overlap and E_sharp_overlap
        return ThetaCrosscheckResult(
            performed=True,
            overlap=overlap,
            reason=(
                "theta-and-completed-xi-enclosures-overlap"
                if overlap
                else "independent-enclosures-do-not-overlap"
            ),
            E_overlap=E_overlap,
            E_sharp_overlap=E_sharp_overlap,
            components=components,
            completed_E=direct_E,
            completed_E_sharp=direct_E_sharp,
        )
    except Exception as error:
        return ThetaCrosscheckResult(
            performed=False,
            overlap=False,
            reason=f"theta-crosscheck-failed:{type(error).__name__}",
        )


__all__ = [
    "ThetaComponents",
    "ThetaCrosscheckResult",
    "ThetaEvaluationError",
    "ThetaInputError",
    "ThetaTailBound",
    "theta_completed_xi_crosscheck",
    "theta_components",
]
