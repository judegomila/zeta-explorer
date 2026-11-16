# RH attempt, round 2 (1 November 2026): phase alignment forced by an off-line zero, through the Euler product

**Outcome: the attempt fails. No proof of RH, no new zero-free region, no change to any Λ bound. NO QED.**
Internal working note; not externally refereed; nothing committed.

**Revision (fresh-context pass, 1 November 2026, after 18:00).** One agent context wrote the 17:33 version of this file.
A second agent context, which had not written it, did four things:

* re-read the inputs and the draft;
* re-ran all seven scripts. The JSON outputs are identical to the 17:33 ones in every field except run times.
* re-derived the positive statements;
* added the material listed below.

Changes:

1. **New: Theorem MT and Corollary SF (§3.2).** An explicit completely multiplicative unimodular function with a planted
   zero shows that the Euler product imposes no constraint on the prime phases below any given length. This holds with
   the Euler product used at all lengths, at all harmonics and with its analytic continuation. It is the strongest form
   of the failure of Step 3. It also closes the open part of the 17:33 adversarial question 2 for arguments that use only
   the Euler product (§7.2, C2).
2. **New: Route T4 (§3.6).** Zero detection with the Möbius mollifier, the classical way of using the functional
   equation and the Euler product together at one height. It stops at a single large value (pointwise wall).
3. **Davenport–Heilbronn (§4).** The hypothesis of Proposition DH-P is now checked directly: L(s, χ)L(s, χ̄) has no zero in
   a box around ρ_DH. The citation (I7) is no longer used. A three-way comparison ζ / DH / multiplicative twin is added.
4. **Corrections C1–C7 (§7.2).** None changes the verdict. The main ones:
   * the heuristic large-deviation exponent in §3.5 was wrong by a factor log log γ₀;
   * Proposition PD′ is now proved, not only measured, at supports 2a′ < log 2.
5. **Kept and preserved.** The 17:33 text is kept where it was verified; changed or added passages are marked "(rev.)".
   The 17:33 file and outputs are preserved in `tmp/rha-phase-alignment-out-run1/` (text SHA-256 `27abdc0b…d283e`).

The attempt (§2) assumes a zero ρ₀ = ½ + δ₀ + iγ₀ with 0 < δ₀ ≤ 3/8 and γ₀ > 3·10¹². By the round-1 detection law the
zero forces the prime phases (γ₀ log p mod 2π) to align with a matched filter at the visibility length
N_vis ≈ (2δ₀ log γ₀)^{1/δ₀}. The new step (Step 3, Lemma T) is to use the Euler product to transfer this alignment to a
**short** support, where Weil positivity in the same direction family is provable for every phase vector, and so obtain a
contradiction. Four routes for Lemma T are written out:

* T1, harmonic positivity: the 3–4–1 mechanism at compact support;
* T2, the conditional tilt of the phases;
* T3, peeling by Selberg's identity;
* T4, zero detection with a Möbius mollifier (added in the revision).

## The line where it fails

**Step 3, Lemma T.** In order:

1. **The Euler product carries no information about short lengths (Theorem MT, Corollary SF, §3.2).** Status: PROVED,
   same-agent check only; MEASURED at γ₀ = 3·10¹².
   * For each δ₀ ∈ (0, 3/8] there is a completely multiplicative f: ℕ → S¹ (a point of the infinite prime-phase torus)
     with the following properties.
     * F₁(s) = Σ f(n) n^{−s} is holomorphic on Re s > ½ and has exactly one zero there, simple, at ½ + δ₀.
     * Every harmonic F_k(s) = Σ f(n)^k n^{−s} with |k| ≥ 2 is holomorphic and zero-free on Re s > ½.
     * Its matched-filter sums reproduce the alignment that ρ₀ forces in Step 2. They satisfy the all-scale form of
       round-1 Lemma L, with the same leading term −2m², and the fixed-support form (A) at all large supports, at any
       prescribed height.
   * The phases of f on any finite set of primes can be changed arbitrarily without moving the zero. The change
     multiplies each F_k by a finite ratio of Euler factors, which is holomorphic and zero-free on Re s > 0.
   * Measured at γ₀ = 3·10¹², δ₀ = 3/8:
     * one such f satisfies (A) at every tested support 13.70 ≤ 2a ≤ 18.42, with margin at least 90;
     * with the phases of all primes up to N_vis = 6,420 chosen adversarially (their contribution at its torus
       minimum), (A) still holds, with margin at least 80;
     * with all primes up to 3·10⁴ adversarial, the margin is still at least 31.
   * So no argument built from the following can force alignment at short lengths, or exclude the zero at all:
     * multiplicativity and unimodularity;
     * prime support of Λ and Λ ≥ 0;
     * the harmonic relations p^{−ikγ₀} = (p^{−iγ₀})^k;
     * the Selberg/Vaughan/Heath-Brown identities;
     * holomorphy and zeros of all F_k on Re s > ½.
   * What separates ζ from the twin is the Kronecker-line form f(n) = n^{−iγ₀} together with the functional equation.
     The attempt uses the functional equation only through the scalar target β = Ω/2 and the zero counts.
2. **No free transfer at a finite length (Theorem NFT, §3.1; PROVED).**
   * At a single height the Euler product is exactly the statement that every Dirichlet polynomial is a function on the
     prime-phase torus evaluated at Φ_N(γ₀) = (γ₀ log p mod 2π)_{p≤N}. Every consequence of the Euler product alone is
     therefore **torus-valid**: true at every point of the torus.
   * The alignment set 𝒜_a = {φ : L̃_a(φ) ≥ β + s(a)} is non-empty at every support.
     * The phase vector in {0, π}^{π(N)} with the signs of w reaches 2.90 times the required level at δ₀ = 3/8, with exact
       prime powers (R6).
     * In general it reaches at least T(a) − 2a − 2.3.
     * T(a) exceeds the target by a factor of 3.03 (δ₀ = 3/8) to 2966 (δ₀ = 0.1) in the continuous model (round-1
       Table A, reproduced as Table PI in §3.5).
   * Hence Lemma T for every possible γ₀ is **equivalent** to "(★_min) holds at some support a ≥ a_rig(H), at every
     height H > 3·10¹²" (rev., C1). That is round 1's unproved inequality, not a reduction of it.
3. **The four proposed proofs each stop at a named inequality.**
   * **T1** stops at (T1.4).
     * Proposition PD (§3.3, PROVED) concerns the multi-height positivity class in the version that drops the on-line
       zeros. It shows that the class can exclude an offset-δ₀ zero only if log(γ₀/2π) < R′(δ₀) + 2.686 + log 2, with
       R′(δ) = ∫[2cosh δv − cosh(v/2)]₊ dv.
     * For δ₀ ≤ 3/8 this means γ₀ < 10^{6.69}; a numerical optimum over 12-step test profiles reaches only 10^{5.17}.
       All of this lies below the Platt–Trudgian height 3·10¹², so T1 meets the verified-height wall.
     * Suppose the unconditional zero count is also used from below (Proposition PD′). Then no measured profile
       excludes anything at 3·10¹² (max F₂ = −0.029). At supports 2a′ < log 2, PD′ is now PROVED to exclude nothing, by
       a factor ≥ 198 (rev., C6). Even exact counting leaves a margin that survives a count error of at most 0.004.
     * The written justification of (T1.4) cancels the archimedean terms against the on-line zeros (continuous model).
       That cancellation is illegitimate: an off-line pair displaces two on-line zeros. At short support the difference
       is the second-moment term 2c₁μ₂(δ₀² + (x₁² + x₂²)/2), which is buried in pointwise S(t) noise.
   * **T2** stops at (T2.3), the passage from the conditional law of the phases to the single point Φ(γ₀).
     * Measured over 100,000 actual heights (δ = 0.2, N = 6·10⁴), the top-1% alignment tail tilts the second harmonic by
       only 0.16 (σ = 1.64).
     * 44% of tail heights sit **below** the unconditional mean.
     * The deterministic consequence (Cauchy–Schwarz) is −118.8, which is vacuous.
   * **T3** stops at (T3.2), "super-alignment".
     * Lemma F (PROVED): at one height every type-II sum factorises.
     * Peeling therefore takes 2^j-th roots of the gap ratio m/T < 1, but never makes it exceed 1. At 3·10¹², δ₀ = 3/8,
       the ratios are 0.574, 0.758, 0.871 for j = 1, 2, 3.
   * **T4** (rev., new) stops at (T4.2): a single large value at ρ₀, either of a mollified Dirichlet polynomial or of ζM
     on the critical line near γ₀.
     * The torus allows the large value with room to spare. The torus maximum is 45 times the required size at
       Re s = 7/8 (X = 100, Y = 10⁶) and 829 times at Re s = 0.6.
     * Large-values estimates bound the number of such points, not their existence at one point.
     * The multiplicative twin satisfies the analogous dichotomy in its own half-plane.
4. **Non-torus-valid inputs do not reach δ₀ ≤ 3/8 (§3.7).** The conditional Xu–Sang input reaches only
   (0.37488665, 3/8].
   * Euler-product algebra cannot move the singularity created by the zero to a larger real part (Proposition OA).
   * Every available non-torus-valid input is of one of two kinds:
     * finite-height: the verified height 3·10¹²;
     * a half-plane at θ ≥ 0.37488665: Xu–Sang/PR 14 (conditional), 3/8 for QRH 7/8, θ → ½ for the
       Vinogradov–Korobov region.
   * By the round-1 Lemma L such a half-plane is a floor with exponent δ + θ. It excludes only δ₀ > θ.
   * The weakest input that closes Step 3 is (★_min) at all heights (pointwise / MV-CAP wall). Over all supports it is
     the V7 floor with exponent p < 2δ₀ (atlas §10).

**Why Davenport–Heilbronn escapes (§4).**

* The twin's off-line zero ρ_DH = 0.808517 + 85.699348i forces the same kind of alignment in its own explicit formula.
  Its Weil value is W/(2m²) = −0.76 at 2a = 6 and −0.99 at 2a = 12, which matches round 1.
* That alignment is **not** in prime phases.
  * The prime part of −f′/f is (1+W)⁻¹(−L′/L(s,χ) − W L′/L(s,χ̄)) plus a function holomorphic on Re s > ½.
  * It is regular at ρ_DH (rev., direct check F1): |L(ρ_DH, χ)| = |L(ρ_DH, χ̄)| = 0.702, and L(s,χ)L(s,χ̄) has no zero in
    [0.55, 1.30] × [84.7, 86.7] (argument principle, 30-digit mpmath).
* Measured: the primes contribute between −0.39 and +0.74 at every support, while the non-prime-power coefficients
  carry the alignment. They contribute 3.97 at 2a = 6 and 29.6 at 2a = 12, tracking m = 2.03 and 26.8.
* So the twin leaves the argument at the Euler-product step. Its zero lives on coefficients that an Euler product forces
  to vanish (cf. route 30: Λ_DH(6) = (1+κ²) log 6). Its required alignment is within the Euler-torus range
  (LHS/T_ζ = 0.14–0.68), so no size argument excludes it either.
* **Two twins (rev.).**
  * Davenport–Heilbronn has the functional equation and no Euler product. It leaves the argument at Lemma E.
  * The multiplicative twin of Theorem MT has the Euler product and no functional equation. It never leaves the
    argument. It satisfies the alignment of Step 2 and every Euler-product statement used in Step 3, so it is a
    counter-model to Lemma T in its Euler-product form.
  * So neither the explicit formula with its archimedean side (DH) nor the Euler-product side (MT) gives the
    contradiction on its own. The argument would have to use both, pointwise at γ₀, and that is (★_min).

RH is open. Platt–Trudgian Λ ≤ 0.2 stands. No zero-free region and no Λ bound changes.

**Grades.**
* **PROVED**: complete argument written here; same-agent check only unless stated.
* **PROVED (elementary)**: a short algebraic or logical argument.
* **CERTIFIED-FLOAT**: double precision (or 30-digit mpmath where stated), with residuals stated.
* **MEASURED**: actual primes or zeros at proxy heights, or a specific constructed phase vector.
* **CONTINUOUS MODEL**: as in round 1.
* **HEURISTIC**.
* **CONDITIONAL**: depends on an unrefereed input.
* **[L]**: a literature statement, not re-verified.

**Referee status.**
* **The 17:33 draft** had a same-agent adversarial pass with independent code paths (§7.1, R1–R6).
* **This revision** is a fresh-context pass by a second agent context that had not written the draft (§7.2).
  * It re-ran every script.
  * It re-derived Lemma E, Theorem NFT, Propositions PD, PD′ (the reduction), OA and DH-P, Lemmas J and F, and
    Corollary PI.
  * It ran new checks F1–F7, and found the statements correct subject to corrections C1–C7.
  * This is an internal check by the same model family, not an external referee.
* **The new statements of this revision** (Theorem MT, Corollary SF, Route T4, the three-way comparison) are same-agent
  checked only (§7.3). They need an independent referee before they are cited outside this note.
* No argument survived, so the instruction to re-check a surviving argument with a fresh referee does not apply.

**Scripts** (all `.venv-arb/bin/python -I`, one process, < 90 s, < 2 GB; outputs in `tmp/rha-phase-alignment-out/`):

| script | content | output |
|---|---|---|
| `tmp/rha-phase-alignment-pd.py` | Prop. PD: R′(δ), height ceilings, optimum over step profiles, explicit-formula check | `pd.json`, `pd.log` |
| `tmp/rha-phase-alignment-pdcount.py` | Prop. PD′: the positivity class with two-sided zero counting, optimum over 8-step profiles | `pdcount.json`, `pdcount.log` |
| `tmp/rha-phase-alignment-tilt.py` | T2: conditional tilt at actual heights and for random phases, max-entropy prediction | `tilt.json`, `tilt.log` |
| `tmp/rha-phase-alignment-supports.py` | torus-valid support a_triv, visibility support, gap ratios and their roots | `supports.json`, `supports.log` |
| `tmp/rha-phase-alignment-dh.py` | Davenport–Heilbronn: zero, Λ_f, Weil value, primes/prime-powers/composites split | `dh.json`, `dh.log` |
| `tmp/rha-phase-alignment-kcost.py` | HEURISTIC Kronecker-cost counts (Gaussian Haar model) | `kcost.json`, `kcost.log` |
| `tmp/rha-phase-alignment-referee.py` | same-agent checks R1–R6 (17:33) | `referee.json`, `referee.log` |
| `tmp/rha-phase-alignment-twin.py` (rev.) | Theorem MT / Corollary SF numerics: `main` (N = 10⁸), `variants` (seeds, booster, prescribed and adversarial short phases), `indep` (the construction of the proof) | `twin-main.json`, `twin-variants.json`, `twin-indep.json`, `.log` |
| `tmp/rha-phase-alignment-twin-seeds.py` (rev.) | 40 + 400 realisations: no harmonic drift; B(r) − r/2 | `twin-seeds.json`, `.log` |
| `tmp/rha-phase-alignment-referee2.py` (rev.) | fresh-context checks F1–F7 | `referee2.json`, `.log` |

All scripts import `tmp/rha-contradiction-lib.py` (round 1) for the matched filter m(a,δ), w, a_ideal, a_rig and Ω.

---

## 0. Goal, reading record, overlap with the audit

### 0.1 Goal and plan

**Goal.** Prove ζ(s) ≠ 0 for ½ < Re s ≤ 7/8. Together with QRH 7/8 (I2) and the functional equation, this is RH. The
deliverable is a proof, or the exact line where the argument fails and why.

**Plan (round-1 synthesis, proposal 5).** From a hypothetical ρ₀, use the Euler product (not only the functional equation)
to force alignment of the phases γ₀ log p at short lengths, and so contradict the exact visibility law (round-1 Lemma 2)
at a support where the needed bound is provable. The plan must also say why the Davenport–Heilbronn twin, which has such
zeros, escapes.

### 0.2 Reading record

Read before writing, in this order:

* The user's audit (PR #27): `/tmp/atlas-snap-historical-routes.md` (§§1–12, ledger, closing line),
  `/tmp/atlas-snap-PUBLICATION_SCOPE_2026-10-30.md`, and the module notes `/tmp/atlas-snap-{arithmetic-foundation,
  spectral-head-theory, signed-complement, spectral-denominator-repair, whole-even-certificate, suzuki-recurrence,
  prime-memory, finite-suzuki-certificate}.md`. PR 14: `git show refs/pr/14:rigorous/mobius_bridge_reduction/SIGNED_PHASE_FILTER.md`.
* Round 1: `formalization/rh-attempts/2026-11-01-synthesis.md` and `2026-11-01-contradiction.md` in full (Lemma 1,
  Lemma 2 = visibility law (D), Proposition 5, (★_min), Lemma L, Corollary L, Tables A–D, §3.5 phase test). The round-2
  sibling `2026-11-01-r2-density-profile.md` (header only).
