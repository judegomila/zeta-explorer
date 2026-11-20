#!/usr/bin/env python3
"""status.py [base_dir] -- per experiment: sizes done, current size, latest fitted exponent with error bar, verdict so far.
Reads <base>/e{1,2,3}/out/results.jsonl, <base>/units.txt (experiment, unit) and the unit logs in ~/rh-push/logs."""
import os, sys, json, math, glob, subprocess
import numpy as np
BASE = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE, "common"))
from kstats import wfit
THR = 1.0 / 18                                                            # model threshold on the retained fraction of the K-loss exponent


def load(e):
    p = os.path.join(BASE, e, "out", "results.jsonl"); out = []
    if os.path.exists(p):
        for line in open(p):
            try:
                out.append(json.loads(line))
            except Exception:
                pass
    return out


def units():
    p = os.path.join(BASE, "units.txt"); u = {}
    if os.path.exists(p):
        for line in open(p):
            t = line.split()
            if len(t) >= 2:
                u[t[0]] = t[1]
    return u


def unit_state(name):
    if not name:
        return "no unit recorded", ""
    env = dict(os.environ, XDG_RUNTIME_DIR=f"/run/user/{os.getuid()}")
    try:
        st = subprocess.run(["systemctl", "--user", "is-active", name], capture_output=True, text=True, env=env).stdout.strip()
    except Exception:
        st = "unknown"
    log = os.path.expanduser(f"~/rh-push/logs/{name}.log"); last = ""
    if os.path.exists(log):
        with open(log, "rb") as fh:
            fh.seek(0, 2); sz = fh.tell(); fh.seek(max(0, sz - 4000)); tail = fh.read().decode(errors="replace").strip().splitlines()
        last = tail[-1][:200] if tail else ""
        cur = [x for x in tail if ("rows " in x and "%" in x) or "point" in x or "Z=" in x or "q=" in x]
        if cur:
            last = cur[-1][:200]
    return st, last


def verdict(theta, se):
    if not np.isfinite(theta) or not np.isfinite(se):
        return "not enough sizes for a fit"
    if theta + 2 * se < THR:
        return f"SUPPORTS removal of the loss at the tested scales (retained fraction {theta:+.3f} +- {se:.3f} < 1/18 at 2 se)"
    if theta - 2 * se > THR:
        return f"KILLS removal (retained fraction {theta:+.3f} +- {se:.3f} > 1/18 at 2 se)"
    return f"UNDECIDED (retained fraction {theta:+.3f} +- {se:.3f}; threshold 1/18 = 0.056 inside 2 se)"


