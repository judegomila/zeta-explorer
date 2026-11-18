# Shared helpers: fundamental discriminants, Kronecker characters in python-flint, L-values.
import flint, math
from flint import acb, arb, fmpz

def kron(D, n):
    return int(fmpz(D).jacobi(n)) if False else _kron(D, n)

def _kron(a, n):
    # Kronecker symbol (a/n), n >= 1
    if n == 0: return 1 if abs(a) == 1 else 0
    r = 1
    v = 0
    while n % 2 == 0:
        n //= 2; v += 1
    if v:
        if a % 2 == 0: return 0
        if v % 2 and a % 8 in (3, 5): r = -r
    # Jacobi (a/n), n odd positive
    a %= n
    while a:
        while a % 2 == 0:
            a //= 2
            if n % 8 in (3, 5): r = -r
        a, n = n, a
        if a % 4 == 3 and n % 4 == 3: r = -r
        a %= n
    return r if n == 1 else 0

def squarefree(n):
    p = 2
    while p * p <= n:
        if n % (p * p) == 0: return False
        p += 1
    return True

def is_fund(D):
    if D % 4 == 1: return squarefree(abs(D)) and D != 1
    if D % 4 == 0:
        m = D // 4
        return m % 4 in (2, 3) and squarefree(abs(m))
    return False

def neg_fund(X):
    return [-d for d in range(3, X + 1) if is_fund(-d)]

def class_number(D):
    # reduced forms count, D<0
    h = 0
    b = D % 2
    B = int(math.isqrt(abs(D) // 3))
    while b <= B:
        q = (b * b - D) // 4
        a = max(b, 1)
        while a * a <= q:
            if q % a == 0:
                h += 1 if (a == b or a * a == q or b == 0) else 2
            a += 1
        b += 2
    return h

def conrey_index(D):
    """Conrey index n with chi_q(n,.) = Kronecker (D/.), q=|D|."""
    q = abs(D)
    for n in range(1, q):
        if math.gcd(n, q) != 1: continue
        c = flint.dirichlet_char(q, n)
        if not c.is_real() if hasattr(c, 'is_real') else False: continue
        ok = True
        for m in range(1, min(q, 60) + 1):
            if math.gcd(m, q) != 1: continue
            v = c.chi(m) if hasattr(c, 'chi') else c(m)
            if abs(complex(v) - _kron(D, m)) > 1e-9: ok = False; break
        if ok: return n
    raise ValueError(D)

_chars = {}
def chi(D):
    if D not in _chars:
        _chars[D] = flint.dirichlet_char(abs(D), conrey_index(D))
    return _chars[D]

def L(D, s):
    return chi(D).l(s)

def wD(D):
    return 6 if D == -3 else 4 if D == -4 else 2
