"""Real-node Pick matrices of the controls at the same node sets (Arb).
DH: Lambda_DH(s) = (5/pi)^{s/2} Gamma((s+1)/2) f(s), f = ((1-i kap)/2) L(s,chi) + c.c., chi mod 5, chi(2) = i.
    L_DH(x) = d/dx log Lambda_DH(1/2+x).  Expect: positive definite for K <= 24 (r2-pick-euler-entry: first indefinite order 149).
E_a: xi(1/2+x+a) xi(1/2+x-a), a = 1/5: L_E(x) = L(x+a) + L(x-a).  All zeros off the line at delta = a.
Reports the first non-positive Cholesky pivot (order at which the leading Pick minor stops being positive definite)."""
import sys, json
from flint import arb, acb, acb_series, ctx
import pickdec as pd
ctx.prec = 3000
s5 = arb(5).sqrt(); kap = ((10 - 2*s5).sqrt() - 2)/(s5 - 1)
def L_dh(x):
    s = acb(x + arb(1)/2)
    hz = [acb_series([s, 1], prec=2).zeta(acb(arb(a)/5)) for a in (1, 2, 3, 4)]
    cf = [arb(1), kap, -kap, arb(-1)]                       # coefficients c_n mod 5 = (1, kap, -kap, -1, 0)
    f0 = sum((c*h[0] for c, h in zip(cf, hz)), acb(0)); f1 = sum((c*h[1] for c, h in zip(cf, hz)), acb(0))
    # f(s) = 5^{-s} sum c_a zeta(s, a/5):  f'/f = -log 5 + f1/f0
    return ((arb(5)/arb.pi()).log()/2 + ((s.real + 1)/2).digamma()/2 - arb(5).log() + (f1/f0).real)
def L_ea(x, a=arb(1)/5): return pd.Ltrue(x + a) + pd.Ltrue(x - a)
out = []
for fn, Lf in (('DH', L_dh), ('E_a(0.2)', L_ea)):
    for K in (6, 12, 24):
        for nd in ('lin', 'small', 'geo', 'conf1'):
            if fn.startswith('E') and nd == 'small': xs = [arb(i+1)*arb(48)/(100*K) + arb(1)/1000 for i in range(K)]
            else: xs = pd.nodes(nd, K, 100)
            try:
                S = pd.pick([Lf(x) for x in xs], xs); C, piv = pd.chol(S)
                r = dict(func=fn, K=K, nodes=nd, pd=C is not None, first_bad_pivot_order=(None if C is not None else piv+1), pivot_certified_negative=(None if C is not None else bool(pd.chol.last < 0)))
            except Exception as e: r = dict(func=fn, K=K, nodes=nd, error=repr(e))
            print(json.dumps(r), flush=True); out.append(r)
json.dump(out, open('ctrl_pick.json', 'w'), indent=1)
