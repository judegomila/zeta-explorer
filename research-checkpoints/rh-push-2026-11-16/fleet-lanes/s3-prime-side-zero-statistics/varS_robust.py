"""Var S per chunk (mean removed in each chunk), robust against a list defect (a missed pair of zeros shifts S by 2 from that point on).
Usage: varS_robust.py OUT.json SPEC...   200 chunks; chunks whose variance deviates from the median by more than 6 MAD are dropped and counted."""
import sys, json, math, numpy as np, pc
PI = math.pi
res = []
for spec in sys.argv[2:]:
    lst = pc.load(spec); x = lst['x']; n = len(x); q = lst['q']; t = lst['T0'] + lst['d']
    a = np.arange(n - 1) - x[:-1]; b = np.arange(n - 1) - x[1:]; dx = np.diff(x)
    m1 = dx * (a + b) / 2; m2 = dx * (a * a + a * b + b * b) / 3
    nch = 200; e = np.linspace(0, n - 1, nch + 1).astype(int)
    v = np.array([m2[e[i]:e[i + 1]].sum() / dx[e[i]:e[i + 1]].sum() - (m1[e[i]:e[i + 1]].sum() / dx[e[i]:e[i + 1]].sum()) ** 2 for i in range(nch)])
    LLc = np.array([np.mean(np.log(np.log(q * t[e[i]:e[i + 1]] / (2 * PI)))) for i in range(nch)])
    Lc = np.array([np.mean(np.log(q * t[e[i]:e[i + 1]] / (2 * PI))) for i in range(nch)])
    ps = pc.rmt.primes_upto(10 ** 6).astype(float); P2 = float(sum(np.sum(ps ** -k) / k ** 2 for k in range(2, 40)))
    Mq = pc.MERT - (1.0 / q if q > 1 else 0.0); P2q = P2 - (sum(q ** -k / k ** 2 for k in range(2, 60)) if q > 1 else 0.0)
    K = 2 * PI ** 2 * v - LLc - Mq - P2q
    med = np.median(K); mad = np.median(np.abs(K - med)) + 1e-12
    keep = np.abs(K - med) < 6 * 1.4826 * mad
    # jumps of S between chunk means (a missed pair gives -2)
    mu = np.array([m1[e[i]:e[i + 1]].sum() / dx[e[i]:e[i + 1]].sum() for i in range(nch)])
    r = dict(name=lst['name'], q=q, n_zeros=int(n), T_mid=float(np.median(t)), L=float(Lc.mean()), chunks=nch, dropped=int((~keep).sum()),
             dropped_index=[int(i) for i in np.nonzero(~keep)[0][:10]], chunk_mean_steps_above_half=[[int(i), float(s)] for i, s in enumerate(np.diff(mu)) if abs(s) > 0.5][:10],
             var_S=float(np.mean(v[keep])), K=float(np.mean(K[keep])), K_se=float(np.std(K[keep], ddof=1) / math.sqrt(keep.sum())), K_median=float(med),
             K_minus_1_times_L2=float(np.mean((K[keep] - 1) * Lc[keep] ** 2)), K_first_half=float(np.mean(K[:nch // 2][keep[:nch // 2]])), K_second_half=float(np.mean(K[nch // 2:][keep[nch // 2:]])))
    print(json.dumps(r), flush=True); res.append(r)
json.dump(res, open(sys.argv[1], 'w'), indent=1)
