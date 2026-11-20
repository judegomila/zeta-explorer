"""Zeta ordinate lists.
  gen_zeta.py first TMAX OUT.npy            first zeros up to height TMAX (mpmath below 1000, Riemann-Siegel above)
  gen_zeta.py window T0 NZ TAU OUT.npy      about NZ zeros above T0 of the heat-deformed Riemann-Siegel sum (TAU unfolded; 0 = zeta)
Each block is checked against the counting function."""
import sys, math, os
NW = int(os.environ.get("RH_WORKERS", "4"))
os.environ["RH_BACKEND"] = "cpu"; os.environ["OMP_NUM_THREADS"] = "1"; os.environ["OPENBLAS_NUM_THREADS"] = "1"
import numpy as np, mpmath as mp
from multiprocessing import Pool
import zl

def work(a):
    Ta, Tb, tau = a
    return (Ta, Tb) + zl.zeta_block(Ta, Tb, tau, budget=2e7)

def low_zero(n):
    mp.mp.dps = 20
    return float(mp.zetazero(n).imag)

def blocks(Ta, Tmax, maxsamp=3e6):
    T = Ta; out = []
    while T < Tmax:
        L = math.log(max(T, 10) / (2 * math.pi)); h = 2 * math.pi / L / 4
        Tb = min(Tmax, int(min(T * 1.4, T + maxsamp * h)))
        if Tb <= T: Tb = Tmax
        out.append((T, Tb)); T = Tb
    return out

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'first':
        Tmax = int(float(sys.argv[2])); out = sys.argv[3]
        nlow = 649  # zeros below 1000
        with Pool(int(os.environ.get('RH_WORKERS', '4'))) as p: low = np.array(p.map(low_zero, range(1, nlow + 1), chunksize=8))
        assert low[-1] < 1000 < low_zero(nlow + 1)
        parts = [low]; hid = 0
        bl = [(a_, b_, 0.0) for a_, b_ in blocks(1000, Tmax)]
        zl.log('blocks', len(bl), 'workers', NW)
        with Pool(NW) as p: resl = p.map(work, bl[::-1], chunksize=1)[::-1]
        for Ta, Tb, g, nh, bad, ex in resl:
            parts.append(g); hid += nh
            if abs(len(g) - ex) > 2.5 or bad: zl.log('block [%d,%d) zeros %d expected %.2f diff %+.2f hidden %d orderviol %d' % (Ta, Tb, len(g), ex, len(g) - ex, nh, bad))
        zl.log('max |count - expected| over blocks %.2f' % max(abs(len(r[2]) - r[5]) for r in resl))
        g = np.concatenate(parts)
        N = len(g); Nth = float(zl.theta(np.array([float(Tmax)]))[0] / math.pi + 1)
        zl.log('TOTAL zeros %d ; theta(Tmax)/pi + 1 = %.2f ; S(Tmax) implied %+.2f ; hidden %d ; monotone %s' % (N, Nth, N - Nth, hid, bool((np.diff(g) > 0).all())))
        np.save(out, g)
    else:
        T0 = int(float(sys.argv[2])); nz = int(float(sys.argv[3])); tau = float(sys.argv[4]); out = sys.argv[5]
        L = math.log(T0 / (2 * math.pi)); Tb = int(T0 + nz * 2 * math.pi / L)
        parts = []; ex_t = 0.0; hid = 0
        with Pool(NW) as p: resl = p.map(work, [(a_, b_, tau) for a_, b_ in blocks(T0, Tb, 4e5)], chunksize=1)
        for Ta, Tbb, g, nh, bad, ex in resl: parts.append(g); ex_t += ex; hid += nh
        g = np.concatenate(parts)
        zl.log('window T0=%d tau=%g real zeros %d expected(all) %.2f deficit %.2f hidden %d' % (T0, tau, len(g), ex_t, ex_t - len(g), hid))
        np.save(out, g)
        np.save(out.replace('.npy', '.meta.npy'), np.array([T0, Tb, tau, len(g), ex_t]))
