"""c8-row-energy-squared-signal: independent exact recomputation of one F_q[T] block family (q = 7).
Definitions only (norm determinants, sums over x mod c). No code or closed form of c7-ff-order2-vertex-exact is used.
Arithmetic: Z[zeta_42] as integer vectors of length 42 (cyclic), reduced modulo Phi_42 at the end; exact rationals
(fractions.Fraction) for every ratio.  Usage: recheck.py N lam d target [seed]   target in a, b, mu; seed -> random
sixth-root-of-unity marks u_P (control)."""
import sys, json, itertools, random
from fractions import Fraction
q = 7; n = 42
N, lam, d, target = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
seed = int(sys.argv[5]) if len(sys.argv) > 5 else None
Np = N + lam
# ---------- F_q[T]: polynomials as tuples (low -> high), monic of degree k indexed by itertools.product
def trim(a):
    a = list(a)
    while a and a[-1] == 0: a.pop()
    return tuple(a)
def pmod(a, c):            # c monic
    a = list(a); k = len(c) - 1
    for i in range(len(a) - 1, k - 1, -1):
        f = a[i]
        if f:
            for j in range(k + 1): a[i - k + j] = (a[i - k + j] - f * c[j]) % q
    return tuple((a + [0] * k)[:k])
def pmul(a, b):
    r = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        if x:
            for j, y in enumerate(b): r[i + j] = (r[i + j] + x * y) % q
    return tuple(r)
def monics(k): return [tuple(reversed((1,) + t)) for t in itertools.product(range(q), repeat=k)]
def residues(k): return [tuple(reversed(t)) for t in itertools.product(range(q), repeat=k)]
def det(M):
    M = [r[:] for r in M]; k = len(M); D = 1
    for i in range(k):
        p = next((r for r in range(i, k) if M[r][i] % q), None)
        if p is None: return 0
        if p != i: M[i], M[p] = M[p], M[i]; D = -D
        D = D * M[i][i] % q; inv = pow(M[i][i], q - 2, q)
        for r in range(i + 1, k):
            f = M[r][i] * inv % q
            if f: M[r] = [(x - f * y) % q for x, y in zip(M[r], M[i])]
    return D % q
def norm(c, x):            # Res(c, x) = prod over roots t of c of x(t) = det of multiplication by x on F_q[T]/(c)
    k = len(c) - 1
    if k == 0: return 1
    cols = []; b = pmod(x, c)
    for i in range(k):
        cols.append(list(b)); b = pmod((0,) + b, c)
    return det([[cols[j][i] for j in range(k)] for i in range(k)])
g0 = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
L6 = {pow(g0, e, q): e % 6 for e in range(q - 1)}          # chi_0(g0) = zeta_6
# ---------- ring: vectors of length 42; zeta_6 = x^7, zeta_7 = x^6
def mono(e6, e7, c=1):
    v = [0] * n; v[(7 * e6 + 6 * e7) % n] = c; return v
def add(a, b): return [x + y for x, y in zip(a, b)]
def mul(a, b):
    r = [0] * n
    for i, x in enumerate(a):
        if x:
            for j, y in enumerate(b):
                if y: r[(i + j) % n] += x * y
    return r
def conj(a): return [a[(-i) % n] for i in range(n)]
def shift(a, s): s %= n; return a[-s:] + a[:-s] if s else a[:]
def pdivmod(a, b):
    a = a[:]; db = len(b) - 1; out = [0] * max(1, len(a) - db)
    for i in range(len(a) - 1, db - 1, -1):
        f = a[i] // b[-1]; out[i - db] = f
        if f:
            for j in range(db + 1): a[i - db + j] -= f * b[j]
    return out, a[:db]
def cyclo(m):
    num = [-1] + [0] * (m - 1) + [1]
    for e in range(1, m):
        if m % e == 0: num, r = pdivmod(num, cyclo(e)); assert not any(r)
    return num
