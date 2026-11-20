# T3: DH first-moment bracket.  B = int I(theta) d nu(theta),
#   I = 1 + (1/2)(P(w',th) + P(w'',th)) - kappa*Im(C(w',th) - C(w'',th)),  w'_p = conj(chi(p)) p^{-1/2}, w''_p = chi(p) p^{-1/2}
# minimise I over the torus T^P (multi-start L-BFGS), P = first n primes other than 5; compare with the proved bound 1 - kappa^2/pi_P.
import numpy as np, json, math
from scipy.optimize import minimize
rng = np.random.default_rng(3)
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1)
chi = {0: 0, 1: 1, 2: 1j, 3: -1j, 4: -1}
def primes(n):
    out = []; p = 2
    while len(out) < n:
        if all(p % q for q in range(2, int(p**0.5) + 1)) and p != 5: out.append(p)
        p += 1
    return out
def I(th, w1, w2, piP):
    e = np.exp(-1j*th); C1 = np.prod(1/(1 - w1*e)); C2 = np.prod(1/(1 - w2*e))
    return 1 + 0.5*piP*(abs(C1)**2 + abs(C2)**2) - kap*(C1.imag - C2.imag)
rows = []
for n in [1, 2, 3, 5, 10, 20, 50, 100, 167]:
    P = primes(n); r = np.array([p**-0.5 for p in P]); x = np.array([chi[p % 5] for p in P])
    w1 = np.conj(x)*r; w2 = x*r; piP = float(np.prod(1 - r**2))
    best = 1e9
    for _ in range(40 if n <= 50 else 12):
        res = minimize(I, rng.uniform(0, 2*np.pi, n), args=(w1, w2, piP), method='L-BFGS-B')
        best = min(best, res.fun)
    rows.append({'n': n, 'pmax': P[-1], 'pi_P': piP, 'min_I_found': float(best), 'proved_lower_bound': 1 - kap**2/piP})
    print(rows[-1], flush=True)
json.dump({'kappa': kap, 'kappa^2': kap**2, 'rows': rows}, open('t3_dh_bracket.json', 'w'), indent=1)
