# Conic identity check (double precision). Om(x) = exp(-pi x^2), m over all integers, d = 2,
# c odd squarefree prime to 2d, w(c/Z) = bump on (1,2).
#   I = sum_m Om(m/Q) sum_c c^{-s} w(c/Z) ((m^2-d)/c)
#     = Q sum_c mu(c) c^{-1-s} w(c/Z)  +  Q sum_{h != 0} sum_c c^{-1-s} w(c/Z) exp(-pi (hQ/c)^2) K(1, h^2 d/4; c)
# Largest array: 14*Q integers (< 1 MB).
import numpy as np, json
from math import gcd, exp, pi
d = 2
def factor(n):
    f = []; q = 2
    while q*q <= n:
        while n % q == 0: f.append(q); n //= q
        q += 1
    if n > 1: f.append(n)
    return f
def leg_table(p):
    t = -np.ones(p, dtype=np.int64); t[(np.arange(p, dtype=np.int64)**2) % p] = 1; t[0] = 0; return t
def w(x): return exp(-1.0/((x-1)*(2-x))) if 1 < x < 2 else 0.0
def kloos(b, c):
    x = np.array([x for x in range(1, c) if gcd(x, c) == 1], dtype=np.int64)
    xi = np.array([pow(int(v), -1, c) for v in x], dtype=np.int64)
    return np.exp(2j*np.pi*((x + b*xi) % c)/c).sum().real
out = []
for (Q, Z, s) in [(1000, 100, 0.5+2j), (1000, 100, 0.25+7j), (40, 100, 0.5+2j), (25, 150, 0.5+2j), (25, 150, 0.1+5j)]:
    m = np.arange(-7*Q, 7*Q+1, dtype=np.int64); Om = np.exp(-np.pi*(m/Q)**2)
    lhs = 0; f0 = 0; nz = 0
    for c in range(Z+1, 2*Z):
        f = factor(c)
        if c % 2 == 0 or len(set(f)) != len(f) or gcd(c, 2*d) != 1: continue
        wt = w(c/Z)*c**(-s)
        jac = np.ones(len(m), dtype=np.int64)
        for q in f: jac *= leg_table(q)[(m*m - d) % q]
        lhs += wt*(Om*jac).sum()
        f0 += Q*wt/c*(-1)**len(f)
        i4 = pow(4, -1, c); H = int(8*c/Q) + 2
        for h in range(1, H+1):
            g = exp(-pi*(h*Q/c)**2)
            if g < 1e-18: break
            nz += 2*Q*wt/c*g*kloos((h*h*d*i4) % c, c)
    r = dict(Q=Q, Z=Z, s=str(s), lhs=abs(lhs), freq0=abs(f0), nonzero=abs(nz), residual=abs(lhs-f0-nz),
             trivial=Q*Z**(1-s.real))
    out.append(r); print(json.dumps(r))
json.dump(out, open("test2.json", "w"), indent=1)
