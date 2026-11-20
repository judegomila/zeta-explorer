# b-mvcap-function-side: function-side MV-CAP (route 42), sharp resolution threshold

Date: 2026-11-16. Slug `b-mvcap-function-side`. Working files only (this directory). Nothing committed, no Λ bound moves.
RH is open. PT Λ ≤ 0.2 stands. NO QED.

Grades: PROVED (complete argument written here; internal, no referee) / CLASSICAL / CERTIFIED-FLOAT (finite computation
inside a proof, IEEE double, closed forms and 1-D quadratures) / MEASURED / HEURISTIC / OPEN.

## 0. Verdict

Route 42 left open whether explicit function-side L² inputs escape MV-CAP; the internal referee had shown that the
Theorem A counter-model (lattice window replacement) is excluded by a σ = 2 short-interval mean value. Result here:

1. **Function-side MV-CAP is a theorem up to an explicit resolution threshold, and has no counter-model beyond it.** In every window
   where the zeros of ζ are real and simple (hypothesis H_W), there is a counter-model F_c = ζ·R_c in the route-42 class
   with
   * the zeros of ζ outside the window, one conjugate pair off the line inside it (N₀ −2, |ΔN(T)| ≤ 1, ΔN(σ,T) = 0),
     and |Z_F − Z| ≤ 1.6·|Z(t_m)| on the central half-window of the critical line (Proposition 2′);
   * a violation of H_desc(p) at t = 0 for every p > 0;
   * sup over Re s ≥ σ of |F_c/ζ − 1| ≤ 2Ê + Ê², with Ê ≤ C·|Z(t_m)|·(c/2π)^{−(σ−½)/2}, C ≤ 2.44 at σ = 2 (Theorem 2;
     t_m is a local extremum of Z next to the window centre).
   At the lane bottom c = 3.1·10^12, Ê ≤ 4.1·10⁻⁹·|Z(t_m)| on Re s ≥ 2, and Ê ≤ 8.7·10⁻⁶ using only the explicit
   bound |ζ(½+it)| ≤ 0.618 t^{1/6} log t; at the lane top 7.5·10^16, Ê ≤ 2.2·10⁻¹²·|Z(t_m)| and Ê ≤ 3.4·10⁻⁸.
   The referee's excluding premise had relative error ≈ 3·10⁻² (error ≈ 10 on a baseline of 324).
2. **The threshold is sharp (Theorem 1).** If F has the functional equation of ζ and |F − ζ| ≤ ε on Re s = σ over a
   window, then |Z_F − Z| ≤ ε·(c/2π)^{(σ−½)/2}·(1 + o(1)) at the window centre. So a sign change of Z guarded by an
   extremum |Z(t_m)| cannot be removed below ε* = |Z(t_m)|·(c/2π)^{−(σ−½)/2}. Theorem 2 attains ε* within a factor
   2ζ(σ)·C ≈ 8 (σ = 2).
3. **What escapes.** A function-side premise on Re s ≥ σ certifies an every-window statement only if its relative slack
   at ζ is below ε*. In Dirichlet-series terms ε* = |Z(t_m)|·N^{½−σ} with N = (c/2π)^{1/2}: the size of the block of
   terms n ≈ N at square-root cancellation. Such a premise fixes Z_F to Z on the window to within the local extrema of
   Z. It is a pointwise Riemann–Siegel-length evaluation, i.e. the verified-height wall, not a mean value.
4. **Euler-product input.** The exact positive-definiteness of u ↦ log F(σ+iu) for σ > 1 (equivalent to an Euler
   product with Λ(n) ≥ 0) has zero slack and is violated by every counter-model of this note (Proposition 3). Every
   consequence of it that has relative slack > 2Ê + Ê² on Re s ≥ σ is satisfied by the counter-model. I found no
   statement in between that is provable; the attempt to prove an every-window certificate from Λ(n) ≥ 0 twisted
   second moments ends at this dichotomy (section 6).

Status: `partial-result`. The cap is conditional on H_W for the chosen window (unknown above the verified height;
measured at c = 3.1·10^12 and 7.5·10^16 by sign-change counts with a Turing-style mean-S consistency check in double
precision, not an interval-rigorous verification). It is proved for the t = 0 literal
form of H_desc; the mirror instance (y ≥ y₀ = 0.165, M₀ < p_req) is MEASURED (58 of 60 trial positions at 3.1·10^12,
2 of 60 at 7.5·10^16); the t > 0 mirror statement stays conditional on route 42's Lemma 5.

## 1. Plan, and what is new against the atlas and the walls

