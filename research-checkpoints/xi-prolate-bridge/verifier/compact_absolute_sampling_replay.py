#!/usr/bin/env python3
"""Independent replay of the compact-BV absolute-sampling artifact.

The replay deliberately imports no producer module and consumes no cached
matrix, eigenvalue, zero list, or producer pass/fail boolean.  It re-hashes
the current pinned sources, validates the complete formula contract, and
reconstructs every reported transcendental value at higher precision.

The producer and this verifier both use :mod:`mpmath` for point values.  The
result is therefore an independent formula assembly, not an independent
arithmetic-library or interval-arithmetic certificate.
"""

from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
from typing import Any

import mpmath as mp


SCHEMA = "xi-prolate-compact-absolute-sampling-artifact-v1"
REPLAY_SCHEMA = "xi-prolate-compact-absolute-sampling-replay-v1"
ARTIFACT_VERSION = "0.16.0-compact-absolute-sampling"
TERMINAL_STATE = "P0_INVALIDATED"
CLAIM_CLASS = "COMPACT_BV_ABSOLUTE_ZERO_SAMPLING_AND_PROJECTION_REMAINDER"
SOURCE_LOCK_SCHEMA = "xi-prolate-compact-absolute-sampling-source-lock-v1"
SOURCE_LOCK_NAME = "COMPACT_ABSOLUTE_SAMPLING_SOURCE_LOCK.json"
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
    "support": (
        "f is real BV and supported in [-log(lambda),log(lambda)]"
    ),
    "submean_radius": "r_lambda=1/(4*(1+log(lambda)))",
    "log_weight": "w(x)=log(2+abs(x))",
    "local_overlap_majorant": (
        "Z_finite+C_Z*log(2+abs(x)) separately on each height sign"
    ),
    "locked_schedule": (
        "lambda_j=j+1/2; N_j=2^(2400*(2*j+1)^2); j>=2"
    ),
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
    "defect_lower": (
        "d_lower=6*96^(-5-(320*pi/log(2))*lambda^2)"
    ),
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
    "outer_absolute_sampling": (
        "sampling(O)<=2*C_spec*D_S(lambda)*d_4"
    ),
}

