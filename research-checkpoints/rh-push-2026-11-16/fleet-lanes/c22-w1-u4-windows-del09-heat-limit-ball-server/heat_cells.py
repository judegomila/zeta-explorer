"""Part 3: residue cells of Lemma R (round-21 lane) on nested rectangles, for F = H_{-tau} (backward heat) and for zeta.
Variable w (real axis = critical line), z = i w/2, s = 1/2 + z. Rectangle R_k: abs(Re z) <= XZ, abs(Im z - CZ) <= Y_k,
i.e. abs(Im w) <= 2 XZ, abs(Re w - 2 CZ) <= 2 Y_k.  h(z) L_z(z) dz = h(z(w)) (F'(w)/F(w)) dw.
HEAT values: trapezoid representation of the c20 lane (heat_c20.py unchanged: Lemmas S, T, Q), one node set per slab of
half-width 16 in Re w; the sum is restricted to the nodes within D of Re w and the dropped nodes are bounded (tailw below);
F' enclosed as (sum)' + eps/r by Cauchy's estimate; wide boxes by the mean-value form with (sum)' and (sum)''.
usage: heat_cells.py <heat|zeta> <prec> <out.json> [ymax]
"""
import os, sys, json, math, time, importlib.util
import numpy as np
from multiprocessing import Pool
from flint import acb, arb, acb_series, ctx
MODE = sys.argv[1]; PREC = int(sys.argv[2]); OUT = os.path.abspath(sys.argv[3]); YMAX = int(sys.argv[4]) if len(sys.argv) > 4 else 32
HERE = os.path.dirname(os.path.abspath(__file__))
WORKERS = int(os.environ.get('RH_WORKERS', '4'))
ctx.prec = PREC
TAUS = '1'; CZ = '2500.75'; XZ = 3
YS = [y for y in (1, 2, 4, 8, 16, 32, 64, 128) if y <= YMAX]
CW = 2*arb(CZ); IMW = 2*XZ; HALF = 2*max(YS)                      # w-rectangle of R_k: [CW - 2Y, CW + 2Y] x [-IMW, IMW]
RATES = {'P8': ([('0.375', '2500.921875')], [acb(1)]),
         'P1': ([('0.375', '2500.921875'), ('0.625', '2500.625')], [acb(1), acb(arb('-0.75'), arb('0.5'))])}
