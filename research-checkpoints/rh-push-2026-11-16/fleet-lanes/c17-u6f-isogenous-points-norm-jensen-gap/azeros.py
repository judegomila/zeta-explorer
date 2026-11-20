# zeros of A_p(x) = (p^2-1) theta(x) - theta(x/p^2) + p theta(p^2 x) in Re x > 0 (theta(x) = sum exp(-pi n^2 x)).
# python-flint evaluation (midpoints), grid search for local minima of |A/theta|, then secant refinement. MEASURED, not enclosed.
import json, math, cmath
from flint import acb, arb, ctx
ctx.prec = 200
def th(x):  # x complex (python complex or acb)
    x = acb(x)
    return acb(0).modular_theta(acb(0, 1) * x)[2]     # theta_3(0 | i x) = sum exp(-pi n^2 x)
def A(p, x):
    return (p*p - 1)*th(x) - th(acb(x)/(p*p)) + p*th(acb(x)*(p*p))
def c(z): return complex(float(z.real.mid()), float(z.imag.mid()))
out = {}
for p in [3, 5, 7]:
    NR, NA = 400, 160
    lr0, lr1 = math.log(1e-2), math.log(1e2)
    a0, a1 = 0.9, 1.5695
    g = [[0.0]*NA for _ in range(NR)]
    for i in range(NR):
        r = math.exp(lr0 + (lr1 - lr0)*i/(NR-1))
        for j in range(NA):
            x = cmath.rect(r, a0 + (a1 - a0)*j/(NA-1))
            g[i][j] = abs(c(A(p, x))) / abs(c(th(x)))
    cand = []
    for i in range(1, NR-1):
        for j in range(1, NA-1):
            v = g[i][j]
            if v < 1.0 and all(v <= g[i+a][j+b] for a in (-1, 0, 1) for b in (-1, 0, 1)):
                cand.append(cmath.rect(math.exp(lr0 + (lr1 - lr0)*i/(NR-1)), a0 + (a1 - a0)*j/(NA-1)))
    roots = []
    for x0 in cand:
        z0, z1 = acb(x0), acb(x0 * (1 + 1e-4))
        f0, f1 = A(p, z0), A(p, z1)
        ok = False
        for it in range(60):
            if abs(c(f1 - f0)) == 0: break
            z2 = acb(c(z1)) - acb(c(f1)) * (acb(c(z1)) - acb(c(z0))) / (acb(c(f1)) - acb(c(f0)))
            z2 = acb(z2.real.mid(), z2.imag.mid())
            z0, f0 = z1, f1
            z1, f1 = z2, A(p, z2)
            if abs(c(f1)) < 1e-40: ok = True; break
        r = c(z1)
        if ok and r.real > 0 and not any(abs(r - s) < 1e-9*abs(s) for s in roots):
            roots.append(r)
    roots.sort(key=lambda r: abs(cmath.phase(r)))
    out[p] = [(r.real, r.imag, cmath.phase(r)) for r in roots]
    print(p, 'candidates', len(cand), 'roots', len(roots), [(round(abs(r), 5), round(cmath.phase(r), 6)) for r in roots[:8]], flush=True)
json.dump(out, open('azeros.json', 'w'))
