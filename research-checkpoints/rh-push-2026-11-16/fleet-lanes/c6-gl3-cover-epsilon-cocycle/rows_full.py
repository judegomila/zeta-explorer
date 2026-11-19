"""Full row series (all kappa summed; T carries the quadratic symbol of the prime-to-p part of the index).
(1) A_1 check: Shimura relation recovered from the Gauss-sum recipe at n = 2.
(2) A_2, double cover of GL(3): G(U) = sum_j N_{(l1,2j+e)}(Xu,Yu) U^j, and the l1-direction twin (variable V).
Unitary normalisation x = Xu/q, y = Yu/q, r = sqrt q. Exact: integer/Gaussian-integer dict polynomials, sympy only
for the final factorisation. Planned memory: < 300 MB."""
import sympy as sp, json, sys
from gt import patterns
r, Xu, Yu, U, V = sp.symbols('r Xu Yu U V')
I = sp.I
out = {}
def pr(*a):
    print(*a); sys.stdout.flush()
# ---------- (1) A_1 ----------
def a1(l, Tv):
    s = 1
    for a in range(1, l+1):
        if a % 2 == 0: s += (1-1/r**2)*Xu**a
    a = l+1
    s += (-Xu**a/r**2) if a % 2 == 0 else Tv*Xu**a/r
    return sp.expand(s)
for Tv in (1, -1):
    for e in (0, 1):
        J = 7
        G = sum(a1(2*j+e, Tv)*U**j for j in range(J))
        P = sp.Poly(sp.expand(G*(1-U)*(1-Xu**2*U)), U)
        ok = all(sp.simplify(P.coeff_monomial(U**i)) == 0 for i in range(3, J))
        low = sum(P.coeff_monomial(U**i)*U**i for i in range(3))
        pr(f'A1 T={Tv:+d} l={e} mod 2: trunc {"OK" if ok else "FAIL"}; numerator = {sp.factor(sp.together(low))}')
        out[f'A1,{Tv},{e}'] = {'ok': bool(ok), 'num': str(sp.factor(sp.together(low)))}
# ---------- (2) A_2 ----------
def Nfull(l1, l2, Tv, eps):
    """dict (k1, k2, rpow) -> (re, im) ; value of sum_k H(p^k; p^l) x^k at x = Xu/r^2, y = Yu/r^2."""
    top = (l1+l2+2, l2+1, 0); acc = {}
    for (a11, a12, a22) in patterns(top):
        ents = [((a11-top[1])+(a12-top[2]), a11 == top[0], a11 == top[1]),
                (a12-top[2], a12 == top[1], a12 == top[2]),
                (a22-a12, a22 == a11, a22 == a12)]
        terms = {0: 1+0j}          # rpow -> coeff
        dead = False
        for G, b, c in ents:
            if b and c: dead = True; break
            if c: f = {2*G: 1}
            elif b: f = {2*G-2: -1} if G % 2 == 0 else {2*G-1: Tv}
            else:
                if G % 2: dead = True; break
                f = {2*G: 1, 2*G-2: -1}
            nt = {}
            for e1, c1 in terms.items():
                for e2, c2 in f.items(): nt[e1+e2] = nt.get(e1+e2, 0) + c1*c2
            terms = nt
        if dead: continue
        k1 = (a11-top[1])+(a12-top[2]); k2 = a22
        for e1, c1 in terms.items():
            key = (k1, k2, e1-2*k1-2*k2); acc[key] = acc.get(key, 0) + c1
    s = 0
    for (k1, k2, e), c in acc.items():
        c = complex(c)
        if c == 0: continue
        s += (int(round(c.real)) + I*int(round(c.imag))) * Xu**k1 * Yu**k2 * r**e
    return sp.expand(s)
J = 6
ONLY = sys.argv[1] if len(sys.argv) > 1 else 'both'
for eps, Tvals in ((1, (1, -1)), (-1, (1j, -1j))):
    if ONLY == 'minus' and eps == 1: continue
    if ONLY == 'plus' and eps == -1: continue
    for Tv in Tvals:
        for fixed in (0, 1, 2, 3):
            for e in (0, 1):
                for direction in ('l2', 'l1'):
                    if direction == 'l2':
                        G = sum(Nfull(fixed, 2*j+e, Tv, eps)*U**j for j in range(J))
                        D = (1-U)*(1-Yu**2*U)*(1-Xu**2*Yu**2*U); W = U
                    else:
                        G = sum(Nfull(2*j+e, fixed, Tv, eps)*V**j for j in range(J))
                        D = (1-V)*(1-Xu**2*V)*(1-Xu**2*Yu**2*V); W = V
                    P = sp.Poly(sp.expand(G*D), W)
                    ok = all(sp.simplify(P.coeff_monomial(W**i)) == 0 for i in range(3, J))
                    low = sp.together(sum(P.coeff_monomial(W**i)*W**i for i in range(3)))
                    f = sp.collect(sp.expand(low*r**6), W)/r**6 if eps == -1 else sp.factor(low)
                    other = 'l1' if direction == 'l2' else 'l2'
                    pr(f'A2 eps={eps:+d} T={Tv} {other}={fixed} {direction}={e} mod 2: trunc {"OK" if ok else "FAIL"}; num = {f}')
                    out[f'A2,{eps},{Tv},{other}={fixed},{direction}={e}'] = {'ok': bool(ok), 'num': str(f)}
json.dump(out, open('rows_full_%s.json' % ONLY, 'w'), indent=1)
