# RH attempt, round 3 (1 November 2026): pole-coupled pretentious rigidity at lengths ≫ γ₀

**Outcome: the attempt fails. No proof of RH, no new zero-free region, no change to any Λ bound. NO QED.**
Internal working note; not externally refereed; nothing committed.

The attempt takes the round-2 referee sketch (phase-alignment E3) and the round-2 synthesis proposal 2 and turns them
into a complete argument:

* The pole of ζ(s + iγ₀) at 1 − iγ₀ forces the twisted coefficients n^{−iγ₀} to be "pole-coupled" (pretentious to
  n^{−iγ₀} at power scale).
* For pole-coupled Euler products, a zero planted at β₀ + iγ₀ carries a pole at the conjugate point β₀ − iγ₀.
* ζ has a zero, not a pole, at β₀ − iγ₀. The intended conclusion is a contradiction.

The new exact tool is **Theorem PC** (pole coupling, §1 Step 2), which states the referee sketch as a non-perturbative
theorem and proves it from Landau's lemma. It holds. The argument fails at the next step.

## The line where it fails

**Step 4, Lemma Z (a zero-free pole-coupled model at ρ₀).** Step 4 needs a completely multiplicative g₀ with
|g₀(p)| ≤ 1 and three properties:

* its Dirichlet series G₀ has a simple pole at s = 1;
* its Landau series D_{g₀} has no real singularity at or to the right of β₀;
* G₀ is regular and non-zero at ρ₀ and at ρ̄₀.

Relative to such a g₀, the zero of ζ at ρ₀ would be "planted", and Theorem PC would then give the contradiction.

* **Lemma Z is equivalent to ζ(ρ₀) ≠ 0 (Theorem PCR, §2.1; PROVED, elementary).** Theorem PC applied to g₀ itself gives
  ord_{ρ₀}G₀ + ord_{ρ̄₀}G₀ = 2·ord_{ρ₀}ζ. So a zero-free model exists exactly when ζ(ρ₀) ≠ 0, and then g₀ ≡ 1 (G₀ = ζ)
  already works. Step 4 assumes the conclusion.
* **The planting law in the referee sketch needs ord_{ρ₀}ζ = 0, which is the negation of the hypothesis.** Theorem PC
  says that a zero of a pole-coupled G at w forces a pole at w̄ **only when ζ(w) ≠ 0**. When ζ(w) = 0 the same theorem
  is the identity 1 + 1 = 2·1. The sketch's "pole planted where ζ has a zero" is the conflict between ζ(ρ₀) ≠ 0 and
  ζ(ρ₀) = 0. It is not a conflict inside the hypothesis.
* **Each natural construction of the model fails in the way Theorem PC predicts (§2.2; PROVED for the constructions
  given, MEASURED at N = 10⁸).**
  * Unimodular rotation (debiasing the prime phases at frequency γ₀) moves the zero from ρ₀ to ρ̄₀ and does not remove
    it (Proposition RT). Measured: residues +1.002 at w and −1.002 at w̄, and r(w) + conj r(w̄) = 2·10⁻⁴.
  * Reducing the modulus (|g₀| < 1, which removes prime mass) creates a real singularity of D_{g₀} at σ* ≥ Re w, where
    Theorem PC says nothing (Proposition PT). Measured: a real double zero at β, coefficient −2.00003.
  * The round-2 construction without the pole (Theorem MT) is not pole-coupled: D_g has a pole at s = 1 and σ* = 1.
    Measured: Σ(1 − Re g(p)) log p / x = 0.990, 0.996, 1.001 at x = 10⁶, 10⁷, 10⁸.
* **Lengths ≫ γ₀ do not help (§2.4).**
  * The pole term P of the explicit formula cancels from every comparison between the prime side and the zero side.
    Round-1 (★_min) is W(f) > −2m·s(a), and W does not contain P.
  * The support range where P is visible (round-2 E1/E2: 2a ≳ 4 log γ₀) comes from the jump of the round-1 filter. With
    a C^∞ cutoff, |P/(2m)| ≤ 2.1·10⁻³⁵ at γ₀ = 1000 and 2a ≤ 32. With the sharp filter it is 3.22 at 2a = 32.
  * At lengths N ≫ (γ₀ log γ₀)² the pole term N^{1−iγ₀}/(1 − iγ₀) is the leading term of Σ_{n≤N} Λ(n)n^{−iγ₀}. It is
    the equidistribution main term, not a rigidity input. Crossover measured at 5.41·10⁵ and 4.11·10⁷ for γ₀ = 200 and
    1000; predicted 5.41·10⁵ and 4.10·10⁷.
* **The Halász (non-positivity) route is twin-invariant (Proposition H′, §2.3 R1).** The rotation twin and the pair twin
  are at finite pretentious distance from 1. So every Halász-type statement, which depends only on the distances
  D(f, n^{it}; x), gives the same conclusions for them as for ζ, up to factors (log x)^{o(1)}, although they have a zero at a
  chosen w with ζ(w) ≠ 0.

**What it reduces to (§2.5).** Lemma Z for every ρ₀ with Re ρ₀ > θ is equivalent to zero-freeness of ζ on Re s > θ. By
the one-sided Landau theorem (arithmetic-foundation §2, either sign) that is ψ(x) ≥ x − C_ε x^{θ+ε}: the one-sided
target behind the V7 floor of atlas §10, with exponent p = 2θ − 1 (the atlas states floor ⟹ half-plane). Excluding the
zero ρ₀ needs p < 2δ₀; RH needs p = 0. This is the first item of
the atlas closing line, the same terminal object as round 1 (Theorem E, Lemma L) and round 2 (harmonic floor H5,
Stepanov Branch C, phase alignment).

**Davenport–Heilbronn** leaves at Step 2, the Euler-product step. Its logarithmic derivative has coefficients on non-prime-powers
(Λ_f(6) = (1 + κ²) log 6, and 906 such n ≤ 3000). The Landau series Λ(n) − Λ_f(n) has 461 negative coefficients for
n ≤ 3000, and f has no pole at 1. Since the argument fails for ζ before it reaches a conclusion, the DH test is not what
stops it.

RH is open. Platt–Trudgian Λ ≤ 0.2 stands. No zero-free region and no Λ bound changes.

**Grades** (as in rounds 1–2).
* **PROVED**: complete argument written here; same-agent check only unless stated.
* **PROVED (elementary)**: a short algebraic or logical argument.
* **ARGUED**: the argument is given, but one standard step is sketched (named where it occurs).
* **MEASURED**: actual primes or constructed twins at N ≤ 10⁸, double precision unless stated.
* **HIGH-PRECISION QUADRATURE**: trapezoid sums in Arb (200 bits). Rounding is rigorous; aliasing is checked by step
  refinement; not an interval-certified integral.
* **HEURISTIC**.
* **[L]**: a literature statement, not re-verified here.

**Referee status.**
* This file was written and attacked by one agent context. The attack is §2. A same-agent adversarial pass with
  independent recomputation is §5.
* No fresh-context referee was run by this agent: the agent has no tool to start one.
* No argument survived, so the instruction to re-check a surviving argument with a fresh referee does not apply.
* All new statements (Theorem PC, Theorem PCR, Lemmas KL and AC, Propositions RT, PT, H′ and LG) are same-agent checked
  only. They need an independent referee before they are cited outside this note.

**Scripts** (all `.venv-arb/bin/python -I`, one process each, < 10 s, < 3 GB; outputs in `tmp/rha-pole-pretentious-out/`):

| script | content | output |
|---|---|---|
| `tmp/rha-pole-pretentious-twins.py` | rotation twin (Prop RT), real pair twin (Prop PT), greedy unimodular pair, MT coupling check; fits of ψ_g − ψ to the predicted singular basis, N = 10⁸, w = 0.85 + 8i and 0.70 + 8i | `twins.json`, `twins.log` |
| `tmp/rha-pole-pretentious-lengths.py` | Σ_{n≤N} Λ(n)n^{−iγ₀} against the pole term at γ₀ = 200, 1000, 5000 (N ≤ 10⁸); the three length scales at γ₀ = 3·10¹² | `lengths.json`, `lengths.log` |
| `tmp/rha-pole-pretentious-poleterm.py` | explicit-formula pole term P(a) for the round-1 sharp filter (closed form) and a C^∞-cutoff filter (Arb trapezoid), γ₀ = 1000, 2a = 8..40 | `poleterm.json`, `poleterm.log` |
| `tmp/rha-pole-pretentious-dh.py` | Davenport–Heilbronn: Λ_f(n) for n ≤ 3000, prime-power support, Λ-domination, pole | `dh.json`, `dh.log` |

---

## 0. Goal, reading record, overlap with the audit

### 0.1 Goal and plan

**Goal.** Prove ζ(s) ≠ 0 for ½ < Re s < 1. With QRH 7/8 (I5) it is enough to treat ½ < Re s ≤ 7/8. The deliverable is a
proof, or the exact line where the argument fails and why.

**Plan (round-2 synthesis, proposal 2; round-2 phase alignment, referee notes E1–E3).**

* Theorem MT of round 2 gives a completely multiplicative unimodular f whose series F₁(s) = Σ f(n)n^{−s} has a planted
  zero at β₀ and satisfies every Euler-product property used at short lengths.
* That twin has no pole at 1 − iγ₀. Its shared properties hold only in |Im s| < γ₀ and at supports 2a ≲ 4 log γ₀
  (E1–E3).
* The plan is to work outside that range and use two facts together:
  * the pole of F₁ = ζ(s + iγ₀) at 1 − iγ₀ (Halász / Granville–Soundararajan: the pole forces pretentiousness to
    n^{−iγ₀});
  * the referee's observation that, for unimodular pretentious f, a phase perturbation that plants a zero at β₀ + iγ₀
    plants a pole at the conjugate point β₀ − iγ₀, where ζ has a zero.
