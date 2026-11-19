# c14-theta-orthogonal-metaplectic-eigenobject: checks of the first lemma.
# Run: scripts/memcap.sh 8 .venv-arb/bin/python -I checks.py <abs output json>
import sys, json, math, cmath, time
import numpy as np
import mpmath as mp
mp.mp.dps = 30
OUT = sys.argv[1]
t0 = time.time()
res = {}

def jacobi(a, n):
    assert n > 0 and n % 2 == 1
    a %= n; r = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0

def eps(d):  # d odd
    return 1 if d % 4 == 1 else 1j

def factor(n):
    f = {}; n = abs(n); p = 2
    while p * p <= n:
        while n % p == 0:
            f[p] = f.get(p, 0) + 1; n //= p
        p += 1
    if n > 1: f[n] = f.get(n, 0) + 1
    return f

# ---------- A. brute-force sums K(m,c) = sum_{d mod c, (d,c)=1, d>0} eps_d (c/d) e(md/c), 4 | c
def K_all(c):
    """vector K(m,c), m = 0..c-1, by FFT"""
    v = np.zeros(c, dtype=complex)
    for d in range(1, c, 2):
        if math.gcd(d, c) == 1:
            v[d] = eps(d) * jacobi(c, d)
    return np.fft.ifft(v) * c   # sum_d v[d] e(+md/c)

# ---------- factorised form
def gauss_h(m, p, k):
    """h_m(p^k) = eps_{p^k}^{-1} sum*_{d mod p^k} (d/p)^k e(md/p^k), closed form; p odd"""
    if m == 0:
        return (p**k - p**(k-1)) if (k % 2 == 0 and k > 0) else (1 if k == 0 else 0)
    v = 0; m0 = m
    while m0 % p == 0: m0 //= p; v += 1
    if k == 0: return 1
    if k % 2 == 0:
        if k <= v: return p**k - p**(k-1)
        if k == v + 1: return -p**(k-1)
        return 0
    if k == v + 1: return jacobi(m0, p) * p**(k - 0.5)
    return 0

def gauss_h_direct(m, p, k):
    q = p**k
    s = sum((jacobi(d, p)**k) * cmath.exp(2j*math.pi*m*d/q) for d in range(1, q) if d % p)
    return s / eps(q)

