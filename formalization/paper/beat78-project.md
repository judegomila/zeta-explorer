# Beating 7/8 with project inputs: is there zeta-specific structure the Hecke argument does not use?

**Internal analysis, 2026-10-08. Not submitted, not refereed.** Scope: one angle of the "beat 7/8" campaign. Question:
does anything in this repository (Weil positivity / Toeplitz–Krein certificates, Euler detection, mollifier and
proportion work, the Alpöge–Furman reproduction, MV-CAP, NS-RIGID, verified height, explicit zero-free regions, the
Lean infrastructure, the openai/math Lean library) give an input that lowers the zero-free abscissa for ζ alone, or
for ζ above height 3·10¹², below 7/8?

Answer: **no.** This note gives the exact reasons. It proves no new zero-free region. Grades used: EXACT (re-derived
from formulas displayed in the 7/8 manuscript, checked with sympy), PROVED (elementary, written here), MEASURED,
HEURISTIC, HYPOTHETICAL (a computation that assumes an input nobody has). RH is open; PT Λ ≤ 0.2 stands; the 7/8
half-plane (openai/math family 003) is a Lean-formalised but unrefereed external claim.

Sources: 7/8 manuscript (30 Sep 2026) at `/tmp/qrh-verify/paper.txt`; 11/12 write-up (5 Oct 2026) at
`/tmp/qrh-verify/paper2.txt`; Lean library at `/tmp/qrh-verify/lean` (namespace `OAI.SevenEighths`). Equation and
section numbers below refer to the 7/8 manuscript unless stated.

---

## 0. Verdict

1. **The target enters the 7/8 argument only through its signal exponent.** The low estimate, the principal-row
   margins and the row counts do not depend on which L-function has the hypothetical zero. A ζ-only version of the
   argument is therefore not easier. It is weakly harder: it loses the self-referential bound that the family
   argument has on its rows (Proposition D, §2).
2. **The binding inequality is about other L-functions at low height.** The tightest inequality of the proof
   concerns low-lying zeros (height O(conductor^(1/100))) of sextic Hecke L-functions over Q(√−3) whose
   conductor tends to infinity, located near Re s = 283/408 ≈ 0.694. Its margin is exactly 7/30672 ≈ 2.28·10⁻⁴
   (§1.3, EXACT). No ζ datum touches these objects.
3. **The height relaxation is vacuous.** Given Platt–Trudgian, "ζ(β + iγ) ≠ 0 for β > θ, γ ≥ 3·10¹²" is
   logically equivalent to "ζ(s) ≠ 0 for Re s > θ" (Proposition H, §3). The proof itself is height-free.
4. **Every ζ-specific input in the repository belongs to a class that cannot produce a half-plane at all heights ≥
   3·10¹²:** fixed-support positivity has a finite height horizon (by the project's measured RES-T law, the certified
   supports see a β = 7/8 zero only below height ≈ 12–58); density and proportion statements cannot exclude a single
   zero; verified height covers
   bounded heights; zero-free regions near Re s = 1 have width tending to 0; Euler detection is a qualitative
   multiplicativity test. A half-plane QRH(θ) with θ > 1/2 does not force Λ = 0 (route 43), so the flow-blindness
   no-go does not forbid it; NS-RIGID's finite Pick tests have finite horizons, so they do not supply it (§4).
5. **Where a gain would have to come from** (none of it ζ-specific, none of it available in the repository): the row
   counts of the sextic family near Re s ≈ 0.69, and the low side of the probe. HEURISTIC: the displayed bookkeeping
   cannot go below 13/15 through row information alone, because the low-side reflected energy is lossless only for
   compensation length ℓ ≤ 1/5 (§5).

---

## 1. What the 7/8 proof reads

### 1.1 The family supremum and the three roles of β*

