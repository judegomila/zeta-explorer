#!/usr/bin/env python3
"""GPU/float64 screen driver.  python screen_run.py <plan> <out.jsonl>   (resumable: finished keys are skipped).
Each line: {key, task, res}.  Float64 only: a screen, never a verdict."""
import json, os, sys, time
import fscreen as S

NS = list(range(1, 31)) + [40, 50, 75, 100, 150, 200, 300, 500, 1000, 2000, 5000]
PS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 37, 47, 59, 71, 83, 97, 127, 199, 293, 397, 499, 997, 1999, 4999, 9973]
WS = ['sharp', 'riesz1', 'riesz2', 'riesz3', 'riesz4', 'lin1', 'lin2', 'cos', 'gaus4', 'selb']
AFE_IN = ['zeta', 'chi4', 'dh', 'tw2m', 'tw2h', 'tw3m', 'liou', 'ea:0.25', 'ea:0.05']
EUL_IN = ['zeta', 'tw2m', 'tw2h', 'tw3m', 'liou', 'ea:0.25', 'ea:0.05']


def plan(name):
    G = []
    if name == 'smoke':
        for inp in ('zeta', 'dh'):
            for w in ('sharp', 'riesz2'):
                for N in (1, 2, 5, 20):
                    G.append(dict(scheme='afe', input=inp, size=N, weight=w, T1=120, Y=0.5))
        G.append(dict(scheme='euler', input='zeta', size=13, weight='sharp', T1=120, Y=0.45))
    elif name.startswith('main'):
        T1 = int(name[4:] or 2000)
        for Y in (0.49, None):
            for N in NS:
                for w in WS:
                    for inp in AFE_IN:
                        if w != 'sharp' and N < 2:
                            continue
                        G.append(dict(scheme='afe', input=inp, size=N, weight=w, T1=T1, Y=Y))
        for P in PS:
            for inp in EUL_IN:
                G.append(dict(scheme='euler', input=inp, size=P, weight='sharp', T1=T1, Y=0.45))
    elif name == 'stage2':
        for N in NS:
            for w in ['sharp', 'riesz1', 'riesz2', 'riesz3', 'riesz4', 'riesz6', 'riesz8']:
                for inp in ['zeta', 'tw2m', 'tw2h', 'tw3m', 'ea:0.25', 'ea:0.05']:
                    if w != 'sharp' and N < 2:
                        continue
                    G.append(dict(scheme='afep', input=inp, size=N, weight=w, T1=2000))
        for N in NS + [10000, 20000]:
            for w in ['riesz6', 'riesz8']:
                for inp in ['chi4', 'dh']:
                    if N >= 2:
                        G.append(dict(scheme='afe', input=inp, size=N, weight=w, T1=2000, Y=0.49))
        for N in [10000, 20000]:
            for w in ['riesz1', 'riesz2', 'riesz3', 'riesz4']:
                for inp in ['chi4', 'dh']:
                    G.append(dict(scheme='afe', input=inp, size=N, weight=w, T1=2000, Y=0.49))
    elif name == 'stage3':                                   # large height for the schemes that survive
        for T1 in (20000, 100000):
            for N in [2, 3, 5, 10, 20, 30, 50, 100, 200, 500, 1000, 2000, 5000, 10000]:
                for w in ['riesz1', 'riesz2']:
                    G.append(dict(scheme='afep', input='zeta', size=N, weight=w, T1=T1))
                    for inp in ['chi4', 'dh']:
                        G.append(dict(scheme='afe', input=inp, size=N, weight=w, T1=T1, Y=0.49))
                    for inp in ['tw2m', 'ea:0.05']:
                        if T1 == 20000:
                            G.append(dict(scheme='afep', input=inp, size=N, weight=w, T1=T1))
    elif name == 'stage4':
        # (a) fractional Riesz orders between sharp (order 0) and order 1, pole-corrected zeta and DH/chi4
        for w in ['riesz0.1', 'riesz0.25', 'riesz0.5', 'riesz0.75', 'riesz1.5']:
            for N in NS:
                if N < 2:
                    continue
                G.append(dict(scheme='afep', input='zeta', size=N, weight=w, T1=2000))
                for inp in ['chi4', 'dh']:
                    G.append(dict(scheme='afe', input=inp, size=N, weight=w, T1=2000, Y=0.49))
        # (b) DH threshold in N
        for N in list(range(31, 40)):
            G.append(dict(scheme='afe', input='dh', size=N, weight='riesz1', T1=2000, Y=0.49))
        for N in list(range(550, 1000, 50)):
            G.append(dict(scheme='afe', input='dh', size=N, weight='riesz2', T1=2000, Y=0.49))
        for N in [6000, 7000, 8000, 9000, 30000, 50000]:
            G.append(dict(scheme='afe', input='dh', size=N, weight='riesz3', T1=2000, Y=0.49))
        for N in [30000, 50000, 100000]:
            G.append(dict(scheme='afe', input='dh', size=N, weight='riesz4', T1=400, Y=0.49))
        # (c) every N from 2 to 400 at T = 20000 for the surviving scheme
        for w in ['riesz1', 'riesz2']:
            for N in range(2, 401):
                G.append(dict(scheme='afep', input='zeta', size=N, weight=w, T1=20000))
        for w in ['riesz1', 'riesz2']:
            for N in range(2, 401):
                G.append(dict(scheme='afe', input='chi4', size=N, weight=w, T1=20000, Y=0.49))
                G.append(dict(scheme='afe', input='dh', size=N, weight=w, T1=20000, Y=0.49))
    elif name == 'stage5':                                   # zeta itself at large height, N past the torus threshold
        for k in range(0, 10):
            for N in [31, 32, 35, 40, 50, 60, 75, 100, 150, 200, 20, 30]:
                for w in ['riesz1']:
                    G.append(dict(scheme='afep', input='zeta', size=N, weight=w, T0=k * 1000000 + 0.63, T1=(k + 1) * 1000000))
        for k in range(0, 4):
            for N in [50, 100, 200, 400]:
                G.append(dict(scheme='afep', input='zeta', size=N, weight='riesz2', T0=k * 1000000 + 0.63, T1=(k + 1) * 1000000))
                G.append(dict(scheme='afe', input='chi4', size=N, weight='riesz1', T0=k * 1000000 + 0.63, T1=(k + 1) * 1000000, Y=0.49))
    elif name == 'stage6':                                   # smallest failing stage for zeta (torus threshold N* = 27)
        for k in range(0, 30):
            for N in [33, 34, 31, 32, 30, 29, 28, 27, 26]:
                if k < 3 and N in (30, 31, 32):
                    continue                                 # done in stage5
                G.append(dict(scheme='afep', input='zeta', size=N, weight='riesz1', T0=k * 1000000 + 0.63, T1=(k + 1) * 1000000))
            if k < 6:
                for N in [300, 500, 1000]:
                    G.append(dict(scheme='afep', input='zeta', size=N, weight='riesz2', T0=k * 1000000 + 0.63, T1=(k + 1) * 1000000))
    elif os.path.exists(name):                               # a JSON-lines file of tasks
        G = [json.loads(l) for l in open(name) if l.strip()]
    else:
        raise SystemExit('unknown plan ' + name)
    return G


