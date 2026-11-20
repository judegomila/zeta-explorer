import mpmath as mp
mp.mp.dps = 20
kap = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
Q5 = [mp.mpf(k)/5 for k in (1, 2, 3, 4)]
CF = [1, kap, -kap, -1]
def L_dh(z):
    s = mp.mpf(1)/2 + z
    h = mp.fsum(c*mp.zeta(s, a) for c, a in zip(CF, Q5))
    hd = mp.fsum(c*mp.zeta(s, a, 1) for c, a in zip(CF, Q5))
    return mp.log(5/mp.pi)/2 + mp.digamma((s+1)/2)/2 - mp.log(5) + hd/h
def Gfun(s):
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2
def L_z(z):
    s = mp.mpf(1)/2 + z
    return Gfun(s) + mp.zeta(s, derivative=1)/mp.zeta(s)
def Ldh_axis(t):  return complex(L_dh(mp.mpc(0, t)))
def Lz_axis(t):   return complex(L_z(mp.mpc(0, t)))
