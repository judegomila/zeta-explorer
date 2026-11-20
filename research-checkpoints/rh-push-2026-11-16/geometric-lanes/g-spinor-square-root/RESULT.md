# g-spinor-square-root: the first-order (Dirac / supersymmetric) square root of the bridge energy

Date 2026-11-16. Scope: PR 43 cutoff energy `H_c = A*Q_cA - AQ_cA*` (theta_boundary_energy.md (2.1)-(2.4)),
PR 56 parity split and Fourier kernel (operator-duality.md (1)-(5)), PR 43/PR 10 spinor and twistor notes.
Nothing here proves or refutes RH. Labels: PROVED / CLASSICAL / MEASURED / OPEN.

## Verdict

**Precise obstruction, with three exact identities.** A first-order square root `H_c = 𝔇*𝔇` exists
if and only if RH holds. Unconditionally the square root exists only in a Krein space:
`H_c = 𝔇_c^† J 𝔇_c`, where `𝔇_c` maps a test to its one-sided transforms at the zeros and `J` is the
involution `γ ↔ γ̄` on the zero set. `J = 1` iff RH. The "curvature term" of the Weitzenböck-type identity is
the anticausal Hankel block `Γ_- = Q_c C_0 P_c` of the scattering multiplier `C_0 = A*/A`. It is nonlocal,
its diagonal block is `-Γ_-*Γ_- ≤ 0`, and so it has a sign only when it is zero. The negative index of `H_c`
equals the number of zeros with `Re s > 1/2` (2 on the PR 56 polynomial-Gaussian control, 1 per spectral
window on Davenport-Heilbronn, 0 on zeta in the same window). The Euler product does not enter any of the
identities; it enters only through the explicit-formula expansion of the same form (eq48 (21)), where
`Λ(n) ≥ 0` multiplies cross-cut correlations that are themselves indefinite.

## 0. Plan and what is new relative to the atlas and walls

- Atlas (PR 27) records the de Branges kernel of `E_a(z) = ξ(1/2+a-iz)` and Suzuki's canonical-system paper;
  eq48 records target == Weil form == `Σ_ρ V(ρ) conj V(-ρ̄)`; PR 56 records that either parity sector is
  RH-equivalent (Löwner reduction). None of these is re-run.
- New here: (i) the block (Weitzenböck) identity of §2, which realises frontier (A) `Q = [[E,B*],[B,D]]`
  exactly with `D = -Γ_-*Γ_- ≤ 0`; (ii) the zero-indexed first-order square root of §3 on L² tests
  (critical-line spectral side, complementary to the real-node exponential class of eq48); (iii) the inertia
  count and its parity split, tested on the control and on DH (§5); (iv) identification of the 2-spinor
  with the Lagarias de Branges structure function `ξ + αξ'` and of the square root with Suzuki's Hankel
  operator (§4).
- Walls: every identity below holds verbatim for DH (same functional equation, even `F`). The only
  step that separates zeta from DH is "`J = 1`" (equivalently `Γ_- = 0`), which is RH itself.

## 1. Setup (PR 43 notation)

`F(z) = ξ(1/2+z) = ∫κ(u)e^{zu/2}du`, `h_± = (1 ± αu/2)κ`, `A = h_+*`, `A* = h_-*`, symbols
`D = F + αF'`, `N = F - αF'`, `C_0` = multiplier `N(it)/D(it)` (unitary), `Q_c = 1_{(c,∞)}`, `P_c = 1 - Q_c`,
`f = Aa`, `g = A*a = C_0 f`, and `⟨a,H_c a⟩ = ‖Q_c f‖² - ‖Q_c g‖²` (2.1).

2-spinor: `Ψ_a(r) = (f(r), g(r))`. Then (PROVED, restatement of (2.1))

    ⟨a,H_c a⟩ = ∫_c^∞ Ψ_a* σ_3 Ψ_a dr,      d/dc ⟨a,H_c a⟩ = |g(c)|² - |f(c)|².

