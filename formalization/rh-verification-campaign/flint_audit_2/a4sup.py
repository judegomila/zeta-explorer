# sup_x |Gamma(1/4 + i x/2)| e^{pi x/4}:  x<=0: <= Gamma(1/4) (|Gamma(a+iy)|<=Gamma(a)), x>=2: Stirling with |R_1|<=sec^2(arg z/2)/(12|z|)<1/(6|z|)
# gives <= exp(1/2 log 2pi - 1/4 log(x/2) + 1/(3x)) <= 2.961; [0,2]: interval cells.
from flint import arb, acb, ctx
ctx.prec = 128
M = 20000; best_lo = arb(0); best_hi = arb(0); xmax = None
for i in range(M):
    a = arb(2)*i/M; w = arb(2)/M
    cell = arb(a + w/2, w/2)
    v = abs(acb(arb(1)/4, cell/2).gamma()) * (arb.pi()*cell/4).exp()
    if v.upper() > best_hi.upper(): best_hi = v.upper(); xmax = a
    lo = abs(acb(arb(1)/4, (a+w/2)/2).gamma()) * (arb.pi()*(a+w/2)/4).exp()
    if lo.lower() > best_lo.lower(): best_lo = lo.lower()
print("sup on [0,2]: in [", best_lo.str(8,radius=False), ",", best_hi.str(8,radius=False), "] near x =", xmax.str(6,radius=False))
y = arb(1); print("Stirling bound at x>=2:", (arb(2*arb.pi()).log()/2 - y.log()/4 + 1/(6*y)).exp().str(6,radius=False), "  Gamma(1/4) =", arb(1/4).gamma().str(8,radius=False) if False else acb(arb(1)/4).gamma().real.str(8,radius=False))
