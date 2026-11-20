#!/usr/bin/env python3
"""Compact-BV absolute zero sampling on the locked projection schedule.

The analytic proof is in ``notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md``.
This producer evaluates its exact displayed finite formula at arbitrary
precision.  Values are point diagnostics, not outward-rounded intervals.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path

import mpmath as mp


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = ROOT / "COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json"
SCHEMA = "xi-prolate-compact-absolute-sampling-artifact-v1"
ARTIFACT_VERSION = "0.16.0-compact-absolute-sampling"
TERMINAL_STATE = "P0_INVALIDATED"
CLAIM_CLASS = "COMPACT_BV_ABSOLUTE_ZERO_SAMPLING_AND_PROJECTION_REMAINDER"
LOCK_SCHEMA = "xi-prolate-compact-absolute-sampling-source-lock-v1"
SCHEDULE_K = 2400

EXPECTED_DEPENDENCIES = {
    "ZERO_SAMPLING_SOURCE_LOCK.json": (
        "f4cad4acb30dbfcdc5b30faafe92934e8958ad1cd11cbf6abea932f902e8c101"
    ),
    "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json": (
        "66347adeb8c3e0d497760318370d00949d598a3ba42d5375c27dafc1651b3714"
    ),
    "PROLATE_DEFECT_SOURCE_LOCK.json": (
        "0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d"
    ),
    "P0_SOURCE_LOCK.json": (
        "24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251"
    ),
    "P1_SOURCE_LOCK.json": (
        "63b83879c52382c6c524b3137b25ea9f1882a24c5518374d487469ecf0e077d2"
    ),
    "P2_SOURCE_LOCK.json": (
        "8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a"
    ),
    "vendor/HSW-ZC-2107.06506v1.pdf": (
        "3fc4c89f49249924e61cb0d289d81559faed53fcbb838628ea32dc7ec6f89fbf"
    ),
    "vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz": (
        "8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c"
    ),
    "vendor/CCM-ZST-2511.22755v1.pdf": (
        "c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b"
    ),
    "vendor/CCM-PROLATE-2310.18423v2.pdf": (
        "8bc197642ee9ca4f2393b6cbfd3db292be6a315ce76ad61bfb845d9fedb47f2e"
    ),
    "vendor/KRD-PSWF-2006.00427v2.pdf": (
        "7c56255db5bd6454e3fc926952052fe466ffd49c4961ad8206638dcac1dd39a0"
    ),
    "vendor/SLEPIAN-PSWF-IV-1964.pdf": (
        "86efb6b69f405a046914f19c07161329b3f455a93a58467cc8107cfa4a135351"
    ),
    "vendor/MTY-ZFR-2212.06867v1.pdf": (
        "127c32eb86d0aea264cc5b1ba96cc83243ef6b763451591e1560edaca1767300"
    ),
    "vendor/PT-RH-VERIFY-2004.09765v1.pdf": (
        "3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885"
    ),
    "notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md": (
        "3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f"
    ),
    "notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md": (
        "34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f"
    ),
    "notes/OUTER_OUTER_SPECTRAL_THEOREM.md": (
        "02407eafa8fd5db4c5d8b5bbb2f62d5215f6ef5bf1cb5104fa53caddb52800e4"
    ),
}

EXPECTED_CONVENTIONS = {
    "zero_parameter": "s_rho=gamma+i*(1/2-beta) for rho=beta+i*gamma",
    "angular_transform": "F(z)=integral_R f(t)*exp(-i*z*t) dt",
    "absolute_sampling_seminorm": (
        "sum_rho (abs(F(s_rho))^2+abs(F(conjugate(s_rho)))^2)"
    ),
    "support": "f is real BV and supported in [-log(lambda),log(lambda)]",
    "submean_radius": "r_lambda=1/(4*(1+log(lambda)))",
    "log_weight": "w(x)=log(2+abs(x))",
    "local_overlap_majorant": (
        "Z_finite+C_Z*log(2+abs(x)) separately on each height sign"
    ),
    "locked_schedule": "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2); j>=2",
}

EXPECTED_CONSTANTS = {
    "T0": 30610046000,
    "U": 61220092002,
    "M(t)": "t/(2*pi)*log(t/(2*pi*e))",
    "R(t)": "0.103787*log(t)+0.257297*log(log(t))+9.367419",
    "Z_finite": "1+M(U)-1/8+R(U)",
    "C_Z": "1+1/pi+2*(0.103787+0.257297)+2*9.367419",
    "generic_bound": (
        "sampling(f)<=192*sqrt(e)*lambda*(1+log(lambda))^2*E^2*"
        "(Z_finite+(C_Z/pi)*((pi+1)*log(H+2)+1))"
    ),
    "generic_H": (
        "H=max(1,(V+(3/4)*sqrt(2*log(lambda))*E)^2/E^2)"
    ),
    "combined_source_coefficient": (
        "A_lambda=(sqrt(3)/2^(11/4))*(1+2*sqrt(2)*lambda)"
    ),
    "single_mode_variation": (
        "V_star=4*lambda*(2*pi*lambda^2+1/2)+16*sqrt(2)*pi*lambda^2"
    ),
    "projection_real_variation": (
        "V_P<=3*A_lambda*V_star*(1+sqrt(2*N))"
    ),
    "defect_lower": "d_lower=6*96^(-5-(320*pi/log(2))*lambda^2)",
    "projection_H": (
        "H_P=max(1,W_P^2/(d_lower*(A_lambda*R_proj)^2))"
    ),
    "projection_W": (
        "W_P=3*A_lambda*V_star*(1+sqrt(2*N))+(3/4)*"
        "sqrt(2*log(lambda))*A_lambda*R_proj"
    ),
    "projection_substitution": (
        "x*log(2+max(1,a/x)) is increasing in x and a; "
        "x=norm(P)^2<=d_4*(A_lambda*R_proj)^2; d_4>=d_lower"
    ),
    "projection_relative_bound": (
        "sampling(P)/d_4<=192*sqrt(e)*lambda*(1+log(lambda))^2*"
        "(A_lambda*R_proj)^2*(Z_finite+(C_Z/pi)*"
        "((pi+1)*(log(3)+log(H_P))+1))"
    ),
    "outer_absolute_sampling": "sampling(O)<=2*C_spec*D_S(lambda)*d_4",
}

EXPECTED_CLAIM_BOUNDARY = {
    "proved": [
        (
            "an explicit absolute zero-sampling bound for every compact real BV "
            "profile on the locked logarithmic interval"
        ),
        (
            "the compact log-Fourier projection remainder has absolute sampling "
            "seminorm squared o(d_4) and o(d_8) on the locked exponential schedule"
        ),
        (
            "combined with the admitted physical-outer theorem, the complete radical "
            "remainder has absolute sampling seminorm squared O(lambda^7*d_4)"
        ),
    ],
    "not_proved": [
        "uniform source-window Bessel bounds through the growing prolate transition range",
        "the reciprocal defect sum required by the graph-dual residual theorem",
        "a shifted signed-sector floor or resolvent-action rate",
        "equation (5.2) or locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _require_int(value: int, label: str, minimum: int) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise TypeError(f"{label} must be an exact integer")
    if value < minimum:
        raise ValueError(f"{label} must be at least {minimum}")
    return value


def _exact_mpf(value: str | int, label: str) -> mp.mpf:
    if isinstance(value, bool) or isinstance(value, float):
        raise TypeError(f"{label} must be exact text or an integer")
    try:
        parsed = mp.mpf(value)
    except (ValueError, TypeError) as exc:
        raise ValueError(f"invalid {label}") from exc
    if not mp.isfinite(parsed):
        raise ValueError(f"{label} must be finite")
    return parsed


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
        "locked_constants",
        "claim_boundary",
    }
    if set(payload) != expected_top:
        raise ValueError("compact sampling source-lock inventory mismatch")
    if payload.get("schema") != LOCK_SCHEMA:
        raise ValueError("compact sampling source-lock schema mismatch")
    if payload.get("claim_class") != CLAIM_CLASS:
        raise ValueError("compact sampling source-lock claim class mismatch")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ValueError("compact sampling source lock promotes project status")
    if payload.get("updated_date") != "2026-08-07":
        raise ValueError("compact sampling source-lock date mismatch")
    if payload.get("locked_conventions") != EXPECTED_CONVENTIONS:
        raise ValueError("compact sampling convention contract mismatch")
    dependencies = payload.get("dependencies")
    if not isinstance(dependencies, list) or len(dependencies) != len(
        EXPECTED_DEPENDENCIES
    ):
        raise ValueError("compact sampling source lock has no dependencies")
    seen: set[str] = set()
    for dependency in dependencies:
        if not isinstance(dependency, dict):
            raise TypeError("source-lock dependency must be an object")
        if set(dependency) != {"path", "sha256", "role"}:
            raise ValueError("source-lock dependency inventory mismatch")
        relative = dependency.get("path")
        expected = dependency.get("sha256")
        role = dependency.get("role")
        if (
            not isinstance(relative, str)
            or not isinstance(expected, str)
            or not isinstance(role, str)
            or not role
        ):
            raise ValueError("invalid source-lock dependency entry")
        relative_path = Path(relative)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            raise ValueError("unsafe source-lock dependency path")
        if relative in seen:
            raise ValueError("duplicate source-lock dependency")
        seen.add(relative)
        target = (root / relative_path).resolve()
        try:
            target.relative_to(root.resolve())
        except ValueError as exc:
            raise ValueError("source-lock dependency escapes repository") from exc
        if len(expected) != 64 or any(c not in "0123456789abcdef" for c in expected):
            raise ValueError("invalid source-lock dependency hash")
        if EXPECTED_DEPENDENCIES.get(relative) != expected:
            raise ValueError(f"unexpected source-lock dependency: {relative}")
        if _sha256(target) != expected:
            raise ValueError(f"source-lock dependency hash mismatch: {relative}")
    if seen != set(EXPECTED_DEPENDENCIES):
        raise ValueError("compact sampling dependency set mismatch")
    constants = payload.get("locked_constants")
    if constants != EXPECTED_CONSTANTS:
        raise ValueError("compact sampling locked formula contract mismatch")
    if payload.get("claim_boundary") != EXPECTED_CLAIM_BOUNDARY:
        raise ValueError("compact sampling claim boundary mismatch")
    return payload


def verify_source_lock() -> dict[str, object]:
    payload = json.loads(LOCK_PATH.read_text())
    if not isinstance(payload, dict):
        raise TypeError("compact sampling source lock must be an object")
    return validate_source_lock_payload(payload)


def overlap_constants() -> tuple[mp.mpf, mp.mpf]:
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


def compact_bv_sampling_bound(
    lambda_text: str,
    l2_upper_text: str,
    variation_upper_text: str,
    dps: int = 80,
) -> dict[str, mp.mpf]:
    """Evaluate equation (2.17) from exact decimal/rational text inputs."""

    _require_int(dps, "decimal precision", 30)
    if not isinstance(lambda_text, str):
        raise TypeError("lambda must be exact text")
    with mp.workdps(dps):
        lam = _exact_mpf(lambda_text, "lambda")
        energy = _exact_mpf(l2_upper_text, "L2 upper bound")
        variation = _exact_mpf(variation_upper_text, "variation upper bound")
        if lam < 2:
            raise ValueError("lambda must be at least two")
        if energy < 0 or variation < 0:
            raise ValueError("norm and variation bounds must be nonnegative")
        if energy == 0:
            if variation != 0:
                raise ValueError("zero L2 bound requires zero variation bound")
            return {
                "lambda": +lam,
                "H": mp.mpf(1),
                "log_weight_at_H": mp.log(3),
                "sampling_upper": mp.mpf(0),
            }
        ell = mp.log(lam)
        augmented_variation = variation + mp.mpf(3) / 4 * mp.sqrt(2 * ell) * energy
        H = max(mp.mpf(1), (augmented_variation / energy) ** 2)
        weight = mp.log(H + 2)
        z_finite, c_z = overlap_constants()
        bracket = z_finite + c_z / mp.pi * ((mp.pi + 1) * weight + 1)
        bound = (
            192
            * mp.sqrt(mp.e)
            * lam
            * (1 + ell) ** 2
            * energy**2
            * bracket
        )
        return {
            "lambda": +lam,
            "H": +H,
            "log_weight_at_H": +weight,
            "sampling_upper": +bound,
        }


def projection_sampling_report(j: int, dps: int = 80) -> dict[str, object]:
    """Reconstruct the d4-relative compact projection sampling bound."""

    j = _require_int(j, "schedule index j", 2)
    dps = _require_int(dps, "decimal precision", 30)
    source_lock = verify_source_lock()
    lam_fraction = Fraction(2 * j + 1, 2)
    schedule_exponent = SCHEDULE_K * (2 * j + 1) ** 2

    with mp.workdps(dps):
        lam = mp.mpf(lam_fraction.numerator) / lam_fraction.denominator
        ell = mp.log(lam)
        log_two = mp.log(2)
        log_N = schedule_exponent * log_two
        sqrt_two_N = mp.sqrt(2) * mp.exp(log_N / 2)

        a4 = mp.sqrt(3) / mp.power(2, mp.mpf(11) / 4)
        source_coefficient = a4 * (1 + 2 * mp.sqrt(2) * lam)
        variation_star = (
            4 * lam * (2 * mp.pi * lam**2 + mp.mpf(1) / 2)
            + 16 * mp.sqrt(2) * mp.pi * lam**2
        )
        projection_variation = (
            3 * source_coefficient * variation_star * (1 + sqrt_two_N)
        )

        defect_decay_A = 160 * mp.pi * mp.log(96) / log_two
        schedule_decay = 2 * SCHEDULE_K * log_two
        exponent_margin = schedule_decay - defect_decay_A
        common = mp.sqrt(2 * ell) / (mp.pi * mp.sqrt(2))
        relative_bulk = (
            common
            * 4
            * lam
            * (2 * mp.pi * lam**2 + mp.mpf(1) / 2)
            * mp.power(96, mp.mpf(5) / 2)
            / mp.sqrt(6)
            * mp.exp(-exponent_margin * lam**2)
        )
        relative_jump = (
            common
            * 32
            * mp.pi
            * lam**2
            * mp.exp(-schedule_decay * lam**2)
        )
        relative_projection = relative_bulk + relative_jump
        defect_lower = 6 * mp.power(
            96,
            -5 - 320 * mp.pi * lam**2 / log_two,
        )
        normalized_l2_upper = source_coefficient * relative_projection
        augmented_variation = (
            projection_variation
            + mp.mpf(3) / 4 * mp.sqrt(2 * ell) * normalized_l2_upper
        )
        log_H = max(
            mp.mpf(0),
            2 * mp.log(augmented_variation)
            - mp.log(defect_lower)
            - 2 * mp.log(normalized_l2_upper),
        )
        log_weight_upper = mp.log(3) + log_H

        z_finite, c_z = overlap_constants()
        bracket = z_finite + c_z / mp.pi * (
            (mp.pi + 1) * log_weight_upper + 1
        )
        relative_sampling_upper = (
            192
            * mp.sqrt(mp.e)
            * lam
            * (1 + ell) ** 2
            * normalized_l2_upper**2
            * bracket
        )

        values = {
            "log_N": +log_N,
            "source_coefficient_A_lambda": +source_coefficient,
            "variation_star": +variation_star,
            "projection_real_variation_upper": +projection_variation,
            "defect_decay_A": +defect_decay_A,
            "schedule_decay": +schedule_decay,
            "exponent_margin": +exponent_margin,
            "relative_projection_bulk": +relative_bulk,
            "relative_projection_jump": +relative_jump,
            "relative_projection_total": +relative_projection,
            "defect_lower": +defect_lower,
            "normalized_projection_l2_upper": +normalized_l2_upper,
            "log_H_projection": +log_H,
            "log_weight_upper": +log_weight_upper,
            "Z_finite": +z_finite,
            "C_Z": +c_z,
            "projection_sampling_over_d4_upper": +relative_sampling_upper,
            "negative_log10_relative_sampling_upper": -mp.log10(
                relative_sampling_upper
            ),
        }

    return {
        "schema": SCHEMA,
        "artifact_version": ARTIFACT_VERSION,
        "claim_class": CLAIM_CLASS,
        "terminal_state": TERMINAL_STATE,
        "inputs": {
            "j": j,
            "lambda_exact_fraction": str(lam_fraction),
            "precision_decimal_digits": dps,
            "schedule_K": SCHEDULE_K,
            "schedule_exponent": schedule_exponent,
        },
        "source_lock": {
            "path": LOCK_PATH.name,
            "sha256": _sha256(LOCK_PATH),
            "schema": source_lock["schema"],
        },
        "formula_contract": source_lock["locked_constants"],
        "provenance_sha256": {
            "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md": _sha256(
                ROOT / "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md"
            ),
            "src/compact_absolute_sampling.py": _sha256(
                ROOT / "src/compact_absolute_sampling.py"
            ),
            "verifier/compact_absolute_sampling_replay.py": _sha256(
                ROOT / "verifier/compact_absolute_sampling_replay.py"
            ),
        },
        "values": values,
        "claims": {
            "compact_BV_absolute_sampling_theorem": True,
            "projection_absolute_sampling_o_d4_on_locked_schedule": True,
            "complete_remainder_absolute_sampling_O_lambda7_d4": True,
            "uniform_window_Bessel_bound": False,
            "reciprocal_defect_sum": False,
            "equation_5_2_proved": False,
            "locally_uniform_determinant_convergence": False,
            "riemann_hypothesis_proof": False,
        },
        "claim_scope": (
            "analytic compact-BV theorem plus arbitrary-precision point evaluation; "
            "not an interval enclosure or residual-action proof"
        ),
        "shared_library_limitation": (
            "producer and independent verifier both evaluate transcendental point "
            "values with mpmath, while reconstructing formulas separately"
        ),
    }


def _serialize(value: object, digits: int) -> object:
    if isinstance(value, mp.mpf):
        return mp.nstr(value, digits)
    if isinstance(value, dict):
        return {key: _serialize(item, digits) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item, digits) for item in value]
    return value


def serialize_report(report: dict[str, object], digits: int) -> dict[str, object]:
    """Serialize an in-memory point report without introducing binary64."""

    _require_int(digits, "serialization digits", 30)
    serialized = _serialize(report, digits)
    if not isinstance(serialized, dict):  # pragma: no cover - structural guard
        raise TypeError("serialized compact sampling report is not an object")
    return serialized


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--j", type=int, default=2)
    parser.add_argument("--dps", type=int, default=80)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    report = projection_sampling_report(args.j, args.dps)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(serialize_report(report, args.dps), indent=2) + "\n"
    )


if __name__ == "__main__":
    main()
