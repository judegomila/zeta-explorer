"""cov4.py -- combination 4, covariance part: measured covariance of cos(U lambda_l), cos(U lambda_m) under U ~ Cauchy(T, x)
against K_T(l,m) = (1/2) cos(T(l-m)) [exp(-x|l-m|) - exp(-x(l+m))], for prime frequencies and for control frequency sets."""
import argparse, json, math, os, time
import numpy as np
import mpmath as mp
import s4lib as S

ap = argparse.ArgumentParser()
ap.add_argument("--nsamp", type=float, default=4e7); ap.add_argument("--nf", type=int, default=96); ap.add_argument("--out", default="c4_cov.json")
a = ap.parse_args()
mp.mp.dps = 50
rng = np.random.default_rng(20261119)
xp = np
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=8 * 1024 ** 3); xp = cp
except Exception as e:
    print("cupy not used:", e, flush=True)


def freq_sets(nf):
    sets = {}
    # primes: log-uniform scales up to 1e11, in close pairs (consecutive primes) so that |l - m| is small for half of the pairs
    ps = []
    for e in np.linspace(1, 11, nf // 2):
        lo = int(10 ** e); q = S.primes(lo, lo + 2000)[:2]; ps += [int(q[0]), int(q[1])]
    sets["primes"] = [mp.log(p) for p in ps]
    sets["twisted_primes"] = [mp.log(p + float(rng.random())) for p in ps]            # perturbed positions
    sets["composites"] = [mp.log(p + 1) for p in ps]                                  # even integers next to the primes
    sets["random"] = sorted(mp.mpf(float(v)) for v in rng.uniform(math.log(10), math.log(1e11), len(ps)))
    return sets, ps


def run(lams, T, x, nsamp, nb=64):
    lam = np.array([float(l) for l in lams]); n = len(lam)
    ph0 = np.array([float(mp.fmod(mp.mpf(T) * l, 2 * mp.pi)) for l in lams])          # T*lambda mod 2 pi at 50 digits
    K = np.empty((n, n))
    for i in range(n):
        for j in range(n):
            K[i, j] = 0.5 * math.cos(ph0[i] - ph0[j]) * (math.exp(-x * abs(lam[i] - lam[j])) - math.exp(-x * (lam[i] + lam[j])))
    mean_th = np.exp(-x * lam) * np.cos(ph0)
    B = int(nsamp // nb); lam_g = xp.asarray(lam); ph_g = xp.asarray(ph0); covs = []; means = []
    for b in range(nb):
        r = xp.asarray(rng.random(B)); dU = x * xp.tan(math.pi * (r - 0.5))          # U - T
        C = xp.cos(ph_g[None, :] + dU[:, None] * lam_g[None, :])
        m = C.mean(0); Cc = C - xp.asarray(mean_th)[None, :]
        cv = (Cc.T @ Cc) / B
        covs.append(xp.asnumpy(cv) if xp is not np else cv); means.append(xp.asnumpy(m) if xp is not np else m)
    covs = np.array(covs); est = covs.mean(0); se = covs.std(0, ddof=1) / math.sqrt(nb)
    z = (est - K) / np.where(se > 0, se, 1); iu = np.triu_indices(n)
    mm = np.array(means); zm = (mm.mean(0) - mean_th) / (mm.std(0, ddof=1) / math.sqrt(nb))
    return dict(max_abs_z=float(np.abs(z[iu]).max()), rms_z=float(np.sqrt((z[iu] ** 2).mean())), npairs=int(len(iu[0])),
                max_abs_dev=float(np.abs(est - K)[iu].max()), max_abs_K=float(np.abs(K).max()), frac_absz_gt3=float((np.abs(z[iu]) > 3).mean()),
                mean_max_abs_z=float(np.abs(zm).max()))


if __name__ == "__main__":
    t0 = time.time(); sets, ps = freq_sets(a.nf); res = dict(nsamp=a.nsamp, primes=ps, rows=[])
    for T in (1e6, 1e9, 1e12):
        for x in (0.02, 1.0):
            for name, lams in sets.items():
                r = run(lams, T, x, a.nsamp); r.update(T=T, x=x, set=name); res["rows"].append(r)
                print(json.dumps(r), flush=True)
    res["sec"] = time.time() - t0; json.dump(res, open(a.out, "w"), indent=1)
