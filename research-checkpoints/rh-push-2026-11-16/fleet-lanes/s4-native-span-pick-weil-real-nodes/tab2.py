import json,sys
rows=[json.loads(l) for l in open('server/c2.jsonl')]
for r in rows:
    if r['kind']=='box':
        if 'error' in r: print('BOX',r['family'],r['n'],'ERROR'); continue
        rr=r['rows']
        print('BOX %-14s n=%-3d zneg=%d minW/c=%.3e | i=0: [%s, %s] i=1: [%s, %s] i=2: [%s, %s] (t/Z) cert=%s' % (r['family'],r['n'],r['zeta_negatives'],r['min_width_over_c'],
           *['%.3e'%x if x is not None else 'None' for i in range(3) for x in (rr[i]['tminus_over_Z'],rr[i]['tplus_over_Z'])], all(x['certified'] for x in rr)))
    else:
        th=r['ray_theta_star']
        print('   %-12s out=%-14s maxratio=%.2e hyb_neg=%d own_neg=%d theta*=%s und=%s/%s' % (r['code'],str(r['coords_outside_box'][:4])+('+' if len(r['coords_outside_box'])>4 else ''),r['max_ratio'],r['hybrid_negatives'],r['own_negatives'],th if isinstance(th,str) else '%.3e'%th, r['hybrid_undecided'],r['own_undecided']))
