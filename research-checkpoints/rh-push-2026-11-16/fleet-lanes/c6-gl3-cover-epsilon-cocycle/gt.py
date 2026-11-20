"""c6-gl3-cover-epsilon-cocycle: p-parts of metaplectic Whittaker functions on the n-fold cover of GL(3)
from strict Gelfand-Tsetlin patterns (Brubaker-Bump-Friedberg Gamma description, recalled; validated here by
Tokuyama's identity at n = 1 and by the A_1 Shimura relation at n = 2).
Exact arithmetic (sympy). Largest object: a few thousand patterns per shape; memory < 200 MB."""
import sympy as sp, itertools, sys, json
q, r, T, X, Y, u = sp.symbols('q r T X Y u')   # r = sqrt(q); T = tau/sqrt(q), T^2 = eps = chi(-1)

def gauss(a, n):
    """g(a) = g(p^(a-1), p^a) = q^(a-1) * tau_a ; tau_0 = -1, tau_1 = T*r (n=2)."""
    if n == 1: return -q**(a-1)
    if n == 2: return -q**(a-1) if a % 2 == 0 else q**(a-1)*T*r
    raise ValueError
def hh(a, n):
    return (q-1)*q**(a-1) if a % n == 0 else 0

def patterns(top):
    a00, a01, a02 = top
    for a11 in range(a01, a00+1):
        for a12 in range(a02, a01+1):
            if a11 == a12: continue
            for a22 in range(a12, a11+1):
                yield (a11, a12, a22)

def weight(top, pat, n):
    a00, a01, a02 = top; a11, a12, a22 = pat
    ents = [  # (Gamma, boxed, circled)
        ((a11-a01)+(a12-a02), a11 == a00, a11 == a01),
        ((a12-a02),           a12 == a01, a12 == a02),
        ((a22-a12),           a22 == a11, a22 == a12)]
    w = 1
    for G, b, c in ents:
        if b and c: return 0
        if c: w *= q**G
        elif b: w *= gauss(G, n)
        else:
            h = hh(G, n)
            if h == 0: return 0
            w *= h
    return w

def ppart(l1, l2, n):
    """dict (k1,k2) -> coefficient H(p^k1,p^k2; p^l1,p^l2) in Z[q, r, T]."""
    top = (l1+l2+2, l2+1, 0)
    out = {}
    for pat in patterns(top):
        w = weight(top, pat, n)
        if w == 0: continue
        a11, a12, a22 = pat
        k = ((a11-top[1])+(a12-top[2]), a22-top[2])
        out[k] = out.get(k, 0) + w
    return {k: sp.expand(v) for k, v in out.items() if sp.expand(v) != 0}

def red(e, eps):
    e = sp.expand(e)
    e = sp.Poly(e, T).as_expr() if e.has(T) else e
    # reduce T^2 -> eps, q -> r^2
    e = sp.expand(e.subs(q, r**2))
    p = sp.Poly(e, T)
    res = 0
    for (d,), c in p.terms():
        res += c * (eps**(d//2)) * T**(d % 2)
    return sp.expand(res)

if __name__ == '__main__':
    log = {}
    # --- check 1: Tokuyama at n = 1 ---------------------------------------------------------------
    z1, z2, z3 = sp.symbols('z1 z2 z3')
    def schur(lam):
        num = sp.Matrix(3, 3, lambda i, j: [z1, z2, z3][i]**(lam[j]+2-j)).det()
        den = sp.Matrix(3, 3, lambda i, j: [z1, z2, z3][i]**(2-j)).det()
        return sp.cancel(num/den)
    ok = True
    for l1, l2 in itertools.product(range(4), repeat=2):
        H = ppart(l1, l2, 1)
        # x1 = z2/z1 /q-normalised: monomial x^k1 y^k2 ; weight of pattern = lowest weight shifted
        P = sum(c * X**k[0] * Y**k[1] for k, c in H.items())
        # prediction: prod_{alpha>0}(1 - q^{-1} e^{alpha}) s_lambda, in variables x = q*z?/z? ; find by test
        lam = (l1+l2, l2, 0)
        pred = schur(lam) * (1 - z2/z1/q) * (1 - z3/z2/q) * (1 - z3/z1/q)
        # highest-weight monomial z^lam <-> k = 0 ; x <-> q*z2/z1 , y <-> q*z3/z2
        cand = sp.cancel(P.subs({X: z2/z1/q, Y: z3/z2/q}, simultaneous=True) * z1**lam[0]*z2**lam[1]*z3**lam[2] - pred)
        if cand != 0: ok = False; print('Tokuyama FAIL', l1, l2); break
    print('check 1 (Tokuyama, n=1, 16 shapes l1,l2<4):', 'PASS' if ok else 'FAIL'); log['tokuyama'] = ok
    # --- n = 2 table --------------------------------------------------------------------------------
    L = int(sys.argv[1]) if len(sys.argv) > 1 else 9
    tab = {}
    for l1 in range(0, 4):
        for l2 in range(0, L+1):
            H = ppart(l1, l2, 2)
            tab[(l1, l2)] = H
    # print base shapes
    for lam in [(0,0),(1,0),(0,1),(1,1),(2,0),(0,2)]:
        P = sum(c * X**k[0] * Y**k[1] for k, c in tab[lam].items())
        print('n=2 H_', lam, '=', sp.factor(sp.expand(P.subs(q, r**2))))
    import pickle
    pickle.dump({k: {kk: str(v) for kk, v in H.items()} for k, H in tab.items()}, open('table_n2.pkl', 'wb'))
