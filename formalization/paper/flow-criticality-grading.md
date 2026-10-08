# Graded flow-criticality: where QRH, zero density, proportion results and Weil positivity sit

Date: 2026-10-07. Route 43 of `formalization/routes/fifty-routes-2026-10-06.md`. Branch `editorial-redesign`; working
files only, nothing committed. Scripts and outputs: `tmp/routes-b9-r43-*.py`, `tmp/routes-b9-r43-out/`. Lean:
`formalization/lean/Route43/FlowCriticality.lean` (checked against Lean 4.34.1 / Mathlib d13f23b7 and the openai/math
OAI library in `/tmp/qrh-verify/lean`; `tmp/routes-b9-r43-lean/check.sh`).

Grades: LEAN (kernel-checked here, axioms `propext, Classical.choice, Quot.sound`); PROVED (complete argument written
here, internal only, no referee); CITED (classical result, not re-proved); CONDITIONAL; MEASURED (floating point or
interval-free numerics); HEURISTIC.

RH is open. PT Λ ≤ 0.2 is the accepted benchmark. Nothing here changes any Λ bound. NO QED.

**Referee corrections (internal referee pass, recorded 2026-10-14; src/data/route-43-flow-criticality-classes-2026-10-14.js).**
These override the text below where they conflict.
(R1) The measured H_{−1}, H_{−4} zeros outside the critical strip are weak evidence for the escape law: Lemma G1d plus
Rodgers–Tao already force Y(−τ) ≥ √(2τ) > 1 for every τ > 1/2. The conditional flow-criticality of the strip and QRH
needs escape for small τ (τ < 1/2 for the strip, τ < 9/32 for QRH), which was NOT tested (heuristic threshold
x ≈ 3·10¹⁸ at τ = 0.1). What is new in section 7 is where the escaped zeros sit in height and that at τ = 4 they exceed √8.
(R2) The Lean Part B (G1 and corollaries, backward strip growth, survival caps) is abstract arithmetic over a FlowSpace:
de Bruijn, the flow law Λ(F_t) = Λ(F) − t and Rodgers–Tao are hypotheses, Y is an arbitrary real function, Λ is
real-valued and Y(−τ) is assumed finite. `backward_strip_growth` in Lean states only 2ε ≤ Y(−ε)²; the form
Y(−τ)² ≥ 2(τ + Λ) is the paper version.
(R3) Section 5 gives a LOWER-BOUND ladder only: κ_low(T) ≤ κ(W_T ∧ critical strip) ≤ 1/2. Nothing shows κ(W_T) < 1/2
for any finite T or that it varies continuously; "continuous ladder" / "decreases continuously" below means the
lower bound κ_low. κ_low is not tight (restricted to c ≥ T; W > 0 in the extremal direction at c = 0.9 < T = 1).
(R4) The "exact" values κ(Strip_Y) = Y²/2, κ(QRH 7/8) = 9/32, κ(critical strip) = 1/2 hold in the de Bruijn class
WITHOUT Φ > 0 (the witnesses have zeros at ±iY). In ξ-like classes only κ ≤ 9/32 (resp. ≤ 1/2) is established.
(R5) "Intermediate class exists" holds in the graded κ sense and is close to definitional given de Bruijn 1950; the new
content is the exact witness value. In NS-RIGID's binary sense the question stays unconditionally open (section 8).
(R6) The native-span "κ ≥ 10⁵" is a finite 60-digit numerical survival measurement on four node sets, not
interval-certified; κ = ∞ is not shown ("practically soft").

---

## 0. Outcome

1. **Definition.** For a property P of entire functions in the de Bruijn class, the *flow-criticality degree* is
   κ(P) := sup{Λ(F) : F ∈ P}, the largest de Bruijn–Newman constant compatible with P. Equivalently, κ(P) is the longest
   backward heat-flow time by which a member of P can sit behind the real-rooted locus. κ = 0 means "P implies RH
   class-uniformly"; κ = ∞ means P carries no zero-location information. NS-RIGID's binary notion (does P survive
   backward flow at ξ?) is the survival time τ_P(ξ), a second, ontic quantity.
2. **Graded flow-blindness (Theorem G1, LEAN in abstract form).** If F ∈ P and F_{−τ} ∈ P then Λ(F) + τ ≤ κ(P). With
   Rodgers–Tao (Λ(ξ) ≥ 0): survival τ_P(ξ) ≤ κ(P). SL2 (no flow-stable hypothesis proves RH) is the case κ = 0.
   Methods valid on a backward-closed class give κ = ∞ (Corollary G1c): a finite κ needs an input that fails for
   H_{−τ} at large τ (in practice arithmetic or computational).
3. **Strip ladder (Theorem G2, PROVED; upper half CITED de Bruijn 1950).** κ(zeros in |Im z| ≤ Y) = Y²/2 exactly in the de Bruijn class without Φ > 0 (R4).
   The lower bound is a new exact witness: Λ((z² + Y²)cos(cz)) = (√(1 + 4c²Y²) − 1)/(4c²) ↑ Y²/2 as c ↓ 0.
   Hence κ(critical strip) = 1/2, **κ(QRH 7/8) = 9/32**, κ(QRH 11/12) = 25/72. The QRH strip is symmetric
   (1/8 ≤ Re ρ ≤ 7/8 for every zero with Re ρ > 0) — LEAN, from the OAI theorem and Mathlib's functional equation.
