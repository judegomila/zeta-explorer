import numpy as np, math
from scipy.optimize import brentq
from scipy.integrate import quad
X = 20_000_000
sieve = np.ones(X + 1, bool); sieve[:2] = False
for i in range(2, int(X ** 0.5) + 1):
    if sieve[i]: sieve[i * i::i] = False
p = np.nonzero(sieve)[0].astype(float)
q = p[(p % 5 == 2) | (p % 5 == 3)]
kap = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
target = math.pi - 2 * math.atan(kap)
def S(sig):
    from scipy.special import exp1
    tail = float(exp1((sig - 1) * math.log(X)))
    return float(np.sum(2 * np.arctan(q ** (-sig)))) + tail
print('target', target, flush=True)
print('sup Re of zeros over the full torus (all primes):', brentq(lambda s: S(s) - target, 1.01, 2.0, xtol=1e-12), flush=True)
for P in (7, 13, 17, 23, 37, 43, 47, 97, 997, 10007):
    qq = q[q <= P]
    f = lambda s: float(np.sum(2 * np.arctan(qq ** (-s)))) - target
    print(P, 'x_sup =', brentq(f, 0.0, 3.0) - 0.5 if f(0.0) > 0 else None, flush=True)
print('P=3 sum at 1/2:', float(np.sum(2 * np.arctan(q[q <= 3] ** -0.5))), ' P=7:', float(np.sum(2 * np.arctan(q[q <= 7] ** -0.5))))
