#!/usr/bin/env python3
"""Round 16 learn step. Idempotent. Refereed records (campaign/round16_records.json) replace or append the lines in
campaign/lanes.jsonl; lane metadata is taken from the lane's own line file in its slug directory when present. Writes
engine/outcomes/<slug>.json and the engine/outcomes.json entries; records the second referee of
c16-referee-r15-j1prime-u8-screening on round-15 lanes 1 to 6 (marker secondReferee). Device states in engine/curated
are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round16_records.json")))
NR = "not run: "
META = {
 "c16-u6g-scattering-fe-rank2-bridge-stage-a": dict(kind="explore", engv="closed", refs=1,
  title="Cell U6 (g): Gram positivity of truncated rank-2 (SL3 minimal parabolic) Eisenstein data read off the zero set",
  obstruction="Stops at stage A. Relative to the recalled rank-2 Langlands inner product formula (checked for M = 1 against the direct integral; source not opened), Gram positivity adds one condition to rank one: a zero of M with 0 < Re a < 1/2 forces a zero at 1 - a (Lemma R, PROVED), which is the functional equation of the zero set. Symmetric Blaschke insertions (zeta times a symmetric polynomial, with f(z) = f(1-z); T-NR is the infinite case) and non-real conjugate pairs right of 1/2 pass at every tested T >= 0 (MEASURED twice: about 4,700 matrices of order up to 5; order-7 matrices and 3,960 residue-form values per case; closure not proved). A single real inserted zero right of 1/2 fails (referee E1; the BLS-right row is restricted to non-real conjugate pairs). At a hypothetical off-line pair the form (*) is height-independent and positive for every eta: no contradiction. DH passes on 400 low-height diagonals and is not shown to fail.",
  defeat=["BLS with a symmetric zero set / polynomial ZQ (passes; has f(z) = f(1-z); measured, closure not proved)", "T-NR (infinite symmetric case)", "BLS with non-real conjugate pairs right of 1/2 (passes; measured)", "DH (passes on 400 low-height diagonals; not shown to fail)"]),
 "c16-pos-fe-u2-positivity-rigidity": dict(kind="deepen", engv="closed", refs=3,
  title="Lemma POS-FE: zeta's functional equation, pole at 1 only, finite order and non-negative coefficients on [1, inf) force G = r zeta (Theorem P)",
  obstruction="An identification, not a statement about zeros. Theorem P (PROVED; three independent referees hold): G = int_[1,inf) x^-s dN, N >= 0, (s-1)G entire of finite order, zeta's functional equation => G = r zeta, by Poisson-summation rigidity (triangle / sinc^2 test function; the one-dimensional LP-bound equality case; classical in content). nu = Lambda_G >= 0 enters only through N >= 0; no multiplicativity is used. Each hypothesis is necessary (ZQ: sign; symmetric T-NR: mass below 1; G_+: extra poles). The registered quantitative form implies RH trivially (apply it to zeta), so it is target-level. The {FE, POS} class closes as an identification row in U3, score 0. Not surviving: the Hecke G(lambda), lambda > 2 corollary (frequency formula inverted).",
  defeat=["not applicable as a device (identification: the class contains only r zeta)", "ZQ (shows the sign hypothesis is necessary)", "symmetric T-NR (shows 'no mass below 1' is necessary; constant 1 sharp)", "G_+ (shows the pole clause is necessary)"]),
 "c16-ctheta-proposition5-power-sum": dict(kind="deepen", engv="closed", refs=1,
  title="Proposition 5 of c15 (C(theta) against a zero-free region) decided for arbitrary configurations by Poisson rows and Turan power sums",
  obstruction="C(theta) is not a zero-free region. A positivity statement at P = t^theta reads only the band-limited part (frequencies <= theta log t) of the zero measure. PROVED in window form: a lattice row of spacing 2pi/(theta log 2T) contributes the constant 2pi/d for every u <= theta log 2T and every offset b (within the Riemann-von Mangoldt density only for theta < 1/2). PROVED given Turan's second main theorem (recalled, not opened): an isolated cluster of n pairs has b_max <= (c n + O(log log gamma))/(theta log gamma), c between 5.85/(1-kappa) and 15.1. MEASURED in balls: the linear growth in n is attained (cos^2 rows, n >= about 2.2 u b_max); clusters of 3 to 40 quadruples on zeta's ordinates at 1e6-1e9 pass outside the region for theta = 1 and at the strip edge for theta = 1/2. The region gives C(theta') only with M of order log^2 t. No step uses multiplicativity. The all-heights form of the row failure is measured, not proved.",
  defeat=["lattice rows of off-line pairs (T-NR at variable q; invisible on the window, proved)", "tapered cos^2 rows and clusters of 3 to 40 quadruples (pass outside the region; measured in balls)", "ZQ (passes in the window with 3 or more quadruples)"]),
 "c16-qa-filter-silent-cells-geometric-nodes": dict(kind="combine", engv="closed", refs=1,
  title="Filter Q-P / Q-B / Q-S / Q-A / HEAT over the silent cells U3, U4, U6, U8 and 71 geometric-program nodes",
  obstruction="Lemma QA (PROVED): a step reading only the functional equation, poles, order, zero count up to O(1) and prime-power atoms is passed by ZQ; twist families by NR-q at every lift value. ZQ passes strict compact certificates and heat-box certificates (t >= 0) once the removed pair is high; M_ZQ is Schur. Cell table (one reader): 16 rows; no passing control on file for U3 as an inequality, the U4 residual, U6 (c), (e), (f). Node table: 71 nodes, 31 target-level, 25 passed by ZQ (3 under an unestablished margin), 12 by a recorded control, 3 other; no node is an explore candidate. A critical-line step must be discontinuous in the coefficient measure at zeta (margin zero; reach 0.48 sqrt(eps) in sup norm). Sign searches on compact parameter sets (U8, DN canonical tier) sit inside the flow-blindness wall. Not surviving: the reach in the norm p; the additive-carrier pattern for the U4 residual.",
  defeat=["ZQ (atom-only steps, strict compact certificates, heat-box certificates, Schur carrier)", "NR-q (twist families, every lift value)", "HEAT at small |tau| (compact-parameter sign searches)", "recorded controls on 12 nodes"]),
 "c16-dn-canonical-tier-ball-conversion": dict(kind="compute", engv="closed", refs=1,
  title="Ball-arithmetic conversion of the 67,138 float64-undecided canonical-tier nodes of dictionary DN and draw-stage recount of DJ",
  obstruction="Registered outcome 'none' (MEASURED). On the registered c15 node set of dictionary DN, canonical tier {T-NR, E_a, HEAT}: 67,138 float64-undecided family-nodes decided in balls (360 reflection-identity; 37,634 excluded with HEAT not rejectable; 29,144 T-train; 0 undecided); 0 hold out under the c15 rule or the threshold-scanned read. The 22,508 float64 T-train nodes keep float64 status (not ball-confirmed; referee correction 1); 86 b2-with nodes pass the threshold-scanned hold-out and are refuted on the positive side (75 to 93 of 350 primitive characters of conductor up to 60 on the controls' side). DJ canonical lifts: 59 T-train, 0 full, 15,351 open rows excluded. Not re-read in balls: FE tier of DN, quotient minors, product families.",
  defeat=["HEAT (never rejectable in second differences with polar terms)", "held-out T-NR at larger split primes (stays on the positives' side where the training classes are rejected)", "primitive characters of conductor up to 60 (75 to 93 of 350 on the controls' side for the 86 threshold-scanned nodes)"]),
 "c16-amplifier-below-truncation-eisw-compute": dict(kind="compute", engv="closed", refs=1,
  title="Hecke amplifiers with T < N on the truncated Eisenstein series: closed Gram formula and gain against N^delta, with EIS-w",
  obstruction="Family 31 item 'T < N': measured obstruction on the stated range, not a proved closure. PROVED: T_m Lambda^T f = lambda(m) f minus pseudo-Eisenstein series cut at heights Td/a; coset c enters the pairing of cuts h_i, h_j iff c^2 h_i h_j < 1; closed Gram formula (G) for all T >= 1, N; R2 = 1 for T >= N; R2 <= M/L. MEASURED (arb balls): G_opt < N^delta at on-line zeros for T <= 4, N <= 128, gamma <= 541 and in 463 formal rows; crossing factor within [0.987, 1.0094]. Registered prediction R2 <= 1 FAILED for T < N (sup 1.04 to 1.46, float64), also at EIS-w points, so no structural separation. OPEN: G_opt <= N^delta for all N with T < N; large-height small-delta regime; boundedness of M/L. The registered stage-A clause fired literally and was set aside by the lane; disposition is a planner decision.",
  defeat=["EIS-w (exceeds N^delta in 394 of 528 rows; shows the same R2 excess; obeys the same comparator)", NR+"BLS, T-NR, DH on the T < N amplified norm"]),
 "c16-referee-r15-j1prime-u8-screening": dict(kind="repair", engv="partial", refs=1,
  title="Second referee of round-15 lanes 1 to 6, Lemma J1', the U8 heat-inheritance exclusion (Lemma H), control ZQ, and a screening sample",
  obstruction="Referee lane, no attack. Round-15 lanes 1 to 6 hold with corrections; no PROVED statement broken. Lemma J1' holds. Lemma H (two derivations): for a real kernel without polar terms a monomial bound M <= lam is inherited by every tau < 0 iff lam*S >= 0 or M*lam <= 0, otherwise exactly for |tau| <= 4|log(lam/M)|/|S|; so the HEAT column of a polynomial functional is fixed by zeta's own values and a finite-node inequality with positive margin passes all small |tau|. A U8 search is admissible only restricted (three or more terms with distinct S_j, tau* column). Control ZQ confirmed on a third zero pair. Screening sample: Haar variance 1.5905 (not 1.63); 'four kinds of separation' false as worded; eleven false sentences listed, not applied. DH recomputed to T = 1e4 only.",
  defeat=["not applicable (referee lane)"]),
 "c16-repair-owed-record-r15": dict(kind="repair", engv="partial", refs=1,
  title="Record repair: map 202 -> 205 rows, control rows ZQ / SG / NR-q, 30 label restrictions, engine device states, Statement O version 4",
  obstruction="Record lane, no attack. Map 202 -> 205 rows (S12b, Q30, G41) plus control rows ZQ, SG, NR-q; 30 label restrictions and dated notes entered; engine devices 53 closed / 1 floored / 11 open, controls 23, pending 7; Statement O version 4 written. Referee correction E1: the eleven silent cells were entered with device state 'open', which engine/generate.py scores as an open crossing device (weight 2, exemption from two -3 penalties); 57 of the top 60 candidates now stand on those nodes, so the current top 60 is an effect of that state and not a ranking of leads. Row G41 still says the canonical tier is NOT CLOSED and needs the c16 DN result.",
  defeat=["not applicable (repair lane)"]),
}
SECOND = ["c15-edge-argument-strip-width-hecke-amplified", "c15-control-with-zeta-fe-classes-u1-u2", "c15-u5-window-count-threshold-translate-control",
          "c15-u7-growing-section-twin-ladder-bridge", "c15-nonhomogeneous-pair-triple-kernel-search", "c15-klein-transport-lemma-w-stage-a-and-e1"]
def lane_line(slug):
    d = os.path.join(ROOT, "push", slug)
    for fn in ("lanes.jsonl", "lane_line.json", "lanes_line.json"):
        p = os.path.join(d, fn)
        if not os.path.exists(p): continue
        t = open(p).read().strip()
        try: x = json.loads(t)
        except Exception: x = [json.loads(l) for l in t.splitlines() if l.strip()]
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
    if prev.get("claim"): prev["laneClaim"] = prev["claim"]
    L = dict(prev); L.update(r)
    L.update(kind=m["kind"], refereeHolds=holds, referees=m["refs"], round=16)
    L["heavy"] = r["slug"] == "c16-dn-canonical-tier-ball-conversion"
    for k, dv in (("nodes", []), ("tags", []), ("obstructionKind", ""), ("serverUnits", [])):
        if not L.get(k): L[k] = dv
    for k, dv in (("restatement", False), ("knownArchitecture", False)):
        if L.get(k) is None: L[k] = dv
    if not isinstance(L.get("lemmasDecided"), int): L["lemmasDecided"] = 0
    L["brokenProved"] = 0
    if r["slug"] in bys: old[bys[r["slug"]]] = L
    else: old.append(L); bys[r["slug"]] = len(old) - 1
    nodes, tags = L["nodes"], L["tags"]
    out = {"slug": r["slug"], "round": 16, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
           "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": L.get("obstructionKind", ""),
           "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
           "refereeHolds": holds, "referees": m["refs"], "aboutZeros": bool(r["aboutZeros"]),
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
    e["note"] = "round 16, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
applied = []
RD = os.path.join(ROOT, "push", "c16-referee-r15-j1prime-u8-screening")
for s in SECOND:
    rep = os.path.join(RD, "REFEREE2_%s.md" % s)
    if s not in bys or not os.path.exists(rep): continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = int(L.get("referees") or 0) + 1
        L["secondReferee"] = {"by": "c16-referee-r15-j1prime-u8-screening", "outcome": "holds with corrections; no PROVED statement broken",
                              "narrowerForm": "see report; eleven corrected sentences listed in push/c16-referee-r15-j1prime-u8-screening/RESULT.md (not applied)",
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
