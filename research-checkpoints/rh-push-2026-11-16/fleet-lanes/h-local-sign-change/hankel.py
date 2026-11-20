# Stieltjes moment pair along the family. Xi_c(s) = F0(sqrt s) * g(sqrt s), g(x) = 2cosh(x log q) + c.
# M = Xi_c'/Xi_c = sum_k (-1)^k mu_k s^k,  mu_k = sum over zero pairs of lambda^{-k-1}, lambda = -rho^2.
# H0 = [mu_{i+j}], H1 = [mu_{i+j+1}]; report first order with a negative leading principal minor.
import mpmath as mp, json, sys
mp.mp.dps = 260
q = int(sys.argv[1]); lq = mp.log(q); KMAX = 12
NT = 2*KMAX + 4                       # number of s-coefficients needed
half = mp.mpf(1)/2
def xi(s): return half*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
# Taylor coefficients of F0(x) = xi(1/2+x) by the trapezoid rule on |x| = r (entire function; aliasing ~ a_{n+N} r^N)
N = 256; r = mp.mpf(3)
print('planned: %d zeta evaluations at %d digits; arrays of length %d' % (N//2+1, mp.mp.dps, N), flush=True)
vals = [None]*N
for k in range(N//2+1):
    v = xi(half + r*mp.expjpi(mp.mpf(2*k)/N)); vals[k] = v
    if 0 < k < N//2: vals[N-k] = mp.conj(v)
def coef(n): return mp.re(sum(vals[k]*mp.expjpi(-mp.mpf(2*k*n)/N) for k in range(N)))/N/r**n
a0 = [coef(2*k) for k in range(NT+1)]           # Xi(s) = sum a0[k] s^k
print('odd coefficient check a_1, a_3:', mp.nstr(coef(1), 5), mp.nstr(coef(3), 5), flush=True)
def mul(a, b): return [sum(a[i]*b[k-i] for i in range(k+1)) for k in range(NT+1)]
def logder(a):                                   # coefficients of a'/a
    d = [(k+1)*a[k+1] for k in range(NT)]
    m = []
    for k in range(NT):
        m.append((d[k] - sum(m[i]*a[k-i] for i in range(k)))/a[0])
    return m
def mus(a): 
    m = logder(a); return [(-1)**k*m[k] for k in range(NT)]
def first_neg(mu, shift):
    K = KMAX
    H = mp.matrix(K, K)
    for i in range(K):
        for j in range(K): H[i,j] = mu[i+j+shift]
    piv = []
    # LDL without pivoting: pivots = ratios of leading principal minors
    A = H.copy()
    for k in range(K):
        p = A[k,k]; piv.append(p)
        if p == 0: break
        for i in range(k+1, K):
            f = A[i,k]/p
            for j in range(k, K): A[i,j] -= f*A[k,j]
    neg = [k+1 for k, p in enumerate(piv) if p < 0]
    return (neg[0] if neg else None), neg
mu_z = mus(a0)
print('mu_0(zeta) =', mp.nstr(mu_z[0], 25), ' mu_1 =', mp.nstr(mu_z[1], 20), flush=True)
print('zeta alone: H0', first_neg(mu_z, 0), 'H1', first_neg(mu_z, 1), flush=True)
CG = sorted(set([mp.mpf(k)/8 for k in range(-24, 25)] + [mp.mpf(s) for s in
     ('-2.01','-2.001','-1.999','-1.99','1.99','1.999','2.0001','2.001','2.01','2.02','2.05')]))
rows = []
for c in CG:
    if c == -2: 
        rows.append({'c': -2.0, 'note': 'zero at s = 0 (lambda = 0): moments undefined'}); continue
    g = [2*lq**(2*k)/mp.factorial(2*k) + (c if k == 0 else 0) for k in range(NT+1)]
    mu_s = mus(g); mu_f = mus(mul(a0, g))
    add = max(abs(mu_f[k] - mu_z[k] - mu_s[k])/abs(mu_f[k]) for k in range(NT))
    r0, n0 = first_neg(mu_f, 0); r1, n1 = first_neg(mu_f, 1)
    s0, m0 = first_neg(mu_s, 0); s1, m1 = first_neg(mu_s, 1)
    row = {'c': float(c), 'mu0_full': mp.nstr(mu_f[0], 12), 'mu0_symbol': mp.nstr(mu_s[0], 12),
           'full_K0': r0, 'full_K1': r1, 'full_neg_H0': n0, 'full_neg_H1': n1,
           'symbol_K0': s0, 'symbol_K1': s1, 'additivity_err': mp.nstr(add, 3)}
    rows.append(row); print(row, flush=True)
json.dump({'q': q, 'KMAX': KMAX, 'mu_zeta': [mp.nstr(m, 30) for m in mu_z[:6]], 'rows': rows}, open(sys.argv[2], 'w'), indent=1)
