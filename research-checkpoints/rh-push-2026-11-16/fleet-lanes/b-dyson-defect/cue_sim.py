"""CUE_N comparator: per-neighbour flat-kernel profile on the periodised configuration, plus local gap statistics and the cot-kernel Q.
Usage: cue_sim.py N NMAT_per_proc NPROC OUT.json"""
import numpy as np, sys, math, json, time
from multiprocessing import Pool
MP = 40
def work(args):
    N, nmat, seed = args
    rng = np.random.default_rng(seed)
    B = max(1, min(nmat, 200000 // (N * N) * 16))
    names = ['V', 'C1', 'C2', 'g3', 'ratio', 'Qcot'] + ['p%d' % m for m in range(1, MP + 1)]
    S1 = np.zeros(len(names)); S2 = np.zeros(len(names)); cnt = 0
    c = (MP + 3) // N + 2
    done = 0
    while done < nmat:
        b = min(B, nmat - done); done += b
        Z = (rng.standard_normal((b, N, N)) + 1j * rng.standard_normal((b, N, N)))
        Q, R = np.linalg.qr(Z)
        d = np.einsum('bii->bi', R); Q = Q * (d / np.abs(d))[:, None, :]
        th = np.sort(np.mod(np.angle(np.linalg.eigvals(Q)), 2 * np.pi), axis=1) * N / (2 * np.pi)
        ext = np.concatenate([th + N * j for j in range(-c, c + 2)], axis=1)  # index of x_k is c*N + k
        k = c * N + np.arange(N)
        a = ext[:, k + 1]; bb = ext[:, k]; g = a - bb
        g1 = ext[:, k + 2] - a; g2 = ext[:, k + 3] - ext[:, k + 2]
        vals = [((g - 1) ** 2).mean(1), ((g - 1) * (g1 - 1)).mean(1), ((g - 1) * (g2 - 1)).mean(1), (g ** 3).mean(1), (g / g1 + g1 / g).mean(1)]
        # cot kernel Q
        K = lambda w: (np.pi / N) / np.tan(np.pi * w / N)
        D = 2 * K(g)
        for m in range(1, N - 1):
            xo = ext[:, k + 1 + m]
            D += K(a - xo) - K(bb - xo)
        vals.append((g * D).mean(1))
        for m in range(1, MP + 1):
            xr = ext[:, k + 1 + m]; xl = ext[:, k - m]
            vals.append((g * (1 / (a - xr) - 1 / (bb - xr) + 1 / (a - xl) - 1 / (bb - xl))).mean(1))
        v = np.array(vals)
        S1 += v.sum(1); S2 += (v * v).sum(1); cnt += b
    return S1, S2, cnt, names
if __name__ == '__main__':
    N = int(sys.argv[1]); nmat = int(float(sys.argv[2])); nproc = int(sys.argv[3]); out = sys.argv[4]
    t0 = time.time()
    with Pool(nproc) as p: res = p.map(work, [(N, nmat, 1000 * N + i) for i in range(nproc)])
    S1 = sum(r[0] for r in res); S2 = sum(r[1] for r in res); cnt = sum(r[2] for r in res); names = res[0][3]
    mean = S1 / cnt; err = np.sqrt((S2 / cnt - mean ** 2) / cnt)
    json.dump(dict(N=N, nmat=cnt, time=time.time() - t0, mean=dict(zip(names, mean.tolist())), err=dict(zip(names, err.tolist()))), open(out, 'w'))
    print(N, cnt, '%.0fs' % (time.time() - t0), 'V %.6f+-%.6f Qcot %.5f+-%.5f p1 %.5f+-%.5f' % (mean[0], err[0], mean[5], err[5], mean[6], err[6]), flush=True)
