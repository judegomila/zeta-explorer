"""exact_checks.py -- arithmetic behind sections 2-4 of RESULT.md (float, 12 digits; inputs from r3 lanes)."""
from math import *
d, kap = 0.469344858698, 0.749773294       # delta_c, kappa_flat = 2 B_flat - 1
Rc, rs, ms, ts = 0.590332353526, 0.745699943, 0.418253634, 1.163953577
c2 = 6 * kap; q = d / 2; th0 = q / c2
M1 = lambda r: 1 - d * r - 2 * q * (1 - r) / 2 if r <= 1 else (1 + 5 * r) / 6 - d * r
M2 = lambda m: 1 - 2 * d * m - 2 * q * (1 - 2 * m) / c2
print("saddle  M1(r*) =", M1(rs), " M2(m*) =", M2(ms), " long(t*) =", M1(ts), " R_c =", Rc)
lo, hi = (1 - Rc) / d, Rc / (1 - d)
print("window of Lemma W2: (%.6f, %.6f)" % (lo, hi))
# (A) products of witnesses supplied by the joint strategy p(t) = (r*, m*) for t <= t*, (t, 0) for t > t*
import itertools
base = {'M_r*': rs, 'S_m*': ms, 'M_t (t>=t*)': ts}
inside = []
for a in range(0, 4):
    for b in range(0, 4):
        for c in range(0, 3):
            if a + b + c == 0: continue
            Y = a * rs + b * ms + c * ts          # smallest length of that product type (t = t*)
            if lo < Y < hi: inside.append((a, b, c, Y))
print("(A) products M_r*^a S_m*^b M_t^c with length in the window:", inside)
# (B) below-level requirement: second moment of a product of length Y with spike delta Y lowers the count iff N < R_c + delta Y
f = lambda Y: ((1 - d) * Y - Rc) / (Y - 1)
for nm, Y in (('one scale  M_r* S_m*', ts), ('two scales (t=1, t*) M_r1 S_m1 M_r* S_m*', 1 + ts), ('two scales (t*, t*+) M_r* S_m* M_t*', 2 * ts), ('two scales (t*, 3/2)', ts + 1.5)):
    print("(B) %-44s Y = %.4f  threshold N < %.4f  level %.4f  fraction of (level - 1) needed f = %.4f" % (nm, Y, Rc + d * Y, Y, f(Y)))
print("    f'(Y) sign: R_c - (1 - delta) = %.6f > 0, so f increases with Y; f -> %.4f" % (Rc - (1 - d), 1 - d))
# (C) detector factor at central length: sum_u |S_1/2^2 D_y|^2 << U^{1 + delta y - omega}; level 1 + y
for om in (0.0, 0.025, 0.2):
    for y in (ms, rs, ts):
        print("(C) omega = %.3f  y = %.4f: needed exponent %.4f, level %.4f, fraction %.4f" % (om, y, 1 + d * y - om, 1 + y, 1 - d + om / y))
# (D) (H) at the witness block: level-set form
print("(D) A_P(m*) = %.9f = R_c; (H) with 39/40 gives #B_P(m) <= U^(A_P(m) - 1/40); A_P slope %.4f per unit m" % (M2(ms), -2 * d * (1 - 1 / c2)))
print("    rows with t=1 plain length m1: saved by (H) iff m1 > m* - (1/40)/slope = %.4f ; forced range of m1 at t = 1: [%.4f, %.4f]" % (ms - 0.025 / (2 * d * (1 - 1 / c2)), 1 - rs, ms))
# new saddle when the M2 option is lowered by tau2 = 1/40
s1, s2, sl = d / 2, 2 * d * (1 - 1 / c2), 5 / 6 - d
tau2 = 1 / 40
short_drop = tau2 / (1 + s2 / s1)                 # at fixed t: M1(r*+D) = M2(m*-D) - tau2
hs = 1 / (1 / s1 + 1 / s2)                        # slope of the short branch in t
dt = -short_drop / (hs + sl)
print("    count at the critical class with M2 - 1/40: R_c - %.5f (t moves by %.5f); MODEL dB at -0.138 per unit: %.6f" % (short_drop + hs * dt, dt, -0.138 * (short_drop + hs * dt)))
# (E) Theorem R ceilings
print("(E) K - R - m*(delta/2) at theta = 0: %.6f -> omega <= %.6f at fixed count on nu=1 plain-witness rows (first moment form, theta = 0)" % ((1 - Rc) / 4 - ms * d / 2, 4 * ((1 - Rc) / 4 - ms * d / 2)))
m1 = 1 - rs
print("    forced size at theta0 for the shortest t=1 plain witness m1 = %.4f: U^%.5f; saving d forces a count saving on all nu=1 rows iff d > %.5f (omega > %.4f)" %
      (m1, m1 * (d / 2 - th0), 2 / 3 - m1 * (d / 2 - th0) - Rc, 4 * (2 / 3 - m1 * (d / 2 - th0) - Rc)))
print("    theta0 = %.9f, m*(delta/2 - theta0) = %.9f, R_c + that = %.9f" % (th0, ms * (d / 2 - th0), Rc + ms * (d / 2 - th0)))
