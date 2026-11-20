"""run2.py -- combination 2: alias coefficients a_h(n) = -(1/p) e(hn/p) on the punctured (1/p)-lattice G(p,D).
(a) exact octave-Szasz weight W(p,D) and the firing condition of the coefficient-uniform certificate E over p <= 1e4, D <= 1e6;
(b) complex energy ratio theta = phi^H G phi / 1^T G 1 on the full grid (all windows k = 1..D), port model mu = d^(1/3)/1.7,
    u = 2.3/d, for the arithmetic phases and for twisted / random phases of the same modulus.  GPU float64 with numpy fallback."""
import argparse, json, math, os, time
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("--nmax", type=int, default=200000); ap.add_argument("--out", default="c2.json"); ap.add_argument("--cpu", action="store_true")
ap.add_argument("--ps", default="2,3,5,7,11,97,997,9973"); ap.add_argument("--budget", type=float, default=2.5e8)
a = ap.parse_args()
xp = np; GPU = False
if not a.cpu:
    try:
        import cupy as cp
        cp.get_default_memory_pool().set_limit(size=20 * 1024 ** 3); xp = cp; GPU = True
    except Exception as e:
        print("cupy not used:", e, flush=True)
PORT_C, PORT_V = 1.7, 2.3
ASTAR = 1024 * 2 ** (-2 / 3) / (310 * 0.6608048321430365)


