#!/usr/bin/env python3
"""MEASURED sensitivity scan (hypothetical margins, NOT certificates): scale the certified margins of a family of P47 floors by f and
run the exact route-P consumer tmp/r3-outer-mixed.py.  usage: scan.py COLLECTDIR NAME F FAMILY   (FAMILY: all | kap:0.88 | mode:sharp | cells:a-b | incomplete)"""
import sys, os, json, math, subprocess
from fractions import Fraction as F
B = os.path.expanduser("~/rh-push/b-route-p-motherbox"); T = B + "/tmp/"
O, name, f, fam = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
H = json.load(open(T + "r6-fiber-out/p47_hybrid.json"))
REP = json.load(open(O + "/assembled/report.json"))
cf = json.load(open(O + "/merge/certfile_fullref.json"))
def sh(m): return F(math.floor((0.0023 - m * (1 + 1e-12)) * 1e13) - 1, 10 ** 13)
n = 0
for r in REP:
    if r["status"] != "CERTIFIED": continue
    d = H[r["idx"]]; t = d["key"] + "@" + d["file"]
    ok = (fam == "all" or (fam.startswith("kap:") and str(d["kap"]) == fam[4:]) or (fam.startswith("mode:") and d["mode"] == fam[5:])
          or (fam == "incomplete" and not r["complete"])
          or (fam.startswith("cells:") and int(fam[6:].split("-")[0]) <= d["cell"] <= int(fam[6:].split("-")[1])))
    if not ok: continue
    s = sh(f * r["margin"] + 1e-9)
    if F(cf[t]) < s: cf[t] = str(s); n += 1
fn = O + "/merge/scan_%s.json" % name; json.dump(cf, open(fn, "w"))
G = T + "r2-refF-out/corrected_m0023/batch_*.json," + T + "r2-refF-out/corrected_m0023/adapt*/batch_P*.json"
p = subprocess.run([sys.executable, T + "r3-outer-mixed.py", G, "--cert", fn], capture_output=True, text=True)
print(name, f, fam, "changed", n, p.stdout.strip().split("\n")[-1], flush=True)
