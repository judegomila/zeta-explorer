"""c17-u3: reach of an off-line zero versus functional-equation defect, integer support,
with and without multiplicativity.  Float64 screen (LP by HiGHS); zero functional by mpmath.

Model (see RESULT.md section 4).  Unknowns a_n (n <= X, a_1 = 1) and r.
Theta(y) = sum a_n exp(-pi n^2 y).  Defect E(y) = y^(1/2)(Theta(y)+r/2) - (Theta(1/y)+r/2)
on rays y = rho e^(i phi), rho in [rho_min, 1], 0 <= phi <= phi* = pi/2 - theta0.
delta(a) = max over grid of max(|Re E|, |Im E|).
Zero functional: Lambda_{phi*}(s0; a, r) = 0 (split at |y| = 1 on the ray phi*).
"""
import os, sys, json, time, math
os.environ["OMP_NUM_THREADS"] = "1"; os.environ["OPENBLAS_NUM_THREADS"] = "1"
import numpy as np
import mpmath as mp
from scipy.optimize import linprog
import multiprocessing as _mpc
Pool = _mpc.get_context("fork").Pool

X = int(os.environ.get("FE_X", "4000"))
TH0 = float(os.environ.get("FE_TH0", "0.1"))
BOX = float(os.environ.get("FE_BOX", "31"))
PHIS = math.pi / 2 - TH0
RHO_MIN = 27.6 / (math.pi * X * X * math.cos(PHIS))
RAYS = [(0.0, 60), (0.5 * PHIS, 100), (0.8 * PHIS, int(50 / TH0)), (PHIS, int(80 / TH0))]  # (phi, points per e-fold)
NH = 14  # terms in the zero functional

def build_A():
    rows = []
    n2 = (np.arange(1, X + 1, dtype=np.float64)) ** 2
    L = math.log(1 / RHO_MIN)
    tot = sum(int(L * k) + 1 for _, k in RAYS)
    print(f"planned: {tot} complex rows x {X+1} cols; real matrix {2*tot*(X+1)*8/1e9:.2f} GB", flush=True)
    meta = []
    for phi, k in RAYS:
        m = int(L * k) + 1
        rho = np.exp(-np.linspace(0, L, m))
        y = rho * np.exp(1j * phi)
        sq = np.sqrt(y)
        blk = np.empty((m, X + 1), dtype=np.complex128)
        for i0 in range(0, m, 500):
            yy = y[i0:i0 + 500, None]
            blk[i0:i0 + 500, :X] = sq[i0:i0 + 500, None] * np.exp(-math.pi * n2[None, :] * yy) - np.exp(-math.pi * n2[None, :] / yy)
        blk[:, X] = (sq - 1) / 2
        rows.append(blk); meta += [(phi, r_) for r_ in rho]
    C = np.vstack(rows); del rows
    A = np.vstack([C.real, C.imag]); del C
    return np.ascontiguousarray(A), meta

def zero_row(s0):
    """complex coefficients h_n (n<=NH) and h_r with Lambda = sum a_n h_n + r h_r; scaled."""
    mp.mp.dps = 60
    s = mp.mpc(s0); e = mp.e ** (1j * mp.mpf(PHIS)); eb = mp.e ** (-1j * mp.mpf(PHIS))
    h = []
    for n in range(1, NH + 1):
        w = mp.pi * n * n
        h.append(w ** (-s / 2) * mp.gammainc(s / 2, w * e) + w ** (-(1 - s) / 2) * mp.gammainc((1 - s) / 2, w * eb))
    hr = mp.e ** (-1j * PHIS * (1 - s) / 2) / (s - 1) - mp.e ** (1j * PHIS * s / 2) / s
    S = max(abs(v) for v in h)
    lam_true = mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
    lam_model = sum(h) + hr  # a_n = 1 (n <= NH), r = 1
    return (np.array([complex(v / S) for v in h]), complex(hr / S), complex(lam_true / S), complex(lam_model / S))

A = None; META = None

def sup_defect(a, r):
    v = A[:, :X] @ a + A[:, X] * r
    return float(np.max(np.abs(v))), v

