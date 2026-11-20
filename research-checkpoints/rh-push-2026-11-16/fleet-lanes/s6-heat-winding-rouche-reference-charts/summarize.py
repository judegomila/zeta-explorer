"""Summaries of the npz files of run.py.  Usage: summarize.py indir out.json [X ...]"""
import sys, os, glob, json, math, re
import numpy as np
LEV = None
def q(a, ps=(0, 1, 50, 99, 100)):
    a = np.asarray(a, dtype=np.float64)
    return [float(v) for v in np.percentile(a, ps)] if a.size else None
def dilate(mask, r):
    m = mask.copy()
    for k in range(1, r + 1):
        m[k:] |= mask[:-k]; m[:-k] |= mask[k:]
    return m
def load(indir, X, kind, t):
    fs = sorted(glob.glob(os.path.join(indir, 'X%g_c*_%s_%g.npz' % (X, kind, t))))
    if not fs: return None, 0
    parts = [np.load(f) for f in fs]
    keys = [k for k in parts[0].files if k != 'meta']
    d = {k: np.concatenate([p[k] for p in parts], axis=-1) for k in keys}
    d['meta'] = json.loads(str(parts[0]['meta']))
    return d, len(fs)
def summarize(d, nch):
    m = d['meta']; lev = m['levels']; t = m['t']; out = dict(kind=m['kind'], t=t, chunks=nch, boxes=int(d['devB0'].shape[1]), X=m['X'])
    wind = d['wind'].astype(int); ws = d['windstep'].astype(float)
    out['wind'] = {}
    for k, (a, b) in enumerate(m['pairs']):
        w = wind[k]
        out['wind']['%g-%g' % (lev[a], lev[b])] = dict(frac_nonzero=float((w != 0).mean()), total=int(w.sum()), abs_total=int(np.abs(w).sum()),
                                                    frac_step_gt_2p6=float((ws[k] > 2.6).mean()), frac_nonzero_reliable=float(((w != 0) & (ws[k] <= 2.6)).mean()))
    # test 1
    t1 = {}
    refs = sorted(k[4:] for k in d if k.startswith('agg_'))
    dev = d['devB0']
    aggs = {'B0': np.array([dev.max(0), dev[4:].max(0)])}
    for r in refs: aggs[r] = d['agg_' + r]
    for r, ag in aggs.items():
        for i, y0 in enumerate((0.03, 0.1809)):
            mar = 1.0 - ag[i].astype(np.float64); w = wind[i]
            nz = w != 0; far = ~dilate(nz | (wind[0] != 0), 6)
            e = dict(frac_certified=float((mar > 0).mean()), margin_q=q(mar), n_far=int(far.sum()),
                     frac_certified_far=float((mar[far] > 0).mean()) if far.any() else None,
                     frac_certified_zero_boxes=float((mar[nz] > 0).mean()) if nz.any() else None,
                     frac_fail_and_wind0=float(((mar <= 0) & ~nz).mean()))
            if 'lip_' + r in d:
                lp = d['lip_' + r][i].astype(np.float64); ok = mar > 0
                if ok.any(): e['panels_per_unit_x_q'] = q(lp[ok] / mar[ok], (1, 50, 99))
            if 'wref_' + r in d:
                wr = d['wref_' + r][i].astype(int); ok = mar > 0
                e['ref_frac_nonzero_wind'] = float((wr != 0).mean())
                e['rouche_consistent'] = float((w[ok] == -wr[ok]).mean()) if ok.any() else None
                e['frac_certified_refwind0'] = float(((mar > 0) & (wr == 0)).mean())
            t1['%s|y0=%g' % (r, y0)] = e
    out['t1'] = t1
    # test 2
    t2 = {}
    for k in d:
        if not k.startswith('t2_'): continue
        a = d[k].astype(np.float64); nc = a.shape[2]
        nzc = dilate((wind[0] != 0), 6)
        cz = (nzc[0:2 * nc:2] | nzc[1:2 * nc:2])[:nc]
        for r, y in enumerate((0.04, 0.20, 0.50)):
            cert = a[r, 0] < a[r, 1]
            t2['%s|d=%g' % (k[3:], y / 2)] = dict(frac_certified=float(cert.mean()), frac_pointwise=float((a[r, 2] < 1).mean()),
                 residual_q=q(a[r, 0], (1, 50, 99)), floor_q=q(a[r, 1], (1, 50, 99)),
                 frac_certified_far_from_zero_boxes=float(cert[~cz].mean()) if (~cz).any() else None, n_far=int((~cz).sum()))
    if t2: out['t2'] = t2
    # test 3: slice y* <= v <= 0.8645 (level 13)
    t3 = {}
    for ls in range(0, 13):
        sup = dev[ls:14].max(0).astype(np.float64)
        e = dict(frac_hold=float((sup < 1).mean()), sup_q=q(sup, (50, 99, 100)))
        if 'AD' in d:
            ad = d['AD'][ls:14].max(0).astype(np.float64); mD = d['minD'][ls:14].min(0).astype(np.float64)
            e.update(frac_hold_B=float(((ad < 1) & (mD > 0)).mean()), AD_q=q(ad, (50, 99, 100)), minD_q=q(mD, (0, 1, 50)))
        t3['y*=%g' % lev[ls]] = e
    if 'windD' in d:
        wD = d['windD'].astype(int)
        t3['windD'] = {('%g-%g' % (lev[a], lev[b])): dict(frac_nonzero=float((wD[k] != 0).mean()), total=int(wD[k].sum())) for k, (a, b) in enumerate(m['pairs'])}
        # unsound: bound |A/B| < 1 holds on the slice but f has a zero there, or B has a zero
        ad = d['AD'][3:14].max(0); hold = ad < 1
        t3['B_hold_but_f_zero(0.165-0.8645)'] = float((hold & (wind[2] != 0)).mean())
        t3['B_hold_and_B_zero'] = float((hold & (wD[2] != 0)).mean())
    out['t3'] = t3
    return out
if __name__ == '__main__':
    indir = sys.argv[1]; outfn = sys.argv[2]
    fs = glob.glob(os.path.join(indir, 'X*_c*_*.npz'))
    keys = set()
    for f in fs:
        mm = re.match(r'X([^_]+)_c\d+_(.+)_([-0-9.e]+)\.npz$', os.path.basename(f))
        if mm and not f.endswith('.tmp.npz'): keys.add((float(mm.group(1)), mm.group(2), float(mm.group(3))))
    Xs = [float(a) for a in sys.argv[3:]] or sorted(set(k[0] for k in keys))
    res = []
    for X, kind, t in sorted(keys):
        if X not in Xs: continue
        d, nch = load(indir, X, kind, t)
        if d is None: continue
        res.append(summarize(d, nch)); print('summarised', X, kind, t, nch, flush=True)
    json.dump(res, open(outfn, 'w'), indent=0)
