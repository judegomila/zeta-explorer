"""Thin-twist test. chi completely multiplicative, |chi|=1.
mode greedy : chi(p)=-1 on S, S greedy-tracks T(x)=li(x^b)-li(2^b)  (pi_S ~ x^b/(b log x))
mode random : chi(p)=-1 on S, P(p in S)=p^(b-1)/2, independent (seeded)
mode phase  : chi(p)=exp(+-i phi_p), 1-cos(phi_p)=p^(b-1), sign alternating with the prime index
Outputs discrepancy E(x)=S(x)-c x on dyadic blocks, fitted exponents, and checks of F near s=b.
Planned memory: N bytes (sieve) + N int8/float64 (chi) + 4-16 N (cumsum); N=1e8 -> < 3 GB.
"""
import sys, json, math, time
import numpy as np
from scipy.special import expi, exp1
import mpmath as mp

mode = sys.argv[1]; b = float(sys.argv[2]); N = int(float(sys.argv[3]))
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
t0 = time.time()
print(f"mode={mode} b={b} N={N}; planned peak about {N*(1+16+8)/1e9:.2f} GB", flush=True)

def primes_upto(n):
    s = np.ones(n // 2 + 1, dtype=bool); s[0] = False
    for i in range(1, int(n ** 0.5) // 2 + 1):
        if s[i]:
            s[2 * i * (i + 1)::2 * i + 1] = False
    p = 2 * np.nonzero(s)[0] + 1
    return np.concatenate(([2], p[p <= n]))

P = primes_upto(N)
print("primes", len(P), f"{time.time()-t0:.1f}s", flush=True)
out = dict(mode=mode, b=b, N=N, seed=seed, n_primes=int(len(P)))
tailE1 = float(exp1((1 - b) * math.log(N)))      # int_N^inf t^(b-2)/log t dt

if mode in ("greedy", "random"):
    if mode == "greedy":
        T = expi(b * np.log(P.astype(float))) - expi(b * math.log(2.0))
        inS = np.zeros(len(P), dtype=bool); cnt = 0; maxdev = 0.0
        Tl = T.tolist()
        for i, t in enumerate(Tl):
            if cnt + 1 <= t:
                inS[i] = True; cnt += 1
            d = t - cnt
            if d > maxdev: maxdev = d
        out["greedy_max_T_minus_count"] = maxdev
        tail_factor = math.exp(-2 * tailE1)
    else:
        rng = np.random.default_rng(seed)
        inS = rng.random(len(P)) < 0.5 * P.astype(float) ** (b - 1)
        tail_factor = math.exp(-tailE1)
    S = P[inS]
    out["size_S"] = int(len(S)); out["S_first"] = [int(x) for x in S[:12]]
    # counting-function exponent of S
    out["piS_at"] = {str(10 ** k): int(np.searchsorted(S, 10 ** k, side="right")) for k in range(2, int(math.log10(N)) + 1)}
    chi = np.ones(N + 1, dtype=np.int8); chi[0] = 0
    for p in S.tolist():
        q = p
        while q <= N:
            chi[q::q] *= -1; q *= p
    print("chi built", f"{time.time()-t0:.1f}s", flush=True)
    Sf = S.astype(float)
    c = float(np.exp(np.sum(np.log1p(-1 / Sf) - np.log1p(1 / Sf)))) * tail_factor
    cs = np.cumsum(chi[1:], dtype=np.int64)          # cs[n-1] = S(n)
    chi_c = chi
else:
    phi_p = np.arccos(1 - P.astype(float) ** (b - 1))
    sg = np.where(np.arange(len(P)) % 2 == 0, 1.0, -1.0)
    phi_p *= sg
    ph = np.zeros(N + 1)
    for p, f in zip(P.tolist(), phi_p.tolist()):
        q = p
        while q <= N:
            ph[q::q] += f; q *= p
    print("phases built", f"{time.time()-t0:.1f}s", flush=True)
    chi_c = np.exp(1j * ph); chi_c[0] = 0; del ph
    Pf = P.astype(float); chp = np.exp(1j * phi_p)
    c = complex(np.exp(np.sum(np.log1p(-1 / Pf) - np.log(1 - chp / Pf)))) * math.exp(-tailE1)
    cs = np.cumsum(chi_c[1:])
    out["dev_abs_sum_at"] = {}
    dv = np.cumsum(np.abs(1 - chp)); dr = np.cumsum(1 - chp.real)
    for k in range(2, int(math.log10(N)) + 1):
        i = int(np.searchsorted(P, 10 ** k, side="right")) - 1
        out["dev_abs_sum_at"][str(10 ** k)] = [float(dv[i]), float(dr[i])]

out["c"] = [c.real, c.imag] if isinstance(c, complex) else c
out["S(N)/N"] = str(cs[-1] / N)
print("c =", c, " S(N)/N =", cs[-1] / N, flush=True)

# dyadic blocks
blocks = []
k = 6
while 2 ** (k + 1) <= N:
    lo, hi = 2 ** k, 2 ** (k + 1)
    n = np.arange(lo, hi, dtype=float)
    E = cs[lo - 1:hi - 1] - c * n
    blocks.append(dict(k=k, max=float(np.max(np.abs(E))), rms=float(np.sqrt(np.mean(np.abs(E) ** 2)))))
    k += 1
out["blocks"] = blocks
def fit(key, kmin):
    xs = np.array([(bk["k"] + 0.5) * math.log(2) for bk in blocks if bk["k"] >= kmin])
    ys = np.array([math.log(bk[key]) for bk in blocks if bk["k"] >= kmin])
    return float(np.polyfit(xs, ys, 1)[0])
out["exponent_fits"] = {f"{key}_k>={km}": fit(key, km) for key in ("max", "rms") for km in (8, 12, 16, 20) if km < blocks[-1]["k"] - 2}
for bk in blocks: print(bk)
print(out["exponent_fits"], flush=True)

# F near s=b from the Dirichlet series: F(s) = sum_{n<=N} chi(n) n^-s + c N^(1-s)/(s-1) - E(N) N^-s + s int_N^inf E x^(-s-1) dx  (last term dropped)
EN = cs[-1] - c * N
def F_trunc(s):
    tot = 0j; step = 10 ** 7
    for a in range(1, N + 1, step):
        n = np.arange(a, min(a + step, N + 1), dtype=float)
        tot += np.sum(chi_c[a:a + len(n)] * np.exp(-s * np.log(n)))
    return tot + c * N ** (1 - s) / (s - 1) - EN * N ** (-s)
pts = [b, b + 0.01, b + 0.02, b + 0.05, b + 0.07, b + 0.2, complex(b, 3.0), complex(b + 0.05, 14.134725), 2.0]
if mode in ("greedy", "random"):
    mult = 2.0 if mode == "greedy" else 1.0
    lg = np.log(Sf)
    def G_prod(s):   # Euler product over S up to N, tail by the density integral
        z = np.exp(-s * lg)
        val = np.exp(np.sum(np.log(1 - z) - np.log(1 + z)))
        tail = complex(mp.e1((s - b) * math.log(N))) if abs(s - b) > 1e-12 else None
        return val, tail
    res = []
    for s in pts:
        Ft = F_trunc(s); gp, tail = G_prod(s)
        if tail is not None:
            Fe = complex(mp.zeta(s)) * gp * np.exp(-mult * tail)
        else:
            Fe = 0.0
        res.append(dict(s=str(s), F_series=str(Ft), F_euler=str(Fe)))
        print(res[-1], flush=True)
    out["F_checks"] = res
    # order of vanishing: G(b+d)/d^mult -> K = e^(mult*gamma) (log P)^mult prod_{p in S, p<=P}(1-p^-b)/(1+p^-b)
    K = {}
    zb = Sf ** (-b); cum = np.cumsum(np.log(1 - zb) - np.log(1 + zb))
    for kk in range(3, int(math.log10(N)) + 1):
        Pm = 10 ** kk; i = int(np.searchsorted(S, Pm, side="right")) - 1
        K[str(Pm)] = float(math.exp(mult * 0.5772156649015329) * math.log(Pm) ** mult * math.exp(cum[i]))
    out["K_P"] = K; print("K_P", K)
    out["zeta(b)"] = float(mp.zeta(b))
    out["F_series_over_delta^mult"] = {str(d): str(F_trunc(b + d) / d ** mult) for d in (0.01, 0.02, 0.05)}
    print(out["F_series_over_delta^mult"])
else:
    res = [dict(s=str(s), F_series=str(F_trunc(s))) for s in pts]
    for r in res: print(r)
    out["F_checks"] = res
out["seconds"] = time.time() - t0
json.dump(out, open(f"thin_twist_{mode}_b{b}_N{N}_s{seed}.json", "w"), indent=1)
print("done", out["seconds"])
