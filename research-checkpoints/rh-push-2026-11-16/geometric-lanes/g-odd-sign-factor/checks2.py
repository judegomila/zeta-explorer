from mpmath import mp, mpf, exp, sqrt, pi, quad, inf, log
import json
mp.dps=25
out={}
# ---- (1) DH kernel: positivity + convexity on fine grid, no underflow cutoff
kap=(sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1); c={1:mpf(1),2:kap,3:-kap,4:mpf(-1),0:mpf(0)}; a=pi/5
def kd(u,N=40):
    y=exp(u); s0=s1=s2=mpf(0)
    for n in range(1,N):
        cn=c[n%5]
        if cn==0: continue
        b=a*n*n*y; e=cn*n*exp(mpf(3)*u/4-b+a*y)   # factor exp(a y) removed (common positive factor)
        g1=mpf(3)/4-b
        s0+=e; s1+=e*g1; s2+=e*(g1*g1-b)
    return s0,s1,s2
mn=None; bad=0; mnk=None
grid=[mpf(j)/1000 for j in range(1,3001)]+[mpf(3)+mpf(j)/50 for j in range(1,600)]
for u in grid:
    k0,k1,k2=kd(u)
    if k0<=0: bad+=1; continue
    L1=-k1/k0; L2=-(k2/k0-(k1/k0)**2)
    Vpp=(u*L2-L1)/(4*u**3)
    if mn is None or Vpp<mn[1]: mn=(float(u),Vpp)
out['DH_grid_points']=len(grid); out['DH_kappa_nonpositive_count']=bad; out['DH_min_Vpp']=[mn[0],float(mn[1])]
k0,k1,k2=kd(mpf('0.001')); out['DH_Vpp_at_0.001']=float((mpf('0.001')*(-(k2/k0-(k1/k0)**2))+k1/k0)/(4*mpf('0.001')**3))
# ---- (2) xi kernel: V'' >0 (Csordas) => NOT completely monotone; show sign of second log-derivative
def kx(u,N=12):
    # kappa(u)=Phi(u/4), Phi(x)=sum (2 pi^2 n^4 e^{9x}-3 pi n^2 e^{5x}) exp(-pi n^2 e^{4x})
    if u>9: return mpf(0),mpf(0),mpf(0)
    y=exp(u); s0=s1=s2=mpf(0)
    for n in range(1,N):
        b=pi*n*n*y
        for (co,p) in ((2*pi**2*n**4,mpf(9)/4),(-3*pi*n*n,mpf(5)/4)):
            e=co*exp(p*u-b); g1=p-b
            s0+=e; s1+=e*g1; s2+=e*(g1*g1-b)
    return s0,s1,s2
mx=None
for j in range(1,400):
    u=mpf(j)/50; k0,k1,k2=kx(u); L1=-k1/k0; L2=-(k2/k0-(k1/k0)**2); Vpp=(u*L2-L1)/(4*u**3)
    if mx is None or Vpp<mx[1]: mx=(float(u),Vpp)
out['xi_min_Vpp_grid']=[mx[0],float(mx[1])]
# CM would need K K'' >= K'^2 (log-convex) for K(t)=kappa(sqrt t): equivalently V''<=0. Record violation size at t=1
print(out,flush=True)
out['xi_logconvexity_defect_t=1']=float(-((1*(-(kx(mpf(1))[2]/kx(mpf(1))[0]-(kx(mpf(1))[1]/kx(mpf(1))[0])**2))+kx(mpf(1))[1]/kx(mpf(1))[0])/4))
# ---- (3) Gaussian mixture k=e^{-u^2}+e^{-3u^2}: odd entries negative
k=lambda u: exp(-u*u)+exp(-3*u*u)
def H0(u,v,kk=k):
    m=(u+v)/2; d=(u-v)/2
    return 2*quad(lambda t: t*kk(t-d)*kk(t+d),[abs(m),abs(m)+1,abs(m)+2,abs(m)+4,abs(m)+9])
mm=[]
for x in (0.2,0.7,1.5):
    for y in (0.3,1.0,2.0):
        mm.append([x,y,float(H0(mpf(x),mpf(y))-H0(mpf(x),-mpf(y)))])
out['mixture_Hminus_entries']=mm
print(out['mixture_Hminus_entries'],flush=True)
# ---- (4) convexity-excess identity on xi kernel:  <a,H a> = -2 int_0^inf (kappa*a)(s) ((v rho kappa)*a)(s) ds, odd a
kxi=lambda u: kx(abs(u))[0]
def Lp(u):
    k0,k1,_=kx(u); return -k1/k0
eps=mpf(10)**-12
k0,k1,k2=kx(mpf(0)); w0=-(k2/k0)   # L''(0) = lim L'(u)/u
def rho(v):
    v=abs(v)
    if v>9: return mpf(0)
    if v<mpf(10)**-6: return mpf(0)
    return Lp(v)/(v*w0)-1
# odd test a = delta_x - delta_{-x} combos: use two nodes with coefficients -> kernel identity
def Hm(x,y): return H0(x,y,kxi)-H0(x,-y,kxi)
def rhs(x,y):
    # form with a = (delta_x - delta_-x), b=(delta_y-delta_-y), symmetrized bilinear; H(a,b)=2*Hm(x,y)
    A=lambda s,z: kxi(s-z)-kxi(s+z)
    Bf=lambda s,z: (s-z)*rho(s-z)*kxi(s-z)-(s+z)*rho(s+z)*kxi(s+z)
    return -quad(lambda s: A(s,x)*Bf(s,y)+A(s,y)*Bf(s,x),[0,0.5,1,2,4,8])
x,y=mpf('0.6'),mpf('1.3')
out['excess_identity_lhs_2Hminus']=str(2*Hm(x,y))[:22]; out['excess_identity_rhs']=str(rhs(x,y))[:22]
out['rho_samples']=[[v,float(rho(mpf(v)))] for v in (0.5,1,2,3)]
print(json.dumps(out,indent=1)); json.dump(out,open('checks2.json','w'),indent=1)
