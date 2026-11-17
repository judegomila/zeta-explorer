# Greedy dominance check: q_k of a re-optimised dump at theta against the fixed-mode replay of the archived F2 rates from the
# same start.  Reports whether q_re_k <= q_replay_k for every k (exact rationals) and the largest and final differences.
import sys, json, gzip
from fractions import Fraction as F
F2 = '/Users/USER/Documents/GitHub/mathexplorer/tmp/qrh-tune-out/F2_final.steps.jsonl.gz'
DELTA = F(1, 512000); QE = F(1, 10**8)
def up(x, den): return F(-((-x.numerator * den) // x.denominator), den)
def em(x):
    s = t = F(1)
    for j in range(1, 19):
        t = t * (-x) / j; s += t
    return s
def rd(p):
    op = gzip.open if p.endswith('.gz') else open
    with op(p, 'rt') as f:
        for line in f:
            d = json.loads(line); yield F(d['q']), F(d['rate'])
path, theta = sys.argv[1:3]
th = F(theta); q = (2 * th - 1)**2 + F(1, 10**7)
re = list(rd(path)); ok = True; mx = F(0); nrate = 0; k = -1
for k, (qo, c) in enumerate(rd(F2)):
    if k >= len(re): break
    if re[k][0] > q: ok = False
    mx = max(mx, q - re[k][0])
    if re[k][1] < c: nrate += 1
    outq = (q + 2 / c) * em(c * DELTA) - 2 / c
    if outq <= QE: break
    q = up(outq, 2**96)
print(json.dumps(dict(dump=path, theta=theta, re_substeps=len(re), replay_terminal_k=k, q_re_le_q_replay_all_k=ok, max_q_gap=float(mx),
                      substeps_where_re_rate_below_F2_rate=nrate)))