def U(a, m, r):
    """2-part: sum over odd d mod 2^a of eps_{dr} (2/(dr))^a (-1)^{(dr-1)(r-1)/4} e(md/2^a)"""
    q = 2**a; s = 0
    for d in range(1, q, 2):
        x = d * r
        s += eps(x) * (jacobi(2, x)**a) * ((-1)**(((x-1)//2) * ((r-1)//2))) * cmath.exp(2j*math.pi*m*d/q)
    return s

def K_fact(m, c):
    a = 0; cp = c
    while cp % 2 == 0: cp //= 2; a += 1
    h = 1
    for p, k in factor(cp).items(): h *= gauss_h(m, p, k)
    return (jacobi(2, cp)**a) * eps(cp) * h * U(a, m, cp % 8)

# A1: closed form of h against the direct Gauss sum
mx = 0
for p in (3, 5, 7, 11):
    for k in (1, 2, 3, 4):
        if p**k > 2500: continue
        for m in (0, 1, 2, 3, 5, 9, 15, 25, 27, 45, 49, 75, 81, 121, -1, -3, -9, -75):
            mx = max(mx, abs(gauss_h(m, p, k) - gauss_h_direct(m, p, k)))
res['A1_max_diff_h_closed_vs_direct'] = mx

# A2: K(m,c) brute force against the factorised form, every c = 4..C step 4, m in a list
C = 1200
ms = [0, 1, 4, 9, 16, 25, 36, 49, 2, 3, 5, 6, 7, 8, 12, 15, 18, 20, 45, 75, -1, -2, -3, -4, -5, -7, -8, -9, -15, -20]
Ktab = {}
mx = 0; mxK = 0
for c in range(4, C + 1, 4):
    Kv = K_all(c); Ktab[c] = Kv
    for m in ms:
        b = Kv[m % c]; f = K_fact(m, c)
        mx = max(mx, abs(b - f)); mxK = max(mxK, abs(b))
res['A2_max_diff_K_bruteforce_vs_factorised'] = mx
res['A2_max_abs_K'] = mxK
res['A2_C'] = C

# A3: U_a(m,r) = 0 for a > v_2(m) + 3 (m != 0)
bad = []
for m in ms:
    if m == 0: continue
    v2 = 0; mm = m
    while mm % 2 == 0: mm //= 2; v2 += 1
    for a in range(v2 + 4, v2 + 8):
        for r in (1, 3, 5, 7):
            if abs(U(a, m, r)) > 1e-9: bad.append((m, a, r))
res['A3_U_nonzero_beyond_v2_plus_3'] = bad

# ---------- B. the Dirichlet series A(m,s) = sum_{4|c} K(m,c) c^{-2s} in closed form
CH8 = {  # characters mod 8 on odd residues
 '1':   {1: 1, 3: 1, 5: 1, 7: 1},
 '-4':  {1: 1, 3: -1, 5: 1, 7: -1},
 '8':   {1: 1, 3: -1, 5: -1, 7: 1},
 '-8':  {1: 1, 3: 1, 5: -1, 7: -1},
}
def Wpsi(m, s, name):
    """2-adic weight of the character psi mod 8 (m != 0)"""
    v2 = 0; mm = m
    while mm % 2 == 0: mm //= 2; v2 += 1
    tot = mp.mpc(0)
    for r in (1, 3, 5, 7):
        inner = mp.mpc(0)
        for a in range(2, v2 + 4):
            inner += (jacobi(2, r)**a) * mp.power(2, -2*a*s) * mp.mpmathify(complex(U(a, m, r)))
        tot += CH8[name][r] * mp.mpmathify(complex(eps(r))) * inner
    return tot / 4

def Lodd(m, name, u):
    """sum over odd n coprime to m of psi(n) (m/n) n^{-u}  (Jacobi symbol, n > 0), by Hurwitz zeta"""
    modm = 1
    for p in factor(m):
        if p != 2: modm *= p
    q = 8 * modm
    tot = mp.mpc(0)
    for a in range(1, q, 2):
        if math.gcd(a, modm) != 1: continue
        chi = CH8[name][a % 8] * kron_m(m, a)
        if chi: tot += chi * mp.zeta(u, mp.mpf(a) / q)
    return tot * mp.power(q, -u)

def kron_m(m, n):  # (m/n) for odd n > 0
    return jacobi(m, n)

def A_closed(m, s):
    """A(m,s) for m != 0, valid by continuation wherever the L-functions are defined"""
    u = 2*s - mp.mpf(1)/2
    f = factor(m)
    tot = mp.mpc(0)
    for name in CH8:
        w = Wpsi(m, s, name)
        if abs(w) < mp.mpf(10)**(-22): continue
        # primes not dividing 2m: prod (1 + psi(p)(m/p) p^{-u}) = L(u, psi chi_m)/L(2u, principal mod 2m)
        L1 = Lodd(m, name, u)
        L2 = mp.zeta(2*u)
        for p in set(list(f) + [2]): L2 *= (1 - mp.power(p, -2*u))
        loc = mp.mpc(1)
        for p, v in f.items():
            if p == 2: continue
            x = CH8[name][p % 8] * mp.power(p, -2*s)
            lp = mp.mpc(0)
            for k in range(0, v + 2):
                h = gauss_h(m, p, k)
                if h: lp += h * x**k
            loc *= lp
        tot += w * L1 / L2 * loc
    return tot

def weights(m, s):
    return {name: complex(Wpsi(m, s, name)) for name in CH8}

# B1: closed form against the truncated brute-force Dirichlet series at 2s = 3.6 and 3.6 + 1.4i
out = {}
for s in (mp.mpf('1.8'), mp.mpc('1.8', '0.7')):
    mx = 0
    for m in ms:
        if m == 0: continue
        bf = sum(complex(Ktab[c][m % c]) * complex(mp.power(c, -2*s)) for c in Ktab)
        cl = complex(A_closed(m, s))
        mx = max(mx, abs(bf - cl))
    out[str(s)] = mx
res['B1_max_diff_series_vs_closed_form'] = out
res['B1_note'] = 'truncation c <= %d, tail bound about C^(-2.1)' % C

# B2: for m a square, only the trivial character mod 8 has non-zero weight (polynomial identity in 2^{-2s}; tested at 12 points, degree <= v2+3 <= 7 in 2^{-2s})
pts = [mp.mpc(0.3 + 0.17*j, 0.9 - 0.31*j) for j in range(12)]
sq = {}
for m in (1, 4, 9, 16, 25, 36, 49, 64, 81, 144):
    w_non = 0; w_tr = None
    for s in pts:
        w = weights(m, s)
        w_non = max(w_non, abs(w['-4']), abs(w['8']), abs(w['-8']))
        w_tr = abs(w['1']) if w_tr is None else min(w_tr, abs(w['1']))
    sq[m] = {'max_abs_weight_nontrivial': w_non, 'min_abs_weight_trivial_on_test_points': w_tr}
res['B2_square_m_weights'] = sq
# which characters occur for other m
occ = {}
for m in (2, 3, 5, 6, 7, 8, 12, -1, -2, -3, -4, -5, -7, -8):
    w = weights(m, pts[3])
    occ[m] = [n for n in w if abs(w[n]) > 1e-12]
res['B2_characters_with_nonzero_weight'] = occ

# ---------- C. at the first zeros
zs = [mp.zetazero(1), mp.zetazero(2)]
C_out = {}
for j, rho in enumerate(zs):
    s = mp.mpf(1)/4 + rho/2
    row1 = {m: abs(A_closed(m, s)) for m in (1, 4, 9, 25, 36, 49, 225)}
    other = {m: abs(A_closed(m, s)) for m in (2, 3, 5, 6, 7, 13, -1, -2, -3, -4, -7, -15)}
    C_out['zero%d' % (j+1)] = {'rho': str(rho), 's_rho': str(s),
        'abs_zeta_rho': float(abs(mp.zeta(rho))), 'abs_zeta_2rho': float(abs(mp.zeta(2*rho))),
        'D=1 row abs A(n^2)': {str(k): float(v) for k, v in row1.items()},
        'other rows abs A(m)': {str(k): float(v) for k, v in other.items()}}
# generic parameter: the D = 1 row does not vanish
s = mp.mpf(1)/4 + mp.mpc('0.5', '15')/2
C_out['generic_u=0.5+15i'] = {'D=1 row abs A(n^2)': {str(m): float(abs(A_closed(m, s))) for m in (1, 4, 9, 25)}}
s = mp.mpf(1)/4 + mp.mpc('0.8', '14.134725')/2
C_out['generic_u=0.8+14.134725i'] = {'D=1 row abs A(n^2)': {str(m): float(abs(A_closed(m, s))) for m in (1, 4, 9, 25)}}
res['C_first_zeros'] = C_out

# ---------- D. Hecke relation at p^2 (b(m) = A(m)|m|^{s-1}):
#   p b(p^2 m) + p^{-1/2} (m/p) b(m) + p^{-1} b(m/p^2) = (p^{2s-1} + p^{1-2s}) b(m)
def b(m, s): return A_closed(m, s) * mp.power(abs(m), s - 1)
D_out = {}
for label, s in (('zero1', mp.mpf(1)/4 + zs[0]/2), ('generic', mp.mpc('0.83', '3.1'))):
    mx = 0; mn = None
    for p in (3, 5, 7):
        lam = mp.power(p, 2*s - 1) + mp.power(p, 1 - 2*s)
        for m in (2, 3, 5, 6, 7, 15, 18, 45, 75, -1, -3, -5, -9, -45, 50, 98):
            lhs = p * b(m*p*p, s) + mp.power(p, -0.5) * (jacobi(m, p) if m % p else 0) * b(m, s)
            if m % (p*p) == 0: lhs += b(m // (p*p), s) / p
            rhs = lam * b(m, s)
            mx = max(mx, float(abs(lhs - rhs)))
            mn = float(abs(rhs)) if mn is None else min(mn, float(abs(rhs)))
    D_out[label] = {'max_abs_defect': mx, 'min_abs_rhs': mn}
res['D_hecke_relation'] = D_out

# ---------- E. constant term: A(0,s) and the archimedean integral
def A0_closed(s):
    # U_a(0,r) = 0 for a odd; for a even = 2^{a-2} * sum over d mod 4
    tot = mp.mpc(0); wts = {}
    for name in CH8:
        w = mp.mpc(0)
        for r in (1, 3, 5, 7):
            u2 = mp.mpmathify(complex(U(2, 0, r)))   # a = 2 value; a = 2j: times 4^{j-1}
            geo = mp.power(2, -4*s) / (1 - mp.power(2, 2 - 4*s))
            w += CH8[name][r] * mp.mpmathify(complex(eps(r))) * u2 * geo
        wts[name] = w / 4
    # odd part for the trivial character: zeta(4s-2)/zeta(4s-1) with the 2-factors removed
    odd = mp.zeta(4*s - 2) * (1 - mp.power(2, 2 - 4*s)) / (mp.zeta(4*s - 1) * (1 - mp.power(2, 1 - 4*s)))
    return wts, wts['1'] * odd
E_out = {}
# U_a(0,r) pattern
pat = {}
for a in range(2, 9):
    pat[a] = [complex(U(a, 0, r)) for r in (1, 3, 5, 7)]
E_out['U_a(0,r) a=2..8, r=1,3,5,7'] = {str(a): [[round(z.real, 9), round(z.imag, 9)] for z in v] for a, v in pat.items()}
s = mp.mpf('1.8')
wts, a0 = A0_closed(s)
bf = sum(complex(Ktab[c][0]) * float(c)**(-3.6) for c in Ktab)
E_out['weights_psi_m=0'] = {k: complex(v).__repr__() for k, v in wts.items()}
E_out['A(0,1.8) closed'] = complex(a0).__repr__(); E_out['A(0,1.8) brute force c<=%d' % C] = bf.__repr__()
for j, rho in enumerate(zs):
    s = mp.mpf(1)/4 + rho/2
    _, a0 = A0_closed(s)
    E_out['abs A(0, s_rho) zero%d' % (j+1)] = float(abs(a0))
    E_out['abs zeta(2rho-1)/zeta(2rho) zero%d' % (j+1)] = float(abs(mp.zeta(2*rho - 1) / mp.zeta(2*rho)))
# archimedean integral int (t+i)^{-1/2} (t^2+1)^{-s'} dt, s' = s - 1/4, against the Gamma formula
def arch_formula(s):
    al = s + mp.mpf(1)/4; be = s - mp.mpf(1)/4
    return 2*mp.pi * mp.exp(1j*mp.pi*(be - al)/2) * mp.power(2, 1 - 2*s) * mp.gamma(2*s - 1) / (mp.gamma(al) * mp.gamma(be))
for s in (mp.mpf('1.3'), mp.mpc('0.9', '1.5')):
    f = lambda t: mp.power(t + 1j, -0.5) * mp.power(t*t + 1, -(s - 0.25))
    q = mp.quad(f, mp.linspace(-60, 60, 25)) 
    # tails: asymptotically |t|^{-2s}; add by quad to infinity
    q += mp.quad(f, [60, 1e3, 1e5, mp.inf]) + mp.quad(f, [-mp.inf, -1e5, -1e3, -60])
    E_out['arch s=%s' % str(s)] = {'quad': complex(q).__repr__(), 'formula': complex(arch_formula(s)).__repr__()}
res['E_constant_term'] = E_out
res['seconds'] = time.time() - t0

def clean(o):
    if isinstance(o, dict): return {str(k): clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)): return [clean(v) for v in o]
    if isinstance(o, complex): return [o.real, o.imag]
    if isinstance(o, (np.floating,)): return float(o)
    if isinstance(o, (mp.mpf,)): return float(o)
    if isinstance(o, (mp.mpc,)): return [float(o.real), float(o.imag)]
    return o
json.dump(clean(res), open(OUT, 'w'), indent=1)
print(json.dumps(clean(res), indent=1))
