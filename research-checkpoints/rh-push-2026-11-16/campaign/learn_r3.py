#!/usr/bin/env python3
"""Round 3 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round3_records.json")))
META = {
 "c3-lemmab-referee-dh-poisson": dict(kind="deepen", tags=["euler-product","explicit-formula","weil","poisson","davenport-heilbronn","zero-free-region"], nodes=[], okind="restatement-explicit-formula", restatement=True, lemmas=1,
   title="Referee of Lemma B (S-periodised explicit formula), DH form, Poisson test in k",
   obstruction="By Poisson summation in k the residue sum over the poles 1 + 2 pi i k/log p equals Weil's pole term minus the prime sum for the test Z_S w, truncated together: Lemma B is the explicit formula for a non-compactly supported test, regularised, with no sign of its own. The only inequality step is the classical zero-free region (Littlewood/Vinogradov-Korobov form). DH satisfies the identity, so nothing in it separates zeta. Proved for |S|=1; for |S|>=2 only for C_c^infinity tests, with a Baker-type bound whose constant was not checked against the source.",
   defeat=["DH (satisfies the identity: 14 cases, rel <= 5.4e-12, off-line pairs up to 61% of the zero side)","Liouville twist (the identity exists, no Krein zero sum)","height-shift twist (the zero-free region step is true for it, so that step does not separate controls)","heat, E_a, generic twist: argued by hand, not run"]),
 "c3-lemmab-halfplane-growing-s": dict(kind="combine", tags=["euler-product","explicit-formula","weil","zero-free-region","seven-eighths","short-support"], nodes=[], okind="littlewood-scale-cap-on-sup-bounds", restatement=False, lemmas=0,
   title="Lemma B with poles shifted to Re s = sigma_0 and S growing with T, using the 7/8 half-plane",
   obstruction="With the residues bounded in absolute value through sup bounds of zeta'/zeta on a vertical line, positivity is certified only for support T_w <= f(sigma_0) log log T, f = (sigma_0-Theta)/((1-Theta)(sigma_0-1/2)), f(1) = 2 for every Theta including RH: the Littlewood scale X = (log T)^2. Support c log T is not reached; the 7/8 input gives nothing beyond absolute convergence or the classical no-multiplier Weil range 2 log log T - C. For sigma_0 > 1 the residue sum is the Weil prime sum. This is an obstruction of the bounding method, not a proof that positivity fails beyond 2 log log T; a signed treatment of the lattice sum is the target itself (row P10).",
   defeat=["E_a (the shifted identity holds for it, measured)","every control with a zero-free region of the same shape gets the same range; the method reads only the sup bound","not run: DH form, Beurling, T-NR, heat, theta^w"]),
 "c3-fixedt-growingp-onesided": dict(kind="deepen", tags=["euler-product","finite-stage","landau","prime-oscillation","zero-free"], nodes=[], okind="landau-equivalence-no-unconditional-hypothesis", restatement=True, lemmas=0,
   title="One-sided bound in P at a fixed strip point for the renormalised Euler stage",
   obstruction="The Laplace transform in log P of G(P;s) has singular points w = 0 and w = rho - s for every zero at every height, so a one-sided bound Re G <= C P^alpha or >= -C P^alpha at one fixed point is equivalent (up to eps, with the exceptional ordinate t = gamma for the upper sign) to Theta <= sigma + alpha: the Landau target of rows T2/P10 in twisted form. No unconditional input is known to give the one-sided bound without the two-sided one (survey, argued). The step from fixed P to all P is the statement to be proved.",
   defeat=["Liouville twist (G_lambda = -G_zeta identically: exact mirror)","unimodular twist U, RZ_b, DH (the criterion holds verbatim; growth is visible only within distance about 3 of a zero at P <= 1e7)","any control whose zero is farther than Pmax^(beta-sigma)/log Pmax is not separated at fixed height"]),
 "c3-twinladder-prime-built-chain": dict(kind="explore", tags=["de-branges","canonical-system","euler-product","finite-stage","twin-ladder","pontryagin"], nodes=["twin-ladder-jacobi-reconstruction","canonical-system-indivisible-chain","cdb-exist-noncircularity"], okind="stage-kernel-infinitely-many-negative-squares", restatement=False, lemmas=0,
   title="Twin ladder with a prime-built Hermite-Biehler chain (de Branges ordering)",
   obstruction="For every X >= 2 and every real symmetric normalisation, Theta_X = E_X^#/E_X has poles in Re s > 1/2 at 1 + 2 pi i k/log p, at 1 and at 3, 5, 7, ...; about T theta(X)/pi lie below height T, so the stage kernel has infinitely many negative squares and no stage de Branges or Pontryagin space or Hamiltonian exists. Adjoining a prime is neither contractive nor expansive; K_X(w,w) is not monotone in X. The negative-square count goes to infinity along the stages and to zero in the limit, which no monotone or semicontinuous device follows. The Euler factor is lossless only about Re s = 0; the functional equation is not an input of any finite stage. Restates rows G10/Q10.",
   defeat=["unimodular twist U","Liouville twist","E_a","RZ_b","Beurling (all fail at the same step as zeta: not separated)","DH, backward heat, theta^w: not formulable"]),
 "c3-helson-tail-fe-selector": dict(kind="explore", tags=["torus","prime-torus","helson","tail-set","functional-equation","control"], nodes=[], okind="tail-datum-versus-one-orbit-datum", restatement=False, lemmas=0, broken=1,
   title="Helson exceptional set on T^inf as a tail set; functional equation as selector",
   obstruction="chi = 1 lies in Helson's exceptional set E (pole at 1); E and E_zero are tail, flow-invariant, null, dense and comeagre, so no closed set, G_delta or rotation-invariant class contains the good set and misses E. A property holding at chi = 1 cannot be both tail-measurable and fail for finite modifications: strip zeros are a tail datum, the functional equation a one-orbit datum. Every every-window statistic that sorts E_zero correctly (Mertens sum, half-plane outer, band-limited window mean) is equivalent to zero-freeness. The band-gap identity for window means of log|F| holds for DH and E_a as well.",
   defeat=["DH (satisfies the band-gap identity, about 1e-7)","E_a (satisfies the band-gap identity)","finite modifications of zeta (same tail class; defeat any tail-measurable property)","drifted product measure with a planted zero at beta_0 (singular to Haar; generic and a.e. statements do not see it)"]),
 "c3-rs-matched-halfsum-hb": dict(kind="compute", tags=["riemann-siegel","hermite-biehler","levinson","torus","control"], nodes=[], okind="unmollified-levinson-loss", restatement=False, lemmas=0,
   title="Hermite-Biehler position of the Riemann-Siegel half-sum at matched height",
   obstruction="F_N(s) = sum_{n<=N} n^(-s), N = floor(sqrt(t/2pi)), has zeros in Re s > 1/2 at about one per five zeros of Z in every matched window tested (0.17 at 1e4 to 0.215 at 1e12; arb-certified lower bounds 5372, 7260, 8835 in windows of length 1e4 at 1e8, 1e10, 1e12). Smooth cut-off and unequal lengths do not remove them. By the Siegel/Levinson identity the family is the unmollified Levinson method with loss equal to the right-zero count; the mollified pivot is closed row P27. Positive density is measured or certified in finite windows, not proved for all heights. Multiplicativity affects the size of the failure in the adverse direction (referee: Bohr random-multiplicative model).",
   defeat=["DH (fails alike, slightly nearer to passing than zeta)","L(chi_5)","height translate","period-3 coefficients","random signs"]),
 "c3-multiwindow-converse-defect": dict(kind="combine", tags=["euler-product","rigidity","riemann-siegel","functional-equation","control","torus"], nodes=["euler-fe-coupling-at-height"], okind="window-local-fe-admits-translates", restatement=False, lemmas=0,
   title="Adversary: unimodular Euler product passing the functional equation in m windows with an off-line zero",
   obstruction="For any fixed m, H, eta there is an integer alpha != 0 such that zeta(s + i alpha) passes all m window tests above a height T_0(m,H,eta) (phase identity, defect 2|sin(Psi/2)|; Dirichlet simultaneous approximation): no statement 'defect <= eta in m windows implies chi(p) = 1' holds with m and eta independent of T. In the finite model, unimodular Euler products with defect below 1e-9 and a simple off-line zero exist below a crossover m* of order pi(N)/30 (within a factor about 2; beyond it local search found none, no certificate). Past the crossover the conclusion is 'F = zeta on the window', which also holds for bounded non-multiplicative sequences (Hamburger). The test reads conductor, one phase and about 30 reals per window, not the Euler product.",
   defeat=["unimodular twist / lattice height translate of zeta (passes any fixed number of windows at large height)","constructed unimodular Euler products with a prescribed off-line zero (m < m*)","DH and L(chi_5) fail only by conductor at m >= 2, at the same step as non-multiplicative sequences"]),
 "c3-repair-map-theorem-a": dict(kind="repair", tags=["control","prime-chain"], nodes=[], okind="filter-repair", restatement=False, lemmas=1,
   title="Map edits applied; second referee pass on Theorem A'; engine record repair",
   obstruction="Repair lane, no attack. Theorem A' holds; its first-moment sign comes from Schwarz-Pick on the polydisc and holds for DH (bracket real part >= 1.0597 Re a_1), so the no-go supplies neither R1 nor R3. The second-order (Sec) expansion is measured, not proved. Lead 20 closed except boundary nodes of R_a (a >= 1/2), Reinhardt-shell sections and sections containing the gamma term. Owed: closed-family patterns for rows P41, P42, G25, Q21, Q22 in engine/merge_outcomes.py; second reading of the DH derivation.",
   defeat=["not applicable (repair lane); the Theorem A' no-go holds for DH"]),
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
            L = dict(r); L.update(kind=m["kind"], refereeHolds=holds, referees=1, restatement=m["restatement"], knownArchitecture=False,
                                  brokenProved=m.get("broken",0), lemmasDecided=m["lemmas"], obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 3, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
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
        e["note"] = "round 3, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written (obstruction stands)", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
