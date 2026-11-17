#!/usr/bin/env python3
"""Sweep scheme x size x input.  One OS process per task, at most RH_WORKERS at a time (default 8).

  python sweep.py --tier box --out results/box.jsonl          # resumable: finished keys are skipped
  python sweep.py --tier local --out results/local.jsonl
  python sweep.py --tier box --list                           # print the task list with planned memory

Environment:  RH_WORKERS (default 8)   RH_TASK_GB (per-task memory cap, default 8)
              RH_TASK_SECONDS (per-task wall-clock limit, default 7200)   RH_TOTAL_GB (cap on the sum of planned memory of
              running tasks, default 48)
Each result is one JSON line {key, task, status, result, seconds, peak_rss_mb, planned_mb}.  Status:
  OK | NOT_FORMULABLE | SKIPPED_PLAN | KILLED_MEM | KILLED_TIME | ERROR.   OK / NOT_FORMULABLE / SKIPPED_PLAN are
final; the others are retried on the next run only with --retry-failed.
The parent prints the planned memory of a task before starting it, polls the resident memory of every child
(/proc on Linux, ps elsewhere) and kills a child whose resident memory exceeds min(RH_TASK_GB, max(1.5 GB,
1.25 x planned)) or whose run time exceeds RH_TASK_SECONDS.  Resident total <= 1.25 RH_TOTAL_GB + 1.5 GB x workers.
"""
import argparse, json, math, multiprocessing as mp, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)


def key_of(t):
    return json.dumps(t, sort_keys=True, separators=(',', ':'))


# ----------------------------------------------------------------------------- task lists
PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 37, 47, 59, 71, 83, 97, 127, 199, 293, 397, 499, 997]
TIERS = {
    'smoke': dict(jd=[4, 8, 16], jshift=[0], afeN=[1, 2, 3], afeT=30.0, eulP=[2, 5], eulT=30.0,
                  thN=[2, 3], thTcap=30.0, polN=[2, 3], polT=30.0, dbnN=[2], dbnT=12.0, lams=['-1', '0.05'],
                  bohrP=[2, 5], bohrN=[3, 6]),
    'local': dict(jd=[4, 8, 16, 32, 64, 128, 256], jshift=[0, 8], afeN=[1, 2, 3, 4, 5, 6, 8, 10, 20], afeT=60.0,
                  eulP=[2, 3, 5, 7, 11, 13, 17, 23, 29, 47], eulT=30.0, thN=[1, 2, 3], thTcap=80.0, polN=[1, 2, 3], polT=40.0,
                  dbnN=[4], dbnT=62.0, lams=['-1', '0.05'],
                  bohrP=[2, 3, 5, 7, 11, 13, 29, 47, 97], bohrN=[2, 3, 4, 5, 6, 8, 10, 15, 20, 30]),
    'box': dict(jd=[4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048], jshift=[0, 8, 64],
                afeN=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 30, 50, 75, 100, 150, 200, 300, 500], afeT=400.0,
                eulP=PRIMES, eulT=200.0, thN=[1, 2, 3, 4, 5, 6, 7, 8], thTcap=700.0,
                polN=[1, 2, 3, 4, 5, 6, 8, 10, 15, 20], polT=200.0,
                dbnN=[6], dbnT=150.0, lams=['-1', '-0.25', '-0.05', '0.05'],
                bohrP=PRIMES, bohrN=[2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 50, 100, 200], jd_heat_max=128),
    'boxbig': dict(jd=[4096], jshift=[0], afeN=[], afeT=0.0, eulP=[], eulT=0.0, thN=[], thTcap=0.0, polN=[], polT=0.0,
                   dbnN=[], dbnT=0.0, lams=[], bohrP=[], bohrN=[], jd_heat_max=0),
}
JENSEN_INPUTS = ['zeta', 'dh', 'ea:0.25', 'ea:0.05', 'nr:3:2.2', 'heat:-1', 'heat:-0.25', 'heat:-0.05', 'heat:0.05',
                 'tw2m']
