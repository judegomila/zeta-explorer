"""pivot_mixed.py -- below-level mixed moment (1/rows) sum_u |M_r* S_m*|^2 from restricted4 output: true rows vs random
completely multiplicative sixth-root rows (their mean is the diagonal term). Thresholds: needs sum_u << U^N, N < 1.1366; level 1.1640."""
import json, math, numpy as np
d = json.load(open('restricted4_10_19.json'))
ks = sorted(int(k) for k in d)
print(" k    rows   mean|D|^2 true   random rows mean (sd)    ratio true/random")
xs, yt, yr = [], [], []
for k in ks:
    t = d[str(k)]['true']; c = [x['mean_D2'] for x in d[str(k)]['random_mult']]
    print(f"{k:3d} {t['rows']:7d}   {t['mean_D2']:.5f}        {np.mean(c):.5f} ({np.std(c, ddof=1):.5f})        {t['mean_D2'] / np.mean(c):.3f}")
    if k >= 14: xs.append(k * math.log(2)); yt.append(math.log(t['mean_D2'])); yr.append(math.log(np.mean(c)))
xs = np.array(xs)
for nm, y in (('true', np.array(yt)), ('random', np.array(yr))):
    A = np.vstack([xs, np.ones(len(xs))]).T; c, *_ = np.linalg.lstsq(A, y, rcond=None); r = y - A @ c
    se = math.sqrt((r @ r) / (len(xs) - 2) / ((xs - xs.mean()) ** 2).sum())
    print(f"exponent of mean|D|^2 in U over 2^14..2^19, {nm}: {c[0]:+.4f} +- {se:.4f}   (level growth would be +0.1640; threshold +0.1366)")
