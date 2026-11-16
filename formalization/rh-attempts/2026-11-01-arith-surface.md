# RH attempt, 1 November 2026 (revision 2, after the route-atlas audit of PR #27): a graph-class intersection form for ζ ("Spec Z × Spec Z"), two Hodge-index arguments, and the line where each fails

**Outcome: the attempt fails. No proof of RH.** Two complete arguments aimed at the Riemann hypothesis are written out and
then attacked.

* **Argument I** (§5, §6) is the Grothendieck–Mattuck–Tate proof of the Hodge index theorem, run on the graph-class space
  S_Q of §2. It is complete except for Step 2, a Riemann–Roch inequality. Restricted to primitive classes that inequality is
  equivalent to RH (Remark 6.1). On a surface it is inherited from Riemann–Roch for all divisors with a section count, and
  Theorem 6.2 proves that no section count on S_Q satisfies Riemann–Roch with a canonical class of finite degree, whether or
  not RH is true.
* **Argument II** (§7) is the finite-support version. The atlas spectral-head theorem supplies, at support λ, about λ²
  classes that are window restrictions of exact principal divisors (Lemma 7.1) and are nearly null for the Weil form. The
  argument is complete except for Step B: a floor, with polynomial defect, for the Weil form on the complement of these
  principal classes. Given the head theorem, Step B is equivalent to RH, and it is the open complement boundary recorded in
  the atlas spectral-head and signed-complement modules. In the form that the V7 floor reduction uses, Step B concerns one
  vector per support (the complement part of the box class), where it is the one-sided Landau bound.

RH is open. PT Λ ≤ 0.2 stands. 0.1758354 and 0.1787854 remain computer-assisted candidates. Nothing here changes a Λ
bound. NO QED.

