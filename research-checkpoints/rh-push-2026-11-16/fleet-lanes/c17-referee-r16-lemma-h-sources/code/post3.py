import json, collections
d=json.load(open('dn_out_feas500b.json')); rows=d['rows']
fl=set(tuple(x) for x in json.load(open('code/flagged86.json')))
s1=json.load(open('dn_out_feas500.json'))['rows']; samp=set((r['fam'],r['node']) for r in s1)
mine=set((r['fam'],r['node']) for r in rows if r.get('secondary',{}).get('any'))
print('rows',len(rows),'sample',len(samp),'flagged by lane',len(fl),'flagged here',len(mine),'equal sets',mine==fl, 'sample nodes flagged here', len(mine&samp), 'of which lane-flagged', len(mine&samp&fl))
print('status', collections.Counter(r['res'] for r in rows), 'nb_train', collections.Counter(r['nb_train'] for r in rows), 'nleft', collections.Counter(r['nleft'] for r in rows))
S=[r for r in rows if (r['fam'],r['node']) in samp]
print('sample: primary full', sum(1 for r in S if r['primary']['full']), 'exit', collections.Counter((r['fam'],r['primary']['exit']) for r in S))
print('sample: secondary best_cheap', sorted(collections.Counter(r['secondary']['best_cheap'] for r in S).items()))
print('sample: heat_stage reached', sum(1 for r in S if r['secondary']['heat_stage']), 'best_all', collections.Counter(r['secondary']['best_all'] for r in S if r['secondary']['heat_stage']))
F=[r for r in rows if (r['fam'],r['node']) in fl]
print('flagged 86: status', collections.Counter(r['res'] for r in F), 'secondary any', sum(1 for r in F if r['secondary']['any']), 'primary full', sum(1 for r in F if r['primary']['full']))
ref=json.load(open('../c16-dn-canonical-tier-ball-conversion/out/feas.json')); R={(r['fam'],r['node']):r for r in ref['rows']}
agree=sum(1 for r in S if bool(R[(r['fam'],r['node'])]['secondary']['any'])==bool(r['secondary']['any']) and bool(R[(r['fam'],r['node'])]['primary']['full'])==bool(r['primary']['full']))
print('sample: hold-out booleans equal to lane', agree, 'of', len(S))
ex=collections.Counter((R[(r['fam'],r['node'])]['primary']['exit'], r['primary']['exit']) for r in S); print('primary exit (lane, here)', ex)
bc=collections.Counter((R[(r['fam'],r['node'])]['secondary']['best_cheap'] - r['secondary']['best_cheap']) for r in S); print('best_cheap lane minus here', sorted(bc.items()))
w=[abs(r['ints'][0][2]-r['ints'][0][1])/max(abs(r['ints'][0][1]),abs(r['ints'][0][2])) for r in F]; print('flagged: relative width of ball interval max', max(w))
