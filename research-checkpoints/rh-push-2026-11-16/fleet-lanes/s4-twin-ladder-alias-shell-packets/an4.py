"""an4.py -- analysis of combination 4: Airy-envelope packet sums (c4.pkl) and the covariance test (c4_cov.json) -> an4.json, an4.md"""
import json, math, pickle, sys
from collections import defaultdict
import numpy as np
from scipy.integrate import quad
from scipy.special import airy
import s4lib as S

pre = sys.argv[1] if len(sys.argv) > 1 else "c4"
import glob
fs = sorted(glob.glob(pre + "_p*.pkl")) or [pre + ".pkl"]
R = pickle.load(open(fs[0], "rb"))
for f_ in fs[1:]:
    R2 = pickle.load(open(f_, "rb")); R["rows"] += R2["rows"]; R["sec"] += R2["sec"]
rows = R["rows"]; CUTS = R["CUTS"]
ON = ["ZETA", "CHI5", "CHI101", "SGN", "UNI", "EA"]
out = {}; md = []
I = [quad(lambda t: airy(t)[0], -c, 8.0, limit=400)[0] for c in CUTS]; IA = [quad(lambda t: abs(airy(t)[0]), -c, 8.0, limit=400)[0] for c in CUTS]
out["airy_integrals"] = dict(cuts=CUTS, int_Ai=I, int_absAi=IA)
md.append("Cuts X (support x >= -X): %s; int Ai over the support: %s; int abs(Ai): %s." % (", ".join("%.6g" % c for c in CUTS), ", ".join("%.5f" % v for v in I), ", ".join("%.5f" % v for v in IA)))
# geometric sign condition of the record for the controlling alias h = p-1: d = k - 1 + 1/p >= a_1 / mu(d), mu = d^(1/3)/1.7
geo = {}
for k in (1, 2, 3, 4, 5, 7):
    for p in (3, 97, 99991):
        d = k - 1 + 1 / p; geo["k=%d,p=%d" % (k, p)] = dict(d=d, dmin=S.A1 * 1.7 / d ** (1 / 3), holds=bool(d >= S.A1 * 1.7 / d ** (1 / 3)))
out["geometric_condition"] = geo
md.append("Record's support condition d_(p-1) >= a_1/mu (d = k - 1 + 1/p, mu = d^(1/3)/1.7) is equivalent to d >= %.4f: it holds for k >= 4 and fails for k <= 3, for every p. It does not depend on the object or the height.\n" % ((S.A1 * 1.7) ** 0.75))
grp = defaultdict(list)
for r in rows: grp[(r["T"], r["k"] if r["k"] <= 3 else 4)].append(r)
md.append("**Untwisted envelope sum W = sum_p log p eps_F(p) Ai((p-c)/H) over x >= -X.** Entries: share of windows with Re W <= 0 (fail) / mean of Re W / M1; ZETA also mean of W / (H int Ai).\n")
md.append("| T | k | windows | primes | cut X | ZETA fail / nu / ratio to H int Ai | EA | CHI5 | CHI101 | SGN | UNI |\n|---|---|---|---|---|---|---|---|---|---|---|")
tabU = {}
for (T, kk), rs in sorted(grp.items()):
    for m, cu in enumerate(CUTS):
        cells = {}
        for o, nm in enumerate(ON):
            W = np.array([r["W"][o, m, 0] for r in rs]); M1 = np.array([r["M"][1 if nm == "EA" else 0, m, 0] for r in rs])
            cells[nm] = (float((W.real <= 0).mean()), float((W.real / M1).mean()))
        Wz = np.array([r["W"][0, m, 0] for r in rs]); H = np.array([r["H"] for r in rs]); rat = float((Wz.real / (H * I[m])).mean()); rsd = float((Wz.real / (H * I[m])).std())
        tabU["T=%g,k=%s,X=%.4g" % (T, kk, cu)] = dict(cells=cells, zeta_ratio=rat, zeta_ratio_sd=rsd, n=len(rs))
        md.append("| %g | %s | %d | %.3g | %.4g | %.3f / %.4f / %.5f (sd %.1e) | %s |" % (T, "%d" % kk if kk < 4 else ">=4", len(rs), sum(r["npk"] for r in rs), cu, cells["ZETA"][0], cells["ZETA"][1], rat, rsd,
                  " | ".join("%.3f / %.4f" % cells[nm] for nm in ["EA", "CHI5", "CHI101", "SGN", "UNI"])))
