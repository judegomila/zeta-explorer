"""c14 analysis: registered criterion, tiers, per-class tables, optimistic list for the ball stage, planted rows, shuffles.
usage: jan.py <outdir> <fam,fam,...> [nshuffle]"""
import json
import os
import sys
import numpy as np

FE_CLASSES = [2, 3, 4, 8]
ALLC = list(range(1, 10))
NEED = 23


def load(out, fam):
    ob = json.load(open(os.path.join(out, 'objects.json')))
    g = np.array(ob['groups'])
    s1 = np.load(os.path.join(out, fam + '_s1.npy'))
    idx2 = np.load(os.path.join(out, fam + '_idx2.npy'))
    s2 = np.load(os.path.join(out, fam + '_s2.npy'))
    S = np.concatenate((s1[idx2], s2), axis=1)
    return g, s1, idx2, S


def gidx(g):
    d = {'P': np.nonzero(g == 'P')[0], 'PX': np.nonzero(g == 'PX')[0], 'PH': np.nonzero(g == 'PH')[0]}
    for k in ALLC:
        d['C%d' % k] = np.nonzero(g == 'C%d' % k)[0]
        d['H%d' % k] = np.nonzero(g == 'H%d' % k)[0]
    return d


def pos_sign(S, cols, reading):
    """sign s (0 = not one-signed) of each row on the positive columns"""
    X = S[:, cols]
    npos = (X == 1).sum(1)
    nneg = (X == -1).sum(1)
    n = len(cols)
    if reading == 'strict':
        return np.where(npos == n, 1, np.where(nneg == n, -1, 0)).astype(np.int8)
    if reading == 'fav':
        return np.where((nneg == 0) & (2 * npos >= n), 1, np.where((npos == 0) & (2 * nneg >= n), -1, 0)).astype(np.int8)
    raise ValueError(reading)


def criterion(S, d, pset, reading, classes):
    cols = d['P'] if pset == 'PZ' else np.concatenate((d['P'], d['PX']))
    s = pos_sign(S, cols, reading)
    one = s != 0
    R = {}
    tr = np.zeros((len(S), len(classes)), dtype=bool)
    hf = np.zeros((len(S), len(classes)))
    for j, k in enumerate(classes):
        C = d['C%d' % k]
        H = d['H%d' % k]
        if len(C):
            tr[:, j] = (S[:, C] == -s[:, None]).any(1) & one
        if len(H):
            hf[:, j] = (S[:, H] == -s[:, None]).sum(1)
    hf[~one] = 0
    ph_same = (S[:, d['PH']] == s[:, None]).sum(1)
    ph_opp = (S[:, d['PH']] == -s[:, None]).sum(1)
    ttrain = one & tr.all(1)
    tweak = ttrain & (ph_opp == 0) & (hf >= 1).all(1)
    full = ttrain & (ph_same >= NEED) & (hf >= NEED).all(1)
    R.update(s=s, one=one, tr=tr, hf=hf, ttrain=ttrain, tweak=tweak, full=full, ph_same=ph_same)
    return R


def optimistic(S, d, pset, classes):
    """rows that float64 cannot exclude from T-train: for s = +1 or -1, no positive of sign -s and every class has a
    training member that is -s or undecided. -> array of s candidates (bitmask 1: s = +1, 2: s = -1)"""
    cols = d['P'] if pset == 'PZ' else np.concatenate((d['P'], d['PX']))
    X = S[:, cols]
    m = np.zeros(len(S), dtype=np.int8)
    for bit, s in ((1, 1), (2, -1)):
        ok = ~(X == -s).any(1)
        for k in classes:
            C = d['C%d' % k]
            ok &= ((S[:, C] == -s) | (S[:, C] == 0)).any(1) if len(C) else False
        m |= (bit * ok).astype(np.int8)
    return m


