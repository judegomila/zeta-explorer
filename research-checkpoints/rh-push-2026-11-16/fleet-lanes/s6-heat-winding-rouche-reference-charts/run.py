"""Rows -> per-box / per-chart statistics.  Usage: run.py X Ltot outdir [groups] [chunk_from chunk_to]
Per (chunk, set) an npz with (levels = rlib.LEVELS, boxes of width 1 in x, charts of width 2 in x = 1 in Im s):
  devB0[l, box]   max over the box points of |f - 1| on level l                      (reference B_0: test 3, test 1 with P = 1)
  agg_<ref>[i, box] max over levels >= (0.03, 0.1809)[i] of |f Qinv - 1|            (test 1)
  lip_<ref>[i, box] max |d(f Qinv)/dx| on the bottom level (finite differences)       (panel count)
  wind[k, box], windstep[k, box] winding number of f on the box boundary for the level pairs PAIRS, largest phase step used
  wref_<ref>[k, box] winding number of Qinv (references that can vanish), pairs PAIRS[:2]
  AD[l, box], minD[l, box], windD[k, box]  max |A/D|, min |D|, winding of D (reference B = full direct ladder: test 3)
  t2_<ref>[r, 0..2, chart] on levels y = 0.04, 0.20, 0.50: sup |F - Q|, inf |Q|, sup |F/Q - 1|   (test 2; t = 0 only)
"""
import sys, os, math, time, json
import numpy as np
import rlib
from rlib import *

PAIRS = [(0, 15), (4, 15), (3, 13), (4, 13)]
T2L = [1, 5, 9]
TS = 0.1262875
Q6 = 'TNR1000003'
GROUPS = {
 'g1': [('ZETA', 0.0, 1), ('ZETA', 0.05, 1), ('ZETA', 0.16, 1)],
 'g2': [('CHI4', 0.0, 1), ('CHI4', 0.05, 1), ('CHI4', 0.16, 1), ('CHI5', 0.0, 1), ('CHI5', 0.05, 1), ('CHI5', 0.16, 1)],
 'g3': [('EA', 0.0, 1), (Q6, 0.0, 1), (Q6, 0.05, 1), (Q6, 0.16, 1), ('TNR3', 0.0, 1), ('TNR3', 0.05, 1), ('TNR3', 0.16, 1)],
 'g4': [('DH', 0.0, 1), ('DH', 0.05, 1), ('DH', 0.16, 1), ('ZETA', -0.1, 1), ('ZETA', -0.05, 1), ('ZETA', 0.06, 1),
        ('SGN', 0.0, 1), ('SGN', 0.05, 1), ('SGN', 0.16, 1), ('U', 0.0, 1), ('U', 0.05, 1), ('U', 0.16, 1)],
 'g5': [('ZETA', TS, 0), ('CHI4', TS, 0), ('CHI5', TS, 0), ('DH', TS, 0), ('TNR3', TS, 0), (Q6, TS, 0), ('SGN', TS, 0), ('U', TS, 0), ('ZETA', TS - 0.1, 0)],
 'g6': [('ZETA', 0.1, 0), ('ZETA', 0.2, 0), ('ZETA', 0.3, 0), ('ZETA', 0.5, 0), ('DH', 0.1, 0), ('DH', 0.2, 0), ('DH', 0.3, 0), ('DH', 0.5, 0),
        ('TNR3', 0.1, 0), ('TNR3', 0.2, 0), ('TNR3', 0.3, 0), ('TNR3', 0.5, 0)],
}
ORDER = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6']
GROUPS.update({'g3a': GROUPS['g3'][:4], 'g3b': GROUPS['g3'][4:], 'g4a': GROUPS['g4'][:3], 'g4b': GROUPS['g4'][3:6], 'g4c': GROUPS['g4'][6:],
               'g6a': GROUPS['g6'][:4], 'g6b': GROUPS['g6'][4:8], 'g6c': GROUPS['g6'][8:]})

class Wind:
    def __init__(self, nb, nl):
        self.nb = nb; self.rowph = [None] * nl; self.step = [None] * nl; self.side = [None] * nl
    def add(self, l, f):
        nb = self.nb
        d = xp.angle(f[1:] * xp.conj(f[:-1]))[:nb * 16].reshape(nb, 16)
        self.rowph[l] = d.sum(1); self.step[l] = xp.abs(d).max(1); self.side[l] = f[::16][:nb + 1].copy()
    def get(self, lb, lt):
        S = xp.zeros(self.nb + 1); sm = xp.zeros(self.nb + 1)
        for l in range(lb + 1, lt + 1):
            inc = xp.angle(self.side[l] * xp.conj(self.side[l - 1])); S += inc; sm = xp.maximum(sm, xp.abs(inc))
        W = (self.rowph[lb] + S[1:] - self.rowph[lt] - S[:-1]) / TWO_PI
        ms = xp.maximum(xp.maximum(self.step[lb], self.step[lt]), xp.maximum(sm[1:], sm[:-1]))
        return asnp(xp.rint(W)).astype(np.int8), asnp(ms).astype(np.float16)

