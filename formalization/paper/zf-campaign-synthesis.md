# Zero-free half-plane below 7/8: campaign synthesis (2026-11-01)

This is an internal working note. It has not been refereed externally, and nothing in it has been committed upstream.
Its data module is `src/data/zero-free-campaign-2026-11-01.js`, and the assertions in `ZERO_FREE_CAMPAIGN_ASSERTIONS` pass under plain node (10/10).

**Verdict.** None of the five levers produced a θ < 7/8 that survived both referees. The best abscissa is still 7/8,
from the openai/math family-003 manuscript. Its authors have Lean-checked it, but the manuscript itself is unrefereed.
PR #14's B = 17497733/20000000 = 0.87488665 is still conditional on two things: the imported analysis of Xu–Sang v2,
and the 7/8 theorem, which licenses stage-0 κ = 3/4. No Raymond-chain Λ was computed. PT Λ ≤ 0.2 stands, RH is open,
and NO QED.

## 0. The question: was the PR #27 audit read?

Yes. All five final writeups were written or rewritten after the PR #27 audit snapshots were taken (13:40). Each
writeup carries an overlap table keyed to atlas sections. The first drafts of high-side (12:59), quartic (13:01),
new-probe (13:09) and cubic (13:12) predated the audit. All four were redone, and the pre-audit versions are kept in
`tmp/`. The ten referee passes checked these citations and found them accurate, with two wording corrections:

* atlas §10 states only that the floor implies a zero-free region. It does not state an equivalence "through Landau".
* atlas §10's sentence "improved global floors remain unproved" is about the operator floor ε₀ and is correct as
  written.

Atlas sections used:

* **§10** covers PR #14 and Xu–Sang (B = 0.87488665, conditional), the sixth-phase filter retaining eigenvalue one, the
  V7 floor implication, and U^{39/40+ε}. These are inputs to the high-side, new-probe and v7-floor levers.
* **§9** says a failed sufficient estimate is not a negative actual form. Every obstruction below is an obstruction to
  a sufficient estimate only.
* **§11** says a uniform positive margin is the wrong target. This matches V7 Remark A.3: under RH, Ψ has arbitrarily
  small returns.
* **§7** treats the Toeplitz step compression through Ψ. The v7-floor referee asked for it to be cited.
* **§12** says Λ prices are not Newman-Λ bounds. Every Λ figure below is a price, not a bound.
* **The closing line** names three open tasks: an all-scale signed arithmetic estimate, a cofinal actual-form floor,
  and an exhaustive theta certificate. No lever here supplies any of them.

## 1. Lever results (after referee corrections)

| Lever | Verdict | Referees | Main surviving result | Withdrawn by referees |
|---|---|---|---|---|
| Cubic field (Q(√−3), k = 3) | FAILS | major, major | Gauss-class ledger; within R1/R2 the reflected rows are cubic or principal (Prop 3.1); duality at k = 3 (b cancels); PR #14 filter energy at order 3 is 1/2 (vs 1/5) | "not dead at automorphy", 8/9, c < 8/13, Framework B ≈ 0.807: all assume the R2 conductor exponent a = 2, which the referees dispute (a = 2 vs a = 4) |
| Quartic / GL(2) | FAILS | minor, minor | Lemma P (residue filters ≡ 1 on G_k); the Framework A ceiling 1 − 1/(2k) is 7/8 at k = 4; Lemmas S and RS | sieve threshold c < 5/8 corrected to c < 2/3 (θ₄ = 1 − (2−3c)/(8(1−c))); "ties 7/8" applies to Framework A only |
| High-side counts | FAILS | minor, major | closed-form Xu–Sang ceiling B*(κ); certificate at B* + 8.34e-11; (H) certificate 0.87382; gate cap 0.8734878; envelope 0.8742861 | "≤ 6.0e-4 in any system" is now scoped to counts at σ ≥ 7/10 in XS (0 in the paper system) |
| New probe (non-residue) | FAILS | major, major | P14(a–c) for a fixed prime set: the coherent block e₀t⁶a⁶ is scaled by one constant A(e₀); E1 (classical); Lemmas 2.8 and 2.9 | the block was misidentified as the global sixth powers; "PR #14 §5 fails" (still open); "lever closed" (only the examined families) |
| V7 floor | FAILS | minor, minor | Theorem A (box-floor exponent = 2Θ − 1, classical); Cor B (p = 3/4 admissible, relative to the 7/8 theorem and Platt–Trudgian); Prop C | "p_box = 3/4" restated as "admissible"; labels on the κ-scan changed to NUMERICAL; the floor/coset link relabelled HEURISTIC |

