exec(open('/workspace/shared/modular_bl_recovery_20261103/check_midpoint_mpfi.py').read().split('pi=I()')[0])
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x));two=I(2);four=I(4);p0=I(0);q0=I(0)
for n in (1,2,3,4):
 z=pi*I(n*n);b=four*z.unary('neg').unary('exp');p0=p0+b*(two*z*z-I(3)*z);q0=q0+b*(I(8)*z*z*z*z-I(56)*z*z*z+I('82.5')*z*z-I('18.75')*z)
eps=inter(-1.0000000000000001e-15,1.0000000000000001e-15);c=(q0+eps).unary('neg')/(p0+eps);print('c',c.lo(),c.hi(),flush=True)
N=50000;step=I('0.00004');err=inter(-.00000000001000000001,.00000000001000000001);A=I(0);B=I(0);C=I(0)
for j in range(N):
 lo=0 if j==0 else math.nextafter(j/25000,-math.inf);hi=math.nextafter((j+1)/25000,math.inf);x=inter(lo,hi);p=I(0);d=I(0);dd=I(0)
 for n in (1,2,3):
  z=pi*I(n*n)*(two*x).unary('exp');b=four*(x/two-z).unary('exp');p=p+b*(two*z*z-I(3)*z);d=d+b*(I(-4)*z*z*z+I(15)*z*z-I('7.5')*z);dd=dd+b*(I(8)*z*z*z*z-I(56)*z*z*z+I('82.5')*z*z-I('18.75')*z)
 p=p+err;d=d+err;dd=dd+err;x0=(I(-2)/c)*dd-p;e=(I(2)/c)*(dd+c*p+c*x*d)
 A=A+x0*x0*step;B=B+e*e*step;C=C+(two*x0*e+e*e)*step
print('A',A.lo(),A.hi(),'B',B.lo(),B.hi(),'C',C.lo(),C.hi(),flush=True)
assert B.lo()>A.hi()/256+1e-12

assert C.hi() < -0.04
