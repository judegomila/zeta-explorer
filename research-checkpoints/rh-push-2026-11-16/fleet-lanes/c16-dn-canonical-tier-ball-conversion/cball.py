"""c16 Part A: ball conversion of the canonical tier {T-NR, E_a, HEAT} of dictionary DN (PREREG sections 1-6).
usage: cball.py und <c15dir> <outjson> [maxnodes_per_group]
       cball.py repro <c15dir> <outjson> [per_cell]
Uses the c15 lane code as is: nball.bvalue (ball value of a family on a pair), nsolve.solve_sign (interval logic),
nf.eval_group (float64 values).  Changed against nball.bratio: acceptance of a rung (relative radius, no absolute
floor), ladder 128/256/512 with extended rungs 1024/2048."""
import json
import math
import multiprocessing as mp
import os
import sys
import time
import numpy as np
from flint import arb, acb, ctx
import ballk
import jk
import kern
import nobj
import nf
import nsolve
import nball

PRECS = (128, 256, 512)
EXT = (1024, 2048)
LADDER = PRECS + EXT
CANON = [2, 3, 4]
FAMS = {'g1': ['b1-Aw', 'b3-with', 'b6-with'], 'g2': ['b2-with', 'b5l-with', 'b5m-with', 'b5p-with']}
PAIRS = None
D = None
TINYA = None       # per pair: A kernel carries polar terms and has a log-linear far tail (zeta, HEAT)


def start_rung(fam, u, h, j):
    if not TINYA[j]:
        return LADDER[0]
    g = nball.group_of(fam)
    x = float(np.abs(nf.points(g, np.array([u]), np.array([h]))).min())
    need = math.pi * math.exp(2 * x) / math.log(2) + 64
    for p in LADDER:
        if p >= need:
            return p
    return LADDER[-1]


def bratio2(fam, u, h, pair, start):
    """-> (mid, half-width, sign of V2, precision) or None when no rung is accepted"""
    for pr in LADDER:
        if pr < start:
            continue
        ctx.prec = pr
        try:
            V1, V2 = nball.bvalue(fam, u, h, pair)
            if V2 is None:
                r, s2 = V1, 1.0
            else:
                if V2.contains(0):
                    continue
                r, s2 = V1 / V2, (1.0 if V2 > 0 else -1.0)
            m = float(r.mid())
            rad = float(r.rad())
            if not (np.isfinite(m) and np.isfinite(rad)):
                continue
            if abs(m) < 1e-290 or rad > 1e-6 * abs(m):
                continue
            return m, rad * (1 + 1e-9) + 4e-16 * abs(m), s2, pr
        except (nball.Und, ValueError, ZeroDivisionError, RuntimeError, AssertionError, OverflowError):
            continue
    return None


class Row:
    """one (family, node): float64 ratios with ball replacement on demand"""

    def __init__(self, fam, u, h, r, e, und, sg2):
        self.fam, self.u, self.h = fam, float(u), float(h)
        self.r, self.e, self.und, self.sg2 = r[None, :].copy(), e[None, :].copy(), und[None, :].copy(), sg2[None, :].copy()
        self.balled = {}
        self.failed = set()
        self.nb = 0

    def ball(self, j):
        j = int(j)
        if j in self.balled:
            return
        bq = bratio2(self.fam, self.u, self.h, PAIRS[j], start_rung(self.fam, self.u, self.h, j))
        self.nb += 1
        if bq is None:
            self.balled[j] = 0
            self.failed.add(j)
            self.und[0, j] = True
        else:
            self.r[0, j], self.e[0, j], self.sg2[0, j] = bq[0], bq[1], bq[2]
            self.und[0, j] = False
            self.balled[j] = bq[3]

    def solve(self, s, pos, cls, optimistic):
        return nsolve.solve_sign(self.r, self.e, self.und, self.sg2, s, pos, cls, optimistic)


