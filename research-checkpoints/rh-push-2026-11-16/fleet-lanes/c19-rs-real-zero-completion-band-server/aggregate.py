# aggregate.py: tables from res_*.jsonl and owed*.jsonl (text processing only)
import json, glob, statistics as st, collections, sys
R = []
for f in sorted(glob.glob("res_*.jsonl")):
    R += [json.loads(l) for l in open(f)]
out = []
P = lambda *a: out.append(" ".join(str(x) for x in a))
def med(v): return st.median(v) if v else float("nan")
def cls(o):
    if o.startswith("chain"): return "chains(24)"
    return o
key = lambda r: (r["tag"], r["theta"], r["m"])
tags = ["1e6", "1e9", "1e12"]
P("records", len(R), "not-run", sum(1 for r in R if "status" in r))
# undecided against thresholds
def dec(lo, hi, thr):
    if lo is not None and lo >= thr: return "ge"
    if hi is not None and hi < thr: return "lt"
    return "und"
P("\n== band-u records: per (height, theta, m, class): n; s_D min/med/max; s_D certified > 0 count; e_min min/med/max; cert(e_min >= -0.05); cert(e_min < -0.25); e_max med; widest enclosure of e_min")
G = collections.defaultdict(list)
for r in R:
    if "status" in r or r.get("form") == "hybrid": continue
    G[(r["tag"], r["theta"], r["m"], cls(r["obj"]))].append(r)
order = ["zeta", "zeta-rs1", "chains(24)", "liouville", "ZQ eta=0.25", "ZQ eta=0.05", "ZQ eta=0.01", "E_a=0.1", "E_a=0.3", "DH", "T-NR", "HQ2"]
for tag in tags:
    for th in (0.75, 0.8, 0.85):
        for m in (96, 192, 384):
            for c in order:
                v = G.get((tag, th, m, c))
                if not v: continue
                line = [tag, th, m, c, "n=%d" % len(v)]
                if "sD_min" in v[0]:
                    s = [r["sD_min"] for r in v]
                    line += ["sD %.4f %.4f %.4f" % (min(s), med(s), max(s)), "sD>0:%d" % sum(1 for r in v if dec(r["sD_min_lo"], r["sD_min_hi"], 0) == "ge"),
                             "sD<0:%d" % sum(1 for r in v if dec(r["sD_min_lo"], r["sD_min_hi"], 0) == "lt")]
                if "e_min" in v[0]:
                    e = [r["e_min"] for r in v]
                    line += ["e_min %.5f %.5f %.5f" % (min(e), med(e), max(e)), "hold:%d" % sum(1 for r in v if dec(r["e_min_lo"], r["e_min_hi"], -0.05) == "ge"),
                             "fail:%d" % sum(1 for r in v if dec(r["e_min_lo"], r["e_min_hi"], -0.25) == "lt"),
                             "und:%d" % sum(1 for r in v if dec(r["e_min_lo"], r["e_min_hi"], -0.05) == "und"),
                             "e_max med %.5f max %.5f" % (med([r["e_max"] for r in v]), max(r["e_max"] for r in v)),
                             "width %.1e" % max((r["e_min_hi"] - r["e_min_lo"]) if r["e_min_lo"] is not None else 9 for r in v)]
                if "t_min" in v[0]:
                    line += ["t_min min %.2e" % min(r["t_min"] for r in v)]
                if "pair_min" in v[0]:
                    line += ["pair_min med %.5f mu %.5f" % (med([r["pair_min"] for r in v]), med([r["mu_formula"] for r in v])),
                             "max(e_zeta - e_ZQ - mu): see below"]
                P(*line)
# ZQ against zeta: explained by the pair form?
P("\n== ZQ: e_min(ZQ) - e_min(zeta) + abs(pair_min) per (height, theta, m, eta): min, median (>= -0.05 means explained by the pair form)")
Z = {(r["tag"], r["theta"], r["m"], r["w"]): r for r in R if r.get("obj") == "zeta" and r.get("form") != "hybrid" and "status" not in r}
for tag in tags:
    for th in (0.75, 0.8, 0.85):
        for m in (96, 192, 384):
            for eta in (0.25, 0.05, 0.01):
                v = [r for r in R if r.get("obj") == "ZQ eta=%g" % eta and (r["tag"], r["theta"], r["m"]) == (tag, th, m)]
                if not v: continue
                dlt = [r["e_min"] - Z[(tag, th, m, r["w"])]["e_min"] - r["pair_min"] for r in v]
                P(tag, th, m, "eta", eta, "n=%d" % len(v), "min %.5f med %.5f" % (min(dlt), med(dlt)), "e_min(ZQ) med %.5f zeta med %.5f" % (med([r["e_min"] for r in v]), med([Z[(tag, th, m, r["w"])]["e_min"] for r in v])),
                  "sD(ZQ) med %.5f" % med([r["sD_min"] for r in v]), "sD>0:%d" % sum(1 for r in v if r["sD_min_lo"] is not None and r["sD_min_lo"] > 0), "e_max med %.3f" % med([r["e_max"] for r in v]))
P("\n== hybrid (U = Lg): per (height, theta, m, class): n; s_C min/med/max; s_C>=-0.05 cert; f_min med; f_max med; t_min min/max")
H = collections.defaultdict(list)
for r in R:
    if r.get("form") == "hybrid": H[(r["tag"], r["theta"], r["m"], cls(r["obj"]))].append(r)
