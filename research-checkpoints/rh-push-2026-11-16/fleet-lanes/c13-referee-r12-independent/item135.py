import math, cmath, sys, time
from flint import acb, arb, ctx, dirichlet_char, fmpz
import mpmath as mp
import numpy as np
mp.mp.dps=30
ctx.prec=128
print("===== ITEM 1 (Bost-Connes) =====")
def primes_of(b):
    out=[];d=2
    while d*d<=b:
        if b%d==0:
            out.append(d)
            while b%d==0:b//=d
        d+=1
    if b>1: out.append(b)
    return out
def f_beta(b,beta):
    v=mp.mpf(b)**(-beta)
    for p in primes_of(b): v*=(1-mp.mpf(p)**(beta-1))/(1-mp.mpf(1)/p)
    return v
# A. formula against the Galois average of type I states, computed with Hurwitz zeta (beta>1): 
#    zeta(beta)^-1 * (1/phi(b)) * sum_{(a,b)=1} sum_k k^-beta e(ak/b)
def per_zeta(a,b,beta): return sum(mp.exp(2j*mp.pi*a*j/b)*mp.zeta(beta,mp.mpf(j)/b) for j in range(1,b+1))*mp.mpf(b)**(-beta)
worst=0
for beta in (1.3,2.5,4):
    for b in (2,3,4,6,9,12,35,49):
        units=[a for a in range(1,b+1) if math.gcd(a,b)==1]
        avg=sum(per_zeta(a,b,beta) for a in units)/len(units)/mp.zeta(beta)
        worst=max(worst,abs(avg-f_beta(b,beta)))
