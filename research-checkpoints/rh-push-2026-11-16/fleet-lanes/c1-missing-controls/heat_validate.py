import sys, time
from heatlib import *
t0 = time.time()
H = Heat(1000, 600.0)
print('build s', round(time.time()-t0,1), flush=True)
for z in [acb(0.3, 4.0), acb(0, 100.0), acb(0, 560.3), acb(2.5, 0), acb(0.31, 85.7)]:
    t1 = time.time(); r = H.F(0, z) / xi(z)
    print('z =', complex(z.real.mid(), z.imag.mid()), ' F_0/xi =', r.real.str(40), r.imag.str(5), ' eval s', round(time.time()-t1,2), flush=True)
