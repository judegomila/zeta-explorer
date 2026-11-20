# Independent referee rerun (general lens). Different cases from checks.py / ref_check.py:
#  (1) HQ1 at q = 5, eps = 0.3, x = 0.7 and HQ4 at q = 3 (a, b) = (0.15, 0.35), x = 1.9; coefficients from closed formulas / own recurrence
#  (2) NWM at kappa = 4: winding number of 1 + R on a circle round the claimed zero (entire form, mp.quad), and
#      NWM at kappa = pi (the 'sharp' case): 1 + R on the line is > 1; search a zero off the line.
# Planned memory: a few MB (no arrays beyond 200 numbers).
import json, os
from mpmath import mp, mpf, mpc, pi, exp, log, gamma, zeta, sqrt, quad, findroot, nstr, arg
mp.dps = 30
out = {}
def resid(F, s0, r=mpf('0.08'), M=80):
    tot = mpc(0)
    for j in range(M):
        w = r*exp(2j*pi*(j+mpf(1)/2)/M)
        tot += F(s0+w)*w
    return tot/M
def run(name, q, m, coef, poles, x, Kmax):
    L = log(q)
    def a(n):
        v = 0
        while n % q == 0: n //= q; v += 1
        return coef(v)
    phi = lambda xx: sum(a(n)*exp(-pi*n*n*xx) for n in range(1, 16))
    F = lambda s: pi**(-s/2)*gamma(s/2)*zeta(s)*m(mpf(q)**(mpf(1)/2-s))*x**(-s/2)
    acc = phi(x) - phi(1/x)/sqrt(x) - (resid(F, mpf(1)) + resid(F, mpf(0)))/2
    seq = [nstr(abs(acc), 5)]
    for K in range(Kmax+1):
        for sg in ([0] if K == 0 else [K, -K]):
            for p0 in poles: acc -= resid(F, p0 + 2j*pi*sg/L)/2
        seq.append(nstr(abs(acc), 5))
    # Dirichlet series check at s = 5
    S = sum(a(n)*mpf(n)**-5 for n in range(1, 3001))
    out[name] = {'a(q),a(q^2)': [nstr(coef(1), 12), nstr(coef(2), 12)],
                 '|series - zeta*m| at s=5 (3000 terms)': nstr(abs(S - zeta(5)*m(mpf(q)**(mpf(1)/2-5))), 5),
                 'defect: residues 0,1 only; then |k|<=K, K=0..%d' % Kmax: seq}
eps = mpf('0.3'); q = 5
run('HQ1 q=5 eps=0.3 x=0.7', 5, lambda u: 1 + eps*u/(1-u)**2,
    lambda v: 1 + eps*sum(k*mpf(5)**(mpf(k)/2) for k in range(1, v+1)), [mpf(1)/2], mpf('0.7'), 12)
a_, b_ = mpf('0.15'), mpf('0.35'); q3 = mpf(3)
al = q3**a_ + q3**-a_; be = q3**b_ + q3**-b_
def c4(v, _c={}):
    # (1-y)^-1 (1+al u+u^2)/(1-be u+u^2), u = sqrt3 y: power series by direct multiplication
    if not _c:
        r = sqrt(q3); N = 12
        # 1/(1-be u+u^2) coefficients c_k: c_k = be c_{k-1} - c_{k-2}
        c = [mpf(1), be]
        for k in range(2, N+1): c.append(be*c[-1] - c[-2])
        mm = [c[k] + (al*c[k-1] if k >= 1 else 0) + (c[k-2] if k >= 2 else 0) for k in range(N+1)]
        mm = [mm[k]*r**k for k in range(N+1)]
        for k in range(N+1): _c[k] = sum(mm[:k+1])
    return _c[v]
run('HQ4 q=3 (0.15,0.35) x=1.9', 3, lambda u: (1+al*u+u*u)/(1-be*u+u*u), c4, [mpf(1)/2+b_, mpf(1)/2-b_], mpf('1.9'), 9)
print(json.dumps(out, indent=1), flush=True)

# NWM
def g(z):
    return quad(lambda t: exp(z*t - t*log(t)) if t > 0 else mpf(1), [0, 0.5, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 160])
def R(s, kap):
    z = -1j*kap*(s - mpf(1)/2)
    return g(z) + g(-z)
nw = {}
kap = mpf(4)
s0 = mpc('0.0523313279723755', '0.7846755606466836')
nw['kappa=4: |1+R(s0)| (own quadrature)'] = nstr(abs(1 + R(s0, kap)), 5)
M = 48; rad = mpf('0.02'); vals = [1 + R(s0 + rad*exp(2j*pi*j/M), kap) for j in range(M)]
wind = sum(arg(vals[(j+1) % M]/vals[j]) for j in range(M))/(2*pi)
nw['kappa=4: winding number of 1+R on |s-s0|=0.02 (48 pts)'] = nstr(wind, 10)
nw['kappa=4: min |1+R| on that circle'] = nstr(min(abs(v) for v in vals), 6)
nw['kappa=4: max phase step (rad)'] = nstr(max(abs(arg(vals[(j+1) % M]/vals[j])) for j in range(M)), 6)
nw['zeta(s0)'] = nstr(zeta(s0), 10)
# Laplace form at a different point, against entire form
def Rlap(s, kap):
    from mpmath import sin, linspace
    pts = [mpf(v) for v in linspace(0, 60, 241)]
    return 2*quad(lambda r: (sin(r*log(r)) if r > 0 else 0)*exp(pi*r/2 - kap*(s-mpf(1)/2)*r), pts)
s1 = mpc('1.6', '-1.3')
nw['kappa=4: |R_entire - R_Laplace| at 1.6-1.3i'] = nstr(abs(R(s1, kap) - Rlap(s1, kap)), 5)
nw['kappa=4: |R(1.6-1.3i)|, bound'] = [nstr(abs(R(s1, kap)), 8), nstr(2/(kap*mpf('1.1') - pi/2), 8)]
kp = pi
nw['kappa=pi: 1+R(1/2+it), t=0,0.3,0.6 (real, >1)'] = [nstr(1 + R(mpc(0.5, t), kp), 10) for t in [0, 0.3, 0.6]]
roots = []
for st in [mpc(0.02, 1.0), mpc(-0.05, 0.6), mpc(0.05, 1.2)]:
    try:
        r0 = findroot(lambda s: 1 + R(s, kp), st, tol=mpf(10)**-20, maxsteps=40)
        roots.append([nstr(st, 4), nstr(r0, 15), nstr(abs(1 + R(r0, kp)), 5)])
    except Exception as e:
        roots.append([nstr(st, 4), 'fail ' + str(e)[:60]])
nw['kappa=pi: Newton roots of 1+R (start, root, resid)'] = roots
out['NWM'] = nw
print(json.dumps(nw, indent=1))
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ref2_check.json'), 'w'), indent=1)