out["untwisted"] = tabU
md.append("\n**Alias-twisted sum W_tw = sum_p log p eps_F(p) e(n(p-1)/p) Ai(...), controlling alias h = p-1, cut X = a_1 (envelope >= 0 on the support).** Model for ZETA: -H int Ai/(p-1). Entries: share of windows with Re W_tw >= 0 (sign opposite to the model) / mean of Re W_tw (p-1)/(H int Ai) for ZETA; share with Re W_tw >= 0 for the others; rms of abs(W_tw)/sqrt(M2) for ZETA and SGN.\n")
md.append("| class | T | p | windows | mean H | ZETA wrong sign / mean ratio (model -1) | EA | CHI5 | CHI101 | SGN | UNI | rms z ZETA | rms z SGN | predicted main/noise (H int Ai/(p-1))/sqrt(M2) |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
tabT = {}
for kcls, ksel in (("k >= 2", lambda k: k >= 2), ("k = 1", lambda k: k == 1)):
    g2 = defaultdict(list)
    for r in rows:
        if ksel(r["k"]): g2[(r["T"], r["p"])].append(r)
    for (T, p), rs in sorted(g2.items()):
        m = 0; Wz = np.array([r["W"][0, m, 1] for r in rs]); H = np.array([r["H"] for r in rs]); M2 = np.array([r["M"][0, m, 1] for r in rs])
        fr = {nm: float((np.array([r["W"][o, m, 1] for r in rs]).real >= 0).mean()) for o, nm in enumerate(ON)}
        rat = float((Wz.real * (p - 1) / (H * I[m])).mean()); zz = float(np.sqrt((np.abs(Wz) ** 2 / M2).mean()))
        Ws = np.array([r["W"][3, m, 1] for r in rs]); zs = float(np.sqrt((np.abs(Ws) ** 2 / M2).mean())); sn = float((H * I[m] / (p - 1) / np.sqrt(M2)).mean())
        tabT["%s,T=%g,p=%d" % (kcls, T, p)] = dict(frac_wrong=fr, zeta_ratio=rat, rms_z_zeta=zz, rms_z_sgn=zs, signal_to_noise=sn, n=len(rs), H_mean=float(H.mean()))
        md.append("| %s | %g | %d | %d | %.3g | %.3f / %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3f | %.3g |" % (kcls, T, p, len(rs), H.mean(), fr["ZETA"], rat, fr["EA"], fr["CHI5"], fr["CHI101"], fr["SGN"], fr["UNI"], zz, zs, sn))
out["twisted"] = tabT
try:
    C = json.load(open(pre + "_cov.json")); out["cov"] = C["rows"]
    md.append("\n**Covariance of cos(U lambda_l), cos(U lambda_m), U ~ Cauchy(T, x), %g samples, against K_T (%d pairs per set).** z = (measured - K_T)/standard error (64 batches).\n" % (C["nsamp"], C["rows"][0]["npairs"]))
    md.append("| T | x | set | max abs z | rms z | share abs z > 3 | max abs deviation | max abs K_T |\n|---|---|---|---|---|---|---|---|")
    for r in C["rows"]:
        md.append("| %g | %g | %s | %.2f | %.3f | %.4f | %.2e | %.3f |" % (r["T"], r["x"], r["set"], r["max_abs_z"], r["rms_z"], r["frac_absz_gt3"], r["max_abs_dev"], r["max_abs_K"]))
except FileNotFoundError:
    pass
out["sec"] = R["sec"]; out["windows"] = len(rows); out["primes"] = int(sum(r["npk"] for r in rows))
json.dump(out, open("an4.json", "w"), indent=1, default=float); open("an4.md", "w").write("\n".join(md) + "\n"); print("\n".join(md))
