# c21-br0-br3: sanity numerics for the Hamburger step. mpmath only, single process, no large allocation
# (planned memory: a few MB; largest object: list of 12 coefficients and 128 quadrature nodes).
import json, sys
from mpmath import mp, mpf, mpc, pi, exp, log, gamma, zeta, sqrt, quad, findroot, sin, cos, nstr, linspace
mp.dps = 50
out = {}
q = mpf(2); L = log(q)

def members():
    a, b = mpf('0.1'), mpf('0.2')
    al = q**a + q**-a; be = q**b + q**-b
    M = {}
    M['ZETA'] = dict(m=lambda u: mpf(1) + 0*u, poles=[], num=[1], den=[1])
    M['HQ1(eps=1)'] = dict(m=lambda u: 1 + u/(1-u)**2, poles=[mpf(1)/2], num=[1, -1, 1], den=[1, -2, 1])
    e2 = mpf('0.01')
    M['HQ2(eps=1e-2)'] = dict(m=lambda u: 1 + e2*u**2/(1-u)**4, poles=[mpf(1)/2],
                             num=[1, -4, 6+e2, -4, 1], den=[1, -4, 6, -4, 1])
    M['HQ2(eps=1)'] = dict(m=lambda u: 1 + u**2/(1-u)**4, poles=[mpf(1)/2],
                             num=[1, -4, 7, -4, 1], den=[1, -4, 6, -4, 1])
    M['HQ3(a=.1,b=.2)'] = dict(m=lambda u: (1-al*u+u*u)/(1-be*u+u*u), poles=[mpf(1)/2+b, mpf(1)/2-b],
                               num=[1, -al, 1], den=[1, -be, 1])
    M['HQ4(a=.1,b=.2)'] = dict(m=lambda u: (1+al*u+u*u)/(1-be*u+u*u), poles=[mpf(1)/2+b, mpf(1)/2-b],
                               num=[1, al, 1], den=[1, -be, 1])
    return M

def series_local(num, den, K):
    # local factor in y = q^-s: (1-y)^-1 * num(u)/den(u), u = sqrt(q) y ; returns a(q^k), k=0..K
    r = sqrt(q)
    n = [mpf(c)*r**i for i, c in enumerate(num)] + [mpf(0)]*(K+1)
    d = [mpf(c)*r**i for i, c in enumerate(den)]
    # multiply den by (1-y)
    d2 = [mpf(0)]*(len(d)+1)
    for i, c in enumerate(d):
        d2[i] += c; d2[i+1] -= c
    a = []
    for k in range(K+1):
        s = n[k]
        for j in range(1, min(k, len(d2)-1)+1):
            s -= d2[j]*a[k-j]
        a.append(s/d2[0])
    return a

def Lam(s, m):
    u = q**(mpf(1)/2 - s)
    return pi**(-s/2)*gamma(s/2)*zeta(s)*m(u)

def residue(s0, m, x, r=mpf('0.1'), Mn=128):
    tot = mpc(0)
    for j in range(Mn):
        w = r*exp(2j*pi*j/Mn)
        s = s0 + w
        tot += Lam(s, m)*x**(-s/2)*w
    return tot/Mn/2   # phi(x) = (1/2 pi i) int Lam(s) x^(-s/2) d(s/2): factor 1/2

x = mpf('1.3')
N = 12
for name, d in members().items():
    m = d['m']; rec = {}
    a = series_local(d['num'], d['den'], 8)
    rec['a(q^k), k=0..6'] = [nstr(v, 32) for v in a[:7]]
    dep = [k for k in range(2, 9) if abs(a[k] - a[1]**k) > mpf(10)**-30]
    rec['first k with a(q^k) != a(q)^k'] = dep[0] if dep else None
    if dep:
        k = dep[0]; rec['a(q^k) - a(q)^k at that k'] = nstr(a[k]-a[1]**k, 32)
    s1 = mpc('0.83', '3.7')
    u = q**(mpf(1)/2 - s1)
    rec['|m(s)-m(1-s)| at s=0.83+3.7i'] = nstr(abs(m(u) - m(1/u)), 5)
    s2 = mpc(2, 3)
    rec['G(2+3i)'] = nstr(zeta(s2)*m(q**(mpf(1)/2 - s2)), 32)
    # check Dirichlet series against closed form at s=6
    an = []
    for n in range(1, 4001):
        v = 0; t = n
        while t % 2 == 0: t //= 2; v += 1
        an.append(v)
    amax = max(an)
    aa = series_local(d['num'], d['den'], amax)
    S6 = sum(aa[v]*mpf(n+1)**-6 for n, v in enumerate(an))
    rec['|sum_{n<=4000} a_n n^-6 - zeta(6)m|'] = nstr(abs(S6 - zeta(6)*m(q**(mpf(1)/2-6))), 5)
    def phi(xx):
        return sum(aa[an[n-1]]*exp(-pi*n*n*xx) for n in range(1, N+1))
    base = phi(x) - phi(1/x)/sqrt(x) - residue(mpf(1), m, x) - residue(mpf(0), m, x)
    rec['defect with residues at s=0,1 only'] = nstr(abs(base), 8)
    Ds = []
    acc = base
    if d['poles']:
        for K in range(0, 11):
            for sg in ([0] if K == 0 else [K, -K]):
                for p0 in d['poles']:
                    acc -= residue(p0 + 2j*pi*sg/L, m, x)
            Ds.append(nstr(abs(acc), 8))
        rec['|D_K|, K=0..10 (lattice poles |k|<=K included)'] = Ds
        # size of single residue contributions (pole present <=> nonzero)
        rec['|residue| at lattice index k=0..6 (first pole family)'] = [nstr(abs(residue(d['poles'][0] + 2j*pi*k/L, m, x)), 6) for k in range(7)]
    out[name] = rec
    print(name, json.dumps(rec, indent=1)); sys.stdout.flush()

