"""Generate finite numerical Xi benchmarks for the Sign Switching page.

Requires Python 3, mpmath and numpy. No assumed-zero product is used.
Run from any directory. Output is finite quadrature evidence, not a certificate.
"""
from functools import lru_cache
from pathlib import Path
import json
import mpmath as mp
from numpy.polynomial.legendre import leggauss

ROOT = Path(__file__).resolve().parents[1]
WORKING_DIGITS = 40
CHECK_DIGITS = 65
mp.mp.dps = WORKING_DIGITS
A = mp.mpf('0.5')
INTERVALS = ['0', '.025', '.05', '.1', '.25', '.5', '1', '2', '4', '8']
SHIFTS = ['0', '.05', '.1', '.2', '.3', '.4', '.45', '.5']

def completed_and_prime(s):
    reflect = mp.re(s) < mp.mpf('.5')
    if reflect:
        s = 1-s
    if s == 1:
        value = mp.mpf('.5')
        derivative = (2+mp.euler-mp.log(4*mp.pi))/4
    else:
        base = mp.pi**(-s/2)*mp.gamma(s/2)/2
        zz = mp.zeta(s)
        zp = mp.zeta(s, derivative=1)
        b = s*(s-1)
        value = base*b*zz
        derivative = base*((2*s-1)*zz+b*zp+b*zz*(mp.digamma(s/2)-mp.log(mp.pi))/2)
    return value, -derivative if reflect else derivative

@lru_cache(maxsize=None)
def _xi_pair_cached(z, precision_bits):
    # mpmath differentiation and precision checks temporarily raise precision.
    # Caching only by z can return a previously rounded central value and make
    # a finite-difference second derivative catastrophically wrong.
    with mp.workprec(precision_bits):
        val, der = completed_and_prime(mp.mpf('.5')+1j*z)
        return val, 1j*der

def xi_pair(z):
    return _xi_pair_cached(z, mp.mp.prec)

def xi(z):
    return xi_pair(z)[0]

def xi_second_real(t):
    """Analytic Xi''(t) for real t, so s=1/2+it avoids removable s=0,1.

    Write xi(s)=B(s)b(s)zeta(s), B=pi^(-s/2)Gamma(s/2)/2 and
    b=s(s-1). Differentiate the product twice; Xi''(t)=-xi''(s).
    No finite difference or cached function value enters this derivative.
    """
    if mp.im(t):
        raise ValueError('xi_second_real requires real t')
    s = mp.mpf('.5')+1j*t
    base = mp.pi**(-s/2)*mp.gamma(s/2)/2
    zz = mp.zeta(s)
    zp = mp.zeta(s, derivative=1)
    zpp = mp.zeta(s, derivative=2)
    b = s*(s-1)
    log_prime = (mp.digamma(s/2)-mp.log(mp.pi))/2
    log_second = mp.polygamma(1,s/2)/4
    product = b*zz
    product_prime = (2*s-1)*zz+b*zp
    product_second = 2*zz+2*(2*s-1)*zp+b*zpp
    return -base*(product_second+2*log_prime*product_prime
                  +(log_prime**2+log_second)*product)

def diagonal(h,t):
    if not h:
        f, fp = xi_pair(t)
        return mp.re(fp**2-f*xi_second_real(t))
    f, fp = xi_pair(t+1j*h)
    return -mp.im(fp*mp.conj(f))/h

def omega(h,r):
    if not h:
        x = mp.pi*r/(2*A)
        return mp.pi**2*r*mp.sech(x)**2*mp.tanh(x)/(2*A*A)
    x = mp.pi*r/A
    eta = mp.pi*h/A
    return mp.pi*r*mp.sin(eta)*mp.sinh(x)/(A*h*(mp.cosh(x)+mp.cos(eta))**2)

def rule(order, interval_edges=INTERVALS):
    nodes, weights = leggauss(order)
    ans = []
    for left,right in zip(interval_edges[:-1],interval_edges[1:]):
        lo,hi = mp.mpf(left),mp.mpf(right)
        for x,w in zip(nodes,weights):
            ans.append(((lo+hi)/2+(hi-lo)*mp.mpf(str(x))/2,
                        (hi-lo)*mp.mpf(str(w))/2))
    return ans

