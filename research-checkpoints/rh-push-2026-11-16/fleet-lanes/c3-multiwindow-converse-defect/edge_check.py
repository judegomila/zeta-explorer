"""Which primes carry the weak directions of the phase Jacobian at zeta (T = 1e5, cluster, m = 16)?"""
import numpy as np, json
from mw import *
T = 1e5; N = int(round(3.2 * np.sqrt(T / (2 * np.pi)))); ps = primes_upto(N); P = len(ps); E = expo_matrix(N, ps)
hs = heights(T, "cluster", 16); print(f"planned: rows {16*K*(J-1)} x {N} complex x2 = {16*K*(J-1)*N*32/1e6:.0f} MB")
Rm = compress(np.vstack([compress(realmap(*window_rows(Tj, N))) for Tj in hs]))
Jz = Rm[:, N:] @ E; U, s, Vt = np.linalg.svd(Jz, full_matrices=False)
weak = Vt[s < 1e-5]; wt = (weak**2).sum(0)          # weight of each prime in the weak subspace
order = np.argsort(-wt); top = [(ps[i], round(float(wt[i]), 3)) for i in order[:14]]
colnorm = np.linalg.norm(Jz, axis=0)
out = dict(n_weak=int((s < 1e-5).sum()), N=N, top_primes_in_weak_subspace=top, weight_on_primes_above_0p8N=float(wt[np.array(ps) > 0.8 * N].sum()),
           colnorm_by_prime=[(ps[i], float(colnorm[i])) for i in range(P - 14, P)])
print(json.dumps(out)); json.dump(out, open("edge_check.json", "w"))
