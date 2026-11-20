"""Sample Z_chi, Z_chibar (chi mod 5, chi(2)=i) on a uniform grid of t by a direct Dirichlet sum to M ~ 1.25 t
plus an Euler-Maclaurin Hurwitz tail. float64. DH: Z_DH = Z_chi + Z_chibar (checked against the battery table).
Usage: lsample.py T1 T2 OUT.npz [poolGB]
Output: t0, h, Z1, Z2, imres (max |Im| of the rotated values = check of the phase), meta.
"""
import sys, math, time, numpy as np
from scipy.special import loggamma, bernoulli
try:
    import cupy as cp
    GPU = True
except Exception:
    cp = np; GPU = False

KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
THETA = math.atan(KAPPA)
CHI = np.array([0, 1, 1j, -1j, -1], dtype=np.complex128)   # chi(2)=i, chi(3)=-i, chi(4)=-1
JT = 34
B2 = bernoulli(2 * JT)

def theta0(t):
    """arg of (5/pi)^{it/2} Gamma(3/4 + it/2)  (odd character, conductor 5)"""
    t = np.asarray(t, dtype=np.float64)
    out = np.empty_like(t)
    lo = t < 200
    if lo.any():
        out[lo] = 0.5 * t[lo] * math.log(5 / math.pi) + loggamma(0.75 + 0.5j * t[lo]).imag
    hi = ~lo
    if hi.any():
        z = 0.75 + 0.5j * t[hi]
        lg = (z - 0.5) * np.log(z) - z + 1 / (12 * z) - 1 / (360 * z ** 3) + 1 / (1260 * z ** 5) - 1 / (1680 * z ** 7)
        out[hi] = 0.5 * t[hi] * math.log(5 / math.pi) + lg.imag
    return out

def tail(t, K):
    """sum_a chi(a) 5^{-s} zeta(s, K + a/5) (Euler-Maclaurin), for chi and chibar; s = 1/2 + it"""
    s = 0.5 + 1j * t
    r1 = np.zeros(len(t), dtype=np.complex128); r2 = np.zeros(len(t), dtype=np.complex128)
    for a in (1, 2, 3, 4):
        x = K + a / 5
        lx = math.log(x)
        xs = np.exp(-s * lx)                       # x^{-s}
        v = x * xs / (s - 1) + 0.5 * xs
        term = s * xs / x                          # s x^{-s-1}
        for j in range(1, JT + 1):
            # B_{2j}/(2j)! * s(s+1)...(s+2j-2) x^{-s-2j+1}
            v = v + (B2[2 * j] / math.factorial(2 * j)) * term if j < 80 else v
            term = term * (s + 2 * j - 1) * (s + 2 * j) / (x * x)
        r1 += CHI[a] * v; r2 += np.conj(CHI[a]) * v
    f = np.exp(-s * math.log(5))
    return f * r1, f * r2

def sample(T1, T2, pool_gb=8.0, log=print):
    Lmax = math.log(5 * T2 / (2 * math.pi)); h = 2 * math.pi / Lmax / 4
    J = int((T2 - T1) / h) + 1
    t = T1 + h * np.arange(J)
    Z1 = np.empty(J); Z2 = np.empty(J); imres = 0.0
    if GPU:
        cp.get_default_memory_pool().set_limit(size=int((pool_gb + 2) * 1024 ** 3))
    budget = int(pool_gb * 1024 ** 3 / 16 / 3.2)       # elements of the B x M complex phase matrix (temporaries counted)
    log('grid: %d points, h=%.5f; phase-matrix budget %d elements (%.1f GB complex128)' % (J, h, budget, budget * 16 / 1e9))
    t0 = time.time(); i = 0; nb = 0; ops = 0
    # coefficient tables are rebuilt when K grows by 10 percent
    Kcur = 0
    while i < J:
        tmax_guess = t[min(J - 1, i + 200000)]
        if Kcur == 0 or 0.25 * t[i] + 12 > Kcur * 0.999 or True:
            pass
        # choose batch: B points; K from the largest t in the batch
        B = 64
        while True:
            jend = min(J, i + B)
            K = int(math.ceil(0.25 * t[jend - 1])) + 12
            Mp = 4 * K
            if jend == J or (2 * B) * 4 * (int(math.ceil(0.25 * t[min(J - 1, i + 2 * B - 1)])) + 12) > budget: break
            B *= 2
        tb = t[i:jend]
        if K != Kcur:
            n = (5 * np.arange(K)[:, None] + np.arange(1, 5)[None, :]).ravel().astype(np.float64)
            res = (np.arange(4 * K) % 4) + 1
            w = n ** -0.5
            W = cp.asarray(np.stack([CHI[res] * w, np.conj(CHI[res]) * w], axis=1))
            logn = cp.asarray(np.log(n)); Kcur = K
        tg = cp.asarray(tb)
        ph = cp.outer(tg, logn)
        E = cp.exp(-1j * ph); del ph
        S = E @ W; del E
        S = cp.asnumpy(S) if GPU else S
        tl1, tl2 = tail(tb, K)
        th = theta0(tb)
        v1 = np.exp(1j * (th - THETA)) * (S[:, 0] + tl1)
        v2 = np.exp(1j * (th + THETA)) * (S[:, 1] + tl2)
        Z1[i:jend] = v1.real; Z2[i:jend] = v2.real
        imres = max(imres, float(np.abs(v1.imag).max()), float(np.abs(v2.imag).max()))
        ops += len(tb) * 4 * K; nb += 1
        if nb % 50 == 1: log('  t=%.1f batch %d x %d  done %d/%d  %.1fs  %.2e terms/s  imres %.2e' % (tb[-1], len(tb), 4 * K, jend, J, time.time() - t0, ops / max(time.time() - t0, 1e-9), imres))
        i = jend
    log('sampled %d points, %.3e terms, %.1fs, max |Im| %.3e' % (J, ops, time.time() - t0, imres))
    return t[0], h, Z1, Z2, imres

if __name__ == '__main__':
    T1 = float(sys.argv[1]); T2 = float(sys.argv[2]); out = sys.argv[3]; pool = float(sys.argv[4]) if len(sys.argv) > 4 else 8.0
    def log(s): print(s, flush=True)
    log('GPU=%s' % GPU)
    t0, h, Z1, Z2, imres = sample(T1, T2, pool, log)
    np.savez(out, t0=t0, h=h, Z1=Z1, Z2=Z2, imres=imres, T1=T1, T2=T2)
