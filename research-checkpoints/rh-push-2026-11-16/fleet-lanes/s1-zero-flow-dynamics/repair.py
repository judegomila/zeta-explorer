"""Completeness repair of a zeta ordinate list by the counting function.
S_k = (k + 1) - theta(gamma_k)/pi - 1 is the value of S at the k-th zero (up to 1/2); a missed pair of zeros lowers it by 2 from there on.
Window means of S_k over 4000 zeros locate each step; the interval is recomputed with the close-pair finder on the exact interpolant
(zl.near_miss_pairs) and spliced in. Ends with the same scan on the repaired list.
Usage: repair.py LIST.npy OUT.npy"""
import sys, math, os
os.environ['RH_BACKEND'] = 'cpu'
import numpy as np, zl
def scan(g, w=4000):
    k = np.arange(len(g)); S = (k + 1) - zl.theta(np.maximum(g, 14.0)) / math.pi - 1
    n = len(g) // w; m = S[:n * w].reshape(n, w).mean(1)
    return m, w
g = np.load(sys.argv[1])
for rnd in range(3):
    m, w = scan(g)
    d = m[2:] - m[:-2]
    idx = np.nonzero(np.abs(d) > 1.0)[0]
    zl.log('round %d: zeros %d ; window means of S_k: min %.3f max %.3f ; windows with a step beyond 1.0: %d' % (rnd, len(g), m[2:].min(), m[2:].max(), len(idx)))
    if len(idx) == 0: break
    groups = []
    for i in idx:
        if groups and i - groups[-1][1] <= 3: groups[-1][1] = i
        else: groups.append([i, i])
    for a, b in groups[::-1]:
        ka = max(700, a * w - w); kb = min(len(g) - 1, (b + 3) * w + w)
        Ta = int(math.floor(g[ka])); Tb = int(math.ceil(g[kb]))
        new, nh, bad, ex = zl.zeta_block(Ta, Tb, 0.0, 2e7)
        lo = np.searchsorted(g, Ta); hi = np.searchsorted(g, Tb)
        zl.log('  interval [%d,%d): old zeros %d new zeros %d expected %.2f ; %s' % (Ta, Tb, hi - lo, len(new), ex, zl.roots_of_samples.last))
        if len(new) > hi - lo:
            old = g[lo:hi]; j = np.searchsorted(old, new); j = np.clip(j, 1, len(old) - 1)
            dist = np.minimum(np.abs(new - old[j - 1]), np.abs(new - old[j])); add = new[dist > 1e-6]
            zl.log('   added zeros: ' + ' '.join('%.9f' % v for v in add))
        g = np.concatenate([g[:lo], new, g[hi:]])
# second stage: every zero with a neighbour closer than 0.08 mean spacings is re-located on direct evaluations of the Riemann-Siegel sum
import gen_zeta
tot = 0; fail = 0; g0 = g.copy()
for Ta, Tb in gen_zeta.blocks(1000, int(g[-1]) + 1):
    lo = np.searchsorted(g, Ta); hi = np.searchsorted(g, Tb)
    if hi - lo < 3: continue
    sp = 2 * math.pi / math.log(Tb / (2 * math.pi))
    new, nref, nf = zl.refine_close(g[lo:hi], lambda t: zl.sample_Z(Ta, t - Ta, 0.0, 2e7), sp)
    g[lo:hi] = new; tot += nref; fail += nf
zl.log('close-pair refinement: %d zeros re-located by direct evaluation, %d brackets without sign change ; largest move %.3e ; largest relative change of a gap below 0.01 %.3e' % (
    tot, fail, np.abs(g - g0).max(), np.abs(np.diff(g) / np.diff(g0) - 1)[np.diff(g0) < 0.01].max() if (np.diff(g0) < 0.01).any() else 0.0))
N = len(g); Tm = float(g[-1])
zl.log('final zeros %d ; (N) - theta(gamma_N)/pi - 1 = %+.2f ; monotone %s ; min raw gap %.4e' % (N, N - zl.theta(np.array([Tm]))[0] / math.pi - 1, bool((np.diff(g) > 0).all()), np.diff(g).min()))
np.save(sys.argv[2], g)
