#!/usr/bin/env python3
"""Shared definitions: the sets S_beta = {prime nearest exp(k^beta)} (distinct), hash phases, heights."""
import math, random
from flint import arb, fmpz, ctx

LCAP = 36.0          # for k^beta > LCAP the float64 runs use lambda_k = k^beta (difference below 1e-13)
M64 = (1 << 64) - 1

def splitmix(x):
    z = (x + 0x9E3779B97F4A7C15) & M64
    z = ((z ^ (z >> 30)) * 0xBF58476D1CE4E5B9) & M64
    z = ((z ^ (z >> 27)) * 0x94D049BB133111EB) & M64
    return z ^ (z >> 31)

def u_hash(key, seed):
    """dyadic rational in [0,1) with 53 bits, as python float (exact)"""
    return (splitmix((key + (seed << 44)) & M64) >> 11) * 2.0 ** -53

def is_prime(n):
    z = fmpz(n)
    return z.is_prime() if n.bit_length() <= 300 else z.is_probable_prime()

def nearest_prime(x_arb):
    n = int(x_arb.floor().unique_fmpz())
    up = n + 1
    while not is_prime(up): up += 1
    dn = n
    while dn >= 2 and not is_prime(dn): dn -= 1
    if dn < 2: return up
    du = arb(up) - x_arb; dl = x_arb - arb(dn)
    if bool(dl < du): return dn
    assert bool(du < dl)
    return up

def beta_pow(k, beta):
    """arb k^beta for beta in {1, 0.75, 0.5}"""
    a = arb(k)
    if beta == 1.0: return a
    if beta == 0.5: return a.sqrt()
    if beta == 0.75: return (a.sqrt() * a.sqrt().sqrt())
    raise ValueError

def small_set(beta, lcap=LCAP):
    """distinct primes nearest exp(k^beta) for k^beta <= lcap; returns (sorted primes, k0 = first k not included)"""
    old = ctx.prec; ctx.prec = int(lcap / math.log(2)) + 256
    S = set(); k = 1
    while k ** beta <= lcap:
        S.add(nearest_prime(beta_pow(k, beta).exp())); k += 1
    ctx.prec = old
    return sorted(S), k

RATS = [(1,1),(2,1),(3,1),(1,2),(3,2),(5,2),(1,3),(2,3),(4,3),(5,3),(1,4),(3,4),(5,4),(1,5),(2,5),(3,5),(4,5),
        (1,6),(5,6),(1,7),(2,7),(3,7),(1,8),(3,8),(5,8)]

def heights(beta, mode, seed, small):
    """list of descriptors: ('pole', i, n) t = (theta_i + 2 pi n)/log small[i];  ('rat', a, b) t = 2 pi a / b^beta;
    ('gen', float).  50 constructed + 50 generic."""
    H = []
    if mode == 'plus':
        for i in range(2, 7):
            for n in range(1, 6): H.append(('pole', i, n))
        for (a, b) in RATS: H.append(('rat', a, b))
    else:
        for i in range(2, 12):
            for n in range(1, 6): H.append(('pole', i, n))
    rng = random.Random(1000 + seed)
    for _ in range(50): H.append(('gen', rng.uniform(0.5, 12.0)))
    return H

def height_arb(d, beta, mode, seed, small):
    if d[0] == 'gen': return arb(d[1])
    if d[0] == 'rat': return 2 * arb.pi() * d[1] / beta_pow(d[2], beta)
    i, n = d[1], d[2]
    th = (2 * arb.pi() * arb(u_hash(i, seed))) if mode == 'rand' else arb(0)
    return (th + 2 * arb.pi() * n) / arb(small[i]).log()
