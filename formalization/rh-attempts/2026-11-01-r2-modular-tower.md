# RH attempt, round 2 (1 November 2026): a tower of modular surfaces X₀(N) × X₀(N) with Hodge index at every level, and the line where it fails

**Outcome: the attempt fails. No proof of RH.**

*Revision 2 (same day, 18:00–).* Revision 1 (§§0–12 as first written) was completed by one agent instance at 17:14.
Revision 2 is by a second instance with a fresh context. It (a) re-ran every v1 script and re-derived every v1 proof
(§10b; corrections listed there), and (b) adds: Lemma 4.11 and Proposition 4.12 (the even, or cosine, picture, in which
self-adjoint Hecke operators are consistent with the Weil form, so Theorem 4.6 does not apply); Theorem 4.13 and
Corollary 4.14 (exact scaling equivariance through operators with algebraic eigenvalues sees only Tate characters, by the
six exponentials theorem; in the tower only the pole functionals d(F), d′(F) survive); Proposition 4.15 (asymptotic
equivariance: a Hecke dictionary exists if and only if RH holds, and it has to map zeros to cusp forms with matching
Satake parameters); Proposition 6.4 and Remarks 6.5–6.6 (Hecke-equivariant archimedean classes). The revision-2 results
have not had a fresh-context check of their own.

The attempt replaces the surface "Spec Z × Spec Z", which does not exist (round 1, `2026-11-01-arith-surface.md`,
Theorem 6.2: the graph-class space S_Q carries no Riemann–Roch datum), by the surfaces S_N = X₀(N) × X₀(N). On each S_N
Riemann–Roch holds and the Hodge index theorem is a theorem: classically over C, and on the arithmetic surface 𝒳₀(N)
through Faltings–Hriljac. Theorem 3.1 proves that RH follows if the Weil classes D_F of S_Q can be represented
asymptotically isometrically in NS(S_N) (hypothesis (Rep)). Every step except (Rep) is proved. Proposition 3.2 shows that
(Rep), taken abstractly, is equivalent to RH, so the attempt depends on building the representation from the tower's own
data. Sections 4–6 test the constructions the tower offers: Hecke-span maps, all of NS, scaling-equivariant maps in the
translation and in the even picture, asymptotically equivariant maps, dynamical realizations, and arithmetic and
archimedean classes. None works. §10 lists what is not covered.

## The line where it fails

§3, Theorem 3.1, hypothesis

    (Rep)   lim_N c_N^{-1} · P(L_N D_F)²  =  P(D_F)²  =  −W(F ⋆ F̌)      for every real F ∈ C_c²(R).

The tower supplies no maps L_N with this property:

1. **Algebraic classes (Theorem 4.5, Eisenstein confinement).** On every S_N the Hodge-index form is the cuspidal Rosati
   trace −P(x)² = Tr(γ_x γ_x^† | H¹(X₀(N))). The Riemann zeta function enters the intersection numbers only through the
   degrees x·H and x·V. These degrees carry the Eisenstein character σ₁, whose Dirichlet series ζ(s)ζ(s−1) is the
   L-function of H⁰ ⊕ H² of X₀(N): ζ is the "pole part" of every modular curve. With the explicit-formula classes of
   Lemma 4.3, the ζ prime sum is exactly a degree, and RH becomes a family of upper bounds on degrees of explicit Hecke
   classes. No consequence of the Hodge index theorem constrains a degree (Lemma 4.4).
2. **Exact scaling equivariance (Theorems 4.6 and 4.13, Corollary 4.14).** Route 27's mechanism is that translating the
   test function by log p corresponds to composing with a correspondence. It fails in each form it can take over Q.
   * Translation picture, self-adjoint or finite-order correspondences (Theorem 4.6): equivariance forces
     W(F ⋆ (F(· − 2 log p))ˇ) = W(F ⋆ F̌) for every F. For narrow bumps the left side tends to −(log p)/p and the right
     side grows like log(1/ε); at ε = 0.01, p = 2 the two sides are −0.325 and 2.962.
   * Even picture (symmetric shifts ½(F(· − log p) + F(· + log p))), where self-adjoint Hecke operators are consistent
     with the Weil form (Proposition 4.12), and translation picture with non-self-adjoint operators such as U_ℓ: a
     continuous dictionary that is exactly equivariant for three primes through operators with algebraic eigenvalues is
     a function of finitely many moments ∫F(x) x^k e^{λx} dx with λ ∈ Q (Theorem 4.13, from the six exponentials
     theorem). In the tower these are the pole functionals d(F) = ∫F e^{u/2} and d′(F) = ∫F e^{−u/2} and nothing else
     (Corollary 4.14). The dictionary sees the poles of ζ and none of its zeros.
3. **Asymptotic equivariance (Proposition 4.15).** If equivariance is required only in the limit, a Hecke dictionary
   exists if RH holds, and its existence gives RH (this direction uses the argued Lemma 4.11(iii)). It must send each
   zero ρ to cusp forms whose Satake parameters converge to
   Kron(γ_ρ) = (cos(γ_ρ log p))_p, the Satake parameter of the Eisenstein series E(·, ½ + iγ_ρ). RH says these
   parameters are tempered; the tower's positivity (Deligne's theorem, i.e. Hodge index on (X₀(N)/F_p)²) says cusp
   forms are tempered. The tower contains no map from zeros to cusp forms.
4. **The archimedean continuum (Propositions 4.8, 4.9, 6.4, Remarks 4.10, 6.5, 6.6).** For a ∉ Q, the scaling z ↦ az is
   not an algebraic correspondence: its graph is dense in S_N(C). Realized dynamically, by the geodesic flow and by the
   Kirillov models at every place, the scaling has Lebesgue spectrum except at characters of finite order. Hecke-
   equivariant archimedean classes have absolutely continuous spectral measures at every level; the canonical (CM)
   amplitudes vanish at the zeros, and inverting them registers only the zeros on the line. The Weil distribution needs
   atoms at all zero ordinates, with a sign at off-line ones.

## Decisions requested by the task

* **Representability of the Weil classes: no.** This is decided negatively for each class of constructions tested here
  (items 1–4, and §5 for the arithmetic pairing; §10 item 2 lists what is not covered). Exactly equivariant dictionaries,
  the route-27 type, are a function of Tate moments on every variety (Theorem 4.13) and of the pole functionals alone in
  the tower (Corollary 4.14). Abstractly, (Rep) is equivalent to RH (Propositions 3.2 and 4.15): it can only be satisfied
  by putting the zeros in by hand.
* **Archimedean (Green-function) terms: they converge, to a limit that contains no ζ (Theorem 6.1).** Take N = p prime and
  fixed lifts z, w ∈ H. The regularized Green function of X₀(p) converges to the Green function of the cusp cylinder
  Γ_∞\H at rate O(log p / p). For the resolvent at σ = Re s > 1 the rate is p^{1−2σ}; at s = 2 the predicted difference is
  matched to a ratio of 0.9997 for p ≤ 61, where the remaining 3·10⁻⁴ is lattice truncation. At finite level the only
  ζ-dependence is the scattering coefficient φ(s)(p−1)/(p^{2s}−1), with
  φ(s) = √π Γ(s−½) ζ(2s−1)/(Γ(s) ζ(2s)). At the Arakelov point s = 1 its finite part is O(log p / p).
  The zeros of ζ appear in the tower only as resonances s = ρ/2 of the scattering matrix (Proposition 6.2), and as zeros
  of the Eisenstein amplitudes of CM Green functions (Remark 6.5). The ζ-factor of the scattering matrix is the atlas §2
  shift bridge R_{1/2}(2s − 1) at the single shift a = ½, where the comparison holds with no zero information. In the
  tower, positivity (self-adjointness) gives ζ(1 + it) ≠ 0 and nothing inside the strip. Hecke-equivariant archimedean
  classes have absolutely continuous spectral measures (Proposition 6.4).

RH is open. PT Λ ≤ 0.2 stands. 0.1758354 and 0.1787854 remain computer-assisted candidates. Nothing here changes a Λ
bound. NO QED.

## What is different from round 1

Round 1 (arith-surface) built S_Q and proved two things. First, S_Q has no Riemann–Roch datum (Theorem 6.2). Second, a
fixed arithmetic surface carries the Weil form only as an archimedean Dirichlet energy, up to a term of finite rank ≤ 3ρ
(Theorem 3.4). Its remark (iv) left towers with ρ_N → ∞ open and noted that their height pairings involve L-functions of
cusp forms. This note works in that tower. Riemann–Roch and Hodge index hold at every level (Lemma 2.1), so round 1's
obstruction does not occur. The obstruction moves to (Rep), and the precise reasons are identified: ζ is H⁰ ⊕ H² at every
level, the canonical scaling correspondences are self-adjoint, and the archimedean scaling is mixing. The archimedean
limit, which round 1 left as a question, is computed. The synthesis note (§3, item 4) predicted the stop: "representability
and convergence of the archimedean Green's-function terms as N → ∞". Both are decided here.

*Revision 2 adds* the even picture and the transcendence obstruction. Round 1 (arith-surface) and revision 1 both work
with translations of the test function. Translation is unitary and not self-adjoint for the Weil form, while the
canonical correspondences of the tower are self-adjoint, so Theorem 4.6 could be read as a mismatch of pictures rather
than an obstruction. Proposition 4.12 confirms that reading: on even test functions the natural shift is self-adjoint and
matches T_p. The obstruction that survives is arithmetic: the joint eigenvalues of three independent prime shifts are
p^λ, and by the six exponentials theorem they can all be algebraic only for λ ∈ Q (Theorem 4.13). This is route 27's
obstruction O2 ("no lattice of delays") in exact form. With one prime (curves over F_q) there is no obstruction, and with
two primes the statement would need the open four exponentials conjecture.

**Grades.**
* **[P]** proved here (complete argument in this note).
* **[P-L]** proved here from cited theorems.
* **[E]** exact integer or rational computation.
* **[M]** measured in floating point.
* **[L]** cited, not re-verified.
* **[A]** argued, not proved.
* **[Atlas]** accepted in the PR #27 modules by internal review (not external peer review).
* **[R]** re-derived or recomputed in the revision-2 fresh-context pass (§10b).

Revision 1 was checked by its author only (§10, same-author adversarial pass with independent code paths). Revision 2
re-checked it in a fresh context (§10b): a second instance of the same model, not an external referee. The revision-2
additions have been checked only by their author. No result is claimed as new. Theorems 4.5, 4.6, 4.13, 6.1 and
Propositions 4.7–4.9, 4.12, 4.15, 6.2, 6.4 are classical in substance, or short consequences of classical facts, written
out for this program.

**Scripts.** Run with `.venv-arb/bin/python -I`, one process at a time, each < 60 s and < 1 GB. Re-run everything with
`sh tmp/rha-modular-tower-rerun.sh`. Outputs go to `tmp/rha-modular-tower-out/`.

| script | content | output |
|---|---|---|
| `tmp/rha-modular-tower-es.py` | Eichler–Selberg trace of T_n on S₂(Γ₀(p)), exact rationals; validation; Plancherel limit; cusp trace forms | `es.json` |
| `tmp/rha-modular-tower-brandt.py` | supersingular ℓ-isogeny graphs over F_{p²} (Brandt matrices), ℓ = 2, 3, p ≤ 251; confinement identity; Ramanujan | `brandt.json` |
| `tmp/rha-modular-tower-green.py` | cylinder resolvent normalization; scattering coefficient; Γ₀(p) lattice sums at s = 2; resonances; kernel decay | `green.json` |
| `tmp/rha-modular-tower-equivariance.py` | Theorem 4.6 computation: w(F_ε) and the shifted cross term, prime side and zero side (10⁶ zeros) | `equivariance.json` |
| `tmp/rha-modular-tower-localpurity.py` | Proposition 4.7: point counts of X₀(11) over F_{ℓ^k} against Brandt power sums; ghost visibility; Lemma 4.3 and the Proposition 4.7 identity on Brandt data | `localpurity.json` |
| `tmp/rha-modular-tower-referee.py` | revision 2: u-space recomputation of the Lemma 4.6.1 table; Kronecker-limit constant C_0; scattering density at ½ in closed form; Remark 6.6 at the first zero; Theorem 4.13 approximation vs exactness; Proposition 4.15 Kronecker images vs Hecke points | `referee.json` |

---

## 0. Audit alignment (read first)

The user's audit (PR #27) was read before the attempt was written. The ten snapshots `/tmp/atlas-snap-*.md` were compared
with `git show refs/pr/27:research/rh/...` and are byte-identical. The SHA-256 prefixes are:

| file | SHA-256 prefix |
|---|---|
| historical-routes | `d7c63dd2357431c8` |
| arithmetic-foundation | `121e75c25d5c42a5` |
| finite-suzuki-certificate | `4dc523d105722c74` |
| prime-memory | `1e793a7d2a49bc61` |
| signed-complement | `66d2a804f9721080` |
| spectral-denominator-repair | `5342748924a4ff21` |
| spectral-head-theory | `4f2ae023c08d8b5a` |
| suzuki-recurrence | `46453c52806db375` |
| whole-even-certificate | `881a736aa736b37b` |
| PUBLICATION_SCOPE_2026-10-30 | `240172f513d7c581` |

Also read: the round-1 synthesis and the round-1 arith-surface note (§§0–8), the route-27 module and note,
`flow-blindness-no-go.js`, `imp-95530-native-span-arithmetic-input-rigidity.js` (NS-RIGID, RES-T), the MV-CAP note
(route 42, with its referee corrections), and the vortex-blocker README.

The modular tower is not an atlas route. It is the fourth "next attempt" of the round-1 synthesis. Its components overlap
atlas units as follows.