4. **Tail-blind inputs add nothing (Theorem G3, PROVED in the de Bruijn class).** Proportion statements (Levinson,
   Conrey, PRZZ 5/12, Selberg, Alpöge–Furman 2/3), zero-density bounds N(σ,T) ≤ T^{A(1−σ)+o(1)}, "all but finitely
   many zeros on the line" all have κ(P ∧ Strip_Y) = Y²/2: zero yield beyond the strip they are combined with. The
   same holds with verified height added (MEASURED: off-line quartets above the verified height, section 3).
5. **Weil positivity at fixed support: a lower-bound ladder (Theorem G4, PROVED lower bound; see R3).** For the zero-side Weil
   form, ĝ of exponential type T in the z-variable (T_RES-T = 2T, the type in the ordinate γ):
   κ(W_T ≥ 0 ∧ critical strip) ≥ κ_low(T) with κ_low = 0.4142 (T = 0.5), 0.3090 (1), 0.0926 (1.941, = RES-T's
   T_X = 3.882 at 3·10¹²), 0.0140 (5), 0.00349 (10), and T²·κ_low(T) → 0.349 as T → ∞. Weil's criterion gives
   κ(all T) = 0.
6. **Finite native-span statements are soft in the κ grading (MEASURED).** λ_min(P_S(ε); G) > 0 for ε up to 10⁵ on
   all four tested node sets (60-digit arithmetic), so κ(P_S) ≥ 10⁵ for those S, and the full family has κ = 0
   (NS-RIGID A5). The native span has no intermediate grade; the strip and Weil-support ladders do.
7. **Zeros of the backward flow leave the critical strip (MEASURED; "every strip" is HEURISTIC).** H_{−1} has 7 zeros
   in x ∈ [5000, 5050], 1.05 ≤ y ≤ 3 (outside the critical strip; located at y = 1.42 … 2.39); H_{−4} has 7 in
   x ∈ [0.5, 200.5], 1.05 ≤ y ≤ 8 (y = 1.81 … 3.55); H_{−1} has none in x ≤ 200 there, H_{−4} none in
   x ∈ [2000, 2010], 1.05 ≤ y ≤ 4. HEURISTIC law: zeros of
   H_{−τ} at height x reach |Im z| ≈ τ log(x/4π)/2 − 1. If this holds for every τ > 0, then every uniform-in-height
   statement — the critical strip itself, classical zero-free regions, QRH, density and proportion statements — has
   survival τ_P(ξ) = 0, i.e. is *flow-critical* at ξ without being RH-equivalent.
