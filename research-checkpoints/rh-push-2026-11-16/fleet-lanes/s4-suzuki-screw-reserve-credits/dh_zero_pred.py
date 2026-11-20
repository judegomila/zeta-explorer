import json, math, numpy as np
from validate_zero import tail_mean
D = json.load(open('../s3-truncated-euler-strip/zeros_DH.json'))
on = np.array([float(x) for x in D['online']]).astype(complex)
offl = [(float(o[0]), float(o[1])) for o in D['offline']]
off = np.array([complex(t, -(b - 0.5)) for b, t in offl])
g = np.concatenate([on, off, off.conj()])
tm = tail_mean(2000.0, 5)
rs = np.arange(0.05, 30.0001, 0.002)
psi = np.array([2*np.sum(((1 - np.cos(g*r))/g**2).real) for r in rs]) + tm
psi_on = np.array([2*np.sum(((1 - np.cos(on*r))/on**2).real) for r in rs]) + tm
i = np.nonzero(psi < 0)[0]
print('reservoir 2 sum_on 1/gamma^2 + tail =', 2*np.sum(1/on.real**2) + tm, ' sup bound', 2*(2*np.sum(1/on.real**2) + tm))
print('first r with Psi_DH < 0 (zero side, zeros to 2000):', rs[i[0]] if len(i) else None, 'q =', math.exp(rs[i[0]]) if len(i) else None)
for r0 in (13.8, 16, 18, 20, 20.2, 21, 21.6, 22, 23, 24, 26):
    m = (rs <= r0); print('r <= %5.1f  min Psi_DH = %.5f at r = %.3f' % (r0, psi[m].min(), rs[m][psi[m].argmin()]))
# contribution of each off-line pair at the onset
r = rs[i[0]]
c = [(2*2*((1 - np.cos(z*r))/z**2).real, b, t) for z, (b, t) in zip(off, offl)]
c.sort(); print('largest negative pair contributions at onset:', [(round(x, 4), round(b, 4), round(t, 2)) for x, b, t in c[:5]])
json.dump(dict(rs=rs[::10].tolist(), psi=psi[::10].tolist(), psi_on=psi_on[::10].tolist(), onset=float(rs[i[0]]), reservoir=float(2*np.sum(1/on.real**2) + tm)), open('dh_zero_pred.json', 'w'))
