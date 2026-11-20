"""Combination (2), extra: non-arithmetic vectors inside the admissible region of zeta's form on {4^k}.
For a direction dZ, theta* = sup{theta: P(Z + theta dZ) >= 0} by bisection on certified LDL signs (ball arithmetic).
Directions: uniform scaling of Z; deletion of one prime; one prime moved to a non-integer; Lambda(n) -> Lambda(n) (1 + eps cos(log n))."""
import sys, json, math
from flint import arb, acb, ctx, acb_series
import lib, lib2
family, n, bits = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
ctx.prec = bits
nu = [lib2.node(family, k) for k in range(n)]
P3 = [lib2.parts(t) for t in nu]
A = [p[0] + p[1] for p in P3]; Z = [-p[2] for p in P3]
s = [arb(1) / 2 + t for t in nu]
def loc(p, si):                      # contribution of the Euler factor at p (real p > 1) to Z
    q = (-(si * arb(p).log())).exp(); return arb(p).log() * q / (1 - q)
def wt(si):                          # sum Lambda(n) cos(log n) n^-s = -Re zeta'/zeta(s + i)
    x = acb_series([acb(si, 1), 1], prec=2); z = x.zeta(); return -(z[1] / z[0]).real
dirs = {
 'scale all Z by (1 - theta)': [-z for z in Z],
 'scale all Z by (1 + theta)': [z for z in Z],
 'remove theta of the prime 2': [-loc(2, si) for si in s],
 'remove theta of the prime 101': [-loc(101, si) for si in s],
 'add theta of a non-integer "prime" 2.5': [loc('2.5', si) for si in s],
 'move theta of the prime 3 to 3.1': [loc('3.1', si) - loc(3, si) for si in s],
 'Lambda(n) (1 - theta cos(log n))': [-wt(si) for si in s],
 'Lambda(n) (1 + theta cos(log n))': [wt(si) for si in s],
}
def psd(dz, th):
    c = [A[i] - Z[i] - arb(th) * dz[i] for i in range(n)]
    piv = lib.schur_real(nu, c, stop_at_negative=True)
    return all(p[1] > 0 for p in piv) and len(piv) == n
for name, dz in dirs.items():
    lo, hi = 0.0, 1.0
    if psd(dz, hi): th = '>= 1'
    else:
        for _ in range(50):
            mid = (lo + hi) / 2
            if psd(dz, mid): lo = mid
            else: hi = mid
        th = lo
    rec = dict(kind='direction', family=family, n=n, direction=name, theta_star=th)
    open('c2_extra.jsonl', 'a').write(json.dumps(rec) + '\n'); print(rec, flush=True)
