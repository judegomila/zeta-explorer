# Levinson-Conrey mean-value constant for linear Q(x) = 1 - lam*x  (the alpha-family: D = xi + alpha xi' ~ zeta + (lam/L) zeta',
# lam = alpha*L/(1+alpha*L/2), L = log T).  Conrey 1989 Thm 2 / Bui-Conrey-Young (1.4):
#   kappa >= 1 - (1/R) log c,  c = 1 + (1/theta) int_0^1 int_0^1 e^{2Rv} ( d/dx[e^{R theta x} P(x+u) Q(v+theta x)]_{x=0} )^2 du dv
# P = mollifier polynomial, P(0)=0, P(1)=1.  Quoted formula; validated against Levinson's 0.3420 (lam=1, P=x, R=1.3, theta=1/2).
import numpy as np
from scipy import optimize
g, w = np.polynomial.legendre.leggauss(60); g = (g+1)/2; w = w/2
U, V = np.meshgrid(g, g, indexing='ij'); W = np.outer(w, w)
def c_val(pc, lam, R, th):
    # P(x) = x + sum_k pc[k] * x(1-x) x^k
    P  = U.copy(); dP = np.ones_like(U)
    for k, a in enumerate(pc):
        P  += a*(U**(k+1) - U**(k+2)); dP += a*((k+1)*U**k - (k+2)*U**(k+1))
    Q = 1 - lam*V; dQ = -lam
    d = R*th*P*Q + dP*Q + th*P*dQ
    return 1 + (1/th)*np.sum(W*np.exp(2*R*V)*d*d)
def kap(pc, lam, R, th): return 1 - np.log(c_val(pc, lam, R, th))/R
print("validation  P=x, lam=1, R=1.3, theta=1/2: kappa = %.4f   (Levinson 1974: 0.3420)" % kap([], 1.0, 1.3, 0.5))
for th in (0.5, 4/7):
    print("theta = %.4f" % th)
    for lam in (0.25, 0.5, 0.75, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0):
        r1 = optimize.minimize(lambda x: -kap([], lam, x[0], th), [1.3], method='Nelder-Mead')
        r2 = optimize.minimize(lambda x: -kap(x[1:], lam, x[0], th), [1.3,0,0,0], method='Nelder-Mead', options={'xatol':1e-9,'fatol':1e-12,'maxiter':20000,'maxfev':20000})
        print("   lam=%.2f  P=x: kappa=%.4f (R=%.3f)    P deg 4 optimised: kappa=%.4f (R=%.3f)" % (lam, -r1.fun, r1.x[0], -r2.fun, r2.x[0]))
    r = optimize.minimize(lambda x: -kap(x[2:], x[1], x[0], th), [1.3,1.0,0,0,0], method='Nelder-Mead', options={'xatol':1e-10,'fatol':1e-13,'maxiter':40000,'maxfev':40000})
    print("   joint optimum over lam, R, P(deg 4): kappa=%.5f at lam=%.4f R=%.4f" % (-r.fun, r.x[1], r.x[0]))
    # 'integrating over alpha': any average of admissible bounds is <= the best one; mixture of Q's is again linear Q with mean lam
