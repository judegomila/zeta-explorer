# rsgrid.py TAG T0 : real zeros (sign changes) of Riemann-Siegel-type main sums in J = [t_w - LW, t_w + LW].
# Objects: 0 zeta, 1 Liouville, 2..25 sign chains (completely multiplicative, c18 hash signs), "rs1" (zeta main sum + C0 term), "dh".
# float64 (GPU if available) for grid values; the located points are used downstream as exact floats (any point set gives a positive measure).
import sys, math, json, time
import numpy as np
from flint import arb, acb, ctx
ctx.prec = 200
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=20 * 1024 ** 3)
    xp = cp
    GPU = True
except Exception as e:
    xp = np
    GPU = False
LW = 720.0
S = 128.0
WINS = [0, 5, 10, 15, 20, 25, 30, 35]
NOBJ = 26
M64 = (1 << 64) - 1


def splitmix(x):
    x = (x + 0x9E3779B97F4A7C15) & M64
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & M64
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & M64
    return x ^ (x >> 31)


def weights(N):
    """W[o, n] = eps_o(n), n = 0..N (index 0 unused)."""
    spf = np.zeros(N + 1, dtype=np.int64)
    for p in range(2, N + 1):
        if spf[p] == 0:
            spf[p::p] = np.where(spf[p::p] == 0, p, spf[p::p])
    W = np.ones((NOBJ, N + 1))
    W[:, 0] = 0
    sp = {}
    for n in range(2, N + 1):
        p = int(spf[n])
        if p == n:
            col = np.ones(NOBJ)
            col[1] = -1
            for j in range(NOBJ - 2):
                h = splitmix((p * 0x9E3779B97F4A7C15 + 121000 + j) & M64)
                col[2 + j] = -1.0 if (h >> 63) else 1.0
            sp[p] = col
            W[:, n] = col
        else:
            W[:, n] = W[:, n // p] * sp[p]
    return W


def frac2pi(x):
    tp = 2 * arb.pi()
    return float((x - tp * (x / tp).floor()).mid())


def theta_data(tw, kind):
    t = arb(tw)
    if kind == "zeta":
        z = acb(arb(1) / 4, t / 2)
        th = z.lgamma().imag - t / 2 * arb.pi().log()
        th1 = z.digamma().real / 2 - arb.pi().log() / 2
    else:
        z = acb(arb(3) / 4, t / 2)
        th = z.lgamma().imag + t / 2 * (arb(5) / arb.pi()).log()
        th1 = z.digamma().real / 2 + (arb(5) / arb.pi()).log() / 2
    return frac2pi(th), float(th1.mid()), th


def theta_off(d, th0, th1, tw):
    return th0 + th1 * d + d * d / (4 * tw) - d ** 3 / (12 * tw * tw) + d ** 4 / (24 * tw ** 3)


def base_phases(tw, ns):
    t = arb(tw)
    return np.array([frac2pi(t * arb(int(n)).log()) for n in ns])


def grid_sums(d, phi, logn, Wt):
    """S[k, o] = sum_n Wt[n, o] exp(-i (phi_n + d_k log n)). Wt already includes n^(-1/2)."""
    N = len(phi)
    K = max(1, int(6e7 // N))
    out = np.empty((len(d), Wt.shape[1]), dtype=np.complex128)
    phi_x = xp.asarray(phi)
    logn_x = xp.asarray(logn)
    Wt_x = xp.asarray(Wt.astype(np.complex128))
    for a in range(0, len(d), K):
        dd = xp.asarray(d[a:a + K])
        ph = dd[:, None] * logn_x[None, :] + phi_x[None, :]
        E = xp.exp(-1j * ph)
        r = E @ Wt_x
        out[a:a + K] = cp.asnumpy(r) if GPU else r
    return out


JJ = np.arange(-3, 5)


def lag_weights(s):
    """Lagrange weights on nodes -3..4 at positions s (array), shape (8, len(s))."""
    s = np.asarray(s, dtype=np.float64)
    w = np.ones((8, len(s)))
    for a, ka in enumerate(JJ):
        for jb in JJ:
            if jb != ka:
                w[a] *= (s - jb) / (ka - jb)
    return w


def find_roots(f, d0, h):
    """sign changes of the degree-7 local interpolant of grid values f (grid d0 + k h); returns root offsets."""
    K = len(f)
    idx = np.arange(3, K - 5)
    fine = np.empty((len(idx), 8))
    for q in range(8):
        w = lag_weights(np.array([q / 8.0]))[:, 0]
        acc = np.zeros(len(idx))
        for a, ka in enumerate(JJ):
            acc += w[a] * f[idx + ka]
        fine[:, q] = acc
    flat = fine.ravel()
    sg = np.sign(flat)
    ch = np.nonzero(sg[:-1] * sg[1:] < 0)[0]
    lo = ch.astype(np.float64) / 8.0
    hi = lo + 1.0 / 8.0
    # position in grid units relative to idx[0]
    def ev(pos):
        i = np.floor(pos).astype(np.int64)
        i = np.minimum(i, len(idx) - 1)
        s = pos - i
        w = lag_weights(s)
        acc = np.zeros(len(pos))
        for a, ka in enumerate(JJ):
            acc += w[a] * f[idx[i] + ka]
        return acc
    flo = ev(lo)
    for _ in range(46):
        mid = 0.5 * (lo + hi)
        fm = ev(mid)
        left = flo * fm <= 0
        hi = np.where(left, mid, hi)
        lo = np.where(left, lo, mid)
        flo = np.where(left, flo, fm)
    pos = 0.5 * (lo + hi)
    return d0 + (pos + idx[0]) * h


def direct(d, phi, logn, amp, th):
    return 2 * np.sum(amp * np.cos(th - phi - d * logn))


def run(tag, T0):
    res_meta = {}
    for w in WINS:
        t_start = time.time()
        tw = T0 + S * w
        Lg = math.log(tw / (2 * math.pi))
        h = 2 * math.pi / (32 * Lg)
        K = int(math.ceil(2 * LW / h)) + 24
        d0 = -LW - 12 * h
        d = d0 + h * np.arange(K)
        N = int(math.floor(math.sqrt(tw / (2 * math.pi))))
        print("window", w, "tw", tw, "N", N, "grid", K, "planned chunk memory GB about", 6e7 * 40 / 1e9, "GPU", GPU, flush=True)
        ns = np.arange(1, N + 3)
        phi = base_phases(tw, ns)
        logn = np.log(ns.astype(np.float64))
        W = weights(N)
        Wt = (W[:, 1:N + 1] / np.sqrt(ns[:N])[None, :]).T.copy()     # (N, NOBJ)
        th0, th1, _ = theta_data(tw, "zeta")
        thd = theta_off(d, th0, th1, tw)
        Sg = grid_sums(d, phi[:N], logn[:N], Wt)
        Z = 2 * np.real(np.exp(1j * thd)[:, None] * Sg)                # (K, NOBJ)
        out = {}
        for o in range(NOBJ):
            out["o%d" % o] = find_roots(Z[:, o], d0, h)
        # RS1: true N(x) and C0 term
        x = tw + d
        a = np.sqrt(x / (2 * math.pi))
        Nx = np.floor(a)
        p = a - Nx
        cden = np.cos(2 * math.pi * p)
        p2 = np.where(np.abs(cden) < 1e-7, p + 1e-6, p)
        psi = np.cos(2 * math.pi * (p2 * p2 - p2 - 1.0 / 16)) / np.cos(2 * math.pi * p2)
        z1 = Z[:, 0].copy()
        for dn in (1, 2):   # terms N+1, N+2 present where N(x) >= N + dn
            n = N + dn
            term = 2 * n ** -0.5 * np.cos(thd - phi[n - 1] - d * logn[n - 1])
            z1 += np.where(Nx >= n, term, 0.0)
        for dn in (0, 1):   # terms N, N-1 absent where N(x) < N - dn
            n = N - dn
            term = 2 * n ** -0.5 * np.cos(thd - phi[n - 1] - d * logn[n - 1])
            z1 -= np.where(Nx < n, term, 0.0)
        z1 += (-1.0) ** (Nx - 1) * (x / (2 * math.pi)) ** -0.25 * psi
        out["rs1"] = find_roots(z1, d0, h)
        # checks
        amp = ns[:N] ** -0.5
        chk = []
        for o in (0, 2):
            r = out["o%d" % o]
            for g in r[:: max(1, len(r) // 40)]:
                chk.append(abs(direct(g, phi[:N], logn[:N], amp * W[o, 1:N + 1], theta_off(g, th0, th1, tw))))
        meta = {"tw": tw, "N": N, "h": h, "K": K, "counts": {k: int(np.sum(np.abs(v) <= LW)) for k, v in out.items()},
                "smooth_count": float(2 * LW * th1 / math.pi), "max_direct_residual": float(max(chk)),
                "nx_change": bool(Nx.min() != Nx.max())}
        # DH
        if T0 < 1e11:
            N5 = int(math.floor(math.sqrt(5 * tw / (2 * math.pi))))
            n5 = np.arange(1, N5 + 1)
            kap = (math.sqrt(10.0 - 2.0 * math.sqrt(5.0)) - 2.0) / (math.sqrt(5.0) - 1.0)
            a5 = np.array([0.0, 1.0, kap, -kap, -1.0])[n5 % 5]
            phi5 = base_phases(tw, n5)
            log5 = np.log(n5.astype(np.float64))
            t50, t51, _ = theta_data(tw, "dh")
            th5 = theta_off(d, t50, t51, tw)
            S5 = grid_sums(d, phi5, log5, (a5 / np.sqrt(n5))[:, None])
            Z5 = 2 * np.real(np.exp(1j * th5) * S5[:, 0])
            out["dh"] = find_roots(Z5, d0, h)
            meta["N5"] = N5
            meta["counts"]["dh"] = int(np.sum(np.abs(out["dh"]) <= LW))
            meta["smooth_count_dh"] = float(2 * LW * t51 / math.pi)
            r = out["dh"]
            meta["max_direct_residual_dh"] = float(max(abs(direct(g, phi5, log5, a5 / np.sqrt(n5), theta_off(g, t50, t51, tw))) for g in r[:: max(1, len(r) // 40)]))
        for k in list(out.keys()):
            out[k] = out[k][np.abs(out[k]) <= LW]
        np.savez("zeros_%s_w%02d.npz" % (tag, w), **out)
        meta["seconds"] = time.time() - t_start
        res_meta[str(w)] = meta
        print(json.dumps(meta), flush=True)
    json.dump(res_meta, open("zeros_%s_meta.json" % tag, "w"), indent=1)
    print("RSGRID DONE", tag, flush=True)


if __name__ == "__main__":
    run(sys.argv[1], float(sys.argv[2]))
