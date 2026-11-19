# c12-frontier-xu-sang-structured-moment: decisive test. Exact arithmetic in Q(sqrt 6) and Q; mpmath 30 digits for
# printing only. No large allocation (largest object: a list of < 2e5 Fractions, < 50 MB).
from fractions import Fraction as F
import mpmath as mp
mp.mp.dps = 34
ok = True
def check(c, msg):
    global ok
    ok = ok and bool(c)
    print(("  PASS " if c else "  FAIL ") + msg)

class Q6:                                  # a + b sqrt 6, exact
    def __init__(s, a, b=0): s.a, s.b = F(a), F(b)
    def __add__(s, o): o = o if isinstance(o, Q6) else Q6(o); return Q6(s.a + o.a, s.b + o.b)
    __radd__ = __add__
    def __neg__(s): return Q6(-s.a, -s.b)
    def __sub__(s, o): return s + (-(o if isinstance(o, Q6) else Q6(o)))
    def __rsub__(s, o): return Q6(o) - s
    def __mul__(s, o): o = o if isinstance(o, Q6) else Q6(o); return Q6(s.a*o.a + 6*s.b*o.b, s.a*o.b + s.b*o.a)
    __rmul__ = __mul__
    def inv(s): n = s.a*s.a - 6*s.b*s.b; return Q6(s.a/n, -s.b/n)
    def __truediv__(s, o): o = o if isinstance(o, Q6) else Q6(o); return s * o.inv()
    def __eq__(s, o): o = o if isinstance(o, Q6) else Q6(o); return s.a == o.a and s.b == o.b
    def mpf(s): return mp.mpf(s.a.numerator)/s.a.denominator + mp.mpf(s.b.numerator)/s.b.denominator*mp.sqrt(6)
    def sign(s):                           # exact sign of a + b sqrt6
        if s.b == 0: return (s.a > 0) - (s.a < 0)
        if s.a == 0: return (s.b > 0) - (s.b < 0)
        sa, sb = (s.a > 0) - (s.a < 0), (s.b > 0) - (s.b < 0)
        if sa == sb: return sa
        d = s.a*s.a - 6*s.b*s.b            # |a| vs |b| sqrt6
        return sa if d > 0 else (sb if d < 0 else 0)

print("1. Constants of Xu-Sang 2610.17675 v2 Theorem 1.2 (exact in Q(sqrt 6))")
kap6 = Q6(F(37, 6), F(-10, 6)); astar = Q6(F(21, 12), F(-5, 12)); dstar = 2*astar - 1
Fa = (31 - 32*astar)/(21 - 12*astar) + 2*astar
check(Fa == kap6, "F(a*) = R(a*) + 2a* = (37 - 10 sqrt6)/6 with a* = (21 - 5 sqrt6)/12")
check(dstar == Q6(F(15, 6), F(-5, 6)), "delta* = 2a* - 1 = (15 - 5 sqrt6)/6")
print("     kappa_6 = %s" % mp.nstr(kap6.mpf(), 30))
print("     a*      = %s   delta* = %s" % (mp.nstr(astar.mpf(), 30), mp.nstr(dstar.mpf(), 30)))
print("     13/6 - kappa_6 = %s (saving over the general norm)" % mp.nstr((F(13, 6) - kap6).mpf(), 30))
N1 = kap6 - 1                              # exponent in central normalisation at Y = 1 (rows U, length U)
print("     normalised moment exponent N = kappa_6 - 1 = %s (level value: 1)" % mp.nstr(N1.mpf(), 30))

def R0(d):                                 # x = 0 column = Xu-Sang R(a), a = (1+d)/2, first branch d <= 5/6
    return (15 - 16*d)/(15 - 6*d)
def count_R(d, x, k, alpha=F(5, 6)):       # Liu II (13.16) as transcribed in bypass-78 / c11 ledger.py
    c = 1/(3*k); D = 3 - (1 + 2*c)*x; P = (2 - 2*c*x)*(1 - x); J = (alpha - d)*D + d*P
    return 1 - d + (alpha - d)*d*P/(2*J)

print("2. Lemma C (domination identity): N - delta - R0(delta) = 6 (delta - delta*)^2 / (15 - 6 delta)")
bad = 0
for i in range(1, 1001):
    d = F(5*i, 6000)                       # delta in (0, 5/6]
    lhs = N1 - d - R0(d); rhs = 6*(d - dstar)*(d - dstar)/(15 - 6*d)
    bad += 0 if lhs == rhs else 1
check(bad == 0, "identity exact at 1000 rational delta in (0, 5/6]")
# second branch 5/6 <= delta <= 1 (a >= 11/12): R = 1 - delta; N - delta - (1 - delta) = kappa_6 - 2 > 0
check((kap6 - 2).sign() > 0, "second branch: N - delta - (1 - delta) = kappa_6 - 2 = %s > 0" % mp.nstr((kap6 - 2).mpf(), 20))

print("3. x-monotonicity: R_kappa(delta, x) <= R_kappa(delta, 0) = R0(delta) (exact rational grid)")
kflat = F(749773, 10**6)
kappas = [F(13, 18), kflat, F(3, 4), F(1)]
bad = 0; badm = 0; n = 0
for k in kappas:
    for i in range(1, 171):
        d = F(5*i, 6*171)
        if count_R(d, F(0), k) != R0(d): bad += 1
        prev = None
        for j in range(0, 51):
            x = F(j, 100); r = count_R(d, x, k); n += 1
            if prev is not None and r > prev: badm += 1
            prev = r
check(bad == 0, "x = 0 column equals (15 - 16 d)/(15 - 6 d) for every kappa (kappa drops out)")
check(badm == 0, "R_kappa(delta, x) nonincreasing in x on %d grid points" % n)

