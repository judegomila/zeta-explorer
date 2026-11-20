"""Second referee, DN lane item: 500 of the 22,508 float64 T-train nodes (rows_feas, canonical tier) with EVERY
training entry in balls (cball.resolve force_all=True, the lane's 'repro' path), own sample (seed 171700).
usage: ref2_feas.py <c15dir> <out.json> [n]   (run from a directory holding the lane's code files)"""
import json, os, sys, time
import multiprocessing as mp
import numpy as np
import cball
def main():
    c15, outf = sys.argv[1], sys.argv[2]; n = int(sys.argv[3]) if len(sys.argv) > 3 else 500
    cball.setup()
    nw = int(os.environ.get('RH_WORKERS', '4'))
    print('planned memory: float64 blocks below 3 MB per worker; ball caches per node only; workers %d' % nw, flush=True)
    rs = np.random.Generator(np.random.PCG64(171700))
    nd = np.load(os.path.join(c15, 'out', 'g2_nodes.npz'))
    feas = {f: np.array(json.load(open(os.path.join(c15, 'out2', f + '_summary.json')))['summary']['PA/canon/rows_feas'], dtype=np.int64)
            for f in ('b2-with', 'b5l-with')}
    tot = sum(len(v) for v in feas.values())
    print({f: len(v) for f, v in feas.items()}, tot, flush=True)
    per = {}
    for f, v in feas.items():
        k = int(round(n*len(v)/tot))
        for q in rs.choice(v, k, replace=False): per.setdefault(int(q), []).append(f)
    keys = sorted(per); jobs = []
    for i in range(0, len(keys), 2):
        kk = np.array(keys[i:i+2], dtype=np.int64)
        jobs.append(('g2', [per[int(q)] for q in kk], kk, nd['u'][kk], nd['h'][kk], 'repro'))
    print('family-nodes %d, jobs %d' % (sum(len(v) for v in per.values()), len(jobs)), flush=True)
    t0 = time.time(); rows = []
    with mp.get_context('fork').Pool(nw) as pool:
        for k, o in enumerate(pool.imap_unordered(cball.work, jobs)):
            rows += o
            if (k+1) % 25 == 0: print('job %d/%d %.0fs' % (k+1, len(jobs), time.time()-t0), flush=True)
    cnt = {}
    for q in rows: cnt[(q['fam'], q['res'])] = cnt.get((q['fam'], q['res']), 0) + 1
    print({'%s/%s' % k: v for k, v in cnt.items()}, 'nleft>0:', sum(1 for q in rows if q['nleft']), flush=True)
    json.dump(dict(rows=rows, counts={'%s/%s' % k: v for k, v in cnt.items()}, seconds=time.time()-t0), open(outf, 'w'))
    print('REF2-DONE %.0fs' % (time.time()-t0), flush=True)
main()
