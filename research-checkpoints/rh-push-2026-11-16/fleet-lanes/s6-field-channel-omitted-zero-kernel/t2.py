"""Combination 2: the field-channel bracket for the first collision time against the collision time of the flow of the full zero set.

Bracket (imp-3933; eps' = 0 is imp-3725), window x_1 < ... < x_n, gaps g_l, H = min gap at gap a, thetaBar = 0.99, T = H^2/(8 thetaBar):
   tLo = ln(1 + eps' H^2/4)/(2 eps'),   tHi = H^2/(8 theta),   theta = 1 - (Psi + 2 eps' H^2)/8,
   Psi = 4 H^2 sum_{j not in pair} 1/D_j^2,  D_j = path sum of s_l,  s_l^2 = max(g_l^2 e^{-2 eps' T} - (4/eps')(1 - e^{-2 eps' T}), 0).
Two forms: uniform (one eps' = max_l eps'_l) and per gap (s_l with eps'_l, record term with eps'_a, tLo = min_l ln(1 + eps'_l g_l^2/4)/(2 eps'_l)).
eps'_l = 2 K_l(0) (the factor-2 ceiling of imp-95518), K_l(0) = 2 sum over zeros outside the window of 1/(|x_l - y||x_{l+1} - y|).
"declared": K from the on-line list only.  "honest": the off-line zeros of the object included (absolute values).
True flow: flow.RegFlow on the window, LB on-line neighbours on each side and the off-line zeros near them as moving particles, the next FAR
zeros on each side and the density tails as a frozen linear field.

Modes:
  t2.py plateau LIST.npy OUT.json                      reproduces the imp-3725 plateau table (K_paper <= 2.424e-6) on [1e4, 1e6]
  t2.py win NAME KIND LIST.npy Q PAR OUT.json NWIN [OFF]   KIND plain | off (OFF = npz with on, offx, offg) | tnr (OFF = q) ;  NWIN windows of 200
"""
import sys, os, math, json, numpy as np, fk, flow

THB = 0.99
def s2(g, e, T):
    g = np.asarray(g, np.float64); e = np.broadcast_to(np.asarray(e, np.float64), g.shape)
    out = g * g - 8 * T
    m = e > 1e-12
    out = np.where(m, g * g * np.exp(-2 * e * T) - np.where(m, 4 / np.where(m, e, 1), 0) * (1 - np.exp(-2 * e * T)), out)
    return np.maximum(out, 0)
def tlo(g, e):
    g = np.asarray(g, np.float64); e = np.asarray(e, np.float64)
    return np.where(e > 1e-12, np.log1p(e * g * g / 4) / (2 * np.where(e > 1e-12, e, 1)), g * g / 8)
def psi(x, a, s):
    """4 H^2 sum_{j != a, a+1} 1/D_j^2 with D_j the path sums of s (s_l = frozen gap l between x_l and x_{l+1})"""
    H = x[a + 1] - x[a]
    up = np.cumsum(s[a + 1:]); dn = np.cumsum(s[:a][::-1])
    with np.errstate(divide='ignore'):
        return 4 * H * H * ((1 / up ** 2).sum() + (1 / dn ** 2).sum()), (float(min(up[0] if len(up) else np.inf, dn[0] if len(dn) else np.inf)))
