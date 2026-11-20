#!/usr/bin/env python3
"""Round 19 learn step. Idempotent. Refereed records (campaign/round19_records.json) replace or append the lines in
campaign/lanes.jsonl; lane metadata is taken from the lane's own line file when present. Writes engine/outcomes/<slug>.json
and the engine/outcomes.json entries; records the second referee of c19-referee-r18-independent-sources on five round-18
lanes from that lane's lanes_records.jsonl (marker secondReferee; brokenProved raised where that file says so).
Device states in engine/curated are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round19_records.json")))
NR = "not run: "
TZ = ["tz-one-sided-completion-bound-band"]
D10 = ["u6g-rank2-eisenstein-gram", "ctrl-bls-symmetric", "ctrl-zq-rational", "ctrl-dh", "ctrl-backward-heat"]
META = {
 "c19-u4-joint-prime-phase-quadratic-dp-zeros": dict(kind="explore", engv="closed", refs=1, broken=0, nodes=[],
  tags=["U4", "joint-prime-phase", "quadratic-log-derivative", "D_P-zeros", "second-order-explicit-formula", "Bohr-equivalence"],
  title="Cell U4 residual: inequalities quadratic in the log-derivative or reading phases at several primes jointly, on zeros of D_P",
  obstruction="Stops at stage A (controls pass); the referee does not hold the lane as written (E1: the Liouville twist fails candidate (J) at p q^2 for P > 12; the lane's check at P = 10 saw only the atom 6); the obstruction stands after that correction. Candidate (J), cross-prime positivity of the pair form from the second-order explicit formula of D_P (Lemma Q2): the read set is 'all atoms in phase', which E_a and DEL satisfy at every step carried out and HQ2 at each P. Lemma N: non-negative coefficients of F^(k)/F force a(n) >= 0, so with the functional equation and pole clause the set is inside Theorem P. Joint phases: K1 (Bohr equivalence at fixed P: every height-uniform limit-stable zero statement on D_P holds for every unimodular chain), K2 (at most 1 + 2T log P/(pi(1-4 delta)) sign patterns emulated below T), K3 (zeta(s)(1+q^(b-s)), q > P, has zeta's D_P: zeros of D_P are blind to primes above P). Any conclusion then needs the functional equation at height t; with INT that is Hamburger's identification and at theta >= 1/2 the target in a window (ARGUED).",
  okind="control-passes: E_a and DEL pass every step of the cross-prime positivity candidate, HQ2 at each P; K1 and K3 make fixed-P statements on D_P shared by every unimodular chain and by zeta(s)(1+q^(b-s))",
  defeat=["E_a = zeta(s+a)zeta(s-a) (passes every step carried out)", "DEL (passes every step carried out)", "HQ2 (passes at each P)", "1/zeta (passes the sign step)", "every unimodular chain (K1: shares height-uniform limit-stable zero statements on D_P at fixed P)", "zeta(s)(1+q^(b-s)), q > P (K3: same D_P)", "fail at a cross-prime step, as intended: non-trivial sign chains at p q, Liouville at p q^2 (P > 12), T-NR at q^2 p or q p", NR+"ZQ, DH, HEAT rows are ARGUED only"]),
 "c19-rs-real-zero-completion-band-server": dict(kind="compute", engv="closed", refs=1, broken=1, nodes=TZ,
  tags=["band-device", "N(theta)", "Riemann-Siegel", "positive-completion", "ZQ", "server", "mode-count"],
  title="Server run: band device N(theta) completed by the sign-change measure of the Riemann-Siegel main sum; defect against the prime-side data, zeta and controls at 1e6 to 1e12",
  obstruction="Registered outcome (b): the device is closed by ZQ. The referee does not hold the lane as written (E1: 'sigma >= 0 for every point set' and 'T_sigma >= 0 on every band' are false as stated; repaired form: on m = 96, 192, 384 modes centred at t_w, T_sigma >= -3e-11 Lg); no number changes and the obstruction stands. Q_D = T_sigma + E, so the device proves only N(theta) with tolerance -lambda_min(E). Under a ZQ exchange the one-sided statistic changes only by the pair form, of size at most u(sinh(u eta)/(u eta) - 1), which vanishes with eta: at tolerance tau Lg an off-line pair with (u eta)^2 below about 6 tau Lg/u is not excluded (eta = 0.01 at 1e9 and 1e12 at the registered tolerance 0.05). MEASURED: zeta's defect 0.036-0.137, 0.008-0.020, 0.0016-0.0052 Lg at 1e6, 1e9, 1e12. The two-sided defect excludes every pair but is the target in the window (ARGUED). No step reads multiplicativity.",
  okind="control-passes: ZQ (eta = 0.01) passes at every mode count with zeta's defect plus a pair form of -0.0015 to -0.0084 Lg; the two-sided statement is target-level",
  defeat=["ZQ eta = 0.01 (passes at every mode count; exchange threshold eta* > 0 in 432 of 432 cells)", "chains, Liouville, DH, E_a, T-NR, HQ2 fail only by missing functional equation, zero or pole location, or size (no step reads multiplicativity)", NR+"DH at 1e12, backward heat, item 5 at (1e12, theta' = 1), direct ball prime sums above X = 1e9"]),
 "c19-hq2-screen-fe-int-mult-pos-devices": dict(kind="combine", engv="closed", refs=1, broken=0, nodes=["exact-relation-rigidity"],
  tags=["HQ2", "HQ3", "HQ4", "screen", "Euler-factor-shape", "pole-clause", "Lemma N", "band-device"],
  title="HQ2 as a screen over 20 device rows that read functional equation + integrality + multiplicativity + positivity",
  obstruction="Screen complete, no device type. Coefficient-level reads (FE, integer frequencies, prime-power support, N >= 0) reject HQ2 only by the pole clause. Three reads reject HQ2 by another step: (a) sign of the log-derivative coefficients at powers of q, removed by the new siblings HQ3, HQ4 (nu >= Lambda, off-line zeros, simple poles at real part 1/2 +- b; Lemma N: under nu >= 0 a real pole right of the factor zeros is unavoidable in the one-prime rational class); (b) local Euler-factor shape at q; (c) complete multiplicativity at q. (b) and (c) are identifications: for finitely many modified primes with rational local factors and zeta's functional equation, geometric local factors force G = zeta (Lemmas S, F, C); within this class they select the same twins as the pole clause. Infinitely many modified primes: open. Band devices N(theta), W, C(theta) see HQ2 only through Z_q - P_q (distance of zeros and pole lattice). Rows 10, 11, 12, 18 (spinor S, D10 among them) are ARGUED, not run.",
  okind="control-passes: HQ2 passes every coefficient-level read except the pole clause; HQ3 and HQ4 pass local positivity; local-shape reads are identifications of known type, not reads inside the strip",
  defeat=["HQ2 (passes N(theta) at M = 1 in 384 of 384 cells with theta <= 0.85, zeros up to 0.10 off the line)", "HQ3, HQ4 (new controls: nu >= Lambda, off-line zeros, real poles right of the zeros; pass log-derivative positivity)", NR+"D10 Gram form and spinor S on HQ2"]),
 "c19-dp-zero-census-truncation-identity-server": dict(kind="compute", engv="partial", refs=1, broken=0, nodes=TZ,
  tags=["D_P-zeros", "truncation-identity", "Theorem A", "ball-arithmetic", "census", "depth-phase-covariance", "approximate-functional-equation", "server"],
  title="Server run: certified zero census of partial sums D_P, Theorem A in ball arithmetic, joint prime-phase statistics for zeta and control classes",
  obstruction="No survivor statistic. Theorem A holds with constant -u for every a_1 = 1, a_P != 0 (certified truncations to T = 6400, six series; tail (u - 2 log|a_P|)/(pi T); the limit T -> infinity is extrapolated, not enclosed). MEASURED (float64, 2340 windows, 1e4..1e8): every class has zeros of D_P right of the line in every window, so completion C1 is false. At P = floor(t/2pi) the right zeros of zeta's D_P satisfy zeta = F chi (Fresnel weight, F(0) = 1/2): the zero set is a function of zeta near the line, so every statistic of that list is shared by the Laplace-truncated ZQ sum. Below that length zeta's census and both statistics sit inside the Haar ensemble. Pair covariance separates nothing; depth-phase covariance separates zeta from sign chains at theta' = 1 only. Proposition Z not tested.",
  okind="control-passes: ZQ shares the right-zero list of D_P at theta' = 1; below theta' = 1 zeta is inside the Haar ensemble of unimodular chains",
  defeat=["ZQ (Laplace-truncated; nearly the same right-zero list as zeta at theta' = 1)", "Haar unimodular chains (zeta's census and statistics inside the ensemble at theta' < 1)", "every class has right zeros of D_P in every window (completion C1 false for zeta as well)", NR+"Proposition Z; enclosure of the T -> infinity limit"]),
 "c19-u6c-double-cover-k3-run": dict(kind="deepen", engv="closed", refs=1, broken=0, nodes=[],
  tags=["U6c", "GL(3)", "double-cover", "K3", "genus-sums", "Siegel", "Maass", "7/8-adjacent"],
  title="Cell U6 (c), double-cover half: (K3) as a 2 x 2 product test on genus-sum arrays of <1,1,d>",
  obstruction="Registered outcome (i): cell U6 (c) closed as global period data without a Hecke relation. For primes p = q = 1 mod 8 with (p/q) = 1 the genera of <1,1,d>, d in {1,p,q,pq}, interchange local similarity classes at every place (proved), so a product-form array has K(G_1)K(G_pq) = K(G_p)K(G_q). The identity fails for the Eisenstein input (ball arithmetic, 132 of 132 cells, conditional on class-list completeness) and for the cusp input (float64, 14 of 14 quadruples, at least 2596 error bars); Delta takes both signs for both inputs, Eisenstein and cusp are not separated: no inequality, no device type. The reading for Whittaker functionals on the cover rests on Jacquet's correspondence (RECALLED, not established).",
  okind="no-new-object: no product structure, no sign, Eisenstein and cusp rows not separated; zeta controls do not lift",
  defeat=["Eisenstein input (same failure of the product identity as the cusp input; both signs)", NR+"zeta controls have no lift to the cover; second cusp form (first even Maass form)"]),
 "c19-d10-xd-determinant-pole-term-lemma-q": dict(kind="deepen", engv="partial", refs=1, broken=0, nodes=D10,
  tags=["deepen", "u6g", "rank2", "row-D10", "X(d)", "NL(d)", "bezoutian", "inertia", "rational-model"],
  title="Row D10: X(d) for general even d through the pole term (Bezoutian product Q = L (x) L, sign-free kernel N+)",
  obstruction="Tried, not closed. Failing step: in general position neg(N) is read on 2d+1 crossing points of the pole lines, and 2d of those points are null exactly at symmetric sets. The pole is rank one on the Bezoutian L but rank 2d on L (x) L, so no rank-one or rank-two update exists. PROVED (one referee): c18's term X vanishes; N and N+ are halves of Q on Q-orthogonal subspaces; Q has inertia (d^2+1, 2d), so neg(N) + neg(N+) + z <= 2d; X(d) follows from NL(d) (N+ has d negative squares on the pole line). X(d) and NL(d) hold exactly at 224 symmetric configurations (d = 6..16); open for general d. The row cannot score whatever X(d) gives (symmetric off-line quartets pass, c18).",
  okind="open-step: NL(d) for general d (d negative squares of a one-variable three-term kernel); model sense only",
  defeat=["symmetric off-line sets (pass; exact at 224 configurations, d = 6..16)", "pole removed (positive in 60 of 60)", "non-symmetric sets follow the deficit count (60 of 60)"]),
 "c19-referee-r18-independent-sources": dict(kind="repair", engv="partial", refs=1, broken=0, nodes=[],
  tags=["referee", "second-referee", "round-18", "Turan", "mode-count"],
  title="Second referees of round-18 lanes 1, 2, 3, 4, 6 with independent sources; source for Turan's theorem; referee for W5c",
  obstruction="Referee lane, no attack. Five round-18 lanes hold with corrections (REFEREE2-*.md; 2 referees each; partial scope: D10 through Theorem Q's conclusion at fresh points, tz bridge through Theorem A only, tz server on 30 zeta cells). Truncation identity: constant -u, no log|a_P| term. Form C negative at 48, 96, 192 modes; zeta's Form D margin at 192 modes is 0.28 to 1.0 of the 96-mode value. Turan's second main theorem with factor 2 and 8e: Theorem K.3 of the Montgomery-Vaughan MNT III draft; Ten Lectures not opened.",
  okind="referee lane", defeat=["not applicable (referee lane)"]),
 "c19-repair-owed-record-r18-checkpoint-prep": dict(kind="repair", engv="partial", refs=1, broken=0, nodes=[],
  tags=["record", "owed", "device-states", "map", "checkpoint-r20"],
  title="Record repair: owed list of round 18 (device table 55/1/0, map 211 -> 215 rows + HQ2), input for the round-20 checkpoint",
  obstruction="Record lane, no attack. Both proposed device types closed (device table 55 closed / 1 floored / 0 open); map 215 rows (X1, P58, G44, Z37) plus control HQ2; corrections of display (A), Proposition D (c), D10 parity clause; STRATEGY 3.1 items 48-58; top 60 had 0 entries on a proposed node before and after; CHECKPOINT_R20_INPUT.md lists 12 Statement O lines still MEASURED or ARGUED.",
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
    if prev.get("claim") and "laneClaim" not in prev: prev["laneClaim"] = prev["claim"]
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=m["refs"], round=19)
    L["heavy"] = r["slug"] == "c19-rs-real-zero-completion-band-server"
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
    out = {"slug": r["slug"], "round": 19, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
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
    e["note"] = "round 19, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written", m["obstruction"][:300])
applied = []
sp = os.path.join(ROOT, "push", "c19-referee-r18-independent-sources", "lanes_records.jsonl")
for l in open(sp):
    if not l.strip(): continue
    s2 = json.loads(l); s = s2["slug"]
    if s not in bys: continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = max(int(L.get("referees") or 0) + 1, 2)
        L["secondReferee"] = {"by": "c19-referee-r18-independent-sources", "outcome": "holds with corrections",
                              "note": s2.get("secondRefereeNote", ""), "report": s2.get("secondReferee")}
        L["brokenProved"] = max(int(L.get("brokenProved") or 0), int(s2.get("brokenProved") or 0))
    fp = os.path.join(OD, s + ".json")
    if os.path.exists(fp):
        o = json.load(open(fp)); o["referees"] = L["referees"]; o["secondReferee"] = L["secondReferee"]; o["brokenProved"] = L["brokenProved"]
        json.dump(o, open(fp, "w"), indent=1, ensure_ascii=False)
    applied.append((s, L["referees"], L["brokenProved"]))
tmp = lp + ".tmp"
with open(tmp, "w") as f:
    for d in old: f.write(json.dumps(d, ensure_ascii=False) + "\n")
os.replace(tmp, lp)
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", len(old), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng), "second referees:", applied)