* Walls: `src/data/flow-blindness-no-go.js`, `src/data/imp-95530-native-span-arithmetic-input-rigidity.js` (NS-RIGID,
  RES-T), `formalization/paper/mv-cap-theorem.md` (with the referee box, §§7–9), `src/data/route-42-formal-mv-cap-2026-10-10.js`
  (via the paper), `research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`,
  `formalization/routes/fifty-routes-synthesis-2026-10-15.md`.
* Route modules: route 27 (function field), route 30 (finite-support Euler detector; DH coefficients), route 16 (header).
* **Revision (fresh-context pass).** The second agent context read the following before revising.
  * The round-1 synthesis and the contradiction attempt, in full.
  * The atlas snapshots: `/tmp/atlas-snap-historical-routes.md` in full, and `PUBLICATION_SCOPE_2026-10-30`.
  * The module notes: arithmetic-foundation, prime-memory, suzuki-recurrence, finite-suzuki-certificate,
    signed-complement, spectral-head-theory, whole-even-certificate and spectral-denominator-repair.
  * The flow-blindness module `src/data/flow-blindness-no-go.js`, in full.
  * From `src/data/imp-95530-native-span-arithmetic-input-rigidity.js`: the NS-RIGID and RES-T statements and the
    loophole line.
  * From `formalization/paper/mv-cap-theorem.md`: the section list and Theorem C.
  * The 17:33 draft of this file, in full.
  * It did not re-read PR 14's SIGNED_PHASE_FILTER note, and relies on atlas §10 for it.

### 0.3 Where this attempt overlaps the audit, and what is different

| Ingredient here | Atlas | What the atlas records | What is different here |
|---|---|---|---|
| Step 2: matched-filter alignment, (★_min), visibility law (D), Lemma L | round-1 contradiction attempt; atlas §9 (fixed support), §10 (V7 floor) | (★_min) unproved; all-scale form = V7 floor; fixed-support positivity needs actual signed all-support lower bounds | Used as input, unchanged. New: the **phase form** (Lemma E) and Theorem NFT, which says the Euler product at one height cannot reduce (★_min). |
| T1: harmonic positivity (3–4–1 at compact support) | §10 (sixth-phase filter "retains eigenvalue one"; matching Euler lines erases the detector); arithmetic-foundation §2 (height-0 one-sided Landau) | Small mean energy is not worst-case contraction; the principal detector is erased by matched Euler lines | New Proposition PD: an explicit upper bound R′(δ₀) + 2.686 + log 2 (on log(γ₀/2π)) on what any nonnegative phase polynomial with a positive-definite nonnegative envelope can see. For δ₀ ≤ 3/8 it ends at 10^{6.69}, inside the verified height. |
| T2: conditional tilt of phases | §3 (positive covariance and critical susceptibility cannot determine an absolute floor); §10 (mean energy ≠ worst case) | Second-moment information does not fix a pointwise floor | Same mechanism, now **measured** on actual heights: the tilt is 0.1σ, and 44% of top-tail heights violate it. |
| T3: peeling by Selberg/Vaughan/Heath-Brown | arithmetic-foundation §4 (exact Vaughan centering; replacing the signed remainder by absolute values is not the hypothesis) | The identity is exact; better quadrature does not give the cancellation | New Lemma F: at one height every type-II sum is a **product**, so peeling only takes roots of the gap. |
| "Provable support": the trivial (torus-valid) bound | §9 (certified positivity only to λ² ≤ 16.1); whole-even and spectral-repair modules | Supported even positivity to W ≤ 2.779; the X = 16.1 negative surrogate is not a negative vector | Different object: (★) in the concentrated direction family at height γ₀. It holds for every phase vector up to 2a_triv = 6.57 at 3·10¹² (N ≈ 710), where the zero is invisible (visibility needs 2a ≥ 8.77 for δ₀ = 3/8). |
| Finite-prime rigidity | §7 | Changing finitely many prime **coefficients** yields a negative direction in some finite matrix | NFT moves **points of the torus** (phases), not coefficients; torus points satisfy every torus-valid statement. Different statement; no conflict. |
| Quantifier over supports | §4 (G_L(ε) ≤ 1 for all supports and all small ε) | All supports are needed | The all-scale form of Step 2 at γ₀ is a global half-plane (round-1 Corollary L). |
| No uniform positive margin | §11 | Wrong RH target (almost-periodic returns) | (★_min) carries slack s(a), not a margin. PD is about the positivity class, not a margin. |
| Signed complement / spectral head | modules | Complement bound open; strong 4M clipping fails along zeta packets | The test directions at γ₀ ≫ λ² lie in the complement; this attempt gives no complement bound. |
| Suzuki recurrence / prime memory | modules | One-sided Landau ⟺ signed credit prefix; credits uncontrolled | The all-scale height-0 version of Step 2 is that prefix (round-1 B7); not used beyond that. |
| Davenport–Heilbronn | round-1 synthesis §2 item 2; route 30; route 44; MV-CAP §7 | Needed inequalities fail for DH; route 30 detects DH's composite coefficients with no zero-location content | New (Proposition DH-P): the DH off-line zero is carried by composite coefficients (primes and proper prime powers together contribute between −0.99 and +0.65 while the sum grows to 28.6); the prime part is regular there. This links route 30's multiplicativity detector to zero location. |
| PR 14 / Xu–Sang; V7 floor | §10 | B = 0.87488665 conditional; floor exponent p ⇒ half-plane (1+p)/2 | Lever table §3.7. Neither reaches δ₀ ≤ 3/8; PD at δ₀ = 0.37488665 is 10^{6.68}. |
| Theorem MT / Corollary SF (rev.): a completely multiplicative unimodular f with a planted zero | §3 (finite independent prime ladders; positive covariance cannot fix an absolute floor); §7 (finite-prime rigidity); §10 (the sixth-phase filter retains eigenvalue one) | §3: prime-ladder models are not the theta law and do not determine the absolute Weil floor. §7: changing finitely many prime **coefficients**, with the archimedean side held fixed, gives a negative direction in some finite matrix. §10: small mean energy is not worst-case control | MT is a random Euler product (Wintner, Bohr–Jessen type) with one planted zero, and it is the explicit worst case behind §10's remark for this strategy. It changes **phases**, keeps \|Λf\| = Λ, and keeps the zero under finite phase changes, which multiply F₁ by a zero-free finite Euler ratio. §7's theorem perturbs an abstract form whose archimedean side is held fixed while coefficients change, and that form is not the explicit formula of any function with those coefficients, so the two do not conflict. |
| Route T4 (rev.): zero detection with the Möbius mollifier | §10 (PR 14's open part: small-common-divisor, large-separation signed correlations); the NS-RIGID loophole line (Levinson–Conrey class) | Mollifier and Dirichlet-coefficient inputs give proportion and mean-value statements; their pointwise upgrade is the open wall | Same class. T4 states the single-height large value that the zero forces, and records that the multiplicative twin satisfies it too. |
| Vortex / collision, theta certificates, twistor / Hankel, information tuning, synchronization | §§2–6, 8 | — | Not used. Global vortex trapping (= RH, vortex README) not used. |

---
## 1. Inputs

Conventions are those of round 1. ĝ(z) = ∫ g(u) e^{izu} du. A zero ρ corresponds to γ_ρ = (ρ − ½)/i.
Ω(r) = Re ψ(¼ + ir/2) − log π. It is even and increasing in |r|, with Ω(0) = ψ(¼) − log π = −5.37211.

* **(I1) Weil's explicit formula** [L]. For g continuous, compactly supported, of bounded variation:

      Σ_ρ ĝ(γ_ρ) = ĝ(i/2) + ĝ(−i/2) + (1/2π) ∫ ĝ(r) Ω(r) dr − Σ_n Λ(n) n^{−1/2} [g(log n) + g(−log n)].

  Re-checked here for a new test family (§3.3): relative residual 1.2·10⁻⁸ with the actual zeros.
* **(I2) QRH 7/8.** ζ(s) ≠ 0 for Re s > 7/8 (openai/math family 003; Lean build re-run locally). Not peer-reviewed.
* **(I2′) Xu–Sang / PR 14.** No zeros with Re s > 0.87488665. **CONDITIONAL** on the imported analytic estimates and the
  closure lemma (atlas §10).
* **(I3) Platt–Trudgian 2021** [L]. All zeros with 0 < γ ≤ 3.0001753·10¹² are on the line.
* **(I4) Zero counting** [L] (Trudgian 2014, as quoted in `mv-cap-theorem.md`). |N(T) − M(T)| ≤ B(T) = 0.112 log T +
  0.278 log log T + 2.510.
* **(I5) Round-1 results** (`2026-11-01-contradiction.md`; same-agent checked there; not re-proved here):
  * **Lemma 1** (closed forms).
  * **Lemma 2** (visibility law (D): a negative direction exists iff sinh(2aδ)/δ − 2a > Ω(H); the minimiser is
    e^{−iHu} sinh(δu)).
  * **Lemmas 3–4**.
  * **Proposition 5** (zero side under (Iso_D)) with the slack s(a).
  * **Lemma L** (Landau transport, both directions) and **Corollary L**.
  * **Table A** (Euler-blind gap; reproduced as Table PI in §3.5).
* **(I6) Selberg's identity** [L, classical]. For n ≥ 1, Λ(n) log n + Σ_{d|n} Λ(d) Λ(n/d) = Σ_{d|n} μ(d) log²(n/d).
  Checked exactly for n ≤ 3000 (R5).
* **(I7) [superseded in the revision]** GRH for χ mod 5 at low height [L] (Platt, Math. Comp. 2016; the 17:33 draft
  quoted the bound from memory). Proposition DH-P needs only that L(s, χ)L(s, χ̄) has no zero near ρ_DH. That is now
  checked directly (§7.2, F1), and (I7) is no longer used.
* **(I8) Primes in short intervals** [L]. For large x the interval [x − x^{0.525}, x] contains ≫ x^{0.525}/log x primes
  (Baker–Harman–Pintz 2001). Used only in Theorem MT, step 1, to bound the tracking lag.
* **(I9) Hoeffding's inequality and Borel–Cantelli** [standard]. Used only in Theorem MT.
* **(I10) Literature used only in remarks** [L, not re-verified]:
  * Gonek–Hughes–Keating's hybrid Euler–Hadamard product (Duke Math. J. 136, 2007);
  * Montgomery's zero-detection method (Topics in Multiplicative Number Theory, LNM 227, 1971; Ivić, *The Riemann
    Zeta-Function*, ch. 11);
  * Wintner, Random factorizations and Riemann's hypothesis (Duke Math. J. 11, 1944), and Bohr–Jessen.

Notation from round 1, for a support a and offset δ = δ₀:
* m = m(a, δ₀) = sinh(2aδ₀)/(2δ₀) − a;
* w = w_{a,δ₀} = g₀/m, the normalised matched-filter weight, supported on [0, 2a], with w(0) = 1, |w| ≤ 1, a positive lobe
  near 0 and a negative lobe near 2a;
* LHS_a(H) = Σ_{n≤e^{2a}} Λ(n) n^{−1/2} w(log n) cos(H log n), the real part of
  S_a(H) := Σ_{n≤e^{2a}} Λ(n) n^{−1/2−iH} w(log n);
* β(H) = ½ log(H/2π) + O(H⁻¹), the slack s(a), and the thresholds a_ideal (continuous model) and a_rig (rigorous
  majorants);
* T(a) = Σ_{n≤e^{2a}} Λ(n) n^{−1/2} |w(log n)|, the Kronecker-torus bound;
* (★)_a at height H means LHS_a(H) ≤ β(H), which is Weil non-negativity in this direction;
* (★_min)_a at height H means LHS_a(H) < β(H) + s(a).

---

## 2. The argument

### Step 1 (normalisation)

As in round 1, write ρ₀ = ½ + δ₀ + iγ₀ with 0 < δ₀ ≤ 3/8 (by (I2)) and γ₀ > 3.0001753·10¹² (by (I3)). Under (I2′) one has
δ₀ ≤ 0.37488665. Choose ρ₀ with maximal offset in its window, so that the round-1 option δ̄ = δ₀ is available.

### Step 2 (the zero forces alignment of the prime phases)

**(2a) Fixed scale** (round-1 Proposition 5 and (5.1); PROVED under (Iso_D)). For every a with s(a) > 0,

    LHS_a(γ₀) ≥ β(γ₀) + s(a).                                                         (A)

In the continuous model, LHS_a(γ₀) ≈ m(a) for a ≥ a_ideal.

**(2b) All scales, no isolation** (round-1 Lemma L, contrapositive; PROVED there). Let U_H(W) be the Weil value of
e^{−iHu} sinh(δu) 1_{|u|≤W/2}. For every θ < δ₀, every H, and every C, W₀ there is W ≥ W₀ with
U_H(W) < −C e^{(δ+θ)W}.

**Lemma E (the Euler product at one height is a torus parametrisation; PROVED, elementary).** For N ≥ 2 put
𝕋_N := (ℝ/2πℤ)^{π(N)} and Φ_N(H) := (H log p mod 2π)_{p≤N}. For n ≤ N let v(n) be the exponent vector of n. Then:

* n^{−iH} = e^{−i⟨v(n), Φ_N(H)⟩};
* every Dirichlet polynomial D(H) = Σ_{n≤N} b_n n^{−iH} equals D̃(Φ_N(H)), where D̃(φ) := Σ_n b_n e^{−i⟨v(n),φ⟩};
* D(kH) = D̃(kΦ_N(H)) for k ∈ ℤ, and D(H + τ) = D̃(Φ_N(H) + τ ℓ) with ℓ = (log p)_p.

*Proof.* This is unique factorisation, i.e. the Euler product of ζ. ∎

With N = e^{2a} and L̃_a(φ) := Σ_n Λ(n) n^{−1/2} w(log n) cos⟨v(n), φ⟩, statement (A) reads

    Φ_N(γ₀) ∈ 𝒜_a := { φ ∈ 𝕋_N : L̃_a(φ) ≥ β(γ₀) + s(a) }.                              (A_φ)

So the zero forces the phase vector of the primes up to N_vis into the half-space 𝒜_a. The dominant contribution comes
from the negative lobe of w near log N: the phases of the primes near N_vis are biased towards π, with relative bias
≈ p^{δ₀−½}. This is the Chebyshev drift −x^{β₀}/β₀ of Σ_{n≤x} Λ(n) n^{−iγ₀}.

### Step 3 (transfer to a short support through the Euler product)

**The provable support.** Let a_triv(H) := sup{a : T(a) ≤ β(H)}. For a ≤ a_triv, (★)_a (and so (★_min)_a) holds at H
**for every phase vector**, because |L̃_a| ≤ T(a). At H = 3·10¹² one has 2a_triv = 6.57, i.e. N ≈ 710 (Table S, §3.8).

**Lemma T (claimed).** If (A_φ) holds for some a ≥ a_rig(δ₀, γ₀), or (2b) holds, then some statement that is provable at
a short support (a support at most a_triv, at height γ₀ or kγ₀) is violated.

Three routes are proposed.

**Route T1 (harmonic positivity: the Euler product relates the phases at γ₀, 2γ₀, …, Kγ₀).** Take:

* h ≥ 0 even, supported in [−a′, a′], and g₀ := h * h, so that g₀ ≥ 0 and ĝ₀ = ĥ² ≥ 0;
* a nonnegative trigonometric polynomial P(ψ) = c₀ + 2 Σ_{k=1}^K c_k cos kψ with c₁ > 0;
* G(v) := g₀(v) P(γ₀ v).

Then:

* (T1.1) G(log n) ≥ 0, hence Pr(G) := 2 Σ_n Λ(n) n^{−1/2} G(log n) ≥ 0. This holds for every phase vector.
* (T1.2) By (I1), Z(G) := Σ_ρ Ĝ(γ_ρ) = poles(G) + A(G) − Pr(G) ≤ poles(G) + A(G), where:
  * poles(G) = c₀ X_p + O(e^{a′}/γ₀) with X_p := ∫ g₀(v) 2cosh(v/2) dv;
  * A(G) = c₀ A₀ + 2 Σ_{k≥1} c_k A_k with A_k := (1/2π) ∫ ĝ₀(r − kγ₀) Ω(r) dr.
* (T1.3) Ĝ(z) = Σ_{|k|≤K} c_{|k|} ĝ₀(z − kγ₀). The four zeros ±γ₀ ± iδ₀ contribute 4c₁ ĝ₀(iδ₀) = 2c₁ X_z, with
  X_z := ∫ g₀(v) 2cosh(δ₀ v) dv.
