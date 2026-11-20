#!/usr/bin/env python3
"""Clean-room replay of the finite PNT-discrepancy normal form.

The replay imports neither the producer nor ``weil_matrix``.  It factors each
integer independently, uses a trigonometric-product translation kernel, and
assembles the source pole by quadrature rather than the producer's closed
formula.  Both paths still share mpmath transcendental arithmetic.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import json
from pathlib import Path
import re
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-pnt-discrepancy-normal-form-v1"
REPLAY_SCHEMA = "xi-prolate-pnt-discrepancy-normal-form-replay-v1"
TERMINAL_STATE = "P0_INVALIDATED"
REPLAY_STATUS = "PNT_DISCREPANCY_NORMAL_FORM_REPLAY_PASS"
_DECIMAL = re.compile(r"^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$")

LOCKED_CONVENTIONS = {
    "physical_interval": "I=[-a,a], a=log(lambda), L=2*a, with Lebesgue measure",
    "zero_extension": "every translated function is zero outside I",
    "fourier_basis": "V_n(x)=(-1)^n*L^(-1/2)*exp(+2*pi*i*n*x/L), -N<=n<=N",
    "inversion": "J*V_n=V_-n; reflection is included before parity compression",
    "prime_power_endpoint": "inclusive 1<n<=lambda^2",
    "prime_block_sign": "minus in Q=pole-archimedean-prime",
    "discrepancy_measure_sign": "dD=sum Lambda(n)/sqrt(n)*delta_log(n)-exp(h/2)*dh",
    "lambda_scale": "a=log(lambda), L=2*log(lambda), exp(L)=lambda^2",
}

LOCKED_FORMULAS = {
    "W": "W(X)=sum_{1<n<=X} Lambda(n)/sqrt(n)",
    "D": "D_lambda(h)=W(exp(h))-2*(exp(h/2)-1), 0<=h<=2*a",
    "dD": "dD=sum_{1<n<=lambda^2} Lambda(n)/sqrt(n)*delta_log(n)-exp(h/2)*dh",
    "c_star": "c_*=psi(1/4)-log(pi)+4",
    "rho_tail": "symmetric density rho(|h|)=exp(-5*|h|/2)/(1-exp(-2*|h|)); paired over h>0",
    "A_tail": "A_tail*f(x)=integral_0^infinity (2*f(x)-f_tilde(x+h)-f_tilde(x-h))*rho(h) dh",
    "T_D": "T_D*f(x)=integral_0^(2*a) (f_tilde(x+h)+f_tilde(x-h)) dD(h)",
    "normal_form": "Q_lambda=c_* I+A_tail-T_D",
    "source_form": "Q_lambda=pole-archimedean-prime",
}

CLAIM_SCOPE = {
    "proved_here": [
        "the exact finite PNT-discrepancy normal-form identity",
        "its restrictions to the inversion-even and inversion-odd finite Fourier sectors",
    ],
    "not_proved_here": [
        "a uniform mixed-reserve estimate",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

SOURCE_ADMISSIONS = {
    "cached_matrix_read": False,
    "zeta_zero_table_read": False,
    "global_weil_positivity_assumed": False,
    "asymptotic_claim_made": False,
    "binary64_parameter_used": False,
}

MATRIX_NAMES = (
    "normal_form_c_star_identity",
    "normal_form_A_tail",
    "normal_form_T_D_atoms",
    "normal_form_T_D_continuous",
    "normal_form_T_D_equals_atoms_minus_continuous",
    "normal_form_Q_equals_cI_plus_A_tail_minus_T_D",
    "source_pole",
    "source_archimedean_block_before_outer_minus",
    "source_prime_block_before_outer_minus",
    "source_Q_equals_pole_minus_arch_minus_prime",
    "combined_residual_before_absolute_values",
)


class ReplayError(ValueError):
    """Raised when an artifact is not an exact replay of the locked formulas."""


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


def _same(left: Any, right: Any) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(_same(left[key], right[key]) for key in left)
    if isinstance(left, list):
        return len(left) == len(right) and all(_same(a, b) for a, b in zip(left, right))
    return left == right


def _exact_lambda(text: Any) -> Fraction:
    if not isinstance(text, str):
        raise ReplayError("lambda must be an exact decimal string; binary64 is forbidden")
    if _DECIMAL.fullmatch(text) is None:
        raise ReplayError("lambda is not a canonical decimal string")
    value = Fraction(text)
    if value <= 1:
        raise ReplayError("lambda must be greater than one")
    return value


def _integer(value: Any, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def independent_prime_powers(lambda_text: str) -> list[tuple[int, int, int]]:
    """Factor every candidate instead of generating powers from a sieve."""

    lam = _exact_lambda(lambda_text)
    square = lam * lam
    cutoff = square.numerator // square.denominator
    result: list[tuple[int, int, int]] = []
    for n in range(2, cutoff + 1):
        remaining = n
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
            result.append((n, prime, exponent))
    return result


def _kernel(n: int, m: int, h: mp.mpf, L: mp.mpf) -> mp.mpf:
    if n == m:
        return 2 * (1 - h / L) * mp.cos(2 * mp.pi * n * h / L)
    z = mp.pi * (m - n) * h / L
    sinc = mp.sin(z) / z if z != 0 else mp.mpf(1)
    return -2 * h / L * mp.cos(mp.pi * (m + n) * h / L) * sinc


def _rho_alternate(h: mp.mpf) -> mp.mpf:
    # Algebraically rho=exp(-5h/2)/(1-exp(-2h)); this form differs from producer.
    return mp.exp(-h / 2) / mp.expm1(2 * h)


def _matrix(dim: int) -> mp.matrix:
    return mp.matrix(dim, dim)


def _tail_entry(n: int, m: int, L: mp.mpf) -> mp.mpf:
    q0 = mp.mpf(2) if n == m else mp.mpf(0)

    def integrand(h: mp.mpf) -> mp.mpf:
        if h == 0:
            return 1 / L
        return _rho_alternate(h) * (q0 - _kernel(n, m, h, L))

    return mp.quad(integrand, [0, L]) + q0 * mp.quad(_rho_alternate, [L, mp.inf])


def reconstruct(lambda_text: str, N: int, dps: int) -> dict[str, Any]:
    """Independently reconstruct every submitted transcendental quantity."""

    lam_exact = _exact_lambda(lambda_text)
    N = _integer(N, "N", 1)
    dps = _integer(dps, "precision_decimal_digits", 30)
    with mp.workdps(dps):
        lam = mp.mpf(lambda_text)
        a = mp.log(lam)
        L = 2 * a
        modes = list(range(-N, N + 1))
        inventory = independent_prime_powers(lambda_text)
        dim = len(modes)
        c_star = mp.digamma(mp.mpf(1) / 4) - mp.log(mp.pi) + 4
        c_identity = _matrix(dim)
        tail = _matrix(dim)
        atoms = _matrix(dim)
        continuous = _matrix(dim)
        t_discrepancy = _matrix(dim)
        normal_q = _matrix(dim)
        pole = _matrix(dim)
        arch = _matrix(dim)
        prime = _matrix(dim)
        source_q = _matrix(dim)
        for i, n in enumerate(modes):
            for j, m in enumerate(modes):
                q0 = mp.mpf(2) if n == m else mp.mpf(0)
                c_identity[i, j] = c_star if n == m else 0
                tail[i, j] = _tail_entry(n, m, L)
                atoms[i, j] = mp.fsum(
                    mp.log(p) / mp.sqrt(k) * _kernel(n, m, mp.log(k), L)
                    for k, p, _exponent in inventory
                )
                continuous[i, j] = mp.quad(
                    lambda h: mp.exp(h / 2) * _kernel(n, m, h, L), [0, L]
                )
                t_discrepancy[i, j] = atoms[i, j] - continuous[i, j]
                normal_q[i, j] = c_identity[i, j] + tail[i, j] - t_discrepancy[i, j]
                # Direct source path: quadrature for the pole and the unsplit
                # archimedean formula, unlike the producer's locked split path.
                pole[i, j] = mp.quad(
                    lambda h: _kernel(n, m, h, L)
                    * (mp.exp(h / 2) + mp.exp(-h / 2)),
                    [0, L],
                )

                def arch_integrand(h: mp.mpf) -> mp.mpf:
                    if h == 0:
                        return (mp.mpf(1) / 2 if n == m else 0) - 1 / L
                    return (
                        mp.exp(h / 2) * _kernel(n, m, h, L) - q0
                    ) / (mp.exp(h) - mp.exp(-h))

                arch[i, j] = (
                    (mp.euler + mp.log(4 * mp.pi)) * q0 / 2
                    + mp.quad(arch_integrand, [0, L])
                    - q0 / 2 * mp.log((mp.exp(L) + 1) / (mp.exp(L) - 1))
                )
                prime[i, j] = atoms[i, j]
                source_q[i, j] = pole[i, j] - arch[i, j] - prime[i, j]
        residual = normal_q - source_q
        matrices = {
            "normal_form_c_star_identity": c_identity,
            "normal_form_A_tail": tail,
            "normal_form_T_D_atoms": atoms,
            "normal_form_T_D_continuous": continuous,
            "normal_form_T_D_equals_atoms_minus_continuous": t_discrepancy,
            "normal_form_Q_equals_cI_plus_A_tail_minus_T_D": normal_q,
            "source_pole": pole,
            "source_archimedean_block_before_outer_minus": arch,
            "source_prime_block_before_outer_minus": prime,
            "source_Q_equals_pole_minus_arch_minus_prime": source_q,
            "combined_residual_before_absolute_values": residual,
        }
        W = mp.fsum(mp.log(p) / mp.sqrt(k) for k, p, _exponent in inventory)
        square = lam_exact * lam_exact
        return {
            "lambda_exact": lam_exact,
            "lambda_squared": square,
            "inventory": inventory,
            "modes": modes,
            "scalars": {
                "a": a,
                "L": L,
                "c_star": c_star,
                "W_lambda_squared": W,
                "D_at_2a": W - 2 * (lam - 1),
            },
            "matrices": matrices,
        }


def _mpf(value: Any, label: str) -> mp.mpf:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be a decimal string; binary64 is forbidden")
    try:
        parsed = mp.mpf(value)
    except (ValueError, TypeError) as exc:
        raise ReplayError(f"{label} is not a decimal string") from exc
    if not mp.isfinite(parsed):
        raise ReplayError(f"{label} must be finite")
    return parsed


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


def _max_abs(matrix: mp.matrix) -> mp.mpf:
    return max(abs(matrix[i, j]) for i in range(matrix.rows) for j in range(matrix.cols))


def _frobenius(matrix: mp.matrix) -> mp.mpf:
    return mp.sqrt(
        mp.fsum(abs(matrix[i, j]) ** 2 for i in range(matrix.rows) for j in range(matrix.cols))
    )


def _close(left: mp.mpf, right: mp.mpf, tolerance: mp.mpf) -> bool:
    return abs(left - right) <= tolerance * max(1, abs(right))


def _require_close(left: mp.mpf, right: mp.mpf, tolerance: mp.mpf, label: str) -> None:
    if not _close(left, right, tolerance):
        raise ReplayError(f"{label} does not match independent reconstruction")


def _require_matrix_close(
    submitted: mp.matrix, expected: mp.matrix, tolerance: mp.mpf, label: str
) -> None:
    if submitted.rows != expected.rows or submitted.cols != expected.cols:
        raise ReplayError(f"{label} shape mismatch")
    for i in range(submitted.rows):
        for j in range(submitted.cols):
            _require_close(submitted[i, j], expected[i, j], tolerance, f"{label}[{i}][{j}]")


def _parity_bases(N: int) -> tuple[mp.matrix, mp.matrix]:
    dim = 2 * N + 1
    even = mp.matrix(dim, N + 1)
    odd = mp.matrix(dim, N)
    even[N, 0] = 1
    root2 = mp.sqrt(2)
    for k in range(1, N + 1):
        even[N - k, k] = even[N + k, k] = 1 / root2
        odd[N - k, k - 1] = 1 / root2
        odd[N + k, k - 1] = -1 / root2
    return even, odd


def _inversion(N: int) -> mp.matrix:
    dim = 2 * N + 1
    result = mp.matrix(dim)
    for i in range(dim):
        result[i, dim - 1 - i] = 1
    return result


def replay(payload: Any) -> dict[str, Any]:
    _validate_json(payload)
    if not isinstance(payload, dict):
        raise ReplayError("artifact must be a JSON object")
    expected_top = {
        "schema",
        "terminal_state",
        "claim_scope",
        "input",
        "locked_conventions",
        "locked_formulas",
        "arithmetic",
        "source_admissions",
        "exact_prime_power_inventory",
        "transcendental_point_outputs",
        "discrepancy_measure",
        "raw_point_matrices",
        "pre_cancellation_block_norms",
        "cancellation_diagnostic",
        "checks",
    }
    if set(payload) != expected_top:
        raise ReplayError("artifact top-level inventory mismatch")
    fixed = {
        "schema": SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "claim_scope": CLAIM_SCOPE,
        "locked_conventions": LOCKED_CONVENTIONS,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": {
            "mode": "arbitrary-precision point arithmetic, not interval or ball arithmetic",
            "library": f"mpmath {mp.__version__}",
            "shared_library_with_verifier": True,
            "independent_formula_trees": True,
            "limitation": "producer and verifier share mpmath transcendental arithmetic",
        },
    }
    for name, expected in fixed.items():
        if not _same(payload.get(name), expected):
            raise ReplayError(f"{name} mutation")
    input_data = payload["input"]
    if not isinstance(input_data, dict) or set(input_data) != {
        "lambda_decimal",
        "lambda_rational",
        "N",
        "precision_decimal_digits",
    }:
        raise ReplayError("input inventory mismatch")
    lambda_text = input_data["lambda_decimal"]
    lam_exact = _exact_lambda(lambda_text)
    N = _integer(input_data["N"], "N", 1)
    dps = _integer(input_data["precision_decimal_digits"], "precision_decimal_digits", 30)
    if input_data["lambda_rational"] != {
        "numerator": str(lam_exact.numerator),
        "denominator": str(lam_exact.denominator),
    }:
        raise ReplayError("lambda decimal and exact rational do not decode identically")
    with mp.workdps(dps):
        rebuilt = reconstruct(lambda_text, N, dps)
        independent_tol = mp.power(10, -max(14, dps // 2))
        serialization_tol = mp.power(10, -(dps - 6))
        inventory = rebuilt["inventory"]
        square = rebuilt["lambda_squared"]
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
                    "n": k,
                    "prime": p,
                    "exponent": exponent,
                    "von_mangoldt": f"log({p})",
                }
                for k, p, exponent in inventory
            ],
        }
        if not _same(payload["exact_prime_power_inventory"], expected_inventory):
            raise ReplayError("prime-power inventory or inclusive lambda-squared endpoint mismatch")
        submitted_scalars = payload["transcendental_point_outputs"]
        if not isinstance(submitted_scalars, dict) or set(submitted_scalars) != set(rebuilt["scalars"]):
            raise ReplayError("transcendental scalar inventory mismatch")
        for name, expected in rebuilt["scalars"].items():
            _require_close(
                _mpf(submitted_scalars[name], f"transcendental_point_outputs.{name}"),
                expected,
                independent_tol,
                f"transcendental_point_outputs.{name}",
            )
        discrepancy = payload["discrepancy_measure"]
        if not isinstance(discrepancy, dict) or set(discrepancy) != {
            "atom_weights",
            "continuous_density",
        }:
            raise ReplayError("discrepancy-measure inventory mismatch")
        if discrepancy["continuous_density"] != "-exp(h/2) dh on [0,2*a]":
            raise ReplayError("discrepancy continuous sign or endpoint mutation")
        weights = discrepancy["atom_weights"]
        if not isinstance(weights, list) or len(weights) != len(inventory):
            raise ReplayError("discrepancy atom inventory mismatch")
        for index, ((k, p, _exponent), item) in enumerate(zip(inventory, weights)):
            if not isinstance(item, dict) or set(item) != {
                "location_log_n",
                "weight_Lambda_over_sqrt_n",
            }:
                raise ReplayError(f"discrepancy atom {index} inventory mismatch")
            _require_close(
                _mpf(item["location_log_n"], f"atom {index} location"),
                mp.log(k),
                independent_tol,
                f"atom {index} location",
            )
            _require_close(
                _mpf(item["weight_Lambda_over_sqrt_n"], f"atom {index} weight"),
                mp.log(p) / mp.sqrt(k),
                independent_tol,
                f"atom {index} weight",
            )
        raw = payload["raw_point_matrices"]
        if not isinstance(raw, dict) or tuple(raw.keys()) != MATRIX_NAMES:
            # Producer preserves insertion order; require the exact inventory but
            # not a cached-matrix shortcut.
            if not isinstance(raw, dict) or set(raw) != set(MATRIX_NAMES):
                raise ReplayError("raw matrix inventory mismatch")
        dim = 2 * N + 1
        submitted_matrices: dict[str, mp.matrix] = {}
        for name in MATRIX_NAMES:
            submitted = _read_matrix(raw[name], dim, dim, f"raw_point_matrices.{name}")
            submitted_matrices[name] = submitted
            _require_matrix_close(
                submitted,
                rebuilt["matrices"][name],
                independent_tol,
                f"raw_point_matrices.{name}",
            )
        nf = submitted_matrices["normal_form_Q_equals_cI_plus_A_tail_minus_T_D"]
        source = submitted_matrices["source_Q_equals_pole_minus_arch_minus_prime"]
        residual = submitted_matrices["combined_residual_before_absolute_values"]
        _require_matrix_close(residual, nf - source, serialization_tol, "signed combined residual")
        _require_matrix_close(
            submitted_matrices["normal_form_T_D_equals_atoms_minus_continuous"],
            submitted_matrices["normal_form_T_D_atoms"]
            - submitted_matrices["normal_form_T_D_continuous"],
            serialization_tol,
            "T_D signed decomposition",
        )
        _require_matrix_close(
            nf,
            submitted_matrices["normal_form_c_star_identity"]
            + submitted_matrices["normal_form_A_tail"]
            - submitted_matrices["normal_form_T_D_equals_atoms_minus_continuous"],
            serialization_tol,
            "normal-form signed decomposition",
        )
        _require_matrix_close(
            source,
            submitted_matrices["source_pole"]
            - submitted_matrices["source_archimedean_block_before_outer_minus"]
            - submitted_matrices["source_prime_block_before_outer_minus"],
            serialization_tol,
            "source signed decomposition",
        )
        norms = payload["pre_cancellation_block_norms"]
        if not isinstance(norms, dict) or set(norms) != set(MATRIX_NAMES):
            raise ReplayError("block-norm inventory mismatch")
        for name, matrix in submitted_matrices.items():
            item = norms[name]
            if not isinstance(item, dict) or set(item) != {"max_abs", "frobenius"}:
                raise ReplayError(f"block norm {name} inventory mismatch")
            _require_close(
                _mpf(item["max_abs"], f"norms.{name}.max_abs"),
                _max_abs(matrix),
                serialization_tol,
                f"norms.{name}.max_abs",
            )
            _require_close(
                _mpf(item["frobenius"], f"norms.{name}.frobenius"),
                _frobenius(matrix),
                serialization_tol,
                f"norms.{name}.frobenius",
            )
        diagnostic = payload["cancellation_diagnostic"]
        expected_diagnostic_keys = {
            "pre_cancellation_max_abs_scale",
            "combined_residual_max_abs",
            "pre_cancellation_to_residual_ratio",
            "combined_residual_before_absolute_values",
            "inversion_even_residual_before_absolute_values",
            "inversion_odd_residual_before_absolute_values",
        }
        if not isinstance(diagnostic, dict) or set(diagnostic) != expected_diagnostic_keys:
            raise ReplayError("cancellation diagnostic inventory mismatch")
        if not _same(
            diagnostic["combined_residual_before_absolute_values"],
            raw["combined_residual_before_absolute_values"],
        ):
            raise ReplayError("signed residual was not preserved verbatim before absolute values")
        pre_names = (
            "normal_form_c_star_identity",
            "normal_form_A_tail",
            "normal_form_T_D_atoms",
            "normal_form_T_D_continuous",
            "source_pole",
            "source_archimedean_block_before_outer_minus",
            "source_prime_block_before_outer_minus",
        )
        pre_scale = max(_max_abs(submitted_matrices[name]) for name in pre_names)
        residual_scale = _max_abs(residual)
        _require_close(
            _mpf(diagnostic["pre_cancellation_max_abs_scale"], "pre-cancellation scale"),
            pre_scale,
            serialization_tol,
            "pre-cancellation scale",
        )
        _require_close(
            _mpf(diagnostic["combined_residual_max_abs"], "combined residual max"),
            residual_scale,
            serialization_tol,
            "combined residual max",
        )
        ratio = diagnostic["pre_cancellation_to_residual_ratio"]
        if residual_scale == 0:
            if ratio is not None:
                raise ReplayError("zero residual must have a null cancellation ratio")
        else:
            _require_close(
                _mpf(ratio, "pre-cancellation to residual ratio"),
                pre_scale / residual_scale,
                mp.power(10, -(dps - 8)),
                "pre-cancellation to residual ratio",
            )
        even, odd = _parity_bases(N)
        even_residual = even.T * residual * even
        odd_residual = odd.T * residual * odd
        submitted_even = _read_matrix(
            diagnostic["inversion_even_residual_before_absolute_values"],
            N + 1,
            N + 1,
            "even signed residual",
        )
        submitted_odd = _read_matrix(
            diagnostic["inversion_odd_residual_before_absolute_values"],
            N,
            N,
            "odd signed residual",
        )
        _require_matrix_close(submitted_even, even_residual, serialization_tol, "even signed residual")
        _require_matrix_close(submitted_odd, odd_residual, serialization_tol, "odd signed residual")
        J = _inversion(N)
        checks = payload["checks"]
        expected_check_keys = {
            "independent_prime_inventory_matches_locked_source",
            "normal_form_matches_locked_source_at_declared_point_precision",
            "normal_form_hermitian_defect_max_abs",
            "source_hermitian_defect_max_abs",
            "normal_form_inversion_commutator_max_abs",
            "source_inversion_commutator_max_abs",
            "even_sector_residual_max_abs",
            "odd_sector_residual_max_abs",
            "finite_point_diagnostic_only",
        }
        if not isinstance(checks, dict) or set(checks) != expected_check_keys:
            raise ReplayError("check inventory mismatch")
        independently_small = _max_abs(rebuilt["matrices"]["combined_residual_before_absolute_values"]) <= independent_tol
        if checks["independent_prime_inventory_matches_locked_source"] is not True:
            raise ReplayError("submitted prime-inventory boolean is false")
        if checks["normal_form_matches_locked_source_at_declared_point_precision"] is not (
            residual_scale <= independent_tol
        ):
            raise ReplayError("submitted normal-form comparison boolean is inconsistent")
        if checks["finite_point_diagnostic_only"] is not True:
            raise ReplayError("finite point-arithmetic limitation was removed")
        numeric_checks = {
            "normal_form_hermitian_defect_max_abs": _max_abs(nf - nf.T),
            "source_hermitian_defect_max_abs": _max_abs(source - source.T),
            "normal_form_inversion_commutator_max_abs": _max_abs(nf * J - J * nf),
            "source_inversion_commutator_max_abs": _max_abs(source * J - J * source),
            "even_sector_residual_max_abs": _max_abs(even_residual),
            "odd_sector_residual_max_abs": _max_abs(odd_residual),
        }
        for name, expected in numeric_checks.items():
            _require_close(
                _mpf(checks[name], f"checks.{name}"),
                expected,
                serialization_tol,
                f"checks.{name}",
            )
        if not independently_small or residual_scale > independent_tol:
            raise ReplayError("normal form and source matrix do not agree at certified point tolerance")
        return {
            "schema": REPLAY_SCHEMA,
            "status": REPLAY_STATUS,
            "terminal_state": TERMINAL_STATE,
            "input": {
                "lambda_decimal": lambda_text,
                "N": N,
                "precision_decimal_digits": dps,
            },
            "checks": {
                "independent_formula_tree_reconstructed": True,
                "cached_producer_matrix_trusted": False,
                "producer_booleans_trusted": False,
                "inclusive_prime_power_inventory_reconstructed": True,
                "normal_form_source_agreement": True,
                "even_and_odd_restrictions_replayed": True,
            },
            "independent_combined_residual_max_abs": mp.nstr(
                _max_abs(rebuilt["matrices"]["combined_residual_before_absolute_values"]),
                dps,
            ),
            "shared_arithmetic_library_limitation": (
                "producer and verifier share mpmath transcendental arithmetic; "
                "these are point diagnostics rather than interval or ball enclosures"
            ),
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    raw = args.input.read_bytes()
    payload = _strict_json_loads(raw, str(args.input))
    result = replay(payload)
    text = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output is not None:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
