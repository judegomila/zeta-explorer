# usage: run_u.py <tasks.txt> <outdir>      (workers = $RH_WORKERS, default 2)
# task line:  obj h r n dps0 dpsmax
# Uniform nested family x_j = j h, j < n, width s = r h.  M_n = (-Z)(x_j - x_k) is symmetric Toeplitz; Schur pivots by Levinson in arb.
# Output <outdir>/<obj>_h<h>_r<r>_n<n>.json ; a task with an existing "done" json is skipped (resumable); precision escalates x1.6
# until the certificate (bh.certify: Sylvester + Gershgorin on X T X^T) covers all n stages or dpsmax is reached.  Intermediate precision levels are saved as they finish.
import sys, os, json, time, math, resource
from multiprocessing import Pool
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bh
from flint import arb

def run_task(line):
    name, h, r, n, dps0, dpsmax = line.split(); n = int(n); dps = int(dps0); dpsmax = int(dpsmax)
    outdir = os.environ['BH_OUT']
    tag = '%s_h%s_r%s_n%d' % (name, h, r, n)
    fn = os.path.join(outdir, tag + '.json')
    res = None
    if os.path.exists(fn):
        res = json.load(open(fn))
        if res.get('done'): return tag + ' (already done)'
        dps = max(dps, int(res['dps']*1.6))
    logf = open(os.path.join(outdir, tag + '.log'), 'a')
    def log(msg):
        logf.write('[%s dps=%d] %s\n' % (time.strftime('%H:%M:%S'), dps, msg)); logf.flush()
    while True:
        t0 = time.time()
        # planned memory: lag tables 6 n arbs, Levinson 2 n arbs, weights table; each arb ~ (48 + prec/8) bytes
        bh.setprec(dps)
        obj = bh.make_obj(name)
        mem_mb = (n*n*(4*(96 + dps*0.84) + 100) + n*n/2*(64 + dps*0.42))/1e6
        log('start n=%d; planned allocation ~ %.0f MB (4 n x n ball matrices incl. entry list, n^2/2 midpoint rows) plus the weight table' % (n, mem_mb))
        T = bh.lag_table(obj, h, r, n, dps, log=log)
        t1 = time.time()
        maxrad = max(float(x.rad()) for x in T['mZ'])
        rows = bh.levinson_mid(T['mZ'])
        mcert, piv, worst = bh.certify(bh.toeplitz_mat(T['mZ']), rows)
        piv = piv[:mcert]
        del rows
        t2 = time.time()
        pos, neg, und = bh.inertia_from_pivots(piv)
        determined = mcert
        hf = float(h)
        lg = [bh.log10abs(p) for p in piv]
        neg_off = sum(1 for x in T['I'][1:] if x < 0)
        res = dict(obj=name, h=h, r=r, n=n, dps=dps, determined=determined, done=(determined == n) or dps >= dpsmax,
                   complete=(determined == n), base=obj.base, npoles=len(obj.poles),
                   pos_pivot_stages=pos, n_neg=neg,
                   first_pos=(pos[0] if pos else None), first_pos_cutoff=((pos[0]-1)*hf if pos else None),
                   inertia_full_at_determined=[len(obj.poles) + len(pos), len(obj.poles) + neg],
                   log10_abs_pivot=[None if x is None else round(x, 2) for x in lg],
                   min_log10_abs_pivot=min(x for x in lg if x is not None),
                   max_entry_radius=maxrad, gershgorin_max_rowsum=worst, I0=T['I'][0].str(15), I_neg_offdiag=neg_off,
                   I_first=[T['I'][j].str(12) for j in range(min(n, 4))],
                   t_table=round(t1-t0, 1), t_levinson=round(t2-t1, 1),
                   maxrss_mb=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss/(1024 if sys.platform != 'darwin' else 1048576),
                   note=obj.note)
        json.dump(res, open(fn + '.tmp', 'w')); os.replace(fn + '.tmp', fn)
        log('determined %d/%d, positive pivots %d (first %s), min log10|pivot| %.1f, table %.0fs levinson %.0fs' % (determined, n, len(pos), pos[0] if pos else None, res['min_log10_abs_pivot'], t1-t0, t2-t1))
        if res['done']: break
        dps = min(dpsmax, int(dps*1.6))
    return '%s: determined %d/%d dps=%d first_pos=%s npos=%d' % (tag, res['determined'], n, res['dps'], res['first_pos'], len(res['pos_pivot_stages']))

if __name__ == '__main__':
    if sys.argv[1] == '--one':
        os.makedirs(sys.argv[3], exist_ok=True); os.environ['BH_OUT'] = sys.argv[3]
        print(time.strftime('%H:%M:%S'), run_task(sys.argv[2]), flush=True); sys.exit(0)
    tasks = [l.strip() for l in open(sys.argv[1]) if l.strip() and not l.startswith('#')]
    OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True); os.environ['BH_OUT'] = OUT
    W = int(os.environ.get('RH_WORKERS', '2'))
    print('tasks %d workers %d' % (len(tasks), W), flush=True)
    with Pool(W, maxtasksperchild=1) as pool:
        for r in pool.imap_unordered(run_task, tasks, chunksize=1):
            print(time.strftime('%H:%M:%S'), r, flush=True)
    print('ALL DONE', flush=True)
