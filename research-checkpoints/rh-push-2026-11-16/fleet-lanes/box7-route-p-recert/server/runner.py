#!/usr/bin/env python3
"""runner.py: unattended queue for the independent re-certification of the 36 incomplete route-P floors.
Conditional on the route-P ledger; internal; not a theorem.

For each floor (order: smallest campaign slack margin/target first) it runs the independent driver tmp/r7-ref-par-cert.py
(byte-identical to the b-route-p-recert lane's driver) as a child process with --resume, threshold = max box bound of the campaign
certificate (so a COMPLETE referee certificate means referee margin <= campaign margin exactly).  The driver checkpoints its box tree
to run/rckpt_<idx>.json every 300 s; this runner adds: rounds with cumulative per-floor wall budgets, a total active-time limit,
a memory guard on the unit's cgroup, a hang watchdog, exact checks of every certificate written (dyadic tiling, finiteness, exact
rational margins), an append-only results file run/results.jsonl, the consumer values run/values.json, and run/status.txt.
All state is on disk: starting the runner again continues where the files say.
usage (inside the rhrun unit): python -u runner.py"""
import os, sys, json, time, math, signal, subprocess, hashlib, fcntl
from fractions import Fraction as F
B = os.path.dirname(os.path.abspath(__file__)); RUN = B + '/run'; LOGS = B + '/logs'
os.makedirs(RUN, exist_ok=True); os.makedirs(LOGS, exist_ok=True)
LABEL = 'conditional on the route-P ledger; internal; not a theorem'
F36 = {int(k): v for k, v in json.load(open(B + '/floors36.json')).items()}
ORDER = sorted(F36, key=lambda i: F36[i]['ratio'])
NGRID = (9, 13, 11)


def cfg():
    return json.load(open(B + '/config.json'))


def now(): return time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())


def log(*a):
    print(now(), *a, flush=True)


def jdump(o, fn):
    with open(fn + '.tmp', 'w') as f: json.dump(o, f, indent=1); f.flush(); os.fsync(f.fileno())
    os.replace(fn + '.tmp', fn)


def append_result(r):
    with open(RUN + '/results.jsonl', 'a') as f: f.write(json.dumps(r) + '\n'); f.flush(); os.fsync(f.fileno())


def results():
    L = {}; errs = {}
    fn = RUN + '/results.jsonl'
    if os.path.exists(fn):
        for ln in open(fn):
            ln = ln.strip()
            if not ln: continue
            r = json.loads(ln)
            if r.get('kind') == 'floor': L[r['idx']] = r
            elif r.get('kind') == 'error': errs[r['idx']] = errs.get(r['idx'], 0) + 1
    return L, errs


# ---------------------------------------------------------------- memory (cgroup v2 of this unit)
def cgdir():
    try:
        p = [l.strip().split('::', 1)[1] for l in open('/proc/self/cgroup') if l.startswith('0::')][0]
        d = '/sys/fs/cgroup' + p
        return d if os.path.exists(d + '/memory.current') else None
    except Exception: return None


CG = cgdir()


def mem_gb():
    """(total charged, anonymous) GB of the unit, or (None, None)"""
    if not CG: return None, None
    try:
        cur = int(open(CG + '/memory.current').read()) / 2 ** 30; anon = None
        for l in open(CG + '/memory.stat'):
            if l.startswith('anon '): anon = int(l.split()[1]) / 2 ** 30
        return cur, anon
    except Exception: return None, None


