#!/usr/bin/env python3
"""gpu_torus.py k N1,N2,... starts out.jsonl [sigma] [drop]: multi-start search for zeros of the Bohr lift B_N(sigma; theta)
of the order-k Riesz section at fixed sigma (default 0.5001), batched damped min-norm Newton in theta.
float64 on GPU (cupy) with numpy fallback: a SCREEN (MEASURED), never a verdict.  A reported zero is re-solved and
certified separately (cert_torus.py); a positive minimum is the best of the starts, not a lower bound."""
import sys, json, math, time
import numpy as np
import tor
try:
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=20 * 1024 ** 3)
    GPU = True
except Exception:
    xp = np; GPU = False

def run(k, N, starts, sigma, drop, seed=1, iters=400):
    w, ln, V, ps = tor.setup(k, N, drop=drop, dense=True)
    keep = np.nonzero(w)[0]
    a = xp.asarray((w * np.exp(-sigma * ln))[keep]); Vd = xp.asarray(V[keep]); d = Vd.shape[1]
    batch = max(1, min(starts, int(2e9 // (16 * len(keep) * 6))))
    print(f'N={N} terms={len(keep)} primes={d} batch={batch} planned GPU memory about {batch * len(keep) * 16 * 6 / 2 ** 30:.2f} GB', flush=True)
    rng = np.random.default_rng(seed)
    best = 1e9; bth = None; nzero = 0; done = 0
    while done < starts:
        S = min(batch, starts - done)
        th0 = rng.uniform(0, 2 * math.pi, (S, d))
        if done == 0:
            th0[0] = math.pi; th0[1] = 0.0
            if S > 2: th0[2] = -0.97 * np.log(ps)
        th = xp.asarray(th0)
        E = xp.exp(1j * (th @ Vd.T)); Bv = E @ a
        for it in range(iters):
            J = 1j * ((E * a) @ Vd)                       # S x d complex
            Jr, Ji = J.real, J.imag
            g11 = (Jr * Jr).sum(1); g12 = (Jr * Ji).sum(1); g22 = (Ji * Ji).sum(1)
            det = g11 * g22 - g12 * g12 + 1e-30
            b1, b2 = -Bv.real, -Bv.imag
            y1 = (g22 * b1 - g12 * b2) / det; y2 = (-g12 * b1 + g11 * b2) / det
            # cap the step where the system is near-singular: fall back to gradient direction
            dlt = y1[:, None] * Jr + y2[:, None] * Ji
            nrm = xp.sqrt((dlt * dlt).sum(1)); cap = xp.minimum(1.0, 2.0 / (nrm + 1e-30))
            dlt = dlt * cap[:, None]
            lam = xp.ones(S)
            act = xp.abs(Bv) > 1e-13
            for _ in range(12):
                E2 = xp.exp(1j * ((th + lam[:, None] * dlt) @ Vd.T)); B2 = E2 @ a
                bad = (xp.abs(B2) >= xp.abs(Bv)) & act
                if not bool(bad.any()): break
                lam = xp.where(bad, lam / 2, lam)
            ok = (xp.abs(B2) < xp.abs(Bv))
            th = xp.where(ok[:, None], th + lam[:, None] * dlt, th)
            E = xp.where(ok[:, None], E2, E); Bv = xp.where(ok, B2, Bv)
            if not bool((ok & act).any()): break
        ab = xp.abs(Bv); i = int(ab.argmin()); m = float(ab[i])
        nzero += int((ab < 1e-11).sum())
        if m < best:
            best = m; bth = np.asarray(th[i].get() if GPU else th[i])
        done += S
    return best, bth, nzero, len(ps)

if __name__ == '__main__':
    k = float(sys.argv[1]); Ns = [int(x) for x in sys.argv[2].split(',')]; starts = int(sys.argv[3]); out = sys.argv[4]
    sigma = float(sys.argv[5]) if len(sys.argv) > 5 else 0.5001
    drop = tuple(int(x) for x in sys.argv[6].split(',')) if len(sys.argv) > 6 and sys.argv[6] else ()
    f = open(out, 'a')
    for N in Ns:
        t0 = time.time()
        best, bth, nz, d = run(k, N, starts, sigma, drop)
        rec = dict(k=k, N=N, sigma=sigma, drop=list(drop), starts=starts, primes=d, min_abs_B=best, starts_reaching_zero=nz, gpu=GPU, seconds=round(time.time() - t0, 1))
        print(json.dumps(rec), flush=True); f.write(json.dumps(rec) + '\n'); f.flush()
        np.save(out.replace('.jsonl', '') + f'_k{k:g}_N{N}_best.npy', np.concatenate([[sigma], bth]))