* DH is to be excluded through the Euler product.

**Expected stop (round-2 synthesis).** Pretentious bounds are mean-value statements (wall 4). Near-line zeros (δ₀ → 0)
need lengths exp((log log γ₀)/δ₀), i.e. the V7 p = 0 floor. The actual stop (§2) comes earlier and is structural:
Lemma Z. The terminal object is the expected one.

### 0.2 Reading record

Read before writing, in this order.

1. **The user's audit, PR #27.** `/tmp/atlas-snap-historical-routes.md` (atlas §§1–12 and closing line),
   `/tmp/atlas-snap-PUBLICATION_SCOPE_2026-10-30.md`, and the module notes arithmetic-foundation, spectral-head-theory,
   signed-complement, whole-even-certificate, spectral-denominator-repair, suzuki-recurrence, prime-memory and
   finite-suzuki-certificate.
   * All ten snapshots are byte-identical to `refs/pr/27:research/rh/...`. SHA-256 prefixes were recomputed in this
     session, e.g. historical-routes `d7c63dd2357431c8`, arithmetic-foundation `121e75c25d5c42a5`, PUBLICATION_SCOPE
     `240172f513d7c581`.
2. **Rounds 1 and 2.** `2026-11-01-synthesis.md` and `2026-11-01-r2-synthesis.md` in full. From the round-2 phase-alignment
   file: Theorem MT, Corollary SF, Proposition OA, the three-way comparison and the referee scripts
   `/tmp/referee-phase-alignment/pole_check.py` and `mt_checks.py`. From the round-1 contradiction file: Lemmas 1–4,
   Proposition 5 and Step 5 (the definition of P and β).
3. **The walls.**
   * `src/data/flow-blindness-no-go.js` (SL2);
   * `src/data/imp-95530-native-span-arithmetic-input-rigidity.js` (NS-RIGID A1–A6, RES-T B1–B3);
   * `formalization/paper/mv-cap-theorem.md` with the route-42 referee corrections;
   * `research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md` (Theorems A, B);
   * the fifty-routes synthesis (row 11 and the route list).

### 0.3 Inputs

* **(I1) Landau's lemma [L, classical; stated and proved in arithmetic-foundation §2].** A Dirichlet series with
  non-negative coefficients and finite abscissa of convergence σ_c is singular at the real point σ_c.
* **(I2) Euler product and analytic continuation of ζ.** ζ(σ) < 0 for 0 < σ < 1, so ζ has no zeros in (0, 1)
  [arithmetic-foundation §1].
* **(I3) Prime number theorem with classical error** [L], and two consequences for γ₀ ≠ 0:
  * (γ₀ log p mod 2π) is dense: for large t every interval [t, t e^{2π/|γ₀|}] contains primes, and γ₀ log p runs
    through a full period there;
  * it is equidistributed with logarithmic weights 1/p, since Σ_p p^{−1−ikγ₀} converges for k ≠ 0 (ζ(1 + ikγ₀) is
    finite and non-zero).
  It is not equidistributed in natural density: Σ_{p≤x} p^{−ikγ₀} log p ~ x^{1−ikγ₀}/(1 − ikγ₀), which is not o(x).
  Lemma KL uses only density.
* **(I4) Chebotarev density theorem; Brauer induction;** L(s, χ) holomorphic and non-zero at s = 1 for non-trivial
  irreducible Artin χ [L]. Used only in Lemma AC.
* **(I5) QRH 7/8 (openai/math, Lean-checked in this project).** No zeros in Re s > 7/8. Used only to restrict β₀.
* **(I6) Platt–Trudgian:** RH verified to height 3.0001753·10¹² [L]. So γ₀ > 3·10¹², and every w with ½ < Re w < 1 and
  |Im w| < 3·10¹² has ζ(w) ≠ 0.
* **(I7) Halász's theorem in the Granville–Soundararajan form, and the triangle inequality for pretentious distance**
  [L]. Used only in R1 / Proposition H′.
* **(I8) Kolmogorov's three-series theorem / martingale convergence for random Dirichlet series** [L]. Used only in
  Proposition RT.
* **(I9) Kaczorowski–Perelli:** the degree-one Selberg class consists of L(s + iθ, χ), χ primitive [L]. Used only in
  R3.

**Not an input:** any bound on ζ's zeros beyond (I2), (I5), (I6), and any Weil-positivity statement at finite support.

### 0.4 Overlap with the audit (PR #27) and with rounds 1–2

Every overlap is listed with what is different. No row repeats a route the atlas records as failed without stating the
difference.

| object in this attempt | atlas / module / round | what the source says | what is different here |
|---|---|---|---|
| Theorem PC: Landau positivity of D_g = Σ Λ(n)(1 − Re g(n))n^{−s}; zero/pole accounting r_G(w) + conj r_G(w̄) = 2 ord_w ζ | arithmetic-foundation §2 (Landau lemma, one-sided theorem); atlas §2 (a denominator zero of ζ(2s)/ζ(s) is generally a pole; common zeros cancel, remaining pole order [m(ρ) − m(ρ−2a)]₊) | Landau's lemma turns a one-sided bound into a half-plane. Zero/pole bookkeeping of a fixed ratio does not locate zeros. | PC applies Landau to a **pair** (ζ, companion G) whose poles at s = 1 cancel. Its output constrains the companion's zeros relative to ζ's. That is why it cannot locate ζ's zeros (Theorem PCR). The §2 caveat is the same phenomenon in a fixed ratio. |
| Pole cancellation at s = 1 between ζ and a companion | atlas §10: "Matching numerator and denominator Euler lines also erases the principal detector; differentiation restores removed coefficients"; sixth-phase filter retains eigenvalue one | Matching Euler lines erases the principal (pole) detector; mean energy is not worst-case control. | Theorem PC is this mechanism made exact for Landau positivity. Once the principal detector at s = 1 is erased, what remains is ζ-relative (PC) or an identity (Lemma AC). Lemma KL is the converse: positivity on ζ's own Kronecker line never erases it. |
| Reduction target: one-sided bound ψ(x) ≥ x − C x^{θ+ε}, V7 floor p = 2θ − 1 | atlas §10 (V7 floor, p < 1 ⟹ Re s > (1+p)/2); arithmetic-foundation §2; atlas closing line item 1; Suzuki §4 / prime memory (signed credit prefix) | The one-sided Landau bound at α = 0 is RH. The signed credits are uncontrolled; the debts are summable. | Same terminal object, reached by a new route (companions). The Landau mass N_g(x) = Σ_{n≤x} Λ(n)(1 − Re g(n)) is a non-negative "debt"; the credits are ζ's own oscillation, which no companion supplies. |
| Lengths ≫ γ₀; the pole term P | round-1 Step 5 (β = (A + P)/(2m)); round-2 E1/E2 (P/(2m) ≈ δ₀e^a cos(·)/γ₀², dominant past 2a ≈ 4 log γ₀) | P was dropped in round 2 Step 2(a); it breaks Theorem MT(e) and Corollary SF "eventually in a". | P cancels from (★_min) (algebra), and its size is a property of the filter's jump (§2.4). Rotation twins carry P, so round-2 E2 is repaired in the twin's favour (Corollary SF′). |
| Twins | round-2 Theorem MT, Corollary SF, three-way comparison; atlas §3 (finite independent prime ladders are not the theta law); atlas §7 (finite-prime rigidity) | MT: an Euler product with a planted zero and no pole. §7: changing finitely many coefficients with the archimedean side fixed gives a negative direction of a finite matrix. | Rotation twins (Prop RT) are pole-coupled. They differ from "ζ with a zero at ρ₀" only at ρ̄₀ (pole instead of zero) and on the real line. Pair twins (Prop PT) are real and Λ-dominated; they pay a real zero at Re w. Neither is a statement about a Weil matrix, so §7 is not touched. |
| Equidistributed companions | round-2 modular tower Theorem 4.13 / Cor 4.14 (equivariant dictionaries see only pole functionals); Eisenstein confinement | Exactly symmetric structure sees only poles. | Lemma AC: a pole-cancelling non-negative combination of Artin L-functions is zero. Same theme ("symmetry sees only the pole"), different object: Landau positivity, not a Hodge-index dictionary. |
| Pretentious / Halász input | atlas §3 (positive covariance cannot fix an absolute floor); MV-CAP (route 42); round-2 density profile (family-to-single passage) | Mean values do not certify an every-window statement. | Proposition H′: pretentious data are invariant under finite-distance twins that carry a zero at a chosen w. This is an explicit counter-model for the Halász route, not an appeal to MV-CAP. |
| "No uniform margin" | atlas §11 | A uniform strictly positive scalar margin is the wrong RH target. | No step uses a margin. Lemma Z is a zero-location statement. |
| Fixed-support positivity | atlas §9; whole-even certificate; spectral-denominator repair; RES-T (B1–B3) | Signed all-support lower bounds are missing; negative surrogates are not negative forms. | Not used. The finite-length form of PC, Σ Λ(n)(1 − Re g(n))n^{−1/2}k(log n) ≥ 0, is trivially true and is not a lower bound for the actual Weil form. For g ≡ 1 it is 0 ≥ 0. |
| Spectral head; signed complement; Suzuki finite certificate | modules | Near-null head of dimension ~λ²; physical-complement bound open; Ψ > 0 to X = 10⁷ in the box direction. | Not used. This attempt works with Dirichlet series and Landau's lemma, not with the supported Weil operator. |
| One-sided prime sums | round-1 operator Theorem E; round-2 harmonic floor H5 (RH ⟺ corrected Euler products bounded above ⟺ one-sided real prime sums); round-2 Stepanov Branch C | One-sided bounds at square-root precision are RH. | §2.5 shows that the companion problem is the same one-sided bound, with the companion giving the minorant ψ ≥ Re ψ_{g₀}. g ≡ 1 is the extremal companion, so nothing is gained. |
| Euler-product algebra and singularities | round-2 Proposition OA (Euler-product algebra cannot move the singularity created by the zero to a larger real part) | Pole positions of the generated algebra are at shifted zeros of ζ. | PC is the positivity counterpart: in the pole-coupled class the zero mass at {w, w̄} is conserved to the right of σ*(g). |

