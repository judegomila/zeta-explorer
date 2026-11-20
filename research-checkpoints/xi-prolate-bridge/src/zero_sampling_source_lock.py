"""Fail-closed source lock for the conditional zero-sampling route.

This module pins published zero-free-region, zero-count, and finite-height
verification statements.  It independently reconstructs the elementary
constants in the dyadic disk/submean argument.  It does *not* prove the
weighted translation lemma, replay either large finite zero computation, or
admit an outer--outer Weil bound.

All decimal inputs enter as strings or exact ``Fraction`` objects.  Binary64
inputs are rejected.
"""

from __future__ import annotations

import argparse
from decimal import Decimal, localcontext
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Any


LOCK_FILENAME = "ZERO_SAMPLING_SOURCE_LOCK.json"
SCHEMA = "xi-prolate-zero-sampling-source-lock-v1"
LOCK_STATUS = (
    "PINNED_EXTERNAL_THEOREM_STATEMENTS_WITH_DISCLOSED_UNREPLAYED_"
    "COMPUTER_ASSISTANCE"
)
CLAIM_CLASS = "CONDITIONAL_ZERO_SAMPLING_INPUTS_ONLY"

VK_CONSTANT = Fraction(55241, 1000)
ZERO_COUNT_LOG = Fraction(103787, 1000000)
ZERO_COUNT_LOGLOG = Fraction(257297, 1000000)
ZERO_COUNT_CONSTANT = Fraction(9367419, 1000000)
HSW_T0 = 30610046000
FINITE_COVER_HEIGHT = 2 * (HSW_T0 + 1)


SOURCE_SPECS: dict[str, dict[str, Any]] = {
    "vinogradov_korobov_zero_free_region": {
        "id": "MTY-ZFR-2212.06867v1",
        "authors": (
            "Michael J. Mossinghoff, Timothy S. Trudgian, and Andrew Yang"
        ),
        "title": "Explicit zero-free regions for the Riemann zeta-function",
        "arxiv_id": "2212.06867",
        "version": "v1",
        "version_date_utc": "2022-12-13T19:16:54Z",
        "arxiv_pdf_url": "https://arxiv.org/pdf/2212.06867v1",
        "version_of_record_doi": "10.1007/s40993-023-00498-y",
        "vendored_path": "vendor/MTY-ZFR-2212.06867v1.pdf",
        "vendored_sha256": (
            "127c32eb86d0aea264cc5b1ba96cc83243ef6b763451591e1560edaca1767300"
        ),
        "pdf_pages": 27,
        "binding_location": (
            "Theorem 1.1, printed page 2, equation (1.5); the all-height "
            "range split is the first paragraph of Section 5 on printed page 11"
        ),
        "locked_constant": "55.241",
        "locked_height_range": "abs(t)>=3",
        "validation_status": (
            "EXACT_V1_PDF_BYTES_HASHED_AND_RELEVANT_PAGES_TEXTUALLY_AND_"
            "VISUALLY_CHECKED"
        ),
    },
    "global_zero_count": {
        "id": "HSW-ZC-2107.06506v1",
        "authors": "Elchin Hasanalizade, Quanli Shen, and Peng-Jie Wong",
        "title": "Counting zeros of the Riemann zeta function",
        "arxiv_id": "2107.06506",
        "version": "v1",
        "version_date_utc": "2021-07-14T06:30:04Z",
        "arxiv_pdf_url": "https://arxiv.org/pdf/2107.06506v1",
        "version_of_record_doi": "10.1016/j.jnt.2021.06.032",
        "vendored_path": "vendor/HSW-ZC-2107.06506v1.pdf",
        "vendored_sha256": (
            "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf"
        ),
        "pdf_pages": 16,
        "binding_location": (
            "Theorem 1.1, printed page 2, equation (1.4), specialized with "
            "T0=30610046000 and the first row of Table 2 on printed page 15"
        ),
        "locked_height_range": "T>=30610046000",
        "zeros_counted_with_multiplicity": True,
        "validation_status": (
            "EXACT_V1_PDF_BYTES_HASHED_AND_RELEVANT_PAGES_TEXTUALLY_AND_"
            "VISUALLY_CHECKED"
        ),
    },
    "finite_height_line_verification": {
        "id": "PT-RH-VERIFY-2004.09765v1",
        "authors": "Dave Platt and Tim Trudgian",
        "title": "The Riemann hypothesis is true up to 3*10^12",
        "arxiv_id": "2004.09765",
        "version": "v1",
        "version_date_utc": "2020-04-21T05:50:50Z",
        "arxiv_pdf_url": "https://arxiv.org/pdf/2004.09765v1",
        "version_of_record_doi": "10.1112/blms.12460",
        "vendored_path": "vendor/PT-RH-VERIFY-2004.09765v1.pdf",
        "vendored_sha256": (
            "3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885"
        ),
        "pdf_pages": 8,
        "binding_location": (
            "Theorem 1 and the Turing-method/Arb description in Section 2, "
            "printed pages 2--3"
        ),
        "exact_verified_height": "3000175332800",
        "validation_status": (
            "EXACT_V1_PDF_BYTES_HASHED_AND_RELEVANT_PAGES_TEXTUALLY_AND_"
            "VISUALLY_CHECKED_BUT_COMPUTATION_NOT_REPLAYED"
        ),
    },
}


