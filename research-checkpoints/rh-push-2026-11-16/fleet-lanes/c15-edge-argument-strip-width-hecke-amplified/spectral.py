# P4: spectral form of the amplified norm. In units |B|^2 = 1, f = E(z, s'), s' = 1/2 + mu0, mu0 = delta/2 - i gamma/2, phi(s') = 0.
# G_mn(T) = (1/4pi) int |c(t)|^2 tau_it(m) tau_it(n) dt + (3/pi) |T^(s'-1)/(s'-1)|^2 tau_half(m) tau_half(n)
# c(t) = T^mu0 [ T^(-it)/(mu0 - it) + phi(1/2 - it) T^(it)/(mu0 + it) ]
# Planned allocation: nodes ~ 1.3e5 doubles x (N+4) arrays < 20 MB.
import json, os, sys, math
import numpy as np, mpmath as mp
mp.mp.dps = 15
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'spectral.json')
TMAX = 1200.0
gamma = float(mp.zetazero(1).imag); t0 = gamma/2
def panels(etas):
    bp = set(np.arange(0.0, TMAX+1e-9, 0.25).tolist())
    for eta in etas:
        k = 0
        while eta*2**k < 0.25:
            bp.add(t0+eta*2**k); bp.add(t0-eta*2**k); k += 1
    bp.add(t0)
    return np.array(sorted(b for b in bp if 0 <= b <= TMAX))
xg, wg = np.polynomial.legendre.leggauss(8)
bp = panels([0.25, 0.05, 0.015])
a = bp[:-1]; b = bp[1:]
t = ((a+b)/2)[:, None] + ((b-a)/2)[:, None]*xg[None, :]
w = ((b-a)/2)[:, None]*wg[None, :]
t = t.ravel(); w = w.ravel()
print('nodes', t.size, 'planned MB', t.size*8*40/1e6, flush=True)
# phi(1/2+it) = conj(X)/X, X = xi(1+2it)
ph = np.empty(t.size, dtype=complex)
for i, ti in enumerate(t):
    X = mp.exp(mp.loggamma(mp.mpc(0.5, ti)) - mp.mpc(0.5, ti)*mp.log(mp.pi))*mp.zeta(mp.mpc(1, 2*ti))
    X = complex(X/abs(X)); ph[i] = X.conjugate()/X
print('phi done', flush=True)
def tau_it(n, tt):
    v = np.zeros(tt.size)
    for a_ in range(1, n+1):
        if n % a_ == 0: v += np.cos(tt*math.log(a_*a_/n))
    return v
def tau_c(n, nu):
    return sum((a_*a_/n)**nu for a_ in range(1, n+1) if n % a_ == 0)
def gram_spec(delta, T, N):
    mu0 = delta/2 - 1j*t0
    # integrate over t in R: use t>0 nodes and the value at -t (phi(1/2 - i(-t)) = phi(1/2+it), phi(1/2-it) = conj)
    def c(tt, phm):  # phm = phi(1/2 - i tt)
        return T**mu0*(T**(-1j*tt)/(mu0-1j*tt) + phm*T**(1j*tt)/(mu0+1j*tt))
    dens = np.abs(c(t, ph.conj()))**2 + np.abs(c(-t, ph))**2
    taus = np.array([tau_it(n, t) for n in range(1, N+1)])
    G = (taus*(dens*w)[None, :]) @ taus.T/(4*math.pi)
    sp = 0.5+mu0
    th = np.array([tau_c(n, 0.5) for n in range(1, N+1)]).real
    G = G + (3/math.pi)*abs(T**(sp-1)/(sp-1))**2*np.outer(th, th)
    return G
def gram_exact(delta, N):   # T >= N, without the factor T^delta/delta
    mu0 = delta/2 - 1j*t0
    rows = [[(a_*a_/m, (a_*a_/m)**mu0) for a_ in range(1, m+1) if m % a_ == 0] for m in range(1, N+1)]
    K = np.zeros((N, N), dtype=complex)
    for i in range(N):
        for j in range(N):
            K[i, j] = sum(c1*np.conj(c2)*min(1/r1, 1/r2)**delta for r1, c1 in rows[i] for r2, c2 in rows[j])
    return K
res = []
N = 8
for delta in [0.5, 0.1, 0.03]:
    mu0 = delta/2 - 1j*t0
    lam = np.array([tau_c(n, mu0) for n in range(1, N+1)])
    # (a) T = N: spectral Gram against the exact Gram K * T^delta/delta
    T = float(N)
    Gs = gram_spec(delta, T, N); Ke = gram_exact(delta, N)*T**delta/delta
    # the spectral Gram pairs tau_it(m) tau_it(n) (real symmetric); the exact K is Hermitian: compare real parts and report imaginary part of K
    errA = float(np.max(np.abs(Gs-Ke.real))/np.max(np.abs(Ke))); imK = float(np.max(np.abs(Ke.imag))/np.max(np.abs(Ke)))
    # (b) T = 1: total mass against 1/delta, and maximal gain against N^delta
    G1 = gram_spec(delta, 1.0, N)
    mass_err = float(abs(G1[0, 0]-1/delta)*delta)
    sol = np.linalg.solve(G1, lam)
    gain1 = float((lam.conj() @ sol).real/delta)   # sup |lambda_x|^2 M(1) / Q(x), M(1) = 1/delta
    solN = np.linalg.solve(Ke.real if imK < 1e-9 else Ke, lam)
    gainN = float((lam.conj() @ solN).real*T**delta/delta)
    d = dict(delta=delta, N=N, T_eq_N_rel_err_spectral_vs_exact=errA, imag_part_exact_K=imK, T1_mass_rel_err=mass_err,
             T1_max_gain=gain1, T_eq_N_max_gain_over_M_T=gainN, N_pow_delta=N**delta, tail_bound=float(16/(math.pi*TMAX)*delta))
    res.append(d); print(d, flush=True)
json.dump(dict(gamma=gamma, TMAX=TMAX, nodes=int(t.size), rows=res), open(OUT, 'w'), indent=1)
