import json, collections, sys
f=lambda s: float(s.split('[')[1].split(' ')[0])
for fn in sys.argv[1:]:
    rows=[json.loads(l) for l in open(fn)]
    by=collections.defaultdict(list)
    for r in rows: by[(r['T'],r['N'],r['kind'],r['delta'])].append(r)
    for key in sorted(by):
        rs=sorted([r for r in by[key] if 'ratio_opt' in r], key=lambda r:r['k'])
        if not rs: print(fn, key, "errors only", len(by[key])); continue
        ro=[f(r['ratio_opt']) for r in rs]
        cr=[f(r['G_opt'])/f(r['G_opt_TgeN']) for r in rs]
        print(fn, key, len(rs), "min %.6f max %.6f"%(min(ro),max(ro)), "exceed", sum(r['exceeds_certain'] for r in rs), "below", sum(r['below_certain'] for r in rs), "argmax k", rs[ro.index(max(ro))]['k'], "T<N/T>=N: %.5f..%.5f"%(min(cr),max(cr)), "maxrad %.1e"%max(r['rad_rel'] for r in rs), "err", sum('error' in r for r in by[key]))
        if key[2] in 'ZF':
            sel=(1,2,5,12,25,50,100,150,200,250,300)
            print("    by k:", " ".join("%d:%.5f"%(r['k'],f(r['ratio_opt'])) for r in rs if r['k'] in sel))
            print("    T>=N ratio by k:", " ".join("%d:%.5f"%(r['k'],f(r['ratio_TgeN'])) for r in rs if r['k'] in sel))
