"""Repair of Thm 6(d): for the symmetrised Dirichlet stage g_N(s) = gamma(s) D_N(s) + gamma(1-s) D_N(1-s),
gamma(s) = pi^(-s/2) Gamma(s/2), D_N(s) = sum_{n<=N} n^-s, locate zeros with Re s > 1/2 inside the Fourier strip -2 < Re s < 3
(mpmath, float search) and certify one per N in ball arithmetic (python-flint acb) by the minimum-modulus test:
g analytic on the closed disc, |g(c)| < min over the circle of |g|  =>  g has a zero in the disc. Memory: negligible."""
import mpmath as mp, json
from flint import acb, arb, ctx
mp.mp.dps = 30; ctx.prec = 120
def g_mp(s, N):
    gam = lambda z: mp.pi ** (-z / 2) * mp.gamma(z / 2)
    return gam(s) * sum(mp.mpf(n) ** (-s) for n in range(1, N + 1)) + gam(1 - s) * sum(mp.mpf(n) ** (s - 1) for n in range(1, N + 1))
def g_acb(s, N):
    pi = acb.pi()
    def gam(z): return (-(z / 2) * pi.log()).exp() * (z / 2).gamma()
    D = lambda z: sum(((-z) * acb(n).log()).exp() for n in range(1, N + 1))
    return gam(s) * D(s) + gam(1 - s) * D(1 - s)
out = {}
for N in (1, 2, 3, 5, 10):
    roots = []
    for t0 in mp.arange(1, 60, 0.5):
        for sg in (0.6, 0.8, 1.0, 1.3, 1.7, 2.2, 2.7):
            try:
                r = mp.findroot(lambda z: g_mp(z, N), mp.mpc(sg, t0), tol=1e-22, maxsteps=40)
            except Exception: continue
            if 0.501 < r.real < 2.9 and 0.01 < r.imag < 60.3 and abs(g_mp(r, N)) < 1e-18 and all(abs(r - x) > 1e-8 for x in roots): roots.append(r)
    roots.sort(key=lambda z: z.imag)
    print("N =", N, " zeros found with 0.501 < Re s < 2.9, 0 < t < 60.3 (float search, may be incomplete):", [(mp.nstr(r.real, 12), mp.nstr(r.imag, 12)) for r in roots])
    rec = dict(found=[[float(r.real), float(r.imag)] for r in roots])
    if roots:
        r = roots[0]; rad = 1e-6; c = acb(arb(str(r.real)), arb(str(r.imag)))
        gc = g_acb(c, N).abs_upper(); M = 4000; ok = True; lo = None
        import math
        for k in range(M):
            th = arb(2 * k + 1) * arb.pi() / M  # midpoint angle, half-width pi/M
            # box covering the arc: centre on the circle, radius covering the arc length
            cx = arb(str(r.real)) + arb(rad) * th.cos(); cy = arb(str(r.imag)) + arb(rad) * th.sin()
            pad = rad * math.pi / M * 1.01
            box = acb(arb(cx.mid(), float(cx.rad()) + pad), arb(cy.mid(), float(cy.rad()) + pad))
            v = g_acb(box, N).abs_lower(); lo = v if lo is None else min(lo, v)
            ok = ok and bool(v > gc)
        print("   certificate: centre", mp.nstr(r, 15), "radius", rad, " |g(centre)| <=", gc, " min |g| on circle >=", lo, " zero in disc:", ok,
              "; disc inside strip and right of the line:", bool(0.5 + 2 * rad < r.real < 3 - 2 * rad))
        rec["certified"] = dict(centre=[mp.nstr(r.real, 20), mp.nstr(r.imag, 20)], radius=rad, ok=bool(ok))
    out[N] = rec
json.dump(out, open("dirichlet_stage_cert.json", "w"), indent=1)
