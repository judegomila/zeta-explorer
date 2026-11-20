# m1table.py: pass counts of the data form at tolerance M = 0 and M = 1 (lambda_min(Q/U) + 2M >= 0, certified lower bound) per class and mode count
import json, glob, collections
R = [json.loads(l) for f in sorted(glob.glob("res_*.jsonl")) for l in open(f)]
def cls(o): return "chains(24)" if o.startswith("chain") else o
G = collections.defaultdict(list)
for r in R:
    if r.get("form") == "hybrid" or "sD_min" not in r: continue
    G[(r["tag"], r["theta"], cls(r["obj"]), r["m"])].append(r)
out = ["class height theta : pass M=0 / pass M=1 / cells at m = 96 | 192 | 384"]
for c in ["zeta", "chains(24)", "liouville", "ZQ eta=0.25", "ZQ eta=0.05", "ZQ eta=0.01", "E_a=0.1", "E_a=0.3", "DH", "T-NR", "HQ2"]:
    for tag in ("1e6", "1e9", "1e12"):
        for th in (0.75, 0.8, 0.85):
            cells = []
            for m in (96, 192, 384):
                v = G.get((tag, th, c, m), [])
                if not v: cells.append("-"); continue
                p0 = sum(1 for r in v if r["sD_min_lo"] is not None and r["sD_min_lo"] >= 0)
                p1 = sum(1 for r in v if r["sD_min_lo"] is not None and r["sD_min_lo"] * r["Lg"] + 2 >= 0)
                und = sum(1 for r in v if not (r["sD_min_lo"] is not None and r["sD_min_lo"] * r["Lg"] + 2 >= 0) and not (r["sD_min_hi"] * r["Lg"] + 2 < 0))
                cells.append("%d/%d/%d%s" % (p0, p1, len(v), ("(und %d)" % und) if und else ""))
            if any(x != "-" for x in cells): out.append("%s %s %s : %s" % (c, tag, th, " | ".join(cells)))
# chains: number of chains (of 24) with at least one failing window among the 8, M = 1
out.append("\nchains with at least one of 8 windows failing at M = 1 (certified), per height, theta, m")
for tag in ("1e6", "1e9", "1e12"):
    for th in (0.75, 0.8, 0.85):
        row = []
        for m in (96, 192, 384):
            by = collections.defaultdict(list)
            for r in R:
                if r.get("form") != "hybrid" and r["obj"].startswith("chain") and (r["tag"], r["theta"], r["m"]) == (tag, th, m):
                    by[r["obj"]].append(r["sD_min_hi"] * r["Lg"] + 2 < 0)
            row.append("%d/24 some, %d/24 all" % (sum(1 for v in by.values() if any(v)), sum(1 for v in by.values() if all(v))))
        out.append("%s %s : %s" % (tag, th, " | ".join(row)))
open("tables_m1.txt", "w").write("\n".join(out) + "\n")
print("\n".join(out))
