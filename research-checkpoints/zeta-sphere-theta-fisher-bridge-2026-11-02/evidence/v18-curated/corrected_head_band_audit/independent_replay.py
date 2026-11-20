"""Authored interval certificate for an actual completed-zeta spectral band."""
from mpmath import iv
import mpmath as mp
from fractions import Fraction
from math import factorial
from pathlib import Path
import json,time
iv.dps=30;mp.mp.dps=45
ROOT=Path(__file__).resolve().parent
N=128;M=20
logs=[iv.log(n) for n in range(1,N+1)]; ln=iv.log(N)
# Bernoulli numbers from an exact rational recurrence, not floating constants.
B=[Fraction(1)]
from math import comb
for n in range(1,2*M+1):B.append(-sum(Fraction(comb(n+1,k))*B[k] for k in range(n))/Fraction(n+1))
cs=[iv.mpf(B[2*k].numerator)/B[2*k].denominator/factorial(2*k)*iv.mpf(N)**(-2*k+1) for k in range(1,M+1)]

def vals(sl,sh,tl,th):
 s=iv.mpf([sl,sh]);t=iv.mpf([tl,th]);z=iv.mpc(s,t)
 h=iv.mpc(0);hp=iv.mpc(0)
 for l in logs:
  v=iv.exp(-z*l);h+=v;hp-=l*v
 nz=iv.exp(-z*ln)
 term=N*nz/(z-1);h+=term;hp+=term*(-ln-1/(z-1))
 term=-nz/2;h+=term;hp-=ln*term
 p=iv.mpc(1);pp=iv.mpc(0)
 for r in range(2*M):
  pp,p=pp*(z+r)+p,p*(z+r)
  if r%2==0:
   k=r//2;h+=cs[k]*nz*p;hp+=cs[k]*nz*(pp-ln*p)
 # No zeta function is used by the certificate.
 # Digamma rectangle enclosure from integral comparison, valid Re(z/2)>0.
 base=2*s/(s*s+t*t)+2*(s-1)/((s-1)**2+t*t)+iv.log((s*s+t*t)/4)/2-iv.log(iv.pi)
 bg=base+iv.mpf([-1,1])*iv.pi/t
 norm=h.real**2+h.imag**2
 head=bg*norm/2+(hp.real*h.real+hp.imag*h.imag)
 # Uniform safe bound 2*zeta(40)<4; |rising factorial| is interval-enclosed.
 e=4*abs(p)/(2*iv.pi)**(2*M)*iv.mpf(N)**(1-s-2*M)/(s+2*M-1)
 e1=e*(sum((1/abs(z+r) for r in range(2*M)),iv.mpf(0))+ln+1/(s+2*M-1))
 cost=abs(bg)/2*(2*abs(h)*e+e**2)+abs(hp)*e+abs(h)*e1+e*e1
 margin=head-cost
 return margin,head,cost

def run():
 start=time.time();stack=[(mp.mpf(7)/8,mp.mpf(1),mp.mpf(t),mp.mpf(t+1),0) for t in range(100,101)]
 leaves=0;checks=0;minmargin=mp.inf;maxdepth=0;fails=[]
 while stack:
  sl,sh,tl,th,depth=stack.pop();q,head,cost=vals(sl,sh,tl,th);checks+=1
  if q.a>0:
   leaves+=1;minmargin=min(minmargin,mp.mpf(q.a));maxdepth=max(maxdepth,depth)
  elif depth>=24:
   fails.append([str(v) for v in (sl,sh,tl,th,q)]);break
  elif th-tl>sh-sl:
   tm=(tl+th)/2;stack.extend([(sl,sh,tl,tm,depth+1),(sl,sh,tm,th,depth+1)])
  else:
   sm=(sl+sh)/2;stack.extend([(sl,sm,tl,th,depth+1),(sm,sh,tl,th,depth+1)])
  if checks%100==0:print('checks',checks,'leaves',leaves,'pending',len(stack),'minmargin',minmargin,'seconds',time.time()-start,flush=True)
 out={'pass':not fails and not stack,'N':N,'m':M,'sigma':['7/8','1'],'t':['100','101'],'leaves':leaves,'checks':checks,'min_normalized_margin':str(minmargin),'maxdepth':maxdepth,'failures':fails,'seconds':time.time()-start}
 (ROOT/'certificate.json').write_text(json.dumps(out,indent=2));print(out,flush=True)
if __name__=='__main__':run()