def features(t, normalizer, quadrature):
    rows = []
    for r,w in quadrature:
        lo,lp = xi_pair(t-r+1j*A)
        hi,hp = xi_pair(t+r+1j*A)
        dl = -mp.im(lp*mp.conj(lo))/A
        dh = -mp.im(hp*mp.conj(hi))/A
        cross = mp.im(lo*mp.conj(hi))/(2*A*r)
        even = (dl+dh+2*cross)/(4*normalizer)
        odd = (dl+dh-2*cross)/(4*normalizer)
        if even < 0 or odd < 0:
            raise ArithmeticError('Negative boundary feature energy: do not clip it.')
        rows.append((r,w,even,odd))
    return rows

def integrate(rows,h):
    even = mp.fsum(w*omega(h,r)*e for r,w,e,o in rows)
    odd = mp.fsum(w*omega(h,r)*o for r,w,e,o in rows)
    mass = mp.fsum(w*omega(h,r) for r,w,e,o in rows)
    return even,odd,mass

# Regression for the original failure: warm the cache at ordinary precision,
# then compare the analytic derivative with independent uncached numerical
# differentiation at higher precision. Special xi(1) handling is unchanged.
xi_pair(mp.mpf(0))
origin_second = xi_second_real(mp.mpf(0))
with mp.workdps(CHECK_DIGITS):
    origin_second_independent = mp.diff(
        lambda z: completed_and_prime(mp.mpf('.5')+1j*z)[0], mp.mpf(0), 2)
    origin_derivative_error = abs(origin_second-origin_second_independent)
    # This also protects the precision-aware cache itself against regression.
    origin_second_cached = mp.diff(xi,mp.mpf(0),2)
    cache_derivative_error = abs(origin_second_cached-origin_second_independent)
if origin_derivative_error > mp.mpf('1e-35') or cache_derivative_error > mp.mpf('1e-55'):
    raise ArithmeticError('Xi second derivative precision regression failed.')

zero1 = mp.im(mp.zetazero(1))
zero2 = mp.im(mp.zetazero(2))
zero4 = mp.im(mp.zetazero(4))
stationary = mp.findroot(lambda t:mp.re(xi_pair(t)[1]),(15,16))
heights = [
    ('origin','Origin',mp.mpf(0)),
    ('near-first','Before the first zero',mp.mpf(14)),
    ('first-zero','First zero',zero1),
    ('first-stationary','Stationary point after the first zero',stationary),
    ('height-20','Height 20',mp.mpf(20)),
    ('second-zero','Second zero',zero2),
    ('height-27','Height 27',mp.mpf(27)),
    ('fourth-zero','Fourth zero',zero4),
]

