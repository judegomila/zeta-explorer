"""run1.py -- combination 1: five-shell functional E_y(N,A,c) = (1-A) L_N(Y_4) - A sum_g L_N(Z_g) = L_N(R_y c) - A L_N(c).
Part A: exact integer evaluation by Legendre DFS (y = 97 and y = 997), N up to 1e12.
Part B: factor sieve for globally twisted coefficients (hash signs / phases on all primes) and E_a, N up to --nsieve."""
import argparse, json, math, os, time
import numpy as np
from multiprocessing import Pool
import s4lib as S

ap = argparse.ArgumentParser()
ap.add_argument("--ys", default="97:40:1e15,997:8:1e13,997:1:1e15,9973:2:1e12"); ap.add_argument("--dense", type=int, default=2000)
ap.add_argument("--nsieve", type=float, default=1e11); ap.add_argument("--uni997max", type=float, default=1e12)
ap.add_argument("--out", default="c1.json"); ap.add_argument("--part", default="AB"); ap.add_argument("--split", default="0/1"); ap.add_argument("--asplit", default="0/1"); ap.add_argument("--unimax", type=float, default=1e12)
a = ap.parse_args()
W = int(os.environ.get("RH_WORKERS", "4"))
NSEED = 3


def grid(per, nmax):
    k = int(round(per * (math.log10(nmax) - 6)))
    return sorted(set(int(round(10 ** (6 + i / per))) for i in range(k + 1)))


PRS = {}


def prs(y):
    if y not in PRS: PRS[y] = S.primes_upto(y)
    return PRS[y]


def taskA(t):
    y, N = t; pr = prs(y); t0 = time.time()
    out = S.legendre(N, pr); r = dict(y=y, N=N, phi=int(out[0]), res5=[int(v) for v in out[1:5]], chi101=int(out[5]), nodes=int(out[6]))
    r["Ssgn"] = []
    for sd in range(NSEED if (y == 97 or N <= 10 ** 13) else 1):
        eps = np.array([S.sgn(p, S.SEED + sd) for p in pr], dtype=np.int8); o = S.smooth_sign(N, pr, eps); r["Ssgn"].append(int(o[0]))
    if y in (97, 997) and N <= a.unimax and not (10 ** 12 < N <= 10 ** 12 + 2 * 10 ** 9):
        th = np.array([S.uni(p, S.SEED) for p in pr]); z, nd = S.smooth_uni(N, pr, th); r["Suni"] = [z.real, z.imag]; r["nodes_uni"] = nd
    r["sec"] = time.time() - t0
    return r


def taskB(t):
    lo, hi = t; oi, od, _ = S.factor_chunk(lo, hi, seg=1 << 22, doEA=1)
    return lo, oi, od


if __name__ == "__main__":
    res = dict(args=vars(a), workers=W)
    t0 = time.time()
    if "A" in a.part:
        tasks = []
        for spec in [x for x in a.ys.split(",") if x]:
            y, per, nm = spec.split(":"); tasks += [(int(y), N) for N in grid(int(per), float(nm))]
        tasks += [(97, 10 ** 12 + j * 10 ** 6) for j in range(1, a.dense + 1)]
        tasks = sorted(set(tasks), key=lambda t: -t[1] * t[0] ** 2)
        ai_, an_ = [int(v) for v in a.asplit.split("/")]; tasks = tasks[ai_::an_]
        print("part A tasks", len(tasks), flush=True)
        with Pool(W) as P:
            rows = []
            for r in P.imap_unordered(taskA, tasks, chunksize=1):
                rows.append(r)
                if r["sec"] > 20: print("A", r["y"], r["N"], "nodes %.3g sec %.1f" % (r["nodes"], r["sec"]), flush=True)
        rows.sort(key=lambda r: (r["y"], r["N"])); res["A"] = rows; res["secA"] = time.time() - t0
        json.dump(res, open(a.out, "w"))
        print("part A done %.0f s" % (time.time() - t0), flush=True)
    if "B" in a.part:
        t1 = time.time(); NS = int(a.nsieve); CH = 1 << 28
        tasks = [(lo, min(lo + CH, NS + 1)) for lo in range(1, NS + 1, CH)]
        print("part B chunks", len(tasks), "planned memory per worker: %.2f GB" % ((1 << 22) * 34 / 1e9), flush=True)
        pi_, pn_ = [int(v) for v in a.split.split("/")]; tasks = tasks[pi_::pn_]
        parts = {}
        with Pool(W) as P:
            for lo, oi, od in P.imap_unordered(taskB, tasks, chunksize=1):
                parts[lo] = (oi, od)
        los = np.array([lo for lo, _ in tasks]); nseg = np.array([len(parts[lo][0]) for lo, _ in tasks])
        oi = np.concatenate([parts[lo][0] for lo, _ in tasks]); od = np.concatenate([parts[lo][1] for lo, _ in tasks])
        np.savez_compressed(a.out.replace(".json", "_sievepart.npz"), los=los, nseg=nseg, I=oi, D=od, NS=NS)
        res["secB"] = time.time() - t1; res["B_segments"] = int(len(oi)); json.dump(res, open(a.out, "w"))
        print("part B done %.0f s" % (time.time() - t1), flush=True)
