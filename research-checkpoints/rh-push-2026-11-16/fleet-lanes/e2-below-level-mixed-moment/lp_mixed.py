"""e2-below-level-mixed-moment: MODEL price of the mixed-moment hypothesis H(lam) in the Xu-Sang / Liu II scalar system.

H(lam):  sum_{q_u ~ U} |M_r(u) S_m(u)|^2 << U^{1 + lam (r+m-1)_+ + eps}   for  rmin <= r <= 1, 0 <= m <= 1/2
(M_r: Moebius polynomial of the witness presentation, S_m: plain polynomial of the same presentation, central normalisation).
lam = 1 is the hypothetical perfect large sieve; lam = 0 is the Lindelof-on-average value.  At the saddle pair
(r*, m*), E = 1 + 0.163954 lam.

System = ../r3-lemma181-a/numerator_system.py (float LP, bisection in B, kappa = max(13/18, 2B-1)); only the class rows change.
Prover fixes t = 1 in the detector (13.14): every detected row has a pair (r, m_w), 1/2 <= r <= 1, m_w <= 1/2, r + m_w >= 1,
|M_r|^2 ~ U^{delta r}, |S_{m_w}|^2 >= U^{delta m_w}, |M_r S_{m_w}|^2 >= U^{delta (r + m_w)}.  Each class (delta, x) is split
into sub-classes by r (grid); the adversary chooses m_w.
  count:      R_sub(r) = min( R_src, M1(r), max_{m_w in [1-r, 1/2]} min( M2(m_w), C3(r + m_w) ) ),
              C3(Y) = 1 + lam (Y - 1) - delta Y              (Chebyshev on H(lam); only for r >= rmin)
  numerator:  N(theta) = max_{0 <= m <= 1/2} min( P(m), F4(m), Fmix(m) ),  R = R_sub,
              Fmix(m) = (R + 1 + lam (r + m - 1)_+ - delta r)/2 - theta m   (Cauchy-Schwarz with |M_r|^2 >= U^{delta r})
"""
import sys, os
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "r3-lemma181-a"))
import numerator_system as ns

MG = np.linspace(0.0, 0.5, 201)

def subclass_options(delta, x, kappa, lam, r, use_count=True, use_num=True, nth=9):
    q = delta * x
    Rsrc = ns.count_R(delta, x, kappa)
    R = Rsrc
    if lam is not None and use_count:
        M1 = 1 - delta * r - 2 * q * (1 - r) / 2.0
        mw = MG[MG >= 1 - r - 1e-12]
        M2 = 1 - 2 * delta * mw - 2 * q * (1 - 2 * mw) / (6 * kappa)
        C3 = 1 + lam * (r + mw - 1) - delta * (r + mw)
        R = min(Rsrc, max(M1, 0) if False else M1, float(np.max(np.minimum(M2, C3))))
        R = min(R, Rsrc)
    cap = q / (6 * kappa)
    ths = np.unique(np.concatenate([np.linspace(0, delta / 2, nth), [cap]]))
    out = []
    for th in ths:
        P = R + (delta / 2 - th) * MG
        F4 = (3 * R + 1) / 4 - th * MG - q * (1 - 2 * MG) / (12 * kappa)
        v = np.minimum(P, F4)
        if lam is not None and use_num:
            v = np.minimum(v, (R + 1 + lam * np.maximum(r + MG - 1, 0) - delta * r) / 2 - th * MG)
        out.append((float(th), float(v.max())))
    return out

def make_table(lam, rgrid, **kw):
    def options_table(B, model, nd, nx, kappa=None):
        key = (round(B, 14), nd, nx)
        if key in ns._OPT_CACHE: return ns._OPT_CACHE[key]
        kap = min(1.0, max(13.0 / 18.0, 2.0 * B - 1.0))
        dmax = min(5.0 / 6.0, 2.0 * B - 1.0)
        tab = []
        for delta in np.linspace(0.125, dmax, nd):
            for x in np.linspace(0.0, 0.5, nx):
                for r in rgrid:
                    tab.append((delta, x, subclass_options(delta, x, kap, lam, r, **kw)))
        ns._OPT_CACHE.clear(); ns._OPT_CACHE[key] = tab
        return tab
    return options_table

def run(name, lam, rgrid=None, nd=61, nx=13, **kw):
    rgrid = np.linspace(0.5, 1.0, 26) if rgrid is None else rgrid
    if lam is None: rgrid = [0.75]
    ns.options_table = make_table(lam, rgrid, **kw); ns._OPT_CACHE.clear()
    b, rho, v = ns.abscissa({"kind": "custom"}, nd=nd, nx=nx)
    print(f"{name:74s} B={b:.7f} rho={rho:.4f} lx={v[0]:.4f} ly={v[1]:.4f} l={v[2]:.4f}", flush=True)
    return b

if __name__ == "__main__":
    DC, KF = 0.46934485869814, 0.74977329407992826
    print("saddle check: R_c = %.6f; threshold E at (r*, m*) for the count = R_c + delta_c t* = %.5f" % (ns.count_R(DC, .5, KF), ns.count_R(DC, .5, KF) + DC * 1.163954))
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which in ("all", "val"):
        run("V0 source system on this grid (reference for the gains below)", None)
        run("V1 lam = 1 (perfect large sieve at every length; expect no change)", 1.0)
    if which in ("all", "full"):
        for lam in (0.9, 0.8333, 0.75, 0.6, 0.5, 0.4693, 0.4, 0.25, 0.1, 0.0):
            run(f"H(lam = {lam:.4f}): E(t*) = {1 + 0.163954 * lam:.4f}, count + numerator  [MODEL]", lam)
    if which in ("all", "split"):
        for lam in (0.5, 0.0):
            run(f"H(lam = {lam:.2f}) count only  [MODEL]", lam, use_num=False)
            run(f"H(lam = {lam:.2f}) numerator only  [MODEL]", lam, use_count=False)
    if which == "lam":
        for s in sys.argv[2:]:
            lam = float(s); run(f"H(lam = {lam:.4f}): E(t*) = {1 + 0.163954 * lam:.4f}, count + numerator  [MODEL]", lam)
    if which == "splitone":
        lam = float(sys.argv[2])
        run(f"H(lam = {lam:.2f}) count only  [MODEL]", lam, use_num=False)
        run(f"H(lam = {lam:.2f}) numerator only  [MODEL]", lam, use_count=False)
