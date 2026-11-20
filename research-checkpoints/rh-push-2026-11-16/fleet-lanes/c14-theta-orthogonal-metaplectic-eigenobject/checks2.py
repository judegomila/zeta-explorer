# c14-theta-orthogonal-metaplectic-eigenobject: checks for the decisive test (float64; measurements, not verdicts).
# Run: scripts/memcap.sh 8 .venv-arb/bin/python -I checks2.py <abs output json>
import sys, json, math, cmath, time
import numpy as np
import mpmath as mp
OUT = sys.argv[1]; t0 = time.time(); res = {}

def jacobi(a, n):
    a %= n; r = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0
def eps(d): return 1 if d % 4 == 1 else 1j
def factor(n):
    f = {}; n = abs(n); p = 2
    while p * p <= n:
        while n % p == 0: f[p] = f.get(p, 0) + 1; n //= p
        p += 1
    if n > 1: f[n] = f.get(n, 0) + 1
    return f
def gauss_h(m, p, k):
    v = 0; m0 = m
    while m0 % p == 0: m0 //= p; v += 1
    if k == 0: return 1
    if k % 2 == 0:
        if k <= v: return p**k - p**(k-1)
        if k == v + 1: return -p**(k-1)
        return 0
    if k == v + 1: return jacobi(m0, p) * p**(k - 0.5)
    return 0
