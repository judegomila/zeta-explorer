"""Combination 2 (small-value shear energy), low heights, Arb evaluation of the completed F (source: F(z) = xi(1/2+z)).
A = Re F'/F,  W = |F|^2 A,  Q = (-W)_+,  K_eta = Q/(|F|^2 + eta^2),  E_eta(D) = int_D K_eta^2 dx dt.
Mode 'lens'  NAME gamma delta [X]: grid of A on (0, X] x [gamma-1.2, gamma+1.2]; the set {A < 0} (support of Q): area, extent,
              eta-independent part int (A_-)^2 outside a disc of radius 0.02 about the zero; cost of the winding count of F on the
              boundary of the rectangle plus Newton (function evaluations) against the grid needed to hit the lens.
Mode 'slope' NAME gamma delta: Taylor polynomial of F/F'(rho) at the off-line zero rho; E_eta over the disc |z - rho| < r0 by
              polar-log quadrature for eta = 1e-1 .. 1e-12; slope against log(1/eta); the same on Cartesian grids of spacing h.
Mode 'null'  NAME T0 T1 [X]: min of A/x on a grid (zero-free objects: expected > 0).
Mode 'pole'  : LIOU near the pole at the first zeta zero: E with inner cutoff r_min.
Output: one json line per call."""
import sys, os, json, math, cmath, time
import numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx
import objs
import multiprocessing
if __name__ == '__main__': multiprocessing.set_start_method('fork')

MODE = sys.argv[1]; NAME = sys.argv[2]
O = None
def init(tmax):
    global O
    O = objs.make(NAME, tmax)
    if NAME.startswith('HEAT'): O.setprec()
    else: ctx.prec = 128 + int(1.2 * tmax)        # completed functions are of size e^{-pi t/4}

def jets(sig, t, n):
    if NAME == 'LIOU': return O.jp(acb(arb(sig), arb(t)), n)
    return O.jc(acb(arb(sig), arb(t)), n)

def row(args):
    t, xs = args
    out = []
    for x in xs:
        j = jets(0.5 + x, t, 2)
        q = j[1] / j[0]
        out.append(float(q.real.mid()))
    return out

def grid(xs, ts, tmax):
    with Pool(int(os.environ.get('RH_WORKERS', '4')), initializer=init, initargs=(tmax,)) as p:
        return np.array(p.map(row, [(t, xs) for t in ts], chunksize=4)).T        # [nx, nt]

def newton_zero(sig, t, tmax):
    z = complex(sig, t)
    for _ in range(60):
        j = jets(z.real, z.imag, 2); dz = objs.c128(j[0] / j[1]); z -= dz
        if abs(dz) < 1e-15: break
    return z