def bracket(x, eps):
    """eps: array per gap.  Returns dict with the uniform and the per-gap bracket.  thetaBar: the largest of 0.99, 0.95, 0.9, 0.8, 0.7, 0.5 that is
    self-consistent (theta >= thetaBar); the source uses 0.99 on record pairs of N >= 1e4."""
    g = np.diff(x); a = int(np.argmin(g)); H = float(g[a]); out = dict(a=a, H=H)
    for nm, e in (('uni', np.full(len(g), float(np.max(eps)))), ('pg', np.asarray(eps, np.float64))):
        for thb in (0.99, 0.95, 0.9, 0.8, 0.7, 0.5):
            T = H * H / (8 * thb)
            s = np.sqrt(s2(g, e, T)); P, Dmin = psi(x, a, s)
            th = 1 - (P + 2 * e[a] * H * H) / 8
            if th >= thb: break
        out[nm] = dict(eps_record=float(e[a]), eps_max=float(e.max()), Psi=float(P), theta=float(th), thetaBar=thb, certifies=bool(th >= thb), Dmin=Dmin,
                       tLo=float(np.min(tlo(g, e))) if nm == 'pg' else float(tlo(H, e[a])), tHi=float(H * H / (8 * th)) if th > 0 else None)
    return out

def plateau(fn, out):
    g = np.array(np.load(fn, mmap_mode='r')[:1000002], dtype=np.float64); d = np.diff(g)
    # running record of the minimal gap among the first N zeros, N in [1e4, 1e6]
    run = np.minimum.accumulate(d); rows = []
    N = 10000
    while N <= 1000000:
        H = run[N - 2]; a = int(np.argmax(d[:N - 1] == H))
        e = int(np.searchsorted(-run, -H, side='right')) + 1            # last N with the same record
        endN = min(e, 1000000)
        x = g[:endN]; T = H * H / (8 * THB)
        s = np.sqrt(np.maximum(d[:endN - 1] ** 2 - 8 * T, 0)); P, Dmin = psi(x, a, s); th = 1 - P / 8
        Ps, _ = psi(g[:N], a, s[:N - 1])
        Kraw = (H ** 3 / 8) * (1 / th - 1) * math.sqrt(endN) / math.log(endN)
        rows.append(dict(startN=N, endN=endN, H=float(H), a=a, gammaLeft=float(g[a]), psiStart=float(Ps), psiEnd=float(P), theta=float(th), Dmin=Dmin,
                         tcLo=float(H * H / 8), tcHi=float(H * H / (8 * th)), FmbUpper=float(H * H / 8 * (1 / th - 1)), RrelUpper=float(1 / th - 1),
                         KrawBound=float(Kraw), KpaperBound=float(Kraw / 0.12751)))
        fk.log(rows[-1]); N = endN + 1
    res = dict(rows=rows, K_paper_max=max(r['KpaperBound'] for r in rows), source_value=2.42370832e-6, min_theta=min(r['theta'] for r in rows))
    fk.jdump(res, out); print('K_paper_max', res['K_paper_max'], 'source 2.42370832e-6', 'plateaus', len(rows))

