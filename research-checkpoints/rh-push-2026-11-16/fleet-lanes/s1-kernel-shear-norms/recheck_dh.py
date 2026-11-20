# Independent higher-precision recheck of "||H_{1/4,L}|| > 1" for Davenport-Heilbronn.
# Time-domain, closed-form archimedean kernel, piecewise-constant Galerkin (orthonormal cells), mpmath at 30 digits.
#   K(u) = sum_{n <= e^u} c(n) n^{-1/2} k1(u - log n),  k1(x) = C e^{-(3/2-a)x} (1 - e^{-2x})^{a-1},  C = (5/pi)^{-a} 2/Gamma(a)
#   second antiderivative G2(x) = x G1(x) + (C/4) int_rho^1 log(r) r^{p-1} (1-r)^{a-1} dr, rho = e^{-2x}, p = (3/2-a)/2,
#   G1(x) = (C/2) B(rho,1; p, a).   Cell integrals are exact second differences of K2 = sum c(n) n^{-1/2} G2(u - log n).
# The Rayleigh quotient of any vector is a lower bound for ||H_{a,L}|| (compression to the cell space).
import sys, math, json, time
import mpmath as mp
import numpy as np
mp.mp.dps = 30
a = mp.mpf(1)/4; l = mp.mpf(sys.argv[1]); n = int(sys.argv[2]); h = 2*l/n
kap = (mp.sqrt(10 - 2*mp.sqrt(5)) - 2)/(mp.sqrt(5) - 1)
b = [mp.mpf(0), mp.mpf(1), kap, -kap, mp.mpf(-1)]
N = int(mp.exp(2*l)) + 1
x = [mp.mpf(0)] + [b[k % 5]*mp.mpf(k)**a for k in range(1, N + 1)]
y = [mp.mpf(0)] + [b[k % 5]*mp.mpf(k)**(-a) for k in range(1, N + 1)]
inv = [mp.mpf(0)]*(N + 1); inv[1] = mp.mpf(1)
for d in range(1, N + 1):
    for k in range(2, N//d + 1):
        inv[d*k] -= inv[d]*y[k]
c = [mp.mpf(0)]*(N + 1)
for d in range(1, N + 1):
    for k in range(1, N//d + 1):
        c[d*k] += x[d]*inv[k]
C = (5/mp.pi)**(-a)*2/mp.gamma(a); p = (mp.mpf(3)/2 - a)/2
def G2(xx):
    if xx <= 0: return mp.mpf(0)
    rho = mp.exp(-2*xx)
    V = 1 - rho
    if V < mp.mpf(1)/4:
        # series in V = 1 - rho:  r^{p-1} = sum binom(p-1,k)(-V')^k ; log r = -sum V'^j/j
        K = 80
        cb = [mp.binomial(p - 1, k)*(-1)**k for k in range(K)]
        G1 = C/2*mp.fsum(cb[k]*V**(a + k)/(a + k) for k in range(K))
        lg = [mp.mpf(0)] + [-mp.mpf(1)/j for j in range(1, K)]
        prod = [mp.fsum(cb[i]*lg[k - i] for i in range(k + 1)) for k in range(K)]
        Ilog = mp.fsum(prod[k]*V**(a + k)/(a + k) for k in range(K))
    else:
        G1 = C/2*mp.betainc(p, a, rho, 1)
        Ilog = mp.quad(lambda r: mp.log(r)*r**(p - 1)*(1 - r)**(a - 1), [rho, (1 + rho)/2, 1])
    return xx*G1 + C/4*Ilog
t0 = time.time()
K2 = []
for k in range(0, 2*n + 1):
    u = -2*l + k*h
    s = mp.mpf(0)
    if u > 0:
        for m in range(1, N + 1):
            lm = mp.log(m)
            if lm >= u: break
            s += c[m]/mp.sqrt(m)*G2(u - lm)
    K2.append(s)
print('K2 table done', time.time() - t0, 's; N =', N, flush=True)
print('nan/inf in K2 at k:', [k for k, v in enumerate(K2) if mp.isnan(v) or mp.isinf(v)][:10], 'max', mp.nstr(max(abs(v) for v in K2), 6), flush=True)
D2 = [(K2[k + 2] - 2*K2[k + 1] + K2[k])/h for k in range(2*n - 1)]
Mf = np.array([[float(D2[i + j]) for j in range(n)] for i in range(n)])
print('Mf finite:', bool(np.isfinite(Mf).all()), 'max', float(np.abs(Mf).max()), flush=True)
ev, V = np.linalg.eigh(Mf)
res = {'l': float(l), 'L': float(mp.exp(l)), 'n_cells': n, 'h': float(h), 'N': N, 'float_lam_max': float(ev[-1]), 'float_lam_min': float(ev[0])}
for which, vec in (('max', V[:, -1]), ('min', V[:, 0])):
    xv = [mp.mpf(float(t)) for t in vec]
    num = mp.fsum(xv[i]*mp.fsum(D2[i + j]*xv[j] for j in range(n)) for i in range(n))
    den = mp.fsum(t*t for t in xv)
    res['rayleigh_' + which + '_mp'] = mp.nstr(num/den, 20)
sp = np.abs(np.fft.rfft(V[:, -1], 8*n)); res['top_vector_freq'] = float(2*math.pi*int(np.argmax(sp))/(8*n*float(h)))
print(json.dumps(res), flush=True)
json.dump(res, open('out/recheck_dh_l%s_n%d.json' % (sys.argv[1], n), 'w'))
