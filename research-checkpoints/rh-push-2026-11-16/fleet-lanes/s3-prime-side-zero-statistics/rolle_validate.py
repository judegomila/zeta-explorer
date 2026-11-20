"""Zeros of zeta' to the right of the line against the close-pair model x * l = (pi^2/4) ghat^2 (l = log(t/2pi), ghat = normalised gap).
First 1e5 zeros; the 40 smallest gaps and 40 gaps with ghat in (0.2, 0.6); zero of zeta' by mpmath findroot from the model point."""
import math, json, numpy as np, mpmath as mp
mp.mp.dps = 20
t = np.loadtxt('out/zeros_first1e5.txt')
l = np.log(t[:-1] / (2 * math.pi)); gh = np.diff(t) * l / (2 * math.pi)
o = np.argsort(gh)
rng = np.random.default_rng(1)
mid = np.nonzero((gh > 0.2) & (gh < 0.6))[0]
sel = list(o[:40]) + list(rng.choice(mid, 40, replace=False))
rows = []
for i in sel:
    m = 0.5 * (t[i] + t[i + 1]); L = float(l[i]); xp = (math.pi ** 2 / 4) * gh[i] ** 2 / L
    try:
        r = mp.findroot(lambda s: mp.zeta(s, derivative=1), mp.mpc(0.5 + xp, m), tol=1e-12, maxsteps=40)
        ok = abs(r.imag - m) < (t[i + 1] - t[i])
    except Exception as e:
        r = None; ok = False
    rows.append(dict(i=int(i), t=float(m), ghat=float(gh[i]), x_model_times_l=float(xp * L), x_found_times_l=float((r.real - 0.5) * L) if ok else None))
    print(rows[-1], flush=True)
good = [r for r in rows if r['x_found_times_l'] is not None]
ratio = np.array([r['x_found_times_l'] / r['x_model_times_l'] for r in good]); g = np.array([r['ghat'] for r in good])
summ = dict(n=len(rows), found=len(good), ratio_small_gaps=[float(ratio[g < 0.2].mean()), float(ratio[g < 0.2].min()), float(ratio[g < 0.2].max())],
            ratio_mid_gaps=[float(ratio[g >= 0.2].mean()), float(ratio[g >= 0.2].min()), float(ratio[g >= 0.2].max())], min_x_times_l=float(min(r['x_found_times_l'] for r in good)))
print(summ); json.dump(dict(summary=summ, rows=rows), open('out/rolle_validate.json', 'w'), indent=1)
