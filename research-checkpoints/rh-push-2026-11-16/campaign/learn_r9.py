#!/usr/bin/env python3
"""Round 9 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent.
Also reconciles two round-8 records as requested by c9-repair-referee-debts-r8 (Hecke outcome; (E-K) signature wording).
Device states in engine/curated/mk_devices.py are NOT edited here (see ROUND_LOG, round 9 lessons, process)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round9_records.json")))
NR = "not run: "
META = {
 "c9-mv6-window-statement": dict(kind="combine", heavy=False, broken=0, lemmas=1, engv="partial",
   nodes=["ek-vector-specific-row-mean-square", "out-c9-mv6-window-statement"],
   okind="window-frequency-form-dominated-by-own-diagonal-absolute-value-methods-stop-at-n-1-plus-eps",
   tags=["seven-eighths","effective-order","sextic-theta","mean-square","poisson","moebius","twist-family","window","prime-marks","cross-term","grh-conditional"],
   title="(MV6-W): the (E-K) window statement Z/P < X < ZP as one displayed statement",
   obstruction="For K = N^2/X > N (more dual frequencies than columns) the absolute 1/L frequency form N_K = K D# + K Off_K has its own diagonal of size (N/X) D (identity; measured 0.99-1.00 for the Moebius vector), so the window statement is a cancellation of relative size X/N. Family GRH taken pointwise and the Theorem A second moment with L in the numerator both return N^(1+eps), above the X D needed for X < N. ARGUED + MEASURED, not a theorem: sign-keeping or row-side methods are not excluded. What remains is a signed cross term over pairs of distinct slot primes ((CROSS), unproved, conditional outline in the upper half-window).",
   defeat=["aligned vector (+7 to +40%) and Liouville-twisted vector (+2 to +22% from Z = 4000): excess sits in the cross term, as required of controls; the target shows none (float screen, no proof)","random phases (not separated from the theta vector below Z = 4000)", NR+"DH, heat, THIN, U, E_a, T-NR, Beurling"]),
 "c9-mv6-ff-window-exact": dict(kind="compute", heavy=True, broken=0, lemmas=1, engv="partial",
   nodes=["ek-vector-specific-row-mean-square", "ff-order2-vertex-probe", "out-c9-mv6-ff-window-exact"],
   okind="window-statement-fails-in-model-for-weil-targets-above-dual-length-3n",
   tags=["seven-eighths","effective-order","function-field","exact-arithmetic","prime-marks","mean-square","window","completed-rows","cube-part","pre-registered"],
   title="(MV6) window statement in F_q[T], exact, pre-registered",
   obstruction="F_q[T], q = 7, 13, N = 2 (completed = squarefree rows, Lemma P), window N - lam < d < N + lam, dual length above 3N: the row energy of the probe vector of a quadratic Weil target is 1.19 to 20.6 times the diagonal (q = 7, nine active configurations) and 2.17 to 18.1 (q = 13, three), rising in steps; the pre-registered rule (excess exponent <= 0) returns FAILS. So the diagonal-level (E-K) bound is false in the model in the window, for targets that satisfy the model RH. Limits: N = 2 only; N = 3 cube-term observation on 4 configurations, rule UNDECIDED; reflected dual sums not run; no extrapolation in N or to weighted / excluded-set versions.",
   defeat=["not a control separation: the Weil targets themselves exceed the diagonal in active classes","controls behave as required (Liouville-twisted up to 951 and 2452 times; aligned at operator-norm size; random phases at the diagonal, 30 of 30)", NR+"DH-type model weight, THIN, heat, U, E_a, T-NR, Beurling"]),
 "c9-eh-dual-r5-target-excess": dict(kind="deepen", heavy=False, broken=0, lemmas=1, engv="closed",
   nodes=["eh-nonprincipal-row-cancellation"],
   okind="nonprincipal-row-sum-is-linear-functional-with-target-independent-kernel-no-target-excess",
   tags=["seven-eighths","effective-order","poisson","function-field","exact-arithmetic","control","pre-registered","seeded-controls","linear-functional"],
   title="(E-H): target excess of the non-principal row cancellation at r = 5",
   obstruction="F_q[T], q = 7, (k, N') = (6, 6), r = 3, 4, 5 (and (5, 5), r = 3, 4 by the referee): NP is a linear functional of the weight with a target-independent kernel (proved), so cancellation over non-principal rows is of norm type. The pre-registered target excess over random multiplicative and random non-multiplicative signs is not detected at any size, including against 24 seeds per class at r = 5 (resolution 0.05-0.07 in the exponent). Second same-kind obstruction after c8-eh-nonprincipal-row-cancellation. MEASURED and pre-asymptotic: an excess below about 0.05, or setting in at r >= 6, is not excluded. The number-field sub-step of Lemma A (first moment of the sextic row family) is open.",
   defeat=["random multiplicative signs and random non-multiplicative signs (same cancellation exponent as the targets; the two classes have exactly the same second moment of NP)","aligned vector W = mu (exponent 0.06-0.08: the test detects absence of cancellation)", NR+"heat, U, E_a, T-NR, Beurling"]),
 "c9-normaliser-cap-avoidance": dict(kind="deepen", heavy=False, broken=0, lemmas=1, engv="partial",
   nodes=["out-c7-uncompensated-high-side-normaliser", "out-c9-normaliser-cap-avoidance"],
   okind="normaliser-resonance-ladder-stops-in-window-four-sevenths-to-three-fifths-format-hypotheses-have-no-source",
   tags=["seven-eighths","normaliser","format-ceiling","ladder","common-zero","infinite-order-character","hecke-character","target-blind"],
   title="Normaliser ceiling 2/3 of the 7/8 format: ladder over levels alpha^f chi",
   obstruction="Hypothesis (2.2) fails only by exact resonance ord_rho H >= ord_rho L at a zero (Lemma U1). A ladder over levels f -> 6f + 6 gives beta(0) <= max(sigma_0, 3/5 + (2/5) 6^-k), relative to Lemma H and to the format hypotheses (F_j) on infinite-order targets alpha^f chi, which have no source for j >= 1 (and none below 7/8 for j = 0). With all levels the supremum is <= sigma_0 or in [4/7, 3/5], the fixed points of 6s - 3 and 4 - 6s; inside that window the needed input is a common-zero exclusion, not reachable by counting. The step is target-blind (Liouville, sign twists, THIN have the same normaliser zeros). Without the format for infinite-order targets the ceiling stays 2/3.",
   defeat=["Liouville, sign twists, THIN (same normaliser zeros: the step separates no control)","typical unimodular twists (zero-free normaliser to 7/12)", NR+"DH, heat, E_a, T-NR, Beurling"]),
 "c9-szego-sum-rule-prime-cascade": dict(kind="explore", heavy=False, broken=0, lemmas=1, engv="closed",
   nodes=[],
   okind="sum-rule-coefficient-side-vanishes-or-returns-density-thin-satisfies-difference-condition",
   tags=["szego","killip-simon","simon-zlatos","sum-rule","prime-cascade","littlewood-lemma","lieb-thirring","thin","unimodular-twist","device"],
   title="Positive-term sum rules (Szego, Killip-Simon, Simon-Zlatos) on the prime stub chain",
   obstruction="Five forms: (i) window form = Littlewood's lemma, coefficient side 0 at every stage for every unimodular chain; the bound-state term is a tail invariant bounded from below only; (ii) mean form E + 4 pi delta = log zeta(2 sigma) is the classical density identity; (iii) at fixed stage no continuous functional of the phases separates zeta from U over window positions (Kronecker-Weyl, row Q21); (iv) the Simon-Zlatos difference condition holds for zeta on Re s > 0 and for THIN on Re s > b/2 with THIN's zero at b right of the line; (v) the H^2 point-evaluation step reaches only Re s > sigma_0 + 1/2 > 1. Not a theorem about all sum rules: a rule with identically vanishing coefficient side and a semicontinuous limit step is not covered, and that limit step is the target.",
   defeat=["U (same range and distribution of every stage functional over windows; KS p 0.11 to 0.93)","THIN (satisfies the difference condition on Re s > b/2 with a zero at b)","Liouville (identical differences to zeta)","DH and heat fail only at chain formation (the Littlewood identity reads the DH off-line zero)", NR+"E_a, Beurling, phase-rotated transfer operator, theta^w"]),
 "c9-obstruction-record-statement": dict(kind="combine", heavy=False, broken=0, lemmas=0, engv="partial",
   nodes=[], okind="record",
   tags=["record","obstruction-map","control","referee","statement-o"],
   title="Statement O: written record of obstructions, lines 1 to 12",
   obstruction="Record lane, no attack. No line of Statement O is PROVED under the two-referee rule (ARGUED 9, MEASURED 3). Section C stands only as 13 separate conditional statements (a device whose whole read set lies in class j is defeated by control j), not as a joint necessity clause. Binding debts: sources not on file (Beurling construction, ray-class short-interval theorem, hypothesis H_W); no single two-referee statement for MV-CAP or for finite Pick orders. The Liouville twist is not a zero-mode control (zeros in Re s < 1/2).",
   defeat=["not applicable (record lane); referee addition, ARGUED: thin prime deletion gives a positivity-keeping Beurling-type control with a zero at any real b in (1/2, 1), relative to the THIN short-interval input"]),
 "c9-repair-referee-debts-r8": dict(kind="repair", heavy=False, broken=1, lemmas=1, engv="partial",
   nodes=[], okind="filter-repair",
   tags=["control","filter","referee","hilbert-schmidt","manuscript-check","eis-w","signature"],
   title="Referee debts of round 8",
   obstruction="Repair lane, no attack. Decided: the (E-K) sixth-power class kernel is 6 times a sum of six rank-one squares (positive semidefinite, rank 6); 'signature (2,2)' was wrong. Hecke lane Lemma 3 with the pair count is false high in the cusp; device closed on the corrected statement with control EIS-w. Still open: non-monomial Lemma 2 (sub-step S1), THIN primary source (Coleman 1990, not openable), journal text of Blomer-Goldmakher-Louvel, outline debts 10, 2, 4.",
   defeat=["not applicable (repair lane)"]),
 "c9-tro6-interstratum-cancellation": dict(kind="deepen", heavy=False, broken=0, lemmas=1, engv="partial",
   nodes=["map-open-4", "out-c9-tro6-interstratum-cancellation"],
   okind="squarefull-stratification-is-inclusion-exclusion-over-sublattice-sums-no-saving",
   tags=["tro6","sextic-theta","signed-c-sum","stratification","squarefull","inclusion-exclusion","sublattice","pre-registered","frontier-number"],
   title="TRO6: cancellation between squarefull strata of the signed c-sum",
   obstruction="Lemma I (proved): each squarefull stratum is a signed sum, signs mu(d) mu(e), of sublattice sums Phi(j). Proposition E (proved, one direction): a power saving between strata requires some squarefull j != 1 with N(j)^(1/2+eps) |Phi(j)| >= c Q^delta |Phi(1)|. Measured at X = 1e6, 1e7: exponent of |B| / root sum of squares is -0.005 / +0.001 against the pre-registered -0.02, equal to every control within null scatter 0.003. Lead 17 is closed for squarefull stratification only (second same-kind obstruction after e2-tro6-signed-csum-stratified). Open as stand-alone routes: dual form on squarefree n; Type I on average over the level. The estimator is mostly non-polar remainder and samples no single target.",
   defeat=["random-phase, conjugated, Liouville, THIN, random multiplicative and cubic-theta rows (same exponents within null scatter)", NR+"DH, heat, U, E_a, T-NR, Beurling"]),
}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
lines = [l for l in open(lp) if l.strip()]
have = set()
fixed = []
for l in lines:
    d = json.loads(l); have.add(d["slug"])
    if d["slug"] == "c8-ek-theta-second-moment-formula" and "correction" not in d:
        d["correction"] = "round 9 (c9-repair-referee-debts-r8, referee holds): the sixth-power class kernel is 6 times a sum of six rank-one squares on the 108 classes mod 36 (positive semidefinite, rank 6, leading order only); any 'signature (2,2)' or 'indefinite' wording for the excess form is wrong (that is the signature of R alone)."
        l = json.dumps(d, ensure_ascii=False) + "\n"
    if d["slug"] == "c8-hecke-entropy-resonance-rigidity" and "correction" not in d:
        d["correction"] = "round 9 (c9-repair-referee-debts-r8): second referee holds the corrected statement (Lemma G2 (i) withdrawn, Lemma 3 corrected, Lemma 5 factor e^(-(2 sigma - 1) s)); device closed with control EIS-w. The round-8 flags of this line are left as recorded."
        l = json.dumps(d, ensure_ascii=False) + "\n"
    fixed.append(l)
tmp = lp + ".tmp"; open(tmp, "w").writelines(fixed); os.replace(tmp, lp)
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
with open(lp, "a") as f:
    for r in recs:
        m = META[r["slug"]]; holds = bool(r["refHolds"])
        sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
        rf = os.path.join(os.path.dirname(r["file"]), "REFEREE.md")
        if r["slug"] not in have:
            L = dict(r); L.update(kind=m["kind"], heavy=m["heavy"], refereeHolds=holds, referees=1, restatement=False,
                                  knownArchitecture=False, brokenProved=m["broken"], lemmasDecided=m["lemmas"],
                                  obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 9, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
               "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": m["okind"],
               "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
               "refereeHolds": holds, "referees": 1, "aboutZeros": bool(r["aboutZeros"]), "refereeNote": r["errors"],
               "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"], "refereeFile": rf,
               "launchedNodes": [n for n in m["nodes"] if not n.startswith("out-")], "engineVerdict": m["engv"]}
        json.dump(out, open(os.path.join(OD, r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
        e = by.get(r["slug"])
        if e is None:
            e = {"slug": r["slug"], "tags": m["tags"], "title": m["title"], "path": "push/" + r["slug"]}
            eng.append(e); by[r["slug"]] = e
        e.update(nodes=m["nodes"], launchedNodes=out["launchedNodes"], tags=m["tags"], title=m["title"], refereeHolds=holds,
                 aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"], verdict=m["engv"])
        e["note"] = "round 9, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
# reconciliation requested by c9-repair-referee-debts-r8
hp = os.path.join(OD, "c8-hecke-entropy-resonance-rigidity.json"); h = json.load(open(hp))
h.update(refereeHolds=True, referees=2, engineVerdict="closed",
         refereeFile2=os.path.join(ROOT, "push", "c9-repair-referee-debts-r8", "RESULT.md"),
         reconciliation="round 9: first referee did not hold the record as written (Lemma G2 (i) vacuous). The second referee (lane c9-repair-referee-debts-r8, itself refereed) holds the corrected statement: Lemma G2 (i) withdrawn (weight-0 object is zero for odd characters; DH not run), Lemma 3 corrected (the pair-count version is false high in the cusp), Lemma 5 with factor e^(-(2 sigma - 1) s). The device is closed on the corrected statement; control EIS-w passes every step. refereeHolds refers to the corrected statement.")
json.dump(h, open(hp, "w"), indent=1, ensure_ascii=False)
if "c8-hecke-entropy-resonance-rigidity" in by:
    by["c8-hecke-entropy-resonance-rigidity"].update(refereeHolds=True, verdict="closed")
kp = os.path.join(OD, "c8-ek-theta-second-moment-formula.json"); k = json.load(open(kp))
k["correction"] = "round 9 (c9-repair-referee-debts-r8, referee holds): the sixth-power class kernel is 6 times a sum of six rank-one squares on the 108 classes mod 36: positive semidefinite of rank 6 at leading order. 'Signature (2,2)' in the follow-up text is wrong (it is the signature of R alone). Lemma 1 holds; Theorem 2 is a conditional outline under family GRH."
json.dump(k, open(kp, "w"), indent=1, ensure_ascii=False)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng))
