"""Second-referee checks for Statement O (lane c10-repair-record-referee-r9). mpmath, 30 digits, no large arrays
(largest allocation: a 1e7-byte sieve, 10 MB). Cases differ from the lane's and from REFEREE.md."""
import json, math
from mpmath import mp, mpf, mpc, zeta, zetazero, findroot, quad, pi, log, exp, sqrt, cosh, acosh, diff, gamma
mp.dps = 30
out = {}
# ---- line 1: Liouville twist zeta(2s)/zeta(s) at rho_4/2
g4 = zetazero(4).imag
s = mpc('0.25', g4/2)
out['L1_liouville_abs_at_rho4_half'] = float(abs(zeta(2*s)/zeta(s + mpf('1e-25')))) if False else float(abs(zeta(2*s)) )
out['L1_liouville_note'] = 'abs zeta(2s) at s = rho_4/2 (numerator zero; denominator zeta(s) at 1/4 + i g4/2 = %s)' % float(abs(zeta(s)))
# ---- line 2: DH
kap = (sqrt(10 - 2*sqrt(5)) - 2)/(sqrt(5) - 1)
chi = {1: 1, 2: 1j, 3: -1j, 4: -1}
def L(s, conj=False):
    tot = mpc(0)
    for a in range(1, 5):
        c = chi[a].conjugate() if conj else chi[a]
        tot += mpc(c)*zeta(s, mpf(a)/5)
    return tot*mpf(5)**(-s)
def dh(s, sign=1):
    return ((1 - sign*1j*kap)*L(s) + (1 + sign*1j*kap)*L(s, True))/2
s0 = mpc('0.8085171825', '85.6993484854')
sg = 1 if abs(dh(s0, 1)) < abs(dh(s0, -1)) else -1
out['L2_dh_sign'] = sg
f = lambda z: dh(z, sg)
r1 = findroot(f, mpc('0.79', '85.72'))
r2 = findroot(f, mpc('0.66', '114.15'))
out['L2_dh_roots'] = [str(r1), str(r2)]
# coefficients: a(n) periodic mod 5 = (1, kap, -kap, -1, 0) ; defect at 6
a = lambda n: [0, 1, kap, -kap, -1][n % 5]
out['L2_dh_mult_defect_6'] = float(a(6) - a(2)*a(3)); out['L2_dh_mult_defect_14'] = float(a(14) - a(2)*a(7))
# argument principle on the rectangle [0.7,0.9] x [85,86.5] (line 11: an identity that holds for DH and reads its zero)
def logder(z):
    return diff(f, z)/f(z)
c = [mpc('0.7', 85), mpc('0.9', 85), mpc('0.9', '86.5'), mpc('0.7', '86.5')]
I = 0
for k in range(4):
    p, q = c[k], c[(k+1) % 4]
    I += quad(lambda t: logder(p + (q - p)*t)*(q - p), [0, 0.5, 1])
out['L11_dh_argument_principle_count'] = str(I/(2j*pi))
# same count for the critical-line strip piece [0.4,0.6] x [85,86.5]? not needed
# ---- line 3: E_a, a = 0.11, gamma_5
aa = mpf('0.11'); g5 = zetazero(5).imag
s = mpc(mpf('0.5') + aa, g5)
out['L3_Ea_abs'] = float(abs(zeta(s + aa)*zeta(s - aa))); out['L3_point'] = str(s)
xi = lambda z: z*(z - 1)/2*pi**(-z/2)*gamma(z/2)*zeta(z)
z = mpc('0.23', '3.1')
out['L3_FE_defect'] = float(abs(xi(z + aa)*xi(z - aa) - xi(1 - z + aa)*xi(1 - z - aa))/abs(xi(z + aa)*xi(z - aa)))
# ---- line 6: T-NR q = 7, c = 5, k = 2 ; and c = -3, q = 11 (heights 2 pi k/log q)
def nr(s, q, c): return 2*cosh((s - mpf('0.5'))*log(q)) + c
q, cc, k = 7, mpf(5), 2
s = mpc(mpf('0.5') + acosh(cc/2)/log(q), (2*k + 1)*pi/log(q))
out['L6_nr_q7_c5'] = [str(s), float(abs(nr(s, q, cc)))]
q2, c2 = 11, mpf(-3)
s = mpc(mpf('0.5') + acosh(-c2/2)/log(q2), 2*pi*3/log(q2))
out['L6_nr_q11_cm3'] = [str(s), float(abs(nr(s, q2, c2)))]
z = mpc('0.31', '2.2'); out['L6_FE_defect'] = float(abs(nr(z, 7, cc) - nr(1 - z, 7, cc)))
# Dirichlet coefficients of zeta(s)(1 + c sqrt(q) q^-s + q q^-2s): multiplicativity defect, n < 200
def coef(n, q, c):
    v = 0; m = n
    while m % q == 0: m //= q; v += 1
    e = [1, 1 + c*sqrt(q), 1 + c*sqrt(q) + q]
    return e[min(v, 2)]
