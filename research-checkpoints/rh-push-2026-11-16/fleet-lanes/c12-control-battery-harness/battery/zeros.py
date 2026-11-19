"""Zero tables to height H (default 2000).
ZETA: acb.zeta_zeros (Arb; isolation by Turing's method), count checked against arb.zeta_nzeros.
DH: computed here, independently of push/c2-euler-at-zeros/dh_zeros_1000.json:
    on-line zeros by sign changes of the real function Z(t) = Re(e^{i theta(t)} f(1/2+it)), refined to 1e-30;
    box counts by the winding number of f on [-0.5, 1.5] x [t0, t0+10]; off-line zeros by Newton from a lattice of starts
    in boxes where the count exceeds the on-line count; each box is closed when count = on-line + 2 * off-line pairs.
    MEASURED (winding numbers from sampled phases with step control; not an interval certificate).
Derived tables (EA, TNR, WT, SGN-LIOU, THIN, DEL, BEU) are written from the zeta table by the stated rule.
Usage: python zeros.py <outdir> [H] [workers]
"""
import sys, os, json, math, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from flint import acb, arb, ctx, acb_series
import core

PREC = 128
NPREC = 170          # Newton refinement precision
BOX = 10.0
OFFS = 0.0137            # box edges at OFFS + 10 k: away from zeros (checked by the phase-step control)
SL, SR = -0.5, 1.5


def s30(x):
    return x.str(32, radius=False)


def zeta_zeros(H):
    ctx.prec = PREC
    n = int(arb(H).zeta_nzeros().unique_fmpz())
    zs = acb.zeta_zeros(1, n)
    assert all(z.real == arb(1) / 2 for z in zs)
    return n, zs


# ---------------- DH ----------------
_dh = core.DH()


def dh_f(s):
    return _dh.value(s)


def dh_Z(t):
    """real on the critical line; sign changes = zeros of odd order on the line"""
    s = acb(0.5, t)
    w = (s / 2) * (5 / arb.pi()).log() + ((s + 1) / 2).lgamma()
    ph = (acb(0, 1) * w.imag).exp()
    v = ph * dh_f(s)
    return v.real, v.imag


def dh_newton(s0, it=30, tol=1e-36):
    old = ctx.prec; ctx.prec = NPREC
    try:
        return _dh_newton(s0, it, tol)
    finally:
        ctx.prec = old


def _dh_newton(s0, it, tol):
    s = acb(s0)
    for _ in range(it):
        x = acb_series([s, 1], prec=2)
        y = _dh.value(x)
        if y[1] == 0: return None
        ds = y[0] / y[1]
        s = acb(s.real.mid(), s.imag.mid()) - acb(ds.real.mid(), ds.imag.mid())
        if float(abs(ds).upper()) < tol * max(1.0, abs(float(s.imag.mid()))):
            return s
        if not (-1 < float(s.real.mid()) < 3): return None
    return None


def refine_online(t0, t1, z0):
    """bracketed zero of Z in (t0, t1): Newton on f along the line with bisection fallback."""
    ctx.prec = PREC
    r = dh_newton(acb(0.5, 0.5 * (t0 + t1)))
    if r is not None and abs(float(r.real.mid()) - 0.5) < 1e-25 and t0 <= float(r.imag.mid()) <= t1:
        return r.imag.mid()
    a, b = arb(t0), arb(t1); fa = z0
    for _ in range(110):
        m = (a + b) / 2; m = arb(m.mid())
        fm = float(dh_Z(m)[0].mid())
        if (fa < 0) != (fm < 0): b = m
        else: a = m; fa = fm
    return ((a + b) / 2).mid()


def winding(pts):
    ctx.prec = 64
    vals = [dh_f(p) for p in pts]
    tot = 0.0; mx = 0.0
    prev = vals[0]
    for v in vals[1:]:
        q = v / prev
        d = math.atan2(float(q.imag.mid()), float(q.real.mid()))
        tot += d; mx = max(mx, abs(d)); prev = v
    return tot / (2 * math.pi), mx