def resolve(row, pos, cls, train, force_all=False):
    """c15 work_und logic for one tier. -> status, intervals [(s, lo, up)], blockers"""
    if force_all:
        for j in train:
            row.ball(j)
    status = 'undecided'
    for rnd in range(8):
        need = set(int(j) for j in train if row.und[0, j] and int(j) not in row.balled)
        st = False
        op = False
        for s in (1, -1):
            st |= bool(row.solve(s, pos, cls, False)[2].any())
            Cn, UP, feo, _, _ = row.solve(s, pos, cls, True)
            if feo.any():
                op = True
                for jj in np.nonzero(feo[0])[0]:
                    c, up = Cn[0, jj], UP[0, jj]
                    lo_ = c if np.isfinite(c) else up
                    hi_ = up if np.isfinite(up) else c
                    if not (np.isfinite(lo_) and np.isfinite(hi_)):
                        continue
                    w = hi_ - lo_
                    for j in train:
                        j = int(j)
                        if j in row.balled or row.und[0, j]:
                            continue
                        if row.r[0, j] + 20 * row.e[0, j] >= lo_ - w and row.r[0, j] - 20 * row.e[0, j] <= hi_ + w:
                            need.add(j)
        status = 'ttrain' if st else ('undecided' if op else 'excluded')
        if status != 'undecided' or not need:
            break
        for j in need:
            row.ball(j)
    ints = []
    rej = np.zeros(len(cls), dtype=bool)
    onesign = False
    for s in (1, -1):
        Cn, UP, feas, nsat, rk = row.solve(s, pos, cls, False)
        rej |= rk[0]
        onesign |= bool((nsat[0] >= 0).any())
        for jj in np.nonzero(feas[0])[0]:
            ints.append((s, float(Cn[0, jj]), float(UP[0, jj])))
    return status, ints, dict(one_signable=onesign, rejectable=[bool(x) for x in rej])


def _sgn(row, j, lam):
    """strict sign of V1 - lam V2 on pair j (0 = not decided); balls on demand"""
    for step in range(2):
        if not row.und[0, j]:
            d = row.r[0, j] - lam
            if abs(d) > (20 if (j not in row.balled) else 1) * row.e[0, j]:
                return int(np.sign(d) * row.sg2[0, j])
        if j in row.balled:
            return 0
        row.ball(j)
    return 0


def heldout_primary(row, ints):
    """c15 rule at lam = pick(interval). -> best record over intervals"""
    best = None
    for s, c, up in ints:
        lam = nsolve.pick(c, up)
        rec = dict(s=s, lam=lam, lo=c, up=up, exit=None)
        ok = True
        for key, want in (('PH', s), ('H2', -s), ('H3', -s), ('H4', -s)):
            good = bad = 0
            for j in D[key]:
                if _sgn(row, int(j), lam) == want:
                    good += 1
                else:
                    bad += 1
                    if bad >= 2:
                        break
            rec[key] = good
            if bad >= 2:
                ok = False
                rec['exit'] = key
                break
        rec['full'] = ok
        if best is None or ok:
            best = rec
        if ok:
            break
    return best


def _counts(row, groups, lam, s):
    out = {}
    for key in groups:
        want = s if key == 'PH' else -s
        n = 0
        for j in D[key]:
            j = int(j)
            if row.und[0, j]:
                continue
            d = row.r[0, j] - lam
            if abs(d) > row.e[0, j] and int(np.sign(d) * row.sg2[0, j]) == want:
                n += 1
        out[key] = n
    return out


def heldout_any(row, ints):
    """secondary read: is there a lam in a feasible interval meeting the hold-out counts?"""
    res = dict(any=False, best_cheap=0, best_all=0, heat_stage=0)
    for s, c, up in ints:
        if np.isfinite(c) and np.isfinite(up):
            lo_, hi_ = c, up
        elif np.isfinite(c):
            lo_, hi_ = c, c + max(1.0, abs(c)) * 10
        elif np.isfinite(up):
            lo_, hi_ = up - max(1.0, abs(up)) * 10, up
        else:
            lo_, hi_ = -10.0, 10.0
        w = hi_ - lo_

        def prep(keys):
            for key in keys:
                for j in D[key]:
                    j = int(j)
                    if j in row.balled:
                        continue
                    if row.und[0, j] or (row.r[0, j] + 20 * row.e[0, j] >= lo_ - w and row.r[0, j] - 20 * row.e[0, j] <= hi_ + w):
                        row.ball(j)

        def cands(keys):
            bp = [lo_, hi_]
            for key in keys:
                for j in D[key]:
                    j = int(j)
                    if not row.und[0, j] and lo_ < row.r[0, j] < hi_:
                        bp.append(float(row.r[0, j]))
            bp = sorted(set(bp))
            return [0.5 * (a + b) for a, b in zip(bp[:-1], bp[1:])]
        cheap = ('PH', 'H2', 'H3')
        prep(cheap)
        passing = []
        for lam in cands(cheap):
            cn = _counts(row, cheap, lam, s)
            m = min(cn.values())
            res['best_cheap'] = max(res['best_cheap'], m)
            if m >= 23:
                passing.append(lam)
        if not passing:
            continue
        res['heat_stage'] += 1
        prep(('H4',))
        for lam in cands(cheap + ('H4',)):
            cn = _counts(row, cheap + ('H4',), lam, s)
            m = min(cn.values())
            if m > res['best_all']:
                res['best_all'] = m
                res['best_rec'] = dict(s=s, lam=lam, lo=c, up=up, **cn)
            if m >= 23:
                res['any'] = True
    return res


