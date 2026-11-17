"""Coupled levers (MODEL).  Theorem R of RESULT.md ties the numerator exponent to the plain-witness count, so a
hypothetical input must be priced in the count and in the numerator together.
 (a) plain-witness count saving tau:  A_P(m) -> A_P(m) - tau, detector re-balanced, K = (3R'+1)/4.
 (b) prime capacity of Lemma 18.1 scaled by s (cost 6 kappa / s): c = s/(3 kappa) in the count, cap = s q/(6 kappa).
 (c) numerator-only versions of (b) (as in the bypass-78 price list) for comparison, with the lower bound of
     Theorem R evaluated at the same class.
"""
import numpy as np
import numerator_system as ns

ALPHA = 5.0 / 6.0

def R_general(delta, x, kappa, tau=0.0, s=1.0):
    c = s / (3.0 * kappa)
    D = 3.0 - (1.0 + 2.0 * c) * x
    P = (2.0 - 2.0 * c * x) * (1.0 - x)
    J = (ALPHA - delta) * D + delta * P
    # short branch with plain saving tau: Rsh(t) = 1 - delta + delta P (3/2 - t)/D - (1-x) tau / D ; long: 1 - delta + (alpha-delta)(t-1)
    # balance:
    t = 1.0 + (delta * P / 2.0 - (1.0 - x) * tau) / J
    t = min(max(t, 1.0), 1.5)
    return max(1.0 - delta, 1.0 - delta + (ALPHA - delta) * (t - 1.0))

def make_opts(tau=0.0, s_count=1.0, s_num=1.0):
    def opts(delta, x, kappa, model):
        R = R_general(delta, x, kappa, tau, s_count)
        q = delta * x
        cap = min(s_num * q / (6 * kappa), delta / 2)
        K = (3 * R + 1) / 4
        return [(cap, K - cap / 2), (0.0, K), (delta / 2, R)]
    return opts

def run(name, **kw):
    ns.class_options = make_opts(**kw)
    ns._OPT_CACHE.clear()
    b, r, v = ns.abscissa({"kind": "custom", "tag": repr(sorted(kw.items()))})
    print(f"{name:70s} B={b:.7f} rho={r:.4f} lx={v[0]:.4f} ly={v[1]:.4f} l={v[2]:.4f}", flush=True)

if __name__ == "__main__":
    # self-check of R_general against the closed form
    for d_ in (0.2, 0.4693, 0.7):
        for x_ in (0.0, 0.3, 0.5):
            assert abs(R_general(d_, x_, 0.75) - ns.count_R(d_, x_, 0.75)) < 1e-12
    run("C0 source (validation)")
    for tau in (1 / 120, 0.02, 0.05, 0.1):
        run(f"Ca plain-witness count saving tau = {tau:.4f}, re-balanced  [MODEL]", tau=tau)
    run("Cb prime capacity doubled in count and numerator (s = 2)  [MODEL]", s_count=2.0, s_num=2.0)
    run("Cc prime capacity doubled in numerator only (bypass-78 row)  [MODEL]", s_num=2.0)
    run("Cd prime capacity doubled in count only  [MODEL]", s_count=2.0)
