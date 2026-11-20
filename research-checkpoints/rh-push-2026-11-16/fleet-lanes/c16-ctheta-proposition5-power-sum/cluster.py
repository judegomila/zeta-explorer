"""Decisive test for C(theta): synthetic zero sets = on-line ordinates + off-line clusters.
G(y,u) = sum_on F_u(y-gamma) + sum_pairs 2 Re F_u(y-gamma_j+i b_j),  F_u(z) = (1-cos(u z))/(u z^2).
C(theta) at height t: G >= -M for u in [theta L/2, theta L], L = log t.
float64 (MEASURED). Passing clusters are rechecked in ball arithmetic by ballcheck.py."""
import sys, os, json, math, time
import numpy as np
from scipy.optimize import minimize
HERE = os.path.dirname(os.path.abspath(__file__))
NU = 17
NPOS = 41   # ordinates tried by the one-pair control (13 in the second run, see RESULT section 4)

def F_on(y, u, gam):
    d = y[:, None] - gam[None, :]
    small = np.abs(d) < 1e-7
    d2 = np.where(small, 1.0, d)
    v = (1 - np.cos(u * d2)) / (u * d2 * d2)
    return np.where(small, u / 2, v).sum(axis=1)

def cl(y, us, g, b, grad=False):
    """cluster part: array [len(us), len(y)]; optional gradients [nu, ny, n] w.r.t. g and b."""
    z = y[:, None] - g[None, :] + 1j * b[None, :]
    G = np.empty((len(us), len(y)))
    if grad:
        Dg = np.empty((len(us), len(y), len(g))); Db = np.empty_like(Dg)
    for k, u in enumerate(us):
        cz = np.cos(u * z)
        Fz = (1 - cz) / (u * z * z)
        G[k] = 2 * Fz.real.sum(axis=1)
        if grad:
            Fp = np.sin(u * z) / (z * z) - 2 * Fz / z
            Dg[k] = -2 * Fp.real; Db[k] = -2 * Fp.imag
    return (G, Dg, Db) if grad else G

class Cell:
    def __init__(self, T, theta, zeros=None):
        self.T, self.theta = T, theta
        self.L = math.log(T)
        self.umax = theta * self.L
        self.us = np.linspace(self.umax / 2, self.umax, NU)
        self.h = 0.26 / self.umax
        self.gam = np.array([]) if zeros is None else np.asarray(zeros)
    def grid(self, lo, hi, fine=1):
        return np.arange(lo, hi, self.h / fine)
    def pos(self, y, us=None, removed=None):
        us = self.us if us is None else us
        gam = self.gam
        if removed is not None and len(removed):
            gam = np.delete(gam, removed)
        if gam.size == 0:
            return np.zeros((len(us), len(y)))
        return np.array([F_on(y, u, gam) for u in us])
    def ypad(self):
        return 60.0 / self.umax

def softmin_obj(x, cell, y, P, n, lob, hib, tau):
    g, b = x[:n], np.clip(x[n:], lob, hib)
    G, Dg, Db = cl(y, cell.us, g, b, grad=True)
    Gt = G + P
    m = Gt.min()
    w = np.exp(-tau * (Gt - m)); s = w.sum(); w /= s
    val = m - math.log(s) / tau
    gg = np.einsum('ky,kyj->j', w, Dg); gb = np.einsum('ky,kyj->j', w, Db)
    return -val, -np.concatenate([gg, gb])

def family(cell, n, kappa, p, b0, c):
    d = 2 * math.pi / (kappa * cell.umax)
    j = np.arange(n) - (n - 1) / 2
    x = j / ((n + 1) / 2)
    prof = np.cos(math.pi * x / 2) ** (2 * p)
    return c + j * d, np.maximum(b0 * prof / prof.max(), 1e-5)   # largest offset equals b0 exactly

def true_min(cell, g, b, removed=None, fine=2, us=None, pad=None):
    pad = cell.ypad() if pad is None else pad
    y = cell.grid(g.min() - pad, g.max() + pad, fine)
    us = np.linspace(cell.umax / 2, cell.umax, 2 * NU - 1) if us is None else us
    Gt = cl(y, us, g, b) + cell.pos(y, us, removed)
    k = np.unravel_index(np.argmin(Gt), Gt.shape)
    return float(Gt.min()), float(y[k[1]]), float(us[k[0]])

