import json, sys, collections
rows = [json.loads(l) for l in open(sys.argv[1])]
out = {}
tot = collections.Counter(); byfam = collections.defaultdict(collections.Counter); byobj = collections.defaultdict(collections.Counter)
mism = []
precs = collections.Counter()
for r in rows:
    for nm, (s, p) in r['signs'].items():
        st = r['stored'][nm]
        precs[str(p)] += 1
        if s == 0:
            k = 'mine_unresolved'
        elif st == 0:
            k = 'stored_undecided_mine_decided'
        elif st == s:
            k = 'agree'
        else:
            k = 'DISAGREE'; mism.append((r['fam'], r['row'], nm, s, st, p))
        tot[k] += 1; byfam[r['fam']][k] += 1; byobj[nm][k] += 1
out['functionals'] = len(rows); out['setA'] = sum(1 for r in rows if r['tag'] == 'A'); out['setB'] = sum(1 for r in rows if r['tag'] == 'B')
out['objects'] = len(rows[0]['signs']); out['entries'] = dict(tot); out['by_family'] = {k: dict(v) for k, v in byfam.items()}
out['by_object'] = {k: dict(v) for k, v in byobj.items()}; out['disagreements'] = mism; out['precision_bits_used'] = dict(precs)
out['unresolved_examples'] = [(r['fam'], r['row'], nm) for r in rows for nm, (s, p) in r['signs'].items() if s == 0][:20]
# zeta sign by order on D3a and D1 (set A and B)
zs = collections.defaultdict(collections.Counter)
for r in rows:
    if r['fam'] in ('D1', 'D3a'):
        zs[r['fam'] + '_order%d' % r['par']['m']][r['signs']['ZETA'][0]] += 1
        for nm in ('HEAT-0.10', 'HEAT-0.50', 'EA0.125', 'EA0.250', 'EIS0.20+3.00i', 'EIS0.10+5.00i', 'THW0.50', 'THW3.00'):
            zs[r['fam'] + '_%s_vs_zeta' % nm]['same' if r['signs'][nm][0] == r['signs']['ZETA'][0] else ('opp' if r['signs'][nm][0] == -r['signs']['ZETA'][0] else 'unres')] += 1
out['zeta_sign_by_order'] = {k: dict(v) for k, v in zs.items()}
# P2-one-signed by MY signs: DH / heat / TNR verdicts
pos = [n for n in rows[0]['signs'] if n == 'ZETA' or n.startswith('chi')]
one = [r for r in rows if all(r['signs'][n][0] != 0 for n in pos) and len({r['signs'][n][0] for n in pos}) == 1]
c = collections.Counter(); cf = collections.defaultdict(collections.Counter)
for r in one:
    s = r['signs']['ZETA'][0]
    for nm in r['signs']:
        if nm in pos: continue
        v = r['signs'][nm][0]
        key = 'opposite' if v == -s else ('same' if v == s else 'unresolved')
        c[nm + ':' + key] += 1; cf[r['fam']][nm + ':' + key] += 1
out['n_positives_implemented'] = len(pos)
out['P2_one_signed_by_referee_signs'] = len(one)
out['P2_one_signed_by_tag'] = dict(collections.Counter(r['tag'] + ':' + r['fam'] for r in one))
out['controls_on_P2_one_signed'] = dict(sorted(c.items()))
out['setB_stored_onesigned_confirmed'] = sum(1 for r in one if r['tag'] == 'B'), sum(1 for r in rows if r['tag'] == 'B')
# D1 set B: T-NR opposite as stored?
tn = collections.Counter()
for r in rows:
    if r['tag'] == 'B' and r['fam'] == 'D1':
        s = r['signs']['ZETA'][0]; st = r['stored']['ZETA']
        tn[('stored_opp' if r['stored']['TNR3_2.2'] == -st else 'stored_notopp') + '/' + ('mine_opp' if r['signs']['TNR3_2.2'][0] == -s else 'mine_notopp')] += 1
out['D1_setB_TNR'] = dict(tn)
# Lemma H on the sample: order-2 D3a minors and F1 lam>=1 p=0, F2 lam=1 p=0 on K3: heat vs zeta
lh = collections.Counter()
for r in rows:
    ok = (r['fam'] == 'D3a' and r['par'].get('m') == 2) or (r['fam'] == 'D3b-F1' and r['par']['p'] == 0 and r['par']['lam'] >= 1) or (r['fam'] == 'D3b-F2' and r['par']['p'] == 0 and r['par']['lam'] == 1)
    if ok:
        for h in ('HEAT-0.10', 'HEAT-0.50'):
            lh[r['fam'] + ':zeta%+d:heat%+d' % (r['signs']['ZETA'][0], r['signs'][h][0])] += 1
out['lemmaH_rows_in_sample'] = dict(lh)
out['max_task_seconds'] = max(r['sec'] for r in rows)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
for k, v in out.items():
    if k not in ('by_object',): print(k, v)
