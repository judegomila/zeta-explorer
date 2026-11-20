"""Independent floating-point consistency check, NOT part of the analytic proof."""
from math import pi,exp,expm1,log1p,sinh,log,sqrt
from scipy.optimize import brentq
from scipy.integrate import quad

def AA(u):
 u=abs(u);r=pi*exp(2*u)
 return sum((m**4-1.5/pi*m*m*exp(-2*u))*exp(-r*(m*m-1)) for m in range(1,7))
def run(n):
 H=brentq(lambda h:2*n/h+9-4*pi*exp(2*h),.1,20);k=4*pi*exp(2*H);s=1/sqrt(k)
 def weight(y):
  d=s*y;h=H+d
  ll=2*n*(log1p(d/H)-d/H)-k/2*(expm1(2*d)-2*d)
  return exp(ll)*AA(h)**2
 Z=quad(weight,-10,10,epsabs=1e-13,epsrel=1e-13)[0]
 def F(x):
  v=s*x
  def integrand(y):
   d=s*y;h=H+d
   if v>=h:raise ValueError('outside exploratory range')
   rr=AA(h-v)*AA(h+v)/AA(h)**2*exp(-k*exp(2*d)*sinh(v)**2)
   return weight(y)*rr
  return quad(integrand,-10,10,epsabs=1e-12,epsrel=1e-12)[0]/Z
 err=2*quad(lambda x:abs(F(x)-exp(-x*x)),0,8,epsabs=1e-10,limit=100)[0]
 print('n',n,'H',H,'s',s,'observed truncated L1',err,'250s',250*s,'L1/s²',err/(s*s),flush=True)
for n in [700,10000,1000000]:run(n)
