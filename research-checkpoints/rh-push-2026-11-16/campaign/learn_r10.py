#!/usr/bin/env python3
"""Round 10 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent.
Device states in engine/curated/mk_devices.py are NOT edited here and the engine is not rerun (see ROUND_LOG, round 10 lessons, process)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round10_records.json")))
NR = "not run: "
META = {
 "c10-ff-slot-cross-decomposition": dict(kind="combine", heavy=False, broken=0, lemmas=1, engv="partial",
   nodes=["ek-vector-specific-row-mean-square", "ff-order2-vertex-probe", "out-c10-ff-slot-cross-decomposition"],
   okind="model-excess-is-cross-term-over-distinct-marked-primes-not-separated-from-random-multiplicative-signs",
   tags=["seven-eighths","effective-order","function-field","exact-arithmetic","prime-marks","cross-term","slot-decomposition","mean-square","window","pre-registered","control"],
   title="F_q[T] row energy split by pairs of marked primes (Diag, Cross, B_coh)",
   obstruction="F_q[T], q = 7, 13, N = 2, 3, long marks (lam > N, lam > d). The excess of the row energy over the diagonal is the cross term over pairs of distinct marked primes (proved via Weil's bound: slot-diagonal = diagonal up to O(N q^(N - lam/2))). The registered rule 'excess = coherent cross B_coh' is not awarded: it fails for the second target (c_perp 4.45, n 5.31), one U seed and mu; the row energy carries more than one squared signal (post hoc, d = 1 only: a second signal in the vector's own character at the row variable). The target is not separated from random multiplicative signs (50 of 51). The round-9 disagreement between the model and the Z[omega] screen is geometry: the screen ran at P = Z^(1/3) (dual length below N), the model excess needs marks of length at least 3.5N; the predicted screen term is 1.5e-4 to 3.2e-4 of the diagonal against resolution 0.01 (argued float proxy). No requirement flag; no statement about zeta.",
   defeat=["random multiplicative signs (target not separated: 50 of 51)","random signs on the marked primes (mean energy equals the slot-diagonal exactly: the excess is removed, as required of a control)","U seed and mu also break the registered coherent-cross rule", NR+"DH-type model weight, heat, E_a, T-NR, Beurling"]),
 "c10-ff-completed-rows-692": dict(kind="compute", heavy=True, broken=0, lemmas=1, engv="partial",
   nodes=["ff-order2-vertex-probe", "ek-vector-specific-row-mean-square", "out-c10-ff-completed-rows-692"],
   okind="completed-row-law-fails-with-exact-inputs-literal-band-met-by-offsetting-deviations",
   tags=["seven-eighths","effective-order","function-field","exact-arithmetic","completed-rows","cube-part","prime-marks","mean-square","pre-registered","heavy"],
   title="Completed marked rows at (N, lam, d) = (6, 9, 2), q = 7: the pre-registered bounded run",
   obstruction="F_q[T], q = 7, (6, 9, 2), exact integers, rule fixed before the run. Completed row energy/diagonal: 1.688 (a), 2.002 (b), 5.905 (trivial); squarefree part 0.567, 0.597, 0.862; random vectors 0.80 to 1.07. The literal registered band is met on the primary vector only through offsetting deviations: the j = 2 (cube) term is 1.377 of the diagonal (the c9 figure 0.8 is wrong by 1.72), the squarefree part is at 0.57 of its diagonal, cross terms are -0.23. The completed-row law with exact inputs fails (coherent count off by factors 15.7 and 0.088). The cube term is half n = l^2 (principal direction; normaliser factor) and half squarefree n (sum over m exactly zero: absent from the principal signal). One configuration: no exponent, no threshold, no contradiction with an N^eps bound. Device ff-order2-vertex-probe: closure for ORDER-2 through (E-K) at 2 <= h <= 3 is proposed, not applied (model evidence at one size, one referee).",
   defeat=["not a control separation: the Weil targets exceed the diagonal in the completed row","controls behave as required (three random vectors 0.80 to 1.07; mu 1222; aligned 9e9)", NR+"DH-type model weight, THIN, heat, U, E_a, T-NR, Beurling"]),
 "c10-thin-deletion-zero-mode-control": dict(kind="combine", heavy=False, broken=0, lemmas=1, engv="partial",
   nodes=["out-c4-thin-twist-control-78", "out-c10-thin-deletion-zero-mode-control"],
   okind="control-construction",
   tags=["control","thin","prime-deletion","euler-product","positivity","beurling","zero-mode","hoheisel","short-interval","statement-o","record"],
   title="Thin prime deletion: a control with Lambda >= 0 and a real zero b in (1/2, 1)",
   obstruction="Control lane, no attack. Relative to a classical short-interval prime theorem (counting form, one theta < 1) and with the referee's repair of Lemma 0: deleting a greedy prime set S of density t^(b-1)/log t (density one, not one half) gives F = zeta(s)(s - b)W(s) with Lambda_F >= 0, coefficients 0/1, a simple pole at 1 and a simple zero at b. Limits: the zero comes from the theorem, not from data (every finite truncation is positive at b; finite data do not enclose the zero); the F'(b+) enclosures are relative to two cited explicit pi-li bounds; the device read (14 pass, 20 do not) is argued, not re-run, and the count is not confirmed against the table; character twists past b are open; one referee.",
   defeat=["the control itself defeats any device whose read set is {degree-one Euler product, Lambda >= 0, pole at 1} without the functional equation or periodicity: 14 of 34 devices pass it (argued read)","devices it does not pass read the functional equation, periodicity with unimodular parameters, an attached object, or positivity with zeta's gamma side"]),
 "c10-repair-record-referee-r9": dict(kind="repair", heavy=False, broken=1, lemmas=0, engv="partial",
   nodes=[], okind="filter-repair",
   tags=["record","obstruction-map","control","referee","statement-o","map-rows","engine"],
   title="Record repair: second referee of Statement O, map rows, round-9 record consistency",
   obstruction="Record lane, no attack. The referee does not hold the lane as written: of the four PROVED labels of Statement O, line 3 is confirmed only for the inputs {EP, POS, FE}; the part reading ZF(theta) as a hypothesis is ARGUED, and membership of E_a at theta = 1/2 + a is equivalent to RH. Standing: PROVED lines 6 (without KER), 8 (no floor), 9, and 3 for {EP, POS, FE}; MEASURED line 2; ARGUED 7. Joint clause withdrawn. Map 166 -> 180 rows. Not re-run: lines 4, 10 and the step mode of line 1. Server removal not independently checked. Open for the planner: state of device effective-order-two (node map-open-1).",
   defeat=["not applicable (repair lane)"]),
 "c10-tro6-dual-squarefree-type1-level": dict(kind="deepen", heavy=False, broken=0, lemmas=1, engv="closed",
   nodes=["map-open-4", "out-c10-tro6-dual-squarefree-type1-level"],
   okind="dual-squarefree-and-type1-level-average-are-rebracketings-of-one-trilinear-sum-no-saving",
   tags=["tro6","sextic-theta","signed-c-sum","dual-sum","squarefree","type-one","level-average","cubic-gauss-sums","pre-registered","seeded-controls","frontier-number"],
   title="TRO6: dual sum on squarefree n and Type I on average over the level",
   obstruction="Lemmas A and B (proved finite identities): the dual sum on squarefree n, the Type I level average with sign mu(a), and the trilinear Gauss-sum form are re-bracketings of one finite trilinear sum; the level variable enters only through incomplete sums of normalised cubic Gauss sums, not Kloosterman sums. Measured at X = 1e6, 1e7: no saving in the signed outer sum of either form at resolution 0.01 to 0.03 in the exponent (eight decision differences above -0.02, minimum -0.0093). The one firing of the pre-registered rule (level statistic of form (b), kappa = 0.4) is removed by projecting out the Theorem P polar direction, a removal chosen after the rule fired; the remainder is compatible with zero, not shown to be zero. Two non-decision cases (theta = 1/3, u = 1 and u = y0) are unexplained. A saving below the resolution is not excluded; TRO6 needs Q^(-eta/80). Third same-kind record for lead 17 (e2, c9, this lane). No eta > 0; 7/8 and 0.874886647 unchanged.",
   defeat=["seeded control classes (exponent differences above -0.02 in all eight decision cases)","placebo removal (leaves the fired trend unchanged; the Theorem P projection removes it)", NR+"DH, heat, U, E_a, T-NR, Beurling"]),
 "c10-spectral-reciprocity-signed-moduli": dict(kind="explore", heavy=False, broken=0, lemmas=1, engv="closed",
   nodes=["out-c10-spectral-reciprocity-signed-moduli"],
   okind="reciprocity-dual-fixes-the-mollifier-twist-ledger-map-a-to-a-shifted-positivity-from-functional-equation",
   tags=["spectral-reciprocity","kloosterman","kuznetsov","moebius","mollifier","window","hecke-operators","motohashi","blomer-khan","katok-sarnak","positivity","e-a-control","t-nr"],
   title="Lead 4 (n4 spectral window with Moebius twist): exact reciprocity dual of the off-diagonal",
   obstruction="Weight-1 (n4) sum: the exact dual of sum_c w(c) sum_n S(n, l; c) f(n) (Lemma R, classical; confirmed by derivation and to 1e-14) transforms (n, c) only. The twist l <= X^2 that carries A is a parameter, so the ledger map is A -> A; the lattice side has T^(2A-1) terms per l against T spectral terms, never shorter for A > 1. The saving needed is cancellation in l, which no reciprocity on file touches. Variants with a dual family (Motohashi cubic weight, Blomer-Khan level exchange) are recalled, not derived: lengths preserved with positivity lost, or dual family longer; a ledger entry, not a theorem. Shifted positivity L(1/2+a, phi_j) L(1/2-a, phi_j) >= 0 follows from the functional equation alone. Detector P2: anchor B(t_rho) = -1 exact, no region of absolute convergence in t, so it cannot be run; it remains open. No A > 1/2 obtained.",
   defeat=["E_a with real a (passes positivity, linearisation and the identities in the degree >= 4 variants)","T-NR (passes in all variants)","DH fails at Hecke linearisation (recorded in the n4 lane)", NR+"heat, THIN, U (no automorphic family), Beurling"]),
 "c10-ff-signal-intersection-square": dict(kind="combine", heavy=False, broken=0, lemmas=1, engv="closed",
   nodes=["ff-order2-vertex-probe", "function-field-twin-ladder", "ff-three-approaches-one-statement", "sign-only-certificate-reach", "out-c10-ff-signal-intersection-square"],
   okind="genus-one-squared-signal-is-algebraic-identity-deg-m-equals-m-squared-no-positivity-fakes-pass",
   tags=["function-field","exact-arithmetic","intersection-form","hodge-index","twin-ladder","elliptic-curve","genus-two","weil-bound","effective-order","control"],
   title="Is the squared signal of the F_q[T] probe an intersection-form square",
   obstruction="F_q[T], prime cubic conductor, N <= 3, q = 5, 7, 11, exact. For genus-1 targets the Moebius sum is S_cop(k) = sum_j c_j t_j with c independent of the curve, and (sum c_j t_j)^2 = -D.D/(2 q^N) for every real quadratic 1 - a u + q u^2, on or off the circle: the equality is deg[m] = m^2 on an elliptic curve, uses no index theorem and carries no positivity. Fakes with off-line zeros pass (3444 of 3444). In genus 2 the equality fails (0 of 80; 0 of 624) and the index theorem bounds the squared signal from above (the Weil bound), the opposite side from the low input. M_N = h_N is not trace-linear for g >= 2, N >= 2. No new input is named; the model's h > 1 comes from the sixth-power count of the probe rows.",
   defeat=["genus-1 fakes with zeros off the line (identity holds unchanged, 3444 of 3444)","Liouville-twisted target (passes)", NR+"DH-type model weight, heat, THIN, U, E_a, T-NR, Beurling"]),
 "c10-new-inputs-scan-2026": dict(kind="explore", heavy=False, broken=0, lemmas=0, engv="partial",
   nodes=["out-c10-new-inputs-scan-2026"],
   okind="literature-scan-no-new-input-toward-the-critical-line",
   tags=["literature","scan","large-sieve","zero-density","tro6","seven-eighths","frontier-number","quartic","record"],
   title="Scan of public results 2026-10-15 to 2026-11-18 for named missing inputs",
   obstruction="Abstract-level scan (17 identifiers confirmed bibliographically; no proof checked; every preprint claim unverified). No posted result supplies a signed sum over Gauss-sum moduli of the TRO6 kind, a new epsilon-cocycle row type, a zero-free normaliser, or a new every-window mechanism; no closed family is reopened toward the critical line. Inputs found are arbitrary-coefficient inequalities (de Faveri 2610.04045, n-th order large sieve; candidate part-B input for rows Z14, Z12, Z6, expected to stay within [5/6, 7/8]), which are control-blind. Claimed, unverified: Ji 2611.16665 (599/600, quartic rows over Q(i)); Chang-Wang 2611.00924 (0.874462, conditional, source of boundary B_* not located); Xu-Sang 2610.17675.",
   defeat=["not applicable (scan); the inputs found hold for arbitrary coefficients, so every control passes them"]),
}
lp = os.path.join(ROOT, "campaign", "lanes.jsonl")
have = {json.loads(l)["slug"] for l in open(lp) if l.strip()}
op = os.path.join(ROOT, "engine", "outcomes.json")
eng = json.load(open(op)); by = {o["slug"]: o for o in eng}
OD = os.path.join(ROOT, "engine", "outcomes")
with open(lp, "a") as f:
    for r in recs:
        m = META[r["slug"]]; holds = bool(r["refHolds"])
        sc = sum(bool(r[k]) for k in ("r1","r2","r3","r4")) if holds else 0
        rf = os.path.join(os.path.dirname(r["file"]), "REFEREE.md")
        if r["slug"] not in have:
            L = dict(r); L.update(kind=m["kind"], heavy=m["heavy"], refereeHolds=holds, referees=1, restatement=False,
                                  knownArchitecture=False, brokenProved=m["broken"], lemmasDecided=m["lemmas"],
                                  obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 10, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
               "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": m["okind"],
               "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
               "refereeHolds": holds, "referees": 1, "aboutZeros": bool(r["aboutZeros"]),
               "refereeNote": r["errors"] + " - [truncated in the learn-step input; full text in REFEREE.md]",
               "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"], "refereeFile": rf,
               "launchedNodes": [n for n in m["nodes"] if not n.startswith("out-")], "engineVerdict": m["engv"]}
        json.dump(out, open(os.path.join(OD, r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
        e = by.get(r["slug"])
        if e is None:
            e = {"slug": r["slug"], "tags": m["tags"], "title": m["title"], "path": "push/" + r["slug"]}
            eng.append(e); by[r["slug"]] = e
        e.update(nodes=m["nodes"], launchedNodes=out["launchedNodes"], tags=m["tags"], title=m["title"], refereeHolds=holds,
                 aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"], verdict=m["engv"])
        e["note"] = "round 10, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(OD)), "engine entries:", len(eng))
