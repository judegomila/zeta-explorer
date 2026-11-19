"""Referee R1 checks (own code). Usage: python3 -I r1_checks.py <FLOW.json.gz>
Part A: exact rational startup arithmetic, reading only the first records of the flow file.
Part B: mpmath checks of the normalisation, the zero map, positivity on the imaginary axis,
        the heat equation sign, and the direction/rate of strip contraction on explicit models."""
import sys, json, gzip
from fractions import Fraction as F
import mpmath as mp
out = {}
# ---------- Part A ----------
print('planned: parse FLOW.json.gz (~150 MB JSON text)', flush=True)
flow = json.load(gzip.open(sys.argv[1], 'rt'))
arcs = flow['records']
a0 = arcs[0]
print('flow top-level keys:', [k for k in flow if k != 'records'])
print('arc0 keys:', sorted(a0.keys()))
print('arc0:', {k: (v if len(str(v)) < 90 else str(v)[:90] + '...') for k, v in a0.items()})
qinit = F(9, 16) + F(1, 10**12)
assert qinit == F(562500000001, 10**12)
assert F(flow['initial_q']) == qinit, flow['initial_q']
assert flow['initial_sigma'] == '7/8'
r0_paper = F(122615339047817575291909362361, 9903520314283042199192993792)
r0 = F(a0['rate'])
assert r0 == r0_paper, (r0, r0_paper)
tau = F(1, 10**14); delta = F(1, 2048000)
assert F(flow['startup_tau']) == tau
gap = F(1, 10**12) - r0 * qinit * tau
gap_paper = F(921380903213784218478552545296645590637639, 990352031428304219919299379200000000000000000000000000)
assert gap == gap_paper
assert gap > F(1, 2 * 10**12)
assert 0 < tau < delta
# start of first arc: time 0, q0 = qinit
tkeys = [k for k in a0 if k.startswith('t')]
print('arc0 time-like fields:', {k: a0[k] for k in tkeys})
q0keys = [k for k in a0 if 'q' in k]
print('arc0 q-like fields:', {k: str(a0[k])[:80] for k in q0keys})
# 2 = halfwidth identity
assert 2 * F(7, 8) - 1 == F(3, 4) and F(3, 4)**2 == F(9, 16)
# linear lower bound Q(u) >= q0-(2+r q0)u vs exact Q, and gap to 9/16-2t, on a grid of [0,tau] and beyond
mp.mp.dps = 60
def Qexact(u, q0=qinit, r=r0):
    q0 = mp.mpf(q0.numerator) / q0.denominator; r = mp.mpf(r.numerator) / r.denominator
    return (q0 + 2 / r) * mp.e**(-r * u) - 2 / r
mins = []
for k in range(0, 11):
    u = mp.mpf(k) / 10 * mp.mpf(10)**-14
    lin = mp.mpf(qinit.numerator) / qinit.denominator - (2 + mp.mpf(r0.numerator) / r0.denominator * mp.mpf(qinit.numerator) / qinit.denominator) * u
    assert Qexact(u) >= lin
    g = Qexact(u) - (mp.mpf(9) / 16 - 2 * u)
    mins.append(g)
    assert g >= mp.mpf(gap.numerator) / gap.denominator
out['startup'] = {'r0': float(r0), 'gap_exact_lower': float(gap), 'true_gap_at_tau': float(mins[-1]), 'true_gap_at_0': float(mins[0])}
# time at which the classical strip 9/16-2t would first touch the ideal first arc (if ever, within arc 0):
# gap(u) = 1e-12 - ((q0+2/r)(1-e^{-ru}) - 2u); it is decreasing; find root
f = lambda u: Qexact(u) - (mp.mpf(9) / 16 - 2 * u)
uroot = mp.findroot(f, mp.mpf('1.4e-13'))
out['startup']['classical_strip_meets_arc_at_t'] = float(uroot)
out['startup']['delta'] = float(delta)
del flow, arcs
# ---------- Part B ----------
mp.mp.dps = 30
def Phi(u, N=12):
    return mp.fsum((2 * mp.pi**2 * n**4 * mp.e**(9 * u) - 3 * mp.pi * n**2 * mp.e**(5 * u)) * mp.e**(-mp.pi * n**2 * mp.e**(4 * u)) for n in range(1, N + 1))
def H(t, z):
    return mp.quad(lambda u: mp.e**(t * u * u) * Phi(u) * mp.cos(z * u), mp.linspace(0, 3, 13))
