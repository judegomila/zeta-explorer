import json, sys, collections
rows=[json.loads(l) for fn in sys.argv[1:] for l in open(fn)]
seen=set()
tab=collections.defaultdict(list)
for r in rows:
    if 'error' in r: print('ERR',r['key'],r['a'],r['r'],r['error'][:80]); continue
    k=(r['label'],r['key'],r['a'],r['r'])
    if k in seen: continue
    seen.add(k)
    tab[(r['label'],r['key'],r['a'])].append(r)
for k in sorted(tab):
    print('==',k)
    for r in sorted(tab[k],key=lambda r:r['r']):
        st=r['stable_in_window_im_min_med_max']
        print('   r=%-4d poles in window %-3d unstable(all/in window) %d/%d  stable-in-window within 1%% of a: %-3d  Im(min,med,max)=%s  fit err %.1e  %.0fs' % (r['r'],r['n_in_window'],r['n_unstable'],r['n_unstable_in_window'],r['n_stable_in_window_within_1pct_of_a'],[round(x,4) for x in st] if st else None,r['fit_error_midpoints'],r['seconds']))
        if r['key'].startswith('blaschke'): print('    true',r['true_poles_y']); print('    found',[(round(a,6),round(b,6)) for a,b in r['found']])
