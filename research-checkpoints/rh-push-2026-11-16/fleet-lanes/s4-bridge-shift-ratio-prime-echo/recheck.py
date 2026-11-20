"""re-check of the GPU float64 sums of echo.py in 80-bit long double on the CPU (x86), at a few sample points per height.
usage: recheck.py <echo_raw.npz> <Pmax> <out.json> [npt=3]   compares ZETA:sharp, SGN:sharp, LIOU:sharp, CHI4:sharp at checkpoint Pmax"""
import sys, json, math, numpy as np
import echo
z = np.load(sys.argv[1]); P = float(sys.argv[2]); npt = int(sys.argv[4]) if len(sys.argv) > 4 else 3
T = echo.terms(P); LD = np.longdouble
p = T['p'].astype(LD); m = T['m'].astype(LD); logn = np.log(p) * m; lam = np.log(p)
print('long double mantissa bits', np.finfo(LD).nmant, flush=True)
odd = (T['m'] % 2 == 1)
coef = dict(ZETA=np.ones(len(p), LD), SGN=np.where(odd, T['eps'], 1.0).astype(LD), LIOU=np.where(odd, -1.0, 1.0).astype(LD), CHI4=(T['chi4'] ** T['m']).astype(LD))
out = []
for H in sorted({k[2:] for k in z.files if k.startswith('t_')}, key=float):
    t = z['t_' + H]
    for i in np.linspace(0, len(t) - 1, npt).astype(int):
        c = np.cos(LD(t[i]) * logn)
        rec = dict(H=float(H), t=float(t[i]), maxdiff={})
        s = (0.5 + echo.X) + 1j * t[i]
        for nm, cf in coef.items():
            G = echo.drift('CHI4' if nm == 'CHI4' else 'ZETA', s)
            d = 0.0
            for j, x in enumerate(echo.X):
                if j not in (0, 8, 14): continue
                tr = float((cf * lam * c * np.exp(-(LD(0.5) + LD(x)) * logn)).sum())
                d = max(d, abs((G[j] - tr) - z['%s|%s:sharp|%g' % (H, nm, P)][i, j]))
            rec['maxdiff'][nm] = d
        out.append(rec); print(rec, flush=True)
json.dump(out, open(sys.argv[3], 'w'), indent=1)
