"""Tables from parts/*.json and out_*.json (text only; no computation)."""
import json, glob, os, math
HERE = os.path.dirname(os.path.abspath(__file__))
def L(f):
    p = os.path.join(HERE, f)
    return json.load(open(p)) if os.path.exists(p) else None
parts = [json.load(open(f)) for f in glob.glob(os.path.join(HERE, "parts", "*.json"))]
for extra in ("out_univ.json", "out_onepair_first.json", "out_nat_first.json"):
    if L(extra): parts += L(extra)
lines = []
def P(*a):
    s = " ".join(str(x) for x in a); lines.append(s); print(s)
for mode, zq, title in (("max", False, "REAL: cluster added to on-line ordinates; largest pinned offset b that passes (min G >= 0); cap 0.49"),
                        ("max", True, "ZQ: same with the 2n nearest on-line ordinates removed"),
                        ("floor", False, "FLOOR: every pair has offset >= b; largest b that passes")):
    rows = [r for r in parts if r.get("mode") == mode and r.get("zq") == zq and "trials" in r and r.get("mode") != "nat"]
    if not rows: continue
    P("\n" + title)
    ns = sorted({r["n"] for r in rows})
    P("| T | theta | region c_theta/L | " + " | ".join("n=%d" % n for n in ns) + " |")
    P("|---|---|---|" + "---|" * len(ns))
    for T in (1e6, 1e7, 1e8, 1e9):
        for th in (0.25, 0.5, 1.0):
            cells = []
            reg = None
            for n in ns:
                r = [x for x in rows if x["T"] == T and x["theta"] == th and x["n"] == n]
                if not r: cells.append("-"); continue
                r = r[0]; reg = r["b_region"]
                cells.append("none" if r["best"] is None else "%.3g (min %.2f)" % (r["best"]["bstar"], r["best"]["min"]))
            if reg is not None:
                P("| %g | %g | %.3f | " % (T, th, reg) + " | ".join(cells) + " |")
nat = [r for r in parts if r.get("mode") == "nat"]
if nat:
    P("\nNAT: 2n on-line ordinates replaced by n pairs on the lattice of spacing 4 pi/log(T/2pi) (count preserved), tapered offsets; largest b that passes; kappa = 2 pi/(d u_max)")
    P("| T | theta | kappa | region | n=8 | n=16 | n=40 |"); P("|---|---|---|---|---|---|---|")
    for T in (1e6, 1e7, 1e8, 1e9):
        for th in (0.25, 0.35, 0.42, 0.5, 0.75, 1.0):
            rs = {r["n"]: r for r in nat if r["T"] == T and r["theta"] == th}
            if not rs: continue
            any_ = list(rs.values())[0]
            P("| %g | %g | %.3f | %.3f | " % (T, th, any_["kappa"], any_["b_region"]) + " | ".join(("-" if n not in rs else ("none" if rs[n]["best"] is None else "%.3g" % rs[n]["best"]["bstar"])) for n in (8, 16, 40)) + " |")
one = [r for r in parts if "b1_M0" in r]
if one:
    P("\nONE PAIR: largest offset b that passes for a single pair, over 41 ordinates; [min, median, max]")
    P("| T | theta | b1 (M=0) | b1 (M=1) | Prop 5: log(2 pi^2/theta)/(theta L) | c_theta/L | mechanism at b=1.5 median: min G, y-gamma, 2pi/u, -P^b u/(4 pi^2) |"); P("|---|---|---|---|---|---|---|")
    for r in sorted(one, key=lambda r: (r["T"], r["theta"])):
        m = r["mech"]
        P("| %g | %g | %s | %s | %.3f | %.3f | %.2f, %.3f, %.3f, %.2f |" % (r["T"], r["theta"], ", ".join("%.3f" % x for x in r["b1_M0"]), ", ".join("%.3f" % x for x in r["b1_M1"]), r["b_p5"], r["b_region"], m["min"], m["y_minus_gamma"], m["two_pi_over_u"], m["prop5_term"]))
