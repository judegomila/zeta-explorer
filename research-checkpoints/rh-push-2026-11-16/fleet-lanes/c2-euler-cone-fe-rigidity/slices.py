"""Decisive test, second form.  Same windowed-FE constraint as cone_lp.py (build).  Three computations per (T, H, EPS):
 (1) translate family: a(n) = n^(-i alpha_k), alpha_k = 2 pi k / log(Tc/2 pi), Tc = T + H/2 (unitary point masses at every p,
     so an element of the cone).  Report the FE residual and |zeta(s0 + i alpha_k) - zeta(s0)|.
 (2) convex slice through each translate: p <= sqrt(N) fixed at p^(-i alpha), a(p) = p^(-i alpha) c_p for sqrt(N) < p <= N with
     c_p in the inscribed 64-gon of the unit disk with a vertex at 1 (exact cone elements).  LP: feasibility at tolerance EPS,
     support values of F(s0) - zeta(s0), feasibility of F(s0) = 0.
 (3) tangent cone at zeta with ALL primes free: mu_p = (1 - sum w) delta_1 + sum_i w_i delta_{z_i}, z_i the 64th roots of unity,
     first order in w (delta a = 1 * delta b, delta b(p^k) = sum_i w_i (z_i^k - 1)/k).  LP width of delta F(s0).  First-order only.
 (0) relaxed model (a(n) in the box, no multiplicativity) for the outer bound."""
import numpy as np, json, sys, time
from scipy.optimize import linprog
from cone_lp import build, primes_upto, real_map, C0
NG = 64
OPT = dict(primal_feasibility_tolerance=1e-9, dual_feasibility_tolerance=1e-9)
add = lambda u, v: None if u is None else float(u + v)

def lp_support(Cmat, rhs0, Ore, Oim, o0, EPS, d, poly_rows=None, bounds=None, want_zero=True):
    A = [Cmat, -Cmat]; b = [EPS - rhs0, EPS + rhs0]
    if poly_rows is not None: A.append(poly_rows[0]); b.append(poly_rows[1])
    A = np.vstack(A); b = np.concatenate(b)
    res = {}
    for name, vec in (("+re", Ore[0]), ("-re", -Ore[0]), ("+im", Oim[0]), ("-im", -Oim[0])):
        r = linprog(-vec, A_ub=A, b_ub=b, bounds=bounds, method="highs", options=OPT)
        if r.status == 2: return dict(feasible=False)
        if r.status != 0: res[name] = None; continue
        res[name] = r.x
    out = dict(feasible=True, x=res)
    if want_zero:
        A2 = np.vstack([A, Ore, -Ore, Oim, -Oim])
        b2 = np.concatenate([b, [EPS - o0.real, EPS + o0.real, EPS - o0.imag, EPS + o0.imag]])
        r = linprog(np.zeros(A.shape[1]), A_ub=A2, b_ub=b2, bounds=bounds, method="highs", options=OPT)
        out["zero_feasible"] = bool(r.status == 0)
    return out