---

## 1. The argument, written as a proof

Steps 1–3 are proved. Step 5 is true for the round-1 filter (§2.4). Step 4 is the step that fails (§2). Step 6 would follow if Step 4 held.

### Step 1 (setting)

Assume ζ(ρ₀) = 0 with ρ₀ = β₀ + iγ₀ and β₀ > ½. By the functional equation and ζ(s̄) = conj ζ(s) we may take γ₀ > 0.
By (I5) and (I6), ½ < β₀ ≤ 7/8 and γ₀ > 3.0001753·10¹². Put δ₀ = β₀ − ½.

Let f(n) := n^{−iγ₀}. It is completely multiplicative and unimodular, and

    F₁(s) := Σ_n f(n) n^{−s} = ζ(s + iγ₀).

* (1a) F₁ has a simple pole at s = 1 − iγ₀ with residue 1, and no other pole.
* (1b) F₁(β₀) = 0, from ρ₀. Also F₁(β₀ − 2iγ₀) = ζ(β₀ − iγ₀) = conj ζ(ρ₀) = 0, because Λ is real.
* (1c) In the coordinates centred at the pole, G(s) := F₁(s − iγ₀) = ζ(s). The pole is at 1 and the zeros are at ρ₀ and
  ρ̄₀. The twist relative to the pole is g := f·n^{iγ₀} ≡ 1.

So the referee's objects are, for ζ itself: the pole of ζ at 1 (seen at 1 − iγ₀ after the twist), the zero ρ₀ (seen at
β₀) and the conjugate zero ρ̄₀ (seen at β₀ − 2iγ₀). The round-2 twin of Theorem MT has the second of these but not the
first or the third.

### Step 2 (the pole-coupling theorem)

**Definition 2.1 (pole-coupled class).** 𝒞 is the set of completely multiplicative g: ℕ → ℂ with |g(p)| ≤ 1 for every
prime p, such that, with G(s) := Σ g(n)n^{−s}:

* (C1) −G'/G = Σ Λ(n)g(n)n^{−s} (Re s > 1) extends meromorphically to Re s > σ₀(g), for some σ₀(g) < 1;
* (C2) G has a simple pole at s = 1, i.e. Res_{s=1} G'/G = −1.

Write r_G(w) := Res_w G'/G. It is the order of G at w when G is meromorphic at w, and can be any complex number in
general (branch-type singularities of G are allowed; only G'/G needs to be meromorphic). Put G̃(s) := Σ conj(g(n))n^{−s}
= conj G(s̄), and define the **Landau series**

    D_g(s) := Σ_n Λ(n) (1 − Re g(n)) n^{−s}.

Let σ*(g) be the supremum of σ₀(g) and of the real points σ > σ₀(g) at which (the continuation of) D_g is not holomorphic.

**Theorem PC (pole coupling; PROVED, elementary).** Let g ∈ 𝒞. Then:

* (i) for every w with Re w > σ*(g) and w ≠ 1,

      r_G(w) + conj r_G(w̄) = 2 · ord_w ζ;

  more precisely the principal parts satisfy PP_w(G'/G) + PP_w(G̃'/G̃) = 2 ord_w ζ /(s − w);
* (ii) N_g(x) := Σ_{n≤x} Λ(n)(1 − Re g(n)) is non-decreasing and N_g(x) = O(x^{σ*(g)+ε}) for every ε > 0;
* (iii) for real σ > max(σ₀(g), 0), σ ≠ 1, Res_σ D_g = Re r_G(σ). So σ*(g) is the largest real point (above σ₀) at which
  Re r_G ≠ 0, or σ₀(g) if there is none (assuming G'/G has only simple poles on the real axis). If σ*(g) > σ₀(g) is a
  simple pole of D_g, then Re r_G(σ*) > 0.

*Proof.*

1. For Re s > 1, G = Π_p (1 − g(p)p^{−s})^{−1} and −G'/G = Σ_p Σ_k g(p)^k log p · p^{−ks} = Σ Λ(n)g(n)n^{−s}, because
   g(p^k) = g(p)^k. Likewise −G̃'/G̃ = Σ Λ(n) conj g(n) n^{−s}. Hence, on Re s > 1,

       D_g = −ζ'/ζ + ½ (G'/G + G̃'/G̃).

   Its coefficients Λ(n)(1 − Re g(n)) are ≥ 0, since |g(p^k)| = |g(p)|^k ≤ 1.
2. G̃'/G̃(s) = conj (G'/G)(s̄) is meromorphic on Re s > σ₀(g) by (C1). So D_g continues meromorphically to Re s > σ₀(g).
   The residue of −ζ'/ζ at w is −ord_w ζ, and Res_w G̃'/G̃ = conj Res_{w̄} G'/G. Hence

       Res_w D_g = −ord_w ζ + ½ r_G(w) + ½ conj r_G(w̄).

   At s = 1: ord_1 ζ = −1 and r_G(1) = −1 by (C2), so Res_1 D_g = 1 − 1 = 0. On the real line ζ has no zeros in (0, 1)
   (I2) and none in [1, ∞), which gives (iii) apart from its last sentence.
3. The coefficients of D_g are at most 2Λ(n), so σ_c(D_g) ≤ 1. Suppose σ_c(D_g) > σ*(g). Then σ_c is a real point
   greater than σ₀(g) at which the continuation is holomorphic, which contradicts Landau's lemma (I1). So
   σ_c(D_g) ≤ σ*(g).
4. On Re s > σ*(g) the series D_g converges, so it is holomorphic there. By the identity theorem it agrees with the
   meromorphic continuation on that connected half-plane. So the continuation has no singularity in Re s > σ*(g): all
   principal parts vanish there, which by step 2 is (i). Monotonicity in (ii) is the sign of the coefficients. The
   growth bound is the convergence of D_g at σ* + ε.
5. Last sentence of (iii): if σ* > σ₀ is a singularity then σ* ≤ σ_c (a convergent series is holomorphic), so σ_c = σ*
   by step 3. If σ* is a simple pole, then D_g(σ) > 0 for σ > σ* and |D_g(σ)| → ∞ as
   σ ↓ σ*, so the residue is positive. ∎

The theorem uses only Landau's lemma, the Euler product of G (through the prime-power support of −G'/G) and the sign
condition Re g(n) ≤ 1. It is not claimed to be new. It is the Landau positivity behind the classical proofs that
L(1, χ) ≠ 0 and ζ(1 + it) ≠ 0, applied to the pair (ζ, G) when their poles at s = 1 cancel.

**Corollary PC1 (planting law; PROVED from Theorem PC).** Let g ∈ 𝒞 and Re w > σ*(g), w ∉ ℝ.

* (i) If ζ(w) ≠ 0 and G has a simple zero at w (r_G(w) = 1), then r_G(w̄) = −1: **G has a simple pole at w̄.**
* (ii) If ζ has a simple zero at w (hence at w̄) and r_G(w) = 1, then r_G(w̄) = 1. No pole is planted.
* (iii) In general the zero mass of the conjugate pair, r_G(w) + conj r_G(w̄), equals 2 ord_w ζ. A companion in 𝒞 can
  move zero mass between w and w̄, but it cannot create or remove it to the right of σ*(g).

(i) is the round-2 referee sketch (phase alignment E3), now exact and without perturbation theory. In the sketch's
coordinates F₁(s) = G(s + iγ₀): a zero of F₁ at β₀ that ζ(s + iγ₀) does not share forces a pole of F₁ at β₀ − 2iγ₀,
i.e. a pole of G at β₀ − iγ₀. The first-order computation behind the sketch is the case g = e^{iφ}, |φ| small:
δ log G = iΣ φ(p)p^{−s} + O(φ²) is anti-symmetric under s ↦ s̄, so a logarithmic singularity +log(s − w) comes with
−log(s − w̄).

**Corollary PC2 (why the round-2 twin escapes; PROVED, MEASURED).** For the multiplicative twin of round-2 Theorem MT at
height γ₀, put g := f·n^{iγ₀}. By the construction of Theorem MT (real drift E f(p) = −ε_p and mean-zero
fluctuations, as in its proof step 2), Σ_{p≤x} g(p) log p = −x^{β₀+iγ₀}/(β₀ + iγ₀) + O_{γ₀}(x^{β₀−0.475}) + O(√x log x) =
O(x^{β₀}). So G has no pole at 1, r_G(1) = 0, Res_1 D_g = 1 and σ*(g) = 1: Theorem PC says nothing.

Measured on an independent MT-type construction at w = 0.85 + 8i, N = 10⁸ (`twins.json`):

* N_g(x)/x = 0.990, 0.996, 1.001 at x = 10⁶, 10⁷, 10⁸;
* ψ_g(10⁸)/10⁸ = −0.0014 − 0.0079i;
* the planted zero is present: the fitted coefficient of x^w/w in ψ_g is −0.999.

**Corollary PC3 (Davenport–Heilbronn leaves at this step; EXACT up to rounding, n ≤ 3000).** Let
f = ((1 − iκ)L(s, χ) + (1 + iκ)L(s, χ̄))/2, χ mod 5 with χ(2) = i, κ = 0.284079. Then f is not of the form
Σ g(n)n^{−s} with g completely multiplicative and |g| ≤ 1 (`dh.json`):

* the coefficients Λ_f of −f'/f live on non-prime-powers: Λ_f(6) = 1.936356 = (1 + κ²) log 6, and 906 integers
  n ≤ 3000 that are not prime powers have Λ_f(n) ≠ 0, with |Λ_f(n)|/log n up to 3.87;
