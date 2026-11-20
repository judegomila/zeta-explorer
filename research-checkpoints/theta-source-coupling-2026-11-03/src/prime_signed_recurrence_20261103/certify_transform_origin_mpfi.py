"""160-bit directed MPFI lower bound for the complete-theta transform F(0).
No spectral zero input; no target pivot evaluated. Integrates only the
positive first orbit on [0,2]; all omitted orbits and tails are positive.
"""
import ctypes as ct, json
class MPFR(ct.Structure):
    _fields_=[('prec',ct.c_long),('sign',ct.c_int),('exp',ct.c_long),('d',ct.POINTER(ct.c_ulong))]
class MPFI(ct.Structure):
    _fields_=[('left',MPFR),('right',MPFR)]
mpfi=ct.CDLL('libmpfi.so.0');mpfr=ct.CDLL('libmpfr.so.6');P=ct.POINTER(MPFI)
mpfi.mpfi_init2.argtypes=[P,ct.c_long];mpfi.mpfi_clear.argtypes=[P]
mpfi.mpfi_set_str.argtypes=[P,ct.c_char_p,ct.c_int];mpfi.mpfi_set_str.restype=ct.c_int
mpfi.mpfi_const_pi.argtypes=[P]
for name in ['add','sub','mul','div','union']:getattr(mpfi,'mpfi_'+name).argtypes=[P,P,P]
for name in ['exp','log','neg']:getattr(mpfi,'mpfi_'+name).argtypes=[P,P]
mpfr.mpfr_get_d.argtypes=[ct.POINTER(MPFR),ct.c_int];mpfr.mpfr_get_d.restype=ct.c_double
class I:
    def __init__(self,x=None):
        self.x=MPFI();mpfi.mpfi_init2(ct.byref(self.x),160)
        if x is not None and mpfi.mpfi_set_str(ct.byref(self.x),str(x).encode(),10)!=0:raise ValueError(x)
    def __del__(self):mpfi.mpfi_clear(ct.byref(self.x))
    def op(self,y,name):
        y=y if isinstance(y,I) else I(y);z=I()
        getattr(mpfi,'mpfi_'+name)(ct.byref(z.x),ct.byref(self.x),ct.byref(y.x));return z
    def __add__(self,y):return self.op(y,'add')
    def __sub__(self,y):return self.op(y,'sub')
    def __mul__(self,y):return self.op(y,'mul')
    def __truediv__(self,y):return self.op(y,'div')
    def __pow__(self,n):
        assert isinstance(n,int) and n>=0
        z=I(1)
        for _ in range(n):z=z*self
        return z
    def unary(self,name):
        z=I();getattr(mpfi,'mpfi_'+name)(ct.byref(z.x),ct.byref(self.x));return z
    def lo(self):return mpfr.mpfr_get_d(ct.byref(self.x.left),3)
    def hi(self):return mpfr.mpfr_get_d(ct.byref(self.x.right),2)
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x))
M=8000;step=I(2)/I(M);integral=I(0)
for j in range(M):
 l=I(2*j)/I(M);r=I(2*(j+1))/I(M);u=l.op(r,'union')
 z=pi*(I(2)*u).unary('exp')
 f=I(4)*(u/I(2)-z).unary('exp')*(I(2)*z*z-I(3)*z)
 integral=integral+I(2)*f*step
assert integral.lo()>0.99
print(json.dumps({'status':'PASS','precision_bits':160,'cells':M,'doubled_first_orbit_integral':[integral.lo(),integral.hi()],'F0_strict_lower':0.99,'scope':'F(0)>=2 integral_0^2 f; higher positive orbits and tail omitted only in lower bound; no signed pivot'},indent=2))
