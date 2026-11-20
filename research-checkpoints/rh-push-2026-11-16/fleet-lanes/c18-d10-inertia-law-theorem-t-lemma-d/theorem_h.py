# Theorem H (identity).  L(x, y) = [b(x) b(y) - b(-x) b(-y)] / (x + y)  (Bezoutian of b for the reflection u -> -u; a polynomial).
#   LL_plus (x, y) = L(x1, y1) L(x2, y2) b( x12) b( y12),     LL_minus(x, y) = L(x1, y1) L(x2, y2) b(-x12) b(-y12),   x12 = x1 + x2.
# Claim:  6 N(lam, mu) = sum over w, w' of sgn(w) sgn(w') [ LL_plus(w lam, w' mu) + 2 LL_minus(w lam, w' mu) ].
# Exact check on random rational points for random real b of degree 1..7 (Hurwitz and not). Also the two partial identities
#   antisym(LL_plus) = 2N + X,  antisym(LL_minus) = 2N - X/2,  X = antisym[ psi_*(x) psi_*(y) / (nu1 nu2) ],  psi_*(x) = b(-x1) b(-x2) b(x12).
import random, json
from lib import orbit, q, N as Nker, mkpsi
rng = random.Random(99)
def rq(): return q(rng.randint(-40, 40), rng.randint(1, 9))
def pt(den): return (q(rng.randint(1, 100), den[0]), q(rng.randint(1, 100), den[1]))
tot = bad = 0; rows = []
for n in range(1, 8):
    for rep in range(6):
        co = [rq() for _ in range(n)] + [q(1)]
        def b(u, co=co):
            r = q(0)
            for c in reversed(co): r = r*u + c
            return r
        def L(x, y): return (b(x)*b(y) - b(-x)*b(-y))/(x + y)
        def LLp(x, y): return L(x[0], y[0])*L(x[1], y[1])*b(x[0]+x[1])*b(y[0]+y[1])
        def LLm(x, y): return L(x[0], y[0])*L(x[1], y[1])*b(-x[0]-x[1])*b(-y[0]-y[1])
        psis = lambda x: b(-x[0])*b(-x[1])*b(x[0]+x[1])
        psi = mkpsi(b)
        for _ in range(4):
            lam, mu = pt((101, 103)), pt((107, 109))
            Nv = Nker(lam, mu, psi)
            Ap = sum((sx*sy*LLp(x, y) for (x, sx) in orbit(lam) for (y, sy) in orbit(mu)), q(0))
            Am = sum((sx*sy*LLm(x, y) for (x, sx) in orbit(lam) for (y, sy) in orbit(mu)), q(0))
            X = sum((sx*sy*psis(x)*psis(y)/((x[0]+y[0])*(x[1]+y[1])) for (x, sx) in orbit(lam) for (y, sy) in orbit(mu)), q(0))
            ok = (Ap + 2*Am == 6*Nv) and (Ap == 2*Nv + X) and (2*Am == 4*Nv - X)
            tot += 1; bad += (not ok)
    rows.append(dict(deg=n, checked=6*4))
print('identity checks', tot, 'failures', bad)
json.dump(dict(checks=tot, failures=bad), open('theorem_h.json', 'w'))
