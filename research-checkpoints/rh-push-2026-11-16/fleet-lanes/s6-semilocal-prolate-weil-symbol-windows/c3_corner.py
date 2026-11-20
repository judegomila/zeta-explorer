#!/usr/bin/env python3
"""Combination 3, pencil part: region of the local parameter where L_S - D_S = Arch - sum x_n C_n P_n >= 0 on the pole-free subspace of L^2(-a,a),
for the low-moment corner (first k pole-free Legendre directions, k <= 8) and for a large Galerkin space. Forms from lane s2 (pencil.py).
x_2 = Re alpha_2, x_4 = Re alpha_2^2, x_3 = Re alpha_3 (real test functions).
usage: c3_corner.py NBIG OUT"""
import sys, math, json, os, time
import numpy as np
import pencil as pc
NBIG = int(sys.argv[1]) if len(sys.argv) > 1 else 96; OUT = sys.argv[2] if len(sys.argv) > 2 else 'out3'
os.makedirs(OUT, exist_ok=True); t0 = time.time()
LN2, LN3 = math.log(2), math.log(3); C2, C3, C4 = pc.C2, pc.C3, pc.C4
def mats(twoa, N):
    d = pc.build(twoa / 2, N); B = d['B']
    return d, B, B.T @ d['Ae'] @ B, [B.T @ d[f'P{n}'] @ B * c for n, c in ((2, C2), (3, C3), (4, C4))]
def lmin_batch(Ms):
    return np.linalg.eigvalsh(0.5 * (Ms + np.swapaxes(Ms, -1, -2)))[..., 0]
def ray_dist(f, c0, nray=64, rmax=6.0):
    """distance from c0 (inside) to the boundary of {f >= 0} along rays; returns (min distance, angle)"""
    best = (float('inf'), None)
    for j in range(nray):
        th = 2 * math.pi * j / nray; dv = np.array([math.cos(th), math.sin(th)])
        if f(c0 + rmax * dv) >= 0: continue
        lo, hi = 0.0, rmax
        for _ in range(50):
            mid = 0.5 * (lo + hi)
            if f(c0 + mid * dv) >= 0: lo = mid
            else: hi = mid
        if lo < best[0]: best = (lo, th)
    return best
res = {}
# (i) support ln 3: only n = 2 enters; region in the alpha_2 plane is the strip x_- <= Re alpha_2 <= x_+
rows = []
for N in list(range(3, 11)) + [NBIG]:
    d, B, Ae, P = mats(LN3 - 1e-9, N)
    iv = pc.interval(lambda x: Ae - x * P[0], -80.0, 80.0, 0.0)
    row = dict(N=N, k=N - 2, lmin_x1=pc.lmin(Ae - P[0]), xminus=iv[0], xplus=iv[1], dist=min(1 - iv[0], iv[1] - 1))
    if N in (10, NBIG):
        # binding direction at x_+: fraction of |ghat|^2 in the p = 2 resonance window (8.145, 9.875)
        M = Ae - iv[1] * P[0]; wv, V = np.linalg.eigh(0.5 * (M + M.T)); g = B @ V[:, 0]
        a = (LN3 - 1e-9) / 2; gx, gw = np.polynomial.legendre.leggauss(400); u = a * gx; wq = a * gw
        gu = pc.legendre(N, a, u) @ g; tt = np.arange(0, 80, 0.005)
        gh = (np.exp(-1j * np.outer(tt, u)) * (wq * gu)[None, :]).sum(axis=1); dens = np.abs(gh) ** 2
        tot = math.pi * float(np.sum(wq * gu ** 2)); win = float(np.sum(dens[(tt > 8.145) & (tt < 9.875)]) * 0.005); low = float(np.sum(dens[tt < 3.597]) * 0.005)
        row.update(window_fraction=win / tot, arch_window_fraction=low / tot, captured_0_80=float(np.sum(dens) * 0.005) / tot)
    rows.append(row); print('RESULT3c ln3', json.dumps(row), flush=True)
res['ln3'] = rows
# (ii) support ln 4: n = 2, 3; region in (x_2, x_3)
G = 200; xs = np.linspace(-3, 3, G)
rows = []
for N in (10, NBIG):
    d, B, Ae, P = mats(2 * LN2 - 1e-9, N)
    X2, X3 = np.meshgrid(xs, xs, indexing='ij')
    lm = np.empty((G, G))
    for i in range(G): lm[i] = lmin_batch(Ae[None] - X2[i][:, None, None] * P[0][None] - X3[i][:, None, None] * P[1][None])
    f = lambda c: pc.lmin(Ae - c[0] * P[0] - c[1] * P[1])
    dist, th = ray_dist(f, np.array([1.0, 1.0]))
    row = dict(N=N, k=N - 2, lmin_11=f(np.array([1.0, 1.0])), area=float((lm >= 0).mean() * 36), dist=dist, angle=th,
               sign2=f(np.array([-1.0, 1.0])), sign23=f(np.array([-1.0, -1.0])), drop2=f(np.array([0.0, 1.0])))
    rows.append(row); print('RESULT3c ln4', json.dumps(row), flush=True); np.save(f'{OUT}/c3corner_ln4_N{N}.npy', lm)
res['ln4'] = rows
# (iii) support 1.5: n = 2, 3, 4; complex alpha_2 (x_2 = Re alpha, x_4 = Re alpha^2), alpha_3 = 1
ys = np.linspace(-1.5, 1.5, G); rows = []
for N in (10, NBIG):
    d, B, Ae, P = mats(1.5, N)
    base = Ae - P[1]
    AR, AI = np.meshgrid(ys, ys, indexing='ij'); X2 = AR; X4 = AR ** 2 - AI ** 2
    lm = np.empty((G, G))
    for i in range(G): lm[i] = lmin_batch(base[None] - X2[i][:, None, None] * P[0][None] - X4[i][:, None, None] * P[2][None])
    f = lambda c: pc.lmin(base - c[0] * P[0] - (c[0] ** 2 - c[1] ** 2) * P[2])
    dist, th = ray_dist(f, np.array([1.0, 0.0]), rmax=3.0)
    vals = {nm: f(np.array(c)) for nm, c in (('alpha=1', (1.0, 0.0)), ('alpha=-1', (-1.0, 0.0)), ('alpha=e^i', (math.cos(1), math.sin(1))), ('alpha=2^0.2', (2 ** 0.2, 0.0)), ('alpha=2^-0.2', (2 ** -0.2, 0.0)), ('alpha=0', (0.0, 0.0)), ('alpha=i', (0.0, 1.0)))}
    row = dict(N=N, k=N - 2, area=float((lm >= 0).mean() * 9), dist=dist, angle=th, values=vals)
    rows.append(row); print('RESULT3c 1.5', json.dumps(row), flush=True); np.save(f'{OUT}/c3corner_a15_N{N}.npy', lm)
res['a1.5'] = rows
json.dump(res, open(f'{OUT}/c3corner_N{NBIG}.json', 'w')); print(f'done {time.time()-t0:.0f}s')
