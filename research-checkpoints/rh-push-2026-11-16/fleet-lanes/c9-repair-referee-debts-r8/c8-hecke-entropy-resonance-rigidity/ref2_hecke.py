"""Second referee checks for c8-hecke-entropy-resonance-rigidity. mpmath only; no array above a few kB."""
from mpmath import mp, mpf, mpc, pi, exp, log, sqrt, quad, besselk, zetazero, cosh, sinh, inf
from math import gcd
mp.dps = 25
I = mpc(0, 1)
print("== 1. G_chi(z, w) = sum_{(c,d)=1, 5|c} chi(d) y^w/|cz+d|^(2w), truncated |c|,|d| <= 40, z = 0.13+0.9i, w = 1.7")
z = mpc('0.13', '0.9'); w = mpf('1.7'); y = z.imag
chars = {'chi_0 (trivial, even)': {1: 1, 2: 1, 3: 1, 4: 1}, 'chi (chi(2)=i, odd)': {1: 1, 2: I, 4: -1, 3: -I},
         'chi^2 (quadratic, even)': {1: 1, 2: -1, 3: -1, 4: 1}, 'chi^3 (chi(2)=-i, odd)': {1: 1, 2: -I, 4: -1, 3: I}}
for name, ch in chars.items():
    s = mpc(0); sa = mpf(0)
    for c in range(-40, 41, 5):
        for d in range(-40, 41):
            if d % 5 == 0 or gcd(abs(c), abs(d)) != 1: continue
            t = y**w / abs(c*z + d)**(2*w)
            s += ch[d % 5] * t; sa += t
    print("   %-26s |sum| = %.3e   sum of |terms| = %.6f   chi(-1) = %s" % (name, abs(s), sa, ch[4]))
print("== 2. Lemma 3 with m = number of pairs (p, j) (lane) against m with Gamma-multiplicity (first referee)")
rho = zetazero(1); wr = 1 - rho/2; sg = wr.real
p = 2; r = mpf('0.5')
tau2 = abs(mpf(p)**(wr - mpf(1)/2) + mpf(p)**(mpf(1)/2 - wr))**2
for y0 in [mpf(20), mpf(200), mpf(2000)]:
    cE = y0*cosh(r); RE = y0*sinh(r)                     # hyperbolic ball = Euclidean disc
    mass = quad(lambda yy: 2*sqrt(max(RE**2 - (yy - cE)**2, 0)) * yy**(2*sg - 2), [cE - RE, cE, cE + RE])   # int_B y^(2 sigma) dmu
    lhs = tau2 * mass
    Y = p*exp(r)*y0
    rhs_lane = 2*(p + 1)*Y**(2*sg - 1)/(2*sg - 1)        # m <= p+1 pairs
    mult = 2*p*RE                                        # translates z -> z+n covering a point of the image under z -> pz (Euclidean width 2 p RE)
    print("   y0 = %6s: resonance w = %.4f%+.4fi, |tau_w(2)|^2 = %.4f, int_B y^(2s) dmu = %.5e, LHS = %.5e, 2(p+1)||L^Y f||^2 = %.5e, LHS/RHS = %.3f, Gamma-multiplicity of the image of B under z -> pz about %.0f"
          % (y0, wr.real, wr.imag, tau2, mass, lhs, rhs_lane, lhs/rhs_lane, mult))
print("   (f = E(., w) at a resonance equals y^w up to terms below exp(-2 pi (y0 e^-r)) on B; ||Lambda^Y f||^2 = Y^(2s-1)/(2s-1) exactly)")
print("== 3. Lemma 5: push-forward under y -> e^s y and Hecke eigenvalue of m_sigma (test function g(y) = y^2 e^-y)")
g = lambda yy: yy**2*exp(-yy)
for sgm in [mpf('0.6'), mpf('0.75'), mpf('0.9')]:
    base = quad(lambda yy: g(yy)*yy**(2*sgm - 2), [0, 1, 10, inf])
    s = mpf('0.7')
    push = quad(lambda yy: g(exp(s)*yy)*yy**(2*sgm - 2), [0, 1, 10, inf])   # ((a_s)_* m)(g) = m(g o a_s)
    pp = 3
    hecke = quad(lambda yy: (g(pp*yy) + pp*g(yy/pp))/sqrt(pp)*yy**(2*sgm - 2), [0, 1, 10, inf])
    print("   sigma = %s: push/base = %.12f, e^(-(2s-1)s) = %.12f, e^(+(2s-1)s) = %.12f; T_3: ratio %.12f, p^(2s-1/2)+p^(1/2-2s) = %.12f"
          % (sgm, push/base, exp(-(2*sgm - 1)*s), exp((2*sgm - 1)*s), hecke/base, mpf(pp)**(2*sgm - mpf(1)/2) + mpf(pp)**(mpf(1)/2 - 2*sgm)))
print("== 4. Lemma G1: f_eps for the Liouville twist is not the zero function; difference of eigenvalues in (ii)")
def liou(n):
    k = 0; d = 2
    while d*d <= n:
        while n % d == 0: n //= d; k += 1
        d += 1
    if n > 1: k += 1
    return -1 if k % 2 else 1
wq = mpc('0.75', '3.0'); u = wq - mpf(1)/2
def tau_eps(n): return sum(liou(a)*liou(n//a)*(mpf(a)/(n//a))**u for a in range(1, n + 1) if n % a == 0)
zz = mpc('0.3', '0.8')
f = sqrt(zz.imag)*sum(tau_eps(n)*besselk(u, 2*pi*n*zz.imag)*2*mp.cos(2*pi*n*zz.real) for n in range(1, 31))
print("   f_eps(0.3+0.8i), w = 0.75+3i, 30 modes: %s  (|f| = %.3e; first term %.3e)" % (mp.nstr(f, 8), abs(f), abs(sqrt(zz.imag)*besselk(u, 2*pi*zz.imag)*2*mp.cos(2*pi*zz.real))))
for p0 in [2, 3, 5]:
    e = -1
    lhs = (e*mpf(p0)**u + e*mpf(p0)**(-u)) - (mpf(p0)**u + mpf(p0)**(-u))
    rhs = (e - 1)*(mpf(p0)**u - e*mpf(p0)**(-u))
    print("   p0 = %d: tau^eps - (p^u + p^-u) = %s, (eps-1)(p^u - conj(eps) p^-u) = %s, |.| = %.4f" % (p0, mp.nstr(lhs, 8), mp.nstr(rhs, 8), abs(lhs)))
