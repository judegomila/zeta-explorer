#!/usr/bin/env python3
"""Certified (d, n) hyperbolicity map of Jensen polynomials by Sturm chains in Arb.
   python jensen_map.py <input> <dmax> <nmax> <out.jsonl>
For each degree d in the list: scan shifts n = 0, 1, 2, ... (certified count each); stop after 4 consecutive PASS
once past the last FAIL, or at nmax.  One JSON line per d: fails (list of n), first_pass_after_fails, scanned_to."""
import json, math, os, sys, time
import multiprocessing as mp
from flint import ctx
import lylib as L

CS = None
INP = None
NMAX = 0
PREC = 0


def dlist(dmax):
    ds = list(range(2, min(dmax, 64) + 1))
    d = 64
    while d < dmax:
        d = min(dmax, int(d * 1.19) + 1)
        ds.append(d)
    return ds


def work(d):
    ctx.prec = PREC
    t0 = time.time()
    fails, unres, n, run, exhaustive = [], [], 0, 0, True
    step = 1
    budget = float(os.environ.get('RH_D_SECONDS', '1800'))
    while n <= NMAX:
        try:
            cnt, _ = L.sturm_real_roots(L.jensen_coeffs(CS, d, n))
            ok = cnt == d
        except L.Unresolved:
            ok = None
        if ok is None:
            unres.append(n)
            run = 0
        elif ok:
            run += 1
        else:
            fails.append([n, cnt])
            run = 0
        if (fails or unres) and run >= 4:
            break
        if not fails and not unres and time.time() - t0 > budget:
            break
        n += step
    return dict(input=INP, d=d, fails=fails[:6] + fails[-3:] if len(fails) > 9 else fails, n_fails=len(fails),
                unresolved=unres[:10], scanned_to=min(n, NMAX), all_pass=(not fails and not unres),
                last_fail=(fails[-1][0] if fails else None), seconds=round(time.time() - t0, 1), prec=PREC)


def main():
    global CS, INP, NMAX, PREC
    INP, dmax, NMAX, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    K = dmax + NMAX + 6
    PREC = int(math.lgamma(2 * K + 3) / math.log(2)) + 40 * dmax + 512
    ctx.prec = PREC
    t0 = time.time()
    print('[jensen_map] %s dmax=%d nmax=%d prec=%d; planned memory: %d coefficients x %d bits x workers < 2 GB'
          % (INP, dmax, NMAX, PREC, K, PREC), flush=True)
    CS = L.taylor_even(INP, K)
    print('[jensen_map] coefficients %.0fs' % (time.time() - t0), flush=True)
    done = set()
    if os.path.exists(out):
        for l in open(out):
            try:
                done.add(json.loads(l)['d'])
            except ValueError:
                pass
    ds = [d for d in dlist(dmax) if d not in done]
    f = open(out, 'a')
    W = int(os.environ.get('RH_WORKERS', '4'))
    with mp.get_context('fork').Pool(W) as pool:
        for r in pool.imap_unordered(work, ds):
            f.write(json.dumps(r) + '\n')
            f.flush()
            print(json.dumps(r)[:260], flush=True)
    print('[jensen_map] finished %.0fs' % (time.time() - t0), flush=True)


if __name__ == '__main__':
    main()