| Atlas unit | What the atlas records | Overlap with this note | What is different, or how it is used |
|---|---|---|---|
| §2 twin ladder, shift bridge | \|X(w−a)\| < \|X(w+a)\| on Re w > 0 ⟺ a ≥ Δ, endpoint included; positivity at every shift is an RH reformulation | Proposition 6.2: the scattering coefficient of every Γ₀(N) is φ(s) = (s/(s−1))·R_{1/2}(2s−1) times finite Euler factors. Corollary 4.14: an exactly Hecke-equivariant dictionary has degree part d(F), the pole term | identifies the tower's archimedean ζ-content with the bridge at the single shift a = ½, where the comparison holds without zero information; congruence levels change Euler factors, not a. The only characters an algebraic equivariant dictionary carries are the poles (γ = ±i/2) |
| §3 information, criticality | positive densities and moments cannot fix an absolute floor | Proposition 4.1 (Plancherel limit of Hecke forms); the positive zero part of the scattering-phase density, Proposition 6.2(iii) | same conclusion for these objects; not repeated |
| §4 synchronization | Q_L = B_L − C_L; toy damping proves nothing | none | not used |
| §5 vortices, heat collisions | global winding statement is RH | none | not used |
| §6 theta certificates | finite positivity and nonvanishing boxes | none | not used |
| §7 discrete curvature, prime rigidity | perturbing finitely many prime coefficients forces a negative dyadic matrix | none (the tower's local data are fixed) | not used |
| §8 twistor, thin Hankel | multiplicative Hankel kernels h_a(xy); absolute domination fails; norm bounds certify I ± H > 0, not positivity of the signed Hankel operator | Proposition 4.7: the characteristic-0 Hecke form at one prime is the characteristic-p Toeplitz Weil form plus a Hankel term; Theorem 4.6: the Hankel (product) structure of Hecke composition is what blocks scaling equivariance | exact single-prime decomposition; Toeplitz + Hankel positivity is reality of Hecke eigenvalues and misses real ghosts (§9.5) |
| §9 fixed-support positivity, null-symbol duals | fixed-support form and domain; negative lower surrogates are not negative actual forms | Lemma 4.2(a) uses the whole-even certificate for positivity of w(F) at short support | Theorem 3.1 is not a fixed-support statement; no new finite certificate |
| §10 Möbius energy, 7/8, V7 floor, PR #14 | V7 floor p < 1 ⇒ no zeros in Re s > (1+p)/2; PR #14 / Xu–Sang B = 0.87488665 conditional; 0.874 needs a restricted fourth moment | the V7 floor is a translation-invariant (Toeplitz) statement; Theorems 4.6 and 4.13 show that exactly equivariant Hecke composition cannot produce such statements. Remark 6.6 inverts amplitudes with 1/ζ (a Möbius packet) | half-plane inputs (7/8, B) move the resonances s = ρ/2 to Re s ≤ 7/16 or ≤ 0.4374; positivity in the tower does not see them either (Proposition 6.2). Remark 6.6: positive Möbius-type amplitudes register only on-line zeros, so a half-plane input changes nothing in them. Not used further |
| §11 curvature cylinder, gamma bulk, coupled fields | exact encodings give no positivity; general nonlocal or coupled-field models not excluded; a uniform positive margin is the wrong target | the tower is a coupled-field model (round-1 Theorem 3.4 at each level) | Theorem 6.1 decides the convergence of its archimedean terms: the limit is the hyperbolic cusp cylinder, constant curvature, no arithmetic measure dν. Proposition 4.9: the dynamical scaling has Lebesgue spectrum. Proposition 6.4: Hecke-equivariant archimedean classes have absolutely continuous spectral measures; Remark 6.5: their canonical amplitudes vanish at the zeros. For this tower the §11 door is closed for Hecke-equivariant and dynamical realizations; it stays open only for constructions that encode the zeros (Propositions 3.2, 4.15) |
| §12 Newman Λ | Λ ≥ 0; no route may silently claim Λ | none | no Λ claim |
| spectral-head, signed-complement, denominator repair | near-null head; complement floor open | none | not used |
| whole-even certificate | q_λ coercive on even classes for λ ≤ √(161/10) [Atlas] | Lemma 4.2(a) | cited for positivity of w(F) at support width 0.2 |
| Suzuki recurrence, prime memory, finite Suzuki, arithmetic foundation | one-sided Landau target D(W) ≤ C(1+W)^m is RH at α = 0; signed prime-credit prefix open | Lemma 4.3: in the tower the ζ prime sum is a degree | the Landau/Suzuki target becomes an upper bound on degrees of explicit Hecke classes, which no Hodge-index inequality constrains (Lemma 4.4) |
| PUBLICATION_SCOPE | lower surrogates ≠ actual forms; finite prefixes ≠ all-scale bounds | every [M] number labelled | [E] identities are the only computations used inside proofs |

**The atlas closing line** names three open targets: "a genuine all-scale signed arithmetic estimate, a cofinal
actual-form floor, or an exhaustive theta boundary/collision certificate". This attempt aimed at a fourth kind of input: a
positivity theorem from algebraic geometry, the Hodge index theorem, transported along a tower. The tower's positivity
theorems concern cusp forms (local purity at each prime) and never reach the ζ Weil form. The attempt supplies none of the
three targets.

**Not repeated** (recorded in the atlas or in round 1): fixed-support certificates (§9), clipping norms (signed
complement), absolute domination (§8, §11), heat-flow and winding arguments (§5), deformation of prime coefficients (§7),
and the Riemann–Roch question on S_Q (round-1 Theorem 6.2).

---

## 1. Target and template

### 1.1 Target

Notation of round 1 (arith-surface §2):

* u ∈ R is the logarithm of a scaling factor.
* Φ̂(z) = ∫ Φ(u) e^{izu} du, d(Φ) = ∫ Φ(u) e^{u/2} du, d′(Φ) = ∫ Φ(u) e^{−u/2} du.
* (F ⋆ Ǧ)(x) = ∫ F(u) G(u − x) du.
* K = K_∞ + Σ_p K_p, with ⟨K_p, Φ⟩ = log p Σ_{m≥1} p^{−m/2}(Φ(m log p) + Φ(−m log p)).
* ⟨K_∞, Φ⟩ = c_∞Φ(0) + ∫_0^∞ (Φ(y) + Φ(−y) − 2Φ(0)) k(y) dy, with k(y) = e^{y/2}/(e^y − e^{−y}).
* W(Φ) = Σ_ρ Φ̂(γ_ρ) = d(Φ) + d′(Φ) − ⟨K, Φ⟩ (explicit formula).

On the graph-class space N(S_Q) = RH ⊕ RV ⊕ {D_F}, the pairing satisfies P(D_F)·P(D_G) = −W(F ⋆ Ǧ) (round-1
Theorem 2.1). Write

    w(F) := W(F ⋆ F̌) = −P(D_F)².

**Target (round-1 Corollary 2.3) [P-L].** RH ⟺ w(F) ≥ 0 for every real F ∈ 𝒜 := C_c²(R) ⟺ P(X)² ≤ 0 for every
X ∈ N(S_Q).

The Weil form is translation invariant: w(F(· − a)) = w(F) for every real a, because F(·−a) ⋆ F(·−a)ˇ = F ⋆ F̌. This
fact is used repeatedly below.

### 1.2 Template (route 27)

For a curve C/F_q, let Γ_j be the graph of F^j on C × C and P_j = Γ_j − H − q^jV. Then
−P_j·P_k = q^{(j+k)/2}S_{k−j}, and Hodge index gives RH. Two structural facts drive the proof:

* **(a) Composition shifts the delay.** Γ_j ∘ Γ_k^t = q^k Γ_{j−k}.
* **(b) Normalized Frobenius is unitary.** The Rosati involution satisfies F^† F = q, so q^{−1/2}F is unitary.

Together these make the Gram matrix Toeplitz: it depends on j − k. The zeros of ζ_C correspond to the eigenvalues of
q^{−1/2}F on H¹.

### 1.3 Plan

On S_N = X₀(N) × X₀(N), the Hecke correspondence T_n plays the role of Γ_j at delay log n. Hodge index holds at every
level. Pass to the limit N → ∞. Use only positivity. Decide whether the Weil classes are representable, and whether the
archimedean terms converge.

---

## 2. The tower: objects and the facts used

### 2.1 Curves and Hecke correspondences

For N ≥ 1, X_N := X₀(N) is the smooth projective modular curve over Q, with genus g_N and X_N(C) = Γ₀(N)\H*. For
(n, N) = 1 the Hecke correspondence T_n ⊂ X_N × X_N is the closure of
{((E, C), (E/K, (C + K)/K)) : K ⊂ E a subgroup of order n}. The following facts are used [L: Shimura, *Introduction to
the arithmetic theory of automorphic functions*, Ch. 3 and 7; Diamond–Shurman, *A first course in modular forms*,
§§5.2–5.3 and 8.7]:

* T_n is an effective divisor on S_N := X_N × X_N.
* Both projections T_n → X_N have degree σ₁(n), the number of sublattices of index n in Z².
* T_1 = Δ, and the transpose T_n^t equals T_n (dual isogeny).
* For (mn, N) = 1: T_m ∘ T_n = Σ_{d | (m,n)} d · T_{mn/d²}.

### 2.2 Néron–Severi group and the intersection formula

Let H = X_N × {pt} and V = {pt} × X_N, so H² = V² = 0 and H·V = 1. For a curve X over C,
NS(X × X) ≅ ZH ⊕ ZV ⊕ End(J_X) [L: Birkenhake–Lange, *Complex abelian varieties*, Thm 11.5.1]. For a divisor D on S_N
put d₁(D) := D·V and d₂(D) := D·H, and let γ_D ∈ End(J_N) ⊗ Q be the induced endomorphism (its action on H¹). Then
[L: Weil 1948]

    (2.1)   D·D′ = d₁(D) d₂(D′) + d₂(D) d₁(D′) − Tr(γ_D γ_{D′}^† | H¹(X_N(C), Q)),

where † is the Rosati involution, i.e. the transpose correspondence. Two checks:

* D = D′ = Δ gives 2 − 2g.
* For Frobenius graphs over F_q, (2.1) with γ = F^j and γ^† = (F^t)^k = q^k F^{−k} gives route 27's
  Γ_j·Γ_k = q^j + q^k − q^{(j+k)/2} S_{j−k}.

The primitive projection is P(D) := D − d₁(D)H − d₂(D)V. It satisfies

    (2.2)   P(D)·P(D′) = −Tr(γ_D γ_{D′}^† | H¹).

For a real finite combination u = Σ c_n T_n with (n, N) = 1, γ_u is Rosati-self-adjoint and

    (2.3)   d₁(u) = d₂(u) = Σ c_n σ₁(n) =: χ_Eis(u),     −P(u)² = Tr(γ_u² | H¹) = 2 Σ_{f ∈ B_N} χ_f(u)²,

where:

* B_N is a basis of S₂(Γ₀(N)) consisting of eigenforms for all T_n with (n, N) = 1 (old forms counted with
  multiplicity);
* χ_f(T_n) = a_f(n) ∈ R.

Proof of (2.3) [P-L]: H¹(X_N, C) ≅ S₂(Γ₀(N)) ⊕ S̄₂(Γ₀(N)) (complex conjugate), Hecke-equivariantly (Eichler–Shimura
isomorphism). The T_n with (n, N) = 1 are self-adjoint for the Petersson product, so they are diagonalizable with real
eigenvalues, and each eigenform contributes its eigenvalue twice.

### 2.3 Eichler–Shimura: ζ is the pole part of every level

For p ∤ N, T_p ≡ Frob_p + Ver_p on X_N ⊗ F_p (Eichler–Shimura congruence relation) [L]. Hence

    Z(X_N/F_p, T) = ∏_{f ∈ B_N} (1 − a_f(p)T + pT²) / ((1 − T)(1 − pT)),

    (2.4)   ζ(X_N, s) = ζ(s) ζ(s − 1) / ∏_{f ∈ B_N} L(s, f)     (up to the Euler factors at p | N).

The Frobenius eigenvalues on H¹(X_N ⊗ F̄_p) are α_f(p), β_f(p), with α + β = a_f(p) and αβ = p. Weil's theorem for
X_N/F_p gives |α_f(p)| = √p, which is Ramanujan for weight 2. On H⁰ and H² the Frobenius eigenvalues are 1 and p, and
T_p acts there by its degree p + 1 = σ₁(p). The degree character χ_Eis(T_n) = σ₁(n) is the T_n-eigenvalue of the
Eisenstein series E₂(z) − N E₂(Nz) ∈ M₂(Γ₀(N)), and Σ_n σ₁(n) n^{−s} = ζ(s)ζ(s − 1).

**So ζ is the L-function of H⁰, and ζ(s − 1) the L-function of H², at every level.** This is the exact analogue of the
pole factor 1/((1 − T)(1 − qT)) of a curve over F_q. H¹, the space on which Hodge index acts, carries the cusp forms.

### 2.4 Lemma 2.1 (Hodge index and Riemann–Roch at every level) [P-L]

* (i) NS(S_N) ⊗ R has signature (1, ρ_N − 1). This is the Hodge index theorem on the smooth projective surface S_N
  [L: Hartshorne V.1.9].
* (ii) ⟨H, V⟩ is a hyperbolic plane, so P(x)² ≤ 0 for every x ∈ NS(S_N)_R, with equality only when P(x) = 0. By (2.2)
  this is Rosati positivity: Tr(γγ^† | H¹) > 0 for γ ≠ 0. [P from (i) and (2.2)]
* (iii) Take h = h⁰, K_{S_N} = p₁*K + p₂*K ≡ (2g_N − 2)(H + V) and χ₀ = χ(O_{S_N}) = (1 − g_N)². This is a
  Riemann–Roch datum in the sense of round-1 §5.1:
  * (R1) holds by definition;
  * (R2) is Riemann–Roch with Serre duality;
  * (R3) is the degree bound for h⁰;
  * (R4) holds because a linear system with one member has h⁰ = 1.

  Round-1 Theorem 5.1, Steps 0–4, therefore runs on S_N (Grothendieck's proof of Hodge index), with one change: Step 1
  there uses the soft axiom (A3) of S_Q, and on S_N it is replaced by the standard fact that a nonzero effective divisor
  has positive degree against the ample class H + V. [R] The round-1 obstruction (Theorem 6.2: no Riemann–Roch datum on
  S_Q) does not occur at any finite level.
* (iv) The positivity in (ii) is unconditional. It is the positivity of the polarization of J_N and does not involve ζ.

### 2.5 The arithmetic surfaces [L]

Let 𝒳_N → Spec Z be a regular model of X_N (Deligne–Rapoport, then desingularization), and Ĉh¹(𝒳_N)_R its real
arithmetic Chow group with the Arakelov–Gillet–Soulé pairing (·,·). Facts used:

* **Faltings–Hriljac.** For D ∈ Div⁰(X_{N,K}), let Φ(D) be the vertical correction that makes D + Φ(D) orthogonal to
  every fibre component, and use an admissible Green function. Then ĥ_NT([D]) = −(D + Φ(D), D + Φ(D)) ≥ 0
  [Faltings 1984; Hriljac 1985].
* **Arithmetic Riemann–Roch** holds on 𝒳_N [Faltings 1984; Gillet–Soulé].
* **Moriwaki's Hodge index theorem** in higher dimension applies to a desingularization of 𝒳_N ×_Z 𝒳_N
  [Moriwaki 1996]; it is not needed below.
* **Round-1 Theorem 3.4 at each level.** Ĉh¹(𝒳_N)_R is a part of finite rank ρ_N = rank Pic(𝒳_N) plus the archimedean
  part a(A^{0,0}(X_N(C))). The pairing is −½E(η, η′) plus a form of rank ≤ 3ρ_N, where E is the Dirichlet energy on
  X_N(C). Here ρ_N → ∞: it includes rank J_N(Q) and the vertical components at p | N. This growth is why round 1 left
  towers open.
* **Hecke action.** The Hecke correspondences T_n, (n, N) = 1, extend to finite flat correspondences over Z[1/N]. They
  act on Ĉh¹ and are self-adjoint for (·,·), because T_n^t = T_n. On archimedean classes T_n acts on functions on
  X_N(C) and commutes with the Laplacian. [L/A]

---

## 3. The argument and the status of its hypothesis

### Theorem 3.1 (tower criterion) [P from Lemma 2.1(ii) and round-1 Corollary 2.3]

Suppose that for a sequence of levels N → ∞ there are linear maps L_N : N(S_Q) → NS(S_N)_R with L_N(H) = H and
L_N(V) = V, and constants c_N > 0, such that

    (Rep)   lim_N c_N^{−1} P(L_N D_F)² = P(D_F)²      for every real F ∈ 𝒜.

Then RH holds.

*Proof.*

1. By Lemma 2.1(ii), P(L_N D_F)² ≤ 0 for every N.
2. Hence the limit is ≤ 0, so P(D_F)² ≤ 0, i.e. w(F) ≥ 0, for every real F ∈ 𝒜.
3. By round-1 Corollary 2.3 this implies RH. That corollary uses Weil's criterion together with the reduction of a
   complex counterexample to a real one. ∎

**Theorem 3.1′ (arithmetic variant) [P-L].** The same conclusion holds with L_N valued in the degree-0, fibre-orthogonal
subspace of Ĉh¹(𝒳_N)_R and with Faltings–Hriljac in place of Lemma 2.1(ii). The proof is identical.

Every step of Theorem 3.1 is proved. The argument stands or falls with (Rep).

### Proposition 3.2 ((Rep) taken abstractly is RH) [P]

(Rep) can be satisfied by some sequence (L_N, c_N) if and only if RH holds.

*Proof.*

* (⇒) This is Theorem 3.1.
* (⇐) Assume RH.
  1. Then w(F) = Σ_γ |F̂(γ)|². The sum converges for F ∈ C_c², because |F̂(t)| ≪ (1 + |t|)^{−2} and N(T) ≪ T log T.
  2. So ⟨F, G⟩ := W(F ⋆ Ǧ) is a positive semidefinite form on 𝒜. Its Hilbert completion 𝓗 (after quotienting by null
     vectors) is separable, because F ↦ (F̂(γ))_γ embeds it isometrically in ℓ²(zeros).
  3. Choose an orthonormal basis (e_k) of 𝓗 and let π_k be the orthogonal projection onto span{e_1, …, e_k}.
  4. For N prime, End⁰(J_N)_R ⊇ 𝕋 ⊗ R has dimension ≥ dim S₂(Γ₀(N)) = g_N → ∞. Choose k(N) → ∞ with k(N) ≤ g_N, and a
     linear isometry ι_N from (span{e_1..e_{k(N)}}, ⟨,⟩) into (End⁰(J_N)_R, Tr(γγ^†)).
  5. Put L_N(aH + bV + D_F) := aH + bV + ι_N(π_{k(N)}[F]). Then
     −P(L_N D_F)² = ‖π_{k(N)}[F]‖² → ‖[F]‖² = w(F), so (Rep) holds with c_N = 1. ∎

**Consequence.** (Rep) has no content independent of RH. The attempt has content only if the tower's own data (Hecke
correspondences, degeneracy maps, Green functions, special cycles) produce the maps L_N without using the zeros. §4
(algebraic classes), §5 (arithmetic classes) and §6 (archimedean terms) test the constructions of this kind that the tower
offers.

---

## 4. Step (Rep): the constructions the tower offers, one by one

### 4.1 (C1) The twin-ladder dictionary

This is the direct mirror of p_j = q^{−j/2}Γ_j. For F ∈ C_c(R), and N coprime to every n ≤ e^{sup supp F}, put

    u_N(F) := Σ_{n ≥ 1} F(log n) n^{−1/2} T_n,      L_N(D_F) := d′(F) H + d(F) V + P(u_N(F)).

**Proposition 4.1 (Plancherel limit) [P-L, checked E/M].** For F ∈ C_c(R), as N → ∞ through primes,

    (2g_N)^{−1} · (−P(u_N(F))²)  →  𝒫(F) := Σ_{m,n ≥ 1} F(log m) F(log n) K(m, n),
    K(m, n) := Σ_{d | (m,n)} (mn/d²)^{−1/2} · 1_□(mn/d²),

where 1_□(k) = 1 if k is a perfect square and 0 otherwise.

*Proof.*

1. By (2.3) and T_m T_n = Σ_d d T_{mn/d²}:
   −P(u)² = Σ_{m,n} F(log m) F(log n) (mn)^{−1/2} Σ_{d | (m,n)} d · Tr(T_{mn/d²} | H¹).
2. The Eichler–Selberg formula (9.1) gives Tr(T_k | S₂(Γ₀(p))) = ((p+1)/12) 1_□(k) + R_p(k), with |R_p(k)| ≤ C(k)
   independent of p. The class-number term is bounded by Σ_{t² < 4k} 2H(4k − t²), and the other two terms by divisor
   sums. Also g_p = (p + 1)/12 + O(1).
3. Hence Tr(T_k | H¹)/(2g_p) → 1_□(k). Since d/√(mn) = (mn/d²)^{−1/2}, the limit is 𝒫(F). ∎

This is Serre's equidistribution theorem for T_p (Plancherel measure), in trace form [L: Serre, JAMS 10 (1997)]. Measured
in `es.json` (§9.1): g · max_{k ≤ 40} |Tr T_k/g − 1_□(k)| lies between 27 and 42 for p = 101, …, 3203, so the error is
O(1/g).

**Lemma 4.2 ((C1) does not satisfy (Rep)) [P, with Atlas and M].**

* **(a) Support between logarithms.** Take F even about c = log 2.5 with supp F ⊂ (c − 0.1, c + 0.1) ⊂ (log 2, log 3).
  Then u_N(F) = 0 for every N, so the left side of (Rep) is 0. But w(F) = w(F(· + c)) > 0. Indeed, F(· + c) is even and
  supported in [−0.1, 0.1], so w(F(·+c)) = q_λ[F(·+c)] with λ = e^{0.1} (round-1 Lemma 2.2), and q_λ is coercive there
  by the whole-even certificate [Atlas]. For the bump of §9.4 with ε = 0.1 the value is 0.8335 [M; prime side and zero
  side agree to 4·10⁻¹²].
* **(b) Narrow bumps.** Let F_ε(u) = ε^{−1/2} φ(u/ε), with φ real, smooth, supported in (−1, 1), ‖φ‖₂ = 1, and
  ε < (log 2)/2. Only n = 1 has log n in the support, so u_N(F_ε) = F_ε(0) Δ and
  (2g_N)^{−1}(−P(u_N(F_ε))²) = φ(0)²/ε for every N. (Rep) would force lim_N 2g_N/c_N =: κ to exist with
  κ = ε w(F_ε)/φ(0)² for every ε. But w(F_ε) = log(1/ε) + O(1) (Lemma 4.6.1(i)), so the right side tends to 0 and
  varies with ε. Measured values (§9.4): 0.0400, 0.0499, 0.0428, 0.0274, 0.0177 at ε = 0.2, 0.1, 0.05, 0.02, 0.01. ∎

*Reading.* 𝒫 samples F only on {log n}. It couples m and n through the products mn/d², which is a Hankel structure in
log. The Weil form w is translation invariant (Toeplitz) and sees F on all of R, through the archimedean continuum.
Theorem 4.6 shows that this mismatch is not an artefact of the particular choice (C1).

### 4.2 (C2) Explicit-formula classes: the ζ prime sum is a degree

For p ∤ N let Ψ_0 := 2, Ψ_1 := x, Ψ_{k+1} := x Ψ_k − p Ψ_{k−1}. Then χ(Ψ_k(T_p)) = α^k + β^k for every Hecke character
with T_p ↦ α + β and αβ = p. For even h ∈ C_c(R), and N coprime to every n ≤ e^{sup supp h}, define

    E_N(h) := Σ_{p ∤ N} Σ_{k ≥ 1} (log p) p^{−k/2} (p^k + 1)^{−1} h(k log p) Ψ_k(T_p).

**Lemma 4.3 (explicit-formula classes) [P; checked M, §9.5 L3].**

* (i) E_N(h)·H = E_N(h)·V = χ_Eis(E_N(h)) = Σ_{n ≥ 2} Λ(n) n^{−1/2} h(log n).
* (ii) For f ∈ B_N write b_f(p) := α_f(p)/√p, so that the normalized Frobenius eigenvalues at p are b_f(p) and
  b_f(p)^{−1}, with |b_f(p)| = 1 by Ramanujan. Then
  χ_f(E_N(h)) = Σ_n Λ_f(n) n^{−1/2} h_♭(log n), where Λ_f(p^k) = (b_f(p)^k + b_f(p)^{−k}) log p and
  h_♭(x) := h(x)/(2cosh(x/2)). This is the prime side of the explicit formula of L(s, f) for the test function h_♭.
* (iii) −P(E_N(h))² = 2 Σ_{f ∈ B_N} χ_f(E_N(h))² ≥ 0: a sum of squares of cuspidal explicit formulas.
* (iv) For even Φ ∈ C_c²(R), and N coprime to every n ≤ e^{sup supp Φ},

      W(Φ) = d(Φ) + d′(Φ) − ⟨K_∞, Φ⟩ − 2 E_N(Φ)·H.

  Hence RH ⟺ E_N(F ⋆ F̌)·H ≤ ½ [d + d′ − ⟨K_∞, ·⟩](F ⋆ F̌) for every real F ∈ 𝒜, with N chosen (depending on F)
  coprime to every n ≤ e^{2 sup |supp F|}; the degree does not depend on which such N is used. **In the tower, RH is a family of upper bounds on degrees of explicit Hecke classes.**

*Proof.*

* (i) The Eisenstein Satake parameters at p are p and 1, so χ_Eis(Ψ_k(T_p)) = p^k + 1. The factor (p^k + 1)^{−1}
  cancels it, leaving Σ_{p,k} (log p) p^{−k/2} h(k log p).
* (ii) χ_f(Ψ_k(T_p)) = α_f(p)^k + β_f(p)^k = p^{k/2}(b_f(p)^k + b_f(p)^{−k}), and
  p^{−k/2} · p^{k/2}/(p^k + 1) = 1/(p^k + 1) = n^{−1/2} · (1/(2cosh((log n)/2))) with n = p^k.
* (iii) This is (2.3).
* (iv) The explicit formula (round-1 Theorem 2.1) for even Φ reads
  W(Φ) = d + d′ − 2 Σ_n Λ(n) n^{−1/2} Φ(log n) − ⟨K_∞, Φ⟩. Substitute (i). ∎

**Lemma 4.4 (Hodge index does not constrain degrees) [P].**

1. Every x ∈ NS(S_N)_R is uniquely x = αH + βV + P(x), with α = x·V and β = x·H, and x² = 2αβ + P(x)².
2. The Hodge index theorem (Lemma 2.1(i)) is equivalent to P(y)² ≤ 0 for all y.
3. For every (α, β) ∈ R² and every primitive class P, the class αH + βV + P lies in NS(S_N)_R. So the degrees range over
   R² independently of the primitive part.
4. Applied to E_N(h), Hodge index says exactly (iii), which contains no ζ-data. Combined forms reduce to the same
   statement: for example (x·A)² ≥ x²A² with A = H + V is (α − β)² ≥ 2P(x)².

Hence the inequalities of Lemma 4.3(iv), which bound E_N(F ⋆ F̌)·H, are not consequences of Hodge index at any level. ∎

*Remark.* Over F_q the degree terms are the pole terms q^j + q^k of route 27's G_jk. They are invisible to Hodge index
there too, and harmlessly so, because the zeros sit in the primitive part. In the tower, the ζ zeros sit in the degree
part (Lemma 4.3(iv)). This is the precise sense in which ζ is the pole part of every modular curve.

### 4.3 (C3) Every map into NS: Eisenstein confinement

**Theorem 4.5 (Eisenstein confinement) [P-L; (ii) checked E].**

* **(i)** For every N and all x, y ∈ NS(S_N)_R, P(x)·P(y) = −Tr(γ_x γ_y^† | H¹(X_N)), and H¹(X_N, C) ≅ S₂ ⊕ S̄₂ is
  cuspidal. Every isogeny factor of J_N is a quotient A_f attached to a cusp form, and End(J_N) respects the isotypic
  decomposition [L: Shimura Ch. 7; Ribet 1980]. The Eisenstein character χ_Eis, with Dirichlet series ζ(s)ζ(s−1), does not
  occur in H¹. On the Hecke span it enters the intersection numbers only through d₁ and d₂, i.e. through a form of
  rank ≤ 2.
* **(ii)** Let B(·) be the Brandt matrices, giving the Hecke action on M₂(Γ₀(p)) = Eis ⊕ S₂ through the supersingular
  module at p. For the 52 primes p ≤ 251 and all 3-smooth m, n ≤ 48 (225 pairs per prime),

      Tr(B(m) B(n)) = σ₁(m) σ₁(n) + Tr(T_m T_n | S₂(Γ₀(p))).

  The right side comes from the Eichler–Selberg formula, the left from isogeny graphs: two independent code paths agree
  exactly (§9.2). The ζ-data form the rank-one term σ₁ ⊗ σ₁.
* **(iii)** For every linear L_N, the Hodge-index form F ↦ −P(L_N D_F)² depends only on the cuspidal coordinates of
  P(L_N D_F).

*Proof.* (i) and (iii) follow from (2.2), the Eichler–Shimura isomorphism, and the cited structure of End(J_N). (ii) is
the decomposition M₂ = C·E ⊕ S₂ into Hecke-stable pieces, with the Eisenstein line acting by σ₁; it is exact and verified
by direct computation. ∎

So under (Rep), the ζ Weil form would have to be a limit of sums of squares of cuspidal Hecke coordinates,
lim c_N^{−1}·2Σ_{f ∈ B_N} |χ_f(u_N(F))|². Theorem 4.5 does not exclude this: Proposition 3.2 shows that, given RH, such
maps exist. What Theorem 4.5 shows is that the tower's ζ-data (χ_Eis, the degrees) never enter the right side. A
construction must therefore produce the zeros from cusp-form data, which (C1) and (C2) do not.

### 4.4 (C4) Scaling-equivariant dictionaries: no self-adjoint scaling

For x ∈ NS(S_N)_R write γ_x ∈ End⁰(J_N)_R for the endomorphism of its primitive part. A (Rep)-sequence (L_N, c_N) is
**p-equivariant via C = (C_N)**, with C_N ∈ End⁰(J_N)_R, if

    γ_{L_N D_{F(· − log p)}} = C_N ∘ γ_{L_N D_F}      for every F ∈ 𝒜 and every N.

Route 27 is p-equivariant in this sense with C = q^{−1/2}F, because γ_{p_{j+1}} = (q^{−1/2}F) ∘ γ_{p_j}. This is the
mechanism that makes route 27's Gram matrix Toeplitz.

**Theorem 4.6 (no self-adjoint or finite-order scaling in the translation picture) [P, R].** No (Rep)-sequence is
p-equivariant via correspondences C_N that are Rosati-self-adjoint (C_N^† = C_N) or of bounded finite order (C_N^m = 1
with m fixed). In particular the translation by log p cannot be realized by p^{−1/2}T_p (p ∤ N), by p^{−1/2} times any
self-adjoint Hecke operator, or by an Atkin–Lehner involution. (Revision 2: this concerns translations F ↦ F(· − log p).
For the symmetric shift on even test functions the analogous identities hold, so there is no contradiction
(Proposition 4.12); the even picture is treated by Theorem 4.13.)

*Proof.*

* **Step 1 (polarization).** Put B_N(X, Y) := c_N^{−1} Tr(γ_{L_N D_X} γ_{L_N D_Y}^†) = −c_N^{−1} P(L_N D_X)·P(L_N D_Y).
  Since X ↦ D_X is linear and W(X ⋆ Y̌) is symmetric in real X and Y, (Rep) gives B_N(X, Y) → W(X ⋆ Y̌) for all real
  X, Y ∈ 𝒜.
* **Step 2 (self-adjoint C).** Fix F, write γ := γ_{L_N D_F} and G_j := F(· − j log p). By equivariance
  γ_{L_N D_{G_1}} = Cγ and γ_{L_N D_{G_2}} = C²γ. By cyclicity of the trace and C^† = C:
  * B_N(G_1, G_1) = c_N^{−1} Tr(Cγγ^†C) = c_N^{−1} Tr(C²γγ^†);
  * B_N(F, G_2) = c_N^{−1} Tr(γγ^†C²) = c_N^{−1} Tr(C²γγ^†).

  The first tends to w(G_1) = w(F) (translation invariance, §1.1), the second to W(F ⋆ Ǧ_2). Hence

      (*)   W(F ⋆ (F(· − 2 log p))ˇ) = w(F)      for every real F ∈ 𝒜.
* **Step 3 (finite order).** If C^m = 1, then γ_{L_N D_{G_m}} = γ. So B_N(F, G_m) = B_N(F, F), which tends both to
  w(F) and to W(F ⋆ Ǧ_m):

      (**)   W(F ⋆ (F(· − m log p))ˇ) = w(F)      for every real F ∈ 𝒜.
* **Step 4.** Lemma 4.6.1 contradicts (*) and (**). Along F = F_ε the left sides stay bounded, while w(F_ε) → +∞. ∎

**Lemma 4.6.1 [P; illustrated M in §9.4].** Let F_ε be as in Lemma 4.2(b), let a ≥ log 2, and let 2ε < log 2.

* (i) w(F_ε) = log(1/ε) + O_φ(1) as ε → 0.
* (ii) W(F_ε ⋆ (F_ε(· − a))ˇ) → −Λ(e^a) e^{−a/2} as ε → 0. Here Λ(e^a) := Λ(n) if e^a = n is an integer, and 0
  otherwise.

  The limit is −(log p)/p for a = 2 log p and −(log p)p^{−m/2} for a = m log p; in every case it is bounded.

*Proof.*

* (i) For 2ε < log 2 the prime terms vanish, and round-1 Lemma 2.2 gives
  w(F_ε) = (1/2π) ∫ α(t) |F̂_ε(t)|² dt + 2 ∫_0^{2ε} e^{r/2} R_{F_ε}(r) dr, with α(t) = Re ψ(5/4 + it/2) − log π.
  * The continuum term is O(ε).
  * With F̂_ε(t) = ε^{1/2} φ̂(εt), the gamma term is (1/2π) ∫ α(τ/ε) |φ̂(τ)|² dτ.
  * Stirling gives α(t) = log(|t|/2π) + O(1/(1 + t²)) for |t| ≥ 1, and α is bounded on |t| ≤ 1.
  * (1/2π) ∫ |φ̂|² = ‖φ‖² = 1, and ∫ |log|τ|| |φ̂(τ)|² dτ < ∞.

  Together these give log(1/ε) + O_φ(1).
* (ii) Set Φ := F_ε ⋆ (F_ε(· − a))ˇ. Then Φ(x) = R_{F_ε}(−x − a), so:
  * Φ is supported in [−a − 2ε, −a + 2ε];
  * Φ(−a) = ‖F_ε‖² = 1, and |Φ| ≤ 1;
  * ∫ |Φ| ≤ (∫ |F_ε|)² ≤ 2ε.

  Now take the terms of W(Φ) = d + d′ − Σ_n Λ(n) n^{−1/2} (Φ(log n) + Φ(−log n)) − ⟨K_∞, Φ⟩ one at a time:
  * d + d′ ≤ 2cosh((a + 2ε)/2) · 2ε → 0.
  * Φ vanishes on [0, ∞), so ⟨K_∞, Φ⟩ = ∫_0^∞ Φ(−y) k(y) dy ≤ max_{|y−a| ≤ 2ε} k(y) · 2ε → 0.
  * Φ(log n) = 0 for every n ≥ 2. Φ(−log n) ≠ 0 only if |log n − a| < 2ε. If e^a = n₀ is an integer, then for small ε
    only n₀ contributes, with Φ(−log n₀) = 1, which gives −Λ(n₀) n₀^{−1/2}. Otherwise no n contributes for small ε. ∎

Measured (§9.4, p = 2): w(F_ε) = 0.334, 0.834, 1.430, 2.288, 2.962 at ε = 0.2, 0.1, 0.05, 0.02, 0.01, while
W(F_ε ⋆ Ǧ_2) = 0.065, −0.130, −0.238, −0.303, −0.325 → −0.3466. The prime side and the zero side (10⁶ zeros) agree to
≤ 1.5·10⁻¹⁰.

**Remark 4.6(a) (what an equivariant construction would need) [P for the identities, A for the reading].** For a
general C the same computation gives, for every j ≥ 0:

* B_N(G_j, G_j) = c_N^{−1} Tr(C^{†j}C^j γγ^†) → w(F);
* B_N(F, G_j) = c_N^{−1} Tr(γγ^† C^{†j}) → W(F ⋆ Ǧ_j).

So in the weighted limit C must act isometrically, and its spectral measure at the weight γγ^† must be the pushforward of
Σ_ρ |F̂(γ_ρ)|² δ_{γ_ρ} under γ ↦ e^{−iγ log p}. In route 27, C = q^{−1/2}F does this. In characteristic 0 the
Rosati-unitary elements of End⁰(J_N)_R form a compact group: products of orthogonal or unitary groups on the multiplicity
spaces of the isogeny factors of J_N, coming from old-form multiplicities and from extra endomorphisms of inner twists or
CM. None of them is attached to the prime p by the moduli problem. Choosing them so that their joint weighted spectrum is
(e^{iγ log p})_p amounts to choosing the zeros (Proposition 3.2).

**Remark 4.6(b) (U_p at levels divisible by p) [A; exact case now P-L, Corollary 4.14(ii)].** On the p-old part of
S₂(Γ₀(Np^r)), U_p has the individual Satake parameters α_f(p), β_f(p) as eigenvalues (p-stabilization). It is the
characteristic-0 counterpart of Frob_p. It is neither self-adjoint nor of finite order, so Theorem 4.6 does not apply to
it. Exact U-equivariance for three primes is excluded by Corollary 4.14(ii): such a dictionary depends only on d(F) and
d′(F). The reading below concerns the remaining, non-exact uses of U_p.

* On the old-form tower {f(p^j z)}_{j ≥ 0}, U_p acts as a backward shift: U_p(f(p^j z)) = f(p^{j−1} z) for j ≥ 1.
* The Gram matrices of this tower are values of the local spherical function of π_p. They describe the single local
  representation π_p, whose scaling spectrum is absolutely continuous (Remark 4.10).
* On the Eisenstein p-old forms the U_p-eigenvalues are 1 and p, i.e. the local Euler factors of ζ(s) and ζ(s − 1) at p.

So U_p supplies local Frobenius data one prime at a time. That is local purity (§7), not a scaling with atoms at the zero
ordinates.

**Proposition 4.7 (one prime: characteristic-0 Hodge index = characteristic-p Weil form + Hankel term) [P; checked E].**
Let p ∤ N and a = (a_0, …, a_K) real. Put u_a := Σ_k a_k p^{−k/2} Ψ_k(T_p) with Ψ_0 = 2, and
S_n := Σ_{f ∈ B_N} (b_f(p)^n + b_f(p)^{−n}). Equivalently S_n = p^{−n/2} Σ_{i=1}^{2g_N} α_i^n over the Frobenius
eigenvalues of X_N/F_p on H¹; this is route 27's S_n for the curve X_N/F_p. Then

    −P(u_a)² = 2 (Q_TL[a] + Hank[a]),     Q_TL[a] := Σ_{j,k} a_j a_k S_{j−k},     Hank[a] := Σ_{j,k} a_j a_k S_{j+k}.

* Hodge index on S_N (characteristic 0) says Q_TL + Hank = Σ_f χ_f(u_a)² ≥ 0. This holds as soon as every
  b_f + b_f^{−1} is real: it is the self-adjointness of T_p.
* Hodge index on (X_N/F_p)² (route 27) says Q_TL ≥ 0. This holds if and only if |b_f(p)| = 1 for all f (Ramanujan at
  p; route-27 Corollary to the exact ghost index).
* The difference between the two is the Hankel term. A real ghost b > 1 passes the first test and fails the second
  [E, §9.5: for the route-27 fake 1 − 5T + 5T², min eig Q_TL = −11.89, while Q_TL + Hank is PSD to 7·10⁻¹⁵].
* The H⁰ ⊕ H² part contributes S_n^{Eis} = p^{n/2} + p^{−n/2}, the pole terms, which P removes.

*Proof.* χ_f(u_a) = Σ_k a_k (b_f^k + b_f^{−k}), and (b^j + b^{−j})(b^k + b^{−k}) = (b^{j+k} + b^{−j−k}) + (b^{j−k} +
b^{k−j}). Sum over f and use (2.3). If b_f + b_f^{−1} is real, every b_f^k + b_f^{−k} is a real polynomial in it, so each
χ_f(u_a) is real. The Toeplitz equivalence is route 27's Corollary (curve-RH ⟺ T_{2g} ⪰ 0) for X_N/F_p. ∎

The identification of the Brandt (Hecke) data with the Frobenius data of X_N/F_ℓ is checked exactly in §9.5. For
X₀(11) = 11a1, the direct point counts #X₀(11)(F_{ℓ^k}), ℓ = 2, 3, k ≤ 4, equal ℓ^k + 1 − (Brandt power sums) in all
8 cases.

*Consequence.* The tower's Hodge index acts one prime at a time, through the local Frobenius (characteristic p) or its
real part T_p (characteristic 0). Different primes compose additively in the logarithm (T_pT_q = T_{pq}), so no form in
the tower couples the delays log p and log q through log(p/q). That difference is where the ζ Weil kernel has its
archimedean term k(|log(p/q)|).

### 4.5 (C5) The archimedean continuum

**Proposition 4.8 (irrational scalings are not correspondences) [P-L].** For a > 0, the image of {(z, az) : z ∈ H} in
S_N(C) lies on an algebraic curve if and only if a ∈ Q_{>0}. For a ∉ Q its closure is all of S_N(C).

*Proof.*

1. The image lies on an algebraic correspondence if and only if diag(a, 1) commensurates Γ₀(N).
2. The commensurator of Γ₀(N) in PGL₂⁺(R) is PGL₂⁺(Q) [L: classical for arithmetic lattices; Margulis], and
   diag(a, 1) ∈ R^× · GL₂⁺(Q) if and only if a ∈ Q^×.
3. Now let a ∉ Q, put δ = diag(a^{1/2}, a^{−1/2}), and consider the twisted diagonal Δ_δ = {(g, δgδ^{−1})} acting on
   (Γ × Γ)\(SL₂(R) × SL₂(R)). By Ratner's theorem [L] the closure of a Δ_δ-orbit is the orbit of a closed connected
   subgroup containing Δ_δ.
4. Δ_δ is a maximal connected subgroup, because sl₂ ⊕ sl₂ is the sum of Δ(sl₂) and an irreducible Δ-module. Its orbit is
   closed if and only if δ commensurates Γ.
5. So for a ∉ Q the closure is everything, and projecting to S_N(C) gives density. ∎

So the classes D_F, whose test functions F ∈ C_c²(R) have continuous support, have no algebraic representatives. The
archimedean continuum has to enter through archimedean classes: Green currents, i.e. the Dirichlet-energy part of round-1
Theorem 3.4 (§5–§6). On functions on X_N(C) the scaling can be realized in only two ways. One is Hecke-type averaging,
which is self-adjoint and excluded by Theorem 4.6 (see §5.3). The other is the geodesic flow on the unit tangent bundle.

**Proposition 4.9 (the archimedean scaling flow has Lebesgue spectrum) [P-L; restated in revision 2].** The scaling
z ↦ e^u z lifts to the right action of a_u = diag(e^{u/2}, e^{−u/2}) on Y_N := Γ₀(N)\SL₂(R), i.e. the geodesic flow. On
L²_0(Y_N), the orthocomplement of the constants, the restriction to A = {a_u} is a multiple of the regular representation
of A ≅ R. Consequently, for every ξ ∈ L²_0(Y_N), and more generally for every distribution vector ξ with
a(Φ)ξ := ∫Φ(u) a_u ξ du ∈ L²_0(Y_N) for all Φ ∈ C_c^∞(R), the positive form Φ ↦ ‖a(Φ)ξ‖² has an absolutely continuous
spectral measure: ‖a(Φ)ξ‖² = ∫|Φ̂(t)|² m_ξ(t) dt with 0 ≤ m_ξ ∈ L¹_loc. Under RH the Weil form
W(Φ ⋆ Φ*) = Σ_ρ |Φ̂(γ_ρ)|² (Φ*(u) = conj Φ(−u)) has a purely atomic spectral measure, so W(Φ ⋆ Φ*) ≠ ‖a(Φ)ξ‖² for every
such ξ and every N. Without RH the Weil form is not positive and the inequality is immediate.

(Revision 1 stated the consequence as "W is not a matrix coefficient ⟨a_u ξ, ξ⟩ of any ξ ∈ L²_0". That is true for a
trivial reason: W has point masses at ±log n, and a matrix coefficient is a continuous function. The form version above
is the meaningful statement, and it covers distribution vectors, which is how the zeros enter in the adelic picture.)

*Proof.*

1. L²_0(Y_N) decomposes into irreducible unitary representations of SL₂(R) with no invariant vectors: principal series
   (Maass forms, and the Eisenstein series as a direct integral), discrete series (holomorphic forms), and possibly
   complementary series.
2. Each restricts to A = {a_u} as a multiple of the regular representation of A ≅ R. In the line model of the principal
   series, a_u acts by dilation on L²(R_+) ⊕ L²(R_−). Discrete series have a model on L²(R_+) with the same dilation
   action. For complementary series, the Mellin transform diagonalizes dilations with a positive weight. [L: e.g. Lang,
   *SL₂(R)*; equivalently, the geodesic flow of a finite-volume hyperbolic surface has countable Lebesgue spectrum on
   L²_0.]
3. In the resulting spectral model L²_0(Y_N)|_A ≅ L²(R, dt; 𝒦), a(Φ) is multiplication by Φ̂(t). A distribution vector ξ
   is a 𝒦-valued distribution ξ̃ with Φ̂ξ̃ ∈ L² for all Φ ∈ C_c^∞. Given a compact interval I, take φ ≥ 0 even, supported
   in [−δ, δ] with δ < π/(2 max_I |t|); then φ̂(t) = ∫φ(u)cos(tu)du > 0 on I, and Φ := φ ⋆ φ* has Φ̂ = φ̂² > 0 on I. So
   ξ̃ = Φ̂^{−1}(Φ̂ξ̃) ∈ L²(I; 𝒦), i.e. ξ̃ ∈ L²_loc, and ‖a(Φ)ξ‖² = ∫|Φ̂|² ‖ξ̃(t)‖² dt.
4. If W(Φ ⋆ Φ*) = ∫|Φ̂|² m_ξ for all Φ ∈ C_c^∞, polarization and the density of Fourier transforms of C_c^∞ functions in
   the Schwartz space give Σ_ρ δ_{γ_ρ} = m_ξ dt as distributions (under RH). An atomic measure is not absolutely
   continuous, and ζ has zeros. Contradiction. ∎ [R]

**Remark 4.10 (all places of the adelic tower) [P-L for each local statement; A for the global assembly].** In
GL₂(Q)\GL₂(A)/Z(R)⁺ the ideles act by right translation through a ↦ diag(a, 1).

* **Local statement [L].** Every infinite-dimensional irreducible unitary representation π_v of GL₂(Q_v) restricts to
  the mirabolic subgroup as the representation on L²(Q_v^×, d^×x) (Kirillov model), where diag(a, 1) acts by dilation.
  This is the regular representation of Q_v^×, with absolutely continuous spectrum.
* **Atoms.** The one-dimensional constituents χ∘det (the residual spectrum; χ of finite order after the central
  quotient) give the only atoms, at finite-order characters. These are the pole terms.
* **Global statement [A].** The scaling spectrum of the whole tower is absolutely continuous except at finite-order
  characters, so the zero ordinates γ_ρ ≠ 0 are never eigenvalues. The assembly for non-factorizable vectors (a
  Kakutani-type product argument) is not written out.
* **Where ζ does appear.** ζ enters as the value of a torus period, e.g. Hecke's integral of an Eisenstein series along
  diag(a, 1), which gives ζ(s + s₀ − ½)ζ(s − s₀ + ½)/ζ(2s₀) up to Γ-factors. This is a linear functional, not a positive
  form, and the zeros of ζ are its zeros, not eigenvalues of anything.

### 4.6 (C6) The even picture, and exact equivariance through algebraic operators (revision 2)

Theorem 4.6 concerns translations τ_aF := F(· − a). For the Weil form a translation is unitary and not self-adjoint
(w(τ_aF) = w(F)), while the canonical correspondences of the tower are self-adjoint. The Weil-side operation that matches
a self-adjoint correspondence is the symmetric shift

    S_aF := ½ (F(· − a) + F(· + a)),      S_p := S_{log p},

acting on the even test functions E := {F ∈ 𝒜 : F(−u) = F(u)}. For F ∈ E, F̂ is even, real on R and on iR, and
(S_aF)^(z) = cos(az) F̂(z). Write t_p := (2√p)^{−1} T_p for p ∤ N; its eigenvalues on H¹(X_N) are a_f(p)/(2√p) ∈ [−1, 1]
(Deligne's theorem, which for weight 2 is Weil's theorem for X_N/F_p through Eichler–Shimura). This section shows that
the contradiction of Theorem 4.6 disappears in the even picture (Proposition 4.12) and replaces it by an arithmetic
obstruction that holds in both pictures for every family of operators with algebraic eigenvalues (Theorem 4.13).

**Lemma 4.11 (the even sector) [P; (iii) A].**

* (i) For real F with even and odd parts F_e, F_o: w(F) = w(F_e) + w(F_o).
* (ii) For F ∈ E: w(F) = Σ_ρ F̂(γ_ρ)². An on-line zero contributes F̂(γ_ρ)² ≥ 0. A real zero ρ ∈ (0, 1), if there were
  one, would have γ_ρ = ib ∈ iR and contribute F̂(ib)² = (∫F(u) cosh(bu) du)² ≥ 0. The poles s = 0, 1 sit at γ = ±i/2 and
  enter the explicit formula as d(F ⋆ F̌) + d′(F ⋆ F̌) = 2(∫F(u) cosh(u/2) du)² ≥ 0: the hyperbolic plane ⟨H, V⟩. A
  quadruple {±w, ±w̄} of non-real off-line zeros contributes 4 Re[F̂(w)²], which has no sign.
* (iii) [A] If w(F) ≥ 0 for every F ∈ E, then ζ has no non-real zero off the line. (Sketch: Weil's argument with
  F(u) = h(u − L) + h(−u − L), L → ∞, phase-tuned to one off-line quadruple; controlling all other off-line quadruples at
  once is not written out.) Together with the classical fact that ζ has no zero in (0, 1) (ζ(σ) = −(2^{1−σ} − 1)^{−1}
  η(σ) with η(σ) = Σ_{n≥1} (−1)^{n−1} n^{−σ} > 0), this would give RH. Not used below.

*Proof.* (i) For real F, (F ⋆ F̌)^(z) = F̂(z) F̂(−z), and with F̂ = F̂_e + F̂_o (even plus odd) this is F̂_e(z)² − F̂_o(z)²;
summing over the zeros gives w(F_e) + w(F_o), the cross terms cancelling. (ii) For F ∈ E, F̂(−z) = F̂(z); F̂ is real on R
and on iR because F is real and even; d(F) = d′(F) = ∫F cosh(u/2) for even F, and d(F ⋆ F̌) = d(F) d′(F) (round-1
Theorem 2.1). ∎

*Reading.* In the even picture every parameter γ ∈ R ∪ iR contributes positively: the line and the imaginary axis. The
poles and any real zero are of the second kind. This is Proposition 4.7 again: Hecke (Toeplitz + Hankel) positivity at
one prime is the even form at one prime, and it does not see a real Frobenius ghost b > 1. Here the even form does not
see real (Landau–Siegel type) zeros, which ζ excludes by the separate elementary argument in (iii).

**Proposition 4.12 (the even picture admits self-adjoint scaling) [P].** For F, G ∈ 𝒜 and a ∈ R,
W(S_aF ⋆ Ǧ) = W(F ⋆ (S_aG)ˇ). Hence if (L_N, c_N) satisfies (Rep) on E and is equivariant via Rosati-self-adjoint C_N
(γ_{L_N D_{S_pF}} = C_N γ_{L_N D_F}), the identities of Theorem 4.6, Step 2 become w(S_pF) = W(F ⋆ (S_p²F)ˇ), and both
sides equal Σ_ρ cos²(γ_ρ log p) F̂(γ_ρ)² for every F ∈ E. Theorem 4.6 has no analogue in the even picture. Under RH,
F ↦ (F̂(γ))_{γ>0} embeds (E, w) isometrically in a weighted ℓ²(positive zero ordinates), and S_p acts there by
multiplication by cos(γ log p): a commuting family of self-adjoint contractions, of the same kind as the t_p on H¹(X_N).

*Proof.* (τ_aF) ⋆ Ǧ = τ_a(F ⋆ Ǧ) and F ⋆ (τ_aG)ˇ = τ_{−a}(F ⋆ Ǧ), so S_aF ⋆ Ǧ = S_a(F ⋆ Ǧ) = F ⋆ (S_aG)ˇ. The zero-side
values use (S_aF)^ = cos(a ·) F̂ and F̂(−γ) = F̂(γ). ∎

So the even picture is the natural home of a Hecke dictionary, and the obstruction has to come from somewhere else. It
comes from transcendence.

**Theorem 4.13 (exact equivariance sees only Tate characters) [P-L].** Let E₀ be either

* (T) 𝒜, with σ_pF := τ_{log p}F = F(· − log p), or
* (S) E, with σ_p := S_p,

topologized as the inductive limit of the Banach spaces E₀ ∩ C²_c([−R, R]). Let V be a finite-dimensional complex vector
space, Θ : E₀ → V linear and continuous, p₁, p₂, p₃ distinct primes, and C₁, C₂, C₃ ∈ End V with

    (Eq)   Θ(σ_{p_j} F) = C_j Θ(F)      for all F ∈ E₀ and j = 1, 2, 3.

Assume the eigenvalues of each C_j on U := Θ(E₀) are algebraic numbers. Then:

* (a) every joint eigenvalue triple c = (c₁, c₂, c₃) of (C_j|_U) is of Tate type: there is one λ ∈ Q with
  c_j = p_j^λ (j = 1, 2, 3) in case (T), resp. c_j = cosh(λ log p_j) in case (S);
* (b) Θ(F) is a linear function of finitely many moments m_{k,λ}(F) = ∫F(x) x^k e^{λx} dx with λ ∈ Q and
  0 ≤ k < 2 dim V (k < dim V in case (T)).

*Proof.*

1. *Commutation.* The σ_{p_j} commute, so C_iC_jΘ(F) = Θ(σ_{p_i}σ_{p_j}F) = C_jC_iΘ(F): the C_j commute on U, which is
   C_j-invariant by (Eq). Let U = ⊕_c U_c be the decomposition into joint generalized eigenspaces.
2. *Eigenfunctionals.* Fix c with U_c ≠ 0. The transposes C_j^t commute on U_c^*, so they have a common eigenvector λ*,
   with eigenvalues c_j. Extend λ* by zero on the other U_{c′}. Then λ*∘C_j = c_j λ* on U, and ℓ := λ*∘Θ is a nonzero
   continuous linear functional on E₀ with ℓ(σ_{p_j}F) = c_j ℓ(F).
3. *Distribution.* Extend ℓ complex-linearly; in case (S) extend it to all test functions by ℓ(F) := ℓ(½(F + F̌)), which
   commutes with S_a since (S_aF)ˇ = S_a(F̌). Then ℓ ∈ D′(R), ℓ ≠ 0, and ℓ(· + log p_j) = c_j ℓ in case (T), resp.
   S_{p_j} ℓ = c_j ℓ in case (S) (S_a is its own transpose).
4. *Mollification.* Choose ψ ∈ C_c^∞ with u := ℓ ∗ ψ ≠ 0. Then u ∈ C^∞(R) satisfies the same three difference equations,
   because convolution commutes with translations.
5. *Spectral synthesis.* Let 𝒱 be the closed translation-invariant subspace of C(R) (compact-open topology) generated by
   u. Convolution with μ_j := δ_{−log p_j} − c_j δ₀ (case T), resp. μ_j := ½(δ_{log p_j} + δ_{−log p_j}) − c_j δ₀ (case
   S), is continuous on C(R), commutes with translations and kills u, so it kills 𝒱. By L. Schwartz's theorem on
   mean-periodic functions [L], 𝒱 ≠ 0 is the closed span of the exponential monomials x^k e^{λx} it contains, so it
   contains one, and then (taking k-fold differences of translates) it contains e^{λx}. Now μ_j ∗ e^{λx} = 0 gives
   p_j^λ = c_j (case T), resp. cosh(λ log p_j) = c_j (case S).
6. *Six exponentials.* In both cases p_j^λ is algebraic (in case (S) it is a root of X² − 2c_jX + 1). If λ ∉ Q, the sets
   {1, λ} and {log p₁, log p₂, log p₃} are each linearly independent over Q, and the six exponentials theorem [L: Lang
   1966; Ramachandra 1968] says that one of the six numbers p_j = e^{1·log p_j}, p_j^λ = e^{λ log p_j} is transcendental.
   They are all algebraic, so λ ∈ Q. This proves (a).
7. *(b).* For an arbitrary λ* ∈ U_c^*, the functional λ*∘Θ is killed by (σ_{p_j} − c_j)^{dim V} for each j. Steps 3–5
   applied to μ_j^{∗ dim V} show that every mollification of its distribution lies in the span of the x^k e^{λx} with λ
   in the common zero set of the μ̂_j and k smaller than dim V times the order of that zero (order 1 in case (T); order ≤ 2
   in case (S), with 2 only when c_j = ±1). By step 6 the common zero set is contained in Q, and it is finite (in case
   (T) λ is fixed by p₁^λ = c₁ with λ real; in case (S) by cosh(λ log p₁) = c₁, up to sign). A distribution all of whose
   mollifications lie in one finite-dimensional space of smooth functions lies in that space (let the mollifier tend to
   δ). The functionals λ*∘Θ, λ* ∈ U^*, determine Θ(F). ∎

*Remarks.*

* Three primes are needed. With two primes, step 6 would need the four exponentials conjecture, which is open. With one
  prime there is no obstruction: q^λ = β has the solution λ = log β / log q for every algebraic β ≠ 0. That is route 27:
  the eigenvalues β of q^{−1/2}F on H¹(C) are algebraic and the zeros of ζ_C are at s = ½ + log β / log q. Route 27's
  obstruction O2 ("the log p are Q-linearly independent, no single Frobenius") is, in this precise sense, a
  transcendence statement.
* Continuity is used in step 3. Every explicit construction (sampling F at log n, integrating F against kernels,
  compositions of these) is continuous; a discontinuous Θ needs a Hamel basis.
* The theorem uses neither positivity nor (Rep) nor the level N. Its content: the joint eigencharacters that operators
  with algebraic eigenvalues can carry equivariantly are x ↦ e^{λx} with λ ∈ Q, i.e. parameters γ = −iλ ∈ iQ. For ζ the
  relevant ones are λ = ±½, the poles.
* V can be NS(Y)_C for any smooth projective Y over any field, with C_j algebraic correspondences acting by composition.
  For divisorial correspondences on a product of curves the characteristic polynomials on H¹ lie in Q[x] (elements of
  End⁰ of a Jacobian), so the hypothesis holds. The theorem is not specific to modular curves.
* Exactness matters. For f = 11a1 (a₂ = −2, a₃ = −1, a₅ = 1) the Kronecker curve z ↦ (cos(z log p))_{p=2,3,5} comes
  within 0.0101 of (a_p/(2√p))_p for some z ≤ 10⁴ [M, §9.6 R5], and it comes arbitrarily close as z grows; by step 6 it
  never hits the point. Approximate equivariance is Proposition 4.15.

**Corollary 4.14 (in the modular tower only the pole functionals survive) [P-L].** Fix N.

* (i) *Symmetric shifts, Hecke operators.* Let p₁, p₂, p₃ ∤ N be distinct primes and F ↦ L_N(D_F) ∈ NS(S_N)_C (F ∈ E)
  linear, continuous, and equivariant: L_N(D_{S_{p_j}F}) = t_{p_j} ∘ L_N(D_F), with ∘ the composition of correspondences.
  Then L_N(D_F) = d(F)(κ₁H + κ₂V) for constants κ₁, κ₂. In particular P(L_N D_F) = 0 for every F.
* (ii) *Translations, U-operators.* Let ℓ₁, ℓ₂, ℓ₃ be distinct primes dividing N and F ↦ L_N(D_F) (F ∈ 𝒜) linear,
  continuous, and equivariant: L_N(D_{τ_{log ℓ_j}F}) = (ℓ_j^{−1/2}U_{ℓ_j}) ∘ L_N(D_F). Then L_N(D_F) depends on F only
  through d(F) and d′(F).

In both cases −P(L_N D_F)² = q_N(d(F), d′(F)) for a quadratic form q_N on R² (q_N = 0 in case (i)), and (Rep) fails.
(Rep) asks c_N^{−1} q_N(d(F), d′(F)) → w(F) for every F; applied to three test functions with (d, d′) = (1, 0), (0, 1),
(1, 1) it forces the coefficients of c_N^{−1}q_N to converge, so w(F) = q_∞(d(F), d′(F)) for every F and a fixed
quadratic form q_∞. Along the narrow bumps F_ε of Lemma 4.2(b), d(F_ε) and d′(F_ε) are O(ε^{1/2}), so the right side is
O(ε), while w(F_ε) = log(1/ε) + O(1) → ∞ (Lemma 4.6.1). Case (i) also recovers round 1's degree D_F·H = D_F·V = d(F)
(for even F) as the only equivariant choice: equivariance determines the pole terms and nothing else.

*Proof.* (i) Left composition with T_p preserves the decomposition NS(S_N)_C = CH ⊕ CV ⊕ End⁰(J_N)_C: T_p ∘ (X × {x}) =
X × T_p(x) ≡ (p + 1)H, similarly T_p ∘ V ≡ (p + 1)V, and on primitive classes γ_{T_p∘D} = T_p γ_D. So t_p acts on H and V
by (p + 1)/(2√p) = cosh(½ log p), and on End⁰(J_N)_C by left multiplication, with eigenvalues a_f(p)/(2√p) for the
newforms f of level dividing N. All are algebraic. By Deligne's theorem and a_f(p)² ≠ 4p for weight 2 [L:
Coleman–Edixhoven 1998; for all but finitely many p this is elementary, since a_f(p) = ±2√p would put √p in the
coefficient field of f], every cuspidal eigenvalue lies in (−1, 1), while a Tate value cosh(λ log p) is ≥ 1, and
cosh(½ log p) is not a cuspidal eigenvalue. By Theorem 4.13(a), case (S), L_N(D_F) lies in the λ = ±½ eigenspace CH ⊕ CV,
on which each t_{p_j} is the scalar cosh(½ log p_j). The coefficients of H and V are then continuous joint
eigenfunctionals with eigenvalues cosh(½ log p_j); by steps 3–6 their distributions are combinations of e^{x/2} and
e^{−x/2} (simple roots, so no x e^{±x/2}), which on even F both give d(F).
(ii) U_ℓ (ℓ | N) is a correspondence of bidegree (ℓ, ℓ): the two coset counts of Γ₀(N) diag(1, ℓ) Γ₀(N) are
[Γ₀(N) : Γ₀(Nℓ)] = ℓ and [Γ₀(N) : Γ₀(N) ∩ Γ⁰(ℓ)] = ℓ (mod ℓ, Γ₀(N) reduces to the upper triangular group, in which the
diagonal torus has index ℓ). Left composition with ℓ^{−1/2}U_ℓ acts on H and V by ℓ^{1/2} (λ = ½), and on End⁰(J_N)_C by
left multiplication, with eigenvalues: α_f(ℓ)/√ℓ and β_f(ℓ)/√ℓ on ℓ-old forms (modulus 1, not real, since
a_f(ℓ)² < 4ℓ [Coleman–Edixhoven]); 0 on forms new at ℓ with ℓ² | N; and −ε_ℓ(f)ℓ^{−1/2} = ±ℓ^{−1/2} on forms new at ℓ
with ℓ ∥ N (ε_ℓ the Atkin–Lehner sign). Tate type in case (T) means c_j = ℓ_j^λ > 0, λ ∈ Q. The only Tate values present
are ℓ^{1/2} (λ = ½, on H and V) and +ℓ^{−1/2} (λ = −½, on forms with a_f(ℓ_j) = +1 for all three j), with no Jordan
blocks. By Theorem 4.13(b) with k = 0, L_N(D_F) is a linear function of ∫F e^{x/2} = d(F) and ∫F e^{−x/2} = d′(F). ∎

