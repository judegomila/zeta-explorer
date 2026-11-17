# First test: p-part of the quadratic A_2 Weyl group multiple Dirichlet series.
# Exact symbolic computation (sympy). Largest object: a 16x16 linear system. Planned allocation < 50 MB.
import sympy as sp, itertools, json
from fractions import Fraction
print("planned allocation: symbolic series to order 12 in two variables, < 50 MB")
x, y, p = sp.symbols('x y p', positive=True)
sq = sp.sqrt(p)
f = (1 - x*y) / ((1 - x)*(1 - y)*(1 - p*x**2*y**2))
out = {}

# ---- (a) Chinta-Gunnells action for n = 2, A_2; x = p^-s (row variable m), y = p^-w (variable d)
def even_odd(F, v):
    return (F + F.subs(v, -v))/2, (F - F.subs(v, -v))/2
def act1(F):   # sigma_1: s -> 1-s, w -> w+s-1/2 ; parity taken in y (the neighbour)
    Fe, Fo = even_odd(F, y)
    sub = {x: 1/(p*x), y: sq*x*y}
    return -(1 - p*x)/(p*x*(1 - x))*Fe.subs(sub, simultaneous=True) + 1/(sq*x)*Fo.subs(sub, simultaneous=True)
def act2(F):   # sigma_2: w -> 1-w, s -> s+w-1/2 ; parity in x
    Fe, Fo = even_odd(F, x)
    sub = {y: 1/(p*y), x: sq*x*y}
    return -(1 - p*y)/(p*y*(1 - y))*Fe.subs(sub, simultaneous=True) + 1/(sq*y)*Fo.subs(sub, simultaneous=True)
i1 = sp.simplify(act1(f) - f); i2 = sp.simplify(act2(f) - f)
print("(a) f|sigma_1 - f =", i1, "   f|sigma_2 - f =", i2)
out['invariant_sigma1'] = (i1 == 0); out['invariant_sigma2'] = (i2 == 0)

# ---- (b) uniqueness: numerators N of bidegree <= (3,3) with N/D invariant under sigma_1, sigma_2
D = (1 - x)*(1 - y)*(1 - p*x**2*y**2)
cs = sp.symbols('c0:16'); mons = [x**a*y**b for a in range(4) for b in range(4)]
N = sum(c*m for c, m in zip(cs, mons)); G = N/D
eqs = []
for act in (act1, act2):
    num = sp.numer(sp.together(act(G) - G))
    eqs += sp.Poly(sp.expand(num), x, y).coeffs()
sol = sp.solve(eqs, cs, dict=True)[0]
Nsol = sp.factor(N.subs(sol)); free = sorted(Nsol.free_symbols - {x, y, p}, key=str)
print("(b) invariant numerators of bidegree <= (3,3):", Nsol, "  free parameters:", free)
out['unique_up_to_scalar'] = (len(free) == 1); out['numerator'] = str(Nsol)

# ---- (c) column decomposition: coefficient of y^k is L_p(x) * Q_k(x)
K = 12
ser = sp.series(f, y, 0, K + 1).removeO()
def Q(chi, j):  # d = d0 p^(2j), chi = chi_d0(p): sum_{e1 e2 | p^j} mu(e1) chi(e1) e1^-s e2^(1-2s)
    return sum((p*x**2)**b for b in range(j + 1)) - chi*x*sum((p*x**2)**b for b in range(j))
