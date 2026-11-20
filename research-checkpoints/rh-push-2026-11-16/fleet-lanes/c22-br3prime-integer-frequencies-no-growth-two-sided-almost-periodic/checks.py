# Sanity checks for RESULT.md (mpmath, 40 digits). Point values only; nothing here is a proof.
import json, mpmath as mp
mp.mp.dps = 40
out = {}
q = mp.mpf(2); lq = mp.log(q)
a, b = mp.mpf('0.1'), mp.mpf('0.2')
al, be = q**a + q**-a, q**b + q**-b

def series(num, den, J):
    # power series of num(u)/den(u), coefficient lists low order first
    c = []
    for j in range(J + 1):
        s = num[j] if j < len(num) else mp.mpf(0)
        for i in range(1, min(j, len(den) - 1) + 1):
            s -= den[i] * c[j - i]
        c.append(s / den[0])
    return c

# ---- HQ3: m(u) = (1 - al u + u^2)/(1 - be u + u^2), u = q^(1/2-s); poles u = q^b, q^-b
m3 = lambda u: (1 - al*u + u*u)/(1 - be*u + u*u)
c3 = series([1, -al, 1], [1, -be, 1], 60)
upoles = [q**b, q**-b]
ru = [(1 - al*u0 + u0*u0)/(2*u0 - be) for u0 in upoles]       # residue of m in u
def spole(u0, k): return mp.mpf(1)/2 - mp.log(u0)/lq + 2j*mp.pi*k/lq
def res_s(i): return -ru[i]/(upoles[i]*lq)                      # residue of m(u(s)) in s (same for every k)

# (A) Gaussian explicit formula (identity M_T), exact for each T: both sides, several n and T
rowsA = []
for n in [2, 4, 8, 3, 6, mp.mpf('2.5')]:
    for T in [1, 3]:
        T = mp.mpf(T)
        lhs = mp.mpc(0)
        for i in range(2):
            for k in range(-400, 401):
                s = spole(upoles[i], k)
                lhs += res_s(i) * mp.e**(s*mp.log(n)) * mp.e**((s - mp.mpf(1)/2)**2/T**2)
        L = mp.log(n)
        rhs = T/(2*mp.sqrt(mp.pi)) * mp.sqrt(n) * sum(c3[j]*(mp.e**(-T*T*(L - j*lq)**2/4) - mp.e**(-T*T*(L + j*lq)**2/4)) for j in range(61))
        rowsA.append({'n': str(n), 'T': str(T), 'lhs': mp.nstr(lhs, 20), 'rhs': mp.nstr(rhs, 20), 'absdiff': mp.nstr(abs(lhs - rhs), 5)})
out['A_gauss_identity_HQ3'] = rowsA

# (B) mean residue formula (Lemma M): (pi/T) sum_{|Im rho|<T} Res(H n^s) -> h(n)
rowsB = []
for n in [2, 4, 8, 3, 6, 12]:
    # h(n): n = q^j * n', h = c_j q^(j/2) if n' = 1 else 0
    j = 0; nn = n
    while nn % 2 == 0: nn //= 2; j += 1
    h = c3[j]*q**(mp.mpf(j)/2) if nn == 1 else mp.mpf(0)
    vals = []
    for K in [10, 100, 1000, 10000]:
        T = (2*K + 1)*mp.pi/lq
        S = mp.mpc(0)
        for i in range(2):
            s0 = spole(upoles[i], 0); w = mp.e**(2j*mp.pi*mp.log(n)/lq)
            if abs(w - 1) < mp.mpf(10)**-30: g = 2*K + 1
            else: g = (w**(K + 1) - w**(-K))/(w - 1)
            S += res_s(i) * mp.e**(s0*mp.log(n)) * g
        vals.append(mp.nstr(mp.pi/T*S, 12))
    rowsB.append({'n': n, 'h(n)': mp.nstr(h, 12), 'K=10,100,1000,10000': vals})
out['B_mean_residue_HQ3'] = rowsB

