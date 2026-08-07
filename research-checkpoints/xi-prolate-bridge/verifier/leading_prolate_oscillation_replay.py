#!/usr/bin/env python3
"""Clean-room exact replay of the leading prolate oscillation certificate.

This verifier imports no producer code.  It rehashes the pinned note, source
lock, and every source-lock dependency, then reconstructs the complete packet
and min--max certificate from the exact integer ``lambda_numerator``.  The
symbolic packet identity cancels every occurrence of pi, so no transcendental
arithmetic library is used.
"""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-leading-oscillation-v1"
REPLAY_SCHEMA = "xi-prolate-leading-oscillation-replay-v1"
STATUS = "LEADING_PROLATE_OSCILLATION_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
RESULT = "LEADING_PROLATE_OSCILLATION_EXACT_PASS"
REPLAY_RESULT = "LEADING_PROLATE_OSCILLATION_EXACT_REPLAY_PASS"
NOTE = "notes/LEADING_PROLATE_OSCILLATION_THEOREM.md"
SOURCE_LOCK = "LEADING_PROLATE_OSCILLATION_SOURCE_LOCK.json"
SOURCE_LOCK_SCHEMA = "xi-prolate-leading-oscillation-source-lock-v1"
_SHA256 = re.compile(r"^[0-9a-f]{64}$")
_CANONICAL_INTEGER = re.compile(r"^(?:0|-[1-9][0-9]*|[1-9][0-9]*)$")
_CANONICAL_POSITIVE_INTEGER = re.compile(r"^[1-9][0-9]*$")

PINNED_HASHES = {
    NOTE: "d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b",
    SOURCE_LOCK: "f473e0fc2028094f9866ea05073ad3282cdd80b42e40e197c4cf9e882f44f6f7",
}

LOCKED_FORMULAS = {
    "packet_length": "ell=pi/c=2/p^2",
    "packet_count": "r=floor(2*c/pi)=p^2",
    "packet_norm_squared": "||phi_j||_2^2=ell/2=1/p^2",
    "unit_cosine_moments": (
        "for J_k=integral_0^1 u^k*cos(2*pi*u)du: "
        "pi*J_0=0, pi^2*J_1=0, pi^2*J_2=1/2"
    ),
    "scaled_second_cosine_moment": (
        "integral_0^ell t^2*cos(2*pi*t/ell)dt=ell^3/(2*pi^2)"
    ),
    "packet_form_difference": (
        "q_c[phi_j]-c^2*||phi_j||_2^2=-ell/2=-1/p^2"
    ),
    "trial_space_identity": "q_c[y]=(c^2-1)||y||_2^2",
    "minmax_result": "mu_n(c)<=c^2-1<c^2 for 0<=n<p^2",
}

SOURCE_ADMISSIONS = {
    "binary64_parameters_used": False,
    "numerical_prolate_eigenvalues_read": False,
    "stored_eigenvectors_read": False,
    "landau_median_assumed": False,
    "osipov_bound_assumed": False,
    "concentration_defect_lower_bound_claimed": False,
    "signed_weil_floor_claimed": False,
    "equation_5_2_claimed": False,
    "rh_proved": False,
}

