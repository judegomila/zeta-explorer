"""assemble.py -- writes section 5 tables into RESULT.md (replaces the block between the two markers)."""
import json, glob, subprocess, sys
import numpy as np
runs = [f for f in glob.glob("w_Z*_P*.json") if "_v1" not in f and json.load(open(f))["P"]]
runs.sort(key=lambda f: json.load(open(f))["Z"])
Xmin = 400.0
L = []
L.append("### 5.1 Summary over the window (grid points with Z/P < X <= N and X >= 400)\n")
L.append("| Z | P | N | where | points | THETA ratio | e(THETA) | THETA*G ratio | ALIGNED ratio | LIOU ratio | U ratio | RAND1 ratio | THETA cr | ALIGNED cr | slope log cr | LIOU cr | slope log cr | U cr | RAND1 cr |")
L.append("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
for fn in runs:
    d = json.load(open(fn)); Z, P = d["Z"], d["P"]
    X = np.array(d["X"]); R = np.array(d["ratio"]); nm = d["names"]
    sel = (X > Z / P) & (X <= Z * P * 1.0001) & (X >= Xmin); lx = np.log(X[sel])
    rg = lambda k: f"{R[sel, nm.index(k)].min():.3f} .. {R[sel, nm.index(k)].max():.3f}"
    e = np.polyfit(lx, np.log(R[sel, nm.index('THETA')]), 1)[0]
    sn = d["slot"]["names"]; rs = np.array(d["slot"]["rows"])[sel]
    cr = lambda k: rs[:, 3 + 2 * sn.index(k)]
    cg = lambda k: f"{cr(k).min():+.3f} .. {cr(k).max():+.3f}"
    sl = lambda k: (f"{np.polyfit(lx, np.log(cr(k)), 1)[0]:+.3f}" if (cr(k) > 0).all() else "n/a")
    where = "server" if Z >= 16000 else "local"
    L.append(f"| {Z:g} | {P:g} | {Z*P:g} | {where} | {int(sel.sum())} | {rg('THETA')} | {e:+.3f} | {rg('THETA*G')} | {rg('ALIGNED')} | {rg('LIOU')} | {rg('U')} | {rg('RAND1')} | {cg('THETA')} | {cg('ALIGNED')} | {sl('ALIGNED')} | {cg('LIOU')} | {sl('LIOU')} | {cg('U')} | {cg('RAND1')} |")
L.append("\nAt the edge X = N (aligned cross term cr, Liouville cross term cr, THETA ratio):\n")
L.append("| Z | K = N | ALIGNED ratio | ALIGNED cr | LIOU ratio | LIOU cr | THETA ratio | THETA cr |")
L.append("|---|---|---|---|---|---|---|---|")
for fn in runs:
    d = json.load(open(fn)); Z, P = d["Z"], d["P"]
    X = np.array(d["X"]); R = np.array(d["ratio"]); nm = d["names"]; i = int(np.argmin(np.abs(X - Z * P)))
    sn = d["slot"]["names"]; r = d["slot"]["rows"][i]; c = lambda k: r[3 + 2 * sn.index(k)]
    L.append(f"| {Z:g} | {Z*P:g} | {R[i, nm.index('ALIGNED')]:.3f} | {c('ALIGNED'):+.3f} | {R[i, nm.index('LIOU')]:.3f} | {c('LIOU'):+.3f} | {R[i, nm.index('THETA')]:.3f} | {c('THETA'):+.3f} |")
L.append("\n### 5.2 Full grids\n")
L.append(subprocess.run([sys.executable, "mk_tables.py"], capture_output=True, text=True).stdout.strip())
block = "\n".join(L)
s = open("RESULT.md").read()
b0 = "<!-- TABLES-BEGIN -->"; b1 = "<!-- TABLES-END -->"
if "RUN_TABLE_PLACEHOLDER" in s:
    s = s.replace("RUN_TABLE_PLACEHOLDER", b0 + "\n" + block + "\n" + b1)
else:
    i, j = s.index(b0), s.index(b1); s = s[:i] + b0 + "\n" + block + "\n" + s[j:]
open("RESULT.md", "w").write(s)
print(block[:3000])