LOCKED_FORMULAS = {
    "zero_free_region": (
        "zeta(sigma+i*t)!=0 when abs(t)>=3 and sigma>=1-1/(55.241*"
        "(log(abs(t)))^(2/3)*(log(log(abs(t))))^(1/3))"
    ),
    "zero_count_main": "M(T)=T/(2*pi)*log(T/(2*pi*e))",
    "zero_count_error": (
        "R(T)=0.103787*log(T)+0.257297*log(log(T))+9.367419"
    ),
    "zero_count_theorem": (
        "abs(N(T)-M(T)+1/8)<=R(T) for T>=T0=30610046000"
    ),
    "zero_parameter": "s_rho=gamma+i*(1/2-beta) for rho=beta+i*gamma",
    "functional_equation_reflection": (
        "rho implies 1-conjugate(rho), so neither beta nor 1-beta is replaced "
        "by an assumed value"
    ),
    "block_margin": (
        "delta(T)=1/(55.241*(log(2*T))^(2/3)*(log(log(2*T)))^(1/3)) "
        "for T>=3"
    ),
    "disk_radius": "r(T)=delta(T)/4",
    "disk_vertical_margin": "epsilon(y)>=3*delta(T)/4",
    "local_overlap": (
        "Z(T)=Z_finite for 3<=T<T0+1 and Z(T)=1+log(2*T+1)/pi+"
        "2*R(2*T+1) for T>=T0+1, where U=2*(T0+1) and "
        "Z_finite=1+M(U)-1/8+R(U)"
    ),
    "dyadic_schedule": "T_j=3*2^j for integer j>=0",
    "dyadic_term": (
        "Z(T_j)*(4/3)^q*delta(T_j)^(-(q+2))*"
        "(2*T_j)^(-3*delta(T_j)/4)"
    ),
}


DERIVED_CONSTANTS = {
    "frequency_step": "h=1/(2*T)",
    "frequency_filter_lower_bound": (
        "abs(exp(i*h*x)-1)^2>=1/10 on x in [T-r(T),2*T+r(T)]"
    ),
    "submean_disk_factor": "1/(pi*r(T)^2)=16/(pi*delta(T)^2)",
    "plancherel_filter_factor": "20*pi",
    "positive_height_block_factor": "320",
    "negative_height_and_polarization_slack": "4",
    "global_dyadic_prefactor": "1280",
    "dyadic_stretched_exponential": (
        "exp(-(3/(4*55.241))*(log(2*T))^(1/3)/"
        "(log(log(2*T)))^(1/3))"
    ),
    "finite_lower_block_overlap": (
        "Z_finite=1+M(61220092002)-1/8+R(61220092002)"
    ),
    "low_block_disk_radius": "1/4",
}


FINITE_DEPENDENCIES = {
    "mty_low_range": (
        "MTY Theorem 1.1 uses Platt--Trudgian's rigorous line verification "
        "for 3<=abs(t)<=3*10^12; it also contains numerical optimization of "
        "its high-range constants and imports HSW Corollary 1.2 as equation "
        "(3.8)."
    ),
    "platt_trudgian_method": (
        "The pinned paper reports an Arb ball-arithmetic computation and a "
        "Turing-method count through exact height 3000175332800. This "
        "computation is not replayed in this repository."
    ),
    "hsw_low_range": (
        "HSW Corollary 1.2 uses the asserted bound abs(S(T))<=2.5167 through "
        "30610046000, obtained from a Platt-computed zero database made "
        "available through LMFDB. The sampling-overlap derivation does not use "
        "that corollary directly: finitely many lower dyadic blocks use the "
        "total count supplied by analytic Theorem 1.1 at U=61220092002. "
        "However MTY's published zero-free-region proof imports Corollary 1.2 "
        "as equation (3.8), so the external zero-free input retains this "
        "disclosed indirect database dependency. No database or decimal zero "
        "list is vendored or read."
    ),
    "source_statement_vs_replay": (
        "The three binding statements are treated only as published external "
        "theorems. Exact PDF bytes and formula locations are checked; their "
        "large finite computations are not independently reproduced."
    ),
}