un = [r for r in parts if "eps" in r]
if un:
    P("\nUNIVERSAL (cluster alone, u_max = 1, u in [1/2, 1], y within 400 of the cluster): largest A = u b_max with inf G >= -1e-3")
    P("| n | A_max | min G at A_max | first failing A (min G) |"); P("|---|---|---|---|")
    for r in sorted(un, key=lambda r: r["n"]):
        fail = [t for t in r["trials"] if t["min"] < -r["eps"]]
        P("| %d | %s | %s | %s |" % (r["n"], "none" if r["best"] is None else r["best"]["A"], "-" if r["best"] is None else "%.2e" % r["best"]["min"], "-" if not fail else "%g (%.2e)" % (fail[0]["A"], fail[0]["min"])))
sc = L("out_signchain.json")
if sc:
    P("\nSIGN CHAINS (prime side): 24 seeds")
    P("| T | theta | P | scan length | zeta min | chains violating | chain min range | reserve/sd | Gaussian expected violating points |"); P("|---|---|---|---|---|---|---|---|---|")
    for r in sc:
        P("| %g | %g | %.4g | %g | %.3f | %d/24 | [%.2f, %.2f] | %.2f | %.2g |" % (r["T"], r["theta"], r["P"], r["length"], r["zeta_min"], r["chains_violating"], min(r["chain_min"]), max(r["chain_min"]), r["reserve"] / r["sd"], r["gauss_expected_violating_points"]))
bc = L("out_ballcheck.json")
if bc:
    P("\nBALL RECHECK (acb, 256 bits, grid offset from the float grid)")
    P("| set | T | theta | n | b_max | grid points | lower bound of min G | max radius |"); P("|---|---|---|---|---|---|---|---|")
    for r in bc:
        P("| %s | %s | %g | %d | %.4g | %d | %.6g | %.1e |" % (r["tag"], r["T"], r["theta"], r["n"], r["bmax"], r["grid_points"], r["ball_lower_min"], r["max_radius"]))
open(os.path.join(HERE, "tables.txt"), "w").write("\n".join(lines) + "\n")
lines2 = []
for name, title in (("out_ballfam.json", "BALLFAM: rows alone built in ball arithmetic (600 bits), cos^(2p) profile, exact lattice; y within 60 of the row, 7 values of u in [1/2, 1]"),
                    ("out_ballfam_perturb.json", "BALLFAM PERTURB: same, each ordinate moved by a seeded amount of size eps (units of 1/u)")):
    d = L(name)
    if not d: continue
    lines2.append("\n" + title); lines2.append("| A = u b_max | n | kappa | p | eps | grid points | lower bound of min G |"); lines2.append("|---|---|---|---|---|---|---|")
    for r in sorted(d, key=lambda r: (r["A"], r["n"], r["position_perturbation"])):
        lines2.append("| %g | %d | %g | %d | %g | %d | %.6g |" % (r["A"], r["n"], r["kappa"], r["p"], r["position_perturbation"], r["grid_points"], r["ball_lower_min"]))
for name in ("out_ballcheck_fam2.json", "out_ballcheck_fam3.json"):
    d = L(name)
    if not d: continue
    lines2.append("\nBALL, rows with float-built ordinates (%s)" % name); lines2.append("| set | n | lower bound of min G |"); lines2.append("|---|---|---|")
    for r in d: lines2.append("| %s | %d | %.6g |" % (r["tag"], r["n"], r["ball_lower_min"]))
fs = L("out_famscan.json")
if fs:
    lines2.append("\nFAMSCAN: rows alone, family only (float64), largest A on the grid 4..24 step 2 with min G >= -1e-3"); lines2.append("| n | A_max | kappa | profile |"); lines2.append("|---|---|---|---|")
    for r in fs: lines2.append("| %d | %s | %s | %s |" % (r["n"], r["best"][0] if r["best"] else "none", r["best"][2] if r["best"] else "", (str(r["best"][3]) + " " + str(r["best"][4])) if r["best"] else ""))
sh = L("out_shiftctl.json")
if sh:
    lines2.append("\nSHIFT CONTROL zeta(s+a) zeta(s-a), prime side: min of the section over the scan"); lines2.append("| T | theta | scan | a: " + ", ".join(str(a) for a in sh[0]["a"]) + " |"); lines2.append("|---|---|---|---|")
    for r in sh: lines2.append("| %g | %g | %g | %s |" % (r["T"], r["theta"], r["length"], ", ".join("%.2f" % x for x in r["minG"])))
print("\n".join(lines2)); open(os.path.join(HERE, "tables.txt"), "a").write("\n".join(lines2) + "\n")