DIR_INPUTS = ['zeta', 'dh', 'tw2m', 'tw2h', 'liou', 'ea:0.25']
EUL_INPUTS = ['zeta', 'tw2m', 'tw2h', 'liou', 'ea:0.25', 'dh']
KER_INPUTS = ['zeta', 'dh', 'tw2m', 'liou', 'ea:0.25']


def grid(tier):
    c = TIERS[tier]
    G = []
    for inp in JENSEN_INPUTS:
        for n in c['jshift']:
            for d in c['jd']:
                if inp.startswith('heat') and d > c.get('jd_heat_max', 64):
                    continue                                # heat coefficients need precision ~ log2((2(d+J))!)
                G.append(dict(scheme='jensen', input=inp, size=d, shift=n))
    for w in ('sharp', 'riesz1', 'riesz2'):
        for inp in DIR_INPUTS:
            for N in c['afeN']:
                if w != 'sharp' and N < 2:
                    continue
                G.append(dict(scheme='afe', input=inp, size=N, weight=w, T=c['afeT']))
    for inp in EUL_INPUTS:
        for P in c['eulP']:
            G.append(dict(scheme='euler', input=inp, size=P, T=c['eulT']))
    for inp in KER_INPUTS:
        for N in c['thN']:
            # the half-line truncation departs from the full kernel near height 4 (N+1)^2 (see RESULT.md)
            G.append(dict(scheme='thalf', input=inp, size=N, T=min(c['thTcap'], 8.0 * (N + 1) ** 2 + 20), Y=4.0))
        for N in c['polN']:
            G.append(dict(scheme='polya', input=inp, size=N, T=c['polT']))
    for lam in c['lams']:
        for inp in ('zeta', 'dh'):
            for N in c['dbnN']:
                G.append(dict(scheme='dbn', input=inp, size=N, lam=lam, T=c['dbnT']))
    for inp in ('zeta', 'tw2m', 'tw2h', 'liou'):
        for P in c['bohrP']:
            G.append(dict(scheme='bohr', kind='euler', input=inp, size=P))
    for inp in ('zeta', 'dh', 'tw2m'):
        for N in c['bohrN']:
            G.append(dict(scheme='bohr', kind='dirichlet', input=inp, size=N))
    return G


# ----------------------------------------------------------------------------- planned memory and cost
def obj_prec(t):
    return 128 + int(1.5 * t.get('T', 0))


def plan(t):
    """(planned megabytes, relative cost) from the sizes the task will allocate."""
    base = 150.0
    s = t['scheme']
    if s == 'jensen':
        d, n = t['size'], t.get('shift', 0)
        prec = max(256, 40 * d + 256) * 9 // 4      # allow two precision increases of 3/2
        order = 2 * (d + n) + 2
        if t['input'].startswith('heat'):
            al = abs(float(t['input'].split(':')[1]))
            J = int(prec * math.log(2) / math.log(2 * math.pi / al)) + d + 20
            order = 2 * (d + n + J) + 2
            prec += int(math.lgamma(order + 1) / math.log(2))
        # calibration (README): peak resident ~ 20 bytes x series order x precision bits (zeta series temporaries)
        mb = 100 + 24.0 * order * prec / 1e6
        return mb, order * order * prec
    if s == 'bohr':
        return base + 50, t['size'] ** 2
    n_eval = (2 * t['T'] / 0.05 + 2 * t['T'] / 0.006) * 3
    return base + 3 * n_eval * 200 / 1e6, n_eval * t['size'] * obj_prec(t) * (2000 if s == 'dbn' else 1)


