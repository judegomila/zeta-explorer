#!/usr/bin/env python3
"""Tables and fits for c4-kloss-marks-scaleup. Reads cert_*.json (this lane) and ../n2-kloss-sdp-certificate/sdp_Z*_M1.0_l0.333.json."""
import json, glob, math, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))


def fit(xs, ys):
    x = np.log(np.array(xs, float)); y = np.log(np.array(ys, float))
    A = np.vstack([x, np.ones_like(x)]).T
    c, res, *_ = np.linalg.lstsq(A, y, rcond=None)
    k = len(x)
    if k <= 2:
        return c[0], float("nan")
    s2 = ((y - A @ c) ** 2).sum() / (k - 2)
    se = math.sqrt(s2 / ((x - x.mean()) ** 2).sum())
    return c[0], se


old = {}
for f in sorted(glob.glob(os.path.join(HERE, "../n2-kloss-sdp-certificate/sdp_Z*_M1.0_l0.333.json"))):
    d = json.load(open(f)); Z = int(os.path.basename(f).split("_")[1][1:])
    old[Z] = {v: (d["n"], d["R"], d["variants"][v]["sdp_over_tr"]) for v in d["variants"]}
new = {}
for f in sorted(glob.glob(os.path.join(HERE, "cert_g_Z*.json")) + glob.glob(os.path.join(HERE, "cert_x_Z*.json"))):
    d = json.load(open(f)); Z = int(d["Z"])
    for r in d["runs"]:
        new.setdefault(Z, {})[(r["n"], r["variant"])] = r
        r["R"] = d["R"]; r["Z"] = Z
Zs = sorted(new)
print("== certified brackets  lower(sign) <= lower(unimodular) <= mu/tr <= upper   [all certified = %s]" % all(r["certified"] for z in new for r in new[z].values()))
vars_ = ["Ap", "Rc", "R", "K4a", "Rc4", "A", "Q", "QRc", "QR", "T6", "K", "Q0"]
for Z in Zs:
    ns = sorted(set(k[0] for k in new[Z]))
    for n in ns:
        for v in vars_:
            r = new[Z].get((n, v))
            if r:
                print(f"Z={Z:8d} n={n:3d} {r['tag']:14s} {v:4s} [{r['ratio_lower_sign']:.6f}, {r['ratio_lower']:.6f}, {r['ratio_upper']:.6f}]  width={r['ratio_upper'] - r['ratio_lower']:.1e}  MP={r['MP']:.4f}  n={n} R={r['R']}")
print("\n== natural slot [Z^l, 2 Z^l], (M, l) = (1, 1/3): SDP/tr (n2 float64 for Z <= 32000; certified upper bound for Z >= 128000)")
print("       Z    n        R      Ap       R(pair)   K        MP")
pts = {v: [] for v in vars_}; npts = []
for Z in sorted(old):
    o = old[Z]; print(f"{Z:8d} {o['Ap'][0]:4d} {o['Ap'][1]:8d}  {o['Ap'][2]:.4f}   {o['R'][2]:.4f}   {o['K'][2]:8.3f}  {(1 + math.sqrt(o['Ap'][0] / o['Ap'][1])) ** 2:.4f}")
    for v in ["Ap", "R", "K"]:
        pts[v].append((Z, o[v][2]))
    npts.append((Z, o["Ap"][0]))
for Z in Zs:
    nat = [r for r in new[Z].values() if "natural" in r["tag"]]
    if not nat:
        continue
    n = nat[0]["n"]; npts.append((Z, n))
    g = lambda v: new[Z][(n, v)]["ratio_upper"] if (n, v) in new[Z] else float("nan")
    print(f"{Z:8d} {n:4d} {nat[0]['R']:8d}  {g('Ap'):.4f}   {g('R'):.4f}   {g('K'):8.3f}  {nat[0]['MP']:.4f}   Rc={g('Rc'):.4f} K4a={g('K4a'):.4f} Q={g('Q'):.4f}")
    for v in vars_:
        if (n, v) in new[Z]:
            pts[v].append((Z, g(v)))
