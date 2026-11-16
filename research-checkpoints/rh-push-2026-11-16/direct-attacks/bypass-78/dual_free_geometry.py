"""Exact dual certificates: unequal lengths cannot lower the refined (averaged-numerator) boundary.

Variables lx, ly, l (free reals).  h = 1 - lx + l.
Low constraints used (each is implied by B >= B_low of Liu 2610.26835 Sec. 15.1):
   L0  = 5/6 + M/12 - l/6        (G >= b/12, k >= 0)
   LK  = L0 + (M + l - 1)/2      (G >= b/12, k >= M+l-1)
   L0m = 5/6 + lx/6 - l/6        (G >= 0,    k >= 0)
   LKm = L0m + (M + l - 1)/2     (G >= 0,    k >= M+l-1)
Class constraint at (delta, x=1/2):   B >= H_theta := a - ly(1/2+theta) - h/6 - l/2 + l g + h(K + theta/2),
   K = (3R+1)/4, g = delta/2, theta in {g/(6 kappa), 0}   (formula (14.7) at d = h, any geometry).

Region A (ly >= h/2, theta = g/(6k) is the better shift):  find w >= 0 with
   w0 L0 + wK LK + wH H_max  ==  constant  (all geometry coefficients vanish)   => B >= constant.
Region B (ly <= h/2, theta = 0 better):  find v >= 0, lam >= 0 with
   v0 L0m + vK LKm + vH H_0  ==  constant + lam*(h/2 - ly)                    => B >= constant on region B.
"""
import sympy as sp

lx, ly, l, d, k = sp.symbols('lx ly l delta kappa', real=True)
x = sp.Rational(1, 2)
c = 1/(3*k)
D = 3 - (1 + 2*c)*x; P = (2 - 2*c*x)*(1 - x)
J = (sp.Rational(5, 6) - d)*D + d*P
R = 1 - d + (sp.Rational(5, 6) - d)*d*P/(2*J)
a = (1 + d)/2; g = d*x; K = (3*R + 1)/4
h = 1 - lx + l; M = lx + ly
def H(theta):
    return a - ly*(sp.Rational(1, 2) + theta) - h/6 - l/2 + l*g + h*(K + theta/2)
L0 = sp.Rational(5, 6) + M/12 - l/6
LK = L0 + (M + l - 1)/2
L0m = sp.Rational(5, 6) + lx/6 - l/6
LKm = L0m + (M + l - 1)/2

def grad(e): return [sp.diff(e, v) for v in (lx, ly, l)]
def const(e): return e.subs({lx: 0, ly: 0, l: 0})

# ---------- Region A ----------
w0, wK, wH = sp.symbols('w0 wK wH')
Hmax = H(g/(6*k))
comb = w0*L0 + wK*LK + wH*Hmax
eqs = [sp.Eq(gc, 0) for gc in grad(comb)] + [sp.Eq(w0 + wK + wH, 1)]
# 4 equations, 3 weights: solvable only on the critical curve cr(delta,kappa)=0
sol = sp.solve(eqs[1:], [w0, wK, wH], dict=True)[0]          # use ly-, l-equations + normalisation
resid = sp.factor(sp.together(grad(comb)[0].subs(sol)))        # remaining lx-equation
num = sp.numer(resid)
print("Region A: residual of the lx-equation factors as:", sp.factor(num), " / ", sp.factor(sp.denom(resid)))
cr_liu = (3 - 324*k**2)*d**2 + (756*k**2 - 54*k - 5)*d + 40*k - 300*k**2
print("   Liu's cr(delta,kappa) divides it:", sp.simplify(sp.rem(sp.expand(num), sp.expand(cr_liu), d)) == 0)
for kv in [sp.Rational(3, 4), sp.Rational(7497732940799, 10**13)]:
    roots = [r for r in sp.Poly(cr_liu.subs(k, kv), d).nroots(n=40) if abs(sp.im(r)) < 1e-30 and sp.Rational(1, 8) < sp.re(r) < sp.Rational(5, 6)]
    dc = sp.re(roots[0])
    ws = {s: sp.N(sol[s].subs({k: kv, d: dc}), 30) for s in (w0, wK, wH)}
    val = sp.N(const(comb).subs(sol).subs({k: kv, d: dc}), 30)
    print(f"   kappa={sp.N(kv,15)}: delta_c={sp.N(dc,15)}  weights={ {str(s): sp.N(v,10) for s,v in ws.items()} }  => B >= {val}")

# ---------- Region B ----------
v0, vK, vH, lam = sp.symbols('v0 vK vH lam')
H0 = H(0)
combB = v0*L0m + vK*LKm + vH*H0 - lam*(h/2 - ly)
eqsB = [sp.Eq(gc, 0) for gc in grad(combB)] + [sp.Eq(v0 + vK + vH, 1)]
solB = sp.solve(eqsB, [v0, vK, vH, lam], dict=True)[0]
valB = sp.simplify(const(combB).subs(solB) + 0)   # constant term (the lam-term has constant -lam/2, already inside combB)
import mpmath as mp
for kv in [sp.Rational(3, 4), sp.Rational(7497732940799, 10**13)]:
    f = sp.lambdify(d, valB.subs(k, kv), 'mpmath')
    best = max(((f(mp.mpf(i)/1000), mp.mpf(i)/1000) for i in range(130, 830)), key=lambda t: t[0])
    dd = best[1]
    wsB = {str(s): sp.N(solB[s].subs({k: kv, d: sp.Float(str(dd))}), 8) for s in (v0, vK, vH, lam)}
    print(f"   Region B, kappa={sp.N(kv,15)}: best class delta={dd}: weights {wsB}  => B >= {best[0]}")