if MODE == 'lens':
    gam = float(sys.argv[3]); dlt = float(sys.argv[4]); X = float(sys.argv[5]) if len(sys.argv) > 5 else 0.49
    init(gam + 5)
    dx = dt = float(os.environ.get('LENS_STEP', '0.005'))
    xs = np.arange(1, int(round(X / dx)) + 1) * dx; ts = gam + np.arange(-240, 241) * dt
    t0 = time.time(); A = grid(list(xs), list(ts), gam + 5)
    neg = A < 0
    xx, tt = np.meshgrid(xs, ts, indexing='ij')
    far = (xx - dlt) ** 2 + (tt - gam) ** 2 > (4 * dx) ** 2
    r = dict(mode='lens', name=NAME, gamma=gam, delta=dlt, X=X, dx=dx, dt=dt, zero_inside_D=bool(dlt < X))
    r['neg_points'] = int(neg.sum()); r['neg_area'] = float(neg.sum() * dx * dt)
    if neg.any():
        r['neg_x_range'] = [float(xx[neg].min()), float(xx[neg].max())]
        r['neg_t_minus_gamma_range'] = [float((tt[neg] - gam).min()), float((tt[neg] - gam).max())]
        r['E0_far'] = float((np.where(neg & far, A, 0.0) ** 2).sum() * dx * dt)
        # per-x ordinate extent of the lens and the coarsest uniform grid that still has a node inside it
        ext = [(float(x), float((ts[neg[i]] - gam).min()), float((ts[neg[i]] - gam).max())) for i, x in enumerate(xs) if neg[i].any()]
        r['lens_extent_by_x'] = ext[::max(1, len(ext) // 12)]
        r['lens_width_x'] = r['neg_x_range'][1] - r['neg_x_range'][0] + dx
        r['lens_height_t'] = r['neg_t_minus_gamma_range'][1] - r['neg_t_minus_gamma_range'][0] + dt
        r['grid_points_to_hit_lens_per_unit_area'] = 1.0 / (r['lens_width_x'] * r['lens_height_t'])
    r['min_A_over_x'] = float((A / xx).min()); r['sum_onl_B_estimate_A_over_x_at_edge'] = float((A[0] / xs[0])[0])
    # cost of zero isolation: adaptive winding of F on the boundary of (x0, X) x (gamma - 1.2, gamma + 1.2) + Newton
    nev = [0]
    def F(p):
        nev[0] += 1; return objs.c128(jets(p.real, p.imag, 1)[0] * (arb(math.pi * p.imag / 4).exp() if NAME != 'LIOU' else 1))
    hb = 240 * dt
    c = [complex(0.5 + dx / 2, gam - hb), complex(0.5 + X, gam - hb), complex(0.5 + X, gam + hb), complex(0.5 + dx / 2, gam + hb)]
    tot = 0.0; v = F(c[0])
    for k in range(4):
        p0, p1 = c[k], c[(k + 1) % 4]; L = abs(p1 - p0); d = (p1 - p0) / L; u = 0.0; h = min(0.02, L)
        while u < L - 1e-15:
            while True:
                un = min(L, u + h); w = F(p0 + d * un); da = cmath.phase(w / v)
                if abs(da) <= 0.6 or h < 1e-7: break
                h *= 0.5
            tot += da; u = un; v = w
            if abs(da) < 0.2: h *= 1.6
    r['winding_F_on_boundary'] = tot / (2 * math.pi); r['winding_evals'] = nev[0]
    r['sec'] = time.time() - t0
    print(json.dumps(r), flush=True)

elif MODE == 'slope':
    gam = float(sys.argv[3]); dlt = float(sys.argv[4])
    init(gam + 5)
    z = newton_zero(0.5 + dlt, gam, gam + 5)
    ctxp = ctx.prec
    K = 48
    j = jets(z.real, z.imag, K)
    c1 = j[1]
    c = np.array([objs.c128(j[k] / c1 / math.factorial(k)) for k in range(K)])
    dlt_ = z.real - 0.5
    r0 = 0.8 * min(dlt_, 0.49 - dlt_)
    def fW(w):
        f = np.zeros_like(w); fp = np.zeros_like(w)
        for k in range(K - 1, 0, -1):
            f = f * w + c[k]; fp = fp * w + k * c[k]
        f = f * w + c[0]
        return f, fp
    etas = [10.0 ** -k for k in range(1, 13)]
    # polar-log quadrature
    nu, nphi = 6000, 1440
    u = (np.arange(nu) + 0.5) * (42.0 / nu); phi = (np.arange(nphi) + 0.5) * (2 * math.pi / nphi)
    rr = r0 * np.exp(-u)
    E = np.zeros(len(etas))
    for i0 in range(0, nu, 500):
        w = rr[i0:i0 + 500, None] * np.exp(1j * phi)[None, :]
        f, fp = fW(w); Wv = (fp * np.conj(f)).real; Q = np.maximum(-Wv, 0.0); a2 = np.abs(f) ** 2
        for k, eta in enumerate(etas):
            E[k] += ((Q / (a2 + eta * eta)) ** 2 * (rr[i0:i0 + 500, None] ** 2)).sum() * (42.0 / nu) * (2 * math.pi / nphi)
    mono = [math.pi / 4 * (math.log(1 + r0 ** 2 / e ** 2) + e ** 2 / (r0 ** 2 + e ** 2) - 1) for e in etas]
    slopes = [(E[k + 1] - E[k]) / math.log(10) for k in range(len(etas) - 1)]
    r = dict(mode='slope', name=NAME, zero=[z.real, z.imag], r0=r0, etas=etas, E=list(E), monomial_formula=mono, slopes_per_log=slopes,
             slope_over_half_pi=[s / (math.pi / 2) for s in slopes], taylor_tail=float(abs(c[-1]) * r0 ** (K - 1)))
    # Cartesian grids: what a grid of spacing h can see
    rng = np.random.default_rng(1)
    cart = []
    for h in [0.02, 0.01, 0.005, 0.002, 0.001, 0.0005, 0.0002]:
        n = int(r0 / h)
        off = rng.uniform(0.2, 0.8, 2) * h
        gx = (np.arange(-n, n + 1) * h + off[0]); gt = (np.arange(-n, n + 1) * h + off[1])
        Eg = np.zeros(len(etas))
        for i0 in range(0, len(gx), 200):
            w = gx[i0:i0 + 200, None] + 1j * gt[None, :]
            inside = np.abs(w) < r0
            f, fp = fW(w); Wv = (fp * np.conj(f)).real; Q = np.where(inside, np.maximum(-Wv, 0.0), 0.0); a2 = np.abs(f) ** 2
            for k, eta in enumerate(etas): Eg[k] += ((Q / (a2 + eta * eta)) ** 2).sum() * h * h
        sl = [(Eg[k + 1] - Eg[k]) / math.log(10) / (math.pi / 2) for k in range(len(etas) - 1)]
        sat = next((etas[k] for k in range(len(sl)) if sl[k] < 0.5), None)
        cart.append(dict(h=h, points=int((2 * n + 1) ** 2), E=list(Eg), slope_over_half_pi=sl, eta_where_slope_drops_below_half=sat,
                         nearest_node_distance=float(np.hypot(*np.minimum(off, h - off)))))
    r['cartesian'] = cart
    print(json.dumps(r), flush=True)

elif MODE == 'null':
    T0 = float(sys.argv[3]); T1 = float(sys.argv[4]); X = float(sys.argv[5]) if len(sys.argv) > 5 else 0.49
    xs = [X * 2.0 ** -k for k in range(0, 10)]; ts = list(np.arange(T0, T1, 0.02))
    t0 = time.time(); A = grid(xs, ts, T1 + 5)
    q = A / np.array(xs)[:, None]
    i = np.unravel_index(np.argmin(q), q.shape)
    print(json.dumps(dict(mode='null', name=NAME, T0=T0, T1=T1, X=X, xs=xs, dt=0.02, points=int(q.size), negatives=int((q < 0).sum()),
                          min_A_over_x=float(q.min()), at=[xs[i[0]], ts[i[1]]], sec=time.time() - t0)), flush=True)

elif MODE == 'pole':
    init(40)
    g1 = float(acb.zeta_zero(1).imag.mid()) if hasattr(acb, 'zeta_zero') else 14.134725141734694
    r0 = 0.2; out = []
    nphi = 181; phi = (np.arange(nphi) + 0.5) * (math.pi / nphi) - math.pi / 2
    us = (np.arange(240) + 0.5) * (12.0 / 240)
    acc = 0.0; cum = []
    for u in us:
        rr = r0 * math.exp(-u); s = 0.0
        for p in phi[::6]:
            j = jets(0.5 + rr * math.cos(p), g1 + rr * math.sin(p), 2)
            a = float((j[1] / j[0]).real.mid()); s += min(a, 0.0) ** 2 * rr * rr
        acc += s * (12.0 / 240) * (math.pi / nphi * 6); cum.append(acc)
    print(json.dumps(dict(mode='pole', name=NAME, pole_at=g1, r0=r0, E_cut=[[r0 * math.exp(-us[i]), cum[i]] for i in range(19, 240, 20)],
                          slope_per_log_rmin=(cum[-1] - cum[119]) / (us[-1] - us[119]), predicted=math.pi / 2)), flush=True)