The proof is a contradiction argument on

  β* = sup{ Re ρ : 1/2 ≤ Re ρ ≤ 1, L_F(ρ, η) = 0 for some primitive finite-order Hecke character η of F = Q(√−3) }

(eq. (2.1); in Lean, `OAI.SevenEighths.Supremum.seven_eighths_of_uniform_margin` works with `sSup` of the family zero
set). ζ enters only at the end, through ζ_F(s) = ζ(s)L(s, χ₋₃) and the quadratic transfer (Prop. 11.3). In Lean,
`riemannZeta_ne_zero_of_seven_eighths_lt_re` unfolds through `SevenEighths.HeckeCommonProbe.zeta_of_common_probe` to
`SevenEighths.HeckeDirichlet.zeta_seven_eighths_of_hecke` (file `DirichletL/Hecke/Dirichlet.lean`). Its only
hypothesis is the statement for every Hecke character η, `LFunction η s ≠ 0` for 7/8 < Re s, which is supplied by
`hecke_ne_zero_of_common_probe`. β* has exactly three roles:

* **(R1) Signal.** A target zero near β* makes the Mellin signal f_η(Z) ≍ Z^{C(β*)} via the continuation of
  1/L_F^S(s, η) (Prop. 2.1). The height of that zero plays no role.
* **(R2) Row ceiling.** Poisson summation produces nonprincipal rows u (sixth-power-free elements). Each row carries
  the finite set of presentations X_u = {ν(n)χ_n(u)^{±1} : ν ∈ ⟨η, T̂⟩} (§8.1). Their zeros are examined only in
  rectangles |Im ρ| ≤ 3jT₁ with T₁ = Z^τ ≤ U^{1/100}, where U ≍ N(u) is the conductor scale (Lemma 8.1). Bins satisfy
  a ≤ β*, δ = 2a − 1 ≤ κ = 2β* − 1 (12.2). κ enters the row count only through the plain capacity
  z_P(m) = (1 − 2m)/(6κ) (19.2).