def box_count(t0, t1):
    n = 250
    while True:
        ts = [t0 + (t1 - t0) * k / n for k in range(n + 1)]
        xs = [SL + (SR - SL) * k / (n // 4) for k in range(n // 4 + 1)]
        path = [acb(x, t0) for x in xs] + [acb(SR, t) for t in ts[1:]] + [acb(x, t1) for x in xs[::-1][1:]] + [acb(SL, t) for t in ts[::-1][1:]]
        w, mx = winding(path)
        if mx < 1.0 or n >= 64000: return int(round(w)), w, mx, n
        n *= 4


def dh_box(args):
    k, step = args
    ctx.prec = PREC
    t0 = OFFS + BOX * k; t1 = t0 + BOX
    out = dict(k=k, t0=t0, t1=t1)
    def scan(step):
        zs = []
        n = int(round(BOX / step))
        def sgn(t):
            ctx.prec = 64
            v = dh_Z(arb(t))[0]
            if not (v > 0 or v < 0):
                ctx.prec = PREC; v = dh_Z(arb(t))[0]
            ctx.prec = PREC
            return float(v.mid())
        tp = t0; zp = sgn(tp)
        for i in range(1, n + 1):
            t = t0 + BOX * i / n
            z = sgn(t)
            if (zp < 0) != (z < 0):
                zs.append(refine_online(tp, t, zp))
            tp, zp = t, z
        return zs
    on = scan(step)
    N, w, mx, n = box_count(t0, t1)
    ctx.prec = PREC          # box_count works at 64 bits
    out.update(count=N, winding=w, max_phase_step=mx, contour_n=n)
    off = []
    def search(dx, dt):
        found = list(off)
        x = 0.55
        while x < 1.2:
            t = t0 + dt / 2
            while t < t1:
                r = dh_newton(acb(x, t), it=14)
                if r is not None:
                    re_, im_ = float(r.real.mid()), float(r.imag.mid())
                    if re_ > 0.5 + 1e-9 and t0 < im_ < t1 and all(abs(r - q).mid() > 1e-12 for q in found):
                        ctx.prec = NPREC; res_ = float(abs(dh_f(r)).upper()); ctx.prec = PREC
                        if res_ < 1e-28: found.append(r)
                t += dt
            x += dx
        return found
    if N - len(on) > 0:
        off = search(0.1, 0.1)
        if N != len(on) + 2 * len(off):
            on = scan(step / 10)
        if N != len(on) + 2 * len(off):
            off = search(0.05, 0.02)
    out['closed'] = (N == len(on) + 2 * len(off))
    out['online'] = [s30(arb(x)) for x in on]
    ctx.prec = NPREC
    out['offline'] = [[s30(r.real), s30(r.imag), float(abs(dh_f(r)).upper())] for r in off]
    ctx.prec = PREC
    return out


def dh_zeros(H, workers, step=0.01):
    import multiprocessing as mp
    nb = int(math.ceil((H - OFFS) / BOX))
    res = []
    with mp.get_context('fork').Pool(workers) as p:
        for r in p.imap_unordered(dh_box, [(k, step) for k in range(nb)], chunksize=1):
            res.append(r)
            print('box %d t0 %.4f count %d online %d offline %d closed %s contour_n %d' % (r['k'], r['t0'], r['count'], len(r['online']), len(r['offline']), r['closed'], r['contour_n']), flush=True)
    res.sort(key=lambda r: r['k'])
    return res


def main():
    out = sys.argv[1]; H = float(sys.argv[2]) if len(sys.argv) > 2 else 2000.0
    workers = int(sys.argv[3]) if len(sys.argv) > 3 else int(os.environ.get('RH_WORKERS', '4'))
    os.makedirs(out, exist_ok=True)
    t0 = time.time()
    n, zs = zeta_zeros(H)
    # residual check |zeta(rho)|
    worst = max(float(abs(z.zeta()).upper()) for z in zs[::50])
    json.dump(dict(object='ZETA', H=H, count=n, count_check='arb.zeta_nzeros(H) = %d' % n, method='acb.zeta_zeros (Arb, Turing isolation); all on Re s = 1/2',
                   max_abs_value_at_sampled_zeros=worst, gamma=[s30(z.imag) for z in zs]), open(os.path.join(out, 'zeros_ZETA.json'), 'w'))
    print('ZETA zeros', n, 'to', H, 'sec %.1f' % (time.time() - t0), flush=True)
    n2, zs2 = zeta_zeros(2 * H)
    json.dump(dict(object='ZETA', H=2 * H, count=n2, note='used for SGN-LIOU zeros rho/2', gamma=[s30(z.imag) for z in zs2]), open(os.path.join(out, 'zeros_ZETA_2H.json'), 'w'))
    res = dh_zeros(H, workers)
    on = [x for r in res for x in r['online']]
    off = [x for r in res for x in r['offline']]
    # the last box may run past H: keep ordinates <= H; first box starts at OFFS: zeros with 0 < t < OFFS would be missed (checked: Z has no sign change there)
    on = [x for x in on if float(x) <= H]; off = [x for x in off if float(x[1]) <= H]
    bad = [dict(k=r['k'], t0=r['t0'], count=r['count'], online=len(r['online']), offline=len(r['offline'])) for r in res if not r['closed']]
    tot = sum(r['count'] for r in res)
    json.dump(dict(object='DH', H=H, boxes=len(res), box_height=BOX, strip=[SL, SR], total_winding_count=tot, online_count=len(on), offline_pairs=len(off),
                   unclosed_boxes=bad, max_phase_step=max(r['max_phase_step'] for r in res),
                   method='sign changes of Z (step 0.01, refined 0.001 where a box did not close) + winding numbers + Newton; MEASURED',
                   note='offline lists the zero with Re s > 1/2 of each pair {beta + i gamma, 1 - beta + i gamma}; conjugates not listed',
                   online=on, offline=off), open(os.path.join(out, 'zeros_DH.json'), 'w'))
    print('DH zeros: boxes %d total count %d on-line %d off-line pairs %d unclosed %d sec %.1f' % (len(res), tot, len(on), len(off), len(bad), time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
