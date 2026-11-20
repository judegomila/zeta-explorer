#!/usr/bin/env python3
"""Extras on stored Gram matrices (n <= 2000; allocation printed):
 (1) conjugation symmetry G[pbar,qbar] = conj G[p,q];
 (2) cost of closed-form dual weights D_p = t * R * sum_{c: p|c} |b_c|^2 (t minimal feasible = lambda_max of the lane-normalised Gram)
     and D_p = t' G_pp, against the optimal dual;
 (3) Schatten moments m_k = tr(Gn^k)/n of the unit-diagonal Gram against Marchenko-Pastur moments."""
import sys, glob, os, re, math, json
import numpy as np
from math import comb
HERE = os.path.dirname(os.path.abspath(__file__))
fs = sorted(glob.glob(os.path.join(HERE, "gram_Z*.npz")), key=lambda f: [float(x) for x in re.findall(r"[\d.]+", os.path.basename(f).replace(".npz", ""))][::-1])
out = []
for f in fs:
    d = np.load(f); n = len(d["Np"]); R = int(d["R"]); Dp = d["Dp"]
    sd = json.load(open(f.replace("gram_", "sdp_").replace(".npz", ".json")))
    SU, SV = d["SU"], d["SV"]
    pos = {(int(a), int(b)): i for i, (a, b) in enumerate(zip(SU, SV))}
    perm = np.array([pos.get((int(a - b), int(-b)), -1) for a, b in zip(SU, SV)])
    g = n / R
    mp = {k: sum(g ** j * comb(k, j + 1) * comb(k, j) / k for j in range(k)) for k in (2, 3, 4, 6)}
    line = f"{os.path.basename(f)[5:-4]:24s} n={n:5d} R={R:5d} alloc {3 * n * n * 16 / 1e9:.3f} GB |"
    for v in ["Ap", "R", "K"]:
        G = d["G_" + v]; tr = float(np.real(np.trace(G)))
        if perm.min() >= 0:
            sym = float(np.abs(G[np.ix_(perm, perm)] - G.conj()).max() / np.abs(G).max())
        else:
            sym = float("nan")
        gd = np.real(np.diag(G))
        t1 = float(np.linalg.eigvalsh(G / np.sqrt(np.outer(Dp, Dp)) / R)[-1]); c1 = t1 * R * Dp.sum() / tr
        ev = np.linalg.eigvalsh(G / np.sqrt(np.outer(gd, gd))); c2 = float(ev[-1])
        mom = {k: float((ev ** k).sum() / n) for k in (2, 3, 4, 6)}
        line += (f" {v}: sym={sym:.1e} cfdual/tr={c1:.4f} diagdual/tr={c2:.4f} SDP/tr={sd['variants'][v]['sdp_over_tr']:.4f} "
                 + " ".join(f"m{k}={mom[k]:.3f}" for k in mom) + " |")
    line += " MP: " + " ".join(f"m{k}={mp[k]:.3f}" for k in mp) + f" edge={(1 + math.sqrt(g)) ** 2:.3f}"
    print(line, flush=True)
