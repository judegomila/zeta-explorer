# Central values L(psi^k,(k+1)/2), psi = Hecke character of Q(i), psi((a)) = a for a = 1 mod (2+2i); also chi_8 twist.
import sys, json
from mpmath import mp, mpf, mpc, pi, gamma, gammainc, exp, sqrt, log, identify, nstr, factorial
mp.dps=80
M=900
d=[int(x) for x in json.load(open("dn_12.json"))]
# primary generators: a odd, b even, a+b = 1 mod 4
gens={}
R=int(M**0.5)+1
for a in range(-R,R+1):
    if a%2==0: continue
    for b in range(-R,R+1):
        if b%2: continue
        if (a+b)%4!=1: continue
        m=a*a+b*b
        if m<=M: gens.setdefault(m,[]).append((a,b))
def chi8(m): return {1:1,7:1,3:-1,5:-1}[m%8]
def coeffs(k,tw):
    out={}
    for m,l in gens.items():
        s=0
        for a,b in l:
            z=complex(a,b)
            # exact integer real part of (a+bi)^k
            re,im=1,0
            for _ in range(k): re,im=re*a-im*b,re*b+im*a
            s+=re
            assert True
        out[m]=s*(chi8(m) if tw else 1)
    return out
def central(k,tw,N):
    a=coeffs(k,tw); A=sqrt(mpf(N))/(2*pi); c=(k+1)//2
    # root number from theta test F(1/y) = w y^(k+1) F(y)
    F=lambda y: sum(v*exp(-m*y/A) for m,v in a.items())
    y=mpf('1.05'); w=F(1/y)/(y**(k+1)*F(y)) if abs(F(y))>0 else mpf(0)
    wr=int(round(float(w))) if abs(w-round(float(w)))<mpf(10)**-25 else None
    if wr is None: return None,w
    Lam=(1+wr)*sum(v*(A/m)**c*gammainc(c,m/A) for m,v in a.items())
    return Lam/(A**c*gamma(c)), wr
res={}
for tw,N in ((0,32),(1,64)):
    for k in range(1,86,4):
        L,w=central(k,tw,N)
        res[(tw,k)]=(L,w)
        print("tw",tw,"N",N,"k",k,"w",w if L is None else w,"L",nstr(L,30) if L is not None else None,flush=True)
Phi=gamma(mpf(1)/4)**8/(128*pi**4)
Om=gamma(mpf(1)/4)**2/(2*sqrt(2*pi))
out={}
for tw in (0,1):
    print("--- ratios, tw",tw)
    prev=None
    for n in range(0,11):
        k=8*n+1
        L,w=res[(tw,k)]
        if L is None or L==0: print(n,"L zero/none"); continue
        r=L*factorial(4*n)/(d[n]**2*Phi**(2*n))
        # r should be c0 * q^n
        out[(tw,n)]=r
        print(n, nstr(r,40), "ratio to prev", nstr(r/prev,40) if prev else "")
        prev=r
for tw in (0,1):
    if (tw,0) in out and (tw,1) in out:
        c0=out[(tw,0)]; q=out[(tw,1)]/c0
        print("tw",tw,"c0",nstr(c0,50),"c0/Om",nstr(c0/Om,50),"q",nstr(q,50),"q/pi^4",nstr(q/pi**4,40),"q/pi^2",nstr(q/pi**2,40))
        print(" max dev of r_n/(c0 q^n) from 1:", max(abs(out[(tw,n)]/(c0*q**n)-1) for n in range(11) if (tw,n) in out))
        print(" c0 id:",identify(c0/Om,['sqrt(2)']), " q id:", identify(q/pi**4), identify(q/pi**2), identify(q))