**Proposition 4.15 (asymptotic equivariance: a Hecke dictionary exists if and only if RH holds) [P-L; (ii) uses
Lemma 4.11(iii), A].** Take N prime and dictionaries on E of the form L_N(D_F) = (degree part) + P(Θ_N(F)) with
Θ_N(F) ∈ 𝕋_N ⊗ R ⊂ End⁰(J_N)_R. Call (L_N, c_N) *asymptotically Hecke-equivariant* if
c_N^{−1} ‖Θ_N(S_pF) − t_pΘ_N(F)‖² → 0 for every F ∈ E and every prime p, with ‖γ‖² = Tr(γγ^† | H¹).

* (i) If RH holds, there is an asymptotically Hecke-equivariant sequence satisfying (Rep) on E.
* (ii) Conversely, (Rep) on E gives w ≥ 0 on E (Lemma 2.1(ii)), hence RH by Lemma 4.11(iii) [A].
* (iii) In any such sequence the joint spectral measures ν_{N,F} of (t_p)_p at Θ_N(F) (positive measures on the cube
  [−1, 1]^{primes}, by Deligne) converge weakly, after division by c_N, to a positive measure with moments
  Σ_ρ Kron(γ_ρ)^α F̂(γ_ρ)², where Kron(γ) := (cos(γ log p))_p. Under RH the limit is Σ_ρ F̂(γ_ρ)² δ_{Kron(γ_ρ)}. The point
  Kron(γ) is the Satake parameter of the unitary Eisenstein series E(·, ½ + iγ), whose Hecke eigenvalues are
  p^{iγ} + p^{−iγ} = 2cos(γ log p) and whose L-function is ζ(s + iγ) ζ(s − iγ).

