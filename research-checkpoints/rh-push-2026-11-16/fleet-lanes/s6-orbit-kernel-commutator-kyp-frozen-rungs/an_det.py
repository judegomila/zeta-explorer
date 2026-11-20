import json, sys, collections
rows=[json.loads(l) for l in open('out_server/zr_detect.jsonl')]
print('--- ZR premise scan (max log|Theta| over random nodes in Re z > 0)')
for r in rows:
    if r['mode']=='zr':
        print('%-8s a=%-5g y in [%g, %g] pts %d  max log|Theta| = %+.3e at (x=%g, y=%.3f)' % (r['key'],r['a'],r['window'][0],r['window'][1],r['points'],r['max_log_abs_theta'],r['argmax'][0],r['argmax'][1]))
print('--- detection modulus')
det=[r for r in rows if r['mode']=='detect']
for r in sorted(det,key=lambda r:(r.get('label',''),r.get('delta',0)*-1,r.get('g',0),r.get('x0',0))):
    if 'error' in r: print('ERR',r); continue
    hs=r['h_star']
    print('%-10s %-34s a=%-7g x0=%-7g g=%-9g delta=%-6g h*=%-10s h*dens=%-7s N*/N=%-7s modulus-witness h=%s' % (r['label'],r['key'],r['a'],r['x0'],r['g'],r['delta'],
          ('%.4g'%hs) if hs else None, ('%.3f'%r['h_star_times_density']) if hs else None, ('%.3f'%r['Nstar_over_N']) if r['Nstar_over_N'] else None, ('%.3g'%r['h_modulus_witness']) if r['h_modulus_witness'] else None))
