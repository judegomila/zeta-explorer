"""analyze_packets.py <outdir> -> packets_summary.json (+ printed tables)"""
import sys, os, glob, json, math
import numpy as np
import pklib as L
from run_packets import KEYS
K = {k: i for i, k in enumerate(KEYS)}
V = L.VARIANTS
outdir = sys.argv[1]
summ = {}
for fn in sorted(glob.glob(os.path.join(outdir, "T*.npz")), key=lambda f: float(np.load(f)["T0"])):
    d = np.load(fn); T0 = float(d["T0"])
    S = {"T0": T0, "sqrt_v": math.sqrt(T0 / (2 * math.pi))}
    meta = d["meta"]
    S["blocks"] = int(len(meta)); S["window_alias_pairs"] = int(meta[:, 3].sum()); S["prime_powers"] = float(meta[:, 4].sum())
    S["sieve_length"] = float(meta[:, 5].sum()); S["tnr_windows_with_power_of_3"] = int(meta[:, 6].sum())
    # ---- test 1: theta over all (p,k,h,window)
    th = {v: {"max_thpos_re": -1e300, "n": 0, "fail_pos": 0, "min_nu": 1e300, "max_thc_re": -1e300, "fail_c": 0, "max_thc_abs": 0.0,
              "max_dev_uniform": 0.0} for v in V}
    z2 = {v: [0.0, 0] for v in V}; z2o = {v: [0.0, 0] for v in V}; z2u = {v: [0.0, 0] for v in V}
    zmax = {v: 0.0 for v in V}
    fal = {v: {} for v in V}
    per_p = {}
    cum = None; cum_raw = None; wmin = None; nfull = 0
    for key in d.files:
        if not key.startswith("d_"): continue
        _, p, k = key.split("_"); p = int(p); k = int(k)
        a = d[key].astype(np.float64); hs = d["h_%d_%d" % (p, k)]
        tu = L.theta_uniform(p, k) if p > 2 else 1.0
        for vi, v in enumerate(V):
            tp = a[:, :, vi, K["thpos_re"]]; nu = a[:, :, vi, K["nu"]]; tc = a[:, :, vi, K["thc_re"]]
            t = th[v]
            if p > 2:
                t["max_thpos_re"] = max(t["max_thpos_re"], float(np.nanmax(tp))); t["n"] += tp.size
                t["fail_pos"] += int(((tp >= 1) | (nu <= 0) | ~np.isfinite(tp)).sum())
                t["max_thc_re"] = max(t["max_thc_re"], float(np.nanmax(tc))); t["fail_c"] += int(((tc >= 1) | ~np.isfinite(tc)).sum())
                t["max_thc_abs"] = max(t["max_thc_abs"], float(np.nanmax(a[:, :, vi, K["thc_abs"]])))
                t["max_dev_uniform"] = max(t["max_dev_uniform"], float(np.nanmax(np.abs(tp - tu))))
            t["min_nu"] = min(t["min_nu"], float(nu.min()))
            if k == 1:
                zz = a[:, :, vi, K["z"]] ** 2
                z2[v][0] += zz.sum(); z2[v][1] += zz.size; zmax[v] = max(zmax[v], float(np.sqrt(zz.max())))
                over = (1 - hs / p) < 1 / (2 * math.pi)
                z2o[v][0] += zz[over].sum(); z2o[v][1] += zz[over].size
                z2u[v][0] += zz[~over].sum(); z2u[v][1] += zz[~over].size
                if p > 2:
                    fal[v][p] = [float((a[:, :, vi, K["f_alg"]]).mean() * (p - 1)), float((a[:, :, vi, K["f_alg_pos"]]).mean() * (p - 1))]
        # ---- test 3: contract surrogate, full alias sets at k = 1
        if k == 1 and len(hs) == p - 1:
            m, over = L.alias_majorant(p)
            r2 = a[:, :, :, K["r"]] ** 2; raw2 = a[:, :, :, K["rho_raw"]] ** 2      # [h, W, NV]
            c2 = (m[:, None, None] * r2).sum(0); c2raw = (m[:, None, None] * raw2).sum(0)      # [W, NV]
            Sb = m.sum()
            pp = {"W": int(a.shape[1]), "sqrtSbar": math.sqrt(Sb), "alpha_gt1_majorant_share": float(m[over].sum() / Sb), "alpha_gt1_majorant_share_paired": float(m[over].sum() / m[hs > p / 2].sum())}
            for vi, v in enumerate(V):
                c = np.sqrt(c2[:, vi])
                sh = float((m[over, None] * r2[over, :, vi]).sum() / (m[:, None] * r2[:, :, vi]).sum()) if over.any() else 0.0
                pp[v] = {"c_max": float(c.max()), "c_mean": float(c.mean()), "c_raw_max": float(np.sqrt(c2raw[:, vi]).max()),
                         "viol_Rex": float((c >= L.R_EX).mean()), "viol_raw_Rex": float((np.sqrt(c2raw[:, vi]) >= L.R_EX).mean()),
                         "alpha_gt1_measured_share": sh,
                         "alpha_gt1_measured_share_paired": float((m[over, None] * r2[over, :, vi]).sum() / (m[hs > p / 2, None] * r2[hs > p / 2][:, :, vi]).sum()) if over.any() else 0.0}
            tau = 1.1 * pp["ZETA"]["c_max"]
            for vi, v in enumerate(V):
                pp[v]["viol_matched"] = float((np.sqrt(c2[:, vi]) >= tau).mean())
            pp["tau_matched"] = tau
            per_p[p] = pp
            nfull += 1
            w = a.shape[1]
            if cum is None: cum = c2.copy(); cum_raw = c2raw.copy(); wmin = w
            else:
                wmin = min(wmin, w); cum = cum[:wmin] + c2[:wmin]; cum_raw = cum_raw[:wmin] + c2raw[:wmin]
    S["theta"] = th
    S["mean_z2_k1"] = {v: z2[v][0] / max(1, z2[v][1]) for v in V}
    S["mean_z2_k1_alpha_gt1"] = {v: z2o[v][0] / max(1, z2o[v][1]) for v in V}
    S["mean_z2_k1_alpha_le1"] = {v: z2u[v][0] / max(1, z2u[v][1]) for v in V}
    S["n_z2"] = z2["ZETA"][1]; S["max_z_k1"] = zmax
    S["f_alg_times_pm1"] = {v: {str(p): fal[v][p] for p in sorted(fal[v])} for v in V}
    S["per_prime"] = {str(p): per_p[p] for p in sorted(per_p)}
    # pooled over primes with a full alias set: matched threshold tau_p = 1.1 max_j c_p(zeta), and the fixed budget
    pool = {}
    wt = sum(per_p[p]["W"] for p in per_p)
    for v in V:
        pool[v] = {"viol_matched": sum(per_p[p]["W"] * per_p[p][v]["viol_matched"] for p in per_p) / max(1, wt),
                   "viol_Rex": sum(per_p[p]["W"] * per_p[p][v]["viol_Rex"] for p in per_p) / max(1, wt),
                   "viol_raw_Rex": sum(per_p[p]["W"] * per_p[p][v]["viol_raw_Rex"] for p in per_p) / max(1, wt),
                   "max_c_over_sqrtSbar": max([per_p[p][v]["c_max"] / per_p[p]["sqrtSbar"] for p in per_p] or [0]),
                   "max_c": max([per_p[p][v]["c_max"] for p in per_p] or [0]),
                   "mean_c2_ratio_to_zeta": float(np.mean([(per_p[p][v]["c_mean"] / per_p[p]["ZETA"]["c_mean"]) ** 2 for p in per_p])) if per_p else 0.0}
    S["pooled_per_prime"] = {"windows": wt, "primes": sorted(per_p), **pool}
    if cum is not None:
        C = {"primes_with_full_alias_set": nfull, "common_windows": int(wmin)}
        cz = np.sqrt(cum[:, 0]); tau = 1.1 * cz.max()
        C["tau_matched"] = float(tau)
        for vi, v in enumerate(V):
            c = np.sqrt(cum[:, vi]); cr = np.sqrt(cum_raw[:, vi])
            C[v] = {"C_max": float(c.max()), "C_mean": float(c.mean()), "C_raw_max": float(cr.max()), "viol_Rex": float((c >= L.R_EX).mean()),
                    "viol_raw_Rex": float((cr >= L.R_EX).mean()), "viol_matched": float((c >= tau).mean())}
        S["cumulative"] = C
    summ["%.6e" % T0] = S
