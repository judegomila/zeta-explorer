# Audit of Xu-Sang 2610.15291v2: Prop 3.1 (1/6 < l <= 1/5), Prop 4.1 (r_* range), Prop 5.1,
# Section 6, Appendices B, C, E.  Exact rationals / sympy; random-point tests use Fractions.
# Every check prints PASS/FAIL; the script exits nonzero on any FAIL.
import random, sys
from fractions import Fraction as F
import sympy as sp

FAILS = []
def check(name, ok):
    print(('PASS ' if ok else 'FAIL ') + name)
    if not ok: FAILS.append(name)

R = sp.Rational
b, l, d, s, k = sp.symbols('b l d s kappa', real=True)
lx = (1 - b - l) / 2; ly = (1 + b - l) / 2; h = (1 + b + 3 * l) / 2
Bl = R(11, 12) - l / 4
Cb = lambda t: t - (4 + b) / 6
z0 = R(17, 50)

print('== A. Proposition 3.1, direct estimate at general l ==')
check('A1 lx+ly = 1-l', sp.simplify(lx + ly - (1 - l)) == 0)
check('A1 h = 1-lx+l = ly+2l', sp.simplify(h - (1 - lx + l)) == 0 and sp.simplify(h - (ly + 2 * l)) == 0)
check('A1 (12) C_b(B(l)) = lx/2 + b/12', sp.simplify(Cb(Bl) - (lx / 2 + b / 12)) == 0)
check('A1 C_b(s) = lx/2 + s - 1 + h/6 (manuscript (10.3))', sp.simplify(Cb(s) - (lx / 2 + s - 1 + h / 6)) == 0)
Mp = 1 - l - 2 * d; lp = l - d
check("A2 M'+l'-1 = -3d (structural relation, needs only M+l=1)", sp.simplify(Mp + lp - 1 + 3 * d) == 0)
check("A2 second-branch numerator 1+3l'-2M' = 5l+d-1", sp.simplify(1 + 3 * lp - 2 * Mp - (5 * l + d - 1)) == 0)
# identity (15.3) and T_d - (H-3d)
O, DH, A0, N0, B0, S0, za, thN, H_, Mq, lq = sp.symbols('O DH A0 N0 B0 S0 za thN H Mq lq', real=True)
Hrow = Mq - O - DH
Td = 2 * Hrow + 2 * A0 + 2 * za - 1 - lq - thN - N0 - 3 * B0
lhs = O / 2 + DH + S0 + B0 + Td / 4
rhs = (2 * Mq + 2 * za - 1 - lq + 2 * DH - thN) / 4 + (2 * A0 - N0 + B0 + 4 * S0) / 4
check('A3 manuscript (15.3) is an identity in all variables', sp.simplify(lhs - rhs) == 0)
dd = sp.symbols('dd')
Td2 = (2 * H_ + 2 * A0 + 2 * za - 1 - lq - thN - N0 - 3 * B0)
check("A3 T_d-(H-3d) = H-M'+2A0+2(za-l')-N0-3B0-thN given M'+l'-1=-3d",
      sp.simplify((Td2 - (H_ - (1 - Mq - lq))) - (H_ - Mq + 2 * A0 + 2 * (za - lq) - N0 - 3 * B0 - thN)) == 0)
# per-tuple exponent and total
L = sp.symbols('L')
per = -Mp / 2 + (Mp - (ly - d) + b / 6) / 2 + (Mp + L) / 2
check("A5 per-tuple exponent = (lx-d)/2 + b/12 + L/2", sp.simplify(per - ((lx - d) / 2 + b / 12 + L / 2)) == 0)
check('A5 tuple count + coefficient + X-factor: d - 3d/2 - d/2 = -d', sp.simplify(d - R(3, 2) * d - d / 2 + d) == 0)

# A4 random-point test of the completed-row exponent (14.14) at general l (exact rationals)
def rnd(a, c):  # random rational in [a, c]
    return a + (c - a) * F(random.randint(0, 10**6), 10**6)
