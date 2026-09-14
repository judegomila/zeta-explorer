# Sharp-weight native binding at the displaced height (t = 129/800, y = 0.1808)

**Package:** y-thaw-01775943 (candidate value 129/800 + 0.1808²/2 = 0.17759432),
a NEW candidate package citing the sealed 0.1787854 candidate as base. Sealed
material (`~/dbn-lambda-audit-review/`, gate2-evaluator copies) is read-only input.

**Grade:** prose-proof; independent referee pass 2026-09-10 (see REFEREE
RECORD below). This note proves ONE lemma — the
per-window binding of the sharp-weight floor at the displaced height — and
audits every step of the sealed binding chain for hidden uses of the
y ≥ 0.187272 monotonicity cover. It does NOT prove the all-y transfer, the
barrier/winding piece, the tail, or the criterion assembly at 0.1808; those are
listed as named obligations in §6. Changes no bound. NO QED on the package.

**Producer:** `lemma_sweep_p235711.c` (byte-identical in
`research-inputs/gate2-evaluator-inputs/` and the sealed audit repo `src/`,
SHA256 `580d0b51165da58d4ca22e16d80a8c3db603dd0d9246f26dd027b5f820bf0808`), compiled WITHOUT `-DTRIANGLE_WEIGHT`
(header line `WEIGHT SHARP`).

**Paper:** arXiv:1904.12438v2 (Polymath, "Effective approximation of heat flow
evolutions of the Riemann ξ function"), Theorem `eff` (= Theorem 1.3 form used
by `NATIVE_BINDING.md`), displays `gamma-bound`, `res-bound`, `kappa-bound`,
and the barrier-section Lemma "Improved triangle inequality".

---

## REFEREE RECORD (skeptical pass, 2026-09-10)

Full skeptical pass over the note + the sealed chain + Polymath Lemma 8.5 +
the producer source + the Lean statements + 400k randomized trials.

- **S0 SOUND and load-bearing.** The endpoint-motion proof survives
  step-by-step analysis: the u* > u₋ V-shaped regime is handled correctly;
  200k randomized trials found zero violations; no hidden side conditions.
- **S0 is the exact necessary repair.** Polymath's boundary-phase reduction
  provably does NOT port to the modulus form (dist-to-ray vs dist-to-{0}:
  0 can sit inside a disk whose boundary has large modulus), so the
  disk-interior extension cannot be borrowed from the paper.
- **Rows 1–6 region-membership ACCURATE** (§5 ledger).
- **S2 step 3 correctly breaks the circularity** a naive port would have:
  Ē ≠ 0 is derived via S1 at w = 0 BEFORE the main inequality is applied.
- Findings applied in place: O5's displaced-site shift corrected to
  1.212 × 10⁻³ (§6; §8 gives the certified bracket); §4 now states plainly
  that the amortized-Taylor scheme's validity is inherited from the sealed
  audit; **O1 restructured — route (a) (triangle Dini extension + splice)
  STRUCK**, see §6.

---

## 0. The sharp floor, defined exactly from the producer

Fix the row parameters of the sweep:

- t-box: the exact rational closed interval [129/800, 129/800 + 10⁻⁹]
  (producer arguments `tlo/thi/tden = 161250000 161250001 10⁹`; the producer
  promotes it to one outward-rounded Arb ball, so every logged enclosure is
  box-uniform in t);
- y = 0.1808 exactly (producer arguments `y2num/y2den = 12769/390625`,
  y = √(12769/390625) = 113/625);
- window N: x_N = 4π(N² − t/16) = 4πN² − πt/4, W_N = [x_N, x_{N+1});
- mollifier: mtype m ∈ {3,4,5,6} selects the real Euler mollifier
  E(s) = Σ_{d|D} λ_d d^{−s}, λ_d = Π_{p|d}(−b_p), over primes
  P = {2,3}, {2,3,5}, {2,3,5,7}, {2,3,5,7,11} respectively, D = Π_{p∈P} p,
  b_n = b_n^t = exp((t/4)ln²n).

