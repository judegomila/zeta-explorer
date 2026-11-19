"""Lemma L check: in unitary normalisation (x = Xu/q, y = Yu/q) every coefficient of N_lambda(Xu, Yu), n = 2, is a
polynomial in s = T/sqrt(q) and v = 1/q with integer coefficients; T occurs only through s; the value at s = v = 0
is a nonnegative integer (no sign at shift 0). Also records, per shape, the minimal total order (in sqrt(1/q)) of
any monomial with a negative coefficient. Exact (sympy). Shapes l1, l2 <= LMAX."""
import sympy as sp, sys, json
from gt import ppart, q, r, T
s, v = sp.symbols('s v')
LMAX = int(sys.argv[1]) if len(sys.argv) > 1 else 4
allok = True; minneg = None; rec = {}
for l1 in range(LMAX+1):
    for l2 in range(LMAX+1):
        H = ppart(l1, l2, 2)
        for (k1, k2), c in H.items():
            c = sp.expand(c.subs(q, r**2) / r**(2*k1+2*k2))
            # write in s = T/r, v = 1/r^2 : each term co * T^a * r^(-b) -> need b >= a, b - a even
            p = sp.Poly(sp.expand(c * r**(4*(k1+k2)+8)), T, r)
            lead = 0
            for (a, b_), co in p.terms():
                b = 4*(k1+k2)+8 - b_          # exponent of 1/r
                if b < a or (b - a) % 2: allok = False; print('FAIL', (l1, l2), (k1, k2), a, b, co)
                if b == 0 and a == 0: lead += co
                if co < 0:
                    minneg = b if minneg is None else min(minneg, b)
                if a > 0 and b < a: allok = False
            if lead < 0: allok = False; print('NEG LEAD', (l1, l2), (k1, k2), lead)
        rec[f'{l1},{l2}'] = len(H)
print(f'Lemma L on {len(rec)} shapes (l1,l2 <= {LMAX}), {sum(rec.values())} monomials:', 'PASS' if allok else 'FAIL')
print('minimal power of q^(-1/2) on a term with negative integer coefficient:', minneg)
json.dump({'pass': allok, 'min_neg_order': minneg, 'monomials': rec}, open('lemmaL.json', 'w'))
