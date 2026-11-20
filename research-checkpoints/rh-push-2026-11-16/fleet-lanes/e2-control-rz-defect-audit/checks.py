# e2-control-rz-defect-audit: numerical checks (mpmath floats, not interval-certified).
import json, math
from fractions import Fraction
import mpmath as mp
mp.mp.dps = 30
out = {}

def primes(n):
    s = bytearray([1])*(n+1); s[0:2] = b'\0\0'
    for i in range(2, int(n**.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(n+1) if s[i]]

# ---------- 1. RZ_b ----------
b = mp.mpf('0.93')
RZ = lambda s: 1/mp.zeta(s + 1 - b)
r = {}
P = primes(200000)
s0 = mp.mpc(2.5, 3)
prod = mp.mpf(1)
for p in P: prod *= (1 - mp.mpf(p)**(b-1-s0))
r['euler_product_vs_closed_form_at_2.5+3i_(p<=2e5)'] = float(abs(prod - RZ(s0)))
# Dirichlet series sum mu(n) n^(b-1) n^-s, n <= 2e5
N = 200000
mu = [1]*(N+1)
for p in primes(N):
    for k in range(p, N+1, p): mu[k] = -mu[k]
    for k in range(p*p, N+1, p*p): mu[k] = 0
ds = mp.fsum(mu[n]*mp.mpf(n)**(b-1-s0) for n in range(1, N+1) if mu[n])
r['dirichlet_series_vs_closed_form'] = float(abs(ds - RZ(s0)))
r['RZ(b+1e-12)/1e-12 (expect 1: simple zero at s=b)'] = float(mp.re(RZ(b + mp.mpf('1e-12'))/mp.mpf('1e-12')))
# log-derivative coefficients -n^(b-1) Lambda(n) at s=3
s1 = mp.mpf(3)
ld = mp.diff(lambda s: mp.log(RZ(s)), s1)
# RZ'/RZ = + sum n^(b-1) Lambda(n) n^-s  => -RZ'/RZ = sum c(n) n^-s with c(n) = -n^(b-1) Lambda(n)
lam = mp.mpf(0)
for p in primes(20000):
    pk = p
    while pk <= 20000:
        lam += math.log(p)*mp.mpf(pk)**(b-1-s1); pk *= p
r['-RZ\'/RZ(3) + sum n^(b-1)Lambda(n) n^-3 (expect ~0 up to tail 1e-9)'] = float(abs(-ld + lam))
# functional equation about Re s = b - 1/2 : G(s) = pi^{-s'/2} Gamma(s'/2) zeta(s'), s' = s+1-b; 1/G(s) = 1/G(2b-1-s)
G = lambda s: mp.pi**(-(s+1-b)/2)*mp.gamma((s+1-b)/2)*mp.zeta(s+1-b)
fe = []
for s in [mp.mpc(0.3, 7), mp.mpc(1.4, 21.5), mp.mpc(-0.6, 2)]:
    fe.append(float(abs(1/G(s) - 1/G(2*b-1-s))/abs(1/G(s))))
r['FE_relative_residuals'] = fe
r['poles_first3 (zeta zeros shifted by b-1): Re'] = [float(mp.re(mp.zetazero(k) - (1-b))) for k in (1,2,3)]
r['symmetry_line'] = float(b - mp.mpf(1)/2)
out['RZ_b (b=0.93)'] = r

# ---------- 2. winding numbers: zeros minus poles to the right of 1/2 + delta + eta ----------
mp.mp.dps = 15
chi4 = [0, 1, 0, -1]
def Dq(q, c):
    return lambda s: 1 + c*mp.mpf(q)**(mp.mpf(1)/2 - s) + mp.mpf(q)**(1 - 2*s)
def d0(q, c): return math.acosh(abs(c)/2)/math.log(q)

def winding(F, x0, x1, y0, y1, h=0.02):
    pts = []
    def seg(a, bb):
        n = max(2, int(abs(bb-a)/h))
        return [a + (bb-a)*k/n for k in range(n)]
    pts += seg(complex(x0,y0), complex(x1,y0)); pts += seg(complex(x1,y0), complex(x1,y1))
    pts += seg(complex(x1,y1), complex(x0,y1)); pts += seg(complex(x0,y1), complex(x0,y0))
    tot = 0.0; prev = None; maxstep = 0.0
    for z in pts + [pts[0]]:
        v = complex(F(mp.mpc(z)))
        a = math.atan2(v.imag, v.real)
        if prev is not None:
            d = a - prev
            while d > math.pi: d -= 2*math.pi
            while d < -math.pi: d += 2*math.pi
            tot += d; maxstep = max(maxstep, abs(d))
        prev = a
    return tot/(2*math.pi), maxstep

a1, a2, a5, a6, a8, b8 = 0.2, 0.15, 0.1, 0.3, 0.1, 0.2
members = [
 ('E_a = zeta(s+a)zeta(s-a), a=0.2', lambda s: mp.zeta(s+a1)*mp.zeta(s-a1), a1, {'poles': [1-a1, 1+a1]}),
 ('L(s+a,chi4)L(s-a,chi4), a=0.15', lambda s: mp.dirichlet(s+a2, chi4)*mp.dirichlet(s-a2, chi4), a2, {'poles': []}),
 ('T-NR q=3 c=2.2', lambda s: mp.zeta(s)*Dq(3,2.2)(s), d0(3,2.2), {'poles': [1.0]}),
 ('T-NR two primes q=2 c=-2.5, q=5 c=2.3', lambda s: mp.zeta(s)*Dq(2,-2.5)(s)*Dq(5,2.3)(s), max(d0(2,-2.5), d0(5,2.3)), {'poles': [1.0]}),
 ('E_a * D_{3,2.2}, a=0.1', lambda s: mp.zeta(s+a5)*mp.zeta(s-a5)*Dq(3,2.2)(s), max(a5, d0(3,2.2)), {'poles': [1+a5]}),
 ('zeta(s+a)zeta(s-a)/zeta(s), a=0.3', lambda s: mp.zeta(s+a6)*mp.zeta(s-a6)/mp.zeta(s), max(a6, 0.5), {'poles': [1+a6]}),
 ('1/zeta(s) (RZ_b in own coordinate)', lambda s: 1/mp.zeta(s), 0.5, {'poles': []}),
 ('zeta(s+a)zeta(s-a)/(zeta(s+b)zeta(s-b)), a=0.1 b=0.2', lambda s: mp.zeta(s+a8)*mp.zeta(s-a8)/(mp.zeta(s+b8)*mp.zeta(s-b8)), 0.5+b8, {'poles': [1+a8]}),
]
W = json.load(open(__file__.replace('checks.py', 'winding.json')))  # produced by the first run of this script (winding_run.log); E_a pole count corrected to 2 (poles at 1-a and 1+a)
WINDING_CODE = r'''
eta = 0.013
W = {}
for name, F, delta, info in members:
    x0 = 0.5 + delta + eta
    npoles = sum(1 for p in info['poles'] if p > x0)
    w, ms = winding(F, x0, 3.0, -0.7, 40.3)
    # strip just left: between 1/2 + delta - eta .. 1/2 + delta + eta  (zeros at offset exactly delta)
    w2, ms2 = winding(F, 0.5 + delta - eta, 0.5 + delta + eta, -0.7, 40.3, h=0.01)
    W[name] = {'D1_defect': delta, 'box_right_of_line: zeros-poles': round(w, 4), 'known poles in box': npoles,
               'zeros in box (winding + poles)': round(w + npoles, 4), 'max arg step': round(ms, 3),
               'thin strip around offset=defect: zeros-poles': round(w2, 4), 'strip max arg step': round(ms2, 3)}
    print(name, W[name], flush=True)
'''
out['winding'] = W

# ---------- 3. Liouville quotient zeta(2s)/zeta(s): unimodular Euler product, no FE, zero at s=1 ----------
mp.mp.dps = 30
out['zeta(2s)/zeta(s)'] = {'value at 1+1e-10 divided by 1e-10 (expect zeta(2) = 1.6449...)':
    float(mp.zeta(2*(1+mp.mpf('1e-10')))/mp.zeta(1+mp.mpf('1e-10'))/mp.mpf('1e-10'))}

# ---------- 4. function-field fake Z(T) = (1-5T+5T^2)/((1-T)(1-5T)) ----------
# N_n = 5^n + 1 - s_n, s_n = alpha1^n + alpha2^n, s_0 = 2, s_1 = 5, s_n = 5 s_{n-1} - 5 s_{n-2}
D = 400
s = [2, 5]
for n in range(2, D+1): s.append(5*s[-1] - 5*s[-2])
Nn = [None] + [5**n + 1 - s[n] for n in range(1, D+1)]
def mobius(n):
    m = 1; k = 2
    while k*k <= n:
        if n % k == 0:
            n //= k
            if n % k == 0: return 0
            m = -m
        k += 1
    if n > 1: m = -m
    return m
ad = []
for d in range(1, D+1):
    t = sum(mobius(d//e)*Nn[e] for e in range(1, d+1) if d % e == 0)
    assert t % d == 0
    ad.append(t//d)
# Euler product check: prod_d (1 - T^d)^(-a_d) == Z(T) mod T^41 (exact integers)
M = 40
ser = [1] + [0]*M
for d in range(1, M+1):
    a = ad[d-1]
    fac = [0]*(M+1); c = 1; j = 0
    while j*d <= M:
        fac[j*d] = c; c = c*(a+j)//(j+1); j += 1   # binomial(a+j-1, j)
    ser = [sum(ser[i]*fac[n-i] for i in range(n+1)) for n in range(M+1)]
# Z(T) coefficients: (1-5T+5T^2) * 1/((1-T)(1-5T))
base = [(5**(n+1)-1)//4 for n in range(M+1)]
Z = [base[n] - (5*base[n-1] if n >= 1 else 0) + (5*base[n-2] if n >= 2 else 0) for n in range(M+1)]
r5 = math.sqrt(5)
out['fake_F5'] = {
 'a_d (d=1..10)': ad[:10], 'min a_d for d<=400': min(ad), 'all a_d >= 0 and integral (d<=400)': all(x >= 0 for x in ad),
 'Euler product equals Z(T) mod T^41 (exact)': ser == Z,
 'coefficients A_n (n=0..8)': Z[:9], 'max A_n/5^n (n<=40)': max(Z[n]/5**n for n in range(M+1)),
 'zeros Re s': [-math.log((5-r5)/10)/math.log(5), -math.log((5+r5)/10)/math.log(5)],
 'offset from 1/2': -math.log((5-r5)/10)/math.log(5) - 0.5,
 'FE check: T1*T2 = 1/5': ((5-r5)/10)*((5+r5)/10),
}
json.dump(out, open(__file__.replace('checks.py','checks.json'), 'w'), indent=1)
print(json.dumps({k: v for k, v in out.items() if k != 'winding'}, indent=1))
