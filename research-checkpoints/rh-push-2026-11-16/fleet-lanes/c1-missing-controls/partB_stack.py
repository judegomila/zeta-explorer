"""Part B, stack-feasibility: backward heat control run through constraints (i), (ii), (iii), (vi) of that lane.
   (iii)/(vi): P = [(L_i+L_j)/(x_i+x_j)], B = [-(L_i-L_j)/(x_i-x_j)] (diagonal -L'(x_i)), 12 real nodes, L = F_tau'/F_tau.
   (ii): with all n the explicit formula is L(z) = xi'/xi(1/2+z) on Re z > 1/2 (lane Prop. A); mismatch L_tau - L_0 reported.
   MEASURED (quadrature as multiprecision floats). Planned allocation < 50 MB."""
import json, time
import mpmath as mp
from heatlib import *
H = Heat(1200, 2.0)
mp.mp.dps = 300
def to_mp(a): return mp.mpf(a.mid().str(330, radius=False))
def Lreal(tau, x):
    g = H.weights(tau); xh = arb(x) / 2; s0 = arb(0); s1 = arb(0); s2 = arb(0)
    for gk, u in zip(g, H.u):
        sh, ch = (xh * u).sinh_cosh()
        s0 += gk * ch; s1 += gk * u * sh; s2 += gk * u * u * ch
    f, f1, f2 = to_mp(s0), to_mp(s1) / 2, to_mp(s2) / 4
    return f1 / f, f2 / f - (f1 / f) ** 2
def Ltrue(x):
    s = mp.mpf(1)/2 + x
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
def mats(Lv, dLv, xs):
    n = len(xs); P = mp.matrix(n, n); B = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            P[i, j] = (Lv[i]+Lv[j])/(xs[i]+xs[j])
            B[i, j] = -dLv[i] if i == j else -(Lv[i]-Lv[j])/(xs[i]-xs[j])
    return P, B
out = {}
for name, xs in (('nodes 0.6..6.1 step 0.5', ['0.6', '1.1', '1.6', '2.1', '2.6', '3.1', '3.6', '4.1', '4.6', '5.1', '5.6', '6.1']),
                 ('nodes 0.04..0.48 step 0.04', ['%.2f' % (0.04 * (i + 1)) for i in range(12)])):
    xm = [mp.mpf(x) for x in xs]; L0 = None
    for tau in ('0', '-0.1', '-0.5', '-2'):
        t0 = time.time()
        vals = [Lreal(tau, x) for x in xs]; Lv = [v[0] for v in vals]; dLv = [v[1] for v in vals]
        if tau == '0':
            L0 = Lv; chk = max(abs(Lv[i] - Ltrue(xm[i])) for i in range(12))
            print(name, 'validation tau=0: max |L_quad - xi\'/xi| =', mp.nstr(chk, 3), flush=True); out[name + '|validation'] = mp.nstr(chk, 3)
        P, B = mats(Lv, dLv, xm)
        rec = {}
        for k, S in (('P', P), ('P+B', P + B), ('P-B', P - B)):
            ev = mp.eigsy(S, eigvals_only=True); rec[k] = dict(min_eig=mp.nstr(min(ev), 5), max_eig=mp.nstr(max(ev), 5), negative=sum(1 for e in ev if e < 0))
        rec['L_tau_minus_L_0'] = [mp.nstr(Lv[i] - L0[i], 6) for i in range(12)]
        rec['L_tau'] = [mp.nstr(Lv[i], 12) for i in range(12)]
        if name.startswith('nodes 0.6'):
            rec['prime_part_-zeta\'/zeta(1/2+x)'] = [mp.nstr(-mp.zeta(mp.mpf(1)/2 + x, derivative=1) / mp.zeta(mp.mpf(1)/2 + x), 6) for x in xm]
        out[name + '|tau=' + tau] = rec
        print(name, 'tau', tau, {k: rec[k] for k in ('P', 'P+B', 'P-B')}, 'L_tau-L_0 at first/last node', rec['L_tau_minus_L_0'][0], rec['L_tau_minus_L_0'][-1], 's', round(time.time() - t0, 1), flush=True)
json.dump(out, open('partB_stack.json', 'w'), indent=1)
