# Independent MPFI interval replay, 160-bit directed intervals.
import ctypes as ct
import math

class MPFR(ct.Structure):
    _fields_=[('prec',ct.c_long),('sign',ct.c_int),('exp',ct.c_long),('d',ct.POINTER(ct.c_ulong))]
class MPFI(ct.Structure):
    _fields_=[('left',MPFR),('right',MPFR)]
mpfi=ct.CDLL('libmpfi.so.0'); mpfr=ct.CDLL('libmpfr.so.6')
P=ct.POINTER(MPFI)
mpfi.mpfi_init2.argtypes=[P,ct.c_long];mpfi.mpfi_clear.argtypes=[P]
mpfi.mpfi_set_str.argtypes=[P,ct.c_char_p,ct.c_int]
mpfi.mpfi_interv_d.argtypes=[P,ct.c_double,ct.c_double]
mpfi.mpfi_const_pi.argtypes=[P]
for fn in ['add','sub','mul','div']:
    getattr(mpfi,'mpfi_'+fn).argtypes=[P,P,P]
for fn in ['exp','log','sqrt','neg']:
    getattr(mpfi,'mpfi_'+fn).argtypes=[P,P]
mpfr.mpfr_get_d.argtypes=[ct.POINTER(MPFR),ct.c_int];mpfr.mpfr_get_d.restype=ct.c_double

class I:
    def __init__(self,s=None):
        self.x=MPFI();mpfi.mpfi_init2(ct.byref(self.x),160)
        if s is not None:
            if mpfi.mpfi_set_str(ct.byref(self.x),str(s).encode(),10)!=0:raise ValueError(s)
    def __del__(self):mpfi.mpfi_clear(ct.byref(self.x))
    def op(self,y,name):
        if not isinstance(y,I):y=I(y)
        z=I();getattr(mpfi,'mpfi_'+name)(ct.byref(z.x),ct.byref(self.x),ct.byref(y.x));return z
    def __add__(self,y):return self.op(y,'add')
    def __sub__(self,y):return self.op(y,'sub')
    def __mul__(self,y):return self.op(y,'mul')
    def __truediv__(self,y):return self.op(y,'div')
    def unary(self,name):
        z=I();getattr(mpfi,'mpfi_'+name)(ct.byref(z.x),ct.byref(self.x));return z
    def lo(self):return mpfr.mpfr_get_d(ct.byref(self.x.left),3)
    def hi(self):return mpfr.mpfr_get_d(ct.byref(self.x.right),2)

def interval(lo,hi):
    z=I();mpfi.mpfi_interv_d(ct.byref(z.x),lo,hi);return z
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x))
one=I(1);two=I(2);three=I(3);four=I(4)
L=two.unary('log');half=L/two
assert half.lo() > .3465 and half.hi() < .3466
step=I('0.0001'); R=I('1.0041'); tail=I('1e-100')

def first(x):
    z=pi*(two*x).unary('exp')
    return four*(x/two).unary('exp')*z*(two*z-three)*z.unary('neg').unary('exp')

U=I(0);C=I(0)
for j in range(20000):
    l=0.0 if j==0 else math.nextafter(j/10000,-math.inf)
    h=math.nextafter((j+1)/10000,math.inf)
    x=interval(l,h)
    fx=first(x);U=U+x*x*fx*fx*step
    if j<3465: off=half-x
    elif j>3465: off=x-half
    else: off=interval(0.0,0.0002)
    C=C+first(x+half)*first(off)*step
U=two*R*R*U+tail
C=two*C
D=(L*L/two.unary('sqrt'))*C
assert U.hi()<0.03176 and D.lo()>0.03276 and (D-U).lo()>0.001
print('MPFI energy upper:',repr(U.hi()))
print('MPFI first harmonic lower:',repr(D.lo()))
print('MPFI gap lower:',repr((D-U).lo()))
