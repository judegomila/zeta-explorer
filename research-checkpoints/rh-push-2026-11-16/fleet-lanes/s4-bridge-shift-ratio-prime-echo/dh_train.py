"""s4 combination (1), DH row, and combination (4), DH second line.
DH(s) = sum a(n) n^-s, a periodic mod 5: (1, kappa, -kappa, -1, 0). Its log-derivative train -F'/F = sum Lam_DH(n) n^-s,
Lam_DH = (a log) * a^{-1} (Dirichlet convolution; supported on all n, not on prime powers).
D_N(x, t) = Re G_DH(s) - Re sum_{n<=N} Lam_DH(n) n^-s, s = 1/2 + x + i t; checkpoints N = 1e3..Nmax.
Also sum_{n<=N} a(n) n^-(1.25 + i t) (complex) for combination (4).
usage: dh_train.py <out.json> <Nmax> <npts> <heights csv>
"""
import sys, json, math, time, numpy as np
import echo
from echo import X, xp, GPU
XD = np.concatenate([X, [1.0, 2.5]])

def coeffs(N):
    kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
    per = np.array([0.0, 1.0, kap, -kap, -1.0])
    a = per[np.arange(N + 1) % 5]; a[0] = 0
    b = np.zeros(N + 1); b[1] = 1.0
    for d in range(1, N // 2 + 1):
        if b[d] != 0.0: b[2 * d::d] -= b[d] * a[2:N // d + 1]
    al = a * np.log(np.maximum(np.arange(N + 1), 1))
    lam = np.zeros(N + 1)
    for d in range(1, N + 1):
        if b[d] != 0.0: lam[d::d] += b[d] * al[1:N // d + 1]
    return a, b, lam

def main():
    out, N, npts = sys.argv[1], int(float(sys.argv[2])), int(sys.argv[3]); heights = [float(v) for v in sys.argv[4].split(',')]
    t0 = time.time(); a, b, lam = coeffs(N)
    print('coeffs sec', round(time.time() - t0, 1), 'max|b|', np.abs(b).max(), 'max|lam|', np.abs(lam).max(), flush=True)
    cks = [c for c in [1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8] if c <= N]
    growth = {('%g' % c): [float(np.abs(lam[:int(c) + 1]).max()), float(np.sqrt((lam[1:int(c) + 1] ** 2 / np.arange(1, int(c) + 1)).sum()))] for c in cks}
    rng = np.random.default_rng(5); res = dict(X=XD.tolist(), checkpoints=cks, growth_maxabs_l2half=growth, heights={})
    n = np.arange(1, N + 1, dtype=np.float64); logn = np.log(n); mc = 1 << 16
    raw = {}
    for H in heights:
        t = np.sort(H + 1000 * rng.random(npts)); td = xp.asarray(t)
        acc = xp.zeros((npts, 2 * len(XD) + 2)); lo = 0; hist = {}; mins = {}; rms = {}
        for c in cks:
            top = int(c)
            while lo < top:
                hi = min(lo + mc, top)
                ln = xp.asarray(logn[lo:hi]); lm = xp.asarray(lam[lo + 1:hi + 1]); aa = xp.asarray(a[lo + 1:hi + 1])
                W = lm[:, None] * xp.exp(-(0.5 + xp.asarray(XD))[None, :] * ln[:, None])
                w4 = (aa * xp.exp(-1.25 * ln))[:, None]
                ph = td[:, None] * ln[None, :]
                C = xp.cos(ph); S = xp.sin(ph)
                acc[:, :len(XD)] += C @ W; acc[:, len(XD):2 * len(XD)] += C @ (W * ln[:, None])
                acc[:, -2:-1] += C @ w4; acc[:, -1:] -= S @ w4
                lo = hi
            A = acc.get() if GPU else acc.copy()
            s = (0.5 + XD)[None, :] + 1j * t[:, None]
            G = echo.drift('DH', s)
            for var in ('sharp', 'fejer'):
                tr = A[:, :len(XD)] - (A[:, len(XD):2 * len(XD)] / math.log(c) if var == 'fejer' else 0)
                D = G - tr; key = '%s|%g' % (var, c)
                hist[key] = np.bincount(echo.xstar_index(D[:, :len(X)]), minlength=len(X) + 1).tolist()
                mins[key] = D.min(axis=0).tolist(); rms[key] = np.sqrt((tr ** 2).mean(axis=0)).tolist()
                raw['%g|%s' % (H, key)] = D[:256]
            raw['%g|L4|%g' % (H, c)] = A[:256, -2:]
        raw['t_%g' % H] = t[:256]
        res['heights']['%g' % H] = dict(hist=hist, minD=mins, rms_train=rms)
        print('H', H, round(time.time() - t0, 1), flush=True)
    json.dump(res, open(out, 'w')); np.savez_compressed(out.replace('.json', '_raw.npz'), **raw)
    print('DONE', flush=True)

if __name__ == '__main__':
    main()