MU = 1.0e3
LAST = {}
JOBT = float(os.environ.get('FE_JOBT', '1500'))

def solve_lp(Acols, const, zc, zconst, lb, ub, tag):
    """min delta + MU*sum(slack) s.t. |Acols z + const| <= delta, zc z + zconst = s+ - s- (2 rows), lb<=z<=ub.
    Cutting planes over the rows.  Returns z, sup defect of the LP point, slack sum, info."""
    M, nv = Acols.shape
    act = np.zeros(M, bool); act[::12] = True
    c = np.zeros(nv + 5); c[nv] = 1; c[nv + 1:] = MU
    bounds = [(lb[j], ub[j]) for j in range(nv)] + [(0, None)] * 5
    Aeq = np.hstack([zc, np.zeros((2, 1)), -np.eye(2), np.eye(2)]); beq = -zconst
    z = None; d_true = None; sl = None; t_start = time.time(); LAST["d_lp"] = None
    for rnd in range(40):
        if time.time() - t_start > JOBT:
            return z, d_true, sl, f"job time cap at round {rnd}"
        idx = np.where(act)[0]
        Ar = Acols[idx]; cr = const[idx]; k = len(idx)
        pad = np.hstack([-np.ones((k, 1)), np.zeros((k, 4))])
        Aub = np.vstack([np.hstack([Ar, pad]), np.hstack([-Ar, pad])])
        bub = np.concatenate([-cr, cr])
        res = linprog(c, A_ub=Aub, b_ub=bub, A_eq=Aeq, b_eq=beq, bounds=bounds, method=os.environ.get("FE_METHOD", "highs"), options={"time_limit": float(os.environ.get("FE_LPT", "300"))})
        del Aub
        if res.status != 0:
            return z, d_true, sl, f"lp status {res.status} at round {rnd}"
        z = res.x[:nv]; d_lp = res.x[nv]; sl = float(res.x[nv + 1:].sum()); LAST["d_lp"] = float(d_lp)
        full = np.abs(Acols @ z + const)
        d_true = float(full.max())
        viol = np.where((full > d_lp * (1 + 1e-3) + 1e-13) & (~act))[0]
        if len(viol) == 0:
            return z, d_true, sl, f"rounds {rnd+1} rows {len(idx)}"
        order = viol[np.argsort(-full[viol])][:1200]
        act[order] = True
    return z, d_true, sl, "max rounds"

def zrows(h, hr, lt):
    sc = 1.0 / max(abs(lt), 1e-7)
    zrow = np.zeros((2, X)); zrow[0, :NH] = h.real * sc; zrow[1, :NH] = h.imag * sc
    return zrow, np.array([hr.real, hr.imag]) * sc

def run_unc(job):
    k, gam, eta = job
    t0 = time.time()
    h, hr, lt, lm = zero_row(complex(0.5 + eta, gam))
    zrow, zr = zrows(h, hr, lt)
    nv = X + 1
    zc = np.hstack([zrow, zr[:, None]])
    lb = np.full(nv, 1 - BOX); ub = np.full(nv, 1 + BOX); lb[0] = ub[0] = 1.0; lb[X] = 0.0; ub[X] = 4.0
    z, d, sl, info = solve_lp(A, np.zeros(A.shape[0]), zc, np.zeros(2), lb, ub, "unc")
    out = dict(cls="unc", k=k, gamma=gam, eta=eta, delta=d, delta_lp_lower=LAST.get("d_lp"), slack=sl, info=info, sec=time.time() - t0,
               lam_zeta_scaled=abs(lt), afe_check=abs(lt - lm))
    if z is not None:
        out.update(feasible=bool(sl < 1e-9), r=float(z[X]), a_first=[float(t) for t in z[:12]], max_dev=float(np.max(np.abs(z[:X] - 1))),
                   l1_dev_over_X=float(np.sum(np.abs(z[:X] - 1)) / X), zero_res=float(np.max(np.abs(zc @ z))))
    print(json.dumps(out), flush=True)
    return out