* the would-be Landau series Σ (Λ(n) − Λ_f(n))n^{−s} has 461 negative coefficients for n ≤ 3000;
* f has no pole at 1 (Σ_{n≤3000} a(n) = 0 exactly, by periodicity).

So step 1 of the proof of Theorem PC (prime-power support and Re g ≤ 1) is unavailable for DH. This is the Euler
product entering.

### Step 3 (the pole forces pole-coupling)

**Proposition 3.1 (PROVED from Theorem PC).** Let f be completely multiplicative with |f(p)| ≤ 1, and suppose
F₁ = Σ f(n)n^{−s} has these properties:

* −F₁'/F₁ continues meromorphically to Re s > σ₀, with σ₀ < 1;
* F₁ has a simple pole at s = 1 − iγ₀;
* the Landau series of g := f·n^{iγ₀} has no real singularity in [σ₁, 1], for some σ₁ < 1.

Then g ∈ 𝒞, Σ_{n≤x} Λ(n)(1 − Re f(n)n^{iγ₀}) = O(x^{σ₁+ε}), and in particular

    D(f, n^{−iγ₀}; ∞)² = Σ_p (1 − Re f(p)p^{iγ₀})/p < ∞.

So f pretends to be n^{−iγ₀}, at power scale.

*Proof.* G(s) := Σ g(n)n^{−s} = F₁(s − iγ₀) has a simple pole at 1 and a meromorphic logarithmic derivative on
Re s > σ₀, so g ∈ 𝒞, and Theorem PC(ii) applies with σ*(g) ≤ σ₁. Partial summation gives the last claim. ∎

For ζ, f = n^{−iγ₀}, g ≡ 1, N_g ≡ 0, and the statement is empty. Any twin that reproduces the pole of ζ(s + iγ₀) at
1 − iγ₀ lies in n^{−iγ₀}·𝒞. This is the exact sense in which "the pole forces pretentiousness".

Halász's theorem (I7) is the mean-value analogue on Re s = 1: if |Σ_{n≤x} f(n)n^{iγ₀}| ≥ ηx for all large x, then
D(f, n^{−iγ₀ + it}; x) = O_η(1) for some t = O_η(1). It carries no power-scale information (§2.3, R1).

### Step 4 (planting) — THE STEP THAT FAILS

**Lemma Z (zero-free pole-coupled model at ρ₀).** There is g₀ ∈ 𝒞 with σ*(g₀) < β₀ such that G₀ is holomorphic and
non-zero at ρ₀ and at ρ̄₀.

*Intended proof (as attempted).* By Step 1 the zero shows up in the twisted prime sum as a bias that does not oscillate:

    Σ_{p≤x} log p · p^{−iγ₀} = x^{1−iγ₀}/(1 − iγ₀) − x^{β₀}/β₀ − x^{β₀−2iγ₀}/(β₀ − 2iγ₀) + (other zeros) + O(√x),

and the pole term is the equidistribution main term. "Remove the bias" to obtain the model. Three constructions were
proposed:

* **(Z1) phase debiasing.** Rotate the prime phases of g ≡ 1 by e^{iφ_p}, with φ_p real and small, so that the twisted
  sum of e^{iφ_p} loses its x^{β₀} term. To first order φ_p = +2p^{β₀−1} sin(γ₀ log p), since
  iφ_p p^{−iγ₀} = p^{β₀−1}(1 − p^{−2iγ₀}) has non-oscillating part p^{β₀−1}, which cancels the bias −x^{β₀}/β₀. The
  result is unimodular and pole-coupled (φ_p → 0).
* **(Z2) modulus debiasing.** Replace g ≡ 1 by g₀(p) = 1 − ν_p with ν_p ≥ 0, which removes prime mass where ψ runs ahead
  of x, so that ψ_{g₀} loses the oscillation −2 Re(x^{ρ₀}/ρ₀).
* **(Z3) pole-coupled random model.** Draw phases around 1 as in Theorem MT, but with mean drift towards 1, so that the
  model has the pole and none of the bias.

*Conclusion intended from Lemma Z.* Apply Theorem PC to g₀ at w = ρ₀. Here Re ρ₀ = β₀ > σ*(g₀), and

    0 + 0 = r_{G₀}(ρ₀) + conj r_{G₀}(ρ̄₀) = 2 ord_{ρ₀} ζ,

so ζ(ρ₀) ≠ 0, contradicting Step 1.

In the language of the referee sketch: write ζ = G₀ · Q. Since G₀(ρ₀) ≠ 0, the zero of ζ at ρ₀ is "planted" in Q by the
field 1/g₀. By the planting law it plants a pole at ρ̄₀, where G₀ is regular and non-zero. So ζ would have a pole at
ρ̄₀, but ζ(ρ̄₀) = 0.

Q itself is not a series with coefficients bounded by 1, so the rigorous form of this sentence is Theorem PC applied to
g₀, as above.

### Step 5 (why the argument is run at lengths ≫ γ₀)

In round 2 the twin of Theorem MT gave a model with the zero and every short-length Euler-product property. Lemma Z
requires the model to be pole-coupled. At supports 2a ≳ 4 log γ₀ + O(1), the explicit formula of ζ at height γ₀
contains the pole term P/(2m) ≈ δ₀ e^a cos(2γ₀a)/γ₀² of the round-1 matched filter (round-2 E1). Every pole-coupled
companion reproduces this term; the MT twin does not (E2). So in this range MT is not a valid model, and the argument
is confined to 𝒞, where Theorem PC applies.

*Status.* True for the round-1 sharp filter. §2.4 shows that it is not needed and does not help.

### Step 6 (conclusion, if Step 4 held)

If Lemma Z held for every ρ₀ with ½ < β₀ ≤ 7/8, then ζ would have no zeros there. With (I5) and the functional
equation that is RH.

**Davenport–Heilbronn** leaves at Step 2 (Corollary PC3): the Landau positivity behind Theorem PC needs the prime-power
support and Re g ≤ 1 that an Euler product with bounded coefficients provides. DH has neither, and it has no pole at 1.
This is consistent: DH has off-line zeros (ρ_DH = 0.808517 + 85.699348i, round 2).

---

## 2. The attack

### 2.1 Step 4 is the conclusion (Theorem PCR)

**Theorem PCR (pole-coupled rigidity; PROVED, elementary).** Fix ρ₀ = β₀ + iγ₀ with ½ < β₀ < 1 and γ₀ ≠ 0. Let 𝒯(ρ₀)
be the set of g ∈ 𝒞 with σ*(g) < β₀ and r_G(ρ₀) + conj r_G(ρ̄₀) ≠ 0, and let 𝒵(ρ₀) be the set of g ∈ 𝒞 with
σ*(g) < β₀ and G holomorphic and non-zero at ρ₀ and ρ̄₀ (the models of Lemma Z). Then:

* (i) 𝒯(ρ₀) ≠ ∅ ⟺ ζ(ρ₀) = 0 ⟺ 1 ∈ 𝒯(ρ₀);
* (ii) 𝒵(ρ₀) ≠ ∅ ⟺ ζ(ρ₀) ≠ 0 ⟺ 1 ∈ 𝒵(ρ₀);
* (iii) consequently Lemma Z at ρ₀ is equivalent to ζ(ρ₀) ≠ 0, and the pole-coupled class gives no reduction: an
  argument that derives a contradiction from "g ∈ 𝒯(ρ₀)" proves 𝒯(ρ₀) = ∅, and must in particular exclude its member
  g ≡ 1, which is ζ.

*Proof.* g ≡ 1 lies in 𝒞 with G = ζ, D_1 ≡ 0 and σ*(1) = σ₀(1), which can be taken arbitrarily small. So 1 ∈ 𝒯(ρ₀)
iff ζ(ρ₀) = 0, and 1 ∈ 𝒵(ρ₀) iff ζ(ρ₀) ≠ 0 (if ζ(ρ₀) ≠ 0 then also ζ(ρ̄₀) ≠ 0). Conversely, if g ∈ 𝒯(ρ₀) then
Theorem PC gives 2 ord_{ρ₀} ζ ≠ 0. If g ∈ 𝒵(ρ₀) it gives 2 ord_{ρ₀} ζ = 0. ∎

So the step that was meant to supply the contradiction is ζ(ρ₀) ≠ 0 itself. The same holds for the referee sketch read
as a proof: the planting law (Corollary PC1(i)) needs ζ(ρ₀) ≠ 0, the negation of the hypothesis. Under the hypothesis,
Corollary PC1(ii) applies, no pole is planted, and Theorem PC is the identity 1 + 1 = 2·1 for g ≡ 1.

The structure is that of NS-RIGID (A4)/(A5), in a different class: there, "within the native span the only
flow-critical arithmetic statement is RH itself"; here, within the pole-coupled class, the only statement that sees ρ₀
is ζ(ρ₀) = 0 itself. Theorem PCR is not the NS-RIGID theorem (it is not about Pick matrices at real nodes), but it is
the same dichotomy.

### 2.2 How each proposed construction of the model fails

Theorem PC predicts three outcomes for any attempt to remove ζ's zero mass at {ρ₀, ρ̄₀} with a companion: the mass
moves, a real singularity at σ* ≥ β₀ appears, or the companion is not pole-coupled. Each construction of Step 4 lands
on one of them.

**(Z1) Phase debiasing moves the zero; it does not remove it.** The construction is the rotation twin below with drift
sign ε = −1 at w = ρ₀. Under the hypothesis ord_{ρ₀} ζ = 1 it gives

    r_{G₀}(ρ₀) = 1 − 1 = 0,    r_{G₀}(ρ̄₀) = 1 + 1 = 2.

So G₀(ρ̄₀) = 0 and g₀ ∉ 𝒵(ρ₀). Rotating the other way moves the double zero back to ρ₀. The pair mass 2 is conserved
(Corollary PC1(iii)).

