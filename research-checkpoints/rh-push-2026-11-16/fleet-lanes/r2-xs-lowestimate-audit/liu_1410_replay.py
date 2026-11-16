# Replay of Liu 2610.26835v2 Lemma 14.10 (the critical class) over the whole range 13/18 <= kappa <= 1.
# Symbolic part: sympy, exact.  Analytic part: python-flint arb balls on a cover of [13/18, 1] by boxes.
# Output: enclosures of delta_c, lambda, d l*/d kappa, G', kappa_flat, B_flat, F_flat(13/18).
import sys, time
from fractions import Fraction as F
import sympy as sp
from flint import arb, fmpq, fmpz, ctx

ctx.prec = 160
FAILS = []
def check(name, ok):
    print(('PASS ' if ok else 'FAIL ') + name); sys.stdout.flush()
    if not ok: FAILS.append(name)

R = sp.Rational
b, l, k, dl, x = sp.symbols('b l kappa delta x', real=True)
c = 1 / (3 * k); al = R(5, 6)
lx = (1 - b - l) / 2; ly = (1 + b - l) / 2; h = (1 + b + 3 * l) / 2
D = 3 - (1 + 2 * c) * x; P = (2 - 2 * c * x) * (1 - x); J = (al - dl) * D + dl * P
Rk = 1 - dl + (al - dl) * dl * P / (2 * J)
C0 = -R(1, 4) + b / 6 + 5 * l / 4
E = C0 + dl / 2 + dl * x * (l + c * (h / 4 - ly / 2)) - R(3, 4) * h * (1 - Rk)     # Xu-Sang (28) = Liu (14.8)
Eh = E.subs(x, R(1, 2))
cr = (3 - 324 * k**2) * dl**2 + (756 * k**2 - 54 * k - 5) * dl + 40 * k - 300 * k**2
lst_num = 324 * dl**2 * k**2 - 72 * dl**2 * k + 3 * dl**2 - 684 * dl * k**2 + 126 * dl * k - 5 * dl + 450 * k**2 - 60 * k
lst_den = 324 * dl**2 * k**2 - 144 * dl**2 * k + 15 * dl**2 - 2340 * dl * k**2 + 450 * dl * k - 25 * dl + 2250 * k**2 - 300 * k
lst = lst_num / lst_den

print('== symbolic part ==')
check('E(delta,1/2) is affine in (b,l): mixed and second derivatives vanish',
      sp.simplify(sp.diff(Eh, b, 2)) == 0 and sp.simplify(sp.diff(Eh, l, 2)) == 0 and sp.simplify(sp.diff(Eh, b, l)) == 0)
Jh = J.subs(x, R(1, 2))
aux = 54 * dl * k - 6 * dl - 75 * k + 10
check('54 d k - 6 d - 75 k + 10 = -36 kappa J(delta,1/2)', sp.simplify(aux + 36 * k * Jh) == 0)
check('d_b E(delta,1/2) = cr/(24 kappa (54 d k - 6 d - 75 k + 10))', sp.simplify(sp.diff(Eh, b) - cr / (24 * k * aux)) == 0)
e_l = sp.simplify(sp.diff(Eh, l)); e_0 = sp.simplify(Eh.subs({b: 0, l: 0}))
lam = sp.together(e_l)
cand = sp.together(-e_0 / e_l)
diff_num = sp.numer(sp.together(cand - lst))
ident = sp.expand(diff_num) == 0
rem = sp.rem(sp.Poly(sp.expand(diff_num), dl), sp.Poly(cr, dl)) if not ident else None
check('l*(delta,kappa) printed in the paper equals -E(b=0,l=0)/d_l E ' + ('identically' if ident else 'modulo cr (difference numerator divisible by cr)'),
      ident or rem.is_zero)
# J > 0 on the rectangle (so aux < 0): J(delta,1/2) = (5/6-delta)(5/2-c) + delta(1-c/2) with 1/3 <= c <= 6/13
check('J(delta,1/2) = (5/6-delta)(5/2-c)+delta(1-c/2)', sp.simplify(Jh - ((al - dl) * (R(5, 2) - c) + dl * (1 - c / 2))) == 0)

