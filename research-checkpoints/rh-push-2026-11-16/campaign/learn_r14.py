#!/usr/bin/env python3
"""Round 14 learn step. Idempotent. Lines self-registered by lanes (campaign/lanes.jsonl, push/<slug>/lanes_line.json or
push/<slug>/lanes.jsonl) are replaced in place by the refereed record (lane metadata kept); writes engine/outcomes/<slug>.json
and the engine/outcomes.json entries; applies push/c14-referee-r13-independent/referee_updates.json to the round-13 lines
(one added referee per lane, marker secondReferee). Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round14_records.json")))
NR = "not run: "
META = {
 "c14-joint-zeta-twist-noncone-search": dict(kind="compute", engv="closed", lem=1, broken=0,
  title="Search for a sign functional of a kernel pair (F, F twisted by chi) separating L-function pairs from nine lifted control classes",
  obstruction="Registered question, outcome 'none' (MEASURED, finite search, lane-defined lifts). Dictionary DJ (mixed dilation minors of orders 2-4, Hermitian minors and forms, Turan cross expressions, with and without polar terms, at most 3 real parameters): 38,101,627 functionals x 833 pairs. Of 4,266,644 functionals one-signed on the 529 training positive pairs, none rejects a training pair of each of the nine lifted control classes (most classes rejected: 8, on 1,692 rows). FE tier: 0 survivors read per member (no row rejects the DH member DH x chi4.3 that keeps a functional equation), 0 on held-out. Structural reason (Lemma J1, PROVED, and Lemma T): for HEAT, BLS and T-NR the twist commutes with the control's defining operation, so the control pair is the image of (zeta, chi) under one map applied to both members; functionals homogeneous in each kernel see only monomial distortion. Not covered: functionals not homogeneous in each kernel (quotient or logarithm of the two kernels; three kernels F, F x chi, F x chi^2).",
  defeat=["backward heat (same sign as (zeta, chi) on JC2 without polar terms, Lemma J1 proved; rejected by 975 functionals only, 0 among minors)", "T-NR and BLS (twist commutes with the control operation; functional equation kept, Lemma T proved)", "DH (5 of 28 twisted members keep a functional equation, measured; no FE-tier row rejects DH x chi4.3)", "E_a (twist keeps the functional equation; classical)", "THIN (never rejected by Hermitian forms)", "no functional rejects all nine lifted classes together"]),
 "c14-joint-pair-design-ratio-vortex-cross-bridge": dict(kind="explore", engv="closed", lem=3, broken=0,
  title="Joint-pair designs: ratio L(chi)/zeta winding, cross bridge Gram of (S_zeta, S_chi), twist-transfer Weil form",
  obstruction="Stage A, all three candidates. J1: winding and Littlewood quantities of L(chi)/zeta are signed differences of member zero counts; a multiplier common to both members cancels (Lemma C, PROVED: T-NR at p0 = 1 mod q has identical ratios for any finite character set). The step that would give a statement (Lemma A, relative to the conductor-aspect density theorem, recalled not opened) needs N_zeta(sigma_0; W) <= N_chi(sigma_0; W') for q^theta' characters and infinitely many q, which is equivalent to the target and on all but q^(theta+eps) characters is the scalar zeta statement (Lemma B). J2: the cross Gram of anticausal Hankel blocks has rank min(m, n) and every step is an identity for any pair of unitary symbols. J3: for narrow bumps P_chi(g_c) = P_zeta(g_(c chi)) exactly (identity TW, PROVED); the prime sides cancel and the difference is archimedean; the identity uses multiplicativity of chi only. The general principle (any pair functional consuming the twist relation cancels the prime side) is ARGUED, not proved.",
  defeat=["T-NR at p0 = 1 mod q (J1: identical ratios, Lemma C; J3: passes identity TW)", "BLS (J2: every step is an identity for any pair of unitary symbols)", "DH for q = +-1 mod 5 (J3: passes identity TW)", "E_a (J3: passes identity TW)"]),
 "c14-theta-orthogonal-metaplectic-eigenobject": dict(kind="explore", engv="closed", lem=4, broken=0,
  title="Luo-Rudnick-Sarnak count on the weight-1/2 Eisenstein series on Gamma_0(4) at s = 1/4 + rho/2 (theta-orthogonal eigen-object)",
  obstruction="Stage A, decisive first test. At s = 1/4 + rho/2 the whole square-index row vanishes (factor zeta(2s-1/2)/zeta(4s-1), Lemma 1'; not the single condition b(1) = 0: the odd-p Hecke relation gives odd squares only). The vanishing annihilates the first-moment (Shimura) series and does not change the growth exponent of sum |b(m)|^2 |m|^-w: rightmost exponent 1 + |2 sigma - 1| (MEASURED at five parameters; pole structure relative to the unopened regularised Rankin-Selberg method), gamma pole |2 sigma - 1|, difference 1 for every beta, so the count gives an inequality true for every beta. Lemma E (classical for (i),(ii)): in rank one a non-real Laplace eigenvalue forces the dominant constant-term exponent at some cusp, so the same holds on every cover and for every vector. Rank >= 2 non-Borel or metaplectic objects are not covered.",
  defeat=["Eisenstein series at a generic parameter (EIS-w): passes the count with the same output", "sieved local vector (proposed control NR-vec): vanishing square row at every parameter, so the row vanishing is a property of the vector, not of the zero", NR+"T-NR and DH (no Hecke eigen-object; not formulable)"]),
 "c14-laxphillips-hecke-norm-outside-l2": dict(kind="explore", engv="closed", lem=6, broken=0,
  title="Lax-Phillips resonance states measured in norms built from the Hecke algebra (outside the energy norm)",
  obstruction="Decisive test: in four families of norms the growth bound is the definition of the space or implied by admissibility. (a) A solid space containing a resonance state and the bounded compactly supported functions contains the constants, so ||T_p^k|| >= (p^(1/2)+p^(-1/2))^k; on the mean-zero subspace off-resonance Eisenstein series give spectral radius >= p^a + p^-a (referee addition). (b) The Hecke-sup norm sup_n N_0(T_n f)/lambda_theta(n) is finite on a joint eigenvector iff |Re mu| <= theta (the conclusion), and on the Eisenstein channel is dominated by a two-sided wave-growth norm that exists for every one-parameter group. (c) In L^q, 1 <= q < 2, admissibility implies the bound. (d) The Hecke-invariant space that reads phi(w) = 0 exists; the rate statement on it is Zagier's horocycle criterion (classical, equivalent to RH). Not established: truncated-setting gauges in general (argued), non-solid norms outside the four families, arbitrary invariant subspaces.",
  defeat=["EIS-w (passes every step where an inequality is proved)", "non-arithmetic group control (the wave-growth norm exists for every Lax-Phillips triple; passes)", "BLS (conditions read through the scattering coefficient are passed; noted by c14-prefilter-sweep-geometric-nodes)"]),
 "c14-prefilter-sweep-geometric-nodes": dict(kind="combine", engv="partial", lem=1, broken=1,
  title="Three-question pre-filter (Lemma F: Q-P, Q-B, Q-S) and sweep of 443 nodes of the user geometric program",
  obstruction="Pre-filter and sweep; the referee does not hold on one sentence labelled PROVED (E1, row Q-B (a)); all other PROVED steps confirmed. Lemma F holds as a sufficient test for 'a control passes'. Sweep by one reader, no control run on any node: about 133 nodes predicted PASS (120 as plain identities), 71 silent, 239 not formulable; boundaries PASS/silent and PASS/not-formulable set by convention. Each silent node read displays the target, a certificate, or cites a closing row or lane, except nodes 142 and 157 (klein-phase-transport-certificate, lemma-w-wide-support: no map row by name). Bridge ratio R_a(w) = X(w-a)/X(w+a): Schur and Blaschke-closed for a >= 1/2; for a < 1/2 strip zeros are poles and the Schur property is the cancellation-aware condition of node 386. The three 'resolved' passes of Q-B/Q-S carry no independent weight.",
  defeat=["T-NR (Q-P: about 133 nodes)", "symmetric multipliers (Q-S: 13 nodes)", "BLS / Blaschke multiplication (Q-B: 3 nodes; bridge shift a >= 1/2)", NR+"no control was run on any node; verdicts are typings by one reader"]),
 "c14-x2-step-catalogue-zero-indexed-objects": dict(kind="combine", engv="closed", lem=2, broken=0,
  title="Catalogue of twelve proved inequalities consuming a Hecke eigen-relation, with zero-indexed objects O1-O3 substituted",
  obstruction="Paper lane. None of the twelve catalogued inequalities has all hypotheses met by O1, O2 or O3 at a zero in the open strip. Lemma T (PROVED): for a torus parameter every L(s, Pi, r x chi) is a product of shifted Dirichlet L-functions and rightmost pole minus rightmost local/gamma pole equals 1 for every parameter and r, so the hypothesis 'rightmost pole on Re s = 1' is equivalent to the exponent-0 conclusion. Proposition E: the Eisenstein-series proof of zeta(1+it) != 0 is the one entry met in full with a zero-specific hypothesis, at Re rho = 1; in the strip the missing hypothesis is xi(2 - rho) = 0, false by the Euler product. For O2 only E4 is met, iff beta = 1/2; for O3 the eigen-relation fails (relative to G26). Every catalogued bound below 1/2 needs L2, pole at 1, spectral membership or unitarity. The isobaric non-torus case T4 is ARGUED; catalogue completeness and 7 of 12 attributions are recalled, not source-checked.",
  defeat=["generic torus parameter (E_a, EIS-w): pole and local pole move together for every r (Lemma T)", NR+"T-NR and DH (no Hecke eigen-object; not formulable)"]),
 "c14-referee-r13-independent": dict(kind="repair", engv="partial", lem=0, broken=0,
  title="Independent second referee of round-13 lanes 1 to 6",
  obstruction="Record lane, no attack. No filter is broken; each holds with a scope line: Lemma P needs every hypothesis typed in one normalisation; Lemma L is conditional on a measured sign of zeta's lattice minors; BLS and Theorems B, C hold in rank one (non-real pairs or even real multiplicity), the affine kernel stays open; the Fourier-interpolation factorisation is exact for H_- only (H_+ has an additive target term; the lane omitted the subtracted term of BRS (4.6)); the LRS bound beta <= 7/4 is relative to a reconstructed threshold; the separator-search 'none' is refereed on the grid stage only (random/adaptive/A3 not refereed); the DH statement holds for the battery DH member only. Bettin Lemma 1 reproduced numerically, not re-proved.",
  defeat=["not applicable (referee lane)"]),
 "c14-repair-map-engine-checkpoint-record": dict(kind="repair", engv="partial", lem=0, broken=0,
  title="Record repair: map 191 -> 198 rows, round-12 relabels, corrected battery records in c12, checkpoint draft U1-U8",
  obstruction="Record lane, no attack. Map 191 -> 198 rows (D9, G34, G35, G36, L6, P55, Z36); eight relabels applied to rows D8, Z35, G33, P54; corrected battery records in c12, D1 20 of 20; engine 45 closed / 1 floored / 0 open. Checkpoint draft: eight read classes the record is silent on (U1-U8), unrefereed; with FE defined as zeta's own functional equation every Dirichlet-series control lacks FE by Hamburger, so U1 {FE, GEOM} and U2 {FE, SIZE} are silent for the same by-construction reason as U3 and need that caveat and corrected per-control reasons before use.",
  defeat=["not applicable (repair lane)"]),
}
DEFTAGS = {"c14-referee-r13-independent": ["record", "referee", "control", "t-nr", "bls", "lemma-p", "fourier-interpolation", "separator-search"],
           "c14-repair-map-engine-checkpoint-record": ["record", "repair", "obstruction-map", "engine", "battery", "checkpoint"]}
def lane_line(slug):
    d = os.path.join(ROOT, "push", slug)
    for fn in ("lanes_line.json", "lanes.jsonl"):
        p = os.path.join(d, fn)
        if os.path.exists(p):
            t = open(p).read().strip()
            try: return json.loads(t)
            except Exception:
                try: return json.loads(t.splitlines()[-1])
                except Exception: pass
    return {}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
old = [json.loads(l) for l in open(lp) if l.strip()]
bys = {d["slug"]: i for i, d in enumerate(old)}
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
for r in recs:
    m = META[r["slug"]]; holds = bool(r["refHolds"])
    sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
    prev = dict(lane_line(r["slug"]))
    if r["slug"] in bys: prev.update(old[bys[r["slug"]]])
    prev.pop("resultFile", None)
    if isinstance(prev.get("lemmasDecided"), list): prev["lemmasList"] = prev.pop("lemmasDecided")
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=1, round=14)
    L["heavy"] = r["slug"] == "c14-joint-zeta-twist-noncone-search"
    for k, dv in (("restatement", False), ("knownArchitecture", False), ("nodes", []), ("tags", []), ("obstructionKind", "")):
        if L.get(k) is None: L[k] = dv
    if not L["tags"]: L["tags"] = DEFTAGS.get(r["slug"], [])
    if not isinstance(L.get("lemmasDecided"), int) or not L.get("lemmasDecided"): L["lemmasDecided"] = m["lem"]
    L["brokenProved"] = m["broken"]
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    out = {"slug": r["slug"], "round": 14, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
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
    e["note"] = "round 14, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
# second referees on round-13 lanes
up = json.load(open(os.path.join(ROOT, "push", "c14-referee-r13-independent", "referee_updates.json")))
applied = []
for u in up.get("updates", []):
    s = u.get("slug")
    if s not in bys: continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = int(L.get("referees") or 0) + int(u.get("independentRefereesAdded") or 0)
        L["secondReferee"] = {"by": up.get("by"), "outcome": u.get("outcome"), "narrowerForm": u.get("narrowerForm"),
                              "downgrades": u.get("downgrades", []), "upgrades": u.get("upgrades", []), "report": u.get("report")}
    fp = os.path.join(OD, s + ".json")
    if os.path.exists(fp):
        o = json.load(open(fp))
        o["referees"] = L["referees"]; o["secondReferee"] = L["secondReferee"]
        json.dump(o, open(fp, "w"), indent=1, ensure_ascii=False)
    applied.append((s, L["referees"]))
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng), "second referees:", applied)
