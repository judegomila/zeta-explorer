"""Symbolic row series in the twist direction l2, double cover of GL(3), unitary normalisation x = Xu/q, y = Yu/q.
G^kappa_{l1,e}(U) = sum_j N^kappa_{(l1, 2j+e)} U^j, U = u^2. Verifies D(U) G = polynomial of degree <= 2 on J terms
and factors the numerator. eps = chi(-1) in {+1,-1}; T^2 = eps."""
import sympy as sp, itertools, sys, json
from gt import ppart, q, r, T, X, Y
Xu, Yu, U = sp.symbols('Xu Yu U')
J = 6
out = {}
for eps in (1, -1):
    def red(e):
        e = sp.expand(e.subs({q: r**2}))
        p = sp.Poly(e, T); res = 0
        for (d,), c in p.terms(): res += c * (eps**(d//2)) * T**(d % 2)
        return sp.expand(res)
    D = (1-U)*(1-Yu**2*U)*(1-Xu**2*Yu**2*U)
    for l1 in (0, 1, 2, 3):
        for e in (0, 1):
            cls = {}
            for j in range(J):
                H = ppart(l1, 2*j+e, 2)
                for (k1, k2), c in H.items():
                    key = (k1 % 2, k2 % 2)
                    cls.setdefault(key, [0]*J)
                    cls[key][j] += red(c) * (Xu/r**2)**k1 * (Yu/r**2)**k2
            for key, s in sorted(cls.items()):
                G = sum(sp.expand(s[j])*U**j for j in range(J))
                prod = sp.expand(sp.expand(D*G))
                P = sp.Poly(prod, U)
                low = sum(P.coeff_monomial(U**i)*U**i for i in range(0, 3))
                mid = [sp.simplify(P.coeff_monomial(U**i)) for i in range(3, J)]
                ok = all(m == 0 for m in mid)
                fac = sp.factor(sp.together(low))
                print(f'eps={eps:+d} l1={l1} e={e} kappa={key}: truncation {"OK" if ok else "FAIL"}; numerator = {fac}')
                out[f'{eps},{l1},{e},{key}'] = {'trunc_ok': bool(ok), 'numerator': str(fac)}
json.dump(out, open('rows_sym.json', 'w'), indent=1)
