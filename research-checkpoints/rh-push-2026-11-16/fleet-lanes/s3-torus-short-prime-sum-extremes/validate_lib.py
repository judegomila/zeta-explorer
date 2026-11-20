import os; os.environ['RH_NOGPU']='1'
import numpy as np, s3lib as S, math
rng=np.random.default_rng(1)
n=3000; om=rng.random(n)*2.5; c=rng.standard_normal(n)+1j*rng.standard_normal(n)
M=4096
F=S.nufft1(om,c,M,nf=4*M)
k=np.arange(-M//2,M//2)
D=(c[None,:]*np.exp(-1j*k[:,None]*om[None,:])).sum(1)
print('nufft err',abs(F-D).max(), abs(D).max())
F=S.nufft1(om,c.real,M,nf=2*M)
D=(c.real[None,:]*np.exp(-1j*k[:,None]*om[None,:])).sum(1)
print('nufft err sigma2',abs(F-D).max())
SP=S.Spreader(1,4*M,M,dtype=np.float64); SP.add(om,c.real[None,:]); F=SP.transform(0,shift=0.3)
D=(c.real[None,:]*np.exp(-1j*(k[:,None]+0.3)*om[None,:])).sum(1); print('shift err',abs(F-D).max())
import torus as T
pr=T.sieve(200); Lp=S.frac_logs(pr); L=S.extend_logs(200,pr,Lp)
import mpmath as mp; mp.mp.dps=60
H=31234567890123
cy=S.cycles_exact(H,[L[n] for n in (2,97,144,200)])
ref=[float(mp.frac(H*mp.log(n)/(2*mp.pi))) for n in (2,97,144,200)]
print(cy, ref)
b,dh,dl=S.lattice_tables(H,9697,[L[n] for n in (2,97,144,200)])
k=np.array([0,5,1000000],dtype=np.uint64)
u=S.u2cyc(S.lattice_u(b,dh,dl,k))
ref=[[float(mp.frac((H+int(kk)*9697)*mp.log(n)/(2*mp.pi))) for n in (2,97,144,200)] for kk in k]
print('lattice err',abs(u-np.array(ref)).max())
p=S.seg_primes(10**9,10**9+10**6,T.sieve(40000)); print('primes in [1e9,1e9+1e6):',len(p),'(expected 47374)')
