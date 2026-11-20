#!/usr/bin/env python3
"""cert_torus.py k N theta.npy: Arb certificate of a zero of the Bohr lift B_N(sigma; theta) with sigma > 1/2.
The phases are replaced by exact dyadic numbers theta_p = 2 pi r_p, r_p = round(theta_p 2^48 / 2 pi) / 2^48; the function
of one complex variable  f(s) = sum_n w_n exp(2 pi i sum_p v_p(n) r_p) n^-s  equals B_N(Re s; theta_p - Im s log p), and
complex interval Newton certifies exactly one zero of f in a square around s0.  That zero is a zero of the lift at the torus
point theta_p - t0 log p."""
import sys, json, math
import numpy as np
from flint import arb, acb, fmpq, ctx
import tor
ctx.prec = 200
def certify(k, N, sig, th, drop=()):
    ps = [int(p) for p in tor.primes_upto(N)]
    r = [fmpq(int(round(float(t) / (2 * math.pi) * 2 ** 48)), 2 ** 48) for t in th]
    lM = arb(N + 1).log(); terms = []
    for n in range(1, N + 1):
        if any(n % p == 0 for p in drop): continue
        m = n; ph = fmpq(0)
        for j, p in enumerate(ps):
            while m % p == 0: ph += r[j]; m //= p
            if m == 1: break
        lg = arb(n).log()
        terms.append((lg, (1 - lg / lM) ** k * acb.exp_pi_i(acb(2 * arb(ph)))))
    def f(s):
        D = acb(0); Dp = acb(0)
        for lg, c in terms:
            e = c * (-s * lg).exp(); D += e; Dp -= lg * e
        return D, Dp
    s = acb(sig, 0)
    for _ in range(60):
        v, vp = f(s); s = s - v / vp; s = acb(arb(s.real.mid()), arb(s.imag.mid()))
    v0, _ = f(s)
    for rexp in (30, 40, 50, 20):
        rr = arb(2) ** (-rexp)
        Bx = acb(s.real + arb(0, 1) * rr, s.imag + arb(0, 1) * rr)
        _, vpB = f(Bx)
        if vpB.contains(0): continue
        ratio = abs(v0 / vpB).upper()
        if ratio < rr.lower():
            return dict(k=k, N=N, primes=len(ps), certified=True, re_s=float(s.real.mid()), im_s=float(s.imag.mid()), radius_log2=-rexp,
                        newton_ratio_upper=float(ratio), re_s_minus_half_lower=float((s.real - rr - arb(1) / 2).lower()), phases_dyadic_bits=48)
    return dict(k=k, N=N, certified=False)
if __name__ == '__main__':
    k = int(sys.argv[1]); N = int(sys.argv[2]); x = np.load(sys.argv[3])
    print(json.dumps(certify(k, N, float(x[0]), x[1:])))
