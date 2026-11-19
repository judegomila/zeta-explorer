"""Frozen small primes (theta_p = 0 for p <= FREEZE), continuation in the target value: F(s0) = (1 - lam) zeta_model(s0), lam 0 -> 1.
Same model and rows as contig.py.  usage: homotopy.py T seed Kmax FREEZE"""
import numpy as np, json, sys, time
from scipy.optimize import least_squares
from afe import coeff_rows
T = float(sys.argv[1]); seed = int(sys.argv[2]); KMAX = int(sys.argv[3]); FREEZE = int(sys.argv[4])
DT = 0.25; J = 13; DELTA = 0.1; C0 = 1.6
rng = np.random.default_rng(1000 + seed); Ts = T * (1 + 0.01 * rng.random())
N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = [p for p in range(2, N + 1) if all(p % d for d in range(2, int(p**0.5) + 1))]
ps = [p for p in ps if p > FREEZE]; P = len(ps); E = np.zeros((N, P))
for i, p in enumerate(ps):
    pk = p
    while pk <= N: E[pk - 1::pk, i] += 1; pk *= p
q = np.sqrt(Ts / (2 * np.pi)); R = N / (C0 * q); Xs = np.exp(np.linspace(-np.log(R), np.log(R), J)); j1 = J // 2
npts = int(round(KMAX / DT)) + 1; per = 4
print(f"planned: T={T:g} N={N} free primes={P} (p > {FREEZE}) points={npts}; rows complex x2 = {npts*(J-1)*N*32/1e6:.0f} MB", flush=True)
D1 = np.empty((npts, J - 1, N), complex); D2 = np.empty((npts, J - 1, N), complex)
for i in range(npts):
    c1, c2 = coeff_rows(complex(0.5, Ts + i * DT), Xs, N); D1[i] = np.delete(c1, j1, 0) - c1[j1]; D2[i] = np.delete(c2, j1, 0) - c2[j1]
s0 = complex(0.5 + DELTA, Ts + 0.5); c1, c2 = coeff_rows(s0, Xs, N)
o1, o2 = c1[j1], c2[j1]; z1 = np.delete(c1, j1, 0) - c1[j1]; z2 = np.delete(c2, j1, 0) - c2[j1]
def realmap(A1, A2):
    S = A1 + A2; Dm = A1 - A2
    return np.vstack([np.hstack([S.real, -Dm.imag]), np.hstack([S.imag, Dm.real])])
ZB = realmap(np.vstack([o1[None], z1]), np.vstack([o2[None], z2])); zeta0 = complex((o1 + o2).sum())
def avec(th): ph = E @ th; return np.concatenate([np.cos(ph), np.sin(ph)])
def jacof(M, th): ph = E @ th; return M[:, :N] @ (-np.sin(ph)[:, None] * E) + M[:, N:] @ (np.cos(ph)[:, None] * E)
out = open(f"homotopy_T{T:g}_s{seed}_F{FREEZE}.jsonl", "w")
for K in [k for k in (1, 4, 16, 64) if k <= KMAX]:
    n = K * per + 1; M0 = realmap(D1[:n].reshape(-1, N), D2[:n].reshape(-1, N)); Rw = np.linalg.qr(M0, mode="r") if M0.shape[0] > M0.shape[1] else M0
    th = 0.01 * rng.standard_normal(P); W = 100.0; t1 = time.time(); path = []
    for lam in np.linspace(0.05, 1.0, 20):
        tv = np.zeros(ZB.shape[0]); tgt = (1 - lam) * zeta0; tv[0] = tgt.real; tv[J] = tgt.imag
        Mx = np.vstack([Rw, W * ZB]); off = np.concatenate([np.zeros(Rw.shape[0]), W * tv])
        r = least_squares(lambda x: Mx @ avec(x) - off, th, jac=lambda x: jacof(Mx, x), method="trf", xtol=1e-15, ftol=1e-15, gtol=1e-15, max_nfev=300)
        th = r.x; a = np.exp(1j * (E @ th))
        wd = float(np.abs(D1[:n].reshape(-1, N) @ a + D2[:n].reshape(-1, N) @ np.conj(a)).max()); F = complex(o1 @ a + o2 @ np.conj(a))
        path.append([float(lam), wd, abs(F - tgt)])
    xd = float(np.abs(z1 @ a + z2 @ np.conj(a)).max())
    rec = dict(T=T, seed=seed, K=K, FREEZE=FREEZE, P=P, zeta_model_s0=abs(zeta0), window_defect=wd, F_s0=abs(F), xdep_s0=xd, score=max(wd, abs(F), xd), path=path, secs=time.time() - t1)
    out.write(json.dumps(rec) + "\n"); out.flush(); np.save(f"survhom_T{T:g}_s{seed}_F{FREEZE}_K{K}.npy", th)
    print(f"K={K} FREEZE={FREEZE}: score {rec['score']:.2e} (window {wd:.1e}, F(s0) {abs(F):.1e}, xdep {xd:.1e}); |zeta(s0)|={abs(zeta0):.2f}; worst step on path {max(max(p[1], p[2]) for p in path):.1e}; {time.time()-t1:.0f}s", flush=True)