* (T1.4) **[claimed]** The on-line zeros near ±kγ₀ contribute Σ_γ Ĝ(γ) = Σ_k c_{|k|} A_k + o(g₀(0)). They carry the mean
  density Ω/2π, which cancels the archimedean term. So (T1.2) becomes 2c₁ X_z ≤ c₀ X_p + o(g₀(0)).
  * Take P to be the Fejér kernel of degree K, so that 2c₁/c₀ = 2K/(K+1) → 2.
  * Take a′ small, so that X_z/X_p → 1.
  * Then 2c₁ X_z > c₀ X_p, a contradiction.

**Route T2 (conditional tilt of the phases).**

* (T2.1) Φ_N(γ₀) ∈ 𝒜_a, by (A_φ).
* (T2.2) By Lemma E, the harmonic sums at heights kγ₀ are L̃^{(k)}(Φ_N(γ₀)) := L̃(kΦ_N(γ₀)).
* (T2.3) **[claimed]** The Kronecker line {Φ_N(H)} is equidistributed in 𝕋_N (Kronecker–Weyl). So a point of the line in
  𝒜_a is distributed like Haar measure conditioned on 𝒜_a.
  * Under that law the phases are tilted: φ_p has density ∝ e^{λ c_p cos φ}, with c_p = log p · p^{−1/2} w(log p) and λ fixed
    by Σ_p c_p I₁(λc_p)/I₀(λc_p) = β + s.
  * Hence L̃^{abs}(2Φ_N(γ₀)) := Σ_p |c_p| cos(2γ₀ log p) ≥ B_tilt := Σ_p |c_p| I₂(λc_p)/I₀(λc_p) > 0, and similarly at kγ₀.
* (T2.4) **[claimed]** Summed over k = 2..K with Fejér weights at a short support, these forced biases exceed the trivial
  bound there. That is a contradiction.

