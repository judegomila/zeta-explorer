"""check of the identity used in c4_count.tnr_samples:  with Xi^TNR(w) = Xi(w)(c + 2 cos(lam w)), lam = log q, and e^{-(t/4) d_w^2} the de Bruijn flow,
   Xi^TNR_t(w) = c Xi_t(w) + e^{t lam^2/4} [ e^{i lam w} Xi_t(w - i lam t/2) + e^{-i lam w} Xi_t(w + i lam t/2) ].
Left side: heat series of the T-NR Taylor table.  Right side: heat series of the zeta table at shifted arguments.  Usage: val_tnr_heat.py TABLE.pkl q"""
import sys, math
from flint import arb, acb, ctx
import jl, c1_arbland as A
fn, q = sys.argv[1], sys.argv[2]
def ev(c, w):
    X = -w * w; s = acb(0)
    for v in reversed(c): s = s * X + v
    return s
K = 500
for t in ('-0.05', '0.05'):
    A.init(fn, 'TNR:%s:2.2' % q); ctx.prec = 600; cT = A.coeffs_t(arb(t), K, 600)
    A.init(fn, 'ZETA'); ctx.prec = 600; cZ = A.coeffs_t(arb(t), K, 600)
    lam = arb(q).log(); E = (arb(t) * lam * lam / 4).exp(); d = lam * arb(t) / 2
    for w in ('3.7', '15.2'):
        w_ = acb(arb(w)); I = acb(0, 1)
        lhs = ev(cT, w_); rhs = arb('2.2') * ev(cZ, w_) + E * ((I * lam * w_).exp() * ev(cZ, w_ - I * d) + (-I * lam * w_).exp() * ev(cZ, w_ + I * d))
        print('q=%s t=%s w=%s  lhs %s  rhs %s  |diff| %s' % (q, t, w, lhs.real.str(18), rhs.real.str(18), abs(lhs - rhs).str(3)))
