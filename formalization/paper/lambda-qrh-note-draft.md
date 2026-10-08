# A conditional de Bruijn–Newman bound from a zero-free half-plane

**DRAFT — internal, for the user's decision. Not submitted, not published, not refereed.** Every Λ value below is a
conditional value, not a bound on Λ. The accepted unconditional bound remains Λ ≤ 0.2 (Platt–Trudgian with the
Polymath15 criterion). RH is open. Date of draft: 2026-10-08. Record module: `src/data/qrh-path-push-2026-10-08.js`.

---

## 1. Statement

Normalisation (Polymath15): Φ is the Riemann–Pólya kernel, H_t(z) = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du, H_0(z) = ξ((1 + iz)/2)/8,
and Λ is the de Bruijn–Newman constant (H_t has only real zeros iff t ≥ Λ). A zeta zero ρ = β + iγ corresponds to the
zero z = 2γ − i(2β − 1) of H_0, so |Im z| = |2β − 1|.

Hypotheses.

* **(Z_θ)** ζ(s) ≠ 0 for Re s > θ, with θ = 7/8.
* **(G0)** The analytic statements of D. J. Raymond's decreasing-barrier construction (Zenodo 22867547: main paper and
  *Analytic foundations*, Part I and Part II), with the written fixes Lemma W, Lemma S(θ) and Lemma FB(θ) of the internal
  reviews `raymond-g0-review-a-2026-10-08.md` and `raymond-g0-review-b-2026-10-08.md`.
* **(PT)** RH holds for 0 < γ ≤ 3000175332800 (Platt–Trudgian).
* **(L)** The route-P ledger (project-internal floor certificates and lemmas listed in §5); needed for (ii) only.

**Conditional value.** Assume (Z_{7/8}), (G0) and (PT). Then

  (i) Λ ≤ 118505710922701 / 10¹⁵ = 0.118505710922701.

If in addition (L) holds, then

  (ii) Λ ≤ 116091488672439 / 10¹⁵ = 0.116091488672439.

For comparison, (Z_{7/8}) alone gives Λ ≤ 9/32 = 0.28125 by de Bruijn's theorem (Lemma 1 below with t → (2θ−1)²/2), and
(G0) + (PT) with the classical strip give Raymond's 0.149395073827688 (his stated value 0.149396).

Status of the hypotheses: (Z_{7/8}) is the claim of openai/math family 003, whose Lean proof re-builds locally with only
the standard axioms (§6); it is not peer-reviewed. (G0) has been read only inside this project (two internal passes, no
ERROR found; §5). (PT) is peer-reviewed. (L) is single-project, internally refereed.

## 2. The substitution lemma

**Lemma 1 (zero-free half-plane → time-zero strip, propagated).** Let 1/2 ≤ θ < 1 and assume ζ(s) ≠ 0 for Re s > θ. Then
every zero of H_0 satisfies |Im z| ≤ 2θ − 1, and for every t ≥ 0 every zero of H_t satisfies
(Im z)² ≤ max((2θ − 1)² − 2t, 0).

*Proof.* The zeros of H_0 are the points z with ξ((1 + iz)/2) = 0, i.e. the nontrivial zeros ρ = β + iγ of ζ, with
Im z = 1 − 2β. By hypothesis β ≤ θ. Since ξ(s) = ξ(1 − s), 1 − ρ is also a zero, so 1 − β ≤ θ. Hence
|1 − 2β| ≤ 2θ − 1. The second statement is de Bruijn's theorem (de Bruijn 1950, Thm 13; Polymath15 Thm 3.2 with t0 = 0,
y0 = 2θ − 1): if all zeros of H_{t0} satisfy |Im z| ≤ y0, then all zeros of H_t, t > t0, satisfy
(Im z)² ≤ max(y0² − 2(t − t0), 0). ∎