8. **Answer to the route question.**
   * In the graded (κ) sense an intermediate class between soft (κ = ∞) and RH (κ = 0) exists and is populated:
     critical strip 1/2, PT's package ≤ 0.2, QRH 9/32, W_T ≥ 0.35/T² asymptotically (T the z-type). Among the inputs surveyed
     here, QRH (Lean-checked, not peer-reviewed) is the only single zero-location input for ζ with κ < 1/2; the
     other values below 1/2 come from packages (PT's 0.2).
   * QRH fits as: arithmetic method (Davenport–Heilbronn violates it, so it is not soft), finite yield κ = 9/32 > 0
     (so it is not RH-strength), and survival on ξ ≤ 9/32 (LEAN, abstract) and probably 0 (item 7).
   * In NS-RIGID's binary sense the dichotomy "flow-stable or RH" holds on the native span only. Off the span,
     flow-critical but non-RH statements exist CONDITIONALLY on the escape law of item 7 (then the critical strip,
     classical zero-free regions, QRH and density statements are all flow-critical at ξ). Binary flow-criticality
     does not measure strength; κ does. Unconditionally: survival ≤ κ (G1a), and compact-window statements are
     flow-stable (section 7), so flow-criticality is decided at unbounded height.
   * What RH needs is an input family whose κ tends to 0. Available ladders: QRH_θ (κ = (2θ − 1)²/2, continuous),
     W_T (κ ≥ 0.35/T², lower bound only, upper bound and continuity open), native span (∞ → 0, a jump). No known arithmetic input has
     κ < 9/32 by itself; with verified height plus the effective approximation at t > 0, PT's package has κ ≤ 0.2.

---

## 1. Setting

**The class.** 𝒞 is the set of even entire functions F(z) = ∫ Φ(u) cos(zu) du with Φ even, real, and
Φ(u) = O(exp(−|u|^{2+δ})) for some δ > 0 (de Bruijn's class; positivity of Φ is not assumed). For F ∈ 𝒞 and t ∈ ℝ,
F_t(z) := ∫ e^{tu²} Φ(u) cos(zu) du ∈ 𝒞. The flow satisfies ∂_t F_t = −∂_z² F_t, (F_s)_t = F_{s+t}, and for t < 0 it is
the Gaussian average F_{−τ}(z) = E[F(z − W)], W ~ N(0, 2τ), on every horizontal line.

**Λ.** Λ(F) := inf{t : F_t has only real zeros} ∈ [−∞, ∞]. De Bruijn: if F_t is real-rooted then so is F_s for s ≥ t
(CITED, de Bruijn 1950 Thm 13). Hence Λ(F_t) = Λ(F) − t, and F is real-rooted iff Λ(F) ≤ 0. For ξ:
H_t = (H_0)_t with H_0(z) = ξ(1/2 + iz/2)/8; Λ := Λ(H_0) ∈ [0, 0.2] (Rodgers–Tao 2020; Platt–Trudgian 2021).

**Strip.** Strip_Y := {F : every zero of F has |Im z| ≤ Y}. A zero ρ = β + iγ of ζ in the critical strip is the zero
z = 2γ − i(2β − 1) of H_0, so "β ∈ [1 − θ, θ]" is Strip_{2θ−1}.

**Definition 1.1 (flow-criticality degree).** For P ⊆ 𝒞, κ(P) := sup{Λ(F) : F ∈ P} (sup ∅ = −∞).
* κ(P) ≤ 0 iff every member of P is real-rooted: P implies RH class-uniformly ("RH strength").
* κ(P) = ∞ iff P contains functions arbitrarily far behind the real-rooted locus ("soft": no zero-location content).
* 0 < κ(P) < ∞: intermediate.

Reading: F with Λ(F) = κ sits exactly κ units of backward flow behind a real-rooted function (F = G_{−κ}, G = F_κ at
the threshold). κ(P) is the deepest backward penetration of the real-rooted locus that P tolerates. This is a graded
version of NS-RIGID's "survives backward flow"; it is *epistemic* (what P can certify about any function) rather than
*ontic* (what happens to ξ).

**Definition 1.2 (survival).** For F ∈ P, τ_P(F) := sup{τ ≥ 0 : F_{−s} ∈ P for all s ∈ [0, τ]}. NS-RIGID calls P
flow-stable at ξ if τ_P(H_0) > 0 and flow-critical if τ_P(H_0) = 0.

**Definition 1.3 (method classes).** A proof of P(ξ) is *soft* if it is valid for every member of some class 𝒦 ∋ H_0
closed under the backward flow (F ∈ 𝒦 ⇒ F_{−τ} ∈ 𝒦 for τ > 0). Class properties of the H_t family (evenness, order 1,
Φ > 0, the functional-equation form, Hadamard product, the main term of N(T)) are of this kind. A proof is *arithmetic*
if it uses the Dirichlet coefficients or the Euler product of ζ, which H_{−τ} (τ > 0) does not have.

---

## 2. Graded flow-blindness

**Theorem G1 (LEAN, abstract: `Route43.graded_flow_blindness`).** If F ∈ P and F_{−τ} ∈ P, then Λ(F) + τ ≤ κ(P).

*Proof.* Λ(F_{−τ}) = Λ(F) + τ and F_{−τ} ∈ P. ∎

**Corollary G1a (LEAN: `survival_le_yield`, `rh_strength_forces_criticality`).** If Λ(F) ≥ 0 then τ_P(F) ≤ κ(P). For ξ
(Rodgers–Tao): τ_P(ξ) ≤ κ(P) − Λ ≤ κ(P). If κ(P) = 0, P is flow-critical at ξ. This is SL2 of
`flow-blindness-no-go.tex`, now with a rate: a hypothesis that survives backward flow for time τ cannot certify
anything better than Λ ≤ τ.

**Corollary G1b (LEAN: `lambdaLe_survival_iff`).** The sets {Λ ≤ c} are the canonical members of grade c: κ = c and
survival from ξ exactly c − Λ. Every proved Λ bound is an intermediate-grade input.

**Corollary G1c (PROVED).** A soft proof gives κ = ∞ for what it proves about ξ, in the following sense: if P(F) holds
for every F in a backward-closed class 𝒦 ∋ H_0, then P(H_{−τ}) for all τ ≥ 0, so κ(P) ≥ Λ + τ for all τ. Any input
with finite κ must use something H_{−τ} lacks for large τ — in practice the Dirichlet series or Euler product.

**Lemma G1d (backward strip growth; LEAN: `backward_strip_growth`, with de Bruijn and Rodgers–Tao as hypotheses).**
Let Y(t) := sup |Im z| over the zeros of H_t. Then Y(−τ)² ≥ 2(τ + Λ) ≥ 2τ for every τ ≥ 0. (The Lean statement is
only 2ε ≤ Y(−ε)²; the Λ-term form follows in one line from the hypothesis. R2.)

*Proof.* De Bruijn applied to H_{−τ}: Λ(H_{−τ}) ≤ Y(−τ)²/2; Λ(H_{−τ}) = Λ + τ. ∎

So the strip of H_{−τ} opens at least like √(2τ). It follows that "Strip_Y holds at H_{−τ}" forces
τ ≤ Y²/2 − Λ (LEAN: `strip_survival_cap`); for QRH, τ_QRH(ξ) ≤ 9/32 (LEAN: `qrh_survival_cap`).

---

## 3. The strip ladder

**Theorem G2.** For 0 < Y: κ(Strip_Y) = Y²/2.

*Upper bound (CITED).* De Bruijn 1950 Thm 13: F ∈ 𝒞 ∩ Strip_Y ⇒ F_t real-rooted for t ≥ Y²/2.

*Lower bound (PROVED).* Fix c > 0 and let F(z) = (z² + Y²) cos(cz).

(a) *Exact flow.* F_t(z) = e^{tc²}[z² cos(cz) + 4ct z sin(cz) + b(t) cos(cz)], b(t) = Y² − 2t − 4c²t².
Check: with G = e^{−tc²}F_t, ∂_t G = −(∂² + c²)G, and (∂² + c²)(z² cos) = 2 cos − 4cz sin,
(∂² + c²)(z sin) = 2c cos, (∂² + c²) cos = 0, which gives a′ = 4c, b′ = −2 − 2ca for G = z² cos + a z sin + b cos.
(sympy: PDE and initial residuals 0; `tmp/routes-b9-r43-witness.py`.) Equivalently, by the commutator
e^{−t∂²} z e^{t∂²} = z − 2t∂: e^{−t∂²}[(z² + Y²)G] = (z² + Y² − 2t)G_t − 4tzG_t′ + 4t²G_t″ for any G.

(b) *Counting.* Fix t > 0 and k ≥ 1 large. On the circle |z| = kπ/c, |tan(cz)| is bounded independently of k, so
|4ctz tan(cz) + b| < |z|² for large k, and by Rouché F_t has exactly 2k + 2 zeros in |z| < kπ/c, as z² cos(cz) does.
Real zeros: write g(z) = z² + b + 4ctz tan(cz), whose real zeros (off the poles) are those of F_t.
* On each interval I_j = ((j − 1/2)π/c, (j + 1/2)π/c), j ≥ 1, with z² > b on it: tan(cz) runs from −∞ to +∞
  increasing, and −(z² + b)/(4ctz) is decreasing there (its derivative is −(z² − b)/(4ctz²)); so g has exactly
  one zero in I_j. The same holds on the half interval ((k − 1/2)π/c, kπ/c), where g goes from −∞ to
  (kπ/c)² + b > 0. By evenness the same on the negative side: 2k zeros.
* Central interval (−π/(2c), π/(2c)): there z tan(cz) ≥ 0, so g ≥ z² + b. If b > 0, no zero. If b < 0, g(0) = b < 0
  and g → +∞ at both ends: at least 2 zeros, hence exactly 2 by the count.
* If b ≤ 0 then z² > b everywhere, so the monotonicity argument covers every side interval.

So for b(t) < 0 all 2k + 2 zeros are real (for every k: F_t real-rooted). For b(t) > 0 with
√b < π/(2c) the central interval is empty and the side intervals carry exactly 2k, so F_t has exactly two nonreal
zeros. b decreases from Y² at t = 0 to 0 at t* := (√(1 + 4c²Y²) − 1)/(4c²), so F_t has nonreal zeros for t just
below t* and is real-rooted for t ≥ t*. By de Bruijn monotonicity, Λ(F) = t*. ∎

(c) t*(c, Y) = Y²/2 − c²Y⁴/2 + O(c⁴) ↑ Y²/2 as c ↓ 0, and F ∈ Strip_Y.

(d) *Inside the strict class 𝒞.* F above is the transform of a compactly supported distribution. Let
g_n(u) = n^{1/4} e^{−nu⁴}/∫e^{−v⁴}dv; ĝ_n(z) = ∫ g_n cos(zu) du has only real zeros (CITED, Pólya 1926) and ĝ_n → 1
locally uniformly. F_n := F·ĝ_n is the transform of the even function (cosine-transform of F) * g_n, which is
O(e^{−|u|⁴}) — so F_n ∈ 𝒞 ∩ Strip_Y — and (F_n)_t → F_t locally uniformly for each t. By Hurwitz, the nonreal zeros of
F_t for t < t* are limits of nonreal zeros of (F_n)_t, so liminf Λ(F_n) ≥ t*. Hence κ(𝒞 ∩ Strip_Y) ≥ Y²/2. ∎

**Measured check** (`tmp/routes-b9-r43-out/witness.json`): for (c, Y) ∈ {(0.05, 0.75), (0.2, 0.75), (0.5, 0.75),
(1, 0.75), (2, 0.75), (0.2, 1), (3, 1)} the real-zero count in |z| < 6π/c is 12/14 at t = 0.97t* and 14/14 at 1.03t*
(argument principle for the total). t* = 0.280856, 0.275192, 0.250000, 0.200694, 0.135142, 0.481456, 0.141188.
Shifted quartets ((z−x₀)² + Y²)((z+x₀)² + Y²)cos(cz), exact finite-dimensional flow + bisection on the nonreal count
(MEASURED): Λ = 0.265318 (x₀ = 2), 0.277810 (5), 0.279960 (10), 0.280979 (20, c = 0.02) against Y²/2 = 0.28125;
0.489456 against 0.5 for Y = 1, x₀ = 5. Neighbouring zeros only lower Λ; holes restore Y²/2.

**Corollary G2a (QRH).** κ(QRH_{7/8}) = κ(Strip_{3/4}) = 9/32 = 0.28125; κ(QRH_{11/12}) = 25/72; κ(critical strip)
= 1/2. Here QRH means "ζ(ρ) = 0, 0 < Re ρ < 1 ⇒ Re ρ ≤ 7/8", which by the functional equation is Strip_{3/4} for H_0:

**Lemma G2b (LEAN: `Route43.qrh_symmetric_strip`).** For every ρ with riemannZeta ρ = 0 and 0 < Re ρ:
1/8 ≤ Re ρ ≤ 7/8, i.e. |2 Re ρ − 1| ≤ 3/4. Proof: the upper bound is `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`;
for the lower bound put s = 1 − ρ (7/8 < Re s < 1) and use `riemannZeta_one_sub`:
ζ(ρ) = 2(2π)^{−s} Γ(s) cos(πs/2) ζ(s), all four factors nonzero (cos(πs/2) = 0 would force s to be an odd integer).
Axioms: propext, Classical.choice, Quot.sound. The trust base is the OAI build (Lean-checked locally, statement
matches the comparator challenge, not peer-reviewed; `openai-math-integration-2026-10-08.js`).

So **QRH alone certifies Λ ≤ 9/32 and nothing better** in 𝒞: no argument valid on 𝒞 that uses only "zeros in the
7/8 half-plane" can give Λ < 9/32. Caveat on the class: the witnesses have zeros at ±iY, which Φ > 0 forbids
(H(iy) = ∫Φ cosh(yu) > 0), and bounded zero density. For the narrower class with Φ > 0 and ξ-like zero counting only
κ ≤ 9/32 is established; the shifted quartets above and the MV-CAP hole models (MEASURED) put the pair at large
ordinate with Λ within 3·10⁻⁴ of Y²/2, but positivity of their Φ is not checked. Every smaller value from the QRH start (0.1185 Raymond chain,
0.1177 route P) uses further arithmetic inputs: verified height to 3·10¹² and the effective approximation of H_t at
t > 0 (G0), which are ξ-specific.

---

## 4. Tail-blind inputs

Call P *tail-blind* if the witnesses F_n of Theorem G2(d) satisfy P for all Y and all small c. These witnesses have
all zeros real except one pair at ordinate 0, so:

**Theorem G3 (PROVED).** Each of the following P is tail-blind, hence κ(P ∧ Strip_Y) = Y²/2 for every Y > 0: in
particular κ(P ∧ critical strip) = 1/2 and κ(P ∧ QRH) = 9/32, and κ(P) = ∞ on its own (let Y → ∞). Such inputs give
no Λ-information beyond the strip they are combined with:
* proportion statements liminf N₀(T)/N(T) ≥ κ₀ (any κ₀ ≤ 1; Selberg, Levinson 1/3, Conrey 2/5, PRZZ 5/12,
  Alpöge–Furman 2/3 [preprint], Lamzouri);
* zero-density statements N(σ, T) ≤ C T^{A(1−σ)} (log T)^B for σ > 1/2 (Ingham, Huxley, Guth–Maynard): the
  witness has N(σ, T) = 0 (its pair has ordinate 0);
* "all but finitely many zeros are real";
* Selberg-type "almost all zeros within (log log T)/log T of the line" in the ordinate-counted form.

*Proof.* Direct check on F_n; then Theorem G2. ∎

The witnesses are not ξ-like: their real zeros have bounded density instead of (1/4π) log(x/4π). In the ξ-like class
(functions sharing N(T) = (T/2π) log(T/2πe) + O(log T)), the corresponding statement is the MV-CAP window theorem
(`mv-cap-theorem.md`, internal; Theorem C: zero-side mean-value premises have window sensitivity ≤ 19.3 zeros, density
premises ≤ 1) together with its heat-flow model (MEASURED: an off-line pair in a hole of ≥ 7 mean spacings stays
above y₀ until t₀, and its lifetime tends to y²/2 as the hole grows). Second-order heuristic for a pair at ordinate 0
in front of a real-rooted G with zeros ±x_k: Λ((z² + Y²)G) ≈ Y²/2 − (Y⁴/2) Σ_k x_k^{−2} (from the commutator formula
of G2(a), b_eff(t) = Y² − 2t − 4t² G_t″(0)/G_t(0)); for G = H_{0.2}, Σ x_k^{−2} ≈ 0.023 and the loss is 0.0036 at
Y = 3/4 (HEURISTIC).

So the NS-RIGID loophole class (proportion / density / mollified moments) is arithmetic and flow-critical *as a
method* (H_{−τ} has no Dirichlet series), but its *statements* have zero κ-gain over the strip. This is the κ-form of
MV-CAP: the step from "almost all" to "all" is the entire κ-content.

---

## 5. Weil positivity at fixed support: a lower-bound ladder (R3)

**Setting.** For F ∈ 𝒞 and g ∈ L²[−T, T], ĝ(z) = ∫ g(u) e^{izu} du, put
W_T^F(g) := Σ_{F(ζ)=0} ĝ(ζ) \overline{ĝ(\bar ζ)} (zeros with multiplicity, when the sum converges). For F = H_0 this is
the zero side of Weil's explicit formula with test function g * g̃ (ĝ has type T in z = 2γ, i.e. type 2T in the
ordinate γ; RES-T's packet f̂ plays the role of ĝ, so T_RES = 2T). Real zeros contribute |ĝ(x)|² ≥ 0; a pair ±iY contributes 2 Re ĝ(iY)\overline{ĝ(−iY)}.
Weil: W_T^{H_0} ≥ 0 for all T iff RH.

**Theorem G4 (PROVED).** For F = (z² + Y²) cos(cz) with c ≥ T:
W_T^F ≥ 0 on L²[−T, T] ⟺ 2c ≥ sinh(2YT)/Y − 2T.
Hence κ(W_T ≥ 0) ≥ κ_low(T) := sup_{0<Y≤1} t*(c_min(T, Y), Y), c_min = max(T, sinh(2YT)/(2Y) − T).

*Proof.* Real zeros x_k = (k + 1/2)π/c. With A(v) = ∫ g(u)\overline{g(u − v)} du (support [−2T, 2T]),
|ĝ(x)|² = ∫ A(v) e^{ixv} dv and Poisson summation give Σ_k |ĝ(x_k)|² = 2c Σ_m (−1)^m A(2cm) = 2c‖g‖² when 2c ≥ 2T.
The pair term is ⟨g, p⟩\overline{⟨g, q⟩} + c.c. with p = e^{−Yu}, q = e^{Yu} on [−T, T]; the Hermitian form
pq* + qp* has eigenvalues ⟨p, q⟩ ± ‖p‖‖q‖ = 2T ± sinh(2YT)/Y on span{p, q} and 0 off it. So
min W_T^F/‖g‖² = 2c + 2T − sinh(2YT)/Y. The witness's Λ is t*(c, Y) by Theorem G2. The ĝ_n-regularisation of G2(d)
only adds nonnegative real-zero terms. ∎

**Check (MEASURED):** Legendre-basis discretisation (24 polynomials, exact transforms via spherical Bessel functions,
lattice truncated at |k| < 2·10⁵) reproduces the closed form at 0.9c_min and 1.1c_min to 4–5 digits, e.g. T = 2,
Y = 1: −2.32924 vs −2.32899 and 2.3286 vs 2.3290.

| T (z-type) | T_RES = 2T | κ_low(T) | maximising Y | c_min | T²κ_low | with Y ≤ 3/4 (QRH) |
| --- | --- | --- | --- | --- | --- | --- |
| 0.1 | 0.2 | 0.4951 | 1 | 0.1 | 0.005 | 0.2797 |
| 0.25 | 0.5 | 0.4721 | 1 | 0.25 | 0.030 | 0.2720 |
| 0.5 | 1 | 0.4142 | 1 | 0.5 | 0.104 | 0.2500 |
| 1 | 2 | 0.3090 | 1 | 1 | 0.309 | 0.2007 |
| 1.941 | 3.882 (= T_X at 3·10¹²) | 0.0926 | 0.561 | 1.94 | 0.349 | 0.0926 |
| 2 | 4 | 0.0872 | 0.544 | 2 | 0.349 | 0.0872 |
| 5 | 10 | 0.01396 | 0.218 | 5.00 | 0.349 | 0.01396 |
| 10 | 20 | 0.00349 | 0.109 | 10.0 | 0.349 | 0.00349 |
| 50 | 100 | 1.396·10⁻⁴ | 0.022 | 50.0 | 0.349 | 1.396·10⁻⁴ |

For large T the optimum has c = T and YT ≈ 1.09, giving κ_low ≈ 0.349/T² = 1.40/T_RES². Restricted to Y ≤ 3/4
(W_T ∧ QRH) the values coincide with the unrestricted ones for T ≥ 1.45 (the maximising Y is then below 3/4).

Reading: fixed-support Weil positivity is an intermediate input at every finite T and the grades decrease
continuously to 0. An upper bound on κ(W_T) is open (it would need a theorem that W_T ≥ 0 forces a strip whose width
shrinks with T, which RES-T says is false at large height in the ξ-like class: W_T is blind to off-line pairs above
height ≈ 2π exp(δ²S⁴T³_RES)). The witness has bounded zero density; in the ξ-like class the density log(x/4π)/4π grows
and RES-T's resolution law takes over.

---

## 6. The native span: no intermediate grade (MEASURED)

NS-RIGID (imp-95530) A4(i) shows each finite native-span statement P_S ("the Carathéodory–Pick matrix of ξ'/ξ at
the real nodes S is PSD") survives backward flow for some ε₀(S) > 0; imp-95531 measured ε₀(S) ≥ W(S), 5–8 orders
above the Lehmer collision. Recomputed at 60 digits (`tmp/routes-b9-r43-pick.py`, `routes-b9-r43-out/pick.json`):

| ε | {1,2} | {1,2,4} | {1,2,4,8} | {0.55,1,3,10} | κ₄ of Φe^{−εu²} | κ₆ |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 8.75e-4 | 3.242e-5 | 2.327e-6 | 2.659e-7 | −2.79e-5 | 5.41e-7 |
| 1 | 8.15e-4 | 2.900e-5 | 2.022e-6 | 2.313e-7 | −2.59e-5 | 4.80e-7 |
| 10 | 4.45e-4 | 1.125e-5 | 6.12e-7 | 7.07e-8 | −1.41e-5 | 1.77e-7 |
| 10² | 1.11e-5 | 3.02e-8 | 4.07e-10 | 4.84e-11 | −3.46e-7 | 3.89e-10 |
| 10³ | 3.91e-9 | 1.39e-13 | 8.95e-17 | 1.07e-17 | −1.22e-10 | 1.37e-15 |
| 10⁴ | 4.50e-13 | 1.66e-19 | 1.35e-24 | 1.62e-25 | −1.41e-14 | 1.53e-21 |
| 10⁵ | 4.57e-17 | 1.70e-25 | 1.41e-32 | 1.69e-33 | −1.43e-18 | 1.55e-27 |

(entries = λ_min(P_S(ε); G); the ε = 0…100 values reproduce imp-95530's baked sweep.) All positive to ε = 10⁵, so
κ(P_S) ≥ Λ + 10⁵ for these S: grade "soft" for practical purposes.

*Mechanism (leading-order asymptotics, a derivation; the sign of γ₄ is MEASURED).* With M(a) = ∫ Φe^{−εu²} cosh(au) and
a = 2(s − 1/2), φ = 2(log M)′ = 2Σ_k κ_{2k} a^{2k−1}/(2k−1)!, so P_S = 4κ₂ J + (2/3)κ₄ [a_i² − a_ia_j + a_j²] + ….
On the complement of the all-ones vector the κ₄ term is −(2/3)κ₄(Σ x_i a_i)², positive iff κ₄ < 0. For large ε,
κ₄ ≈ 24γ₄/(2ε)⁴ where γ₄ = −95.343 is the u⁴ Taylor coefficient of log Φ (MEASURED, 60 digits; log Φ = −0.80587
− 37.4538u² − 95.3433u⁴ + 137.666u⁶ − …), consistent with λ_min({1,2}) ∝ ε⁻⁴ in the table. On {1, a}^⊥ the next term
is (κ₆-coefficient)(Σ x_i a_i²)², and κ₆ > 0 throughout. The cumulant signs alternate (κ₄ < 0 < κ₆), the pattern
expected for even measures whose Laplace transform has only imaginary zeros (Lee–Yang type, the ε = 0 case under RH);
here it persists for ε up to 10⁵, although for ε > 0 the zeros are not all imaginary (Rodgers–Tao).

So on the native span κ jumps from (practically) ∞ for every finite S to 0 for the Müntz-complete family (NS-RIGID
A5); lacunary families are open. This is NS-RIGID's "no intermediate object", now located: it is a property of the
native-span test cone (kernels 1/(s − ρ) decay with the height of ρ, so finite families are tail-blind and soft),
not of arithmetic inputs in general.

---

## 7. Survival on ξ: does H_{−τ} keep any strip? (MEASURED / HEURISTIC)

Lemma G1d gives Y(−τ) ≥ √(2τ). Is Y(−τ) finite? Method: H_{−τ}(z) = E[H_0(z − W)], W ~ N(0, 2τ), with
H_0(x + iy) = ξ((1+y)/2 − ix/2)/8 computed from Arb zeta and lgamma (python-flint, 80 bits), Gauss–Hermite averaging,
zero counts by the argument principle on rectangles above the critical strip (`tmp/routes-b9-r43-backstrip.py`).

| τ | x-range | y-range | zeros | step / nodes |
| --- | --- | --- | --- | --- |
| 0 (control) | [2000, 2010] | [1.05, 4] | 0 | 0.05 / – |
| 0.5, 4 | [2000, 2010] | [0.02, 1.05] | 0, 0 | 0.02 / 80 |
| 4 | [2000, 2010] | [1.05, 4] | 0 | 0.05 / 60 |
| 1 | [0.5, 200.5] | [1.05, 8] | 0 | 0.05 / 80 |
| 4 | [0.5, 200.5] | [1.05, 8] | 7 | 0.05 / 80 |
| 1 | [5000, 5050] | [1.05, 3] | 7 | 0.05 / 80; rechecked 7.0015 at 0.02 / 120 |

Located by bisection of rectangles (boxes ≤ 0.3; `routes-b9-r43-out/locate_*.json`):
* τ = 4, x ≤ 200: (x, y) ≈ (101.2, 2.24), (122.7, 2.68), (136.2, 1.81), (156.9, 3.11), (171.3, 2.03), (178.5, 2.90),
  (193.0, 3.55). The largest, 3.55, exceeds the forced value √8 = 2.83 of Lemma G1d.
* τ = 1, x ∈ [5000, 5050]: (5001.7, 1.66), (5008.9, 1.90), (5015.7, 1.90), (5028.6, 1.66), (5034.3, 1.66),
  (5040.3, 1.42), (5049.1, 2.39) — about 7 escaped zeros per 50 units of x, against about 24 zeros of H_0 there
  (mean spacing 4π/L = 2.1). By the symmetry z ↦ z̄ each has a mirror at −y.

*Heuristic law.* Writing H_{−τ} through the Riemann–Siegel saddles of Φ, the n-th term carries the factor
e^{−τν_n²} with ν_n = L/4 − (log n)/2, L = log(x/4π) (the same computation that for t > 0 gives Polymath's
b_n^t = e^{(t/4) log² n} and s* with Re s* = (1+y)/2 + (t/4)L). For t = −τ, Re s* = (1+y)/2 − τL/4 becomes negative
and the dominant terms move from n = 1 to n ≈ N e^{−(1+y)/τ}; once several terms compete, zeros appear at that y. So
zeros of H_{−τ} reach |Im z| ≈ τL/2 − 1 at height x: for τ = 1 the threshold for y > 1 is x ≈ 4πe⁴ ≈ 690, for τ = 4 it
is x ≈ 34; in general escape from the critical strip needs x ≳ 4π e^{4/τ}, e.g. τ ≳ 0.149 at the top of the verified
range x = 2·3·10¹² (τ = 0.1 needs x ≈ 3·10¹⁸). Both measured cases fit (none for τ = 1 below x = 200; seven at
x ≈ 5000). The law predicts zeros of H_{−4} near x = 2000 up to y ≈ 9; none were found in a 10-unit window at y ∈ [1.05, 4], so the zero density in the
escaped region is low there and the law is a reach, not a density (open).

**Consequence (CONDITIONAL on the escape law for every τ > 0).** For every Y < ∞, τ_{Strip_Y}(ξ) = 0: the critical strip,
every classical zero-free region (β < 1 − c/log t), QRH, density statements (positive proportion of zeros of H_{−τ}
at distance ≍ τ log x from the line), and proportion statements (sign changes of H_{−τ} on the real line become a
vanishing fraction if the zeros spread over a band of width ≍ τ log x — HEURISTIC) are all flow-critical at ξ.
None is RH-equivalent. Binary flow-criticality is then a mark of *uniform-in-height* statements, not of RH strength.

**Unconditional local counterpart (PROVED, classical).** A statement about the zeros in a compact window that holds
with strict margin (an open condition, e.g. RH below height A with simple zeros) is flow-stable, and so is any strict
inequality between finitely many quantities that are continuous in the flow time (NS-RIGID A2 for P_S under RH):
H_{−τ} → H_0 locally uniformly as τ → 0 (dominated convergence in the u-integral) and Hurwitz keeps zero counts in the
window; simple real zeros of a real function stay real (sign changes persist). So flow-criticality at ξ
is decided entirely by the behaviour at unbounded height.

---

## 8. Placement table

κ = flow-criticality degree (Definition 1.1) in the de Bruijn class 𝒞, without imposing Φ > 0 or ξ-like zero
counting on the witnesses (with those class properties imposed, the lower bounds rest on the shifted-quartet witnesses:
MEASURED, positivity of their Φ unchecked); τ(ξ) = survival at ξ (Definition 1.2).

| input | method | κ (with the critical strip) | κ (with QRH) | τ(ξ) | grade of the κ entry |
| --- | --- | --- | --- | --- | --- |
| class properties (FE form, order 1, Φ > 0, N(T) main term) | soft | 1/2 (∞ alone) | 9/32 | ∞ (flow-invariant) | PROVED (G1c) |
| ζ ≠ 0 for Re s ≥ 1 (critical strip) | arithmetic | 1/2 | 9/32 | ≤ 1/2; 0 if escape law | PROVED (G2) + CITED de Bruijn |
| classical zero-free regions (dlVP, VK, MTY) | arithmetic | 1/2 (the region tends to the strip) | 9/32 | 0 if escape law | upper CITED; lower PROVED for regions stated for |t| ≥ t₀ (ordinate-0 witness, e.g. MTY for |t| ≥ 2), MEASURED for regions stated at all ordinates (shifted quartets; with the region imposed at ordinate 0 the witness gives ≥ 0.115 for MTY's constant) |
| **QRH 7/8 (openai/math 003)** | arithmetic (DH violates it) | **9/32** | – | ≤ 9/32 (LEAN, abstract); 0 if escape law | PROVED + LEAN strip |
| QRH 11/12 | arithmetic | 25/72 | 9/32 | ≤ 25/72 | PROVED |
| zero density N(σ,T) (incl. Guth–Maynard) | arithmetic | 1/2 | 9/32 | 0 if escape law with positive density (as measured near x = 5000) | PROVED (G3) |
| proportions (Selberg … PRZZ 5/12, AF 2/3 preprint) | arithmetic (method needs Dirichlet coefficients) | 1/2 | 9/32 | open; 0 if real-zero fraction of H_{−τ} → 0 | PROVED (G3) |
| all but finitely many zeros on the line (hypothetical for ζ) | – | 1/2 | 9/32 | 0 if H_{−τ} has infinitely many nonreal zeros (expected; Rodgers–Tao-type) | PROVED (G3) |
| RH to height A (verified height) | computation | 1/2 | 9/32 | > 0 (compact window, section 7) | upper CITED; lower MEASURED (quartets above A) |
| verified height + effective approximation at t > 0 (PT package) | arithmetic + computation | ≤ 0.2 | ≤ 0.1177 (CONDITIONAL: G0, route-P ledger) | > 0 | CITED PT; conditional chain |
| finite native-span P_S (NS-RIGID) | explicit formula at real nodes | 1/2 (alone ≥ 10⁵, practically ∞) | 9/32 | ≥ 10⁵ measured | MEASURED |
| all-S native span (Lagarias–Pick) | – | 0 | 0 | 0 | NS-RIGID A5 |
| Weil W_T ≥ 0, fixed T (Yoshida range unconditional) | arithmetic (explicit formula) | ≥ κ_low(T) (0.41 at T_RES = 1; 0.093 at T_X = 3.88; ≈ 1.40/T_RES²) | ≥ 0.250 (T_RES = 1); = κ_low for T_RES ≥ 2.9 | open | PROVED lower bound (G4) |
| Weil W_T ≥ 0 all T | – | 0 | 0 | 0 | Weil criterion |
| RH, Li, Nyman–Beurling, Robin | – | 0 | 0 | 0 | RH-equivalent |

No unconditional natural example of "flow-critical at ξ but not RH-equivalent" is established here. The natural
candidates in the table are conditional on the escape law of section 7 (strip-type and density statements) or on
H_{−τ} having infinitely many nonreal zeros for every τ > 0 ("all but finitely many", which is itself a hypothetical
input for ζ). What is unconditional: the inequality τ ≤ κ (G1a), the exact κ values, and the local stability of
compact-window statements.

---

## 9. What is proved, and what is open

PROVED / LEAN: G1 and corollaries (LEAN abstract); backward strip growth (LEAN, with de Bruijn and Rodgers–Tao as
hypotheses); QRH symmetric strip (LEAN, trusting OAI 003); exact witness Λ formula and κ(Strip_Y) = Y²/2 (paper proof,
upper half CITED); tail-blindness G3; Weil witness criterion G4 and κ_low(T).
MEASURED: witness counts; shifted quartets; Pick survival to 10⁵ with alternating cumulants; zeros of H_{−1} and
H_{−4} outside the critical strip.
HEURISTIC: the escape law y_max ≈ τL/2 − 1; vanishing real-zero fraction of H_{−τ}; second-order loss formula.
OPEN: an upper bound on κ(W_T); κ of lacunary native-span families; a proof that Y(−τ) = ∞ for every τ > 0 (would
make the binary classification of section 7 unconditional); κ of the ξ-like class versions (MV-CAP gives the
mechanism, not exact values).

Nothing here proves or refutes RH and no Λ bound moves. QRH's 9/32 is a ceiling for what QRH alone can give, and the
conditional 0.1177/0.1185 values need the further inputs listed in `openai-math-integration-2026-10-08.js`.
