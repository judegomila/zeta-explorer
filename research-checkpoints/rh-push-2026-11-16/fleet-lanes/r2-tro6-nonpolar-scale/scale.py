#!/usr/bin/env python3
"""scale.py -- complete sextic theta coefficients rho_nat_sigma(-e0 m) (proof note (3.9), as tro6-numerics/fast.py) for
rows up to N(m) <= QMAX, together with manuscript-geometry cubic rows (R = Q^1.4) and per-conductor twisted sums.

Only one of each pair {m, -m} is computed (exact symmetry rho_sigma(-y) = chi_sigma(-1) rho_sigma(y), and
chi_c(-m) = chi_c(-1) chi_c(m)); the full sums are 2 x the half sums on the cells with par(sigma) = par(c),
par(x) = ((N(x) - 1)/6) mod 2, and 0 on the other cells.

Q grid: Q_j = QMAX * 2^(-(NB-1-j)/2), j = 0..NB-1; R_k = Q_k^1.4.  Row m lies in bin j(m) = min{j : N(m) <= Q_j}.

Per row (stored): rho_str, rho_cor, se, W (WLS normaliser), dS[shell, class] (shell sums of conj(chi_c(m)) pred(c),
   pred(c) = gamma_1(c) conj chi_c(-e0)), dn (counts), B[k, par, type] for k >= j(m) (rows A = c), B3 (A = c n^3 part).
Per conductor c (accumulated; snapshot at each Q_j; generic rows, strata 0 = prime to 6, 1 = not prime to 6):
   S[st][c, i] = sum_{half rows} rho_nat_{sigma_i(c)}(-e0 m) chi_c(m), sigma_i(c) = i-th class of the parity of c
   self[st][c] = sum_{half rows, (m,c)=1} wt_{m}(c)   (the estimator self-term weight; LOO correction = 2 self pred)

usage: scale.py QMAX NB NPROC outdir
"""
import os, sys
for v in ('OMP_NUM_THREADS', 'OPENBLAS_NUM_THREADS', 'MKL_NUM_THREADS'):
    os.environ[v] = '1'
import math, time, itertools, json
import multiprocessing as mp
import numpy as np
from scipy.linalg.blas import zgeru
HERE = os.path.dirname(os.path.abspath(__file__))
SX = os.environ.get('SEXTIC_DIR', os.path.join(HERE, 'sextic'))
os.environ['SEXTIC_DIR'] = SX
sys.path.insert(0, SX); sys.path.insert(0, HERE)
import alib as A, zomega as Z
import rows_nat as RN
Z6 = Z.ZETA6
LUT = np.concatenate([Z6, [0]])
PC = 100
WCUT = 1.6
TYPES = ['res', 'res*x13', 'res*x13c', 'res*a6', 'res*rnd', 'mob', 'a', 'aG', 'a*x13', 'a*x13c', 'a*a6', 'a*rnd', 'one']
NT = len(TYPES)
G = {}                                   # globals shared with forked workers

def P(*a):
    print(*a, flush=True)

def canon_half(m):
    a, b = m
    return a > 0 or (a == 0 and b > 0)

def orbit_id(m):
    best = None
    for x in (m, Z.conj(m)):
        for u in Z.UNITS:
            y = Z.mul(u, x)
            if best is None or y < best: best = y
    return best

