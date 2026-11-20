# Supplement to checks.py part A: at beta = 1/2 the poles w = beta and w = 1 - beta coincide (double pole at w = 1/2).
# Coefficient of (w - 1/2)^-2 by contour integral, at a zero and at a generic point of the critical line.
import json, sys
import mpmath as mp
mp.mp.dps = 30
xi = lambda u: mp.pi**(-u/2)*mp.gamma(u/2)*mp.zeta(u)
G = lambda w, b, g: xi(w+b-1)*xi(w+1-b)*xi(w+1j*g)*xi(w-1j*g)
def coef(f, w0, k, r=mp.mpf('0.03')):  # coefficient of (w-w0)^(-k)
    h = lambda th: f(w0 + r*mp.e**(1j*th)) * (r*mp.e**(1j*th))**k
    return mp.quad(h, mp.linspace(0, 2*mp.pi, 9))/(2*mp.pi)
half = mp.mpf(1)/2
out = {}
for name, g in (("zero_1", mp.im(mp.zetazero(1))), ("zero_2", mp.im(mp.zetazero(2))), ("generic_online_t15", mp.mpf(15))):
    c2 = coef(lambda w: G(w, half, g), half, 2); c1 = coef(lambda w: G(w, half, g), half, 1)
    pred = -abs(xi(half + 1j*g))**2 * xi(half+half) if False else None
    out[name] = {"abs_coef_order2": float(abs(c2)), "abs_coef_order1": float(abs(c1)),
                 "abs_xi(1/2+ig)^2": float(abs(xi(half+1j*g))**2), "abs_G_at_1/2+1e-6": float(abs(G(half+mp.mpf('1e-6'), half, g)))}
    print(name, out[name])
json.dump(out, open(sys.argv[1], "w"), indent=1)