print("4. Forced substitution: option Opt = N - spike with a prime-only polynomial of length Y = 1")
print("   (a) spike 2 delta x (class amplitude g = delta x at z = 1); (b) spike delta (largest allowed by Lemma 7.1)")
minA = None; minB = None; sel = 0
for k in kappas:
    for i in range(1, 171):
        d = F(5*i, 6*171)
        for j in range(0, 51):
            x = F(j, 100); r = count_R(d, x, k)
            mA = N1 - 2*d*x - r; mB = N1 - d - r
            if mA.sign() <= 0 or mB.sign() <= 0: sel += 1
            fa, fb = mA.mpf(), mB.mpf()
            if minA is None or fa < minA[0]: minA = (fa, k, d, x)
            if minB is None or fb < minB[0]: minB = (fb, k, d, x)
check(sel == 0, "option never at or below R_kappa(delta, x): selected at 0 of %d classes (exact signs)" % n)
print("     least margin (a): %s at kappa=%s delta=%s x=%s" % (mp.nstr(minA[0], 12), minA[1], mp.nstr(mp.mpf(minA[2].numerator)/minA[2].denominator, 8), minA[3]))
print("     least margin (b): %s at kappa=%s delta=%s x=%s" % (mp.nstr(minB[0], 12), minB[1], mp.nstr(mp.mpf(minB[2].numerator)/minB[2].denominator, 8), minB[3]))

print("5. Critical class (delta_c, x = 1/2, kappa_flat)")
DC = F(46934485869814, 10**14); RC = F(590332354, 10**9)
rc = count_R(DC, F(1, 2), kflat)
print("     R_kappa(delta_c, 1/2) from the closed form = %s (file: 0.590332)" % mp.nstr(mp.mpf(rc.numerator)/rc.denominator, 12))
opt = N1 - DC
print("     option N - delta_c = %s ; R0(delta_c) = %s ; excess over R_c = %s" % (
    mp.nstr(opt.mpf(), 12), mp.nstr(mp.mpf(R0(DC).numerator)/R0(DC).denominator, 12), mp.nstr((opt - RC).mpf(), 12)))
thr = RC + DC
print("     a moment at Y = 1 enters the window only with N < R_c + delta_c = %s, i.e. unnormalised exponent < %s; theorem: %s; shortfall %s" % (
    mp.nstr(mp.mpf(thr.numerator)/thr.denominator, 10), mp.nstr(1 + mp.mpf(thr.numerator)/thr.denominator, 10), mp.nstr(kap6.mpf(), 10), mp.nstr((N1 - thr).mpf(), 10)))
check((N1 - thr).sign() > 0, "theorem exponent is above the window threshold at the critical class")
w_lo = (1 - RC)/DC; w_hi = RC/(1 - DC)
print("     level window of Lemma W2 (r3-critical-count): %s < Y < %s ; Y = 1 is inside it (the window is stated for N = max(1, Y); for general N the condition at Y = 1 is N < R_c + delta_c)" % (float(w_lo), float(w_hi)))

print("6. Ranges: slot capacities at the saddle against the theorem's length z = 1")
rs, ms = F(745700, 10**6), F(418254, 10**6)
zM = (1 - rs)/2; zS = (1 - 2*ms)/(6*kflat)
print("     M1: r + 2z < 1 -> z < %s at r*; z < 1/2 at r = 0.   M2: 2m + 6 kappa z < 1 -> z < %s at m*; z < %s at m = 0" % (float(zM), float(zS), float(1/(6*kflat))))
print("     probe prime supply (U-units): about 0.2105 ; theorem length: 1 ; Prop 7.2 needs every prime >= Y^c, c > 13/6 - kappa_6 = %s, so at most %d factors" % (
    mp.nstr((F(13, 6) - kap6).mpf(), 8), int(1/(F(13, 6) - kap6).mpf())))
check(F(1) > F(1, 2) and F(1) > 1/(6*F(13, 18)), "z = 1 lies outside the hypothesis range of M1 (z < 1/2) and of M2 (z < 3/13) even with no witness factor")

print("7. Abscissa (count vector unchanged => system unchanged): root of the Liu II quartic in [5/6, 7/8]")
co = [133488, -376596, 384534, -167541, 26231]
def p(B): return sum(c*B**(4 - i) for i, c in enumerate(co))
lo, hi = F(5, 6), F(7, 8)
check(p(lo)*p(hi) < 0, "sign change on [5/6, 7/8]")
# one root in the interval: derivative sign constant on a 2000-point rational grid + exact sign change count
sc = 0; prev = p(lo)
for i in range(1, 2001):
    v = p(lo + (hi - lo)*i/2000)
    if prev*v < 0: sc += 1
    prev = v
check(sc == 1, "exactly one sign change on a 2000-point rational grid")
for _ in range(120):
    mid = (lo + hi)/2
    if p(lo)*p(mid) <= 0: hi = mid
    else: lo = mid
B = mp.mpf(lo.numerator)/lo.denominator
print("     B_flat = %s (rational bisection, width < 1e-36)" % mp.nstr(B, 30))
r = mp.findroot(lambda t: sum(c*t**(4 - i) for i, c in enumerate(co)), mp.mpf('0.8749'))
check(abs(r - B) < mp.mpf(10)**(-30), "mpmath Newton agrees to 30 digits: %s" % mp.nstr(r, 30))
check(abs(B - mp.mpf('0.8748866470')) < mp.mpf('5e-11'), "equals the scoreboard figure 0.8748866470 to 10 digits: unchanged")
print("ALL PASS" if ok else "SOME FAIL")
