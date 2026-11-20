#!/usr/bin/env python3
"""Smoke and cross-precision checks for parity_residue.py."""

from __future__ import annotations

import importlib.util
import json
import tempfile
from fractions import Fraction
from pathlib import Path

import mpmath as mp


SOURCE = Path(__file__).resolve().parents[1] / "src" / "parity_residue.py"
SPEC = importlib.util.spec_from_file_location("parity_residue", SOURCE)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


# Exact recurrence anchors and the exact modular residue identity.
basis = MODULE.graded_basis(7)
assert basis[0] == ((Fraction(1),), Fraction(0))
assert basis[1] == ((Fraction(9, 2), Fraction(-2)), Fraction(6))
for poly, residue in basis:
    assert residue == -MODULE.ell_exact(poly)


low = MODULE.run_experiment(n=2, parity="even", h_value="0", dps=70)
high = MODULE.run_experiment(n=2, parity="even", h_value="0", dps=110)
assert low["status"] == high["status"] == "analytic_pattern_experiment"
assert low["parameters"] == {"n": 2, "parity": "even", "h": "0", "dps": 70}
assert high["parameters"]["dps"] == 110


def assert_close(path: tuple[str, ...], tolerance: str = "1e-48") -> None:
    left: object = low
    right: object = high
    for key in path:
        left = left[key]  # type: ignore[index]
        right = right[key]  # type: ignore[index]
    a = mp.mpf(str(left))
    b = mp.mpf(str(right))
    assert abs(a - b) <= mp.mpf(tolerance) * max(1, abs(a), abs(b)), (
        path,
        a,
        b,
    )


assert_close(("interpolant", "ell_A"))
assert_close(("orbit_l2", "polynomial_l2_squared_first_n_exactly_zero"))
assert_close(("orbit_l2", "augmented_feature_total_l2_squared"))
assert_close(("orbit_l2", "ell_over_polynomial_l2"))
assert mp.mpf(low["diagnostics"]["max_root_residual_relative_to_cancellation_scale"]) < mp.mpf(
    "1e-55"
)

# Exercise the other parity and the atomic output contract used by the governor.
odd = MODULE.run_experiment(n=1, parity="odd", h_value="0", dps=70)
odd_high = MODULE.run_experiment(n=1, parity="odd", h_value="0", dps=110)
assert odd["parameters"]["parity"] == "odd"
for path in (
    ("interpolant", "ell_A"),
    ("orbit_l2", "polynomial_l2_squared_first_n_exactly_zero"),
    ("orbit_l2", "augmented_feature_total_l2_squared"),
):
    left: object = odd
    right: object = odd_high
    for key in path:
        left = left[key]  # type: ignore[index]
        right = right[key]  # type: ignore[index]
    a = mp.mpf(str(left))
    b = mp.mpf(str(right))
    assert abs(a - b) <= mp.mpf("1e-48") * max(1, abs(a), abs(b)), path
with tempfile.TemporaryDirectory() as temporary:
    output = Path(temporary) / "nested" / "result.json"
    MODULE.atomic_write_json(output, odd)
    replay = json.loads(output.read_text(encoding="utf-8"))
    assert replay["status"] == "analytic_pattern_experiment"
    assert replay["parameters"] == odd["parameters"]

print("parity residue smoke and cross-precision checks: PASS")