# (C) HQ1 (double poles at u = 1): m = 1 + eps u/(1-u)^2; residues by circle rule; mean residue formula
eps = mp.mpf(1)
m1 = lambda u: 1 + eps*u/(1 - u)**2
c1 = series([1, -2 + eps, 1], [1, -2, 1], 20)
def circ_res(f, s0, r=mp.mpf('0.05'), N=64):
    return sum(f(s0 + r*mp.e**(2j*mp.pi*t/N)) * r*mp.e**(2j*mp.pi*t/N) for t in range(N))/N
rowsC = []
for n in [2, 4, 3]:
    j = 0; nn = n
    while nn % 2 == 0: nn //= 2; j += 1
    h = c1[j]*q**(mp.mpf(j)/2) if nn == 1 else mp.mpf(0)
    vals = []
    for K in [10, 100, 400]:
        T = (2*K + 1)*mp.pi/lq
        S = sum(circ_res(lambda s: m1(q**(mp.mpf(1)/2 - s))*mp.e**(s*mp.log(n)), mp.mpf(1)/2 + 2j*mp.pi*k/lq) for k in range(-K, K + 1))
        vals.append(mp.nstr(mp.pi/T*S, 10))
    rowsC.append({'n': n, 'h(n)': mp.nstr(h, 10), 'K=10,100,400': vals})
out['C_mean_residue_HQ1'] = rowsC

# (D) member QUAD: R = L(chi_12) L(chi_40) / (L(chi_8) L(chi_60)); R(s) = R(1-s); local factors
def jac(a, n):
    a %= n; r = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0
def chi(D):
    # Kronecker symbol (D/n) for fundamental D > 0 as a list of period D
    def k2(D):
        return 0 if D % 2 == 0 else (1 if D % 8 in (1, 7) else -1)
    v = []
    for n in range(D):
        if n == 0: v.append(0); continue
        e = 0; mm = n
        while mm % 2 == 0: mm //= 2; e += 1
        # (D/n) = (D/2)^e (D/mm), mm odd positive: Jacobi symbol
        x = (k2(D)**e if e else 1) * (jac(D, mm) if mm > 1 else 1)
        v.append(x)
    return v
chis = {D: chi(D) for D in (8, 12, 40, 60)}
out['D_even'] = {D: all(chis[D][n] == chis[D][D - n] for n in range(1, D)) for D in chis}
out['D_sum0'] = {D: sum(chis[D]) for D in chis}
def Lf(D, s): return mp.dirichlet(s, chis[D])
def R(s): return Lf(12, s)*Lf(40, s)/(Lf(8, s)*Lf(60, s))
rowsD = []
for s in [mp.mpc('0.3', '2.1'), mp.mpc('0.83', '7.7'), mp.mpc('1.4', '-3.3'), mp.mpc('-0.6', '11.2')]:
    rowsD.append({'s': mp.nstr(s, 6), 'R(s)': mp.nstr(R(s), 15), 'abs(R(s)-R(1-s))': mp.nstr(abs(R(s) - R(1 - s)), 5)})
out['D_QUAD_FE'] = rowsD
# local shapes: pattern (chi8, chi60 | chi12, chi40) over primes, and whether (1-y)^-1 (1-ay)(1-by)/((1-cy)(1-dy)) is geometric
from collections import Counter
cnt = Counter(); geom = Counter()
def primerange(a, b):
    sv = bytearray([1])*b; sv[0:2] = b'\0\0'
    for i in range(2, int(b**0.5) + 1):
        if sv[i]: sv[i*i::i] = bytearray(len(sv[i*i::i]))
    return [i for i in range(a, b) if sv[i]]
for p in primerange(7, 20000):
    pat = (chis[8][p % 8], chis[60][p % 60], chis[12][p % 12], chis[40][p % 40])
    cnt[pat] += 1
    num = sorted([pat[0], pat[1]]); den = sorted([1, pat[2], pat[3]])
    # cancel
    for x in list(num):
        if x in den: den.remove(x); num.remove(x)
    geom['geometric' if (len(num) == 0 and len(den) == 1) else 'not geometric'] += 1
out['D_QUAD_patterns'] = {str(k): v for k, v in sorted(cnt.items())}
out['D_QUAD_shape'] = dict(geom)
json.dump(out, open('checks.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