def work(args):
    g, fams_rows, idx, u, h, mode = args
    fams = sorted(set(f for fl in fams_rows for f in fl))
    vals = nf.eval_group(g, u, h, PAIRS, fams)
    pos = np.concatenate((D['P'], D['PX']))
    cls = [D['C%d' % k] for k in CANON]
    train = np.concatenate([pos] + cls)
    RE = {}
    for f in fams:
        V1, E1, V2, E2 = nf.v2full(vals[f])
        RE[f] = nsolve.ratio(V1, E1, V2, E2)
    out = []
    for i in range(len(u)):
        nball._CACHE.clear()
        for fam in fams_rows[i]:
            t0 = time.time()
            rec = dict(fam=fam, node=int(idx[i]), u=float(u[i]), h=float(h[i]))
            if mode == 'und' and nball.symmetric_node(fam, u[i], h[i]):
                rec.update(res='identity', nb=0)
                out.append(rec)
                continue
            r, e, und, sg2 = RE[fam]
            row = Row(fam, u[i], h[i], r[i], e[i], und[i], sg2[i])
            status, ints, info = resolve(row, pos, cls, train, force_all=(mode == 'repro'))
            rec.update(res=status, **info)
            rec['left'] = [PAIRS[j].name for j in sorted(row.failed)][:8]
            rec['nleft'] = len(row.failed)
            if status == 'ttrain':
                rec['ints'] = ints[:6]
                if mode == 'und':
                    rec['primary'] = heldout_primary(row, ints)
                    rec['secondary'] = heldout_any(row, ints)
            rec['nb'] = row.nb
            pr = [p for p in row.balled.values() if p]
            rec['maxprec'] = max(pr) if pr else 0
            rec['sec'] = round(time.time() - t0, 2)
            out.append(rec)
    return out


def setup():
    global PAIRS, D, TINYA
    PAIRS = nobj.build({}, skip=(1, 5, 6, 7, 8, 9))
    G = np.array([p.group for p in PAIRS])
    D = nobj.gidx(G)
    TINYA = [isinstance(p.A, jk.W) and isinstance(p.A.o, (kern.Zeta, kern.Heat)) for p in PAIRS]
    return G


