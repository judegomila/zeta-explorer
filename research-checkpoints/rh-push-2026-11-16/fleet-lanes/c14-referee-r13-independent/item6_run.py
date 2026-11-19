# Item 6: independent sample of functionals of the registered dictionary, recomputed with item6_kern.py
# (python-flint balls) and compared with the lane's stored float64 grid signs (out/signs_*.npy, read as data).
import sys, os, json, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from multiprocessing import Pool
import item6_kern as K

LANE = sys.argv[1]
OUT = sys.argv[2]
NPER = int(sys.argv[3]) if len(sys.argv) > 3 else 20
WORKERS = int(sys.argv[4]) if len(sys.argv) > 4 else 8
SEED = 20261119
meta = json.load(open(os.path.join(LANE, 'out', 'meta.json')))
names = meta['names']
groups = meta['groups']
OBJ = K.make_objects(names)
ONAMES = [n for n in names if n in OBJ]
OIDX = [names.index(n) for n in ONAMES]
PIDX = [i for i, g in enumerate(groups) if g == 'P']
COLS = {m: list(itertools.combinations(range(1, 14), m)) for m in (2, 3, 4)}
FAMS = ['D1', 'D2-F1', 'D2-F2', 'D2-F3', 'D2-F4', 'D2-F5', 'D3a', 'D3b-F1', 'D3b-F2', 'D3b-F3', 'D3b-F4', 'D3b-F5']
SLOW = ('EA', 'EIS', 'HEAT')


def task(t):
    fam, row, par, kind, tag = t
    t0 = time.time()
    res = {}
    f = 'minor' if fam in ('D1', 'D3a') else fam.split('-')[1]
    for nm in ONAMES:
        base = OBJ[nm][0 if kind == 'pol' else 1]
        ladder = [256, 1024, 4096] if nm.startswith(SLOW) else [256, 1024, 4096, 16384]
        s, p = K.sign_of(f, par, base, ladder)
        res[nm] = [s, p]
    return dict(fam=fam, row=row, tag=tag, par={k: (list(map(int, v)) if k == 'cols' else (int(v) if k in ('m', 'p') else float(v))) for k, v in par.items()}, signs=res, sec=time.time() - t0)


if __name__ == '__main__':
    rng = np.random.Generator(np.random.PCG64(SEED))
    tasks = []
    stored = {}
    print('planned memory: sign matrices are memory-mapped (375 MB largest, not loaded); tasks hold a few kB each', flush=True)
    for fam in FAMS:
        z = np.load(os.path.join(LANE, 'out', 'params_%s.npz' % fam), allow_pickle=False)
        S = np.load(os.path.join(LANE, 'out', 'signs_%s.npy' % fam), mmap_mode='r')
        n = S.shape[0]
        kind = 'pol' if fam.startswith(('D1', 'D2')) else 'k3'
        sel = [(int(r), 'A') for r in rng.choice(n, size=NPER, replace=False)]
        nb = {'D1': 20, 'D3a': 20, 'D2-F1': 10, 'D2-F2': 10}.get(fam, 0) * NPER // 20
        if nb:
            # rows one-signed on the 24 training positives by the stored matrix (strict reading); chunked scan
            ones = []
            tn = names.index('TNR3_2.2')
            for a in range(0, n, 200000):
                blk = np.asarray(S[a:a + 200000][:, PIDX + [tn]])
                P = blk[:, :-1]
                ok = (P != 0).all(axis=1) & ((P == P[:, :1]).all(axis=1))
                opp = blk[:, -1] == -P[:, 0]
                for r in np.nonzero(ok)[0]:
                    ones.append((a + int(r), bool(opp[r])))
            ones_opp = [r for r, o in ones if o]
            ones_no = [r for r, o in ones if not o]
            if fam == 'D1':
                pick = list(rng.choice(ones_opp, size=min(nb // 2, len(ones_opp)), replace=False)) + list(rng.choice(ones_no, size=min(nb // 2, len(ones_no)), replace=False))
            else:
                allr = [r for r, _ in ones]
                pick = list(rng.choice(allr, size=min(nb, len(allr)), replace=False))
            sel += [(int(r), 'B') for r in pick]
            print(fam, 'P2-one-signed rows in the stored matrix:', len(ones), 'with battery T-NR opposite:', len(ones_opp), flush=True)
        for r, tag in sel:
            if fam in ('D1', 'D3a'):
                m = int(z['m'][r])
                par = dict(m=m, cols=COLS[m][int(z['ci'][r])], u0=z['u0'][r], h=z['h'][r], g=z['g'][r])
            else:
                par = dict(p=int(z['p'][r]), u=z['u'][r], h=z['h'][r], lam=z['lam'][r], mu=z['mu'][r])
            tasks.append((fam, r, par, kind, tag))
            stored[(fam, r)] = [int(x) for x in np.asarray(S[r])]
    print('tasks', len(tasks), 'objects', len(ONAMES), flush=True)
    t0 = time.time()
    with Pool(WORKERS) as pool, open(OUT, 'w') as fo:
        for k, res in enumerate(pool.imap_unordered(task, tasks, chunksize=1)):
            st = stored[(res['fam'], res['row'])]
            res['stored'] = {nm: st[i] for nm, i in zip(ONAMES, OIDX)}
            res['stored_all_pos'] = [st[i] for i in PIDX]
            fo.write(json.dumps(res) + '\n')
            fo.flush()
            if k % 20 == 0:
                print(k, res['fam'], round(res['sec'], 1), round(time.time() - t0), flush=True)
    print('done', time.time() - t0, flush=True)
