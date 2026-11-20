import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from flint import acb, arb, ctx, acb_mat
import pick, objs
bits = 4000; ctx.prec = bits; n = 150
nd = pick.nodes(0.01, 2, -21, 21, n)
W = [acb(arb(x), arb(y)) for x, y in nd]
a = arb(1) / 10
def test(name, f):
    S = [f(w - a) / f(w + a) for w in W]; Sc = [s.conjugate() for s in S]
    full = [[(1 - S[i] * Sc[j]) / (W[i] + W[j].conjugate()) for j in range(n)] for i in range(n)]
    A = [row[:i + 1] for i, row in enumerate(full)]
    piv = pick.ldl(A, n)
    neg = [k + 1 for k, p in enumerate(piv) if p < 0]
    print(name, 'LDL negative pivots', neg[:6], 'max|S|', float(max(abs(s) for s in S).mid()))
    for m in (138, 139, 140):
        d = acb_mat([row[:m] for row in full[:m]]).det()
        print('   det_%d sign' % m, '+' if d.real > 0 else ('-' if d.real < 0 else '?'), d.real.str(8))
o = objs.get('ZETA')
test('cosh', lambda w: w.cosh())
test('zeta', lambda w: objs.X(o, w))
