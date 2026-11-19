#!/usr/bin/env python3
"""Round 6 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round6_records.json")))
META = {
 "c6-probe61-thin-three-weights": dict(kind="compute", tags=["seven-eighths","control","sign-twist","thin","liouville","sextic-theta","periodicity","probe-6.1","pre-asymptotic"], nodes=["out-c4-thin-twist-control-78"], okind="pre-asymptotic-range-one-frequency", restatement=False, lemmas=0,
   title="Probe (6.1) for THIN, Liouville and 1 with both norms of Proposition D, Z = 2^10..2^18",
   obstruction="Measurement only. At X=Y=Z^(1/2) the signal exponent beta-2/3 comes from sixth-power frequencies of norm up to Z^(1/12); the first non-trivial one has norm 7, so at Z <= 2^18 (enumeration cost 84 Z^2) only frequency a=1 contributes and the exponent seen is beta-3/4; beta-2/3 sets in between 2^36 and 2^56 (density model, Liouville only). The pre-registered thresholds are undecided: abs(I_eps) <= 0.007 of the Cauchy-Schwarz value, condition (N) not seen (THIN row-norm exponent equals that of weight 1). The principal-row extraction is linear in the weight and has coefficient 1 for the non-multiplicative control as well; the remainder has the same size RP ~ Z^(-0.24) for THIN and nulls. Which half of Proposition D carries periodicity is not established (low half only conditionally on an unproved remainder bound as Z -> infinity).",
   defeat=["non-multiplicative sign weight (principal-row coefficient 1.001 +- 0.003: the extraction uses no multiplicativity)","THIN b=0.95 (coefficient 1 within 1.5 percent, remainder as for nulls; not separated from Liouville or 1 in range)","not run: DH, heat, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w"]),
 "c6-gl3-cover-epsilon-cocycle": dict(kind="deepen", tags=["seven-eighths","effective-order","metaplectic","double-cover","gl3","epsilon-factor","cocycle","whittaker","gauss-sum"], nodes=["map-open-1"], okind="double-cover-no-weight-zero-cocycle", restatement=False, lemmas=1, broken=1,
   title="Weight-1 epsilon cocycle for genuine forms on the double cover of GL(3)",
   obstruction="Referee does not hold the claim as worded (E1-E5; Lemma 2 labelled PROVED has a false sentence; the numerator shape is shown for l1=0, l2 even only; chi(-1)=-1 not covered; the normalisation convention that turns Lemma 1 into an obstruction is ARGUED). Standing, given the recalled Gelfand-Tsetlin recipe: at an unramified odd place with chi(-1)=+1, in unitary normalisation the quadratic symbol occurs only with q^(-1/2) and every minus sign only with q^(-1), in every rank (Lemma L, rechecked in rank 2 and 3). The exponent group Z/2 has no pair (a, b) with a, b, a+b all nonzero, so no double cover gives mu at shift 0 through local data; twist families of any GL(n) form carry the n-th power of the GL(1) cocycle. Not covered: global Whittaker constants of a genuine cusp form (no explicit example); the Z/4 pivot is closed by map row Z14. No ledger entry with h > 1.",
   defeat=["not a control question: local algebraic statement inside the 7/8 estimate system","not run: all controls"]),
 "c6-unreflected-marks-kd23": dict(kind="deepen", tags=["seven-eighths","effective-order","prime-marks","sextic-theta","large-sieve","hasse-davenport","mean-square","grh-conditional"], nodes=["map-open-1"], okind="row-norm-is-zero-free-statement-for-target", restatement=False, lemmas=1, broken=1,
   title="Unreflected marked theta rows: K + D or (KD)^(2/3)",
   obstruction="Referee does not hold the claim as stated ('no consistent model vertex with h > 1' not shown; necessity statement Lemma D(b) not established; a hypothesis dropped in the no-GRH form). Standing: MEASURED, reduced theta rows (marked or not) show no (KD)^(2/3) term for D <= 1e7, K = D^e, 1 <= e <= 2, while cubic and sextic pole controls grow with exponents 0.340, 0.153; random rows pass the same measurement. PROVED/CHECKED: dual kernel factorisation and gamma_1 gamma_2 = mu alpha times a unimodular factor. ARGUED: row energy = K N + (K/D) times a sum of products of reciprocal Hecke L-sums, so K + D is a zero-free statement for the target family (K + D^(2 theta); 11/12 at K = D), not an independent norm input. Conditional on GRH for the family and c5 Theorem B: the uncompensated branch of the reduced model is not valid for h > 3; vertices with 1 < h <= 3 are underived.",
   defeat=["random rows (same flat mean square: the measurement does not use arithmetic)","cubic and sextic Gauss-sum pole controls (grow as predicted; they confirm the test detects a pole term)","not run: THIN, DH, sign twists"]),
 "c6-marks-bc-manuscript-check": dict(kind="deepen", tags=["seven-eighths","effective-order","prime-marks","normaliser","grh-equivalent","circular","manuscript-check","selberg"], nodes=["map-open-1"], okind="normaliser-zeros-cap-format-at-two-thirds", restatement=False, lemmas=2,
   title="Theorems B and C of the marks lane against the manuscript text; the h = 3 / GRH equivalence",
   obstruction="The reduced exponent system drops the normaliser H_eta = zeta_F^S(2)^-1 L^S(6s-3,(alpha eta)^6) E_eta of Prop. 2.1. H_eta has infinitely many zeros with 7/12 <= Re s < 2/3, so hypothesis (2.2) is false for sigma_0 < 7/12 and the format's unconditional conclusion stops at abscissa 2/3 (h = 2, effective order 3). Relative to an unsourced identity and high side: GRH => low input (N) => (R) [beta* <= 2/3 and top-layer zeros common with L(6s-3,(alpha eta)^6)]; (R) => GRH open. For h > 3 no low exponent below C(1/2) holds. Every h > 1 geometry has lx < l and lies outside all proved low estimates. In that model the long-marks branch gives no input weaker than its conclusion. THIN undecided; Liouville signal fails by Z^(1/2).",
   defeat=["Liouville weight (signal main term c Z^(C(1)), fails by Z^(1/2))","THIN undecided","not run: DH, heat, Beurling"]),
 "c6-pair-probe-bridge-order2": dict(kind="combine", tags=["seven-eighths","effective-order","pair-probe","bridge","krein-square","functional-equation","linear-program","homogeneity"], nodes=["map-open-1","bridge-scattering-factorisation"], okind="estimate-system-degree-one-homogeneous-pair-beta-blind", restatement=False, lemmas=1,
   title="Probe bilinear in the target (bridge pair) in the Prop. 2.1 ledger",
   obstruction="The estimate system is degree-one homogeneous in the target-row length: the pair system equals the single c5 system at (lx/2, ly/2, (l1+l2)/2) (0 mismatches in 36,000 exact comparisons), so with both compensations h_pair <= 1 and the model values 13/15, 31/36, 5/6 are unchanged; with the full source ledger the least value at h_pair >= 1 is 52/57. The functional-equation pair (rho, 1 - conj rho) has product of size Z for every beta, so it carries sign information only and does not compose with the coherent set's size comparison. The shifted product zeta(s) zeta(s-d) is the E_a scaling. Points with h_pair > 1 below a tier value need lx < l1 + l2 (no construction) and at least one deleted input (K alone, or the Gram excess alone). All values are model abscissae on unrefereed inputs.",
   defeat=["E_a (the shifted product is the E_a scaling)","not a control question otherwise: floor statement inside the 7/8 estimate system","not run: DH, sign twists, THIN"]),
 "c6-square-intertwiner-weyl": dict(kind="combine", tags=["hilbert-polya","square-realisation","hecke-operators","weyl-law","casimir","metaplectic","spinor","euler-blind"], nodes=["out-c1-spinor-hecke-primitive","zv-spinor-arithmetic-coupling-missing"], okind="no-fixed-hecke-rule-zero-eigencharacter-is-eisenstein", restatement=False, lemmas=1,
   title="Covariant squares of Q_L with an automorphic intertwiner: Weyl laws and Hecke rules",
   obstruction="A covariant square of Q_L is a Hilbert-Polya space, so sub-selection defeats every counting test. Fixed Hecke rules: no GL_2 cusp form has lambda_p = psi(p^(-it)) for continuous psi, nor P(lambda_p) = p^(-it), deg P <= 4 (Theorem H2; proved as written for trivial nebentypus; one referee); the eigencharacter of a zero is that of E(., 1/2 + i gamma) in the continuous spectrum. Casimir class: Weyl laws R^2 or R^3, never T log T. Compact at infinity: rank one closed; rank >= 2 without a Hecke rule open and carries no R1. Non-L^2 rank-one family: F(gamma_n) not constant, Euler-blind. The free Borel rule exists iff RH. The lead had already been run (res-point-spectrum-square). The no-gos are properties of the automorphic target and hold for all controls alike.",
   defeat=["all controls pass alike: the no-gos concern the automorphic target, not zeta (no R3)","non-L^2 rank-one family is Euler-blind","free Borel rule: restatement of RH"]),
 "c6-quadratic-companion-positivity": dict(kind="explore", tags=["positivity","quadratic-form","rankin-selberg","landau","companions","sato-tate","unimodular-twist","davenport-heilbronn","device"], nodes=["map-open-9"], okind="coefficient-square-twist-blind-landau-stops-at-one", restatement=False, lemmas=1,
   title="Degree-2 positive forms in zeta and companions (device map-open-9)",
   obstruction="Degree-2 positive forms split into three classes. Log-level squares are linear in -L'/L and lie in the P25 cone. Products of two log-level forms are non-negative at n = pq only if both factors are already admissible linear forms (Lemma Q; with companions relative to a cited Sato-Tate joint density). Coefficient squares sum |b(n)|^2 n^-s are non-negative for every sequence, invariant under every unimodular twist, and non-negative for DH (exact). For b = lambda_Pi the series is L(s, Pi x Pi~) H(s) and its Landau abscissa is fixed by the leading pole for every zero configuration: the device reaches Re s = 1 only. Density (family) forms not run (MV-CAP).",
   defeat=["every unimodular twist, THIN included (coefficient squares are invariant)","DH (coefficient square stays non-negative; DH fails the product forms through the sign of a(3), not at a multiplicative step)","any sequence b (positivity of |b(n)|^2 uses no multiplicativity)"]),
 "c6-repair-referee-debts-r5": dict(kind="repair", tags=["control","filter","generator","referee","lemma-u","thin","hoheisel"], nodes=[], okind="filter-repair", restatement=False, lemmas=0,
   title="Second referee of Lemma U; Froehlich-Queyrut and Coleman located; map rows D1-D7, Z15b, Z22; engine rerun",
   obstruction="Repair lane, no attack. Lemma U holds under a further derivation, with U-stab and U-slope added (exception: beta* > 1/2 an isolated real top zero across the family). Theorem 7(iv) is ARGUED; Froehlich-Queyrut covers finite-order characters only; the ray-class Hoheisel exponent (Coleman 1990, 19/24 + eps) is located second-hand only, primary text not opened. Still owed: map rows for c5-twisted-helson-arcs and two other round-5 lanes, section 7 entries for round 5.",
   defeat=["not applicable (repair lane)"]),
}
ENGV = {"precise-obstruction": "closed", "partial-result": "partial", "dead": "closed"}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
have = set()
for l in open(lp):
    try: have.add(json.loads(l)["slug"])
    except Exception: pass
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
with open(lp, "a") as f:
    for r in recs:
        m = META[r["slug"]]; holds = bool(r["refHolds"])
        sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
        if r["slug"] not in have:
            L = dict(r); L.update(kind=m["kind"], refereeHolds=holds, referees=1, restatement=m["restatement"], knownArchitecture=False,
                                  brokenProved=m.get("broken",0), lemmasDecided=m["lemmas"], obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 6, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
               "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": m["okind"],
               "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
               "refereeHolds": holds, "referees": 1, "aboutZeros": bool(r["aboutZeros"]), "refereeNote": r["errors"],
               "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"],
               "refereeFile": os.path.join(os.path.dirname(r["file"]), "REFEREE.md")}
        json.dump(out, open(os.path.join(ROOT, "engine", "outcomes", r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
        e = by.get(r["slug"])
        if e is None:
            e = {"slug": r["slug"], "nodes": m["nodes"], "tags": m["tags"], "title": m["title"], "path": "push/" + r["slug"]}
            eng.append(e); by[r["slug"]] = e
        e["verdict"] = ENGV[r["verdict"]] if holds else "open"
        e["note"] = "round 6, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written (obstruction stands)", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
