"""Bohr-Jessen zero density of two-term twins in the random-phase (Steinhaus) model.
F = L(chi) (c + conj(c) R),  R = prod_{p non-Euler} (1 - chi(p) u_p)/(1 - conj chi(p) u_p),  u_p = p^{-sigma} z_p, z_p iid uniform on the circle.
Density of zeros with Re s > sigma0 per unit height:  D(sigma0) = -(1/2pi) d/dsigma E log|1 + e^{-iT'} R_sigma|  (Jensen), T' = arg(c/conj c).
Zero  <=>  R = -c/conj(c) = e^{i T}.   MODEL (exact for sigma>1 by Kronecker-Weyl; for 1/2<sigma<=1 it is the Borchsenius-Jessen limit law).
Run: python -I mc_density.py"""
import math, cmath, json
import numpy as np
rng=np.random.default_rng(20261116)
PMAX=3000
def sieve(n):
    s=np.ones(n+1,bool); s[:2]=False
    for i in range(2,int(n**0.5)+1):
        if s[i]: s[i*i::i]=False
    return np.nonzero(s)[0]
PR=sieve(PMAX)
def primroot(q):
    n=q-1; fs=[l for l in range(2,n+1) if n%l==0 and all(l%d for d in range(2,int(l**0.5)+1))]
    g=2
    while any(pow(g,n//l,q)==1 for l in fs): g+=1
    return g
def lab(q,j,Pmin=0):
    g=primroot(q); n=q-1; ind=np.zeros(q,int); x=1
    for k in range(n): ind[x]=k; x=x*g%q
    ph=2*math.pi*((j*ind[PR%q])%n)/n
    keep=(PR%q!=0)&(np.abs(np.sin(ph))>1e-12)&(PR>Pmin)      # Euler primes (chi(p) real) drop out of R
    return PR[keep].astype(float), np.exp(1j*ph[keep])

def density(q,j,T,sig0,Pmin=0,N=400000,h=0.004,batch=4000):
    p,a=lab(q,j,Pmin)
    lp=np.log(p)
    acc=np.zeros(2); acc2=0.0; n=0
    tgt=cmath.exp(1j*T)
    for b in range(N//batch):
        z=np.exp(2j*math.pi*rng.random((batch,len(p))))
        vals=[]
        for s in (sig0-h,sig0+h):
            u=z*np.exp(-s*lp)[None,:]
            logR=(np.log1p(-a[None,:]*u)-np.log1p(-np.conj(a)[None,:]*u)).sum(axis=1)
            vals.append(np.log(np.abs(1-np.exp(logR)/tgt)))      # log|1 - R/e^{iT}|  (zero iff R=e^{iT})
        d=(vals[1]-vals[0])/(2*h)
        acc[0]+=d.sum(); acc2+=(d*d).sum(); n+=batch
    mean=acc[0]/n; sd=math.sqrt(max(acc2/n-mean*mean,0)/n)
    return -mean/(2*math.pi), sd/(2*math.pi)

kappa=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
T_dh=math.pi-2*math.atan(kappa); T_dhm=T_dh-math.pi
out={'runs':[]}
def rec(tag,q,j,T,sig0,Pmin=0,N=400000):
    D,se=density(q,j,T,sig0,Pmin,N)
    r={'tag':tag,'q':q,'j':j,'target':T,'sigma0':sig0,'Pmin':Pmin,'D':D,'se':se}
    out['runs'].append(r); print(json.dumps(r),flush=True)
# 1. DH itself, both root numbers: compare with the census
for T,tag in ((T_dh,'DH omega=+1'),(T_dhm,'DH omega=-1')):
    for s0 in (0.75,1.0): rec(tag,5,1,T,s0,N=800000)
# 2. fixed target, vary the lab (Euler density): order 4 (1/2), order 3 (1/3: q=7,j=2), order 6 (1/3: q=7,j=1), order 12 (1/6: q=13,j=1), order 100 (1/50: q=101,j=1)
for T in (T_dh,1.0):
    for (q,j,name) in ((5,1,'ord4 dens 1/2'),(7,2,'ord3 dens 1/3'),(7,1,'ord6 dens 1/3'),(13,1,'ord12 dens 1/6'),(101,1,'ord100 dens 1/50')):
        for s0 in (0.75,1.0): rec('fixed-target '+name,q,j,T,s0)
# 3. formal lab II: DH pattern, Euler factors shared at every p <= P
for P in (2,3,7,13,23,47):
    for s0 in (0.75,): rec("formal tail p>P",5,1,T_dh,s0,Pmin=P,N=400000)
    for s0 in (0.75,): rec("formal tail p>P, easy target",5,1,T_dhm,s0,Pmin=P,N=400000)
json.dump(out,open('mc_density.json','w'),indent=1)
