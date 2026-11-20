"""q(x,t) = log|gamma(1/2+x+it)/gamma(1/2-x+it)| / x - log(t/2pi), gamma(s)=pi^{-s/2}Gamma(s/2).
Theorem A needs q >= -eps(t).  float64 grid check, not a proof."""
import numpy as np, math, json, sys
from scipy.special import loggamma
def lg(s): return loggamma(s / 2) - (s / 2) * math.log(math.pi)
xs = np.concatenate([np.logspace(-4, 0, 60), np.linspace(1.3, 400, 800)])
res = {}
for t in (7.0, 10.0, 30.0, 100.0, 1e3, 1e4, 1e5, 1e6):
    s1 = 0.5 + xs + 1j * t; s0 = 0.5 - xs + 1j * t
    q = (lg(s1).real - lg(s0).real) / xs - math.log(t / (2 * math.pi))
    res[t] = (float(q.min()), float(xs[q.argmin()]), float(q.min() * t * t))
    print(t, res[t])
json.dump(res, open(sys.argv[1], 'w'), indent=1)
