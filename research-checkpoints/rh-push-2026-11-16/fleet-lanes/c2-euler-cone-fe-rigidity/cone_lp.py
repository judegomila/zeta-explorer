"""Finite model of (Euler cone) intersect (windowed functional equation).
Unknown: a(n), n <= N.  FE constraint: A_X(s_k)[a] independent of X on an admissible grid (lengths c0*q*X, c0*q/X <= N),
at K points s_k = 1/2 + i t_k in [T, T+H] and at s0 = 3/4 + i(T+H/2); tolerance EPS per real component.
Models:
  relaxed : a(n) free in the box |Re|,|Im| <= 1 (contains the unit disk), a(1) = 1.            -> outer bound on the diameter
  cone    : a multiplicative, local data at p <= sqrt(N) fixed (zeta's or a stated alternative), a(p) for sqrt(N) < p <= N
            free in an inscribed 16-gon of the unit disk (every such point is m_1 of a probability measure on the circle;
            for these p only m_1 enters a(n), n <= N).  Linear in the free a(p): true cone elements, inner bound.
Outputs per configuration: constraint rank, free dimension, support values of delta = A_1(s0)[a] - A_1(s0)[zeta],
feasibility of a prescribed zero A_1(s0)[a] = 0."""
import numpy as np, json, sys, time
from scipy.optimize import linprog
from afe import coeff_rows
EPS = 1e-5; C0 = 1.6

