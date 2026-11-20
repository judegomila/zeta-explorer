"""Pointwise (Part I type) comparison system of bypass-78/scalar_system.py with the count replaced by the SIEVE-ONLY row
envelope of manuscript Prop 9.2 (9.16)/(9.24), old and new.  Float LP (HiGHS) + bisection: a screen, not a certificate.
   old (Lemma 9.1):          R(d) = min(1, max(1 - d/2, 4/3 - d))
   new, kernel Theta_6 on sixth-power-free rows directly (no powerful-part split):
                              R(d) = min(1, max_{1/2<=r<=1} [max(1, r, 5/6 + r/3, 1/3 + 5r/6) - d r]) = min(1, max(1 - d/2, 7/6 - d))
   new, sieve replaced inside the manuscript's split u = s w k (V = U^o):
                              R(d) = max_{o, r} min(1 - o/2, o/2 + max(1 - o, r, 5(1-o)/6 + r/3, (1-o)/3 + 5r/6) - d r)
Planned memory: LP with ~5000 rows x 4 columns."""
import sys, os
import numpy as np
from functools import lru_cache
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bypass-78"))
import scalar_system as S

def R_old(d, x=None, k=None): return min(1.0, max(1 - d / 2, 4 / 3 - d))
def R_new(d, x=None, k=None): return min(1.0, max(1 - d / 2, 7 / 6 - d))
_o = np.linspace(0, 1, 401)[:, None]; _r = np.linspace(0.5, 1, 401)[None, :]
def R_split(d, x=None, k=None): return _R_split(float(d))
@lru_cache(maxsize=None)
def _R_split(d):
    e = _o / 2 + np.maximum.reduce([1 - _o + 0 * _r, _r + 0 * _o, 5 * (1 - _o) / 6 + _r / 3, (1 - _o) / 3 + 5 * _r / 6]) - d * _r
    return float(np.minimum(1 - _o / 2, e).max())
def R_split_old(d, x=None, k=None): return _R_split_old(float(d))
@lru_cache(maxsize=None)
def _R_split_old(d):
    e = _o / 2 + np.maximum.reduce([1 - _o + 0 * _r, _r + 0 * _o, 2 * (1 - _o + _r) / 3]) - d * _r
    return float(np.minimum(1 - _o / 2, e).max())

print("check of (9.24): grid max-min against the closed form of the manuscript, and the two new envelopes")
for d in (0.02, 0.2, 1/3, 0.4, 0.5, 2/3, 0.8, 5/6):
    print("   delta = %.4f  old closed %.4f grid %.4f | new direct %.4f | new inside the split %.4f | R_kappa(delta, 0) = %.4f"
          % (d, R_old(d), R_split_old(d), R_new(d), R_split(d), S.count_R(d, 0.0, 0.75)))

def run(name, Rf, kinds, region, lmax, dmin):
    f = lambda B: S.solve(B, kinds, region, Rfun=Rf, lmax=lmax, dmin=dmin)
    try:
        Bs = S.bisect(f, 0.80, 0.999)
    except AssertionError:
        return None
    t, v = f(Bs)
    return Bs, v

for lmax, tag in ((0.0, "no marks (l = 0)"), (0.5, "marks allowed (l free)")):
    for dmin in (0.02, 0.125):
        print("== %s, classes delta >= %.3f" % (tag, dmin))
        for nm, Rf in (("old envelope (9.16)", R_old), ("new envelope, split kept", R_split), ("new envelope, direct", R_new), ("structured count R_kappa (file)", S.count_R)):
            best = None
            for kinds, region in ((["pt_left"], "A"), (["pt_right"], "B")):
                r = run(nm, Rf, kinds, region, lmax, dmin)
                if r and (best is None or r[0] < best[0]): best = (r[0], r[1], region)
            if best is None: print("   %-34s infeasible below 0.999" % nm)
            else: print("   %-34s B* = %.9f  region %s  lx=%.5f ly=%.5f l=%.5f" % (nm, best[0], best[2], *best[1]))
