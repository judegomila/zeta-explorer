# Part (b) checks (MEASURED, mpmath 30 digits; not interval-certified). Small scalars only: no large allocation.
import json, os, itertools
from mpmath import mp, mpf, mpc, zeta, gamma, pi, sqrt, exp, cos, dirichlet, findroot, besselk, log, acosh, matrix, nstr
mp.dps=30
HERE=os.path.dirname(os.path.abspath(__file__)); R={}
q=5; CH5=[0,1,-1,-1,1]
# --- A. the cone K_F on functions on Z/5 and the F-fixed cone vectors v_b
def Fmat(v): return [sum(v[c]*cos(2*pi*c*d/q) for c in range(q))/sqrt(q) for d in range(q)]
def vb(b): return [1+sqrt(5), 1+b, 1-b, 1-b, 1+b]
R["A_F_fixed_defect"]={str(b): nstr(max(abs(x-y) for x,y in zip(Fmat(vb(b)),vb(b))),5) for b in (1,-1,mpf(1)/2,0)}
def theta_vec(x,N=60): return [sum(exp(-pi*n*n*x/q) for n in range(-N,N+1) if n%q==c) for c in range(q)]
dpo=0
for x in (mpf(1)/7, mpf(1)/2, 1, mpf(3)):
    a=theta_vec(x); bb=[y*sqrt(1/x) for y in Fmat(theta_vec(1/x))]
    dpo=max(dpo,max(abs(u-w) for u,w in zip(a,bb)))
R["A_poisson_Theta(x)=x^-1/2 F Theta(1/x)_defect"]=nstr(dpo,5)
# --- B. even DH-type control D_b(s) = zeta(s)(1+5^(1/2-s)) + b L(s,chi_5): FE and zeros with Re s > 1/2
def D(s,b): return zeta(s)*(1+mpf(5)**(mpf(1)/2-s)) + b*dirichlet(s,CH5)
def Lam(s,b): return (mpf(5)/pi)**(s/2)*gamma(s/2)*D(s,b)
s0=mpc('0.3','7.7'); R["B_FE_defect_rel"]={str(b): nstr(abs(Lam(s0,b)-Lam(1-s0,b))/abs(Lam(s0,b)),5) for b in (1,-1,mpf(1)/2)}
# coefficients: sum_{n<=N} v(n) n^-s against D at s = 3
R["B_series_defect_b=1"]=nstr(abs(sum(vb(1)[n%5]*mpf(n)**-3 for n in range(1,200001))-D(3,1)),5)
def scan(f, tlo, thi, sig=(0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95), dt=mpf('0.05')):
    mp.dps=15; found=[]
    import mpmath
    n=int((thi-tlo)/dt)
    for sg in sig:
        prev2=prev1=None
        for i in range(n+1):
            t=tlo+i*dt; a=abs(f(mpc(sg,t)))
            if prev2 is not None and prev1[1]<prev2[1] and prev1[1]<a and prev1[1]<0.25:
                found.append((sg,prev1[0]))
            prev2,prev1=prev1,(t,a)
    mp.dps=30; zs=[]
    for sg,t in found:
        try:
            z=findroot(f, mpc(sg,t), tol=1e-25, maxsteps=60)
        except Exception: continue
        if abs(f(z))<1e-22 and mpf('0.5')+mpf('1e-6')<z.real<1 and tlo-1<z.imag<thi+1 and all(abs(z-w)>1e-8 for w in zs): zs.append(z)
    return sorted(zs,key=lambda z:z.imag)
for b in (1,-1):
    zs=scan(lambda s: D(s,b), 1, 120)
    R["B_zeros_Re>1/2_b=%s_t<=120"%b]=[[nstr(z.real,14),nstr(z.imag,14),nstr(abs(D(z,b)),3)] for z in zs]
    print(b,R["B_zeros_Re>1/2_b=%s_t<=120"%b],flush=True)
