"""Origin reading z0* = i y_N from the completed function: (xi'/xi)'(1/2 + y) = sum over all zeros of 1/(gamma + i y)^2, |(xi'/xi)''| = |m''|. mpmath, 30 digits."""
import mpmath as mp, json, os
mp.mp.dps = 30
xi = lambda s: s * (s - 1) / 2 * mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
L = lambda s: mp.log(xi(s))
out = {}
for N in (10 ** 3, 10 ** 5, 10 ** 8):
    y = mp.sqrt(2 * mp.pi / N); s = mp.mpf(1) / 2 + y
    d2 = mp.diff(L, s, 2); d3 = mp.diff(L, s, 3)
    out[N] = dict(y=float(y), mprime=float(d2), mpp_abs=float(abs(d3)), Cren=float(y ** 1.5 * abs(d2)), Ccurv=float(y ** 2.5 * abs(d3)))
    print(N, out[N], flush=True)
out['two_sum_gamma_minus2'] = float(mp.diff(L, mp.mpf(1) / 2, 2)); print(out['two_sum_gamma_minus2'])
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out', 'c12_origin_function_side.json'), 'w'), indent=1)