def one_window(g, i0, n, Q, par, offz=None, LB=150, FAR=20000, lattice=None, label=''):
    """g absolute or offset list (float64), window g[i0:i0+n].  offz: complex array of off-line zeros (ordinate + i*delta, delta > 0; conjugates added)."""
    lo = max(i0 - LB, 0); hi = min(i0 + n + LB, len(g)); flo = max(lo - FAR, 0); fhi = min(hi + FAR, len(g))
    x0 = float(g[i0]); live = np.asarray(g[lo:hi], np.float64) - x0; far = np.concatenate([np.asarray(g[flo:lo], np.float64), np.asarray(g[hi:fhi], np.float64)]) - x0
    w = slice(i0 - lo, i0 - lo + n); x = live[w]; gp = np.diff(x)
    habs = x0 + T0G
    # tails: above the frozen block and below it (remaining zeros and the mirror zeros through the even density)
    Tt = float(g[fhi - 1]) + T0G + 0.5 / float(fk.dens(float(g[fhi - 1]) + T0G, Q, par)); Tb = float(g[flo]) + T0G - 0.5 / float(fk.dens(float(g[flo]) + T0G, Q, par))
    if flo == 0: Tb = -Tb if False else -(float(g[0]) + T0G) * 0.6          # no list zeros below: mirror zeros start at about -(first zero)
    def tails(a, b):
        a = np.atleast_1d(a) + habs; b = np.atleast_1d(b) + habs
        return fk.tail_int(Tt, a, b, Q, par, n=200) + fk.tail_int(-Tb, -b, -a, Q, par, n=200)
    # K_l(0) for the window gaps: zeros outside the window
    outside = np.concatenate([live[:w.start], live[w.stop:], far])
    a_ = x[:-1]; b_ = x[1:]
    Kon = 2 * ((1 / ((a_[:, None] - outside[None, :]) * (b_[:, None] - outside[None, :]))).sum(1) + tails(a_, b_))
    Koff_abs = np.zeros(len(gp)); Koff_sgn = np.zeros(len(gp)); near = None; livez = np.zeros(0, complex); farz = np.zeros(0, complex)
    if offz is not None and len(offz):
        z = np.concatenate([offz, np.conj(offz)]) - x0
        Koff_sgn = 2 * (1 / ((a_[:, None] - z[None, :]) * (b_[:, None] - z[None, :]))).real.sum(1)
        Koff_abs = 2 * (1 / (np.abs(a_[:, None] - z[None, :]) * np.abs(b_[:, None] - z[None, :]))).sum(1)
        m = (z.real > live[0]) & (z.real < live[-1]); livez = z[m]; farz = z[~m]
    br_d = bracket(x, 2 * Kon); br_h = bracket(x, 2 * (Kon + Koff_abs)); a = br_d['a']; H = br_d['H']
    if offz is not None and len(offz):
        dd = np.abs(z - 0.5 * (x[a] + x[a + 1])); near = float(dd.min())
    # frozen linear field on the live particles
    Zl = np.concatenate([live.astype(complex), livez])
    F0 = np.zeros(len(Zl), complex); F1 = np.zeros(len(Zl), complex)
    for src in (far.astype(complex), farz):
        for s0 in range(0, len(src), 20000):
            D = Zl[:, None] - src[None, s0:s0 + 20000]; F0 += -2 * (1 / D).sum(1); F1 += 2 * (1 / D ** 2).sum(1)
    F1 += 2 * tails(Zl.real, Zl.real)
    if lattice is not None:
        # T-NR: the whole lattice of off-line zeros in closed form minus the moving ones
        lq, c = lattice
        def GD(zz):
            ph = (zz + x0 + T0G) * lq; return -2 * lq * np.sin(ph) / (c + 2 * np.cos(ph))
        e = 1e-5; nl = len(live); G0 = np.zeros(len(Zl), complex); G1 = np.zeros(len(Zl), complex)
        G0[:nl] = GD(Zl[:nl]); G1[:nl] = (GD(Zl[:nl] + e) - GD(Zl[:nl] - e)) / (2 * e)
        # a moving lattice zero sits on a pole of GD: regular part and its derivative from the mean over a circle (radius below the distance 2b to the partner)
        bb_ = float(np.abs(livez.imag).min()) if len(livez) else 1.0; rad = 0.3 * bb_; K16 = 16
        for k in range(K16):
            wk = np.exp(2j * np.pi * k / K16); v = GD(Zl[nl:] + rad * wk); G0[nl:] += v / K16; G1[nl:] += v / (wk * rad) / K16
        D = Zl[:, None] - livez[None, :]
        with np.errstate(divide='ignore', invalid='ignore'):
            own = np.abs(D) < 1e-14; I = np.where(own, 0, 1 / np.where(own, 1, D))
        F0 += -2 * (G0 - I.sum(1)); F1 += -2 * (G1 + (I ** 2).sum(1))
    # regularised pairs: the record pair and every disjoint adjacent on-line pair (window or buffer) with gap < 1.5 H; only window pairs stop the run
    pr = flow.greedy_pairs(live, 400, must=a + w.start, gmax=None if lattice is not None else 1.5 * H)      # T-NR: every disjoint adjacent on-line pair
    stop = np.array([(w.start <= p0) and (p1 < w.stop) for p0, p1 in pr])
    F = flow.RegFlow(Zl[None, :], np.array([pr]), F0[None, :], F1[None, :])
    tc, p = F.run_until_collision((3.0 if lattice is not None else 1.3) * H * H / 8, scale=H, stop_pairs=stop, maxsteps=8000 if lattice is not None else 3000, rtol=1e-8 if lattice is not None else 1e-11)
    if tc is not None and pr[p][0] - w.start != a: p = 'other window pair %d' % (pr[p][0] - w.start)
    elif tc is not None: p = 'record'
    n_reg = len(pr)
    # K of the record pair at the end of the run (zeros outside the window, moving ones at their final positions)
    Zf = F.positions(F.S)[0]; row = dict(label=label, i0=int(i0), height=habs, n=n, H=H, a=a, pair_time=H * H / 8, t_true=tc, collided_pair=p, steps=getattr(F, 'steps', None), t_end_over_pair=float(F.t / (H * H / 8)), regularised_pairs=n_reg,
                                        second_gap=float(np.sort(gp)[1]), spacing=1 / float(fk.dens(habs, Q, par)),
                                        K_on_record=float(Kon[a]), K_on_max=float(Kon.max()), K_off_signed_record=float(Koff_sgn[a]), K_off_abs_record=float(Koff_abs[a]),
                                        nearest_offline=near, quarantine=2 / math.sqrt(Kon[a]), declared=br_d, honest=br_h)
    for nm, br in (('declared', br_d), ('honest', br_h)):
        for f in ('uni', 'pg'):
            b = br[f]; ok = None
            if tc is not None and b['tHi'] is not None and b['certifies']: ok = bool(b['tLo'] <= tc <= b['tHi'])
            b['in_bracket'] = ok
            if tc is not None and b['tHi'] is not None: b['pos'] = (tc - b['tLo']) / (b['tHi'] - b['tLo'])
    return row