**What changed in this revision.** The first version (13:11, kept unchanged at `tmp/rha-arith-surface-note-v1-backup.md`)
was written before the route atlas (PR #27) was read. This revision:

1. maps every component to the atlas sections it overlaps (§0) and states for each what is different;
2. adds Lemma 2.2: the pairing of this note and the atlas "actual form" q_λ are the same quadratic form, so every atlas
   finite-support certificate is a finite-support Hodge index statement on S_Q;
3. adds Theorem 3.4 (rank split): on any fixed arithmetic surface all infinite-rank content of the arithmetic intersection
   pairing is an archimedean Dirichlet energy. This makes route 27's heuristic obstruction O3 precise and places every
   arithmetic-surface model of the Weil form inside the "coupled-field" class that atlas §11 leaves open;
4. adds Argument II (§7): Lemma 7.1 identifies the atlas spectral head with window restrictions of exact Tate principal
   divisors, Theorem 7.2 reduces RH to a complement floor, and §7.3 measures, at λ = 3, 4, 5, 6, 8, that the bottom of the
   even Weil spectrum is spanned by these principal classes;
5. adds Proposition 8.1: a Zariski-lemma (positive-kernel) certificate, which is how local positivity (here Λ(n) ≥ 0)
   enters the Zariski proof of negativity, reaches exactly the prime-free window λ ≤ √2;
6. adds Proposition 9.2: Suzuki's screw function is minus half the primitive self-intersection of the box class, so
   Suzuki's criterion and the V7 floor reduction are Castelnuovo–Severi statements for one class per support, with defect
   exponent exactly Θ − 1/2 (Θ = sup Re ρ);
7. uses the V7 floor reduction, the openai/math 7/8 half-plane and PR 14 / Xu–Sang only as stated inputs; the converse of
   V7 is claimed only on the box family, where the zero sum converges absolutely (Proposition 9.2 (iii)).

All v1 numbers were re-run (`tmp/rha-arith-surface-rerun-v1.sh`): every JSON output is identical except elapsed times.

Grades: **[P]** proved here (complete argument in this note); **[P-L]** proved here from a cited theorem; **[E]** exact
integer/rational computation; **[M]** measured in floating point (double precision unless stated); **[L]** cited, not
re-verified here; **[A]** argued, not proved. **[Atlas]** marks a result accepted in the PR #27 modules by internal review
(not external peer review, not re-verified here). All checks in this note were made by its author; §12 is a same-agent
adversarial pass with independent code paths, **not** an independent referee. The new results (Lemma 2.2, Theorem 3.4,
Lemma 7.1, Theorem 7.2, Proposition 8.1, Proposition 9.2) have had no independent check.

Scripts (`.venv-arb/bin/python -I`, one process each, < 1 min, < 2 GB): v1 scripts `tmp/rha-arith-surface-{lib,explicit,
genus-ghost,cyclotomic,fakes,localinf,localinf-bisect,referee}.py`; new: `tmp/rha-arith-surface-head.py` (modes default,
`--v2`, `--v3`, `--v4`), `tmp/rha-arith-surface-zariski.py`, `tmp/rha-arith-surface-box.py`,
`tmp/rha-arith-surface-rerun-v1.sh`. Outputs in
`tmp/rha-arith-surface-out/`; the numbers quoted in §7.3 and §8.1 are collected in `summary-v2.json` and `zariski.json`.

---

## The lines where it fails

**Argument I.** §5, Theorem 5.1, Step 2: for a primitive class D with D² = η > 0 it needs

    (R2)   h(nD) + h(K − nD)  ≥  (n²/2) η − (n/2) D·K + χ₀      for all n ≥ 1,

for a section count h, a canonical class K and a constant χ₀. Restricted to primitive classes (R2) is equivalent to RH
(Remark 6.1), so it has to come from Riemann–Roch for all divisors. Theorem 6.2: on S_Q linear systems are convex
(principal divisors φ ↦ Π_φ form a linear space and there is no product of sections), |N·A| = {N·A}, and no h satisfying
(R1), (R2), (R4) exists with a canonical class of finite degree, whether or not RH holds. Making the genus finite means
truncating the zero set (Proposition 2.5, Remark 6.5), which is working below a verified height.

**Argument II.** §7, Theorem 7.2, Step B: for the even window space X_λ and the physical projector P onto the atlas head,

    (B)   q_λ[(I − P) f] ≥ −κ_λ ‖(I − P) f‖²,    κ_λ ≤ C (1 + log λ)^m λ^p,   for a cofinal sequence λ → ∞.

Steps A (atlas head theorem), C (Schur bound) and D (V7 floor reduction) are proved or cited. Given Step A, (B) with p = 0 is
equivalent to RH (Remark 7.3); only the vector (I − P)e₀ (box class) is needed, where (B) is the one-sided Landau bound
D(W) ≤ C(1 + W)^m. None of the mechanisms that prove Hodge index for surfaces supplies (B) on S_Q (§6, §8).

---

## 0. Audit alignment (read first)

Read for this revision: `/tmp/atlas-snap-historical-routes.md` (route atlas §§1–12 and closing line),
`/tmp/atlas-snap-PUBLICATION_SCOPE_2026-10-30.md`, and the module notes (arithmetic foundation, spectral head, signed
complement, whole-even certificate, spectral-denominator repair, Suzuki recurrence, prime memory, finite Suzuki
certificate); originals under `refs/pr/27:research/rh/`. The V7 floor reduction was read in
`refs/pr/27:research/rh/foundation/source/03-landau.tex` (§"Translation to a physical spectral floor").

The surface route itself is not an atlas route; it comes from route 27 of the fifty-routes campaign
(`formalization/routes/fifty-routes-synthesis-2026-10-15.md`). Its components overlap atlas routes as follows.

| Atlas unit | What the atlas records | Overlap with this note | What is different here, or how it is used |
|---|---|---|---|
| §2 twin ladder, shift bridge | strict shift comparison ⟺ a ≥ Δ; every-shift positivity is an RH-equivalent reformulation | Prop 2.4 (ghost index) is the S_Q form of route 27's twin-ladder ghost index | no shifted kernel is used; index statements are on graph-class spans |
| §3 information, criticality | positive densities, moments and Gibbs data cannot fix an absolute floor (H ↦ H − cI) | Prop 4.2: Euler product, functional equation and nonnegative point counts do not imply Hodge index (function-field fakes) | same conclusion for different objects; not repeated |
| §4 synchronization, Q_L = B_L − C_L | G_L(ε) ≤ 1 ⟺ Q_L ≥ −ε; toy damping proves nothing | Prop 8.1 uses the split q = A − P, P with nonnegative kernel | computes the exact reach of the positive-kernel (Zariski) certificate for the actual form: λ ≤ √2 |
| §5 vortices, heat collisions | determinant sign argument fails; global zero winding is RH (vortex-blocker Theorem A) | §8.5: deforming the surface in heat time is this route | not attempted |
| §7 discrete curvature, finite-prime rigidity | changing finitely many prime coefficients forces a negative dyadic matrix | §8.5: the Hodge index of S_Q is not open in the prime weights | used as a no-go for deformation in coefficients |
| §8 twistor, thin Hankel | absolute-kernel norm exceeds one at the first window; absolute domination gives no global bound | Prop 8.1 is the S_Q form of absolute domination (Zariski's lemma is a Schur test) | exact reach for the actual 5/4 form; shows the primes carry the positivity beyond λ ≈ 1.6 |
| §9 fixed-support positivity, null-symbol duals | fixed-support form and domain; negative lower surrogates are not negative actual forms; signed all-support bounds needed | Lemma 2.2: q_λ[F] = −P(D_F)² on primitive classes; finite-support Hodge index = fixed-support positivity | no new finite certificate is attempted |
| §10 Möbius energy, 7/8, V7 floor | ε₀(λ) ≥ −C(1+log λ)^m λ^p, p < 1 ⇒ no zeros in Re s > (1+p)/2; PR 14 reaches B = 0.87488665 conditionally on Xu–Sang; 0.874 needs a restricted fourth moment U^{39/40+ε}; the sixth-phase filter retains eigenvalue one | Step D of Theorem 7.2; §8.4; §10 | used in the forward direction; a converse (half-plane ⇒ defect bound) is proved only for the box family (Prop 9.2 (iii)), not for the full floor |
| §11 curvature cylinder, gamma bulk, Suzuki reserve | exact weighted encodings give no positivity; the gamma bulk realizes the gamma part only; local scalar DtN and Markov-trace models are obstructed; general nonlocal or coupled-field models are not excluded; a uniform positive margin is the wrong target | Theorem 2.1 is an exact encoding of the same kind; Theorem 3.4 puts every arithmetic-surface model in the coupled-field class; Theorem 9.1 and Prop 9.2 | Theorem 3.4 says what the coupled field must be (a Dirichlet form on the Riemann surface 𝒳(C), up to finite rank) |
| spectral-head module | near-null head F_λ = E_even G_λ, dim ≥ λ² − (4/π²)log²λ − …, ‖H_λ F‖ ≤ C_r w^{−r}‖F‖; no complement bound | Lemma 7.1, Theorem 7.2 (Step A), §7.3 | identification of the head with principal divisors and its measurement are new |
| signed-complement module | strong 4M clipping fails; a restricted positive safe sector exists; arbitrary complement directions are open | Step B of Theorem 7.2 is this open bound | not repeated; stated as the failing line |
| whole-even certificate, spectral repair | actual even form coercive for 1 < λ ≤ √(161/10) (internal review, replayed) | finite-support Hodge index on even classes in [−log λ, log λ] | cited as the current certified reach of Hodge index on S_Q |
| Suzuki recurrence, prime memory, finite Suzuki | Ψ(W) = (W/2) q_W[e₀]; Ψ ≥ 0 ⟺ RH (Suzuki); finite certificate to 10⁷ | Prop 9.2: Ψ(W) = −½ P(B_W)² for the box class B_W | translation, plus the statement that the box-class defect exponent is exactly Θ − 1/2 (Prop 9.2 (iii), classical in substance) |
| arithmetic foundation | one-sided Landau: D(W) ≤ C(1+W)^m e^{αW} ⇒ no zeros in Re s > 1/2 + α | Step D of Theorem 7.2 (through V7) | used, not re-proved |
| PUBLICATION_SCOPE | lower surrogates vs actual forms; finite prefixes; Ritz minima are upper bounds | every [M] number is labelled; Ritz values are used only as upper bounds (§7.3, §8.1) | — |

**The atlas closing line** names three open targets: an all-scale signed arithmetic estimate, a cofinal actual-form floor,
or an exhaustive theta boundary/collision certificate. Argument II aims at the second. Proposition 9.2 shows that the form
of it used by the V7 reduction is a statement about one class per support, which is the first target in surface language.
The third target is not addressed.

**Not repeated here** (each recorded in the atlas): new finite-support certificates (§9), clipping norms (signed complement
§1), absolute-domination bounds beyond computing their reach (§8, §11), heat-flow or winding arguments (§5), deformation of
prime coefficients (§7).

---

## 1. Target and template

### 1.1 The theorem aimed at

**Target.** For every class X of the space N(S_Q) of §2: X·X ≤ 2 (X·H)(X·V).

By Corollary 2.3 the target is equivalent to RH. The plan is to prove it as Hodge index is proved for an algebraic surface,
using only properties of S_Q that can be established without information about the location of zeros.

### 1.2 The function-field template (route 27)

For a curve C/F_q of genus g, on C × C with H = C × pt, V = pt × C and Γ_j the graph of the j-th power of Frobenius:

* (a) Γ_j·H = q^j, Γ_j·V = 1, Γ_j·Γ_k = q^j N_{k−j} (j < k), Γ_j² = q^j(2 − 2g).
* (b) P_j = Γ_j − H − q^j V satisfies −P_j·P_k = q^{(j+k)/2} S_{k−j}, S_n = q^{−n/2} Σ α_i^n: the twin-ladder Weil form is
  minus the intersection form on primitive Frobenius-graph classes.
* (c) Hodge index (NS(C × C) has signature (1, ρ − 1)) gives −P·P ≥ 0, hence RH for C.
* (d) Hodge index from Riemann–Roch: if D·A = 0 (A ample) and D² > 0, then χ(nD) = n²D²/2 − nD·K/2 + χ(O) forces
  h⁰(nD) + h⁰(K − nD) → ∞; h⁰(nD) = 0 because a nonzero effective divisor has positive A-degree; h⁰(K − nD) is bounded in
  terms of K·A; contradiction.

Route 27 found that the lift to Q stops at (O1) the infinite zero count (infinite genus) and (O3) the absence of a surface
Spec Z × Spec Z with Hodge index. This note constructs the analog of (a)–(b) for ζ (§2), proves the parts of (d) that can
be proved (§4, §5), identifies the part of (d) with no counterpart (§6), runs the same plan at finite support (§7), and
tests the other known proofs of Hodge index (§8).

---

## 2. Construction A: the graph-class space S_Q

### 2.1 Conventions

u ∈ R is the logarithm of a scaling factor e^u ∈ R₊^*, the connected component of the idele class group of Q, which acts
on the adele class space A_Q/Q^* by scaling. For a function Φ on R:

    Φ̂(z) = ∫ Φ(u) e^{izu} du,   d(Φ) = Φ̂(−i/2) = ∫ Φ(u) e^{u/2} du,   d′(Φ) = Φ̂(i/2) = ∫ Φ(u) e^{−u/2} du,
    Ǧ(u) = G(−u),   (F ⋆ Ǧ)(x) = ∫ F(u) G(u − x) du.

ρ = 1/2 + iγ_ρ runs over the nontrivial zeros of ζ with multiplicity (γ_ρ is complex when ρ is off the line). The Weil
distribution is W(Φ) = Σ_ρ Φ̂(γ_ρ).

Test classes: 𝒜 = real C_c²(R); 𝒫⁺ = {Π_φ : φ ∈ 𝒮₀}, 𝒮₀ the even real Schwartz functions with φ(0) = φ̂(0) = 0, and

    Π_φ(u) = e^{u/2} Σ_{n≠0} φ(n e^u)        (Tate's map E on the unramified sector).

Here φ̂(ξ) = ∫ φ(x) e^{−2πixξ} dx is the additive Fourier transform. Π_φ is smooth and decays faster than every exponential
at both ends (directly as u → +∞; by Poisson summation, Σ_{n≠0} φ(nx) = x^{−1} Σ_{n≠0} φ̂(n/x) when φ(0) = φ̂(0) = 0, as
u → −∞). §7 uses the same map for compactly supported sources with less smoothness (Lemma 7.1).

### 2.2 Local intersection multiplicities

For a prime p,

    ⟨K_p, Φ⟩ = log p · Σ_{m≥1} p^{−m/2} ( Φ(m log p) + Φ(−m log p) ),

and at the archimedean place

    ⟨K_∞, Φ⟩ = c_∞ Φ(0) + ∫_0^∞ ( Φ(y) + Φ(−y) − 2Φ(0) ) k(y) dy,
    c_∞ = γ_E + log 8π + π/2 = log π − ψ(1/4) = 5.372183…,   k(y) = e^{y/2} / (e^y − e^{−y}).

K = K_∞ + Σ_p K_p. Equivalently ⟨K_∞, Φ⟩ = −(1/2π) ∫ Φ̂(t) m(t) dt with m(t) = Re ψ(1/4 + it/2) − log π = 2θ′(t), θ the
Riemann–Siegel theta function (c_∞ = −m(0); m < 0 exactly for |t| < 6.28984).

*Derivation of the u-space form [P].* With ψ(z) = −γ_E + ∫_0^∞ (e^{−x} − e^{−zx})/(1 − e^{−x}) dx and
(1/2π)∫ Φ̂(t) e^{−itv} dt = Φ(v), substituting x = 2y gives

    (1/2π) ∫ Φ̂(t) Re ψ(1/4 + it/2) dt = −γ_E Φ(0) + ∫_0^∞ [ 2Φ(0)/(e^{2y} − 1) − (Φ(y) + Φ(−y)) k(y) ] dy.

Since 1/(e^{2y} − 1) − k(y) = (1 − e^{3y/2})/(e^{2y} − 1) and ∫_0^∞ (e^{3y/2} − 1)/(e^{2y} − 1) dy = (1/2)(ψ(1) − ψ(1/4))
= π/4 + (3/2) log 2, the constant is c_∞ = γ_E + log π + π/2 + 3 log 2. [M] The two forms agree to 2e-13 on four
Gaussians (`explicit.log`).

*Reading [L].* These are the local Lefschetz indices of the scaling flow on A_Q/Q^*: the graph of scaling by e^u meets the
graph of scaling by e^v along the periodic orbit of length log p when v − u = ±m log p, with index log p · p^{−m/2}, and
near the archimedean fixed point with density k (Connes 1999, semilocal trace formula; Meyer 2005). Nothing below depends
on this reading.

### 2.3 Classes and pairing

    N(S_Q) = R·H ⊕ R·V ⊕ { D_F : F ∈ 𝒜 + 𝒫⁺ },   D_F linear in F,
    H² = V² = 0,  H·V = 1,  D_F·H = d(F),  D_F·V = d′(F),  D_F·D_G = ⟨K, F ⋆ Ǧ⟩.

The pairing is symmetric because K is even. Formally D_F = ∫ F(u) Γ_u du with Γ_u the normalised graph class:
Γ_u·H = e^{u/2}, Γ_u·V = e^{−u/2}, and for u ≠ v, Γ_u·Γ_v = log p·p^{−m/2} + k(|u − v|) if u − v = ±m log p and k(|u − v|)
otherwise. Γ_u·Γ_u is not defined (the archimedean term diverges on δ₀; Proposition 2.5). Compare route 27 (a) with the
normalisation p_j = q^{−j/2} Γ_j: p_j·H = q^{j/2}, p_j·V = q^{−j/2}, p_j·p_k = q^{−|k−j|/2} N_{|k−j|}. The weights
q^{−n/2} N_n at delay n log q become Λ(n) n^{−1/2} at delay log n, and the genus term 2 − 2g becomes the archimedean kernel.

Primitive projection: P(X) = X − (X·V) H − (X·H) V. Then P(H) = P(V) = 0, P(X)·H = P(X)·V = 0, and
P(X)² = X² − 2 (X·H)(X·V).

### 2.4 Theorem 2.1 (the pairing represents the Weil form)

**Theorem 2.1 [P-L].** For F, G ∈ 𝒜 + 𝒫⁺,

    D_F·D_G = d(F) d′(G) + d′(F) d(G) − W(F ⋆ Ǧ),   equivalently   P(D_F)·P(D_G) = −W(F ⋆ Ǧ).

In distributional form −P(Γ_u)·P(Γ_v) = Σ_ρ e^{iγ_ρ(u − v)}, the analog of −P_j·P_k = q^{(j+k)/2} S_{k−j}.

*Proof.* Put Φ = F ⋆ Ǧ. Φ is in C_c⁴ (F, G ∈ 𝒜) or smooth with faster-than-exponential decay (one of them in 𝒫⁺), and
Φ̂(z) = F̂(z) Ĝ(−z) is entire. With x = u − v, d(Φ) = ∫∫ F(u) G(v) e^{(u−v)/2} du dv = d(F) d′(G), and likewise
d′(Φ) = d′(F) d(G). The Guinand–Weil explicit formula [L: Weil 1952; Bombieri 2000; Iwaniec–Kowalski §5.5] applies (Φ̂ is
holomorphic in |Im z| ≤ 1/2 + η with |Φ̂(t + iy)| ≪ (1 + |t|)^{−2} there, and the prime sum converges absolutely) and
reads, in the normalisation of §2.2,

    W(Φ) = d(Φ) + d′(Φ) − Σ_n Λ(n) n^{−1/2} ( Φ(log n) + Φ(−log n) ) − ⟨K_∞, Φ⟩ = d(Φ) + d′(Φ) − ⟨K, Φ⟩.

Hence ⟨K, Φ⟩ = d(F) d′(G) + d′(F) d(G) − W(Φ). The primitive form follows from
P(D_F)·P(D_G) = D_F·D_G − (D_F·V)(D_G·H) − (D_F·H)(D_G·V). ∎

Theorem 2.1 is the explicit formula read as a Gram identity, with the same logical status as route 27's identity (the
Lefschetz trace formula). It is an exact encoding of the kind recorded in atlas §11 (the curvature-cylinder metric
g = e^{−2D}(dr² + dθ²) with K_g dA_g = dν dθ): exact, and with no positivity in it. The positivity question is §5–§8.

**Checks [M]** (`explicit.log`, `referee.log`; v1, reproduced bit-for-bit). Gaussian classes F_c(u) = e^{−(u−c)²/2s²},
D = c₁ − c₂; zero side from the first 10⁶ Odlyzko zeros (on the line, accurate to ~1e-9), prime side from Λ(n), n ≤ 2·10⁶,
and the u-space kernel:

| s | D | W, zero side | W, prime + archimedean side | difference |
|---|---|---|---|---|
| 0.1 | 0.0 | +1.881160689507e-02 | +1.881160689641e-02 | −1.3e-12 |
| 0.1 | 0.7 | −1.598091608432e-02 | −1.598091608675e-02 | +2.4e-12 |
| 0.1 | 3.0 | +1.560403605344e-03 | +1.560403592170e-03 | +1.3e-11 |
| 0.1 | 6.0 | −1.550163631499e-02 | −1.550163631467e-02 | −3.2e-13 |
| 0.2 | 1.5 | −1.197855822682e-04 | −1.197855822561e-04 | −1.2e-14 |
| 0.2 | 3.0 | −1.235317023972e-06 | −1.235317159558e-06 | +1.4e-13 |

Independent re-implementation (§12, R1): zeros from mpmath.zetazero at 30 digits, the digamma form of K_∞, prime side in
mpmath: agreement 3.7e-32, 5.1e-32, 2.1e-31 for (s, D) = (0.2, 1.5), (0.25, 0.3), (0.3, 2.2).

### 2.5 Lemma 2.2 (this pairing is the atlas actual form) — new in revision 2

For f supported in [−ℓ, ℓ], λ = e^ℓ, the atlas actual supported form (whole-even certificate, eq. (1); spectral-head §1) is

    q_λ[f] = (1/2π) ∫ α(t) |f̂(t)|² dt + ∫∫ f(x) f(y) e^{|x−y|/2} dx dy − Σ_{2≤n<λ²} Λ(n) n^{−1/2} · 2 R_f(log n),
    α(t) = Re ψ(5/4 + it/2) − log π,   f̂(t) = ∫ f(y) e^{−ity} dy,   R_f(r) = ∫ f(x) f(x + r) dx.

**Lemma 2.2 [P].** For real f in the form domain and supported in [−ℓ, ℓ], with Φ = f ⋆ f̌,

    q_λ[f] = d(Φ) + d′(Φ) − ⟨K, Φ⟩ = 2 d(f) d′(f) − D_f² ,   and on primitive classes (d(f) = d′(f) = 0)   q_λ[f] = −P(D_f)².

For f ∈ 𝒜 the common value is also W(f ⋆ f̌) = Σ_ρ Φ̂(γ_ρ) (Theorem 2.1).

*Proof.* The first identity is algebra between two prime-side expressions; no zero is used. (i) d(Φ) + d′(Φ) =
2 d(f) d′(f) = ∫∫ f(x) f(y) 2cosh((x − y)/2) dx dy. (ii) −⟨K_∞, Φ⟩ = (1/2π)∫ m(t) |f̂(t)|² dt (§2.2; Φ̂ = |f̂|² for real f in
either Fourier convention), and α − m = Re[1/(1/4 + it/2)] = 1/(t² + 1/4), the Fourier transform of e^{−|x|/2}; so
(1/2π)∫ m |f̂|² + ∫∫ f f 2cosh = (1/2π)∫ α |f̂|² − ∫∫ f f e^{−|x−y|/2} + ∫∫ f f (e^{|x−y|/2} + e^{−|x−y|/2}), the gamma plus
continuum part of q_λ. (iii) Φ is supported in [−2ℓ, 2ℓ], so only n < λ² enter the prime sum, and Φ(±log n) = R_f(log n).
The middle expression is the definition of the pairing (§2.3), and the last identity is P(X)² = X² − 2(X·H)(X·V). ∎

[M] Both normalisations agree with the zero side independently: the v1 table above (to ≤ 1.3e-11) and the spline
implementation of q_λ in §7.3 (to ≤ 3e-10 at λ = 3–8). For complex even f the form splits as q[f₁ + if₂] = q[f₁] + q[f₂],
so positivity on real classes is the same statement.

**Consequence.** "q_λ ≥ 0 on X_λ" is the Castelnuovo–Severi inequality D² ≤ 2(D·H)(D·V) for classes supported in
[−log λ, log λ]. In particular: route 11's pole-free certificates (2a ≤ ln 6 clean, ln 7…ln 11 conditional on a tiling
patch; margins ≈ 10^(−4.8 e^{2a})) are Hodge index on primitive classes of support 2a; the atlas whole-even certificate is
Hodge index on even classes for λ ≤ √(161/10) [Atlas]. All of these lie inside the verified-height regime of RES-T
(half-width T_X = 3.88 at X = 3·10¹²) and are wall 3 statements.

### 2.6 Corollary 2.3 (Hodge index on S_Q is RH)

**Corollary 2.3 [P-L].** The following are equivalent: (i) RH; (ii) P(X)² ≤ 0 for all X ∈ N(S_Q); (iii) X² ≤ 2(X·H)(X·V)
for all X (Castelnuovo–Severi); (iv) on every finite-dimensional subspace containing H and V the pairing has exactly one
positive direction (Hodge index).

*Proof.* (ii) ⟺ (iii) by the formula for P(X)². (ii) ⟺ (iv): N(S_Q) = ⟨H, V⟩ ⊕ P(N(S_Q)) orthogonally, and ⟨H, V⟩ is a
hyperbolic plane. For X = aH + bV + D_F, P(X) = P(D_F) and P(D_F)² = −W(F ⋆ F̌) (Theorem 2.1). (i) ⟹ (ii): under RH
every γ_ρ is real; for real F, F̂(−γ) = conj F̂(γ), so W(F ⋆ F̌) = Σ_ρ |F̂(γ_ρ)|² ≥ 0 (= 0 for F ∈ 𝒫⁺, see Proposition
4.1). (ii) ⟹ (i): Weil's criterion [L: Weil 1952; Bombieri 2000]: if RH fails there is a complex F ∈ C_c^∞ with
W(F ⋆ F*) < 0, F*(u) = conj F(−u). Write F = A + iB with A, B real. Then W(F ⋆ F*) = W(A ⋆ Ǎ) + W(B ⋆ B̌) +
i W(B ⋆ Ǎ − A ⋆ B̌); B ⋆ Ǎ − A ⋆ B̌ is odd and the multiset {γ_ρ} is symmetric under γ ↦ −γ, so the last term vanishes,
and A or B is a real counterexample. ∎

### 2.7 Proposition 2.4 (ghost index)

**Proposition 2.4 [P].** Let 𝒰 ⊂ 𝒜 be finite-dimensional and ν ≤ ∞ the number of off-line zero quadruples
{ρ, ρ̄, 1 − ρ, 1 − ρ̄} (with multiplicity). The number of negative eigenvalues of F ↦ W(F ⋆ F̌) on 𝒰, which is the number
of positive directions of the intersection form on P(D_𝒰), is at most 2ν.

*Proof.* W(F ⋆ F̌) = Σ_{γ>0 on-line} 2|F̂(γ)|² + Σ_{quadruples} 4 Re[ F̂(w) · conj F̂(w̄) ], w = γ₀ − iδ. The first sum is
positive semidefinite; each quadruple contributes the real form 4 Re(a b̄) in (a, b) = (F̂(w), F̂(w̄)) ∈ C², of signature at
most (2, 2). If ν is finite the negative index of the sum is at most 0 + 2ν (Weyl); if ν = ∞ there is nothing to prove. ∎

This is the S_Q version of route 27's exact ghost index (atlas §2 records the corresponding shift statement). **Attainment
[M]** (`genus-ghost.log` (iii)): spans {F_{jh}}_{j<N}, s = 0.1, h = 0.3, actual zeros below 120, and one synthetic
quadruple at γ₀ = 17.5:

| N | λ_min, actual zeros | δ = 0.4 | δ = 0.2 | δ = 0.1 | δ = 0.05 | δ = 0.02 |
|---|---|---|---|---|---|---|
| 6 | 6.40e-05 | (5,1), −1.8e-4 | (6,0) | (6,0) | (6,0) | (6,0) |
| 10 | 6.58e-08 | (8,2), −8.1e-3 | (8,2), −1.6e-3 | (8,2), −1.3e-4 | (10,0) | (10,0) |
| 14 | 3.26e-09 | (12,2), −2.7e-2 | (12,2), −5.4e-3 | (12,2), −7.8e-4 | (12,2), −4.7e-5 | (12,2), −4.5e-6 |

Entries: (positive, negative) eigenvalue counts of W on the span and its smallest eigenvalue (mpmath, 40 digits). A ghost
appears as exactly 2 extra positive directions of the intersection form once the span resolves it.

### 2.8 Proposition 2.5 (the diagonal and the genus)

Let δ_ε(u) = (2π)^{−1/2} ε^{−1} e^{−u²/2ε²} and Δ_ε = D_{δ_ε}, the smeared diagonal. Theorem 2.1 gives
Δ_ε² = 2 e^{ε²/4} − 2g_ε with 2g_ε := W(δ_ε ⋆ δ̌_ε) = Σ_ρ e^{−ε² γ_ρ²}, the analog of Δ² = 2 − 2g.

**Proposition 2.5 [P-L].** 2g_ε = (log(1/ε) − γ_E/2 − log 4π) / (2√π ε) + 7/4 + o(1) as ε → 0.

*Proof.* N(T) = θ(T)/π + 1 + S(T), θ(T)/π + 1 = (T/2π) log(T/2πe) + 7/8 + O(1/T) [L: Riemann–von Mangoldt], ∫_0^T S =
O(log T). Write 2g_ε = 2∫_0^∞ 2ε²t e^{−ε²t²} N(t) dt (off-line zeros, |Im γ_ρ| < 1/2, change each term by a factor
1 + O(ε²)). The smooth part gives (log(1/ε) − γ_E/2 − log 4π)/(2√π ε), the constant 7/8 gives 7/4, the S(T) term is
O(ε log(1/ε)) after one integration by parts, and the O(1/T) and small-T terms are O(ε). ∎

**Measured [M]** (`genus-ghost.log` (i)): 2g_ε − leading term = 1.7580, 1.7526, 1.7507, 1.7503, 1.7501, 1.7500, 1.7500 at
ε = 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001; Δ_ε² = +1.7056 at ε = 0.1 and −1152.99 at ε = 0.001. The diagonal of S_Q
has self-intersection −∞; the regularised genus g_ε is half the number of zeros resolved at scale ε.

---

## 3. Construction B: Arakelov data, and what any arithmetic surface can carry

### 3.1 Setup

X = P¹_Z with coordinate t. Z_n is the closure of the closed point {Φ_n(t) = 0} of P¹_Q (Φ_n the n-th cyclotomic
polynomial), a horizontal divisor isomorphic to Spec Z[ζ_n]. For distinct horizontal divisors the Arakelov intersection is
(Z_m·Z_n)_fin = log |Res(Φ_m, Φ_n)| plus (Z_m·Z_n)_∞ = Σ_{a ∈ μ_m^*, b ∈ μ_n^*} g(a, b) for the Green's function g of the
chosen metric [L: Arakelov 1974; Faltings 1984]. Classical inputs: Λ(n) = log Φ_n(1) for n ≥ 2 [E: n ≤ 2000]; Apostol:
for m > n ≥ 1, |Res(Φ_m, Φ_n)| = p^{φ(n)} if m/n = p^k, and 1 otherwise [L: Apostol 1970; E: all 780 pairs n < m ≤ 40].

### 3.2 Theorem 3.1 (finite places of S_Q are cyclotomic intersections)

**Theorem 3.1 [P].** For m > n ≥ 1, (Z_m·Z_n)_fin = φ(n) log p if m/n = p^k, and 0 otherwise. With ẑ_n = Z_n/√φ(n),
(ẑ_m·ẑ_n)_fin = Λ(m/n) (m/n)^{−1/2} · c_p(n), c_p(n) = 1 if p | n, (1 − 1/p)^{−1/2} if p ∤ n. For M = lcm(1, …, B) and
m ≠ n ≤ B, (ẑ_{mM}·ẑ_{nM})_fin = Λ(m/n)(m/n)^{−1/2}: the prime part of the S_Q kernel at u = log m − log n.

*Proof.* Apostol's formula; φ(m)/φ(n) = p^k if p | n and p^{k−1}(p − 1) if p ∤ n. ∎ [E/M: 133 pairs with m ≤ 60, max
deviation of the ratio from c_p(n) 4.4e-16; the M = 60 family, 17 pairs, 5.6e-17.]