def run(T, H, EPS, ratio, ks, J=7, dt=0.4, tangent=True):
    K = max(4, int(np.ceil(H / dt)) + 1)
    q = np.sqrt(T / (2 * np.pi)); N = int(round(ratio * q))
    print(f"planned: T={T} H={H} K={K} N={N}; constraint matrix {2*(K+1)*(J-1)} x {2*N} float64 = {2*(K+1)*(J-1)*2*N*8/1e6:.2f} MB; tangent LP {4*(K+1)*(J-1)} x {63*len(primes_upto(N))} = {4*(K+1)*(J-1)*63*len(primes_upto(N))*8/1e6:.1f} MB", flush=True)
    b = build(T, H, K, N, J)
    D1, D2, o1, o2 = b["D1"], b["D2"], b["o1"], b["o2"]
    n = np.arange(1, N + 1); ones = np.ones(N, complex)
    oz = o1 @ ones + o2 @ ones
    rec = dict(T=T, H=H, K=K, EPS=EPS, N=N, q=float(q), abs_zeta_s0=float(abs(oz)), zeta_trunc_residual=float(np.abs(D1 @ ones + D2 @ ones).max()))
    ps = primes_upto(N); sq = int(np.floor(np.sqrt(N))); bigp = [p for p in ps if p > sq]; col = {p: i for i, p in enumerate(bigp)}
    rec["n_primes"] = len(ps); rec["n_big_primes"] = len(bigp); rec["n_primes_le_c0q"] = int(sum(p <= C0 * q for p in ps))
    # (0) relaxed
    d = N - 1; B = np.zeros((N, d), complex); B[np.arange(1, N), np.arange(d)] = 1
    a0 = np.zeros(N, complex); a0[0] = 1
    Cre, Cim = real_map(D1, D2, B); Cmat = np.vstack([Cre, Cim]); r0 = D1 @ a0 + D2 @ np.conj(a0)
    sv = np.linalg.svd(Cmat, compute_uv=False); rec["relaxed_rank_eps"] = int((sv > EPS).sum()); rec["relaxed_real_dim"] = 2 * d
    Ore, Oim = real_map(o1[None, :], o2[None, :], B); o0 = o1 @ a0 + o2 @ np.conj(a0)
    r = lp_support(Cmat, np.concatenate([r0.real, r0.imag]), Ore, Oim, o0, EPS, d, bounds=[(-1, 1)] * (2 * d))
    def widths(r, Ore, Oim):
        x = r["x"]; g = lambda nm, M: float(M[0] @ x[nm]) if x.get(nm) is not None else None
        return [g("+re", Ore), g("-re", Ore), g("+im", Oim), g("-im", Oim)]
    w = widths(r, Ore, Oim); rec["relaxed"] = dict(feasible=r["feasible"], re_range=[add(w[1], o0.real - oz.real), add(w[0], o0.real - oz.real)], im_range=[add(w[3], o0.imag - oz.imag), add(w[2], o0.imag - oz.imag)], zero_feasible=r.get("zero_feasible"))
    # largest prime factor structure
    lpf = np.zeros(N + 1, int)
    for p in ps: lpf[p::p] = p
    isbig = lpf[1:] > sq
    # (1)+(2) translates and slices
    Tc = T + H / 2; rec["translates"] = []
    ph = (2 * np.arange(NG) + 1) * np.pi / NG; dbig = len(bigp)
    poly = (np.vstack([np.hstack([np.cos(p_) * np.eye(dbig), np.sin(p_) * np.eye(dbig)]) for p_ in ph]), np.full(NG * dbig, np.cos(np.pi / NG)))
    for k in ks:
        alpha = 2 * np.pi * k / np.log(Tc / (2 * np.pi))
        a = n**(-1j * alpha)
        resid = float(np.abs(D1 @ a + D2 @ np.conj(a)).max()); val = o1 @ a + o2 @ np.conj(a)
        B = np.zeros((N, dbig), complex); a0 = np.where(isbig, 0, a)
        for i in range(N):
            if isbig[i]: B[i, col[lpf[i + 1]]] = a[i]
        Cre, Cim = real_map(D1, D2, B); Cmat = np.vstack([Cre, Cim]); r0 = D1 @ a0 + D2 @ np.conj(a0)
        Ore, Oim = real_map(o1[None, :], o2[None, :], B); o0 = o1 @ a0 + o2 @ np.conj(a0)
        r = lp_support(Cmat, np.concatenate([r0.real, r0.imag]), Ore, Oim, o0, EPS, dbig, poly_rows=poly, bounds=[(None, None)] * (2 * dbig))
        t = dict(k=k, alpha=float(alpha), translate_resid=resid, translate_dev=float(abs(val - oz)), slice_feasible=r["feasible"])
        if r["feasible"]:
            w = widths(r, Ore, Oim)
            t["re_range"] = [add(w[1], o0.real - oz.real), add(w[0], o0.real - oz.real)]; t["im_range"] = [add(w[3], o0.imag - oz.imag), add(w[2], o0.imag - oz.imag)]
            t["zero_feasible"] = r.get("zero_feasible")
            devs = []
            for nm, x in r["x"].items():
                if x is None: continue
                aa = a0 + B @ (x[:dbig] + 1j * x[dbig:]); devs.append(abs(o1 @ aa + o2 @ np.conj(aa) - oz))
                t["max_abs_c"] = float(max(t.get("max_abs_c", 0), np.abs(x[:dbig] + 1j * x[dbig:]).max()))
                t["max_resid_check"] = float(max(t.get("max_resid_check", 0), np.abs(D1 @ aa + D2 @ np.conj(aa)).max()))
            t["max_dev_in_slice"] = float(max(devs))
        rec["translates"].append(t)
    if not tangent: rec['tangent'] = None; return rec
    # (3) tangent cone at zeta, all primes
    z = np.exp(2j * np.pi * np.arange(1, NG) / NG); P = len(ps)
    G = np.zeros((N, P * (NG - 1)), complex)
    for ip, p in enumerate(ps):
        pk = p; k = 1
        while pk <= N:
            G[pk - 1::pk, ip * (NG - 1):(ip + 1) * (NG - 1)] += (z**k - 1) / k
            pk *= p; k += 1
    Mc = D1 @ G + D2 @ np.conj(G); Cmat = np.vstack([Mc.real, Mc.imag])
    sv = np.linalg.svd(Cmat, compute_uv=False); rec["tangent_rank_eps"] = int((sv > EPS).sum())
    Oc = o1 @ G + o2 @ np.conj(G)
    S = np.zeros((P, P * (NG - 1)));
    for ip in range(P): S[ip, ip * (NG - 1):(ip + 1) * (NG - 1)] = 1
    r = lp_support(Cmat, np.zeros(Cmat.shape[0]), Oc.real[None, :], Oc.imag[None, :], 0j, EPS, None, poly_rows=(S, np.ones(P)), bounds=[(0, None)] * (P * (NG - 1)), want_zero=False)
    w = widths(r, Oc.real[None, :], Oc.imag[None, :]); rec["tangent"] = dict(re_range=[w[1], w[0]], im_range=[w[3], w[2]])
    x = r["x"]["+im"] if r["x"].get("+im") is not None else None
    if x is not None:
        mass = x.reshape(P, NG - 1).sum(axis=1); rec["tangent"]["primes_moved_gt_1e-3"] = [int(p) for p, m_ in zip(ps, mass) if m_ > 1e-3][:40]
    return rec

