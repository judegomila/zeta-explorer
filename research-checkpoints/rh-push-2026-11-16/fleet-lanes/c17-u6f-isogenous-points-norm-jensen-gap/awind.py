# winding number of R(x) = A_p(x)/theta(x) = p^2 - 1 - theta(x/p^2)/theta(x) + p theta(p^2 x)/theta(x) along rays arg x = alpha.
# R -> p^2 - p (r -> 0) and R -> p^2 + p - 2 (r -> inf), R > 0 on the positive axis; theta has no zero in Re x > 0,
# so the winding along the ray counts the zeros of A_p in the sector 0 < arg x < alpha. Float midpoints, adaptive step. MEASURED.
import json, math, cmath
from flint import acb, ctx
ctx.prec = 300
def th(x): return acb(0).modular_theta(acb(0, 1) * acb(x))[2]
def R(p, x):
    x = acb(x); t = th(x)
    z = (p*p - 1) - th(x/(p*p))/t + p*th(x*(p*p))/t
    return complex(float(z.real.mid()), float(z.imag.mid()))
out = {}
for p in [3, 5, 7]:
    for alpha in [1.0, 1.2, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55]:
        lr, lr_end = math.log(1e-4), math.log(1e4)
        z = R(p, cmath.rect(math.exp(lr), alpha)); tot = 0.0; h = 1e-2; steps = 0; minabs = abs(z); argmin = lr
        while lr < lr_end:
            while True:
                z2 = R(p, cmath.rect(math.exp(lr + h), alpha))
                d = cmath.phase(z2 / z)
                if abs(d) < 0.3 or h < 1e-9: break
                h /= 2
            tot += d; lr += h; z = z2; steps += 1
            if abs(z) < minabs: minabs = abs(z); argmin = lr
            if abs(d) < 0.05: h = min(h*2, 1e-2)
        out['%d_%s' % (p, alpha)] = dict(winding=tot/(2*math.pi), steps=steps, min_abs_R=minabs, r_at_min=math.exp(argmin))
        print(p, alpha, 'winding %.4f' % (tot/(2*math.pi)), 'steps', steps, 'min|R| %.4g at r=%.5g' % (minabs, math.exp(argmin)), flush=True)
json.dump(out, open('awind.json', 'w'))
