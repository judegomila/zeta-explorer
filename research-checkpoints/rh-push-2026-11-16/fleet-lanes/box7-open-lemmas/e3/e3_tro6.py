#!/usr/bin/env python3
"""E3: TRO6-natural, non-polar remainder at the manuscript geometry R = Q^1.4, with a ROW-SENSITIVE statistic.

Input (read-only): the refereed data of r2-tro6-nonpolar-scale: exact table of gamma_1, gamma_2 at the squarefree primary
conductors c prime to 6 with N(c) <= 1e7, and the sextic theta coefficient estimator rho_hat_sigma(-e0 m) for the
generic half rows N(m) <= 30000 (rows_XX.npz), 11 path points Q_k = 30000 * 2^(-(10-k)/2), R_k = Q_k^1.4.

Form (n = 1 part, S' empty, manuscript-type row beta = alpha nu):
   X_sigma(nu; rho) = sum_c nu(c) alpha(c) gamma_2(c) w_k(c) y_sigma(c; rho),   y_sigma(c; rho) = sum_{m <= Q_k} rho_sigma(m) chi_c(m),
   t = |X|^2 / sum_c |x(c)|^2,   r = |X| / (||rho_sigma|| ||B||)   (correlation against Cauchy-Schwarz).
Row vectors rho:  v = 0: the true estimator rows, with the exact leave-one-out self-term removed;
                  v = 1..K: SHUFFLED rows: the 12-vector rho(m) of each generic half row is given to another row of the same
                  bin and stratum (prime to 6 or not). Same marginals and norms, no arithmetic link to chi_c(m).
Polar law: variant 'loo' = no subtraction; variant 'band' = the component along the polar phase pred(c) =
gamma_1(c) conj chi_c(-e0) is projected out exactly on every (class of c, norm shell) cell. The same linear operator is
applied to the shuffled rows, which gives the projection baseline (referee E3 of r3-nonpolar-numerics).
Target families (unimodular nu): F1 all non-principal Dirichlet characters modulo the split primes pi, N(pi) <= PMAX;
F2 alpha^k N^{iv}, |k| <= 30, |v| <= 295; OPT completely multiplicative nu with free phases at the primes N(pi) <= POPT,
maximised by coordinate ascent (referee section 3). Row-sensitive statistics = sup over each family for the true rows
against the same sup for the shuffled rows.
One pass = all rows once (cumulative over the bins, so all 11 path points, smallest first) for the true rows and K
shuffles. Later passes add K new shuffles each. Results: one JSON line per (pass, path point) in results.jsonl.
Resumption: completed passes are skipped; inside a pass the accumulators are checkpointed after the bins in --ck-bins.
"""
import os, sys, math, time, json, argparse, glob
import multiprocessing as mp
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
T0 = time.time()


def P(*a):
    print(f"[{time.time() - T0:8.0f}s]", *a, flush=True)


ap = argparse.ArgumentParser()
ap.add_argument("--r2", type=str, default=os.path.expanduser("~/rh-push/r2-tro6-nonpolar-scale"))
ap.add_argument("--out", type=str, default=os.path.join(HERE, "out"))
ap.add_argument("--K", type=int, default=11)
ap.add_argument("--passes", type=int, default=2500)
ap.add_argument("--pmax", type=int, default=997)
ap.add_argument("--popt", type=int, default=1000)
ap.add_argument("--sweeps", type=int, default=4)
ap.add_argument("--rb", type=int, default=96)
ap.add_argument("--nproc", type=int, default=4)
ap.add_argument("--ck-bins", type=str, default="7,8,9")
ap.add_argument("--host-gb", type=float, default=7.0)
args = ap.parse_args()
os.environ["SEXTIC_DIR"] = os.path.join(args.r2, "sextic")
sys.path.insert(0, os.path.join(HERE, "sx"))
import alib as A, zomega as Z
import rows_nat as RN

