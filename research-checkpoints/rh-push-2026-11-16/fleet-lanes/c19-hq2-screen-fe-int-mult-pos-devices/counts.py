import json, collections
R = [json.loads(l) for l in open("dev.jsonl")]
by = collections.defaultdict(dict)
for r in R:
    if r["obj"] in ("HQ2 as written", "HQ2 own poles added"):
        by[(r["T0"], r["w"], r["theta"], r["m"], r["q"], r["eps"])][r["obj"]] = r
out = {}
for M in ("0", "1"):
    c = collections.Counter()
    for k, d in by.items():
        c[(d["HQ2 as written"]["signs"][M], d["HQ2 own poles added"]["signs"][M])] += 1
    out["N(theta) M=%s (as written, own poles added)" % M] = {"%s,%s" % k: v for k, v in sorted(c.items())}
# by eps for q=2, theta<=0.85
for M in ("0", "1"):
    t = {}
    for eps in ["1e-8", "1e-6", "1e-4", "1e-3", "1e-2", "1e-1"]:
        c = collections.Counter()
        for k, d in by.items():
            if k[4] == 2 and k[5] == eps and k[2] <= 0.85:
                c[(d["HQ2 as written"]["signs"][M], d["HQ2 own poles added"]["signs"][M])] += 1
        t[eps] = {"%s,%s" % k: v for k, v in sorted(c.items())}
    out["q=2, theta<=0.85, M=%s" % M] = t
C = [json.loads(l) for l in open("cth.jsonl")]
byc = collections.defaultdict(dict)
for r in C:
    if r["obj"] in ("HQ2 as written", "HQ2 own poles added"): byc[(r["T0"], r["w"], r["theta"], r["q"], r["eps"])][r["obj"]] = r
c = collections.Counter()
for k, d in byc.items():
    a = "neg" if d["HQ2 as written"]["ball_neg"] else "pos"; o = "neg" if d["HQ2 own poles added"]["ball_neg"] else "pos"
    c[(a, o)] += 1
out["C(theta) M=0 at grid minimum (as written, own poles added)"] = {"%s,%s" % k: v for k, v in sorted(c.items())}
out["cells"] = {"dev objects x cells": len(R), "cth records": len(C), "dev3 records": sum(1 for _ in open("dev3.jsonl"))}
zz = [r for r in R if r["obj"] == "zeta"]
out["zeta"] = {"cells": len(zz), "M0": dict(collections.Counter(r["signs"]["0"] for r in zz)), "M1": dict(collections.Counter(r["signs"]["1"] for r in zz)),
               "M0 pos with theta<=0.75": sum(r["signs"]["0"] == "pos" for r in zz if r["theta"] <= 0.75), "cells theta<=0.75": sum(1 for r in zz if r["theta"] <= 0.75)}
json.dump(out, open("counts.json", "w"), indent=1); print(json.dumps(out, indent=1))
