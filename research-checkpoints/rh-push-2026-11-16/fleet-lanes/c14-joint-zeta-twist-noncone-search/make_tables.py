"""aggregate the per-family summaries. usage: make_tables.py <outdir>  -> tables/*.json and tables/summary.md"""
import glob
import json
import os
import sys
import numpy as np
import jan
import jf

out = sys.argv[1]
os.makedirs('tables', exist_ok=True)
stages = {'grid': '', 'rnd': '-rnd', 'adp': '-adp', 'rnd2': '-rnd2'}
T = {}
rows_pz = []
lines = []
tot = dict(functionals=0, stage2=0)
keys = ['PZ/strict/all', 'PA/strict/all', 'PA/fav/all', 'PA/strict/FE', 'PZ/strict/FE']
for st, suf in stages.items():
    for base in jf.FAMS:
        fam = base + suf
        f = os.path.join(out, fam + '_summary.json')
        if not os.path.exists(f):
            continue
        r = json.load(open(f))
        b = os.path.join(out, fam + '_ball.json')
        r['ball'] = json.load(open(b)) if os.path.exists(b) else None
        x = os.path.join(out, fam + '_xcheck.json')
        r['xcheck'] = json.load(open(x)) if os.path.exists(x) else None
        T[fam] = r
        tot['functionals'] += r['functionals']
        tot['stage2'] += r['stage2']
        # T-train rows in detail: PZ (both tiers) and PA in the FE tier
        if r['PZ/strict/all']['ttrain'] or r['PZ/strict/FE']['ttrain'] or r['PA/strict/FE']['ttrain']:
            g, s1, idx2, S = jan.load(out, fam)
            d = jan.gidx(g)
            tab = dict(np.load(os.path.join(out, fam + '_params.npz')))
            for pset, tier, classes in (('PZ', 'all', jan.ALLC), ('PZ', 'FE', jan.FE_CLASSES), ('PA', 'FE', jan.FE_CLASSES)):
                R = jan.criterion(S, d, pset, 'strict', classes)
                Rall = jan.criterion(S, d, pset, 'strict', jan.ALLC)
                nt = int(R['ttrain'].sum())
                for i in np.nonzero(R['ttrain'])[0][:300]:
                    s = R['s'][i]
                    rows_pz.append(dict(family=fam, pset=pset, tier=tier, n_in_family=nt, row=int(idx2[i]), s=int(s), params={k: float(tab[k][idx2[i]]) for k in tab},
                                        px_same=int((S[i, d['PX']] == s).sum()), px_opposite=int((S[i, d['PX']] == -s).sum()),
                                        ph_same=int(R['ph_same'][i]), heldout_all_classes=[int(v) for v in Rall['hf'][i]],
                                        train_rejected_all_classes=[bool(v) for v in Rall['tr'][i]],
                                        full=bool(R['full'][i]), tweak=bool(R['tweak'][i])))
json.dump(T, open('tables/families.json', 'w'), indent=0)
json.dump(rows_pz, open('tables/pz_ttrain_rows.json', 'w'), indent=0)


def agg(fams, key):
    a = dict(one_signed=0, ttrain=0, tweak=0, full=0)
    rej = None
    hel = None
    best = 0.0
    for fam in fams:
        r = T[fam][key]
        for k in a:
            a[k] += r[k]
        rej = np.array(r['rejected_train']) if rej is None else rej + np.array(r['rejected_train'])
        hel = np.array(r['heldout_ge23']) if hel is None else hel + np.array(r['heldout_ge23'])
        best = max(best, r['best_min_heldout'])
    a['rejected_train'] = rej.tolist()
    a['heldout_ge23'] = hel.tolist()
    a['best_min_heldout'] = best
    a['classes'] = T[fams[0]][key]['classes']
    return a


