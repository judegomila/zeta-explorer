"""c16 Part B: recount of the c14 joint search (dictionary DJ) for the canonical lifts {T-NR, E_a, HEAT} only.
usage: c14canon.py count <c14out> <outjson>      float64 recount of all 40 family runs from the stored sign matrices
       c14canon.py ball <c14out> <countjson> <outjson> [cap_per_run]   ball stage of the rows float64 leaves open
Uses the c14 code as is (jan.load, jan.criterion, jan.optimistic, jball.bsign, jf.fam_info)."""
import json
import multiprocessing as mp
import os
import sys
import time
import numpy as np

CANON = [2, 3, 4]
NEED = 23
PRECS = (128, 256, 512, 1024, 2048, 4096)
STAGES = ('', '-rnd', '-adp', '-rnd2')


def runs():
    import jf
    return [f + s for s in STAGES for f in jf.FAMS]


def count(out, outf):
    import jan
    res = {}
    for fam in runs():
        t0 = time.time()
        sh1 = np.load(os.path.join(out, fam + '_s1.npy'), mmap_mode='r').shape
        sh2 = np.load(os.path.join(out, fam + '_s2.npy'), mmap_mode='r').shape
        tot = sh2[0] * (sh1[1] + sh2[1])
        print('%s: planned memory: s1 int8%s = %.2f GB, s2 int8%s = %.2f GB, S int8[%d x %d] = %.2f GB, masks about %.2f GB'
              % (fam, sh1, sh1[0] * sh1[1] / 1e9, sh2, sh2[0] * sh2[1] / 1e9, sh2[0], sh1[1] + sh2[1], tot / 1e9, 3 * tot / 1e9), flush=True)
        g, s1, idx2, S = jan.load(out, fam)
        d = jan.gidx(g)
        rec = dict(functionals=int(len(s1)), stage2=int(len(idx2)))
        del s1
        R = jan.criterion(S, d, 'PA', 'strict', CANON)
        one = R['one']
        nrej = R['tr'].sum(1)
        rec.update(one_signed=int(one.sum()), ttrain=int(R['ttrain'].sum()), tweak=int(R['tweak'].sum()), full=int(R['full'].sum()),
                   rejected_train=[int(R['tr'][:, j].sum()) for j in range(3)],
                   nrej_hist=[int(((nrej == q) & one).sum()) for q in range(4)],
                   best_min_heldout_given_pos=int(np.where(R['ph_same'] >= NEED, R['hf'].min(1), 0).max()) if one.any() else 0,
                   best_min_heldout=int(R['hf'].min(1).max()) if one.any() else 0)
        tt = np.nonzero(R['ttrain'])[0]
        # T-train rows whose held-out counts could reach the rule if float64-undecided entries are read in favour
        z = lambda cols: (S[tt][:, cols] == 0).sum(1)
        could = (R['ph_same'][tt] + z(d['PH']) >= NEED)
        for j, k in enumerate(CANON):
            could &= (R['hf'][tt, j] + z(d['H%d' % k]) >= NEED)
        rec['ttrain_rows'] = [int(x) for x in idx2[tt]]
        rec['ttrain_ph_same'] = [int(x) for x in R['ph_same'][tt]]
        rec['ttrain_hf'] = [[int(v) for v in x] for x in R['hf'][tt]]
        rec['ttrain_could_reach'] = [int(x) for x in idx2[tt[could]]]
        RF = jan.criterion(S, d, 'PA', 'strict', jan.FE_CLASSES)
        rec['fe_ttrain_recount'] = int(RF['ttrain'].sum())
        st = json.load(open(os.path.join(out, fam + '_summary.json')))
        rec['fe_ttrain_stored'] = int(st['PA/strict/FE']['ttrain'])
        rec['one_signed_stored'] = int(st['PA/strict/all']['one_signed'])
        om = jan.optimistic(S, d, 'PA', CANON)
        opn = (om > 0) & ~R['ttrain']
        rec['optimistic_not_ttrain'] = int(opn.sum())
        np.save(outf + '.' + fam + '.opt.npy', np.stack((idx2[opn], om[opn].astype(np.int64))))
        rec['seconds'] = time.time() - t0
        res[fam] = rec
        print('%s: F=%d stage2=%d one=%d (stored %d) | canon ttrain=%d full=%d could-reach=%d rej(T-NR,E_a,HEAT)=%s best_min_given_pos=%d | FE ttrain recount %d stored %d | float-open rows %d | %.0fs'
              % (fam, rec['functionals'], rec['stage2'], rec['one_signed'], rec['one_signed_stored'], rec['ttrain'], rec['full'], len(rec['ttrain_could_reach']),
                 rec['rejected_train'], rec['best_min_heldout_given_pos'], rec['fe_ttrain_recount'], rec['fe_ttrain_stored'], rec['optimistic_not_ttrain'], rec['seconds']), flush=True)
        del S, R, RF
    tot = {k: sum(res[f][k] for f in res) for k in ('functionals', 'stage2', 'one_signed', 'ttrain', 'full', 'optimistic_not_ttrain', 'fe_ttrain_recount', 'fe_ttrain_stored')}
    for s in STAGES:
        fs = [f for f in res if (f.endswith(s) if s else f.count('-') == 1)]
        print('STAGE %s: %s' % (s or 'grid', {k: sum(res[f][k] for f in fs) for k in tot}), flush=True)
    print('TOTAL', tot, flush=True)
    json.dump(dict(runs=res, total=tot), open(outf, 'w'))
    print('COUNT-DONE', flush=True)