# ---------------------------------------------------------------- certificate checks (logic of check_rcert.py, exact)
def check_cert(r, idx):
    Bx = r['boxes']; S = {tuple(b[:6]) for b in Bx}; f36 = F36[idx]
    fin = all(isinstance(b[6], float) and math.isfinite(b[6]) for b in Bx) and len(Bx) > 0
    vol = sum(F(1, 2 ** (b[0] + b[1] + b[2])) for b in Bx); anc = 0
    for b in S:
        k = b[:3]; i = b[3:]
        for a0 in range(k[0] + 1):
            for a1 in range(k[1] + 1):
                for a2 in range(k[2] + 1):
                    if (a0, a1, a2) == tuple(k): continue
                    if (a0, a1, a2, i[0] >> (k[0] - a0), i[1] >> (k[1] - a1), i[2] >> (k[2] - a2)) in S: anc += 1
    inr = all(0 <= b[3] < NGRID[0] * 2 ** b[0] and 0 <= b[4] < NGRID[1] * 2 ** b[1] and 0 <= b[5] < NGRID[2] * 2 ** b[2] for b in Bx)
    tiling = bool(len(S) == len(Bx) and vol == NGRID[0] * NGRID[1] * NGRID[2] and anc == 0 and inr)
    k0ok = r['K0star'] == f36['K0star'] and r['thr'] == f36['U'] and r['idx'] == idx
    out = dict(tiling_exact=tiling, finite=bool(fin), K0_thr_equal=bool(k0ok), boxes=len(Bx), nopen=r['nopen'], complete=bool(r['complete']),
               exc=r['cnt']['exc'], inf=r['cnt']['inf'], ninit_unevaluated=r['ninit_unevaluated'])
    valid = tiling and fin and k0ok and r['ninit_unevaluated'] == 0
    if fin:
        U = max(b[6] for b in Bx); assert U == r['U'] or not valid
        mref = F(U) - F(r['K0star']); mc = F(f36['U']) - F(f36['K0star'])
        out.update(U_ref=U, margin_ref_exact=str(mref), margin_ref=float(mref), margin_campaign_exact=str(mc), margin_campaign=f36['margin'],
                   ref_le_campaign=bool(F(U) <= F(f36['U'])), ratio_ref_over_campaign=float(mref / mc), target=f36['target'])
        # accepted (non-open) boxes must be at or below thr; open boxes above
        okacc = all((b[6] <= r['thr']) == (b[7] != 'open') for b in Bx); out['accept_flags_consistent'] = bool(okacc); valid = valid and okacc
    out['valid_certificate'] = bool(valid)
    if valid and r['complete'] and out['ref_le_campaign'] and r['nopen'] == 0: out['status'] = 'confirmed'
    elif valid: out['status'] = 'certified_weaker_' + (r['stop'] or 'stopped')
    else: out['status'] = 'invalid'
    return out


# ---------------------------------------------------------------- state / status
ST = dict(active_secs=0.0, launches=0, first_start=None, nw=None, events=[])
if os.path.exists(RUN + '/state.json'): ST.update(json.load(open(RUN + '/state.json')))
CUR = dict(idx=None, round=None, budget=None, start=None, restarts=0, line='', peak_mem=0.0)
STOP = dict(flag=False)


def ckpt_info(idx):
    fn = RUN + '/rckpt_%d.json' % idx
    if not os.path.exists(fn): return None
    try:
        S = json.load(open(fn)); return dict(secs=S['secs'], cpu=S['cpu'], done=len(S['done']), open=len(S['heap']), init=len(S['init']), mtime=os.path.getmtime(fn))
    except Exception: return None


def last_progress(idx):
    fn = LOGS + '/floor_%d.log' % idx
    try:
        with open(fn, 'rb') as f:
            f.seek(0, 2); n = f.tell(); f.seek(max(0, n - 4000)); L = f.read().decode('utf8', 'replace').strip().split('\n')
        for l in reversed(L):
            if ' done, ' in l and ' top ' in l: return l.strip()
        return L[-1].strip() if L else ''
    except Exception: return ''


