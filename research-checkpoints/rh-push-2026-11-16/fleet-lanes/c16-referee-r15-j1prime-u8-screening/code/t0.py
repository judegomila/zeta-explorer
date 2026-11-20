import flint, time, math
from flint import acb, arb, dirichlet_char, ctx
ctx.prec = 64
for l in (2,3,4):
    c = dirichlet_char(5,l)
    print(l, [c(n) if hasattr(c,'__call__') else None for n in range(1,5)] if False else '', c.l(acb(2)), )
c2 = dirichlet_char(5,2); c3 = dirichlet_char(5,3)
print(c2(2), c3(2), c2(4))
t0=time.time()
for t in (100.5, 1000.5, 10000.5, 30000.5):
    t1=time.time(); z=c2.hardy_z(acb(t)); z3=c3.hardy_z(acb(t)); print(t, z, z3, time.time()-t1)
