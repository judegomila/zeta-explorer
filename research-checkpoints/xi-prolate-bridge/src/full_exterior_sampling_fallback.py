#!/usr/bin/env python3
"""Source-explicit unconditional full-Y exterior-sampling fallback.

The analytic proof is in ``notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md``.
This producer evaluates the locked finite formulas with arbitrary-precision
point arithmetic.  The two-defect-loss bound is exponentially too large for
the quotient alignment target; it proves neither equation (5.2) nor RH.
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
SOURCE_LOCK_PATH = ROOT / SOURCE_LOCK_NAME
SOURCE_LOCK_SCHEMA = "xi-prolate-full-exterior-sampling-source-lock-v1"
SCHEMA = "xi-prolate-full-exterior-sampling-fallback-artifact-v1"
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

THEOREM_FLAGS = {
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


class SourceLockError(ValueError):
    """A source or formula contract failed closed."""


@dataclass(frozen=True)
class RealInterval:
    lower: mp.mpf
    upper: mp.mpf

    def __post_init__(self) -> None:
        if self.lower > self.upper:
            raise ValueError("interval endpoints are reversed")


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _require_int(value: object, label: str, minimum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer, never binary64")
    if minimum is not None and value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def validate_source_lock_payload(
    payload: dict[str, object], root: Path = ROOT
) -> dict[str, object]:
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
    if set(payload) != expected_top:
        raise SourceLockError("full exterior source-lock inventory mismatch")
    if payload.get("schema") != SOURCE_LOCK_SCHEMA:
        raise SourceLockError("full exterior source-lock schema mismatch")
    if payload.get("claim_class") != CLAIM_CLASS:
        raise SourceLockError("full exterior source-lock claim class mismatch")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise SourceLockError("full exterior source lock promotes project status")
    if payload.get("updated_date") != "2026-08-07":
        raise SourceLockError("full exterior source-lock date mismatch")
    if payload.get("locked_conventions") != EXPECTED_CONVENTIONS:
        raise SourceLockError("full exterior convention contract mismatch")
    if payload.get("locked_formulas") != EXPECTED_FORMULAS:
        raise SourceLockError("full exterior formula contract mismatch")
    if payload.get("claim_boundary") != EXPECTED_CLAIM_BOUNDARY:
        raise SourceLockError("full exterior claim boundary mismatch")

    dependencies = payload.get("dependencies")
    if not isinstance(dependencies, list) or len(dependencies) != len(
        EXPECTED_DEPENDENCIES
    ):
        raise SourceLockError("full exterior dependency inventory mismatch")
    seen: set[str] = set()
    root_resolved = root.resolve()
    for dependency in dependencies:
        if not isinstance(dependency, dict):
            raise SourceLockError("source-lock dependency must be an object")
        if set(dependency) != {"path", "sha256", "role"}:
            raise SourceLockError("source-lock dependency fields mismatch")
        relative = dependency.get("path")
        expected = dependency.get("sha256")
        role = dependency.get("role")
        if not isinstance(relative, str) or not isinstance(expected, str):
            raise SourceLockError("invalid source-lock dependency")
        if not isinstance(role, str) or not role:
            raise SourceLockError("source-lock dependency role is missing")
        relative_path = Path(relative)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            raise SourceLockError("unsafe source-lock dependency path")
        if relative in seen:
            raise SourceLockError("duplicate source-lock dependency")
        seen.add(relative)
        if EXPECTED_DEPENDENCIES.get(relative) != expected:
            raise SourceLockError(f"unexpected dependency hash: {relative}")
        target = (root / relative_path).resolve()
        try:
            target.relative_to(root_resolved)
        except ValueError as exc:
            raise SourceLockError("dependency escapes repository") from exc
        if not target.is_file() or _sha256(target) != expected:
            raise SourceLockError(f"dependency hash mismatch: {relative}")
    if seen != set(EXPECTED_DEPENDENCIES):
        raise SourceLockError("full exterior dependency set mismatch")
    return payload


def verify_source_lock(root: Path = ROOT) -> dict[str, object]:
    try:
        payload = json.loads((root / SOURCE_LOCK_NAME).read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise SourceLockError("cannot read full exterior source lock") from exc
    if not isinstance(payload, dict):
        raise SourceLockError("full exterior source lock must be an object")
    return validate_source_lock_payload(payload, root)


def overlap_constants() -> tuple[mp.mpf, mp.mpf]:
    """Reconstruct the locked HSW overlap constants."""

    upper = mp.mpf(61220092002)
    main = upper / (2 * mp.pi) * mp.log(upper / (2 * mp.pi * mp.e))
    error = (
        mp.mpf("0.103787") * mp.log(upper)
        + mp.mpf("0.257297") * mp.log(mp.log(upper))
        + mp.mpf("9.367419")
    )
    z_finite = 1 + main - mp.mpf(1) / 8 + error
    c_z = (
        1
        + 1 / mp.pi
        + 2 * (mp.mpf("0.103787") + mp.mpf("0.257297"))
        + 2 * mp.mpf("9.367419")
    )
    return z_finite, c_z


def _copy_interval(value: object, dps: int) -> RealInterval:
    raw_lower, raw_upper = value._mpi_  # type: ignore[attr-defined]
    with mp.workdps(dps + 20):
        return RealInterval(mp.mpf(raw_lower), mp.mpf(raw_upper))


def _outward_intervals(
    fraction: Fraction, cutoff: int, dps: int
) -> dict[str, RealInterval]:
    """Evaluate every displayed constant with outward interval arithmetic."""

    old_iv_dps = mp.iv.dps
    try:
        mp.iv.dps = dps
        lam = mp.iv.mpf(fraction.numerator) / mp.iv.mpf(fraction.denominator)
        ell = mp.iv.log(lam)
        length = 2 * ell
        variation = (
            2 * mp.iv.pi * cutoff + 2 * mp.iv.sqrt(2 * cutoff + 1)
        ) / mp.iv.sqrt(length)
        height_candidate = (
            variation + mp.iv.mpf(3) / 4 * mp.iv.sqrt(length)
        ) ** 2
        height_check = _copy_interval(height_candidate, dps)
        if height_check.lower <= 1:
            raise ArithmeticError("unit-window height max branch is unresolved")
        height = height_candidate

        upper = mp.iv.mpf(61220092002)
        main = upper / (2 * mp.iv.pi) * mp.iv.log(
            upper / (2 * mp.iv.pi * mp.iv.e)
        )
        error = (
            mp.iv.mpf("0.103787") * mp.iv.log(upper)
            + mp.iv.mpf("0.257297") * mp.iv.log(mp.iv.log(upper))
            + mp.iv.mpf("9.367419")
        )
        z_finite = 1 + main - mp.iv.mpf(1) / 8 + error
        c_z = (
            1
            + 1 / mp.iv.pi
            + 2 * (mp.iv.mpf("0.103787") + mp.iv.mpf("0.257297"))
            + 2 * mp.iv.mpf("9.367419")
        )
        b_abs = (
            192
            * mp.iv.sqrt(mp.iv.e)
            * lam
            * (1 + ell) ** 2
            * (
                z_finite
                + c_z
                / mp.iv.pi
                * ((mp.iv.pi + 1) * mp.iv.log(height + 2) + 1)
            )
        )
        exponent = 5 + 320 * mp.iv.pi / mp.iv.log(2) * lam**2
        d_ls = 6 * mp.iv.power(96, -exponent)
        even_factor = lam**2 / 2
        general_factor = lam**2
        synthesis = even_factor / d_ls
        exterior = b_abs * synthesis
        exterior_expanded = lam**2 * b_abs / 12 * mp.iv.power(96, exponent)
        alignment = b_abs * lam**4 / (4 * d_ls**2)
        alignment_expanded = (
            b_abs * lam**4 / 144 * mp.iv.power(96, 2 * exponent)
        )
        interval_values = {
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
            "negative_log10_d_LS": -mp.iv.log(d_ls) / mp.iv.log(10),
            "log10_C_ext_upper": mp.iv.log(exterior) / mp.iv.log(10),
            "log10_alignment_product_upper": (
                mp.iv.log(alignment) / mp.iv.log(10)
            ),
        }
        result = {
            key: _copy_interval(value, dps)
            for key, value in interval_values.items()
        }
    finally:
        mp.iv.dps = old_iv_dps

    for key, interval in result.items():
        if not mp.isfinite(interval.lower) or not mp.isfinite(interval.upper):
            raise ArithmeticError(f"nonfinite outward interval: {key}")
    if result["d_LS"].lower <= 0:
        raise ArithmeticError("outward all-index defect floor lost positivity")
    return result


def _serialize_dyadic(value: mp.mpf) -> dict[str, object]:
    sign, mantissa, exponent, _bit_count = value._mpf_
    if sign not in (0, 1) or mantissa < 0:
        raise ArithmeticError("invalid internal dyadic endpoint")
    return {
        "sign": int(sign),
        "mantissa_decimal_text": str(mantissa),
        "binary_exponent": int(exponent),
    }


def _widen_interval(
    interval: RealInterval, decimal_digits: int, guard_bits: int
) -> RealInterval:
    """Add a transparent exact-dyadic guard for independent containment."""

    tops: list[int] = []
    for endpoint in (interval.lower, interval.upper):
        _sign, mantissa, exponent, _bit_count = endpoint._mpf_
        if mantissa:
            tops.append(exponent + mantissa.bit_length() - 1)
    if not tops:
        return interval
    relative_bits = max(32, (3322 * decimal_digits) // 1000 - guard_bits)
    margin = mp.mpf((0, 1, max(tops) - relative_bits, 1))
    with mp.workprec(relative_bits + 128):
        return RealInterval(interval.lower - margin, interval.upper + margin)


def _serialize_interval(
    interval: RealInterval, digits: int, guard_bits: int
) -> dict[str, object]:
    interval = _widen_interval(interval, digits - 12, guard_bits)
    return {
        "endpoint_format": "signed_mantissa_times_2_power_v1",
        "lower_exact_dyadic": _serialize_dyadic(interval.lower),
        "upper_exact_dyadic": _serialize_dyadic(interval.upper),
        "decimal_display_only": [
            mp.nstr(interval.lower, digits),
            mp.nstr(interval.upper, digits),
        ],
    }


def fallback_report(
    lambda_numerator: int = 5,
    lambda_denominator: int = 2,
    fourier_cutoff_N: int = 24,
    dps: int = 80,
) -> dict[str, object]:
    """Evaluate the source-locked full exterior fallback formulas."""

    numerator = _require_int(lambda_numerator, "lambda numerator", 1)
    denominator = _require_int(lambda_denominator, "lambda denominator", 1)
    cutoff = _require_int(fourier_cutoff_N, "Fourier cutoff N", 0)
    precision = _require_int(dps, "decimal precision", 40)
    fraction = Fraction(numerator, denominator)
    if fraction < 2:
        raise ValueError("lambda must be at least two")
    source_lock = verify_source_lock()
    outward_intervals = _outward_intervals(fraction, cutoff, precision)

    with mp.workdps(precision):
        lam = mp.mpf(fraction.numerator) / fraction.denominator
        ell = mp.log(lam)
        length = 2 * ell
        variation = (
            2 * mp.pi * cutoff + 2 * mp.sqrt(2 * cutoff + 1)
        ) / mp.sqrt(length)
        height = max(mp.mpf(1), (variation + mp.mpf(3) / 4 * mp.sqrt(length)) ** 2)
        z_finite, c_z = overlap_constants()
        b_abs = (
            192
            * mp.sqrt(mp.e)
            * lam
            * (1 + ell) ** 2
            * (
                z_finite
                + c_z
                / mp.pi
                * ((mp.pi + 1) * mp.log(height + 2) + 1)
            )
        )
        exponent = 5 + 320 * mp.pi / mp.log(2) * lam**2
        d_ls = 6 * mp.power(96, -exponent)
        even_factor = lam**2 / 2
        general_factor = lam**2
        synthesis_upper = even_factor / d_ls
        exterior_upper = b_abs * synthesis_upper
        exterior_expanded = lam**2 * b_abs / 12 * mp.power(96, exponent)
        alignment_upper = b_abs * lam**4 / (4 * d_ls**2)
        alignment_expanded = (
            b_abs * lam**4 / 144 * mp.power(96, 2 * exponent)
        )

        values = {
            "lambda": +lam,
            "log_lambda": +ell,
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
            "negative_log10_d_LS": -mp.log10(d_ls),
            "log10_C_ext_upper": mp.log10(exterior_upper),
            "log10_alignment_product_upper": mp.log10(alignment_upper),
        }

    return {
        "schema": SCHEMA,
        "artifact_version": ARTIFACT_VERSION,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "construction": "source_explicit_full_Y_two_defect_fallback_v1",
        "precision_decimal_digits": precision,
        "interval_outward_guard_bits": INTERVAL_OUTWARD_GUARD_BITS,
        "exact_inputs": {
            "lambda_numerator": fraction.numerator,
            "lambda_denominator": fraction.denominator,
            "fourier_cutoff_N": cutoff,
        },
        "source_lock": {
            "path": SOURCE_LOCK_NAME,
            "sha256": _sha256(SOURCE_LOCK_PATH),
            "schema": source_lock["schema"],
        },
        "provenance_sha256": {
            "notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md": _sha256(
                ROOT / "notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md"
            ),
            "src/full_exterior_sampling_fallback.py": _sha256(
                ROOT / "src/full_exterior_sampling_fallback.py"
            ),
            "verifier/full_exterior_sampling_fallback_replay.py": _sha256(
                ROOT / "verifier/full_exterior_sampling_fallback_replay.py"
            ),
        },
        "formula_contract": EXPECTED_FORMULAS,
        "values": values,
        "outward_intervals": {
            key: _serialize_interval(
                interval, precision + 12, INTERVAL_OUTWARD_GUARD_BITS
            )
            for key, interval in outward_intervals.items()
        },
        "theorem_flags": THEOREM_FLAGS,
        "interpretation": (
            "unconditional full-cross-term exterior sampling fallback; the "
            "alignment bound pays d_LS^(-2), is exponentially enormous, and "
            "does not close the O(1/d_8) target"
        ),
        "claim_scope": (
            "analytic source-pinned inequalities plus outward interval "
            "evaluation of closed-form constants; not an asymptotic proof"
        ),
        "arithmetic_library_limitation": (
            "producer and independent verifier both use mpmath.iv for outward "
            "transcendental intervals while assembling formulas separately"
        ),
    }


def _serialize(value: Any, digits: int) -> Any:
    if isinstance(value, mp.mpc):
        if mp.im(value) != 0:
            return {
                "re": mp.nstr(mp.re(value), digits),
                "im": mp.nstr(mp.im(value), digits),
            }
        return mp.nstr(mp.re(value), digits)
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item, digits) for item in value]
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, default=5)
    parser.add_argument("--lambda-denominator", type=int, default=2)
    parser.add_argument("--N", type=int, default=24)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = fallback_report(
        args.lambda_numerator,
        args.lambda_denominator,
        args.N,
        args.dps,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(_serialize(report, args.dps), indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
