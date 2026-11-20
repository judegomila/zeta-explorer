"""leave-one-class-out recount of a thresholded minor family on its first 1,000 nodes with the corrected breakpoint
precision; counts per tier: T-train, hold-out, not decided (two-class tiers refined to 1,024 bits only)."""
import sys, json, time, collections
import du
fam, pol = sys.argv[1], bool(int(sys.argv[2]))
O = du.build_objects()
c = collections.Counter()
t = time.time()
hold = []
for nd in du.draw_nodes(fam, pol, 1000):
    du.VALCACHE.clear()
    r = du.decide(fam, nd, pol, O, need=('full',), lazy=False, soft=('TE', 'TH', 'EH'))
    c['n'] += 1
    c['status_' + r['status']] += 1
    for k in du.TIERS:
        c['tier_%s_%d' % (k, r['tiers'][k])] += 1
        c['hold_%s_%d' % (k, r['hold'][k])] += 1
        if r['hold'][k] == 1:
            hold.append((nd, k))
json.dump(dict(fam=fam, pol=pol, cnt=dict(c), hold=hold, sec=time.time() - t), open('recount_%s_%s.json' % (fam, 'pol' if pol else 'k3'), 'w'))
print(fam, pol, dict(sorted(c.items())), hold, round(time.time() - t))
