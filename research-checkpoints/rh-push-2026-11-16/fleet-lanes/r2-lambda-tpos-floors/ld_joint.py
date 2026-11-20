# HEURISTIC large-deviation estimate (independent uniform phases) of the minimal deficit, for calibration against the enumerated minima
# and for the optimised joint measure of t0_config.json.
import numpy as np, json, math
from scipy.special import ive
from scipy.optimize import brentq
def primes(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0].astype(float)
P = primes(3000000); lp = np.log(P)
def ld(a, logN):
    a = a[a > 1e-14]
    I1I0 = lambda z: ive(1, z)/ive(0, z); logI0 = lambda z: np.log(ive(0, z)) + z
    f = lambda s: s*(a*I1I0(s*a)).sum() - logI0(s*a).sum() - logN
    s = brentq(f, 1e-3, 1e7); return a.sum() - (a*I1I0(s*a)).sum()
for h, exact in [(1.5, 0.179436), (1.5443, 0.165342), (1.6, 0.148538), (1.7, 0.121562)]:
    a = lp*P**(-(1+h)/2)
    print('single h=%.4f: k=30 LD(1e13,1e15)= %.4f %.4f  enumerated exact min %.4f | all primes<=3e6: %.4f %.4f  (sum a = %.3f)' % (
        h, ld(a[:30], math.log(1e13)), ld(a[:30], math.log(1e15)), exact, ld(a, math.log(1e13)), ld(a, math.log(1e15)), a.sum()))
c = json.load(open('t0_cert.json'))
v = sum(w*P**(-hh/2)*np.cos(x/2*lp) for hh, x, w in c['probes_float']); a = lp*P**-0.5*np.abs(v)
print('joint measure: k=30 LD = %.4f %.4f (enumerated 0.014937) | all primes: %.4f %.4f  (sum a = %.3f)' % (ld(a[:30], math.log(1e13)), ld(a[:30], math.log(1e15)), ld(a, math.log(1e13)), ld(a, math.log(1e15)), a.sum()))