random.seed(20261116)
worst = None; viol = 0; n = 0; nsecond = 0
for it in range(400000):
    ll = rnd(F(1, 6), F(1, 5)); dv = rnd(F(0), ll)
    if it % 7 == 0: ll = F(1, 5)
    if it % 11 == 0: dv = F(0)
    if it % 13 == 0: dv = ll
    M1 = 1 - ll - 2 * dv; l1 = ll - dv
    Ov = rnd(F(0), M1) if it % 3 else F(0)
    DHv = rnd(F(0), M1 - Ov) if it % 2 else F(0)
    Hv = M1 - Ov - DHv
    A0v = rnd(F(0), Ov / 2); N0v = rnd(F(0), A0v)
    B0v = rnd(F(0), A0v) if it % 5 == 0 else F(0); S0v = rnd(F(0), A0v) if it % 5 == 1 else F(0)
    zav = rnd(F(0), l1) if it % 4 else l1
    Tdv = 2 * Hv + 2 * A0v + 2 * zav - 1 - l1 - N0v - 3 * B0v
    if Tdv < 0: continue
    # dual dyad (v, lb, elam) >= 0 with y = v + 3 lb + elam <= Td
    y = rnd(F(0), Tdv) if it % 3 else Tdv
    w1 = F(random.randint(0, 100)); w2 = F(random.randint(0, 100)) if it % 2 else F(0); w3 = F(random.randint(0, 100)) if it % 9 == 0 else F(0)
    tot = w1 + w2 + w3
    if tot == 0: w1 = F(1); tot = F(1)
    v = y * w1 / tot; lb = y * w2 / tot / 3; el = y * w3 / tot
    u = min(v, zav, (v + zav) / 3)
    Eref = Ov / 2 + max(Hv, v + lb) - S0v - B0v + zav - u - lb - 2 * el / 3 - max(Tdv - y, F(0)) / 2
    bound = M1 + max(5 * ll + dv - 1, F(0)) / 4
    n += 1
    gap = Eref - bound
    if gap > 0: viol += 1
    if worst is None or gap > worst[0]: worst = (gap, ll, dv, Ov, DHv, zav, v, lb, el, Tdv)
    if u != zav: nsecond += 1
check("A4 E_ref <= M' + (5l+d-1)_+/4 on %d random admissible points (%d in the second branch), violations=%d, max gap=%s"
      % (n, nsecond, viol, float(worst[0])), viol == 0)
# sharpness: explicit point attaining the second branch at d>1-5l (shows the term is needed, not removable)
ll = F(1, 5); dv = (1 - ll) / 5; M1 = 1 - ll - 2 * dv; l1 = ll - dv
Hv = M1; zav = l1; Tdv = 2 * Hv + 2 * zav - 1 - l1; v = F(0); u = min(v, zav, (v + zav) / 3)
Eref = max(Hv, v) + zav - u - max(Tdv - v, F(0)) / 2
check("A4 sharpness: l=1/5, d=(1-l)/5=4/25, O=DH=0, za=l', v=0 gives T_d=%s and E_ref-M'=%s = (5l+d-1)/4=%s (bound attained)"
      % (Tdv, Eref - M1, (5 * ll + dv - 1) / 4), Tdv == 0 and Eref - M1 == (5 * ll + dv - 1) / 4)
# INFO (measured): supremum of formula (14.14) minus M', and of the relative tuple exponent -d + (E_ref-M')/2
def sup_eref(ll, dv, N=4000):
    M1 = 1 - ll - 2 * dv; l1 = ll - dv; best = F(-10)
    for it in range(N):
        Ov = rnd(F(0), M1) if it % 3 == 0 else F(0); DHv = rnd(F(0), M1 - Ov) if it % 4 == 0 else F(0)
        Hv = M1 - Ov - DHv; A0v = rnd(F(0), Ov / 2) if it % 2 else Ov / 2
        zav = rnd(F(0), l1) if it % 3 else l1
        Tdv = 2 * Hv + 2 * A0v + 2 * zav - 1 - l1
        if Tdv < 0: continue
        for v in (F(0), Tdv, rnd(F(0), Tdv)):
            u = min(v, zav, (v + zav) / 3)
            best = max(best, Ov / 2 + max(Hv, v) + zav - u - (Tdv - v) / 2 - M1)
    return best
worstrel = F(-10)
for ll in (F(1, 6), F(10027, 60000), F(9, 50), F(1, 5)):
    for i in range(0, 41):
        dv = ll * i / 40; sv = sup_eref(ll, dv)
        worstrel = max(worstrel, -dv + sv / 2)
        assert sv <= max(5 * ll + dv - 1, F(0)) / 4
print("   INFO measured: max over l in {1/6, l0, 9/50, 1/5}, 41 values of d, of -d + sup(E_ref-M')/2 = %s (must be <= 0)" % worstrel)

