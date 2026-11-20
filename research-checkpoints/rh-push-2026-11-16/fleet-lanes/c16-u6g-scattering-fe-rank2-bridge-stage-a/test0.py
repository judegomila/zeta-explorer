# Formula checks: (a) M=1 against the direct integral over the kite; (b) rank-one reduction sanity is implicit.
import mpmath as mp
from gram import *
mp.mp.dps=30
one=lambda u: mp.mpf(1)
def F(lam,M,s1,s2,T):
    # constant-term function at H = T - s1 a1v - s2 a2v
    tot=0
    for (nu,c) in orbit(lam,M):
        tot+= c*mp.exp(pair(nu,T)-s1*nu[0]-s2*nu[1])
    return tot
def kite(lam,mu,M,T):
    t1,t2=T
    # region: s1,s2>=0, t1-2 s1+s2>=0, t2+s1-2 s2>=0
    # s2 from max(0,2 s1 - t1) to (t2+s1)/2 ; s1 from 0 to s1max where 2s1-t1=(t2+s1)/2 -> s1=(2t1+t2)/3
    s1max=(2*t1+t2)/3
    f=lambda s1: mp.quad(lambda s2: F(lam,M,s1,s2,T)*mp.conj(F(mu,M,s1,s2,T)),[max(mp.mpf(0),2*s1-t1),(t2+s1)/2])
    return mp.quad(f,[0,t1/2,s1max])
lam=(mp.mpc(0.3,1.1),mp.mpc(0.45,-0.7)); mu=(mp.mpc(0.2,0.4),mp.mpc(0.6,1.3))
for T in [(mp.mpf(1),mp.mpf(1)),(mp.mpf('0.5'),mp.mpf('1.5'))]:
    a=K(orbit(lam,one),orbit(mu,one),T); b=kite(lam,mu,one,T)
    print('M=1',T,mp.nstr(a,12),mp.nstr(b,12),mp.nstr(abs(a-b),3))