def W_exact(p, D):
    """sum over n <= pD, p not | n of 2^(-floor(log2(n)/3)); exact rational via octave counts"""
    X = p * D; tot = 0.0; j = 0
    while 8 ** j <= X:
        lo, hi = 8 ** j, min(8 ** (j + 1) - 1, X)
        cnt = (hi - lo + 1) - (hi // p - (lo - 1) // p); tot += cnt / 2 ** j; j += 1
    return tot


def leg(h, p):
    h %= p
    if h == 0: return 0
    return 1 if pow(h, (p - 1) // 2, p) == 1 else -1


def vectors(p, D, rng):
    n = np.arange(1, p * D + 1, dtype=np.int64); n = n[n % p != 0]; h = (-n) % p
    names = []; cols = []
    names.append("ABS"); cols.append(np.ones(len(n), dtype=complex))
    rs = sorted(set([1, 2 % p, (p - 1) // 2, p - 1]) - {0})
    for r in rs:
        names.append("ARITH_r%d" % r); cols.append(np.exp(2j * np.pi * ((h * r) % p) / p))
    ar1 = np.exp(2j * np.pi * (h % p) / p)
    for s in range(8):
        names.append("SGN_%d" % s); cols.append(rng.choice([-1.0, 1.0], len(n)).astype(complex))
    for s in range(8):
        names.append("UNI_%d" % s); cols.append(np.exp(2j * np.pi * rng.random(len(n))))
    for s in range(4):
        e = rng.choice([-1.0, 1.0], p); names.append("SGNH_%d" % s); cols.append(e[h] * ar1)
    for s in range(4):
        e = np.exp(2j * np.pi * rng.random(p)); names.append("UNIH_%d" % s); cols.append(e[h] * ar1)
    if p > 2:
        l = np.array([leg(int(x), p) for x in range(p)], dtype=float); names.append("LEG"); cols.append(l[h] * ar1)
    return n, names, np.stack(cols, 1)


def theta_all(p, D, rng, X=None, budget=None):
    X = X or xp; budget = budget or a.budget
    n, names, Phi = vectors(p, D, rng); N = len(n)
    d = n / p; mu = d ** (1 / 3) / PORT_C; u = PORT_V / d
    mu_g = X.asarray(mu); u_g = X.asarray(u); Phi_g = X.asarray(Phi); acc = X.zeros(Phi.shape[1], dtype=complex); diag = 0.0
    R = max(1, int(budget // N))
    for i0 in range(0, N, R):
        sl = slice(i0, min(N, i0 + R))
        A0 = mu_g[sl][:, None]; B0 = mu_g[None, :]; Dl = X.abs(u_g[sl][:, None] - u_g[None, :])
        A = X.maximum(A0, B0); B = X.minimum(A0, B0)        # G is symmetric in the two rates; with A >= B no exponent is positive
        # G = int exp(-A|x|) exp(-B|x-Dl|) dx = (2 exp(-B Dl)/(A+B)) (1 + B Dl phi((A-B) Dl)), phi(z) = (1-exp(-z))/z, z >= 0
        z = (A - B) * Dl; small = z < 1e-8
        ph = X.where(small, 1.0 - 0.5 * z, -X.expm1(-z) / X.where(small, 1.0, z))
        G = 2.0 * X.exp(-B * Dl) / (A + B) * (1.0 + B * Dl * ph)
        del A0, B0
        acc += X.einsum("iv,iv->v", X.conj(Phi_g[sl]), G @ Phi_g)
        del A, B, Dl, z, small, ph, G
    acc = X.asnumpy(acc) if X is not np else acc
    den = acc[0].real; th = (acc.real / den)
    dg = float(np.sum(1.0 / mu)) / den
    return N, dict(zip(names, [float(t) for t in th])), dg, float(den)


if __name__ == "__main__":
    t0 = time.time(); res = dict(gpu=GPU, port=[PORT_C, PORT_V], astar=ASTAR)
    # (a) certificate E census, exact
    rows = []
    for p in [2, 3, 5, 7, 11, 13, 97, 101, 997, 1009, 9973]:
        for D in [1, 2, 4, 16, 64, 1024, 10 ** 4, 10 ** 5, 10 ** 6]:
            Wv = W_exact(p, D); pD = p * D
            xav = (32 / 31) * pD ** (-1 / 3) if pD >= 64 else None          # upper bound of the available gate value at Q = 2^(-2/3)
            # exact available value: slowest rate m = p^(-1/3)/c, common collar depth <= v/d_max; Q = (c D^(2/3)/v) 2^(-2/3) = 2^(-2/3) fixes v/c = D^(2/3)
            dmax = D - 1 / p; xex = p ** (-1 / 3) * D ** (2 / 3) / dmax
            rows.append(dict(p=p, D=D, W=Wv, ratio=Wv / pD ** (2 / 3), x_avail=xex, need=2 * ASTAR * Wv, fires=bool(xex > 2 * ASTAR * Wv)))
    res["certE"] = rows; res["certE_any_fires"] = any(r["fires"] for r in rows)
    print("certificate E fires anywhere:", res["certE_any_fires"], flush=True)
    # (b) theta
    rng = np.random.default_rng(20261119); out = []
    for p in [int(x) for x in a.ps.split(",")]:
        Ds = sorted(set([1, 2, 3, 4, 6, 8] + [int(round(2 ** (j / 1.0))) for j in range(4, 40)]))
        for D in Ds:
            N = (p - 1) * D
            if N > a.nmax or N < 1: continue
            t1 = time.time(); N, th, dg, den = theta_all(p, D, rng)
            ar = [v for k, v in th.items() if k.startswith("ARITH")]
            row = dict(p=p, D=D, N=N, theta=th, diag_fraction=dg, den=den, sec=time.time() - t1); out.append(row)
            print("p=%d D=%d N=%d arith %.4g..%.4g sgn %.4g uni %.4g sgnh %.4g leg %s diag %.4g  %.1fs" % (
                p, D, N, min(ar), max(ar), np.mean([v for k, v in th.items() if k.startswith("SGN_")]),
                np.mean([v for k, v in th.items() if k.startswith("UNI_")]), np.mean([v for k, v in th.items() if k.startswith("SGNH")]),
                th.get("LEG"), dg, row["sec"]), flush=True)
            res["theta"] = out; res["sec"] = time.time() - t0; json.dump(res, open(a.out, "w"))
    print("done %.0f s" % (time.time() - t0), flush=True)