### 3.3 Theorem 3.2 (the archimedean place of P¹_Z cancels the primes)

**Theorem 3.2 [P].** If g(x, y) = −log|x − y| + U(x) + U(y) + c with U continuous (the form for a smooth hermitian metric
on O(1) [L]), then for m ≠ n, (Z_m·Z_n)_Ar = φ(n) u_m + φ(m) u_n + c φ(m) φ(n), u_m = Σ_{a ∈ μ_m^*} U(a): the normalised
off-diagonal matrix has rank ≤ 2 and contains no Λ.

*Proof.* Σ_{a,b} (−log|a − b|) = −log|Res(Φ_m, Φ_n)| = −(Z_m·Z_n)_fin (product formula for the integer Res). ∎
[M: Fubini–Study, ten pairs, 0.0 at 30 digits; an arbitrary U with c = 0.7, indices 2…15: deviation from the rank-2 form
1.8e-15, singular values (73.94, 0.185, 0, 0).]

*Remark (F₁ reading) [A].* The power maps x ↦ x^n on G_m ⊂ P¹ are the "Frobenius over F₁" (they commute and lift every
Frobenius); x ↦ x^n has n + 1 fixed points {0, ∞} ∪ μ_{n−1} on P¹, as Frob_q has q + 1 on P¹ over F_q, and Z_n is the set of
new fixed points at level n + 1. Theorem 3.2 is the genus-0 statement: on P¹ the primitive part of every power-map graph
vanishes, matching the zeta function 1/(s(s − 1)) of P¹ over F₁, which has no zeros. S_Q needs the infinite-genus curve.

### 3.4 Remark 3.3 (the archimedean place of S_Q has no sign of its own)

A and B agree at the finite places (Theorem 3.1) and differ at ∞: B's archimedean term is tied to the finite places by the
product formula; A's is the scaling kernel k, and in A the explicit formula d + d′ − ⟨K, Φ⟩ = W(Φ) replaces the product
formula with the zero sum on the right. [M] (`localinf.log`, `localinf-bisect.log`, v1, reproduced): on primitive classes
supported in [−a, a] (Legendre basis, 14 and 20 functions per sector) the archimedean local form is negative definite (in
intersection sign) only for 2a < 1.1916 (even) and 2a < 1.6052 (odd); the global form keeps its sign further (largest
eigenvalue −6.8e-5 at 2a = 1.2, −2.1e-10 at 1.6). Beyond 2a ≈ 1.19 the global sign is a cancellation between the
archimedean place and the primes (Proposition 8.1 measures the same for the 5/4 form on all even classes).

