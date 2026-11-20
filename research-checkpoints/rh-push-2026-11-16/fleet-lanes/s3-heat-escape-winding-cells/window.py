"""Combination 4: finite form of the walled local window (Lemma B hypotheses (RH-win) and (W)).
  window.py zwin <X> <width_z> <budget_s> <out.json>   zeta: N(g2) - N(g1) by arb.zeta_nzeros (Turing), consecutive zeros isolated on the line by
                                                         acb.zeta_zeros (Hardy Z isolation), g = x/2; stops at the time budget (contiguous prefix reported)
  window.py wall <kind> <xw> <out.json> [coarse]         wall ratio R(y, t) = |H_t(xw + i y)| / |B_0|, B_0 = exp(lg(s') + (t/4) alpha(s')^2), s' = (1+y)/2 + i xw/2,
                                                         alpha = lg' (Polymath M_t with the exact gamma factor), y in [0, 1], t in [0, 0.164]
"""
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx
import hk
NW = int(os.environ.get('RH_WORKERS', '4'))

def _zchunk(a):
    n0, num, deadline = a
    if time.time() > deadline: return (n0, None)
    ctx.prec = 64
    z = acb.zeta_zeros(n0, num)
    return (n0, [(float(q.imag.mid()), float(q.imag.rad())) for q in z], [repr(q.imag) for q in (z[0], z[-1])])

def zwin(X, width, budget):
    ctx.prec = 160
    g1 = arb(X)/2; g2 = (arb(X) + arb(width))/2
    t0 = time.time()
    n1 = int(g1.zeta_nzeros().unique_fmpz()); n2 = int(g2.zeta_nzeros().unique_fmpz())
    tn = time.time() - t0
    print('X', X, 'N(g1)', n1, 'N(g2)', n2, 'zeros in window', n2 - n1, 'count time', tn, flush=True)
    CHK = 16
    tasks = [(n, min(CHK, n2 - n + 1), t0 + budget) for n in range(n1 + 1, n2 + 1, CHK)]
    with Pool(NW) as p: res = p.map(_zchunk, tasks, chunksize=1)
    zs = []; ok = True
    for r in res:
        if r[1] is None: ok = False; break
        zs += r[1]
    g = np.array([z[0] for z in zs])
    out = dict(X=X, width_z=width, g1=float(g1.mid()), n1=n1, n2=n2, zeros_in_window=n2 - n1, isolated_contiguous=len(zs), complete=ok and len(zs) == n2 - n1,
               seconds=time.time() - t0)
    if len(g) > 1:
        mean = 2*math.pi/math.log(float(g1.mid())/(2*math.pi)); d = np.diff(g)/mean
        out.update(first_zero_minus_g1=float(g[0] - float(g1.mid())), last_zero_minus_g1=float(g[-1] - float(g1.mid())), covered_width_z=float(2*(g[-1] - g[0])),
                   max_radius=float(max(z[1] for z in zs)), increasing=bool(np.all(np.diff(g) > 0)), norm_gap_min=float(d.min()), norm_gap_max=float(d.max()),
                   offsets_first_40=[float(v - float(g1.mid())) for v in g[:40]], offsets_last_40=[float(v - float(g1.mid())) for v in g[-40:]])
        # largest gap among the first 40 and the last 40 (wall candidates), as offsets from g1
        def big(v):
            i = int(np.argmax(np.diff(v))); return [float(v[i] - float(g1.mid())), float(v[i+1] - float(g1.mid()))]
        out['wall_gap_left'] = big(g[:40]); out['wall_gap_right'] = big(g[-40:])
        np.save('out/zwin_%g_offsets.npy' % X, g - float(g1.mid()))
    return out

def lg_esc(kind, s):
    lg, _ = hk.parts('zeta' if kind == 'tnr' else kind, s)
    if kind == 'tnr': lg = lg + (s - acb(0.5))*acb(hk.TNR_Q).log()
    return lg

