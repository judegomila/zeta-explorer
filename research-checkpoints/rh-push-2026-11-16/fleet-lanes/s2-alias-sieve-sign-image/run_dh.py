"""run_dh.py -- Davenport-Heilbronn in the packet tests through its own Lambda_DH(n) (table front end; all n in the block).
A zeta column computed from a Lambda table by the same front end is the cross-check against the sieve front end.
usage: run_dh.py <outdir> <log2 Nmax> <scale> [heights...]"""
import sys, os, math, json, time
import numpy as np
import multiprocessing as _mp
Pool = _mp.get_context("fork").Pool
import pklib as L
from run_packets import KEYS, S_STEP, X, plan

LD = None; LZ = None; NMAX = 0

def work(args):
    T0, p, k, h, W = args
    g = L.Grid(T0, W, S_STEP, p, h, k, X)
    n = np.arange(g.lo, g.hi, dtype=np.uint64)
    out = []
    for tab, pole in ((LD, False), (LZ, True)):
        V, Pm, M1, M2 = L.run_table(g, n, tab[g.lo:g.hi])
        main = (L.main_term(g)[:, None] if pole else np.zeros((W, 1), dtype=complex))
        st = L.stats_core(g, V, Pm, M1, M2, main)
        out.append(np.stack([st[key] for key in KEYS], axis=-1)[:, 0, :])
    return (p, k, h, np.stack(out, axis=1).astype(np.float32), g.hi - g.lo)     # [W, 2, nkeys]

if __name__ == "__main__":
    outdir = sys.argv[1]; NMAX = 1 << int(sys.argv[2]); scale = float(sys.argv[3])
    heights = [float(x) for x in sys.argv[4:]] or [1e6, 1e7, 1e8, 1e9]
    os.makedirs(outdir, exist_ok=True)
    print("planned allocation: Lambda_DH and Lambda tables 2 x %.2f GB" % (8 * (NMAX + 1) / 1e9), flush=True)
    LD = L.dh_lambda(NMAX)
    LZ = np.zeros(NMAX + 1)
    for q in L.primes_range(2, NMAX + 1):
        q = int(q)
        if q * q > NMAX: break
        n = q * q
        while n <= NMAX: LZ[n] = math.log(q); n *= q
    pr = L.primes_range(2, NMAX + 1); LZ[pr.astype(np.int64)] = np.log(pr.astype(np.float64)); del pr
    print("max |Lambda_DH| = %.4g; mean |Lambda_DH| on the last 1e6: %.4g" % (np.abs(LD).max(), np.abs(LD[-10 ** 6:]).mean()), flush=True)
    nw = int(os.environ.get("RH_WORKERS", "4"))
    with Pool(nw) as pool:
        for T0 in heights:
            sv = math.sqrt(T0 / (2 * math.pi))
            pl = plan(T0, scale)
            tasks = []
            kept = []
            for (p, k, hs, W) in pl:
                hs2 = [h for h in hs if (T0 + W * S_STEP * 2 * math.pi * sv) / (2 * math.pi * (k - h / p)) * (1 + 6 / sv) + 10 < NMAX]
                if hs2:
                    kept.append((p, k, hs2, W, len(hs2) == p - 1)); tasks += [(T0, p, k, h, W) for h in hs2]
            tot = sum((W * S_STEP + 2 * X) * sv / (k - h / p) for (_, p, k, h, W) in tasks)
            print("T0=%.3e: %d blocks, %d integers in blocks, full alias sets at k=1: %s" % (T0, len(tasks), tot, [p for (p, k, hs, W, full) in kept if full and k == 1]), flush=True)
            t0 = time.time(); res = {}
            for (p, k, h, arr, ln) in pool.imap_unordered(work, tasks, chunksize=1): res[(p, k, h)] = arr
            save = {}
            for (p, k, hs, W, full) in kept:
                save["d_%d_%d" % (p, k)] = np.stack([res[(p, k, h)] for h in hs]); save["h_%d_%d" % (p, k)] = np.array(hs)
            save["T0"] = T0
            np.savez_compressed(os.path.join(outdir, "DH_T%.6e.npz" % T0), **save)
            print("  done %.0fs" % (time.time() - t0), flush=True)