### 3.5 Theorem 3.4 (rank split on a fixed arithmetic surface) — new in revision 2

Let K be a number field and 𝒳 → Spec O_K a regular arithmetic surface (proper, flat, generic fibre a smooth geometrically
connected curve). Let Ĉh¹(𝒳)_R be its real arithmetic Chow group of codimension one (Gillet–Soulé) with the arithmetic
intersection pairing (·,·). Facts used [L: Gillet–Soulé 1990, Thm 3.3.5; Faltings 1984]:

* (F1) exact sequence A^{0,0}(𝒳_R) —a→ Ĉh¹(𝒳) —ζ→ CH¹(𝒳) → 0, with a(η) the class of (0, η);
* (F2) CH¹(𝒳) = Pic(𝒳) is finitely generated (Mordell–Weil for the Jacobian of the generic fibre, finitely many reducible
  fibres, finite class group of O_K); write ρ = rank Pic(𝒳);
* (F3) (a(η), a(η′)) = ½ ∫_{𝒳(C)} η dd^c η′ = −½ E(η, η′), with E(η, η′) = c ∫ dη ∧ d^c η′ ≥ 0 the Dirichlet form
  (zero exactly on locally constant η), and (x, a(η)) = ½ ∫ η ω(x), ω(x) the first Chern form of x.

**Theorem 3.4 [P-L].** For every real vector space V and linear L: V → Ĉh¹(𝒳)_R there are a linear η: V → A^{0,0}(𝒳_R)
and a symmetric bilinear form R on V with rank R ≤ 3ρ such that

    (L F, L G) = −½ E(η_F, η_G) + R(F, G)        for all F, G ∈ V.

In particular F ↦ (L F, L F) has at most 3ρ positive directions on V.

*Proof.* Choose a ρ-dimensional subspace Y ⊂ Ĉh¹(𝒳)_R with ζ(Y) = CH¹(𝒳)_R (F2) and a linear section s: CH¹_R → Y.
Put y_F = s(ζ(L F)). Then L F − y_F ∈ ker ζ = a(A^{0,0}) (F1); choose η_F linearly with a(η_F) = L F − y_F (a linear right
inverse of a on its image). Expanding, (L F, L G) = (y_F, y_G) + (y_F, a(η_G)) + (a(η_F), y_G) + (a(η_F), a(η_G)). Each of
the first three terms factors through F ↦ y_F or G ↦ y_G, with values in the ρ-dimensional Y, so each has rank ≤ ρ; their
sum R has rank ≤ 3ρ. The last term is −½ E(η_F, η_G) by (F3). Since −½E ≤ 0, the positive index of (L·, L·) is at most
rank R (Weyl). ∎

**Corollary 3.5 [P].** (a) If L: V → Ĉh¹(𝒳)_R satisfies (L F, L G) = −W(F ⋆ Ǧ) + B₀(F, G) with B₀ of finite rank r₀ (for
example the H, V terms, r₀ = 2), then W(F ⋆ F̌) = ½ E(η_F, η_F) − R(F, F) + B₀(F, F) has negative index ≤ 3ρ + r₀ on V.
(b) In such a model the whole Weil form, archimedean and prime parts together, is up to a form of rank ≤ 3ρ + r₀ the
Dirichlet energy ½ E(η_F, η_F) of a linear map into functions on the compact Riemann surface 𝒳(C). The prime part of W has
infinite rank already on a fixed window, so its Λ-atoms cannot come from the finite places of 𝒳 (which contribute rank
≤ 3ρ through R); they must be encoded, together with the gamma factor, in the archimedean energy.

*Proof.* (a) is Theorem 3.4 with W = −(L·, L·) + B₀. (b) The first sentence is (a) rewritten. For the rank: on L²[−L, L]
with 2L > log 2 the prime form is ⟨P_L f, f⟩, P_L = Σ_{n<e^{2L}} w_n (T_{log n} + T_{−log n}), (T_s f)(x) = f(x + s)
restricted to the window. Take ε smaller than every gap between the finitely many numbers log n < 2L − ε. On the
infinite-dimensional space of f supported in [L − ε, L], P_L f = Σ_n w_n f(· + log n) is a sum of pieces with disjoint
supports [L − ε − log n, L − log n], so P_L is injective there and has infinite rank. ∎

*What Theorem 3.4 says about the missing surface.* (i) On a fixed arithmetic surface the finite places contribute rank
≤ 3ρ. Theorem 3.1 is consistent with this: the cyclotomic cycles Z_n have finite intersection numbers carrying the
Λ-kernel, but their arithmetic classes are φ(n)·ĉ₁(Ō(1)) plus a multiple of a(1) (for the Fubini–Study metric,
(Z_n, −log‖Φ_n‖²_FS) = div^(Φ_n) exactly), so the Λ-kernel cancels inside each pairing between its finite and archimedean
parts (Theorem 3.2, product formula) and the pairing has rank ≤ 2. (ii) Any arithmetic-surface model of the Weil form
is, modulo finite rank, a Dirichlet energy of a linear map F ↦ η_F into functions on a Riemann surface. This is a
nonlocal coupled-field model, which atlas §11 leaves open (its no-go results cover local scalar Dirichlet-to-Neumann and
positivity-preserving Markov-trace models). (iii) Such a model would force W to have finite negative index; by
Proposition 2.4 finitely many off-line quadruples give finite index, and the converse is expected [A: a two-ended test
function F(x) = b(x − L) − b(x + L), modulated at the ordinate of a quadruple, gives F̂(w) F̂(−w) ≈ −¼ e^{2δL} b̃(δ) b̃(−δ);
controlling all other off-line zeros at once is not done here]. With the arithmetic Hodge index theorem on 𝒳 [L: Faltings
1984; Hriljac 1985; Moriwaki 1996], a model sending primitive classes into the orthogonal complement of an ample class
would give RH outright, so no model can be built from data that does not already carry RH-strength information.
(iv) Towers 𝒳_k with ρ_k → ∞ (modular curves, Fermat curves) are not excluded by Theorem 3.4; the height pairings
available on them (Gross–Zagier, Gross–Kohnen–Zagier) involve L-functions of modular forms, not ζ [A]. This replaces route
27's heuristic O3 by a statement with a proof: on a fixed arithmetic surface the infinite genus can live only at the
archimedean place, as a Dirichlet energy, and the finite places carry at most rank 3ρ; anything else needs a tower.

---

## 4. Soft axioms on S_Q, and why they are not enough

### 4.1 Definitions

* Eff = {aH + bV + D_μ : a, b ≥ 0, μ ∈ 𝒜, μ ≥ 0}. Two effective classes have no common graph component if
  0 ∉ supp(μ ⋆ ν̌).
* 𝒫 = {Π_φ ∈ 𝒫⁺ : d(Π_φ) = d′(Π_φ) = 0}, Prin = {D_Π : Π ∈ 𝒫}. A = H + V. X ≡ Y means X·Z = Y·Z for every Z.

### 4.2 Proposition 4.1 (the soft axioms hold)

**Proposition 4.1 [P].**
* **(A1) Local positivity.** If E, E′ ∈ Eff have no common graph component, E·E′ ≥ 0. *Proof.* Each local term of
  ⟨K, μ ⋆ ν̌⟩ is ≥ 0: Λ(n) ≥ 0, k > 0 on (0, ∞), and the terms at u = 0 vanish. This uses the positivity of the Dirichlet
  coefficients of −ζ′/ζ.
* **(A2) Ampleness.** E·A = a + b + ∫ 2cosh(u/2) dμ > 0 for E ∈ Eff, E ≠ 0.
* **(A3) Principal divisors are numerically trivial.** For Π ∈ 𝒫⁺ and X ∈ N(S_Q), D_Π·X = d′(Π)(H·X) + d(Π)(V·X); D_Π ≡ 0
  for Π ∈ 𝒫. *Proof.* Π̂_φ(z) = 2ζ(1/2 + iz) M_φ(1/2 + iz) (Tate), entire (the pole of ζ at 1 is cancelled by
  M_φ(1) = φ̂(0)/2 = 0, the poles of M_φ at −2, −4, … by the trivial zeros, and M_φ has no pole at 0 because φ(0) = 0), and
  vanishes at every γ_ρ with at least the multiplicity of ρ. Theorem 2.1 with W(Π ⋆ Ǧ) = 0 gives the claim. ∎
  [M] (`genus-ghost.log` (iv)): φ(x) = x²(x² − 3/2π)e^{−πx²}: d(Π) = d′(Π) = 1/(4π²); residuals 9.7e-15, 2.9e-15,
  1.8e-15, 5.6e-15 for four Gaussian G.
* **(A4) Degree zero.** If E ∈ Eff and E ≡ X with X·A = 0, then E = 0 and X ≡ 0. *Proof.* (A2). ∎

### 4.3 Proposition 4.2 (function-field fakes satisfy the soft axioms)

For a Weil-type polynomial P(T) = Π(1 − α_i T) over F_q (genuine L-polynomial or a fake from the route 27 census) define
the numerical surface with classes H, V, Γ_0, …, Γ_{2g+1} and the intersection numbers of §1.2 (a), N_n = q^n + 1 − Σ α_i^n.
Then (A1) ⟺ N_n ≥ 0, (A2) holds, (A4) follows, principal := numerically trivial, and the Gram identity holds by
construction.

**Proposition 4.2 [E]** (`fakes.log`; exact integer Gram, inertia by Descartes' rule on the real-rooted characteristic
polynomial):

| P(T) | q | g | N₁…N₅ | (A1) for d ≤ 60 | inertia (+, −, 0) | Hodge index |
|---|---|---|---|---|---|---|
| 1 + 3T + 5T² (y² = x³ + x + 1) | 5 | 1 | 9, 27, 108, 675, 3069 | yes | (1, 3, 2) | holds |
| 1 − 5T + 5T² (fake) | 5 | 1 | 1, 11, 76, 451, 2501 | yes | (2, 2, 2) | fails |
| 1 + 6T + 7T² (fake) | 7 | 1 | 14, 28, 434, 2016, 18494 | yes | (2, 2, 2) | fails |
| 1 + 2T + 6T² + 6T³ + 9T⁴ (y² = x⁵ + x² + 1) | 3 | 2 | 6, 18, 18, 78, 246 | yes | (1, 5, 2) | holds |
| 1 − T − 3T² − 3T³ + 9T⁴ (fake) | 3 | 2 | 3, 3, 9, 75, 168 | yes | (2, 4, 2) | fails |
| 1 − T + 7T² − 3T³ + 9T⁴ (fake) | 3 | 2 | 3, 23, 39, 35, 168 | yes | (3, 3, 2) | fails |

Local positivity, ampleness, numerically trivial principal divisors, an Euler product with nonnegative closed-point counts,
a functional equation and rationality together do not imply Hodge index (the analog of atlas §3 for these axioms). In
Weil's proof the extra input is Riemann–Roch on an actual surface.

---

## 5. Argument I: the Hodge-index argument on S_Q

### 5.1 Riemann–Roch data

For L ∈ N(S_Q) let |L| = {E ∈ Eff : E − L ∈ Prin}. A **Riemann–Roch datum** is (h, K, χ₀) with h: N(S_Q) → [0, ∞),
K ∈ N(S_Q), χ₀ ∈ R, such that

* (R1) h(L) > 0 only if |L| ≠ ∅;
* (R2) h(L) + h(K − L) ≥ (1/2) L·(L − K) + χ₀ for every L;
* (R3) h(L) ≤ β(L·A) for some function β;
* (R4) h(L) ≤ 1 whenever |L| has at most one element.

On C × C: h = h⁰, K the canonical class, χ₀ = χ(O); (R1), (R4) by definition, (R2) is Riemann–Roch with Serre duality and
h¹ ≥ 0, (R3) bounds h⁰ by degree against an ample class [L].

### 5.2 Theorem 5.1 (the argument)

**Theorem 5.1 [P].** If S_Q carries a Riemann–Roch datum satisfying (R1)–(R3), then RH holds.

*Proof.*
* **Step 0.** Suppose RH fails. By Corollary 2.3 there is X with P(X)² > 0. Put D = P(X): D·H = D·V = D·A = 0, D² = η > 0.
* **Step 1** (h(nD) = 0 for n ≥ 1). If h(nD) > 0, by (R1) there is E ∈ Eff with E − nD ∈ Prin. By (A3) E ≡ nD, so
  E·A = 0, and by (A4) E = 0 and nD ≡ 0, so η = 0, a contradiction.
