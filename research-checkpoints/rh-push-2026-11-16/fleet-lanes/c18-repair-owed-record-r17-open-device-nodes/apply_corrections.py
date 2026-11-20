#!/usr/bin/env python3
"""Lane c18-repair-owed-record-r17-open-device-nodes: the nine corrected sentences of round 16 that still stood in
lane files (rows 3 to 11 of campaign/CORRECTIONS_R16.md). Each false sentence is kept and a bracketed correction is
inserted directly after it (tables: a note line after the table). Every anchor must match exactly once.
Previous files: before/lanefiles/. No correction is a statement about zeros of zeta; no verdict changes."""
import os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
PUSH = os.path.normpath(os.path.join(HERE, '..'))
TAG = ('[Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes (register '
       'campaign/CORRECTIONS_R16.md row %d; second referee push/c16-referee-r15-j1prime-u8-screening): the preceding '
       'statement is false as written. Corrected: %s]')
log = []
def edit(rel, jobs):
    p = os.path.join(PUSH, rel)
    bdir = os.path.join(HERE, 'before', 'lanefiles', os.path.dirname(rel))
    os.makedirs(bdir, exist_ok=True)
    b = os.path.join(bdir, os.path.basename(rel))
    if not os.path.exists(b):
        shutil.copy2(p, b)
    s = open(p, encoding='utf-8').read()
    assert 'c18-repair-owed-record-r17-open-device-nodes' not in s, 'already applied: ' + rel
    for row, anchor, text, mode in jobs:
        assert s.count(anchor) == 1, (rel, anchor[:60], s.count(anchor))
        note = TAG % (row, text)
        if mode == 'after':
            s = s.replace(anchor, anchor + ' ' + note)
        elif mode == 'line':   # new paragraph line after the line holding the anchor (table rows)
            k = s.index(anchor); e = s.index('\n', k)
            s = s[:e + 1] + '\n' + note + '\n' + s[e + 1:]
        log.append((rel, row, mode))
    open(p, 'w', encoding='utf-8').write(s)

edit('c15-u5-window-count-threshold-translate-control/RESULT.md', [
 (3, 'and no translate other than the near-identity ones does better.',
  '"the reflected translate alpha = -2c has defect (L + 2 abs(delta))^2/(8T), abs(delta) <= pi/(2 log(T/2 pi)) depending on T; '
  'it is better than the k = 1 translate when (L + 2 abs(delta))^2 < 8 pi L/log(T/2 pi), which holds for every origin if '
  'L < 8 pi/log(T/2 pi) - 2 pi/log(T/2 pi) (1 + o(1)) and for no origin if L > 8 pi/log(T/2 pi). For a fixed number of unit '
  'windows K_tr = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + O(1/log T)); the second term is an upper bound for the '
  'reflection branch. Among translates with abs(alpha) <= T/2 no other does better." (Form after E1 of the referee of the '
  'referee lane; the first replacement, defect L^2/(8T), is not exact and is not to be used. Map row S12b.)', 'after')])
edit('c15-edge-argument-strip-width-hecke-amplified/RESULT.md', [
 (4, 'completely multiplicative parameters `alpha_p = i p^(-delta/2)` one has `tau(p) = 0`,',
  '"for the unimodular parameters alpha_p = i one has tau(p) = 0; for alpha_p = i p^(-delta/2) it is '
  '-i (p^(delta/2) - p^(-delta/2))." The verdict line "closed for T >= N; T < N open" now reads: T < N is a measured '
  'obstruction on T <= 4, N <= 128 (map row G42), not a proved closure.', 'after')])
edit('c15-u7-growing-section-twin-ladder-bridge/RESULT.md', [
 (5, 'T-NR has no Euler product.',
  '"For 0 < c <= 2 the symmetric factor has its zeros on the line and adds non-negative terms; this is not the control '
  'T-NR (abs c > 2), for which the statement fails through the off-line zeros of the factor." (Map row Q30.)', 'after'),
 (6, 'unimodular twists and T-NR (c <= 2) pass.',
  '"Dirichlet characters pass under GRH; the campaign\'s unimodular control violates the stage statement at theta >= 1" '
  '(MEASURED: first referee 4 of 4 random unimodular twists violate; second referee 6 of 6 at t near 2000, P = 2000). '
  'The factor with c <= 2 is not the control T-NR (row 5 of the register). Map row Q30.', 'after')])
edit('c15-klein-transport-lemma-w-stage-a-and-e1/RESULT.md', [
 (7, 'all 2N(T) zeros at distance a0; sum = 2N(T) T^(2A a0).',
  '"each zeta zero at signed offset e gives zeros of E_a0 at offsets e + a0, e - a0, and '
  'T^(2A abs(e+a0)) + T^(2A abs(e-a0)) >= 2 T^(2A a0); so the sum is at least 2N(T) T^(2A a0)." The conclusion FAILS '
  'stands.', 'after'),
 (8, 'analyticity and a non-vanishing trace, and Lemma W is a statement about the zero multiset.',
  '"the section-6 inequality uses the functional-equation symmetry, order one and a non-vanishing trace; no Euler '
  'product." (First referee; not rechecked by the second.)', 'after')])
edit('c15-nonhomogeneous-pair-triple-kernel-search/RESULT.md', [
 (9, '| run 2 against run 1 |',
  '"Nine-class tier: 752 = 360 identity + 392 in balls; six-class tier: 2,774 = 360 identity + 2,414 in balls." This '
  'replaces the counts "280 by reflection identity, 472 in balls" (sections 0 and 6), "280 identity, 2,494 read" and '
  '"280 identity, 2,494 - 80 = 2,414 in balls" (sections 0, 6) and "280 grid nodes are of this kind" (section 2) of this '
  'file. Outcome "none" unchanged (map row G41).', 'line')])
edit('s1-prime-torus-orbit/RESULT.md', [
 (10, 'pointwise variance 0.97 ... 1.63 = (1/2) log log P + 0.21 to within 0.02',
  '"the exact Haar variance at sigma = 1/2 is (1/2) sum over p <= P of Li_2(1/p) = 0.971 ... 1.590 for P = 1e2 ... 1e7; '
  'the sampled column 0.988 ... 1.630 is high by 0.02 to 0.04."', 'after')])
edit('s1-zero-statistics-gram/RESULT.md', [
 (11, '| 4b | same | lam_min of the Nyman-Beurling Gram',
  'the cells "LIOU =" and (row 1a) "T-NR =" of rows 1a to 2 of the table above hold only with scope lines 1 and 3 of '
  'push/c16-referee-r15-j1prime-u8-screening/REFEREE2_s1-zero-statistics-gram.md. For T-NR: "every functional of the list '
  'of on-line ordinates takes the same value on zeta and on T-NR for abs c > 2, where the functional reads the list alone; '
  'a statistic that also uses the object\'s own counting function or conductor separates T-NR through its T log q/pi '
  'further zeros, which is a zero count."', 'line')])
for l in log: print(l)
print(len(log), 'corrections inserted')
# Post-step applied by hand after the first run (2026-11-19): in c15-nonhomogeneous-pair-triple-kernel-search/RESULT.md
# the row '| run 2 against run 1 |' is not the last row of its table, so the note of row 9 was moved to the first
# line after the end of that table (after the 'referee checks' row). The script as written places it one row early.
