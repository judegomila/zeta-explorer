#!/usr/bin/env python3
"""Produce an exact rational leading-prolate oscillation certificate."""
from __future__ import annotations

import argparse
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re
from typing import Any


SCHEMA = "xi-prolate-leading-oscillation-v1"
STATUS = "LEADING_PROLATE_OSCILLATION_COMPONENT"
TERMINAL_STATE = "P0_INVALIDATED"
NOTE = "notes/LEADING_PROLATE_OSCILLATION_THEOREM.md"
SOURCE_LOCK = "LEADING_PROLATE_OSCILLATION_SOURCE_LOCK.json"
PINNED_HASHES = {
    NOTE: "d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b",
    SOURCE_LOCK: "f473e0fc2028094f9866ea05073ad3282cdd80b42e40e197c4cf9e882f44f6f7",
}
_SHA256 = re.compile(r"^[0-9a-f]{64}$")

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

ARITHMETIC = {
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


def _root() -> Path:
    return Path(__file__).resolve().parents[1]


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _locked_dependency_hashes(root: Path) -> dict[str, str]:
    lock = json.loads((root / SOURCE_LOCK).read_text(encoding="utf-8"))
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
        raise ValueError("leading-oscillation source-lock inventory mismatch")
    if lock["schema"] != "xi-prolate-leading-oscillation-source-lock-v1":
        raise ValueError("leading-oscillation source-lock schema mismatch")
    if lock["terminal_state"] != TERMINAL_STATE:
        raise ValueError("leading-oscillation terminal-state mutation")
    dependencies = lock["dependencies"]
    if not isinstance(dependencies, list) or not dependencies:
        raise ValueError("leading-oscillation dependencies missing")
    result: dict[str, str] = {}
    for item in dependencies:
        if not isinstance(item, dict) or set(item) != {"path", "sha256", "role"}:
            raise ValueError("malformed leading-oscillation dependency")
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
            raise ValueError("invalid leading-oscillation dependency fields")
        if _sha256(root / relative) != expected:
            raise ValueError(f"dependency hash mismatch: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _verified_source_hashes() -> dict[str, str]:
    root = _root()
    for relative, expected in PINNED_HASHES.items():
        if _sha256(root / relative) != expected:
            raise ValueError(f"source byte hash mismatch: {relative}")
    result = dict(PINNED_HASHES)
    for relative, expected in _locked_dependency_hashes(root).items():
        if relative in result and result[relative] != expected:
            raise ValueError(f"conflicting source hash: {relative}")
        result[relative] = expected
    return dict(sorted(result.items()))


def _rational(value: Fraction) -> dict[str, str]:
    return {
        "numerator": str(value.numerator),
        "denominator": str(value.denominator),
    }


def _unit_cosine_moments() -> tuple[int, Fraction, Fraction, Fraction, Fraction, Fraction]:
    """Derive the three scaled moments from the exact 2*pi endpoints."""

    harmonic = 2
    endpoint_sine = Fraction(0)
    endpoint_cosine = Fraction(1)
    pi_times_j0 = endpoint_sine / harmonic
    pi_squared_times_j1 = (endpoint_cosine - 1) / (harmonic * harmonic)
    pi_squared_times_j2 = (
        2 * endpoint_cosine / (harmonic * harmonic)
    )
    return (
        harmonic,
        endpoint_sine,
        endpoint_cosine,
        pi_times_j0,
        pi_squared_times_j1,
        pi_squared_times_j2,
    )


def _last_or_none(values: range) -> int | None:
    return values[-1] if len(values) else None


def produce(lambda_numerator: int) -> dict[str, Any]:
    if isinstance(lambda_numerator, bool) or not isinstance(lambda_numerator, int):
        raise TypeError("lambda_numerator must be an exact integer")
    if lambda_numerator < 5 or lambda_numerator % 2 == 0:
        raise ValueError("lambda_numerator must be odd and at least 5")

    p = lambda_numerator
    p2 = p * p
    packet_count = p2
    packet_length = Fraction(2, p2)
    packet_norm_squared = Fraction(1, p2)
    (
        harmonic,
        endpoint_sine,
        endpoint_cosine,
        pi_times_j0,
        pi_squared_times_j1,
        pi_squared_times_j2,
    ) = _unit_cosine_moments()
    if pi_times_j0 or pi_squared_times_j1:
        raise AssertionError("constant and linear cosine moments must vanish")
    c_squared_over_pi_squared = Fraction(p2 * p2, 4)
    packet_form_difference = -(
        c_squared_over_pi_squared
        * packet_length**3
        * pi_squared_times_j2
    )
    rayleigh_margin = -packet_form_difference / packet_norm_squared
    lambda_squared = Fraction(p2, 4)
    c_over_pi = Fraction(p2, 2)
    plus_targets = range(8, packet_count, 4)
    minus_targets = range(6, packet_count, 4)

    certificate = {
        "lambda": _rational(Fraction(p, 2)),
        "lambda_squared": _rational(lambda_squared),
        "c_over_pi": _rational(c_over_pi),
        "transition_count": packet_count,
        "packet_count": packet_count,
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
        "tiled_length": _rational(packet_count * packet_length),
        "first_packet": {
            "left": _rational(Fraction(-1)),
            "right": _rational(Fraction(-1) + packet_length),
        },
        "last_packet": {
            "left": _rational(Fraction(-1) + (packet_count - 1) * packet_length),
            "right": _rational(Fraction(1)),
        },
        "max_certified_index": packet_count - 1,
        "plus_target_count": len(plus_targets),
        "plus_first_target": plus_targets[0] if len(plus_targets) else None,
        "plus_last_target": _last_or_none(plus_targets),
        "minus_target_count": len(minus_targets),
        "minus_first_target": minus_targets[0] if len(minus_targets) else None,
        "minus_last_target": _last_or_none(minus_targets),
    }

    return {
        "schema": SCHEMA,
        "status": STATUS,
        "terminal_state": TERMINAL_STATE,
        "input": {
            "lambda_numerator": p,
            "lambda_denominator": 2,
        },
        "source_hashes": _verified_source_hashes(),
        "locked_formulas": dict(LOCKED_FORMULAS),
        "source_admissions": dict(SOURCE_ADMISSIONS),
        "arithmetic": dict(ARITHMETIC),
        "certificate": certificate,
        "producer_pass_boolean_trusted_by_replay": False,
        "claim_scope": {key: list(value) for key, value in CLAIM_SCOPE.items()},
        "result": "LEADING_PROLATE_OSCILLATION_EXACT_PASS",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lambda-numerator", type=int, required=True)
    parser.add_argument("--output")
    args = parser.parse_args()
    encoded = json.dumps(produce(args.lambda_numerator), indent=2, sort_keys=True) + "\n"
    if args.output:
        Path(args.output).write_text(encoded, encoding="utf-8")
    else:
        print(encoded, end="")


if __name__ == "__main__":
    main()