S = {}
for st, suf in stages.items():
    fams = [b + suf for b in jf.FAMS if b + suf in T]
    if not fams:
        continue
    S[st] = dict(functionals=sum(T[f]['functionals'] for f in fams), stage2=sum(T[f]['stage2'] for f in fams),
                 optimistic_PA_all=sum(T[f]['PA/optimistic/all'] for f in fams), optimistic_PA_FE=sum(T[f]['PA/optimistic/FE'] for f in fams),
                 optimistic_PZ_all=sum(T[f]['PZ/optimistic/all'] for f in fams))
    for key in keys:
        S[st][key] = agg(fams, key)
    sh = [T[f].get('shuffle') for f in fams if T[f].get('shuffle')]
    if sh:
        S[st]['shuffle'] = dict(runs=sum(x['n'] for x in sh), full=sum(x['full'] for x in sh), tweak=sum(x['tweak'] for x in sh), ttrain=sum(x['ttrain'] for x in sh))
    S[st]['planted_all_recovered'] = all(T[f].get('planted_rows_recovered', False) for f in fams)
    bl = [T[f]['ball'] for f in fams if T[f]['ball']]
    if bl:
        S[st]['ball'] = dict(optimistic_rows=sum(x['optimistic_rows'] for x in bl), not_processed=sum(x['not_processed'] for x in bl),
                             evaluations=sum(x['ball_evaluations'] for x in bl), pos_opposite=sum(x['pos_opposite'] for x in bl),
                             pos_undecided=sum(x['pos_undecided'] for x in bl), alive_all=sum(len(x['alive_all']) for x in bl),
                             alive_fe=sum(len(x['alive_fe']) for x in bl), full=sum(len(x['full_survivors']) for x in bl),
                             full_fe=sum(len(x['full_survivors_fe']) for x in bl),
                             unresolved_class_entries=sum(x['unresolved_class_entries'] for x in bl))
    xc = [T[f]['xcheck'] for f in fams if T[f]['xcheck']]
    if xc:
        S[st]['xcheck'] = {k: sum(x[k] for x in xc) for k in ('agree', 'disagree', 'ball_undecided', 'no_ball')}
by_kind = {}
for kind in jf.KINDS:
    for pol in ('with', 'without'):
        fams = [f for f in T if f.startswith('%s-%s' % (kind, pol))]
        if fams:
            by_kind['%s-%s' % (kind, pol)] = dict(functionals=sum(T[f]['functionals'] for f in fams), **{key: agg(fams, key) for key in keys})
json.dump(dict(stages=S, by_family=by_kind, total=tot, n_pz_ttrain_rows=len(rows_pz)), open('tables/totals.json', 'w'), indent=1)
with open('tables/summary.md', 'w') as f:
    f.write('| stage | functionals | stage 2 | PZ one-signed | PZ T-train | PZ full | PA one-signed | PA T-train | PA T-weak | PA full | FE tier PA T-train | FE tier PA full | optimistic PA (all/FE) |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n')
    for st, v in S.items():
        f.write('| %s | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d / %d |\n' % (
            st, v['functionals'], v['stage2'], v['PZ/strict/all']['one_signed'], v['PZ/strict/all']['ttrain'], v['PZ/strict/all']['full'],
            v['PA/strict/all']['one_signed'], v['PA/strict/all']['ttrain'], v['PA/strict/all']['tweak'], v['PA/strict/all']['full'],
            v['PA/strict/FE']['ttrain'], v['PA/strict/FE']['full'], v['optimistic_PA_all'], v['optimistic_PA_FE']))
    f.write('\nper family (all stages), positives PA, strict: one-signed; training rejections per class 1..9; rows with >= 23/24 held-out opposite per class; best min-over-classes held-out fraction\n\n')
    f.write('| family | functionals | PA one-signed | DH | T-NR | E_a | HEAT | theta^w | U | THIN | BLS | BEU | held-out >= 23/24 per class | best min |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n')
    for k, v in by_kind.items():
        a = v['PA/strict/all']
        f.write('| %s | %d | %d | %s | %s | %.3f |\n' % (k, v['functionals'], a['one_signed'], ' | '.join(str(x) for x in a['rejected_train']), a['heldout_ge23'], a['best_min_heldout']))
    f.write('\nthe same with positives PZ\n\n| family | PZ one-signed | DH | T-NR | E_a | HEAT | theta^w | U | THIN | BLS | BEU | T-train | best min |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n')
    for k, v in by_kind.items():
        a = v['PZ/strict/all']
        f.write('| %s | %d | %s | %d | %.3f |\n' % (k, a['one_signed'], ' | '.join(str(x) for x in a['rejected_train']), a['ttrain'], a['best_min_heldout']))
print(open('tables/summary.md').read())
print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk in ('shuffle', 'ball', 'xcheck', 'planted_all_recovered')} for k, v in S.items()}, indent=0))