U = units()
print("=" * 110)
# ------------------------------------------------------------------------------------------------ E1
r1 = [d for d in load("e1") if "l" in d]; st, last = unit_state(U.get("E1"))
print(f"E1  K-loss over Z[omega] (mark Gram, infinity-to-one norm against trace)      unit {U.get('E1')}: {st}")
print(f"    current: {last}")
if r1:
    for l in sorted({round(d["l"], 4) for d in r1}):
        rr = sorted([d for d in r1 if round(d["l"], 4) == l], key=lambda d: d["Z"])
        key = lambda d, v: d["variants"][v]["sdp_tr"] if d["variants"][v].get("sdp_tr") else d["variants"][v]["nlam_tr"]
        sek = lambda d, v: d["variants"][v]["se"].get("sdp_tr", d["variants"][v]["se"]["nlam_tr"])
        print(f"  family (M, l) = ({rr[0]['M']:g}, {l:.4f}); K-loss exponent M + l - 1 = {rr[0]['M'] + l - 1:.4f}; sizes done: {len(rr)} (Z = {rr[0]['Z']:g} .. {rr[-1]['Z']:g})")
        print("       Z        n       R    SDP/tr Ap (se)     random (se)     pole K      MP    Ap/random   pair_max Ap  *Z^l   Gersh/tr")
        for d in rr:
            a = key(d, "Ap"); r = key(d, "R"); kk = key(d, "K") if "K" in d["variants"] else float("nan")
            print(f"  {d['Z']:10.0f} {d['n']:5d} {d['R']:8d}   {a:7.4f} ({sek(d, 'Ap'):.4f})  {r:7.4f} ({sek(d, 'R'):.4f})  {kk:8.3f}  {d['mp']:6.4f}   {a / r:7.4f}    "
                  f"{d['variants']['Ap']['pair_max_nc']:.3e} {d['variants']['Ap']['pair_max_nc'] * d['Z'] ** l:6.3f}  {d['variants']['Ap']['gersh_tr']:7.3f}")
        if len(rr) >= 3:
            lz = [math.log(d["Z"]) for d in rr]
            eA, sA, _ = wfit(lz, [math.log(key(d, "Ap")) for d in rr], [sek(d, "Ap") / key(d, "Ap") for d in rr])
            eR, sR, _ = wfit(lz, [math.log(key(d, "R")) for d in rr], [sek(d, "R") / key(d, "R") for d in rr])
            eX, sX, _ = wfit(lz, [math.log(key(d, "Ap") / key(d, "R")) for d in rr],
                             [math.hypot(sek(d, "Ap") / key(d, "Ap"), sek(d, "R") / key(d, "R")) for d in rr])
            eM, _, _ = wfit(lz, [math.log(d["mp"]) for d in rr])
            eP, sP, _ = wfit(lz, [math.log(d["variants"]["Ap"]["pair_max_nc"]) for d in rr])
            eG, sG, _ = wfit(lz, [math.log(d["variants"]["Ap"]["gersh_tr"]) for d in rr])
            kl = rr[0]["M"] + l - 1
            print(f"    exponent of SDP/tr in Z: Ap {eA:+.4f} +- {sA:.4f}; random control {eR:+.4f} +- {sR:.4f}; independent-vector value MP {eM:+.4f}; Ap/random {eX:+.4f} +- {sX:.4f}")
            kd = [d for d in rr if "K" in d["variants"]]
            if len(kd) >= 3:
                eK, sK, _ = wfit([math.log(d["Z"]) for d in kd], [math.log(key(d, "K")) for d in kd])
                print(f"    positive control (pole row K): exponent {eK:+.4f} +- {sK:.4f} (the functional detects growth when present)")
            print(f"    PAIR(l): pair maximum ~ Z^({eP:+.4f} +- {sP:.4f}); PAIR(l) asks for exponent <= {-l:.4f}: " +
                  ("consistent" if eP + 2 * sP <= -l else ("violated at these scales" if eP - 2 * sP > -l else "undecided")) +
                  f"; Gershgorin sum/tr ~ Z^({eG:+.4f} +- {sG:.4f})")
            print(f"    VERDICT (l = {l:.4f}): " + verdict(eX / kl, sX / kl) + "  [fraction = exponent of Ap/random divided by M + l - 1]")
        else:
            print("    fit: needs at least 3 sizes")
else:
    print("    no finished size yet")
