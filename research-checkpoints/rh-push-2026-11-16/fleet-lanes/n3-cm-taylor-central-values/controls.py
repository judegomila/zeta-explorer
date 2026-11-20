# Controls: (A) theta_4 at i vs L((psi chi_8)^(4m+1)) [ramified twist; T-NR q=2];  (B) DH: theta_chi mod 5 (weight 3/2) at the fixed point
import json, cmath
from mpmath import mp, mpf, mpc, pi, gamma, gammainc, exp, sqrt, nstr, factorial, binomial, arg, conj
mp.dps=70
K=26
def lag(b):
    q=[mpf(1)]
    for k in range(K):
        v=(b-2*k)*q[k]
        if k>=1: v-=(k-1)*q[k-1]
        q.append(v/(k+1))
    return q
def series(weights, scale, wt):
    # sum_n w(n) exp(-pi n^2 x*scale), x=(1-z)/(1+z), times (1+z)^(-wt)
    tot=[mpc(0)]*(K+1)
    for n,w in weights:
        a=pi*n*n*scale
        if n==0: tot[0]+=w; continue
        q=lag(2*a); e=exp(-a)
        for k in range(K+1): tot[k]+=w*e*q[k]
    bn=[binomial(-wt,k) for k in range(K+1)]
    return [sum(bn[j]*tot[k-j] for j in range(k+1)) for k in range(K+1)]
# ---------- L-values of Hecke characters eps(alpha) alpha^k of Q(i)
M=1400
gens=[]
R=int(M**0.5)+1
for a in range(-R,R+1):
    if a%2==0: continue
    for b in range(-R,R+1):
        if b%2 or (a+b)%4!=1: continue
        if a*a+b*b<=M: gens.append((a,b))
def chi8(m): return {1:1,7:1,3:-1,5:-1}[m%8]
dlog={1:0,2:1,4:2,3:3}  # powers of 2 mod 5
def central(k,eps,N):
    co={}
    for a,b in gens:
        m=a*a+b*b; e=eps(a,b,m)
        if e==0: continue
        re,im=1,0
        for _ in range(k): re,im=re*a-im*b,re*b+im*a
        co[m]=co.get(m,0)+e*mpc(re,im)
    A=sqrt(mpf(N))/(2*pi); c=(k+1)//2
    F=lambda y,cj: sum((conj(v) if cj else v)*exp(-m*y/A) for m,v in co.items())
    y=mpf('1.07'); den=y**(k+1)*F(y,True)
    W=F(1/y,False)/den
    y2=mpf('1.19'); W2=F(1/y2,False)/(y2**(k+1)*F(y2,True))
    if abs(W-W2)>mpf(10)**-20 or abs(abs(W)-1)>mpf(10)**-20: return None,None
    Lam=sum((v+W*conj(v))*(A/m)**c*gammainc(c,m/A) for m,v in co.items())
    return Lam/(A**c*gamma(c)), W
print("=== (A) theta_4 at i versus L((psi chi_8)^(4m+1), 2m+1), conductor 64")
th4=series([(0,1)]+[(n,2*(-1)**n) for n in range(1,12)],1,mpf(1)/2)
th3=series([(0,1)]+[(n,2) for n in range(1,12)],1,mpf(1)/2)
prev=None
for m in range(0,11):
    L,W=central(4*m+1,lambda a,b,mm: chi8(mm),64)
    L3,W3=central(4*m+1,lambda a,b,mm: 1,32)
    e=th4[m].real
    r=L.real*factorial(2*m)/(e*factorial(m))**2
    e3=th3[m].real
    r3=L3.real*factorial(2*m)/(e3*factorial(m))**2 if abs(e3)>1e-40 else None
    print(" m=%2d theta4 coeff %s  L_tw %s  ratio %s  quotient %s | theta3: L %s ratio %s"%(m,nstr(e,12),nstr(L.real,12),nstr(r,20),nstr(r/prev,20) if prev else "-",nstr(L3.real,8),nstr(r3,15) if r3 else "coeff=0"))
    prev=r
print("=== (B) DH: theta_chi(x)=sum n chi(n) exp(-pi n^2 x/5), chi(2)=i; G=(1+z)^(-3/2) theta_chi((1-z)/(1+z))")
chi=lambda n: 0 if n%5==0 else 1j**dlog[n%5]
u=series([(n,n*mpc(chi(n))) for n in range(1,40) if n%5],mpf(1)/5,mpf(3)/2)
ph=[arg(x) for x in u]
print(" arg(u_m)/pi for m=0..12:",[nstr(p/pi,8) for p in ph[:13]])
print(" (FE forces arg u_m = phi + (m mod 2) pi/2 mod pi, so the FE-even combination has coefficients +-2|u_2n|)")
print(" sign pattern of Re(e^{-i phi} u_2n):",''.join('+' if (u[2*n]*cmath.exp(-1j*float(ph[0]))).real>0 else '-' for n in range(K//2+1)))
def mk(j1,j2,tw):
    def eps(a,b,m):
        if m%5==0: return 0
        uu=(a+3*b)%5; vv=(a+2*b)%5
        return (1j**(j1*dlog[uu]+j2*dlog[vv]))*(chi8(m) if tw else 1)
    return eps
rows=[]
for tw in (0,1):
  for j1 in range(4):
    for j2 in range(4):
        N=(64 if tw else 32)*(5 if j1 else 1)*(5 if j2 else 1)
        seq=[]
        for n in range(0,5):
            m=2*n; k=4*m+3
            L,W=central(k,mk(j1,j2,tw),N)
            if L is None: seq.append(None); continue
            seq.append(abs(L)*factorial(2*m+1)/(abs(u[m])*factorial(m))**2)
        if any(s is None for s in seq): print(" tw",tw,"eps",(j1,j2),"N",N,": FE test failed (other conductor)"); continue
        if all(s<mpf(10)**-30 for s in seq): print(" tw",tw,"eps",(j1,j2),"N",N,": central values all 0 (root number -1)"); continue
        qs=[nstr(seq[i+1]/seq[i],10) if seq[i]>mpf(10)**-30 else "inf" for i in range(4)]
        print(" tw",tw,"eps",(j1,j2),"N",N," R_n=|L|(4n+1)!/(|u_2n|(2n)!)^2:",[nstr(s,8) for s in seq]," quotients",qs)
