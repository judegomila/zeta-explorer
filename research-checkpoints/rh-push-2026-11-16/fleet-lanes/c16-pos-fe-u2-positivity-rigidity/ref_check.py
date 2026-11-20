# Referee re-check by other routes (mpmath, 30 digits; different test function, different instances).
# (a) theta relation Theta(y) + r/2 = y^(-1/2) (Theta(1/y) + r/2) for ZQ (pair 2,3; eta = 0.1), Theta(y) = int e^(-pi x^2 y) dN
# (b) identity (T) with phi = 1 - 4x^2 on [-1/2,1/2]  (phihat(t) = 2 (sin(pi t) - pi t cos(pi t)) / (pi t)^3 * 2 ... computed by quadrature)
# (c) sign of the coefficient density A(x) of N - sum delta_n: ZQ must take both signs; G_+ must be >= 0 (Step 1: nu >= 0 gives N >= 0)
# (d) limit form: int sinc^2(x) A(x) dx -> 0 for ZQ (truncated at X, tail estimated by (r-1)/(2 pi^2 X))
import json, mpmath as mp
mp.mp.dps = 20
half = mp.mpf(1)/2
def t2(s): return -(s - half)**2
def setup(kind, i, eta, b=None):
    g1 = mp.zetazero(i).imag; g2 = mp.zetazero(i+1).imag; gb = (g1+g2)/2
    num = lambda s: (t2(s)+gb**2+eta**2)**2 - 4*gb**2*t2(s)
    if kind == "ZQ":
        m = lambda s: num(s)/((t2(s)-g1**2)*(t2(s)-g2**2)); zs = [(mp.mpc(half, g1), 1), (mp.mpc(half, -g1), 1), (mp.mpc(half, g2), 1), (mp.mpc(half, -g2), 1)]
    else:
        m = lambda s: num(s)/(t2(s)+b**2)**2; zs = [(half+b, 2), (half-b, 2)]
    poles = []
    for z, o in zs:
        rad = mp.mpf('1e-2')
        R1 = mp.quad(lambda th: m(z+rad*mp.expj(th))*rad*mp.expj(th), mp.linspace(0, 2*mp.pi, 9))/(2*mp.pi)
        R2 = mp.quad(lambda th: m(z+rad*mp.expj(th))*(rad*mp.expj(th))**2, mp.linspace(0, 2*mp.pi, 9))/(2*mp.pi) if o == 2 else mp.mpf(0)
        poles.append((z, R1, R2))
    return m, poles
_cache = {}
def HJ(z, n):
    key = (z, n)
    if key not in _cache:
        _cache[key] = (mp.fsum(mp.mpf(k)**(-z) for k in range(1, n+1)), mp.fsum(mp.mpf(k)**(-z)*mp.log(k) for k in range(1, n+1)))
    return _cache[key]
def A_of(poles, x):
    n = int(mp.floor(x)); tot = mp.mpf(0)
    for z, R1, R2 in poles:
        H, J = HJ(z, n)
        tot += (R1*x**(z-1)*H + R2*x**(z-1)*(mp.log(x)*H - J))
    return mp.re(tot)
out = {}
# ---- ZQ pair 2,3, eta 0.1
m, poles = setup("ZQ", 2, mp.mpf('0.1')); r = mp.re(m(1))
def Theta(y, X=60):
    s = mp.fsum(mp.exp(-mp.pi*n*n*y) for n in range(1, X))
    s += mp.fsum(mp.quad(lambda x: mp.exp(-mp.pi*x*x*y)*A_of(poles, x), [n, n+half, n+1]) for n in range(1, X))
    return s
ys = [mp.mpf('0.7'), mp.mpf('1.6')]
out["a_theta_ZQ"] = [{"y": float(y), "defect": float(abs(Theta(y) + r/2 - (Theta(1/y) + r/2)/mp.sqrt(y)))} for y in ys]
phih = lambda t: 2*(mp.sin(mp.pi*t) - mp.pi*t*mp.cos(mp.pi*t))/(mp.pi*t)**3   # closed form of the transform of 1 - 4x^2 on [-1/2,1/2]
assert abs(phih(mp.mpf('1.3')) - mp.quad(lambda x: (1-4*x*x)*mp.cos(2*mp.pi*x*mp.mpf('1.3')), [0, half])*2) < mp.mpf(10)**-15
var = mp.quad(lambda x: (1-4*x*x)**2, [-half, half]) - mp.quad(lambda x: 1-4*x*x, [-half, half])**2
X = 60
atoms = mp.fsum(phih(n)**2 for n in range(1, 4000))
dens = mp.fsum(mp.quad(lambda x: phih(x)**2*A_of(poles, x), [n, n+half, n+1]) for n in range(1, X))
out["b_identity_T_ZQ"] = {"r": float(r), "lhs": float(atoms+dens), "rhs": float(r/2*var), "defect": float(atoms+dens-r/2*var), "atoms_minus_half_var": float(atoms - var/2)}
xs = [1 + mp.mpf(k)/40 for k in range(0, 1200)]  # x in [1, 31)
Av = [A_of(poles, x) for x in xs]
out["c_sign_A_ZQ"] = {"min": float(min(Av)), "max": float(max(Av)), "limit r-1": float(r-1)}
sinc2 = lambda x: (mp.sin(mp.pi*x)/(mp.pi*x))**2
I = mp.fsum(mp.quad(lambda x: sinc2(x)*A_of(poles, x), [n, n+half, n+1]) for n in range(1, X))
out["d_sinc2_ZQ"] = {"integral_to_X": float(I), "X": X, "tail_estimate": float((r-1)/(2*mp.pi**2*X)), "sum": float(I + (r-1)/(2*mp.pi**2*X))}
# ---- G_+ pair 2,3, eta 0.07, b 0.2: N >= 0 and identity fails
m, poles = setup("GP", 2, mp.mpf('0.07'), mp.mpf('0.2')); r = mp.re(m(1))
Av = [A_of(poles, x) for x in xs]
dens = mp.fsum(mp.quad(lambda x: phih(x)**2*A_of(poles, x), [n, n+half, n+1]) for n in range(1, X))
out["c_sign_A_Gplus"] = {"min": float(min(Av)), "max": float(max(Av))}
out["b_identity_T_Gplus"] = {"r": float(r), "lhs": float(atoms+dens), "rhs": float(r/2*var), "defect": float(atoms+dens-r/2*var)}
json.dump(out, open("ref_check.json", "w"), indent=1); print(json.dumps(out, indent=1))
