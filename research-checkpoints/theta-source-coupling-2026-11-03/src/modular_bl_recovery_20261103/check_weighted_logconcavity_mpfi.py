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
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x));two=I(2);four=I(4);alpha=inter(11.38,12.12)
err=inter(-1.0000000000000001e-89,1.0000000000000001e-89)
maxupper=-1e100; which=-1
for j in range(7000):
 lo=0.0 if j==0 else math.nextafter(j/10000,-math.inf)
 hi=math.nextafter((j+1)/10000,math.inf)
 x=inter(lo,hi);S=[I(0) for _ in range(4)]
 for n in range(1,9):
  z=pi*I(n*n)*(two*x).unary('exp');p=four*(x/two-z).unary('exp');z2=z*z;z3=z2*z;z4=z3*z;z5=z4*z
  pol=[two*z2-I(3)*z, I(-4)*z3+I(15)*z2-I('7.5')*z, I(8)*z4-I(56)*z3+I('82.5')*z2-I('18.75')*z, I(-16)*z5+I(180)*z4-I(529)*z3+I('408.75')*z2-I('46.875')*z]
  for k in range(4):S[k]=S[k]+p*pol[k]
 S=[s+err for s in S];p0,p1,p2,p3=S
 v=p1.unary('neg')/p0;v2=v*v;vp=(p1/p0)*(p1/p0)-p2/p0
 vpp=I(3)*p1*p2/(p0*p0)-two*(p1/p0)*(p1/p0)*(p1/p0)-p3/p0
 H=I(-1)-two*x*x*vp+two*x*x*(vp*vp*(alpha-v2)+v*vpp*(alpha+v2))/((alpha+v2)*(alpha+v2))
 if H.hi()>maxupper:maxupper=H.hi();which=j
 if H.hi()>=0:raise ArithmeticError((j,H.lo(),H.hi()))
print('max H upper:',maxupper,'cell',which)