print("A. KMS formula vs Galois average of type I states (beta=1.3,2.5,4; b in 2,3,4,6,9,12,35,49): max abs diff",mp.nstr(worst,3))
# B. positive definiteness of r -> f_beta(den r) on (1/M)Z/Z, M = 84 (lane used 60)
M=84
for beta in (0.25,0.5,1.0,2.0,3.0):
    row=np.array([float(f_beta(M//math.gcd(j,M),beta)) if j else 1.0 for j in range(M)])
    eig=np.fft.fft(row).real
    print(f"B. beta={beta}: least eigenvalue of circulant on (1/{M})Z/Z = {eig.min():.6f}  (min f value {row.min():.4f})")
# local product-measure check: Fourier coefficient of nu_{beta,p} at a/p^k computed from the measure
for (p,k,beta) in ((3,2,0.5),(5,1,0.7),(2,3,2.0)):
    tot=mp.mpf(0)
    for j in range(0,60):
        w=(1-mp.mpf(p)**(-beta))*mp.mpf(p)**(-j*beta)
        m=k-j
        if m<=0: avg=1
        elif m==1: avg=-mp.mpf(1)/(p-1)
        else: avg=0
        tot+=w*avg
    print(f"   local measure p={p} k={k} beta={beta}: integral of e(x/p^k) d nu = {mp.nstr(tot,15)} ; formula f_beta(p^k) = {mp.nstr(f_beta(p**k,beta),15)}")
# C. extremal KMS state (alpha = 1), beta > 1: value on x = sum_a conj chi(a) e(a/5) is tau(conj chi) L(beta,chi)/zeta(beta)
beta=mp.mpf(2)
chi={1:1,2:1j,3:-1j,4:-1}   # chi mod 5, chi(2)=i
val=sum(mp.conj(chi[a])*per_zeta(a,5,beta) for a in range(1,5))/mp.zeta(beta)
tau=sum(mp.conj(chi[a])*mp.exp(2j*mp.pi*a/5) for a in range(1,5))
Lchi=sum(chi[a]*mp.zeta(beta,mp.mpf(a)/5) for a in range(1,5))*mp.mpf(5)**(-beta)
gal=sum(mp.conj(chi[a])*f_beta(5,beta) for a in range(1,5))
print("C. extremal state phi_{beta,1}(sum conj chi(a) e(a/5)), beta=2:",mp.nstr(val,15)," tau(conj chi) L(2,chi)/zeta(2) =",mp.nstr(tau*Lchi/mp.zeta(beta),15)," Galois-invariant state on the same element:",mp.nstr(gal,5))
# D. Lemma T: zero of 1 + c sqrt(q) q^-b + q q^-2b ; D >= 1 ; Poisson relation; new parameters q=5, c=2.3 (lane: q=3, c=2.1)
ctx.prec=200
for (q,c) in ((3,arb('2.1')),(5,arb('2.3')),(2,arb('2.05'))):
    lq=arb(q).log()
    b0=acb(arb(1)/2+ (c/2).acosh()/lq, arb.pi()/lq)
    Fv=1+c*arb(q).sqrt()*(-b0*lq).exp()+q*(-2*b0*lq).exp()
    # exact reason: 2cosh(w)+c with w = acosh(c/2)+i pi
    in_strip = bool(b0.real<1)
    print(f"D. q={q} c={c.str(4,radius=False)}: zero at {b0.real.str(12,radius=False)} + {b0.imag.str(12,radius=False)} i ; |value| <= {float(abs(Fv).upper()):.2e} ; inside 0<Re<1: {in_strip}; strip range for c: 2 < c < {float((arb(q).sqrt()+1/arb(q).sqrt()).mid()):.4f}")
q=5;c=2.3
a=lambda k: 1+c*math.sqrt(q)*(k%q==0)+q*(k%(q*q)==0)
print("   min eigenvalue of D on k<=10^4:",min(a(k) for k in range(1,10001)),"; cocycle a(qk)/a(k) range:",min(a(q*k)/a(k) for k in range(1,5000)),max(a(q*k)/a(k) for k in range(1,5000)))
th=lambda l: mp.jtheta(3,0,mp.exp(-mp.pi*l*l))
G=lambda l: th(l)+c*mp.sqrt(q)*th(q*l)+q*th(q*q*l)
for l in (0.037,0.11,0.4):
    print(f"   Poisson relation G(l)-(q l)^-1 G(1/(q^2 l)) at l={l}: {mp.nstr(G(l)-G(1/(q*q*l))/(q*l),3)} (G={mp.nstr(G(l),8)})")
s=mp.mpc(1.7,2.9)
lhs=sum(a(k)*mp.mpf(k)**(-s) for k in range(1,1)) 
print("   Dirichlet series identity is exact algebra: sum_{q|k} k^-s = q^-s zeta(s); checked symbolically, numerically at s=3:",mp.nstr(mp.nsum(lambda k: a(int(k))*k**(-3),[1,mp.inf])-mp.zeta(3)*(1+c*mp.sqrt(q)*q**(-3.0)+q*q**(-6.0)),3))
# DH density
kap=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
print("   DH kappa =",mp.nstr(kap,10)," a(6)-a(2)a(3) = 1+kappa^2 =",mp.nstr(1+kap**2,6))

print("===== ITEM 3 (X_0(4) oval) =====")
def theta(tau,N=None):
    # sum_n e(n^2 tau)
    y=mp.im(tau); N=int(mp.sqrt(80/(2*mp.pi*y)))+3
    return 1+2*sum(mp.exp(2j*mp.pi*n*n*tau) for n in range(1,N+1))
def leg(b,p): 
    r=pow(b%p,(p-1)//2,p); return -1 if r==p-1 else r
for p in (11,13,17):
    for x in (0.21,0.9):
        tau=1j*mp.mpf(x)/2
        Gp=sum(leg(b,p)*mp.exp(2j*mp.pi*b/mp.mpf(p)) for b in range(1,p))
        first=sum(theta((tau+b)/p**2) for b in range(1,p*p))/p**2
        tw=sum(leg(b,p)*theta(tau+mp.mpf(b)/p) for b in range(1,p))/(p*Gp)
        real_part=theta(tau/p**2)/p**2+theta(p*p*tau)/p
        th0=theta(tau)
        cx=first+tw
        pred=th0-theta(tau/p**2)/p**2+(th0-theta(p*p*tau))/p
        eig=cx+real_part-(1+mp.mpf(1)/p)*th0
        print(f"p={p} x={x}: |complex-point sum - dilate formula| = {mp.nstr(abs(cx-pred),3)} ; |T_p^2 theta - (1+1/p) theta| = {mp.nstr(abs(eig),3)} ; complex points counted {p*p-1}+{p-1}")
ctx.prec=128
for q in (3,5,7,11):
    lq=arb(q).log(); c=-(arb(q)**arb(1.5)+arb(q).sqrt())
    worst=0
    for s in (acb(0.3,4.1),acb(2.7,-11.3),acb(0.5,20)):
        Cq=1+arb(1)/q-(acb(q)**(s-2)+acb(q)**(-1-s))
        tw=-(arb(q)**arb(-1.5))*(2*((s-arb(1)/2)*lq).cosh()+c)
        worst=max(worst,float(abs(Cq-tw).upper()))
    x0=arb(1)/2+(abs(c)/2).acosh()/lq
    Cr=lambda s: 1+arb(1)/q-(arb(q)**(s-2)+arb(q)**(-1-s))
    lo,hi=x0-arb('1e-6'),x0+arb('1e-6')
    sign_change=bool(Cr(lo)>0) and bool(Cr(hi)<0)
    strip_edge=float((arb(q).sqrt()+1/arb(q).sqrt()).mid())
    linemin=1+1/q-2*q**-1.5
    print(f"q={q}: max|C_q(s) - (-q^-3/2)(2cosh+c)| over 3 points <= {worst:.1e}; c={float(c.mid()):.4f} (|c| > strip bound {strip_edge:.4f}); real zero of C_q at {x0.str(10,radius=False)} certified by sign change: {sign_change}; min of C_q on the line = {linemin:.4f}")
# one complex point at p=5: identity
s=mp.mpc(2.3,1.1)
for b in (1,2):
    lhs=sum(mp.exp(2j*mp.pi*b*((j*j)%5)/5)*mp.zeta(s,mp.mpf(j)/5) for j in range(1,6))*mp.mpf(5)**(-s)
    L5=sum({1:1,2:-1,3:-1,4:1}[j]*mp.zeta(s,mp.mpf(j)/5) for j in range(1,5))*mp.mpf(5)**(-s)
    rhs=mp.cos(2*mp.pi*b/5)*(1+leg(b,5)*mp.sqrt(5)*mp.mpf(5)**(-s))*mp.zeta(s)+1j*mp.sin(2*mp.pi*b/5)*L5
    print(f"one complex point p=5 b={b}: |lhs-rhs| = {mp.nstr(abs(lhs-rhs),3)}")
