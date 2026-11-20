"""analysis of c2_shift outputs: sign of B_a, of Re F'/F, of rho; negative points inside/outside the disks of the zero-packet identity.
usage: c2_an.py <dir> ; writes <dir>/c2_summary.json"""
import sys, json, glob, os, math, numpy as np
d = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
dh = json.load(open(os.path.join(here, 'dh_zeros.json')))
zz = json.load(open(os.path.join(here, '..', 'c12-control-battery-harness', 'tables', 'zeros_ZETA.json')))
zeta_g = [float(v) for v in zz['gamma']]
ht = json.load(open(os.path.join(here, '..', 'c12-control-battery-harness', 'tables', 'zeros_HEAT--0.5.json')))
def offline(code):
    """list of (delta, gamma) of zeros with Re w = delta > 0 (pairs +-delta + i gamma)"""
    if code == 'DH': return [(float(b) - 0.5, float(g)) for b, g, _ in dh['offline']]
    if code.startswith('EA-'):
        n, m = code[3:].split('/'); return [(int(n) / int(m), g) for g in zeta_g]
    if code == 'TNR':
        de = math.acosh(1.1) / math.log(3); return [(de, (2 * k + 1) * math.pi / math.log(3)) for k in range(-1, 200)]
    if code.startswith('HEAT'): return [(float(b), float(g)) for b, g, *_ in ht['offline']]
    if code.startswith('PL:'):
        _, b, de, g = code.split(':'); return [(float(de), float(g))]
    return []
out = []
for f in sorted(glob.glob(os.path.join(d, 'c2_*.npz'))):
    z = np.load(f); code = str(z['code']); t = z['t']; x = z['x']; A = z['a']; LD = z['LD']; LR = z['LR']
    off = offline(code)
    rec = dict(file=os.path.basename(f), code=code, t0=float(t[0]), t1=float(t[-1]), nt=len(t), nx=len(x), max_ball_radius=float(z['rad'].max()),
               neg_LD=int((LD <= 0).sum()), min_LD=float(LD.min()), per_a=[])
    # half-disks of Re F'/F: |w - i gamma| < delta
    def indisk(rad_of):
        m = np.zeros(LD.shape, bool)
        for de, g in off:
            r = rad_of(de)
            if r <= 0 or g < t[0] - 1 or g > t[-1] + 1: continue
            j0 = np.searchsorted(t, g - r); j1 = np.searchsorted(t, g + r)
            if j1 > j0: m[j0:j1] |= (x[None, :] ** 2 + (t[j0:j1, None] - g) ** 2) < r * r
        return m
    mLD = indisk(lambda de: de)
    rec['neg_LD_outside_disks'] = int(((LD <= 0) & ~mLD).sum()); rec['points_in_LD_disks'] = int(mLD.sum())
    for k, a in enumerate(A):
        B = np.tanh(LR[:, :, k]) / (2 * a)
        with np.errstate(divide='ignore', invalid='ignore'): rho = B / LD
        m = indisk(lambda de: math.sqrt(de * de - a * a) if de > a else 0.0)
        neg = B <= 0
        i = np.unravel_index(np.nanargmin(rho), rho.shape); ib = np.unravel_index(np.argmin(B), B.shape)
        # margin of the weakest positive point against the ball radius
        rec['per_a'].append(dict(a=float(a), neg_B=int(neg.sum()), neg_B_outside_disks=int((neg & ~m).sum()), points_in_disks=int(m.sum()),
                                 neg_B_inside_disks=int((neg & m).sum()), min_B_over_2a=float(B.min()), at_min_B=[float(x[ib[1]]), float(t[ib[0]])],
                                 min_abs_LR=float(np.abs(LR[:, :, k]).min()),
                                 min_rho=float(np.nanmin(rho)), at_min_rho=[float(x[i[1]]), float(t[i[0]])], neg_rho=int((rho <= 0).sum()),
                                 max_rho=float(np.nanmax(rho)), rho_quantiles=[float(v) for v in np.nanquantile(rho, [0.001, 0.01, 0.5])]))
    out.append(rec)
json.dump(out, open(os.path.join(d, 'c2_summary.json'), 'w'), indent=1)
for r in out:
    print('%-28s t %.6g..%.6g nt %d rad %.1e | negLD %d (outside disks %d) |' % (r['code'], r['t0'], r['t1'], r['nt'], r['max_ball_radius'], r['neg_LD'], r['neg_LD_outside_disks']),
          ' ; '.join('a=%.2f negB %d (out %d, in %d of %d) minB/2a %.3g min rho %.3g' % (p['a'], p['neg_B'], p['neg_B_outside_disks'], p['neg_B_inside_disks'], p['points_in_disks'], p['min_B_over_2a'], p['min_rho']) for p in r['per_a']))
