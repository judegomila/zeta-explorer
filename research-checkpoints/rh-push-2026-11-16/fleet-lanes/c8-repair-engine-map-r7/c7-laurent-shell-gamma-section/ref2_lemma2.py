# Second-referee check of Lemma 2 (gamma-coupled sections), zeta, monomial m not used by the lane or the first referee.
# m(w) = c * prod w_p^{kappa_p}  ->  m((p^{-it})) = c * q^{-it},  q = prod p^{kappa_p}.  Poles: X(1/2+it) c q^{-it} = 1.
# Lemma 2 prediction: 1 + conj(c * [coefficient of w^{-kappa} in F_P]) = 1 + conj(c) n^{-1/2} if q = 1/n, n integer; else 1.
# Pole location: Newton on the phase with Stirling theta (error < 1e-12 at t > 4000); zeta by python-flint (64 bit).
# Planned memory: arrays of < 2e5 float64 (< 10 MB).
import math, cmath, sys
import numpy as np
from flint import acb, ctx
ctx.prec = 64
def theta(t): return t/2*np.log(t/(2*math.pi)) - t/2 - math.pi/8 + 1/(48*t) + 7/(5760*t**3)
def dtheta(t): return 0.5*np.log(t/(2*math.pi)) - 1/(48*t*t)
def run(c, q, pred, lab, t0=4000.0, deltas=(1e-3, 3e-4)):
    a = cmath.phase(c); lq = math.log(q); tmax = t0 + 30/min(deltas)
    # phase of U: phi(t) = -2 theta(t) + a - t log q ; decreasing when log(t/2pi) + log q > 0
    phi = lambda t: -2*theta(t) + a - t*lq
    dphi = lambda t: -2*dtheta(t) - lq
    j_hi = math.floor(phi(t0)/(2*math.pi)); j_lo = math.ceil(phi(tmax)/(2*math.pi))
    js = np.arange(j_hi, j_lo - 1, -1.0)
    # initial guess by inverting on a grid
    grid = np.linspace(t0, tmax, 400001); pg = phi(grid)
    x = np.interp(-2*math.pi*js, -pg, grid)
    for _ in range(6): x = x - (phi(x) - 2*math.pi*js)/dphi(x)
    assert np.all(np.abs(phi(x) - 2*math.pi*js) < 1e-9) and np.all(dphi(x) < 0)
    r = 2/np.abs(dphi(x))
    v = np.empty(len(x), dtype=complex)
    for i, y in enumerate(x):
        z = acb(0.5, float(y)).zeta(); v[i] = complex(float(z.real.mid()), float(z.imag.mid()))
    print(lab, '| poles', len(x), '| predicted', pred)
    for d in deltas:
        w = r*np.exp(-d*(x - t0)); print('   delta', d, 'S/S1 =', (w*v).sum()/w.sum(), '|diff| = %.5f' % abs((w*v).sum()/w.sum() - pred))
    # twist by a prime outside P (q0 = 5): mean of F q0^{+i gamma} -> q0^{-1/2}
    d = min(deltas); w = r*np.exp(-d*(x - t0))
    print('   twist 5^{+i gamma}: ', (w*v*np.exp(1j*x*math.log(5))).sum()/w.sum(), ' predicted', 5**-0.5)
    sys.stdout.flush()
c = cmath.exp(0.7j)
run(c, 1/6, 1 + c.conjugate()*6**-0.5, 'm = e^{0.7i} conj(w_2 w_3)  (q = 1/6)')
run(c, 2/3, 1.0, 'm = e^{0.7i} conj(w_2) w_3  (q = 3/2... non-integral 1/q)') if False else run(c, 3/2, 1.0, 'm = e^{0.7i} w_3 conj(w_2)^{-1}: q = 3/2, 1/q not an integer')
run(c, 1/4, 1 + c.conjugate()*4**-0.5, 'm = e^{0.7i} conj(w_2)^2  (q = 1/4)')
