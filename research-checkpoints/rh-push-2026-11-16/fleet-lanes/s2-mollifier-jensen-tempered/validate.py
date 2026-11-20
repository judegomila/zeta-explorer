"""Validation of the evaluator against mpmath. Usage: validate.py T [M]"""
import sys, math, numpy as np, mpmath as mp
import core
from core import *
T = float(sys.argv[1]); M = int(sys.argv[2]) if len(sys.argv) > 2 else 4096
h = 0.1
print('T %g M %d gpu %s longdouble-extended %s' % (T, M, core.GPU, core.EXT))
Smax = int(math.sqrt(5 * (T + h * M) / (2 * math.pi)) * math.exp(7.5 / 4)) + 10
w = Win(T, h, M, Smax)
ones = xp.ones(Smax, dtype=xp.complex128)
n = np.arange(1, Smax + 1)
chi = xp.asarray(CHI5[n % 5]); chib = xp.conj(chi)
mp.mp.dps = 30
idx = [0, 1, M // 4, M // 2, M // 2 + 1, 3 * M // 4, M - 1]
# nufft against the direct sum
c = xp.asarray(np.exp(-0.5 * np.log(n[:300])) * (1 + 0.3j)) * w.e[:300]
f = asnp(nufft_sym(w.ln[:300], c, h, M))
tt = asnp(w.tau)
dd = np.array([np.sum(asnp(c) * np.exp(-1j * tt[i] * np.log(n[:300]))) for i in idx])
print('nufft vs direct: max abs err %.2e' % np.abs(f[idx] - dd).max())
for sigma in (0.5, 0.41, 0.75, 0.2):
    for a in (4.0, 6.0):
        F, Fp = F_and_deriv(w, sigma, 1, 0, ones, a=a)
        F = asnp(F); Fp = asnp(Fp)
        e1 = e2 = 0; ref = 0
        for i in idx:
            s = mp.mpc(sigma, mp.mpf(T) + mp.mpf(float(tt[i])))
            z = complex(mp.zeta(s)); zd = complex(mp.zeta(s, derivative=1))
            e1 = max(e1, abs(F[i] - z)); e2 = max(e2, abs(Fp[i] - zd)); ref = max(ref, abs(zd))
        print('zeta sigma %.2f a %.0f: max err F %.2e, F\' %.2e (|F\'| up to %.1f)' % (sigma, a, e1, e2, ref))
if T <= 3e4:
    for sigma in (0.5, 0.41):
        Fc, Fcp = F_and_deriv(w, sigma, 5, 1, chi, epsroot=EPS5); Fb, Fbp = F_and_deriv(w, sigma, 5, 1, chib, epsroot=np.conj(EPS5))
        Fc = asnp(Fc); Fcp = asnp(Fcp); Fb = asnp(Fb); Fbp = asnp(Fbp)
        e1 = e2 = e3 = e4 = 0
        for i in idx[::2]:
            s = mp.mpc(sigma, mp.mpf(T) + mp.mpf(float(tt[i])))
            e1 = max(e1, abs(Fc[i] - complex(mp.dirichlet(s, [0, 1, 1j, -1j, -1]))))
            e2 = max(e2, abs(Fcp[i] - complex(mp.dirichlet(s, [0, 1, 1j, -1j, -1], 1))))
            e3 = max(e3, abs(Fb[i] - complex(mp.dirichlet(s, [0, 1, -1j, 1j, -1]))))
            e4 = max(e4, abs(Fbp[i] - complex(mp.dirichlet(s, [0, 1, -1j, 1j, -1], 1))))
        print('L(chi) sigma %.2f: err %.2e, deriv %.2e; L(chibar): %.2e, %.2e' % (sigma, e1, e2, e3, e4))
else:
    # consistency: two cut parameters
    for sigma in (0.5, 0.41):
        r = []
        for a in (4.0, 6.0):
            Fc, Fcp = F_and_deriv(w, sigma, 5, 1, chi, epsroot=EPS5, a=a); r.append((asnp(Fc), asnp(Fcp)))
        print('L(chi) sigma %.2f: a=4 vs a=6 max diff F %.2e F\' %.2e' % (sigma, np.abs(r[0][0] - r[1][0]).max(), np.abs(r[0][1] - r[1][1]).max()))