# ----------------------------------------------------------------------------- one task (runs in a child)
def run_task(t):
    import lylib as L
    from flint import ctx
    s = t['scheme']
    if s == 'bohr':
        import bohr
        if t['input'] == 'dh' and t.get('kind') == 'euler':
            return 'NOT_FORMULABLE', {'why': 'dh has no Euler product'}
        return 'OK', bohr.run(t)
    if s == 'jensen':
        try:
            res, _ = L.jensen_test(t['input'], t['size'], t.get('shift', 0),
                                   prec_max=int(os.environ.get('RH_PREC_MAX', 1 << 19)))
        except ValueError as e:
            return 'NOT_FORMULABLE', {'why': str(e)}
        return 'OK', res
    opt = {k: t[k] for k in ('weight', 'lam') if k in t}
    prec = obj_prec(t)
    last = None
    for attempt, (dT, pm) in enumerate(((0.0, 1), (-0.137, 1), (-0.291, 2))):
        ctx.prec = prec * pm
        try:
            F, ymax, note, bound = L.make_object(s, t['input'], t['size'], opt)
        except ValueError as e:
            return 'NOT_FORMULABLE', {'why': str(e)}
        Y = min(ymax, t.get('Y', 1.25))
        if 'Y' in t and t['Y'] > 1.25:
            ctx.prec += int(3 * t['Y'] * math.log2(2 + t['T']))   # |F| varies by (t/2pi)^(Y/2) across the window
        try:
            ex = L.Expander(F, bound)
            bud = int(os.environ.get('RH_BOX_BUDGET', 20_000_000))
            res = L.lee_yang_window(F, t['T'] + dT, Y, eta=t.get('eta', 0.02), budget=bud, ex=ex)
            res.update(prec=ctx.prec, note=note, attempt=attempt)
            Tlo = t.get('Tlo', 10.0)
            if res['verdict'] == 'FAIL' and res.get('lowest_offaxis_re_in', [Tlo])[0] < Tlo < t['T']:
                try:                                           # second window: heights above Tlo only
                    hi = L.lee_yang_window(F, t['T'] + dT, Y, eta=t.get('eta', 0.02), budget=bud, ex=ex, Tlo=Tlo)
                except L.Unresolved as e:
                    hi = {'verdict': 'UNRESOLVED', 'why': str(e)}
                res['high'] = hi
            return 'OK', res
        except L.Unresolved as e:
            last = str(e)
    return 'OK', {'verdict': 'UNRESOLVED', 'why': last, 'prec': ctx.prec}


def child(t, conn, cap_gb):
    try:
        if sys.platform.startswith('linux'):
            import resource
            lim = int((cap_gb + 2) * 2 ** 30)
            resource.setrlimit(resource.RLIMIT_AS, (lim, lim))
        t0 = time.time()
        status, res = run_task(t)
        conn.send((status, res, time.time() - t0))
    except MemoryError:
        conn.send(('KILLED_MEM', {'why': 'MemoryError inside the task'}, 0.0))
    except Exception as e:                                   # noqa
        import traceback
        conn.send(('ERROR', {'why': repr(e), 'trace': traceback.format_exc()[-1500:]}, 0.0))
    finally:
        conn.close()


