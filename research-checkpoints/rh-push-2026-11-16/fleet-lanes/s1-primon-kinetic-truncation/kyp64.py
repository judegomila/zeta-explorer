#!/usr/bin/env python3
"""Test 4b: bounded-real test of the N-prime truncated bridge ratio Theta_{a,N}(i w) = xi_N(1/2 - a + i w)/xi_N(1/2 + a + i w),
xi_N(s) = G(s) prod_{p<=p_N} (1 - eps_p p^{-s})^{-1}.  For a stable transfer function the KYP LMI is feasible iff sup_w |Theta| <= 1
(bounded real lemma), so the LMI is replaced by the sup over a dense frequency grid, with an Arb evaluation at the maximiser.
usage: kyp64.py <Sprimes.txt> <out.json>"""
import sys, json, numpy as np, mpmath as mp
from lib import *
from points import ALPHA, EA_A, AS
mp.mp.dps = 25
S = set(int(x) for x in open(sys.argv[1]).read().split()); SEED = 12345
pr_all = primes_upto(400)
def eps_of(ctl, pr):
    if ctl == "lio": return -np.ones(len(pr))
    if ctl == "rnd": return np.array([1.0 - 2 * rsign(int(p), SEED) for p in pr])
    if ctl == "thin": return np.array([-1.0 if int(p) in S else 1.0 for p in pr])
    if ctl == "chi4": return np.where(pr % 4 == 1, 1.0, np.where(pr % 4 == 3, -1.0, 0.0))
    return np.ones(len(pr))
from scipy.special import loggamma
_cache = {}
def lgG(ctl, sig, om):
    """log|G(sig + i om)| on a grid (scipy complex loggamma, float64; the maximiser is re-evaluated in Arb)"""
    key = (ctl == "chi4", round(sig, 12), len(om))
    if key not in _cache:
        s = sig + 1j * om
        if ctl == "chi4": v = ((s / 2) * np.log(4 / np.pi) + loggamma((s + 1) / 2)).real
        else: v = (np.log(s * (s - 1) / 2) - (s / 2) * np.log(np.pi) + loggamma(s / 2)).real
        _cache[key] = v
    return _cache[key]
def logtheta(ctl, a, N, om):
    pr = pr_all[:N].astype(float); L = np.log(pr); e = eps_of(ctl, pr_all[:N]); tot = np.zeros(len(om))
    shifts = [(0.0, 0.0)]
    if ctl == "U": shifts = [(0.0, ALPHA)]
    if ctl == "EA": shifts = [(EA_A, 0.0), (-EA_A, 0.0)]
    for d, al in shifts:
        for sg, sign in ((0.5 - a + d, +1.0), (0.5 + a + d, -1.0)):
            for i in range(0, len(om), 200000):
                o = om[i:i + 200000]; x = e[:, None] * np.exp(-(sg + 1j * (o[None, :] + al)) * L[:, None])
                tot[i:i + 200000] += sign * (-np.log(np.abs(1 - x))).sum(0)
    gs = [(0.0)] if ctl != "EA" else [EA_A, -EA_A]
    for d in gs: tot += lgG(ctl, 0.5 - a + d, om) - lgG(ctl, 0.5 + a + d, om)
    return tot
def arb_check(ctl, a, N, om):
    try:
        from flint import arb, acb, ctx
    except Exception: return None
    ctx.prec = 200; pr = pr_all[:N]; e = eps_of(ctl, pr); tot = arb(0)
    def lg(sig, d):
        s = acb(arb(sig) + arb(d), arb(om))
        if ctl == "chi4": return ((s / 2) * (arb(4) / arb.pi()).log() + ((s + 1) / 2).lgamma()).real
        return ((s * (s - 1) / 2).log() - (s / 2) * arb.pi().log() + (s / 2).lgamma()).real
    A = arb(str(a)); half = arb(1) / 2
    shifts = [(arb(0), arb(0))]
    if ctl == "U": shifts = [(arb(0), arb(ALPHA))]
    if ctl == "EA": shifts = [(arb(str(EA_A)), arb(0)), (-arb(str(EA_A)), arb(0))]
    for d, al in shifts:
        for sg, sign in ((half - A + d, 1), (half + A + d, -1)):
            for p, ep in zip(pr, e):
                if ep == 0: continue
                s = acb(sg, arb(om) + al); x = (-(s) * arb(int(p)).log()).exp() * int(ep)
                tot += -sign * (1 - x).abs_lower().log() if False else -sign * abs(1 - x).log()
    for d in ([arb(0)] if ctl != "EA" else [arb(str(EA_A)), -arb(str(EA_A))]):
        tot += lg(half - A, d) - lg(half + A, d)
    return [float(tot.lower()), float(tot.upper())]
om = np.concatenate([np.arange(0, 60, 0.002), np.arange(60, 3000, 0.02)])
out = {"omega_grid": "0..60 step 0.002, 60..3000 step 0.02", "rows": {}}
for ctl in ("zeta", "chi4", "U", "lio", "rnd", "thin", "EA"):
    for N in (2, 5, 64):
        for a in AS:
            v = logtheta(ctl, a, N, om); i = int(np.argmax(v)); w = float(om[i])
            ab = arb_check(ctl, a, N, w)
            out["rows"][f"{ctl}|N={N}|a={a}"] = dict(sup_log_theta=float(v[i]), sup_over_2a=float(v[i] / (2 * a)), omega=w, frac_grid_above_1=float((v > 0).mean()), arb_interval_at_omega=ab)
            print(ctl, N, a, "sup log|Theta| = %.6g (/(2a) = %.4g) at omega = %.3f; fraction of grid with |Theta|>1: %.3f; Arb %s" % (v[i], v[i] / (2 * a), w, (v > 0).mean(), ab), flush=True)
json.dump(out, open(sys.argv[2], "w"), indent=1)
