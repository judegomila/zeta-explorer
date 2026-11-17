#!/usr/bin/env python3
"""r7-ref-par-cert: parallel dispatch around the REFEREE re-certification driver tmp/r7-ref-full-cert.py.

What is reused UNCHANGED (imported from r7-ref-full-cert.py, which imports the v4c engine unchanged and applies the referee precision
overrides G1 = 3001, quad_n = 11 at import): the dyadic grid NG = (9, 13, 11), fbox (exact-checked float geometry), kids (octree /
bisection rule), OCT, MAXLEV, MAXDEP.  `evaluate` is nested in the referee's main() and is copied here verbatim.

What differs: the referee driver expands one parent at a time (best-first); here up to NW parents are expanded concurrently by forked
worker processes (each box is still evaluated by one process with the referee's call sequence cheap -> gap -> full).  The value
recorded for a box depends only on (box, inherited F, parent bound), and the split rule only on (box, its bound, thr), so a COMPLETE
certificate is the same tree as the serial referee driver's.  A budget-stopped certificate lists accepted boxes plus all open boxes
(heap + parents whose expansion had not returned), margin = max over all listed boxes, as in the referee driver.

Threshold: --thr U (absolute, accept a box when ub <= U; used with U = max box bound of the campaign certificate, so that
"complete" means margin_ref <= margin_campaign exactly) or --target T (thr = K0* + T as in the referee driver).
usage: r7-ref-par-cert.py OUTDIR IDX (--thr U | --target T) [--budget S] [--nw 24] [--resume]"""
import os, sys, time, math, json, heapq, importlib.util as ilu
import multiprocessing as mp
T = os.environ['RTMP']
sp = ilu.spec_from_file_location('RF', f'{T}/r7-ref-full-cert.py'); RF = ilu.module_from_spec(sp); sp.loader.exec_module(RF)
C7 = RF.C7; L6 = RF.L6; fbox = RF.fbox; kids = RF.kids; NG = RF.NG; OCT = RF.OCT; MAXLEV = RF.MAXLEV; MAXDEP = RF.MAXDEP
assert not RF.DEFPREC and C7.G1 == 3001 and RF.QN == 11
pc = None; thr = None


def safe(fn, cnt, *a, **k):
    try:
        v, info = fn(*a, **k)
        if not math.isfinite(v): cnt['inf'] += 1
        return v, info
    except Exception as ex:
        cnt['exc'] += 1; print('   exception', repr(ex)[:200], flush=True); return math.inf, None


def evaluate(b, Finh, ubp, cnt):
    # verbatim from r7-ref-full-cert.py main().evaluate (cnt passed explicitly)
    c, d = fbox(b); ub = ubp; src = 'parent'; Fout = Finh
    if Finh is not None:
        v, _ = safe(pc.bound, cnt, c, d, Finh=Finh); cnt['cheap'] += 1
        if v < ub: ub, src = v, 'cheap'
        if ub <= thr: return ub, src, Fout
    v, _ = safe(pc.gap_bound, cnt, c, d); cnt['gap'] += 1
    if v < ub: ub, src = v, 'gap'
    if ub <= thr: return ub, src, Fout
    v, info = safe(pc.bound, cnt, c, d, reuse5=True); cnt['full'] += 1
    if v < ub: ub, src = v, 'full'
    if info is not None and math.isfinite(v) and 'Fconst' in info: Fout = info['Fconst']
    return ub, src, Fout


def task(a):
    """a = (list of boxes, Finh, ubp): evaluate each box; returns [(box, ub, src, F)], counters, cpu seconds"""
    bs, Finh, ubp = a; cnt = dict(cheap=0, gap=0, full=0, exc=0, inf=0); c0 = time.process_time(); out = []
    for b in bs:
        ub, src, F = evaluate(b, Finh, ubp, cnt)
        out.append((b, ub, src, None if F is None else (F[0], F[1])))
    return out, cnt, time.process_time() - c0