def reduce_set(ch, kind, t, with_refs):
    M = ch.M; nb = M // 16 - 1; nch = M // 32 - 1; nl = len(LEVELS)
    def bmax(a): return xp.maximum(a[:nb * 16].reshape(nb, 16).max(1), a[16:16 * nb + 16:16])
    def bmin(a): return xp.minimum(a[:nb * 16].reshape(nb, 16).min(1), a[16:16 * nb + 16:16])
    def cmax(a): return xp.maximum(a[:nch * 32].reshape(nch, 32).max(1), a[32:32 * nch + 32:32])
    def cmin(a): return xp.minimum(a[:nch * 32].reshape(nch, 32).min(1), a[32:32 * nch + 32:32])
    out = {}
    devB0 = np.zeros((nl, nb), np.float32)
    W = Wind(nb, nl); WD = None; WR = {}
    agg = {}; lip = {}; t2 = {}
    AD = minD = None
    for l, y in enumerate(LEVELS):
        row = make_row(ch, kind, t, y, with_refs=with_refs)
        f = row['f']
        W.add(l, f)
        devB0[l] = asnp(bmax(xp.abs(f - 1)))
        if 'D' in row:
            if AD is None:
                AD = np.zeros((nl, nb), np.float32); minD = np.zeros((nl, nb), np.float32); WD = Wind(nb, nl)
            aD = xp.abs(row['D'])
            AD[l] = asnp(bmax(xp.abs(row['A']) / xp.maximum(aD, 1e-300))); minD[l] = asnp(bmin(aD)); WD.add(l, row['D'])
        refs = dict(row['refs'])
        if with_refs and t == 0 and l in T2L: refs['B0'] = None
        for name, Qi in refs.items():
            g = f if Qi is None else f * Qi
            dev = xp.abs(g - 1)
            if Qi is not None:
                bm = bmax(dev)
                if name not in agg: agg[name] = [xp.zeros(nb), xp.zeros(nb)]; lip[name] = np.zeros((2, nb), np.float32)
                agg[name][0] = xp.maximum(agg[name][0], bm)
                if l >= 4: agg[name][1] = xp.maximum(agg[name][1], bm)
                if l in (0, 4):
                    dg = xp.abs(g[1:] - g[:-1])[:nb * 16].reshape(nb, 16).max(1) / H
                    lip[name][0 if l == 0 else 1] = asnp(dg)
                if name[0] in 'co':
                    if name not in WR: WR[name] = Wind(nb, nl)
                    WR[name].add(l, Qi)
            if t == 0 and l in T2L:
                if name not in t2: t2[name] = np.zeros((3, 3, nch), np.float32)
                aQ = 1.0 if Qi is None else 1.0 / xp.abs(Qi)
                r = T2L.index(l)
                t2[name][r, 0] = asnp(cmax(dev * aQ))
                t2[name][r, 1] = 1.0 if Qi is None else asnp(cmin(aQ))
                t2[name][r, 2] = asnp(cmax(dev))
        del row, refs
    out['devB0'] = devB0
    ws = [W.get(a, b) for a, b in PAIRS]
    out['wind'] = np.array([w[0] for w in ws]); out['windstep'] = np.array([w[1] for w in ws])
    for name in agg:
        out['agg_' + name] = np.array([asnp(agg[name][0]), asnp(agg[name][1])], np.float32); out['lip_' + name] = lip[name]
    for name in WR:
        out['wref_' + name] = np.array([WR[name].get(a, b)[0] for a, b in PAIRS[:2]])
    if AD is not None:
        out['AD'] = AD; out['minD'] = minD; out['windD'] = np.array([WD.get(a, b)[0] for a, b in PAIRS])
    for name in t2: out['t2_' + name] = t2[name]
    return out

if __name__ == '__main__':
    X = float(sys.argv[1]); Ltot = int(float(sys.argv[2])); outdir = sys.argv[3]
    groups = sys.argv[4].split(',') if len(sys.argv) > 4 and sys.argv[4] != 'all' else ORDER
    os.makedirs(outdir, exist_ok=True)
    Lc, nchunk = chunk_plan(X, Ltot)
    c0 = int(sys.argv[5]) if len(sys.argv) > 5 else 0; c1 = int(sys.argv[6]) if len(sys.argv) > 6 else nchunk
    sets = [s for g in groups for s in GROUPS[g]]
    M = int(Lc / H)
    log('X=%g Ltot=%d chunk length %d (M=%d), chunks %d..%d of %d, sets %d, GPU=%s' % (X, Ltot, Lc, M, c0, c1, nchunk, len(sets), GPU))
    log('planned allocation: fine grid %.0f MB complex, rows about %.0f MB each, per-set outputs about %.0f MB' % (2 * M * 16 / 1e6, M * 16 / 1e6, 60 * (M / 16) * 4 / 1e6))
    for ci in range(c0, c1):
        xc = X + ci * Lc + Lc / 2
        t0 = time.time()
        ch = Chunk(xc, M, nmax_for(['DH'], X + (ci + 1) * Lc))
        log('chunk %d xc=%.1f phases done in %.1fs (nmax %d)' % (ci, xc, time.time() - t0, ch.nmax))
        for kind, t, wr in sets:
            fn = os.path.join(outdir, 'X%g_c%03d_%s_%g.npz' % (X, ci, kind, t))
            if os.path.exists(fn): continue
            t0 = time.time()
            try:
                o = reduce_set(ch, kind, t, bool(wr))
            except Exception as e:
                import traceback; traceback.print_exc(); log('FAILED', kind, t, repr(e)); continue
            o['meta'] = np.array(json.dumps(dict(X=X, chunk=ci, xc=xc, Lc=Lc, M=M, kind=kind, t=t, levels=LEVELS, pairs=PAIRS, H=H)))
            np.savez(fn + '.tmp.npz', **o); os.replace(fn + '.tmp.npz', fn)
            log('done chunk %d %s t=%g in %.1fs' % (ci, kind, t, time.time() - t0))
            if GPU: cp.get_default_memory_pool().free_all_blocks()
    log('ALLDONE')