# ---------------- direct evaluation of H_t (zeta): collision time of a pair from the Riemann-Siegel sampler with the heat factor
def tc_direct(T0, a, b, est_unf, L0):
    """a < b offsets from T0 of the two zeros; returns the unfolded tau at which the two zeros of Z_tau merge (tau > 0 = backward)."""
    sys.path.insert(0, os.path.join(fk.HERE, 'zgen')); import zl
    g = b - a
    def margin(tau):
        d = np.linspace(a - 0.8 * g, b + 0.8 * g, 65); Z = zl.sample_Z(T0, d, -tau)
        so = np.sign(Z[0]); v = -so * Z; j = int(np.argmax(v[8:-8])) + 8
        # parabola through the three points around the extremum
        y0, y1, y2 = v[j - 1], v[j], v[j + 1]; den = y0 - 2 * y1 + y2
        return float(y1 - 0.125 * (y2 - y0) ** 2 / den) if den != 0 else float(y1)
    lo, hi = 0.0, 1.5 * est_unf; flo, fhi = margin(lo), margin(hi)
    if not (flo > 0 and fhi < 0): return None
    for _ in range(60):
        m = 0.5 * (lo + hi); fm = margin(m)
        if fm > 0: lo, flo = m, fm
        else: hi, fhi = m, fm
        if hi - lo < 1e-9 * est_unf: break
    return lo - flo * (hi - lo) / (fhi - flo) if fhi != flo else 0.5 * (lo + hi)

