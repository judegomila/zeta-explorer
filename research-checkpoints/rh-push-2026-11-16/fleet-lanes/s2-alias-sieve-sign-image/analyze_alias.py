"""analyze_alias.py alias.json -> tables for combination (4)"""
import sys, json, math
import numpy as np
r = json.load(open(sys.argv[1])); names = r["variants"]; QS = r["QS"]
ix = {n: i for i, n in enumerate(names)}
sg = [i for i, n in enumerate(names) if n.startswith("SGN")]; un = [i for i, n in enumerate(names) if n.startswith("UNI")]
ch = [i for i, n in enumerate(names) if n.startswith("CHI")]
out = {"rows": []}
def generic(q):
    # random prime-supported vector: f = |tau(chi0)|^2 / sum_chi |tau(chi)|^2 for squarefree q, tau(chi)^2 = cond(chi) * [mu(q/cond)^2]
    # sum over characters mod q of the conductor = prod_{p|q} (1 + (p-2) p) for squarefree q
    s = 1
    m = q; p = 2
    while m > 1:
        if m % p == 0: s *= (1 + (p - 2) * p); m //= p
        p += 1
    return 1.0 / s
print("leak = 1 - f.  Columns: N | q | phi | 1-1/phi | generic leak | ZETA | LIOU | EA | TNR3 | CHI (4 values) | SGN mean f/generic (se) | UNI mean f/generic (se) | DH")
dh = {d["N"]: d for d in r.get("DH", [])}
for cp in r["checkpoints"]:
    N = cp["N"]
    for q in QS:
        f = np.array(cp["f"][str(q)]); phi = cp["phi"][str(q)]; gen = generic(q)
        row = {"N": N, "q": q, "phi": phi, "leak_theoremU": 1 - 1 / phi, "leak_generic": 1 - gen,
               "leak": {k: float(1 - f[ix[k]]) for k in ("ZETA", "LIOU", "EA", "TNR3")}, "leak_chi": [float(1 - f[i]) for i in ch],
               "sgn_f_over_generic": [float(f[sg].mean() / gen), float(f[sg].std() / gen / math.sqrt(len(sg)))],
               "uni_f_over_generic": [float(f[un].mean() / gen), float(f[un].std() / gen / math.sqrt(len(un)))],
               "chi_f_over_generic": [float(f[i] / gen) for i in ch],
               "DH_leak": (1 - dh[N]["f"][str(q)]) if N in dh else None, "DH_f_over_generic": (dh[N]["f"][str(q)] / gen) if N in dh else None}
        out["rows"].append(row)
        if q in (7, 30, 97, 30030) and N in (10 ** 5, 10 ** 7, 10 ** 8, 10 ** 9, 10 ** 10):
            print("| %.0e | %d | %d | %.6f | %.8f | %.3e | %.3e | %.3e | %.3e | %s | %.2f (%.2f) | %.2f (%.2f) | %s |" % (
                N, q, phi, 1 - 1 / phi, 1 - gen, row["leak"]["ZETA"], row["leak"]["LIOU"], row["leak"]["EA"], row["leak"]["TNR3"],
                " ".join("%.4f" % x for x in row["leak_chi"]), *row["sgn_f_over_generic"], *row["uni_f_over_generic"],
                ("%.5f" % row["DH_leak"]) if row["DH_leak"] is not None else "-"))
print("\nzeta leak * N (GRH scale: leak ~ q phi(q) c / N):")
for q in (7, 97, 30030):
    print(q, ["%.3g" % ((1 - cp["f"][str(q)][0]) * cp["N"]) for cp in r["checkpoints"]])
print("\nE_97(N,A) = (1-A) Y4 - A sum Z_g, normalised by N.  sign pattern over checkpoints for A = 0.1, 0.5, 0.9")
out["E97"] = {}
for k in ["ZETA", "LIOU", "EA", "TNR3"] + [names[i] for i in ch] + [names[i] for i in sg[:4]] + [names[i] for i in un[:2]]:
    i = ix[k]; pats = []; last = None
    for A in (0.1, 0.5, 0.9):
        vals = [(1 - A) * cp["Y4"][i][0] - A * sum(z[0] for z in cp["Z"][i]) for cp in r["checkpoints"]]
        pats.append("".join("+" if v > 0 else "-" for v in vals)); last = vals[-1] / r["checkpoints"][-1]["N"]
    y4 = [cp["Y4"][i][0] / cp["N"] for cp in r["checkpoints"]]
    zz = [sum(z[0] for z in cp["Z"][i]) / cp["N"] for cp in r["checkpoints"]]
    out["E97"][k] = {"signs_A0.1_0.5_0.9": pats, "Y4_over_N": y4, "sumZ_over_N": zz}
    print("%-7s %s  Y4/N first %.3e last %.3e ; sumZ/N last %.2e" % (k, " ".join(pats), y4[0], y4[-1], zz[-1]))
if dh:
    pats = []
    for A in (0.1, 0.5, 0.9):
        pats.append("".join("+" if ((1 - A) * d["Y4"] - A * sum(d["Z"])) > 0 else "-" for d in r["DH"]))
    out["E97"]["DH"] = {"signs_A0.1_0.5_0.9": pats, "Y4_over_N": [d["Y4"] / d["N"] for d in r["DH"]], "sumZ_over_N": [sum(d["Z"]) / d["N"] for d in r["DH"]], "N": [d["N"] for d in r["DH"]]}
    print("DH      %s  Y4/N %s ; sumZ/N %s" % (" ".join(pats), ["%.2e" % x for x in out["E97"]["DH"]["Y4_over_N"]], ["%.2e" % x for x in out["E97"]["DH"]["sumZ_over_N"]]))
json.dump(out, open(sys.argv[1].replace(".json", "_summary.json"), "w"), indent=1)
