# Round 3: exhaustive theta collision certificate (2026-11-01)

Internal working note. Not externally refereed, not committed upstream. Scripts: `tmp/rha-theta-collision-*.py`,
outputs in `tmp/rha-theta-collision-out/`. Grades: PROVED (complete argument written here, checked by the author
only), CITED (published or recorded result, used as stated), MEASURED (floating point, mpmath/numpy, not interval
arithmetic), ARGUED (argument with a stated gap or model assumption), HEURISTIC.

RH is open. Platt–Trudgian Λ ≤ 0.2 stands. Nothing here changes a Λ bound or a zero-free region. NO QED.

## Verdict

The attempt fails. It is the third item of the atlas closing line ("an exhaustive theta boundary/collision
certificate"), written as a proof of RH with the actual Φ, no one-sided prime sum and no σ-anchor line: a putative
first collision of the de Bruijn–Newman flow is excluded by the adjacent-gap reserve of PR #16, with the exterior
field transported down from the region where the zeros are known to be real (Polymath15 Theorem 1.5).

* **First failing step: Step 5 (exterior-field transport, Claim 5).** In its exact form (Claim M: the exterior field
  S of every adjacent pair is nonincreasing along the forward flow) it is **false for ζ itself**: in the 121 zeros
  around Lehmer's pair (γ ≈ 7005), 17 of 70 inner pairs have S increasing on [0, 0.3] (for example zeros
  6703–6704: S = 0.5213 → 0.5623). MEASURED. Any weaker form with a fixed relative loss η is useless: by
  Proposition N, a lower bound L = (1 − η)S certifies a pair only down to a depth (1/4S)·log(q/η) below the anchor,
  where S ≍ (log x)² at height x and q is the pair's compression ratio (q = 1 at lattice equilibrium).
* **Second, independent stop: Step 6 (anchor precision).** Even with the exact S, the certificate needs the
  configuration at the anchor time to relative precision q·exp(−4∫S) ≈ q·(x/4π)^(−κ/2π²), while Polymath15's anchor
  gives only exp(−cκ). The backward flow has Lyapunov exponent ≍ (log x)² per unit time; the anchor precision
  improves only like exp(−c·t·log x). Proposition L.
* **Why no repair inside this route.** Every step before Step 5 holds for a positive, even, modular theta kernel
  without Euler product (Theorem E: the Epstein zeta function of 2m² + 2mn + 3n²), given the analogue of Polymath15's
  tail theorem for it (first-term dominance; expected, not checked), and that kernel's
  heat family has an actual positive-time collision at (t, x) = (0.0059246, 191.95462), with D_t changing sign there
  (MEASURED by two independent implementations, L-functions with Gauss–Hermite heat smoothing and the theta-kernel
  integral at 100 digits; not interval-certified). So the step that excludes collisions must use the Euler
  product, and in this route the Euler product enters only through the anchor region, where first-term dominance
  (which the Epstein function also has) already suffices. The a0 → 0 form of the reserve is exactly RH plus simplicity
  of all zeros (Proposition GR), which is the round-1 "RH ∧ SZC, never RH alone" pattern. The D_t > 0 form fails
  for the same reason as PR #16 §2, now at every order of the Laguerre hierarchy (Lemma 1.2).
* **Reduces to.** Zero positions at t = 0 to relative precision exp(−4∫S)·y(0), pair by pair: RH ∧ SZC verification
  at every height (wall 3). Structurally, Steps 0–4 are covariant under Φ ↦ e^{−εu²}Φ (time shift), so by the
  flow-blindness no-go the input that breaks the covariance must be the t = 0 arithmetic identity itself (wall 1).

All checks are by the author in one context. No fresh-context referee has read this file yet; the salvage items
(§7) need one before any use.

## 0. Required reading and overlap

Read before writing: the PR #27 audit (snapshots `/tmp/atlas-snap-*.md`: route atlas §§1–12 and closing line,
PUBLICATION_SCOPE_2026-10-30, arithmetic foundation, spectral head, signed complement, whole-even certificate, spectral
denominator repair, Suzuki recurrence, prime memory, finite Suzuki certificate); the round-1 and round-2 syntheses;
`research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`; PR #16 (`DETERMINANT_OBSTRUCTION.md`,
`ADJACENT_GAP_CERTIFICATE.md`), PR #18 (`genuine-theta-endpoint-2026-10-24/PROOF.md`), PR #19
(`LOCAL_COLLISION_INDEX.md`); `src/data/flow-blindness-no-go.js`; `src/data/imp-95530-native-span-arithmetic-input-rigidity.js`;
`formalization/paper/mv-cap-theorem.md`.

| Overlap | Atlas / source | What is different here |
|---|---|---|
| Collision target G = H + iH′ ≠ 0, global trapping | §5; vortex-blocker Theorem A | Used as Step 0 (it is RH). Not re-proved. |
| Determinant D = H′² − HH″, wrong-sign source | §5; PR #16 §2 | Lemma 1.2 extends the obstruction to every Laguerre expression L_n. Not used as a proof route. |
| Adjacent-gap identity and certificate (1)–(3) | §5; PR #16 ADJACENT_GAP §3, §7 | Used in Step 6. New: the exact a0 → 0 reserve (Prop GR), neutrality (Prop N), anchor transport and its exponent mismatch (Prop L), measured failure of monotone S. |
| Local index −⌊m/2⌋ | §5; PR #19 §1 | Used in Lemma V (vortex conservation under analytic deformation of the kernel). |
| Finite theta boxes | §6; PR #17, PR #18 | Not used. The slab version is a Λ bound (vortex-blocker Theorem B); this attempt targets all t > 0. |
| Uniform positive margin is the wrong target | §11 | Prop N is the gap-reserve form of the same fact: the lattice is exactly neutral for the reserve. |
| Ferromagnetic / Lee–Yang representation | §3 | Not attempted. Theorem E constrains it (§4, Corollary E). |
| 7/8 boundary, V7 floor, PR #14 / Xu–Sang | §10 | Enter only as heuristic thresholds for the anchor region (§2, Remark 2.3). |
| Signed actual forms, null symbols | §9 | Not used: no Weil form appears. |
| One-sided Landau sum, σ-anchor line | round 1 Thm E; round 2 harmonic floor (4d) | Not used. Lemma V's corollary shows where a topological deformation argument would be forced onto one (§5, Corollary V); recorded, not used. |

The anchor used here is the atlas §5 "simple all-real anchor": a heat-time region where the zeros are known to be real
(Polymath15 Theorem 1.5, Platt–Trudgian). It is not a vertical σ-line carrying a floor. The transport from it is
through the exact zero dynamics, not a minimum principle. Proposition L shows that this transport fails for a
dynamical reason, the heat-flow analogue of the round-2 anchor-line failure.

## 1. Setting

Write, as in PR #16 and the vortex-blocker note,

    H_t(z) = ∫_0^∞ e^{t u²} Φ(u) cos(z u) du,    ∂_t H = −∂_z² H,    H_0(z) = ξ(1/2 + i z/2)/8,
    Φ(u) = Σ_{n≥1} (2π² n⁴ e^{9u} − 3π n² e^{5u}) exp(−π n² e^{4u}),
    G(t,x) = H_t(x) + i ∂_x H_t(x),    D_t(x) = H_t′(x)² − H_t(x) H_t″(x)   (′ = ∂_x).