# ---- Newman-type symmetric multiplier (general frequencies, infinite order, no pole)
kap = mpf(4)
from mpmath.calculus.quadrature import GaussLegendre
_gl = GaussLegendre(mp).calc_nodes(5, mp.prec)   # fixed rule on [-1,1]; about 48 nodes; no cache growth
print('GL nodes', len(_gl), '; panels 239 of width 0.5 on [0.5,120]; planned memory < 50 MB')
_h = mpf(1)/2
_panels = [(_h*(k+1), _h*(k+2)) for k in range(239)]
def g(z):
    tot = quad(lambda t: exp(z*t - t*log(t)) if t > 0 else mpf(1), [0, mpf(1)/8, mpf(1)/2])
    for (a, b) in _panels:
        c0 = (a+b)/2; hw = (b-a)/2
        acc = mpc(0)
        for (xn, wn) in _gl:
            t = c0 + hw*xn
            acc += wn*exp(z*t - t*log(t))
        tot += hw*acc
    return tot
def R(s):
    z = -1j*kap*(s - mpf(1)/2)
    return g(z) + g(-z)
def Rlap(s):
    pts = [mpf(v) for v in linspace(0, 40, 321)]
    return 2*quad(lambda r: (sin(r*log(r)) if r > 0 else 0)*exp(pi*r/2 - kap*(s-mpf(1)/2)*r), pts)
nw = {}
s0 = mpc(2, '0.7')
nw['kappa'] = 4
nw['abscissa 1/2+pi/(2 kappa)'] = nstr(mpf(1)/2 + pi/(2*kap), 12)
v1 = R(s0); v2 = Rlap(s0)
nw['R(2+0.7i) entire form'] = nstr(v1, 30); nw['R(2+0.7i) Laplace form'] = nstr(v2, 30)
nw['|difference|'] = nstr(abs(v1-v2), 5)
nw['|R(s)-R(1-s)| at s=0.8+0.9i'] = nstr(abs(R(mpc('0.8','0.9')) - R(1-mpc('0.8','0.9'))), 5)
nw['|R| on Re s = 1.0, t=0,0.5,1,2,4 (bound 2/(kappa*0.5-pi/2))'] = [nstr(abs(R(mpc(1, t))), 8) for t in ['0', '0.5', '1', '2', '4']]
nw['bound'] = nstr(2/(kap*mpf('0.5') - pi/2), 8)
nw['|R(1/2+it)|, t=0.25,0.5,0.75,1.0 (growth on the line)'] = [nstr(abs(R(mpc('0.5', t))), 8) for t in ['0.25', '0.5', '0.75', '1.0']]
c = mpf(1)
f = lambda z: 1 + c*(g(z) + g(-z))
roots = []
for st in [mpc(1.5, 1.6), mpc(2.5, 1.6), mpc(3.0, 1.55), mpc(2.0, 1.2), mpc(3.5, 1.5)]:
    try:
        z0 = findroot(f, st, tol=mpf(10)**-35, maxsteps=60)
        s_ = mpf(1)/2 + 1j*z0/kap
        roots.append(dict(start=nstr(st, 4), z=nstr(z0, 30), s=nstr(s_, 30), resid=nstr(abs(f(z0)), 5),
                          resid_at_1_minus_s=nstr(abs(1 + c*R(1-s_)), 5), zeta_at_s=nstr(abs(zeta(s_)), 8)))
    except Exception as e:
        roots.append(dict(start=nstr(st, 4), error=str(e)[:80]))
nw['zeros of 1+R (c=1)'] = roots
out['NEWMAN'] = nw
print('NEWMAN', json.dumps(nw, indent=1))
json.dump(out, open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), 'checks.json'), 'w'), indent=1)