*Proof.* (i) Under RH, w(F) = 2 Σ_k F̂(γ_k)² for F ∈ E, over the positive ordinates 0 < γ₁ ≤ γ₂ ≤ … with multiplicity.
Proposition 4.1 (all moments of the Hecke eigenvalue distribution converge to the Plancherel moments) and compactness of
the cube give joint equidistribution of (a_f(p)/(2√p))_{p≤P} with respect to ⊗_{p≤P} μ_p as N → ∞ through primes [also
L: Serre 1997; Conrey–Duke–Farmer 1997]. Each p-adic Plancherel measure μ_p has a positive density on (−1, 1), so for
given P, δ > 0, K ≥ 1 and N large there are distinct newforms f₁, …, f_K of level N with
|a_{f_k}(p)/(2√p) − cos(γ_k log p)| < δ for all p ≤ P and k ≤ K. Choose P(N), K(N) → ∞ and δ(N) → 0 slowly, let
e_k ∈ 𝕋_N ⊗ R be the idempotent of f_k normalized by Tr(e_k e_k^† | H¹) = 2, and put
Θ_N(F) := c_N^{1/2} Σ_{k ≤ K(N)} F̂(γ_k) e_k. Then c_N^{−1}·(−P(Θ_N(F))²) = 2 Σ_{k≤K(N)} F̂(γ_k)² → w(F), and for p ≤ P(N),
c_N^{−1} ‖Θ_N(S_pF) − t_pΘ_N(F)‖² = 2 Σ_k F̂(γ_k)² (cos(γ_k log p) − a_{f_k}(p)/(2√p))² ≤ δ(N)² w(F).
(ii) As stated. (iii) By asymptotic equivariance and polarization of (Rep), the moments
c_N^{−1} Tr(t^α Θ_N(F) Θ_N(F)^†) converge to W(S^αF ⋆ F̌) = Σ_ρ Kron(γ_ρ)^α F̂(γ_ρ)² for every finite multi-index α; the
cube is compact, so the measures converge weakly to a positive measure with these moments. The Eisenstein eigenvalues are
classical [L: Iwaniec, *Spectral methods*, Ch. 3, 8]. ∎