PHI = cyclo(n); assert len(PHI) == 13
def red(a): return tuple(pdivmod(list(a) + [0] * 13, PHI)[1])
def as_int(a):
    r = red(a); assert not any(r[1:]), 'not a rational integer'; return r[0]
def abs2(a): return mul(a, conj(a))
# ---------- characters and Gauss sums from the definitions
def chi_table(c):          # x (residue tuple) -> exponent of zeta_6, or None if not coprime
    k = len(c) - 1; t = {}
    for x in residues(k):
        v = norm(c, x); t[x] = None if v == 0 else L6[v]
    return t
def gauss(c, tab, j, mres):   # sum_{x mod c} chi_c(x)^j psi(coefficient of T^(k-1) of (m x mod c))
    k = len(c) - 1; v = [0] * n
    for x, e in tab.items():
        if e is None: continue
        y = pmod(pmul(mres, x), c)
        v[(7 * (j * e % 6) + 6 * y[k - 1]) % n] += 1
    return v
ms = monics(d)
def c_vec(k):              # c_k(m) for all monic m of degree d
    if k == 0: return [mono(0, 0) for _ in ms]
    acc = {m: [0] * n for m in ms}
    for c in monics(k):
        tab = chi_table(c); cache = {}
        for m in ms:
            r = pmod(m, c)
            if r not in cache: cache[r] = gauss(c, tab, 1, r)
            acc[m] = add(acc[m], cache[r])
    return [acc[m] for m in ms]