def primes_upto(N):
    s = np.ones(N + 1, bool); s[:2] = False
    for i in range(2, int(N**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return [int(p) for p in np.nonzero(s)[0]]

def local_from_moments(m, kmax):
    """a(p^k), k=0..kmax from rung moments m_1..m_kmax: sum a_k x^k = exp(sum m_k x^k / k)"""
    a = [1.0 + 0j]
    for k in range(1, kmax + 1):
        a.append(sum(m[j - 1] * a[k - j] for j in range(1, k + 1)) / k)
    return a

def small_data(kind, p, kmax, rng):
    z = np.exp(2j * np.pi * np.arange(64) / 64)
    if kind == "zeta": w = np.zeros(64); w[0] = 1
    elif kind == "minus": w = np.zeros(64); w[32] = 1          # point mass at -1
    elif kind == "uniform": w = np.ones(64) / 64               # all moments 0 (k<64)
    elif kind == "random": w = rng.dirichlet(np.ones(64) * 0.3)
    elif kind == "half": w = np.zeros(64); w[0] = .5; w[32] = .5
    m = [np.sum(w * z**k) for k in range(1, kmax + 1)]
    return local_from_moments(m, kmax)

def build(T, H, K, N, J):
    q = np.sqrt(T / (2 * np.pi)); R = N / (C0 * q)
    if R < 1.0: return None
    Xs = np.exp(np.linspace(-np.log(R), np.log(R), J)) if R > 1.0 else np.array([1.0])
    j1 = J // 2  # X = 1
    ts = np.linspace(T, T + H, K)
    rows1, rows2 = [], []
    for t in ts:
        c1, c2 = coeff_rows(complex(0.5, t), Xs, N)
        for j in range(J):
            if j != j1: rows1.append(c1[j] - c1[j1]); rows2.append(c2[j] - c2[j1])
    s0 = complex(0.75, T + H / 2)
    c1, c2 = coeff_rows(s0, Xs, N)
    for j in range(J):
        if j != j1: rows1.append(c1[j] - c1[j1]); rows2.append(c2[j] - c2[j1])
    return dict(q=q, Xs=Xs, D1=np.array(rows1), D2=np.array(rows2), o1=c1[j1], o2=c2[j1], s0=s0)

def real_map(c1, c2, B):
    """complex functional a -> sum a c1 + conj(a) c2 with a = B z (B complex N x d, z complex free dim d), as real rows on [Re z, Im z].
    returns (Mre, Mim) each shape (rows, 2d)"""
    P = c1 @ B; Q = c2 @ np.conj(B)          # value = P z + Q conj z
    Mx = P + Q; My = 1j * (P - Q)
    return np.hstack([Mx.real, My.real]), np.hstack([Mx.imag, My.imag])

def solve(T, H, K, N, J, model, small="zeta", seed=0, twist_p=None):
    b = build(T, H, K, N, J)
    if b is None: return dict(T=T, H=H, N=N, model=model, admissible=False)
    rng = np.random.default_rng(seed)
    n_idx = np.arange(1, N + 1)
    if model == "relaxed":
        d = N - 1; B = np.zeros((N, d), complex); B[np.arange(1, N), np.arange(d)] = 1
        a0 = np.zeros(N, complex); a0[0] = 1
        polygon = False
    else:
        ps = primes_upto(N); sq = int(np.floor(np.sqrt(N)))
        smallp = [p for p in ps if p <= sq]; bigp = [p for p in ps if p > sq]
        loc = {}
        for p in smallp:
            kmax = int(np.log(N) / np.log(p) + 1e-9)
            kind = small if (twist_p is None or p in twist_p) else "zeta"
            loc[p] = small_data(kind, p, kmax, rng)
        asm = np.zeros(N + 1, complex); big_of = np.zeros(N + 1, int)
        for n in range(1, N + 1):
            m = n; val = 1.0 + 0j; bp = 0
            for p in smallp:
                k = 0
                while m % p == 0: m //= p; k += 1
                if k: val *= loc[p][k]
            if m > 1: bp = m      # one prime > sqrt(N)
            asm[n] = val; big_of[n] = bp
        d = len(bigp); col = {p: i for i, p in enumerate(bigp)}
        B = np.zeros((N, d), complex); a0 = np.zeros(N, complex)
        for n in range(1, N + 1):
            if big_of[n]: B[n - 1, col[big_of[n]]] = asm[n]
            else: a0[n - 1] = asm[n]
        polygon = True
    ones = np.ones(N, complex)
    Cre, Cim = real_map(b["D1"], b["D2"], B)
    Cmat = np.vstack([Cre, Cim])
    r0 = b["D1"] @ a0 + b["D2"] @ np.conj(a0); rhs0 = np.concatenate([r0.real, r0.imag])
    zres = np.abs(b["D1"] @ ones + b["D2"] @ ones).max()
    sv = np.linalg.svd(Cmat, compute_uv=False)
    Ore, Oim = real_map(b["o1"][None, :], b["o2"][None, :], B)
    oz = b["o1"] @ ones + b["o2"] @ ones            # zeta value at s0 (model)
    o0 = b["o1"] @ a0 + b["o2"] @ np.conj(a0)
    # inequality system
    A_ub = [Cmat / EPS, -Cmat / EPS]; b_ub = [(EPS - rhs0) / EPS, (EPS + rhs0) / EPS]
    if polygon:
        for j in range(16):
            ph = (2 * j + 1) * np.pi / 16   # vertices at angles 2 pi j/16, so a = 1 is a vertex
            A_ub.append(np.hstack([np.cos(ph) * np.eye(d), np.sin(ph) * np.eye(d)])); b_ub.append(np.full(d, np.cos(np.pi / 16)))
        bounds = [(None, None)] * (2 * d)
    else:
        bounds = [(-1, 1)] * (2 * d)
    A_ub = np.vstack(A_ub); b_ub = np.concatenate(b_ub)
    out = dict(T=T, H=H, K=K, N=N, J=J, model=model, small=small, twist_p=twist_p, admissible=True, q=float(b["q"]), N_over_q=float(N / b["q"]),
               free_complex_dim=int(d), n_real_constraints=int(Cmat.shape[0]),
               rank_1e_3=int((sv > 1e-3).sum()), rank_eps=int((sv > EPS).sum()), zeta_trunc_residual=float(zres),
               zeta_s0=[float(oz.real), float(oz.imag)], abs_zeta_s0=float(abs(oz)))
    sup = {}; feas = None; wit = None
    for name, vec in (("+re", Ore[0]), ("-re", -Ore[0]), ("+im", Oim[0]), ("-im", -Oim[0])):
        r = linprog(-vec, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method="highs")
        if r.status == 2: feas = False; break
        if r.status != 0: sup[name] = None; continue
        feas = True
        z = r.x[:d] + 1j * r.x[d:]; a = a0 + B @ z
        val = b["o1"] @ a + b["o2"] @ np.conj(a)
        resid = np.abs(b["D1"] @ a + b["D2"] @ np.conj(a)).max()
        sup[name] = dict(delta=[float((val - oz).real), float((val - oz).imag)], resid=float(resid), max_abs_free=float(np.abs(z).max()) if d else 0.0)
    out["feasible"] = feas
    if feas:
        ok = [v for v in sup.values() if v]
        out["support"] = sup
        out["width_re"] = sup["+re"]["delta"][0] - sup["-re"]["delta"][0] if sup["+re"] and sup["-re"] else None
        out["width_im"] = sup["+im"]["delta"][1] - sup["-im"]["delta"][1] if sup["+im"] and sup["-im"] else None
        out["max_resid"] = max(v["resid"] for v in ok)
        # prescribed zero at s0:  |Re|,|Im| of A_1(s0)[a] <= EPS
        A2 = np.vstack([A_ub, Ore / EPS, -Ore / EPS, Oim / EPS, -Oim / EPS])
        b2 = np.concatenate([b_ub, [(EPS - o0.real) / EPS, (EPS + o0.real) / EPS, (EPS - o0.imag) / EPS, (EPS + o0.imag) / EPS]])
        r = linprog(np.zeros(2 * d), A_ub=A2, b_ub=b2, bounds=bounds, method="highs")
        out["zero_at_s0_feasible"] = bool(r.status == 0)
        if r.status == 0:
            z = r.x[:d] + 1j * r.x[d:]; a = a0 + B @ z
            out["zero_witness"] = dict(abs_value_s0=float(abs(b["o1"] @ a + b["o2"] @ np.conj(a))),
                                       resid=float(np.abs(b["D1"] @ a + b["D2"] @ np.conj(a)).max()), max_abs_free=float(np.abs(z).max()),
                                       frac_changed=float((np.abs(z - 1) > 1e-6).mean()) if model == "cone" else None)
    return out

if __name__ == "__main__":
    cfg = json.loads(sys.argv[1]); outf = sys.argv[2]
    T, H, K, J = cfg["T"], cfg["H"], cfg["K"], cfg.get("J", 7)
    q = np.sqrt(T / (2 * np.pi))
    for ratio in cfg["ratios"]:
        N = int(round(ratio * q))
        print(f"planned: N={N}, constraint matrix {2*(K+1)*(J-1)} x {2*N} float64 = {2*(K+1)*(J-1)*2*N*8/1e6:.1f} MB; weight chunks <= {4000*len(np.arange(-110,110,0.1))*16/1e6:.0f} MB", flush=True)
        for model, small, tw in cfg["models"]:
            t0 = time.time()
            r = solve(T, H, K, N, J, model, small=small, twist_p=tw)
            r["sec"] = round(time.time() - t0, 1)
            with open(outf, "a") as f: f.write(json.dumps(r) + "\n")
            keys = ["T", "H", "N", "model", "small", "twist_p", "admissible", "free_complex_dim", "rank_1e_3", "rank_eps", "zeta_trunc_residual", "feasible", "width_re", "width_im", "max_resid", "zero_at_s0_feasible", "abs_zeta_s0", "sec"]
            print(" ".join(f"{k}={r.get(k):.3g}" if isinstance(r.get(k), float) else f"{k}={r.get(k)}" for k in keys), flush=True)
