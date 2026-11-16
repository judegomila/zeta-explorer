# REFEREE: b-mvcap-function-side

Date: 2026-11-16. Adversarial referee pass on `RESULT.md`. RH is open. No Λ bound moves. Nothing here is a QED.

## Outcome

`holds = true` as a **partial result with corrections**. Every PROVED step was re-derived and none failed. The
headline numbers need one correction (item 1), the scope of "cap" and "sharp" is narrower than the summary line says
(items 2, 3), and several side assertions are unproved (item 6).

## What was re-derived (all confirmed)

* **Lemma 0.** ξ_F = Ξ·(p+q)(t)(p+q)(−t)/(p(t)p(−t)) is entire, even, real, order 1; q(±i/2) = 0 gives ξ_F(1) = ½;
  deg q < deg p gives R → 1.
* **Theorem 1.** V = Dχ^{−1/2} is holomorphic on Q (c − H ≥ 1 avoids the zeros and poles of χ); both vertical sides
  are ≤ εX by the functional equation and reality; domain monotonicity of harmonic measure plus the map sin(πz/2a)
  give ω ≤ (4/π)/sinh(πH/2a). Correct.
* **Lemma X.** The closed form K(t) = (i/2)log(t/2π) − π/4 is correct (checked from ∫₀^∞ log v/(v²+b²) dv =
  (π/2b) log b with b = iw). Im K − Im L = 2·dens_c·arctan(y/h) + O(h/c) is correct with the principal branches. The
  E_N integration by parts gives 2B/(h+τ) + 2B/(h−τ). The nonreal-pair correction is ≤ 0.57·dens_c/h² for
  |τ| ≤ h/2 (the note states dens_c/h²).
* **Lemma P.** (i) the −π/4 terms cancel; (ii) Φ′(u) = Λ(u−c, a) ≥ 0, and the count max − f(c−h) + (max − min) +
  (f(c+h) − min) + endpoint values ≤ 5m̂ + 0.29 is right; (iii) monotone.
* **Theorem 2.** (a) the log-derivative of p/ν is strictly decreasing in each gap; root count k − 2m real + m pairs
  checked by parity in all three sign configurations; |N_F − N| ≤ 1. (b) "distance 2" in H₀ coordinates x = 2γ is
  ordinate distance 1, so H_W(c, h+1) is the right hypothesis. (c) the chain
  |q/p| ≤ (1+η)|ν/ν(t_m)|·|p(t_m)|e^{−A(u)} → Lemma P → (X1), (X2), Stirling reproduces κ′ term by term; the reflected
  factor has the same supremum on the line because p, q are real; Phragmén–Lindelöf applies since the poles of R lie
  on Re s = ½.
* **Proposition 2′** and **Proposition 3** (for the lifts of the note, where sup|q/p| < 1 on the line).

## Independent numerical check (different case, different code)

Scratch scripts in `/tmp/ref-mvcap/` (not part of the deliverable). Own zeros: 1186 zeros of Z in 30000 ± 440 by a
Riemann–Siegel bracket and mpmath refinement; mpmath `nzeros` difference over the same interval = 1186. Cluster
h = 400, k = 1080, with ζ and ζ′/ζ from mpmath (not a truncated Dirichlet sum).

| check | result |
|---|---|
| Lemma X: \|e′/e − (K − L)\| against ε_X(τ) + 2h/c, 45 points, τ ∈ [−200, 200], y ∈ {0, 0.25, 1, 1.5, 3} | residual 0.0032–0.0061 against bound 0.071–0.086; worst ratio 0.071 |
| Theorem 2(a): roots of p − (1+η)s*μ*ν, η = 10⁻³ | 1078 real = k − 2, one pair at c − 17.5654 ± 1.17·10⁻³ i, sup\|N_F − N\| = 1 |
| Lemma P, σ ∈ {1.25, 1.5, 2, 3}, \|u − c\| ≤ 3h | min(A − A(c)) = −0.078 … −0.0003 against −1.31 … −0.66: holds 4/4 |
| \|p(t_m)\|e^{−A(c)} against \|Z(t_m)\|/\|ζ(σ+ic)\|·(c/2π)^{−a/2}·e^{κ′} | ratio 1.001–1.021 against e^{κ′} = 1.068–1.234: holds 4/4 |
| Theorem 2(c): sup_u \|p(t_m)ν(u−ia)/(ν(t_m)p(u−ia))\| against the bound | measured/bound 0.26, 0.35, 0.40, 0.40 |
| Theorem 1 at the removed pair (σ = 2, H = 8) | \|Z_F − Z\| = 1.222·10⁻², Xε^{1−ω}M^{ω} = 2.661·10⁻², ratio 0.46 |
| Proposition 2′ on \|τ\| ≤ 40 | max ratio to bound 0.025 |

Constants: recomputed with mpmath at 30 digits from closed forms (∫ε_X = 2B log((h+τ)/(h−τ)) + …). All 18 rows of
`consts.json` reproduce to the printed digits (e.g. 7.5·10^16, h = 500, σ = 2: prefactor 2.4357, Ê₁ = 2.133·10⁻¹²,
with Hiary–Patel–Yang 3.326·10⁻⁸). The measured E values of table 5.2 (8.0·10⁻⁵, 6.9·10⁻¹², 5.7·10⁻¹⁴ at σ = 2)
reproduce from the author's zero files with independent code.

## Errors and corrections

