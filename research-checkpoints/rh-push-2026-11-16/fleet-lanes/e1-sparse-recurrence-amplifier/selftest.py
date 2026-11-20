import numpy as np, mpmath as mp, time
from lib import *
mp.mp.dps=25
def dh_mp(s):
    return mp.power(5,-s)*(mp.zeta(s,mp.mpf(1)/5)+XI*mp.zeta(s,mp.mpf(2)/5)-XI*mp.zeta(s,mp.mpf(3)/5)-mp.zeta(s,mp.mpf(4)/5))
print('DH(rho0) direct', abs(point(DH,RHO0)[0]), 'mp', abs(dh_mp(mp.mpc(RHO0))))
t=time.time(); f=line(DH,0.7,1000.0,0.05,2000); print('line time',time.time()-t)
for k in (0,777,1999):
    s=mp.mpc(0.7,1000+0.05*k); print(k, abs(f[k]-complex(dh_mp(s))))
f=line(ZETA,0.6,5000.0,0.05,2000)
for k in (0,777,1999):
    s=mp.mpc(0.6,5000+0.05*k); print('zeta',k, abs(f[k]-complex(mp.zeta(s))))
t=time.time(); f=line(DH,0.75,0.0,0.05,2_000_000); print('full line time',time.time()-t)
for k in (20,1713987,1999999):
    s=mp.mpc(0.75,0.05*k); print(k, abs(f[k]-complex(dh_mp(s))), abs(f[k]))
f=line(ZETA,0.6,0.0,0.05,2_000_000)
for k in (200,1713987,1999999):
    s=mp.mpc(0.6,0.05*k); print('zeta',k, abs(f[k]-complex(mp.zeta(s))), abs(f[k]))
