# Third factor of e6: quadratic in E. It has no real zero if its discriminant in E is negative for every real c.
import sympy as sp, json
E, c = sp.symbols('E c', real=True)
F = json.load(open('quartet_theorem.json'))['factors']
f = sp.sympify(F[2][0].replace('^', '**'), locals={'E': E, 'c': c})
P = sp.Poly(f, E); a2, a1, a0 = P.all_coeffs()
disc = sp.Poly(sp.expand(a1**2 - 4*a2*a0), c)
print('factor:', f); print('leading coefficient in E:', a2); print('discriminant in E:', disc.as_expr())
print('number of real roots of the discriminant (Sturm):', disc.count_roots(), ' value at c = 0:', disc.eval(0))
json.dump(dict(factor=str(f), disc=str(disc.as_expr()), disc_real_roots=int(disc.count_roots()), disc_at_0=str(disc.eval(0)), lead=str(a2)), open('quartet_f3.json', 'w'), indent=1)
