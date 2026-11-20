# Legendre-Galerkin matrix of the damped Weil form  W_theta(g) = W( (g*g~) e^{-theta|u|} )  on L^2(-a,a),
# built from the PRIME side only (primes n <= e^{2a}), float64.
#   W(h) = hhat(i/2)+hhat(-i/2) - sum Lambda(n) n^{-1/2}(h(log n)+h(-log n)) + (1/2pi) int hhat(t)(Re psi(1/4+it/2)-log pi) dt
# Returns pieces so that lambda_min (Ritz upper bound for the true inf) and the rung norm can be read off.
import numpy as np, math, sys
EG = 0.5772156649015329
def vm_table(N):
    lam = np.zeros(N+1); sieve = np.ones(N+1, bool)
    for p in range(2, N+1):
        if sieve[p]:
            sieve[2*p::p] = False
            q = p
            while q <= N: lam[q] = math.log(p); q *= p
    return lam
def leg_orthonormal(x, N, a):
    # rows: degree, cols: points
    t = x/a; P = np.empty((N, x.size)); P[0] = 1.0
    if N > 1: P[1] = t
    for k in range(1, N-1): P[k+1] = ((2*k+1)*t*P[k] - k*P[k-1])/(k+1)
    return P*np.sqrt((2*np.arange(N)+1)/(2*a))[:,None]
def S_of_u(u, N, a, xg, wg):
    # sym part of C(u)_{jk} = int_{-a}^{a-u} phi_j(x+u) phi_k(x) dx
    if u >= 2*a: return np.zeros((N,N))
    half = (2*a-u)/2; x = -a + half*(xg+1); w = half*wg
    A = leg_orthonormal(x+u, N, a); B = leg_orthonormal(x, N, a)
    C = (A*w) @ B.T
    return 0.5*(C+C.T)
def build(a, theta, N, lam_weights=None, pole=True, arch='zeta', nu_extra=80):
    """lam_weights: dict n -> coefficient c(n) of -F'/F (default von Mangoldt)."""
    xg, wg = np.polynomial.legendre.leggauss(N+4)
    ug, vg = np.polynomial.legendre.leggauss(N+nu_extra)
    u = a*(ug+1); v = a*vg          # nodes on [0,2a]
    I = np.eye(N)
    Mpole = np.zeros((N,N)); March = np.zeros((N,N))
    sh = 0.5+theta
    for ui, vi in zip(u, v):
        S = S_of_u(ui, N, a, xg, wg)
        if pole: Mpole += vi*2*math.exp(-theta*ui)*2*math.cosh(ui/2)*S
        if arch == 'zeta':   # Re psi(1/4+it/2) - log pi
            March += vi*2*(math.exp(-2*ui)*I - math.exp(-sh*ui)*S)/(-math.expm1(-2*ui))
        else:                # odd character mod q: Re psi(3/4+it/2) + log(q/pi)
            March += vi*2*(math.exp(-2*ui)*I - math.exp(-(1.0+sh)*ui)*S)/(-math.expm1(-2*ui))
    c0 = -EG - math.log(-math.expm1(-4*a))
    c0 += (-math.log(math.pi) if arch == 'zeta' else math.log(arch/math.pi))
    March += c0*I
    Nmax = int(math.floor(math.exp(2*a)+1e-12))
    if lam_weights is None:
        lam = vm_table(max(Nmax,2)); lam_weights = {n: lam[n] for n in range(2, Nmax+1) if lam[n] > 0}
    Mpr = np.zeros((N,N))
    for n, c in lam_weights.items():
        ln = math.log(n)
        if ln >= 2*a or c == 0: continue
        Mpr += c*n**(-0.5-theta)*2*S_of_u(ln, N, a, xg, wg)
    return Mpole, March, Mpr
if __name__ == '__main__':
    import mpmath as mp
    def xilog(s):
        s = mp.mpf(s); return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
    N = int(sys.argv[1]) if len(sys.argv) > 1 else 120
    print("N =", N)
    for e2a in (3, 5, 11, 30, 100, 400):
        a = math.log(e2a)/2
        for theta in (0.0, 0.01, 0.05, 0.1, 0.25, 0.375, 0.5):
            Mp, Ma, Mr = build(a, theta, N)
            M = Mp + Ma - Mr
            ev = np.linalg.eigvalsh(M)
            lamR = np.linalg.eigvalsh(Mr)[-1]
            crude = sum(2*c*n**(-0.5-theta) for n, c in enumerate(vm_table(e2a)) if c > 0 and math.log(n) < 2*a)
            print(f"e2a={e2a:4d} theta={theta:5.3f} lam_min={ev[0]: .6e} lam2={ev[1]: .4e} | 2xi'/xi(1/2+th)={float(2*xilog(0.5+theta)) if 0<theta<0.5 else 0: .6e} | lamR={lamR:.4f} crude={crude:.4f}", flush=True)
