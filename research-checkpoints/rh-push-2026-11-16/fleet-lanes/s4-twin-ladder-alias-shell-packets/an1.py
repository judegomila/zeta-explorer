"""an1.py -- analysis of combination 1 (c1.json, c1_sieve.npz, c1_fft.json) -> an1.json + an1.md"""
import json, math, sys
from fractions import Fraction
import numpy as np
import s4lib as S

pre = sys.argv[1] if len(sys.argv) > 1 else "c1"
import glob
rows = {}
for f_ in sorted(glob.glob(pre + "A_*.json")) or [pre + ".json"]:
    for r_ in json.load(open(f_))["A"]: rows[(r_["y"], r_["N"])] = r_
rows = [rows[k_] for k_ in sorted(rows)]
out = dict(tables={}); md = []
chi5 = [0, 1, 1j, -1j, -1]; dh = [0, 1, S.KAPPA, -S.KAPPA, -1]
leg = [S.leg101(x) for x in range(101)]; tab = np.cumsum(leg)


def sum_per(vals, N, q):
    return sum(vals[r] * ((N - r) // q + 1) for r in range(1, q) if r <= N)


def signstats(Ns, E):
    E = np.array(E); s = np.sign(E.real); s = s[s != 0]
    return dict(pos=int((s > 0).sum()), neg=int((s < 0).sum()), changes=int((s[1:] != s[:-1]).sum()),
                max_abs_over_sqrtN=float(np.max(np.abs(E) / np.sqrt(Ns))), last=float(E[-1].real))


for y in sorted(set(r["y"] for r in rows)):
    pr = [int(p) for p in S.primes_upto(y)]
    for sel, tag in ((lambda r: not (r["y"] == 97 and r["N"] > 10 ** 12 and r["N"] <= 10 ** 12 + 2 * 10 ** 9 and r["N"] % 10 ** 6 == 0 and r["N"] != 10 ** 12 and str(r["N"])[:4] == "1000"), "grid"),
                     (lambda r: r["y"] == 97 and 10 ** 12 < r["N"] <= 10 ** 12 + 2 * 10 ** 9 and r["N"] % 10 ** 6 == 0, "dense")):
        rr = [r for r in rows if r["y"] == y and sel(r)]
        if tag == "dense": rr = [r for r in rows if r["y"] == y and 10 ** 12 < r["N"] <= 10 ** 12 + 2 * 10 ** 9 and r["N"] % 10 ** 6 == 0]
        else: rr = [r for r in rows if r["y"] == y and not (10 ** 12 < r["N"] <= 10 ** 12 + 2 * 10 ** 9 and r["N"] % 10 ** 6 == 0)]
        if len(rr) < 3: continue
        Ns = np.array([r["N"] for r in rr], dtype=float)
        Ay = Fraction(1)
        for p in pr: Ay *= Fraction(p - 1, p)
        objs = {}
        objs["ZETA"] = ([r["phi"] for r in rr], [r["N"] for r in rr], Ay)
        A5 = complex(np.prod([1 - chi5[p % 5] / p for p in pr])); A101 = float(np.prod([1 - leg[p % 101] / p for p in pr]))
        objs["CHI5"] = ([sum(chi5[k + 1] * r["res5"][k] for k in range(4)) for r in rr], [sum_per(chi5, r["N"], 5) for r in rr], A5)
        objs["CHI101"] = ([r["chi101"] for r in rr], [int(tab[r["N"] % 101]) for r in rr], A101)
        objs["DH"] = ([sum(dh[k + 1] * r["res5"][k] for k in range(4)) for r in rr], [sum_per(dh, r["N"], 5) for r in rr], None)
        for sd in range(min(len(r["Ssgn"]) for r in rr)):
            As = Fraction(1)
            for p in pr: As *= Fraction(p - S.sgn(p, S.SEED + sd), p)
            objs["SGNy_%d" % sd] = ([r["phi"] for r in rr], [r["Ssgn"][sd] for r in rr], As)
        tn = 1 + S.TNR_C * math.sqrt(3) / 3 + 1 / 3
        objs["TNR"] = ([r["phi"] for r in rr], [r["N"] + S.TNR_C * math.sqrt(3) * (r["N"] // 3) + 3 * (r["N"] // 9) for r in rr], float(Ay) / tn if 3 in pr else None)
        T = {}
        for name, (Y4, Sm, An) in objs.items():
            T[name] = {}
            for A in (0.1, 0.5, 0.9):
                T[name]["A=%g" % A] = signstats(Ns, [(1 - A) * complex(yv) - A * (complex(sv) - complex(yv)) for yv, sv in zip(Y4, Sm)])
            if An is not None:
                if isinstance(An, Fraction) and all(isinstance(v, int) for v in Sm):
                    E = [float(Fraction(yv) - An * sv) for yv, sv in zip(Y4, Sm)]
                else:
                    E = [complex(yv) - complex(An) * complex(sv) for yv, sv in zip(Y4, Sm)]
                st = signstats(Ns, E); st["rms"] = float(np.sqrt(np.mean(np.abs(np.array(E)) ** 2))); st["A"] = [complex(An).real, complex(An).imag]
                st["decades"] = {("%.0e" % r["N"]): (float(np.real(e)) if abs(np.imag(e)) == 0 else [float(np.real(e)), float(np.imag(e))]) for r, e in zip(rr, E) if str(r["N"]).strip("0") == "1"}
                T[name]["A=natural"] = st
        ru = [r for r in rr if "Suni" in r]
        if len(ru) >= 3:
            Au = complex(np.prod([1 - np.exp(2j * np.pi * S.uni(p)) / p for p in pr])); Nu = np.array([r["N"] for r in ru], dtype=float); T["UNIy"] = {}
            for A in (0.1, 0.5, 0.9):
                T["UNIy"]["A=%g" % A] = signstats(Nu, [(1 - A) * r["phi"] - A * (complex(*r["Suni"]) - r["phi"]) for r in ru])
            E = [r["phi"] - Au * complex(*r["Suni"]) for r in ru]; st = signstats(Nu, E); st["rms"] = float(np.sqrt(np.mean(np.abs(np.array(E)) ** 2))); st["A"] = [Au.real, Au.imag]; st["n"] = len(ru); st["Nmax"] = float(Nu.max())
            T["UNIy"]["A=natural"] = st; objs["UNIy"] = None
        T["_meta"] = dict(n_points=len(rr), Nmin=int(Ns.min()), Nmax=int(Ns.max()), nodes_max=max(r["nodes"] for r in rr), Ay=float(Ay))
        out["tables"]["y=%d/%s" % (y, tag)] = T
        md.append("\n**y = %d, %s: %d values of N in [%.3g, %.3g]; A_y = prod(1-1/p) = %.6g; largest DFS %.3g nodes.**\n" % (y, tag, len(rr), Ns.min(), Ns.max(), float(Ay), T["_meta"]["nodes_max"]))
        md.append("| object | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | natural A: +/-/changes | rms E | max abs(E)/sqrt(N) |\n|---|---|---|---|---|---|---|")
        for name in objs:
            t = T[name]; f = lambda s: "%d/%d/%d" % (s["pos"], s["neg"], s["changes"])
            nat = t.get("A=natural")
            md.append("| %s | %s | %s | %s | %s | %s | %s |" % (name if name != "UNIy" else "UNIy (%d values, N <= %.0e)" % (t["A=natural"]["n"], t["A=natural"]["Nmax"]), f(t["A=0.1"]), f(t["A=0.5"]), f(t["A=0.9"]), f(nat) if nat else "-", "%.4g" % nat["rms"] if nat else "-", "%.3g" % nat["max_abs_over_sqrtN"] if nat else "-"))
# predicted variance of the full-period remainder
for y in (97, 997):
    pr = S.primes_upto(y); out["rms_full_period_y%d" % y] = float(math.sqrt(np.prod([2 - 2 / p for p in pr]) / 12))

# ---- sieve part
try:
    Z = np.load(pre + "_sieve.npz"); ends = Z["ends"].astype(float); I = Z["I"]; Dd = Z["D"]
    A97 = float(np.prod([1 - 1 / p for p in S.P97])); A997 = float(np.prod([1 - 1 / p for p in S.P997]))
    sv = {}
    md.append("\n**Factor sieve, coefficients twisted on all primes, N up to %.3g, %d sample points (every 2^22).** Check: count of 97-rough n = %d, 997-rough = %d.\n" % (ends[-1], len(ends), I[-1, 0], I[-1, 1]))
    md.append("| object | y | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | A = A_y | max abs(Y_4)/sqrt(N) | abs(S)/sqrt(N) at the end |\n|---|---|---|---|---|---|---|---|")
    series = {"SGNG": (I[:, 2].astype(float), I[:, 3].astype(float), I[:, 4].astype(float)),
              "UNIG": (Dd[:, 0] + 1j * Dd[:, 1], Dd[:, 2] + 1j * Dd[:, 3], Dd[:, 4] + 1j * Dd[:, 5]),
              "EA": (Dd[:, 6], Dd[:, 7], Dd[:, 8]), "ZETA": (ends, I[:, 0].astype(float), I[:, 1].astype(float))}
    for name, (Sm, Y97, Y997) in series.items():
        for y, Y4, Ay in ((97, Y97, A97), (997, Y997, A997)):
            st = {}
            for A in (0.1, 0.5, 0.9, Ay):
                st["A=%.4g" % A] = signstats(ends, (1 - A) * Y4 - A * (Sm - Y4))
            st["Y4_over_sqrtN_max"] = float(np.max(np.abs(Y4) / np.sqrt(ends))); st["S_over_sqrtN_end"] = float(abs(Sm[-1]) / math.sqrt(ends[-1]))
            sv["%s/y=%d" % (name, y)] = st; k = list(st.keys()); f = lambda s: "%d/%d/%d" % (s["pos"], s["neg"], s["changes"])
            md.append("| %s | %d | %s | %s | %s | %s | %.3g | %.3g |" % (name, y, f(st[k[0]]), f(st[k[1]]), f(st[k[2]]), f(st[k[3]]), st["Y4_over_sqrtN_max"], st["S_over_sqrtN_end"]))
    out["sieve"] = sv; out["sieve_N"] = float(ends[-1]); out["sieve_counts"] = [int(I[-1, 0]), int(I[-1, 1])]
except FileNotFoundError:
    pass
try:
    F = json.load(open(pre + "_fft.json")); out["fft"] = {k: {kk: vv for kk, vv in v.items() if kk != "shell_sums"} for k, v in F["objects"].items()}
    md.append("\n**FFT of the live shell Y_4, M = %d (float64 GPU: %s); predicted alias fraction for coefficients periodic mod a divisor of 210: %.6f.**\n" % (F["M"], F["gpu"], F.get("predicted_alias210_fraction_periodic", float("nan"))))
    md.append("| object | energy fraction on the 210 frequencies a/210 | exact residue-sum value | sup off these, / sqrt(M sum c^2) | Re Y_4(1/2)/abs Y_4(0), Re Y_4(1/3)/abs Y_4(0) | share of grid with Re E > 0 (A = 0.5 / A_97) | FFT vs exact |\n|---|---|---|---|---|---|---|")
    for k, v in F["objects"].items():
        md.append("| %s | %.6g | %s | %.4g | %.4g, %.4g | %.4f / %.4f | %s |" % (k, v["alias210_energy_fraction"], ("%.6g" % v["alias_exact_energy_fraction"]) if "alias_exact_energy_fraction" in v else "-",
                  v["sup_off_alias_over_sqrt_energy"], v["Y4_at_1_over_q"]["2"][0], v["Y4_at_1_over_q"]["3"][0], v["E_A=0.5"]["frac_Re_positive"], v["E_A=A97"]["frac_Re_positive"],
                  ("%.2g" % v["alias_fft_vs_exact_maxabs"]) if "alias_fft_vs_exact_maxabs" in v else "-"))
except FileNotFoundError:
    pass
json.dump(out, open("an1.json", "w"), indent=1, default=float); open("an1.md", "w").write("\n".join(md) + "\n"); print("\n".join(md))
