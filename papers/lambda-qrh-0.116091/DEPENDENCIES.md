# Dependencies

The result is conditional. Value (i), `Λ ≤ 0.118505710922701`, uses (H1)–(H3).
Value (ii), `Λ ≤ 0.116091488672439`, uses (H1), the analytic part of (H2), (H3) and
(H4). The accepted peer-reviewed bound is Platt–Trudgian's `Λ ≤ 0.2`. RH is open.

Remove (H1) and the same chain returns Raymond's own value 0.149395073827688.
Remove (H2) or (H3) and the argument gives nothing below the accepted 0.2: (H1)
alone gives `Λ ≤ 9/32 = 0.28125`. Remove (H4) and value (ii) falls back to value
(i). No input can be dropped without losing the stated value.

## The four conditions

| | condition | status | used by | what breaks without it |
|---|---|---|---|---|
| (H1) | `ζ(s) ≠ 0` for `Re s > 7/8` | Claim of openai/math family 003 ("The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re s > 7/8", 30 September 2026), produced by an internal OpenAI model. Its Lean proof (`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`, initial commit `adc7f1241` of github.com/openai/math) was rebuilt locally: build succeeded, axioms `propext`, `Classical.choice`, `Quot.sound`, statement equal to the comparator challenge. The 8 October 2026 repository update (commit `301488868`, merged as `fd4aeeb2`) changes none of the 2,924 closure modules, the comparator file, the lakefile, the manifest or the toolchain; the build was not repeated at the new commit. Not done: official comparator run, independent kernel replay (`lean4checker`/nanoda) of the openai/math closure, peer review. | (i), (ii) | The barrier must start above the classical strip (`q0 > 1`); the chain gives 0.149395073827688. |
| (H2) | The analytic statements of D. J. Raymond's decreasing-barrier construction (Zenodo 10.5281/zenodo.22867547, v1, 21 September 2026), with the floor tables and kernel certificates of his deposit | Unrefereed preprint. Reviewed only inside this project (two internal passes, `formalization/paper/raymond-g0-review-a-2026-10-08.md` and `-b-`): no step graded ERROR; expository gaps with written fixes (Lemma W, Lemma S(θ), Lemma FB(θ), a uniformity table, the derivation of main-paper eq. (1)). No reader outside the project. | (i); analytic part (W, FC, CE) also (ii) | Without the barrier chain the half-plane gives only the de Bruijn value 9/32. |
| (H3) | RH for `0 < γ ≤ 3000175332800` | Platt–Trudgian, Bull. London Math. Soc. 53 (2021), Theorem 1. Peer reviewed. Used once: as the initial condition of the head cell at `t = 0`, at ordinate `(X+1)/2 = 3000000092914`, clearance 175,239,886. | (i), (ii) | The head wall (W) has no initial condition; the chain has no starting configuration below `X`. |
| (H4) | Validity (J), (K) of the 468 floor entries and 59 kernel rows of the re-tuned run F2 ("route-P certificates") | Project-internal. Mostly single implementation; one adversarial internal referee pass (not refuted; corrections R1–R5 applied). Details below. | (ii) only | Value (ii) falls back to value (i). |

## (H2) in detail: the parts of Raymond's construction used

Section references: "AF" = *Analytic foundations for the time-zero upper-bound
construction* (in the deposit); "main" = *Correlated translated probes and the
bound Λ < 0.149396 for the de Bruijn–Newman constant*.

| part | content | internal grade | used by |
|---|---|---|---|
| AF §2 | classical framework; Platt–Trudgian clearance; head localisation (every nonreal zero has `\|Re z\| > X` for `0 ≤ t ≤ 41/250`) | sound; gap 2a (counting step) fixed by Lemma B.3 of `formalization/paper/lemma-B-two-band.md` | (i), (ii) via (W) |
| AF §3 | finite-head wall `\|H_t/B_t\| > 3/4` on `x = X`, `0 ≤ y ≤ 1`, `0 ≤ t ≤ 41/250` (interval certificate, regenerated twice by the project) | sound; gap 3a (`t = 0` endpoint) fixed by a continuity argument (review A §3.3); gaps 3b and A1 (ideal model and error budget only in code) fixed by Lemma W (review A §3.2) | (i), (ii) via (W) |
| AF §§4–5 | larger-height approximation for `σ ∈ [−1, 2]`; value and derivative errors | sound; gap A3 (uniformity in `x`) fixed by the table in review A §8 | floors of (i) and (ii) |
| AF §§6–9 | one-point moment inequality, time variation, activation, all-frequency floors | sound (review B §2; earlier internal pass "G0-d") | floors of (i) and (ii) |
| main eq. (1), Lemma 2, Lemma 3, Theorem 4 | surplus identity, paired phases, two-probe joint floor ("G0-c") | sound; gap A2 (derivation of eq. (1)) written in `formalization/paper/joint-pair-arbitrary-shift.md` §2 | floors of (i) and (ii) |
| Lemma CG | monotonicity of the divisor-sum coefficients used in main eqs. (11)–(13) ("G0-a") | proved in Lean (`RaymondCore.CG.cn_nonneg_mono`) | floors |
| AF §10 | kernel inequality (10.1), catalogue of 13 kernels, self-pair caps | sound; all 13 kernels re-certified by separately written exact Bernstein code (review B §3) | (i): kernels 4 and 5; (ii): kernels 4, 8, 10 |
| AF §11 | zero dynamics, inequality (11.1), first contact | sound in substance; gap B1 (start written only for `q0 > 1`) fixed by Lemma S(θ); gap B2 (first-contact argument compressed) written as Lemma FB(θ) | (i), (ii) via (FC), (CE) |
| AF §12 | exponential and logarithm enclosures; terminal step `Λ ≤ T* + q_e/2` | sound | (i), (ii) |
| AF Part II | sharp continuum law | not used by (i) or (ii) (0 substeps) | — |
| floor tables at the Platt–Trudgian height | Raymond's X1 tables at plan heights (Arb, two precision lanes), regenerated bit-identically from his code | finite certificate; the analytic content is AF §§4–9 and main Theorem 4 | (i) |

