"""Arb re-checks of the float64 screens (combinations 1 and 2, zeta at large height).
Mode t1 T0 d0 H [nwin]: sampled winding of zeta' on [0.01, 0.5] x [T0+d0+kH, T0+d0+(k+1)H] with Arb values
        (zeta' by central differences of acb.zeta at 360 bits; adaptive step, argument increment <= 0.6 rad).
Mode t2 gpu.json [npts]: Re xi'/xi (1/2 + x + i t)/x at the grid point where each strip had its minimum and at npts random
        points of each strip, against Im(Z'/Z)/x from the evaluator."""
import sys, os, json, math, cmath, time
import numpy as np
import multiprocessing
from flint import acb, arb, ctx

def zp(sig, T0, d):
    ctx.prec = 300
    h = arb(2) ** (-60); s = acb(arb(sig), arb(T0) + arb(d))
    v = ((s + h).zeta() - (s - h).zeta()) / (2 * h)
    return complex(float(v.real.mid()), float(v.imag.mid()))

def t1win(args):
    T0, d0, H = args; t0 = time.time(); nev = 0
    c = [complex(0.01, d0), complex(0.5, d0), complex(0.5, d0 + H), complex(0.01, d0 + H)]
    v = zp(c[0].real, T0, c[0].imag); tot = 0.0; mx = 0.0
    for k in range(4):
        p0, p1 = c[k], c[(k + 1) % 4]; L = abs(p1 - p0); dd = (p1 - p0) / L; u = 0.0; h = min(0.01, L)
        while u < L - 1e-15:
            while True:
                un = min(L, u + h); p = p0 + dd * un; w = zp(p.real, T0, p.imag); nev += 1; da = cmath.phase(w / v)
                if abs(da) <= 0.6 or h < 1e-8: break
                h *= 0.5
            tot += da; mx = max(mx, abs(da)); u = un; v = w
            if abs(da) < 0.2: h *= 1.6
    return dict(T0=T0, d0=d0, H=H, winding=tot / (2 * math.pi), max_step=mx, evals=nev, sec=time.time() - t0)

def xi_logder(args):
    T0, d, x = args
    ctx.prec = 300
    h = arb(2) ** (-60); s = acb(arb(1) / 2 + arb(x), arb(T0) + arb(d))
    def lxi(u): return (u * (u - 1) / 2).log() - u / 2 * arb.pi().log() + (u / 2).lgamma() + u.zeta().log()
    f = lambda u: u.zeta()
    zl = ((s + h).zeta() - (s - h).zeta()) / (2 * h) / s.zeta()
    g = 1 / s + 1 / (s - 1) - arb.pi().log() / 2 + (s / 2).digamma() / 2
    return float((zl + g).real.mid()) / x

if __name__ == '__main__':
    multiprocessing.set_start_method('fork')
    nw = int(os.environ.get('RH_WORKERS', '4'))
    if sys.argv[1] == 't1':
        T0 = float(sys.argv[2]); d0 = float(sys.argv[3]); H = float(sys.argv[4]); n = int(sys.argv[5]) if len(sys.argv) > 5 else 8
        with multiprocessing.Pool(nw) as p:
            for r in p.imap(t1win, [(T0, d0 + k * H, H) for k in range(n)]): print(json.dumps(r), flush=True)
    else:
        import zgpu
        J = json.load(open(sys.argv[2])); npts = int(sys.argv[3]) if len(sys.argv) > 3 else 40
        rng = np.random.default_rng(5)
        for st in J['strips']:
            T0 = st['T0']; w = zgpu.Win(T0)
            pts = [(st['min_at_x_delta'][1], st['min_at_x_delta'][0])]
            for _ in range(npts): pts.append((float(rng.uniform(0, st['rectangles'] * st['H'])), float(J['xs'][rng.integers(0, len(J['xs']))])))
            with multiprocessing.Pool(nw) as p: ref = p.map(xi_logder, [(T0, d, x) for d, x in pts])
            mine = []
            for d, x in pts:
                Z, Zp, _ = w.eval(np.array([d]), [x], order=1); mine.append(float((Zp[0, 0] / Z[0, 0]).imag / x))
            rel = [abs(a - b) / abs(a) for a, b in zip(ref, mine)]
            print(json.dumps(dict(T0=T0, points=len(pts), arb_value_at_strip_minimum=ref[0], float64_value_at_strip_minimum=mine[0],
                                  min_arb_value=min(ref), max_rel_difference=max(rel))), flush=True)