The cutoff derivative is the rank-two, signature-(1,1) boundary current. This is the Lagrange identity of a
canonical system `J y' = zHy` read in position space: on exponentials `e_z(u) = e^{-zu/2}`
(`Re z, Re w > 0`; the form extends because `H_c(u,v)` decays super-exponentially)

    ⟨e_w, H_c e_z⟩ = 2 e^{-(z+w̄)c/2} [D(z) conj D(w) - N(z) conj N(w)] / (z + w̄)
                   = 4α e^{-(z+w̄)c/2} F(z) conj F(w) [L(z) + conj L(w)] / (z + w̄),   L = F'/F.   (1.1)

(PROVED: `e_z` is an eigenfunction of both convolutions, with eigenvalues `D(z)` for `A` and `N(z)` for `A*`; then integrate `e^{-(z+w̄)r/2}` over `r > c`.)
(1.1) is the de Branges kernel of the structure function `E = D = ξ + αξ'` (Lagarias's de Branges function
for `α = 1`, CLASSICAL) and at real nodes is the Pick matrix of eq48. So: **the spinor formulation
reproduces the de Branges kernel exactly; `H_c` is that kernel in the Mellin position variable.**

## 2. Weitzenböck-type block identity (PROVED)

Write `S = C_0`, `σ = Q_c - P_c`. Unitarity gives `‖Qf‖²-‖QSf‖² = ½⟨f,(σ - S*σS)f⟩`. In the splitting
`L² = ran Q_c ⊕ ran P_c` put `S_QQ = QSQ`, `Γ_+ = P S Q` (causal Hankel), `Γ_- = Q S P` (anticausal Hankel).
Using `S_QQ*S_QQ + Γ_+*Γ_+ = Q`, `Γ_-*Γ_- + S_PP*S_PP = P`, `S_QQ*Γ_- + Γ_+*S_PP = 0`:

    H_c = A* M_c A,     M_c = [[ Γ_+*Γ_+ ,  -S_QQ*Γ_- ],
                               [ -Γ_-*S_QQ , -Γ_-*Γ_- ]].                                   (2.1)

    ⟨a,H_c a⟩ = ‖Γ_+ Q f‖²  -  ‖Γ_- P f‖²  -  2 Re⟨S_QQ Q f, Γ_- P f⟩.                      (2.2)

Reading: energy = |first-order operator|² minus a "curvature" term, with `𝔇 = Γ_+ Q_c A` and curvature
`R = A*(Γ_-*Γ_- + 2Re S_QQ*Γ_-)A`.

Consequences (PROVED):
1. `ran A` is dense, so `H_c ≥ 0 ⟺ M_c ≥ 0`. The `PP` block of `M_c` is `-Γ_-*Γ_- ≤ 0`, hence
   `H_c ≥ 0 ⟺ Γ_- = 0`, and then `H_c = (Γ_+QA)*(Γ_+QA)` exactly. There is no intermediate regime and
   no margin: in frontier (A) terms the block `D` is nonpositive, so `‖D^{-1/2}BE^{-1/2}‖ ≤ 1` can only hold
   in the degenerate form `D = 0, B = 0`. This is the operator form of eq48 Theorem 4 (no `θ<1`).
2. `Γ_- = 0` says `C_0` maps `L²(-∞,c)` into itself (one-sided propagation, PR 43 §4). By
   Paley-Wiener this holds iff `N/D` is bounded analytic in `Re z > 0`; then `|N| ≤ |D|` there, i.e.
   `Re F'/F ≥ 0`; at a zero `ρ` of `F` with `Re ρ > 0` one has `N/D → -1`, so the maximum principle forces
   `N/D ≡ -1`, impossible. Hence `Γ_- = 0 ⟺ RH`, for each fixed `α > 0` and each `c`.