def _wallpt(a):
    kind, xw_str, y, t, prec = a
    ctx.prec = prec
    xw = arb(xw_str)
    tk = t - hk.tau0_of(kind)
    sp = acb(arb(1 + y)/2, xw/2)
    e = acb(arb(2)**(-40))
    lg = lg_esc(kind, sp); al = (lg_esc(kind, sp + e) - lg_esc(kind, sp - e))/(2*e)
    ref = lg.real
    z = acb(xw, arb(y))
    if tk == 0: H = hk.H0n(kind, z, ref)
    else: H = hk.Hjet(kind, z, t, ref, 36, 0)[0]
    B = (lg - ref + (arb(tk)/4)*al*al).exp()
    R = H/B
    return (y, t, float(abs(R).mid()), float(H.real.mid()), float(H.imag.mid()), int(R.rel_accuracy_bits()))

def wall(kind, xw_str, coarse):
    ys = [0, 0.25, 0.5, 0.75, 1.0] if coarse == 'coarse' else [0.1*k for k in range(11)] if coarse != 'fine' else [0.04*k for k in range(26)]
    ts = [0, 0.04, 0.08, 0.12, 0.164] if coarse == 'coarse' else [0, 0.01, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.164] if coarse != 'fine' else [0.004*k for k in range(42)]
    if kind.startswith('heat'): ts = [t + 1e-9 if abs(t - hk.tau0_of(kind)) < 1e-12 else t for t in ts]
    pts = [(kind, xw_str, y, t, 192) for y in ys for t in ts]
    t0 = time.time()
    with Pool(NW) as p: res = p.map(_wallpt, pts, chunksize=1)
    Rm = min(res, key=lambda r: r[2])
    real_row = [r[3] for r in res if r[0] == 0]
    return dict(kind=kind, xw=xw_str, grid_y=ys, grid_t=ts, R_min=Rm[2], at=[Rm[0], Rm[1]], R_max=max(r[2] for r in res), min_rel_accuracy_bits=min(r[5] for r in res),
                real_axis_sign_constant=bool(all(v > 0 for v in real_row) or all(v < 0 for v in real_row)), table=res, seconds=time.time() - t0)


# ---- wall selection: among the centres of the largest gaps near one end of an isolated window, take the abscissa whose real-axis row
#      H_t(xw), t in {0, 0.04, 0.08, 0.12, 0.164}, keeps one sign with the largest min R; then run the (y, t) grid there.
def wallscan(zwin_json, side, grid, ncand=6):
    from decimal import Decimal, getcontext
    getcontext().prec = 40
    d = json.load(open(zwin_json)); X = Decimal(int(d['X']))
    off = np.load('out/zwin_%g_offsets.npy' % d['X'])
    v = off[:60] if side == 'L' else off[-60:]
    gaps = np.diff(v); order = np.argsort(-gaps)[:ncand]
    cands = [str(X + Decimal(repr(float(v[i] + v[i+1])))) for i in order]
    ts = [0, 0.04, 0.08, 0.12, 0.164]
    with Pool(NW) as p: res = p.map(_wallpt, [('zeta', c, 0.0, t, 192) for c in cands for t in ts], chunksize=1)
    rows = []
    for i, c in enumerate(cands):
        r = res[i*len(ts):(i+1)*len(ts)]
        sgn = all(q[3] > 0 for q in r) or all(q[3] < 0 for q in r)
        rows.append(dict(xw=c, gap_gamma=float(gaps[order[i]]), sign_constant=bool(sgn), R_row=[q[2] for q in r], R_min=min(q[2] for q in r), min_bits=min(q[5] for q in r)))
    good = [r for r in rows if r['sign_constant']]
    out = dict(X=d['X'], side=side, candidates=rows, n_sign_constant=len(good))
    if good:
        best = max(good, key=lambda r: r['R_min'])
        out['chosen'] = best['xw']; out['wall'] = wall('zeta', best['xw'], grid)
    return out

