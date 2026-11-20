# g-antibridge-cancel: bridge form, antibridge form, and what their sum and difference are

Date: 2026-11-16. Lane: the antibridge (PR 49) against the Schur target of PR 56,
in the one-sided Weil coordinates of `tmp/research-2026-11-16/eq48/`.
Nothing here proves or refutes RH. Labels: PROVED / CLASSICAL / MEASURED / OPEN.

## Verdict

**Precise obstruction, with one exact identity.**

1. The algebraic half of the hypothesis is true and is proved here: reflecting one
   field through the antibridge flips the sign of the coupling block `B`, so
   bridge + antibridge has no coupling and bridge − antibridge is the coupling alone.
2. The inferential half fails. The coupling-free symmetrized form is `2(P ⊕ P)`,
   where `P` is the one-sided Weil / log-Pick form. By eq48 its positivity is RH
   itself. The symmetrization removes `B` but leaves the whole target.
3. The coupling is identified exactly: `B = −` (Löwner divided-difference matrix of
   `L = ξ'/ξ(1/2+·)`). The two parity sectors are
   `P + B = 4 x_i x_j · (−M[s_i,s_j])` and `P − B = 4 · (sM)[s_i,s_j]`, with `s = x²`,
   `M = (d/ds) log ξ(1/2+√s)`. The Schur complement is their harmonic mean:
   `S = P − B P⁻¹ B = (P+B) P⁻¹ (P−B)`.
