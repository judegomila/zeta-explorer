"""Second pass on the model of mw.py (rebuilds the same rows).  usage: mw2.py T layout [mmax]
(a) per-window numerical rank (non-multiplicative columns; unimodular Jacobian at zeta);
(b) hard-zero pass: weight LAM = 100 on the zero block, starts = survivor of mw.py, zeta, perturbations; reports max defect at |F(s0)| ~ 0;
(c) non-multiplicative control: a(n), n >= 2, free in the box |Re|,|Im| <= 1/sqrt2 (inside the unit disk), bounded linear least squares
    with the same zero block; (d) off-grid residual of the hard-zero survivors (t shifted by DT/2, 49 X-values)."""
import numpy as np, json, sys, time, os
from scipy.optimize import least_squares, lsq_linear
import mw
from mw import *
LAM = 100.0; DSEL = [0.1, 0.4]
T = float(sys.argv[1]); layout = sys.argv[2]; mmax = int(sys.argv[3]) if len(sys.argv) > 3 else 16
tag = f"{layout}_T{T:g}"; rng = np.random.default_rng(2)
N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = primes_upto(N); P = len(ps); E = expo_matrix(N, ps)
hs = heights(T, layout, mmax)
print(f"planned: N={N} P={P} windows={len(hs)}; rows {len(hs)*K*(J-1)} x {N} complex x2 = {len(hs)*K*(J-1)*N*32/1e6:.0f} MB (x3 with off-grid rows)", flush=True)
t0 = time.time(); full = []; comp = []
for Tj in hs:
    D1, D2 = window_rows(Tj, N); full.append((D1, D2)); comp.append(compress(realmap(D1, D2)))
zb = {d: zero_rows(T, N, d) for d in DSEL}
cols = np.r_[1:N, N + 1:2 * N]; out = open(f"mw2_{tag}.jsonl", "a")
wr = []
for j, Rj in enumerate(comp):
    s1 = np.linalg.svd(Rj[:, cols], compute_uv=False); s2 = np.linalg.svd(Rj[:, N:] @ E, compute_uv=False)
    wr.append(dict(Tj=hs[j], R=float(N / (C0 * np.sqrt(hs[j] / (2 * np.pi)))), nonmult=[int((s1 > 1e-5).sum()), int((s1 > 1e-8).sum())], unimod=[int((s2 > 1e-5).sum()), int((s2 > 1e-8).sum())]))
out.write(json.dumps(dict(kind="window_ranks", T=T, layout=layout, N=N, P=P, ranks=wr)) + "\n"); out.flush(); print(wr, flush=True)
def md_a(a, m): return max(float(np.abs(D1 @ a + D2 @ np.conj(a)).max()) for D1, D2 in full[:m])
hard = {}
for m in [x for x in MS if x <= mmax]:
    Rm = compress(np.vstack(comp[:m])); rec = dict(kind="pass2", T=T, layout=layout, m=m, hard_zero={}, nonmult={})
    for d in DSEL:
        o1, o2, z1, z2 = zb[d]; Z = np.vstack([realmap(o1[None, :], o2[None, :]), realmap(z1, z2)])
        fz, jz = make_fun(np.vstack([Rm, LAM * Z]), E)
        starts = [("zeta", np.zeros(P))] + [(f"pert{s}", s * rng.standard_normal(P)) for s in (0.1, 0.3, 1.0) for _ in range(3)]
        fn = f"surv_{tag}_m{m}_d{d}.npy"
        if os.path.exists(fn): starts.insert(0, ("mw", np.load(fn)))
        if (m // 2, d) in hard: starts.insert(0, ("prev", hard[(m // 2, d)]))
        best = None
        for name, th0 in starts:
            r = least_squares(fz, th0, jac=jz, method="trf", xtol=1e-14, ftol=1e-14, gtol=1e-14, max_nfev=300)
            a = np.exp(1j * (E @ r.x)); Fv = abs(complex(o1 @ a + o2 @ np.conj(a))); zx = float(np.abs(z1 @ a + z2 @ np.conj(a)).max()); md = md_a(a, m)
            if best is None or max(md, zx) < max(best["maxdef"], best["s0_xindep"]):
                best = dict(start=name, maxdef=md, absF=Fv, s0_xindep=zx, theta=r.x.copy())
        hard[(m, d)] = best["theta"]; np.save(f"hard_{tag}_m{m}_d{d}.npy", best.pop("theta")); rec["hard_zero"][str(d)] = best
        # non-multiplicative control (linear)
        # null directions of the FE block (singular values < 1e-9), then the minimum-norm correction of zeta that satisfies the zero block
        U_, s_, Vt = np.linalg.svd(Rm[:, cols], full_matrices=True); rk = int((s_ > 1e-9).sum()); Vn = Vt[rk:].T
        x0 = np.concatenate([np.ones(N - 1), np.zeros(N - 1)]); zres = Z[:, cols] @ x0 + Z[:, 0]
        c, *_ = np.linalg.lstsq(Z[:, cols] @ Vn, -zres, rcond=1e-10); x = x0 + Vn @ c
        a = np.concatenate([[1.0], x[:N - 1] + 1j * x[N - 1:]])
        rec["nonmult"][str(d)] = dict(maxdef=md_a(a, m), absF=abs(complex(o1 @ a + o2 @ np.conj(a))), s0_xindep=float(np.abs(z1 @ a + z2 @ np.conj(a)).max()),
                                      max_abs_a=float(np.abs(a).max()), null_dim=int(Vn.shape[1]), free_dim=2 * (N - 1))
        print(f"m={m} d={d}: hard-zero maxdef={best['maxdef']:.2e} |F|={best['absF']:.2e} ({best['start']}); nonmult maxdef={rec['nonmult'][str(d)]['maxdef']:.2e} |F|={rec['nonmult'][str(d)]['absF']:.2e} max|a|={rec['nonmult'][str(d)]['max_abs_a']:.2f} null={rec['nonmult'][str(d)]['null_dim']}", flush=True)
    rec["sec"] = round(time.time() - t0, 1); out.write(json.dumps(rec) + "\n"); out.flush()
# (d) off-grid check
mw.J = 49
og = []
for m in [x for x in MS if x <= mmax]:
    for d in DSEL:
        th = hard[(m, d)]; a = np.exp(1j * (E @ th)); worst = 0.0
        for Tj in hs[:m]:
            D1, D2 = mw.window_rows(Tj, N, ts=np.linspace(Tj + DT / 2, Tj + H - DT / 2, K - 1)); worst = max(worst, float(np.abs(D1 @ a + D2 @ np.conj(a)).max()))
        og.append(dict(m=m, delta=d, offgrid_maxdef=worst)); print(og[-1], flush=True)
    if m >= 4: break
out.write(json.dumps(dict(kind="offgrid", T=T, layout=layout, rows=og)) + "\n")
