# extra.py agg.npz : (a) pair multiplier vs gap threshold, (b) slope |Z'| at the pair vs small-prime sum, (c) Z* vs Z' g/4
import sys, numpy as np, math, mpmath as mp
mp.mp.dps=40
agg=np.load(sys.argv[1]); recs=agg["recs"]; d=recs[:,4]
T0s=agg["T0"]; L=math.log(float(T0s.mean())/(2*math.pi))
primes=[p for p in range(2,100) if all(p%q for q in range(2,int(p**0.5)+1))]
JT={int(j):int(t) for j,t in zip(agg['j'],agg['T0'])}
uJ=np.unique(recs[:,0].astype(np.int64)); uT=[JT[int(j)] for j in uJ]
T=recs[:,0].astype(np.int64); tau=0.5*(recs[:,2]+recs[:,3])*recs[:,10]
idx=np.searchsorted(uJ,T)
C={}
for p in primes:
    base=np.array([float(mp.fmod(mp.mpf(int(t))*mp.log(p),2*mp.pi)) for t in uT])
    C[p]=np.cos(base[idx]+tau*math.log(p))
a={p:-math.log(p)/(math.sqrt(p)*L) for p in primes}
print("L=",L,"pairs",len(recs))
print("(a) least-squares multiplier over primes<100 by gap class")
for lo,hi in ((0,0.005),(0.005,0.01),(0.01,0.02),(0.02,0.03),(0,0.03)):
    s=(d>=lo)&(d<hi); n=int(s.sum())
    num=sum(C[p][s].mean()*a[p] for p in primes); den=sum(a[p]**2 for p in primes)
    print(f"  delta in [{lo},{hi}): n={n} multiplier={num/den:.3f} +- {1/math.sqrt(2*n)/math.sqrt(den):.3f}")
# (b) prime sum P(t)=sum cos(t log p)/sqrt p at pairs; correlation with log|Z'|
P=sum(C[p]/math.sqrt(p) for p in primes)
ok=(recs[:,9]==0)&(recs[:,5]!=0)
lz=np.log(np.abs(recs[ok,5])/recs[ok,10])-np.log(d[ok])   # log(|Z'|/delta) ~ log|Z''| scale
print("(b) mean P at pairs:",P.mean(),"sd",P.std(),"; unconditional mean ~",sum(a[p]/math.sqrt(p) for p in primes),"sd",math.sqrt(sum(0.5/p for p in primes)))
print("    predicted mean under 4x tilt:",4*sum(a[p]/math.sqrt(p) for p in primes))
print("    corr(log(|Z'|/delta), P) =",np.corrcoef(lz,P[ok])[0,1]," slope d log|Z'|/dP =",np.polyfit(P[ok],lz,1)[0])
print("    corr(log delta, P) =",np.corrcoef(np.log(d[ok]),P[ok])[0,1])
# (c) parabola check
r=recs[ok]; g=(r[:,3]-r[:,2]); pred=np.abs(r[:,5])*g/4
sel=d[ok]<0.01
print("(c) median |Z*|/(|Z'(a)| gap/4) for delta<0.01:",np.median(np.abs(r[sel,8])/pred[sel]))
