#!/usr/bin/env python3
"""Point sets for psums.c.  mask bits: 1 prime-only (q0,q1), 2 local factors (q2..q5), 4 log factors (q6,q7)."""
import json, sys
ALPHA = 3.0          # unimodular twist p^{-i alpha}
EA_A = 0.08          # E_a = zeta(s+a) zeta(s-a)
BETAS = [1.0, 1.05, 1.1, 1.25, 1.5, 2.0]                 # test 1: beta = 2 sigma
NUS = [0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1.0, 1.5]           # test 2: Route A nodes
XS = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5]                      # test 3: Re w
YS = [0.0, 1.0, 2.0, 4.532360141827194, 7.0, 10.0, 13.597080425481582, 14.134725141734693, 17.0, 21.022039638771555, 25.0, 30.0]
AS = [0.001, 0.005, 0.015, 0.025, 0.1]                    # test 4: shift a
OMS = [0.0, 0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 14.134725141734693, 20.0, 50.0, 100.0, 1000.0]

def build(which):
    pts = {}
    def add(tag, re, im, mask):
        key = (round(re, 12), round(im, 12))
        if key not in pts: pts[key] = {"re": key[0], "im": key[1], "mask": 0, "tags": []}
        pts[key]["mask"] |= mask; pts[key]["tags"].append(tag)
    if which in ("A", "all", "small"):
        for b in BETAS:
            add(f"T1:{b}", b, 0.0, 3); add(f"T1U:{b}", b, ALPHA, 3)
            add(f"T1EA+:{b}", b + EA_A, 0.0, 3); add(f"T1EA-:{b}", b - EA_A, 0.0, 3)
        for nu in NUS:
            s = 0.5 + nu
            add(f"T2:{nu}", s, 0.0, 3); add(f"T2U:{nu}", s, ALPHA, 3)
            add(f"T2EA+:{nu}", s + EA_A, 0.0, 3); add(f"T2EA-:{nu}", s - EA_A, 0.0, 3)
    if which in ("B", "all", "small"):
        for x in XS:
            for y in YS:
                s = 0.5 + x
                add(f"T3:{x}:{y}", s, y, 1); add(f"T3U:{x}:{y}", s, y + ALPHA, 1)
                add(f"T3EA+:{x}:{y}", s + EA_A, y, 1); add(f"T3EA-:{x}:{y}", s - EA_A, y, 1)
        for a in AS:
            for om in OMS:
                for sg, nm in ((1, "+"), (-1, "-")):
                    add(f"T4{nm}:{a}:{om}", 0.5 + sg * a, om, 6)
                    add(f"T4U{nm}:{a}:{om}", 0.5 + sg * a, om + ALPHA, 6)
                    add(f"T4EA{nm}+:{a}:{om}", 0.5 + sg * a + EA_A, om, 6)
                    add(f"T4EA{nm}-:{a}:{om}", 0.5 + sg * a - EA_A, om, 6)
        for om in OMS:
            add(f"T40:{om}", 0.5, om, 6)
    return list(pts.values())

if __name__ == "__main__":
    which = sys.argv[1]; out = sys.argv[2]
    P = build(which)
    with open(out + ".txt", "w") as f:
        f.write(f"{len(P)}\n")
        for p in P: f.write(f"{p['re']!r} {p['im']!r} {p['mask']}\n")
    json.dump(P, open(out + ".json", "w"))
    print(which, len(P), "points")
