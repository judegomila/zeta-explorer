# Certified version of pick-induction table 2.4: zeta with Lambda(n0) -> Lambda(n0)+eps, i.e. L_eta = L - eps n0^{-1/2-z}.
# r-chain (Richards parameters) at the confluent node a; first negative r_k gives the first indefinite Pick order k+1.
import sys; sys.path.insert(0,'.')
from gates_arb import *
def chain(aq, K, n0, eps, base='zeta'):
    a = qa(aq); n = K + 4
    F = F_series(base, aq, n); Fp = sder(F) + [arb(0)]
    zser = [a, arb(1)] + [arb(0)] * (n + 1)
    Fpz = sdiv(Fp[:n + 2], zser[:n + 2], n + 2)
    Su = Fpz; Sv = F[:n + 2]
    if n0:
        old = ctx.cap; ctx.cap = n + 2
        x = arb_series([0, 1]); e = (-(a + x) * arb(n0).log()).exp() * arb(eps) / arb(n0).sqrt()
        ctx.cap = old
        E = sdiv(smul([e[k] for k in range(n + 2)], Sv, n + 2), zser[:n + 2], n + 2)
        Su = [Su[i] - E[i] for i in range(n + 2)]
    L = n + 2; rs = []
    for k in range(K):
        r = a * Su[k] / Sv[k]; rs.append(r)
        Sb = [arb(0)] * (k + 1) + [r * Sv[i] - a * Su[i] for i in range(k + 1, L)]
        Sn = [arb(0)] * (k + 1) + [2 * a * Su[i - 1] + (Su[i - 2] if i >= 2 else 0) - a * Sb[i] for i in range(k + 1, L)]
        Su, Sv = Sb, Sn
    return rs
ctx.prec = 1500
for n0 in (2, 3, 101):
    row = []
    for eps in ("1e-3", "1e-6", "-1e-2", "-1e-4"):
        rs = chain(Q("1"), 40, n0, eps); sg = "".join(sgn(r) for r in rs)
        k = sg.find('-'); row.append("%s: order %s%s" % (eps, k + 1 if k >= 0 else ">40", "" if '?' not in sg[:k + 1] else " (undecided before)"))
    print("n0=%d  " % n0 + " | ".join(row))