* Atlas (PR #27, `research/rh/modules/historical-routes.md`): no section treats window-replacement models or premise
  sensitivities; §9 (dual certificates) and §7 (arithmetic rigidity of modified delays) are the nearest. Nothing here
  re-runs a closed route. Route 42 (`src/data/route-42-formal-mv-cap-2026-10-10.js`,
  `formalization/paper/mv-cap-theorem.md`) is the direct predecessor; fifty-routes synthesis item 12 states the open
  question answered here ("a counter-model surviving explicit σ ≥ 1 L² inputs, or a proof that explicit L² mean values
  at σ > ½ force the local count"). Both halves are answered for σ > 1: a counter-model exists below ε* (Theorem 2),
  and above ε* the data force every guarded sign change of Z (Theorem 1), so no counter-model of that kind exists.
* New objects: (a) the *cluster lift* F = ζ·(p + q)/p with p the product over all window zeros and deg q ≤ 2, instead of
  replacing the window by a lattice; (b) the exact identity that converts |q/p| on Re s = σ into a ξ-ratio times an
  exterior factor controlled by zero counts outside the window only; (c) the matching lower bound by the two-constants
  theorem with the functional equation used on both sides of the strip.
* Walls. DH: section 7. Flow-blindness: not used (the result is an obstruction, not a positivity proof). MV-CAP: this is
  the wall being measured. Verified height: the escape premise is identified with it (item 3 above).

## 2. Setting

G(s) = ½ s(s−1) π^{−s/2} Γ(s/2), ξ = Gζ, Ξ(t) = ξ(½+it) (real, even, order 1), Z(t) the Hardy function, |Z(t)| = |ζ(½+it)|.
Coordinates: s = ½ + a + iu ⇔ t = u − ia; a zero ρ = ½ + ig of ζ is the real zero g of Ξ.
N(T) = M(T) + E_N(T), M(T) = (T/2π) log(T/2πe) + 7/8, M′(u) = (1/2π) log(u/2π). Input (Trudgian 2014, as quoted in
route 42): |E_N(T)| ≤ B(T) = 0.112 log T + 0.278 log log T + 2.510 for T ≥ e; for 0 < T < e, |E_N| ≤ 7/8. Below B := B(2c).
L_c = log(c/2π), dens_c = L_c/2π.

**Class 𝒜(K₀)** as in route 42 §5: ξ_F = G·F entire of order 1, ξ_F(s) = ξ_F(1−s), ξ_F(s̄) = conj ξ_F(s), ξ_F(1) = ½,
zeros in the classical zero-free region, |E_{N_F}| ≤ B + K₀.

**H_W(c, h).** Every zero of ζ with |Im ρ − c| ≤ h lies on the critical line and is simple, and c ± h are not
ordinates. (True for c + h below the verified height. Not known in the lane.)

**Cluster.** C = {g₁ < … < g_k} the ordinates in I = [c−h, c+h]; p(t) = Π_{g∈C}(t − g); ν(t) = (t² + ¼)/(c² + ¼);
e(t) = Ξ(t)/p(t) (entire, no zeros with real part in I). A(u) := log|p(u − ia)| (the logarithmic potential of the
cluster on Re s = ½ + a).

**Cluster lift.** For a real polynomial q with deg q ≤ k − 1 and q(±i/2) = 0 put ρ_q(t) = 1 + q(t)/p(t),
R(s) = ρ_q(t)ρ_q(−t) with t = −i(s − ½), and F = ζ·R.

**Lemma 0 (realisation; PROVED, same proof as route 42 Lemma 1).** F ∈ 𝒜 formally: ξ_F is entire of order 1, even
and real in t; ξ_F(1) = ξ(1) because ρ_q(±i/2) = 1; R → 1 as |s| → ∞ (so the κ of route 42 is 1 and R(1) = 1 hold
together); the zeros of ξ_F are those of ξ outside ±C together with ± the roots of p + q. F is not a Dirichlet series.

## 3. Theorem 1 (forcing; PROVED, CLASSICAL tools)

Let χ(s) = G(1−s)/G(s), so ζ(s) = χ(s)ζ(1−s), |χ| = 1 on the critical line, χ(s)χ(1−s) = 1, |χ(s̄)| = |χ(s)|.

**Theorem 1.** Let a > 0, c − H ≥ 1, Q = {|Re s − ½| ≤ a, |Im s − c| ≤ H}. Let D be holomorphic on Q and on its
conjugate, with D(s) = χ(s)D(1−s) and D(s̄) = conj D(s). Suppose |D(½ + a + it)| ≤ ε for |t − c| ≤ H and |D| ≤ M on Q.
Then

  |D(½ + ic)| ≤ X · ε^{1−ω} · M^{ω},  X = max_{|t−c|≤H} |χ(½+a+it)|^{−1/2} = ((c+H)/2π)^{a/2}(1 + O(1/c)),
  ω ≤ (4/π) / sinh(πH/(2a)).

*Proof.* χ has no zeros or poles on Q, so V := D·χ^{−1/2} is holomorphic on Q. On Re s = ½ + a, |V| ≤ εX. On
Re s = ½ − a, |V(s)| = |χ(s)|^{1/2}|D(1−s)| and 1 − s = ½ + a − it, so |D(1−s)| = |D(½+a+it)| ≤ ε by reality, and
|χ(½−a+it)|^{1/2} = |χ(½+a+it)|^{−1/2} ≤ X. On the horizontal sides |V| ≤ MX. log|V| is subharmonic; the harmonic
measure at the centre of the two horizontal sides is at most twice that of the base of a half-strip of width 2a seen
from distance H, which is (2/π) arctan(1/sinh(πH/2a)) (map by sin(πz/2a)). |V(½+ic)| = |D(½+ic)|. ∎

**Corollary 1 (PROVED).** For F ∈ 𝒜, D = F − ζ satisfies the hypotheses, and |D(½+it)| = |Z_F(t) − Z(t)|. If
X ε^{1−ω}M^{ω} < min(|Z(e₁)|, |Z(e₂)|) for two consecutive local extrema e₁ < e₂ of Z of opposite sign, uniformly for
centres in [e₁, e₂], then Z_F changes sign in (e₁, e₂). With M ≤ c^A and H = 2a log log c, M^ω → 1. So a function-side
premise on Re s = ½ + a that is satisfied only by F with |F − ζ| ≤ ε < |Z(t_m)|(c/2π)^{−a/2}(1 − o(1)) fixes every sign
change of Z guarded by extrema ≥ |Z(t_m)|.

Scope: Corollary 1 forces real zeros, it does not by itself exclude additional off-line zeros of F; with a counting
premise |N_F − N| < 2 on the window it does.

## 4. Theorem 2 (function-side cap; PROVED given H_W and the Trudgian input, constants CERTIFIED-FLOAT)

**Lemma X (exterior sum; PROVED).** Assume H_W(c,h), 20 ≤ h ≤ c·10⁻⁶. For t = c + τ − iy, |τ| ≤ h/2, 0 ≤ y ≤ 3,

  (e′/e)(t) = Σ_{g ∉ C} 1/(t − g) = K(t) − L(t) + ε₁(t),
  K(t) = (i/2) log(t/2π) − π/4,  L(t) = dens_c · log((t − c + h)/(t − c − h)) + L₂,  |L₂| ≤ 2h/c,
  |ε₁(t)| ≤ ε_X(τ) := 4Bh/(h² − τ²) + dens_c/h² + 3B/c.

*Proof.* The Hadamard sum over ±g (paired) minus the cluster is ∫_{(0,∞)∖I} dN(u)/(t−u) + ∫_0^∞ dN(u)/(t+u), for real
exterior zeros. Write N = M + E_N.
* M-part: ∫_0^∞ M′(u)[1/(t−u) + 1/(t+u)] du − ∫_I M′(u) du/(t−u). With u = 2πv, t = 2πw, b = iw (Re b = y/2π > 0;
  y = 0 by continuity) the first integral is (2w/2π)·∫_0^∞ log v/(w² − v²) dv = −(w/π)(π/2b) log b = (i/2) log(iw)
  = K(t), using ∫_0^∞ log v/(v² + b²) dv = (π/2b) log b. In the second, M′(u) = dens_c + (1/2π) log(u/c) and
  |log(u/c) − log(Re t/c)| ≤ |u − Re t|/(c − h) gives L₂.
* E-part: integration by parts on (0, c−h) and (c+h, ∞); the kernel 1/(t−u) has modulus ≤ 1/(h ∓ τ) at the cluster
  edges and total variation ≤ 1/(h ∓ τ) on each side, so the two sides give ≤ 2B/(h+τ) + 2B/(h−τ) = 4Bh/(h²−τ²)
  (B(u) grows like log u and the far part is O(B(4c)/c)). The mirrored integral is ≤ 3B/c.
* Exterior nonreal zeros come in pairs u ± iη, |η| < ½, and 1/(t−u−iη) + 1/(t−u+iη) − 2/(t−u) has modulus
  ≤ 0.51/|t−u|³; summing against dN gives ≤ dens_c/h². ∎

Consequences, with Λ(τ,y) = ½ log(((h+τ)² + y²)/((h−τ)² + y²)):
* (X1) ∂_τ log|e(c+τ−iy)| = −π/4 − dens_c Λ(τ,y) + ϑ(ε_X(τ) + 3/c + 2h/c), |ϑ| ≤ 1.
* (X2) 0 ≤ ∂_y log|e(c − iy)| + ϑ ε_X(0) ≤ 2 dens_c y/h + 2 ε_X(0)  (from Im K − Im L = dens_c·2 arctan(y/h) + O(h/c)).

**Lemma P (potential; PROVED + CERTIFIED-FLOAT).** Assume H_W(c,h) with h ≥ 300 and σ = ½ + a ∈ (1, 3.5]. Put
m_σ = inf_t |ζ(σ+it)| ≥ ζ(2σ)/ζ(σ). Then for every real u,

  A(u) − A(c) ≥ log(m_σ/|ζ(σ+ic)|) − κ,  κ := max_{0≤τ≤h/2} [∫_0^τ ε_X − dens_c ∫_0^τ Λ(·,a)] + 20h/c.

*Proof.* (i) |u − c| ≤ h/2. |p| = |Ξ|/|e| and |Ξ(u−ia)| = |G(σ+iu)||ζ(σ+iu)|, ∂_u log|G(σ+iu)| = −π/4 + O(10/c). With
(X1) the −π/4 terms cancel: A(u) − A(c) = log|ζ(σ+iu)/ζ(σ+ic)| + dens_c∫_0^τ Λ(·,a) + ϑ(∫_0^{|τ|} ε_X + 20h/c).
(ii) h/2 ≤ |u − c| ≤ h, say u ≥ u₁ = c + h/2. A(u) − A(u₁) = ∫_I f dN with f(x) = ½ log(((x−u)²+a²)/((x−u₁)²+a²)).
The M-part is dens_c(Φ(u) − Φ(u₁)) + O(h² log h/c) ≥ −10⁻⁶ since Φ(u) = ∫_I ½ log((x−u)²+a²) dx is nondecreasing for
u ≥ c. The E-part is bounded by B(|f(c−h)| + |f(c+h)| + TV_I f) ≤ B(5m̂ + 0.29), m̂ = log((D + (D²+4a²)^{1/2})/2a),
D = h/2 (f has one maximum ≤ m̂ and one minimum ≥ −m̂, f(c−h) ∈ [0, 0.288], f(c+h) ≤ 0). By (i),
A(u₁) − A(c) ≥ log|ζ(σ+iu₁)/ζ(σ+ic)| + Γ₁, Γ₁ = dens_c∫_0^{h/2}Λ − ∫_0^{h/2}ε_X. The table below has
Γ₁ > B(5m̂ + 0.29) for h ≥ 300 on the lane. (iii) |u − c| > h: every term of A is monotone in u beyond the cluster. ∎

**Theorem 2.** Assume H_W(c, h + 1) with c in the lane [3.1·10^12, 7.5·10^16], h ∈ [300, 1000] (the cluster is still the
set of zeros in [c − h, c + h]; the extra unit keeps every possible off-line zero of ζ at horizontal distance > 2 from the
window), and let σ = ½ + a ∈ (1, 3.5].
Let t_m be the point where |p/ν| is maximal on the gap of C containing c (so |t_m − c| ≤ r ≤ G_max := 2B/dens_{c−h}),
let μ* be the least value of max_gap |p/ν| over all gaps of C, attained on m ≥ 1 gaps of one sign s* (m = 1 unless
there are ties), and for η > 0 put q_η = −(1+η) s* μ* ν and F_{c,η} = ζ·R as in section 2. Then:

* (a) F_{c,η} ∈ 𝒜(1). Its zeros off the window are those of ζ. In the window it has, for small η, exactly m conjugate
  pairs off the line, at height y(η) → 0 as η → 0, and k − 2m simple real zeros, each inside a gap adjacent to the zero
  of ζ it replaces. Hence N₀ drops by 2m for T above the window, |N_F(T) − N(T)| ≤ 1 for all T, and N_F(σ′,T) = N(σ′,T)
  for each fixed σ′ > ½ once η is small.
* (b) F_{c,η} violates H_desc(p) at t = 0 for every p > 0, for η small enough (depending on p and the configuration).
* (c) For all Re s ≥ σ: |F_{c,η}(s)/ζ(s) − 1| ≤ 2Ê + Ê², with

  Ê ≤ (1+η)(1 + 5h/c) · e^{κ+κ′}/m_σ · |Z(t_m)| · (c/2π)^{−a/2},
  κ′ := dens_c(a² + 1.01 r²)/h + ε_X(0)·a + 4.1 B r/h + 20 r/c.

*Proof.* (a) p/ν has exactly one critical point in each gap: (p/ν)′/(p/ν) = Σ_j 1/(t−g_j) − 2t/(t²+¼) is strictly
decreasing there because Σ_j (t−g_j)^{−2} ≥ k/(4h²) > 2/t². So for a real level λ the equation p/ν = λ has two simple
roots in each gap of sign sgn λ with max_gap|p/ν| > |λ|, none in the other gaps of that sign, none in gaps of the
opposite sign, and at most one in each unbounded interval. With λ = (1+η)s*μ*: the m minimal gaps lose their two real
roots (which become a conjugate pair by continuity from the double root at η = 0), every other root stays real and
simple and remains in the gap adjacent to its original zero. Two roots sharing a gap move toward each other, so at most
one root crosses any given T: |N_F − N| ≤ 1. Lemma 0 gives the rest.
(b) Let z = x + iy be the nonreal zero of H₀^F of largest y in the window; by H_W(c, h+1) every other nonreal zero of
H₀^F is at horizontal distance > 2 or not higher, so z is topmost within distance 2, and it lies in the lane. As η → 0, y → 0, while the real zeros of H₀^F converge to the simple real roots of p − s*μ*ν and the
exterior zeros of ζ, all at distance ≥ d₀ > 0 from x. So P(z) = Σ_real 2y/((x−x_j)²+y²) ≤ 2y Σ_j (x−x_j)^{−2} → 0.
(c) On t = u − ia: |q_η/p| = (1+η)|ν(t)|·μ*·e^{−A(u)} ≤ (1+η)|ν(t)/ν(t_m)|·|p(t_m)|e^{−A(u)}, since
μ* ≤ |p(t_m)/ν(t_m)|. By Lemma P, e^{−A(u)} ≤ e^{−A(c)}e^{κ}|ζ(σ+ic)|/m_σ; |ν(t)/ν(t_m)| ≤ 1 + 5h/c for |u−c| ≤ 2h, and
beyond that A(u) − A(c ± h) ≥ 2 log(1 + v²/(4h²+a²)) (v the distance to the cluster, k ≥ 4) while
|ν(t)/ν(t_m)| ≤ (1 + 5h/c)(1 + v²/(4h²+a²))².
Next, |p(t_m)|e^{−A(c)} = |Ξ(t_m)/Ξ(c−ia)|·|e(c−ia)/e(t_m)|. By (X2), log|e(c−ia)/e(c)| ≤ dens_c a²/h + ε_X(0)a. By (X1)
on the real axis, log|e(c)/e(t_m)| ≤ (π/4)(t_m − c) + 1.01 dens_c r²/h + 4.1 B r/h. And
log|Ξ(t_m)/Ξ(c−ia)| = log|Z(t_m)| − log|ζ(σ+ic)| − (π/4)(t_m − c) − (a/2)L_c + O(20r/c), from
∂_u log|G(½+iu)| = −π/4 + O(10/c) and Re(G′/G)(x+ic) = ½L_c + O(c^{−2}). The π/4 terms cancel and |ζ(σ+ic)| cancels
against Lemma P. Finally R − 1 = (ρ_q(t) − 1) + (ρ_q(−t) − 1) + product, |ρ_q(−t) − 1| on Re s = σ equals |q/p| at the
reflected point of the same line, and R − 1 is bounded and holomorphic in Re s ≥ σ, so the bound extends by the maximum
principle. ∎

**Constants (CERTIFIED-FLOAT; `consts.py`, `consts.json`, `consts_grid.py`).** Ê ≤ Ê₁·|Z(t_m)|; the last column uses
|Z| ≤ 0.618 c^{1/6} log c (Hiary–Patel–Yang, as quoted). On a grid of the lane (61 log-spaced c, h = 300, 350, …, 1000,
σ ∈ {1.05, 1.25, 1.5, 2, 2.5, 3, 3.5}; 6405 points) the far-range condition of Lemma P holds with
Γ₁ − far error − κ ≥ 130, and for h ≥ 500 the prefactor (1+5h/c)e^{κ+κ′}/m_σ is at most 19.4 / 5.13 / 3.32 / 2.44 /
2.19 / 2.12 / 2.13 at these σ. Theorem 2 is claimed at grid points; between them it rests on the smooth dependence of
these closed forms on (c, h, σ), which is not separately certified.

| c | h | σ | B | κ | Γ₁ vs far error | G_max | κ′ | e^{κ+κ′}/m_σ | Ê₁ | Ê with HPY |
|---|---|---|---|---|---|---|---|---|---|---|
| 3.1e12 | 500 | 1.5 | 6.749 | 0.085 | 545.7 > 188.3 | 3.15 | 0.323 | 3.27 | 4.65e-6 | 1.0e-2 |
| 3.1e12 | 500 | 2 | 6.749 | 0.085 | 545.7 > 174.6 | 3.15 | 0.361 | 2.37 | 4.03e-9 | 8.7e-6 |
| 3.1e12 | 500 | 3 | 6.749 | 0.085 | 545.7 > 157.4 | 3.15 | 0.449 | 2.02 | 4.87e-15 | 1.0e-11 |
| 3.1e12 | 1000 | 2 | 6.749 | 0.043 | 1106.3 > 198.0 | 3.15 | 0.180 | 1.90 | 3.23e-9 | 6.9e-6 |
| 7.5e16 | 500 | 1.5 | 7.962 | 0.086 | 753.2 > 222.1 | 2.70 | 0.339 | 3.32 | 3.04e-8 | 4.7e-4 |
| 7.5e16 | 500 | 2 | 7.962 | 0.086 | 753.2 > 206.0 | 2.70 | 0.385 | 2.44 | 2.13e-12 | 3.3e-8 |
| 7.5e16 | 500 | 3 | 7.962 | 0.086 | 753.2 > 185.6 | 2.70 | 0.496 | 2.12 | 1.70e-20 | 2.6e-16 |

**Corollary 2 (function-side MV-CAP with threshold; PROVED from Theorem 2 by the soundness argument of route 42
Theorem B).** Let 𝒫 be premises true for ζ, each of one of these kinds:
* zero-side, with slack above the sensitivities of Theorem 2(a) (2m zeros for critical counts, 1 for N(T) bounds, 0 for
  N(σ′,T), and zeros outside the window unchanged);
* function-side on a half-plane: a statement about F restricted to Re s ≥ σ (σ > 1) that holds for every F with
  sup_{Re s ≥ σ}|F/ζ − 1| ≤ s_Π. This includes every statement "∫ w(t)|A(σ′+it)F(σ′+it)|² dt ∈ [main − E, main + E]"
  with σ′ ≥ σ, w ≥ 0, any Dirichlet polynomial A, whenever ζ satisfies it with room E_slack ≥ 3 s_Π ∫ w|Aζ|²; every
  pointwise bound |F(σ′+it)| ≤ U(t) with relative room; every bound on log F or F′/F on Re s ≥ σ′ > σ with room
  (Cauchy on discs of radius σ′ − σ).
If for some window satisfying H_W every function-side slack exceeds 2Ê + Ê², then 𝒫 ∪ Ax(𝒜(1)) ⊬ H_desc(p) for every
p > 0 (t = 0 literal form). Models in disjoint windows multiply and their sensitivities add.

So a certifying function-side premise on Re s ≥ σ must hold at ζ with relative slack below
≈ 2.4·|Z(t_m)|·(c/2π)^{−(σ−½)/2}·2: at σ = 2, below 8.1·10⁻⁹·|Z(t_m)| at the lane bottom and 4.3·10⁻¹²·|Z(t_m)| at
the top. By Theorem 1 no smaller threshold than |Z(t_m)|(c/2π)^{−(σ−½)/2} is possible for removing that sign change.

**Proposition 2′ (critical line, central half-window; PROVED).** In the setting of Theorem 2, for real t = c + τ with
|τ| ≤ h/2,

  |Z_F(t) − Z(t)| ≤ (1+η)(1 + 5h/c)² e^{κ″} |Z(t_m)| · exp(−dens_c·h·φ(τ/h) + ∫_0^{|τ|} ε_X),
  φ(θ) = (1+θ)log(1+θ) + (1−θ)log(1−θ) ≥ θ²,  κ″ = 1.01 dens_c r²/h + 4.1 B r/h.

*Proof.* On the real axis |Z_F − Z| = |Z|·|ρ_q(t)ρ_q(−t) − 1|, |Z/p| = |e|/|G(½+it)|, and μ* ≤ |p(t_m)|/ν(t_m), so
|Z_F − Z|(t) ≤ (1+η)(1+5h/c)|ν(t)/ν(t_m)|·|Z(t_m)|·(|e(t)|/|G(½+it)|)/(|e(t_m)|/|G(½+it_m)|); (X1) with y = 0 and
∂_u log|G(½+iu)| = −π/4 + O(10/c) give the exponent (the π/4 terms cancel). ∎

For h = 500 on the lane, e^{κ″} ≤ 1.30 and the profile exp(−dens_c τ²/h + 5.4B|τ|/h) is ≤ 1.17 and falls below e^{−1}
for |τ| ≥ 16. So a twisted second moment ∫ w(t)|A(½+it)|²|F(½+it)|² dt changes by at most ∫ w|A|²(2|Z|Δ + Δ²) with
Δ(t) ≤ 1.6·|Z(t_m)| supported, up to Gaussian tails, in |t − c| ≤ 16. A critical-line L² premise certifies the window
only if its slack is below this, i.e. below ≈ |Z(t_m)| times the L¹ mass of w|A|²|Z| over a window of length ≈ 32.
(Beyond |τ| = h/2 the decay continues; that range is MEASURED only, section 5.2.)

Not covered (stated limits of Corollary 2): σ ≤ 1 off the critical line (m_σ has no unconditional lower bound; MEASURED
Ê at σ = 1 below); the critical line beyond the central half-window (MEASURED); zero-slack premises (section 6).

## 5. Measured models (actual zeros; MEASURED)

Zeros from a double-precision Riemann–Siegel sampler with mpmath phases (`rs.py`, `rs_big.py`), validated against
mpmath.siegelz (5·10⁵: 10⁻⁶; 3.1·10^12: ≤ 5·10⁻⁸, `validate.log`). Blocks: 5·10⁵ ± 62 (223 zeros), 3.1·10^12 ± 62 (530
sign changes; θ-count 531.4), 7.5·10^16 ± 16 (189 sign changes; θ-count 188.5; 1.09·10⁸ Riemann–Siegel terms per sample, computed on the motherbox,
not cross-checked against a second implementation at that height: the same code path agrees with mpmath at 3.1·10^12,
and the double-precision rounding budget is ≤ 10⁻⁹). `turing.py`: the mean of N_found − θ-count over six sub-intervals
varies by 0.09 / 0.07 / 0.20 on the three blocks (a missed pair would shift it by 2). Cluster = zeros within ±h of the
block centre; h = 50 at the first two heights and h = 12 (141 zeros) at 7.5·10^16.
E denotes sup_τ |q/p| on Re s = ½ + a (grid over |τ| ≤ 4h + 10). Scripts `model2.py`, `run2.py`, `run3.py`; outputs
`out_*.json`.

**5.1 Potential identity (Lemma P(i)).** max |A(u) − A(c) − log|ζ(σ+iu)/ζ(σ+ic)| − dens·h·φ(τ/h)| over |τ| ≤ h/2:
0.41 / 0.45 (5·10⁵, σ = 2 / 3, h = 50), 0.50 / 0.39 (3.1·10^12, h = 50), 0.56 / 1.16 (7.5·10^16, h = 12);
max |err/τ| ≤ 0.020 (h = 50) and ≤ 0.19 (h = 12) against the proved bounds ε_X ≈ 4B/h = 0.54 and 2.65.
min_u A(u) − A(c) = −0.38 … 0.00.

**5.2 Minimal lift (Theorem 2 model, η = 10⁻³; h = 50 unless stated).**

| height | t_m − T₀ | \|Z(t_m)\| | nonreal zeros | sup_T \|ΔN\| | E σ=1 | E σ=2 | E σ=3 | \|Z(t_m)\|(T/2π)^{−3/4}/\|ζ(2+ic)\| | sup\|Z_F − Z\| | Δ∫Z² on block (∫Z²) |
|---|---|---|---|---|---|---|---|---|---|---|
| 5·10⁵ | +2.866 | 0.2231 | 2 | 1 | 3.2e-2 | 8.0e-5 | 2.9e-7 | 3.6e-5 | 0.31 | −4.0 (1561) |
| 3.1·10^12 | −1.378 | 0.002103 | 2 | 1 | 5.7e-6 | 6.9e-12 | 1.2e-17 | 4.7e-12 | 0.0025 | −0.0064 (3190) |
| 3.1·10^12, central gap | −0.073 | 0.891 | 12 | 2 | 2.0e-3 | 2.4e-9 | 4.2e-15 | 2.0e-9 | 0.89 | +1.1 (3190) |
| 7.5·10^16 (h = 12) | +0.622 | 0.01639 | 2 | 1 | 3.5e-6 | 5.7e-14 | 3.4e-21 | 1.6e-14 | 0.019 | −0.061 (745) |
| 7.5·10^16, central gap (h = 12) | −0.112 | 8.10 | 20 | 2 | 1.5e-3 | 2.4e-11 | 1.4e-18 | 7.7e-12 | 8.2 | +94 (745) |

The 3.1·10^12 block contains a close pair (gap 0.01426 = 0.061 mean spacings; Z = +0.0021 between, checked with
mpmath). Lifting it moves 4 other zeros by more than 10⁻³ (largest shift 0.040) and changes ζ on Re s ≥ 2 by a
relative 1.4·10⁻¹¹. Theorem 2's bound for this t_m is 4.03·10⁻⁹·0.0021 = 8.5·10⁻¹² (h = 500) against the measured
6.9·10⁻¹² (h = 50). At 7.5·10^16 the bound is 2.13·10⁻¹²·0.0164 = 3.5·10⁻¹⁴ (h = 500) against the measured 5.7·10⁻¹⁴
with the small cluster h = 12 (the cluster-size loss of section 5.3 applies).

**5.3 Cluster size (minimal lift at the same t_m; E/(|Z(t_m)|(T/2π)^{−a/2})).**

| height | h | k | σ=1 | σ=2 | σ=3 |
|---|---|---|---|---|---|
| 3.1·10^12 | 1 | 8 | 4.9 | 3.3e3 | 5.1e7 |
| 3.1·10^12 | 2.5 | 21 | 2.6 | 52 | 1.7e4 |
| 3.1·10^12 | 5 | 43 | 2.1 | 7.9 | 183 |
| 3.1·10^12 | 10 | 85 | 1.9 | 3.2 | 16 |
| 3.1·10^12 | 25 | 213 | 1.8 | 1.8 | 3.2 |
| 3.1·10^12 | 50 | 430 | 1.7 | 1.5 | 1.9 |

The loss is e^{≈ a²·dens/h}; a cluster of ±10 (85 zeros) is within a factor 3.2 of the threshold at σ = 2.

**5.4 Mirror instance at t = 0 (y ≥ y₀ = 0.165, M₀ < p_req = 4.3743).** Pair-lift q = α + β(t − t₀) with a prescribed
zero at t₀ + iδ, δ = 0.085 (y = 0.17), h = 50, t₀ at the gap extrema nearest the centre; M₀ computed with every nonreal
neighbour (both conjugates) and an analytic far tail.
* 3.1·10^12: 58 of 60 central gaps give a zero that is topmost within distance 2 with y ≥ 0.165 and M₀ < 4.3743. The
  least visible: E(σ=2) = 2.5·10⁻⁹, M₀ = 3.29, P = 2.99, 6 nonreal zeros. At the close pair: E(σ=2) = 3.8·10⁻⁹,
  violator with y = 0.166, M₀ = 2.53, 12 nonreal zeros, sup|Z_F − Z| = 1.44.
* 5·10⁵: 60 of 60; least visible E(σ=2) = 1.5·10⁻⁴.
* 7.5·10^16 (h = 12): 2 of 60 central gaps give such a zero; the least visible has E(σ=2) = 7.0·10⁻¹⁰, M₀ = 3.95,
  P = 2.38, 36 nonreal zeros. A single prescribed pair rarely suffices at this density, in line with route 42 Table A
  (k₀ = 2 needed above 10^15). The t = 0 literal violation (5.2) is unaffected.
* δ = 0.495 (y = 0.99) at 3.1·10^12: E(σ=2) = 2.6·10⁻⁶, but 84 zeros leave the line and max|Z_F| = 1000 on the block
  (the block maximum of |Z| is 56.9): visible to short-interval critical-line data, not to Re s ≥ 2 data above 10⁻⁵.

**5.5 The referee's excluding premises, re-evaluated on the new models.**

| premise (route 42 referee) | Theorem A model at 5·10⁵ | minimal lift 5·10⁵ | minimal lift 3.1·10^12 | mirror violator 3.1·10^12 |
|---|---|---|---|---|
| Δ∫_{c±150}\|F(2+it)\|² dt, baseline 324, MV error ≈ 10 | +2.18·10⁴ | ≤ 3.7·10⁻³ | ≤ 1.9·10⁻¹⁰ | ≤ 1.3·10⁻⁷ |
| \|F(2+ic)\| ≤ ζ(2) = 1.645 | 82 | ≤ 1.5618·(1+1.6·10⁻⁴) | ≤ 1.5648·(1+1.4·10⁻¹¹) | ≤ 1.5648·(1+7.7·10⁻⁹) |
| \|F(1+ic)\| ≤ ¾ log t | 187 vs 9.84 | 0.571·(1+0.07) vs 9.84 | 0.606·(1+1.2·10⁻⁵) vs 21.57 | 0.606·(1+5.2·10⁻³) vs 21.57 |

(Δ∫ bounded by ζ(2)²·∫(2|ρ_q − 1| + |ρ_q − 1|²) over the whole line; 1.5618 and 1.5648 are the block maxima of
|ζ(2+it)|.)

**5.6 Theorem 2 inequality chain at h = 500 (proxy height; `check_thm2.py`, `out_check_thm2.json`).** A wide block
5·10⁵ ± 1150 (4131 zeros, θ-count 4130.8). For 13 centres c − T₀ ∈ {−600, −500, …, 600} and σ ∈ {1.5, 2, 3}, with
k ≈ 1795 cluster zeros: Lemma P (min over |u − c| ≤ 3h of A(u) − A(c) against log(m_σ/|ζ(σ+ic)|) − κ) holds in 39/39
cases with margin between 0.17 and 0.55; the bound of Theorem 2(c) for sup_u |p(t_m)|/|p(u − ia)| holds in 39/39 cases,
measured/bound between 0.55 and 0.76. The bound is therefore within a factor 1.8 of the measured value at this height.

## 6. The escape, and the Euler-product attempt

**Proposition 3 (PROVED).** Let σ > 1 and F = ζR a cluster lift with R ≢ 1. Then u ↦ log F(σ+iu) is not positive
definite on ℝ, while u ↦ log ζ(σ+iu) = Σ_n Λ(n)/(log n) n^{−σ} e^{−iu log n} is (Λ(n) ≥ 0).

*Proof.* w(u) := log R(σ+iu) is continuous, in L²(ℝ) (R − 1 = O(|u ∓ c|^{2−k})), not identically 0, so w = ŵ₀ with
w₀ ∈ L², w₀ ≠ 0. log F(σ+i·) is the Fourier transform of μ_ζ + w₀ dξ with μ_ζ purely atomic. If it were positive
definite, Bochner gives a positive measure, hence w₀ ≥ 0 a.e., hence |w(u)| ≤ w(0) for all u. But w(0) = log R(σ) is
a value at distance ≥ c − h from the cluster: |q/p|(−ia) ≤ ((h+a)/(c−h))^{k−2}·|q/p|(c − ia), because every factor
of p grows from ≤ h + a to ≥ c − h and ν shrinks. At u = c, w(c) = log ρ_q(c − ia) + (a term of the same tiny size),
so |w(c)| ≥ ½|q/p|(c − ia) > |w(0)|. Contradiction. ∎

So exact positivity (the Euler product in function-side form) has zero slack against every counter-model; it is the one
function-side statement on Re s ≥ σ > 1 that escapes Corollary 2. It does not come with a certificate:
* Together with the functional equation it identifies F with ζ (the premise set then certifies exactly the statements
  true of ζ, which is the original problem).
* Any consequence with relative slack on Re s ≥ σ (the bounds |log F(σ+it)| ≤ log ζ(σ), |F′/F(σ+it)| ≤ −ζ′/ζ(σ), the
  3-4-1 inequality at σ = 1 + η, all derivative versions on Re s ≥ σ′ > σ) is satisfied by F_{c,η} whenever its slack at
  ζ exceeds 2Ê + Ê². (PROVED, Corollary 2.) The 3-4-1 inequality still excludes off-line zeros with 1 − β ≲ 1/log T:
  for those a − δ ≍ 1/log T and the pair-lift bound (T/2π)^{−(a−δ)/2} is not small, consistent with the classical
  zero-free region.
* HEURISTIC, not proved: the spectral density w₀ of the model is e^{−aξ}·Σ_j r_j e^{i g_j ξ} (r_j the residues of q/p),
  which is small for ξ < ½ L_c and of size (c/2π)^{−a/2} beyond. Near ξ ≥ ½L_c the atoms of μ_ζ sit at log n with
  spacing 1/n ≤ (c/2π)^{−1/2} and local mass density n^{1−σ}/log n = (c/2π)^{(1−σ)/2}/log n, larger than |w₀| by
  (c/2π)^{1/4}. A test ∫∫ log F(σ+i(u−v)) f(u) f̄(v) ≥ 0 can come out negative only if |f̂|² separates the gaps between
  consecutive log n at n ≥ (c/2π)^{1/2}, which needs f of duration ≳ (c/2π)^{1/2}. A Λ(n) ≥ 0 twisted second moment in a
  window shorter than (c/2π)^{1/2} would then not see the model at any slack. A Beurling–Selberg minorant argument
  should prove this; it is not written.

**Attempt to prove an every-window statement with Euler-product input: outcome.** The only premise identified that
both is provable from Λ(n) ≥ 0 and excludes the counter-models is exact positive-definiteness, and passing from it to
H_desc is RH in the lane with nothing removed. Every quantified weakening is on the wrong side of ε*. No intermediate
statement was found. This is a precise obstruction, not a proof that none exists: Corollary 2 covers premises that
are stable under relative perturbation on a half-plane Re s ≥ σ > 1, and exact-structure premises are outside it by
construction.

## 7. Davenport–Heilbronn control

Nothing in Theorems 1–2 uses the Euler product: Lemma X needs a counting function with bounded error, Lemma P a
two-sided bound for the L-function on Re s = σ, Theorem 1 the functional equation. The construction applies verbatim to
any function with a functional equation and Riemann–von Mangoldt count, including DH (with m_σ replaced by a lower
bound of |DH| on a line to the right of its zeros). That is the required behaviour of an obstruction: it says premises
with slack on Re s ≥ σ cannot separate ζ from non-RH functions in the same class. The Euler product enters only in
Proposition 3: DH is not zero-free in Re s > 1, so log DH(σ+i·) is not even defined as a positive-definite function;
ζ passes, DH and every cluster lift fail. A valid proof of an every-window statement must therefore use the Euler
product through a zero-slack (exact) property, or through data of relative resolution below ε*.

## 8. Three weakest steps

1. **H_W is a hypothesis.** Theorem 2 needs every zero in a window of length 2h ≥ 600 to be real and simple. Above the
   verified height this is unknown; in a window where it fails no model is constructed (ζ itself has an off-line or
   multiple zero there, but H_desc need not fail for it). The measured windows (3.1·10^12 ± 62, 7.5·10^16 ± 16) rest on
   sign-change counts from a double-precision sampler with a Turing-style mean-S consistency check (`turing.py`), not
   an interval-rigorous verification, and they are shorter than the 2h ≥ 600 of Theorem 2. Route 42 Theorem A did not
   need H_W.
2. **Constants in Lemma X / Lemma P are not refereed.** The exterior-sum evaluation (closed form K(t), the E_N
   integration by parts with a slowly growing B, the nonreal-pair correction, the O(·/c) Stirling terms) and the far
   range of Lemma P (total-variation bound 5m̂ + 0.29) were written once. Numerical checks: the potential identity at
   h = 50 and h = 12 at three heights (5.1), and the full chain at h = 500 at the proxy height only (5.6, 39/39 cases, bound within
   a factor 1.8). No check at h = 500 exists at lane heights (the sampled blocks there are ±62 and ±16). Trudgian's and
   Hiary–Patel–Yang's constants are used as quoted.
3. **Scope of "premise".** Corollary 2 is a statement about premises stable under relative perturbation on Re s ≥ σ > 1.
   It does not cover σ ≤ 1 rigorously, explicit short-window critical-line premises (measured only), the mirror
   instance y ≥ y₀ (measured only; the proved violation is the t = 0 literal form with y → 0, which route 42 Remark A′
   already flags as the weaker form), or t > 0 (route 42 Lemma 5, unwritten). Theorem 1's zero-forcing corollary needs
   a counting premise to exclude extra off-line zeros.

## 9. Files

`rs.py`, `rs_big.py` (samplers), `model.py`, `model2.py` (cluster lifts, roots, pulls), `run1.py`, `run2.py`, `run3.py`
(tables), `consts.py` / `consts.json` (Theorem 2 constants), `validate.py` / `validate.log`, `out_5e5.json`,
`out_3p1e12.json`, `out_7p5e16.json`, `out_hscan.json`, `out_shifts.json`, `out_check_thm2.json`, `consts_grid.py` /
`consts_grid.json`, `check_thm2.py`, `turing.py`, `post_top.py`, `z_5e5.npz`, `z_5e5_wide.npz`, `z_3p1e12.npz`, and the
lane-top block `z_7p5e16.npz` (sampled on the motherbox, 4 processes, 41 minutes, `rs_7p5e16.log`).
