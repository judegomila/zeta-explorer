# Paired-packet carrier form (PR 29 sections 2-3), prime side, r = 1 envelope.
#   rho(t) := H_ell[J_b N_t u]/||N_t u||^2  ~=  m(t) - P(t),
#   m(t) = Re psi(1/4 + i t/2) - log pi,   P(t) = sum_{|s_n|<2 delta} c_n cos(t s_n) R_u(s_n)/||u||^2,
#   s_n = log n - 2b,  c_n = eps_n Lambda(n)/sqrt n.   (O(t^-K) neutral-correction terms and C_b <= 1e-9 dropped.)
# Compares (i) zeta: eps = 1; (ii) the Euler product F_t0 = [zeta(s+it0) zeta(s-it0)]^{1/2}: eps_n = cos(t0 log n);
# (iii) Davenport-Heilbronn: c_n = Lambda_f(n)/sqrt n from the formal log derivative.
import numpy as np, math, sys
from mpmath import digamma, mpc
rng = np.random.default_rng(7)
delta = 0.3
def bump(x):
    y = np.zeros_like(x); m = np.abs(x) < delta
    y[m] = np.exp(-1.0/(1.0-(x[m]/delta)**2)); return y
xs = np.linspace(-delta, delta, 20001); dx = xs[1]-xs[0]; ux = bump(xs)
norm2 = np.sum(ux*ux)*dx
full = np.correlate(ux, ux, mode='full')*dx/norm2      # R_u(s)/||u||^2 on grid s = k dx
sgrid = (np.arange(full.size)-(ux.size-1))*dx
def r(s): return np.interp(s, sgrid, full, left=0.0, right=0.0)
def mfun(t): return float(digamma(mpc(0.25, t/2)).real) - math.log(math.pi)

def mangoldt(N):
    lam = np.zeros(N+1); sieve = np.ones(N+1, bool); sieve[:2] = False
    for p in range(2, N+1):
        if sieve[p]:
            sieve[2*p::p] = False
            q = p
            while q <= N: lam[q] = math.log(p); q *= p
    return lam
def dh_lambda(N):
    kap = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
    A = np.array([0, 1, kap, -kap, -1.0]); a = A[np.arange(N+1) % 5]; a[0] = 0
    inv = np.zeros(N+1); inv[1] = 1.0
    # Dirichlet inverse: sum_{d|n} a_d inv_{n/d} = [n=1]
    for d in range(1, N+1):
        if inv[d] != 0.0 or d == 1:
            pass
    acc = np.zeros(N+1); acc[1] = 1.0   # acc[n] accumulates -sum_{d|n,d<n} inv_d a_{n/d}; process in order
    inv = np.zeros(N+1)
    for d in range(1, N+1):
        inv[d] = acc[d]
        if inv[d] != 0.0:
            ks = np.arange(2, N//d+1)
            acc[d*ks] -= inv[d]*a[ks]
    al = a*np.log(np.maximum(np.arange(N+1), 1))
    lam = np.zeros(N+1)
    for d in range(1, N+1):
        if al[d] != 0.0:
            ks = np.arange(1, N//d+1)
            lam[d*ks] += al[d]*inv[ks]
    return lam

for b in (5.0, 6.0):
    T = math.exp(2*b); N = int(math.exp(2*b+2*delta))+1
    n = np.arange(2, N+1); s = np.log(n)-2*b; sel = np.abs(s) < 2*delta
    n = n[sel]; s = s[sel]; rs = r(s)
    lam = mangoldt(N)[n]; cz = lam/np.sqrt(n)
    ts = np.sort(rng.uniform(T, 2*T, 3000))
    def P(c, tt): return np.array([np.sum(c*np.cos(t*s)*rs) for t in tt])
    Pz = P(cz, ts); mz = np.array([mfun(t) for t in ts[::300]]).mean()
    thr = 0.5*math.log(T)
    print(f"b={b}: T=e^{2*b:.0f}={T:.0f}, annulus n in ({n[0]},{n[-1]}), prime powers={int((lam>0).sum())}, M_b=sum c_n={cz.sum():.1f}, sum c_n^2={np.sum(cz*cz):.2f}, m(t)~{mz:.2f}")
    print(f"  zeta: P(t) over 3000 t in [T,2T]: mean={Pz.mean():+.3f} rms={Pz.std():.3f} (MV prediction sqrt(sum c^2 r^2/2)={math.sqrt(np.sum((cz*rs)**2)/2):.3f}) max|P|={np.abs(Pz).max():.2f}; fraction with |P|>(1/2)log T={np.mean(np.abs(Pz)>thr):.4f}; min rho=m-P={mz-Pz.max():.2f}")
    # (ii) Euler product twist at carrier t0 with 2 b t0 in 2 pi Z
    t0 = round(1.37*T*b/math.pi)*math.pi/b
    eps = np.cos(t0*np.log(n)); ce = eps*cz
    Pe_t0 = np.sum(ce*np.cos(t0*s)*rs); Pe = P(ce, ts)
    print(f"  F_t0=[zeta(s+it0)zeta(s-it0)]^(1/2), t0={t0:.4f}: same size bounds (sum c^2={np.sum(ce*ce):.2f}); typical carriers rms P={Pe.std():.3f}, fraction |P|>(1/2)log T={np.mean(np.abs(Pe)>thr):.4f};")
    print(f"     carrier t=t0: P={Pe_t0:+.2f}, rho(t0)=m-P={mfun(t0)-Pe_t0:+.2f}  (NEGATIVE; prediction P~(1/2)sum c_n r(s_n)={0.5*np.sum(cz*rs):.2f})")
    # (iii) DH
    lf = dh_lambda(N)[n]; cd = lf/np.sqrt(n); Pd = P(cd, ts)
    print(f"  DH: max|Lambda_f(n)| in annulus={np.abs(lf).max():.2f} (log N={math.log(N):.2f}), sum c^2={np.sum(cd*cd):.2f} (zeta {np.sum(cz*cz):.2f}), rms P={Pd.std():.3f}, max|P|={np.abs(Pd).max():.2f}, fraction |P|>(1/2)log T={np.mean(np.abs(Pd)>thr):.4f}, max P={Pd.max():.2f}, min rho_DH=m_DH-P={math.log(5*T/(2*math.pi))-Pd.max():+.2f} (m_DH~log(5t/2pi))")
