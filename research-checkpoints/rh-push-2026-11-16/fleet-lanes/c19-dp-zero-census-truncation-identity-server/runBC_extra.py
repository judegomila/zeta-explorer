# Extra run (decided after the first cells of the main run were read; NOT pre-registered):
# the five single classes at windows w = 1..7, so that they are compared with zeta at equal power (8 windows).
import os, sys, json, time
import runBC
from runBC import *
if __name__ == '__main__':
    cells = [(float(x.split(':')[0]), float(x.split(':')[1])) for x in sys.argv[1].split(',')]
    nw = int(os.environ.get('RH_WORKERS', '4'))
    tws = sorted({t + 200.0 * w for t, _ in cells for w in range(1, 8)})
    zq = zq_pairs(tws)
    jobs = [(t, th, c, 'real', 0, w, zq[t + 200.0 * w]) for t, th in cells for w in range(1, 8) for c in ('TNR', 'ZQ', 'EA', 'DH', 'HQ2')]
    jobs.sort(key=lambda j: -P_of(j[0], j[1]))
    print('jobs', len(jobs), 'workers', nw, flush=True)
    t0 = time.time()
    with Pool(nw, maxtasksperchild=4) as pool, open('resBC_%s.jsonl' % (sys.argv[2] if len(sys.argv) > 2 else 'extra'), 'a') as fo:
        for i, r in enumerate(pool.imap_unordered(job, jobs)):
            r['zq'] = zq[r['t'] + 200.0 * r['w']]
            fo.write(json.dumps(r) + '\n'); fo.flush()
            if i % 40 == 0 or not r['complete'] or abs(r['resid']) > 1e-4:
                print(i, r['t'], r['theta'], r['cls'], r['w'], 'N_R', r['N_R'], 'n/w', r['n_ext'], r['wind_ext'], 'resid %.2e' % r['resid'], 'elapsed %.0f' % (time.time() - t0), flush=True)
    print('done', time.time() - t0, flush=True)
