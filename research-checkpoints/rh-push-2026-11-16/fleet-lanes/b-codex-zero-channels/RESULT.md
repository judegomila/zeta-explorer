# Codex PR 57 (zero channels) and PR 56 (Klein / annulus / odd theta sector): audit, Weil coordinates, DH control

Date: 2026-11-16. Slug: `b-codex-zero-channels`. Scope: read-only audit of `refs/pr/57` (`d6c92b380`) and
`refs/pr/56` (`29d8f6f88`). Nothing pushed, no PR or branch touched. No RH claim, no new zero-free region, no Λ bound.
Labels: PROVED (argument given here), CLASSICAL, CERTIFIED (ball arithmetic, stated scope), MEASURED (numerics, not
interval-certified), ARGUED, OPEN.

## Verdict

**Precise obstruction.** Neither PR contains a mechanism that is not Davenport–Heilbronn-blind.

1. Every certificate in both PRs replays (section 1). No claim in either PR was found wrong.
2. PR 56's residual targets are, exactly, eq48's functional `Q_L` (Weil's functional on one-sided tests) evaluated on a
   different one-sided test class: `v = 1_[c,∞) · (κ * a)`. For the Taylor blocks, `v = 1_[0,∞) · p(D)κ` with `p` an odd
   (or even) polynomial (Theorem A, section 2; identity checked numerically against 400 zeta zeros).
3. Every hypothesis used by PR 56's proved theorems holds for the DH kernel: evenness, positivity, the Csordas-type
   convexity (CERTIFIED on `[0,1]`, tail PROVED), and analyticity. So the odd-cone theorem (G)/(H) is true verbatim
   for DH (section 3.2).
4. The certified Taylor blocks `J_1..J_4` are positive for DH too. DH stays positive definite through order
   **164 in the even sector and 169 in the odd sector**; its first negative pivot is at order **165 (even)** and
   **170 (odd)**, one negative direction in each sector (MEASURED: arb ball arithmetic; two Gauss–Legendre rules
   agree to 12 digits on every pivot through order 180; tanh–sinh agrees through order 120; zeta control positive
   through order 180 in both sectors; section 3.3). The failure is caused by the first off-line quartet
   `0.8085 ± 85.699 i`: its negative share of the block energy passes 100% exactly at those orders (section 3.4).
   So every statement PR 56 certifies (orders ≤ 4), and every block of order ≤ 164, is also true of a function with
   zeros off the line and no Euler product. An off-line quartet at height 85.7 needs about `2 × 85.7` orders to
   become visible.
5. The blocks are not coefficient-blind. They are **functional-equation rigid**: multiplying the single Dirichlet
   coefficient `a(2)` of zeta by `1 ± 10^-k` makes a block fail at order about `k + 2` (section 4, MEASURED). DH shows
   the same rigidity (`a(3)` in both directions, `a(2)` upward; `a(2)` downward does not fail below order 16). So the
   low-order blocks test evenness of the kernel (the functional equation) with tolerance shrinking about tenfold per
   order, and do not detect DH's failure of multiplicativity below order 165. This also rules out the "comparison
   kernel plus controlled remainder" continuation proposed in PR 56 unless the remainder is exact to all orders.
6. PR 57's three constructions (Rouché channel, zero-coupling Laplacian, Newton flow) use analyticity, reflection
   symmetry and computed values only. The channel test certifies a one-zero disk for DH at an on-line zero and at
   the off-line zero `0.808517 + 85.699348 i` alike (section 3.1, MEASURED). In Weil coordinates PR 57 is a
   verified-height statement confined below the second zero ordinate, and it is stable under backward heat flow by
   construction.

Since no mechanism in either PR is DH-sensitive, there was nothing to develop as a route. What was developed instead
is the measurement of the horizon: the exact order at which PR 56's ladder first separates DH from a function
satisfying its Riemann hypothesis (165 / 170), the share curve that predicts it, and the FE rigidity of the blocks
(section 4). These are obstructions, not levers.

## 0. Plan and what is new relative to the atlas and walls

Required reading done: route atlas (PR 27 `historical-routes.md`), the three 2026-11-01 syntheses, zf-campaign and
sextic-theta syntheses, `eq48/RESULT.md` + `REFEREE.md`, `pick/NEXT_STAGE.md`, `euler/RESULT.md`, fifty-routes
synthesis.

| Atlas item / wall | Overlap | What this note adds |
|---|---|---|
| Atlas §5–6 (heat collisions, theta certificates PR 17/18) | PR 57 is a further finite theta certificate | Its Weil-coordinate content and a DH control of the certificate test itself |
| Atlas §7 (finite-prime rigidity, `ε_* ≈ 1.07e-5` for the prime-2 coefficient) | Same phenomenon in another coordinate system | Rigidity measured for PR 56's Taylor blocks: tolerance about `10^-(N-2)` at order `N`, for zeta and for DH |
| Atlas §11 / eq48 (residual target = Weil on one-sided tests = RH; no margin) | Same functional | Theorem A: PR 56's cutoff operator is `Q_L` on the test class `1_[c,∞)(κ*a)`; no new target |
| `euler/RESULT.md` (DH passes real-node Pick positivity to order 100) | Same control idea | DH on PR 56's ladder (Taylor blocks at the cutoff, both parity sectors): passes to 164/169, fails at 165/170; share curve of the off-line quartet; DH check of the convexity input |
| DH wall | — | Each PR 56/57 step is checked against DH; none fails for DH below order 165. First measured DH failure on a finite-order positivity ladder in this program (the real-node Pick ladder shows none to order 100) |
| Flow-blindness | PR 57's channel is a statement on `|τ| ≤ 1/20` | Noted: a channel certificate is open in `τ`, so it is flow-stable |
| Verified height | PR 57 | Stated explicitly in eq48 coordinates (section 2.3) |

Not attempted: any proof of (21)/(3)/(4). They are RH.

## 1. Audit of claims

### PR 57 (`research/rh/zero-channels/`)

| Claim | Status after audit |
|---|---|
| Exact quartet: four moving disks, radius 1/100, `τ ∈ [-13/100, 0]`, exact rational Bernstein + Taylor–Rouché | Replayed: `valid: true`, 130 cells, 520 branch-cells, min margin 0.0204443, min clearance 0.0701095. A statement about the degree-4 polynomial `P_u`, not about theta. |
| Actual theta: one fixed disk, centre `1/2 + 14.134725141734693 i`, radius 7/20, all `τ ∈ [-1/20, 1/20]`, exactly one simple zero, on the line | Replayed with `--with-arb --self-test`: `valid: true`, margin 6.532e-5, all six tamper tests pass. Logic checked: `E + B r²/2 < A r` is Rouché against the linear part; the heat perturbation bound uses `Φ > 0` termwise; reflection gives the on-line conclusion. HOLDS. |
| Coupling network `η' = -Lη/2`, `w_ij = (γ_i - γ_j)^-2` | CLASSICAL (finite real configurations). PR states the infinite tail is not bounded. Correct scope. |
| Newton flow `F(s(ℓ)) = e^-ℓ F(s(0))` | CLASSICAL identity. PR states off-line zeros attract probes too. Correct scope. |
| "no all-height census, no global Λ bound, no RH" | Correct. |

Replay: `pr57-replay/` (files extracted from the ref; run with `python -I` in a local venv, python-flint + mpmath).

### PR 56 (`rigorous/klein-annulus-coupling-2026-11-14/`)

| Claim | Status after audit |
|---|---|
| Klein quotient preserves the normalized coupling; no margin created | Correct (congruence invariance of `‖D^-1/2 B E^-1/2‖`). A no-gain statement. |
| Annulus DtN coupling `ρ_n = sech(κ_n b)`; transfer lemma (A), low/high certificate (B) | Correct as conditional lemmas; the PR does not claim the comparison. The compactness obstruction (§6) is correct. |
| Parity reduction `[H_c, J_c] = 0`, `H_± = H_0(x,y) ± H_0(x,-y)` | Correct; uses only that `H_c(u,v)` depends on `(u-c, v-c)` symmetrically. |
| Gram majorant vanishes on the odd sector | Correct. |
| Odd-kernel entrywise positivity (G) from Csordas Thm 4.2(b); cone contraction (H) | Proof re-read; correct given strict convexity of `-log κ(√t)`. Holds equally for DH (section 3.2). |
| First odd block `J_2 ≻ 0`; `J_3`, `J_4` pivots; `det J_4 ∈ [1.40970, 1.40974]e-12` | `theta-odd-higher-jet-interval.py` replayed: same intervals. Independently recomputed here with a different method (arb balls, exact derivative polynomials, tanh–sinh): pivots 0.0217646044, 0.0040275254, 0.000325696, 0.0000493776 after the normalization change `p_PR = 32·16^-a·p_here`, `a = 1,3,5,7`. Agreement to all digits shown in the PR intervals. |
| Two-node radius 1/200 and four-node radius 1/100000 | Not re-derived (continuum remainder bounds read, not replayed). No inconsistency seen. UNCHECKED beyond reading. |
| `J_N ⪰ 0` for all `N` ⇔ odd-sector positivity ⇔ RH (and the same for the even sector) | Consistent with Theorem A below and with eq48 Theorem 3. The Löwner/Agler–McCarthy–Young and Neeb–Ólafsson inputs were not re-read. The DH run (section 3.3) is consistent with it. |
| Comparison kernel `(1+u²/10+u⁴/300)e^{-u²}` with negative odd energy `-29π/960000` | Not replayed (sympy script extracted, not run). Scope claim "convexity alone is insufficient" is consistent with section 3.2. |

Neither PR mentions Davenport–Heilbronn or the Euler product (grep of both trees: no hit).

## 2. Residual targets in the one-sided Weil coordinates of eq48

### 2.1 Notation

eq48: `F(w) = ξ(1/2+w)`, `L = F'/F`, zeros `ρ` of `F` (centered), `V(z) = ∫_0^∞ v(t) e^{-zt} dt`, and

    Q_L(v) = Σ_ρ V(ρ) conj V(-conj ρ) = W(v·1_[0,∞)) = E_gamma(v) - 2c_0‖v‖² - 2Re∫ M C_v'      (eq48 Thm 1, (16), (21))

on finite exponential sums. Target (21) is `Q_L(v) ≥ 0`.

Here: `K(u) = Φ(|u|)` (Polymath `Φ`), so `F(z) = 4∫_R K(u) e^{2zu} du`. PR 56 uses `κ(u) = K(u/4)`; the change of scale
is a diagonal congruence on every matrix below and rescales `α`. Kernel (PR 56 (C), translated to `c = 0`):

    H_0(u,v) = ∫_0^∞ (2r - u - v) K(r-u) K(r-v) dr,     ⟨a, H_0 a⟩ = ‖Q_0 A a‖² - ‖Q_0 A* a‖²  (up to the factor α).

### 2.2 Theorem A (PROVED; unconditional; holds for any even real entire `F` of order 1 with positive rapidly decaying kernel, including DH)

Let `a` be a real compactly supported distribution, `m = K * a`, `M⁺(z) = ∫_0^∞ m(s) e^{2zs} ds`. Then

    ⟨a, H_0 a⟩ = Σ_ρ M⁺(ρ) M⁺(-ρ) = Σ_ρ M⁺(ρ) conj M⁺(-conj ρ) = Q_L(v_a),      v_a(t) = ½ m(t/2), t ≥ 0,

the sum over all zeros of `F` with multiplicity, paired `ρ, -ρ`. So

    ⟨a, H_c a⟩ = Q_L( ½ (K*a)(c + ·/2) restricted to [0,∞) ) = W( 1_[c,∞) · (K * a) ).

For complex `a` the same holds with `conj` placed as in eq48 (1.7).

*Proof.* Put `n = (uK) * a`. From the definition, `⟨a, H_0 a⟩ = 2∫_0^∞ m(r) n(r) dr`. The two-sided transforms are
`M = F·â` (entire, vanishing at every `ρ`) and `N = ½ F' â = ½ L M`. With `L(z) = Σ_ρ 1/(z-ρ)` (paired Hadamard sum;
`F` even, order 1) and `1/(z-ρ) = ∫_{u<0} 2e^{-2ρu} e^{2zu} du` for `Re(z-ρ) > 0`,

    n(r) = Σ_ρ e^{-2ρr} M_r⁺(ρ),     M_r⁺(ρ) := ∫_r^∞ m(s) e^{2ρs} ds.

For `Re ρ ≥ 0` the other half-line representation gives the same value because `M(ρ) = 0`. The paired terms are
`O(|ρ|^-2)` uniformly in `r` (one integration by parts; the `1/ρ` terms cancel in pairs), so the sum converges absolutely
and can be integrated termwise against `m` (which is Schwartz with double-exponential decay). Since
`m(r) e^{-2ρr} = -d/dr M_r⁺(-ρ)`, the pair `{ρ, -ρ}` contributes

    -∫_0^∞ d/dr [ M_r⁺(ρ) M_r⁺(-ρ) ] dr = M⁺(ρ) M⁺(-ρ).

Summing over pairs gives `∫_0^∞ m n = ½ Σ_ρ M⁺(ρ)M⁺(-ρ)`. Reality of `m` gives `M⁺(-ρ) = conj M⁺(-conj ρ)`. With
`t = 2s`, `V(z) = M⁺(-z)`, and the zero set is symmetric under `ρ → -ρ`, which is eq48 (1.7). ∎

The interchange step is standard and only sketched; treat it as the weakest part of the proof (section 6). PR 56's
(16)–(17) are the RH-conditional form of the same expansion.

**Numerical check (MEASURED, `checkA.py`).** With `M_a(z) = ∫_0^∞ K^(a)(s) e^{2zs} ds` and
`T_ab = ∂_u^a ∂_v^b H_0(0,0) = ∫_0^∞ [2r K^(a)K^(b) + a K^(a-1)K^(b) + b K^(a)K^(b-1)] dr`:

| entry | direct integral | sum over first 400 zeta zeros | relative difference | expected tail |
|---|---|---|---|---|
| `T_11` | 1.088230218e-2 | 1.088218395e-2 | -1.1e-5 | ~1e-5 (terms decay like γ^-4) |
| `T_13` | -3.026738897 | -3.026715938 | -7.6e-6 | same |
| `T_33` | 860.3980172 | 860.3935592 | -5.2e-6 | same |
| `T_00` | 2.515169379e-3 | 2.382520053e-3 | -5.3e-2 | 5.3e-2 (terms decay like γ^-2; `last·T·(log(T/2π)+1)/2π` = 1.33e-4) |
| `T_02` | -2.104204231e-1 | -2.004837895e-1 | -4.7e-2 | same order |
| `T_22` | 17.97366458 | 17.22932091 | -4.1e-2 | same order |

The even-sector deficit equals the predicted tail of the zero sum to two digits; the odd sector agrees to the tail.

### 2.3 The residual targets, restated

**PR 56.**

| PR 56 target | In eq48 coordinates |
|---|---|
| (3): `J_N ⪰ 0` for all `N` (odd sector) | `Q_L(v) ≥ 0` for all `v = p(D)K` restricted to `[0,∞)`, `p` an odd real polynomial. Equivalently (21) for this class: `2c_0‖v‖² + 2Re∫ M C_v' ≤ E_gamma(v)`. |
| Even-sector analogue | Same with `p` even. |
| (4): `∫_0^∞ r|p(D)κ|² ≥ -Re∫_0^∞ conj(p(D)κ) p'(D)κ` | The same inequality written as `T[p,p] ≥ 0`; it is `Q_L(v_p) ≥ 0`. |
| `Δ_{c,-} ⪯ 0` (odd content of `Δ_c ⪯ G_c`) | `Q_L(v_a) ≥ 0` for `a` odd about `c`. |
| Bridge condition `E_KK - E_KR A_R^-1 E_RK ⪰ 0` | PR 50 (4.3); already identified in eq48 as a consequence of (21). Klein representation leaves it unchanged (PR 56's own statement). |

So PR 56 adds no new target. It changes the test class from eq48's exponential sums `Σ b_j e^{-x_j t}` (rational
`V`) to truncated derivatives of the theta kernel. Both classes give RH-equivalent positivity (PR 56 §4 and eq48
Thm 3). The identity in §2.2 is exact on each test; the passage of eq48's formula (16) (the `E_gamma`/prime split) to
the new class is by density and is ARGUED here, not re-derived.

Consequence of eq48 Theorem 4 (no margin) in these coordinates: the normalized smallest eigenvalue of `J_N` must tend
to 0. Section 4 measures the rate: about one decimal digit per order.

Where arithmetic sits: `K(u) = Σ_n n^{-1/2} φ_1(u + ½ log n)` with `φ_1` the `n = 1` theta term. `J_N` is a quadratic
form in the coefficient sequence `(a(n))`; the term `n` reaches comparable size to `n = 1` in the derivative of order
`a` once `n^{2a} e^{-π(n²-1)} ≳ 1`, i.e. `a ≳ π(n²-1)/(2 log n)`: `n = 2` at `a ≈ 7`, `n = 3` at `a ≈ 11`, `n = 5` at
`a ≈ 23`, `n = 7` at `a ≈ 39` (ARGUED; consistent with section 4: deleting `n = 5` first breaks order 16, deleting
`n = 7` does not break any order ≤ 20). The certified blocks `N ≤ 4` (derivative orders ≤ 7) involve `a(1), a(2)`
and, at relative size about 1e-4, `a(3)`. No multiplicative relation among coefficients is in range before `a(4)`.

**PR 57.** The target ("additional theta channels with uniform time coverage, disjointness, and a complete zero
count") is, at `τ = 0`, "all zeros in `|Im| ≤ T` are on the line and simple" for the certified `T`. In eq48 coordinates
this gives, for every `v = Σ b_j e^{-x_j t}` (using `|V(ρ)| ≤ Σ|b_j| / |Im ρ|`),

    Q_L(v) ≥ - 2 (Σ|b_j|)² Σ_{Im ρ > T} (Im ρ)^-2,

i.e. (21) up to an explicit additive error that vanishes only as `T → ∞` (PROVED, one line from eq48 (1.7)). This is
the verified-height wall. The present certificate isolates the first zero only and contains no zero count, so it
gives no `T` beyond what is classical below the second ordinate 21.02; `pick/NEXT_STAGE.md` already works from the
Platt–Trudgian height. Simplicity of zeros (which channels also give) is invisible to `Q_L`:
multiplicity only rescales a term. The `τ`-interval part has no Weil-coordinate content at `τ = 0`; it is an open
condition in `τ` and so falls under the flow-blindness wall.

## 3. Davenport–Heilbronn control

DH: `f = ((1-iκ)/2) L(s,χ) + ((1+iκ)/2) L(s,χ̄)`, `χ` mod 5 with `χ(2) = i`, `κ = (√(10-2√5) - 2)/(√5 - 1)`; real
coefficients `a(n) = (1, κ, -κ, -1, 0)` mod 5; `Λ(s) = (5/π)^{s/2} Γ((s+1)/2) f(s) = Λ(1-s)`. Kernel:

    K_DH(u) = e^{3u} θ(e^{4u}),   θ(x) = Σ_n n a(n) e^{-π n² x/5},   ∫_R K_DH(u) e^{2zu} du = (√(5/π)/4) Λ_DH(1/2+z).

MEASURED (`dhkernel.py`): `K_DH` is even to 1e-37; `∫ K_DH e^{2zu} du / Λ_DH(1/2+z) = √(5/π)/4` to 15 digits at two
points; `K_DH > 0` on a 301-point grid of `[0, 1.5]`. `a(4) = -1 ≠ a(2)² = κ² ≈ 0.081`, so multiplicativity already
fails at `n = 4`.

### 3.1 PR 57 on DH (MEASURED, `dh_channel.py`, mpmath 30 digits, sampled sup with 5% pad)

| Disk | `E` | `A` | `B` | margin `Ar - E - Br²/2` | test |
|---|---|---|---|---|---|
| on-line zero `1/2 + 5.09415984457 i`, `r = 0.2` | 6.5e-15 | 1.31483 | 0.3197 | 0.2566 | one zero |
| off-line zero `0.808517182457 + 85.6993484854 i`, `r = 0.1` | 2.8e-11 | 1.25575 | 0.1360 | 0.1249 | one zero; disk is 0.2085 away from the line |

The Taylor–Rouché channel test passes at an off-line zero. The step that puts the zero on the line is "the disk is
symmetric about the line and holds exactly one zero"; that step uses reflection symmetry only and works for DH's on-line
zeros. Nothing in the certificate excludes zeros outside the certified disks, for zeta or for DH. The coupling
Laplacian is a statement about any finite real configuration. The Newton identity holds for any analytic function.
No step of PR 57 uses `Λ(n) ≥ 0`, multiplicativity or Hecke structure.

### 3.2 PR 56's convexity input holds for DH (CERTIFIED on `[0,1]`, PROVED tail)

Let `l = log K`. `V(t) = -log K(√t)` is strictly convex on `t > 0` iff `R(u) = l'(u) - u l''(u) > 0` on `u > 0`, and
`R(u) = -∫_0^u s l'''(s) ds`. So `l''' < 0` on `(0,∞)` suffices.

* `convex.py` (python-flint arb, 400 bits, Taylor model of order 10 on each panel with the remainder taken from a ball
  enclosure over the whole panel, adaptive bisection): `l'''' < 0` on `[0, 1/20]` and `l''' < 0` on `[1/20, 1]` for
  `K_DH` (208 panels, `sup l'''' ≤ -505.79`, `sup l''' ≤ -28.26`) and, as a control, for zeta's `Φ` (542 panels,
  `-2160.15`, `-119.00`). The theta series is truncated at `n < 40`; the omitted terms are below `2^-400` relative and
  are not enclosed (the one non-rigorous point).
* Tail `u ≥ 1` (PROVED): `K_DH = k_1 (1+ε)` with `k_1 = w³ e^{-(π/5) w⁴}`, `w = e^u`, and on the disc `|z-u| ≤ 1/10`,
  `|ε(z)| ≤ 2 exp(-(3π/5)·0.617·e^{4u}) ≤ e^{-63}`. Cauchy gives `|(log(1+ε))'''| ≤ 12000·e^{-63}`, while
  `(log k_1)''' = -(64π/5) e^{4u} ≤ -2195`.

Hence PR 56's Theorem (G) and the cone contraction (H) hold for `Λ_DH` with the same proof. The Csordas input is not
zeta-specific. (PR 56 already shows convexity alone cannot give full positivity; this shows the convexity theorem
itself cannot distinguish zeta from a function violating its Riemann hypothesis.)

### 3.3 Taylor blocks of DH (MEASURED)

Codes: `jn.py` (exact derivative polynomials, tanh–sinh), `jn2.py`/`jn3.py` (arb power series, tanh–sinh),
`jn4.py` (arb power series, composite Gauss–Legendre). All use python-flint arb balls; a sign is recorded only when
the pivot ball excludes 0 (no unresolved pivot occurred). Quadrature discretization is not enclosed; it is controlled
by agreement between rules. Motherbox, 8 cores. `S_ab = T_ab/(a! b!)`, LDL pivots in the order `a = 1,3,5,…`
(odd) or `a = 0,2,4,…` (even).

| Function | orders | arithmetic / quadrature | result |
|---|---|---|---|
| zeta | `N ≤ 4` | tanh–sinh levels 4–9 | pivots match PR 56's certified intervals |
| zeta | `N ≤ 24` | 1700 bits, tanh–sinh levels 7 and 8 (12-digit agreement) | all positive, both sectors |
| zeta | `N ≤ 60` | 3200 bits, tanh–sinh level 8 | all positive, both sectors |
| zeta | `N ≤ 180` | 3000 bits, GL 12×240 (one rule only) | all 180 + 180 pivots positive |
| DH | `N ≤ 30` | 1200–1600 bits, tanh–sinh levels 7, 8, 9, 10 (12-digit agreement) | all positive |
| DH | `N ≤ 120` | tanh–sinh level 10 (2400 bits) = GL 12×120 = GL 12×160 = GL 12×240, 12-digit agreement on all 240 pivots | all positive |
| DH | `N ≤ 200` | 3000 bits, GL 12×240 (2880 nodes) | **odd: one negative pivot, at order 170. even: one negative pivot, at order 165.** All other pivots positive |
| DH | `N ≤ 180` | 3000 bits, GL 16×220 (3520 nodes, different panels) | identical: negatives at 170 (odd) and 165 (even); every pivot agrees with the 12×240 run to 12 digits |

Pivots at the sign change (GL 12×240): odd `…, 3.110e201, 3.048e202, -5.432e203, 7.424e205`; even
`…, 6.515e194, 7.060e195, -7.073e196, 2.181e199`. Relative ball radii there are below `2^-940`; the working
precision loses about 9 bits per order.

Quadrature notes. Tanh–sinh level `L` is accurate only up to an order that doubles with the level: level 8 agrees
with level 9 to 12 digits up to order 48 and then drifts (it produces spurious negative pivots from order 93);
level 9 agrees with level 10 up to order 104 (relative difference 1.7e-4 at order 120). GL with 90 nodes per panel is
accurate to order 101, with 120 nodes to at least order 120. The reported sign changes are at `nper/N ≥ 1.2`, with
two different panelizations agreeing. An earlier draft of this note relied on level 8 at order 60; that pivot is
5% off (sign unaffected).

By Sylvester's inertia theorem the leading blocks have exactly one negative eigenvalue from order 165 (even) and 170
(odd) through the measured range. In PR 56's indexing: `J_N^{DH} ≻ 0` for `N ≤ 169` and `J_170^{DH}` is indefinite
(odd sector, odd polynomials of degree ≤ 339); the even-sector block is positive for degree ≤ 326 and indefinite at
degree 328.

PR 56's equivalence (3) uses only: `F` even, real, entire of order 1; `K > 0`; analyticity of the kernel in a strip.
All hold for DH, and DH has zeros off the line, so a failure at some finite order was forced. The measurement locates
it.

### 3.4 The off-line quartet's share of the block energy (MEASURED; identity PROVED from Theorem A)

By Theorem A, `S = Σ_ρ m(ρ) m(-ρ)^T` with `m_a(ρ) = M_a⁺(ρ)/a!`. For the quartet `{±ρ_0, ±conj ρ_0}`,
`ρ_0 = 0.308517… + 85.699348… i` (centered), and a parity sector, `M_a⁺(-ρ_0) = ±M_a⁺(ρ_0)` (because the two-sided
transform vanishes at `ρ_0` and `K^(a)` has parity `(-1)^a`). So the quartet contributes

    Q_off(p) = ± 4 Re[ M_p⁺(ρ_0)² ]        (+ in the odd sector, - in the even sector),

a rank-2 form with one negative direction. Write `S = S_rest + Q_off` and let `φ_min(N)` be the smallest eigenvalue of
`S_rest^-1 Q_off` on the order-`N` block: `-φ_min` is the largest fraction of the remaining energy that the quartet can
cancel with a test of order `N`. `φ_min` is nonincreasing in `N`, and the block is indefinite exactly when
`φ_min < -1` (as long as `S_rest ≻ 0`). It is computed from the same LDL factorization (`jn3.py`, `jn4.py`, `phi.py`;
`ρ_0` to 780 digits by Newton in arb, `rho0.py`).

| `N` | `φ_min` odd | `φ_min` even |
|---|---|---|
| 8 | -1.2e-11 | -4.1e-10 |
| 16 | -1.5e-7 | -5.8e-8 |
| 18 | -5.8e-5 | -1.5e-5 |
| 20 | -0.0024 | -0.0014 |
| 24 | -0.018 | -0.019 |
| 32 | -0.040 | -0.038 |
| 48 | -0.080 | -0.074 |
| 64 | -0.131 | -0.121 |
| 80 | -0.178 | -0.185 |
| 96 | -0.236 | -0.226 |
| 112 | -0.283 | -0.283 |
| 120 | -0.309 | -0.312 |
| 136 | -0.387 | -0.390 |
| 152 | -0.513 | -0.440 |
| 160 | -0.657 | -0.626 |
| 164 | -0.677 | -0.917 |
| 165 | -0.699 | (block indefinite) |
| 169 | -0.921 | — |
| 170 | (block indefinite) | — |

Reading:

* For `N ≤ 16` the quartet at height 85.7 is invisible (share below 1e-7): the blocks PR 56 certifies cannot
  register it, for a quantitative reason.
* The share switches on between `N = 17` and `N = 24` (from 3e-6 to 2%), grows roughly linearly (about 0.3% per
  order) to 31% at `N = 120`, then accelerates and reaches 100% at 165 / 170. The crossing of `-1` coincides with
  the first negative pivot in each sector, which is consistent with the first quartet alone accounting for the
  failure; the higher DH quartets (heights 114.2, 166.5, 176.7 by the literature; not recomputed) sit in `S_rest`.
* Horizon: one data point, `N_fail / height ≈ 1.9–2.0` for an off-line displacement `δ = 0.31`. If that ratio is
  typical (ARGUED, not measured elsewhere), a block of order `N` carries no information about zeros above height
  about `N/2`, and all blocks of order below about twice the verified height are consequences of the verified
  height. This is the verified-height wall in PR 56's coordinates.

## 4. Adjacent finding: the Taylor blocks are functional-equation rigid (MEASURED)

Replace one coefficient `a(n)` by `λ·a(n)` in the theta series (this breaks evenness of `K`; the block formula `T_ab`
uses `K` on `r ≥ 0` only, so it remains defined). First order at which the LDL pivot is negative (`jn.py`, `N ≤ 16`,
1200 bits; `rigidity.out`):

| `λ - 1` | zeta `a(2)` odd / even | zeta `a(3)` odd / even | DH `a(2)` odd / even | DH `a(3)` odd / even |
|---|---|---|---|---|
| `+1e-1` | 3 / 3 | 6 / 6 | 4 / 4 | 9 / 10 |
| `-1e-1` | 3 / 4 | 6 / 7 | >16 / >16 | 4 / 5 |
| `+1e-2` | 3 / 4 | 6 / 7 | 6 / 6 | 12 / 13 |
| `-1e-2` | 4 / 5 | 7 / 8 | >16 / >16 | 6 / 7 |
| `+1e-3` | 4 / 5 | 7 / 8 | 8 / 8 | 15 / 16 |
| `-1e-3` | 5 / 6 | 8 / 9 | >16 / >16 | 8 / 9 |
| `+1e-4` | 5 / 5 | 8 / 9 | 10 / 11 | >16 / >16 |
| `-1e-4` | 6 / 7 | 9 / 10 | >16 / >16 | 11 / 11 |
| `+1e-5` | 6 / 6 | 9 / 9 | 12 / 14 | >16 / >16 |
| `-1e-5` | 8 / 8 | 10 / 11 | >16 / >16 | 13 / 14 |
| `+1e-6` | 7 / 7 | 10 / 11 | 16 / 16 | >16 / >16 |
| `-1e-6` | 9 / 9 | 11 / 12 | >16 / >16 | >16 / >16 |
| `+1e-8` | 9 / 9 | 12 / 13 | >16 / >16 | >16 / >16 |
| `-1e-8` | 11 / 12 | 14 / 14 | >16 / >16 | >16 / >16 |

Further single runs (`N ≤ 20`, zeta): `a(2) → 0` fails at order 3 (odd) and 4 (even); the `n = 1` term alone (pure
gamma-factor kernel) fails at order 3; `a(5) → 0` first fails at order 16; `a(7) → 0` passes to order 20.

Reading:

* The certified `J_3`, `J_4` positivity is not a property of the archimedean kernel: it is false for the `n = 1` term
  alone and false if `a(2)` is off by 1%. It needs the exact balance between `n = 1` and `n = 2` that the functional
  equation enforces.
* The admissible relative error of `a(2)` at order `N` is about `10^-(N-2)` for zeta. By Hamburger's theorem the
  functional equation determines zeta among Dirichlet series with this gamma factor, so there is no FE-preserving
  coefficient perturbation in conductor 1. In conductor 5 the FE-preserving, non-multiplicative choice is DH, and it
  passes (section 3.3).
* So the ladder is FE-rigid at low order and Euler-blind up to order 164. It separates "has the functional equation"
  from "does not" within a few orders and to high accuracy; it separates DH from a function obeying its Riemann
  hypothesis only at order 165.
* Consequence for PR 56's proposed continuation ("transfer the positive factorization of `exp(-au⁴-bu²)` to theta with
  a controlled remainder"): a remainder that is small in any fixed norm cannot work beyond a fixed order, because
  the positivity cone has inradius about `10^-(N-2)` around the true kernel in the `a(2)` direction. A proof must be
  exact in the functional equation at every order. This matches eq48 Theorem 4 (no margin) and atlas §7.

It gives an obstruction, not a mechanism: FE-exactness is shared by DH.

Level check: the scans use tanh–sinh level 7 at `N ≤ 16–20`; levels 7 and 8 agree to 12 digits for zeta at `N ≤ 24`
and for DH at `N ≤ 30`.

## 5. Which step would have to use the Euler product

None of the steps in either PR does. In PR 56's coordinates the open step is the Schur inequality
`c_N - b_N^* J_N^-1 b_N > 0` for all `N`. For DH this inequality holds for `N ≤ 169` (odd sector) and fails at
`N = 170`. A proof for zeta must therefore use, at the Schur step of some order, a property of the coefficient
sequence that DH lacks, inside a quadratic form in `(a(n))` whose low-order part is already pinned by the
functional equation. At order `N` the dominant theta terms are `n ≈ sqrt(4N/c)` (`c = π` for zeta, `π/5` for DH):
about `n ≈ 15` for zeta at `N = 170`, so the property has to act on the joint structure of many coefficients, not
on the first few. In eq48
coordinates this is the prime sum `Σ Λ(n) n^{-1/2} Re C_v(log n)` in (21) for `v = p(D)K|_[0,∞)`, with `deg p → ∞`.
No candidate for that property is produced here (OPEN).

## 6. Three weakest steps

1. **Quadrature discretization in sections 3.3, 3.4 and 4 is not enclosed.** Rounding is tracked by arb balls; the
   quadrature error is controlled only by agreement between rules (two Gauss–Legendre panelizations to order 180;
   tanh–sinh level 10 and three GL rules to order 120). Tanh–sinh at too low a level does produce spurious negative
   pivots (level 8 from order 93), so the sign changes at 165 / 170 rest on the GL agreement and on the share curve
   reaching `-1` at the same orders. They are MEASURED, not certified. The theta-series truncation is chosen with the
   derivative amplification `n^{2a}` taken into account, but is likewise not enclosed. The zeta control at order 180
   uses a single GL rule.
2. **Theorem A's termwise integration.** The interchange of the zero sum with the `r`-integral is sketched (paired
   `O(|ρ|^-2)` bound, Schwartz `m`). It is supported by the 400-zero check (odd sector to 1e-5 = predicted tail; even
   sector to the predicted `γ^-2` tail) and by PR 56's independent Fourier-side formulas (16)–(17) under RH, but a
   referee should redo the boundary case `Re ρ = 0` and the uniformity in `r` near 0. The identification with eq48's
   split (16) (`E_gamma` minus prime terms) on the new test class is by density and is only ARGUED.