def xi(s):
    return s * (s - 1) / 2 * mp.pi**(-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
rows = []
for z in [mp.mpc(0.3, 0.2), mp.mpc(5, 0.75), mp.mpc(17, -0.6), mp.mpc(28.3, 0.9), mp.mpc(40, 0.0), mp.mpc(0, 0.7)]:
    a = H(0, z); b = xi((1 + 1j * z) / 2) / 8
    rows.append((str(complex(z)), float(abs(a - b) / abs(b))))
    assert abs(a - b) <= mp.mpf(10)**-18 * abs(b), (z, a, b)
out['H0_equals_xi_over_8_relerr'] = rows
# coordinate map and zeros
g1 = mp.zetazero(1).imag
assert abs(H(0, 2 * g1)) < mp.mpf(10)**-20
out['H0_at_2gamma1'] = float(abs(H(0, 2 * g1)))
for z in [mp.mpc(3, 0.75), mp.mpc(-7, -0.2)]:
    s = (1 + 1j * z) / 2
    assert abs(s.real - (1 - z.imag) / 2) < 1e-25 and abs(s.imag - z.real / 2) < 1e-25
# xi(0)=xi(1)=1/2 (limits), xi nonzero at trivial zeros
assert abs(xi(mp.mpf('1e-12')) - 0.5) < 1e-10 and abs(xi(1 + mp.mpf('1e-12')) - 0.5) < 1e-10
for k in (-2, -4, -6):
    v = xi(k + mp.mpf('1e-10'))
    assert abs(v) > 0.1
# mathlib-style value at the pole is irrelevant: but note strict Re s>7/8 gives closed strip; functional equation xi(s)=xi(1-s)
for s in [mp.mpc(0.9, 13), mp.mpc(0.2, 30.5)]:
    assert abs(xi(s) - xi(1 - s)) < mp.mpf(10)**-20 * max(1, abs(xi(s))) or abs(xi(s) - xi(1 - s)) / abs(xi(s)) < mp.mpf(10)**-18
# positivity of every summand of Phi for u>=0 and H_t(iy)>0
for n in (1, 2, 5):
    for u in (0, 0.01, 0.5, 2):
        assert 2 * mp.pi * n * n * mp.e**(4 * u) - 3 > 0
vals = []
for t in (-0.5, 0, 0.1, 0.5):
    for y in (0, 0.75, 1, 3):
        v = H(t, mp.mpc(0, y)); assert abs(v.imag) < 1e-25 and v.real > 0; vals.append(float(v.real))
out['min_H_t_iy_sample'] = min(vals)
# heat equation sign: d_t H = - d_zz H
z = mp.mpc(11.3, 0.4); t = mp.mpf('0.05'); h = mp.mpf('1e-4')
dt = (H(t + h, z) - H(t - h, z)) / (2 * h)
dzz = (H(t, z + h) - 2 * H(t, z) + H(t, z - h)) / h**2
out['heat_eq_residual_rel'] = float(abs(dt + dzz) / abs(dt))
assert abs(dt + dzz) / abs(dt) < 1e-6
# strip contraction: models with the same evolution e^{t u^2} cos(zu)
#  (i) z^2+a^2 -> z^2+a^2-2t : y^2 = a^2-2t exactly (rate 2 is sharp, sign as stated)
#  (ii) F_t(z)=e^{t}cos z + c, c>1: zeros x=pi(2k+1), y=arccosh(c e^{-t}); check y(t)^2 <= y(0)^2-2t
worst = None
for c in (1.05, 1.2, 2.0, 10.0):
    y0 = mp.acosh(c)
    for tt in (1e-14, 1e-6, 1e-3, 0.01, 0.04):
        if c * mp.e**(-tt) <= 1: continue
        y = mp.acosh(c * mp.e**(-tt))
        slack = (y0**2 - 2 * tt) - y**2
        assert slack >= 0, (c, tt, slack)
        worst = slack if worst is None else min(worst, slack)
out['model_contraction_min_slack'] = float(worst)
#  (iii) actual H_t: track the lowest zero pair is real; instead test the bound's direction on a
#        perturbed function G_t = H_t-type sum of two cosines with complex zeros
def G(t, z): return mp.e**(t) * mp.cos(z) + mp.mpf('0.3') * mp.e**(4 * t) * mp.cos(2 * z) + mp.mpf('1.5')
z0 = mp.findroot(lambda z: G(0, z), mp.mpc(2.2, 0.8))
ymax0 = None
# find all zeros of G_0 in one period by scanning starts
def zeros_at(t):
    zs = []
    for xr in mp.linspace(0, 2 * mp.pi, 9):
        for yi in (0.2, 0.6, 1.0, 1.5):
            try:
                r = mp.findroot(lambda z: G(t, z), mp.mpc(xr, yi))
            except Exception:
                continue
            if abs(G(t, r)) < 1e-20: zs.append(r)
    return zs
Z0 = zeros_at(0); a = max(abs(r.imag) for r in Z0)
chk = []
for tt in (0.01, 0.05, 0.1):
    Zt = zeros_at(tt); yt = max(abs(r.imag) for r in Zt)
    chk.append((tt, float(a**2 - 2 * tt - yt**2)))
    assert yt**2 <= a**2 - 2 * tt + 1e-20
out['two_cosine_model_slack'] = chk
print(json.dumps(out, indent=1))
print('R1 CHECKS PASS')
