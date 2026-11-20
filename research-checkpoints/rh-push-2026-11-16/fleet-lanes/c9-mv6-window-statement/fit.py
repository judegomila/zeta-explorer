"""fit.py -- exponents in the window from the w_Z*_P*.json files (float screen).
 e_v = least-squares slope of log(ratio_v) against log X over grid points with Z/P < X <= Z P and X >= Xmin (default 400: at least ~1450 rows in the Gaussian).
 The mean square is X^(1 + e_v) up to constants; (E-K) is e_v = 0.  cross: slope of log(cr_v) where cr_v > 0 at every point used."""
import json, sys, math, glob
import numpy as np
Xmin = 400.0
for fn in sorted(glob.glob("w_Z*_P*.json"), key=lambda f: json.load(open(f))["Z"]):
    if "_v1" in fn: continue
    d = json.load(open(fn)); Z, P = d["Z"], d["P"]
    if not P: continue
    X = np.array(d["X"]); R = np.array(d["ratio"]); names = d["names"]
    sel = (X > Z / P) & (X <= Z * P * 1.0001) & (X >= Xmin)
    print(f"\n{fn}: Z={Z:g} P={P:g} N={Z*P:g} columns={d['columns']} rows={d['rows']}; window points used {int(sel.sum())}: X = {X[sel].min():g} .. {X[sel].max():g}")
    lx = np.log(X[sel])
    for k in ["THETA", "THETA*G", "LIOU", "LIOU*G", "ALIGNED", "THIN", "U", "RAND1", "MUG"]:
        r = R[sel, names.index(k)]
        e = np.polyfit(lx, np.log(r), 1)[0]
        print(f"  {k:8s} ratio min {r.min():.4f} max {r.max():.4f}  at lower end {r[0]:.4f}  at X=N {r[-1]:.4f}  slope e = {e:+.4f}")
    if "slot" in d:
        sn = d["slot"]["names"]; rows = np.array(d["slot"]["rows"]); rs = rows[sel]
        for t, k in enumerate(sn):
            sd = rs[:, 2 + 2 * t]; cr = rs[:, 3 + 2 * t]
            msg = f"  slot {k:8s} sd min {sd.min():.4f} max {sd.max():.4f}; cr min {cr.min():+.4f} max {cr.max():+.4f}; cr at lower end {cr[0]:+.4f}, at X=N {cr[-1]:+.4f}"
            if (cr > 0).all(): msg += f"; slope of log cr = {np.polyfit(lx, np.log(cr), 1)[0]:+.3f}"
            print(msg)