# ---------- multiplicative class ----------
def prime_powers(X):
    sieve = np.ones(X + 1, bool); sieve[:2] = False
    for i in range(2, int(X ** 0.5) + 1):
        if sieve[i]: sieve[i * i::i] = False
    pp = []
    for p in np.where(sieve)[0]:
        q = int(p)
        while q <= X:
            pp.append((q, int(p))); q *= int(p)
    return pp

PP = None; FACT = None  # FACT[n] = list of indices into PP of the exact prime powers of n

def build_fact():
    global PP, FACT
    PP = prime_powers(X); idx = {q: i for i, (q, p) in enumerate(PP)}
    FACT = [[] for _ in range(X + 1)]
    for n in range(2, X + 1):
        m = n; p = 2
        while p * p <= m:
            if m % p == 0:
                q = 1
                while m % p == 0: m //= p; q *= p
                FACT[n].append(idx[q])
            p += 1
        if m > 1: FACT[n].append(idx[m])

def a_of_v(v):
    a = np.ones(X)
    for n in range(2, X + 1):
        t = 1.0
        for i in FACT[n]: t *= v[i]
        a[n - 1] = t
    return a

def jac(v, a):
    J = np.zeros((X, len(PP)))
    for n in range(2, X + 1):
        f = FACT[n]
        for i in f:
            t = 1.0
            for j in f:
                if j != i: t *= v[j]
            J[n - 1, i] = t
    return J

def run_mult(job):
    k, gam, eta = job
    t0 = time.time()
    h, hr, lt, lm = zero_row(complex(0.5 + eta, gam))
    P = len(PP)
    zrow, zr = zrows(h, hr, lt)
    v = np.ones(P); r = 1.0; a = a_of_v(v)
    res0 = float(np.abs(zrow @ a + zr * r).sum()); d0, _ = sup_defect(a, r)
    merit = d0 + MU * res0
    tau = 1.0; hist = [[-1, None, d0, res0, tau]]
    for it in range(40):
        if time.time() - t0 > 2 * JOBT: break
        J = jac(v, a)
        AJ = A[:, :X] @ J
        const = A[:, :X] @ a - AJ @ v
        Acols = np.hstack([AJ, A[:, X:X + 1]])
        zJ = zrow @ J
        zc = np.hstack([zJ, zr[:, None]]); zconst = zrow @ a - zJ @ v
        lb = np.concatenate([np.maximum(v - tau, 0.0), [0.0]]); ub = np.concatenate([np.minimum(v + tau, 2.0), [4.0]])
        z, d_lin, sl, info = solve_lp(Acols, const, zc, zconst, lb, ub, "mult")
        if z is None:
            hist.append([it, "fail " + info, None, None, tau]); break
        v2 = z[:P].copy(); r2 = float(z[P])
        if sl < 1e-9:   # Newton polish of the zero equations, least-norm steps
            for _ in range(6):
                a2 = a_of_v(v2); rs = zrow @ a2 + zr * r2
                if np.max(np.abs(rs)) < 1e-13: break
                J2 = jac(v2, a2); G = np.hstack([zrow @ J2, zr[:, None]])
                step = -G.T @ np.linalg.solve(G @ G.T, rs)
                v2 = np.clip(v2 + step[:P], 0.0, 2.0); r2 += step[P]
        a2 = a_of_v(v2); res = float(np.abs(zrow @ a2 + zr * r2).sum())
        d_true, _ = sup_defect(a2, r2)
        m2 = d_true + MU * res
        hist.append([it, d_lin, d_true, res, tau])
        if m2 < merit * (1 - 1e-4):
            rel = (merit - m2) / merit
            v, r, a, merit = v2, r2, a2, m2
            if rel < 2e-3 and res < 1e-10: break
        else:
            tau /= 3
            if tau < 1e-4: break
    a = a_of_v(v); res = float(np.abs(zrow @ a + zr * r).sum()); d, _ = sup_defect(a, r)
    sel = [i for i, (q, p) in enumerate(PP) if q == p and p <= 100]
    lp_ = np.array([math.log(PP[i][0]) for i in sel]); dv = v[sel] - 1
    slope = float(lp_ @ dv / (lp_ @ lp_)); fit_res = float(np.linalg.norm(dv - slope * lp_) / (np.linalg.norm(dv) + 1e-300))
    out = dict(cls="mult", k=k, gamma=gam, eta=eta, sec=time.time() - t0, lam_zeta_scaled=abs(lt), afe_check=abs(lt - lm),
               delta=d, zero_res=res, feasible=bool(res < 1e-9), r=r, iters=len(hist) - 1,
               tangent=hist[1][1:4] if len(hist) > 1 else None,
               v_small={str(PP[i][0]): float(v[i]) for i in range(P) if PP[i][0] <= 32},
               max_dev_v=float(np.max(np.abs(v - 1))), n_at_bound=int(np.sum((v < 1e-9) | (v > 2 - 1e-9))),
               shift_slope=slope, shift_fit_rel_res=fit_res, hist=hist[-6:])
    print(json.dumps(out), flush=True)
    return out

