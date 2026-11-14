#!/usr/bin/env python3
"""Independent arbitrary-precision checks for the theta comparison.

Run: python scripts/experiments/theta-reference.py dist/experiments/zero-confinement-theta.json
Uses mpmath rather than the JavaScript contour quadrature. Writes independent checks into the selected report.
Numerical error/convergence estimates here are not interval certificates.
"""
import json
import sys
import time
from functools import lru_cache
from pathlib import Path

import mpmath as mp

PATH = Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/zeta-theta-comparison.json')
START = time.perf_counter()
mp.mp.dps = 60
CUTOFF = mp.mpf('1.5')
BREAKS = [mp.mpf(x) for x in ['0', '.15', '.3', '.5', '.75', '1', '1.5']]


@lru_cache(maxsize=30000)
def phi(u):
    e4, e5, e9 = mp.exp(4*u), mp.exp(5*u), mp.exp(9*u)
    return mp.fsum((2*mp.pi**2*n**4*e9-3*mp.pi*n*n*e5)*mp.exp(-mp.pi*n*n*e4)
                   for n in range(1, 13))


def real_heat(t, tau, derivative=0):
    """F_tau(1/2+it), its t derivative, or its s second derivative."""
    if derivative == 1:
        return mp.quad(lambda u: -16*u*mp.exp(tau*u*u)*phi(u)*mp.sin(2*t*u), BREAKS)
    if derivative == 2:
        return mp.quad(lambda u: 32*u*u*mp.exp(tau*u*u)*phi(u)*mp.cos(2*t*u), BREAKS)
    return mp.quad(lambda u: 8*mp.exp(tau*u*u)*phi(u)*mp.cos(2*t*u), BREAKS)


def xi(s):
    return s*(s-1)*mp.power(mp.pi, -s/2)*mp.gamma(s/2)*mp.zeta(s)/2


def digits(x):
    return mp.nstr(x, 52)


report = json.loads(PATH.read_text())
report['scope']['transverseInterpretation'] = ('The seeds lie on the symmetry line and analytic Newton evolution preserves that symmetry in these runs. Zero computed transverse excursion is not an independent exclusion of off-line zeros or a proof that no untracked branch exists.')
checks = []
print('Independent unshifted theta quadrature: 60 decimal digits, 12 terms, cutoff 1.5.', flush=True)
for run in report['runs']:
    tau = mp.mpf(str(run['tauEnd']))
    for root in run['frames'][-1]['roots']:
        begin = time.perf_counter()
        guess = mp.mpf(str(root['t']))
        target = lambda t: real_heat(t, tau)
        reference = mp.findroot(target, (guess-mp.mpf('1e-5'), guess+mp.mpf('1e-5')),
                                tol=mp.mpf('1e-51'), maxsteps=15, verify=True)
        value = target(reference)
        dt = real_heat(reference, tau, 1)
        dss = real_heat(reference, tau, 2)
        # Fs = -i Ft on the critical line; rho'_tau = -Fss/(4Fs).
        imaginary_velocity = -dss/(4*dt)
        error = guess-reference
        at_js = target(guess)
        item = {
            'tau': float(tau), 'branch': root['branch'], 'javascriptHeight': root['t'],
            'referenceHeight': digits(reference), 'javascriptMinusReference': digits(error),
            'referenceValueResidual': digits(abs(value)),
            'referencePositionalResidual': digits(abs(value/dt)),
            'independentResidualAtJavascriptRoot': digits(abs(at_js/dt)),
            'referenceTDerivative': digits(dt), 'referenceSecondSDerivative': digits(dss),
            'referenceImaginaryVelocity': digits(imaginary_velocity),
            'referenceCondition': digits(abs(dt)/(abs(dt)+abs(dss))),
            'elapsedSeconds': time.perf_counter()-begin,
        }
        checks.append(item)
        print(json.dumps(item), flush=True)

initial = [{'branch': k, 'referenceHeight': digits(mp.im(mp.zetazero(k+1)))} for k in range(3)]
verification = {
    'method': 'mpmath arbitrary-precision unshifted positive-real-axis theta quadrature; secant roots',
    'mpmathVersion': mp.__version__, 'decimalDigits': mp.mp.dps,
    'thetaTerms': 12, 'integrationCutoff': float(CUTOFF),
    'integrationBreaks': [float(x) for x in BREAKS],
    'initialZetaZeroReferences': initial, 'endpoints': checks,
    'maxAbsoluteHeightDiscrepancy': max(abs(float(c['javascriptMinusReference'])) for c in checks),
    'certified': False,
    'scope': 'Checks the three real-line endpoint roots independently. Does not prove absence of other zeros or certify every trajectory segment. The same rapidly convergent theta representation is evaluated without contour shifting and in arbitrary precision; truncation is explicit.',
}
report['independentVerification'] = verification
PATH.write_text(json.dumps(report, indent=2))
print('Endpoint checks saved; computing a whole-contour estimate.', flush=True)

