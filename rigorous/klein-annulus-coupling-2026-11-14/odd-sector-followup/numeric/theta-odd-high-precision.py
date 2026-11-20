"""Bounded high-precision odd-theta Gram audit.

The theta-series and q-tail truncations have explicit analytical upper bounds.
mpmath quadrature estimates and precision agreement are NOT interval proofs.
Run: python3 theta-odd-high-precision.py
"""
from pathlib import Path
import json
import time
import mpmath as mp

HERE = Path(__file__).resolve().parent
N = 8
Q = 16
NODE_STRINGS = ['.15', '.30', '.45', '.60', '.75', '.90', '1.05']


def kappa(u):
    u = abs(u)
    e = mp.exp(u)
    prefactor = mp.exp(mp.mpf('1.25')*u)
    return mp.fsum(mp.pi*n*n*(2*mp.pi*n*n*e-3)*prefactor*mp.exp(-mp.pi*n*n*e)
                   for n in range(1, N+1))


def odd_integrand(q, x, y):
    c, d = (x+y)/2, (x-y)/2
    a, b = mp.sqrt(q+c*c), mp.sqrt(q+d*d)
    return kappa(a-d)*kappa(a+d)-kappa(b-c)*kappa(b+c)


def decimal(x):
    return mp.nstr(x, 65)


def run(dps):
    mp.mp.dps = dps
    nodes = list(map(mp.mpf, NODE_STRINGS))
    H = mp.matrix(len(nodes))
    max_estimate = mp.mpf('0')
    started = time.time()
    for i,x in enumerate(nodes):
        for j in range(i, len(nodes)):
            y=nodes[j]
            splits=sorted(set([mp.mpf('0'),x*y,mp.mpf('1'),mp.mpf('4'),mp.mpf(Q)]))
            value, estimate=mp.quad(lambda q: odd_integrand(q,x,y),splits,error=True,maxdegree=8)
            H[i,j]=H[j,i]=value
            max_estimate=max(max_estimate,estimate)
        print('precision',dps,'row',i+1,'seconds',round(time.time()-started,1),flush=True)
    weights=[1/mp.sqrt(H[i,i]) for i in range(len(nodes))]
    normalized=mp.matrix([[H[i,j]*weights[i]*weights[j] for j in range(len(nodes))] for i in range(len(nodes))])
    eig, vectors=mp.eigsy(normalized)
    # Exact term-ratio bound uniform for u>=0 (the positive-coordinate theta series).
    n0=mp.mpf(N+1)
    ratio=((n0+1)/n0)**4*mp.exp(-mp.pi*(2*n0+1))
    series_remainder=2*mp.pi**2*n0**4*mp.exp(-mp.pi*n0*n0)/(1-ratio)
    uniform_kappa=4*mp.pi**2*mp.exp(-mp.pi)
    integrated_series_error=4*Q*uniform_kappa*series_remainder
    a=mp.sqrt(Q)
    rate=2*mp.pi*mp.exp(a)-mp.mpf('4.5')
    tail_bound=64*mp.pi**4*mp.exp(mp.mpf('4.5')*a-2*mp.pi*mp.exp(a))*(a/rate+1/rate**2)
    return {'precision_digits':dps,'theta_terms':N,'q_cutoff':Q,'nodes':NODE_STRINGS,
            'raw_matrix':[[decimal(H[i,j]) for j in range(len(nodes))] for i in range(len(nodes))],
            'normalized_matrix':[[decimal(normalized[i,j]) for j in range(len(nodes))] for i in range(len(nodes))],
            'eigenvalues':[decimal(v) for v in eig],
            'weakest_vector':[decimal(vectors[i,0]) for i in range(len(nodes))],
            'mpmath_max_quadrature_estimate':decimal(max_estimate),
            'theta_series_uniform_error_bound':decimal(series_remainder),
            'integrated_theta_series_error_bound':decimal(integrated_series_error),
            'infinite_q_tail_error_bound':decimal(tail_bound),
            'elapsed_seconds':time.time()-started}


runs=[]
for precision in [45,70]:
    result=run(precision)
    runs.append(result)
    (HERE/f'theta-odd-{precision}digits.json').write_text(json.dumps(result,indent=2)+'\n')

mp.mp.dps=70
matrix_difference=max(abs(mp.mpf(runs[0]['normalized_matrix'][i][j])-mp.mpf(runs[1]['normalized_matrix'][i][j]))
                      for i in range(7) for j in range(7))
summary={'scope':'Finite high-precision diagnostic; explicit series/tail bounds, non-interval quadrature',
         'runs':runs,
         'max_precision_normalized_entry_difference':decimal(matrix_difference),
         'smallest_eigenvalue_difference':decimal(abs(mp.mpf(runs[0]['eigenvalues'][0])-mp.mpf(runs[1]['eigenvalues'][0])))}
(HERE/'theta-odd-high-precision.json').write_text(json.dumps(summary,indent=2)+'\n')
print('Smallest eigenvalue:',runs[-1]['eigenvalues'][0],flush=True)
print('Normalized entry convergence:',decimal(matrix_difference),flush=True)
