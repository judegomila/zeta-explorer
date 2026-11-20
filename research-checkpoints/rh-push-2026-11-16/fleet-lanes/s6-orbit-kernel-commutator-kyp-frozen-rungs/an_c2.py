import json, sys
rows=[json.loads(l) for l in open('out_server/c2.jsonl')]
seen=set()
for r in rows:
    if r['mode']=='repro':
        print('repro', {k:{kk:('%.6g'%vv) for kk,vv in v.items()} for k,v in r['rows'].items()}); continue
    k=(r['key'],r['a'],r['nodes'],r['n'],r['prec'])
    if k in seen: continue
    seen.add(k)
    print('%-16s a=%-5g %-36s n=%-5d range [%.3f, %.2f]  ||R||/||D||=%.9f  1-ratio=%.3e  trK/trD=%.3e  K11/d0=%.3e  log10(Knn/d0)=%.1f  Kdiag>0:%s' % (r['key'],r['a'],r['nodes'],r['n'],r['node_range'][0],r['node_range'][1],r['ratio_R_over_D'],r['one_minus_ratio'],r['trK_over_trD'],r['K11_over_d0'],r['Knn_over_d0_log10'],r['min_Kdiag_sign']>0))
