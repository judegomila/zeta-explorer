"""Fejer section Re L_F on zeta's gamma one-port with a random unimodular completely multiplicative twist; t in [2000,2100], P = 2000."""
import sys, numpy as np, math, cmath, mpmath as mp, json
mp.mp.dps=15
P=2000.0; u=math.log(P); N=int(P)
s=np.ones(N+1,bool); s[:2]=False
for i in range(2,int(N**.5)+1):
    if s[i]: s[i*i::i]=False
pr=np.nonzero(s)[0]
ts=np.arange(2000,2100,0.02)
gam=[]
Ku=lambda w: 1/w-(1-cmath.exp(-u*w))/(u*w*w)
for t in ts:
    z=complex(0.5,t); gs=complex(mp.digamma(mp.mpc(z)/2))/2-math.log(math.pi)/2; gp=complex(mp.polygamma(1,mp.mpc(z)/2))/4
    gam.append((Ku(z)+Ku(z-1)+gs+gp/u-P**(-z)/(u*z*z)).real)
gam=np.array(gam); out={}
for seed in range(6):
    rng=np.random.default_rng(1600+seed); ph=rng.uniform(0,2*math.pi,len(pr)); n=[];c=[]
    for p,a in zip(pr,ph):
        q=p;k=1
        while q<=N:
            n.append(q); c.append(math.log(p)*cmath.exp(1j*k*a)); q*=p;k+=1
    n=np.array(n,float); c=np.array(c)*(1-np.log(n)/u)/np.sqrt(n)
    re=np.array([gam[i]-(np.sum(c*np.exp(-1j*t*np.log(n)))).real for i,t in enumerate(ts)])
    out["seed %d: min Re L_F, fraction below 0"%seed]=[float(re.min()),float((re<0).mean())]
json.dump(out,open(sys.argv[1],'w'),indent=1); print(out)
