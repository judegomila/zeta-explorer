"""Reference: CUE_N eigenphases (unfolded, circumference N) under the noise-free Dyson drift dx_k/dtau = 2 sum' K(x_k - x_j), cot kernel.
Records gap variance V(tau) and Q(tau) = E[g D] at the requested times. Usage: cue_flow.py N NMAT_per_proc NPROC OUT.json tau1 tau2 ..."""
import numpy as np, sys, math, json, time
from scipy.integrate import solve_ivp
from multiprocessing import Pool
def stats(x, N):
    K = lambda w: (np.pi / N) / np.tan(np.pi * w / N)
    X = x[:, None] - x[None, :]; np.fill_diagonal(X, 0.5)
    Km = K(X); np.fill_diagonal(Km, 0.0)
    F = Km.sum(1)
    g = np.mod(np.roll(x, -1) - x, N); D = np.roll(F, -1) - F
    return np.mean((g - 1) ** 2), np.mean(g * D)
def work(args):
    N, nmat, seed, taus = args
    rng = np.random.default_rng(seed)
    acc = np.zeros((len(taus) + 1, 2)); acc2 = np.zeros((len(taus) + 1, 2))
    def rhs(t, x):
        X = x[:, None] - x[None, :]; np.fill_diagonal(X, 0.5)
        Km = (np.pi / N) / np.tan(np.pi * X / N); np.fill_diagonal(Km, 0.0)
        return 2 * Km.sum(1)
    for _ in range(nmat):
        Z = rng.standard_normal((N, N)) + 1j * rng.standard_normal((N, N))
        Q, R = np.linalg.qr(Z); d = np.diag(R); Q = Q * (d / np.abs(d))
        x = np.sort(np.mod(np.angle(np.linalg.eigvals(Q)), 2 * np.pi)) * N / (2 * np.pi)
        sol = solve_ivp(rhs, (0, taus[-1]), x, method='LSODA', t_eval=taus, rtol=1e-9, atol=1e-11)
        xs = [x] + [sol.y[:, i] for i in range(len(taus))]
        v = np.array([stats(xx, N) for xx in xs])
        acc += v; acc2 += v * v
    return acc, acc2, nmat
if __name__ == '__main__':
    N = int(sys.argv[1]); nmat = int(float(sys.argv[2])); nproc = int(sys.argv[3]); out = sys.argv[4]; taus = [float(v) for v in sys.argv[5:]]
    t0 = time.time()
    with Pool(nproc) as p: res = p.map(work, [(N, nmat, 5150 + i, taus) for i in range(nproc)])
    acc = sum(r[0] for r in res); acc2 = sum(r[1] for r in res); cnt = sum(r[2] for r in res)
    mean = acc / cnt; err = np.sqrt(np.maximum(acc2 / cnt - mean ** 2, 0) / cnt)
    rows = [dict(tau=t, V=float(mean[i][0]), Verr=float(err[i][0]), Q=float(mean[i][1]), Qerr=float(err[i][1])) for i, t in enumerate([0.0] + taus)]
    json.dump(dict(N=N, nmat=cnt, rows=rows), open(out, 'w'))
    for r in rows: print('tau=%.4f V=%.5f+-%.5f Q+1=%.5f+-%.5f' % (r['tau'], r['V'], r['Verr'], r['Q'] + 1, r['Qerr']))
    print('time %.0fs' % (time.time() - t0))
