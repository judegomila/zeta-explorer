"""Referee Lemma J1' : functionals invariant under a common pointwise scaling of the pair (or triple) are exactly
HEAT-blind for the same-tau lift without polar terms. Two truncations. Small."""
import sys, json, math, cmath, random
OUT = sys.argv[1]; rng = random.Random(150010); R = {}
w7 = cmath.exp(2j * math.pi / 6); ind = {1: 0, 3: 1, 2: 2, 6: 3, 4: 4, 5: 5}
chi = lambda n: 0 if n % 7 == 0 else w7 ** ind[n % 7]
chi2 = lambda n: chi(n) ** 2
def K3z(u, N): return sum((2 * math.pi ** 2 * n ** 4 * math.exp(4.5 * u) - 3 * math.pi * n * n * math.exp(2.5 * u)) * math.exp(-math.pi * n * n * math.exp(2 * u)) for n in range(1, N + 1))
def Kc(u, N, ch, d): return sum(ch(n) * n ** d * cmath.exp((0.5 + d) * u) * math.exp(-math.pi * n * n * math.exp(2 * u) / 7) for n in range(1, N + 1))
for N in (12, 40):
    wq = wl = wt = wx = 0; single = 0
    for _ in range(300):
        tau = -10 ** rng.uniform(-1.7, 0.3); u = rng.uniform(-1, 1); v = rng.uniform(-1, 1)
        g = lambda x: math.exp(tau * x * x / 4)
        A, B, C = (lambda x: K3z(x, N)), (lambda x: Kc(x, N, chi, 1)), (lambda x: Kc(x, N, chi2, 0))
        q0 = B(u) / A(u); q1 = (g(u) * B(u)) / (g(u) * A(u)); wq = max(wq, abs(q0 - q1) / abs(q0))
        t0 = B(u) ** 2 / (A(u) * C(u)); t1 = (g(u) * B(u)) ** 2 / (g(u) * A(u) * g(u) * C(u)); wt = max(wt, abs(t0 - t1) / abs(t0))
        x0 = A(u) * B(v) / (A(v) * B(u)); x1 = g(u) * A(u) * g(v) * B(v) / (g(v) * A(v) * g(u) * B(u)); wx = max(wx, abs(x0 - x1) / abs(x0))
        # not blind: quotient at two different points, and log of one kernel
        d0 = B(u) / A(v); d1 = g(u) * B(u) / (g(v) * A(v)); single = max(single, abs(d0 - d1) / abs(d0))
    R["N=%d" % N] = {"quotient K_B(u)/K_A(u): max rel change under HEAT": wq, "triple K_chi^2/(K K_chi^2-twist) at one point": wt,
                     "cross-ratio K_A(u)K_B(v)/(K_A(v)K_B(u))": wx, "K_B(u)/K_A(v), u != v (not blind): max rel change": single}
json.dump(R, open(OUT, "w"), indent=1); print(json.dumps(R, indent=1))