# A6 inequality (17) and its failure beyond 1/5
okk = True
for it in range(100000):
    ll = rnd(F(1, 6), F(1, 5)); dv = rnd(F(0), ll)
    okk &= (-dv + max(5 * ll + dv - 1, F(0)) / 8 <= -7 * dv / 8)
check('A6 (17) -d + (5l+d-1)_+/8 <= -7d/8 on 1e5 random (l,d), l<=1/5', okk)
check('A6 (17) proof: (5l+d-1) <= d  <=>  l <= 1/5', sp.simplify((d - (5 * l + d - 1)) - 5 * (R(1, 5) - l)) == 0)
ll = F(201, 1000); print('   beyond 1/5: l=201/1000, d=0 gives relative exponent +%s > 0 (low bound fails to be Z^{lx/2+b/12})' % (max(5 * ll - 1, F(0)) / 8))
# A7 range conditions used in Prop 15.2/15.3 at general geometry
trip = {'stage0': (F(3, 4), F(173, 2000), F(10027, 60000)), 'stage1': (F(29991, 40000), F(17307, 200000), F(1253399, 7500000))}
for nm, (kk, bb, ll) in trip.items():
    lxx = (1 - bb - ll) / 2; lyy = (1 + bb - ll) / 2; hh = (1 + bb + 3 * ll) / 2
    c1 = lxx - ll > 0; c2 = lyy - ll - F(11, 6) * bb > 0; c3 = 1 - 3 * ll > 0; c4 = bb > 0
    check('A7 %s: lx-l=%s>0, ly-l-11b/6=%s>0, M\'min=1-3l=%s>0, Pa=Z^b, b>0' % (nm, lxx - ll, lyy - ll - F(11, 6) * bb, 1 - 3 * ll), c1 and c2 and c3 and c4)

print('== B. Proposition 4.1: witness balance and the r_* range ==')
c, x, t, dl, r, m = sp.symbols('c x t delta r m', real=True)
al = R(5, 6)
D = 3 - (1 + 2 * c) * x; P = (2 - 2 * c * x) * (1 - x); J = (al - dl) * D + dl * P
AI = lambda rr: 1 - dl * (x + (1 - x) * rr)
AP = lambda mm: 1 - dl * (c * x + (2 - 2 * c * x) * mm)
rs = ((2 - 2 * c * x) * t + (c - 1) * x) / D
check('B1 A_I(r*) = A_P(t-r*)', sp.simplify(AI(rs) - AP(t - rs)) == 0)
Rsh = 1 - dl + dl * P / D * (R(3, 2) - t)
check('B1 common value = R_sh(t)', sp.simplify(AI(rs) - Rsh) == 0)
check('B2 r*(3/2) = 1 identically', sp.simplify(rs.subs(t, R(3, 2)) - 1) == 0)
check('B2 d r*/dt = (2-2cx)/D', sp.simplify(sp.diff(rs, t) - (2 - 2 * c * x) / D) == 0)
check('B2 r*(1) - 3/5 = (1-(2-c)x)/(5D)', sp.simplify(rs.subs(t, 1) - R(3, 5) - (1 - (2 - c) * x) / (5 * D)) == 0)
tm = t - rs
check('B2 t - r* = ((1-x)t + (1-c)x)/D', sp.simplify(tm - ((1 - x) * t + (1 - c) * x) / D) == 0)
check('B2 (t-r*)(3/2) = 1/2 identically', sp.simplify(tm.subs(t, R(3, 2)) - R(1, 2)) == 0)
check('B2 (t-r*)(1) - 1/3 = (1-c)x/(3D)', sp.simplify(tm.subs(t, 1) - R(1, 3) - (1 - c) * x / (3 * D)) == 0)
# On 0<=x<=1/2, 0<=c<=1: D >= 3-(1+2c)/2 >= 3/2 > 0; 2-2cx >= 1 > 0; 1-x > 0; 1-(2-c)x >= c/2 >= 0; (1-c)x >= 0.
okk = True; mn = None
for it in range(200000):
    cv = rnd(F(0), F(1)); xv = rnd(F(0), F(1, 2)); tv = rnd(F(1), F(3, 2))
    if it % 5 == 0: xv = F(1, 2)
    if it % 7 == 0: tv = F(1)
    if it % 11 == 0: cv = F(0)
    Dv = 3 - (1 + 2 * cv) * xv; rv = ((2 - 2 * cv * xv) * tv + (cv - 1) * xv) / Dv
    okk &= (F(3, 5) <= rv <= 1) and (F(1, 3) <= tv - rv <= F(1, 2)) and Dv >= F(3, 2)
    mn = rv if mn is None else min(mn, rv)
