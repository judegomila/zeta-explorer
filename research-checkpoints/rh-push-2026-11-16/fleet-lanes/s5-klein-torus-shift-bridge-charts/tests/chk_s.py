import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flint import acb, arb, ctx
import pick, objs, mpmath as mp
ctx.prec = 300; mp.mp.dps = 60
o = objs.get('ZETA'); a = arb('0.1')
nd = pick.nodes(0.01, 2, -21, 21, 200)
def xi(s): return s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
for i in (0, 5, 138, 177):
    x, y = nd[i]; w = acb(arb(x), arb(y))
    S = objs.X(o, w - a) / objs.X(o, w + a)
    wm = mp.mpc(x, y); Sm = xi(mp.mpf(1)/2 + wm - mp.mpf('0.1')) / xi(mp.mpf(1)/2 + wm + mp.mpf('0.1'))
    print(i + 1, nd[i], S.str(30, radius=False), mp.nstr(Sm, 30), float(abs(S).mid()))