### 1.1 Cubic field: the R2 conductor exponent is the open hinge

Under model A-V with dual length N(row)^a/D:

θ_A = 1/2 + max(1, 2 − (1 + 1/c)/(1 + a))/3.

* **At a = 2:**
  * with Heath-Brown's sieve (c = 2/3), θ_A = 8/9;
  * θ_A = 7/8 at c = 8/13;
  * with the optimal sieve (c = 1/2), θ_A = 5/6;
  * with c = 2/3, θ_A < 7/8 exactly when a < 13/7.
* **At a = 4:** Heath-Brown gives θ_A = 1. Referee 1 (using a richer model) finds that no sieve gets below 7/8, and the
  Framework B count is about 1.05.

The two referees read 7/8 Prop 5.1 differently:

* **Referee 1:** index π gives an effective conductor N(π), and index π² gives N(π)².
* **Referee 2:** the conductor is q_c² for both j_p.

Numerics E1–E3 cannot tell a = 2 from a = 4. The base conductor (h = 1) is about 10³, and the extended bins are
inconclusive.

### 1.2 High side: the Xu–Sang ceiling in closed form

In the imported system, set c = 1/(3κ). Let δ* be the root in (0, 5/6) of

(216 − 18c²)δ² + (30c² + 108c − 504)δ + 200 − 80c = 0.

Then ℓ* = (5 − 6δ*)/(9 + 6δ*(1 + c)) and B* = 11/12 − ℓ*/4. This gives:

* B*(3/4) = 49619/53814 − √715621/17938 = 0.8748869894;
* B*(29991/40000) = 0.8748866496166314.

E_XS is nondecreasing in κ, so the obstruction holds on the whole source κ-range. PR #14's certified value is 3.8e-10
above B*.

The paper's count enters with weight h; in the XS endpoint it enters with weight 3h/4. That moves the binding bin to
δ* = 0.4693, i.e. Re s = 0.7347.

### 1.3 New probe: the duality block is a coset of e₀

e₀ = (b*e_ξ)⁻¹ is an S-unit and is generally not a sixth power. PR #14's filter, normalised by A(1) = 1, takes the
value A(e₀) → 6/(5d) − 1/5 on the block, where d is the Kummer order of e₀. For d = 1, 2, 3, 6 this gives 1, 2/5, 1/5
and 0.

So a residue-symbol multiplier cannot remove part of the block, which carries at least κ_P Z^{−ε} of the A-norm. But
PR #14 §5's coefficient-specific overlap route has not been shown to fail. Whether the signal is damped by the same
A(e₀) is the heuristic P14(d).

The low-side prize is b/12 (83/96 at fixed geometry). At the paper geometry it is capped at about 2.9e-4 in θ (about
9e-5 in Λ) by the margin of Lemma 20.2's binding bin, 2.2815e-4.

### 1.4 V7 floor: a restatement

Theorem A: Ψ(W) = Σ_ρ (e^{(ρ−1/2)W} − 1)/(ρ − 1/2)². So the exponent of the box floor is exactly 2Θ − 1.

The rest follows from that:

* The operator floor ε₀ implies the half-plane. The converse is proved only when there is a uniform bound M₊ on the
  number of off-line zeros per unit window (Prop C).