Per-window frozen constants (producer `bound_constants` path, all evaluated at
the window's closed left endpoint x_N):

- g_N = exp(0.02y − (y/2)ln(x_N/4π))  (`gamma_at` / `modgamma`),
- σ_N = (1+y)/2 + (t/4)ln(x_N/4π) − (t/(2x_N²))(1 − 3y + 4y(1+y)/x_N²)₊
  (`sigma`; the producer certifies the sign of the inner positive-part in
  interval arithmetic per row and aborts on uncertainty),
- k_N = ty/(2(x_N − 6))  (`modK`),
- M_N = Σ_{d|D} |λ_d| d^{−σ_N}  (`modmoll`),
- C_N = Σ_{m=2}^{N} b_m (e^{k_N ln m} − 1) m^{y−σ_N}  (`corr`/g_N; the naive
  and amortized paths enclose g_N·C_N in Arb).

Truncated convolution coefficients (producer `bA0`, exact identities):

    B_{N,n} = Σ_{d|D, d|n, n≤dN} λ_d b_{n/d},
    A_{N,n} = Σ_{d|D, d|n, n≤dN} λ_d b_{n/d} (n/d)^y,      B_{N,1}=A_{N,1}=1.

**Sharp per-term weight** (the producer's plain-compile summand; the exact
per-window minimum over branches WITHOUT the triangle conservatism). With
c(g) := (1−g)/(1+g):

- naive / current-g form (mode `n`, `#else` branch):
  λ_n(g_N) := max( |B_{N,n} − g_N A_{N,n}| , c(g_N)|B_{N,n} + g_N A_{N,n}| );
- frozen three-branch sawtooth form (mode `t`, `Wcompute` `#else` branch):
  W(n;N) := max( c_e|B + g_a A| , |B − g_a A| , |B − g_e A| ),
  g_a = g(N_ref), N_ref = max(n/d_min, N_start), g_e = g(N_end),
  c_e = c(g_e).

**Sharp floor** (both modes; producer's final four operations):

    L♯_N := ( 1 − g_N − S♯_N ) / M_N − g_N C_N,
    S♯_N := Σ_{n=2}^{DN} (summand) · n^{−σ_N},

with summand λ_n(g_N) in mode `n` and W(n;N) in mode `t`. The producer logs
L12 = the floor-truncated (12-digit) LOWER Arb-ball endpoint of L♯_N; a stored
value T♯_N therefore satisfies T♯_N ≤ L♯_N with a fully certified enclosure
chain (two-sided logging is impossible at nonzero t-box width; same convention
as the sealed triangle run).

**Main Lemma (sharp native binding at y = 0.1808).** Fix N ≥ 690988 and the
row parameters above. If T♯_N > 0, then for every real t in the t-box, every
x ∈ W_N, and y = 0.1808:

    |f_t(x + iy)| ≥ T♯_N,

in the NORMALIZED ADDITIVE-ERROR UNITS of Theorem `eff`,
H_t/B_t = f_t + O_≤(e_A + e_B + e_{C,0}) — i.e. the same units as the sealed
`NATIVE_BINDING.md` floors and the error budget E_max. No Euler-factor
conversion.

---

## 1. Region membership: the pointwise inputs hold at y = 0.1808

Theorem `eff` and its bounds `gamma-bound`, `res-bound`, `kappa-bound` are
stated on the region (paper display `region`):

    0 < t ≤ 1/2,   0 ≤ y ≤ 1,   x ≥ 200.

At our parameters: t ∈ [0.16125, 0.16125 + 10⁻⁹] ⊂ (0, 1/2]; y = 0.1808 ∈
[0, 1]; x ≥ x_{690988} ≈ 6.0 × 10¹². All three bounds therefore hold POINTWISE
at (t, x, y) with y = 0.1808. **The certified y-monotonicity cover
[0.187272, 0.823104] of the sealed candidate is a property of its all-y
TRANSFER apparatus, not of these pointwise inputs; it is not consumed anywhere
in this section.**

## 2. Window freeze at y = 0.1808 (re-proved; no y-floor used)

The producer freezes g, σ, k at x = x_N for the whole window. The conservative
directions are exactly the three monotone signs of `WINDOW_FREEZE_THEOREM.md`,
whose proofs we re-check for y-dependence:

- ∂_x G = −(y/2x)·G < 0 requires only y > 0. Holds at 0.1808. Hence
  |γ(x+iy)| ≤ e^{0.02y}(x/4π)^{−y/2} ≤ g_N for all x ∈ W_N.
- ∂_x K = −ty/(2(x−6)²) < 0 requires only y > 0, x > 6. Holds. Hence
  |κ| ≤ K(x,y) ≤ k_N on W_N.
- Σ(x,y) strictly increasing in x: with h(x,y) = 1 − 3y + 4y(1+y)/x²,
  the proof uses only A(y) = 4y(1+y) ≥ 0 (so x⁻²·h₊ is a product of
  nonnegative nonincreasing factors) and the increasing log term. Requires
  only y ≥ 0. Holds. Hence Re s_*(x+iy) ≥ Σ(x,y) ≥ Σ(x_N,y) = σ_N on W_N.
  (The kink h = 0 does not occur here anyway: 1 − 3·0.1808 = 0.4576 > 0 and
  the producer certifies the inner sign per row in interval arithmetic.)

t-box uniformity: the producer's t is one Arb ball containing the exact
rational interval; inclusion isotonicity makes every downstream enclosure valid
simultaneously for every real t in the box (header argument, y-independent).

**Conclusion of §§1–2:** the frozen inputs |γ| ≤ g_N, Re s_* ≥ σ_N, |κ| ≤ k_N
are valid on W_N at y = 0.1808 with no use of the 0.187272 floor.

## 3. The sharp lemma (the new content)

The sealed `NATIVE_BINDING.md` proves the binding for the TRIANGLE summand
|B| + g|A|. The sharp summand needs the paper's "Improved triangle inequality"
mechanism, which we state and prove here in the modulus form the producer
consumes, including the disk-interior case (the paper's barrier-section lemma
is the dist-to-(−∞,0] form of the same inequality, proved there for boundary
phases with a convexity remark; we make the reduction self-contained).

**Sub-lemma S0 (radial monotonicity of the sharp ratio).** For real B, A and
0 ≤ ρ < 1 define

    m(ρ) := max( |B − ρA| / (1−ρ) , |B + ρA| / (1+ρ) ).

Then m is nondecreasing on [0, 1).

*Proof.* For ε = ±1, (B + ερA)/(1 + ερ) = A + (B − A)/(1 + ερ). If B = A then
m(ρ) = |A| is constant. If B ≠ A, write V(u) = |A + (B−A)u| = |B−A|·|u − u*|
with u* = A/(A−B) ∈ ℝ; then m(ρ) = |B−A| · max( |u₋(ρ) − u*|, |u₊(ρ) − u*| )
with u₋(ρ) = 1/(1−ρ) increasing in ρ and u₊(ρ) = 1/(1+ρ) decreasing in ρ, and
u₊ ≤ 1 ≤ u₋. As ρ grows both endpoints of [u₊, u₋] move outward, so the
distance from u* to the FARTHER endpoint is nondecreasing: if u* ∈ [u₊,u₋]
both endpoint distances are nondecreasing, hence so is their max; if u* < u₊
the max is u₋ − u* (nondecreasing); if u* > u₋ the max is u* − u₊
(nondecreasing). ∎

**Lemma S1 (sharp disk lemma).** Let 0 ≤ g < 1, let s ∈ ℂ with Re s = σ′,
let M ≥ 1, and let B_n, A_n (1 ≤ n ≤ M) be real with B_1 = A_1 = 1. Put
P = Σ_{n=1}^{M} B_n n^{−s}, Q = Σ_{n=1}^{M} A_n n^{−s}. Then for EVERY complex
w with |w| ≤ g:

    | P + w·conj(Q) |  ≥  (1 − g) − Σ_{n=2}^{M} λ_n(g) · n^{−σ′},
    λ_n(g) = max( |B_n − gA_n| , c(g)|B_n + gA_n| ).

*Proof.* Write Y := Σ_{n≥2} λ_n(g) n^{−σ′} and S(ρ) := Σ_{n≥2} m_n(ρ) n^{−σ′}
with m_n as in S0, so that λ_n(g) = (1−g)·m_n(g) and (1−g) − Y =
(1−g)(1 − S(g)).

*Case Q = 0.* Then |P + w·conj(Q)| = |P| ≥ 1 − Σ_{n≥2}|B_n|n^{−σ′}. By S0,
|B_n| = (1−0)m_n(0) ≤ m_n(g) = λ_n(g)/(1−g), so |P| ≥ 1 − Y/(1−g). If
Y ≤ 1−g this is ≥ 1 − g − Y (the inequality 1 − Y/(1−g) ≥ 1 − g − Y is
equivalent to gY/(1−g) ≤ g, i.e. Y ≤ 1−g); if Y > 1−g the claimed bound is
negative and trivially true.

*Case Q ≠ 0.* Set ρ = |w| ≤ g. The numbers w·conj(Q) and ρQ have equal
modulus, so w·conj(Q) = ρe^{iθ}Q for some real θ, and

    P + w·conj(Q) = Σ_{n=1}^{M} (B_n + ρe^{iθ}A_n) n^{−s},

the SAME phase θ for every n (this correlation is the whole point). The n = 1
term is exactly 1 + ρe^{iθ} (since B_1 = A_1 = 1 and 1^{−s} = 1). By the
triangle inequality,

    |P + ρe^{iθ}Q| ≥ |1 + ρe^{iθ}| · [ 1 − Σ_{n≥2} (|B_n + ρe^{iθ}A_n| /
                                        |1 + ρe^{iθ}|) · n^{−σ′} ].

Cosine rule: (|B + ρe^{iθ}A| / |1 + ρe^{iθ}|)² =
(B² + ρ²A² + 2ρAB cos θ) / (1 + ρ² + 2ρ cos θ), a fractional-linear function
of cos θ with no pole on [−1,1] (denominator ≥ (1−ρ)² > 0), hence monotone in
cos θ and maximized at cos θ = ±1:

    |B_n + ρe^{iθ}A_n| / |1 + ρe^{iθ}| ≤ m_n(ρ).

If 1 − S(ρ) ≥ 0: |P + ρe^{iθ}Q| ≥ |1+ρe^{iθ}|(1 − S(ρ)) ≥ (1−ρ)(1 − S(ρ)).
If 1 − S(ρ) < 0: (1−ρ)(1 − S(ρ)) < 0 ≤ |P + ρe^{iθ}Q| directly. Either way

    |P + w·conj(Q)| ≥ (1−ρ)(1 − S(ρ)).

By S0, S(ρ) ≤ S(g) (each m_n nondecreasing, weights n^{−σ′} ≥ 0). If
S(g) ≤ 1: (1−ρ)(1 − S(ρ)) ≥ (1−ρ)(1 − S(g)) ≥ (1−g)(1 − S(g)) = (1−g) − Y.
If S(g) > 1: (1−g) − Y = (1−g)(1 − S(g)) < 0 and the claim is trivial. ∎

Remarks. (i) At w on the boundary circle this is the paper's Improved Triangle
Inequality (barrier section) with dist(·,(−∞,0]) replaced by modulus; the
cosine-rule step is verbatim. (ii) S0 is what extends the bound from the
boundary circle to the full disk |w| ≤ g without a convexity appeal — needed
here because the actual multiplier γ′ below is only known to satisfy
|γ′| ≤ g_N, not |γ′| = g_N. (iii) Applied with w = 0 the lemma gives
|P| ≥ (1−g) − Y, used below to rule out E = 0.

**Lemma S2 (sharp native binding).** With the frozen inputs of §2 valid on
W_N, and Q♯_N := 1 − g_N − S♯_N computed with the mode-`n` summand λ_n(g_N):
if Q♯_N > 0 then |f_t(x+iy)| ≥ Q♯_N / M_N − g_N C_N = L♯_N throughout W_N.

*Proof.* Exactly the sealed `NATIVE_BINDING.md` chain with the triangle step
replaced by S1. Write f_t = A + γC_κ (Theorem `eff`, display `ft-def`), with
A = Σ_{n≤N} b_n n^{−s_*}, C_κ = Σ_{n≤N} n^y b_n n^{−conj(s_*)−κ}, |γ| ≤ g_N,
Re s_* ≥ σ_N, |κ| ≤ k_N on W_N (§2).

1. (κ removal) |m^{−κ} − 1| ≤ e^{|κ| ln m} − 1 ≤ m^{k_N} − 1, so
   C_κ = C_0 + O_≤(C_N′) with C_N′ = Σ_{m=2}^N m^y b_m (m^{k_N}−1) m^{−Re s_*}
   ≤ C_N (m^{−Re s_*} ≤ m^{−σ_N}; the m = 1 term vanishes). Hence
   |E||f_t| ≥ |E(A + γC_0)| − g_N |E| C_N for any complex E.

2. (Convolution, real coefficients) With E = E(s_*) the mollifier value and
   Ē := conj(E) = Σ λ_d d^{−conj(s_*)} (λ_d real): exact Dirichlet
   convolution of the TRUNCATED sums gives
   E·A = Σ_{n=1}^{DN} B_{N,n} n^{−s_*} =: P and
   Ē·C_0 = Σ_{n=1}^{DN} A_{N,n} n^{−conj(s_*)} = conj(Q),
   Q := Σ_{n=1}^{DN} A_{N,n} n^{−s_*}. (The truncation condition n ≤ dN in
   B_{N,n}, A_{N,n} is exactly what makes these identities exact; B_{N,1} =
   A_{N,1} = 1.)

3. (E ≠ 0) S1 with w = 0, g = g_N, σ′ = Re s_*, then n^{−Re s_*} ≤ n^{−σ_N}
   with λ_n ≥ 0, gives |P| ≥ 1 − g_N − S♯_N = Q♯_N > 0. Since P = E·A as a
   number, E ≠ 0.

4. (Sharp step) γ′ := γ·E/Ē satisfies |γ′| = |γ| ≤ g_N and
   E(A + γC_0) = P + γ′·conj(Q). By S1 and the exponent replacement as in
   step 3: |E(A + γC_0)| ≥ Q♯_N.

5. (Division) |E| ≤ Σ_d |λ_d| d^{−Re s_*} ≤ M_N. Since Q♯_N > 0,

       |f_t| ≥ Q♯_N/|E| − g_N C_N ≥ Q♯_N/M_N − g_N C_N = L♯_N.  ∎

**Note (g_N < 1 is certified, not assumed).** S1 requires g < 1. A stored
positive floor forces it: T♯_N > 0 implies the Arb ball of 1 − g_N − S♯_N is
strictly positive (M_N > 0, g_N C_N ≥ 0, S♯_N ≥ 0), hence g_N < 1 certified
row-by-row by the same enclosure. (Numerically g_N ≈ 0.088 here.)

## 4. The frozen three-branch weight (mode `t`) at y = 0.1808

The sweep logs the amortized sawtooth form with W(n;N), not λ_n(g_N). The
producer header's DOMINATION THEOREM gives W(n;N) ≥ max(|B − gA|, c(g)|B+gA|)
for every g ∈ [g_e, g_a], in particular g = g_N. Its proof uses only:

- g(N′) strictly decreasing in N′ at fixed real t: x_{N′} = 4πN′² − πt/4
  strictly increasing and y > 0 — holds at y = 0.1808;
- convexity of g ↦ |B − gA| (max at interval endpoints);
- c(g) decreasing and the same-sign/opposite-sign case split.

All y-independent beyond y > 0. The N_start floor argument (N ≥ N_ref for
every evaluated N) is arithmetic in N only. Hence Ssaw ≥ S♯_N(g_N) pointwise
for each real t in the box, so lsaw_N ≤ L♯_N and the logged
T♯_N ≤ lsaw_N ≤ L♯_N. Combined with S2: **T♯_N > 0 ⟹ |f_t| ≥ T♯_N on W_N.**
This proves the Main Lemma. The patch-amortized Taylor scheme (moment family
MW_k, Horner + Lagrange remainder with every stored coefficient ≥ 0, and the
corr bracket) is consumed unchanged; its validity is inherited from the
sealed audit — that audit's verification of the scheme is what certifies it
here, and this note adds no independent check — and it is per-row Arb
arithmetic, not a y-range statement. The patch half-width hw is a performance parameter
only: the remainder (|d|L)^{K+1}e^{|d|L}/(K+1)!·MW_0 is computed and added in
interval arithmetic per row, so certification does not depend on the choice
of hw.

## 5. Audit: every use of y ≥ 0.187272 in the sealed chain

| # | Step in the sealed chain | y-hypothesis | Status at y = 0.1808 |
|---|---|---|---|
| 1 | Theorem `eff` inputs (γ, Re s_*, κ bounds) | region: 0 ≤ y ≤ 1 | CLOSES (§1, pointwise) |
| 2 | Window freeze (x → x_N conservative directions) | y > 0 only | CLOSES (§2, re-proved) |
| 3 | Improved-triangle / sharp summand lemma | none (g < 1) | CLOSES (§3, S0+S1 proved; g_N < 1 certified per row) |
| 4 | Convolution + M_N division + |E|-replacement sign | Q♯_N > 0 per row | CLOSES (§3, S2; positivity is what the sweep certifies) |
| 5 | Frozen-weight domination + t-box uniformity | y > 0 only | CLOSES (§4) |
| 6 | κ-correction C_N enclosure | none | CLOSES (§3 step 1) |
| 7 | All-y transfer (Dini/y-monotonicity of the window mass) | **y ∈ [0.187272, 0.823104]** | **OPEN — obligation O1** |
| 8 | Barrier/winding slab at the rectangle bottom edge | bottom edge = sealed y-anchor | **OPEN — obligation O2** |
| 9 | Global error budget E_max (e_A+e_B+e_{C,0} over the region) | certified over y ∈ [0.187272, y_max] | **OPEN — obligation O3** |
| 10 | Analytic tail lane N > 3 840 000 | sealed at y ≥ 0.187272 | **OPEN — obligation O4** |
| 11 | Left-edge site coverage x_* = X + √(1−y²) ∈ W_690988 | evaluated at y = 0.187272 | **OPEN — obligation O5 (margin ≫ shift)** |
| 12 | Criterion assembly (Cor-3.2-analogue at y₀ = 0.1808) | y₀ enters Λ ≤ t₀ + y₀²/2 | **OPEN — obligation O6** |

Rows 1–6 constitute the binding lemma; rows 7–12 are package-level.

## 6. Named obligations (listed, NOT claimed)

- **O1 (sharp-mass y-monotonicity; RESTATED 2026-09-10 per referee).** The
  sealed Dini/y-monotonicity certificate covers
  y ∈ [0.187271994702891, 0.823103881657717]; the thaw needs the transfer
  from the new bottom edge 0.1808. Route (a) of the original ledger — extend
  the certified monotonicity down to 0.1808 by a new triangle Dini run on
  [0.1808, 0.187272] plus splice — is **STRUCK** (referee reason recorded):
  the Dini theorems themselves are y-floor-free, but the transfer runs
  upward from a bottom-edge anchor of the TRIANGLE functional, and this
  package's own sweep shows the triangle floor at 0.1808 has COLLAPSED —
  the anchor does not exist. O1 is now: prove SHARP-MASS Y-MONOTONICITY —
  y-monotonicity of the max-of-kinked-branches summand with y-dependent
  c(γ), in the same style as §3's divisor-pattern cells (B and γA live on
  the same cells, so the structure plausibly carries) — a NEW theorem + new
  producer + new certificates; cost re-scoped upward accordingly. Secondary
  note (referee): the sealed Dini certificate's worst gate has 1.4 × 10⁻⁶
  headroom at an interior rectangle (y ≈ 0.20) — not obviously
  wall-blocking for new rectangles, but no passage guarantee. The
  sharp-weight sweep at the single height y = 0.1808 does NOT certify O1.
- **O2 (barrier/winding).** The winding/slab certificate must be re-run or
  re-derived with the rectangle bottom edge at 0.1808 (sealed bottom edge:
  the old y-anchor). Follow-up compute + note.
- **O3 (error budget).** Re-certify the global E_max over
  {N ≥ 690988, x ∈ W_N, y ∈ [0.1808, y_max]} (the sealed
  E_max = 2.33494905212337849 × 10⁻⁷ was certified with y-floor 0.187272; the
  monotonicity gates in the budget derivation must be re-run with the lower
  floor). Context, not a claim: the measured sharp floors at 0.1808 are
  ≥ 0.0627 — five orders above the sealed budget's scale — so O3 is expected
  to be a re-derivation, not a margin risk.
- **O4 (tail).** The analytic tail (N > 3 840 000) must be re-closed at
  y = 0.1808; the sealed tail legs are anchored at the old y-floor.
- **O5 (site coverage).** Re-certify x_*(0.1808) = X + √(1 − 0.1808²) ∈
  W_690988: the start point moves RIGHT by √(1−0.1808²) − √(1−0.187272²)
  ≈ 1.212 × 10⁻³ (certified bracket in §8; this ledger originally quoted
  the double-precision estimate ≈ 1.208 × 10⁻³, corrected in the 2026-09-10
  referee pass) while the sealed interior margins are > 5.377 × 10⁶ (left)
  and > 1.198 × 10⁷ (right); a one-line exact-bracket recheck.
- **O6 (criterion assembly).** Instantiate the criterion theorem at
  y₀ = 0.1808, t₀ = 129/800 (y_max = √(1−2t₀) unchanged; RH-height/PT input
  unchanged since X is unchanged), assembling O1–O5 + the sweep into
  Λ ≤ 129/800 + 0.1808²/2 = 0.17759432.

What the sweep itself certifies (and only this): for every row N in
[690988, 3840000], a positive certified lower bound T♯_N for the normalized
|f_t| on W_N at (t-box, y = 0.1808) — including, per row, the g_N < 1 and
inner-sign side conditions — under OUR local compile (clang/FLINT 3.6.0
Arb-merged, macOS arm64), not the sealed toolchain.

## 7. VERDICT

**The binding lemma CLOSES for the sharp weight at (t = 129/800 box,
y = 0.1808).** Every step of the sealed `NATIVE_BINDING.md` chain re-derives
at the displaced height: the pointwise Theorem-`eff` inputs need only region
membership (§1); the window-freeze directions need only y > 0 (§2); the sharp
summand is bound by the paper's improved-triangle mechanism, completed here
with the radial-monotonicity sub-lemma S0 so the full disk |γ′| ≤ g_N is
covered (§3); the frozen three-branch domination and t-box uniformity are
y-independent (§4). No step genuinely fails. The per-row positivity input is
exactly what the stage-2 sweep certifies. Obligations O1–O6 remain open and
are NOT claimed; until they close, 0.17759432 is a candidate-package value,
not a bound. Λ ≤ 0.2 (Platt–Trudgian anchored) remains the operative SOTA.

**Stage gate: SATISFIED — stage-2 sweep authorized.**

---

## 8. O5/O3 results (appended 2026-09-10; imp-95212)

Two ledger rows of §6 close. Scripts in this directory; frozen record in
`src/data/imp-95212-ythaw-o5-o3.js`. Changes no bound; O1, O2, O4, O6 stay
open; NO QED.

### O5 (site coverage) — CLOSES

`verify_o5_site_coverage.py` re-proves both strict inequalities of the
sealed `WINDOW_FREEZE_THEOREM.md` site section at the displaced height,
with exact rational y² = 12769/390625 (y = 113/625 = 0.1808 exactly, so
1 − y² = 377856/390625 exactly), in two independent lanes (exact-rational
Machin/isqrt lane; mpmath.iv 400-bit lane) plus an Arb/FLINT 400-bit
confirmation (`verify_o5_site_arb.c`). Three-way agreement:

    x_{690988} < x_*(0.1808) < x_{690989},
    x_*(0.1808) − x_{690988} > 5 377 393.989068215737,
    x_{690989} − x_*(0.1808) > 11 989 041.173452031023.

The certified rightward start shift is bracketed in
[1.21178 × 10⁻³, 1.21179 × 10⁻³] (the §6 ledger originally quoted
≈ 1.208 × 10⁻³, a double-precision estimate corrected here and now fixed in
§6 to 1.212 × 10⁻³ per the 2026-09-10 referee pass; the 4 × 10⁻⁶ correction
is irrelevant against 5.4 × 10⁶-scale margins). Grade: certified under OUR
toolchain (Python `fractions` + mpmath 1.4.1 + local FLINT/Arb), not the
sealed toolchain. 12/12 checks pass in the exact lane, 4/4 in Arb.

### O3 (E_max budget over y ∈ [0.1808, y_max]) — CLOSES (budget re-certified)

`verify_o3_error_budget.py` is a port of the sealed Proposition 4.10
program (`prop410_proof.py`, itself line-for-line from the candidate's
`verify_finite_and_binding.py`) with exactly one mathematical change: the
point height y₀ = √(350708/10⁷) is replaced by the FULL INTERVAL HULL
y ∈ [113/625, √(271/400)], at 320 bits (sealed run: 220). By inclusion
isotonicity every certified upper endpoint is then uniform over the whole
thawed y-interval simultaneously — no monotonicity-in-y lemma is consumed
or needed, and interior-y behavior is covered automatically. All 12 sealed
domain/sign gates re-pass on the hull (the binding cases sit at the
y-floor: `G0_positive_part`, `U3a_tail_decrease`, `U3c_second_endpoint`).
Certified upper endpoints, uniform over (t-box) × (y-hull) at the worst
window N₀ = 690988:

    e_A + e_B ≤ 2.089583900245 × 10⁻¹²,
    e_C0      ≤ 2.43876578778031045 × 10⁻⁷,
    E_max′ := e_A + e_B + e_C0 ≤ 2.43878668361931290 × 10⁻⁷.

Growth vs the sealed budget: E_max′/E_max ≤ 1.044471048052. This is the
structural single-factor growth of e_C0's only y-dependence,
exp(Δy/4 · log0) = 1.0444713 (Δy = 0.187271994702891 − 0.1808,
log0 = ln(N₀² − t/16); 7-digit match). NOTE the imp-95202 figure
exp(2.5 × 10⁻⁵·L) ≈ 1.000673 quoted in the O3 planning context belongs to
the OTHER budget (the 0.00125-allowance slab of
`verify_uniform_error_01787854.c`, a 10⁻⁴ y-step from 0.1809); the E_max
budget thawed 6.472 × 10⁻³ below its sealed anchor grows by 4.447%,
certified here, and the earlier double-precision figure was never about
this quantity.

Margins: against the stage-2 sharp floor at y = 0.1808 (global min
0.062718178029 at N = 690996, §7/imp-95208),

    floor − E_max′ ≥ 0.062717934151     (ratio ≈ 2.57 × 10⁵),

and for context even the sealed TRIANGLE floor at the sealed anchor would
still clear it: 7.91366 × 10⁻⁷ − E_max′ ≥ 5.47488 × 10⁻⁷ > 0. Wherever the
sealed E_max is consumed at the displaced package, E_max′ replaces it.

x-side scope: the sealed Prop 4.10 statement covers all N ≥ N₀ from the
enclosure at N₀ because the majorants decrease in x. Those directions are
y-uniform: σ₁(N) = (1+y)/2 + (t/2)ln N − δ₁(N) increases in N for every
y ≥ 0 (so head terms shrink); x₀ appears only in denominators; log0
increases in N and multiplies −(1+y)/4 < 0 and −t/16 < 0 in e_C0; and the
cap-term decreasing direction at N₀ is literally the `U3c` endpoint gate,
which is monotone tightening in N (the −(t/2)ln N term dominates) and is
re-certified above on the full y-hull. That structure is consumed from the
sealed package, not re-proved.

Grade: certified-interval computation under OUR toolchain (mpmath.iv
directed rounding, 320 bits ≥ the 256 required), mirroring the sealed
chain line-for-line except for the y-hull substitution; not the sealed
toolchain, and no Arb duplicate was run for O3 (the sealed 96-check Arb
error certificate remains anchored at the sealed y-floor).

### Updated ledger

§5 rows 9 (O3) and 11 (O5) close as above. Open: O1 (sharp-mass
y-monotonicity on [0.1808, 0.187272]; restated 2026-09-10 — triangle-Dini
route struck, see §6 and the REFEREE RECORD), O2 (barrier/winding slab at
the 0.1808 bottom edge),
O4 (analytic tail at y = 0.1808), O6 (criterion assembly). Until they
close, 0.17759432 remains a candidate-package value, not a bound.
Λ ≤ 0.2 (Platt–Trudgian anchored) remains the operative SOTA.

Script SHA256:

    484c5bf52b75dee8a9ce4d8d3c90ae28f366af63cd549f359d80c76053d9c2db  verify_o5_site_coverage.py
    2593c38127302a3b144a77370903413b2e02a051297bc4c2660384e78d94a448  verify_o5_site_arb.c
    0e0976879ccb05fe3550fa116441f8bcd5dbeb8ef9a44f430f19a91206bea639  verify_o3_error_budget.py

## O1 forward reference (2026-09-10): the sharp-mass monotonicity job (job38, drafted)

The restated O1 theorem is drafted and queued at Aristotle
(job38_sharp_mass_monotonicity; submitter order job34 → job38 → weld PF/CC/RM).
Main theorem shape: under named gates (G1) 0 < γ_N < 1, (G2) g_N < 0, (G3) the
σ-slope ≥ 1/2 through the kink, (G4) per-n nonpositivity of BOTH branch
brackets Φ⁻ = γ|g_N A + A′| − (L/2)|B−γA| and
Φ⁺ = ċ_N|B+γA| + cγ|g_N A + A′| − (L/2)c|B+γA|, the sharp mass F♯ − γ_N is
nonincreasing in y — so Num♯ = 1 − F♯ transfers upward from a positive sharp
anchor at the bottom edge (exactly the O1 shape). Theorem 2 gives the
certifiable per-cell hull form over the 3^|P| divisor-pattern cells (sealed §3
carries verbatim). Design notes: the adverse ċ_N|B+γA| term in Φ⁺ is the
genuinely new obstruction (y-dependent c(γ) has no triangle counterpart) and
sits inside gate (G4) for per-cell certification by the new producer; no sharp
U(g)-reduction is claimed (unverified — flagged deviation from the referee
sketch), the N-quantifier absorbed into an explicit hull condition; all
constants abstract; mode-n summand only (frozen sawtooth out of scope). If
Aristotle proves L1–L4 + Theorems 1–2, O1 reduces to running the new producer
over the certified gates.
