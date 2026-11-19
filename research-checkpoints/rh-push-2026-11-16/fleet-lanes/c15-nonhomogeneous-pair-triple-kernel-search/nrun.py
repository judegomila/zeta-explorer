"""c15 pair pipeline, exact-parameter families. usage: nrun.py <outdir> <real|synth> <g0,g1,g2> [scale] [chunk]"""
import json
import multiprocessing as mp
import os
import sys
import time
import numpy as np
import jobj
import nobj
import nf
import nsolve

PAIRS = None
D = None
GRP = None
NPERM = 200
EXTRA = bool(os.environ.get('C15_EXTRA'))


def work(args):
    group, u, h, i0 = args
    t = time.time()
    res = nf.eval_group(group, u, h, PAIRS)
    out = {}
    for f, V in res.items():
        V1, E1, V2, E2 = nf.v2full(V)
        summ, rows = nsolve.analyse(V1, E1, V2, E2, D, nobj.ALLC, nobj.FE_CLASSES, extra=EXTRA)
        for r in rows:
            r['node'] = int(i0 + r['row'])
            r['u'] = float(u[r['row']])
            r['h'] = float(h[r['row']])
        for k in list(summ):
            if k.endswith('rows_feas') or k.endswith('rows_und'):
                summ[k] = (i0 + summ[k]).tolist()
        sub = np.nonzero((i0 + np.arange(len(u))) % 10 == 0)[0]
        fi = nf.GROUPS[group].index(f)
        tt, fl = nsolve.shuffle_test(V1[sub], E1[sub], V2[sub], E2[sub], GRP, nobj.ALLC, NPERM, 153000, nobj.gidx)
        summ['shuffle_tt'] = tt
        summ['shuffle_full'] = fl
        # planted value-level rows (first chunk only)
        if i0 == 0:
            n = min(5, len(u))
            ideal = np.where(np.isin(GRP, ['P', 'PX', 'PH']), 0.0, 1.0)[None, :].repeat(n, 0)
            s2, _ = nsolve.analyse(ideal, np.full_like(ideal, 1e-12), np.ones_like(ideal), np.zeros_like(ideal), D, nobj.ALLC, nobj.FE_CLASSES)
            summ['planted_ok'] = bool(s2['PA/all']['full'] == n)
        out[f] = (summ, rows)
    return i0, len(u), out, time.time() - t


def merge(acc, s):
    if acc is None:
        return s
    for k, v in s.items():
        if isinstance(v, dict):
            for kk, vv in v.items():
                if kk == 'classes':
                    continue
                if isinstance(vv, list):
                    acc[k][kk] = [a + b for a, b in zip(acc[k][kk], vv)]
                elif kk == 'best_min_heldout':
                    acc[k][kk] = max(acc[k][kk], vv)
                else:
                    acc[k][kk] += vv
        elif k in ('shuffle_tt', 'shuffle_full'):
            acc[k] = acc[k] | v
        elif k == 'nodes':
            acc[k] += v
        elif k == 'und_share':
            acc[k] = acc[k] + v            # summed; divided by the chunk count at the end
        elif isinstance(v, list):
            acc[k] = acc[k] + v
        elif k == 'planted_ok':
            acc[k] = v
    return acc


def main():
    global PAIRS, D, GRP
    out, mode, groups = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    scale = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
    chunk = int(sys.argv[5]) if len(sys.argv) > 5 else 3000
    skip = tuple(int(x) for x in os.environ.get('C15_SKIP', '').split(',') if x)
    os.makedirs(out, exist_ok=True)
    t0 = time.time()
    info = {}
    PAIRS = jobj.build_synth() if mode == 'synth' else nobj.build(info, skip)
    GRP = np.array([p.group for p in PAIRS])
    D = nobj.gidx(GRP)
    json.dump(dict(groups=GRP.tolist(), names=[p.name for p in PAIRS], info=info, skip=list(skip)), open(os.path.join(out, 'objects.json'), 'w'))
    nw = int(os.environ.get('RH_WORKERS', '4'))
    print('objects %d built in %.0fs; workers %d' % (len(PAIRS), time.time() - t0, nw), flush=True)
    ctx = mp.get_context('fork')
    with ctx.Pool(nw) as pool:
        for g in groups:
            t1 = time.time()
            u, h, ngrid = nf.nodes(g, scale)
            np.savez(os.path.join(out, g + '_nodes.npz'), u=u, h=h, ngrid=ngrid)
            nf_ = len(nf.GROUPS[g])
            print('%s: %d nodes (%d grid); planned per worker: %d families x 4 x float64[%d x %d] = %.0f MB; %d workers'
                  % (g, len(u), ngrid, nf_, chunk, len(PAIRS), nf_ * 4 * chunk * len(PAIRS) * 8 / 1e6, nw), flush=True)
            jobs = [(g, u[i:i + chunk], h[i:i + chunk], i) for i in range(0, len(u), chunk)]
            acc = {f: None for f in nf.GROUPS[g]}
            rows = {f: [] for f in nf.GROUPS[g]}
            done = 0
            for i0, n, o, dt in pool.imap_unordered(work, jobs):
                for f, (s, r) in o.items():
                    acc[f] = merge(acc[f], s)
                    rows[f] += r
                done += 1
                if done % 10 == 0 or done == len(jobs):
                    print('  %s chunk %d/%d (%.0fs chunk, %.0fs group)' % (g, done, len(jobs), dt, time.time() - t1), flush=True)
            for f in nf.GROUPS[g]:
                a = acc[f]
                a['und_share'] = a['und_share'] / len(jobs)
                a['shuffle'] = dict(n=NPERM, ttrain=int(a.pop('shuffle_tt').sum()), full=int(a.pop('shuffle_full').sum()))
                json.dump(dict(summary=a, rows=rows[f]), open(os.path.join(out, f + '_summary.json'), 'w'))
                pa, fe, pz = a['PA/all'], a['PA/FE'], a['PZ/all']
                if EXTRA:
                    print('%s extra tiers: canon %s | six %s' % (f, {k: a['PA/canon'][k] for k in ('ttrain', 'undecided', 'full', 'best_min_heldout')}, {k: a['PA/six'][k] for k in ('ttrain', 'undecided', 'full', 'best_min_heldout', 'nrej_hist')}), flush=True)
                print('%s: nodes=%d | PA ttrain=%d und=%d full=%d rej=%s nrej_hist=%s best=%d | FE ttrain=%d und=%d full=%d | PZ ttrain=%d und=%d full=%d | shuffle=%s planted=%s und_share=%.4f'
                      % (f, a['nodes'], pa['ttrain'], pa['undecided'], pa['full'], pa['rejected'], pa['nrej_hist'], pa['best_min_heldout'], fe['ttrain'], fe['undecided'], fe['full'],
                         pz['ttrain'], pz['undecided'], pz['full'], a['shuffle'], a.get('planted_ok'), a['und_share']), flush=True)
            print('%s done %.0fs' % (g, time.time() - t1), flush=True)
    print('RUN-DONE %.0fs' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
