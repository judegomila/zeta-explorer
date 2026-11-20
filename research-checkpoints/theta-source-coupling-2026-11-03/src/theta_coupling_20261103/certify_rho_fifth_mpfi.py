"""Directed MPFI certificate of two finite complete-theta Rayleigh witnesses.
No target-pivot positivity is assumed. Tail proofs are in RHO_FIFTH.md.
"""
import ctypes as ct, math, argparse, json, time
from fractions import Fraction as F
class MPFR(ct.Structure):
 _fields_=[('prec',ct.c_long),('sign',ct.c_int),('exp',ct.c_long),('d',ct.POINTER(ct.c_ulong))]
class MPFI(ct.Structure): _fields_=[('left',MPFR),('right',MPFR)]
mpfi=ct.CDLL('libmpfi.so.0');mpfr=ct.CDLL('libmpfr.so.6');P=ct.POINTER(MPFI)
mpfi.mpfi_init2.argtypes=[P,ct.c_long];mpfi.mpfi_clear.argtypes=[P];mpfi.mpfi_set_str.argtypes=[P,ct.c_char_p,ct.c_int];mpfi.mpfi_const_pi.argtypes=[P]
for f in ['add','sub','mul','div','union']:getattr(mpfi,'mpfi_'+f).argtypes=[P,P,P]
for f in ['exp','neg']:getattr(mpfi,'mpfi_'+f).argtypes=[P,P]
mpfr.mpfr_get_d.argtypes=[ct.POINTER(MPFR),ct.c_int];mpfr.mpfr_get_d.restype=ct.c_double
class I:
 def __init__(self,s=None):
  self.x=MPFI();mpfi.mpfi_init2(ct.byref(self.x),160)
  if s is not None and mpfi.mpfi_set_str(ct.byref(self.x),str(s).encode(),10)!=0:raise ValueError(s)
 def __del__(self):mpfi.mpfi_clear(ct.byref(self.x))
 def op(self,y,f):
  if not isinstance(y,I):y=I(y)
  z=I();getattr(mpfi,'mpfi_'+f)(ct.byref(z.x),ct.byref(self.x),ct.byref(y.x));return z
 def __add__(self,y):return self.op(y,'add')
 def __sub__(self,y):return self.op(y,'sub')
 def __mul__(self,y):return self.op(y,'mul')
 def __truediv__(self,y):return self.op(y,'div')
 def unary(self,f):
  z=I();getattr(mpfi,'mpfi_'+f)(ct.byref(z.x),ct.byref(self.x));return z
 def lo(self):return mpfr.mpfr_get_d(ct.byref(self.x.left),3)
 def hi(self):return mpfr.mpfr_get_d(ct.byref(self.x.right),2)
 def bounds(self):return [self.lo(),self.hi()]
def hull(a,b):return a.op(b,'union')
def rat(x):return I(x.numerator)/I(x.denominator)
# Exact recurrence P_(k+1)=(1/2-2z)P_k+2zP_k'.
polys=[[F(0),F(-3),F(2)]]
for k in range(11):
 p=polys[-1];q=[F(0)]*(len(p)+1)
 for j,c in enumerate(p):q[j]+=(F(1,2)+2*j)*c;q[j+1]-=2*c
 polys.append(q)
assert max(sum(map(abs,p)) for p in polys)<2*10**11
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x));two=I(2);four=I(4);three=I(3)
err=hull(I('-1e-18'),I('1e-18'))
# Certified inequalities used by the elementary complete-orbit and spatial-tail bounds.
assert I(5).unary('exp').lo()>147
assert (I(16*10**11)*I('-73.5').unary('exp')).hi()<1e-18
assert I('-22.5').unary('exp').hi()<.5
assert I(6).unary('exp').lo()>400
assert ((I('1e42')*I(-1200).unary('exp'))/I('1e-450')).hi()<1
coeffs={'even':[7500000,0,1850000,0,57000,0,460,0,1], 'odd':[0,73000000,0,5900000,0,105000,0,600,0,1]}
def combine(co,shift):
 out=[F(0)]*(max(len(polys[k+shift]) for k,c in enumerate(co) if c))
 for k,c in enumerate(co):
  if c:
   for j,a in enumerate(polys[k+shift]):out[j]+=c*a
 return [rat(c) for c in out]
def polyval(p,z):
 v=p[-1]
 for c in p[-2::-1]:v=v*z+c
 return v
def setup(co):
 dc=[(k+1)*co[k+1] for k in range(len(co)-1)]
 return [combine(co,j) for j in range(3)]+[combine(dc,j) for j in range(3)],sum(abs(c) for c in co),sum(abs(c) for c in dc)
def evaluate(x,pp,cf,cg,indices):
 vals=[I(0) for k in indices];ex=(two*x).unary('exp')
 for n in range(1,7):
  z=pi*I(n*n)*ex;fac=four*(x/two-z).unary('exp')
  for i,k in enumerate(indices):vals[i]=vals[i]+fac*polyval(pp[k],z)
 return [v+I(cf if k<3 else cg)*err for v,k in zip(vals,indices)]
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--cells',type=int,default=8000);ap.add_argument('--output');a=ap.parse_args();N=a.cells;step=three/I(N);step3=step*step*step/I(24);out={};start=time.monotonic()
 for name,co in coeffs.items():
  pp,cf,cg=setup(co);total=I(0);norm=I(0)
  for j in range(N):
   lo=I(3*j)/I(N);hi=I(3*(j+1))/I(N);x=hull(lo,hi);mid=I(3*(2*j+1))/I(2*N)
   F0,G0=evaluate(mid,pp,cf,cg,[0,3]);Xm=two*mid*F0+G0;fm=G0*G0-I('.8')*Xm*Xm
   f,fp,fpp,g,gp,gpp=evaluate(x,pp,cf,cg,list(range(6)));X=two*x*f+g;Xp=two*f+two*x*fp+gp;Xpp=four*fp+two*x*fpp+gpp
   f2=two*(gp*gp+g*gpp)-I('1.6')*(Xp*Xp+X*Xpp)
   total=total+step*fm+step3*f2
  total=total+hull(I('-1e-450'),I('1e-450'))
  out[name]={'polynomial_coefficients_ascending':co,'integral_Y2_minus_four_fifths_X2':total.bounds()};print(name,total.bounds(),flush=True);assert total.lo()>0
 out['cells']=N;out['precision_bits']=160;out['complete_orbit_tail_per_derivative']='1e-18';out['spatial_energy_tail']='1e-450';out['seconds']=time.monotonic()-start;print(json.dumps(out,indent=2))
 if a.output:open(a.output,'w').write(json.dumps(out,indent=2)+'\n')
if __name__=='__main__':main()