def U(a, m, r):
    q = 2**a; s = 0
    for d in range(1, q, 2):
        x = d * r
        s += eps(x) * (jacobi(2, x)**a) * ((-1)**(((x-1)//2) * ((r-1)//2))) * cmath.exp(2j*math.pi*m*d/q)
    return s
_Ucache = {}
def W1(m, s):
    """weight of the trivial character mod 8 (checks.py B2: the other three weights vanish on every m tested;
       here the three are also evaluated and their maximum is recorded)"""
    v2 = 0; mm = m
    while mm % 2 == 0: mm //= 2; v2 += 1
    key = (v2, mm % 8 if mm > 0 else -((-mm) % 8) - 100)
    w = {}
    CH = {'1': (1,1,1,1), '-4': (1,-1,1,-1), '8': (1,-1,-1,1), '-8': (1,1,-1,-1)}
    for name, vals in CH.items():
        tot = 0
        for r, c in zip((1,3,5,7), vals):
            inner = 0
            for a in range(2, v2 + 4):
                kk = (a, m % (2**a), r)
                if kk not in _Ucache: _Ucache[kk] = U(a, m % (2**a), r)
                inner += (jacobi(2, r)**a) * 2**(-2*a*s) * _Ucache[kk]
            tot += c * eps(r) * inner
        w[name] = tot / 4
    return w

B = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6]
def hurwitz_vec(u, a, N=30):
    """zeta(u, a) for an array a in (0,1], Euler-Maclaurin, float64"""
    a = np.asarray(a, dtype=float)
    n = np.arange(N)[:, None]
    S = np.sum((n + a[None, :])**(-u), axis=0)
    x = N + a
    S = S + x**(1 - u) / (u - 1) + 0.5 * x**(-u)
    term = u * x**(-u - 1); fact = 2.0
    for k, b in enumerate(B):
        S = S + b / fact * term
        j = 2*k + 1
        term = term * (u + j) * (u + j + 1) / x**2
        fact *= (2*k + 3) * (2*k + 4)
    return S

def Lodd(m, u):
    """sum over odd n > 0 coprime to m of (m/n) n^{-u}"""
    modm = 1
    for p in factor(m):
        if p != 2: modm *= p
    q = 8 * modm
    aa = np.array([a for a in range(1, q, 2) if math.gcd(a, modm) == 1])
    chi = np.array([jacobi(m, int(a)) for a in aa])
    keep = chi != 0
    return np.sum(chi[keep] * hurwitz_vec(u, aa[keep] / q)) * q**(-u)

zcache = {}
def zeta_f(z):
    if z not in zcache: zcache[z] = complex(mp.zeta(z))
    return zcache[z]
maxnon = [0.0]
def A(m, s):
    u = 2*s - 0.5
    f = factor(m)
    w = W1(m, s)
    maxnon[0] = max(maxnon[0], abs(w['-4']), abs(w['8']), abs(w['-8']))
    L2 = zeta_f(2*u)
    for p in set(list(f) + [2]): L2 *= (1 - p**(-2*u))
    loc = 1
    for p, v in f.items():
        if p == 2: continue
        x = p**(-2*s)
        loc *= sum(gauss_h(m, p, k) * x**k for k in range(0, v + 2))
    return w['1'] * Lodd(m, u) / L2 * loc

# validation of the float path against mpmath Hurwitz
mp.mp.dps = 20
u = complex(0.5, 14.134725141734694)
va = hurwitz_vec(u, np.array([0.1, 0.37, 0.999, 1/8]))
vb = [complex(mp.zeta(u, a)) for a in (0.1, 0.37, 0.999, 0.125)]
res['hurwitz_float_vs_mpmath_max_abs_diff'] = float(max(abs(x - y) for x, y in zip(va, vb)))

rho1 = complex(mp.zetazero(1))
# ---- F. Shimura rows: sum_k p^k b(t p^{2k}) X^k = b(t) (1 - (t/p) p^{-1/2} X)/(1 - lam X + X^2), b(m) = A(m)|m|^{s-1}
F = {}
s = complex(0.83, 3.1)
def b(m, s): return A(m, s) * abs(m)**(s - 1)
mx = 0
for p in (3, 5):
    lam = p**(2*s - 1) + p**(1 - 2*s)
    for t in (1, 2, 5, -1, -3, 7):
        X = 0.11 - 0.07j
        K = 5 if p == 3 else 4
        lhs_c = [p**k * b(t * p**(2*k), s) for k in range(K + 1)]
        # coefficients of the rational function
        c = [b(t, s), (lam - jacobi(t, p) * p**-0.5) * b(t, s)]
        for k in range(2, K + 1): c.append(lam * c[-1] - c[-2])
        mx = max(mx, max(abs(x - y) for x, y in zip(lhs_c, c)))
F['max_abs_diff_row_coefficients_vs_recursion'] = mx
F['abs b(1) generic s=0.83+3.1i'] = abs(b(1, s))
sz = 0.25 + rho1/2
F['abs p^k b(p^2k) at s_rho, p=3, k=0..4'] = [abs(3**k * b(3**(2*k), sz)) for k in range(5)]
F['abs p^k b(5 p^2k) at s_rho, p=3, k=0..4'] = [abs(3**k * b(5 * 3**(2*k), sz)) for k in range(5)]
res['F_shimura_rows'] = F

# ---- G. mean square of the coefficients: S(X) = sum_{0<|m|<=X} |A(m)|^2 |m|^{2 sigma - 1}
def meansq(s, Xs):
    sig = s.real; out = {}; tot = 0.0; totD1 = 0.0
    Xmax = max(Xs)
    for m in range(1, Xmax + 1):
        for sg in (1, -1):
            a = abs(A(sg*m, s))**2 * m**(2*sig - 1)
            tot += a
            if sg == 1 and math.isqrt(m)**2 == m: totD1 += a
        if m in Xs:
            out[m] = {'S': tot, 'S/X': tot/m, 'S/X^(2sigma)': tot/m**(2*sig), 'S/(X log X)': tot/(m*math.log(m)), 'S/X^P, P = 1+|2sigma-1|': tot/m**(1+abs(2*sig-1)),
                      'part from m = n^2': totD1}
    return out
Xs = (125, 250, 500, 1000, 2000)
G = {}
G['zero1 (u = rho_1, sigma = 1/2; prediction: double pole at w = 1, S ~ c X log X)'] = meansq(sz, Xs)
sg_ = 0.25 + complex(0.8, 14.134725141734694)/2
G['generic u = 0.8 + 14.1347i (sigma = 0.65; prediction: pole at w = 2 sigma = 1.3, S ~ c X^1.3)'] = meansq(sg_, Xs)
sg2 = 0.25 + complex(0.3, 14.134725141734694)/2
G['generic u = 0.3 + 14.1347i (sigma = 0.40; prediction: pole at w = 2 - 2 sigma = 1.2, S ~ c X^1.2)'] = meansq(sg2, Xs)
res['G_mean_square'] = G
# ---- H. 2-adic sums for m = 4^j: eps_r (2/r)^a U_a(4^j, r) is independent of r, with the four case values
H = {}; worst = 0; bad = []
z8 = cmath.exp(2j*math.pi/8)
for j in range(0, 7):
    m = 4**j
    for a in range(2, 2*j + 6):
        vals = [eps(r) * (jacobi(2, r)**a) * U(a, m, r) for r in (1, 3, 5, 7)]
        if a <= 2*j: pred = (1+1j) * 2**(a-2) if a % 2 == 0 else 0
        elif a == 2*j + 1: pred = 0
        elif a == 2*j + 2: pred = (1+1j) * 2**(a-2)
        elif a == 2*j + 3: pred = 4 * z8 * 2**(a-3)
        else: pred = 0
        d = max(abs(v - pred) for v in vals); worst = max(worst, d / max(1, abs(pred)))
        if d > 1e-6 * max(1, abs(pred)): bad.append((j, a))
H['max_rel_diff_from_case_values_j<=6'] = worst; H['failures'] = bad
# closed forms that follow: A(1,s) and A(0,s)
def A1_closed(s):
    u = 2*s - 0.5
    return (1+1j) * 2**(-4*s) * (1 + 2**(1-u)) / (1 + 2**(-u)) * zeta_f(u) / zeta_f(2*u)
H['A(1,s) closed vs program'] = [abs(A1_closed(s) - A(1, s)) for s in (complex(0.83, 3.1), complex(1.4, -2.0))]
res['H_two_adic'] = H
res['max_abs_weight_of_nontrivial_characters_mod_8_over_all_m_used'] = maxnon[0]
res['seconds'] = time.time() - t0
json.dump(res, open(OUT, 'w'), indent=1)
print(json.dumps(res, indent=1))