def removed_idx(cell, c, n):
    return np.argsort(np.abs(cell.gam - c))[: 2 * n]

def optimise(cell, n, bstar, mode, zq, c0, seed=0, iters=80):
    """mode 'max': one pair pinned at b = bstar, the others free in [1e-5, 0.4999]; maximise min G.
       mode 'floor': every pair has b >= bstar."""
    best = None
    rem0 = removed_idx(cell, c0, n) if zq else None
    for kappa in (1.1, 1.3, 1.6, 2.2, 3.5):
        for p in (1, 2, 3):
            g, b = family(cell, n, kappa, p, bstar, c0)
            if mode == 'floor':
                b = np.maximum(b, bstar)
            m = true_min(cell, g, b, rem0, fine=1, us=cell.us)[0]
            if best is None or m > best[0]:
                best = (m, g, b, kappa, p)
    m0, g, b, kappa, p = best
    j0 = int(np.argmax(b))
    lob = np.full(n, 1e-5); hib = np.full(n, 0.4999)
    if mode == 'max':
        lob[j0] = hib[j0] = bstar; b[j0] = bstar
    else:
        lob[:] = bstar
    pad = cell.ypad()
    span = max(g.max() - g.min(), 1.0)
    y = cell.grid(g.min() - pad - 0.5 * span, g.max() + pad + 0.5 * span)
    P = cell.pos(y, None, rem0)
    x0 = np.concatenate([g, b])
    bounds = [(c0 - span - 2, c0 + span + 2)] * n + list(zip(lob, hib))
    for tau in (5.0, 30.0):
        r = minimize(softmin_obj, x0, args=(cell, y, P, n, lob, hib, tau), jac=True, method='L-BFGS-B', bounds=bounds, options=dict(maxiter=iters))
        x0 = r.x
    g1, b1 = x0[:n], np.clip(x0[n:], lob, hib)
    m1 = true_min(cell, g1, b1, rem0)
    mfam = true_min(cell, g, b, rem0)
    if mfam[0] > m1[0]:
        g1, b1, m1 = g, b, mfam
    return dict(min=m1[0], y=m1[1], u=m1[2], g=g1.tolist(), b=b1.tolist(), fam=(kappa, p), fam_min=mfam[0], removed=(rem0.tolist() if zq else []))

def one_pair(cell, c0, M=0.0):
    """largest b such that a single pair at ordinate c0 passes min G >= -M."""
    lo, hi = 0.0, 0.4999
    g = np.array([c0])
    if true_min(cell, g, np.array([hi]))[0] >= -M:
        return hi
    for _ in range(26):
        mid = (lo + hi) / 2
        if true_min(cell, g, np.array([mid]))[0] >= -M:
            lo = mid
        else:
            hi = mid
    return lo

def load(T):
    return np.array(json.load(open(os.path.join(HERE, "zeros_%g.json" % T)))["zeros_minus_T"])

def task_real(a):
    T, theta, n, mode, zq = a
    t0 = time.time()
    cell = Cell(T, theta, load(T))
    L = cell.L
    b_reg = math.log(20 / theta) / theta / L
    b_p5 = math.log(2 * math.pi ** 2 / theta) / theta / L
    c0 = 0.0
    res = dict(T=T, theta=theta, n=n, mode=mode, zq=zq, L=L, umax=cell.umax, b_region=b_reg, b_p5=b_p5, trials=[])
    bl = [x for x in (0.01, 0.02, 0.03, 0.045, 0.06, 0.08, 0.1, 0.13, 0.16, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.49)]
    fails = 0; best = None
    for bs in bl:
        r = optimise(cell, n, bs, mode, zq, c0)
        ok = r["min"] >= 0
        res["trials"].append(dict(bstar=bs, min=r["min"], y=r["y"], u=r["u"], fam=r["fam"], fam_min=r["fam_min"]))
        if ok:
            best = dict(bstar=bs, **r); fails = 0
        else:
            fails += 1
            if fails >= 3:
                break
    res["best"] = best
    res["secs"] = time.time() - t0
    print("real", T, theta, n, mode, zq, "b_max_pass", None if best is None else best["bstar"], "region", round(b_reg, 4), "min", None if best is None else round(best["min"], 4), "secs", round(res["secs"]), flush=True)
    return res

