"""Point values of the symmetric-square lift F = sym^2 f (f = first odd Maass form of SL2(Z), Hecke data from hejhal.py)
on SL3(Z)\\SL3(R)/SO(3), as a function of a positive ternary Gram matrix S (F(U S U^T) = F(S), F(cS) = F(S)).
Fourier-Whittaker expansion (recalled from Goldfeld, Automorphic forms and L-functions for GL(n,R), Thm 6.4.11):
  F(z) = sum_{gamma in U2(Z)\\SL2(Z)} sum_{m1>=1} sum_{m2!=0} A(m1,m2)/(m1|m2|) e(m1 x1' + m2 x2') W(m1 y1', |m2| y2'),
Whittaker function, Langlands parameters (nu,0,-nu), nu = 2iR (Vinogradov-Takhtajan form; its double Mellin transform
is the Gamma product of Bump/Stade, checked in RESULT.md):
  W(y1,y2) = y1 y2 int_R Kt(2 pi y1 sqrt(1+e^{2t})) Kt(2 pi y2 sqrt(1+e^{-2t})) dt,  Kt = exp(pi R) K_{2iR}.
float64; validation = invariance under SL3(Z) (measured). Not ball arithmetic."""
import math, json, os, sys, time, cmath
import numpy as np

HD = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ.get('HEJHAL', 'hejhal_odd1.json'))))
R = HD['R']; NU = 2*R
LAM = {int(k): v for k, v in HD['lam'].items()}
PMAX = max(LAM)
XMAX = 80.0; XMIN = 1e-4; NT = 600001
_LT = np.linspace(math.log(XMIN), math.log(XMAX), NT); _H = _LT[1]-_LT[0]

def build_ktable(path):
    from flint import acb, ctx
    ctx.prec = 120
    sc = (acb.pi()*R).exp(); nu = acb(0, NU)
    print("planned allocation: K table %d doubles (%.3f GB)" % (NT, NT*8/2**30), flush=True)
    tab = np.array([float((acb(math.exp(t)).bessel_k(nu)*sc).real.mid()) for t in _LT])
    np.save(path, tab); return tab

_kt = None
def ktab():
    global _kt
    if _kt is None:
        p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ktable_%s.npy' % os.environ.get('HEJHAL', 'hejhal_odd1.json').replace('.json', ''))
        _kt = np.load(p) if os.path.exists(p) else build_ktable(p)
    return _kt

def Kt(x):
    """vectorised exp(pi R) K_{2iR}(x), cubic Lagrange in log x; 0 beyond XMAX"""
    tab = ktab()
    x = np.asarray(x, dtype=float)
    big = x >= XMAX
    lx = np.log(np.clip(x, XMIN*1.001, XMAX*0.999))
    u = (lx - _LT[0])/_H
    i = np.clip(np.floor(u).astype(np.int64), 1, NT-3)
    s = u - i
    f0 = tab[i-1]; f1 = tab[i]; f2 = tab[i+1]; f3 = tab[i+2]
    out = (-s*(s-1)*(s-2)/6)*f0 + ((s+1)*(s-1)*(s-2)/2)*f1 + (-(s+1)*s*(s-2)/2)*f2 + ((s+1)*s*(s-1)/6)*f3
    out[big] = 0.0
    return out

def gexp(x):
    """lower bound for -log|Kt(x)| up to O(log): 0 for x <= nu, else sqrt(x^2-nu^2) - nu arccos(nu/x)"""
    x = np.asarray(x, dtype=float)
    xx = np.maximum(x, NU)
    return np.sqrt(xx*xx - NU*NU) - NU*np.arccos(NU/xx)

def W(Y1, Y2, nodes=360):
    Y1 = np.asarray(Y1, float); Y2 = np.asarray(Y2, float)
    out = np.zeros(len(Y1))
    thi = np.minimum(np.log(np.maximum(XMAX/(2*np.pi*Y1), 1.0000001)), 12.0)
    tlo = -np.minimum(np.log(np.maximum(XMAX/(2*np.pi*Y2), 1.0000001)), 12.0)
    CH = 20000
    for a in range(0, len(Y1), CH):
        sl = slice(a, a+CH)
        lo = tlo[sl][:, None]; hi = thi[sl][:, None]
        w = np.linspace(0, 1, nodes)[None, :]
        t = lo + (hi-lo)*w
        e2 = np.exp(2*t)
        v = Kt(2*np.pi*Y1[sl][:, None]*np.sqrt(1+e2)) * Kt(2*np.pi*Y2[sl][:, None]*np.sqrt(1+1/e2))
        h = ((hi-lo)/(nodes-1))[:, 0]
        out[sl] = (v.sum(axis=1) - 0.5*(v[:, 0]+v[:, -1]))*h
    return out*Y1*Y2

# ---- Hecke data of the lift
def schur(lam_p, a, b):
    al = (lam_p + cmath.sqrt(lam_p*lam_p - 4))/2
    be = [al*al, 1.0, 1/(al*al)]
    ex = [a+b+2, b+1, 0]
    num = np.linalg.det(np.array([[x**e for e in ex] for x in be], dtype=complex))
    den = np.linalg.det(np.array([[x**e for e in (2, 1, 0)] for x in be], dtype=complex))
    return (num/den).real

_A = {}
def A(m1, m2):
    key = (m1, m2)
    if key in _A: return _A[key]
    v = 1.0; x, y = m1, m2; p = 2
    while x > 1 or y > 1:
        if p > PMAX: raise KeyError("Hecke data needed at a prime > %d (m1=%d, m2=%d)" % (PMAX, m1, m2))
        a = b = 0
        while x % p == 0: x //= p; a += 1
        while y % p == 0: y //= p; b += 1
        if a or b: v *= schur(LAM[p], a, b)
        p += 1
        if x > 1 and y == 1 and x in LAM and p*p > x: v *= schur(LAM[x], 1, 0); x = 1
        if y > 1 and x == 1 and y in LAM and p*p > y: v *= schur(LAM[y], 0, 1); y = 1
    _A[key] = v
    return v