def main():
    mode, c15, outf = sys.argv[1], sys.argv[2], sys.argv[3]
    cap = int(sys.argv[4]) if len(sys.argv) > 4 else 10 ** 9
    G = setup()
    ob = json.load(open(os.path.join(c15, 'out2', 'objects.json')))
    stored = {}
    for gname, nm in zip(ob['groups'], ob['names']):
        stored.setdefault(gname, []).append(nm)
    mine = {}
    for p in PAIRS:
        mine.setdefault(p.group, []).append(p.name)
    same = all(mine[k] == stored.get(k) for k in mine)
    print('objects %d; groups %s; names equal to the stored c15 objects: %s' % (len(PAIRS), {k: len(v) for k, v in mine.items()}, same), flush=True)
    assert same
    nw = int(os.environ.get('RH_WORKERS', '4'))
    print('planned memory: per worker float64 blocks of at most 25 nodes x %d pairs x 4 arrays x %d families = %.2f MB; ball caches per node only'
          % (len(PAIRS), 4, 25 * len(PAIRS) * 4 * 4 * 8 / 1e6), flush=True)
    jobs = []
    meta = {}
    rs = np.random.Generator(np.random.PCG64(160001))
    for g, fams in FAMS.items():
        nd = np.load(os.path.join(c15, 'out', g + '_nodes.npz'))
        per = {}
        for fam in fams:
            s = json.load(open(os.path.join(c15, 'out2', fam + '_summary.json')))['summary']
            undr = np.array(s['PA/canon/rows_und'], dtype=np.int64)
            feas = np.array(s['PA/canon/rows_feas'], dtype=np.int64)
            meta[fam] = dict(und=int(len(undr)), feas=int(len(feas)), nodes=int(len(nd['u'])))
            if mode == 'und':
                src_rows = feas if os.environ.get('C16_ROWS') == 'feas' else undr      # amendment A1: float64 T-train nodes
                rows = src_rows[:cap] if cap < len(src_rows) else src_rows
                for q in rows:
                    per.setdefault(int(q), []).append(fam)
            else:
                k = cap if cap < 10 ** 9 else 25
                spec = {'b2-with': (k, k), 'b5l-with': (k, k), 'b1-Aw': (0, 2 * k), 'b3-with': (0, 2 * k)}.get(fam)
                if spec is None:
                    continue
                allr = np.arange(len(nd['u']))
                exc = np.setdiff1d(allr, np.union1d(undr, feas))
                exc = exc[[not nball.symmetric_node(fam, nd['u'][q], nd['h'][q]) for q in exc]]
                pick_t = rs.choice(feas, min(spec[0], len(feas)), replace=False) if spec[0] else []
                pick_e = rs.choice(exc, spec[1], replace=False)
                meta[fam]['repro'] = dict(ttrain=[int(x) for x in pick_t], excluded=[int(x) for x in pick_e])
                for q in list(pick_t) + list(pick_e):
                    per.setdefault(int(q), []).append(fam)
        keys = sorted(per)
        # order by descending |u| mixes cheap and costly nodes poorly; shuffle for an even progress rate
        keys = [keys[i] for i in np.random.Generator(np.random.PCG64(160003)).permutation(len(keys))]
        B = 10 if mode == 'und' else 2
        for i in range(0, len(keys), B):
            kk = np.array(keys[i:i + B], dtype=np.int64)
            jobs.append((g, [per[int(q)] for q in kk], kk, nd['u'][kk], nd['h'][kk], mode))
        print('%s: %d distinct nodes, %d family-nodes' % (g, len(keys), sum(len(v) for v in per.values())), flush=True)
    print('jobs %d; meta %s' % (len(jobs), meta), flush=True)
    sl = os.environ.get('C16_JOBSLICE')
    if sl:
        # helper run on a slice of the same deterministic job list (indices into the full list)
        a_, b_ = [int(x) for x in sl.split(':')]
        jobs = jobs[a_:b_]
        print('job slice [%d:%d): %d jobs' % (a_, b_, len(jobs)), flush=True)
    t0 = time.time()
    rows = []
    if mode == 'und' and os.path.exists(outf + '.part'):
        # resume: rows of an interrupted run of the same command are kept; their nodes are not recomputed
        rows = json.load(open(outf + '.part'))['rows']
        done = set((q['fam'], q['node']) for q in rows)
        nj = []
        for g, fr, kk, uu, hh, md in jobs:
            keep = [i for i in range(len(kk)) if any((f, int(kk[i])) not in done for f in fr[i])]
            if keep:
                nj.append((g, [[f for f in fr[i] if (f, int(kk[i])) not in done] for i in keep], kk[keep], uu[keep], hh[keep], md))
        print('resume: %d rows kept, %d of %d jobs left' % (len(rows), len(nj), len(jobs)), flush=True)
        jobs = nj
    with mp.get_context('fork').Pool(nw) as pool:
        for k, o in enumerate(map(work, jobs) if nw == 1 else pool.imap_unordered(work, jobs)):
            rows += o
            if (k + 1) % max(1, len(jobs) // 100) == 0:
                print('  job %d/%d %.0fs; rows %d' % (k + 1, len(jobs), time.time() - t0, len(rows)), flush=True)
            if (k + 1) % 100 == 0:
                json.dump(dict(meta=meta, rows=rows, partial=True), open(outf + '.part', 'w'))
    summ = {}
    for q in rows:
        c = summ.setdefault(q['fam'], dict(identity=0, excluded=0, ttrain=0, undecided=0, primary_full=0, secondary_any=0, nb=0, maxprec={}))
        c[q['res']] += 1
        c['nb'] += q.get('nb', 0)
        mp_ = str(q.get('maxprec', 0))
        c['maxprec'][mp_] = c['maxprec'].get(mp_, 0) + 1
        if q['res'] == 'ttrain' and mode == 'und':
            c['primary_full'] += int(bool(q['primary']['full']))
            c['secondary_any'] += int(bool(q['secondary']['any']))
    if mode == 'repro':
        agree = dis = 0
        for q in rows:
            want = 'ttrain' if q['node'] in meta[q['fam']]['repro']['ttrain'] else 'excluded'
            q['want'] = want
            if q['res'] == want:
                agree += 1
            else:
                dis += 1
        summ['repro'] = dict(nodes=len(rows), agree=agree, disagree=dis)
    json.dump(dict(meta=meta, summary=summ, rows=rows, seconds=time.time() - t0), open(outf, 'w'))
    for f, c in summ.items():
        print(f, c, flush=True)
    print('CBALL-DONE %.0fs' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
