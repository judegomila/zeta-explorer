#!/usr/bin/env python3
"""check_rcert: exact checks of a parallel-referee certificate: (1) the listed dyadic boxes tile the grid NG=(9,13,11) exactly
(no box is an ancestor of another; exact volume sum = 1287 initial cells), (2) all bounds finite, (3) margin = max ub - K0*,
(4) comparison with the campaign certificate margin (exact rationals).  usage: check_rcert.py RCERT.json"""
import sys, json, math
from fractions import Fraction as F
r = json.load(open(sys.argv[1])); B = r['boxes']; S = {tuple(b[:6]) for b in B}
assert len(S) == len(B)
vol = sum(F(1, 2 ** (b[0] + b[1] + b[2])) for b in B)
anc = 0
for b in S:
    k = list(b[:3]); i = list(b[3:])
    # every proper ancestor in the dyadic lattice (all coarsenings per axis) must be absent
    for a0 in range(k[0] + 1):
        for a1 in range(k[1] + 1):
            for a2 in range(k[2] + 1):
                if (a0, a1, a2) == tuple(k): continue
                if (a0, a1, a2, i[0] >> (k[0] - a0), i[1] >> (k[1] - a1), i[2] >> (k[2] - a2)) in S: anc += 1
inr = all(0 <= b[3] < 9 * 2 ** b[0] and 0 <= b[4] < 13 * 2 ** b[1] and 0 <= b[5] < 11 * 2 ** b[2] for b in B)
fin = all(math.isfinite(b[6]) for b in B); U = max(b[6] for b in B)
F36 = json.load(open(__file__.rsplit('/', 1)[0] + '/floors36.json'))[str(r['idx'])]
out = dict(idx=r['idx'], cell=r['cell'], boxes=len(B), open=r['nopen'], complete=r['complete'], tiling_exact=bool(vol == 9 * 13 * 11 and anc == 0 and inr),
           finite=fin, K0_equal=r['K0star'] == F36['K0star'], margin_ref=U - r['K0star'], margin_campaign=F36['margin'], target=F36['target'],
           ref_le_campaign=bool(F(U) <= F(F36['U'])), ratio_ref_over_campaign=(U - r['K0star']) / F36['margin'], secs=r['secs'], cpu=r['cpu'], cnt=r['cnt'])
print(json.dumps(out))