* **(R3) Nothing else.** The low estimate is target-independent ("The exponent is independent of the target and the
  slot mesh", Prop. 15.3). The principal-row margins m_w = l_y/20, m_z = h/600, m_P (Lemma 10.5, (20.3)) come from
  the numerator ζ_F(6z)ζ_F(w), which is the same Dedekind zeta function for every target (7.13), and they are not
  binding. The row exponents "may depend on the pointwise set, d, a, and β*, but not otherwise on the target"
  (Lemma 20.1).

### 1.2 Where 7/8 comes from (EXACT)

From (15.6) the low exponent is l_x/2 + b/12. From (15.9), C_II(s) = l_x/2 + s − 1 + h/6. The abscissa is the root
of C_II(σ₀) = low exponent:

  σ₀ = 1 − h/6 + b/12.

With the geometry relations h = 1 − l_x + ℓ, l_y = l_x + b and l_x + l_y = M = 1 − ℓ ((12.4) and §20):

  **σ₀ = 11/12 − ℓ/4**,

where ℓ is the total length of the prime compensation slots. Part I has ℓ = 0 and gives 11/12. Part II has ℓ = 1/6
and gives 7/8. The whole step from 11/12 to 7/8 is the compensation. (Script A, section A.)

For context on the 11/12 statement: the stand-alone 11/12 write-up proves Σ_{N(u) ≤ H} |A_u(D)|² ≪ D^{1+ε}H for
the sextic-twisted Möbius sums A_u(D) = Σ μ(n)ν(n)χ_n(u)W(N(n)/D) with H = D^{1+ϑ}. Rows u = p⁶ reproduce A₁(D) up to
O(D/Y) (eq. (2.4) there). Averaging over ≍ Y/log Y such primes with Y = H^{1/6} gives
|A₁|² ≪ D^{2+ϑ}/Y + D²/Y², so A₁ ≪ D^{11/12+5ϑ/12+ε}. The 1/12 is (1/2)·(1/6): square-root cancellation times
sixth-power amplification.

### 1.3 The binding inequality (EXACT)

Lemma 20.2 bounds the intermediate row bins through the balanced count R* = 1 − α + (α − δ)t (α = 5/6, the
sixth-power amplification slope) and the polynomial identity (20.9). Script A re-verifies (20.9) symbolically and
minimises −E* over 0 ≤ δ ≤ 5/6, 0 ≤ x ≤ 1/2:

| margin (relative to Z^{C(7/8)}, Δ → 0) | value | where |
|---|---|---|
| intermediate row bins, min −E* | **7/30672 ≈ 2.282·10⁻⁴** | δ* = 79/204, row zeros at Re s = 283/408 ≈ 0.6936, x = q/δ = 1/2 (maximal slot amplitude), R* = 21766/32589 ≈ 0.6679 |
| paper's certified lower bound for the same | 49/440640 ≈ 1.112·10⁻⁴ | Lemma 20.2; Lean `Endpoint.balanced_endpoint_margin` |
| floor bin a = 51/100 | 7/1200 ≈ 5.83·10⁻³ | (20.5) |
| d ≤ 1/2 | 49/14400 ≈ 3.40·10⁻³ | (20.11) |
| principal z-remainder | m_z = 13/9600 ≈ 1.35·10⁻³ | (20.3) |
| principal w-remainder | m_w = 23/960 ≈ 2.40·10⁻² | (20.3) |
| top endpoint δ = 3/4 / δ = 5/6 | 13/192 / 7/96 | (20.7) |
| small rows | 63/800 | §20.3 |

The proof is tight at rows whose low-lying zeros sit near Re s ≈ 0.69, with all slot primes at maximal amplitude.
That point is far left of both the row ceiling κ and of any target zero.

---

## 2. Proposition D: a ζ-only version is not easier

**Setting.** Regard the displayed inequalities of Part II (Prop. 15.3; Lemma 20.1 with Prop. 19.2; Lemma 10.5;
§20.3) as a system in the geometry g = (h, ℓ, l_x, l_y, b, slot system) and two inputs: the target exponent β_t
(signal) and the row ceiling κ_r. Call the system feasible at (β_t, κ_r) if the low exponent is below C_g(β_t), every
row-bin exponent with δ ≤ κ_r satisfies E_g + ε < β_t − σ₀(g), and the principal margins are positive.

**Proposition D.** (i) The low exponent and the principal margins do not depend on (β_t, κ_r). (ii) Every row-bin
exponent is nondecreasing in κ_r. (iii) Hence, if the ζ-only system (target η = 1, rows bounded only by the proven
family theorem, so κ_r = 3/4 for every β_t) is feasible for all β_t ∈ (θ, 7/8], then the family system (κ_r =
2β_t − 1) is feasible on the same range, and the contradiction argument of §20 gives θ for the whole family. Inside
this architecture, θ_ζ ≥ θ_family.

*Proof.* (i) is Prop. 15.3 and Lemma 10.5 as stated (§1.1, R3). For (ii): the δ-range of the bins grows with κ_r.
In Prop. 19.2 the inverse capacity z_M(r) = (1 − r)/2 does not involve κ. The plain comparison line, written for
general κ with c = 1/(3κ), is S_t(r) = 1 − δ[cx + (2 − 2cx)(t − r)]. Crossing it with A_I(r) = 1 − δ[x + (1 − x)r]
gives R_short(t) = 1 − δ + δ·P(κ)(3/2 − t)/D(κ) with P = (1 − x)(2 − 2cx) and D = 3 − x − 2cx. At κ = 3/4 these are
the paper's P_x, D_x. Then d(P/D)/dκ = 6x(1 − x)²/(3κx − 9κ + 2x)² ≥ 0 (sympy, Script A section E). L(t) does not
involve κ, so the balanced count R* and E are nondecreasing in κ. For (iii): on β_t ∈ (θ, 7/8] one has
2β_t − 1 ≤ 3/4. By (ii), every family row inequality is implied by the ζ-only inequality with the same g and the
same β_t, and (i) makes the remaining inequalities identical. ∎

Computed monotonicity (min −E* over the bins, relative to C(7/8), without the signal gain Δ, using the exact
κ-dependent capacity rather than the paper's Δ/4 allowance (19.6)):

| κ | 0.70 | 0.72 | 0.74 | 0.75 | 0.76 | 0.78 | 0.80 | 5/6 |
|---|---|---|---|---|---|---|---|---|
| min −E* | 3.99e-4 | 3.27e-4 | 2.60e-4 | 2.28e-4 | 1.98e-4 | 1.39e-4 | 8.4e-5 | −7.8e-7 |

The last column shows what self-reference contributes. Suppose the rows were known only to satisfy the 11/12 bound
(κ_r = 5/6). Then this geometry would give a ζ-only abscissa slightly above 7/8 (it needs β_t > 7/8 + 7.8·10⁻⁷). The
family argument reaches 7/8 because κ = 2β* − 1 moves with the target.

Grade: PROVED at the level of the manuscript's displayed inequalities. It is a statement about this architecture,
not about every conceivable proof.

**Which ζ-specific properties could have entered, and why none does.** Real coefficients and self-duality; the pole
at s = 1 and positivity of Λ(n); verified zeros (PT); explicit regions near Re s = 1 (Mossinghoff–Trudgian–Yang);
zero density and proportion on the line; the separate Euler product over Q. Each of these is a property of the
target. The bookkeeping reads the target only through C(β_t) in (R1). The binding row bins of §1.3 involve the
target neither through κ nor through any constant.

---

## 3. Proposition H: the height relaxation is vacuous

**Proposition H.** Let 1/2 ≤ θ < 1 and T₀ ≤ 3000175332800. The following are equivalent:
(a) ζ(s) ≠ 0 for Re s > θ;
(b) ζ(β + iγ) ≠ 0 whenever β > θ and |γ| ≥ T₀.

*Proof.* (a) ⇒ (b) is immediate. For (b) ⇒ (a): zeros with Re s ≥ 1 do not exist; ζ(σ) ≠ 0 for 0 < σ < 1; zeros with
0 < |γ| < T₀ lie on Re s = 1/2 ≤ θ by Platt–Trudgian and the symmetry ζ(s̄) = conj ζ(s). ∎

For the de Bruijn–Newman start, the condition q₀ > (2θ − 1)² is read for zeros of H₀ with Re z > X, i.e.
γ > X/2. The chain's head condition uses PT at t = 0 (`lambda-qrh-note-draft.md` §5: clearance 175,239,886 in γ),
so the needed statement is (b) with T₀ inside PT.
By Proposition H that is the global statement. A "θ(T) for T ≥ 3·10¹²" therefore asks for exactly as much as a global
θ.

The 7/8 proof is also height-free. The continuation in Prop. 2.1 is global in Im s. The Gaussian e^{(s−5/6)²}
localises only the rows' zeros, to |Im ρ| ≤ 3jT₁ = O(Z^τ). The height of the target's zero never appears.
Verified-height data has no slot to enter.

---

## 4. Input-by-input

| input (repo location) | what it establishes | why it cannot lower θ for ζ |
|---|---|---|
| Route I pole-free Weil positivity, Toeplitz–Krein certificates (route 11, `src/data/route-11-multi-prime-toeplitz-krein-2026-10-09.js`; Lean route 39) | certified for 2a ≤ ln 5 and ln 6 clean, ln 11 conditional; margins ≈ 10^{−4.8 e^{2a}} | Positivity at fixed support is proved without zero input and has a finite height horizon. By the project's RES-T law (`imp-95530`, MEASURED against Odlyzko zeros), a quadruple with δ = β − 1/2 at height H is visible only for support T with δ²S(Tδ)⁴T³ > log(H/2π). For δ = 3/8 (β = 7/8): T* = 4.83 at H = 3·10¹², 7.65 at 10¹⁰⁰, 17.7 at 10^100000, so T* → ∞. The certified supports see a δ = 3/8 zero only below H ≈ 11.7 (ln 5), 15.0 (ln 6), 57.7 (ln 11): at or below the first zeros of ζ. The margin law predicts 10^{−598} at T*(3·10¹²). A half-plane needs every height (Script B). |
| semilocal trace identities, mollified Weil forms (routes 12, 19) | S = {∞,2,3} identity; length-N mollified form = plain form at a + ½ log N | reduce to the same Weil form at a shifted support, so they have the same finite horizon |
| lacunary cones, NS-RIGID Pick tests (route 13; `imp-95530`) | certified positivity on {4^k} (λ_min ≥ 3.6346e-4); each finite Pick test either survives the backward flow or refutes RH | Finite horizon (≈ 80 in the double-zero model), so no half-plane information above it. In the other direction, a half-plane QRH(θ) with θ > 1/2 does not force Λ = 0: route 43 gives κ(QRH 7/8) = 9/32 and κ(QRH 11/12) = 25/72, exact in the de Bruijn class, and the same witness gives (2θ − 1)²/2 > 0 for every θ > 1/2. So the flow-blindness no-go does not obstruct a sharper half-plane. It also does not help prove one |
| family Weil positivity (route 14) | Dirichlet family mod q certified to 2a ≈ 2 log q | Euler-blind: certified positive for a family containing the RH-false F_DH. At full support it is GRH mod q; at finite support it says nothing about individual zeros. The rows of the 7/8 proof are sextic Hecke characters over F, not characters mod q |
| Euler detection (routes 30, 44) | rung tests detect a missing Euler product at 2a just above ln 2 / ln 4 / ln 6 | qualitative multiplicativity test, no RH content. The 7/8 proof already uses exact multiplicativity at every prime: Lemma 7.1, the Gauss–Jacobi relations γ₁γ₂ = −α(p)χ_p(4)γ₃ (the −1 is μ(p)), and the compensation slots. Nothing quantitative is left to add |
| mollifiers, proportion (routes 16–18; PRZZ 5/12; Alpöge–Furman ≥ 2/3 preprint; `critical-line-proportion.js`) | density-one statements about zeros near height T | A half-plane needs every zero. Route 16 records that even full Hardy–Littlewood input gives 100% of zeros, not every zero. In the architecture the density-type slot is the row count of the sextic family at Re s ≈ 0.69. There the count already used is R* ≈ 0.668 (exponent relative to the trivial count U¹). That is below the mollifier-type density shape 1 − c(σ − 1/2) (Selberg's c = 1/4 gives 0.95 at σ = 0.694) and below the t-aspect ζ zero-density exponents at the same σ (Ingham 3(1−σ)/(2−σ) ≈ 0.703, Guth–Maynard 30(1−σ)/13 ≈ 0.707). Transplanted to the family, these estimates would be weaker than the count already used (indicative comparison; different families) |
| MV-CAP (route 42) | zero-side mean-value premises cannot certify one window: explicit counter-model in every window of [3.1e12, 7.5e16] | a half-plane is a statement about every window at every height |
| PT verified height | RH for 0 < γ ≤ 3000175332800 | Proposition H: bounded heights only |
| explicit zero-free regions near Re s = 1 (MTY R = 5.558691; Ford 2002) | β < 1 − 1/(R log γ); β < 1 − 1/(57.54 (log γ)^{2/3}(log log γ)^{1/3}) | Boundary 0.99374 (MTY) at γ = 3·10¹², 0.99922 at 10¹⁰⁰, tending to 1. The ζ-only positivity mechanism behind these regions is Σ Λ(n)W(n/X)(3 + 4cos(γ₀ log n) + cos(2γ₀ log n)) ≥ 0 with W ≥ 0. A zero β₀ + iγ₀ contributes −4Ŵ(β₀)X^{β₀} there, against the pole term 3Ŵ(1)X. For fixed β₀ < 1 the inequality holds automatically as X → ∞. With X = γ₀^{O(1)} it yields only 1 − β₀ ≫ 1/log γ₀, so it never reaches a fixed half-plane |
| Raymond / route-P Λ machinery, kernels, floors | conditional Λ from a start q₀ = (2θ − 1)² | consumes θ; produces no zero information |
| Lean infrastructure, openai/math Lean library | formal 7/8 proof; project replay formats (route 41) | The geometry is hard-coded (`Parameters.lean`: `compensated_geometry` with 17/48, 23/48, 1/8; `Endpoint.lean`: `balancedExponent` with 13/16 and 5/6). The ζ statement is derived from the family supremum (`Supremum.lean`, `Nonvanishing.lean`). Useful for checking a new endpoint certificate if a better geometry is found (pattern: `endpoint_identity` by `field_simp; ring`, margin by `nlinarith`). It is a checking tool and supplies no mathematical input |

---

## 5. Where a gain would have to come from (not ζ-specific; not supplied by the repository)

**5.1 (EXACT).** σ₀ = 11/12 − ℓ/4. Inside the compensated-probe family with M + ℓ = 1, θ < 7/8 requires ℓ > 1/6.

**5.2 (HEURISTIC, R* held fixed).** At the binding bin, ∂E/∂ℓ ≈ 1.332 and ∂E/∂l_x ≈ −0.0012. Spending the whole
margin 7/30672 on ℓ would move θ by about −4.3·10⁻⁵. This gain would be family-level, not ζ-specific, and would
require re-checking every other constraint of the paper.

**5.3 (HEURISTIC ceilings of the displayed bookkeeping, M + ℓ = 1 retained).**

* *Low side.* Lemma 15.1 bounds the marked reflected energy (exponent of the squared row norm) by
  M′ + ((1 + 3ℓ′ − 2M′)/4)₊, with M′ = M − 2d and ℓ′ = ℓ − d for a rescaled slot subset of length d. In general
  geometry this is M′ + ((5ℓ − 1 + d)/4)₊; at ℓ = 1/6 it is the paper's M′ + ((d − 1/6)/4)₊. After Cauchy–Schwarz
  the loss in the low bound is half of this, and the rescaled tuples carry the factor Z^{−d} of (15.8). The
  d-tuples therefore contribute l_x/2 + b/12 + max(−d, (5ℓ − 1 − 7d)/8). The maximum over 0 ≤ d ≤ ℓ is (5ℓ − 1)₊/8,
  attained at d = 0. The low exponent stays l_x/2 + b/12 iff ℓ ≤ 1/5. For ℓ > 1/5 it gains (5ℓ − 1)/8, and
  σ₀ = 19/24 + 3ℓ/8 increases with ℓ. So this probe family stops at **σ₀ ≥ 13/15** whatever the rows do.
* *Perfect rows.* Suppose every nonprincipal row obeyed the density-hypothesis count R = 1 − δ, or GRH. This is a
  counterfactual used only to price row information: GRH for the whole family would contain RH for ζ. The GRH-row
  term C₀ = −1/12 + 13ℓ/12 − l_x/3 = (5ℓ − 1)/4 + b/6 must still be negative. That gives ℓ < 1/5 at b = 0, hence θ ≥
  13/15 ≈ 0.8667 with the detector floor moved to 1/2, or θ ≥ 2609/3000 ≈ 0.8697 with the paper's floor 51/100.
  (At the paper's geometry the density-hypothesis count would raise the binding margin from 2.28·10⁻⁴ to
  49/1088 ≈ 0.045.)

So row-side information is worth at most 7/8 − 13/15 = 1/120 ≈ 0.0083 in this architecture. Row-side information is
the only slot where zero-density, proportion or positivity data could enter. It would also have to be information
about sextic Hecke L-functions over Q(√−3) near Re s ≈ 0.69 at low height, not about ζ. Below 13/15 one needs a
different low side: a stronger completed-row (reflected energy) bound or a different probe. Both are target-blind.

These ceilings extrapolate displayed formulas to other geometries and ignore the paper's other conditions (supply
7/37, capacities, the length conditions of Prop. 15.3, principal and outer-row margins). Adding constraints can only
raise them, so they are lower bounds on any θ this bookkeeping can reach. They are not theorems about the
architecture.

**5.4 (HYPOTHETICAL) What the ceilings would be worth for Λ.** These values assume half-planes that nobody has
proved. de Bruijn's (2θ − 1)²/2: 9/32 = 0.28125 at 7/8 and 121/450 ≈ 0.26889 at 13/15. Raymond's chain at PT height
with start q₀ = (2θ − 1)² + 2·10⁻⁶ (same script and arithmetic as value (i) of `lambda-qrh-note-draft.md`):

| θ | q₀ | Raymond chain U | steps |
|---|---|---|---|
| 7/8 (recorded) | 9/16 + 2e-6 | 0.118505710922701 | 60,675 |
| 2609/3000 (hypothetical) | 2459771/4500000 | 0.116983198840771 | 59,896 |
| 13/15 (hypothetical) | 2420009/4500000 | 0.11611697513897 | 59,452 |

Even the heuristic architecture ceiling would move the Raymond-chain value by about −0.0024 (−0.0015 at
2609/3000). These runs use the same floors, kernels and exact arithmetic as value (i). They show only how much a
sharper start would be worth. They are not bounds.

---

## 6. Files and reproduction

* `tmp/beat78-project-architecture.py` → `tmp/beat78-project-architecture.out.json`. Covers: abscissa formula
  σ₀ = 11/12 − ℓ/4; general E(h) and C₀; identity (20.9); exact minimiser δ* = 79/204 and margin 7/30672; other
  margins; κ-monotonicity; heuristic ceilings. Runs in ≈ 10 s.
* `tmp/beat78-project-horizons.py` → `tmp/beat78-project-horizons.out.json`. Covers: RES-T threshold supports
  T*(δ, H); horizons of the certified supports; route-11 margin law at T*; MTY and Ford boundaries. Runs in < 5 s.
* `tmp/beat78-project-raymond-hypothetical.json` / `.log`: `tmp/oai-lambda-raymond.py` with
  `--thetas 13/15,2609/3000` at X1 (≈ 55 s per θ).

```bash
.venv-arb/bin/python tmp/beat78-project-architecture.py > tmp/beat78-project-architecture.out.json
.venv-arb/bin/python tmp/beat78-project-horizons.py > tmp/beat78-project-horizons.out.json
.venv-arb/bin/python tmp/oai-lambda-raymond.py tmp/beat78-project-raymond-hypothetical.json X1 --thetas 13/15,2609/3000
```

## 7. Status of each statement

* EXACT: §1.2 (σ₀ = 11/12 − ℓ/4), §1.3 (binding bin and margins), the κ-derivative in §2.
* PROVED (elementary, here): Proposition H; Proposition D at the level of the manuscript's displayed inequalities.
* MEASURED / project law: RES-T horizons (`imp-95530`, measured against Odlyzko zeros at H ≤ 6·10⁵); route-11
  margin law.
* HEURISTIC: §5.2 and §5.3 (extrapolated displayed formulas). HYPOTHETICAL: §5.4.
* External, unrefereed: the 7/8 and 11/12 manuscripts and their Lean proof (openai/math 003); the Alpöge–Furman
  preprint.

No new zero-free region, no QED. RH is open. PT Λ ≤ 0.2 stands.