3. **"PR 56's equivalence applies to DH."** I checked its stated hypotheses for `K_DH` (even, positive on a grid,
   analytic strip, order 1) but did not re-read the two external theorems it uses (Agler–McCarthy–Young Thm 1.5;
   Neeb–Ólafsson Thm A.1), and `K_DH > 0` on all of `R` is measured on `[0,1.5]` and argued beyond. If the equivalence
   needed a hypothesis DH lacks, the statement "DH must fail at some finite order" would lose its proof, though
   Theorem A plus eq48 Prop. 5-type interpolation gives the same conclusion by another route (not carried out here).

Also unverified: PR 56's two-node and four-node continuum radii (read only), and the comparison-kernel witness (not
replayed).

## 7. Files

All under `tmp/research-2026-11-16/push/b-codex-zero-channels/`:

* `jn.py`, `jn2.py` — Taylor blocks (two implementations, tanh–sinh); `MULT=n:λ` in `jn.py` perturbs a coefficient.
* `jn3.py`, `jn4.py`, `phi.py`, `rho0.py`, `rho0.txt` — blocks with the off-line-quartet share (tanh–sinh / Gauss–Legendre), eigenvalue post-processing, high-precision DH zero.
* `checkA.py`, `checkA.out` — Theorem A against 400 zeta zeros.
* `dhkernel.py`, `dhkernel.out` — DH kernel evenness, normalization, positivity, sampled convexity.
* `convex.py`, `convex.out` — ball-arithmetic convexity certificate on `[0,1]` (DH and zeta).
* `dh_channel.py`, `dh_channel.out` — Taylor–Rouché disk test on DH zeros.
* `rigidity.sh`, `rigidity.out` — coefficient rigidity scan.
* `pr57-replay/`, `pr56-replay/` — files extracted from the PR refs and replayed.
* `results/` — JSON outputs and logs copied from the motherbox (`~/rh-push/b-codex-zero-channels/`); `results/phi_table.txt` is the full share table.
* `venv/` — local python-flint + mpmath + numpy environment used for the local runs.
