# Part 2. Node space: nodes a_j in [0.6,6], u_j=a_j^2 equally spaced in [0.36,36]; H_m(w)=sum_j m_j/(u_j-w^2).
# C_Pick(S)={m: H_m(i tau)>=0}; K_F(S)={m: sum m_j e^{-u_j t}>=0}; K_Om(S)={m: Re H_m(rho)>=0 on Om}, Om = line U A_T,
# A_T={beta+i gamma: gamma>=T, 0<beta<=1/2}.
import math, cmath, random, sys
from flint import arb, ctx
random.seed(12345)
def nodes_u(N): return [0.36+(36-0.36)*j/(N-1) for j in range(N)]
# ---------- (a) extreme rays of C_Pick(S): H = prod_k (w^2+tau_k^2)^2 / prod_j (u_j-w^2)
def argH(rho,taus,u):
    r2=rho*rho
    return sum(2*cmath.phase(t*t+r2) for t in taus)-sum(cmath.phase(uj-r2) for uj in u)
def in_KOm(taus,u,T,betas=(0.5,0.35,0.2,0.1,0.03,0.01,0.003)):
    worst=1.0
    gam=[T*(1+1e-3*k) for k in range(0,300)]+[T*1.3*1.05**k for k in range(0,260)]
    for t in taus:
        if t>T-60:
            gam+= [g for g in (t+d for d in [x*0.02 for x in range(-1500,1501)]) if g>=T]
    for b in betas:
        for g in gam:
            for gg in (g, math.sqrt(g*g+b*b)):
                c=math.cos(argH(complex(b,gg),taus,u))
                if c<worst: worst=c
    return worst
print("(a) extreme rays; roots tau_k log-uniform on [1,1e4]; T=100")
print("N K samples | frac in K_Om | frac all roots<T | frac all roots<T-0.64K | in K_Om but max root>T | max root<T-0.64K but not in K_Om | max root of members")
T=100.0
for N in (3,5,9,15,21,31,40):
    u=nodes_u(N); K=(N-1)//2; S=400
    cnt=c1=c2=bad1=bad2=0; mx=0
    for _ in range(S):
        taus=[10**random.uniform(0,4) for _ in range(K)]
        w=in_KOm(taus,u,T); mem=(w>=0)
        cnt+=mem; c1+= max(taus)<T; c2+= max(taus)<T-0.64*K
        if mem and max(taus)>T: bad1+=1
        if (not mem) and max(taus)<T-0.64*K: bad2+=1
        if mem: mx=max(mx,max(taus))
    print(N,K,S,"|",cnt/S,"|",c1/S,"|",c2/S,"|",bad1,"|",bad2,"|",round(mx,2),flush=True)
# sharp margin: single root tau below T, all others small: largest tau with membership, vs K (roots clustered just below)
print("margin scan: K roots equally spaced in [tau_max-K*0.5, tau_max]; largest tau_max with membership (T=100)")
for N in (3,9,21,40):
    u=nodes_u(N); K=(N-1)//2
    lo,hi=50.0,100.0
    for _ in range(18):
        mid=(lo+hi)/2
        taus=[mid-0.5*k for k in range(K)]
        if in_KOm(taus,u,T)>=0: lo=mid
        else: hi=mid
    print(" N=%d K=%d: tau_max* = %.3f  (T - tau_max* = %.3f ; bound 0.64K = %.2f)"%(N,K,lo,T-lo,0.64*K))
# ---------- (b) is K_F(S) inside K_Om(S)?  <=> q(rho)_j=Re 1/(u_j-rho^2) is in the moment cone of e^{-u_j t}, t>=0.
# equally spaced u_j: x=e^{-ht}, c_j=int x^j dmu, mu>=0 on [0,1]: truncated Hausdorff problem, two Hankel matrices PSD.
def pd(M,n):
    # LDL^T with arb; returns True if all pivots certified >0, False if some pivot certified <0, None otherwise
    A=[row[:] for row in M]
    for i in range(n):
        p=A[i][i]
        if p>0: pass
        elif p<0: return False
        else: return None
        for r in range(i+1,n):
            f=A[r][i]/p
            for c_ in range(i+1,n): A[r][c_]-=f*A[i][c_]
    return True
def member(N,beta,gamma,prec=3000):
    ctx.prec=prec
    from flint import acb
    rho2=acb(arb(beta),arb(gamma)); rho2=rho2*rho2
    c=[(1/(acb(arb(36)/100+(arb(36)-arb(36)/100)*j/(N-1))-rho2)).real for j in range(N)]
    d=N-1
    if d%2==0:
        n=d//2; A=[[c[i+j] for j in range(n+1)] for i in range(n+1)]; B=[[c[i+j+1]-c[i+j+2] for j in range(n)] for i in range(n)]
        ra=pd(A,n+1); rb=pd(B,n) if n>0 else True
    else:
        n=(d-1)//2; A=[[c[i+j+1] for j in range(n+1)] for i in range(n+1)]; B=[[c[i+j]-c[i+j+1] for j in range(n+1)] for i in range(n+1)]
        ra=pd(A,n+1); rb=pd(B,n+1)
    if ra is None or rb is None: return None
    return ra and rb
print("(b) first order N at which q(beta+i gamma) leaves the moment cone D_F(S) (so K_F(S) is not inside K_Om(S) when gamma>=T is allowed)")
print("gamma beta | first N not in D_F | pi*gamma/(4 beta)")
for gamma in (15,20,30,50,100):
    for beta in ('0.5','0.25','0.1'):
        first=None
        for N in list(range(3,60))+list(range(60,261,4)):
            r=member(N,beta,gamma)
            if r is None: first=('precision',N); break
            if r is False: first=N; break
        print(gamma,beta,"|",first,"|",round(math.pi*gamma/(4*float(beta)),1),flush=True)
