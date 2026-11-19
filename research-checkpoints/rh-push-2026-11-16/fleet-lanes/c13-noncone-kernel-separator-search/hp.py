"""Ball stage (PREREG sections 5, 7): resolves, in python-flint ball arithmetic, the float64-undecided entries of every
functional that the float64 run cannot exclude (optimistic reading, positives = {zeta}, the weakest positive set).
usage: python hp.py <outdir> <family>[,...] [max_rows] [sample_seed]
Per row: zeta first (sign s); then class by class (cheap classes first) the undecided training members until one has
sign -s; a class all of whose training members are decided with sign s (or are zero in the ball at the last
precision) kills the row. A row that no class kills is completed on every object and re-read by analyse.tiers.
Writes <outdir>/hp_<family>.json."""
import json, os, sys, time
import multiprocessing as mp
import numpy as np
import funcs, objects, ballk, analyse

ORDER = [2, 9, 1, 7, 5, 6, 3, 8, 4]
PRECS = (300, 3000, 12000)
OBJS = None; IDX = None; FAM = None; TAB = None; SG = None; EV = {}


def ev(j):
    if j not in EV:
        EV[j] = ballk.Evaluator(OBJS[j][1])
    return EV[j]


def do_rows(rows):
    out = []
    for i in rows:
        row = {k: v[i] for k, v in TAB.items()}
        sg = np.array(SG[i]).astype(np.int8)
        used = {}

        def res(j):
            if sg[j] == 0 and j not in used:
                s, pr = ev(j).sign(FAM, row, PRECS)
                sg[j] = s
                used[j] = pr
            return sg[j]
        z = int(IDX['P0'][0])
        s = res(z)
        rec = dict(row=int(i), zeta=int(s), zprec=used.get(z, 0))
        if s == 0:
            rec['status'] = 'zeta_zero'
        else:
            killer = 0
            for k in ORDER:
                mem = IDX['C%d' % k]
                if (sg[mem] == -s).any():
                    continue
                okk = False
                for j in mem:
                    if sg[j] == 0 and j not in used and res(j) == -s:
                        okk = True
                        break
                if not okk:
                    killer = k
                    break
            if killer:
                rec['status'] = 'killed'
                rec['killer'] = killer
                # clean kill: every training member of the killing class is decided with zeta's sign (no ball zero)
                rec['clean'] = bool((sg[IDX['C%d' % killer]] == s).all())
            else:
                for j in range(len(sg)):
                    res(j)
                rec['status'] = 'alive'
                rec['signs'] = sg.tolist()
                rec['ballzero'] = [int(j) for j in used if sg[j] == 0]
        rec['nball'] = len(used)
        rec['maxprec'] = max(used.values()) if used else 0
        out.append(rec)
    for e in EV.values():
        e.cache.clear()
    return out


def main():
    global OBJS, IDX, FAM, TAB, SG
    out = sys.argv[1]
    fams = sys.argv[2].split(',')
    maxrows = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    nw = int(os.environ.get('RH_WORKERS', '4'))
    OBJS = objects.build()
    meta = json.load(open(os.path.join(out, 'meta.json')))
    assert meta['names'] == [o.name for _, o in OBJS]
    IDX = analyse.group_index(meta['groups'], meta['cplx'])
    for FAM in fams:
        t0 = time.time()
        TAB = dict(np.load(os.path.join(out, 'params_%s.npz' % FAM)))
        SG = np.load(os.path.join(out, 'signs_%s.npy' % FAM), mmap_mode='r')
        cand = []
        for lo in range(0, SG.shape[0], analyse.BLOCK):
            a, _ = analyse.optimistic(np.asarray(SG[lo:lo + analyse.BLOCK]), IDX, 'P0')
            cand.extend((lo + np.nonzero(a)[0]).tolist())
        ncand = len(cand)
        if maxrows and ncand > maxrows:
            r = np.random.Generator(np.random.PCG64(int(sys.argv[4]) if len(sys.argv) > 4 else 139000))
            cand = np.sort(r.choice(cand, maxrows, replace=False)).tolist()
        print('%s: %d candidate rows (optimistic, P0); processing %d with %d workers; planned memory: per-worker kernel cache at most 200000 balls of %d bits = %.0f MB'
              % (FAM, ncand, len(cand), nw, PRECS[-1], 200000 * PRECS[-1] / 8 / 1e6), flush=True)
        chunks = [cand[k:k + 200] for k in range(0, len(cand), 200)]
        recs = []
        if chunks:
            with mp.get_context('fork').Pool(min(nw, len(chunks))) as pool:
                for k, r_ in enumerate(pool.imap(do_rows, chunks)):
                    recs.extend(r_)
                    if k % 50 == 0:
                        print('  %s chunk %d/%d  %.0f s' % (FAM, k + 1, len(chunks), time.time() - t0), flush=True)
        st = {}
        for r_ in recs:
            key = r_['status'] + ('_by_%d' % r_['killer'] if r_['status'] == 'killed' else '')
            st[key] = st.get(key, 0) + 1
        alive = [r_ for r_ in recs if r_['status'] == 'alive']
        tier = {}
        if alive:
            S2 = np.array([r_['signs'] for r_ in alive], dtype=np.int8)
            for pset in ('P0', 'P1', 'P2'):
                T = analyse.tiers(S2, IDX, pset, 'strict')
                tier[pset] = dict(ttrain=int(T['ttrain'].sum()), tweak=int(T['tweak'].sum()), full=int(T['full'].sum()),
                                  rows_full=[alive[i]['row'] for i in np.nonzero(T['full'])[0]],
                                  rows_ttrain=[alive[i]['row'] for i in np.nonzero(T['ttrain'])[0]],
                                  fracH=np.round(T['fracH'][T['ttrain']], 3).tolist()[:50], ph_same=np.round(T['ph_same'][T['ttrain']], 3).tolist()[:50])
        unclean = [r_['row'] for r_ in recs if r_['status'] == 'killed' and not r_['clean']]
        zs = [r_['zeta'] for r_ in recs]
        res = dict(family=FAM, candidates=ncand, processed=len(recs), status=st, kills_with_a_ball_zero_member=len(unclean), unclean_rows=unclean[:1000], zeta_plus=zs.count(1), zeta_minus=zs.count(-1),
                   ball_evaluations=int(sum(r_['nball'] for r_ in recs)), maxprec_hist={str(p): sum(1 for r_ in recs if r_['maxprec'] == p) for p in (0,) + PRECS},
                   alive=alive[:500], tiers_alive=tier, seconds=time.time() - t0, precs=PRECS, order=ORDER)
        json.dump(res, open(os.path.join(out, 'hp_%s.json' % FAM), 'w'))
        print('%s: status %s | kills relying on a ball-zero member: %d | zeta +%d -%d | alive tiers %s | %.0f s' % (FAM, st, len(unclean), zs.count(1), zs.count(-1),
              {k: (v['ttrain'], v['tweak'], v['full']) for k, v in tier.items()}, time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
