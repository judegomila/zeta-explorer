"""Toy check of the counting law. F(w) = prod_{gamma_j <= H} (w^2 + gamma_j^2) x one quadruple (delta, gamma0): L = F'/F is a finite
zero sum, and the Pick matrix of L equals the sum over zeros of the kernels K_rho (rank one per on-line zero).
First negative pivot index n* on Halton nodes of [0.05,2] x [-10,10], as a function of the cut H (zeta ordinates)."""
import sys, json
from flint import acb, arb, ctx
import lib
from run_index import nodes
ctx.prec = 6000
g0 = arb('85.69934849'); d0 = arb('0.30851718'); n = 150
pts = nodes(n, 0.0, 10.0, 0.05, 2.0); w = [acb(x, y) for x, y in pts]
zs = [acb.zeta_zero(k).imag for k in range(1, 400)]
for H in (60, 86, 100, 120, 150, 200, 300, 600):
    gam = [z for z in zs if z < H]
    lam = acb(g0, -d0); lam = lam * lam
    L = []
    for x in w:
        s = acb(0); x2 = x * x
        for g in gam: s += 2 * x / (x2 + g * g)
        s += 2 * x / (x2 + lam) + 2 * x / (x2 + lam.conjugate())
        L.append(s)
    piv = lib.schur_cplx(w, [(l + 1, l - 1) for l in L])
    negs = [(p[0] + 1, round(p[2])) for p in piv if p[1] < 0]
    und = [p[0] for p in piv if p[1] == 0]
    print(json.dumps(dict(H=H, zeros_on_line_pm=2 * len(gam), first_negatives=negs[:3], decided_up_to=(und[0] if und else n))), flush=True)
