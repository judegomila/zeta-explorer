#!/usr/bin/env python3
"""Second pass on the round-3 map edits: wording of four "Defeated by" cells so that the control codes parsed by
engine/build_graph.py (controls_in) are the controls that pass the row, and no control that is separated by it.
Replay from before/OBSTRUCTION_MAP.md: apply_map_r3.py, then this script (MAP_PATH=<file> selects another target)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
PAIRS = [
 ('| WT, U (height translate passes any fixed number of windows at large height); constructed unimodular Euler products with a prescribed off-line zero (m < m*); DH and L(chi_5) fail only by conductor at m >= 2, at the same step as non-multiplicative sequences |',
  '| WT, U; the height translate passes any fixed number of windows at large height; constructed unimodular Euler products with a prescribed off-line zero (m < m*). Not defeating: the conductor-5 functions (Davenport-Heilbronn, L(chi_5)) fail the test by conductor at m >= 2, at the same step as non-multiplicative sequences |'),
 ('twisted form: U, TW-, DH (the criterion holds verbatim for U, RZ_b, DH; the Liouville twist is the exact mirror); target |',
  'twisted form: DH, U, TW- (the criterion holds verbatim for U, RZ_b, DH; the Liouville twist is the exact mirror); target |'),
 ('| TW (size-only); U, TW-, EA, B (reflected stages: not separated from zeta, all fail at the same step); DH breaks at a parallel junction',
  '| TW (size-only); B, U, TW-, EA (reflected stages: not separated from zeta, all fail at the same step); DH breaks at a parallel junction'),
 ('EA has threshold 1/2 + a; U, TW-, EA, B (reflected stages: not separated from zeta) |',
  'EA has threshold 1/2 + a; B, U, TW-, EA (reflected stages: not separated from zeta) |'),
]
mp = os.environ.get('MAP_PATH') or os.path.normpath(os.path.join(HERE, '..', 'OBSTRUCTION_MAP.md'))
t = open(mp, encoding='utf-8').read()
n = 0
for a, b in PAIRS:
    if a in t:
        assert t.count(a) == 1
        t = t.replace(a, b); n += 1
open(mp, 'w', encoding='utf-8').write(t)
print('map: replaced', n, 'of', len(PAIRS))