json.dump(summ, open(os.path.join(outdir, "packets_summary.json"), "w"), indent=1)
def row(*c): print("| " + " | ".join(str(x) for x in c) + " |")
print("\nTEST 1 positive envelope: max Re theta_phys / failing fraction / min nu")
row("T0", *V)
for t, S in summ.items(): row(t, *["%.4g / %.3g / %.3g" % (S["theta"][v]["max_thpos_re"], S["theta"][v]["fail_pos"] / max(1, S["theta"][v]["n"]), S["theta"][v]["min_nu"]) for v in V])
print("\nTEST 1 complex kernel: max Re theta / failing fraction")
for t, S in summ.items(): row(t, *["%.4g / %.3g" % (S["theta"][v]["max_thc_re"], S["theta"][v]["fail_c"] / max(1, S["theta"][v]["n"])) for v in V])
print("\nmean z^2 (k=1), n")
for t, S in summ.items(): row(t, S["n_z2"], *["%.4f" % S["mean_z2_k1"][v] for v in V])
print("\nTEST 3 cumulative: C_max / viol R_ex / viol matched ; raw max")
for t, S in summ.items():
    if "cumulative" in S:
        C = S["cumulative"]; row(t, C["primes_with_full_alias_set"], C["common_windows"], *["%.3g / %.3g / %.3g ; %.3g" % (C[v]["C_max"], C[v]["viol_Rex"], C[v]["viol_matched"], C[v]["C_raw_max"]) for v in V])
print("\nTEST 3 per prime pooled: windows | max c_p | viol R_ex | viol at matched threshold | mean c^2 / zeta")
for t, S in summ.items():
    P_ = S["pooled_per_prime"]; row(t, P_["windows"], len(P_["primes"]), *["%.3g / %.3g / %.3g / %.2f" % (P_[v]["max_c"], P_[v]["viol_Rex"], P_[v]["viol_matched"], P_[v]["mean_c2_ratio_to_zeta"]) for v in V])
print("\nmean z^2 alpha>1 aliases / alpha<=1 aliases")
for t, S in summ.items(): row(t, *["%.3f / %.3f" % (S["mean_z2_k1_alpha_gt1"][v], S["mean_z2_k1_alpha_le1"][v]) for v in V])
print("\nalpha>1 share measured (p=7, p=97) vs majorant")
for t, S in summ.items():
    for p in ("7", "97"):
        if p in S["per_prime"]:
            pp = S["per_prime"][p]; row(t, p, "%.4f" % pp["alpha_gt1_majorant_share"], *["%.4f" % pp[v]["alpha_gt1_measured_share"] for v in V])
