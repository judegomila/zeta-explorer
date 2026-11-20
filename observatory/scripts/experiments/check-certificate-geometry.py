#!/usr/bin/env python3
"""Exact check of the geometric facts the zero-line certificate relies on.

Run (standard library only):
    python scripts/experiments/check-certificate-geometry.py

Reads dist/experiments/zero-line-certificate.json. Every recorded double is an
exact dyadic rational, so the inequalities below are decided exactly with
fractions, with no rounding.

Checks:
  1. heights strictly increase;
  2. consecutive discs are disjoint: t[k+1] - t[k] > r[k] + r[k+1];
  3. every disc is in the open upper half-plane: t[0] - r[0] > 0;
  4. every disc is below the top of the rectangle: t[-1] + r[-1] < T,
     and inside its sides: sigmaMin < 1/2 - r and 1/2 + r < sigmaMax;
  5. every recorded disc winding is 1, and the rectangle's winding plus the
     one pole equals twice the number of discs.
"""
import json
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
record = json.loads((ROOT / 'dist' / 'experiments' / 'zero-line-certificate.json').read_text())
discs = record['discs']
rect = record['rectangle']
t = [Fraction(d['t']) for d in discs]
r = [Fraction(d['radius']) for d in discs]
T, lo, hi = Fraction(rect['T']), Fraction(rect['sigmaMin']), Fraction(rect['sigmaMax'])
half = Fraction(1, 2)

checks = {
    'heights strictly increase': all(a < b for a, b in zip(t, t[1:])),
    'radii are positive': all(x > 0 for x in r),
    'consecutive discs are disjoint': all(t[k + 1] - t[k] > r[k] + r[k + 1] for k in range(len(t) - 1)),
    'discs lie in the open upper half-plane': all(a - b > 0 for a, b in zip(t, r)),
    'discs lie below the top of the rectangle': all(a + b < T for a, b in zip(t, r)),
    'discs lie inside the sides of the rectangle': all(lo < half - x and half + x < hi for x in r),
    'every disc winding is 1': all(d['winding'] == 1 for d in discs),
    'rectangle count equals twice the discs': rect['winding'] + 1 == 2 * len(discs) == rect['zerosInside'],
}
separation = min(t[k + 1] - t[k] - r[k] - r[k + 1] for k in range(len(t) - 1))
for name, ok in checks.items():
    print(('ok    ' if ok else 'FAIL  ') + name)
print(f'discs: {len(discs)}   smallest separation: {float(separation):.6g}   '
      f'lowest point: {float(t[0] - r[0]):.6g}   highest point: {float(max(a + b for a, b in zip(t, r))):.8g}')
sys.exit(0 if all(checks.values()) else 1)
