#!/usr/bin/env python3
"""Regression test for the current certified spatial-tail degree frontier."""

from __future__ import annotations

import importlib.util
from pathlib import Path


SOURCE = Path(__file__).resolve().parents[1] / "src" / "regional_atlas.py"
SPEC = importlib.util.spec_from_file_location("regional_atlas", SOURCE)
assert SPEC is not None and SPEC.loader is not None
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


for degree in (7, 13, 15, 17):
    MODULE.ThetaMoments(degree, 416).spatial_tails()

try:
    MODULE.ThetaMoments(19, 416).spatial_tails()
except AssertionError:
    pass
else:
    raise AssertionError(
        "degree 19 unexpectedly passed the current spatial-tail composition bound"
    )

print("spatial-tail preflight tests: PASS (degree 19 remains explicitly blocked)")
