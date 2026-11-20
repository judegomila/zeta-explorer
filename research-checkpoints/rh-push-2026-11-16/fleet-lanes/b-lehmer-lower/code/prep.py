# prep.py Kmax outdir : 128-bit fixed-point frac(log n / 2pi) for n<=Kmax, via prime logs (Arb) + spf sieve
import sys, numpy as np, numba, flint, time
from numba import njit
Kmax=int(sys.argv[1]); out=sys.argv[2]
@njit(cache=True)
def spf_sieve(N):
    spf=np.zeros(N+1,np.uint32)
    for i in range(2,N+1):
        if spf[i]==0:
            for j in range(i,N+1,i):
                if spf[j]==0: spf[j]=i
    return spf
@njit(cache=True)
def accumulate(spf,uhi,ulo):
    N=spf.shape[0]-1
    for n in range(2,N+1):
        p=spf[n]
        if p==n: continue
        m=n//p
        lo=ulo[p]+ulo[m]
        c=np.uint64(1) if lo<ulo[p] else np.uint64(0)
        ulo[n]=lo
        uhi[n]=uhi[p]+uhi[m]+c
t0=time.time()
spf=spf_sieve(Kmax)
primes=np.nonzero(spf==np.arange(Kmax+1,dtype=np.uint32))[0]; primes=primes[primes>=2]
print("primes",len(primes),time.time()-t0,flush=True)
flint.ctx.prec=240
twopi=2*flint.arb.pi(); S=flint.arb(2)**128
uhi=np.zeros(Kmax+1,np.uint64); ulo=np.zeros(Kmax+1,np.uint64)
M64=(1<<64)-1
for p in primes:
    p=int(p)
    x=flint.arb(p).log()/twopi
    v=int((x*S).floor().unique_fmpz()) & ((1<<128)-1)
    uhi[p]=v>>64; ulo[p]=v&M64
print("prime logs",time.time()-t0,flush=True)
accumulate(spf,uhi,ulo)
np.save(out+"/uhi.npy",uhi); np.save(out+"/ulo.npy",ulo)
print("done",time.time()-t0)