**Lemma 2 (start substitution in a decreasing-barrier chain).** In Raymond's chain the time-zero zero location is read in
exactly one place: the barrier start q(0) = q0 must exceed sup (Im z)² over zeros of H_0 with Re z > X, with strict entry on
the first substep [0, 10⁻⁸]. Under (Z_θ) the condition q0 > 1 may be replaced by q0 > (2θ − 1)², with the strict-entry check

  (S1)  q0 − (2 + c0·q0)·10⁻⁸ > (2θ − 1)²,

where c0 is the first-substep rate. Nothing else in the chain changes.

*Proof (summary; full text: Lemma S(θ) and Lemma FB(θ), review B §§5, 8; independent confirmation, review A §7).*
On the first substep the barrier is q(t) = (q0 + 2/c0)e^{−c0 t} − 2/c0, which is convex, so
q(t) ≥ q0 − (2 + c0 q0)t. By (S1) and Lemma 1, on [0, 10⁻⁸]:
q(t) > (2θ − 1)² ≥ (2θ − 1)² − 2t ≥ (Im z(t))² for every zero, so no zero meets the barrier before 10⁻⁸. The first-contact
argument after 10⁻⁸ (compactness via Polymath15 Thm 1.5(i) and Hurwitz; backward Hermite splitting via Prop 3.1(ii)) and
the terminal step Λ ≤ T* + q_e/2 (Lemma 1 again, at t0 = T*) do not read q0. The other uses of the classical strip in
the chain (the top edge |y| = 1 of the head cell at every t, and boundedness for compactness) are unconditional facts
and stay in place. Every path-dependent condition of the chain (kernel admissibility v ≤ ρ², self-pair caps
nondecreasing in V) is an upper bound on q, so a lower barrier path satisfies them more easily; they are re-checked
substep by substep in exact arithmetic regardless. ∎

The substitution is available to any decreasing-barrier chain of this type; nothing in it is specific to this project.

## 3. Numbers (exact rationals)

Start: θ = 7/8, (2θ − 1)² = 9/16.

| quantity | exact value | decimal |
|---|---|---|
| de Bruijn from (Z_{7/8}) alone | 9/32 | 0.281250000000000 |
| Raymond chain, classical strip (control) | 18674384228461/125000000000000 | 0.149395073827688 |
| Raymond chain, 7/8 start, q0 = 9/16 + 2·10⁻⁶ — value (i) | 118505710922701/10¹⁵ | 0.118505710922701 |
| same, Raymond's alternate terminal log bound | 59252855461351/(5·10¹⁴) | 0.118505710922702 |
| S1 margin for (i) | 114215105972865586110341/(59405·10²⁴) | 1.922651·10⁻⁶ |
| route P, 7/8 start, first run | 58854156705477/(5·10¹⁴) | 0.117708313410954 |
| route P, 7/8 start, re-tuned — value (ii) | 116091488672439/10¹⁵ | 0.116091488672439 |
| q0 for (ii) | 5625001/10⁷ = 9/16 + 10⁻⁷ | |
| first-substep rate c0 for (ii) | 41336831094003950997/3755300000000000000 | 11.0076… |
| S1 margin for (ii) | 67904283759396681637924003/(37553·10²⁹) | 1.8082·10⁻⁸ |
| (i) − (ii) | 2414222250262/10¹⁵ | 0.002414222250262 |

Value (i): 60,675 substeps, terminal cell 474. Value (ii): 59,439 substeps, terminal cell 464, terminal time 29719/256000.

Re-tuning ladder for (ii), one exact run per rung (the final value is computed directly, not by adding gains):

| rung | change | value | step |
|---|---|---|---|
| baseline | first 7/8 run | 0.117708313410954 | |
| E1 | start offset 2·10⁻⁶ → 10⁻⁷ | 0.117708137107302 | −44075913/(2.5·10¹⁴) |
| E2 | route-9 height tables with r = 3/5, λ < 2 kernels | 0.117312236761635 | −395900345667/10¹⁵ |
| E3 | height sets 0.88× and 0.91× PLAN (cells 0–199) | 0.116174796162911 | −284360149681/(2.5·10¹⁴) |
| E4 | per-cell heights at the producer moment-cap limit (cells 0–250) | 0.116110902986179 | −15973294183/(2.5·10¹⁴) |
| F1 | 79 new r = 3/5 two-point kernels | 0.116091900099009 | −1900288717/10¹⁴ |
| F2 | same kernels on route-3 joint modes | 0.116091488672439 | −41142657/10¹⁴ |
| total | | | −323364947703/(2·10¹⁴) = −1.616824738515·10⁻³ |

