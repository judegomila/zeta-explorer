"""post-pass: every record left 'undecided' by the search is decided again with the corrected breakpoint precision
(du.decide forms V1/V2 at the highest precision in use; the search runs formed them at 128 bits, which is an outward
rounding: it could only add 'undecided', never a wrong status)."""
import sys, json, glob, os, time
import du
out = sys.argv[1]
O = du.build_objects()
res = {}
for f in sorted(glob.glob(os.path.join(out, '*.json'))):
    if os.path.basename(f) in ('summary.json', 'resolved.json'):
        continue
    d = json.load(open(f))
    fam, pol = d['fam'], bool(d['pol'])
    und = [r for r in d['recs'] if r['res']['status'] == 'undecided']
    if not und:
        continue
    lst = []
    t = time.time()
    for r in und:
        du.VALCACHE.clear()
        if du.fam_info(fam)[0] in ('T3', 'T6'):
            need = [k for k in du.TIERS if (k == 'full' and r['float']['t'][k] != 0) or r['float']['h'][k] != 0]
            x = du.decide(fam, r['node'], pol, O, need=tuple(need), lazy=False)
        elif du.fam_info(fam)[2]:
            x = du.decide(fam, r['node'], pol, O, need=('full',), lazy=True)
        else:
            x = du.decide(fam, r['node'], pol, O, loco=True)
        lst.append(dict(node=r['node'], res=x))
    res[os.path.basename(f)] = lst
    cnt = {}
    for x in lst:
        cnt[x['res']['status']] = cnt.get(x['res']['status'], 0) + 1
    print(os.path.basename(f), 'undecided records', len(und), '->', cnt, 'hold', sum(1 for x in lst if x['res']['hold'].get('full') == 1),
          'prec', sorted(set(x['res']['prec'] for x in lst)), 'sec', round(time.time() - t), flush=True)
json.dump(res, open(os.path.join(out, 'resolved.json'), 'w'))