def task_onepair(a):
    T, theta = a
    cell = Cell(T, theta, load(T))
    out = []
    for c0 in np.linspace(-20, 20, NPOS):
        out.append((float(c0), one_pair(cell, c0, 0.0), one_pair(cell, c0, 1.0)))
    arr = np.array(out)
    # mechanism at the worst point for the median position, b = threshold * 1.5
    c0 = 0.0; b = min(0.4999, 1.5 * float(np.median(arr[:, 1])))
    m = true_min(cell, np.array([c0]), np.array([b]))
    pred = -math.exp(m[2] * b) * m[2] / (4 * math.pi ** 2)
    res = dict(T=T, theta=theta, L=cell.L, b_region=math.log(20 / theta) / theta / cell.L, b_p5=math.log(2 * math.pi ** 2 / theta) / theta / cell.L,
               b1_M0=[float(arr[:, 1].min()), float(np.median(arr[:, 1])), float(arr[:, 1].max())],
               b1_M1=[float(arr[:, 2].min()), float(np.median(arr[:, 2])), float(arr[:, 2].max())],
               mech=dict(b=b, min=m[0], y_minus_gamma=m[1] - c0, u=m[2], two_pi_over_u=2 * math.pi / m[2], prop5_term=pred))
    print("onepair", T, theta, res["b1_M0"], res["b1_M1"], "region", round(res["b_region"], 4), "p5", round(res["b_p5"], 4), res["mech"], flush=True)
    return res

def task_univ(a):
    """cluster alone, u_max = 1 (scale invariant): largest A = u b_max with inf G >= -eps (G in units of u)."""
    n, eps = a
    cell = Cell(math.e, 1.0, None)   # L = 1, umax = 1
    best = None; fails = 0; trials = []
    for A in (1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 22, 24):
        fams = []
        for kappa in (1.1, 1.3, 1.6, 2.2, 3.5, 6.0, 12.0):
            for p in (1, 2, 3, 5):
                g, b = family(cell, n, kappa, p, float(A), 0.0)
                m = true_min(cell, g, b, None, fine=1, us=cell.us, pad=200.0)
                fams.append((m[0], kappa, p, g, b))
        fams.sort(key=lambda r: -r[0])
        cand = [(true_min(cell, fams[0][3], fams[0][4], None, pad=400.0)[0], fams[0][3], fams[0][4])]
        mf = cand[0][0]
        for r in fams[:3]:
            g, b = r[3].copy(), r[4].copy()
            j0 = int(np.argmax(b)); lob = np.full(n, 1e-5); hib = np.full(n, 40.0); lob[j0] = hib[j0] = A; b[j0] = A
            span = max(g.max() - g.min(), 10.0)
            y = cell.grid(g.min() - 200 - 0.5 * span, g.max() + 200 + 0.5 * span)
            P = np.zeros((NU, len(y)))
            x0 = np.concatenate([g, b]); bounds = [(-span - 20, span + 20)] * n + list(zip(lob, hib))
            for tau in (50.0, 1000.0):
                rr = minimize(softmin_obj, x0, args=(cell, y, P, n, lob, hib, tau), jac=True, method='L-BFGS-B', bounds=bounds, options=dict(maxiter=200)); x0 = rr.x
            g1, b1 = x0[:n], np.clip(x0[n:], lob, hib)
            cand.append((true_min(cell, g1, b1, None, pad=400.0)[0], g1, b1))
        cand.sort(key=lambda r: -r[0])
        m1, g1, b1 = cand[0]
        trials.append(dict(A=A, min=m1, fam_min=mf, fam=(fams[0][1], fams[0][2])))
        if m1 >= -eps:
            best = dict(A=A, min=m1, g=np.asarray(g1).tolist(), b=np.asarray(b1).tolist(), fam=(fams[0][1], fams[0][2]), fam_min=mf); fails = 0
        else:
            fails += 1
            if fails >= 2:
                break
    print("univ n", n, "eps", eps, "A_max", None if best is None else best["A"], [(t["A"], "%.2e" % t["min"], "%.2e" % t["fam_min"]) for t in trials], flush=True)
    return dict(n=n, eps=eps, best=best, trials=trials)