* The Möbius energy and the D-bound are equivalent to the half-plane.
* κ feedback contracts by about 1.2e-3 in the paper system (inputs below 7/8 only) and about 3.0e-3 in XS. It stalls
  at p∞ = 0.749773294 (conditional).

## 2. Obstructions per lever

1. **Duality, for every sextic probe.** The exceptional coset exists exactly when ξ⁶ = 1, which is also the condition
   for the high-side signal. Because the coherent block is scaled by one constant, it can be evaluated but not
   filtered. Evaluating it needs sextic theta coefficients at squarefree indices, which are unknown.
   * At k = 3 the same structure appears (b cancels).
   * At k = 4 the copy rows are proved, and the other roles hold only by analogy.
2. **Changing the probe.**
   * Cubic: twist conversion works only through the cubic theta, and the R2 exponent is disputed.
   * Quartic: the best is a 7/8 tie, and only with an open sieve (c ≤ 1/2).
   * GL(2): density 0, or circular.
   * Other examined families: J = O(1).
   * Not excluded: non-Poisson summation formulas, and residue families of unbounded order.
3. **High side.**
   * In XS, counts at σ ≥ 7/10 are worth at most 6.0e-4. Below 7/10 they are worth up to 1.40e-3 (the gate cap), but
     no family count better than Ingham-type is known there.
   * In the paper system, counts at σ ≥ 7/10 are worth 0. Below 7/10, DH counts would be worth up to 5.2e-3 (167/192).
4. **Floor and energy.** These restate the half-plane. The operator floor is at least as strong.
5. **The joint limit at Lemma 20.2.** At the paper geometry, any low-side gain above about 2.9e-4 needs a re-optimised
   geometry and a re-proved Part II.

All five obstruct sufficient estimates only (atlas §9).

## 3. Λ

No θ < 7/8 survived both referees, so `tmp/oai-lambda-raymond.py` was not run with q0 = (2θ − 1)² + 2e-6. The
heuristic prices in the lever notes are not bounds (atlas §12). They are:

* cubic ≈ 0.807: about −0.02 of conditional Λ;
* H-GM: about 1.74e-4;
* (H) re-tuned: about 3.5e-4.

## 4. Most promising next lever

**Settle the cubic R2 conductor exponent.** Write the index-r coefficient of the ᾱ-twisted 6-fold Kubota series,
together with its functional equation and Whittaker factor. Then calibrate the rule for n = 3 against 7/8 Prop 5.1:
j_p = 4 at index π, and j_p = 2 at index π². This is a finite check, and it settles the question:

* **If a = 4**, the cubic lever is closed in both frameworks.
* **If a = 2**, cubic Framework B (heuristic ≈ 0.807) is the only campaign route whose sub-7/8 heuristic count is not
  blocked by a proved obstruction. Its six missing inputs become the work list:
  1. R2 with cusp data;
  2. cubic Lemmas 5.5, 14.2, 14.3 and 15.1;
  3. a cubic Gram bound;
  4. a λ-adic device;
  5. the high side at k = 3;
  6. an endpoint certificate.

**In parallel:** put arXiv:2610.15291v2 on the machine and audit the XS small-δ and capacity gates line by line. These
gates bind the high side, and they may themselves be count bounds.

## 5. Files

* Lever notes: `formalization/paper/zf-campaign-{cubic-field,quartic-gl2,high-side,new-probe,v7-floor}.md`
* Scripts: `tmp/zf-cubic-field-*.py`, `tmp/zf-quartic-gl2-*.py`, `tmp/zf-high-side-xs-*.py`, `tmp/zf-new-probe-*.py`,
  `tmp/zf-v7-floor-*.py` (with logs)
* Referee scratch: `/tmp/referee-cubic/`, `/tmp/ref2/`, `/tmp/referee-hs-r2ref1/`, `/tmp/ref2-hs/`, `/tmp/ref2-run/`
