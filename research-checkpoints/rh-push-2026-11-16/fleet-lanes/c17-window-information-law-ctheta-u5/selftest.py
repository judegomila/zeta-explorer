"""Checks: (1) one-pair closed form; (2) criterion against a direct discretisation of T on L^2[-u/2,u/2] (float);
(3) inertia of the cluster form (n negative eigenvalues)."""
import math, numpy as np
from flint import arb, acb, ctx
import wil
ctx.prec = 512
# (1) one pair, tight background c*u (use tolerance-only device with 2M = c u)
for c in (2.0, 1.0, 0.1):
    u = 1.0
    dev = wil.Device(u, None, c * u / 2); dev.X = None; dev.o_pts = []
    A, note = wil.threshold(lambda A: dev.test([(0.0, A)]), 1e-3, 20.0, steps=40)
    # closed form root
    lo, hi = 1e-6, 20.0
    for _ in range(100):
        m = (lo + hi) / 2
        if math.sinh(m) / m <= 1 + c: lo = m
        else: hi = m
    print("one pair c=%g: threshold %.9f closed form %.9f" % (c, A, lo))
# (2) direct discretisation
def direct(u, Lg, M, plus, minus, pairs, removed, N=2640):
    """Midpoint grid of N points on [-u/2, u/2] with Lg an integer number of steps: the lattice operator
    Lg * (sum of shifts by m Lg) is exact on the grid; finite-rank parts by the midpoint rule."""
    dl = u / N
    sh = Lg / dl
    assert abs(sh - round(sh)) < 1e-9, sh
    sh = int(round(sh))
    s = -u / 2 + dl * (np.arange(N) + 0.5)
    sw = math.sqrt(dl)
    def proj(z):
        return np.exp(1j * s * z) * sw
    T = 2 * M * np.eye(N, dtype=complex)
    m = 0
    while m * sh < N:
        if m == 0:
            T += Lg * np.eye(N)
        else:
            T += Lg * (np.eye(N, k=m * sh) + np.eye(N, k=-m * sh))
        m += 1
    for l in minus:
        a = proj(l); T -= np.outer(a, a.conj())
    for g in plus:
        if g not in removed:
            a = proj(g); T += np.outer(a, a.conj())
    for (xx, b) in pairs:
        a, ab = proj(xx + 1j * b), proj(xx - 1j * b)
        T += np.outer(a, ab.conj()) + np.outer(ab, a.conj())
    T = (T + T.conj().T) / 2
    return np.linalg.eigvalsh(T)[0]
rng = np.random.default_rng(1)
for (u, Lg, M) in ((6.0, 9.0, 0.0), (6.0, 9.0, 0.5), (11.0, 9.0, 0.5), (20.0, 9.0, 0.5)):
    d = 2 * math.pi / Lg
    plus = sorted((rng.uniform(-3, 3, 8)).tolist()); minus = [j * d for j in range(-4, 4)]
    dev = wil.Device(u, Lg, M); dev.set_online(plus, minus)
    for pairs, removed in (([(0.13, 0.2)], []), ([(0.13, 0.5)], []), ([(0.13, 0.05)], []), ([(0.1, 0.3), (0.5, 0.25), (-0.4, 0.1)], [plus[3]]), ([(0.13, 0.02)], [])):
        v = dev.test(pairs, removed)
        lam = direct(u, Lg, M, plus, minus, pairs, set(removed))
        lam0 = direct(u, Lg, M, plus, minus, [], set())
        print("u=%g Lg=%g M=%g pairs=%s removed=%d: criterion %s, direct min eig %.4e (background alone %.4e)" % (u, Lg, M, pairs, len(removed), v, lam, lam0))
# (3) inertia
import mpmath as mp
mp.mp.dps = 60
for n in (1, 2, 3, 5):
    pts = []
    for j in range(n):
        x, b = rng.uniform(-2, 2), rng.uniform(0.1, 1.5)
        pts += [mp.mpc(x, b), mp.mpc(x, -b)]
    G = mp.matrix(2 * n, 2 * n)
    for k in range(2 * n):
        for l in range(2 * n):
            w = (pts[l] - mp.conj(pts[k])) / 2
            G[k, l] = mp.sin(w) / w if w != 0 else 1
    S = mp.matrix(2 * n, 2 * n)   # J G
    for k in range(2 * n):
        for l in range(2 * n):
            S[k, l] = G[k ^ 1, l]
    ev = mp.eig(S, left=False, right=False)
    neg = sum(1 for e in ev if mp.re(e) < 0)
    print("n=%d: eigenvalues of JG: %d negative, max |imag| %.1e" % (n, neg, max(abs(mp.im(e)) for e in ev)))

# (4) fast evaluation against the direct one
dev = wil.Device(20.0, 9.0, 0.5)
import random
random.seed(3)
mx = 0.0
for _ in range(40):
    a = acb(random.uniform(-3, 3), random.choice([0.0, random.uniform(-0.5, 0.5)]))
    b = acb(random.uniform(-3, 3), random.uniform(0.01, 0.5) * random.choice([-1, 1]))
    d = dev.R(a, b) - dev.Rfast(a, b)
    mx = max(mx, float(abs(d).upper()))
print("fast vs direct evaluation of R: max abs difference (upper bound) %.2e" % mx)
