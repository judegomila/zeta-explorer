"""run3.py -- combination 3 (cluster Gram of two-sided exponential packets at primes / integers) and the OU tail energy of
combination 4, one pass over the primes up to 2^bmax."""
import argparse, json, math, os, time, pickle
import numpy as np
from multiprocessing import Pool
import s4lib as S

ap = argparse.ArgumentParser()
ap.add_argument("--bmax", type=int, default=37); ap.add_argument("--bint", type=int, default=33); ap.add_argument("--maxlog2", type=int, default=30)
ap.add_argument("--out", default="c3.pkl"); ap.add_argument("--part", default="0/1")
a = ap.parse_args()
W = int(os.environ.get("RH_WORKERS", "4"))
MUS = [0.2320723, 0.45]
GEOM = [0, 0, 1, 1, 2]; MU = np.array([MUS[0], MUS[1], MUS[0], MUS[1], MUS[0]])
GEOMB = [0, 0, 1, 1]; MUB = np.array([MUS[0], MUS[1], MUS[0], MUS[1]])
XS = [0.02, 0.166]; TS = [14.134725141734695, 17.0, 100.0, 1e4, 1e6]
LOGEDGES = [3, 8, 55, 2981, 8886111]          # ceil(e^(2^b)), b = 0..4


def bounds(bmax):
    N = 1 << bmax; bs = set([2] + [1 << b for b in range(1, bmax + 1)] + [e for e in LOGEDGES if e < N])
    bs = sorted(bs); out = []
    for lo, hi in zip(bs[:-1], bs[1:]):
        step = 1 << a.maxlog2; x = lo
        while x < hi:
            y = min(hi, (x // step + 1) * step); out.append((x, y)); x = y
    return out


def taskP(t):
    t0 = time.time(); r = S.prime_chunk(t[0], t[1], GEOM, MU, XS, TS); r["sec"] = time.time() - t0; return r


def taskI(t):
    t0 = time.time(); r = S.int_chunk(t[0], t[1], GEOMB, MUB); r["sec"] = time.time() - t0; return r


if __name__ == "__main__":
    t0 = time.time(); cp = bounds(a.bmax); ci = bounds(a.bint)
    pi_, pn_ = [int(v) for v in a.part.split("/")]
    cp = sorted(cp, key=lambda t: -(t[1] - t[0]))[pi_::pn_]; ci = sorted(ci, key=lambda t: -(t[1] - t[0]))[pi_::pn_]
    print("prime chunks", len(cp), "integer chunks", len(ci), "workers", W, "planned memory per worker < 0.05 GB", flush=True)
    with Pool(W) as P:
        rp = P.map(taskP, sorted(cp, key=lambda t: -(t[1] - t[0])), chunksize=1)
        print("primes done %.0f s, packets %d" % (time.time() - t0, sum(r["npk"] for r in rp)), flush=True)
        ri = P.map(taskI, sorted(ci, key=lambda t: -(t[1] - t[0])), chunksize=1)
    rp.sort(key=lambda r: r["lo"]); ri.sort(key=lambda r: r["lo"])
    pickle.dump(dict(args=vars(a), GEOM=GEOM, MU=MU, GEOMB=GEOMB, MUB=MUB, XS=XS, TS=TS, P=rp, I=ri, sec=time.time() - t0), open(a.out, "wb"))
    print("done %.0f s" % (time.time() - t0), flush=True)