mx = 0
for m in range(1, 200):
    for n in range(1, 200):
        if math.gcd(m, n) == 1 and m*n < 400:
            mx = max(mx, abs(coef(m*n, 7, cc) - coef(m, 7, cc)*coef(n, 7, cc)))
out['L6_mult_defect'] = float(mx)
# ---- line 8: zeta(s)(1 - 2^(b-s)), b = 0.83, zero at b + 2 pi i 3/log 2 ; Dirichlet polynomial 1 - 9 * 2^-s
b = mpf('0.83'); s = mpc(b, 2*pi*3/log(2))
out['L8_finite_mod'] = [str(s), float(abs(zeta(s)*(1 - mpf(2)**(b - s))))]
s = mpc(log(9)/log(2), 2*pi*5/log(2)); out['L8_dirpoly_1_minus_9_2s'] = [str(s), float(abs(1 - 9*mpf(2)**(-s)))]
# ---- line 9: twin, s0 = 0.71 + 40.2i ; agreement at s = -12..-17
L4 = lambda z: mpf(4)**(-z)*(zeta(z, mpf(1)/4) - zeta(z, mpf(3)/4))
L5 = lambda z: mpf(5)**(-z)*(zeta(z, mpf(1)/5) - zeta(z, mpf(2)/5) - zeta(z, mpf(3)/5) + zeta(z, mpf(4)/5))
s0 = mpc('0.71', '40.2'); c = -zeta(s0)/(L4(s0)*L5(s0))
out['L9_c'] = str(c); out['L9_abs_at_s0'] = float(abs(zeta(s0) + c*L4(s0)*L5(s0)))
out['L9_max_prod_neg_int'] = float(max(abs(L4(-k)*L5(-k)) for k in range(12, 18)))
out['L9_scale_neg_int'] = float(min(abs(zeta(-k)) for k in (13, 15, 17)))
# ---- line 12: torus rotation: sup_t |G_P(sigma+it)| for a twist u equals prod (1-p^-sigma)^-1 (Kronecker)
import random
random.seed(20261119)
P = [2, 3, 5]; sig = 0.6
th = [random.uniform(0, 2*math.pi) for _ in P]
target = 1.0
for p in P: target *= 1/(1 - p**(-sig))
best = 0; bt = 0
import cmath
t = 0.0
while t < 60000:
    v = 1.0
    for p, h in zip(P, th):
        v *= 1/abs(1 - cmath.exp(1j*(h - t*math.log(p)))*p**(-sig))
    if v > best: best, bt = v, t
    t += 0.01
out['L12_torus'] = {'max_over_torus': target, 'sup_twisted_stage_t_le_6e4': best, 'at_t': bt, 'ratio': best/target, 'untwisted_value_at_same_t': float(abs(1/((1 - 2**(-sig - 1j*bt))*(1 - 3**(-sig - 1j*bt))*(1 - 5**(-sig - 1j*bt)))))}
# ---- line 7: THIN greedy set at b = 0.8 (differs from 0.9, 0.95): coefficient of the log singularity of P_S at s = b
N = 10**7
print('planned allocation: sieve bytearray', N + 1, 'bytes')
sv = bytearray([1])*(N + 1); sv[0] = sv[1] = 0
for i in range(2, int(N**0.5) + 1):
    if sv[i]: sv[i*i::i] = bytearray(len(sv[i*i::i]))
bb = 0.8; cnt = 0; targ = 0.0; acc = 0.0; prev = 2.0; rows = []; marks = [10**k for k in range(2, 8)]; mi = 0
dev = 0.0
for p in range(2, N + 1):
    if p == marks[mi] + 0 and False: pass
    if sv[p]:
        # target (1/2) int_2^p t^(b-1) dt / log t, midpoint rule between consecutive primes
        if p > 2:
            mid = 0.5*(prev + p); targ += 0.5*(p - prev)*mid**(bb - 1)/math.log(mid); prev = float(p)
        if cnt + 1 <= targ + 1e-12 or cnt < targ:
            cnt += 1; acc += p**(-bb)
        dev = max(dev, abs(cnt - targ)) if p > 1000 else dev
    if p == marks[mi]:
        rows.append([p, cnt, round(targ, 3), acc - 0.5*math.log(math.log(p)/math.log(2))]); mi = min(mi + 1, len(marks) - 1)
out['L7_thin_b08'] = {'rows_X_count_target_sumMinusHalfLogLog': rows, 'max_abs_count_minus_target_p_gt_1000': dev}
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
