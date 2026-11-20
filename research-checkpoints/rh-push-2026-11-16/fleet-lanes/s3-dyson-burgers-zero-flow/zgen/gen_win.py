"""Window of zeta zeros above T0, saved as offsets from T0 (float64 offsets keep the gaps exact to 1e-10 at T0 = 1e12).
usage: gen_win.py T0 NZ OUT.npy   (single process; GPU through zl when available, numpy otherwise)"""
import sys, math, os, numpy as np, mpmath as mp
import zl, rsz as R

def block_off(Ta, Tb, budget):
    W = R.W
    Lend = math.log(Tb / (2 * math.pi)); h = 2 * math.pi / Lend / R.OS
    pad = (W + 6) * h
    J = int((Tb - Ta + 2 * pad) / h) + 2
    deltas = -pad + h * np.arange(J)
    S = zl.sample_Z(Ta, deltas, 0.0, budget)
    rc, nh, bad = zl.roots_of_samples(S)
    off = -pad + rc * h
    off, nref, nfail = zl.refine_close(off, lambda t: zl.sample_Z(Ta, t, 0.0, budget), 4 * h)
    off = off[(off >= 0) & (off < Tb - Ta)]
    mp.mp.dps = 40
    ex = float((mp.siegeltheta(mp.mpf(Tb)) - mp.siegeltheta(mp.mpf(Ta))) / mp.pi)
    return off, nh, bad, ex, nref, nfail, dict(zl.roots_of_samples.last)

if __name__ == '__main__':
    T0 = int(float(sys.argv[1])); nz = int(float(sys.argv[2])); out = sys.argv[3]
    budget = float(os.environ.get('RH_BUDGET', '2.5e8'))
    L = math.log(T0 / (2 * math.pi)); span = int(nz * 2 * math.pi / L) + 1
    BL = int(os.environ.get('RH_BLOCK', '20000'))
    zl.log('backend GPU' if zl.GPU else 'backend numpy', 'T0', T0, 'span', span, 'planned chunk %.1f GB' % (budget * 8 / 1e9))
    parts = []; tot_ex = 0.0; hid = 0
    for a in range(0, span, BL):
        b = min(span, a + BL)
        off, nh, bad, ex, nref, nfail, last = block_off(T0 + a, T0 + b, budget)
        parts.append(a + off); tot_ex += ex; hid += nh
        zl.log('block [%d,%d) zeros %d expected %.2f diff %+.2f hidden %d orderviol %d refined %d refine_fail %d %s' % (a, b, len(off), ex, len(off) - ex, nh, bad, nref, nfail, last))
        np.save(out, np.concatenate(parts))
    g = np.concatenate(parts)
    zl.log('TOTAL zeros %d expected %.2f diff %+.2f hidden %d monotone %s' % (len(g), tot_ex, len(g) - tot_ex, hid, bool((np.diff(g) > 0).all())))
    np.save(out, g); np.save(out.replace('.npy', '.meta.npy'), np.array([T0, span, len(g), tot_ex]))
