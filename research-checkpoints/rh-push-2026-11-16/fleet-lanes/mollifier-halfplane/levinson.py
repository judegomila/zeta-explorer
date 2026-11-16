"""One-piece Levinson-Conrey functional.
c(P,Q,R,theta) = 1 + (1/theta) int int (P'(u) q(v) + theta P(u) q'(v))^2 du dv,  q(v)=e^{Rv}Q(v)
P(0)=0,P(1)=1; Q(0)=1, Q(x)+Q(1-x)=const.   kappa >= 1 - log(c)/R.
Optimal P: sinh(lam u)/sinh(lam), lam = theta sqrt(C/A)  =>
c = (1+q(1)^2)/2 + sqrt(AC) coth(theta sqrt(C/A)),  A=int q^2, C=int q'^2.
"""
import numpy as np, sys, json
from scipy.optimize import minimize, minimize_scalar
from scipy.integrate import dblquad
xs, ws = np.polynomial.legendre.leggauss(200); xs = (xs+1)/2; ws = ws/2

def Qfun(a, x):
    Q = np.ones_like(x); dQ = np.zeros_like(x)
    for j, aj in enumerate(a):
        k = 2*j+1
        Q = Q + aj*((x-0.5)**k + 0.5**k); dQ = dQ + aj*k*(x-0.5)**(k-1)
    return Q, dQ

def cval(a, R, th):
    Q, dQ = Qfun(a, xs)
    q = np.exp(R*xs)*Q; dq = np.exp(R*xs)*(R*Q+dQ)
    A = ws@(q*q); C = ws@(dq*dq)
    Q1, _ = Qfun(a, np.array([1.0])); q1 = np.exp(R)*Q1[0]
    lam = th*np.sqrt(C/A)
    return (1+q1*q1)/2 + np.sqrt(A*C)/np.tanh(lam), lam

def kappa(p, th):
    R = p[0]
    if R <= 1e-6: return -9
    c, _ = cval(p[1:], R, th)
    return 1 - np.log(c)/R

def best(th, deg, starts=40, seed=1):
    rng = np.random.default_rng(seed); bestv = -9; bestp = None
    for s in range(starts):
        p0 = np.concatenate([[rng.uniform(0.2, 2.0)], [-rng.uniform(0.3, 1.5)], rng.normal(0, 1, deg-1)])
        r = minimize(lambda p: -kappa(p, th), p0, method='Nelder-Mead', options=dict(xatol=1e-10, fatol=1e-13, maxiter=40000, maxfev=40000))
        r = minimize(lambda p: -kappa(p, th), r.x, method='BFGS')
        if -r.fun > bestv: bestv, bestp = -r.fun, r.x
    return bestv, bestp

# proved ceiling: c >= (1+q1^2)/2 + |B| coth(theta |B| / A_lb), B=(q1^2-1)/2, A_lb = m^2 e^R gd(R)/R, m=(1+Q(1))/2
def gd(R): return 2*np.arctan(np.tanh(R/2))
def c_lb(R, Q1, th):
    q1 = np.exp(R)*Q1; m = (1+Q1)/2; B = abs((q1*q1-1)/2)
    Alb = m*m*np.exp(R)*gd(R)/R
    base = (1+q1*q1)/2
    if B < 1e-14: return base + (Alb/th if Alb > 0 else 0)
    if Alb <= 0: return base + B
    x = th*B/Alb
    return base + (B/np.tanh(x) if x < 300 else B)
def ceiling(th):
    bestv = -9; arg = None
    for R in np.concatenate([np.linspace(0.002, 3, 3000), np.linspace(3, 40, 800)]):
        Q1s = np.concatenate([np.linspace(-np.exp(-R)*1.2, np.exp(-R)*1.2, 2401), np.linspace(-3, 3, 1201)])
        v = max((1-np.log(c_lb(R, Q1, th))/R, Q1) for Q1 in Q1s)
        if v[0] > bestv: bestv, arg = v[0], (R, v[1])
    return bestv, arg

if __name__ == "__main__":
    # sanity 1: Levinson-type choice P=x, Q=1-x, theta=1/2, R=1.3 by direct double integral
    th, R = 0.5, 1.3
    f = lambda v, u: (1*np.exp(R*v)*(1-v) + th*u*np.exp(R*v)*(R*(1-v)-1))**2
    c = 1 + dblquad(f, 0, 1, 0, 1)[0]/th
    print("P=x,Q=1-x,theta=1/2,R=1.3: c=%.6f kappa=%.6f" % (c, 1-np.log(c)/R))
    # sanity 2: closed form vs direct integral with sinh P, Q=1-x... a=[-1] gives Q=1-(x-.5)-.5=1-x
    cc, lam = cval([-1.0], R, th)
    P = lambda u: np.sinh(lam*u)/np.sinh(lam); dP = lambda u: lam*np.cosh(lam*u)/np.sinh(lam)
    f = lambda v, u: (dP(u)*np.exp(R*v)*(1-v) + th*P(u)*np.exp(R*v)*(R*(1-v)-1))**2
    print("closed form c=%.10f  direct c=%.10f" % (cc, 1 + dblquad(f, 0, 1, 0, 1)[0]/th))
    out = {}
    thetas = [0.5, 17/33, 6/11, 4/7, 0.6, 2/3, 0.75, 7/8, 1, 1.5, 2, 3, 5, 10, 30, 100]
    for th in thetas:
        row = {}
        for deg in (1, 2, 4):
            v, p = best(th, deg, starts=12 if deg > 1 else 6)
            row[deg] = (float(v), [float(t) for t in p])
        ub, arg = ceiling(th)
        out[th] = dict(row=row, ub=float(ub), ubarg=[float(arg[0]), float(arg[1])])
        print("theta=%8.4f  linQ(simple)=%.6f  deg3=%.6f  deg7=%.6f (R=%.4f)  ceiling=%.6f at R=%.3f Q1=%.4f" %
              (th, row[1][0], row[2][0], row[4][0], row[4][1][0], ub, arg[0], arg[1]), flush=True)
    json.dump({str(k): v for k, v in out.items()}, open("levinson_table.json", "w"), indent=1)