def write_status(note=''):
    C = cfg(); L, errs = results(); cur, anon = mem_gb(); lines = []
    lines.append('box7-route-p-recert: independent re-certification of the 36 incomplete route-P floors')
    lines.append('LABEL: ' + LABEL)
    lines.append('status written %s   %s' % (now(), note))
    lines.append('active time used %.2f h of %.0f h limit   launches %d   workers %s   unit memory %s GB (anon %s GB, peak seen %.1f GB) of %d GB' % (
        ST['active_secs'] / 3600, C['total_active_limit_s'] / 3600, ST['launches'], ST['nw'],
        '%.1f' % cur if cur is not None else '?', '%.1f' % anon if anon is not None else '?', ST.get('peak_mem_gb', 0.0), C['unit_mem_gb']))
    conf = [i for i in ORDER if i in L and L[i]['status'] == 'confirmed']
    weak = [i for i in ORDER if i in L and L[i]['status'].startswith('certified_weaker')]
    inv = [i for i in ORDER if i in L and L[i]['status'] == 'invalid']
    rest = [i for i in ORDER if i not in L]
    lines.append('floors: %d CONFIRMED at campaign margin, %d certified at a WEAKER margin (budget-stopped, may be continued), %d invalid, %d without any independent certificate, in progress: %s' % (
        len(conf), len(weak), len(inv), len(rest), CUR['idx']))
    if CUR['idx'] is not None:
        ci = ckpt_info(CUR['idx'])
        lines.append('in progress: floor %d (cell %d) round %s cumulative budget %s s, driver restarts %d' % (CUR['idx'], F36[CUR['idx']]['cell'], CUR['round'], CUR['budget'], CUR['restarts']))
        lines.append('  last driver line: ' + last_progress(CUR['idx']))
        lines.append('  ("top" = current referee margin over all boxes; campaign margin %.12f)' % F36[CUR['idx']]['margin'])
        if ci: lines.append('  checkpoint: %d accepted, %d open, %.0f s cumulative wall, %.0f s cpu, written %.0f s ago' % (ci['done'], ci['open'], ci['secs'], ci['cpu'], time.time() - ci['mtime']))
    lines.append('')
    lines.append('%4s %5s %-28s %14s %14s %8s %7s %9s %9s' % ('idx', 'cell', 'status', 'margin_ref', 'margin_camp', 'ref/camp', 'open', 'wall_s', 'cpu_h'))
    for i in ORDER:
        f = F36[i]
        if i in L:
            r = L[i]
            lines.append('%4d %5d %-28s %14.12f %14.12f %8.5f %7d %9.0f %9.1f' % (i, f['cell'], r['status'] + ('*' if i == CUR['idx'] else ''), r.get('margin_ref', float('nan')),
                         f['margin'], r.get('ratio_ref_over_campaign', float('nan')), r['nopen'], r['secs'], r['cpu'] / 3600))
        else:
            lines.append('%4d %5d %-28s %14s %14.12f %8s %7s %9s %9s' % (i, f['cell'], 'running' if i == CUR['idx'] else ('pending (errors %d)' % errs[i] if i in errs else 'pending'), '-', f['margin'], '-', '-', '-', '-'))
    lines.append('')
    try:
        V = json.load(open(RUN + '/values.json')); m = V['_meta']
        lines.append('route-P consumer values (exact rationals; computed %s; %d floors with an independent certificate, %d of them confirmed at campaign margin):' % (m['time'], len(m['certified']), len(m['confirmed_at_campaign_margin'])))
        for k, d in (('base', 'collect7 as recorded (all 36 at campaign margins)'), ('mixed', 'certified floors at the weaker of the two margins + uncertified floors at campaign margins'),
                     ('indep_only', 'certified floors at the weaker margin, uncertified floors EXCLUDED'), ('strict', 'only floors confirmed at campaign margin kept, rest of the 36 excluded'),
                     ('drop36', 'all 36 excluded')):
            v = V[k]; lines.append('  %-10s %s = %s   %s 0.145   [%s]' % (k, v['U'], v['dec'], '<' if v['below_0145'] else '>=', d))
    except Exception as ex:
        lines.append('route-P consumer values: not computed yet (%s)' % type(ex).__name__)
    lines.append('')
    lines.append('confirmation criterion: all 36 floors CONFIRMED (then mixed = indep_only = strict = base = 0.144997328111268), or indep_only < 0.145.')
    for e in ST['events'][-8:]: lines.append('event: ' + e)
    with open(RUN + '/status.txt.tmp', 'w') as f: f.write('\n'.join(lines) + '\n')
    os.replace(RUN + '/status.txt.tmp', RUN + '/status.txt')


def event(s):
    ST['events'] = (ST['events'] + ['%s %s' % (now(), s)])[-200:]; log('EVENT', s)


def save_state(): jdump(ST, RUN + '/state.json')


# ---------------------------------------------------------------- child control
def killgroup(p):
    try: os.killpg(p.pid, signal.SIGTERM)
    except ProcessLookupError: pass
    t = time.time()
    while p.poll() is None and time.time() - t < 20: time.sleep(0.5)
    try: os.killpg(p.pid, signal.SIGKILL)
    except ProcessLookupError: pass
    try: p.wait(timeout=30)
    except Exception: pass


