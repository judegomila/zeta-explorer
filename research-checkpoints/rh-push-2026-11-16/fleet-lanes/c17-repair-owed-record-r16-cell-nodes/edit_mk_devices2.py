#!/usr/bin/env python3
"""Second one-off edit of engine/curated/mk_devices.py (lane c17-repair-owed-record-r16-cell-nodes): header note,
round-16 outcomes in the evidence of two closed device types, pending list. Each replacement must match once."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.normpath(os.path.join(HERE, '..', '..', 'engine', 'curated', 'mk_devices.py'))
s = open(P, encoding='utf-8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80])
    s = s.replace(a, b)
rep('Edit this file, then run it, then build_graph.py."""',
    "Edited by c17-repair-owed-record-r16-cell-nodes (round 17): the eleven silent-cell-* entries are no longer device types (planner decision of round 17: read classes, not crossing devices). They are the list CELLS (key 'cells' of devices.json, type 'cell', states cell / tried-not-closed / closed; U2-POS closed, U6 (g) tried-not-closed). Evidence of fejer-section-prime-chain-growing-p and dictionary-dn-* carries the round-16 outcomes; pending list updated (Proposition 5 and the DN canonical tier leave it; the rank-2 closure question enters; the amplifier item is tried-not-closed with the S2 disposition). Device types 53 closed / 1 floored / 11 open -> 53 / 1 / 0, plus 11 cells. Previous file scratch/mk_devices.pre-c17-repair.py.\n"
    'Edit this file, then run it, then build_graph.py."""')
rep("Open cell: Proposition 5 (argued for one off-line pair; lane c16-ctheta-proposition5-power-sum).",
    "Proposition 5 decided in round 16 (push/c16-ctheta-proposition5-power-sum, one independent referee, corrections E1 to E6): it is not a two-sided correspondence. PROVED in window form: a lattice row of pairs of spacing 2 pi/(theta log 2T) contributes a constant for every offset b on the window (inside the Riemann-von Mangoldt density only for theta < 1/2). PROVED given Turan's second main theorem (recalled, not opened): an isolated cluster of n pairs has b_max <= (c n + O(log log gamma))/(theta log gamma). MEASURED in balls on grids: linear growth in n is attained by synthetic point sets. The all-heights form is measured, not proved. C(theta) as a zero-side region for P = t^theta devices is closed; no multiplicativity.")
rep("The canonical tier {T-NR, E_a, HEAT} is NOT closed: 22,508 nodes at T-train, 0 hold out, 67,138 float64-undecided nodes (lane c16-dn-canonical-tier-ball-conversion); the FE tier is not closed either.",
    "Canonical tier {T-NR, E_a, HEAT}: closed as MEASURED, outcome 'none', by push/c16-dn-canonical-tier-ball-conversion (round 16, one independent referee): the 67,138 float64-undecided nodes are decided in balls (360 reflection identity / 37,634 excluded / 29,144 T-train / 0 undecided), 0 hold out; the 22,508 float64 T-train nodes are not ball-confirmed (referee correction 1), 0 hold out under the c15 rule; 86 threshold-scanned one-kernel nodes are refuted on the positive side. DJ canonical lifts: 59 T-train, 0 full. Not re-read in balls: the FE tier, quotient minors, product families.")
rep(" dict(name='Hecke amplifiers with T < N on truncated Eisenstein data (tried-not-closed part of the amplified edge argument of c15-edge-argument-strip-width-hecke-amplified: argued only; for T >= N the amplified inequality is implied by the unamplified one)', lane='c16-amplifier-below-truncation-eisw-compute', state='open'),",
    " dict(name='Hecke amplifiers with T < N on truncated Eisenstein data (family 31 item of campaign/STRATEGY.md section 3.1). Round 16, push/c16-amplifier-below-truncation-eisw-compute (one independent referee): MEASURED obstruction on T <= 4, N <= 128, gamma <= 541 (G_opt < N^delta at on-line zeros, arb balls); not a proved closure. PROVED: closed Gram formula for all T >= 1, N; R2 = 1 for T >= N; R2 <= M/L. The registered prediction R2 <= 1 failed for T < N (sup 1.04 to 1.46, float64), also at EIS-w points. Disposition of the fired S2 clause (planner, round 17): set aside; the clause had no control comparison; EIS-w shares the excess; no follow-up lane', lane='c16-amplifier-below-truncation-eisw-compute', state='tried-not-closed'),\n"
    " dict(name='Closure of rank-2 Gram positivity (truncated minimal-parabolic SL_3 Eisenstein data) under symmetric Blaschke insertions: measured to pass, not proved (map row D10; cell U6 (g))', lane='c17-rank2-gram-symmetric-blaschke-closure', state='open'),")
rep(" dict(name='Statement C(theta) for Fejer sections with P = t^theta: Proposition 5 (zeros within c_theta/log gamma of the line) with several off-line zeros (map row Q30; argued for one pair)', lane='c16-ctheta-proposition5-power-sum', state='open'),\n", "")
rep(" dict(name='Canonical tier {T-NR, E_a, HEAT} of dictionary DN (67,138 float64-undecided nodes) and the draw stage of dictionary DJ under the canonical lifts (map row G41: not closed)', lane='c16-dn-canonical-tier-ball-conversion', state='open'),\n", "")
open(P, 'w', encoding='utf-8').write(s)
print('ok')
