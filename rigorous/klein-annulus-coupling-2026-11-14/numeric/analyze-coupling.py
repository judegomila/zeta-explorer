"""Finite quotient/coupling audit. No interval or infinite-domain certification.

Run sample-app.mjs first, then: python3 analyze-coupling.py
Dependencies: numpy, scipy, mpmath. Outputs coupling-results.json.
"""
from pathlib import Path
import json
import math
import numpy as np
import scipy
from scipy.integrate import quad
from scipy.special import ellipk, logsumexp
import mpmath as mp

HERE = Path(__file__).resolve().parent
samples = json.loads((HERE / 'app-samples.json').read_text())
mp.mp.dps = 70


def matrix(rows):
    return np.array([[complex(z['re'], z['im']) for z in row] for row in rows])


def invsqrt(a):
    values, vectors = np.linalg.eigh(a)
    if values.min() <= 1e-12 * max(1., values.max()):
        return None
    return (vectors / np.sqrt(values)) @ vectors.conj().T


def coupling(q):
    n = len(q) // 2
    c, a, b = q[:n, :n], q[n:, n:], q[n:, :n]
    ca, aa = invsqrt(c), invsqrt(a)
    if ca is None or aa is None:
        return {'valid': False, 'reason': 'A or C is not resolved positive definite',
                'A_eigenvalues': np.linalg.eigvalsh(a).tolist(),
                'C_eigenvalues': np.linalg.eigvalsh(c).tolist()}
    sing = np.linalg.svd(aa @ b @ ca, compute_uv=False)
    rho = float(sing[0])
    effective = a - b @ np.linalg.solve(c, b.conj().T)
    return {'valid': True, 'rho': rho, 'normalized_schur_margin': 1-rho*rho,
            'coupling_singular_values': sing.tolist(),
            'raw_cross_norm': float(np.linalg.norm(b, 2)),
            'A_condition': float(np.linalg.cond(a)), 'C_condition': float(np.linalg.cond(c)),
            'effective_min_eigenvalue': float(np.linalg.eigvalsh(effective).min()),
            'full_min_eigenvalue': float(np.linalg.eigvalsh(q).min())}


sc = np.array([[.3, .2+.1j], [0, 3]])
sa = np.array([[2, .1-.3j], [.1, .4]])
s = np.zeros((4, 4), dtype=complex)
s[:2, :2], s[2:, 2:] = sc, sa
results = []
for case in samples['gram']:
    if not case['valid']:
        results.append({'name': case['name'], 'valid': False, 'reason': case.get('reason')})
        continue
    q = matrix(case['matrix'])
    base, changed, conjugated = coupling(q), coupling(s.conj().T @ q @ s), coupling(q.conj())
    row = {'name': case['name'], 'state': case['state'], **base}
    if base['valid']:
        row.update({'block_congruence_rho': changed['rho'], 'conjugation_rho': conjugated['rho'],
                    'block_congruence_error': abs(base['rho']-changed['rho']),
                    'conjugation_error': abs(base['rho']-conjugated['rho']),
                    'changed_raw_cross_norm': changed['raw_cross_norm']})
        assert row['block_congruence_error'] < 2e-8
        assert row['conjugation_error'] < 2e-12
        # Duplicate orientable-cover bookkeeping with the same block split.
        z = np.zeros_like(q)
        cover = np.block([[q, z], [z, q.conj()]])
        ordering = [0, 1, 4, 5, 2, 3, 6, 7]
        row['duplicated_cover_rho'] = coupling(cover[np.ix_(ordering, ordering)])['rho']
        assert abs(row['duplicated_cover_rho']-base['rho']) < 2e-10
        if case.get('pick'):
            pick = coupling(matrix(case['pick']))
            row['pick_rho'] = pick['rho'] if pick['valid'] else None
            if pick['valid']:
                assert abs(pick['rho']-base['rho']) < 1e-8
    results.append(row)


def xi(s):
    if s in (0, 1):
        return mp.mpf('.5')
    return s*(s-1)*mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)/2


def mp_invsqrt(a):
    d, u = mp.eighe(a)
    assert min(d) > 0
    return u * mp.diag([1/mp.sqrt(x) for x in d]) * u.H


def mp_xi_case(case):
    st = case['state']
    nodes = [mp.mpf(x) for x in st['researchNodes'].split(',')]
    n = len(nodes)
    if st.get('researchKernel') == 'logPick':
        vals = [mp.diff(xi, mp.mpf('.5')+x)/xi(mp.mpf('.5')+x) for x in nodes]
        q = mp.matrix([[(vals[i]+vals[j])/(nodes[i]+nodes[j]) for j in range(n)] for i in range(n)])
    else:
        t, a, x = [mp.mpf(str(st[k])) for k in ('researchT', 'researchA', 'researchNodeImag')]
        u = [x+1j*(t+h) for h in nodes]
        plus = [xi(mp.mpf('.5')+v+a) for v in u]
        minus = [xi(mp.mpf('.5')+v-a) for v in u]
        q = mp.matrix([[(plus[i]*mp.conj(plus[j])-minus[i]*mp.conj(minus[j])) /
                        (2*mp.pi*(u[i]+mp.conj(u[j]))) for j in range(n)] for i in range(n)])
    weights = [1/mp.sqrt(mp.re(q[i, i])) for i in range(n)]
    q = mp.matrix([[q[i,j]*weights[i]*weights[j] for j in range(n)] for i in range(n)])
    c, a, b = q[:2, :2], q[2:, 2:], q[2:, :2]
    whitened = mp_invsqrt(a)*b*mp_invsqrt(c)
    eigen, _ = mp.eighe(whitened*whitened.H)
    rho = mp.sqrt(max(eigen))
    eigen_full, _ = mp.eighe(q)
    app = matrix(case['matrix'])
    error = max(abs(q[i,j]-mp.mpc(app[i,j])) for i in range(n) for j in range(n))
    return {'name': case['name'], 'precision_digits': mp.mp.dps,
            'rho': mp.nstr(rho, 45), 'normalized_schur_margin': mp.nstr(1-rho*rho, 45),
            'full_min_eigenvalue': mp.nstr(min(eigen_full), 45),
            'max_app_matrix_error': mp.nstr(error, 15)}


