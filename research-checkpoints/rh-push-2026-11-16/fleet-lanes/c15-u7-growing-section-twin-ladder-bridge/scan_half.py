# Long scan at theta = 1/2: heights [T0, T0+LEN], P = t^(1/2) per block of 200. Fejer section, min Re L and fraction < 0.
# classes: zeta, Liouville, 24 random completely multiplicative signs. float64. Memory: 16 MB per block.
import sys, json, numpy as np
from scipy.special import digamma
T0 = float(sys.argv[1]); LEN = float(sys.argv[2]); TH = float(sys.argv[3]); DT = 0.02; NSEED = 24
PM = int((T0+LEN)**TH) + 2
sv = np.ones(PM+1, bool); sv[:2] = False
for i in range(2, int(PM**0.5)+1):
    if sv[i]: sv[i*i::i] = False
pr = np.nonzero(sv)[0]
eps = np.stack([np.random.default_rng(1000+k).integers(0, 2, size=len(pr))*2 - 1 for k in range(NSEED)]).astype(float)
nb = int(LEN/200); mn = np.full(NSEED+2, np.inf); neg = np.zeros(NSEED+2); tot = 0; tmin = np.zeros(NSEED+2); l1max = 0; zmin_hist = []
for b in range(nb):
    t = T0 + 200*b + DT*np.arange(10000); tc = T0 + 200*b + 100; P = tc**TH; u = np.log(P); s = 0.5 + 1j*t
    K = lambda w: 1/w - (1 - np.exp(-u*w))/(u*w*w)
    z = s/2; tr = 1/z + 1/(2*z**2) + 1/(6*z**3)
    gam = (K(s) + K(s-1) + 0.5*digamma(s/2) - 0.5*np.log(np.pi) + 0.25*tr/u - np.exp(-u*s)/(u*s*s)).real
    ln = []; lam = []; sg = []; kk = []
    for j, p in enumerate(pr):
        if p > P: break
        q = p; k = 1
        while q <= P: ln.append(np.log(q)); lam.append(np.log(p)); sg.append(eps[:, j]**k); kk.append(k); q *= p; k += 1
    ln = np.array(ln); lam = np.array(lam); sg = np.array(sg).T; kk = np.array(kk)
    base = lam*np.exp(-0.5*ln)*(1 - ln/u)
    C = np.vstack([base, base*(-1.0)**kk, base*sg])
    R = gam[None, :] - (C @ np.exp(-1j*np.outer(ln, t))).real
    m = R.min(axis=1); am = R.argmin(axis=1)
    upd = m < mn; tmin[upd] = t[am[upd]]; mn = np.minimum(mn, m); neg += (R < 0).sum(axis=1); tot += R.shape[1]
out = dict(T0=T0, LEN=LEN, theta=TH, samples=tot, zeta=dict(min=float(mn[0]), neg=int(neg[0])), liouville=dict(min=float(mn[1]), neg=int(neg[1]), t=float(tmin[1])),
           rand=dict(min=[float(x) for x in mn[2:]], neg=[int(x) for x in neg[2:]], tmin=[float(x) for x in tmin[2:]]))
json.dump(out, open('out/scan_T%g_L%g_th%g.json' % (T0, LEN, TH), 'w'))
print("T0 %g LEN %g theta %g samples %d | zeta min %.4f neg %d | liouville min %.4f neg %d | random: seeds with neg %d/24, total neg samples %d, min over seeds %.4f, median min %.4f" % (T0, LEN, TH, tot, mn[0], neg[0], mn[1], neg[1], (neg[2:] > 0).sum(), neg[2:].sum(), mn[2:].min(), np.median(mn[2:])))
