# Test A: raw Gram matrices G_jk = phi(u_j-u_k), phi(u)=log F(sigma+iu) (horizontal branch),
# phi(0) = Re log F(sigma) (mean of the two one-sided limits). Node set: cluster {k d} (T=0) or
# two clusters {k d} U {T + k d}; the kernel is stationary, so "height T" enters only via differences ~T.
import lib, numpy as np, json, sys, math
from multiprocessing import Pool
N, d = 80, 0.5            # nodes per cluster, spacing. Largest matrix 160x160 complex = 0.4 MB
SIG = [0.6, 0.75, 0.9, 1.0, 1.1, 1.3]
CASES = [('zeta',[0,1e3,1e5]), ('tw2',[0,1e3,1e5]), ('liou',[0,1e3]), ('lift',[0,1e3]), ('ea',[0,1e3,1e5]), ('dh',[0,85.6993484854,1e3])]
def diag(name, sigma):
    # phi(0): average of u->0+ and u->0- limits = real part of the one-sided limit
    if abs(sigma-1.0) < 1e-12 and name in ('zeta','tw2','lift'): sigma = 1.0 + 1e-3   # pole on the node: proxy, see RESULT
    return lib.logF(name, sigma, 1e-7).real
if __name__ == '__main__':
    out = []
    with Pool(6) as pool:
        for name, Ts in CASES:
            for sigma in SIG:
                if name == 'ea' and abs(sigma-0.8) < 1e-9: continue
                ks = list(range(1, N))
                near = pool.map(lib.task, [(name, sigma, k*d) for k in ks], chunksize=4)
                phi0 = diag(name, sigma)
                c0 = np.array([phi0] + near)            # phi(k d), k>=0
                idx = np.subtract.outer(np.arange(N), np.arange(N))
                G0 = np.where(idx >= 0, c0[np.abs(idx)], np.conj(c0[np.abs(idx)]))
                for T in Ts:
                    if T == 0: G = G0
                    else:
                        kk = list(range(-(N-1), N))
                        far = np.array(pool.map(lib.task, [(name, sigma, T + k*d) for k in kk], chunksize=4))
                        # C_jk = phi(u_j - (T+u_k)) = conj phi(T + (k-j) d)
                        C = np.conj(far[(-idx) + (N-1)])
                        G = np.block([[G0, C], [C.conj().T, G0]])
                    ev = np.linalg.eigvalsh((G + G.conj().T)/2)
                    rec = dict(F=name, sigma=sigma, T=T, n=G.shape[0], diag=phi0, min_eig=float(ev[0]), max_eig=float(ev[-1]), n_neg=int((ev < -1e-9*max(1,abs(ev[-1]))).sum()))
                    out.append(rec); print(json.dumps(rec), flush=True)
    json.dump(out, open('raw_gram.json', 'w'), indent=1)
