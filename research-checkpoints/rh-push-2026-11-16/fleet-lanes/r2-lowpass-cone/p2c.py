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
    gam=[T*(1+2e-3*k) for k in range(0,150)]+[T*1.3*1.1**k for k in range(0,130)]
    for t in taus:
        if t>T-60:
            gam+= [g for g in (t+d for d in [x*0.05 for x in range(-600,601)]) if g>=T]
    for b in betas:
        for g in gam:
            for gg in (g, math.sqrt(g*g+b*b)):
                c=math.cos(argH(complex(b,gg),taus,u))
                if c<worst: worst=c
    return worst

T=100.0
for N in (40,):
    u=nodes_u(N); K=(N-1)//2; S=200
    cnt=c1=c2=bad1=bad2=0; mx=0
    for _ in range(S):
        taus=[10**random.uniform(0,4) for _ in range(K)]
        w=in_KOm(taus,u,T); mem=(w>=0)
        cnt+=mem; c1+= max(taus)<T; c2+= max(taus)<T-0.64*K
        if mem and max(taus)>T: bad1+=1
        if (not mem) and max(taus)<T-0.64*K: bad2+=1
    print("N=40 K=19 uniform-log sample:",S,"| in K_Om",cnt/S,"| all roots<T",c1/S,"| member with root>T",bad1,flush=True)
# conditional sample: all roots below T (uniform on [1,T]) -> how many are members
for N in (9,21,40):
    u=nodes_u(N); K=(N-1)//2; S=200; cnt=0; viol=0
    for _ in range(S):
        taus=[random.uniform(1,T) for _ in range(K)]
        mem=in_KOm(taus,u,T)>=0; cnt+=mem
        if (not mem) and max(taus)<T-1.28*K: viol+=1
    print("N=%d K=%d roots uniform on [1,T]: member fraction %.3f ; (T-1.28K)^K/T^K-type prediction: lower %.3f upper(2K/pi margin) %.3f ; violations of proved bound: %d"%(N,K,cnt/S,max(0,(T-1.28*K-1)/(T-1))**K,max(0,(T-0.64*K-1)/(T-1))**K,viol),flush=True)
