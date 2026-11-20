#!/usr/bin/env python3
"""Arb stage. stat1: y(delta, t) recomputed in ball arithmetic at selected heights; stat2: I(omega) at the probes."""
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from flint import arb, acb, ctx
import sets
from sets import Row, rows_stat1, CUT
ctx.prec = 128
YC, H, A, W = 5.5, 1.5, 4, 100.0
_ROWS = {}

def get_row(args):
    if args['name'] not in _ROWS:
        _ROWS.clear(); _ROWS[args['name']] = Row(**args)
    return _ROWS[args['name']]

def lam_arb(row, pos, lamf):
    if pos < row.nh and row.kind in ('D1', 'D2', 'D4', 'DE', 'CYCP', 'HQ1') and int(row.head_p[pos]) > 0:
        return arb(int(row.head_p[pos])).log()
    return arb(float(lamf))

def task1(a):
    args, js, t, jmax = a
    row = get_row(args)
    js = [j for j in js if j <= jmax]
    dl = [arb(2) ** (-j) for j in js]; dlf = [2.0 ** (-j) for j in js]
    acc = [arb(0) for _ in js]
    ta = arb(float(t)); pi = arb.pi()
    Lm = CUT / dlf[-1]
    CH = 200000
    for a0 in range(0, row.count, CH):
        lam, th = row.chunk(a0, min(a0 + CH, row.count))
        if lam[0] > Lm: break
        for i in range(len(lam)):
            lf = float(lam[i])
            if lf > Lm: break
            la = lam_arb(row, a0 + i, lf)
            if row.phase == '+': half = ta * la / 2
            elif row.phase == 'pi' or (row.phase == 'alt'): 
                half = ta * la / 2
                if row.phase == 'pi' or th[i] != 0.0: half = half - pi / 2
            else: half = (ta * la - arb(float(th[i]))) / 2
            s = half.sin(); s4 = 4 * s * s
            for ji in range(len(js)):
                if lf > CUT / dlf[ji]: continue
                e = (-dl[ji] * la).expm1()
                acc[ji] -= (e * e + (e + 1) * s4).log() / 2
    return args['name'], float(t), [(float(v.mid()), float(v.rad())) for v in acc], js

def beta_ball(js, ys):
    k = min(11, len(js))
    x = [arb(j) * arb(2).log() for j in js[-k:]]
    xm = sum(x, arb(0)) / k
    den = sum(((xi - xm) ** 2 for xi in x), arb(0))
    num = sum(((xi - xm) * arb(m, r) for xi, (m, r) in zip(x, ys[-k:])), arb(0))
    b = num / den
    return float(b.mid()), float(b.rad())

def run1(sel, workers):
    tasks = []; meta = {}
    for args, js, n in rows_stat1():
        name = args['name']
        if sel and not any(name.startswith(s) for s in sel): continue
        if args['kind'] in ('D4', 'DE'): continue
        f = os.path.join('out1', name + '.npz')
        if not os.path.exists(f): continue
        z = np.load(f); beta = z['beta']; t = z['t']; dev = np.abs(beta - np.round(beta))
        if args['kind'] in ('CYC', 'CYCP', 'CYCeps', 'HQ1'):
            cls = z['cls']
            idx = list(np.nonzero(cls == 3)[0][:10]) + list(np.nonzero(cls == 0)[0][:10]) + list(np.nonzero(cls == 1)[0][:10]) + list(np.nonzero(cls == 2)[0][:6])
            idx += [int(np.argmax(dev)), int(np.argmin(beta)), int(np.argmax(beta))]
        else:
            idx = [int(np.argmin(beta)), int(np.argmax(beta)), int(np.argmin(dev)), int(np.argmax(dev))]
        idx = sorted(set(int(i) for i in idx))
        jmax = 6 if args['kind'] == 'D2' else js[-1]
        meta[name] = dict(js=js, y=z['y'], t=t, idx=idx, beta=beta)
        for i in idx: tasks.append((args, js, float(t[i]), jmax))
    tasks.sort(key=lambda a: a[0]['name'])
    print('arb stat1 tasks', len(tasks), flush=True)
    res = {}
    with Pool(workers) as P:
        for name, t, ys, jsu in P.imap_unordered(task1, tasks, chunksize=1):
            M = meta[name]; i = [k for k in M['idx'] if float(M['t'][k]) == t][0]
            yf = M['y'][i][:len(jsu)]
            dmax = max(abs(float(a) - m) for a, (m, r) in zip(yf, ys)); rmax = max(r for m, r in ys)
            b = beta_ball(jsu, ys) if len(jsu) == len(M['js']) else None
            rec = dict(t=t, js=[jsu[0], jsu[-1]], max_abs_float_minus_arb=dmax, max_radius=rmax, beta_float=float(M['beta'][i]), beta_arb=b,
                       y_arb_last=ys[-1])
            res.setdefault(name, []).append(rec)
            print(name, json.dumps(rec), flush=True)
            json.dump(res, open(os.environ.get('ARB_OUT', 'arb_stat1.json'), 'w'), indent=1)

def run2(names):
    out = {}
    for name in names:
        R = json.load(open(os.path.join('out2', name + '.json')))
        from stat2 import rows2
        args = [a for a, v, w in rows2() if a['name'] == name][0]
        V = R['V'][-1]
        kw = dict(args); kw['Lmax'] = 2 * V + W + 1
        row = Row(**kw)
        lam, th = row.chunk(0, row.count)
        for om, re_, im_ in R['probe'][-1]:
            nlo = np.maximum(1, np.ceil((om - W) / lam)).astype(np.int64); nhi = np.floor((om + W) / lam).astype(np.int64)
            tot = acb(0); cnt = 0
            oa = arb(om); yc = arb(YC); h = arb(H)
            for i in np.nonzero(nhi >= nlo)[0]:
                la = lam_arb(row, int(i), lam[i])
                for n in range(int(nlo[i]), int(nhi[i]) + 1):
                    x = la * n; xi = oa - x
                    u = h * xi / A
                    k = h * (u.sinc()) ** A
                    if row.phase in ('pi', 'alt') and (row.phase == 'pi' or th[i] != 0.0):
                        sg = -1 if n % 2 else 1
                        phs = -x * yc
                    elif row.phase == 'rand':
                        sg = 1; phs = arb(float(th[i])) * n - x * yc
                    else:
                        sg = 1; phs = -x * yc
                    tot += sg * la * k * acb(phs.cos(), phs.sin()); cnt += 1
            rec = dict(omega=om, float=[re_, im_], arb_re=[float(tot.real.mid()), float(tot.real.rad())], arb_im=[float(tot.imag.mid()), float(tot.imag.rad())], spikes=cnt)
            rec['abs_diff'] = abs(complex(re_, im_) - complex(rec['arb_re'][0], rec['arb_im'][0]))
            out.setdefault(name, []).append(rec); print(name, json.dumps(rec), flush=True)
    json.dump(out, open(os.environ.get('ARB_OUT2', 'arb_stat2.json'), 'w'), indent=1)

if __name__ == '__main__':
    if sys.argv[1] == 's1':
        run1(sys.argv[3:], int(sys.argv[2]))
    else:
        run2(sys.argv[2:])
    print('DONE', flush=True)
