"""Validation of chan.py on cases with known answers."""
import time, math, sys
from flint import acb, arb, ctx, fmpq, acb_poly
import chan as C
C.setprec(512, 400)
ok = True
def chk(name, got, want, tol):
    global ok
    good = abs(got - want) <= tol; ok = ok and good
    print('%-62s got %.13g want %.13g %s' % (name, got, want, 'OK' if good else 'FAIL'), flush=True)

# 1. xi jet: certificate constants of ZERO-CHANNELS-MATH sec 4: |xi'(c)| >= 0.0013827, first zero
rho, res = C.newton('ZETA', acb(0.5, 14.1347), True)
a = C.jet('ZETA', rho, 6)
chk('first zero ordinate', C.f(rho.imag), 14.134725141734693, 1e-13)
chk('|xi\'(rho_1)| (doc: >= 0.0013827, |F_s|^2 n/a)', C.f(abs(a[1])), 0.0013827, 2e-6)
# 2. heat family from the jet formula: zeta-view table (ZERO-CONFINEMENT-COMPARISON sec 2)
for tau, seeds, want in ((-0.1, (14.16, 21.06, 25.04), (14.163717655758552, 21.059827273704822, 25.040131627390866)),
                         (-0.2, (14.19, 21.10, 25.07), (14.192732100184388, 21.097691002699188, 25.069369906557071)),
                         (0.2, (14.08, 20.95, 24.95), (14.076806144224442, 20.946690428829876, 24.952205437445798))):
    for s, w in zip(seeds, want):
        r, _ = C.newton('HEAT:%g' % tau, acb(0.5, s), True)
        chk('heat zero tau=%g' % tau, C.f(r.imag), w, 2e-13)
# heat velocity d gamma/d tau at the first zeros (s2 lane: V/2 = -0.2898, -0.3775, -0.2929 in the variable z = 2 gamma? check sign/scale)
for g0 in (14.1347, 21.022, 25.0109):
    r, _ = C.newton('ZETA', acb(0.5, g0), True); a = C.jet('ZETA', r, 4)
    vel = -(2 * a[2] / a[1]) / 4          # rho' = -F_ss/(4 F_s) = i gamma'
    print('   d gamma/d tau at %.4f = %.6f (finite difference from the table: %.6f)' % (g0, C.f(vel.imag), {14.1347: (14.076806144224442 - 14.192732100184388) / 0.4, 21.022: (20.946690428829876 - 21.097691002699188) / 0.4, 25.0109: (24.952205437445798 - 25.069369906557071) / 0.4}[g0]))
# 3. heat perturbation bound: doc values 8 int Phi (e^{delta u^2}-1) cosh(2 r u) du at r = 0.35: delta = 0.02 -> 0.00011580648; 0.05 -> < 0.00029
pb = C.Pbound('ZETA')
chk('P(0.02, 0.35)', C.f(pb.P(0.02, 0.35)), 0.00011580648, 2e-11)
print('   P(0.05, 0.35) = %.8g (doc: enclosed below 0.00029)' % C.f(pb.P(0.05, 0.35)))
# L_3 = 64 int u^3 Phi cosh(2ru) = sup |xi'''| = xi'''(1/2 + r)

