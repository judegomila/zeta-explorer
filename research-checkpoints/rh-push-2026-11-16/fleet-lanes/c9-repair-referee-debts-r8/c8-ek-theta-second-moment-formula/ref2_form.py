"""Second referee, item E1 of c8-ek-theta-second-moment-formula: signature of the sixth-power form.
Independent of the lane code and of tmp/sextic. Exact integer arithmetic for all symbols.
Z[w], w^2 = -1 - w. element (a,b) = a + b w. zeta = 1 + w (primitive 6th root of unity).
Sextic symbol chi_pi(x) = x^((N pi - 1)/6) mod pi, as an exponent j with value zeta^j.
Primary: a = 1 mod 3, b = 0 mod 3. Planned memory: a few MB (matrices up to 900 x 900 float64 = 6.5 MB)."""
import itertools, sys
import numpy as np

def mul(x, y, p=None):
    a, b = x; c, d = y
    r = (a*c - b*d, a*d + b*c - b*d)
    return r if p is None else (r[0] % p, r[1] % p)
def norm(x): return x[0]*x[0] - x[0]*x[1] + x[1]*x[1]
ZETA = (1, 1)
UNITS = [(1, 0)]
for _ in range(5): UNITS.append(mul(UNITS[-1], ZETA))
def primary(x):
    for u in UNITS:
        y = mul(x, u)
        if y[0] % 3 == 1 and y[1] % 3 == 0: return y
    raise ValueError
def isprime(n):
    if n < 2: return False
    i = 2
    while i*i <= n:
        if n % i == 0: return False
        i += 1
    return True

class P:
    """primary prime prime to 6"""
    def __init__(s, pi, split):
        s.pi = pi; s.q = norm(pi); s.split = split
        if split:
            p = s.q; a, b = pi
            s.p = p; s.r = (-a * pow(b, -1, p)) % p          # w -> r mod pi
            z = (1 + s.r) % p
            s.zt = {pow(z, j, p): j for j in range(6)}
            assert len(s.zt) == 6
        else:
            s.p = abs(pi[0])
            s.zt = {}
            z = (1, 0)
            for j in range(6):
                s.zt[z] = j; z = mul(z, ZETA, s.p)
    def chi(s, x):
        """exponent j of chi_pi(x) = zeta^j, or None if pi | x"""
        e = (s.q - 1)//6
        if s.split:
            v = (x[0] + x[1]*s.r) % s.p
            if v == 0: return None
            return s.zt[pow(v, e, s.p)]
        v = (x[0] % s.p, x[1] % s.p)
        if v == (0, 0): return None
        r = (1, 0); b = v
        while e:
            if e & 1: r = mul(r, b, s.p)
            b = mul(b, b, s.p); e >>= 1
        return s.zt[r]

def primes(B):
    out = []
    for p in range(5, B):
        if not isprime(p): continue
        if p % 3 == 1:
            # find a + b w of norm p
            found = None
            for a in range(-int(2*p**.5)-2, int(2*p**.5)+3):
                for b in range(1, int(2*p**.5)+3):
                    if a*a - a*b + b*b == p: found = (a, b); break
                if found: break
            x = primary(found); xb = primary((found[0]-found[1], -found[1]))   # conjugate: a + b w^2 = (a-b) - b w
            assert norm(x) == p and norm(xb) == p and x != xb
            out += [P(x, True), P(xb, True)]
        elif p*p < B:
            out.append(P(primary((p, 0)), False))
    return out

def zsum(js):
    """sum of zeta^j as element of Z[w]"""
    a = b = 0
    for j in js:
        u = UNITS[j % 6]; a += u[0]; b += u[1]
    return (a, b)

