import numpy as np, math, sys, mpmath as mp
from model import *
f = sys.argv[1]; D = np.load(f); T0 = float(D['T0']); zs = D['zeros']; d = D['d']; Z = D['z']
L0 = math.log(T0 / (2 * math.pi)); dens = L0 / (2 * math.pi)
print('T0 %.4g zeros %d density %.4f mean gap %.4f' % (T0, len(zs), dens, 1 / dens))
mp.mp.dps = 25
def zeta_abs(sig, t): return float(abs(mp.zeta(mp.mpc(sig, T0 + t))))
for t0sel in ['center', 'minext']:
  for h in [2.5, 5, 10, 25, 50]:
    for delta in [0.085, 0.495]:
        if t0sel == 'center':
            i = np.argmin(np.abs(zs)); t0 = 0.5 * (zs[i] + zs[i + 1]) if zs[i] < 0 else 0.5 * (zs[i - 1] + zs[i])
        else:
            # extremum of smallest |Z| within |t| < 5
            mids = [(abs(Z[(d > zs[i]) & (d < zs[i + 1])]).max(), d[(d > zs[i]) & (d < zs[i + 1])][np.argmax(abs(Z[(d > zs[i]) & (d < zs[i + 1])]))]) for i in range(len(zs) - 1) if abs(zs[i]) < 5]
            t0 = min(mids)[1]
        m = build(zs, t0, h, delta)
        w, r, res = new_roots(m)
        nnr = int(np.sum(np.abs(w.imag) > 1e-9))
        out = pulls(w, zs[np.abs(zs - t0) > h], dens / 2, 2 * (62 - abs(t0)))
        viol = [o for o in out if o[2] and o[1] >= 0.165 and o[4] < PREQ]
        row = 'sel=%s t0=%+.4f h=%4.1f k=%3d delta=%.3f | nonreal %3d viol(mirror,t=0) %2d res %.1e |' % (t0sel, t0, h, len(m['g']), delta, nnr, len(viol), res)
        for a in [0.5, 1.5, 2.5]:
            if a <= delta: row += ' a=%.1f: -- ' % a; continue
            E, tauE, Ec = E_line(m, a)
            pred = zeta_abs(0.5 + delta, t0) / zeta_abs(0.5 + a, t0) * math.exp(-(a - delta) * L0 / 2)
            row += ' a=%.1f: E=%.3e (tau %+.1f) pred=%.3e ratio %.2f |' % (a, E, tauE, pred, Ec / pred)
        print(row)
        if viol:
            b = min(viol, key=lambda o: o[4]); print('    best violator: ord %+.4f y %.3f P %.3f M0 %.3f' % (b[0], b[1], b[3], b[4]))
