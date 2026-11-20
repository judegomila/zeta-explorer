#!/usr/bin/env python3
"""Focused CLI smoke tests for the reflected-operator structure miner."""

from __future__ import annotations

import json
import importlib.util
import math
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np


SCRIPT = Path(__file__).resolve().parents[1] / "src" / "operator_mining.py"


SPEC = importlib.util.spec_from_file_location("operator_mining", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def single_orbit(u: float) -> float:
    z = math.pi * math.exp(2.0 * u)
    return math.exp(0.5 * u - z) * (8.0 * z * z - 12.0 * z)


shift = 0.25
point = 0.3
step = 1.0e-6
finite_difference = (
    single_orbit(point + step) - single_orbit(point - step)
) / (2.0 * step) + shift * single_orbit(point)
z = np.array([math.pi * math.exp(2.0 * point)])
computed = MODULE.scaled_polynomial_orbit(
    z,
    np.array([0.5 * point - z[0]]),
    MODULE.orbit_polynomials(1, shift)[1],
)[0]
assert abs(computed - finite_difference) <= 1.0e-7 * max(1.0, abs(computed))


def run_case(shift: str) -> dict[str, object]:
    with tempfile.TemporaryDirectory() as temporary:
        output = Path(temporary) / "result.json"
        subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "--degree",
                "5",
                "--shift",
                shift,
                "--nodes",
                "64",
                "--output",
                str(output),
            ],
            check=True,
            text=True,
            capture_output=True,
        )
        payload = json.loads(output.read_text(encoding="utf-8"))
    assert payload["status"] == "analytic_structure_experiment"
    assert payload["parameters"]["degree"] == 5
    assert payload["parameters"]["shift"] == shift
    assert payload["parameters"]["shift_numeric"] == float(shift)
    assert payload["parameters"]["nodes"] == 64
    assert "all-degree statements" in payload["scope"]
    for parity in ("even", "odd"):
        block = payload["parities"][parity]
        assert block["available"] is True
        assert block["effective_dimension"] >= 2
        spectrum = block["signed_relative_parent"]["eigenvalues"]
        assert spectrum
        assert all(math.isfinite(value) for value in spectrum)
        # Difference-over-sum spectra lie in [-1,1] for exact component Grams.
        assert min(spectrum) >= -1.000001
        assert max(spectrum) <= 1.000001
        assert "JB_minus_BJ" in block["displacements"]
        assert "falsifier_flags" in block["factorization_diagnostics"]
    return payload


normalized = run_case("0")
positive_shift = run_case("0.25")
assert normalized["normalization"].startswith("a=0 normalized")
assert positive_shift["normalization"].startswith("positive-shift")
print("operator mining smoke tests: PASS")
