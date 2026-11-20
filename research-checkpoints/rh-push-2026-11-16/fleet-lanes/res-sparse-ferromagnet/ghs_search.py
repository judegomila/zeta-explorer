"""Search: lattice measures with the Lee-Yang property (self-reciprocal polynomial, all roots on the unit circle,
positive coefficients) that violate the GHS-type inequality (log P(e^h))''' <= 0 for h > 0.
numpy float64, arrays < 10 MB."""
import numpy as np, json
rng = np.random.default_rng(7)
h = np.linspace(1e-3, 8, 4000)
def third(cs, e):
    ch, sh = np.cosh(h), np.sinh(h)
    tot = -e * 0.25 * np.tanh(h / 2) / np.cosh(h / 2) ** 2
    for c in cs:
        tot = tot + sh * (c * ch + c * c - 2) / (ch - c) ** 3
    return tot
def coeffs(cs, e):
    p = np.array([1.0])
    for c in cs: p = np.convolve(p, [1, -2 * c, 1])
    for _ in range(e): p = np.convolve(p, [1, 1])
    return p
best = None; n_ly = 0
for trial in range(400000):
    m = rng.integers(1, 7); e = int(rng.integers(0, 5))
    mode = rng.integers(0, 3)
    if mode == 0: th = rng.uniform(0, np.pi, m)
    elif mode == 1: th = np.abs(rng.normal(np.pi / 2, 0.6, m)) % np.pi
    else: th = np.concatenate([rng.uniform(0.05, 1.0, 1), rng.uniform(1.5, np.pi, m - 1)])
    cs = np.cos(th); p = coeffs(cs, e)
    if p.min() <= 1e-9: continue
    n_ly += 1
    t = third(cs, e); i = t.argmax()
    if best is None or t[i] > best[0]:
        best = (float(t[i]), float(h[i]), th.tolist(), e, p.tolist())
print("LY polynomials with positive coefficients tested:", n_ly)
print("max third derivative found:", best[0], "at h =", best[1])
print("angles:", best[2], "factors (w+1):", best[3]); print("coefficients:", best[4])
# independent check of the best example by finite differences in high precision
import mpmath as mp
mp.mp.dps = 40
P = lambda x: mp.polyval([mp.mpf(c) for c in best[4]], mp.e ** x)
d3 = mp.diff(lambda x: mp.log(P(x)), best[1], 3)
print("mpmath third derivative of log P(e^h) at that h:", mp.nstr(d3, 15))
roots = np.roots(best[4]); print("max | |root| - 1 |:", float(np.abs(np.abs(roots) - 1).max()))
json.dump(dict(n_tested=n_ly, max_third=best[0], h=best[1], angles=best[2], e=best[3], coeffs=best[4], mp_check=float(d3)), open("ghs_search.json", "w"), indent=1)
