import mpmath as mp
mp.mp.dps=20
kap=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
f=lambda s: 5**(-s)*(mp.zeta(s,mp.mpf(1)/5)+kap*mp.zeta(s,mp.mpf(2)/5)-kap*mp.zeta(s,mp.mpf(3)/5)-mp.zeta(s,mp.mpf(4)/5))
def X(t):
    s=mp.mpc(0.5,t)
    v=(mp.pi/5)**(-s/2)*mp.gamma((s+1)/2)*f(s)
    return mp.re(v)*mp.exp(mp.pi*t/4)   # real on the line; rescaled
ts=[mp.mpf(i)/25 for i in range(1,int(120*25))]
prev=X(ts[0]); zs=[]
for t in ts[1:]:
    cur=X(t)
    if prev*cur<0: zs.append(float(t))
    prev=cur
import bisect
for T in (20,50,85.7,114.2,120):
    print('on-line DH zeros with 0<gamma<%s: %d'%(T,bisect.bisect(zs,T)))
print('first few', zs[:8])
# zeta zeros count
zz=[float(mp.im(mp.zetazero(n))) for n in range(1,31)]
for T in (12,16,20,30,50): print('zeta zeros below',T, bisect.bisect(zz,T))
