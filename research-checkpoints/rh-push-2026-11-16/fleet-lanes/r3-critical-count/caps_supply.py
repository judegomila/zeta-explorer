"""r3-critical-count: as caps.py section D, with the prime supply imposed: selected prime length z <= L = l/h
(U-units at the critical row scale d = h; the source uses only L > 1/5).  L is iterated with (b, l).  MODEL."""
import numpy as np, sys
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from caps import step, KF, DC

def count(d, x, k, c1, c2, s, L, nt=201, nr=601):
    best = np.full(np.broadcast(d, x).shape, 9.0)
    for t in np.linspace(1, 1.5, nt):
        r = np.linspace(t-0.5, t, nr).reshape((-1, 1, 1)); m = t - r
        inv = np.where(r <= 1, 1 - d*r - 2*d*x*np.minimum((1-np.minimum(r, 1))/c1, L), 1 + s*(r-1) - d*r)
        pl = 1 - 2*d*m - 2*d*x*np.minimum((1-2*m)/c2, L)
        best = np.minimum(best, np.minimum(inv, pl).max(axis=0))
    return best

def solve(mode, c1=2.0, c2=None, s=5/6, nd=141, nx=21):
    d = np.linspace(1/8, 5/6, nd)[:, None]; x = np.linspace(0, .5, nx)[None, :]
    k = 0.75; L = 0.2105; out = None
    for it in range(60):
        cc2 = 6*k if c2 is None else (c2(k) if callable(c2) else c2)
        out = step(k, count(d, x, k, c1, cc2, s, L), d, x, mode)
        if out is None: return None
        B, b, l = out; kn = max(13/18, 2*B-1); Ln = l/((1+b+3*l)/2)
        if abs(kn-k) < 1e-9 and abs(Ln-L) < 1e-9: break
        k = kn; L = 0.5*L + 0.5*Ln
    return (*out, k, L)

if __name__ == "__main__":
    ref = solve("optimistic"); refg = solve("gates")
    print("reference (c1=2, c2=6k): optimistic %.7f (L=%.4f)   gates %.7f" % (ref[0], ref[4], refg[0]))
    print("gain = reference - value on the same grid; B_flat = 0.8748866")
    for name, kw in [("c1 = 1.9", dict(c1=1.9)), ("c1 = 1.75", dict(c1=1.75)), ("c1 = 1.5", dict(c1=1.5)), ("c1 = 1.25", dict(c1=1.25)),
                     ("c1 = 1", dict(c1=1.0)), ("c2 = 3k", dict(c2=lambda k: 3*k)), ("c2 = 2", dict(c2=2.0)), ("c2 = 1", dict(c2=1.0)),
                     ("c1 = 1, c2 = 1", dict(c1=1.0, c2=1.0)), ("c1 = 1, c2 = 1, s = 0", dict(c1=1.0, c2=1.0, s=0.0))]:
        o = solve("optimistic", **kw); g = solve("gates", **kw)
        print("   %-22s optimistic %.7f gain %.2e (b=%.4f l=%.4f k=%.5f L=%.4f)   gates %s" % (name, o[0], ref[0]-o[0], o[1], o[2], o[3], o[4],
              "infeasible" if g is None else "%.7f gain %.2e" % (g[0], refg[0]-g[0])), flush=True)
