"""Combination 4 tables from t4_f.jsonl (+ t4_a.jsonl)."""
import json, math, sys, os, collections
R = collections.defaultdict(list)
for l in open('t4_all.jsonl'):
    r = json.loads(l); R[(r['obj'], r['Hmax'])].append(r)
md = []; out = {}; md2 = ['', '| object (ordinates below) | D_m = 2 sum over ordinates below 2^(m+1) of 1/gamma, per top octave m | onset depth of S < 1 divided by D_m |', '|---|---|---|']
md.append('| object (ordinates below) | octave sizes N_k, k = lowest..highest | block depth d_k (Lambda(V_k, d) = 1/2), as q_k = d_k 2^k / N_k per octave | highest top octave with S < 1 at d = 0.25 / 0.8 / 1.9 / 4.8 |')
md.append('|---|---|---|---|')
def cross(ds, vs, level):
    """first d (log-interpolated) where vs drops below level"""
    for i in range(1, len(ds)):
        if vs[i - 1] >= level > vs[i]:
            a, b = math.log(max(vs[i - 1], 1e-300)), math.log(max(vs[i], 1e-300)); w = (a - math.log(level)) / (a - b)
            return math.exp(math.log(ds[i - 1]) * (1 - w) + math.log(ds[i]) * w)
    return None
for key, recs in R.items():
    recs.sort(key=lambda r: r['d']); ds = [r['d'] for r in recs]; ms = recs[0]['octaves']; sizes = recs[0]['sizes']
    g1 = None
    q = {}; dk = {}
    for j, m in enumerate(ms):
        v = [r['rows'][j]['perp_top'] for r in recs]; c = cross(ds, v, 0.5); dk[m] = c
        q[m] = (c * 2.0 ** m / sizes[j]) if c else None
    # certificate: for prefix with top octave m, onset d*(m) = first d with S < 1
    on = {m: cross(ds, [r['rows'][j]['S'] for r in recs], 1.0) for j, m in enumerate(ms)}
    out['%s|%g' % key] = dict(octaves=ms, sizes=sizes, q=q, d_half=dk, onset_S=on)
    import t2
    rates = sorted(json.load(open('zeta_big.json'))) if key[0] == 'ZETA-big' else t2.ordinates(key[0])[0]
    rates = [g for g in rates if g < key[1]]
    D = {m: 2 * sum(1 / g for g in rates if g < 2.0 ** (m + 1)) for m in ms}
    out['%s|%g' % key]['delay'] = D; out['%s|%g' % key]['onset_over_delay'] = {m: (on[m] / D[m] if on[m] else None) for m in ms}
    md2.append('| %s (%g) | %s | %s |' % (key[0], key[1], ' '.join('%d:%.3f' % (m, D[m]) for m in reversed(ms)), ' '.join('%d:%s' % (m, '%.2f' % (on[m] / D[m]) if on[m] else '-') for m in reversed(ms))))
    cells = []
    for d in (0.25, 0.8, 1.9, 4.8):
        best = None
        for j, m in enumerate(ms):
            if on[m] is not None and on[m] <= d: best = max(best, m) if best is not None else m
        cells.append(str(best) if best is not None else 'none')
    md.append('| %s (%g) | %s | %s | %s |' % (key[0], key[1], ' '.join(str(s) for s in reversed(sizes)), ' '.join('%d:%s' % (m, '%.2f' % q[m] if q[m] else '-') for m in reversed(ms)), ' / '.join(cells)))
json.dump(out, open('an4.json', 'w')); md = md + md2; open('an4.md', 'w').write('\n'.join(md)); print('\n'.join(md))
if os.path.exists('t4_a.jsonl'):
    A = [json.loads(l) for l in open('t4_a.jsonl')]; worst = 0.0; n = 0
    F = [json.loads(l) for l in open('t4_all.jsonl')]
    for a in A:
        for f in F:
            if f['obj'] == a['obj'] and abs(f['d'] - a['d']) < 1e-9 * a['d']:
                fr = {r['top_octave']: r for r in f['rows']}
                for r in a['rows']:
                    if r['top_octave'] in fr and fr[r['top_octave']]['n_nodes'] == r['n_nodes']:
                        for k in ('Lambda', 'S'):
                            worst = max(worst, abs(fr[r['top_octave']][k] - r[k])); n += 1
    print('\nArb (512 bits) against float64 screen: %d values compared, largest absolute difference %.2e; largest Arb radius %.1e' % (n, worst, max(a['relrad'] for a in A)))