A zero of G with t > 0 is a vortex (a real multiple zero of H_t). Coordinates: x = 2γ. At height x put

    L(x) = log(x/4π),   ρ(x) = L(x)/(4π)  (zero density of H_t per unit x),   s = 1/ρ  (mean spacing).

Inputs, all as stated in the vortex-blocker note, (K1)–(K3): Newman's Λ; de Bruijn's strip contraction;
Csordas–Smith–Varga (for t > Λ the zeros are real and simple); Rodgers–Tao Λ ≥ 0; Platt–Trudgian Λ ≤ 0.2;
Polymath15 Theorem 1.5 (for 0 < t ≤ 1/2 every zero with Re z ≥ exp(C/t) is real, C an unspecified absolute
constant; its proof places such zeros within O(x^{−ct}/log x) of explicit points x_n); Hurwitz.

**Theorem A (vortex-blocker note, CITED).** RH ⟺ G has no zero on (0, 1/2] × ℝ ⟺ D_t(x) > 0 for all real x and
0 < t ≤ 1/2. If Λ > 0 there is a vortex at time Λ (Remark C.1 there).

## 2. The argument

**Target.** RH.

**Plan.** By Theorem A it suffices to exclude a vortex. Suppose one exists; take the first one in heat time (time Λ).
The two zeros that collide there are real and simple just above Λ, and their squared gap obeys the exact ODE of
PR #16. Bound the exterior field of that pair from below by its value at an anchor time T*, where Polymath15
places the zeros on an explicit lattice, and integrate the ODE: the pair cannot reach gap 0 by time Λ. Every input
is either an exact identity of the theta family or a published theorem, except Claim 5 (§2.5) and condition (6.2)
(§2.6), which the argument has to supply.

### 2.0 Step 0: reduction

By Theorem A, RH follows if G has no zero on (0, 1/2] × ℝ. Assume for contradiction that RH fails. Then Λ > 0
(Newman), Λ ≤ 0.2 (Platt–Trudgian), and by Remark C.1 of the vortex-blocker note there is a vortex at (Λ, x*) with
x* > 0. Its proof takes x* as a limit of real parts of nonreal zeros at times t_n ↑ Λ; by Polymath15 Theorem 1.5
those real parts are < exp(C/t_n), so

    x* ≤ exp(C/Λ).                                                                      (0.1)

On (Λ, 1/2] every zero is real and simple (Csordas–Smith–Varga).

### 2.1 Step 1: exact identities of the theta family

**Lemma 1.1 (pair kernel; PR #16 §5, re-derived).** With K_t(u) = e^{tu²}Φ(u) extended evenly,

    D_t(x) = ∫_ℝ Q_t(v) cos(2xv) dv,     Q_t(v) = ∫_ℝ u² K_t(v+u) K_t(v−u) du.

*Proof.* H = ½M_0, H′ = (i/2)M_1, H″ = −½M_2 with M_k = ∫u^k K(u)e^{ixu}du, so
D = ¼(M_0M_2 − M_1²) = ⅛∬K(a)K(b)(a−b)² e^{ix(a+b)} da db; substitute a = v+u, b = v−u. ∎

So D_t ≥ 0 for all x is positive-definiteness of Q_t. Q_t is a self-convolution (not an autocorrelation) of K_t
with weight u², so positivity of K_t does not give it; PR #16 §3–4 has positive kernels with collisions.

**Lemma 1.2 (Laguerre hierarchy; PROVED).** For real x, y,

    |H_t(x+iy)|² = Σ_{n≥0} L_n(t,x) y^{2n},   L_n = (−1)^n Σ_{j+k=2n} (−1)^k H^{(j)} H^{(k)} / (j! k!),
    ∂_t L_n = (n+1)(2n+1) L_{n+1} − ½ ∂_x² L_n,    L_0 = H²,  L_1 = D.

*Proof.* F(t,x,y) = H_t(x+iy)H_t(x−iy) (H is real on ℝ). From ∂_tH = −∂_z²H and the chain rule,
∂_x²F = H″₊H₋ + 2H′₊H′₋ + H₊H″₋ and ∂_y²F = −H″₊H₋ + 2H′₊H′₋ − H₊H″₋, so ∂_tF = −H″₊H₋ − H₊H″₋ = ½(∂_y² − ∂_x²)F.
Compare coefficients of y^{2n}. Check at n = 1 against PR #16: ∂_tD = 6L_2 − ½D″ and (∂_t + ∂_x²)D = 2D[H_x] give
6L_2 = 2D[H_x] − ½D″; for H = x² + a both sides equal 6. ∎

If H_t is in the Laguerre–Pólya class every L_n ≥ 0 (each factor of the Hadamard product contributes a polynomial
in y² with nonnegative coefficients; Csordas–Varga). So the sources (n+1)(2n+1)L_{n+1} are nonnegative going forward
and nonpositive going backward, at every order. This is PR #16 §2 for the whole hierarchy: positivity of D (or of any
L_n) is created forward and not protected backward. The argument below therefore works with the zero dynamics, not
with a maximum principle for D.

