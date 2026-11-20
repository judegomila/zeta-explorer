"""R9: checks of the identities of sec 4.2-4.3 (own code). Usage: python3 -I identities.py <inputs/workspace> <venv-free; needs mpmath if present>"""
import sys, json
from fractions import Fraction as F
from math import factorial, comb
ws = sys.argv[1]
out = {}
# --- (95)-(96): Pade [6/6]. exact power-series check of e^{-x}P(x)-P(-x) through x^30
c = [F(factorial(12-k)*factorial(6), factorial(12)*factorial(k)*factorial(6-k)) for k in range(7)]
assert c == [1, F(1,2), F(5,44), F(1,66), F(1,792), F(1,15840), F(1,665280)]
assert [int(665280*x) for x in reversed(c)] == [1, 42, 840, 10080, 75600, 332640, 665280]
NT = 40
ser = [sum(F((-1)**(n-k), factorial(n-k))*c[k] for k in range(0, min(n, 6)+1)) - (c[n]*(-1)**n if n <= 6 else 0) for n in range(NT)]
assert all(s == 0 for s in ser[:13])
# predicted series of -x^13/12! * int_0^1 e^{-tx} t^6(1-t)^6 dt : coefficient of x^(13+j) = -(-1)^j/(j! 12!) * B(7+j,7)
pred = [-(F((-1)**j, factorial(j)*factorial(12)) * F(factorial(6+j)*factorial(6), factorial(13+j))) for j in range(NT-13)]
assert ser[13:] == pred
out['pade_identity_series_to_x^39'] = True
def P(x): return sum(ck*x**k for k, ck in enumerate(c))
def expneg_lower(x, K=60):   # alternating Taylor ending on odd index: lower bound for 0<=x<=1 ; for larger x use (e^{-x/2^j})^(2^j)
    j = 0
    while x > 1: x /= 2; j += 1
    s = F(0); t = F(1)
    for k in range(K): s += t if k % 2 == 0 else -t; t = t*x/(k+1)
    assert K % 2 == 0
    return s**(2**j) if s > 0 else F(0)
worst = None
for x in [F(1, 10**7), F(6, 10**6), F(11, 10**6), F(1, 1000), F(1, 10), F(1), F(3), F(7), F(9), F(12), F(20)]:
    d = P(-x)/P(x) - expneg_lower(x)      # >= Pade - e^{-x} is not implied; this is Pade - (lower bound of e^-x) >= Pade - e^-x
    out['pade_minus_explower_at_%s' % x] = float(d)
# sign of P(-x): positive on the range used (x = r*dt <= 1.2e-5), and P(-x)>0 on [0, 8]? evaluate
out['P(-x)_sign_samples'] = {str(x): float(P(-x)) for x in [F(1,10**5), 1, 5, 8, 9, 10, 12]}
# direct mp check that Pade >= e^{-x}
try:
    import mpmath as mp
    mp.mp.dps = 80
    vals = {}
    for xs in ['1e-7', '6.05e-6', '1.11e-5', '1e-3', '0.5', '2', '6', '10', '30']:
        x = mp.mpf(xs); pv = lambda z: sum(mp.mpf(ck.numerator)/ck.denominator*z**k for k, ck in enumerate(c))
        vals[xs] = mp.nstr(pv(-x)/pv(x) - mp.e**(-x), 8)
    out['mp_pade_minus_exp'] = vals
except ImportError:
    out['mp_pade_minus_exp'] = 'mpmath not available'
