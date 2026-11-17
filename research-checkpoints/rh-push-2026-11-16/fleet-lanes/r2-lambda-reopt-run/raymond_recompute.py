# Independent recomputation of Raymond's chain with a half-plane start.  Does not import tmp/s145-1-g1/pipeline.py or
# tmp/oai-lambda-raymond.py; reads only the data files (PLAN.json, KERNELS.json, TABLES.json at the Platt-Trudgian height).
# Exact rationals.  Extra checks per chosen substep: v <= rho^2, r h < 2, cap >= s_r on 41 sample points of [0, v], rate > 0.
import json, sys
from fractions import Fraction as F
G1 = 'tmp/s145-1-g1/'
PLAN = json.load(open(G1 + 'data/PLAN.json'))
KER = json.load(open('/tmp/raymond_pr/pr/Proof_and_Replay/Evidence/numerical/parent_numerical/KERNELS.json'))['rows']
TAB = json.load(open(G1 + 'out/X1/TABLES.json'))
QE = F(1, 10**8)
def up(x, den):
    return F(-((-x.numerator * den) // x.denominator), den)
def em(x):                      # degree-18 Taylor polynomial of exp(-x): upper bound for 0 <= x < 1 (even degree)
    assert 0 <= x < 1
    s = t = F(1)
    for j in range(1, 19):
        t = t * (-x) / j; s += t
    return s
def s_r(a, V):                  # own-pair term of the two-point probe at shift r (a = r^2), V = y^2/h^2
    return 2 * (1 + a - V) / ((1 + a - V)**2 + 4 * a * V)
def cap_of(k, V):
    a = F(k['r'])**2; M = F(k['self_cap'])
    if 3 * a >= 1: return min(M, 2 / (1 + a))
    if (1 + a - V)**2 >= 4 * a * (1 + a): return min(M, s_r(a, V))
    return M
KP = [(F(k['rho'])**2, F(k['lambda']), F(k['r']), 'r_' + k['r'].replace('/', '_'), k) for k in KER]
def run(theta, off=F(2, 10**6), parts=128):
    th = F(theta); qb = (2 * th - 1)**2; q = qb + off; assert q > qb
    dt = F(PLAN['step']); delta = dt / parts; n = 0; viol = 0; minslack = None; s1 = None
    for i, row in enumerate(PLAN['rows']):
        h = F(row['height']); tl = F(row['t_lo']); tb = TAB[i]
        for j in range(parts):
            now = tl + j * delta; v = q / (h * h); best = None
            for rho2, lam, r, key, k in KP:
                if v > rho2: continue
                ell = F(tb[key]['both']); cap = cap_of(k, v); c = 2 * lam / h * (ell - cap / h)
                if c > 0 and (best is None or c > best[0]): best = (c, rho2, lam, r, cap, 0)
            if 0 < v < 1 and 29 * v * v - v - 1 <= 0:
                ell = F(tb['sharp']['both']); cap = 6 / (4 - v); c = 4 / h * (ell - cap / h)
                if c > 0 and (best is None or c > best[0]): best = (c, None, None, None, cap, 1)
            assert best is not None
            c, rho2, lam, r, cap, sharp = best
            if sharp:
                if not (v < F(51, 250) and h * h / 3 < 4): viol += 1
            else:
                if not (v <= rho2 and h * r < 2): viol += 1
                a = r * r
                sl = min(cap - s_r(a, v * m / 40) for m in range(41))
                if sl < 0: viol += 1
                minslack = sl if minslack is None or sl < minslack else minslack
            if n == 0:
                s1 = q - (2 + c * q) * F(1, 10**8) - qb; assert s1 > 0
            assert 0 < c * delta < 1
            outq = (q + 2 / c) * em(c * delta) - 2 / c; n += 1
            if outq <= QE:
                z = c * (q - QE) / (2 + c * QE); assert 0 < z < 1
                lag = sum(((-1)**(m + 1) * z**m / m for m in range(1, 12)), F(0)) / c
                assert 0 < lag <= delta
                U = up(now + lag + QE / 2, 10**15)
                return dict(theta=str(th), U=str(U), U_float=float(U), cell=i, steps=n, violations=viol,
                            min_cap_slack=float(minslack), S1_margin=float(s1), terminal_q=float(q), terminal_lag=float(lag), delta=float(delta))
            q = up(outq, 2**96)
res = [run(t) for t in sys.argv[1:]]
for r in res: print(json.dumps(r), flush=True)
json.dump(res, open('tmp/research-2026-11-16/push/r2-lambda-reopt-run/raymond_recompute.json', 'w'), indent=1)
