"""c3-multiwindow-converse-defect: joint FE test in m windows for completely multiplicative unimodular a(n) = prod chi(p)^k.
Model (round-2 afe.py): defect rows A_X(s)[a] - A_1(s)[a], s = 1/2 + it on K points of [T_j, T_j + H], X on J log-uniform points of
[1/R_j, R_j], R_j = N/(1.6 q_j), q_j = sqrt(T_j/2pi), N = round(3.2 q(T_top)).  Zero block (window 0, s0 = 1/2 + delta + i(T+H/2)):
value A_1(s0)[a] and its X-independence rows.  Unknown: theta_p real, p <= N.  Nonlinear least squares, multi-start.
usage: mw.py T layout(cluster|geom) [mmax]"""
import numpy as np, json, sys, time
from scipy.optimize import least_squares
from afe import coeff_rows
C0 = 1.6; H = 2.0; J = 25; DT = 0.1; K = int(round(H / DT)) + 1
DELTAS = [0.02, 0.05, 0.1, 0.25, 0.4]
MS = [1, 2, 4, 8, 16]

def primes_upto(N):
    s = np.ones(N + 1, bool); s[:2] = False
    for i in range(2, int(N**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return [int(p) for p in np.nonzero(s)[0]]

def vdc(m):
    out = [0.0, 1.0]; k = 2
    while len(out) < m:
        out += [(2 * i + 1) / k for i in range(k // 2)]; k *= 2
    return out[:m]

def heights(T, layout, m):
    f = vdc(max(m, 2))[:m]
    if layout == "cluster": return [T * (1 - 0.5 * x) for x in f]          # in [T/2, T]
    if layout == "geom": return [T * (100.0 / T)**x for x in f]            # in [100, T], log-uniform
    raise ValueError

def xgrid(Tj, N):
    q = np.sqrt(Tj / (2 * np.pi)); R = N / (C0 * q)
    return np.exp(np.linspace(-np.log(R), np.log(R), J))

def window_rows(Tj, N, ts=None):
    Xs = xgrid(Tj, N); j1 = J // 2
    ts = np.linspace(Tj, Tj + H, K) if ts is None else ts
    r1, r2 = [], []
    for t in ts:
        c1, c2 = coeff_rows(complex(0.5, t), Xs, N)
        r1.append(np.delete(c1, j1, 0) - c1[j1]); r2.append(np.delete(c2, j1, 0) - c2[j1])
    return np.vstack(r1), np.vstack(r2)

def zero_rows(T, N, delta):
    Xs = xgrid(T, N); j1 = J // 2; s0 = complex(0.5 + delta, T + H / 2)
    c1, c2 = coeff_rows(s0, Xs, N)
    return c1[j1], c2[j1], np.delete(c1, j1, 0) - c1[j1], np.delete(c2, j1, 0) - c2[j1]

def realmap(D1, D2):
    """rows r = D1 a + D2 conj a  ->  real matrix on [Re a, Im a]"""
    S = D1 + D2; Dm = D1 - D2
    return np.vstack([np.hstack([S.real, -Dm.imag]), np.hstack([S.imag, Dm.real])])

def compress(M):
    return np.linalg.qr(M, mode="r") if M.shape[0] > M.shape[1] else M

def expo_matrix(N, ps):
    E = np.zeros((N, len(ps)))
    for i, p in enumerate(ps):
        pk = p
        while pk <= N:
            E[pk - 1::pk, i] += 1; pk *= p
    return E

def avec(theta, E):
    ph = E @ theta; return np.concatenate([np.cos(ph), np.sin(ph)])

def make_fun(Rm, E):
    N = E.shape[0]
    def f(th): return Rm @ avec(th, E)
    def jac(th):
        ph = E @ th; return Rm[:, :N] @ (-np.sin(ph)[:, None] * E) + Rm[:, N:] @ (np.cos(ph)[:, None] * E)
    return f, jac

if __name__ == "__main__":
    T = float(sys.argv[1]); layout = sys.argv[2]; mmax = int(sys.argv[3]) if len(sys.argv) > 3 else 16
    tag = f"{layout}_T{T:g}"; rng = np.random.default_rng(1)
    N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = primes_upto(N); P = len(ps); E = expo_matrix(N, ps); logp = np.log(ps)
    hs = heights(T, layout, mmax); rows = K * (J - 1)
    print(f"planned: T={T:g} N={N} P={P} windows={len(hs)}; full rows {len(hs)*rows} x {N} complex x2 = {len(hs)*rows*N*32/1e6:.0f} MB; "
          f"weights chunk 4000 x 2401 complex = {4000*2401*16/1e6:.0f} MB", flush=True)
    t0 = time.time(); full = []; comp = []
    for Tj in hs:
        D1, D2 = window_rows(Tj, N); full.append((D1, D2)); comp.append(compress(realmap(D1, D2)))
        print(f"  window T_j={Tj:.3f} built, {time.time()-t0:.0f}s", flush=True)
    zb = {d: zero_rows(T, N, d) for d in DELTAS}
    ones = np.zeros(P); out = open(f"mw_{tag}.jsonl", "a"); surv = {}
    def maxdef(th, m):
        a = np.exp(1j * (E @ th)); return max(float(np.abs(D1 @ a + D2 @ np.conj(a)).max()) for D1, D2 in full[:m])
    def Fval(th, d):
        a = np.exp(1j * (E @ th)); o1, o2, z1, z2 = zb[d]
        return complex(o1 @ a + o2 @ np.conj(a)), float(np.abs(z1 @ a + z2 @ np.conj(a)).max())
    for m in [x for x in MS if x <= mmax]:
        Rm = compress(np.vstack(comp[:m])); f, jac = make_fun(Rm, E)
        # linearisation at zeta: unimodular (P real) and non-multiplicative (2(N-1) real)
        sv = np.linalg.svd(jac(ones), compute_uv=False)
        cols = np.r_[1:N, N + 1:2 * N]; svn = np.linalg.svd(Rm[:, cols], compute_uv=False)
        rec = dict(T=T, layout=layout, m=m, N=N, P=P, heights=hs[:m], zeta_maxdef=maxdef(ones, m),
                   jac_rank=[int((sv > 1e-5).sum()), int((sv > 1e-8).sum()), P], jac_smin=float(sv[-1]), jac_s=[float(x) for x in sv[-3:]],
                   nonmult_rank=[int((svn > 1e-5).sum()), int((svn > 1e-8).sum()), 2 * (N - 1)])
        # translate scan: a(n) = n^{-i alpha}
        als = np.linspace(-60, 60, 48001); best = []
        tr = np.array([np.linalg.norm(f(-al * logp)) for al in als])
        loc = [i for i in range(1, len(als) - 1) if tr[i] < tr[i - 1] and tr[i] < tr[i + 1] and abs(als[i]) > 0.05]
        loc.sort(key=lambda i: tr[i]); tstarts = []
        for i in loc[:6]:
            r = least_squares(lambda x: f(-x[0] * logp), [als[i]], xtol=1e-15, ftol=1e-15, gtol=1e-15)
            tstarts.append(float(r.x[0])); best.append([float(r.x[0]), maxdef(-r.x[0] * logp, m)])
        rec["translates"] = sorted(best, key=lambda x: x[1])[:4]
        # zero search
        rec["zero"] = {}
        for d in DELTAS:
            o1, o2, z1, z2 = zb[d]; Z = np.vstack([realmap(o1[None, :], o2[None, :]), realmap(z1, z2)])
            fz, jz = make_fun(np.vstack([Rm, Z]), E)
            starts = [("zeta", ones)] + [(f"tr{a:.3f}", -a * logp) for a in tstarts[:4]]
            starts += [(f"pert{s}", s * rng.standard_normal(P)) for s in (0.1, 0.3, 1.0) for _ in range(4)]
            starts += [("rand", rng.uniform(-np.pi, np.pi, P)) for _ in range(6)]
            if (m // 2, d) in surv: starts.insert(0, ("prev", surv[(m // 2, d)]))
            bestr = None
            for name, th0 in starts:
                r = least_squares(fz, th0, jac=jz, method="trf", xtol=1e-15, ftol=1e-15, gtol=1e-15, max_nfev=400)
                Fv, zx = Fval(r.x, d); md = maxdef(r.x, m); score = max(md, abs(Fv), zx)
                if bestr is None or score < bestr["score"]:
                    bestr = dict(score=score, start=name, maxdef=md, absF=abs(Fv), s0_xindep=zx, l2=float(np.linalg.norm(r.fun)), theta=r.x.copy())
            surv[(m, d)] = bestr["theta"]; np.save(f"surv_{tag}_m{m}_d{d}.npy", bestr["theta"])
            th = bestr.pop("theta"); bestr["max_abs_chi_minus_1"] = float(np.abs(np.exp(1j * th) - 1).max())
            bestr["abs_zeta_s0"] = abs(Fval(ones, d)[0]); rec["zero"][str(d)] = bestr
            print(f"m={m} delta={d}: score={bestr['score']:.2e} maxdef={bestr['maxdef']:.2e} |F|={bestr['absF']:.2e} start={bestr['start']}", flush=True)
        # controls (FE defect only, max over the m windows)
        n = np.arange(1, N + 1); Om = E.sum(1)
        def md_a(a): return max(float(np.abs(D1 @ a + D2 @ np.conj(a)).max()) for D1, D2 in full[:m])
        c = {}
        c["liouville"] = md_a((-1.0)**Om + 0j)
        c["U_random"] = float(np.median([maxdef(rng.uniform(-np.pi, np.pi, P), m) for _ in range(5)]))
        chi5 = np.array([0, 1, -1, -1, 1])[n % 5].astype(float)
        kap = (np.sqrt(10 - 2 * np.sqrt(5)) - 2) / (np.sqrt(5) - 1); dh = np.array([0, 1, kap, -kap, -1])[n % 5]
        c["DH_raw"] = md_a(dh + 0j); c["chi5_raw"] = md_a(chi5 + 0j)
        for nm, co in (("chi5", chi5), ("DH", dh)):
            bestc = None
            for Tj in hs[:m]:
                Tc = Tj + H / 2; a0 = -Tc * 0.8; per = 2 * np.pi / np.log(Tc / (2 * np.pi))
                ds = np.linspace(0, per, 400); rs = [md_a(co * n**(-1j * (a0 + x))) for x in ds]; i = int(np.argmin(rs))
                if bestc is None or rs[i] < bestc[1]: bestc = [a0 + ds[i], float(rs[i])]
            c[nm + "_shifted_best"] = bestc
        rec["controls"] = c; rec["sec"] = round(time.time() - t0, 1)
        out.write(json.dumps(rec) + "\n"); out.flush()
        print(json.dumps({k: rec[k] for k in ("m", "jac_rank", "jac_smin", "nonmult_rank", "translates", "controls")}), flush=True)
