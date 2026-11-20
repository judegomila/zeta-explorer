"""Literal decisive test for zeta in float64: Gram matrix of {D_p K_gamma} (25 primes p <= 97, 200 zeros)
in the H_c form.  D_p K_gamma = -p^{-1/2} 1_(0, 2 log p](u) K_gamma(u) in the coordinate u = c - position,
K_gamma(u) = int_0^inf kappa(u + r) e^{i gamma r / 2} dr (vector representing y_gamma on tests left of c).
Gram = C^* M C with M the node matrix of defect_gram.py (midpoint rule in u, spacing h).
float64 can only resolve relative 1e-16: this is a sanity check of the sign, not a certificate."""
import sys, json, math
import numpy as np
sys.argv = ['x', '--dps', '60', '--kernel', 'zeta', '--P', '97', '--h', '0.05', '--m', '80']
src = open('defect_gram.py').read()
exec(src.split("def mag10")[0])          # builds nodes, quadrature, B0, B1, M (arb, dps 60)
zeros = json.load(open('../c1-spinor-hecke-primitive/zeta_zeros_330.json'))[:200]
d = [float(abs(M[i, i]).sqrt().mid()) if abs(M[i, i]) > arb('1e-600') else 0.0 for i in range(n)]
keep = [i for i in range(n) if d[i] > 1e-150]
print('nodes with sqrt(M_ii) above 1e-150 (others contribute below float range):', len(keep), 'of', n)
Ms = np.array([[float((M[i, j] / (abs(M[i, i]) * abs(M[j, j])).sqrt()).mid()) for j in keep] for i in keep])
A = np.array([[float((kap(arb(nodes[i]) + rn[j]) * rw[j] * abs(M[i, i]).sqrt()).mid()) for j in range(Nr)] for i in keep])
r = np.array([float(x.mid()) for x in rn]); g = np.array(zeros)
K = A @ np.exp(0.5j * np.outer(r, g))                       # K[i, gamma] * sqrt(M_ii)
u = np.array([nodes[i] for i in keep])
cols = []; lab = []
for p in primes:
    mask = (u <= 2 * math.log(p)).astype(float)[:, None]
    cols.append(-(p ** -0.5) * mask * K * args.h); lab += [p] * len(g)
C = np.concatenate(cols, axis=1)
print('C shape', C.shape, ' planned Gram', C.shape[1], 'x', C.shape[1], 'complex128 =', C.shape[1] ** 2 * 16 / 1e6, 'MB')
G = C.conj().T @ Ms @ C
G = (G + G.conj().T) / 2
w = np.linalg.eigvalsh(G)
print('Gram eigenvalues: max %.6e  min %.3e  min/max %.3e' % (w[-1], w[0], w[0] / w[-1]))
for thr in (1e-6, 1e-10, 1e-13):
    print('  count > %g*max: %d   count < -%g*max: %d' % (thr, (w > thr * w[-1]).sum(), thr, (w < -thr * w[-1]).sum()))
json.dump({'max': float(w[-1]), 'min': float(w[0]), 'npos_1e-13': int((w > 1e-13 * w[-1]).sum()),
           'nneg_1e-13': int((w < -1e-13 * w[-1]).sum()), 'shape': list(G.shape)}, open('literal_zeta.json', 'w'))
