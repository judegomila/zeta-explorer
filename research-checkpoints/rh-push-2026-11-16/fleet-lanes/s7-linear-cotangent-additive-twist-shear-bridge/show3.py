import json,sys,glob
for f in sorted(glob.glob(sys.argv[1] if len(sys.argv)>1 else 'out/t3_*.json')):
    d=json.load(open(f)); print(f, 'range',d['range'],'gpu',d['gpu'],'FE rel L2',['%.1e'%v for v in d['fe_rel_l2']],'mean|F|^2',['%.4f'%v for v in d['mean_abs2_over_T']])
    for r in d['rows']:
        if 'pred' not in r: continue
        print('  %d/%d th=%.2f'%(r['h'],r['k'],r['theta']),' | '.join('x=%.2f rem+ %.2e rem- %.2e remO %.2e (D_O %.3e)'%(p['x'],p['rem_plus'],p['rem_minus'],p['rem_O'],p['D_O']) for p in r['pred']))
