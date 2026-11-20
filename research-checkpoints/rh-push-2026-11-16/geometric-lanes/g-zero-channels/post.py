"""Post-process channel certificates: exact chain + disjointness checks (Fractions), scaling table."""
import json, sys, glob, math
from fractions import Fraction as Fr
def load(pat):
    recs = []
    meta = None
    for fn in sorted(glob.glob(pat)):
        d = json.load(open(fn)); recs += d["recs"]; meta = {k: v for k, v in d.items() if k != "recs"}
    return recs, meta
main, meta = load("main_*.json")
back, bmeta = load("back_*.json")
print("main meta", meta, "records", len(main))
by = {}
for r in main:
    by.setdefault(r["k"], {})[Fr(r["t0"])] = r
ks = sorted(by)
taus = sorted(by[ks[0]])
assert all(sorted(by[k]) == taus for k in ks), "cell sets differ"
assert all(r["ok"] and r["contiguous"] for r in main), "some cell failed"
GR = [Fr(11, 10)**i/500 for i in range(0, 81)]
fail = 0
R = {}
for k in ks:
    for t in taus:
        r = by[k][t]; y = Fr(r["y"])
        gaps = []
        for kk in (k-1, k+1):
            if kk in by: gaps.append(abs(Fr(by[kk][t]["y"])-y))
        if k == ks[0]: gaps.append(y)      # mirror zero below the real axis is at distance 2y
        cap = Fr(49, 100)*min(gaps)
        rmax, rin = Fr(r["r_max"]), Fr(r["r_in"])
        cand = [g for g in GR if rin <= g <= min(rmax, cap)]
        if not cand: fail += 1; print("no admissible radius", k, t); continue
        R[(k, t)] = cand[-1]
# disjointness within each cell
for k in ks[:-1]:
    for t in taus:
        d = abs(Fr(by[k][t]["y"])-Fr(by[k+1][t]["y"]))
        if not R[(k, t)]+R[(k+1, t)] < d: fail += 1; print("overlap", k, t)
# chain: zero localised in D(c_i, r_in_i) must lie in D(c_j, R_j) for the adjacent cell j (both directions)
for k in ks:
    for i in range(len(taus)-1):
        a, b = taus[i], taus[i+1]
        ya, yb = Fr(by[k][a]["y"]), Fr(by[k][b]["y"])
        if not (abs(ya-yb)+Fr(by[k][a]["r_in"]) < R[(k, b)] and abs(ya-yb)+Fr(by[k][b]["r_in"]) < R[(k, a)]):
            fail += 1; print("chain break", k, a, b)
print("zeros", len(ks), "cells per zero", len(taus), "tau range", float(taus[0])-float(Fr(main[0]["w"])), float(taus[-1])+float(Fr(main[0]["w"])), "FAILURES", fail)
# backward reach
reach = {}
for r in back:
    k = r["k"]; lo = float(Fr(r["t0"])-Fr(r["w"]))
    if r["ok"]: reach[k] = min(reach.get(k, 0.0), lo)
    else: reach.setdefault(k, 0.0)
import os
if os.path.exists("reach_backward.json"):
    reach = {int(k): v[0] for k, v in json.load(open("reach_backward.json")).items()}   # chain-checked reach
full = {k for k in reach if abs(reach[k]+2.0) < 1e-9}
# table
t0 = min(t for t in taus if t > 0)
rows = []
M2 = 0.0057429   # 8 int u^2 Phi = xi''(1/2)/4
for k in ks:
    y0 = float(Fr(by[k][t0]["y"]))
    ys = [float(Fr(by[kk][t0]["y"])) for kk in (k-1, k+1) if kk in by]
    g = min(abs(y-y0) for y in ys)
    mean = 2*math.pi/math.log(y0/(2*math.pi))
    r = by[k][t0]
    mumin = min(by[k][t]["mu_best"] for t in taus)
    rows.append(dict(k=k, y=y0, A=r["A"], g=g, gn=g/mean, mu0=r["mu_best"], mumin=mumin, rmax=float(Fr(r["r_max"])),
                     rmax_g=float(Fr(r["r_max"]))/g, absm=r["abs_best"], dPR=r["abs_best"]/M2, reach=reach.get(k),
                     vel=(float(Fr(by[k][taus[-1]]["y"]))-float(Fr(by[k][t0]["y"])))/float(taus[-1]-t0)))
json.dump(rows, open("table.json", "w"), indent=0)
print("| k | gamma_k(tau=.025) | min gap g | g/mean | |F_s| lower | mu(0) | min mu | r_max | r_max/g | abs margin | PR57 delta | back reach | d gamma/d tau |")
print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
for r in rows:
    if True:
        print("| %d | %.4f | %.3f | %.2f | %.2e | %.3f | %.3f | %.3f | %.2f | %.2e | %.1e | %s | %.3f |" % (
            r["k"], r["y"], r["g"], r["gn"], r["A"], r["mu0"], r["mumin"], r["rmax"], r["rmax_g"], r["absm"], r["dPR"],
            ("<= -2.0" if r["k"] in full else ("%.2f" % r["reach"] if r["reach"] is not None else "n/a")), r["vel"]))
# fits
n = len(rows)
def fit(xs, ys):
    mx = sum(xs)/len(xs); my = sum(ys)/len(ys)
    b = sum((x-mx)*(y-my) for x, y in zip(xs, ys))/sum((x-mx)**2 for x in xs)
    return b, my-b*mx
b, a = fit([r["y"] for r in rows], [math.log(r["absm"]) for r in rows])
print("fit log(abs margin) = %.4f*gamma + %.2f   (pi/4 = %.4f)" % (b, a, math.pi/4))
b, a = fit([math.log(r["y"]) for r in rows], [r["mumin"] for r in rows]); print("fit min mu vs log gamma: slope %.4f intercept %.3f" % (b, a))
b, a = fit([r["gn"] for r in rows], [r["mumin"] for r in rows]); print("fit min mu vs normalised gap: slope %.4f intercept %.3f" % (b, a))
b, a = fit([math.log(r["y"]) for r in rows], [r["rmax_g"] for r in rows]); print("fit rmax/g vs log gamma: slope %.4f intercept %.3f" % (b, a))
for lo, hi in ((1, 25), (26, 50), (51, 75), (76, 100)):
    sub = [r for r in rows if lo <= r["k"] <= hi]
    if sub:
        print("block %d-%d: mean mu(0) %.3f  min mu %.3f  mean r_max/g %.3f  min r_max/g %.3f  mean r_max %.3f  mean vel %.3f" % (
            lo, hi, sum(r["mu0"] for r in sub)/len(sub), min(r["mumin"] for r in sub), sum(r["rmax_g"] for r in sub)/len(sub),
            min(r["rmax_g"] for r in sub), sum(r["rmax"] for r in sub)/len(sub), sum(r["vel"] for r in sub)/len(sub)))
rr = [(r["k"], r["reach"], r["g"]) for r in rows if r["reach"] is not None and r["k"] not in full]
print("backward: zeros with data", sum(1 for r in rows if r["reach"] is not None), " surviving to -2:", len(full))
print("backward certified reach (k, reach, g, reach/g^2):", [(k, round(x, 2), round(g, 2), round(-x/g/g, 2)) for k, x, g in rr])
