#!/usr/bin/env python3
"""Round 15 learn step. Idempotent. Lines self-registered by lanes in campaign/lanes.jsonl are replaced in place by the
refereed record (lane metadata kept); writes engine/outcomes/<slug>.json and the engine/outcomes.json entries; records the
second referee of c15-referee-r14-independent-checkpoint on round-14 lanes 1 to 6 (marker secondReferee).
Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round15_records.json")))
NR = "not run: "
META = {
 "c15-edge-argument-strip-width-hecke-amplified": dict(kind="explore", engv="closed", lem=4, broken=0,
  title="Quantitative Eisenstein edge argument with a Hecke amplifier on the truncated norm of E*(z, rho/2)",
  nodes=[], tags=["explore", "u1", "eisenstein-edge", "maass-selberg", "hecke-amplifier", "truncation", "closed-row-proposed", "r4-direct"],
  okind="identity: both sides of the device inequality are one explicit vector with exactly known norm; amplifier gain bounded by N^delta",
  obstruction="Stops at the decisive first test. At a zero rho = 1 - delta + i gamma the truncated norm is exactly |xi(2-rho)|^2 T^delta/delta (Maass-Selberg), and at T = 1 the device inequality is the identity M = L + S. On truncated Eisenstein data T_m acts as a combination of truncations at dilated heights, so for T >= N the amplified norm is M(T) x*Kx with K depending on (gamma, delta, N) only, gain at most N^delta, and the amplified inequality is implied by the unamplified one (PROVED). The loss sits outside the norm, in a sieve lower bound for the divisor-type mean and in sup|zeta'|; the width obtained is c/log^5 gamma (ARGUED), weaker than classical, and with a bounded lower-bound input the inequality follows from absolute convergence for delta >= (log log gamma + C)/log gamma for every Euler product with local parameters of modulus at most 1. Not covered: amplifiers with T < N (argued, one measured case).",
  defeat=["EIS-w and BLS (pass the amplified part verbatim: Hecke operators act on truncated Eisenstein data only by dilating the truncation height)", "every Euler product with local parameters of modulus at most 1 (the surviving inequality follows from absolute convergence)", NR+"T-NR and DH on the amplified norm (no Hecke eigen-object)"]),
 "c15-control-with-zeta-fe-classes-u1-u2": dict(kind="combine", engv="closed", lem=3, broken=0,
  title="Control ZQ = zeta(s) m(s) with zeta's own functional equation and off-line zeros, for read classes U1 {FE, GEOM} and U2 {FE, SIZE}",
  nodes=[], tags=["combine", "u1", "u2", "control-zq", "symmetric-multiplier", "lemma-l", "lemma-d", "nr-q", "control-construction"],
  okind="control-passes",
  obstruction="U1 {FE, GEOM} and the SIZE branch of U2 are not control-free. ZQ = zeta(s) m(s), m rational in s(1-s) of degree 0, keeps zeta's functional equation, pole, order, N(T) and every prime-power atom of log zeta, has zeros at 1/2 +- eta +- i gbar, and its defect is an absolutely continuous density with sup <= 8e^-2 (eta^2+d^2)/(1/2-eta)^2 (PROVED). If GEOM, SIZE and EP are read on atoms ZQ is a control for U1 and U2-SIZE; if read on ordinary coefficients U1 lies inside U3 by Hamburger. Lemma L (PROVED given Landau): FE, no pole other than s = 1 and Lambda_G >= Lambda force G = c zeta; without the pole clause it fails. Lemma D (PROVED) for discrete symmetric multipliers only: off-integer l1 mass >= 1. Open cell: a member with zeta's FE and Lambda_G >= 0 (neither constructed nor excluded). Referee correction E1 (material): the pole clause of Lemma L was dropped in three places of RESULT.md.",
  defeat=["ZQ (zeta times a rational symmetric multiplier: passes every U1 / U2-SIZE read taken on atoms)", "SG (companion symmetric-multiplier control)", "NR-q (T-NR at base 1 + sqrt 2: the control for twist families, where ZQ's twists have poles on the line)"]),
 "c15-u5-window-count-threshold-translate-control": dict(kind="deepen", engv="closed", lem=3, broken=0,
  title="U5: largest number of windows at height T passed by a translate, free-prime or interpolation control",
  nodes=None, tags=None, okind=None,
  obstruction="Outcome (a): a control exists at every K = T^a, a < 1, at fixed tolerance. For windows inside one span [T, T+L] the translate zeta(s + i alpha), alpha ~ 2pi/log(T/2pi), has relative FE defect pi L/(T log(T/2pi))(1+o(1)) on the whole span (PROVED to leading order), optimal among translates with |alpha| <= T/2; contiguous unit windows passed at tolerance eta: max(eta T log(T/2pi)/pi, sqrt(8 eta T)). Free-prime unimodular Euler products with an off-line zero of the finite model pass 24 + 0.36K conditions up to a parameter-count crossover (float64 search, no certificate; K = 512 at T = 1e6 not run). Translates are controls for identification-type conclusions only. No rigidity inequality found. Open cell: a device comparing heights with ratio beyond 1 + eta log T/pi and reading more than pi(N) prime conditions, where every statement found so far is F = zeta on the window (row S12).",
  defeat=["WT translate zeta(s + i alpha) (passes every window inside a span of relative length eta log(T/2pi)/pi)", "free-prime unimodular Euler product U (passes below the parameter-count crossover; measured)", "(zeta(s) + zeta(s + i alpha))/2 (same absolute defect, not multiplicative, off-line zero found at T = 1e6)"]),
 "c15-u7-growing-section-twin-ladder-bridge": dict(kind="deepen", engv="closed", lem=1, broken=0,
  title="U7: Fejer-tapered sections of the prime chain with P = t^theta read through J-contractivity on the gamma one-port",
  nodes=None, tags=None, okind=None,
  obstruction="Class U7 closes as a row. For the Fejer-tapered section L_F(s) = sum_rho K_u(s - rho) with Re K_u >= 0 on Re w >= 0, so J-contractivity on Re s > 1/2 at every P is a Fejer-smoothed form of Re xi'/xi > 0 and of map row P45 (the Weil form): the limit step is sound (Harnack, Vitali) and the stage inequality at unbounded P is the target. With P = t^theta the statement follows from RH and is proved only for P up to about ((1/4) log t log log t)^2, where it also holds for every sign twist; its band-bound consequence (Proposition 4) is met by random sign chains. Sharp sections of zeta are J-expansive on the line for theta >= 1/2 (MEASURED). No step uses multiplicativity; controls fail only through zero location. Proposition 5 (theta-coupled statement forces beta - 1/2 <= c_theta/log gamma) is neither proved nor refuted.",
  defeat=["random sign chains (meet the band-bound consequence; in the unconditional range every sign twist satisfies the stage statement)", "DH, Liouville, random unimodular twists (violate for theta >= 1, but only through zero location or the absence of the identity: no structural step)", NR+"T-NR as an R1 control (the lane's member had 0 < c <= 2, not the map's T-NR; referee correction E1)"]),
 "c15-nonhomogeneous-pair-triple-kernel-search": dict(kind="compute", engv="closed", lem=3, broken=0,
  title="Search for a non-homogeneous functional (quotient, logarithm, product kernel) of kernel pairs and triples separating L-function data from lifted control classes",
  nodes=None, tags=None, okind=None,
  obstruction="Registered outcome 'none' (MEASURED finite scan, float64 with undecided pair-family nodes resolved by a reflection identity (360) or in balls; exact in the last real parameter except minors a2/a3; lane-defined lifts). Dictionary DN: 2,898,030 pair family-nodes (T-train 0), 1,598,273 quotient minors (0 one-signed on the 529 training positives), 20,300 product nodes (T-train 0); six-class tier {DH, T-NR, E_a, HEAT, U, THIN}: 0. Canonical tier {T-NR, E_a, HEAT}: 22,508 nodes at T-train, 0 hold out in float64, 67,138 nodes float64-undecided, so that tier is not closed. PROVED: the HEAT lift with equal tau on both members is blind to every functional of the pointwise quotient and to third-log-difference functionals without polar terms. Not implemented: FE-respecting DH class per member, theta^w lift restricted to (zeta, chi), unequal-tau HEAT class.",
  defeat=["backward heat with equal tau (exactly blind to quotient and third-log-difference functionals without polar terms; proved)", "HEAT on the remaining reads (single-kernel log curvature, polar terms, product against pointwise product; measured)", "the positives disagree among themselves for quotient minors and product-minus-pointwise (0 one-signed on 529 training positives)", "no functional rejects all nine, or all six, lifted classes together"]),
 "c15-klein-transport-lemma-w-stage-a-and-e1": dict(kind="combine", engv="closed", lem=3, broken=0,
  title="Stage-A read of klein-phase-transport-certificate joined to lemma-w-wide-support; repair of sentence E1; second reader on 15 silent nodes",
  nodes=None, tags=None, okind=None,
  obstruction="The pair stops at stage A. Lemma W(A) (for all T >= T0) contains the strip |beta - 1/2| <= 1/(2A) as its own large-sigma part (kappa = 0, verified height not needed) and is strictly stronger than that strip at multiset level: a target-level hypothesis. The Klein certificate concludes Re xi'/xi > 0 at depth h from phase data at depth a; for fixed 0 < h < a with a > 1/2 its right side is negative for t >= t0(a, h) (it needs R <= pi/(4M) against M >= c log t); for a <= 1/2 only conditionally on a strip of half-width below a. Identity K0 holds for reflection-symmetric F only (referee correction E2). Theorem E1' (Schur iff m(lambda - 2a) >= m(lambda) for Re lambda > a) is proved and coincides with on-file nodes 386, 358. Second reader on 15 of 71 silent nodes: 14 agree, 1 boundary; not blind.",
  defeat=["BLS (passes Lemma W)", "E_a, T-NR, DH, backward heat (fail Lemma W only on their zero sets: no structural step)", "any reflection-symmetric F (identity K0 holds; the certificate is not sign-definite at height)"]),
 "c15-referee-r14-independent-checkpoint": dict(kind="repair", engv="partial", lem=0, broken=0,
  title="Independent second referee of round-14 lanes 1 to 6 and of the checkpoint draft; lift ruling",
  nodes=[], tags=["record", "referee", "checkpoint", "lift-ruling", "leave-one-class-out", "label-restrictions"], okind="",
  obstruction="Record lane, no attack. Round-14 lanes 1 to 6 and the checkpoint draft hold with scope lines; no assigned PROVED lemma is broken. Three sentences are false as written ('b(1) = 0 propagated by the Hecke relation'; 'for a < 1/2 the Schur condition is the zero-free statement'; 'no control on file has zeta's own functional equation': T-NR in Laurent form has it). Lift ruling: T-NR, E_a, HEAT lifts canonical; BLS, theta^w, BEU lane-defined; BEU is not an off-line control. Grid-stage recount (1,487,558 functionals): outcome 'none' holds with the three canonical lifts alone, with any one class dropped and with the held-out threshold lowered to 22 or 20; the draw stage is not recounted. Checkpoint: U1, U2 become cells of U3; U4, U6 (a), (b), (g), U8 narrowed. 30 label restrictions listed, not applied. Lemma J1' and the U8 heat-inheritance exclusion were derived here without a referee.",
  defeat=["not applicable (referee lane)"]),
 "c15-repair-record-strategy-v4-report": dict(kind="repair", engv="partial", lem=0, broken=0,
  title="Record repair: map 198 -> 202 rows, control NR-vec, 13 label restrictions, engine control list, STRATEGY v4, campaign report",
  nodes=[], tags=["record", "repair", "obstruction-map", "engine", "strategy-v4", "campaign-report"], okind="",
  obstruction="Record lane, no attack; R4 not addressed. Map 198 -> 202 rows (G37 to G40), control NR-vec, sentence E1 of c14 lane 5 marked NOT HOLDING, 13 label restrictions applied; engine 50 closed / 1 floored / 0 open device types, pending RS-1..3 replaced by U3, U6 (e)-(g), U8; STRATEGY version 4; CAMPAIGN_REPORT_R15.md (obstruction record plus part-B figure 0.8748866470 relative to unrefereed manuscripts; headline 1 of 4; RH open). Owed: wording corrections E1 to E4 in the report and STRATEGY (E1: 'no control on file has zeta's own functional equation' is false as written), independent referee of rows G37 to G40, map row for dictionary DJ.",
  defeat=["not applicable (repair lane)"]),
}
SECOND = ["c14-joint-zeta-twist-noncone-search", "c14-joint-pair-design-ratio-vortex-cross-bridge", "c14-theta-orthogonal-metaplectic-eigenobject",
          "c14-laxphillips-hecke-norm-outside-l2", "c14-prefilter-sweep-geometric-nodes", "c14-x2-step-catalogue-zero-indexed-objects"]
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
old = [json.loads(l) for l in open(lp) if l.strip()]
bys = {d["slug"]: i for i, d in enumerate(old)}
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
for r in recs:
    m = META[r["slug"]]; holds = bool(r["refHolds"])
    sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
    prev = dict(old[bys[r["slug"]]]) if r["slug"] in bys else {}
    if isinstance(prev.get("lemmasDecided"), list): prev["lemmasList"] = prev.pop("lemmasDecided")
    if prev.get("refereeNote") and "laneRefereeNote" not in prev: prev["laneRefereeNote"] = prev["refereeNote"]
    prev.pop("refereeNote", None)
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=1, round=15)
    L["heavy"] = r["slug"] == "c15-nonhomogeneous-pair-triple-kernel-search"
    for k, mv, dv in (("nodes", m["nodes"], []), ("tags", m["tags"], []), ("obstructionKind", m["okind"], "")):
        if not L.get(k): L[k] = mv if mv else dv
    for k, dv in (("restatement", False), ("knownArchitecture", False)):
        if L.get(k) is None: L[k] = dv
    if not isinstance(L.get("lemmasDecided"), int) or not L.get("lemmasDecided"): L["lemmasDecided"] = m["lem"]
    L["brokenProved"] = m["broken"]
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    out = {"slug": r["slug"], "round": 15, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
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
    e["note"] = "round 15, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
# second referees on round-14 lanes 1 to 6 (c15-referee-r14-independent-checkpoint, files REFEREE2_<slug>.md)
applied = []
RD = os.path.join(ROOT, "push", "c15-referee-r14-independent-checkpoint")
for s in SECOND:
    rep = os.path.join(RD, "REFEREE2_%s.md" % s)
    if s not in bys or not os.path.exists(rep): continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = int(L.get("referees") or 0) + 1
        L["secondReferee"] = {"by": "c15-referee-r14-independent-checkpoint", "outcome": "holds with a scope line; no assigned PROVED lemma broken",
                              "narrowerForm": "see report and push/c15-referee-r14-independent-checkpoint/LABEL_RESTRICTIONS.md (30 restrictions listed, not applied)",
                              "report": rep}
    fp = os.path.join(OD, s + ".json")
    if os.path.exists(fp):
        o = json.load(open(fp)); o["referees"] = L["referees"]; o["secondReferee"] = L["secondReferee"]
        json.dump(o, open(fp, "w"), indent=1, ensure_ascii=False)
    applied.append((s, L["referees"]))
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng), "second referees:", applied)