fine_rule,coarse_rule = rule(24),rule(12)
tail_probe_rule = rule(12, ['8','10','12'])
cases=[]
for case_id,label,t in heights:
    normalizer = diagonal(A,t)
    assert normalizer > 0
    fine=features(t,normalizer,fine_rule)
    coarse=features(t,normalizer,coarse_rule)
    tail_probe=features(t,normalizer,tail_probe_rule)
    estimates=[]
    for hs in SHIFTS:
        h=mp.mpf(hs)
        if h==A:
            even,odd,mass=mp.mpf(1),mp.mpf(0),mp.mpf(1)
            ce,co,cm=even,odd,mass
            tail_even,tail_odd=mp.mpf(0),mp.mpf(0)
        else:
            even,odd,mass=integrate(fine,h)
            ce,co,cm=integrate(coarse,h)
            tail_even,tail_odd,_=integrate(tail_probe,h)
        direct=diagonal(h,t)/normalizer
        with mp.workdps(CHECK_DIGITS):
            precise_direct=diagonal(h,t)/diagonal(A,t)
        precision_change=abs(direct-precise_direct)
        if not all(mp.isfinite(v) for v in (even,odd,mass,direct,precision_change)):
            raise ArithmeticError(f'Nonfinite benchmark at {case_id}, h={h}')
        if even+odd <= 0:
            raise ArithmeticError(f'Nonpositive normalization at {case_id}, h={h}')
        estimates.append({
            'h':float(h),'even':float(even),'odd':float(odd),
            'difference':float(even-odd),'direct':float(direct),
            'identityResidual':float(abs(even-odd-direct)),
            'quadratureChange':float(max(abs(even-ce),abs(odd-co))),
            'directPrecisionChange':float(precision_change),
            'tailProbe8To12':float(max(abs(tail_even),abs(tail_odd))),
            'weightMass':float(mass),
            'margin':float((even-odd)/(even+odd)),
            'endpoint':h==A,
        })
    max_residual=max(row['identityResidual'] for row in estimates)
    if max_residual>1e-8:
        raise ArithmeticError(f'Unexpected reconstruction residual: {case_id}: {max_residual}')
    cases.append({
        'id':case_id,'label':label,'t':float(t),'heightDecimal':mp.nstr(t,32),
        'normalizer':float(normalizer),'normalizerDecimal':mp.nstr(normalizer,32),
        'estimates':estimates,
        'boundary':{'r':[float(r) for r,w,e,o in fine],
                    'quadratureWeights':[float(w) for r,w,e,o in fine],
                    'even':[float(e) for r,w,e,o in fine],
                    'odd':[float(o) for r,w,e,o in fine]},
    })
    print(case_id,'max normalized residual',f'{max_residual:.3e}',flush=True)

data={
    'schemaVersion':1,'status':'finite numerical illustration; not interval certified',
    'a':float(A),'precisionDigits':WORKING_DIGITS,'checkPrecisionDigits':CHECK_DIGITS,
    'integrationInterval':[0,8],
    'quadrature':{'method':'composite Gauss-Legendre','fineOrderPerInterval':24,
                  'coarseOrderPerInterval':12,'intervals':[float(x) for x in INTERVALS],
                  'nodePrecision':'NumPy float64 nodes and weights (about 15-16 decimal digits).',
                  'tailProbeInterval':[8,12],'tailProbeOrderPerInterval':12},
    'normalization':'Every energy and direct shear is divided by the positive P_a(t,t) for its height.',
    'method':'Direct completed-zeta formula with analytic first and second derivative formulas, using mpmath zeta derivatives. Cached values include working precision in the cache key. Direct targets are repeated at higher precision. Known zeros select display heights only; no zero product is used.',
    'arithmeticChecks':{
        'originSecondDerivative':mp.nstr(mp.re(origin_second),32),
        'originSecondDerivativeIndependentDifference':float(origin_derivative_error),
        'precisionAwareCacheDerivativeDifference':float(cache_derivative_error),
        'maxNormalizedDirectPrecisionChange':max(e['directPrecisionChange'] for c in cases for e in c['estimates']),
        'maxNormalizedIdentityResidual':max(e['identityResidual'] for c in cases for e in c['estimates']),
        'maxNormalizedQuadratureChange':max(e['quadratureChange'] for c in cases for e in c['estimates']),
        'maxNormalizedTailProbe8To12':max(e['tailProbe8To12'] for c in cases for e in c['estimates']),
    },
    'limitations':'Quadrature refinement, precision comparisons, and identity residuals are diagnostics, not rigorous error bounds. The integration uses r in [0,8]; the extra [8,12] probe is not a bound on the infinite omitted tail. Quadrature nodes and weights are float64 even though function arithmetic has higher precision. Only the listed heights and shifts were computed. h=a is a point-mass limit, not an ordinary density.',
    'cases':cases,
}
path=ROOT/'src/data/sign-switching-xi.json'
path.parent.mkdir(parents=True,exist_ok=True)
path.write_text(json.dumps(data,separators=(',',':'))+'\n')
print('SAVED',path,path.stat().st_size,'bytes',flush=True)
