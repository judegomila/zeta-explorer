# Numeric checks for the three-question pre-filter (Lemma B and the scope of Q-B, Q-S). mpmath, small sizes.
# Planned allocation: Pick matrices of order 10 at 80 digits; a few hundred function evaluations. Under 50 MB.
import json, random
from mpmath import mp, mpf, mpc, matrix, eigh, exp, log, cosh, acosh, pi, conj, re, im, fabs
mp.dps = 80
random.seed(14)
out = {}
def rpt(lo=0.05, hi=3.0, h=6.0):
    return mpc(mpf(random.uniform(lo, hi)), mpf(random.uniform(-h, h)))
def theta(z, a):          # Blaschke pair over a, conj a (Re a > 0)
    return (z - a)*(z - conj(a))/((z + a)*(z + conj(a)))
def M0(z):                # a Schur function on Re z > 0, not inner: e^{-z/2} * (z-2)/(z+2) * 9/10
    return mpf(9)/10*exp(-z/2)*(z - 2)/(z + 2)
def pick(f, nodes):
    n = len(nodes); P = matrix(n, n)
    for i in range(n):
        for j in range(n):
            P[i, j] = (1 - f(nodes[i])*conj(f(nodes[j])))/(nodes[i] + conj(nodes[j]))
    E = eigh(P, eigvals_only=True)
    return min(E), max(E)
# 1. identity 1 - (Theta M)(z) conj((Theta M)(w)) = [1 - Theta(z) conj Theta(w)] + Theta(z)[1 - M(z) conj M(w)] conj Theta(w)
a = mpc('0.3', '2.7'); worst = mpf(0)
for _ in range(200):
    z, w = rpt(), rpt()
    lhs = 1 - theta(z, a)*M0(z)*conj(theta(w, a)*M0(w))
    rhs = (1 - theta(z, a)*conj(theta(w, a))) + theta(z, a)*(1 - M0(z)*conj(M0(w)))*conj(theta(w, a))
    worst = max(worst, fabs(lhs - rhs))
out['B1_identity_max_defect'] = float(worst)
# 2. Pick matrices: M0, M0*Theta (zero inserted), M0/Theta (pole inserted)
res = []
for trial in range(6):
    nodes = [rpt(0.1, 2.0, 5.0) for _ in range(10)]
    r = {}
    for name, f in (('M', M0), ('M*Theta', lambda z: M0(z)*theta(z, a)), ('M/Theta', lambda z: M0(z)/theta(z, a))):
        lo, hi = pick(f, nodes); r[name] = [float(lo/hi)]
    res.append(r)
out['B2_pick_min_over_max_eig'] = res
out['B2_summary'] = {k: [min(x[k][0] for x in res), max(x[k][0] for x in res)] for k in ('M', 'M*Theta', 'M/Theta')}
# 3. T-NR as a Blaschke factor on the scattering carrier: Dz/D(z+1), D(z) = q^(z-1/2) + q^(1/2-z) + c
tn = []
for q, c in ((2, mpf('2.0506')), (3, mpf('2.0785')), (3, mpf('2.2'))):
    l = log(q); b = acosh(c/2)/l
    D = lambda z: exp((z - mpf(1)/2)*l) + exp((mpf(1)/2 - z)*l) + c
    mx = max(fabs(D(z)/D(z + 1)) for z in (rpt(0.01, 4.0, 40.0) for _ in range(400)))
    ax = max(fabs(fabs(D(mpc(0, t))/D(mpc(1, t))) - 1) for t in (mpf(random.uniform(-40, 40)) for _ in range(100)))
    z0 = mpf(1)/2 + b + 1j*pi/l
    tn.append({'q': q, 'c': float(c), 'b': float(b), 'sup_modulus_Re_z_gt_0_sampled': float(mx), 'axis_unimodular_defect': float(ax),
               'abs_D_at_zero': float(fabs(D(z0))), 'abscissa_abs_conv_of_1_over_D_form': float(mpf(1)/2 + b)})
    # 4. bridge carrier: ratio m(w-a)/m(w+a), m(w) = q^w + q^-w + c, a < b: pole in Re w > 0 at w = b - a + i pi/l
    aa = b/2; m = lambda w: exp(w*l) + exp(-w*l) + c
    wp = (b - aa) + 1j*pi/l
    tn[-1]['bridge_ratio_a'] = float(aa)
    tn[-1]['bridge_ratio_modulus_near_pole'] = float(fabs(m(wp + mpf('1e-6') - aa)/m(wp + mpf('1e-6') + aa)))
    tn[-1]['bridge_ratio_on_axis_defect'] = float(max(fabs(fabs(m(mpc(-aa, t))/m(mpc(aa, t))) - 1) for t in (mpf(1), mpf(3), mpf(7))))
out['B3_B4_tnr'] = tn
# 5. Q-S: kernel covariance H^G(w,s) = H(w,s) G(s)/G(w): G(s)/G(w) equals 1 at w = s and at w = 1 - s for symmetric G
q, c = 3, mpf('2.2'); l = log(q)
G = lambda s: exp((s - mpf(1)/2)*l) + exp((mpf(1)/2 - s)*l) + c
d = max(max(fabs(G(s)/G(1 - s) - 1), fabs(G(s)/G(s) - 1)) for s in (rpt(0.1, 0.9, 30) for _ in range(50)))
out['S1_symmetric_multiplier_defect'] = float(d)
json.dump(out, open('tmp/research-2026-11-16/push/c14-prefilter-sweep-geometric-nodes/checks.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
