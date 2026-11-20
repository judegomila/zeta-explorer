# summary.py: compact tables for RESULT.md from dev_table.json, dev3_table.json, cth_table.json
import json
D = json.load(open("dev_table.json")); D3 = json.load(open("dev3_table.json")); C = json.load(open("cth_table.json"))
TH = [0.55, 0.65, 0.75, 0.85, 0.95, 1.0]
def cell(r):
    return "%d/%d" % (r["M0"][0], r["M1"][0]) + ("" if r["M0"][2] + r["M1"][2] == 0 else " (u%d/%d)" % (r["M0"][2], r["M1"][2]))
out = []
for tab, src in (("N(theta), HQ2 / ZQ / T-NR", D), ("N(theta), HQ3", D3)):
    for T0 in (1e4, 1e5, 1e6):
        for m in (96, 192):
            rows = [r for r in src if r["T0"] == T0 and r["m"] == m]
            if not rows: continue
            n = rows[0]["n"]
            out.append("\n**%s; T0 = %g; m = %d; %d windows.** Cell: windows certified positive at M = 0 / at M = 1 (uX/Y: undecided cells).\n" % (tab, T0, m, n))
            out.append("| object | " + " | ".join("theta = %g" % t for t in TH) + " |")
            out.append("|---|" + "---|" * len(TH))
            keys = []
            for r in rows:
                k = (r["obj"], r["q"], r["par"])
                if k not in keys: keys.append(k)
            for k in keys:
                if k[0].startswith("pole lattice") or "numerator" in k[0] or "zeta's Arch" in k[0]: continue
                name = k[0] + ((" q=%s" % k[1]) if k[1] != "" else "") + ((" %s" % k[2]) if k[2] != "" else "")
                line = "| %s |" % name
                for t in TH:
                    rr = [r for r in rows if (r["obj"], r["q"], r["par"]) == k and r["theta"] == t]
                    line += " %s |" % (cell(rr[0]) if rr else "-")
                out.append(line)
            z = [r for r in rows if r["obj"] == "zeta"]
            out.append("| zeta: median s | " + " | ".join("%.3g" % [r for r in z if r["theta"] == t][0]["smed"] for t in TH) + " |")
for T0 in (1e4, 1e5, 1e6):
    rows = [r for r in C if r["T0"] == T0]
    ths = sorted(set(r["theta"] for r in rows))
    out.append("\n**C(theta); T0 = %g; %d windows of length 40, grid step 0.004.** Cell: median over windows of the grid minimum of Re L_F; in brackets windows with ball value < 0 / < -1 at the grid minimum.\n" % (T0, rows[0]["n"]))
    out.append("| object | " + " | ".join("theta = %g" % t for t in ths) + " |")
    out.append("|---|" + "---|" * len(ths))
    keys = []
    for r in rows:
        k = (r["obj"], r["q"], r["par"])
        if k not in keys: keys.append(k)
    for k in keys:
        if "numerator" in k[0] or "zeta's gamma" in k[0]: continue
        name = k[0] + ((" q=%s" % k[1]) if k[1] != "" else "") + ((" %s" % k[2]) if k[2] != "" else "")
        line = "| %s |" % name
        for t in ths:
            rr = [r for r in rows if (r["obj"], r["q"], r["par"]) == k and r["theta"] == t][0]
            line += " %.2f [%d/%d] |" % (rr["med"], rr["fail0"], rr["fail1"])
        out.append(line)
open("summary_tables.md", "w").write("\n".join(out) + "\n")
print(len(out), "lines")

# thresholds: largest eps (q = 2) with all windows certified positive, per (T0, theta, m), M = 0 and M = 1; ZQ: largest eta likewise
EPS = ["1e-8", "1e-6", "1e-4", "1e-3", "1e-2", "1e-1"]
ETA = ["0.0322609858", "0.05", "0.1020564026", "0.25", "0.3239252271"]
L = ["\n**Thresholds, N(theta).** Largest eps of the list {1e-8, 1e-6, 1e-4, 1e-3, 1e-2, 1e-1} (q = 2) for which every window is certified positive (all smaller listed eps also pass), for HQ2 as written (aw) and with own poles added (own), at M = 0 / M = 1; largest eta of {0.032, 0.05, 0.102, 0.25, 0.324} for ZQ likewise. '-' = not even the smallest passes in every window. zeta column: windows certified positive at M = 0 / undecided.\n",
     "| T0 | theta | m | zeta M=0 pos/undecided | HQ2 aw M=0 | HQ2 aw M=1 | HQ2 own M=0 | HQ2 own M=1 | ZQ M=0 | ZQ M=1 |", "|---|---|---|---|---|---|---|---|---|---|"]
def thr(rows, obj, vals, M, q=None):
    best = "-"
    for v in vals:
        rr = [r for r in rows if r["obj"] == obj and str(r["par"]) == v and (q is None or r["q"] == q)]
        if not rr: break
        r = rr[0]
        if (r["M0"] if M == 0 else r["M1"])[0] == r["n"]: best = v
        else: break
    return best
for T0 in (1e4, 1e5, 1e6):
    for t in TH:
        for m in (96, 192):
            rows = [r for r in D if r["T0"] == T0 and r["theta"] == t and r["m"] == m]
            if not rows: continue
            z = [r for r in rows if r["obj"] == "zeta"][0]
            L.append("| %g | %g | %d | %d/%d of %d | %s | %s | %s | %s | %s | %s |" % (T0, t, m, z["M0"][0], z["M0"][2], z["n"],
                     thr(rows, "HQ2 as written", EPS, 0, 2), thr(rows, "HQ2 as written", EPS, 1, 2), thr(rows, "HQ2 own poles added", EPS, 0, 2), thr(rows, "HQ2 own poles added", EPS, 1, 2),
                     thr(rows, "ZQ", ETA, 0)[:5], thr(rows, "ZQ", ETA, 1)[:5]))
open("summary_tables.md", "a").write("\n".join(L) + "\n")
# counts
tot = sum(r["n"] for r in D) + sum(r["n"] for r in D3)
und = sum(r["M0"][2] + r["M1"][2] for r in D) + sum(r["M0"][2] + r["M1"][2] for r in D3)
print("object-cells (object x window x theta x height x m):", tot, "sign decisions:", 2 * tot, "undecided:", und)
neg_zeta = sum(r["M0"][1] + r["M1"][1] for r in D if r["obj"] == "zeta")
print("zeta certified negative cells:", neg_zeta)
pl = [r for r in D if r["obj"].startswith("pole lattice")]
print("pole lattice: min s", min(r["smin"] for r in pl), "certified negative at M=0:", sum(r["M0"][1] for r in pl))