# part (1): signs of cr at the four test abscissae on the whole kappa range, exact root counting
I0 = (R(13, 18), 1)
for d0, sgn in ((R(1, 8), -1), (R(23, 50), -1), (R(12, 25), 1), (R(5, 6), 1)):
    p = sp.Poly(cr.subs(dl, d0), k)
    nroots = p.count_roots(I0[0], I0[1])
    v = p.eval(I0[0])
    check('cr(%s, kappa) has %d roots in [13/18,1] and sign %+d at 13/18 (needed %+d)' % (d0, nroots, sp.sign(v), sgn), nroots == 0 and sp.sign(v) == sgn)
check('leading coefficient 3 - 324 kappa^2 < 0 on [13/18,1] (cr concave in delta)', 3 - 324 * R(13, 18)**2 < 0)

# rational functions to be enclosed
dcr_d = sp.diff(cr, dl); dcr_k = sp.diff(cr, k)
dl_k = sp.together(sp.diff(lst, k)); dl_d = sp.together(sp.diff(lst, dl))

def polyterms(expr):
    p = sp.Poly(sp.expand(expr), dl, k)
    den = sp.ilcm(1, 1, *[sp.Rational(cf).q for cf in p.coeffs()])
    return [(m, fmpz(int(cf * den))) for m, cf in zip(p.monoms(), p.coeffs())], fmpz(int(den))
def ratfun(expr):
    n, d_ = sp.fraction(sp.together(expr))
    return polyterms(n), polyterms(d_)
def ev_poly(pt, dv, kv):
    terms, den = pt
    s = arb(0)
    for (i, j), cf in terms:
        s += arb(cf) * dv**i * kv**j
    return s / arb(den)
def ev(rf, dv, kv):
    num, den = rf
    dn = ev_poly(den, dv, kv)
    if dn.contains(arb(0)): raise ZeroDivisionError
    return ev_poly(num, dv, kv) / dn

RF = dict(lst=ratfun(lst), lam=ratfun(lam), dl_k=ratfun(dl_k), dl_d=ratfun(dl_d), dcr_d=ratfun(dcr_d), dcr_k=ratfun(dcr_k), cr=ratfun(cr))

def delta_c(kv):
    A = 3 - 324 * kv * kv; Bq = 756 * kv * kv - 54 * kv - 5; Cq = 40 * kv - 300 * kv * kv
    disc = Bq * Bq - 4 * A * Cq
    if not (disc > 0): raise ValueError('disc')
    sq = disc.sqrt()
    return (-Bq + sq) / (2 * A), (-Bq - sq) / (2 * A)

def q2arb(fr):
    return arb(fmpq(fr.numerator, fr.denominator))

print('== interval part: cover of [13/18, 1] ==')
N = 30000
lo0 = F(13, 18); hi0 = F(1)
split = F(7497, 10000)
stats = dict(dc_lo=None, dc_hi=None, other_lo=None, dcrd=None, lam=None, D_all_hi=None, D_all_lo=None, D_hi_right=None, D_lo_mid=None, D_hi_mid=None, Gp=None)
def upd(key, val, mode):
    cur = stats[key]
    stats[key] = val if cur is None else (min(cur, val) if mode == 'min' else max(cur, val))
