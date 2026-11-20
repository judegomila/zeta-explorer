"""analyze_dh.py <dhdir> -> dh_summary.json : Davenport-Heilbronn (column 0) and zeta by the table front end (column 1)."""
import sys, os, glob, json, math
import numpy as np
import pklib as L
from run_packets import KEYS
K = {k: i for i, k in enumerate(KEYS)}
out = {}
for fn in sorted(glob.glob(os.path.join(sys.argv[1], "DH_T*.npz"))):
    d = np.load(fn); T0 = float(d["T0"]); S = {}
    for ci, name in ((0, "DH"), (1, "ZETA_table")):
        n = 0; fail = 0; mx = -1e300; mn = 1e300; z2 = 0.0; nz = 0; failc = 0; rmax = 0.0; rsum = 0.0
        perp = {}
        for key in d.files:
            if not key.startswith("d_"): continue
            _, p, k = key.split("_"); p = int(p); k = int(k); a = d[key].astype(np.float64)[:, :, ci, :]; hs = d["h_%d_%d" % (p, k)]
            tp = a[:, :, K["thpos_re"]]; nu = a[:, :, K["nu"]]
            if p > 2:
                n += tp.size; fail += int(((tp >= 1) | (nu <= 0) | ~np.isfinite(tp)).sum()); mx = max(mx, float(np.nanmax(tp)))
                failc += int((a[:, :, K["thc_re"]] >= 1).sum())
            mn = min(mn, float(nu.min()))
            if k == 1:
                z2 += (a[:, :, K["z"]] ** 2).sum(); nz += tp.size; rmax = max(rmax, float(a[:, :, K["r"]].max())); rsum += a[:, :, K["r"]].sum()
                if len(hs) == p - 1:
                    m, over = L.alias_majorant(p)
                    c = np.sqrt((m[:, None] * a[:, :, K["r"]] ** 2).sum(0))
                    perp[p] = {"W": int(a.shape[1]), "c_max": float(c.max()), "c_mean": float(c.mean()), "viol_Rex": float((c >= L.R_EX).mean()), "sqrtSbar": float(math.sqrt(m.sum()))}
        S[name] = {"theta_windows": n, "theta_fail_frac": fail / max(1, n), "max_thpos_re": mx, "min_nu": mn, "theta_complex_fail_frac": failc / max(1, n),
                   "mean_z2_k1": z2 / max(1, nz), "n_k1": nz, "max_r_k1": rmax, "mean_r_k1": rsum / max(1, nz), "per_prime": perp}
    for p in S["DH"]["per_prime"]:
        tau = 1.1 * S["ZETA_table"]["per_prime"][p]["c_max"]
        S["DH"]["per_prime"][p]["ratio_mean_c_to_zeta"] = S["DH"]["per_prime"][p]["c_mean"] / S["ZETA_table"]["per_prime"][p]["c_mean"]
    out["%.6e" % T0] = S
    print(T0, json.dumps({k: {kk: vv for kk, vv in v.items() if kk != "per_prime"} for k, v in S.items()}))
    pp = S["DH"]["per_prime"]
    print("  DH per prime: max c_p %.3g (p=%s), viol R_ex pooled %.3g, mean c ratio to zeta %.2f" % (
        max(x["c_max"] for x in pp.values()), max(pp, key=lambda q: pp[q]["c_max"]), sum(x["W"] * x["viol_Rex"] for x in pp.values()) / sum(x["W"] for x in pp.values()),
        np.mean([x["ratio_mean_c_to_zeta"] for x in pp.values()])))
json.dump(out, open(os.path.join(sys.argv[1], "dh_summary.json"), "w"), indent=1)
