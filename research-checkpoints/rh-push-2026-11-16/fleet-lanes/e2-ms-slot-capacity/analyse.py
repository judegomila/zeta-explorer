import json, glob, math, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
for rows in ("sf", "all"):
    data = {}
    for f in glob.glob(os.path.join(HERE, f"slot_{rows}_U*.json")):
        for d in json.load(open(f)):
            data.setdefault((d["r"], d["z"], d["k"], d["w"]), []).append(d)
    print(f"\n=== rows: {rows} ===")
    print("columns per U: n | I(1)/tr | I(best Gauss)/tr [name] | sup/tr lower..upper | (1+sqrt(n/R))^2")
    for key in sorted(data):
        r, z, k, w = key
        L = sorted(data[key], key=lambda d: d["U"])
        print(f"\n r={r} z={z} order={6//math.gcd(6,k) if k!=1 else 6} (k={k}) weight={w}   [r+z={r+z:.3f}, r+2z={r+2*z:.3f}; general-sieve exponent 2(1+r+z)/3-1={2*(1+r+z)/3-1:.3f}]")
        xs, ys, yg = [], [], []
        for d in L:
            tr = d["tr"]; bg = d["best_gauss"]
            rm = (1 + math.sqrt(d["n"] / d["R"])) ** 2
            print(f"   U={int(d['U']):7d} R={d['R']:7d} n={d['n']:5d} | {d['I_ones']/tr:6.3f} | {d['I_gauss'][bg]/tr:6.3f} [{bg:8s}] | {d['sup_lb']/tr:6.3f} .. {d['sup_ub']/tr:6.3f} | {rm:5.3f} | sup/rm {d['sup_lb']/tr/rm:5.3f} | start {d['sup_start']}")
            if d["n"] >= 8:
                xs.append(math.log(d["U"])); ys.append(math.log(d["sup_lb"] / tr)); yg.append(math.log(d["I_gauss"][bg] / tr))
        if len(xs) >= 4:
            A = np.vstack([xs, np.ones(len(xs))]).T
            for nm, y in (("sup/tr", ys), ("Gauss/tr", yg)):
                c, res, *_ = np.linalg.lstsq(A, np.array(y), rcond=None)
                se = math.sqrt(res[0] / (len(xs) - 2) / ((np.array(xs) - np.mean(xs)) ** 2).sum()) if len(res) and len(xs) > 2 else float("nan")
                print(f"   fitted exponent of {nm} in U (n >= 8, {len(xs)} sizes): {c[0]:+.3f} +- {se:.3f}")
