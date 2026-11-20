import time, sys, json
import du
from flint import ctx, arb
O = du.build_objects()
ob = du.NodeEval.bump
LOG = []
def bump(self, names):
    names = list(names)
    LOG.append((sorted(names), max(self.level.get(n, 0) for n in names)))
    return ob(self, names)
du.NodeEval.bump = bump
nodes = du.draw_nodes('T3', False, 1500)
found = 0
t0 = time.time()
for nd in nodes:
    du.VALCACHE.clear(); LOG.clear()
    c, recs = du.turan_node('T3', nd, False, O)
    if c['b_undecided']:
        found += 1
        for r in recs:
            if r['res']['status'] == 'undecided':
                print('UNDECIDED', json.dumps(r['node']), r['float'], flush=True)
        print('   refine log (names, level):', LOG[:3], '...', LOG[-1], len(LOG), flush=True)
        if found >= 3: break
print('scanned to id', nd['id'], 'sec', time.time() - t0)
