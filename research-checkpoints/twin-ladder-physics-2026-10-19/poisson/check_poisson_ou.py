#!/usr/bin/env python3
"""Finite diagnostics only: no RH, asymptotic, or laboratory validation claim.
Run: python check_poisson_ou.py
Requires existing numpy. Exact integer products identify resonances; evaluated
transforms and covariance comparisons use ordinary floating-point arithmetic.
"""
from fractions import Fraction
from collections import defaultdict, Counter
from pathlib import Path
import json
import math
import numpy as np


def kernel(lam, x, T):
    d = lam[:, None]-lam[None, :]
    return 0.5*np.cos(T*d)*(np.exp(-x*np.abs(d))-np.exp(-x*(lam[:, None]+lam[None, :])))


def tail_variance(lam, a, x, T):
    z = a*np.exp(-(x+1j*T)*lam)
    tail = np.cumsum(z[::-1])[::-1]
    jumps = np.diff(np.exp(2*x*np.r_[0., lam]))/2
    return float(np.dot(jumps, abs(tail)**2))


def innovation_variance(lam, a, x, T):
    delta = np.diff(np.r_[0.,lam])
    alpha = np.exp(-(x+1j*T)*delta)
    q = -np.expm1(-2*x*delta)/2
    B = np.empty(len(lam), complex)
    B[-1] = a[-1]
    for j in range(len(lam)-2,-1,-1):
        B[j] = a[j]+alpha[j+1]*B[j+1]
    return float(np.dot(q,abs(B)**2))


def raw_moments_integer_frequencies(numbers, a, x, T, order=4):
    # S(U) = sum a_j cos(U log n_j). Integer-product keys preserve
    # exact multiplicative coincidences, unlike floating frequency matching.
    base = [(Fraction(int(n)),float(aa)/2) for n,aa in zip(numbers,a)]
    base += [(1/r,w) for r,w in list(base)]
    terms = {Fraction(1): 1.}
    out = [1.]
    for k in range(1,order+1):
        nxt = defaultdict(float)
        for r,w in terms.items():
            for rr,ww in base:
                nxt[r*rr] += w*ww
        terms = nxt
        value = 0.
        for r,w in terms.items():
            f = math.log(r.numerator)-math.log(r.denominator)
            value += w*math.exp(-x*abs(f))*math.cos(T*f)
        out.append(value)
    return out


def center(raw):
    m=raw[1]; v=raw[2]-m*m
    third=raw[3]-3*m*raw[2]+2*m**3
    fourth=raw[4]-4*m*raw[3]+6*m*m*raw[2]-3*m**4
    return dict(mean=m,variance=v,third_central=third,fourth_central=fourth,
                fourth_cumulant=fourth-3*v*v,kurtosis=fourth/(v*v))


def ratio_multiplicities(numbers):
    c=Counter(Fraction(int(q),int(p)) for i,p in enumerate(numbers) for q in numbers[i+1:])
    return {str(r):n for r,n in c.items() if n>1}


def main():
    p=np.array([2,3,5,7,11,13,17,19],dtype=int)
    s,h,x,T=.834,.125,.04,100.
    lam=np.log(p); a=-np.expm1(-h*lam)*np.exp(-s*lam)
    K=kernel(lam,x,T)
    vk=float(a@K@a); vt=tail_variance(lam,a,x,T); vi=innovation_variance(lam,a,x,T)
    moments=center(raw_moments_integer_frequencies(p,a,x,T))
    assert max(abs(vk-vt),abs(vk-vi),abs(vk-moments['variance']))<1e-13
    # Same deterministic algebra for a generic positive-frequency control.
    rng=np.random.default_rng(20261019)
    generic=np.sort(rng.uniform(lam[0],lam[-1],len(lam)))
    generic_errors=[abs(float(a@kernel(generic,x,T)@a)-tail_variance(generic,a,x,T)),
                    abs(float(a@kernel(generic,x,T)@a)-innovation_variance(generic,a,x,T))]
    assert max(generic_errors)<1e-13
    # Exact one-mode rational benchmark r^2=1/2 and carrier phase 0.
    one=center(raw_moments_integer_frequencies([2],[1.],.5,0.))
    assert abs(one['variance']-.25)<1e-14
    assert abs(one['fourth_central']-13/32)<1e-14
    # Two log-integer controls show repeated beat frequencies and a triad.
    triad=center(raw_moments_integer_frequencies([2,3,6],[1.,1.,1.],200.,0.))
    prime3=center(raw_moments_integer_frequencies([2,3,5],[1.,1.,1.],200.,0.))
    assert abs(triad['third_central']-1.5)<1e-8
    assert abs(prime3['third_central'])<1e-8
    result={
       'scope':'Finite double-precision diagnostics; not interval certificates or laboratory experiments.',
       'parameters':{'primes':p.tolist(),'s':s,'h':h,'x':x,'T':T},
       'covariance_variance':vk,'tail_variance':vt,'innovation_variance':vi,
       'minimum_covariance_eigenvalue':float(np.linalg.eigvalsh(K).min()),
       'raw_cauchy_cosine_statistics':moments,
       'gaussian_surrogate_fourth_central':3*vk*vk,
       'generic_frequency_identity_errors':generic_errors,
       'one_mode_exact_check':one,
       'one_mode_gaussian_fourth_central':3/16,
       'repeated_prime_ratios':ratio_multiplicities(p),
       'repeated_integer_ratios_2_to_9':ratio_multiplicities(list(range(2,10))),
       'broad_width_triad_2_3_6_third_moment':triad['third_central'],
       'broad_width_prime_2_3_5_third_moment':prime3['third_central']}
    dest=Path(__file__).with_name('finite_diagnostics.json')
    dest.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))

if __name__=='__main__':main()
