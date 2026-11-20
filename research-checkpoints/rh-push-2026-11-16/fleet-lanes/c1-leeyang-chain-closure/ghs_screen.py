"""Float screen (not a verdict). (1) lattice Lee-Yang polynomials violating GHS: family (w^2 - 2 c w + 1)(w+1)^m.
(2) degree 5: does every point of LY_5 satisfy GHS?  (3) P0 = delta_{+-5} + (5/4) delta_{+-1}: GHS of ferromagnetically
coupled copies (necessary for membership in the limit closure). Arrays < 10 MB."""
import numpy as np, itertools
from math import comb
def third(P, h):  # d^3/dh^3 log P(e^h), P coefficient list low->high ; h array
    w = np.exp(h); k = np.arange(len(P))
    # moments under tilted law: cumulant 3
    lw = np.outer(h, k) + np.log(np.maximum(P, 1e-300))[None, :]
    lw -= lw.max(axis=1, keepdims=True); pr = np.exp(lw) * (np.array(P) > 0)[None, :]; pr /= pr.sum(axis=1, keepdims=True)
    m1 = pr @ k; d = k[None, :] - m1[:, None]
    return (pr * d ** 3).sum(axis=1)
h = np.linspace(0.001, 12, 6000)
print("(1) family (w^2-2c w+1)(w+1)^m, c = m/(m+2) (largest c with nonnegative coefficients):")
for m in range(2, 13):
    c = m / (m + 2)
    P = np.convolve([1, -2 * c, 1], [comb(m, k) for k in range(m + 1)])
    t = third(P, h)
    print(f"  m={m} deg={m+2} min coeff={P.min():+.3e} max third cumulant on h>0: {t.max():+.4e} at h={h[t.argmax()]:.3f}")
print("(1b) two free quadratic factors (w^2-2c1 w+1)(w^2-2c2 w+1)(w+1)^m, random search for GHS violation, degree <= 8")
rng = np.random.default_rng(3); best = {}
for trial in range(200000):
    m = rng.integers(0, 5); r = rng.integers(1, 4)
    cs = rng.uniform(-1, 1, size=r)
    P = np.array([1.0])
    for c in cs: P = np.convolve(P, [1, -2 * c, 1])
    P = np.convolve(P, [comb(m, k) for k in range(m + 1)])
    if P.min() < 0 or len(P) - 1 > 8: continue
    t = third(P, h[::40]).max(); n = len(P) - 1
    if n not in best or t > best[n][0]: best[n] = (t, cs.tolist(), int(m))
for n in sorted(best): print("  deg", n, "max third cumulant %.4e" % best[n][0], "cos:", np.round(best[n][1], 4), "m:", best[n][2])
print("(2) degree 5 grid over LY_5: max third cumulant")
mx = -1e9; arg = None
for c1 in np.linspace(0, 5, 101):
    for c2 in np.linspace(0, 10, 401):
        d1 = c1 - 1; d2 = c2 - c1 + 1
        if d2 < -1e-12 and False: continue
        # LY: roots of x^2 + d1 x + d2 - 2 real in [-2,2]
        if d1 * d1 - 4 * (d2 - 2) < 0 or 2 + 2 * d1 + d2 < 0 or 2 - 2 * d1 + d2 < 0 or abs(d1) > 4: continue
        t = third(np.array([1, c1, c2, c2, c1, 1.0]), h[::40]).max()
        if t > mx: mx, arg = t, (c1, c2)
print("  max over LY_5 grid:", mx, "at", arg)
print("(3) coupled copies of P0: k sites with single-site law on {-5,-1,1,5} masses (1,c,c,1), c=5/4, weight exp(J sum_{i<j} S_i S_j + h sum S_i)")
vals = np.array([-5, -1, 1, 5.0]); mass = np.array([1, 1.25, 1.25, 1])
for k in (2, 3):
    worst = (-1e9, None)
    conf = np.array(list(itertools.product(range(4), repeat=k)))
    S = vals[conf]; lm = np.log(mass)[conf].sum(axis=1)
    tot = S.sum(axis=1); pairsum = (tot ** 2 - (S ** 2).sum(axis=1)) / 2
    for J in np.concatenate([np.linspace(0.001, 0.2, 200), np.linspace(0.2, 2, 50)]):
        for hh in np.linspace(0.001, 1.5, 300):
            lw = lm + J * pairsum + hh * tot; lw -= lw.max(); p = np.exp(lw); p /= p.sum()
            m1 = p @ tot; k3 = p @ (tot - m1) ** 3
            if k3 > worst[0]: worst = (k3, (J, hh))
    print(f"  k={k}: max third cumulant of total spin over J in (0,2], h in (0,1.5]: {worst[0]:+.4e} at (J,h)={worst[1]}")
# same with c = 1 (a genuine ferromagnet: clusters 3 and 2) as a sanity check
mass1 = np.array([1, 1, 1, 1.0])
conf = np.array(list(itertools.product(range(4), repeat=2))); S = vals[conf]; tot = S.sum(axis=1); pairsum = S[:, 0] * S[:, 1]
for nm, ms in (("c=1", mass1), ("c=5/4", mass)):
    lm = np.log(ms)[conf].sum(axis=1); worst = -1e9
    # mixed third derivatives with unequal fields h1,h2 >= 0 : cumulants kappa(S1,S1,S2), kappa(S1,S1,S1)
    for J in np.linspace(0.001, 0.6, 120):
        for h1 in np.linspace(0, 1.2, 61):
            for h2 in np.linspace(0, 1.2, 61):
                lw = lm + J * pairsum + h1 * S[:, 0] + h2 * S[:, 1]; lw -= lw.max(); p = np.exp(lw); p /= p.sum()
                d0 = S[:, 0] - p @ S[:, 0]; d1 = S[:, 1] - p @ S[:, 1]
                worst = max(worst, p @ (d0 * d0 * d1), p @ (d0 ** 3), p @ (d0 * d1 * d1))
    print(f"  two sites, unequal fields, {nm}: max mixed third cumulant = {worst:+.4e}")
