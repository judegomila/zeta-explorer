"""Pivot: FE imposed in windows at all dyadic heights T_j = T/2^j >= 100 (each [T_j, T_j+2]), same unknowns a(n), n <= N = 3.2 sqrt(T/2 pi).
Measures the feasible width of F(s0), s0 = 3/4 + i(T+1), at tolerance EPS in (0) relaxed box model, (2) exact cone slice through zeta
(p <= sqrt N fixed), (3) tangent cone at zeta with all primes free (first order).  kappa = width / EPS if the set is pinned."""
import numpy as np, json, sys, time
from cone_lp import build, primes_upto, real_map, C0
from slices import lp_support, NG
T, EPS = float(sys.argv[1]), float(sys.argv[2]); H, J, dt = 2.0, 13, 0.2; K = int(np.ceil(H / dt)) + 1
q = np.sqrt(T / (2 * np.pi)); N = int(round(3.2 * q)); ps = primes_upto(N); P = len(ps)
hs = [T / 2**j for j in range(40) if T / 2**j >= 100]
rows = len(hs) * 2 * (K + 1) * (J - 1)
print(f"planned: N={N}, windows={len(hs)}, real rows={rows}; tangent LP matrix {2*rows} x {63*P} = {2*rows*63*P*8/1e6:.0f} MB", flush=True)
t0 = time.time(); D1 = []; D2 = []
for j, Tj in enumerate(hs):
    b = build(Tj, H, K, N, J); D1.append(b["D1"]); D2.append(b["D2"])
    if j == 0: o1, o2 = b["o1"], b["o2"]
D1 = np.vstack(D1); D2 = np.vstack(D2); ones = np.ones(N, complex); oz = o1 @ ones + o2 @ ones
rec = dict(T=T, EPS=EPS, N=N, windows=len(hs), n_primes=P, zeta_resid=float(np.abs(D1 @ ones + D2 @ ones).max()), abs_zeta_s0=float(abs(oz)))
def width(r, Ore, Oim, shift=0j):
    if not r["feasible"]: return None
    x = r["x"]; g = lambda nm, M: None if x.get(nm) is None else float(M[0] @ x[nm])
    return dict(re=[g("-re", Ore), g("+re", Ore)], im=[g("-im", Oim), g("+im", Oim)])
# (0) relaxed
d = N - 1; B = np.zeros((N, d), complex); B[np.arange(1, N), np.arange(d)] = 1; a0 = np.zeros(N, complex); a0[0] = 1
Cre, Cim = real_map(D1, D2, B); Cmat = np.vstack([Cre, Cim]); r0 = D1 @ a0 + D2 @ np.conj(a0)
sv = np.linalg.svd(Cmat, compute_uv=False); rec["relaxed_rank"] = [int((sv > EPS).sum()), 2 * d]
Ore, Oim = real_map(o1[None, :], o2[None, :], B)
r = lp_support(Cmat, np.concatenate([r0.real, r0.imag]), Ore, Oim, 0j, EPS, d, bounds=[(-1, 1)] * (2 * d), want_zero=False)
w = width(r, Ore, Oim); zref = (oz - (o1 @ a0 + o2 @ np.conj(a0)))
rec["relaxed"] = None if w is None else dict(re=[w["re"][0] - zref.real, w["re"][1] - zref.real], im=[w["im"][0] - zref.imag, w["im"][1] - zref.imag])
# (2) slice through zeta
sq = int(np.floor(np.sqrt(N))); bigp = [p for p in ps if p > sq]; col = {p: i for i, p in enumerate(bigp)}; dbig = len(bigp)
lpf = np.zeros(N + 1, int)
for p in ps: lpf[p::p] = p
isbig = lpf[1:] > sq; B = np.zeros((N, dbig), complex); a0 = np.where(isbig, 0, ones)
for i in range(N):
    if isbig[i]: B[i, col[lpf[i + 1]]] = 1
Cre, Cim = real_map(D1, D2, B); Cmat = np.vstack([Cre, Cim]); r0 = D1 @ a0 + D2 @ np.conj(a0)
sv = np.linalg.svd(Cmat, compute_uv=False); rec["slice_rank"] = [int((sv > EPS).sum()), 2 * dbig]; rec["slice_smin"] = float(sv[min(len(sv), 2 * dbig) - 1])
Ore, Oim = real_map(o1[None, :], o2[None, :], B)
ph = (2 * np.arange(NG) + 1) * np.pi / NG
poly = (np.vstack([np.hstack([np.cos(p_) * np.eye(dbig), np.sin(p_) * np.eye(dbig)]) for p_ in ph]), np.full(NG * dbig, np.cos(np.pi / NG)))
r = lp_support(Cmat, np.concatenate([r0.real, r0.imag]), Ore, Oim, 0j, EPS, dbig, poly_rows=poly, bounds=[(None, None)] * (2 * dbig), want_zero=False)
w = width(r, Ore, Oim); zref = (oz - (o1 @ a0 + o2 @ np.conj(a0)))
rec["slice"] = None if w is None else dict(re=[w["re"][0] - zref.real, w["re"][1] - zref.real], im=[w["im"][0] - zref.imag, w["im"][1] - zref.imag])
# (3) tangent, all primes
z = np.exp(2j * np.pi * np.arange(1, NG) / NG); G = np.zeros((N, P * (NG - 1)), complex)
for ip, p in enumerate(ps):
    pk = p; k = 1
    while pk <= N:
        G[pk - 1::pk, ip * (NG - 1):(ip + 1) * (NG - 1)] += (z**k - 1) / k
        pk *= p; k += 1
Mc = D1 @ G + D2 @ np.conj(G); Cmat = np.vstack([Mc.real, Mc.imag]); Oc = o1 @ G + o2 @ np.conj(G)
# rank in the moment variables (delta b(p^k) complex, one per prime power): intrinsic count
S = np.zeros((P, P * (NG - 1)))
for ip in range(P): S[ip, ip * (NG - 1):(ip + 1) * (NG - 1)] = 1
r = lp_support(Cmat, np.zeros(Cmat.shape[0]), Oc.real[None, :], Oc.imag[None, :], 0j, EPS, None, poly_rows=(S, np.ones(P)), bounds=[(0, None)] * (P * (NG - 1)), want_zero=False)
rec["tangent"] = width(r, Oc.real[None, :], Oc.imag[None, :])
rec["sec"] = round(time.time() - t0, 1)
print(json.dumps(rec)); open("multiwin.jsonl", "a").write(json.dumps(rec) + "\n")