if __name__ == '__main__' and sys.argv[1] == 'wallscan':
    r = wallscan(sys.argv[2], sys.argv[3], sys.argv[5] if len(sys.argv) > 5 else 'full')
    json.dump(r, open(sys.argv[4], 'w'), indent=1)
    w = r.get('wall', {})
    print(json.dumps(dict(X=r['X'], side=r['side'], n_sign_constant=r['n_sign_constant'], chosen=r.get('chosen'), R_min=w.get('R_min'), at=w.get('at'), sign=w.get('real_axis_sign_constant'),
                          cands=[(c['xw'], c['sign_constant'], round(c['R_min'], 3)) for c in r['candidates']])))

if __name__ == '__main__':
    os.makedirs('out', exist_ok=True)
    if sys.argv[1] == 'zwin':
        X, width, budget, outp = float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
        r = zwin(X, width, budget)
    elif sys.argv[1] == 'wall':
        kind, xw, outp = sys.argv[2], sys.argv[3], sys.argv[4]
        r = wall(kind, xw, sys.argv[5] if len(sys.argv) > 5 else 'full')
    if sys.argv[1] in ('zwin', 'wall'):
        json.dump(r, open(outp, 'w'), indent=1)
        print(json.dumps({k: v for k, v in r.items() if k not in ('table', 'offsets_first_40', 'offsets_last_40')}))

# ---- split isolation of one window over several single-core units
def zrange(X, width, part, nparts, outp):
    ctx.prec = 160
    g1 = arb(X)/2; g2 = (arb(X) + arb(width))/2
    t0 = time.time()
    n1 = int(g1.zeta_nzeros().unique_fmpz()); n2 = int(g2.zeta_nzeros().unique_fmpz())
    idx = np.array_split(np.arange(n1 + 1, n2 + 1), nparts)[part]
    ctx.prec = 64
    zs = []
    for a in range(0, len(idx), 8):
        z = acb.zeta_zeros(int(idx[a]), int(min(8, len(idx) - a)))
        zs += [(float((q.imag - g1).mid()), float(q.imag.rad())) for q in z]
        json.dump(dict(X=X, width_z=width, n1=n1, n2=n2, part=part, nparts=nparts, first_index=int(idx[0]), count=len(idx), done=len(zs), offsets=zs, seconds=time.time() - t0), open(outp, 'w'))
    print('zrange part', part, 'done', len(zs), 'of', len(idx), time.time() - t0, flush=True)

def zmerge(X, width, nparts, outp):
    parts = [json.load(open('out/zr_%g_%d.json' % (X, p))) for p in range(nparts)]
    n1, n2 = parts[0]['n1'], parts[0]['n2']
    zs = []; ok = True
    for p in parts:
        if p['done'] < p['count']: ok = False; zs += p['offsets']; break
        zs += p['offsets']
    off = np.array([z[0] for z in zs]); g1 = X/2
    mean = 2*math.pi/math.log(g1/(2*math.pi)); d = np.diff(off)/mean
    def big(v):
        i = int(np.argmax(np.diff(v))); return [float(v[i]), float(v[i+1])]
    out = dict(X=X, width_z=width, g1=g1, n1=n1, n2=n2, zeros_in_window=n2 - n1, isolated_contiguous=len(zs), complete=ok and len(zs) == n2 - n1,
               first_zero_minus_g1=float(off[0]), last_zero_minus_g1=float(off[-1]), covered_width_z=float(2*(off[-1] - off[0])), max_radius=float(max(z[1] for z in zs)),
               increasing=bool(np.all(np.diff(off) > 0)), norm_gap_min=float(d.min()), norm_gap_max=float(d.max()), wall_gap_left=big(off[:40]), wall_gap_right=big(off[-40:]),
               seconds=sum(p['seconds'] for p in parts))
    np.save('out/zwin_%g_offsets.npy' % X, off)
    json.dump(out, open(outp, 'w'), indent=1); print(json.dumps(out))

if __name__ == '__main__' and sys.argv[1] == 'zrange':
    zrange(float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), sys.argv[6])
if __name__ == '__main__' and sys.argv[1] == 'zmerge':
    zmerge(float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5])