print("-" * 110)
# ------------------------------------------------------------------------------------------------ E2
r2 = load("e2"); st, last = unit_state(U.get("E2"))
print(f"E2  K-loss over F_q[T], exact Gram in Z[omega] (rows deg n, cofactors deg b, marks deg a)      unit {U.get('E2')}: {st}")
print(f"    current: {last}")
if r2:
    def val(d, v):
        x = d["variants"].get(v)
        if x is None:
            return float("nan")
        return x["sdp_tr"] if x.get("sdp_tr") else x["nlam_tr"]
    def rnd(d):
        xs = [val(d, v) for v in d["variants"] if v.startswith("R")]
        return (float(np.mean(xs)), float(np.std(xs, ddof=1)) if len(xs) > 1 else 0.02 * float(np.mean(xs)))
    r2s = sorted(r2, key=lambda d: (d["q"], d["a"], d["b"], d["n"]))
    print(f"  sizes done: {len(r2s)}")
    print("     q  a  b  n     marks      rows   Kfac=q^(n+a-b)   A (exact)   A sqfree rows   Ap (ang. factor)   K (pole)   random mean (sd)    MP     A/rnd   Ap/rnd")
    for d in r2s:
        rm, rs = rnd(d)
        print(f"   {d['q']:3d} {d['a']:2d} {d['b']:2d} {d['n']:2d} {d['N']:9d} {d['R']:9d} {d['kfac']:14.0f}   {val(d, 'A'):9.4f}   {val(d, 'Asf'):9.4f}       {val(d, 'Ap'):9.4f}      "
              f"{val(d, 'K'):9.3f}   {rm:7.4f} ({rs:.4f})  {d['mp']:6.3f}  {val(d, 'A') / rm:7.3f}  {val(d, 'Ap') / rm:7.3f}")
    def pooled(sel, v, label):
        dd = [d for d in r2s if sel(d) and d["kfac"] > 1 and d["N"] > 1 and np.isfinite(val(d, v))]
        if len(dd) < 3:
            print(f"    {label}: needs at least 3 sizes"); return None
        x = [math.log(d["kfac"]) for d in dd]; y = [math.log(val(d, v) / rnd(d)[0]) for d in dd]
        e, s, _ = wfit(x, y, [max(rnd(d)[1] / rnd(d)[0], 0.01) for d in dd])
        print(f"    {label}: {v}/random ~ Kfac^({e:+.4f} +- {s:.4f}) over {len(dd)} sizes; max ratio {math.exp(max(y)):.3f}")
        return e, s
    print("  retained fraction of the K-loss exponent = exponent of (value / random control) in Kfac = Z^(M+l-1):")
    out = {}
    for v, nm in (("Ap", "manuscript-type row with the factor at infinity"), ("A", "row without the factor at infinity"), ("Asf", "A, squarefree rows only")):
        out[v] = pooled(lambda d: d["n"] == d["b"], v, f"n = b, all (q, a, b); {nm}")
        pooled(lambda d: d["n"] == d["b"] and d["b"] >= 2 * d["a"] + 1, v, f"n = b >= 2a + 1; {nm}")
    for q in sorted({d["q"] for d in r2s}):
        pooled(lambda d, q=q: d["q"] == q and d["n"] == d["b"], "Ap", f"q = {q}, degree aspect, Ap")
    for v in ("Ap", "A"):
        if out[v]:
            print(f"    VERDICT ({v}, n = b, all sizes pooled): " + verdict(*out[v]))
    print("    note: exact single-degree sums; the table, not the pooled exponent, is the result when the pattern depends on (a, b, n) residues")
else:
    print("    no finished size yet")