T0G = 0.0
if __name__ == '__main__':
    if sys.argv[1] == 'plateau': plateau(sys.argv[2], sys.argv[3]); sys.exit()
    name, kind, fn, Q, par, out, nwin = sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), int(sys.argv[6]), sys.argv[7], int(sys.argv[8])
    offz = None; lattice = None
    if kind == 'off':
        d = np.load(sys.argv[9]); g = np.array(d['on'], np.float64); offz = np.array(d['offg'], np.float64) + 1j * np.abs(np.array(d['offx'], np.float64))
    else:
        g = np.load(fn, mmap_mode='r'); mf = fn.replace('.npy', '.meta.npy')
        if os.path.exists(mf) and g[0] < 1e6 and float(np.load(mf)[0]) >= 1e6: T0G = float(np.load(mf)[0])
    direct = os.environ.get('RH_DIRECT', '0') == '1' and kind == 'plain' and name.startswith('zeta')
    n = 200; M = len(g); LBW = 150
    if kind == 'tnr': n = 200; LBW = 60          # the off-line progression of T-NR adds 2 log q / (2 pi) moving particles per unit height
    lo_i = 1000 if M > 50000 else 250
    starts = np.unique(np.geomspace(lo_i, M - n - 400, nwin).astype(np.int64)) if M > 3 * n + 800 else np.array([max(0, (M - n) // 2)])
    rows = []
    for i0 in starts:
        oz = offz; lat = None
        if kind == 'tnr':
            q = float(sys.argv[9]); c = 2.2; lq = math.log(q); bb = math.acosh(c / 2) / lq
            h0 = float(g[max(i0 - LBW, 0)]); h1 = float(g[min(i0 + n + LBW, M - 1)])
            ks = np.arange(int(h0 * lq / (2 * math.pi)) - 1, int(h1 * lq / (2 * math.pi)) + 2); gk = (2 * ks + 1) * math.pi / lq; gk = gk[(gk > h0) & (gk < h1)]
            oz = gk + 1j * bb; lat = (lq, c)
        r = one_window(g, int(i0), n, Q, par, oz, LB=LBW, lattice=lat, label=name)
        if direct and r['height'] > 5e4 and r['t_true'] is not None:
            base = float(math.floor(float(g[i0]))) if T0G == 0 else T0G
            L0 = math.log(base / (2 * math.pi)); a_ = float(g[i0 + r['a']]) + (0 if T0G else 0) - (base if T0G == 0 else 0); b_ = float(g[i0 + r['a'] + 1]) - (base if T0G == 0 else 0)
            est = ((b_ - a_) * L0 / (2 * math.pi)) ** 2 / 8
            tu = tc_direct(base, a_, b_, est, L0)
            r['t_direct'] = None if tu is None else 4 * math.pi ** 2 * tu / L0 ** 2
            r['direct_over_flow'] = None if tu is None else r['t_direct'] / r['t_true']
        rows.append(r)
        fk.log(name, 'i0', i0, 'h %.6g' % r['height'], 'H %.5g' % r['H'], 't_true/pair %.8f' % (r['t_true'] / r['pair_time']) if r['t_true'] else 'no collision',
               'decl pg [%.8f, %.8f] in=%s' % (r['declared']['pg']['tLo'] / r['pair_time'], (r['declared']['pg']['tHi'] or 0) / r['pair_time'], r['declared']['pg']['in_bracket']),
               'uni in=%s' % r['declared']['uni']['in_bracket'], 'honest pg in=%s' % r['honest']['pg']['in_bracket'], 'Kon %.4g Koff %.4g near %s' % (r['K_on_record'], r['K_off_signed_record'], r['nearest_offline']),
               'direct/flow %s' % r.get('direct_over_flow'))
    def cnt(key, f):
        v = [r[key][f]['in_bracket'] for r in rows]; return dict(inside=sum(1 for t in v if t is True), outside=sum(1 for t in v if t is False), not_certified=sum(1 for t in v if t is None))
    res = dict(name=name, kind=kind, windows=len(rows), declared_pg=cnt('declared', 'pg'), declared_uni=cnt('declared', 'uni'), honest_pg=cnt('honest', 'pg'), honest_uni=cnt('honest', 'uni'), rows=rows)
    fk.jdump(res, out); print(json.dumps({k: v for k, v in res.items() if k != 'rows'}))
