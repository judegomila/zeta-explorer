#!/usr/bin/env python3
"""Round 12 learn step. Idempotent. Lines self-registered by lanes (lanes.jsonl or push/<slug>/lanes_line.json) are
replaced in place by the refereed record (lane metadata kept); writes engine/outcomes/<slug>.json and the
engine/outcomes.json entries. Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round12_records.json")))
NR = "not run: "
META = {
 "c12-bost-connes-crossed-product-duality": dict(kind="explore", engv="closed", title="Bost-Connes crossed product C*(Q/Z) x N^x with Fourier duality",
  obstruction="Stage A, for three classes of states (sigma-invariant, type I dual extension, archimedean vector Mellin families). Sigma-invariant states factor through commutative C(Z^); vector states with Poisson summation read {L(s,chi)} and the inequality is a square; positive-definiteness of zeta(sigma+it)MF holds for sigma > 1 and fails on 0 < sigma < 1 (zeta(sigma) < 0); Weil's prime side is phi_{1/2}(H_g), a rewriting. T-NR is Tr(D e^{-beta H}) with D >= 1 a positive element of C*(Q/Z) and passes every step. Not covered: other states (e.g. weights on the type II_infinity dual at beta <= 1); no candidate inequality on file there.",
  defeat=["T-NR (positive density D >= 1 inside the algebra; differs only in exact mu_q covariance at one prime)", "E_a (passes every step on A (x) A)", "DEL with finite S (passes every step in A)", "DH fails only at the sign of its density, not at the mu_n step"]),
 "c12-depth-aspect-height-transfer": dict(kind="explore", engv="closed", title="Depth-aspect (characters mod p^k) transfer of height by termwise exchange",
  obstruction="Exchange step (E). Lemma X: for an r-datum with s terms, H = p^ceil(k/r), |t| >= t_r and N >= H((kappa |t|/1.12)^(1/r) + A), every character mod p^k and unimodular c has max_{n<=N,(n,p)=1} |chi(n) - c n^(-it)| >= 0.479/s. So no termwise exchange for N >= about (q|t|)^(1/r). In the 7/8 format the depth characters are already targets and as rows give Parseval; there is no height slot. Not established: |t| < t_r, the range between log q and q^delta, transfers not through termwise agreement.",
  defeat=["zeta and every control fail step (E) identically (no separation)", "U (unimodular twist) is what the lemma separates from periodic characters; an obstruction for the device"]),
 "c12-univ-pointwise-control-wcone": dict(kind="explore", engv="closed", title="Control UNIV (joint universality) and the W-adapted cone cell",
  obstruction="(a) Relative to joint/hybrid universality (Matsumoto survey statements): a sup-norm-closed height-independent condition on a fixed window in 1/2 < Re s < 1 for finitely many Dirichlet L-functions that holds off a density-zero set of heights contains every non-vanishing analytic tuple; so such a condition is empty, a zero statement in the same window, or false on positive density. Narrow filter (27 of 34 devices out of scope), not numerically checkable. (b) Cone K_F = {v >= 0, Fv >= 0}: linear functionals are entrywise at x and 1/x; at q = 5 the F-fixed extreme rays give zeta(s)(1 + 5^(1/2-s)) +- L(s,chi_5) with off-line zeros. Candidate (CW) closed; other F-adapted cones not covered.",
  defeat=["T-NR lift (has every input of candidate (CW); zeros in the strip for 2 < c < 2.1213 at p_0 = 2)", "extreme-ray combination zeta(s)(1+5^(1/2-s)) +- L(s,chi_5) (off-line zeros, measured)", "universality itself for pointwise open-strip inequalities", "E_a lift fails only the input 'theta-normalised kernel with polar terms non-negative' (not consumed by any cone inequality)"]),
 "c12-x04-oval-hecke-fricke-loading": dict(kind="combine", engv="closed", title="Hecke/Fricke loading on the real oval of X_0(4)",
  obstruction="Decisive test. On theta restricted to the arc, the summed complex isogenous points of T_{p^2} are dilates of theta; Mellin multiplier C_p = 1 + 1/p - R_p, R_p = 2p^(-3/2)cosh((s-1/2)log p); the relation is the identity c(pm) = c(m). C_p*Lambda is -p^(-3/2) times a T-NR twin. <D_l, W> acts on a W-fixed vector through Dirichlet polynomials; M_{1/2}(Gamma_0(4)) is one-dimensional. Termwise bounds on complex points lose (p-1)p^(-1/2). Second moment over tau+b/p is map row G16. Closed for the four listed forms; not excluded: a functional of unsummed complex points that is neither linear nor a second moment.",
  defeat=["T-NR (passes every step; the complex-point term is itself a T-NR twin)", "E_a (passes every step)", "Epstein n = 5, 6 and DH fail only at the multiplicativity identity", "twists fail at the Fricke step", NR+"Beurling, transfer operator, theta^w"]),
 "c12-heat-tied-family-open-cell": dict(kind="combine", engv="closed", title="de Branges shift positivity: backward heat at (N2) and tied conductor family V3b",
  obstruction="Cell 1: q_1 < 0 at on-line zeros for each of six tau < 0 tested (11 to 25 below height 500); forward heat tau >= 0.5 passes (N2) below 500 at h = 1; (N2) fails for zeta, so the condition is on the wrong side of the flow. Cell 2: for the tied weight the outer function drops out on the boundary; Lemma S (no zeros/poles of the weight in 1/2 < Re s < 3/2) and Lemma T (Re m >= 0 on Re s = 1/2) are both violated for q = 5, 7, 13 (zeros with winding 1; certified negative values). T-NR fails the same boundary step. S_v > 0 up to T_0(q) for the full odd family is a mean-value statement over characters.",
  defeat=["the condition is false for zeta itself (zeta alone at 13.54)", "forward heat passes (N2), backward heat fails with zeta: wrong side of the flow", "lattice control is flow-invariant with q_h = 1", "T-NR fails the same boundary step at t = 3.24 (no separation)", "MV-CAP for the conductor-aspect side observation"]),
 "c12-control-battery-harness": dict(kind="compute", engv="partial", title="Control battery: one harness of stage-A controls replaying five closed devices",
  obstruction="Meta-harness. Verdicts reproduced 5 of 5; registered D1 numeric checks 19 of 20, so the registered threshold is not met as written. The mismatch is a defect of the record (c11-rs3 DH ordinates unconverged from heights of order 100; 7 of 24 recorded min q values differ; fail counts unchanged). D4 and the D5 identity are algebraic and cannot fail. HEAT tau = -0.5 off-line list incomplete between 500 and 2000.",
  defeat=["not applicable (meta-harness)"]),
 "c12-frontier-xu-sang-structured-moment": dict(kind="deepen", engv="closed", title="Part B: Xu-Sang 2610.17675 Theorem 1.2 against slots Z11, M1, M2",
  obstruction="Part B, relative to unrefereed manuscripts. The structured prime second moment Q^2.084184 sits at prime length z = 1; M1 needs z < 3/8 at r = 0, M2 z < 3/13, no witness factor. As a Chebyshev count at Z11 it is never selected: N - delta - R0(delta) = 6(delta - delta*)^2/(15 - 6 delta) >= 0 and R(delta,x) <= R(delta,0); at the critical class 0.614839 against 0.590332 (would need below Q^2.059677). Abscissa stays 0.8748866470. Not searched: Z10 and the preliminary stage.",
  defeat=["not a control question (part B figure); the substitution is blind to every target-side control"]),
 "c12-repair-sources-statement-o-v3": dict(kind="repair", engv="partial", title="Record repair: five primary sources opened, second referee on round-11 control tables, Statement O v3",
  obstruction="Record lane, no attack. DEL is relative to S(theta) (Huxley 1972 gives a gap bound and density estimate; Ingham's short-interval deduction not opened). Bettin 2016: exact reciprocity for |L(s,chi)|^2 only on the real axis; at height t != 0 only for the bilinear pair. Round-11 control tables hold with corrections R-1..R-3, T-1..T-3, B-1. Map 182 -> 186 rows.",
  defeat=["not applicable (repair lane)"]),
}
TAGS = {'c12-depth-aspect-height-transfer': (['p-adic', 'periodicity', 'unimodular-twist', 'conductor-aspect', 'depth-aspect', 'height-transfer', 'stage-a', 'R4'], 1), 'c12-univ-pointwise-control-wcone': (['universality', 'control', 'cone', 'rs-1', 't-nr', 'e-a-control', 'stage-a'], 1), 'c12-x04-oval-hecke-fricke-loading': (['klein', 'hecke', 'theta', 'hecke-operators', 'modular-surface', 'fricke', 't-nr', 'e-a-control'], 1), 'c12-heat-tied-family-open-cell': (['de-branges', 'heat-flow', 'rs-3', 'conductor-aspect', 't-nr', 'control'], 2), 'c12-control-battery-harness': (['control', 'seeded-controls', 'meta-harness', 'de-branges', 'stage-a'], 0)}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
old = [json.loads(l) for l in open(lp) if l.strip()]
bys = {d["slug"]: i for i, d in enumerate(old)}
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
for r in recs:
    m = META[r["slug"]]; holds = bool(r["refHolds"])
    sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
    if r["slug"] in bys: prev = old[bys[r["slug"]]]
    else:
        ll = os.path.join(ROOT, "push", r["slug"], "lanes_line.json")
        try: prev = json.load(open(ll))
        except Exception: prev = {}
        prev.pop("resultFile", None)
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=1)
    L["heavy"] = r["slug"] == "c12-control-battery-harness"
    for k, dv in (("restatement", False), ("knownArchitecture", False), ("lemmasDecided", 0), ("nodes", []), ("tags", []), ("obstructionKind", "")):
        if L.get(k) is None: L[k] = dv
    if r["slug"] in TAGS:
        if not L.get("tags"): L["tags"] = TAGS[r["slug"]][0]
        if not L.get("lemmasDecided"): L["lemmasDecided"] = TAGS[r["slug"]][1]
    L["brokenProved"] = 0   # referees report no PROVED step broken in round 12
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    out = {"slug": r["slug"], "round": 12, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
           "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": L.get("obstructionKind", ""),
           "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
           "refereeHolds": holds, "referees": 1, "aboutZeros": bool(r["aboutZeros"]),
           "refereeNote": r["errors"] + " - [truncated in the learn-step input; full text in REFEREE.md]",
           "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"],
           "refereeFile": os.path.join(os.path.dirname(r["file"]), "REFEREE.md"),
           "launchedNodes": [n for n in nodes if not n.startswith("out-")], "engineVerdict": m["engv"]}
    json.dump(out, open(os.path.join(OD, r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
    e = by.get(r["slug"])
    if e is None:
        e = {"slug": r["slug"], "path": "push/" + r["slug"]}; eng.append(e); by[r["slug"]] = e
    e.update(nodes=nodes, launchedNodes=out["launchedNodes"], tags=tags, title=m["title"], refereeHolds=holds,
             aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"], verdict=m["engv"])
    e["note"] = "round 12, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng))
