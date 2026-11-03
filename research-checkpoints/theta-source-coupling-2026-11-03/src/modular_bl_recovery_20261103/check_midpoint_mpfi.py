# 160-bit MPFI enclosure of theta midpoint curvature and first moment ratio.
import ctypes as ct, math
class MPFR(ct.Structure):
    _fields_=[('prec',ct.c_long),('sign',ct.c_int),('exp',ct.c_long),('d',ct.POINTER(ct.c_ulong))]
class MPFI(ct.Structure):
    _fields_=[('left',MPFR),('right',MPFR)]
mpfi=ct.CDLL('libmpfi.so.0'); mpfr=ct.CDLL('libmpfr.so.6');P=ct.POINTER(MPFI)
mpfi.mpfi_init2.argtypes=[P,ct.c_long];mpfi.mpfi_clear.argtypes=[P]
mpfi.mpfi_set_str.argtypes=[P,ct.c_char_p,ct.c_int];mpfi.mpfi_interv_d.argtypes=[P,ct.c_double,ct.c_double];mpfi.mpfi_const_pi.argtypes=[P]
for f in ['add','sub','mul','div']:getattr(mpfi,'mpfi_'+f).argtypes=[P,P,P]
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
def inter(lo,hi):
 z=I();mpfi.mpfi_interv_d(ct.byref(z.x),lo,hi);return z
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x));two=I(2);four=I(4);step=I('0.0002');err=inter(-0.000004000000000000001,0.000004000000000000001)
Psum=I(0);Isum=I(0);Ksum=I(0)
for j in range(10000):
 lo=0 if j==0 else math.nextafter(j/5000,-math.inf);hi=math.nextafter((j+1)/5000,math.inf);x=inter(lo,hi);p=I(0);q=I(0)
 for n in (1,2):
  z=pi*I(n*n)*(two*x).unary('exp');b=four*(x/two-z).unary('exp')
  p=p+b*(two*z*z-I(3)*z)
  q=q+b*(I(-4)*z*z*z+I(15)*z*z-I('7.5')*z)
 p=p+err;q=q+err
 Psum=Psum+p*p*step;Isum=Isum+x*x*p*p*step;Ksum=Ksum+x*x*q*q*step
tail=inter(-1.0000000000000001e-100,1.0000000000000001e-100)
Psum=Psum+tail;Isum=Isum+tail;Ksum=Ksum+tail
alpha=(four*Ksum-two*Psum)/(four*Isum)
# Independent midpoint curvature from n<=4; all j<=2 omitted n>=5 bounded by 1e-15.
p0=I(0);q2=I(0)
for n in (1,2,3,4):
 z=pi*I(n*n);b=four*z.unary('neg').unary('exp')
 p0=p0+b*(two*z*z-I(3)*z)
 q2=q2+b*(I(8)*z*z*z*z-I(56)*z*z*z+I('82.5')*z*z-I('18.75')*z)
e2=inter(-1.0000000000000001e-15,1.0000000000000001e-15);p0=p0+e2;q2=q2+e2
curv=q2.unary('neg')/p0
assert alpha.lo()>11.38 and alpha.hi()<12.12 and curv.lo()>17 and curv.hi()<19
print('alpha enclosure:',alpha.lo(),alpha.hi());print('midpoint curvature:',curv.lo(),curv.hi())
