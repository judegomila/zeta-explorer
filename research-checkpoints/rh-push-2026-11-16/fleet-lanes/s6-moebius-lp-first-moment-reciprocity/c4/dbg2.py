import numpy as np, math, mpmath as mp, os
os.environ['HOLE_GPU'] = '0'
import hole
def zexact(obj, t):
    mp.mp.dps = 30
    q, kappa, per = hole.OBJS[obj]
    s = mp.mpf(1) / 2 + 1j * mp.mpf(t)
    F = sum(per[r] * mp.zeta(s, mp.mpf(r) / q) for r in range(1, q) if per[r] != 0) / mp.mpf(q) ** s
    th = mp.mpf(t) / 2 * mp.log(mp.mpf(q) / mp.pi) + mp.im(mp.loggamma((mp.mpf(1) / 2 + kappa + 1j * mp.mpf(t)) / 2))
    return float(mp.re(mp.exp(1j * th) * F))
# far end of a long block: same code path as the production run (T0 = 1e6, window index 39990)
r = hole.compute('chi4', '1000000', 40000, A=0.01, pps=10, verbose=False) if False else None
q, kappa, per = hole.OBJS['chi4']
d, hs, npw = hole.grid(1e6, 40000, q, 10)
print('block length', d[-1], 'last step', hs[-1])
# evaluate the production formula on the last 2 windows only, by calling compute on a shifted start and on the original base
import types
def compute_at(obj, T0s, dsel):
    # same formulas as hole.compute, restricted to offsets dsel
    q, kappa, per = hole.OBJS[obj]; T0 = float(T0s); A = 0.01
    tmax = T0 + dsel.max(); Lmax = 2 * math.sqrt(A) * 4.6
    ncut = int(math.sqrt(q * tmax / (2 * math.pi)) * math.exp(Lmax)) + 2
    ph, spf = hole.phase_table(T0s, ncut); th0 = hole.theta0(T0s, q, kappa)
    n = np.arange(1, ncut + 1, dtype=np.float64); logn = np.log(n); c = per[np.arange(1, ncut + 1) % q]; amp = c / np.sqrt(n)
    from scipy.special import erfc
    out = []
    for dd in dsel:
        t = T0 + dd; logN0 = 0.5 * math.log(q * t / (2 * math.pi))
        V = 0.5 * erfc((logn - logN0) / (2 * math.sqrt(A))) * amp
        P = -dd * logn + ph[1:]
        th = th0 + hole.dtheta(T0, dd, q)
        out.append(2 * (math.cos(th) * (np.cos(P) @ V) - math.sin(th) * (np.sin(P) @ V)))
    return np.array(out)
dsel = d[-340::37]
za = compute_at('chi4', '1000000', dsel)
ex = np.array([zexact('chi4', mp.mpf(1000000) + mp.mpf(float(x))) for x in dsel])
print('max err far end (base 1e6):', np.abs(za - ex).max(), 'values', np.round(za[:5], 4), np.round(ex[:5], 4))