high_precision = [mp_xi_case(c) for c in samples['gram'] if c['state']['researchSource'] == 'xi']

reference = []
for r in [1.15, 1.2, 1.6, 2., 3.]:
    m = r**-4
    K, Kprime = ellipk(m), ellipk(1-m)
    k = math.pi/(2*K)
    q = k*Kprime
    rho1 = 1/math.cosh(q)
    reference.append({'r':r, 'm':m, 'circumference':4*K, 'width':Kprime,
                      'kappa1_width':q, 'rho_zero_mode':1., 'rho_first_mode':rho1,
                      'rho_second_mode':1/math.cosh(2*q),
                      'nonconstant_relative_schur_margin':1-rho1*rho1})


# Actual theta primitive used in the separate half-line parity comparison.
# kappa(v)=Phi(v/4); terms are positive for v>=0 and reflected evenly.
n = np.arange(1., 13.)


def log_kappa(v):
    v = abs(float(v))
    if v > 700:
        return -math.inf
    ev = math.exp(v)
    terms = (math.log(math.pi)+2*np.log(n)+np.log(2*math.pi*n*n*ev-3)
             +1.25*v-math.pi*n*n*ev)
    return float(logsumexp(terms))


def odd_integrand(sq, x, y, tau):
    if sq == 0:
        return 0.
    c, d = (x+y)/2, (x-y)/2
    a, b = math.sqrt(sq+c*c), math.sqrt(sq+d*d)
    same = log_kappa(a-d)+log_kappa(a+d)
    cross = log_kappa(b-c)+log_kappa(b+c)
    heat = tau*(2*sq+x*x+y*y)/16
    if same+heat < -745:
        return 0.
    return math.exp(same+heat)*(-math.expm1(cross-same))


theta_ordering = []
for tau in [-.3, 0., .5]:
    for x,y in [(.15,.35),(.35,.7),(.7,1.2),(.15,1.2),(1.2,2.)]:
        value, err = quad(lambda z: odd_integrand(z,x,y,tau), 0, math.inf,
                          epsabs=1e-20, epsrel=3e-11, limit=150)
        # Direct integral comparison, performed separately from subtraction.
        def h0(x,y):
            c,d=(x+y)/2,(x-y)/2
            def integrand(z):
                a=math.sqrt(z+c*c)
                logv=log_kappa(a-d)+log_kappa(a+d)+tau*(2*z+x*x+y*y)/16
                return math.exp(logv) if logv > -745 else 0.
            return quad(integrand,0,math.inf,epsabs=1e-20,epsrel=3e-11,limit=150)[0]
        same,cross=h0(x,y),h0(x,-y)
        theta_ordering.append({'x':x,'y':y,'tau':tau,'H_same':same,'H_cross':cross,
                               'H_odd':value,'estimated_quadrature_error':err,
                               'separate_subtraction_error':value-(same-cross)})
        assert value > 0 and same > cross
        assert abs(value-(same-cross)) < 1e-12*max(same,1e-12)

theta_gram=[]
for nodes in [[.15,.35,.7,1.2],[.15,.3,.45,.6,.75,.9,1.05]]:
    H=np.array([[quad(lambda z:odd_integrand(z,x,y,0.),0,math.inf,
                     epsabs=1e-23,epsrel=1e-11,limit=200)[0] for y in nodes] for x in nodes])
    d=np.sqrt(np.diag(H))
    normalized=H/d[:,None]/d[None,:]
    eigen,vectors=np.linalg.eigh(normalized)
    tolerance=1e-9*max(1.,abs(eigen).max())
    theta_gram.append({'nodes':nodes,'tau':0.,'matrix':normalized.tolist(),
                       'eigenvalues':eigen.tolist(),'weakest_vector':vectors[:,0].tolist(),
                       'display_tolerance':tolerance,
                       'smallest_sign_resolved_at_display_tolerance':bool(eigen[0]>tolerance)})

out = {'scope':'Finite floating-point/multiprecision audits; not interval certificates or global bounds.',
       'versions':{'numpy':np.__version__,'scipy':scipy.__version__,'mpmath':mp.__version__},
       'normalized_coupling':results, 'independent_xi_70digit':high_precision,
       'annulus_reference':reference, 'theta_half_line_ordering':theta_ordering,
       'theta_half_line_gram':theta_gram,
       'boundary_energy':samples['energy'], 'boundary_parity':samples['boundaryParity'],
       'quotient_pullback':samples['quotientPullback']}
(HERE/'coupling-results.json').write_text(json.dumps(out,indent=2)+'\n')
for row in results:
    print(row['name'], 'rho='+str(row.get('rho')), 'margin='+str(row.get('normalized_schur_margin')))
print('Annulus reference:', [(d['r'],round(d['rho_first_mode'],9)) for d in reference])
print('Independent 70-digit checks:',len(high_precision))
print('Theta half-line ordering checks:',len(theta_ordering))
