"""Original full-theta interval Simpson certificate near a real Xi zero.
No acquired research code. Exact dyadic nodes, explicit derivative/index/spatial tails.
See ZERO_WINDOW_CERTIFICATE.md for proof and scope.
"""
import json,time
from math import comb,factorial
from pathlib import Path
import mpmath as mp
from mpmath import iv
mp.mp.dps=60
iv.dps=50
ROOT=Path(__file__).resolve().parent
T=mp.mpf(7237)/512
A=mp.mpf(1)/8
COEFF=[[2,-3,0],[-4,15,'-15/2',0],[8,-56,'165/2','-75/4',0],[-16,180,-529,'1635/4','-375/8',0],[32,-528,2588,-4256,'15465/8','-1875/16',0]]
COEFF=[[iv.mpf(c) for c in row] for row in COEFF]
SPECS=[('trig',j,j) for j in range(3)]+[('hyp',3,0)]

def psi_derivatives(x,order):
 r0=iv.pi*iv.exp(2*x)
 front=4*iv.exp(x/2)
 out=[iv.mpf(0) for _ in range(order+1)]
 for n in range(1,7):
  r=r0*n*n;ex=iv.exp(-r)
  for j in range(order+1):
   poly=COEFF[j][0]
   for c in COEFF[j][1:]:poly=poly*r+c
   out[j]+=front*poly*ex
 # Entire n>=7 tail, derivatives 0,...,4, uniform on x>=0.
 err=iv.mpf([-1,1])*iv.mpf('1e-45')*iv.exp(x/2-r0)*(1+r0)**6
 return [z+err for z in out]

def oscillation(x,kind,phase,derivative):
 if kind=='trig':
  d=(phase+derivative)%4
  val=(iv.cos(iv.mpf(T)*x),-iv.sin(iv.mpf(T)*x),-iv.cos(iv.mpf(T)*x),iv.sin(iv.mpf(T)*x))[d]
  return iv.mpf(T)**derivative*val
 return iv.mpf(A)**derivative*(iv.exp(iv.mpf(A)*x)+(-1)**derivative*iv.exp(-iv.mpf(A)*x))/2

def values(x):
 ps=psi_derivatives(x,0)[0]
 return [x**power*ps*oscillation(x,kind,phase,0) for kind,power,phase in SPECS]

def fourth_derivatives(x):
 ps=psi_derivatives(x,4)
 out=[]
 for kind,power,phase in SPECS:
  total=iv.mpf(0)
  for k in range(5):
   prod=sum((comb(k,l)*(factorial(power)//factorial(power-l))*x**(power-l)*ps[k-l] for l in range(min(k,power)+1)),iv.mpf(0))
   total+=comb(4,k)*prod*oscillation(x,kind,phase,4-k)
  out.append(total)
 return out

def run():
 start=time.time();tol=iv.mpf('1e-10')
 total=[iv.mpf(0) for _ in SPECS]
 zero=mp.mpf(0);end=mp.mpf(4)
 stack=[(zero,end,values(iv.mpf(zero)),values(iv.mpf(end)))]
 leaves=0
 while stack:
  lo,hi,left,right=stack.pop();mid=(lo+hi)/2;d=hi-lo
  center=values(iv.mpf(mid))
  fourth=fourth_derivatives(iv.mpf([lo,hi]))
  errors=[abs(z)*iv.mpf(d)**5/2880 for z in fourth]
  if any(err.b>(tol*iv.mpf(d)/4).a for err in errors):
   stack.append((mid,hi,center,right));stack.append((lo,mid,left,center));continue
  for j in range(len(SPECS)):
   total[j]+=iv.mpf(d)*(left[j]+4*center[j]+right[j])/6+iv.mpf([-1,1])*errors[j]
  leaves+=1
 # u>=4 complete spatial tails: absolute <=1e-3000 for all four functions.
 total=[z+iv.mpf([-1,1])*iv.mpf('1e-3000') for z in total]
 rows=[]
 for name,z in zip(['Xi','Xi_prime','Xi_second','weighted_M3'],total):
  # Conservative serialization inflation far above endpoint conversion rounding.
  z+=iv.mpf([-1,1])*iv.mpf('1e-30')
  row={'name':name,'lower':str(mp.mpf(z.a)),'upper':str(mp.mpf(z.b))}
  rows.append(row);print(name,z,flush=True)
 payload={'t0':'7237/512','A':'1/8','iv_decimal_precision':50,'mp_decimal_precision':60,'simpson_absolute_tolerance':'1e-10','leaves':leaves,'seconds':time.time()-start,'values':rows}
 (ROOT/'zero_window_intervals.json').write_text(json.dumps(payload,indent=2)+'\n')
 print('leaves',leaves,'seconds',time.time()-start,flush=True)
 # Test deliberately widened rational bounds used in the mathematical certificate.
 assert total[0].a>iv.mpf('-1e-7').a and total[0].b<iv.mpf('1e-7').b
 assert total[1].a>iv.mpf('-.00139').a and total[1].b<iv.mpf('-.00138').b
 assert abs(total[2]).b<iv.mpf('.00161').a
 assert total[3].b<iv.mpf('.008').a
 print('ALL FOUR CERTIFICATE TARGETS PASS',flush=True)

if __name__=='__main__':run()
