#!/usr/bin/env python3
"""Independent symbolic and finite diagnostic audit; no laboratory/RH claim."""
import hashlib
import json
from pathlib import Path
import numpy as np
import sympy as s

ROOT = Path(__file__).resolve().parent
INPUTS = [
    '/workspace/shared/twin_ladder_physics_20261019/PASSIVE_DELAY_REALIZATION_v1.md',
    '/workspace/shared/twin_ladder_physics_20261019/verify_passive_delay.py',
    '/workspace/shared/twin_ladder_physics_20261019/verification_receipt.json',
    '/workspace/shared/rh_prime_mode_physics_20261019/POISSON_OU_AND_PRIME_BEAT_CORRESPONDENCE_v1.md',
    '/workspace/shared/rh_prime_mode_physics_20261019/check_poisson_ou.py',
    '/workspace/shared/rh_prime_mode_physics_20261019/finite_diagnostics.json',
    '/workspace/shared/rh_original_curve_20261018/release_v3/poisson-prime-tail-energy.md',
    '/workspace/shared/rh_dyadic_prime_localization_20261019/release_v2/DYADIC_NEAR_FREQUENCY_REDUCTION_v2.md',
]
manifest = {p: hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in INPUTS}
checks = []
def zero(name, expr):
    assert s.cancel(expr) == 0, name
    checks.append(name)

q0,q1,z,u = s.symbols('q0 q1 z u', real=True)
c=(1+q1)/(1+q0)
A=(1-q0*q1)/((1+q0)*(1-q1))
B=(q0-q1)/((1+q0)*(1-q1))
J=(q1-z)/(1-q1*z)
H=c*(1-q0*z)/(1-q1*z)
zero('A+B=1',A+B-1)
zero('H=A+BJ',H-A-B*J)
zero('J boundary all-pass',J*J.subs(z,1/z)-1)
zero('two-output power identity',H*H.subs(z,1/z)+A*B*(J-1)*(J.subs(z,1/z)-1)-1)
ratio=(1+q0*q0-2*q0*u)/(1+q1*q1-2*q1*u)
zero('negative modulus derivative',s.diff(ratio,u)+2*(q0-q1)*(1-q0*q1)/(1+q1*q1-2*q1*u)**2)
zero('exact extremum normalization',c*(1+q0)/(1+q1)-1)
zero('h=0 complete cancellation',H.subs(q1,q0)-1)

r,C=s.symbols('r C', real=True)
raw2=(1+r**2*(2*C**2-1))/2
raw3=(3*r*C+r**3*(4*C**3-3*C))/4
raw4=(3+4*r**2*(2*C**2-1)+r**4*(8*C**4-8*C**2+1))/8
mean=r*C
variance=raw2-mean**2
fourth=raw4-4*mean*raw3+6*mean**2*raw2-3*mean**4
zero('cosine variance',(1-r**2)/2-variance)
zero('cosine fourth moment',fourth-(1-r**2)*(8*r**2*C**2-r**2+3)/8)
zero('cosine fourth cumulant',fourth-3*variance**2-(1-r**2)*(8*r**2*C**2+5*r**2-3)/8)
zero('one-mode exact fourth benchmark',fourth.subs({r:1/s.sqrt(2),C:1})-s.Rational(13,32))

# Separately assemble the covariance of each OU state from its independent
# two-dimensional innovations, rather than using the claimed backward recursion.
rng=np.random.default_rng(236173)
max_ou_error=max_tail_error=max_psd_error=0.
for trial in range(80):
    n=int(rng.integers(2,20))
    lam=np.sort(rng.uniform(.01,8,n))
    amp=rng.normal(size=n)
    x=float(rng.uniform(.003,2))
    carrier=float(rng.uniform(-300,300))
    lag=lam[:,None]-lam[None,:]
    cov=.5*np.cos(carrier*lag)*(np.exp(-x*abs(lag))-np.exp(-x*(lam[:,None]+lam[None,:])))
    step=np.diff(np.r_[0.,lam])
    innovation_var=-np.expm1(-2*x*step)/2
    L=np.zeros((n,2*n))
    for j in range(n):
        for k in range(j+1):
            shift=lam[j]-lam[k]
            angle=carrier*shift
            factor=np.sqrt(innovation_var[k])*np.exp(-x*shift)
            L[j,2*k]=factor*np.cos(angle)
            L[j,2*k+1]=factor*np.sin(angle)
    ou_cov=L@L.T
    max_ou_error=max(max_ou_error,float(np.max(abs(cov-ou_cov))))
    max_psd_error=max(max_psd_error,float(max(0,-np.linalg.eigvalsh(cov).min())))
    energy=0.
    for k in range(n):
        lo=0 if k==0 else lam[k-1]
        hi=lam[k]
        tail=sum(amp[j]*np.exp(-(x+1j*carrier)*lam[j]) for j in range(k,n))
        energy+=(np.exp(2*x*hi)-np.exp(2*x*lo))/2*abs(tail)**2
    direct=float(amp@cov@amp)
    max_tail_error=max(max_tail_error,abs(energy-direct))
assert max_ou_error<1e-12
assert max_tail_error<1e-11
assert max_psd_error<1e-12

# Generic complex points in the causal half-plane, including non-boundary
# points: contractivity is not being inferred only from stability.
max_singular_excess=0.
for trial in range(1000):
    q0f=float(rng.uniform(.001,.999))
    q1f=float(rng.uniform(.0001,q0f))
    zf=float(rng.uniform(0,1))*np.exp(1j*rng.uniform(-np.pi,np.pi))
    Af=(1-q0f*q1f)/((1+q0f)*(1-q1f)); Bf=1-Af
    Uf=np.array([[np.sqrt(Af),-np.sqrt(Bf)],[np.sqrt(Bf),np.sqrt(Af)]])
    Jf=(q1f-zf)/(1-q1f*zf)
    Sf=Uf.T@np.diag([1,Jf])@Uf
    max_singular_excess=max(max_singular_excess,float(np.linalg.svd(Sf,compute_uv=False)[0]-1))
assert max_singular_excess<1e-13

result={
    'status':'PASS for listed frozen inputs; independent symbolic derivation plus finite numerical diagnostics',
    'input_sha256':manifest,
    'symbolic_checks':checks,
    'ou_generic_configurations':80,
    'maximum_ou_covariance_error':max_ou_error,
    'maximum_tail_variance_error':max_tail_error,
    'maximum_negative_covariance_eigenvalue':max_psd_error,
    'complex_disk_matrix_cases':1000,
    'maximum_matrix_singular_value_excess_over_one':max_singular_excess,
    'limitations':['Finite floating point diagnostics are not interval certificates.',
                   'No laboratory experiment, novelty theorem, completed-xi realization, or RH claim.',
                   'Analytic proofs and assumptions are reviewed separately in INDEPENDENT_AUDIT.md.']
}
ROOT.mkdir(parents=True,exist_ok=True)
(ROOT/'independent_receipt.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
