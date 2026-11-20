# Referee rerun, part b: Laplace form against entire form at a point with small Re z (the real-line integral for g
# is unusable for Re z > about 4; part a's value at 1.6-1.3i is that artefact). Also a strip search at kappa = pi.
# Planned memory: a few MB.
import json, os
from mpmath import mp, mpf, mpc, pi, exp, log, quad, findroot, nstr, sin, linspace
mp.dps = 30
def g(z):
    return quad(lambda t: exp(z*t - t*log(t)) if t > 0 else mpf(1), [0, 0.5, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 160])
def R(s, kap):
    z = -1j*kap*(s - mpf(1)/2); return g(z) + g(-z)
def Rlap(s, kap):
    pts = [mpf(v) for v in linspace(0, 60, 241)]
    return 2*quad(lambda r: (sin(r*log(r)) if r > 0 else 0)*exp(pi*r/2 - kap*(s-mpf(1)/2)*r), pts)
out = {}
for (s, kap) in [(mpc('1.6', '-0.4'), mpf(4)), (mpc('1.45', '0.3'), pi)]:
    v1, v2 = R(s, kap), Rlap(s, kap)
    out['kappa=%s s=%s' % (nstr(kap, 5), nstr(s, 5))] = dict(entire=nstr(v1, 20), laplace=nstr(v2, 20), diff=nstr(abs(v1-v2), 5),
        bound=nstr(2/(kap*abs(s.real-mpf(1)/2) - pi/2), 8))
roots = []
for st in [mpc(0.1, 0.9), mpc(0.2, 1.1), mpc(0.3, 1.2), mpc(0.15, 0.7), mpc(0.4, 1.0)]:
    try:
        r0 = findroot(lambda s: 1 + R(s, pi), st, tol=mpf(10)**-20, maxsteps=40)
        roots.append([nstr(st, 4), nstr(r0, 15), nstr(abs(1 + R(r0, pi)), 5)])
    except Exception as e:
        roots.append([nstr(st, 4), 'fail ' + str(e)[:60]])
out['kappa=pi Newton from starts inside the strip'] = roots
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ref2_check_b.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
