"""mk_tables.py -> tables.md from packets_summary.json, dh/dh_summary.json"""
import json, math, sys
S = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "out/packets_summary.json"))
D = json.load(open("dh/dh_summary.json"))
V = ["ZETA", "CHI5", "CHI101", "SGN", "UNI", "EA", "TNR"]
ks = sorted(S, key=float)
o = []
def row(*c): o.append("| " + " | ".join(str(x) for x in c) + " |")
tot_pairs = sum(S[t]["window_alias_pairs"] for t in ks); tot_len = sum(S[t]["sieve_length"] for t in ks); tot_pp = sum(S[t]["prime_powers"] for t in ks)
cw = [t for t in ks if float(t) >= 2.99e12]
o.append("Totals: %d heights, %d (window, alias) pairs, sieved length %.3e, prime powers processed %.3e. In the contract window T >= 3.0e12: %d heights, %d pairs." % (
    len(ks), tot_pairs, tot_len, tot_pp, len(cw), sum(S[t]["window_alias_pairs"] for t in cw)))
o.append("\n### T1a. Combination (1), positive envelope: max Re theta_phys / fraction of windows failing (theta >= 1 or normaliser <= 0) / min normaliser nu  (p >= 3)\n")
row("T0", "windows", *V); row(*["---"] * (2 + len(V)))
for t in ks:
    th = S[t]["theta"]; row("%.3e" % float(t), th["ZETA"]["n"], *["%.4g / %.3g / %.3g" % (th[v]["max_thpos_re"], th[v]["fail_pos"] / max(1, th[v]["n"]), th[v]["min_nu"]) for v in V])
o.append("\n### T1b. Combination (1), complex packet kernel n^(-sigma_B - iT) psi: max Re theta / failing fraction\n")
row("T0", *V); row(*["---"] * (1 + len(V)))
for t in ks:
    th = S[t]["theta"]; row("%.3e" % float(t), *["%.3g / %.2g" % (th[v]["max_thc_re"], th[v]["fail_c"] / max(1, th[v]["n"])) for v in V])
o.append("\n### T3a. Normalised remainder of the stationary-twist packet sum, k = 1: mean z^2 (z = |R|/sqrt(M2)); alpha > 1 aliases / alpha <= 1 aliases in brackets\n")
row("T0", "pairs", *V); row(*["---"] * (2 + len(V)))
for t in ks:
    row("%.3e" % float(t), S[t]["n_z2"], *["%.3f (%.3f / %.3f)" % (S[t]["mean_z2_k1"][v], S[t]["mean_z2_k1_alpha_gt1"][v], S[t]["mean_z2_k1_alpha_le1"][v]) for v in V])
o.append("\n### T3b. Contract surrogate per prime, pooled over the primes with a full alias set: max c_p / fraction of windows with c_p >= R_ex / fraction above the matched threshold 1.1 max c_p(zeta) / mean c_p^2 relative to zeta\n")
row("T0", "primes", "windows", *V); row(*["---"] * (3 + len(V)))
for t in ks:
    P = S[t]["pooled_per_prime"]
    row("%.3e" % float(t), len(P["primes"]), P["windows"], *["%.3g / %.2g / %.3g / %.2f" % (P[v]["max_c"], P[v]["viol_Rex"], P[v]["viol_matched"], P[v]["mean_c2_ratio_to_zeta"]) for v in V])
o.append("\n### T3c. Cumulative over the primes with a full alias set (common windows): max C / raw max (pole term kept) ; budget R_ex = 0.2797, majorant value sqrt(sum Sbar_p) = 1.867 for all 25 primes\n")
row("T0", "primes", "common windows", *V); row(*["---"] * (3 + len(V)))
for t in ks:
    if "cumulative" in S[t]:
        C = S[t]["cumulative"]; row("%.3e" % float(t), C["primes_with_full_alias_set"], C["common_windows"], *["%.3g / %.3g" % (C[v]["C_max"], C[v]["C_raw_max"]) for v in V])
o.append("\n### T3d. Windows of the T-NR control containing a power of q = 3, and worst single-prime contract value of T-NR\n")
row("T0", "T-NR windows with a power of 3", "of", "max c_p (T-NR)", "max c_p (zeta)"); row(*["---"] * 5)
for t in ks:
    P = S[t]["pooled_per_prime"]; row("%.3e" % float(t), S[t]["tnr_windows_with_power_of_3"], S[t]["window_alias_pairs"], "%.3g" % P["TNR"]["max_c"], "%.3g" % P["ZETA"]["max_c"])
o.append("\n### T2b. Share of the measured weld mass sum_h m_h r_h^2 on the alpha > 1 aliases (k = 1, h > 0.8408 p), p = 7 and p = 97; majorant share in the same convention 0.2369 (p = 7), 0.2963 (p = 97); in the paired convention of the record 0.4738, 0.5926\n")
row("T0", "p", "paired majorant", *[v + " (all h / paired)" for v in V]); row(*["---"] * (3 + len(V)))
for t in ks:
    for p in ("7", "97"):
        if p in S[t]["per_prime"]:
            pp = S[t]["per_prime"][p]; row("%.3e" % float(t), p, "%.4f" % pp.get("alpha_gt1_majorant_share_paired", float("nan")), *["%.3f / %.3f" % (pp[v]["alpha_gt1_measured_share"], pp[v].get("alpha_gt1_measured_share_paired", float("nan"))) for v in V])
o.append("\n### T4w. Windowed sieve-algebra fraction: mean of f (p-1) over windows, chirp kernel / positive envelope; value 1/(1 + p(p-2)) * (p-1) for a prime-supported vector with no pole: p=7: 0.167, p=97: 0.0104\n")
row("T0", "p", *V); row(*["---"] * (2 + len(V)))
for t in ks:
    for p in ("7", "97"):
        f = S[t]["f_alg_times_pm1"]
        if p in f["ZETA"]: row("%.3e" % float(t), p, *["%.3g / %.3g" % tuple(f[v][p]) for v in V])
o.append("\n### TD. Davenport-Heilbronn through Lambda_DH (table front end, all n in the block); zeta by the same front end\n")
row("T0", "object", "theta windows", "theta fail fraction", "max Re theta", "min nu", "complex-kernel fail fraction", "mean z^2 (k=1)", "mean r", "max r", "max c_p", "c_p >= R_ex"); row(*["---"] * 12)
for t in sorted(D, key=float):
    for name in ("DH", "ZETA_table"):
        x = D[t][name]; pp = x["per_prime"]
        row("%.0e" % float(t), name, x["theta_windows"], "%.3f" % x["theta_fail_frac"], "%.4g" % x["max_thpos_re"], "%.3g" % x["min_nu"], "%.4f" % x["theta_complex_fail_frac"],
            "%.3f" % x["mean_z2_k1"], "%.4f" % x["mean_r_k1"], "%.3f" % x["max_r_k1"], "%.3g" % max(v["c_max"] for v in pp.values()), "%.2g" % (sum(v["W"] * v["viol_Rex"] for v in pp.values()) / sum(v["W"] for v in pp.values())))
open("tables.md", "w").write("\n".join(o) + "\n")
print("\n".join(o))
