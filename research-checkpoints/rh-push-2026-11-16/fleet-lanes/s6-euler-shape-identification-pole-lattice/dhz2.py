"""Server: zeros of the Davenport-Heilbronn function with Re s >= 1 up to height T (Arb Hurwitz zeta, 64 bits
grid screen; candidates refined by Newton at 128 bits; a refined zero is then certified by a winding count on a
small square with ball arithmetic)."""
import sys, json, os, math
from multiprocessing import Pool
import flint
from flint import acb, arb
def dh(s):
    s5 = arb(5).sqrt(); x = ((10 - 2*s5).sqrt() - 2)/(s5 - 1)
    return (acb(5)**(-s))*(s.zeta(acb(arb(1)/5)) + x*s.zeta(acb(arb(2)/5)) - x*s.zeta(acb(arb(3)/5)) - s.zeta(acb(arb(4)/5)))
SIG = [1.0, 1.03, 1.06, 1.09, 1.12]
def chunk(args):
    t0, t1, h = args; flint.ctx.prec = 64; out = []; t = t0; prev = (9, 9); cur = None
    vals = []
    while t < t1:
        m = min(float(abs(dh(acb(sg, t))).mid()) for sg in SIG); vals.append((t, m)); t += h
    for k in range(1, len(vals)-1):
        if vals[k][1] < vals[k-1][1] and vals[k][1] <= vals[k+1][1] and vals[k][1] < 0.12: out.append(vals[k])
    return out, min(v[1] for v in vals)
def refine(t):
    flint.ctx.prec = 128; best = None
    for sg in SIG:
        z = acb(sg, t)
        for _ in range(50):
            h = acb(arb(2)**-40); f = dh(z); d = (dh(z+h) - dh(z-h))/(2*h); st = f/d
            z = acb(z.real.mid(), z.imag.mid()) - acb(st.real.mid(), st.imag.mid())
            if float(abs(st).mid()) < 1e-30: break
        zr = float(z.real.mid()); zi = float(z.imag.mid())
        if zr >= 1.0 and abs(zi - t) < 0.5 and float(abs(dh(z)).mid()) < 1e-25: best = (zr, zi); break
    return best
def certify(zr, zi, r=1e-6, n=64):
    """winding number of dh on the square of half-side r around the point; ball arithmetic on the arguments"""
    flint.ctx.prec = 128; pts = []
    for k in range(n): pts.append(acb(zr - r + 2*r*k/n, zi - r))
    for k in range(n): pts.append(acb(zr + r, zi - r + 2*r*k/n))
    for k in range(n): pts.append(acb(zr + r - 2*r*k/n, zi + r))
    for k in range(n): pts.append(acb(zr - r, zi + r - 2*r*k/n))
    v = [dh(p) for p in pts]; tot = arb(0)
    for k in range(len(v)): tot += (v[(k+1) % len(v)]/v[k]).arg()
    return float((tot/(2*arb.pi())).mid())
if __name__ == '__main__':
    T = float(sys.argv[1]); h = float(sys.argv[2]); W = int(os.environ.get('RH_WORKERS', '4'))
    step = 50.0; tasks = [(a, min(a+step+h, T), h) for a in [0.5 + step*k for k in range(int(T/step)+1)] if a < T]
    with Pool(W) as p: res = p.map(chunk, tasks, chunksize=4)
    cands = sorted(c for r, _ in res for c in r); gmin = min(m for _, m in res)
    print('grid minimum of |DH| on 1 <= Re s <= 1.12, t <=', T, ':', gmin, 'candidates', len(cands), flush=True)
    zs = []
    for t, m in cands:
        z = refine(t)
        if z and not any(abs(z[1]-w[1]) < 1e-6 for w in zs): zs.append(z + (certify(*z),))
    for z in zs: print('zero', z, flush=True)
    json.dump(dict(T=T, h=h, grid_min=gmin, candidates=cands, zeros=zs), open('out/dh_right_zeros.json', 'w'), indent=1)
