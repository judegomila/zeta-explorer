"""known-answer check of hl.py at X = 5e7: FFT correlations against a direct count for several h, the twin-prime weighted sum, singular series values."""
import os, sys, json, math, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import hl, hl_analyse, psnu
if __name__ == '__main__':
    out = os.path.join(HERE, 'out', 'test_hl.npz')
    hl.run(5.1e7, 2, out, log=print, lean_from=None)
    z = np.load(out); X = int(z['X'][-1]); k2 = z['k2'][-1]; kt = z['kt'][-1]
    ps = psnu.small_primes(X + 20000); isp = np.zeros(X + 20001, dtype=bool); isp[ps] = True; isp[2] = False
    lg = np.zeros(X + 20001); lg[ps] = np.log(ps); lg[2] = 0
    # hl.py counts n in [3, 2*SEG*nseg + 1) ; X is the checkpoint
    nmax = X + 1
    res = {}
    for h in (2, 6, 30, 210, 9998):
        d = float(np.sum(lg[3:nmax] * lg[3 + h:nmax + h])); f = k2[0, h // 2].real
        print('h=%d  direct %.6f  fft %.6f  diff %.2e   S(h) X = %.1f' % (h, d, f, f - d, hl_analyse.S2(h) * X)); res['h%d' % h] = [d, f]
    T = (0, 2, 6); d = float(np.sum(lg[3:nmax] * lg[5:nmax + 2] * lg[9:nmax + 6])); print('triple (0,2,6): direct %.6f  gather %.6f   S X = %.1f' % (d, kt[0, 0].real, hl_analyse.Sk(T) * X))
    res['triple'] = [d, float(kt[0, 0].real)]
    print('singular series: S(0,2) = %.10f (2 C2 = 1.3203236317)  S(0,2,6) = %.6f (literature 2.858248596)  S(0,2,6,8) = %.6f (literature 4.151180864)' % (hl_analyse.S2(2), hl_analyse.Sk((0, 2, 6)), hl_analyse.Sk((0, 2, 6, 8))))
    hl_analyse.main(out, os.path.join(HERE, 'out', 'test_hl.json'))
    # parts: two halves must reproduce the full run
    for k in (0, 1): hl.run(5.1e7, 1, os.path.join(HERE, 'out', 'test_hl_p%d.npz' % k), log=lambda s: None, part=(k, 2), lean_from=None)
    zs = [np.load(os.path.join(HERE, 'out', 'test_hl_p%d.npz' % k)) for k in (0, 1)]
    k2m = np.cumsum(zs[0]['k2_part'] + zs[1]['k2_part'], axis=0)
    print('parts merged against the full run: max abs diff %.2e' % np.max(np.abs(k2m - z['k2'])))
    hl.run(5.1e7, 2, os.path.join(HERE, 'out', 'test_hl_lean.npz'), log=lambda s: None, lean_from=1.68e7)
    zl = np.load(os.path.join(HERE, 'out', 'test_hl_lean.npz'))
    print('lean run: ZETA, RSGN max diff %.2e; others equal up to full_upto=%.3g: %s' % (np.max(np.abs(zl['k2'][:, :2] - z['k2'][:, :2])), float(zl['full_upto']), bool(np.allclose(zl['k2'][:2], z['k2'][:2]))))
    hl_analyse.main([os.path.join(HERE, 'out', 'test_hl_p%d.npz' % k) for k in (0, 1)], os.path.join(HERE, 'out', 'test_hl_merged.json'))