**Proposition RT (rotation twin; PROVED at the level of round-2 Theorem MT, same-agent check only; MEASURED).** Let
w = β + iγ with ½ < β < 1 and γ ≠ 0, let ε ∈ {+1, −1}, and let c ≥ 2. Put:

* sin η(p) := min(1, c p^{β−1}), with 0 < η(p) ≤ π/2;
* v(x) := −2ε x^{β−1} sin(γ log x) = iε(x^{w−1} − x^{w̄−1}), clipped to [−sin η, sin η] (the clip acts on finitely
  many p only).

Let σ_p ∈ {±1} be independent with P(σ_p = 1) = (1 + v(p)/sin η(p))/2, and g(p) := e^{iσ_p η(p)}. Then almost surely
g is completely multiplicative and unimodular, g ∈ 𝒞 with σ₀(g) = ½, and on Re s > ½

    −G'/G = −ζ'/ζ − ε[1/(s − w) − 1/(s − w̄)] − Σ_{j: 1−2j(1−β) > ½} b_j c^{2j}/(s − (1 − 2j(1 − β))) + H(s),

where 1 − √(1 − t) = Σ_j b_j t^j (b₁ = ½, b₂ = 1/8). H is meromorphic, with poles only at ζ-inherited points
ρ + w − 1, ρ + w̄ − 1 and ρ − 2j(1 − β) (ρ a zero of ζ). Consequently:

* r_G(w) = ord_w ζ + ε and r_G(w̄) = ord_{w̄} ζ − ε, so the pair mass is unchanged, as Theorem PC requires;
* r_G(1) = −1 and r_G(1 − 2j(1 − β)) = b_j c^{2j} > 0;
* σ*(g) = max(½, 2β − 1);
* finite modifications of g preserve all of this (each modified Euler factor is holomorphic and non-zero on
  Re s > 0).

*Proof.*

1. *Prime powers.* Σ_p Σ_{k≥2} log p (g(p)^k − 1) p^{−ks} converges absolutely on Re s > ½, since |g(p)^k − 1| ≤ 2.
2. *Real parts.* Write P(s) := Σ_p log p · p^{−s}, which is −ζ'/ζ(s) minus a function holomorphic on Re s > ½. For
   p > p₁ := c^{1/(1−β)}, 1 − cos η(p) = 1 − √(1 − c²p^{2β−2}) = Σ_j b_j c^{2j} p^{−2j(1−β)}. So

       Σ_{p>p₁} log p (1 − cos η(p)) p^{−s} = Σ_j b_j c^{2j} P_{>p₁}(s + 2j(1 − β)).

   The j-series converges geometrically (ratio c² p₁'^{2β−2} < 1, where p₁' is the least prime above p₁), uniformly on
   compacts that avoid the poles. Term j has poles at 1 − 2j(1 − β) (residue 1) and at ρ − 2j(1 − β).
3. *Imaginary parts.* For p beyond the clip, E σ_p sin η(p) = v(p). Then

       i Σ_p v(p) log p · p^{−s} = −ε[P(s + 1 − w) − P(s + 1 − w̄)],

   with poles at w and w̄ (residues −ε and +ε) and at ρ + w − 1, ρ + w̄ − 1. The centred sum
   Σ_p (σ_p − Eσ_p) sin η(p) log p · p^{−s} has independent mean-zero terms with Σ_p sin²η(p) log²p · p^{−2σ} < ∞ for
   σ > β − ½. So by (I8) it converges almost surely on Re s > β − ½, uniformly on compacts, and is holomorphic there.
4. *Assemble.* Σ Λ(n)(g(n) − 1)n^{−s} = −(step 2) + i(step 3) + (step 1), which gives the display. ∎

The real point 2β − 1 can also receive a ζ-inherited contribution ρ + w − 1 when ρ = w̄ is a zero of ζ. This happens in
the hypothetical case w = ρ₀, and it does not change σ*.

*Measured* (`twins.json`; N = 10⁸, c = 2.2, ε = +1, so ζ(w) ≠ 0 by (I6); least-squares fit of the prime-only sum
ψ_g − ψ on the predicted basis):

| w | r_G(w) (pred +1) | r_G(w̄) (pred −1) | r_G(w) + conj r_G(w̄) (pred 0) | coefficient of x^{2β−1}/(2β−1) (pred −c²/2 = −2.42) | slope of log N_g, [10⁶, 10⁸] (pred 2β − 1) |
|---|---|---|---|---|---|
| 0.85 + 8i | 1.0020 − 0.0005i | −1.0019 − 0.0003i | (−1.0·10⁻⁵, 2.3·10⁻⁴) | −2.417 | 0.694 (0.70) |
| 0.70 + 8i | 0.9942 − 0.0039i | −0.9942 − 0.0039i | (2.2·10⁻⁵, 2.3·10⁻⁵) | −2.419 | 0.401 (0.40) |

N_g is non-decreasing in both cases. The fit residual is ≤ 0.044 x^β.

**(Z2) Modulus debiasing forces σ* ≥ β₀.** Removing ζ's pair from G₀ needs ψ_{g₀} − ψ ⊃ +2 Re(x^{ρ₀}/ρ₀). Then
N_{g₀} = ψ − Re ψ_{g₀} would contain −2 Re(x^{ρ₀}/ρ₀), which oscillates, while N_{g₀} must be non-decreasing
(Theorem PC(ii)). The least monotone correction is (2/β₀)x^{β₀}, since

    d/dx [−2 Re(x^{ρ₀}/ρ₀) + (2/β₀)x^{β₀}] = 2x^{β₀−1}(1 − cos(γ₀ log x)) ≥ 0.

That correction is a real pole of D_{g₀} at β₀ with residue 2, so σ*(g₀) = β₀, and g₀ ∉ 𝒵(ρ₀). No correction can do
better. If G₀ is regular and non-zero at ρ₀ while ζ(ρ₀) = 0, then Res_{ρ₀} D_{g₀} = −1 ≠ 0, so by Landau σ_c(D_{g₀}) ≥ β₀
and some real singularity at or above β₀ is forced. The mirror image at a point where ζ has no zero is:

**Proposition PT (real pair twin; PROVED; MEASURED).** Let w = β + iγ with ½ < β < 1 and γ ≠ 0, and put
p₂ := 4^{1/(1−β)}. Define g(p) := 1 − 2p^{β−1}(1 + cos(γ log p)) for p > p₂, and g(p) := 1 for p ≤ p₂. Then:

* g is real and completely multiplicative, with 0 ≤ g(p) ≤ 1;
* g ∈ 𝒞, and on Re s > ½

      −G'/G = −ζ'/ζ − 1/(s − w) − 1/(s − w̄) − 2/(s − β) + H(s),

  with H meromorphic and its poles only at ζ-inherited points ρ + w − 1, ρ + w̄ − 1, ρ + β − 1;
* so G has simple zeros at w and w̄ in addition to ζ's, a double zero at the real point β, and σ*(g) = β.

Theorem PC is silent at w, and it is sharp: the condition Re w > σ*(g) cannot be relaxed to Re w ≥ σ*(g).

*Proof.* Σ_{p>p₂} log p · 2p^{β−1}(1 + cos(γ log p)) p^{−s} = 2P_{>p₂}(s + 1 − β) + P_{>p₂}(s + 1 − w) + P_{>p₂}(s + 1 − w̄).
For the prime powers, |g(p)^k − 1| ≤ k(1 − g(p)) ≤ 4k p^{β−1}, so Σ_{k≥2} converges absolutely on Re s > β/2, and
β/2 < ½. ∎

*Measured* (`twins.json`). For both w = 0.85 + 8i and 0.70 + 8i:

* the coefficients of x^w/w and x^{w̄}/w̄ are −0.9981 (pred −1);
* the coefficient of x^β/β is −2.00003 (pred −2);
* the fit residual is ≤ 0.022 x^β.

So conjugate-symmetric planting is possible even with coefficients 0 ≤ g ≤ 1 (a thinning of the actual primes, in the
style of Beurling systems), at the price of a real zero at Re w. ζ has no real zero in (0, 1) (I2). That is why, by
Theorem PC, a companion with σ* < β₀ must inherit ζ's zeros.

**Unimodular attempt at the pair (MEASURED only).** Under |g| = 1 the best realisation of a conjugate-symmetric planting
is the greedy (Skorokhod-reflected) deficit N(x) = max(0, max_{p≤x} 2 Re(p^w/w)). Results (`twins.json`):

* it realises 10.3% (β = 0.85) and 8.3% (β = 0.70) of the target oscillation;
* it carries a forced coefficient m₀ = 0.194 and 0.202 of x^β (target 0; envelope 2/|w| = 0.249), i.e. a real
  singularity at β;
* it misses the target by up to 0.43 x^β, against a target amplitude of 0.249 x^β.

**(Z3) A pole-coupled random model inherits the zero.** With phases centred at 1 and fluctuations of size p^{−α}:

* the imaginary parts form a random Dirichlet series holomorphic on Re s > ½ − α;
* the real parts give 1 − cos θ_p ≍ p^{−2α}, hence a real singularity at 1 − 2α;
* so G₀ = ζ × (a unit on Re s > σ* = max(½, 1 − 2α)).

If σ* < β₀ then G₀(ρ₀) = 0 (inherited). Only a drift (Z1 or Z2) changes the zero mass. Randomness never does.

### 2.3 Other repairs and why they fail

**R1. Halász / pretentious data (Proposition H′; PROVED from (I7) and Propositions RT, PT).** Let g be a rotation twin
or a pair twin at any w with ζ(w) ≠ 0. Then

    D(g, 1; ∞)² = Σ_p (1 − Re g(p))/p < ∞