Arithmetic conventions (both chains): exact rationals; barrier step q ↦ ceil_{2⁻⁹⁶}((q + 2/c)·T₁₈(cδ) − 2/c) with T_n the
degree-n Taylor partial sum of e^{−x} (an upper bound for even n on 0 ≤ x < 1); substep δ = 1/512000; terminal lag from a
degree-11 upper bound for log(1 + z); U = ceil_{10⁻¹⁵}(t + lag + q_e/2).

## 4. Reproduction

All paths are relative to the project repository. The scripts and data live in the project's `tmp/` tree; they are not
a released artefact.

```bash
# (a) Lean check of (Z_{7/8}) — openai/math, commit adc7f1241, lean/ directory
cd /tmp/qrh-verify/lean        # or a fresh clone of github.com/openai/math, then `lake update` per ComparatorChallenges/README.md
LEAN_NUM_THREADS=4 lake build +OAI.NumberTheory.DirichletL.Nonvanishing
lake env lean /tmp/qrh-verify/check/SolutionType.lean    # statement dump + #print axioms
lake env lean /tmp/qrh-verify/check/ChallengeType.lean   # comparator challenge statement (Mathlib only)
# details and cold timings: formalization/external/openai-math-qrh-verification.md

# (b) value (i): Raymond chain with the 7/8 start (≈ 70 s)
.venv-arb/bin/python tmp/oai-lambda-raymond.py OUT.json X1 --thetas 7/8

# (c) value (ii): route-P consumer, re-tuned (≈ 11 min) + its step verifier (≈ 1 min)
cd tmp && XK=qrh-tune-out/xkernels_final.json KK=qrh-tune-out/xkernels_final.json \
  ./qrh-tune-final.sh F2_repro 1/10000000 W4 m097 m094 m091 QA_m0.88 QB_m0.91 QC_cliff

# (d) independent from-scratch step verifier (shares no code with (c))
cd tmp && ./qrh-ref-run.sh refverify /tmp/qrh-tune-dump-F2_repro F2_repro_refverify
```

Expected: (b) `"U": "118505710922701/1000000000000000"`, 60,675 steps; (c) and (d) U = U_robust =
116091488672439/10¹⁵, 59,439 steps, 0 failures. The per-substep dump hash differs between runs only in id()-based labels
of route-3 multi-option records; every other field reproduces exactly.

## 5. Dependencies and status

