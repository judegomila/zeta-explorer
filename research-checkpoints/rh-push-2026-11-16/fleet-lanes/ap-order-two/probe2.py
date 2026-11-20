#!/usr/bin/env python3
"""Order-2 probe over Q:  I = Q^{-1/2} sum_m Om(m/Q) A_m B_m,
A_m = Y^{-1} sum_s W1(s/Y) (m/s),  B_m = Z^{-1/2} sum_c x_c w(c/Z) (m/c)   (s, c odd squarefree).
Split I = f + N, f = square rows m = t^2, N = the rest.  Coefficient sets x_c: mu, |mu| (=1), random signs,
mu*chi_5.  Planned allocation printed before allocating."""
import sys, json, math
import numpy as np

def bump(u, a, b):
    out = np.zeros_like(u, dtype=float)
    ok = (u > a) & (u < b)
    v = u[ok]
    out[ok] = np.exp(-1.0 / ((v - a) * (b - v)) + 4.0 / (b - a) ** 2)
    return out

def run(Z, Y, Q, seed=1):
    mlo, mhi = int(0.5 * Q), int(2 * Q) + 1
    ms = np.arange(max(1, mlo), mhi)
    nmax = int(2 * max(Y, Z)) + 1
    # sieve: smallest prime factor, mobius
    spf = np.zeros(nmax + 1, dtype=np.int64)
    for i in range(2, nmax + 1):
        if spf[i] == 0:
            spf[i::i] = np.where(spf[i::i] == 0, i, spf[i::i])
    primes = [p for p in range(3, nmax + 1) if spf[p] == p]
    need = len(primes) * len(ms)
    print(f"# Z={Z} Y={Y} Q={Q}: rows {len(ms)}, primes {len(primes)}, legendre table {need/1e6:.1f} MB (int8)", flush=True)
    assert need < 3.0e9
    leg = {}
    for p in primes:
        t = np.zeros(p, dtype=np.int8)
        sq = (np.arange(1, p, dtype=np.int64) ** 2) % p
        t[1:] = -1
        t[sq] = 1
        leg[p] = t[ms % p]
    def fac(n):
        out = []
        while n > 1:
            p = spf[n]; e = 0
            while n % p == 0:
                n //= p; e += 1
            out.append((p, e))
        return out
    def jac(n):
        v = np.ones(len(ms), dtype=np.int8)
        for p, _ in fac(n):
            v = v * leg[p]
        return v
    rng = np.random.default_rng(seed)
    A = np.zeros(len(ms))
    names = ["mu", "abs_mu", "rand_sign", "mu_chi5"]
    B = {k: np.zeros(len(ms)) for k in names}
    S = {k: 0.0 for k in names}          # plain sums  Z^{-1/2} sum x_c w(c/Z)
    for n in range(3, nmax + 1, 2):
        f = fac(n)
        if any(e > 1 for _, e in f):
            continue
        w1 = bump(np.array([n / Y]), 1.0, 2.0)[0]
        w = bump(np.array([n / Z]), 1.0, 2.0)[0]
        if w1 == 0.0 and w == 0.0:
            continue
        v = jac(n)
        if w1 != 0.0:
            A += (w1 / Y) * v
        if w != 0.0:
            mu = (-1) ** len(f)
            chi5 = [0, 1, -1, -1, 1][n % 5]
            xs = {"mu": mu, "abs_mu": 1.0, "rand_sign": float(rng.choice([-1, 1])), "mu_chi5": mu * chi5}
            for k in names:
                B[k] += (xs[k] * w / math.sqrt(Z)) * v
                S[k] += xs[k] * w / math.sqrt(Z)
    Om = bump(ms / Q, 0.5, 2.0)
    rt = np.rint(np.sqrt(ms)).astype(np.int64)
    issq = rt * rt == ms
    out = {"Z": Z, "Y": Y, "Q": Q, "X": Q / Y, "rows": int(len(ms)), "square_rows": int(issq.sum())}
    out["A_sq_mean"] = float(A[issq].mean())
    out["A_nonsq_rms_times_sqrtY"] = float(math.sqrt((A[~issq] ** 2).mean()) * math.sqrt(Y))
    out["bound_proxy_1_plus_sqrtX_plus_Zhalf_Ym13"] = 1 + math.sqrt(Q / Y) + math.sqrt(Z) * Y ** (-1 / 3)
    for k in names:
        I = float((Om * A * B[k]).sum() / math.sqrt(Q))
        f = float((Om * A * B[k])[issq].sum() / math.sqrt(Q))
        out[k] = {"I": I, "f_square_rows": f, "N_rest": I - f, "plain_sum_S": S[k],
                  "f_over_S": (f / S[k]) if S[k] != 0 else None,
                  "B_nonsq_meansq": float((B[k][~issq] ** 2).mean()),
                  "B_sq_meansq": float((B[k][issq] ** 2).mean())}
    return out

if __name__ == "__main__":
    res = []
    for (Z, Y, Q) in [(4000, 4000, 4000), (16000, 4000, 16000), (16000, 16000, 16000), (16000, 16000, 64000), (30000, 3000, 30000)]:
        r = run(Z, Y, Q)
        res.append(r)
        print(json.dumps(r), flush=True)
    json.dump(res, open(sys.argv[1], "w"), indent=1)
