"""Hardy functions of L(s,chi), L(s,chibar) (chi mod 5, chi(2) = i, odd) on a uniform grid over [0, TMAX], and the real zeros of
Z_chi, Z_chibar, Z_chi + Z_chibar, Z_chi - Z_chibar (one of the two combinations is the Davenport-Heilbronn function; decided
numerically from the coefficient (1 - i kappa)/2).
L(s,chi) = sum_a chi(a) H_a(s), H_a = sum_{m<M} (5m+a)^-s + 5^-s * Euler-Maclaurin tail at w = M + a/5 (K terms), M ~ 0.25 t.
Usage: gen_dir.py TMAX OUTPREFIX"""
import sys, math, os
NW = int(os.environ.get("RH_WORKERS", "4"))
os.environ["RH_BACKEND"] = "cpu"; os.environ["OMP_NUM_THREADS"] = "1"; os.environ["OPENBLAS_NUM_THREADS"] = "1"
import numpy as np
from multiprocessing import Pool
from scipy.special import loggamma, bernoulli
import zl
xp = zl.xp

CHI = {1: 1, 2: 1j, 3: -1j, 4: -1}
TAU = sum(CHI[a] * np.exp(2j * np.pi * a / 5) for a in CHI)
WROOT = TAU / (1j * math.sqrt(5))           # root number of the odd character
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
KEM = 40
B2 = bernoulli(2 * KEM + 2)

def em_tail(s, w):
    """sum_{m >= 0} (m + w)^-s by Euler-Maclaurin (w real > |s|/2.5)."""
    u = np.exp(-s * np.log(w))
    tot = u * w / (s - 1) + u / 2
    term = (B2[2] / 2.0) * s * u / w
    tot = tot + term
    for k in range(1, KEM):
        term = term * (B2[2 * k + 2] / B2[2 * k]) / ((2 * k + 1) * (2 * k + 2)) * (s + 2 * k - 1) * (s + 2 * k) / (w * w)
        tot = tot + term
    return tot

def L_values(t, budget=1.5e7):
    """complex L(1/2+it, chi) and L(1/2+it, chibar) for a float64 array t >= 0 (ascending)."""
    Lc = np.empty(len(t), dtype=np.complex128); Lb = np.empty(len(t), dtype=np.complex128)
    s0 = 0
    while s0 < len(t):
        # batch size from the term count at the batch end
        Mguess = int(0.25 * t[min(len(t) - 1, s0 + 1)]) + 40
        Bn = max(8, int(budget // Mguess)); s1 = min(len(t), s0 + Bn)
        M = int(0.25 * t[s1 - 1]) + 40
        while Bn * M > 1.3 * budget and Bn > 8:
            Bn = max(8, Bn // 2); s1 = min(len(t), s0 + Bn); M = int(0.25 * t[s1 - 1]) + 40
        tb = t[s0:s1]; tg = xp.asarray(tb); s = 0.5 + 1j * tb
        H = {}
        for a in (1, 2, 3, 4):
            n = 5.0 * xp.arange(M, dtype=xp.float64) + a
            ph = xp.outer(tg, xp.log(n)); wgt = 1.0 / xp.sqrt(n)
            re = xp.cos(ph) @ wgt; xp.sin(ph, out=ph); im = ph @ wgt; del ph
            H[a] = zl.asnp(re) - 1j * zl.asnp(im) + np.exp(-s * math.log(5.0)) * em_tail(s, M + a / 5.0)
        Lc[s0:s1] = sum(CHI[a] * H[a] for a in H); Lb[s0:s1] = sum(np.conj(CHI[a]) * H[a] for a in H)
        s0 = s1
    return Lc, Lb

def vartheta(t):
    """phase of the completed function without the root number: (t/2) log(5/pi) + Im log Gamma(3/4 + i t/2)."""
    t = np.asarray(t, dtype=np.float64)
    return 0.5 * t * math.log(5 / math.pi) + loggamma(0.75 + 0.5j * t).imag

def hardy(t):
    Lc, Lb = L_values(t)
    u = np.conj(np.sqrt(WROOT)); e = np.exp(1j * vartheta(t))
    zc = e * u * Lc; zb = e * np.conj(u) * Lb
    return zc, zb

def main():
    TCAP = 5e5   # cost grows like TMAX^2
    Tmax = min(float(sys.argv[1]), TCAP); pre = sys.argv[2]
    Lmax = math.log(5 * Tmax / (2 * math.pi)); h = 2 * math.pi / Lmax / 4
    t = h * np.arange(int(Tmax / h) + 1)
    zl.log('samples %d step %.5f ; largest term count %d ; planned GPU matrix %.2f GB' % (len(t), h, int(0.4 * Tmax) + 40, 2.0e8 * 8 / 1e9))
    ch = np.array_split(t, max(NW, len(t) // 3000))
    with Pool(NW) as p: resl = p.map(hardy, ch[::-1], chunksize=1)[::-1]
    zc = np.concatenate([r[0] for r in resl]); zb = np.concatenate([r[1] for r in resl])
    zl.log('max |Im Z_chi| %.3e  max |Im Z_chibar| %.3e  (should vanish)  rms Z %.3f' % (np.abs(zc.imag).max(), np.abs(zb.imag).max(), zc.real.std()))
    Z1 = zc.real; Z2 = zb.real
    c = (1 - 1j * KAPPA) / 2 * np.sqrt(WROOT)
    zl.log('DH coefficient c = a*sqrt(W) = %.6f %+.6fi (real: DH = Z_chi + Z_chibar; imaginary: DH = Z_chi - Z_chibar)' % (c.real, c.imag))
    dh_plus = abs(c.imag) < abs(c.real)
    np.savez(pre + '_samples.npz', h=h, Z1=Z1, Z2=Z2, dh_plus=dh_plus)
    find_all(pre, h, Z1, Z2, dh_plus)

def find_all(pre, h, Z1, Z2, dh_plus):
    W = zl.R.W
    for name, S in [('chi', Z1), ('chibar', Z2), ('dh' if dh_plus else 'alt', Z1 + Z2), ('alt' if dh_plus else 'dh', Z1 - Z2)]:
        rc, nh, bad = zl.roots_of_samples(S)
        g = rc * h
        sg = {'chi': (1, 0), 'chibar': (0, 1), 'dh': (1, 1) if dh_plus else (1, -1), 'alt': (1, -1) if dh_plus else (1, 1)}[name]
        def func(t, sg=sg):
            zc, zb = hardy(t); return sg[0] * zc.real + sg[1] * zb.real
        sp = 2 * math.pi / math.log(5 * max(g[-1], 10) / (2 * math.pi))
        g, nref, nfail = zl.refine_close(g, func, sp)
        lo = (W + 1) * h; hi = (len(S) - W - 1) * h
        ex = float((vartheta(hi) - vartheta(lo)) / math.pi)
        zl.log('%-7s real zeros %d in [%.2f, %.2f]; count of all zeros from the phase %.1f ; deficit %.1f ; hidden %d orderviol %d ; %s ; refined %d (no bracket %d) ; monotone %s' % (
            name, len(g), lo, hi, ex, ex - len(g), nh, bad, zl.roots_of_samples.last, nref, nfail, bool((np.diff(g) > 0).all())))
        np.save('%s_%s.npy' % (pre, name), g)

if __name__ == '__main__':
    if sys.argv[1] == 'reroot':
        s = np.load(sys.argv[2] + '_samples.npz'); find_all(sys.argv[2], float(s['h']), s['Z1'], s['Z2'], bool(s['dh_plus']))
    else: main()
