import sys, time
from flint import acb, arb, ctx, fmpq
import amp
ctx.prec = 400
z1 = acb.zeta_zero(1).imag
pt = amp.Point(fmpq(1,2), z1, zero=True)
print("B^2/delta", (abs(pt.B)**2/pt.delta).str(15), "MS(1)", pt.MS(1).str(15))
# C6
import random
random.seed(1)
for k in range(5):
    q = fmpq(random.randint(1,99),100)
    e = pt.nu
    f = lambda v,_: (1-v*v)**(e-1)
    val = 2*acb.integral(f, 0, (acb(1-q)).sqrt())
    print("C6", q, (val - pt.Bq(q,1)).abs_upper().str(5))
for (T,N) in [(8,8),(32,32),(1,8),(2,2),(1,2)]:
    t0=time.time()
    P, lam, info = amp.gram(pt, T, N)
    P3, _, _ = amp.gram(pt, T, N, Hfac=3)
    dH = max(abs(P[m,n]-P3[m,n]).upper() for m in range(N) for n in range(N))
    herm = max(abs(P[m,n]-P[n,m].conjugate()).upper() for m in range(N) for n in range(N))
    MST = pt.MS(T)
    g, xo = amp.gain_opt(P, lam, MST)
    print(T,N,info, "P11/MS(T)", (P[0,0]/MST).real.str(12), "dH", float(dH), "herm", float(herm), "Gopt", g.real.str(12), "N^d", float(N**0.5), "%.1fs"%(time.time()-t0))
