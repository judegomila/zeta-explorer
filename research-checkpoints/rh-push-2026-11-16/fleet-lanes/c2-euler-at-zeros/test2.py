"""Pivot check: S-periodised explicit formula.  For w supported on an interval of length Tw < log N_S (N_S = prod_{p in S} p):
  sum_rho zeta_S(1/2+rho) conj(zeta_S(1/2+J rho)) W(rho) conj W(J rho)
     = (1/2pi) int Omega(tau) |zeta_S(1/2+i tau)|^2 |W(i tau)|^2 d tau
       + 2 Re sum_{p in S} sum_{k != 0} (1/log p) zeta_S(1+it) zeta_{S-p}(-it) (zeta'/zeta)(1+it) W(1/2+it) conj W(-1/2+it),  t = 2 pi k/log p
       + (terms at k = 0, of size |W(1/2) W(-1/2)|, printed).
For Tw >= log N_S the prime terms with N_S m m' n <= e^Tw are missing and the identity must fail (negative control).
w(t) = e^{iTt} sin^6(pi t/Tw) on [0,Tw].  MEASURED, float64 + mpmath for zeta'/zeta on Re s = 1."""
import numpy as np, math, json, sys, mpmath as mp
from lib import *
mp.mp.dps = 20
g = zeta_zeros()
def Wfun(z, T, Tw, m=3):
    u = np.asarray(z, dtype=np.complex128) - 1j * T
    out = np.zeros(u.shape, np.complex128)
    for j in range(-m, m + 1):
        c = math.comb(2 * m, m - abs(j)) * (-1) ** j / 4.0 ** m
        a = u - 2j * math.pi * j / Tw
        a = np.where(np.abs(a) < 1e-12, 1e-12, a)
        out += c * (-np.expm1(-a * Tw)) / a
    return out
def run(S, Tw, T):
    S = np.array(S); om = 2 * math.pi * 3 / Tw; X = 25 * om
    assert T - X > 20 and T + X < g[-1], (T, X)
    h = min(0.002, 0.05 / Tw); tau = np.arange(T - X, T + X, h)
    print('S', S.tolist(), 'Tw', Tw, 'log N_S', float(np.sum(np.log(S))), 'T', T, 'X', round(X, 1), 'grid', tau.size, '(%.0f MB)' % (tau.size * 16 * 4 / 1e6), flush=True)
    z = zS(0.5 + 1j * tau, S); Wt = Wfun(1j * tau, T, Tw)
    f = np.abs(z) ** 2 * np.abs(Wt) ** 2
    den = h * np.sum(f) / (2 * math.pi); arch = h * np.sum(f * Omega(tau)) / (2 * math.pi)
    gg = g[(g > T - X) & (g < T + X)]
    zero = float(np.sum(np.abs(zS(0.5 + 1j * gg, S)) ** 2 * np.abs(Wfun(1j * gg, T, Tw)) ** 2))
    res = 0.0; absres = 0.0; npts = 0
    for p in S:
        lp = math.log(p); ks = np.arange(int((T - X) * lp / (2 * math.pi)) + 1, int((T + X) * lp / (2 * math.pi)) + 1)
        t = 2 * math.pi * ks / lp
        ww = Wfun(0.5 + 1j * t, T, Tw) * np.conj(Wfun(-0.5 + 1j * t, T, Tw))
        keep = np.abs(ww) > 1e-18 * np.max(np.abs(ww))
        t = t[keep]; ww = ww[keep]; npts += len(t)
        ld = np.array([complex(mp.zeta(mp.mpc(1, x), derivative=1) / mp.zeta(mp.mpc(1, x))) for x in t])
        rest = S[S != p]
        zr = zS(-1j * t, rest) if len(rest) else np.ones(len(t), complex)
        term = zS(1 + 1j * t, S) * zr * ld * ww / lp
        res += 2 * float(np.sum(term.real)); absres += 2 * float(np.sum(np.abs(term)))
    k0 = abs(Wfun(np.array([0.5 + 0j]), T, Tw)[0] * Wfun(np.array([-0.5 + 0j]), T, Tw)[0])
    r = dict(S=S.tolist(), Tw=Tw, logN=float(np.sum(np.log(S))), T=T, den=den, zero_side=zero, arch=arch, residues=res, abs_residues=absres,
             diff=zero - arch - res, rel=(zero - arch - res) / zero, R=zero / den, Obar=arch / den, E=(zero - arch) / den, k0_size=k0, npts=npts)
    print('   zero side %.12g  arch %.12g  residue sum %.12g  diff %.3e (rel %.2e)  R %.4f Obar %.4f E %.4f  sum|res|/den %.3f  k0 size %.1e' % (zero, arch, res, r['diff'], r['rel'], r['R'], r['Obar'], r['E'], absres / den, k0), flush=True)
    return r
if __name__ == "__main__":
    out = []
    for S, Tw, T in [([2], 0.65, 3000.0), ([2], 0.65, 9000.0), ([3], 1.05, 3000.0), ([2, 3], 1.7, 3000.0), ([2, 3], 1.7, 3003.1), ([2, 3, 5], 3.3, 3000.0), ([2, 3, 5, 7], 5.2, 3000.0), ([2, 3, 5, 7], 5.2, 12000.0),
                     ([2], 1.2, 3000.0), ([2, 3], 2.6, 3000.0)]:
        out.append(run(S, Tw, T))
    json.dump(out, open('test2.json', 'w'), indent=1)