CLAIM_SCOPE = {
    "proved": [
        "exact packet-space Rayleigh identity",
        "mu_n(c)<=c^2-1 for every integer 0<=n<4*lambda^2 on the locked schedule",
        "growing leading source labels satisfy the existing mu_n<c^2 tail hypothesis",
    ],
    "not_proved": [
        "a concentration-defect lower bound",
        "a growing-family zero-sampling Gram bound",
        "a signed Weil-sector floor",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

EXPECTED_LOCK_CONVENTIONS = {
    "differential_form": (
        "q_c[y]=integral_(−1)^1 (1-x^2)|y'|^2+c^2*x^2*|y|^2"
    ),
    "eigenvalue_indexing": (
        "mu_0(c)<=mu_1(c)<=... variational eigenvalues indexed from zero "
        "and counted with multiplicity"
    ),
    "source_parameter": "c=2*pi*lambda^2",
    "locked_schedule": "lambda=p/2 with odd integer p>=5",
    "transition_count": "2*c/pi=4*lambda^2=p^2",
    "trial_domain": (
        "natural Legendre form domain V with piecewise sine packets in "
        "H_0^1(-1,1) subset V"
    ),
}

EXPECTED_LOCK_FORMULAS = {
    "packet_length": "ell=pi/c=2/p^2",
    "packet_count": "r=floor(2*c/pi)=p^2 on the locked schedule",
    "packet_norm_squared": "||phi_j||_2^2=ell/2=1/p^2",
    "unit_cosine_moments": (
        "for J_k=integral_0^1 u^k*cos(2*pi*u)du: "
        "pi*J_0=0, pi^2*J_1=0, pi^2*J_2=1/2"
    ),
    "scaled_second_cosine_moment": (
        "integral_0^ell t^2*cos(2*pi*t/ell)dt=ell^3/(2*pi^2)"
    ),
    "packet_form_difference": (
        "q_c[phi_j]-c^2*||phi_j||_2^2=-ell/2=-1/p^2"
    ),
    "trial_space_identity": (
        "q_c[y]=(c^2-1)||y||_2^2 on the p^2-dimensional packet span"
    ),
    "minmax_result": (
        "mu_n(c)<=c^2-1<c^2 for every 0<=n<p^2=4*lambda^2"
    ),
}

EXPECTED_LOCK_CLAIM_BOUNDARY = {
    "proved": [
        "an exact growing-index differential prolate bound through every label below 4*lambda^2",
        "the oscillatory hypothesis required by the existing modewise physical-tail estimates",
        "an exact rational packet certificate on every locked half-integer schedule point",
    ],
    "not_proved": [
        "a lower bound for a concentration defect d_n",
        "a Landau median or concentration-eigenvalue threshold",
        "the growing-family hybrid zero-sampling Gram bound",
        "a signed Weil-sector floor or finite Schur/leverage sign",
        "equation (5.2) of DIRECT_RH_ATTACK.md",
        "locally uniform determinant convergence",
        "the Riemann hypothesis",
    ],
}

EXPECTED_ARITHMETIC = {
    "precision_mode": "exact rational; no finite precision parameter",
    "raw_interval_or_ball_output_applicable": False,
    "library": "fractions.Fraction (Python standard library)",
    "shared_library_with_verifier": True,
    "transcendental_arithmetic_library_used": False,
    "independence_limitation": (
        "producer and verifier both use Python standard-library Fraction; "
        "all pi factors cancel symbolically and no shared transcendental "
        "arithmetic library is used"
    ),
}


class ReplayError(ValueError):
    """Raised when an artifact or its pinned source inventory fails replay."""


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError as exc:
        raise ReplayError(f"cannot read pinned source: {path}") from exc


def _validate_json_value(value: Any, path: str = "payload") -> None:
    """Reject binary64 and every non-JSON type without bool/int coercion."""

    if value is None or isinstance(value, (str, bool)):
        return
    if isinstance(value, int):
        return
    if isinstance(value, float):
        raise ReplayError(f"binary64 value at {path} is forbidden")
    if isinstance(value, list):
        for index, child in enumerate(value):
            _validate_json_value(child, f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if not isinstance(key, str):
                raise ReplayError(f"non-string JSON key at {path} is forbidden")
            _validate_json_value(child, f"{path}.{key}")
        return
    raise ReplayError(f"non-JSON value at {path} is forbidden")


def _same_json_value(left: Any, right: Any) -> bool:
    """JSON equality with an explicit type check (so False is not zero)."""

    if type(left) is not type(right):
        return False
    if isinstance(left, dict):
        return set(left) == set(right) and all(
            _same_json_value(left[key], right[key]) for key in left
        )
    if isinstance(left, list):
        return len(left) == len(right) and all(
            _same_json_value(a, b) for a, b in zip(left, right)
        )
    return left == right


def _reject_json_number(token: str) -> None:
    raise ReplayError(f"non-integer JSON number {token!r} is forbidden")


def _unique_object(pairs: list[tuple[str, Any]]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in pairs:
        if key in result:
            raise ReplayError(f"duplicate JSON object key: {key}")
        result[key] = value
    return result


def _strict_json_loads(raw: bytes | str, label: str) -> Any:
    try:
        value = json.loads(
            raw,
            parse_float=_reject_json_number,
            parse_constant=_reject_json_number,
            object_pairs_hook=_unique_object,
        )
    except ReplayError:
        raise
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ReplayError(f"{label} is not strict JSON") from exc
    _validate_json_value(value, label)
    return value


def _require_exact_int(value: Any, label: str, minimum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int):
        raise ReplayError(f"{label} must be an exact JSON integer")
    if minimum is not None and value < minimum:
        raise ReplayError(f"{label} must be at least {minimum}")
    return value


def _rational(value: Fraction) -> dict[str, str]:
    return {
        "numerator": str(value.numerator),
        "denominator": str(value.denominator),
    }


def _parse_canonical_rational(value: Any, label: str) -> Fraction:
    if not isinstance(value, dict) or set(value) != {"numerator", "denominator"}:
        raise ReplayError(f"{label} must be an exact rational object")
    numerator_text = value["numerator"]
    denominator_text = value["denominator"]
    if (
        not isinstance(numerator_text, str)
        or _CANONICAL_INTEGER.fullmatch(numerator_text) is None
        or not isinstance(denominator_text, str)
        or _CANONICAL_POSITIVE_INTEGER.fullmatch(denominator_text) is None
    ):
        raise ReplayError(f"{label} contains noncanonical integer text")
    numerator = int(numerator_text)
    denominator = int(denominator_text)
    result = Fraction(numerator, denominator)
    if (result.numerator, result.denominator) != (numerator, denominator):
        raise ReplayError(f"{label} is not a reduced canonical rational")
    if _rational(result) != value:
        raise ReplayError(f"{label} rational serialization is noncanonical")
    return result


def _derive_unit_cosine_moments(
) -> tuple[int, Fraction, Fraction, Fraction, Fraction, Fraction]:
    """Replay integration by parts at the integer harmonic 2."""

    harmonic = 2
    endpoint_sine = Fraction(0)
    endpoint_cosine = Fraction(-1 if harmonic % 2 else 1)
    frequency_squared = harmonic**2
    pi_times_j0 = endpoint_sine / harmonic
    pi_squared_times_j1 = (endpoint_cosine - 1) / frequency_squared
    # The other terms in the twice-integrated J_2 formula contain
    # sin(harmonic*pi), so exact endpoint_sine=0 removes them.
    pi_squared_times_j2 = Fraction(2 * endpoint_cosine, frequency_squared)
    return (
        harmonic,
        endpoint_sine,
        endpoint_cosine,
        pi_times_j0,
        pi_squared_times_j1,
        pi_squared_times_j2,
    )


def _locked_dependency_hashes(root: Path) -> dict[str, str]:
    lock_path = root / SOURCE_LOCK
    lock = _strict_json_loads(lock_path.read_bytes(), "source lock")
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
    if not isinstance(lock, dict) or set(lock) != expected_top:
        raise ReplayError("leading-oscillation source-lock inventory mismatch")
    fixed_fields = {
        "schema": SOURCE_LOCK_SCHEMA,
        "claim_class": "EXACT_GROWING_INDEX_DIFFERENTIAL_PROLATE_UPPER_BOUND",
        "terminal_state": TERMINAL_STATE,
        "updated_date": "2026-08-07",
        "locked_conventions": EXPECTED_LOCK_CONVENTIONS,
        "locked_formulas": EXPECTED_LOCK_FORMULAS,
        "claim_boundary": EXPECTED_LOCK_CLAIM_BOUNDARY,
    }
    for key, expected in fixed_fields.items():
        if not _same_json_value(lock[key], expected):
            raise ReplayError(f"source-lock {key} mutation or claim promotion")

    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ReplayError("leading-oscillation dependencies missing")
    result: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ReplayError("malformed leading-oscillation dependency")
        relative = item["path"]
        expected = item["sha256"]
        role = item["role"]
        if (
            not isinstance(relative, str)
            or not relative
            or Path(relative).is_absolute()
            or ".." in Path(relative).parts
            or not isinstance(expected, str)
            or _SHA256.fullmatch(expected) is None
            or not isinstance(role, str)
            or not role
            or relative in result
        ):
            raise ReplayError("invalid leading-oscillation dependency fields")
        if _sha256(root / relative) != expected:
            raise ReplayError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _verified_source_hashes(root: Path) -> dict[str, str]:
    for relative, expected in PINNED_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ReplayError(f"source byte hash mismatch: {relative}")
    combined = dict(PINNED_HASHES)
    for relative, expected in _locked_dependency_hashes(root).items():
        if relative in combined and combined[relative] != expected:
            raise ReplayError(f"conflicting source hash: {relative}")
        combined[relative] = expected
    return dict(sorted(combined.items()))


def reconstruct_certificate(lambda_numerator: int) -> dict[str, Any]:
    """Reconstruct every exact packet/min--max field without producer code."""

    p = _require_exact_int(lambda_numerator, "lambda_numerator", 5)
    if p % 2 == 0:
        raise ReplayError("lambda_numerator must be odd")
    p_squared = p * p
    packet_length = Fraction(2, p_squared)
    packet_norm_squared = Fraction(1, p_squared)
    (
        harmonic,
        endpoint_sine,
        endpoint_cosine,
        pi_times_j0,
        pi_squared_times_j1,
        pi_squared_times_j2,
    ) = _derive_unit_cosine_moments()
    if pi_times_j0 != 0 or pi_squared_times_j1 != 0:
        raise ReplayError("replayed constant or linear cosine moment did not vanish")
    c_squared_over_pi_squared = Fraction(p_squared**2, 4)
    packet_form_difference = -(
        c_squared_over_pi_squared
        * pi_squared_times_j2
        * packet_length
        * packet_length
        * packet_length
    )
    rayleigh_margin = -packet_form_difference / packet_norm_squared
    plus_targets = range(8, p_squared, 4)
    minus_targets = range(6, p_squared, 4)
    return {
        "lambda": _rational(Fraction(p, 2)),
        "lambda_squared": _rational(Fraction(p_squared, 4)),
        "c_over_pi": _rational(Fraction(p_squared, 2)),
        "transition_count": p_squared,
        "packet_count": p_squared,
        "packet_length": _rational(packet_length),
        "packet_norm_squared": _rational(packet_norm_squared),
        "unit_cosine_moments": {
            "harmonic": harmonic,
            "sin_harmonic_pi": _rational(endpoint_sine),
            "cos_harmonic_pi": _rational(endpoint_cosine),
            "pi_times_J0": _rational(pi_times_j0),
            "pi_squared_times_J1": _rational(pi_squared_times_j1),
            "pi_squared_times_J2": _rational(pi_squared_times_j2),
        },
        "c_squared_over_pi_squared": _rational(c_squared_over_pi_squared),
        "packet_form_difference": _rational(packet_form_difference),
        "rayleigh_margin_below_c_squared": _rational(rayleigh_margin),
        "tiled_length": _rational(p_squared * packet_length),
        "first_packet": {
            "left": _rational(Fraction(-1)),
            "right": _rational(Fraction(-1) + packet_length),
        },
        "last_packet": {
            "left": _rational(Fraction(-1) + (p_squared - 1) * packet_length),
            "right": _rational(Fraction(1)),
        },
        "max_certified_index": p_squared - 1,
        "plus_target_count": len(plus_targets),
        "plus_first_target": plus_targets[0],
        "plus_last_target": plus_targets[-1],
        "minus_target_count": len(minus_targets),
        "minus_first_target": minus_targets[0],
        "minus_last_target": minus_targets[-1],
    }


def _validate_certificate(
    certificate: Any, expected: dict[str, Any]
) -> dict[str, Fraction]:
    if not isinstance(certificate, dict) or set(certificate) != set(expected):
        raise ReplayError("certificate inventory mismatch")
    rational_paths: dict[str, Any] = {
        key: certificate[key]
        for key in (
            "lambda",
            "lambda_squared",
            "c_over_pi",
            "packet_length",
            "packet_norm_squared",
            "c_squared_over_pi_squared",
            "packet_form_difference",
            "rayleigh_margin_below_c_squared",
            "tiled_length",
        )
    }
    for packet_name in ("first_packet", "last_packet"):
        packet = certificate[packet_name]
        if not isinstance(packet, dict) or set(packet) != {"left", "right"}:
            raise ReplayError(f"{packet_name} inventory mismatch")
        rational_paths[f"{packet_name}.left"] = packet["left"]
        rational_paths[f"{packet_name}.right"] = packet["right"]
    moments = certificate["unit_cosine_moments"]
    expected_moment_fields = {
        "harmonic",
        "sin_harmonic_pi",
        "cos_harmonic_pi",
        "pi_times_J0",
        "pi_squared_times_J1",
        "pi_squared_times_J2",
    }
    if not isinstance(moments, dict) or set(moments) != expected_moment_fields:
        raise ReplayError("unit cosine-moment inventory mismatch")
    _require_exact_int(moments["harmonic"], "certificate.moments.harmonic", 1)
    for field in expected_moment_fields - {"harmonic"}:
        rational_paths[f"unit_cosine_moments.{field}"] = moments[field]
    parsed = {
        path: _parse_canonical_rational(value, f"certificate.{path}")
        for path, value in rational_paths.items()
    }
    integer_fields = (
        "transition_count",
        "packet_count",
        "max_certified_index",
        "plus_target_count",
        "plus_first_target",
        "plus_last_target",
        "minus_target_count",
        "minus_first_target",
        "minus_last_target",
    )
    for field in integer_fields:
        _require_exact_int(certificate[field], f"certificate.{field}", 0)
    if not _same_json_value(certificate, expected):
        raise ReplayError("certificate disagrees with independent reconstruction")
    return parsed


def replay(
    payload: dict[str, Any], *, producer_bytes: bytes | None = None
) -> dict[str, Any]:
    """Replay an artifact strictly bound to its exact source file bytes."""

    _validate_json_value(payload)
    if not isinstance(payload, dict):
        raise ReplayError("artifact payload must be a JSON object")
    if producer_bytes is None:
        raise ReplayError("exact producer artifact bytes are required for replay")
    if not isinstance(producer_bytes, bytes):
        raise ReplayError("producer bytes must be exact bytes")
    decoded = _strict_json_loads(producer_bytes, "producer bytes")
    if not _same_json_value(decoded, payload):
        raise ReplayError("producer bytes do not decode exactly to replay payload")
    producer_sha256 = hashlib.sha256(producer_bytes).hexdigest()

    expected_top = {
        "schema",
        "status",
        "terminal_state",
        "input",
        "source_hashes",
        "locked_formulas",
        "source_admissions",
        "arithmetic",
        "certificate",
        "producer_pass_boolean_trusted_by_replay",
        "claim_scope",
        "result",
    }
    if set(payload) != expected_top:
        raise ReplayError("top-level artifact inventory mismatch")
    fixed_fields = {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "locked_formulas": LOCKED_FORMULAS,
        "source_admissions": SOURCE_ADMISSIONS,
        "arithmetic": EXPECTED_ARITHMETIC,
        "claim_scope": CLAIM_SCOPE,
        "result": RESULT,
        "producer_pass_boolean_trusted_by_replay": False,
    }
    for key, expected_value in fixed_fields.items():
        if not _same_json_value(payload[key], expected_value):
            raise ReplayError(f"{key} mutation or claim promotion rejected")

    inputs = payload["input"]
    if not isinstance(inputs, dict) or set(inputs) != {
        "lambda_numerator",
        "lambda_denominator",
    }:
        raise ReplayError("exact input inventory mismatch")
    p = _require_exact_int(inputs["lambda_numerator"], "lambda_numerator", 5)
    denominator = _require_exact_int(
        inputs["lambda_denominator"], "lambda_denominator", 1
    )
    if p % 2 == 0 or denominator != 2:
        raise ReplayError("locked half-integer schedule input mutation")

    root = _root()
    source_hashes = _verified_source_hashes(root)
    if not _same_json_value(payload["source_hashes"], source_hashes):
        raise ReplayError("declared source-hash inventory mismatch")

    reconstructed = reconstruct_certificate(p)
    parsed = _validate_certificate(payload["certificate"], reconstructed)
    if (
        parsed["unit_cosine_moments.pi_times_J0"] != 0
        or parsed["unit_cosine_moments.pi_squared_times_J1"] != 0
        or parsed["unit_cosine_moments.pi_squared_times_J2"] != Fraction(1, 2)
    ):
        raise ReplayError("integration-by-parts cosine moments changed")
    derived_difference = -(
        parsed["c_squared_over_pi_squared"]
        * parsed["packet_length"] ** 3
        * parsed["unit_cosine_moments.pi_squared_times_J2"]
    )
    if parsed["packet_form_difference"] != derived_difference:
        raise ReplayError("packet form difference was not derived from moments")
    if parsed["packet_form_difference"] != -parsed["packet_norm_squared"]:
        raise ReplayError("packet-form minus sign was lost")
    if parsed["tiled_length"] != 2:
        raise ReplayError("packet intervals do not tile [-1,1]")
    if parsed["rayleigh_margin_below_c_squared"] != 1:
        raise ReplayError("exact min--max margin changed")

    return {
        "schema": REPLAY_SCHEMA,
        "status": REPLAY_RESULT,
        "terminal_state": TERMINAL_STATE,
        "producer_binding": {
            "byte_source": "exact artifact file bytes",
            "byte_count": len(producer_bytes),
            "sha256": producer_sha256,
        },
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": denominator,
        },
        "source_hashes": source_hashes,
        "reconstructed_certificate": reconstructed,
        "checks": {
            "source_note_and_lock_rehashed": True,
            "source_lock_dependency_inventory_rehashed": True,
            "canonical_rational_parse_pass": True,
            "cosine_moments_algebraically_reconstructed": True,
            "packet_inventory_exact": True,
            "packet_tiling_exact": True,
            "packet_form_minus_sign_retained": True,
            "minmax_index_range_exact": True,
            "producer_booleans_trusted": False,
            "binary64_parameters_used": False,
            "numerical_prolate_eigenvalues_read": False,
        },
        "arithmetic": dict(EXPECTED_ARITHMETIC),
        "claim_boundary": {
            "differential_prolate_upper_bound": True,
            "concentration_defect_lower_bound": False,
            "growing_family_zero_sampling_gram_bound": False,
            "signed_weil_sector_floor": False,
            "equation_5_2": False,
            "locally_uniform_determinant_convergence": False,
            "rh_proved": False,
        },
        "result": REPLAY_RESULT,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact")
    parser.add_argument("--output")
    args = parser.parse_args()
    artifact_path = Path(args.artifact)
    try:
        producer_bytes = artifact_path.read_bytes()
    except OSError as exc:
        raise ReplayError(f"cannot read artifact: {artifact_path}") from exc
    payload = _strict_json_loads(producer_bytes, "artifact")
    if not isinstance(payload, dict):
        raise ReplayError("artifact must be a JSON object")
    report = replay(payload, producer_bytes=producer_bytes)
    report["producer_artifact"] = {
        "path": args.artifact,
        "sha256": report["producer_binding"]["sha256"],
    }
    encoded = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
