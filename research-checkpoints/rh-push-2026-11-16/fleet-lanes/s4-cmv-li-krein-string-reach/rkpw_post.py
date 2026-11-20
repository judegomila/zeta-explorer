"""S-fraction coefficients from the RKPW Jacobi coefficients: q_1 = alpha_0, e_k = beta_k/q_k, q_{k+1} = alpha_k - e_k.
Compares with the exact (Taylor-data) coefficients when a hankel.py dump is given."""
import sys, json, numpy as np
raw = np.fromfile(sys.argv[1]).reshape(-1, 4)
al = raw[:, 0].astype(np.longdouble) + raw[:, 1]; be = raw[:, 2].astype(np.longdouble) + raw[:, 3]
n = len(al); q = np.zeros(n, dtype=np.longdouble); e = np.zeros(n, dtype=np.longdouble)
q[0] = al[0]
for k in range(1, n):
    e[k] = be[k] / q[k - 1]; q[k] = al[k] - e[k]
co = np.empty(2 * n - 1, dtype=np.longdouble); co[0::2] = q; co[1::2] = e[1:]
out = dict(n_jacobi=n, total_length_s0=float(be[0]), n_coeff=len(co), n_nonpositive=int(np.sum(co <= 0)),
           first_nonpositive=(int(np.argmax(co <= 0)) + 1 if np.any(co <= 0) else None))
j = np.arange(1, len(co) + 1)
samp = [1, 2, 3, 10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000, 199999]
out['samples'] = {int(i): float(co[i - 1]) for i in samp if i <= len(co)}
# local power-law exponents of the geometric mean of neighbouring coefficients
lg = np.log(np.abs(co).astype(float))
def slope(a, b):
    m = (j >= a) & (j < b); return float(np.polyfit(np.log(j[m]), lg[m], 1)[0])
out['loglog_slope'] = {('%d-%d' % (a, b)): slope(a, b) for a, b in ((10, 100), (100, 1000), (1000, 10000), (10000, 100000), (100000, 200000)) if b <= len(co) + 1}
# sum of odd-indexed/even-indexed coefficients (partial sums)
out['partial_sums'] = {int(k): [float(np.sum(co[0:k:2])), float(np.sum(co[1:k:2]))] for k in (100, 1000, 10000, 100000, len(co)) if k <= len(co)}
if len(sys.argv) > 3:
    ex = json.load(open(sys.argv[3]))['coeff']
    ex = np.array([float(x) for x in ex]); m = min(len(ex), len(co))
    rel = np.abs(co[:m].astype(float) / ex[:m] - 1)
    out['vs_exact'] = {int(i): float(rel[i - 1]) for i in (1, 2, 10, 50, 100, 200, 400, 800, 1200, 1500) if i <= m}
    out['vs_exact_max_first_100'] = float(rel[:100].max())
json.dump(out, open(sys.argv[2], 'w'), indent=1); print(json.dumps(out, indent=1))
