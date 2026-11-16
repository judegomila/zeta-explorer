# RH attempt, 1 November 2026: bootstrapping the quasi-Riemann half-plane

**Revision 2, written after reading the PR #27 audit (§0).** **Outcome: the attempt fails. No proof of RH.**

The target is a self-improving zero-free half-plane: "zero-free in Re s > θ" implies "zero-free in Re s > θ − δ(θ)",
with δ bounded below on compact subsets of (1/2, 1] (Theorem BT, §2). Iteration would give RH (Lemma 2.1). Four
architectures are written out as proof attempts and then attacked:

* Attempt I (§3): Part II of the openai/math 7/8 argument, input fed into its zero-loss capacity and zero bins;
* Attempt I′ (§4, new): the Xu–Sang v2 refinement of that argument, as encoded in PR #14, where the input licenses the
  capacity parameter κ;
* Attempt II (§5): the openai/math Möbius-sum (11/12) route, input fed row by row into the Möbius mean square;
* Attempt III (§6, new): the Landau functionals recorded in the audit (the V7 floor, the one-sided discrepancy, the
  Möbius-packet energy, Suzuki's reserve, Vaughan-centred shells), input fed into their signed estimates.

Each fails at an identified line (§§3.4, 4.5, 5.4, 6.5). In every architecture the bootstrap map has a fixed point
above 1/2 (Theorem S, §2.3; table in §7). RH is open. PT Λ ≤ 0.2 stands. Nothing here changes a Λ bound. NO QED.

Grades: **PROVED** (complete argument written here; same-agent check only, no independent referee), **EXACT** (exact
rational or symbolic computation in the scripts of §10), **MODEL** (floating-point computation on a stated encoding),
**READ** (statement read from a source, with location), **HEURISTIC**, **TOY** (numerical illustration in a simpler
setting; proves nothing).

Sources. [OAI-7/8]: OpenAI, *The Quasi-Riemann Hypothesis: a zero-free half-plane Re s > 7/8*, 30 Sep 2026
(github.com/openai/math, family 003; text at `~/lean-deps/qrh-verify/paper.txt`). [OAI-11/12]: OpenAI, *The
Quasi-Riemann Hypothesis*, 5 Oct 2026 (`~/lean-deps/qrh-verify/paper2.txt`). The ζ and Dirichlet 7/8 statements were
built locally in Lean with the standard axioms (`formalization/external/openai-math-qrh-verification.md`); the Hecke
family statement and both manuscripts are not refereed. [XS]: Y. Xu, H. Sang, *Amplified moments and a refinement of
the quasi-Riemann hypothesis*, arXiv:2610.15291v2. The XS text is not available on this machine; it is used only
through the PR #14 encoding (`git show refs/pr/14:rigorous/mobius_bridge_reduction/{certify_parameters.py,
verify_certificate.py, README.md, TARGET_0874.md, SIGNED_PHASE_FILTER.md, Mobius_Bridge_Reduction.pdf}`), which cites
XS equations (10), (21), (28), §6.2 and Lemma 8.1. Its analytic inputs are not verified here or in PR #14. [ATLAS]:
PR #27, `research/rh/modules/historical-routes.md` (snapshot `/tmp/atlas-snap-historical-routes.md`, byte-identical to
`refs/pr/27`), with the module notes `arithmetic-foundation.md`, `suzuki-recurrence.md`, `prime-memory.md`,
`finite-suzuki-certificate.md`, `spectral-head-theory.md`, `signed-complement.md`, `whole-even-certificate.md`,
`spectral-denominator-repair.md` and `research/rh/PUBLICATION_SCOPE_2026-10-30.md`. Earlier project notes on the
7/8 manuscript: `formalization/paper/qrh-improvement-attempt-a.md`, `qrh-improvement-attempt-b.md`.

---

## 0. The PR #27 audit: reading, overlaps, and what this revision changes

The previous version of this file was written at 12:48 today, before the audit snapshots, and does not cite the audit.
For this revision the audit was read first and in full: the route atlas (§§1–12 and its review ledger), the
publication-scope note, and the nine module notes listed above. Every overlap with a route the atlas records is listed
here with the atlas location and the difference.

| this attempt | atlas location | what the atlas records | what is different here |
|---|---|---|---|
| Attempts I and I′ (the 7/8 probe and its XS refinement) | §10, "What PR 14 actually certifies" and "7/8 status"; PR #14 README | conditional B = 17497733/20000000 = 0.87488665 from re-tuning XS parameters; B ≤ 0.8748 infeasible inside that numerical system, for κ in the admitted range; B = 0.874 needs the unproved restricted fourth moment (H) | the atlas records a re-tuning at fixed input. Here the input half-plane is the variable. PR #14's two stages are identified as two steps of a bootstrap map F_XS (§4); F_XS is computed, contracts with ratio 0.0030, and stops at σ_sc^XS ∈ (0.874886646840, 0.874886649040) (exact bracket, §4.4). This extends the 0.8748 obstruction to every iterate, including capacities below the range PR #14 admits, and shows the bootstrap cannot reach (H) |
| Attempt II, Lemmas II.6–II.7 (amplifier duality) | §10, sixth-phase filter paragraph; PR #14 `SIGNED_PHASE_FILTER.md` §5 | the optimal principal-preserving sextic filter has exact complete-period Gram orthogonality but retains eigenvalue one on the simultaneous local sixth-power residues; small mean energy is not a worst-case contraction | Lemma II.7: the eigenvalue-one set contains every global sixth power, and those rows carry the target L-function (Lemma II.1). The retained eigenvalue and the circularity of the bootstrap's mean-square step are one obstruction seen from the filter side and from the row side |
| Attempt III, V7 floor | §10, last paragraph ("an actual floor ε₀(λ) ≥ −C(1+log λ)^m λ^p ...") | floor with p < 1 ⇒ no zeros in Re s > (1+p)/2; unproved | Lemma III.2 re-derives the same implication (for 0 ≤ p < 1, as Θ ≤ (1 + p)/2) from the Suzuki box identity and the one-sided Landau theorem. So the floor step of a bootstrap is at least as strong as its conclusion |
| Attempt III, discrepancy and shells | arithmetic-foundation module §§2–4 | one-sided Landau theorem; all-real shell reconstruction; Vaughan centering keeps the signed Type I/II terms; better quadrature does not supply cancellation | Theorem III.1: the growth exponent of D, of either sign, equals Θ − 1/2. Lemma III.4: the Type II series carries every zero with residue −m(ρ); the Type I series carry none. A half-plane input can act only on Type II and returns its own exponent |
| Attempt III, Möbius-packet energy | §10, "Actual reduction"; PR #14 report p. 5 | energy target ∫_j^{j+1}|S|² ≤ Ce^{0.7496 j} for B = 0.8748; pairs with small common divisor and large separation uncontrolled | Proposition III.3: the energy exponent is at least 2Θ − 1, so the energy step of a bootstrap implies its conclusion |
| Attempt III, Suzuki reserve | Suzuki-recurrence module §§1, 4 | a finite lower bound for R_N (equivalently G_N) would imply RH | Ψ = ar + T(r) − D(r), so the reserve's growth exponent is D's; covered by Theorem III.1 |
| scope rules | §9, §11; publication-scope note | negative lower surrogates are not negative actual forms; a finite positive prefix is not an all-scale bound; a uniform strictly positive margin is the wrong RH target | no surrogate, finite certificate or finite prefix is used as an all-scale statement; the floor target in §6 is a growth exponent and allows a zero floor, consistent with §11 |
| not used | §§2–8, §12; spectral-head, signed-complement, whole-even, spectral-repair modules; vortex reduction | — | no heat flow, twin ladder, theta certificate, discrete curvature, twistor/Hankel or finite-support spectral result is used. No Λ claim is made (atlas §12) |

**New in this revision.** (a) Attempt I′: the bootstrap map of the XS system, its fixed point, an exact bracket of the
stopping point, and an exact stage-3 certificate. (b) Theorem S: in an architecture where the input enters only
through a monotone capacity, iteration stops at the self-consistent closing point σ_sc, which the internal hypothesis
of the proof by contradiction already reaches in one step; this explains both the constant map of Attempt I and the
contraction of Attempt I′. (c) Attempt III: the audit's Landau functionals as bootstrap levers, and why each is the
bootstrap step restated. (d) Lemma II.7, the dictionary to PR #14's eigenvalue-one filter. (e) All earlier scripts
re-run with unchanged output (§10).

---

## 1. Outcome in brief

| architecture | how ZF(θ) enters | bootstrap map F | where it stops | binding object | grade |
|---|---|---|---|---|---|
| I: [OAI-7/8] Part II, dynamic κ = 2β* − 1 | zero-loss capacity, zero bins | F(θ) = min(θ, 0.8749572) | 0.8749572, after one step | row bin δ ≈ 0.387 at x = 1/2 (zeros at real part ≈ 0.694), at β* ↓ σ₀ | MODEL |
| I, any high side, stated low lemmas | — | F ≥ 13/15 | 13/15 | zero-blind low estimate (Lemma 15.1 range ℓ ≤ 1/5) | EXACT |
| I′: [XS] via PR #14, licensed κ = 2θ − 1 | capacity c = 1/(3κ) only | contraction, ratio 0.00302 | σ_sc^XS ∈ (0.874886646840, 0.874886649040) | endpoint bin δ* = 0.469345 at x = 1/2 (zeros at real part 0.734672), tangent in b | EXACT bracket, MODEL map; conditional on [XS] |
| II: [OAI-11/12] Möbius route | row-wise Möbius bounds; amplification error | F ≡ 11/12 (no step below 11/12) | 11/12 | zero-blind mean square needs H ≥ D; resonant rows u = ζa⁶ carry the target | EXACT |
| III: Landau functionals (floor, D, energy, reserve, shells) | explicit formula only | F(θ) = θ | every θ is fixed | Vaughan Type II = the full zero sum | PROVED |

**One sentence.** In each architecture the exponent-setting step is either zero-blind (low estimate, mean square,
sixth-power amplification) or is itself a function of Θ = sup Re ρ (the Landau functionals); a half-plane input acts
only through monotone zero-aware lemmas, so iteration stops at a fixed point determined by the zero-blind data. That
point is ≥ 13/15 for the probe and 11/12 for the Möbius route; for the Landau functionals every θ is a fixed point.

---

## 2. The target, the iteration, and where any bootstrap stops

### 2.1 Setting

F = Q(√−3), O = Z[ω]. The family 𝓕 consists of the L-functions L_F(s, η) of primitive finite-order Hecke characters η
over F. For θ ∈ [1/2, 1] let

  **ZF(θ):** L_F(s, η) ≠ 0 for every η and every s with Re s > θ (the pole of ζ_F at s = 1 allowed).

Following [OAI-7/8, (2.1)], β* := sup({1/2} ∪ {Re ρ : L_F(ρ, η) = 0, 1/2 ≤ Re ρ ≤ 1, η primitive}); ZF(θ) holds iff
β* ≤ θ. ZF(1) holds by the Euler product. [OAI-7/8, Thm 1.1] asserts ZF(7/8). For ζ alone (Attempt III) write
Θ := sup{Re ρ : ζ(ρ) = 0, 0 < Re ρ < 1} and use the same notation ZF(θ) for ζ.

### 2.2 Target

**Theorem BT (target; not proved).** There is δ : (1/2, 1] → (0, ∞) with m(σ) := inf_{[σ,1]} δ > 0 for every
σ > 1/2, such that ZF(θ) implies ZF(θ − δ(θ)) for every θ ∈ (1/2, 1].

**Lemma 2.1 (iteration; PROVED).** Theorem BT implies ZF(1/2), hence RH.

*Proof.* Put θ₀ = 1 and θ_{k+1} = θ_k − δ(θ_k) while this is > 1/2. If some θ_k − δ(θ_k) ≤ 1/2, ZF(1/2) holds by BT.
Otherwise θ_k decreases to θ_∞ ≥ 1/2; if θ_∞ > 1/2 then δ(θ_k) ≥ m(θ_∞) > 0 for all k, so θ_k → −∞, a
contradiction. Hence ZF(θ) for every θ > 1/2, i.e. ZF(1/2). For the trivial character L_F(s, 1) = ζ(s)L(s, χ₋₃), so ζ
has no zero with Re s > 1/2, and by the functional equation none with Re s < 1/2 in the critical strip. ∎

### 2.3 Fixed points of a bootstrap (Theorem S)

Fix an architecture 𝒜. For an input θ let O(θ) ⊂ (1/2, 1] be the set of σ for which 𝒜 proves ZF(σ) from ZF(θ). Two
properties hold for any architecture: (a) θ ≤ θ′ ⇒ O(θ′) ⊆ O(θ), because ZF(θ) implies ZF(θ′), so an input can be
weakened; (b) σ ∈ O(θ), σ′ ≥ σ ⇒ σ′ ∈ O(θ). Put F(θ) := min(θ, inf O(θ)) and θ_{k+1} := F(θ_k).

**Theorem S (PROVED).**
1. F is nondecreasing. If φ ≤ θ₀ and inf O(φ) ≥ φ, then θ_k ≥ φ for every k: the iteration cannot pass a point at
   which 𝒜 gives no gain.
2. (Capacity form.) Suppose σ ∈ O(θ) ⟺ Γ(σ, 2θ − 1), where Γ(σ, κ) ⇒ Γ(σ, κ′) for every κ′ ≤ κ. Let
   σ_sc := inf{σ : Γ(σ, 2σ − 1)}, the self-consistent closing point. Then inf O(θ) ≥ min(θ, σ_sc) for every θ. Hence
   F(θ) = θ for θ ≤ σ_sc, F(θ) ≥ σ_sc for θ ≥ σ_sc, and the iteration from any seed ≥ σ_sc stays ≥ σ_sc.
3. Consequently a bootstrap of capacity form proves RH only if Γ(σ, 2σ − 1) holds for every σ > 1/2, i.e. only if the
   architecture closes at every σ with the capacity that ZF(σ) itself would give.

*Proof.* (1) θ ≤ θ′ gives O(θ′) ⊆ O(θ), so inf O(θ) ≤ inf O(θ′) and F(θ) ≤ F(θ′). If θ_k ≥ φ then
O(θ_k) ⊆ O(φ), so θ_{k+1} = min(θ_k, inf O(θ_k)) ≥ min(φ, inf O(φ)) = φ. (2) Let σ ∈ O(θ) with
σ < min(θ, σ_sc). Then Γ(σ, 2θ − 1); since 2σ − 1 < 2θ − 1, monotonicity in κ gives Γ(σ, 2σ − 1), so σ ≥ σ_sc,
a contradiction. The remaining assertions follow, the last by induction using (1). (3) If 𝒜 proves Theorem BT, then for
each θ > 1/2 some σ < θ lies in O(θ), i.e. Γ(σ, 2θ − 1) holds, and property (b) gives Γ(θ, 2θ − 1). ∎

**Remark S.1 (the internal hypothesis already reaches σ_sc; READ + MODEL).** [OAI-7/8, Prop. 2.1] is a proof by
contradiction at a boundary σ₀: it assumes β* > σ₀ and uses its own ZF(β*). In Part II it sets κ = 2β* − 1 ("so its
zero-free hypothesis in this lemma holds by equality", p. 154; κ = 3/4 + 2Δ, §19.2, p. 182), computes the row counts at
the capacity of β* = σ₀, and pays the dynamic correction (19.6) of at most Δ/4 (p. 192). The closing margin then
improves with Δ = β* − σ₀ ((20.10): slope −(1 − h/4)), so the binding configuration is β* ↓ σ₀, where the internal
input is ZF(σ₀ + o(1)), i.e. capacity 2σ₀ − 1. One step of that argument therefore closes at σ_sc. An external input
iterated through a fixed capacity, as in [XS] (§4), is another way to compute the same σ_sc and cannot go below it
(Theorem S.2).

### 2.4 Where an input half-plane can enter (READ)

| step | location | uses zeros of 𝓕? | how ZF(θ) could enter |
|---|---|---|---|
| low estimate (2.4) | [OAI-7/8] Prop. 6.3, Prop. 15.3 via Lemma 15.1 and Prop. 15.2 | **no**: Sections 5, 6, 14, 15 use neither Lemma 4.9 nor β*; §5.1: "These automorphy and coefficient formulas have no hypothesis about zeros of L-functions." | cannot enter |
| high estimate (2.5), normalisation | Prop. 2.1; Lemma 20.1 | measured against Z^{C(β*)} | through the range β* ≤ θ |
| zero bins | Lemma 8.1 and the paragraph after it (pp. 56–57) | a ≤ β*, δ = 2a − 1 ≤ 2β* − 1 | bins δ ≤ 2θ − 1 |
| zero-loss capacity | Lemma 18.1 hypothesis β* ≤ (1 + κ)/2 (p. 153); Prop. 19.2, (19.2): z_P(m) = (1 − 2m)/(6κ); (19.6) | yes | κ = 2θ − 1 |
| [XS] licensed capacity | PR #14 stage linkage, `verify_certificate.py`: (1 + κ)/2 = proved boundary | yes | κ = 2θ − 1, fixed for the whole stage (§4) |
| amplification error | [OAI-11/12] (3.2): \|A₁(D) − A_{p⁶}(D)\| ≤ \|E_p\| | no | E_p is a Möbius sum of length D/Np: ≪ (D/Y)^{θ+ε} |
| twisted Möbius mean square | [OAI-11/12] Prop. 3.1 (Poisson, Gauss–Jacobi, Patterson, quadratic large sieve, cube removal) | no | row by row (§5) |
| transfer step | [OAI-11/12] §2.5 / Prop. 5.4 | no | \|M(y)\| ≪ L_b^{θ+ε} |
| Landau functionals | [ATLAS] §10; arithmetic-foundation §§2–4; Suzuki module | only through the explicit formula | as a bound on the zero sum, i.e. on Vaughan Type II (§6) |

---

## 3. Attempt I: the zero-loss route (Part II of [OAI-7/8])

Overlap: [ATLAS] §10 records [XS]/PR #14, a refinement of this architecture, at fixed input. The atlas does not
analyse the input-to-output map. This section is unchanged in substance from revision 1; Theorem S and Remark S.1 now
explain its main result.

### 3.1 Setting

Part II with a free geometry g = (l_x, b, ℓ): X = Z^{l_x}, Y = Z^{l_y}, l_y = l_x + b, M = l_x + l_y, total prime-slot
length ℓ, Poisson row range h = 1 + ℓ − l_x. The paper's geometry is (17/48, 1/8, 1/6) (12.4). From Prop. 15.3 and
(15.9) the low exponent is L_g = l_x/2 + b/12 and the Mellin shift is c_g = l_x/2 − 1 + h/6, so the boundary at which
(2.4) can hold is

  σ_low(g) = L_g − c_g = 5/6 + (M − 2ℓ)/12 = 5/6 + (l_x − ℓ)/6 + b/12      (EXACT, E1; 7/8 at the paper geometry).

The high side, per retained row bin (real part a = (1 + δ)/2, row norm U = Z^d, prime amplitude q = xδ, row-count
exponent R), is Lemma 20.1: the bin is admissible iff a + G < β*, with

  G = h(z₀ − 1/6) − a·l_y − ℓ/2 + qℓ + d(R + δ/2 − z₀),  z₀ = 17/50, binding at d = h,

and R = R*(δ, x; c) from Prop. 19.2 with plain-capacity constant c = 1/(3κ):
R* = 1 − δ + (α − δ)δP_x/(2J), J = (α − δ)D_x + δP_x, P_x = (1 − x)(2 − 2cx), D_x = 3 − x − 2cx, α = 5/6 (at κ = 3/4,
c = 4/9 these are the printed D_x = 3 − 17x/9, P_x = (1 − x)(2 − 8x/9)). The floor bin, the d ≤ 1/2 range, the small
rows and the prime supply ℓ/h > (2 − c)/(2(5 − 2c)) complete the closing system.

### 3.2 The step to be proved

**Proposition I(θ).** For θ ∈ (1/2, 1] there are a geometry g and σ₁ < θ with σ₁ ≥ σ_low(g) such that, assuming
ZF(θ), hypotheses (2.4) and (2.5) of Prop. 2.1 hold at σ₀ = σ₁ for every hypothetical β* ∈ (σ₁, θ]. Then Prop. 2.1
gives ZF(σ₁), and δ(θ) := θ − σ₁.

### 3.3 The argument

*Step I.1.* Assume ZF(θ) and β* > σ₁; put Δ = β* − σ₁ ∈ (0, θ − σ₁].
*Step I.2 (bins).* By Lemma 8.1 every retained nonprincipal row has its bin at a ≤ β* ≤ θ, so δ ≤ 2θ − 1.
*Step I.3 (capacity).* Apply Lemma 18.1 with κ_θ = 2θ − 1 (its hypothesis β* ≤ (1 + κ_θ)/2 is ZF(θ)); the plain
capacity is z_P(m) = (1 − 2m)/(6κ_θ).
*Step I.4 (row counts).* With c_θ = 1/(3κ_θ) the counts R*(δ, x; c_θ) decrease (R* is nonincreasing in c; Lemma I′.1
proves this for the same formula); lower counts loosen the central bins.
*Step I.5 (re-tuning).* On M + ℓ = 1, σ_low = 11/12 − ℓ/4, so a longer compensation length lowers σ₁.
*Step I.6 (conclusion).* Prop. 2.1 at σ₀ = σ₁ := σ_low(g(θ)) < θ gives ZF(σ₁). Iterate (Lemma 2.1).

Steps I.1–I.5 are valid as statements. The argument fails at Step I.6.

### 3.4 Where it fails

**Lemma I.1 (internal dominance; PROVED from READ statements).** In the proof of Prop. 2.1 at boundary σ₀, for every
hypothetical β* ∈ (σ₀, θ], each zero-aware step of Part II is at least as strong with the internal input ZF(β*) as with
ZF(θ). Hence the only effect of ZF(θ) on Part II is to restrict β* to (σ₀, θ].

*Proof.* β* ≤ θ, so ZF(β*) implies ZF(θ). Lemma 8.1's bins satisfy a ≤ β*; Lemma 18.1 needs β* ≤ (1 + κ)/2 and the
paper takes κ = 2β* − 1, the smallest admissible value; the capacity (1 − 2m)/(6κ) decreases in κ; in Prop. 19.2 the
selected length is any value up to the capacity and the count exponents 1 − δr − 2qz, 1 − 2δm − 2qz are nonincreasing
in z. ∎

**Lemma I.2 (binding configuration; READ + MODEL).** After (19.6), (20.10) reads
E_actual(h) − Δ ≤ −49/440640 − (51/64)Δ + ε_total: the margin grows with Δ (EXACT, E3). MODEL: at the paper geometry the
margin decreases monotonically from −2.28·10⁻⁴ at β* = 7/8 to −0.085 at β* = 1; at the re-tuned optimum from −1.0·10⁻⁶
at β* = σ₀ to −0.085 at β* = 1. So the binding inequality sits at β* ↓ σ₀ and does not depend on θ.

**Lemma I.3 (the binding bin is invisible to half-plane inputs; READ + EXACT).** At the paper geometry the binding
inequality is Lemma 20.2 at x = 1/2, δ = 79/204 (the square (4vδ − 79)² of (20.9) vanishes at y = 0), exact margin
−E* = 147/(10368·51·J), J = 497/408, i.e. 2.282·10⁻⁴ (EXACT, E4–E5). These are rows whose L-functions have a zero
with real part a = 283/408 ≈ 0.6936. The count exponent R* = 0.667894 against the density-hypothesis value
1 − δ = 0.612745 is a zero-density statement at σ ≈ 0.694. An input ZF(θ) removes those rows only if θ < 0.694; the
iteration never produces θ < 13/15. Replacing κ = 3/4 by κ = 1/2 (input θ = 3/4) moves R*(79/204, 1/2) only from
0.667894 to 0.666261.

**Lemma I.4 (zero-blind low floor; EXACT within the stated lemmas).** Over the region where Lemma 15.1 applies without
excess and Prop. 15.3's length conditions hold (M + ℓ ≤ 1, 2M ≥ 1 + 3ℓ, l_y − ℓ − 11b/6 ≥ 0, l_x ≥ ℓ, b, ℓ ≥ 0), the
minimum of σ_low is exactly **13/15**, at ℓ = 1/5, M = 4/5 (script E2). Prop. 15.3 uses no L-function, so for any input
θ, even with a perfect high side, Part II with its stated low lemmas gives no boundary below 13/15. For this probe
family with any low lemmas, σ₀ < 5/6 needs a Poisson row range h > 1 (attempt-b §2, READ).

**Theorem I.5 (the bootstrap map is constant; MODEL).** With F(θ) the best σ₁ for which the Part II closing system
closes (all high-side bins for every β* ∈ (σ₁, θ], κ up to 2θ − 1):
* the model reproduces the paper at (17/48, 1/8, 1/6): floor −7/1200, d ≤ 1/2 range −49/14400, small rows −79/800,
  endpoint 2.2815·10⁻⁴ at δ ≈ 0.3866;
* F(θ) = 0.8749572112 at θ = 1, 0.95, 11/12, 0.9, 0.885, 0.88, 0.8775, 0.876, 0.875, 0.87498 (spread 0), at
  (l_x, b, ℓ) ≈ (0.353913, 0.125337, 0.166838), M + ℓ = 1; re-run today with identical output;
* F is nondecreasing (Theorem S.1), so F is constant on [0.87498, 1];
* for θ ≤ 0.8749572 the system does not close below θ at any geometry tried.

So F(θ) = min(θ, 0.8749572): σ_sc^OAI = 0.8749572 in the sense of Theorem S, reached in one step, as Remark S.1 predicts.

**Exact failing line of Attempt I.** Step I.6: Prop. 2.1 at σ₀ = σ₁ < 0.8749572. For a geometry with
σ_low(g) < 0.8749572, hypothesis (2.5) fails at β* ↓ σ_low(g). Over 4000 random admissible geometries with
σ_low(g) < 0.8749572, the high side fails at β* = σ_low(g) + 10⁻⁶ in all 4000: in a central bin with δ ∈ [0.336, 0.516]
(zeros at real part 0.67–0.76) in 3464 cases, in the d ≤ 1/2 range in 453, at the floor bin in 83 (MODEL). None of these
inequalities involves θ (Lemmas I.1–I.2); the central ones concern zeros no reachable input excludes (Lemma I.3); none
can be traded against (2.4), whose exponent is fixed by zero-blind lemmas (Lemma I.4).

---

## 4. Attempt I′ (new): the Xu–Sang system with licensed capacity (PR #14)

Overlap: [ATLAS] §10 and PR #14 record the parameter refinement B = 0.87488665 and the exclusion of B ≤ 0.8748 inside
the XS admissibility system for κ ∈ [29991/40000, 3/4]. What is different: here κ is driven by the input half-plane,
the resulting map is iterated to its end, and the stopping point is bracketed exactly. PR #14's exploratory script
already evaluated one trial κ below the admitted range (`explore_endpoint.py`, κ = 2·0.8748867 − 1); it records no
iteration, fixed point or bracket.

### 4.1 The system (READ from the PR #14 encoding of [XS] (21), (28), §6.2)

Parameters b (imbalance), ℓ (prime length), κ (moment parameter); c = 1/(3κ);
l_x = (1 − b − ℓ)/2, l_y = (1 + b − ℓ)/2, h = (1 + b + 3ℓ)/2 = 1 + ℓ − l_x, C₀ = −1/4 + b/6 + 5ℓ/4. Boundary:

  B = 11/12 − ℓ/4.

Endpoint: for 0 ≤ δ ≤ 5/6, 0 ≤ x ≤ 1/2, with D_x = 3 − (1 + 2c)x, P_x = (2 − 2cx)(1 − x), J = (5/6 − δ)D_x + δP_x,
R = 1 − δ + (5/6 − δ)δP_x/(2J),

  E(δ, x) = C₀ + δ/2 + δx(ℓ + c(h/4 − l_y/2)) − (3h/4)(1 − R),   required: E < −g on the whole rectangle.

Gates: b > 0; 1/6 < ℓ < 1/5; B > 87/100; l_x > ℓ; l_y − ℓ − 11b/6 > 0; 6κℓ > 3/4; ℓ/h < 1/(6κ); ℓ/(h + ζ) > 21/100;
h/2 < l_y < 1/2; max(C₀, C₀ + A_sm/8) < −1/250 with A_sm = 1/2 + (ℓ/2)(1/2 + 2ℓ/h) − h/2;
C₀ + (1/2 + 3ℓ/2)/50 < −1/100; h(17/50 − 1/6) − l_y/2 + 1/50 < −1/20; small g, ζ, g* > 0 with g − 2ζ − g* > 0.

Licensing: κ is admissible only when (1 + κ)/2 is an already proved boundary (stage linkage asserted in
`verify_certificate.py`; this is the zero-loss hypothesis β* ≤ (1 + κ)/2 of [OAI-7/8, Lemma 18.1] holding for every
β* in the contradiction range). The low side is the [OAI-7/8] low side: M + ℓ = 1 is built in and ℓ ≤ 1/5 is
2M ≥ 1 + 3ℓ, so B ≥ 13/15 for every κ.

### 4.2 The step to be proved

**Proposition I′(θ).** For θ ∈ (1/2, 1], with κ = 2θ − 1, there are admissible (b, ℓ) with 11/12 − ℓ/4 ≤ θ − δ(θ).
Then [XS]'s closure lemma (imported, not verified) gives ZF(θ − δ(θ)), and Lemma 2.1 would give RH.

### 4.3 The argument

*Step I′.1 (input → capacity).* Assume ZF(θ). Set κ = 2θ − 1; the zero-loss hypothesis holds for every β* ≤ θ.
*Step I′.2 (closing).* Choose (b, ℓ) admissible at κ; [XS] gives ZF(B), B = 11/12 − ℓ/4.
*Step I′.3 (bootstrap).* Put F_XS(θ) := inf of such B. If F_XS(θ) ≤ θ − δ(θ) with δ bounded below on compacts,
iterate.

Step I′.1 is valid (given [XS]). Step I′.2 is valid at each admissible point (given [XS]); X1 below checks that PR #14's
two published stages are instances of it. Step I′.3 fails.

### 4.4 Results

**Lemma I′.1 (κ-monotonicity; PROVED, symbolic check L7).** If h < 2l_y (a gate), E(δ, x; b, ℓ, κ) is nondecreasing in
κ on the whole rectangle. *Proof.* With c = 1/(3κ),
d(D_x/P_x)/dc = 2x(1 − x)²/(2(1 − cx)(1 − x))² ≥ 0. Hence P_x/J = 1/((5/6 − δ)D_x/P_x + δ) and R are nonincreasing in
c; so −(3h/4)(1 − R) is nonincreasing in c, and δxc(h/4 − l_y/2) is nonincreasing in c because h/4 − l_y/2 < 0. Since c
decreases as κ increases, E is nondecreasing in κ. ∎ So the smallest licensed κ is optimal and F_XS genuinely depends
on the input; the architecture has the capacity form of Theorem S.2 (after the trivial envelope over weakened inputs,
which covers the gate 6κℓ > 3/4, the one gate that tightens as κ decreases).

**Lemma I′.2 (two-point Farkas bound; PROVED).** At fixed (δ, x, κ), E = e₀ + e_b·b + e_ℓ·ℓ is affine in (b, ℓ), with
e_ℓ = 5/4 + δx(1 + 5c/8) − (9/8)(1 − R) ≥ 5/4 − (9/8)(5/6) = 5/16 > 0 (because 1 − R ≤ δ ≤ 5/6). If
e_b(δ₁, 1/2) ≥ 0 ≥ e_b(δ₂, 1/2), put w₁ = −e_b(δ₂), w₂ = e_b(δ₁). Every admissible (b, ℓ) satisfies
ℓ ≤ ℓ_max := −(w₁e₀(δ₁) + w₂e₀(δ₂))/(w₁e_ℓ(δ₁) + w₂e_ℓ(δ₂)), for every real b. *Proof.* Add w₁E(δ₁, 1/2) ≤ 0 and
w₂E(δ₂, 1/2) ≤ 0; the b terms cancel identically. ∎ By Lemma I′.1 a bound computed at κ_j holds for every κ ≥ κ_j.

**Results of `tmp/rha-bootstrap-qrh-xs.py`:**

* **X1 (EXACT).** PR #14's chain 7/8 →(κ = 3/4) 69991/80000 →(κ = 29991/40000) 17497733/20000000 is two steps of
  Step I′.3. Both stages re-verified by an independent implementation: endpoint negativity on the full rectangle by Sturm
  root counting on the interpolated bidegree-(2, 3) polynomial 2J(−E − g), and all gates in exact rationals.
* **Map (MODEL).** F_XS(7/8) = 0.8748869893579. Iterating from 7/8:

  | k | θ_k | gain |
  |---|---|---|
  | 1 | 0.8748869893579 | 1.130·10⁻⁴ |
  | 2 | 0.8748866480741 | 3.413·10⁻⁷ |
  | 3 | 0.8748866470431 | 1.031·10⁻⁹ |
  | 4 | 0.8748866470400 | 3.1·10⁻¹² |

  The ratio of consecutive gains is 0.00302 = dF_XS/dθ at the fixed point σ_sc^XS ≈ 0.8748866470400. The first step's
  gain is mostly [XS]'s improved high side at κ = 3/4; the input contributes the later steps. At the fixed point the
  binding constraint is the endpoint at δ* = 0.469345, x = 1/2, where e_b = 0 (the optimum is a tangency in b; PR #14's
  test point 9387/20000 = 0.46935 is the same point). No gate binds; the smallest gate margins are 1.79·10⁻⁴ (small-δ),
  4.53·10⁻⁴ (ℓ − 1/6), 4.93·10⁻⁴ (prime supply). The solver reproduces PR #14's floating-point value
  B*(29991/40000) = 0.8748866496166 to all printed digits.
* **X2, X5 (EXACT): no gain at or below θ_lo = 21872166171/25000000000 = 0.874886646840.** Four Farkas certificates
  (Lemma I′.2 with Lemma I′.1) give: every input θ ≥ 13/15 has every admissible output B ≥ 0.8748612475; every input
  θ ≥ 0.874861247522 has B ≥ 0.8748865703; every input θ ≥ 0.874886570306 has B ≥ 0.8748866468; every input
  θ ≥ 0.874886646808 has B ≥ 0.8748866470392. Below 13/15 the low side gives B ≥ 13/15 > θ. So F_XS(θ) = θ for every
  θ ≤ θ_lo, and for every input θ ≥ θ_lo every output is ≥ 0.8748866470393 > θ_lo; by Theorem S.1 the iteration from any
  seed never goes below θ_lo. These certificates use only the endpoint and the low side, not the κ-gates.
* **X3 (EXACT, conditional): stage 3.** From PR #14's boundary, κ₃ = 2·17497733/20000000 − 1 = 7497733/10000000;
  b = 21633737/250000000, ℓ = 167120078071/10¹² pass every gate and the endpoint (E < −10⁻¹² on the rectangle) and give
  B₃ = 10498639765787/(12·10¹²) = 0.8748866471489, which is 2.85·10⁻⁹ below 0.87488665. This needs [XS]'s analytic inputs
  at κ₃, which lies below the range [29991/40000, 3/4] PR #14 admits. The lower end of that range equals the stage-1
  licensing value, which suggests, but does not establish, that it is a licensing bound and not an analytic restriction.
* **X4 (EXACT, conditional).** At input θ_hi = 10936083113/12500000000 = 0.874886649040 the system certifies
  0.8748866470959 < θ_hi.
* **Bracket.** σ_sc^XS ∈ (0.874886646840, 0.874886649040), width 2.2·10⁻⁹. The whole further effect of iterating the input
  on PR #14's boundary is below 3.2·10⁻⁹.
* **Window (MODEL, L5).** The encoding admits parameters only for κ ∈ (0.747916, 50/63), i.e. inputs
  θ ∈ (0.873958, 0.896825): below, the gate 6κℓ > 3/4 closes; above, ℓ/h < 1/(6κ) meets ℓ/h > 21/100.
* **Cross-check by a second method (MODEL, 40 digits, `tmp/rha-bootstrap-qrh-xs-crosscheck.py`).** Solving the
  tangency system E = ∂E/∂δ = ∂E/∂b = 0 at x = 1/2 with the self-consistent κ = 2B − 1 = 5/6 − ℓ/2 directly (no LP,
  golden section or Farkas code reused) gives δ* = 0.469344858698, b = 0.0865349592558, ℓ = 0.167120078506810 and
  σ_sc^XS = 0.874886647039964, equal to the iteration's limit and inside the exact bracket; x = 1/2 maximises E there.
  An independently written sympy expression for E reproduces the X2 Farkas rational exactly.

**Theorem I′.3 (where the XS bootstrap stops; EXACT within the PR #14 encoding, conditional on [XS]).** F_XS(θ) = θ for
every θ ≤ 0.874886646840; the iteration from any seed stays above 0.874886646840; F_XS(0.874886649040) < 0.874886649040.
So the stopping point σ_sc^XS of Theorem S.2 lies in (0.874886646840, 0.874886649040). ∎ (X2–X5 with Theorem S.)

### 4.5 Where it fails

**Exact failing line of Attempt I′.** Step I′.3 at any θ ≤ σ_sc^XS: the endpoint inequality E(δ*, 1/2; b, ℓ, 2θ − 1) < 0
at the bin δ* ≈ 0.4693, x = 1/2 forces ℓ ≤ ℓ_max(2θ − 1) (Lemma I′.2), hence B ≥ θ. Why no input moves it:

1. The input enters only through c = 1/(3κ) in R and in the amplitude term; dF_XS/dθ = 0.00302 at the fixed point.
2. The binding rows have L-functions with a zero at real part a = (1 + δ*)/2 = 0.734672 and maximal prime amplitude
   x = 1/2. Every reachable input has θ ≥ σ_sc^XS > 0.8748 > a, so the input cannot remove them. Their count exponent
   R = 0.590332 (density-hypothesis value 1 − δ* = 0.530655) is a family zero-density statement at σ = 0.7347.

**Other channels (HEURISTIC or MODEL, `tmp/rha-bootstrap-qrh-landau.py`).**
* *Density from Lindelöf in the region (L4, HEURISTIC).* ZF(θ) gives Lindelöf for σ > θ and, by Phragmén–Lindelöf with
  the functional equation, conductor-aspect μ(1/2) ≤ (θ − 1/2)/2; Ingham's argument then gives a family density
  exponent A(θ) = 2(1 + 2μ) = 1 + 2θ, i.e. a count exponent (1 + 2θ)(1 − δ)/2. That beats the binding count only for
  θ < R*/(1 − δ) − 1/2 = 0.6125 ([XS] bin) and 0.5900 ([OAI-7/8] bin, δ = 79/204). Both are far below any reachable
  input. The family version and constants of the density estimate are assumed, not checked.
* *Density-hypothesis counts for every row (L6, MODEL).* With R = 1 − δ in every bin (a statement about every row
  L-function that no half-plane input supplies) the endpoint is slack (max E ≈ −0.028), and the gates alone stop the
  system at B = 0.873488 for κ = 0.7497733 (the small-δ gate and the capacity gate ℓ/h < 1/(6κ) bind; the optimum is at
  their intersection to the resolution of the b-grid). For every κ the low side gives B ≥ 13/15.
* *The 0.874 target (H).* (H) is a restricted fourth moment on detected rows of the central bins (PR #14
  `TARGET_0874.md`), i.e. rows with zeros at real parts near 0.73. A reachable half-plane input says nothing about those
  rows, so the bootstrap gives no route to (H) or to 0.874.

---

## 5. Attempt II: the Möbius-sum route ([OAI-11/12])

Overlap: [ATLAS] §10 (sixth-phase filter). Revision 1's analysis is kept, with the row-range exponent renamed τ
(revision 1 called it κ, which clashed with the capacity κ of §§3–4); Lemma II.7 is new.

### 5.1 Setting (READ, [OAI-11/12] §§2–3)

Fix a finite-order Hecke character ν over F and the finite set S (primes above 6 and the conductor of ν). For
W ∈ C_c^∞((0, ∞)) and u ∈ O,

  A_u(D) = Σ_{(n,S)=1} μ(n)ν(n)χ_n(u)W(Nn/D),  χ_n(u) = (u/n)₆ (sextic residue symbol, zero on nonunits).

* **Prop. 3.1** (zero-blind): Σ_{0<Nu≤D^{1+ϑ}} |A_u(D)|² ≪ D^{2+ϑ+ε} for each fixed 0 < ϑ ≤ 1/10.
* **Amplification (3.2):** for primes p with Y/2 < Np ≤ Y, χ_n(p⁶) = 1_{p∤n}, so A_{p⁶}(D) = A₁(D) − E_p,
  E_p = Σ_{p|n} μ(n)ν(n)W(Nn/D); J ≍ Y/log Y such p; with Y = H^{1/6},
  |A₁(D)|² ≤ (2/J) Σ_p |A_{p⁶}(D)|² + 2 max_p |E_p|².
* **Mellin (§3):** A₁(D) ≪ D^{θ′+ε} for every W implies L(s, ν) ≠ 0 for Re s > θ′.

With H = D^{1+ϑ}, ϑ → 0, and |E_p| ≤ D/Y this gives θ′ = 11/12 (EXACT, A1).

### 5.2 The step to be proved

Write H = D^τ. **Proposition II(θ).** Assume ZF(θ). Then for some τ < (6/5)(2θ − 1),

  (*)  Σ_{0<Nu≤D^τ} |A_u(D)|² ≪_ε D^{1+τ+ε}.

Given (*) and Step II.2, (3.2) gives |A₁(D)|² ≪ D^{1+5τ/6+ε} + D^{2θ(1−τ/6)+ε}, so θ′ = max(1/2 + 5τ/12, θ(1 − τ/6)), and
θ′ < θ exactly when τ < (6/5)(2θ − 1).

### 5.3 The argument

*Step II.1.* **Lemma II.0 (PROVED, standard).** Let ψ be a finite-order Hecke character over F with primitive conductor
norm Q_ψ, a an ideal prime to S, and suppose L(s, ψ*) ≠ 0 for Re s > σ_ψ ≥ 1/2. Then
Σ_{(n,aS)=1} μ(n)ψ(n)W(Nn/D) ≪_{ε,W,S} D^{σ_ψ+ε}(Q_ψ·Na)^ε. *Proof.* Mellin inversion on Re s = 2 and a shift to
Re s = σ_ψ + ε; |1/L(s, ψ*)| ≪ (Q_ψ(|t| + 2))^ε there by [OAI-7/8, Lemma 4.9]; each deleted Euler factor satisfies
|1 − ψ(p)Np^{−s}|^{−1} ≤ 2 for Re s ≥ 1/2, and there are ≪ log(Na) of them. ∎ (Window version: shift only
|Im s| ≤ D^{ε₀}; the rest stays on Re s = θ + ε and costs O(D^{θ+ε}T^{−A}).)
*Step II.2.* E_p = −ν(p)Σ_{(m,pS)=1} μ(m)ν(m)W(Np·Nm/D), so |E_p| ≪ (D/Y)^{θ+ε} by Lemma II.0 and ZF(θ). (PROVED.)
*Step II.3 (short mean square, row by row).* Write u = a⁶v, v sixth-power-free. Then A_u(D) is the Möbius sum of the
Hecke character ψ_v : n ↦ ν(n)χ_n(v) (conductor ≪ Nv) with the primes of a deleted. With σ_v the largest real part of a
zero of L(s, ψ_v*) with |Im s| ≤ D^{ε₀} (σ_v ≤ θ by ZF(θ)) and multiplicity #{a : N(a⁶v) ≤ H} ≍ (H/Nv)^{1/6},
Σ_{Nu≤H} |A_u(D)|² ≪ D^ε Σ_v (H/Nv)^{1/6} D^{2σ_v}. With N(σ; V) := #{v : Nv ≍ V, σ_v ≥ σ}, (*) follows if for all
V ≤ H and σ ∈ [1/2, θ]

  (**)  (H/V)^{1/6} · N(σ; V) · D^{2σ} ≤ H·D.

*Step II.4.* (*) at τ < (6/5)(2θ − 1) plus Step II.2 gives ZF(θ′) with θ′ < θ. *Step II.5.* Iterate.

Steps II.1, II.2, II.4 are valid. Step II.3 fails.

### 5.4 Where it fails

**Lemma II.1 (the resonant rows are the target; PROVED).** For v = 1, ψ₁ = ν: the rows u = a⁶ have Dirichlet series
1/L^{S∪{p|a}}(s, ν), the target up to finitely many Euler factors nonzero in Re s > 0. For v = ζ a unit, n ↦ χ_n(ζ) is
a ray-class character ξ_ζ of fixed modulus, so these rows carry L(s, νξ_ζ), one of finitely many fixed twists. Each such
row occurs with multiplicity ≍ H^{1/6}. ∎

**Lemma II.2 (circularity; EXACT).** At V ≍ 1, (**) for v = 1 reads H^{1/6}D^{2β} ≤ HD with β the largest real part of
a zero of L(s, ν) in the window: β ≤ 1/2 + 5τ/12, the conclusion of Step II.4. This is not an artefact: if L(s, ν) has
a zero at real part β₀, A₁(D) ≪ D^{β₀−η} fails for suitable W (the Mellin step would continue 1/L past the zero), and
the J ≍ H^{1/6}/log H rows u = p⁶ differ from A₁ by O(D^{θ(1−τ/6)+ε}). So if β₀ > θ′ these rows alone contribute
≫ H^{1/6−ε}D^{2β₀−ε} > HD^{1+ε}, and (*) is false. From ZF(θ) alone the row-wise bound at V ≍ 1 is H^{1/6}D^{2θ}, and the
amplification returns θ′ = max(2θ, 2 − τ/3)/2 ≥ θ for every τ (A2).

**Lemma II.3 (large rows; EXACT).** At V = H, (**) is N(σ; H) ≤ H^{1−(2σ−1)/τ} for σ ∈ (1/2, θ], stronger than the density
hypothesis for τ < 1, including σ → 1/2+, where ZF(θ) says nothing. With the density hypothesis for the whole family the
branch gives θ′ = θ + τ(11/12 − θ), so the best is θ′ = min(θ, 11/12) (A3): 11/12 is where a density-hypothesis count
H^{2(1−σ)} falls below the resonant multiplicity H^{1/6}.

**Lemma II.4 (a contracting density input contains the conclusion; EXACT).** If N_mult(σ; H) ≪ H^{A(1−σ)+ε} on
[1/2, θ], balancing gives θ′ = 1/2 + (5/12)(2θ − 1)/(1 − A(1 − θ)), and θ′ < θ iff A(1 − θ) < 1/6 (A4). The rows u = p⁶
carry the zeros of L(s, ν), so the same density bound already gives no zero of L(s, ν) right of σ_A := 1 − 1/(6A), and
θ′ − σ_A = (2 − A)(1 − 6Au)/(12A(1 − Au)) ≥ 0 on the contraction region (u = 1 − θ; sweep minimum 0).

**Lemma II.5 (the zero-blind side does not reach H < D; schematic (2.8) + READ).** For H ≤ εD the dual mean square of
[OAI-11/12, (2.8)] has diagonal ≍ (D²/H)·D, so the right side of (2.8) is ≥ (c/2)D² > DH, and amplifying D² at H = D^τ
gives 1 − τ/12 > 11/12 (A5). The transfer step contracts only while the row/column ratio is < 1 ([OAI-11/12, p. 10]).

**Lemma II.6 (amplifier duality; PROVED).** If Σ_{u∈𝒰} c_u χ_n(u) = 1 for every n in the support of μνW(N·/D), then
A₁(D) = Σ c_u A_u(D) and ‖c‖² · Σ_{u∈𝒰} |S(u)|² ≥ (Σ_n W(Nn/D))², S(u) := Σ_n χ_n(u)W(Nn/D). *Proof.* Σ_n W = Σ_u c_u S(u)
≤ ‖c‖‖S‖. ∎ For u = ζa⁶, |S(u)| ≍ D (principal class), which allows ‖c‖² ≍ H^{−1/6}: the 11/12 mechanism. For other u,
typically |S(u)| ≍ D^{1/2}, and the resonant rows dominate ‖S‖² for H ≤ D^{6/5}.

**Lemma II.7 (dictionary to PR #14's eigenvalue-one filter; PROVED).** For primes p ≡ 1 mod 6 let f_p(n) = 1 if n is a
nonzero sixth-power residue mod p, −1/5 if p ∤ n otherwise, and 0 if p | n (PR #14 `SIGNED_PHASE_FILTER.md` §2), and
A(n) = K⁻¹Σ_{p∈𝒫} f_p(n). Then A(a⁶) = A(1) = 1 for every a prime to all p ∈ 𝒫, for every finite 𝒫. *Proof.* a⁶ is a
nonzero sixth power mod each p. ∎ So any filter built from sextic characters keeps every global sixth-power row at
eigenvalue one, and by Lemma II.1 these are the rows whose Möbius sums are the target's. The atlas's "the simultaneous
local sixth-power residue subspace retains eigenvalue one" (§10) and the circularity of Step II.3 are the same fact: a
sextic amplifier cannot separate its signal (the principal response) from the rows that carry the target. Removing the
rows erases the signal; keeping them makes the step circular. (PR #14 works with rational integer rows, not the
Eisenstein rows of [OAI-11/12]; the statement above holds in either setting.)

**Exact failing line of Attempt II.** Step II.3, inequality (**) at V ≍ 1: the rows u = ζa⁶ carry the target and its
fixed twists (Lemma II.1), and (**) there is the conclusion (Lemma II.2). Independently (**) at V = H needs a family
density bound beyond the density hypothesis (Lemma II.3), a contracting density input already contains the conclusion
(Lemma II.4), and the zero-blind mean square is stuck at H ≥ D (Lemma II.5). In Theorem S terms: F ≡ 11/12, and the input
affects only the non-binding second term θ(1 − τ/6).

**Toy (TOY; quadratic analogue over Z, `tmp/rha-bootstrap-qrh-mobius.py` Part B).** A_u(D) = Σ_{n odd squarefree}
μ(n)(u/n)W(n/D), D = 12000. The true mean square is ≈ 0.8·H·ΣW² for H far below D (0.863 at τ = 0.4, 0.824 at τ = 1);
the threshold H ≥ D belongs to the proofs, not to the truth. The square rows reproduce A₁: A₁(D) = −9.92 and
|A_{p²} − A₁| ≤ 3.9 for the 8 primes p ∈ (10, 40].

---

## 6. Attempt III (new): the Landau functionals of the audit as bootstrap levers

Overlap: [ATLAS] §10 (V7 floor; Möbius-packet energy) and the arithmetic-foundation and Suzuki modules. The atlas
records these as reductions with unproved hypotheses. What is different: here each is used as the improving step of a
bootstrap, and §6.4 shows that in each case the improved estimate is the conclusion of the step restated.

### 6.1 The levers (READ)

* (L1) **One-sided Landau** (arithmetic-foundation §2, proof read): with
  D(W) = Σ_{n<e^W} Λ(n)n^{−1/2}(W − log n) − (4e^{W/2} − 2W − 4), if D(W) ≤ C(1+W)^m e^{αW} for large W, α < 1/2, then
  ζ has no zero in Re s > 1/2 + α.
* (L2) **V7 floor** ([ATLAS] §10): if ε₀(λ) ≥ −C(1 + log λ)^m λ^p with p < 1, no zeros in Re s > (1 + p)/2. Here ε₀(λ)
  is the bottom of the even supported Weil form q_λ of the whole-even and Suzuki modules (5/4 normalisation).
* (L3) **Möbius-packet energy** ([ATLAS] §10; PR #14 report p. 5): S(L) = Σ_{d≥1} μ(d)d^{−1/2}F(L − log d)
  = Σ_{n≥2} Λ(n)n^{−1/2}k(log n − L) with the pole-cancelling packet k; ∫_j^{j+1}|S|² ≤ Ce^{(2B−1)j} implies ZF(B).
* (L4) **Suzuki reserve** (Suzuki-recurrence module §§1–4): Ψ(r) = ar + T(r) − D(r); Ψ ≥ 0 iff M_n ≥ 0 for all events;
  a finite lower bound for R_N or G_N implies RH.
* (L5) **Shells and Vaughan centering** (arithmetic-foundation §§3–4): S_h(W) = D(W + h) − 2D(W) + D(W − h)
  = Σ_n Λ(n)n^{−1/2}(h − |log n − W|)_+ − c_h e^{W/2}; shell bounds reconstruct D bounds with two extra polynomial
  powers; prime powers cost O((1+W)²); Λ = μ_{≤U}*log − μ_{≤U}*1*Λ_{≤V} + Λ_{≤V} + μ_{>U}*1*Λ_{>V}.

### 6.2 The step to be proved

**Proposition III(θ).** Assume ZF(θ) for ζ. Then for some δ = δ(θ) > 0 bounded below on compacts, one of:
(i) D(W) ≤ C(1+W)^m e^{(θ−1/2−δ)W}; (ii) ε₀(λ) ≥ −C(1 + log λ)^m λ^{2θ−1−2δ}; (iii) ∫_j^{j+1}|S|² ≤ Ce^{(2θ−1−2δ)j}.
Then (L1), (L2) or (L3) gives ZF(θ − δ), and Lemma 2.1 (for ζ) gives RH.

### 6.3 The argument

*Step III.1.* Reduce to (i) through the shells (L5): an all-real shell bound with exponent θ − 1/2 − δ gives (i).
*Step III.2.* Decompose the tent sum by Vaughan's identity with U, V = e^{εW}.
*Step III.3.* Type I pieces (μ_{≤U}*log, μ_{≤U}*1*Λ_{≤V}, Λ_{≤V}): their inner sums are smooth sums over intervals; they
give explicit main terms (from the pole at s = 1 of their Dirichlet series, with coefficients from finite Möbius sums)
plus errors O(e^{O(ε)W}). Unconditional.
*Step III.4.* Type II piece μ_{>U}*1*Λ_{>V}: bound it by C(1+W)^m e^{(θ−1/2−δ)W} after removing its explicit main terms,
using ZF(θ) and the bilinear structure.
*Step III.5.* Combine and apply (L1).

Steps III.1–III.3 are valid (they are the accepted reductions of the module). Step III.4 fails.

### 6.4 Results

**Theorem III.1 (exponent identity; PROVED from (L1) and the explicit formula).** Let α₊ := inf{α : D(W) ≤
C(1+W)^m e^{αW} for large W} and α₋ := inf{α : −D(W) ≤ C(1+W)^m e^{αW} for large W}. If Θ > 1/2 then
α₊ = α₋ = Θ − 1/2. *Proof.* (≥) For α₊ this is (L1). For α₋ run the same proof with f = P + D ≥ 0 after W₀: its Laplace
transform is R(q) + M(q) − E(q), M(q) = q^{−2}[−ζ′/ζ(q + 1/2) − 1/(q − 1/2)] is holomorphic near every positive real q
(module §1), so Landau's lemma gives abscissa ≤ α and M continues to Re q > α, whence no zeros in Re s > 1/2 + α.
(≤) If ZF(θ′) with θ′ > 1/2, the truncated explicit formula gives ψ(x) − x ≪ x^{θ′}log²x. Partial summation gives
D′(W) = 1 + x^{−1/2}(ψ(x) − x) + (1/2)∫_1^x (ψ(t) − t)t^{−3/2}dt with x = e^W, so D′(W) = 1 + O(W²e^{(θ′−1/2)W}) and
|D(W)| ≪ W + W²e^{(θ′−1/2)W}. Take θ′ ↓ Θ. ∎ In particular, for θ > 1/2 and 0 < δ ≤ θ − 1/2,
"D ≤ C(1+W)^m e^{(θ−1/2−δ)W} for some C, m" holds iff ZF(θ − δ) holds (at θ − δ = 1/2 the explicit formula gives
ψ(x) − x ≪ x^{1/2}log²x and D = O(W³)).

**Lemma III.2 (the V7 floor exponent; PROVED from accepted module identities).** If 0 ≤ p < 1 and
ε₀(λ) ≥ −C(1 + log λ)^m λ^p for all large λ, then Θ ≤ (1 + p)/2, i.e. no zeros in Re s > (1 + p)/2. (The restriction
p ≥ 0 is needed: under RH, ε₀ ≥ 0 and every floor with p < 0 holds.) *Proof.* Let W = 2 log λ and
e₀ = W^{−1/2}1_{[−W/2,W/2]}. The Suzuki module §1 gives Ψ(W) = (W/2)q_W[e₀] with Ψ(W) = aW + T(W) − D(W),
0 ≤ T ≤ T_∞. So ε₀(λ) ≤ q_W[e₀] = 2a + 2T(W)/W − 2D(W)/W. Suppose Θ > (1 + p)/2 and pick α with p/2 < α < Θ − 1/2. By
Theorem III.1 (≥), for every C′ there are arbitrarily large W with D(W) > C′(1 + W)^{m+1}e^{αW} ≥ C′(1 + W)^{m+1}λ^p
(as e^{αW} = λ^{2α} ≥ λ^p). Since (1 + W)^{m+1}/W ≥ (1 + log λ)^m, at those λ
ε₀(λ) < 2|a| + 2T_∞ − 2C′(1 + log λ)^m λ^p, which is below −C(1 + log λ)^m λ^p once C′ > C + |a| + T_∞ (recall
(1 + log λ)^m λ^p ≥ 1 for p ≥ 0): contradiction. ∎ This is the implication [ATLAS] §10 attributes to V7 `03-landau.tex`
(not available on this machine), re-derived here from the constant-box direction alone.

**Proposition III.3 (energy exponent; PROVED from (L3), READ for (L3)).** If Θ > 1/2, e_S := inf{e : ∫_j^{j+1}|S|² ≤
Ce^{ej} for large j} satisfies e_S ≥ 2Θ − 1. *Proof.* If e_S < 2Θ − 1, pick e with max(e_S, 0) < e < 2Θ − 1 and
B := (1 + e)/2 ∈ (1/2, Θ); (L3) gives ZF(B), contradicting B < Θ. ∎ (Under ZF(θ), the explicit formula with the packet transform K, K(±1/2) = 0, gives
|S(L)| ≪ e^{(θ−1/2+ε)L} when K decays like |z|^{−2} in vertical strips, so e_S = 2Θ − 1; this direction is not needed.)

**Lemma III.4 (Type II carries every zero; PROVED, EXACT checks L1–L2).** With M_U(s) = Σ_{d≤U} μ(d)d^{−s} and
L_V(s) = Σ_{n≤V} Λ(n)n^{−s}, the four Vaughan pieces have Dirichlet series −M_Uζ′, −M_UζL_V, L_V and
(1 − ζM_U)(−ζ′/ζ − L_V), summing to −ζ′/ζ. At a zero ρ of multiplicity m the Type II series has a simple pole with
residue −m (the factor 1 − ζM_U equals 1 at ρ), and the three Type I series are holomorphic at ρ. ∎ Hence, for the tent
of width h, whose transform k̂_h(z) = (2cosh(hz) − 2)/z² is entire (L3 check), the Type II part of S_h(W) contains the full
zero sum −Σ_ρ m_ρ k̂_h(ρ − 1/2)e^{(ρ−1/2)W}, and the Type I parts contain none.

**Corollary III.5 (no bootstrap through the Landau functionals; PROVED).** (i) Proposition III(θ)(i) is equivalent to
ZF(θ − δ) (Theorem III.1). (ii) Proposition III(θ)(ii) implies ZF(θ − δ) (Lemma III.2 with p = 2θ − 1 − 2δ ≥ 0); the
converse is not established here, so (ii) is at least as strong as the conclusion. (iii) Proposition III(θ)(iii) implies ZF(θ − δ)
(Proposition III.3). (L4) is (i), because Ψ = ar + T − D. So none of the levers reduces the bootstrap step to a weaker
statement; in the Landau-functional architecture F(θ) = θ for every θ.

### 6.5 Where it fails

**Exact failing line of Attempt III.** Step III.4: "bound the Type II part of S_h(W) by C(1+W)^m e^{(θ−1/2−δ)W} using
ZF(θ)". By Lemma III.4 that part contains the full zero sum; ZF(θ) bounds the zero sum by e^{(θ−1/2+ε)W}, and by Theorem
III.1 any bound with exponent θ − 1/2 − δ is equivalent to ZF(θ − δ). The input therefore returns its own exponent. The
bilinear structure supplies nothing on its own: the tent window has no oscillating phase, and the best unconditional
saving known for prime sums on [x/2, 2x] is of Vinogradov–Korobov type, exp(−c(log x)^{3/5}(log log x)^{−1/5}), with no
power of x. A power saving at every scale is a zero-free half-plane (Theorem III.1), which is the atlas's "genuine
all-scale signed arithmetic estimate" ([ATLAS], closing line), not something a half-plane input supplies.

---

## 7. Where the improvement stops

| architecture and input | stopping point | why | grade |
|---|---|---|---|
| [OAI-7/8] Part II, any θ ∈ (0.8749572, 1] | 0.8749572, after one step | dynamic κ: the internal ZF(β*) at β* ↓ σ₀ already gives σ_sc (Remark S.1); binding bin at real part ≈ 0.694 | MODEL |
| same, any high side | ≥ 13/15 | zero-blind low estimate, Lemma 15.1 range | EXACT |
| this probe family, any lemmas | ≥ 5/6 unless the Poisson row range exceeds Z¹ | cubic-theta residue (Patterson) | READ |
| [XS] via PR #14, licensed κ = 2θ − 1 | σ_sc^XS ∈ (0.874886646840, 0.874886649040), approached with ratio 0.00302 | capacity is the only θ-channel; binding bin at real part 0.7347 | EXACT bracket (conditional on [XS]) |
| [XS] with density-hypothesis counts in every bin | ≈ 0.8735 (gates) at κ ≈ 0.75; ≥ 13/15 for every κ | gates and low side | MODEL |
| [OAI-11/12] Möbius route, input row by row | 11/12; no step below | zero-blind mean square needs H ≥ D; resonant rows | EXACT |
| same, density hypothesis for the whole family | min(θ, 11/12) | resonance multiplicity H^{1/6} vs H^{2(1−σ)} | EXACT |
| same, any contracting density input | contains its own conclusion | rows u = p⁶ carry the target | EXACT |
| Landau functionals (floor, D, energy, reserve, shells) | every θ is a fixed point | exponent identity; Type II is the zero sum | PROVED |

For ζ itself (through ζ_F = ζ·L(·, χ₋₃), or directly in Attempt III), the lowest half-plane any of these bootstraps
reaches is the [XS] stopping point ≈ 0.8748866, conditional on [XS]. Without [XS] the reachable values are [OAI-7/8]'s
7/8 (Lean-checked locally for ζ) and 0.8749572 after the Part II re-tuning (MODEL).

---

## 8. The walls

**(1) Flow-blindness (`src/data/flow-blindness-no-go.js`, SL2).** SL2 rules out proofs whose hypotheses on the profile
Φ survive Φ ↦ e^{−εu²}Φ. Every architecture here consumes arithmetic that the flowed Ξ_ε lacks: Hecke Euler products of
the rows (Lemma 7.1 of [OAI-7/8]; Lemma II.0), the Gauss–Jacobi identity, Patterson's cubic theta coefficients, sextic
reciprocity; in Attempt III, Λ = μ*log and the Euler product behind the explicit formula. So none is blocked by SL2.
What the attempt shows is compatible with SL2: the places where the half-plane is used softly (Lemma II.0's
Borel–Carathéodory bound; the zero-sum bound of Type II) are exactly the places that return the input unchanged.

**(2) NS-RIGID (`src/data/imp-95530-native-span-arithmetic-input-rigidity.js`).** Attempts I, I′, II build no Hermitian
form on the twin-ladder native span; they consume Dirichlet coefficients (μ, ν, sextic symbols, Gauss sums) directly,
the loophole class the module names ("they give proportion / mean-value statements, and the pointwise upgrade is wall
(b)"). Not blocked; and the results fit the module's description: in each architecture the passage from family averages
to one L-function costs a fixed zero-blind amount (13/15 low side; 11/12 resonance), which the input does not change.
Attempt III's floor lever is a fixed-support explicit-formula form. The module's THEOREM RES-T says such forms carry
verified-height content for small support and zero-free-region content beyond; Lemma III.2 states the corresponding
fact for growth exponents, which is why that lever is the conclusion restated.

**(3) Verified-height wall.** No finite-height input is used: every margin in [OAI-7/8, Prop. 2.1] and in the [XS]
encoding is uniform in height, conductor and character; the Möbius route is uniform in D; Attempt III works with growth
exponents at all scales. The finite-support certificates of the whole-even and spectral-repair modules (λ ≤ √16.001 and
λ ≤ √16.1) are not used: a finite-support certificate fixes no exponent ([ATLAS] §9; publication-scope note). Not
blocked; the failures are unrelated to verified height.

**(4) Pointwise / MV-CAP (`src/data/route-42-formal-mv-cap-2026-10-10.js`, `formalization/paper/mv-cap-theorem.md`).**
The bootstrap's input and output are pointwise statements (every zero). The architectures reach one L-function from
family averages through pointwise devices (the principal-row signal f_η of Prop. 2.1; the sixth-power resonance), and
the thresholds of those devices are set by zero-blind estimates. The intermediate statements that bind (the row counts
R in the central bins) are family density statements, the class MV-CAP's Theorem C shows to be window-insensitive; the
half-plane input is not of that class but does not reach the binding bins (§4.5). MV-CAP is not contradicted, and the
attempt does not claim to pass it.

**Vortex trapping = RH (`research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`).** Not used; the attempt
does not pass through the heat flow.

**The atlas's open task.** [ATLAS] closes with: "a genuine all-scale signed arithmetic estimate, a cofinal actual-form
floor, or an exhaustive theta boundary/collision certificate". A half-plane input supplies none of the first two: by
Corollary III.5 the floor at exponent 2θ − 1 − 2δ and the signed Type II estimate at exponent θ − 1/2 − δ are each at
least as strong as the improved half-plane itself.

---

## 9. What a working step would need

A bootstrap of this shape needs, at each step, an estimate whose exponent improves with θ by a definite amount. In
every architecture examined the exponent-setting estimate is zero-blind or is a function of Θ:

* probe ([OAI-7/8], [XS]): a low estimate below 13/15 (a Poisson row range beyond Z¹, attempt-b §2) together with family
  counts in the central bins at real parts 0.69–0.76; neither follows from any half-plane input, and the capacity channel
  has slope 0.003 at the [XS] fixed point;
* Möbius route ([OAI-11/12]): a mean square at H = D^τ, τ < 1, proved without row-wise zero information, i.e. an
  asymptotic for the dual off-diagonal of twisted cubic-Gauss-sum sums with error below the dual diagonal;
* Landau functionals: a Type II estimate with a power saving that does not come from zero location.

So the ingredient missing at every step is a new zero-blind (or arithmetic, non-Θ) estimate, which is not a bootstrap.
The methods already have square-root cancellation on average; their loss is in the passage to one target, and a
half-plane input is weaker than square-root on average for every θ > 1/2.

---

## 10. Reproduction, checks, referee record, limits

```
.venv-arb/bin/python tmp/rha-bootstrap-qrh-exact.py     # EXACT E1–E5 (sigma_low identity, 13/15 floor, (20.10) slope, bin 79/204, -E*): 6 PASS lines (<1 s)
.venv-arb/bin/python tmp/rha-bootstrap-qrh-map.py       # MODEL: OAI paper margins, margin vs beta*, F(theta) on 10 inputs (~27 s)
.venv-arb/bin/python tmp/rha-bootstrap-qrh-map.py extra # same + R* monotonicity in c + failure census over 4000 geometries (~29 s)
.venv-arb/bin/python tmp/rha-bootstrap-qrh-mobius.py    # EXACT A1–A5 (sympy) + TOY quadratic analogue (~2 s)
.venv-arb/bin/python tmp/rha-bootstrap-qrh-xs.py        # NEW: X1 (PR #14 stages), XS map (MODEL), X2–X5 exact bracket, X3 stage 3 (~17 s)
.venv-arb/bin/python tmp/rha-bootstrap-qrh-landau.py    # NEW: L1–L3, L7 (Vaughan residue, tent transform, kappa-monotonicity), L4 density thresholds, L5 window, L6 DH-count floor (~30 s; reads the xs JSON)
.venv-arb/bin/python tmp/rha-bootstrap-qrh-xs-crosscheck.py  # NEW: C1 tangency-system fixed point (40 digits), C2 maximiser check, C3 independent sympy Farkas recomputation (~2 s; reads the xs JSON)
```

Outputs: `tmp/rha-bootstrap-qrh-{exact,map,map-extra,mobius,mobius-toy,xs,landau,xs-crosscheck}.log`, the matching
`.json` files, and `tmp/rha-bootstrap-qrh-xs.stdout`. The four revision-1 scripts were re-run today; their outputs are unchanged. One heavy
process at a time, < 1 GB. Nothing committed, nothing sent off the machine.

**Self-referee pass (same agent; not independent).**

1. *Could ZF(θ) help in Lemma 18.1 beyond the dynamic κ = 2β* − 1?* No: the paper already takes equality (Lemma I.1).
2. *Is the binding configuration Δ → 0?* Yes in (20.10) (slope −51/64) and in the model (margin monotone in β*).
3. *Could a small θ open geometries closed by the prime-supply condition?* It has slack 0.0129 at the optimum even at
   κ = 1; F was recomputed for inputs down to 13/15 with no gain.
4. *Is the low estimate zero-blind?* Prop. 15.3 is Cauchy–Schwarz between Prop. 15.2 and Lemma 15.1; no L-function or β*
   appears in Sections 5, 6, 14, 15.
5. *Does Attempt II depend on counting with multiplicity?* No (Lemma II.2 uses the explicit multiplicity; Lemma II.4 treats
   the multiplicity-counted form separately).
6. *Could an amplifier avoid the resonant rows?* Lemma II.6 gives a necessary inequality; Lemma II.7 shows sextic filters
   keep the resonant rows at eigenvalue one. Approximate amplifiers outside the sextic class are not treated.
7. *Is the improved E_p bound an independent route to contraction?* No: it only affects the second term of θ′.
8. *Is PR #14's chain really input-dependent?* Yes: the stage linkage is asserted in `verify_certificate.py`, and by
   Lemma I′.1 the smallest licensed κ is optimal.
9. *Could the κ-gate 6κℓ > 3/4 (which tightens as κ decreases) hide a gain or an obstruction?* X2–X5 use only the
   endpoint and the low side; the bracket does not depend on that gate.
10. *Is the Farkas bound valid for all b?* Yes: the b terms cancel identically (Lemma I′.2); the gates are not used.
11. *Does the bracket depend on floating point?* No: X1–X5 accept only on exact rationals (Fractions, sympy root
    counting); floating point only locates candidate points.
12. *Is Lemma III.2 circular with V7?* No: it uses the Suzuki box identity (accepted module identity, not re-proved here)
    and (L1) (proof read in the module), not the V7 source.
13. *Theorem III.1 (≤)* uses the truncated explicit formula (standard); only (≥) is needed for Corollary III.5.

**Referee status.** No independent referee was run in this task. No positive argument survives, so nothing reaches the
fresh-referee gate for a claimed result. The items to give a fresh referee are Theorem S, Lemmas I′.1–I′.2 and the
X2–X5 certificates, Lemma II.7, Lemma III.2 and Lemma III.4, together with revision 1's Lemmas I.1, II.2, II.4.

**Limits.** The [OAI-7/8] numbers rest on the exponent model, not on re-proving the manuscript at new geometries. The [XS]
results rest on the PR #14 encoding, read as faithful to [XS] (21), (28), §6.2; the [XS] text was not consulted; its
analytic inputs and closure lemma are unverified; the stage-3 certificate and the upper end of the bracket need those
inputs at κ below the range PR #14 admits. The lower end of the bracket (no gain at or below 0.874886646840) needs only
the encoding. Lemma I.1 covers the zero-aware steps listed in §2.4; a hidden use of β* inside §§17–18 of [OAI-7/8] beyond
Lemma 18.1's stated hypothesis was not searched line by line. Attempt II covers row-wise and density-form uses of the
input and the transfer step; it is not a theorem that no other use of ZF(θ) in a Möbius mean square can help. The density
thresholds of §4.5 are heuristic. Attempt III treats the five levers recorded in the audit; it is not a theorem about
every possible use of a half-plane in a signed prime estimate, only that each of these levers is the bootstrap step
restated.
