#!/usr/bin/env python3
"""Round 4 learn step: lanes.jsonl lines, engine/outcomes/<slug>.json, engine/outcomes.json entries. Idempotent."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
recs = json.load(open(os.path.join(ROOT, "campaign", "round4_records.json")))
META = {
 "c4-helson-discrepancy-zerofree": dict(kind="deepen", tags=["helson","discrepancy","euler-product","landau","beurling","control","zero-free-region"], nodes=[], okind="relative-to-zeta-circular", restatement=False, lemmas=1,
   title="Power-saving discrepancy of a completely multiplicative unimodular chi versus a zero-free region",
   obstruction="Landau's argument on H = F F*/zeta^2 = exp(-2A), A a non-negative Dirichlet series, gives ord_F(s) + ord_F(conj s) = 2 ord_zeta(s) on Re s > sigma_0 (sigma_0 = top real zero of F in (theta,1), or theta): the hypothesis compares F with zeta and nothing else, so a zero-free statement for F right of sigma_0 is the same statement for zeta (circular). The proof does not use the additive spacing of the integers and transfers to Beurling systems. Real zeros of F unrelated to zeta can lie right of theta (measured: greedy thin twists have a double zero at b with discrepancy exponent near b/2), so f(theta) = max(Theta, r(theta)). R1 holds for the relative theorem only, not for a conclusion about zeta. Open: r(0), i.e. whether E << x^eps with c != 0 allows a real zero of F in (0,1).",
   defeat=["Beurling (the argument transfers unchanged: not separated)","greedy thin sign twists b = 0.5, 0.7, 0.8, 0.9 (double real zero at b, discrepancy exponent near b/2; measured to 1e8)","DH fails at the step producing the non-negative series A (no Euler product); this is the only separation and it is relative to zeta"]),
 "c4-thin-twist-control-78": dict(kind="deepen", tags=["seven-eighths","control","sign-twist","euler-product","sextic-theta","periodicity","poisson"], nodes=[], okind="new-control-localises-periodicity-input", restatement=False, lemmas=0,
   title="Thin sign twist with a real zero in (7/8, 1) as a control for the 7/8 mechanism",
   obstruction="Control lane. The completely multiplicative eps = -1 on a thin regular prime set S gives F = zeta(s)(s-b)W(s) with a simple zero at any b in (1/2,1) (relative to a Hoheisel-type short-interval theorem cited from memory). In a walk of the 7/8 proof by hypotheses (not replayed), every multiplicative and local-size step holds for eps; the first unavailable step is Proposition 5.1 / Lemma 5.8: periodicity of the target weight to a ray-class lattice (also Lemmas 4.8, 8.1, 17.5). Proposition D: the low estimate (2.4) and the high comparison (2.5) cannot both hold for the eps-probe; which one fails is not decided. So the 7/8 mechanism uses lattice-translation invariance of the coefficients (Poisson dual uniform in the modulus) beyond multiplicativity.",
   defeat=["THIN itself is the new control: it passes complete multiplicativity, unimodularity at every prime, continuation, the pole, density-one agreement with zeta at primes and local temperedness, and has a zero at b"]),
 "c4-fe-stage-rouche-crossing": dict(kind="combine", tags=["euler-product","finite-stage","functional-equation","rouche","hurwitz","explicit-formula","weil","control"], nodes=["euler-fe-coupling-at-height","dbn-prime-torus-phase-closure"], okind="rouche-inequality-equals-box-zero-freeness", restatement=True, lemmas=0,
   title="Functional-equation-symmetrised Euler stage with Rouche against the approximate functional equation",
   obstruction="Gonek's stage P_X + chi conj(P_X) has all zeros on the line for any non-vanishing P_X: the on-line property contains no arithmetic. The Rouche (degree) inequality zeta/G_X not in (-inf,0] on a box boundary implies the box is zero-free and is implied (Gonek Thm 5.1) only by zero-freeness at sigma_0 - C loglog t/log X; nothing strictly weaker implies it, and at fixed X it fails at arbitrarily large height (Montgomery, recalled). The boundary quantity log zeta - log P_X - log(1+Theta) is a sum over all zeros; the approximate functional equation re-expresses it. With Fejer weights the k = 0 comb term is the Weil functional on Fejer tests (rows P10/eq48). Not established: non-locality in half-plane form (step 4), any general no-go for the approximate functional equation.",
   defeat=["unimodular twist U (passes the stage on-line theorem; fails only at the step that is the conclusion)","every non-vanishing P_X (on-line property)","DH and T-NR fail only at non-vanishing of the stage factor","not run: heat, Beurling, E_a, theta^w, phase-rotated transfer operator"]),
 "c4-stage-collision-law": dict(kind="combine", tags=["euler-product","finite-stage","torus","prime-torus","rouche","collision","control","davenport-heilbronn"], nodes=["collision-local-index","euler-fe-coupling-at-height"], okind="torus-invariant-event-positive-rate", restatement=False, lemmas=0,
   title="Law of stage-zero collisions and of the Rouche margin for the symmetrised Euler stage",
   obstruction="The prime-only exit event (double zero of the stage, Re D_X(1/2+it) = theta'(t)) is invariant under torus rotation and has a positive height-independent rate at fixed a = log X/log T (torus model followed to T = 1e20), so it carries no zero information. The Rouche inequality on Re s = 1/2 + c/log T fails at a height-independent positive fraction of sampled points for a = 0.5, c = 1, 2 (zeta 0.6-1.0% and 0.1-0.25%); whole-window passes occur only at (a=0.25, c=4) and (a=0.1, c=8) for T >= 1e8. The Davenport-Heilbronn two-character stage passes at comparable height-independent rates (1.3%, 0.6%) and tracks its off-line zeros: the comparison does not use the Euler product and gives box counts, not location. Measured in finite windows up to T = 1e9; nothing proved about rates.",
   defeat=["DH (two-character stage: same kind of pass rates, phase-locking holds)","lattice height translate WT (same pass rates)","torus rotation (the prime-only event is invariant)","not run: backward heat, sign twist, E_a, T-NR, Beurling, phase-rotated transfer operator, theta^w"]),
 "c4-laxphillips-hecke-compression": dict(kind="explore", tags=["lax-phillips","hecke","scattering","resonance","eisenstein","control","operator-norm"], nodes=["bridge-scattering-factorisation","antihermitian-strip-bound"], okind="hecke-is-function-of-wave-group", restatement=False, lemmas=0,
   title="Hecke operators compressed to the Lax-Phillips space; norm bound on resonance states",
   obstruction="On the Eisenstein channel T_p = U(log p) + U(-log p) = 2 cos(log p sqrt(-L)): a function of the wave group, defined for any group. Its compression to K is Z(log p) + Z(log p)^*, of energy norm at most 2 for every inner scattering function; resonance states are not its eigenvectors. For the uncompressed T_p in the weighted-L2 family admissibility of the resonance state already implies the eigenvalue bound; on finite spans a norm bound for all p is equivalent to resonance location; no positive-definite form makes T_2 and T_3 both symmetric on a resonance state. The only inequality obtained is Re rho <= 1. All arithmetic sits in the scattering function phi. Not closed: norms outside the one weight family; infinite-dimensional independent derivations of a norm bound.",
   defeat=["moved-resonance inner functions (three configurations: numerical range inside (-2,2) alike)","E_a = zeta(s+a)zeta(s-a) (passes every statement)","non-arithmetic groups (the Eisenstein-channel operator exists for any group; cited resonance data)"]),
 "c4-ramare-factorisation-pointwise": dict(kind="explore", tags=["matomaki-radziwill","ramare-identity","mean-value","pretentious","hardy-littlewood","tail-set","control"], nodes=["af-rank-trace-inertia"], okind="mean-value-cap-log-power-saving", restatement=False, lemmas=0,
   title="Ramare / Matomaki-Radziwill factorisation as a source of every-window or one-sided statements",
   obstruction="(i) Bandwidth alpha in (1,2) in the inertia chain needs the Fejer-averaged Hardy-Littlewood error below X^(1/alpha) log X with H = X^(1-1/alpha): a power saving of exponent 1-1/alpha, against proved log-power savings (range H >= X^(8/33) recalled, source not opened). (ii) Outputs are mean squares on Re s = 1; the large-value count at threshold P^-a is T^(2a), against exponent 0 needed at a = 1-sigma to exclude a zero. (iii) Pretentious and log-averaged statements are invariant under finite modification and rotation (tail type), with tolerances (log x)^-A above the size x^(beta-1) of a zero term. The method's conclusions are closed under linear combination, so DH satisfies them: multiplicativity is essential to the proof, not to the conclusion class. MV-CAP and tail type.",
   defeat=["DH (conclusions hold by linearity, periodic coefficients)","Liouville twist","bounded and unimodular twists","finite modifications FM (tail-type hypotheses)"]),
 "c4-kloss-marks-scaleup": dict(kind="compute", tags=["seven-eighths","kloosterman","large-sieve","sextic-theta","tro6","certificate"], nodes=[], okind="frontier-measurement-model-point", restatement=False, lemmas=0,
   title="Mark Gram matrix at the model point (1,1/3): scale-up in Z and number of marks",
   obstruction="Partial result on frontier part B, not an attack on R4. mu(G)/tr G is flat in Z over a factor 64 (1.108-1.130; exponent -0.002 +- 0.004) and equals lambda_max of the common-column overlap matrix to 0.7% (Lemma O, elementary, gives the principal part: bounded in a dyadic slot, log log over all primes). Stops at: the off-principal part is measured at or below independent-vector size, not proved; random per-column coefficients behave identically, so the flatness is not specific to the theta coefficients; the model omits the multi-slot product and the cube completion; the float64 error model is measured, not worst-case a priori. Conjecture WLS at 31/36 stays conditional; no abscissa moves.",
   defeat=["random phase per column (behaves identically: the measurement does not separate the manuscript coefficients)","Kubota pole and quadratic-sum controls grow (+0.37 in Z), as expected"]),
 "c4-repair-map-engine-r3": dict(kind="repair", tags=["control","filter","generator"], nodes=[], okind="filter-repair", restatement=False, lemmas=0,
   title="Map edits (16), engine merge, closed-family patterns, generator device rule",
   obstruction="Repair lane, no attack. Map replay byte-identical; engine merge run (37 closed, 29 families, 11 WT/FM edges); generator rejections 16,486 -> 42,311 with the new rules. Remaining defect: 54 of the top 60 candidates rest on the keyword role 'crossing', which still admits a mean-value node and two certificate nodes; all 776 candidates with the Rouche device node are exempted by an `unless` keyword although the device is now closed by c4-fe-stage-rouche-crossing. Referee correction: 8 of 13 new family patterns match candidates (2 add rejections), not 2 of 13.",
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
            L = dict(r); L.update(kind=m["kind"], refereeHolds=holds, referees=1, restatement=m["restatement"], knownArchitecture=False,
                                  brokenProved=m.get("broken",0), lemmasDecided=m["lemmas"], obstructionKind=m["okind"], nodes=m["nodes"], tags=m["tags"])
            f.write(json.dumps(L, ensure_ascii=False) + "\n")
        out = {"slug": r["slug"], "round": 4, "kind": m["kind"], "nodes": m["nodes"], "tags": m["tags"], "verdict": r["verdict"],
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
        e["note"] = "round 4, score %d, referee %s: %s" % (sc, "holds" if holds else "does not hold as written (obstruction stands)", m["obstruction"][:300])
tmp = op + ".tmp"; json.dump(eng, open(tmp, "w"), indent=1, ensure_ascii=False); os.replace(tmp, op)
print("lanes:", sum(1 for _ in open(lp)), "outcomes:", len(os.listdir(os.path.join(ROOT, "engine", "outcomes"))), "engine entries:", len(eng))
