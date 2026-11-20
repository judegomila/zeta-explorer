#!/usr/bin/env python3
"""Round 17 learn step. Idempotent. Refereed records (campaign/round17_records.json) replace or append the lines in
campaign/lanes.jsonl; lane metadata is taken from the lane's own line file in its slug directory when present. Writes
engine/outcomes/<slug>.json and the engine/outcomes.json entries; records the second referee of
c17-referee-r16-lemma-h-sources on round-16 lanes 1, 3, 4, 5, 6 (marker secondReferee). Device states in engine/curated
are not edited."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round17_records.json")))
NR = "not run: "
META = {
 "c17-u6e-bost-connes-non-invariant-state-twin-ladder": dict(kind="explore", engv="closed", refs=1,
  title="Cell U6 (e): positivity of non-invariant states on the Bost-Connes algebra against the twin ladder",
  obstruction="Stops at the first lemma (stage A not passed). Lemma G (classical): omega -> omega(b* . b)/omega(b* b), b invertible, maps states to states in the same GNS representation; T-NR (b = D^(1/2)), finite DEL and the gauge twins have this form, so positivity of a state cannot separate them from zeta; only an exact relation can. Lemma E: mu*-eigenstates exist for every Re s > 0 and read n^-conj(s), m^-s and finitely many local factors, or L(beta, chi)/zeta(beta) at real beta > 1. Lemma K: kernels <xi_w, X xi_s> read zeta at real part > 1 only. Lemma T: two eigenstates on Re s = beta/2 are at norm distance 2 sqrt(1 - |zeta(beta+i tau)|^2/zeta(beta)^2) for beta > 1 and exactly 2 for beta <= 1, so for beta <= 1 no function of tau remains. No step leaves the region right of 1 (R4), none uses multiplicativity beyond the convergent Euler product. Open: states cut out by other exact relations; normal states of the type III_1 factor beyond the three families; the norm closure. Residual = Weil-form weights (rows P1, G21).",
  defeat=["T-NR in conjugation form b = D^(1/2) (state positivity invariant, Lemma G)", "finite DEL (passes every step)", "E_a (passes every step)", "gauge twins, THIN, U (same norm-distance law)"]),
 "c17-u6f-isogenous-points-norm-jensen-gap": dict(kind="deepen", engv="closed", refs=1,
  title="Cell U6 (f): norm, Jensen gap and discriminant of the p^2+p-2 complex isogenous points of theta",
  obstruction="Cell U6 (f) closed for three non-linear reads. Norm = theta(x)^(p^2+p)/(theta(x/p^2) theta(p^2 x)) (PROVED): a dilation-module identity with Mellin multiplier p^2+p-p^(2u)-p^(-2u) on zeta(u)zeta(u+1), so the read is a pointwise function of dilates. Jensen gap < 0 on the whole arc, limit log(p/(p+2)) (PROVED from the sum identity, the norm identity and monotonicity). Discriminant sign = parity (-1)^((p+2)(p-1)/2) for every real function (CLASSICAL). The Epstein control theta(x)theta(nx), n = 5, 6, passes all three at inert primes (PROVED), so R3 fails; zeta enters M[J_p] only additively at relative size 1e-10.5 to 1e-15 at t = 200 (MEASURED, not enclosed). Left open: symmetric functions of degree >= 3 of the point values, no candidate inequality.",
  defeat=["Epstein theta(x)theta(nx), n = 5, 6, at inert primes (passes all three reads; proved)", "every function with real coefficients (discriminant sign)", "T-NR twins fail the norm identity and J<0 at p = 3, 11 (rejected, but through an identity, not a zero read)", NR+"several controls not run or not formulable"]),
 "c17-u3-inequality-discontinuity-functional": dict(kind="combine", engv="closed", refs=1,
  title="U3 as an inequality: the discontinuity functional from Theorem P, Proposition M and ZQ in three relaxation directions",
  obstruction="Target-level in all three relaxation directions; multiplicativity enters no proved step. PROVED: (1) the functional-equation defect enters Theorem P at Step 6 as int sinc^2 against the off-integer part of N, Lipschitz with constant 0.0485883; (2) Proposition W: zeta(s)(q^(s-1/2)+c+q^(1/2-s))/(2+c), q = 1+delta, has the exact functional equation, pole at 1 only, N >= 0, atoms within delta of log n, and zeros on Re s = 1/2 +- b for every b > 0 from height pi/log(1+delta), so relaxing the support clause by any delta loses everything; (3) Lemma LR: a local-root bound |alpha| <= q^(1/2+delta) is the statement that the factor's own zeros are within delta of the line; NR-q is multiplicative on its semigroup and fails only through integrality; (4) any inequality 'zeros within f(defect), f(0) = 0' on a class containing zeta at defect 0 is the target. MEASURED (float64, symmetrised model): minimal defect admitting a quartet >= 0.047 below height 131; multiplicative class and relaxation agree within 1.0004 to 1.23. The sqrt law is the discriminant of a function real on the line. Not done: unconstrained LP at X = 4000; pairs with gap d < 0.18.",
  defeat=["zeta times symmetric T-NR at q = 1+delta (exact FE, N >= 0, zeros at any distance b)", "NR-q (multiplicative on its semigroup; cannot be excluded through multiplicativity by any functional)", "ZQ (reach sqrt(eps) from reality on the line)", "n^alpha shift (linear mechanism hidden by the symmetrised model)"]),
 "c17-rank2-gram-symmetric-blaschke-closure": dict(kind="compute", engv="partial", refs=1,
  title="Closure of the rank-2 Eisenstein Gram form (row D10) under symmetric Blaschke insertions: Lemma M, Theorem T and a certified search",
  obstruction="Tried, not closed: closure neither proved nor refuted. PROVED: Lemma M (T-derivatives of K_T are rank-one Maass-Selberg Gram kernels; chamber positivity reduces to the apex T = 0 under rank-one positivity for t >= 0); Theorem T / Corollary T1 (rational model M_0 = (u+1)/(u-1) times two zeros: apex kernel is an explicit 3 x 3 form whose negative index = number of left zeros without a reflected partner). MEASURED: 1,397,025 Gram matrices (47% uniform sample of the registered plan) plus 5,208 of order 64 and 96 certified positive for zeta times symmetric insertions, 0 failures; inertia law for zeta's M on 16 configurations. The apex kernel reads only the reflection a -> 1-a of the left zeros, not the critical line; with a pole-free DH base it detects neither reflection nor real-zero parity defects. OPEN: the inertia law for zeta (symmetric quartet in the rational model, then transfer through Lemma D); the range of T in the source (Miller math/0006058 Thm 6.1).",
  defeat=["ZQ in rational form (passes; 3,360 certified matrices; the c16 table row saying it fails is wrong)", "DH at low height (passes)", "backward heat t = -1 (passes at low height, non-rigorous)", "symmetric Blaschke insertions of order 2 to 20 (pass; 0 failures)"]),
 "c17-window-information-law-ctheta-u5": dict(kind="deepen", engv="closed", refs=1,
  title="Window information law: every band-u positivity device as the quadratic form of one operator T_Z (replaces rows S12b, Q30, P45 addendum)",
  obstruction="A band-limited positivity device has a density reach, not a zero-free region. PROVED (one referee): the complete band-u device is the quadratic form of T_Z on L^2 of an interval of length u (classical Weil/Yoshida frame; C(theta) tests modulated indicators only); n off-line pairs give exactly n negative directions; one pair against an on-line background alpha is invisible exactly up to sinh(ub)/(ub) = 1 + (alpha+2M)/u; rows of spacing <= 2pi/u pass with any offset; above u = log(t/2pi) (lattice model) only the exact device M = 0 excludes every finite cluster, and that is the target in a window; one cluster satisfies u b_max <= 5.85 n + logs relative to Turan. The truncated Euler product identity holds for every completely multiplicative chain and no step uses it (R1 fails). MEASURED: tapered rows pass with slope 0.44 per pair. Not established: density form of W4, sequence form of W5, the DH and zeta(s+a)zeta(s-a) rows as written; the count-preserving threshold theta' = 1/2; the constant of the linear law between 0.445 and 5.85.",
  defeat=["rows of off-line pairs at spacing <= 2pi/u (pass with any offset; proved)", "tapered half-Nyquist rows (pass, slope 0.44 per pair; measured)", "zeta(s+a)zeta(s-a) (passes for theta' <= 1 in the lattice model)", "every completely multiplicative chain (shares the truncated Euler product identity)"]),
 "c17-u8-restricted-search-lemma-h-gated": dict(kind="compute", engv="closed", refs=1,
  title="Restricted U8 search on dictionary DU (three or more monomials of distinct heat exponents), gated on Lemma H",
  obstruction="Registered outcome 'none' (MEASURED, finite): 0 hold-out survivors on dictionary DU (minors of orders 5 and 6, sign and thresholded; three-term Turan forms on 5 and 6 nodes; K3 on [-4,4], Kpol on [-3,3]; lifts T-NR, E_a, HEAT with |tau| <= 0.005; thresholds scanned). Lane prefix 1,966,200 family-nodes; with the referee's completion of the cut streams 4,360,000 family-nodes, 1,923 T-train (all T6 Kpol, thresholds within 1e-6 relative of zeta's value, best hold-out score 15 of 23), 0 undecided; 0 of 160,000 K3 sign minors reject a training HEAT member. Five two-class {T-NR, HEAT} passes are identifications (threshold within 2e-52 or 2e-161 relative of zeta's value; E_a not rejected). T3/T6 exclusions are float64 except 11,915 ball decisions; minors are ball decisions. Controls beyond the three canonical lifts not run.",
  defeat=["HEAT at |tau| <= 0.005 (0 of 160,000 K3 sign minors reject it)", "E_a (not rejected by the two-class passes)", "held-out T-NR / characters (best hold-out score 15 of 23)"]),
 "c17-referee-r16-lemma-h-sources": dict(kind="repair", engv="partial", refs=1,
  title="Second referee of Lemma H (gate for the U8 search), second referees of round-16 lanes 1, 3, 4, 5, 6, and two source checks",
  obstruction="Referee lane, no attack. Lemma H holds (third derivation; 732 + 3,836 ball decisions, 0 disagree). Round-16 lanes 1, 3, 4, 5, 6 hold with corrections; no PROVED statement broken. Corrected: u6g E_a row (residue at 1-a negative; E_a fails at the pole 1+a through the zero rho-a and at the pole 1-a through the zero rho+a); ctheta log log coefficients 2/(1-kappa) and 4/(1-kappa); DN 'status in balls 22,508' is float64 status (500 of 500 sampled nodes agree in balls). Not done: Turan's second theorem (8e form) confirmed at secondary-source level only; the Lemma H ball test checks the case analysis, not the identification of the heat lift; nine sentence corrections not applied in lane files.",
  defeat=["not applicable (referee lane)"]),
 "c17-repair-owed-record-r16-cell-nodes": dict(kind="repair", engv="partial", refs=1,
  title="Record repair: eleven silent-* nodes as cells, map 205 -> 208 rows (D10, P56, G42), STRATEGY 0b / 3.1 / 4.0, S2 disposition",
  obstruction="Record lane, no attack. The eleven silent-* nodes are cells (U2-POS closed, U6 (g) tried-not-closed, nine cells) with no device weight in generate.py; top 60 with an open device 57 -> 0, floored only 3 -> 60, so the generator cannot name the next explore slot. Map 205 -> 208 rows. Not done: nine of eleven corrected sentences remain in lane files outside the edit scope (in the map and campaign/CORRECTIONS_R16.md); row G42 carries '394 of 528' without its referee's restriction; the literature line is one unlogged search and is not evidence about new preprints.",
  defeat=["not applicable (repair lane)"]),
}
SECOND = ["c16-u6g-scattering-fe-rank2-bridge-stage-a", "c16-ctheta-proposition5-power-sum", "c16-qa-filter-silent-cells-geometric-nodes",
          "c16-dn-canonical-tier-ball-conversion", "c16-amplifier-below-truncation-eisw-compute"]
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
    L.update(kind=m["kind"], refereeHolds=holds, referees=m["refs"], round=17)
    L["heavy"] = r["slug"] == "c17-rank2-gram-symmetric-blaschke-closure"
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
    out = {"slug": r["slug"], "round": 17, "kind": m["kind"], "nodes": nodes, "tags": tags, "verdict": r["verdict"],
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
    e["note"] = "round 17, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
applied = []
for s in SECOND:
    rep = None
    for c in (os.path.join(ROOT, "push", s, "REFEREE2.md"),
              os.path.join(ROOT, "push", "c17-referee-r16-lemma-h-sources", "REFEREE2_%s.md" % s)):
        if os.path.exists(c): rep = c; break
    if s not in bys or rep is None: continue
    L = old[bys[s]]
    if not L.get("secondReferee"):
        L["referees"] = int(L.get("referees") or 0) + 1
        L["secondReferee"] = {"by": "c17-referee-r16-lemma-h-sources", "outcome": "holds with corrections; no PROVED statement broken",
                              "narrowerForm": "see report; nine sentence corrections listed in push/c17-referee-r16-lemma-h-sources/RESULT.md section 2.3 (not applied in lane files)",
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