# --- (98): Newton recurrence vs binomial closed form vs direct symbolic derivative via partial fractions with rational y
import random
random.seed(1)
for _ in range(200):
    p = F(random.randint(20, 80), 10); y = F(random.randint(1, 15), 20); q = y*y
    A = 2*p/(p*p-q); B = 1/(p*p-q)
    S = [F(2), A]
    for j in range(1, 12): S.append(A*S[j] - B*S[j-1])
    for m in range(0, 10):
        direct = (-1)**m*((p-y)**-(m+1) + (p+y)**-(m+1))        # (1/m!) d^m/dp^m [1/(p-y)+1/(p+y)]
        binom = (-1)**m*2*sum(comb(m+1, 2*k)*p**(m+1-2*k)*q**k for k in range((m+1)//2+1))/(p*p-q)**(m+1)
        assert direct == (-1)**m*S[m+1] == binom
out['newton_identity_200x10_exact'] = True
# finite-difference check that the closed form is the m-th p-derivative (m=1,2) at one point
p, q, e = F(4), F(1, 13), F(1, 10**6)
f = lambda z: 2*z/(z*z-q)
d1 = (f(p+e)-f(p-e))/(2*e); d2 = (f(p+e)-2*f(p)+f(p-e))/(e*e)
y2 = q
S2 = lambda m: (-1)**m*2*sum(comb(m+1, 2*k)*p**(m+1-2*k)*y2**k for k in range((m+1)//2+1))/(p*p-y2)**(m+1)
out['fd_check'] = [float(d1 - S2(1)), float(d2/2 - S2(2))]
# --- (87): node own pair = w * sum_{+-} (h -+ y)/((h -+ y)^2 + v^2)
for _ in range(200):
    h = F(random.randint(25, 60), 10); v = F(random.randint(-39, 39), 20); y = F(random.randint(1, 15), 20); q = y*y
    lhs = (h-y)/((h-y)**2+v*v) + (h+y)/((h+y)**2+v*v)
    assert lhs == 2*h*(h*h+v*v-q)/((h*h+v*v-q)**2+4*v*v*q)
out['node_own_pair_is_sum_of_two_conjugate_kernels'] = True
# --- Lemma 4.1 / (90),(93): Q(u) >= q0-(2+r q0)u ; and Q solves Q'=-2-rQ (mp)
try:
    import mpmath as mp
    worst = mp.inf
    for q0 in ['0.5625', '0.07', '0.0001']:
        for r in ['12.38', '22.69', '200']:
            for u in ['0', '1e-9', '4.8828125e-7', '1e-3', '0.01']:
                q0m, rm, um = mp.mpf(q0), mp.mpf(r), mp.mpf(u)
                Q = lambda z: (q0m + 2/rm)*mp.e**(-rm*z) - 2/rm
                worst = min(worst, Q(um) - (q0m - (2 + rm*q0m)*um))
                assert abs(mp.diff(Q, um) - (-2 - rm*Q(um))) < mp.mpf(10)**-40
    out['lemma41_min_gap'] = mp.nstr(worst, 5)
except ImportError: pass
# --- spot check (not a proof): own pair nondecreasing in q on [0, cap], S nondecreasing in t, all 67 rows, 400 exact rational grid points
plan = json.load(open(ws + '/lambda_round14/material/m8_late/M8_LATE_PLAN.json'))
def own(q, pr):
    tot = F(0)
    for nd in pr['nodes']:
        h, v, w = F(nd['height']), F(nd['shift']), F(nd['weight'])
        tot += 2*w*h*(h*h+v*v-q)/((h*h+v*v+q)**2 - 4*h*h*q)
    ov = pr.get('joint_jet_overlay')
    if ov is None: return tot
    tot *= F(ov['alpha'])
    for cc in ov['centres']:
        p = F(cc['p'])
        for m, b in enumerate(map(F, cc['b'])):
            tot += 2*b*p**(m-1)*(-1)**m*2*sum(comb(m+1, 2*k)*p**(m+1-2*k)*q**k for k in range((m+1)//2+1))/(p*p-q)**(m+1)
    return tot
mono = True; mininc = None
for pr in plan['rows']:
    cap = F(pr['q_interval'][1]); prev = None
    for k in range(401):
        val = own(cap*k/400, pr)
        if prev is not None:
            inc = val - prev
            if inc < 0: mono = False
            if mininc is None or inc < mininc[0]: mininc = (inc, pr['row'], k)
        prev = val
out['own_pair_nondecreasing_on_400pt_grid_all_rows'] = mono
out['smallest_grid_increment'] = [float(mininc[0]), mininc[1], mininc[2]]
print(json.dumps(out, indent=1))
