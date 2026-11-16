# Extremal (worst-coupled) vector of the split (first n nodes | node n+1): v = delta_y - sum c_j delta_{x_j}, c = P_X^{-1} k_y.
# Spectral side: Q(v) = sum_w V(-w) conj V(conj w), V(z) = 1/(z+y) - sum c_j/(z+x_j); on-line zeros: |V(i g)|^2.
import sys, json
from flint import arb, acb, arb_mat, acb_poly, ctx
from lib import *
func, family, prec = sys.argv[1], sys.argv[2], int(sys.argv[3])
ns = [int(a) for a in sys.argv[4].split(',')]
twin = len(sys.argv) > 5
ctx.prec = prec
Nmax = max(ns)+1
xs = nodes(family, Nmax)
Lf = L_xi if func == 'xi' else L_dh
Ls = [Lf(x) for x in xs]
KZ = 400
if func == 'xi': g = [z.imag for z in acb.zeta_zeros(1, KZ)]
else: g = [arb(z) for z in json.load(open('dh_zeros.json'))['online']]
out = []
for n in ns:
    X = xs[:n]; y = xs[n]
    P = arb_mat(n, n, [(Ls[i]+Ls[j])/(xs[i]+xs[j]) for i in range(n) for j in range(n)])
    k = arb_mat(n, 1, [(Ls[i]+Ls[n])/(xs[i]+y) for i in range(n)])
    c = P.solve(k)
    cs = [c[i, 0] for i in range(n)]
    Kyy = Ls[n]/y
    Delta = Kyy - sum((cs[i]*k[i, 0] for i in range(n)), arb(0))
    def V(z):
        return 1/(z+y) - sum((cs[i]/(z+xs[i]) for i in range(n)), acb(0))
    def Vp(z):
        return -1/(z+y)**2 + sum((cs[i]/(z+xs[i])**2 for i in range(n)), acb(0))
    e = []
    for kk in range(len(g)):
        v = V(acb(0, g[kk]))
        e.append(2*(v.real**2+v.imag**2)/Delta)
    cum = arb(0); prof = []
    for kk in range(len(g)):
        cum += e[kk]
        prof.append((kk+1, float(e[kk].mid()), float(cum.mid())))
    row = dict(n=n, y=float(y.mid()), one_minus_rho2=(Delta/Kyy).str(8), sum_first_zeros=float(cum.mid()),
               top=sorted(prof, key=lambda t: -t[1])[:6],
               mass_below_or_at_index_n_over_2=float(sum((e[i] for i in range(n//2)), arb(0)).mid()),
               log10_e_killed=[round(log10mid(e[i]), 1) for i in range(min(n//2, 12))])
    # numerator polynomial q and its roots (only for small n)
    if n <= 24 and not twin:
        full = acb_poly([y, 1])
        for x in X: full *= acb_poly([x, 1])
        p = acb_poly([1])
        for x in X: p *= acb_poly([x, 1])
        for i in range(n):
            t = acb_poly([y, 1])*cs[i]
            for j in range(n):
                if j != i: t *= acb_poly([xs[j], 1])
            p -= t
        roots = p.roots()
        rr = sorted(roots, key=lambda r: abs(float(r.imag.mid())))
        row['q_roots'] = [(r.real.str(12, radius=False), r.imag.str(18, radius=False)) for r in rr if r.imag > -1e-30]
        row['zeros'] = [gg.str(18, radius=False) for gg in g[:n//2+1]]
    if twin:
        # exact effect of moving zero pair k off the line by delta, on the SAME trial vector (upper bound for twin Schur complement)
        res = {}
        for kk in (1, 2, 3, 5, 8, 12, 20):
            for dl in (arb(3)/10,):
                gk = g[kk-1]
                on = 2*(lambda v: v.real**2+v.imag**2)(V(acb(0, gk)))
                off = arb(0)
                for w in (acb(dl, gk), acb(-dl, gk), acb(dl, -gk), acb(-dl, -gk)):
                    off += (V(-w)*(V(w.conjugate()).conjugate())).real
                tw = Delta - on + off
                res[kk] = float((tw/Delta).mid())
        row['twin_ratio'] = res
    out.append(row); print(json.dumps(row), flush=True)
json.dump(out, open(f'ext_{func}_{family}{"_twin" if twin else ""}.json', 'w'))
