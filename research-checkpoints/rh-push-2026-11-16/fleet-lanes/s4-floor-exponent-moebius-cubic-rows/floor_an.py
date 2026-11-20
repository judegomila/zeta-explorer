# fits for combination 1: onset X*, exponent p in -eps_0 ~ C lambda^p (m = 0) and ~ C (1 + log lambda)^1 lambda^p (m = 1), lambda = sqrt X.
import json, math, sys
import numpy as np
d = json.load(open(sys.argv[1])); FL = 1e-11
PRED = {'DH': '0.617 (zero 0.8085+85.70i); sup 1.24', 'EA0.125': '0.25', 'EA0.25': '0.50', 'TNR3_2.2_own': '0.808', 'TNR3_2.2_zeta': '0.808', 'TNR2_2.05_own': '%.3f' % (2*math.acosh(1.025)/math.log(2)),
        'SGN-LIOU': '1 (zero of zeta(2s)/zeta(s) at s = 1)', 'SGN-HASH': '1 (no continuation past Re s = 1)', 'U-RAND': '1 (no continuation)', 'WT1.2393168126993495': '1 (pole at 1 - i alpha read with the pole term at 1)'}
out = {}
for nm, rows in d['res'].items():
    X = np.array([r['X'] for r in rows]); lm = np.array([min(r['lam']) for r in rows]); nr = np.array([r['nrm'] for r in rows])
    neg = lm < -1e-8          # well above the double-precision floor of every run
    onset = None
    if neg.any():
        i = int(np.argmax(neg)); onset = (float(X[i-1]) if i > 0 else None, float(X[i]))
    rec = dict(onset=onset, min_lam=float(lm.min()), lam_at_max=float(lm[-1]), max_abs_over_floor=float((np.abs(lm)/(FL*np.maximum(1, nr))).max()), pred=PRED.get(nm))
    for lo in (1e3, 1e4):
        sel = neg & (X >= lo)
        if sel.sum() >= 6:
            ll = 0.5*np.log(X[sel]); y = np.log(-lm[sel])
            p0, c0 = np.polyfit(ll, y, 1); p1, c1 = np.polyfit(ll, y - np.log(1 + ll), 1)
            res0 = float(np.std(y - (p0*ll + c0))); rec['fit_X>=%g' % lo] = dict(p_m0=float(p0), p_m1=float(p1), rms=res0, n=int(sel.sum()))
    out[nm] = rec
    print('%-22s onset %s  lam(Xmax) % .3e  max|lam|/floor %.1f  %s  pred %s' % (nm, onset, rec['lam_at_max'], rec['max_abs_over_floor'], {k: (round(v['p_m0'], 3), round(v['p_m1'], 3)) for k, v in rec.items() if k.startswith('fit')}, rec['pred']))
json.dump(out, open(sys.argv[2], 'w'), indent=1)