PAIRS = None
D = None


def ball_row(args):
    """-> dict: status of the row in the canonical tier after balls; held-out counts when T-train"""
    import jball
    import jf
    fam, row, srow, mask, gi = args
    kind, pol = jf.fam_info(fam)
    srow = srow.astype(np.int8).copy()
    nb = [0]

    def bs(j):
        sg, pr, err = jball.bsign(kind, pol, row, PAIRS[j], precs=PRECS)
        nb[0] += 1
        srow[j] = sg if sg else 2
        return sg
    pos = np.concatenate((D['P'], D['PX']))
    out = dict(i=int(gi), status='excluded')
    for bit, s in ((1, 1), (2, -1)):
        if not (mask & bit):
            continue
        st = 'ok'
        for j in pos[srow[pos] == 0]:
            sg = bs(j)
            if sg == -s:
                st = 'dead'
                break
        if st == 'ok' and (srow[pos] == -s).any():
            st = 'dead'
        if st == 'dead':
            continue
        und = bool((srow[pos] == 2).any())
        for k in CANON:
            C = D['C%d' % k]
            if (srow[C] == -s).any():
                continue
            hit = False
            for j in C[srow[C] == 0]:
                if bs(j) == -s:
                    hit = True
                    break
            if not hit:
                if (srow[C] == 2).any():
                    und = True
                else:
                    st = 'dead'
                    break
        if st == 'dead':
            continue
        cur = 'undecided' if und else 'ttrain'
        rec = dict(s=s)
        ok = True
        for key, want in (('PH', s), ('H2', -s), ('H3', -s), ('H4', -s)):
            H = D[key]
            for j in H[srow[H] == 0]:
                if (srow[H] == want).sum() + (srow[H] == 0).sum() < NEED:
                    break
                bs(j)
            rec[key] = int((srow[H] == want).sum())
            rec[key + '_open'] = int(((srow[H] == 0) | (srow[H] == 2)).sum())
            if rec[key] + rec[key + '_open'] < NEED:
                ok = False
                break
        rec['full'] = bool(ok and all(rec[k] >= NEED for k in ('PH', 'H2', 'H3', 'H4')))
        rec['full_open'] = bool(ok and not rec['full'])
        if out['status'] != 'ttrain' or cur == 'ttrain':
            out['status'] = cur
            out['rec'] = rec
        if rec['full']:
            break
    out['nball'] = nb[0]
    return out


