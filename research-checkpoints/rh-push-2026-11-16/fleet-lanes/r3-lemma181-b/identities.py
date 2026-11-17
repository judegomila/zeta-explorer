"""Exact identities for the numerator step (Liu II Prop 14.3 / manuscript Lemma 18.1 as M2).
sympy, exact.  Notation: c = 2/(3 kappa); g = delta*x; counts from Liu II (2.8),(2.9),(13.16)."""
import sympy as sp
d, x, k, th, R, m, m1, m2, z = sp.symbols('delta x kappa theta R m m1 m2 z', positive=True)
al = sp.Rational(5, 6)
c = 2/(3*k)
g = d*x
D = 3 - (1 + c)*x
P = (2 - c*x)*(1 - x)
J = (al - d)*D + d*P
t = 1 + d*P/(2*J)
Rk = 1 - d + (al - d)*d*P/(2*J)
r = ((2 - c*x)*t + (c/2 - 1)*x)/D
ms = t - r
# (I1) both detector counts equal R_kappa at the crossing
FI = x + (1 - x)*r
FS = 2*ms + (c/2)*x*(1 - 2*ms)
print("I1a  1 - delta*F_I(r*) - R_kappa =", sp.simplify(1 - d*FI - Rk))
print("I1b  1 - delta*F_S(m*) - R_kappa =", sp.simplify(1 - d*FS - Rk))
# (I2) crossing length m_x of the two block bounds equals m* when R = R_kappa
mx = ((1 - R)/4 - g/(12*k))/(d/2 - g/(6*k))
print("I2   m_x(R=R_kappa) - m* =", sp.simplify(mx.subs(R, Rk) - ms))
# (I3) tau-branch: block exponent is independent of m at theta0 = g/(6 kappa)
tau = (1 - R)/4 - g*(1 - 2*m)/(12*k)
th0 = g/(6*k)
print("I3   R + tau_m - theta0*m - ((3R+1)/4 - theta0/2) =", sp.simplify(R + tau - th0*m - ((3*R + 1)/4 - th0/2)))
# (I4) exchanged Cauchy-Schwarz (detector factor inside M2) minus Hoelder(3/4,1/4), general block m, detector length md
md = sp.symbols('m_d', positive=True)
Rdet = 1 - 2*d*md - 2*g*(1 - 2*md)/(6*k)          # M2 count of rows detected at length m_d
zmix = (1 - m - md)/(6*k)
new = Rdet/2 + (1 - d*md - 2*g*zmix)/2
old = (3*Rdet + 1)/4 - g*(1 - 2*m)/(12*k)
print("I4   exchanged-CS exponent - Hoelder exponent =", sp.simplify(new - old))
# (I5) N(theta) for theta >= theta0 interpolates averaged (theta0) and pointwise (delta/2) endpoints
N = R + mx*(d/2 - th)
print("I5a  N(theta0)+theta0 - (K+theta0/2) =", sp.simplify(N.subs(th, th0) + th0 - ((3*R + 1)/4 + th0/2)))
print("I5b  N(delta/2)+delta/2 - (R+delta/2) =", sp.simplify(N.subs(th, d/2) + d/2 - (R + d/2)))
# (I6) m_x <= 1/2  <=>  R >= 1 - delta
print("I6   (1/2 - m_x)*(delta/2 - g/(6k)) =", sp.simplify((sp.Rational(1, 2) - mx)*(d/2 - g/(6*k))), " (= (R-(1-delta))/4)")
# numbers at the critical class
vals = {d: sp.Float('0.46934485869814', 30), x: sp.Rational(1, 2), k: sp.Float('0.74977329407992826', 30)}
print("critical class: R =", Rk.subs(vals).evalf(15), " t =", t.subs(vals).evalf(15), " r* =", r.subs(vals).evalf(15),
      " m* =", ms.subs(vals).evalf(15), " theta0 =", th0.subs(vals).evalf(15))
Rc = Rk.subs(vals)
print("   K = (3R+1)/4 =", ((3*Rc + 1)/4).evalf(15), "  K - R =", ((1 - Rc)/4).evalf(15),
      "  sigma(1/2) = (1-R)/4, bin bound delta/4 =", (vals[d]/4).evalf(15))
