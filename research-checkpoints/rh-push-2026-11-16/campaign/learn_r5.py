#!/usr/bin/env python3
"""Round 5 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round5_records.json")))
META = {
 "c5-thin-propd-dichotomy": dict(kind="compute", tags=["seven-eighths","control","sign-twist","thin","sextic-theta","periodicity","mean-square","liouville"], nodes=[], okind="measured-mertens-component-probe-not-computed", restatement=False, lemmas=0,
   title="THIN control: which half of Proposition D fails (row mean squares with eps, Liouville and 1)",
   obstruction="Measurement only; referee does not hold the claim as written. Stops at: (i) the decision 'the low estimate (5.36) fails' rests on a heuristic extrapolation of a common row component (amplitude linear in the weight's Mertens-type sum M_w, energy exponent between 0.13 and 0.20, staircase) from Z <= 2^21 to Z ~ 10^30, where it would first exceed the diagonal for thin weights (under 2 percent of the mean square in range); (ii) the manuscript's probe I_w of (6.1) was not computed, so neither side of Proposition D was measured directly; (iii) the claim that multiplicativity produces the component is refuted: non-multiplicative weights with a large Mertens sum carry the same component.",
   defeat=["non-multiplicative weights with large Mertens sum (nm10, nm50: same common component; the signal is not specific to multiplicative weights)","weight 1 (diagonal only, exponent 1.001), as expected","not run: DH, heat, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w"]),
 "c5-target-fe-order2-ledger": dict(kind="deepen", tags=["seven-eighths","effective-order","functional-equation","linear-program","sextic-theta","large-sieve","floor"], nodes=["map-open-1"], okind="probe-invariant-signal-h-le-1", restatement=False, lemmas=1,
   title="Target functional equation inside the order-2 ledger: does reflection relax h <= 1",
   obstruction="Lemma U (proved, Prop. 2.1 format): the signal constant c of a probe J is an invariant of J, so no re-expression of the same probe (row functional equation, Voronoi, approximate functional equation) changes h. The reflection of the target variable is already manuscript Prop. 5.1 and is the origin of the K-loss; s <-> 1-s cannot act on 1/L without crossing the zeros. Exact LP in the source geometry (lx, ly >= l) with height w: infimum 13/15 at w = 0, reflected branch >= 13/15 + w/15, unreflected >= 1 with the polar term kept, 5/6 floor unchanged, r = 3, 4, 5 follow 1 - 4/(5r) and 1 - 1/r. Vertices with h > 1 occur only at lx < l under hypothetical deletions (inconsistent reduced system; false input not identified). MODEL abscissae relative to unrefereed sources.",
   defeat=["not a control question: floor statement inside the 7/8 estimate system","not run: all controls"]),
 "c5-angular-family-absorption": dict(kind="explore", tags=["seven-eighths","effective-order","angular-family","hecke-character","root-number","epsilon-factor","coherent-set","large-sieve"], nodes=["map-open-1"], okind="abelian-family-no-weight-one-cocycle", restatement=False, lemmas=1, broken=1,
   title="Angular family lambda^(6k) over Q(sqrt -3) and ring-class characters as a coherent set of exponent 1/2",
   obstruction="The transform in the family variable is Fourier inversion on a compact group with no Gauss sum; the root number is +1 (theta inversion; Froehlich-Queyrut recalled), so the Moebius coefficient is mu itself and the rows are Moebius sums of the family. For K <= Y^(1/2-eps) the probe equals its k = 0 row for arbitrary coefficients. The ray coherent set of exponent 1/2 couples s to conj(c) and, with corrected weight N(c*)^(-1/2), does not exceed the Cauchy-Schwarz level: net gain 0, abscissa >= 1 for all K, Y. The model ledger (1+kappa)/2 has its conclusion as input. mu is absorbed only through a nontrivial weight-1 cocycle of the epsilon factor (Jacobi sums, order >= 3). General abstract-family row argued, not proved.",
   defeat=["arbitrary (non-multiplicative) coefficients: the probe equals its k = 0 row for them as well, so the family carries no arithmetic in that range","not run: DH, sign twists, THIN, Beurling"]),
 "c5-marks-circularity-order2": dict(kind="explore", tags=["seven-eighths","effective-order","prime-marks","linear-program","tro6","grh-equivalent","circular"], nodes=["map-open-1"], okind="critical-point-low-input-equals-conclusion", restatement=True, lemmas=0,
   title="Prime marks with l - lx = 2: circularity of the order-2 branch",
   obstruction="Inside r3's reduced system (transcribed, not re-derived; uncompensated high side a guess; polar decomposition MODEL), referee does not hold the claim as written (one sentence of claim A false: r3's 'G = 0, l = 2' vertex is geometrically consistent). Standing: no geometry with marks outnumbering rows has abscissa <= 1; B = 1/2 is LP-feasible only at tall h = 3 points, where the needed low estimate |I| << Z^(lx/2+eps) (with DH and LH) is equivalent to GRH for the family; for h > 3 a low estimate below lx/2 + (h-3)/6 is false; on the compensated ray the abscissa is 1 minus the power saving in the TRO6 polar correlation, a restatement of the conclusion. Obstruction is inside the model, not unconditional; Theorems B and C not checked against the manuscript.",
   defeat=["random control (marked-row mean square equals it for Z <= 256)","Kubota pole control grows at one geometry only","not run: THIN, DH, sign twists"]),
 "c5-twisted-helson-arcs": dict(kind="combine", tags=["helson","discrepancy","additive-twist","euler-product","thin","beurling","control","identification"], nodes=["map-open-21","helson-discrepancy-rigidity"], okind="identification-or-passed-by-thin", restatement=False, lemmas=1,
   title="Discrepancy hypothesis for all additively twisted sums of chi, uniform in the modulus",
   obstruction="Strict form (no main term at q > 1): sum over a mod p of the twisted sums equals p chi(p) S(x/p), so any theta < 1 forces chi = n^(-i alpha) (chi = 1 if the main term is cx): an identification with no inequality; with S(x) = o(x) the hypothesis is the strip hypothesis itself. General form (main terms allowed): THIN passes with error O(q x^(b+eps)) (proved) and has a zero at b. For real chi the twisted series equals L(s,psi) exp(-A(s,psi)) right of sigma_0 without any twisted hypothesis. One referee; Lemma A step (c) to be refereed.",
   defeat=["THIN (passes the general form; zero at b)","every chi other than n^(-i alpha) fails the strict form at the identification step (no inequality)","Beurling: hypothesis not formulable (no additive characters); separated but without an inequality"]),
 "c5-thin-walk-replay": dict(kind="deepen", tags=["seven-eighths","control","thin","sign-twist","ray-class","hoheisel","periodicity","replay"], nodes=[], okind="control-foundation-relative-to-uncited-theorem", restatement=False, lemmas=0,
   title="THIN control: ray-class regular construction and replay of five steps of the 7/8 manuscript",
   obstruction="Control lane. THIN regular in every ray class exists relative to H_K(theta), a modulus-independent Hoheisel exponent in ray classes of Q(sqrt -3) not located as a stated theorem; no conductor uniformity. Replayed steps (6.2), (7.5), Lemma 7.1, Lemma 9.1, (2.2) use the target only as a unimodular completely multiplicative scalar; the first failing hypothesis is Lemma 5.8 (finite-ray character). The (kappa, e) consistency test g_THIN(b) >= b is vacuous (g_THIN > 1) and g is a squarefree-row model. Sharp form left: condition (N), eps-row energy exponent >= 2b - 5/6 if the high comparison holds, with content only for b > 11/12; (6.2)/(7.5) for the non-character weight are not independently confirmed.",
   defeat=["THIN passes the five replayed steps; fails only at Lemma 5.8 (periodicity to a ray-class lattice)"]),
 "c5-device-table-extension": dict(kind="explore", tags=["device","baker","turan","p-adic","iwasawa","carleson","corona","tensor-power","sum-product","vinogradov","dirichlet-to-neumann","control"], nodes=["ctrl-interpolation-twin","padic-interpolation-reads-nonpositive-integers","frequency-only-devices-coefficient-blind","strip-dtn-phase-identity","tensor-squeeze-supplies-size-only","additive-multiplicative-pairing-is-vinogradov"], okind="device-reads-frequencies-values-sizes-or-zero-set", restatement=False, lemmas=1,
   title="Seven crossing devices outside the ROADMAP table",
   obstruction="Each device is closed by what it reads. Baker bounds and finite Turan sums read the frequencies log n only (every Dirichlet-series control passes). p-adic/Iwasawa data read zeta at non-positive integers only (the interpolation twin zeta + c L(s,chi_-4) L(s,chi_5) has the same values and a zero at any prescribed point). The tensor squeeze bounds local parameters only (every unimodular twist passes). Carleson/corona criteria assume S bounded, which is RH. The strip Dirichlet-to-Neumann identity holds for DH with its pole sum; the positive prime-side term is a vanishing fraction of the mean phase derivative. Sum-product is Vinogradov-Korobov: it fails DH and sign twists at named steps and crosses Re s = 1 by (log t)^(-2/3) only (closed by argument). Turan's equivalence for general Euler products not established.",
   defeat=["interpolation twin zeta + c L(s,chi_-4) L(s,chi_5) (new control: p-adic/special-value devices)","every Dirichlet-series control (frequency-only devices)","every unimodular twist (tensor squeeze)","DH (strip Dirichlet-to-Neumann identity holds with a pole sum)"]),
 "c5-repair-engine-map-r4": dict(kind="repair", tags=["control","filter","generator","helson","heat"], nodes=[], okind="filter-repair", restatement=False, lemmas=0,
   title="Engine: curated device list, 5 closed families; map rows P44-P49, G26; Helson Theorem 2; heat Ritz run",
   obstruction="Repair lane, no attack. Curated list leaves 3 open device nodes; 35 of the top 60 candidates rest on the floored 7/8 device. Theorem 2 corollary holds for the largest real zero only (b(1-b) <= 10 theta); non-largest real zeros and r(theta) -> 0 not proved; conclusion relative to zeta. The owed heat Ritz run has no object: no causal kernel for tau < 0 (relative to the internal escape law plus measured non-cancellation).",
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
        out = {"slug": r["slug"], "round": 5, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
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
        e["note"] = "round 5, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written (obstruction stands)", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