(≍ Σ (c²/2) p^{2β−3}, resp. ≤ Σ 4p^{β−2}). By the triangle inequality for pretentious distance (I7), for every t and
x, with C_g := D(g, 1; ∞):

* |D(g, n^{it}; x) − D(1, n^{it}; x)| ≤ C_g;
* |D(μg, n^{it}; x) − D(μ, n^{it}; x)| ≤ C_g, since D(μg, μ) = D(g, 1).

Every Halász-type statement depends only on these distances, through the bound x(1 + M)e^{−M} + x/T with
M = min_{|t|≤T} D²(·, n^{it}; x). With M ≍ log log x for μ, the bounds for μg and μ differ by at most a factor
exp(2C_g√M + C_g²) = (log x)^{o(1)}, so every such statement gives the same conclusion for g, μg as for 1, μ up to
sub-power factors. But G has a zero at w, so 1/G = Σ μ(n)g(n)n^{−s} has a pole there and Σ_{n≤x} μ(n)g(n) = Ω(x^{β−ε}).
Hence no inference from pretentious data to zero-freeness at a point w with Re w < 1 can be valid: the twins violate
it.

This is a concrete counter-model for the Halász route: it uses no MV-CAP construction, and it is the mean-value side
of Proposition 3.1. Halász savings are at most powers of log x. Power saving would need information on Re s < 1, which
is the conclusion.