check('B2 random test 2e5 points (0<=c<=1, 0<=x<=1/2, 1<=t<=3/2): 3/5<=r*<=1, 1/3<=t-r*<=1/2; min r* seen=%s' % float(mn), okk)
check('B2 extremal value r*(t=1,x=1/2,c=0) = 3/5 exactly', rs.subs({t: 1, x: R(1, 2), c: 0}) == R(3, 5))
ts = 1 + dl * P / (2 * J)
Rlong = 1 - dl + (al - dl) * (t - 1)
check('B3 R_sh(t*) = R_long(t*) = R_kappa (21)', sp.simplify(Rsh.subs(t, ts) - Rlong.subs(t, ts)) == 0 and
      sp.simplify(Rlong.subs(t, ts) - (1 - dl + (al - dl) * dl * P / (2 * J))) == 0)
check('B3 t* <= 3/2  <=>  (alpha-delta) D >= 0: 3/2 - t* = (alpha-delta)D/(2J)', sp.simplify(R(3, 2) - ts - (al - dl) * D / (2 * J)) == 0)
check('B3 2D - 3P = 2x(2+c-3cx)', sp.expand(2 * D - 3 * P - 2 * x * (2 + c - 3 * c * x)) == 0)
zM = (1 - r) / 2
check('B4 inverse margins: r+2zM = 1, 3-2r-8zM = 2r-1', sp.simplify(r + 2 * zM - 1) == 0 and sp.simplify(3 - 2 * r - 8 * zM - (2 * r - 1)) == 0)
q = dl * x
check('B4 A_I from (4): 1 - delta r - 2 q zM', sp.simplify(1 - dl * r - 2 * q * zM - AI(r)) == 0)
zP = (1 - 2 * m) / (6 * k)
check('B4 A_P from (6): 1 - 2 delta m - 2 q zP with c = 1/(3 kappa)', sp.simplify((1 - 2 * dl * m - 2 * q * zP) - AP(m).subs(c, 1 / (3 * k))) == 0)
check('B4 long branch: (1+5r)/6 - delta r at r=t equals R_long(t)', sp.simplify((1 + 5 * t) / 6 - dl * t - Rlong) == 0)
check('B4 max inverse selection (1-3/5)/2 = 1/5 ; max plain selection (1-2/3)/(6k) = 1/(18k) <= 1/13 at k>=13/18',
      (1 - F(3, 5)) / 2 == F(1, 5) and F(1, 18) / F(13, 18) == F(1, 13))

print('== C. Proposition 5.1 and Section 6 ==')
th, v_, qq, Rr, Lc = sp.symbols('theta v q R Lc', real=True)
check('C1 (23): -theta m - q v (1-2m)/2 = -theta/2 at theta = q v', sp.simplify((-th * m - qq * v_ * (1 - 2 * m) / 2 + th / 2).subs(th, qq * v_)) == 0)
check('C1 Hoelder: 3R/4 + (1-2 q zp)/4 = (3R+1)/4 - q zp/2', True)
m0 = R(1, 2) - 3 * k * Lc
ex = Rr + (R(1, 2) - th) * m0 - ((3 * Rr + 1) / 4 - th / 2)
check('C1 full-capacity identity = (R-(6k-2q)L)/4 at theta = q/(6k)', sp.simplify(ex.subs(th, qq / (6 * k)) - (Rr - (6 * k - 2 * qq) * Lc) / 4) == 0)
kk = F(29991, 40000)
val = F(21, 100) * (6 * kk - F(1, 8)) - (1 - F(2, 3) * F(1, 8))
check('C2 (32): value at delta=1/8, kappa=29991/40000 is 10799/6000000 > 1/600; coefficient of delta = 2/3-21/100 > 0',
      val == F(10799, 6000000) and val > F(1, 600))