# ---------- factorisation of all monic polynomials of degree <= Np
irr = {1: monics(1)}
prod_of = {}
for k in range(2, Np + 1):
    red_set = set()
    for a in range(1, k // 2 + 1):
        for f in monics(a):
            for g in monics(k - a): red_set.add(pmul(f, g))
    irr[k] = [f for f in monics(k) if f not in red_set]
def factor(B):
    fs = []; rest = B
    for k in range(1, len(B)):
        for P in irr.get(k, []):
            while len(rest) > 1 and len(rest) - 1 >= k and not any(pmod(rest, P)):
                # exact division
                a = list(rest); out = [0] * (len(a) - k)
                for i in range(len(a) - 1, k - 1, -1):
                    f = a[i]; out[i - k] = f
                    for j in range(k + 1): a[i - k + j] = (a[i - k + j] - f * P[j]) % q
                rest = tuple(out); fs.append(P)
    assert rest == (1,); return fs
F = {'a': (2, 0, 0, 1), 'b': (1, 1, 0, 1)}.get(target)
def nu(A):                 # weight on the unmarked part A' (degree N)
    if target == 'mu':
        return mono(3 * (len(factor(A)) % 2), 0)
    v = norm(F, A)         # chi_0^3(Res(F, A))
    return [0] * n if v == 0 else mono(3 * L6[v], 0)
rng = random.Random(seed) if seed is not None else None
uP = {P: (mono(rng.randrange(6), 0) if rng else mono(0, 0)) for P in irr.get(lam, [])} if lam else {}
# ---------- row R(m) = sum_B W(B) g_3(1, B) chi_B(m), B squarefree of degree N', W(B) = sum_{P | B, deg P = lam} u_P nu(B / P)
R = {m: [0] * n for m in ms}
Scop_data = []             # (mu(B), W(B), B)
diag = [0] * n; nB = 0
one = tuple([1] + [0] * 0)
for B in monics(Np):
    fs = factor(B)
    if len(set(fs)) != len(fs): continue
    if lam == 0: W = nu(B)
    else:
        W = [0] * n
        for P in fs:
            if len(P) - 1 == lam:
                Ap = (1,)
                for Q in fs:
                    if Q != P: Ap = pmul(Ap, Q)
                W = add(W, mul(uP[P], nu(Ap)))
    if not any(W): continue
    nB += 1
    tab = chi_table(B); e1 = tuple([1] + [0] * (Np - 1)) if Np > 1 else (1,)
    g3 = gauss(B, tab, 2, e1)
    coef = mul(W, g3)
    sh = [shift(coef, 7 * e) for e in range(6)]
    phiB = sum(1 for e in tab.values() if e is not None)
    diag = add(diag, [x * phiB for x in mul(abs2(W), abs2(g3))])      # |W|^2 |g_3|^2 phi(B); divide by q^N' later
    Scop_data.append(((-1) ** len(fs), W, B))
    for m in ms:
        e = tab[pmod(m, B)] if d >= Np else (None if norm(B, m) == 0 else L6[norm(B, m)])
        if e is not None: R[m] = add(R[m], sh[e])
Rv = [R[m] for m in ms]
def inner(u, v):           # sum_m u(m) v(m)   (bilinear)
    s = [0] * n
    for a, b in zip(u, v): s = add(s, mul(a, b))
    return s
nr2 = as_int(inner(Rv, [conj(x) for x in Rv]))
Dq = Fraction(as_int(diag), q ** Np) * q ** d        # q^d D, D = sum_B |W|^2 q^N' phi(B)/|B|
out = {'q': q, 'N': N, 'lam': lam, 'd': d, 'target': target, 'seed': seed, 'moduli': nB, 'nr2': nr2,
       'diag_qdD': str(Dq), 'blocks': []}
K = [k for k in range(0, d // 2 + 1)]
cv = {k: c_vec(k) for k in K}
# Gram matrix of the probes (orthogonality is part of the statement)
gram = {}
for i in K:
    for j in K:
        if j >= i: gram[(i, j)] = red(inner(cv[i], [conj(x) for x in cv[j]]))
out['gram_offdiag_zero'] = all(not any(gram[(i, j)]) for (i, j) in gram if i != j)
bessel = Fraction(0); Jel = {}
for k in K:
    nc2 = as_int(inner(cv[k], [conj(x) for x in cv[k]]))
    J = inner(cv[k], Rv); Jel[k] = (J, nc2)
    J2 = as_int(abs2(J))
    # S_cop(k) from the definition: count of monic c of degree k coprime to B
    S = [0] * n
    for muB, W, B in Scop_data:
        cnt = sum(1 for c in monics(k) if norm(B, pmod(c, B) if k >= Np else c) != 0)
        S = add(S, [x * muB * cnt for x in W])
    S2 = as_int(abs2(S)); r = k + Np - 1 - d
    wt2 = (1 if (k - Np) % 6 == 0 else q) if r == 0 else None
    rec = {'k': k, 'r': r, 'nc2': nc2, 'nc2_formula': str(Fraction(q ** (d + 2 * k) * (q - 1), q)) if k >= 1 else str(q ** d),
           'J2': J2, 'S_cop_abs2': S2}
    if wt2 is not None and k != Np:
        rec['pred_J2'] = wt2 * q ** (2 * d) * S2; rec['signal_law_exact'] = (rec['pred_J2'] == J2)
    rec['squared_signal_J2_over_nc2'] = str(Fraction(J2, nc2)) if nc2 else '0'
    if nc2: bessel += Fraction(J2, nc2)
    out['blocks'].append(rec)
# remainder computed directly: || R - sum_k (J_k / ||c_k||^2) conj(c_k) ||^2  (not as a difference)
L = 1
for k in K:
    if Jel[k][1]: L *= Jel[k][1]
res = []
for idx in range(len(ms)):
    v = [x * L for x in Rv[idx]]
    for k in K:
        J, nc2 = Jel[k]
        if nc2 and any(J): v = add(v, [-x * (L // nc2) for x in mul(J, conj(cv[k][idx]))])
    res.append(v)
rem = Fraction(as_int(inner(res, [conj(x) for x in res])), L * L)
out['squared_signal_total'] = str(bessel); out['remainder_direct'] = str(rem)
out['identity_energy_eq_signal_plus_remainder'] = (Fraction(nr2) == bessel + rem)
out['excess_over_diag'] = str((Fraction(nr2) - Dq) / Dq); out['signal_over_diag'] = str(bessel / Dq)
out['remainder_over_diag'] = str(rem / Dq)
print(json.dumps(out))
