"""Zero-side run, jointly primitive tests for all primes p <= P (multiplier m_P(z) = prod (1 - p^{-1/2-z})).
Basis: half-sine modes v_j(t) = sqrt(2/T) e^{i w_j t} sin(pi t/T) on [0,T]; w_j = gc + 2 pi m_j/T.
Q(M v_j, M v_k) = sum_rho y_j(rho) conj y_k(J rho), y_j = m_P V_j, J rho = -conj rho.
Gram(M v_j, M v_k) = (1/2pi) int |m_P(i tau)|^2 V_j conj V_k d tau (trapezoid; band-limited integrand).
usage: run_zero.py <name: zeta|ea|nr> <T> <Nmax> <P> <out.json>"""
import sys, json, math, numpy as np, scipy.linalg as sla
from plib import primes_upto, mode_index
name, T, Nmax, P, out = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
gc = 85.7; H = 400.0
gam = np.array(json.load(open(__file__.rsplit('/', 1)[0] + '/zeta_zeros_330.json')))
mm = mode_index(Nmax); om = gc + 2 * np.pi * mm / T
lo, hi = om.min(), om.max()
assert hi + H < gam[-1] + 1, (hi + H, gam[-1])
g = np.concatenate([gam, -gam]); g = g[(g > lo - H) & (g < hi + H)]
if name == 'zeta':
    rho = 1j * g
elif name == 'ea':
    a = 0.2; rho = np.concatenate([1j * g + a, 1j * g - a])
elif name == 'nr':
    q, c = 2.0, 2.05
    b0 = math.acosh(c / 2) / math.log(q); kk = np.arange(-400, 400)
    t = (2 * kk + 1) * math.pi / math.log(q); t = t[(t > lo - H) & (t < hi + H)]
    rho = np.concatenate([1j * g, b0 + 1j * t, -b0 + 1j * t])
Jrho = -np.conj(rho)
ps = primes_upto(P).astype(float) if P >= 2 else np.array([])
def m(z):
    r = np.ones_like(z, dtype=complex)
    for p in ps: r *= 1 - p ** (-0.5 - z)
    return r
def Bf(z):
    return (1 - np.exp(-z * T)) / z
def V(z):   # [len(z), N]
    zz = z[:, None]
    return math.sqrt(2 / T) / 2j * (Bf(zz - 1j * (om[None, :] + math.pi / T)) - Bf(zz - 1j * (om[None, :] - math.pi / T)))
tau = np.arange(lo - H, hi + H, 0.02)
print(f"name={name} T={T} N={Nmax} P={P} zeros={len(rho)} grid={len(tau)}; planned: {len(tau)*Nmax*16/1e9:.3f} GB", flush=True)
Y = m(rho)[:, None] * V(rho); YJ = m(Jrho)[:, None] * V(Jrho)
Q = Y.T @ YJ.conj()
Yg = m(1j * tau)[:, None] * V(1j * tau)
G = (Yg.T @ Yg.conj()) * (0.02 / (2 * np.pi))
m2 = np.abs(m(1j * tau[(tau > lo) & (tau < hi)])) ** 2
res = {"name": name, "T": T, "P": P, "band": [lo, hi], "m2_min_band": float(m2.min()), "m2_max_band": float(m2.max()),
       "kronecker_min": float(np.prod((1 - ps ** -0.5) ** 2)), "kronecker_max": float(np.prod((1 + ps ** -0.5) ** 2)),
       "mean_m2": float(np.prod(1 + 1 / ps)), "rows": []}
for N in [n for n in (12, 25, 50, 100, 200) if n <= Nmax]:
    A = Q[:N, :N]; A = (A + A.conj().T) / 2; Gn = G[:N, :N]; Gn = (Gn + Gn.conj().T) / 2
    eg = np.linalg.eigvalsh(Gn); ev = sla.eigh(A, Gn, eigvals_only=True)
    row = {"N": N, "min": float(ev[0]), "max": float(ev[-1]), "neg": int((ev < -1e-6).sum()), "gram_min": float(eg[0]), "gram_max": float(eg[-1])}
    res["rows"].append(row); print(row, flush=True)
json.dump(res, open(out, 'w'), indent=1)
