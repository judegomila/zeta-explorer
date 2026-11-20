# Referee side checks: (a) identity E of lane c18-u4 at two fresh points (mpmath); (b) the corrected form of Lemma GL (b): a family
# whose real parts are positive definite atom by atom while k -> Lambda_k(n) is not; (c) W5c (c17 REFEREE2): numeric test of the bound.
import json, math
import mpmath as mp
import numpy as np
mp.mp.dps = 30
out = {}
# (a)
NZ = 400
zs = [mp.zetazero(k) for k in range(1, NZ + 1)]
def mangoldt_list(X):
    res = []
    for n in range(2, int(X) + 1):
        m = n; p = None
        for d in range(2, int(n ** 0.5) + 1):
            if m % d == 0: p = d; break
        if p is None: res.append((n, math.log(n))); continue
        while m % p == 0: m //= p
        if m == 1: res.append((n, math.log(p)))
    return res
def SU_prime(s, X, lam):
    U = mp.log(X)
    return mp.fsum(L * mp.power(n, -s) * (1 - mp.log(n) / U) for (n, L) in lam)
def SU_analytic(s, X):
    U = mp.log(X)
    ld = lambda w: mp.zeta(w, derivative=1) / mp.zeta(w)
    t1 = -ld(s) - mp.diff(ld, s) / U
    t2 = mp.power(X, 1 - s) / ((1 - s) ** 2 * U)
    t3 = mp.mpc(0)
    for r in zs:
        for rho in (r, mp.conj(r)):
            t3 -= mp.power(X, rho - s) / ((rho - s) ** 2 * U)
    t4 = -mp.fsum(mp.power(X, -2 * j - s) / ((2 * j + s) ** 2 * U) for j in range(1, 40))
    return t1 + t2 + t3 + t4
rows = []
for (sig, t, X) in [(0.7, 21.3, 25), (0.85, 3.0, 40), (0.6, 30.4249, 30)]:
    lam = mangoldt_list(X)
    s = mp.mpc(sig, t)
    a = SU_prime(s, X, lam); b = SU_analytic(s, X)
    T = sum(L * n ** (-sig) * (1 - math.log(n) / math.log(X)) * 2 * (1 + math.cos(t * math.log(n))) ** 2 for (n, L) in lam)
    T2 = 3 * SU_prime(mp.mpf(sig), X, lam) + 4 * mp.re(SU_prime(mp.mpc(sig, t), X, lam)) + mp.re(SU_prime(mp.mpc(sig, 2 * t), X, lam))
    tail = 2 * X ** (0.5 - sig) / math.log(X) * (math.log(float(zs[-1].imag)) / (2 * math.pi)) / float(zs[-1].imag)
    rows.append(dict(sigma=sig, t=t, X=X, prime_side=str(mp.nstr(a, 12)), analytic_side=str(mp.nstr(b, 12)), abs_diff=float(abs(a - b)),
                     zero_tail_scale=tail, T_termwise=T, T_from_three_points=float(T2), T_diff=float(abs(T - T2))))
out["identity_E"] = rows
print(rows, flush=True)
# (b) Lambda_0 = 1, Lambda_1 = i, Lambda_k = 0 (k >= 2): Re Lambda_k = delta_k0, so sum_k a_k Re Lambda_k = a_0 >= 0 for every
#     non-negative cosine polynomial; but the Hermitian extension has symbol 1 - 2 sin(theta), which is negative at theta = pi/2.
th = np.linspace(0, 2 * np.pi, 2001)
out["lemma_GL_b_counterexample"] = dict(min_symbol=float(np.min(1 - 2 * np.sin(th))), note="Re parts positive definite, sequence itself not")
# (c) W5c
rng = np.random.default_rng(5)
rows = []
for (u, D, b) in [(8.0, 0.5, 0.05), (8.0, 0.2, 0.1), (12.0, 1.0, 0.03), (6.0, 0.1, 0.3), (10.0, 2.0, 0.2)]:
    worst = 0.0
    ns = 4000
    s = (np.arange(ns) + 0.5) / ns * u - u / 2
    ds = u / ns
    for trial in range(40):
        # h: smooth random bump times a random modulation, tuned to sit on the row
        tau = rng.uniform(-20, 20)
        k = rng.integers(1, 6)
        h = np.sin(np.pi * (s + u / 2) / u) ** 2 * np.exp(1j * tau * s) * (1 + 0.5 * rng.standard_normal() * np.cos(k * np.pi * s / u))
        if trial % 2: h = h * np.sinh(b * s)            # weight toward the extremal direction
        nrm = (abs(h) ** 2).sum() * ds
        x0 = rng.uniform(0, D)
        xs = x0 + D * np.arange(-int(120 / D), int(120 / D) + 1)
        ex = np.exp(-1j * np.outer(xs, s))
        gp = (ex * (h * np.exp(b * s))).sum(1) * ds      # g(x + ib)
        gm = (ex * (h * np.exp(-b * s))).sum(1) * ds     # g(x - ib)
        neg = (-2 * (gp * np.conj(gm)).real).sum()
        C = (2 * math.e ** 2 / math.pi) * max(2 / D, u / 2)
        bound = 4 * math.pi * C * math.sinh(u * b / 2) ** 2 * nrm
        mid = 2 * (abs(gp - gm) ** 2 / 4).sum()
        worst = max(worst, neg / bound)
        assert neg <= mid * (1 + 1e-9) + 1e-12
    rows.append(dict(u=u, D=D, b=b, max_ratio_negative_part_over_bound=worst))
out["W5c"] = rows
print(rows)
json.dump(out, open("misc_checks.json", "w"), indent=1)
