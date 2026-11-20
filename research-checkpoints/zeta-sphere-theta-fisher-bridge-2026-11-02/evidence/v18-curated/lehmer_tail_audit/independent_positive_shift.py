"""Authored positive-shift robustness certificate using the certified a=0 core."""
import mpmath as mp
from mpmath import iv
from fractions import Fraction
from math import comb,factorial
import json,time
from pathlib import Path
iv.dps=45;mp.mp.dps=60;N=8192;M=40
a=iv.mpf(1)/10000;s=iv.mpf(1)/2+a;t=iv.mpf(7005081715)/1000000;z=iv.mpc(s,t);ln=iv.log(N)
B=[Fraction(1)]
for n in range(1,2*M+1):B.append(-sum(Fraction(comb(n+1,k))*B[k] for k in range(n))/Fraction(n+1))
h=iv.mpc(0);hp=iv.mpc(0);hpp=iv.mpc(0);start=time.time()
for n in range(1,N+1):
 l=iv.log(n);v=iv.exp(-z*l);h+=v;hp-=l*v;hpp+=l*l*v
nz=iv.exp(-z*ln);v=N*nz/(z-1);lv=-ln-1/(z-1)
h+=v;hp+=lv*v;hpp+=(lv*lv+1/(z-1)**2)*v
v=-nz/2;h+=v;hp-=ln*v;hpp+=ln*ln*v
p=iv.mpc(1);pp=iv.mpc(0);ppp=iv.mpc(0)
for r in range(2*M):
 ppp,pp,p=ppp*(z+r)+2*pp,pp*(z+r)+p,p*(z+r)
 if r%2==0:
  k=(r+1)//2+1;c=iv.mpf(B[2*k].numerator)/B[2*k].denominator/factorial(2*k)*iv.mpf(N)**(-2*k+1)
  h+=c*nz*p;hp+=c*nz*(pp-ln*p);hpp+=c*nz*(ppp-2*ln*pp+ln*ln*p)
base=2*s/(s*s+t*t)+2*(s-1)/((s-1)**2+t*t)+iv.log((s*s+t*t)/4)/2-iv.log(iv.pi)
b=base+iv.mpf([-1,1])*iv.pi/t
# Integral comparison for psi1: |psi1(w)-1/w|<=2/(Im w)^2.
bp=(-2/z**2-2/(z-1)**2+1/z).real+iv.mpf([-1,1])*4/t**2
re=lambda a,b:a.real*b.real+a.imag*b.imag
norm=lambda a:a.real**2+a.imag**2
head=(b*b+bp)*norm(h)/2+2*b*re(hp,h)+norm(hp)+re(hpp,h)
D=s+2*M-1;S1=sum((1/abs(z+r) for r in range(2*M)),iv.mpf(0));S2=sum((1/abs(z+r)**2 for r in range(2*M)),iv.mpf(0))
e=4*abs(p)/(2*iv.pi)**(2*M)*iv.mpf(N)**(1-s-2*M)/D
e1=e*(S1+ln+1/D);e2=e*((S1+ln+1/D)**2+S2+1/D**2)
E2=abs(b*b+bp)*(2*abs(h)*e+e**2)+4*abs(b)*(abs(hp)*e+abs(h)*e1+e*e1)+2*(2*abs(hp)*e1+e1**2)+2*(abs(hpp)*e+abs(h)*e2+e*e2)
q=z*(z-1)/2*iv.exp(-z/2*iv.log(iv.pi)+iv.loggamma(z/2)+iv.pi*t/4)
G=norm(q);E=abs(b)/2*(2*abs(h)*e+e**2)+abs(hp)*e+abs(h)*e1+e*e1
full=G*(b*norm(h)/2+re(hp,h)+iv.mpf([-1,1])*E)/a
y=iv.pi/4-2/t;c=iv.cos(2*y);Bwin=iv.mpf(2)
Nbound=512/c**5
change=iv.exp(4)*Bwin**3/12*Nbound*(((iv.exp(a*Bwin)-iv.exp(-a*Bwin))/2)/(a*Bwin)-1)
core_lower=iv.mpf(56962777800000)-change
negative_tail=full-core_lower
interval=lambda a:[str(mp.mpf(a.a)),str(mp.mpf(a.b))]
out={'t_rational':'7005081715/1000000','N':N,'m':M,'a_rational':'1/10000','full_normalized_scaled_interval':interval(full),'core_change_bound':interval(change),'positive_shift_tail_upper_interval':interval(negative_tail),'G_scaled_interval':interval(G),'e':interval(e),'e1':interval(e1),'e2':interval(e2),'seconds':time.time()-start}
print(json.dumps(out,indent=2),flush=True);Path(__file__).with_name('positive_shift_certificate.json').write_text(json.dumps(out,indent=2))
