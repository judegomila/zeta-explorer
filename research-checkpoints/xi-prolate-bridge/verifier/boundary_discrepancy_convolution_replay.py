#!/usr/bin/env python3
"""Independent replay of the boundary-discrepancy convolution pilot.

The replay imports neither the producer nor a project matrix helper.  It
factors every candidate integer, assembles the source matrix by an unsplit
archimedean quadrature, and evaluates the boundary convolution after a
Fubini interchange.  The producer and verifier nevertheless share mpmath
transcendental arithmetic and ``eigsy``; the report discloses that limitation.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-boundary-discrepancy-convolution-v1"
REPLAY_SCHEMA = "xi-prolate-boundary-discrepancy-convolution-replay-v1"
TERMINAL_STATE = "P0_INVALIDATED"
REPLAY_STATUS = "BOUNDARY_DISCREPANCY_CONVOLUTION_REPLAY_PASS"
CHECKPOINT_VERSION = "0.52.0-boundary-discrepancy-convolution-reduction"
_DECIMAL = re.compile(r"^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$")

CLAIM_SCOPE = {
    "proved_here": [
        "the exact finite boundary formula for the pole-deleted multiplier on the constant mode",
        "the exact weak compressed-ground boundary identity",
        "the exact one-sided reserve-window equivalence under its stated sign hypotheses",
        "the completed-xi ordinary-Laplace identity in Re(s)>1/2",
    ],
    "not_proved_here": [
        "the required uniform one-sided shrinking-window localization",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "either complementary sector floor",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

LOCKED_CONVENTIONS = {
    "physical_interval": "I=[-a,a], a=log(lambda), L=2*a, with Lebesgue measure",
    "zero_extension": "every translated function is zero outside I",
    "fourier_transform": "hat(f)(t)=integral_I f(x)*exp(-i*t*x) dx",
    "fourier_basis": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L), -N<=n<=N",
    "inversion": "J*f(x)=f(-x), equivalently J*V_n=V_-n; no inversion-even ground is assumed before compression",
    "prime_power_endpoint": "inclusive 1<n<=lambda^2",
    "prime_block_sign": "minus in Q=pole-archimedean-prime, as in source equation (3.19)",
    "discrepancy_sign": "F=D-H0 and dD=sum Lambda(n)/sqrt(n)*delta_log(n)-exp(t/2)dt",
    "lambda_scale": "a=log(lambda), L=2*log(lambda), exp(L)=lambda^2",
    "parameter_ingestion": "decimal source parameters are parsed as text and never through binary64",
}

LOCKED_FORMULAS = {
    "weighted_sum": "W(exp(t))=sum_(1<n<=exp(t)) Lambda(n)/sqrt(n)",
    "D": "D(t)=W(exp(t))-2*(exp(t/2)-1)",
    "rho": "rho(t)=exp(-t/2)/(1-exp(-2*t))",
    "H0": "H0(t)=integral_t^infinity rho(u)du=(1/2)log((1+exp(-t/2))/(1-exp(-t/2)))+atan(exp(-t/2))",
    "F": "F(t)=D(t)-H0(t)",
    "A1_source": "A1(y)=H0(a-y)+H0(a+y)+2W(lambda^2)-W(lambda*exp(-y))-W(lambda*exp(y))",
    "A1_boundary": "A1(y)=4*lambda+2D(L)-4*sqrt(lambda)*cosh(y/2)-F(a-y)-F(a+y) a.e.",
    "signed_convolution": "C_lambda(x)=2*X^(-1)*integral_0^L F(t)*x(a-t)dt",
    "weak_identity": "C_lambda(x)+epsilon-c_star=-4*h/(sqrt(lambda)*X)",
    "reserve_window": "h/X<=B iff c_star-epsilon-4B/sqrt(lambda)<=C_lambda(x)<c_star-epsilon, assuming X!=0 and h/X>0",
    "c_star": "c_star=psi(1/4)-log(pi)+4",
    "laplace": "L(F-c_star/2)(s)=s^(-1)*(-xi'/xi(1/2+s)+1/(1/2+s)-2), Re(s)>1/2",
}

ARITHMETIC = {
    "mode": "arbitrary-precision point arithmetic, not interval or ball arithmetic",
    "library": f"mpmath {mp.__version__}",
    "shared_library_with_verifier": True,
    "independent_formula_trees": True,
    "limitation": "producer and verifier share mpmath transcendental arithmetic and eigsy",
}

SOURCE_ADMISSIONS = {
    "cached_matrix_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "asymptotic_claim_made": False,
    "binary64_parameter_used": False,
    "environment_secret_read": False,
}


class ReplayError(ValueError):
    """Raised when a submitted artifact is not an exact formula replay."""


def _reject_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden; use decimal strings")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _validate_json(value: Any, path: str = "payload") -> None:
    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {path}")
            _validate_json(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path}")


def _strict_json_loads(raw: bytes | str, label: str = "artifact") -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_number,
            parse_constant=_reject_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json(value, label)
    return value


def _same(left: Any, right: Any, label: str) -> None:
    if type(left) is not type(right):
        raise ReplayError(f"{label} type mutation")
    if isinstance(left, dict):
        if set(left) != set(right):
            raise ReplayError(f"{label} inventory mutation")
        for key in left:
            _same(left[key], right[key], f"{label}.{key}")
        return
    if isinstance(left, list):
        if len(left) != len(right):
            raise ReplayError(f"{label} length mutation")
        for index, (a, b) in enumerate(zip(left, right)):
            _same(a, b, f"{label}[{index}]")
        return
    if left != right:
        raise ReplayError(f"{label} mutation")


def _exact_decimal(value: Any, label: str, *, positive: bool = False) -> Fraction:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be an exact decimal string; binary64 is forbidden")
    if _DECIMAL.fullmatch(value) is None:
        raise ReplayError(f"{label} is not a canonical decimal string")
    exact = Fraction(value)
    if positive and exact <= 0:
        raise ReplayError(f"{label} must be positive")
    return exact


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _mpf(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be a decimal string; binary64 is forbidden")
    try:
        result = mp.mpf(value)
    except (TypeError, ValueError) as exc:
        raise ReplayError(f"{label} is not a decimal string") from exc
    if not mp.isfinite(result):
        raise ReplayError(f"{label} must be finite")
    return result


def independent_prime_powers(lambda_text: str) -> list[tuple[int, int, int]]:
    """Enumerate prime powers by factoring each integer independently."""

    lam = _exact_decimal(lambda_text, "lambda", positive=True)
    cutoff_exact = lam * lam
    cutoff = cutoff_exact.numerator // cutoff_exact.denominator
    result: list[tuple[int, int, int]] = []
    for candidate in range(2, cutoff + 1):
        remaining = candidate
        factors: list[tuple[int, int]] = []
        divisor = 2
        while divisor * divisor <= remaining:
            if remaining % divisor == 0:
                exponent = 0
                while remaining % divisor == 0:
                    remaining //= divisor
                    exponent += 1
                factors.append((divisor, exponent))
            divisor += 1
        if remaining > 1:
            factors.append((remaining, 1))
        if len(factors) == 1:
            prime, exponent = factors[0]
            result.append((candidate, prime, exponent))
    return result


def _paired_translation(n: int, m: int, h: mp.mpf, L: mp.mpf) -> mp.mpf:
    """Correlation of two locked modes under both zero-extended shifts."""

    if n == m:
        return 2 * (1 - h / L) * mp.cos(2 * mp.pi * n * h / L)
    z = mp.pi * (m - n) * h / L
    sinc = mp.sin(z) / z if z else mp.mpf(1)
    return -2 * h / L * mp.cos(mp.pi * (m + n) * h / L) * sinc


def _source_matrix(lambda_text: str, N: int) -> dict[str, Any]:
    """Assemble ``Q=P-arch-prime`` without a producer/project import."""

    lam = mp.mpf(lambda_text)
    L = 2 * mp.log(lam)
    modes = list(range(-N, N + 1))
    inventory = independent_prime_powers(lambda_text)
    dim = len(modes)
    pole = mp.matrix(dim)
    arch = mp.matrix(dim)
    prime = mp.matrix(dim)
    source = mp.matrix(dim)
    for i, n in enumerate(modes):
        for j, m in enumerate(modes):
            q0 = mp.mpf(2) if n == m else mp.mpf(0)
            pole[i, j] = mp.quad(
                lambda h: _paired_translation(n, m, h, L)
                * (mp.exp(h / 2) + mp.exp(-h / 2)),
                [0, L],
            )

            def arch_integrand(h: mp.mpf) -> mp.mpf:
                if not h:
                    return (mp.mpf(1) / 2 if n == m else 0) - 1 / L
                return (
                    mp.exp(h / 2) * _paired_translation(n, m, h, L) - q0
                ) / (mp.exp(h) - mp.exp(-h))

            arch[i, j] = (
                (mp.euler + mp.log(4 * mp.pi)) * q0 / 2
                + mp.quad(arch_integrand, [0, L])
                - q0 / 2 * mp.log((mp.exp(L) + 1) / (mp.exp(L) - 1))
            )
            prime[i, j] = mp.fsum(
                mp.log(p) / mp.sqrt(k)
                * _paired_translation(n, m, mp.log(k), L)
                for k, p, _exponent in inventory
            )
            source[i, j] = pole[i, j] - arch[i, j] - prime[i, j]
    return {
        "lambda": lam,
        "a": L / 2,
        "L": L,
        "modes": modes,
        "inventory": inventory,
        "pole": pole,
        "arch": arch,
        "prime": prime,
        "Q": source,
    }


def _even_basis(N: int) -> mp.matrix:
    dim = 2 * N + 1
    basis = mp.matrix(dim, N + 1)
    basis[N, 0] = 1
    root2 = mp.sqrt(2)
    for n in range(1, N + 1):
        basis[N - n, n] = basis[N + n, n] = 1 / root2
    return basis


def _norm(vector: mp.matrix) -> mp.mpf:
    return mp.sqrt(mp.fsum(abs(vector[i]) ** 2 for i in range(vector.rows)))


def _ground(source: dict[str, Any], N: int) -> dict[str, Any]:
    even = _even_basis(N)
    Q_even = even.T * source["Q"] * even
    values, vectors = mp.eigsy(Q_even)
    even_coefficients = vectors[:, 0]
    coefficients = even * even_coefficients
    if coefficients[N] < 0:
        coefficients = -coefficients
        even_coefficients = -even_coefficients
    epsilon = values[0]
    residual = source["Q"] * coefficients - epsilon * coefficients
    L = source["L"]
    X = mp.sqrt(L) * coefficients[N]
    a = source["a"]
    h = mp.fsum(
        coefficients[index]
        * mp.sinh(a / 2)
        / (mp.sqrt(L) * (mp.mpf(1) / 4 + (2 * mp.pi * n / L) ** 2))
        for index, n in enumerate(source["modes"])
    )
    return {
        "epsilon": epsilon,
        "coefficients": coefficients,
        "even_coefficients": even_coefficients,
        "residual": residual,
        "X": X,
        "h": h,
        "h_over_X": h / X,
        "Q_even": Q_even,
    }


def _x_at_boundary_distance(t: mp.mpf, coefficients: mp.matrix, N: int, L: mp.mpf) -> mp.mpf:
    """Evaluate x(a-t); endpoint phases cancel the locked ``(-1)^n``."""

    return (
        coefficients[N]
        + 2
        * mp.fsum(
            coefficients[N + n] * mp.cos(2 * mp.pi * n * t / L)
            for n in range(1, N + 1)
        )
    ) / mp.sqrt(L)


def _boundary_primitive(t: mp.mpf, coefficients: mp.matrix, N: int, L: mp.mpf) -> mp.mpf:
    """Return G(t)=integral_0^t x(a-v)dv in closed Fourier form."""

    return (
        coefficients[N] * t
        + 2
        * mp.fsum(
            coefficients[N + n]
            * L
            / (2 * mp.pi * n)
            * mp.sin(2 * mp.pi * n * t / L)
            for n in range(1, N + 1)
        )
    ) / mp.sqrt(L)


def _rho(t: mp.mpf) -> mp.mpf:
    return mp.exp(-t / 2) / (-mp.expm1(-2 * t))


def _H0_closed(t: mp.mpf) -> mp.mpf:
    if t <= 0:
        return mp.inf
    r = mp.exp(-t / 2)
    return mp.log((1 + r) / (1 - r)) / 2 + mp.atan(r)


def _H0_series(t: mp.mpf) -> mp.mpf:
    """Independently sum H0 from rho=sum_j exp(-(2j+1/2)t)."""

    if t <= 0:
        return mp.inf
    terms: list[mp.mpf] = []
    index = 0
    while True:
        alpha = 2 * index + mp.mpf(1) / 2
        term = mp.exp(-alpha * t) / alpha
        terms.append(term)
        if index > 8 and abs(term) <= mp.eps * max(1, abs(mp.fsum(terms))):
            return mp.fsum(terms)
        index += 1


def _D_at(t: mp.mpf, inventory: list[tuple[int, int, int]]) -> mp.mpf:
    weighted = mp.fsum(
        mp.log(prime) / mp.sqrt(n)
        for n, prime, _exponent in inventory
        if mp.log(n) <= t
    )
    return weighted - 2 * mp.expm1(t / 2)


def _boundary_convolution(source: dict[str, Any], ground: dict[str, Any], N: int) -> dict[str, Any]:
    """Evaluate C through atom tails and a Fubini interchange for H0."""

    L = source["L"]
    coefficients = ground["coefficients"]
    X = ground["X"]
    G = lambda t: _boundary_primitive(t, coefficients, N, L)
    x_boundary = _x_at_boundary_distance(mp.mpf(0), coefficients, N, L)

    atom_tail_integral = mp.fsum(
        mp.log(prime) / mp.sqrt(n) * (X - G(mp.log(n)))
        for n, prime, _exponent in source["inventory"]
    )
    continuous_main_integral = 2 * mp.quad(
        lambda t: mp.expm1(t / 2) * _x_at_boundary_distance(t, coefficients, N, L),
        [0, L],
    )

    def fubini_integrand(u: mp.mpf) -> mp.mpf:
        if not u:
            return x_boundary / 2
        return _rho(u) * G(u)

    H0_fubini_integral = mp.quad(fubini_integrand, [0, L]) + _H0_closed(L) * X
    D_integral = atom_tail_integral - continuous_main_integral
    F_integral = D_integral - H0_fubini_integral
    C = 2 * F_integral / X
    return {
        "atom_tail_integral": atom_tail_integral,
        "continuous_main_integral": continuous_main_integral,
        "D_integral": D_integral,
        "H0_fubini_integral": H0_fubini_integral,
        "F_integral": F_integral,
        "C": C,
        # The endpoint inventory is used directly.  In particular, the atom
        # at n=lambda^2 is not decided by a rounded comparison of logarithms.
        "D_L": mp.fsum(
            mp.log(prime) / mp.sqrt(n)
            for n, prime, _exponent in source["inventory"]
        )
        - 2 * mp.expm1(L / 2),
        "x_at_a": x_boundary,
    }


def _laplace_check(s: mp.mpf, c_star: mp.mpf) -> dict[str, mp.mpf]:
    """Evaluate via the expanded completed-xi logarithmic derivative.

    The producer differentiates the completed-xi product.  This replay uses
    the separate zeta/digamma/rational logarithmic derivatives instead.
    """

    if s <= mp.mpf(1) / 2:
        raise ReplayError("Laplace samples must satisfy Re(s)>1/2")
    z = s + mp.mpf(1) / 2
    zeta_log_derivative = mp.diff(lambda w: mp.log(mp.zeta(w)), z)
    laplace_D = -zeta_log_derivative / s - 2 / (s - mp.mpf(1) / 2) + 2 / s
    laplace_H0 = (mp.digamma(z / 2) - mp.digamma(mp.mpf(1) / 4)) / (2 * s)
    lhs = laplace_D - laplace_H0 - c_star / (2 * s)
    xi_log_derivative = (
        1 / z
        + 1 / (z - 1)
        - mp.log(mp.pi) / 2
        + mp.digamma(z / 2) / 2
        + zeta_log_derivative
    )
    rhs = (-xi_log_derivative + 1 / z - 2) / s
    return {
        "z": z,
        "laplace_D": laplace_D,
        "laplace_H0": laplace_H0,
        "lhs": lhs,
        "xi_log_derivative": xi_log_derivative,
        "rhs": rhs,
        "signed_residual": lhs - rhs,
    }


def reconstruct(lambda_text: str, N: int, dps: int, B_text: str) -> dict[str, Any]:
    """Reconstruct the fixed pilot and every transcendental submitted value."""

    if lambda_text != "2" or N != 2 or B_text != "2":
        raise ReplayError(
            "this independently locked pilot requires lambda='2', N=2, and B='2'"
        )
    _exact_decimal(B_text, "reserve bound B")
    with mp.workdps(dps):
        source = _source_matrix(lambda_text, N)
        ground = _ground(source, N)
        boundary = _boundary_convolution(source, ground, N)
        lam = source["lambda"]
        c_star = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) + 4
        W = mp.fsum(
            mp.log(prime) / mp.sqrt(n)
            for n, prime, _exponent in source["inventory"]
        )
        m0 = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) - 2 * W
        one = mp.matrix(2 * N + 1, 1)
        one[N] = mp.sqrt(source["L"])
        A = source["Q"] - source["pole"] - m0 * mp.eye(2 * N + 1)
        source["A"] = A
        weak_matrix = (one.T * A * ground["coefficients"])[0] / ground["X"]
        weak_boundary = (
            4 * lam
            + 2 * boundary["D_L"]
            - 4 * mp.sqrt(lam) * ground["h_over_X"]
            - boundary["C"]
        )
        weak_signed = weak_boundary - weak_matrix
        identity_signed = (
            boundary["C"]
            + ground["epsilon"]
            - c_star
            + 4 * ground["h_over_X"] / mp.sqrt(lam)
        )
        B = mp.mpf(B_text)
        lower = c_star - ground["epsilon"] - 4 * B / mp.sqrt(lam)
        upper = c_star - ground["epsilon"]
        ratio_bound = ground["h_over_X"] <= B
        window = lower <= boundary["C"] < upper
        h0_samples = []
        for label, t in (("a_over_2", source["a"] / 2), ("a", source["a"]), ("L", source["L"])):
            closed = _H0_closed(t)
            tail = _H0_series(t)
            h0_samples.append({"label": label, "t": t, "closed": closed, "tail": tail, "signed_residual": closed - tail})
        return {
            "source": source,
            "ground": ground,
            "boundary": boundary,
            "c_star": c_star,
            "m0": m0,
            "W": W,
            "weak_matrix": weak_matrix,
            "weak_boundary": weak_boundary,
            "weak_signed_residual": weak_signed,
            "identity_signed_residual": identity_signed,
            "B": B,
            "window_lower": lower,
            "window_upper": upper,
            "ratio_bound": bool(ratio_bound),
            "window": bool(window),
            "strict_upper": bool(boundary["C"] < upper),
            "equivalence": bool(ratio_bound) == bool(window),
            "h0_samples": h0_samples,
            "laplace": [_laplace_check(mp.mpf("1"), c_star), _laplace_check(mp.mpf("1.5"), c_star)],
        }


def _read_vector(value: Any, rows: int, label: str) -> mp.matrix:
    if not isinstance(value, list) or len(value) != rows:
        raise ReplayError(f"{label} has the wrong length")
    result = mp.matrix(rows, 1)
    for index, entry in enumerate(value):
        result[index] = _mpf(entry, f"{label}[{index}]")
    return result


def _read_matrix(value: Any, rows: int, cols: int, label: str) -> mp.matrix:
    if not isinstance(value, list) or len(value) != rows:
        raise ReplayError(f"{label} has the wrong row count")
    result = mp.matrix(rows, cols)
    for i, row in enumerate(value):
        if not isinstance(row, list) or len(row) != cols:
            raise ReplayError(f"{label}[{i}] has the wrong column count")
        for j, entry in enumerate(row):
            result[i, j] = _mpf(entry, f"{label}[{i}][{j}]")
    return result


def _close(left: mp.mpf, right: mp.mpf, tolerance: mp.mpf) -> bool:
    return abs(left - right) <= tolerance * max(1, abs(right))


def _require_close(left: mp.mpf, right: mp.mpf, tolerance: mp.mpf, label: str) -> None:
    if not _close(left, right, tolerance):
        raise ReplayError(f"{label} does not match independent reconstruction")


def _require_vector_close(submitted: mp.matrix, expected: mp.matrix, tolerance: mp.mpf, label: str) -> None:
    if submitted.rows != expected.rows:
        raise ReplayError(f"{label} shape mismatch")
    for index in range(submitted.rows):
        _require_close(submitted[index], expected[index], tolerance, f"{label}[{index}]")


def _require_matrix_close(submitted: mp.matrix, expected: mp.matrix, tolerance: mp.mpf, label: str) -> None:
    if submitted.rows != expected.rows or submitted.cols != expected.cols:
        raise ReplayError(f"{label} shape mismatch")
    for i in range(submitted.rows):
        for j in range(submitted.cols):
            _require_close(submitted[i, j], expected[i, j], tolerance, f"{label}[{i}][{j}]")


def _max_abs_matrix(matrix: mp.matrix) -> mp.mpf:
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


def _numeric_object(
    submitted: Any,
    expected: dict[str, mp.mpf],
    tolerance: mp.mpf,
    label: str,
) -> None:
    if not isinstance(submitted, dict) or set(submitted) != set(expected):
        raise ReplayError(f"{label} inventory mismatch")
    for key, value in expected.items():
        _require_close(_mpf(submitted[key], f"{label}.{key}"), value, tolerance, f"{label}.{key}")


def replay(payload: Any) -> dict[str, Any]:
    """Strictly validate and independently reconstruct a producer artifact."""

    _validate_json(payload)
    if not isinstance(payload, dict):
        raise ReplayError("artifact must be a JSON object")
    expected_top = {
        "schema",
        "terminal_state",
        "checkpoint_version",
        "claim_scope",
        "input",
        "locked_conventions",
        "locked_formulas",
        "arithmetic",
        "source_admissions",
        "exact_prime_power_inventory",
        "transcendental_point_outputs",
        "raw_point_matrices",
        "even_ground",
        "boundary_decomposition",
        "weak_identity",
        "reserve_window",
        "archimedean_tail_samples",
        "laplace_checks",
        "checks",
    }
    if set(payload) != expected_top:
        raise ReplayError("artifact top-level inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "checkpoint_version": CHECKPOINT_VERSION,
        "claim_scope": CLAIM_SCOPE,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "arithmetic": ARITHMETIC,
        "source_admissions": SOURCE_ADMISSIONS,
    }
    for key, expected in fixed.items():
        _same(payload[key], expected, key)

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_decimal",
        "lambda_rational",
        "N",
        "precision_decimal_digits",
        "reserve_bound_B_decimal",
    }:
        raise ReplayError("input inventory mismatch")
    lambda_text = inputs["lambda_decimal"]
    lam_exact = _exact_decimal(lambda_text, "lambda", positive=True)
    if lambda_text != "2":
        raise ReplayError("pilot lambda must be the canonical exact string '2'")
    if inputs["lambda_rational"] != {
        "numerator": str(lam_exact.numerator),
        "denominator": str(lam_exact.denominator),
    }:
        raise ReplayError("lambda decimal/rational mismatch")
    N = _integer(inputs["N"], "N", 1)
    if N != 2:
        raise ReplayError("pilot N must be 2")
    dps = _integer(inputs["precision_decimal_digits"], "precision_decimal_digits", 40)
    B_text = inputs["reserve_bound_B_decimal"]
    B_exact = _exact_decimal(B_text, "reserve bound B")
    if B_exact < 0 or B_text != "2":
        raise ReplayError("the locked reserve bound B must be the exact string '2'")

    with mp.workdps(dps):
        rebuilt = reconstruct(lambda_text, N, dps, B_text)
        # Six guard digits cover independent quadrature/eigensolver ordering;
        # the verifier otherwise checks essentially the full serialized
        # precision, rather than accepting only half of the declared digits.
        tolerance = mp.power(10, -(dps - 6))
        serialization_tolerance = tolerance
        source = rebuilt["source"]
        ground = rebuilt["ground"]
        boundary = rebuilt["boundary"]

        square = lam_exact * lam_exact
        expected_inventory = {
            "cutoff_rule": "floor(lambda^2), inclusive",
            "lambda_squared": {
                "numerator": str(square.numerator),
                "denominator": str(square.denominator),
            },
            "integer_cutoff": square.numerator // square.denominator,
            "endpoint_is_integer": square.denominator == 1,
            "terms": [
                {
                    "n": n,
                    "prime": prime,
                    "exponent": exponent,
                    "von_mangoldt": f"log({prime})",
                }
                for n, prime, exponent in source["inventory"]
            ],
        }
        _same(
            payload["exact_prime_power_inventory"],
            expected_inventory,
            "exact_prime_power_inventory",
        )

        _numeric_object(
            payload["transcendental_point_outputs"],
            {
                "a": source["a"],
                "L": source["L"],
                "c_star": rebuilt["c_star"],
                "m_lambda_0": rebuilt["m0"],
                "W_lambda_squared": rebuilt["W"],
                "D_at_L": boundary["D_L"],
            },
            tolerance,
            "transcendental_point_outputs",
        )

        raw = payload["raw_point_matrices"]
        expected_matrices = {
            "source_pole": source["pole"],
            "source_archimedean_before_outer_minus": source["arch"],
            "source_prime_before_outer_minus": source["prime"],
            "source_Q_equals_pole_minus_arch_minus_prime": source["Q"],
            "pole_deleted_A": source["A"],
            "Q_even": ground["Q_even"],
        }
        if not isinstance(raw, dict) or set(raw) != set(expected_matrices):
            raise ReplayError("raw point-matrix inventory mismatch")
        submitted_matrices: dict[str, mp.matrix] = {}
        for key, expected in expected_matrices.items():
            rows, cols = expected.rows, expected.cols
            submitted = _read_matrix(raw[key], rows, cols, f"raw_point_matrices.{key}")
            submitted_matrices[key] = submitted
            _require_matrix_close(submitted, expected, tolerance, f"raw_point_matrices.{key}")
        _require_matrix_close(
            submitted_matrices["source_Q_equals_pole_minus_arch_minus_prime"],
            submitted_matrices["source_pole"]
            - submitted_matrices["source_archimedean_before_outer_minus"]
            - submitted_matrices["source_prime_before_outer_minus"],
            serialization_tolerance,
            "source signed block decomposition",
        )
        _require_matrix_close(
            submitted_matrices["pole_deleted_A"],
            submitted_matrices["source_Q_equals_pole_minus_arch_minus_prime"]
            - submitted_matrices["source_pole"]
            - rebuilt["m0"] * mp.eye(2 * N + 1),
            serialization_tolerance,
            "pole-deleted multiplier shift",
        )

        even_ground = payload["even_ground"]
        expected_ground_keys = {
            "epsilon",
            "full_coefficients",
            "even_coefficients",
            "eigen_residual_before_absolute_values",
            "X",
            "h",
            "h_over_X",
        }
        if not isinstance(even_ground, dict) or set(even_ground) != expected_ground_keys:
            raise ReplayError("even-ground inventory mismatch")
        _require_close(_mpf(even_ground["epsilon"], "even_ground.epsilon"), ground["epsilon"], tolerance, "even ground epsilon")
        full_coefficients = _read_vector(even_ground["full_coefficients"], 2 * N + 1, "even_ground.full_coefficients")
        _require_vector_close(full_coefficients, ground["coefficients"], tolerance, "even ground full coefficients")
        even_coefficients = _read_vector(even_ground["even_coefficients"], N + 1, "even_ground.even_coefficients")
        _require_vector_close(even_coefficients, ground["even_coefficients"], tolerance, "even ground parity coefficients")
        signed_ground_residual = _read_vector(
            even_ground["eigen_residual_before_absolute_values"],
            2 * N + 1,
            "even_ground.eigen_residual_before_absolute_values",
        )
        _require_vector_close(signed_ground_residual, ground["residual"], tolerance, "signed ground residual")
        for key, expected in (("X", ground["X"]), ("h", ground["h"]), ("h_over_X", ground["h_over_X"])):
            _require_close(_mpf(even_ground[key], f"even_ground.{key}"), expected, tolerance, f"even_ground.{key}")

        _numeric_object(
            payload["boundary_decomposition"],
            {
                "atom_tail_integral": boundary["atom_tail_integral"],
                "continuous_main_integral": boundary["continuous_main_integral"],
                "D_integral": boundary["D_integral"],
                "H0_direct_integral": boundary["H0_fubini_integral"],
                "F_integral": boundary["F_integral"],
                "decomposed_F_integral": boundary["D_integral"]
                - boundary["H0_fubini_integral"],
                "decomposition_signed_residual": boundary["F_integral"]
                - (boundary["D_integral"] - boundary["H0_fubini_integral"]),
                "C_lambda": boundary["C"],
                "D_at_L": boundary["D_L"],
                "x_at_a": boundary["x_at_a"],
            },
            tolerance,
            "boundary_decomposition",
        )

        weak = payload["weak_identity"]
        expected_weak = {
            "A1_matrix_pairing_over_X": rebuilt["weak_matrix"],
            "A1_boundary_pairing_over_X": rebuilt["weak_boundary"],
            "signed_residual": rebuilt["weak_signed_residual"],
            "C_plus_epsilon_minus_c_star": boundary["C"] + ground["epsilon"] - rebuilt["c_star"],
            "identity_signed_residual": rebuilt["identity_signed_residual"],
        }
        _numeric_object(weak, expected_weak, tolerance, "weak_identity")

        reserve = payload["reserve_window"]
        expected_reserve_keys = {
            "B",
            "lower",
            "C_lambda",
            "upper",
            "ratio_bound_holds",
            "strict_upper_holds",
            "equivalence_holds",
        }
        if not isinstance(reserve, dict) or set(reserve) != expected_reserve_keys:
            raise ReplayError("reserve-window inventory mismatch")
        for key, expected in (
            ("B", rebuilt["B"]),
            ("lower", rebuilt["window_lower"]),
            ("C_lambda", boundary["C"]),
            ("upper", rebuilt["window_upper"]),
        ):
            _require_close(_mpf(reserve[key], f"reserve_window.{key}"), expected, tolerance, f"reserve_window.{key}")
        expected_reserve_booleans = {
            "ratio_bound_holds": rebuilt["ratio_bound"],
            "strict_upper_holds": rebuilt["strict_upper"],
            "equivalence_holds": rebuilt["equivalence"],
        }
        for key, expected in expected_reserve_booleans.items():
            if reserve[key] is not expected:
                raise ReplayError(f"reserve_window.{key} is inconsistent with independent reconstruction")
        if ground["X"] == 0 or ground["h_over_X"] <= 0 or rebuilt["B"] < 0:
            raise ReplayError("reserve-window signed hypotheses fail at the submitted pilot")

        tail_samples = payload["archimedean_tail_samples"]
        if not isinstance(tail_samples, list) or len(tail_samples) != len(rebuilt["h0_samples"]):
            raise ReplayError("archimedean-tail sample inventory mismatch")
        for index, (submitted, expected) in enumerate(zip(tail_samples, rebuilt["h0_samples"])):
            if not isinstance(submitted, dict) or set(submitted) != {"label", "t", "closed", "direct_tail", "signed_residual"}:
                raise ReplayError(f"archimedean-tail sample {index} inventory mismatch")
            if submitted["label"] != expected["label"]:
                raise ReplayError(f"archimedean-tail sample {index} label mutation")
            for submitted_key, expected_key in (
                ("t", "t"),
                ("closed", "closed"),
                ("direct_tail", "tail"),
                ("signed_residual", "signed_residual"),
            ):
                _require_close(
                    _mpf(submitted[submitted_key], f"archimedean_tail_samples[{index}].{submitted_key}"),
                    expected[expected_key],
                    tolerance,
                    f"archimedean-tail sample {index} {submitted_key}",
                )

        laplace_checks = payload["laplace_checks"]
        if not isinstance(laplace_checks, list) or len(laplace_checks) != len(rebuilt["laplace"]):
            raise ReplayError("Laplace sample inventory mismatch")
        laplace_keys = {"s", "z", "laplace_D", "laplace_H0", "lhs", "xi_log_derivative", "rhs", "signed_residual"}
        for index, (submitted, expected) in enumerate(zip(laplace_checks, rebuilt["laplace"])):
            if not isinstance(submitted, dict) or set(submitted) != laplace_keys:
                raise ReplayError(f"Laplace sample {index} inventory mismatch")
            expected_with_s = {
                "s": (mp.mpf("1"), mp.mpf("1.5"))[index],
                **expected,
            }
            _numeric_object(submitted, expected_with_s, tolerance, f"laplace_checks[{index}]")

        checks = payload["checks"]
        if not isinstance(checks, dict):
            raise ReplayError("checks must be an object")
        # Producer booleans never establish acceptance.  Their exact inventory
        # is bound by the producer contract, while each predicate is recomputed
        # above or again below from reconstructed values.
        expected_check_keys = {
            "source_hermitian_defect_max_abs",
            "source_inversion_commutator_max_abs",
            "even_ground_eigen_residual_max_abs",
            "boundary_decomposition_matches",
            "weak_boundary_identity_matches",
            "central_identity_matches",
            "h_over_X_positive_for_this_pilot",
            "finite_point_diagnostic_only",
        }
        if set(checks) != expected_check_keys:
            raise ReplayError("check inventory mismatch")
        J = mp.matrix(2 * N + 1)
        for index in range(2 * N + 1):
            J[index, 2 * N - index] = 1
        numeric_checks = {
            "source_hermitian_defect_max_abs": _max_abs_matrix(source["Q"] - source["Q"].T),
            "source_inversion_commutator_max_abs": _max_abs_matrix(source["Q"] * J - J * source["Q"]),
            "even_ground_eigen_residual_max_abs": max(abs(ground["residual"][i]) for i in range(ground["residual"].rows)),
        }
        for key, expected in numeric_checks.items():
            _require_close(_mpf(checks[key], f"checks.{key}"), expected, tolerance, f"checks.{key}")
        boolean_checks = {
            "boundary_decomposition_matches": abs(
                boundary["F_integral"]
                - (boundary["D_integral"] - boundary["H0_fubini_integral"])
            )
            <= tolerance,
            "weak_boundary_identity_matches": abs(rebuilt["weak_signed_residual"]) <= tolerance,
            "central_identity_matches": abs(rebuilt["identity_signed_residual"]) <= tolerance,
            "h_over_X_positive_for_this_pilot": ground["h_over_X"] > 0,
            "finite_point_diagnostic_only": True,
        }
        for key, expected in boolean_checks.items():
            if checks[key] is not expected:
                raise ReplayError(f"checks.{key} is inconsistent with independent reconstruction")
        if (
            any(value > tolerance for value in numeric_checks.values())
            or not all(boolean_checks.values())
            or not any(n == 4 for n, _p, _e in source["inventory"])
            or not all(abs(item["signed_residual"]) <= tolerance for item in rebuilt["h0_samples"])
            or not all(abs(item["signed_residual"]) <= tolerance for item in rebuilt["laplace"])
        ):
            raise ReplayError("one or more independently reconstructed checks fail")

        return {
            "schema": REPLAY_SCHEMA,
            "status": REPLAY_STATUS,
            "terminal_state": TERMINAL_STATE,
            "checkpoint_version": CHECKPOINT_VERSION,
            "input": inputs,
            "checks": {
                "strict_canonical_JSON_replayed": True,
                "producer_matrices_and_booleans_trusted": False,
                "source_matrix_reassembled_from_source_parameters": True,
                "prime_powers_independently_factored_including_endpoint": True,
                "even_ground_independently_diagonalized": True,
                "boundary_convolution_replayed_by_Fubini_tail_path": True,
                "weak_A1_pairing_replayed": True,
                "signed_residual_preserved_before_absolute_value": True,
                "completed_xi_Laplace_identity_replayed": True,
            },
            "independent_signed_identity_residual": mp.nstr(
                rebuilt["identity_signed_residual"], dps
            ),
            "independent_ground_residual_norm": mp.nstr(_norm(ground["residual"]), dps),
            "shared_arithmetic_and_eigensolver_limitation": (
                "producer and verifier share mpmath transcendental arithmetic and eigsy; "
                "these are point diagnostics rather than interval or ball enclosures"
            ),
        }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    payload = _strict_json_loads(args.input.read_bytes(), str(args.input))
    result = replay(payload)
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
