"""(a) Hankel/Rosati check: membership in I_C  <=>  H1=[sum t^(i+j)] > 0 and H2=[sum (4u-t^2) t^(i+j)] > 0 (exact, rational u).
(b) DH analogue: convex combinations of two genuine numerators (same q, same FE) with zeros off the circle.
(c) formal class data with empty I_C."""
import json, random, math
from pell import *
random.seed(1)
def hankels(Gy, g, u0):
    co = [sp.Rational(c.subs(U, u0)) for c in Gy.all_coeffs()]         # monic, high first
    e = [(-1)**k * co[k] for k in range(g+1)]                          # elementary symmetric
    p = [sp.Integer(g)]
    for k in range(1, 2*g+2):
        s_ = sum((-1)**(i-1) * e[i] * p[k-i] for i in range(1, min(k, g)+1) if k - i >= 1 or True) if k <= g else None
        # Newton: p_k = e1 p_{k-1} - e2 p_{k-2} + ... (+/-) k e_k
        val = 0
        for i in range(1, min(k, g)+1):
            term = e[i] * (p[k-i] if k - i > 0 else k)
            val += (-1)**(i-1) * term
        p.append(sp.nsimplify(val))
    H1 = sp.Matrix(g, g, lambda i, j: p[i+j])
    H2 = sp.Matrix(g, g, lambda i, j: 4*u0*p[i+j] - p[i+j+2])
    def posdef(Mx):
        return all(Mx[:k, :k].det() > 0 for k in range(1, g+1))
    return posdef(H1), posdef(H2)
tot = agree = 0; onlyH1 = onlyH2 = 0
for q, g in ((3, 2), (5, 2), (3, 3)):
    d = json.load(open(f"enum_q{q}_g{g}.json"))
    keys = sorted(d['tuples']); random.shuffle(keys)
    for key in keys[:60]:
        N = [int(x) for x in key.split(',')]
        P, h, b, L = pellikaan_P(q, g, N); Gy = G_poly(P, g)
        for _ in range(6):
            u0 = sp.Rational(random.randint(40, 1300), 100) if random.random() < .6 else sp.Rational(q*1000 + random.randint(-900, 900), 1000)
            s2 = sp.sqrt(u0)
            # exact membership at rational u (generic): use closed test
            mem = member_closed(Gy, g, u0)
            a, b_ = hankels(Gy, g, u0)
            tot += 1; agree += (mem == (a and b_)); onlyH1 += (a and not b_); onlyH2 += (b_ and not a)
print(f"(a) Hankel/Rosati vs membership: {agree}/{tot} agree; failures by H2 only (central type): {onlyH1}; by H1 only (collision type): {onlyH2}")

# (b) DH analogue in genus 2: midpoints of two genuine L-polynomials over F_q
for q in (3, 5, 7):
    d = json.load(open(f"enum_q{q}_g2.json")); Ls = []
    for key in d['tuples']:
        N = [int(x) for x in key.split(',')]
        L, h, A = weil_data(q, 2, N); Ls.append((N, L[1], L[2]))
    off = 0; tot = 0; ex = None
    on = lambda a1, a2: abs(a1) <= 4*math.sqrt(q) + 1e-12 and 2*math.sqrt(q)*abs(a1) - 2*q <= a2 + 1e-12 and a2 <= a1*a1/4 + 2*q + 1e-12
    for i in range(len(Ls)):
        assert on(Ls[i][1], Ls[i][2])
        for j in range(i):
            a1 = (Ls[i][1] + Ls[j][1])/2; a2 = (Ls[i][2] + Ls[j][2])/2; tot += 1
            if not on(a1, a2):
                off += 1
                if ex is None and a1 == int(a1) and a2 == int(a2): ex = (Ls[i], Ls[j], int(a1), int(a2))
    print(f"(b) q={q}: midpoints of pairs of genuine genus-2 numerators with a zero off the circle: {off}/{tot}; integer example: {ex}")
