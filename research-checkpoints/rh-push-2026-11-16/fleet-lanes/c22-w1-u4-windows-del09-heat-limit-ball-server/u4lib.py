# Shared definitions for the U4 band form (objects fixed in PREREG.md). Float parts are screens only.
import math, hashlib, json
import numpy as np
THETA = 0.75; K = 6
def sieve(N):
    s = bytearray([1])*(N+1); s[0] = s[1] = 0
    for i in range(2, int(N**0.5)+1):
        if s[i]: s[i*i::i] = bytearray(len(s[i*i::i]))
    return [i for i in range(N+1) if s[i]]
def greedy(PR, b, half):
    """round-21 rule, unchanged (float64 midpoint rule, 8 nodes per gap)."""
    Lval = 0.0; prev = 2.0; c = 0; S = set()
    def seg(x0, x1, n=8):
        h = (x1-x0)/n; return sum(((x0+(i+.5)*h)**(b-1))/math.log(x0+(i+.5)*h) for i in range(n))*h
    for p in PR[1:]:
        Lval += seg(prev, float(p)); prev = float(p)
        tgt = math.floor(Lval/2) if half else math.floor(Lval)
        if tgt > c: c += 1; S.add(p)
    return S
FAMS = {'DEL b=0.55': (0.55, False, 0), 'DEL b=0.75': (0.75, False, 0), 'DEL b=0.9': (0.9, False, 0), 'THIN b=0.75': (0.75, True, -1)}
def make_sets(PR):
    return {nm: (greedy(PR, b, half), sg) for nm, (b, half, sg) in FAMS.items()}
def sets_record(SETS):
    rec = {}
    for nm, (S, sg) in SETS.items():
        L = sorted(S)
        rec[nm] = dict(size=len(L), first=L[:10], last=L[-3:], sha256=hashlib.sha256((','.join(map(str, L))).encode()).hexdigest())
    return rec
def errK(t, P, nprime):
    Lg = math.log(t/(2*math.pi)); u = math.log(P); eps = 16*math.log(t)/t*nprime
    EM = eps*(2*Lg + 4.2*math.sqrt(P)) + eps**2 + 10*Lg/t**2
    E0 = 16*(math.log(t)/t)*(3*Lg + 4.2*math.sqrt(P)) + 4*u*math.sqrt(P)*t**-2*Lg*nprime
    return (EM + E0*nprime)/Lg
def overlaps_np(a, u):
    a = np.asarray(a, dtype=float)[:, None, None]
    j = np.arange(1, K+1)[None, :, None]*math.pi/u; k = np.arange(1, K+1)[None, None, :]*math.pi/u
    dm = j - k; dp = j + k
    safe = np.where(np.abs(dm) > 1e-14, dm, 1.0)
    t1 = np.where(np.abs(dm) > 1e-14, (np.sin(dm*u + k*a) - np.sin(dm*a + k*a))/safe, (u - a)*np.cos(k*a))
    t2 = (np.sin(dp*u - k*a) - np.sin(dp*a - k*a))/dp
    return np.where(a < u, (t1 - t2)/u, 0.0)
def prime_powers(PR, PMAX):
    """all n = p^m <= PMAX sorted by n: arrays n, p, m."""
    out = []
    for p in PR:
        if p > PMAX: break
        n = p; m = 1
        while n <= PMAX: out.append((n, p, m)); n *= p; m += 1
    out.sort()
    A = np.array(out, dtype=np.int64)
    return A[:, 0], A[:, 1], A[:, 2]
def phases(t, ln_ld):
    """e^(-i t log n) with the product reduced mod 2 pi in long double (x86: 64-bit mantissa)."""
    x = np.longdouble(t)*ln_ld
    twopi = 2*np.pi*np.longdouble(1) if False else np.longdouble('6.283185307179586476925286766559005768')
    x = x - np.floor(x/twopi)*twopi
    x = x.astype(np.float64)
    return np.cos(x) - 1j*np.sin(x)
def weights(nn, pp, mm, SETS):
    base = np.log(pp.astype(float))/np.sqrt(nn.astype(float))
    W = {'zeta': base.copy()}
    for nm, (S, sg) in SETS.items():
        inS = np.isin(pp, np.fromiter(S, dtype=np.int64, count=len(S)))
        f = np.where(inS, 0.0 if sg == 0 else (-1.0)**mm, 1.0)
        W[nm] = base*f
    return W
