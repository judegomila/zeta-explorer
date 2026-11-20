"""Completed Epstein zeta / Eisenstein series in the spectral variable, via Chowla-Selberg (python-flint).
Estar(x,y,s) = pi^-s Gamma(s) * (1/2) sum'_{(m,n)} y^s / |m z + n|^(2s),  z = x+iy.
Real on Re s = 1/2 for every z; Estar(z,s) = Estar(z,1-s); SL2(Z)-invariant in z."""
from flint import acb, arb, ctx
import math
ctx.prec = 220

def Lam(s):  # pi^(-s/2) Gamma(s/2) zeta(s)
    PI = arb.pi()
    return (acb(PI) ** (-s / 2)) * (s / 2).gamma() * s.zeta()

_div = {}
def divisors(n):
    if n not in _div:
        _div[n] = [d for d in range(1, n + 1) if n % d == 0]
    return _div[n]

def Estar(x, y, s, extra=70.0):
    """x,y python floats or arb; s acb."""
    x = arb(x); y = arb(y); PI = arb.pi()
    t = abs(float(s.imag.mid())); sg = abs(float(s.real.mid())) + 1
    yf = float(y.mid())
    N = int((t + extra + 6 * sg) / (2 * math.pi * yf)) + 2
    ya = acb(y)
    tot = Lam(2 * s) * ya ** s + Lam(2 - 2 * s) * ya ** (1 - s)
    nu = s - acb(0.5)
    acc = acb(0)
    for n in range(1, N + 1):
        sig = acb(0)
        for d in divisors(n):
            sig += acb(d) ** (1 - 2 * s)
        k = acb(2 * PI * n * y).bessel_k(nu)
        acc += acb(n) ** nu * sig * k * acb((2 * PI * n * x).cos())
    return tot + 4 * ya.sqrt() * acc

def Zline(x, y, t):
    """real value on the critical line, scaled by exp(pi t/2)."""
    v = Estar(x, y, acb(0.5, t))
    return float(v.real.mid()) * math.exp(math.pi * t / 2) if t < 1300 else v.real

if __name__ == "__main__":
    import mpmath as mp, time
    mp.mp.dps = 30
    # sanity 1: z=i, s=2.3+1.1i against 2 zeta L(chi_-4)
    s = acb(2.3, 1.1); sm = mp.mpc(2.3, 1.1)
    L4 = mp.dirichlet(sm, [0, 1, 0, -1])
    ref = mp.pi ** (-sm) * mp.gamma(sm) * 2 * mp.zeta(sm) * L4
    print("z=i  CS:", Estar(0, 1, s).str(25), " ref:", ref)
    # sanity 2: direct lattice sum at z = 0.3+1.7i, s = 4
    x, y = 0.3, 1.7; tot = mp.mpf(0)
    for m in range(-200, 201):
        for n in range(-200, 201):
            if m or n:
                tot += (y / ((m * x + n) ** 2 + (m * y) ** 2)) ** 4
    print("direct s=4:", mp.pi ** -4 * mp.gamma(4) * tot / 2, " CS:", Estar(x, y, acb(4)).real.str(20))
    # sanity 3: modular invariance z -> -1/z and functional equation
    z = complex(0.3, 1.7); w = -1 / z
    s = acb(0.5, 23.7)
    a = Estar(0.3, 1.7, s); b = Estar(w.real, w.imag, s, extra=120)
    print("inv:", a.str(20), b.str(20))
    print("FE :", Estar(0.3, 1.7, acb(0.3, 9.1)).str(20), Estar(0.3, 1.7, acb(0.7, -9.1)).str(20))
    t0 = time.time()
    for k in range(50): Estar(0, 1.0, acb(0.5, 80 + k * 0.1))
    print("ms/eval at t~80,y=1:", (time.time() - t0) * 20)
