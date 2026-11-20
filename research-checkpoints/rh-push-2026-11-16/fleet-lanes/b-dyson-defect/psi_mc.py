"""Sine-process response kernel by CUE_N Monte Carlo.
Psi(k_j) = E[ phi_0 * sum_{i != 0} sin(k_j (x_0 - x_i)) ],  phi_0 = 2 x_0 - x_{-1} - x_{+1},  k_j = 2 pi j / N, j = 1..JM
Also S(k_j) = E|rho_k|^2 / N, V4(k_j) = Var(|rho_k|^2)/N^2, harmonic comparator pieces.
Usage: psi_mc.py N NMAT_per_proc NPROC OUT.json"""
import numpy as np, sys, math, json, time
from multiprocessing import Pool
def work(args):
    N, nmat, seed = args
    rng = np.random.default_rng(seed)
    JM = 2 * N
    B = max(1, 2000000 // (N * N))
    j = np.arange(1, JM + 1); k = 2 * np.pi * j / N
    acc = np.zeros((4, JM)); acc2 = np.zeros((4, JM)); cnt = 0; done = 0
    while done < nmat:
        b = min(B, nmat - done); done += b
        Z = (rng.standard_normal((b, N, N)) + 1j * rng.standard_normal((b, N, N)))
        Q, R = np.linalg.qr(Z)
        d = np.einsum('bii->bi', R); Q = Q * (d / np.abs(d))[:, None, :]
        x = np.sort(np.mod(np.angle(np.linalg.eigvals(Q)), 2 * np.pi), axis=1) * N / (2 * np.pi)
        xm = np.roll(x, 1, axis=1); xm[:, 0] -= N
        xp = np.roll(x, -1, axis=1); xp[:, -1] += N
        phi = 2 * x - xm - xp                                  # (b, N)
        E = np.exp(1j * x[:, :, None] * k[None, None, :])     # (b, N, JM)
        rho = E.sum(1)                                        # (b, JM)
        a = (phi[:, :, None] * E).sum(1)                      # sum_0 phi_0 e^{i k x_0}
        # sum_0 phi_0 sum_{i != 0} sin(k(x_0 - x_i)) = Im( a * conj(rho) )   (i = 0 term is sin 0 = 0)
        psi = (a * np.conj(rho)).imag / N
        r2 = np.abs(rho) ** 2
        v = np.stack([psi, r2 / N, r2 * r2 / N ** 2, (np.abs(a) ** 2) / N])
        acc += v.sum(1); acc2 += (v * v).sum(1); cnt += b
    return acc, acc2, cnt
if __name__ == '__main__':
    N = int(sys.argv[1]); nmat = int(float(sys.argv[2])); nproc = int(sys.argv[3]); out = sys.argv[4]
    t0 = time.time()
    with Pool(nproc) as p: res = p.map(work, [(N, nmat, 77000 * N + i) for i in range(nproc)])
    acc = sum(r[0] for r in res); acc2 = sum(r[1] for r in res); cnt = sum(r[2] for r in res)
    mean = acc / cnt; err = np.sqrt(np.maximum(acc2 / cnt - mean ** 2, 0) / cnt)
    JM = 2 * N; k = 2 * np.pi * np.arange(1, JM + 1) / N
    json.dump(dict(N=N, nmat=cnt, k=k.tolist(), psi=mean[0].tolist(), psi_err=err[0].tolist(), S=mean[1].tolist(), S_err=err[1].tolist(),
                   r4=mean[2].tolist(), r4_err=err[2].tolist(), a2=mean[3].tolist()), open(out, 'w'))
    print(N, cnt, '%.0fs' % (time.time() - t0), flush=True)
    for jj in [1, 2, 4, 8, N // 4, N // 2, N, 3 * N // 2]:
        i = jj - 1
        print(' k=%.3f psi=%.6f+-%.6f  harm -(1-cos k)/pi=%.6f  S=%.4f (k/2pi=%.4f)  Var|rho|^2/(N S)^2=%.4f' % (k[i], mean[0][i], err[0][i], -(1 - math.cos(k[i])) / math.pi, mean[1][i], k[i] / (2 * math.pi), (mean[2][i] - mean[1][i] ** 2) / mean[1][i] ** 2))
