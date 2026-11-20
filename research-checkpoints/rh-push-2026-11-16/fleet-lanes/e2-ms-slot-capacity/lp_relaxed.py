"""e2-ms-slot-capacity: system value of the Liu II scalar model with the M1 slot capacity replaced.
Reuses step() (LP in (b, l), fixed point kappa = max(13/18, 2B-1)) of r3-critical-count/caps.py and the supply
iteration of caps_supply.py.  Only the M1 capacity z_M(r) changes:
  source   : z <= (1-r)/2                       (r + 2z < 1; the model of r3-critical-count)
  source2  : z <= min((1-r)/2, (3-2r)/8)        (both conditions of Lemma 17.1 at m = 1)
  first    : z <= min(1-r, (3-2r)/8)            (first condition relaxed to r + z < 1, second kept)
  both     : z <= 1-r                           (r + z < 1 only)
  forced   : z <= min(1-r, 1/2)                 (r + z < 1 and 2z < 1: the region not excluded by the Gauss-sum vector)
MODEL (float LP on a 141 x 21 class grid): none of the relaxed capacities is proved."""
import numpy as np, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3-critical-count"))
from caps import step

CAPS = {"source": lambda r: (1-r)/2, "source2": lambda r: np.minimum((1-r)/2, (3-2*r)/8),
        "first": lambda r: np.minimum(1-r, (3-2*r)/8), "both": lambda r: 1-r, "forced": lambda r: np.minimum(1-r, 0.5)}

def count(d, x, k, cap, s, L, nt=201, nr=601):
    best = np.full(np.broadcast(d, x).shape, 9.0)
    for t in np.linspace(1, 1.5, nt):
        r = np.linspace(t-0.5, t, nr).reshape((-1, 1, 1)); m = t - r
        rr = np.minimum(r, 1)
        inv = np.where(r <= 1, 1 - d*r - 2*d*x*np.minimum(cap(rr), L), 1 + s*(r-1) - d*r)
        pl = 1 - 2*d*m - 2*d*x*np.minimum((1-2*m)/(6*k), L)
        best = np.minimum(best, np.minimum(inv, pl).max(axis=0))
    return best

def solve(mode, cap, supply=True, s=5/6, nd=141, nx=21):
    d = np.linspace(1/8, 5/6, nd)[:, None]; x = np.linspace(0, .5, nx)[None, :]
    k = 0.75; L = 0.2105 if supply else 9.0; out = None
    for it in range(60):
        out = step(k, count(d, x, k, cap, s, L), d, x, mode)
        if out is None: return None
        B, b, l = out; kn = max(13/18, 2*B-1); Ln = l/((1+b+3*l)/2) if supply else 9.0
        if abs(kn-k) < 1e-9 and abs(Ln-L) < 1e-9: break
        k = kn; L = 0.5*L + 0.5*Ln
    return (*out, k, L)

if __name__ == "__main__":
    # critical class count for each capacity (kappa_flat, no supply / supply 0.2105)
    KF = 0.74977329407992826; DC = 0.46934485869814
    d = np.array([[DC]]); x = np.array([[0.5]])
    for nm, cap in CAPS.items():
        print("critical-class count  %-8s  no supply %.6f   supply 0.2105 %.6f" % (nm, count(d, x, KF, cap, 5/6, 9.0, 1001, 3001)[0, 0],
              count(d, x, KF, cap, 5/6, 0.2105, 1001, 3001)[0, 0]), flush=True)
    ref = {}
    for nm, cap in CAPS.items():
        for sup in (True, False):
            for mode in ("optimistic", "gates"):
                o = solve(mode, cap, sup)
                key = (sup, mode)
                if nm == "source": ref[key] = o[0]
                print("%-8s supply=%-5s %-10s " % (nm, sup, mode) + ("infeasible" if o is None else
                      "B %.7f  gain vs source on the same grid %.2e  (b=%.4f l=%.4f kappa=%.5f L=%.4f)  B_flat-gain = %.7f"
                      % (o[0], ref[key]-o[0], o[1], o[2], o[3], o[4], 0.874886647-(ref[key]-o[0]))), flush=True)