def summarize(fam, g, s1, idx2, S, nshuffle, rng_seed):
    d = gidx(g)
    F = len(s1)
    conflict = (s1 == 1).any(1) & (s1 == -1).any(1)
    cas = ~conflict[idx2]                      # stage-2 rows that are there by the cascade (not only by the subsample)
    out = dict(family=fam, functionals=int(F), stage2=int(len(idx2)), stage2_cascade=int(cas.sum()),
               undecided_share_stage1=float((s1 == 0).mean()))
    for pset in ('PZ', 'PA'):
        for reading in ('strict', 'fav'):
            for tier, classes in (('all', ALLC), ('FE', FE_CLASSES)):
                R = criterion(S, d, pset, reading, classes)
                one = R['one']
                key = '%s/%s/%s' % (pset, reading, tier)
                nrej = R['tr'].sum(1)
                rec = dict(one_signed=int(one.sum()), ttrain=int(R['ttrain'].sum()), tweak=int(R['tweak'].sum()), full=int(R['full'].sum()),
                           classes=classes,
                           rejected_train=[int(R['tr'][:, j].sum()) for j in range(len(classes))],
                           heldout_ge23=[int((R['hf'][:, j] >= NEED).sum()) for j in range(len(classes))],
                           nrej_hist=[int(((nrej == r) & one).sum()) for r in range(len(classes) + 1)],
                           best_min_heldout=float((R['hf'].min(1) / 24.0).max()) if one.any() else 0.0,
                           best_min_heldout_given_pos=float((np.where(R['ph_same'] >= NEED, R['hf'].min(1), 0) / 24.0).max()) if one.any() else 0.0,
                           survivors=[int(x) for x in idx2[np.nonzero(R['full'])[0]][:50]],
                           ttrain_rows=[int(x) for x in idx2[np.nonzero(R['ttrain'])[0]][:200]])
                out[key] = rec
        for tier, classes in (('all', ALLC), ('FE', FE_CLASSES)):
            om = optimistic(S, d, pset, classes)
            out['%s/optimistic/%s' % (pset, tier)] = int((om > 0).sum())
            np.save(os.path.join(OUT, '%s_opt_%s_%s.npy' % (fam, pset, tier)), np.stack((idx2[om > 0], om[om > 0])))
    # near misses for the adaptive stage: one-signed on PZ, most classes rejected, then best min held-out
    R = criterion(S, d, 'PZ', 'strict', ALLC)
    score = R['tr'].sum(1) * 100.0 + R['hf'].min(1) + R['hf'].mean(1) / 100.0
    score[~R['one']] = -1
    top = np.argsort(-score, kind='stable')[:200]
    top = top[score[top] >= 0]
    np.save(os.path.join(OUT, fam + '_top.npy'), idx2[top])
    out['top_score'] = [float(x) for x in score[top][:5]]
    # planted value-level rows
    r = np.random.Generator(np.random.PCG64(rng_seed))
    if len(S) >= 5:
        rows = np.sort(r.choice(len(S), 5, replace=False))
        S2 = S.copy()
        ideal = np.where(np.isin(g, ['P', 'PX', 'PH']), 1, -1).astype(np.int8)
        S2[rows] = ideal
        Rp = criterion(S2, d, 'PA', 'strict', ALLC)
        found = np.nonzero(Rp['full'])[0]
        real = np.nonzero(criterion(S, d, 'PA', 'strict', ALLC)['full'])[0]
        out['planted_rows_recovered'] = bool(set(found.tolist()) == set(rows.tolist()) | set(real.tolist()))
    # shuffles on the subsample (index = 0 mod 20: every object evaluated regardless of stage 1)
    sub = np.nonzero(idx2 % 20 == 0)[0]
    out['subsample'] = int(len(sub))
    if nshuffle and len(sub):
        Ss = S[sub]
        cnt = dict(full=0, tweak=0, ttrain=0)
        for rr in range(nshuffle):
            perm = np.random.Generator(np.random.PCG64(144000 + rr)).permutation(len(g))
            dd = gidx(g[perm])
            Rr = criterion(Ss, dd, 'PA', 'strict', ALLC)
            for k in cnt:
                cnt[k] += int(Rr[k].any())
        out['shuffle'] = dict(n=nshuffle, **cnt)
        # unshuffled subsample, for comparison
        Rr = criterion(Ss, d, 'PA', 'strict', ALLC)
        out['subsample_unshuffled'] = dict(one_signed=int(Rr['one'].sum()), ttrain=int(Rr['ttrain'].sum()), full=int(Rr['full'].sum()))
    return out


if __name__ == '__main__':
    OUT = sys.argv[1]
    fams = sys.argv[2].split(',')
    nsh = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    import jf
    for fam in fams:
        g, s1, idx2, S = load(OUT, fam)
        base = '-'.join(fam.split('-')[:2])
        res = summarize(fam, g, s1, idx2, S, nsh, 143000 + jf.FAMS.index(base))
        json.dump(res, open(os.path.join(OUT, fam + '_summary.json'), 'w'), indent=1)
        a = res['PA/strict/all']
        z = res['PZ/strict/all']
        fe = res['PA/strict/FE']
        print('%s: F=%d stage2=%d | PZ one=%d ttrain=%d full=%d rej=%s | PA one=%d ttrain=%d tweak=%d full=%d rej=%s held>=23=%s bestmin=%.3f | FE-tier PA ttrain=%d full=%d | opt PA/all=%d PA/FE=%d PZ/all=%d | planted=%s shuffle=%s'
              % (fam, res['functionals'], res['stage2'], z['one_signed'], z['ttrain'], z['full'], z['rejected_train'], a['one_signed'], a['ttrain'], a['tweak'], a['full'],
                 a['rejected_train'], a['heldout_ge23'], a['best_min_heldout'], fe['ttrain'], fe['full'], res['PA/optimistic/all'], res['PA/optimistic/FE'],
                 res['PZ/optimistic/all'], res.get('planted_rows_recovered'), res.get('shuffle')), flush=True)