print("-" * 110)
# ------------------------------------------------------------------------------------------------ E3
r3 = load("e3"); st, last = unit_state(U.get("E3"))
print(f"E3  TRO6-natural, non-polar remainder at R = Q^1.4: true theta rows against shuffled rows      unit {U.get('E3')}: {st}")
print(f"    current: {last}")
if r3:
    byk = {}
    for d in r3:
        byk.setdefault(d["k"], {})[d["pass"]] = d                         # last line per (pass, k)
    ks = sorted(byk)
    npass = max(len(v) for v in byk.values())
    print(f"  path points done: {len(ks)} (Q = {byk[ks[0]][min(byk[ks[0]])]['Q']:.0f} .. {byk[ks[-1]][min(byk[ks[-1]])]['Q']:.0f}); passes with data: {npass}; "
          f"shuffled-row controls per point: up to {sum(d['K'] for d in byk[ks[0]].values())}")
    PV, ST = 1, 2                                                         # polar variant 'band', stratum 'all'
    def series(name, comb=None):
        tq, cq = [], []
        for k in ks:
            ds = list(byk[k].values())
            g = lambda d, v: (max(d["r_f1_max"][v][PV][ST], d["r_f2_max"][v][PV][ST]) if name == "sup" else
                              (math.sqrt(max(d["t_f1_max"][v][PV][ST], d["t_f2_max"][v][PV][ST])) if name == "tsup" else d[name][v][PV][ST]))
            tv = [g(d, 0) for d in ds]
            cv = [g(d, v) for d in ds for v in range(1, d["K"] + 1)]
            tq.append(float(np.mean(tv))); cq.append(np.array(cv))
        return np.array(tq), cq
    Q = np.array([list(byk[k].values())[0]["Q"] for k in ks])
    for name, label in (("sup", "r_sup = sup over F1 and F2 of |form| / Cauchy-Schwarz (polar part projected out, all rows)"),
                        ("tsup", "sqrt(t_sup): the same supremum normalised by each row vector's own conductor-side energy (removes the polar-energy offset)"),
                        ("r_opt", "r_opt = same after maximisation over multiplicative targets with free phases at small primes"),
                        ("r_f1_mean", "r_rms over F1 (row-blind by the referee's E1; sanity line)")):
        tq, cq = series(name)
        print(f"  {label}")
        print("        Q      true      shuffled mean    sd      n    true/shuffled    z")
        for i, k in enumerate(ks):
            m, s = cq[i].mean(), cq[i].std(ddof=1) if len(cq[i]) > 1 else float("nan")
            print(f"   {Q[i]:7.0f}  {tq[i]:.6f}   {m:.6f}   {s:.6f}  {len(cq[i]):4d}     {tq[i] / m:6.3f}     {(tq[i] - m) / s if s and s > 0 else float('nan'):+6.2f}")
        if len(ks) >= 3:
            lq = np.log(Q)
            nc = min(len(c) for c in cq)
            sl = np.array([-np.polyfit(lq, np.log([c[j] for c in cq]), 1)[0] for j in range(nc)])
            dT = -np.polyfit(lq, np.log(tq), 1)[0]
            sd = sl.std(ddof=1) if nc > 1 else float("nan")
            print(f"    decay exponent delta in r ~ Q^-delta: true {dT:.4f}; shuffled {sl.mean():.4f} (sd of one shuffle {sd:.4f}, n = {nc}); "
                  f"difference {dT - sl.mean():+.4f} +- {sd:.4f}; nominal eta = 80 delta = {80 * dT:.1f} (eta = 1 is delta = 0.0125)")
            if name == "sup":
                E = tq[-1] ** 2 - (cq[-1] ** 2).mean(); sE = (cq[-1] ** 2).std(ddof=1) if len(cq[-1]) > 1 else float("nan")
                a95 = math.sqrt(max(E, 0) + 2 * sE) if np.isfinite(sE) else float("nan")
                amin = math.sqrt(32.6 * sE) if np.isfinite(sE) else float("nan")
                zz = [(tq[i] - cq[i].mean()) / cq[i].std(ddof=1) for i in range(len(ks))] if nc > 1 else [float("nan")]
                print(f"    row-specific coherent component at Q = {Q[-1]:.0f}: a <= {a95:.5f} of Cauchy-Schwarz (95%); TRO6-natural threshold Q^(-eta/80) at eta = 1: {Q[-1] ** (-1 / 80):.3f}")
                print(f"    separation of eta = 0 from eta > 0 needs a component whose slope is resolved to 0.006 over a factor 32 in Q: a >= {amin:.5f} at Q = {Q[-1]:.0f} "
                      f"(a_min ~ Q^-1/2); a component of size 0.01 needs Q >= {Q[-1] * (amin / 0.01) ** 2:.2e}, size 0.001 needs Q >= {Q[-1] * (amin / 0.001) ** 2:.2e}")
                mz = float(np.nanmax(np.abs(zz)))
                print("    VERDICT: " + (f"true rows indistinguishable from shuffled rows (max |z| = {mz:.2f}); remainder at the control level: SUPPORTS TRO6-natural on the tested "
                                         f"families with margin {Q[-1] ** (-1 / 80) / tq[-1]:.0f}x at eta = 1; eta = 0 with a constant below {a95:.5f} is NOT excluded"
                                         if mz < 3 else f"true rows DIFFER from shuffled rows (max |z| = {mz:.2f}): row-specific structure present; see the table (excess that does not decay would KILL)"))
    d0 = byk[ks[-1]][min(byk[ks[-1]])]
    if d0.get("valid_maxdiff") is not None:
        print(f"    validation: recomputed twisted sums of the true rows against the stored r2 values: max difference {d0['valid_maxdiff']:.2e}")
    print(f"    polar share of the conductor-side energy (true rows, all): " + " ".join(f"{list(byk[k].values())[0]['polar_share'][0][2]:.3f}" for k in ks) +
          f"; shuffled rows (projection baseline): " + " ".join(f"{np.mean([list(byk[k].values())[0]['polar_share'][v][2] for v in range(1, list(byk[k].values())[0]['K'] + 1)]):.4f}" for k in ks))
else:
    print("    no finished point yet")
print("=" * 110)
