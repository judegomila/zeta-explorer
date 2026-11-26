"""Independent numerical checks for the theta-kernel proof attempt.

These are floating-point checks, not interval certificates or an RH proof.
The Pick target is computed directly from xi, independently of the integral.
"""
import json
from pathlib import Path
import mpmath as mp
import numpy as np
from numpy.polynomial.legendre import leggauss

mp.mp.dps = 70

def xi_centered(z):
    s = mp.mpf('0.5') + z
    return s * (s - 1) * mp.power(mp.pi, -s/2) * mp.gamma(s/2) * mp.zeta(s) / 2

def kappa(t):
    t = np.abs(np.asarray(t, dtype=float))
    q = np.exp(t)
    result = np.zeros_like(t)
    for m in range(1, 9):
        a = np.pi * m*m
        result += (2*a*a*np.exp(2.25*t)-3*a*np.exp(1.25*t))*np.exp(-a*q)
    return result

def kernel(t, u, order=96):
    t, u = np.broadcast_arrays(t, u)
    v = (t+u)/2
    w = (t-u)/2
    nodes, weights = leggauss(order)
    r = np.abs(v)[..., None] + 2*(nodes+1)
    integrand = r*kappa(r+w[..., None])*kappa(r-w[..., None])
    return np.sum(integrand*weights, axis=-1)

rates = [mp.mpf(3)/2, mp.mpf(4)/3, mp.mpf(5)/4]
fs = [xi_centered(a) for a in rates]
ls = [mp.diff(xi_centered, a)/f for a, f in zip(rates, fs)]
target_mp = mp.matrix([[(a+b)/(x+y) for b,y in zip(ls,rates)] for a,x in zip(ls,rates)])
target = np.array(target_mp.tolist(), dtype=float)
output = {
    'status': 'exploratory floating point; not a positivity certificate',
    'normalization': 'F(w)=xi(1/2+w)=integral kappa(t) exp(wt/2) dt',
    'theta_terms': 8,
    'inner_integral_length': 4,
    'outer_integral_interval': [-3,3],
    'rates': [str(x) for x in rates],
    'pick_direct': [[mp.nstr(target_mp[i,j],55) for j in range(3)] for i in range(3)],
    'integral_identity_checks': [],
}

for n in [64,96,144]:
    x, wt = leggauss(n)
    t, wt = 3*x, 3*wt
    h = np.empty((n,n))
    for start in range(0,n,8):
        h[start:start+8] = kernel(t[start:start+8,None], t[None,:], 96)
    basis = np.exp(t[:,None]*np.array(rates,dtype=float)[None,:]/2)
    basis = basis/np.array(fs,dtype=float)[None,:]
    integral = (basis*wt[:,None]).T @ h @ (basis*wt[:,None])
    output['integral_identity_checks'].append({
        'outer_gauss_order': n,
        'max_abs_error_vs_xi': float(np.max(np.abs(integral-target))),
        'max_rel_error_vs_xi': float(np.max(np.abs((integral-target)/target))),
    })

assert all(r['max_abs_error_vs_xi'] < 1e-10 for r in output['integral_identity_checks'])
output['normalization_checks_passed'] = True

points = np.array([-1.5,-1,-0.5,0,0.5,1,1.5])
h = kernel(points[:,None],points[None,:],160)
diag = np.sqrt(np.diag(h))
corr = h/diag[:,None]/diag[None,:]
output['finite_kernel_sample'] = {
    'points': points.tolist(),
    'normalized_eigenvalues': np.linalg.eigvalsh(corr).tolist(),
    'reflection_error': float(np.max(np.abs(h-h[::-1,::-1]))),
    'minimum_entry': float(np.min(h)),
    'interpretation': 'Finite sampled evidence only; no uniform positive-definiteness claim.',
}

path=Path(__file__).with_name('THETA_KERNEL_EXPLORATORY.json')
path.write_text(json.dumps(output,indent=2)+'\n')
print(json.dumps(output,indent=2))
