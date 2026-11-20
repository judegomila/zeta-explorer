"""For each departure event: follow the off-line pair until it returns to the line (or WMAX)."""
import sys, json, time
from zf import *
from track import track, newton_s
from flint import acb, arb
d = json.load(open(sys.argv[1])); out = sys.argv[2]
Z = ZF()
deps = [e for e in d["events"] if e.get("kind") == "departure"]
seen = set(); res = []
for e in deps:
    key = e["wk"][:20]
    if key in seen: continue
    seen.add(key)
    wd = float(e["wk"]); td = float(e["tk"]); got = None
    for eps in (0.002, 0.005, 0.0005):
        for d0 in (0.1, 0.05, 0.2, 0.4, 0.02):
            w0 = round(wd + eps, 8)
            try: s, ok = newton_s(Z, w0, acb(w0/2 + d0, td))
            except Exception: continue
            if ok and float(s.real) - w0/2 > 1e-6 and abs(float(s.imag) - td) < 0.5:
                got = (w0, s); break
        if got: break
    if not got:
        res.append({"dep_wk": e["wk"], "dep_tk": e["tk"], "status": "no off-line start found"}); print("FAIL", wd, td, flush=True); continue
    r = track(Z, got[1], "dep", dw0=0.005, w_start=got[0])
    dmax = max(p[1]-p[0]/2 for p in r["path"])
    rr = {"dep_wk": e["wk"], "dep_tk": e["tk"], "origins": e.get("origins"), "returned": r["collided"], "ret_wk": r.get("wk"), "ret_tk": r.get("tk"),
          "resid": r.get("resid"), "max_offline_distance": dmax, "end": r.get("reached", r.get("stuck_at"))}
    res.append(rr); print(round(wd,6), round(td,3), "->", (r.get("wk") or "")[:14], (r.get("tk") or "")[:10], "dmax", round(dmax,4), r.get("reached"), r.get("stuck_at"), flush=True)
json.dump(res, open(out, "w"), indent=0)