* **Step 2** (Riemann–Roch). By (R2) with L = nD: h(nD) + h(K − nD) ≥ (n²/2) η − (n/2) D·K + χ₀.
* **Step 3** (boundedness). By (R3), h(K − nD) ≤ β(K·A).
* **Step 4.** β(K·A) ≥ (n²/2) η − (n/2) D·K + χ₀ for every n ≥ 1 fails for large n. Hence RH. ∎

Every step except the existence of the datum is proved: Step 0 by Corollary 2.3, Step 1 by Proposition 4.1, Steps 3–4 by
arithmetic. **Argument I stands or falls with Step 2.**

---

## 6. Where Argument I fails

**Remark 6.1 (the primitive-only inequality is RH) [P].** Theorem 5.1 uses (R2) only for L = nD, D primitive. Restricted to
primitive L, (R2) is equivalent to RH: under RH the datum h ≡ 0, K = 0, χ₀ = 0 satisfies (R1), (R3), (R4) and (R2) for every
primitive L, since (1/2)L·L = (1/2)P(L)² ≤ 0; if RH fails, Steps 1, 3, 4 refute it. In Weil's setting the primitive case is
inherited from Riemann–Roch for all divisors; the question is whether S_Q has that source.

**Theorem 6.2 [P].** (a) For every N ≥ 1, |N·A| = {N·A}. (b) If K = cH + c′V + D_κ (κ ∈ 𝒜 + 𝒫⁺ or a compactly supported
measure), then |K − N·A| = ∅ for N > min(c, c′). (c) No function h satisfies (R1), (R2) and (R4) with such a K: for large
N, h(N·A) + h(K − N·A) ≤ 1 while (1/2) N·A·(N·A − K) + χ₀ = N² − (N/2)(c + c′ + d(κ) + d′(κ)) + χ₀ → ∞. This holds whether or
not RH is true.

*Proof.* (a) E = aH + bV + D_μ ∈ |N·A| means (a − N)H + (b − N)V + D_μ ∈ Prin; in the direct sum this forces a = b = N and
μ = Π ∈ 𝒫 with Π ≥ 0, and d(Π) = ∫ Π e^{u/2} du = 0 forces Π = 0. (b) E − (K − N·A) ∈ Prin forces a = c − N, b = c′ − N,
both negative for N > min(c, c′). (c) h(K − N·A) = 0 by (R1) and (b); h(N·A) ≤ 1 by (R4) and (a); A² = 2,
A·K = c + c′ + d(κ) + d′(κ). ∎

Theorem 6.2 does not use (R3); (R2) already fails at L = N·A, where on C × C it is a statement about products of sections
of O(pt) on the two factors.

**Remark 6.3 (finer equivalence) [P].** Declaring every numerically trivial class principal makes |L| the intersection of the
convex cone Eff with an affine subspace whose defining conditions are homogeneous in L, so |N·A| = N·|A|. Any h depending
on |L| up to dilation (for example the dimension of its affine hull) has h(N·A) = h(A), and (R2) fails as in (c). On C × C,
|N·A| is a projective space of dimension (N + 1 − g)² − 1: its members are divisors of sections of degree N in the ring
⊕_N H⁰(N·A), i.e. they come from multiplying sections. S_Q has addition of divisors and a linear space of principal
divisors (φ ↦ Π_φ is linear), but no multiplication of sections. §7 shows that the atlas spectral head supplies a quadratic
count (≈ λ² principal classes at support λ) that does grow like a section count; what it does not supply is the link (R1)
from sections to effective classes of the bad class nD (Remark 7.4).

**Remark 6.4 (what would be needed; O3) [A].** A quadratic Hilbert function h(N·A) ~ N²·A²/2 needs a graded ring of
sections of growing rank. Over Z: Spec Z ×_Z Spec Z = Spec Z, rank-one lattices whose log-counts add (van der Geer–Schoof
h⁰ ≈ degree [L]); arithmetic surfaces X → Spec Z have section lattices of rank ~N, arithmetic Hilbert–Samuel and an
arithmetic Hodge index theorem [L], but by Theorem 3.4 their pairings carry the Weil form only as an archimedean Dirichlet
energy up to finite rank; tensor products over F₁ or the sphere spectrum are the setting of Connes–Consani's Riemann–Roch
for Spec Z and of the arithmetic-site square [L, not re-verified], where a Riemann–Roch theorem with the intersection
numbers of S_Q, archimedean place included, is not available (imp-1343: RR1/RR2).

**Remark 6.5 (canonical class; O1) [A].** On C × C, K ≡ (2g − 2)·A and adjunction gives Δ² + K·Δ = 2g − 2. On S_Q, if
K ≡ c·A and adjunction held for the smeared diagonal with a bounded genus term, then 2c = K·Δ_ε + O(1) = −Δ_ε² + O(1) =
2g_ε + O(1) → ∞ (Proposition 2.5): Step 3 becomes empty. Truncating to finite genus keeps the zeros up to height ≈ 1/ε,
i.e. works below a verified height (wall 3).

---

## 7. Argument II: the surface at finite support

### 7.1 Lemma 7.1 (the atlas head consists of truncated principal divisors) — new

Notation of the spectral-head module: λ > 1, ℓ = log λ, X_λ = L²_even[−ℓ, ℓ], q_λ the actual form (Lemma 2.2), H_λ its
operator; for g on the additive interval [−λ, λ], E_raw g(x) = e^{x/2} Σ_{1≤n<λe^{−x}} g(n e^x) and
E_even g = ½(E_raw g(x) + E_raw g(−x)) on |x| < ℓ; G_λ = positive-χ prolate span with deficit ≤ a_λ = λ^{−4}w^{−(3+2r)},
w = 1 + log λ, intersected with 1^⊥; F_λ = E_even G_λ.

**Lemma 7.1 [P-L].**
(a) For g supported in [−λ, λ], E_raw g = ½ Π_g on (−ℓ, ℓ), and Π_g = 0 on [ℓ, ∞).
(b) If g is even, supported in [−λ, λ], smooth near 0, with g′ of bounded variation and g(0) = g(±λ) = ∫ g = 0 (the atlas
repaired source class), then Π_g is an admissible class, Π̂_g(z) = 2ζ(1/2 + iz) M_g(1/2 + iz) is entire, vanishes at every
γ_ρ, and is O(|t|^{−3/2+η}) on the lines Im z = y, |y| ≤ 1/2 + η (O(|t|^{−7/4}) on the real line); hence P(D_{Π_g}) = 0 and
Π_g(−·) = Π_ĝ is principal as well.
(c) With T_g = Π_g · 1_{(−∞, −ℓ]} (the exterior tail), the window class F = Π_g · 1_{(−ℓ, ℓ)} satisfies
P(D_F) = −P(D_{T_g}); in particular P(D_F)·X = −P(D_{T_g})·X for every X, and P(D_F)² = P(D_{T_g})².
(d) For every g ∈ G_λ, F_g = E_even g is the even part of the window restriction of the principal class ½ Π_v plus the
endpoint-repair image b_g F_p, where v = g − b_g p − d_g η_λ is the atlas repair (b_g = g(λ), d_g = g(0)). Therefore the atlas
estimate (T1), ‖H_λ F‖ ≤ C_r w^{−r} ‖F‖ on F_λ [Atlas], is a quantitative finite-support form of (A3): principal divisors
truncated to the window act with small operator norm, and by (c) their action is the action of their exterior tails.

*Proof.* (a) For |x| < ℓ the terms with n e^x > λ vanish, and Π_g(x) = 2 e^{x/2} Σ_{n≥1} g(n e^x) for even g; for x ≥ ℓ every
n ≥ 1 has n e^x ≥ λ. (b) For Re s > 1, ∫ Π_g(u) e^{(s−1/2)u} du = 2 ζ(s) M_g(s), M_g(s) = ∫_0^∞ g(x) x^{s−1} dx. The pole
of ζ at s = 1 is cancelled by M_g(1) = ½ ∫ g = 0; M_g is holomorphic for Re s > −2 because g(0) = 0 and g is even and smooth
near 0, and its poles at −2, −4, … (Taylor coefficients of g at 0) are cancelled by the trivial zeros of ζ. Two integrations
by parts (g(λ) = 0, g′ of bounded variation, g′(0) = 0) give M_g(s) = O(|s|^{−2}) on vertical lines with Re s ∈ [−η, 1 + η],
and the convexity bound |ζ(σ + it)| ≪ |t|^{1/2+η} there (|t|^{1/4} on σ = 1/2) gives the stated decay of Π̂_g. The explicit
formula then applies to Π_g ⋆ Ǧ (G ∈ 𝒜; the transform Π̂_g(z)Ĝ(−z) is O(|t|^{−7/2+η}) in the strip) and gives
W(Π_g ⋆ Ǧ) = Σ_ρ Π̂_g(γ_ρ) Ĝ(−γ_ρ) = 0, so P(D_{Π_g}) = 0 by Theorem 2.1 (d(Π_g) = 2M_g′(1) and d′(Π_g) = −M_g(0) are
finite). Poisson summation with g(0) = ĝ(0) = 0 gives Π_g(−u) = Π_ĝ(u); its transform Π̂_g(−z) vanishes at every γ_ρ too
(the zero set is symmetric under γ ↦ −γ), so the reflected class is principal as well.
(c) Π_g = F + T_g by (a); T_g(u) = O(e^{3u/2}) as u → −∞ (Π_g(−u) = Π_ĝ(u) and ĝ(ξ) = O(|ξ|^{−2})), so T̂_g is holomorphic
on Im z < 3/2, d(T_g), d′(T_g) are finite, and T̂_g = O(1/|t|) on horizontal lines (one jump at −ℓ); the explicit formula
applies to T_g ⋆ Ǧ and T_g ⋆ Ť, and Σ_ρ Π̂_g(γ_ρ) T̂_g(−γ_ρ) converges absolutely and vanishes. By linearity
P(D_F) = P(D_{Π_g}) − P(D_{T_g}) = −P(D_{T_g}). (d) The atlas states E_raw η_λ = 0 on the window, so
F_g = F_v + b_g F_p, and v satisfies (b). By (a), E_raw v = ½ Π_v on the window and E_raw v(−x) = ½ Π_v(−x) = ½ Π_v̂(x),
so F_v is the window restriction of the principal class ¼ (Π_v + Π_v̂). ∎

Lemma 7.1 is an identification, not new analysis: (T1), its proof, and the endpoint charge ‖H_λ F_p‖ ≤ C√(λw) are the
atlas's. What the surface lens adds is the meaning of each piece: the head is the finite-support trace of Prin (the
numerically trivial classes), (T2) counts it, and (V) + (A) in the atlas proof is (c): a class that agrees with a principal
divisor on the window is numerically equivalent, on its primitive part, to minus its exterior tail.

### 7.2 Theorem 7.2 (Argument II)

**Theorem 7.2 [P from cited inputs].** Assume

* **(A) [Atlas, spectral head (T1)]** for each fixed r > 0 and all sufficiently large λ, F_λ ⊂ Dom(H_λ) and
  ‖H_λ F‖ ≤ η_λ ‖F‖ on F_λ, η_λ = C_r (1 + log λ)^{−r};
* **(B) [open]** for a cofinal sequence λ_k = 2^k and P the physical L² projector onto F_λ,
  q_λ[(I − P) f] ≥ −κ_λ ‖(I − P) f‖² for f ∈ Dom(q_λ) ∩ X_λ, with κ_λ ≤ C (1 + log λ)^m λ^p, 0 ≤ p < 1.

Then:

* **(C) [P]** ε₀^{even}(λ_k) := inf_{‖f‖=1} q_{λ_k}[f] ≥ −(η_{λ_k} + max(η_{λ_k}, κ_{λ_k})), and by monotonicity of ε₀ in λ
  (nested supports) ε₀^{even}(λ) ≥ −C′(1 + log λ)^m λ^p for all large λ;
* **(D) [Atlas/V7, 03-landau.tex]** hence ζ(s) ≠ 0 for Re s > (1 + p)/2. With p = 0 this is RH.

