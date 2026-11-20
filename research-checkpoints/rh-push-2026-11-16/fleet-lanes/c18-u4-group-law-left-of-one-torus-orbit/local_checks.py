# Local checks for lane c18-u4-group-law-left-of-one-torus-orbit (mpmath, small; planned memory < 200 MB).
# Writes local_checks.json next to itself.
import json, os, math
import mpmath as mp
mp.mp.dps = 30
out = {}
HERE = os.path.dirname(os.path.abspath(__file__))

def M(z, U):  # Mellin-Laplace transform of v_U(u) = (1 - u/U)_+ on u >= 0
    z = mp.mpc(z)
    if abs(z) < mp.mpf(10)**(-8):
        return mp.mpf(U)/2
    return (mp.exp(z*U) - 1 - z*U)/(z*z*U)

# ---- 1. identity (C-F) for zeta left of 1
def mangoldt_table(N):
    lam = [0.0]*(N+1)
    sieve = bytearray([1])*(N+1)
    for p in range(2, N+1):
        if sieve[p]:
            for m in range(2*p, N+1, p): sieve[m] = 0
            q = p
            while q <= N:
                lam[q] = math.log(p); q *= p
    return lam
NZ = 400
zeros = [mp.zetazero(n) for n in range(1, NZ+1)]
out['identity'] = []
X = 30; U = mp.log(X)
lam = mangoldt_table(X)
A = [3, 4, 1]
for sigma, t in [(0.75, float(zeros[0].imag)), (0.75, 5.0), (0.6, float(zeros[2].imag)), (0.9, 40.0)]:
    lhs = mp.mpf(0); pole = mp.mpf(0); zsum = mp.mpf(0); ld = mp.mpf(0); der = mp.mpf(0); triv = mp.mpf(0)
    for k in range(3):
        s = mp.mpc(sigma, k*t)
        for n in range(2, X+1):
            if lam[n]:
                lhs += A[k]*(lam[n]*mp.power(n, -s)*(1 - mp.log(n)/U)).real
        z0, z1, z2 = mp.zeta(s), mp.zeta(s, derivative=1), mp.zeta(s, derivative=2)
        L = z1/z0; Lp = z2/z0 - L*L
        ld += A[k]*(-L).real
        der += A[k]*(-(Lp)/U).real
        pole += A[k]*(mp.exp((1-s)*U)/((1-s)**2*U)).real
        for r in zeros:
            for rho in (r, r.conjugate()):
                zsum += A[k]*(-mp.exp((rho-s)*U)/((rho-s)**2*U)).real
        for j in range(1, 60):
            triv += A[k]*(-mp.exp((-2*j-s)*U)/((2*j+s)**2*U)).real
    rhs = ld + der + pole + zsum + triv
    out['identity'].append(dict(sigma=sigma, t=t, X=X, prime_side=float(lhs), logder_term=float(ld), deriv_term=float(der),
                                pole_term=float(pole), zero_term=float(zsum), trivial_term=float(triv),
                                analytic_side=float(rhs), defect=float(lhs-rhs), zeros_used=2*NZ))

# ---- 2. sign region of Re M(a+iy) for the Fejer weight: largest c = aU with min_y Re M >= 0
def minRe(c, U=1.0):
    m = mp.inf
    for j in range(0, 6001):
        y = j*0.05
        v = M(mp.mpc(c/U, y), U).real
        if v < m: m = v
    return float(m)
grid = [-5, -2, -1, 0, 0.5, 1.0, 1.5, 1.8, 1.9, 2.0, 2.2, 2.5, 3.0]
out['fejer_min_ReM'] = {str(c): minRe(c) for c in grid}

# ---- 3. ceiling numbers
g = lambda lam_: float((mp.exp(lam_) - 1 - lam_)/lam_**2) if lam_ > 0 else 0.5
ceil = []
for delta in [0.02, 0.05, 0.1, 0.2, 0.4]:
    best = max(((Uv*(2 - 3*g(delta*Uv)), Uv) for Uv in [0.05*j for j in range(1, 4000)]), key=lambda x: x[0])
    ceil.append(dict(delta=delta, sup_signal=best[0], U_at_sup=best[1], t_max=math.exp(best[0]/2.5), ubar_bound=math.log(4/3)/delta))
