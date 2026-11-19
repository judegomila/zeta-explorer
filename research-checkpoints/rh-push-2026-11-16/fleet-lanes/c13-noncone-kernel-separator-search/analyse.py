"""Selection, tables, shuffles, planted rows (PREREG sections 1, 5, 6, 7).
usage: python analyse.py <outdir> <family>[,...] [nshuffle]
Writes <outdir>/analysis_<family>.json and, for each family, top_<family>.npz (near-miss list for the adaptive stage)."""
import json, os, sys, time
import numpy as np

NCL = 9
BLOCK = 400000


def group_index(groups, cplx):
    g = np.asarray(groups)
    cplx = np.asarray(cplx)
    names = None
    P = np.nonzero(g == 'P')[0]
    PH = np.nonzero(g == 'PH')[0]
    idx = dict(P2=P, PH2=PH, P1=P[~cplx[P]], PH1=PH[~cplx[PH]], P0=P[:1], PH0=PH[:0])
    for k in range(1, NCL + 1):
        idx['C%d' % k] = np.nonzero(g == 'C%d' % k)[0]
        idx['H%d' % k] = np.nonzero(g == 'H%d' % k)[0]
    return idx


def tiers(S, idx, pset, reading):
    """S int8 (F, n_obj). -> dict of per-functional arrays."""
    P = S[:, idx[pset]]
    npos = P.shape[1]
    npl = (P > 0).sum(1)
    nmi = (P < 0).sum(1)
    if reading == 'strict':
        s = np.where(npl == npos, 1, np.where(nmi == npos, -1, 0)).astype(np.int8)
    else:
        need = (npos + 1) // 2
        s = np.where((nmi == 0) & (npl >= need), 1, np.where((npl == 0) & (nmi >= need), -1, 0)).astype(np.int8)
    one = s != 0
    opp = (S == -s[:, None]) & one[:, None]
    PH = idx['PH' + pset[1]]
    if len(PH):
        ph_same = (S[:, PH] == s[:, None]).mean(1)
        ph_wrong = opp[:, PH].any(1)
    else:
        ph_same = np.ones(len(S))
        ph_wrong = np.zeros(len(S), dtype=bool)
    rejT = np.zeros((len(S), NCL), dtype=bool)
    fracH = np.zeros((len(S), NCL))
    anyH = np.zeros((len(S), NCL), dtype=bool)
    for k in range(NCL):
        rejT[:, k] = opp[:, idx['C%d' % (k + 1)]].any(1)
        h = opp[:, idx['H%d' % (k + 1)]]
        fracH[:, k] = h.mean(1)
        anyH[:, k] = h.any(1)
    ttrain = one & rejT.all(1)
    tweak = ttrain & anyH.all(1) & ~ph_wrong
    full = ttrain & (ph_same >= 0.95) & (fracH >= 0.95).all(1)
    return dict(s=s, one=one, rejT=rejT, fracH=fracH, anyH=anyH, ttrain=ttrain, tweak=tweak, full=full, ph_same=ph_same)


def optimistic(S, idx, pset):
    """undecided read in favour of a separator: no positive of sign -s, and every class has a training member in {-s, 0}.
    -> boolean (F,) : candidate for the ball stage (T-train level), and the same with the held-out 95% rule."""
    P = S[:, idx[pset]]
    cand = np.zeros(len(S), dtype=bool)
    candfull = np.zeros(len(S), dtype=bool)
    PH = idx['PH' + pset[1]]
    for s in (1, -1):
        ok = ~(P == -s).any(1)
        full = ok.copy()
        if len(PH):
            full &= (S[:, PH] != -s).mean(1) >= 0.95
        for k in range(1, NCL + 1):
            ok &= (S[:, idx['C%d' % k]] != s).any(1)
            full &= (S[:, idx['H%d' % k]] != s).mean(1) >= 0.95
        cand |= ok
        candfull |= ok & full
    return cand, candfull


def summarise(S, idx, pset, reading, top=None):
    """blockwise accumulation over the rows of S."""
    F = S.shape[0]
    acc = dict(n=F, one=0, plus=0, minus=0, rejT=np.zeros(NCL), heldfail=np.zeros(NCL), noneopp=np.zeros(NCL), heldall=np.zeros(NCL),
               hist_train=np.zeros(NCL + 1), hist_any=np.zeros(NCL + 1), hist_h95=np.zeros(NCL + 1), ttrain=0, tweak=0, full=0)
    surv = dict(ttrain=[], tweak=[], full=[])
    best = []
    for lo in range(0, F, BLOCK):
        T = tiers(np.asarray(S[lo:lo + BLOCK]), idx, pset, reading)
        o = T['one']
        acc['one'] += int(o.sum())
        acc['plus'] += int((T['s'] > 0).sum())
        acc['minus'] += int((T['s'] < 0).sum())
        acc['rejT'] += T['rejT'][o].sum(0)
        acc['heldfail'] += (T['fracH'][o] < 0.95).sum(0)
        anyc = T['rejT'] | T['anyH']
        acc['noneopp'] += (~anyc[o]).sum(0)
        acc['heldall'] += (T['fracH'][o] >= 0.95).sum(0)
        acc['hist_train'] += np.bincount(T['rejT'][o].sum(1), minlength=NCL + 1)
        acc['hist_any'] += np.bincount(anyc[o].sum(1), minlength=NCL + 1)
        acc['hist_h95'] += np.bincount((T['fracH'][o] >= 0.95).sum(1), minlength=NCL + 1)
        for t in surv:
            acc[t] += int(T[t].sum())
            surv[t].extend((lo + np.nonzero(T[t])[0]).tolist())
        if top:
            score = np.where(o, anyc.sum(1) + T['fracH'].mean(1) + 0.01 * T['ph_same'], -1.0)
            k = min(top, len(score))
            ii = np.argpartition(-score, k - 1)[:k]
            best.extend(zip(score[ii].tolist(), (lo + ii).tolist()))
    res = {k: (v.tolist() if isinstance(v, np.ndarray) else v) for k, v in acc.items()}
    n1 = max(acc['one'], 1)
    res['pass_frac_train'] = (1 - acc['rejT'] / n1).tolist()
    res['pass_frac_heldout_lt95'] = (acc['heldfail'] / n1).tolist()
    res['pass_frac_no_member_opposite'] = (acc['noneopp'] / n1).tolist()
    res['survivors'] = {t: v[:2000] for t, v in surv.items()}
    if top:
        best = [b for b in best if b[0] > 0]
        best.sort(reverse=True)
        res['top'] = best[:top]
    return res