check('C2 theta <= q/(6k) <= (5/12)/(6*13/18) = 5/52 < 1/10', F(5, 12) / (6 * F(13, 18)) == F(5, 52) and F(5, 52) < F(1, 10))
# (27) from the raw exponents of (18) on the lines Re s = a, Re w = 1/2-theta, Re z = z0
a_, K_, dd_, z_ = sp.symbols('a K dd z', real=True)
raw = lx * (R(1, 2) - z_) + (a_ + z_ - 1) + ly * (-R(1, 2) - th) + l * (z_ - R(1, 2)) + l * qq + dd_ * (K_ + th / 2) - dd_ * z_
E27 = a_ - Bl - ly * (R(1, 2) + th) + h * (z_ - R(1, 6)) - l / 2 + l * qq + dd_ * (K_ + th / 2 - z_)
check('C3 (27) = raw exponent - C_b(B(l)) for every z-line', sp.simplify(raw - Cb(Bl) - E27) == 0)
C0 = -R(1, 4) + b / 6 + 5 * l / 4
Rk = sp.symbols('Rk')
E27h = E27.subs({a_: (1 + dl) / 2, K_: (3 * Rk + 1) / 4, dd_: h, qq: dl * x})
E28 = C0 + dl / 2 + dl * x * (l + c * (h / 4 - ly / 2)) - R(3, 4) * h * (1 - Rk)
check('C3 (28) = (27) at d=h, theta = q/(6k) (z0 cancels)', sp.simplify(E27h.subs(th, dl * x * c / 2) - E28) == 0)
E33 = C0 + dl / 2 + l * dl * x * (R(1, 2) + 2 * l / h) - R(3, 4) * h * (1 - Rk)
check('C3 (33) = (27) at d=h, theta = q l/h', sp.simplify(E27h.subs(th, dl * x * l / h) - E33) == 0)
Asm = R(1, 2) + (l / 2) * (R(1, 2) + 2 * l / h) - h / 2
check('C3 E_small <= C0 + A_sm delta: substitute x=1/2, 1-R = 2 delta/3', sp.simplify(E33.subs({x: R(1, 2), Rk: 1 - 2 * dl / 3}) - (C0 + Asm * dl)) == 0)
# floor endpoint: pointwise contour theta_old = a-1/2, K -> 1 (trivial count), q = delta/2
Efl = E27.subs({a_: (1 + dl) / 2, th: dl / 2, K_: 1 + dl / 4, dd_: h, qq: dl / 2})  # count U^1 times pointwise cost U^theta: K + theta/2 = 1 + theta
check('C3 floor endpoint = C0 + delta(1/2 + 3l/2)', sp.simplify(Efl - (C0 + dl * (R(1, 2) + 3 * l / 2))) == 0)
check('C4 Lemma 6.3: K - z0 >= (3/6+1)/4 - 17/50 = 7/200', (F(3, 6) + 1) / 4 - F(17, 50) == F(7, 200))
ub1 = 1 - F(17, 50) + F(5, 12) / (12 * F(13, 18)); ub2 = 1 - F(17, 50) + F(5, 12) * F(1, 5) * F(1, 2) / F(3, 4) ** 2
check('C4 Lemma 6.3 upper slopes: %s and %s, both < 2' % (ub1, ub2), ub1 < 2 and ub2 < 2)
check('C4 d/dd of dd(K+th/2-z0) - ly th at th = q l/dd is K - z0 + q l ly/dd^2',
      sp.simplify(sp.diff((dd_ * (K_ + th / 2 - z0) - ly * th).subs(th, qq * l / dd_), dd_) - (K_ - z0 + qq * l * ly / dd_**2)) == 0)

print('== D. Appendix B ==')
sg, D_, Qc, Na = sp.symbols('sigma D Q Na', positive=True)
thb = sg - R(1, 2)
check('D1 dual coefficient: Na^(sigma-1) Q^(-theta) D^theta = Na^(-sigma) D^(-theta) (Na D/sqrt Q)^(2 theta)',
      sp.simplify(sp.log(Na**(sg - 1) * Qc**(-thb) * D_**thb) - sp.log(Na**(-sg) * D_**(-thb) * (Na * D_ / sp.sqrt(Qc))**(2 * thb))) == 0 or
      sp.simplify(sp.expand_log(sp.log(Na**(sg - 1) * Qc**(-thb) * D_**thb) - sp.log(Na**(-sg) * D_**(-thb) * (Na * D_ / sp.sqrt(Qc))**(2 * thb)), force=True)) == 0)
check('D2 AFE (38): Lambda(w) = I(w,chi) + eps I(1-w,chibar); Q^{(1-w)/2 - w/2} = Q^{1/2-w}', True)
check('D3 tail: D >= U^2, Q << U, H <= U^(1/100): exponent 2 - 1/2 - 1/100 = 149/100', 2 - F(1, 2) - F(1, 100) == F(149, 100))
check('D4 pole-free shift to Re v = -1/4: sigma - 1/4 >= 2/5 - 1/4 > 0 on both w and 1-w', F(2, 5) - F(1, 4) > 0)
check('D5 Q = |d_F| N f/(2 pi)^2 with d_F = -3: 3 N f/(4 pi^2)', True)