def setup(QMAX, NB, outd):
    t0 = time.time()
    C = RN.Ctx(QMAX); T = C.T; n = T.n
    grid = C.grid; nsh = len(grid)
    shell0 = np.searchsorted(grid.astype(np.int64), T.N, side='left'); assert shell0.max() < nsh
    par0 = (((T.N - 1) // 6) % 2).astype(np.int64)
    par_cls = np.full(12, -1)
    for c in range(12):
        u = np.unique(par0[T.m4 == c]); assert len(u) == 1; par_cls[c] = u[0]
    cls_of_par = [np.flatnonzero(par_cls == p) for p in (0, 1)]
    assert len(cls_of_par[0]) == 6 and len(cls_of_par[1]) == 6
    key = par0 * (nsh * 12) + shell0 * 12 + T.m4.astype(np.int64)
    perm = np.argsort(key, kind='stable'); ks = key[perm]
    L = 2 * nsh * 12
    starts = np.searchsorted(ks, np.arange(L), 'left'); ends = np.searchsorted(ks, np.arange(L), 'right')
    ne = int(starts[nsh * 12])                                  # even-parity nodes are [0, ne)
    Np = T.N[perm]; Nf = Np.astype(float); nap = T.na[perm]; nbp = T.nb[perm]
    clsp = T.m4[perm].astype(np.int64); shp = shell0[perm]; parp = par0[perm]
    g1p = T.g1[perm]; g2p = T.g2[perm]; mup = T.mu[perm].astype(float)
    e_ne0 = C.e_ne0[perm]; assert (e_ne0 >= 0).all()
    g1e0 = np.conj(Z6[e_ne0]) * g1p                              # pred(c)
    a_th = grid.astype(float)[1:] ** (2 / 3) - grid.astype(float)[:-1] ** (2 / 3)
    binidx = (shp * 12 + clsp)                                   # index into [nsh, 12] tables
    # ---- row types
    alpha = ((nap - nbp / 2.0) + 1j * (nbp * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
    Gc = T.G()[perm]
    ident = np.abs(g1p * g2p - mup * alpha * Gc).max()
    P(f"identity gamma1 gamma2 = mu alpha G on {n} nodes: max |diff| = {ident:.2e}")
    r13 = (nap + 3 * nbp) % 13
    ind = np.zeros(13, int); x = 1
    for i in range(12):
        ind[x] = i; x = (x * 2) % 13
    x13 = np.where(r13 == 0, 0, np.exp(2j * np.pi * ind[r13] / 4))
    rng = np.random.default_rng(20261116)
    rnd = rng.choice([-1.0, 1.0], size=n)
    al = mup * np.conj(alpha * Gc) * Z6[e_ne0]
    assert np.abs(al * g2p - np.conj(g1e0)).max() < 1e-6
    nu = {'res': al, 'res*x13': al * x13, 'res*x13c': al * np.conj(x13), 'res*a6': al * alpha ** 6, 'res*rnd': al * rnd,
          'mob': np.conj(alpha * Gc) * Z6[e_ne0], 'a': alpha, 'aG': alpha * Gc, 'a*x13': alpha * x13, 'a*x13c': alpha * np.conj(x13),
          'a*a6': alpha ** 7, 'a*rnd': alpha * rnd, 'one': np.ones(n, complex)}
    base = np.empty((n, NT), complex)
    for t, name in enumerate(TYPES): base[:, t] = nu[name] * g2p
    tn = {'res': np.conj(alpha) ** 3, 'res*x13': np.conj(alpha) ** 3 * x13 ** 3, 'res*x13c': np.conj(alpha) ** 3 * np.conj(x13) ** 3,
          'res*a6': np.conj(alpha) ** 3 * alpha ** 18, 'res*rnd': np.conj(alpha) ** 3 * rnd, 'mob': np.conj(alpha) ** 3, 'a': alpha ** 3,
          'aG': alpha ** 3, 'a*x13': alpha ** 3 * x13 ** 3, 'a*x13c': alpha ** 3 * np.conj(x13) ** 3, 'a*a6': alpha ** 21,
          'a*rnd': alpha ** 3 * rnd, 'one': np.ones(n, complex)}
    # ---- Q grid, windows
    Qs = [QMAX * 2.0 ** (-(NB - 1 - j) / 2.0) for j in range(NB)]
    Rs = [q ** 1.4 for q in Qs]
    win = []                                                      # per k: per par: (lo, hi, w[lo:hi])
    for R in Rs:
        s_lo = int(np.searchsorted(grid.astype(float), R * math.exp(-WCUT), 'left')); s_lo = max(s_lo, 1)
        s_hi = int(np.searchsorted(grid.astype(float), R * math.exp(WCUT), 'left')); s_hi = min(s_hi, nsh - 1)
        pw = []
        for p in (0, 1):
            lo = int(starts[p * nsh * 12 + s_lo * 12]); hi = int(ends[p * nsh * 12 + s_hi * 12 + 11])
            lx = np.log(Nf[lo:hi] / R)
            pw.append((lo, hi, np.exp(-2 * lx ** 2) / np.sqrt(Nf[lo:hi])))
        win.append(pw)
    # ---- n^3 part: sparse terms
    ordN = np.argsort(Np, kind='stable'); Nsrt = Np[ordN]
    t_idx = []; t_nd = []; t_slot = []; t_cf = []
    for k, R in enumerate(Rs):
        nmax = (R * math.exp(WCUT)) ** (1 / 3.0)
        for nd in np.flatnonzero((Np > 1) & (Np <= nmax)):
            Reff = R / Nf[nd] ** 3
            lo = np.searchsorted(Nsrt, Reff * math.exp(-WCUT), 'left'); hi = np.searchsorted(Nsrt, Reff * math.exp(WCUT), 'right')
            idx = ordN[lo:hi]
            if len(idx) == 0: continue
            lx = np.log(Nf[idx] / Reff); w = np.exp(-2 * lx ** 2) / np.sqrt(Nf[idx])
            t_idx.append(idx); t_nd.append(np.full(len(idx), nd)); t_slot.append(k * 2 + ((parp[idx] + parp[nd]) % 2))
            t_cf.append(np.stack([base[idx, t] * w * tn[name][nd] / Nf[nd] for t, name in enumerate(TYPES)]))
    t_idx = np.concatenate(t_idx); t_nd = np.concatenate(t_nd); t_slot = np.concatenate(t_slot); t_cf = np.concatenate(t_cf, axis=1)
    # ---- rows (half), bins, strata are decided per row in the worker
    Rr = int(math.isqrt(4 * QMAX // 3)) + 2
    ms = sorted([(a, b) for a in range(-Rr, Rr + 1) for b in range(-Rr, Rr + 1) if (a, b) != (0, 0) and Z.norm((a, b)) <= QMAX and canon_half((a, b))],
                key=lambda t: (Z.norm(t), t))
    Nms = np.array([Z.norm(m) for m in ms])
    binof = np.searchsorted(np.array(Qs), Nms, 'left')
    G.update(C=C, T=T, n=n, nsh=nsh, grid=grid, perm=perm, starts=starts, ends=ends, ne=ne, Np=Np, clsp=clsp, shp=shp, parp=parp,
             g1e0=g1e0, a_th=a_th, binidx=binidx, base=base, Qs=Qs, Rs=Rs, win=win, t_idx=t_idx, t_nd=t_nd, t_slot=t_slot, t_cf=t_cf,
             ms=ms, Nms=Nms, binof=binof, cls_of_par=cls_of_par, par_cls=par_cls, outd=outd, NB=NB, QMAX=QMAX)
    # static tables for the analysis: CP[k][shell, class, type] = sum_{c in cell} base(c) w_k(c) pred(c);  cnt[shell, class]
    cnt = (ends - starts).reshape(2, nsh, 12).sum(0)
    CP = np.zeros((NB, nsh, 12, NT), complex); CN = np.zeros((NB, NT))
    for k in range(NB):
        for p in (0, 1):
            lo, hi, w = win[k][p]
            M = base[lo:hi] * (w * g1e0[lo:hi])[:, None]
            CP[k] += cellsum(M, lo, hi, p)
            CN[k] += (np.abs(base[lo:hi]) ** 2 * (w ** 2)[:, None]).sum(0)
    np.savez(os.path.join(outd, 'static.npz'), Qs=np.array(Qs), Rs=np.array(Rs), types=np.array(TYPES), cnt=cnt, CP=CP, CN=CN,
             par_cls=par_cls, cls_even=cls_of_par[0], cls_odd=cls_of_par[1], grid=grid, a_th=a_th, ne=ne, nterms3=len(t_idx),
             reps=np.array(Z.MOD4_REPS), ident=ident)
    np.savez(os.path.join(outd, 'nodes.npz'), perm=perm, Np=Np, clsp=clsp.astype(np.int8), shp=shp.astype(np.int16), pred=g1e0)
    P(f"setup: nodes {n} (even {ne}), half rows {len(ms)}, bins {np.bincount(binof, minlength=NB).tolist()}, n3 terms {len(t_idx)}, {time.time()-t0:.0f}s")
    P("Q grid: " + ", ".join(f"{q:.1f}" for q in Qs)); P("R grid: " + ", ".join(f"{r:.0f}" for r in Rs))

def cellsum(M, lo, hi, p):
    return _cellsum(M, lo, hi, p, G['starts'], G['ends'], G['nsh'])

def _cellsum(M, lo, hi, p, starts, ends, nsh):
    off = p * nsh * 12
    st = starts[off:off + nsh * 12]; en = ends[off:off + nsh * 12]
    out = np.zeros((nsh * 12, M.shape[1]), M.dtype)
    cs = np.concatenate([np.zeros((1, M.shape[1]), M.dtype), np.cumsum(M, axis=0)])
    a = np.clip(st, lo, hi) - lo; b = np.clip(en, lo, hi) - lo
    out[:] = cs[b] - cs[a]
    return out.reshape(nsh, 12, M.shape[1])

def build_cache(nproc):
    C = G['C']; T = G['T']; n = G['n']; perm = G['perm']; outd = G['outd']
    gp = C.gp; npr = len(gp)
    cpath = os.path.join(outd, f"Ecache_{G['QMAX']}.dat"); flag = cpath + '.done'
    if not os.path.exists(flag):
        Ec = np.memmap(cpath, dtype=np.int8, mode='w+', shape=(npr, n)); del Ec
        def work(w):
            E = np.memmap(cpath, dtype=np.int8, mode='r+', shape=(npr, n))
            for i in range(w, npr, nproc):
                E[i] = T.node_exponents(gp[i][1])[perm]
            E.flush()
        t0 = time.time()
        ps = [mp.Process(target=work, args=(w,)) for w in range(nproc)]
        [p.start() for p in ps]; [p.join() for p in ps]
        assert all(p.exitcode == 0 for p in ps)
        open(flag, 'w').write('ok')
        P(f"exponent cache built: {npr} primes, {time.time()-t0:.0f}s")
    G['Ec'] = np.memmap(cpath, dtype=np.int8, mode='r', shape=(npr, n))
    G['kpos'] = {k: i for i, (k, _) in enumerate(gp)}
    G['e_zeta'] = T.node_exponents(Z.UNITS[1])[perm].astype(np.int16)
    G['e_lam'] = T.node_exponents(Z.LAM)[perm].astype(np.int16)
    G['e_two'] = T.node_exponents((-2, 0))[perm].astype(np.int16)

def worker(w, j, nproc):
    g = G; C = g['C']; T = g['T']; n = g['n']; nsh = g['nsh']; starts = g['starts']; ends = g['ends']; ne = g['ne']
    Ec = g['Ec']; kpos = g['kpos']; g1e0 = g['g1e0']; a_th = g['a_th']; base = g['base']; win = g['win']; NB = g['NB']
    t_idx = g['t_idx']; t_nd = g['t_nd']; t_slot = g['t_slot']; t_cf = g['t_cf']; binidx = g['binidx']; cop = g['cls_of_par']
    rows = [i for i in np.flatnonzero(g['binof'] == j)][w::nproc]
    nr = len(rows); t0 = time.time()
    def binsum(v):
        cs = np.concatenate([[0], np.cumsum(v)])
        return (cs[ends] - cs[starts]).reshape(2, nsh, 12).sum(0)
    def fit(dS, dn):
        d = dS[1:]; nn = dn[1:].astype(float); ok = nn > 0
        inv = np.where(ok, 1.0 / np.where(ok, nn, 1), 0)
        Wt = (a_th[:, None] ** 2 * inv).sum(0)
        return (a_th[:, None] * d * inv).sum(0) / Wt, 1 / np.sqrt(Wt), inv, Wt
    out = dict(ms=np.zeros((nr, 2), np.int64), Nm=np.zeros(nr, np.int64), orb=np.zeros((nr, 2), np.int64), flags=np.zeros((nr, 6), np.int16),
               sqf=np.zeros(nr, bool), six=np.zeros(nr, bool), rho_str=np.zeros((nr, 12), complex), rho_cor=np.zeros((nr, 12), complex),
               se=np.zeros((nr, 12)), W=np.zeros((nr, 12)), dS=np.zeros((nr, nsh, 12), np.complex64), dn=np.zeros((nr, nsh, 12), np.int32),
               B=np.zeros((nr, NB, 2, NT), complex), B3=np.zeros((nr, NB, 2, NT), complex))
    acc = [[np.zeros((ne, 6), complex, order='F'), np.zeros((n - ne, 6), complex, order='F')] for _ in (0, 1)]
    selfacc = np.zeros((2, n))
    nslot = NB * 2
    for ii, ri in enumerate(rows):
        m = g['ms'][ri]
        a, b, u, fac = C.factor(m)
        em = (u * g['e_zeta'] + a * g['e_lam'] + b * g['e_two'])
        bad = np.zeros(n, bool)
        for (k, e) in fac:
            ep = Ec[kpos[k]]; bad |= ep < 0; em = em + e * ep.astype(np.int16)
        em = np.where(bad, -1, em % 6)
        ph = LUT[em]                                           # chi_c(m), 0 if not coprime
        good = ~bad
        dn = binsum(good.astype(np.int64))
        v = np.conj(ph) * g1e0
        dS = binsum(v)
        c0, sd, inv, Wt = fit(dS, dn)
        rc = np.zeros(12, complex); nterms = 0
        y = Z.mul(C.ne0, m)
        smallp = [(k, e) for (k, e) in fac if T.pq[k] <= PC and (e + 1) % 6 != 0]
        for r in range(1, len(smallp) + 1):
            for sub in itertools.combinations(smallp, r):
                gg, c1, facs = C.gt_c1(y, list(sub))
                e1 = np.zeros(n, np.int16)
                for (k, kk) in facs: e1 += kk * Ec[kpos[k]]
                vY = v * np.conj(LUT[(4 * e1) % 6])
                cY = fit(binsum(vY), dn)[0]
                wgt = gg * float(Z.norm(c1)) ** (-2.0 / 3.0); ic1 = Z.mod4_index(c1)
                for sp in range(12):
                    rc[C.m4mul[sp, ic1]] += wgt * Z.Rrec(C.reps[sp], c1) * cY[sp]
                nterms += 1
        ex = [e for _, e in fac]
        six = all(e % 6 == 0 for e in ex)
        out['ms'][ii] = m; out['Nm'][ii] = Z.norm(m); out['orb'][ii] = orbit_id(m); out['flags'][ii] = (a, b, u, len(fac), max(ex, default=0), nterms)
        out['sqf'][ii] = all(e == 1 for e in ex); out['six'][ii] = six
        out['rho_str'][ii] = c0; out['rho_cor'][ii] = rc; out['se'][ii] = sd; out['W'][ii] = Wt
        out['dS'][ii] = dS; out['dn'][ii] = dn
        # rows A = c
        for k in range(j, NB):
            for p in (0, 1):
                lo, hi, wk = win[k][p]
                out['B'][ii, k, p] = (ph[lo:hi] * wk) @ base[lo:hi]
        # rows A = c n^3, n squarefree != 1
        en = em[t_nd]
        val = ph[t_idx] * np.where(en >= 0, Z6[(3 * np.maximum(en, 0)) % 6], 0)
        for t in range(NT):
            x = t_cf[t] * val
            out['B3'][ii, :, :, t] = (np.bincount(t_slot, weights=x.real, minlength=nslot) + 1j * np.bincount(t_slot, weights=x.imag, minlength=nslot)).reshape(NB, 2)
        # per-conductor accumulators (generic rows)
        if not six:
            st = 0 if (a == 0 and b == 0) else 1
            rho = c0 + rc
            acc[st][0] = zgeru(1.0, ph[:ne], rho[cop[0]], a=acc[st][0], overwrite_a=1)
            acc[st][1] = zgeru(1.0, ph[ne:], rho[cop[1]], a=acc[st][1], overwrite_a=1)
            wfac = np.zeros((nsh, 12)); wfac[1:] = a_th[:, None] * inv / Wt[None, :]
            selfacc[st] += np.where(good, wfac.ravel()[binidx], 0.0)
        if (ii + 1) % 200 == 0 and w == 0:
            P(f"    bin {j} worker 0: {ii+1}/{nr} rows, {time.time()-t0:.0f}s")
    pref = os.path.join(g['outd'], f"w_{j:02d}_{w:02d}")
    np.save(pref + '_acc.npy', np.stack([np.concatenate([acc[st][0], acc[st][1]]) for st in (0, 1)]))
    np.save(pref + '_self.npy', selfacc)
    np.savez(pref + '_rows.tmp.npz', **out); os.replace(pref + '_rows.tmp.npz', pref + '_rows.npz')

def forms(S, selfacc):
    """FS[st, k, type, sigma] = sum_c base(c) w_k(c) S_sigma(c) (half sums; sigma in the parity block of c) and
    SELF[st, k, type, sigma] = sum_{c in sigma} base(c) w_k(c) pred(c) self(c)."""
    g = G; NB = g['NB']; win = g['win']; base = g['base']; cop = g['cls_of_par']; g1e0 = g['g1e0']; nsh = g['nsh']
    FS = np.zeros((2, NB, NT, 12), complex); SELF = np.zeros((2, NB, NT, 12), complex)
    for st in (0, 1):
        for k in range(NB):
            for p in (0, 1):
                lo, hi, w = win[k][p]
                for i, sg in enumerate(cop[p]):
                    FS[st, k, :, sg] += (S[st, lo:hi, i] * w) @ base[lo:hi]
                M = base[lo:hi] * (w * g1e0[lo:hi] * selfacc[st, lo:hi])[:, None]
                SELF[st, k] += _cellsum(M, lo, hi, p, g['starts'], g['ends'], nsh).sum(0).T
    return FS, SELF

def main():
    QMAX = int(sys.argv[1]); NB = int(sys.argv[2]); nproc = int(sys.argv[3]); outd = sys.argv[4]
    os.makedirs(outd, exist_ok=True)
    T0 = time.time()
    setup(QMAX, NB, outd)
    build_cache(nproc)
    n = G['n']
    S = np.zeros((2, n, 6), complex); selfacc = np.zeros((2, n))
    for j in range(NB):
        snap = os.path.join(outd, f"snap_{j:02d}.npz")
        if os.path.exists(snap):
            if j == NB - 1 or not os.path.exists(os.path.join(outd, f"snap_{j+1:02d}.npz")):
                d = np.load(snap); S = d['S'].astype(complex); selfacc = d['selfacc']
            P(f"bin {j}: present"); continue
        t0 = time.time()
        ps = [mp.Process(target=worker, args=(w, j, nproc)) for w in range(nproc)]
        [p.start() for p in ps]; [p.join() for p in ps]
        assert all(p.exitcode == 0 for p in ps), [p.exitcode for p in ps]
        parts = []
        for w in range(nproc):
            pref = os.path.join(outd, f"w_{j:02d}_{w:02d}")
            S += np.load(pref + '_acc.npy'); selfacc += np.load(pref + '_self.npy')
            parts.append(dict(np.load(pref + '_rows.npz')))
        rows = {k: np.concatenate([p[k] for p in parts]) for k in parts[0]}
        o = np.lexsort((rows['ms'][:, 1], rows['ms'][:, 0], rows['Nm']))
        rows = {k: v[o] for k, v in rows.items()}
        np.savez(os.path.join(outd, f"rows_{j:02d}.npz"), **rows)
        FS, SELF = forms(S, selfacc)
        np.savez(snap + '.tmp.npz', S=S.astype(np.complex64), selfacc=selfacc, FS=FS, SELF=SELF)
        os.replace(snap + '.tmp.npz', snap)
        for w in range(nproc):
            pref = os.path.join(outd, f"w_{j:02d}_{w:02d}")
            for suf in ('_acc.npy', '_self.npy', '_rows.npz'): os.remove(pref + suf)
        P(f"bin {j} (N(m) <= {G['Qs'][j]:.1f}): {len(rows['Nm'])} half rows, {time.time()-t0:.0f}s (total {time.time()-T0:.0f}s)")
    P("ALLDONE")

if __name__ == '__main__':
    main()
