#!/usr/bin/env python3
"""Overlap (common-column) term of the mark Gram matrix. Files: x_Z*.npz (mode extra/lean: has Ov and per-column random control Rc)
and optionally the matching g_Z*.npz (mode full) with the same marks.
G = G_diag + G_off, G_diag[p,p'] = sum_m sum_{c: p,p' | c, (c,m)=1} |b_c|^2 (terms c = c'), entrywise >= 0.
Model: Gn[p,p'] = G[p,p']/sqrt(G_pp G_p'p') ~ On[p,p'] + noise, On = Ov/sqrt(Dp Dp') (On_pp = 1).
Usage: overlap.py x.npz [g.npz]"""
import sys, math, json
import numpy as np
x = np.load(sys.argv[1]); mats = {k[2:]: x[k] for k in x.files if k.startswith("G_")}
if len(sys.argv) > 2:
    g = np.load(sys.argv[2]); assert np.array_equal(g["Np"], x["Np"])
    mats.update({k[2:]: g[k] for k in g.files if k.startswith("G_")})
Np = x["Np"]; R = int(x["R"]); Ov = x["Ov"]; Dp = x["Dp"]; nat = x["natural"]; N = len(Np); Z = float(x["Z"])
On = Ov / np.sqrt(np.outer(Dp, Dp))
out = dict(Z=Z, R=R, rows=[])
print(f"Z={Z:g} R={R} marks={N} natural={int(nat.sum())}")
print(" n  variant  lam_max(Gn)  lam_max(On)   MP    lam_max(Gn-On+I)  ones(Gn)/n  ones(On)/n  sum_{p!=p'}Ov/sum Dp  sum 1/N(p)  corr(offdiag Re Gn, On)")
for n in sorted(set([8, 12, 16, 24, 32, int(nat.sum()), N])):
    if n > N:
        continue
    s = np.arange(n); O = On[np.ix_(s, s)]; iu = np.triu_indices(n, 1)
    for name in ["Ap", "Rc", "R", "K4a", "Rc4", "A", "Q", "QRc", "QR", "T6"]:
        if name not in mats:
            continue
        G = mats[name][np.ix_(s, s)]; gd = np.real(np.diag(G)); Gn = G / np.sqrt(np.outer(gd, gd))
        l1 = np.linalg.eigvalsh(Gn)[-1]; l2 = np.linalg.eigvalsh(O)[-1]; l3 = np.linalg.eigvalsh(Gn - O + np.eye(n))[-1]
        one = np.ones(n); a = np.real(one @ Gn @ one) / n; b = one @ O @ one / n
        ovr = (Ov[np.ix_(s, s)].sum() - Dp[s].sum()) / Dp[s].sum()
        # regression of Re Gn offdiag on On offdiag (slope kappa)
        kap = float((np.real(Gn[iu]) * O[iu]).sum() / (O[iu] ** 2).sum())
        res = np.abs(Gn - kap * O)[iu]; rr = float(np.sqrt((res ** 2).mean()) * math.sqrt(R))
        MP = (1 + math.sqrt(n / R)) ** 2
        print(f"{n:3d} {name:5s} {l1:10.4f} {l2:10.4f} {MP:8.4f} {l3:12.4f} {a:12.4f} {b:10.4f} {1 + ovr:14.4f} {(1 / Np[s]).sum():12.4f}   kappa={kap:.3f} resid_rms*sqrtR={rr:.3f}")
        out["rows"].append(dict(n=n, variant=name, lam=float(l1), lam_On=float(l2), MP=MP, lam_resid=float(l3), ones=float(a), ones_On=float(b),
                                ovl_ratio=float(1 + ovr), sum_inv_norm=float((1 / Np[s]).sum()), kappa=kap, resid_rms_sqrtR=rr))
import os
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), "overlap_" + os.path.basename(sys.argv[1]).replace(".npz", ".json")), "w"))
