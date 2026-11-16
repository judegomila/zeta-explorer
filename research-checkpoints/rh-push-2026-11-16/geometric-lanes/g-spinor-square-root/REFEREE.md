# REFEREE: g-spinor-square-root (2026-11-16)

Verdict on the claimed "precise-obstruction": **holds, with corrections.** Every step labelled PROVED was
re-derived and confirmed. No step assumes RH. No positive result toward RH is claimed, and none is present.
Scratch scripts: /tmp/ref-spinor/dh2.py, /tmp/ref-spinor/pos.py (not part of the deliverable).

## Re-derivations (all confirmed)

- Setup against PR 43 (2.1)-(2.4) and PR 56 operator-duality (1)-(5): tests are all of L^2(R), `A e_z = D(z)e_z`,
  `A* e_z = N(z)e_z`, `N(it) = conj D(it)`, kernel sign of (5). Consistent.
- (1.1): direct integration; `D conj D - N conj N = 2α(F' conj F + F conj F')`. Correct, factor 4α correct.
  `D^# = N` (F even, real), so it is the de Branges-type kernel of `E = F + αF'`. Correct.
- (2.1)/(2.2): `Q - S*QS` in the `ran Q ⊕ ran P` splitting has blocks `Γ+*Γ+`, `-S_QQ*Γ-`, `-Γ-*Γ-`. Correct.
- Consequence 1: `ran A` dense (symbol nonzero a.e.), PP block ≤ 0, so `H_c ≥ 0 ⟺ Γ- = 0`. Correct.
- Consequence 2: `Γ- = 0 ⟺ N/D ∈ H^∞(Re z>0) ⟺ RH`. Both directions checked (Hadamard gives `Re F'/F > 0`
  in `Re z>0` under RH; conversely `N/D → -1` at any zero of F of any multiplicity, maximum principle). Correct.
- (3.1): Hadamard for even order-one `f`, divided difference, transport to position. Constant re-derived
  independently by differentiating in c: needs `Σ_γ y_γ = 2ψ(c)`, `ψ = (uκ/2)*a`, which holds. Correct, constant α correct.
- `H_c ∝ α` (PR 56 (1)). Correct.
- Not stated in RESULT but true and closes part of weak step 1: negative index of `M_c` equals `rank Γ-` exactly
  (≥ from the PP block; ≤ because the form is ≥ 0 on `{Γ- P f = 0}`).

## Independent numerics (different cases from RESULT)

1. (3.1) for the real theta kernel in position space (numpy, grid 0.002, complex non-symmetric test `a`,
   α = 2.3, c = -0.8; also α = 0.7, c = 0.3): direct `‖Q_c f‖² - ‖Q_c g‖²` = 0.0117204803; α Σ over 250 zeta zero
   pairs + analytic tail `(4α|φ(c)|²/π)(log(T/2π)+1)/T` = 0.0117210365 (rel. 4.7e-5; 100 pairs: 1.4e-4). Confirms
   (3.1) including the constant.
2. DH at a different off-line zero, 0.650830 + 114.163343i (zero re-found, |f| ~ 1e-70), 7 and 11 nodes,
   different offsets, dps 70: DH (6,1), (10,1); zeta same nodes (7,0), (11,0). DH window at t = 100 with no off-line
   zero nearby: (7,0), (11,0). The count is local zero detection, as RESULT says; nothing zeta-specific.
3. Control: RHP/LHP zeros of `F + αF'` at α = 0.003, 0.11, 7.7, 900: 2/3 each.

## Errors and corrections

1. **(3.1) is false as written for the control `k_0`** (order 2). There `f'/f = -t/8 + Σ 1/(t-γ)` and the form is
   `α Σ_γ y_γ conj(y_γ̄) + (α/2)|φ(c)|²`. Measured coefficient 0.5000000 (two parameter sets). RESULT's
   prediction (3,2) silently includes this positive Gaussian rank-one term (2 hyperbolic pairs + 1), and the
   parity split even (2,1) / odd (1,1) reflects it. §3 and §5 should say so; the control tests the inertia
   count, not (3.1) verbatim.
2. **Frontier (A) identification is an overreach.** PR 56 (README §1, klein_phase_transport §8) defines
   `Q = [[E,B*],[B,D]]` with E, D strictly positive on its own bridge splitting. RESULT's splitting is the
   cutoff splitting of f-space, where `D ≤ 0` is the trivial fact that `f` supported left of the cutoff gives
   `-‖Q S f‖²`. This does not "realise frontier (A) exactly" and does not by itself show the PR 56 target has
   no margin; block signs are splitting-dependent, only positivity of the whole form is invariant. The
   no-margin statement stands on eq48 Theorem 4, not on this block.
3. **Consequence 2.3 has a misplaced adjoint.** `R S R = S*` gives `Γ-(S) = R Γ+(S^{-1}) R`, not
   `R Γ+(S^{-1})* R` (the latter maps Q→P). Norm equality is unaffected.
4. **Domain of `y_γ`.** For `Im γ < 0` the written integral `∫_c^∞ (κ*a)(r)e^{iγ(r-c)/2}dr` diverges for general
   `a ∈ L²`; it must be read as `⟨k_γ, a⟩` with the two-sided-decaying kernel, or as `-∫_{-∞}^c`. Boundedness of
   `𝔇_c : L² → ℓ²(zeros)` without RH (needed for the phrase "Krein space (ℓ², J)") is not shown when there are
   infinitely many off-line zeros (the DH case).
5. **Labels.** Verdict paragraph states "negative index = number of zeros with Re s > 1/2" unlabelled; only
   `neg index = rank Γ-` and `neg index ≤ #pairs` (finite case) are proved, equality is quoted. "PROVED on the
   control" for α-independence is a five-value root count (MEASURED); it is provable (no zero of D on the
   axis since f, f' have no common real zero; α→0 limit), but that argument is not written. §4.3's
   explicit-formula expansion is formal (Dirichlet series on the critical line) and unlabelled.

## Content assessment

- "A first-order square root exists iff RH" is the statement `H_c ≥ 0 ⟺ RH`: any positive operator has a
  square root, so "first-order" adds only the ODE for `y(c)`. `H_c ≥ 0 ⟺ RH` is already PR 56 (Löwner
  reduction) and, via (1.1), Lagarias's Hermite-Biehler criterion for `ξ + αξ'`. The new items are the
  Hankel-block form (2.1), the position-space zero sum (3.1), and the inertia numerics.
- DH: all identities hold for DH (checked numerically at two off-line zeros). No step uses the Euler product.
  The result is correctly an obstruction, not a mechanism. No cancellation is claimed, so the
  coordinate-change test applies only to item 2 above.
- Suzuki identification remains unaudited (different structure function `ξ(1/2+ω-iz)`), as RESULT states.

## Surviving claim

(1.1), (2.1), (2.2), `H_c ≥ 0 ⟺ Γ- = 0 ⟺ RH` for each α > 0 and c, and (3.1) for even order-one F (ξ and DH)
on a dense test class, are correct. Negative index = rank Γ-. Measured: index 2 on the control (with the extra
Gaussian term), 1 per DH off-line pair in a local window, 0 for zeta. The frontier (A) sentence and the
general inertia equality are not established here.