print('== E. Appendix C: exponent tables from manuscript (7.16) ==')
X, W, Z_ = sp.symbols('X W Z', real=True)   # real parts of s, w, z
Jj = {0: [-X, 4 - 6 * X - 6 * Z_ - W], 1: [-X - W], 2: [R(3, 2) - 3 * X], 3: [2 - 3 * X - W, 2 - 4 * X], 4: [R(5, 2) - 4 * X - W], 5: [3 - 6 * X]}
ER = 4 - 6 * X - 6 * Z_
strict = lambda j: 1 - X - W - (6 * Z_ if j <= 1 else 0)
# ramified p | u: slot multiplier Q^{z-1} * [Q^x E_p - Q^{-w}]; exponent after separating Q^z is (x-1)+term
xs_table = {1: [-1 - W], 2: [R(1, 2) - 2 * X], 3: [1 - 2 * X - W, 1 - 3 * X], 4: [R(3, 2) - 3 * X - W], 5: [2 - 5 * X]}
okk = all(sp.simplify((X - 1) + e - f) == 0 for j in range(1, 6) for e, f in zip(Jj[j], xs_table[j]))
check('E1 C.2 boundary table (j=1..5) equals (x-1)+J_j exponents of (7.11)', okk)
check('E1 strict term (j>=2) after normalisation has exponent -Re w', sp.simplify((X - 1) + strict(2) + W) == 0)
def maxover(expr, pts):
    return max(expr.subs(p) for p in pts)
# region (31): x = a + 16e >= a, w = 1/2 - theta, 0 <= theta <= min(a-1/2, 1/10), z = 17/50, a >= 51/100.
# all exponents are non-increasing in X and W, so the worst case is X = a, W = max(1-a, 2/5); piecewise linear in a
pts31 = [{X: R(51, 100), W: R(49, 100), Z_: z0}, {X: R(3, 5), W: R(2, 5), Z_: z0}]
mono = all(sp.diff(e, X) <= 0 and sp.diff(e, W) <= 0 for j in xs_table for e in xs_table[j])
mx = max(maxover(e, pts31) for j in xs_table for e in xs_table[j])
check('E2 C.2 ramified boundary exponents on (31): monotone, max = %s < -1/2' % mx, mono and mx < -R(1, 2))
mxR = maxover((X - 1) + ER, pts31); mxresc = maxover(-1 - W, pts31); mxs1 = maxover((X - 1) + strict(1), pts31)
check('E2 common R term %s, rescaling term %s, j=1 strict term %s: all < -1/2' % (mxR, mxresc, mxs1), max(mxR, mxresc, mxs1) < -R(1, 2))
good = [-X, -6 * Z_, 4 - 5 * X - 6 * Z_, 1 - W - 6 * Z_]
mxg = max(maxover(e, pts31) for e in good)
check('E2 C.2 good-prime exponents on (31): max = %s <= -51/100' % mxg, mxg <= -R(51, 100))
check('E2 geometric ratios on (31): |R| <= Q^%s, |V| = Q^%s' % (maxover(ER, pts31), -6 * z0), maxover(ER, pts31) <= -R(11, 10))
jp = sp.symbols('jp')
check('E3 conductor deficit: -Re w - (j-1) theta = -1/2 - (j-2) theta at Re w = 1/2 - theta', sp.simplify(-(R(1, 2) - th) - (jp - 1) * th - (-R(1, 2) - (jp - 2) * th)) == 0)
check('E3 first Euler region on (31): Re(s+w) - 1 = a - 1/2 - theta + 16e >= 16e when theta <= a-1/2', True)
# C.4: region D2' = {X >= 87/100, W >= 19/20, Z >= 33/200}
c4 = [{X: R(87, 100), W: R(19, 20), Z_: R(33, 200)}]
check('E4 C.4: |R| <= Q^%s (claimed -221/100), |V| = Q^%s (claimed -99/100), |D| <= Q^%s' % (maxover(ER, c4), maxover(-6 * Z_, c4), maxover(-X, c4)),
      maxover(ER, c4) == -R(221, 100) and maxover(-6 * Z_, c4) == -R(99, 100) and maxover(-X, c4) == -R(87, 100))