3. Reflection `R_c` about the cutoff satisfies `R Q R = P`, `R S R = S*`, so `Γ_-(S) = R Γ_+(S^{-1})* R`.
   The identity is a graded difference: causal Hankel energy of `S = N/D` minus causal Hankel energy of
   `S^{-1} = D/N`, plus the cross term. The Klein/reflection fold exchanges the two sectors; it does not
   change either norm (agrees with PR 56 §1).
4. CLASSICAL (Kronecker; needs `S = S_0/B` with `S_0 ∈ H^∞`, `B` a finite Blaschke product):
   `rank Γ_- = #{Re z > 0 : F + αF' = 0, not a common zero with F}`.

## 3. The zero-indexed first-order square root (PROVED from Hadamard, CLASSICAL input)

With `f(t) = F(it)`, PR 56 (5): `C(t,s) = (α/π)(f(t)f'(s) - f'(t)f(s))/(t-s)`. Since `f` is even of
order one, `-f'/f = Σ_γ 1/(γ-t)` over the zeros `γ` of `f` (symmetric pairing, multiplicity), and
`[1/(γ-t) - 1/(γ-s)]/(t-s) = 1/((γ-t)(γ-s))`, so

    C(t,s) = (α/π) Σ_γ [f(t)/(γ-t)] [f(s)/(γ-s)]       (absolutely convergent, Σ|γ|^{-2} < ∞).

Transporting to the position variable (the inverse transform of `f(t)/(γ-t)` is the incomplete integral
`∫_0^∞ κ(r-u)e^{iγr/2}dr`, which decays in both directions because `f(γ)=0`):

    y_γ(a; c) := ∫_c^∞ (κ*a)(r) e^{iγ(r-c)/2} dr,

    ⟨a, H_c a⟩ = α Σ_γ y_γ(a;c) · conj( y_{γ̄}(a;c) ).                                      (3.1)

So `H_c = 𝔇_c^† J 𝔇_c` with `(𝔇_c a)_γ = √α y_γ(a;c)` and `(Jy)_γ = y_{γ̄}`. The vector `y(c)` solves the
first-order system

    dy/dc = -(i/2) Γ y - φ(c)·𝟙,     Γ = diag(γ),  φ = κ*a,

and `Γ` is `J`-self-adjoint. Each real `γ` contributes a positive rank-one term; each non-real pair
`{γ, γ̄}` contributes a hyperbolic pair of signature (1,1).

- **Under RH:** `⟨a,H_c a⟩ = α Σ_γ |∫_c^∞ (κ*a)(r)e^{iγr/2}dr|²`. This is the honest `Q = 𝔇*𝔇`.
- **Without RH:** the square root lives in the Krein space `(ℓ²(zeros), J)`.
- (3.1) is eq48's `Σ_ρ V(ρ) conj V(-ρ̄)` extended from one-sided real exponentials to all `L²` preimages,
  so it is the same target, not a weaker one.
- `H_c ∝ α` (PR 56 (1): `H = 2(KQO - OQK)`), so the inertia is `α`-independent. Combined with 2.4 this
  gives: `#{Re z>0 : F+αF'=0}` is the same for every `α>0` and equals `#{Re z > 0 : F = 0}`
  (PROVED on the control where everything is finite; CLASSICAL Hermite-Biehler-with-index in general).

## 4. Canonical system and curvature: answers to the lane questions

1. *Does the spinor formulation reproduce the canonical system?* It reproduces the de Branges kernel of
   `E = ξ + αξ'` (§1) and the Hankel operator of `E^#/E` (§2: with the reflection, `K_c = R_cΓ_+` is a real
   self-adjoint Hankel operator on `L²(c,∞)` and `Γ_+*Γ_+ = K_c²`). Suzuki (arXiv:1204.1827, CLASSICAL, quoted
   from memory for the shifted family `ξ(1/2+ω-iz)`; hypotheses not re-audited here) builds the Hamiltonian
   `H(t) = diag(1/γ(t), γ(t))` from `det(1 ± K[t])` of exactly this type of operator. The cutoff family
   `c ↦ H_c` is NOT the de Branges chain: `H_c` is a translate of `H_0` (kernel factor `e^{-(z+w̄)c/2}` in
   (1.1)); the chain needs the truncated Hankel determinants.