begin = time.perf_counter()
radius = mp.mpf('.35')
center_t = mp.mpf(str(report['scope']['contourCenter']['t']))
center = mp.mpc('.5', center_t)
nodes = 1024
boundary = [abs(xi(center+radius*mp.exp(2j*mp.pi*k/nodes))) for k in range(nodes)]
minimum = min(boundary)
minimum_index = boundary.index(minimum)
# For the whole disk |Re(s)-1/2|<=r:
# |F0'(s)| <= 16 int_0^infty u Phi(u) cosh(2ru)du = L.
# Every point of the circle is within chord distance 2r sin(pi/(2N))
# of a node, with the joining segment inside that disk.
derivative_bound = mp.quad(lambda u: 16*u*phi(u)*mp.cosh(2*radius*u), BREAKS)
chord = 2*radius*mp.sin(mp.pi/(2*nodes))
full_boundary_lower = minimum-derivative_bound*chord
intervals = []
for text in ['.01', '.02', '.05', '.1', '.2']:
    delta = mp.mpf(text)
    # Positivity of Phi on u>=0 and |cosh(2(s-1/2)u)|<=cosh(2ru)
    # give this uniform perturbation bound for EVERY |tau|<=delta.
    perturbation = mp.quad(lambda u: 8*phi(u)*mp.expm1(delta*u*u)*mp.cosh(2*radius*u), BREAKS)
    negative_only = mp.quad(lambda u: -8*phi(u)*mp.expm1(-delta*u*u)*mp.cosh(2*radius*u), BREAKS)
    intervals.append({'deltaTau': float(delta), 'uniformPerturbationBoundEstimate': digits(perturbation),
                      'negativeTimeOnlyBoundEstimate': digits(negative_only),
                      'roucheGapEstimate': digits(full_boundary_lower-perturbation),
                      'nominalStrictInequality': bool(full_boundary_lower>perturbation), 'certified': False})

report['analyticContourEstimate'] = {
    'radius': float(radius), 'center': {'sigma': .5, 't': float(center_t)},
    'boundaryNodes': nodes, 'initialMinimumSampleEstimate': digits(minimum),
    'minimumSampleIndex': minimum_index,
    'uniformInitialDerivativeBoundEstimate': digits(derivative_bound),
    'maximumDistanceToSample': digits(chord),
    'wholeBoundaryLowerBoundEstimate': digits(full_boundary_lower),
    'formulas': {
        'derivativeBound': 'L = 16 integral_0^infinity u Phi(u) cosh(2ru) du',
        'boundaryLowerBound': 'inf_|s-c|=r |F0(s)| >= min_nodes |F0(s_j)| - L*2r*sin(pi/(2N))',
        'uniformPerturbation': 'sup_|s-c|=r,|tau|<=delta |Ftau(s)-F0(s)| <= 8 integral_0^infinity Phi(u) (exp(delta*u^2)-1) cosh(2ru) du',
    },
    'intervals': intervals,
    'proofOfFormulas': 'Phi(u)>0 for u>=0 since each summand pi*n^2*exp(5u)*(2*pi*n^2*exp(4u)-3)*exp(-pi*n^2*exp(4u)) is positive. Bound cosh/sinh by cosh of the real part, apply |exp(tau*u^2)-1|<=exp(delta*u^2)-1, and apply the mean-value integral along the chord inside the disk. Formulas control every boundary point, unlike the raw sampled margin.',
    'certified': False,
    'limitation': 'The inequalities are analytic. Their numeric integrals and boundary values here use high-precision floating-point quadrature, finite theta truncation, and no interval arithmetic. Positive nominal gaps are candidates for certification, not certified Rouche barriers or a proof of the initial zero count.',
    'elapsedSeconds': time.perf_counter()-begin,
}
report['timings']['independentPythonSeconds'] = time.perf_counter()-START
PATH.write_text(json.dumps(report, indent=2))
print(json.dumps(report['analyticContourEstimate']), flush=True)
print('Saved', str(PATH), 'in', report['timings']['independentPythonSeconds'], 'seconds.', flush=True)