def main():
    name, out = sys.argv[1], sys.argv[2]
    tasks = plan(name)
    done = set()
    if os.path.exists(out):
        for l in open(out):
            try:
                done.add(json.loads(l)['key'])
            except ValueError:
                pass
    print('[screen_run] plan=%s tasks=%d done=%d gpu=%s' % (name, len(tasks), len(done), S.GPU), flush=True)
    f = open(out, 'a')
    t00 = time.time()
    for i, t in enumerate(tasks):
        key = json.dumps(t, sort_keys=True, separators=(',', ':'))
        if key in done:
            continue
        try:
            o = S.Obj(t['scheme'], t['input'], t['size'], t.get('weight', 'sharp'))
            Y = t.get('Y') or S.ymax(t['scheme'], t['input'])
            Y = min(Y, S.ymax(t['scheme'], t['input']))
            res = S.screen(o, t.get('T0', -0.37), t['T1'] + 0.63, B=t.get('B', 1.0), hx=t.get('hx', 0.004),
                           eta=t.get('eta', 0.02), Y=Y)
        except Exception as e:                               # noqa
            res = dict(error=repr(e))
        f.write(json.dumps(dict(key=key, task=t, res=res), default=float) + '\n')
        f.flush()
        print('[%d/%d %.0fs] %s -> first_bad=%s n_bad=%s susp=%s  %.1fs' % (
            i + 1, len(tasks), time.time() - t00, key, res.get('first_bad'), res.get('n_bad'), res.get('n_suspect'),
            res.get('seconds', 0)), flush=True)
    print('[screen_run] finished', flush=True)


if __name__ == '__main__':
    main()
