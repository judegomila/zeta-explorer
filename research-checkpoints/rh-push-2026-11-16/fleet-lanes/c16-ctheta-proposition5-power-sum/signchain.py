"""Control: prime side of the Fejer section for zeta and 24 seeded random completely multiplicative sign chains.
Re L_F(1/2+it) = (1/2) log(t/2pi) - Re sum_{n<=P} eps(n) Lambda(n) (1 - log n/u) n^(-1/2-it) + O(sqrt(P)/(u t^2)), u = log P, P = T^theta fixed on the scan.
float64 (MEASURED)."""
import sys, os, json, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
def prime_powers(P):
    P = int(P)
    sieve = np.ones(P + 1, dtype=bool); sieve[:2] = False
    for i in range(2, int(P ** 0.5) + 1):
        if sieve[i]: sieve[i * i :: i] = False
    primes = np.nonzero(sieve)[0]
    ns, lam, pid, kk = [], [], [], []
    for idx, p in enumerate(primes):
        q = p; k = 1
        while q <= P:
            ns.append(q); lam.append(math.log(p)); pid.append(idx); kk.append(k); q *= p; k += 1
    return np.array(ns, float), np.array(lam), np.array(pid), np.array(kk), len(primes)
def cell(a):
    T, theta, length, step = a
    P = T ** theta; u = math.log(P)
    ns, lam, pid, kk, npr = prime_powers(P)
    coef = lam * (1 - np.log(ns) / u) / np.sqrt(ns)
    logn = np.log(ns)
    chains = [np.ones(len(ns))]
    for seed in range(24):
        e = np.random.default_rng(1000 + seed).choice([-1.0, 1.0], size=npr)
        chains.append(e[pid] ** kk)
    C = (np.array(chains) * coef).T.astype(np.complex128)      # [K, 25]
    K = len(ns)
    chunk = max(16, int(4e6 // K))
    print("cell", T, theta, "P", P, "terms", K, "points", int(length / step), "chunk alloc MB", chunk * K * 16 / 1e6, flush=True)
    npts = int(length / step)
    mn = np.full(25, np.inf); neg = np.zeros(25); tot = 0
    for s in range(0, npts, chunk):
        dt = (np.arange(s, min(npts, s + chunk)) * step)
        tt = T + dt
        E = np.exp(-1j * (np.outer(dt, logn) + T * logn[None, :] % (2 * math.pi)))
        S = (E @ C).real
        G = 0.5 * np.log(tt / (2 * math.pi))[:, None] - S
        mn = np.minimum(mn, G.min(axis=0)); neg += (G < 0).sum(axis=0); tot += len(dt)
    var = 0.5 * np.sum(coef ** 2)
    res = dict(T=T, theta=theta, P=P, u=u, length=length, step=step, reserve=0.5 * math.log(T / 2 / math.pi), sd=math.sqrt(var),
               zeta_min=float(mn[0]), zeta_negfrac=float(neg[0] / tot), chain_min=[float(x) for x in mn[1:]], chain_negfrac=[float(x) for x in neg[1:] / tot],
               chains_violating=int((mn[1:] < 0).sum()))
    z = res["reserve"] / res["sd"]
    res["gauss_tail"] = 0.5 * math.erfc(z / math.sqrt(2))
    res["gauss_expected_violating_points"] = res["gauss_tail"] * length * u / (2 * math.pi)
    print(json.dumps({k: v for k, v in res.items() if k not in ("chain_min", "chain_negfrac")}), "chain_min range", min(res["chain_min"]), max(res["chain_min"]), flush=True)
    return res
if __name__ == "__main__":
    from multiprocessing import Pool
    cells = [(1e6, 0.25, 2e6, 0.1), (1e9, 0.25, 2e6, 0.08), (1e6, 0.5, 4e5, 0.05), (1e9, 0.5, 2e4, 0.04), (1e6, 1.0, 200, 0.02), (1e7, 1.0, 100, 0.02)]
    with Pool(min(6, int(os.environ.get("RH_WORKERS", "4")))) as p:
        out = p.map(cell, cells, chunksize=1)
    json.dump(out, open(os.path.join(HERE, "out_signchain.json"), "w"))
    print("done")