**Lemma 1.3 (zero dynamics and gap identity; PR #16, Polymath15 Prop. 3.1).** On an interval of times where all zeros
are real and simple, every zero moves by ẋ_k = H_t″(x_k)/H_t′(x_k) = 2 Σ′_{j≠k} 1/(x_k − x_j), and for adjacent zeros
a < b, with d = b − a and y = d²,

    y′ = 8 − 4 S y,     S = Σ_{r≠a,b} 1/((b−r)(a−r)) ≥ 0,     equivalently  S = 2/d² − ḋ/(2d).

For the lattice r ∈ sℤ with (a, b) = (0, s): S = s^{−2} Σ_{k∉{0,1}} 1/(k(k−1)) = 2/s², and y′ = 8 − 8 = 0. The lattice is
the equilibrium of the gap ODE, with equilibrium squared gap y* = 2/S = s².

**Lemma 1.4 (exact reserve; PROVED from PR #16 (2)).** For a0 < T in such an interval and any measurable L ≤ S,

    y(T) − 8∫_{a0}^T e^{−4∫_v^T L} dv  ≤  y(T) − 8∫_{a0}^T e^{−4∫_v^T S} dv  =  e^{−4∫_{a0}^T S} y(a0)  =: R(a0, T),

with equality iff L = S almost everywhere. PR #16's certificate (3) at (a0, T) holds iff
8∫_{a0}^T (e^{−4∫_v^T L} − e^{−4∫_v^T S}) dv < R(a0, T). The reserve R is the whole margin; there is no other slack.

**Lemma 1.5 (Gaussian subordination and Euler tilts; PROVED).** For 0 ≤ s ≤ t and G ~ N(0,1),
H_t(z) = E[H_s(z + i√(2(t−s)) G)] (expand e^{−(t−s)∂²} and use E G^{2m} = (2m−1)!!; H_s has order 1). In particular

    H_t(x) = ⅛ E[ξ(½ + σ + ix/2)],   σ ~ N(0, t/2):

the flow averages ξ along horizontal segments through the critical line. On the kernel side,
Φ(u) = Σ_{n≥1} n^{−1/2} φ_1(u + ½ log n) with φ_1(u) = (2π²e^{9u} − 3πe^{5u})exp(−πe^{4u}), i.e. Φ = φ_1 ∗ ν with
ν = Σ n^{−1/2} δ_{−(log n)/2}. Exponential tilts distribute over convolution, e^{c·}(φ_1 ∗ ν) = (e^{c·}φ_1) ∗ (e^{c·}ν),
and e^{c·}ν = Σ n^{−1/2−c/2} δ_{−(log n)/2} is again a Dirichlet measure; its transform ζ(½ + c/2 + iz/2) factors over
primes when ½ + c/2 > 1 (z real; same convention as ∫Φ(u)e^{izu}du = 2H_0(z), for which ν̂(z) = ζ(½ + iz/2)). With e^{tu²} = E e^{√(2t) G u},

    K_t = E_G[ (e^{√(2t)G·} φ_1) ∗ (e^{√(2t)G·} ν) ],

a Gaussian mixture of tilted Euler-product convolutions. The Euler product converges exactly on the event
G > 1/√(2t). Combined with the growth of ξ to the right (|ξ(σ + iγ)| grows like (γ/2π)^{σ/2}), the Gaussian average H_t(x)
has, by a saddle-point heuristic, its main contribution near σ* = ½ + (t/4)L(x) (spread √(t/2)); σ* lies in the Euler
region σ* > 1 exactly when t·L(x) > 2. In this representation that is the only way the Euler product enters H_t.

### 2.2 Step 2: the three regions

* Region I (anchor): x ≥ exp(C/t), 0 < t ≤ 1/2. All zeros there are real (Polymath15 Theorem 1.5), and the proof
  places them within O(x^{−ct}/log x) of explicit points x_n whose local spacing is s(1 + O(1/L)).
* Region II: t > 0.2. All zeros real and simple (Platt–Trudgian, Csordas–Smith–Varga).
* Region III: the rest, 0 < t ≤ 0.2 and x < exp(C/t). For each slab t ≥ t_1 it is bounded in x; it is unbounded as
  t → 0 ("the difficult joint regime" of PR #19 §6).

By (0.1) the vortex of Step 0 lies in the closure of Region III.

*Remark 2.3 (thresholds; HEURISTIC).* In the variable κ = t·L(x) the anchor boundary is κ = C. Polymath15's
triangle-inequality mechanism needs the tail Σ_{n≥2} b_n n^{−σ*} below the first term, roughly ζ(σ*) < 2, i.e.
σ* > 1.73, κ > 4.9 (ζ(1.7286) = 2); this is close to the project's Route 20 measurement t·log(x0/4π) ≈ 5.3–5.8. Using ζ(σ) ≠ 0 and
|ζ′/ζ(σ)| < ½L instead of the triangle inequality would move the threshold toward σ* = 1, κ = 2; the 7/8 half-plane
(openai/math; conditional where recorded) toward κ = 3/2; the Xu–Sang boundary 0.87488665 (PR #14, conditional) toward
κ ≈ 1.50. In general a zero-free half-plane Re s > B gives the threshold κ = 4(B − ½); for the V7 floor with exponent
p (which implies no zeros in Re s > (1+p)/2, atlas §10) that is κ = 2p, and p = 0 (RH) is κ = 0. No proved half-plane moves it to
κ → 0. Absorption law behind these numbers (HEURISTIC; checked on the
Epstein vortex in §4): an off-line zero of depth δ = β − ½ at height x reaches the real axis at
t ≈ 2δ² when δL ≪ 1 (isolated pair, y² = y0² − 2t) and at t ≈ 4δ/L when δL ≫ 1 (Poisson attraction of the real zeros,
dy/dt ≈ −2πρ).

### 2.3 Step 3: the colliding pair

At (Λ, x*) the function H_Λ has a real zero of multiplicity m ≥ 2. By Hermite splitting (Polymath15 Prop. 3.1(ii)),
for t ↓ Λ the m nearby zeros are x* + 2√(t−Λ) h_j + O(t−Λ) with h_j the distinct real Hermite roots, so they are real
and distinct for t > Λ. Let a(t) < b(t) be two adjacent ones; y(t) → 0 as t ↓ Λ. Lemma 1.4 with a0 ↓ Λ (the reserve
tends to 0 because y(a0) → 0 and the exponential factor is ≤ 1, even if S blows up) gives, for every T ∈ (Λ, 1/2],

    y(T) = 8 ∫_Λ^T exp(−4∫_v^T S) dv.                                                  (★)

### 2.4 Step 4: anchor data

Put T* = min(1/2, C/log x*). By (0.1), Λ ≤ T*. At time T* the point x* is on the Region I boundary, so the zeros of
H_{T*} within O(1) spacings of x* lie within ε* := A·e^{−cC} spacings of the explicit points x_n (A, c absolute, from
the proof of Polymath15 Theorem 1.5; at T* = C/log x*, x^{−cT*} = e^{−cC}). Hence the pair (a, b), continued up to T*,
satisfies

    q(T*) := S(T*) y(T*) / 2 = 1 + O(ε* + 1/L),                                         (4.1)

since on the exact lattice S = 2/s² and y = s² (Lemma 1.3). The quantity q is the pair's compression ratio: q < 1
means the pair is closer than its equilibrium with its exterior field.

### 2.5 Step 5: exterior-field transport (the core claim)

**Claim 5.** For the colliding pair of Step 3, S(t) ≥ (1 − η) S(T*) for all t ∈ (Λ, T*], with η = η(x*) ≥ 0 and
η(x*) → 0 as x* → ∞. In its exact form (**Claim M**, η = 0): on any interval of times where all zeros of H_t are real and
simple, t ↦ S(t) is nonincreasing for every adjacent pair.

Justification offered (this is what a referee has to accept or refute):

* (5a) Relaxation. The forward flow is the gradient flow of the regularized log-gas energy (ẋ_k = −2∂E/∂x_k,
  E = −Σ log|x_j − x_k|, renormalized). By Lemma 1.3 the lattice is the equilibrium of the gap ODE, and by Step 4 the
  configuration at T* is the lattice up to ε*. Forward from Λ the configuration near x* relaxes toward it.
* (5b) Monotone exterior field. S is a sum of the positive functions 1/((b−r)(a−r)), each decreasing in the distance
  of the exterior zero r from the pair. A compressed pair (q < 1) repels its neighbours (the pair term 2/(b−a) dominates
  their velocity), so the exterior zeros move outward and every term decreases.
* (5c) Theta input. By Lemma 1.5, H_t for t ∈ (Λ, T*] is the Gaussian average of H_Λ over vertical segments of length
  ≍ √(t − Λ), an operator that preserves the Laguerre–Pólya class and does not create real zeros; and the anchor
  configuration is the Polymath15 lattice produced by the Euler region (Remark 2.3). So the only clustering present
  at T* is ε*, and clustering only decreases forward.

### 2.6 Step 6: the certificate

With L := (1 − η)S(T*) ≤ S on (Λ, T*] (Claim 5), identity (★) at T = T* gives

    y(T*) ≤ 8∫_Λ^{T*} e^{−4L(T*−v)} dv = (2/L)(1 − e^{−4L(T*−Λ)}),

that is,

    q(T*) ≤ (1 − e^{−4(1−η)S(T*)(T*−Λ)}) / (1 − η).                                    (6.1)

By (4.1), q(T*) = 1 − θ with |θ| ≤ A′(ε* + 1/L(x*)). So (6.1) is contradicted as soon as

    e^{−4(1−η)S(T*)(T*−Λ)} > η + θ  (to first order in η, θ).                         (6.2)

The left side is at least exp(−4S(T*)T*). With S(T*) = 2/s² (1 + O(ε*)) = L²/(8π²)·(1 + o(1)) and T* = C/log x*, it is
at least (x*/4π)^{−C/(2π²)}(1 − o(1)). So (6.2) needs

    η + θ < (x*/4π)^{−C/(2π²)}  for collisions with Λ ≪ T*.                             (6.2′)

**Claim 6 (raising the anchor).** If (6.2′) fails at T*, replace T* by a later anchor T** ∈ [T*, 1/2]. There the
Polymath15 precision is ε** = A·(x*)^{−cT**}, and (4.1) holds with ε**. Choose T** so that (6.2) holds.

### 2.7 Step 7: conclusion

Given Claims 5 and 6, (6.1) contradicts (4.1) for the colliding pair, so there is no vortex at (Λ, x*). That
contradicts Step 0, so G has no zero on (0, 1/2] × ℝ, and RH follows from Theorem A. ∎ (conditional on Claims 5, 6)

The same steps with Lemma 1.1 in place of Lemma 1.3 give the determinant version of the attempt: show Q_t is
positive-definite at the anchor and transport positive-definiteness down. Lemma 1.2 already shows the transport has
the wrong sign at every order, so this version has no Claim 5 to offer; it is not pursued further except in §3.6.

## 3. Attack

Checked in order. Steps 0–4 are correct as stated (cited inputs; Lemmas 1.1–1.5 proved above; the localization in
Step 4 uses Polymath15's proof as described in the vortex-blocker note, and only for zeros already known to be real).
The first unproved step is Step 5. Step 6 fails independently of Step 5.

### 3.1 Step 5 is false in its exact form and useless in its weak form

**(a) Claim M fails for ζ (MEASURED).** `tmp/rha-theta-collision-lehmer-gap.py` runs the forward flow of the 121
actual zeros 6649–6769 (mpmath `zetazero`, around Lehmer's pair 6709–6710 at γ = 7005.0628662, 7005.1005647), with the
remaining zeros and all mirror zeros replaced by the smooth density ρ(u) = L(u)/4π, by the ODE of Lemma 1.3
(DOP853, rtol 1e-10). The gap identity y(T) = 8∫_0^T e^{−4∫_v^T S}dv + R(0,T) is reproduced to relative 1e-5 once the
smooth far field (0.0103 of S) is included. Over t ∈ [0, 0.3]:

| pair | S(0) | S(0.3) | monotone? |
|---|---|---|---|
| 6709–6710 (Lehmer) | 0.6094 | 0.5979 | decreasing |
| 6703–6704 | 0.5213 | 0.5623 | increasing |
| 6692–6693 | 0.5575 | 0.5846 | increasing |
| 6698–6699 | 0.5909 | 0.6059 | increasing |
| 6681–6682 | 0.5696 | 0.5857 | increasing |

17 of the 70 inner pairs (25 zeros kept away from each window edge) have S increasing somewhere on [0, 0.3]. The
far-field term is smooth and nearly constant in t, and is far too small to produce changes of 0.02–0.04. The
mechanism behind (5b) is wrong: when the neighbour r of a pair has a close partner on its other side, the forward
flow separates that partner from r and pushes r toward the pair, and S increases. Relaxation is collective, not
pairwise monotone. (5c) does not help: Gaussian averaging preserves real-rootedness but does not order local
statistics such as S.

**(b) Any fixed relative loss is useless (Proposition N).**

*Proposition N (neutrality; PROVED for constant S, matched numerically for ζ).* Let S ≡ S_0 on [a0, T],
Δ = T − a0, A = 4S_0Δ, and q_0 = S_0 y(a0)/2 (the compression ratio at a0). Then y(T) = e^{−A}y(a0) + (2/S_0)(1 − e^{−A}),
and the certificate (3) with L = (1 − η)S_0 holds iff

    q_0 e^{−A} + 1 − e^{−A}  >  (1 − e^{−(1−η)A}) / (1 − η).

To first order in η this is η·(1 − (1 + A)e^{−A}) < q_0 e^{−A}. So the largest tolerable relative loss is

    η* = q_0 e^{−4S_0Δ} / (1 − (1 + 4S_0Δ)e^{−4S_0Δ}) ≈ q_0 e^{−4S_0Δ},

and a lower bound with loss η certifies a pair down to depth Δ ≈ (1/4S_0)·log(q_0/η) below the anchor.

*Proof.* Solve the linear ODE of Lemma 1.3 with constant S, and integrate 8e^{−4L(T−v)} exactly; expand
f(η) = (1 − e^{−(1−η)A})/(1 − η) to first order: f(0) = 1 − e^{−A}, f′(0) = 1 − (1 + A)e^{−A}. ∎

For a pair at lattice equilibrium q_0 = 1 and S_0 = 2/s² = L²/(8π²), so η* ≈ exp(−L²Δ/(2π²)). For Lehmer's pair
from T = 0.3 down to a0 = 0: q(0) = S(0)y(0)/2 = 1.73·10^{−3}, A = 0.724, so Proposition N predicts η* ≈ 5.1·10^{−3}.
The direct computation with the actual S(t) (MEASURED) agrees:

| relative loss η in L = (1 − η)S | certified down to a0 = |
|---|---|
| ≤ 10^{−3} | 0 |
| 10^{−2} | 0.0007 |
| 5·10^{−2} | 0.0061 |
| 0.1 | 0.0125 |
| 0.3 | 0.0346 |

Exact reserve of the Lehmer pair, R(0, T) = e^{−4∫_0^T S} y(0) with y(0) = 0.0056847 (z-units): 5.55·10^{−3} at T = 0.01
(relative to y(T): 6.6·10^{−2}), 4.46·10^{−3} at T = 0.1 (6.2·10^{−3}), 2.76·10^{−3} at T = 0.3 (1.6·10^{−3}). Because
this pair's S happens to decrease, L = S(T) is a valid lower bound for it and certifies it:
(2/S(T))(1 − e^{−4S(T)T}) = 1.712724 < y(T) = 1.713418, a margin of 4·10^{−4} relative, at γ ≈ 7005 over Δ = 0.3.

This is the gap-reserve form of atlas §11 ("a uniform strictly positive scalar margin is the wrong RH target"): the
lattice is exactly neutral for the gap ODE (y* = s², Lemma 1.3), so the reserve has no first-order slack, and every
structural lower bound on S must be exact to relative precision q·e^{−4∫S}.

**(c) The justifications (5a)–(5c) do not use the Euler product below the anchor.** (5a) and (5b) are statements
about the zero dynamics of any heat family; (5c) uses the Euler region only through the anchor configuration, and
for the Epstein twin of §4 the anchor would be supplied by first-term dominance instead (Polymath15's argument with the
leading term 2·2^{−s} of Z_E; expected, not checked). That twin has a vortex
(Theorem E). So (5a)–(5c), even if each could be made precise, cannot be completed into a proof of Claim 5 for
colliding pairs.

### 3.2 Step 6 fails independently: the exponent mismatch

**Proposition L (ARGUED; exact in the lattice model).** Suppose the anchor at time T ≥ T* gives the configuration
near x to relative precision ε(T) = A·x^{−cT} (the form in Polymath15's proof) and the exterior field there is the
lattice value S = (L²/8π²)(1 + o(1)). For a collision with Λ ≤ T/2, condition (6.2) at anchor time T requires

    A·e^{−cTL} < exp(−4S(T − Λ)) ≤ exp(−(L²/4π²)·T·(1 + o(1))),

that is T·(L²/4π² − cL) < −log A + o(1). For L(x*) > 4π²c + o(1) and A ≥ 1 this fails for every T > 0.

*Argument.* Insert the lattice value of S into (6.2); T − Λ ≥ T/2. The only modelling step is S ≈ lattice value
near the anchor, which is what (4.1) gives. ∎

Reading: the backward Lyapunov exponent of the pair mode is 4S ≍ (log x)²/(2π²) per unit time, while the anchor
precision improves only like exp(−c·t·log x). One power of log x is missing. Raising the anchor (Claim 6) improves the
available precision at rate c·L per unit time but tightens the requirement at rate ≍ L²/(2π²) per unit time; lowering
it below T* leaves Region I. So Claim 6 is false for large x*, and the
iterated version (re-anchor at the certified time, as in PR #16 §7's tube ladder) loses the same factor at each rung,
since a certificate proves only that no collision occurred, not where the zeros are.

Sizes (lattice values, z-units): at x = 6·10¹² (γ = 3·10¹², the Platt–Trudgian height) L = 26.89, s = 0.467,
S = 9.16, and e^{−4S·0.1} = 0.026, e^{−4S·0.3} = 1.7·10^{−5}. At x = 10^{100}, S = 657 and e^{−4S·0.1} ≈ e^{−263}.

### 3.3 The a0 → 0 reserve is RH plus simple zeros

**Proposition GR (PROVED, given the cited inputs).** Fix T ∈ (0, 1/2]. The following are equivalent.

1. The backward continuation from T in which all zeros stay real and simple exists on (0, T], and for every adjacent
   pair inf_{0 < a0 < T} R(a0, T) > 0.
2. RH holds and every zero of ξ is simple.

*Proof.* (2 ⇒ 1) Under RH, Λ ≤ 0, so for t ∈ (0, T] the zeros are real and simple (Csordas–Smith–Varga), and at t = 0
they are real and simple by assumption. Each adjacent pair continues to [0, T] with y(0) > 0, S is continuous on
[0, T], and R(a0, T) = e^{−4∫_{a0}^T S} y(a0) is continuous and positive on [0, T]; its infimum over (0, T) is positive.
(1 ⇒ 2) No collision occurs in (0, T], so the zeros of H_t are real for t ∈ (0, T], and by Hurwitz the zeros of H_0 are
real: RH. Since e^{−4∫S} ≤ 1, y(a0) ≥ R(a0, T) ≥ inf R > 0 for every pair, so no two zeros merge as a0 → 0. A multiple
zero of H_0 would be the Hurwitz limit of at least two adjacent zeros of H_{a0}, whose gap would tend to 0. ∎

Theorem A needs only RH. So the gap-reserve form of the collision certificate, run to a0 → 0, targets the strictly
stronger statement RH ∧ SZC, the pattern of round-1 Proposition R (window certificates certify RH ∧ SZC and never RH
alone). If RH holds but ξ has a multiple zero, every PR #16 certificate for that pair fails as a0 → 0, while
Theorem A's condition holds.

### 3.4 Flow-blindness (wall 1) applied to this argument

Let Φ_ε = e^{−εu²}Φ; its heat family is H^ε_t = H_{t−ε}. Lemmas 1.1–1.4 hold for every kernel. Lemma 1.5's
subordination holds for H^ε at times t ≥ ε; the Dirichlet factorization does not hold for Φ_ε, but the argument uses
it only through the anchor, and Φ_ε has the anchor region {t > ε, x ≥ exp(C/(t − ε))} by Polymath15 applied to
H_{t−ε}. Φ_ε has vortices at positive times: at time Λ + ε if RH fails, and at times in (0, ε] if RH holds (by
Rodgers–Tao, H_{−δ} has nonreal zeros for every δ > 0 with δ < ε; under RH each such conjugate pair is real by time 0,
so it meets the real axis in a collision, a vortex of H at a time in (−δ, 0], i.e. a vortex of H^ε at a time in
(0, ε]). So Steps 0–4 and the justifications (5a)–(5c), read for Φ_ε, are true, while the conclusion is false. A proof of Claim 5 must use a property of Φ that
Φ_ε lacks for every ε > 0, which by the flow-blindness note means the exact arithmetic identity at t = 0. The attempt
has no such input below the anchor.

### 3.5 Twin tests

* **Epstein twin (§4).** Positive, even, modular, theta-type decay (after the rescaling in E6), nonnegative Dirichlet
  coefficients, functional equation, an anchor region by first-term dominance (expected, not checked), and an actual
  vortex at (t, x) = (0.0059246, 191.95462) (at (0.0236983, 383.90925) after rescaling). Steps 0–4 hold for it (given
  the tail-theorem analogue); Claims 5–6 must fail for it.
* **Gaussian-flowed Φ_ε (§3.4).** Same conclusion; this is wall 1.
* **Davenport–Heilbronn.** Off-line zeros (first at 0.8085 + 85.70i), hence vortices; its kernel is not known to be
  positive, so it is a weaker test here than the Epstein twin. Steps 0–4 do not use positivity and hold for it.
* **Round-2 Theorem MT twin** (completely multiplicative, unimodular, one off-line zero, no functional equation) has no
  theta kernel, so it does not enter this route. Together with the Epstein twin it brackets what is needed: functional
  equation and theta structure without Euler product (Epstein) and Euler product without functional equation (MT) each
  allow off-line zeros. This is round-2 synthesis §2.4 ("structure that is exactly symmetric cannot see the zeros")
  seen in the collision picture.

### 3.6 The determinant version (D_t > 0)

Lemma 1.2: ∂_t L_n = (n+1)(2n+1)L_{n+1} − ½∂_x²L_n. Under RH every L_n ≥ 0, so going backward each L_n has a nonpositive
source and no maximum principle protects positivity, at any order (PR #16 §2 is the case n = 1). The pair kernel
Q_t of Lemma 1.1 is not positive-definite for the Epstein twin at t = t_c − 10^{−4} (D^E < 0 there, §4), so
positive-definiteness of Q_t is not a consequence of positivity, evenness, modularity or nonnegative Dirichlet
coefficients of the kernel. A proof of D_t > 0 for ζ must use the Euler product, and in the subordination picture of
Lemma 1.5 the Euler product enters H_t only where t·L(x) > 2, which is inside the anchor region.

### 3.7 Where the attempt lands

* First unproved step: Step 5 (Claim 5). Exact form (Claim M) false for ζ (§3.1(a)); weak form insufficient
  (Proposition N); justifications soft (§3.1(c), §3.4).
* Independent stop: Step 6, condition (6.2′) / Claim 6 (Proposition L).
* The a0 → 0 limit of the certificate is RH ∧ SZC (Proposition GR). What the certificate needs is the zero
  configuration at t = 0 near every height, to relative precision e^{−4∫S}·y(0) for each pair: verification at every
  height (wall 3). No structural input in the argument supplies it, and by §3.4 none that is covariant under the flow
  can.

## 4. Theorem E: a positive modular theta kernel with a positive-time collision

PR #16 §3–§4 gave positive kernels with collisions and noted that "neither countermodel has the theta kernel's decay
and infinite-zero structure". The following kernel has both, together with modularity and nonnegative Dirichlet
coefficients, and its heat family has an actual vortex inside (0, 1/2] × ℝ. Scripts:
`tmp/rha-theta-collision-epstein-{lib,check,count,zeros,vortex,vortex2,ghvalues,kernelcheck}.py`.

Let Q(m, n) = 2m² + 2mn + 3n² (discriminant −20, the non-principal class of ℚ(√−5); class number 2), r(k) the number of
(m, n) ≠ (0, 0) with Q(m, n) = k, λ_k = 2πk/√20, and for u ≥ 0

    Φ_E(u) = Σ_{k≥1} r(k) · 4λ_k e^{3u} (λ_k e^{2u} − 2) exp(−λ_k e^{2u}),     extended evenly to u < 0.

**Theorem E.**

* (E1, PROVED) Φ_E(u) > 0 for every real u. Q does not represent 1, so λ_k ≥ λ_2 = 4π/√20 = 2.810 > 2, and every term
  is positive for u ≥ 0; then use evenness.
* (E2, PROVED) Φ_E = (∂_u² − 1)[e^u θ_Q(e^{2u})] with θ_Q(x) = Σ_{(m,n)∈ℤ²} exp(−2πQ(m,n)x/√20), using
  (∂_u² − 1)[w^{1/2}e^{−λw}] = 4λw^{3/2}(λw − 2)e^{−λw} for w = e^{2u} (the term (m, n) = (0, 0) contributes e^u, which
  ∂_u² − 1 kills). Poisson summation gives θ_Q(1/x) = x θ_Q(x) (the inverse form 3m² − 2mn + 2n² is equivalent to Q),
  so e^u θ_Q(e^{2u}) is even and Φ_E is even and real-analytic. Φ_E decays like exp(−λ_2 e^{2|u|}).
* (E3, PROVED; checked numerically) ∫_0^∞ Φ_E(u) cos(zu) du = ξ_E(½ + iz/2), where
  ξ_E(s) = s(s−1)(√20/2π)^s Γ(s) Z_E(s) and Z_E(s) = Σ' Q(m,n)^{−s} = Σ r(k)k^{−s} = ζ(s)L(s,χ_{−20}) − L(s,χ_{−4})L(s,χ_5).
  Λ_E(s) = (√20/2π)^sΓ(s)Z_E(s) satisfies Λ_E(s) = Λ_E(1−s); ξ_E is entire of order 1 and real on the critical line.
  (Integrate by parts twice in ½Λ_E(½ + iz/2) = ∫ e^u(θ_Q(e^{2u}) − 1)e^{izu}du for Im z < −1 and continue.) Checks:
  r(1..60) equal the Dirichlet coefficients of the L-function expression; the kernel identity holds at z = 0, 3, 10 to
  15 digits (0.974837836713284, 0.773842336609553, 0.0631467586587064); evenness holds to 10^{−30}.
* (E4, MEASURED) Z_E has zeros off the critical line at low height, after Newton refinement at 25 digits
  (|Z_E| ≤ 3·10^{−26}):

  | β | γ | β − ½ |
  |---|---|---|
  | 2.0794141048 | 7.6288675878 | 1.5794 |
  | 1.9939410080 | 23.0196045256 | 1.4939 |
  | 1.9644189048 | 38.3486337321 | 1.4644 |
  | 0.8623855149 | 41.7669732591 | 0.3624 |
  | 0.8366600675 | 56.1831450700 | 0.3367 |
  | 0.5545713157 | 95.9828200655 | 0.0546 |

  (with mirrors 1 − β + iγ). The argument-principle count N_E(T) against sign changes of ξ_E(½ + iγ) gives 2 vs 0 at
  T = 10, 31 vs 23 at T = 50, 143 vs 99 at T = 150, matching route 15's independent count
  (`tmp/routes-b4-15-zeros-D20-2_2_3.json`). Zeros with β > 1 are consistent with Davenport–Heilbronn (1936), who
  proved that Epstein zeta functions of class number > 1 have infinitely many zeros in σ > 1 (cited from memory, not
  re-read). Data correction: in the route-15 file the list `offline_beta_gamma` is offset by −1/2; the list `offline`
  holds the real parts (re-verified here).
* (E5, MEASURED) Let H^E_t(z) = ∫_0^∞ e^{tu²}Φ_E(u)cos(zu)du. Then G^E = H^E + i∂_xH^E has a zero at

      (t_c, x_c) = (0.00592457504282, 191.95462253944),

  and D^E_t(x_c) = −1.47·10^{−124} at t = t_c − 10^{−4}, +1.47·10^{−124} at t_c + 10^{−4} (and −5.86·10^{−124},
  +5.88·10^{−124} at ∓4·10^{−4}): a linear sign change, as the double-root normal form D = H″²(t − t_c) at x_c predicts. Method:
  H^E_t(z) = E[H^E_0(z + i√(2t)G)] (Lemma 1.5) by Gauss–Hermite quadrature, ξ_E from mpmath L-functions at 30 digits,
  x-derivatives by central differences (h = 10^{−4}), 2-D Newton for (H, H′) = 0. With 30 and with 40 quadrature nodes
  the vortex agrees in all 12 printed digits. Independent check: tracking the conjugate zero pair
  191.96564 ± 0.10914i of H^E_0 (from the zeros 0.5545713 + 95.98282i and 0.4454287 + 95.98282i of Z_E) gives
  (Im z)² ≈ 0.011912 − 2.015t, which reaches 0 at t ≈ 0.00591. The isolated-pair law of Remark 2.3 predicts
  2δ² = 0.0059564 (δ = 0.0545713); the real zeros pull the pair in slightly faster. Kernel-side check (independent implementation: no L-functions, no Gauss–Hermite): the integrals
  ∫_0^∞ u^j e^{tu²}Φ_E(u){cos, sin}(x_c u)du at 100 digits by composite Gauss–Legendre (48 nodes per panel of 0.01 and
  24 nodes per panel of 0.005, agreeing in all 8 printed digits) give, at t_c − 10^{−4}: H = −1.2120054·10^{−64},
  H′ = 3.3794905·10^{−64}, H″ = −1.2121569·10^{−60}, D = −1.4679986·10^{−124}; at t_c + 10^{−4}: H = 1.2117024·10^{−64},
  H′ = −3.3801066·10^{−64}, H″ = −1.2115508·10^{−60}, D = +1.4691814·10^{−124}. The L-function side gives the same
  values to 5 digits (its x-derivatives are finite differences). Not interval-certified.
* (E6, PROVED by scaling) Φ̃_E(u) := Φ_E(2u) decays like exp(−λ_2 e^{4|u|}), the same doubly-exponential rate e^{4|u|} as Φ
  (constant λ_2 = 2.81 in place of π). Its heat family is
  H̃_t(z) = ½H^E_{t/4}(z/2), so it has a vortex at (4t_c, 2x_c) = (0.0236983, 383.90925), inside (0, 1/2] × ℝ.
* (E7) Z_E has no Euler product: a(n) = r(n)/2 is not multiplicative (a(2)a(3) = 2, a(6) = 0). Z_E is the difference
  of two Euler products with the same functional equation.

**Corollary E (given E5).** No argument that excludes vortices of the heat family on (0, 1/2] × ℝ, or proves D_t > 0 there, can
use only properties that Φ̃_E shares with Φ: positivity, evenness, real-analyticity, doubly-exponential decay of the same
rate, origin in a theta series of a positive definite lattice with its modular transformation, nonnegative Dirichlet
coefficients, functional equation, order-1 transform with a Hadamard product, the heat equation and the local index
theorem. The Euler product (equivalently, multiplicativity; equivalently, nonnegative coefficients of log of the
Dirichlet series) is the remaining distinguishing property. For the atlas §3 route: Φ̃_E(u)du is a positive measure
without the Lee–Yang property, so a ferromagnetic representation that proves RH must encode multiplicativity.

## 5. Vortex conservation under deformation of the kernel

A natural way to get an exhaustive certificate without boxes is to deform Φ to a kernel with no vortices and show
that none is created. PR #19's index theorem makes the second half automatic; the whole difficulty moves to the
boundary t = 0.

**Lemma V (PROVED from PR #19 §1).** Let λ ↦ Φ^λ, λ ∈ [0, 1], be even kernels such that (λ, t, x) ↦ H^λ_t(x) is
real-analytic on [0,1] × (0, T_0) × ℝ, each slice solves ∂_tH = −∂_x²H, and no H^λ_t vanishes identically. If
B ⊂ (0, T_0) × ℝ is a closed Jordan domain with G^λ ≠ 0 on ∂B for every λ, then Σ_{vortices in B} ⌊m/2⌋ does not depend
on λ. Consequently the set of λ for which an open set U contains a vortex is open in [0, 1], and as λ varies a vortex
can appear or disappear only through the boundary of U.

*Proof.* By PR #19 §1 the winding of G^λ around ∂B equals −Σ⌊m/2⌋ over the vortices in B; it is constant in λ by
homotopy invariance. All local indices are negative, so vortices cannot be created or annihilated in pairs. For
openness, put a small box with nonzero winding around a vortex at λ_0; it keeps a vortex for λ near λ_0. ∎

**Corollary V (shift family; (i) PROVED, (ii)–(iii) ARGUED).** Take Φ^c(u) = cosh(cu)Φ(u), so
H^c_t(x) = cos(c∂_x)H_t(x) = Re H_t(x + ic).

1. For c > 1 there is no vortex in (0, ∞) × ℝ. Every zero ρ of H_0 has |Im ρ| < 1, and pairing ρ with ρ̄ gives, for
   z = x + iy with y > 0, factorwise |H_0(z + ic)| > |H_0(z − ic)|, because (y + c ∓ b)² − (y − c ± b)² = 4y(c ∓ b) > 0
   for |b| < c. So E(z) = H_0(z + ic) is strictly Hermite–Biehler and H^c_0 = (E + E^#)/2 has only real simple zeros;
   e^{−t∂²} preserves this for t ≥ 0, and Hermite splitting (the Csordas–Smith–Varga argument) gives simplicity for
   t > 0.
2. If RH fails, the vortex at (Λ, x*) for c = 0 continues (Lemma V) along a curve that is monotone in c and must leave
   every compact subset of (0, 1/2) × ℝ before c = 1: through t → 0 with x bounded, through x → ∞ with t bounded below
   (excluded if Polymath15 Theorem 1.5 holds uniformly for c ∈ [0, 1]; plausible, since cosh(cu) moves the saddle to
   the right, not checked), or through the corner t → 0, x → ∞.
3. An exit through t = 0 at (c_e, x_e) is a real multiple zero of x ↦ Re ξ(σ_e + ix/2), σ_e = ½ + c_e/2. At a zero of
   Re ξ = R cos θ, the x-derivative is −½Rθ′ sin θ, so either ξ vanishes at σ_e + ix_e/2 (an off-line zero) or the
   phase is stationary: Re(ξ′/ξ)(σ_e + iγ) = 0, that is Re(−ζ′/ζ)(σ_e + iγ) = ½log(γ/2π) + O(1/γ). That is the
   twin-ladder T3 condition of the flow-blindness note (SL0/SL1), in one-sided prime-sum form, and the anchor of the
   deformation is the line σ = 1 (c = 1).

So the topological route avoids the one-sided prime sum only until the exit boundary, where it reappears, with the
anchor line σ = 1: the endpoint of rounds 1–2 (round-1 Theorem E, round-2 harmonic floor (4d)). Recorded as a map of
the route; not used in §2. The same holds for any deformation through kernels whose t = 0 transforms are not known to
have only real zeros, since the exit set at t = 0 is where real-rootedness at t = 0 fails.

## 6. The four walls

Design intent. The attempt was chosen to avoid each wall: (1) it uses the actual Φ, and its anchor is Polymath15's
theorem about the actual heat family, not a flow-stable hypothesis on the profile; (2) it uses no native-span positivity
statement; (3) it is not a fixed-support or fixed-time positivity statement, since the certificate is meant to run over
all heights from an analytic anchor; (4) it uses no mean value or density input, since Claim 5 is a pointwise dynamical
statement. It also avoids the round-1/2 endpoints (no one-sided prime sum, no σ-anchor line, no Weil form). The table
records how each wall came back.

| Wall | How this attempt meets it | Effect |
|---|---|---|
| (1) Flow-blindness (`flow-blindness-no-go.js`) | Steps 0–4 and (5a)–(5c) hold for Φ_ε = e^{−εu²}Φ with time shifted by ε, and Φ_ε has vortices in (0, ε] (§3.4). | Blocks Claim 5: it must use the t = 0 identity, which the argument has only through the anchor. |
| (2) NS-RIGID (`imp-95530`) | No native-span Pick statement is used. Slab versions of the certificate are Λ bounds (vortex-blocker Theorem B) and bounded-height versions are finite checks; both hold for Φ_ε at small ε whenever they hold for Φ, i.e. they are flow-stable in the sense of NS-RIGID A4(i). | Finite versions cannot be the missing input. |
| (3) Verified height / fixed-time Λ (Route I ceiling) | Propositions N, L, GR: the certificate at height x needs either the t = 0 configuration to relative precision e^{−4∫S}y(0) or an anchor with precision ≍ x^{−κ/2π²}. | This is where the attempt lands. |
| (4) Pointwise / MV-CAP (route 42) | Claim 5 is a statement about every colliding pair. Density and mean-value inputs control S on average. The route-42 window replacements ζ_W keep every mean-value premise and move zeros in a window; Theorem E is a concrete instance at low height with positivity and modularity kept. | Blocks any mean-value proof of Claim 5. |
| Global vortex trapping = RH | Theorem A is Step 0. | — |

## 7. Salvage, status, reproduction

**What survives (all same-model, author-checked only; a fresh-context referee should read them before any use).**

| Item | Grade | Content |
|---|---|---|
| Lemma 1.2 | PROVED | Laguerre hierarchy ∂_tL_n = (n+1)(2n+1)L_{n+1} − ½∂_x²L_n; positivity of every L_n is created forward and unprotected backward. |
| Lemma 1.4 | PROVED | Exact reserve R(a0,T) = e^{−4∫S}y(a0) is the whole margin of PR #16's certificate. |
| Lemma 1.5 | PROVED (standard); saddle location HEURISTIC | Gaussian subordination with Euler tilts; the Euler product converges only on G > 1/√(2t); the saddle is in the Euler region iff t·L(x) > 2. |
| Proposition N | PROVED (constant S); matches ζ numerics | Tolerable relative loss η* ≈ q·e^{−4SΔ}; the lattice is exactly neutral for the gap ODE. |
| Proposition L | ARGUED | Backward Lyapunov exponent ≍ (log x)² against anchor precision exponent ≍ log x; anchor transport fails for log(x/4π) > 4π²c. |
| Proposition GR | PROVED (given cited inputs) | The a0 → 0 gap reserve for all pairs is equivalent to RH ∧ SZC. |
| Theorem E | E1–E3, E6, E7 PROVED; E4, E5 MEASURED (E5 by two independent implementations) | Positive, even, modular theta kernel (Epstein, 2m² + 2mn + 3n²) with a positive-time vortex at (0.0059246, 191.95462); rescaled, same decay as Φ, vortex at (0.0236983, 383.90925). |
| Lemma V, Corollary V | PROVED; (ii)–(iii) ARGUED | Vortices are conserved under analytic kernel deformation; for the shift family the exits at t = 0 are the T3 phase-stationarity condition on σ = ½ + c/2. |
| Claim M | MEASURED false | 17/70 inner pairs near γ ≈ 7005 have forward-increasing exterior field. |
| Route-15 data | correction | `offline_beta_gamma` in `tmp/routes-b4-15-zeros-D20-2_2_3.json` is offset by −1/2. |

**Answer to the question asked.** Is there a theta-specific structural argument for D_t > 0, or for the adjacent-gap
reserve uniformly as a0 → 0, that uses Φ beyond positivity? Not in the following sense. (i) Every property of Φ
beyond positivity except the Euler product (evenness/modularity, theta-series origin, decay rate, nonnegative
Dirichlet coefficients, functional equation) is shared by the rescaled Epstein kernel Φ̃_E, whose heat family has a
vortex at t = 0.0237 (Theorem E). (ii) In the subordination picture (Lemma 1.5, saddle-point heuristic) the Euler product
enters the heat family at time t only where t·log(x/4π) > 2, which is already the anchor region. (iii) Below the anchor the gap reserve has no slack
(Lemma 1.4, Proposition N), the backward flow amplifies anchor errors by exp(≍ t(log x)²) while the anchor precision
improves only like exp(−c·t·log x) (Proposition L), and the a0 → 0 reserve is RH ∧ SZC (Proposition GR). So the
third item of the atlas closing line, in this form, needs zero-location data at t = 0 at every height, which is
wall 3.

**Possible next steps (proposals, none run).**

1. Make Theorem E rigorous: certify the zero 0.5545713 + 95.98282i of Z_E and the vortex (t_c, x_c) with interval
   arithmetic (python-flint `acb` for ζ and the Dirichlet L-functions, Rouché on a small disk; an Arb two-variable
   Newton–Kantorovich check for (H, H′) = 0). This turns the countermodel into a theorem with no floating-point step.
2. Measure the actual exterior field of colliding pairs for the Epstein family (the zeros of H^E_t near x_c for
   t ∈ (t_c, 0.05)) to test Claim 5 directly on a collision, rather than through Claims 5–6 jointly.
3. Any further attempt on this route should state in advance where the Euler product enters below the anchor
   region t·log(x/4π) ≤ 2, and test the step against Φ̃_E and against Φ_ε first.

**Status.** RH open. NO QED. Platt–Trudgian Λ ≤ 0.2 stands. No new zero-free region, no Λ bound. The attempt in §2
fails at Step 5 (first unproved step; false in its exact form) and independently at Step 6.

**Reproduction.** Python env `.venv-arb` (Python 3.14.10, mpmath 1.3.0, numpy 2.5.3, scipy 1.18.1). Outputs in
`tmp/rha-theta-collision-out/`.

| Script | What it does | Runtime |
|---|---|---|
| `tmp/rha-theta-collision-epstein-lib.py` | Z_E, Λ_E, ξ_E via mpmath L-functions; r_Q; Φ_E | library |
| `tmp/rha-theta-collision-epstein-check.py` | coefficients, kernel identity, evenness, positivity | ~20 s |
| `tmp/rha-theta-collision-epstein-count.py 150` | N_E(T) vs on-line sign changes → `epstein-count.txt` | ~4 min |
| `tmp/rha-theta-collision-epstein-zeros.py` | Newton refinement of off-line zeros | ~30 s |
| `tmp/rha-theta-collision-epstein-vortex.py 95.9828200655 0.5545713157 0.004 8 30` | zero tracking under the flow | ~2 min |
| `tmp/rha-theta-collision-epstein-vortex2.py 0.00591 191.9575 30` (and `... 40`) | vortex solve, D sign → `epstein-vortex.txt`, `epstein-vortex-ngh40.txt` | ~3 min |
| `tmp/rha-theta-collision-epstein-kernelcheck.py 100 5 0.01` (and `100 4 0.005`) | kernel-side H, H′, H″, D at t_c ∓ 10^{−4} → `epstein-kernelcheck*.txt` | ~30 s |
| `tmp/rha-theta-collision-epstein-ghvalues.py` | L-function-side H, H′, H″ at the same points | ~1 min |
| `tmp/rha-theta-collision-lehmer-zeros.py 60` | ζ zeros 6649–6769 → `lehmer-zeros.json` | ~1 min |
| `tmp/rha-theta-collision-lehmer-gap.py` | forward zero flow, S(t), reserve, η-depth table, Claim M test | ~80 s |
