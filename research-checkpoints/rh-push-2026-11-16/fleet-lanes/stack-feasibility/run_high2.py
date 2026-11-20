"""Second pass: least mass of other off-line zeros that hides the quartet (relaxed measure model, |sigma| <= 3/8 or 1/2)."""
import numpy as np, mpmath as mp, json, sys
from lib import *; from lp import *
mp.mp.dps = 45
d = json.load(open('zeros_3e12.json')); t0 = mp.mpf(d['t0']); zt = np.array(d['zeros_tau']); th1 = d['theta1']; dens = th1/np.pi
Ls = [float(x) for x in sys.argv[1:]] or [6.0, 8.0, 10.0, 12.0, 13.0, 14.0, 15.0, 16.0]
n, lam = prime_powers(int(np.exp(max(Ls)))); ph = phases(n, t0)
zi = np.where(np.abs(zt[:-1]) < 4)[0]; i = zi[np.argmin(np.diff(zt)[zi])]; j = zi[np.argmax(np.diff(zt)[zi])]
tqs = {'pair': (zt[i]+zt[i+1])/2, 'gap': (zt[j]+zt[j+1])/2}
out = []
for L in Ls:
    m = 3; tj = np.arange(-5.0, 5.0+1e-9, np.pi/(2*L)); b = b_primes(tj, L, m, t0, n, lam, ph)
    for smax, ns in ((0.375, 7), (0.5, 9)):
        M = build(L, m, b, tj, 35.0, dens, list(np.linspace(0, smax, ns)))
        for nm, tq in tqs.items():
            row = dict(L=L, smax=smax, at=nm)
            for delta in (0.05, 0.1, 0.2, 0.3, 0.375):
                row[str(delta)] = min_offline(M, delta, tq)
            out.append(row); print(row, flush=True)
    json.dump(out, open('min_offline.json', 'w'), indent=1)