t0 = time.time()
edges = sorted(set([lo0 + (hi0 - lo0) * i / N for i in range(N + 1)] + [split, F(3, 4)]))
bad = 0
for i in range(len(edges) - 1):
    a_, b_ = edges[i], edges[i + 1]
    mid = (a_ + b_) / 2; rad = float((b_ - a_) / 2) * (1 + 1e-9) + 1e-300
    kv = q2arb(mid) + arb(0, rad)                 # ball containing [a_, b_]
    assert (kv - q2arb(a_)).contains(arb(0)) and (kv - q2arb(b_)).contains(arb(0))
    dc, other = delta_c(kv)
    ok = (dc > arb(fmpq(23, 50))) and (dc < arb(fmpq(12, 25))) and (other > arb(fmpq(5, 6)))
    dcrd = ev(RF['dcr_d'], dc, kv)
    lamv = ev(RF['lam'], dc, kv)
    Dv = ev(RF['dl_k'], dc, kv) - ev(RF['dl_d'], dc, kv) * ev(RF['dcr_k'], dc, kv) / dcrd
    Gp = arb(fmpq(1, 2)) + Dv / 4
    if not ok: bad += 1
    upd('dc_lo', float(dc.lower()), 'min'); upd('dc_hi', float(dc.upper()), 'max'); upd('other_lo', float(other.lower()), 'min')
    upd('dcrd', float(dcrd.lower()), 'min'); upd('lam', float(lamv.lower()), 'min')
    upd('D_all_hi', float(Dv.upper()), 'max'); upd('D_all_lo', float(Dv.lower()), 'min'); upd('Gp', float(Gp.lower()), 'min')
    if a_ >= split:
        upd('D_hi_right', float(Dv.upper()), 'max')
        if b_ <= F(3, 4):
            upd('D_lo_mid', float(Dv.lower()), 'min'); upd('D_hi_mid', float(Dv.upper()), 'max')
print('   %d boxes, %.1f s' % (len(edges) - 1, time.time() - t0))
print('   stats:', stats)
check('(1) on every box: 23/50 < delta_c < 12/25 and the second root of cr exceeds 5/6 (boxes failing: %d)' % bad, bad == 0)
check('    d_delta cr >= 194 at delta_c (enclosure lower bound %.4f)' % stats['dcrd'], stats['dcrd'] >= 194)
check('(2) lambda >= 1 (paper: >= 1.068); enclosure lower bound %.6f' % stats['lam'], stats['lam'] >= 1.068)
check('(3) d l*/d kappa < 0 on [7497/10000, 1]: upper bound %.6f (paper: <= -0.0031)' % stats['D_hi_right'], stats['D_hi_right'] <= -0.0031)
check('    -0.0065 <= d l*/d kappa <= -0.0031 on [7497/10000, 3/4]: [%.6f, %.6f]' % (stats['D_lo_mid'], stats['D_hi_mid']), stats['D_lo_mid'] >= -0.0065 and stats['D_hi_mid'] <= -0.0031)
check("    G' >= 0.498 on [13/18, 1]: lower bound %.6f" % stats['Gp'], stats['Gp'] >= 0.498)
check('    EXTRA (not in the paper): d l*/d kappa < 0 on all of [13/18, 1], i.e. F_flat increasing on the full M2 range: upper bound %.6f' % stats['D_all_hi'], stats['D_all_hi'] < 0)

print('== endpoints, fixed point, enclosures ==')
ctx.prec = 400
def Fflat(kv):
    dc, _ = delta_c(kv)
    return arb(fmpq(11, 12)) - ev(RF['lst'], dc, kv) / 4, dc
def G(kv):
    return (1 + kv) / 2 - Fflat(kv)[0]
g_lo = G(arb(fmpq(13, 18))); g_hi = G(arb(1))
check('G(13/18) = %s < 0 < G(1) = %s' % (g_lo.str(12), g_hi.str(12)), g_lo < 0 and g_hi > 0)
ka = F(749773294079928, 10**15); kb = F(749773294079929, 10**15)
ga = G(q2arb(ka)); gb = G(q2arb(kb))
check('G(0.749773294079928) = %s < 0 < G(0.749773294079929) = %s' % (ga.str(8), gb.str(8)), ga < 0 and gb > 0)
quart = 16686 * k**4 - 27405 * k**3 + 9936 * k**2 + 1290 * k - 275
target = sp.expand(lst_num - 4 * (R(11, 12) - (1 + k) / 2) * lst_den)
res = sp.factor(sp.resultant(sp.Poly(cr, dl), sp.Poly(target, dl)))
check('resultant_delta(cr, l* - 4(11/12-(1+kappa)/2)) contains the factor 16686k^4-27405k^3+9936k^2+1290k-275',
      sp.rem(sp.Poly(sp.expand(res), k), sp.Poly(quart, k)).is_zero)