*Reading.* For an off-line zero, γ = γ₀ − ib with b ≠ 0, cos(γ log p) = cos(γ₀ log p) cosh(b log p) +
i sin(γ₀ log p) sinh(b log p) is not real for every p with sin(γ₀ log p) ≠ 0 (all p but at most one), and a real zero
would give cosh(b log p) > 1. So RH says exactly that the Satake parameters Kron(γ_ρ) of all zeros lie in the Ramanujan
cube, i.e. that the Eisenstein parameters E(·, ½ + iγ_ρ) attached to the zeros are tempered. The tower's positivity in
characteristic p (Deligne, i.e. Hodge index on (X_N/F_p)²) says that cusp forms are tempered. The two statements have
the same shape, and the tower is generous: its Hecke points fill the cube. What it does not supply is the map ρ ↦ (f_k)
in the proof of (i), which reads the zeros off ζ and picks cusp forms at the right Satake points. §6.5 lists where the
zeros do occur in the tower; none of these places is a cusp form. [M, §9.6 R6: for prime levels ≤ 251 the nearest Hecke
point (a_f(2)/(2√2), a_f(3)/(2√3)) to Kron(γ_k), k = 1..5, is at sup-distance 0.017–0.070 at the best level and
0.115–0.227 at level 251. The forms are found by looking at the zeros.]

---

## 5. The arithmetic tower (Faltings–Hriljac)

### 5.1 The pairing at each level

At each level, by round-1 Theorem 3.4 and Faltings–Hriljac, the arithmetic intersection pairing on Ĉh¹(𝒳_N)_R splits into
four pieces:

* the hyperbolic (degree) part;
* the vertical components, which are negative by Zariski's lemma;
* −ĥ_NT on J_N(K) ⊗ R;
* the archimedean Dirichlet energy −½E.

The Hecke algebra acts on J_N(K) ⊗ Q through 𝕋, which acts on Lie J_N = S₂(Γ₀(N))^∨. So J_N(K) ⊗ C decomposes by
cuspidal eigencharacters. Cuspidal divisor classes are torsion (Manin–Drinfeld) [L], so χ_Eis does not occur in
J_N(K) ⊗ R. By Gross–Zagier, the f-component of a Heegner divisor has ĥ_NT proportional to L′(f, 1)L(f, χ_D, 1) [L].
**So the finite-rank part of the arithmetic Hodge index is cuspidal, as in Theorem 4.5.**

### 5.2 Where ζ appears in arithmetic intersection numbers on 𝒳_N

* **(A) Degrees.** ζ enters through the Eisenstein character, i.e. the degrees: Lemma 4.3, rank ≤ 2.
* **(B1) Archimedean continuous spectrum.** The hyperbolic Green function has the spectral expansion
  g(z, w) = Σ_j u_j(z)u_j(w)/λ_j + (1/4π) Σ_𝔞 ∫ E_𝔞(z, ½+it) \overline{E_𝔞(w, ½+it)} (¼ + t²)^{−1} dt
  [L: Iwaniec, *Spectral methods*, Ch. 7, after removing the constant eigenfunction]. Write E = E*/ξ*(2s). The
  continuous density then carries 1/|ξ*(1 + 2it)|², i.e. ζ on the line Re s = 1. This density is positive for every
  configuration of zeros. The zeros are the poles of its continuation, at t = γ/2 ± i(1 − β)/2.
* **(B2) CM periods.** Hecke and Zagier give Σ_{τ ∈ Λ_D} E(τ, s) = c_D |D|^{s/2} ζ(s) L(s, χ_D)/ζ(2s) [L: Zagier 1981].
  So for a degree-0 combination of Heegner divisors, the continuous part of its archimedean Green energy is a weighted
  mean square of ζ(½ + it) times twisted Dirichlet L-values on the critical line, divided by |ζ(1 + 2it)|². Faltings–
  Hriljac writes ĥ_NT as finite parts plus this energy, so positivity of ĥ_NT yields at most a mean-value inequality for
  |ζ(½ + it) L(½ + it, χ_D)|² [A: the bookkeeping of the regularized diagonal terms and of the finite parts is not
  carried out]. Mean-square premises on the critical line are limited by MV-CAP (wall 4) and are not known to
  distinguish on-line from off-line zeros. **This is the closest contact between the tower's positivity and ζ found
  here.**
* **(C) Special values.** These occur as constants: the Kronecker limit constant of the regularized Green function
  (γ, log 2, ζ′(2)/ζ(2), over π; Theorem 6.1(iii)); the self-intersection ω̂² of X₀(N) (≈ 3g_N log N; Abbes–Ullmo, Michel–Ullmo); the
  Bost–Kühn value for X(1), which involves ζ(−1) and ζ′(−1); the component group at N, of order the numerator of
  (N − 1)/12 (Mazur; ζ(−1) = −1/12) [L]. These are numbers, not zero locations.

### 5.3 Theorem 4.6 for the arithmetic pairing [P-L, with one A]

The Hecke correspondences T_n, (n, N) = 1, are self-adjoint for (·,·)_Ar, because T_n^t = T_n. On archimedean classes T_n
acts on functions on X_N(C) and commutes with Δ, so it is self-adjoint for E. The proof of Theorem 4.6 uses only (Rep),
here in the form of Theorem 3.1′, and self-adjointness, so it applies verbatim. [A: compatibility of the Hecke action with
the vertical corrections Φ(D) at p | N is not checked; restricting to classes supported away from the bad fibres avoids
it.]

*Revision 2: Theorem 4.13 for the arithmetic pairing [P-L].* Theorem 4.13 needs only finite dimension and algebraic
eigenvalues, so it applies to the finite-rank part of Ĉh¹(𝒳_N)_R: the degrees; the vertical components, on which the T_n
act through their degree (the Eisenstein ideal [L: Mazur 1977]), i.e. with Tate eigenvalue σ₁(p); and J_N(K) ⊗ R, on
which they act through 𝕋 with eigenvalues a_f(p). An exactly equivariant dictionary into this part is therefore a function
of the pole functionals, as in Corollary 4.14. The archimedean part a(A^{0,0}(X_N(C))) is infinite-dimensional, the T_n
have continuous spectrum there, and Theorem 4.13 does not apply; it is treated in §6.5.

---

## 6. The archimedean (Green-function) terms

### 6.1 Setup

* **Resolvent.** For Re s > 1, z, w ∈ H and N = p prime, put G_{p,s}(z, w) := Σ_{γ ∈ Γ₀(p)/{±1}} g_s(z, γw), with
  g_s(z, w) := (1/2π) Q_{s−1}(cosh d(z, w)). This is the kernel of (−Δ − s(1−s))^{−1} on Γ₀(p)\H with respect to
  dμ = dx dy/y².
* **Cusp cylinder.** G_cyl,s(z, w) := Σ_{b ∈ Z} g_s(z, w + b)
  = y_<^s y_>^{1−s}/(2s − 1) + Σ_{n ≠ 0} e^{2πin(x_z − x_w)} √(y_z y_w) I_{s−½}(2π|n|y_<) K_{s−½}(2π|n|y_>).
  The Fourier form follows from the mode-by-mode ODE with jump −1. The two expressions agree to ≤ 3.4·10⁻²⁸ in §9.3
  (G0), which fixes the normalization.
* **Arakelov point.** The regularized Green function at s = 1 is
  g_p(z, w) := lim_{s→1} [G_{p,s}(z, w) − 1/(vol_p s(s−1))], with vol_p = π(p + 1)/3. This is the hyperbolic Green
  function used in arithmetic intersection theory with the log-singular hyperbolic metric [L: Kühn 2001]. The canonical
  Arakelov Green function differs from it by terms h(z) + h(w) + c_p, which cancel on degree-0 divisors [L: Abbes–Ullmo
  1997; Jorgenson–Kramer 2006].
* **Eisenstein series.** E^{(p)}_∞(w, s) := Σ_{γ ∈ Γ_∞\Γ₀(p)} Im(γw)^s.

### Theorem 6.1 (convergence of the archimedean terms) [P-L; checked M]

Let p be prime and z, w ∈ H with p² y_z y_w ≥ 2.

* **(i)** For Re s > 1,

      G_{p,s}(z, w) − G_cyl,s(z, w) = y_z^{1−s} (E^{(p)}_∞(w, s) − y_w^s)/(2s − 1) + R_{p,s}(z, w),

  with |R_{p,s}| ≤ C_s(z) e^{−π y_z} (E^{(p)}_∞(w, σ) − y_w^σ), where σ = Re s.
* **(ii)** E^{(p)}_∞(w, s) − y_w^s = φ^{(p)}(s) y_w^{1−s} + (non-constant Fourier terms, O(p^{−2σ} e^{−2π y_w}) for fixed
  w), where

      φ^{(p)}(s) := φ_{∞∞}^{(p)}(s) = (√π Γ(s−½)/Γ(s)) Σ_{c > 0, p | c} φ(c) c^{−2s}
                 = (√π Γ(s−½)/Γ(s)) · (ζ(2s−1)/ζ(2s)) · (p − 1)/(p^{2s} − 1)
                 = φ(s) · (p − 1)/(p^{2s} − 1).

  So G_{p,s} − G_cyl,s = (y_z y_w)^{1−s} φ^{(p)}(s)/(2s − 1) · (1 + O(e^{−π min(y_z, y_w)})) = O(p^{1−2σ}).
* **(iii)** At s = 1, write φ(s) = 3/(π(s−1)) + C_0 + O(s − 1). C_0 is the Kronecker-limit constant,
  C_0 = (6/π)(γ − log 2 − ζ′(2)/ζ(2)) = 0.8671324277 [P, R: from ζ(1 + 2ε) = 1/(2ε) + γ + O(ε),
  √π Γ(½ + ε)/Γ(1 + ε) = π(1 − 2ε log 2 + O(ε²)) and 1/ζ(2 + 2ε) = (6/π²)(1 − 2ε ζ′(2)/ζ(2) + O(ε²)); checked
  numerically, §9.6 R2. Revision 1 listed log π among its ingredients; it does not occur in this form]. Then

      g_p(z, w) − G_cyl,1(z, w) = (p + 1)^{−1} [C_0 − (3/π)(log(y_z y_w) + 1 + 2p² log p/(p² − 1))]
                                   + O_{z,w}(e^{−π min(y_z,y_w)}/p)  =  O((log p)/p).
* **(iv)** Hecke translates. For (m, p) = 1, the cosets Γ₀(p)\R_p(m), with R_p(m) = {γ ∈ M₂(Z): det γ = m, p | c}, are
  represented by δ = (a b; 0 d) with ad = m and 0 ≤ b < d [L]. So Σ_{γ ∈ R_p(m)/±1} g_s(z, γw) = Σ_δ G_{p,s}(z, δw),
  which tends to Σ_δ G_cyl,s(z, δw). The zero mode of the limit is Σ_{ad=m} d (y_<^s y_>^{1−s})/(2s − 1) at
  (y_z, a y_w/d). For y_z ≥ m y_w it equals y_z^{1−s} y_w^s m^s σ_{1−2s}(m)/(2s − 1). Its Dirichlet series
  Σ_m m^s σ_{1−2s}(m) m^{−v} is ζ(v − s)ζ(v + s − 1): Eisenstein type.

*Proof.*

* (i) Unfold Γ₀(p)/{±1} = Γ_∞ × (Γ_∞\Γ₀(p)). This gives G_{p,s} = Σ_{(c,d)} G_cyl,s(z, γ_{c,d} w), summed over bottom
  rows (c, d) with gcd(c, d) = 1 and p | c, modulo ±. The row (0, 1) gives G_cyl,s(z, w).
  * For c ≠ 0, Im(γw) ≤ 1/(c² y_w) ≤ 1/(p² y_w) ≤ y_z/2. So the zero mode of G_cyl,s(z, γw) is
    (Im γw)^s y_z^{1−s}/(2s − 1), and summing over (c, d) gives the displayed term.
  * The nonzero modes are bounded using I_ν(x) ≤ C (x/2)^ν e^x/Γ(ν+1) and K_ν(x) ≤ C e^{−x}(1 + 1/x)^ν. This gives
    Σ_{n≠0} |·| ≤ C (Im γw)^σ e^{−π y_z}, and summing over (c, d) gives the bound on R.
* (ii) For the Fourier expansion of E^{(p)}_∞ see Iwaniec, *Spectral methods*, Ch. 3. The constant term is
  y^s + φ_{∞∞}^{(p)}(s) y^{1−s}
  with the displayed c-sum. The Dirichlet series identity is elementary [P]:
  * the p-part of Σ_c φ(c) c^{−2s} is (1 − p^{−2s})/(1 − p^{1−2s});
  * Σ_{k≥1} φ(p^k) p^{−2ks} = (1 − 1/p) p^{1−2s}/(1 − p^{1−2s});
  * removing the p-part and multiplying gives (ζ(2s−1)/ζ(2s)) (p − 1)/(p^{2s} − 1).

  It is checked by direct summation (G1). The non-constant terms involve Ramanujan sums over c ≡ 0 (mod p), bounded by
  |m| p^{−2σ} ζ(2σ), times K-Bessel decay.