if __name__ == "__main__":
    cfg = json.loads(sys.argv[1]); outf = sys.argv[2]
    for H in cfg["Hs"]:
        for EPS in cfg["EPSs"]:
            t0 = time.time(); rec = run(cfg["T"], H, EPS, cfg.get("ratio", 3.2), cfg.get("ks", [0, 1, -1, 2, -2, 5, -5]), J=cfg.get("J", 7), dt=cfg.get("dt", 0.4), tangent=cfg.get("tangent", True)); rec["J"] = cfg.get("J", 7); rec["dt"] = cfg.get("dt", 0.4)
            rec["sec"] = round(time.time() - t0, 1)
            with open(outf, "a") as f: f.write(json.dumps(rec) + "\n")
            f3 = lambda v: None if v is None else [round(float(x), 4) if x is not None else None for x in v]
            print(f"T={rec['T']} H={H} EPS={EPS} N={rec['N']} primes={rec['n_primes']} big={rec['n_big_primes']} |zeta(s0)|={rec['abs_zeta_s0']:.3f} trunc={rec['zeta_trunc_residual']:.1e} sec={rec['sec']}")
            print(f"  relaxed: rank={rec['relaxed_rank_eps']}/{rec['relaxed_real_dim']} re={f3(rec['relaxed']['re_range'])} im={f3(rec['relaxed']['im_range'])} zero={rec['relaxed']['zero_feasible']}")
            if rec["tangent"]: print(f"  tangent(all primes, 1st order): rank={rec['tangent_rank_eps']}/{2*0+63*rec['n_primes']} re={f3(rec['tangent']['re_range'])} im={f3(rec['tangent']['im_range'])} nmoved={len(rec['tangent'].get('primes_moved_gt_1e-3') or [])}")
            for t in rec["translates"]:
                print(f"  k={t['k']:+d} alpha={t['alpha']:+.4f} resid={t['translate_resid']:.2e} dev={t['translate_dev']:.3f} slice_feasible={t['slice_feasible']} re={f3(t.get('re_range'))} im={f3(t.get('im_range'))} zero={t.get('zero_feasible')} maxdev={t.get('max_dev_in_slice')} max|c|={t.get('max_abs_c')} resid={t.get('max_resid_check')}", flush=True)
