"""Second referee, DN lane, run 2: the same 500-node sample (seed 171700); every training entry in balls, then both
hold-out reads (cball.heldout_primary, cball.heldout_any) on the BALL feasible intervals. Also includes all 86 nodes
the lane flagged (list passed as a json file) so that their status is read with all entries in balls.
usage: ref2_feas2.py <c15dir> <out.json> <flagged.json>"""
import json, os, sys, time
import multiprocessing as mp
import numpy as np
import cball, nf, nsolve, nball
def work(args):
    g, fams_rows, idx, u, h = args
    fams = sorted(set(f for fl in fams_rows for f in fl))
    vals = nf.eval_group(g, u, h, cball.PAIRS, fams)
    D = cball.D
    pos = np.concatenate((D['P'], D['PX'])); cls = [D['C%d' % k] for k in cball.CANON]; train = np.concatenate([pos] + cls)
    out = []
    for i in range(len(u)):
        nball._CACHE.clear()
        for fam in fams_rows[i]:
            V1, E1, V2, E2 = nf.v2full(vals[fam]); r, e, und, sg2 = nsolve.ratio(V1, E1, V2, E2)
            row = cball.Row(fam, u[i], h[i], r[i], e[i], und[i], sg2[i])
            st, ints, info = cball.resolve(row, pos, cls, train, force_all=True)
            rec = dict(fam=fam, node=int(idx[i]), u=float(u[i]), h=float(h[i]), res=st, nb_train=row.nb, nleft=len(row.failed), ints=ints[:6], **info)
            if st == 'ttrain':
                rec['primary'] = cball.heldout_primary(row, ints); rec['secondary'] = cball.heldout_any(row, ints)
            rec['nb'] = row.nb
            out.append(rec)
    return out
def main():
    c15, outf, flf = sys.argv[1], sys.argv[2], sys.argv[3]
    cball.setup(); nw = int(os.environ.get('RH_WORKERS', '4'))
    print('planned memory: float64 blocks below 3 MB per worker; workers %d' % nw, flush=True)
    rs = np.random.Generator(np.random.PCG64(171700))
    nd = np.load(os.path.join(c15, 'out', 'g2_nodes.npz'))
    feas = {f: np.array(json.load(open(os.path.join(c15, 'out2', f + '_summary.json')))['summary']['PA/canon/rows_feas'], dtype=np.int64) for f in ('b2-with', 'b5l-with')}
    tot = sum(len(v) for v in feas.values()); per = {}
    for f, v in feas.items():
        for q in rs.choice(v, int(round(500*len(v)/tot)), replace=False): per.setdefault(int(q), []).append(f)
    nsample = sum(len(v) for v in per.values())
    for f, q in json.load(open(flf)):
        if f not in per.get(int(q), []): per.setdefault(int(q), []).append(f)
    keys = sorted(per); jobs = []
    for i in range(0, len(keys), 2):
        kk = np.array(keys[i:i+2], dtype=np.int64)
        jobs.append(('g2', [per[int(q)] for q in kk], kk, nd['u'][kk], nd['h'][kk]))
    print('sample %d, with flagged %d family-nodes, jobs %d' % (nsample, sum(len(v) for v in per.values()), len(jobs)), flush=True)
    t0 = time.time(); rows = []
    with mp.get_context('fork').Pool(nw) as pool:
        for k, o in enumerate(pool.imap_unordered(work, jobs)):
            rows += o
            if (k+1) % 25 == 0: print('job %d/%d %.0fs' % (k+1, len(jobs), time.time()-t0), flush=True)
    json.dump(dict(rows=rows, seconds=time.time()-t0), open(outf, 'w'))
    print('status', {s: sum(1 for q in rows if q['res'] == s) for s in set(q['res'] for q in rows)},
          'primary full', sum(1 for q in rows if q.get('primary', {}).get('full')), 'secondary any', sum(1 for q in rows if q.get('secondary', {}).get('any')), flush=True)
    print('REF2B-DONE %.0fs' % (time.time()-t0), flush=True)
main()
