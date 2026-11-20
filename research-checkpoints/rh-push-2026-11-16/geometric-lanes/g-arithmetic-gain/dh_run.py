import numpy as np, mpmath as mp, json
from gain import *
z = mp.findroot(dh, mp.mpc(0.8085, 85.6993))
print("DH zero", z, abs(dh(z)), flush=True)
b = float(z.real)-0.5; g = float(z.imag)
res = {}
for c in (g, 40.0):
    u, vals = sample(dh, c, 60.0, 1/64)
    uz, vz = sample(mp.zeta, c, 60.0, 1/64)
    for d in (0.5, 0.25):
        obs = 64*d**5*b/((b+d)**2+(g-c)**2)**3
        for N in (1,2,3,4,6,8,12,16,24,32,48,64):
            e,x = eN(u, vals, d, c, N, False)
            ez = eN(uz, vz, d, c, N, True)[0] if N>=2 else 6.0
            res["%g_%g_%d"%(c,d,N)] = (e, ez, obs)
            print("c=%.4f d=%g N=%d  DH e_N=%.6f (coefmax %.2g)  zeta e_N=%.6f  DH-zero obstruction=%.4g"%(c,d,N,e,abs(x).max(),ez,obs), flush=True)
json.dump(res, open("dh_out.json","w"))
