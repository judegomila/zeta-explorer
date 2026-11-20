"""Off-line zeros of the symmetrised full-Euler-factor stage near the poles on Re s = 1 (mpmath scalars, < 100 MB)."""
import mpmath as mp
mp.mp.dps = 40
gam = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2)
def run(P):
    primes = [p for p in [2, 3, 5, 7, 11, 13] if p <= P]
    zP = lambda s: mp.fprod(1 / (1 - mp.mpf(p) ** (-s)) for p in primes)
    for p in primes:
        for k in [5, 20, 100, 1000, 10000]:
            s0 = 1 + 2j * mp.pi * k / mp.log(p)
            # g = (1 - p^(s-1)) * [gam(s) zP(s) + gam(1-s) zP(1-s)]  (pole at s0 removed)
            g = lambda s: (1 - mp.mpf(p) ** (s - 1)) * gam(s) * zP(s) + gam(1 - s) * mp.fprod(
                1 / (1 - mp.mpf(q) ** (s - 1)) for q in primes if q != p)
            rest = mp.fprod(1 / (1 - mp.mpf(q) ** (s0 - 1)) for q in primes if q != p)
            pred = gam(1 - s0) * rest / (mp.log(p) * gam(s0) * zP(s0))
            r = mp.findroot(g, s0 + pred)
            print(f" P={P} p={p} k={k}: pole {mp.nstr(s0, 9)}  zero - pole = {mp.nstr(r - s0, 8)}  first-order {mp.nstr(pred, 8)}  |g|={mp.nstr(abs(g(r)), 2)}  Re s - 1/2 = {mp.nstr(mp.re(r) - 0.5, 8)}", flush=True)
run(2); run(5)
