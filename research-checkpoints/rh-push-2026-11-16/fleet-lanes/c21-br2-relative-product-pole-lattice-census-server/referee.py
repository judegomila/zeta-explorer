#!/usr/bin/env python3
"""Independent rerun of three cells (mpmath, direct complex product, own Miller-Rabin). No code shared with census.py."""
import mpmath as mp, random, json, sys
mp.mp.dps = 70
def mr(n, rounds=24):
    if n < 2: return False
    for p in (2,3,5,7,11,13,17,19,23,29,31,37):
        if n % p == 0: return n == p
    d = n - 1; s = 0
    while d % 2 == 0: d //= 2; s += 1
    rg = random.Random(12345)
    for _ in range(rounds):
        a = rg.randrange(2, n - 1); x = pow(a, d, n)
        if x in (1, n - 1): continue
        for _ in range(s - 1):
            x = x * x % n
            if x == n - 1: break
        else: return False
    return True
def nearest_prime(L):
    old = mp.mp.dps; mp.mp.dps = int(L / 2.3) + 80
    x = mp.exp(L); n = int(mp.floor(x))
    pu = n + 1
    while not mr(pu): pu += 1
    pl = n
    while pl >= 2 and not mr(pl): pl -= 1
    q = pu if (pl < 2 or (pu - x) < (x - pl)) else pl
    mp.mp.dps = old
    return q
def logs(kind, jmax):
    f = {'S1': lambda k: mp.exp(mp.mpf(k) / 2), 'S2': lambda k: mp.mpf(k) ** 3}[kind]
    k = 0 if kind == 'S1' else 1
    out = []
    Lmax = 90 * mp.mpf(2) ** jmax
    while True:
        mp.mp.dps = 700
        L = f(k)
        if L > Lmax: break
        if L <= 1500:
            q = nearest_prime(L); mp.mp.dps = 70; out.append(mp.log(q))
        else:
            mp.mp.dps = 70; out.append(+L)
        k += 1
    mp.mp.dps = 70
    return out
def y(Ls, t, j, pole=None):
    d = mp.mpf(2) ** (-j); s = mp.mpc(mp.mpf(1) / 2 + d, t); tot = mp.mpf(0)
    for i, L in enumerate(Ls):
        if d * L > 95: break
        num = 1 - mp.exp(-s * L)
        den = (1 - mp.exp(-d * L)) if i == pole else 1 - mp.exp((mp.mpf(1) / 2 - s) * L)
        tot += mp.log(abs(num)) - mp.log(abs(den))
    return tot
def ols(ys, js):
    xs = [j * mp.log(2) for j in js]; xb = sum(xs) / len(xs)
    return sum((x - xb) * v for x, v in zip(xs, ys)) / sum((x - xb) ** 2 for x in xs)
js = list(range(4, 41))
res = {}
L1 = logs('S1', 40); L2 = logs('S2', 40)
t = 2 * mp.pi * 3 / L1[1]
ys = [y(L1, t, j, pole=1) for j in js]
res['S1 p1(k=1)_k3'] = dict(t=mp.nstr(t, 20), y4=mp.nstr(ys[0], 20), y22=mp.nstr(ys[18], 20), y40=mp.nstr(ys[-1], 20), ols=mp.nstr(ols(ys, js), 20))
m = random.Random(20261120).getrandbits(53); t = mp.mpf(m) * 1000 / mp.mpf(2) ** 53
ys = [y(L2, t, j) for j in js]
res['S2 g0'] = dict(t=mp.nstr(t, 20), y4=mp.nstr(ys[0], 20), y22=mp.nstr(ys[18], 20), y40=mp.nstr(ys[-1], 20), ols=mp.nstr(ols(ys, js), 20))
mp.mp.dps = 40; t = mp.zetazero(1).imag; mp.mp.dps = 70
ys = [y(L1, t, j) for j in js]
res['S1 z1'] = dict(t=mp.nstr(t, 20), y4=mp.nstr(ys[0], 20), y22=mp.nstr(ys[18], 20), y40=mp.nstr(ys[-1], 20), ols=mp.nstr(ols(ys, js), 20))
res['S1 first primes (exp of logs)'] = [mp.nstr(mp.exp(L), 16) for L in L1[:8]]
res['S2 first primes (exp of logs)'] = [mp.nstr(mp.exp(L), 16) for L in L2[:6]]
json.dump(res, open('referee_out.json', 'w'), indent=1)
print(json.dumps(res, indent=1))
