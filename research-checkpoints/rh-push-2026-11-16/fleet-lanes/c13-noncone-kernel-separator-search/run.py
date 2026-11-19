"""Sign matrices. usage: python run.py <outdir> <real|synth> <family>[,<family>...] [chunk]
A family name may be a registered grid ('D1'), its random draws ('D1-rnd'), or a parameter file '<fam>-adp' whose
table is read from <outdir>/params_<fam>-adp.npz. Output: signs_<fam>.npy int8 (F, n_obj), params_<fam>.npz, meta.json."""
import json, os, sys, time
import multiprocessing as mp
import numpy as np
import funcs, objects

OBJS = None
TAB = None
FAM = None


def work(sl):
    lo, hi = sl
    return lo, funcs.eval_family(FAM, funcs.take(TAB, slice(lo, hi)), [o for _, o in OBJS])


def main():
    global OBJS, TAB, FAM
    out, mode, fams = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    chunk = int(sys.argv[4]) if len(sys.argv) > 4 else 200000
    os.makedirs(out, exist_ok=True)
    nw = int(os.environ.get('RH_WORKERS', '4'))
    info = {}
    OBJS = objects.build(info) if mode == 'real' else objects.build_synth()
    meta = dict(mode=mode, names=[o.name for _, o in OBJS], groups=[g for g, _ in OBJS], cplx=[bool(o.cplx) for _, o in OBJS], info=info)
    json.dump(meta, open(os.path.join(out, 'meta.json'), 'w'), indent=1)
    print('objects', len(OBJS), 'workers', nw, flush=True)
    for FAM in fams:
        t0 = time.time()
        pf = os.path.join(out, 'params_%s.npz' % FAM)
        if FAM.endswith('-adp'):
            TAB = dict(np.load(pf))
        else:
            TAB = funcs.gen_family(FAM)
            if TAB is None:
                continue
            np.savez(pf, **TAB)
        F = funcs.nfun(TAB)
        print('%s: %d functionals; planned allocation: sign matrix int8[%d x %d] = %.1f MB; per worker chunk %d functionals, '
              'largest temporary complex128[%d x 4 x 4] = %.1f MB' % (FAM, F, F, len(OBJS), F * len(OBJS) / 1e6, chunk, chunk, chunk * 256 / 1e6), flush=True)
        S = np.lib.format.open_memmap(os.path.join(out, 'signs_%s.npy' % FAM), mode='w+', dtype=np.int8, shape=(F, len(OBJS)))
        sls = [(lo, min(lo + chunk, F)) for lo in range(0, F, chunk)]
        with mp.get_context('fork').Pool(min(nw, len(sls))) as pool:
            for k, (lo, s) in enumerate(pool.imap_unordered(work, sls)):
                S[lo:lo + len(s)] = s
                if k % 10 == 0:
                    print('  %s chunk %d/%d  %.0f s' % (FAM, k + 1, len(sls), time.time() - t0), flush=True)
        S.flush()
        del S
        print('%s done in %.0f s' % (FAM, time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
