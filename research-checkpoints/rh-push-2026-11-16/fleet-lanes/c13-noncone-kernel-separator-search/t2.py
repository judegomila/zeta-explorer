"""cross-check: float64 decided signs against ball signs on random (functional, object) pairs. Writes tables/ball_vs_float.json"""
import json, sys, time, numpy as np, funcs, objects, ballk
out = sys.argv[1]; npairs = int(sys.argv[2])
O = objects.build(); meta = json.load(open(out + '/meta.json'))
r = np.random.Generator(np.random.PCG64(138000))
res = {}
ev = {}
for fam in sys.argv[3].split(','):
    S = np.load(out + '/signs_%s.npy' % fam, mmap_mode='r'); P = dict(np.load(out + '/params_%s.npz' % fam))
    agree = dis = und_ball = und_float = 0; t0 = time.time(); bad = []
    bytype = {}
    for _ in range(npairs):
        i = int(r.integers(0, S.shape[0])); j = int(r.integers(0, S.shape[1]))
        if type(O[j][1]).__name__ == 'Heat' and funcs.fam_info(fam)[1]:
            if r.random() > 0.05: continue
        if j not in ev: ev[j] = ballk.Evaluator(O[j][1])
        row = {k: v[i] for k, v in P.items()}
        sf = int(S[i, j])
        sb, pr = ev[j].sign(fam, row, precs=(256, 1024, 4096) if sf == 0 else (256, 1024))
        ev[j].cache.clear()
        tn = type(O[j][1]).__name__
        bt = bytype.setdefault(tn, [0, 0, 0, 0])
        if sf == 0: und_float += 1; bt[2] += 1; bt[3] += (sb != 0)
        elif sb == 0: und_ball += 1
        elif sf == sb: agree += 1; bt[0] += 1
        else: dis += 1; bt[1] += 1; bad.append((fam, i, O[j][1].name, sf, sb))
    res[fam] = dict(pairs=agree + dis + und_ball + und_float, float_decided_agree=agree, float_decided_disagree=dis, float_decided_ball_undecided=und_ball,
                    float_undecided=und_float, by_type_agree_disagree_floatund_ballresolved=bytype, bad=bad[:20], seconds=time.time() - t0)
    print(fam, res[fam], flush=True)
json.dump(res, open('tables/ball_vs_float_%s.json' % sys.argv[4], 'w'), indent=1)
