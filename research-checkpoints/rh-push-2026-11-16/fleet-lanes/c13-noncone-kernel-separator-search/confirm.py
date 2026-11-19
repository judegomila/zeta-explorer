"""Ball confirmation of float64 rows. usage: python confirm.py <outdir> <family>[,...]
(i) the 10 best near-misses of each family (P2, then P1, P0 lists): every object in balls;
(ii) 60 random functionals one-signed on P2 (float64): the 50 training objects in balls;
(iii) D1 only: 30 functionals one-signed on P2 on which the float64 T-NR member has the opposite sign: positives and
      T-NR in balls (prediction 2).
Writes <outdir>/confirm_<family>.json."""
import json, os, sys, time
import multiprocessing as mp
import numpy as np
import funcs, objects, ballk, analyse

PRECS = (300, 1200, 4000)
OBJS = None; FAM = None; TAB = None; SG = None; EV = {}


def one(task):
    i, cols, precs = task
    row = {k: v[i] for k, v in TAB.items()}
    out = {}
    for j in cols:
        if j not in EV:
            EV[j] = ballk.Evaluator(OBJS[j][1])
        heavy = type(OBJS[j][1]).__name__ in ('Heat', 'EA')
        s, pr = EV[j].sign(FAM, row, precs[:2] if heavy else precs)
        EV[j].cache.clear()
        out[j] = s
    return i, out


def main():
    global OBJS, FAM, TAB, SG
    out = sys.argv[1]
    nw = int(os.environ.get('RH_WORKERS', '4'))
    OBJS = objects.build()
    meta = json.load(open(os.path.join(out, 'meta.json')))
    idx = analyse.group_index(meta['groups'], meta['cplx'])
    g = np.array(meta['groups'])
    train = [j for j in range(len(g)) if g[j] == 'P' or g[j].startswith('C')]
    r = np.random.Generator(np.random.PCG64(140000))
    for FAM in sys.argv[2].split(','):
        t0 = time.time()
        a = json.load(open(os.path.join(out, 'analysis_%s.json' % FAM)))
        TAB = dict(np.load(os.path.join(out, 'params_%s.npz' % FAM)))
        SG = np.load(os.path.join(out, 'signs_%s.npy' % FAM), mmap_mode='r')
        top = []
        for pset in ('P2', 'P1', 'P0'):
            for sc, i in a['%s/strict' % pset].get('top', []):
                if i not in top and len(top) < 10:
                    top.append(i)
        T = analyse.tiers(np.asarray(SG[::max(1, SG.shape[0] // 400000)]), idx, 'P2', 'strict')
        step = max(1, SG.shape[0] // 400000)
        ones = np.nonzero(T['one'])[0] * step
        rnd = r.choice(ones, min(60, len(ones)), replace=False).tolist() if len(ones) else []
        tn = []
        if FAM == 'D1':
            w = np.nonzero(T['one'] & T['rejT'][:, 1])[0] * step
            tn = r.choice(w, min(30, len(w)), replace=False).tolist() if len(w) else []
        tasks = [(i, list(range(len(g))), PRECS) for i in top] + [(i, train, PRECS) for i in rnd] + [(i, list(idx['P2']) + list(idx['C2']), PRECS) for i in tn]
        with mp.get_context('fork').Pool(min(nw, max(1, len(tasks)))) as pool:
            got = pool.map(one, tasks, chunksize=1)
        agree = dis = fund = bund = 0
        bad = []
        for (i, sg), (_, cols, _) in zip(got, tasks):
            for j in cols:
                sf = int(SG[i, j])
                sb = sg[j]
                if sf == 0:
                    fund += 1
                elif sb == 0:
                    bund += 1
                elif sf == sb:
                    agree += 1
                else:
                    dis += 1
                    bad.append((int(i), meta['names'][j], sf, sb))
        res = dict(family=FAM, entries=agree + dis + fund + bund, float_decided_agree=agree, float_decided_disagree=dis, float_undecided=fund,
                   float_decided_ball_undecided=bund, bad=bad[:50], seconds=time.time() - t0)
        # ball-certified reading of the top rows
        tops = []
        for (i, sg) in got[:len(top)]:
            S2 = np.array([[sg[j] for j in range(len(g))]], dtype=np.int8)
            rowd = {}
            for pset in ('P0', 'P1', 'P2'):
                Tt = analyse.tiers(S2, idx, pset, 'strict')
                rowd[pset] = dict(sign=int(Tt['s'][0]), classes_rejected_train=int(Tt['rejT'][0].sum()), classes_any_member=int((Tt['rejT'][0] | Tt['anyH'][0]).sum()),
                                  classes_heldout95=int((Tt['fracH'][0] >= 0.95).sum()), fracH=np.round(Tt['fracH'][0], 3).tolist(), rejT=Tt['rejT'][0].astype(int).tolist(),
                                  ph_same=float(Tt['ph_same'][0]), full=bool(Tt['full'][0]))
            tops.append(dict(row=int(i), params={k: (float(v[i]) if v.dtype.kind == 'f' else int(v[i])) for k, v in TAB.items()}, ball=rowd,
                             ball_undecided=int(sum(1 for j in sg if sg[j] == 0))))
        res['top_rows_ball'] = tops
        if tn:
            ok = 0
            for (i, sg) in got[len(top) + len(rnd):]:
                ps = [sg[j] for j in idx['P2']]
                if all(p == ps[0] and p != 0 for p in ps) and any(sg[j] == -ps[0] for j in idx['C2']):
                    ok += 1
            res['prediction2_tnr_counterexamples_ball'] = dict(tested=len(tn), confirmed=ok)
        json.dump(res, open(os.path.join(out, 'confirm_%s.json' % FAM), 'w'), indent=1)
        print(FAM, {k: v for k, v in res.items() if k not in ('top_rows_ball', 'bad')}, 'best top (P2):', max([t['ball']['P2']['classes_any_member'] for t in tops] or [0]), flush=True)


if __name__ == '__main__':
    main()
