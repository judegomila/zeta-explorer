#!/usr/bin/env python3
"""Tables, exponent fits and dual-weight fits from sdp_*.json. Small arrays only (largest: n ~ 3000 floats)."""
import json, glob, math, re, os, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
runs = []
for f in glob.glob(os.path.join(HERE, "sdp_Z*.json")):
    m = re.search(r"sdp_Z(\d+)_M([\d.]+)_l([\d.]+)\.json", f)
    d = json.load(open(f)); d["Z"] = int(m.group(1)); d["M"] = float(m.group(2)); d["l"] = float(m.group(3)); runs.append(d)
runs.sort(key=lambda d: (d["M"], d["l"], d["Z"]))


def fit(xs, ys):
    xs = np.array(xs); ys = np.array(ys)
    A = np.vstack([xs, np.ones_like(xs)]).T
    co, res, *_ = np.linalg.lstsq(A, ys, rcond=None)
    r = ys - A @ co
    se = math.sqrt((r @ r) / max(len(xs) - 2, 1) / ((xs - xs.mean()) ** 2).sum())
    return co[0], se


print("TABLE 1. SDP(G)/tr G (certified upper value), lower bound of the true maximum, comparison values")
print("M l Z n R gamma | var: SDP/tr [gap] maxlb/tr n*lam/tr Gersh/tr | Kfac=Z^(M+l-1) | MP=(1+sqrt(n/R))^2")
for d in runs:
    g = d["n"] / d["R"]
    s = f"{d['M']:.2f} {d['l']:.3f} {d['Z']:6d} n={d['n']:5d} R={d['R']:5d} g={g:.3f} |"
    for v in ["Ap", "R", "K"]:
        r = d["variants"][v]
        s += f" {v}: {r['sdp_over_tr']:.4f} [{r['gap_rel']:.0e}] {r['maxlb_over_tr']:.4f} {r['lam_n_over_tr']:.3f} {r['gersh_over_tr']:.2f} |"
    s += f" Kfac={d['Z'] ** (d['M'] + d['l'] - 1):.1f} MP={(1 + math.sqrt(g)) ** 2:.3f}"
    print(s)

print("\nTABLE 2. fitted exponent e in (quantity) ~ Z^e, least squares on log-log, +- 1 standard error; K-loss exponent = M+l-1")
keys = sorted(set((d["M"], d["l"]) for d in runs))
for (M, l) in keys:
    rr = [d for d in runs if d["M"] == M and d["l"] == l]
    if len(rr) < 3:
        continue
    lz = [math.log(d["Z"]) for d in rr]
    s = f"M={M:.2f} l={l:.3f} Kloss={M + l - 1:.3f} log n: {fit(lz, [math.log(d['n']) for d in rr])[0]:.3f} |"
    for v in ["Ap", "R", "K"]:
        for q in ["sdp_over_tr", "maxlb_over_tr", "gersh_over_tr"]:
            e, se = fit(lz, [math.log(d["variants"][v][q]) for d in rr])
            s += f" {v}.{q.split('_')[0]}: {e:+.3f}+-{se:.3f}"
        s += " |"
    e, se = fit(lz, [math.log((1 + math.sqrt(d["n"] / d["R"])) ** 2) for d in rr]); s += f" MP: {e:+.3f}"
    print(s)

print("\nTABLE 3. off-diagonal statistics of the normalised Gram (units of R^-1/2): rms, max, sqrt(log #pairs); conjugate pairs (p, pbar) rms")
for d in runs:
    s = f"{d['M']:.2f} {d['l']:.3f} {d['Z']:6d} n={d['n']:5d} |"
    for v in ["Ap", "R", "K"]:
        r = d["variants"][v]
        s += f" {v}: rms={r['off_rms_sqrtR']:.3f} max={r['off_max_sqrtR']:.2f} conj({r['conj_pairs']})={r['conj_off_rms_sqrtR']:.3f} |"
    s += f" sqrtlog={d['variants']['Ap']['gauss_max_pred']:.2f}"
    print(s)

print("\nTABLE 4. dual weights D_p (variant Ap; R in brackets). u_p = D_p/G_pp ; fit log D_p = c - s log N(p); "
      "D_p N(p)/R ; variance of log u_p explained by class (eta^2) against the chance level (classes-1)/(n-1)")
for d in runs:
    n = d["n"]
    if n < 12:
        continue
    Np = np.array(d["Np"]); SU = np.array(d["SU"]); SV = np.array(d["SV"]); split = np.array(d["split"])
    s = f"{d['M']:.2f} {d['l']:.3f} {d['Z']:6d} n={n:5d} |"
    for v in ["Ap", "R"]:
        r = d["variants"][v]
        D = np.array(r["D"]); Gd = np.array(r["Gdiag"]); u = D / Gd
        sl, se = fit(np.log(Np), np.log(D))
        slg, seg = fit(np.log(Np), np.log(Gd))
        lu = np.log(u)
        s += (f" {v}: u mean={u.mean():.4f} cv={u.std() / u.mean():.3f} corr(D,Gd)={np.corrcoef(D, Gd)[0, 1]:.3f} "
              f"slope D={sl:+.2f}+-{se:.2f} slope Gd={slg:+.2f}+-{seg:.2f} DN/R={np.mean(D * Np) / d['R']:.4f}")
        if v == "Ap":
            for cname, cls in [("mod2", (SU % 2) * 2 + (SV % 2)), ("mod9", (SU % 9) * 9 + (SV % 9)), ("Nmod4", Np.astype(int) % 4),
                               ("Nmod7", Np.astype(int) % 7)]:
                tot = ((lu - lu.mean()) ** 2).sum(); bet = 0.0; k = 0
                for c in np.unique(cls):
                    sel = cls == c; k += 1
                    bet += sel.sum() * (lu[sel].mean() - lu.mean()) ** 2
                s += f" eta2[{cname}]={bet / tot:.3f}(chance {(k - 1) / (n - 1):.3f})"
            s += f" inert={int((~split).sum())}"
        s += " |"
    print(s)
