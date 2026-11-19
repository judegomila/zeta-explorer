"""mk_tables.py -- markdown tables for RESULT section 5 from w_Z*_P*.json."""
import json, glob, re
import numpy as np
runs = [f for f in glob.glob("w_Z*_P*.json") if "_v1" not in f]
runs.sort(key=lambda f: json.load(open(f))["Z"])
for fn in runs:
    d = json.load(open(fn)); Z, P = d["Z"], d["P"]
    if not P: continue
    log = open(fn.replace(".json", ".log")).read()
    slot = re.search(r"slot primes \(norms\): (\[.*?\])", log).group(1)
    pr = re.search(r"columns=(\d+) primes=(\d+)", log)
    X = np.array(d["X"]); R = np.array(d["ratio"]); nm = d["names"]
    print(f"\n**Z = {Z:g}, P = {P:g}, N = {Z*P:g}** (`{fn.replace('.json','.log')}`): prime table {pr.group(2)} primes, {pr.group(1)} columns in the table, {d['columns']} live columns, {d['rows']} rows, slot norms {slot}; window X/N in ({1/P**2:.4f}, 1), X in ({Z/P:.0f}, {Z*P:.0f}).\n")
    cols = ["THETA", "THETA*G", "LIOU", "ALIGNED", "THIN", "U", "RAND1"]
    has = "slot" in d
    hdr = "| X/N | X | X/Z | in window | " + " | ".join(cols) + (" | THETA sd | THETA cr | LIOU cr | ALIGNED cr | U cr | RAND1 cr |" if has else " |")
    print(hdr); print("|" + "---|" * (hdr.count("|") - 1))
    for i, x in enumerate(X):
        if x < 100: continue
        inw = "yes" if (x > Z / P and x < Z * P * 0.999) else ("edge" if abs(x - Z * P) < 1e-6 * Z * P else "no")
        line = f"| {x/(Z*P):.4f} | {x:.0f} | {x/Z:.3f} | {inw} | " + " | ".join(f"{R[i, nm.index(c)]:.3f}" for c in cols)
        if has:
            sn = d["slot"]["names"]; r = d["slot"]["rows"][i]
            g = lambda k, o: r[2 + 2 * sn.index(k) + o]
            line += f" | {g('THETA',0):.3f} | {g('THETA',1):+.3f} | {g('LIOU',1):+.3f} | {g('ALIGNED',1):+.3f} | {g('U',1):+.3f} | {g('RAND1',1):+.3f}"
        print(line + " |")
