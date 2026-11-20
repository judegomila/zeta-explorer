"""local post-processing of tables/families.json: per-family totals with the with/without split done by exact name
(make_tables.py matched 'JA-with' as a prefix of 'JA-without': its by_family 'with' rows contain both; superseded by
tables/by_family.json written here), best held-out fractions conditional on the held-out positives, near-miss rows."""
import json
import numpy as np
T = json.load(open('tables/families.json'))
rows = json.load(open('tables/pz_ttrain_rows.json'))
KINDS = ['JA', 'JB1', 'JB2', 'JC1', 'JC2']
keys = ['PZ/strict/all', 'PA/strict/all', 'PA/strict/FE', 'PZ/strict/FE']
out = {}
for k in KINDS:
    for pol in ('with', 'without'):
        fams = [f for f in T if f.split('-')[0] == k and f.split('-')[1] == pol]
        rec = dict(functionals=sum(T[f]['functionals'] for f in fams), stage2=sum(T[f]['stage2'] for f in fams), families=fams)
        for key in keys:
            a = dict(one_signed=0, ttrain=0, tweak=0, full=0)
            rej = 0
            hel = 0
            for f in fams:
                r = T[f][key]
                for kk in a:
                    a[kk] += r[kk]
                rej = rej + np.array(r['rejected_train'])
                hel = hel + np.array(r['heldout_ge23'])
            a['rejected_train'] = rej.tolist()
            a['heldout_ge23'] = hel.tolist()
            a['best_min_heldout'] = max(T[f][key]['best_min_heldout'] for f in fams)
            a['best_min_heldout_given_pos'] = max(T[f][key]['best_min_heldout_given_pos'] for f in fams)
            rec[key] = a
        out['%s-%s' % (k, pol)] = rec
tot = {}
for key in keys:
    a = dict(one_signed=0, ttrain=0, tweak=0, full=0)
    rej = 0
    for v in out.values():
        for kk in a:
            a[kk] += v[key][kk]
        rej = rej + np.array(v[key]['rejected_train'])
    a['rejected_train'] = rej.tolist()
    a['best_min_heldout_given_pos'] = max(v[key]['best_min_heldout_given_pos'] for v in out.values())
    a['best_min_heldout'] = max(v[key]['best_min_heldout'] for v in out.values())
    tot[key] = a
und = {f: T[f]['undecided_share_stage1'] for f in T}
json.dump(dict(by_family=out, total=tot, functionals=sum(v['functionals'] for v in out.values()), stage2=sum(v['stage2'] for v in out.values()),
               undecided_share_stage1_range=[min(und.values()), max(und.values())]), open('tables/by_family.json', 'w'), indent=1)
N = ['DH', 'T-NR', 'E_a', 'HEAT', 'theta^w', 'U', 'THIN', 'BLS', 'BEU']
L = []
for pset, key in (('PA', 'PA/strict/all'), ('PZ', 'PZ/strict/all')):
    L.append('\npositives %s, strict reading, all stages: one-signed; number rejecting a training pair of each class; T-train; best min-over-classes held-out fraction among rows with >= 23/24 held-out positives\n' % pset)
    L.append('| family | functionals | one-signed | ' + ' | '.join(N) + ' | T-train | best min (pos ok) |\n|---|---|---|' + '---|' * 11)
    for k, v in out.items():
        a = v[key]
        L.append('| %s | %s | %s | %s | %d | %.3f |' % (k, format(v['functionals'], ','), format(a['one_signed'], ','), ' | '.join(format(x, ',') for x in a['rejected_train']), a['ttrain'], a['best_min_heldout_given_pos']))
    a = tot[key]
    L.append('| total | %s | %s | %s | %d | %.3f |' % (format(sum(v['functionals'] for v in out.values()), ','), format(a['one_signed'], ','), ' | '.join(format(x, ',') for x in a['rejected_train']), a['ttrain'], a['best_min_heldout_given_pos']))
open('tables/by_family.md', 'w').write('\n'.join(L) + '\n')
print('\n'.join(L))
print(json.dumps(tot, indent=0))
# near-miss rows
for pset, tier in (('PZ', 'all'), ('PA', 'FE'), ('PZ', 'FE')):
    rr = [r for r in rows if r['pset'] == pset and r['tier'] == tier]
    if not rr:
        continue
    fam = {}
    for r in rr:
        fam[r['family']] = r['n_in_family']
    pxo = np.array([r['px_opposite'] for r in rr])
    phs = np.array([r['ph_same'] for r in rr])
    ho = np.array([r['heldout_all_classes'] for r in rr])
    trj = np.array([r['train_rejected_all_classes'] for r in rr])
    print('\n', pset, tier, 'rows listed', len(rr), 'per family (true counts)', fam)
    print('  PX opposite: min %d median %d max %d ; PX same max %d' % (pxo.min(), np.median(pxo), pxo.max(), max(r['px_same'] for r in rr)))
    print('  held-out positives same: min %d median %d max %d' % (phs.min(), np.median(phs), phs.max()))
    print('  held-out opposite per class, max over rows:', ho.max(0).tolist(), ' median:', np.median(ho, 0).tolist())
    print('  min over classes of held-out opposite: max over rows %d ; with ph_same>=23: %s' % (ho.min(1).max(), ho[phs >= 23].min(1).max() if (phs >= 23).any() else None))
    print('  training classes not rejected (count of rows per class):', (~trj).sum(0).tolist())
    b = sorted(rr, key=lambda r: (-min(r['heldout_all_classes']), -r['ph_same']))[:3]
    for r in b:
        print('  best:', r['family'], r['row'], r['params'], 's', r['s'], 'px_opp', r['px_opposite'], 'ph_same', r['ph_same'], 'held', r['heldout_all_classes'])
