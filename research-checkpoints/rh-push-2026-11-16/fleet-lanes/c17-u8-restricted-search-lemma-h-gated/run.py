"""driver.  usage: run.py <plan.json> <outdir>   plan: list of [family, pol (0/1), n_nodes, deadline_seconds(, start)].
Each family is run over consecutive chunks of its registered node stream by a pool (RH_WORKERS); results are
merged in stream order; a family stopped at its deadline reports the completed prefix."""
import sys, os, json, time
import multiprocessing as mp

LOCO_SIGN, LOCO_THR = 5000, 1000
CH = {'minor': 100, 'turan': 20}
_O = None


def work(a):
    global _O
    import du
    fam, pol, start, n = a
    if _O is None:
        _O = du.build_objects()
    t = time.time()
    nodes = du.draw_nodes(fam, bool(pol), n, start)
    kind, m, thr = du.fam_info(fam)
    cnt = {}
    recs = []
    for nd in nodes:
        du.VALCACHE.clear()
        if kind in ('T3', 'T6'):
            c, r = du.turan_node(fam, nd, bool(pol), _O)
            recs += r
        else:
            c, r = du.minor_node(fam, nd, bool(pol), _O, nd['id'] < (LOCO_THR if thr else LOCO_SIGN))
            if r is not None:
                recs.append(r)
        for k, v in c.items():
            cnt[k] = cnt.get(k, 0) + v
    return dict(fam=fam, pol=pol, start=start, n=n, cnt=cnt, recs=recs, sec=time.time() - t)


def main():
    import du
    plan = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    W = int(os.environ.get('RH_WORKERS', '4'))
    print('workers', W, 'planned allocation: per worker below 1 GB (object tables, value cache of at most 4000 lists)', flush=True)
    for ent in plan:
        fam, pol, N, dl = ent[:4]
        st = ent[4] if len(ent) > 4 else 0          # continuation of a stream: nodes st .. N-1
        f = os.path.join(out, '%s_%s%s.json' % (fam, 'pol' if pol else 'k3', ('_from%d' % st) if st else ''))
        if os.path.exists(f):
            print('skip', f, flush=True)
            continue
        kind = du.fam_info(fam)[0]
        ch = CH['turan'] if kind in ('T3', 'T6') else CH['minor']
        jobs = [(fam, pol, s, min(ch, N - s)) for s in range(st, N, ch)]
        t0 = time.time()
        tot = {}
        recs = []
        done = 0
        cut = False
        pool = mp.Pool(W)
        it = pool.imap(work, jobs)
        for j in range(len(jobs)):
            while True:
                try:
                    r = it.next(timeout=30)
                    break
                except mp.TimeoutError:
                    if time.time() - t0 > dl:
                        cut = True
                        break
            if cut:
                break
            if time.time() - t0 > dl:
                cut = True                      # deadline also checked after every chunk (the chunk just received is kept)
            for k, v in r['cnt'].items():
                tot[k] = tot.get(k, 0) + v
            recs += r['recs']
            done += r['n']
            if j % 20 == 0:
                print(fam, pol, 'done', done, 'of', N, 'sec', round(time.time() - t0), {k: tot[k] for k in sorted(tot)}, flush=True)
            if cut:
                break
        pool.terminate()
        pool.join()
        json.dump(dict(fam=fam, pol=pol, planned=N, start=st, done=done, cut=cut, sec=time.time() - t0, cnt=tot, recs=recs,
                       loco=[LOCO_SIGN, LOCO_THR]), open(f, 'w'))
        print('FAMILY', fam, pol, 'done', done, 'cut', cut, 'sec', round(time.time() - t0), json.dumps(tot, sort_keys=True), flush=True)
    print('ALL DONE', flush=True)


if __name__ == '__main__':
    main()
