# Zero-free campaign, lever "V7 discrepancy floor" (atlas §10)

Internal analysis, 2026-11-01. Branch `editorial-redesign`. Nothing committed, nothing pushed, nothing sent off the machine.

**Question.** The V7 manuscript (`03-landau.tex`) states that an actual floor ε₀(λ) ≥ −C(1 + log λ)^m λ^p with p < 1 gives no zeros of ζ in Re s > (1 + p)/2, so p = 3/4 corresponds to 7/8. Locate ε₀ and the best proved p in the user's modules, then attack p < 3/4 with the 7/8 machinery, the Möbius-energy target of PR #14 (with the Xu–Sang inputs and the unproved restricted fourth moment U^{39/40+ε} for B = 0.874) and the whole-even spectral certificate. Report a proved p or the exact obstruction.

**Read before starting: the user's audit of all prior attempts (PR #27).** Snapshots `/tmp/atlas-snap-*.md`, originals `git show refs/pr/27:research/rh/...`:

* `modules/historical-routes.md` (the route atlas). Used here: §2 (twin ladder and shifted bridge, the equivalence |X(w − a)| < |X(w + a)| ⟺ a ≥ Δ), §8 (Hankel width a = 1/4), §9 (fixed-support positivity, null-symbol duals, "negative lower surrogates are not negative actual forms"), §10 (Möbius energy, PR #14, the sixth-phase filter that "retains eigenvalue one", the V7 floor reduction), §11 (Suzuki scalar interface; "a uniform strictly positive scalar margin is not the right RH target"), and the closing line on the open task.
* `PUBLICATION_SCOPE_2026-10-30.md` (the three boundaries: lower surrogates, summable debts, replay versus proof).
* Modules: `arithmetic-foundation.md` (one-sided Landau theorem, shells, Vaughan centering), `suzuki-recurrence.md` and `prime-memory.md` (Ψ, the reserve M_n, credits), `finite-suzuki-certificate.md` (Ψ > 0 to log 10⁷), `whole-even-certificate.md` and `spectral-denominator-repair.md` (coercivity for λ ≤ √(161/10)), `spectral-head-theory.md` (near-null head), `signed-complement.md`.
* `foundation/source/03-landau.tex` and `foundation/v7-mathematical-review.md` from the same ref.

Every overlap with an attempt the audit already records is listed in §1 with its atlas section, together with what is different here.

**Other sources.** The 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt` and the 11/12 manuscript `paper2.txt` (openai/math family 003; unrefereed), the Lean library `~/lean-deps/qrh-verify/lean` with its local check output `check/solution.out`; PR #14 at `refs/pr/14:rigorous/mobius_bridge_reduction/` (README, TARGET_0874.md, SIGNED_PHASE_FILTER.md, the report PDF, `certify_parameters.py`); prior campaign notes `beat78-*.md`, `qrh-improvement-attempt-{a,b}.md`, and today's sibling notes `zf-campaign-{high-side,cubic-field,new-probe,quartic-gl2}.md`. Xu–Sang v2 (arXiv:2610.15291) is not on this machine; only the admissibility system that PR #14 imported is used, and its analytic inputs are not verified here.

**Labels.**

| label | meaning |
|---|---|
| [PROVED] | complete argument written here |
| [PROVED-rel] | proved here relative to a named external result used as stated |
| [RECALLED] | a literature statement used without re-derivation (no external source was consulted in this session) |
| [EXACT] | exact rational or symbolic computation of a finite statement, or an exact computation in a model of displayed inequalities |
| [NUMERICAL] | floating-point check of a finite statement |
| [HEURISTIC] | exponent bookkeeping, model reasoning or an unproved scenario |
| [STRUCTURAL] | a statement about what a proof method can or cannot deliver, not a theorem about ζ |

**Scripts** (all `.venv-arb/bin/python`, each under 90 s; logs next to them):

| script | content | log |
|---|---|---|
| `tmp/zf-v7-floor-explicit.py` | Ψ from primes versus the zero expansion of Theorem A (10⁶ zeros), the constants a = G(0) and T_∞ − G′(0) = Σ γ⁻², the V7 bound on A₀₀ | `tmp/zf-v7-floor-explicit.log` |
| `tmp/zf-v7-floor-zeroside.py` | arithmetic side versus zero side of the Weil form for non-box, non-even, complex and modulated test functions | `tmp/zf-v7-floor-zeroside.log` |
| `tmp/zf-v7-floor-constants.py` | rigorous S(H₀) = Σ_{\|γ\|>H₀} γ⁻² for Corollary B; head-size lower bound for the whole-even Schur method | `tmp/zf-v7-floor-constants.log` |
| `tmp/zf-v7-floor-bootstrap.py` | independent implementation of the Xu–Sang endpoint system imported by PR #14; ceiling B*(κ), slope, κ-bootstrap | `tmp/zf-v7-floor-bootstrap.log` |

---

## 0. Outcome

**No zero-free half-plane below Re s = 7/8 is obtained, and there is no rigorous gain in θ.** PT Λ ≤ 0.2 stands. The conditional Λ values from the 7/8 start (0.118506 Raymond chain, 0.116091 route P) are unchanged. RH is open. NO QED.

What this note establishes:

1. **Where ε₀ is defined.** In V7 `03-landau.tex`, subsection "Translation to a physical spectral floor", ε₀(λ) is the bottom of the closed form Q_W = A_W + C_W − P_W on L²[0, W], with W = 2 log λ, in the 5/4-gamma normalisation. This is the same form as eq. (1) of the whole-even module. The V7 implication uses ε₀ only through the trial vector e₀ = W^{−1/2}·1_{[0,W]}: ε₀(λ) ≤ Q_W[e₀] = 2Ψ(W)/W, where Ψ = aW + T(W) − D(W) is the Suzuki function of the recurrence module.

2. **Theorem A [PROVED].** Ψ(W) = Σ_ρ (e^{(ρ−1/2)W} − 1)/(ρ − 1/2)², summed over nontrivial zeros with multiplicity and absolutely convergent. So the floor exponent of the box direction is exactly p_box = 2Θ − 1, where Θ = sup Re ρ. The V7 route to a half-plane is therefore a reformulation of the half-plane statement, not an independent lever: p < 3/4 in the direction V7 uses is literally Θ < 7/8. Numerically, the prime side and the zero side of Theorem A agree to 5·10⁻⁹ on a 39-point grid in 0.25 ≤ W ≤ log 10⁷.

3. **Best proved p.**
   * **In the user's modules (PR #27): none below the trivial p = 1.** The modules prove three things. Finite-support coercivity holds for λ ≤ √(161/10). Ψ > 0 holds on 0 < W ≤ log 10⁷ (finite Suzuki certificate). The spectral-head theorem gives an upper bound, ε₀(λ) ≤ C_r(log λ)^{−r}. None of these is an asymptotic floor.
   * **Box direction, from the openai/math 7/8 theorem: p_box = 3/4 is proved (Corollary B).** The theorem is kernel-checked in Lean against Mathlib's `riemannZeta`, with only the standard axioms (local check output); the manuscript is unrefereed. Combined with Platt–Trudgian it gives
     **Ψ(W) ≥ −1.4796·10⁻¹² (λ^{3/4} + 2 + λ^{−3/4}) for every λ > 1**,
     which is the V7 floor in the direction V7 uses, with m = −1. The atlas §10 sentence "those improved global floors remain unproved" is therefore accurate for the operator floor but not for the trial-vector floor that V7 Theorem 3.2 consumes.
   * **Conditional on the imported analytic inputs of Xu–Sang v2 and the PR #14 certificate:** p_box = 2·0.87488665 − 1 = 0.7497733. The fixed point of the κ-bootstrap is p_∞ = 0.749773294, with B_∞ = 0.874886647 (§6). It needs the same inputs and an extension of the source's κ-range.
   * **Operator floor ε₀ (all test functions): no p < 1 is proved anywhere. This floor implies the half-plane; no converse is known.** Proposition C [PROVED] gives a sufficient condition. Suppose the half-plane Θ holds and M₊, the number of zeros with Re ρ > 1/2 in a unit window, is bounded uniformly in the window. Then ε₀(λ) ≥ −πM₊(1 + 2 log λ)λ^{2Θ−1}. Whether M₊ < ∞ is open. It holds trivially under RH, and it does not follow from Θ ≤ 7/8.

4. **The 7/8 machinery (§6).** The paper's own κ := 2β* − 1 (12.1), together with the hypothesis β* ≤ (1 + κ)/2 of Lemma 18.1, is exactly the family version of the V7 floor exponent. "β* ≤ 7/8" is the statement "p_family ≤ 3/4".
   * The floor enters only through (18.11)–(18.12): under β* ≤ (1 + κ)/2, slot prime sums satisfy |Q|² ≪ Z^{κz+ε}. In the row counts this appears as the plain capacity z_P(m) = (1 − 2m)/(6κ) (19.2).
   * The binding row bin is at δ* ≈ 0.387, with row zeros at Re s ≈ 0.693. In the Xu–Sang system it is at δ* ≈ 0.469, Re s ≈ 0.735. Both are far below κ ≈ 3/4.
   * Feeding the floor back into the machinery is therefore a contraction:
     * factor ≈ 1.2·10⁻³ for the 7/8 paper (displayed-inequality model, [HEURISTIC]);
     * factor 3.02·10⁻³ for the Xu–Sang system (exact model).
   * Over the whole usable input range κ ∈ [0.748, 0.75], the Xu–Sang output stays within [0.874884, 0.874887].

5. **Möbius energy (§7).** S(L) = X^{−1/2}M_φ(X), where M_φ is a smoothed Mertens sum. The energy exponent E equals p, in both directions. The PR #14 pair decomposition is an identity: the "remaining signed pairs" equal the full energy up to O(e^{0.7496L}), so it contains no reduction. The hypothesis (H) of TARGET_0874 is an input to the row moments of the Xu–Sang high side; it is not a floor statement.

6. **Whole-even certificate (§8).** Coercivity at finite λ carries no information about the exponent. The Schur method with a separate whole-prime norm needs a head size of at least about W·e^{(4+o(1))λ/log λ}:

   | λ | ≈ 4 | 10 | 100 |
   |---|---|---|---|
   | head size needed | 10^{2.85} (the certificate used 2048) | 10⁶ | 10³⁷ |

   This quantifies the "prime-norm exponential cutoff" already recorded in the V7 review.

**Precise obstruction (full statement in §10).**
* The V7 floor is a coordinate chart of Θ. In the only direction the V7 implication reads, its exponent is 2Θ − 1 exactly. The operator version implies the box version; no converse is known, and the zero-side route to it needs local control of off-line zeros.
* Inside the 7/8 and Xu–Sang machinery the floor is an input whose influence on the binding bin is of order 10⁻³.
* PR #14's Möbius energy is the same statement written as a smoothed Mertens bound.
* The whole-even certificate is finite.

So no ingredient named in the lever can yield p < 3/4 without first yielding Θ < 7/8 by other means.

**Λ.** Since p = 2θ − 1, the campaign rate of 0.003 of Λ per 0.01 of θ becomes 0.0015 of Λ per 0.01 of p. The only floor-specific movement found is the conditional bootstrap. It moves θ by 3.4·10⁻⁷ below the κ = 3/4 ceiling of the Xu–Sang system and by 3·10⁻⁹ below the PR #14 value 0.87488665, which is worth about 10⁻⁷ of Λ or less. No Λ value changes.

---

## 1. Overlap with the user's audit, and what is different here

| item | where the audit records it | status there | this note |
|---|---|---|---|
| V7 floor ⟹ half-plane (p ↦ (1 + p)/2) | atlas §10 "7/8 status"; V7 `03-landau.tex` Thm 3.2 and eq. (floor); arithmetic-foundation module §2 | implication accepted; "improved global floors remain unproved" | Adds the converse in the direction V7 uses (Theorem A), which makes the box floor equivalent to the half-plane. Adds a proved value p = 3/4 for that direction (Corollary B) and a sufficient condition for the operator floor (Prop. C). |
| Suzuki function Ψ, Ψ(W) = (W/2)q_W[e₀] | suzuki-recurrence module §1; atlas §11 | accepted identity; Suzuki's criterion "Ψ ≥ 0 ⟺ RH" attributed | Uses the identity as stated. Adds the zero expansion with exponent bookkeeping and verifies it numerically. |
| "uniform positive scalar margin is the wrong target" | atlas §11 | accepted | Consistent. The floor target is a growing negative allowance, not a margin, and Theorem A exhibits the small returns of Ψ under RH (Remark A.3). |
| finite scalar and spectral certificates | finite-suzuki, whole-even, spectral-repair modules; atlas §9 | finite results, explicitly not all-scale | Not re-run. §8 explains why they carry no exponent information and quantifies the method cost. |
| prime-norm exponential cutoff | V7 review ("a failure of a sufficient comparison, not necessary actual complexity") | recorded | §8 gives the explicit rate e^{(4+o(1))λ/log λ} from ⟨e₀, P_W e₀⟩. No new claim beyond that rate. |
| Möbius energy ∫_j^{j+1}\|S\|² ≤ Ce^{0.7496j} | atlas §10 "Actual reduction"; PR #14 report pp. 5–6 | unproved target; elementary pair classes controlled | Adds the converse (energy exponent = 2Θ − 1) and shows the pair split is an identity (§7). Does not repeat the pair counting. |
| Xu–Sang/PR #14 boundary 0.87488665; target 0.874 via (H) | atlas §10; PR #14 README, TARGET_0874.md | conditional on imported analytics; (H) open | Identifies κ as the floor exponent. Independently reproduces the bootstrap computed by the concurrent high-side note (`tmp/zf-high-side-xs-ceiling.log`) and adds the input-insensitivity range and the gate κ > 1/(8ℓ) (§6). |
| sixth-phase filter "retains eigenvalue one" | atlas §10; SIGNED_PHASE_FILTER.md §5 | accepted obstruction | Read as the worst-case versus average distinction that also separates the operator floor from the box floor (§5.4, §6.6). No new filter computation. |
| twin-ladder shift a | atlas §2 | equivalence a ≥ Δ accepted; positivity for all a > 0 open | Adds an entry to the dictionary in §9: at shift 3/8 the comparison holds given the Lean-checked 7/8 theorem [PROVED-rel]. |
| Hankel width a = 1/4 | atlas §8 | open; implied by Θ ≤ 3/4 | Dictionary entry: it corresponds to p = 1/2, beyond the 7/8 target. |
| κ-monotonicity, ζ-only not easier | `beat78-project.md` Prop. D | proved at the level of displayed inequalities | Used. The κ-table there gives the 1.2·10⁻³ contraction for the 7/8 paper. |

No attempt recorded as failed in the audit is repeated. The only computations of the same objects are (i) the bootstrap, reproduced independently as a check, and (ii) the zero-side identity of the Weil form. The audit does not record a numerical test of (ii); it is checked here in the 5/4 normalisation.

---

## 2. The object ε₀(λ) and the chain V7 uses

### 2.1 Definition

The source is V7 `03-landau.tex`, §3.3 (refs/pr/27:research/rh/foundation/source/03-landau.tex). Put W = 2 log λ. In the adjusted semilocal normalisation on [0, W],

  Q_W = A_W + C_W − P_W,  a(t) = Re ψ₀(5/4 + it/2) − log π,  continuum kernel e^{|y−z|/2},

and ε₀(λ) := inf spec Q_W, the bottom of the closed semibounded form on its canonical domain {f ∈ L²[0, W] : ∫ log(2 + |t|)|f̂|² < ∞}. The form is translation invariant: it depends on f only through R_f and |f̂|. So the same ε₀ arises on [−ℓ, ℓ] with ℓ = log λ. That is the setting of the whole-even module, eq. (1), which uses the nonunitary Fourier transform. Its even part is denoted ε₀^{even}.

### 2.2 The chain

V7 eq. (3.5): for e₀ = W^{−1/2}1_{[0,W]},

  Q_W[e₀] = A₀₀(W) − 2D(W)/W,  D(W) = Σ_{n<e^W} Λ(n) n^{−1/2}(W − log n) − (4e^{W/2} − 2W − 4),

with 0 ≤ A₀₀(W) − a(0) < 0.8 for W ≥ 1. The script gives max_{1≤W≤40}(A₀₀ − a(0)) = 0.5712 [NUMERICAL]. The chain is

  ε₀(λ) ≥ −C(1 + log λ)^m λ^p  ⟹  Q_W[e₀] ≥ −C(1 + log λ)^m λ^p  ⟹  D(W) ≤ C′(1 + W)^{m+1}e^{pW/2}  ⟹(Landau)  Θ ≤ (1 + p)/2.

The first arrow is the Rayleigh quotient, since ‖e₀‖ = 1. **Only the trial vector e₀ is ever used.**

### 2.3 Normalisation dictionary

In the Suzuki normalisation (recurrence module §1):

  a = (ψ₀(5/4) − log π)/2,  α_k = 2k + 1/2,  T(W) = Σ_{k≥1}(1 − e^{−α_kW})/α_k²,  T_∞ = ψ₀′(5/4)/4,  Ψ(W) = aW + T(W) − D(W),

and (W/2)A₀₀(W) = aW + T(W). [PROVED: with K(s) = Σ_{k≥0} 2e^{−(2k+5/2)s} one has a(t) = a(0) + ∫₀^∞ K(s)(1 − cos ts)ds. For e₀, R(s) = (1 − s/W)₊, and termwise (1/2)∫₀^W sK + (W/2)∫_W^∞ K = Σ_k(1 − e^{−α_kW})/α_k².] Hence

  **Q_W[e₀] = 2Ψ(W)/W = Ψ(W)/log λ.**

This is the identity "Ψ(W) = (W/2)q_W[e₀]" of the recurrence module.

---

## 3. Theorem A: the box-direction floor exponent equals 2Θ − 1

**Theorem A.**
* (i) For every W ≥ 0,
  Ψ(W) = Σ_ρ (e^{(ρ−1/2)W} − 1)/(ρ − 1/2)²,
  summed over nontrivial zeros with multiplicity. The sum converges absolutely and locally uniformly in W.
* (ii) Let Θ = sup Re ρ. For every W ≥ 0,
  |Ψ(W)| ≤ (1 + e^{(Θ−1/2)W})·Σ_ρ |ρ − 1/2|^{−2},  with Σ_ρ |ρ − 1/2|^{−2} ≤ Σ_ρ γ_ρ^{−2} ∈ [0.0462099861, 0.0462099863].
* (iii) [V7 Thm 3.2] Let 0 ≤ α < 1/2. If Ψ(W) ≥ −C(1 + W)^m e^{αW} for W ≥ W₀, then Θ ≤ 1/2 + α.
* (iv) Hence, if Θ < 1,
  p_box := inf{p ≥ 0 : ∃ C, m with Q_W[e₀] ≥ −C(1 + log λ)^m λ^p for all λ > 1} = 2Θ − 1,
  and the infimum is attained, with m = −1. If Θ = 1, no p < 1 is admissible.
* (v) Every operator floor ε₀(λ) ≥ −C(1 + log λ)^m λ^p implies p ≥ 2Θ − 1.

**Proof.**

*Step 1: the explicit formula for D.* V7 (3.2) gives the Laplace transform

  ∫₀^∞ D(W)e^{−qW}dW = M(q) := q^{−2}G(q),  G(q) := −ζ′/ζ(q + 1/2) − 1/(q − 1/2),  Re q > 1/2.

D is continuous, piecewise C¹ and O(e^{W/2}). Laplace inversion therefore gives D(W) = (2πi)^{−1}∫_{(c)}M(q)e^{qW}dq for c > 1/2 and W > 0, and the integral converges absolutely because |M(q)| ≪ log|q|/|q|² on Re q = c.

Choose heights T_j → ∞ in [j, j + 1] with |ζ′/ζ(σ ± iT_j)| ≪ log²T_j for −1 ≤ σ ≤ 2. Also use |ζ′/ζ(s)| ≪ log(2 + |s|) on Re s = 1/2 − U ≤ −1 away from the trivial zeros. Both bounds are standard [RECALLED: Davenport, *Multiplicative Number Theory*, ch. 17]. Shift the contour to Re q = −U with U ∉ {α_k}. The horizontal segments contribute ≪ e^{cW}log²T_j/T_j² → 0. The left line contributes ≪ e^{−UW} → 0 as U → ∞, for fixed W > 0.

The residues are:
* at q = 0 (double pole of q^{−2}): G′(0) + G(0)W;
* at q = ρ − 1/2: −m_ρ e^{(ρ−1/2)W}/(ρ − 1/2)²;
* at q = −α_k (trivial zeros s = −2k): −e^{−α_kW}/α_k².

At q = 1/2 the pole of −ζ′/ζ at s = 1 is cancelled by −1/(q − 1/2) (V7 remark after (3.2)). Since Σ|ρ|^{−2} < ∞, the zero sum converges absolutely, and the symmetric partial sums from the contours converge to it. Therefore

  D(W) = G(0)W + G′(0) − Σ_ρ e^{(ρ−1/2)W}/(ρ − 1/2)² − Σ_{k≥1} e^{−α_kW}/α_k².

*Step 2: constants.* We have a = G(0). Indeed, ξ′/ξ(1/2) = 0 gives ζ′/ζ(1/2) = (log π − ψ₀(1/4))/2, and ψ₀(5/4) = ψ₀(1/4) + 4. So G(0) = 2 − ζ′/ζ(1/2) = (ψ₀(5/4) − log π)/2 = a. Numerically |a − G(0)| = 2·10⁻⁴¹ [NUMERICAL]. Also T(W) + Σ_k e^{−α_kW}/α_k² = T_∞. Hence

  Ψ(W) = aW + T(W) − D(W) = T_∞ − G′(0) + Σ_ρ e^{(ρ−1/2)W}/(ρ − 1/2)².

Ψ is continuous with Ψ(0) = 0, since D(0) = T(0) = 0, and the zero sum is continuous by uniform convergence. Letting W → 0 gives T_∞ − G′(0) = −Σ_ρ(ρ − 1/2)^{−2}, which proves (i). As a check, T_∞ − G′(0) = 0.046209986230837941578. The sum of 2/γ² over the first 10⁶ zeros, plus the main term of the tail, is 0.046209986233 [NUMERICAL]. The difference, 1.9·10⁻¹², is the oscillating part of the tail.

*Step 3: bounds.* (ii) follows from |e^{(ρ−1/2)W} − 1| ≤ e^{(Θ−1/2)W} + 1 and |ρ − 1/2|² = (β − 1/2)² + γ² ≥ γ². The bracket for Σγ^{−2} uses the first 10⁶ ordinates plus Trudgian's explicit N(T) tail beyond 600269.7 (`zf-v7-floor-constants.log`).

*Step 4: the Landau direction.* (iii) is V7 Thm 3.2 applied to D = aW + T − Ψ, using a < 0 and 0 ≤ T ≤ T_∞. A lower bound on Ψ is an upper bound on D up to O(W).

*Step 5: conclusion.* For (iv): if Θ < 1, then (ii) gives Q_W[e₀] = Ψ/log λ ≥ −0.04621(1 + λ^{2Θ−1})/log λ, so p = 2Θ − 1 is admissible with m = −1. Conversely, if p is admissible, then Ψ(W) = Q_W[e₀]·W/2 ≥ −C′(1 + W)^{m+1}e^{(p/2)W}, so (iii) gives Θ ≤ (1 + p)/2. (v) holds because ε₀(λ) ≤ Q_W[e₀]. ∎

**Numerical check** (`tmp/zf-v7-floor-explicit.log`). The prime side uses all 595,877 prime powers up to e^{16.2}. The zero side is Σ_{γ>0} 2(1 − cos γW)/γ² over the first 10⁶ zeros, plus the mean of the tail.

| W | Ψ (primes) | Ψ (zeros) | difference | Q_W[e₀] |
|---|---|---|---|---|
| 1.0 | 0.0440073052 | 0.0440073052 | −1.2·10⁻¹¹ | 0.0880146 |
| 4.0 | 0.0351409305 | 0.0351409306 | −3.0·10⁻¹¹ | 0.0175705 |
| 8.0 | 0.0309486896 | 0.0309486896 | −1.0·10⁻¹¹ | 0.0077372 |
| 12.0 | 0.0292318921 | 0.0292318943 | −2.2·10⁻⁹ | 0.0048720 |
| 16.118 = log 10⁷ | 0.0379772909 | 0.0379772928 | −2.0·10⁻⁹ | 0.0047124 |

Over the 39-point grid in [0.25, 16.12] the maximum difference is 4.9·10⁻⁹. The column D(W) in the log is close to aW + G′(0), as Step 1 predicts. For example, D(16) = −10.719 against aW + G′(0) = −10.724.

**Remark A.1 (attribution).** Suzuki's paper (arXiv:2206.03682) works with this function and, as recalled, writes its zero expansion. Theorem A is derived here directly from the V7 Laplace transform, so nothing above depends on that recollection [RECALLED, not re-checked].

**Remark A.2 (what the equivalence says about the lever).** The V7 implication "floor ⟹ half-plane" passes through a quantity whose growth exponent is determined by Θ in both directions. A proof of p < 3/4 for e₀ is a proof of Θ < 7/8 and conversely. Choosing a different trial family f_λ changes nothing, because the analogue of (i) holds for every fixed-shape family: q[f_λ] = Σ_ρ F_λ(ρ)·conj F_λ(1 − ρ̄) (§5.2). Its exponent is again 2Θ − 1 unless F_λ vanishes systematically at the zeros.

**Remark A.3 (atlas §11).** Under RH, Ψ(W) = Σ_{γ>0} 2(1 − cos γW)/γ² is a nonnegative almost periodic function with inf_{W≥1} Ψ = 0. To see this, fix ε, truncate the series where the tail is below ε/2, and apply Dirichlet's simultaneous approximation to the finitely many γW/2π [PROVED]. This is the "arbitrarily small returns" of atlas §11. The V7 target, a negative allowance −Cλ^p, is of the right type and does not ask for a margin.

**Remark A.4 (finite by-product, not computed).** With PT and the trivial bound Θ ≤ 1, Theorem A gives Ψ(W) ≥ Ψ_low(W) − 1.48·10⁻¹²(e^{W/2} + 2). Here Ψ_low ≥ 0 is the contribution of zeros below 3·10¹². With the 7/8 theorem the error term becomes 1.48·10⁻¹²(e^{3W/8} + 2) (Corollary B). If Ψ_low stayed ≥ 0.01, this would extend the user's finite Suzuki range from W ≤ 16.1 to W ≈ 45 (about 60 given 7/8). That has not been computed. Like every finite range, it would carry no exponent information.

---

## 4. Corollary B: proved values of p

**Corollary B.** Let H₀ = 3000175332800 and S(H₀) := Σ_{|γ|>H₀} γ^{−2}.

* (i) [PROVED-rel] Assume ζ(s) ≠ 0 for Re s > 7/8 (the openai/math theorem `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`). The local check shows it depends only on `propext`, `Classical.choice` and `Quot.sound`, and its statement uses Mathlib's `riemannZeta` (`~/lean-deps/qrh-verify/check/solution.out`; local build of 2026-10-07 with the repository's vendored patches; manuscript unrefereed). Assume also RH for 0 < γ ≤ H₀ (Platt–Trudgian 2021) [RECALLED]. Then for all W ≥ 0,
  Ψ(W) ≥ −(S(H₀)/2)(e^{3W/8} + 2 + e^{−3W/8}),  S(H₀) ≤ 2.95924051213·10⁻¹²,
  that is, Q_W[e₀] ≥ −1.47962·10⁻¹²(λ^{3/4} + 2 + λ^{−3/4})/log λ. **So p_box = 3/4, with m = −1.**
* (ii) [conditional] Under the Xu–Sang v2 analytic inputs and closure lemma, with the PR #14 parameters, the same holds with 3/8 replaced by 0.37488665, so p_box = 0.7497733.
* (iii) [RECALLED] From refereed unconditional results alone, no p < 1 is available. The Vinogradov–Korobov region gives Ψ(W) ≪ e^{W/2}exp(−cW^{3/5}(log W)^{−1/5}), a saving smaller than any power.
* (iv) [PROVED] Without PT: |Ψ(W)| ≤ 0.046210(1 + e^{(Θ−1/2)W}).

*Proof of (i).*
* For |γ| ≤ H₀ the zeros are on the line. A pair ±γ contributes 2(1 − cos γW)/γ² ≥ 0.
* For |γ| > H₀, group an off-line zero into its quadruple {1/2 ± δ ± iγ} and put w ∈ {z, z̄, −z̄, −z} with z = δ + iγ. Then
  Σ_w Re[(e^{wW} − 1)/w²] ≥ −Σ_w(|e^{wW}| + 1)/|w|² ≥ −2(e^{δW} + e^{−δW} + 2)/γ² = −8cosh²(δW/2)/γ².
  Per zero this is −2cosh²(δW/2)/γ². On-line zeros above H₀ contribute ≥ 0.
* With δ ≤ 3/8, summing gives Ψ(W) ≥ −2cosh²(3W/16)S(H₀) = −(S(H₀)/2)(e^{3W/8} + 2 + e^{−3W/8}).

*The bound on S(H₀).* Partial summation against Trudgian's explicit Riemann–von Mangoldt formula [RECALLED: |N(T) − (T/2π)log(T/2πe) − 7/8| ≤ 0.112 log T + 0.278 log log T + 2.510 + 0.2/T for T ≥ e] gives the one-sided main term (log(H₀/2π) + 1)/(2πH₀) = 1.47962025607·10⁻¹² with error ≤ 1.5·10⁻²⁴ (`zf-v7-floor-constants.log`). ∎

*Reading.* The box-direction floor at p = 3/4 holds with a constant of 1.5·10⁻¹². The allowance reaches 0.01 only at λ ≈ 1.3·10¹³, that is W ≈ 60. Improving the exponent, however, is exactly the half-plane problem (Theorem A(iv)).

---

## 5. The full operator floor

### 5.1 What the modules prove about ε₀

| statement | source | type |
|---|---|---|
| ε₀^{even}(λ) > 0 (existential constant) for 1 < λ ≤ √(161/10) | spectral-denominator-repair; whole-even (λ ≤ √16.001) | finite-support certificate |
| V7 Q64 floor 1/2048 at λ = 4 | V7 review | finite |
| ε₀(λ) ≤ C_r(1 + log λ)^{−r} for each r, eventually | spectral-head (T1): ‖H_λF‖ ≤ C_r w^{−r}‖F‖ on a subspace of dimension ~λ² | upper bound |
| ε₀(λ) ≥ a(0) − ‖C_W‖ − ‖P_W‖ ≥ −Cλ | Schur test: ‖C_W‖ ≤ 2(λ − 1), ‖P_W‖ ≤ 2Σ_{n<λ²}Λ(n)/√n = O(λ) | trivial, p = 1 |
| no asymptotic floor with p < 1 | V7 §3.3: "No such improved floor is established here" | — |

Under RH, 0 ≤ ε₀(λ) ≤ C_r(log λ)^{−r}, so ε₀ → 0.

### 5.2 The zero-side identity

For f ∈ C_c^∞(−ℓ, ℓ), Weil's explicit formula [RECALLED] reads, in this normalisation,

  q[f] = Σ_ρ F(ρ)·conj F(1 − ρ̄),  F(s) := ∫ f(x)e^{(s−1/2)x}dx.

For e₀ it reduces to Theorem A, since |F(ρ)|² = W^{−1}·2(1 − cos γW)/γ². The normalisation is the one actually in force. `tmp/zf-v7-floor-zeroside.py` evaluates the arithmetic side, gamma (kernel form) + continuum − primes, for several kinds of test function:
* the even bump cos⁴(πx/2ℓ);
* a non-even complex profile (x/ℓ + 0.3 + 0.4i sin(πx/ℓ))cos⁴(πx/2ℓ);
* modulated versions f(x)e^{iω₀x} with ω₀ ∈ {14.134725, 21, 30}.

For ℓ ∈ {1.5, 2.5, 3.5} it compares them with Σ_γ|f̂(γ)|² over ±10⁶ zeros. Agreement is better than 2·10⁻¹⁰ in every case, including energies of order 1. For example, the modulated even bump at ω₀ = 14.1347 and ℓ = 2.5 has q[f] = 3.515625333 on both sides [NUMERICAL].

Group the zeros. On-line zeros give |F(ρ)|² ≥ 0. A zero ρ = 1/2 + δ + iγ with δ > 0, taken together with 1 − ρ̄, gives

  ∫∫ f(x)conj f(y)·2cosh(δ(x − y))e^{iγ(x−y)}dxdy = 2|∫ f cosh(δx)e^{iγx}dx|² − 2|∫ f sinh(δx)e^{iγx}dx|².   (5.1)

### 5.3 Proposition C (a sufficient condition for the operator floor)

**Proposition C.** Let Z₊ be the multiset of zeros with Re ρ > 1/2, put Δ = Θ − 1/2 < 1/2, and let

  M₊ := sup_{t∈ℝ} #{ρ ∈ Z₊ : γ_ρ ∈ [t, t + 1)}.

If M₊ < ∞, then for every λ > 1

  ε₀(λ) ≥ −4π(1 + 2 log λ)·M₊·sinh²(Δ log λ) ≥ −πM₊(1 + 2 log λ)λ^{2Θ−1}.

In particular p_full = 2Θ − 1 = p_box whenever M₊ < ∞; this includes the case where Z₊ is finite.

*Proof.* Work on [−ℓ, ℓ] with ℓ = log λ (translation invariance, §2.1).

*Step 1.* By (5.1), q[f] ≥ −2Σ_{ρ∈Z₊}|∫ f(x)sinh(δ_ρx)e^{iγ_ρx}dx|² for f ∈ C_c^∞(−ℓ, ℓ).

*Step 2 (Taylor expansion and Cauchy–Schwarz).* Write sinh(δx) = Σ_{k≥0} c_k(δ)x^{2k+1} with c_k(δ) = δ^{2k+1}/(2k+1)!, and put I_k(γ) = ∫ f(x)x^{2k+1}e^{iγx}dx. Cauchy–Schwarz with weights ℓ^{±(2k+1)} gives

  |Σ_k c_k(δ)I_k|² ≤ sinh(δℓ)·Σ_k c_k(δ)ℓ^{−(2k+1)}|I_k|² ≤ sinh(Δℓ)·Σ_k c_k(Δ)ℓ^{−(2k+1)}|I_k|².

*Step 3 (large sieve with multiplicity).* For g ∈ L²(−ℓ, ℓ), G = ĝ, and 1-separated points t_r, Gallagher's argument gives
  Σ_r|G(t_r)|² ≤ ∫|G|² + 2∫|G||G′| ≤ 2π(1 + 2ℓ)‖g‖².
[PROVED: |G(t)|² ≤ ∫_I|G|² + 2∫_I|G||G′| on a unit interval I ∋ t; use Plancherel, and note that G′ is the transform of ixg with |x| ≤ ℓ.] Sort the ordinates of Z₊ with multiplicity and split them into M₊ classes by index modulo M₊. Two consecutive members of a class are at least 1 apart: otherwise M₊ + 1 points would lie in a half-open unit interval. So
  Σ_{ρ∈Z₊}|I_k(γ_ρ)|² ≤ 2π(1 + 2ℓ)M₊‖x^{2k+1}f‖² ≤ 2π(1 + 2ℓ)M₊ℓ^{2(2k+1)}‖f‖².

*Step 4.* Summing over k,
  Σ_{ρ∈Z₊}|∫ f sinh(δ_ρx)e^{iγ_ρx}|² ≤ sinh²(Δℓ)·2π(1 + 2ℓ)M₊‖f‖².
With Step 1 this gives q[f] ≥ −4π(1 + 2ℓ)M₊sinh²(Δℓ)‖f‖² on C_c^∞(−ℓ, ℓ). The inequality extends to the closed form domain because C_c^∞(−ℓ, ℓ) is a form core (mollify and dilate slightly into the interior; standard). Finally sinh²(Δℓ) ≤ λ^{2Δ}/4. ∎

**Status of the hypothesis.** Unconditionally only M(t) := #{ρ : γ_ρ ∈ [t, t + 1)} ≪ log t is known, for all zeros. No bound on the zeros in Z₊ per unit window beyond that is known, and none follows from Θ ≤ 7/8. Under RH, Z₊ = ∅. **So the operator floor at p = 3/4 is not proved even given the 7/8 theorem.** Prop. C isolates the missing input as a uniform local count, or an off-line large-sieve inequality, for zeros with Re ρ > 1/2.

### 5.4 Why the zero-side argument needs more than a half-plane [STRUCTURAL / HEURISTIC]

The negative part in (5.1) is a coherent sum. Take f(x) = e^{−it₀x}v(x) with v antisymmetric: two bumps of width ℓ₀ ≤ ℓ at ±(ℓ − ℓ₀), with opposite signs. Each zero ρ ∈ Z₊ with |γ_ρ − t₀| ≪ 1/ℓ then contributes about −ℓ₀λ^{2δ_ρ}‖f‖² [computed from (5.1)]. The cosh parts nearly vanish for odd v. The other zeros contribute about log t₀·‖f‖² on average (§5.2 normalisation).

So K off-line zeros clustered within 1/ℓ of t₀ give q[f]/‖f‖² ≈ log t₀ − Kℓ₀λ^{2δ}. A half-plane bounds δ but not K. Unconditionally K ≤ M(t₀) ≪ log t₀, and the relevant heights reach e^{O(λ)}, where the trivial arithmetic bound q ≥ (log t₀ − Cλ)‖f‖² takes over. The resulting worst case is of order the trivial floor. This scenario is not shown to occur. It only shows that the zero-side route needs cluster control.

This is the same distinction between worst case and average as in atlas §10: "small mean energy is not a worst-case contraction", where the sixth-phase filter has mean energy 1/(5K) and operator norm 1. The box e₀ is one fixed direction, an average-type functional, and is governed by Θ. The operator floor is a worst case over directions and is governed by Θ together with the local distribution of off-line zeros.

**Consequence for the lever.** Of the two floors, only the box floor is used by V7, and it is equivalent to the half-plane. The operator floor implies the box floor, so it is at least as hard a target. Attacking it cannot be easier than attacking Θ.

---

## 6. The 7/8 machinery: κ is the family floor exponent

### 6.1 Dictionary

The 7/8 manuscript sets, for the contradiction in Part II, κ := 2β* − 1 = 3/4 + 2Δ_paper, with Δ_paper := β* − 7/8 ∈ (0, 1/24] (12.1); this Δ_paper is not the Δ = Θ − 1/2 of §§3–5. Here β* is the supremum of real parts over all primitive finite-order Hecke L-functions of Q(√−3). Every retained row bin has δ = 2a − 1 ≤ κ (12.2). Both δ (for a row zero at real part a) and κ (for the family) are V7-type floor exponents in the sense of Theorem A, one per L-function. **The 7/8 theorem is the statement p_family ≤ 3/4.** Since ζ divides the Dedekind zeta function of Q(√−3) and the family contains the Dirichlet characters (Prop. 11.3), p_ζ ≤ p_family.

### 6.2 Where the floor enters [PROVED-rel, from the text]

Lemma 18.1 (paper l. 9378–9380) assumes, for κ < 1, that β* ≤ (1 + κ)/2. Its proof (§18.2, l. 9558–9605) uses exactly the floor mechanism. Under s_κ = (1 + κ)/2 ≥ β*, (L′/L)(s_κ + e + it, ψ) ≪_e log(2Q_ψ(3 + |t|)²) (18.11). A smooth von Mangoldt sum over an annulus of scale P is then ≪ P^{s_κ+e}. Normalised slots therefore satisfy

  |Q_ω|² ≤ C·Z^{κz+ε}·(fixed seminorms)  (18.12),  with 2s_κ − 1 = κ.

In the row counts κ appears only through the plain capacity z_P(m) = (1 − 2m)/(6κ) (19.2), via the budget n₁ + n₂ + 6κz ≤ M (18.3). The lemma is stated uniformly for κ ∈ [3/4, 1] (l. 9603) and is applied with κ = 2β* − 1 "by equality" (l. 11071). This agrees with `beat78-project.md` §1.1 (R2).

### 6.3 Weak coupling

The binding constraint is the row bin of Lemma 20.2 at δ* = 185/138 − 35√16354/4692 ≈ 0.3866 and x = 1/2, with row zeros at Re s ≈ 0.6933 and margin 2.2815·10⁻⁴ (`beat78-synthesis.md` R9). In the Xu–Sang system it is at δ* ≈ 0.4694, a* ≈ 0.7347 (`tmp/zf-v7-floor-bootstrap.log`). Both lie far below κ ≈ 0.75. The floor information about the target, and about all zeros near β*, therefore reaches the binding bin only through the plain capacity.

* **7/8 paper [HEURISTIC, displayed-inequality model].** The κ-table of Prop. D (`beat78-project.md` §2) gives min(−E*) = 2.60·10⁻⁴, 2.28·10⁻⁴, 1.98·10⁻⁴ at κ = 0.74, 0.75, 0.76, so the slope is −3.1·10⁻³. With dE/dℓ ≈ 4/3 and σ₀ = 11/12 − ℓ/4 this gives dσ₀/dκ ≈ 5.8·10⁻⁴. The feedback map κ ↦ 2σ₀(κ) − 1 therefore contracts with factor ≈ 1.2·10⁻³. Even the extreme hypothetical input 6κ → 4 (κ = 2/3, that is, a zero-free region Re s > 5/6 used as input) moves the re-tuned abscissa only from 0.874957 to 0.874901 (`zf-campaign-high-side.md` §7, lever table). Lemma 18.1 is stated only for κ ≥ 3/4, so inputs below 3/4 would also need the lemma re-proved.
* **Xu–Sang system as imported by PR #14 [EXACT model; analytic inputs not verified].** My implementation (`tmp/zf-v7-floor-bootstrap.py`) is written independently of the concurrent high-side script and reproduces it:

| κ | ℓ* | B*(κ) |
|---|---|---|
| 3/4 | 0.1671187092351 | 0.8748869893579 |
| 29991/40000 | 0.1671200682001 | 0.8748866496166 (PR #14's float value) |
| 0.7497732940799 | 0.1671200785068 | 0.8748866470400 |

  dB*/dκ = 1.50996·10⁻³, so the contraction factor is 3.0199·10⁻³. The bootstrap κ_{n+1} = 2B*(κ_n) − 1 converges to **p_∞ = 0.749773294080**, B_∞ = 0.874886647040. This agrees with `tmp/zf-high-side-xs-ceiling.log` to 12 digits. At PR #14's exact parameters, an exact 101×61 rational grid gives max E = −1.33·10⁻⁶. That is consistent with their certified E < −10⁻¹⁰, but it is a spot check, not a certificate.

### 6.4 Input insensitivity and the gate κ > 1/(8ℓ) [EXACT model]

Scanning κ downward gives B*(0.7495) = 0.87488623, B*(0.749) = 0.87488548, B*(0.7485) = 0.87488472, B*(0.748) = 0.87488396. At κ = 0.7479 the system becomes infeasible. The PR #14 gate 6κℓ > 3/4 requires ℓ > 1/(8κ), and this lower bound crosses the endpoint ceiling ℓ*(κ) ≈ 0.16713 between κ = 0.7479 and κ = 0.7480. Since κ may always be taken larger than the floor actually known (Lemma 18.1's hypothesis only weakens as κ grows), better floor information is simply capped. **Within this system the floor input moves the output by at most 3·10⁻⁶, whatever its quality.**

A further exact observation: with self-consistent κ = 2B − 1 and ℓ = 4(11/12 − B), the gate 6κℓ − 3/4 vanishes exactly at B = 7/8 (`bootstrap.log` line 2), since (2B − 1)(11/12 − B) = 1/32 there. At the paper's geometry this is the identity 6κℓ = κ for ℓ = 1/6. It is recorded, not interpreted.

### 6.5 The hypothesis (H) of TARGET_0874 in floor terms

(H) asks for Σ_{u∈𝓑}|S_m(u)|⁴|Q_sel(u)|² ≪ U^{39/40+ε} on the detected amplitude class. With it, the Xu–Sang endpoint gives B = 0.874, that is p = 0.748.
* (H) is a joint moment of the reflected numerator and the selected primes over rows whose L-functions have zeros in the binding bins. It is not a statement about the floor of ζ.
* κ enters (H) only through the selection length z_p = (1 − 2m)/(6κ). That is the same plain-capacity channel, so floor feedback into (H) inherits the contraction of §6.3.
* PR #14's saturation example shows that Hölder is sharp given only the row count and the global fourth moment. This note adds nothing to (H) itself.

### 6.6 The duality obstruction in floor language [STRUCTURAL]

The exceptional coset of Prop. 15.2 exists exactly when ξ⁶ = 1, the condition that also carries the high-side signal of a target zero (campaign brief; `beat78-prop152-restrict.md`). In floor terms, the direction in which a zero with Re ρ > 7/8 would violate the family floor, namely the signal, and the exceptional main term P_a^{1/6} live on the same sixth-power coset. PR #14's local filter shows the same thing operator-theoretically: its eigenvalue-one subspace is the simultaneous sixth-power-residue set (atlas §10), and a worst-case (floor-type) bound cannot avoid it. Neither the box floor nor the operator floor offers a direction that sees the zero but not the coset. The box floor is a single direction already equivalent to Θ (Theorem A). The operator floor ranges over all directions and so includes the coset.

---

## 7. The Möbius-energy route of PR #14

### 7.1 S is a smoothed Mertens sum [PROVED]

PR #14 (report pp. 4–5) defines F(y) = Σ_{m≥2}(log m/√m)k(log m − y) and S(L) = Σ_d μ(d)d^{−1/2}F(L − log d) = Σ_n Λ(n)n^{−1/2}k(log n − L), for the pole-cancelling spline packet k supported in [−1/2, 1/2]. It records that F(y) = 0 for y ≤ log 2 − 1/2 and |F(y)| ≤ 6.27·10⁹(1 + y)e^{−19y/2} for y ≥ 0. Put X = e^L and φ(u) := u^{−1/2}F(−log u), which vanishes for u ≥ √e/2 and is O(u⁹(1 + log(1/u))) at 0. Then

  S(L) = X^{−1/2} Σ_d μ(d)φ(d/X) =: X^{−1/2}M_φ(X),   ∫_L^{L+1}|S|² = ∫_L^{L+1}|M_φ(e^u)|²e^{−u}du.

### 7.2 The energy exponent equals 2Θ − 1 [PROVED]

PR #14 proves the forward direction: energy O(e^{(2B−1)j}) ⟹ no zeros in Re s > B. For the converse, the transform of S is K(z)·(−ζ′/ζ)(z + 1/2) with K(z) = ∫k(u)e^{zu}du, where K(1/2) = 0 cancels the pole of −ζ′/ζ at s = 1 (PR #14: the only zeros of K off the imaginary axis are ±1/2) and K(z) = O(|z|^{−2}e^{|Re z|/2}) on vertical lines (spline). The contour argument of Theorem A, Step 1, gives S(L) = −Σ_ρ m_ρK(ρ − 1/2)e^{(ρ−1/2)L} − Σ_{k≥1}K(−α_k)e^{−α_kL} for L > 1/2, absolutely convergent. Unlike M(q), there is no pole at z = 0. So zero-freeness in Re s > B implies |S(L)| ≤ Ce^{(B−1/2)L} and energy ≤ C²e^{(2B−1)L}. **The energy exponent E and the V7 box exponent p are both equal to 2Θ − 1.**

### 7.3 The pair split is an identity [PROVED]

Expanding |S(u)|² = X^{−1}Σ_{m,n}μ(m)μ(n)φ(m/X)φ(n/X), PR #14 separates four classes of pairs:
* the diagonal;
* pairs with gcd > G = e^{0.2504L};
* pairs with |m − n| < H = e^{0.7496L};
* the remaining signed pairs.

It bounds the first three by O(e^{0.7496L}) after integration, using absolute values. Hence

  ∫_L^{L+1}(remaining signed pairs) = ∫_L^{L+1}|S|² + O(e^{0.7496L}),

so "remaining ≤ Ce^{EL}" ⟺ "energy ≤ C′e^{EL}" for every E ≥ 0.7496. **The decomposition reduces nothing.** The remaining class is the full Mertens-type statement M_φ(X) ≪ X^{(1+E)/2}, equivalently the half-plane at B = (1 + E)/2. This is consistent with the atlas §10 wording that small-common-divisor, large-separation correlations "remain open". It makes explicit that they are the whole problem.

---

## 8. The whole-even spectral certificate

1. **No exponent from finite λ [PROVED, trivial].** The statement ε₀(λ) ≥ −C(1 + log λ)^m λ^p is about λ → ∞. Any finite range 1 < λ ≤ λ₁ is absorbed into C. Coercivity for λ ≤ √(161/10), or Ψ > 0.01 for W ≤ log 10⁷, is compatible with every p ∈ [0, 1].

2. **The method does not scale [STRUCTURAL].** The certificate bounds the infinite tail by d_j = α(2πj/W) − Γ_ref(W) − P_* − H_K/N > 0 (whole-even module, eq. (3)), with P_* a norm bound for the whole prime operator. Since P_* ≥ ‖P_W‖ ≥ ⟨e₀, P_W e₀⟩ = (2/W)Σ_{n<λ²}Λ(n)n^{−1/2}(W − log n) = (4 + o(1))λ/log λ, and α(t) ≈ log(t/2π), any head size N must satisfy α(2πN/W) > Γ_ref + ⟨e₀, P_W e₀⟩ (`zf-v7-floor-constants.log`):

| λ | ⟨e₀, P_W e₀⟩ | log₁₀ N_min |
|---|---|---|
| √16.001 | 3.467 | 2.85 (the accepted certificate uses N = 2048, P_* = 3.80364) |
| 10 | 10.37 | 6.03 |
| 20 | 20.08 | 10.35 |
| 100 | 80.67 | 36.83 |
| 1000 | 573.1 | 250.9 |

   So N_min ≥ W·exp((4 + o(1))λ/log λ), since α(2πN/W) = log(N/W) + O(1/N). This is the "prime-norm exponential cutoff" of the V7 review. The rate is explicit here; nothing else is new. A method that keeps C_W − P_W together faces a multiplier that is still unbounded in λ, but that is not pursued.

3. **Head and complement.** By the spectral-head theorem (T1), ε₀(λ) equals the complement floor up to C_r(log λ)^{−r}. Under RH the box energy Q_W[e₀] = 2Ψ/W is of order 1/log λ, much larger than C_r(log λ)^{−r}, so the box energy is carried by the complement component of e₀. The V7 implication lives in the complement block, which the spectral-head module (§8) marks as the missing inequality. Theorem A identifies the exponent of its e₀-direction with 2Θ − 1.

---

## 9. Dictionary: the user's scalar routes are charts of Θ

All entries are [PROVED] here or in the cited module, except the 7/8 and Xu–Sang entries, which are relative to those sources. Throughout, λ = e^{W/2} = x^{1/2}, Δ = Θ − 1/2 and p = 2Δ.

| object | where in the user's work | zero expansion or mechanism | statement equivalent to Θ ≤ (1 + p)/2 |
|---|---|---|---|
| discrepancy D(W) | V7 §3; arithmetic-foundation §2 | aW + G′(0) − Σ_ρ e^{(ρ−1/2)W}/(ρ−1/2)² − Σ_k e^{−α_kW}/α_k² (Thm A) | D(W) ≤ C(1 + W)^m λ^p |
| Suzuki Ψ(W) = (W/2)q_W[e₀] | suzuki-recurrence §1; atlas §11 | Σ_ρ(e^{(ρ−1/2)W} − 1)/(ρ − 1/2)² | Ψ ≥ −C(1 + W)^m λ^p |
| V7 box floor Q_W[e₀] | V7 (3.5) | 2Ψ/W | Q_W[e₀] ≥ −C(1 + log λ)^m λ^p |
| triangular shell S_h(W) | arithmetic-foundation §3 | −Σ_ρ e^{(ρ−1/2)W}(2cosh((ρ − 1/2)h) − 2)/(ρ − 1/2)² | one-sided all-real shell bound with growth λ^p |
| Suzuki reserve M_n (and R_n) | suzuki-recurrence §2–3; prime-memory §1 | Ψ ≥ M_n on the n-th cell; M_n = majorant_n(u_n) ≥ Ψ(u_n), with 2 log((H_n − δ₀)/2) ≤ u_n ≤ 2 log(H_n/2) = r_n + O(1) because \|H_n/(2√q_n) − 1\| < 1/4 for r_n ≥ 512 | M_n ≥ −C q_n^{p/2}·poly(log q_n) |
| PR #14 energy of S(L) | atlas §10; PR #14 §5 | −Σ_ρ K(ρ − 1/2)e^{(ρ−1/2)L} (§7) | ∫_j^{j+1}\|S\|² ≤ Ce^{pj} |
| smoothed Mertens M_φ(X) | = X^{1/2}S | poles of 1/ζ | M_φ(X) ≪ X^{(1+p)/2} |
| twin-ladder shift a | atlas §2 | \|X(w − a)\| < \|X(w + a)\| on Re w > 0 ⟺ a ≥ Δ | a = p/2; at a = 3/8 the comparison holds given the Lean-checked 7/8 theorem [PROVED-rel] |
| Hankel width a | atlas §8 | all-window boundedness at a is implied by Θ ≤ 1/2 + a | a = 1/4 corresponds to p = 1/2, beyond the target |
| 7/8 paper κ | (12.1), Lemma 18.1, (18.12) | slot prime sums ≪ Z^{κz/2} under β* ≤ (1 + κ)/2 | κ = family floor exponent; theorem: κ_family ≤ 3/4 |
| Xu–Sang κ (PR #14) | `certify_parameters.py` | κ ≥ 2B_prev − 1 licenses the moment parameter | κ = licensed floor exponent; bootstrap fixed point 0.749773294 (conditional) |

The operator floor ε₀ is the one object for which no equivalence with Θ is known (§5).

---

## 10. Precise obstruction

**(O1) Reformulation.** The V7 implication consumes the floor only through e₀. For e₀ the floor exponent equals 2Θ − 1 exactly (Theorem A), with constant 1.5·10⁻¹² at p = 3/4 (Corollary B). The lever "prove p < 3/4" is therefore identical to "prove Θ < 7/8". It supplies no estimate of its own.

**(O2) The operator floor is at least as hard.** ε₀ ≤ Q_W[e₀], so the operator floor implies the box floor. By Prop. C it follows from the half-plane together with a uniform local bound M₊ on zeros with Re ρ > 1/2. No such bound is known, and none follows from Θ ≤ 7/8. The zero-side route to the operator floor needs cluster control (§5.4).

**(O3) Inside the 7/8 and Xu–Sang machinery.** The floor is the family zero-free input of Lemma 18.1 and controls the slot prime sums (18.12). Its only effect on the binding bin is the plain capacity (1 − 2m)/(6κ). The binding bin sits at row-zero real part 0.693 (paper) or 0.735 (Xu–Sang), far below κ ≈ 0.75.
* The feedback κ ↦ 2B(κ) − 1 contracts with factor ≈ 1.2·10⁻³ in the paper ([HEURISTIC]; Lemma 18.1 is stated only for κ ≥ 3/4) and 3.0·10⁻³ in the Xu–Sang system (exact model).
* Its fixed point is p_∞ = 0.749773294, conditional on the imported Xu–Sang inputs and a κ-range extension.
* Usable inputs are capped near κ ≈ 0.748 by the gate κ > 1/(8ℓ).
* The duality obstruction (exceptional coset ⟺ ξ⁶ = 1 ⟺ high-side signal) is untouched: a floor-type bound is worst-case and includes the eigenvalue-one coset (atlas §10).

**(O4) Möbius energy.** The PR #14 energy is a smoothed Mertens mean square. Its exponent equals 2Θ − 1 in both directions. The pair split is an identity, so the remaining signed class is the whole statement. (H) is a row-moment input to the Xu–Sang high side and not a floor statement.

**(O5) Whole-even certificate.** It is finite and has no exponent content. Its Schur method needs a head size of at least W·e^{(4+o(1))λ/log λ}.

The open task named in the atlas's closing line is "a genuine all-scale signed arithmetic estimate, a cofinal actual-form floor, or an exhaustive theta boundary/collision certificate". For the floor, the result here splits it in two. The cofinal actual-form floor in the direction e₀ is the half-plane itself: it holds at p = 3/4 and is open below. In all directions, the floor implies the half-plane, and it follows from the half-plane plus local control of off-line zeros (Prop. C); no proof from the half-plane alone is known.

---

## 11. What would be needed; next steps

* **For p < 3/4 in any form:** Θ < 7/8. In the 7/8 architecture that means changing the binding row bin of Lemma 20.2 (δ* ≈ 0.39, x = 1/2) or the Xu–Sang bin (δ* ≈ 0.47), or restructuring the Gram step that produces Prop. 15.2's P_a^{1/6} term. The sibling notes `zf-campaign-high-side.md`, `beat78-prop152-*.md` and `zf-campaign-new-probe.md` cover these levers. The floor formulation supplies no input to them beyond the weak κ-channel of §6.
* **For the operator floor at p = 2Θ − 1:** a uniform bound on #{ρ : Re ρ > 1/2, γ_ρ ∈ [t, t + 1)}, or any large-sieve inequality for the off-line ordinates with sinh-weights at scale 1/log λ (Prop. C, Steps 2–3).
* **Retire as independent levers:** "V7 floor", "Möbius energy", "Suzuki reserve growth", "twin-ladder shift". They are charts of Θ (§9) and should be priced at their equivalent θ, with p = 2θ − 1.
* **Optional finite by-product (not done):** a zero-side Suzuki-type range W ≤ 45 (PT only) or W ≤ 60 (with 7/8), via Remark A.4. It would carry no exponent information.

---

## 12. Reproduction

```bash
cd /Users/USER/Documents/GitHub/mathexplorer
.venv-arb/bin/python tmp/zf-v7-floor-explicit.py   > tmp/zf-v7-floor-explicit.log    # ~3 s
.venv-arb/bin/python tmp/zf-v7-floor-zeroside.py   > tmp/zf-v7-floor-zeroside.log    # ~70 s
.venv-arb/bin/python tmp/zf-v7-floor-constants.py  > tmp/zf-v7-floor-constants.log   # ~10 s
.venv-arb/bin/python tmp/zf-v7-floor-bootstrap.py  > tmp/zf-v7-floor-bootstrap.log   # ~80 s
```

Zeros: `tmp/routes-b8-r34-out/zeros1e6.npy` holds the first 10⁶ ordinates (Odlyzko table, float64). Every number quoted in §§0–9 appears in one of the four logs, or in the cited sibling and PR files.
