"""Onset support a* (first a with lambda_min < -1e-7) of each control's Weil form, bisection in a; float64; frequencies up to wmax."""
import sys, json, math, numpy as np
import ctl, combo3
wmax = float(sys.argv[2]); res = []
for code, lo, hi in (('DH', 1.5, 2.2), ('TNR', 0.5, 0.75), ('EA-1/8', 0.3, 0.9), ('EA-1/4', 0.3, 0.6), ('EA-1/2', 0.25, 0.45), ('SGN-LIOU', 0.25, 0.45)):
    vc = ctl.coeffs(code, math.exp(2 * hi) * 1.001)
    f = lambda a: combo3.analyse(code, a, wmax, vc)
    rl, rh = f(lo), f(hi)
    assert rl['lam_min'] > -1e-7 and rh['lam_min'] < -1e-7, (code, rl, rh)
    while hi - lo > 2e-3:
        mid = (lo + hi) / 2; r = f(mid)
        if r['lam_min'] < -1e-7: hi, rh = mid, r
        else: lo, rl = mid, r
    res.append(dict(code=code, a_pos=lo, a_neg=hi, lam_at_pos=rl['lam_min'], lam_at_neg=rh['lam_min'], peak_freq_neg=rh['vec_peak_freq'], wmax=wmax))
    print('ONSET', json.dumps(res[-1]), flush=True)
json.dump(res, open(sys.argv[1], 'w'), indent=0)