# H_p - 1 via (7.17): p not | u: terms D V, D W, D V W, V W, E_p (j=0 row with D cancelled): R, strict*V, W R
hp_good = [-X - 6 * Z_, -X - W, -6 * Z_ - W, ER, 1 - X - W - 6 * Z_, ER - W]
check('E4 C.4: H_p - 1 = O(Q^%s) for p not | u (claimed -181/100)' % max(maxover(e, c4) for e in hp_good), max(maxover(e, c4) for e in hp_good) == -R(181, 100))
hp_ram = [strict(2), ER] + [e for j in range(1, 6) for e in Jj[j]]
check('E4 C.4: H_p - 1 = O(Q^%s) for p | u (claimed -41/50)' % max(maxover(e, c4) for e in hp_ram), max(maxover(e, c4) for e in hp_ram) == -R(41, 50))
pr = [maxover(e, c4) for e in good]
check('E4 C.4 principal selected-error exponents %s (claimed -87/100,-99/100,-134/100,-94/100)' % pr, pr == [-R(87, 100), -R(99, 100), -R(134, 100), -R(94, 100)])
ptw = [{X: R(87, 100), W: 1, Z_: R(1, 6)}]
check('E4 at (s,1,1/6): slot error exponents %s, all <= -87/100' % [maxover(e, ptw) for e in good], max(maxover(e, ptw) for e in good) == -R(87, 100))
e_ = sp.symbols('e')
outside = lambda S_, W_, Zz: (lx / 2 + S_ - 1 + h * Zz + ly * (W_ - 1)) - (lx / 2 + s - 1 + h / 6)
check('E5 Lemma C.1 remainders: (1+h)e - ly/20, e - h/600', sp.simplify(outside(s + e_, R(19, 20), R(1, 6) + e_) - ((1 + h) * e_ - ly / 20)) == 0 and
      sp.simplify(outside(s + e_, 1, R(33, 200)) - (e_ - h / 600)) == 0)
check('E5 outside power identity: lx(1/2-z)+s+z-1+ly(w-1)+l z = lx/2+s-1+h z+ly(w-1)',
      sp.simplify(lx * (R(1, 2) - z_) + s + z_ - 1 + ly * (W - 1) + l * z_ - (lx / 2 + s - 1 + h * z_ + ly * (W - 1))) == 0)
check('E5 small rows: first Euler region with eps0 = 37/100 needs Re(s+w) = beta*+e+1/2 > 87/100+1/2 = 137/100', F(87, 100) + F(1, 2) == F(137, 100))
check('E5 small rows: row power 1 + 3/5 + 1/2 - 17/50 = 44/25 <= 2', 1 + F(3, 5) + F(1, 2) - F(17, 50) == F(44, 25))
# Lemma 16.2(1) at x_r = beta*+e > 87/100, w_r = 1/2: boundary exponents after multiplication by Q^{x_r}
l162 = [-R(1, 2), R(3, 2) - 2 * X, R(3, 2) - 2 * X, 2 - 3 * X, 2 - 3 * X, 3 - 5 * X]
check('E5 small rows: G_p << Q^(1/2) on u needs boundary exponents <= 1/2 at Re s >= 87/100: max %s' % max(e.subs(X, R(87, 100)) for e in l162), max(e.subs(X, R(87, 100)) for e in l162) <= R(1, 2))

