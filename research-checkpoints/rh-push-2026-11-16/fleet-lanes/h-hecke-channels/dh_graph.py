# Davenport-Heilbronn as a non-eigen vertex of a two-vertex Hecke graph.
from mpmath import *
mp.dps = 30
xi_ = (sqrt(10-2*sqrt(5))-2)/(sqrt(5)-1)
a = [0, 1, xi_, -xi_, -1]          # DH coefficients, period 5 (index n mod 5)
b = [0, xi_, -1, 1, -xi_]          # partner g: b_n = a_{2n}
def per(c, s): return sum(c[r]*zeta(s, mpf(r)/5) for r in range(1, 5))/mpf(5)**s
f = lambda s: per(a, s); g = lambda s: per(b, s)
Lam = lambda F, s: (5/pi)**(s/2)*gamma((s+1)/2)*F(s)
s = mpc(0.3, 7.7)
print("FE f: |Lam_f(s)-Lam_f(1-s)|/|Lam_f| =", nstr(abs(Lam(f, s)-Lam(f, 1-s))/abs(Lam(f, s)), 3))
print("FE g: |Lam_g(s)+Lam_g(1-s)|/|Lam_g| =", nstr(abs(Lam(g, s)+Lam(g, 1-s))/abs(Lam(g, s)), 3), "  g(1/2) =", nstr(g(mpf(1)/2), 3))
print("coefficient action of U_p: a_{pn} in terms of (a_n, b_n)")
for p in [2, 3, 7, 11, 13, 17, 19, 29, 31]:
    ap = [a[(p*n) % 5] for n in range(5)]; bp = [b[(p*n) % 5] for n in range(5)]
    def coef(v):
        for (al, be, name) in [(1, 0, "+a"), (-1, 0, "-a"), (0, 1, "+b"), (0, -1, "-b")]:
            if all(abs(v[n]-al*a[n]-be*b[n]) < 1e-25 for n in range(5)): return name
        return "?"
    print("  p=%2d (mod 5 = %d):  a_{pn} = %s_n,  b_{pn} = %s_n" % (p, p % 5, coef(ap), coef(bp)))
# Euler-factor relation as functions: sum over n coprime to p
for p in [2, 3, 11, 19]:
    s = mpc(1.6, 2.3)
    direct = nsum(lambda n: 0 if int(n) % p == 0 else a[int(n) % 5]*mpf(n)**(-s), [1, inf]) if False else None
    ap = [a[(p*n) % 5] for n in range(5)]
    fp = per(ap, s)                # sum a_{pn} n^-s
    eig = {1: f(s), 4: -f(s), 2: g(s), 3: -g(s)}[p % 5]
    print("  p=%2d: |sum_n a_{pn} n^-s - predicted| =" % p, nstr(abs(fp-eig), 3))
# DH off-line zero and what the partner does there
r = findroot(f, mpc(0.808517, 85.699348))
print("DH zero", nstr(r, 15), " |g(rho)| =", nstr(abs(g(r)), 6), " |f(1-conj rho)|", nstr(abs(f(1-conj(r))), 3))
