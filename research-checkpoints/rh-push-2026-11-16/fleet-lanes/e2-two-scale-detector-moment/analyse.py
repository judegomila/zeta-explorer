"""analyse.py -- fit omega (share = rows^-omega) from restricted4 output; true rows vs random multiplicative rows."""
import json, math, numpy as np
d = json.load(open('restricted4_10_19.json'))
ks = sorted(int(k) for k in d)
def fit(xs, ys):
    A = np.vstack([xs, np.ones(len(xs))]).T
    c, res, *_ = np.linalg.lstsq(A, ys, rcond=None)
    r = ys - A @ c
    se = math.sqrt((r @ r) / max(1, len(xs) - 2) / ((xs - xs.mean()) ** 2).sum())
    return c[0], se
print("per-U omega = -log(share)/log(rows); class size k = ceil(rows^0.590332); random class omega = 1 - log k/log rows")
for tn in ('S_half', 'A_half'):
    print(f"\ntarget |{tn}|^4")
    print(" k   rows   k_cls  om_rand | true: det plain inv two self lift_det mix6 | random rows mean(sd over 6 seeds): det plain inv two self lift_det mix6")
    for k in ks:
        t = d[str(k)]['true']; c = d[str(k)]['random_mult']
        f = lambda key: (np.mean([x[tn][key]['omega'] for x in c]), np.std([x[tn][key]['omega'] for x in c], ddof=1))
        tl = " ".join(f"{t[tn][s]['omega']:.3f}" for s in ('det', 'plain', 'inv', 'two', 'self'))
        cl = " ".join("%.3f(%.3f)" % f(s) for s in ('det', 'plain', 'inv', 'two', 'self'))
        print(f"{k:3d} {t['rows']:6d} {t['k']:5d} {t['omega_random_class']:.4f} | {tl} {t[tn]['det']['lift']:.2f} {t[tn]['mix6_ratio']:.3f} | {cl} "
              f"{np.mean([x[tn]['det']['lift'] for x in c]):.2f} {np.mean([x[tn]['mix6_ratio'] for x in c]):.3f}")
    print(" slope fits over U = 2^13..2^19: log(share) = -omega_slope log(rows) + c")
    sel = [k for k in ks if k >= 13]
    xs = np.array([math.log(d[str(k)]['true']['rows']) for k in sel])
    for s in ('det', 'plain', 'inv', 'two', 'self'):
        yt = np.array([math.log(d[str(k)]['true'][tn][s]['share']) for k in sel])
        a, se = fit(xs, yt)
        sl = []
        for sd in range(6):
            yr = np.array([math.log(d[str(k)]['random_mult'][sd][tn][s]['share']) for k in sel])
            sl.append(fit(xs, yr)[0])
        print(f"   {s:6s} true omega_slope = {-a:.3f} +- {se:.3f}   random rows: {-np.mean(sl):.3f} (sd {np.std(sl, ddof=1):.3f})")
    yr = np.array([math.log(d[str(k)]['true']['k'] / d[str(k)]['true']['rows']) for k in sel])
    print(f"   random class: omega_slope = {-fit(xs, yr)[0]:.3f}")
    # mixed moment: mean(|T|^4 |D|^2) vs U
    xu = np.array([k * math.log(2) for k in sel])
    for nm, get in (('mean|T|^4', lambda r: r[tn]['mean_4']), ('mean|D|^2', lambda r: r['mean_D2']), ('mean|T|^4|D|^2', lambda r: r[tn]['mix6_mean']),
                    ('ratio mix6', lambda r: r[tn]['mix6_ratio'])):
        a, se = fit(xu, np.array([math.log(get(d[str(k)]['true'])) for k in sel]))
        ar = [fit(xu, np.array([math.log(get(d[str(k)]['random_mult'][sd])) for k in sel]))[0] for sd in range(6)]
        print(f"   exponent in U of {nm:16s}: true {a:+.3f} +- {se:.3f}   random rows {np.mean(ar):+.3f} (sd {np.std(ar, ddof=1):.3f})")
print("\nthreshold class |D|^2 >= U^{delta t*} (D = M_r* S_m*):")
for k in ks:
    t = d[str(k)]['true']
    print(f"  U=2^{k}: threshold {t['threshold_D2']:.1f}  mean|D|^2 {t['mean_D2']:.4f}  max|D|^2 {t['max_D2']:.3f}  rows over (raw) {t['n_over_threshold_raw']}  (normalised) {t['n_over_threshold_normalised']}"
          f"  corr(log D, log S_half) {t['corr_logD_logT']:+.3f}  corr(log S_m*, log S_half) {t['corr_logSm_logT']:+.3f}  corr(log M_r*, log S_half) {t['corr_logMr_logT']:+.3f}")
