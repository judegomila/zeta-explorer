# test1: residues of the quadratic A_2 series (theta-induced maximal-parabolic rows; theta_3 has no Whittaker term)
# (a) exact sympy on the p-part; (b) exact integer global array in the Goldfeld-Hoffstein / CFH model.
import sympy as sp, json, math
print("planned allocation: integer array 200 x 20000 int64 = 32 MB; sympy objects < 50 MB")
x, y, p = sp.symbols('x y p', positive=True)
f = (1 - x*y)/((1 - x)*(1 - y)*(1 - p*x**2*y**2))
out = {}
# (a1) pole w = 1: comes from m = square only (x-even part); local residue factor (1-1/p) * f_even(x, 1/p)
fe = sp.simplify((f + f.subs(x, -x))/2)
r_w = sp.simplify(((1 - y)*fe).subs(y, 1/p))
print("(a1) [(1-y) f_even_x](x, 1/p) =", sp.factor(r_w), "  minus 1/(1-x^2):", sp.simplify(r_w - 1/(1 - x**2)))
out['res_w1_ppart_is_zeta2s'] = sp.simplify(r_w - 1/(1 - x**2)) == 0
fo = sp.simplify((f - f.subs(x, -x))/2)
print("     odd part in x at y = 1/p (no pole globally, listed for the record):", sp.factor(sp.simplify(((1-y)*fo).subs(y, 1/p))))
# (a2) pole s = 1 by symmetry
fey = sp.simplify((f + f.subs(y, -y))/2)
r_s = sp.simplify(((1 - x)*fey).subs(x, 1/p))
out['res_s1_ppart_is_zeta2w'] = sp.simplify(r_s - 1/(1 - y**2)) == 0
print("(a2) [(1-x) f_even_y](1/p, y) - 1/(1-y^2) =", sp.simplify(r_s - 1/(1 - y**2)))
# (a3) iterated residue at s = w = 1: the residue at w = 1 is zeta(2s)-type, local factor 1/(1-x^2); at x = 1/p it is finite
it = sp.simplify((1/(1 - x**2)).subs(x, 1/p))
print("(a3) local factor of Res_{w=1} at s = 1:", it, " (finite: zeta(2); no pole at s = 1, so the iterated residue of the (1,1) Whittaker coefficient at s = w = 1 is 0)")
out['iterated_residue_local_factor_at_s1'] = str(it)
# (a4) Whittaker normalisation: divide by zeta(2s) zeta(2w) zeta(2s+2w-1): local (1-x^2)(1-y^2)(1-p x^2 y^2)
N = sp.expand(sp.simplify(f*(1 - x**2)*(1 - y**2)*(1 - p*x**2*y**2)))
print("(a4) N(x,y) =", N)
rN = sp.simplify(r_w*(1 - x**2)*(1 - 1/p**2)*(1 - x**2/p))
print("     Whittaker-normalised residue local factor at w = 1:", sp.factor(rN), " = local factor of 1/(zeta(2) zeta(2s+1))")
out['whittaker_norm_residue_local'] = str(sp.factor(rN))

# (b) global array a(m, d) = coefficient of m^-s in L(s, chi_d0) Q_d(s), m, d odd positive
def jac(a, n):
    a %= n; r = 1
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0
M, D = 199, 19999
def sqfree_part(d):
    d0, d1, q = 1, 1, 3
    while q*q <= d:
        e = 0
        while d % q == 0: d //= q; e += 1
        if e % 2: d0 *= q
        d1 *= q**(e//2)
        q += 2
    return d0*d, d1
mu = [1]*(M+1)
for q in range(2, M+1):
    if all(q % r for r in range(2, int(q**.5)+1)):
        for k in range(q, M+1, q): mu[k] = -mu[k]
        for k in range(q*q, M+1, q*q): mu[k] = 0
def row(d):
    d0, d1 = sqfree_part(d)
    a = [0]*(M+1)
    # Q_d(s) = sum_{e1 e2 | d1} mu(e1) chi(e1) e1^-s e2^(1-2s);  times L(s, chi_d0)
    for e1 in range(1, min(d1, M)+1):
        if d1 % e1 or mu[e1] == 0: continue
        c1 = mu[e1]*jac(d0, e1)
        if c1 == 0: continue
        for e2 in range(1, d1//e1 + 1):
            if (d1//e1) % e2: continue
            base = e1*e2*e2
            if base > M: break
            for k in range(1, M//base + 1):
                if k % 2 == 0: continue
                a[base*k] += c1*e2*jac(d0, k)
    return a
A = {}
for d in range(1, D+1, 2): A[d] = row(d)
ms = list(range(1, M+1, 2))
res = {}
for b in (1, 3, 5, 7, 15, 21):
    means = {}
    for Dc in (4999, 19999):
        nd = (Dc+1)//2
        means[Dc] = [sum(jac(d, b)*A[d][m] for d in range(1, Dc+1, 2))/nd for m in ms]
    last = means[19999]
    on = [(m, round(v, 3)) for m, v in zip(ms, last) if m % b == 0 and math.isqrt(m//b)**2 == m//b]
    off = max(abs(v) for m, v in zip(ms, last) if not (m % b == 0 and math.isqrt(m//b)**2 == m//b))
    off5 = max(abs(v) for m, v in zip(ms, means[4999]) if not (m % b == 0 and math.isqrt(m//b)**2 == m//b))
    print("(b) twist chi_b(d), b=%2d: mean over odd d<=19999 of chi_b(d) a(m,d): on slice m = b n^2:" % b, on)
    print("      max |mean| off the slice: D=4999: %.4f   D=19999: %.4f" % (off5, off))
    res[b] = {'on_slice': on, 'max_off_slice_4999': off5, 'max_off_slice_19999': off}
out['global_twisted_means'] = res
json.dump(out, open('test1.json', 'w'), indent=1, default=str)
