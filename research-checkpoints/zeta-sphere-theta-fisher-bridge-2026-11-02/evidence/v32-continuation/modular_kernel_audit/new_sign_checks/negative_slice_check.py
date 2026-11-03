# Rigorous midpoint + interval second-derivative bound, for a=1/4, x=12.
import mpmath as m
iv=m.iv;iv.dps=25;p=iv.pi;N=2000; step=iv.mpf(1)/1000;a=iv.mpf(1)/4;x=iv.mpf(12);s=iv.mpf(49)/4
fr=fi=dr=di=iv.mpf(0);err0=err1=iv.mpf(0)
def phi_derivs(t):
 q=iv.exp(2*t); out=[iv.mpf(0),iv.mpf(0),iv.mpf(0)]
 for n in range(1,7):
  for j,b,c in [(4,iv.mpf(9)/2,2*p*p),(2,iv.mpf(5)/2,-3*p)]:
   z=p*n*n*q; term=c*n**j*iv.exp(b*t-z); r=b-2*z
   out[0]+=term;out[1]+=term*r;out[2]+=term*(r*r-4*z)
 return out
# h=0 cross section: integral_0^infinity Phi(t)^2 cos(24t) dt.
N=4000;step=iv.mpf(1)/2000;val=iv.mpf(0);err=iv.mpf(0)
for j in range(N):
 t=iv.mpf(2*j+1)/4000
 tbox=iv.mpf([f"{j/2000:.4f}",f"{(j+1)/2000:.4f}"])
 Pmid=phi_derivs(t)[0];val+=step*Pmid*Pmid*iv.cos(24*t)
 P,P1,P2=phi_derivs(tbox)
 # Product rule applied to Phi^2 cos(24t).
 err+=step**3/24*(2*abs(P1)*abs(P1)+2*abs(P)*abs(P2)+96*abs(P)*abs(P1)+576*abs(P)*abs(P))
# Explicit tail proof: n>=7 on [0,2], and the entire squared tail at t>=2.
R=(iv.mpf(8)/7)**4*iv.exp(-15*p)
b=2*p*p*iv.exp(9)*7**4*iv.exp(-49*p)/(1-R)
sum_n=iv.exp(-p)*(1+16*iv.exp(-3*p)/(1-(iv.mpf(3)/2)**4*iv.exp(-5*p)))
Pbound=2*p*p*iv.exp(9)*sum_n
n_tail=2*(2*Pbound*b+b*b)
t_tail=16*p**4*iv.exp(18-2*p*iv.exp(4))/(4*p*iv.exp(4)-9)
assert n_tail+t_tail < iv.mpf('1e-50')
result=val+iv.mpf([-1,1])*(err+iv.mpf('1e-50'))
print("cross-section interval:",result,"error:",err)
assert result < 0
