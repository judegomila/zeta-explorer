"""c14 pipeline: float64 signs with the cascade of PREREG section 7.
usage: jrun.py <outdir> <real|synth> <fam,fam,...> [chunk] [scale]   (scale < 1 shrinks the random draws: smoke tests only)"""
import json
import multiprocessing as mp
import os
import sys
import time
import numpy as np
import jf
import jobj

PAIRS = None
NP1 = None


def work(args):
    fam, tab, i0 = args
    t = time.time()
    P1 = PAIRS[:NP1]
    S1 = jf.eval_family(fam, tab, P1)
    conflict = (S1 == 1).any(1) & (S1 == -1).any(1)
    gidx = i0 + np.arange(len(S1))
    sel = np.nonzero(~conflict | (gidx % 20 == 0))[0]
    S2 = jf.eval_family(fam, jf.take(tab, sel), PAIRS[NP1:]) if sel.size else np.zeros((0, len(PAIRS) - NP1), dtype=np.int8)
    return i0, S1, sel, S2, time.time() - t


def load_adaptive(out, fam):
    return dict(np.load(os.path.join(out, fam + '_params.npz')))


def main():
    global PAIRS, NP1
    out, mode, fams = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
    chunk = int(sys.argv[4]) if len(sys.argv) > 4 else 20000
    scale = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
    skip = tuple(int(x) for x in os.environ.get('C14_SKIP', '').split(',') if x)
    os.makedirs(out, exist_ok=True)
    t0 = time.time()
    info = {}
    PAIRS = jobj.build_synth() if mode == 'synth' else jobj.build(info, skip)
    NP1 = sum(1 for p in PAIRS if p.group == 'P')
    assert all(p.group == 'P' for p in PAIRS[:NP1])
    json.dump(dict(groups=[p.group for p in PAIRS], names=[p.name for p in PAIRS], info=info, skip=list(skip)),
              open(os.path.join(out, 'objects.json'), 'w'))
    nw = int(os.environ.get('RH_WORKERS', '4'))
    print('objects %d (stage 1: %d) built in %.0fs; workers %d' % (len(PAIRS), NP1, time.time() - t0, nw), flush=True)
    ctx = mp.get_context('fork')
    with ctx.Pool(nw) as pool:
        for fam in fams:
            t1 = time.time()
            if fam.endswith('-adp'):
                tab = load_adaptive(out, fam)
            else:
                tab = jf.gen_family(fam, scale)
                np.savez(os.path.join(out, fam + '_params.npz'), **tab)
            F = jf.nfun(tab)
            print('%s: %d functionals; planned: stage-1 signs int8[%d x %d] = %.1f MB; stage-2 signs at most int8[%d x %d] = %.1f MB'
                  % (fam, F, F, NP1, F * NP1 / 1e6, F, len(PAIRS) - NP1, F * (len(PAIRS) - NP1) / 1e6), flush=True)
            S1 = np.zeros((F, NP1), dtype=np.int8)
            idx2 = []
            s2 = []
            jobs = [(fam, jf.take(tab, slice(i, min(F, i + chunk))), i) for i in range(0, F, chunk)]
            done = 0
            for i0, a, sel, b, dt in pool.imap_unordered(work, jobs):
                S1[i0:i0 + len(a)] = a
                idx2.append(i0 + sel)
                s2.append(b)
                done += 1
                if done % 10 == 0 or done == len(jobs):
                    print('  %s chunk %d/%d (%.0fs this chunk, %.0fs family)' % (fam, done, len(jobs), dt, time.time() - t1), flush=True)
            idx2 = np.concatenate(idx2) if idx2 else np.zeros(0, dtype=np.int64)
            s2 = np.concatenate(s2) if s2 else np.zeros((0, len(PAIRS) - NP1), dtype=np.int8)
            o = np.argsort(idx2)
            np.save(os.path.join(out, fam + '_s1.npy'), S1)
            np.save(os.path.join(out, fam + '_idx2.npy'), idx2[o])
            np.save(os.path.join(out, fam + '_s2.npy'), s2[o])
            print('%s done: stage 2 on %d of %d (%.1f%%), %.0fs' % (fam, len(idx2), F, 100.0 * len(idx2) / max(F, 1), time.time() - t1), flush=True)
    print('RUN-DONE %.0fs' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
