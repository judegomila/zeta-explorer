"""Referee check R2: the selection of PREREG sections 1, 5, 6 re-implemented row by row from the text (python sets, no
shared code with analyse.py), on every row of the small families and a 1-in-7 subsample of D1 and D3a; counts compared
with analysis_<family>.json. usage: python ref_select.py <outdir>  -> tables/referee_selection_check.json"""
import json, sys
import numpy as np
out = sys.argv[1]
meta = json.load(open(out + '/meta.json'))
g = meta['groups']; cplx = meta['cplx']
P2 = [j for j, x in enumerate(g) if x == 'P']; P1 = [j for j in P2 if not cplx[j]]; P0 = P2[:1]
PH = [j for j, x in enumerate(g) if x == 'PH']
C = {k: [j for j, x in enumerate(g) if x == 'C%d' % k] for k in range(1, 10)}
H = {k: [j for j, x in enumerate(g) if x == 'H%d' % k] for k in range(1, 10)}
res = {}
for fam in ['D1', 'D3a'] + ['%s-%s' % (d, f) for d in ('D2', 'D3b') for f in ('F1', 'F2', 'F3', 'F4', 'F5')]:
    S = np.load(out + '/signs_%s.npy' % fam, mmap_mode='r')
    a = json.load(open(out + '/analysis_%s.json' % fam))
    step = 7 if S.shape[0] > 200000 else 1
    cnt = {p: dict(one=0, ttrain=0, tweak=0, full=0, rej=[0] * 9) for p in ('P0', 'P1', 'P2')}
    for i in range(0, S.shape[0], step):
        row = S[i].tolist()
        for name, P in (('P0', P0), ('P1', P1), ('P2', P2)):
            vals = {row[j] for j in P}
            if len(vals) != 1 or 0 in vals:
                continue
            s = vals.pop()
            c = cnt[name]; c['one'] += 1
            rej = [any(row[j] == -s for j in C[k]) for k in range(1, 10)]
            for k in range(9):
                c['rej'][k] += rej[k]
            if all(rej):
                c['ttrain'] += 1
                ph = PH if name == 'P2' else ([j for j in PH if not cplx[j]] if name == 'P1' else [])
                heldopp = [sum(row[j] == -s for j in H[k]) for k in range(1, 10)]
                if all(x >= 1 for x in heldopp) and not any(row[j] == -s for j in ph):
                    c['tweak'] += 1
                if all(x >= 23 for x in heldopp) and (not ph or sum(row[j] == s for j in ph) >= 0.95 * len(ph)):
                    c['full'] += 1
    comp = {}
    for p in ('P0', 'P1', 'P2'):
        A = a['%s/strict' % p]
        if step == 1:
            comp[p] = dict(one=(cnt[p]['one'], A['one']), ttrain=(cnt[p]['ttrain'], A['ttrain']), full=(cnt[p]['full'], A['full']),
                           rej_match=bool(all(abs(cnt[p]['rej'][k] - A['rejT'][k]) < 0.5 for k in range(9))))
        else:
            comp[p] = dict(one_subsample=cnt[p]['one'], one_expected_from_full=A['one'] / step, ttrain=(cnt[p]['ttrain'], A['ttrain']), full=(cnt[p]['full'], A['full']),
                           rej_subsample=cnt[p]['rej'], rej_expected_from_full=[x / step for x in A['rejT']])
    res[fam] = dict(step=step, rows_read=len(range(0, S.shape[0], step)), compare=comp)
    print(fam, json.dumps(res[fam])[:600], flush=True)
json.dump(res, open('tables/referee_selection_check.json', 'w'), indent=1)