cp = None
if os.environ.get("E_NOGPU", "0") != "1":
    try:
        import cupy as cp, cupyx
        cp.cuda.Device(0).use()
        cp.get_default_memory_pool().set_limit(size=int(float(os.environ.get("E_GPU_GB", "24")) * 1024 ** 3))
    except Exception as ex:
        print(f"cupy unavailable ({type(ex).__name__}: {ex}); numpy path", flush=True); cp = None
xp = cp if cp is not None else np


def tonp(a):
    return cp.asnumpy(a) if (cp is not None and isinstance(a, cp.ndarray)) else np.asarray(a)


def scat(nb, lab, D):
    """out[lab] += D along axis 0 (out: nb x D.shape[1])."""
    out = xp.zeros((nb, D.shape[1]), dtype=D.dtype)
    if cp is not None:                                                  # cupy scatter_add has no complex support: real and imaginary parts
        re = cp.zeros((nb, D.shape[1])); im = cp.zeros((nb, D.shape[1]))
        cupyx.scatter_add(re, lab, cp.ascontiguousarray(D.real)); cupyx.scatter_add(im, lab, cp.ascontiguousarray(D.imag))
        out = re + 1j * im
    else:
        for c in range(D.shape[1]):
            out[:, c] = np.bincount(lab, D[:, c].real, nb) + 1j * np.bincount(lab, D[:, c].imag, nb)
    return out


