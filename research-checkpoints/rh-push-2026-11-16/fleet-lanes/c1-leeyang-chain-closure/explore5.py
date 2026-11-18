"""Float screen (not a verdict): degree 5. Image of complete-graph and chain ferromagnets in the (c1,c2) plane,
P = w^5 + c1 w^4 + c2 w^3 + c2 w^2 + c1 w + 1, against the Lee-Yang region; GHS test of the candidate.
Arrays: 4e5 x 10 float64 = 32 MB max."""
import numpy as np, itertools
rng = np.random.default_rng(1)
n = 5
pairs = list(itertools.combinations(range(n), 2))
def coeffs(A):  # A: (m, npairs) -> c1, c2
    m = A.shape[0]
    idx = {p: k for k, p in enumerate(pairs)}
    def cut(S):
        out = np.ones(m)
        for i in S:
            for j in range(n):
                if j not in S:
                    out *= A[:, idx[(min(i, j), max(i, j))]]
        return out
    c1 = sum(cut((i,)) for i in range(n))
    c2 = sum(cut(S) for S in pairs)
    return c1, c2
print("planned allocation: 4e5 x 10 float64 = 32 MB")
m = 400000
# sample with many entries at 0/1 to reach the boundary
A = rng.random((m, 10)) ** rng.choice([0.2, 1, 5], size=(m, 1))
mask = rng.random((m, 10))
A = np.where(mask < 0.2, 0.0, np.where(mask > 0.8, 1.0, A))
c1, c2 = coeffs(A)
ly_up = lambda c: 1 + (c + 1) ** 2 / 4
ly_lo = lambda c: np.maximum(0, np.maximum(2 * c - 2, 0))  # placeholder, exact region printed below
bins = np.linspace(0, 5, 26)
print("c1-bin   max c2 (complete)  LY upper   min c2 (complete)")
for a, b in zip(bins[:-1], bins[1:]):
    sel = (c1 >= a) & (c1 < b)
    if sel.any():
        print(f"[{a:.1f},{b:.1f})  {c2[sel].max():.4f}  [{ly_up(a):.4f},{ly_up(b):.4f}]  {c2[sel].min():.4f}")
# excess over 1 + c1 for c1 < 1
sel = c1 < 1
print("max of c2 - (1 + c1) over samples with c1<1:", (c2[sel] - 1 - c1[sel]).max())
print("max of c2 - 1 - c1 - (c1-1)^2/4 overall (LY upper defect, must be <=0):", (c2 - ly_up(c1)).max())
# GHS for candidate M(h) = cosh 5h + c cosh h
import mpmath as mp
for c in [1, mp.mpf(5) / 4]:
    f = lambda h: mp.log(mp.cosh(5 * h) + c * mp.cosh(h))
    vals = [(h, mp.diff(f, h, 3)) for h in mp.linspace(0.01, 3, 300)]
    mx = max(vals, key=lambda t: t[1])
    print("c =", c, " max (log M)''' on (0,3]:", mx)
