"""Certificate with refinement before the support is chosen (zeta, real weights).
Cut the system at K = f*K0. Take the whole final working set of the float64 solve, recompute every extremum by mpmath (25 digits; sign of Z''
from mpmath), rebuild the rows from the refined points, solve the min-norm problem again on these rows (nnls), and check the resulting
support in ball arithmetic (python-flint, 256 bits) as in c2_cert2.py.
Usage: c2_cert3.py OUT.json N:K0 [f ...]"""
import sys, json, math, numpy as np
import mpmath as mp
from flint import arb, acb, arb_mat, ctx
import lib, c2_margin
from lib import log

def refine(x0):
    mp.mp.dps = 25
    x = mp.findroot(lambda t: mp.siegelz(t, derivative=1), (mp.mpf(float(x0)), mp.mpf(float(x0)) + mp.mpf('1e-4')), solver='secant')
    return x, int(mp.sign(mp.siegelz(x, derivative=2)))

def arb_check(xm, sm, N):
    ctx.prec = 256; d = N; rows = []
    for x, s in zip(xm, sm):
        xb = arb(mp.nstr(x, 25)) + arb(0, 1e-22)
        th = acb(arb(1) / 4, xb / 2).lgamma().imag - xb / 2 * arb.pi().log()
        rows.append([s * (th - xb * arb(n).log()).cos() / arb(n).sqrt() for n in range(1, N + 1)])
    A = arb_mat(d + 1, d + 1, [rows[k][i] for i in range(d) for k in range(d + 1)] + [arb(1)] * (d + 1))
    lam = A.solve(arb_mat(d + 1, 1, [arb(0)] * d + [arb(1)]))
    return min(float(lam[i, 0].mid()) - float(lam[i, 0].rad()) for i in range(d + 1))

if __name__ == '__main__':
    out = sys.argv[1]; N, K0 = [int(v) for v in sys.argv[2].split(':')]; fs = [float(v) for v in sys.argv[3:]] or [1.05, 1.2, 1.5]
    S, g, cond = c2_margin.build('zeta', N, 'cos'); res = []
    n = np.arange(1, N + 1.0); f_ = np.log(n); a_ = 1 / np.sqrt(n)
    for f in fs:
        K = min(S.K, int(K0 * f)); r = lib.margin(S, K)
        if r['status'] != 'infeasible': log('N=%d f=%.2f: float64 status %s' % (N, f, r['status'])); continue
        W = r['work']; ref = [refine(S.x[i]) for i in W]
        xm = [q[0] for q in ref]; sm = [q[1] for q in ref]; xf = np.array([float(v) for v in xm])
        dx = float(np.abs(xf - S.x[W]).max()); flips = int(sum(int(a) != int(b) for a, b in zip(sm, S.s[W])))
        S2 = lib.System(xf, np.array(sm, dtype=float), lib.theta_zeta(xf), f_, a_)
        p, lam = lib.minnorm(S2.rows(np.arange(len(xf)))); nr = float(np.linalg.norm(p)); sup = np.nonzero(lam > 0)[0]
        log('N=%d cut K=%d (f=%.2f, T=%.1f): working set %d refined (max shift %.2e, sign flips %d); refined min-norm %.3e, support %d' % (N, K, f, S.x[K - 1], len(W), dx, flips, nr, len(sup)))
        if nr > 1e-9 or len(sup) != N + 1: continue
        lo = arb_check([xm[i] for i in sup], [sm[i] for i in sup], N)
        log('   ball check: min barycentric coordinate (lower bound) %.3e : %s' % (lo, 'CERTIFIED' if lo > 0 else 'not certified'))
        if lo > 0:
            res.append(dict(N=N, K0_float=K0, T0_float=float(S.x[K0 - 1]), K_cert=K, T_cert=float(S.x[K - 1]), min_lambda=lo, support_x=[mp.nstr(xm[i], 20) for i in sup], support_sign=[sm[i] for i in sup]))
            json.dump(res, open(out, 'w')); break
    json.dump(res, open(out, 'w'))
