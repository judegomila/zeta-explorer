# merge a complete base run of mob (segments 0..S0, server) with range runs (segments S0.., relative sums) into one .cp/.seg pair.
# usage: mob_merge.py base_prefix out_prefix S0 chunk_prefix:SLO:SHI ...
import sys, numpy as np
SEG = 1 << 24; NI = 5; dt = np.dtype([('base', '<i8'), ('mn', '<i4'), ('mx', '<i4')])
base, out, S0 = sys.argv[1], sys.argv[2], int(sys.argv[3])
seg = np.fromfile(base + '.seg', dt).reshape(-1, NI); cp = np.loadtxt(base + '.cp')
off = seg['base'][S0].copy(); segs = [seg[:S0]]; cps = [cp[cp[:, 0] < S0*SEG]]
for spec in sys.argv[4:]:
    pref, slo, shi = spec.split(':'); slo = int(slo); shi = int(shi)
    s = np.fromfile(pref + '.seg', dt).reshape(-1, NI).copy(); c = np.loadtxt(pref + '.cp')
    assert len(s) == shi - slo, (len(s), shi - slo)
    s['base'] += off[None, :]; s['base'][:, 4] = 0; segs.append(s)
    c2 = c.copy(); c2[:, 1:5] += off[None, :4]; c2[:, 5:] = np.nan; cps.append(c2)
    b = np.flatnonzero(c[:, 0] == shi*SEG - 1)
    if len(b): off = off.copy(); off[:4] += c[b[0], 1:5].astype(np.int64)
    print(pref, 'segments', slo, shi, 'offset after chunk (M, Mchi4, Mchi3, Q):', off[:4].tolist())
np.concatenate(segs).tofile(out + '.seg')
allc = np.concatenate(cps)
with open(out + '.cp', 'w') as f:
    for r in allc: f.write('%d %d %d %d %d %s %s\n' % (r[0], r[1], r[2], r[3], r[4], 'nan' if np.isnan(r[5]) else '%d' % r[5], ' '.join('%.17g' % v for v in r[6:])))
for x0, ref in ((1e10, -33722), (1e11, -87856), (1e12, 62366)):
    i = np.flatnonzero(allc[:, 0] == x0)
    if len(i): print('M(%g) = %d (published %d)' % (x0, allc[i[0], 1], ref))
