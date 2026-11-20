# Conjecture 22.1 (twin-ladder usefulness): statement, RH status, attack

Date: 2026-11-16. Slug: b-conjecture-22-1. Scratch research note, one author pass, no referee. No RH claim, no
zero-free region, no Λ change. Labels: PROVED (argument written here), CLASSICAL (cited), MEASURED (floating point,
not interval-certified), OPEN.

## Verdict

**Dead as an RH lead. One new theorem about the conjecture itself (HF below). One exact reduction of what remains.**

1. Conjecture 22.1 is a statement about the cost of certified numerical evaluation of Ξ. It is logically independent
   of RH in the precise sense of §2: every step of every known argument about it holds unchanged for
   Davenport–Heilbronn and for an FE-symmetric twin with a zero pair moved off the line. The two tools named in the
   task (one-sided Weil identity, 7/8 half-plane) have no point of contact with it (§2.3).
2. The memory index line "untapped lead = Conjecture 22.1" is stale. The topic file
   `feedback_rh_scaleup_comprehensive_attack.md` already carries the 2026-09-22 correction. This note agrees with the
   correction and adds a proof where the earlier record had a heuristic.
3. New (PROVED here, §3): **Theorem HF**, a linear real-zero cap for every frozen ladder with real Gaussian widths
   and real modulation frequencies, any number of distinct widths. It replaces the non-rigorous regime (B) of
   imp-33233. Benchmark consequence: D ≥ 6,181,576,718,570 against a 691,008-term Riemann–Siegel main sum.
4. Exact reduction (§4): outside that class the only escape is complex widths (quadratic phases), which is the
   Riemann–Siegel / Odlyzko–Schönhage / Hiary technology. There, refuting 22.1 is equivalent to an unconditional
   lower bound on the complexity of certifying sign Z(t), and proving it is a faster zeta algorithm. Both are open
   and neither depends on the location of zeros.
5. Pivot (§6, once): the other Section 22 targets under the 7/8 half-plane. Result is a dictionary of CLASSICAL
   equivalences, no new theorem: 22.4 holds for a ≥ 3/8 exactly when the half-plane holds, 22.3 at shift a has an
   explicit zero-side sum of squares for a ≥ Δ, and the unshifted 22.3 implies RH.

## 0. Plan (what is new relative to the atlas and the walls)

- Atlas §2 covers the twin ladder and the shifted bridge (22.4 = RH; threshold a ≥ Δ). It does not treat 22.1.
- imp-1210 graded 22.1 INDEPENDENT-NOVEL (a literature grade, not an RH grade). imp-3932 refuted the strong reading
  for the eq (20)–(21) class by a zero-count cap D − 1. imp-33233 extended to single-width modulation (cap 4D) and
  argued multi-width modulation by a Nyquist heuristic.
- New here: (i) an explicit RH-independence statement with DH control; (ii) an audit of imp-33233 regime (B), which
  is not a proof (§3.1); (iii) Theorem HF, which closes that regime with a proof; (iv) the exact residual class.
- Walls: none is touched, because nothing here is an RH argument. The DH control is §5.

## 1. Exact statement

Verbatim, `twin_ladder_consolidated_v52.pdf` §22 (as recorded in imp-1210 and imp-3932):

> Conjecture 22.1 (Twin-ladder usefulness). There exists a frozen-ladder approximation whose certified remainder
> bound in the classical case is smaller, at equal runtime, than a comparable baseline approximation.

Paper §7 objects: Φ_fr(u) = e^{−αu²} Σ_{k≤K} c_{2k} u^{2k} (eq 20) or the same span in Hermite–Gaussian form
(eq 21), with incomplete-gamma tail bounds (eq 22). Classical case (β, P) = (0, 0): target
Ξ(t) = ξ(1/2 + it) = ∫ Φ(u) e^{itu} du, approximation Ξ_fr(t) = ∫ Φ_fr(u) e^{itu} du.

The statement has three free choices: the ladder class, the baseline, the benchmark height. Readings:

- **W (weak):** some ladder beats some baseline somewhere. True and empty (choose a poor baseline).
- **S (strong, imp-1210 anchor):** a ladder from a named class certifies the sign changes of Ξ on (0, T0],
  T0 = 3,000,175,332,800 (Platt–Trudgian), at no more cost than Riemann–Siegel.
- **C (constants):** fixed small height; a comparison of constants. Open, benchmarkable, finite.

## 2. RH status: independent

### 2.1 Statement

Let M be the number of sign changes of Ξ on (0, T0]. Every result on reading S (L1–L4 of imp-3932, regime (A) of
imp-33233, Theorem HF below) has the form

