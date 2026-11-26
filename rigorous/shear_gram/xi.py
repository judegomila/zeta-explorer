"""Completed-zeta evaluation of Xi and the mandated shear pair."""

from __future__ import annotations

from flint import acb, acb_series, fmpq

from .errors import NonFiniteError

_HALF = fmpq(1, 2)
_I = acb(0, 1)


def _finite(value: acb, stage: str) -> acb:
    if not value.is_finite():
        raise NonFiniteError(stage)
    return value


def zeta_deflated(s: acb) -> acb:
    r"""Enclose the analytic deflation ``zeta(s) - 1/(s-1)``.

    python-flint 0.9.0 exposes pole deflation on series rather than on scalar
    ``acb`` values.  A constant series of precision one provides the certified
    scalar value, including balls overlapping ``s=1``.
    """

    if not isinstance(s, acb):
        raise TypeError("zeta_deflated requires flint.acb")
    _finite(s, "zeta_deflated.input")
    value = acb_series([s], prec=1).zeta(deflate=True)[0]
    return _finite(value, "zeta_deflated.result")


def _xi_completed_deflated(s: acb) -> acb:
    r"""Pole-cancelled completed-zeta formula at one ACB argument."""

    half_s = _finite(s / 2, "xi.s_over_2")
    pi_log = _finite(acb.pi().log(), "xi.log_pi")
    archimedean = _finite((-half_s * pi_log).exp(), "xi.pi_power")
    gamma_factor = _finite((1 + half_s).gamma(), "xi.gamma_shifted")
    deflated = zeta_deflated(s)
    pole_cancelled = _finite(1 + (s - 1) * deflated, "xi.pole_cancelled_zeta")
    return _finite(
        archimedean * gamma_factor * pole_cancelled, "xi.deflated_result"
    )


def xi_completed(s: acb) -> acb:
    r"""Enclose ``xi(s)`` using a pole-cancelled completed-zeta formula.

    .. math::
       \xi(s)=\pi^{-s/2}\Gamma(1+s/2)
       \left[1+(s-1)\zeta_{\rm defl}(s)\right],

    where ``zeta_defl(s)=zeta(s)-1/(s-1)`` is entire.  This is algebraically
    the usual ``1/2*s*(s-1)*...`` formula, but it remains finite for exact
    points and balls overlapping both removable locations ``s=0,1``.

    When the argument is certainly left of ``Re(s)=1/2``, the functional
    equation ``xi(s)=xi(1-s)`` first reflects it to avoid gamma poles on the
    negative real axis.  Any remaining non-finite enclosure fails closed.
    """

    if not isinstance(s, acb):
        raise TypeError("xi_completed requires flint.acb")
    _finite(s, "xi.input")
    argument = 1 - s if s.real < _HALF else s
    return _finite(_xi_completed_deflated(argument), "xi.result")


def Xi(t: acb) -> acb:
    r"""Enclose ``Xi(t) = xi(1/2 + i t)``."""

    if not isinstance(t, acb):
        raise TypeError("Xi requires flint.acb")
    _finite(t, "Xi.input")
    s = _finite(acb(_HALF) + _I * t, "Xi.s")
    return _finite(xi_completed(s), "Xi.result")


def E_a(z: acb, a: acb) -> acb:
    r"""Enclose the mandated shear ``E_a(z) = Xi(z + i a)``."""

    if not isinstance(z, acb) or not isinstance(a, acb):
        raise TypeError("E_a requires flint.acb arguments")
    return _finite(Xi(z + _I * a), "E_a.result")


def E_sharp_a(z: acb, a: acb) -> acb:
    r"""Enclose ``E_a#(z) = Xi(z - i a)`` for real ``a``."""

    if not isinstance(z, acb) or not isinstance(a, acb):
        raise TypeError("E_sharp_a requires flint.acb arguments")
    return _finite(Xi(z - _I * a), "E_sharp_a.result")
