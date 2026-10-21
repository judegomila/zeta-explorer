"""Finite diagnostic of the actual bridge packet and the pair partition.

Requires numpy/scipy. Floating-point consistency only, not an RH certificate.
"""
import json
from math import floor, exp, log, sqrt, gcd
from pathlib import Path
import numpy as np
from scipy.interpolate import BSpline

bp=BSpline.basis_element(np.arange(17,dtype=float),extrapolate=False)
b2,b4=bp.derivative(2),bp.derivative(4)
normalizer=3733353825443981/6810804000

def packet(t):
    z=16*np.asarray(t)+8
    return np.nan_to_num((16**5*b4(z)-.5*16**3*b2(z)+.0625*16*bp(z))/normalizer)

def sieve(n):
    mu=np.ones(n+1,dtype=np.int64); mu[0]=0
    prime=np.ones(n+1,dtype=bool); prime[:2]=False
    mangoldt=np.zeros(n+1)
    for p in range(2,n+1):
        if prime[p]:
            prime[p*p::p]=False
            mu[p::p]*=-1
            if p*p<=n: mu[p*p::p*p]=0
            q=p
            while q<=n:
                mangoldt[q]=log(p); q*=p
    return mu,mangoldt

def one(L):
    nmax=floor(exp(L+.5)); dmax=nmax//2
    mu,lam=sieve(nmax)
    n=np.arange(1,nmax+1)
    direct=float(lam[1:] @ (packet(np.log(n)-L)/np.sqrt(n)))
    fs=np.zeros(dmax+1)
    for m in range(2,nmax+1):
        ds=np.arange(1,nmax//m+1)
        fs[ds]+=log(m)/sqrt(m)*packet(np.log(m*ds)-L)
    ds=np.arange(1,dmax+1)
    a=np.zeros(dmax+1); a[ds]=mu[ds]*fs[ds]/np.sqrt(ds)
    G=floor(exp(.2504*L)); H=floor(exp(.7496*L))
    diag=float(a@a)
    large_gcd=0.; short_shift=0.; remaining=0.
    for m in range(1,dmax):
        ns=np.arange(m+1,dmax+1)
        terms=2*a[m]*a[ns]
        big=np.gcd(m,ns)>G
        short=(~big)&(ns-m<=H)
        rem=(~big)&(~short)
        large_gcd+=float(np.sum(terms[big]))
        short_shift+=float(np.sum(terms[short]))
        remaining+=float(np.sum(terms[rem]))
    total=float(np.sum(a)); energy=total*total
    assert abs(direct-total)<1e-10
    assert abs(energy-(diag+large_gcd+short_shift+remaining))<1e-10
    for m in range(1,min(dmax,200)+1):
        for n in range(1,min(dmax,200)+1):
            d=gcd(m,n); u=m//d; v=n//d
            fact=int(mu[d]**2*mu[u]*mu[v]) if gcd(d,u*v)==1 else 0
            assert int(mu[m]*mu[n])==fact
    return {'L':L,'G':G,'H':H,'prime_sum':direct,'mobius_sum':total,'diagonal':diag,
            'large_gcd_signed_pair_sum':large_gcd,'short_shift_excluding_large_gcd':short_shift,
            'remaining_signed_pair_sum':remaining,'total_squared':energy,
            'partition_absolute_error':abs(energy-diag-large_gcd-short_shift-remaining),
            'status':'floating-point diagnostic; no all-scale claim'}

if __name__=='__main__':
    rows=[one(L) for L in [4.,6.,8.]]
    Path(__file__).with_name('mobius_diagnostics.json').write_text(json.dumps(rows,indent=2)+'\n')
    print(json.dumps(rows,indent=2))
