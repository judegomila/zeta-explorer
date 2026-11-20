#!/usr/bin/env python3
"""Combination 3, symbol part: region in the complex alpha_2 plane where  M(t; alpha) = 2theta'(t) + 2Re(L'/L)(alpha; t) + deltahat_zeta(t) >= 0
for all real t (the source reading: the Euler term is changed and the remainder of zeta is kept). L = 1/(1 - alpha 2^-s), |alpha| < sqrt 2.
For the consistent swap (remainder of the swapped operator) the multiplier is >= 0 for every alpha (unitarity; lane s2 F1; c3_symbol.py runs).
Grid: the Euler term depends on t through phi = t log 2 mod 2 pi only, so A(t) = 2theta' + deltahat is first reduced to its minimum in each of NB phase bins
(bin-centre evaluation of the Euler term; error bound printed). Distances along rays: exact minimum over all t-points.
usage: c3_map.py HATFILE OUT [G NB]"""
import sys, math, json, os, time
import numpy as np
ts, tth, hat = np.load(sys.argv[1]); OUT = sys.argv[2]; G = int(sys.argv[3]) if len(sys.argv) > 3 else 200; NB = int(sys.argv[4]) if len(sys.argv) > 4 else 8192
t0 = time.time(); LP = math.log(2); A = tth + hat
phi = np.mod(ts * LP, 2 * math.pi); b = np.minimum((phi / (2 * math.pi) * NB).astype(np.int64), NB - 1)
E = np.full(NB, np.inf); np.minimum.at(E, b, A)
pc = (np.arange(NB) + 0.5) * 2 * math.pi / NB; zb = 2 ** -0.5 * np.exp(-1j * pc); zbc = np.conj(zb)
print(f't-points={len(ts)} on [0,{ts[-1]:g}], min A = {A.min():.6f}; {NB} phase bins (all filled: {bool(np.isfinite(E).all())}); grid {G}x{G}', flush=True)
def euler(al, z): return -2 * LP * (al * z / (1 - al * z)).real
xs = np.linspace(-1.5, 1.5, G); AR, AI = np.meshgrid(xs, xs, indexing='ij'); al = (AR + 1j * AI).ravel()
ok = np.abs(al) < math.sqrt(2) * 0.995; m = np.full(al.shape, np.nan)
idx = np.where(ok)[0]
for a in range(0, len(idx), 500):
    c = al[idx[a:a + 500], None]
    m[idx[a:a + 500]] = np.minimum((E[None, :] + euler(c, zb[None, :])).min(axis=1), (E[None, :] + euler(c, zbc[None, :])).min(axis=1))
m = m.reshape(G, G); np.save(f'{OUT}/c3map_min.npy', m)
z = 2 ** (-0.5 - 1j * ts); zc = np.conj(z)
def f1(c): return float(min((A + euler(c, z)).min(), (A + euler(c, zc)).min()))
def fbin(c): return float(min((E + euler(c, zb)).min(), (E + euler(c, zbc)).min()))
best = (float('inf'), None); rays = []
for j in range(64):
    th = 2 * math.pi * j / 64; dv = complex(math.cos(th), math.sin(th)); lo, hi = 0.0, 0.4
    if f1(1 + hi * dv) >= 0: rays.append((th, None)); continue
    for _ in range(34):
        mid = 0.5 * (lo + hi)
        if f1(1 + mid * dv) >= 0: lo = mid
        else: hi = mid
    rays.append((th, lo))
    if lo < best[0]: best = (lo, th)
names = (('alpha=1', 1.0), ('alpha=-1', -1.0), ('alpha=e^i', complex(math.cos(1), math.sin(1))), ('alpha=2^0.2', 2 ** 0.2), ('alpha=2^-0.2', 2 ** -0.2), ('alpha=0', 0.0), ('alpha=i', 1j), ('alpha=0.99', 0.99), ('alpha=1.01', 1.01), ('alpha=0.9', 0.9), ('alpha=1.1', 1.1))
vals = {nm: f1(c) for nm, c in names}; valsb = {nm: fbin(c) for nm, c in names}
inside = (m >= 0); area = float(np.nansum(inside) * (3.0 / (G - 1)) ** 2); ii = np.argwhere(inside)
out = dict(G=G, NB=NB, tmax=float(ts[-1]), tpoints=int(len(ts)), min_at_alpha1=vals['alpha=1'], area=area, cells_inside=int(inside.sum()), dist=best[0], dist_angle=best[1], rays=rays, values=vals, values_binned=valsb,
           bin_error_max=max(abs(vals[k] - valsb[k]) for k in vals),
           region_bbox=[float(xs[ii[:, 0].min()]), float(xs[ii[:, 0].max()]), float(xs[ii[:, 1].min()]), float(xs[ii[:, 1].max()])] if len(ii) else None, seconds=time.time() - t0)
json.dump(out, open(f'{OUT}/c3map.json', 'w'))
print('RESULT3m', json.dumps({k: v for k, v in out.items() if k != 'rays'}), flush=True)
print('rays (angle, distance):', [(round(a, 3), None if d is None else round(d, 5)) for a, d in rays][::4], flush=True)
