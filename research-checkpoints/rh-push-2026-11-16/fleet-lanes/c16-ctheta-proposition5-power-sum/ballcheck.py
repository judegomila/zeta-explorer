"""Ball-arithmetic recheck (python-flint acb, 256 bits) of passing clusters on a grid offset from the float grid.
The synthetic set is defined by the stored floats (exact binary rationals), so the ball values are rigorous AT THE GRID POINTS only."""
import sys, os, json, math
import numpy as np
from flint import acb, arb, ctx
ctx.prec = 512
HERE = os.path.dirname(os.path.abspath(__file__))
def G_ball(y, u, on, g, b):
    y = arb(float(y)); u = arb(float(u)); tot = arb(0)
    for gm in on:
        d = y - arb(float(gm))
        tot += (1 - (u * d).cos()) / (u * d * d) if not d.contains(0) or d != 0 else u / 2
    for gj, bj in zip(g, b):
        z = acb(y - arb(float(gj)), arb(float(bj)))
        tot += 2 * ((1 - (u * z).cos()) / (u * z * z)).real
    return tot
def check(a):
    tag, T, theta, g, b, removed, pad, fine = a
    g = np.array(g); b = np.array(b)
    if T is None:
        umax = 1.0; on = np.array([])
    else:
        umax = theta * math.log(T)
        on = np.array(json.load(open(os.path.join(HERE, "zeros_%g.json" % T)))["zeros_minus_T"])
        if removed: on = np.delete(on, removed)
    h = 0.26 / umax / fine
    y = np.arange(g.min() - pad + 0.37 * h, g.max() + pad, h)
    us = np.linspace(umax / 2, umax, 7)
    lo = None; arg = None; maxrad = 0.0
    for yy in y:
        near = on[np.abs(on - yy) < 15.0] if on.size else on
        for u in us:
            v = G_ball(yy, u, near, g, b)
            l = float((v.mid() - v.rad()).mid()); maxrad = max(maxrad, float(v.rad().mid()))
            if lo is None or l < lo: lo, arg = l, (float(yy), float(u))
    res = dict(tag=tag, T=T, theta=theta, n=len(g), bmax=float(b.max()), grid_points=len(y) * len(us), ball_lower_min=lo, argmin=arg, max_radius=maxrad)
    print(json.dumps(res), flush=True)
    return res
if __name__ == "__main__":
    from multiprocessing import Pool
    import glob
    tasks = []
    parts = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(HERE, "parts", "*.json")))]
    f = os.path.join(HERE, "out_univ.json")
    if os.path.exists(f): parts += json.load(open(f))
    for r in parts:
        if r.get("best") is None: continue
        bb = r["best"]
        if "eps" in r:
            if r["n"] in (2, 4, 8, 16, 24, 40): tasks.append(("univ", None, 1.0, bb["g"], bb["b"], [], 300.0, 2))
        elif r.get("mode") == "nat":
            if r["T"] == 1e9 and r["n"] == 16 and r["theta"] in (0.25, 0.42, 0.5): tasks.append(("nat", r["T"], r["theta"], bb["g"], bb["b"], bb["removed"], 60.0 / r["umax"], 2))
        elif r.get("mode") == "floor":
            if r["T"] in (1e6, 1e9) and r["n"] == 4 and r["theta"] in (0.5, 1.0): tasks.append(("floor", r["T"], r["theta"], bb["g"], bb["b"], [], 60.0 / r["umax"], 2))
        elif r.get("mode") == "max":
            if r["T"] in (1e6, 1e9) and r["n"] in (3, 8, 16, 40) and r["theta"] in (0.5, 1.0): tasks.append(("zq" if r["zq"] else "real", r["T"], r["theta"], bb["g"], bb["b"], bb.get("removed", []), 60.0 / r["umax"], 2))
    # tapered lattice rows alone at large A = u b_max (beyond float64 cancellation), u_max = 1:
    # spacing d = 2 pi / kappa, offsets A cos^(2p)(pi x / 2); float construction, ball evaluation
    FAM = ((20, 60, 2.0, 3), (20, 100, 2.0, 3), (40, 120, 2.0, 3), (40, 240, 2.5, 4), (80, 480, 2.5, 4))
    second = len(sys.argv) > 1 and sys.argv[1] == "fam2"
    if second:   # second batch, chosen after the first: longer rows at A = 40 and 80
        tasks = []; FAM = ((40, 300, 2.5, 4), (40, 280, 2.5, 3), (80, 640, 2.5, 4), (80, 800, 2.5, 4), (80, 800, 3.0, 4))
    third = len(sys.argv) > 1 and sys.argv[1] == "fam3"
    if third:    # third batch, chosen after famscan.py: profile cos^2 (p = 1), spacing pi (kappa = 2), n slightly above 2A
        tasks = []; FAM = ((20, 40, 2.0, 1), (40, 80, 2.0, 1), (40, 88, 2.0, 1), (80, 160, 2.0, 1), (80, 176, 2.0, 1), (160, 320, 2.0, 1), (160, 352, 2.0, 1))
    for (A, n, kappa, p) in FAM:
        d = 2 * math.pi / kappa
        j = np.arange(n) - (n - 1) / 2
        x = j / ((n + 1) / 2)
        prof = np.cos(math.pi * x / 2) ** (2 * p)
        tasks.append(("fam A=%g n=%d kappa=%g p=%d" % (A, n, kappa, p), None, 1.0, (j * d).tolist(), np.maximum(A * prof / prof.max(), 1e-5).tolist(), [], 60.0, 1))
    tasks.sort(key=lambda t: -len(t[3]))
    print("tasks", len(tasks), flush=True)
    with Pool(int(os.environ.get("RH_WORKERS", "4"))) as p:
        out = p.map(check, tasks, chunksize=1)
    json.dump(out, open(os.path.join(HERE, "out_ballcheck_fam2.json" if second else ("out_ballcheck_fam3.json" if third else "out_ballcheck.json")), "w"))
    print("done")
