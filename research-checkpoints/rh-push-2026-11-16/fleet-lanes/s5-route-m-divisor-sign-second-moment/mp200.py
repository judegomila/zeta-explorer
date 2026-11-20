# 210-digit evaluation of T(b) and E1(b)/b from the divisor sums, squarefree b with prime factors < 200 (combination 1).
#  T(b) = sum_{e|b,e>=2} mu(e) J(e-1), J(n) = log n! - (n+1/2) log n + n - (1/2) log 2 pi   (mpmath loggamma)
#  E1(b)/b = sum_{e|b} mu(b/e) g(e)/e, g(e) = lnA + (1/12) log e + r(e); r(e) exact for e < 100, Bernoulli series otherwise
import random, json, sys, itertools
from mpmath import mp, mpf, log, loggamma, pi, glaisher, bernoulli, nstr
mp.dps=210
lnA=log(glaisher); half_l2pi=log(2*pi)/2
PR=[p for p in range(2,200) if all(p%d for d in range(2,int(p**.5)+1))]
def J(n): n=mpf(n); return loggamma(n+1)-((n+mpf(1)/2)*log(n)-n+half_l2pi)
Gt=[mpf(0)]
for k in range(1,100): Gt.append(Gt[-1]+k*log(k))
BK=[-bernoulli(2*k+2)/(2*k*(2*k+1)*(2*k+2)) for k in range(1,140)]
def r(m):
    if m<100: m_=mpf(m); return Gt[m]-((m_*m_/2+m_/2+mpf(1)/12)*log(m_)-m_*m_/4+lnA)
    x=1/mpf(m)**2; s=mpf(0); t=x
    for c in BK:
        term=c*t; s+=term; t*=x
        if abs(term)<mpf(10)**-215: break
    return s
def evalb(primes):
    T=mpf(0); S=mpf(0)   # S = sum_{e>1} mu(e) g(e)/e ; mu(b)E1/b = 1/4 + S
    for msk in range(1,1<<len(primes)):
        e=1; mu=1
        for j,p in enumerate(primes):
            if msk>>j&1: e*=p; mu=-mu
        T+=mu*J(e-1); S+=mu*(lnA+log(e)/12+r(e))/e
    return T, 4*(mpf(1)/4+S)
def flt(primes):
    P=1.0; L=0.0
    import math
    for p in primes: P*=1-1/p; L+=math.log(p)/(p-1)
    return P,L
random.seed(5); res=[]; nper=int(sys.argv[1]) if len(sys.argv)>1 else 60
sets=[]
for w in range(5,13):
    sets.append(PR[:w]); sets.append(PR[-w:])
    for _ in range(nper): sets.append(sorted(random.sample(PR,w)))
worstT=None; mnx=None; mxx=None; maxdev=0
for s in sets:
    T,x=evalb(s); P,L=flt(s); U=float(-12*T/(1-P)); xf=4*(P*(float(lnA)-L/12)); dev=float(x)-xf
    res.append({'omega':len(s),'primes':s,'T':nstr(T,30),'x':nstr(x,30),'U':U,'rho4':dev})
    assert T<0 and -1<=x<=1 and U>1 and 0<dev<=4*(0.25-float(lnA))+1e-12, s
    worstT=U if worstT is None else min(worstT,U); mnx=float(x) if mnx is None else min(mnx,float(x)); mxx=float(x) if mxx is None else max(mxx,float(x)); maxdev=max(maxdev,dev)
print('sets',len(sets),'all T<0, all -1<=x<=1; min U = -12T/(1-P) =',worstT,'; x range',mnx,mxx,'; 4 rho in (0,',maxdev,']')
json.dump(res,open('mp200.json','w'))