> a ladder of dimension D has at most c·D real zeros, so certifying M sign changes forces D ≥ M/c.

The only property of ζ used is the integer M. PROVED (by inspection of each proof): the same statements hold with Ξ
replaced by any real function with M sign changes on the interval.

### 2.2 Consequences

- 22.1 ⇏ RH and RH ⇏ 22.1 at the level of content: the truth value of reading S at height T0 is fixed by M(T0) and
  by the baseline cost. Both are finite data inside the verified range.
- At heights above the verified range, M(T) = N(T) − (number of off-line zeros and multiplicity losses). An off-line
  quartet changes M by O(1) per quartet. Zero-density estimates (CLASSICAL, unconditional) give
  M(T) = N(T)(1 − o(1))-type lower bounds only through Selberg/Levinson/Conrey proportions, but the cap argument
  needs only M(T) ≥ κ N(T) for a fixed κ > 0 (Selberg 1942, CLASSICAL). So reading S fails at every large height
  with or without RH: D ≥ κ N(T)/c against a main sum of length √(T/2π).
- The one indirect channel (a faster certified evaluation ⇒ more verified height ⇒ Λ) needs reading S to be true.
  It is false in the real-parameter class (Theorem HF) and coincides with existing algorithms outside it (§4).

### 2.3 Why the named tools do not apply

The one-sided Weil identity (eq48) and the 7/8 half-plane are statements about the sign of the Weil functional and
about Re ρ. Conjecture 22.1 has no hypothesis and no conclusion about Re ρ. Neither tool changes M(T0), the cap
constant c, or the Riemann–Siegel cost. There is no step where they enter.

## 3. Theorem HF (heat-flow zero cap). PROVED here; one CLASSICAL input

### 3.1 Why imp-33233 regime (B) is not a proof

Regime (B) (distinct widths plus modulation) argued: Ξ_fr has exponential type ≤ U, so it has at most
(U/π) T0 (1 + o(1)) real zeros in (0, T0], and a band-limited function on that interval is fixed by ~M samples.

- The exponential-type density theorem is an asymptotic statement as T → ∞. It gives no bound on a fixed interval:
  sin(Ut)·p(t) has type U and as many zeros in (0, T0] as deg p allows.
- A Gaussian mixture is not compactly supported, and "effectively supported" was not quantified.
- The Whittaker–Shannon sample count is the dimension of a function space, not the number of stored coefficients D
  of one member.

So before this note, the rigorous cap for distinct widths was only the Rolle recursion: dividing by one block and
differentiating raises the degree of the other blocks (their exponent differences are quadratic), which gives
Z ≤ (2^N − 1)(d + 1) − 1 for N blocks of degree d. That would force only D ≳ log₂ M ≈ 44. Theorem HF gives a
linear cap.

### 3.2 Statement

Let f(t) = Σ_{j=1}^{N} Q_j(t) exp(−(t − c_j)²/(2 s_j)), with s_j > 0, c_j real, the pairs (c_j, s_j) distinct,
Q_j real polynomials of exact degree d_j. Let W be the set of blocks with the largest s_j. Then f is not
identically zero and its real zeros, counted with multiplicity, satisfy

    Z(f) ≤ 2 Σ_{j ∉ W} (d_j + 1) + Σ_{j ∈ W} (d_j + 1) − 1  ≤  2D_t − 2   (N ≥ 2),   D_t := Σ_j (d_j + 1).

For d_j = 0 this is 2N − 2, the Kalai–Moitra–Valiant bound for linear combinations of N Gaussians, and it is
attained (§3.5). For equal widths it is the Pólya–Szegő bound D_t − 1 used in imp-3932.

### 3.3 Inputs

- **(VD) CLASSICAL.** The Gaussian kernel is totally positive. For g bounded, continuous, integrable with finitely
  many sign changes, S(G_τ * g) ≤ S(g), where S is the number of sign changes and G_τ is the Gaussian density of
  variance τ. (Schoenberg 1950; Karlin, Total Positivity, Ch. 5 Thm 3.1.)
- **(PS) CLASSICAL.** Σ R_j(t) e^{μ_j t} with distinct real μ_j has at most Σ(deg R_j + 1) − 1 real zeros with
  multiplicity (Pólya–Szegő V.75; proof reproduced in imp-3932 L2).
