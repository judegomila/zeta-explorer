import sys, json, time
import numpy as np, mpmath as mp
from thinlib import *
N = int(float(sys.argv[1])) if len(sys.argv) > 1 else 10**9
print("planned memory: segment 2^24 bool (16 MB) + primes/float arrays of <= 1.1e6 entries x ~8 arrays (< 100 MB); total < 0.5 GB", flush=True)
S_LIST = [0.9, 0.85, 0.8, 0.7, 0.6, 0.9 + 2j, 0.9 + 10j, 0.8 + 10j, 0.901, 0.91, 0.92, 0.95, 1.0, 1.1, 2.0]
CH = [10**k for k in range(3, 10) if 10**k <= N]
T1 = np.zeros(len(S_LIST), dtype=complex); T3 = np.zeros(len(S_LIST), dtype=complex)
out = {"b": B, "N": N, "checkpoints": []}
dmin, dmax, dpre = 0.0, 0.0, 0.0; nS = 0; npr = 0; maxrun = 0
t0 = time.time(); ci = 0
def flush_cp(X):
    out["checkpoints"].append({"X": X, "pi": npr, "piS": nS, "L": float(Lfun(float(X))), "Dmin": dmin, "Dmax": dmax, "Dpre_max": dpre,
        "T1": [[z.real, z.imag] for z in T1], "T3": [[z.real, z.imag] for z in T3]})
    print(f"X={X:.0e} pi={npr} piS={nS} L={Lfun(float(X)):.3f} D in [{dmin:.4f},{dmax:.4f}] sup(L(p_n)-c_(n-1))={dpre:.4f} t={time.time()-t0:.0f}s", flush=True)
for pr, inS, c, Lp in thin_segments(N):
    while ci < len(CH) and CH[ci] < pr[-1]:
        X = CH[ci]; sel = pr <= X
        _dmin, _dmax = dmin, dmax
        if sel.any():
            d = c[sel] - Lp[sel]; dmin = min(dmin, d.min()); dmax = max(dmax, d.max())
            ps = pr[sel & inS].astype(np.float64)
            for i, s in enumerate(S_LIST):
                x = ps ** (-s); T1[i] += x.sum(); T3[i] += (np.log((1 - x) / (1 + x)) + 2 * x).sum()
            nS += int((sel & inS).sum()); npr += int(sel.sum())
        flush_cp(X); ci += 1
        keep = ~sel; pr, inS, c, Lp = pr[keep], inS[keep], c[keep], Lp[keep]
    if len(pr) == 0: continue
    d = c - Lp; dmin = min(dmin, d.min()); dmax = max(dmax, d.max())
    cp = c - inS.astype(np.int64); dpre = max(dpre, (Lp - cp).max())
    ps = pr[inS].astype(np.float64)
    for i, s in enumerate(S_LIST):
        x = ps ** (-s); T1[i] += x.sum(); T3[i] += (np.log((1 - x) / (1 + x)) + 2 * x).sum()
    nS += int(inS.sum()); npr += len(pr)
while ci < len(CH):
    flush_cp(CH[ci]); ci += 1
# regularised values
mp.mp.dps = 30
def Iint(s, X):  # (1/2) int_2^X x^(b-1-s)/log x dx
    z = mp.mpc(s) - B; a, c_ = mp.log(2), mp.log(X)
    npts = max(2, int(abs(z.imag) * (c_ - a) / 3) + 2)
    return 0.5 * mp.quad(lambda u: mp.exp(-z * u) / u, mp.linspace(a, c_, npts))
res = []
for cpt in out["checkpoints"]:
    X = cpt["X"]; row = {"X": X, "A": [], "G": []}
    for i, s in enumerate(S_LIST):
        t1 = mp.mpc(*cpt["T1"][i]); t3 = mp.mpc(*cpt["T3"][i])
        A = t1 - Iint(s, X)
        z = mp.mpc(s) - B; w = z * mp.log(2)
        Ein = mp.quad(lambda t: (1 - mp.exp(-w * t)) / t, [0, 1]) if w != 0 else mp.mpf(0)
        Gred = mp.log(2) * mp.exp(mp.euler) * mp.exp(-Ein) * mp.exp(-2 * A + t3)   # G(s)/(s-b)
        row["A"].append([float(A.real), float(A.imag)]); row["G"].append([float(Gred.real), float(Gred.imag)])
    res.append(row)
out["s_list"] = [[complex(s).real, complex(s).imag] for s in S_LIST]; out["regularised"] = res
print("\nA_X(s) = sum_{p in S, p<=X} p^-s - (1/2) int_2^X x^(b-1-s)/log x dx   and   G(s)/(s-b) from the continuation formula")
for i, s in enumerate(S_LIST):
    print(f"s={s}")
    for row in res:
        a = row["A"][i]; g = row["G"][i]
        print(f"   X={row['X']:.0e}  A_X={a[0]:+.9f}{a[1]:+.9f}i   G/(s-b)={g[0]:+.9f}{g[1]:+.9f}i")
json.dump(out, open(f"step1_{N:.0e}.json", "w"), indent=1)
