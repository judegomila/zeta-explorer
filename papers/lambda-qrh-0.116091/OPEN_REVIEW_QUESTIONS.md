# Open review questions

These are the questions on which an external referee is asked to make an
independent judgment. An adverse answer to a load-bearing question can remove
value (ii), value (i), or both.

Status: **conditional result, draft, not submitted, not peer reviewed.** The
accepted bound is Platt–Trudgian's `Λ ≤ 0.2`. RH is open.

Internal labels used in the project's records, for orientation: G0 = Raymond's
analytic chain as a whole; G0-a = Lemma CG; G0-c = Raymond's main-paper joint-floor
lemmas (eq. (1), Lemma 2, Lemma 3, Theorem 4); G0-d = AF §§6–9 one-point input;
route P = the project's additional floors and kernels.

## Priority 1: the start substitution

Compare `PROOF_NOTE.md` §§1, 3, 5 with Raymond AF §11 (lines on the start, "the
barrier starts at `q0 > 1`; an explicit first-cell check keeps it above one for at
least `10⁻⁸` units of time"), main §7–8 and AF Part II §5.

1. Does Lemma 1 follow from `ζ(s) ≠ 0` for `Re s > 7/8`, the functional equation and
   Polymath Theorem 3.2 with `t0 = 0`, `y0 = 3/4`?
2. Is the half-plane used in exactly one place, the start and its strict-entry check
   (S1)? Review A §7.1 lists every occurrence of the strip in AF, the main paper,
   Part II and Raymond's code; check that list against the deposit.
3. Is the window `[0, 10⁻⁸]` handled without compactness, by the static bound
   `y² ≤ 9/16 − 2t` and the convexity bound `β(t) ≥ q0 − (2 + c0 q0)t`? Does the
   closed bound (zeros with `β = 7/8` exactly, `y = 3/4`) cause any problem, given
   the start offsets `10⁻⁷` and `2·10⁻⁶`?
4. Does any step of the chain need `q0 ≥ 1`, or the barrier to stay above the
   classical envelope `1 − 2t`? (Review A §7.3 records that for `θ < 1` the barrier
   lies below `1 − 2t` on the whole run.)
5. Are the path-dependent conditions (kernel admissibility `v ≤ ρ²`, caps over
   `[0, V]`) all upper bounds on `q`, so that a lower barrier satisfies them?
6. Is the terminal allowance `q_e/2` independent of the start (de Bruijn at the
   crossing time `T_β`, head zeros real by (W))?

## Priority 2: Raymond's analytic chain (H2)

Raymond's deposit (Zenodo 10.5281/zenodo.22867547) has not been refereed outside
this project. The two internal passes found no false statement and listed
expository gaps with written fixes. A referee is asked to check the following
directly against the deposit:

1. **Head localisation (AF §2).** Does the wall (2.1), together with the classical
   strip and Platt–Trudgian at `t = 0`, imply that every nonreal zero has
   `|Re z| > X` for `0 ≤ t ≤ 41/250`? The counting step is written as Lemma B.3,
   application 2 (`formalization/paper/lemma-B-two-band.md` §4).
2. **Wall (AF §3).** Is the ideal model `F_I` and its phase `θ0 + πtL/8` (Lemma W,
   review A §3.2) the object Raymond's code certifies? Is the endpoint `t = 0`
   (outside Polymath Theorem 1.3's region) covered by continuity with the floor margin
   0.0388?
3. **Approximation (AF §§4–5).** Are the three places where Polymath's proof of
   Proposition 6.3 restricts to `0 ≤ σ ≤ 1` correctly redone for `σ ∈ [−1, 2]`
   (review A §4.3)? Is every error term nonincreasing in `x`, so that the floors hold
   for every `x ≥ X − 2` (review A §8)?
4. **One-point input (AF §§6–9).** Moment inequality, time variation, activation
   (including `t = 0`), all-frequency floors, with the infinite final frequency
   range.
5. **Joint floors (main eq. (1), Lemma 2, Lemma 3, Theorem 4).** The derivation of
   eq. (1) from AF §§5 and 8–9 is not written in the deposit; the project's version
   is in `formalization/paper/joint-pair-arbitrary-shift.md` §2.
6. **Kernels and caps (AF §10).** The kernel inequality (10.1) for catalogue kernels
   4 and 5 (value (i)) and 4, 8, 10 (value (ii)); the self-pair caps.
7. **First contact (AF §11).** Is Lemma FB(θ) (review B §8; `PROOF_NOTE.md` §3) a
   faithful completion of Raymond's compressed argument: compactness from Polymath
   Theorem 1.5(i) for `t ≥ 10⁻⁸`, Hurwitz closedness, backward Hermite splitting for
   a repeated contact zero, (11.1) at a simple contact, the left rate at a knot?
8. **Zero dynamics.** Is the regrouping of Polymath Proposition 3.1(i) into
   conjugate pairs legitimate, and is `S(x, h, t) = Σ_pairs K_h(x − x_j, b_j)` valid
   (convergence of the Hadamard product, real zeros with half weight)?
9. **Terminal step (AF §12).** Exponential bound `T₁₈`, log bounds, upward rounding.

## Priority 3: route-P certificates (H4), value (ii) only

1. **Track-A floors at re-tuned heights** (36,923 substeps, 289 entries). Is the
   project's Theorem 4′ (`formalization/paper/joint-pair-arbitrary-shift.md`) a
   valid extension of Raymond's Theorem 4 to arbitrary shift intervals with the
   Track-A label families? Is the multi-height licence (floors from several height
   tables in one run) valid? Were the per-row premises (5.1), (5.4), `k > 0`,
   `h·v0 > 2` (`v0 = log N0`) checked at every height used (the recheck reports 468 triples, 0
   failures)?
2. **Route-3 joint floors** (11,212 substeps, 90 entries). Theorem MP and its kernel
   rows.
3. **r2 structured floors** (11,304 substeps, 89 entries). These carry the weakest
   links of the package: (a) the weak outer lemma WOL-C for these entries,
   certified entry by entry by project-written engines that are single
   implementations (`formalization/paper/outer-lemma-weak.md`,
   `src/data/r5-synthesis-2026-10-05.js`); (b) the time-box step, for which a
   **measured, uncertified** allowance 0.0023 is subtracted; (c) the L-slope lemma
   for uniformity in `x`, which has **not been reviewed**; (d) a heuristic FFT slack
   of size `10⁻¹²·ΣD·Σμ` per entry. Each needs a proof or a certificate.
4. **79 new kernels at `r = 3/5`.** Exact Bernstein certificates plus an independent
   Arb re-certification; check the cleared numerator and the certificate checker.
5. **Single-implementation code**: the joint-pair and Track-A gain code.

## Priority 4: the 7/8 half-plane (H1)

1. Run the official comparator for `QuasiRiemannHypothesis` (Linux, `landrun`,
   `lean4export`).
2. Run an independent kernel replay (`lean4checker` or nanoda) on
   `OAI.NumberTheory.DirichletL.Nonvanishing` and its closure.
3. Rebuild at the updated openai/math commit (the local build used the initial
   commit `adc7f1241`; the update of 8 October 2026 changes no module of the import
   closure, by the commit's file list).
4. Confirm that the statement uses Mathlib's `riemannZeta` and that no imported
   declaration changes its meaning.
5. Read the manuscript ("The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane
   Re s > 7/8", 30 September 2026). The project read only the abstract,
   introduction, proof overview and contents, and its exponent bookkeeping in the
   attempts to improve 7/8.

## Priority 5: the Lean formalisation

1. Do `RaymondChainHyps` (`head_wall`, `first_contact`, `contact_exclusion`) and
   `TableHyps` state exactly what Raymond's text and the floor producers prove, no
   more? In particular: the range of `head_wall` (`|Re z| ≤ X`, `0 ≤ t ≤ 41/250`);
   the barrier class in `first_contact`; the premises of `contact_exclusion`
   (`PairRate`, stored level `Q ≥ b`, the cell constraint).
2. Is LeanCert's `H` the Polymath `H_t`, and is `Lambda = sInf {t | every zero of
   H_t is real}` the de Bruijn–Newman constant (`real_zeros_iff_Lambda_le`)?
3. Is the checker's soundness theorem (`QrhLambda/Sound.lean`) complete: does
   `Cert.lambda_le` use every frame and chunk check it needs?
4. The internal referee proved `raymondChainHyps_of_RH` (the hypotheses are
   consistent unless RH is false). Is that proof sound?

## Priority 6: computation and reproducibility

1. Re-run value (i): `tmp/oai-lambda-raymond.py OUT X1 --thetas 7/8` (about 35 s).
2. Re-run value (ii): `tmp/qrh-tune-final.sh` (about 11 min) and both step
   verifiers.
3. Rebuild the Lean packages and replay the chunk certificates.
4. Limits: the scripts and run artefacts are in the project's untracked
   `tmp/` tree, the Lean builds depend on machine-local state, and several producers
   are single implementations. `PROVENANCE.md` pins every file by sha256.

## Priority 7: final assessment

After auditing the components, please state:

1. whether (H2) is established for the parts used by value (i);
2. whether (H4) is established, item by item;
3. whether any step relies on an unproved statement other than (H1);
4. whether any check is circular with the claim it supports;
5. whether a correction is local or removes a value.

Until such a review exists, the values are conditional statements of this draft,
not accepted results.
