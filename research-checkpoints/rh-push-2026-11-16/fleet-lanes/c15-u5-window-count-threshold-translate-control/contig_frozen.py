"""Experiment B: K contiguous windows of length 1 at height Ts ~ T, finite model of c3 (afe.py unchanged).
Unknown theta_p, p <= N = round(3.2 sqrt(T/2pi)); a(n) = exp(i sum v_p(n) theta_p) (unimodular Euler product, control class U).
Rows: A_X(s)[a] - A_1(s)[a], s = 1/2 + it, t = Ts + j*DT (0 <= j <= K/DT), X on J log-uniform points of [1/R, R], R = N/(1.6 q).
Zero block: A_1(s0)[a] = 0 and X-independence at s0 = 1/2 + delta + i(Ts + 0.5) (inside window 0, so the cases are nested in K).
Score = max(sup window defect, |F(s0)|, X-dependence at s0).  Also: phase-Jacobian rank at zeta against K; non-multiplicative
(twin-type) witness by linear least squares; controls zeta and Davenport-Heilbronn.
usage: contig.py T seed Kmax [DT] [J]"""
import numpy as np, json, sys, time, os
FREEZE = int(os.environ.get('FREEZE', 0))
from scipy.optimize import least_squares
from afe import coeff_rows
T = float(sys.argv[1]); seed = int(sys.argv[2]); KMAX = int(sys.argv[3])
DT = float(sys.argv[4]) if len(sys.argv) > 4 else 0.25; J = int(sys.argv[5]) if len(sys.argv) > 5 else 13
DELTA = 0.1; TOL = 1e-6; C0 = 1.6
rng = np.random.default_rng(1000 + seed)
Ts = T * (1 + 0.01 * rng.random())
def primes_upto(N):
    s = np.ones(N + 1, bool); s[:2] = False
    for i in range(2, int(N**0.5) + 1):
        if s[i]: s[i*i::i] = False
    return [int(p) for p in np.nonzero(s)[0]]
N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = primes_upto(N); P = len(ps)
E = np.zeros((N, P))
for i, p in enumerate(ps):
    pk = p
    while pk <= N: E[pk - 1::pk, i] += 1; pk *= p
keep = [i for i, p in enumerate(ps) if p > FREEZE]; E = E[:, keep]; ps = [ps[i] for i in keep]; P = len(ps)  # primes <= FREEZE keep zeta's local factor
q = np.sqrt(Ts / (2 * np.pi)); R = N / (C0 * q); Xs = np.exp(np.linspace(-np.log(R), np.log(R), J)); j1 = J // 2
npts = int(round(KMAX / DT)) + 1; per = int(round(1 / DT))
print(f"planned: T={T:g} Ts={Ts:.4f} N={N} P={P} R={R:.3f} points={npts} rows={npts*(J-1)}; full rows complex x2 = {npts*(J-1)*N*32/1e6:.0f} MB; "
      f"weights chunk 4000 x 2191 complex = {4000*2191*16/1e6:.0f} MB", flush=True)
t0 = time.time(); D1 = np.empty((npts, J - 1, N), complex); D2 = np.empty((npts, J - 1, N), complex)
for i in range(npts):
    c1, c2 = coeff_rows(complex(0.5, Ts + i * DT), Xs, N)
    D1[i] = np.delete(c1, j1, 0) - c1[j1]; D2[i] = np.delete(c2, j1, 0) - c2[j1]
    if i % 64 == 0: print(f"  rows {i}/{npts} {time.time()-t0:.0f}s", flush=True)
s0 = complex(0.5 + DELTA, Ts + 0.5); c1, c2 = coeff_rows(s0, Xs, N)
o1, o2 = c1[j1], c2[j1]; z1 = np.delete(c1, j1, 0) - c1[j1]; z2 = np.delete(c2, j1, 0) - c2[j1]
def realmap(A1, A2):
    S = A1 + A2; Dm = A1 - A2
    return np.vstack([np.hstack([S.real, -Dm.imag]), np.hstack([S.imag, Dm.real])])
def compress(M): return np.linalg.qr(M, mode="r") if M.shape[0] > M.shape[1] else M
ZB = realmap(np.vstack([o1[None], z1]), np.vstack([o2[None], z2]))
def avec(th): ph = E @ th; return np.concatenate([np.cos(ph), np.sin(ph)])
def score(a, K):
    n = K * per + 1
    wd = float(np.abs(D1[:n].reshape(-1, N) @ a + D2[:n].reshape(-1, N) @ np.conj(a)).max())
    F = complex(o1 @ a + o2 @ np.conj(a)); xd = float(np.abs(z1 @ a + z2 @ np.conj(a)).max())
    return wd, abs(F), xd
# controls
one = np.ones(N, complex)
kap = (np.sqrt(10 - 2 * np.sqrt(5)) - 2) / (np.sqrt(5) - 1); dh = np.array([[0, 1, kap, -kap, -1][n % 5] for n in range(1, N + 1)], complex)
out = open(f"frozen{FREEZE}_T{T:g}_s{seed}.jsonl", "w")
ctrl = dict(T=T, seed=seed, Ts=Ts, N=N, P=P, DT=DT, J=J, R=R,
            dh_mult_defect=[float(abs(dh[3] - dh[1]**2)), float(abs(dh[5] - dh[1] * dh[2]))], controls={})
Ks = [k for k in (1, 2, 4, 8, 16, 32, 64, 128, 256) if k <= KMAX]
for K in Ks:
    ctrl["controls"][K] = dict(zeta=score(one, K)[0], dh=score(dh, K)[0])
