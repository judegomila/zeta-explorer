"""r3-critical-count: arithmetic checks for RESULT.md sections 2-4.  Float, numpy only."""
import numpy as np
KF = 0.74977329407992826; DC = 0.46934485869814; RC = 0.59033235352636
# saddle of the source count at (delta_c, 1/2)
c = 2/(3*KF); u = 0.5
D = 3 - (1+c)*u; P = (2-c*u)*(1-u); J = (5/6-DC)*D + DC*P
t = 1 + DC*P/(2*J); r = ((2-c*u)*t + (c/2-1)*u)/(3-(1+c)*u); m = t - r
print("1. saddle: t* = %.6f  r* = %.6f  m* = %.6f  z_M = (1-r*)/2 = %.6f  z_S = (1-2m*)/(6k) = %.6f" % (t, r, m, (1-r)/2, (1-2*m)/(6*KF)))
print("   M1(r*) = %.6f  M2(m*) = %.6f  R_c = %.6f" % (1-DC*(u+(1-u)*r), 1-DC*(2*m+u*(1-2*m)*c/2), RC))
# window for a diagonal-level second-moment option of total length Y with spike <= delta Y
print("2. window: max(1,Y) - delta Y < R_c  iff  %.6f < Y < %.6f" % ((1-RC)/DC, RC/(1-DC)))
for name, Y in [("M_r*", r), ("S_m*^2", 2*m), ("M_r* S_m*", r+m), ("S_m*^3", 3*m), ("M_r*^2", 2*r), ("S_m*", m)]:
    print("   %-10s length %.4f  diagonal-level count %.6f  %s" % (name, Y, max(1, Y)-DC*Y, "in window" if (1-RC)/DC < Y < RC/(1-DC) else "outside"))
print("   prime length needed to enter the window: after M_r*: z > %.4f (source capacity %.4f); after S_m*^2: z > %.4f (source capacity %.4f)"
      % ((1-RC)/DC - r, (1-r)/2, (1-RC)/DC - 2*m, (1-2*m)/(6*KF)))
# supply-capped natural cost at the critical class (t free, adversarial (r, m)), supply L in U-units
def count(c1, c2, L, s=5/6, d=DC, x=.5, k=KF, nt=2001, nr=4001):
    best = 9
    for tt in np.linspace(1, 1.5, nt):
        rr = np.linspace(tt-.5, tt, nr); mm = tt-rr
        inv = np.where(rr <= 1, 1-d*rr-2*d*x*np.minimum((1-np.minimum(rr, 1))/c1, L), 1+s*(rr-1)-d*rr)
        pl = 1-2*d*mm-2*d*x*np.minimum((1-2*mm)/c2, L)
        best = min(best, np.minimum(inv, pl).max())
    return best
print("3. count at (delta_c,1/2) with prime supply L (U-units); source needs only L >= 1/5")
print("   c1   c2      L=0.2105   L=0.25    L=0.5")
for c1, c2 in [(2, 6*KF), (1.5, 6*KF), (1, 6*KF), (2, 1), (1, 1)]:
    print("   %.2f %.3f   " % (c1, c2) + "  ".join("%.6f" % count(c1, c2, L) for L in (0.2105, 0.25, 0.5)))
# Jutila k-th power form: R <= C max(K^{1-d}, N_B K^{k(1-2d)}), N_B >= max(R, K^k)
print("4. Jutila: exponent of K^{k(1-2 delta)} at delta_c: 1-2delta = %.6f > 0 -> second branch is R <= C R K^{+}: vacuous" % (1-2*DC))
print("   real part of threshold 3/4; a_c = %.6f; distance %.6f" % ((1+DC)/2, .75-(1+DC)/2))
# hybrid (u, t) sextic sieve: T(U + K/T + (UK/T)^{2/3}); exponent of count vs tau_T (T = U^q), K = U^Y
print("5. hybrid in t: count exponent  max(1+q, Y, q/3 + 2(1+Y)/3) - delta Y, minimised over Y, as a function of q")
Y = np.linspace(0, 4, 40001)
for q in (0, .05, .1, .25, .5, 1.0):
    v = np.maximum(np.maximum(1+q, Y), q/3+2*(1+Y)/3) - DC*Y
    print("   q = %.2f: %.6f at Y = %.3f" % (q, v.min(), Y[v.argmin()]))
print("   perfect hybrid sieve max(1+q, Y) - delta Y: min = (1+q)(1-delta): q=0: %.6f" % (1-DC))