def coords(S):
    S = np.asarray(S, float)
    s33 = S[2, 2]
    x1 = S[1, 2]/s33; x3 = S[0, 2]/s33
    y1sq = S[1, 1]/s33 - x1*x1
    x2 = (S[0, 1]/s33 - x3*x1)/y1sq
    y2sq = (S[0, 0]/s33 - x3*x3)/y1sq - x2*x2
    return x1, x2, x3, math.sqrt(y1sq), math.sqrt(y2sq)

def egcd(a, b):
    if b == 0: return (1, 0, a)
    x, y, g = egcd(b, a % b)
    return (y, x - (a//b)*y, g)

def phi(S, E=30.0, stats=None):
    x1, x2, x3, y1, y2 = coords(S)
    z2 = complex(x2, y2)
    # single-factor cutoff: gexp(X1) = E
    X1 = NU
    while gexp(X1) < E: X1 += 0.25
    rmax = X1/(2*math.pi*y1)
    Y1l = []; Y2l = []; Cl = []
    capped = 0; m2max = 0
    cmaxi = int(rmax/y2) + 1
    tg = np.linspace(-7, 7, 57)
    sq1 = np.sqrt(1+np.exp(2*tg)); sq2 = np.sqrt(1+np.exp(-2*tg))
    for c in range(0, cmaxi+1):
        if c == 0: ds = [1]
        else:
            dc = -c*x2; rad2 = rmax*rmax - (c*y2)**2
            if rad2 < 0: continue
            rr = math.sqrt(rad2)
            ds = [d for d in range(math.ceil(dc-rr), math.floor(dc+rr)+1) if math.gcd(c, d) == 1]
        for d in ds:
            a_, b_, g = egcd(d, c)   # a_*d + b_*c = 1 -> gamma = [[a_, -b_],[c, d]]
            aa, bb = a_, -b_
            den = c*z2 + d
            r = abs(den)
            y1p = y1*r; y2p = y2/(r*r)
            x2p = ((aa*z2 + bb)/den).real
            x1p = c*x3 + d*x1
            m1 = np.arange(1, int(X1/(2*math.pi*y1p)) + 1)
            if len(m1) == 0: continue
            m2top = int(X1/(2*math.pi*y2p))
            if m2top < 1: continue
            m2 = np.arange(1, m2top+1)
            M1, M2 = np.meshgrid(m1, m2, indexing='ij')
            M1 = M1.ravel(); M2 = M2.ravel()
            Ya = M1*y1p; Yb = M2*y2p
            # prune with the u-grid exponent (slack 3)
            ex = (gexp(2*np.pi*Ya[:, None]*sq1[None, :]) + gexp(2*np.pi*Yb[:, None]*sq2[None, :])).min(axis=1)
            keep = ex < E + 3
            M1 = M1[keep]; M2 = M2[keep]; Ya = Ya[keep]; Yb = Yb[keep]
            if len(M1) == 0: continue
            m2max = max(m2max, int(M2.max()))
            try:
                co = np.array([A(int(u), int(v))/(u*v) for u, v in zip(M1, M2)])
            except KeyError:
                raise
            mult = 4.0   # +-gamma and +-m2
            Y1l.append(Ya); Y2l.append(Yb)
            Cl.append(mult*co*np.cos(2*np.pi*M1*x1p)*np.cos(2*np.pi*M2*x2p))
    if not Y1l:
        if stats is not None: stats.update(terms=0, m2max=0, y1=y1, y2=y2)
        return 0.0
    Y1a = np.concatenate(Y1l); Y2a = np.concatenate(Y2l); Ca = np.concatenate(Cl)
    val = float(np.sum(Ca*W(Y1a, Y2a)))
    if stats is not None: stats.update(terms=len(Ca), m2max=m2max, y1=y1, y2=y2)
    return val

def best_order(S):
    """permutation of the basis that maximises min(y1,y2)"""
    import itertools
    S = np.asarray(S, float); best = None
    for perm in itertools.permutations(range(3)):
        Sp = S[np.ix_(perm, perm)]
        _, _, _, y1, y2 = coords(Sp)
        if best is None or min(y1, y2) > best[0]: best = (min(y1, y2), perm)
    return best[1]

if __name__ == "__main__":
    import itertools
    ktab()
    # W symmetry and a few values
    print("W(1,1), W(1,2), W(2,1):", W([1.0, 1.0, 2.0], [1.0, 2.0, 1.0]))
    print("A(2,1) vs lam^2-1:", A(2, 1), LAM[2]**2-1, " A(2,2):", A(2, 2), " A(4,1):", A(4, 1), "A(1,6)=A(2,1)A(3,1):", A(1, 6), A(2, 1)*A(3, 1))
    tests = [np.array([[2., 1, 0], [1, 3, 1], [0, 1, 4]]), np.array([[2., 0.3, 0.7], [0.3, 2.9, -0.4], [0.7, -0.4, 3.7]])]
    for S in tests:
        for E in (22.0, 30.0):
            vals = []
            for perm in itertools.permutations(range(3)):
                st = {}
                t0 = time.time()
                try:
                    v = phi(S[np.ix_(perm, perm)], E, st)
                    vals.append(v)
                    print(perm, "E", E, "phi =", repr(v), st, "%.1fs" % (time.time()-t0), flush=True)
                except KeyError as e:
                    print(perm, "E", E, "needs more Hecke data:", e, flush=True)