I = acb(0, 1)
NAN = acb(arb(0)/arb(0), arb(0)/arb(0))
RCAUCHY = arb('0.25'); DMAX = arb('17.25'); BMAX = arb('5.25'); DWIN = 20.0
SLABW = 32
NSLAB = max(1, (2*HALF + SLABW - 1)//SLABW)
def slab_centre(i): return CW - HALF + SLABW*i + SLABW//2
def box(e): return acb(arb(0, 1)*e, arb(0, 1)*e)

# ------------------------------------------------------------------ HEAT evaluator
HM = {}
def load_slab(i):
    cfg = dict(tau=TAUS, XC=slab_centre(i).str(30, radius=False), dx='0', eta='0.5', y0='-1.6', a='0.5', U='48', JL=400, rects=[])
    fn = os.path.join(HERE, 'cfg_slab_%d_%d.json' % (HALF, i)); json.dump(cfg, open(fn, 'w'))
    old = sys.argv
    sys.argv = ['heat_c20.py', fn, str(PREC), '/dev/null']
    spec = importlib.util.spec_from_file_location('heat_slab_%d' % i, os.path.join(HERE, 'heat_c20.py'))
    m = importlib.util.module_from_spec(spec); sys.modules['heat_slab_%d' % i] = m; spec.loader.exec_module(m)
    sys.argv = old
    HM[i] = m; return m
def _hs(a):
    i, j = a; ctx.prec = PREC
    return HM[i]._sample(j)

class Slab:
    def __init__(self, i, cs):
        m = HM[i]; self.m = m; self.cs = cs; self.NN = m.NN; self.H = m.H; self.Hf = float(m.H.mid()); self.XC = m.XC; self.Y0 = m.Y0
        self.q = 1/(4*m.TAU); self.JW = int(math.ceil(DWIN/self.Hf))
        et, el, Ma = m.error_bounds(BMAX, DMAX)
        cmax = arb(0)
        for c in cs: cmax = cmax.max(abs(c))
        dabs = DMAX + 48 + BMAX
        Pb = 4*dabs*dabs*self.q*self.q + 2*self.q + 2*dabs*self.q + 1
        tailw = cmax*(BMAX*BMAX*self.q).exp()*Pb*((arb(DWIN) - 1 - 2*self.H)/m.R2).erfc()      # dropped nodes: see RESULT.md 2.3
        self.parts = dict(eps_trap=et.str(6), eps_tail=el.str(6), eps_window=tailw.str(6), M_a=Ma.str(6), nodes=2*m.NN + 1, window_nodes=2*self.JW + 1, h=m.H.str(10))
        self.eps = arb((et + el + tailw).upper()); self.eps1 = arb((self.eps/RCAUCHY).upper())
        self.norm = m.H/(4*arb.pi()*m.TAU).sqrt()
    def sums(self, dzx, y):
        q = self.q; b = y - self.Y0; H = self.H; NN = self.NN; cs = self.cs
        jc = int(round(float(dzx.mid())/self.Hf))
        t0 = acb(0); t1 = acb(0); t2 = acb(0); q2 = 2*q
        for j in range(max(-NN, jc - self.JW), min(NN, jc + self.JW) + 1):
            d = acb(dzx - H*j, b); e = cs[j + NN]*(-d*d*q).exp(); g = d*q2
            t0 += e; t1 -= e*g; t2 += e*(g*g - q2)
        return t0*self.norm, t1*self.norm, t2*self.norm
    def ev(self, x, y):
        """(F, F') enclosures on the box x + i y, y <= 3/4 (scaled by exp(-REF) of the slab); None outside the validity box."""
        if float(x.rad()) > 1 or float(y.rad()) > 1: return None
        dzx = x - self.XC
        if not (abs(dzx) <= 17 and y >= -6.5 and y <= 0.75): return None
        if max(float(x.rad()), float(y.rad())) < 1e-25:
            S0, S1, _ = self.sums(dzx, y)
        else:
            mx = arb(dzx.mid()); my = arb(y.mid())
            A0, A1, _ = self.sums(mx, my); _, _, B2 = self.sums(dzx, y)
            dz = acb(dzx - mx, y - my)
            S1 = A1 + B2*dz; S0 = A0 + S1*dz
        return S0 + box(self.eps), S1 + box(self.eps1)
SLABS = []
def ev_heat(x, y):
    refl = float(y.mid()) > 0
    if refl: y = -y
    i = int(math.floor((float(x.mid()) - float((CW - HALF).mid()))/SLABW)); i = min(max(i, 0), NSLAB - 1)
    r = SLABS[i].ev(x, y)
    if r is None: return None
    return (r[0].conjugate(), r[1].conjugate()) if refl else r

# ------------------------------------------------------------------ zeta evaluator (H_0 directly)
def lgf(s): return s.log() + (s-1).log() - acb(16).log() - s*acb.pi().log()/2 + (s/2).lgamma()
REFZ = None
LOGPI = None
def _zeta_jet(x, y):
    """Taylor data of F(w) = exp(-REFZ) xi(s)/8 at s = (1 + i w)/2: (F, dF/dw, d2F/dw2), from a series of length 3 in s."""
    s = acb((1 - y)/2, x/2)
    ser = acb_series([s, acb(1)], prec=3)
    lg = ser.log() + (ser - 1).log() - ser*(acb.pi().log()/2) + (ser/2).lgamma() - (acb(16).log() + REFZ)
    f = lg.exp()*ser.zeta()
    return f[0], (I/2)*f[1], -f[2]/2
def ev_zeta(x, y):
    """(F, F') enclosures on the box x + i y; boxes by the mean-value form with F' and F'' on the box."""
    if float(x.rad()) > 2 or float(y.rad()) > 2: return None
    if max(float(x.rad()), float(y.rad())) < 1e-25:
        F, F1, _ = _zeta_jet(x, y)
    else:
        mx = arb(x.mid()); my = arb(y.mid())
        A0, A1, _ = _zeta_jet(mx, my); _, _, B2 = _zeta_jet(x, y)
        dz = acb(x - mx, y - my)
        F1 = A1 + B2*dz; F = A0 + F1*dz
    if not (F.is_finite() and F1.is_finite()): return None
    return F, F1
EV = ev_heat if MODE == 'heat' else ev_zeta

# ------------------------------------------------------------------ test functions
def zofw(w): return I*w/2
def hfun(row, z):
    rates, bs = RATES[row]
    V = acb(0); Vs = acb(0)
    for (xr, tr), b in zip(rates, bs):
        zj = acb(arb(xr), -arb(tr))
        V += b/(z + zj); Vs += b.conjugate()/(zj.conjugate() - z)
    return V*Vs
def Lz_at(z):
    """L_z = F'_z/F at the point z."""
    w = -2*I*z
    F, F1 = EV(w.real, w.imag)
    return -2*I*F1/F, F
def Qgen(row):
    rates, bs = RATES[row]; zs = [acb(arb(xr), -arb(tr)) for xr, tr in rates]
    tot = acb(0); lows = []
    Lc = []; Lm = []
    for z in zs:
        a, Fa = Lz_at(z.conjugate()); b, Fb = Lz_at(-z); Lc.append(a); Lm.append(b); lows.append(float(abs(Fa).lower())); lows.append(float(abs(Fb).lower()))
    for i_, zi in enumerate(zs):
        for j_, zj in enumerate(zs):
            tot += bs[i_]*bs[j_].conjugate()*(Lc[j_] - Lm[i_])/(zi + zj.conjugate())
    return tot, lows

# ------------------------------------------------------------------ contour pieces
def piece(task):
    ctx.prec = PREC
    kind, key, a_, b_ = task; t_piece = time.time()
    a = acb(arb(a_[0]), arb(a_[1])); b = acb(arb(b_[0]), arb(b_[1]))
    cache = {}; nev = [0]
    def LL(w):
        k = (w.real.mid().man_exp(), w.real.rad().man_exp(), w.imag.mid().man_exp(), w.imag.rad().man_exp())
        if k in cache: return cache[k]
        nev[0] += 1
        r = EV(w.real, w.imag)
        if r is None or r[0].contains(0) or not r[0].is_finite(): v = None
        else:
            v = r[1]/r[0]
            if not v.is_finite(): v = None
        cache[k] = v; return v
    out = {}
    tol = arb(2)**(-70)
    for row in ('count', 'P8', 'P1'):
        def f(w, an, row=row):
            v = LL(w)
            if v is None: return NAN
            return v if row == 'count' else v*hfun(row, zofw(w))
        val = acb.integral(f, a, b, rel_tol=tol, abs_tol=tol, eval_limit=10**6, depth_limit=10**4)
        out[row] = (val.real.str(40), val.imag.str(40), HM_pack(val))
    return kind, key, out, nev[0], time.time() - t_piece
def HM_pack(v):
    def pk(x):
        m, e = x.mid().man_exp(); rm, re_ = x.rad().man_exp(); return (int(m), int(e), int(rm), int(re_))
    return (pk(v.real), pk(v.imag))
def unpack(t):
    def up(q):
        m, e, rm, re_ = q
        return arb(arb(m)*arb(2)**e, arb(rm)*arb(2)**re_)
    return acb(up(t[0]), up(t[1]))

# ------------------------------------------------------------------ zeros
def grid_row(a):
    """float screen: phases of F on one grid row (y fixed), x on the grid of the slab; 64-bit balls, midpoints only."""
    i, y = a
    ctx.prec = 64 if MODE == 'zeta' else PREC
    xs = np.arange(-16.5, 16.5001, 0.05)
    if MODE == 'heat':
        S = SLABS[i]; m = S.m
        tj = np.array([S.Hf*j for j in range(-S.NN, S.NN + 1)]); cf = np.array([complex(float(c.real.mid()), float(c.imag.mid())) for c in S.cs])
        d = (xs[:, None] - tj[None, :]) + 1j*(y - float(S.Y0.mid()))
        vals = (cf[None, :]*np.exp(-d*d*float(S.q.mid()))).sum(axis=1)
    else:
        xc = float(slab_centre(i).mid()); vals = np.empty(len(xs), dtype=complex)
        for n_, xx in enumerate(xs):
            r = ev_zeta(arb(xc + xx), arb(y)); vals[n_] = complex(float(r[0].real.mid()), float(r[0].imag.mid()))
    ctx.prec = PREC
    return i, y, np.angle(vals)
def newton(w):
    for _ in range(12):
        F, F1 = EV(arb(w.real.mid()), arb(w.imag.mid()))
        w = w - F/F1; w = acb(arb(w.real.mid()), arb(w.imag.mid()))
    F, F1 = EV(w.real, w.imag)
    return w, F, F1
def certify(a):
    """winding number of F around the square of half-width hs centred at wc (8 segments per side)."""
    ctx.prec = PREC
    wcx, wcy = a; hs = arb('1e-15'); n = 8
    cx = arb(wcx); cy = arb(wcy)
    pts = [(-n + 2*i, -n) for i in range(n)] + [(n, -n + 2*i) for i in range(n)] + [(n - 2*i, n) for i in range(n)] + [(-n, n - 2*i) for i in range(n)]
    P = [(cx + hs*p/n, cy + hs*q/n) for p, q in pts]
    vals = [EV(x, y) for x, y in P]
    if any(v is None or v[0].contains(0) for v in vals): return None
    tot = arb(0)
    for k in range(len(P)):
        x0, y0 = P[k]; x1, y1 = P[(k+1) % len(P)]
        E = EV(x0.union(x1), y0.union(y1))
        if E is None or E[0].contains(0): return None
        tot += (vals[(k+1) % len(P)][0]/vals[k][0]).arg()
    W = tot/(2*arb.pi()); u = W.unique_fmpz()
    return None if u is None else int(u)
def nwt(a):
    ctx.prec = PREC
    w, F, F1 = newton(acb(arb(a[0]), arb(a[1])))
    return (w.real.str(34, radius=False), w.imag.str(34, radius=False), float(abs(F).upper()), float(abs(F1).mid()))

if __name__ == '__main__':
    T0 = time.time()
    print('PLAN: mode %s, prec %d, tau %s, centre Im z = %s, X = %d, Y_k = %s, workers %d, slabs %d; largest allocation: float grid rows of 661 x %d complex128 (below 40 MB per worker); '
          'samples: fewer than 3000 balls per slab' % (MODE, PREC, TAUS, CZ, XZ, YS, WORKERS, NSLAB, 2700), flush=True)
    if MODE == 'heat':
        for i in range(NSLAB): load_slab(i)
        for i in range(NSLAB):
            m = HM[i]
            with Pool(WORKERS) as pool:
                cs = [m.unpack(t) for t in pool.map(_hs, [(i, j) for j in range(-m.NN, m.NN + 1)], chunksize=16)]
            S = Slab(i, cs); SLABS.append(S)
            print('slab %d centre %s: %s eps = %s eps1 = %s  (%.0fs)' % (i, m.XC.str(12), json.dumps(S.parts), S.eps.str(5), S.eps1.str(5), time.time() - T0), flush=True)
    else:
        REFZ = arb(round(float(lgf(acb(arb('0.5'), CW/2)).real.mid()), 3))
    res = dict(mode=MODE, prec=PREC, tau=TAUS, CZ=CZ, XZ=XZ, YS=YS, slabs=[S.parts for S in SLABS], eps=[S.eps.str(5) for S in SLABS])
    # Q_gen
    Q = {}
    for row in RATES:
        Q[row], lows = Qgen(row); res['Qgen_' + row] = [Q[row].real.str(30), Q[row].imag.str(30)]; res['absF_at_rate_points_lower_' + row] = lows
        print('Q_gen', row, Q[row].str(25), 'abs F (scaled) at the rate points >=', lows, flush=True)
    # zeros: float screen, Newton, winding squares
    ys = [round(-6.275 + 0.05*r, 6) for r in range(127)]
    with Pool(WORKERS) as pool:
        rows = pool.map(grid_row, [(i, y) for i in range(NSLAB) for y in ys], chunksize=4)
    cands = []
    for i in range(NSLAB):
        ph = np.array([r[2] for r in rows if r[0] == i])                       # shape (len(ys), nx), ys increasing
        wr = lambda d: (d + np.pi) % (2*np.pi) - np.pi
        wind = wr(ph[:-1, 1:] - ph[:-1, :-1]) + wr(ph[1:, 1:] - ph[:-1, 1:]) + wr(ph[1:, :-1] - ph[1:, 1:]) + wr(ph[:-1, :-1] - ph[1:, :-1])
        rr, cc = np.nonzero(np.abs(wind) > 3)
        xc = float(slab_centre(i).mid())
        for r_, c_ in zip(rr, cc): cands.append((repr(float(xc - 16.5 + 0.05*(c_ + 0.5))), repr(float(ys[r_] + 0.025))))
    print('float screen: %d candidate cells (%.0fs)' % (len(cands), time.time() - T0), flush=True)
    with Pool(WORKERS) as pool:
        nw = pool.map(nwt, cands, chunksize=2)
    roots = []
    for x, y, aF, aF1 in nw:
        if not (aF < 1e-20*max(aF1, 1e-300)): print('newton did not converge near', x, y, aF, aF1, flush=True); continue
        if float(y) > 1e-12: y = '-' + y.lstrip('+')                           # keep the representative with Im w <= 0
        if any(abs(float(x) - float(x2)) < 1e-9 and abs(float(y) - float(y2)) < 1e-9 for x2, y2 in roots): continue
        roots.append((x, y))
    roots.sort(key=lambda r: float(r[0]))
    with Pool(WORKERS) as pool:
        cert = pool.map(certify, roots, chunksize=1)
    zeros = []
    for (x, y), c in zip(roots, cert):
        online = abs(float(y)) < 5e-16
        zeros.append(dict(re_w=x, im_w=y, winding=c, on_line_box=online))
    res['zeros'] = zeros
    print('zeros: %d representatives (Im w <= 0), winding certified 1 for %d; boxes meeting the real axis %d (%.0fs)' % (len(zeros), sum(1 for z in zeros if z['winding'] == 1), sum(1 for z in zeros if z['on_line_box']), time.time() - T0), flush=True)
    # contour pieces; edge rule of PREREG: an edge with a zero within EDGE_TOL (in Re w) is moved outward by 1/8 in w (1/16 in z)
    EDGE_TOL = 0.02
    shift = {}
    for Y in YS:
        for sgn in (-1, 1):
            e = float((CW + sgn*2*Y).mid()); near = [z_['re_w'] for z_ in zeros if abs(float(z_['re_w']) - e) < EDGE_TOL]
            shift[sgn*Y] = bool(near)
            if near: print('edge Re w = %s (Y = %d, side %+d): zero at Re w = %s within %g: edge moved outward by 1/8' % (e, Y, sgn, near, EDGE_TOL), flush=True)
    res['edges_moved'] = {str(k_): v_ for k_, v_ in shift.items()}
    def edge(sY):
        Y = abs(sY); sgn = 1 if sY > 0 else -1
        return CW + sgn*2*Y + (arb(sgn)/8 if shift[sY] else 0)
    S_ = lambda v: v.str(30, radius=False)
    tasks = []
    lo = -HALF
    for j in range(2*HALF):
        tasks.append(('bot', j, (S_(CW + lo + j), str(-IMW)), (S_(CW + lo + j + 1), str(-IMW))))
        tasks.append(('top', j, (S_(CW + lo + j), str(IMW)), (S_(CW + lo + j + 1), str(IMW))))
    for Y in YS:
        for sgn in (-1, 1):
            xr = S_(edge(sgn*Y))
            for j in range(2*IMW):
                tasks.append(('v%+d' % (sgn*Y), j, (xr, str(-IMW + j)), (xr, str(-IMW + j + 1))))
            if shift[sgn*Y]:                                                    # extra pieces of length 1/8 on bottom and top, stored left to right
                a0, a1 = (CW + sgn*2*Y, edge(sgn*Y)) if sgn > 0 else (edge(sgn*Y), CW + sgn*2*Y)
                tasks.append(('xbot%+d' % (sgn*Y), 0, (S_(a0), str(-IMW)), (S_(a1), str(-IMW))))
                tasks.append(('xtop%+d' % (sgn*Y), 0, (S_(a0), str(IMW)), (S_(a1), str(IMW))))
    print('contour pieces: %d (unit length in w)' % len(tasks), flush=True)
    PI = {}; nevt = 0
    with Pool(WORKERS) as pool:
        for n_, (kind, key, out, nev, sec) in enumerate(pool.imap_unordered(piece, tasks, chunksize=1)):
            PI[(kind, key)] = {row: unpack(v[2]) for row, v in out.items()}; nevt += nev
            if n_ % 50 == 0 or sec > 20: print('piece', n_, 'of', len(tasks), kind, key, 'evaluations', nev, '%.0fs' % sec, 'total evaluations', nevt, '%.0fs' % (time.time() - T0), flush=True)
    res['evaluations'] = nevt
    hsq = arb('1e-15')
    table = []
    for Y in YS:
        k = dict(Y=Y, rect_z=dict(X=XZ, Im=[(edge(-Y)/2).str(12, radius=False), (edge(Y)/2).str(12, radius=False)]))
        ints = {}
        for row in ('count', 'P8', 'P1'):
            tot = acb(0)
            for j in range(HALF - 2*Y, HALF + 2*Y): tot += PI[('bot', j)][row] - PI[('top', j)][row]
            for j in range(2*IMW): tot += PI[('v%+d' % Y, j)][row] - PI[('v%+d' % (-Y), j)][row]
            for sY in (Y, -Y):
                if shift[sY]: tot += PI[('xbot%+d' % sY, 0)][row] - PI[('xtop%+d' % sY, 0)][row]
            ints[row] = tot/(2*arb.pi()*I)
        N = ints['count']; un = N.real.unique_fmpz()
        k['contour_count'] = N.real.str(20); k['contour_count_integer'] = int(un) if un is not None else None
        inside = []; amb = 0; nline = 0; noff = 0
        for zr in zeros:
            if zr['winding'] != 1: continue
            x = arb(zr['re_w']); y = arb(zr['im_w']); bx = arb(x.mid(), hsq.mid()) if False else x + arb(0, 1)*hsq; by = y + arb(0, 1)*hsq
            if (bx > edge(-Y)) and (bx < edge(Y)) and (by > -IMW): 
                inside.append(acb(bx, by))
                if zr['on_line_box']: nline += 1
                else: inside.append(acb(bx, -by)); noff += 2
            elif (bx < edge(-Y)) or (bx > edge(Y)) or (by < -IMW): pass
            else: amb += 1
        k['zeros_enclosed'] = len(inside); k['zeros_boxes_meeting_line'] = nline; k['zeros_off_line'] = noff; k['ambiguous_boxes'] = amb
        k['complete'] = bool(un is not None and int(un) == len(inside) and amb == 0)
        for row in RATES:
            W = acb(0)
            for wz in inside: W += hfun(row, zofw(wz))
            C = ints[row]; cell = Q[row] - W + C
            k[row] = dict(W_R=[W.real.str(25), W.imag.str(25)], C_R=[C.real.str(25), C.imag.str(25)], abs_C_R=abs(C).str(20), abs_C_R_lower=float(abs(C).lower()), abs_C_R_upper=float(abs(C).upper()),
                          C_R_rad=float(C.rad()), abs_W_R=float(abs(W).mid()), cell_mid=[float(cell.real.mid()), float(cell.imag.mid())], cell_rad=float(cell.rad()),
                          cell_contains0=bool(cell.contains(0)), cell_rad_below_1e_10=bool(float(cell.rad()) < 1e-10),
                          W_minus_Q=[(W - Q[row]).real.str(25), (W - Q[row]).imag.str(25)])
        table.append(k)
        print(json.dumps(k), flush=True)
    res['table'] = table; res['seconds'] = time.time() - T0
    json.dump(res, open(OUT, 'w'), indent=1)
    print('DONE %.0fs' % (time.time() - T0), flush=True)
