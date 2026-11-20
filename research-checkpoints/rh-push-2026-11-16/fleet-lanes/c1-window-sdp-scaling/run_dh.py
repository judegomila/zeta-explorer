"""Calibration on Davenport-Heilbronn, where the answer is known: the off-line quartet (delta, gamma) = (0.30852, 85.6993) exists.
Prime side: c_DH(n) from -f'/f, f = sum a(n) n^-s, a mod 5 = (0, 1, kap, -kap, -1).  Explicit formula (CLASSICAL, odd character mod 5, no pole):
  sum_{Im rho > 0} Bhat(.) = (1/2pi) int Bhat(s - t_j) [log(5/pi) + Re psi(3/4 + i s/2)] ds - 2 sum c(n) n^-1/2 B(log n) cos(t_j log n).
LP: window model as in run_cg.py with column generation. Questions: (a) is 'all zeros in the window on the line' feasible? (must be NO)
(b) for which delta is 'one quartet at height gamma_0 + others on the line' feasible? (must contain 0.3085)"""
import numpy as np, sys, json
from scipy.optimize import linprog
from scipy.special import digamma
from lib import *; from lp import kern
kap = 0.28407904384041229603; g0 = 85.699348485377592172; d0 = 0.30851718245663738555
L = float(sys.argv[1]); m = 3; Wt, Wm = 5.0, 35.0; eta = 1e-5; cslack = 7.0
N = int(np.exp(L)); a = np.zeros(N+1); a[1::5] = 1; a[2::5] = kap; a[3::5] = -kap; a[4::5] = -1
inv = np.zeros(N+1); inv[1] = 1                                   # Dirichlet inverse of a
for n in range(2, N+1):
    s = 0.0
    for d in range(1, int(n**0.5)+1):
        if n % d == 0:
            if d > 1: s += a[d]*inv[n//d]
            e = n//d
            if e != d and e > 1: s += a[e]*inv[d]
    inv[n] = -s                     # d = 1 gives e = n: the a[n]*inv[1] term is already in s
al = a*np.log(np.maximum(np.arange(N+1), 1)); c = np.zeros(N+1)
for d in range(1, N+1):
    k = np.arange(1, N//d+1); c[d*k] += al[d]*inv[k]
print('c(2) =', c[2], ' kap ln 2 =', kap*np.log(2), ' c(6) =', c[6], '(route-30: 1.93635607662)')
tj = np.arange(-Wt, Wt+1e-9, np.pi/(2*L)); n = np.arange(2, N+1); ln = np.log(n)
s = np.arange(-400, 400, 0.002)
arch = np.array([np.trapezoid(Bhat(s, L, m)*(np.log(5/np.pi) + digamma(0.75 + 0.5j*(g0+t+s)).real), s)/(2*np.pi) for t in tj])
b = arch - 2*(np.cos((g0 + tj)[:, None]*ln[None, :]) @ (c[2:]/np.sqrt(n)*B(ln, L, m)))
dens = np.log(5*g0/(2*np.pi))/(2*np.pi); aa = L/(2*m); tail0 = 3*dens*(Wm-Wt)**(1-2*m)/(aa**(2*m)*(2*m-1)); E = 2*Wm*dens; J = len(tj)
tf = np.arange(-Wm, Wm+1e-9, 0.004); KF = kern(tj, tf, 0.0, L, m)
print(f'## DH gamma0={g0:.4f} L={L} N={N} J={J} dens={dens:.3f} L*~{np.pi*dens:.2f}', flush=True)
def solve(delta, tq=0.0):
    Q = np.zeros(J) if delta is None else 2*Bhat(tq - tj + 1j*delta, L, m).real; qm = 0.0 if delta is None else 2.0
    A = KF; nA = A.shape[1]
    Aub = np.vstack([np.hstack([A, -np.ones((J, 1))]), np.hstack([-A, -np.ones((J, 1))]), np.hstack([np.ones((1, nA)), [[0.0]]]), np.hstack([-np.ones((1, nA)), [[0.0]]])])
    bub = np.concatenate([b + eta - Q, -(b - tail0 - eta - Q), [E + cslack - qm], [-(E - cslack - qm)]])
    cc = np.zeros(nA+1); cc[-1] = 1
    r = linprog(cc, A_ub=Aub, b_ub=bub, bounds=[(0, None)]*(nA+1), method='highs'); assert r.status == 0
    return r.x[-1]
res = {'all on line': solve(None)}
for delta in (0.05, 0.15, 0.25, 0.29, 0.30, d0, 0.32, 0.33, 0.37, 0.45):
    res[f'{delta:.4f}'] = solve(delta)
res['true delta, height shifted by 0.3'] = solve(d0, 0.3)
for k, v in res.items(): print(f'  M1 + quartet delta={k}: s* = {v:.3e}  ->', 'feasible' if v <= 1e-9 else 'INFEASIBLE')
json.dump(dict(L=L, res=res), open(f'dh_{L:g}.json', 'w'), indent=1, default=float)
