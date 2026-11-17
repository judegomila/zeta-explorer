# off-line zeros of the single-class Eisenstein value E(z_A, s), z_A = (-1+i sqrt 23)/4 (form [2,1,3], D=-23, h=3)
from runlib import *
zA = complex(-0.25, 23**0.5/4)
sig = np.arange(0.54, 1.5, 0.04); ts = np.arange(1.0, 60.0, 0.2)
V = np.array([[abs(eis(zA, complex(a, t))) for t in ts] for a in sig])
cands = []
for i in range(1, len(sig)-1):
    for j in range(1, len(ts)-1):
        v = V[i, j]
        if v < V[i-1:i+2, j-1:j+2].flatten()[[0, 1, 2, 3, 5, 6, 7, 8]].min(): cands.append((sig[i], ts[j], v))
roots = []
for a, t, v in cands:
    try:
        r = mp.findroot(lambda s: mp.mpmathify(eis(zA, s)), mp.mpc(a, t), tol=1e-14)
        if 0.5+1e-6 < r.real < 2 and abs(eis(zA, r)) < 1e-10 and all(abs(r-q) > 1e-6 for q in roots): roots.append(r)
    except Exception as e: pass
for r in sorted(roots, key=lambda r: r.imag): print("zero", mp.nstr(r, 15), "|E|", abs(eis(zA, r)), "|E principal|", abs(eis(pullback(complex(-0.5, 23**0.5/2)), r)))
json.dump([[float(r.real), float(r.imag)] for r in sorted(roots, key=lambda r: r.imag)], open("t3_zeros.json", "w"))