**Route T3 (peeling by Selberg's identity).** Let ω be smooth and compactly supported, with ω(v) = w(v)/v on
[log 2, 2a]. Then:

* (T3.1) By (I6) and Lemma F (§3.5), exactly:

      S_a(γ₀) = (1/2π) ∫ ω̂(τ) [ M(γ₀ − τ) L₂(γ₀ − τ) − Λ_{N/2}(γ₀ − τ)² ] dτ,

  where:
  * M(t) = Σ_{d≤N} μ(d) d^{−1/2−it};
  * L₂(t) = Σ_{e≤N} log²e · e^{−1/2−it};
  * Λ_{N/2}(t) = Σ_{d≤N/2} Λ(d) d^{−1/2−it}.
* (T3.2) **[claimed]** |S_a(γ₀)| ≥ β + s. The Möbius–log² product is small at these lengths. Hence
  sup_τ |Λ_{N/2}(γ₀ − τ)|² ≳ 2π(β + s)/‖ω̂‖₁. Iterating with Heath-Brown's identity, the alignment descends to Dirichlet
  polynomials of length at most e^{2a_triv}. One of them must exceed its torus maximum, which is a contradiction.

**Route T4 (zero detection: the functional equation and the Euler product together; added in the revision).** Let
M_X(s) = Σ_{n≤X} μ(n) n^{−s} and a_n := Σ_{d|n, d≤X} μ(d). Then a₁ = 1, a_n = 0 for 1 < n ≤ X, and |a_n| ≤ d(n).

* (T4.0) [L, Montgomery's method] At the zero, smooth with e^{−n/Y} and move the contour to the critical line. This
  gives

      e^{−1/Y} + Σ_{n>X} a_n n^{−ρ₀} e^{−n/Y} = (1/2π) ∫ (ζM_X)(½ + i(γ₀ + v)) Γ(−δ₀ + iv) Y^{−δ₀ + iv} dv + O(γ₀^{−A}).

  * The Euler product enters through the bounded Möbius coefficients a_n.
  * The functional equation enters through the bound for ζ on the critical line, which makes the integral converge and
    stay small.
* (T4.1) [L, standard] Hence either |Σ_{X<n≲Y log²Y} a_n n^{−ρ₀} e^{−n/Y}| ≥ ¼, or |ζM_X(½ + it)| ≥ c Y^{δ₀}/log γ₀ for
  some |t − γ₀| ≤ log² γ₀.
* (T4.2) **[claimed]** Neither large value can occur at the single point γ₀. That would be a contradiction.

### Step 4 (contradiction)

Lemma T and (A_φ) contradict each other, so there is no zero ρ₀ satisfying (Iso_D). The version from (2b) needs no
isolation hypothesis.

### Step 5 (conclusion)

Steps 1–4 for every δ₀ ∈ (0, 3/8] and γ₀ > 3·10¹², together with (I2) and (I3), would give RH.

**Where the Euler product is used.** Lemma E: unique factorisation makes n^{−iγ₀} a character of the torus. T1: Λ ≥ 0
and the relation p^{−ikγ₀} = (p^{−iγ₀})^k. T2: independence of the log p through Kronecker–Weyl. T3: Selberg's
identity and the factorisation of type-II sums. T4 (rev.): bounded Möbius coefficients, together with the functional
equation through the contour on the critical line. Elsewhere the functional equation enters only through the
archimedean term Ω, which sets the target β = Ω/2.

**Why the design was expected to avoid the four walls** (§5 records what happened):

1. **Flow-blindness.** Step 3 uses Λ, its prime support and multiplicativity. The backward heat flow destroys all three,
   since H_{−ε} has no Dirichlet series.
2. **NS-RIGID.** The test functions are modulated at the complex heights kγ₀, off the native real span, and the
   multi-height structure has no native-span counterpart.
3. **Verified height.** The contradiction is sought at the height γ₀ > 3·10¹² itself, at a short support, and not as a
   consequence of zeros below the verified height.
4. **Pointwise / MV-CAP.** Everything is evaluated at the single height γ₀, where the Euler product was meant to supply
   exactly the pointwise input that, by MV-CAP, mean values cannot give.

---
## 3. Attack on Step 3

### 3.1 No free transfer

**Definition (torus-valid).** Take finitely many Dirichlet polynomials D_j of length at most N, evaluated at heights
k_j H + τ_j with fixed integers k_j and reals τ_j. A statement about them is *torus-valid* if the corresponding statement
about the functions D̃_j(k_j φ + τ_j ℓ) holds for **every** φ ∈ 𝕋_N.

* Examples:
  * (T1.1), and every inequality obtained from Λ ≥ 0 and a nonnegative phase polynomial;
  * every coefficientwise identity: Selberg, Vaughan, Heath-Brown, Lemma F;
  * the trivial bounds |D̃| ≤ Σ|b_n|;
  * Fejér–Riesz/Bochner positivity in the phase variables.
* Non-examples: statements that come from the location of zeros (the verified height, the 7/8 half-plane, zero-free
  regions) or from the size of ζ (Vinogradov–Korobov). These single out the line {Φ_N(H)} through analytic continuation.

**The alignment set of an argument.** An argument uses zero-side information through finitely many explicit formulas.
That information consists of the hypothetical zero and any certified bounds on the other zeros' contributions. By
Lemma E each explicit formula becomes a constraint D̃_j(φ) ∈ I_j on φ = Φ_N(γ₀). Call 𝒜 := ∩_j {D̃_j ∈ I_j} the alignment set.

* For Step 2, 𝒜 = 𝒜_a.
* For T1, 𝒜_{T1} = {φ : P̃r(G)(φ) ≤ R_{T1}}, where R_{T1} := c₀(X_p + A₀) + 2Σ_{k≥1} c_k A_k − 2c₁X_z, with the on-line zeros
  dropped.

**Theorem NFT (no free transfer; PROVED).**

1. **(Attainability.)** For every δ₀ ≤ 3/8, every γ₀ > 3·10¹² and every support with s(a) > 0, 𝒜_a ≠ ∅.
   * Explicitly, at δ₀ = 3/8 and γ₀ = 3·10¹², take φ_p ∈ {0, π} with e^{iφ_p} = sign w(log p). With exact prime powers this
     gives L̃_a = 39.06 at a = a_ideal (2a = 8.767). The continuous-model target is m = β = 13.45, a ratio of 2.90.
   * At a = a_rig (2a = 13.69) the same choice gives 466.8, against a target of at most β + m = 119.9 (ratio 3.89) (R6).
   * In general the {0, π} vector reaches at least T(a) − 2B(2a). Here B(r) := Σ_{p^k ≤ e^r, k≥2} log p · p^{−k/2}
     ≤ r/2 + 1.131 for r ∈ [1, 30] (exact sum). Asymptotically B(r) = r/2 + 1.1436 + o(1) (prime-memory module, with
     κ = −γ + Σ_p log p/(√p(p−1))).
   * Round-1 Table A gives T(a)/(β + s) ≥ 3.03 (continuous model) and ≥ 8.22 (rigorous majorants) at every support.
     Hence T(a) − 2B(2a) ≥ β + s whenever T(a) ≥ 3(a + 1.15). This holds at every support from the visibility threshold
     on: T = 40.9 against 16.6 at δ₀ = 3/8, and T grows like e^{a}.
   * For T1, 𝒜_{T1} ≠ ∅ above the height ceiling of Proposition PD (§3.3).
2. **(Torus-valid statements are powerless.)** If 𝒜 ≠ ∅, no family of torus-valid statements is inconsistent with
   Φ_N(γ₀) ∈ 𝒜. In particular, Lemma T has no proof that uses only torus-valid statements.
3. **(What a proof must contain.)** Let 𝒮 be a statement about the actual vectors {Φ_N(H) : H > X}. Then 𝒮 is inconsistent
   with "Φ_N(H) ∈ 𝒜_a(H) for some H > X" if and only if 𝒮 implies (★_min)_a at every height H > X.

*Proof.*
* (1): direct evaluation (`referee.json` R6; `supports.json`; round-1 `minimal.json`).
* (2): pick φ ∈ 𝒜. Every torus-valid statement holds at φ, and so does the constraint that defines 𝒜.
* (3): 𝒮 is inconsistent with the alignment at every possible height exactly when it excludes Φ_N(H) ∈ 𝒜_a(H) for every
  H > X. That is (★_min)_a on (X, ∞). ∎

**Consequences.**

* The theorem's content lies in two facts: attainability, and Lemma E's observation that all the Euler-product input at
  a single height is torus-valid.
* Lemma T, for every possible γ₀ > 3·10¹², is **equivalent** to this statement: at every height H > 3·10¹², (★_min)
  holds at some support a ≥ a_rig(H). (rev., C1: the 17:33 text read "(★_min)_a at all heights", which fixes a.) This
  is round 1's open inequality: at fixed support it is RES-T (B3) and the MV-CAP wall, and over all supports it is the
  V7 floor (Lemma L).
* "Contradicting the visibility law at a support where the bound is provable" is therefore impossible when "provable"
  means torus-valid. At such supports the bound holds for **every** phase vector, so no alignment of phases can violate it.
* When "provable" means provable through non-torus-valid input, the available inputs are the finite verified height and
  half-planes at θ ≥ 0.37488665: conditional Xu–Sang, 3/8 for QRH, θ → ½ for the Vinogradov–Korobov region (§3.7).

**Finite length only (rev.).** NFT works at one length N and checks attainability one support at a time. §3.2 removes
both restrictions.

### 3.2 The Euler product carries no information about short lengths: a multiplicative twin with a planted zero (new in the revision)

NFT works at one length N and shows attainability one support at a time. This subsection removes both restrictions. It
works with all primes at once, all supports, all harmonics and the analytic continuation.

**Setting.** A completely multiplicative f: ℕ → S¹ is a point of the infinite torus 𝕋^∞ = (ℝ/2πℤ)^{primes}, through
f(p) = e^{−iφ_p}. For k ∈ ℤ put

    F_k(s) := Σ_n f(n)^k n^{−s} = Π_p (1 − f(p)^k p^{−s})^{−1}   (Re s > 1),        ψ_k(x) := Σ_{n≤x} Λ(n) f(n)^k,
    LHS_a(f) := Σ_{n≤e^{2a}} Λ(n) n^{−1/2} w_{a,δ₀}(log n) Re f(n).

The Kronecker point of ζ at height H is f_H(n) = n^{−iH}. For f = f_{γ₀}:

* F_k(s) = ζ(s + ikγ₀), and F₀ = ζ;
* the hypothetical zero ρ₀ is the zero s = β₀ := ½ + δ₀ of F₁;
* LHS_a(f_{γ₀}) is round 1's LHS_a(γ₀).

Step 2 extracts exactly two prime-side statements from ρ₀:

* (A): LHS_a ≥ β(γ₀) + s(a) for a ≥ a_rig;
* (2b): the all-scale form of Lemma L.

**Theorem MT (multiplicative twin with a planted zero; PROVED, same-agent check only).** Let ½ < β₀ ≤ 7/8,
δ₀ = β₀ − ½, κ ≥ 0, and T(x) := x^{β₀}/β₀ + κ x^{1/2}(log x)². Almost every realisation f of the construction below is a
completely multiplicative function ℕ → S¹ with the following properties.

* (a) ψ₁(x) = −T(x) + O(x^{1/2} log x).
* (b) F₁ extends holomorphically to Re s > ½, and its only zero there is a simple zero at s = β₀.
* (c) For every k ∉ {−1, 0, 1}, ψ_k(x) = O(x^{1/2} log x), and F_k extends holomorphically and without zeros to
  Re s > ½. (F₋₁(s) = conj F₁(s̄) has the same zero, and F₀ = ζ.)
* (d) LHS_a(f) = m(a) + B_κ(a) + O(a^{3/2}). Here B_κ(a) := −κ ∫₀^{2a} w(v)(v²/2 + 2v) dv ≥ 0, with
  B_κ(a) ~ 2κa²/δ₀. Hence the prime part U_f(W) := −2m·LHS_{W/2}(f) of the Weil value is −2m(W/2)²(1 + o(1)). This is
  the all-scale alignment (2b) of Step 2, for every θ < δ₀.
* (e) If κ > 0, then for every fixed height γ₀ ≥ 10³, (A) holds for all a ≥ a₁. The threshold a₁ depends on f and γ₀.
* (f) For every finite set S of primes and every (u_p)_{p∈S} ∈ (S¹)^S, let f_S agree with u_p on S and with f elsewhere.
  Then f_S satisfies (a)–(e) with the same β₀ (other constants and thresholds).

*Construction (used in the proof).* Let p₁ < p₂ < ⋯ be the primes and L_j = log p_j.

* First define a **deterministic** sequence ε_j ∈ [0, ½] by tracking the target:

      S₀ = 0,     ε_j := clip((T(p_j) − S_{j−1})/L_j, 0, ½),     S_j := S_{j−1} + ε_j L_j.

* Then draw θ_j **independently** from the density (1 − 2ε_j cos t)/(2π) on [0, 2π), and put f(p_j) := e^{iθ_j}.

The density is non-negative because ε_j ≤ ½. Its Fourier coefficients are 1 at k = 0, −ε_j at k = ±1 and 0 at |k| ≥ 2,
so

    E e^{iθ_j} = −ε_j,      E e^{ikθ_j} = 0  (|k| ≥ 2),      E sin θ_j = 0.                                  (MT.1)

The first harmonic is pushed towards the target −T, and no other harmonic receives any drift. The scripts also use an
*adaptive* variant in which ε_j tracks the realised sum Σ_{i<j} L_i cos θ_i. It tracks more tightly. Any finite phase
vector it produces is a legitimate prefix, by (f).

*Proof.*

1. **The deterministic lag.**
   * Let D_j := T(p_j) − S_j ≥ 0. Then D_j = max(0, D_{j−1} + T(p_j) − T(p_{j−1}) − ½L_j), a Lindley recursion. So D_j is
     the maximum over windows (p_i, p_j] of [T(p_j) − T(p_i)] − ½[θ(p_j) − θ(p_i)].
   * Consider a window of length y ending at x = p_j.
     * If y ≥ x^{0.525}, then θ(x) − θ(x − y) ≥ c₀y for large x (I8). Split the window into ⌊y/x^{0.525}⌋ intervals of
       length x^{0.525}, each carrying ≫ x^{0.525} of θ. Since T(x) − T(x − y) ≤ y(4x^{β₀−1} + 2κx^{−1/2}log²x), the
       window term is then ≤ y(4x^{β₀−1} + 2κx^{−1/2}log²x − c₀/2) + O(1), which is negative for large x.
     * If y < x^{0.525}, the window term is ≤ x^{β₀−1}·x^{0.525}(1 + o(1)).
   * Hence D(x) = O(x^{β₀−0.475}), which is O(x^{0.4}) for β₀ ≤ 7/8.
   * Measured: max D ≤ 39 over p ≤ 10⁸, i.e. D ≤ 1.22 x^{β₀−0.475} (`twin-indep.json`).
2. **Martingale parts.**
   * Each of the following is a sum of independent mean-zero terms bounded by 2L_p, by (MT.1):
     * Σ_{p≤x} L_p (cos θ_p + ε_p);
     * Σ_{p≤x} L_p sin θ_p;
     * Σ_{p≤x} L_p e^{ikθ_p}, for each |k| ≥ 2.
   * Σ_{p≤X} L_p² ≤ X log X. Hoeffding's maximal inequality gives P(max_{x≤X} |M(x)| ≥ 4√X log X) ≤ 2X^{−2}.
   * Borel–Cantelli over X = 2^j then gives M(x) = O(x^{1/2} log x) almost surely, for each k and hence for all k at
     once (a countable intersection).
   * Proper prime powers contribute O(x^{1/2}) deterministically.
   * So Σ_{p≤x} L_p cos θ_p = −T(x) + D(x) + O(x^{1/2} log x), which proves (a) and the growth statement in (c).
3. **Continuation.** For Re s > 1,

       log F_k(s) = Σ_n Λ(n) f(n)^k n^{−s}/log n = ∫_{2⁻}^∞ x^{−s}(log x)^{−1} dψ_k(x).

   * **For |k| ≥ 2.** Integrate by parts against ψ_k = O(x^{1/2} log x). The resulting integral converges absolutely and
     locally uniformly on Re s > ½. So log F_k continues holomorphically there, and F_k = exp(log F_k) is holomorphic and
     zero-free: (c).
   * **For k = 1.** Write ψ₁ = −T·1_{[2,∞)} + E with E = O(x^{1/2} log x); the jump T(2) at x = 2 is absorbed into E.
     * The E-part continues as before.
     * The T-part is

           −∫₂^∞ x^{β₀−1−s}(log x)^{−1} dx − κ∫₂^∞ x^{−s−1/2}(½ log x + 2) dx.

     * The second integral is holomorphic on Re s > ½. The first equals −E₁((s − β₀) log 2) = log(s − β₀) + (entire),
       where E₁ is the exponential integral.
     * Hence log F₁(s) = log(s − β₀) + G(s) with G holomorphic on Re s > ½, and F₁(s) = (s − β₀)e^{G(s)}: (b).
4. **Alignment, (d).** LHS_a(f) = ∫_{1⁻}^{e^{2a}} x^{−1/2} w(log x) d Re ψ₁(x).
   * **The T-part** is −∫_{log 2}^{2a} e^{δ₀v} w(v) dv + B_κ(a).
     * The full integral J(a) := −∫₀^{2a} e^{δ₀v} w(v) dv equals m(a) + 1/(2δ₀) + O(a² e^{−2aδ₀}). To see this, put
       E₀ := e^{2aδ₀}/(4δ₀). The closed form of g₀ gives ∫₀^{2a} e^{δ₀v}g₀ dv = −E₀² + 2aE₀ − E₀/(2δ₀) + O(a²), and
       m = E₀ − a + O(e^{−2aδ₀}).
     * Quadrature (F2) gives J − m = 1.2788, 1.3215 and 1.3313 at 2a = 18.4, 24 and 30, against 1/(2δ₀) = 4/3.
     * The piece from 0 to log 2 tends to the constant log 2.
   * **The lag D** contributes −∫ D(e^v) d(e^{−v/2}w(v)) after integration by parts (w(2a) = 0). Since |w| ≤ 1 and
     |w′| ≤ 3δ₀ + o(1) uniformly in a, this is bounded by ∫ O(e^{0.4v}) e^{−v/2} dv = O(1), uniformly in a.
   * **The prime powers** contribute O(1) almost surely. Their k = 2 part is a sum of independent mean-zero terms with
     summable variance.
   * **The martingale part** is X(a) := Σ_{p≤e^{2a}} L_p p^{−1/2} w(log p)(cos θ_p + ε_p). It is a sum of independent
     mean-zero terms with Σ (1.5 L_p p^{−1/2})² ≤ 5a².
     * Hoeffding's inequality gives P(|X(a)| > t) ≤ 2 exp(−t²/(10a²)).
     * Take a grid containing every a_j = ½ log p_j together with a mesh of width e^{−2a}. There are O(e^{2A}) grid
       points in [A, A + 1]. Set t = √60 · a^{3/2}. Each grid point then fails with probability ≤ 2e^{−6a}, and the
       union bound sums like ∫ e^{2a}e^{−6a} da < ∞.
     * Between neighbouring grid points no prime enters. X changes only through the dependence of w_a on a, and
       |∂_a w_a| = O(δ₀) uniformly. So |dX/da| ≤ Σ_{p≤e^{2a}} 1.5 L_p p^{−1/2} O(δ₀) = O(e^{a}), and the change across
       one mesh cell is O(e^{a}·e^{−2a}) = o(1).
     * Hence X(a) = O(a^{3/2}) almost surely, which is o(a²).
     * The actual variance of X(a) is ≈ ½∫ v w(v)² dv = O(a/δ₀), so typical values are O(a^{1/2}). The crude bound is
       enough here.
   * **Sign and size of B_κ.**
     * ∫₀^{2a} w = 0 exactly: g₀ is the autocorrelation of the odd function sinh(δ₀u)1_{|u|≤a}, so ∫ g₀ = |∫ f|² = 0.
     * w changes sign once, from positive to negative. So ∫ wφ ≤ 0 for every increasing φ, and φ(v) = v²/2 + 2v gives
       B_κ ≥ 0.
     * The negative lobe −δ₀(2a − v)e^{−δ₀(2a−v)} gives B_κ(a) = κ(2a²/δ₀ + O(a/δ₀²)). Per unit κ, B is 60, 136, 289,
       929 and 4262 at 2a = 10, 13.7, 18.4, 30 and 60 (F6).
   * Finally, U_f(W) = −2m(m + O(a²)) = −2m²(1 + o(1)).
5. **Fixed support, (e).**
   * Dropping M_far ≥ 0 gives β + s(a) ≤ R_up(a) := β + m(a) − M_on(a)/2.
   * As a → ∞, M_on(a) → 4β + 8B(2γ₀)/δ₀ (round-1 Lemma 3). So R_up(a) − m(a) → −β − 4B(2γ₀)/δ₀ < 0.
   * By (d), LHS_a − m ≥ B_κ(a) − O(a^{3/2}), which tends to +∞ when κ > 0, since B_κ(a) ~ 2κa²/δ₀.
6. **Finite modifications, (f).**
   * F_{S,k}(s) = F_k(s) Π_{p∈S} (1 − f(p)^k p^{−s})/(1 − u_p^k p^{−s}). Each factor is holomorphic and zero-free on
     Re s > 0, since |u_p^k p^{−s}| < 1 there.
   * ψ_{S,k} − ψ_k = O(|S| log x).
   * LHS_a changes by at most 2Σ_{p∈S} log p/(√p − 1), independently of a. ∎

Remarks.
* **The booster κ.** With κ = 0, statements (a)–(d) and (f) hold unchanged. Statement (e) then needs the fluctuation
  X(a) to stay above −(β + 4B(2γ₀)/δ₀) at all large a. The booster only makes this automatic. Numerically, κ = 0 already
  satisfies (A) on the whole tested range, with both constructions (table below).
* **Novelty.** The construction is a random Euler product of Wintner / Bohr–Jessen type (I10) with a deterministic
  first-harmonic drift. A random Euler product of this kind converges and is zero-free on Re s > ½ almost surely; the
  drift plants exactly one zero. The construction is elementary, and it is not claimed to be new.
* **The pole of ζ(s + iγ₀).** The twin has no pole at 1 − iγ₀, while ζ(s + iγ₀) does. In the explicit formula at γ₀
  that pole enters only through P = O(e^{a}/γ₀²) (round-1 Step 5), which is negligible at every support considered.

**Corollary SF (short-length freedom; PROVED from Theorem MT, with κ > 0 and (f)).** Fix δ₀ ∈ (0, 3/8], a finite set S
of primes and any phases (u_p)_{p∈S}. There is a completely multiplicative unimodular f with f = u on S such that:

* F₁ has a simple zero at ½ + δ₀ and no other zero in Re s > ½;
* every harmonic F_k with |k| ≥ 2 is zero-free there;
* its matched-filter sums satisfy (2b) and, eventually in a, (A) at any prescribed height.

So the zero imposes no constraint on (γ₀ log p mod 2π)_{p∈S} that follows from:

* multiplicativity and unimodularity;
* prime support of Λ and Λ ≥ 0;
* the harmonic relations p^{−ikγ₀} = (p^{−iγ₀})^k;
* the Selberg/Vaughan/Heath-Brown identities;
* the holomorphy and zeros of all F_k on Re s > ½, together with growth of at most exponential order on vertical
  lines. Polynomial (Lindelöf-type) growth of the twin's F_k is expected for random Euler products, but it is not
  proved here, so it is not on this list.

For the plan of §0.1 ("use the Euler product to force alignment of the phases γ₀ log p at short lengths"), this means
there is no Euler-product mechanism: at short lengths the phases are free. The measurements below show that the free
range is large at the first relevant height.

**Measured** (`twin-main.json`, `twin-variants.json`, `twin-indep.json`; one realisation per row; MEASURED).

Setting: γ₀ = 3.0001753·10¹² (β = 13.446), δ₀ = 3/8, κ = 0 and the adaptive construction unless stated.

* R_up(a) = β + m − M_on/2 is an upper bound for the level β + s(a) that (A) requires, for every isolation choice
  (round-1 Proposition 5).
* "Adversarial" means Re f(p) = −sign w(log p) on the prescribed primes. Their contribution to LHS_a is then within 4% of
  its torus minimum at a_rig: −27.1 against −28.2 for p ≤ 6,420, and −87.3 against −88.5 for p ≤ 3·10⁴.

| twin | prescribed phases on p ≤ N_short | tested 2a | min over supports of LHS − R_up | LHS − m |
|---|---|---|---|---|
| natural (N = 10⁸) | none | 8.77–18.42 | +90.5 | +1.49 to +3.49 |
| natural, two more seeds (N = 3·10⁷) | none | 13.70–17.21 | +91.0, +91.0 | +3.01 to +3.27 |
| independent construction of the proof (N = 10⁸) | none | 8.77–18.42 | +90.6 | +2.47 to +4.40 |
| booster κ = 0.01, adaptive / independent | none | 13.70–17.21 / 8.77–18.42 | +94.0 / +96.5 | +4.75 to +6.26 / +2.81 to +10.26, growing |
| prescribed | f(p) = −1; N_short = 710 / 6,420 / 10⁵ | 13.70–17.21 | +88.1 / +86.4 / +104.8 | |
| prescribed | f(p) = +1; N_short = 710 / 6,420 / 10⁵ | 13.70–17.21 | +102.1 / +89.0 / **−73.6** | |
| prescribed | f(p) = p^{−iH₁}, H₁ = 10⁶ + ½ (ζ's own phases at another height); N_short = 710 / 6,420 / 10⁵ | 13.70–17.21 | +94.5 / +94.8 / +69.2 | |
| adversarial | N_short = 6,420 = N_vis | 13.70–17.21 | +80.7 | −12.3 to +2.9 |
| adversarial | N_short = 3·10⁴ | 13.70–17.21 | +30.9 | −62.1 to −9.9 |
| natural, δ₀ = 0.2 (N = 10⁸) | none | 13.99–18.42 (a_rig is at 2a = 25.1) | +198.5 | +2.74 to +3.15 |

Reading.

* **The natural twin is more aligned than ζ would need to be.** LHS − m ≈ +3.4, against 0 in the continuous model.
  For the natural twins LHS − R_up ≥ +90 at every tested support, where (A) only needs ≥ 0.
* **Short primes are free up to the visibility length.**
  * Prescribing all primes up to N_vis = 6,420 adversarially leaves a margin ≥ 80. That range is the whole visibility
    length of round-1 Table 1.
  * Among the tested prescriptions, (A) fails only when the primes up to 10⁵ ≈ 15 N_vis are all set to f ≡ +1, and
    then only for 2a ≤ 15.0. From 2a = 15.5 on, the margin is +7.5 and increasing.
  * So at γ₀ = 3·10¹² and δ₀ = 3/8, at the tested supports 13.70 ≤ 2a ≤ 17.21, the rigorous single-height constraints
    of the zero leave every prime below 3·10⁴ free, adversarial choices included.
* **No harmonic drift.**
  * Over 400 realisations at 2a = 13 (`twin-seeds.json`), the normalised sums for k = 2, 3, 4 have means +0.056, −0.065
    and −0.010, with standard error 0.050. Their standard deviations are 1.006, 1.007 and 0.975, as (MT.1) predicts.
  * Over 40 realisations at 2a = 15, LHS − m = 3.40 ± 0.45 for δ₀ = 3/8 and 2.65 ± 0.37 for δ₀ = 0.2.
  * One realisation at δ₀ = 0.2 reached 3.2σ in the second harmonic. Across seeds this is chance.
* **Tracking.**
  * Adaptive construction: the supremum over p ≤ 10⁸ of |Σ_{q≤p} log q cos θ_q + T(p)|/log² p is 1.81 for δ₀ = 3/8 and
    0.38 for δ₀ = 0.2.
  * Both constructions: |Im ψ₁|, |ψ₂| and |ψ₃| stay ≤ 0.56 √x log x at x = 10⁶, 10⁷ and 10⁸.

**For ζ itself (Remark GHK; [L], not re-verified).** Gonek–Hughes–Keating's hybrid Euler–Hadamard product (I10) writes
ζ(s) = P_X(s) Z_X(s)(1 + small) on σ ≥ 0.

* P_X is a smoothed Euler product over the primes up to X. It never vanishes.
* Z_X is a product over the zeros within O(1/log X) of s.

A zero of ζ at ρ₀ is therefore a zero of Z_X, never of P_X, for every X. Corollary SF states the same separation in
terms of phases.

**What separates ζ from the twin.** Among the properties used in Steps 1–3, only two do.

1. **The Kronecker-line form.** f(p) = p^{−iγ₀} for a single real γ₀. Equivalently, F_k(s) = F₁(s + i(k − 1)γ₀) for
   every k: the harmonics are vertical translates of one function. The twin's harmonics are unrelated random Euler
   products.
   * In this attempt the Kronecker-line form enters only when a harmonic sum is identified with ζ's explicit formula at
     height kγ₀, whose zero side is not controlled (T1, Propositions PD and PD′).
2. **The functional equation.** This means the archimedean density Ω, the partner zero 1 − ρ̄₀, the zero count (I4) and
   the pole of ζ(s + iγ₀) at 1 − iγ₀.
   * In this attempt the functional equation enters only through the target β = Ω/2 and the counts (I4). Both are
     scalars at each height, and the twin's alignment exceeds the level they set.

So a proof by this route has to use (1) and (2) together, pointwise at γ₀. By NFT(3) that is (★_min), i.e. the pointwise
wall. Over all supports it is the V7 floor (Lemma L).

### 3.3 Route T1 fails at (T1.4): pole domination

**Proposition PD (reach of the multi-height positivity class; PROVED).** Take h, g₀, P and G as in Route T1. Here c_k
may have either sign for k ≥ 2, and c₁ > 0. Assume:

* the only zeros off the line are ρ₀ and its three reflections, and the zeros below 3·10¹² are on the line (I3);
* the argument uses only (T1.1), certified lower bounds ĝ₀ ≥ 0 for on-line zeros where c_k ≥ 0, and the unconditional
  upper count (I4) where c_k < 0;
* h has bounded variation with TV(h)² ≤ 10³ ‖h‖₂², so that τ ≤ 10⁻⁸ below.

Then (T1.2) can be violated only if

    log(γ₀/2π) − log 2 − τ  <  X_z/g₀(0) − ½ max(0, X_p/g₀(0) − |Ω(0)|)  ≤  R′(δ₀) + |Ω(0)|/2,      (PD)

where R′(δ) := ∫_ℝ [2cosh(δv) − cosh(v/2)]₊ dv = 2[2 sinh(δv*)/δ − 2 sinh(v*/2)] and v* solves 2cosh(δv*) = cosh(v*/2).

*Proof.*

1. **Zero side.**
   * The four zeros ±γ₀ ± iδ₀ give 2c₁X_z + ε₁, with |ε₁| = O(e^{2a′δ₀} TV(g₀)/γ₀). Only the |k| = 1 terms are
     non-oscillatory.
   * On-line zeros at heights near kγ₀ with c_k ≥ 0 contribute ≥ 0.
   * For c_k < 0, Σ_γ ĝ₀(γ − kγ₀) ≤ A_k + E_k with E_k ≥ 0, by (I4) and integration by parts.
   * Hence (T1.2) can fail only if

         2c₁X_z > c₀(X_p + A₀) + 2 Σ_{k≥1, c_k>0} c_k A_k + 2 Σ_{c_k<0} |c_k| E_k − ε  ≥  c₀(X_p + A₀) + 2c₁A₁ − ε.

     In the last step A_k > 0 for k ≥ 1 (see 2) and E_k ≥ 0.
2. **Archimedean terms.**
   * (1/2π)∫ĝ₀ = g₀(0), ĝ₀ ≥ 0, and Ω is even and increasing in |r| with Ω ≥ Ω(0). So:
     * A₀ ≥ Ω(0) g₀(0);
     * A₁ ≥ g₀(0)(Ω(γ₀/2) − τ′) with τ′ := (Ω(γ₀) − Ω(0))·(1/2π)∫_{|x|>γ₀/2} ĝ₀/g₀(0). Use Ω(x + γ₀) ≥ Ω(γ₀/2)
       for |x| ≤ γ₀/2 and Ω ≥ Ω(0) elsewhere;
     * Ω(γ₀/2) = Ω(γ₀) − log 2 + O(γ₀⁻²);
     * Ω(γ₀) = log(γ₀/2π) + O(γ₀⁻²).
   * Since |ĥ(x)| ≤ TV(h)/|x|, the tail satisfies (1/2π)∫_{|x|>X} ĥ² ≤ TV(h)²/(πX). This gives τ := τ′ + O(γ₀⁻²) ≤ 10⁻⁸
     for γ₀ > 3·10¹².
3. **Pole and height-0 terms.**
   * X_p + A₀ ≥ X_p − |Ω(0)| g₀(0).
   * Also X_p + A₀ = Z₀ + 2Σ_n Λ(n) n^{−1/2} g₀(log n) ≥ 0, by (I1) at height 0, (I3), and g₀ ≥ 0 positive-definite.
   * For P ≥ 0 one has |c₁| ≤ c₀, so c₀(X_p + A₀) ≥ c₁ max(0, X_p − |Ω(0)| g₀(0)).
4. **Conclusion.** Divide by 2c₁ g₀(0) to get the left inequality of (PD). For the right inequality, put
   u := g₀/g₀(0) ∈ [0, 1] (positive-definite and ≥ 0). Then

       X_z/g₀(0) − ½(X_p/g₀(0) − |Ω(0)|) = ∫ u [2cosh δ₀v − cosh(v/2)] dv + |Ω(0)|/2,

   which is at most R′(δ₀) + |Ω(0)|/2. ∎

**Table PD** (`pd.json`; closed form checked against quadrature to 8.4·10⁻¹⁰, R1). The "ceiling" is the largest γ₀ at
which (PD) can hold. The "achieved" column maximises the exact functional over nonnegative even 12-step profiles h and
a′ (Nelder–Mead, 6 restarts; MEASURED). It is a lower estimate of the true reach of the class; the R′ column is an upper
bound. The script adds a tail allowance of 0.05 (≫ τ), so the listed ceilings are slightly larger than (PD) requires,
i.e. conservative.

| δ₀ | v* | R′(δ₀) | bound on log(γ₀/2π) | ceiling log₁₀ γ₀ | achieved value, a′ | achieved ceiling log₁₀ γ₀ |
|---|---|---|---|---|---|---|
| 0.10 | 2.718 | 3.736 | 7.165 | 3.91 | 5.469, 2.75 | 3.50 |
| 0.20 | 3.023 | 4.216 | 7.646 | 4.12 | 5.801, 2.48 | 3.64 |
| 0.30 | 3.836 | 5.641 | 9.071 | 4.74 | 6.738, 3.06 | 4.05 |
| 0.35 | 4.795 | 7.730 | 11.160 | 5.64 | — | — |
| 0.37488665 | 5.628 | 10.118 | 13.547 | 6.68 | — | — |
| 0.375 | 5.633 | 10.133 | 13.563 | 6.69 | 9.314, 4.06 | 5.17 |
| 0.40 | 6.960 | 15.751 | 19.181 | 9.13 | — | — |
| 0.45 | 13.863 | 227.5 | 231.0 | 101.1 | 90.5, 8.58 | 40.4 |

* As δ₀ → ½, R′ ≈ 4η·2^{1/(2η)} with η = ½ − δ₀. Checked: 227.5 against 204.8 at η = 0.05; 2.80·10⁶ against 2.68·10⁶ at
  η = 0.02.
* So the class can reach β₀ > 1 − c/log log γ₀ at best. This upper bound is consistent with the classical and
  Vinogradov–Korobov regions, which are smaller.

**Reading.**

* For every δ₀ ≤ 0.40 the multi-height positivity class cannot exclude the zero above height 10^{9.13}. For δ₀ ≤ 3/8
  the limit is 10^{6.69} by the upper bound and 10^{5.17} by the optimum found. Both are far below the Platt–Trudgian
  height 10^{12.48}.
* Route T1 can therefore only re-prove verified-height facts. That is the verified-height wall (wall 3), the analogue of
  the RES-T ceiling T_X = 3.88 for this class.
* Using the exactly known low zeros changes nothing: for the optimal δ₀ = 3/8 profile, Z₀/g₀(0) = 0.0028 against
  Ω(3·10¹²) = 26.89.

**Explicit-formula check for the new family** (CERTIFIED-FLOAT, `pd.json`). Parameters: h = cos²(πu/(2a′)), a′ = 2.5,
P = 3 + 4cos ψ + cos 2ψ, H₀ = 10⁴, zeros 1..10⁶.

* Zero side 76.0104; poles 45.9028; archimedean 51.1971; prime side 21.0896 ≥ 0.
* The identity residual is 1.2·10⁻⁸ relative.
* The positivity slack poles + A − Z is exactly the prime side, as it must be.

**Why the written justification of (T1.4) is wrong.** The cancellation of A_k against the on-line zeros keeps the
on-line density fixed while the off-line pair is added. Zeros are conserved instead: |N − M| ≤ B(T) by (I4), and in the
MV-CAP realisation (Lemma 1 there) the pair replaces two on-line zeros at γ₀ + x₁ and γ₀ + x₂. The change in the zero side
is then

    ΔZ = 2c₁[2ĝ₀(iδ₀) − ĝ₀(x₁) − ĝ₀(x₂)] = 2c₁ μ₂ (δ₀² + (x₁² + x₂²)/2) + O(μ₄),   μ₂ := ∫ g₀ v² dv,

not 2c₁X_z.

* At the short supports where X_z/X_p → 1 one has μ₂ ≲ a′² ĝ₀(0). The pair's signature is then O(a′²) relative to one
  zero's weight.
* The on-line sum near γ₀ differs from A₁ by the local S(t) fluctuation, of size ≍ ĝ₀(0)·|ΔS|. This is not controlled
  pointwise. Zero-side count premises cannot see a window replacement: by MV-CAP Theorem C, N₀ moves by ≤ 2 zeros outside
  the window and ≤ 19.3 inside it.
* At long supports the pole term dominates (PD). Either way (T1.4) needs pointwise zero-counting input at γ₀. This is the
  visibility law of round-1 Lemma 2 in the multi-height setting.

**Proposition PD′ (the same class with two-sided unconditional zero counting; reduction PROVED, optimum MEASURED).**
Now let the argument also bound the on-line blocks near ±kγ₀ **from below** by (I4). The count N(t) includes the
off-line pair at ordinate γ₀, so

    Σ_{on-line} ĝ₀(γ − γ₀) = ∫ ĝ₀(t − γ₀) dN(t) − 2ĝ₀(0) ≥ A₁ − E₁ − 2ĝ₀(0),
    E_k := B·TV(ĝ₀),  B = B(2γ₀),

and similarly for k ≥ 2 with either sign of c_k. Move the exactly known low zeros Z₀ to the zero side, so that
X_p + A₀ − Z₀ = Pr₀ := 2Σ_n Λ(n) n^{−1/2} g₀(log n), by (I1) at height 0. Then (T1.2) can be violated only if

    F₂ := [ X_z − 2ĝ₀(0) − B·TV(ĝ₀) − ½ Pr₀ ] / g₀(0) > 0,     X_z − 2ĝ₀(0) = ∫ g₀(v) 2(cosh δ₀v − 1) dv.     (PD′)

*Proof.*
* Exclusion means 2c₁(X_z − 2ĝ₀(0)) > c₀Pr₀ + 2Σ_{k≥1}|c_k|E_k.
* Use c₀ ≥ c₁ and drop the terms k ≥ 2. ∎

X_z − 2ĝ₀(0) is the pair's **net** signature after count conservation, a second-moment quantity.

*Measured* (`pdcount.json`; 8-step even profiles h; a′ ∈ [0.05, 5]; γ₀ = 3·10¹², so B = 6.746; TV taken as a lower bound,
over |x| ≤ 120).

* **With the count error.** max F₂ = −0.029 for δ₀ = 0.2, 0.3 and 0.375. The maximum sits at the smallest support allowed:
  F₂ → 0⁻ as a′ → 0. No profile excludes anything.
* **With exact counting (B = 0, an idealisation).** max F₂ = 0.006, 0.018 and 0.021, at a′ ≈ log 2, where the prime term
  is ≈ 0. These margins survive a count error of at most B* = F₂·g₀(0)/TV = 0.0012, 0.0042 and 0.0043.
* That is impossible: N(t) − M(t) jumps by 1 at every zero, so sup|N − M| ≥ ½ near any height.
* Second-order counting (bounds for S₁ = ∫S) changes the constant, not the conclusion. Its cost is B₁·TV(ĝ₀′), with
  B₁ ≈ 4 at this height, against a margin of 0.02·g₀(0). (HEURISTIC estimate; not computed.)

**Small supports, proved (rev., C6).** Suppose 2a′ < log 2. Then:

* no prime power enters, so Pr₀ = 0;
* X_z − 2ĝ₀(0) = ∫ g₀·2(cosh δ₀v − 1) dv ≤ 2(cosh(δ₀ log 2) − 1)ĝ₀(0);
* TV(ĝ₀) ≥ 2ĝ₀(0), because ĝ₀ = ĥ² attains its maximum ĝ₀(0) at 0 and tends to 0 at ±∞.

Hence g₀(0)F₂ ≤ 2ĝ₀(0)[cosh(δ₀ log 2) − 1 − B] < 0. The margin is a factor B/(cosh(δ₀ log 2) − 1) ≥ 198 for δ₀ ≤ 3/8
(F3). So "max F₂ < 0" is PROVED on this range of supports and MEASURED above it.

So with two-sided counting the class excludes nothing for δ₀ ≤ 3/8 at γ₀ = 3·10¹², and B grows with the height. What
binds is the pointwise zero count. Combined with PD, which covers the zero-dropping version, the positivity class
excludes no zero with δ₀ ≤ 3/8 above the verified height.

**Scope (rev., C5).** PD is stated and proved for the product class G(v) = g₀(v)P(γ₀v). The more general class
{G ≥ 0, Ĝ ≥ 0} reduces to it in outline: write G locally as a non-negative trigonometric polynomial in the fast phase
γ₀v with slowly varying coefficients, and use |ǧ₁| ≤ ǧ₀ pointwise in place of c₀ ≥ c₁. This is not written out here.

PD's class uses the low zeros only through Z₀ ≥ 0. Using their exact values instead replaces
½max(0, X_p/g₀(0) − |Ω(0)|) by ½Pr₀/g₀(0). For the optimal δ₀ = 3/8 profile the change is Z₀/(2g₀(0)) = 0.0014. No
uniform bound over rough profiles is proved here.

### 3.4 Route T2 fails at (T2.3): a conditional law is not a point

**Lemma J (deterministic content of the alignment for harmonics; PROVED, elementary).** For every φ ∈ 𝕋_N,

    Σ_p |c_p| cos 2φ_p ≥ 2 (Σ_p c_p cos φ_p)² / T − T,   T := Σ_p |c_p|,

and equality is attained on the torus (take |cos φ_p| constant, with the sign of c_p). So (A_φ) forces at 2γ₀ only
L̃^{abs}(2φ) ≥ 2(β+s)²/T − T. This is negative whenever β + s < T/√2, which holds at every support (T/(β+s) ≥ 3.03).

*Proof.* Use cos 2φ = 2cos²φ − 1 and Cauchy–Schwarz: (Σ|c_p||cos φ_p|)² ≤ T Σ|c_p| cos²φ_p. ∎

So (T2.3) is not a deterministic consequence. It is a statement about the Haar measure conditioned on 𝒜_a.
Kronecker–Weyl equidistribution controls the proportion of heights H with Φ_N(H) in a set, never the position of the one
point Φ_N(γ₀). That is the pointwise/MV-CAP wall (wall 4).

**Measured (`tilt.json`, R4).** Parameters: δ = 0.2, a = a_ideal = 5.4999, N = 59,856, 6,047 primes, T = 119.10,
m = β = 5.642 at H = 5·10⁵. Quantities:

* L₁ := Σ_p c_p cos(H log p);
* L₂^{abs} := Σ_p |c_p| cos(2H log p), with σ(L₂^{abs}) = 1.64;
* the MaxEnt column is the max-entropy prediction Σ|c_p| I₂/I₀ at the tail mean.

| sample | draws | max L₁ | top 1%: threshold / E[L₂^{abs}] / MaxEnt / share below the unconditional mean | top 0.1%: same |
|---|---|---|---|---|
| actual primes, H ∈ [4·10⁵, 6·10⁵] | 100,000 | 4.94 | 3.69 / 0.162 / 0.140 / 0.464 | 4.33 / 0.233 / 0.176 / 0.44 |
| actual primes, H ∈ [10⁶, 1.2·10⁶] (R4; m = 6.04) | 50,000 | 5.11 | — / 0.253 / — / 0.44 | — |
| independent uniform phases | 100,000 | 6.78 | 3.83 / 0.127 / 0.167 / 0.491 | 5.06 / −0.088 / 0.257 / 0.53 |

* **The tilt exists in mean.** It matches the max-entropy prediction (0.16 against 0.14; 0.23 against 0.18) and has
  size ≈ 0.1σ. corr(L₁², L₂^{abs}) = 0.021 for the actual primes and 0.018 for random phases.
* **The tilt fails at individual points.** 44% of the top-tail heights have L₂^{abs} below its unconditional mean. The
  deterministic bound of Lemma J at the tail mean is −118.8.
* **Even the mean tilt is useless.** About 0.2, in units where the archimedean level at 2H is ≈ 5.6–6.0, it is short by a
  factor of about 30 of anything a short-support bound at 2γ₀ could detect.
* The actual maxima (4.94, 5.11) stay below m (5.64, 6.04), while random phases exceed it (6.78). This repeats the round-1
  rigidity observation in a second window.
* **Atlas.** This is §10's mechanism ("small mean energy is not a worst-case contraction"; the sixth-phase filter
  retains eigenvalue one) and §3's ("positive covariance or critical susceptibility cannot determine the missing absolute
  Weil lower bound").

**HEURISTIC: the Kronecker cost (`kcost.json`).** Under the Gaussian Haar model, the expected number of visits of the line
to 𝒜_a below height H is H·(2a/π)·P(N(0,σ²) ≥ m), with σ² = ½∫ v w(v)² dv.

| H | δ₀ = 0.1 | 0.2 | 0.3 | 0.375 |
|---|---|---|---|---|
| 3·10¹² | 10^{9.22} | 10^{3.06} | 10^{−5.02} | 10^{−12.33} |
| 10²⁰ | 10^{13.28} | 10^{0.47} | 10^{−16.96} | 10^{−32.97} |
| 10¹⁰⁰ | 10^{15.43} | 10^{−167} | 10^{−434} | 10^{−688} |

* The random model predicts many visits for δ₀ ≤ 0.2 at heights where RH is verified and none occur.
* The actual phase vectors are more rigid than Haar-random. At verified heights that rigidity **is** RH-at-height, through
  the explicit formula, not an independent input.
* The Kronecker cost is therefore neither a proof route nor a reliable heuristic at accessible heights.

### 3.5 Route T3 fails at (T3.2): at one height, peeling takes roots of the gap

**Lemma F (type-II factorisation at one height; PROVED, elementary).** Let α, β be finitely supported. Let ψ ∈ L¹ with
ψ̂ ∈ L¹ and ψ(v) = (1/2π) ∫ ψ̂(τ) e^{iτv} dτ. Then

    Σ_{m,n} α_m β_n (mn)^{−iH} ψ(log mn) = (1/2π) ∫ ψ̂(τ) A(H − τ) B(H − τ) dτ,

where A(t) = Σ α_m m^{−it} and B(t) = Σ β_n n^{−it}.

*Proof.* Insert the Fourier inversion of ψ(log mn), exchange the finite sum and the integral, and use
(mn)^{−i(H−τ)} = m^{−i(H−τ)} n^{−i(H−τ)}. ∎

Checked with random α, β, a Gaussian ψ and H = 12345.678: error 2.1·10⁻¹⁰ against |value| = 24.1 (R5). Selberg's identity
(I6) holds to 2.9·10⁻¹⁴ for n ≤ 3000 (R5). Formula (T3.1) follows. All pairs (d, e) that contribute have de ≥ 2, so ω may
be modified below log 2.

**Corollary PI (no super-alignment).** Apply any decomposition of Λ·1_{≤N} into sums of J-fold Dirichlet convolutions
(Selberg, Vaughan, Heath-Brown), indexed by j, and Lemma F:

    S_a(γ₀) = (1/2π) ∫ ω̂(τ) Σ_j Π_i D_{ij}(γ₀ − τ) dτ.

Let T_{ij} be the torus maximum of D_{ij} (the sum of |coefficients|), and put ρ_j(τ) := Π_i |D_{ij}(γ₀ − τ)| / T_{ij},
which lies in [0, 1]. If |S_a(γ₀)| ≥ μ, then for some τ

    Σ_j ρ_j(τ) Π_i T_{ij} ≥ 2πμ/‖ω̂‖₁,

and the required weighted average of the ρ_j satisfies

    r := 2πμ / (‖ω̂‖₁ Σ_j Π_i T_{ij}) ≤ μ / max_𝕋 |S̃_a|.

The inequality holds because the representation bounds the torus maximum. The right side is < 1/2.9 at δ₀ = 3/8,
γ₀ = 3·10¹² (R6), and < 1 at every support (round-1 Table A).

So some term j has ρ_j ≥ r with r < 1, and its J factors need geometric-mean relative alignment ≥ r^{1/J}. That number
tends to 1 from below as J grows and never exceeds it. No factor is forced past its torus maximum, so (T3.2) is false.

The Möbius–log² branch can carry the alignment instead. Nothing in (T3.1) makes it small: in Selberg's identity the two
terms nearly cancel for typical phases, and either can be large.

**Table PI** (`supports.json`; the gap ratio m/T at the visibility support and its peeled roots). The first column
reproduces round-1 Table A.

| H | δ₀ | T/m at 2a_ideal | (m/T)^{1/2} | (m/T)^{1/4} | (m/T)^{1/8} |
|---|---|---|---|---|---|
| 3·10¹² | 0.1 | 2965.9 | 0.018 | 0.136 | 0.368 |
| 3·10¹² | 0.2 | 38.37 | 0.161 | 0.402 | 0.634 |
| 3·10¹² | 0.3 | 6.659 | 0.388 | 0.623 | 0.789 |
| 3·10¹² | 0.375 | 3.030 | 0.574 | 0.758 | 0.871 |
| 10²⁰ | 0.375 | 3.199 | 0.559 | 0.748 | 0.865 |
| 10¹⁰⁰ | 0.375 | 4.486 | 0.472 | 0.687 | 0.829 |

* Every entry is below 1.
* At the lengths reached by peeling (N^{1/2^j} ≤ 10⁴) no non-torus-valid pointwise bound at one height is known. The
  Vinogradov saving at the full length N_vis is only exp(−0.0061) to exp(−0.112) (round-1 Table 1). That table states the
  saving for sums over integers; for prime sums the saving comes from the zero-free region and is smaller.
* **Peeling also loses information** (HEURISTIC, Gaussian Haar model; corrected in the revision, C3).
  * At the top level the large-deviation cost of (A_φ) is m²/(2σ_w²) ≍ δ₀²(log γ₀)²/log log γ₀, against the Kronecker
    budget log γ₀. F5: the ratio to (log γ₀)²/log log γ₀ tends to about δ₀², and is 0.149 at γ₀ = 10^{10⁶} for
    δ₀ = 3/8.
  * Each factor after peeling needs only the fraction r^{1/2^j} of its own torus maximum, so the cost per factor is
    lower.
  * The 17:33 exponents, (log log γ₀)² in the denominator and "≍ log γ₀ after one square root", were not derived and
    are withdrawn.

### 3.6 Route T4 fails at (T4.2): a single large value at one point (new in the revision)

(T4.0) and (T4.1) form the standard zero-detection dichotomy [L] (Montgomery 1971; Ivić, ch. 11). It is the usual way
to use the functional equation and the Euler product together at one height. Each twin bears on it differently.

* **DH does not satisfy the hypothesis.** The Dirichlet inverse of DH's coefficients is not bounded: f has zeros with
  Re s > 1 [L, Davenport–Heilbronn 1936], so 1/f has no Dirichlet series with bounded coefficients there. The
  Euler-product ingredient |a_n| ≤ d(n) therefore fails, so DH is not a counter-model for T4.
* **The multiplicative twin satisfies the analogue in its own half-plane (sketch).**
  * Its mollifier Σ_{n≤X} μ(n) f(n) n^{−s} has bounded coefficients.
  * F₁ has the zero.
  * F₁ = (s − β₀)e^{G} with |G(σ + it)| ≤ C_σ|s|, so F₁ grows at most exponentially on vertical lines in Re s ≥ ½ + ε.
  * With a Gaussian smoothing weight, the contour can therefore be moved to Re(s + w) = ½ + ε. The same dichotomy follows,
    with Y^{−(δ₀−ε)} in place of Y^{−δ₀}.
  * So the large value (T4.1) is compatible with Euler-product structure. Excluding it cannot come from that structure
    alone.
* **(T4.2) is the pointwise wall.**
  * The torus maximum of the class-I polynomial is Σ_{n>X} |a_n| n^{−β₀} e^{−n/Y}. With X = 100 and Y = 10⁶ it is 11.3 at
    β₀ = 7/8 and 207 at β₀ = 0.6. That is 45 and 829 times the required ¼ (F7), and it grows like Y^{1−β₀}.
  * Large-values estimates (Montgomery–Halász–Huxley) bound the number of well-spaced points where |D| ≥ V. They do not
    exclude one prescribed point. Zero-density theorems use exactly this: they count such points.
  * Excluding the large value at γ₀ alone is a pointwise statement of the kind MV-CAP shows mean-value input cannot give
    (wall 4).

T4 therefore stops at (T4.2). Unlike T1–T3 it uses a non-torus-valid input: the functional equation, through the
critical-line bound. That bound controls the size of ζ near γ₀; it does not exclude anything at one point. The large
value that would have to be excluded is attainable on the torus (F7). This is the same missing input as (★_min), in
large-value form.

### 3.7 Inputs that are not torus-valid do not reach δ₀ ≤ 3/8 (the conditional Xu–Sang input reaches only (0.37488665, 3/8])

**Proposition OA (no offset amplification; PROVED, elementary).** Let G be the multiplicative group generated by:

* the shifts ζ(s + iτ), τ ∈ ℝ;
* the functions holomorphic and zero-free on Re s > ½ (for example ζ(2s)^{±1}, or absolutely convergent products over
  prime powers p^k with k ≥ 2).

Let 𝔇 be the algebra of finite sums of products of derivatives D^{(j)}, with D ∈ G and j ≥ 0. It contains every
Dirichlet series built by:

* convolution and Möbius inversion;
* logarithmic derivatives;
* the log-weights of Selberg's identity (ζ″/ζ = ζ″·ζ⁻¹);
* Rankin–Selberg products such as ζ(s)²ζ(s+iγ₀)ζ(s−iγ₀)/ζ(2s).

Then every pole of every E ∈ 𝔇 in Re s > ½ lies at a point s such that s + iτ is a zero of ζ, or equals 1, for some τ
used in building E. So if every zero of ζ has offset ≤ δ₀, every pole of E in Re s > ½, other than those at 1 − iτ, lies
in Re s ≤ ½ + δ₀.

*Proof.*
* A derivative has its poles where the function has poles. Sums and products create no new poles.
* The poles of D ∈ G in Re s > ½ are at zeros of the shifted ζ factors in the denominator, or at the points 1 − iτ from
  factors in the numerator. ∎

Quotients by derivatives, such as ζ/ζ′, are excluded on purpose. Their poles are at zeros of ζ′, which the zeros of ζ do
not determine. (Zeros of derivatives are not singularities and play no role.)

The rescaling s ↦ ks of a prime-power sum moves the critical line together with the zero, so the ratio of offset to
half-width is unchanged.

**Consequence.**

* No Euler-product algebra (convolutions, powers, logarithmic derivatives, twists n^{−iτ}, Rankin–Selberg products such as
  ζ(s)²ζ(s+iγ₀)ζ(s−iγ₀)/ζ(2s)) turns an offset-δ₀ zero into the offset > 3/8 singularity that QRH excludes.
* With round-1 Lemma L (floor exponent δ + θ ⟺ half-plane at θ), a non-torus-valid input that is a half-plane at θ
  excludes δ₀ only if δ₀ > θ.

**Levers** (status as in round 1):

| input | status | non-torus-valid content | excludes |
|---|---|---|---|
| Platt–Trudgian verified height | peer-reviewed | Φ_N(H) ∉ 𝒜(H) for H ≤ 3·10¹² | nothing above 3·10¹² (Φ_N(γ₀) is not determined by phases at lower heights: Φ_N(γ₀/k) is k^{π(N)}-valued) |
| QRH 7/8 | Lean-built, unrefereed | half-plane θ = 3/8 | δ₀ > 3/8 |
| Xu–Sang / PR 14 | CONDITIONAL | θ = 0.37488665 | δ₀ ∈ (0.37488665, 3/8] if accepted |
| Vinogradov–Korobov region | [L] | θ(H) = ½ − c/((log H)^{2/3}(log log H)^{1/3}) | δ₀ near ½ only |
| VK size bound \|ζ(1+iH)\| ≪ (log H)^{2/3} | [L] | Σ_{p≤y} cos(H log p)/p ≤ ⅔ log log H + O(1) | 1/p-weighted alignment for y ≥ exp(c(log H)^{2/3}); nothing at polylog lengths |
| Vinogradov integer sums at length N | [L] | saving exp(−c(log N)³/(log H)²) | at most exp(−0.112) at N_vis (round-1 Table 1) |
| V7 floor with exponent p | hypothesis (atlas §10) | floor exponent δ + p/2 | δ₀ > p/2, so p < 2δ₀ is needed |
| (★_min)_a at all heights | hypothesis (RES-T B3) | Φ_N(H) ∉ 𝒜_a(H) for every H | closes Step 3 directly (NFT(3)) |

### 3.8 Where the bound is provable and where the zero is visible

**Table S** (`supports.json`; continuous model; T(a) by the PNT main term, which round 1 checked against exact sums to
0.02–0.46%). Here N_triv = e^{2a_triv} is the largest length at which (★) holds for every phase vector, and N_vis is the
visibility length.

| H | δ₀ | 2a_triv (N_triv) | 2a_ideal (N_vis) |
|---|---|---|---|
| 3·10¹² | 0.1 | 6.571 (10^{2.85}) | 23.13 (10^{10.04}) |
| 3·10¹² | 0.2 | 6.572 (10^{2.85}) | 13.99 (10^{6.08}) |
| 3·10¹² | 0.3 | 6.575 (10^{2.86}) | 10.36 (10^{4.50}) |
| 3·10¹² | 0.375 | 6.580 (10^{2.86}) | 8.767 (10^{3.81}) |
| 10²⁰ | 0.375 | 7.550 (10^{3.28}) | 9.876 (10^{4.29}) |
| 10¹⁰⁰ | 0.375 | 10.84 (10^{4.71}) | 13.87 (10^{6.03}) |

* The torus-valid range lies strictly inside the range where the zero is invisible. This holds in every row and is a
  direct consequence of T(a_ideal)/m > 1 (Table PI).
* The visibility law is never in tension with a torus-valid bound. That is NFT(1) seen from the support axis.

### 3.9 What would be needed

Step 3 needs one of two inputs, both outside what is available.

1. **Pointwise.** A non-torus-valid bound at every height H > 3·10¹²:

       Φ_N(H) ∉ 𝒜_a(H),  i.e.  LHS_a(H) < β(H) + s(a)  at one support with s(a) > 0.

   This is (★_min). It must use the position of the specific point Φ_N(H) on the Kronecker line, and it is RH-strength
   over all δ₀ (round-1 Proposition 6).
2. **All scales.** A floor U_H(W) ≥ −C(1+W)^m e^{(δ+θ)W} with θ < δ₀ at any one height (round-1 Lemma L). This is the V7
   floor with p = 2θ, the atlas's "cofinal actual-form floor".

The Euler product contributes the torus parametrisation (Lemma E). By NFT, that parametrisation alone cannot supply
either input.

(rev.) By Theorem MT the same holds for the Euler product used at all lengths, at all harmonics, and with the analytic
continuation of every F_k on Re s > ½. Davenport–Heilbronn shows the complementary fact for the functional-equation
side (§4). An input that closes Step 3 must couple the two at the single height γ₀. (★_min) is such an input, and none
is available.

---
## 4. Davenport–Heilbronn: why the twin escapes

**Setup** (`dh.json`; same construction as `tmp/rha-operator-controls.py`).

* χ is the character mod 5 with χ(2) = i; W = τ(χ)/(i√5), with |W| = 1.
* f(s) := (L(s, χ) + W L(s, χ̄))/(1 + W).
* Its coefficients a(n) are real and periodic mod 5: (a(1), …, a(5)) = (1, κ, −κ, −1, 0), with κ = 0.2840790438.
* F(s) = (5/π)^{(s+1)/2} Γ((s+1)/2) f(s) satisfies F(1 − s) = F(s), checked to 5.6·10⁻³¹.
* There is no Euler product: a(6) = 1 ≠ a(2)a(3) = −κ².
* Off-line zero: ρ_DH = 0.808517182 + 85.699348485i, offset δ = 0.308517.
* Explicit formula: (I1) with Ω replaced by Ω₅(r) = log(5/π) + Re ψ(¾ + ir/2), no pole terms, and Λ replaced by Λ_f,
  where −f′/f = Σ Λ_f(n) n^{−s}.
* Λ_f is computed by the divisor recursion. It agrees with −f′/f at s = 3 + 85.7i to 1.8·10⁻¹⁰ and at s = 2.5 + 10i to
  8.3·10⁻¹⁰, via an independent Dirichlet-inverse route (R2).

**Step-by-step.**

| step | property used | ζ | Davenport–Heilbronn |
|---|---|---|---|
| Step 1 | functional equation; QRH | yes | Functional equation yes (conductor 5). No half-plane: f has infinitely many zeros with Re s > 1 ([L], Davenport–Heilbronn 1936), and \|Λ_f(n)\|/log n reaches 51.8 for n ≤ 2·10⁵. |
| Step 2 | explicit formula; visibility law | yes | **Yes.** At the matched filter at ρ_DH, W_DH/(2m²) = −0.22 (2a = 4), −0.76 (6), −0.85 (7), −0.96 (8–10), −0.99 (12). Round 1 has −0.76 to −0.99 for 2a = 6–12. |
| Lemma E | Λ supported on prime powers; coefficient = Λ(n) × unimodular character | yes | **No.** Λ_f(6) = (1+κ²) log 6 = 1.936 and Λ_f(12) = −0.763. The share of \|Λ_f\| on non-prime-powers grows from 0.49 (n ∈ [4, 8)) to 0.85 (n ∈ [1.3·10⁵, 2·10⁵]). |
| T1 | Λ ≥ 0 | yes | No: Λ_f(3) = −0.312, Λ_f(4) = −1.442. |
| T2 | alignment of prime phases | yes (if Step 2) | No (Proposition DH-P, measured split below). |
| T3 | Selberg's identity with prime-supported Λ | yes | Holds formally for Λ_f, but its factors are not prime-supported and there is no torus. |

**Proposition DH-P (the twin's off-line zeros are invisible to its prime part; PROVED, with its hypothesis checked directly
in the revision, F1).** For Re s > ½,

    Σ_p a(p) log p · p^{−s} = (1+W)⁻¹ [ −L′/L(s, χ) − W L′/L(s, χ̄) ] − R(s),
    R(s) := (1+W)⁻¹ Σ_p Σ_{k≥2} (χ(p)^k + W χ̄(p)^k) log p · p^{−ks},

where R is holomorphic on Re s > ½.

* So the prime part of −f′/f (note Λ_f(p) = a(p) log p) has poles in Re s > ½ only at zeros of L(s, χ) or L(s, χ̄).
* Direct check (rev., F1; 30-digit mpmath):
  * ρ_DH refines to 0.8085171824566 + 85.6993484853776i, with |f(ρ_DH)| = 2·10⁻³⁰.
  * |L(ρ_DH, χ)| = |L(ρ_DH, χ̄)| = 0.70220. They must be equal: f(ρ_DH) = 0 gives L(χ) = −W L(χ̄), and |W| = 1.
  * L(s, χ)L(s, χ̄) has winding number 0 around the box [0.55, 1.30] × [84.70, 86.70] (554 boundary points;
    |LL̄| ≥ 0.103 on the boundary).
  * So the prime part is holomorphic on a box containing ρ_DH. (The 17:33 draft cited (I7) here.)
* A matched filter at ρ_DH thus sees no drift x^{0.8085} in the primes. The alignment that the zero forces must be carried
  by n that are not prime.

*Proof.* For a prime p, a(p) = (χ(p) + Wχ̄(p))/(1 + W), and −L′/L(s, χ) = Σ_p Σ_{k≥1} χ(p)^k log p · p^{−ks}.
Combine the two. ∎

**Measured split of the alignment sum at ρ_DH** (`dh.json`). LHS_DH := Σ_n Λ_f(n) n^{−1/2} w(log n) cos(H log n) at
H = Im ρ_DH; β₅ = A₅/(2m) = 2.111.

| 2a | m | primes | proper prime powers | non-prime-powers | LHS_DH | W_DH/(2m²) | T_ζ(a) | LHS_DH/T_ζ |
|---|---|---|---|---|---|---|---|---|
| 4.0 | 0.548 | 0.458 | 0.187 | 1.588 | 2.233 | −0.222 | 3.282 | 0.680 |
| 5.0 | 1.116 | −0.092 | 0.082 | 2.645 | 2.635 | −0.469 | 5.869 | 0.449 |
| 6.0 | 2.032 | −0.393 | 0.076 | 3.971 | 3.654 | −0.759 | 10.058 | 0.363 |
| 7.0 | 3.430 | 0.054 | −0.097 | 5.062 | 5.019 | −0.848 | 16.848 | 0.298 |
| 8.0 | 5.494 | 0.512 | −0.344 | 7.192 | 7.360 | −0.955 | 27.884 | 0.264 |
| 10.0 | 12.686 | 0.741 | −0.683 | 14.273 | 14.331 | −0.963 | 75.023 | 0.191 |
| 12.0 | 26.828 | −0.212 | −0.776 | 29.574 | 28.586 | −0.987 | 200.706 | 0.142 |

For comparison, ζ's own primes at the same height with the same weights give −0.60 to 1.13. That is below
β_ζ(85.7) ≈ 1.31, as it must be: ζ has no zero there.

**Reading.**

1. **The twin passes Step 2.** Its zero forces the explicit-formula alignment: the Weil value tends to −2m².
2. **The alignment is carried by composite n.** At every support the primes contribute between −0.39 and +0.74, while
   the non-prime-power coefficients track m (1.59 → 29.57 as m goes 0.55 → 26.8). This is what Proposition DH-P predicts.
   Route 30 found the same coefficients (Λ_DH(6) = (1+κ²) log 6) as a multiplicativity defect "with no zero-location
   content" at small support. At the matched-filter supports those coefficients are exactly where the off-line zero lives.
3. **The twin escapes at Lemma E.** Its zero is not a point of the prime-phase torus.
   * Its alignment is also **within** the Euler-torus range (LHS_DH/T_ζ falls from 0.68 to 0.14). A size argument would
     not exclude it: a twist of Λ by unimodular phases could produce sums of this size.
   * Only the prime support separates it.
4. **Consequence for the attempt.**
   * The steps the twin passes (explicit formula, visibility law) cannot produce a contradiction.
   * The steps it fails (Lemma E and the routes built on it) are torus-valid for ζ (NFT), so they cannot produce one
     either.
   * The twin test and NFT therefore put the missing input in the same place: a non-torus-valid statement about the
     single point Φ_N(γ₀).

**Remark (prime support alone is not enough; [L], not re-verified).** Beurling generalised prime systems have Euler
products with prime-supported, nonnegative Λ and can have zeros off the line (Diamond–Montgomery–Vorhauer 2006). They
have no functional equation. A proof must therefore use prime support **together with** the archimedean structure. In
this attempt the archimedean structure enters only through the target β = Ω/2 of Step 2, and NFT shows the combination
is never tested beyond the torus. (rev.) Theorem MT (§3.2) gives the corresponding statement inside this attempt's own
setting: actual primes, unimodular twists, |Λf| = Λ.

**Three-way comparison (rev.).**

| | ζ, if ρ₀ existed | Davenport–Heilbronn f | multiplicative twin (Theorem MT) |
|---|---|---|---|
| Euler product (Lemma E) | yes | no | yes |
| functional equation: Ω, partner zero, zero count | yes | yes (conductor 5) | no |
| Step 2 at the zero, all supports | yes | yes: W/(2m²) = −0.76 to −0.99 for 2a = 6–12 | yes: U_f = −2m²(1 + o(1)) |
| zero carried by the prime phases | yes | no: composites (DH-P) | yes |
| T1–T3 (torus-valid tools) | apply | do not apply | apply, and are satisfied |
| T4 hypothesis (bounded mollifier) | yes | no | yes; the large value is satisfied |
| leaves the argument at | — | Lemma E | nowhere: it is a counter-model to the Euler-product form of Lemma T |

Reading.

* DH shows that the explicit formula with its archimedean side, used without the Euler product, gives no contradiction.
* The multiplicative twin shows the same for the Euler product used without the functional equation.
* A contradiction would have to use both at the single height γ₀, which is (★_min).

---

## 5. The four walls

1. **Flow-blindness (SL2): not blocked, and not passed.**
   * Step 3 uses Λ, its prime support and its positivity. The backward heat flow H_{−ε} has no Dirichlet series, so these
     inputs are not flow-stable.
   * The zero-side statement at a fixed node (Step 2) is flow-stable (round-1 Remark 3.3). The transfer fails before
     flow-blindness becomes relevant.
   * (rev.) The flow-blindness module concludes that a proof "must invoke the property the flow destroys", namely the
     exact arithmetic identity (Jacobi theta / Euler product). Theorem MT is the complementary statement for this
     attempt. Euler-product input that does not use the Kronecker line is satisfied by a function with an off-line
     zero. That covers torus-valid statements at all lengths and harmonics, together with the holomorphy and zeros of
     every F_k on Re s > ½. So the needed input must couple the Euler product to the functional equation
     at the height γ₀ itself.
2. **NS-RIGID: not applicable as stated; its pattern recurs.**
   * The tests are modulated at complex heights kγ₀, off the native real span.
   * The positivity class of T1 is a finite-support positivity statement. Proposition PD shows that its exclusions are
     verified-height consequences, just as RES-T (B1) shows for W_T with T < T_X.
   * (rev.) The module's loophole line places Dirichlet-coefficient inputs (Levinson–Conrey mollifiers, Selberg
     proportion, near-line density) outside NS-RIGID, and adds that "the pointwise upgrade is wall (b)". Route T4 is in
     that class and stops exactly at its pointwise upgrade.
3. **Verified height: blocks T1 (zero-dropping version).** The PD ceilings for δ₀ ≤ 3/8 (10^{6.69} by the bound,
   10^{5.17} by the optimum found) lie far below 3·10¹². For δ₀ ≤ 0.40 the ceiling is 10^{9.13}. With the unconditional
   count used from below (PD′), T1 meets wall 4 instead: what binds is the pointwise zero count.
4. **Pointwise / MV-CAP: blocks T2 and Step 3 as a whole.**
   * (T2.3) passes from a conditional law to a point (Lemma J; 44% of tail heights violate the tilt).
   * NFT(3): Step 3 holds iff (★_min) holds at every height, which is the pointwise wall.
   * (rev.) T4 stops at a single large value at one point (§3.6).
   * (rev.) Corollary SF: the Euler product leaves the phases at short lengths free. A short-support bound that clashes
     with the zero must therefore come from non-torus-valid input. §3.7 lists what is available, and none of it reaches
     δ₀ ≤ 3/8.
   * The all-scale form is the V7 floor (round-1 Lemma L), the atlas's "cofinal actual-form floor".

Global vortex trapping (= RH, vortex README) is not used. The Möbius-energy route of PR 14 (atlas §10) enters only as
the θ value 0.37488665 in the lever table.

---

## 6. What survives (byproducts)

* **B1 (PROVED).** Lemma E and Theorem NFT. The Euler product at a single height is a torus parametrisation, so every
  consequence of it alone is torus-valid. A transfer of the zero's alignment to a torus-provable support is therefore
  impossible, and Lemma T is equivalent to (★_min) at all heights. This closes round-1 synthesis proposal 5 as stated.
  (rev.) The equivalence is in the form corrected by C1. Theorem MT extends this from one length N to all primes, all
  supports, all harmonics and the analytic continuation.
* **B2 (PROVED).** Proposition PD: an explicit upper bound R′(δ₀) + |Ω(0)|/2 + log 2 on the reach of the multi-height
  positivity class at compact support, with the ceilings of Table PD: 10^{6.69} at δ₀ = 3/8, 10^{9.13} at 0.40, and
  asymptotically β₀ > 1 − c/log log γ₀ at best. Also the count-conservation formula
  ΔZ = 2c₁μ₂(δ₀² + (x₁² + x₂²)/2), which shows why continuous-model cancellation at short support is illegitimate.
* **B2′ (reduction PROVED, optimum MEASURED).** Proposition PD′: with two-sided unconditional counting the class
  excludes nothing at 3·10¹² (max F₂ = −0.029 over 8-step profiles). Even exact counting would need a count error below
  0.004.
* **B3 (PROVED + MEASURED).** Lemma J: the deterministic content of an alignment for the harmonics is vacuous. Measured:
  the conditional tilt at actual heights is ≈ 0.1σ, matches the max-entropy law, and fails at 44% of individual tail
  heights.
* **B4 (PROVED).** Lemma F (type-II sums factorise at one height) and Corollary PI (peeling never super-aligns), with
  Table PI.
* **B5 (PROVED, elementary).** Proposition OA: Euler-product algebra cannot amplify the offset of a zero.
* **B6 (PROVED + MEASURED; hypothesis checked directly in the revision, F1).** Proposition DH-P. The
  Davenport–Heilbronn off-line zero at 0.8085 + 85.699i is carried by non-prime-power coefficients. Primes and proper prime powers together contribute between −0.99 and +0.65,
  while the sum grows to 28.6; the prime part is regular there. This connects route 30's
  multiplicativity detector to zero location.
* **B7 (CONTINUOUS MODEL).** Table S: the torus-valid support (N ≈ 710 at 3·10¹²) lies strictly inside the invisibility
  range at every δ₀.
* **B8 (HEURISTIC).** The Kronecker-cost table. The Gaussian Haar model predicts 10^{9.2} visits for δ₀ = 0.1 below
  3·10¹², where none occur, so it is not a reliable guide at accessible heights.
* **B9 (rev.; PROVED, same-agent check only).** Theorem MT: a completely multiplicative unimodular f with the
  following properties.
  * Exactly one zero in Re s > ½, simple, at ½ + δ₀.
  * Zero-free harmonics.
  * ψ₁ = −x^{β₀}/β₀ + O(x^{1/2} log x).
  * All-scale matched-filter alignment U_f = −2m²(1 + o(1)).
  * All of this is invariant under finite phase changes.
* **B10 (rev.; PROVED + MEASURED).** Corollary SF: through Euler-product structure, the zero constrains no finite set
  of prime phases. At γ₀ = 3·10¹², δ₀ = 3/8, (A) holds at every tested support from a_rig when all primes up to
  6,420 (= N_vis) are adversarial (margin ≥ 80), and when all primes up to 3·10⁴ are (margin ≥ 31).
* **B11 (rev.; CERTIFIED-FLOAT).** Direct verification of DH-P's hypothesis (F1), replacing (I7).
* **B12 (rev.; PROVED, elementary).** At supports 2a′ < log 2, PD′ excludes nothing, by a factor
  B/(cosh(δ₀ log 2) − 1) ≥ 198 for δ₀ ≤ 3/8 (F3).
* **B13 (rev.; MEASURED/HEURISTIC).** Route T4: the mollified detector's torus maximum is 45 to 829 times the size the
  zero requires (F7).

---
## 7. Referee passes

### 7.1 Same-agent pass of the 17:33 draft

This is a same-agent adversarial pass with independent code paths (`referee.json`). It is **not** a fresh independent
referee.

| check | what | result |
|---|---|---|
| R1 | Closed form of R′(δ) against direct quadrature of [2cosh δv − cosh(v/2)]₊ | relative error ≤ 8.4·10⁻¹⁰ (δ = 0.1, 0.2, 0.3, 0.375, 0.4) |
| R2 | Λ_f of the twin by an independent route (Dirichlet inverse of a, then (a log) * a⁻¹) against −f′/f from mpmath | 1.8·10⁻¹⁰ at 3 + 85.7i; 8.3·10⁻¹⁰ at 2.5 + 10i; Λ_f(6), Λ_f(12) agree |
| R3 | Twin archimedean term A₅ at 2a = 6, brute-force mpmath quadrature against the panel scheme | 8.57939 against 8.57981 (4.9·10⁻⁵ relative) |
| R4 | T2 tilt in a second window H ∈ [10⁶, 1.2·10⁶] with a different seed | top-1% tilt 0.253 (σ = 1.68), 44% below the mean, max L₁ = 5.11 < m = 6.04 |
| R5 | Lemma F with random coefficients and a Gaussian weight; Selberg's identity for n ≤ 3000 | 2.1·10⁻¹⁰ (value 24.1); 2.9·10⁻¹⁴ |
| R6 | Attainability 𝒜_a ≠ ∅ with exact prime powers at δ₀ = 3/8, γ₀ = 3·10¹² | 39.06 vs target 13.45 at a_ideal; 466.8 vs ≤ 119.9 at a_rig |
| PD check | Weil's formula for G = g₀(3 + 4cos + cos 2)(H₀v), actual zeros 1..10⁶ | residual 1.2·10⁻⁸ relative; prime side 21.09 ≥ 0 |

**Errors found and corrected in this run.**

1. `rha-phase-alignment-pd.py` first overflowed at δ = 0.48 and 0.49, where R′ is about 10⁶ and 10¹³. It now works with
   log-heights. The table values were not affected.
2. A draft of R2 contained a garbled duplicate recursion loop. It was removed before the run; the reported R2 uses only
   the clean Dirichlet-inverse route.
3. The first written form of Corollary PI said "r ≤ μ/T(a)". That is imprecise for decompositions with several terms. The
   corrected form, r ≤ μ/max_𝕋|S̃_a|, uses the attainability numbers of R6.
4. The first draft of Proposition OA claimed that every **zero** and pole of the generated functions lies at shifted zeros
   of ζ. That is false: derivatives have new zeros, and quotients by derivatives (ζ/ζ′) have new poles. The statement now
   concerns poles only, on the algebra generated by derivatives of the multiplicative group. That covers every
   construction used in T1–T3.

**Adversarial questions.**

1. *Is NFT trivial?*
   * Its logic is. Its content is attainability (R6, Table A) together with Lemma E.
   * Lemma E says that everything the Euler product says at one height is a statement on the torus.
   * Together they show that round-1 proposal 5 cannot be a reduction of (★_min).
2. *Could several explicit formulas have alignment sets whose intersection is empty, although each is non-empty?*
   * NFT(2) needs the **combined** set to be non-empty, and this note checks that only for the constraints the attempt uses
     (Step 2's 𝒜_a; T1's half-space through PD).
   * For several single-height constraints, linear in t_p = cos φ_p, the Chebyshev-drift vector t_p ≈ −κ p^{δ₀−½} with
     generic remaining phases reproduces the zero's own drift. It satisfies all of them in the continuous model
     (HEURISTIC).
   * Multi-height constraints of positivity type are covered by PD. A multi-height argument without positivity is **not**
     ruled out here. It would need explicit formulas at heights kγ₀ whose zero sides are uncontrolled (MV-CAP), so it is
     not a live loophole, but it is not closed by a theorem in this note. (rev.: Theorem MT closes the Euler-product part;
     see C2 in §7.2.)
3. *Does PD drop information that a cleverer argument could certify?*
   * Yes: the unconditional count (I4) gives certified **lower** bounds for the on-line blocks. That is Proposition PD′.
     With it, no profile in the measured family excludes anything at 3·10¹² (max F₂ = −0.029).
   * Even exact counting would leave margins of only 0.006–0.021, which survive a count error of at most 0.004. N − M
     jumps by 1 at each zero, so this is impossible.
   * The exactly known low zeros add Z₀/g₀(0) = 0.0028 for the PD optimum. A uniform bound over rough profiles is not
     proved.
4. *Does PD contradict the classical zero-free region?* No. PD is an upper bound on the reach, and as δ₀ → ½ its ceiling
   grows like exp(4η·2^{1/(2η)}).
5. *Does DH-P rely on GRH?* In the 17:33 draft, only on (I7), the verification of GRH for χ mod 5 at height 85.7. (rev.)
   Not any more: its hypothesis is checked directly (F1). The measured split never depended on that citation.
6. *Is the tilt measurement relevant above 3·10¹²?* It illustrates the mechanism at accessible heights. Lemma J and NFT
   do not depend on the height.
7. *Lemma F with ω = w/v, which is singular at 0?* Every contributing pair has de ≥ 2, so ω is replaced by a smooth,
   compactly supported function that agrees on [log 2, 2a]. Its transform is integrable.
8. *Are QRH and Xu–Sang used beyond their status?* No. They appear only as θ values, labelled unrefereed and CONDITIONAL;
   neither changes the verdict.

### 7.2 Fresh-context pass (revision)

This pass was done by a second agent context that had not written the 17:33 draft. It belongs to the same model family
and the same project, so it is not an external referee.

**Re-runs.**
* All seven 17:33 scripts were re-run unchanged.
* Their JSON outputs are identical to the preserved 17:33 outputs in every field except run times.
* The 17:33 outputs and text are preserved in `tmp/rha-phase-alignment-out-run1/` (text SHA-256
  `27abdc0bb1ddb71e49651401397a49848997b4f99dee391b28817c12159d283e`).

**Re-derivations by hand** (independent of the 17:33 wording):
* Lemma E; NFT(1)–(3); the zero-side constant 2c₁X_z of (T1.3).
* Proposition PD, every step:
  * the zero-side split with c_k of both signs;
  * A_k ≥ g₀(0)(Ω(γ₀/2) − τ′);
  * X_p + A₀ = Z₀ + Pr₀ ≥ 0, combined with c₀ ≥ |c₁|;
  * the bound through u = g₀/g₀(0) ∈ [0, 1];
  * τ ≤ 10⁻⁸ from TV(h)² ≤ 10³‖h‖².
* The reduction of PD′, using count conservation.
* The second-moment formula ΔZ = 2c₁μ₂(δ₀² + (x₁² + x₂²)/2).
* Lemma J; Lemma F and the Selberg form (T3.1); Corollary PI.
* Proposition OA, including its restriction to poles and the rescaling remark.
* The identity in DH-P.

All of these are correct as stated, subject to C1–C7.

**New checks** (`referee2.json`, `twin-seeds.json`):

| check | what | result |
|---|---|---|
| F1 | DH: refine ρ_DH; \|L(ρ_DH, χ)\| and \|L(ρ_DH, χ̄)\|; winding number of L(s,χ)L(s,χ̄) on [0.55, 1.30] × [84.70, 86.70]; a(2) | ρ_DH = 0.8085171824566 + 85.6993484854i with \|f(ρ_DH)\| = 2·10⁻³⁰. Both \|L\| = 0.70220; they must be equal, since f(ρ_DH) = 0 gives L(χ) = −W L(χ̄) and \|W\| = 1. Winding number 0 (554 boundary points, \|LL̄\| ≥ 0.103 on the boundary). a(2) = 0.2840790438 = κ. |
| F2 | Theorem MT(d): the main term J(a) − m against 1/(2δ₀) | δ₀ = 3/8: 0.853, 1.160, 1.279, 1.331 at 2a = 8.8, 13.7, 18.4, 30 (limit 4/3). δ₀ = 0.2: from 1.37 to 2.31 at 2a = 30 (limit 5/2; slower). |
| F3 | PD′ at 2a′ < log 2 | cosh(δ₀ log 2) − 1 − B(2γ₀) = −6.71 to −6.74 for δ₀ from 0.375 to 0.1. The ratio B/(cosh − 1) is 198 to 2807. |
| F4 | Lemma J on 2000 random instances, and its equality case | minimum slack +6.1·10⁻⁵ (never negative); equality gap 3.6·10⁻¹⁵ |
| F5 | Gaussian large-deviation cost at the visibility support, γ₀ = 10^{12.5} … 10^{10⁶} | cost/((log γ₀)²/log log γ₀) → 0.149 for δ₀ = 3/8 (δ₀² = 0.141) and 0.044 for δ₀ = 0.2 (δ₀² = 0.040). cost/((log γ₀)²/(log log γ₀)²) grows without bound. |
| F6 | booster: ∫w = 0; sign and size of B_κ | \|∫w\| ≤ 9·10⁻¹⁶. B per unit κ is 60, 136, 289, 929, 4262 at 2a = 10, 13.7, 18.4, 30, 60. |
| F7 | T4: torus maximum of the mollified detector | X = 100, Y = 10⁶: 11.3 at σ = 7/8 and 207 at σ = 0.6 (45× and 829× the required ¼). X = 1000: 9.6 at σ = 7/8. |
| B(r) | the NFT(1) constant: max over r ∈ [1, 30] of B(r) − r/2 | 1.13097, attained at r = 30. The 17:33 bound 1.131 is correct and tight on that range. |

**Corrections to the 17:33 draft.** None of them changes the verdict.

* **C1 (consequence of NFT, wording).**
  * The 17:33 text said Lemma T is equivalent to "(★_min)_a at every height". That fixes a.
  * Lemma T may choose the support together with the height. The precise statement is: at every height H > 3·10¹²,
    (★_min) holds at some support a ≥ a_rig(H). Corrected in §3.1.
* **C2 (adversarial question 2 of §7.1).**
  * The 17:33 answer left open multi-height arguments that do not use positivity. Theorem MT closes the Euler-product part
    of that question.
  * Every argument whose inputs are torus-valid at all lengths and harmonics, together with the holomorphy and zeros of
    all F_k on Re s > ½, is satisfied by the twin.
  * Arguments that use ζ's own zero sides at kγ₀ remain open. They need pointwise control of those zero sides: MV-CAP, and
    PD′ for the positivity class.
* **C3 (heuristic exponent, §3.5).**
  * The Gaussian cost is ≍ δ₀²(log γ₀)²/log log γ₀ (F5), not (log γ₀)²/(log log γ₀)².
  * The 17:33 phrase "≍ log γ₀ after one square root" was never derived and is withdrawn.
  * Only HEURISTIC bullets are affected.
* **C4 (DH-P).** (I7) is replaced by the direct check F1, which is all DH-P needs.
* **C5 (scope of PD).**
  * PD is stated and proved for the product class G(v) = g₀(v)P(γ₀v) with P ≥ 0, g₀ ≥ 0 and ĝ₀ ≥ 0, and its proof uses
    nothing more.
  * For a general G ≥ 0 with Ĝ ≥ 0, one would write G locally as a non-negative trigonometric polynomial in the fast phase
    γ₀v, with slowly varying coefficients ǧ_k(v), and use |ǧ₁| ≤ ǧ₀ pointwise in place of c₀ ≥ c₁.
  * That is a sketch and is not written out, so PD is cited for the product class only.
* **C6 (status of the PD′ optimum).**
  * The reported "max F₂ = −0.029" is attained at the edge a′ = 0.05 of the search box, where F₂ → 0⁻.
  * For 2a′ < log 2, F₂ < 0 is now PROVED (F3):
    * no prime term enters;
    * X_z − 2ĝ₀(0) ≤ 2(cosh(δ₀ log 2) − 1)ĝ₀(0);
    * TV(ĝ₀) ≥ 2ĝ₀(0).
  * For larger supports the optimum remains MEASURED.
* **C7 (header).** The 17:33 header said the new statements "need an independent referee". They have now had this
  fresh-context internal check. External review is still pending.

**Verdict of the fresh-context pass.**
* The 17:33 failure line (Step 3, Lemma T) is correct.
* The reasons it gives are correct, subject to C1–C7.
* No argument survived. Nothing in this file is reported as a proof of RH or of a zero-free region.

### 7.3 Checks of the new material (same-agent)

| check | what | result |
|---|---|---|
| M1 | the lag of the independent construction (Theorem MT, step 1) | max D = 32.2 (κ = 0) and 39.0 (κ = 0.01) over p ≤ 10⁸; D/x^{β₀−0.475} ≤ 1.22 |
| M2 | tracking of the adaptive construction: sup over p ≤ 10⁸ of \|Σ_{q≤p} log q cos θ_q + T(p)\|/log² p | 1.81 (δ₀ = 3/8), 0.38 (δ₀ = 0.2) |
| M3 | \|Im ψ₁\|, \|ψ₂\|, \|ψ₃\| divided by √x log x, at x = 10⁶, 10⁷, 10⁸, both constructions | ≤ 0.56 |
| M4 | main term (F2) | J − m → 1/(2δ₀) |
| M5 | no harmonic drift: 400 realisations, k = 2, 3, 4 | means +0.056, −0.065, −0.010 (SE 0.050); std 1.006, 1.007, 0.975 |
| M6 | finite modifications (Corollary SF): f(p) ≡ ±1, ζ's phases at H₁ = 10⁶ + ½, and adversarial phases on p ≤ N_short | table in §3.2 |

**Adversarial questions on the new material.**

1. *Does the twin need RH for ζ?*
   * No. The construction uses only the prime-gap theorem (I8) and Hoeffding's inequality (I9).
   * It uses no zero of ζ.
2. *Is the booster needed?*
   * Only to make (e) hold almost surely at all large a.
   * Numerically κ = 0 satisfies (A) on every tested support, with margin ≥ 90, for both constructions.
3. *Is "(A) for all a ≥ a_rig" proved?*
   * No. (A) is PROVED for a ≥ a₁(f) when κ > 0, and MEASURED on 13.70 ≤ 2a ≤ 18.42 when κ = 0. No proof covers the
     interval between the tested range and a₁.
   * Theorem MT needs only the all-scale form (d), which is proved. Corollary SF uses (A) only eventually.
4. *Could ζ's zeros near kγ₀ exclude the twin's phase vector?*
   * The twin is not a height of ζ. Theorem MT says only that no argument using the listed properties can exclude ρ₀.
   * Arguments that use ζ's zero sides at kγ₀ lie outside Theorem MT and are discussed under C2.
5. *Is Theorem MT new?*
   * This is not claimed. It is an elementary variant of Wintner's and Bohr–Jessen's random Euler products, with a
     planted first-harmonic drift.
6. *Are the prescribed vectors of the measured table legitimate twins?*
   * Yes, by (f). Each one is a finite phase vector on the primes p ≤ N, completed beyond N by the independent
     construction.
   * Its values of LHS_a at the tested supports involve only primes up to e^{2a} ≤ N, so they are exactly the measured
     ones.
7. *Is the fluctuation bound in (d) sharp?* No. O(a^{3/2}) comes from a crude union bound; the typical size is O(a^{1/2}).
   Any o(a²) bound is enough for (d) and (e).

**Errors found in the new material during this pass, and corrected before the file was written.**

1. Theorem MT, step 1 used the window bound T(x) − T(x − y) ≤ 3y x^{β₀−1}. The correct constant is 2/β₀, which is up
   to 4 for β₀ near ½, and the booster term must be added. Now 4y x^{β₀−1} + 2κy x^{−1/2} log² x; the conclusion is
   unchanged.
2. Theorem MT(d) first stated the fluctuation as O(a(log a)^{1/2}), from a grid of mesh a^{−2}. That grid does not
   control the primes entering between grid points. A grid at the primes alone is also not enough near a maximal
   prime gap. With the primes plus a mesh of width e^{−2a}, the bound is O(a^{3/2}), which is still o(a²).
3. Corollary SF first listed "growth" of the F_k among the properties the twin shares with ζ. Only growth of
   exponential order is proved for the twin, so polynomial growth was removed from the list.
4. §3.6 first said T4's stop is "not explained by the torus alone". The large value T4 needs to exclude is
   torus-attainable (F7). The corrected text says instead that T4 uses a non-torus-valid size bound, which cannot
   exclude a point.

---

## 8. Reproduction

    .venv-arb/bin/python -I tmp/rha-phase-alignment-pd.py         # ~26 s; Prop. PD table, optimum, explicit-formula check
    .venv-arb/bin/python -I tmp/rha-phase-alignment-pdcount.py    # ~45 s; Prop. PD' optimum with/without the count term
    .venv-arb/bin/python -I tmp/rha-phase-alignment-tilt.py       # ~26 s; T2 measurement (100,000 heights + 100,000 random)
    .venv-arb/bin/python -I tmp/rha-phase-alignment-supports.py   # ~20 s; Table S and Table PI
    .venv-arb/bin/python -I tmp/rha-phase-alignment-dh.py         # ~2 s;  Davenport-Heilbronn: zero, Lambda_f, split
    .venv-arb/bin/python -I tmp/rha-phase-alignment-kcost.py      # ~3 s;  HEURISTIC Kronecker-cost table
    .venv-arb/bin/python -I tmp/rha-phase-alignment-referee.py    # ~8 s;  R1-R6
    # revision (fresh-context pass):
    .venv-arb/bin/python -I tmp/rha-phase-alignment-twin.py main        # ~6 s;  Theorem MT numerics, N = 1e8, delta0 = 3/8 and 0.2
    .venv-arb/bin/python -I tmp/rha-phase-alignment-twin.py variants    # ~14 s; seeds, booster, prescribed/adversarial short phases
    .venv-arb/bin/python -I tmp/rha-phase-alignment-twin.py indep       # ~4 s;  the independent construction of the proof
    .venv-arb/bin/python -I tmp/rha-phase-alignment-twin-seeds.py       # ~25 s; 40 + 400 realisations (no harmonic drift); B(r) - r/2
    .venv-arb/bin/python -I tmp/rha-phase-alignment-referee2.py         # ~9 s;  fresh-context checks F1-F7

They need `tmp/rha-contradiction-lib.py` (round 1) and `tmp/routes-b5-r16-out/zeros.npy` (zeros 1..10⁶, from
`src/data/zeros-to-1e6.js`). Outputs go to `tmp/rha-phase-alignment-out/`. The 17:33 outputs and text are preserved in
`tmp/rha-phase-alignment-out-run1/`. The re-run reproduced them in every non-timing JSON field.

## References

* A. Weil, Sur les "formules explicites" de la théorie des nombres premiers (1952).
* A. Selberg, An elementary proof of the prime-number theorem, Ann. of Math. 50 (1949) (the identity (I6)).
* D. R. Heath-Brown, Prime numbers in short intervals and a generalized Vaughan identity, Canad. J. Math. 34 (1982).
* H. Davenport, H. Heilbronn, On the zeros of certain Dirichlet series, J. London Math. Soc. 11 (1936).
* D. Platt, T. Trudgian, The Riemann hypothesis is true up to 3·10¹², Bull. LMS 53 (2021).
* D. Platt, Numerical computations concerning the GRH, Math. Comp. 85 (2016) [L, for (I7); bound quoted from memory].
* T. Trudgian, J. Number Theory 134 (2014) (N(T) constants as quoted in `mv-cap-theorem.md`).
* H. G. Diamond, H. L. Montgomery, U. M. A. Vorhauer, Beurling primes with large oscillation, Math. Ann. 334 (2006)
  [L, not re-verified].
* K. Ford, Vinogradov's integral and bounds for the Riemann zeta function, Proc. LMS 85 (2002) (as quoted in round 1).
* Y. Xu, H. Sang, arXiv:2610.15291v2 (unrefereed; CONDITIONAL use only).
* openai/math family 003 (7/8; unrefereed; Lean build re-run locally).
* (rev.) R. C. Baker, G. Harman, J. Pintz, The difference between consecutive primes, II, Proc. LMS 83 (2001) [L].
* (rev.) S. M. Gonek, C. P. Hughes, J. P. Keating, A hybrid Euler–Hadamard product for the Riemann zeta function, Duke
  Math. J. 136 (2007) [L, used in a remark only].
* (rev.) H. L. Montgomery, Topics in Multiplicative Number Theory, LNM 227 (1971); A. Ivić, The Riemann Zeta-Function
  (1985), ch. 11 [L, zero detection].
* (rev.) A. Wintner, Random factorizations and Riemann's hypothesis, Duke Math. J. 11 (1944); H. Bohr, B. Jessen (1930–32)
  [L, random Euler products].
* (rev.) W. Hoeffding, Probability inequalities for sums of bounded random variables, JASA 58 (1963).

Project records:

* PR #27 route atlas and modules (`/tmp/atlas-snap-*.md`).
* PR 14 (`refs/pr/14:rigorous/mobius_bridge_reduction/`).
* Round 1: `formalization/rh-attempts/2026-11-01-{synthesis,contradiction}.md`.
* Walls: `src/data/flow-blindness-no-go.js`, `src/data/imp-95530-native-span-arithmetic-input-rigidity.js`,
  `formalization/paper/mv-cap-theorem.md`, `research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`.
* Routes 27, 30 and 44 (`src/data/route-{27,30,44}-*.js`).
* `formalization/routes/fifty-routes-synthesis-2026-10-15.md`.
