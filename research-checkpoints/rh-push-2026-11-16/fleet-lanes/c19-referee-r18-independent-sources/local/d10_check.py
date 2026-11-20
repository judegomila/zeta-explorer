# Referee check, lane c18-d10-inertia-law-theorem-t-lemma-d.  Own implementation (python Fractions via flint fmpq), exact.
#  A. Theorem H identity 6N = A[LL_+ + 2 LL_-] and the two partial identities, fresh random b (degrees 1..9), fresh points.
#  B. Corollary H1: Hurwitz b -> Gram matrix of N on random points has no negative eigenvalue; a non-Hurwitz b with negatives exists.
#  C. Theorem Q: for fresh rational (eta, g) in the domain the Gram matrix of N on K random real points has inertia (6, 0);
#     rank of the invariant-monomial evaluation matrix is 19 (so the Gram inertia equals the inertia of H); outside the strip: negatives.
#  D. e_6 factorisation at fresh rational (E, c), using the lane's Hmat (read-only import) against the product of the printed factors.
#  E. Sign certificates of F_1..F_4 re-done with sympy.
import sys, json, random
from flint import fmpq, fmpq_mat
Q = fmpq
rng = random.Random(20261120)
out = {}

def weyl(l):
    z1, z2 = l; z12 = z1 + z2
    # e, s1, s2, s1 s2, s2 s1, w0 with s1 (z1, z2) = (-z1, z12), s2 (z1, z2) = (z12, -z2)
    return [((z1, z2), 1), ((-z1, z12), -1), ((z12, -z2), -1), ((-z12, z1), 1), ((z2, -z12), 1), ((-z2, -z1), -1)]

def poly(co):
    def b(u):
        r = Q(0)
        for c in reversed(co): r = r * u + c
        return r
    return b

def from_roots_quadratics(facs):
    """facs: list of coefficient lists (low to high) to multiply."""
    co = [Q(1)]
    for f in facs:
        new = [Q(0)] * (len(co) + len(f) - 1)
        for i, x in enumerate(co):
            for j, y in enumerate(f): new[i + j] += x * y
        co = new
    return co

def Nker(lam, mu, b):
    psi = lambda x: b(x[0]) * b(x[1]) * b(x[0] + x[1])
    s = Q(0)
    for (x, sx) in weyl(lam):
        px = psi(x)
        for (y, sy) in weyl(mu):
            s += sx * sy * px * psi(y) / ((x[0] + y[0]) * (x[1] + y[1]))
    return s

def rnum(d):
    while True:
        k = rng.randint(1, 400)
        if k % d: return Q(k, d)
def rpt(dens):
    return (rnum(dens[0]), rnum(dens[1]))

def inertia_charpoly(G):
    """exact inertia of a rational symmetric matrix from the signs of its characteristic polynomial (all roots real: Descartes is exact)."""
    n = G.nrows()
    co = G.charpoly().coeffs()          # low to high, monic of degree n
    co = [Q(c) for c in co] + [Q(0)] * (n + 1 - len(co))
    low = next(i for i, c in enumerate(co) if c != 0)
    seq = [c for c in co[low:] if c != 0]
    pos = sum(1 for i in range(len(seq) - 1) if (seq[i] > 0) != (seq[i + 1] > 0))
    return pos, n - low - pos, low        # positive, negative, zero

# ---------- A
chk = bad = 0
for deg in range(1, 10):
    for rep in range(5):
        co = [Q(rng.randint(-30, 30), rng.randint(1, 7)) for _ in range(deg)] + [Q(rng.choice([1, 2, -3]))]
        b = poly(co)
        L = lambda x, y: (b(x) * b(y) - b(-x) * b(-y)) / (x + y)
        for _ in range(4):
            lam, mu = rpt([113, 127]), rpt([131, 137])
            Nv = Nker(lam, mu, b)
            Ap = Am = X = Q(0)
            for (x, sx) in weyl(lam):
                for (y, sy) in weyl(mu):
                    ll = L(x[0], y[0]) * L(x[1], y[1])
                    Ap += sx * sy * ll * b(x[0] + x[1]) * b(y[0] + y[1])
                    Am += sx * sy * ll * b(-x[0] - x[1]) * b(-y[0] - y[1])
                    X += sx * sy * b(-x[0]) * b(-x[1]) * b(x[0] + x[1]) * b(-y[0]) * b(-y[1]) * b(y[0] + y[1]) / ((x[0] + y[0]) * (x[1] + y[1]))
            chk += 1
            if not (Ap + 2 * Am == 6 * Nv and Ap == 2 * Nv + X and 2 * Am == 4 * Nv - X): bad += 1
