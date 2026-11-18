"""Exact (Fraction) tests for the fixed-degree question: chain set C_n, complete-graph set F_n, Lee-Yang set LY_n.
Normalisation: P(w) = sum over spin configurations of prod_{i<j, sigma_i != sigma_j} a_ij * w^(#up), a_ij = exp(-2 J_ij) in [0,1].
P is monic, self-reciprocal, degree n. No floats. Largest object: 2^10 vertices x 6 coefficients (n=10: 2^45 not enumerated; partitions used)."""
from fractions import Fraction as Fr
import itertools, json, math, random
random.seed(7)
out = {}

def poly_add(p, q):
    m = max(len(p), len(q)); p = p + [Fr(0)] * (m - len(p)); q = q + [Fr(0)] * (m - len(q))
    return [x + y for x, y in zip(p, q)]
def poly_mul(p, q):
    r = [Fr(0)] * (len(p) + len(q) - 1)
    for i, x in enumerate(p):
        for j, y in enumerate(q):
            r[i + j] += x * y
    return r
def ferro_poly(n, a):  # a: dict (i,j)->Fraction, missing = 1 ; brute force over 2^n configurations
    c = [Fr(0)] * (n + 1)
    for bits in range(1 << n):
        wgt = Fr(1)
        for i in range(n):
            for j in range(i + 1, n):
                if ((bits >> i) & 1) != ((bits >> j) & 1):
                    wgt *= a.get((i, j), Fr(1))
        c[bin(bits).count("1")] += wgt
    return c  # c[k] = coefficient of w^k
def szego_chain(alist):  # Phi_0 = 1, Phi_k = w Phi_{k-1} + a_k Phi*_{k-1};  P = w Q + Q*, Q = Phi_{N-1}
    phi = [Fr(1)]
    for a in alist:
        star = phi[::-1]
        phi = poly_add([Fr(0)] + phi, [a * x for x in star])
    Q = phi
    return poly_add([Fr(0)] + Q, Q[::-1])
def schur_cohn(Q):  # inverse Szego recursion: returns parameters a_k = Phi_k(0), k = deg..1 reversed to 1..deg
    Q = list(Q); params = []
    while len(Q) > 1:
        lead = Q[-1]; Q = [x / lead for x in Q]
        a = Q[0]; params.append(a)
        if a * a == 1: return params[::-1] + ["boundary"]
        star = Q[::-1]
        num = [x - a * y for x, y in zip(Q, star)]  # = (1-a^2) w Phi_{k-1}
        Q = [x / (1 - a * a) for x in num[1:]]
    return params[::-1]

# 0. Szego identity against brute-force transfer sums, n = 2..7, random rational parameters
ok = True
for n in range(2, 8):
    for _ in range(20):
        al = [Fr(random.randint(0, 16), 16) for _ in range(n - 1)]
        P1 = szego_chain(al)
        P2 = ferro_poly(n, {(i, i + 1): al[i] for i in range(n - 1)})
        ok &= (P1 == P2)
        if all(0 < x < 1 for x in al):
            Q = [Fr(1)]
            for a in al:
                Q = poly_add([Fr(0)] + Q, [a * x for x in Q[::-1]])
            ok &= (schur_cohn(Q) == al)
out["szego_identity_exact_n2_7"] = ok
print("Szego chain identity P = wQ + Q* equals brute-force chain polynomial, and Schur-Cohn inversion returns the couplings:", ok)

# 1. n = 3. LY_3 = {w^3 + c w^2 + c w + 1 : 0 <= c <= 3}
G = [Fr(k, 16) for k in range(17)]
ok_in = True; cnt = 0
for a1 in G:
    for a2 in G:
        P = szego_chain([a1, a2]); c = P[1]
        ok_in &= (P == [1, c, c, 1]) and (0 <= c <= 3); cnt += 1
ok_onto = True; cnt2 = 0
for k in range(0, 3 * 64 + 1):
    c = Fr(k, 64); a1 = c / 3; a2 = 2 * c / (3 + c)
    ok_onto &= (0 <= a1 <= 1 and 0 <= a2 <= 1 and szego_chain([a1, a2]) == [1, c, c, 1]); cnt2 += 1
out["n3"] = dict(grid_SC_vectors=cnt, all_in_LY=ok_in, grid_LY_points=cnt2, all_have_exact_chain_preimage=ok_onto)
print("n=3:", out["n3"])

# 2. n = 4. LY_4 = {0<=c1<=4, c2>=0, c2>=2c1-2, c2<=c1^2/4+2}
def in_LY4(c1, c2): return 0 <= c1 <= 4 and c2 >= 0 and c2 >= 2 * c1 - 2 and 4 * c2 <= c1 * c1 + 8
G = [Fr(k, 12) for k in range(13)]
ok_in = True; cnt = 0
for a in G:
    for b in G:
        for c in G:
            P = szego_chain([a, b, c]); cnt += 1
            ok_in &= (P[0] == 1 and P[1] == P[3] and P[4] == 1 and in_LY4(P[1], P[2]))
            ok_in &= (P[1] == (a + c) * (1 + b) and P[2] == 2 * (b + a * c * (1 + b)))
# complete graph: random + grid of all six parameters in {0,1/2,1}
ok_F = True; cntF = 0
for vals in itertools.product([Fr(0), Fr(1, 3), Fr(2, 3), Fr(1)], repeat=6):
    a = dict(zip(itertools.combinations(range(4), 2), vals)); P = ferro_poly(4, a); cntF += 1
    ok_F &= in_LY4(P[1], P[2])
