import time
from flint import arb, acb, ctx
ctx.prec=256
pi=arb.pi(); t=arb(4)/15;x=arb(210)
def f(u,analytic,m):
 e4=(4*u).exp(); e5=(5*u).exp(); e9=(9*u).exp()
 p=sum((2*pi*pi*n**4*e9-3*pi*n*n*e5)*(-pi*n*n*e4).exp() for n in range(1,8))
 osc=(x*u).cos() if m%2==0 else (x*u).sin()
 return (-1)**((m+1)//2)*u**m*(t*u*u).exp()*p*osc
for m in [0,1,2,20,100,176]:
 st=time.time(); v=acb.integral(lambda u,a:f(u,a,m),0,1,abs_tol=arb('1e-65'),rel_tol=arb('1e-35'),eval_limit=100000,depth_limit=30)
 print(m,v,'seconds',time.time()-st,flush=True)
