"""Fit E in sum_u |M S|^2 ~ U^E from out/U*.json.  E = 1 + slope of log(mean over rows) in log U (the family has ~0.403 U rows).
Reported: mean for true rows, ratio to the random-multiplicative baseline (same code path, same weights), weighted
least-squares slopes with standard errors, and the largest single value as a power of U."""
import json, glob, math, sys
import numpy as np
D = sorted((json.load(open(f)) for f in glob.glob("out/U*.json") if open(f).read().strip()), key=lambda d: d["U"])
names = {0: "m*=0.4183 (Y=1.1640)", 1: "m=1/2 (Y=1.2457)", 2: "b=0.21 (Y=0.9557)"}
def wls(x, y, s):
    x = np.array(x); y = np.array(y); w = 1/np.array(s)**2
    xb = (w*x).sum()/w.sum(); yb = (w*y).sum()/w.sum(); sxx = (w*(x-xb)**2).sum()
    b = (w*(x-xb)*(y-yb)).sum()/sxx; res = y - yb - b*(x-xb); chi2 = (w*res**2).sum()
    return b, 1/math.sqrt(sxx), chi2, len(x)-2
for v in ("mu", "randsign", "mutwist"):
    for s in (0, 1, 2):
        print(f"\n== M coefficients: {v};  S length {names[s]}")
        print("        U     rows  mean_true (se)        mean_base (se)        true/base (se)     max_true/mean  log_U(max/mean)")
        xs, yt, st, yr, sr, yb, sb = [], [], [], [], [], [], []
        for d in D:
            t = d["true"][f"MS_{v}_{s}"]; b = d["randmult"][f"MS_{v}_{s}"]
            ratio = t["mean"]/b["mean"]; rse = ratio*math.hypot(t["se"]/t["mean"], b["se"]/b["mean"])
            print(f"{d['U']:9.0e} {d['rows']:8d}  {t['mean']:.5e} ({t['se']:.1e})  {b['mean']:.5e} ({b['se']:.1e})  {ratio:.4f} ({rse:.4f})   {t['max']/t['mean']:8.1f}   {math.log(t['max']/t['mean'])/math.log(d['U']):.3f}")
            xs.append(math.log(d["U"])); yt.append(math.log(t["mean"])); st.append(t["se"]/t["mean"])
            yb.append(math.log(b["mean"])); sb.append(b["se"]/b["mean"]); yr.append(math.log(ratio)); sr.append(rse/ratio)
        for lo in (1e3, 1e5, 1e6):
            k = [i for i, d in enumerate(D) if d["U"] >= lo]
            if len(k) < 3: continue
            f = lambda y, s_: wls([xs[i] for i in k], [y[i] for i in k], [s_[i] for i in k])
            a = f(yt, st); b_ = f(yb, sb); c = f(yr, sr)
            print(f"   U >= {lo:.0e}: E_true - 1 = {a[0]:+.4f} +- {a[1]:.4f} (chi2 {a[2]:.1f}/{a[3]});  E_base - 1 = {b_[0]:+.4f} +- {b_[1]:.4f};  slope of true/base = {c[0]:+.4f} +- {c[1]:.4f} (chi2 {c[2]:.1f}/{c[3]})")
print("\n== tails, true rows, mu coefficients: #rows with |M S|^2 >= U^c (the detector level is c = delta_c (r+m) = 0.5463 at m*)")
for d in D:
    print(f"{d['U']:9.0e} rows {d['rows']:8d}  c={d['tail_c']}  m*: {d['tail'][0]}  1/2: {d['tail'][1]}")
print("\n== single factors (true rows): mean |M_mu|^2 / diag, mean |S_m*|^2 / diag, max |M|^2, max |S_m*|^2, max |S_1/2|^2")
for d in D:
    t = d["true"]
    print(f"{d['U']:9.0e}  {t['M_mu']['mean']/d['diagM']:.4f}  {t['S_0']['mean']/d['diagS'][0]:.4f}  {t['M_mu']['max']:.3f}  {t['S_0']['max']:.3f}  {t['S_1']['max']:.3f}")
