"""Closest approaches (registered secondary readings made explicit): for each family and positive set
(i) the functionals with a member (training or held-out) of opposite sign in every class, with their held-out profile;
(ii) the functional maximising min over classes of the held-out opposite fraction ("best worst-class rejection").
The best 3 of each list are re-evaluated on every object in balls. usage: python closest.py <outdir> <family>[,...]
Writes <outdir>/closest_<family>.json."""
import json, os, sys, time
import numpy as np
import analyse, objects, ballk

out = sys.argv[1]
meta = json.load(open(os.path.join(out, 'meta.json')))
idx = analyse.group_index(meta['groups'], meta['cplx'])
OBJS = objects.build()
EV = {}


def ballrow(fam, row):
    sg = []
    for j, (_, o) in enumerate(OBJS):
        if j not in EV:
            EV[j] = ballk.Evaluator(o)
        heavy = type(o).__name__ in ('Heat', 'EA')
        s, pr = EV[j].sign(fam, row, (300, 1200) if heavy else (300, 1200, 4000))
        EV[j].cache.clear()
        sg.append(s)
    return np.array([sg], dtype=np.int8)


def describe(T, i):
    return dict(sign=int(T['s'][i]), rejT=T['rejT'][i].astype(int).tolist(), fracH=np.round(T['fracH'][i], 3).tolist(), anyH=T['anyH'][i].astype(int).tolist(),
                ph_same=float(T['ph_same'][i]), min_fracH=float(T['fracH'][i].min()), ttrain=bool(T['ttrain'][i]), full=bool(T['full'][i]))


def do(fam):
    f = os.path.join(out, 'signs_%s.npy' % fam)
    if not os.path.exists(f):
        return fam
    t0 = time.time()
    S = np.load(f, mmap_mode='r')
    P = dict(np.load(os.path.join(out, 'params_%s.npz' % fam)))
    res = dict(family=fam)
    for pset in ('P0', 'P1', 'P2'):
        allany = []
        best = (-1.0, -1)
        nall = 0
        for lo in range(0, S.shape[0], analyse.BLOCK):
            T = analyse.tiers(np.asarray(S[lo:lo + analyse.BLOCK]), idx, pset, 'strict')
            anyc = (T['rejT'] | T['anyH']).all(1) & T['one']
            nall += int(anyc.sum())
            mf = np.where(T['one'], T['fracH'].min(1), -1.0)
            for i in np.nonzero(anyc)[0]:
                allany.append((float(mf[i]), int(lo + i)))
            i = int(np.argmax(mf))
            if mf[i] > best[0]:
                best = (float(mf[i]), int(lo + i))
        allany.sort(reverse=True)
        rows = [r for _, r in allany[:2]]
        if best[1] >= 0 and best[1] not in rows:
            rows.append(best[1])
        recs = []
        for r in rows:
            row = {k: v[r] for k, v in P.items()}
            Tf = analyse.tiers(np.asarray(S[r:r + 1]), idx, pset, 'strict')
            Tb = analyse.tiers(ballrow(fam, row), idx, pset, 'strict')
            recs.append(dict(row=r, params={k: (float(v[r]) if v.dtype.kind == 'f' else int(v[r])) for k, v in P.items()}, float64=describe(Tf, 0), ball=describe(Tb, 0)))
        res[pset] = dict(n_every_class_has_an_opposite_member=nall, best_min_heldout_fraction=best[0], rows=recs)
    json.dump(res, open(os.path.join(out, 'closest_%s.json' % fam), 'w'), indent=1)
    print(fam, {p: (res[p]['n_every_class_has_an_opposite_member'], round(res[p]['best_min_heldout_fraction'], 3)) for p in ('P0', 'P1', 'P2')}, '%.0f s' % (time.time() - t0), flush=True)
    return fam


if __name__ == '__main__':
    import multiprocessing as mp
    fams = sys.argv[2].split(',')
    with mp.get_context('fork').Pool(min(int(os.environ.get('RH_WORKERS', '4')), len(fams))) as pool:
        list(pool.imap_unordered(do, fams, chunksize=1))
