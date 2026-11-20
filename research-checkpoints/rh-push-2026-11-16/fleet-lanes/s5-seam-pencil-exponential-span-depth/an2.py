"""Combination 2 tables from t2_zeros.jsonl / t2_logpp.jsonl."""
import json, sys, collections
for fn in ('t2_zeros.jsonl', 't2_logpp.jsonl'):
    D = collections.OrderedDict(); allok = True; n = 0; skipped = []
    try: L = [json.loads(l) for l in open(fn)]
    except FileNotFoundError: continue
    for r in L:
        if r.get('skipped'): skipped.append((r['spec'], r['N'])); continue
        D[r['spec']] = r
        for row in r['rows']: allok &= row['ok']; n += 1
    print('\n##', fn, ': %d rows, bracket floor(Rx) <= exact <= confluent(x) <= cap holds in all: %s; skipped (N < 2 or N > max): %s\n' % (n, allok, skipped))
    objs = []; 
    for s in D:
        o = s.split(':')[0]
        if o not in objs: objs.append(o)
    ms = sorted({D[s]['m'] for s in D})
    for kap in (1.0, 2.0, 3.0):
        print('\nposition (log scale; 0 = floor at Rx, 1 = min(cap, 1)) at x = %g N; cell = N(doubled) R pos / pos_conf\n' % kap)
        print('| object | ' + ' | '.join('m = %d' % m for m in ms) + ' |'); print('|---|' + '---|' * len(ms))
        for o in objs:
            cells = []
            for m in ms:
                r = D.get('%s:%d' % (o, m))
                if not r: cells.append('-'); continue
                row = [x for x in r['rows'] if x['kappa'] == kap][0]
                cells.append('%d(%d) %.2f %.3f / %s' % (r['N'], r['doubled'], r['R'], row['pos'], '%.3f' % row['pos_conf'] if row['pos_conf'] is not None else '-'))
            print('| %s | ' % o + ' | '.join(cells) + ' |')