* (iii) Expand at s = 1 + ε:
  * (y_z y_w)^{−ε} = 1 − ε log(y_z y_w) + …;
  * (p − 1)/(p^{2+2ε} − 1) = (p + 1)^{−1} [1 − 2ε p² log p/(p² − 1) + …];
  * 1/(1 + 2ε) = 1 − 2ε + …;
  * 1/((1 + ε)ε) = 1/ε − 1 + ….

  The pole 3/(π(p + 1)ε) cancels the constant-eigenfunction term, and the finite part is the displayed constant. The
  remaining terms have no pole at s = 1 and are O(1/p).
* (iv) By (i)–(iii) applied to the points δw, whose heights a y_w/d do not depend on p. The zero mode is a direct
  computation: Σ_{ad=m} a^s d^{1−s} = m^s σ_{1−2s}(m). ∎

**Measured (§9.3, G2).** At s = 2 and z = 0.17 + 2i, w = −0.31 + 2i, the lattice sum of G_p − G_cyl (rows c ≤ 30p)
matches (y_z y_w)^{−1} φ^{(p)}(2)/3 to a ratio of 0.99962–0.99970 for p = 2, 3, 5, 7, 11, 13, 17, 31, 61. The remaining
3·10⁻⁴ is the predicted truncation tail ≈ 0.3/900. p³ · (G_p − G_cyl) increases to 0.1430 at p = 61; the limit is
(1/4)·φ(2)/3 = 0.14538, with φ(2) = (π/2) ζ(3)/ζ(4) = 1.74458.

### Proposition 6.2 (where the zeros of ζ are in the tower) [P-L; checked M]

* **(i) The scattering coefficient is the atlas §2 bridge at a = ½.** Let X(w) = ξ(½ + w) and R_a(w) = X(w − a)/X(w + a)
  (atlas §1–§2). Then

      φ(s) = √π Γ(s − ½) ζ(2s − 1)/(Γ(s) ζ(2s)) = ξ*(2s − 1)/ξ*(2s) = (s/(s − 1)) · R_{1/2}(2s − 1),

  with ξ*(s) = π^{−s/2}Γ(s/2)ζ(s) = 2ξ(s)/(s(s − 1)). For N = p the ∞∞ entry is φ(s)(p − 1)/(p^{2s} − 1).
  For squarefree N the scattering matrix is φ(s) times a matrix of finite Euler factors at p | N [L: Huxley 1984].
* **(ii) The zeros are resonances.** The poles of φ in 0 < Re s < ½ are at s = ρ/2, the zeros of ξ(2s). They are the
  resonances of every X₀(N), and zeros of the Selberg zeta function of Γ₀(N) through the scattering determinant [L:
  Hejhal; Venkov]. On the unitary line |φ(½ + it)| = 1. At s = 1, φ has the simple pole of the constant eigenfunction.
  [M, G3: |φ(½ + it)| = 1 at t = 0.7, 3.1, 7, 14.13, 21; near ρ_k/2, k = 1, 2, 3, |φ| scales like 1/distance: 50.4,
  5.1·10³, 5.2·10⁵ at distances 10⁻², 10⁻⁴, 10⁻⁶.]
* **(iii) Positivity sees only the edge.** Self-adjointness of Δ on L²(Γ₀(N)\H) makes E(z, s) holomorphic on Re s = ½,
  which forces ζ(1 + 2it) ≠ 0 [L: Sarnak 2004]. Beyond that, the zeros enter the Selberg trace formula of Γ₀(N) only
  through φ′/φ(½ + it). For real t,

      −φ′/φ(½ + it) = 4 Σ_ρ (1 − β)/((1 − β)² + (2t − γ)²) − 4/(1 + 4t²).

  The zero part is a Poisson-smoothed zero count at distance (1 − β)/2. It is positive for every configuration of zeros
  in the open strip, and β changes only its shape. The full density is not positive: −φ′/φ(½) = −3.9076, while its zero
  part is 4 Σ_ρ (½)/(¼ + γ²) = 0.0924 [M]. No positivity statement about these quantities distinguishes β = ½.
* **(iv) The comparison at a = ½ is automatic.** Atlas §2 says |X(w − ½)| < |X(w + ½)| on Re w > 0 ⟺ ½ ≥ Δ, endpoint
  included, and ½ ≥ Δ holds with no zero information. RH needs the comparison at every a > 0. Congruence levels change
  only Euler factors, not the shift. For other groups the intertwining operators pair L(s) with L(s + 1) (Langlands–
  Shahidi), i.e. shift a = ½ again; this is why these methods give non-vanishing on Re s = 1 and nothing inside the
  strip [A].
* **(v) The RH-equivalent statements present in the tower are rate statements.**
  * Resonances on Re s = ¼ ⟺ RH.
  * Equidistribution of the long closed horocycle of length 1/y on X₀(1) with error O(y^{3/4−ε}) for every ε > 0
    ⟺ RH [L: Zagier 1981; Sarnak 1981].
  * The CM mean values of §5.2(B2).

  All are rate or mean-value statements, i.e. wall 4. Positivity locates the resonances only in Re s < ½.

*Proof.* (i) is algebra with the functional equation. (ii) is (i) plus the cited spectral theory. (iii): from (i),
φ′/φ(s) = 2(ξ*′/ξ*)(2s − 1) − 2(ξ*′/ξ*)(2s). At s = ½ + it the functional equation gives
−φ′/φ = 4 Re(ξ*′/ξ*)(1 + 2it), and ξ*′/ξ* = ξ′/ξ − 1/s − 1/(s − 1). Finally Re(ξ′/ξ)(1 + 2it) = Σ_ρ Re 1/(1 + 2it − ρ)
by Hadamard's product. (iv) is the atlas §2 statement. ∎

**Remark 6.3 (decay along a geodesic) [M, G4].**

* The Arakelov kernel (s = 1) decays like 2e^{−u}: Q_0(cosh u) e^u → 2.000.
* The ζ archimedean Weil kernel k(u) = e^{u/2}/(e^u − e^{−u}) decays like e^{−u/2}: k(u) e^{u/2} → 1.000.
* That is the decay of the resolvent at the bottom of the continuous spectrum, s = ½: Q_{−1/2}(cosh u) e^{u/2} → π.

Arakelov theory works at the spectral point λ = 0. The archimedean kernel of the ζ Weil form lives at the edge λ = ¼.
This compares decay rates only; it is not an identity.

### 6.4 Decision on the Green-function terms

They converge (Theorem 6.1), at rate O(log p / p) at the Arakelov point (pointwise, for fixed lifts in the cusp region;
the uniform behaviour of the canonical Arakelov Green function is not proved here, §10 item 6). The limit, the Green function of the cusp
cylinder together with its Hecke translates (divisor sums of Eisenstein type), contains no ζ. At finite level, ζ enters
through values of ζ(2s − 1)/ζ(2s) at real s ≥ 1, weighted by a level factor that tends to 0. The zeros of ζ appear only as
resonances s = ρ/2 in the meromorphic continuation in s, which Arakelov intersection numbers never use. Positivity places
those resonances only in Re s < ½. In the language of atlas §11: the coupled field of the modular tower converges to the
constant-curvature cusp cylinder, which carries no arithmetic measure dν. It supplies no one-sided comparison of the
form (G_W + μ)^{−1/2} V_W (G_W + μ)^{−1/2} ≤ I.

Revision 2 adds the equivariant question for archimedean classes (§6.5): Hecke-equivariant archimedean classes have
absolutely continuous spectral measures at every level (Proposition 6.4); the canonical amplitudes, those of CM Green
functions, vanish at the zeros (Remark 6.5); inverting them registers only the zeros on the line (Remark 6.6).

### 6.5 Hecke-equivariant archimedean classes (revision 2)

Fix N prime. Let H_N := L²(Γ₀(N)\H). On functions use the Hecke operators T_p f(z) = p^{−1/2} Σ_{ad=p, 0≤b<d}
f((az + b)/d) (p ≠ N), normalized so that T_p E(·, s) = (p^{s−½} + p^{½−s}) E(·, s), and put t_p := T_p/2 (self-adjoint,
commuting with Δ; on constants t_p = (p + 1)/(2√p) = cosh(½ log p), as on H and V in Corollary 4.14). Let
η : E → H¹(Γ₀(N)\H) (the energy space) be linear, continuous and equivariant: η(S_pF) = t_p η(F) for every p ≠ N. The
archimedean Hodge form of the class a(η(F)) is ½E(η(F), η(F)) = ½⟨Δη(F), η(F)⟩ (round-1 (F3)). For p ≠ N both
Eisenstein series E(z, s) and E(Nz, s) of Γ₀(N) are T_p-eigenfunctions with eigenvalue p^{s−½} + p^{½−s} [L: Iwaniec,
Ch. 3, 8], so on the continuous spectrum t_p acts by cos(t log p) at s = ½ + it.

**Proposition 6.4 (equivariant archimedean classes) [P-L].**

* (i) ⟨η(F), u_j⟩ = 0 for every Hecke–Maass cusp form u_j and every F.
* (ii) The joint spectral measure ν_F of (t_p)_{p≠N} at η(F), weighted by Δ (½E(P(t) η(F), η(F)) = ∫P dν_F for
  polynomials P), is absolutely continuous with respect to the image of dt under t ↦ Kron(t) = (cos(t log p))_{p≠N}. It
  has no atom at any point Kron(γ_ρ).
* (iii) Hence no equivariant archimedean class realizes the Weil form at a fixed level. In the limit N → ∞, (Rep) through
  such classes requires the Eisenstein amplitudes of η_N(F) to concentrate at the ordinates γ_ρ, with total weight
  F̂(γ_ρ)² at each.

*Proof.* (i) F ↦ ⟨η(F), u_j⟩ is a continuous joint eigenfunctional of all S_p with eigenvalues λ_j(p)/2 (λ_j(p) ∈ R the
Hecke eigenvalues of u_j). Steps 3–5 of Theorem 4.13, with all p ≠ N, give λ ∈ C with p^λ + p^{−λ} = λ_j(p) for every
p ≠ N: u_j would have the Satake parameters of the Eisenstein series E(·, ½ + λ) at every p ≠ N. That is impossible for a
cusp form [L: strong multiplicity one for isobaric representations, Jacquet–Shalika 1981]. Directly: Rankin–Selberg gives
Σ_{p≤x} λ_j(p)² log p ~ x, whereas Σ_{p≤x} (p^λ + p^{−λ})² log p is ≫ x^{1+2|Re λ|} if Re λ ≠ 0, and equals
2x + 2 Re(x^{1+2λ}/(1 + 2λ)) + o(x) if Re λ = 0 (prime number theorem with ζ(1 + it) ≠ 0), which is not ~ x. So the
functional vanishes. (ii) The constant component of η(F) has zero energy. By (i) the Maass components vanish. On the
continuous part, the spectral theorem identifies H_N^{cont} with L²(R₊, dt/4π; C²) (two cusps), t_p with multiplication by
cos(t log p), and Δ with multiplication by ¼ + t², so ½E(P(t)η(F), η(F)) = (1/8π) ∫ P(Kron(t)) (¼ + t²) ‖â_F(t)‖² dt, where
â_F ∈ L²_loc is the Eisenstein transform of η(F). The map t ↦ Kron(t) is injective on [0, ∞) (for t ≠ t′, cos(t log p) =
cos(t′ log p) for p = 2, 3, 5 would force (t − t′) or (t + t′) times log p into 2πZ for two of the three primes with the
same sign, so log p/log q ∈ Q), and the image of an absolutely continuous measure under an injective continuous map of
[0, ∞) has no atoms. (iii) Under RH the Weil form on E has the atomic spectral measure Σ_ρ F̂(γ_ρ)² δ_{Kron(γ_ρ)} (Proposition
4.15(iii)); a limit of absolutely continuous measures can be atomic only if the densities concentrate. ∎

