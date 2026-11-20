# summarise the aggregated server output (main / ext / controls) into tables. Usage: summarise.py <agg.json> [...]
import json, sys, collections
def load(fn): return json.load(open(fn))
def table(d, kinds, by):
    agg = collections.OrderedDict()
    for c in d['cells']:
        if c['kind'] not in kinds: continue
        k = tuple(c[x] if x != 'T' else tuple(c['T']) for x in by)
        v = agg.setdefault(k, dict(count=0, pos=0, neg=0, und=0, minrel=0.0, maxprec=0))
        v['count'] += c['count']; v['pos'] += c['pos']; v['neg'] += c['neg']; v['und'] += c['undecided']
        v['minrel'] = min(v['minrel'], c['min_log10_rel_pivot']); v['maxprec'] = max(v['maxprec'], c['max_prec'])
    return agg
out = {}
for fn in sys.argv[1:]:
    d = load(fn)
    print('==', fn, 'plan', d['plan'], 'tasks', d['tasks'], 'done', d['done'], 'sec', d['sec'], d['summary'])
    kinds = sorted(set(c['kind'] for c in d['cells']))
    o = out[fn] = dict(plan=d['plan'], tasks=d['tasks'], done=d['done'], sec=d['sec'], summary=d['summary'], tables={})
    for by in (['kind', 'n'], ['kind', 'family'], ['kind', 'T']):
        t = table(d, kinds, by)
        o['tables']['/'.join(by)] = [dict(key=list(map(str, k)), **v) for k, v in t.items()]
        print(' by', by)
        for k, v in sorted(t.items(), key=lambda kv: tuple(map(str, kv[0]))):
            print('   %-40s count %8d pos %8d neg %6d undecided %5d  smallest pivot ratio 1e%.0f  max prec %d' % (' '.join(map(str, k)), v['count'], v['pos'], v['neg'], v['und'], v['minrel'], v['maxprec']))
    if d['plan'] != 'main':
        t = table(d, [k for k in kinds if k != 'sym'], ['kind', 'cfg'])
        o['tables']['kind/cfg'] = [dict(key=list(map(str, k)), **v) for k, v in t.items()]
        print(' by cfg (controls)')
        for k, v in t.items():
            print('   %-40s count %6d pos %6d neg %6d undecided %5d' % (' '.join(map(str, k)), v['count'], v['pos'], v['neg'], v['und']))
        # controls: smallest order showing a negative
        first = {}
        for c in d['cells']:
            if c['neg'] and c['kind'] != 'sym': first[c['cfg']] = min(first.get(c['cfg'], 10**9), c['n'])
        o['smallest_order_with_negative'] = first; print(' smallest order with a negative:', first)
    else:
        t = table(d, ['sym'], ['cfg'])
        worst = sorted(t.items(), key=lambda kv: kv[1]['minrel'])[:5]
        o['configs'] = len(t); o['any_neg_cfg'] = [k[0] for k, v in t.items() if v['neg']]; o['any_und_cfg'] = [k[0] for k, v in t.items() if v['und']]
        print(' configs', len(t), 'with a negative:', o['any_neg_cfg'], 'with undecided:', o['any_und_cfg'][:10])
json.dump(out, open('main_summary.json', 'w'), indent=1)
