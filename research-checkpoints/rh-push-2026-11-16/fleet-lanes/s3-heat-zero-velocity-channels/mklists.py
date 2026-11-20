"""Zero lists per object: data/<name>.npz with on (ordinates of on-line zeros), offx, offg (off-line zeros 1/2 + x + i g, x > 0).
Usage: mklists.py H   (zeta list to 1.01 H; TNR, EA, HEAT, DH lists from it and from tables read as data)"""
import sys, os, json, math, numpy as np
from flint import acb, ctx
H = float(sys.argv[1]); D = 'data'; os.makedirs(D, exist_ok=True)
ctx.prec = 80
on = []; n = 1
while True:
    zs = acb.zeta_zeros(n, 2000); v = [float(z.imag.mid()) for z in zs]; on += v; n += 2000
    if v[-1] > 1.01 * H + 5: break
zeta = np.array(on); zeta = zeta[zeta < 1.01 * H + 5]
np.savez(D + '/ZETA.npz', on=zeta, offx=np.zeros(0), offg=np.zeros(0))
th = math.acosh(1.1); x = th / math.log(3); k = np.arange(0, int((1.01 * H + 5) * math.log(3) / (2 * math.pi)) + 2)
g = (2 * k + 1) * math.pi / math.log(3); g = g[g < 1.01 * H + 5]
np.savez(D + '/TNR.npz', on=zeta, offx=np.full(len(g), x), offg=g)
np.savez(D + '/EA_0.25.npz', on=np.zeros(0), offx=np.full(len(zeta), 0.25), offg=zeta)
print('ZETA %d zeros below %.1f ; TNR off-line %d (x = %.6f) ; EA %d' % (len(zeta), zeta[-1], len(g), x, len(zeta)))
for name, src in (('HEAT_-0.5', 'zeros_HEAT--0.5.json'),):
    p = os.environ.get('RH_BATTERY', '../c12-control-battery-harness/tables/') + src
    if os.path.exists(p):
        d = json.load(open(p)); o = np.array(sorted(float(v) for v in d['online']))
        off = np.array(sorted([[float(a), float(b)] for a, b, *_ in d['offline']], key=lambda r: r[1]))
        np.savez(D + '/%s.npz' % name, on=o, offx=off[:, 0], offg=off[:, 1])
        print(name, len(o), 'on-line', len(off), 'off-line pairs ; first off-line', off[0])
if os.path.exists(D + '/dh_seeds_1e5.npz'):
    s = np.load(D + '/dh_seeds_1e5.npz'); np.savez(D + '/DH.npz', on=s['on'], offx=s['x'], offg=s['g'])
    print('DH', len(s['on']), 'on-line', len(s['x']), 'off-line pairs below', s['on'][-1])
for q in (3, 4):
    if os.path.exists(D + '/L%d_on.npy' % q):
        o = np.load(D + '/L%d_on.npy' % q); np.savez(D + '/L%d.npz' % q, on=o, offx=np.zeros(0), offg=np.zeros(0)); print('L%d' % q, len(o))