## (H4) in detail: the route-P ledger items used by value (ii)

Source: `src/data/qrh-path-push-2026-10-08.js` (`conditional`, `certified`,
`premiseRecheck`), `formalization/lean/qrh-lambda/README.md`.

| item | substeps / entries | status |
|---|---|---|
| Track-A joint floors at re-tuned heights ("X options"): Raymond's producer at re-planned heights between 0.86 and 1.07 times the plan heights (sets QC, QA, QB, m091, m094, m097, W4), with the project's extension of main Theorem 4 to arbitrary shift intervals (Theorem 4′, `formalization/paper/joint-pair-arbitrary-shift.md`), Lemma R (analytic core proved in Lean, conditional on AF (4.6)), and the multi-height licence | 36,923 substeps; 289 floor entries | Two Arb precision lanes (192/256 bit); all 289 (set, cell) pairs re-certified by the internal referee at 224/320 bit and different divisions (all 3,179 mode floors 1.9·10⁻⁴ to 4.2·10⁻⁴ above the published values, none lower). Multi-height licence not refereed outside the project. |
| route-3 joint floors (P-modes, "Theorem MP" = Raymond's Lemma 3 plus Track-A gains) | 11,212 substeps; 90 floor entries | Written, internal referee; joint-pair and Track-A gain code single implementation. |
| r2 structured floors (`κ = 0.94` and `κ = 1` catalogue options) | 11,304 substeps; 89 floor entries | Interval certificates (Arb 128 bit plus a complex-ball C engine). Rest on: the weak outer lemma WOL-C for these entries, certified entry by entry by project-written engines (single implementations, internal referee passes; `src/data/r5-synthesis-2026-10-05.js` records which engine outputs were admitted); a **measured, uncertified** time-box allowance 0.0023; the r2 **L-slope lemma** for uniformity in `x`, **not reviewed**; a heuristic FFT slack of size `10⁻¹²·ΣD·Σμ` per entry. |
| 79 new kernels at `r = 3/5` (50 used by F2) and 6 route-3 kernel rows | used on 37,342 substeps (new kernels) | Exact Bernstein certificates (depth 22); second-method re-certification by the internal referee (Arb, adaptive bisection, no shared code): 79/79 at 64 bits (549,302 boxes), all 59 rows used by F2 at 128 bits (425,359 boxes). |
| per-row source premises at re-tuned heights: (5.4), `k > 0`, `h·v0 > 2` (`v0 = log N0`), (5.1) | 468 (cell, height, source) triples | Rechecked in 256-bit Arb, 0 failures (min `k` 0.43918, min `h·v0` 12.236, max (5.4) sum 1.4994·10⁻⁷). |
| consumer arithmetic | 59,439 substeps | Exact rationals; extended step verifier and a from-scratch verifier (no shared code) both 0 failures; replayed by the Lean kernel. |

Not needed by either value: Lemma B (band layouts), Lemma H2, RH beyond the
Platt–Trudgian height, the Mossinghoff–Trudgian–Yang zero-free region, the 3-band
layout, AF Part II, q-window floors.

## What is proved without any of (H1)–(H4)

* Lemma 1 (zero-free half-plane to squared strip) is a theorem; it is also proved in
  Lean from LeanCert's formalisation of `H_t` and de Bruijn's strip contraction.
* Lemma 2 (barrier lemma with a zero-free start) is a written proof (internal); its
  logical skeleton is proved in Lean from the named hypotheses (W), (FC), (CE).
* The arithmetic of both runs (conditions (C1)–(C6) of Lemma 2 for every substep) is
  replayed by the Lean kernel from the stored tables.

These establish the implications "(H1)–(H3) ⇒ (i)" and "(H1)–(H4) ⇒ (ii)", relative
to the table entries; they do not establish any of the hypotheses.