EXPECTED_BOUNDARY = {
    "proved": [
        (
            "an explicit absolute zero-sampling bound for every compact real "
            "BV profile on the locked logarithmic interval"
        ),
        (
            "the compact log-Fourier projection remainder has absolute "
            "sampling seminorm squared o(d_4) and o(d_8) on the locked "
            "exponential schedule"
        ),
        (
            "combined with the admitted physical-outer theorem, the complete "
            "radical remainder has absolute sampling seminorm squared "
            "O(lambda^7*d_4)"
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

EXPECTED_CLAIMS = {
    "compact_BV_absolute_sampling_theorem": True,
    "projection_absolute_sampling_o_d4_on_locked_schedule": True,
    "complete_remainder_absolute_sampling_O_lambda7_d4": True,
    "uniform_window_Bessel_bound": False,
    "reciprocal_defect_sum": False,
    "equation_5_2_proved": False,
    "locally_uniform_determinant_convergence": False,
    "riemann_hypothesis_proof": False,
}

EXPECTED_CLAIM_SCOPE = (
    "analytic compact-BV theorem plus arbitrary-precision point evaluation; "
    "not an interval enclosure or residual-action proof"
)
EXPECTED_LIBRARY_LIMITATION = (
    "producer and independent verifier both evaluate transcendental point "
    "values with mpmath, while reconstructing formulas separately"
)

VALUE_KEYS = {
    "log_N",
    "source_coefficient_A_lambda",
    "variation_star",
    "projection_real_variation_upper",
    "defect_decay_A",
    "schedule_decay",
    "exponent_margin",
    "relative_projection_bulk",
    "relative_projection_jump",
    "relative_projection_total",
    "defect_lower",
    "normalized_projection_l2_upper",
    "log_H_projection",
    "log_weight_upper",
    "Z_finite",
    "C_Z",
    "projection_sampling_over_d4_upper",
    "negative_log10_relative_sampling_upper",
}


class ReplayError(ValueError):
    """The artifact or a source/formula lock failed closed."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _require_int(value: object, label: str, minimum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact integer, never binary64")
    if minimum is not None and value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _require_text(value: object, label: str) -> str:
    if not isinstance(value, str):
        raise ReplayError(f"{label} must be exact text, never binary64")
    return value


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


def _validate_zero_lock(root: Path) -> None:
    lock = _load_object(root / "ZERO_SAMPLING_SOURCE_LOCK.json", "zero lock")
    if lock.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("zero lock promotes the repository state")
    formulas = lock.get("locked_source_formulas")
    if not isinstance(formulas, dict):
        raise ReplayError("zero lock formula inventory is missing")
    expected = {
        "zero_count_main": "M(T)=T/(2*pi)*log(T/(2*pi*e))",
        "zero_count_error": (
            "R(T)=0.103787*log(T)+0.257297*log(log(T))+9.367419"
        ),
        "zero_count_theorem": (
            "abs(N(T)-M(T)+1/8)<=R(T) for T>=T0=30610046000"
        ),
        "zero_parameter": (
            "s_rho=gamma+i*(1/2-beta) for rho=beta+i*gamma"
        ),
    }
    for key, value in expected.items():
        if formulas.get(key) != value:
            raise ReplayError(f"zero lock formula mutation: {key}")
    constants = lock.get("independently_derived_sampling_constants")
    if not isinstance(constants, dict) or constants.get(
        "finite_lower_block_overlap"
    ) != "Z_finite=1+M(61220092002)-1/8+R(61220092002)":
        raise ReplayError("zero lock finite overlap mutation")
    admission = lock.get("admission_boundary")
    if not isinstance(admission, dict):
        raise ReplayError("zero lock admission boundary is missing")
    if admission.get("decimal_zero_list_read") is not False:
        raise ReplayError("zero lock reads a decimal zero list")
    if admission.get("zeros_assumed_real_or_on_critical_line_globally") is not False:
        raise ReplayError("zero lock assumes global zero reality")
    if admission.get("local_count_includes_multiplicity") is not True:
        raise ReplayError("zero lock dropped zero multiplicity")
    if admission.get("status_promoted") is not False:
        raise ReplayError("zero lock status was promoted")


def _validate_projection_lock(root: Path) -> None:
    lock = _load_object(
        root / "DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json",
        "projection lock",
    )
    if lock.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("projection lock promotes the repository state")
    conventions = lock.get("locked_project_conventions")
    if not isinstance(conventions, dict):
        raise ReplayError("projection conventions are missing")
    required_conventions = {
        "source_interval": "[-lambda,lambda]",
        "source_measure": "Lebesgue dx",
        "zero_extension": "h_n is zero outside [-lambda,lambda]",
        "prolate_parameter": "c=2*pi*lambda^2",
        "defect": "d_n(lambda)=1-chi_n(lambda)^2",
        "log_interval_length": "L=2*log(lambda)",
        "log_fourier_basis": (
            "L^(-1/2)*exp(+2*pi*i*m*(t+log(lambda))/L)"
        ),
    }
    for key, value in required_conventions.items():
        if conventions.get(key) != value:
            raise ReplayError(f"projection convention mutation: {key}")
    ls = lock.get("locked_logvinenko_sereda_insertion")
    if not isinstance(ls, dict):
        raise ReplayError("projection defect formulas are missing")
    if (
        ls.get("theorem_base")
        != "24*d*tau_d*l_1/(gamma*eta*rho)=96"
        or ls.get("defect_lower_bound")
        != "d_n>=6*96^(-5-(320*pi/log(2))*lambda^2)"
    ):
        raise ReplayError("projection defect lower bound mutation")
    diagonal = lock.get("locked_diagonal_schedule")
    if not isinstance(diagonal, dict):
        raise ReplayError("projection schedule is missing")
    if (
        diagonal.get("K") != SCHEDULE_K
        or diagonal.get("lambda") != "lambda_j=j+1/2"
        or diagonal.get("N") != "N_j=2^(2400*(2*j+1)^2)"
        or diagonal.get("inverse_sqrt_N")
        != "N_j^(-1/2)=exp(-4800*log(2)*lambda_j^2)"
    ):
        raise ReplayError("projection schedule mutation")
    boundary = lock.get("claim_boundary")
    if not isinstance(boundary, dict):
        raise ReplayError("projection claim boundary is missing")
    not_proved = boundary.get("not_proved")
    if not isinstance(not_proved, list) or "the Riemann hypothesis" not in not_proved:
        raise ReplayError("projection claim boundary was promoted")


def _validate_source_lock(root: Path) -> str:
    lock_path = root / SOURCE_LOCK_NAME
    lock = _load_object(lock_path, "compact sampling source lock")
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
    if set(lock) != expected_top:
        raise ReplayError("compact source-lock inventory differs from contract")
    if lock.get("schema") != SOURCE_LOCK_SCHEMA:
        raise ReplayError("compact source-lock schema mismatch")
    if lock.get("claim_class") != (
        "COMPACT_BV_ABSOLUTE_ZERO_SAMPLING_AND_PROJECTION_REMAINDER"
    ):
        raise ReplayError("compact source-lock claim class mutation")
    if lock.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("compact source lock promotes the repository state")
    if lock.get("updated_date") != "2026-08-07":
        raise ReplayError("compact source-lock date mutation")
    if lock.get("locked_conventions") != EXPECTED_CONVENTIONS:
        raise ReplayError("compact source-lock convention or Fourier-sign mutation")
    if lock.get("locked_constants") != EXPECTED_CONSTANTS:
        raise ReplayError("compact source-lock formula mutation")
    if lock.get("claim_boundary") != EXPECTED_BOUNDARY:
        raise ReplayError("compact source-lock claim-boundary promotion")

    dependencies = lock.get("dependencies")
    if not isinstance(dependencies, list):
        raise ReplayError("compact source-lock dependency list is missing")
    supplied: dict[str, str] = {}
    for index, item in enumerate(dependencies):
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError(f"invalid compact dependency entry {index}")
        relative = _require_text(item["path"], f"dependency {index} path")
        digest = _require_text(item["sha256"], f"dependency {index} digest")
        if not isinstance(item["role"], str) or not item["role"]:
            raise ReplayError(f"dependency {index} has no role")
        if relative in supplied:
            raise ReplayError(f"duplicate compact dependency: {relative}")
        supplied[relative] = digest
    if supplied != EXPECTED_DEPENDENCIES:
        raise ReplayError("compact dependency paths or declared hashes changed")
    for relative, digest in EXPECTED_DEPENDENCIES.items():
        if _sha256(root / relative) != digest:
            raise ReplayError(f"independent dependency-byte hash failed: {relative}")

    _validate_zero_lock(root)
    _validate_projection_lock(root)
    return _sha256(lock_path)


def _overlap_constants() -> tuple[mp.mpf, mp.mpf]:
    """Reconstruct HSW constants without calling producer helpers."""

    upper = mp.mpf(2) * (mp.mpf(30610046000) + 1)
    log_upper = mp.log(upper)
    log_two_pi = mp.log(2) + mp.log(mp.pi)
    # Algebraically independent assembly of U/(2*pi)*log(U/(2*pi*e)).
    main = upper / (2 * mp.pi) * (log_upper - log_two_pi - 1)
    error = (
        mp.mpf(103787) / 1000000 * log_upper
        + mp.mpf(257297) / 1000000 * mp.log(log_upper)
        + mp.mpf(9367419) / 1000000
    )
    z_finite = mp.mpf(7) / 8 + main + error
    c_z = (
        1
        + 1 / mp.pi
        + 2 * (mp.mpf(103787 + 257297) / 1000000)
        + 2 * mp.mpf(9367419) / 1000000
    )
    return z_finite, c_z


def _reconstruct(j: int, dps: int) -> dict[str, mp.mpf]:
    """Rebuild all point values from exact source parameters."""

    with mp.workdps(dps):
        lam = mp.mpf(2 * j + 1) / 2
        ell = mp.log(lam)
        log_two = mp.log(2)
        log_three = mp.log(3)
        log_96 = log_three + 5 * log_two
        schedule_exponent = SCHEDULE_K * (2 * j + 1) ** 2
        log_n = schedule_exponent * log_two

        # exp/log assembly differs from the producer's fractional powers.
        a4 = mp.exp(log_three / 2 - mp.mpf(11) * log_two / 4)
        sqrt_two = mp.exp(log_two / 2)
        source_coefficient = a4 * (1 + 2 * sqrt_two * lam)
        variation_star = (
            8 * mp.pi * lam**3
            + 2 * lam
            + 16 * sqrt_two * mp.pi * lam**2
        )
        sqrt_two_n = mp.exp((log_two + log_n) / 2)
        projection_variation = (
            3 * source_coefficient * variation_star * (1 + sqrt_two_n)
        )

        defect_decay = 160 * mp.pi * log_96 / log_two
        schedule_decay = 2 * SCHEDULE_K * log_two
        margin = schedule_decay - defect_decay
        # sqrt(2*ell)/sqrt(2) is exactly sqrt(ell).
        common = mp.sqrt(ell) / mp.pi
        bulk = (
            common
            * 4
            * lam
            * (2 * mp.pi * lam**2 + mp.mpf(1) / 2)
            * mp.exp(mp.mpf(5) * log_96 / 2)
            / mp.sqrt(6)
            * mp.exp(-margin * lam**2)
        )
        jump = (
            common
            * 32
            * mp.pi
            * lam**2
            * mp.exp(-schedule_decay * lam**2)
        )
        relative = bulk + jump
        defect_log = (
            mp.log(6)
            + (-5 - 320 * mp.pi * lam**2 / log_two) * log_96
        )
        defect_lower = mp.exp(defect_log)
        normalized = source_coefficient * relative
        augmented = (
            projection_variation
            + mp.mpf(3) / 4 * mp.sqrt(2 * ell) * normalized
        )
        log_h = max(
            mp.mpf(0),
            2 * mp.log(augmented) - defect_log - 2 * mp.log(normalized),
        )
        log_weight = log_three + log_h

        z_finite, c_z = _overlap_constants()
        bracket = z_finite + c_z / mp.pi * (
            (mp.pi + 1) * log_weight + 1
        )
        sampling = (
            192
            * mp.exp(mp.mpf(1) / 2)
            * lam
            * (1 + ell) ** 2
            * normalized**2
            * bracket
        )

        return {
            "log_N": +log_n,
            "source_coefficient_A_lambda": +source_coefficient,
            "variation_star": +variation_star,
            "projection_real_variation_upper": +projection_variation,
            "defect_decay_A": +defect_decay,
            "schedule_decay": +schedule_decay,
            "exponent_margin": +margin,
            "relative_projection_bulk": +bulk,
            "relative_projection_jump": +jump,
            "relative_projection_total": +relative,
            "defect_lower": +defect_lower,
            "normalized_projection_l2_upper": +normalized,
            "log_H_projection": +log_h,
            "log_weight_upper": +log_weight,
            "Z_finite": +z_finite,
            "C_Z": +c_z,
            "projection_sampling_over_d4_upper": +sampling,
            "negative_log10_relative_sampling_upper": (
                -mp.log(sampling) / mp.log(10)
            ),
        }


def _parse_point(value: object, label: str) -> mp.mpf:
    text = _require_text(value, label)
    try:
        point = mp.mpf(text)
    except (TypeError, ValueError) as exc:
        raise ReplayError(f"invalid decimal point value: {label}") from exc
    if not mp.isfinite(point):
        raise ReplayError(f"non-finite point value: {label}")
    return point


def _points_agree(
    supplied: mp.mpf, expected: mp.mpf, producer_dps: int
) -> tuple[bool, mp.mpf]:
    if supplied == expected:
        return True, mp.mpf(0)
    scale = max(abs(supplied), abs(expected))
    if scale == 0:
        return False, mp.inf
    relative_error = abs(supplied - expected) / scale
    # Eight guard digits allow different algebraic assembly at producer
    # precision while still detecting changes far below the displayed scale.
    tolerance = mp.power(10, -(producer_dps - 8))
    return relative_error <= tolerance, relative_error


def replay_artifact(path: Path, dps: int | None = None) -> dict[str, object]:
    """Replay one producer artifact at strictly higher precision."""

    artifact_path = Path(path)
    payload = _load_object(artifact_path, "compact sampling artifact")
    if set(payload) != {
        "schema",
        "artifact_version",
        "claim_class",
        "terminal_state",
        "inputs",
        "source_lock",
        "formula_contract",
        "provenance_sha256",
        "values",
        "claims",
        "claim_scope",
        "shared_library_limitation",
    }:
        raise ReplayError("artifact inventory differs from replay contract")
    if payload.get("schema") != SCHEMA:
        raise ReplayError("artifact schema differs from replay contract")
    if payload.get("artifact_version") != ARTIFACT_VERSION:
        raise ReplayError("artifact version differs from replay contract")
    if payload.get("claim_class") != CLAIM_CLASS:
        raise ReplayError("artifact claim class differs from replay contract")
    if payload.get("terminal_state") != TERMINAL_STATE:
        raise ReplayError("artifact promotes the repository terminal state")
    if payload.get("formula_contract") != EXPECTED_CONSTANTS:
        raise ReplayError("artifact formula contract is stale or mutated")
    if payload.get("claims") != EXPECTED_CLAIMS:
        raise ReplayError("artifact overclaims or changes the claim boundary")
    if payload.get("claim_scope") != EXPECTED_CLAIM_SCOPE:
        raise ReplayError("artifact claim scope mutation")
    if payload.get("shared_library_limitation") != EXPECTED_LIBRARY_LIMITATION:
        raise ReplayError("shared-arithmetic-library limitation is missing")

    inputs = payload.get("inputs")
    if not isinstance(inputs, dict) or set(inputs) != {
        "j",
        "lambda_exact_fraction",
        "precision_decimal_digits",
        "schedule_K",
        "schedule_exponent",
    }:
        raise ReplayError("artifact input inventory mismatch")
    j = _require_int(inputs["j"], "schedule index j", 2)
    producer_dps = _require_int(
        inputs["precision_decimal_digits"], "producer precision", 30
    )
    used_dps = producer_dps + 40 if dps is None else _require_int(
        dps, "replay precision", producer_dps + 20
    )
    fraction = Fraction(2 * j + 1, 2)
    if inputs["lambda_exact_fraction"] != str(fraction):
        raise ReplayError("lambda was not reconstructed exactly from j")
    if inputs["schedule_K"] != SCHEDULE_K:
        raise ReplayError("artifact schedule K mutation")
    exponent = SCHEDULE_K * (2 * j + 1) ** 2
    if inputs["schedule_exponent"] != exponent:
        raise ReplayError("artifact schedule exponent mutation")

    root = _root()
    current_lock_hash = _validate_source_lock(root)
    source_lock = payload.get("source_lock")
    if not isinstance(source_lock, dict) or source_lock != {
        "path": SOURCE_LOCK_NAME,
        "sha256": current_lock_hash,
        "schema": SOURCE_LOCK_SCHEMA,
    }:
        raise ReplayError("artifact source-lock pin is stale or mutated")

    provenance = payload.get("provenance_sha256")
    provenance_paths = {
        "notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md",
        "src/compact_absolute_sampling.py",
        "verifier/compact_absolute_sampling_replay.py",
    }
    if not isinstance(provenance, dict) or set(provenance) != provenance_paths:
        raise ReplayError("artifact provenance inventory mismatch")
    for relative in provenance_paths:
        supplied_hash = _require_text(provenance[relative], relative)
        if supplied_hash != _sha256(root / relative):
            raise ReplayError(f"stale or mutated provenance hash: {relative}")

    supplied_values = payload.get("values")
    if not isinstance(supplied_values, dict) or set(supplied_values) != VALUE_KEYS:
        raise ReplayError("artifact value inventory mismatch")
    with mp.workdps(used_dps):
        reconstructed = _reconstruct(j, used_dps)
        comparisons: dict[str, object] = {}
        for key in sorted(VALUE_KEYS):
            supplied = _parse_point(supplied_values[key], key)
            expected = reconstructed[key]
            agrees, relative_error = _points_agree(
                supplied, expected, producer_dps
            )
            if not agrees:
                raise ReplayError(f"higher-precision formula mismatch: {key}")
            if key not in {"log_H_projection"} and supplied <= 0:
                raise ReplayError(f"required positive value is nonpositive: {key}")
            if key == "log_H_projection" and supplied < 0:
                raise ReplayError("log H projection is negative")
            comparisons[key] = {
                "agrees": True,
                "producer": _require_text(supplied_values[key], key),
                "replay": mp.nstr(expected, min(40, used_dps)),
                "relative_error": mp.nstr(relative_error, 8),
            }

        if reconstructed["exponent_margin"] <= 0:
            raise ReplayError("the locked schedule has no positive exponent margin")
        if reconstructed["projection_sampling_over_d4_upper"] >= 1:
            raise ReplayError("pilot projection sampling bound is not below one")

    return {
        "schema": REPLAY_SCHEMA,
        "terminal_state": TERMINAL_STATE,
        "replay_agrees": True,
        "reconstructed_inputs": {
            "j": j,
            "lambda_exact_fraction": str(fraction),
            "schedule_K": SCHEDULE_K,
            "schedule_exponent": exponent,
            "producer_decimal_digits": producer_dps,
            "replay_decimal_digits": used_dps,
        },
        "source_bytes_rechecked": True,
        "transcendentals_reconstructed_from_exact_parameters": True,
        "producer_booleans_trusted_as_evidence": False,
        "zero_list_read": False,
        "zeros_assumed_real_globally": False,
        "point_value_comparisons": comparisons,
        "arithmetic_library_limitation": (
            "Independent formula assemblies share mpmath "
            f"{mp.__version__}; the artifact contains point values, not balls."
        ),
        "scope": (
            "compact-BV and actual projection-remainder absolute sampling only; "
            "no window Bessel, reciprocal-defect, shifted-sector, equation (5.2), "
            "determinant-convergence, or RH claim"
        ),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    parser.add_argument("--dps", type=int)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = replay_artifact(args.artifact, args.dps)
    rendered = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output is None:
        print(rendered, end="")
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


__all__ = ["ReplayError", "replay_artifact"]
