import time, sys, json
import du
from flint import ctx
O = du.build_objects()
for fam in ('TM5', 'TM6', 'DM5', 'DM6', 'TMt5', 'TMt6', 'DMt5', 'DMt6', 'T3', 'T6'):
    for pol in (False, True):
        kind, m, thr = du.fam_info(fam)
        n = 12 if kind in ('T3', 'T6') else (40 if not thr else 24)
        nodes = du.draw_nodes(fam, pol, n, dev=True)
        tot = {}
        t = time.time(); tl = []
        for i, nd in enumerate(nodes):
            du.VALCACHE.clear()
            t1 = time.time()
            if kind in ('T3', 'T6'):
                c, r = du.turan_node(fam, nd, pol, O)
            else:
                c, r = du.minor_node(fam, nd, pol, O, i < n // 2)
            tl.append(time.time() - t1)
            for k, v in c.items(): tot[k] = tot.get(k, 0) + v
        print(fam, 'pol' if pol else 'k3', 'mean s/node', round((time.time() - t) / n, 3), 'max', round(max(tl), 2), {k: v for k, v in sorted(tot.items()) if v}, flush=True)
