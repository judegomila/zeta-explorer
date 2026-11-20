#!/usr/bin/env python3
"""Round 20 learn step. Idempotent. Refereed records (campaign/round20_records.json) replace or append the lines in
campaign/lanes.jsonl; lane metadata is taken from the lane's own line file when present. Writes engine/outcomes/<slug>.json
and the engine/outcomes.json entries. Merges the second referees of c20-referee-theorem-d-headline-and-r19 (its
lanes_records.jsonl: c1-leeyang-krein-limit and six round-19 lanes). Flag decision for c1-leeyang-krein-limit: the two
referees disagree on R1; a requirement flag is counted only when no referee on file rejects it, so r1 is set false and the
lane is marked a restatement (first referee's flag kept in r1FirstReferee). Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round20_records.json")))
NR = "not run: "
REFLANE = "c20-referee-theorem-d-headline-and-r19"
META = {
 "c20-u4-second-order-archimedean-mixed-form": dict(kind="explore", engv="closed", refs=1, broken=0, heavy=False,
  nodes=["silent-u4-joint-functionals-not-scaling-invariant"],
  tags=["U4", "second-order", "archimedean", "mixed-form", "bridge-antibridge", "K3-M", "stage-A"],
  title="Cell U4, last read: second-order form pairing the archimedean operator with the prime operator A_P on window vectors",
  obstruction="Stops at the first lemma (stage A). Lemma S: on window vectors at height t the gamma side is the scalar Lg/2 + i pi/4 up to 8 (log t/t) norm(h_0'), so candidate (M) norm(A_P h) <= norm((Arch - A_P) h) is Lg times the first-order band form N(theta') up to O(t^(theta'/2-1) log t) (Proposition M); at degree <= 2 the gamma side multiplies only words linear in Lambda (Proposition C; not proved beyond degree 2). K3-M: every form in Gamma_c, Gamma_c*, A_P, A_P* on L^2[0,u] coincides for zeta and HQ1, HQ3, HQ4 (q >= P), HQ2 (q^2 >= P), T-NR (q >= P, Gamma_c shifted by log q). No control fails at a cross-prime relation. Failure rows of stage A are ARGUED; DEL and THIN undecided.",
  okind="control-passes: twins modified at q >= P share every form in the gamma side and A_P; ZQ passes in the c18 lattice model; the form reduces to the closed first-order band form",
  defeat=["HQ1, HQ3, HQ4 with q >= P and HQ2 with q^2 >= P (K3-M: identical forms at every degree)", "T-NR with q >= P (identical after a shift of Gamma_c by log q)", "ZQ (passes; relative to c18 Proposition Z, lattice model only)", NR+"DEL and THIN rows (lowest eigenvalue of Lg - 2 Re A_P with zeta's Arch imposed)"]),
 "c20-mixed-form-control-census-server": dict(kind="compute", engv="closed", refs=1, broken=0, heavy=False,
  nodes=["tz-one-sided-completion-bound-band"],
  tags=["mixed-form", "T2", "census", "ball-arithmetic", "Theorem A", "tail-bound", "second-order-identity", "server"],
  title="Server run: completed second-order form T2 = 2Re<h,(B^2+[X,A])h> for zeta and 59 objects; enclosed tail for Theorem A",
  obstruction="Registered outcome (a), then a post-registration failure of zeta itself: T2 >= 0 is false for zeta's partial sums at theta' = 0.95 on 5 of 1200 windows (ball-certified; three reproduced independently, two at t = 1e8), and true at the same points for the deletion control. T2 = (T1^2 - K^2)/(2 c0) + bracket, so its sign is a first-order margin statement on the size of the prime sum; T2 < 0 occurs only where T1/(c0 Lg) is below about 0.37, with no separation of zeta from Liouville, sign or Haar chains. The identities and tail Lemma T hold for every Dirichlet polynomial with a_1 = 1 (no multiplicativity). The form is this lane's definition (GATE.md), not the paper lane's candidate (M). Second-order identity: constant 0 at fixed T; its limit is not enclosed.",
  okind="target-fails-and-control-passes: zeta fails T2 >= 0 at theta' = 0.95 while DEL passes every window; failures of E_a, T-NR, HQ2, HQ4 are by coefficient size",
  defeat=["DEL (passes every window including 1200 extra, at the points where zeta fails)", "ZQ (passes; float only)", "Liouville and 17 to 24 of 24 sign chains (pass)", "zeta itself fails at 5 of 1200 windows, theta' = 0.95", "E_a, T-NR, HQ2, HQ4 fail by coefficient size, not at a multiplicative step", NR+"ball stage for ZQ; enclosure of the second-order limit"]),
 "c20-u6ab-rank2-metaplectic-eigenobject-verdict": dict(kind="deepen", engv="closed", refs=1, broken=0, heavy=False,
  nodes=["silent-u6a-rank2-nonborel-metaplectic-eigenobject"],
  tags=["U6a", "U6b", "GL(3)", "GL(4)", "maximal-parabolic", "Eisenstein", "Maass-Selberg", "BLS", "Lemma K"],
  title="Cells U6 (a), (b): maximal-parabolic Eisenstein objects on GL(3), GL(4) and Hecke-invariant subspaces",
  obstruction="No candidate device. On O2 (ternary Epstein; PROVED) and O1, O3 (PROVED relative to recalled Langlands-Shahidi formulas and D9 Theorems B, C): zeta at real part in (1/2,1) is read only as a numerator zero of an intertwining ratio or through the pole at 1; no zero-indexed object is square-integrable; the Hermitian condition at 2u = 1 + rho is the identity x = (beta - 1/2)/3 and nothing forces it; the GL(4) truncated-norm inequality is row D9's rank-one form with M_zeta times an inner function and holds for every placement of non-real zeros (a realised BLS member); the Rankin-Selberg count is shift-independent (product corrected to Pi x conj(Pi)). Cell (b): Lemma K, finite-codimension Hecke-invariant subspaces contain all but finitely many Eisenstein parameters. Not established: double cover (ARGUED), truncated norm of the degenerate P_(2,1) series (inherits row D10), table row E_a (ARGUED).",
  okind="control-passes: EIS-w, BLS, ZQ pass every step; the first linear non-Borel object reading zeta in the strip is itself a BLS member",
  defeat=["EIS-w (off-resonance series; passes every step)", "BLS (the GL(4) form is a realised member)", "ZQ (passes every step)", "E_a, T-NR (pass; E_a row ARGUED)", NR+"double cover; regularised truncated norm of the degenerate P_(2,1) series at 2u = 1 + rho"]),
 "c20-euler-shape-rigidity-infinite-modified-primes": dict(kind="combine", engv="partial", refs=1, broken=0, heavy=False,
  nodes=["exact-relation-rigidity"],
  tags=["identification", "U3", "local-euler-shape", "pole-clause", "pre-filter", "functional-equation", "bohr-spectrum", "Q-inf"],
  title="Pre-filter: Euler-shape rigidity with infinitely many modified primes (Theorem A: FE + relative product convergent up to the line => zeta)",
  obstruction="Identification only (class U3), no statement about zeros. Theorem A: an Euler product G with zeta's functional equation and zeta/G converging uniformly on Re s >= 1/2 (degree-one geometric factors: sum |1-alpha_p| p^(-1/2) finite) is zeta, by reflection and Liouville; the proof uses no multiplicativity and holds over DH and Beurling bases. It stops at the boundary regime: if the relative product converges only in the open half-plane, a twin has no off-line zero other than zeros of zeta (Theorem C) and its existence is open; relative abscissa above 1/2 is open. A twin with local Euler shape and an off-line zero of its own needs sum |1-a(p)| p^-sigma divergent for some sigma > 1/2 (R4 in relative form).",
  okind="identification: base-blind, multiplicativity not used; covers exactly the summable class (Bohr's inequality recalled, not opened)",
  defeat=["DH and Beurling bases (the proof holds over them: base-blind)", "sparse THIN / DEL miss the functional equation by sup 2.23 / 1.02 (measured): no twin in the summable class", NR+"boundary regime (natural boundary or a twin with |alpha_p| = p^(1/2) on a super-sparse set); server not used"]),
 "c20-statement-o-line2-dh-pick-kernel-certified-server": dict(kind="compute", engv="partial", refs=1, broken=0, heavy=True,
  nodes=["finite-pick-stages"],
  tags=["certified-conversion", "statement-o-line-2", "davenport-heilbronn", "pick", "control", "server"],
  title="Server run: DH kernel certificate rerun, DH Pick-order certificate to 256, Theorem C (products of DH with on-line Dirichlet polynomials pass any finite order on bounded node ranges)",
  obstruction="Control statement, not an attack. Certified: DH theta kernel positive, strictly log-concave, u L'' - L' < 0 (0 uncertified subintervals); DH Pick forms positive definite to order 148 and indefinite at 149 on the configurations run (negative pivots to 256: 149, 150, 218, 219), per configuration, not over all node sets. Theorem C (one independent referee): for every N and bounded node range [0, beta] some D_Q = f_DH prod(1 + sqrt(q) q^-s) has exact functional equation, positive even kernel, non-multiplicative coefficients, all DH zeros and positive definite Pick matrices to order N (certified instance Q = {2,3,4,9} to order 256). Stops at: unbounded node range (0, infinity); kernel log-concavity of D_Q (false for Q = {3}, {4}, {6}).",
  okind="control-passes: finite Pick orders on bounded node ranges are passed by a non-Euler Dirichlet series with off-line zeros",
  defeat=["D_Q = f_DH prod(1 + sqrt(q) q^-s) (passes Pick positivity to any order N on [0, beta]; Q = {2,3,4,9} certified to 256)", "DH itself passes orders 2 to 148 on every configuration run", NR+"unbounded node range; all node sets"]),
 "c20-statement-o-line4-heat-zero-enclosures-server": dict(kind="compute", engv="partial", refs=1, broken=0, heavy=False,
  nodes=[],
  tags=["compute", "certified-conversion", "statement-o", "line-4", "line-12", "line-14", "line-15", "controls", "server"],
  title="Server run: Arb enclosures of off-axis zeros of the backward-heat family, SG and NR-q zeros, and exact stage pole counts",
  obstruction="Certified conversion of control records, not an attack. Six off-axis zeros of H_{-tau} (tau = 1, 0.25 twice, 0.2, 0.15, 0.1) enclosed with winding number 1 (zeta's H_0 gives 0 on the same squares); SG real zero at 1/2 + b (b = 0.3, 0.4); NR-q zero at c = 2.1, 2.05; exact pole counts for zeta phases P = 13..47 and U_s0 P = 13..37. Status: certified in Arb, one derivation, one execution, plus a non-rigorous independent confirmation. Stops at: Lemma Q (Trefethen-Weideman Theorem 5.1) quoted from memory and not opened; the escape law F1 of line 4 not re-derived; U_s0 at P = 47 float64 only (131).",
  okind="certified conversion of control records",
  defeat=["not applicable (certified conversion; the located zeros are the controls' own)", NR+"U_s0 at P = 47 in balls; 256-bit rerun at P = 47"]),
 "c20-referee-theorem-d-headline-and-r19": dict(kind="repair", engv="partial", refs=1, broken=0, heavy=False,
  nodes=["out-c1-leeyang-krein-limit"],
  tags=["referee", "repair", "theorem-d", "headline", "r1-flag", "controls", "round-19", "second-referee"],
  title="Second referee of Theorem D of c1-leeyang-krein-limit (headline lane) and of six round-19 lanes",
  obstruction="Referee lane, no attack. Theorem D holds with four wording corrections and is an equivalence with its target (restatement under METRIC A). Its R1 flag is not confirmed: Lemma E, exponential stages of any Dirichlet series with a_1 = 1, |a_n| <= 1 are entire, zero-free and converge on Re s >= 2, so zero-free stages exist for DH; Euler stages of the multiplicative controls T-NR, HQ2, G_q have a local zero in Re s > theta. Every control fails only at local boundedness, the open step. Six round-19 second referees: five hold with corrections, one holds. X(d) and NL(d) of the D10 lane need 'd even' (exact counterexamples at d = 3, 5).",
  okind="referee lane", defeat=["not applicable (referee lane)"]),
 "c20-repair-owed-record-r19-statement-o-v5": dict(kind="repair", engv="partial", refs=2, broken=0, heavy=False,
  nodes=[],
  tags=["repair", "record", "map-rows", "control-codes", "statement-o", "checkpoint-decision-sheet", "corrections"],
  title="Record repair: owed list of round 19 (map 215 -> 217 rows, control codes HQ2/HQ3/HQ4), Statement O version 5, checkpoint decision sheet",
  obstruction="Record lane, no attack. Map 217 rows (X2, G45) plus control rows HQ3, HQ4; no device or cell state changed (55/1/0; 6/1/4); Statement O v5 relabels lines 13, 14, 16, 17 PROVED in restricted forms, line 15 (NR-q) stays ARGUED because its second referee file does not cover the construction; the decision sheet applies nothing. Open after the referee: C1 (items 59, 61, 63 listed as closed on one referee each; STRATEGY and engine disagree on U6 (c)), C2 (reflection figure L^2/(8T) is an optimum over c), C3 (the lane set its own referee fields).",
  okind="record lane", defeat=["not applicable (repair lane)"]),
}
def lane_line(slug):
    d = os.path.join(ROOT, "push", slug)
    for fn in ("lanes.jsonl", "lane_line.json", "lanes_line.json"):
        p = os.path.join(d, fn)
        if not os.path.exists(p): continue
        t = open(p).read().strip()
        try: x = json.loads(t)
        except Exception:
            try: x = [json.loads(l) for l in t.splitlines() if l.strip()]
            except Exception: continue
        for y in (x if isinstance(x, list) else [x]):
            if isinstance(y, dict) and y.get("slug") == slug: return y
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
    if r["slug"] in bys: prev.update({k: v for k, v in old[bys[r["slug"]]].items() if k not in prev})
    if isinstance(prev.get("lemmasDecided"), list): prev["lemmasList"] = prev.pop("lemmasDecided")
    if prev.get("refereeNote") and "laneRefereeNote" not in prev: prev["laneRefereeNote"] = prev["refereeNote"]
    prev.pop("refereeNote", None)
    if prev.get("errors") and "laneErrors" not in prev: prev["laneErrors"] = prev["errors"]
    if prev.get("claim") and "laneClaim" not in prev: prev["laneClaim"] = prev["claim"]
    if prev.get("resultFile") and not str(prev["resultFile"]).startswith("/"): prev.pop("resultFile")
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=m["refs"], round=20, heavy=m["heavy"])
    L["obstructionKind"] = m["okind"]
    if not L.get("nodes"): L["nodes"] = m["nodes"]
    if not L.get("tags"): L["tags"] = m["tags"]
    if isinstance(L.get("serverUnits"), str): L["serverUnitsNote"] = L["serverUnits"]; L["serverUnits"] = []
    for k, dv in (("nodes", []), ("tags", []), ("serverUnits", [])):
        if not L.get(k): L[k] = dv
    for k, dv in (("restatement", False), ("knownArchitecture", False)):
        if L.get(k) is None: L[k] = dv
    if not isinstance(L.get("lemmasDecided"), int): L["lemmasDecided"] = 0
    L["brokenProved"] = m["broken"]
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    rf = os.path.join(os.path.dirname(r["file"]), "REFEREE.md")
    out = {"slug": r["slug"], "round": 20, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
           "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": m["okind"],
           "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
           "refereeHolds": holds, "referees": m["refs"], "aboutZeros": bool(r["aboutZeros"]), "brokenProved": m["broken"],
           "refereeNote": r["errors"] + " - [truncated in the learn-step input; full text in REFEREE.md]",
           "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"],
           "refereeFile": rf if os.path.exists(rf) else None,
           "launchedNodes": [n for n in nodes if not n.startswith("out-")], "engineVerdict": m["engv"]}
    json.dump(out, open(os.path.join(OD, r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
    e = by.get(r["slug"])
    if e is None:
        e = {"slug": r["slug"], "path": "push/" + r["slug"]}; eng.append(e); by[r["slug"]] = e
    e.update(nodes=nodes, launchedNodes=out["launchedNodes"], tags=tags, title=m["title"], refereeHolds=holds,
             aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"], verdict=m["engv"])
    e["note"] = "round 20, score %d, referee holds: %s" % (sc, m["obstruction"][:300])
applied = []
sp = os.path.join(ROOT, "push", REFLANE, "lanes_records.jsonl")
for l in open(sp):
    if not l.strip(): continue
    s2 = json.loads(l); s = s2["slug"]
    if s not in bys: continue
    L = old[bys[s]]
    key = "secondReferee" if not L.get("secondReferee") else None
    if key is None and isinstance(L["secondReferee"], dict) and L["secondReferee"].get("by") != REFLANE and not L.get("thirdReferee"): key = "thirdReferee"
    if key:
        L["referees"] = int(L.get("referees") or 0) + 1 if key == "thirdReferee" else max(int(L.get("referees") or 0) + 1, 2)
        L[key] = {"by": REFLANE, "outcome": "holds" if s2.get("secondRefereeHolds", s2.get("refereeHolds")) else "named statements hold after correction; printed text unrepaired",
                  "note": s2.get("secondRefereeNote", ""), "report": s2.get("secondReferee")}
        if s2.get("scopeCorrections"): L[key]["scopeCorrections"] = s2["scopeCorrections"]
        L["brokenProved"] = max(int(L.get("brokenProved") or 0), int(s2.get("brokenProved") or 0))
    if s == "c1-leeyang-krein-limit" and not L.get("flagDisagreement"):
        L["r1FirstReferee"] = bool(L.get("r1")); L["r1SecondReferee"] = False
        L["flagDisagreement"] = s2.get("flagDisagreement", True); L["headlineIfAdopted"] = s2.get("headlineIfAdopted")
        L["r1"] = False; L["restatement"] = True; L["score"] = 0
        L["flagDecision"] = "round-20 learn step: the two referees agree on the mathematics and disagree on R1; R1 is not counted (DH has zero-free exponential stages by Lemma E; Euler stages of T-NR, HQ2, G_q have local zeros), and Theorem D is an equivalence with its target (restatement, METRIC A)"
    fp = os.path.join(OD, s + ".json")
    if os.path.exists(fp):
        o = json.load(open(fp)); o["referees"] = L["referees"]; o["brokenProved"] = L["brokenProved"]
        for k in ("secondReferee", "thirdReferee", "flagDecision"):
            if L.get(k): o[k] = L[k]
        if s == "c1-leeyang-krein-limit":
            o["score"] = 0
            if isinstance(o.get("requirements"), dict): o["requirements"]["r1"] = False
        json.dump(o, open(fp, "w"), indent=1, ensure_ascii=False)
    applied.append((s, L["referees"], L["brokenProved"]))
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng), "second referees:", applied)