def ball(out, countf, outf, cap):
    global PAIRS, D
    import jan
    import jobj
    cnt = json.load(open(countf))['runs']
    PAIRS = jobj.build({})
    ob = json.load(open(os.path.join(out, 'objects.json')))
    assert [p.name for p in PAIRS] == ob['names'], 'object names differ from the stored c14 objects'
    print('objects %d: names equal to the stored c14 objects' % len(PAIRS), flush=True)
    g = np.array(ob['groups'])
    D = jan.gidx(g)
    nw = int(os.environ.get('RH_WORKERS', '4'))
    pool = mp.get_context('fork').Pool(nw)
    res = {}
    for fam in runs():
        t0 = time.time()
        o = np.load(countf + '.' + fam + '.opt.npy')
        masks = {int(i): int(m) for i, m in zip(o[0], o[1])}
        for i in cnt[fam]['ttrain_could_reach']:
            masks[int(i)] = 3
        rows = sorted(masks)
        skipped = max(0, len(rows) - cap)
        if skipped:
            rr = np.random.Generator(np.random.PCG64(160010)).permutation(len(rows))[:cap]
            rows = sorted(rows[i] for i in rr)
        if not rows:
            res[fam] = dict(rows=0, not_processed=0, ttrain=0, undecided=0, excluded=0, full=0, full_open=0, nball=0, detail=[])
            print('%s: 0 rows to read' % fam, flush=True)
            continue
        idx2 = np.load(os.path.join(out, fam + '_idx2.npy'))
        p2 = np.searchsorted(idx2, rows)
        s1 = np.load(os.path.join(out, fam + '_s1.npy'), mmap_mode='r')
        s2 = np.load(os.path.join(out, fam + '_s2.npy'), mmap_mode='r')
        print('%s: %d rows (not processed %d); planned memory: %d sign rows x %d int8 = %.3f MB' % (fam, len(rows), skipped, len(rows), s1.shape[1] + s2.shape[1], len(rows) * 833 / 1e6), flush=True)
        tab = dict(np.load(os.path.join(out, fam + '_params.npz')))
        jobs = [(fam, {k: tab[k][i] for k in tab}, np.concatenate((np.asarray(s1[i]), np.asarray(s2[p]))), masks[i], i) for i, p in zip(rows, p2)]
        del tab
        rs = pool.map(ball_row, jobs, chunksize=max(1, len(jobs) // (nw * 20) + 1))
        c = dict(rows=len(rows), not_processed=skipped, ttrain=0, undecided=0, excluded=0, full=0, full_open=0, nball=0, detail=[])
        for r in rs:
            c[r['status']] += 1
            c['nball'] += r['nball']
            if r['status'] != 'excluded':
                c['full'] += int(r['rec']['full'])
                c['full_open'] += int(r['rec']['full_open'])
                if len(c['detail']) < 400:
                    c['detail'].append(r)
        c['seconds'] = time.time() - t0
        res[fam] = c
        print('%s: %s' % (fam, {k: v for k, v in c.items() if k != 'detail'}), flush=True)
        json.dump(res, open(outf, 'w'))
    pool.close()
    tot = {k: sum(res[f][k] for f in res) for k in ('rows', 'not_processed', 'ttrain', 'undecided', 'excluded', 'full', 'full_open', 'nball')}
    print('BALL-TOTAL', tot, flush=True)
    json.dump(dict(runs=res, total=tot), open(outf, 'w'))
    print('C14BALL-DONE', flush=True)


if __name__ == '__main__':
    if sys.argv[1] == 'count':
        count(sys.argv[2], sys.argv[3])
    else:
        ball(sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5]) if len(sys.argv) > 5 else 10 ** 9)
