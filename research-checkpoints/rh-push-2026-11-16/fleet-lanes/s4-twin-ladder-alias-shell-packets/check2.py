"""check2.py -- 40-digit recomputation of theta (combination 2) for small grids, compared with the float64 values of a run file;
also CPU float64 (loc_c2.json) against GPU float64 (c2.json) on the common cases."""
import json, sys
import mpmath as mp
mp.mp.dps = 40
f = sys.argv[1] if len(sys.argv) > 1 else "c2.json"
R = {(r["p"], r["D"]): r for r in json.load(open(f))["theta"]}


def gram(a, u, b, v):
    D = abs(u - v)
    if a == b: return mp.e ** (-a * D) * (D + 1 / a)
    return (2 * a * mp.e ** (-b * D) - 2 * b * mp.e ** (-a * D)) / (a * a - b * b)


def theta(p, D, r, leg=False):
    ns = [n for n in range(1, p * D + 1) if n % p]; d = [mp.mpf(n) / p for n in ns]
    mu = [x ** (mp.mpf(1) / 3) / mp.mpf("1.7") for x in d]; u = [mp.mpf("2.3") / x for x in d]
    ph = []
    for n in ns:
        h = (-n) % p; z = mp.expjpi(mp.mpf(2 * ((h * r) % p)) / p)
        if leg: z *= (1 if pow(h, (p - 1) // 2, p) == 1 else -1)
        ph.append(z)
    num = den = 0
    for i in range(len(ns)):
        for j in range(len(ns)):
            G = gram(mu[i], u[i], mu[j], u[j]); num += mp.conj(ph[i]) * G * ph[j]; den += G
    return mp.re(num) / den


out = []; worst = 0
for p, D in [(2, 16), (3, 8), (3, 64), (5, 5), (5, 32), (7, 6), (7, 16), (97, 2)]:
    if (p, D) not in R: continue
    row = dict(p=p, D=D)
    for key in ["ARITH_r1", "LEG"]:
        if key not in R[(p, D)]["theta"]: continue
        t = theta(p, D, 1, leg=(key == "LEG")); row[key] = [float(t), R[(p, D)]["theta"][key]]; worst = max(worst, abs(float(t) - R[(p, D)]["theta"][key]))
    out.append(row); print(row, flush=True)
res = dict(file=f, rows=out, max_abs_diff_mp40_vs_float64=worst)
try:
    L = {(r["p"], r["D"]): r for r in json.load(open("loc_c2.json"))["theta"]}; w2 = 0; n = 0
    for k in L:
        if k in R:
            for key, v in L[k]["theta"].items():
                if key.startswith("ARITH") or key in ("LEG", "ABS"): w2 = max(w2, abs(v - R[k]["theta"][key])); n += 1
    res["cpu_vs_gpu_max_abs_diff"] = w2; res["cpu_vs_gpu_values"] = n
except FileNotFoundError:
    pass
print(res["max_abs_diff_mp40_vs_float64"], res.get("cpu_vs_gpu_max_abs_diff"))
json.dump(res, open("check2.json", "w"), indent=1)