ok = True; rows = []
for k in range(K + 1):
    ck = sp.simplify(ser.coeff(y, k))
    if k % 2 == 0: pred = Q(1, k//2)/(1 - x)        # d = p^(2j): d0 = 1, chi = 1, L_p = 1/(1-x)
    else:          pred = Q(0, (k - 1)//2)          # d = p^(2j+1): p | d0, chi = 0, L_p = 1
    good = sp.simplify(ck - pred) == 0; ok &= good
    xs = sp.series(ck, x, 0, 7).removeO()
    rows.append((k, [sp.simplify(xs.coeff(x, l)) for l in range(7)], good))
print("(c) coefficient of x^l y^k, l = 0..6   [matches L_p * Q_k]")
for k, r, good in rows: print("   k=%2d" % k, r, good)
out['columns_are_L_times_Q'] = bool(ok)

# ---- (d) the row-linear monomials x^1 y^k: split into L-part and correction part
print("(d) monomial x y^k:  from L_p (Euler factor)   from Q_k (Moebius term)   total   target -chi_{p^k}(p)")
lin = []
for k in range(K + 1):
    chi = 1 if k % 2 == 0 else 0
    Lpart = chi                                         # coefficient of x in 1/(1 - chi x)
    Qpart = sp.series(Q(chi, k//2), x, 0, 3).removeO().coeff(x, 1)
    tot = rows[k][1][1]
    lin.append((k, int(Lpart), int(Qpart), int(tot), -chi))
    print("   k=%2d   %+d   %+d   %+d   %+d" % lin[-1])
out['linear_table'] = lin
out['any_linear_coefficient_negative'] = any(t[3] < 0 for t in lin)

# ---- (e) general chi = chi_d0(p) = +-1, p^(2j) || d: row series L_p Q = 1 + p x^2 (...)/(1 - chi x)
c = sp.symbols('chi')
for j in (1, 2, 3):
    R = sp.series(Q(c, j)/(1 - c*x), x, 0, 6).removeO()
    co = [sp.expand(R.coeff(x, l)).subs(c**2, 1).subs(c**3, c).subs(c**4, 1).subs(c**5, c) for l in range(6)]
    print("(e) j=%d row coefficients at m = p^l, l=0..5:" % j, co)
    assert sp.expand(R.coeff(x, 1)) == 0
out['general_chi_linear_coefficient_zero_when_p2_divides_d'] = True

# ---- (f) raw symbol table: f = f_raw / (1 - p x^2 y^2), f_raw = sum (p^k / p^l)_imprimitive x^l y^k
raw = 1/(1 - x) + 1/(1 - y) - 1
print("(f) f * (1 - p x^2 y^2) - raw table =", sp.simplify(f*(1 - p*x**2*y**2) - raw))
out['f_is_raw_times_zeta_factor'] = sp.simplify(f*(1 - p*x**2*y**2) - raw) == 0

# ---- (g) the group on (s, w): affine maps, exact
def comp(A, B):  # A after B ; map = (M, v): (s,w) -> M (s,w) + v
    (M1, v1), (M2, v2) = A, B
    M = [[sum(M1[i][k]*M2[k][j] for k in range(2)) for j in range(2)] for i in range(2)]
    v = [sum(M1[i][k]*v2[k] for k in range(2)) + v1[i] for i in range(2)]
    return (tuple(map(tuple, M)), tuple(v))
h = Fraction(1, 2)
E = (((1, 0), (0, 1)), (0, 0))
S1 = (((-1, 0), (1, 1)), (1, -h))      # s -> 1-s, w -> s+w-1/2
S2 = (((1, 1), (0, -1)), (-h, 1))      # s -> s+w-1/2, w -> 1-w
grp = {E: 'e'}; frontier = [E]
while frontier:
    nxt = []
    for g in frontier:
        for nm, s_ in (('1', S1), ('2', S2)):
            hh = comp(s_, g)
            if hh not in grp: grp[hh] = (nm + grp[g]).replace('e', ''); nxt.append(hh)
    frontier = nxt
print("(g) group order:", len(grp))
gl = []
for (M, v), nm in grp.items():
    srow = "s -> %s*s + %s*w + %s" % (M[0][0], M[0][1], v[0])
    fixes_s = (M[0] == (1, 0) and v[0] == 0)
    gl.append((nm or 'e', srow, fixes_s)); print("   word", nm or 'e', "  ", srow, "  fixes s:", fixes_s)
out['group_order'] = len(grp); out['elements_fixing_row_variable'] = [g[0] for g in gl if g[2]]
json.dump(out, open('test1.json', 'w'), indent=1, default=str)
print(json.dumps({k: v for k, v in out.items() if k != 'linear_table'}, default=str))
