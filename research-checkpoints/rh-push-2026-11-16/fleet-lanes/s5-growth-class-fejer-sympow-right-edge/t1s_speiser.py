"""s5 Speiser companion (script t1_low.py of s2-derivative-zeros-two-line; s5 adds RH_JET: 1 = f' (default), 0 = f).
Combination 1 (Speiser / Levinson-Montgomery), low heights, Arb evaluation.
For the Dirichlet-normalised f of each object: winding number of f' on the boundary of [sL, sR] x [T, T+H]
(sR = abscissa of the symmetry line of the zero set: 1/2, or 1/4 for LIOU), then Newton location of the zeros of f' inside.
The winding is a sampled one (adaptive step, argument increment <= 0.6 rad, Arb values at >= 128 bits): MEASURED.
Usage: t1_low.py NAME T_start T_end H out.json [sL]"""
import sys, os, json, math, cmath, time
from multiprocessing import Pool
from flint import acb, arb, ctx
import objs

NAME = sys.argv[1]; TA = float(sys.argv[2]); TB = float(sys.argv[3]); H = float(sys.argv[4]); OUT = sys.argv[5]
SL = float(sys.argv[6]) if len(sys.argv) > 6 else 0.01
O = None; NEV = 0; JET = int(os.environ.get('RH_JET', '1'))

def init():
    global O
    O = objs.make(NAME, TB + 5)
    if NAME.startswith('HEAT'): O.setprec()
    else: ctx.prec = 128

def fp(sig, t):
    global NEV
    NEV += 1
    return objs.c128(O.jp(acb(arb(sig), arb(t)), 2)[JET])

def edge(p0, p1, v0):
    """argument change of f' along the segment p0 -> p1 (complex numbers sigma + i t); returns (change, value at p1, max step)."""
    L = abs(p1 - p0); u = 0.0; h = min(0.02, L); tot = 0.0; v = v0; mx = 0.0; d = (p1 - p0) / L
    while u < L - 1e-15:
        while True:
            un = min(L, u + h); p = p0 + d * un
            w = fp(p.real, p.imag); da = cmath.phase(w / v)
            if abs(da) <= 0.6 or h < 1e-7: break
            h *= 0.5
        tot += da; mx = max(mx, abs(da)); u = un; v = w
        if abs(da) < 0.2: h *= 1.6
    return tot, v, mx

def window(T):
    global NEV
    NEV = 0; t0 = time.time()
    sR = O.left_edge
    c = [complex(SL, T), complex(sR, T), complex(sR, T + H), complex(SL, T + H)]
    v = fp(c[0].real, c[0].imag); tot = 0.0; mx = 0.0
    for k in range(4):
        a, v, m = edge(c[k], c[(k + 1) % 4], v); tot += a; mx = max(mx, m)
    wn = tot / (2 * math.pi); n = int(round(wn)); nwind = NEV
    roots = []
    if n != 0 and JET == 1 and os.environ.get('RH_NEWTON', '1') == '1':
        step = 0.5
        for attempt in range(3):
            sg = [SL + (sR - SL) * (k + 0.5) / 5 for k in range(5)]
            k = 0
            while T + k * step <= T + H:
                for s0 in sg:
                    z = complex(s0, T + k * step); ok = False
                    for it in range(40):
                        j = O.jp(acb(arb(z.real), arb(z.imag)), 3); NEV += 1
                        f1 = objs.c128(j[1]); f2 = objs.c128(j[2])
                        if f2 == 0: break
                        dz = f1 / f2
                        if abs(dz) > 0.3: dz *= 0.3 / abs(dz)
                        z -= dz
                        if not (SL - 0.2 < z.real < sR + 0.2 and T - 1 < z.imag < T + H + 1): break
                        if abs(dz) < 1e-13: ok = True; break
                    if ok and SL < z.real < sR and T < z.imag <= T + H and all(abs(z - r) > 1e-7 for r in roots): roots.append(z)
                k += 1
            if len(roots) >= n: break
            step /= 4
    return dict(T=T, winding=wn, count=n, max_step=mx, roots=[[r.real, r.imag] for r in sorted(roots, key=lambda r: r.imag)],
                evals_winding=nwind, evals_total=NEV, sec=time.time() - t0)

if __name__ == '__main__':
    Ts = []; T = TA
    while T < TB - 1e-9: Ts.append(T); T += H
    nw = int(os.environ.get('RH_WORKERS', '4'))
    print('t1_low', NAME, 'windows', len(Ts), 'H', H, 'workers', nw, flush=True)
    res = []
    with Pool(nw, initializer=init) as p:
        for r in p.imap(window, Ts):
            res.append(r)
            print('%s T %.2f winding %.4f count %d roots %s  maxstep %.2f evals %d/%d %.1fs' % (NAME, r['T'], r['winding'], r['count'],
                  ' '.join('(%.6f, %.6f)' % tuple(x) for x in r['roots']), r['max_step'], r['evals_winding'], r['evals_total'], r['sec']), flush=True)
    json.dump(dict(name=NAME, sL=SL, sR=objs.make(NAME, 10).left_edge if not NAME.startswith('HEAT') else 0.5, H=H, windows=res), open(OUT, 'w'), indent=0)
    print('total count', sum(r['count'] for r in res), 'roots found', sum(len(r['roots']) for r in res), flush=True)