**Remark 6.5 (the canonical amplitudes vanish at the zeros) [P-L for the formula; A for the reading].** The archimedean
classes that arithmetic intersection theory produces are Green functions of divisors. For the Heegner (CM) divisor Λ_D of
discriminant D < 0 on X(1), the Eisenstein amplitude of its Green function at s = ½ + it is, up to the factor
(¼ + t²)^{−1}, Σ_{τ ∈ Λ_D} E(τ, ½ − it) = c_D |D|^{(½ − it)/2} ζ(½ − it) L(½ − it, χ_D)/ζ(1 − 2it) [L: Hecke; Zagier
1981]. It vanishes exactly at the ordinates of the zeros of ζ(s)L(s, χ_D) on the line. The zeros appear as absorption
lines (zeros of an amplitude), not as emission lines (atoms of a spectral measure). The same mechanism at an elliptic
point: E(i, ½ + it) = 0 exactly when ζ(½ + it) L(½ + it, χ_{−4}) = 0, and E(e^{πi/3}, ½ + it) = 0 exactly when
ζ(½ + it) L(½ + it, χ_{−3}) = 0 (Hecke's formula with D = −4, −3). This is how values attached to zeros of ζ entered
H. Haas's numerical list of "eigenvalues" of SL₂(Z)\H, as explained by Hejhal [L, recalled, not re-verified]. A positive
form built from such amplitudes (after smoothing the divisor, so that the energy is finite) has spectral density
|amplitude|² (¼ + t²) on the Eisenstein line, which vanishes at the zeros instead of concentrating there.

**Remark 6.6 (inverting the amplitude registers only the zeros on the line) [P locally; M].** Take instead the amplitude
h(t)/ζ(½ + δ + it), δ > 0, formally a Möbius-weighted packet Σ_n μ(n) n^{−½−δ} (Hecke translate of h). Near a simple zero
ρ = ½ + iγ on the line, ζ(½ + δ + it) = ζ′(ρ)(δ + i(t − γ)) + O(δ² + (t − γ)²), so
δ |h(t)|² |ζ(½ + δ + it)|^{−2} → π |h(γ)|² |ζ′(ρ)|^{−2} δ_γ locally as δ → 0. Near an off-line zero ½ + δ₀ + iγ₀
(δ₀ > 0) the same density is O(δ) for δ < δ₀/2 and tends to 0. So inverting the amplitude produces atoms at the zeros on
the line, with weights |ζ′(ρ)|^{−2} instead of 1, and nothing at off-line zeros. The global limit needs bounds for 1/ζ near
the line and is not claimed. [M, §9.6 R4: at γ₁, δ = 0.05, 0.02, 0.005 give 5.0453, 5.0152, 4.9992 against
π/|ζ′(ρ₁)|² = 4.9938.] This is the general limitation of positivity on the unitary axis: a positive spectral measure on
the line can register zeros on the line only, while the Weil form must register off-line zeros with a sign.

**Decision for archimedean classes.** The Green-function terms converge (Theorem 6.1). Equivariant archimedean classes are
absolutely continuous at every level (Proposition 6.4). The canonical amplitudes vanish at the zeros (Remark 6.5), and
inverted amplitudes miss off-line zeros (Remark 6.6). (Rep) through archimedean classes needs amplitudes tuned to the
zeros, i.e. the zeros as input (Propositions 3.2 and 4.15).

---

## 7. Why the tower's positivity is local purity

**Over F_q (route 27).** ζ_C(s) = det(1 − q^{−s}F | H¹)/((1 − q^{−s})(1 − q^{1−s})). The zeros correspond to the
eigenvalues of the global Frobenius on H¹, Hodge index gives |β| = 1 for the normalized eigenvalues, and that is RH. Global and local coincide, because one Frobenius
generates the scaling group q^Z.

**Over Q, in the tower,** every positivity theorem available gives a local or single-point statement:

* **Hodge index over C** (Lemma 2.1), restricted to the Hecke span at p, is equivalent to the reality of the eigenvalues
  of T_p. This is the Toeplitz + Hankel positivity of Proposition 4.7.
* **Hodge index over F_p** (Weil's theorem for X_N/F_p, through Eichler–Shimura) gives |α_f(p)| = √p, Ramanujan: local
  purity at p of the H¹ part.
* **Faltings–Hriljac** gives ĥ_NT ≥ 0, which through Gross–Zagier gives L′(f, 1)L(f, χ_D, 1) ≥ 0: a sign at the central
  point.
* **Self-adjointness of the Laplacian** gives ζ(1 + it) ≠ 0 (Proposition 6.2(iii)).

**For ζ the local statement is empty.** At every p the Frobenius eigenvalues on H⁰ and H² are 1 and p, trivially pure.
The zeros of ζ are a property of the infinite product, i.e. of a global object with no Frobenius. Three results of this
note make that precise for the tower:

* the canonical scaling correspondences T_p = F + V are self-adjoint (Theorem 4.6), and in the even picture, where
  self-adjointness is no obstacle (Proposition 4.12), exact equivariance through them sees only the poles (Corollary 4.14);
* scaling realized dynamically has no atoms off finite-order characters (Proposition 4.9, Remark 4.10), and Hecke-
  equivariant archimedean classes are absolutely continuous (Proposition 6.4);
* ζ is H⁰ ⊕ H² at every level (§2.3, Theorem 4.5).

[Revision 1 marked as [A] "the expectation that the zeros of ζ are eigenvalues of no algebraic correspondence on the
cohomology of any variety over Q". Revision 2 proves the precise form needed here [P-L]: by Theorem 4.13, three prime
shifts cannot have a joint eigenvector with eigenvalues p_j^{½+iγ} (or cos(γ log p_j)), γ ∉ iQ, under operators with
algebraic eigenvalues, on any variety. This is the familiar reason why RH for ζ calls for an "H¹ of Spec Z" (Deninger,
Connes), an infinite-dimensional object with an R-action that is not a variety over Q; the tower does not supply it.]

**Route-27 obstructions in tower language.**

* **O1 (finite genus).** Formally resolved: g_N < ∞ at each level. But the 2g_N Frobenius eigenvalues it counts are
  cuspidal Satake data, not zeros of ζ.
* **O2 (no global Frobenius).** Theorem 4.6: the char-0 scaling correspondences are the self-adjoint real parts F + V.
  Theorem 4.13: for three independent primes, joint eigencharacters of algebraic operators are Tate characters e^{λx},
  λ ∈ Q (six exponentials). O2 is a transcendence statement; with one prime (F_q) it is empty, and with two it would be
  the four exponentials conjecture.
* **O3 (Spec Z × Spec Z with Hodge index).** S_N has Hodge index, but it does not approximate the missing surface in
  the sense (Rep) needs: Theorem 4.5.

---

## 8. The four walls

| Wall | Why the attempt is not blocked a priori | Where the attempt actually ends up |
|---|---|---|
| (1) Flow-blindness (no flow-stable hypothesis on Φ proves RH) | Its inputs are arithmetic objects (Hecke algebras, i.e. Euler-product data at every level; arithmetic surfaces; Deligne's theorem in characteristic p), not hypotheses on the profile Φ | The positivity the tower supplies (Lemma 2.1, Faltings–Hriljac, Deligne) concerns cusp forms. Its ζ-content is the degree (Lemma 4.3), on which positivity is silent, and an exactly equivariant dictionary carries only the pole functionals d(F), d′(F) (Corollary 4.14). Any route from it to RH has to pass through (Rep), which is RH-equivalent (Propositions 3.2, 4.15). So the tower produces no inequality about Φ. Wall 1's moral is confirmed: arithmetic positivity about the wrong objects (cusp forms) does not reach ζ |
| (2) NS-RIGID (on the native span every arithmetic input is flow-stable or RH itself) | Its inputs are not on the twin-ladder native span | The tower reproduces both branches. Lemma 4.3(iv): the ζ-part is "degree ≤ explicit bound on the cone {F ⋆ F̌}", which is Weil positivity, i.e. RH itself. Corollary 4.14: what an equivariant dictionary can carry is pole data d(F), d′(F), fixed by the Γ-factor and the poles and blind to the zeros. The rest is cuspidal and does not involve ζ |
| (3) Verified height / fixed support | No fixed-support Weil positivity is used. Hodge index at each level is a statement about all classes, not a finite-height statement | Not reached |
| (4) Pointwise / MV-CAP | Hodge index is an every-class (every-window) statement, not a mean value | The RH-equivalent statements the tower does contain are rates and mean values: resonances on Re s = ¼, horocycle equidistribution at rate y^{3/4−ε} (Zagier–Sarnak), and the CM-period mean squares of §5.2(B2). The asymptotic routes (Propositions 4.15, 6.4) need limits of equidistributed or absolutely continuous spectral measures to create an atom at every zero ordinate, which is a statement about every zero individually. These are wall-4 objects, which neither positivity nor mean-value inputs certify zero by zero |
| Vortex trapping (global box winding is RH) | not used | not involved |

The attempt stops before any of the four walls, at representability. The parts of the tower that do contain the zeros of
ζ fall under wall 4. When the tower's ζ-content is isolated (Lemma 4.3), the second branch of NS-RIGID ("RH itself")
appears.

---

## 9. Computations

Each script is a single process, finishes in under 20 s and uses under 1 GB. Every value below is in
`tmp/rha-modular-tower-out/*.json`. The full re-run (`tmp/rha-modular-tower-rerun.sh`, six scripts) takes about 40 s and
reproduces every value. In the revision-2 pass all five v1 scripts were re-run and reproduced every number in §§9.1–9.5
[R].

### 9.1 Eichler–Selberg trace formula (`es.json`) [E]

For p an odd prime and (n, p) = 1:

    (9.1)  Tr(T_n | S₂(Γ₀(p))) = A₁ + A₂ + A₃ + A₄,
           A₁ = ((p + 1)/12) · 1_□(n),
           A₂ = −½ Σ_{t² < 4n} Σ_{f ≥ 1 : f² | t²−4n, (t²−4n)/f² ≡ 0,1 (4)} h_w((t² − 4n)/f²) · μ_p(t, f, n),
                μ_p = 1 + ((t² − 4n)/f² | p) if p ∤ f,   μ_p = p + 1 if p | f,
           A₃ = −Σ_{d | n} min(d, n/d),     A₄ = σ₁(n),

where h_w(−3) = 1/3, h_w(−4) = 1/2, and h_w(D) = h(D) otherwise [L: Cohen 1977; Cohen–Strömberg Thm 12.4.11, trivial
character, k = 2, N = p]. Class numbers come from counting reduced forms, |D| ≤ 10400. The normalization μ_p = p + 1 when
p | f was decided by the tests: the alternative p(p + 1) fails both V2 and V3.

| test | result |
|---|---|
| V1: Tr T₁ = g₀(p) for every odd prime p < 600 | pass |
| V2: Tr T_n = 0 for p ∈ {3, 5, 7, 13} (S₂ = 0), all n ≤ 400 coprime to p | pass |
| V3: p = 11: Tr T_n = a_n(η(z)²η(11z)²) for all n ≤ 400 coprime to 11 | pass |
| spot checks: p = 37: Tr T₂ = −2, Tr T₃ = −2; p = 23: Tr T₂ = −1, g = 2 | pass |

Plancherel limit (Proposition 4.1):

| p | g | Tr T₄/g | Tr T₉/g | Tr T₂/g | max_{k≤40} \|Tr T_k/g − 1_□(k)\| | g · max error |
|---|---|---|---|---|---|---|
| 101 | 8 | 1.25000 | 1.25000 | 0.00000 | 5.2500 | 42 |
| 211 | 17 | 0.70588 | 0.76471 | −0.11765 | 2.1176 | 36 |
| 401 | 33 | 1.00000 | 0.69697 | −0.09091 | 0.9697 | 32 |
| 809 | 67 | 1.00000 | 0.88060 | −0.04478 | 0.4776 | 32 |
| 1601 | 133 | 1.01504 | 0.96992 | −0.00752 | 0.2030 | 27 |
| 3203 | 267 | 0.98876 | 0.99251 | −0.00749 | 0.1498 | 40 |

Cusp trace forms Tr(T_m T_n | S₂)/√(mn) on the 15 three-smooth indices ≤ 48 are positive semidefinite, with numerical rank
min(g, 15): 1, 2, 2, 8, 15 for p = 11, 23, 37, 101, 211 (smallest eigenvalue ≥ −1.4·10⁻¹⁴). The Eisenstein form
σ₁(m)σ₁(n)/√(mn) has rank 1.

### 9.2 Brandt matrices from supersingular isogeny graphs (`brandt.json`) [E]

* **Construction.** Supersingular j-invariants over F_{p²} are obtained from the roots of the Hasse polynomial
  Σ_i C(m,i)² λ^i, m = (p − 1)/2, through j = 256(λ² − λ + 1)³/(λ²(λ − 1)²). B(ℓ)_{ik} is the multiplicity of j_k as a
  root of Φ_ℓ(j_i, Y), for ℓ = 2, 3. Φ_2 and Φ_3 were checked against mpmath's kleinj at 60 digits (residual ≤ 2·10⁻⁶⁶)
  before use.
* **Hecke matrices.** B(ℓ^{k+1}) = B(ℓ)B(ℓ^k) − ℓB(ℓ^{k−1}), and B(2^a 3^b) = B(2^a)B(3^b).
* **Range.** 52 primes 5 ≤ p ≤ 251, genus up to 21.

| check | result |
|---|---|
| B1: number of supersingular j = g₀(p) + 1 | all 52 |
| B2: B(ℓ)·1 = (ℓ + 1)·1 (the degree/Eisenstein line has eigenvalue σ₁(ℓ)) | all 52 |
| B3: w_i B_{ik} = w_k B_{ki}, with w = 1/\|Aut/±1\| | all 52 |
| B4: Tr(B(m)B(n)) = σ₁(m)σ₁(n) + Tr(T_mT_n \| S₂(Γ₀(p))) (right side from (9.1)), all 225 pairs of 3-smooth m, n ≤ 48 | exact, all 52 primes |
| B5: cuspidal eigenvalues satisfy \|a\| ≤ 2√ℓ (Ramanujan); max of \|a\|/(2√ℓ) | 0.99707 (ℓ = 2, p = 251); 0.98502 (ℓ = 3, p = 197) |

B4 is Theorem 4.5(ii). B5 is local purity, with the Eisenstein eigenvalue ℓ + 1 outside the Ramanujan interval.

### 9.3 Green functions and scattering (`green.json`)

* **G0 (normalization) [M].** For three pairs (z, w), the direct sum Σ_b (1/2π)Q_1(cosh d(z, w + b)) (mpmath nsum) and the
  Fourier form of G_cyl,2 agree to 3.4·10⁻²⁸, 6.0·10⁻²⁹ and 1.4·10⁻²⁸.
* **G1 (Dirichlet series of the scattering coefficient) [M].** Σ_{p|c} φ(c)c^{−2s} = (ζ(2s−1)/ζ(2s))(p−1)/(p^{2s}−1) for
  p ≤ 13, with maximum relative deviation 1.2·10⁻⁹ (s = 2) and 2.9·10⁻⁶ (s = 3/2). Both deviations are truncation-limited.
* **G2 (Theorem 6.1 at s = 2) [M].** z = 0.17 + 2i, w = −0.31 + 2i, rows c ≤ 30p.

| p | G_p − G_cyl | predicted (y_z y_w)^{−1}φ^{(p)}(2)/3 | ratio | p³ · (G_p − G_cyl) |
|---|---|---|---|---|
| 2 | 9.68834e-03 | 9.69205e-03 | 0.99962 | 0.0775 |
| 3 | 3.63330e-03 | 3.63452e-03 | 0.99966 | 0.0981 |
| 5 | 9.31635e-04 | 9.31927e-04 | 0.99969 | 0.1165 |
| 7 | 3.63340e-04 | 3.63452e-04 | 0.99969 | 0.1246 |
| 11 | 9.92735e-05 | 9.93037e-05 | 0.99970 | 0.1321 |
| 13 | 6.10658e-05 | 6.10843e-05 | 0.99970 | 0.1342 |
| 17 | 2.78423e-05 | 2.78507e-05 | 0.99970 | 0.1368 |
| 31 | 4.72118e-06 | 4.72261e-06 | 0.99970 | 0.1406 |
| 61 | 6.29808e-07 | 6.29997e-07 | 0.99970 | 0.1430 |

  The first-Fourier-mode part is at most 3.7·10⁻⁷ (at p = 2) and decreases with p. The ratio deficit of 3·10⁻⁴ is the
  c > 30p tail. p³ · (G_p − G_cyl) tends to 0.14538.
* **G3 (resonances) [M].** |φ(½ + it)| = 1.000000000000 at t = 0.7, 3.1, 7.0, 14.13, 21.0. At s = ρ_k/2 + δ with
  k = 1, 2, 3 and δ = 10⁻², 10⁻⁴, 10⁻⁶: |φ| ≈ 50.4, 5.14·10³, 5.15·10⁵ (k = 1), and similarly for k = 2, 3: a simple
  pole at ρ/2, Re = ¼. The level factor at s = 1 is 1/(p + 1) = 0.0833, 0.0098, 0.00099 for p = 11, 101, 1009.
* **G4 (decay along a geodesic) [M].** At u = 0.5, 1, 2, 4, 8, 12:
  * Q_0(cosh u)e^u = 2.320, 2.098, 2.012, 2.000, 2.000, 2.000;
  * k(u)e^{u/2} = 1.582, 1.157, 1.019, 1.000, 1.000, 1.000;
  * Q_{−1/2}(cosh u)e^{u/2} = 3.512, 3.257, 3.156, 3.142, 3.142, 3.142.
* **Scattering density at ½ [M].** −φ′/φ(½ + it) = −3.9076, −1.9072, −0.1350, +7.5710 at t = 0, 0.5, 2, 7. The zero part
  4Σ_ρ(1−β)/((1−β)² + (2t−γ)²) is +0.0924, +0.0928, +0.1003, +7.5913 (Proposition 6.2(iii)).

### 9.4 Theorem 4.6 / Lemma 4.6.1 (`equivariance.json`) [M]

φ(u) = c(1 − u²)⁴ on [−1, 1] with ‖φ‖₂ = 1, and F_ε(u) = ε^{−1/2}φ(u/ε). The prime side uses round-1 Lemma 2.2 and
Theorem 2.1. The zero side uses the first 10⁶ zeros (`tmp/routes-b8-r34-out/zeros1e6.npy`), with F̂ in closed form,
√π·4!·(2/ω)^{9/2}J_{9/2}(ω).

| ε | w(F_ε) prime side | w(F_ε) zero side | W(F_ε⋆Ǧ₂), p = 2 | W(F_ε⋆Ǧ₂), p = 3 | ε·w(F_ε)/φ(0)² |
|---|---|---|---|---|---|
| 0.2 | 0.333938 | 0.333938 | 0.065324 | 0.139738 | 0.0400 |
| 0.1 | 0.833517 | 0.833517 | −0.129724 | −0.040263 | 0.0499 |
| 0.05 | 1.430088 | 1.430088 | −0.238158 | −0.201051 | 0.0428 |
| 0.02 | 2.288474 | 2.288474 | −0.303209 | −0.300146 | 0.0274 |
| 0.01 | 2.962325 | 2.962325 | −0.324891 | −0.333175 | 0.0177 |
| limit | +∞ (≈ log 1/ε) | | −(log 2)/2 = −0.346574 | −(log 3)/3 = −0.366204 | 0 |

Prime side and zero side agree to ≤ 6·10⁻¹² relative for w and to ≤ 1.5·10⁻¹⁰ absolute for the cross terms. These are two
independent evaluations: the first uses only the primes and the gamma factor, the second only the zeros. Equivariance
(Theorem 4.6) would require the fourth and fifth columns to equal the second.

### 9.5 Local purity and ghost visibility (`localpurity.json`) [E, M]

* **L1 [E].** X₀(11) = 11a1 : y² + y = x³ − x² − 10x − 20. The direct projective point counts over F_{ℓ^k} (flint
  finite fields) equal ℓ^k + 1 − (Tr Ψ_k(B(ℓ)) − (ℓ^k + 1)), where the bracket is the Brandt power sum minus the
  Eisenstein value:

| ℓ | k = 1 | k = 2 | k = 3 | k = 4 |
|---|---|---|---|---|
| 2 | 5 = 5 | 5 = 5 | 5 = 5 | 25 = 25 |
| 3 | 5 = 5 | 15 = 15 | 20 = 20 | 75 = 75 |

  This is a third code path, consistent with the Brandt matrices and with Eichler–Shimura.
* **L2 [M].** Smallest eigenvalue of the 6 × 6 forms of Proposition 4.7:
  * curve 11a1 mod 2: Q_TL −1.8·10⁻¹⁶ (PSD, rank 2); Q_TL + Hank −2.6·10⁻¹⁵ (PSD);
  * route-27 fake 1 − 5T + 5T² (q = 5; real ghost, |b| = 1.618, 0.618): Q_TL −11.889 (the ghost is visible);
    Q_TL + Hank −6.7·10⁻¹⁵ (PSD; the ghost is invisible to characteristic-0 Hecke positivity).
* **L3 [M].** Lemma 4.3 and Proposition 4.7 on Brandt data, p = 37, 43, 101. Take h(x) = e^{−x²/3} on the prime powers
  2^k, 3^k, k ≤ 5, and build E(h) from Ψ_k(B(2)) and Ψ_k(B(3)).
  * The Eisenstein eigenvalue of E(h) is 1.177115152560 at all three levels and equals the ζ prime sum
    Σ Λ(n) n^{−1/2} h(log n) to 12 digits.
  * The cuspidal eigenvalues match Lemma 4.3(ii) to ≤ 4.4·10⁻¹⁶.
  * For a = (0.3, −1.1, 0.7, 0.2, −0.5) at ℓ = 2, Tr(u_a² | S₂) = Q_TL + Hank: 15.0631284195, 16.6431284195,
    33.3800450904 on both sides.

### 9.6 Revision-2 checks (`referee.json`) [M]

`tmp/rha-modular-tower-referee.py`, 7.4 s, 0.34 GB. Code paths differ from v1 where a v1 number is re-checked.

* **R1 (Lemma 4.6.1 table, u-space).** Φ = F_ε ⋆ F̌_ε from the exact polynomial autocorrelation of φ = c(1 − u²)⁴, the
  archimedean term from the kernel k(y) = e^{y/2}/(e^y − e^{−y}) with c_∞ = log π − ψ(¼), not the t-space digamma symbol
  used in v1:

| ε | w(F_ε), u-space | v1 | W(F_ε ⋆ Ǧ₂), p = 2, u-space | v1 | w(F_ε) − log(1/ε) |
|---|---|---|---|---|---|
| 0.2 | 0.333938 | 0.333938 | +0.065324 | +0.065324 | −1.2755 |
| 0.1 | 0.833517 | 0.833517 | −0.129724 | −0.129724 | −1.4691 |
| 0.05 | 1.430088 | 1.430088 | −0.238158 | −0.238158 | −1.5656 |
| 0.02 | 2.288474 | 2.288474 | −0.303209 | −0.303209 | −1.6235 |
| 0.01 | 2.962325 | 2.962325 | −0.324891 | −0.324891 | −1.6428 |

  Agreement in all printed digits. The last column settles towards a constant, as Lemma 4.6.1(i) states.
* **R2 (Kronecker-limit constant).** (6/π)(γ − log 2 − ζ′(2)/ζ(2)) = 0.867132427721; φ(1 + e) − 3/(πe) = 0.867124135
  (e = 10⁻⁴) and 0.867132427 (e = 10⁻⁸).
* **R3 (Proposition 6.2(iii) at t = 0, closed form).** Σ_ρ 1/ρ = 1 + γ/2 − ½ log 4π gives −φ′/φ(½) = 4Σ_ρ 1/ρ − 4 =
  −3.9076171641, equal to the numerical derivative of log φ to 10 digits; zero part 0.092383. (v1 used 10⁶ zeros.)
* **R4 (Remark 6.6).** e ∫_{γ₁−1}^{γ₁+1} |ζ(½ + e + it)|^{−2} dt = 5.0453, 5.0152, 4.9992 at e = 0.05, 0.02, 0.005;
  π/|ζ′(ρ₁)|² = 4.9938.
* **R5 (Theorem 4.13, exactness).** For 11a1, min_{0 ≤ z ≤ Z} max_{p=2,3,5} |cos(z log p) − a_p/(2√p)| = 0.4413, 0.1047,
  0.0381, 0.0101 for Z = 10, 10², 10³, 10⁴ (grid step 10⁻³). Approximate joint solutions exist; exact ones do not.
* **R6 (Proposition 4.15).** Sup-distance from Kron(γ_k) = (cos(γ_k log 2), cos(γ_k log 3)), k = 1..5, to the nearest
  joint Hecke point (a_f(2)/(2√2), a_f(3)/(2√3)) of the newforms of prime level p (Brandt matrices, all prime p ≤ 251):

| level p | forms | k = 1 | k = 2 | k = 3 | k = 4 | k = 5 |
|---|---|---|---|---|---|---|
| 11 | 1 | 0.695 | 0.286 | 0.765 | 0.136 | 0.343 |
| 53 | 4 | 0.578 | 0.416 | 0.411 | 0.442 | 0.098 |
| 101 | 8 | 0.280 | 0.364 | 0.121 | 0.280 | 0.328 |
| 199 | 16 | 0.489 | 0.102 | 0.254 | 0.098 | 0.164 |
| 251 | 21 | 0.227 | 0.115 | 0.218 | 0.209 | 0.216 |
| best level ≤ 251 | | 0.0589 | 0.0200 | 0.0703 | 0.0172 | 0.0545 |

  The Hecke points fill the cube as the level grows (Plancherel), so the zeros' Satake parameters are approximated. The
  approximating forms are selected by looking at the zeros; nothing in the tower selects them.

---

## 10. Self-attack (revision 1: same author, independent code paths; not an independent referee)

1. **"Theorem 3.1 is empty, because (Rep) is RH-equivalent."** Yes (Proposition 3.2), as is every reduction of RH to a
   representability statement. The attempt's content was the hope that the tower's arithmetic would supply L_N. §§4–6
   show that it does not.
2. **"A construction outside §4 might work."** By Proposition 3.2, any construction that works must encode the zeros.
   Covered here:
   * Hecke-span maps, (C1)–(C3), Theorem 4.5;
   * all of NS, Theorem 4.5(i), (iii) (ζ-data confined to the degrees, the primitive form cuspidal);
   * scaling-equivariant maps through self-adjoint or finite-order correspondences, Theorem 4.6;
   * (revision 2) exactly equivariant maps, translation or even picture, through any operators with algebraic
     eigenvalues, Theorem 4.13 and Corollary 4.14; asymptotically equivariant Hecke maps, Proposition 4.15;
   * dynamical realizations, Proposition 4.9 and Remark 4.10;
   * arithmetic and archimedean classes, §§5–6, including Hecke-equivariant archimedean classes (Proposition 6.4).

   Not covered: non-equivariant, non-dynamical maps into End⁰(J_N)_R built from other data, for example Heegner points
   or L-values of cusp forms; and discontinuous maps (Theorem 4.13 needs continuity). None is known that does not use the
   zeros. Status: open only in the sense of Propositions 3.2 and 4.15.
3. **"Equivariance is too strong a hypothesis in Theorem 4.6."** (Revision 2: and too weak in another sense, since it
   concerns the translation picture only. In the even picture self-adjoint equivariance is consistent (Proposition
   4.12); exact equivariance of any algebraic kind is Theorem 4.13, asymptotic equivariance Proposition 4.15.) It is
   route 27's mechanism, and the only one known to produce the translation invariance of the Weil form from geometry. Without it, the construction itself must produce
   translation invariance. Theorem 4.6 shows that composition with Hecke operators cannot, and Remark 4.6(a) states what
   an equivariant construction would need. Partial equivariance, on a shift-invariant subspace V, is consistent with (*)
   only if w(F) = W(F ⋆ Ǧ_2) on V. Under RH this means Σ_γ |F̂(γ)|²(1 − cos(2γ log p)) = 0. That forces F̂ to vanish at
   every zero ordinate outside (π/log p)Z, so w(F) = Σ_{γ ∈ (π/log p)Z} |F̂(γ)|². This is 0, and F is principal, unless
   some zero ordinate is a rational multiple of π/log p. Such V carry essentially no information.
4. **"U_p is Frobenius-like in characteristic 0."** Correct. Remark 4.6(b) and Remark 4.10 treat it: it gives local
   data, one prime at a time, with absolutely continuous scaling spectrum. This part is [A], not fully proved.
   (Revision 2: exact U-equivariance for three primes is now excluded by Corollary 4.14(ii) [P-L].)
5. **"The arithmetic Hodge index touches ζ on the critical line (§5.2(B2))."** Correct, and this is the strongest
   contact found. It yields mean-square information [A], which is a wall-4 object. The bookkeeping is not done.
6. **"Theorem 6.1 uses the hyperbolic Green function, not the canonical Arakelov one."** The difference is
   h(z) + h(w) + c_N, which cancels on degree-0 divisors [L]. The convergence statement for the canonical normalization
   itself is not proved here.
7. **"Proposition 4.9 assumes L² vectors."** For distribution vectors whose Mellin transform is locally L², the
   spectral measure is still absolutely continuous. A distribution vector with atomic Mellin transform has no matrix
   coefficient (|δ|² is undefined). Only the L² case is written in full. (Revision 2: Proposition 4.9 is restated and
   proved for every distribution vector ξ with a(Φ)ξ ∈ L²_0, which forces the Mellin transform to be locally L².)
8. **"The numerics are floating point."** The [E] items are exact: the Brandt traces, the Eichler–Selberg traces in
   rationals, and the point counts. The [M] items illustrate proved statements (Theorems 4.6 and 6.1) and are not proof
   steps. The one exception is the positivity of w(F) in Lemma 4.2(a), which is backed by the atlas certificate.
9. **Normalization of (9.1).** The choice μ_p = p + 1 for p | f was decided by vanishing traces (p = 3, 5, 7, 13) and by
   the 11a coefficients, and confirmed independently by the Brandt computation (B4). The alternative p(p + 1) fails.
10. **Sign and normalization errors found while writing.**
    * The draft stated that the scattering-phase density −φ′/φ(½ + it) is positive. It is not: it equals −3.908 at
      t = 0. Only its zero part is positive. Corrected in Proposition 6.2(iii) and §9.3.
    * The draft hypothesis p² y_z y_w > 1 in Theorem 6.1 was too weak for the stated remainder bound; it is now ≥ 2.
    * A notation clash between β_f(p) and the normalized eigenvalue was removed (b_f(p) in Lemma 4.3 and
      Proposition 4.7).

**Refereeing status.** Revision 1 (Theorems 4.5, 4.6, 6.1, Propositions 4.7–4.9 and 6.2) has had one fresh-context
re-check by a second instance of the same model (§10b), not an external referee. The revision-2 results have been checked
only by their author. The verdict that the attempt fails does not depend on these results being new. It depends on them
being correct, and their proofs are short, given in full, and cross-checked by independent code paths where a computation
is involved.

## 10b. Fresh-context re-check of revision 1 (revision 2)

The re-checker read the PR #27 snapshots, the round-1 synthesis and arith-surface note, and the route-27 note before
reading revision 1, and then went through revision 1 line by line.

**Re-run.** All five v1 scripts were re-run (`es` 0.6 s, `brandt` 3.4 s, `green` 19.2 s, `equivariance` 3.9 s,
`localpurity` 0.1 s). Every number quoted in §§9.1–9.5 reproduces. One reading note: in §9.1 the cusp trace form at p = 211
is positive definite (smallest eigenvalue 0.194), consistent with the stated bound ≥ −1.4·10⁻¹⁴.

**Recomputed by a different code path.** The Lemma 4.6.1 table (u-space kernel instead of the t-space digamma symbol;
§9.6 R1, all printed digits agree) and −φ′/φ(½) (closed form for Σ1/ρ instead of 10⁶ zeros; R3).

**Re-derived by hand, no error found.** (2.1) against route 27's Γ_j·Γ_k (with d₁ = D·V, d₂ = D·H and (F^t)^k = q^kF^{−k});
(2.3); Proposition 3.2 (the trace form on 𝕋_N ⊗ R is 2Σ_f χ_f², positive definite of dimension g_N); Proposition 4.1
(Eichler–Selberg main term (p + 1)/12·1_□(n)); Lemma 4.2(a), (b) (φ(0) ≠ 0 holds for the bump used); Lemma 4.3(i)–(iv);
Lemma 4.4; Theorem 4.6, including the polarization in Step 1, which needs W(X ⋆ Y̌) = W(Y ⋆ X̌) (true: Y ⋆ X̌ is the
reflection of X ⋆ Y̌ and W is even); Lemma 4.6.1 (the gamma term (1/2π)∫α(τ/ε)|φ̂(τ)|²dτ = log(1/ε) + O(1)); Proposition 4.7;
Proposition 4.8 (Δ(sl₂) is maximal in sl₂ ⊕ sl₂ because the quotient is the irreducible adjoint module; Ratner then gives
closed or dense orbits); Theorem 6.1(ii) (the p-part of Σφ(c)c^{−2s} is (1 − p^{−2s})/(1 − p^{1−2s})) and (iii) (all four
Laurent factors; the poles 3/(π(p + 1)ε) cancel); Proposition 6.2(i) (φ = (s/(s − 1)) R_{1/2}(2s − 1)) and (iii)
(−φ′/φ(½ + it) = 4 Re(ξ*′/ξ*)(1 + 2it) by the functional equation, then Hadamard).

**Corrections made in revision 2.**

* (a) Theorem 6.1(iii): C_0 = (6/π)(γ − log 2 − ζ′(2)/ζ(2)) = 0.8671324277; revision 1 listed log π among its
  ingredients (R2). No effect on the O((log p)/p) rate.
* (b) Proposition 4.9: the revision-1 consequence ("W is not a matrix coefficient of any ξ ∈ L²_0") holds for a trivial
  reason (W has point masses at ±log n). Restated for positive forms ‖a(Φ)ξ‖², including distribution vectors.
* (c) Theorem 4.6 excludes p^{−1/2}T_p only in the translation picture. In the even picture the corresponding
  identities hold and there is no contradiction (Proposition 4.12). Revision 1's summary ("this excludes the Hecke
  correspondences p^{−1/2}T_p") was too broad; the even picture needs Theorem 4.13.
* (d) Remark 4.6(b) and §7: two [A] statements are now proved in the exact form needed (Corollary 4.14(ii), Theorem 4.13).
* (e) Lemma 2.1(iii): "runs verbatim" replaced by the one change Step 1 needs on S_N.

**Not covered by the re-check.** Cited theorems ([L]); the [A] items (Remark 4.10's global assembly, §5.2(B2)'s
bookkeeping, §5.3's vertical compatibility, Lemma 4.11(iii)); novelty; and the revision-2 results, which are the
re-checker's own.

---

## 11. What survives

* **Theorem 3.1 / 3.1′ and Proposition 3.2.** The tower criterion, and the fact that it is RH-equivalent taken abstractly.
* **Lemma 4.3.** In the modular tower the ζ prime sum is the degree of an explicit Hecke class, and RH is a family of
  upper bounds on degrees, which Hodge index never constrains (Lemma 4.4).
* **Theorem 4.5 (Eisenstein confinement).** ζ is H⁰ ⊕ H² at every level; the Hodge-index form is cuspidal; the
  rank-one identity is checked exactly for 52 primes.
* **Theorem 4.6.** In the translation picture no self-adjoint or finite-order scaling correspondence realizes the Weil
  form, with an explicit contradiction (log(1/ε) against −(log p)/p).
* **Proposition 4.7.** Characteristic-0 Hecke positivity is the characteristic-p Toeplitz Weil form plus a Hankel term.
  It is reality of eigenvalues and does not see real ghosts.
* **Propositions 4.8 and 4.9, Remark 4.10.** Irrational scalings are not correspondences; the tower's scaling spectrum
  is Lebesgue except at finite-order characters, and positive forms ‖a(Φ)ξ‖² (ξ possibly a distribution vector) are
  absolutely continuous.
* **Lemma 4.11 and Proposition 4.12 (revision 2).** On even test functions the Weil form gives every parameter on
  R ∪ iR a positive weight (the poles and any real zero included), and the symmetric shifts S_p are self-adjoint for it,
  like the Hecke operators: the even picture is where a Hecke dictionary belongs, and Theorem 4.6 has no analogue there.
* **Theorem 4.13 (revision 2).** A continuous dictionary exactly equivariant under three prime shifts (translations or
  symmetric shifts) through operators with algebraic eigenvalues is a function of finitely many Tate moments
  ∫F x^k e^{λx}, λ ∈ Q (six exponentials theorem). Route 27's obstruction O2 in exact form; empty for one prime, open
  (four exponentials) for two.
* **Corollary 4.14 (revision 2).** In the modular tower, exact equivariance through T_p (even picture) or U_ℓ
  (translation picture) leaves only the pole functionals d(F), d′(F): the dictionary sees the poles of ζ and none of its
  zeros. It recovers round 1's degree D_F·H = d(F) as the unique equivariant choice.
* **Proposition 4.15 (revision 2).** Asymptotically Hecke-equivariant dictionaries exist if RH holds, and their
  existence gives RH (via the argued Lemma 4.11(iii)); they must send the zeros to cusp forms with Satake parameters converging to Kron(γ_ρ), the parameters of E(·, ½ + iγ_ρ). RH
  is temperedness of these parameters, as Deligne's theorem is temperedness of cusp forms.
* **Theorem 6.1.** The Green-function terms converge to the cusp-cylinder Green function at rate O(log p/p); ζ enters
  only through the scattering factor, with level weight 1/(p + 1) at s = 1.
* **Proposition 6.2.** The scattering coefficient is the atlas §2 bridge at the single shift a = ½; resonances sit at
  s = ρ/2; positivity gives only ζ(1 + it) ≠ 0; the RH-equivalent content of the tower is rate statements.
* **Proposition 6.4, Remarks 6.5–6.6 (revision 2).** Hecke-equivariant archimedean classes have no Maass components and
  absolutely continuous Eisenstein spectral measures; CM amplitudes vanish at the zeros (absorption, not emission);
  inverting them (Möbius packets) registers only zeros on the line, with weights |ζ′(ρ)|^{−2}.
* **Tools.**
  * an exact Eichler–Selberg implementation for Γ₀(p), validated;
  * Brandt matrices from supersingular isogeny graphs (Φ_2 and Φ_3 verified);
  * lattice sums for the Γ₀(p) resolvent;
  * a prime-side / zero-side pair for shifted Weil cross terms, and an independent u-space evaluation (revision 2);
  * Kronecker images of zeros against joint Hecke points from Brandt matrices (revision 2).

---

## 12. Status

RH is open. NO QED. PT Λ ≤ 0.2 stands. 0.1758354 and 0.1787854 remain computer-assisted candidates. No Λ bound and no
zero-free region changes.

For later rounds:

* **Do not re-attempt** representations of the Weil form by Hecke correspondences or other algebraic cycles on modular
  curves and their products (Theorems 4.5, 4.6, Corollary 4.14), exactly scaling-equivariant dictionaries through
  algebraic operators on any variety (Theorem 4.13: only Tate characters survive), equivariant archimedean classes
  (Proposition 6.4), or the modular Arakelov Green functions (Theorem 6.1).
* **The only contact this tower has with ζ on the critical line** is the CM-period mean square of §5.2(B2). That is a
  wall-4 object.
* **The structural requirement** that every geometric route must meet is now explicit. It needs operators realizing
  the prime shifts (translations, or symmetric shifts on even functions) with pure-point joint spectrum at the Kronecker
  points of the zeros, (p^{iγ_ρ})_p or (cos(γ_ρ log p))_p, coupling all primes at once: a Hilbert–Pólya realization.
  Operators with algebraic eigenvalues, in particular every algebraic correspondence on every variety, cannot have these
  joint eigenvalues for three primes (Theorem 4.13). Automorphic dynamics has continuous spectrum at these points
  (Propositions 4.9, 6.4). Canonical automorphic amplitudes vanish there (Remark 6.5). None of these supplies such a
  realization.
* **The one place where the tower has the right shape** is Proposition 4.15: RH is temperedness of the Satake parameters
  Kron(γ_ρ), and the tower proves temperedness for cusp forms by Hodge index in characteristic p. A route through it would
  need a construction, from ζ alone, of cusp forms (or positive measures on Hecke spectra) converging to Kron(γ_ρ). No such
  construction is known; every place where the zeros occur in the tower (resonances, CM amplitude zeros, central values)
  is continuous-spectrum or a linear functional, not a cusp form.

This agrees with the atlas closing line: the tower supplies none of "a genuine all-scale signed arithmetic estimate, a
cofinal actual-form floor, or an exhaustive theta boundary/collision certificate".

---

## References

Cited from memory and not re-verified here, except where a computation in §9 checks a stated identity.

* A. Abbes, E. Ullmo, Auto-intersection du dualisant relatif des courbes modulaires X₀(N), J. reine angew. Math. 484 (1997).
* C. Birkenhake, H. Lange, *Complex Abelian Varieties*, 2nd ed., Springer 2004 (Thm 11.5.1).
* H. Cohen, Trace des opérateurs de Hecke sur Γ₀(N), Sém. Théorie des Nombres de Bordeaux, 1976–77.
* H. Cohen, F. Strömberg, *Modular Forms: A Classical Approach*, AMS 2017 (Thm 12.4.11).
* R. Coleman, B. Edixhoven, On the semi-simplicity of the U_p-operator on modular forms, Math. Ann. 310 (1998)
  (a_f(p)² ≠ 4p in weight 2).
* J. B. Conrey, W. Duke, D. Farmer, The distribution of the eigenvalues of Hecke operators, Acta Arith. 78 (1997).
* F. Diamond, J. Shurman, *A First Course in Modular Forms*, Springer 2005.
* G. Faltings, Calculus on arithmetic surfaces, Ann. of Math. 119 (1984).
* B. Gross, Heights and the special values of L-series, CMS Conf. Proc. 7 (1987).
* B. Gross, D. Zagier, Heegner points and derivatives of L-series, Invent. Math. 84 (1986).
* R. Hartshorne, *Algebraic Geometry*, Springer 1977 (V.1.9).
* D. Hejhal, *The Selberg Trace Formula for PSL(2,R)*, Vol. 2, LNM 1001 (1983); and his explanation of the H. Haas
  eigenvalue list (Eisenstein series vanishing at elliptic points), in his papers on eigenfunctions of the Laplacian for
  Hecke triangle groups (1990s).
* P. Hriljac, Heights and Arakelov's intersection theory, Amer. J. Math. 107 (1985).
* M. Huxley, Scattering matrices for congruence subgroups, in *Modular Forms* (Durham 1983), 1984.
* H. Iwaniec, *Spectral Methods of Automorphic Forms*, 2nd ed., AMS 2002.
* H. Jacquet, J. Shalika, On Euler products and the classification of automorphic representations I, II, Amer. J. Math.
  103 (1981).
* J. Jorgenson, J. Kramer, Bounds on canonical Green's functions, Compositio Math. 142 (2006).
* U. Kühn, Generalized arithmetic intersection numbers, J. reine angew. Math. 534 (2001).
* S. Lang, *Introduction to Transcendental Numbers*, Addison-Wesley 1966 (six exponentials theorem).
* S. Lang, *SL₂(R)*, Springer.
* P. Lax, R. Phillips, *Scattering Theory for Automorphic Functions*, Ann. of Math. Studies 87 (1976).
* Yu. Manin (1972), V. Drinfeld (1973): cuspidal divisor classes on modular curves are torsion.
* B. Mazur, Modular curves and the Eisenstein ideal, Publ. IHES 47 (1977).
* P. Michel, E. Ullmo, Points de petite hauteur sur les courbes modulaires X₀(N), Invent. Math. 131 (1998).
* A. Moriwaki, Hodge index theorem for arithmetic cycles of codimension one, Math. Res. Lett. 3 (1996).
* K. Ramachandra, Contributions to the theory of transcendental numbers I, II, Acta Arith. 14 (1968) (six exponentials
  theorem).
* M. Ratner, On Raghunathan's measure conjecture, Ann. of Math. 134 (1991).
* P. Sarnak, Asymptotic behavior of periodic orbits of the horocycle flow and Eisenstein series, CPAM 34 (1981).
* P. Sarnak, Nonvanishing of L-functions on Re(s) = 1, in *Contributions to Automorphic Forms, Geometry, and Number
  Theory*, 2004.
* L. Schwartz, Théorie générale des fonctions moyenne-périodiques, Ann. of Math. 48 (1947) (spectral synthesis in one
  variable).
* J.-P. Serre, Répartition asymptotique des valeurs propres de l'opérateur de Hecke T_p, JAMS 10 (1997).
* G. Shimura, *Introduction to the Arithmetic Theory of Automorphic Functions*, 1971.
* A. Venkov, *Spectral Theory of Automorphic Functions*, Proc. Steklov Inst. 153 (1982).
* A. Weil, *Sur les courbes algébriques et les variétés qui s'en déduisent*, 1948.
* D. Zagier, Eisenstein series and the Riemann zeta function, in *Automorphic Forms, Representation Theory and
  Arithmetic* (Bombay 1979), 1981.
* Project: round-1 notes `formalization/rh-attempts/2026-11-01-*.md` (arith-surface Theorems 2.1, 3.4, 5.1, 6.2;
  Lemma 2.2; Corollary 2.3); route 27 (`formalization/paper/function-field-twin-ladder.md`); PR #27 atlas and modules.
