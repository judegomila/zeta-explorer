#!/usr/bin/env python3
"""Round 18 learn step. Idempotent. Refereed records (campaign/round18_records.json) replace or append the lines in
campaign/lanes.jsonl; lane metadata is taken from the lane's own line file in its slug directory when present. Writes
engine/outcomes/<slug>.json and the engine/outcomes.json entries; records the second referee of
c18-referee-r17-independent-sources on round-17 lanes 1, 2, 3, 5 (marker secondReferee). Device states in engine/curated
are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round18_records.json")))
NR = "not run: "
META = {
 "c18-u4-group-law-left-of-one-torus-orbit": dict(kind="explore", engv="closed", refs=1,
  title="Cell U4 residual (iv): multi-point group-law (3-4-1 type) inequality with every term finite left of abscissa 1",
  obstruction="Stops at stage A (controls pass). Cell U4 (iv) closed for the read 'positivity-derived inequality on shifts s+ikt or powers of a character'. Lemma GL (corrected by the referee): the inequalities hold iff at each atom the evenly extended sequence k -> Re Lambda_k(n) is positive definite, so the group-law step reads each prime separately and no relation between primes (no R1). Theorem T: a pointwise lower bound on an open set holds iff the set is zero-free (target). Lemma S: sign control of the zero terms forces a test at abscissa >= 1 (Fejer sign region exactly Re z <= 0). Lemma V: a simple zero at distance delta from Re s = 1 needs mean log-length < log 2/delta in the 3-4-1 mechanism. Height ceiling 1-beta << 1/log t for general tests is ARGUED only. Not covered: inequalities reading phases at different primes jointly, or quadratic in the log-derivative.",
  okind="control-passes: E_a and the G_+ lift pass steps (1)-(3) with their own poles; U, THIN, TW+, DEL, Beurling-rational pass without the functional equation; the step is atom-by-atom positivity of Lambda",
  defeat=["E_a = zeta(s+a)zeta(s-a) (passes every step with its own poles)", "G_+ lift (passes every step)", "U, THIN, TW+, DEL, Beurling-rational member (pass without the functional equation)", "T-NR fails only at the sign of the coefficient at p0^2 (a sign of Lambda, not a zero read); with long tests it satisfies the inequality at 1e5 random points (pole dominance)"]),
 "c18-tz-one-sided-bound-fe-reserve-bridge": dict(kind="combine", engv="closed", refs=1,
  title="One-sided bound N(theta) on the band operator T_Z with the reflected half of the approximate functional equation as completion",
  obstruction="Stops at the first lemma. Exact identity (PROVED, classical in content; referee removed a spurious log|a_P| term): for a_1 = 1, a_P != 0, u = log P, h in H^1_0[0,u]: -2 Re<h, A_P h> = -u||h||^2 + sum over zeros beta of the partial sum D_P of the convolution forms e^((beta-1/2)|xi|). N(theta) is therefore a statement about zeros of D_P; it uses neither multiplicativity nor the reflected half, whose frequencies are >= u and lie outside the band. Explicit completions are the zero measure (assumes real zeros in the window) or Hermite-Biehler phase symbols (false for D_P). In the lattice model ZQ passes for theta' < 1 at M = 0 with margin Lg(1 - theta' - sin(pi theta')/pi), zero at theta' = 1: below the Nyquist band the conclusion holds for ZQ (no R3), at theta' = 1 it is the target. Other control rows ARGUED, not run; FOR_NUMERICS_LANE.md runs not done.",
  okind="control-passes: ZQ passes N(theta) for theta' < 1 (lattice model, proved); the identity holds for every Dirichlet series with a_1 = 1, so no step reads multiplicativity; target-level at theta' = 1",
  defeat=["ZQ (passes for theta' < 1 at M = 0 in the lattice model; proved)", "every Dirichlet series with a_1 = 1, including non-multiplicative ones (same exact identity)", NR+"DH, E_a, T-NR, sign chains on paper are ARGUED only (see the server lane for measured rows)"]),
 "c18-tz-band-completion-controls-server": dict(kind="compute", engv="closed", refs=1,
  title="Server run: certified sign of the completed band form and of N(theta), 1/2 < theta <= 1, zeta and control classes at heights 1e6 to 1e12",
  obstruction="Registered outcomes (c) and (b) (MEASURED; signs certified relative to a hand-derived radius; 96 Fourier modes; 40 windows; 44,600 cells). (c) The registered reflected completion (atoms n -> t/(2 pi n)) is not a positive extension of zeta's data: zeta fails in 600 of 600 cells, and for every global phase of the reflected part (referee, float, 3e6). (b) N(theta) on 96 modes: zeta positive in 640 of 640 cells at theta <= 0.85, zero within the radius at theta >= 0.95; multiplicative sign chains pass at theta = 0.55 with zeta's margin and fail in 94-98% of cells at theta >= 0.95, where zeta's margin goes to 0. Chain passes and zeta's margins depend on the number of modes (referee: 1536 modes at theta 0.65, chains pass M = 1 in 57% of cells), so nothing follows about every-window separation. Not run: backward heat; theta 0.95 and 1.0 at 1e12.",
  okind="control-passes: multiplicative sign chains, ZQ (eta 0.05, to theta 0.75), E_0.1 and DH at low theta pass N(theta); the completed form fails for zeta itself",
  defeat=["24 multiplicative sign chains (pass at theta = 0.55 in 98% of cells at M = 0 with zeta's margin)", "ZQ eta = 0.05 (passes at M = 1 to theta = 0.75)", "E_0.1 and DH (pass at low theta)", "zeta itself fails the reflected completion (600 of 600 cells)", NR+"backward heat"]),
 "c18-d10-inertia-law-theorem-t-lemma-d": dict(kind="deepen", engv="partial", refs=1,
  title="Inertia law of the rank-2 apex kernel (row D10): symmetric quartet in the rational model, Bezoutian identity, transfer to zeta",
  obstruction="Tried, not closed: row D10 not proved. PROVED (one referee, computer-assisted exact): in the rational model with base (u+1)/(u-1) a symmetric quartet 1/2 +- eta +- i g gives a positive semidefinite apex kernel of rank 6 for all 0 < eta < 1/2, g > 0; 6N is the antisymmetrised product of two Bezoutians, so a pole-free base passes for every insertion in Re a >= 0 at every degree; M = M_0 Xi(u)/Xi(u+1), so zeta's apex kernel is a limit of model kernels of symmetric zero sets. Failing transfer step: X(d), model positivity for symmetric sets of every even degree d, proved for d = 2, 4, exact at 17 configurations for d = 6..12, open in general. The c17 parity clause must be restated with b = u(u-1)g. MEASURED on the zeta base, orders 64-128: 600 of 600 symmetric insertions positive.",
  okind="open-step: X(d) for general d; the kernel reads only the reflection symmetry of the zero set (symmetric off-line quartets pass, proved), so the row cannot score",
  defeat=["symmetric off-line quartet 1/2 +- eta +- i g (passes; proved in the rational model)", "every insertion in Re a >= 0 on a pole-free base (passes at every degree; proved)", "ZQ in rational form, DH base (pass; c17)"]),
 "c18-u6c-gl3-cover-whittaker-constants-method": dict(kind="deepen", engv="closed", refs=1,
  title="Cell U6 (c): Whittaker constants on covers of GL(3): cubic theta (Gauss-sum array) and the double cover (local dimension 4)",
  obstruction="Cell U6 (c) splits; cubic half decided. Cubic theta on GL(3) (unique Whittaker model): tau(p^l1,p^l2) != 0 iff (l1,l2) = (0,0) or (1,1) mod 3 (recalled Kazhdan-Patterson criterion; l2 = 0 opened in Friedberg-Ginzburg 1403.3929; consistent with smoothed A_2 double sums at X = 1e5, 2e5 on 57 indices); tau(p,p)/tau(1,1) = kappa conj(gamma(p)) q^(-1/6), kappa 0.97 to 0.99, limit not resolved: the cubic Gauss-sum array of rows Z14/Z15, no new object. The sign candidate (C3) is a residue identity of Patterson's series, fails for multiplicative unimodular twins and on a class mod 9 of theta itself. Double cover: theta has no Whittaker coefficient; local Whittaker dimension 4, so squarefree-class constants are global period-type data; method is a plan, not run; (K3) not yet a defined statement. Zeta controls have no lift to the cover.",
  okind="no-new-object: constants are cubic Gauss sums (rows Z14/Z15); the reads are identities shared by multiplicative twists; 7/8-adjacent",
  defeat=["multiplicative unimodular twins (sign candidate fails / identity shared)", "theta itself on a residue class mod 9 (sign candidate fails)", NR+"zeta controls have no lift to the cover; double-cover method not run"]),
 "c18-exact-relation-rigidity-klein-spinor": dict(kind="combine", engv="closed", refs=1,
  title="Exact-relation rigidity: which exact relations stay admissible once multiplicativity is the relation (Hamburger, Theorem P, Klein seam, spinor square root)",
  obstruction="Closes at the decisive test. Multiplicativity replaces no clause of Hamburger / Theorem P. FE clause deleted: TN1 = zeta(s)(1+q^(3/4-s)) is integer-frequency, multiplicative, non-negative, single pole at 1, zeros on Re s = 3/4. Pole clause deleted: HQ2 = zeta(s)(1+eps u^2/(1-u)^4), u = q^(1/2-s), has zeta's exact functional equation, integer frequencies, multiplicative coefficients >= 1, zeros at distance eps^(1/4)/(sqrt2 log q) from the line for every eps > 0 and an order-4 pole at s = 1/2. Lemma Q: a pole-free symmetric one-base multiplier is 1 (Liouville; no multiplicativity). Proposition F: members with zeta's coefficients for n < q, within delta of zeta on Re s >= 2, vanish on Re s = 3/4. Only a(pn) = a(n) (definition) and J = 1 (target) exclude every control. Proposition D (c) needs repair.",
  okind="control-passes: HQ2 (exact FE, integer frequencies, multiplicative coefficients >= 1, zeros off the line) fails only the pole clause, which is analyticity on the critical line; rigidity is linear algebra in the coefficient measure",
  defeat=["HQ2 = zeta(s)(1+eps u^2/(1-u)^4) (new control: FE + INT + MULT + N >= 1, zeros off the line)", "TN1 = zeta(s)(1+q^(3/4-s)) (multiplicative, non-negative, no FE, zeros on Re s = 3/4)", "ZQ, NR-q, Proposition W twin (pass multiplicativity on their own atoms / semigroups, by convention)"]),
 "c18-referee-r17-independent-sources": dict(kind="repair", engv="partial", refs=1,
  title="Second referees of round-17 lanes 1, 2, 3, 5 with independent sources; gate for N(theta); E_a row on its own configuration",
  obstruction="Referee lane, no attack. Round-17 lanes u6e, u6f, u3, window law hold with corrections (REFEREE2.md in each; 2 referees each). GATE.md: Theorem 1 holds on form domain C_c^infinity; Remark K (Krein extension) holds for the unwindowed device only, so 'N(theta) iff positive completion' is ARGUED. E_a decided on its own zero configuration at 1e6: kernel 2cosh(a(s-s'))k(s-s'), crossings about 0.229 (theta 0.5, M 0), 0.249 (theta 0.5, M 1), between 0.04 and 0.05 (theta 0.8, M 0): zeta(s+a)zeta(s-a) passes the complete device for small a, so R3 is not met. W4 density form and W5 second bullet ARGUED; DH row not established; Turan and Akhiezer at secondary-source level; W5c new, one referee.",
  okind="referee lane",
  defeat=["zeta(s+a)zeta(s-a) on zeta's ordinates (passes the complete band device for a <= about 0.22 at theta 1/2, a <= 0.04 at theta 0.8)"]),
 "c18-repair-owed-record-r17-open-device-nodes": dict(kind="repair", engv="partial", refs=1,
  title="Record repair: owed list of round 17 (map 208 -> 211 rows), two proposed open device nodes, top-60 before/after",
  obstruction="Record lane, no attack. Map 208 -> 211 rows (P57, G43, Q31); D8 (vi), G33, D10, G42 edited; nine sentence corrections and the c16 ZQ entry entered; cells U3-inequality, U6 (e), U6 (f) closed, U6 (g) tried-not-closed. Two proposed, untested device nodes entered (tz-one-sided-completion-bound-band, exact-relation-rigidity): top 60 open device 0 -> 24, an effect of tagging and the per-device cap, not a finding; 5 of 24 judged usable, rank 1 not. Both proposed types were reported obstructed by sibling lanes of the same round; device states to be set by the next record lane on the referee files.",
  okind="record lane",
  defeat=["not applicable (repair lane)"]),
}
SECOND = ["c17-u6e-bost-connes-non-invariant-state-twin-ladder", "c17-u6f-isogenous-points-norm-jensen-gap",
          "c17-u3-inequality-discontinuity-functional", "c17-window-information-law-ctheta-u5"]
NODES = {"c18-tz-one-sided-bound-fe-reserve-bridge": ["tz-one-sided-completion-bound-band"],
         "c18-tz-band-completion-controls-server": ["tz-one-sided-completion-bound-band"],
         "c18-exact-relation-rigidity-klein-spinor": ["exact-relation-rigidity"]}
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
    if prev.get("claim") and "laneClaim" not in prev: prev["laneClaim"] = prev["claim"]
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=m["refs"], round=18)
    L["heavy"] = r["slug"] == "c18-tz-band-completion-controls-server"
    L["obstructionKind"] = m["okind"]
    if not L.get("nodes") and r["slug"] in NODES: L["nodes"] = NODES[r["slug"]]
    for k, dv in (("nodes", []), ("tags", []), ("obstructionKind", ""), ("serverUnits", [])):
        if not L.get(k): L[k] = dv
    for k, dv in (("restatement", False), ("knownArchitecture", False)):
        if L.get(k) is None: L[k] = dv
    if not isinstance(L.get("lemmasDecided"), int): L["lemmasDecided"] = 0
    L["brokenProved"] = 0
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    rf = os.path.join(os.path.dirname(r["file"]), "REFEREE.md")
    out = {"slug": r["slug"], "round": 18, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
           "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": L.get("obstructionKind", ""),
           "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
           "refereeHolds": holds, "referees": m["refs"], "aboutZeros": bool(r["aboutZeros"]),
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
    e["note"] = "round 18, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
applied = []
for s in SECOND:
    rep = None
    for c in (os.path.join(ROOT, "push", s, "REFEREE2.md"),
              os.path.join(ROOT, "push", "c18-referee-r17-independent-sources", "REFEREE2_%s.md" % s)):
        if os.path.exists(c): rep = c; break
    if s not in bys or rep is None: continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = int(L.get("referees") or 0) + 1
        L["secondReferee"] = {"by": "c18-referee-r17-independent-sources", "outcome": "holds with corrections; no PROVED statement broken",
                              "narrowerForm": "see report and push/c18-referee-r17-independent-sources/GATE.md (window law: Remark K for the unwindowed device only; E_a row decided on its own configuration; W4 density form, W5 second bullet ARGUED)",
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
