# integrated local criterion J_Q(sigma,t)=log|A_Q(sigma+it)|-log|A_Q(1-sigma+it)| and Fejer-smoothed truncation
import mpmath as mp, math, cmath
mp.mp.dps=20
def primes(Q):
    s=[True]*(Q+1); out=[]
    for i in range(2,Q+1):
        if s[i]:
            out.append(i)
            for j in range(i*i,Q+1,i): s[j]=False
    return out
def logabsA(sig,t,P):
    s=mp.mpc(sig,t)
    v=mp.re(mp.log(s*(s-1)/2)-s/2*mp.log(mp.pi)+mp.loggamma(s/2))
    return float(v)-sum(math.log(abs(1-cmath.exp(-complex(sig,t)*math.log(p)))) for p in P)
sigs=[0.5+0.01*j for j in range(1,60)]+[1.1+0.1*j for j in range(0,20)]
print("== J-criterion: fraction of heights t in [100.3,130.3] with J_Q(sigma,t)>0 for all sigma in (1/2,3]")
for Q in (3,7,30,300):
    P=primes(Q); ok=0;n=0;bad=[]
    for k in range(1500):
        t=100.3+0.02*k; n+=1
        m=min(logabsA(sg,t,P)-logabsA(1-sg,t,P) for sg in sigs)
        if m>0: ok+=1
        else: bad.append(round(t,2))
    rng=(bad[0],bad[-1]) if bad else None
    print(f" Q={Q:4d}: fraction passing={ok/n:.3f}; failing heights span {rng} count={len(bad)}")
print("== Fejer-smoothed truncation on the boundary: Re L^F_Q(1/2+it), weights (1-log n/log Q)")
def Gt(s): return 1/s - mp.log(mp.pi)/2 + mp.digamma(s/2)/2
def vonM(Q):
    L=[]
    for p in primes(Q):
        q=p
        while q<=Q:
            L.append((q,math.log(p))); q*=p
    return L
for Q in (10,100,1000,10000):
    VM=vonM(Q); lq=math.log(Q); mn=1e9; neg=0; tot=0
    for k in range(1,1201):
        t=0.05*k; s=complex(0.5,t)
        g=complex(Gt(mp.mpc(0.5,t)))
        ps=sum(l*(1-math.log(n)/lq)*cmath.exp(-s*math.log(n)) for n,l in VM)
        a=1-s
        # int_1^Q (1-log x/log Q) x^-s dx = (Q^a-1)/(a^2 log Q) - 1/a
        comp=(cmath.exp(a*lq)-1)/(a*a*lq)-1/a
        v=(g-ps+comp).real; tot+=1; neg+=v<0; mn=min(mn,v)
    print(f" Q={Q:6d}: min={mn:+.4f} frac negative={neg/tot:.3f}")
