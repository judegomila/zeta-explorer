"""Count-only price of H(lam) in the balanced system of ../r3-critical-count/caps.py, with and without the gates of
Liu II Remark 14.1 (caps.step, mode "gates").  The numerator keeps K = (3R+1)/4 with the lowered R (no Fmix line), so this
is weaker than lp_mixed.py; its purpose is the gated column.  Count at prover's t = 1:
  R'(delta, x) = min( R_src, max_{1/2 <= r <= 1} min( M1(r), max_{1-r <= m <= 1/2} min( M2(m), C3(r+m) ) ) ),
  C3(Y) = 1 + lam (Y-1) - delta Y.   Grid 141 x 21 as in caps.solve.  Float.  MODEL."""
import sys, os
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3-critical-count"))
import caps

def count_mixed(d, x, k, lam, nr=101, nm=101):
    Rsrc = caps.Rk(d, x, k)
    if lam is None: return Rsrc + 0*d*x
    r = np.linspace(.5, 1, nr)[:, None, None, None]; m = np.linspace(0, .5, nm)[None, :, None, None]
    dd = d[None, None]; xx = x[None, None]
    M1 = 1 - dd*r - dd*xx*(1 - r)
    M2 = 1 - 2*dd*m - 2*dd*xx*(1 - 2*m)/(6*k)
    C3 = 1 + lam*(r + m - 1) - dd*(r + m)
    inner = np.where(r + m >= 1 - 1e-12, np.minimum(M2, C3), -9.0).max(axis=1, keepdims=True)
    val = np.minimum(M1, inner).max(axis=(0, 1))
    return np.minimum(Rsrc, val)

def solve(mode, lam):
    d = np.linspace(1/8, 5/6, 141)[:, None]; x = np.linspace(0, .5, 21)[None, :]
    k = 0.75; out = None
    for it in range(40):
        R = count_mixed(d, x, k, lam)
        out = caps.step(k, R, d, x, mode)
        if out is None: return None
        kn = max(13/18, 2*out[0] - 1)
        if abs(kn - k) < 1e-10: break
        k = kn
    return (*out, k)

if __name__ == "__main__":
    print("planned allocation: 101*101*141*21 float64 = %.0f MB per array" % (101*101*141*21*8/1e6))
    for lam in (None, 1.0, 0.9, 0.8333, 0.75, 0.6, 0.5, 0.4693, 0.25, 0.0):
        o = solve("optimistic", lam); g = solve("gates", lam)
        print("lam = %-6s  optimistic B = %.7f (b=%.4f l=%.4f k=%.5f)   gates B = %s" % (lam, o[0], o[1], o[2], o[3], "infeasible" if g is None else "%.7f" % g[0]), flush=True)
