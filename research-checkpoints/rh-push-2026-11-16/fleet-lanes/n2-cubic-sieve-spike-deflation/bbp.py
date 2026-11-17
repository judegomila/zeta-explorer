"""Invert the rank-one-perturbation outlier map s^2 = (theta + a)(theta + b)/theta (a = Frobenius/cols, b = Frobenius/rows)
to get spike strengths theta_j from the measured singular values, then fit theta_j ~ j^{-beta} and theta_1 ~ (KD)^{2/3}.
Model step (independent-noise outlier formula applied to a non-random matrix): evidence only."""
import json, glob, math, sys
import numpy as np
OUT = sys.argv[0].rsplit("/", 1)[0]
R = [json.load(open(f)) for f in glob.glob(OUT + "/svd_K*.json")]
R.sort(key=lambda r: (r["K"] != r["D"], r["K"] * r["D"], r["K"]))
th1 = []
for r in R:
    if r["K"] > r["D"]:
        continue
    a = r["fro"] / r["nc"]; b = r["fro"] / r["nr"]
    s2 = np.array(r["s2"]); edge = (math.sqrt(a) + math.sqrt(b)) ** 2
    ok = s2 > 1.02 * edge
    x = s2[ok] - a - b
    th = (x + np.sqrt(np.maximum(x * x - 4 * a * b, 0))) / 2
    n = len(th); X = (r["K"] * r["D"]) ** (2 / 3)
    line = f"K={r['K']} D={r['D']}: edge (a,b form) {edge:.0f}; outliers {n}; theta_1/(KD)^(2/3) = {th[0]/X:.4f}" if n else f"K={r['K']} D={r['D']}: no outliers"
    if n >= 12:
        j = np.arange(1, n + 1)
        sl = np.polyfit(np.log(j[1:]), np.log(th[1:]), 1)
        line += f"; theta_j ~ j^beta over j=2..{n}: beta = {sl[0]:.3f}; theta_2/theta_1 = {th[1]/th[0]:.3f}"
        # counting law N(T) = c (KD)^2 / T^3 on theta
        c = [(k + 1) * th[k] ** 3 / (r['K'] * r['D']) ** 2 for k in (4, 9, 19, 39) if k < n]
        line += "; j*theta_j^3/(KD)^2 at j=5,10,20,40: " + " ".join(f"{v:.5f}" for v in c)
    print(line)
    if n and th[0] > 0: th1.append((r["K"], r["D"], th[0]))
A = np.array([[1, math.log(k), math.log(d)] for k, d, t in th1]); y = np.log([t for k, d, t in th1])
co = np.linalg.lstsq(A, y, rcond=None)[0]
print(f"fit theta_1 = c K^a D^b over {len(th1)} shapes (K <= D): a = {co[1]:.3f}, b = {co[2]:.3f}, c = {math.exp(co[0]):.4f}")
A = np.array([[1, math.log(r["K"]), math.log(r["D"])] for r in R if r["K"] <= r["D"]]); y = np.log([r["rayleigh"][0][1] - r["fro"] / r["nc"] for r in R if r["K"] <= r["D"]])
co = np.linalg.lstsq(A, y, rcond=None)[0]
print(f"fit Rayleigh excess of w_1 = c K^a D^b over {len(y)} shapes (K <= D): a = {co[1]:.3f}, b = {co[2]:.3f}, c = {math.exp(co[0]):.4f}")
print("literature constant: ((2 pi)^(2/3)/(3 Gamma(2/3)))^2 * (1.5 * density)^2 =", (( (2*math.pi)**(2/3)/(3*math.gamma(2/3)))**2) * (1.5 * 6340/18000)**2)
