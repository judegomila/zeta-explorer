# windows for the verdict step of Part 2, from the screen: the 8 lowest block minima of DEL b=0.9 and the 4 lowest of zeta
import json, sys
d = json.load(open(sys.argv[1])); W = []
for nm, n in (('DEL b=0.9', 8), ('zeta', 4)):
    for c in d['top'][nm][:n]:
        W.append(dict(family=nm, t='%.2f' % float(c['t']), screen_lam=c['lam'], note='screen minimum of block t0 = %s (P frozen at %d in the screen)' % (c['block_t0'], c['P_block'])))
json.dump(W, open(sys.argv[2], 'w'), indent=1); print(json.dumps(W, indent=0))