| item | used by | status |
|---|---|---|
| (Z_{7/8}): ζ ≠ 0 for Re s > 7/8 | (i), (ii), 9/32 | external claim (openai/math family 003, written by an internal OpenAI model); Lean proof re-built locally, axioms propext / Classical.choice / Quot.sound, statement equal to the comparator challenge; official comparator and independent kernel check not run; not peer-reviewed |
| Lemma 1 (de Bruijn propagation) | all | proved (de Bruijn 1950; Polymath15 Thm 3.2) |
| Lemma 2 (start substitution) = Lemma S(θ) + Lemma FB(θ) | (i), (ii) | written proof, internal review A and B; no external reader |
| (PT) RH to γ ≤ 3000175332800 | (i), (ii) | peer-reviewed; used once, as the head condition at t = 0 (clearance 175,239,886 in γ) |
| Raymond AF Part I §§2–5 (wall, Abel transfer, remainders) | (i), (ii) | internal review A: no ERROR; expository GAPs 2a, 3a, 3b, A1–A3 with written fixes (Lemma W, Lemma B.3, uniformity table) |
| Raymond main paper eq. (1), Lemmas 2–3, Theorem 4, eqs. (11)–(15); Theorem 4′ | (i), (ii) | internal review A: SOUND; G0-c (joint-floor lemmas) has no reader outside the project |
| Raymond AF Part I §§6–12 | (i), (ii) | internal review B: no ERROR; GAP B1 (start written for q0 > 1) and B2 (first contact) fixed in text; latent B3 (q-window floors) not exercised (0 window substeps) |
| Raymond AF Part II (sharp kernel) | none of (i), (ii) | used on 0 substeps on the 7/8 paths |
| floor tables at PT height (Arb, two lanes) | (i), (ii) | interval-certified, regenerated bit-identically from Raymond's code; G0-d referee internal |
| kernel certificates (13 catalogue) | (i), (ii) | exact Bernstein certificates; re-certified with separately written code in review B |
| route-P ledger: r2 structured floors (11,304 substeps), WOL-C outer lemma, time-box allowance, r2 L-slope lemma | (ii) | project-internal, single engine, internal referee; L-slope lemma not reviewed |
| route-P ledger: route-3 joint floors, Theorem MP (11,212 substeps) | (ii) | written, internal referee; joint-pair and Track-A gain code single-implementation |
| Track-A joint floors at re-tuned heights (36,923 substeps) | (ii) | G0-d family checks 0 failures; all 289 used cells re-certified at a different precision by the internal referee |
| 79 new r = 3/5 kernels | (ii) | exact Bernstein certificates; second-method Arb re-certification by the internal referee |
| (5.4), k > 0, h·v0 > 2 at the re-tuned heights | (ii) | (5.1) and producer domain checks enforced per cell; the other three: recheck open |

## 6. Credits

* **D. J. Raymond**, *Correlated translated probes and the bound Λ < 0.149396* and *Analytic foundations for the
  time-zero upper-bound construction*, v1.0, 21 Sep 2026, Zenodo 22867547. The decreasing-barrier method, the probe
  floors, the kernel catalogue and the consumer arithmetic used for both values are his; this note changes only the
  start (Lemma 2) and, for (ii), adds the route-P floors and kernels.
* **openai/math, family 003** (github.com/openai/math, released 2026-10-06; manuscript of 30 Sep 2026 and its Lean
  formalisation, theorem `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`). The release states that the manuscripts
  were written by an internal OpenAI model and that unformalized results may contain errors. Hypothesis (Z_{7/8}) is
  this claim.
* **D. J. Platt and T. S. Trudgian**, *The Riemann hypothesis is true up to 3·10¹²*, Bull. London Math. Soc. 53 (2021),
  792–797. Hypothesis (PT).
* **D. H. J. Polymath (Polymath15)**, *Effective approximation of heat flow evolution of the Riemann ξ function, and a
  new upper bound for the de Bruijn–Newman constant*, Res. Math. Sci. 6 (2019), 31; arXiv:1904.12438. Normalisation,
  Theorems 1.3, 1.5, 3.2 and Proposition 3.1, and the barrier framework.
* **N. G. de Bruijn**, *The roots of trigonometric integrals*, Duke Math. J. 17 (1950), 197–226. Theorem 13 (Lemma 1).
* **B. Rodgers and T. Tao**, *The de Bruijn–Newman constant is non-negative*, Forum Math. Pi 8 (2020), e6. Λ ≥ 0, so
  any upper bound is a statement about how far RH can fail, not a proof of it.
* Route-P floors, kernels, re-tuning and the internal reviews: this project (mathexplorer), 2026-09/10.

## 7. Scope

* The values (i) and (ii) are conditional; neither is a bound on Λ until (Z_{7/8}) is accepted by peer review and (G0)
  has an external referee; (ii) additionally needs (L).
* Without (Z_{7/8}) nothing in this note moves Λ: PT Λ ≤ 0.2 stands.
* The note does not bear on RH itself: by Rodgers–Tao, Λ ≥ 0, and RH ⟺ Λ = 0.
* Decision items for the user: whether to circulate; whether to contact D. J. Raymond first (the substitution applies to
  his chain directly and gives (i) without any project-specific input); whether to wait for the official comparator run
  and an external G0 referee.