def on_term(sig, frm): STOP['flag'] = True


def consume():
    try:
        p = subprocess.run([sys.executable, '-B', B + '/consume.py'], capture_output=True, text=True, timeout=3600)
        log('consume rc', p.returncode, p.stdout.strip().split('\n')[-1] if p.stdout.strip() else p.stderr[-400:])
        if p.returncode: event('consumer failed rc %d: %s' % (p.returncode, p.stderr[-200:].replace('\n', ' ')))
    except Exception as ex: event('consumer exception %r' % (ex,))


def run_floor(idx, rnd, budget):
    """runs the driver on one floor up to cumulative wall `budget`; returns 'done' | 'error' | 'stopped'"""
    C = cfg(); f = F36[idx]; ck0 = ckpt_info(idx); s0 = ck0['secs'] if ck0 else 0.0
    CUR.update(idx=idx, round=rnd, budget=int(budget), start=time.time(), restarts=0)
    env = dict(os.environ, RTMP=B + '/tmp', OMP_NUM_THREADS='1', OPENBLAS_NUM_THREADS='1', MKL_NUM_THREADS='1', PYTHONDONTWRITEBYTECODE='1')
    fo = RUN + '/rcert_%d.json' % idx; lf = LOGS + '/floor_%d.log' % idx
    while True:
        cmd = [sys.executable, '-u', B + '/tmp/r7-ref-par-cert.py', RUN, str(idx), '--thr', repr(f['U']), '--budget', '%d' % budget, '--nw', str(ST['nw']), '--resume']
        t_inv = time.time(); ck = ckpt_info(idx); sinv = ck['secs'] if ck else 0.0
        with open(lf, 'a') as lg:
            lg.write('=== %s runner: round %d budget %d nw %d cmd %s\n' % (now(), rnd, budget, ST['nw'], ' '.join(cmd))); lg.flush()
            p = subprocess.Popen(cmd, stdout=lg, stderr=subprocess.STDOUT, env=env, cwd=B, start_new_session=True)
        log('floor %d round %d: driver pid %d, budget %d (cumulative before: %.0f s), nw %d' % (idx, rnd, p.pid, budget, sinv, ST['nw']))
        last = time.time(); laststat = 0.0; why = None
        while True:
            rc = p.poll()
            t = time.time(); ST['active_secs'] += t - last; last = t
            cur, anon = mem_gb()
            if cur is not None: ST['peak_mem_gb'] = max(ST.get('peak_mem_gb', 0.0), cur)
            if rc is not None: break
            if STOP['flag']:
                killgroup(p); save_state(); write_status('STOPPED by signal; relaunch with launch.sh to resume'); return 'stopped'
            if anon is not None and anon > C['mem_guard_gb']: why = 'memory guard: anon %.1f GB > %.1f GB' % (anon, C['mem_guard_gb'])
            elif t - max(os.path.getmtime(lf), t_inv) > C['hang_log_stale_s']: why = 'no driver output for %d s' % C['hang_log_stale_s']
            elif t - t_inv > max(budget - sinv, 0) + C['overrun_grace_s']: why = 'driver overran its budget by %d s' % C['overrun_grace_s']
            if why: break
            if t - laststat > C['status_every_s']:
                laststat = t; save_state(); write_status('RUNNING')
                log('   floor %d mem %s anon %s | %s' % (idx, '%.1f' % cur if cur is not None else '?', '%.1f' % anon if anon is not None else '?', last_progress(idx)[:160]))
            time.sleep(15)
        if STOP['flag']:
            killgroup(p); save_state(); write_status('STOPPED by signal; relaunch with launch.sh to resume'); return 'stopped'
        if why:
            killgroup(p); CUR['restarts'] += 1
            if why.startswith('memory'): ST['nw'] = max(4, ST['nw'] - 2); ST['nw_cap'] = ST['nw']
            event('floor %d: %s -> driver killed, restart %d from checkpoint with nw %d' % (idx, why, CUR['restarts'], ST['nw'])); save_state()
            if CUR['restarts'] > C['max_restarts_per_run']:
                append_result(dict(kind='error', idx=idx, time=now(), round=rnd, why='too many restarts: ' + why)); return 'error'
            continue
        if rc != 0 or not os.path.exists(fo) or os.path.getmtime(fo) < t_inv:
            CUR['restarts'] += 1; tail = last_progress(idx)
            event('floor %d: driver exit code %s without certificate (restart %d): %s' % (idx, rc, CUR['restarts'], tail[:200])); save_state()
            if CUR['restarts'] > C['max_restarts_per_run']:
                append_result(dict(kind='error', idx=idx, time=now(), round=rnd, why='driver exit %s' % rc, tail=tail[:500])); return 'error'
            time.sleep(10); continue
        break
    r = json.load(open(fo)); c = check_cert(r, idx)
    rec = dict(kind='floor', idx=idx, cell=f['cell'], key=f['key'], time=now(), round=rnd, budget=int(budget), stop=r['stop'], K0star=r['K0star'], thr=r['thr'],
               secs=r['secs'], cpu=r['cpu'], nw=r['nw'], cnt=r['cnt'], win=r['win'], secs_this_run=r['secs'] - s0, restarts=CUR['restarts'],
               rcert_sha256=hashlib.sha256(open(fo, 'rb').read()).hexdigest(), label=LABEL)
    rec.update(c); append_result(rec)
    event('floor %d (cell %d) round %d: %s, margin_ref %s vs campaign %.12f (ratio %s), open %d, %.0f s wall, %.1f cpu-h' % (
        idx, f['cell'], rnd, c['status'], '%.12f' % c['margin_ref'] if 'margin_ref' in c else 'n/a', f['margin'],
        '%.5f' % c['ratio_ref_over_campaign'] if 'margin_ref' in c else 'n/a', r['nopen'], r['secs'], r['cpu'] / 3600))
    save_state(); consume(); write_status('RUNNING')
    return 'done'