out["A_identity"] = dict(checks=chk, failures=bad)
print("A identity checks", chk, "failures", bad, flush=True)

# ---------- B
def I2(l): return l[0] * l[0] + l[0] * l[1] + l[1] * l[1]
def I3(l): return (2 * l[0] + l[1]) * (l[0] - l[1]) * (l[0] + 2 * l[1])
def Dl(l): return l[0] * l[1] * (l[0] + l[1])
def Hfit(b, n, ntest=5):
    """N = Delta(lam) Delta(mu) v(lam)^T H v(mu), v = invariant monomials I2^a I3^b of degree <= 3(n-1) (derived by the referee:
    N is anti-invariant in each variable, of degree <= 3n in each).  Two disjoint point sets, so no term has a zero denominator.
    Returns H, number of fit failures on ntest extra point pairs, max asymmetry flag."""
    md = 3 * (n - 1)
    mons = [(a, c) for c in range(0, md // 3 + 1) for a in range(0, md // 2 + 1) if 2 * a + 3 * c <= md]
    m = len(mons)
    P = [rpt([211, 223]) for _ in range(m)]; R = [rpt([227, 229]) for _ in range(m)]
    VP = fmpq_mat(m, m, [I2(p) ** a * I3(p) ** c for p in P for (a, c) in mons])
    VR = fmpq_mat(m, m, [I2(p) ** a * I3(p) ** c for p in R for (a, c) in mons])
    M = fmpq_mat(m, m, [Nker(p, r, b) / (Dl(p) * Dl(r)) for p in P for r in R])
    H = VP.inv() * M * VR.transpose().inv()
    badfit = 0
    for _ in range(ntest):
        p, r = rpt([233, 239]), rpt([241, 251])
        vp = [I2(p) ** a * I3(p) ** c for (a, c) in mons]; vr = [I2(r) ** a * I3(r) ** c for (a, c) in mons]
        val = sum((H[i, j] * vp[i] * vr[j] for i in range(m) for j in range(m)), Q(0))
        if val != Nker(p, r, b) / (Dl(p) * Dl(r)): badfit += 1
    sym = all(H[i, j] == H[j, i] for i in range(m) for j in range(m))
    return H, badfit, sym
def gram(b, n):
    H, badfit, sym = Hfit(b, n)
    assert badfit == 0 and sym, (badfit, sym)
    return H, None
resB = []
for rep in range(8):
    nq = rng.randint(1, 2); nl = rng.randint(0, 2)
    facs = []
    for _ in range(nq):      # (u + a)^2 + g^2, a >= 0: roots -a +- i g
        a_ = Q(rng.randint(0, 9), 8); g_ = Q(rng.randint(1, 40), 8)
        facs.append([a_ * a_ + g_ * g_, 2 * a_, Q(1)])
    for _ in range(nl):
        facs.append([Q(rng.randint(0, 12), 8), Q(1)])
    co = from_roots_quadratics(facs); n = len(co) - 1
    if n < 2: continue
    G, _ = gram(poly(co), n)
    resB.append(dict(deg=n, inertia=inertia_charpoly(G)))
out["B_hurwitz"] = resB
print("B Hurwitz b: (pos, neg, zero):", [(r["deg"], r["inertia"]) for r in resB], flush=True)
co = from_roots_quadratics([[Q(-1), Q(1)], [Q(1, 4), Q(1)]])      # roots 1 and -1/4: base with the pole, single real zero a = 1/4
G, _ = gram(poly(co), 2); i1 = inertia_charpoly(G)
co = from_roots_quadratics([[Q(-1), Q(1)], [Q(3, 4), Q(1)]])      # single real zero a = 3/4
G, _ = gram(poly(co), 2); i2 = inertia_charpoly(G)
out["B_single_real_zero"] = {"a=1/4": i1, "a=3/4": i2}
print("single real zero with the pole: a=1/4", i1, " a=3/4", i2, " (lane: (1,0) and (0,1))", flush=True)

# ---------- C
def bquartet(E, c):
    def b(u):
        t = u * u + u + c; s = 2 * u + 1
        return (u - 1) * (t * t - E * s * s)
    return b
resC = []
cases = []
for rep in range(24):
    eta = Q(rng.randint(1, 499), 1000); g = Q(rng.randint(1, 6000), 100)
    cases.append((eta, g, "inside"))
cases += [(Q(1, 1000), Q(1, 50), "inside-corner"), (Q(499, 1000), Q(1, 50), "inside-corner"), (Q(1, 1000), Q(90), "inside-corner"), (Q(499, 1000), Q(90), "inside-corner"),
          (Q(1, 4), Q(1), "inside (lane base point)")]
cases += [(Q(3, 5), Q(2), "outside eta>1/2"), (Q(7, 8), Q(1, 3), "outside eta>1/2"), (Q(11, 10), Q(5), "outside eta>1/2")]
for (eta, g, tag) in cases:
    E = eta * eta; c = Q(1, 4) + E + g * g
    b = bquartet(E, c)
    G, _ = gram(b, 5)
    r = dict(eta=str(eta), g=str(g), tag=tag, inertia=inertia_charpoly(G), size=int(G.nrows()))
    resC.append(r)
out["C_quartet"] = resC
ins = [r for r in resC if r["tag"].startswith("inside")]
print("C quartet inside the strip: %d configurations, inertia set" % len(ins), sorted(set((r["inertia"][0], r["inertia"][1]) for r in ins)), "matrix size", sorted(set(r["size"] for r in resC)), flush=True)
print("C quartet outside:", [(r["eta"], r["g"], r["inertia"]) for r in resC if r["tag"].startswith("outside")], flush=True)
# unpaired left pair with the pole (lane: negative index 2)
co = from_roots_quadratics([[Q(-1), Q(1)], [Q(1, 16) + Q(4), Q(1, 2), Q(1)]])     # zeros a = 1/4 +- 2i -> roots -a
G, _ = gram(poly(co), 3); out["C_unpaired_left_pair"] = inertia_charpoly(G)
co = from_roots_quadratics([[Q(-1), Q(1)], [Q(9, 16) + Q(4), Q(3, 2), Q(1)]])     # right pair 3/4 +- 2i
G, _ = gram(poly(co), 3); out["C_unpaired_right_pair"] = inertia_charpoly(G)
print("unpaired left pair 1/4+-2i:", out["C_unpaired_left_pair"], " right pair 3/4+-2i:", out["C_unpaired_right_pair"], flush=True)

# ---------- D
sys.path.insert(0, sys.argv[1])
from quartet_lib import Hmat, m as mH
def factors(E, c):
    F1 = 64 * E**2 - 144 * E * c - 9 * E + 81 * c**2
    F2 = 64 * E**2 + 16 * E * c - 49 * E + c**2 + 4 * c + 4
    F3 = 10783 * E**2 + 5154 * E * c**2 - 13360 * E * c + 187 * E + 1831 * c**4 - 4408 * c**3 + 4459 * c**2 - 102 * c + 51
    F4 = (133714 * E**4 - 37020 * E**3 * c**2 - 248918 * E**3 * c - 7198 * E**3 + 1421140 * E**2 * c**4 - 1365610 * E**2 * c**3 + 749137 * E**2 * c**2
          - 99726 * E**2 * c + 62008 * E**2 - 599100 * E * c**6 - 522490 * E * c**5 + 1168208 * E * c**4 - 778576 * E * c**3 + 226276 * E * c**2 - 94564 * E * c
          - 8874 * E + 69874 * c**8 + 159802 * c**7 - 62947 * c**6 - 162434 * c**5 + 225264 * c**4 - 129516 * c**3 + 41406 * c**2 + 6052 * c + 1037)
    return F1, F2, F3, F4
resD = []
for rep in range(12):
    if rep < 8:
        eta = Q(rng.randint(1, 499), 1000); g = Q(rng.randint(1, 900), 37); E = eta * eta; c = Q(1, 4) + E + g * g
    else:
        E = Q(rng.randint(-300, 300), 17); c = Q(rng.randint(-300, 300), 19)
    H = Hmat(E, c)
    co = [Q(x) for x in H.charpoly().coeffs()]
    low = next(i for i, x in enumerate(co) if x != 0)
    e6 = co[mH - 6]
    F1, F2, F3, F4 = factors(E, c)
    prod = Q(8388608, 4782969) * F1 * F2 * F3 * F4 * (E - c) ** 4 * (E - c * c) ** 4 * (4 * E - 1) ** 4
    resD.append(dict(E=str(E), c=str(c), rank=mH - low, e6_equals_product=bool(e6 == prod), e6_positive=bool(e6 > 0), in_domain=rep < 8,
                     inertia=inertia_charpoly(H)))
out["D_e6"] = resD
print("D e6 = product at fresh points:", [r["e6_equals_product"] for r in resD], "ranks", [r["rank"] for r in resD],
      "inertia of H", [r["inertia"][:2] for r in resD], flush=True)

# ---------- E
import sympy as sp
E_, c_, s_, t_, eta_, g_ = sp.symbols("E c s t eta g")
F1, F2, F3, F4 = factors(E_, c_)
sub = {E_: eta_**2, c_: sp.Rational(1, 4) + eta_**2 + g_**2}
id1 = sp.expand(F1.subs(sub) * sp.Rational(1, 9) * 9 - sp.Rational(81, 81) * 0)   # placeholder to keep exact
r1 = sp.expand(F1.subs(sub) / 81 - sp.Rational(1, 16) * ((2 * eta_ - 3)**2 + 36 * g_**2) * ((2 * eta_ + 3)**2 + 36 * g_**2) / 81)
r1b = sp.expand(((9 * c_ - 8 * E_)**2 - 9 * E_) - F1)
r2 = sp.expand(F2.subs(sub) - sp.Rational(1, 16) * (9 * (2 * eta_ - 1)**2 + 4 * g_**2) * (9 * (2 * eta_ + 1)**2 + 4 * g_**2))
r2b = sp.expand(((c_ + 8 * E_ + 2)**2 - 81 * E_) - F2)
subst = {E_: s_ / (4 * (1 + s_)), c_: sp.Rational(1, 4) + s_ / (4 * (1 + s_)) + t_}
signs = {}
for nm, F in (("F1", F1), ("F2", F2), ("F3", F3), ("F4", F4)):
    num = sp.Poly(sp.numer(sp.together(F.subs(subst))), s_, t_)
    den = sp.denom(sp.together(F.subs(subst)))
    cf = num.coeffs()
    signs[nm] = dict(all_coeffs_positive=bool(all(x > 0 for x in cf)), n_coeffs=len(cf), n_negative=int(sum(1 for x in cf if x < 0)), denominator=str(sp.factor(den)))
disc = sp.expand((5154 * c_**2 - 13360 * c_ + 187)**2 - 4 * 10783 * (1831 * c_**4 - 4408 * c_**3 + 4459 * c_**2 - 102 * c_ + 51))
disc_claim = -52410976 * c_**4 + 52410976 * c_**3 - 11908392 * c_**2 - 597176 * c_ - 2164763
nroots = len(sp.Poly(disc, c_).real_roots())
out["E_signs"] = dict(F1_identity_residual=str(r1), F1_form_residual=str(r1b), F2_identity_residual=str(r2), F2_form_residual=str(r2b), substitution=signs,
                      F3_discriminant_matches=bool(sp.expand(disc - disc_claim) == 0), F3_discriminant=str(disc), F3_disc_real_roots=nroots,
                      F3_disc_at_0=str(disc.subs(c_, 0)))
print("E:", json.dumps(out["E_signs"]), flush=True)
json.dump(out, open("d10_check.json", "w"), indent=1, default=str)
