# Part 3 support: (i) ball enclosure of DH's first off-line zero (interval Newton on a box);
# (ii) B(s) = 1 + c r2 2^-s + c r3 3^-s + r6 6^-s: functional equation, zeros on the line (winding counts),
#      non-multiplicativity; (iii) D_m = f_DH * B^m: coefficients not multiplicative.
import json
from flint import arb, acb, acb_series, ctx
ctx.prec = 300
res = {}
s5 = arb(5).sqrt(); k0 = ((10 - 2*s5).sqrt() - 2)/(s5 - 1)
A = [arb(1), k0, -k0, arb(-1)]
def H_series(s, n=2):
    ctx.cap = n
    S = acb_series([s, 1]); tot = None
    for r in range(1, 5):
        t = S.zeta(acb(arb(r)/5), True)*acb(A[r-1])
        tot = t if tot is None else tot + t
    return tot
# (i) interval Newton: N(B) = s0 - H(s0)/H'(B) inside B  =>  exactly one zero of H (hence of f) in B
s0 = acb(arb('0.8085171825'), arb('85.6993484854'))
for it in range(6):                      # point Newton refinement (non-rigorous start)
    h = H_series(acb(s0.real.mid(), s0.imag.mid()))
    s0 = acb(s0.real.mid(), s0.imag.mid()) - h[0]/h[1]
s0 = acb(s0.real.mid(), s0.imag.mid())
rad = arb('1e-20')
B = acb(arb(s0.real.mid(), rad.abs_upper()), arb(s0.imag.mid(), rad.abs_upper()))
h0 = H_series(s0)[0]; d1 = H_series(B)[1]
NB = s0 - h0/d1
inside = bool((NB.real - s0.real).abs_upper() < rad.abs_lower() and (NB.imag - s0.imag).abs_upper() < rad.abs_lower())
res['dh_zero'] = {'center': [str(s0.real.mid())[:45], str(s0.imag.mid())[:45]], 'box_halfwidth': '1e-20',
                  'Hprime_on_box': d1.str(15), 'Hprime_excludes_0': bool(not d1.contains(0)),
                  'newton_image_radius_upper': [str((NB.real - s0.real).abs_upper()), str((NB.imag - s0.imag).abs_upper())],
                  'newton_image_inside_box': inside, 'Re_minus_half_lower': str((B.real - arb(1)/2).lower())}
# (ii) B
c = arb(1)/2; r2 = arb(2).sqrt(); r3 = arb(3).sqrt(); r6 = arb(6).sqrt()
def Bf(s): return 1 + c*r2*acb(2)**(-s) + c*r3*acb(3)**(-s) + r6*acb(6)**(-s)
def comp(s): return acb(6)**(s/2)*Bf(s)
fe = []
for st in [acb(arb('0.3'), arb('2.7')), acb(arb('1.9'), arb('-11.2')), acb(arb('-0.4'), arb('40'))]:
    d = comp(st) - comp(1 - st); fe.append(bool(d.contains(0)) and float(abs(d).upper()) < 1e-70)
res['B_functional_equation_checks'] = fe
# zeros on the line in |t| <= T: sign changes of the real function g(y) = cos(y a) + c cos(y b) versus
# the count from the argument principle on the rectangle [-3, 4] x [0, T] (winding by ball steps)
al = arb(6).log()/2; be = (arb(3)/2).log()/2
def g(y): return (y*al).cos() + c*(y*be).cos()
T = 60; step = arb(1)/200; sc = 0; undec = 0
prev = g(arb(0)); y = arb(0)
for i in range(1, T*200 + 1):
    y = step*i; v = g(y)
    if v.contains(0): undec += 1; continue
    if (prev > 0) != (v > 0): sc += 1
    prev = v
# argument principle: count zeros of comp(s) in the rectangle -3 <= sigma <= 4, 0 < t < T (T not a zero ordinate)
def wind(P, ns):
    """rigorous: on each sub-segment the ball image divided by the start value has positive real part"""
    tot = arb(0)
    for (p, q), n in zip([(P[0], P[1]), (P[1], P[2]), (P[2], P[3]), (P[3], P[0])], ns):
        for k in range(n):
            a_ = p + (q - p)*arb(k)/n; b_ = p + (q - p)*arb(k + 1)/n
            mid = (a_ + b_)/2; hr = ((b_ - a_).real/2).abs_upper(); hi = ((b_ - a_).imag/2).abs_upper()
            ball = acb(arb(mid.real.mid(), float(hr)*1.0000001 + 1e-60), arb(mid.imag.mid(), float(hi)*1.0000001 + 1e-60))
            fa = comp(a_)
            if not ((comp(ball)/fa).real > 0): return None
            qq = comp(b_)/fa
            tot += arb.atan2(qq.imag, qq.real)
    return tot
Th = arb(T) + arb('0.013'); eps = arb('0.0005')
P = [acb(-3, -eps), acb(4, -eps), acb(4, Th), acb(-3, Th)]
w = wind(P, [2000, 20000, 2000, 20000])
res['B_zero_count'] = {'T': T, 'sign_changes_on_line_0_to_T': sc, 'undecided_grid_points': undec,
                       'argument_principle_count_rectangle_-3..4': (str(w/(2*arb.pi())) if w is not None else 'step too coarse'),
                       'g(T+0.013) nonzero': bool(not g(Th).contains(0))}
# (iii) non-multiplicativity
gB = {1: arb(1), 2: c*r2, 3: c*r3, 6: r6}
res['B_defect_b6_minus_b2b3'] = str(gB[6] - gB[2]*gB[3])
def a(n): return [arb(0), arb(1), k0, -k0, arb(-1)][n % 5]
res['Dm_defect_d91_minus_d7d13 (independent of m)'] = str(a(91) - a(7)*a(13))
json.dump(res, open('part3_checks.json', 'w'), indent=1); print(json.dumps(res, indent=1))
