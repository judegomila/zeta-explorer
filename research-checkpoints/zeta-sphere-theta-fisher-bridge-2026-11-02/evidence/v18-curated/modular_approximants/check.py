"""Supplemental non-certified checks; own code, mpmath only."""
import mpmath as mp
mp.mp.dps=70

def p(n,v):
 c=mp.pi*mp.exp(2*v)
 r=c*n*n
 return 4*mp.exp(v/2)*r*(2*r-3)*mp.exp(-r)

for N in (1,2,3):
 d=mp.fsum(mp.diff(lambda v:p(n,v),0) for n in range(1,N+1))
 e=mp.fsum(mp.diff(lambda v:p(n,v),0) for n in range(N+1,20))
 print('oddjet',N,mp.nstr(d,30),mp.nstr(e,30),mp.nstr(d+e,5))
for N,v in ((1,mp.mpf(0)),(2,mp.mpf('0.25'))):
 c=mp.pi*mp.exp(2*v)
 integral=4*mp.exp(v/2)*c*N**3*mp.exp(-c*N*N)
 signed=mp.fsum(mp.quad(lambda u:(u-k-mp.mpf('.5'))*mp.diff(lambda x:p(x,v),u),[k,k+1]) for k in range(N,12))
 exact=mp.fsum(p(n,v) for n in range(N+1,20))
 closure=integral-p(N,v)/2+signed
 print('EulerClosure',N,v,'exact=',mp.nstr(exact,30),'closure=',mp.nstr(closure,30),'difference=',mp.nstr(exact-closure,5))
