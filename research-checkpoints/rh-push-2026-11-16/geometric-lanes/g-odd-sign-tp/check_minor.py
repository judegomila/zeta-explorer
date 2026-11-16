"""Independent re-evaluation of the negative 5x5 minor of the zeta odd kernel (rows x=0.1..0.5, cols y=3.1..3.5)
with a different integral formula:  H_-(x,y) = int_0^inf kappa(w-x)[(2w-x-y)kappa(w-y) - (2w-x+y)kappa(w+y)] dw,
different panel width (0.1), order (120) and range (9)."""
import sys
from flint import arb, arb_mat, ctx
kern = sys.argv[1] if len(sys.argv) > 1 else 'zeta'
ctx.prec = 1200
rows = [arb(s) for s in sys.argv[2].split(',')]; cols = [arb(s) for s in sys.argv[3].split(',')]
PI = arb.pi()
def kappa(u):
    u = abs(u); e = u.exp(); pre = (arb('1.25')*u).exp(); s = arb(0)
    for k in range(1, 60):
        ex = PI*k*k*e
        s += PI*k*k*(2*PI*k*k*e-3)*pre*(-ex).exp()
        if float(ex.mid()) > 0.72*ctx.prec + 40: break
    return s
NP = 120; gl = [arb.legendre_p_root(NP, i, weight=True) for i in range(NP)]
wp = arb('0.1'); nodes = []; wts = []
for p in range(90):
    for (xq, wq) in gl:
        nodes.append(wp*p + wp*(xq+1)/2); wts.append(wq*wp/2)
def H(x, y):
    s = arb(0)
    for w, wt in zip(nodes, wts):
        s += wt*kappa(w-x)*((2*w-x-y)*kappa(w-y) - (2*w-x+y)*kappa(w+y))
    return s
M = arb_mat([[H(x, y) for y in cols] for x in rows])
print('entries row1:', [M[0, j].mid().str(12) for j in range(len(cols))])
d=M.det(); print('det =', d.mid().str(15), 'rad', d.rad().str(4))
for k in range(1, len(rows)):
    print('leading', k, arb_mat([[M[a, b] for b in range(k)] for a in range(k)]).det().str(10))
