"""Self-test of lylib against independent values.  Run:  python selftest.py   (about 1 minute)."""
import math, sys, time
from flint import arb, acb, ctx, arb_poly
import lylib as L

ctx.prec = 200
ok = True


def check(name, cond, info=''):
    global ok
    ok = ok and bool(cond)
    print(('ok   ' if cond else 'FAIL ') + name + ('  ' + str(info) if info else ''))


I = acb(0, 1)
# 1. thalf with many terms equals xi(1/2+iz); afe is not xi but is even/real
F, _, _, _ = L.make_object('thalf', 'zeta', 6)
for z in (acb(3), acb(20, 0.3), acb(41.5)):
    s = arb(1) / 2 + I * z
    xi = L.Gz(s) * s.zeta()
    check('thalf(zeta,N=6) = xi at z=%s' % complex(z), abs(F(z) - xi) < abs(xi) * 1e-20)
# 2. DH: thalf with many terms equals (5/pi)^{s/2} Gamma((s+1)/2) f(s) (up to the constant factor), f by Hurwitz
F, _, _, _ = L.make_object('thalf', 'dh', 12)
kp = L.kappa_dh()


def dh_f(s):
    return (-s * arb(5).log()).exp() * (s.zeta(arb(1) / 5) + kp * s.zeta(arb(2) / 5)
                                         - kp * s.zeta(arb(3) / 5) - s.zeta(arb(4) / 5))


rat = []
for z in (acb(3), acb(20, 0.3), acb(41.5)):
    s = arb(1) / 2 + I * z
    lam = L.Gfac('dh', s) * dh_f(s)
    rat.append(F(z) / lam)
check('thalf(dh,N=12) proportional to Lambda_DH (FE of the DH theta kernel)',
      all(abs(r - rat[0]) < 1e-20 for r in rat), complex(rat[0]))
# DH off-line zero from the obstruction map
s0 = acb('0.8085171825', '85.6993484854')
check('DH zero at 0.8085171825+85.6993484854i', abs(dh_f(s0)) < 1e-7, float(abs(dh_f(s0))))
check('a(6)-a(2)a(3) = 1.0807', abs(float((L.coef('dh', 6) - L.coef('dh', 2) * L.coef('dh', 3)).mid()) - 1.0807) < 1e-4)
# 3. Taylor coefficients against direct evaluation
for inp in ('zeta', 'dh', 'ea:0.25', 'nr:3:2.2'):
    cs = L.taylor_even(inp, 30)
    x = arb('0.3')
    val = sum(cs[k] * x ** (2 * k) for k in range(31))
    s = arb(1) / 2 + x
    if inp == 'zeta':
        ref = L.Gz(acb(s)) * acb(s).zeta()
    elif inp == 'dh':
        ref = L.Gfac('dh', acb(s)) * dh_f(acb(s))
    elif inp == 'ea:0.25':
        a = arb('0.25')
        ref = L.Gz(acb(s + a)) * acb(s + a).zeta() * L.Gz(acb(s - a)) * acb(s - a).zeta()
    else:
        ref = L.Gz(acb(s)) * acb(s).zeta() * ((x * arb(3).log()).cosh() * 2 + arb('2.2'))
    check('taylor_even(%s) reproduces the function at x=0.3' % inp, abs(acb(val) - ref) < abs(ref) * 1e-25)
# 4. heat coefficients against certified quadrature of the kernel moments
ctx.prec = 200
for lam in ('-0.5', '0.05'):
    cs = L.taylor_even('heat:' + lam, 6)
    pi = arb.pi()

    def Phi(u):
        r = acb(0)
        for n in range(1, 8):
            r += (4 * pi * pi * n ** 4 * (u * 9 / 2).exp() - 6 * pi * n * n * (u * 5 / 2).exp()) * (-pi * n * n * (2 * u).exp()).exp()
        return r
    good = True
    for m in (0, 3, 6):
        mom = acb.integral(lambda u, _: 2 * (arb(lam) * u * u).exp() * Phi(u) * u ** (2 * m), 0, 3).real
        good = good and abs(cs[m] * arb(math.factorial(2 * m)) - mom) < abs(mom) * 1e-15
    check('heat:%s Taylor coefficients = kernel moments by quadrature' % lam, good)
# 5. Sturm against known polynomials
p = arb_poly.from_roots([arb(k) for k in range(1, 9)])
check('Sturm: 8 real roots', L.sturm_real_roots(p.coeffs())[0] == 8)
q = p * arb_poly([5, 2, 1])
check('Sturm: 8 real + one complex pair', L.sturm_real_roots(q.coeffs())[0] == 8)
# 6. winding: zeros of xi in the window T=40 (6 zeros with 0<gamma<40) through thalf with N=6
ctx.prec = 160
F, Y, _, _ = L.make_object('thalf', 'zeta', 6)
t = time.time()
r = L.lee_yang_window(F, 40.0, 1.0)
check('lee_yang_window(xi, T=40): PASS with 12 zeros', r['verdict'] == 'PASS' and r['n_tot'] == 12, r)
# 7. winding on E_a (all zeros off the line): FAIL with 2*6 zeros in the upper rectangle at a=0.25
F, Y, _, _ = L.make_object('afe', 'ea:0.25', 1)   # placeholder object: only checks that the builder runs
ctx.prec = 200


def Fea(z):
    s = arb(1) / 2 + I * z
    a = arb('0.25')
    return L.Gz(s + a) * (s + a).zeta() * L.Gz(s - a) * (s - a).zeta()


r = L.lee_yang_window(Fea, 40.0, 1.0)
check('lee_yang_window(E_0.25, T=40): FAIL, 12 zeros above the axis, first in Re z in (13.75,14.4)',
      r['verdict'] == 'FAIL' and r['n_up'] == 12 and r['lowest_offaxis_re_in'][0] < 14.14 < r['lowest_offaxis_re_in'][1], r)
print('time', round(time.time() - t, 1), 's')
print('SELFTEST', 'PASSED' if ok else 'FAILED')
sys.exit(0 if ok else 1)
