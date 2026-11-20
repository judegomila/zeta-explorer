import json, glob, collections
import du
from flint import ctx
O = du.build_objects()
for f in sorted(glob.glob('out/*Mt*_k3*.json')):
    d = json.load(open(f))
    recs = [r for r in d['recs'] if r['res'].get('best', {}).get('TH', 0) >= 20 or r['res']['hold'].get('TH') == -1]
    hist = collections.Counter(r['res'].get('best', {}).get('TH') for r in d['recs'] if r['res']['tiers'].get('TH') == 1)
    print(f, 'TH T-train records', sum(hist.values()), 'hold values', collections.Counter(r['res']['hold'].get('TH') for r in d['recs'] if r['res']['tiers'].get('TH') == 1), 'best>=20:', len(recs), 'top of best histogram', sorted(hist.items(), key=lambda x: -x[0])[:5])
    for r in recs[:6]:
        du.VALCACHE.clear()
        x = du.decide(d['fam'], r['node'], False, O, need=('TH',), lazy=False)
        print('   node', r['node'], 'search: hold', r['res']['hold'], 'best', r['res'].get('best'), '| redecided TH: tier', x['tiers']['TH'], 'hold', x['hold']['TH'], 'best', x.get('best', {}).get('TH'), 'prec', x['prec'])
