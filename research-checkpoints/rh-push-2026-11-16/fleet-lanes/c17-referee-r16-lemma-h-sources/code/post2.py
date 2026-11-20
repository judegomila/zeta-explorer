import json, collections
d=json.load(open('dn_out_feas500.json')); rows=d['rows']
ref=json.load(open('../c16-dn-canonical-tier-ball-conversion/out/feas.json'))
R={(r['fam'],r['node']):r for r in ref['rows']}
diffs=[]; rel=collections.Counter(); ov=0
for r in rows:
    q=R[(r['fam'],r['node'])]
    (s,lo,hi),(s2,lo2,hi2)=r['ints'][0],q['ints'][0]
    w=abs(hi2-lo2)
    dl=abs(lo-lo2)/max(abs(lo2),1e-300); dh=abs(hi-hi2)/max(abs(hi2),1e-300)
    m=max(dl,dh); diffs.append((m,r['fam'],r['node'],r['u'],r['h'],lo,hi,lo2,hi2))
    rel['<1e-12' if m<1e-12 else '<1e-9' if m<1e-9 else '<1e-6' if m<1e-6 else '<1e-3' if m<1e-3 else '>=1e-3']+=1
    a,b=sorted((lo,hi)); c,e=sorted((lo2,hi2)); ov+= (max(a,c)<min(b,e))
print(rel, 'overlapping', ov, 'of', len(rows))
diffs.sort(reverse=True)
for x in diffs[:6]: print(x)
print(collections.Counter(r['fam'] for m,*_ , in [(0,)] ) if 0 else '')
big=[x for x in diffs if x[0]>=1e-6]; print(len(big), collections.Counter(x[1] for x in big))
