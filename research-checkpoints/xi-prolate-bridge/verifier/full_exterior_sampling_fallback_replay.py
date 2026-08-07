#!/usr/bin/env python3
"""Independent replay of the full-Y exterior-sampling fallback.

This verifier imports no producer module and trusts no producer pass boolean,
matrix, eigenvalue, or cached transcendental value.  It validates the pinned
dependency inventory and reconstructs the formulas through an independent
logarithmic assembly.  Producer and verifier both use ``mpmath.iv`` outward
interval arithmetic;
that shared-library limitation is recorded in every replay artifact.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
SOURCE_LOCK_NAME = "FULL_EXTERIOR_SAMPLING_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-full-exterior-sampling-source-lock-v1"
SCHEMA = "xi-prolate-full-exterior-sampling-fallback-artifact-v1"
REPLAY_SCHEMA = "xi-prolate-full-exterior-sampling-fallback-replay-v1"
ARTIFACT_VERSION = "0.19.1-full-exterior-sampling-fallback"
CLAIM_CLASS = "UNCONDITIONAL_FULL_Y_EXTERIOR_SAMPLING_FALLBACK"
TERMINAL_STATE = "P0_INVALIDATED"
INTERVAL_OUTWARD_GUARD_BITS = 32

EXPECTED_DEPENDENCIES = {
    "COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json": (
        "48c1bb3a206b4b7d4b448775a7ed6041a248b345a09fe42ab925c5cd233f0cf4"
    ),
    "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json": (
        "66347adeb8c3e0d497760318370d00949d598a3ba42d5375c27dafc1651b3714"
    ),
    "P1_SOURCE_LOCK.json": (
        "63b83879c52382c6c524b3137b25ea9f1882a24c5518374d487469ecf0e077d2"
    ),
    "ZERO_SAMPLING_SOURCE_LOCK.json": (
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101"
    ),
    "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md": (
        "2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d"
    ),
    "notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md": (
        "76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc"
    ),
    "notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md": (
        "33f064c07a134986afa23efb91f7514e27828543b09cc358ebfff01e79c6f16e"
    ),
    "notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md": (
        "3d6428991a0e66e1c2752c8eec76375576e6f94f68a65891cd3215495e6d4e61"
    ),
    "vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz": (
        "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
    ),
    "vendor/HSW-ZC-2107.06506v1.pdf": (
        "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf"
    ),
}

EXPECTED_CONVENTIONS = {
    "source_domain": "[-lambda,lambda] with Lebesgue measure dx and zero extension",
    "additive_source_parity": "f(-x)=f(x)",
    "arithmetic_map": "A_lambda f(u)=sqrt(u)*sum_{1<=m<=lambda/u} f(m*u)",
    "physical_domain": "I_lambda=[1/lambda,lambda] with measure du/u",
    "inversion": "Jg(u)=g(1/u)",
    "parity_projection": "S_sigma=(I+sigma*J)/2 for sigma in {+1,-1}",
    "log_fourier_projection": "P_N keeps every integer log-Fourier mode |n|<=N",
    "zero_parameter": "s_rho=gamma+i*(1/2-beta) for rho=beta+i*gamma",
    "angular_transform": "F(z)=integral_R f(t)*exp(-i*z*t) dt",
    "paired_sampling": "sum_rho (abs(F(s_rho))^2+abs(F(conjugate(s_rho)))^2)",
    "full_remainder": "Y=(I-P_N*C_lambda)*L and W=P_N*C_lambda*L",
    "radical_identity": "Z*L=0, hence Z*Y=-Z*W",
    "source_matrices": "B=C^*C and D_ext=C^*diag(d_n)C in an orthonormal additive prolate basis",
    "source_kernel_policy": "quotient ker(C)=ker(B)=ker(D_ext); use Moore--Penrose inverses only on the positive quotient",
    "physical_kernel_policy": "restrict the quotient preconditioner to ran(W); ambient zero eigenvalues are not floors",
    "invisible_bump": "a correction supported in abs(x)<1/(2*lambda) is annihilated by A_lambda on I_lambda",
}

EXPECTED_FORMULAS = {
    "even_arithmetic_norm": "norm(A_lambda*f)^2_{L2(I_lambda,du/u)} <= (lambda^2/2)*norm(f)^2_{L2(-lambda,lambda,dx)}",
    "general_arithmetic_norm": "without additive evenness the safe constant is lambda^2, not lambda^2/2",
    "all_index_floor": "d_LS=6*96^(-5-(320*pi/log(2))*lambda^2)",
    "source_floor": "D_ext >= d_LS*B",
    "physical_pullback": "W^*W <= (lambda^2/2)*B <= (lambda^2/(2*d_LS))*D_ext",
    "normalized_synthesis": "M=norm(W*D_ext^(-1/2))^2 <= lambda^2/(2*d_LS)",
    "log_interval_length": "L=2*log(lambda)",
    "unit_window_variation": "V_N^0=(2*pi*N+2*sqrt(2*N+1))/sqrt(L)",
    "unit_window_height": "H_N=max(1,(V_N^0+(3/4)*sqrt(L))^2)",
    "zero_count_main": "M_0(t)=t/(2*pi)*log(t/(2*pi*e))",
    "zero_count_error": "R_0(t)=0.103787*log(t)+0.257297*log(log(t))+9.367419",
    "finite_overlap": "Z_finite=1+M_0(61220092002)-1/8+R_0(61220092002)",
    "log_overlap": "C_Z=1+1/pi+2*(0.103787+0.257297)+2*9.367419",
    "absolute_window_bound": "B_abs=192*sqrt(e)*lambda*(1+log(lambda))^2*(Z_finite+(C_Z/pi)*((pi+1)*log(H_N+2)+1))",
    "full_gram": "Y^*Z^*Z*Y=W^*Z^*Z*W <= B_abs*W^*W",
    "exterior_constant": "C_ext <= B_abs*lambda^2/(2*d_LS)=(lambda^2*B_abs/12)*96^(5+(320*pi/log(2))*lambda^2)",
    "alignment_product": "C_ext*M <= B_abs*lambda^4/(4*d_LS^2)",
    "fixed_parity_complexification": "paired sampling gives the same B_abs to the complexification of either fixed real parity sector; no extra factor 2",
}

EXPECTED_CLAIM_BOUNDARY = {
    "proved": [
        "the explicit even arithmetic-map norm upper bound lambda^2/2",
        "an explicit unconditional full-cross-term source Gram bound for Y^*Z^*Z*Y",
        "an explicit all-index quotient normalized-synthesis bound",
        "the displayed two-defect-loss alignment upper bound",
    ],
    "not_proved": [
        "the target-scale estimate C_ext*M=O(1/d_8)",
        "a defect-relative exterior sampling constant",
        "either shifted signed parity-sector comparison",
        "equation (5.2) or locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

EXPECTED_FLAGS = {
    "even_arithmetic_norm_lambda_squared_over_two_proved": True,
    "full_cross_term_gram_retained": True,
    "state_invisible_bump_retained_inside_Y": True,
    "ordinary_inverse_on_source_kernel_used": False,
    "moore_penrose_positive_quotient_used": True,
    "fixed_parity_extra_factor_two_used": False,
    "real_zeta_zero_list_used": False,
    "global_zero_reality_assumed": False,
    "global_weil_positivity_assumed": False,
    "target_scale_C_ext_M_O_inverse_d8_proved": False,
    "shifted_signed_sector_comparison_proved": False,
    "equation_5_2_proved": False,
    "locally_uniform_determinant_convergence_proved": False,
    "riemann_hypothesis_proved": False,
    "status_promoted": False,
    "outward_interval_artifact": True,
}

VALUE_KEYS = {
    "lambda",
    "log_lambda",
    "log_interval_length_L",
    "unit_window_variation_V_N_zero",
    "unit_window_height_H_N",
    "Z_finite",
    "C_Z",
    "B_abs",
    "defect_exponent_E",
    "d_LS",
    "even_arithmetic_norm_squared_factor",
    "general_arithmetic_norm_squared_factor",
    "normalized_synthesis_M_upper",
    "C_ext_upper",
    "C_ext_expanded_upper",
    "alignment_product_upper",
    "alignment_product_expanded_upper",
    "negative_log10_d_LS",
    "log10_C_ext_upper",
    "log10_alignment_product_upper",
}

EXPECTED_INTERPRETATION = (
    "unconditional full-cross-term exterior sampling fallback; the alignment "
    "bound pays d_LS^(-2), is exponentially enormous, and does not close the "
    "O(1/d_8) target"
)
EXPECTED_CLAIM_SCOPE = (
    "analytic source-pinned inequalities plus outward interval evaluation "
    "of closed-form constants; not an asymptotic proof"
)
EXPECTED_LIBRARY_LIMITATION = (
    "producer and independent verifier both use mpmath.iv for outward "
    "transcendental intervals while assembling formulas separately"
)


class ReplayError(ValueError):
    """An artifact, source, or formula contract failed closed."""


@dataclass(frozen=True)
class ClosedInterval:
    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ReplayError("interval endpoints are reversed")


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _reject_float(value: Any, path: str = "payload") -> None:
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, dict):
        for key, child in value.items():
            _reject_float(child, f"{path}.{key}")
    elif isinstance(value, list):
        for index, child in enumerate(value):
            _reject_float(child, f"{path}[{index}]")


def _load_object(path: Path, label: str) -> dict[str, object]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"cannot read {label}") from exc
    if not isinstance(value, dict):
        raise ReplayError(f"{label} must decode to an object")
    _reject_float(value, label)
    return value


def _require_int(value: object, label: str, minimum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact integer, never binary64")
    if minimum is not None and value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _require_decimal(value: object, label: str) -> mp.mpf:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be decimal text, never binary64")
    try:
        parsed = mp.mpf(value)
    except (ValueError, TypeError) as exc:
        raise ReplayError(f"invalid decimal value for {label}") from exc
    if not mp.isfinite(parsed):
        raise ReplayError(f"nonfinite decimal value for {label}")
    return parsed


def _copy_interval(value: object, dps: int) -> ClosedInterval:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        return ClosedInterval(mp.mpf(raw_lower), mp.mpf(raw_upper))


def _parse_dyadic(value: object, label: str) -> mp.mpf:
    if not isinstance(value, dict) or set(value) != {
        "sign",
        "mantissa_decimal_text",
        "binary_exponent",
    }:
        raise ReplayError(f"{label} is not an exact dyadic endpoint")
    sign = _require_int(value.get("sign"), f"{label}.sign", 0)
    if sign not in (0, 1):
        raise ReplayError(f"{label}.sign must be zero or one")
    mantissa_text = value.get("mantissa_decimal_text")
    if not isinstance(mantissa_text, str) or not mantissa_text.isdigit():
        raise ReplayError(f"{label}.mantissa must be unsigned decimal text")
    mantissa = int(mantissa_text)
    exponent = _require_int(value.get("binary_exponent"), f"{label}.exponent")
    bit_count = max(1, mantissa.bit_length())
    return mp.mpf((sign, mantissa, exponent, bit_count))


def _parse_interval(value: object, label: str) -> ClosedInterval:
    if not isinstance(value, dict) or set(value) != {
        "endpoint_format",
        "lower_exact_dyadic",
        "upper_exact_dyadic",
        "decimal_display_only",
    }:
        raise ReplayError(f"{label} interval record mismatch")
    if value.get("endpoint_format") != "signed_mantissa_times_2_power_v1":
        raise ReplayError(f"{label} endpoint format mismatch")
    display = value.get("decimal_display_only")
    if (
        not isinstance(display, list)
        or len(display) != 2
        or not all(isinstance(item, str) for item in display)
    ):
        raise ReplayError(f"{label} decimal display is invalid")
    lower = _parse_dyadic(value.get("lower_exact_dyadic"), f"{label}.lower")
    upper = _parse_dyadic(value.get("upper_exact_dyadic"), f"{label}.upper")
    return ClosedInterval(lower, upper)


def _serialize_dyadic(value: mp.mpf) -> dict[str, object]:
    sign, mantissa, exponent, _bit_count = value._mpf_
    return {
        "sign": int(sign),
        "mantissa_decimal_text": str(mantissa),
        "binary_exponent": int(exponent),
    }


def _serialize_interval(interval: ClosedInterval, digits: int) -> dict[str, object]:
    return {
        "endpoint_format": "signed_mantissa_times_2_power_v1",
        "lower_exact_dyadic": _serialize_dyadic(interval.lower),
        "upper_exact_dyadic": _serialize_dyadic(interval.upper),
        "decimal_display_only": [
            mp.nstr(interval.lower, digits),
            mp.nstr(interval.upper, digits),
        ],
    }


def _overlap(left: ClosedInterval, right: ClosedInterval) -> bool:
    return max(left.lower, right.lower) <= min(left.upper, right.upper)


def _validate_source_lock(root: Path) -> dict[str, object]:
    lock = _load_object(root / SOURCE_LOCK_NAME, "full exterior source lock")
    expected_top = {
        "schema",
        "claim_class",
        "terminal_state",
        "updated_date",
        "dependencies",
        "locked_conventions",
        "locked_formulas",
        "claim_boundary",
    }
    if set(lock) != expected_top:
        raise ReplayError("full exterior source-lock inventory mismatch")
    if lock.get("schema") != SOURCE_LOCK_SCHEMA:
        raise ReplayError("full exterior source-lock schema mismatch")
    if lock.get("claim_class") != CLAIM_CLASS:
        raise ReplayError("full exterior source-lock claim class mismatch")
    if lock.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("full exterior source lock promotes status")
    if lock.get("updated_date") != "2026-08-07":
        raise ReplayError("full exterior source-lock date mismatch")
    if lock.get("locked_conventions") != EXPECTED_CONVENTIONS:
        raise ReplayError("full exterior convention mutation")
    if lock.get("locked_formulas") != EXPECTED_FORMULAS:
        raise ReplayError("full exterior formula mutation")
    if lock.get("claim_boundary") != EXPECTED_CLAIM_BOUNDARY:
        raise ReplayError("full exterior claim-boundary mutation")

    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list) or len(dependencies) != len(
        EXPECTED_DEPENDENCIES
    ):
        raise ReplayError("full exterior dependency inventory mismatch")
    seen: set[str] = set()
    root_resolved = root.resolve()
    for dependency in dependencies:
        if not isinstance(dependency, dict) or set(dependency) != {
            "path",
            "sha256",
            "role",
        }:
            raise ReplayError("invalid full exterior dependency record")
        relative = dependency.get("path")
        expected = dependency.get("sha256")
        role = dependency.get("role")
        if not isinstance(relative, str) or not isinstance(expected, str):
            raise ReplayError("invalid dependency path or hash")
        if not isinstance(role, str) or not role:
            raise ReplayError("dependency role is missing")
        relative_path = Path(relative)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            raise ReplayError("unsafe dependency path")
        if relative in seen:
            raise ReplayError("duplicate dependency path")
        seen.add(relative)
        if EXPECTED_DEPENDENCIES.get(relative) != expected:
            raise ReplayError(f"unexpected dependency hash: {relative}")
        target = (root / relative_path).resolve()
        try:
            target.relative_to(root_resolved)
        except ValueError as exc:
            raise ReplayError("dependency escapes repository") from exc
        if not target.is_file() or _sha256(target) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
    if seen != set(EXPECTED_DEPENDENCIES):
        raise ReplayError("full exterior dependency set mismatch")

    compact = _load_object(
        root / "COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json",
        "compact sampling source lock",
    )
    if compact.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("compact sampling source lock promotes status")
    constants = compact.get("locked_constants")
    if not isinstance(constants, dict):
        raise ReplayError("compact sampling constants are missing")
    if constants.get("defect_lower") != EXPECTED_FORMULAS["all_index_floor"].replace(
        "d_LS", "d_lower"
    ):
        raise ReplayError("compact sampling defect floor mutation")

    projection = _load_object(
        root / "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json",
        "defect projection source lock",
    )
    if projection.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("defect projection source lock promotes status")
    conventions = projection.get("locked_project_conventions")
    if not isinstance(conventions, dict):
        raise ReplayError("defect projection conventions are missing")
    if conventions.get("source_interval") != "[-lambda,lambda]":
        raise ReplayError("source interval mutation")
    if conventions.get("source_measure") != "Lebesgue dx":
        raise ReplayError("source measure mutation")
    if conventions.get("zero_extension") != "h_n is zero outside [-lambda,lambda]":
        raise ReplayError("zero-extension mutation")

    zero_lock = _load_object(
        root / "ZERO_SAMPLING_SOURCE_LOCK.json", "zero sampling source lock"
    )
    admission = zero_lock.get("admission_boundary")
    if not isinstance(admission, dict):
        raise ReplayError("zero sampling admission boundary is missing")
    if admission.get("decimal_zero_list_read") is not False:
        raise ReplayError("a decimal zero list was used")
    if admission.get("zeros_assumed_real_or_on_critical_line_globally") is not False:
        raise ReplayError("global zero reality was assumed")
    if admission.get("status_promoted") is not False:
        raise ReplayError("zero sampling status was promoted")
    return lock


def _reconstruct_values(
    fraction: Fraction, cutoff: int, precision: int
) -> dict[str, mp.mpf]:
    """Independent logarithmic reconstruction of every displayed value."""

    with mp.workdps(precision):
        lam = mp.mpf(fraction.numerator) / mp.mpf(fraction.denominator)
        log_lambda = mp.log(lam)
        length = mp.fsum([log_lambda, log_lambda])
        root_length = mp.sqrt(length)
        variation = (
            mp.fsum([2 * mp.pi * cutoff, 2 * mp.sqrt(2 * cutoff + 1)])
            / root_length
        )
        shifted_variation = variation + mp.mpf(3) * root_length / 4
        height = max(mp.mpf(1), shifted_variation * shifted_variation)

        upper = mp.mpf("61220092002")
        main = upper * mp.log(upper / (2 * mp.pi * mp.e)) / (2 * mp.pi)
        error = mp.fsum(
            [
                mp.mpf("0.103787") * mp.log(upper),
                mp.mpf("0.257297") * mp.log(mp.log(upper)),
                mp.mpf("9.367419"),
            ]
        )
        z_finite = mp.fsum([mp.mpf(1), main, -mp.mpf(1) / 8, error])
        c_z = mp.fsum(
            [
                mp.mpf(1),
                1 / mp.pi,
                2 * mp.mpf("0.103787"),
                2 * mp.mpf("0.257297"),
                2 * mp.mpf("9.367419"),
            ]
        )
        sampling_bracket = z_finite + c_z * (
            (mp.pi + 1) * mp.log(height + 2) + 1
        ) / mp.pi
        b_abs = (
            mp.mpf(192)
            * mp.exp(mp.mpf(1) / 2)
            * lam
            * mp.power(1 + log_lambda, 2)
            * sampling_bracket
        )

        exponent = 5 + (mp.mpf(320) * mp.pi * lam * lam) / mp.log(2)
        log_d_ls = mp.log(6) - exponent * mp.log(96)
        d_ls = mp.exp(log_d_ls)
        even_factor = lam * lam / 2
        general_factor = lam * lam
        synthesis_upper = mp.exp(mp.log(even_factor) - log_d_ls)
        exterior_upper = mp.exp(mp.log(b_abs) + mp.log(even_factor) - log_d_ls)
        exterior_expanded = mp.exp(
            mp.log(lam * lam * b_abs / 12) + exponent * mp.log(96)
        )
        alignment_upper = mp.exp(
            mp.log(b_abs * lam**4 / 4) - 2 * log_d_ls
        )
        alignment_expanded = mp.exp(
            mp.log(b_abs * lam**4 / 144) + 2 * exponent * mp.log(96)
        )

        return {
            "lambda": +lam,
            "log_lambda": +log_lambda,
            "log_interval_length_L": +length,
            "unit_window_variation_V_N_zero": +variation,
            "unit_window_height_H_N": +height,
            "Z_finite": +z_finite,
            "C_Z": +c_z,
            "B_abs": +b_abs,
            "defect_exponent_E": +exponent,
            "d_LS": +d_ls,
            "even_arithmetic_norm_squared_factor": +even_factor,
            "general_arithmetic_norm_squared_factor": +general_factor,
            "normalized_synthesis_M_upper": +synthesis_upper,
            "C_ext_upper": +exterior_upper,
            "C_ext_expanded_upper": +exterior_expanded,
            "alignment_product_upper": +alignment_upper,
            "alignment_product_expanded_upper": +alignment_expanded,
            "negative_log10_d_LS": -log_d_ls / mp.log(10),
            "log10_C_ext_upper": mp.log(exterior_upper) / mp.log(10),
            "log10_alignment_product_upper": mp.log(alignment_upper) / mp.log(10),
        }


def _reconstruct_intervals(
    fraction: Fraction, cutoff: int, precision: int
) -> dict[str, ClosedInterval]:
    """Independent interval tree for every closed-form constant."""

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = precision
        lam = mp.iv.mpf(fraction.numerator) / mp.iv.mpf(fraction.denominator)
        ell = mp.iv.log(lam)
        length = mp.iv.fsum([ell, ell])
        root_length = mp.iv.sqrt(length)
        variation = mp.iv.fsum(
            [2 * mp.iv.pi * cutoff, 2 * mp.iv.sqrt(2 * cutoff + 1)]
        ) / root_length
        shifted = variation + 3 * root_length / 4
        height = shifted * shifted
        if _copy_interval(height, precision).lower <= 1:
            raise ReplayError("independent unit-window height branch unresolved")

        upper = mp.iv.mpf("61220092002")
        main = upper * mp.iv.log(upper / (2 * mp.iv.pi * mp.iv.e)) / (
            2 * mp.iv.pi
        )
        error = mp.iv.fsum(
            [
                mp.iv.mpf("0.103787") * mp.iv.log(upper),
                mp.iv.mpf("0.257297") * mp.iv.log(mp.iv.log(upper)),
                mp.iv.mpf("9.367419"),
            ]
        )
        z_finite = mp.iv.fsum([1, main, -mp.iv.mpf(1) / 8, error])
        c_z = mp.iv.fsum(
            [
                1,
                1 / mp.iv.pi,
                2 * mp.iv.mpf("0.103787"),
                2 * mp.iv.mpf("0.257297"),
                2 * mp.iv.mpf("9.367419"),
            ]
        )
        bracket = z_finite + c_z * (
            (mp.iv.pi + 1) * mp.iv.log(height + 2) + 1
        ) / mp.iv.pi
        b_abs = (
            192
            * mp.iv.exp(mp.iv.mpf(1) / 2)
            * lam
            * mp.iv.power(1 + ell, 2)
            * bracket
        )

        exponent = 5 + 320 * mp.iv.pi * lam**2 / mp.iv.log(2)
        log_d_ls = mp.iv.log(6) - exponent * mp.iv.log(96)
        d_ls = mp.iv.exp(log_d_ls)
        even_factor = lam**2 / 2
        general_factor = lam**2
        synthesis = mp.iv.exp(mp.iv.log(even_factor) - log_d_ls)
        exterior = mp.iv.exp(mp.iv.log(b_abs * even_factor) - log_d_ls)
        exterior_expanded = mp.iv.exp(
            mp.iv.log(lam**2 * b_abs / 12) + exponent * mp.iv.log(96)
        )
        alignment = mp.iv.exp(
            mp.iv.log(b_abs * lam**4 / 4) - 2 * log_d_ls
        )
        alignment_expanded = mp.iv.exp(
            mp.iv.log(b_abs * lam**4 / 144) + 2 * exponent * mp.iv.log(96)
        )
        raw = {
            "lambda": lam,
            "log_lambda": ell,
            "log_interval_length_L": length,
            "unit_window_variation_V_N_zero": variation,
            "unit_window_height_H_N": height,
            "Z_finite": z_finite,
            "C_Z": c_z,
            "B_abs": b_abs,
            "defect_exponent_E": exponent,
            "d_LS": d_ls,
            "even_arithmetic_norm_squared_factor": even_factor,
            "general_arithmetic_norm_squared_factor": general_factor,
            "normalized_synthesis_M_upper": synthesis,
            "C_ext_upper": exterior,
            "C_ext_expanded_upper": exterior_expanded,
            "alignment_product_upper": alignment,
            "alignment_product_expanded_upper": alignment_expanded,
            "negative_log10_d_LS": -log_d_ls / mp.iv.log(10),
            "log10_C_ext_upper": mp.iv.log(exterior) / mp.iv.log(10),
            "log10_alignment_product_upper": (
                mp.iv.log(alignment) / mp.iv.log(10)
            ),
        }
        result = {
            key: _copy_interval(value, precision) for key, value in raw.items()
        }
    finally:
        mp.iv.dps = old_iv_dps
    if result["d_LS"].lower <= 0:
        raise ReplayError("independent defect interval lost strict positivity")
    return result


def _require_relative_close(
    actual: mp.mpf, expected: mp.mpf, tolerance: mp.mpf, label: str
) -> None:
    if expected == 0:
        if abs(actual) > tolerance:
            raise ReplayError(f"{label} differs from independent reconstruction")
        return
    if abs(actual / expected - 1) > tolerance:
        raise ReplayError(f"{label} differs from independent reconstruction")


def replay_artifact(
    artifact: dict[str, object], dps: int = 120, root: Path = ROOT
) -> dict[str, object]:
    _reject_float(artifact)
    precision = _require_int(dps, "replay decimal precision", 40)
    expected_top = {
        "schema",
        "artifact_version",
        "claim_class",
        "terminal_state",
        "construction",
        "precision_decimal_digits",
        "interval_outward_guard_bits",
        "exact_inputs",
        "source_lock",
        "provenance_sha256",
        "formula_contract",
        "values",
        "outward_intervals",
        "theorem_flags",
        "interpretation",
        "claim_scope",
        "arithmetic_library_limitation",
    }
    if set(artifact) != expected_top:
        raise ReplayError("full exterior artifact inventory mismatch")
    if artifact.get("schema") != SCHEMA:
        raise ReplayError("full exterior artifact schema mismatch")
    if artifact.get("artifact_version") != ARTIFACT_VERSION:
        raise ReplayError("unsupported full exterior artifact version")
    if artifact.get("claim_class") != CLAIM_CLASS:
        raise ReplayError("full exterior artifact claim class mismatch")
    if artifact.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("full exterior artifact promotes project status")
    if artifact.get("construction") != "source_explicit_full_Y_two_defect_fallback_v1":
        raise ReplayError("unknown full exterior construction")
    producer_precision = _require_int(
        artifact.get("precision_decimal_digits"),
        "producer decimal precision",
        40,
    )
    guard_bits = _require_int(
        artifact.get("interval_outward_guard_bits"),
        "interval outward guard bits",
        0,
    )
    if guard_bits != INTERVAL_OUTWARD_GUARD_BITS:
        raise ReplayError("interval outward guard mutation")
    if artifact.get("formula_contract") != EXPECTED_FORMULAS:
        raise ReplayError("artifact formula contract mismatch")
    if artifact.get("theorem_flags") != EXPECTED_FLAGS:
        raise ReplayError("artifact theorem flags or claim boundary mismatch")
    if artifact.get("interpretation") != EXPECTED_INTERPRETATION:
        raise ReplayError("artifact interpretation mutation")
    if artifact.get("claim_scope") != EXPECTED_CLAIM_SCOPE:
        raise ReplayError("artifact claim scope mutation")
    if artifact.get("arithmetic_library_limitation") != EXPECTED_LIBRARY_LIMITATION:
        raise ReplayError("artifact arithmetic-library disclosure mutation")

    source_lock = _validate_source_lock(root)
    source_record = artifact.get("source_lock")
    if not isinstance(source_record, dict) or set(source_record) != {
        "path",
        "sha256",
        "schema",
    }:
        raise ReplayError("artifact source-lock record mismatch")
    if source_record.get("path") != SOURCE_LOCK_NAME:
        raise ReplayError("artifact source-lock path mismatch")
    if source_record.get("schema") != SOURCE_LOCK_SCHEMA:
        raise ReplayError("artifact source-lock schema mismatch")
    if source_record.get("sha256") != _sha256(root / SOURCE_LOCK_NAME):
        raise ReplayError("artifact source-lock hash mismatch")
    if source_lock.get("locked_formulas") != EXPECTED_FORMULAS:
        raise ReplayError("validated source formula contract changed")

    provenance = artifact.get("provenance_sha256")
    expected_provenance = {
        "notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md",
        "src/full_exterior_sampling_fallback.py",
        "verifier/full_exterior_sampling_fallback_replay.py",
    }
    if not isinstance(provenance, dict) or set(provenance) != expected_provenance:
        raise ReplayError("artifact provenance inventory mismatch")
    for relative in expected_provenance:
        if provenance.get(relative) != _sha256(root / relative):
            raise ReplayError(f"artifact provenance hash mismatch: {relative}")

    exact_inputs = artifact.get("exact_inputs")
    if not isinstance(exact_inputs, dict) or set(exact_inputs) != {
        "lambda_numerator",
        "lambda_denominator",
        "fourier_cutoff_N",
    }:
        raise ReplayError("artifact exact-input inventory mismatch")
    numerator = _require_int(exact_inputs.get("lambda_numerator"), "lambda numerator", 1)
    denominator = _require_int(
        exact_inputs.get("lambda_denominator"), "lambda denominator", 1
    )
    cutoff = _require_int(exact_inputs.get("fourier_cutoff_N"), "Fourier cutoff N", 0)
    fraction = Fraction(numerator, denominator)
    if fraction < 2:
        raise ReplayError("lambda must be at least two")
    if (fraction.numerator, fraction.denominator) != (numerator, denominator):
        raise ReplayError("lambda rational input is not canonical")

    values = artifact.get("values")
    if not isinstance(values, dict) or set(values) != VALUE_KEYS:
        raise ReplayError("artifact value inventory mismatch")
    outward_payload = artifact.get("outward_intervals")
    if not isinstance(outward_payload, dict) or set(outward_payload) != VALUE_KEYS:
        raise ReplayError("artifact outward-interval inventory mismatch")
    work_precision = max(precision, producer_precision + 30)
    with mp.workdps(work_precision):
        reconstructed = _reconstruct_values(fraction, cutoff, work_precision)
        reconstructed_intervals = _reconstruct_intervals(
            fraction, cutoff, max(precision, producer_precision)
        )
        tolerance = mp.power(10, -min(precision, producer_precision) + 10)
        parsed: dict[str, mp.mpf] = {}
        parsed_intervals: dict[str, ClosedInterval] = {}
        for key in sorted(VALUE_KEYS):
            parsed[key] = _require_decimal(values.get(key), f"values.{key}")
            _require_relative_close(parsed[key], reconstructed[key], tolerance, key)
            parsed_intervals[key] = _parse_interval(
                outward_payload.get(key), f"outward_intervals.{key}"
            )
            display_scale = max(
                abs(parsed[key]),
                abs(parsed_intervals[key].lower),
                abs(parsed_intervals[key].upper),
            )
            display_padding = tolerance * display_scale
            if not (
                parsed_intervals[key].lower - display_padding
                <= parsed[key]
                <= parsed_intervals[key].upper + display_padding
            ):
                raise ReplayError(f"point display escapes outward interval: {key}")
            if not (
                parsed_intervals[key].lower
                <= reconstructed_intervals[key].lower
                <= reconstructed_intervals[key].upper
                <= parsed_intervals[key].upper
            ):
                raise ReplayError(
                    f"independent outward interval escapes producer enclosure: {key}"
                )

        if parsed["general_arithmetic_norm_squared_factor"] != 2 * parsed[
            "even_arithmetic_norm_squared_factor"
        ]:
            raise ReplayError("the additive-even factor one half was lost")
        _require_relative_close(
            parsed["C_ext_upper"],
            parsed["B_abs"] * parsed["normalized_synthesis_M_upper"],
            tolerance,
            "full Gram exterior constant",
        )
        _require_relative_close(
            parsed["alignment_product_upper"],
            parsed["C_ext_upper"] * parsed["normalized_synthesis_M_upper"],
            tolerance,
            "two-defect alignment product",
        )
        _require_relative_close(
            parsed["C_ext_expanded_upper"],
            parsed["C_ext_upper"],
            tolerance,
            "expanded exterior constant",
        )
        _require_relative_close(
            parsed["alignment_product_expanded_upper"],
            parsed["alignment_product_upper"],
            tolerance,
            "expanded alignment product",
        )

        serialized_values = {
            key: mp.nstr(reconstructed[key], precision) for key in sorted(VALUE_KEYS)
        }
        serialized_intervals = {
            key: _serialize_interval(reconstructed_intervals[key], precision + 12)
            for key in sorted(VALUE_KEYS)
        }
        maximum_relative_error = max(
            abs(parsed[key] / reconstructed[key] - 1) for key in VALUE_KEYS
        )

    return {
        "schema": REPLAY_SCHEMA,
        "artifact_version": ARTIFACT_VERSION,
        "terminal_state": TERMINAL_STATE,
        "producer_precision_decimal_digits": producer_precision,
        "producer_interval_outward_guard_bits": guard_bits,
        "replay_precision_decimal_digits": precision,
        "producer_artifact_sha256": "computed_by_cli",
        "source_lock_sha256": _sha256(root / SOURCE_LOCK_NAME),
        "independent_formula_assembly": True,
        "producer_module_imported": False,
        "producer_booleans_trusted": False,
        "cached_matrix_or_eigenvalue_read": False,
        "full_cross_term_gram_required": True,
        "source_kernel_quotiented": True,
        "target_scale_closed": False,
        "producer_outward_intervals_replayed": True,
        "maximum_relative_replay_error": mp.nstr(maximum_relative_error, precision),
        "reconstructed_values": serialized_values,
        "reconstructed_outward_intervals": serialized_intervals,
        "arithmetic_library_limitation": EXPECTED_LIBRARY_LIMITATION,
        "claim_scope": EXPECTED_CLAIM_SCOPE,
    }


def _serialize(value: Any, digits: int) -> Any:
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item, digits) for item in value]
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--dps", type=int, default=120)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    artifact = _load_object(args.artifact, "producer artifact")
    replay = replay_artifact(artifact, args.dps)
    replay["producer_artifact_sha256"] = _sha256(args.artifact)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(_serialize(replay, args.dps), indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