print('== F. Appendix E: exact scalar values at the two certified triples ==')
claims = {
 'stage0': dict(lxl=F(8243, 40000), lyl=F(16079, 120000), small=-F(191530333, 45730080000), floor=-F(5837, 500000), rows=-F(433393, 6000000), ly20=F(55163, 2400000), h600=F(31757, 24000000), z=F(1, 10**7), g=F(1, 10**6), gs=F(1, 2000000)),
 'stage1': dict(lxl=F(2060527, 10000000), lyl=F(669701, 5000000), small=-F(47785783297087, 11432841120000000), floor=-F(8748053, 750000000), rows=-F(108354377, 1500000000), ly20=F(13791227, 600000000), h600=F(2646491, 2000000000), z=F(1, 10**9), g=F(1, 10**7), gs=F(1, 20000000)),
}
for nm, (kk, bb, ll) in trip.items():
    cl = claims[nm]
    lxx = (1 - bb - ll) / 2; lyy = (1 + bb - ll) / 2; hh = (1 + bb + 3 * ll) / 2
    C0v = -F(1, 4) + bb / 6 + 5 * ll / 4
    Asmv = F(1, 2) + (ll / 2) * (F(1, 2) + 2 * ll / hh) - hh / 2
    small = C0v + Asmv / 8; floor = C0v + (F(1, 2) + 3 * ll / 2) / 50; rows = hh * (F(17, 50) - F(1, 6)) - lyy / 2 + 2 * F(1, 100)
    check('F %s low-scale margins lx-l=%s, ly-l-11b/6=%s equal the printed values' % (nm, lxx - ll, lyy - ll - F(11, 6) * bb), lxx - ll == cl['lxl'] and lyy - ll - F(11, 6) * bb == cl['lyl'])
    check('F %s small-delta bound C0+Asm/8 = %s (printed), < -1/250, Asm=%s > 0, C0=%s' % (nm, small, float(Asmv), float(C0v)), small == cl['small'] and small < -F(1, 250) and Asmv > 0 and C0v < -F(1, 250))
    check('F %s floor endpoint = %s (printed), < -1/100' % (nm, floor), floor == cl['floor'] and floor < -F(1, 100))
    check('F %s small rows = %s (printed), < -1/20' % (nm, rows), rows == cl['rows'] and rows < -F(1, 20))
    check('F %s principal margins ly/20, h/600 equal printed values' % nm, lyy / 20 == cl['ly20'] and hh / 600 == cl['h600'])
    check('F %s supply l/(h+zeta) = %s > 21/100; 6kl=%s > 3/4; l/h < 1/(6k); h/2 < ly < 1/2; B(l) > 87/100' % (nm, float(ll / (hh + cl['z'])), float(6 * kk * ll)),
          ll / (hh + cl['z']) > F(21, 100) and 6 * kk * ll > F(3, 4) and ll / hh < 1 / (6 * kk) and hh / 2 < lyy < F(1, 2) and F(11, 12) - ll / 4 > F(87, 100))
    check('F %s margins: g-2zeta > g*, 0<2zeta<1/1000, 0<g*<1/1000' % nm, cl['g'] - 2 * cl['z'] > cl['gs'] and 0 < 2 * cl['z'] < F(1, 1000) and 0 < cl['gs'] < F(1, 1000))
    # leftover saving in the small-delta and floor ranges after the 2 zeta extension
    print('   %s: small-delta slack below -1/250: %.3e ; floor slack: %.3e ; small-row slack: %.3e' % (nm, float(-F(1, 250) - small), float(-F(1, 100) - floor), float(-F(1, 20) - rows)))
    print('   %s: B(l) = %s = %.10f ; (1+kappa)/2 = %s' % (nm, F(11, 12) - ll / 4, float(F(11, 12) - ll / 4), (1 + kk) / 2))

print('== G. Appendix D certificate (re-check, independent expansion) ==')
y = sp.symbols('y')
cert = {
 'stage0': (R(3, 4), R(173, 2000), R(10027, 60000), R(1, 10**6), 2916000000,
            [1209956550, 2343372300, 1740394800, 794068800], [-1135891798, -1173235148, 258347816], [266598135, 244982070]),
 'stage1': (R(29991, 40000), R(17307, 200000), R(1253399, 7500000), R(1, 10**7), 1457125331220000000,
            [604514027207496297, 1171060420363058502, 869869372328057808, 396910005991680000],
            [-567451842451072679, -586296072701709724, 128972962522474840], [133165863887059575, 122393853878983830]),
}
for nm, (kv, bv, lv, gv, Lam, Ac, Bc, Cc) in cert.items():
    sub = {c: 1 / (3 * kv), b: bv, l: lv, x: R(1, 2) - y}
    Rkap = 1 - dl + (al - dl) * dl * P / (2 * J)
    Eexp = (C0 + dl / 2 + dl * x * (l + c * (h / 4 - ly / 2)) - R(3, 4) * h * (1 - Rkap)).subs(sub)
    lhs = sp.expand(sp.cancel(2 * Lam * J.subs(sub) * (-Eexp - gv)))
    Ap = sum(a * y**i for i, a in enumerate(Ac)); Bp = sum(a * y**i for i, a in enumerate(Bc)); Cp = sum(a * y**i for i, a in enumerate(Cc))
    check('G %s identity (40) as polynomials in (delta,y)' % nm, sp.expand(lhs - (Ap * dl**2 + Bp * dl + Cp)) == 0)
    disc = sp.Poly(sp.expand(4 * Ap * Cp - Bp**2), y).all_coeffs()
    check('G %s A_j and 4AC-B^2 have positive coefficients' % nm, all(a > 0 for a in Ac) and all(cf > 0 for cf in disc))

print()
print('TOTAL FAILS:', len(FAILS), FAILS)
sys.exit(1 if FAILS else 0)