def plan_workers(C):
    nw = min(C['max_workers'], int(os.environ.get('RH_WORKERS', C['max_workers'])))
    try:
        per = C.get('per_worker_gb_live') or json.load(open(RUN + '/preflight.json'))['max_rss_gb']
        nw = min(nw, int((C['unit_mem_gb'] * C['mem_plan_frac'] - per) / per))     # parent + nw workers, each at most `per`
    except Exception: per = None
    if ST.get('nw_cap'): nw = min(nw, ST['nw_cap'])                                    # keep a reduction made by the memory guard
    return max(4, nw), per


def main():
    lk = open(RUN + '/lock', 'w')
    try: fcntl.flock(lk, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError: print('another runner holds run/lock; exiting'); sys.exit(3)
    signal.signal(signal.SIGTERM, on_term); signal.signal(signal.SIGINT, on_term)
    C = cfg(); ST['launches'] += 1
    if not ST['first_start']: ST['first_start'] = now()
    ST['nw'], per = plan_workers(C)
    event('runner start (launch %d): workers %d (per-process RSS measured %s GB, unit %d GB), cgroup %s' % (ST['launches'], ST['nw'], per, C['unit_mem_gb'], CG))
    save_state()
    if not os.path.exists(RUN + '/values.json'): consume()
    write_status('STARTING'); rnd = 0
    while not STOP['flag']:
        C = cfg(); rnd += 1; level = C['round1_budget_s'] + (rnd - 1) * C['round_increment_s']; L, errs = results(); ran = False
        todo = [i for i in ORDER if not (i in L and (L[i]['status'] == 'confirmed' or L[i].get('stop') == 'maxlevel')) and errs.get(i, 0) < C['max_errors_per_floor']]
        if not todo: event('queue finished: no floor left to run'); break
        if rnd > 400: event('round limit'); break
        for i in todo:
            if STOP['flag']: break
            remaining = C['total_active_limit_s'] - ST['active_secs']
            if remaining < 600: break
            ck = ckpt_info(i); used = max(ck['secs'] if ck else 0.0, L[i]['secs'] if i in L else 0.0)
            if used >= level - 120: continue
            budget = min(level, used + remaining - 300); ran = True
            res = run_floor(i, rnd, budget)
            if res == 'stopped': return
        if C['total_active_limit_s'] - ST['active_secs'] < 600: event('total active-time limit reached'); break
        if not ran: continue
    CUR.update(idx=None); save_state(); consume(); write_status('STOPPED by signal' if STOP['flag'] else 'FINISHED (queue ended; unit exits)')
    log('runner exit')


if __name__ == '__main__':
    main()
