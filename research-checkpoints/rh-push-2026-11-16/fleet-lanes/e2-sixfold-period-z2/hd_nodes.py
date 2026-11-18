"""hd_nodes.py -- on all squarefree nodes of tmp/sextic/data/sf_1e6.npz (read-only):
(i) mu(c) = gamma_2(c)^3 conj(alpha(c)) and gamma_1 = G gamma_2^2 (Hasse-Davenport / manuscript (4.7));
(ii) Lemma L: gamma_2 = mu alpha G conj(gamma_1);
(iii) is the Z/2 Gauss factor G(c) = conj(chi_c(4)) gamma_3(c) a function of the class of c mod 4 (ray-class datum)?
Planned memory: ~3e5 nodes x a few complex arrays (< 100 MB)."""
import sys, os, json
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A
T = A.SFTable(SX + '/data/sf_1e6.npz')
c = T.na - T.nb / 2 + 1j * T.nb * np.sqrt(3) / 2
alpha = c / np.abs(c); G = T.G(); mu = T.mu.astype(float)
out = {'n_nodes': int(T.n),
       'max|g2^3 conj(alpha) - mu|': float(np.max(np.abs(T.g2 ** 3 * np.conj(alpha) - mu))),
       'max|g1 - G g2^2|': float(np.max(np.abs(T.g1 - G * T.g2 ** 2))),
       'max|g2 - mu alpha G conj(g1)|': float(np.max(np.abs(T.g2 - mu * alpha * G * np.conj(T.g1))))}
per = {}
for cl in np.unique(T.m4):
    v = G[T.m4 == cl]
    per[int(cl)] = {'count': int(len(v)), 'value': [float(np.round(v[0].real, 9)), float(np.round(v[0].imag, 9))],
                    'max_dev_within_class': float(np.max(np.abs(v - v[0])))}
out['G_by_class_mod4'] = per
print(json.dumps(out, indent=1))
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'hd_nodes.json'), 'w'), indent=1)
