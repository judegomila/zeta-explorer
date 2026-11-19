"""Exact arithmetic in Z[zeta_n], n = 6q, for the F_q[T] probe. Elements: lists of n Python ints (cyclic
representation, x = zeta_n); equality is tested after reduction modulo the cyclotomic polynomial Phi_n.
zeta_6 = x^q, zeta_q = x^6. No floating point enters any identity test."""
import subprocess, os, sys
from decimal import Decimal, getcontext
getcontext().prec = 70
def _pi():
    # Machin: pi = 16 atan(1/5) - 4 atan(1/239)
    def atan_inv(x):
        x = Decimal(x); t = 1 / x; s = t; x2 = x * x; k = 1; sign = -1
        while True:
            t = t / x2; term = t / (2 * k + 1)
            if abs(term) < Decimal(10) ** -68: break
            s += sign * term; sign = -sign; k += 1
        return s
    return 16 * atan_inv(5) - 4 * atan_inv(239)
PI = _pi()
def dcos(x):
    s = Decimal(1); t = Decimal(1); k = 0
    while True:
        k += 2; t = -t * x * x / (k * (k - 1)); s += t
        if abs(t) < Decimal(10) ** -68: break
    return s
HERE = os.path.dirname(os.path.abspath(__file__))

def polydivmod_exact(a, b):
    a = a[:]; db = len(b) - 1; out = [0] * max(1, len(a) - db)
    for i in range(len(a) - 1, db - 1, -1):
        f = a[i] // b[-1]; assert f * b[-1] == a[i]; out[i - db] = f
        if f:
            for j in range(db + 1): a[i - db + j] -= f * b[j]
    return out, a[:db]

def cyclotomic(n):
    num = [-1] + [0] * (n - 1) + [1]
    for d in range(1, n):
        if n % d == 0:
            num, r = polydivmod_exact(num, cyclotomic(d)); assert not any(r)
    while num[-1] == 0: num.pop()
    return num

class Ring:
    def __init__(s, q):
        s.q = q; s.n = 6 * q; s.phi = cyclotomic(s.n); s.deg = len(s.phi) - 1
        g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
        s.L6 = {}; x = 1
        for e in range(q - 1): s.L6[x] = e % 6; x = x * g % q
        s.cos = [dcos(2 * PI * i / s.n) for i in range(s.n)]
        s._G = {}; s._Gp = {}
    def zero(s): return [0] * s.n
    def one(s): r = s.zero(); r[0] = 1; return r
    def mono(s, a6, bq, c=1):
        r = s.zero(); r[(s.q * a6 + 6 * bq) % s.n] = c; return r
    def add(s, a, b): return [x + y for x, y in zip(a, b)]
    def scal(s, a, c): return [c * x for x in a]
    def mul(s, a, b):
        n = s.n; r = [0] * n
        for i, x in enumerate(a):
            if x:
                for j, y in enumerate(b):
                    if y: r[(i + j) % n] += x * y
        return r
    def conj(s, a): return [a[(-i) % s.n] for i in range(s.n)]
    def red(s, a):
        return tuple(polydivmod_exact(list(a) + [0] * (s.deg + 1), s.phi)[1])
    def eq(s, a, b): return s.red(a) == s.red(b)
    def realval(s, a):
        """real part of the complex embedding x -> exp(2 pi i/n), as a 70-digit Decimal (exact for real elements)"""
        return sum((c * s.cos[i] for i, c in enumerate(a) if c), Decimal(0))
    def abs2(s, a):
        """|a|^2 as Decimal, from the exact element a * conj(a)"""
        return s.realval(s.mul(a, s.conj(a)))
    def G(s, j):
        j %= 6
        if j not in s._G:
            r = s.zero()
            for a in range(1, s.q): r[(s.q * ((j * s.L6[a]) % 6) + 6 * a) % s.n] += 1
            s._G[j] = r
        return s._G[j]
    def Gpow(s, j, e):
        if (j, e) not in s._Gp:
            s._Gp[(j, e)] = s.one() if e == 0 else list(s.red(s.mul(s.Gpow(j, e - 1), s.G(j)))) + [0] * (s.n - s.deg)
        return s._Gp[(j, e)]
    def from_z6(s, h):
        r = s.zero()
        for a in range(6): r[(s.q * a) % s.n] += int(h[a])
        return r
    def keymono(s, key):
        r = s.one()
        for j in range(1, 6):
            e = (key >> (5 * (j - 1))) & 31
            if e: r = s.mul(r, s.Gpow(j, e))
        return r

# Z[zeta_6] helpers on 6-vectors: reduce to a + b*zeta (zeta^2 = zeta - 1)
def z6red(h):
    # zeta^0=1, zeta^1=z, zeta^2=z-1, zeta^3=-1, zeta^4=-z, zeta^5=1-z
    a = h[0] - h[2] - h[3] + h[5]; b = h[1] + h[2] - h[4] - h[5]; return (a, b)
def z6mul(x, y):
    a, b = x; c, d = y   # (a+bz)(c+dz) = ac + (ad+bc) z + bd (z-1)
    return (a * c - b * d, a * d + b * c + b * d)
def z6conj(x):
    a, b = x   # conj z = 1 - z
    return (a + b, -b)
def z6norm(x):
    a, b = x; return a * a + a * b + b * b
def z6to6(x):
    return [x[0], x[1], 0, 0, 0, 0]

def run(args, cache=True):
    """run ./ffx with args, cache stdout under cache/"""
    os.makedirs(os.path.join(HERE, 'cache'), exist_ok=True)
    fn = os.path.join(HERE, 'cache', '_'.join(str(a) for a in args) + '.txt')
    if cache and os.path.exists(fn): return open(fn).read()
    out = subprocess.run([os.path.join(HERE, 'ffx')] + [str(a) for a in args], capture_output=True, text=True, check=True).stdout
    if cache: open(fn + '.tmp', 'w').write(out); os.replace(fn + '.tmp', fn)
    return out

def load_ck(q, d, k):
    """dict m -> {key: z6 pair}"""
    res = {}
    for line in run(['ck', q, d, k]).split('\n'):
        if not line: continue
        t = [int(x) for x in line.split()]
        m, key = t[0], t[1]
        res.setdefault(m, {})
        cur = res[m].get(key, (0, 0)); z = z6red(t[2:8]); res[m][key] = (cur[0] + z[0], cur[1] + z[1])
    return res
def load_row(q, d, N, lam, mode, p1=0, p2=0, p3=0, p4=0):
    res = {}
    for line in run(['row', q, d, N, lam, mode, p1, p2, p3, p4]).split('\n'):
        if not line: continue
        t = [int(x) for x in line.split()]; res[t[0]] = z6red(t[1:7])
    return res
