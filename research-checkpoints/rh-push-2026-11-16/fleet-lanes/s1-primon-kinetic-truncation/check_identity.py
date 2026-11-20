#!/usr/bin/env python3
"""Known-answer check for test 3: pole-corrected Fejer margin minus Re xi'/xi(s) equals Re sum_rho (X^{rho-s}-1)/((rho-s)^2 log X) (zeros from mpmath)."""
import json, numpy as np, mpmath as mp
mp.mp.dps = 20
r = json.load(open("resS6.json"))["t3"]; XS, YS = r["XS"], r["YS"]; X = 1e6; lx = np.log(X)
gam = [float(mp.im(mp.zetazero(n))) for n in range(1, 301)]
pc = np.array(r["zeta"]["1e+06"]["pc"], dtype=float); tr = np.array(r["truth_zeta"])
for (i, j) in ((0, 0), (0, 7), (2, 3), (4, 9)):
    s = complex(0.5 + XS[i], YS[j]); z = 0
    for g in gam:
        for rho in (complex(0.5, g), complex(0.5, -g)): z += (X ** (rho - s) - 1) / ((rho - s) ** 2 * lx)
    tail = 2 * sum(1 / g ** 2 for g in gam); tail = (0.0461914179 - tail) / lx   # remaining -(-1)/(gamma^2 log X) part of the zeros beyond the list (uses sum 1/gamma^2 over all zeros)
    print("s=%s  measured pc - Re xi'/xi = %.6f   zero sum (300 zeros) = %.6f   (+ tail bound %.6f)" % (s, pc[i, j] - tr[i, j], z.real, tail))