print("\n== fitted exponent e in (mu/tr upper bound) ~ Z^e, natural slot; +- one standard error")
for v in vars_:
    p = pts[v]
    if len(p) >= 3:
        e, se = fit([a for a, b in p], [b for a, b in p]); print(f"  {v:4s} all Z ({len(p)} points, Z={p[0][0]}..{p[-1][0]}): e = {e:+.4f} +- {se:.4f}")
    p2 = [q for q in p if q[0] >= 8000]
    if len(p2) >= 3 and len(p2) < len(p):
        e, se = fit([a for a, b in p2], [b for a, b in p2]); print(f"  {v:4s} Z >= 8000 ({len(p2)} points): e = {e:+.4f} +- {se:.4f}")
    p3 = [q for q in p if q[0] >= 128000]
    if len(p3) >= 3:
        e, se = fit([a for a, b in p3], [b for a, b in p3]); print(f"  {v:4s} Z >= 128000 ({len(p3)} points): e = {e:+.4f} +- {se:.4f}")
e, se = fit([a for a, b in npts], [b for a, b in npts]); print(f"  number of marks n: e = {e:+.4f} +- {se:.4f}   (trivial bound mu/tr <= n);  K-loss exponent M + l - 1 = 0.3333")
print("\n== fixed number of marks (first n primes of norm >= Z^l): exponent in Z, and exponent in n at fixed Z")
for v in ["Ap", "Rc", "R", "K4a", "K"]:
    for n in [8, 12, 16, 24, 32]:
        p = [(Z, new[Z][(n, v)]["ratio_upper"]) for Z in Zs if (n, v) in new[Z]]
        if len(p) >= 3:
            e, se = fit([a for a, b in p], [b for a, b in p]); print(f"  {v:4s} n={n:2d}: " + " ".join(f"{b:.4f}" for a, b in p) + f"   e_Z = {e:+.4f} +- {se:.4f}")
    for Z in Zs:
        p = [(n, new[Z][(n, v)]["ratio_upper"]) for n in [8, 12, 16, 24, 32] if (n, v) in new[Z]]
        if len(p) >= 3:
            e, se = fit([a for a, b in p], [b for a, b in p]); print(f"  {v:4s} Z={Z}: e_n = {e:+.4f} +- {se:.4f}")

print("\n== overlap model Gn = On + noise (overlap_*.json): per variant, range over all files and nested slots with n >= 8")
ov = {}
for f in sorted(glob.glob(os.path.join(HERE, "overlap_*.json"))):
    d = json.load(open(f))
    for r in d["rows"]:
        ov.setdefault(r["variant"], []).append((d["Z"], r))
for v, rows in ov.items():
    k = [r["kappa"] for z, r in rows]; a = [r["lam"] / r["lam_On"] for z, r in rows]; b = [r["lam_resid"] / r["MP"] for z, r in rows]
    c = [r["resid_rms_sqrtR"] for z, r in rows]
    print(f"  {v:4s} ({len(rows):2d} cases): kappa in [{min(k):+.3f}, {max(k):+.3f}] mean {np.mean(k):+.3f};  lam_max(Gn)/lam_max(On) in [{min(a):.3f}, {max(a):.3f}];"
          f"  lam_max(Gn - On + I)/MP in [{min(b):.3f}, {max(b):.3f}];  residual rms*sqrt(R) in [{min(c):.2f}, {max(c):.2f}]")
print("\n== natural slot: overlap prediction")
for f in sorted(glob.glob(os.path.join(HERE, "overlap_*.json")), key=lambda s: json.load(open(s))["Z"]):
    d = json.load(open(f))
    if os.path.basename(f).startswith("overlap_w"):
        continue
    nn = [r for r in d["rows"] if r["variant"] == "Ap"]
    natn = {128000: 10, 512000: 15, 2048000: 24, 8192000: 33}.get(int(d["Z"]))
    for r in nn:
        if r["n"] == natn:
            P = d["Z"] ** (1 / 3)
            print(f"  Z={int(d['Z']):8d} n={natn:3d}: lam_max(Gn)={r['lam']:.4f}  lam_max(On)={r['lam_On']:.4f}  1+sum 1/N(p)={1 + r['sum_inv_norm']:.4f}  1+log(log 2P/log P)={1 + math.log(math.log(2 * P) / math.log(P)):.4f}  MP={r['MP']:.4f}  residual lam/MP={r['lam_resid'] / r['MP']:.4f} kappa={r['kappa']:.3f}")
