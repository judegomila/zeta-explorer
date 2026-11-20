#!/usr/bin/env python3
"""float64 brute-force census of y(delta,t) = log|N_1(delta+it)|, N_1 = prod_k (1 - e^{i theta_k - lambda_k z}),
lambda_k = log(prime nearest exp(k^beta)) (distinct), delta = 2^-j.  GPU (cupy) screen; not a verdict.
All k with lambda_k*delta <= CUT are included; the omitted tail is below N(CUT/delta) e^-CUT."""
import os, sys, json, math, time, argparse
import numpy as np
from flint import arb, ctx
import common as C
try:
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=20 * 1024 ** 3)
    GPU = True
except Exception as e:
    import numpy as xp
    GPU = False
CUT = 40.0

def hash_theta(keys, seed):
    """keys: xp uint64 array -> theta in [0, 2pi)"""
    z = keys + xp.uint64((seed << 44) & C.M64)
    z = z + xp.uint64(0x9E3779B97F4A7C15)
    z = (z ^ (z >> xp.uint64(30))) * xp.uint64(0xBF58476D1CE4E5B9)
    z = (z ^ (z >> xp.uint64(27))) * xp.uint64(0x94D049BB133111EB)
    z = z ^ (z >> xp.uint64(31))
    return (z >> xp.uint64(11)).astype(xp.float64) * (2.0 ** -53 * 2 * math.pi)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--beta', type=float, required=True)
    ap.add_argument('--mode', required=True, choices=['plus', 'rand'])
    ap.add_argument('--seed', type=int, default=1)
    ap.add_argument('--jmin', type=int, default=2)
    ap.add_argument('--jmax', type=int, required=True)
    ap.add_argument('--chunk', type=int, default=1000000)
    ap.add_argument('--maxsec', type=float, default=3 * 3600)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    beta = a.beta
    small, k0 = C.small_set(beta)
    ctx.prec = 200
    desc = C.heights(beta, a.mode, a.seed, small)
    t = np.array([float(C.height_arb(d, beta, a.mode, a.seed, small).mid()) for d in desc])
    H = len(t)
    js = list(range(a.jmin, a.jmax + 1)); J = len(js)
    Kj = [int(math.ceil((CUT * 2.0 ** j) ** (1 / beta))) + 1 for j in js]
    print(f'GPU={GPU} beta={beta} mode={a.mode} small={len(small)} k0={k0} H={H} J={J} Kmax={Kj[-1]:.3e}', flush=True)
    print(f'planned allocation: chunk {a.chunk} x H {H} float64 = {a.chunk*H*8/1e9:.2f} GB per array, about 4 arrays live', flush=True)
    T = xp.asarray(t)
    acc = xp.zeros((J, H)); acc2 = xp.zeros((J, H))
    def add(lam, th):
        phi = th[:, None] - lam[:, None] * T[None, :]
        s2 = xp.sin(0.5 * phi); s2 *= s2
        lmin = float(lam[0])
        for ji, j in enumerate(js):
            d = 2.0 ** -j
            if lmin * d > CUT: continue
            x = lam * d
            r = xp.exp(-x); om = -xp.expm1(-x)
            v = xp.log((om * om)[:, None] + (4 * r)[:, None] * s2)
            acc[ji] += 0.5 * v.sum(axis=0)
            acc2[ji] += 0.25 * (v * v).sum(axis=0)
    lam_s = xp.asarray(np.array([math.log(q) for q in small]))
    if a.mode == 'rand':
        th_s = hash_theta(xp.arange(len(small), dtype=xp.uint64), a.seed)
    else:
        th_s = xp.zeros(len(small))
    add(lam_s, th_s)
    t0 = time.time(); last = t0; k = k0; done = [False] * J
    def save(final=False):
        y = xp.asnumpy(acc) if GPU else acc; y2 = xp.asnumpy(acc2) if GPU else acc2
        out = dict(beta=beta, mode=a.mode, seed=a.seed, js=js, Kj=Kj, k_done=k, done=[bool(Kj[i] <= k) for i in range(J)],
                   small=[int(q) for q in small], k0=k0, heights=[list(d) for d in desc], t=t.tolist(),
                   y=y.tolist(), sumsq=y2.tolist(), cut=CUT, gpu=GPU, secs=time.time() - t0, final=final)
        with open(a.out + '.tmp', 'w') as f: json.dump(out, f)
        os.replace(a.out + '.tmp', a.out)
    Kmax = Kj[-1]
    while k < Kmax:
        n = min(a.chunk, Kmax - k)
        kk = xp.arange(k, k + n, dtype=xp.float64)
        lam = kk if beta == 1.0 else (xp.sqrt(kk) if beta == 0.5 else kk ** beta)
        if a.mode == 'rand':
            th = hash_theta(xp.arange(k, k + n, dtype=xp.uint64) + xp.uint64(1 << 40), a.seed)
        else:
            th = xp.zeros(n)
        add(lam, th); k += n
        now = time.time()
        if now - last > 120:
            save(); last = now
            print(f'k={k:.3e} of {Kmax:.3e}  {now-t0:.0f}s  depths final: {sum(1 for i in range(J) if Kj[i] <= k)}/{J}', flush=True)
        if now - t0 > a.maxsec:
            print('maxsec reached', flush=True); break
    save(final=(k >= Kmax))
    print('done', k >= Kmax, time.time() - t0, flush=True)

if __name__ == '__main__':
    main()