def rss_mb(pid):
    try:
        if sys.platform.startswith('linux'):
            with open('/proc/%d/statm' % pid) as f:
                return int(f.read().split()[1]) * os.sysconf('SC_PAGE_SIZE') / 1e6
        o = subprocess.run(['ps', '-o', 'rss=', '-p', str(pid)], capture_output=True, text=True).stdout.strip()
        return int(o) / 1e3 if o else 0.0
    except Exception:
        return 0.0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--tier', default='smoke', choices=sorted(TIERS))
    ap.add_argument('--out', default=None)
    ap.add_argument('--list', action='store_true')
    ap.add_argument('--retry-failed', action='store_true')
    ap.add_argument('--retry-unresolved', action='store_true')
    ap.add_argument('--only', default=None, help='comma list of schemes')
    ap.add_argument('--max-cost', type=float, default=None, help='skip tasks whose relative cost exceeds this')
    a = ap.parse_args()
    W = int(os.environ.get('RH_WORKERS', '8'))
    cap = float(os.environ.get('RH_TASK_GB', '8'))
    tmax = float(os.environ.get('RH_TASK_SECONDS', '7200'))
    total_cap = float(os.environ.get('RH_TOTAL_GB', '48')) * 1000
    out = a.out or os.path.join(HERE, 'results', a.tier + '.jsonl')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    tasks = grid(a.tier)
    if a.only:
        tasks = [t for t in tasks if t['scheme'] in a.only.split(',')]
    planned = {key_of(t): plan(t) for t in tasks}
    if a.max_cost:
        tasks = [t for t in tasks if planned[key_of(t)][1] <= a.max_cost]
    tasks.sort(key=lambda t: planned[key_of(t)][1])
    if a.list:
        for t in tasks:
            print('%9.0f MB  cost %.3g  %s' % (planned[key_of(t)][0], planned[key_of(t)][1], key_of(t)))
        print(len(tasks), 'tasks')
        return
    done = set()
    if os.path.exists(out):
        for line in open(out):
            try:
                r = json.loads(line)
            except ValueError:
                continue                                   # torn last line from an interrupted run
            if a.retry_unresolved and (r.get('result') or {}).get('verdict') == 'UNRESOLVED':
                done.discard(r['key'])
            elif r['status'] in ('OK', 'NOT_FORMULABLE', 'SKIPPED_PLAN') or not a.retry_failed:
                done.add(r['key'])
    todo = [t for t in tasks if key_of(t) not in done]
    print('[sweep] tier=%s tasks=%d done=%d todo=%d workers=%d task_cap=%.1f GB task_limit=%.0f s out=%s'
          % (a.tier, len(tasks), len(tasks) - len(todo), len(todo), W, cap, tmax, out), flush=True)
    ctxm = mp.get_context('fork' if sys.platform.startswith('linux') else 'spawn')
    fout = open(out, 'a')
    running = []                                            # (proc, conn, task, t0, peak, planned_mb)

    def record(t, status, res, secs, peak, pmb):
        fout.write(json.dumps(dict(key=key_of(t), task=t, status=status, result=res, seconds=round(secs, 3),
                                   peak_rss_mb=round(peak, 1), planned_mb=round(pmb, 1))) + '\n')
        fout.flush()
        os.fsync(fout.fileno())
        print('[done] %-14s %-10s %8.1fs %7.0f MB  %s' % (status, (res or {}).get('verdict', ''), secs, peak,
                                                         key_of(t)), flush=True)

    qi = 0
    while qi < len(todo) or running:
        while qi < len(todo) and len(running) < W:
            t = todo[qi]
            pmb = planned[key_of(t)][0]
            if pmb > cap * 1000:
                print('[plan] %.0f MB planned > task cap: skipped  %s' % (pmb, key_of(t)), flush=True)
                record(t, 'SKIPPED_PLAN', {'why': 'planned memory above RH_TASK_GB'}, 0.0, 0.0, pmb)
                qi += 1
                continue
            if running and sum(r[5] for r in running) + pmb > total_cap:
                break                                       # wait for memory head-room
            print('[plan] %.0f MB planned  %s' % (pmb, key_of(t)), flush=True)
            pc, cc = ctxm.Pipe(duplex=False)
            p = ctxm.Process(target=child, args=(t, cc, cap), daemon=True)
            p.start()
            cc.close()
            running.append([p, pc, t, time.time(), 0.0, pmb])
            qi += 1
        time.sleep(0.2 if len(todo) < 50 else 0.5)
        for r in list(running):
            p, pc, t, t0, peak, pmb = r
            r[4] = peak = max(peak, rss_mb(p.pid))
            el = time.time() - t0
            if pc.poll():
                try:
                    status, res, secs = pc.recv()
                except EOFError:
                    status, res, secs = 'ERROR', {'why': 'child died without a result (exit %r)' % p.exitcode}, el
                p.join(5)
                record(t, status, res, secs or el, peak, pmb)
                running.remove(r)
            elif not p.is_alive():
                record(t, 'ERROR', {'why': 'child exited with code %r and no result' % p.exitcode}, el, peak, pmb)
                running.remove(r)
            elif peak > min(cap * 1000, max(1500.0, 1.25 * pmb)) or el > tmax:
                p.kill()
                p.join(5)
                record(t, 'KILLED_TIME' if el > tmax else 'KILLED_MEM',
                       {'why': 'resident %.0f MB, elapsed %.0f s' % (peak, el)}, el, peak, pmb)
                running.remove(r)
    print('[sweep] finished', flush=True)


if __name__ == '__main__':
    main()