print('   resultant factorisation:', res)
qp = sp.Poly(quart, k)
check('quartic: exactly one root in [7/10, 8/10] (%d) and two in [13/18, 1] (%d)' % (qp.count_roots(R(7, 10), R(8, 10)), qp.count_roots(R(13, 18), 1)),
      qp.count_roots(R(7, 10), R(8, 10)) == 1 and qp.count_roots(R(13, 18), 1) == 2)
qa = qp.eval(sp.Rational(ka.numerator, ka.denominator)); qb = qp.eval(sp.Rational(kb.numerator, kb.denominator))
check('quartic changes sign on [0.749773294079928, 0.749773294079929]', qa * qb < 0)
Bs = sp.symbols('B')
Bquart = 133488 * Bs**4 - 376596 * Bs**3 + 384534 * Bs**2 - 167541 * Bs + 26231
ratio = sp.cancel(sp.expand(quart.subs(k, 2 * Bs - 1)) / Bquart)
check('kappa = 2B-1 turns the kappa-quartic into (constant %s) x the B-quartic (14.1)' % ratio, ratio.is_number)
Ba = sp.Rational(874886647039964, 10**15); Bb = sp.Rational(874886647039965, 10**15)
Bp = sp.Poly(Bquart, Bs)
check('B-quartic changes sign on [0.874886647039964, 0.874886647039965] and has exactly one root there',
      Bp.eval(Ba) * Bp.eval(Bb) < 0 and Bp.count_roots(Ba, Bb) == 1)
# refine B_flat by exact bisection to 40 digits
loB, hiB = F(874886647039964, 10**15), F(874886647039965, 10**15)
sl = Bp.eval(sp.Rational(loB.numerator, loB.denominator))
for _ in range(110):
    m_ = (loB + hiB) / 2
    vm = Bp.eval(sp.Rational(m_.numerator, m_.denominator))
    if vm * sl > 0: loB = m_
    else: hiB = m_
print('   B_flat in [%s, %s]' % (sp.N(sp.Rational(loB.numerator, loB.denominator), 40), sp.N(sp.Rational(hiB.numerator, hiB.denominator), 40)))
kfl = q2arb(2 * (loB + hiB) / 2 - 1) + arb(0, float(hiB - loB) * 2)
Ff, dcf = Fflat(kfl)
check('F_flat(kappa_flat) encloses B_flat = (1+kappa_flat)/2: F_flat = %s, delta_c(kappa_flat) = %s' % (Ff.str(30), dcf.str(20)),
      (Ff - q2arb((loB + hiB) / 2)).contains(arb(0)) and abs(float(Ff.mid()) - float((loB + hiB) / 2)) < 1e-14)
F1318, dc1318 = Fflat(arb(fmpq(13, 18)))
check('F_flat(13/18) = %s (delta_c = %s); contains 0.874843412008...' % (F1318.str(30), dc1318.str(20)),
      F1318 > arb(fmpq(874843412008, 10**12)) and F1318 < arb(fmpq(874843412009, 10**12)))
for nm, kq, lq in (('kappa=3/4', F(3, 4), F(10027, 60000)), ('kappa=29991/40000', F(29991, 40000), F(1253399, 7500000))):
    Fv, dcv = Fflat(q2arb(kq)); lstar = (arb(fmpq(11, 12)) - Fv) * 4
    check('%s: F_flat = %s, l* = %s; Xu-Sang l_j = %.12f < l* (admissible triple below the tangent value); delta_c = %s'
          % (nm, Fv.str(20), lstar.str(20), float(lq), dcv.str(12)), q2arb(lq) < lstar)
F1, dc1 = Fflat(arb(1)); print('   F_flat(1) =', F1.str(20))
print()
print('TOTAL FAILS:', len(FAILS), FAILS)
sys.exit(1 if FAILS else 0)
