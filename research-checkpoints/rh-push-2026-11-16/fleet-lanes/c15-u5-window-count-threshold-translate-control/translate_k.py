"""Experiment A: height translates zeta(s + i alpha) against K windows of length 1 near height T.
Exact identity (c3 Lemma B): relative FE defect of zeta(s+i alpha) at s = 1/2+it is 2|sin(Psi/2)|, Psi(t,alpha) = 2 theta(t+alpha) - 2 theta(t).
dPsi/dt = log((t+alpha)/t) + O(t^-2) has a fixed sign, so the sup over a span [a,b] is at the endpoints.
Part 1 (mpmath, 40 digits): contiguous windows [Ts+j, Ts+j+1], j<K; alpha chosen so that Psi(a)+Psi(b) = 4 pi k (minimax); k = +-1..3.
Part 2: K windows placed at random inside a fixed span W: defect depends on W only.
Part 3 (float64 scan + mp check): strong Euler reading, max_{p<=P} |p^{-i alpha} - 1| <= eps; smallest lattice alpha and the span it passes."""
import mpmath as mp, numpy as np, json, math
mp.mp.dps = 40
def Psi(t, al): return 2 * (mp.siegeltheta(t + al) - mp.siegeltheta(t))
def defect(t, al):
    return 2 * abs(mp.sin(Psi(t, al) / 2))
def best_alpha(a, b, k):
    a = mp.mpf(a); b = mp.mpf(b); c = (a + b) / 2
    al0 = 2 * mp.pi * k / mp.log(c / (2 * mp.pi))
    al = mp.findroot(lambda x: Psi(a, x) + Psi(b, x) - 4 * mp.pi * k, al0)
    return al, max(defect(a, al), defect(b, al))
def span_defect(a, b):
    best = None
    for k in (1, -1, 2, -2, 3, -3):
        al, d = best_alpha(a, b, k)
        if best is None or d < best[1]: best = (al, d, k)
    return best
out = dict(part1=[], part2=[], part3=[])
rng = np.random.default_rng(15)
ETAS = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6]
for T in (1e4, 1e5, 1e6, 1e8, 1e10, 1e12):
    for seed in range(3):
        Ts = T * (1 + 0.01 * rng.random())
        row = dict(T=T, seed=seed, Ts=Ts, K={}, Kmax={}, formula={})
        K = 1
        while K <= 2**22 and K < 0.5 * Ts:
            al, d, k = span_defect(Ts, Ts + K)
            row["K"][K] = [float(al), float(d), k]
            K *= 2
        for eta in ETAS:
            # largest integer K with minimax defect <= eta (bisection; defect is increasing in K)
            lo, hi = 0, 1
            while float(span_defect(Ts, Ts + hi)[1]) <= eta and hi < 0.5 * Ts: lo, hi = hi, hi * 2
            while hi - lo > 1:
                mid = (lo + hi) // 2
                if float(span_defect(Ts, Ts + mid)[1]) <= eta: lo = mid
                else: hi = mid
            row["Kmax"][str(eta)] = lo
            row["formula"][str(eta)] = eta * Ts * math.log(Ts / (2 * math.pi)) / math.pi
        row["sqrtT_over_logT"] = math.sqrt(T) / math.log(T)
        out["part1"].append(row)
        print(f"T={T:g} seed={seed} Kmax(eta)=", row["Kmax"], " formula=", {k: round(v, 2) for k, v in row["formula"].items()},
              f" sqrtT/logT={row['sqrtT_over_logT']:.1f}", flush=True)
# part 2: K windows at random positions in a span W = 64: the defect is that of the span
for T in (1e4, 1e5, 1e6):
    Ts = T * 1.003; W = 64
    al, d, k = span_defect(Ts, Ts + W)
    for K in (2, 4, 8, 16, 32, 64):
        pos = np.sort(rng.random(K) * (W - 1)); pos[0] = 0; pos[-1] = W - 1
        dmax = max(max(float(defect(Ts + p, al)), float(defect(Ts + p + 1, al))) for p in pos)
        out["part2"].append(dict(T=T, W=W, K=K, alpha=float(al), defect=dmax, span_defect=float(d)))
        print(f"part2 T={T:g} W={W} K={K} alpha={float(al):.6f} max window defect={dmax:.3e} (span {float(d):.3e})", flush=True)
# part 3: strong Euler reading
def primes_upto(n): return [p for p in range(2, n + 1) if all(p % d for d in range(2, int(p**0.5) + 1))]
KS = 20_000_000
for T in (1e4, 1e5, 1e6, 1e8, 1e10, 1e12):
    c = T * 1.003; L0 = math.log(c / (2 * math.pi))
    print(f"part3 planned allocation: {KS} float64 x ~6 arrays = {KS*8*6/1e9:.2f} GB", flush=True)
    k = np.arange(1, KS + 1, dtype=np.float64)
    al = 2 * np.pi * k / L0
    for _ in range(6):  # Newton on g(al) = (c+al) log((c+al)/2pi) - c log(c/2pi) - al - 2 pi k, written to avoid cancellation
        g = c * np.log1p(al / c) + al * (np.log1p(al / c) + L0) - al - 2 * np.pi * k
        al -= g / (np.log1p(al / c) + L0)
    al = al[al < 0.2 * c]
    for P in (2, 3, 5, 7, 11):
        ps = primes_upto(P)
        for eps in (1e-1, 1e-2):
            e = np.zeros(len(al))
            for p in ps: e = np.maximum(e, 2 * np.abs(np.sin(0.5 * al * math.log(p))))
            idx = np.nonzero(e <= eps)[0]
            if len(idx) == 0:
                out["part3"].append(dict(T=T, P=P, eps=eps, alpha_min=None, scanned=float(al[-1]))); print(f"part3 T={T:g} P={P} eps={eps}: none below alpha={al[-1]:.3g}", flush=True); continue
            a0 = float(al[idx[0]])
            # check with mpmath: lattice condition and Euler defect
            chk = float(defect(mp.mpf(c), mp.mpf(a0))); eu = max(float(2 * abs(mp.sin(mp.mpf(a0) * mp.log(p) / 2))) for p in ps)
            heur = 2 * math.pi / L0 * (math.pi / eps)**len(ps)
            spans = {str(eta): 2 * eta / math.log1p(a0 / c) for eta in ETAS}
            out["part3"].append(dict(T=T, P=P, eps=eps, alpha_min=a0, lattice_defect_mp=chk, euler_defect_mp=eu, heuristic_alpha=heur, span=spans))
            print(f"part3 T={T:g} P={P} eps={eps}: alpha_min={a0:.4f} (heuristic {heur:.3g}) lattice defect {chk:.1e} euler {eu:.2e} span(eta=1e-2)={spans['0.01']:.3g} span(1e-6)={spans['1e-06']:.3g}", flush=True)
json.dump(out, open("translate_k.json", "w"), indent=0)