Z6 = Z.ZETA6
LUT = np.concatenate([Z6, [0]]).astype(np.complex64)
WCUT = 1.6
NA, NV, KA, JV = 1024, 4096, 30, 150
os.makedirs(args.out, exist_ok=True)
R2O = os.path.join(args.r2, "out")
stc = np.load(os.path.join(R2O, "static.npz")); nd = np.load(os.path.join(R2O, "nodes.npz"))
Qs = stc["Qs"]; Rs = stc["Rs"]; NB = len(Qs); grid = stc["grid"].astype(float); nsh = len(grid)
cop = [stc["cls_even"], stc["cls_odd"]]; ne = int(stc["ne"]); a_th = stc["a_th"]
types = [str(x) for x in stc["types"]]; TA = types.index("a")
QMAX = int(round(float(Qs[-1])))
perm = nd["perm"]; Np = nd["Np"]; clsp = nd["clsp"].astype(np.int64); shp = nd["shp"].astype(np.int64); pred = nd["pred"]
n = len(Np); Nf = Np.astype(float)
K = args.K; NV1 = 1 + K; NCOL = NV1 * 12                               # columns: (variant, stratum, class slot)
plan = dict(Ec_int8=0, PH_c64=args.rb * n * 8, EM_i16=n * 2 * 4, S_c128=n * NCOL * 16 + (n // 2) * NCOL * 8, row_tmp=(n // 2) * 24 * 24,
            stats_tmp=NA * NV * 6 * 16 * 4 + (n // 2) * (36 * 16 * 4 + 4 * 160))
ptot = plan["Ec_int8"] + plan["S_c128"] + max(plan["PH_c64"] + plan["row_tmp"] + plan["EM_i16"], plan["stats_tmp"])       # rows and statistics do not coexist
C = RN.Ctx(QMAX); T = C.T
gp = C.gp; npr = len(gp)
plan["Ec_int8"] = npr * n
ptot = plan["Ec_int8"] + plan["S_c128"] + max(plan["PH_c64"] + plan["row_tmp"] + plan["EM_i16"], plan["stats_tmp"])
P(f"E3 start: device {'GPU (cupy)' if cp is not None else 'numpy'}; nodes {n}, primes(norm<={QMAX}) {npr}, path points {NB}, K={K} shuffles per pass")
P("planned allocation (GB): " + ", ".join(f"{k} {v / 1e9:.2f}" for k, v in plan.items()) + f"; device peak {ptot / 1e9:.1f} GB "
  f"({'GPU' if cp is not None else 'host'}); host: table and row data about 2 GB + one snapshot 0.3 GB + one checkpoint array {(n // 2) * NCOL * 8 / 1e9:.1f} GB "
  f"+ the Ec file ({npr * n / 1e9:.1f} GB on disk, read once)")
lim = float(os.environ.get("E_GPU_GB", "24")) if cp is not None else args.host_gb
if ptot / 1e9 > lim:
    raise SystemExit(f"planned allocation above the limit {lim} GB: reduce --K or --rb")

# ---------------------------------------------------------------- exponent cache chi_c(pi) for the row primes
cpath = os.path.join(args.out, f"Ecache_{QMAX}.dat")
if not os.path.exists(cpath + ".done"):
    Ecw = np.memmap(cpath, dtype=np.int8, mode="w+", shape=(npr, n)); del Ecw

    def work(w):
        E = np.memmap(cpath, dtype=np.int8, mode="r+", shape=(npr, n))
        for i in range(w, npr, args.nproc):
            E[i] = T.node_exponents(gp[i][1])[perm]
        E.flush()
    t0 = time.time()
    try:
        mp.set_start_method("fork")
    except RuntimeError:
        pass
    ps = [mp.Process(target=work, args=(w,)) for w in range(args.nproc)]
    [p.start() for p in ps]; [p.join() for p in ps]
    assert all(p.exitcode == 0 for p in ps)
    open(cpath + ".done", "w").write("ok")
    P(f"exponent cache built: {npr} primes, {time.time() - t0:.0f}s")
Ech = np.memmap(cpath, dtype=np.int8, mode="r", shape=(npr, n))
if cp is not None:
    Ec = cp.empty((npr, n), dtype=np.int8)
    for s in range(0, npr, 64):
        Ec[s:s + 64] = cp.asarray(np.ascontiguousarray(Ech[s:s + 64]))
    del Ech
else:
    Ec = Ech
kpos = {k: i for i, (k, _) in enumerate(gp)}
e_zeta = xp.asarray(T.node_exponents(Z.UNITS[1])[perm].astype(np.int16))
e_lam = xp.asarray(T.node_exponents(Z.LAM)[perm].astype(np.int16))
e_two = xp.asarray(T.node_exponents((-2, 0))[perm].astype(np.int16))
dLUT = xp.asarray(LUT)

# ---------------------------------------------------------------- rows
rows = []
for j in range(NB):
    r = np.load(os.path.join(R2O, f"rows_{j:02d}.npz"))
    gen = ~r["six"]; fl = r["flags"]
    rows.append(dict(ms=r["ms"][gen], Nm=r["Nm"][gen], rho=(r["rho_str"] + r["rho_cor"])[gen],
                     st=np.where((fl[gen, 0] == 0) & (fl[gen, 1] == 0), 0, 1), B=r["B"][gen][:, :, :, TA]))
nrow = sum(len(x["Nm"]) for x in rows)
# row-side norms (conventions of r3-nonpolar-numerics/norms.py)
nr = np.zeros((NB, 3, 12)); nb = np.zeros((NB, 3)); cnt = np.zeros((NB, 3))
for j in range(NB):
    for k in range(j, NB):
        for s in (0, 1):
            m = rows[j]["st"] == s
            nr[k, s] += (np.abs(rows[j]["rho"][m]) ** 2).sum(0); cnt[k, s] += m.sum()
            nb[k, s] += (np.abs(rows[j]["B"][m, k]) ** 2).sum()
nr[:, 2] = nr[:, 0] + nr[:, 1]; nb[:, 2] = nb[:, 0] + nb[:, 1]; cnt[:, 2] = cnt[:, 0] + cnt[:, 1]
P(f"rows: {nrow} generic half rows; per bin {[len(x['Nm']) for x in rows]}")
# factorisations of the rows (python, once)
t0 = time.time()
for j in range(NB):
    rows[j]["fac"] = [C.factor((int(a), int(b))) for a, b in rows[j]["ms"]]
P(f"row factorisations {time.time() - t0:.0f}s")

# ---------------------------------------------------------------- node-side constants
nap = T.na[perm].astype(np.int64); nbp = T.nb[perm].astype(np.int64); g2p = T.g2[perm]
alpha = ((nap - nbp / 2.0) + 1j * (nbp * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
parp = ((Np - 1) // 6) % 2
key = parp * (nsh * 12) + shp * 12 + clsp
assert (np.diff(key) >= 0).all() and int((parp == 0).sum()) == ne
primes1 = [p for p in range(7, args.pmax + 1) if p % 3 == 1 and all(p % q for q in range(2, int(p ** 0.5) + 1))]
f1tab = []
for p in primes1:
    g = next(g for g in range(2, p) if len({pow(g, e, p) for e in range(1, p)}) == p - 1)
    dlog = np.full(p, p - 1, np.int64); x = 1
    for e in range(p - 1):
        dlog[x] = e; x = x * g % p
    for wr in [x for x in range(2, p) if (x * x + x + 1) % p == 0]:
        f1tab.append((p, wr, dlog))
optk = [kpos[k] for k, _ in gp if T.pq[k] <= args.popt]
ks2 = np.arange(-KA, KA + 1); js2 = np.arange(-JV, JV + 1)
k0i = int(np.flatnonzero(ks2 == 0)[0]); j0i = int(np.flatnonzero(js2 == 0)[0])
P(f"families: F1 {sum(p - 2 for p, _, _ in f1tab)} non-principal characters modulo {len(f1tab)} primes; F2 {len(ks2) * len(js2) - 1} twists; "
  f"OPT {len(optk)} free prime phases, {args.sweeps} sweeps")


def colidx(v, st):
    return v * 12 + st * 6 + np.arange(6)


def stats_point(k, S, selfacc):
    """statistics at path point k from the cumulative accumulators S = [even nodes x NCOL, odd nodes x NCOL]."""
    X = xp; R = Rs[k]
    s_lo = max(int(np.searchsorted(grid, R * math.exp(-WCUT), "left")), 1)
    s_hi = min(int(np.searchsorted(grid, R * math.exp(WCUT), "left")), nsh - 1)
    names = ["t_f1_max", "t_f1_mean", "t_f2_max", "t_f2_mean", "t_opt", "t00", "N0"]
    res = {nm: np.zeros((NV1, 2, 3, 12)) for nm in names}                  # [variant, polar variant, stratum, class]
    nwin = []
    for p in (0, 1):
        lo = int(np.searchsorted(key, p * nsh * 12 + s_lo * 12, "left")); hi = int(np.searchsorted(key, p * nsh * 12 + s_hi * 12 + 11, "right"))
        nw = hi - lo; nwin.append(nw); off = lo - (0 if p == 0 else ne)
        sl = slice(p * 6, p * 6 + 6)
        w = np.exp(-2 * np.log(Nf[lo:hi] / R) ** 2) / np.sqrt(Nf[lo:hi])
        bw = X.asarray(alpha[lo:hi] * g2p[lo:hi] * w)
        prd = X.asarray(pred[lo:hi]); cpd = X.conj(prd)
        cell = key[lo:hi] - key[lo]; ncell = int(cell.max()) + 1
        cc = np.bincount(cell, minlength=ncell).astype(float); cc[cc == 0] = 1
        dcell = X.asarray(cell); dcc = X.asarray(cc)
        cl = clsp[lo:hi]
        selfc = X.zeros((2, nw, 6))
        for i, sg in enumerate(cop[p]):
            msk = cl == sg
            for st in (0, 1):
                selfc[st, msk, i] = X.asarray(selfacc[st, lo:hi][msk])
        # F2 labels, F1 labels, OPT index lists
        ia = np.floor((np.angle(alpha[lo:hi]) + math.pi) / (2 * math.pi) * NA).astype(np.int64) % NA
        ib = np.clip(np.floor((np.log(Nf[lo:hi] / R) + WCUT) / (2 * WCUT) * NV).astype(np.int64), 0, NV - 1)
        lab2 = X.asarray(ia * NV + ib)
        lab1 = [X.asarray(dlog[np.mod(nap[lo:hi] + nbp[lo:hi] * wr, pp)].astype(np.int32)) for (pp, wr, dlog) in f1tab]
        oidx = [X.flatnonzero(X.asarray(Ec[kk, lo:hi]) < 0) for kk in optk]
        for v in range(NV1):
            y = X.empty((3, nw, 6), dtype=np.complex128)
            for st in (0, 1):
                y[st] = S[p][off:off + nw, colidx(v, st)]
                if v == 0:
                    y[st] -= prd[:, None] * selfc[st]
            y[2] = y[0] + y[1]
            D = X.empty((nw, 2, 3, 6), dtype=np.complex128)
            for st in range(3):
                Km = scat(ncell, dcell, y[st] * cpd[:, None]) / dcc[:, None]
                D[:, 0, st] = y[st] * bw[:, None]
                D[:, 1, st] = (y[st] - Km[dcell] * prd[:, None]) * bw[:, None]
            D = D.reshape(nw, 36)
            N0 = (X.abs(D) ** 2).sum(0)
            res["N0"][v][:, :, sl] = tonp(N0).reshape(2, 3, 6)
            # F1
            mx = X.zeros(36); sm = X.zeros(36); nch = 0
            for (pp, wr, dlog), lb in zip(f1tab, lab1):
                Ab = scat(pp, lb, D)
                Nn = N0 - (X.abs(D[lb == pp - 1]) ** 2).sum(0)
                t = X.abs(X.fft.ifft(Ab[:pp - 1], axis=0) * (pp - 1)) ** 2 / Nn
                mx = X.maximum(mx, t[1:].max(0)); sm += t[1:].sum(0); nch += pp - 2
            res["t_f1_max"][v][:, :, sl] = tonp(mx).reshape(2, 3, 6); res["t_f1_mean"][v][:, :, sl] = tonp(sm / max(nch, 1)).reshape(2, 3, 6)
            # F2
            mx = np.zeros(36); sm = np.zeros(36); t00 = np.zeros(36)
            for c0 in range(0, 36, 6):
                Ab = scat(NA * NV, lab2, D[:, c0:c0 + 6]).reshape(NA, NV, 6)
                F = X.fft.fft2(Ab, axes=(0, 1))
                del Ab
                t = X.abs(F[X.asarray(ks2 % NA)][:, X.asarray(js2 % NV)]) ** 2 / N0[c0:c0 + 6]
                t00[c0:c0 + 6] = tonp(t[k0i, j0i]); t[k0i, j0i] = 0
                mx[c0:c0 + 6] = tonp(t.max((0, 1))); sm[c0:c0 + 6] = tonp(t.sum((0, 1))) / (t.shape[0] * t.shape[1] - 1)
                del F, t
            res["t_f2_max"][v][:, :, sl] = mx.reshape(2, 3, 6); res["t_f2_mean"][v][:, :, sl] = sm.reshape(2, 3, 6); res["t00"][v][:, :, sl] = t00.reshape(2, 3, 6)
            # OPT: coordinate ascent on the prime phases, start nu = 1
            nu = X.ones((nw, 36), dtype=np.complex128); Xs = D.sum(0)
            for sw in range(args.sweeps):
                for idx in oidx:
                    if len(idx) == 0:
                        continue
                    Bv = (nu[idx] * D[idx]).sum(0); Av = Xs - Bv
                    rot = X.where((X.abs(Av) > 0) & (X.abs(Bv) > 0), (Av / X.maximum(X.abs(Av), 1e-300)) * X.conj(Bv / X.maximum(X.abs(Bv), 1e-300)), 1.0)
                    nu[idx] *= rot[None, :]; Xs = Av + rot * Bv
            res["t_opt"][v][:, :, sl] = tonp(X.abs(Xs) ** 2 / N0).reshape(2, 3, 6)
            del D, y, nu
        del lab1, lab2, oidx, bw, prd, cpd, selfc
        if cp is not None:
            cp.get_default_memory_pool().free_all_blocks()
    # correlations against Cauchy-Schwarz: r^2 = t * N0 / (||rho_sigma||^2 ||B||^2)
    sig = np.concatenate([cop[0], cop[1]])
    rn2 = res["N0"] / (nr[k][:, sig][None, None] * nb[k][None, None, :, None])   # [variant, polar variant, stratum, class]
    out = dict(nw=nwin, rnull_sqrt_rows=np.sqrt(rn2.mean(-1) * 2 * cnt[k][None, None]).tolist())
    for nm in ("t_f1_max", "t_f2_max"):
        out[nm.replace("t_", "r_")] = np.sqrt((res[nm] * rn2).max(-1)).tolist(); out[nm] = res[nm].max(-1).tolist()
    for nm in ("t_f1_mean", "t_f2_mean", "t_opt", "t00"):
        out[nm.replace("t_", "r_")] = np.sqrt((res[nm] * rn2).mean(-1)).tolist(); out[nm] = res[nm].mean(-1).tolist()
    out["polar_share"] = (1 - res["N0"][:, 1].sum(-1) / res["N0"][:, 0].sum(-1)).tolist()                    # [variant, stratum]
    return out


def r6(x):
    """round nested lists of floats to 6 significant digits (results.jsonl stays small)."""
    if isinstance(x, list):
        return [r6(v) for v in x]
    return float(f"{x:.6g}") if isinstance(x, float) else x


def run_pass(ip):
    X = xp
    rng = np.random.default_rng(777000 + ip)
    # shuffles within (bin, stratum)
    rho = []
    for j in range(NB):
        r0 = rows[j]["rho"]; st = rows[j]["st"]
        rv = np.empty((NV1,) + r0.shape, dtype=np.complex128); rv[0] = r0
        for v in range(1, NV1):
            pm = np.arange(len(st))
            for s in (0, 1):
                ii = np.flatnonzero(st == s); pm[ii] = ii[rng.permutation(len(ii))]
            rv[v] = r0[pm]
        rho.append(rv)
    S = [X.zeros((ne, NCOL), dtype=np.complex128), X.zeros((n - ne, NCOL), dtype=np.complex128)]
    jstart = 0
    ckf = os.path.join(args.out, "ck_pass.json")
    if os.path.exists(ckf):
        d = json.load(open(ckf))
        if d["ip"] == ip and d["K"] == K and d["n"] == n:
            for p_ in (0, 1):                                              # one array at a time: bounded host memory
                S[p_] = X.asarray(np.load(os.path.join(args.out, f"ck_S{p_}.npy"))).astype(np.complex128)
            jstart = d["j"] + 1
            P(f"pass {ip}: resumed from the checkpoint after bin {jstart - 1}")
    ckbins = {int(x) for x in args.ck_bins.split(",") if x != ""}
    for j in range(jstart, NB):
        t0 = time.time()
        fac = rows[j]["fac"]; st = rows[j]["st"]; nrj = len(st)
        for s in range(0, nrj, args.rb):
            e = min(nrj, s + args.rb)
            PH = X.empty((e - s, n), dtype=np.complex64)
            for i in range(s, e):
                a, b, u, fc = fac[i]
                em = u * e_zeta + a * e_lam + b * e_two
                bad = X.zeros(n, dtype=bool)
                for (kk, ee) in fc:
                    ep = X.asarray(Ec[kpos[kk]]); bad |= ep < 0; em = em + ee * ep.astype(np.int16)
                PH[i - s] = dLUT[X.where(bad, 6, em % 6)]
            for p in (0, 1):
                Cm = np.zeros((e - s, NCOL), dtype=np.complex64)
                for v in range(NV1):
                    for s_ in (0, 1):
                        m = st[s:e] == s_
                        Cm[np.flatnonzero(m)[:, None], colidx(v, s_)[None, :]] = rho[j][v][s:e][m][:, cop[p]]
                blk = PH[:, :ne] if p == 0 else PH[:, ne:]
                dC = X.asarray(Cm)
                for c0 in range(0, NCOL, 24):                              # column slices: bounded temporaries (0.8 GB)
                    S[p][:, c0:c0 + 24] += blk.T @ dC[:, c0:c0 + 24]
                del dC
            del PH
        tr = time.time() - t0
        if cp is not None:
            cp.get_default_memory_pool().free_all_blocks()
        sn = np.load(os.path.join(R2O, f"snap_{j:02d}.npz"))
        selfacc = sn["selfacc"]
        valid = None
        if ip == 0:                                                         # true rows must reproduce the stored twisted sums of r2
            Sref = sn["S"]
            d0 = max(float(np.abs(tonp(S[0][:, colidx(0, s_)]) - Sref[s_, :ne]).max()) for s_ in (0, 1))
            d1 = max(float(np.abs(tonp(S[1][:, colidx(0, s_)]) - Sref[s_, ne:]).max()) for s_ in (0, 1))
            valid = max(d0, d1); del Sref
        t1 = time.time()
        out = stats_point(j, S, selfacc)
        rec = dict(exp="E3", **{"pass": ip}, k=j, Q=float(Qs[j]), R=float(Rs[j]), K=K, rows=int(cnt[j, 2]), sec_rows=tr, sec_stats=time.time() - t1,
                   valid_maxdiff=valid, gpu=cp is not None, **{k_: r6(v_) for k_, v_ in out.items()})
        with open(os.path.join(args.out, "results.jsonl"), "a") as fh:
            fh.write(json.dumps(rec) + "\n")
        P(f"pass {ip} point {j} Q={Qs[j]:.0f}: rows {tr:.0f}s, stats {time.time() - t1:.0f}s" + (f", max |S - S_r2| = {valid:.2e}" if valid is not None else "") +
          f"; band/all: r_sup(F1+F2) true {max(out['r_f1_max'][0][1][2], out['r_f2_max'][0][1][2]):.5f}, shuffled mean "
          f"{np.mean([max(out['r_f1_max'][v][1][2], out['r_f2_max'][v][1][2]) for v in range(1, NV1)]):.5f}; t_opt true {out['t_opt'][0][1][2]:.1f}, shuffled "
          f"{np.mean([out['t_opt'][v][1][2] for v in range(1, NV1)]):.1f}")
        if j in ckbins and j < NB - 1:
            if os.path.exists(ckf):
                os.remove(ckf)
            for p_ in (0, 1):                                              # complex64 on the device, one array at a time (1.6 GB of host memory each)
                h = tonp(S[p_].astype(np.complex64))
                np.save(os.path.join(args.out, f"ck_S{p_}.tmp.npy"), h); del h
                os.replace(os.path.join(args.out, f"ck_S{p_}.tmp.npy"), os.path.join(args.out, f"ck_S{p_}.npy"))
            json.dump(dict(ip=ip, K=K, n=n, j=j), open(ckf + ".tmp", "w")); os.replace(ckf + ".tmp", ckf)
            P(f"pass {ip}: checkpoint after bin {j}")
    for f_ in (ckf, os.path.join(args.out, "ck_S0.npy"), os.path.join(args.out, "ck_S1.npy")):
        if os.path.exists(f_):
            os.remove(f_)
    with open(os.path.join(args.out, "passes_done.txt"), "a") as fh:
        fh.write(f"{ip}\n")


done = set()
pd = os.path.join(args.out, "passes_done.txt")
if os.path.exists(pd):
    done = {int(x) for x in open(pd).read().split()}
for ip in range(args.passes):
    if ip in done:
        continue
    run_pass(ip)
P("E3 ALLDONE")
