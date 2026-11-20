#!/usr/bin/env python3
"""Round 7 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent.
Also: (a) node sets of the six earlier outcome records whose only node was map-open-1 get their own out-node as second
member, so the open device map-open-1 is no longer rejected by the generator; (b) the two round-6 records whose referee
did not hold get engineVerdict = open (read by merge_outcomes.py since round 7)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round7_records.json")))
NR = "not run: "
META = {
 "c7-liou-high-row-bound": dict(kind="combine", nodes=["out-c4-thin-twist-control-78"], okind="low-half-missing-term-is-hermitian-form-in-weight", lemmas=1,
   tags=["seven-eighths","control","sign-twist","liouville","thin","sextic-theta","periodicity","row-bound","second-moment"],
   title="Row bound (5.36) for the Liouville weight and class-regular THIN (LIOU-HIGH)",
   obstruction="Partial. Proved: for Liouville rows in one ray class mod f_0, N = D + P + Rem with P a sum of non-negative terms of order M^(5/6) X^(1/3). The failure of the Liouville analogue of (5.36) by Z^(1/6) at M = X = Z rests on Rem << (MX)^eps (M + X + X^2/M), which is ARGUED relative to a recalled second-moment bound for sextic Hecke L-functions (contour step not written); the data to Z = 2^14 do not decide the exponent. THIN stops at conductor-uniform bounds (T1, T2) for the thin Euler product left of b. The term is a Hermitian form in the weight (present for non-multiplicative weights), so this half carries neither R1 nor R4.",
   defeat=["non-multiplicative weights (the excess term kappa |m_w|^2 is a Hermitian form in the weight; no multiplicativity used)","iid signs and weight 1 (no excess, as predicted)","THIN undecided (needs T1, T2)", NR+"DH, heat, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w"]),
 "c7-uncompensated-high-side-normaliser": dict(kind="combine", nodes=["out-c6-marks-bc-manuscript-check","out-c6-unreflected-marks-kd23"], okind="marked-row-energy-contains-squared-signal", lemmas=1,
   tags=["seven-eighths","effective-order","prime-marks","normaliser","sextic-theta","linear-program","circular","manuscript-check"],
   title="Uncompensated high side from MS (12.5)/(16.1) with the normaliser kept",
   obstruction="Dropping the compensation costs l*delta/2 on the high side and changes neither the signal nor the normaliser H_eta. Vertices with 1 < h <= 3 exist on the cone (t, t, 2t-1), but their single low input (K + D energy bound for coherent marked rows) implies their conclusion: marks are coherent at sixth-power frequencies, so the row energy contains the squared signal and B_low >= beta* for M >= 1 + l (Lemma C, ARGUED: needs control of non-sixth-power dual frequencies). The high-side line beyond the slot term S_i is ARGUED in the ideal model. Factorisation (10.18) holds only for Re s > (2 + theta_omega)/5, unconditionally Re s > 3/5.",
   defeat=["not a control question: statement inside the 7/8 estimate system (holds for any target)", NR+"all controls"]),
 "c7-probe-format-h-cap": dict(kind="deepen", nodes=["map-open-1","out-c5-target-fe-order2-ledger"], okind="k-loss-is-hilbert-schmidt-floor-cap-one-minus-one-over-r", lemmas=2,
   tags=["seven-eighths","effective-order","linear-program","large-sieve","hilbert-schmidt","operator-norm","sextic-theta","cap"],
   title="General cap for probes of the Proposition 2.1 format",
   obstruction="No bound h <= 1 on the parameter (format gives h <= r/2). The abscissa is capped: square-root level + K-branch + floor-class high bound give B >= 1 - 1/r + lx/(2r) for all lx, ly, l >= 0 (exact identity; LP for r = 2..12), and the K-branch is the Hilbert-Schmidt lower bound of the reflected row operator, so no l2-l2 operator-norm (large-sieve) estimate passes it. The cap is target-independent (U, DH, THIN). Phase-blind low estimates have B >= 1 (ARGUED: aligned probe for the Liouville-twisted target). Only escape: a vector-specific mean square (E-K) of reflected theta rows for QP > Z, undecided. Inputs at lx < l are MODEL.",
   defeat=["U, DH, THIN (the cap is target-independent)","Liouville-twisted target (alignment gives B >= 1 for phase-blind estimates; size of aligned probe argued)", NR+"heat, E_a, T-NR, Beurling"]),
 "c7-laurent-shell-gamma-section": dict(kind="deepen", nodes=["laurent-shell-gamma-section"], okind="first-moment-sign-free-outside-polydisc", lemmas=1,
   tags=["bridge","passive-cascade","reinhardt-shell","gamma-factor","first-moment","harnack","davenport-heilbronn","limit-step"],
   title="Sections of the prime chain on a Reinhardt shell, gamma one-port included (remainder of Q12/Q22)",
   obstruction="Laurent/shell class: first-moment bracket = 2 int F_P dmu, sign forced iff Re F_P >= 0 on the torus (zeta: iff sum arcsin p^(-1/2) <= pi/2; fails from {2,3,7}). Gamma-coupled class: mean 1 + conj(int F_P m), sign free (ARGUED and measured). No forced sign for zeta and none for DH, every statement holds for DH. Twisted first moments single out the reflected Euler stage, whose shell contractivity is the height-coupled reserve inequality log(t/2pi) > 2 sum log p/(sqrt p - 1) of g-passive-cascade. Limit step void in measure form. Open only: a section with P(t) growing like a power of t.",
   defeat=["DH (every statement holds; no first-moment sign separates zeta from DH in any section class)", NR+"heat, sign twists, U, E_a, T-NR, Beurling"]),
 "c7-ff-order2-vertex-exact": dict(kind="compute", nodes=["map-open-1","ff-order2-vertex-probe"], okind="h-gt-1-low-input-contains-coherent-term-false-for-moebius-twist", lemmas=1,
   tags=["seven-eighths","effective-order","function-field","exact-arithmetic","prime-marks","moebius","circular","pre-registered"],
   title="Proposition 2.1 probe in F_q[T]: does h > 1 occur in the region lx < l",
   obstruction="F_q[T], q = 7, 13, N <= 4. Base probe at lx < l re-expresses blocks with h <= 1 - M/2 (span identities exact to d = 6; pre-registered threshold not met literally at N = 2). Uncompensated marked probe: h = 1 + l - M/2 > 1 holds where RH holds, but the diagonal-level row bound it needs bounds the target's Moebius sum (Cauchy-Schwarz) and fails for the control weight mu with the same moduli (excess up to 6.3). Exponent-level equivalence argued through the uncomputed staircase r >= 7; threshold test undecided at N <= 4. Not computed: the compensated probe (12.5).",
   defeat=["Moebius-twisted weight of the same modulus (the flat row bound fails: no sieve-type estimate can supply it)", NR+"DH analogue, heat, THIN in F_q[T]"]),
 "c7-landau-siegel-device-read": dict(kind="explore", nodes=["landau-siegel-2026-mechanism"], okind="device-floored-at-one-minus-c-over-log-q-no-height-aspect", lemmas=0,
   tags=["landau-siegel","real-zeros","conductor-aspect","interpolation-determinant","frobenius","reciprocity","device","thin","unimodular-twist"],
   title="Mechanism of the 2026 Landau-Siegel claim",
   obstruction="The statement is a corollary of the locally compiled Dirichlet 7/8 theorem (c = (log 3)/8). The independent Lean tree (read as text, not compiled) uses an interpolation determinant over a box in Z[sqrt d, sqrt 2] with Frobenius-congruence divisibility against the classical prime bias of a real zero. The zero enters only through the bias at s = 1 + 1/log X: the device is empty for 1 - beta > c/log q and has no height-aspect form (n^(-it) is the failing control U). No R4 mechanism.",
   defeat=["THIN and the Liouville twist fail at S4/S5 (no field): the device separates them, in the conductor aspect only","U (height aspect n^(-it)): fails at S4/S5 (argued); this is the reason there is no height-aspect form", NR+"DH, heat, E_a, T-NR, Beurling"]),
 "c7-bridge-seven-eighths-krein-index": dict(kind="combine", nodes=["bridge-scattering-factorisation","qrh-seven-eighths-input"], okind="family-sum-of-bridges-is-direct-sum-or-product-gain-zero", lemmas=1,
   tags=["bridge","krein-square","hankel","anticausal","seven-eighths","family","density","mv-cap"],
   title="Anticausal Hankel block under the 7/8 input and the Proposition 2.1 family",
   obstruction="Gain 0. The gapped anticausal trace is sum conj(r_j) r_k e^(-(conj z_j + z_k) c)/(conj z_j + z_k)^2 over right-half-plane poles (finite pole sets); its decay rate is 2 min Re z_j, and a positive-weight family sum has the minimum over members. The 7/8 input bounds max Re z_j < 3/8 identically for one member and the family and bounds no count. The sum of bridge forms is the bridge of the product; the negative index adds over distinct off-line zeros. Every-window content is the input restated (row G20); below tilt 3/8 only family-mean (density) bounds exist (MV-CAP). Not covered: infinite off-line sets; a bridge of a single probe row.",
   defeat=["any sign twist (prime-side value of every Gamma_- is zero before the family sum)","U (a family sum over n^(-i alpha) is a height average: density output)", NR+"DH, heat, THIN, Beurling"]),
 "c7-repair-engine-map-r6": dict(kind="repair", nodes=[], okind="filter-repair", lemmas=0,
   tags=["control","filter","generator","referee","normaliser","manuscript-check"],
   title="Second referee of Lemma H; engine and map bookkeeping for rounds 5 and 6",
   obstruction="Repair lane, no attack. Lemma H holds under a second referee (relative to MS Lemma 7.1 as printed): (2.2) holds exactly for sigma_0 > 2/3. Owed: third referee (derive MS Lemma 7.1 for j = 0); map row Z24 wording (E1, E4); map-open-9 device state scope (E3). The merge-rule fault (E2) and the map-open-1 node sets were handled by the round-7 learn step.",
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
            L = dict(r); L.update(kind=m["kind"], refereeHolds=holds, referees=1, restatement=False, knownArchitecture=False,
                                  brokenProved=0, lemmasDecided=m["lemmas"], obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 7, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
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
        e.update(nodes=m["nodes"], launchedNodes=m["nodes"], refereeHolds=holds, aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"])
        e["verdict"] = ENGV[r["verdict"]] if holds else "open"
        e["note"] = "round 7, score %d, referee holds: %s" % (sc, m["obstruction"][:300])

# (a) map-open-1 node sets; (b) engineVerdict for the two round-6 records whose referee did not hold
PAIR = {s: ["map-open-1", "out-" + s] for s in ("c5-angular-family-absorption", "c5-marks-circularity-order2", "c5-target-fe-order2-ledger",
        "c6-gl3-cover-epsilon-cocycle", "c6-marks-bc-manuscript-check", "c6-unreflected-marks-kd23")}
REOPEN = ("c6-gl3-cover-epsilon-cocycle", "c6-unreflected-marks-kd23")
for s, nodes in PAIR.items():
    fp = os.path.join(ROOT, "engine", "outcomes", s + ".json")
    d = json.load(open(fp))
    if d.get("nodes") == ["map-open-1"]:
        d["launchedNodes"] = ["map-open-1"]; d["nodes"] = nodes
    if s in REOPEN: d["engineVerdict"] = "open"
    json.dump(d, open(fp, "w"), indent=1, ensure_ascii=False)
    e = by.get(s)
    if e is not None:
        if e.get("nodes") == ["map-open-1"]: e["nodes"] = nodes
        if s in REOPEN: e["verdict"] = "open"
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
