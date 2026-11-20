# Checks: (A) Euler-local identity; (B) SOS-with-defect is algebra (no check); (F) PF tests: Pick double divided
# difference vs zero sum, zeta.
import mpmath as mp, random
mp.mp.dps = 40
def L(p):
    s = mp.mpf(1)/2 + p
    return 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
# ---- (A)
x = [mp.mpf('0.8'), mp.mpf('1.7'), mp.mpf('3.1')]; b = [mp.mpf(1), mp.mpf('-2.5'), mp.mpf('1.2')]
ip = lambda c, d, sh=0: sum(c[i]*d[j]*mp.exp(-(x[i]+x[j])*sh)/(x[i]+x[j]) for i in range(3) for j in range(3))
print("(A) per-prime: 2<T_p v,v>  vs  log p (||w||^2 - ||U w||^2 - ||v||^2)")
tot = 0
for p in [2, 3, 5, 7, 101]:
    lp = mp.log(p)
    t = [p**(-mp.mpf(1)/2 - xi)/(1 - p**(-mp.mpf(1)/2 - xi)) for xi in x]      # sum_k p^{-k(1/2+x)}
    lhs = 2*lp*sum(b[i]*b[j]*t[i]/(x[i]+x[j]) for i in range(3) for j in range(3))
    w = [b[i]/(1 - p**(-mp.mpf(1)/2 - x[i])) for i in range(3)]
    rhs = lp*(ip(w, w) - ip(w, w, lp)/p - ip(b, b))   # ||U w||^2 = p^{-1} int_{log p}^inf |w|^2
    print("  p=%d" % p, mp.nstr(lhs, 20), mp.nstr(rhs, 20), mp.nstr(lhs-rhs, 3))
# full: Q_L = 2 Re <L(D) v, v>
QL = sum(b[i]*b[j]*(L(x[i])+L(x[j]))/(x[i]+x[j]) for i in range(3) for j in range(3))
QD = 2*sum(b[i]*b[j]*L(x[i])/(x[i]+x[j]) for i in range(3) for j in range(3))
print("  Q_L Pick =", mp.nstr(QL, 20), " 2<L(D)v,v> =", mp.nstr(QD, 20))
# ---- (F) PF tests
zs = [mp.im(mp.zetazero(k)) for k in range(1, 201)]
def pf_test(a, dps):
    mp.mp.dps = dps
    a = [mp.mpf(t) for t in a]; M = len(a)
    bb = [1/mp.fprod([a[k]-a[j] for k in range(M) if k != j]) for j in range(M)]
    Lx = [L(t) for t in a]
    Q = sum(bb[i]*bb[j]*(Lx[i]+Lx[j])/(a[i]+a[j]) for i in range(M) for j in range(M))
    V = lambda z: 1/mp.fprod([z+t for t in a])
    Z = sum(2*abs(V(1j*g))**2 for g in zs)
    first = 2*abs(V(1j*zs[0]))**2
    mp.mp.dps = 40
    return Q, Z, first
random.seed(7)
print("(F) PF tests V = prod 1/(z+a_j): Pick double divided difference, zero sum (200 zeros), first-zero term")
for (M, lo, hi, dps) in [(2, .6, 3, 60), (4, .6, 3, 80), (8, .6, 6, 140), (16, .55, 4, 260), (24, 1, 40, 300), (32, .51, 2, 500), (40, 5, 60, 420)]:
    a = sorted(random.uniform(lo, hi) for _ in range(M))
    Q, Z, f1 = pf_test([repr(t) for t in a], dps)
    print("  M=%2d nodes in [%.2f,%.2f]: Q=%s  zerosum=%s  rel diff=%s  Q/first=%s" % (M, lo, hi, mp.nstr(Q, 12), mp.nstr(Z, 12), mp.nstr((Q-Z)/Q, 3), mp.nstr(Q/f1, 8)))
