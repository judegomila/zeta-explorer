# odd number of inserted real zeros: b = (u-1)(u+a) is the model of M_0 x (-Theta); b = u(u-1)(u+a) is the model of M_0 x Theta
import sys, os
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'd10_check.py')).read()
src = src[:src.index("resB = []")].replace('print("A identity', '#print("A identity')
exec(src)
for a in (Q(1, 4), Q(3, 4), Q(11, 20), Q(9, 10)):
    r = []
    for base, n in (([[Q(-1), Q(1)]], 2), ([[Q(0), Q(1)], [Q(-1), Q(1)]], 3)):
        co = from_roots_quadratics(base + [[a, Q(1)]])
        H, bf, sym = Hfit(poly(co), n)
        r.append((inertia_charpoly(H), bf))
    print('a =', a, ' b=(u-1)(u+a): (pos,neg,zero), fit failures', r[0], '  b=u(u-1)(u+a):', r[1])
