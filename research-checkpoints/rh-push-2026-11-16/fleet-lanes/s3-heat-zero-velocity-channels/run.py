"""Driver: per-zero analysis (chan.analyse_zero) over a zero list, in parallel.
Usage: run.py CODE LIST.npz LO HI MODE OUT.jsonl [stride [offset]]   (tasks sorted by height; tasks[offset::stride])
MODE: full  (all zeros in [LO, HI): combinations 1-4, jets of length 100, 512 bits)
      off   (off-line zeros only, combinations 1 and 3, jets of length 4, 192 bits)
      kap   (on-line zeros only, combination 3 only, jets of length 4, 192 bits)"""
import sys, os, json, math, time, numpy as np
from multiprocessing import Pool
code, lst, LO, HI, mode, outp = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5], sys.argv[6]
stride = int(sys.argv[7]) if len(sys.argv) > 7 else 1
offset = int(sys.argv[8]) if len(sys.argv) > 8 else 0
NW = int(os.environ.get('RH_WORKERS', '4'))
d = np.load(lst); on = np.sort(d['on']); offx = d['offx']; offg = d['offg']
o = np.argsort(offg); offx = offx[o]; offg = offg[o]

def near_on(k):
    gm = []
    if k > 0: gm.append(on[k] - on[k - 1])
    if k < len(on) - 1: gm.append(on[k + 1] - on[k])
    g = min(gm) if gm else 1e9
    if len(offg):
        i = np.searchsorted(offg, on[k]); sl = slice(max(0, i - 4), i + 4)
        if len(offg[sl]): g = min(g, float(np.sqrt(offx[sl] ** 2 + (offg[sl] - on[k]) ** 2).min()))
    a, b = max(0, k - 2), min(len(on) - 1, k + 2)
    gbar = (on[b] - on[a]) / max(1, b - a)
    return g, gbar

def near_off(j):
    g = 2 * offx[j]
    if len(on):
        i = np.searchsorted(on, offg[j]); sl = slice(max(0, i - 3), i + 3)
        if len(on[sl]): g = min(g, float(np.sqrt(offx[j] ** 2 + (on[sl] - offg[j]) ** 2).min()))
    for jj in range(max(0, j - 3), min(len(offg), j + 4)):
        if jj != j:
            dg = offg[jj] - offg[j]
            g = min(g, math.hypot(offx[jj] - offx[j], dg), math.hypot(offx[jj] + offx[j], dg))
    return g

tasks = []
if mode in ('full', 'kap'):
    for k in range(len(on)):
        if LO <= on[k] < HI:
            g, gbar = near_on(k); tasks.append(('on', k, 0.0, float(on[k]), g, gbar))
if mode in ('full', 'off'):
    for j in range(len(offg)):
        if LO <= offg[j] < HI: tasks.append(('off', j, float(offx[j]), float(offg[j]), near_off(j), 0.0))
tasks.sort(key=lambda t: t[3]); tasks = tasks[offset::stride]
done = set()
if os.path.exists(outp):                      # resume: keep finished records
    keep = []
    for l in open(outp):
        try: r = json.loads(l)
        except Exception: continue
        if 'error' not in r: done.add((r['kind'], r['idx'])); keep.append(l if l.endswith('\n') else l + '\n')
    open(outp, 'w').writelines(keep)
tasks = [t for t in tasks if (t[0], t[1]) not in done]

PB = None
def init():
    global PB, C
    import chan as C
    from flint import ctx
    if mode == 'full':
        C.setprec(512, 400); PB = C.Pbound(code)
    else: C.setprec(192, 60)

def work(t):
    from flint import acb
    kind, idx, x, gam, g, gbar = t
    try:
        if mode == 'full':
            o = C.analyse_zero(code, acb(0.5 + x, gam), kind == 'on', g, n=100, pb=PB, vcap=3.0 * gbar * gbar if gbar else None)
            if kind == 'on':
                o['gbar'] = gbar
                vc = o.get('v_coll')
                if idx % 10 == 0 or (vc is not None and vc > 1.2 * gbar * gbar):
                    o2 = C.analyse_zero(code, acb(0.5 + x, gam), True, g, n=76, do_c2=False, vcap=3.0 * gbar * gbar)
                    o['trunc'] = [o2.get('v_coll'), o2.get('v_exit_0.7')]
        elif mode == 'off':
            o = C.analyse_zero(code, acb(0.5 + x, gam), False, g, n=4, do_c2=False, do_c4=False)
        else:
            o = C.analyse_zero(code, acb(0.5, gam), True, g, n=4, do_c2=False, do_c4=False); o['gbar'] = gbar
        o['idx'] = idx; o['kind'] = kind
        return o
    except Exception as e:
        return {'idx': idx, 'kind': kind, 'im': gam, 'x': x, 'error': repr(e)}

if __name__ == '__main__':
    t0 = time.time(); print('%s %s tasks %d workers %d' % (code, mode, len(tasks), NW), flush=True)
    with Pool(NW, initializer=init) as p, open(outp, 'a') as fo:
        for i, o in enumerate(p.imap_unordered(work, tasks, chunksize=4)):
            fo.write(json.dumps(o) + '\n')
            if i % 200 == 0: fo.flush(); print('  %d/%d %.0fs' % (i, len(tasks), time.time() - t0), flush=True)
    print('DONE %s %s %d tasks %.0fs' % (code, mode, len(tasks), time.time() - t0), flush=True)