# --- C. Hurwitz entry Z_1(s) = 5^-s zeta(s,1/5): zeros in 1/2 < Re s < 1 (c11 form (H))
Z1=lambda s: mpf(5)**(-s)*zeta(s,mpf(1)/5)
zs=scan(Z1, 1, 120)
R["C_Z1_zeros_Re>1/2_t<=120"]=[[nstr(z.real,14),nstr(z.imag,14),nstr(abs(Z1(z)),3)] for z in zs]; print(R["C_Z1_zeros_Re>1/2_t<=120"],flush=True)
# --- D. T-NR lift kernel vector at q = 5, p0 = 2, c = 3: non-negative, and same Poisson matrix F
p0=2; c=3
def Rdil(n,v):  # (R(n)v)(a) = v(n^-1 a)
    ninv=pow(n,-1,q); return [v[(ninv*a)%q] for a in range(q)]
def thNR(x):
    A=theta_vec(x/p0**2); B=theta_vec(x); C=theta_vec(x*p0**2)
    A=Rdil(pow(p0,-1,q),A); C=Rdil(p0,C)
    return [A[i]/sqrt(p0)+c*B[i]+sqrt(p0)*C[i] for i in range(q)]
dn=0; mn=mpf(10)
for x in (mpf(1)/7, mpf(1)/2, 1, mpf(3)):
    a=thNR(x); bb=[y*sqrt(1/x) for y in Fmat(thNR(1/x))]
    dn=max(dn,max(abs(u-w) for u,w in zip(a,bb))); mn=min(mn,min(a))
R["D_TNR_lift_poisson_defect"]=nstr(dn,5); R["D_TNR_lift_min_entry"]=nstr(mn,8)
R["D_TNR_zero_abscissa_c=3,p0=2"]=nstr(mpf(1)/2+acosh(mpf(c)/2)/log(p0),10)
# --- E. E_a, a = 0.2: theta-normalised full kernel E*(iy, 1/2+a) at y = 1 (constant terms + Bessel sum) is negative
a=mpf('0.2'); s=mpf(1)/2+a
xi=lambda w: pi**(-w/2)*gamma(w/2)*zeta(w)
sig=lambda n: sum(mpf(d)**(2*a) for d in range(1,n+1) if n%d==0)
def Estar(y): return xi(1+2*a)*y**s + xi(2*a)*y**(1-s) + 4*sqrt(y)*sum(mpf(n)**(-a)*sig(n)*besselk(a,2*pi*n*y) for n in range(1,40))
closed=2*pi**(-s)*gamma(s)*zeta(s)*dirichlet(s,[0,1,0,-1])
R["E_Estar(i,0.7)_fourier"]=nstr(Estar(1),15); R["E_Estar(i,0.7)_closed_2pi^-sGamma(s)zeta(s)L(s,chi_-4)"]=nstr(closed,15)
R["E_Estar_values_y"]={str(y): nstr(Estar(mpf(y)),8) for y in ("0.25","0.5","1","2","4","8")}
R["E_nonconstant_part_y=1"]=nstr(Estar(1)-xi(1+2*a)-xi(2*a),8)
# --- F. extreme rays of K_F at q = 5 on even functions (coordinates: values at 0, +-1, +-2)
import mpmath
c1=cos(2*pi/5); c2=cos(4*pi/5)
Fe=matrix([[1,2,2],[1,2*c1,2*c2],[1,2*c2,2*c1]])/sqrt(5)
R["F_Feven_squared_minus_I"]=nstr(mpmath.norm(Fe*Fe-mpmath.eye(3),'inf'),5)
facets=[matrix([[1,0,0]]),matrix([[0,1,0]]),matrix([[0,0,1]])]+[Fe[i,:] for i in range(3)]
rays=[]
for i,j in itertools.combinations(range(6),2):
    u=facets[i]; w=facets[j]
    r=matrix([u[1]*w[2]-u[2]*w[1], u[2]*w[0]-u[0]*w[2], u[0]*w[1]-u[1]*w[0]])
    if mpmath.norm(r)<1e-20: continue
    for sgn in (1,-1):
        rr=sgn*r; vals=[(f*rr)[0] for f in facets]
        if all(x>-1e-20 for x in vals):
            rr=rr/mpmath.norm(rr,1)
            if all(mpmath.norm(rr-o,'inf')>1e-12 for o in rays): rays.append(rr)
R["F_KF_extreme_rays_q5(values at 0,+-1,+-2; l1-normalised)"]=[[nstr(x,8) for x in r] for r in rays]
json.dump(R,open(os.path.join(HERE,"wcone_checks.json"),"w"),indent=1)
for k,v in R.items(): print(k,":",v)
