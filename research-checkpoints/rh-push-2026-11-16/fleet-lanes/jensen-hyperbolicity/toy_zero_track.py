# Toy: F(w) = cosh(sqrt(w)) * q(w),  q(w) = (1 - w/W)(1 - w/conj W),  W = (beta + i Gamma)^2.
# cosh(sqrt w) has zeros w = -((k+1/2)pi)^2  (z-spacing pi, all "on the line").
# Track the nonreal zero of F^{(n)} continued from W, report its depth beta_n = Re sqrt(w_n).
import sys
from mpmath import mp, mpf, mpc, factorial, findroot, sqrt, pi
mp.dps = 80
K = 900
def coeffs(beta, Gamma):
    W = mpc(beta, Gamma)**2
    q = [mpf(1), -2*(1/W).real, 1/abs(W)**2]
    c0 = [1/factorial(2*k) for k in range(K)]
    c = [sum(q[j]*c0[k-j] for j in range(3) if k-j >= 0) for k in range(K)]
    return [c[k]*factorial(k) for k in range(K)], W   # gamma_k = k! [w^k]F
def Fn(g, n, w, extra=0):
    # F^{(n+extra)}(w) = sum_k gamma_{n+extra+k} w^k/k!
    m = n+extra; s = mpc(0); t = mpc(1)
    for k in range(K-m):
        s += g[m+k]*t; t = t*w/(k+1)
    return s
for Gamma in [mpf(sys.argv[1])]:
    for beta in [mpf(x) for x in sys.argv[2:]]:
        g, W = coeffs(beta, Gamma)
        w = W; out = []
        for n in range(1, 40):
            try:
                w = findroot(lambda x: Fn(g, n, x), w - mpc(0, 0.5)*abs(w)**0.5, tol=1e-40, maxsteps=200)
            except Exception as e:
                out.append((n, 'fail')); break
            z = sqrt(w)
            if abs(w.imag) < 1e-25:
                out.append((n, 'REAL', float(abs(z.imag)))); break
            out.append((n, float(abs(z.real)), float(abs(z.imag))))
        print(f"Gamma={float(Gamma)} beta={float(beta)} ratio={float(beta/pi):.3f}")
        for o in out: print("   ", o)
