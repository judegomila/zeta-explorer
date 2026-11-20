"""run_packets.py -- combinations (1), (3) and the alpha>1 share of (2): packet sums on a common height grid.
usage: run_packets.py <outdir> <scale> [heights...]      scale multiplies the sieve-length caps (1 = server plan)."""
import sys, os, math, json, time
import numpy as np
import multiprocessing as _mp
Pool = _mp.get_context("fork").Pool
import pklib as L

KEYS = ["r", "z", "rho_raw", "thpos_re", "thpos_abs", "nu", "thc_re", "thc_abs", "f_alg", "f_alg_pos", "M1", "M2"]
S_STEP, X = 2.0, 5.0
N_SEAM = [690988, 6153547, 54799999]
HEIGHTS = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12] + [2 * math.pi * N * N for N in N_SEAM[:1]] + [1e13] + [2 * math.pi * N * N for N in N_SEAM[1:]]


def plan(T0, scale):
    """list of (p, k, hs, W)"""
    sv = math.sqrt(T0 / (2 * math.pi))
    out = []
    for p in L.PRIMES97:
        ks = [1, 2, 3] if p <= 13 else [1]
        for k in ks:
            cap = (1.2e10 if p <= 13 else (1e11 if p == 97 else 6e9)) * scale * (1.0 if k == 1 else 0.25)
            wmax = 2000 if p <= 13 else 400
            hs = list(range(1, p))
            per = S_STEP * sv * sum(1 / (k - h / p) for h in hs)
            W = int(min(wmax, cap // per))
            if W < 4:
                # restricted alias set, W = 4, block cap
                W = 4
                bcap = 2e10 * scale
                hmin_alpha = min([h for h in hs if (k - h / p) < 1 / (2 * math.pi)] or [p - 1])
                cand = sorted(set([1, max(1, p // 2), hmin_alpha, p - 1]))
                hs = [h for h in cand if (W * S_STEP + 2 * X) * sv / (k - h / p) <= bcap]
                if not hs:
                    continue
            out.append((p, k, hs, W))
    return out


def work(args):
    T0, p, k, h, W = args
    t = time.time()
    g = L.Grid(T0, W, S_STEP, p, h, k, X)
    V, Pm, M1, M2, cnt = L.run_block(g)
    st = L.stats_block(g, V, Pm, M1, M2)
    arr = np.stack([st[key] for key in KEYS], axis=-1).astype(np.float32)   # [W, NV, nkeys]
    tnr_hit = int((np.abs(M1[:, 6] - M1[:, 0]) > 1e-12 * M1[:, 0]).sum())
    return (p, k, h, arr, int(cnt), g.hi - g.lo, tnr_hit, time.time() - t)


if __name__ == "__main__":
    outdir = sys.argv[1]; scale = float(sys.argv[2])
    heights = [float(x) for x in sys.argv[3:]] or HEIGHTS
    os.makedirs(outdir, exist_ok=True)
    nw = int(os.environ.get("RH_WORKERS", "4"))
    L.lib()
    with Pool(nw) as pool:
        for T0 in heights:
            tag = "T%.6e" % T0
            fn = os.path.join(outdir, tag + ".npz")
            if os.path.exists(fn):
                print("skip", tag, flush=True); continue
            pl = plan(T0, scale)
            tasks = [(T0, p, k, h, W) for (p, k, hs, W) in pl for h in hs]
            sv = math.sqrt(T0 / (2 * math.pi))
            tot = sum((W * S_STEP + 2 * X) * sv / (k - h / p) for (_, p, k, h, W) in tasks)
            wins = sum(W for (_, p, k, h, W) in tasks)
            big = max(W * L.NV * p * 4 * 8 for (_, p, k, h, W) in tasks)
            print("%s: %d blocks, %d (window, alias) pairs, planned sieve length %.3e, largest allocation per block %.1f MB, base primes to %.2e"
                  % (tag, len(tasks), wins, tot, big / 1e6, math.sqrt(97 * T0 / (2 * math.pi)) * 1.1), flush=True)
            # heavy first
            tasks.sort(key=lambda a: -(a[4] * S_STEP + 2 * X) / (a[2] - a[3] / a[1]))
            t0 = time.time()
            res = {}; meta = []
            done = 0
            for (p, k, h, arr, cnt, ln, tnr_hit, dt) in pool.imap_unordered(work, tasks, chunksize=1):
                res[(p, k, h)] = arr; meta.append((p, k, h, arr.shape[0], cnt, ln, tnr_hit, dt)); done += 1
                if done % 100 == 0:
                    print("  %s %d/%d  %.0fs" % (tag, done, len(tasks), time.time() - t0), flush=True)
            save = {}
            for (p, k, hs, W) in pl:
                save["d_%d_%d" % (p, k)] = np.stack([res[(p, k, h)] for h in hs])       # [nh, W, NV, nkeys]
                save["h_%d_%d" % (p, k)] = np.array(hs)
            save["meta"] = np.array(meta, dtype=np.float64)
            save["T0"] = T0; save["dT"] = S_STEP * 2 * math.pi * sv
            np.savez_compressed(fn + ".tmp.npz", **save)
            os.replace(fn + ".tmp.npz", fn)
            print("%s done in %.0fs; prime powers processed %.3e" % (tag, time.time() - t0, sum(m[4] for m in meta)), flush=True)
