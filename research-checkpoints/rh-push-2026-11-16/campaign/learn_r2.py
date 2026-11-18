#!/usr/bin/env python3
"""Round 2 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round2_records.json")))
META = {
 "c2-euler-at-zeros": dict(kind="combine", tags=["euler-product","explicit-formula","mean-value","spinor","weil"], nodes=[], okind="mean-value-shared-with-controls",
   title="Partial Euler products sampled at zeros (Krein zero sum R_S)",
   obstruction="No one-sided inequality on R_S separates zeta from the controls. The lower inequality R_S >= 0 for all tests is the target itself (P10). The upper depletion inequality is the Landau-Gonek mean value -2 sum_{p<=P} log p/(p-1); its every-window form needs a sup-over-height bound on a prime sum outside S and is unproved. R_S tends to 0 as P grows and a partial Euler product damps off-line pair weights, so the multiplier is not an amplifier. The exact S-periodised explicit formula (Lemma B) holds for every control with the functional equation and samples zeta'/zeta only on Re s = 1.",
   defeat=["E_a = zeta(s+a)zeta(s-a) (passes the depletion inequality, measured)","backward heat (passes the depletion inequality, measured)","every control with a functional equation satisfies Lemma B","DH, Liouville twist, height shift, non-multiplicative multipliers fail the depletion inequality (mean-value statement only)"]),
 "c2-euler-at-zeros-scale": dict(kind="compute", tags=["euler-product","mean-value","explicit-formula","control"], nodes=[], okind="mean-value-shared-with-controls",
   title="Scale run: partial Euler products at zeros, heights 1e3 to 1e8",
   obstruction="The suppression of the truncated product at zeros is the Landau-Gonek diagonal term 1 - 2 c_P/L, a function of log P / log T: not uniform in height at fixed P, not uniform in window length (fails for 25-zero windows), and above 1 against the one-spacing shifted reference. It uses only the prime-power coefficients of -F'/F.",
   defeat=["DH formal partial product at DH zeros, on-line and off-line (same one-sided suppression, measured)","Liouville twist at rho/2 (same suppression in the mean)"]),
 "c2-polydisc-leeyang-bound": dict(kind="deepen", tags=["lee-yang","finite-stage","torus","prime-torus"], nodes=["prime-gibbs-not-lee-yang"], okind="rotation-invariant-class-gives-trivial-bound",
   title="Multivariate (polydisc) Lee-Yang bound on renormalised Euler stages",
   obstruction="Polydisc stability gives exactly prod(1-|z_p|/R_p) <= |F| <= prod(1+|z_p|/R_p), i.e. |E_P(s)| <= E_P(sigma), the trivial bound. Any bound valid on a torus-rotation-invariant class is at least the torus maximum; a unimodular twist is a rotation. At fixed P, limsup_t |G_P(sigma+it)| = E_P(sigma), so no bound is both height-uniform and sub-trivial: R2 and R4 conflict at stage level. Not excluded: statements coupling P to height; stability regions that are not rotation invariant.",
   defeat=["unimodular twist U (a torus rotation; at fixed P its stage is a limit of height translates of zeta's stage)","zeta itself (attains the trivial bound along heights by Dirichlet approximation)"]),
 "c2-jinner-multidelay-lft": dict(kind="deepen", tags=["passive","torus","euler-product","pick"], nodes=["fam-multidelay-section"], okind="rank-one-additive-defect-prime-blind",
   title="J-inner linear-fractional sections in several delays, finite and infinite P",
   obstruction="A J-contractive several-delay section holomorphic on the full polydisc with Schur termination equals M(H)V0 with V0 constant J-unitary and Re H >= 0 (Lemma R): the defect is rank one and additive, so the family is the unipotent one. No nonconstant such section splits off xi'/xi (first-moment bracket >= 1.17 Re a_1 > 0). On 1/2 < sigma < 1 convergence either excludes the zeta orbit or is equivalent to zero-freeness. Not covered: sections on a Reinhardt shell; sections including the gamma term. Theorem A' has one referee pass.",
   defeat=["DH (same no-go, bracket >= 1.06 Re a_1, given a DH moment formula that is outline plus measured)","the no-go uses the functional equation and Schwarz-Pick only, not multiplicativity"]),
 "c2-cutoff-hecke-defect": dict(kind="combine", tags=["hecke","spinor","weil","commutator","bridge","hankel"], nodes=["cutoff-energy-kernel-hc","two-point-cutoff-positivity"], okind="weil-form-restriction-euler-blind",
   title="Commutator of the cutoff with Hecke dilations in the bridge energy",
   obstruction="D_p = [Q_c,V_p] = -P_c V_p Q_c has range L^2(c - 2 log p, c] and carries the prime only as a length. The defect form is -||Gamma_- D_p v||^2 (zero for one prime or any translation iff RH); in a-space it is the Weil form restricted to one-sided tests, independent of c. No multiplicativity is used. No bound on the negative index of the window operator follows from node matrices.",
   defeat=["DH (positive definite on every window p <= 97, up to 222 nodes; off-line zeros not detected)","backward heat tau = -2 (passes)","Liouville twist fails although completely multiplicative, so the form reads the functional equation and lowest off-line height, not the Euler product"]),
 "c2-euler-cone-fe-rigidity": dict(kind="explore", tags=["euler-product","toeplitz","rigidity","riemann-siegel","control"], nodes=["rung-toeplitz-euler-detector","twisted-log-positivity-b-n","euler-fe-coupling-at-height"], okind="window-local-fe-admits-translates",
   title="Euler cone intersected with the functional equation in a window",
   obstruction="Exact uniqueness is Hamburger's theorem and uses neither the cone nor multiplicativity. In one window [T,T+H], lattice translates zeta(s + 2 pi i k/log(T/2pi)) are cone elements with functional-equation defect about (|alpha|H + alpha^2)/(2T), so the feasible set at fixed tolerance grows with T; a window gives about 30 real conditions against about sqrt(T)/log T free primes, and a prescribed zero at 3/4 + i t0 is feasible (float64 model, T up to 1e6). The multi-height constraint only says F equals zeta in the window.",
   defeat=["lattice height translates of zeta (unimodular twists; pass every single-window functional-equation test)","L(s, chi_5) at height T/5 (residual about 50/T, measured)"]),
 "c2-projection-domination-gonek": dict(kind="explore", tags=["explicit-formula","short-intervals","prime-oscillation","zero-free"], nodes=["telescoping-kernel-projection-domination","straddle-exclusion-window-completeness","m23-unconditional-window-positivity"], okind="trivial-strip-size-gap",
   title="Projection domination with the window-local Landau-Gonek prime side",
   obstruction="One off-line pair of depth delta forces |short twisted prime sum| >= 2|W| sinh(delta log N) - M_on, which is below the trivial Brun-Titchmarsh upper bound for every H, N and delta < 1/2 since N^delta < sqrt(N). Closing the gap is the zero-free statement. Only the support and size of Lambda are used. Referee: obstruction stands; the claim as worded is false in three places (the identity has a remainder of about H(8H/T)^7 log T and needs H = o(T^(7/8))).",
   defeat=["Liouville twist (passes every step)","sign twists (keep support and size of Lambda)","DH fails only at support (b(6) = 1.936)","lattice and Poisson point sets show the same absorbability threshold (sampling-density statement)"]),
 "c2-repair-owed-passes": dict(kind="repair", tags=["control"], nodes=[], okind="filter-repair",
   title="Owed referee passes and engine bookkeeping from round 1",
   obstruction="Repair lane, no attack. 8 owed steps checked and hold (Lemma 3 only in corrected form 3'); for DH and E_a with a >= 1/8 the primitive-equals-all equality is not established (not refuted). No negative verdict changes. Owed: apply MAP_PENDING.md to OBSTRUCTION_MAP.md; sources for GHS, Selberg CLT, Bohr-Jessen not opened.",
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
                                  brokenProved=0, lemmasDecided=0, obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 2, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
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
        e["verdict"] = ENGV[r["verdict"]] if holds else "open"
        e["note"] = "round 2, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written (obstruction stands)", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
