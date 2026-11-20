# Combination 3, control without Euler product: S(x) = sum_{n<=x} Lambda_F(n)/n for F = Davenport-Heilbronn (and chi as code check).
import sys, numpy as np, math, json
f=sys.argv[1]; lim=float(sys.argv[2]); rows=np.array([[float(v) for v in l.split()] for l in open(f) if not l.startswith('#')])
x=rows[:,0]; D=rows[:,1]-lim; lx=np.log(x)
print(open(f).readline().strip()[:200])
print('max |Lambda_F(n)|/log n up to N: %.4g'%rows[-1,3])
for t in (1e2,1e3,1e4,1e5,1e6,1e7,1e8):
    if t<=x[-1]*1.001:
        i=np.argmin(np.abs(lx-math.log(t))); m=(x>=t/10)&(x<=t); print('x=%.3g  D=%.4e  D sqrt x=%.4f  sup_{[x/10,x]} |D| sqrt x = %.4f'%(x[i],D[i],D[i]*math.sqrt(x[i]),np.max(np.abs(D[m])*np.sqrt(x[m]))))
m=x>=1e3; bins=np.floor(lx[m]).astype(int); mx={}
for b_,v in zip(bins,np.abs(D[m])): mx[b_]=max(mx.get(b_,0),v)
k=np.array(sorted(mx)); e=np.polyfit(k+0.5,np.log([mx[i] for i in k]),1)[0]; print('envelope exponent of |D(x)| on [1e3,N]: %.3f'%e)
res={'exponent':float(e)}
if len(sys.argv)>3:
    # least-squares amplitudes of x^(rho-1) for the listed off-line zeros (pairs beta gamma), on x >= 1e4
    zs=[(float(sys.argv[i]),float(sys.argv[i+1])) for i in range(3,len(sys.argv)-1,2)]; m=x>=1e4
    cols=[]
    for be,ga in zs:
        cols+= [x[m]**(be-1)*np.cos(ga*lx[m]), x[m]**(be-1)*np.sin(ga*lx[m])]
        if be!=0.5: cols+=[x[m]**(-be)*np.cos(ga*lx[m]), x[m]**(-be)*np.sin(ga*lx[m])]
    A=np.vstack(cols).T; co=np.linalg.lstsq(A,D[m],rcond=None)[0]; fit=A@co
    print('variance of D on x>=1e4 explained by the listed zero terms: %.4f'%(1-np.var(D[m]-fit)/np.var(D[m])))
    j=0
    for be,ga in zs:
        amp=math.hypot(co[j],co[j+1]); pred=2/math.hypot(be-1,ga); print(' zero %.6f + %.6f i: fitted amplitude of x^(beta-1) term %.5f ; explicit formula 2/|rho-1| = %.5f'%(be,ga,amp,pred)); j+=4 if be!=0.5 else 2
    r=D[m]-fit; print(' residual: sup |r| sqrt x on [1e4,N] = %.4f ; on last decade %.4f'%(np.max(np.abs(r)*np.sqrt(x[m])),np.max((np.abs(r)*np.sqrt(x[m]))[x[m]>=x[-1]/10])))
