"""160-bit directed MPFI bounds for two independent source constants.
No spectral zero input; no target pivot evaluated. Retains only a positive
first orbit for the I lower bound. Arithmetic tail is analytic and explicit.
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
# 4000 full interval rectangles cover [0,2]; each endpoint is an enclosed rational.
M=4000;step=I(2)/I(M);lower_integral=I(0)
for j in range(M):
    l=I(2*j)/I(M);r=I(2*(j+1))/I(M);u=l.op(r,'union')
    z=pi*(I(2)*u).unary('exp')
    f=I(4)*(u/I(2)-z).unary('exp')*(I(2)*z*z-I(3)*z)
    lower_integral=lower_integral+I(2)*u*u*f*f*step
assert lower_integral.lo()>0.03
# U is a uniform upper bound for the positive debit magnitude |D_t(a)|.
head=I(0);rows=[]
for j in range(2,8):
    Z=pi*I(j)
    poly=Z**2*(I(64)*Z**4-I(480)*Z**3+I(1264)*Z**2-I(672)*Z+I(432))
    B=I(2)*poly*(I(-2)*Z).unary('exp')
    ell=I(0)
    for k in range(1,j+1):
        if j%k==0:ell=ell+((I(k*k)/I(j)).unary('log'))**2
    term=pi*(I(1)+I(1)/I(j))*ell*B
    head=head+term;rows.append({'j':j,'lower':term.lo(),'upper':term.hi()})
tail=(I(4000)/I(9))*pi**7*I(8)**8*(I(-16)*pi).unary('exp')
U=head+tail
assert U.hi()<36
out={'status':'PASS','precision_bits':160,'cells':M,
     'first_orbit_lower_integral_enclosure':[lower_integral.lo(),lower_integral.hi()],
     'I_strict_lower':0.03,'arithmetic_head_terms':rows,
     'arithmetic_tail_upper':tail.hi(),'U_enclosure':[U.lo(),U.hi()],
     'D_absolute_strict_upper':36,
     'scope':'q=t only; 0<=a<=1/2; integrated Abel endpoint; source curvature v_prime>17 is an explicitly inherited analytic dependency, not checked here; no signed pivot evaluated'}
print(json.dumps(out,indent=2))
