# DH control for the odd-sector inputs: positivity of kappa_DH, convexity of V_DH, Laguerre/diagonal witness.
from mpmath import mp, mpf, mpc, exp, log, sqrt, pi, gamma, zeta, diff, findroot, quad, cos, inf
import json
mp.dps = 40
kap = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
c = {1:mpf(1),2:kap,3:-kap,4:mpf(-1),0:mpf(0)}
a = pi/5
def kd(u, der=0, N=60):
    # kappa_DH(u)=sqrt(pi/5) sum c(n) n exp(3u/4 - a n^2 e^u); derivatives in u computed exactly termwise
    y = exp(u); s0=s1=s2=mpf(0)
    for n in range(1,N):
        cn=c[n%5]
        if cn==0: continue
        b=a*n*n*y
        if b>mp.dps*3+50: break
        e=cn*n*exp(mpf(3)*u/4-b)
        g1=mpf(3)/4-b            # d/du of exponent
        s0+=e; s1+=e*g1; s2+=e*(g1*g1-b)
    r=sqrt(a)
    return r*s0, r*s1, r*s2
out={}
# evenness check (functional equation)
ev=max(abs(kd(mpf(u))[0]-kd(-mpf(u),N=4000)[0])/kd(mpf(u))[0] for u in [0.3,1,2])
out['evenness_rel_err']=float(ev)
# positivity and convexity of V(t)=-log kappa(sqrt t):  V''>=0 <=> W(u):= u L'' - L' >=0, L=-log kappa
minW=None; neg=[]; minK=None
us=[mpf(j)/200 for j in range(1,1400)]
for u in us:
    k0,k1,k2=kd(u)
    if k0<=0: neg.append(float(u)); continue
    L1=-k1/k0; L2=-(k2/k0-(k1/k0)**2)
    W=u*L2-L1
    Vpp=W/(4*u**3)
    if minW is None or Vpp<minW[1]: minW=(float(u),Vpp)
    if minK is None or k0<minK[1]: minK=(float(u),k0)
out['kappa_DH_nonpositive_points']=neg[:10]
out['min_Vpp_DH']=[minW[0],float(minW[1])]
out['Lprime_sign_check_u=1']=float(-kd(mpf(1))[1]/kd(mpf(1))[0])
print(out)
# spectral: f(t)=Lambda_DH(1/2+it)
def Ldh(s):
    from mpmath import hurwitz
    chi={1:1,2:1j,3:-1j,4:-1}
    L=sum(chi[r]*hurwitz(s,mpf(r)/5) for r in range(1,5))*mpf(5)**(-s)
    Lb=sum(chi[r].conjugate()*hurwitz(s,mpf(r)/5) for r in range(1,5))*mpf(5)**(-s)
    return ((1-1j*kap)*L+(1+1j*kap)*Lb)/2
def Lam(s): return (5/pi)**(s/2)*gamma((s+1)/2)*Ldh(s)
def f(t): return Lam(mpf(1)/2+1j*t)
# check: imaginary part ~0, and integral representation
t0=mpf(10)
v=f(t0); vi=quad(lambda u: 2*kd(u)[0]*cos(t0*u/2),[0,2,4,6,8])
out['f(10)']=[str(v.real)[:25],float(abs(v.imag)/abs(v.real))]; out['integral_f(10)']=str(vi)[:25]
print(out['f(10)'],out['integral_f(10)'])
# off-line zero
z=findroot(lambda s: Ldh(s), mpc(0.8085,85.699))
out['offline_zero']=[str(z.real)[:20],str(z.imag)[:20]]
print(z)
# diagonal of odd spectral kernel: D(t)=f'^2 - f f'' + f f'/t   (C_-(t,t)=alpha/pi * D)
def D(t):
    F=lambda x: f(x).real
    f0=F(t); f1=diff(F,t,1,h=mpf(10)**-8); f2=diff(F,t,2,h=mpf(10)**-8)
    return f1*f1-f0*f2+f0*f1/t, f0, f1
rows=[]
for j in range(0,41):
    t=mpf(84.7)+mpf(j)/20
    d,f0,f1=D(t)
    scale=f0*f0+f1*f1
    rows.append([float(t),float(d/scale),float(mp.log10(abs(f0)+mpf(10)**-200))])
out['diag_scan']=rows
mn=min(rows,key=lambda r:r[1]); print('min normalized diag',mn)
json.dump(out,open('dh_control.json','w'),indent=1,default=str)
