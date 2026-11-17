# n2-rank2-eisenstein-kernel: Langlands inner-product kernel for SL3 (minimal parabolic) with pluggable c.
# Run: scripts/memcap.sh 8 .venv-arb/bin/python -I <driver>.py     (mpmath only; matrices <= 12x12)
import mpmath as mp, itertools, random
I = mp.mpc(0, 1)
PERMS = list(itertools.permutations(range(3)))

# ---------------- c functions (all take mpc z, return mpc) ----------------
def xi(z):
    return mp.pi ** (-z / 2) * mp.gamma(z / 2) * mp.zeta(z)

def c_zeta(z):
    return xi(z) / xi(z + 1)

def c_pole(z):                      # "zeta with no zeros": xi = 1/(z(z-1)); c~ = 1
    return (z + 1) / (z - 1)

def make_Ea(a):
    a = mp.mpf(a)
    return lambda z: c_zeta(z + a) * c_zeta(z - a)

def Rratio(z, new, old):
    """R(z)/R(z+1), R(z) = prod_new (z-r) / prod_old (z-r).  For FE-symmetric sets this is a
    (quotient of) Blaschke product(s) for Re z > 0."""
    v = mp.mpc(1)
    for r in new:
        v *= (z - r) / (z + 1 - r)
    for r in old:
        v *= (z + 1 - r) / (z - r)
    return v

def quad(delta, gamma):
    d = mp.mpf(delta); g = mp.mpf(gamma); h = mp.mpf(1) / 2
    if d == 0:
        return [h + I * g, h - I * g]
    return [h + d + I * g, h + d - I * g, h - d + I * g, h - d - I * g]

def make_fake(base, new, old=()):
    return lambda z: base(z) * Rratio(z, new, old)

CHI5 = None
def _dh_setup():
    global CHI5, KAPPA
    CHI5 = [0, 1, I, -I, -1]
    KAPPA = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
def f_dh(s):
    if CHI5 is None: _dh_setup()
    L1 = mp.dirichlet(s, CHI5)
    L2 = mp.dirichlet(s, [mp.conj(x) for x in CHI5])
    return (1 - I * KAPPA) / 2 * L1 + (1 + I * KAPPA) / 2 * L2
def xi_dh(s):
    return (mp.pi / 5) ** (-s / 2) * mp.gamma((s + 1) / 2) * f_dh(s)
def c_dh(z):
    return xi_dh(z) / xi_dh(z + 1)

def c_liouville(z):                 # sign twist eps_p = -1: L = zeta(2s)/zeta(s); no functional equation
    X = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(2 * s) / mp.zeta(s)
    return X(z) / X(z + 1)

# ---------------- rank 1 ----------------
def K1(z, w, cz, cw, t):
    wb = mp.conj(w); cwb = mp.conj(cw)
    return ((mp.exp((z + wb) * t) - cz * cwb * mp.exp(-(z + wb) * t)) / (z + wb)
            + (cwb * mp.exp((z - wb) * t) - cz * mp.exp(-(z - wb) * t)) / (z - wb))

def gram1(c, nodes, t):
    cv = [c(z) for z in nodes]
    n = len(nodes)
    return mp.matrix(n, n, ) if False else _mat([[K1(nodes[i], nodes[j], cv[i], cv[j], t) for j in range(n)] for i in range(n)])

# ---------------- rank 2 ----------------
def lam_from(z1, z2):
    # lambda in C^3, sum 0, lambda1-lambda2 = z1, lambda2-lambda3 = z2
    return ((2 * z1 + z2) / 3, (-z1 + z2) / 3, (-z1 - 2 * z2) / 3)

def Mtable(c, z1, z2):
    """M(p, lambda) for the 6 permutations; M = prod over inversions of c(lambda_i - lambda_j), i<j."""
    cc = {(0, 1): c(z1), (1, 2): c(z2), (0, 2): c(z1 + z2)}
    out = []
    for p in PERMS:
        m = mp.mpc(1)
        for a in range(3):
            for b in range(a + 1, 3):
                if p[a] > p[b]:
                    m *= cc[(p[b], p[a])]
        out.append(m)
    return out

def K2(lam, mu, Ml, Mm, T):
    mub = tuple(mp.conj(x) for x in mu)
    s = mp.mpc(0)
    for ip, p in enumerate(PERMS):
        pl = (lam[p[0]], lam[p[1]], lam[p[2]])
        for iq, q in enumerate(PERMS):
            L = (pl[0] + mub[q[0]], pl[1] + mub[q[1]], pl[2] + mub[q[2]])
            e = mp.exp(L[0] * T[0] + L[1] * T[1] + L[2] * T[2])
            s += Ml[ip] * mp.conj(Mm[iq]) * e / ((L[0] - L[1]) * (L[1] - L[2]))
    return s

def gram2(c, znodes, T):
    lams = [lam_from(z1, z2) for (z1, z2) in znodes]
    Ms = [Mtable(c, z1, z2) for (z1, z2) in znodes]
    n = len(znodes)
    return _mat([[K2(lams[i], lams[j], Ms[i], Ms[j], T) for j in range(n)] for i in range(n)])

def _mat(rows):
    n = len(rows)
    A = mp.matrix(n, n)
    for i in range(n):
        for j in range(n):
            A[i, j] = rows[i][j]
    return A

def analyse(A):
    """returns (relative hermitian defect, min diag, max diag, eigenvalues of D^-1/2 A D^-1/2, D=|diag|).
    If the matrix vanishes to working precision, or a diagonal entry does, eigenvalues of A/max|A| are returned
    (flagged by max diag printed alongside)."""
    n = A.rows
    scale = max(abs(A[i, j]) for i in range(n) for j in range(n))
    d = [A[i, i].real for i in range(n)]
    tiny = mp.mpf(10) ** (-(mp.mp.dps - 25))
    if scale < tiny:
        return mp.mpf(0), min(d), max(d), [mp.mpf(0)] * n
    herm = max(abs(A[i, j] - mp.conj(A[j, i])) for i in range(n) for j in range(n))
    B = mp.matrix(n, n)
    unit = min(abs(x) for x in d) > tiny * scale
    for i in range(n):
        for j in range(n):
            den = mp.sqrt(abs(d[i]) * abs(d[j])) if unit else scale
            B[i, j] = (A[i, j] + mp.conj(A[j, i])) / 2 / den
    ev = sorted(mp.eigh(B, eigvals_only=True))
    return herm / scale, min(d), max(d), ev

def rand_nodes1(n, rng, re=(0.1, 0.9), im=(10, 50)):
    return [mp.mpc(rng.uniform(*re), rng.choice([-1, 1]) * rng.uniform(*im)) for _ in range(n)]

def rand_nodes2(n, rng, re=(0.08, 0.92), im=(10, 50)):
    out = []
    while len(out) < n:
        x1 = rng.uniform(*re); x2 = rng.uniform(*re)
        if abs(x1 + x2 - 1) < 0.06: continue
        y1 = rng.choice([-1, 1]) * rng.uniform(*im); y2 = rng.choice([-1, 1]) * rng.uniform(*im)
        if abs(y1 + y2) < 1: continue
        out.append((mp.mpc(x1, y1), mp.mpc(x2, y2)))
    return out

def nstr(x, k=4):
    return mp.nstr(x, k)
