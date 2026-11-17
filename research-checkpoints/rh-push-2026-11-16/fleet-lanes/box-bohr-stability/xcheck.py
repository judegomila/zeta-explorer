"""Agreement between the float64 GPU screen and the certified counts on identical windows."""
import json, collections
ex = []
for ln in open('results/exactAll.jsonl'):
    try: ex.append(json.loads(ln))
    except Exception: pass
gm = {}
for ln in open('results/big_matched.jsonl'):
    d = json.loads(ln); k = d['key'].split('|'); gm[(k[1], int(k[2]))] = d
n = agree = 0; bad = []
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'afe' and not t.get('phi') and abs(t['T2'] - t['T1'] - 50) > 1e-6 and 'n_tot' in r:
        g = gm.get((t['inp'], t['size']))
        if not g or abs(g['ta'] - t['T1']) > 1e-6: continue
        n += 1
        ok = (g['tot'] == r['n_tot']) and (g['on'] == r['n_real'] or r['verdict'] == 'UNRESOLVED')
        agree += ok
        if not ok: bad.append((t['inp'], t['size'], g['tot'], g['on'], r['n_tot'], r['n_real'], r['n_up']))
print('matched windows compared:', n, 'identical (total, on-line) counts:', agree, 'differences:', bad[:10])
# translates: GPU line2 k even vs certified line (k/12)
gt = {}
for ln in open('results/big_translate.jsonl'):
    d = json.loads(ln); gt[int(d['key'].split('|')[2])] = d
import math
n2 = a2 = 0; bad2 = []
for d in ex:
    t, r = d['task'], d['result']
    if t['kind'] == 'win' and t['scheme'] == 'afe' and t.get('tag') == 'line2' and 'n_tot' in r and t['size'] in gt:
        k = round(t['phi']['2'] / (2 * math.pi / 24))
        row = gt[t['size']]['line2'][k]
        n2 += 1; ok = (row[1] == r['n_tot'] and row[2] == r['n_real']); a2 += ok
        if not ok: bad2.append((t['size'], k, row, r['n_tot'], r['n_real']))
print('translate (line phi_2) windows compared:', n2, 'identical:', a2, bad2[:6])
