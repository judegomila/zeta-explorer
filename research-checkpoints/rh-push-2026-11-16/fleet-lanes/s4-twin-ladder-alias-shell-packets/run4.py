"""run4.py -- combination 4: Airy-envelope packet sums on primes in windows (controlling alias h = p-1), heights 1e6..1e12."""
import argparse, json, math, os, time, pickle
import numpy as np
from multiprocessing import Pool
import s4lib as S

ap = argparse.ArgumentParser()
ap.add_argument("--Ts", default="1e6,1e8,1e10,1e12"); ap.add_argument("--ps", default="3,5,7,11,31,97,307,997,3163,9973,31627,99991")
ap.add_argument("--ks", default="2,3,4,5,7"); ap.add_argument("--nwin", type=int, default=64); ap.add_argument("--nwin1", type=int, default=16)
ap.add_argument("--cmax", type=float, default=1e14); ap.add_argument("--out", default="c4.pkl"); ap.add_argument("--maxlen", type=float, default=1.5e10); ap.add_argument("--part", default="0/1"); ap.add_argument("--minlen", type=float, default=0.0)
a = ap.parse_args()
W = int(os.environ.get("RH_WORKERS", "4"))
CUTS = [S.A1, S.A2, 7.0, 12.0]
TAB = None


def task(t):
    global TAB
    if TAB is None: TAB = S.airy_table()
    T, p, k, j = t; h = p - 1; d = k - h / p; v0 = T / (2 * math.pi)
    c0 = v0 / d; H0 = c0 / math.sqrt(v0)
    c = c0 + 24.0 * H0 * j                      # disjoint windows; height T_j = 2 pi d c
    Tj = 2 * math.pi * d * c; H = c / math.sqrt(Tj / (2 * math.pi))
    Wv, M, npk, lo, hi = S.airy_window(c, H, CUTS, TAB, p, h)
    return dict(T=T, p=p, k=k, j=j, c=c, H=H, W=Wv, M=M, npk=npk)


if __name__ == "__main__":
    t0 = time.time(); tasks = []
    for T in [float(x) for x in a.Ts.split(",")]:
        for p in [int(x) for x in a.ps.split(",")]:
            for k in [1] + [int(x) for x in a.ks.split(",")]:
                d = k - (p - 1) / p; c = T / (2 * math.pi) / d
                if c > a.cmax or c < 2000: continue
                nw = a.nwin1 if k == 1 else a.nwin
                ln_ = 20 * c / math.sqrt(T / (2 * math.pi)) * nw
                if ln_ > a.maxlen or ln_ <= a.minlen: continue
                tasks += [(T, p, k, j) for j in range(nw)]
    cost = lambda t: (t[0] / (2 * math.pi)) ** 0.5 / (t[2] - (t[1] - 1) / t[1])
    tasks.sort(key=lambda t: -cost(t))
    pi_, pn_ = [int(v) for v in a.part.split("/")]; tasks = tasks[pi_::pn_]
    print("windows", len(tasks), "sieved length %.3g" % sum(20 * cost(t) for t in tasks), flush=True)
    with Pool(W) as P:
        rows = P.map(task, tasks, chunksize=4)
    pickle.dump(dict(args=vars(a), CUTS=CUTS, rows=rows, sec=time.time() - t0), open(a.out, "wb"))
    print("done %.0f s, primes %d" % (time.time() - t0, sum(r["npk"] for r in rows)), flush=True)
