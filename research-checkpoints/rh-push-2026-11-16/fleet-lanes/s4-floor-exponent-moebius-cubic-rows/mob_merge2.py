# merge: base run mobB (complete, X = 1e11, rich to 1e10) + rich range runs C (segments 596..5961, X = X2 = 1e11, optional)
#        + lean range runs d (segments 5960..59605, X = 1e12) into one .cp/.seg pair (59605 segments).
# usage: mob_merge2.py out_prefix [withC]
import sys, numpy as np
SEG = 1 << 24; NI = 5; dt = np.dtype([('base', '<i8'), ('mn', '<i4'), ('mx', '<i4')])
out = sys.argv[1]; withC = len(sys.argv) > 2
def ld(p): return np.fromfile(p + '.seg', dt).reshape(-1, NI).copy(), np.loadtxt(p + '.cp')
segB, cpB = ld('mobB'); segs = []; cps = []
if withC:
    segs.append(segB[:596]); cps.append(cpB[cpB[:, 0] < 596*SEG])
    offi = segB['base'][596].astype(np.int64).copy(); offf = None
    for pref, slo, shi in (('mobC1', 596, 2384), ('mobC2', 2384, 4172), ('mobC3', 4172, 5961)):
        s, c = ld(pref); assert len(s) == shi - slo
        if offf is None:
            i = np.flatnonzero(c[:, 0] == 1e10)[0]; j = np.flatnonzero(cpB[:, 0] == 1e10)[0]; offf = cpB[j, 6:] - c[i, 6:]
            assert all(int(cpB[j, 1 + k]) == int(c[i, 1 + k]) + offi[k] for k in range(NI)), 'integer columns at 1e10 disagree'
        s['base'] += offi[None, :]; c2 = c.copy(); c2[:, 1:6] += offi[None, :]; c2[:, 6:] += offf[None, :]
        last = pref == 'mobC3'
        segs.append(s[:-1] if last else s); cps.append(c2[c2[:, 0] < 5960*SEG] if last else c2)
        if last: off4 = (s['base'][5960 - slo]).astype(np.int64)[:4].copy(); x2 = 5960*SEG - 1
        else:
            b = np.flatnonzero(c[:, 0] == shi*SEG - 1)[0]; offi = offi + c[b, 1:6].astype(np.int64); offf = offf + c[b, 6:]
        print(pref, 'merged; integer offsets now', offi.tolist())
else:
    segs.append(segB[:5960]); cps.append(cpB[cpB[:, 0] < 5960*SEG]); off4 = segB['base'][5960].astype(np.int64)[:4].copy(); x2 = 1e10
B = [min(5960 + 5961*k, 59605) for k in range(10)]
for k in range(9):
    pref = 'mobL_d%d' % (k + 1); slo, shi = B[k], B[k + 1]; s, c = ld(pref); assert len(s) == shi - slo, (pref, len(s))
    s['base'][:, :4] += off4[None, :]; s['base'][:, 4] = 0; segs.append(s)
    c2 = c.copy(); c2[:, 1:5] += off4[None, :]; c2[:, 5:] = np.nan; cps.append(c2)
    b = np.flatnonzero(c[:, 0] == shi*SEG - 1)
    if len(b): off4 = off4 + c[b[0], 1:5].astype(np.int64)
allseg = np.concatenate(segs); allc = np.concatenate(cps); assert len(allseg) == 59605, len(allseg)
allseg.tofile(out + '.seg')
with open(out + '.cp', 'w') as f:
    for r in allc: f.write('%d %d %d %d %d %s %s\n' % (r[0], r[1], r[2], r[3], r[4], 'nan' if np.isnan(r[5]) else '%d' % r[5], ' '.join('%.17g' % v for v in r[6:])))
for x0, ref in ((1e10, -33722), (1e11, -87856), (1e12, 62366)):
    i = np.flatnonzero(allc[:, 0] == x0)
    if len(i): print('M(%g) = %d (published %d)' % (x0, allc[i[0], 1], ref))
print('rich columns valid to x = %d ; checkpoints %d ; segments %d' % (x2, len(allc), len(allseg)))