2. *Does `H ≥ 0` become a curvature sign?* No. In the canonical system `H(t) ≥ 0` is automatic once the
   system exists; the content is existence for all `t`, i.e. `S^{-1}` having no causal Hankel part. In the
   Weitzenböck form (2.2) the term with a sign condition is `Γ_-`, a nonlocal operator of rank equal to the
   off-line zero count, not a multiplication operator on the torus, Klein surface or sphere. The natural
   local curvature of the weight, `V'' > 0` for `V = -log κ(√t)` (Csordas), is not sufficient: the PR 56
   control `k_0` has `V'' > 0` and negative index 2 (§5).
3. *Does the Euler product control the curvature term?* Not through these identities. They use only
   evenness and order one of `F` and hold for DH. Expanding `L = F'/F` by the explicit formula turns
   `[Q_c, 𝓛]` into the gamma boundary term minus `Σ Λ(n) n^{-1/2}` times cross-cut correlations
   `Re ∫_c^{c+2 log n} conj φ(r) φ(r - 2 log n) dr`, each indefinite; this is eq48 (21).

## 5. Numerical checks (MEASURED, mpmath 110 digits, `inertia.py`, 2.6 min)

| Object | Prediction | Measured |
|---|---|---|
| Control `k_0`: RHP zeros of `F+αF'`, α = 0.05, 0.3, 1, 4, 50 | 2 for every α (LHP 3) | 2 / 3 for all five |
| Control `k_0`: inertia of `C` on 15 nodes | (3,2) | (3,2) |
| Control `k_0`: parity split | one negative per sector per quartet | odd (1,1), even (2,1) |
| DH, window ±1, ±2, ±3 around t = 85.699348, N = 6, 10, 14 | exactly 1 negative (one pair `γ, γ̄`) | (5,1), (9,1), (13,1); negative eigenvalue is the largest in modulus (−1.0, −0.62, −0.61 normalised) |
| zeta, same nodes | 0 negative | (6,0), (10,0), (14,0) |

Observation: six critical-line spectral nodes separate DH from zeta in this window, whereas real-node Pick
matrices are DH-blind to order 100 (euler/RESULT.md). This is zero detection at verified height (Laguerre
inequality failure near the off-line zero); it is not an Euler-product mechanism.

## 6. DH control

All of §1-§3 holds for `F_DH(z) = (5/π)^{s/2}Γ((s+1)/2) f_DH(s)`, `s = 1/2+z` (even, real, order one).
For DH `J ≠ 1`, `Γ_- ≠ 0` with infinite rank, and the measured negative index is 1 per off-line pair. An
argument for zeta through this lane must prove `Γ_- = 0`, which is RH. No step uses `Λ(n) ≥ 0`,
multiplicativity or Hecke structure, so no step can fail for DH except the conclusion.

## 7. Three weakest steps

1. Inertia equality "negative index = number of off-line pairs" is proved as an upper bound by (3.1) and
   measured as equality on the control and DH window; the equality in general (linear independence of the
   zero functionals; Krein-Langer) and the Kronecker rank statement 2.4 are quoted as classical under a
   bounded-type hypothesis that was not written out for `N/D`.
2. The Suzuki identification in §4.1 is from memory of arXiv:1204.1827; the exact operator, half-line and
   hypotheses there were not re-read.
3. "No curvature sign" (§4.2) is established for the Weitzenböck form (2.2) and for the convexity candidate
   `V''`; it is not a no-go theorem for every possible geometric reformulation. Numerics are high-precision
   floating point, not interval-certified.

## Files

- `tmp/research-2026-11-16/push/g-spinor-square-root/RESULT.md`
- `tmp/research-2026-11-16/push/g-spinor-square-root/inertia.py`
