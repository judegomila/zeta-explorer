"""Combination 2. (A) track an off-line conjugate pair of a control forward in t to its landing on the real axis: the vortex of
G = H_t + i H_t' at (t*, x*).  (B) winding number of G on boxes [t_i, t_{i+1}] x [x, x+W] and the real-zero count W(t) on each row.
Usage: vortex.py track <kind> <out.json> [maxpairs]      |   vortex.py boxes <kind> <x_start> <nwin> <out.json> [W=20]
"""
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx
import hk

NW = int(os.environ.get('RH_WORKERS', '4'))
PREC = 80
NODES = int(os.environ.get('S3_NODES', '32'))
TL = [1e-4, 1e-3, 1e-2, 0.05, 0.1, 0.2, 0.3, 0.5]

def cond(kind):  # conductor in the density log(q x / 4 pi) / (4 pi) of real zeros per unit x (degree 1); ea has degree 2
    return {'chi4': 4.0, 'dh': 5.0}.get(kind, 1.0)

def spacing(kind, x):
    return 4*math.pi/max(0.5, math.log(cond(kind)*max(x, 30.0)/(4*math.pi)))/(2.0 if kind == 'ea' else 1.0)

def newton(kind, z, t, ref, its=40):
    for _ in range(its):
        J = hk.Hjet(kind, acb(z.real, z.imag), t, ref, NODES, 1)
        d = hk.c128(J[0]/J[1]); z = z - d
        if abs(d) < 1e-13: break
    return z, abs(d)

def track(a):
    kind, x0, y0, label = a
    ctx.prec = PREC
    ref = hk.ref_at(kind, x0)
    t = 1e-7
    z, r = newton(kind, complex(x0, y0), t, ref)
    zs = z; path = [(t, z.real, z.imag)]
    y_stop = min(0.02, 0.15*abs(zs.imag))
    t_est = None
    for step in range(2000):
        J = hk.Hjet(kind, acb(z.real, z.imag), t, ref, NODES, 2)
        v = hk.c128(J[2]/J[1])
        y = z.imag; dy2 = 2*y*v.imag
        if dy2 >= 0:
            t_est = None; dt = 0.002
        else:
            t_est = t + y*y/(-dy2); dt = min(0.01, 0.2*(t_est - t))
        if abs(y) < y_stop and t_est is not None: break
        # midpoint predictor
        zm, _ = newton(kind, z + v*dt/2, t + dt/2, ref, 6)
        Jm = hk.Hjet(kind, acb(zm.real, zm.imag), t + dt/2, ref, NODES, 2)
        vm = hk.c128(Jm[2]/Jm[1])
        z, r = newton(kind, z + vm*dt, t + dt, ref); t += dt
        path.append((t, z.real, z.imag))
        if t > 2.0 or abs(z.imag) > 5: return dict(label=label, kind=kind, x0=x0, y0=y0, fail='no landing', path=path)
    # double real zero: solve H = H' = 0 in (t, x)
    tt, xx = t_est, z.real
    ok = False
    for _ in range(60):
        J = [hk.c128(v).real for v in hk.Hjet(kind, acb(xx), tt, ref, NODES, 3)]
        H, H1, H2, H3 = J
        det = -H2*H2 + H1*H3
        dtt = (-H2*H + H1*H1)/det
        dxx = (-H3*H + H2*H1)/det
        sc = 1.0
        if abs(dxx) > 0.5: sc = 0.5/abs(dxx)
        tt += sc*dtt; xx += sc*dxx
        if abs(dtt) < 1e-12 and abs(dxx) < 1e-11: ok = True; break
    J = [hk.c128(v).real for v in hk.Hjet(kind, acb(xx), tt, ref, NODES, 3)]
    sp = spacing(kind, x0)
    return dict(label=label, kind=kind, x0=zs.real, y0=zs.imag, t_star=tt, x_star=xx, converged=ok, resid=[J[0], J[1]], H2=J[2],
                reach=abs(xx - zs.real), reach_over_spacing=abs(xx - zs.real)/sp, spacing=sp, t_iso=zs.imag**2/2,
                ratio_t=tt/(zs.imag**2/2), nsteps=len(path), path=path[::max(1, len(path)//12)])

def pairs_for(kind, maxn):
    P = []
    if kind == 'dh':
        d = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zeros_DH.json')))
        for b, g, _ in d['offline'][:min(maxn, 40)]: P.append((kind, 2*float(g), 2*(float(b) - 0.5), 'dh gamma=%.4f beta=%.5f' % (float(g), float(b))))
    elif kind.startswith('heat'):
        d = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'zeros_HEAT--0.1.json')))
        for b, g, _ in d['offline'][:min(maxn, 20)]: P.append((kind, 2*float(g), 2*float(b), 'heat gamma=%.4f dbeta=%.5f' % (float(g), float(b))))
    elif kind == 'tnr':
        y0 = 2*math.acosh(hk.TNR_C/2)/math.log(hk.TNR_Q); per = 2*math.pi/math.log(hk.TNR_Q)
        ks = list(range(0, 20)) + [100 + i for i in range(3)] + [1000 + i for i in range(3)] + [8740 + i for i in range(3)]
        for k in ks[:maxn]: P.append((kind, 2*(k + 0.5)*per, y0, 'tnr k=%d' % k))
    elif kind == 'ea':
        ctx.prec = 80
        for n in list(range(1, 11)) + [100, 1000]:
            g = float(acb.zeta_zero(n).imag.mid()); P.append((kind, 2*g, 2*hk.EA_A, 'ea n=%d' % n))
        P = P[:maxn]
    return P

