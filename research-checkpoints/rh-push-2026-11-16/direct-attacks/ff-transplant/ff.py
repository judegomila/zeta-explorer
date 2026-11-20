# Function-field analogue of the one-sided Weil form Q_L(v) and the real-node Pick matrix.
# Exact point counts by brute force; everything else mpmath. Single process, seconds.
import itertools, sys
from fractions import Fraction
import mpmath as mp
mp.mp.dps = 60

# ---------- F_{q^n} arithmetic (q prime) ----------
def polymulmod(a, b, mod, q):
    n = len(mod) - 1
    r = [0] * (2 * n - 1)
    for i, x in enumerate(a):
        if x:
            for j, y in enumerate(b):
                r[i + j] = (r[i + j] + x * y) % q
    for d in range(2 * n - 2, n - 1, -1):
        c = r[d]
        if c:
            for k in range(n + 1):
                r[d - n + k] = (r[d - n + k] - c * mod[k]) % q
    return tuple(r[:n])

def has_factor(mod, q):
    n = len(mod) - 1
    for d in range(1, n // 2 + 1):
        for lo in itertools.product(range(q), repeat=d):
            div = list(lo) + [1]
            rem = list(mod)
            for i in range(n, d - 1, -1):
                c = rem[i]
                if c:
                    for k in range(d + 1):
                        rem[i - d + k] = (rem[i - d + k] - c * div[k]) % q
            if not any(rem[:d]):
                return True
    return False

def irreducible(q, n):
    if n == 1:
        return [0, 1]
    for lo in itertools.product(range(q), repeat=n):
        mod = list(lo) + [1]
        if not has_factor(mod, q):
            return mod

def count_points(fcoef, q, n):
    """#C(F_{q^n}) for y^2 = f(x), deg f odd (one point at infinity), q odd prime."""
    mod = irreducible(q, n)
    elems = list(itertools.product(range(q), repeat=n))
    zero = tuple([0] * n)
    def mul(a, b):
        if n == 1:
            return ((a[0] * b[0]) % q,)
        return polymulmod(a, b, mod, q)
    squares = set(mul(e, e) for e in elems if e != zero)
    N = 1
    for x in elems:
        v = zero
        for c in reversed(fcoef):       # Horner
            v = mul(v, x)
            v = tuple((v[i] + (c if i == 0 else 0)) % q for i in range(n))
        if v == zero:
            N += 1
        elif v in squares:
            N += 2
    return N

def lpoly_from_counts(Ns, q, g):
    """P(T)=sum_k (-1)^k e_k T^k from N_1..N_g (Newton) + functional equation."""
    s = [None] + [Fraction(q**n + 1 - Ns[n - 1]) for n in range(1, g + 1)]
    e = [Fraction(1)]
    for k in range(1, g + 1):
        e.append(sum((-1) ** (i - 1) * e[k - i] * s[i] for i in range(1, k + 1)) / k)
    full = e + [None] * g
    for k in range(g):
        full[2 * g - k] = e[k] * q ** (g - k)
    return [(-1) ** k * full[k] for k in range(2 * g + 1)]   # coefficients of T^k

def roots_alpha(P):
    # P(T)=prod(1-alpha T): alphas are roots of reversed polynomial
    coeffs = [mp.mpf(c.numerator) / c.denominator for c in P]   # T^0..T^2g ; reversed poly in X has leading coeff P[0]
    return mp.polyroots(coeffs, maxsteps=500, extraprec=200)

def c_seq(z, nmax):
    return [mp.re(sum(zj ** n for zj in z)) for n in range(nmax + 1)]

def toeplitz(c, M):
    return mp.matrix(M, M, ) if False else mp.matrix([[c[abs(i - j)] for j in range(M)] for i in range(M)])

def eigs(A):
    E = mp.eigsy(A, eigvals_only=True)
    return sorted([E[i] for i in range(len(E))])

def verblunsky(c, K):
    """Levinson-Szego recursion on Toeplitz symbol c_0..c_K (real). Returns gammas and defects."""
    a = [mp.mpf(1)]
    E = c[0]
    gam, defect = [], [E]
    for k in range(1, K + 1):
        acc = sum(a[i] * c[k - i] for i in range(k))
        if abs(E) < mp.mpf(10) ** (-45):
            break
        gk = -acc / E
        a = [ (a[i] if i < k else 0) + gk * (a[k - i] if 0 <= k - i < k else 0) for i in range(k + 1)]
        E = E * (1 - gk ** 2)
        gam.append(gk); defect.append(E)
    return gam, defect

def H(u, z):
    return mp.re(sum((1 + u * zj) / (1 - u * zj) for zj in z)) / 2

def pick_disc(us, z):
    K = len(us); h = [H(u, z) for u in us]
    return mp.matrix([[(h[i] + h[k]) / (1 - us[i] * us[k]) for k in range(K)] for i in range(K)])

def pick_cont(xs, z, q):
    lq = mp.log(q); us = [mp.mpf(q) ** (-x) for x in xs]; h = [H(u, z) for u in us]
    K = len(xs)
    return mp.matrix([[lq * (h[i] + h[k]) / (xs[i] + xs[k]) for k in range(K)] for i in range(K)])

def report(name, q, g, P, Ns_check=None, fake=False):
    print("=" * 78); print(name, " q=%d g=%d" % (q, g))
    print(" P(T) coefficients:", [str(c) for c in P])
    al = roots_alpha(P)
    sq = mp.sqrt(q)
    z = [a / sq for a in al]
    print(" |alpha_j|/sqrt(q):", [mp.nstr(abs(zj), 12) for zj in z])
    print(" theta_j/pi      :", [mp.nstr(mp.arg(zj) / mp.pi, 10) for zj in z])
    if Ns_check:
        pred = [q**n + 1 - mp.re(sum(a**n for a in al)) for n in range(1, len(Ns_check) + 1)]
        print(" brute-force N_n:", Ns_check, " from P:", [mp.nstr(p, 12) for p in pred])
    nmax = 4 * g + 6
    c = c_seq(z, nmax)
    print(" c_n = q^{-n/2}(q^n+1-N_n), n=0..6:", [mp.nstr(x, 10) for x in c[:7]])
    for M in (2 * g, 2 * g + 1, 2 * g + 4):
        ev = eigs(toeplitz(c, M))
        rank = sum(1 for e in ev if abs(e) > mp.mpf(10) ** (-40))
        print("  Toeplitz size %2d: min eig %s  max eig %s  rank %d" % (M, mp.nstr(ev[0], 8), mp.nstr(ev[-1], 8), rank))
    gam, dfc = verblunsky(c, 2 * g + 1)
    print("  Verblunsky gamma_k:", [mp.nstr(x, 10) for x in gam])
    print("  Schur defects D_k :", [mp.nstr(x, 8) for x in dfc])
    # discrete and continuous Pick, real nodes in the unconditional domain u < q^{-1/2}  (x > 1/2)
    for K in (2 * g - 1, 2 * g, 2 * g + 2):
        xs = [mp.mpf('0.55') + mp.mpf(i) * mp.mpf('0.37') + mp.mpf(i * i) / 50 for i in range(K)]
        us = [mp.mpf(q) ** (-x) for x in xs]
        ed = eigs(pick_disc(us, z)); ec = eigs(pick_cont(xs, z, q))
        rd = sum(1 for e in ed if abs(e) > mp.mpf(10) ** (-45))
        print("  K=%2d nodes x>1/2: disc Pick min eig %s rank %d | cont Pick min eig %s" %
              (K, mp.nstr(ed[0], 6), rd, mp.nstr(ec[0], 6)))
    # three-way identity for Q_L(v): Pick form = prime/pole side = zero side
    xs = [mp.mpf(2), mp.mpf('2.7'), mp.mpf('3.5')]; b = [mp.mpf(1), mp.mpf('-2.5'), mp.mpf('1.5')]
    Pc = pick_cont(xs, z, q); lq = mp.log(q)
    Qpick = sum(b[i] * b[k] * Pc[i, k] for i in range(3) for k in range(3))
    nrm = sum(b[i] * b[k] / (xs[i] + xs[k]) for i in range(3) for k in range(3))
    def C(l): return sum(b[i] * b[k] * mp.e ** (-xs[i] * l) / (xs[i] + xs[k]) for i in range(3) for k in range(3))
    cc = c_seq(z, 400)
    Qprime = 2 * g * lq * nrm + 2 * lq * sum(cc[n] * C(n * lq) for n in range(1, 400))
    def V(w): return sum(b[i] / (w + xs[i]) for i in range(3))
    Qzero = 0
    for zj in z:
        base = -mp.log(zj) / lq     # u z_j = 1 <=> q^{-w} = 1/z_j <=> w = log z_j / log q ; zeros of F at w with q^{w}=z_j^{+-1}
        for k in range(-4000, 4001):
            w = mp.log(zj) / lq + 2j * mp.pi * k / lq
            Qzero += V(w) * V(-w)       # V real-coefficient: conj V(-conj w) = V(-w)
    print("  Q_L(v): Pick %s | genus+pole-prime side %s | zero side (|k|<=4000) %s" %
          (mp.nstr(Qpick, 14), mp.nstr(Qprime, 14), mp.nstr(mp.re(Qzero), 10)))
    # Hodge index: intersection matrix on H1,H2,Gamma_0..Gamma_M of C x C
    M = 2 * g + 2
    Nn = [None] + [q**n + 1 - mp.re(sum(a**n for a in al)) for n in range(1, M + 1)]
    dim = M + 3; I = mp.matrix(dim, dim)
    I[0, 1] = I[1, 0] = 1
    for m in range(M + 1):
        I[0, 2 + m] = I[2 + m, 0] = 1            # Gamma_m . ({pt} x C)
        I[1, 2 + m] = I[2 + m, 1] = q**m         # Gamma_m . (C x {pt})
        for n in range(M + 1):
            I[2 + m, 2 + n] = q**m * (2 - 2 * g) if m == n else q**min(m, n) * Nn[abs(m - n)]
    ev = eigs(I)
    tol = mp.mpf(10) ** (-30) * max(abs(ev[0]), abs(ev[-1]))
    print("  intersection form on <H1,H2,Gamma_0..Gamma_%d>: inertia (+,-,0) = (%d,%d,%d)" %
          (M, sum(1 for e in ev if e > tol), sum(1 for e in ev if e < -tol), sum(1 for e in ev if abs(e) <= tol)))
    # primitive part = -D Toeplitz D
    err = 0
    for m in range(M + 1):
        for n in range(M + 1):
            prim = I[2 + m, 2 + n] - q**m - q**n       # subtract d1 d2' + d2 d1'
            err = max(err, abs(prim + mp.sqrt(q) ** (m + n) * c[abs(m - n)]))
    print("  max |primitive(Gamma_m.Gamma_n) + q^{(m+n)/2} c_|m-n||| =", mp.nstr(err, 5))
    if g == 1:
        t = mp.re(al[0] + al[1])
        a0, a1 = mp.mpf(3), mp.mpf(-2)
        Qd = c[0] * (a0**2 + a1**2) + 2 * c[1] * a0 * a1
        deg = (a0**2 + a0 * (a1 / sq) * t + (a1 / sq) ** 2 * q)
        print("  genus 1: Q_disc(a)=%s, 2*deg(a0 + a1 q^{-1/2} F)=%s" % (mp.nstr(Qd, 12), mp.nstr(2 * deg, 12)))
    return z

if __name__ == "__main__":
    # genuine curves
    for name, f, q, g, nchk in [
        ("y^2=x^3+x+1", [1, 1, 0, 1], 5, 1, 4),
        ("y^2=x^3+3x+2", [2, 3, 0, 1], 7, 1, 3),
        ("y^2=x^5+x^2+1", [1, 0, 1, 0, 0, 1], 3, 2, 5),
        ("y^2=x^5+2x+1", [1, 2, 0, 0, 0, 1], 5, 2, 4),
    ]:
        Ns = [count_points(f, q, n) for n in range(1, nchk + 1)]
        P = lpoly_from_counts(Ns, q, g)
        report(name, q, g, P, Ns)
    # fakes (route-27 census / arith-surface Prop 4.2): Euler product with a_d>=0, FE, rational, RH false
    F = Fraction
    for name, P, q, g in [
        ("FAKE 1-5T+5T^2", [F(1), F(-5), F(5)], 5, 1),
        ("FAKE 1-T-3T^2-3T^3+9T^4", [F(1), F(-1), F(-3), F(-3), F(9)], 3, 2),
        ("FAKE 1-T+7T^2-3T^3+9T^4", [F(1), F(-1), F(7), F(-3), F(9)], 3, 2),
    ]:
        report(name, q, g, P, fake=True)
