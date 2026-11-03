exec(open('/workspace/shared/modular_bl_recovery_20261103/check_midpoint_mpfi.py').read().split('pi=I()')[0])
mpfi.mpfi_sqrt.argtypes=[P,P]
def sqrt(x):return x.unary('sqrt')
def powi(x,n):
 r=I(1)
 for _ in range(n):r=r*x
 return r
pi=I();mpfi.mpfi_const_pi(ct.byref(pi.x));ep=I(3).unary('exp');e6=ep*ep
m=[]
for n in range(5):
 fact=1
 for j in range(1,2*n,2):fact*=j
 gamma=sqrt(pi)*I(fact)/I(2**n)
 p2=powi(I(2),n)*sqrt(I(2));p8=powi(I(8),n)*sqrt(I(8));p5=powi(I(5),n)*sqrt(I(5))
 m.append(gamma*(I(4)/p2+I(16)*e6/p8+ep*(I(20)/p5-I(72)*I(2*n+1)/(I(10)*p5))))
for j,x in enumerate(m): print('m',j,x.lo(),x.hi())
even=m[0]*m[2]-m[1]*m[1];odd=m[1]*m[3]-m[2]*m[2]
v0=m[2];v1=m[3];pivot=m[4]-(m[2]*v0*v0-I(2)*m[1]*v0*v1+m[0]*v1*v1)/even
print('even det',even.lo(),even.hi(),'odd det',odd.lo(),odd.hi(),'pivot',pivot.lo(),pivot.hi())
assert m[0].lo()>0 and m[1].lo()>0 and even.lo()>0 and odd.lo()>0 and pivot.hi()<0
