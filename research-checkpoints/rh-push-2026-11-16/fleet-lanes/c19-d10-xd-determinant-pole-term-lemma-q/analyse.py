import json, sys, collections
R = {}
for fn in sys.argv[1:]:
    for l in open(fn):
        r = json.loads(l); R[r['id']] = r
R = list(R.values()); print('records', len(R), 'errors', sum('error' in r for r in R))
for r in R:
    if 'error' in r: print('ERROR', r['id'], r['error'])
R = [r for r in R if 'error' not in r]
sym = [r for r in R if r['kind'] == 'sym']; tab = collections.defaultdict(lambda: [0, 0, 0, 0])
for r in sym:
    d = r['pred']['d']; t = tab[d]; t[0] += 1; t[1] += (r['neg'] == 0); t[2] += (r['rank'] == d*(d-1)//2); t[3] += (r['neg'] > 0)
print('symmetric: d -> [configs, neg=0, rank=C(d,2), neg>0]'); [print(' ', d, tab[d]) for d in sorted(tab)]
print(' by category:', dict(collections.Counter((r['cat'], r['neg'] == 0) for r in sym)))
print(' counterexamples:', [(r['id'], r['specs'], r['pos'], r['neg']) for r in sym if r['neg'] > 0])
print(' rank anomalies:', [(r['id'], r['cat'], r['pred']['d'], r['rank']) for r in sym if r['rank'] != r['pred']['d']*(r['pred']['d']-1)//2])
ns = [r for r in R if r['kind'] == 'nonsym']
print('non-symmetric, pole base:', len(ns), 'neg>0:', sum(r['neg'] > 0 for r in ns), 'neg == predicted deficit:', sum(r['neg'] == r['pred']['neg'] for r in ns), 'rank == predicted:', sum(r['rank'] == r['pred']['rank'] for r in ns))
print(' neg = 0 cases:', [(r['id'], r['specs'], r['pred']) for r in ns if r['neg'] == 0][:8])
print(' mismatches:', [(r['id'], r['specs'], r['pos'], r['neg'], r['pred']) for r in ns if r['neg'] != r['pred']['neg']][:8])
npole = [r for r in R if r['kind'] == 'nopole']
print('pole removed:', len(npole), 'neg=0:', sum(r['neg'] == 0 for r in npole), 'by base:', dict(collections.Counter((r['base'], r['neg'] == 0) for r in npole)))
print('max time', max(r['t'] for r in R))
