import numpy as np, mpmath as mp
from gain import *
I = mp.mpc(0,1)
def Lchi(s):
    return mp.power(5,-s)*(mp.hurwitz(s,mp.mpf(1)/5)+I*mp.hurwitz(s,mp.mpf(2)/5)-I*mp.hurwitz(s,mp.mpf(3)/5)-mp.hurwitz(s,mp.mpf(4)/5))
print("check L(2,chi) vs sum", Lchi(2), flush=True)
for c in (40.0, 85.699348485377592):
    u, vals = sample(Lchi, c, 50.0, 1/32)
    for d in (0.5, 0.25):
        row = []
        for N in (1,2,3,4,6,8,12,16,24,32,48,64):
            e,x = eN(u, vals, d, c, N, False); row.append("N=%d:%.4f"%(N,e))
        print("L(s,chi5) c=%.4f d=%g "%(c,d), " ".join(row), flush=True)
for c in (200.25, 500.125, 1000.5, 3000.375):
    u, vals = sample(mp.zeta, c, 40.0, 1/32)
    for d in (0.5, 0.25, 0.125):
        row = []
        for N in (2,3,4,6,8,16):
            e,x = eN(u, vals, d, c, N, True); row.append("N=%d:%.4f"%(N,e))
        print("zeta c=%.4f d=%g "%(c,d), " ".join(row), flush=True)