**R2. Companions on ζ's own Kronecker line (Lemma KL; PROVED).** Let γ₀ ≠ 0 and let T(θ) = Σ_{|k|≤K} a_k e^{ikθ}
be a real trigonometric polynomial with T(γ₀ log n) ≥ 0 for all prime powers n. Then T ≥ 0 on ℝ, a₀ ≥ |a_k| for all k,
and the series

    D_T(s) := Σ Λ(n) T(γ₀ log n) n^{−s} = Σ_k a_k (−ζ'/ζ)(s + ikγ₀)

has residue a₀ at s = 1, with a₀ > 0 unless T ≡ 0. So σ_c(D_T) = 1, and Landau's lemma gives nothing to the left of
Re s = 1. The poles of ζ(s + ikγ₀) at 1 − ikγ₀ (k ≠ 0) are not real and never enter a Landau argument.

*Proof.* {γ₀ log p mod 2π} is dense (I3), and T is continuous, so T ≥ 0 everywhere. Then
a₀ = (1/2π)∫T ≥ |(1/2π)∫T e^{−ikθ}| = |a_k|, and a₀ = 0 forces T ≡ 0. The residue at 1 comes from k = 0 only. ∎

This is the classical reason why 3–4–1 positivity gives only the de la Vallée Poussin region (round-2 Proposition PD is
the finite-support form: pole domination). Positivity on ζ's own twists can never cancel the pole at s = 1. Cancelling
it needs a companion off the Kronecker line, i.e. 𝒞, where Theorem PCR applies.

**R3. Automorphic companions (Lemma AC; PROVED for Artin L-functions; ARGUED for families with known equidistribution).**
Let K/ℚ be finite Galois with group Γ, let χ₁, …, χ_r be distinct irreducible characters of Γ, and let w_j be weights
with φ := Σ w_j χ_j real-valued. Suppose:

* the series D := −Σ_j w_j L'/L(s, χ_j) has non-negative coefficients at all unramified prime powers;
* D has no pole at s = 1.

Then all w_j = 0.

*Proof.* At an unramified p^k the coefficient is log p · φ(Frob_p^k). Res_{s=1} D = Σ_j w_j ⟨χ_j, 1⟩ = ⟨φ, 1⟩, since
L(s, χ) has order −⟨χ, 1⟩ at s = 1 (I4). By Chebotarev every conjugacy class is Frob_p for infinitely many p, so φ ≥ 0
on Γ. With ⟨φ, 1⟩ = 0 this forces φ ≡ 0, and linear independence of irreducible characters gives w_j = 0. ∎

The same argument runs for any family whose Frobenius data at p is equidistributed for a measure of full support (Hecke
characters, non-CM holomorphic newforms via Sato–Tate, twists by n^{−iτ} via (I3)), once the corresponding prime number
theorems are in place. That generalisation is ARGUED, not written out.

So positivity with the pole at 1 cancelled forces a companion whose Frobenius distribution is concentrated at the
identity, i.e. pretentious to 1. That is 𝒞 again.

Within the Selberg class, a degree-one companion with a pole at 1 is ζ itself (I9). Higher-degree automorphic companions
with a pole at 1 (ζ_K, Rankin–Selberg) violate Re g ≤ 1 at split primes (Λ_K(p) = d log p) or at primes with
|a(p)| > 1.

**R5. Dropping conjugate symmetry: rotation twins at ρ₀ itself (Corollary SF′; ARGUED in the continuous model).** Take
Proposition RT at w = ρ₀ with ε = +1, twisted back by n^{−iγ₀}: f := n^{−iγ₀} g. Then f is completely multiplicative and
unimodular, and F₁ = G(s + iγ₀) has:

* the pole at 1 − iγ₀;
* a zero at β₀;
* a pole at β₀ − 2iγ₀ when ζ(ρ₀) ≠ 0;
* the real-line singularities of G, shifted to Im s = −γ₀;
* otherwise exactly the zeros of ζ(s + iγ₀).

Its matched-filter sum at height γ₀ is

    LHS_a(f) = LHS_a(ζ at γ₀) + J(a) + O(e^{2aδ₀}/γ₀) + (fluctuation),

with J(a) = m(a) + 1/(2δ₀) + o(1) as in round-2 Theorem MT(d). It includes ζ's own pole term P/(2m). So (2b) and
round-1 (A) hold at all large supports, with the P-term regime 2a ≳ 4 log γ₀ included (margin ≈ 1/(2δ₀) in the
continuous model). Finite-prime freedom holds as in Corollary SF.

This repairs round-2 E2 in the twin's favour. The round-2 conclusion "the Euler product imposes no constraint on short
phases" survives in the pole-coupled class. Moving to lengths ≫ γ₀ excludes the MT twin, but not the rotation twin.

What separates the rotation twin from "ζ with ρ₀":

* the conjugate point ρ̄₀ (pole instead of zero), equivalently reality of the coefficients;
* the real-line singularities 1 − 2j(1 − β₀) ≥ ½;
* the functional equation.

Adding reality brings the class down to 𝒯(ρ₀), where Theorem PCR applies.

### 2.4 Lengths ≫ γ₀ (Step 5): true for the sharp filter, not needed, does not help

**Proposition LG.**

* **(i) The pole term cancels (PROVED, algebra).** By round-1 Step 2, W(f) = A + P − 2m·LHS_a(γ₀) with
  W = Σ_ρ ĝ(γ_ρ). With β := (A + P)/(2m), round-1 (★_min)_a reads LHS_a < β + s(a), which is W(f) > −2m s(a). W
  contains no pole term. So P changes only the prime-side form of the target, never the zero-side inequality that the
  contradiction needs. No estimate of P helps prove (★_min). A twin without P violates only the prime-side form.
* **(ii) The size of P is a property of the filter (HIGH-PRECISION QUADRATURE, `poleterm.json`; γ₀ = 1000, δ₀ = 3/8).**

  | 2a | sharp filter P/(2m) | envelope δ₀e^a/γ₀² | C^∞ cutoff P/(2m) (step h; step h/1.5 identical) | m_smooth/m_sharp |
  |---|---|---|---|---|
  | 8 | 2.66·10⁻⁶ | 2.05·10⁻⁵ | −1.95·10⁻⁴⁰ | 1.48 |
  | 16 | −1.14·10⁻³ | 1.12·10⁻³ | −5.88·10⁻³⁹ | 1.37 |
  | 24 | −1.19·10⁻² | 6.10·10⁻² | 4.40·10⁻³⁷ | 1.36 |
  | 32 | 3.22 | 3.33 | 2.03·10⁻³⁵ | 1.36 |
  | 40 | 58.4 | 182 | −1.16·10⁻³³ | 1.36 |

  * The sharp values reproduce round-2 E1. For the smooth cutoff, |F(i/2)| = 5.6·10⁻²⁰ to 7.0·10⁻¹⁴ grows like
    e^{(1/2+δ₀)a} times a factor ≈ exp(−1.51√γ₀). That is the decay of the Fourier transform of a Gevrey-2 step (the
    constant 1.51 is a fit, HEURISTIC).
  * Extrapolated to γ₀ = 3·10¹² (HEURISTIC), the smooth-filter pole term reaches size 1 only at 2a ≈ 4·1.51·√γ₀ ≈ 10⁷.
  * For a C^M filter (finite M) the pole term can dominate the zero term only when δ₀ < 1/4, and then only at
    2a ≥ M log γ₀/(1/2 − 2δ₀): 575, 1149, 2298 for δ₀ = 0.2 and M = 2, 4, 8 (`lengths.json`).
  * So the support range "2a ≳ 4 log γ₀" of round-2 E1/E2 is set by the jump of the round-1 filter at |u| = a. The
    filter's sharpness was optimal for visibility (round-1 Lemma 2), but it is what made P visible.
  * The intrinsic difference between ζ and MT is the pole at 1 − iγ₀ as an analytic object, i.e. at infinite length.
    Only Landau-type arguments (Theorem PC) see it, and Theorem PCR shows that what they see is ζ-relative.
* **(iii) At lengths N ≫ (γ₀ log γ₀)² the pole term is the main term of the twisted sum, not a rigidity input (MEASURED,
  `lengths.json`).** S(N) = Σ_{n≤N} Λ(n)n^{−iγ₀} and R(N) = S(N) − N^{1−iγ₀}/(1 − iγ₀) (on-line zeros; RH is verified
  at these heights):

  | γ₀ | RMS \|R\|/√N on [10⁶, 10⁸] | max \|R\|/√N | \|pole\|/\|R\| at 10⁸ | crossover N_× (measured) | (3·RMS·γ₀)² (predicted) |
  |---|---|---|---|---|---|
  | 200 | 1.226 | 2.59 | 72.1 | 5.409·10⁵ | 5.408·10⁵ |
  | 1000 | 2.134 | 3.79 | 6.50 | 4.110·10⁷ | 4.099·10⁷ |
  | 5000 | 2.337 | 3.91 | 1.04 | > 10⁸ | 1.23·10⁹ |

  The pole term N^{1−iγ₀}/(1 − iγ₀) is ∫ t^{−iγ₀}dt: the prime number theorem at relative scale 1/γ₀. A hypothetical
  zero term N^{β₀}/β₀ would exceed it at N = 10⁸ by factors of 22.9 / 114 / 571 (β₀ = 7/8) and 0.21 / 1.05 / 5.26
  (β₀ = 0.6) at these three heights.
* **(iv) The three scales at γ₀ = 3.0001753·10¹² (ARITHMETIC, `lengths.json`).**

  | δ₀ | visibility N_vis = (2δ₀ log γ₀)^{1/δ₀} | pole/noise crossover (γ₀ log γ₀)² | pole/zero crossover N₁ = (γ₀/β₀)^{1/(1−β₀)} |
  |---|---|---|---|
  | 3/8 | 10^3.56 | 10^27.9 | 10^100.3 |
  | 0.2 | 10^5.30 | 10^27.9 | 10^42.1 |
  | 0.1 | 10^7.59 | 10^27.9 | 10^31.7 |
  | 0.05 | 10^9.17 | 10^27.9 | 10^28.3 |

  For N < N₁ the zero term dominates the pole term. For N > N₁ the pole term dominates. In neither regime is an
  unconditional estimate available at precision N^{β₀}: the best unconditional error terms for Σ_{n≤N} Λ(n)n^{−iγ₀} are
  of the form N exp(−c(log N)^{3/5−ε}) in suitable ranges of γ₀ [L], which exceed N^{β₀} for every fixed β₀ < 1.

So pole coupling contributes nothing quantitative at finite length. Its content is asymptotic (Landau), and that content
is ζ-relative (Theorem PCR).

### 2.5 What the attempt reduces to

**Proposition 2.5 (PROVED from Theorem PCR and standard facts).** For θ ∈ [½, 1) the following are equivalent:

* (a) Lemma Z holds at every ρ₀ with Re ρ₀ > θ;
* (b) ζ(s) ≠ 0 for Re s > θ;
* (c) for every ε > 0 there is C_ε with ψ(x) ≥ x − C_ε x^{θ+ε} for all x ≥ 2;
* (c′) the hinge discrepancy D(W) of arithmetic-foundation §1 satisfies D(W) ≥ −C_ε(1 + W) e^{(θ−1/2+ε)W} for all
  large W.

*Proof.*

* (a) ⟺ (b) is Theorem PCR(ii), applied at every point.
* (b) ⟹ (c) is the classical explicit-formula bound ψ(x) − x ≪ x^θ log²x [L].
* (c) ⟹ (c′) is partial summation. With E = ψ − x, Σ_{n<x} Λ(n)n^{−1/2} − 2√x = −1 + E(x)/√x + ½∫₁^x E(t)t^{−3/2}dt
  (prime-memory module, §1), and D(W) is the integral over r ≤ W of this quantity at x = e^r.
* (c′) ⟹ (b) is the one-sided Landau theorem with the lower sign: apply Landau's lemma to
  C(1 + W)e^{αW} + D(W) ≥ 0 exactly as in arithmetic-foundation §2, with α = θ − ½ + ε. ∎

The V7 floor of atlas §10 with exponent p (a floor ε₀(λ) ≥ −C(1 + log λ)^m λ^p of the actual Weil form) implies (b)
with θ = (1 + p)/2 (atlas §10, `03-landau.tex`). It is the operator-side form of the same one-sided target. This note
uses only the implication, not a converse.

The companion form makes the reduction explicit. Re ψ_g(x) ≤ ψ(x) for every |g| ≤ 1, so a companion g₀ with
Re ψ_{g₀}(x) ≥ x − C x^{θ+ε} gives (c). But g ≡ 1 is the extremal companion, so the companion problem is exactly the
one-sided Landau bound for ψ.

Excluding the one zero ρ₀ needs θ < β₀, i.e. p < 2δ₀. RH is p = 0: Σ_{n≤X} Λ(n)n^{−1/2} ≥ 2√X − C(log X)^m in Landau's
form. This is the same terminal object as:

* round-1 operator Theorem E;
* round-2 harmonic floor H5;
* round-2 Stepanov Branch C;
* round-2 phase alignment, via Lemma L;
* the Suzuki §4 signed credit prefix;
* the first item of the atlas closing line ("a genuine all-scale signed arithmetic estimate").

---

## 3. The four walls

| wall | formally blocked? | why not, or why yes | where the attempt actually stops |
|---|---|---|---|
| (1) Flow-blindness SL2 (`flow-blindness-no-go.js`) | No | Theorem PC needs the Euler products of ζ and of the companion (prime-power support of the logarithmic derivative, Re g ≤ 1) and the pole of ζ at 1. The backward flow H_{−ε} has no Dirichlet series and no Euler product, so these hypotheses are not flow-stable. SL2 asks for exactly this kind of arithmetic input. | The arithmetic input is relative: it constrains a companion's zeros by ζ's. Theorem PCR shows that the pole-coupled class collapses to ζ. |
| (2) NS-RIGID (`imp-95530`, A4/A5) | Not literally | NS-RIGID concerns Pick matrices of ξ'/ξ at real nodes on the twin-ladder native span. This attempt works with Dirichlet series and Landau's lemma. | Landau's lemma is also a real-axis statement, about −ζ'/ζ + Re G'/G on (σ*, ∞), and Theorem PCR is the same dichotomy: a statement either holds whether or not ζ(ρ₀) = 0 (Theorem PC for g ≡ 1, Lemma AC, Lemma KL), or it is ζ(ρ₀) ≠ 0. |
| (3) Verified height (Route I ceiling, crossover 2a = 7.764; RES-T B1–B3) | No | Theorem PC is an infinite-length statement, insensitive to finitely many primes (Proposition RT, last item). It uses no finite-support Weil positivity. | Any finite-length version (quantitative Landau at length N) is Σ Λ(n)(1 − Re g(n))n^{−1/2}k(log n) ≥ 0. For the relevant companion g ≡ 1 it is 0 ≥ 0. Turning it into zero information at height γ₀ needs the pointwise bound RES-T (B3). |
| (4) MV-CAP / pointwise (route 42, `mv-cap-theorem.md`) | Partly | Theorem PC is exact, not a mean value. | The Halász route (R1) is a mean-value route and is blocked by explicit finite-distance twins (Proposition H′): MV-CAP's phenomenon in pretentious form. The terminal object of §2.5 is all-scale; at a single height it is (★_min) / RES-T (B3), the pointwise wall. |
| Vortex trapping = RH (vortex-blocker reduction) | Not used | — | The third item of the atlas closing line (exhaustive theta boundary/collision certificate) is not touched. |

---

## 4. Numerics: summary and reproduction

All runs are double precision unless stated, one process each, under 10 s and 3 GB.

| check | quantity | value | prediction | file |
|---|---|---|---|---|
| Rotation twin, w = 0.85 + 8i | r_G(w), r_G(w̄) | 1.0020, −1.0019 | +1, −1 | `twins.json` |
| | r_G(w) + conj r_G(w̄) (Theorem PC) | 2.3·10⁻⁴ | 0 | |
| | log-log slope of N_g | 0.694 | 0.70 | |
| Rotation twin, w = 0.70 + 8i | r_G(w), r_G(w̄) | 0.9942, −0.9942 | +1, −1 | `twins.json` |
| | PC residual | 3.2·10⁻⁵ | 0 | |
| | slope of N_g | 0.401 | 0.40 | |
| Rotation twin, w = 0.80 + 12i, seeds 1–3 and deterministic sigma-delta, c = 3 | r_G(w) | 0.988 to 1.000 | +1 | `check.json` |
| | r_G(w̄) | −0.988 to −1.000 | −1 | |
| | PC residual | 8.5·10⁻⁴ (same for every seed) | 0 | |
| | x^{2β−1} coefficient | −4.507 | −4.5 | |
| Real pair twin (three w) | coefficients of x^w/w, x^{w̄}/w̄ | −0.998, −0.998, −0.9996 | −1 | `twins.json`, `check.json` |
| | coefficient of x^β/β (real double zero) | −2.00003, −2.00003, −2.003 | −2 | |
| Greedy unimodular pair | fraction of target oscillation realised | 0.103, 0.083 | (Theorem PC: a real singularity is forced) | `twins.json` |
| | forced x^β coefficient m₀ | 0.194, 0.202 | > 0 | |
| MT twin (no pole) | N_g(x)/x at 10⁶, 10⁷, 10⁸ | 0.990, 0.996, 1.001 | → 1 (σ* = 1) | `twins.json` |
| | ψ_g(10⁸)/10⁸ | −0.0014 − 0.0079i | → 0 | |
| Twisted sums, γ₀ = 200 / 1000 / 5000 | pole/noise crossover N_× | 5.409·10⁵ / 4.110·10⁷ / > 10⁸ | 5.408·10⁵ / 4.099·10⁷ / 1.23·10⁹ | `lengths.json` |
| Pole term, γ₀ = 1000, 2a = 32 | P/(2m), sharp / C^∞ cutoff | 3.22 / 2.0·10⁻³⁵ | δ₀e^a/γ₀² = 3.33 / exp(−c√γ₀) | `poleterm.json` (Arb) |
| Davenport–Heilbronn | Λ_f(6), non-prime-power n ≤ 3000 with Λ_f ≠ 0, negative Landau coefficients, Σ a(n) | 1.936356, 906, 461, 0 | (1 + κ²) log 6 = 1.936356 | `dh.json` |

Note on the PC residual: the residual is identical across random seeds because a1 + conj a2 is the x^w-coefficient of
the **real** part of ψ_g − ψ, and the real part −Σ(1 − cos η(p)) log p is deterministic. This is Theorem PC in its
simplest form. N_g = ψ − Re ψ_g is monotone, so it has no x^w oscillation at exponents above its own abscissa. The
residual measures fitting leakage only.

Reproduce:

    .venv-arb/bin/python -I tmp/rha-pole-pretentious-twins.py 1e8      # ~6 s
    .venv-arb/bin/python -I tmp/rha-pole-pretentious-check.py 3e7      # ~1 s
    .venv-arb/bin/python -I tmp/rha-pole-pretentious-lengths.py 1e8    # ~1 s
    .venv-arb/bin/python -I tmp/rha-pole-pretentious-poleterm.py       # ~2 s (python-flint / Arb, 200 bits)
    .venv-arb/bin/python -I tmp/rha-pole-pretentious-dh.py             # < 1 s

---

## 5. Adversarial pass (same agent; independent recomputation where stated)

1. **Is Theorem PC correct?**
   * The non-negativity needs g completely multiplicative. For merely multiplicative g, −G'/G does not have
     coefficients Λ(n)g(n). Definition 2.1 says "completely multiplicative".
   * Res_w G̃'/G̃ = conj Res_{w̄} G'/G follows from G̃(s) = conj G(s̄).
   * Res_1 D_g = 1 + Re r_G(1). Since |Σ Λ(n)g(n)n^{−σ}| ≤ −ζ'/ζ(σ), |r_G(1)| ≤ 1, so Re r_G(1) = −1 forces
     r_G(1) = −1. So (C2) is the exact condition for the real pole at 1 to cancel.
   * Landau is applied to the continuation along (σ*, ∞), which is the meromorphic continuation by the identity
     theorem.
   * The theorem is confirmed numerically on constructed twins, with r_G(w) and r_G(w̄) fitted independently (§4).
2. **Is the failing line identified correctly?**
   * Steps 1–3 are proved. Step 5 is true (for the sharp filter) and not needed.
   * The first statement that is not proved is Lemma Z. By Theorem PCR it is equivalent to ζ(ρ₀) ≠ 0, so it is not a
     reduction.
   * The referee sketch, read as a proof, uses Lemma Z implicitly: its planting law is Corollary PC1(i), which assumes
     ord_{ρ₀} ζ = 0.
   * A weaker reading, allowing σ*(g₀) ≥ β₀ and using the real singularity, gives nothing. Proposition PT shows the
     real singularity is realisable with any zero configuration at Re w = σ*.
3. **Could several companions, or a positive polynomial in several of them, avoid Theorem PCR? (ARGUED.)**
   * A positive combination Σ a_j Λ(n)(1 − Re h_j(n)), with h_j in the group generated by the companions, has total
     residue Σ a_j (1 + Re r_{H_j}(1)) at s = 1. With a_j > 0 the pole cancels only if every h_j is pole-coupled, and
     then Theorem PC applies term by term.
   * For a general positive trigonometric polynomial T(g₁(n), …, g_k(n)): if the joint distribution of (g_j(p)) has
     full support, Lemma KL / AC force T ≡ 0 or a pole at 1. If it concentrates at (1, …, 1), T has a zero minimum
     there and the analysis is that of Theorem PC at second order.
   * Not written out for all T.
   * Bases with |g(p)| > 1 for infinitely many p (for example real Beurling-type twins with a_p ∈ [0, 2]) lose the
     sign of D_g, and Landau's lemma no longer applies. Like DH, they lie beyond Step 2.
4. **Non-positivity uses of the pole.**
   * Halász: R1, blocked by explicit twins.
   * The functional equation: forces a degree-one companion to be ζ (I9).
   * Turán's power-sum method: a lower-bound method for zero sums that yields classical-type regions and density
     estimates. Its use of the pole at 1 is the same as in Lemma KL.
   * This list is not exhaustive.
5. **Proposition RT technicalities.**
   * The j-series converges geometrically only above the clip threshold p₁. The finitely many clipped primes are a
     finite modification.
   * Almost-sure convergence of the centred random series on Re s > β − ½, uniformly on compacts, is standard [L] (I8),
     not reproved here.
   * ζ-inherited poles can be real, e.g. ρ + w − 1 = 2β − 1 when ρ = w̄. This is noted, and it lies at or below σ*.
6. **Basis sensitivity of the fits.**
   * `check.py` adds x^{β−1/2} and x^{1/2} nuisance terms and uses a different w. The residues move by ≤ 1.2%.
   * The x^{4β−3} term is dropped when 4β − 3 ≤ 0.05, because it is collinear with the constant; that is why it is
     absent from the β = 0.7 fit.
7. **Proposition LG(ii).**
   * The sharp/smooth comparison at γ₀ = 1000 is Arb quadrature at 200 bits; step refinement agrees to every printed
     digit.
   * The decay constant 1.51 and the extrapolation to γ₀ = 3·10¹² are HEURISTIC.
   * Bug found and fixed during the run: the first version of the sharp closed form used the wrong height variable
     (3·10¹² instead of 1000) and gave values near 10⁻²⁴. The float version of the smooth integral was pure roundoff.
     Both were replaced by the Arb script.
8. **Corollary SF′ is ARGUED in the continuous model.**
   * The on-line zero side of ζ at height γ₀ fluctuates, as in rounds 1–2.
   * It was not measured. At the supports reachable with N ≤ 10⁸ (2a ≤ 18.4) the pole term is negligible for both twins,
     so a measurement would reproduce round 2's MT tables.
9. **Corrections made during this pass.**
   * Proposition 2.5 (c′): the first draft stated the V7 floor as equivalent to (c), but the atlas states only
     floor ⟹ half-plane. Now (c′) is the hinge-discrepancy form, and the V7 floor is cited as an implication.
   * (I3): the first draft claimed natural-density equidistribution of γ₀ log p from Σ p^{−ikγ₀} log p = o(x). That is
     false, since the sum is ~ x/|1 − ikγ₀|. Now (I3) states density and logarithmic equidistribution; Lemma KL needs
     only density.
   * Proposition H′: the first draft said the Halász bounds differ by a bounded factor. The factor is
     exp(O(C_g√M)) = (log x)^{o(1)}. The conclusion is unchanged.
   * Step 4 (Z1): the first-order phase had the wrong sign. It is now +2p^{β₀−1} sin(γ₀ log p).
10. **Atlas citations.**
    * Checked against the snapshots: §2 ("a denominator zero of ζ(2s)/ζ(s) is generally a pole"; "[m(ρ) − m(ρ−2a)]₊");
      §10 ("Matching numerator and denominator Euler lines also erases the principal detector"); §11 (no uniform
      margin); the closing line.
    * The atlas records no pretentious or Halász route, so this attempt does not repeat a recorded failure. Its overlaps
      are the §10 principal-detector mechanism and the §2 zero/pole bookkeeping, and both are stated in §0.4.
11. **Novelty.**
    * Theorem PC is an elementary consequence of Landau's lemma, the mechanism of the classical L(1, χ) ≠ 0 and
      ζ(1 + it) ≠ 0 proofs. It is not claimed new.
    * Propositions RT and PT are Wintner / Bohr–Jessen and Beurling-type constructions. They are not claimed new.
    * No literature search was run in this session.

---

## 6. Status

**RH open. NO QED.** Platt–Trudgian Λ ≤ 0.2 stands. No zero-free region and no Λ bound changes.

**The line where it fails.** Step 4, Lemma Z (a zero-free pole-coupled model at ρ₀). By Theorem PCR it is equivalent to
ζ(ρ₀) ≠ 0. The referee sketch's planting law requires ζ(ρ₀) ≠ 0, the negation of the hypothesis. Under the hypothesis no
pole is planted.

**What it reduces to.** The one-sided Landau bound ψ(x) ≥ x − C_ε x^{θ+ε} with θ < β₀. That is the one-sided target
behind the V7 floor of atlas §10 with p < 2δ₀, and at p = 0 it is RH: the first item of the atlas closing line.

**Salvage** (same-agent checked; independent referee needed before external use):

* **Theorem PC (PROVED):** exact planting law for pole-coupled Euler products. Within 𝒞, zero mass at {w, w̄} is
  conserved to the right of σ*(g).
* **Theorem PCR (PROVED):** the pole-coupled class collapses to ζ.
* **Corollaries PC1–PC3:** in particular, MT escapes because it is not pole-coupled, and DH has no Landau positivity.
* **Lemma KL (PROVED):** positivity on ζ's Kronecker line always keeps the real pole at 1.
* **Lemma AC:** PROVED for Artin L-functions, ARGUED for equidistributed families. Pole-cancelling positivity among
  them is trivial.
* **Proposition RT (PROVED at Theorem-MT level):** pole-coupled rotation twins. They repair round-2 E2: Corollary SF′,
  ARGUED.
* **Proposition PT (PROVED):** real pair twins with 0 ≤ g ≤ 1. Theorem PC is sharp.
* **Proposition H′ (PROVED):** pretentious data are twin-invariant. This is a counter-model for the Halász route.
* **Proposition LG:** the pole term cancels, it is filter-dependent, and it is the equidistribution main term at
  lengths ≫ (γ₀ log γ₀)².

**For later rounds.**

* Do not re-attempt pole-coupled or pretentious planting arguments for ζ. Any variant must supply a companion whose
  zeros are known independently of ζ.
* Among known L-functions, Lemmas KL and AC and (I9) exclude such a companion. Within constructed companions,
  Theorem PCR excludes it.
* The remaining open items are the three of the atlas closing line, unchanged.
