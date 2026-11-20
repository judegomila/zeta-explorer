import math, cmath, time, sys
sys.argv=['x']
import importlib.util
from flint import acb, arb, ctx, dirichlet_char
print("== item 2 supplement: bounded heights, r=2 datum (1,-1),(0,0), m = 2H+1")
# claim (referee): for 0<|t|<=20, H=p^ceil(k/2)>=2, m=2H+1: x=H/m in [0.4,0.5), |D|=-log(1-x^2) in [0.174,0.288],
# |tD| <= 5.76 < 2pi-0.52, so |e^{-itD}-1| >= 2 sin(min(0.174|t|,0.52)/2); eps >= that/4 ; needs N >= 3H+1.
ctx.prec=100
lo=-(1-arb('0.4')**2).log(); hi=-(1-arb('0.5')**2).log()
print("   -log(1-x^2) at 0.4, 0.5:",lo.str(6),hi.str(6)," 20*hi =",(20*hi).str(6)," 2pi-0.52 =",(2*arb.pi()-arb('0.52')).str(6))
def chars(p,k):
    q=p**k; phi=q-q//p
    def pf(n):
        o=set();d=2
        while d*d<=n:
            while n%d==0:o.add(d);n//=d
            d+=1
        if n>1:o.add(n)
        return o
    g=next(g for g in range(2,q) if g%p and all(pow(g,phi//l,q)!=1 for l in pf(phi)))
    idx={};x=1
    for e in range(phi): idx[x]=e;x=x*g%q
    return phi,idx
def best(angles):
    ang=sorted(a%(2*math.pi) for a in angles)
    gaps=[ang[i+1]-ang[i] for i in range(len(ang)-1)]+[ang[0]+2*math.pi-ang[-1]]
    return 2*math.sin((2*math.pi-max(gaps))/4)
for (p,k,t) in ((3,4,14.134725),(7,2,3.0),(5,3,0.5),(3,6,0.1),(11,2,19.9)):
    q=p**k;H=p**(-(-k//2));N=3*H+1
    phi,idx=chars(p,k)
    ns=[n for n in range(1,N+1) if n%p]
    mn=min(best([2*math.pi*a*idx[n%q]/phi+t*math.log(n) for n in ns]) for a in range(phi))
    bound=2*math.sin(min(0.174*abs(t),0.52)/2)/4
    print(f"   p={p} k={k} q={q} t={t} N=3H+1={N}: min over all chi, c of max error = {mn:.4f} ; referee bound {bound:.4f} ; holds={mn>=bound}")
print("== item 1 supplement: Dirichlet series of D, direct partial sum with tail bound")
q=5;c=2.3;s=3.0
K=200000
a=lambda k: 1+c*math.sqrt(q)*(k%q==0)+q*(k%(q*q)==0)
ps=math.fsum(a(k)*k**-s for k in range(1,K+1))
import mpmath as mp
target=float(mp.zeta(s)*(1+c*math.sqrt(q)*q**-s+q*q**(-2*s)))
print(f"   partial sum to {K}: {ps:.12f} ; zeta(3)(1+c sqrt q q^-3 + q q^-6) = {target:.12f} ; diff {target-ps:.2e} ; tail bound {(1+c*math.sqrt(q)+q)/(2*K**2):.2e}")
print("== item 5 supplement: reproduction of the lane's measured illustration to T=1000 (s=0.75+it, step 0.2)")
ctx.prec=53
chs=[dirichlet_char(5,n) for n in (2,3,4)]
pats=set(); rmin=(9e9,0); rmax=(0,0); n=0
t=10.0
t0=time.time()
while t<=1000.0+1e-9:
    s=acb(0.75,t)
    v=[s.zeta()]+[c.l(s) for c in chs]
    cv=[complex(x) for x in v]
    pats.add(tuple((z.real>0,z.imag>0) for z in cv))
    r=abs(cv[3])/abs(cv[0])
    if r<rmin[0]: rmin=(r,t)
    if r>rmax[0]: rmax=(r,t)
    n+=1; t=round(t+0.2,6)
print(f"   samples {n}; sign patterns of (Re,Im) of (zeta, L(chi_5(2,.)), L(chi_5(3,.)), L(chi_5(4,.))): {len(pats)} of 256; |L(real chi)|/|zeta| min {rmin[0]:.4f} at t={rmin[1]}, max {rmax[0]:.2f} at t={rmax[1]}; {time.time()-t0:.0f}s")
# class-F example at accessible heights: Re zeta'/zeta(0.75+it) lower values (fixed-constant inequality Re zeta'/zeta >= -C)
mp.mp.dps=15