# 4. quartic calibration: exit -0.0817542507988577, collision -0.13406958403644717 (circle centre 1/2 + i/2, radius 7/20)
# P_0(z) = (z^2-1)(z^2-4), z = 1 + 2h at the centre; phi(h) = P_0(1+2h)/P_0'(1)/2
import numpy as np
pz = np.poly1d([1, 0, -5, 0, 4]); ph = pz(np.poly1d([2, 1]))          # in h
co = [float(c) for c in ph.coeffs[::-1]]; co = [c / co[1] for c in co]
ev = C.c4_events([arb(c) for c in co] + [arb(0)] * 4, 0.5, rexit=(0.7,), vcap=1.0)
chk('quartic v_coll', ev.get('v_coll', float('nan')), 0.13406958403644717, 1e-13)
chk('quartic v_exit (r = 0.35)', ev.get('v_exit_0.7', float('nan')), 0.0817542507988577, 1e-13)
print('  ', ev)
# 5. Dyson check on a polynomial: Q = F_ss/F_s = 2 sum 1/(rho - rho_j); kappa = S1^2 + 3 S2 in the line variable
roots = [-3, -1.2, -0.18, 0.18, 1.2, 3]            # Lehmer-like preset of the source
p = np.poly1d(np.poly(roots)); k = 3; h0 = roots[k]
S1 = sum(1 / (h0 - r) for i, r in enumerate(roots) if i != k); S2 = sum(1 / (h0 - r) ** 2 for i, r in enumerate(roots) if i != k)
# F(s) = p(h), s = 1/2 + i h  -> jet in w = s - rho: p(h0 - i w)
q = p(np.poly1d([-1j, h0]))
a = [acb(complex(c).real, complex(c).imag) for c in q.coeffs[::-1]]
b = [c / a[1] for c in a]
kap = C.f((6 * b[3] - 4 * b[2] * b[2]).real)
chk('kappa = S1^2 + 3 S2 (polynomial)', kap, S1 * S1 + 3 * S2, 1e-9)
# 6. DH: first off-line zero of the battery table 0.80851718245663738555, 85.699348485377592172; reality on the line
r, _ = C.newton('DH', acb(0.8085, 85.6993), False)
chk('DH first off-line zero beta', C.f(r.real), 0.80851718245663738555, 1e-14)
chk('DH first off-line zero gamma', C.f(r.imag), 85.699348485377592172, 1e-12)
a = C.jet('DH', acb(0.5, 20.3), 2); print('   DH on the line: F = %s' % a[0].str(12))
r, _ = C.newton('DH', acb(0.5, 5.094), True); chk('DH first on-line zero', C.f(r.imag), 5.09415984, 2e-8)
for code, s0 in (('L4', 6.0209), ('L3', 8.0397)):
    r, _ = C.newton(code, acb(0.5, s0), True); a = C.jet(code, acb(0.5, 10.0), 2)
    print('   %s first zero %.12f ; value on the line at t=10: %s' % (code, C.f(r.imag), a[0].str(12)))
# 7. T-NR off-line zero: 1/2 + arccosh(1.1)/log 3 + i pi/log 3;  M = theta coth theta + 2 x Re xi'/xi(rho)
th = math.acosh(1.1); x = th / math.log(3); g0 = math.pi / math.log(3)
r, _ = C.newton('TNR', acb(0.5 + x, g0), False)
chk('TNR off-line zero beta', C.f(r.real), 0.5 + x, 1e-14)
a = C.jet('TNR', r, 4); Q = 2 * a[2] / a[1]
xa = C.jet('ZETA', r, 2); want = th / math.tanh(th) + 2 * x * C.f((xa[1] / xa[0]).real)
chk('TNR M at the off-line zero', C.f((r.real - 0.5) * Q.real), want, 1e-12)
# 8. truncation of the jet: v_coll, v_exit of zeta zero 1 and of a zero near 9990 with n = 128 and n = 96
t0 = time.time()
for g0, g in ((14.134725, 6.887), (9998.850, None)):
    if g is None:
        z = acb.zeta_zeros(10138, 5); im = [C.f(w.imag) for w in z]; g0 = im[2]; g = min(im[2] - im[1], im[3] - im[2])
    o1 = C.analyse_zero('ZETA', acb(0.5, g0), True, g, n=100, pb=pb, vcap=3*g*g)
    o2 = C.analyse_zero('ZETA', acb(0.5, g0), True, g, n=76, pb=pb, vcap=3*g*g)
    for k in ('v_coll', 'v_exit_0.7', 'lgdel_R', 'lgdel_TR', 'kappa'):
        print('   zero %.3f %-10s n=100: %.12g  n=76: %.12g' % (g0, k, o1.get(k, float('nan')), o2.get(k, float('nan'))))
    print('   ', {k: v for k, v in o1.items() if k != 'eta'})
print('time for 4 full analyses %.1fs' % (time.time() - t0))
print('ALL OK' if ok else 'SOME FAILED')