for tag in tags:
    for th in (0.75, 0.8, 0.85):
        for m in (96, 192, 384):
            for c in ("zeta", "chains(24)", "liouville"):
                v = H.get((tag, th, m, c))
                if not v: continue
                s = [r["sC_min"] for r in v]
                P(tag, th, m, c, "n=%d" % len(v), "sC %.5f %.5f %.5f" % (min(s), med(s), max(s)), "sC>=-0.05:%d" % sum(1 for r in v if r["sC_min_lo"] is not None and r["sC_min_lo"] >= -0.05),
                  "sC>0:%d" % sum(1 for r in v if r["sC_min_lo"] is not None and r["sC_min_lo"] > 0), "sC<-0.25:%d" % sum(1 for r in v if r["sC_min_hi"] < -0.25),
                  "f_min med %.5f f_max med %.5f" % (med([r["f_min"] for r in v]), med([r["f_max"] for r in v])), "t_min %.2e %.2e" % (min(r["t_min"] for r in v), max(r["t_min"] for r in v)),
                  "t_min_lo min %s" % min((r["t_min_lo"] if r["t_min_lo"] is not None else -9) for r in v))
# owed items
for f in sorted(glob.glob("owed1_*.jsonl")):
    P("\n== item 1:", f, ": per (theta', m, pair): n; eta* min/med/max; lattice root; ratio med; certified brackets; base (pair removed) min eig/Lg med; f0 (eta -> 0) med")
    O = [json.loads(l) for l in open(f)]
    g = collections.defaultdict(list)
    for r in O:
        if "status" in r: P("  not run:", r["thetap"], r["w"], r["status"]); continue
        g[(r["thetap"], r["m"], r["pair"])].append(r)
    for k in sorted(g):
        v = g[k]
        es = [r["eta_star"] for r in v if r.get("eta_star") is not None]
        P(" ", k, "n=%d" % len(v), "eta* %.4f %.4f %.4f" % (min(es), med(es), max(es)) if es else "eta* none", "zero:%d" % sum(1 for e in es if e == 0), "lattice %.4f" % v[0]["lattice_root"],
          "ratio med %.3f" % (med(es) / v[0]["lattice_root"]) if es else "", "cert:%d" % sum(1 for r in v if r.get("certified")), "sD med %.4f" % med([r["sD_min"] for r in v]),
          "base med %.4f" % med([r["base_min"] for r in v]), "f0 med %.4f" % med([r["f0"] for r in v]), "gap med %s" % (med([r["gap"] for r in v]) if v[0]["gap"] else "-"), "u*eta* med %.3f" % (med(es) * v[0]["u"]) if es else "")
for f in sorted(glob.glob("owed4_*.jsonl")):
    P("\n== item 4:", f, ": per (theta', a): P; lowest value/Lg over 8 windows (min, median of window minima); certified negative count; fraction of tau negative; predicted P^a/(a^2 u)/Lg; rms Fejer/Lg")
    O = [json.loads(l) for l in open(f)]
    g = collections.defaultdict(list)
    for r in O: g[(r["thetap"], r["a"])].append(r)
    for k in sorted(g):
        v = g[k]
        P(" ", k, "P=%d" % v[0]["P"], "min/Lg %.3f med %.3f" % (min(r["min_over_Lg"] for r in v), med([r["min_over_Lg"] for r in v])), "certneg:%d/%d" % (sum(1 for r in v if r["certified_negative"]), len(v)),
          "frac<0 %.3f" % med([r["frac_negative"] for r in v]), "pred %.3f" % (v[0]["predicted_size"] / v[0]["Lg"]), "rms %.3f" % (med([r["rms_fejer"] for r in v]) / v[0]["Lg"]), "median value/Lg %.3f" % (med([r["median_value"] for r in v]) / v[0]["Lg"]))
for f in sorted(glob.glob("owed5_*.jsonl")):
    P("\n== item 5:", f, ": per (theta', m, class): cells; violation at M = 0, M = 1 (certified); hold at M = 0 (certified); s median; chains with a violation in at least one window (M=1)")
    O = [json.loads(l) for l in open(f)]
    g = collections.defaultdict(list); fj = collections.defaultdict(list)
    for r in O:
        if "status" in r: continue
        if r.get("fejer"): fj[(r["thetap"], cls(r["obj"]))].append(r)
        else: g[(r["thetap"], r["m"], cls(r["obj"]))].append(r)
    nr = collections.Counter((r["thetap"]) for r in O if "status" in r)
    if nr: P("  not run:", dict(nr))
    for k in sorted(g):
        v = g[k]
        byc = collections.defaultdict(list)
        for r in v: byc[r["obj"]].append(r["viol_M1"])
        P(" ", k, "cells=%d" % len(v), "viol M0 %d M1 %d" % (sum(r["viol_M0"] for r in v), sum(r["viol_M1"] for r in v)), "hold M0 %d M1 %d" % (sum(r["hold_M0"] for r in v), sum(r["hold_M1"] for r in v)),
          "s med %.4f min %.4f" % (med([r["s"] for r in v]), min(r["s"] for r in v)), "objects with >=1 M1 violation: %d/%d" % (sum(1 for c in byc.values() if any(c)), len(byc)))
    for k in sorted(fj):
        v = fj[k]
        P("  Fejer", k, "n=%d" % len(v), "frac tau M0 %.4f M1 %.4f" % (st.mean(r["frac_M0"] for r in v), st.mean(r["frac_M1"] for r in v)), "min/Lg %.3f" % min(r["min_over_Lg"] for r in v), "std/u %.3f" % med([r["std_fejer_over_u"] for r in v]))
open("tables.txt", "w").write("\n".join(out) + "\n")
print("\n".join(out))
