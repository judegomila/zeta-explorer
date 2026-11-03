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
for j in range(N):
 t=iv.mpf(2*j+1)/2000
 tbox=iv.mpf([f'{j/1000:.3f}', f'{(j+1)/1000:.3f}'])
 phi=phi_derivs(t)[0];eplus=iv.exp(a*t);eminus=iv.exp(-a*t); ch=(eplus+eminus)/2;sh=(eplus-eminus)/2; co=iv.cos(x*t);si=iv.sin(x*t)
 fr+=2*step*phi*ch*co;fi-=2*step*phi*sh*si
 dr+=2*step*t*phi*sh*co;di-=2*step*t*phi*ch*si
 P,P1,P2=phi_derivs(tbox); et=iv.exp(a*tbox)
 err0+=2*step**3/24*et*(abs(P2)+2*s*abs(P1)+s*s*abs(P))
 err1+=2*step**3/24*et*(abs(tbox*P2+2*P1)+2*s*abs(tbox*P1+P)+s*s*abs(tbox*P))
# Explicit n>=7 and t>=2 tails, for powers k=0,1.
R=(iv.mpf(8)/7)**4*iv.exp(-15*p)
b=2*p*p*iv.exp(9)*7**4*iv.exp(-49*p)/(1-R)
for k in range(2):
 n_tail=2*b*2**(k+1)*iv.mpf('1.6')
 t_tail=8*p*p*m.factorial(k)*iv.exp(12-p*iv.exp(4))/(2*p*iv.exp(4)-6)
 assert n_tail+t_tail < iv.mpf('1e-50')
e0=err0+iv.mpf('1e-50');e1=err1+iv.mpf('1e-50')
fr+=iv.mpf([-1,1])*e0;fi+=iv.mpf([-1,1])*e0;dr+=iv.mpf([-1,1])*e1;di+=iv.mpf([-1,1])*e1
res=(fr*dr+fi*di)/4
print('F.real',fr,'F.imag',fi,'dF.real',dr,'dF.imag',di,sep='\n')
print('error bounds',e0,e1,'Fourier C:',res,sep='\n')
assert res>0