- **(Closure) PROVED.** Q(t) e^{−(t−c)²/2s} = Σ_{k≤d} a_k ∂^k G_s(t − c) with a_d ≠ 0. Since G_s = G_{s'} * G_{s−s'}
  for 0 < s' < s, the block equals G_{s'} * [P(t) e^{−(t−c)²/(2(s−s'))}] with deg P = d. So for every σ < min s_j the
  function f_{−σ} := Σ_j P_{j,σ}(t) e^{−(t−c_j)²/(2(s_j−σ))} is in the same class with the same degrees, and
  f = G_σ * f_{−σ}.

### 3.4 Proof

Induction on the number of distinct widths. One width: multiply by e^{t²/2s}; (PS) gives Σ(d_j+1) − 1.

Step. Let s₁ = min s_j, attained by blocks with centres c ∈ C (one block per centre), degrees d_c. For
0 < ε < gap/2 (gap = distance from s₁ to the next width) put g_ε = f_{−(s₁−ε)}. The narrow blocks of g_ε have
variance ε, the others have variance ≥ gap. Write g_ε = h_ε + Σ_{c∈C} P_{c,ε}(t) e^{−(t−c)²/2ε}. The wide part h_ε
depends analytically on ε near 0, and h₀ is in the class with one fewer width, so by induction h₀ ≢ 0 and
Z(h₀) ≤ B_wide.

(a) *Multiplicity lemma.* Z(f) ≤ S(f_{−δ}) for small δ > 0. At a zero t₀ of multiplicity m, the series
f_{−δ} = Σ_k (−δ/2)^k f^{(2k)}/k! gives f_{−δ}(t₀ + √δ y) = δ^{m/2} [f^{(m)}(t₀)/m! · He_m(y) + O(√δ)] uniformly on
compact y-sets. He_m has m simple real zeros, so f_{−δ} has ≥ m sign changes within O(√δ) of t₀. Apply this to any
finite set of zeros of f.

(b) By (VD) and (Closure), S(f_{−δ}) ≤ S(g_ε) ≤ Z(g_ε) for δ + ε < s₁.

(c) *Tails.* At +∞ (and at −∞) one block of h_ε dominates: largest variance, then extreme centre. Its leading
coefficient is continuous and non-zero in ε ∈ [0, ε₀]. So there is R with h_ε ≠ 0 for |t| ≥ R, uniformly in ε, and
(narrow part)/h_ε → 0 uniformly there because the narrow variance is smaller. Hence g_ε ≠ 0 for |t| ≥ R.

(d) *Away from narrow centres.* On [−R, R] minus η-neighbourhoods of C, g_ε → h₀ in C^k for every k. Near a zero z
of h₀ of multiplicity m, g_ε^{(m)} ≠ 0 for small ε, so g_ε has at most m zeros there. Elsewhere |h₀| is bounded
below and g_ε ≠ 0.

(e) *At a narrow centre c* (degree d, h₀ vanishing to order m ≥ 0 at c, interval I ∋ c containing no other zero of
h₀). With q = −(t−c)²/2ε, zeros of g_ε in I are zeros of u := h_ε e^{−q} + P_{c,ε} (other narrow blocks are
absorbed into h_ε on I; they and their derivatives tend to 0 there). Since deg P_{c,ε} = d,

    u^{(d+1)} = (h_ε e^{−q})^{(d+1)} = e^{−q} ε^{−(d+1)} φ_ε,   φ_ε := (ε∂ + (t − c))^{d+1} h_ε.

φ_ε → (t − c)^{d+1} h₀ in C^k(I), which has a zero of exact order d + 1 + m at c and no other zero in I. So
φ_ε^{(d+1+m)} ≠ 0 on I for small ε, φ_ε has at most d + 1 + m zeros in I, and by Rolle
Z_I(g_ε) ≤ (d + 1 + m) + (d + 1) = 2(d + 1) + m. The argument does not use the size of P_{c,ε}.

(f) Sum: Z(g_ε) ≤ Z(h₀) + Σ_{c∈C} 2(d_c + 1) ≤ B_wide + 2 Σ_{narrow}(d_j + 1). With (a), (b) this is the claim. ∎

### 3.5 Checks (MEASURED)

`explicit.py`, `capsearch.py` in this directory (numpy / mpmath, single process).

- Family A: one wide Gaussian minus N − 1 narrow spikes has exactly 2N − 2 sign changes for N = 2, 3, 5, 9. The cap
  is attained for d = 0, and the equal-width cap D − 1 is exceeded. So the imp-3932 cap does not extend to distinct
  widths, and the factor 2 is real.
- Random search with hill climbing, 10 configurations (N ≤ 5, degrees ≤ 3), 150 restarts each: no violation. Maxima
  found: 2, 4, 6, 8 (d = 0, equal to the cap); with d > 0 the maxima found (3, 5, 6, 7, 5, 5) lie between D_t − 1
  and the cap. The cap is not claimed sharp for d > 0; Σ(d_j + 2) − 2 is the natural guess (OPEN).

### 3.6 Corollary for the frozen ladder

Class R (real widths, real frequencies, any number of widths):

    Φ_fr(u) = Σ_{j=1}^{N} e^{−α_j u²} [A_j(u) cos(τ_j u) + B_j(u) sin(τ_j u)],

α_j > 0, τ_j ≥ 0, pairs (α_j, τ_j) distinct, A_j even and B_j odd real polynomials, d_j = max degree,
D := Σ_j (d_j + 1). Dimension is counted by degree: a sparse block u^k e^{−αu²} transforms to a dense Hermite-type
polynomial of degree k with up to k real zeros, so a count of non-zero coefficients would be the wrong measure.

Then Ξ_fr(t) = Σ_j [R_j^+(t) e^{−(t−τ_j)²/4α_j} + R_j^−(t) e^{−(t+τ_j)²/4α_j}] with real polynomials of degree
≤ d_j (PROVED: product-to-sum and L1 of imp-3932). That is at most 2N blocks with D_t ≤ 2D, so by Theorem HF
Z(Ξ_fr) ≤ 4D − 2. Ξ_fr is even, so M sign changes on (0, ∞) give 2M real zeros and

    **D ≥ (M + 1)/2.**

With L4 of imp-3932 (sign transfer) and M = 12,363,153,437,138: any class-R ladder that certifies the
Platt–Trudgian sign changes has D ≥ 6,181,576,718,570, a factor > 8.9·10⁶ above the 691,008-term Riemann–Siegel
main sum at T0. In the imp-3932 convention (degree counted in u²) the bound reads D₃₉₃₂ ≥ (M + 1)/4.
Reading S is false in class R under any evaluation model that reads each stored coefficient once.

## 4. Exact reduction of what remains

Theorem HF needs real s_j. With one complex width the cap disappears: e^{−iβu²} transforms to a constant multiple
of e^{it²/4β}, whose real part has ~T²/(4πβ) zeros up to T with D = 1 (PROVED, direct). Quadratic phases are the
content of the Riemann–Siegel formula and of the Odlyzko–Schönhage and Hiary algorithms. So:

- **Class R:** reading S is refuted (imp-3932 + imp-33233(A) + Theorem HF).
- **Complex-width ladders:** the class contains the baseline's own technology. Refuting reading S there is
  equivalent to an unconditional lower bound "certifying sign Z(t) costs ≥ t^{c}" for the relevant model; no such
  bound is known for any c > 0. Proving reading S there is equivalent to a certified algorithm faster than the
  best baseline (Hiary t^{4/13+o(1)} single evaluation; Odlyzko–Schönhage t^{o(1)} amortised). OPEN, and a
  question in algorithmic number theory with no zero-location content.
- **Sparse-evaluation residual** (imp-3932 obstruction 1): whether a specific class-R coefficient vector of length
  ≥ M/2 admits a short straight-line program. OPEN (no unconditional lower bounds for explicit polynomials).
- **Reading C:** finite, benchmarkable, not attempted.

## 5. DH control

Required form: a valid RH argument must fail for Davenport–Heilbronn. Applied here in reverse, as a content test.

- Theorem HF and L1–L4 concern the approximant only. They hold for any target.
- f_DH has a Riemann–Siegel-type evaluation (it is a combination of two Dirichlet L-functions mod 5) with main
  sums of length ≍ √T, and ≫ T (log T)^{1/2−ε} zeros on the line (Karatsuba, CLASSICAL; a positive proportion is
  not needed). So M_DH(T) exceeds the main-sum length by a factor ≫ √T and reading S fails for DH by the same
  inequality.
- No step uses Λ(n) ≥ 0, multiplicativity, or Hecke structure. A statement that is equally true or false for ζ and
  DH carries no Euler-product content. This is the formal sense of "independent of RH" in §2.

## 6. Pivot (once): the rest of Section 22 under the 7/8 half-plane

The adjacent idea with RH content is the pair 22.3 / 22.4, where the named tools do apply. Notation as in eq48:
F(w) = ξ(1/2 + w), L = F′/F, zeros w of F, Δ = sup Re w, v(t) = Σ_j b_j e^{−x_j t} with x_j > 0,
V(z) = ∫₀^∞ v(t) e^{−zt} dt, and

    Q_a(v) := Σ_{i,j} b_i b̄_j (L(x_i + a) + L(x_j + a))/(x_i + x_j).

**D1 (CLASSICAL, short proof).** For every a ≥ 0 and every finite v,

    Q_a(v) = Σ_w |V(a − w)|² + 2 Σ_w (a − Re w) ∫₀^∞ |∫_t^∞ v(s) e^{−(a−w)(s−t)} ds|² dt.

Proof: L(z) = Σ_w 1/(z − w) (symmetric summation), the zero set is closed under conjugation, and
(1/(x+a−w) + 1/(y+a−w̄))/(x+y) = 1/((x+a−w)(y+a−w̄)) + 2(a − Re w)/((x+a−w)(y+a−w̄)(x+y)); both resulting sums
converge absolutely. MEASURED (`sos_check.py`, a = 3/8, 4 nodes): direct value 0.0108658; zero-side partial sums
with 150 / 300 / 600 zeros 0.0097045 / 0.0101087 / 0.0103840; the deficit is positive and scales as log γ_N/γ_N
(ratio 0.064–0.066), as a positive tail must.

**D2 (CLASSICAL).** Q_a ≥ 0 for all finite v ⟺ a ≥ Δ. (⇐ by D1. ⇒: the Pick kernel of L(· + a) is positive on
(0, ∞)², so L(· + a) extends to a positive-real function on Re z > 0 and has no pole there.) This is the atlas §2
threshold in Pick form.

**D3 (PROVED, direct).** On the prime side Q_a(v) is the Weil functional of the damped test e^{−a|ℓ|}·(v ⋆ ṽ)(ℓ):
the prime term is Σ_n Λ(n) n^{−1/2−a} · 2 Re C_v(log n), C_v the one-sided autocorrelation of eq48 (absolutely
convergent when min x_j + a > 1/2; otherwise through the compensated count M(l) of eq48).

Consequences:

- **22.4** (E_a Hermite–Biehler for every a > 0) holds for a ≥ Δ and fails for a < Δ. Classical input gives
  a ≥ 1/2. The openai/math half-plane gives a ≥ 3/8, and the follow-ups a ≥ 0.374887, each with the review status of
  its source (Lean-checked locally for 7/8; follow-ups unrefereed). This is a restatement of the half-plane, not an
  addition to it.
- **22.3** at shift a ≥ Δ has the explicit realization D1. It is a zero-side realization, so it is "circular" in the
  paper's sense: positivity is read off only after Δ ≤ a is known. A realization at a = 0 whose squares do not use
  zero locations would prove RH by D2. So 22.3 implies RH; it is not weaker.
- **Where the Euler product enters:** only in the input Δ ≤ 3/8. D1–D3 hold for DH with Δ_DH > 1/2 (DH has zeros in
  Re s > 1), so for DH the damped positivity fails at a = 3/8 and at a = 1/2. D1–D3 are Euler-blind.
- **Gap to RH in this language:** passage from the damped cone e^{−a|ℓ|}·(positive definite), a = 3/8, to a = 0.
  Q_a(v) is the Poisson-smoothed zero sum and positivity holds exactly on [Δ, ∞). The only monotonicity that Λ ≥ 0
  gives directly is that, on tests with C_v ≥ 0, the prime term decreases as a grows; that favours larger a, not
  smaller. No lever found. This agrees
  with the round-2 harmonic-floor result (a lower bound can only be moved between lines if one line already carries
  it). I stop here as the brief requires.

Section 22 summary: 22.1 independent of RH; 22.3 ⇒ RH; 22.4 ⟺ RH, known for a ≥ Δ only; 22.2 not analysed here.

## 7. Three weakest steps

1. **(VD) is cited, not re-proved.** The proof uses only the sign-change form for bounded integrable continuous g,
   which is the standard total-positivity statement, but the exact theorem number in Karlin was not checked against
   the book. The multiplicity lemma (a) was added so that the multiplicity form of variation diminishing is not
   needed; that lemma and the tail step (c) are written here and have had no referee.
2. **Numerical support for Theorem HF is small** (N ≤ 9 explicit, N ≤ 5 random, degrees ≤ 3, double precision grid
   counting). It tests the statement, not the proof. Sharpness is established only for d = 0.
3. **The independence claim is relative to the formalisation.** The paper's wording fixes neither the class nor the
   baseline. Class R with degree-based D is the widest real-parameter reading; a different cost measure (non-zero
   coefficients, straight-line programs) or complex widths leaves the open items of §4. The statement "no RH
   content" is proved for the arguments on record, by the DH test, not for every conceivable reading.

## Files

- `RESULT.md` (this file)
- `explicit.py` — extremal families for Theorem HF
- `capsearch.py`, `capsearch.out` — random search against the cap
- `sos_check.py` — numerical check of D1 at a = 3/8