# onto: explicit preimage. c2 <= 2: (a,b,c) = (2c1/(2+c2), c2/2, 0). c2 >= 2: b = 1, a,c roots of x^2 - (c1/2) x + (c2-2)/4.
ok_onto = True; cnt2 = 0; cnt_alg = 0
for i in range(0, 4 * 16 + 1):
    for j in range(0, 6 * 16 + 1):
        c1 = Fr(i, 16); c2 = Fr(j, 16)
        if not in_LY4(c1, c2): continue
        cnt2 += 1
        if c2 <= 2:
            a = 2 * c1 / (2 + c2); b = c2 / 2; c = Fr(0)
            ok_onto &= (0 <= a <= 1 and 0 <= b <= 1); P = szego_chain([a, b, c])
            ok_onto &= (P == [1, c1, c2, c1, 1])
        else:
            s = c1 / 2; p = (c2 - 2) / 4; disc = s * s - 4 * p; cnt_alg += 1
            # roots of x^2 - s x + p lie in [0,1]  <=>  disc>=0, 0<=s<=2, p>=0, 1-s+p>=0 ; identity c1 = 2s, c2 = 2(1+2p) is exact in s,p
            ok_onto &= (disc >= 0 and 0 <= s <= 2 and p >= 0 and 1 - s + p >= 0 and c1 == 2 * s and c2 == 2 * (1 + 2 * p))
out["n4"] = dict(grid_SC_vectors=cnt, all_in_LY=ok_in, complete_graph_grid=cntF, complete_all_in_LY=ok_F,
                 grid_LY_points=cnt2, of_which_quadratic_irrational_preimage=cnt_alg, all_have_exact_chain_preimage=ok_onto)
print("n=4:", out["n4"])

# 3. n = 5: vertices of the cube [0,1]^10 (all 1024), exact; separating linear inequality 5 c2 - 9 c1 - 5 <= 0
pairs5 = list(itertools.combinations(range(5), 2))
verts = set(); worst = None
for vals in itertools.product([Fr(0), Fr(1)], repeat=10):
    P = ferro_poly(5, dict(zip(pairs5, vals)))
    assert P[0] == 1 and P[1] == P[4] and P[2] == P[3]
    verts.add((P[1], P[2])); v = 5 * P[2] - 9 * P[1] - 5
    worst = v if worst is None else max(worst, v)
print("n=5: distinct vertex images (c1,c2):", sorted((int(x), int(y)) for x, y in verts), " max of 5c2-9c1-5 over 1024 vertices:", worst)
c1, c2 = Fr(0), Fr(5, 4)
P0 = [1, c1, c2, c2, c1, 1]
fac = poly_mul([Fr(1), Fr(1)], poly_mul([1, Fr(-1, 2), 1], [1, Fr(-1, 2), 1]))
print("P0 = w^5 + (5/4) w^3 + (5/4) w^2 + 1 == (w+1)(w^2 - w/2 + 1)^2 :", P0 == fac, "; 5c2-9c1-5 at P0 =", 5 * c2 - 9 * c1 - 5)
out["n5"] = dict(vertex_images=sorted((int(x), int(y)) for x, y in verts), max_separator_on_vertices=str(worst), P0=[str(x) for x in P0],
                 P0_factorisation_checked=(P0 == fac), separator_at_P0=str(5 * c2 - 9 * c1 - 5))
# random interior check of the multi-affine bound (exact)
mx = None
for _ in range(3000):
    a = {pr: Fr(random.randint(0, 32), 32) for pr in pairs5}; P = ferro_poly(5, a); v = 5 * P[2] - 9 * P[1] - 5
    mx = v if mx is None else max(mx, v)
print("n=5: max of 5c2-9c1-5 over 3000 random rational interior points:", float(mx))
# multi-affinity: each coefficient has degree <= 1 in each a_ij (checked by second differences at random points)
ok_ma = True
for _ in range(200):
    a = {pr: Fr(random.randint(0, 32), 32) for pr in pairs5}; pr = random.choice(pairs5)
    vals = []
    for t in (Fr(0), Fr(1, 2), Fr(1)):
        b = dict(a); b[pr] = t; vals.append(ferro_poly(5, b))
    ok_ma &= all(vals[0][k] + vals[2][k] == 2 * vals[1][k] for k in range(6))
print("n=5: coefficients affine in each a_ij separately (200 exact second differences):", ok_ma)
out["n5"]["multiaffine_check"] = ok_ma

# 4. chain versus complete graph at n = 5: exact chain grid, extreme values (screen of C_5 against F_5)
G = [Fr(k, 8) for k in range(9)]
best = {}
for al in itertools.product(G, repeat=4):
    P = szego_chain(list(al)); key = P[1]
    lo, hi = best.get(key, (P[2], P[2])); best[key] = (min(lo, P[2]), max(hi, P[2]))
print("n=5 chain grid (9^4 points): c1 -> (min c2, max c2) at selected c1:")
for key in [Fr(0), Fr(1, 2), Fr(1), Fr(2), Fr(3), Fr(4), Fr(5)]:
    if key in best: print("  c1 =", key, " c2 in", [str(x) for x in best[key]], " LY upper =", 1 + (key + 1) ** 2 / 4)
json.dump(out, open("exact_small.json", "w"), indent=1)
