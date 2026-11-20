# Sign analysis of the factors of e6 on the domain D = {0 < E < 1/4, c > 1/4 + E}  (E = eta^2, c = 1/4 + eta^2 + g^2, g > 0).
import sympy as sp, json
E, c, s, t, eta, g = sp.symbols('E c s t eta g', real=True)
F = json.load(open('quartet_theorem.json'))['factors']
res = []
for fs, e in F:
    f = sp.sympify(fs.replace('^', '**'), locals={'E': E, 'c': c})
    # substitution covering D bijectively: E = s/(4(1+s)), s > 0;  c = 1/4 + E + t, t > 0
    h = sp.together(f.subs({c: sp.Rational(1, 4) + E + t}).subs({E: s/(4*(1+s))}))
    num, den = sp.fraction(h)
    P = sp.Poly(sp.expand(num), s, t); co = P.coeffs()
    sign = 'all coefficients > 0' if all(x > 0 for x in co) else ('all coefficients < 0' if all(x < 0 for x in co) else 'mixed (%d positive, %d negative)' % (sum(1 for x in co if x > 0), sum(1 for x in co if x < 0)))
    fg = sp.factor(f.subs({c: sp.Rational(1, 4) + eta**2 + g**2, E: eta**2}))
    print('factor^%d  deg(s,t) = %s  numerator coefficients: %s  denominator: %s' % (e, P.degree_list(), sign, sp.factor(den)))
    print('    in (eta, g):', fg if len(str(fg)) < 300 else '(long)')
    res.append(dict(factor=fs, exponent=e, coeff_sign=sign, in_eta_g=str(fg) if len(str(fg)) < 300 else None))
json.dump(res, open('quartet_signs.json', 'w'), indent=1)