ADMISSION_BOUNDARY = {
    "source_bytes_and_formula_locations_pinned": True,
    "two_sided_margin_uses_functional_equation_not_zero_reality": True,
    "local_count_includes_multiplicity": True,
    "decimal_zero_list_read": False,
    "hsw_database_corollary_used_for_sampling_overlap": False,
    "hsw_database_dependency_indirect_via_mty": True,
    "zeros_assumed_real_or_on_critical_line_globally": False,
    "finite_computations_independently_replayed": False,
    "weighted_translation_lemma_S_proved": False,
    "outer_outer_bound_proved": False,
    "sector_floor_proved": False,
    "equation_5_2_proved": False,
    "locally_uniform_determinant_convergence_proved": False,
    "status_promoted": False,
}


class ZeroSamplingSourceLockError(ValueError):
    """The source lock, source bytes, or claim boundary fail closed."""


def _require_int(value: Any, name: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{name} must be an integer")
    if value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def _decimal(value: Any) -> Decimal:
    if isinstance(value, bool) or isinstance(value, float):
        raise TypeError("binary64 and boolean decimal inputs are forbidden")
    if isinstance(value, Decimal):
        return value
    if isinstance(value, Fraction):
        return Decimal(value.numerator) / Decimal(value.denominator)
    if isinstance(value, int):
        return Decimal(value)
    if isinstance(value, str):
        return Decimal(value)
    raise TypeError("decimal input must be a string, integer, Fraction, or Decimal")


def decimal_pi(precision: int = 80) -> Decimal:
    """Reconstruct pi by Machin's formula, without a cached decimal."""

    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        threshold = Decimal(10) ** (-(precision + 10))

        def arctan_inverse(n: int) -> Decimal:
            x = Decimal(1) / Decimal(n)
            x_squared = x * x
            power = x
            total = x
            index = 1
            while abs(power) > threshold:
                power *= -x_squared
                total += power / Decimal(2 * index + 1)
                index += 1
            return total

        result = Decimal(16) * arctan_inverse(5) - Decimal(4) * arctan_inverse(239)
        ctx.prec = precision
        return +result


def _fractional_power(value: Decimal, numerator: int, denominator: int) -> Decimal:
    return (
        value.ln() * Decimal(numerator) / Decimal(denominator)
    ).exp()


def zero_count_main(value: Any, precision: int = 80) -> Decimal:
    """Reconstruct HSW's main term ``M(T)``."""

    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        t = _decimal(value)
        if t <= 0:
            raise ValueError("T must be positive")
        pi = decimal_pi(precision + 10)
        e = Decimal(1).exp()
        result = t / (2 * pi) * (t / (2 * pi * e)).ln()
        ctx.prec = precision
        return +result


def zero_count_error(value: Any, precision: int = 80) -> Decimal:
    """Reconstruct the analytic HSW Theorem 1.1 envelope ``R(T)``."""

    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        t = _decimal(value)
        if t <= 1:
            raise ValueError("T must exceed one")
        log_t = t.ln()
        result = (
            _decimal(ZERO_COUNT_LOG) * log_t
            + _decimal(ZERO_COUNT_LOGLOG) * log_t.ln()
            + _decimal(ZERO_COUNT_CONSTANT)
        )
        ctx.prec = precision
        return +result


def vk_block_margin(value: Any, precision: int = 80) -> Decimal:
    """Return the uniform MTY margin for ordinates in ``[T,2T)``."""

    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        t = _decimal(value)
        if t < 3:
            raise ValueError("T must be at least 3")
        log_upper = (2 * t).ln()
        denominator = (
            _decimal(VK_CONSTANT)
            * _fractional_power(log_upper, 2, 3)
            * _fractional_power(log_upper.ln(), 1, 3)
        )
        result = Decimal(1) / denominator
        ctx.prec = precision
        return +result


def finite_lower_overlap(precision: int = 80) -> Decimal:
    """Bound every finite lower block without reading a zero database.

    HSW Theorem 1.1 at ``U=2*(T0+1)`` gives

        N(U) <= M(U) - 1/8 + R(U).

    The extra one is harmless integer/end-point slack.
    """

    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        upper = Decimal(FINITE_COVER_HEIGHT)
        result = (
            Decimal(1)
            + zero_count_main(upper, precision + 10)
            - _decimal(Fraction(1, 8))
            + zero_count_error(upper, precision + 10)
        )
        ctx.prec = precision
        return +result


def local_zero_overlap(value: Any, precision: int = 80) -> Decimal:
    """Return the piecewise disk-overlap bound ``Z(T)``.

    Below ``T0+1`` a single total-count bound handles the finitely many blocks.
    At and above ``T0+1`` both endpoints of every overlap interval lie in the
    analytic range of HSW Theorem 1.1.
    """

    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        t = _decimal(value)
        if t < 3:
            raise ValueError("T must be at least 3")
        if t < Decimal(HSW_T0 + 1):
            result = finite_lower_overlap(precision + 10)
            ctx.prec = precision
            return +result
        upper = 2 * t + 1
        pi = decimal_pi(precision + 10)
        result = (
            Decimal(1)
            + upper.ln() / pi
            + 2 * zero_count_error(upper, precision + 10)
        )
        ctx.prec = precision
        return +result


def dyadic_sampling_term(index: int, q: int, precision: int = 80) -> Decimal:
    """Reconstruct one term of the conditional dyadic sampling series."""

    index = _require_int(index, "index", 0)
    q = _require_int(q, "q", 0)
    precision = _require_int(precision, "precision", 30)
    with localcontext() as ctx:
        ctx.prec = precision + 15
        t = Decimal(3) * (Decimal(2) ** index)
        delta = vk_block_margin(t, precision + 10)
        overlap = local_zero_overlap(t, precision + 10)
        exponent = (-Decimal(3) * delta / Decimal(4)) * (2 * t).ln()
        result = (
            overlap
            * (_decimal(Fraction(4, 3)) ** q)
            * (delta ** (-(q + 2)))
            * exponent.exp()
        )
        ctx.prec = precision
        return +result


def frequency_filter_certificate() -> Fraction:
    """Exact rational certificate for the deliberately loose ``1/10`` filter.

    Since ``delta<1`` and ``r=delta/4``, for ``T>=3`` the half-angle is at
    least ``11/48``.  On this range ``sin(u)>=u-u^3/6``.  The returned lower
    bound is therefore below the true filter but strictly above ``1/10``.
    """

    u = Fraction(11, 48)
    sine_lower = u - u**3 / 6
    return 4 * sine_lower**2


def sampling_prefactors() -> dict[str, Fraction]:
    """Return the exact arithmetic behind 320 and 1280."""

    disk_numerator = Fraction(16)
    plancherel_filter_numerator = Fraction(20)
    positive_height = disk_numerator * plancherel_filter_numerator
    global_slack = Fraction(4)
    return {
        "disk_numerator": disk_numerator,
        "plancherel_filter_numerator": plancherel_filter_numerator,
        "positive_height": positive_height,
        "global": positive_height * global_slack,
    }


def diagnostics(precision: int = 80) -> dict[str, str]:
    """Return non-binding arithmetic cross-checks reconstructed from formulas."""

    precision = _require_int(precision, "precision", 30)
    return {
        "delta_T_3": str(vk_block_margin(3, precision)),
        "Z_finite": str(finite_lower_overlap(precision)),
        "Z_high_at_T0_plus_1": str(
            local_zero_overlap(HSW_T0 + 1, precision)
        ),
        "dyadic_term_j0_q2": str(dyadic_sampling_term(0, 2, precision)),
    }


def _require_equal(actual: Any, expected: Any, name: str) -> None:
    if actual != expected:
        raise ZeroSamplingSourceLockError(
            f"locked {name} differs from the admitted value"
        )


def _reject_binary_floats(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ZeroSamplingSourceLockError(f"binary64 value at {path} is forbidden")
    if isinstance(value, dict):
        for key, child in value.items():
            _reject_binary_floats(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_binary_floats(child, f"{path}[{index}]")


def _validate_source_bytes(spec: dict[str, Any], repository_root: Path) -> None:
    relative = Path(spec["vendored_path"])
    if relative.is_absolute() or ".." in relative.parts:
        raise ZeroSamplingSourceLockError("vendored source path escapes repository")
    data = (repository_root / relative).read_bytes()
    if not data.startswith(b"%PDF-"):
        raise ZeroSamplingSourceLockError(f"{relative} is not a PDF")
    digest = hashlib.sha256(data).hexdigest()
    _require_equal(digest, spec["vendored_sha256"], f"source bytes {relative}")


def _validate_open_interval(
    interval: Any, value: Decimal, name: str
) -> None:
    if not isinstance(interval, list) or len(interval) != 2:
        raise ZeroSamplingSourceLockError(f"{name} must be a two-entry interval")
    lower = _decimal(interval[0])
    upper = _decimal(interval[1])
    if not lower < value < upper:
        raise ZeroSamplingSourceLockError(f"{name} does not contain reconstruction")


def validate_payload(payload: dict[str, Any], repository_root: Path) -> None:
    """Validate source hashes, exact formulas, derived constants, and scope."""

    _reject_binary_floats(payload)
    required_top = {
        "schema",
        "lock_status",
        "claim_class",
        "terminal_state",
        "retrieved_date",
        "binding_inputs",
        "locked_source_formulas",
        "independently_derived_sampling_constants",
        "finite_computation_dependencies",
        "diagnostic_cross_checks",
        "admission_boundary",
    }
    _require_equal(set(payload), required_top, "top-level key set")
    _require_equal(payload.get("schema"), SCHEMA, "schema")
    _require_equal(payload.get("lock_status"), LOCK_STATUS, "status")
    _require_equal(payload.get("claim_class"), CLAIM_CLASS, "claim class")
    _require_equal(payload.get("terminal_state"), "P0_INVALIDATED", "terminal state")
    _require_equal(payload.get("retrieved_date"), "2026-08-06", "retrieval date")

    binding = payload.get("binding_inputs")
    _require_equal(binding, SOURCE_SPECS, "binding input inventory")
    for spec in SOURCE_SPECS.values():
        _validate_source_bytes(spec, repository_root)

    _require_equal(
        payload.get("locked_source_formulas"), LOCKED_FORMULAS, "source formulas"
    )
    _require_equal(
        payload.get("independently_derived_sampling_constants"),
        DERIVED_CONSTANTS,
        "sampling constants",
    )
    _require_equal(
        payload.get("finite_computation_dependencies"),
        FINITE_DEPENDENCIES,
        "finite-computation disclosures",
    )
    _require_equal(
        payload.get("admission_boundary"), ADMISSION_BOUNDARY, "admission boundary"
    )

    if frequency_filter_certificate() <= Fraction(1, 10):
        raise ZeroSamplingSourceLockError("frequency-filter certificate failed")
    prefactors = sampling_prefactors()
    _require_equal(prefactors["positive_height"], Fraction(320), "320 prefactor")
    _require_equal(prefactors["global"], Fraction(1280), "1280 prefactor")

    cross = payload.get("diagnostic_cross_checks")
    if not isinstance(cross, dict) or set(cross) != {
        "delta_at_T_3_open_interval",
        "Z_finite_open_interval",
        "Z_high_at_threshold_open_interval",
    }:
        raise ZeroSamplingSourceLockError("diagnostic interval inventory differs")
    _validate_open_interval(
        cross["delta_at_T_3_open_interval"],
        vk_block_margin(3, 100),
        "delta(3) interval",
    )
    _validate_open_interval(
        cross["Z_finite_open_interval"],
        finite_lower_overlap(100),
        "Z_finite interval",
    )
    _validate_open_interval(
        cross["Z_high_at_threshold_open_interval"],
        local_zero_overlap(HSW_T0 + 1, 100),
        "Z_high(T0+1) interval",
    )


def load_and_validate(
    lock_path: Path, repository_root: Path | None = None
) -> dict[str, Any]:
    """Load and validate a source-lock JSON object."""

    lock_path = Path(lock_path)
    root = lock_path.parent if repository_root is None else Path(repository_root)
    payload = json.loads(lock_path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ZeroSamplingSourceLockError("source lock must be a JSON object")
    validate_payload(payload, root)
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--lock",
        type=Path,
        default=Path(__file__).resolve().parents[1] / LOCK_FILENAME,
    )
    parser.add_argument("--dps", type=int, default=80)
    args = parser.parse_args()
    root = args.lock.resolve().parent
    load_and_validate(args.lock, root)
    print(json.dumps(diagnostics(args.dps), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