*Proof.* (C) Write f = Pf + Qf, Q = I − P. Since Pf ∈ Dom(H_λ), q[f] = ⟨H Pf, Pf⟩ + 2 Re⟨H Pf, Qf⟩ + q[Qf]. By (A),
|⟨HPf, Pf⟩| ≤ η‖Pf‖² and 2|⟨HPf, Qf⟩| ≤ 2η‖Pf‖‖Qf‖ ≤ η(‖Pf‖² + ‖Qf‖²); by (B), q[Qf] ≥ −κ‖Qf‖². Hence
q[f] ≥ −2η‖Pf‖² − (η + κ)‖Qf‖² ≥ −(η + max(η, κ))‖f‖². For 2^{k−1} ≤ λ ≤ 2^k, ε₀(λ) ≥ ε₀(2^k), which changes only C.
(D) V7 (03-landau.tex, "Translation to a physical spectral floor"): for the even unit box e₀ = W^{−1/2} on a window of width
W = 2 log λ, Q_W[e₀] = A₀₀(W) − 2D(W)/W with 0 ≤ A₀₀(W) − a(0) < 0.8, so Q_W[e₀] ≥ ε₀^{even}(λ) ≥ −C(1 + W)^m e^{pW/2}
gives D(W) ≤ C″(1 + W)^{m+1} e^{(p/2)W}, and the one-sided Landau theorem (arithmetic-foundation module, §2, proved
there) gives no zeros in Re s > 1/2 + p/2. ∎

**Remark 7.3 (Step B is RH) [P].** Given (A), (B) with p = 0 is equivalent to RH: RH gives q_λ ≥ 0, hence (B) with κ = 0;
conversely Theorem 7.2. So (B) cannot be supplied as an independent input; it needs a mechanism. Two sharpenings: (i) the
proof of (D) uses only the vector e₀, so (B) is needed only on the one vector (I − P)e₀, where (given (A)) it is equivalent
to the one-sided Landau bound D(W) ≤ C(1 + W)^m, i.e. to Suzuki's box criterion with polynomial defect (Proposition 9.2);
(ii) (B) needs no positive margin: κ_λ may be a polynomial. A uniform positive margin on the complement is not expected even
under RH [A]: the complement's lowest eigenvalues come from transition classes (Tate images of prolates just beyond the
deficit cutoff), whose energy decreases with their deficit (§7.3: 2.1e-4 and 4.0e-4 at λ = 6, 8), consistent with atlas
§11.

**Remark 7.4 (the head as a section count) [A].** dim F_λ ≥ λ² − (4/π²) log²λ − … [Atlas (T2)] grows quadratically, as
h⁰(N·A) does on C × C with N ~ λ: the head is the "space of sections" of the window class that Theorem 6.2 says the
class-level linear systems lack. It does not repair Argument I: Theorem 5.1 needs sections of nD for the bad primitive
class D (Step 1, through (R1)), and the head supplies sections only of window classes, with no map to effective
representatives of nD.

### 7.3 Measurements: the bottom of the Weil spectrum is the Tate image of the prolate head [M]

`tmp/rha-arith-surface-head.py` builds q_λ (Lemma 2.2 normalisation) on uniform cubic B-splines filling [−ℓ, ℓ]. Every term
of q_λ is translation invariant, so the Galerkin matrix is Toeplitz, Q_ij = τ((j − i)h) with τ = κ ∗ A, A = B ⋆ B; the gamma
part is computed by a periodised trapezoid rule (exponentially accurate), the continuum and prime parts in closed form.
Validation against the zero side 2 Σ_{γ>0} |F̂(γ)|² (10⁶ zeros, on the line) for smooth random coefficient vectors:
relative agreement 2e-12, 4e-11, 1e-10, 4e-11, 3e-11 at λ = 3, 4, 5, 6, 8. Prolates: even eigenfunctions of
(Cg)(t) = ∫_{−λ}^{λ} g(s) e^{2πist} ds by Nyström discretisation; head = positive χ, deficit δ ≤ a_λ (r = 1/2), mean zero;
images E_even g by Nyström interpolation; spline projection, principal angles in the L² metric. Refined run (`--v2 2`,
h ≈ 1/(4.4 λ²)), even sector:

| λ | λ² − (4/π²)log²λ | head dim (prolates) | eigenvalues < 1e-3 | max / median principal angle, head vs bottom eigenspace | eig #k (k = head dim) | eig #k+1 | next | spline residual of head images |
|---|---|---|---|---|---|---|---|---|
| 3 | 8.5 | 7 (8) | 7 | 1.94° / 6e-9° | 8.5e-6 | 1.25e-2 | 0.598 | 2.8e-3 |
| 4 | 15.2 | 14 (15) | 14 | 3.82° / 8e-10° | 4.2e-5 | 3.27e-2 | 0.414 | 9.9e-3 |
| 5 | 24.0 | 23 (24) | 23 | 6.46° / 2e-9° | 1.4e-4 | 6.19e-2 | 0.392 | 2.1e-2 |
| 6 | 34.7 | 33 (34) | 34 | 1.56° / 1e-9° | 1.2e-5 | 2.09e-4 | 0.072 | 2.2e-3 |
| 8 | 62.3 | 61 (62) | 62 | 2.21° / 5e-10° | 3.9e-5 | 4.03e-4 | 0.073 | 3.6e-3 |

Eigenvalues are relative to L²; the bottom of each cluster sits at the double-precision floor (~1e-11), consistent with
route 11's certified margins ≈ 10^(−4.8 e^{2a}). Identification of eigenvalue #k+1 (`--v3`, `--v4`): its eigenvector makes
|cos| = 0.996, 0.979, 0.960, 0.992, 0.987 with the Tate image of the first positive prolate beyond the cutoff (deficits
5.0e-3, 8.1e-3, 1.1e-2, 4.0e-5, 9.3e-5), both projected onto the complement of the head; that image alone has Rayleigh
quotient 0.022, 0.072, 0.158, 0.0042, 0.0068 after projection (the eigenvalue is lower because small admixtures matter when
energies span orders of magnitude). It is not the mean direction (Rayleigh 0.72–2.5). The odd sector shows a cluster of the
same size (counts below 1e-2: 7, 14, 22, 32, 58 in the coarse run).

What this shows: at these supports the bottom k eigenvectors of the Weil form on X_λ (k = head dimension) span, up to small
angles caused by the edge vectors, the finite-support principal divisors; the next eigenvalue comes from a partially
principal (transition) class, with energy increasing with its deficit; the rest of the spectrum starts at 0.07–0.6. In surface
terms, X_λ ≈ Prin_λ ⊕ Num_λ, and Step B is Hodge index on Num_λ. What it does not show: anything about RH. All these
supports have half-width ℓ ≤ log 8 = 2.08 < T_X = 3.88, the regime in which fixed-support positivity follows from the
verified height (RES-T); the numbers are Ritz values (upper bounds for the true eigenvalues), not certificates. The coarse
run (h ≈ 1/(2.2 λ²), `head-<λ>.json`) under-resolves the edge vectors (residuals up to 0.10, max angles up to 31°); the
refined run is the one quoted.

### 7.4 Where Argument II fails

