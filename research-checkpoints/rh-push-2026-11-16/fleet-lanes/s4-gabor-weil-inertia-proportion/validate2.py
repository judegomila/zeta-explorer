"""Known-answer check of c2_pair, c3_zero, c4_nv on a CUE sample (sine process: S2 = C(w), moments 1, 4/3, 2, 13/4, number variance = sine-kernel value)."""
import sys, math, json, numpy as np, lists
PI = math.pi
rng = np.random.default_rng(11); n = 4000
A = (rng.normal(size=(n, n)) + 1j * rng.normal(size=(n, n))) / math.sqrt(2)
Q, R = np.linalg.qr(A); Q = Q * (np.diag(R) / np.abs(np.diag(R)))
x = np.sort(np.angle(np.linalg.eigvals(Q))) * n / (2 * PI); x -= x[0]
fake = dict(name='CUE', t=1e6 + x * 2 * PI / math.log(1e6 / (2 * PI)), x=x, q=1)
lists.load = lambda name, tmin=None: fake
import c2_pair, c3_zero, c4_nv
sys.argv = ['c2', 'out/val_c2.json', 'CUE', '4000', '300', '10']; c2_pair.main()
sys.argv = ['c3', 'out/val_c3.jsonl', 'CUE', '3000', '1']; c3_zero.main()
sys.argv = ['c4', 'out/val_c4.json', 'CUE']; c4_nv.main()