def shift_bench():
    res = []
    n = np.arange(1, X + 1, dtype=np.float64)
    for al in [1e-4, 1e-3, 1e-2, 1e-1]:
        a = n ** al
        col = A[:, X]; base = A[:, :X] @ a
        # best r by LP in one variable (golden search on sup norm, convex)
        lo, hi = 0.0, 4.0
        for _ in range(80):
            m1 = lo + (hi - lo) * 0.382; m2 = lo + (hi - lo) * 0.618
            if np.max(np.abs(base + col * m1)) < np.max(np.abs(base + col * m2)): hi = m2
            else: lo = m1
        rr = (lo + hi) / 2
        res.append(dict(alpha=al, r=rr, delta=float(np.max(np.abs(base + col * rr)))))
    return res

def init():
    pass

if __name__ == "__main__":
    mode = sys.argv[1]; outname = sys.argv[2]
    nw = int(os.environ.get("RH_WORKERS", "4"))
    t0 = time.time()
    A, META = build_A()
    build_fact()
    d0, _ = sup_defect(np.ones(X), 1.0)
    print(f"X={X} theta0={TH0} rho_min={RHO_MIN:.3e} rows={A.shape[0]} primepowers={len(PP)} zeta_defect={d0:.3e} build_sec={time.time()-t0:.1f}", flush=True)
    sb = shift_bench(); print("shift", json.dumps(sb), flush=True)
    pairs = [(1, 17.578382390253125), (13, 60.08941126360608), (19, 76.42476538397936), (24, 88.11719291037984),
             (27, 95.2609891343826), (34, 111.45209736008115), (40, 123.60182392394918)]
    etas = [0.01, 0.05, 0.1, 0.2, 0.3, 0.45]
    if mode == "test":
        pairs = [pairs[0], pairs[5]]; etas = [0.01, 0.3]
    jobs = [(k, g, e) for k, g in pairs for e in etas]
    ujobs = [j for j in jobs if j[0] in (1, 24, 27, 34) and j[1] and j[2] in (0.01, 0.1, 0.3, 0.45)] if mode == "main" else jobs
    if mode == "main4k":
        ujobs = [j for j in jobs if j[0] in (13, 24, 27, 34) and j[2] in (0.01, 0.1, 0.3, 0.45)]
        jobs = [j for j in jobs if j[0] in (27, 34) and j[2] in (0.01, 0.1, 0.3, 0.45)]
    if nw == 1:
        rm = [run_mult(j) for j in jobs]; ru = [run_unc(j) for j in ujobs]
    else:
        with Pool(nw) as pool:
            rm = pool.map(run_mult, jobs, chunksize=1)
        with Pool(int(os.environ.get('FE_UW', max(1, nw // 2)))) as pool:
            ru = pool.map(run_unc, ujobs, chunksize=1)
    json.dump(dict(X=X, theta0=TH0, box=BOX, rho_min=RHO_MIN, rows=int(A.shape[0]), zeta_defect=d0, shift=sb, mult=rm, unc=ru,
                   total_sec=time.time() - t0), open(outname, "w"), indent=1)
    print("done", time.time() - t0, flush=True)