print("controls (window defect):", ctrl["controls"], "DH multiplicativity defects a(4)-a(2)^2, a(6)-a(2)a(3):", ctrl["dh_mult_defect"], flush=True)
out.write(json.dumps(ctrl) + "\n"); out.flush()
prev = None; W = 30.0
for K in Ks:
    n = K * per + 1; t1 = time.time()
    Rw = compress(realmap(D1[:n].reshape(-1, N), D2[:n].reshape(-1, N)))
    def jacof(M, th):
        ph = E @ th; return M[:, :N] @ (-np.sin(ph)[:, None] * E) + M[:, N:] @ (np.cos(ph)[:, None] * E)
    sv = np.linalg.svd(jacof(Rw, np.zeros(P)), compute_uv=False)
    cols = np.r_[1:N, N + 1:2 * N]; svn = np.linalg.svd(Rw[:, cols], compute_uv=False)
    rec = dict(T=T, seed=seed, K=K, N=N, P=P, jac_rank=[int((sv > 1e-5).sum()), int((sv > 1e-8).sum())],
               nonmult_rank=[int((svn > 1e-5).sum()), int((svn > 1e-8).sum()), 2 * (N - 1)])
    M = np.vstack([Rw, W * ZB])
    f = lambda th: M @ avec(th); jac = lambda th: jacof(M, th)
    starts = [] if prev is None else [("prev", prev)]
    for sc in (0.03, 0.1, 0.1, 0.3, 0.3, 1.0): starts.append((f"zeta+{sc}", sc * rng.standard_normal(P)))
    starts.append(("random", rng.uniform(-np.pi, np.pi, P)))
    best = None; tried = []
    for name, th0 in starts:
        r = least_squares(f, th0, jac=jac, method="trf", xtol=1e-15, ftol=1e-15, gtol=1e-15, max_nfev=400)
        a = np.exp(1j * (E @ r.x)); sc3 = score(a, K); s = max(sc3); tried.append([name, s])
        if best is None or s < best[0]: best = (s, r.x, sc3, name)
        if s < TOL / 10: break
    # second pass with heavier weight on the zero block
    if best[0] > TOL / 10:
        M2 = np.vstack([Rw, 1000.0 * ZB])
        r = least_squares(lambda th: M2 @ avec(th), best[1], jac=lambda th: jacof(M2, th), method="trf", xtol=1e-15, ftol=1e-15, gtol=1e-15, max_nfev=1500)
        a = np.exp(1j * (E @ r.x)); sc3 = score(a, K)
        if max(sc3) < best[0]: best = (max(sc3), r.x, sc3, best[3] + "+refine")
    th = best[1]; a = np.exp(1j * (E @ th))
    # distance from zeta and from the translates: residual of the fit theta_p = -alpha log p + 2 pi k_p over a grid of alpha
    lp = np.log(ps); als = np.linspace(-80, 80, 64001)
    dist = np.abs(np.exp(1j * (th[None, :] + als[:, None] * lp[None, :])) - 1)
    wts = 1 / np.sqrt(np.array(ps, float)); tr = (dist * wts).sum(1) / wts.sum(); ia = int(tr.argmin())
    # off-grid check: points shifted by DT/2, stride 1 unit
    og = 0.0
    for j in range(min(K, 8)):
        c1, c2 = coeff_rows(complex(0.5, Ts + j * K / min(K, 8) + DT / 2), Xs ** 0.93, N); jm = J // 2
        og = max(og, float(np.abs((np.delete(c1, jm, 0) - c1[jm]) @ a + (np.delete(c2, jm, 0) - c2[jm]) @ np.conj(a)).max()))
    # non-multiplicative (additive twin type) witness: complex a(n), a(1) = 1, min-norm correction b = a - 1 on n >= 2
    Ml = np.vstack([Rw, ZB]); rhs = -(Ml @ np.concatenate([np.ones(N), np.zeros(N)]))
    b, *_ = np.linalg.lstsq(Ml[:, cols], rhs, rcond=1e-11)
    an = one.copy(); an[1:] += b[:N - 1] + 1j * b[N - 1:]
    rec.update(score=best[0], window_defect=best[2][0], F_s0=best[2][1], xdep_s0=best[2][2], start=best[3], tried=tried, offgrid=og,
               passed=bool(best[0] <= TOL), mean_weighted_dist_to_best_translate=float(tr[ia]), best_translate_alpha=float(als[ia]),
               max_abs_theta_small_primes=[float(x) for x in np.angle(np.exp(1j * th[:5]))],
               nonmult_score=max(score(an, K)), nonmult_max_abs=float(np.abs(an).max()), secs=time.time() - t1)
    np.save(f"survfrozen{FREEZE}_T{T:g}_s{seed}_K{K}.npy", th); prev = th
    out.write(json.dumps(rec) + "\n"); out.flush()
    print(f"K={K}: rank {rec['jac_rank']} of {P}; score {best[0]:.2e} (window {best[2][0]:.1e}, F(s0) {best[2][1]:.1e}, xdep {best[2][2]:.1e}; start {best[3]}; offgrid {og:.1e}); "
          f"dist to translates {tr[ia]:.2f}; nonmult rank {rec['nonmult_rank']} score {rec['nonmult_score']:.1e} max|a| {rec['nonmult_max_abs']:.2f}; {time.time()-t1:.0f}s", flush=True)
