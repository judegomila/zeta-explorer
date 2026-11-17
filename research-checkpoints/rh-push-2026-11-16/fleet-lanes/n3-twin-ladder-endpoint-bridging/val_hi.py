from zf import *
from flint import acb, arb
import time
t0=time.time(); Z=ZF(prec=400, delta=0.15, h=0.05, n=72, xmax=3.15); print("setup", time.time()-t0)
def rel(a,b): return float(abs(a-b)/abs(b))
for s in [acb(0.5,300.3), acb(0.5,700.2), acb(0.5,1000.1), acb(0.3,1000.1)]:
    print("w=1", float(s.imag), rel(Z.F(1,s), zstar(s)))
for s in [acb(0.2,1000.1), acb(1.0, 999.0)]:
    print("w=0", float(s.imag), rel(Z.F(0,s), Gclosed(s)))