def shuffle_test(S, groups, cplx, nsh, step):
    Ssub = np.asarray(S[::step])
    g = np.asarray(groups)
    out = []
    for r in range(nsh):
        perm = np.random.Generator(np.random.PCG64(134000 + r)).permutation(len(g))
        idx = group_index(g[perm], np.asarray(cplx)[perm])
        # after permutation the "first positive" has no meaning; only P2 is evaluated
        c = dict(ttrain=0, tweak=0, full=0, one=0)
        for lo in range(0, len(Ssub), BLOCK):
            T = tiers(Ssub[lo:lo + BLOCK], idx, 'P2', 'strict')
            for t in c:
                c[t] += int(T[t].sum())
        out.append(c)
    return out


def main():
    out = sys.argv[1]
    fams = sys.argv[2].split(',')
    nsh = int(sys.argv[3]) if len(sys.argv) > 3 else 200
    meta = json.load(open(os.path.join(out, 'meta.json')))
    idx = group_index(meta['groups'], meta['cplx'])
    for fam in fams:
        f = os.path.join(out, 'signs_%s.npy' % fam)
        if not os.path.exists(f):
            print('missing', fam)
            continue
        t0 = time.time()
        S = np.load(f, mmap_mode='r')
        print('%s: planned read of int8[%d x %d] = %.1f MB in blocks of %d rows' % (fam, S.shape[0], S.shape[1], S.size / 1e6, BLOCK), flush=True)
        res = dict(family=fam, n=int(S.shape[0]), undecided_share=float(np.mean(np.asarray(S[::max(1, S.shape[0] // 200000)]) == 0)))
        for pset in ('P0', 'P1', 'P2'):
            for reading in ('strict', 'favourable'):
                res['%s/%s' % (pset, reading)] = summarise(S, idx, pset, reading, top=200 if reading == 'strict' else None)
        for pset in ('P0', 'P1', 'P2'):
            c = []
            cf = []
            for lo in range(0, S.shape[0], BLOCK):
                a, b = optimistic(np.asarray(S[lo:lo + BLOCK]), idx, pset)
                c.extend((lo + np.nonzero(a)[0]).tolist())
                cf.extend((lo + np.nonzero(b)[0]).tolist())
            res['optimistic/%s' % pset] = dict(ttrain=len(c), full=len(cf), rows_full=cf[:200000], rows_ttrain=c[:200000])
        # per-object undecided share and sign balance (diagnostic)
        sub = np.asarray(S[::max(1, S.shape[0] // 200000)])
        res['per_object_undecided'] = (sub == 0).mean(0).round(4).tolist()
        # planted rows, value level
        r = np.random.Generator(np.random.PCG64(133000))
        rows = np.sort(r.choice(S.shape[0], min(5, S.shape[0]), replace=False))
        ideal = np.where(np.isin(np.asarray(meta['groups']), ['P', 'PH']), 1, -1).astype(np.int8)
        S2 = np.asarray(S[rows]).copy()
        S2[:] = ideal[None, :]
        T2 = tiers(S2, idx, 'P2', 'strict')
        res['planted_value_level'] = dict(rows=rows.tolist(), recovered=int(T2['full'].sum()), expected=len(rows))
        if nsh:
            step = 5 if S.size > 2e8 else 1
            sh = shuffle_test(S, meta['groups'], meta['cplx'], nsh, step)
            res['shuffle'] = dict(n=nsh, step=step, with_full=sum(1 for c in sh if c['full'] > 0), with_tweak=sum(1 for c in sh if c['tweak'] > 0),
                                  with_ttrain=sum(1 for c in sh if c['ttrain'] > 0), mean_ttrain=float(np.mean([c['ttrain'] for c in sh])),
                                  mean_one=float(np.mean([c['one'] for c in sh])), max_ttrain=int(max(c['ttrain'] for c in sh)))
        json.dump(res, open(os.path.join(out, 'analysis_%s.json' % fam), 'w'))
        p2 = res['P2/strict']
        print('%s n=%d one-signed(P2)=%d  T-train=%d T-weak=%d full=%d | P0 one=%d T-train=%d full=%d | fav full=%d | %.0f s' % (
            fam, res['n'], p2['one'], p2['ttrain'], p2['tweak'], p2['full'], res['P0/strict']['one'], res['P0/strict']['ttrain'],
            res['P0/strict']['full'], res['P2/favourable']['full'], time.time() - t0), flush=True)
        print('   pass frac train (P2):', np.round(p2['pass_frac_train'], 3).tolist(), ' hist_any:', [int(x) for x in p2['hist_any']], flush=True)
        print('   optimistic reading (undecided counted for a separator): ' + ', '.join('%s T-train %d full %d' % (p, res['optimistic/' + p]['ttrain'], res['optimistic/' + p]['full']) for p in ('P0', 'P1', 'P2')), flush=True)
        if nsh:
            print('   shuffle:', res['shuffle'], flush=True)


if __name__ == '__main__':
    main()
