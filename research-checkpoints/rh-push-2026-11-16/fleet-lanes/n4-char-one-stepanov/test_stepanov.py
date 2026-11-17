# Exact (Fraction) checks for the char-one Stepanov lane. Memory: a few MB (lists of < 1e5 small tuples).
from fractions import Fraction as Fr
from itertools import product, combinations
import random
random.seed(7)
NEG = None  # -infinity

def tmax(terms, x):  # terms: list of (slope, intercept)
    return max(n * x + c for n, c in terms)

print("planned allocation: < 50 MB (pure python enumeration)")

# --- (a1) Frobenius identity: lam*f(x) = f^(lam)(lam x); equals f(lam x) iff all c_i = 0 -----------
bad = 0; cnt = 0; boolean_ok = 0; nonbool_fail = 0
xs = [Fr(k, 7) for k in range(0, 40)]
lams = [Fr(2), Fr(3), Fr(5, 2), Fr(7, 3)]
for _ in range(2000):
    k = random.randint(1, 4)
    terms = [(random.randint(-4, 4), Fr(random.randint(-6, 6), random.randint(1, 5))) for _ in range(k)]
    for lam in lams:
        tw = [(n, lam * c) for n, c in terms]
        for x in xs:
            cnt += 1
            if lam * tmax(terms, x) != tmax(tw, lam * x): bad += 1
        same = all(lam * tmax(terms, x) == tmax(terms, lam * x) for x in xs)
        if all(c == 0 for _, c in terms):
            boolean_ok += same
        elif not same:
            nonbool_fail += 1
print(f"(a1) f^lam = f^(lam) o Fr_lam : {cnt} exact evaluations, violations = {bad}")
print(f"     non-Boolean f with f^lam != f o Fr_lam on the grid: {nonbool_fail} cases")

# --- (a2) Boolean-rational sections on [0,inf): max_i(n_i x) = (max n_i) x --------------------------
viol = 0; tot = 0
for k in range(1, 5):
    for ns in combinations(range(-5, 6), k):
        tot += 1
        if any(max(n * x for n in ns) != max(ns) * x for x in xs): viol += 1
print(f"(a2) Boolean max_i(n_i x) on x>=0 equals (max n_i) x: {tot} families, violations = {viol}")
print("     => Boolean-rational sections of slope <= N on [0,inf): exactly {n x : n <= N}; count N+1 (slopes >= 0)")

# --- (a3) C_p: f(p lam)=f(lam) and p*f = f o Fr_p = f  => (p-1) f = 0 => f = 0 ---------------------
# degree-zero lemma on C_p: sum over one period of lam*(jump of f') = 0, for random periodic PL f
def periodic_pl(p, nbreak):
    # breakpoints in [1,p); slopes h_k in H_p = Z[1/p]; last slope fixed by periodicity f(p)=f(1)
    while True:
        pts = sorted(set(Fr(random.randint(1, 999), 1000) * (p - 1) + 1 for _ in range(nbreak)))
        pts = [Fr(1)] + [t for t in pts if 1 < t < p] + [Fr(p)]
        if len(pts) < 4: continue
        m = len(pts) - 1
        hs = [Fr(random.randint(-8, 8), p ** random.randint(0, 3)) for _ in range(m - 1)]
        acc = sum(h * (pts[i + 1] - pts[i]) for i, h in enumerate(hs))
        hs.append(-acc / (pts[m] - pts[m - 1]))  # last slope real-rational, not nec. in H_p: degree lemma holds anyway
        return pts, hs
for p in (2, 3):
    worst = 0; zeros_eq_poles = 0; N = 3000
    for _ in range(N):
        pts, hs = periodic_pl(p, random.randint(3, 8))
        m = len(hs)
        # jumps at pts[1..m-1], and at pts[0]~pts[m]: slope after pts[m] is hs[0]/p
        orders = [pts[i] * (hs[i] - hs[i - 1]) for i in range(1, m)] + [pts[m] * (hs[0] / p - hs[m - 1])]
        worst = max(worst, abs(sum(orders)))
        zeros = sum(o for o in orders if o > 0); poles = -sum(o for o in orders if o < 0)
        zeros_eq_poles += (zeros == poles)
    print(f"(a3/b) C_{p}: {N} random periodic PL functions: |sum of orders| max = {worst}; zeros == poles in {zeros_eq_poles}/{N}")

# --- (b) total break order of tropical polynomials Phi(lam)=max_i(m_i + n_i lam), integer m_i, n_i ---
# roots at rational lam; multiplicity = slope jump; total over lam>0 vs degree = max n - min n.
def breaks(terms):
    # upper envelope on lam in (0,inf); returns list of (lam, jump)
    # brute force: candidate lams = pairwise intersections
    cands = set()
    for (n1, m1), (n2, m2) in combinations(terms, 2):
        if n1 != n2:
            lam = Fr(m1 - m2, n2 - n1)
            if lam > 0: cands.add(lam)
    out = []
    for lam in sorted(cands):
        v = max(m + n * lam for n, m in terms)
        act = [n for n, m in terms if m + n * lam == v]
        if max(act) > min(act): out.append((lam, max(act) - min(act)))
    return out
for p in (2, 3):
    pp = {Fr(p ** k) for k in range(1, 6)}
    best = Fr(0); best_all = Fr(0); n_enum = 0; denom_ok = True
    for d in range(1, 5):
        for ms in product(range(-9, 1), repeat=d + 1):
            terms = [(i, ms[i]) for i in range(d + 1)]
            br = breaks(terms); n_enum += 1
            tot_all = sum(j for _, j in br); tot_pp = sum(j for lam, j in br if lam in pp)
            for lam, j in br:
                if j % lam.denominator: denom_ok = False
            best_all = max(best_all, Fr(tot_all, d)); best = max(best, Fr(tot_pp, d))
    print(f"(b) p={p}: {n_enum} tropical polynomials deg<=4, coefficients in [-9,0]: "
          f"max (break order on {{p^k}})/deg = {best}, max (all positive breaks)/deg = {best_all}; "
          f"multiplicity at u/v divisible by v: {denom_ok}")

# --- (b') prescribed simple breaks at an arbitrary finite set S of positive integers: degree = |S| ---
def poly_with_roots(S):
    S = sorted(S); terms = [(0, 0)]; m = 0
    for i, s in enumerate(S, 1):
        m -= s; terms.append((i, m))   # line i meets line i-1 at lam = s
    return terms
for name, S in (("prime powers <= 64", [2,3,4,5,7,8,9,11,13,16,17,19,23,25,27,29,31,32,37,41,43,47,49,53,59,61,64]),
                ("composites non-prime-power <= 40", [6,10,12,14,15,18,20,21,22,24,26,28,30,33,34,35,36,38,39,40]),
                ("all integers 2..30", list(range(2, 31)))):
    t = poly_with_roots(S); br = breaks(t)
    print(f"(b') S = {name}: degree {len(t)-1}, breaks exactly S with multiplicity 1: {[l for l,_ in br]==[Fr(s) for s in S] and all(j==1 for _,j in br)}")

# --- (c) factorisation: F(x,lam) = max_i(a_i(x) + lam n_i x) with break locus containing {lam = r} x interval
# forces a_i - a_j = r (n_j - n_i) x there; check on the tautological section x*max(1, lam/q)
q = 4
ok = all(max(x, lam * x / q) == x * max(Fr(1), lam / q) for x in xs for lam in [Fr(k, 3) for k in range(1, 40)])
print(f"(c) max(x, lam x / q) = x * max(1, lam/q) (break on lam = q for every x): {ok}")