def main():
    global pc, thr
    outdir = sys.argv[1]; IDX = int(sys.argv[2]); args = sys.argv[3:]
    opt = lambda n, dflt, typ=float: typ(args[args.index(n) + 1]) if n in args else dflt
    BUDGET = opt('--budget', 1e9); NW = opt('--nw', 24, int)
    H = json.load(open(f'{T}/r6-fiber-out/p47_hybrid.json')); dd_ = H[IDX]
    E = L6.entry(dd_['key'], dd_['file']); os.makedirs(outdir, exist_ok=True)
    ck = os.path.join(outdir, 'rckpt_%d.json' % IDX); fo = os.path.join(outdir, 'rcert_%d.json' % IDX)
    tc = (E['tL'] + E['tR']) / 2; ac = (E['a_lo'] + E['a_hi']) / 2
    DT = float(E['tR'] - E['tL']) / 2 * (1 + 1e-12); DA = float(E['a_hi'] - E['a_lo']) / 2 * (1 + 1e-12)
    t0 = time.time()
    pc = C7.Piece(E, tc, ac, DT, DA)
    K0 = E['K0star']; assert K0 == dd_['K0star']
    if '--thr' in args: thr = opt('--thr', None); TARGET = thr - K0
    else: TARGET = opt('--target', None); thr = K0 + TARGET
    print('[%d] %s cell %d K0* %.17g thr %.17g target %.12f grid %s G1 %d quadn %d budget %.0f nw %d piece %.0fs' % (
        IDX, dd_['key'], dd_['cell'], K0, thr, TARGET, NG, C7.G1, RF.QN, BUDGET, NW, time.time() - t0), flush=True)
    cnt = dict(cheap=0, gap=0, full=0, exc=0, inf=0); win = dict(cheap=0, gap=0, full=0, parent=0)
    heap = []; done = []; seq = 0; prev = 0.0; cpu = 0.0; init = []
    if '--resume' in args and os.path.exists(ck):
        S = json.load(open(ck)); done = [tuple(x[:6]) + (x[6], x[7]) for x in S['done']]; prev = S['secs']; cpu = S['cpu']
        cnt.update(S['cnt']); win.update(S['win']); assert S['thr'] == thr and S['K0star'] == K0
        for ub, b, F in S['heap']:
            heapq.heappush(heap, (-ub, seq, tuple(b), None if F is None else (F[0], F[1]))); seq += 1
        init = [tuple(b) for b in S['init']]
        print('resumed: %d done, %d open, %d initial pending, %.0fs' % (len(done), len(heap), len(init), prev), flush=True)
    else:
        init = [(0, 0, 0, i0, i1, i2) for i0 in range(NG[0]) for i1 in range(NG[1]) for i2 in range(NG[2])]
    pool = mp.get_context('fork').Pool(NW)          # workers inherit pc, thr
    infl = {}                                        # id -> (async result, kind, payload)

    def checkpoint(final=False):
        hp = [[-h[0], list(h[2]), None if h[3] is None else [h[3][0], h[3][1]]] for h in heap]
        ini = [list(b) for b in init]
        for r, kind, p in infl.values():
            if kind == 'init': ini.append(list(p))
            else: hp.append([-p[0], list(p[2]), None if p[3] is None else [p[3][0], p[3][1]]])
        S = dict(done=[list(x) for x in done], heap=hp, init=ini, secs=prev + time.time() - t0, cpu=cpu, cnt=cnt, win=win, final=final,
                 K0star=K0, thr=thr, target=TARGET, idx=IDX)
        json.dump(S, open(ck + '.tmp', 'w')); os.replace(ck + '.tmp', ck)

    lastck = time.time(); lastlog = time.time(); stop = ''; tid = 0
    while True:
        over = time.time() - t0 + prev > BUDGET
        if over and not stop: stop = 'budget'
        while not stop and len(infl) < NW + 2:
            if init:
                b = init.pop(); infl[tid] = (pool.apply_async(task, (([b], None, math.inf),)), 'init', b); tid += 1
            elif heap:
                h = heapq.heappop(heap); nub, _, b, F = h
                if sum(b[:3]) >= MAXDEP or all(x >= MAXLEV for x in b[:3]):
                    heapq.heappush(heap, h); stop = 'maxlevel'; break
                oc = (-nub > thr + OCT) and max(b[:3]) + 1 <= MAXLEV
                infl[tid] = (pool.apply_async(task, ((kids(b, oc), F, -nub),)), 'exp', h); tid += 1
            else: break
        if not infl: break
        got = [i for i, (r, _, _) in infl.items() if r.ready()]
        if not got: time.sleep(0.02)
        for i in got:
            r, kind, p = infl.pop(i); out, c_, cp = r.get(); cpu += cp
            for k in c_: cnt[k] += c_[k]
            for b, ub, src, F in out:
                if ub <= thr: done.append(tuple(b) + (ub, src)); win[src] += 1
                else: heapq.heappush(heap, (-ub, seq, tuple(b), F)); seq += 1
        if time.time() - lastlog > 60:
            lastlog = time.time()
            tops = [-heap[0][0]] if heap else []
            tops += [-p[0] for r, kind, p in infl.values() if kind == 'exp']
            print('   %d done, %d open, %d inflight, %d init left, top %.6f, cnt %s, %.0fs cpu %.0fs' % (len(done), len(heap), len(infl), len(init),
                  (max(tops) - K0) if tops else float('nan'), cnt, prev + time.time() - t0, cpu), flush=True)
        if time.time() - lastck > 300: checkpoint(); lastck = time.time()
    pool.close(); pool.join()
    assert not infl
    checkpoint(final=True)
    complete = len(heap) == 0 and len(init) == 0
    allb = [list(x[:6]) + [x[6], x[7]] for x in done] + [list(h[2]) + [-h[0], 'open'] for h in heap]
    U = max(x[6] for x in allb) if not init else math.inf
    r = dict(idx=IDX, key=dd_['key'], file=dd_['file'], tag=dd_['key'] + '@' + dd_['file'], cell=dd_['cell'], K0star=K0, thr=thr, target=TARGET,
             U=U, margin=U - K0, complete=complete, nopen=len(heap), ninit_unevaluated=len(init), stop=stop, cnt=cnt, win=win,
             secs=prev + time.time() - t0, cpu=cpu, nw=NW,
             grid=dict(NG=NG, OFF=RF.OFF, SPF=RF.SPF, SPLW=RF.SPLW.tolist(), OCT=OCT, MAXLEV=MAXLEV), precision=dict(G1=C7.G1, quad_n=RF.QN),
             engine='r7-engine-cert-v4c.py (unchanged, x86 port) via r7-ref-full-cert.py (referee; fbox/kids imported, evaluate verbatim) with parallel dispatch r7-ref-par-cert.py',
             boxes=allb)
    json.dump(r, open(fo + '.tmp', 'w')); os.replace(fo + '.tmp', fo)
    print('[%d] U %.17g margin %.12f thr %.17g -> %s | complete %s boxes %d open %d cnt %s win %s %.0fs cpu %.0fs' % (
        IDX, U, r['margin'], thr, 'CONFIRMED (U <= thr)' if (complete and U <= thr) else 'NOT CONFIRMED', complete, len(allb), len(heap), cnt, win, r['secs'], cpu), flush=True)


if __name__ == '__main__':
    main()
