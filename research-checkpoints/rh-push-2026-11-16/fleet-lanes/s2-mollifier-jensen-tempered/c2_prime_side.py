"""Combination 2, zeta, prime side. A_{mn} sqrt(mn) = S(x), x = log(n/m),
S(x) = sum_gamma h(gamma) e^{-i gamma x},  h(r) = exp(-(r - T)^2 / (2 Delta^2)),  by the explicit formula:
S(x) = h(i/2) e^{x/2} + h(-i/2) e^{-x/2} + (1/2pi) int h(r) e^{-irx} (Re psi(1/4 + ir/2) - log pi) dr - sum_k Lambda(k) k^{-1/2} (g(x + log k) + g(x - log k)),
g(u) = (Delta / sqrt(2 pi)) exp(-Delta^2 u^2 / 2) exp(-i T u).  The archimedean integral is expanded in moments of the Gaussian (Taylor of Re psi at T to order J).
Usage: c2_prime_side.py T Delta N [check]     check: compare with the zero side from the zero file (T <= 1.1e6)"""
import sys, os, math, json, time, numpy as np, mpmath as mp
import core
from core import LD, TWOPI_LD, primes_upto
T = float(sys.argv[1]); Dl = float(sys.argv[2]); N = int(sys.argv[3]); CHECK = len(sys.argv) > 4
HERE = os.path.dirname(os.path.abspath(__file__)); ZF = os.environ.get('S2_ZEROS', os.path.join(HERE, '../../../../scripts/.zeros-cache/zeros6'))
print('T %g Delta %g N %d extended %s' % (T, Dl, N, core.EXT)); print('planned allocation: N x N longdouble/complex work arrays x 6 = %.1f MB' % (N * N * 16 * 6 / 1e6), flush=True)
t0 = time.time()
ln = np.log(np.arange(1, N + 1, dtype=LD))
X = ln[None, :] - ln[:, None]                         # x = log(n/m), row m, column n
def g(u):
    """u longdouble array -> complex128; zero where the Gaussian is below 1e-40"""
    out = np.zeros(u.shape, dtype=np.complex128)
    m = np.abs(u) * Dl < 13.6
    um = u[m]
    ph = np.fmod(LD(T) * um, TWOPI_LD).astype(np.float64)
    uf = um.astype(np.float64)
    out[m] = (Dl / math.sqrt(2 * math.pi)) * np.exp(-Dl * Dl * uf * uf / 2) * (np.cos(ph) - 1j * np.sin(ph))
    return out
# archimedean term
mp.mp.dps = 30; J = 8
phi = [mp.re(mp.psi(0, mp.mpc(0.25, T / 2))) - mp.log(mp.pi)] + [mp.re((mp.mpc(0, 0.5)) ** j * mp.psi(j, mp.mpc(0.25, T / 2))) for j in range(1, J + 1)]
Xf = X.astype(np.float64); v = Dl * Xf
gau = (Dl / math.sqrt(2 * math.pi)) * np.exp(-v * v / 2)
phT = np.fmod(LD(T) * X, TWOPI_LD).astype(np.float64); eT = np.cos(phT) - 1j * np.sin(phT)
He0 = np.ones_like(v); He1 = v.copy(); S = np.zeros((N, N), dtype=np.complex128)
for j in range(J + 1):
    He = He0 if j == 0 else He1
    # (1/2pi) int h (r-T)^j e^{-irx} dr = e^{-iTx} (i d/dx)^j [gau] = e^{-iTx} (-i Delta)^j He_j(Delta x) gau
    S += float(phi[j]) / math.factorial(j) * ((-1j * Dl) ** j) * He * gau * eT
    if j >= 1: He0, He1 = He1, v * He1 - j * He0
# pole terms
hp = complex(mp.exp(-(mp.mpc(-T, 0.5)) ** 2 / (2 * Dl * Dl))); hm = complex(mp.exp(-(mp.mpc(-T, -0.5)) ** 2 / (2 * Dl * Dl)))
if abs(hp) > 1e-300: S += hp * np.exp(Xf / 2) + hm * np.exp(-Xf / 2)
# primes
K = int(N * math.exp(13.6 / Dl)) + 1
pr = primes_upto(K); nterm = 0
for p in pr:
    lp = math.log(p); pk = int(p)
    while pk <= K:
        lk = np.log(LD(pk))
        S -= lp / math.sqrt(pk) * (g(X + lk) + g(X - lk)); nterm += 1
        pk *= int(p)
print('prime powers used: %d (k <= %d)  %.0fs' % (nterm, K, time.time() - t0), flush=True)
rt = 1 / np.sqrt(np.arange(1, N + 1)); A = S * rt[None, :] * rt[:, None]
A = (A + A.conj().T) / 2
res = {'T': T, 'Delta': Dl, 'N': N}
if CHECK:
    zz = np.loadtxt(ZF); zz = zz[np.abs(zz - T) < 14 * Dl]
    Sz = np.zeros((N, N), dtype=np.complex128)
    for gm in zz: Sz += math.exp(-(gm - T) ** 2 / (2 * Dl * Dl)) * np.exp(-1j * gm * Xf)
    res['check_max_abs_diff'] = float(np.abs(Sz - S).max()); res['check_max_abs'] = float(np.abs(Sz).max()); res['zeros_in_14_Delta'] = int(len(zz))
    print('zero side vs prime side: max |difference| %.3e (max |S| %.3f), %d zeros' % (res['check_max_abs_diff'], res['check_max_abs'], len(zz)))
ev = np.linalg.eigvalsh(A)
dens = math.log(T / (2 * math.pi)) / (2 * math.pi)
res.update({'lam_min': float(ev[0]), 'lam_max': float(ev[-1]), 'ratio': float(ev[0] / ev[-1]), 'rank_1e-9': int((ev > 1e-9 * ev[-1]).sum()), 'rank_1e-12': int((ev > 1e-12 * ev[-1]).sum()),
            'zeros_per_unit': dens, 'zeros_within_Delta': 2 * Dl * dens, 'negative_below_-1e-10': int((ev < -1e-10 * ev[-1]).sum())})
print(json.dumps(res)); open(os.path.join(HERE, 'c2_prime_side.jsonl'), 'a').write(json.dumps(res) + '\n')