1. **C ≤ 2.44 needs h ≥ 500, not h ≥ 300.** The summary pairs "H_W of half-width ≥ 301" with "Ê ≤ 2.44·|Z(t_m)|·…
   at σ = 2". At h = 300 the prefactor is 3.19 (lane bottom) and 3.34 (lane top), so Ê ≤ 1.17·10⁻⁵ and ≤ 4.6·10⁻⁸
   with Hiary–Patel–Yang. The figures 8.7·10⁻⁶ and 3.3·10⁻⁸ (the note's "3.4·10⁻⁸" is a round-up) need H_W of
   half-width ≥ 501.
2. **The proved cap is for the literal t = 0 form only.** Theorem 2(b) takes y → 0, so P(z) → 0. Route 42 Remark A′
   already states that this form is weaker than needed and already gives a t = 0 counter-model that preserves every
   explicit N(T) bound exactly; the low pair returns to the real axis within heat time y²/2. The statement that
   yields Λ ≤ 0.145 is H_desc-mirror (y ≥ y₀ = 0.165, t > 0). For it nothing is proved: the mirror instance is
   MEASURED, its threshold is about 360 times larger (E(σ=2) = 2.5·10⁻⁹ against 6.9·10⁻¹²), and a single prescribed
   pair works in only 2 of 60 positions at 7.5·10^16. "Function-side MV-CAP holds" should read "holds for literal
   H_desc at t = 0".
3. **"Theorem 1: no model below ε*" is narrower than stated.** (i) It needs a growth bound |F − ζ| ≤ M ≤ c^A on the
   rectangle, which is not an axiom of 𝒜; the verdict's "(1 + o(1))" hides this. (ii) It needs the premise on a
   window of half-width H ≥ 2a log log c. (iii) It forces the persistence of a guarded sign change of Z; it does not
   exclude other counter-models (the note's own "Scope" line says so). Sharpness is therefore: removing a sign
   change guarded by |Z(e)| costs between |Z(e)|X⁻¹ and ≈ 8|Z(e)|X⁻¹ at σ = 2.
4. **Conditional on H_W above the verified height.** The lane starts at 3.0·10^12, at or above the Platt–Trudgian
   height, so H_W is not known for any lane window. The cap is a conditional theorem. This is not an RH assumption
   and is flagged by the author, but "⊬" in Corollary 2 holds only if some lane window satisfies H_W. The sampled
   windows (±62, ±16) are shorter than the required 2h ≥ 600 and are double-precision sign counts.
5. **Certification level.** CERTIFIED-FLOAT is double precision on a 6405-point grid with trapezoid quadrature, no
   interval arithmetic. The only sign decision (Γ₁ > far error) has margin ≥ 130 and also follows from crude
   analytic bounds (Γ₁ ≥ 0.26·dens_c·h − 2B log 3 − …, far ≤ B(5 log(h/a) + 0.29)), so it is safe. The prefactor
   2.4357 has 0.18% headroom under the quoted 2.44 and is certified at grid points only. Trudgian's Corollary 1
   carries an extra 0.2/T, omitted; the mirrored and far E_N parts come to ≈ 2.6–3 B/c against the stated 3B/c; the
   M-part remainder O(h² log h/c) is 2.3·10⁻⁶ at h = 1000, lane bottom, against the stated 10⁻⁶. All three are
   below 10⁻⁵ in the exponent and change no printed digit.
6. **Unproved side assertions in section 6.** Positive-definiteness of log F(σ+i·) gives a positive measure, not
   one supported on {log n}; "equivalent to an Euler product with Λ(n) ≥ 0" and "together with the functional
   equation it identifies F with ζ" are not proved. Proposition 3 as stated ("any cluster lift with R ≢ 1") needs
   q(c − ia) ≠ 0 and sup|q/p| < 1 on the line; both hold for q = const·ν. "The escape premise is the
   verified-height wall" is an interpretation, not a theorem.
7. **Small repairs.** (a) "at most one root in each unbounded interval" is false for general λ on (−∞, g₁), where
   |p/ν| is not monotone near t = 0; it is true for |λ| ≤ (1+η)μ* because |p/ν| ≥ c^k·k²/5 on t ≤ 0. (b) t_m is the
   extremum of p/ν on the central gap, not of Z; |Z(t_m)| is at most the gap extremum of |Z|. (c) Section 7 says
   Theorems 1–2 do not use the Euler product, but m_σ ≥ ζ(2σ)/ζ(σ) does; this is harmless for an obstruction.

## Davenport–Heilbronn control

Theorems 1–2 are obstructions and are Euler-blind apart from m_σ, as required. For Proposition 3 the control can be
made exact: with f = Σ a(n)n^{−s}, a(n) = 1, κ, −κ, −1, 0 for n ≡ 1, 2, 3, 4, 0 (mod 5), κ = 0.2841, the coefficient
of 3^{−s} in log f is −κ < 0, so log f(σ+i·) is not positive definite on any line where it is defined. ζ passes,
DH fails, every cluster lift of the note fails. No step assumes RH; no step restates verified height as a new result.

## Surviving claim

Conditional on H_W(c, h+1) for a lane window (unknown above 3·10^12) and with CERTIFIED-FLOAT constants at grid
points: the cluster lift F = ζ(p+q)/p is in 𝒜(1), has one off-line pair, |ΔN| ≤ 1, violates the literal t = 0 form
of H_desc(p) for every p > 0, and satisfies sup_{Re s ≥ σ}|F/ζ − 1| ≤ 2Ê + Ê² with
Ê ≤ C·|Z(t_m)|·(c/2π)^{−(σ−½)/2}, C ≤ 2.44 for h ≥ 500 and C ≤ 3.34 for h ≥ 300 at σ = 2. Theorem 1 gives the
matching lower bound for removing a guarded sign change, under a polynomial growth bound in the strip.
Proposition 3 holds for these lifts. Not established: the mirror form, t > 0, σ ≤ 1, and any every-window statement
from Euler-product input.