Step B. Given (A) it is RH (Remark 7.3), so it needs a mechanism, and the surface supplies none: Riemann–Roch is not
available (Theorem 6.2, Remark 7.4); positive-kernel domination reaches only λ ≤ √2 (Proposition 8.1); a polarization would
be a Hilbert–Pólya structure (§8.2); an arithmetic-surface model must put the whole complement into an archimedean
Dirichlet energy (Theorem 3.4). This is the open complement boundary of the atlas spectral-head module ("nothing above
supplies a lower bound on the correctly projected complementary diagonal block or its inverse-weighted Schur charge") and
of the signed-complement module ("a genuinely signed bound on arbitrary physical-complement directions").

---

## 8. Other proofs of Hodge index, tried on S_Q

### 8.1 Zariski's lemma = positive-kernel domination (Proposition 8.1) — new

Zariski's lemma proves negativity of an intersection matrix from nonnegative off-diagonal entries (distinct curves meet
nonnegatively) and a positive null vector (a fibre); it is the Schur test with a positive weight. On S_Q the nonnegative
kernel is (A1): write q_λ = A_λ − P_λ, A_λ = gamma + continuum part, P_λ = Σ_{n<λ²} w_n (T_{log n} + T_{−log n}),
w_n = Λ(n)/√n, T_s f = f(· + s) restricted to the window. For a nonnegative kernel |⟨P f, f⟩| ≤ ⟨P|f|, |f|⟩, so ‖P‖ is
approached on nonnegative vectors, and a certificate that uses only the sign of the prime kernel (Schur test with a positive
weight, Zariski's lemma) can at best prove λ_min(A_λ) ≥ ‖P_λ‖.

**Proposition 8.1.** (i) [P] For λ ≤ √2, P_λ = 0 and the certificate is the archimedean statement A_λ ≥ 0. For even
classes this holds because q_λ = A_λ there and the atlas whole-even certificate covers λ ≤ √(161/10) [Atlas]; it is also the
archimedean positivity of Connes–Consani 2021 [L, from memory]. Ritz values (upper bounds, so not a proof of positivity):
0.0387 (even), 0.435 (odd) at λ = 1.3 [M].
(ii) [P] For every λ > √2, ‖P_λ‖ on X_λ is at least w₂ = log 2/√2 = 0.4901: take two nonnegative bumps of width ε at
±(log 2)/2 (even, inside the window since log 2 < 2ℓ); every prime term is ≥ 0 on nonnegative f, and the n = 2 term gives
2w₂ R_f(log 2)/‖f‖² = w₂.
(iii) [M + P] λ_min(A_λ) is nonincreasing in λ (nested windows) and λ_min(A_{1.3}) ≤ 0.0387 (Ritz upper bound), so the
certificate fails for every λ > √2. Moreover A_λ alone is indefinite from λ ≈ 1.6 on (Ritz minima, even/odd: −0.0076/−0.21
at λ = 1.6, −0.22/−0.68 at 2, −0.66/−1.49 at 3, −0.92/−2.23 at 4), while q_λ stays positive (measured; certified for even
classes to λ = √16.1 [Atlas]).

So Dirichlet-coefficient positivity, used as Zariski uses local positivity, certifies Hodge index exactly on the prime-free
window λ ≤ √2 and nowhere beyond. Past λ ≈ 1.6 the prime term is not an adversary to be dominated: on the directions where
the archimedean part is negative, −⟨P f, f⟩ > 0 supplies the positivity. This is the S_Q form of atlas §8 (absolute-kernel
domination fails at the first window) and §11 (absolute transport cost ≥ c_μ λ/√log λ), and of atlas §4's Q_L = B_L − C_L.
`zariski.json`; the spline values of ‖P_λ‖ (0.149 at λ = 1.45) underestimate the true norm because the grid does not
resolve the edge bumps of (ii).

### 8.2 Rosati positivity (Weil 1948)

Weil proved Hodge index for C × C through Tr(u u†) > 0 on End(J) ⊗ R, using the ample theta divisor. On S_Q the Rosati form
is F ↦ W(F ⋆ F̌) = Tr_{H¹}(U(F) U(F)†); a polarisation (a positive Hermitian structure on N(S_Q)/Prin for which
U(F)† = U(F̌)) built without the zeros would prove RH. At finite support this is a positive Hermitian structure on Num_λ,
i.e. Step B. It is the Hilbert–Pólya problem; the sibling attempt `2026-11-01-operator.md` works on it, and the atlas
spectral-head and signed-complement modules record its finite-support state.

### 8.3 Néron–Tate heights (Faltings–Hriljac)

For a fibred surface the Hodge index on horizontal classes is the positivity of the Néron–Tate height on the Jacobian of the
generic fibre. Theorem 3.4 is the precise reason this cannot host S_Q on a fixed arithmetic surface: Mordell–Weil makes the
finite part of the pairing finite-rank, and the remainder is an archimedean Dirichlet energy.

### 8.4 Deligne's tensor-power trick, with the V7 lever

In Weil II the bound |α_x| ≤ q_x^{w/2} for local Frobenius eigenvalues comes from Landau's lemma applied to the L-functions
of (F ⊗ F̄)^{⊗k}, whose coefficients |Tr|^{2k} are ≥ 0, with the pole location fixed by H²_c uniformly in k:
|α|^{2k} ≤ q^{kw+1} gives |α| ≤ q^{w/2 + 1/(2k)}. For ζ the local parameters are trivial (GL₁) and the zeros are global
data; the available positive-coefficient series (−ζ′/ζ, ζ^k) have their only real singularity at s = 1 and give no
information on zeros. The V7 floor (atlas §10) converts a floor exponent p into Re ρ ≤ (1 + p)/2. An amplification would
need a family of forms indexed by k with floors λ^{p_k}, p_k → 0, whose zeros are images of ζ's zeros; the convolution
powers D_F ↦ D_{F^{∗k}} act on the ρ-line by F̂(γ_ρ)^k but are test functions of the same form at support kℓ, so their
floor exponent is the same p [P]. The 7/8 half-plane (openai/math family 003, Lean-checked locally with standard axioms, not
peer-reviewed) and PR 14's conditional B = 0.87488665 are zero-free half-planes. On the box family they are exactly
Castelnuovo–Severi with defect exponent Θ − 1/2 in W (Proposition 9.2 (iii)), because the box's zero sum converges
absolutely. For the full floor ε₀ (all directions) the converse of V7 (half-plane ⇒ floor with p = 2Θ − 1) is not
established here or in the atlas: for high-frequency test functions the obvious estimate loses the local zero density
log T, so it would need a density input. Neither input moves Step B.

### 8.5 Deformation (signature is constant until a degeneracy)

Heat time: deforming the surface along H_t is the vortex route (atlas §5; wall 1; the global box-winding statement is RH,
vortex-blocker Theorem A). Support: the first degenerate support would carry a Krein kernel vector; atlas §8–§9 and RES-T
(B3) record the pointwise wall behind it. Prime weights: atlas §7 proves that changing finitely many prime coefficients
forces a negative finite dyadic matrix, so Hodge index on S_Q is not an open condition in the coefficients and no path
through nearby arithmetic exists. Archimedean factor: no deformation of Γ(s/2) keeps the Euler product.

### 8.6 Bombieri–Stepanov

Stepanov's method needs a ring endomorphism of the function field (g ↦ g^q = g ∘ Frob) to build auxiliary functions
vanishing at all rational points. The power maps x ↦ x^n on G_m are such endomorphisms (Remark after Theorem 3.2), but on the
genus-0 curve; Spec Z with its zeros has none.

---

## 9. Single-level statements

### 9.1 Theorem 9.1 (single-level Hodge index is a smoothed Hasse–Weil bound; v1 Theorem C)

Fix s > 0, F(u) = e^{−u²/2s²}, Φ = F ⋆ F̌, Φ̂(z) = 2π s² e^{−s²z²}, S(u) = W(Φ(· − u)) = Σ_ρ Φ̂(γ_ρ) e^{iγ_ρ u},
Σ_u = span{H, V, D_F, D_{F(·−u)}}.

**Theorem 9.1 [P].** (a) The pairing has exactly one positive direction on Σ_u iff |S(u)| ≤ S(0). (b) Under RH,
|S(u)| ≤ S(0) for every u. (c) If RH fails, S is unbounded on [0, ∞). (d) With x = e^u and κ(t) = t^{−1/2} Φ(log t), (a)
reads |x ∫_0^∞ κ + d′(Φ) − ψ_κ(x) − R(x)| ≤ S(0)√x, ψ_κ(x) = Σ_n Λ(n) κ(n/x), R(x) = O(1): the smoothed form of
|N_n − q^n − 1| ≤ 2g q^{n/2}, with 2g replaced by the smoothed genus S(0).

*Proof.* (a) Gram matrix: hyperbolic plane plus −[[S(0), S(u)], [S(u), S(0)]]. (b) Φ̂(γ) = F̂(γ)² ≥ 0. (c) If |S(u)| ≤ C,
the Laplace transform of S on Re σ > 0 equals M(σ) = Σ_ρ Φ̂(γ_ρ)/(σ − iγ_ρ) (termwise for Re σ > 1/2 by Gaussian decay),
whose poles σ = ρ − 1/2 have nonzero residues; so none has Re σ > 0. (d) Theorem 2.1 with Φ(· − u). ∎

[M] (`genus-ghost.log` (ii)): with the actual zeros, sup_{0.5≤u≤10⁴} S/S(0) = 0.999868 (s = 0.1), 0.971966 (s = 0.05).
The single-level inequality has no uniform margin (Dirichlet's simultaneous approximation gives sup S/S(0) = 1): the
statement of atlas §11 that a uniform strictly positive scalar margin is the wrong RH target, here for two-class spans.
With one synthetic quadruple (17.5, 0.05), |S(u)| > S(0) first at u = 11.1, ratio 9.3e7 by u = 400 (`referee.log` R3).

### 9.2 Proposition 9.2 (Suzuki's screw function is a box-class self-intersection) — new

Let B_W = D_{1_{[−W/2, W/2]}} (the diagonal smeared over a box) and Ψ the atlas/Suzuki function
(Ψ(W) = (W/2) q_W[e₀], e₀ = W^{−1/2} 1_{[−W/2,W/2]}, Suzuki-recurrence module §1).

**Proposition 9.2 [P from Lemma 2.2].** Ψ(W) = −½ P(B_W)², with B_W·H = B_W·V = 4 sinh(W/4). Consequently, with
Θ = sup Re ρ:
(i) [L: Suzuki 2022, Thm 1.7, normalisation per the atlas] RH ⟺ P(B_W)² ≤ 0 for every W > 0;
(ii) [Atlas/V7 + arithmetic foundation] if P(B_W)² ≤ C(1 + W)^m e^{αW} for all large W (0 ≤ α < 1/2), ζ has no zeros in
Re s > 1/2 + α;
(iii) [P-L] conversely P(B_W)² = O((1 + W) + e^{(Θ−1/2)W}): the defect exponent of the box-class Castelnuovo–Severi
inequality is exactly Θ − 1/2.

*Proof.* By Lemma 2.2, q_W[e₀] = W^{−1}(2 d(1_box)² − B_W²) with d(1_box) = d′(1_box) = ∫_{−W/2}^{W/2} e^{u/2} du =
4 sinh(W/4); so Ψ(W) = d(1_box)² − ½ B_W² = −½ (B_W² − 2(B_W·H)(B_W·V)). (ii) is (D) of Theorem 7.2 written for e₀, since
q_W[e₀] = −P(B_W)²/W. (iii) P(B_W)² = −W q_W[e₀] = 2D(W) − W A₀₀(W) with 0 ≤ A₀₀ − a(0) < 0.8 (03-landau.tex). D has
Laplace transform q^{−2}[−ζ′/ζ(q + 1/2) − 1/(q − 1/2)] (arithmetic-foundation module §1); shifting the inversion contour to
the left along heights where |ζ′/ζ| ≪ log² T [L: standard] picks up O(1 + W) from q = 0, terms O(e^{−5W/2}) from the
trivial zeros, and Σ_ρ m_ρ e^{(ρ−1/2)W}/(ρ − 1/2)², which converges absolutely because Σ_ρ |ρ − 1/2|^{−2} < ∞ and is
O(e^{(Θ−1/2)W}). ∎

[M] (`tmp/rha-arith-surface-box.py`, mpmath 30 digits, two independent code paths: Suzuki's series form of Ψ against
−½ P(B_W)² from the u-space kernel of §2.2): Ψ(W) = 0.0401626, 0.0440073, 0.0533411, 0.0397093, 0.0453713, 0.0309487 at
W = 0.5, 1, 2, 3, 5, 8, differences ≤ 9e-30.

So Suzuki's criterion is Castelnuovo–Severi for one class per support, and the V7 floor reduction (and with it Step B) needs
only that family. On this family the levers read exactly: the 7/8 half-plane (openai/math 003, Lean-checked locally, not
peer-reviewed) gives P(B_W)² = O((1 + W) + e^{3W/8}); PR 14's conditional B = 0.87488665 would give e^{0.37488665 W}; RH is
P(B_W)² ≤ 0, and by (ii) a polynomial defect already suffices. The finite Suzuki certificate (Ψ > 0 on (0, log 10⁷])
[Atlas] is the sign for W ≤ log 10⁷. The atlas's warning applies: under RH, Ψ has arbitrarily small returns, so the target is
the sign (or a polynomial defect), not a margin.

---

## 10. The unblocked inputs and levers on S_Q

* **Dirichlet-coefficient positivity** (Λ(n) ≥ 0) is axiom (A1). Used through domination (Zariski) it certifies nothing past
  λ = √2 (Proposition 8.1); the function-field fakes satisfy it and fail Hodge index (Proposition 4.2), with zeros up to
  log|α|/log q = 0.8926 (q = 3) and 0.9767 (q = 5) (route 27 census). Its classical use (de la Vallée Poussin, the 3-4-1
  inequality) gives only the zero-free region near Re s = 1.
* **The 7/8 half-plane** (openai/math family 003; Lean-checked locally; not peer-reviewed) gives |S(u)| ≤ e^{3|u|/8} Σ_ρ
  |Φ̂(γ_ρ)| in Theorem 9.1 (two-class single-level Hodge index with defect x^{3/8}) and P(B_W)² = O((1 + W) + e^{3W/8}) for
  the box classes (Proposition 9.2 (iii)). It is a zero-free half-plane, i.e. Castelnuovo–Severi with an exponential defect
  on one-parameter families; it does not give a floor for the full form (§8.4) and does not touch Step B.
* **PR 14 / Xu–Sang** (atlas §10): boundary B = 0.87488665, conditional on the imported analytic estimates and closure lemma;
  0.874 needs a restricted fourth moment U^{39/40+ε}; the sixth-phase filter retains eigenvalue one. On the box family it
  would be the defect exponent 0.37488665 (Proposition 9.2 (iii)); it is not used beyond that statement.
* **The V7 floor reduction** is used in Theorem 7.2 (D) and Proposition 9.2 (ii) in its proved direction.
* **Alpöge–Furman ≥ 2/3, Levinson–Conrey** (route 16): signature counts of the Weil form on height-localised spans; by
  Proposition 2.4 the positive index of the primitive intersection form counts ghosts; these bound it by a fraction of the
  span dimension, and Hodge index needs zero in every window (MV-CAP, wall 4).
* **The function-field dictionary**: Proposition 4.2 isolates Riemann–Roch as the carrier of positivity; Theorem 6.2 shows
  S_Q lacks it; Theorem 3.4 shows a fixed arithmetic surface cannot supply it except through an archimedean Dirichlet form.

---

## 11. The four walls

| Wall | Does the attempt avoid it? | Where the missing step sits |
|---|---|---|
| 1. Flow-blindness (SL2) | Yes. The pairing uses the atoms Λ(n) n^{−1/2} at log n, (A1) uses Λ ≥ 0, Prin and the head use Tate's map (Poisson summation for Z ⊂ R); the backward-flowed Ξ_ε has no Dirichlet series, so none of these objects exists for it. Step B is a statement about the actual prime-side form, not a soft hypothesis on the profile. | Riemann–Roch or a polarisation would be arithmetic inputs of the kind SL2 requires; neither exists on S_Q. |
| 2. NS-RIGID | Yes. Window classes, Tate classes and the head are not in the native span E_V = span{e^{−νt}1_{t>0}}; the RR and complement inputs are not Hermitian forms on it. | The targets (Corollary 2.3, Remark 6.1, Remark 7.3) are RH-equivalent, as is NS-RIGID's all-S family (A5). |
| 3. Verified height | Argument II is cofinal in λ; no finite support is claimed. | Every finite statement here (Lemma 2.2 consequences, §7.3, Proposition 8.1) is fixed-support positivity at half-width ≤ log 4 (certified) or ≤ log 8 (measured), inside RES-T's T_X = 3.88; regularising the genus (Remark 6.5) is a spectral truncation; single-level certificates (Theorem 9.1) are weaker than verified height. |
| 4. Pointwise / MV-CAP | The arguments are not mean-value arguments. | Mean-value inputs give the signature up to a fraction (§10); Proposition 9.2 shows the V7 route needs the box-class inequality at every W, i.e. every window. On C × C every level comes at once from Riemann–Roch. |
| Vortex blocker | Not used. | Hodge index on S_Q, Step B with p = 0, and global vortex trapping are each RH-equivalent. |

The attempt does not fail at a wall. Argument I fails at the missing object (Theorem 6.2); Argument II fails at Step B, which
is RH-equivalent given the head theorem and has no surface mechanism (§7.4); every finite or averaged replacement lands on
wall 3 or wall 4.

---

## 12. Adversarial check (same agent, independent code paths; not an independent referee)

Objections and resolutions (v1 objections 1–12 kept in short form; 13–24 new).

1. *Theorem 2.1 is the explicit formula renamed.* Yes; the claim tested is positivity (§5–§8), and the answer is negative.
2. *"Intersection form" is a label without a surface.* Made precise: Theorem 6.2 (no section ring), Theorem 3.4 (no fixed
   arithmetic surface without an archimedean energy carrying the zeros).
3. *Theorem 6.2 depends on the choice of principal divisors.* Remark 6.3 treats the finest choice.
4. *Corollary 2.3 rests on Weil's criterion.* Cited [L]; the complex-to-real reduction is proved.
5. *The ghost table uses synthetic zeros.* It tests the mechanism of Proposition 2.4, which is proved.
6. *Theorem 3.2 assumes a form for the Green's function.* It holds for smooth hermitian metrics on O(1) [L]; an arbitrary U
   was checked (rank 2 to 1.8e-15).
7. *Remark 3.3's radii depend on the basis.* 14 and 20 functions per sector agree to 2e-5; [M].
8. *Theorem 9.1(c) continues a sum over off-line zeros.* Gaussian weights make Σ_ρ |Φ̂(γ_ρ)| e^{|Im γ_ρ| u} finite.
9. *Proposition 2.5 assumes RH.* No; off-line zeros change each term by 1 + O(ε²).
10. *The targets are circular.* They are RH-equivalent by design; the content is the mechanism, and each is shown absent.
11. *Theorem 5.1 uses (R2) only on primitive L; Theorem 6.2 refutes it at N·A.* Hence Remark 6.1.
12. *(R4) is artificial.* It ties h to the size of linear systems (dim |L| = h⁰(L) − 1).
13. *Lemma 2.2 might mix the 1/4 and 5/4 normalisations (the atlas warns against adding the pole block twice).* The proof
    adds the pole terms 2d d′ exactly once and converts 2cosh − e^{−|r|/2} into e^{|r|/2}; both implementations agree with
    the zero side independently (≤ 1.3e-11 and ≤ 3e-10).
14. *Lemma 7.1 is the definition of E.* (a) is; the content is (b)–(c) (numerical triviality and the tail identity) and the
    reading of (T1) it gives. No new analysis of the head is claimed; (T1), (T2) are atlas results, not re-verified.
15. *Theorem 7.2 is circular.* Step B is RH-equivalent given (A) (Remark 7.3); stated as the failing line, not as progress.
16. *Does the V7 implication need the full form or the even sector?* It uses the even box vector only (03-landau.tex);
    Theorem 7.2 (C) bounds the even-sector floor, which is ≤ Q_W[e₀].
17. *The cluster/head match of §7.3 could be a discretisation artefact.* The spline form matches the zero side to ≤ 1e-10;
    halving h changed the cluster counts (59 → 62 at λ = 8) and cut the max angle from 31° to 2.2°, the median angles stay
    ≤ 1e-8°; the refined values are quoted, residuals listed; all values are Ritz upper bounds and are labelled [M].
18. *§7.3 might be read as evidence for RH.* It is not: the supports are inside the verified-height regime; stated in §7.3.
19. *Theorem 3.4: is CH¹(𝒳) finitely generated, and does a(η) pair as a Dirichlet form?* Both [L] (Gillet–Soulé 1990;
    Faltings 1984); the deduction from them is elementary and written out.
20. *Corollary 3.5(b): is the prime form really of infinite rank?* Yes, already on a fixed window: P_L is injective on
    functions supported in a short interval at the right end of the window (disjoint translates). The converse in the
    remark after Theorem 3.4, (iii) (finite index ⇒ finitely many quadruples) is graded [A] and not used.
21. *Proposition 8.1(ii): is the two-bump function admissible?* The bound is for the bounded operator P on L²; smooth bumps
    give the same ratio and lie in the form domain. The direction of every numerical inequality in (iii) is the safe one
    (Ritz minima are upper bounds), and positivity in (i) is taken from the atlas certificate, not from a Ritz value.
22. *Does the note claim the converse of V7 (half-plane ⇒ floor)?* Only on the box family (Proposition 9.2 (iii)), where
    Σ_ρ |ρ − 1/2|^{−2} < ∞ makes the zero sum of D(W) absolutely convergent and the contour shift is standard [L]. Not for
    the full floor ε₀ (§8.4, §10).
23. *Remark after Theorem 3.4, (i): a draft of this revision wrote the cyclotomic arithmetic classes as φ(n)[Ô(1)] + a(η_n)
    with a singular η_n.* Corrected before release: (Z_n, −log‖Φ_n‖²_FS) is the arithmetic divisor of the section Φ_n, so the
    class is exactly φ(n) ĉ₁(Ō(1)) (plus a multiple of a(1) for Arakelov's normalisation); the cancellation is inside each
    pairing.
24. *§7.3 identifies eigenvalue #k+1 with a transition class from Rayleigh quotients alone.* Replaced by a direct overlap
    (`--v4`): |cos| ≥ 0.96 at every λ measured.

One numerical defect was found and fixed in v1 (archimedean integral truncated at y = 14; fixed at y = 60). In revision 2 the
coarse spline run was found to under-resolve the edge head vectors (Objection 17); the refined run replaces it. In the
Proposition 9.2 check, mpmath's `nsum` mis-extrapolated the slowly convergent series T(W) at W = 0.5 (error 1.4e-5); the
script now uses T = ψ′(5/4)/4 − Σ_k e^{−α_k W}/α_k², and all six values agree to ≤ 9e-30.

---

## 13. Verdict

The attempt constructs the candidate intersection form for "Spec Z × Spec Z" twice and runs two Hodge-index arguments.
Construction A (the graph-class space S_Q) carries the Weil form exactly (Theorem 2.1), coincides with the atlas actual form
(Lemma 2.2), satisfies every soft axiom of Hodge index (Proposition 4.1), and at finite support has an explicit space of
principal divisors which, at the supports measured (λ = 3–8), spans the near-null part of the Weil spectrum (Lemma 7.1,
§7.3). Construction B (cyclotomic divisors on P¹_Z) realises the prime kernel at its finite places (Theorem 3.1) and cancels
it at ∞ (Theorem 3.2); Theorem 3.4 shows that on any fixed arithmetic surface the finite places contribute only finite rank,
so the Weil form could appear there only as an archimedean Dirichlet energy.

The exact lines of failure: Argument I, §5.2 Step 2 (Riemann–Roch), impossible on S_Q by Theorem 6.2; Argument II, §7.2
Step B (complement floor), RH-equivalent given the head theorem (Remark 7.3), with no surface mechanism (§7.4): Riemann–Roch
absent, positive-kernel domination dead past λ = √2 (Proposition 8.1), polarisation = Hilbert–Pólya, arithmetic-surface
models confined to an archimedean Dirichlet energy (Theorem 3.4). In the form needed by the V7 reduction, Step B is the
box-class Castelnuovo–Severi inequality with polynomial defect (Proposition 9.2), i.e. the one-sided Landau bound: the atlas's
"all-scale signed arithmetic estimate".

RH is open. PT Λ ≤ 0.2 stands. 0.1758354 and 0.1787854 remain computer-assisted candidates. Nothing here changes a Λ bound.
NO QED.

---

## 14. Reproduction

All scripts run with `.venv-arb/bin/python -I <script>` from the repository root (python 3.14, numpy, scipy, mpmath, sympy).
Zeros: `tmp/routes-b8-r34-out/zeros1e6.npy` (first 10⁶ Odlyzko ordinates).

| Script | Content | Runtime |
|---|---|---|
| `tmp/rha-arith-surface-lib.py` | Λ table, prime side, archimedean u-space and digamma forms, Gaussian classes | library |
| `tmp/rha-arith-surface-explicit.py` | Theorem 2.1 table | 2 s |
| `tmp/rha-arith-surface-genus-ghost.py` | Proposition 2.5, Theorem 9.1, Proposition 2.4, (A3) | 21 s |
| `tmp/rha-arith-surface-cyclotomic.py` | Λ(n) = log Φ_n(1), Apostol, Theorems 3.1–3.2 | 23 s |
| `tmp/rha-arith-surface-fakes.py` | Proposition 4.2 | < 1 s |
| `tmp/rha-arith-surface-localinf.py`, `-localinf-bisect.py` | Remark 3.3 | 2 s, 16 s |
| `tmp/rha-arith-surface-referee.py` | §12 R1–R3 | 4 s |
| `tmp/rha-arith-surface-rerun-v1.sh` | re-runs all v1 scripts; outputs identical to v1 except elapsed times | ~70 s |
| `tmp/rha-arith-surface-head.py 3 4 5 6 8` | §7.3 coarse run, validation, odd-sector counts → `head-<λ>.json` | ≤ 20 s each |
| `tmp/rha-arith-surface-head.py --v2 2 3 4 5 6 8` | §7.3 refined table, nested heads → `head2-<λ>-h2.json` | ≤ 13 s each |
| `tmp/rha-arith-surface-head.py --v3 2 3 4 5 6 8` | §7.3 Rayleigh quotients of transition and mean directions → `head3-<λ>.json` | ≤ 15 s each |
| `tmp/rha-arith-surface-head.py --v4 2 3 4 5 6 8` | §7.3 overlap of eigenvector #k+1 with the first transition image → `head4-<λ>.json` | ≤ 15 s each |
| `tmp/rha-arith-surface-zariski.py` | Proposition 8.1 (iii) → `zariski.json` | ~10 s |
| `tmp/rha-arith-surface-box.py` | Proposition 9.2 identity Ψ = −½ P(B_W)² → `box.json` | ~5 s |

`summary-v2.json` collects the numbers quoted in §7.3 and §8.1.

---

## References

Cited from memory unless stated; not re-verified in this note.

* T. M. Apostol, Resultants of cyclotomic polynomials, Proc. AMS 24 (1970) 457–462.
* S. Ju. Arakelov, Intersection theory of divisors on an arithmetic surface, Izv. Akad. Nauk SSSR 38 (1974).
* E. Bombieri, Remarks on Weil's quadratic functional in the theory of prime numbers I, Rend. Mat. Acc. Lincei (9) 11 (2000).
* A. Connes, Trace formula in noncommutative geometry and the zeros of the Riemann zeta function, Selecta Math. 5 (1999).
* A. Connes, C. Consani, M. Marcolli, The Weil proof and the geometry of the adèles class space, Progr. Math. 269 (2009).
* A. Connes, C. Consani, Geometry of the arithmetic site (2016); Geometry of the scaling site (2017); Weil positivity and
  trace formula, the archimedean place (2021); Spectral triples and ζ-cycles (2023); Riemann–Roch for Spec Z (2023).
* P. Deligne, La conjecture de Weil II, Publ. Math. IHÉS 52 (1980).
* G. Faltings, Calculus on arithmetic surfaces, Ann. of Math. 119 (1984).
* G. van der Geer, R. Schoof, Effectivity of Arakelov divisors and the theta divisor of a number field, Selecta Math. 6 (2000).
* H. Gillet, C. Soulé, Arithmetic intersection theory, Publ. Math. IHÉS 72 (1990); An arithmetic Riemann–Roch theorem,
  Invent. Math. 110 (1992).
* A. Grothendieck, Sur une note de Mattuck–Tate, J. reine angew. Math. 200 (1958).
* P. Hriljac, Heights and Arakelov's intersection theory, Amer. J. Math. 107 (1985).
* H. Iwaniec, E. Kowalski, Analytic Number Theory, AMS Colloquium Publ. 53 (2004), §5.5.
* S. Karnik, J. Romberg, M. Davenport, Improved bounds for the eigenvalues of prolate spheroidal wave functions and discrete
  prolate spheroidal sequences (arXiv:2006.00427), as used by the atlas spectral-head module.
* A. Mattuck, J. Tate, On the inequality of Castelnuovo–Severi, Abh. Math. Sem. Univ. Hamburg 22 (1958).
* R. Meyer, On a representation of the idele class group related to primes and zeros of L-functions, Duke Math. J. 127 (2005).
* A. Moriwaki, Hodge index theorem for arithmetic cycles of codimension one, Math. Res. Lett. 3 (1996).
* M. Suzuki, Aspects of the screw function corresponding to the Riemann zeta-function (arXiv:2206.03682), Thm 1.7, as
  normalised in the atlas Suzuki-recurrence module.
* A. Weil, Sur les courbes algébriques et les variétés qui s'en déduisent (1948); Sur les « formules explicites » de la
  théorie des nombres premiers, Comm. Sém. Math. Univ. Lund (1952).
* Atlas and modules (PR #27, internal review, not external): `refs/pr/27:research/rh/modules/{historical-routes,
  arithmetic-foundation, spectral-head-theory, signed-complement, whole-even-certificate, spectral-denominator-repair,
  suzuki-recurrence, prime-memory, finite-suzuki-certificate}.md`, `research/rh/PUBLICATION_SCOPE_2026-10-30.md`,
  `research/rh/foundation/source/03-landau.tex`.
* In-repo: route 27, route 11, route 16, route 42 / MV-CAP, route 43, imp-95530 (NS-RIGID, RES-T), flow-blindness no-go,
  imp-1343, openai/math integration (2026-10-08), vortex-blocker reduction (2026-11-01).
