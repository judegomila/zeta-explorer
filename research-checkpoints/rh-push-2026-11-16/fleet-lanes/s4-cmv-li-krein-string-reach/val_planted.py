"""validation of the finite-rank detection formula against Levinson on explicitly modified moments (a = 20)."""
import json, sys
from flint import arb, acb, ctx
import core
ctx.prec = 2500
a = arb(20); N = 140
c = [x.mid() for x in core.moments('ZETA', a, N)]
res = {}
for cf in json.load(open('pl_test.json')):
    c2 = list(c)
    for kind, d, g in cf['items']:
        if kind == 'add':
            m = core.zero_moment(arb(d), arb(g), a, N); m2 = core.zero_moment(-arb(d), arb(g), a, N)
            c2 = [x + y + z for x, y, z in zip(c2, m, m2)]
        else:
            m = core.zero_moment(arb(0), arb(g), a, N)
            c2 = [x - y for x, y in zip(c2, m)]
    r = core.levinson(c2)
    n, k, E = r[-1]
    res[cf['label']] = (n + 1) if not (E > 0) else None
    print(cf['label'], 'direct: first indefinite size', res[cf['label']], flush=True)
json.dump(res, open('val_planted_direct.json', 'w'))
