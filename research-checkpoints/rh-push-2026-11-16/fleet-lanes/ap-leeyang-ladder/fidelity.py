"""Do Lee-Yang-regime ladder truncations (t >= 2 pi M) track zeta zeros?
Phi_M = gamma E + dual, E = prod_p sum_{k<=N_p} p^{-ks}, M = prod p^{N_p}.
Metric: distance from each zeta zero to the nearest zero of Phi_M, in units of the mean spacing
2 pi / log(t/2 pi).  Independent point sets of equal density give mean about 0.25."""
import json, math, sys
import numpy as np, mpmath as mp
from scipy.special import loggamma
mp.mp.dps = 20
def Z(t, depth):
    s = 0.5 + 1j * t
    a = loggamma(s / 2) - (s / 2) * math.log(math.pi)
    E = np.ones_like(s)
    for p, N in depth.items():
        z = np.exp(-s * math.log(p)); f = np.ones_like(s); zz = np.ones_like(s)
        for k in range(N):
            zz = zz * z; f = f + zz
        E = E * f
    return (np.exp(1j * a.imag) * E).real
def zeros(depth, ta, tb, dt=0.0005):
    t = np.arange(ta, tb, dt); v = Z(t, depth)
    i = np.where(np.sign(v[1:]) != np.sign(v[:-1]))[0]
    return t[i] - v[i] * dt / (v[i + 1] - v[i])
def zeta_zeros(ta, tb):
    n = int(mp.nzeros(ta)) + 1; out = []
    while True:
        g = float(mp.zetazero(n).imag)
        if g > tb: break
        if g >= ta: out.append(g)
        n += 1
    return np.array(out)
cases = [('M=12 (2^2*3)', {2: 2, 3: 1}, 76.0, 157.0),
         ('M=30', {2: 1, 3: 1, 5: 1}, 189.0, 289.0),
         ('M=210', {2: 1, 3: 1, 5: 1, 7: 1}, 1320.0, 1380.0),
         ('M=2520 = lcm(1..10)', {2: 3, 3: 2, 5: 1, 7: 1}, 15834.0, 15864.0),
         ('M=1 (gamma only)', {}, 76.0, 157.0)]
out = {}
for name, depth, ta, tb in cases:
    zz = zeta_zeros(ta, tb); zp = zeros(depth, ta - 3, tb + 3)
    sp = 2 * math.pi / np.log(zz / (2 * math.pi))
    d = np.array([np.min(np.abs(zp - g)) for g in zz]) / sp
    inwin = int(np.sum((zp >= ta) & (zp <= tb)))
    Y = math.sqrt(tb / (2 * math.pi))
    out[name] = dict(window=[ta, tb], two_pi_M=2 * math.pi * math.prod(p ** N for p, N in depth.items()),
                     afe_length_sqrt_t_over_2pi=Y, zeta_zeros=len(zz), truncation_zeros=inwin,
                     mean_dist_in_spacings=float(d.mean()), max_dist_in_spacings=float(d.max()))
    print(name, out[name], flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
