"""Higher-precision re-check of the zeta window whose minimal pair has Theta > 1/4 (largest such window among the first 1.0e8 zeros):
the six zeros around the pair are re-located with mpmath (30 digits, sign change of Z certified on a bracket), Theta is recomputed in mpmath
with E restricted to the window."""
import json, os, sys, numpy as np, mpmath as mp
import zf
mp.mp.dps = 30
r = json.load(open(os.path.join(zf.HERE, 'out', 'c1_static_zeta8.json')))
out = {}
for key in ('Nstar_0.25', 'Nstar_0.443'):
    w = r[key]; i = w['i']; N = w['Nstar']
    x = np.load(os.path.join(zf.BASE, zf.REG['zeta8'][0]), mmap_mode='r')
    lo = max(0, i - N - 2); seg = np.array(x[lo:i + N + 3]); k = i - lo
    ref = {}
    for j in range(k - 2, k + 4):
        t0 = mp.mpf(float(seg[j])); d = mp.mpf(min(seg[j] - seg[j - 1], seg[j + 1] - seg[j])) * mp.mpf('0.4')
        a, b = t0 - d, t0 + d; fa, fb = mp.siegelz(a), mp.siegelz(b); assert fa * fb < 0, 'no sign change'
        for _ in range(100):
            m = (a + b) / 2; fm = mp.siegelz(m)
            if fa * fm <= 0: b, fb = m, fm
            else: a, fa = m, fm
        ref[j] = (a + b) / 2
    xs = [mp.mpf(float(v)) for v in seg]
    for j, v in ref.items(): xs[j] = v
    g = np.diff(seg); best = None
    # all windows of N zeros in which pair k is the minimal pair
    for s0 in range(max(0, k - N + 2), k + 1):
        if s0 + N > len(seg): break
        if g[s0:s0 + N - 1].min() < g[k]: continue
        a, b = xs[k], xs[k + 1]; E = mp.mpf(0)
        for j in range(s0, s0 + N):
            if j in (k, k + 1): continue
            E += 1 / ((a - xs[j]) * (b - xs[j]))
        Th = (b - a) ** 2 * E / 2
        if best is None or Th > best[0]: best = (Th, s0 + lo)
    out[key] = dict(N=N, i=i, zeros_mp=[mp.nstr(ref[j], 22) for j in sorted(ref)], zeros_list=[repr(float(seg[j])) for j in sorted(ref)],
                    max_shift=float(max(abs(ref[j] - mp.mpf(float(seg[j]))) for j in ref)), Theta_window_mp=mp.nstr(best[0], 15), window_start_index=int(best[1]), Theta_window_float64=w['Theta_window'])
    print(key, out[key], flush=True)
json.dump(out, open(os.path.join(zf.HERE, 'out', 'c1_recheck_zeta8.json'), 'w'), indent=1)
