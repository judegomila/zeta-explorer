#!/usr/bin/env python3
"""Round 8 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent.
Device states are edited in engine/curated/mk_devices.py (single-row-bridge closed; evidence of (E-K), (E-H) and the
function-field vertex updated), not here. Records whose device stays open carry engineVerdict partial/open and list
[device node, out-<slug>] so the open device node is not rejected by the generator."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round8_records.json")))
NR = "not run: "
META = {
 "c8-ek-ff-reflected-rows-exact": dict(kind="compute", heavy=True, referees=1, broken=0, lemmas=1, engv="partial",
   nodes=["ek-vector-specific-row-mean-square", "ff-order2-vertex-probe", "out-c8-ek-ff-reflected-rows-exact"],
   okind="row-energy-is-diagonal-plus-squared-signal-target-not-separated",
   tags=["seven-eighths","effective-order","function-field","exact-arithmetic","prime-marks","mean-square","bessel","circular","pre-registered"],
   title="(E-K) in F_q[T] in exact arithmetic: marked rows and the compensated probe",
   obstruction="F_q[T], q = 7, 13, squarefree unreflected marked rows only (reflected completed rows not run). Row energy / diagonal = n + B_coh with B_coh the squared probe signal; at dual length 0 energy / diagonal >= B_0 is proved, so a diagonal-level row bound implies the bound on the Moebius sum of the weight (the target's own bound restated). In the bulk the Weil targets sit at the diagonal (exponent <= 1.05) and so do random-phase, random-sign, multiplicative-sign, DH-type and two-character vectors: the row energy does not separate targets from generic vectors. The mean over random phases equals the diagonal exactly, so the K-loss is seen only on an aligned vector. Failure of (E-K) for targets beyond h = 3 and any growth in the degree are ARGUED from 5 small configurations (N <= 2, q = 7). Compensated probe (12.5): h > 1 survives, low input unchanged.",
   defeat=["random unimodular, random-sign, multiplicative-sign, two-character and model DH vectors (same diagonal-level energy as the targets: no R3 in the row energy)","mu and a sign twist (exceed the diagonal by the coherent term: the bound fails where the Moebius sum is large)","aligned vector (reaches Hilbert-Schmidt size)", NR+"reflected completed rows, heat, U, E_a, T-NR, Beurling"]),
 "c8-ek-theta-second-moment-formula": dict(kind="deepen", heavy=False, referees=1, broken=0, lemmas=1, engv="partial",
   nodes=["ek-vector-specific-row-mean-square", "out-c8-ek-theta-second-moment-formula"],
   okind="row-mean-square-is-mean-value-of-reciprocal-l-over-target-twist-family",
   tags=["seven-eighths","effective-order","sextic-theta","mean-square","poisson","gauss-sum","moebius","twist-family","grh-conditional","dunn-radziwill"],
   title="(E-K) over Z[omega]: exact formula for the row mean square of the probe vector",
   obstruction="Exact (confirmed independently): Sum_m g_X(m)|B_m|^2 = X D + X Sum_{k != 0} F_k, with F_k bilinear in localized Moebius sums, i.e. Mellin transforms of 1/L(1+u, eta theta chi_k^-1) over the order-6 twist family of the target, q_k <= N^2/X. So (E-K) is a mean value of 1/L over a family that contains the target: under GRH for that family (circular) the error is N^(1+eps) and (E-K) holds for X >= N = ZP (outline only; marked rows and cube parts by analogy). The sixth-power frequencies carry the target's own sum with multiplicity about K^(1/6) through a positive semidefinite form; an excess is measured for the Liouville and aligned twists, exponent not resolved. The window Z/P < X < ZP, where the 31/36 vertex sits, is open. The Dunn-Radziwill sharpness example (cubic Gauss sums against cubic symbols) is not the probe's configuration.",
   defeat=["Liouville twist and aligned twist (measured excess +38% to +63%, growing with size)","cubic-row control (reproduces Dunn-Radziwill growth, exponent 0.31 to 0.32 against 1/3; confirms the test detects a pole term)","random phases (theta ratio within the random-phase spread: the float screen does not separate the target)", NR+"DH, heat, THIN, U, E_a, T-NR, Beurling"]),
 "c8-eh-nonprincipal-row-cancellation": dict(kind="deepen", heavy=False, referees=1, broken=0, lemmas=1, engv="open",
   nodes=["eh-nonprincipal-row-cancellation", "out-c8-eh-nonprincipal-row-cancellation"],
   okind="nonprincipal-row-bound-is-necessary-and-sufficient-for-conclusion-control-blind-in-model",
   tags=["seven-eighths","effective-order","linear-program","poisson","function-field","exact-arithmetic","control","davenport-heilbronn","thin","liouville"],
   title="(E-H): cancellation over non-principal dual rows",
   obstruction="Referee does not hold the headline ('not an independent input / circular' is a non sequitur). Standing: NP = I - I_1 exactly (MS (10.5)); given the low estimate and a bound on the remainder of row 1, a bound Z^E on NP is necessary and sufficient for H_eta/L^S(s, eta) holomorphic on Re s > B_E. This is necessity of the high hypothesis, not circularity; it does not exclude proving (E-H) from the rows. Termwise and norm treatments are closed in the model: norm bound of NP plus the K-branch gives B >= 1 - 1/r + lx/r + l(1/2 - 1/r) (identity confirmed, norm floor argued); LP values 13/15 and 31/36 (with E-K). In F_q[T] at r <= 4 cancellation over rows is present for every weight (targets, THIN, Liouville twist, random multiplicative and non-multiplicative), with a possible target-type excess (about 0.5 against 0.28-0.44 in even blocks at q = 7) neither resolved nor excluded. A target-specific treatment is undecided.",
   defeat=["random non-multiplicative weights, random multiplicative weights, THIN, Liouville twist (row cancellation present at r <= 4: Poisson duality, not arithmetic)","model DH weight (not an off-line control: no conclusion drawn)", NR+"heat, U, E_a, T-NR, Beurling"]),
 "c8-liou-row-bound-theorem": dict(kind="deepen", heavy=False, referees=1, broken=0, lemmas=1, engv="partial",
   nodes=["out-c7-liou-high-row-bound", "out-c4-thin-twist-control-78"],
   okind="low-half-coherent-term-is-weight-blind-hermitian-form-thin-needs-family-zero-free",
   tags=["seven-eighths","control","sign-twist","liouville","thin","sextic-theta","periodicity","row-bound","second-moment","dunn-radziwill"],
   title="Theorem A: row bound for Liouville rows (LIOU-HIGH), remainder bound relative to Blomer-Goldmakher-Louvel",
   obstruction="Liouville rows in one class mod 72, Gaussian row weight: N = D + P + Rem exactly, P >= 0 of exact order M^(5/6) X^(1/3) for X^2 >= C M (proved), |Rem| <= C_eps M^(-eps) X^(1+5 eps) relative to a fixed-twist form of Blomer-Goldmakher-Louvel Cor. 1.4 (twist insertion unprinted). So the Liouville analogue of (5.36) fails for 7m/8 < n < 5m/4. The coherent term is a Hermitian form in the weight and is present for non-multiplicative weights: this half carries no R1 and no R4. THIN stops at a bound on Re x < 12b/7 - 15/14 <= 9/14, which contains an unknown zero-free half-plane for twists of zeta_F. One referee; two more owed for sections 2 to 4.",
   defeat=["non-multiplicative weights (show |mean|^2 P: the coherent term needs no multiplicativity)","periodic and random multiplicative weights (no coherent term, as predicted)","THIN undecided (conditional on an unknown zero-free half-plane for the twist family)", NR+"DH, heat, U, E_a, T-NR, Beurling"]),
 "c8-row-energy-squared-signal": dict(kind="combine", heavy=False, referees=3, broken=0, lemmas=1, engv="closed",
   nodes=["out-c7-uncompensated-high-side-normaliser", "out-c7-ff-order2-vertex-exact", "out-c7-liou-high-row-bound"],
   okind="coherent-term-is-cauchy-schwarz-step-of-prop-2-1-needs-high-half",
   tags=["seven-eighths","effective-order","prime-marks","normaliser","function-field","exact-arithmetic","bessel","cauchy-schwarz","circular"],
   title="One statement for 'row energy at sixth-power frequencies = squared signal'",
   obstruction="The coherent term is the Cauchy-Schwarz step of Proposition 2.1 solved for the row energy: max_sigma E_sigma(Z) >= c_0 min(X,Y) |I_mark(Z)|^2 (relative to MS (6.2), (12.5), Lemma 6.2). The exponent statement (C1) of round-7 Lemma C follows only relative to the unproved high half (HC) and only if beta* > 2/3. In F_q[T]: E = S + Rem, Rem >= 0, S explicit at dual length 0 (exact). E >= D + S fails in the computed cases; a third Weil target has signal above the diagonal, so target and aligned control are not separated at these sizes. Not established: Lemma C reading (b), identity (3.2), threshold h_E > 3. The marks branch is reduced to (E-K), not closed.",
   defeat=["random marks (every identity kept; mean signal lower by 2.5x to 21x)","aligned control (not separated from a Weil target at the computed sizes)", NR+"DH, heat, THIN, U, E_a, T-NR, Beurling"]),
 "c8-single-row-bridge-crossing": dict(kind="combine", heavy=False, referees=1, broken=0, lemmas=1, engv="closed",
   nodes=["single-row-bridge"],
   okind="single-row-axis-is-edge-re-w-1-of-its-euler-factor",
   tags=["bridge","krein-square","sextic-theta","kubota-patterson","functional-equation","edge-of-strip","single-row","gauss-sum-series"],
   title="Bridge form built from one completed probe row",
   obstruction="A cubic-theta row is T = L0 D with L0(s) = L(3s - 1/2, psi). The row's reflection axis Re s = 1/2 is Re w = 1 for L0, at distance 1/6 (in s) from L0's own axis Re s = 1/3. The reflection quotient of T about its axis has no pole from a zero of L0 (classical non-vanishing on Re w >= 1); where T(s_rho) != 0 (float fit at eight low zeros, one unweighted row) the zero is a pole of D with reflected real part (5/2 - beta)/3, which restates beta with no sign or rank condition. About Re s = 1/3 the form is H(T) - H(L0) with no sign from the row's functional equation. The target L(s, eta) enters a single row only as a coefficient twist; it appears as an L-function only after the sum over rows. Classical Kubota-Patterson normalisation in bridge language.",
   defeat=["not a control separation: the form reads zeros as an identity at every height with no sign (holds for any row L-function)","THIN fails only by non-existence of the continuation (not established)", NR+"DH, heat, sign twists, U, E_a, T-NR, Beurling"]),
 "c8-hecke-entropy-resonance-rigidity": dict(kind="explore", heavy=False, referees=1, broken=1, lemmas=1, engv="open",
   nodes=[],
   okind="off-resonance-eisenstein-series-passes-every-step",
   tags=["hecke-recurrence","entropy","measure-rigidity","eisenstein-series","resonance","maass-selberg","modular-surface","zagier-criterion","device"],
   title="Joint Hecke recurrence and measure rigidity on Eisenstein resonance states",
   obstruction="Referee does not hold the record as written: Lemma G2 (i), labelled PROVED, is vacuous (the DH-type object on Gamma_1(5) is identically zero; DH not run). Standing: truncated mass at a resonance is exactly Y^(2 sigma-1)/(2 sigma-1), free of gamma (Maass-Selberg); the recurrence bound is uniform in gamma with P-exponent -1 for every sigma in (1/2, 1), so it does not contradict the cusp growth; the off-resonance Eisenstein series E(z, w') satisfies every hypothesis the device reads, so the device cannot locate sigma; m_sigma is an A-conformal (not A-invariant) Hecke eigen-measure for every sigma > 1/2, so rigidity hypotheses fail at sigma = 3/4 too. The device returns the conformal exponent 2 sigma - 1. A device on the modular surface must read phi(w) = 0.",
   defeat=["EIS-w: E(z, w') off resonance (keeps group, functional equation, Euler product, Hecke algebra; passes every step)","U, THIN, sign twists fail at Gamma-invariance only (lack of automorphy, not a separation of zeta's zeros)", NR+"DH (model object identically zero), heat, E_a, T-NR, Beurling, phase-rotated transfer operator"]),
 "c8-repair-engine-map-r7": dict(kind="repair", heavy=False, referees=1, broken=0, lemmas=0, engv="partial",
   nodes=[], okind="filter-repair",
   tags=["control","filter","generator","referee","hilbert-schmidt","manuscript-check"],
   title="Referee debts of round 7; generator coverage of the open devices; obstruction-record outline",
   obstruction="Repair lane, no attack. Generator: 0 of the top 60 contain a closed device; five open devices appear 12, 12, 8, 6, 4 times. Theorem K, the Hilbert-Schmidt bound and Proposition B hold; Lemma H holds from series (7.10) (third referee); Lemma 2 holds for monomial m (real part of the mean >= 0, 0 attained at m = -1). Still ARGUED: Lemma A for non-principal rows of the Liouville-twisted target; Lemma 2 for non-monomial m. Owed: referees for the blockwise Hilbert-Schmidt bound and the monomial Lemma 2 proof; MAP_PENDING Part 2 not applied to the map.",
   defeat=["not applicable (repair lane)"]),
}
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
        rf = os.path.join(os.path.dirname(r["file"]), "REFEREE3.md" if r["slug"] == "c8-row-energy-squared-signal" else "REFEREE.md")
        if r["slug"] not in have:
            L = dict(r); L.update(kind=m["kind"], heavy=m["heavy"], refereeHolds=holds, referees=m["referees"], restatement=False,
                                  knownArchitecture=False, brokenProved=m["broken"], lemmasDecided=m["lemmas"],
                                  obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 8, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
               "survivingClaim": r["surviving"], "obstruction": m["obstruction"], "obstructionKind": m["okind"],
               "controlsThatDefeat": m["defeat"], "score": sc, "requirements": {k: bool(r[k]) for k in ("r1","r2","r3","r4")},
               "refereeHolds": holds, "referees": m["referees"], "aboutZeros": bool(r["aboutZeros"]), "refereeNote": r["errors"],
               "lesson": r["lesson"], "followUp": r["followUp"], "resultFile": r["file"], "refereeFile": rf,
               "launchedNodes": [n for n in m["nodes"] if not n.startswith("out-")], "engineVerdict": m["engv"]}
        json.dump(out, open(os.path.join(ROOT, "engine", "outcomes", r["slug"] + ".json"), "w"), indent=1, ensure_ascii=False)
        e = by.get(r["slug"])
        if e is None:
            e = {"slug": r["slug"], "tags": m["tags"], "title": m["title"], "path": "push/" + r["slug"]}
            eng.append(e); by[r["slug"]] = e
        e.update(nodes=m["nodes"], launchedNodes=out["launchedNodes"], tags=m["tags"], title=m["title"], refereeHolds=holds,
                 aboutZeros=bool(r["aboutZeros"]), lesson=r["lesson"], verdict=m["engv"])
        e["note"] = "round 8, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