4. Each sector alone is RH-equivalent (Löwner's theorem). The bound needed on the
   antisymmetric part, `−P ≤ B ≤ P`, is the pair of sector statements; it is not a
   weaker side condition. The freezing obstruction of PR 49 gives no bound on `B`.
5. Measured: the relative coupling `T = P^{-1/2} B P^{-1/2}` for zeta has
   `1 − ‖T‖ ≈ 2.7e-30` on six real nodes, with eigenvalues at both ends ±1. There is
   no margin to perturb against.
6. DH control: every identity holds verbatim for Davenport–Heilbronn. No step uses
   the Euler product. On six real nodes DH passes both sectors. On a complex
   conjugate node pair next to its off-line zero both sectors go negative for DH
   and stay positive for zeta.

## 0. Plan: what is new relative to the atlas and the walls

- Atlas §2 (twin ladder and shifted bridge) records the de Branges kernel of
  `E_a(z) = ξ(1/2+a−iz)` and that positivity for every shift is an RH
  reformulation. Atlas §11 records that a uniform positive scalar margin is not the
  right target. PR 56 records that either Mellin parity sector of the theta cutoff
  operator is RH-equivalent, and that Klein folding does not change `‖T‖`.
- Not in those sources: the block form in which the second field is the antibridge
  reflection of a one-sided Weil test; the identification of that coupling block
  with the Löwner matrix of `L`; the sector factorizations in `s = x²`; the
  harmonic-mean formula for the Schur complement; the measured size of `1 − ‖T‖`.
- No closed route is re-run. The result is a reduction and a no-margin measurement,
  so the walls (DH, flow-blindness, MV-CAP, verified height) are not bypassed, and
  §5 says where each one enters.

## 1. Definitions

`F(w) = ξ(1/2+w)`: real entire, even, order one, `F(0) > 0`. `L = F'/F`, odd.
Centered zeros `ρ` (zeros of `F`), closed under `ρ → −ρ` and `ρ → conj ρ`.

**Antibridge involution.** On the torus `E_r` of PR 43/49 the functional-equation
involution is `I(w,η) = (1/w, η/w²)`, i.e. `s → 1−s`, i.e. centered `w → −w`. Its
fixed points are `p±` (spectral infinity, the bridge end) and `q±` (over `s = 1/2`,
the antibridge anchors of PR 49 §1). In the logarithmic test coordinate `t` of the
Weil form this involution is `J g(t) = g(−t)`; on Laplace transforms `G(z) → G(−z)`.
`J` fixes `t = 0` (the cutoff) and exchanges the two ends.

**Bridge field.** A one-sided exponential test (eq48, class `E`):
`v_b(t) = Σ_j b_j e^{−x_j t} 1_{t≥0}`, distinct real `x_j > 1/2`, real `b_j`
(complex coefficients change nothing below except conjugations),
`V_b(z) = Σ_j b_j/(z+x_j)`.

**Antibridge field.** `J v_c`, supported on `t ≤ 0`, transform `V_c(−z)`.

**Forms.** With `W(g) = Σ_ρ G(ρ) conj G(−conj ρ)` the Weil functional:

- Bridge block form: `Q(b,c) := W(v_b + J v_c)`.
- Antibridge block form: `Q^a(b,c) := W(v_b − J v_c)` (second field enters with the
  sign of the odd reflection).

**Consistency with the PR 43 / zeta-view finite-shift bridge kernel.**
`K^b_ij = (U_i U_j − V_i V_j)/(2π(x_i+x_j))`, `U(x) = F(x+a)`, `V(x) = F(x−a)`.
Evenness gives `U(−x) = V(x)`, so the bridge kernel between a node and an
antibridge-reflected node is the Wronskian kernel
`K^b(x_i, −x_j) = (U_i V_j − V_i U_j)/(2π(x_i − x_j))`, and
`K^b(−x_i,−x_j) = K^b(x_i,x_j)`. As `a → 0`, after the positive congruence by
`F(x_i)`, `K^b/(2a) → P/(2π)` and `K^b(x_i,−x_j)/(2a) → −B/(2π)`. (PROVED by
substitution; numerical check in §4.4.) So the block form below is the `a → 0`
limit of the finite-shift bridge kernel on the node set `{x_j} ∪ {−x_j}`.

## 2. Theorem A (exact block form). PROVED

For real coefficient vectors `b, c` on a common node set,

    Q(b,c)   = bᵀP b + cᵀP c + 2 bᵀB c,
    Q^a(b,c) = bᵀP b + cᵀP c − 2 bᵀB c,

    P_ij = (L(x_i)+L(x_j))/(x_i+x_j),
    B_ij = −(L(x_i)−L(x_j))/(x_i−x_j)  (i ≠ j),   B_ii = −L'(x_i).

*Proof.* `G = V_b(z) + V_c(−z)`. For real data `conj G(−conj ρ) = G(−ρ)`, so
`W = Σ_ρ [V_b(ρ)+V_c(−ρ)][V_b(−ρ)+V_c(ρ)]`. Using `ρ → −ρ` symmetry of the zero set,
the diagonal terms are `Σ_ρ V_b(ρ)V_b(−ρ) = bᵀPb` (eq48 Theorem 1) and the same
for `c`; the cross terms are `2 Σ_ρ V_b(ρ)V_c(ρ)`. Partial fractions:
`1/((ρ+x)(ρ+y)) = [1/(ρ+x) − 1/(ρ+y)]/(y−x)`, and `Σ_ρ 1/(x+ρ) = L(x)` (Hadamard,
symmetric summation; the difference converges absolutely). Hence
`Σ_ρ 1/((ρ+x_i)(ρ+x_j)) = −(L(x_i)−L(x_j))/(x_i−x_j)`. ∎

**Corollary A1 (the hypothesis, algebraic half). PROVED.**

    Q + Q^a = 2 (P ⊕ P)            no coupling,
    Q − Q^a = 4 bᵀB c              coupling only.

In operator form `Q = [[P,B],[B,P]]`, `Q^a = [[P,−B],[−B,P]] = Σ Q Σ` with
`Σ = 1 ⊕ (−1)`. `Q` and `Q^a` are unitarily equivalent, so each is nonnegative
exactly when the other is.

**Arithmetic side of the same statement.** `bᵀPb` pairs the primes with the
one-sided *autocorrelation* `C_v(l) = ∫ v(t+l)v(t)dt` (eq48 eq. (16)). The coupling
`bᵀBc = Σ_ρ (V_bV_c)(ρ)` is the explicit formula applied to the one-sided
*convolution* `(v_b * v_c)(l) = ∫_0^l v_b(t) v_c(l−t) dt`: its prime part is
`−Σ_n Λ(n) n^{−1/2} (v_b*v_c)(log n)`, i.e. the divided difference of `ζ'/ζ(1/2+x)`
where `P` has the symmetric sum. Correlation ↔ bridge, convolution ↔ antibridge
coupling. CLASSICAL (Weil explicit formula) once Theorem A is given.

## 3. Theorem B (sector factorization). PROVED

Let `s_i = x_i²`, `Ξ(s) = F(√s)` (entire of order 1/2), `M(s) = Ξ'(s)/Ξ(s) = L(x)/(2x)`,
`λ = −ρ²` running over the zeros `−λ` of `Ξ`. Then

    K_e := P + B = Σ_{Im ρ>0} φ_ρ(x_i) φ_ρ(x_j),      φ_ρ(x) = 2x/(x²−ρ²)
         = 4 x_i x_j Σ_λ 1/((s_i+λ)(s_j+λ)) = 4 x_i x_j · (−M[s_i,s_j]),

    K_o := P − B = Σ_{Im ρ>0} −4ρ²/((x_i²−ρ²)(x_j²−ρ²))
         = 4 Σ_λ λ/((s_i+λ)(s_j+λ)) = 4 · (sM)[s_i,s_j],

where `f[s,t]` denotes the divided difference and the sums over `λ` take each zero
of `Ξ` once (`λ ↔ ρ` with `Im ρ > 0`). `(sM)[s,t] = M(s) + t·M[s,t]` converges
although `Σ_λ s/(s+λ)` does not.

*Proof.* For `f_ρ(z) = 2z/(z²−ρ²)` (the contribution of the pair `±ρ` to `L`):
`(f(x)+f(y))/(x+y) = 1/((x+ρ)(y−ρ)) + 1/((x−ρ)(y+ρ))` (eq48 §2) and
`−(f(x)−f(y))/(x−y) = 1/((x+ρ)(y+ρ)) + 1/((x−ρ)(y−ρ))`. Adding:
`[1/(x+ρ)+1/(x−ρ)][1/(y+ρ)+1/(y−ρ)] = φ_ρ(x)φ_ρ(y)`. Subtracting:
`−[1/(x+ρ)−1/(x−ρ)][1/(y+ρ)−1/(y−ρ)] = −4ρ²/((x²−ρ²)(y²−ρ²))`. The Löwner forms
follow from `1/(s+λ)` and `s/(s+λ)` having divided differences `−1/((s+λ)(t+λ))`
and `λ/((s+λ)(t+λ))`. ∎

**What cancels.** In `P + B` the four mixed partial fractions of each zero pair
assemble into one product `φ_ρ ⊗ φ_ρ`; in `P − B` into `ψ_ρ ⊗ ψ_ρ` with
`ψ_ρ = 2iρ/(x²−ρ²)`. For an on-line zero `ρ = iγ` both are real rank-one squares:
`φ_γ = 2x/(x²+γ²)`, `ψ_γ = 2γ/(x²+γ²)`. All cross-zero and cross-node mixing is
gone; each sector is a plain sum over zeros.

**What does not cancel.** An off-line quartet `{±ρ, ±conj ρ}` contributes
`2 Re(φ_ρ ⊗ φ_ρ)` to `K_e` and `2 Re(ψ_ρ ⊗ ψ_ρ)` to `K_o`. Each is a real
symmetric rank-two form of signature (1,1). The negative direction of an off-line
quartet is present in both sectors. The parity split does not move it into one
sector, and symmetrization does not remove it.

**Corollary B1 (Schur complement). PROVED.** When `P > 0`,

    S = P − B P⁻¹ B = K_e P⁻¹ K_o = 2 (K_e⁻¹ + K_o⁻¹)⁻¹     (last form when both invertible),

since `(P+B)P⁻¹(P−B) = P − B P⁻¹ B`. With `T = P^{-1/2} B P^{-1/2}`:
`P^{-1/2} K_e P^{-1/2} = 1 + T`, `P^{-1/2} K_o P^{-1/2} = 1 − T`. So
`‖T‖ ≤ 1 ⟺ K_e ≥ 0 and K_o ≥ 0 ⟺ S ≥ 0` (given `P > 0`).

**Corollary B2 (each sector alone is RH). PROVED from CLASSICAL Löwner.**
`K_e ≥ 0` on all finite node sets in one interval `I ⊂ (1/2,∞)` ⟺ Löwner matrices
of `−M` are PSD on `I` ⟺ (Löwner's theorem) `−M` continues to a Pick function
across `I` ⟺ the meromorphic function `M` has no poles off the real axis and
positive residues ⟺ all `λ` real ⟺ every `ρ` is imaginary or real; real zeros of
`ξ` in the strip do not exist, so ⟺ RH. Same argument for `K_o` with `sM`
(requires `λ > 0`). This matches PR 56's statement for the theta cutoff operator
and atlas §2; in this coordinate it is the Laguerre–Pólya condition on `Ξ(s)`.

**Corollary B3 (RH-conditional size of the coupling). PROVED under RH.**
`K_o ⪰ γ_1² D K_e D` with `D = diag(1/x_i)`, since `λ ≥ γ_1²`. For one node,
`1 + T = K_e/P ≤ 2x²/(x²+γ_1²)`. So near the line the coupling is `B ≈ −P`:
the antibridge coupling is not small relative to the diagonal; it is nearly
maximal, and the Schur complement is the small quantity.

## 4. Computation (MEASURED)

Script `antibridge.py`, output `antibridge_results.json` (mpmath 1.3.0, 40–60
digits, single process, 5 min). `L` is computed from closed forms (`ψ`, `ζ'/ζ`,
`L'(s,χ)/L(s,χ)`), not from zeros.

### 4.1 Theorem B against 400 zeros (zeta), nodes 0.6, 0.8, 1.1, 1.5, 2.2, 3.5

| Quantity | Value |
|---|---:|
| max abs error, `P+B` vs `Σ_γ φ_γφ_γ` | 4.1e-8 (expected truncation scale 3.9e-8) |
| max abs error, `P−B` vs `Σ_γ ψ_γψ_γ` + density tail | 5.2e-6 (tail estimate 5.3e-3) |

### 4.2 Spectra, zeta, same six nodes (60 digits)

| Matrix | smallest eigenvalue | largest |
|---|---:|---:|
| `P` | 1.66e-18 | 0.275 |
| `B` | −0.273 | 3.9e-4 (indefinite) |
| `K_e = P+B` | 3.57e-34 | 3.0e-3 |
| `K_o = P−B` | 1.46e-30 | 0.548 |

Eigenvalues of `T`: −1 + 2.7e-30, −1 + 8.0e-16, −0.99995763, 0.88166725,
1 − 5.9e-10, 1 − 2.2e-22. Single node: `T(x=0.6) = −0.998844`, `T(1) = −0.996802`,
`T(5) = −0.930283`, all inside the RH bound of B3.

Both sectors are positive on this configuration, as RH below verified height
requires at this order. `‖T‖` is within 2.7e-30 of 1 with six nodes. This is the
block-form version of eq48 Theorem 4 (no margin).

### 4.3 Davenport–Heilbronn control

`f = ((1−iκ)/2)L(s,χ) + ((1+iκ)/2)L(s,conj χ)`, `χ` mod 5, `χ(2) = i`;
`ξ_D(s) = (π/5)^{−s/2} Γ((s+1)/2) f(s)`. Checked: functional equation to 2.5e-41,
`L_D` odd to 1.8e-41, off-line zero at `0.808517182456637… + 85.699348485377…i`.

Real nodes 1.2, 1.5, 1.9, 2.4, 3.0, 4.0: `P`, `K_e`, `K_o` all positive
(smallest eigenvalues 2.3e-13, 1.4e-22, 3.3e-20); `T` eigenvalues in
(−1, 1), extreme ones −1 + 2.6e-18 and 1 − 5.4e-13. At this order DH is
indistinguishable from zeta, consistent with `euler/RESULT.md`.

Complex conjugate pair `{z, conj z}`, `z = ρ_0 − 1/2 + δ`, coefficients `(b, conj b)`
(a real even or odd two-sided test; the form is `Σ_ρ G(ρ)²` resp. `−Σ_ρ G(ρ)²`,
evaluated through `L` only):

| Function, node | `b` | even sector | odd sector |
|---|---|---:|---:|
| DH, δ = 0.05 | 1 | +924.48 | **−681.21** |
| DH, δ = 0.05 | i | **−681.30** | +924.48 |
| DH, δ = 0.01 | 1 | +20643.06 | **−19363.78** |
| DH, δ = 0.01 | i | **−19363.89** | +20643.04 |
| zeta, same node, δ = 0.05 | 1 | +0.527 | +6.115 |
| zeta, same node, δ = 0.05 | i | +6.085 | +0.527 |
| zeta, `z = iγ_1 + 0.05` | 1 | +1600.01 | +0.445 |
| zeta, `z = iγ_1 + 0.05` | i | +0.097 | +1599.99 |

The DH values follow the predicted `4 Re(b²/δ²)`-type law of a (1,1) quartet term:
rotating `b` by 90° moves the negative direction from one sector to the other, so
both sectors are indefinite for DH. For zeta the same rotation moves a positive
rank-one term between sectors. (For DH the complex-node form is the analytic
continuation of the kernel; DH also has zeros with `Re s > 1`, so the one-sided
Laplace representation needs larger real parts. By B2 a real-node negative
configuration exists in every interval, at an order not reached here.)

### 4.4 Finite-shift check

`a = 1e-6`, `x = 0.7, 1.3`: Wronskian kernel 2.38996338348772e-8, bridge kernel at
the reflected node 2.38996338348772e-8, `a → 0` limit `2a F_iF_j L[x_i,x_j]`
2.38996338348762e-8.

## 5. Hypothesis test, step by step

| Step of the hypothesis | Status |
|---|---|
| Antibridge carries `B` with opposite sign | PROVED (Cor. A1), with the antibridge field defined as the odd `J`-reflection |
| Symmetrized form has no coupling | PROVED: `Q + Q^a = 2(P ⊕ P)` |
| Antisymmetrized form isolates the coupling | PROVED: `Q − Q^a = 4 bᵀBc`, `B = −L[x_i,x_j]` |
| Positivity of the symmetrized form is available | NO. It is positivity of `P`, the eq48 target, RH-equivalent |
| Freezing obstruction bounds the antisymmetric part | NO. PR 49 §4 is a negative statement about the leading tail model `M(p,q)`; it bounds nothing. The required bound is `−P ≤ B ≤ P`, which is `K_e, K_o ≥ 0`, each RH-equivalent (B2) |
| The two together give the Schur target | The implication is valid (B1) but both premises are the conclusion |

Walls:

- **DH.** Theorems A, B and all corollaries use only: `F` real entire, even, order
  ≤ 1, `F(0) ≠ 0`. No step uses `Λ(n) ≥ 0`, multiplicativity, or Hecke structure.
  The decomposition therefore cannot separate zeta from DH, and §4.3 shows it does
  not. An argument through this block form needs an Euler-product input placed on
  the convolution-side prime sum of §2; none is supplied by the geometry.
- **Flow-blindness.** Under `F_τ`, `Ξ_τ` stays even real entire of order ≤ 1, so
  the identities hold at every `τ`, including `τ < 0` where zeros are off the line.
  The identities are flow-stable, hence cannot decide the sign at `τ = 0`.
- **Verified height / finite orders.** §4.2 positivity at six nodes restates
  verified height at that order; DH passes the same test.
- **No margin.** `‖T‖ = 1 − 2.7e-30` already at six nodes; B3 shows `T → −1` in the
  dominant direction. A perturbative or small-coupling argument has no room.

## 6. What survives as usable structure

- The exact dictionary: bridge ↔ sum kernel `(L_i+L_j)/(x_i+x_j)` ↔ prime
  autocorrelation; antibridge coupling ↔ Löwner kernel `(L_i−L_j)/(x_i−x_j)` ↔
  prime one-sided convolution; parity sectors ↔ Löwner matrices of `−M` and `sM`
  in `s = x²`; Schur complement ↔ harmonic mean of the sectors.
- The Schur target of PR 56 in this coordinate is the statement that `Ξ(s)` is in
  the Laguerre–Pólya class with negative zeros. This is the classical `Ξ(√s)`
  formulation; the bridge/antibridge geometry is a presentation of it.
- OPEN and unchanged: an arithmetic input that makes `−M` operator monotone
  (equivalently `K_e ≥ 0`). The only place the Euler product can enter is the sign
  structure of `Σ Λ(n) n^{−1/2} (v*v)(log n)` against the gamma term.

No pivot was taken: the lane did not die, it closed with an exact reduction, and
the adjacent ideas (odd-sector sign, Pick orders, DH separation) belong to sibling
lanes.

## 7. Three weakest steps

1. **Identification of "the antibridge form".** PR 49 defines antibridge anchors
   (`q±` over `s = 1/2`) and states that no coupling equation is attached to them.
   The form `Q^a` here is my definition (odd reflection of the second field by the
   involution fixing those anchors). It is the definition that makes the hypothesis
   true; a different intended definition would need its own computation. The
   theta-coordinate cutoff parity of PR 56 (`u → 2c−u`) is the same kind of split
   but I did not prove an operator identity between `H_±` and `K_e, K_o`.
2. **Corollary B2 (Löwner step).** Uses Löwner's theorem on an interval and the
   uniqueness of continuation for the meromorphic `M`; the handling of possible
   real zeros and of multiplicities is sketched, not written out. The conclusion
   agrees with PR 56 and atlas §2, which is evidence, not proof.
3. **Numerics are not interval-certified.** Smallest eigenvalues 3.6e-34 at 60
   digits are resolved by about 25 digits of headroom but carry no enclosure; the
   DH complex-node witness uses the continued kernel, not a legitimate one-sided
   real-node test. Convergence conventions for `Σ_ρ` (symmetric summation) are
   taken from eq48 without re-derivation.

## Files

- `tmp/research-2026-11-16/push/g-antibridge-cancel/RESULT.md`
- `tmp/research-2026-11-16/push/g-antibridge-cancel/antibridge.py`
- `tmp/research-2026-11-16/push/g-antibridge-cancel/antibridge_results.json`