B = int(sys.argv[1]) if len(sys.argv) > 1 else 2000
PR = primes(B)
print("primary primes prime to 6 with norm <", B, ":", len(PR))
# unit character of each prime: eps = exponent of chi_pi(zeta); class mod 36 of pi
for pr in PR:
    pr.eps = pr.chi(ZETA)
    pr.cls = (pr.pi[0] % 36, pr.pi[1] % 36)
    pr.c4 = (pr.pi[0] % 4, pr.pi[1] % 4)
    assert pr.eps == ((pr.q - 1)//6) % 6
def Rrec(x, y):
    j = (x.chi(y.pi) - y.chi(x.pi)) % 6
    assert j in (0, 3), "R not +-1"
    return 1 if j == 0 else -1
def U(x, y):
    """sum over the six units u of conj(chi_x(u)) chi_y(-u), exact"""
    z = zsum([-x.eps*t + y.eps*(t + 3) for t in range(6)])
    assert z[1] == 0
    return z[0]
n = len(PR)
K = np.zeros((n, n), dtype=np.int64); Rm = np.zeros((n, n), dtype=np.int64)
for i in range(n):
    for j in range(n):
        if i == j:
            # diagonal of the class form: taken from the class structure below; leave 0 here
            continue
        r = Rrec(PR[i], PR[j]); Rm[i, j] = r; K[i, j] = r * U(PR[i], PR[j])
print("kernel K = R * unit sum: values", sorted(set(K.flatten().tolist())), " nonzero entries", int((K != 0).sum()), "of", n*n - n)
# 1. K is a class function mod 36 ? R is a class function mod 4 ?
def classfn(M, key):
    tab = {}; ok = True
    for i in range(n):
        for j in range(n):
            if i == j: continue
            k = (key(PR[i]), key(PR[j]))
            if k in tab and tab[k] != M[i, j]: ok = False
            tab.setdefault(k, M[i, j])
    return ok, tab
okR, tabR = classfn(Rm, lambda p: p.c4)
okK, tabK = classfn(K, lambda p: p.cls)
c4 = sorted({p.c4 for p in PR}); c36 = sorted({p.cls for p in PR})
print("R depends only on classes mod 4:", okR, " classes mod 4 seen:", len(c4), " pairs seen:", len(tabR), "of", len(c4)**2)
print("K depends only on classes mod 36:", okK, " classes mod 36 seen:", len(c36), " pairs seen:", len(tabK), "of", len(c36)**2)
# 2. R on square classes mod 4: group the 12 classes by equal rows
RM = np.array([[tabR[(x, y)] for y in c4] for x in c4])
assert (RM == RM.T).all()
rows = {}
for i, x in enumerate(c4): rows.setdefault(tuple(RM[i]), []).append(x)
print("distinct rows of R on the 12 odd classes mod 4:", len(rows), " sizes", [len(v) for v in rows.values()])
reps = [v[0] for v in rows.values()]
R4 = np.array([[tabR[(x, y)] for y in reps] for x in reps])
print("R on the 4 square classes:\n", R4, "\n eigenvalues", np.round(np.linalg.eigvalsh(R4), 12).tolist(), " diag", np.diag(R4).tolist())
# s(x) = chi_x(-1)
s_by4 = {}
ok = True
for p in PR:
    s = 1 if (3*p.eps) % 6 == 0 else -1
    if s_by4.setdefault(p.c4, s) != s: ok = False
print("chi_c(-1) depends only on the class mod 4:", ok, " and equals R(x,x):", all(s_by4[x] == tabR[(x, x)] for x in c4))
S4 = np.diag([s_by4[x] for x in reps])
print("lane form R alone: signature (+,-,0) =", tuple(int(v) for v in (np.sum(np.linalg.eigvalsh(R4) > 1e-9), np.sum(np.linalg.eigvalsh(R4) < -1e-9), 0)))
Kpm = R4 * (np.diag(S4)[:, None] + np.diag(S4)[None, :])
print("pairing k with -k: R(x,y)(s(x)+s(y)) =\n", Kpm, "\n eigenvalues", np.round(np.linalg.eigvalsh(Kpm), 12).tolist())
# 3. full class form mod 36 and exact rank-one block factorisation
KM = np.array([[tabK[(x, y)] for y in c36] for x in c36], dtype=np.int64)
assert (KM == KM.T).all()
m = len(c36); seen = [False]*m; blocks = []; exact = True
for i in range(m):
    if seen[i]: continue
    idx = [j for j in range(m) if KM[i, j] != 0]
    assert KM[i, i] == 6, KM[i, i]
    phi = KM[i, idx] // 6
    sub = KM[np.ix_(idx, idx)]
    if not (sub == 6*np.outer(phi, phi)).all(): exact = False
    # no entry outside the block
    out = [j for j in range(m) if j not in idx]
    if out and (KM[np.ix_(idx, out)] != 0).any(): exact = False
    for j in idx: seen[j] = True
    blocks.append(len(idx))
print("class form mod 36:", m, "classes; blocks", blocks)
print("EXACT: K = 6 * sum over blocks of phi phi^T with phi = +-1 on the block:", exact, " => positive semidefinite, rank", len(blocks))
ev = np.linalg.eigvalsh(KM.astype(float))
print("float eigenvalues of the class form: min %.3e, max %.6f, number > 1e-6: %d" % (ev.min(), ev.max(), int((ev > 1e-6).sum())))
# 4. the kernel on the primes themselves, diagonal filled with the class value, and a general frequency k
KF = K.copy().astype(float)
for i in range(n): KF[i, i] = tabK[(PR[i].cls, PR[i].cls)]
ev = np.linalg.eigvalsh(KF)
print("kernel on %d primes (diagonal = class value 6): min eig %.3e, max %.3f, rank %d" % (n, ev.min(), ev.max(), int((ev > 1e-6).sum())))
for kk in [(2, 1), (5, 3), (7, -4)]:
    ph = np.array([np.exp(-2j*np.pi*(p.chi(kk) or 0)/6) if p.chi(kk) is not None else 0 for p in PR])
    Kk = ph[:, None] * KF * np.conj(ph)[None, :]
    ev = np.linalg.eigvalsh(Kk)
    print("frequency k = %s (norm %d, not a unit times a sixth power): unit-orbit kernel min eig %.3e, max %.3f, rank %d" % (kk, norm(kk), ev.min(), ev.max(), int((ev > 1e-6).sum())))
# R alone on primes: indefinite
RF = Rm.astype(float)
for i in range(n): RF[i, i] = tabR[(PR[i].c4, PR[i].c4)]
ev = np.linalg.eigvalsh(RF)
print("R alone on the primes: eigenvalues > 0: %d, < 0: %d (extremes %.2f, %.2f)" % (int((ev > 1e-6).sum()), int((ev < -1e-6).sum()), ev.min(), ev.max()))
