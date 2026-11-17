import math, cmath, mpmath as mp, time
from elib import *
mp.mp.dps = 40
def kron(D, n):  # Kronecker symbol (D/n), D<0 fundamental, via Euler criterion on odd primes and (D/2)
    if n == 0: return 0
    r = 1; m = n
    while m % 2 == 0:
        m //= 2
        r *= 0 if D % 2 == 0 else (1 if D % 8 in (1, 7) else -1)
    p = 3
    while m > 1:
        while m % p == 0:
            m //= p
            e = pow(D % p, (p - 1) // 2, p)
            r *= 0 if e == 0 else (1 if e == 1 else -1)
        p += 2
    return r
def Lchi(D, sm):
    q = abs(D)
    return sum(kron(D, a) * mp.zeta(sm, mp.mpf(a) / q) for a in range(1, q)) / mp.mpf(q) ** sm
for (sg, t) in [(0.65, 14.3), (0.8, 37.7), (0.95, 49.9)]:
    E = Eis(sg, t); sm = mp.mpc(sg, t)
    ref = mp.pi ** (-sm) * mp.gamma(sm) * 2 * mp.zeta(sm) * Lchi(-4, sm) * mp.exp(mp.pi * t / 2)
    print("z=i", sg, t, E.F(0.0, 1.0), complex(ref))
E = Eis(0.65, 23.7)
z = complex(0.3, 1.7); w = -1 / z
print("inv", E.Fz(z), E.F(w.real + 1, w.imag), E.F(-w.real, w.imag))
E2 = Eis(0.35, -23.7)
print("FE ", E.Fz(z), E2.Fz(z))
E = Eis(4.1, 0.0); x, y = 0.3, 1.7; tot = 0.0
for m in range(-400, 401):
    for n in range(-400, 401):
        if m or n: tot += (y / ((m * x + n) ** 2 + (m * y) ** 2)) ** 4.1
print("direct", math.pi ** -4.1 * math.gamma(4.1) * tot / 2, E.F(x, y))
for D in (-3, -4, -7, -8, -11, -19, -43, -67, -163):
    z = complex(0, math.sqrt(-D) / 2) if D % 4 == 0 else complex(0.5, math.sqrt(-D) / 2)
    sg, t = 0.7, 17.3; sm = mp.mpc(sg, t); E = Eis(sg, t)
    w = {-3: 6, -4: 4}.get(D, 2)
    ref = (w / 2) * (mp.sqrt(-D) / 2) ** sm * mp.pi ** (-sm) * mp.gamma(sm) * mp.zeta(sm) * Lchi(D, sm) * mp.exp(mp.pi * t / 2)
    print(D, E.Fz(z), complex(ref))
for (sg, t) in [(0.55, 10.0), (0.8, 30.0), (0.95, 50.0)]:
    t0 = time.time(); E = Eis(sg, t); Y = 3 + t / math.pi
    W, mn, info, per = winding(E, Y)
    print("W", sg, t, round(W, 6), "min|F|", mn, info, {k: round(v, 3) for k, v in per.items()}, "bessel", E.nb, "sec", round(time.time() - t0, 2), "|A|", abs(E.A))
