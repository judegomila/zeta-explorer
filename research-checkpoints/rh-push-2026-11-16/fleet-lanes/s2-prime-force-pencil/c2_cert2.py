"""Robust higher-precision certificates of infeasibility for zeta (see c2_cert.py). For each N: the float64 onset K0 is located by c2_margin.py;
here the system is cut at K = f*K0 for f = 1, 1.05, 1.2, 1.5, 2, 3 and the first cut whose certificate passes the ball-arithmetic check
(with every support extremum recomputed by mpmath) is reported. Statement certified: for the listed points, 0 is interior to the simplex of the
signed mode vectors, so rho(N, T) = 0 for T >= T_cert.
Usage: c2_cert2.py MODE OUT.json N:K0 [N:K0 ...]"""
import sys, json, math, numpy as np
import mpmath as mp
from flint import arb, acb, arb_mat, ctx
import lib, c2_margin
from lib import log

def check(xs, ss, N, mode):
    mp.mp.dps = 25; ctx.prec = 256; d = N * (2 if mode == 'cossin' else 1)
    rows = []; dxm = 0.0; sflip = 0
    for x0, s0 in zip(xs, ss):
        x = mp.findroot(lambda t: mp.siegelz(t, derivative=1), (mp.mpf(x0), mp.mpf(x0) + mp.mpf('1e-4')), solver='secant')
        s = int(mp.sign(mp.siegelz(x, derivative=2)))
        dxm = max(dxm, abs(float(x - x0))); sflip += (s != int(s0))
        xb = arb(mp.nstr(x, 25)) + arb(0, 1e-22)
        th = acb(arb(1) / 4, xb / 2).lgamma().imag - xb / 2 * arb.pi().log()
        r = [s * (th - xb * arb(n).log()).cos() / arb(n).sqrt() for n in range(1, N + 1)]
        if mode == 'cossin': r += [s * (th - xb * arb(n).log()).sin() / arb(n).sqrt() for n in range(1, N + 1)]
        rows.append(r)
    A = arb_mat(d + 1, d + 1, [rows[k][i] for i in range(d) for k in range(d + 1)] + [arb(1)] * (d + 1))
    b = arb_mat(d + 1, 1, [arb(0)] * d + [arb(1)])
    lam = A.solve(b)
    lo = [float(lam[i, 0].mid()) - float(lam[i, 0].rad()) for i in range(d + 1)]
    return min(lo), dxm, int(sflip)

if __name__ == '__main__':
    mode = sys.argv[1]; out = sys.argv[2]; res = []
    for a in sys.argv[3:]:
        N, K0 = [int(v) for v in a.split(':')]
        S, g, cond = c2_margin.build('zeta', N, mode)
        d = S.dim; done = False
        for f in (1.0, 1.05, 1.2, 1.5, 2.0, 3.0):
            K = min(S.K, int(K0 * f)); r = lib.margin(S, K)
            if r['status'] != 'infeasible': log('N=%d f=%.2f: float64 status %s (rho %.3e)' % (N, f, r['status'], r['rho_upper'])); continue
            m = r['lam'] > 0; idx = r['work'][m]
            if len(idx) != d + 1: log('N=%d f=%.2f: support %d != %d' % (N, f, len(idx), d + 1)); continue
            lo, dxm, sf = check(S.x[idx], S.s[idx], N, mode)
            log('N=%d %s cut K=%d (f=%.2f, T=%.1f): min barycentric coordinate (lower bound) %.3e ; max shift of x* %.2e ; sign flips %d ; %s' % (N, mode, K, f, S.x[K - 1], lo, dxm, sf, 'CERTIFIED' if lo > 0 else 'not certified'))
            if lo > 0:
                res.append(dict(N=N, mode=mode, K0_float=K0, T0_float=float(S.x[K0 - 1]), K_cert=K, T_cert=float(S.x[K - 1]), min_lambda=lo, max_shift=dxm, support_x=[float(v) for v in S.x[idx]])); done = True; break
        if not done: res.append(dict(N=N, mode=mode, K0_float=K0, T0_float=float(S.x[K0 - 1]), K_cert=None))
        json.dump(res, open(out, 'w'))
