"""writes params_<N>.txt for sweep.c: bridges, objects, extras (proper prime powers + T-NR extra at q0)."""
import sys, math, mpmath as mp
from lib import *
mp.mp.dps = 40
N = int(float(sys.argv[1])); out = sys.argv[2]
import os
if os.environ.get('OBJS'):
    keep = os.environ['OBJS'].split(','); OBJ[:] = [o for o in OBJ if o['name'] in keep]; assert OBJ[0]['name'] == 'zeta'
LIM = {'liouville': 1e9, 'randsign': 1e9, 'unimod3': 1e9, 'flip10': 1e10, 'Ea0.10': 1e9, 'Ea0.25': 1e9, 'TNR3_2.2zb': 1e9}
PT = {'zeta': (0, 0), 'L_chi-4': (1, 0), 'L_chi5': (2, 0), 'liouville': (3, 0), 'randsign': (4, 1), 'flip10': (5, 2), 'unimod3': (6, 3.0),
      'Ea0.05': (7, 0.05), 'Ea0.10': (7, 0.10), 'Ea0.25': (7, 0.25), 'TNR3_2.2': (0, 0), 'TNR3_2.01': (0, 0), 'TNR3_2.2zb': (0, 0)}
brs = []; brid = {}
def bid(spec):
    if spec not in brid:
        brid[spec] = len(brs)
        if spec[0] == 'zeta': b = bridge('zeta'); kind, par = 0, 0
        elif spec[0] == 'odd': b = bridge('odd', N=spec[1]); kind, par = 1, 0
        elif spec[0] == 'even': b = bridge('even', N=spec[1]); kind, par = 2, 0
        else: b = bridge('Ea', a=spec[1]); kind, par = 3, spec[1]
        brs.append((kind, par, b))
    return brid[spec]
kappa = -mp.euler + mp.nsum(lambda n: 0, [1, 1])
ps = primes_upto(2*10**6)
kappa = -mp.euler + mp.fsum(mp.log(int(p))/(mp.sqrt(int(p))*(int(p) - 1)) for p in ps)
# tail of sum_p log p/(sqrt p (p-1)) beyond 2e6: ~ int x^{-3/2} dx = 2/sqrt(X)
kappa += 2/mp.sqrt(2*10**6)
lines = []
objs = []
for o in OBJ:
    b = bid(o['br']); pt, par = PT[o['name']]
    shift = mp.log(o['tnr'][0]) if (o.get('own') and 'tnr' in o) else mp.mpf(0)
    rflag = 1 if o['br'][0] == 'zeta' and o['name'] not in ('liouville', 'randsign', 'unimod3') else 0
    cflag = 1 if o['name'] in ('zeta', 'flip10', 'TNR3_2.2', 'TNR3_2.01') else 0
    mflag = 1 if o['name'] in ('zeta', 'L_chi-4', 'L_chi5') else 0
    alias = 0 if 'tnr' in o else -1
    objs.append((o['name'], b, shift, pt, par, LIM.get(o['name'], 1e30), rflag, cflag, mflag, alias))
with open(out, 'w') as f:
    f.write('%d\n' % len(brs))
    for kind, par, b in brs:
        f.write('%d %.17g %s %s\n' % (kind, par, mp.nstr(b['A0'], 30), mp.nstr(b['A1'], 30)))
    f.write('%d %s\n' % (len(objs), mp.nstr(kappa, 30)))
    for nm, b, sh, pt, par, lim, rf, cf, mf, al in objs:
        f.write('%s %d %s %d %.17g %.17g %d %d %d %d\n' % (nm, b, mp.nstr(sh, 30), pt, par, lim, rf, cf, mf, al))
    ext = {}
    for q, p, k in prime_powers(N, kmin=2):
        ext[q] = [obj_weight(o, p, k) for o in OBJ]
    for o_i, o in enumerate(OBJ):
        if 'tnr' in o:
            q0, c = o['tnr']
            if q0 <= N:
                row = ext.setdefault(q0, [0.0]*len(OBJ)); row[o_i] += tnr_extra(q0, c, 1)
    f.write('%d\n' % len(ext))
    for q in sorted(ext):
        f.write('%d %s\n' % (q, ' '.join('%.20e' % x for x in ext[q])))
print('bridges', len(brs), 'objects', len(objs), 'extras', len(ext), 'kappa', mp.nstr(kappa, 20))
