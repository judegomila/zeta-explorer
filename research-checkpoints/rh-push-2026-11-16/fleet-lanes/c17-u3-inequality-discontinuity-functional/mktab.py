"""Build tables.md from the server logs (JSON lines in logs/*.log)."""
import json, glob
D = {1: 3.4437, 13: 0.7424, 19: 0.7201, 24: 0.6919, 27: 0.6096, 34: 0.4226, 40: 0.6550}
rows = {}
for f in sorted(glob.glob("logs/*.log")):
    X = None
    for l in open(f):
        if l.startswith("X="): X = int(l.split()[0][2:])
        if l.startswith("{"):
            o = json.loads(l)
            if o.get("delta") is None: continue
            key = (X, o["cls"], o["k"], o["eta"])
            if key not in rows or (o.get("feasible") and o["delta"] < rows[key]["delta"]): rows[key] = o
f5 = lambda v: "-" if v is None else f"{v:.5f}"
out = ["| pair | d | eta | mult X=300 | mult X=1000 | mult X=4000 | unc X=300: LP lower bound | unc X=300: LP point | mult(300)/unc lower(300) | largest mult/unc lower(300) | mult(300)/(eta^2+d^2) |", "|---|---|---|---|---|---|---|---|---|---|---|"]
ratios = []; infeas = []
for k in (1, 13, 19, 24, 27, 34, 40):
    for eta in (0.01, 0.05, 0.1, 0.2, 0.3, 0.45):
        m = {X: rows.get((X, "mult", k, eta)) for X in (300, 1000, 4000)}
        u = rows.get((300, "unc", k, eta))
        mv = {X: (m[X]["delta"] if m[X] and m[X]["feasible"] else None) for X in m}
        if all(v is None for v in mv.values()) and not (u and u["feasible"]):
            infeas.append((k, eta)); continue
        ul = u.get("delta_lp_lower") if u and u["feasible"] else None; up = u["delta"] if u and u["feasible"] else None
        r1 = mv[300] / ul if (mv[300] and ul) else None
        best = [v for v in mv.values() if v]
        r2 = max(best) / ul if (best and ul) else None
        if r1: ratios.append(r1)
        if r2: ratios.append(r2)
        c = mv[300] / (eta * eta + D[k] ** 2) if mv[300] else None
        g = lambda v: "-" if v is None else f"{v:.3f}"
        out.append(f"| {k},{k+1} | {D[k]} | {eta} | {f5(mv[300])} | {f5(mv[1000])} | {f5(mv[4000])} | {f5(ul)} | {f5(up)} | {g(r1)} | {g(r2)} | {g(c)} |")
out.append("")
out.append(f"Infeasible inside the boxes in every run (zero equations not met): {sorted(set(k for k, e in infeas))} (pair index), all eta.")
if ratios: out.append(f"Ratio multiplicative / unconstrained lower bound: min {min(ratios):.3f}, max {max(ratios):.3f}.")
ux = [(k, o["eta"], o["delta_lp_lower"], o["delta"]) for (X, c, k, e), o in rows.items() if c == "unc" and X == 1000 and o.get("feasible")]
for t in ux: out.append(f"Unconstrained at X = 1000, pair {t[0]}, eta {t[1]}: LP lower bound {t[2]:.5f}, LP point {t[3]:.5f}.")
open("tables.md", "w").write("\n".join(out) + "\n")
print("\n".join(out))
