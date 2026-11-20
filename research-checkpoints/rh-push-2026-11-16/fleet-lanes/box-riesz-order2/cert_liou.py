#!/usr/bin/env python3
"""cert_liou.py k N [N ...]: Arb-certified signs of f_{k,N}(sigma) = sum_{n<=N} (1-log n/log(N+1))^k lambda(n) n^-sigma at sigma = 1/2 and
at sigma = 0.99.  f(1/2) < 0 < f(0.99) certifies a real zero in (1/2, 0.99): a zero of the Bohr lift at theta = (pi, ..., pi)."""
import sys, json
from flint import arb, ctx
import liou_zero
ctx.prec = 128
k = int(sys.argv[1])
for N in [int(x) for x in sys.argv[2:]]:
    lam = liou_zero.lam_upto(N); lM = arb(N + 1).log(); a = arb(0); b = arb(0); half = arb(1) / 2; s2 = arb(99) / 100
    for n in range(1, N + 1):
        lg = arb(n).log(); c = (1 - lg / lM) ** k * int(lam[n - 1])
        a += c * (-half * lg).exp(); b += c * (-s2 * lg).exp()
    sa = 'neg' if a < 0 else ('pos' if a > 0 else 'undecided'); sb = 'neg' if b < 0 else ('pos' if b > 0 else 'undecided')
    print(json.dumps(dict(k=k, N=N, f_half=float(a.mid()), f_half_rad=float(a.rad()), sign_half=sa, f_099=float(b.mid()), sign_099=sb,
                          real_zero_in_half_099=(sa == 'neg' and sb == 'pos'))), flush=True)