def task_nat(a):
    """ZQ with the Riemann-von Mangoldt count kept: the 2n on-line ordinates nearest the centre are replaced by n pairs
    on a lattice of spacing d_nat = 4 pi / log(T/2pi) (twice the mean spacing), tapered offsets. No position optimisation."""
    T, theta, n = a
    cell = Cell(T, theta, load(T))
    dnat = 4 * math.pi / math.log(T / 2 / math.pi)
    kappa = 2 * math.pi / (dnat * cell.umax)
    rem = removed_idx(cell, 0.0, n)
    c0 = float(np.mean(cell.gam[rem]))
    best = None; trials = []
    for bs in (0.005, 0.01, 0.02, 0.03, 0.045, 0.06, 0.08, 0.1, 0.13, 0.16, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.49):
        r = None
        for p in (1, 2, 3, 5):
            for off in (-0.25, 0.0, 0.25):
                g, b = family(cell, n, kappa, p, bs, c0 + off * dnat)
                m = true_min(cell, g, b, rem)
                if r is None or m[0] > r[0][0]: r = (m, g, b, p)
        trials.append((bs, r[0][0]))
        if r[0][0] >= 0:
            best = dict(bstar=bs, min=r[0][0], y=r[0][1], u=r[0][2], g=r[1].tolist(), b=r[2].tolist(), p=r[3], removed=rem.tolist())
    res = dict(T=T, theta=theta, n=n, mode='nat', L=cell.L, umax=cell.umax, kappa=kappa, dnat=dnat, b_region=math.log(20 / theta) / theta / cell.L, trials=trials, best=best)
    print("nat", T, theta, n, "kappa=2pi/(d u)", round(kappa, 3), "b_max_pass", None if best is None else best["bstar"], "region", round(res["b_region"], 4), [(t[0], round(t[1], 3)) for t in trials], flush=True)
    return res

_F = None; _WHAT = None
def _wrapped(a):
    """run one task; result is stored in parts/ so a stopped run keeps what it finished"""
    fn = os.path.join(HERE, "parts", "%s_%s.json" % (_WHAT, "_".join(str(x) for x in a)))
    if os.path.exists(fn):
        return json.load(open(fn))
    r = _F(a)
    json.dump(r, open(fn, "w"))
    return r

if __name__ == "__main__":
    from multiprocessing import Pool
    what = sys.argv[1]
    W = int(os.environ.get("RH_WORKERS", "4"))
    Ts = [1e6, 1e7, 1e8, 1e9]; thetas = [0.25, 0.5, 1.0]
    ns = [2, 3, 4, 6, 8, 12, 16, 24, 32, 40]
    if what == "onepair":
        tasks = [(T, th) for T in Ts for th in thetas]; f = task_onepair
    elif what == "univ":
        tasks = [(n, 1e-3) for n in [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 40]]; f = task_univ
    elif what in ("real", "zq", "floor"):
        mode = 'floor' if what == "floor" else 'max'
        sel = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else ns
        tasks = [(T, th, n, mode, what == "zq") for n in sel for T in Ts[::-1] for th in thetas[::-1]]; f = task_real
    elif what == "onepair2":
        globals()["NPOS"] = 13
        tasks = [(1e9, 1.0), (1e9, 0.5), (1e9, 0.25), (1e8, 1.0), (1e8, 0.5), (1e8, 0.25), (1e7, 1.0)]; f = task_onepair
    elif what == "nat2":
        tasks = [(1e9, th, n) for n in (16, 40) for th in (0.25, 0.35, 0.42, 0.5, 0.75, 1.0)]; f = task_nat
    elif what == "nat":
        tasks = [(T, th, n) for T in Ts for th in (0.25, 0.35, 0.42, 0.5, 0.75, 1.0) for n in (8, 16, 40)]; f = task_nat
    print("tasks", len(tasks), "workers", W, flush=True)
    os.makedirs(os.path.join(HERE, "parts"), exist_ok=True)
    _F, _WHAT = f, what
    with Pool(W) as p:
        out = p.map(_wrapped, tasks, chunksize=1)
    json.dump(out, open(os.path.join(HERE, "out_%s.json" % what), "w"))
    print("done", what, flush=True)
