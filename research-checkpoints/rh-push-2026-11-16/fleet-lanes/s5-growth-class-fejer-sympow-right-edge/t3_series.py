"""s5 combination 3: Hecke eigenvalues at primes from q-expansions (python-flint nmod_poly, multimodular).
   delta  : Delta = q prod (1-q^n)^24 = q (sum_k (-1)^k (2k+1) q^{k(k+1)/2})^8 ; x_p = tau(p) / (2 p^{11/2})
   f11    : q prod (1-q^n)^2 (1-q^{11n})^2 (level 11, weight 2)              ; x_p = a_p / (2 sqrt p); p = 11 marked 2.0
   lin    : x_p = (x_p(delta) + x_p(f11)) / 2 (not the angle sequence of an automorphic form); p = 11 marked 2.0
Usage: t3_series.py N outdir       writes x_delta_N.f64, x_f11_N.f64, x_lin_N.f64 (float64, one entry per prime <= N)."""
import sys, time, math, numpy as np
from flint import nmod_poly

def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0]

MODS = [4611686018427387847, 4611686018427387817, 4611686018427387787]   # primes below 2^62 (checked below)

def eta3_list(N):      # sum (-1)^k (2k+1) q^{k(k+1)/2} mod q^N
    c = [0] * N; k = 0
    while k * (k + 1) // 2 < N:
        c[k * (k + 1) // 2] = (2 * k + 1) * (-1) ** k; k += 1
    return c

def euler_list(N, step=1):   # prod (1 - q^{step n}) mod q^N  (pentagonal numbers)
    c = [0] * N; c[0] = 1; k = 1
    while True:
        e1 = step * k * (3 * k - 1) // 2; e2 = step * k * (3 * k + 1) // 2
        if e1 >= N: break
        c[e1] += (-1) ** k
        if e2 < N: c[e2] += (-1) ** k
        k += 1
    return c

def main():
    N = int(float(sys.argv[1])); out = sys.argv[2]
    from flint import fmpz
    for m in MODS: assert fmpz(m).is_prime(), m
    print('planned memory: python list of %d ints (%.2f GB) + nmod_poly %.2f GB x about 4' % (N, 8 * N / 1e9, 8 * N / 1e9), flush=True)
    pr = primes_upto(N); print('primes', len(pr), flush=True)
    t0 = time.time()
    import os
    have = os.path.exists('%s/x_delta_%d.f64' % (out, N))
    if have:
        xd = np.fromfile('%s/x_delta_%d.f64' % (out, N)); assert len(xd) == len(pr); print('x_delta read from file', flush=True)
    # Delta
    lst = eta3_list(N if not have else 10); res = []
    for m in (MODS if not have else []):
        p = nmod_poly([v % m for v in lst], m)
        p = p.pow_trunc(8, N)
        res.append([int(p[int(q) - 1]) for q in pr]); del p
        print('delta mod done', time.time() - t0, flush=True)
    del lst
    M = MODS[0] * MODS[1] * MODS[2]
    c0 = (MODS[1] * MODS[2]) * pow(MODS[1] * MODS[2], -1, MODS[0]); c1 = (MODS[0] * MODS[2]) * pow(MODS[0] * MODS[2], -1, MODS[1]); c2 = (MODS[0] * MODS[1]) * pow(MODS[0] * MODS[1], -1, MODS[2])
    tau_small = {}
    if not have: xd = np.empty(len(pr))
    for i, q in enumerate(pr if not have else []):
        v = (res[0][i] * c0 + res[1][i] * c1 + res[2][i] * c2) % M
        if v > M // 2: v -= M
        q = int(q)
        if q < 30: tau_small[q] = v
        xd[i] = float(v) / (2.0 * float(q) ** 5.5)
    print('tau at small primes', tau_small, flush=True)
    if not have:
        assert tau_small[2] == -24 and tau_small[3] == 252 and tau_small[5] == 4830 and tau_small[7] == -16744 and tau_small[11] == 534612
        assert np.all(np.abs(xd) <= 1.0), 'Deligne bound violated: computation error'
        xd.tofile('%s/x_delta_%d.f64' % (out, N))
    del res
    # level 11
    m = 2147483647      # abs(a_n) <= d(n) sqrt(n) < 2^30 for n <= 1e8
    a = nmod_poly([v % m for v in euler_list(N, 1)], m); b = nmod_poly([v % m for v in euler_list(N, 11)], m)
    ab = a.mul_low(b, N); del a, b
    f = ab.mul_low(ab, N); del ab
    xf = np.empty(len(pr)); small = {}
    for i, q in enumerate(pr):
        q = int(q); v = int(f[q - 1])
        if v > m // 2: v -= m
        if q < 30: small[q] = v
        xf[i] = v / (2.0 * math.sqrt(q))
    print('a_p(11a) at small primes', small, time.time() - t0, flush=True)
    assert small[2] == -2 and small[3] == -1 and small[5] == 1 and small[7] == -2 and small[13] == 4
    i11 = int(np.searchsorted(pr, 11)); xf[i11] = 2.0
    assert np.all(np.abs(np.delete(xf, i11)) <= 1.0), 'Hasse bound violated'
    xf.tofile('%s/x_f11_%d.f64' % (out, N))
    xl = 0.5 * (xd + xf); xl[i11] = 2.0
    xl.tofile('%s/x_lin_%d.f64' % (out, N))
    for nm, x in (('delta', xd), ('f11', np.delete(xf, i11)), ('lin', np.delete(xl, i11))):
        c2 = 2 * x * x - 1
        print('%s: mean U_2 = %.5f  mean U_4 = %.5f  (Sato-Tate: 0, 0)' % (nm, np.mean(2 * c2 + 1), np.mean(1 + 2 * c2 + 2 * (2 * c2 * c2 - 1))), flush=True)
    print('done', time.time() - t0, flush=True)

if __name__ == '__main__': main()