# ---------------- boxes
def _row(a):
    kind, t, xs, xc = a
    ctx.prec = PREC
    ref = hk.ref_at(kind, xc); out = []
    for x in xs:
        J = hk.Hjet(kind, acb(float(x)), t, ref, NODES, 1)
        out.append((hk.c128(J[0]).real, hk.c128(J[1]).real))
    return out

def dd(a, b):
    d = b - a
    return (d + np.pi) % (2*np.pi) - np.pi

def boxes(kind, x_start, nwin, W, pool):
    xc = x_start + nwin*W/2
    sp = spacing(kind, max(x_start, 30.0)); sp = min(sp, spacing(kind, x_start + nwin*W))
    m = max(40, int(math.ceil(W/(sp/16)))); dx = W/m
    xs = x_start + dx*np.arange(nwin*m + 1)
    # rows
    chunks = np.array_split(xs, max(1, NW*4))
    rows = {}
    for t in TL:
        res = pool.map(_row, [(kind, t, c, xc) for c in chunks])
        rows[t] = np.array([v for r in res for v in r])
    # side columns: x = x_start + k W, t between consecutive levels (9 interior samples, geometric)
    sides = {}
    xw = [x_start + k*W for k in range(nwin + 1)]
    for i in range(len(TL) - 1):
        ts = list(np.exp(np.linspace(math.log(TL[i]), math.log(TL[i+1]), 13)))
        cols = []
        res = pool.map(_row, [(kind, tt, np.array(xw), xc) for tt in ts])
        sides[i] = np.array(res)            # shape (13, nwin+1, 2)
    # phases with H' scaled by local spacing/pi
    sc = sp/math.pi
    out = []
    for k in range(nwin):
        sl = slice(k*m, (k + 1)*m + 1)
        rec = dict(x=x_start + k*W, W=W, counts=[], winding=[], maxstep=0.0)
        for t in TL:
            H = rows[t][sl, 0]; rec['counts'].append(int(np.sum(H[:-1]*H[1:] < 0)))
        for i in range(len(TL) - 1):
            b = rows[TL[i]][sl]; tp = rows[TL[i+1]][sl]
            Ab = np.angle(b[:, 0] + 1j*sc*b[:, 1]); At = np.angle(tp[:, 0] + 1j*sc*tp[:, 1])
            L = sides[i][:, k]; R = sides[i][:, k + 1]
            AL = np.angle(L[:, 0] + 1j*sc*L[:, 1]); AR = np.angle(R[:, 0] + 1j*sc*R[:, 1])
            # contour: bottom (x up) -> right side (t up) -> top (x down) -> left side (t down)
            segs = [dd(Ab[:-1], Ab[1:]), dd(AR[:-1], AR[1:]), dd(At[1:], At[:-1])[::-1], dd(AL[1:], AL[:-1])[::-1]]
            w = sum(s.sum() for s in segs)/(2*np.pi)
            rec['winding'].append(float(w)); rec['maxstep'] = max(rec['maxstep'], max(float(np.abs(s).max()) for s in segs))
        out.append(rec)
    return out, dict(dx=dx, m=m, spacing=sp)

if __name__ == '__main__':
    mode, kind = sys.argv[1], sys.argv[2]
    t0 = time.time()
    if mode == 'track':
        outp = sys.argv[3]; maxn = int(sys.argv[4]) if len(sys.argv) > 4 else 10**6
        P = pairs_for(kind, maxn)
        with Pool(NW) as p: res = p.map(track, P, chunksize=1)
        json.dump(dict(kind=kind, results=res, seconds=time.time() - t0), open(outp, 'w'), indent=1)
        for r in res:
            if 't_star' in r: print('%-34s x0=%.4f y0=%.5f t*=%.6f x*=%.4f reach=%.4f (%.3f sp) t*/(y0^2/2)=%.4f conv=%s' % (r['label'], r['x0'], r['y0'], r['t_star'], r['x_star'], r['reach'], r['reach_over_spacing'], r['ratio_t'], r['converged']))
            else: print(r['label'], r.get('fail'))
    else:
        x_start = float(sys.argv[3]); nwin = int(sys.argv[4]); outp = sys.argv[5]; W = float(sys.argv[6]) if len(sys.argv) > 6 else 20.0
        with Pool(NW) as p: res, meta = boxes(kind, x_start, nwin, W, p)
        json.dump(dict(kind=kind, TL=TL, meta=meta, windows=res, seconds=time.time() - t0), open(outp, 'w'))
        nz = [(r['x'], [round(w, 3) for w in r['winding']], r['counts']) for r in res if any(abs(w) > 0.5 for w in r['winding'])]
        print(kind, x_start, nwin, 'windows; nonzero-winding windows:', len(nz), 'max phase step', max(r['maxstep'] for r in res), 'sec', time.time() - t0)
        for v in nz[:40]: print('  ', v)