out['ceiling_fejer'] = ceil

# ---- 4. controls
# 4a Beurling-rational member: density |1 - x^(rho-1)|^2 >= 0, F = (s-rho)(s-conj rho)/((s-1)(s-(2 beta-1)))
beta, gam = 0.8, 20.0
rho = mp.mpc(beta, gam)
def dens(x): return 1 + x**(2*beta-2) - 2*x**(beta-1)*mp.cos(gam*mp.log(x))
mind = min(float(dens(mp.mpf(1)+mp.mpf(j)/50)) for j in range(0, 20000))
s = mp.mpc(1.7, 3.1)
num = mp.quad(lambda x: x**(-s)*dens(x), mp.linspace(1, 50, 400)+[mp.inf])
form = 1/(s-1) + 1/(s-(2*beta-1)) - 1/(s-rho) - 1/(s-rho.conjugate())
out['beurling_rational'] = dict(beta=beta, gamma=gam, min_density=mind, mellin_defect=float(abs(num-form)))
# 4b G_+ density D_+ = 4 x^(-1/2)(cosh(b L) - cos(g L) cosh(eta L)), eta < b
b, eta, gg = 0.2, 0.07, 25.0
out['G_plus_min_density'] = min(float(4*mp.exp(-L/2)*(mp.cosh(b*L) - mp.cos(gg*L)*mp.cosh(eta*L))) for L in [mp.mpf(j)/200 for j in range(0, 8000)])
# 4c T-NR (q = 3, c = 2.2), D form: Lambda_m(3^k) = -log 3 (w1^-k + w2^-k)
c = mp.mpf('2.2'); q = 3
disc = mp.sqrt(c*c*q - 4*q)
w1, w2 = (-c*mp.sqrt(q) + disc)/(2*q), (-c*mp.sqrt(q) - disc)/(2*q)
out['TNR_lambda_at_3^k'] = {str(k): float(mp.log(3)*(1 - (w1**(-k) + w2**(-k)).real)) for k in range(1, 7)}
out['TNR_zero_abscissa'] = float(mp.log(1/abs(w1))/mp.log(3))
# 4d NR-q (q = 1 + sqrt 2, c = 2.1): atoms at q^k
qq = 1 + mp.sqrt(2); c = mp.mpf('2.1')
disc = mp.sqrt(c*c*qq - 4*qq)
v1, v2 = (-c*mp.sqrt(qq) + disc)/(2*qq), (-c*mp.sqrt(qq) - disc)/(2*qq)
out['NRq_lambda_at_q^k'] = {str(k): float(-mp.log(qq)*(v1**(-k) + v2**(-k)).real) for k in range(1, 5)}
# 4e backward heat, coefficient form a(n) = exp(tau log^2 n / 4): Lambda_F(6)
for tau in [-0.5, -0.1, -0.005, 0.1]:
    a = lambda n: mp.exp(tau*mp.log(n)**2/4)
    l2 = a(2)*mp.log(2); l3 = a(3)*mp.log(3)
    l6 = a(6)*mp.log(6) - l2*a(3) - l3*a(2)
    out.setdefault('HEAT_lambda6', {})[str(tau)] = float(l6)
# 4f ZQ density sign on the gap (5, 7): sample (first zeros 14.13, 21.02; eta = 0.1)
g1, g2 = zeros[0].imag, zeros[1].imag; gb, d, eta = (g1+g2)/2, (g2-g1)/2, mp.mpf('0.1')
D = lambda x: -4*x**(-0.5)*mp.cos(gb*mp.log(x))*(mp.cosh(eta*mp.log(x)) - mp.cos(d*mp.log(x)))
vals = [float(D(mp.mpf(5) + mp.mpf(j)/100)) for j in range(1, 200)]
out['ZQ_density_on_gap_5_7'] = dict(min=min(vals), max=max(vals))
json.dump(out, open(os.path.join(HERE, 'local_checks.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
