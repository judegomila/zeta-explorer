# RH attempt, round 2 (1 November 2026): iterating the zero-density profile through the 7/8 machinery

**Outcome: the attempt fails. No proof of RH.** Revision 2. Internal working note; not externally refereed; nothing
committed; nothing sent off the machine.

**Revision history.** Revision 1 (16:28) was written by the first agent assigned to this step. Revision 2 (this file) was
written by a second agent in a fresh context. It re-ran all seven revision-1 scripts (identical output), re-derived the
exponent bookkeeping from the manuscript in a new script (`tmp/rha-density-profile-referee.py`, 13 checks), confirmed
revision 1's reading of Lemma 10.4, corrected one READ claim (§6.3), and added new results: a two-line dual certificate
for Theorem P; the A(σ) form of the closing pencil (Corollary D3); Step 6′ (a signed treatment of the floor bin) with
Lemma M (its contour price); Theorem Q (the density-hypothesis floor holds for every treatment of the floor bin, and is
sharp); Corollary Q2 (the profile map never produces a count below the density hypothesis at Re s ≤ 2/3). The revision-1
text is kept in `tmp/rha-density-profile-draft-v1-backup.md`.

The round-1 bootstrap (`2026-11-01-bootstrap-qrh.md`, Theorem S) fed a zero-free half-plane into the 7/8 architecture
as one scalar and found that it stops at a fixed point (Xu–Sang: 0.874886647). This attempt makes the whole family
zero-density profile the iterated state: the row-count profile R(δ, x), equivalently the density exponent A(σ) through
R(δ) = A(σ)(1 − σ), σ = (1 + δ)/2. The profile sets the row counts in every bin of the Part II high side; the closing
system returns a zero-free half-plane; the half-plane, a profile-valued capacity, an averaged continuation and a signed
floor return a new profile. The written argument (§2) claims the profile map contracts toward the RH profile. The attack
(§3) shows that it does not, and why:

1. **Theorem P (profile floor; EXACT within the exponent model).** For every profile, including GRH for every row
   L-function, the Part II closing system with count-type row bounds closes at no σ₀ ≤ 13/15. The proof is one identity:
   (4/5)σ_low + (1/5)σ_bulk = 13/15 + (1 − M − ℓ)/15 + b/30, where σ_low is the zero-blind low side and σ_bulk the
   requirement of the U^{1−o(1)} rows near the critical line, which Lemma 10.4 sums with the triangle inequality and
   Lemma 20.1 bounds by count times pointwise size.
2. **Theorem D and Corollary D3 (pencil; EXACT).** On the optimal geometry family, closing at B needs
   A(σ_c) < 24(1 − B)/(25 − 27B) at the pivot σ_c(B) = (11 − 9B)/(36(1 − B)). At the paper's ceiling this is
   A(0.6943) < 2.1807, which the internal counts meet with equality; at B = 13/15 it is A(2/3) < 2, the density
   hypothesis; no line of the pencil exists below 13/15 because of the universal on-line point A(1/2) = 2.
3. **Theorem Q (density-hypothesis floor; EXACT, sharp in the model).** For every treatment of the floor bin (count,
   signed, or deleted by an oracle) and with or without the zero-loss excess of Lemma 15.1, closing at B requires every
   nonempty bin with δ ≤ 1/3 to have count at most 1 − δ − 5(13/15 − B)/h. A profile at density-hypothesis level anywhere
   on (δ_f, 1/3] therefore gives B ≥ 13/15 when the floor sits at Re s < 2/3. (An oracle floor at Re s ∈ (2/3, 5/6) buys
   at most (3δ_f − 1)/80 < 1/80; one beyond 5/6 is the full signed row sum of Remark M2; Remark Q4.) With both zero-blind
   obstructions removed by oracles, a uniform saving s below the density hypothesis gives exactly
   B = 13/15 − 4s/(5(5 − 6s)), down to the low side's own floor 5/6 at s = 1/6.
4. **Theorem SP and Corollary Q2 (the map stops; PROVED + MODEL).** The proved steps of the profile map act at δ > 2B − 1
   > 11/15 or through the scalar κ; the averaged continuation cannot detect a target whose rightmost zero has real part
   ≤ 2/3. So no iterate has a count below the density hypothesis at δ ≤ 1/3, and every iterate has B ≥ 13/15 (Theorem Q;
   for any floor oracle at Re s < 2/3; B > 13/15 − 1/80 for oracles at Re s ∈ (2/3, 5/6)). From the proved data the
   iteration stops after one step: 0.8749570698 (paper system), 0.874886647040 (Xu–Sang, conditional).
5. **Lemma M (contour price; bookkeeping EXACT, conclusion ARGUED).** A signed floor must replace 1/L(s, ηχ_u) by a
   family-uniform approximant. Moving the s-contour a distance r away from the zeros costs Z^{r} exactly, and an
   approximant of length N gains at most N^{−r}; a net gain needs N > Z ≥ U, a polynomial longer than the family.
6. **The fourth moment (H).** PR #14's U^{39/40+ε} hypothesis is a count saving of 1/120 at the binding bin
   (B = 0.8738174, conditional). It leaves the counts above the density hypothesis, so it acts only above 13/15. The ladder
   of restricted moments U^{θ+ε} saturates at θ* = 0.966626 (gate cap 0.8734878). No step of the profile map produces (H).

RH is open. Platt–Trudgian Λ ≤ 0.2 stands. No Λ bound and no zero-free region changes. NO QED.

**Grades.** **PROVED**: complete argument written here, checked by the authoring agent and by the revision-2 agent
(same model family; not an independent referee). **EXACT**: exact rational or symbolic computation in the scripts of §6.
**MODEL**: floating-point computation on the stated exponent model. **READ**: statement read from a source, with line
numbers. **ARGUED**: a step written as an argument but resting on an unproved input or on a claim about the limits of
known methods, named where it occurs. **HEURISTIC**: plausibility only.

**Sources.** [OAI-7/8]: OpenAI, *The Quasi-Riemann Hypothesis: a zero-free half-plane Re s > 7/8* (openai/math family
003; text `~/lean-deps/qrh-verify/paper.txt`; line numbers below refer to it). The ζ and Dirichlet 7/8 statements were
built locally in Lean (`formalization/external/openai-math-qrh-verification.md`); the manuscript is unrefereed and is
taken as correct. [XS]: Xu–Sang, arXiv:2610.15291v2, used only through the PR #14 encoding
(`git show refs/pr/14:rigorous/mobius_bridge_reduction/{certify_parameters.py, TARGET_0874.md, README.md}`); its analytic
inputs are not verified here or in PR #14, and the source text is not on this machine. [ATLAS]: PR #27 snapshots
`/tmp/atlas-snap-*.md`. [R1]: round 1, `formalization/rh-attempts/2026-11-01-bootstrap-qrh.md` and
`2026-11-01-synthesis.md`. [HS]: `formalization/paper/zf-campaign-high-side.md` (§3: the low side at general geometry;
count levers in both systems). [REF]: `tmp/rha-density-profile-referee.py` (revision 2).

---

## 0. The PR #27 audit: read first; overlaps

Both agents read the ten audit snapshots before writing: the route atlas (`/tmp/atlas-snap-historical-routes.md`,
§§1–12, review ledger and closing line), the publication-scope note, and the module notes on the arithmetic foundation,
Suzuki recurrence, prime memory, finite Suzuki certificate, spectral head, signed complement, whole-even certificate and
spectral-denominator repair. The round-1 synthesis, the round-1 bootstrap file, the high-side campaign note and PR #14's
`TARGET_0874.md` were read next, because this attempt continues them.

| this attempt | prior record | what that record establishes | what is different here |
|---|---|---|---|
| profile → bin counts → closing abscissa, both systems (§2.3 Steps 1–3) | atlas §10 (PR #14, B = 0.87488665 conditional; B = 0.874 needs (H)); [HS] §§8, 13–15; [R1] L6 and Lemma I.4 | count levers priced one at a time: DH in every adaptive bin gives 167/192 (paper) and the gate cap 0.8734878 (XS); the low side alone has floor 13/15 | the profile is the iterated state. New: the high side has the same floor for every profile (Theorem P, via the bulk; one-line certificate); the closing condition for an arbitrary profile is a pencil condition with a fixed pivot (Theorem D), restated as a bound on A(σ) (Corollary D3) |
| Theorem Q (§3.4, revision 2) | [R1] Lemma I.4 (low side 13/15); [HS] §13 (gate cap); qrh-improvement-attempt-b §3.4 (model lever "DH counts + floor removed → 0.86668") | the low side stops at 13/15; DH counts with the floor removed reach ≈ 13/15 in a model | an exact statement: 13/15 is the density-hypothesis floor of the high side itself, for every treatment of the floor bin and without the zero-loss excess; sharp, with the exact price 13/15 − 4s/(5(5 − 6s)) of a saving s below DH |
| Theorem SP, Corollary Q2 (§3.6) | [R1] Theorem S, Remark S.1 | a capacity-form bootstrap stops at its self-consistent point | profile version, with the reason: the map's outputs never go below DH at Re s ≤ 2/3, where Theorem Q needs them |
| Step 6′ and Lemma M (§3.5, revision 2) | atlas closing line ("a genuine all-scale signed arithmetic estimate"); NS-RIGID loophole remark (`imp-95530`); [R1] Corollary III.5 | a signed estimate is the open task; Dirichlet-coefficient inputs give mean-value statements | the signed estimate needed here is located exactly (the floor set of Lemma 10.4) and its price in this architecture is computed: the contour cost Z^{r} against N^{−r} (r = distance of the contour from the zeros) |
| (H) and the (H_θ) ladder (§3.8) | atlas §10; PR #14 `TARGET_0874.md` (saturation example); [HS] §15 (ε = 1/120 equivalence, 0.87382) | (H) is open; counts plus a global fourth moment cannot give it | (H) placed in the profile ladder; saturation threshold θ*; shown not to be produced by the profile map; by Theorem Q it acts only above 13/15 |
| Step 5, capacity (§3.9) | [R1] Lemma I′.1, Remark S.1; [HS] §8 lever table | κ-monotonicity; dynamic κ = 2β* − 1; capacity levers priced (≤ 7.8·10⁻⁴) | the place where a half-plane enters Lemma 18.1 is the pointwise prime-sum bound (18.11)–(18.12); its profile version is written out and bounded by Theorem P |
| Step 6, averaged continuation (§3.10) | NS-RIGID loophole remark; MV-CAP Theorem C | density statements are window-insensitive; the passage to every zero is the pointwise wall | new construction (averaged Prop 2.1 over targets); its failing lines are identified; revision 2 adds that it is blind to targets with β_η ≤ 2/3 |
| V7 floor, Landau functionals (§3.11) | atlas §10; [R1] Theorem III.1, Lemma III.2 | the floor and the discrepancy exponents equal Θ − 1/2 | used only to note that the "profile" of those functionals is the scalar Θ |
| discipline | atlas §9, §11, closing line; publication scope | a failed sufficient estimate is not a negative actual form; a uniform positive margin is the wrong RH target | every obstruction below is an obstruction to a sufficient inequality system. All margins are exponent margins at a fixed σ₀ > 1/2 |
| not used | atlas §§2–8, §12; spectral-head, signed-complement, whole-even and spectral-repair modules; vortex reduction | — | no heat flow, theta certificate, twin ladder, finite-support form or Λ claim |

---

## 1. Outcome in brief

| object | value | binding constraint | grade |
|---|---|---|---|
| paper system, internal counts R* (κ = 3/4) | (1507 − 2√921)/1653 = 0.874957069799 | pivot bin δ_c = (49 − √921)/48 = 0.388584 (Re s = 0.694292), R* = 2/3, i.e. A(0.6943) = 2.1807 | EXACT (X8, RF8) |
| paper, DH counts in every bin, detector floor 51/100 | 167/192 = 0.869791667 | floor bin | EXACT (X9), MODEL |
| paper, RH profile (GRH for every row), floor 51/100 | 167/192 | floor bin | MODEL |
| paper, DH or RH profile, floor → 1/2 | inf 13/15 = 0.866666667, not attained | bulk C0 < 0, zero-loss range ℓ ≤ 1/5, b > 0, all tight | EXACT (X4, X5, RF4), MODEL |
| any profile, any geometry with M + ℓ ≤ 1, b ≥ 0, count-type floor | > 13/15 | (4/5)σ_low + (1/5)σ_bulk ≥ 13/15 (Theorem P) | EXACT (RF4, RF11) |
| any floor treatment (floor at Re s < 2/3), zero-loss excess removed, DH on some δ ∈ (δ_f, 1/3] | ≥ 13/15 | Theorem Q | EXACT (RF6), MODEL (Q1) |
| oracle floor at Re s = (1 + δ_f)/2 ∈ (2/3, 5/6), DH above it, excess removed | ≥ 13/15 − (3δ_f − 1)/80 > 13/15 − 1/80; 0.86434 at δ_f = 1/2 | Remark Q4 | EXACT bound, MODEL |
| same oracles, uniform saving s below DH, 0 ≤ s ≤ 1/6 | 13/15 − 4s/(5(5 − 6s)); 5/6 at s = 1/6 | low side and every sub-DH bin tight | EXACT (RF12), MODEL (Q1) |
| same oracles, RH profile | 5/6 | low side 5/6 + M/12 − ℓ/6 with l_x ≥ ℓ | MODEL (Q1), RF11 |
| XS, internal counts R_κ, κ = 29991/40000 | 0.8748866496166 | pivot δ_c^XS = 0.469345 (Re s 0.734672), count 0.590332 | EXACT ([HS]), MODEL |
| XS, scalar iteration κ → 2B − 1 | 0.874886647040 (round 1) | same pivot | EXACT bracket [R1], MODEL |
| XS, (H) = U^{39/40}: saving 1/120 | 0.8738174 | pivot | MODEL (conditional on XS and (H)) |
| XS, any profile (DH, RH, any saving beyond θ*) with all imported gates | 0.8734878 | capacity and small-δ gates | MODEL |
| XS, RH profile, count gates dropped / structural gates only / floor → 1/2 | 0.8725286 / 0.8717448 / 0.8679155 (encoding range gate B > 0.87) | small-δ / floor / small-rows gates | MODEL |
| profile map Φ iterated | stops after one step (paper); scalar contraction 0.00302 to 0.874886647 (XS); never below 13/15 | Theorem SP, Corollary Q2 | PROVED + MODEL |

---

## 2. The attempt

### 2.1 Setting

F = Q(√−3), 𝓕 the primitive finite-order Hecke characters over F, β* as in [OAI-7/8] (2.1). For a target η and a
large scale Z, Part II of [OAI-7/8] compares a normalized cubic-theta sum J_η(Z) with the Mellin signal
f_η(Z) = (2πi)⁻¹ ∫ Z^{C(s)} e^{(s−5/6)²} H_η(s)/L^S_F(s, η) ds, C(s) = s + c_g (Prop 2.1, l. 381–403). Poisson
summation produces rows u (sixth-power-free, N u ≍ U = Z^d). The exact high representation (10.5) (l. 4387–4396) is

  I_η(Z) = (2πi)⁻³ ∫∫∫ W(X, Y, Z; s, w, z) Σ_u q_u^{−z} ξ(u) ζ_F^S(6z) L^S(w, χ•(u)) H_{η,u,Z}(s, w, z) / L^S(s, ηχ•(u)) dz dw ds,

  W = X^{1/2−z} Z^{s+z−1} Y^{w−1} e^{(s+z−1)²} M(z) Ŵ₁(w),

with ξ a residue character primitive modulo the product of the primes in S (l. 2699–2714). Each row carries the
presentations X_u = {ν(n)χ_n(u)^ς : ν ∈ Θ = ⟨η, T_b⟩, ς = ±1} (l. 3386–3395): sextic twists of the target, conductor
≪ N u. Lemma 8.1 (l. 3418–3483) puts each retained row in a bin (i, a), a ∈ 51/100 + eℤ, such that some ψ ∈ X_u has a zero
ρ with a ≤ Re ρ < a + e, |Im ρ| ≤ 3iT₁ (l. 3430), and no presentation has a zero in the buffered rectangle to its
right; δ = 2a − 1. The bin a = 51/100 (the floor bin) is bounded by the trivial row count (l. 3483); write
a_f = (1 + δ_f)/2 for the floor (a_f = 51/100 in the paper; Theorem P lets a_f ↓ 1/2). Section 19 subdivides bins by the
main-slot amplitude q = xδ, x ∈ [0, 1/2].

Geometry g = (l_x, b, ℓ): X = Z^{l_x}, Y = Z^{l_y}, l_y = l_x + b, M = l_x + l_y, total prime-slot length ℓ, Poisson row
range h = 1 + ℓ − l_x. The region 𝒢 of Lemma 15.1 / Prop 15.3 at general geometry ([HS] §3, [R1] E2) is M + ℓ ≤ 1,
2M ≥ 1 + 3ℓ (the zero-loss range), b > 0, l_x ≥ ℓ, l_y − ℓ − 11b/6 ≥ 0.

**Definition 2.1 (profile).** A *profile* is a function R : [0, 1] × [0, 1/2] → [−∞, 1], (δ, x) ↦ R(δ, x). The family
*satisfies* R if for every target η, every bounded range of d and every (δ, x),

  #{u : N u ≍ U, some ψ ∈ X_u has a zero with Re ρ ≥ (1 + δ)/2, |Im ρ| ≤ T₁^{O(1)}, amplitude in the x-set} ≪_{η,ε} U^{R(δ,x)+ε} T₁^{O(1)},

with exponents uniform in η, as Lemma 20.1 requires of its counts (l. 11476–11495). R ≡ −∞ on a set means no such rows
for large U; R ≤ R′ pointwise means R is the stronger statement. In the usual density notation
N_𝓕(σ; U) ≪ U^{A(σ)(1−σ)+ε}, a profile without x-dependence is **R(δ) = A(σ)(1 − σ), σ = (1 + δ)/2**. Distinguished
profiles:
* **internal** R_κ = R*(δ, x; c), c = 1/(3κ) (Prop 19.2 / (20.8)): satisfied under ZF((1 + κ)/2), up to Δ/4 [READ];
* **DH**: R(δ, x) = 1 − δ, i.e. A ≡ 2, the family density hypothesis in the row aspect;
* **RH profile** R_RH: R = −∞ for every δ > 0 (GRH for every row L-function; implied by GRH for 𝓕);
* the zero-free profile Z_θ: R = −∞ for δ > 2θ − 1, R = 1 otherwise (ZF(θ) for 𝓕).

### 2.2 Target

**Theorem DP (target; not proved).** There are a monotone map Φ on profiles and a functional B on profiles such that
(i) *soundness*: if 𝓕 satisfies R then 𝓕 satisfies Φ(R) and ZF(B(R)) holds; (ii) *contraction*:
B(Φ(R)) ≤ B(R) − m(B(R)) whenever B(R) > 1/2, with m bounded below on compact subsets of (1/2, 1].

**Lemma 2.2 (PROVED).** Theorem DP implies RH. *Proof.* Start from R₀ = R_{3/4} (satisfied by [OAI-7/8]). By (i) and
induction 𝓕 satisfies R_k = Φ^k(R₀) and ZF(B(R_k)). By (ii) and the argument of [R1] Lemma 2.1, B(R_k) → 1/2, so
ZF(1/2) for 𝓕. For the trivial character L_F(s, 1) = ζ(s)L(s, χ₋₃), so ζ has no zero in Re s > 1/2, and none in
0 < Re s < 1/2 by the functional equation. ∎

### 2.3 The profile map

**Step 1 (profile → bin counts; PROVED).** *If 𝓕 satisfies R, then in Lemma 20.1 every pointwise set C of a bin
(i, a) with amplitude x may be given the count exponent R̃(δ, x) = min(R*(δ, x) + Δ/4, R(δ, x)), δ = 2a − 1.* Proof:
every row of the bin with a > 51/100 has a zero with a ≤ Re ρ < a + e and |Im ρ| ≤ 3iT₁ (l. 3430), so it is among the
rows counted by R at δ; Lemma 20.1 accepts any valid count whose exponents are uniform in η (l. 11488–11492). ∎

**Step 2 (counts → closing abscissa; READ + MODEL).** For g ∈ 𝒢 and σ₀, the closing system 𝒮(g, σ₀; R) consists of:
the low side σ₀ ≥ σ_low(g) = 5/6 + M/12 − ℓ/6 (Prop 15.3′ at general geometry, [HS] §3; outside the zero-loss range a
nonnegative excess (1 + 3ℓ − 2M)/8 is added); for every bin the Lemma 10.4 exponent (10.15) (l. 4694),

  E_{σ₀}(h; R̃, qℓ) = a − σ₀ + h(17/50 − 1/6) − a l_y − ℓ/2 + qℓ + h(R̃ + δ/2 − 17/50) < β* − σ₀  (β* ↓ σ₀);

the floor bin (20.5), small rows (20.6), large rows, the d ≤ 1/2 range (20.11), and, for internal counts only, the slot
supply. Equivalently, bin by bin, σ₀ > σ_bin(g; δ, q, R̃) with

  **σ_bin(g; δ, q, R) := a(1 − l_y) − h/6 − ℓ/2 + qℓ + h(R + δ/2)**,  a = (1 + δ)/2  (EXACT, X1, RF1).

Put B(R) := inf{σ₀ : 𝒮(g, σ₀; R) holds for some g ∈ 𝒢}. Lemma 10.4 is stated for σ₀ ∈ [7/8, 1) (l. 4650); its exponent
is affine bookkeeping in σ₀ (its proof subtracts C(σ₀), l. 4735–4737), and its use at σ₀ < 7/8 is MODEL here, as in
[R1] and [HS].

**Step 3 (abscissa → half-plane; READ).** If 𝒮(g, σ₀; R) holds then Prop 2.1 gives ZF(σ₀) for 𝓕.

**Step 4 (half-plane → profile; PROVED).** ZF(θ) implies that 𝓕 satisfies Z_θ and, by [OAI-7/8] Prop 19.2, the
internal profile R_κ with κ = max(3/4, 2θ − 1) in the paper system (Lemma 18.1 is stated for 3/4 ≤ κ ≤ 1, l. 9364;
κ = 3/4 is licensed by the 7/8 theorem). In the XS encoding κ = 2θ − 1 is admitted down to 29991/40000 (PR #14), and
below that only as in [R1].

**Step 5 (profile → capacity; ARGUED).** Lemma 18.1 uses its zero-free hypothesis β* ≤ (1 + κ)/2 (l. 9379) for the
pointwise bound (18.11)–(18.12) (l. 9558–9603) on the short prime polynomials of each row, |Q_ω|² ≤ C Z^{κz+ε₁},
obtained by moving each prime-sum contour to Re s = (1 + κ)/2 + e. Replace it by the profile: call a row *exceptional
at s* if some slot character ψϑ_ij has a zero right of s in the height window; there are ≪ U^{R(2s−1)+ε} such rows;
bound their prime polynomials trivially (|Q_ω|² ≤ Z^{z+ε}) and their plain products by the zero-slot case of (18.2). For
the other rows (18.12) holds with κ_s = 2s − 1. The output is a profile-dependent capacity
κ(R) := inf{2s − 1 : the exceptional contribution is ≪ Z^{M+ε}}, and the internal profile R_{κ(R)}.

**Step 6 (averaged continuation → density output; ARGUED).** Fix Q and the targets 𝒯_Q with conductor norm in (Q, 2Q].
For σ below the current half-plane:
* (6a) averaged low side: Σ_{η∈𝒯_Q} sup_{Z′∈[Z,2Z]} |J_η(Z′)|² ≪ |𝒯_Q| Q^{A₀} Z^{2C(σ_L^avg(g))+ε};
* (6b) high side relative to each target's own rightmost zero β_η: |J_η − f_η| ≪ Z^{C(β_η)−σ′}, using the row profile R
  (the rows of η are its sextic twists, again members of 𝓕);
* (6c) detection: if β_η ≥ σ then sup_{Z′∈[Z,2Z]} |f_η(Z′)| ≥ Z^{C(β_η)−ε} for a positive proportion of dyadic Z (the
  Mellin argument of Prop 2.1 read quantitatively).
Hence #{η ∈ 𝒯_Q : β_η ≥ σ} ≪ |𝒯_Q| Q^{A₀} Z^{2(C(σ_L^avg) − C(σ))+ε}. Taking Q ≍ U ≍ Z^d makes this a bound for the rows,
i.e. new values R_dens(δ) of the profile at δ = 2σ − 1, in particular at the central bins Re s ≈ 0.69–0.76.

**Step 6′ (signed floor; ARGUED; revision 2).** The proof of Lemma 10.4 applies the triangle inequality to the original
row sum (l. 4723) and bounds the reciprocal 1/L^S(s, ηχ•(u)) pointwise by U^{ε_d} (l. 4725–4726), so every row enters
through its absolute value, and Lemma 20.1 then multiplies a pointwise row bound by the count (l. 11549). Step 6′
modifies Lemma 10.4 for the floor set only: keep that set's row sum signed, with the reciprocal inside, and on the floor
contour write 1/L^S(s, ηχ•(u)) = P_N(s; u) + Err_N(s; u), with P_N(s; u) = Σ_{n≤N} μ(n)ηχ•(u)(n) n^{−s} w(n/N) the
smoothed truncated reciprocal series (convergent right of the row's zeros, which is what the zero-free bin provides); sum
the P_N-part over all rows by Poisson summation in u (ξ is primitive modulo the primes of S, l. 2699–2714, so
ξ(u)χ_n(u) is a nonprincipal character of u for (n, S) = 1), subtract the non-floor rows (≪ U^{R(δ_f)} of them by the
profile), and bound Err_N absolutely. The output is a floor count exponent R_c < 1 in place of the trivial count 1.

Define **Φ(R) := R ∧ Z_{B(R)} ∧ R_{κ(R)} ∧ R_dens(R)** (pointwise minimum), with the floor bin treated by Step 6′.

**Step 7 (contraction; CLAIMED).** The binding bins of the closing system are central (Re s ≈ 0.69 in the paper system,
0.73 in XS: [R1] Lemmas I.3, I′.3). Step 6 lowers R exactly there and Step 6′ removes the floor, so B drops by a
definite amount at each round, while Steps 4–5 keep the rest of the profile at least as good. Iterating, R_k → R_RH
and B(R_k) → 1/2.

### 2.4 Conclusion of the attempt

Steps 1–7 give Theorem DP, and Lemma 2.2 gives RH.

---

## 3. The attack

### 3.1 Where it fails

* **First unproved steps:** Step 6, inequality (6a), and Step 6′. [OAI-7/8] proves the low side for one fixed target
  with constants, thresholds and arithmetic data depending on the target (l. 403; Prop 20.3, l. 11820–11821: "for every
  primitive finite-order target η, one can then choose its fixed arithmetic data, a positive height exponent τ_η, a finite
  external tail order N_η, and a lower threshold Z_{0,η}"). No averaged or conductor-uniform version exists, and
  (6b)–(6c) inherit the same dependence (§3.10). Step 6′ needs a family average of a reciprocal approximant longer than
  the family (Lemma M, §3.5).
* **First false step:** Step 7. It is false for every profile the map can produce, so no repair of Steps 6 or 6′ saves
  the attempt: with a count-type floor B(R) > 13/15 for every R (Theorem P); with any treatment of a floor at
  Re s < 2/3 and without the zero-loss excess, B(R) ≥ 13/15 unless the counts are below DH on (δ_f, 1/3] (Theorem Q);
  and no step of Φ produces a count below DH there (Corollary Q2). An oracle floor at Re s ∈ (2/3, 5/6) is worth at
  most (3δ_f − 1)/80 < 1/80; an oracle floor beyond 5/6 is the full signed row sum of Remark M2 (Remark Q4). The RH
  profile itself returns only ZF(13/15 + o(1)) with the stated lemmas: the architecture does not reproduce RH from RH.

**Exact failing line.** Step 7, the inequality B(Φ(R)) ≤ B(R) − m(B(R)). Without Step 6 it fails already at
R₀ = R_{3/4}: B(Φ(R₀)) = B(R₀) (paper system; XS up to the 0.003-contraction of round 1, which ends at 0.874886647). With
any Steps 6 and 6′, however strong, every iterate has B(R_k) ≥ 13/15 (Corollary Q2; above 13/15 − 1/80 for an oracle
floor at Re s ∈ (2/3, 5/6), Remark Q4), so m must vanish somewhere in [13/15, B(R₀)] and (ii) fails. The binding objects at 13/15 are not zeros: the count-times-size bound over the on-line
rows (Lemma 20.1, l. 11549, inside Lemma 10.4's triangle inequality, l. 4723), the near-line bins at
density-hypothesis level, and the end of the low side's zero-loss range (Lemma 15.1).

### 3.2 Theorem P: the profile floor

**Lemma P1 (pigeonhole; PROVED).** At the top dyad d = h there are ≍ Z^h = U retained rows. Lemma 10.4 splits them, at
each contour point, into at most C(1 + log Z)^D pointwise sets (l. 4663), so some set C has #C ≥ U^{1−o(1)}, and every
valid count exponent for it is R ≥ 1 − o(1). Lemma 10.4 sums the rows with the triangle inequality (l. 4723) and bounds
the reciprocal pointwise (l. 4725); with Lemma 20.1's count verification (l. 11549) the requirement of C in Step 2 is

  σ₀ ≥ σ_bin(g; δ_C, q_C, 1 − o(1)) ≥ σ_bin(g; 0, 0, 1) − o(1) =: **σ_bulk(g) − o(1)**,
  **σ_bulk(g) = (1 − l_y − ℓ)/2 + 5h/6 = 4/3 − 4l_x/3 − b/2 + ℓ/3**  (EXACT, X1, RF1),

because σ_bin is nondecreasing in δ at R = 1 (coefficient (1 − l_y)/2 + h/2 > 0), in q (coefficient ℓ ≥ 0) and in R
(coefficient h > 0). ∎

Under GRH for every row, each row's bound is already of Lindelöf quality (Lemma 8.1's reflected bound U^{a−1/2+12e} at
a ↓ 1/2, l. 3440), so σ_bulk measures the count-times-size sum over the rows, not any zero. (Any other bound for the
absolute sum over C has the same exponent up to o(1), because |L(w, χ•(u))| at Re w ≈ 1/2 and the normalized slot
polynomials are of size U^{o(1)} for most rows; HEURISTIC, standard first-absolute-moment behaviour, not needed for the
count-type statement.)

**Theorem P (PROVED relative to the exponent model: Lemma 10.4 as stated with Lemma 20.1's counts, (10.15), and
Prop 15.3′; EXACT).** For every profile R and every geometry with M + ℓ ≤ 1 and b ≥ 0,

  **(4/5)σ_low(g) + (1/5)σ_bulk(g) = 13/15 + (1 − M − ℓ)/15 + b/30**  (identity, RF4).

Hence the closing system 𝒮(g, σ₀; R) implies σ₀ ≥ max(σ_low(g), σ_bulk(g)) ≥ 13/15, with equality only if M + ℓ = 1,
b = 0 and σ_low = σ_bulk, i.e. at (l_x, b, ℓ) = (2/5, 0, 1/5), where b = 0 ∉ 𝒢. So **B(R) > 13/15 for every profile R,
including R_RH.**

*Proof.* σ_low(g) ≥ 5/6 + M/12 − ℓ/6 on M + ℓ ≤ 1, with equality on the zero-loss range and a nonnegative excess
outside it ([HS] §3.2). The high side gives σ₀ ≥ σ_bulk(g) − o(1) (Lemma P1). Expand both sides of the identity. On
M + ℓ = 1 and b = 0 the two terms are σ_low = 11/12 − ℓ/4 and σ_bulk = 2/3 + ℓ, equal exactly at ℓ = 1/5. ∎

The certificate uses only M + ℓ ≤ 1 and b ≥ 0. It holds with the zero-loss excess removed, so Lemma 15.1's range
2M ≥ 1 + 3ℓ is not what forces 13/15 here; the bulk is. The full family of certificates is
λσ_low + (1 − λ)σ_bulk − 13/15 = (4/15 − λ/4)(1 − M − ℓ) + (λ/4 − 1/5)(2M − 1 − 3ℓ) + ((1 − λ)/6)b, with nonnegative
multipliers exactly for 4/5 ≤ λ ≤ 1 (RF4); revision 1's vertex enumeration (X4) and an independent scipy LP (RF11, dual
weights 4/5 and 1/5 on the two rows, 1/15 on M + ℓ ≤ 1) agree.

**Remark P2 (triple coincidence; EXACT, X5).** At (2/5, 0, 1/5): σ_low = σ_bulk = 13/15, 2M = 1 + 3ℓ (the end of the
zero-loss range of Lemma 15.1), M + ℓ = 1, C0 = 0. The low side's own floor ([R1] Lemma I.4) and the high side's floor
for a perfect profile are the same point.

**Remark P3 (the bulk alone; EXACT, RF5).** σ_bulk = 2/3 + (2/3)(1 − M − ℓ) + b/6 + ℓ. So without the low side,
min σ_bulk = 2/3 over M + ℓ ≤ 1, b, ℓ ≥ 0, attained only at (l_x, b, ℓ) = (1/2, 0, 0), where σ_low = 11/12. Any
count-type high side, with any profile and any low side, needs σ₀ > 2/3 on this region.

**Corollary P4 (the RH profile; EXACT + MODEL).** B(R_RH) = B(DH) = 13/15 (infimum) with the detector floor → 1/2, and
167/192 with the paper's floor 51/100 (X9; at the floor 51/100 the floor bin dominates every DH bin, X12). In XS:
B_XS(R_RH) ≥ 13/15 because the encoding contains ℓ < 1/5 and the same bulk (E_XS(0, x; R = 1) = C0, X3, RF9); with the
imported gates the values are those of §1, all above the encoding's own range gate B > 87/100. A bootstrap that converges
to RH must at least map R_RH to ZF(1/2 + o(1)); this one maps it to ZF(13/15 + o(1)).

**Cross-check (MODEL, independent code).** A brute-force grid over general geometry, including the low-side excesses
outside the zero-loss range and the column branch, gives min B = 0.867143 → 13/15 from above for both R_RH and DH; on
20000 random admissible geometries with random monotone profiles containing a count-one bin, σ_high ≥ σ_bulk always and
min B = 0.8774 (`tmp/rha-density-profile-crosscheck.py`, C1–C2).

### 3.3 Theorem D: the closing pencil and DH saturation

Take M + ℓ = 1 (where every optimum found lies; [HS] §6) and close at the low-side boundary σ₀ = B = 11/12 − ℓ/4. For a
profile that depends on δ only, x = 1/2 binds (E increases in x). The bin requirement is R(δ) < L_b(δ) with

  **L_b(δ) = 1 − (C0 + δ(1 + 3ℓ)/2)/h**, C0 = −1/4 + b/6 + 5ℓ/4, h = (1 + b + 3ℓ)/2  (EXACT, X6, RF8).

**Theorem D (EXACT).**
1. Every L_b, b ≥ 0, passes through the **pivot (δ_c(B), 2/3)**, δ_c = (5/6 − 3ℓ/2)/(1 + 3ℓ) = (9B − 7)/(18(1 − B)). In
   particular R(δ_c(B)) < 2/3 is necessary for closing at B, whatever b is. The same holds if the low side is slack
   (closing at B with ℓ′ > 11/3 − 4B on M + ℓ = 1): the requirement at δ_c(B) becomes
   R < 2/3 − (ℓ′ − ℓ(B))(1/2 + 3δ_c/2)/h ≤ 2/3 (X13).
2. The slope of L_b is −(1 + 3ℓ)/(1 + b + 3ℓ) ∈ [−1, 0), with −1 only at b = 0.
3. The bulk point (Lemma P1) requires L_b(0) > 1 (L_b is decreasing, so the count-one set at δ_C ≥ 0 forces it), i.e.
   C0 < 0.
4. A line of slope ≥ −1 through (δ_c, 2/3) with value > 1 at δ = 0 exists iff δ_c(B) > 1/3 iff B > 13/15. As B ↓ 13/15
   the pivot tends to (1/3, 2/3) and the admissible lines tend to **R = 1 − δ, the density hypothesis**.
5. For b = 0: L_0(δ) = 1 − δ + 5(B − 13/15)/(6(1 − B)): closing at B > 13/15 with b ↓ 0 needs DH plus the uniform
   allowance 5(B − 13/15)/(6(1 − B)), and no more.
6. At (b, ℓ) = (0, 1/5) both endpoints evaluated on DH are E = δ(x − 1/2)/5 (paper and XS, every c): identically zero on
   the edge x = 1/2 (X12).
7. The paper's ceiling is the pivot: δ_c(ℓ*) = (49 − √921)/48 = δ*, and R*(δ*, 1/2) = 2/3 (X8).

*Proofs.* Items 1, 2, 5–7 are symbolic identities (X6–X8, X12, X13; re-derived independently in RF8); item 3 is Lemma P1
with monotonicity; item 4: a line through (δ_c, 2/3) with slope s has value 2/3 − sδ_c at 0, which exceeds 1 for some
s ∈ [−1, 0) iff δ_c > 1/3, and δ_c(B) − 1/3 has the sign of 15B − 13 (X7). For the slack family the lines have the same
slopes and lie lower at the pivot; directly, their value at 0 exceeds 1 iff ℓ′ < B − 2/3 − b/6, compatible with
ℓ′ ≥ 11/3 − 4B only if B > 13/15. ∎

**Corollary D1 (DH saturation; EXACT + MODEL).** Every profile R ≤ DH gives B(R) = 13/15 (floor → 1/2): for B > 13/15,
b ↓ 0 gives L_0 = DH + positive allowance, which lies above R and above the bulk point; the remaining scalar gates have
slack there ((20.6): −0.0413). So in this architecture the whole value of the profile is exhausted at the density
hypothesis; information beyond DH, up to GRH for every row, is invisible.

**Corollary D3 (the pencil in A(σ) form; EXACT, RF8; revision 2).** With R(δ) = A(σ)(1 − σ), the pivot is at
σ_c(B) = (1 + δ_c(B))/2 = (11 − 9B)/(36(1 − B)), and closing at B requires

  **A(σ_c(B)) < (2/3)/(1 − σ_c(B)) = 24(1 − B)/(25 − 27B).**

The bulk point is the universal fact A(1/2)·(1/2) = 1 (the count of rows with zeros near the line is the count of all
rows), which no profile changes. Theorem D says that 13/15 is the abscissa at which the density-hypothesis line A ≡ 2
through this universal point passes through the pivot:

| target B | σ_c(B) | required A(σ_c) |
|---|---|---|
| 7/8 | 0.694444 | < 2.181818 |
| 0.8749570698 (paper ceiling) | 0.694292 | < 2.180729 (internal counts: = 2.180729) |
| 0.8745 | 0.692674 | < 2.169247 |
| 0.874 | 0.690917 | < 2.156919 |
| 0.872 | 0.684028 | < 2.109890 |
| 0.870 | 0.677350 | < 2.066225 |
| 0.868 | 0.670875 | < 2.025575 |
| 13/15 | 2/3 | < 2 (density hypothesis) |

**Corollary D2 (what the profile must deliver at each B; EXACT + MODEL, L4).** To close at B ∈ (13/15, 0.874957] the row
profile must have count < 2/3 at Re s = (1 + δ_c(B))/2 ∈ (2/3, 0.6943]. Table (pivot count 2/3 against DH and the
internal count):

| target B | ℓ = 11/3 − 4B | pivot δ_c (Re s) | required count | DH at pivot | internal R* at pivot | XS pivot δ_c (Re s) | XS required | XS DH | XS R_κ |
|---|---|---|---|---|---|---|---|---|---|
| 0.874957 | 0.16684 | 0.3886 (0.6943) | < 2/3 | 0.6114 | 0.6667 | 0.4698 (0.7349) | < 0.5904 | 0.5302 | 0.5899 |
| 0.8745 | 0.16867 | 0.3853 (0.6927) | < 2/3 | 0.6147 | 0.6697 | 0.4666 (0.7333) | < 0.5901 | 0.5334 | 0.5930 |
| 0.874 | 0.17067 | 0.3818 (0.6909) | < 2/3 | 0.6182 | 0.6729 | 0.4631 (0.7316) | < 0.5899 | 0.5369 | 0.5963 |
| 0.872 | 0.17867 | 0.3681 (0.6840) | < 2/3 | 0.6319 | 0.6855 | 0.4494 (0.7247) | < 0.5889 | 0.5506 | 0.6096 |
| 0.870 | 0.18667 | 0.3547 (0.6774) | < 2/3 | 0.6453 | 0.6977 | 0.4358 (0.7179) | < 0.5878 | 0.5642 | 0.6225 |
| 0.868 | 0.19467 | 0.3418 (0.6709) | < 2/3 | 0.6582 | 0.7094 | 0.4225 (0.7113) | < 0.5869 | 0.5775 | 0.6350 |
| 13/15 | 1/5 | 1/3 (2/3) | < 2/3 | 2/3 | 0.7170 | 0.4138 (0.7069) | < 0.5862 | 0.5862 | 0.6432 |

(MODEL, `tmp/rha-density-profile-ladder.py` L4; XS at κ = 29991/40000.) The requirement at the paper pivot is fixed (2/3)
while DH at the pivot rises from 0.6114 to 2/3 as B ↓ 13/15: the margin over DH closes exactly at the floor. The internal
count exceeds the requirement for every B < 0.874957 (paper) and B < 0.87489 (XS): every step below the round-1 values
needs a count below the proved one at Re s ≈ 0.67–0.73, i.e. a new family zero-density estimate there.

**Xu–Sang pencil (EXACT, X10).** The XS endpoint has the same structure with pivot
δ_c^XS = (5/6 − 3ℓ/2)/(1 + ℓ(1 + c)) and pivot count 5/9 + cδ_c/6 (the b-neutral count of [HS] §10); inverting it gives
PR #14's closed form ℓ* = (5 − 6δ*)/(9 + 6δ*(1 + c)). At ℓ = 1/5 the XS pivot is δ_c = 8/(3(6 + c)) and its count equals
1 − δ_c: it lies on DH for every c. The XS lines are not restricted to slope ≥ −1 (slope
(bc − 5cℓ + c − 8ℓ − 8)/(6(1 + b + 3ℓ)), X10), but the bulk C0 < 0 and the gate ℓ < 1/5 give B > 13/15 directly.

### 3.4 Theorem Q: the density-hypothesis floor for every treatment of the floor bin (revision 2)

Theorem P uses the floor set with its trivial count. Step 6′ proposes a signed floor; Lemma M (§3.5) argues it is not
available, but the following theorem shows that even an oracle for it would not help unless the profile is below the
density hypothesis near the line.

**Theorem Q (PROVED relative to the exponent model; EXACT identity RF6).** Let g satisfy M + ℓ ≤ 1 and b ≥ 0, and let
the low side satisfy σ_low(g) ≥ 5/6 + M/12 − ℓ/6 (the stated Prop 15.3′, with or without Lemma 15.1's zero-loss excess).
Suppose the closing system closes at B (β* ↓ B) with any treatment of the floor bin, and let (δ, x) be a nonempty bin with
δ ≤ 2B − 1 whose sets are verified by counts with exponent R = R(δ, x). Then

  (4/5)σ_low(g) + (1/5)σ_bin(g; δ, xδ, R) = 13/15 + (1 − M − ℓ)/15 + b(1 − 3δ)/30 + h(R − 1 + δ)/5 − (1/2 − x)δℓ/5,

and therefore

  **R(δ, x) ≤ 1 − δ − (5/h)·[13/15 − B + (1 − M − ℓ)/15 + b(1 − 3δ)/30 − (1/2 − x)δℓ/5].**

In particular, for every nonempty bin with δ ≤ 1/3 at amplitude x = 1/2: R(δ, 1/2) ≤ 1 − δ − 5(13/15 − B)/h.

*Proof.* Both σ_low(g) ≤ B and σ_bin(g; δ, xδ, R) ≤ B (the bin requirement σ_bin < β* for every β* > B); take the
convex combination and expand (RF6). For δ ≤ 1/3 the terms (1 − M − ℓ)/15 and b(1 − 3δ)/30 are nonnegative. ∎

**Corollary Q1 (DH floor; EXACT + MODEL).** (i) Let the floor sit at a_f < 2/3 (δ_f < 1/3). If R(δ₁, 1/2) ≥ 1 − δ₁ for
some nonempty bin δ₁ ∈ (δ_f, 1/3], then B ≥ 13/15, for every treatment of the floor bin (count, signed, or deleted) and
with or without the zero-loss excess. In particular DH counts, and every profile at or above DH near the line (the
internal R*, Selberg-type 1 − δ/8), give B ≥ 13/15. (ii) Closing at B < 13/15 needs, simultaneously: a non-count floor
(Theorem P); a uniform saving ≥ 5(13/15 − B)/h below DH on every nonempty bin of (δ_f, min(1/3, 2B − 1)] (Theorem Q);
and the removal of the zero-loss excess, since on the zero-loss range nothing below 13/15 is possible at all
(σ_low ≥ 13/15 there, [R1] Lemma I.4). Without the excess the low side still satisfies σ_low ≥ 5/6 on l_x ≥ ℓ (RF11).

**Proposition Q3 (sharpness; EXACT RF12, MODEL Q1).** Remove Lemma 15.1's excess and the floor bin by oracles, and take
the profile R(δ) = 1 − δ − s (uniform saving s below DH). In the structural model (low side, every bin at the top dyad
d = h, which binds here because R + δ/2 − 17/50 > 0 on the relevant bins, and the floor) the closing abscissa is exactly

  **B(s) = 11/12 − (1 + 2s)/(4(5 − 6s)) = 13/15 − 4s/(5(5 − 6s))**,  0 ≤ s ≤ 1/6,

at b = 0, ℓ = (1 + 2s)/(5 − 6s), l_x = (1 − ℓ)/2, h = 4/(5 − 6s), where the low side and every sub-DH bin are tight, so
the bound of Theorem Q is attained. At s = 1/6 the geometry reaches l_x = ℓ = 1/3 and B = 5/6, the floor of the low-side
formula on l_x ≥ ℓ; beyond, B stays 5/6. With the excess kept, B(s) = 13/15 for every s. The oracle-regime LP
(`tmp/rha-density-profile-thmQ.py`, independent code) gives:

| profile (oracle regime: excess removed, floor signed or deleted) | B | Theorem Q bound |
|---|---|---|
| DH | 0.8666667 = 13/15 | 0.8666667 |
| internal R* (κ = 3/4) | 0.8749570 | 0.8748308 |
| saving s = 0.02 below DH | 0.8633880 | 0.8633880 |
| s = 0.05 | 0.8581560 | 0.8581560 |
| s = 0.10 | 0.8484848 | 0.8484848 |
| s = 0.20 | 0.8333333 = 5/6 | 0.8266667 |
| RH profile | 0.8333333 = 5/6 | — |
| Selberg-type 1 − δ/8 (HEURISTIC for this family) | does not close | — |
| any profile, paper low side (excess kept), any floor treatment | ≥ 0.8666667 | — |

So below 13/15 a profile in this architecture is worth exactly its uniform saving below the density hypothesis near the
line, at the exchange rate 4/(5(5 − 6s)) per unit, and only after both zero-blind obstructions have been removed.

**Remark Q4 (floors beyond Re s = 2/3; EXACT bound, MODEL values).** Suppose an oracle treats as one signed floor every
row whose zeros lie left of a_f = (1 + δ_f)/2 with δ_f > 1/3. Then there are no bins in (0, 1/3]. For 1/3 < δ_f < 2/3 a
bin with δ ∈ (δ_f, 2B − 1] still exists (B ≥ 5/6), and Theorem Q's identity gives B ≥ 13/15 − b(3δ − 1)/30 for DH counts
just above the floor, i.e. **B ≥ 13/15 − (3δ_f − 1)/80 > 13/15 − 1/80**, since the length conditions force b ≤ 3/8
(l_x ≥ ℓ + 5b/6 and 2l_x + b + ℓ ≤ 1). With the zero-loss excess removed and DH above the floor, the oracle-regime LP
(`tmp/rha-density-profile-thmQ-bigfloor.py`) gives B = 0.86623 (δ_f = 0.36), 0.86566 (0.4), 0.86434 (0.5) with a signed
floor at count 1/2, and 0.86307 (0.6), 0.86248 (0.65) with the floor deleted outright (with a signed floor its own
requirement binds from δ_f ≈ 0.6: 0.87796, 0.88380). For δ_f ≥ 2/3 the oracle contains every row whose zeros lie left
of Re s = 5/6, which at B ≥ 5/6 is all the bins near the abscissa; a deleted floor then gives 0.86192 (0.7), 0.85837
(0.75), 0.85287 (0.8), and in the limit δ_f → 1 the low side's 5/6. That oracle is a signed sum over essentially all rows
on a contour at Re s ≥ 5/6, i.e. the scalar channel of Remark M2. With the zero-loss excess kept every value is 13/15.
Below Re s = 5/6 such an oracle is a signed sum over a set defined by zero locations whose complement still has
U^{1−δ_f} rows under DH; nothing in the map comes near it (Lemma M), and its value is below 1/80 in the abscissa.

### 3.5 Step 6′ and Lemma M: the contour price of a signed floor (revision 2)

**General-contour exponent (EXACT, RF1).** From the ingredients of the proof of Lemma 10.4 (outside factor of W and
q_u^{−z}, l. 4729–4733; the set bound (10.13); subtraction of C(σ₀), l. 4735), a set of rows of norm U = Z^d on the
contours (Re s, Re w, Re z) = (s₁, w₁, 17/50), with per-row numerator |L(w, χ•(u))| ≪ U^{ν_w}, set exponent R and slot
exponent g, has

  E = s₁ − σ₀ − l_y(1 − w₁) + z₀(h − d) − ℓ/2 + g − h/6 + d(R + ν_w),

which is (10.15) at (s₁, w₁, ν_w) = (a, 1 − a, a − 1/2). At d = h the requirement is
σ_gen := s₁ − l_y(1 − w₁) − ℓ/2 + g − h/6 + h(R + ν_w) < β*. On the reflected range the slope in w₁ is l_y − h ≤ −2ℓ ≤ 0
(RF3), so the paper's contours are optimal for count-type bounds, and **σ_gen has slope exactly 1 in s₁** (the factor
Z^{s} of W).

**Lemma M (contour price; bookkeeping EXACT RF10, conclusion ARGUED).** Write r > 0 for the distance of the s-contour
from the zeros. Let the floor rows (rightmost zeros in the window at β_u ≤ a_f + 2e) be evaluated on Re s = a_f + r, and
let 1/L^S(s, ηχ•(u)) be replaced by a family-uniform approximant of length N = U^ν, i.e. an expression in the characters
χ•(u)(n), n ≤ N, to which Poisson summation or a large sieve in u applies.
1. *Cost (EXACT).* Relative to the floor contour a_f + 16e the exponent rises by r − 16e.
2. *Error (ARGUED).* For a row whose rightmost zero in the window is at β_u, the smoothed truncated reciprocal series has
   error N^{−(Re s − β_u)+O(e)}: the upper bound follows by moving the Perron contour to the edge of the buffered
   zero-free region, where Lemma 8.1 bounds the reciprocal by U^{ε₁} (l. 3434–3436); the residue
   N^{ρ−s}ŵ(ρ − s)/L′(ρ) at the zero is of that size, so this is also the generic size. For the floor set with the floor
   at 1/2 (rows with zeros near the line), Re s − β_u = r + O(e) on Re s = a_f + r. Summed absolutely over the
   U^{1−o(1)} floor rows, the error part keeps exponent ≥ 1 − νr.
3. *Balance (EXACT given 1–2).* The saving is at most h·νr in the exponent (U^{−νr} = Z^{−hνr} at d = h), the cost is r,
   so the net change is r(1 − hν): a gain needs ν > 1/h, i.e. **N > U^{1/h} = Z**. Since 1 − h = l_x − ℓ ≥ 0 on the
   region, N > U: the approximant must be longer than the family it is averaged over.
4. *Family averages beyond the family size (ARGUED).* The tools of [OAI-7/8] for sums over u (Poisson summation in u, the
   sextic and cubic large sieves) bound such a signed sum through mean squares whose dual term has size N: Cauchy–Schwarz
   with a bound Σ_u |Σ_{n≤N} b_n χ_n(u)|² ≪ (U + N)^{1+ε} Σ|b_n|² gives √(U(U + N)) for the polynomial part, no better
   than the count bound U once N > U. Pólya–Vinogradov for each modulus n, summed against coefficients of size
   n^{−1/2−r}, gives Σ_{n≤N} n^{−r} ≈ N^{1−r}, which is above U whenever N > U^{1/(1−r)}, in particular for N > Z when
   r < 1 − h. In addition the non-floor rows (≪ U^{R(δ_f)} of them, with R(δ_f) → 1 as δ_f → 0 for every density-type
   profile) must be subtracted, and P_N is not controlled on them pointwise.

So Step 6′ fails at items 3–4 in this architecture: a zero-location input (a zero-free bin, a half-plane, a profile)
makes the reciprocal series converge near its zeros only at the rate N^{−r}, and the contour on which that convergence is
used costs Z^{r}. A signed floor would need a family estimate for polynomials longer than Z, which no step of the map
supplies. (HEURISTIC remark: the twist ξ(u), primitive modulo the primes of S, makes every character ξ(u)χ_n(u) with
(n, S) = 1 nonprincipal, so the signed floor sum is not blocked by a diagonal main term of size U; the obstruction is the
contour price, not a main term.)

**Remark M2 (the scalar version is round 1; bookkeeping EXACT RF1, RF13; values MODEL; conclusion ARGUED).** Put all
rows on a common contour s₁ = θ + r, which the input ZF(θ) permits, with Re w = 1/2 and ν_w = 0 on average. A step to
σ₀ < θ needs the signed exponent of the whole row sum to satisfy R_c < 1/6 + (l_y + ℓ)/(2h) − (θ − σ₀ + r)/h, where
1/6 + (l_y + ℓ)/(2h) ≤ 2/3 on the region. The U^{1−o(1)} rows whose zeros lie near the line are now at distance
θ + r − 1/2 from the contour, so by item 2 the truncation error leaves R_c ≥ 1 − ν(θ + r − 1/2). For an infinitesimal
step (σ₀ → θ, r → 0) at a geometry whose low side allows σ₀ < θ, this forces ν > ν_min(θ) with ν_min = 1.154 at
θ = 7/8, 0.8749571 and 0.8748866, and 1.221 at θ = 13/15 (`tmp/rha-density-profile-scalar-channel.py`; required
R_c < 0.567 and 0.552). So the scalar channel needs near square-root cancellation over the whole family for twists of
length N > U^{1.15}, longer than the family, with or without the zero-loss excess. For s₁ ≥ 1 the reciprocal series
converges absolutely and needs no zero input, but then even square-root cancellation (R_c = 1/2) gives
σ_gen = 4/3 − 5l_x/6 − b/2 − ℓ/6 ≥ 85/96 = 0.8854 > 7/8 on the region (RF13). This is the capacity channel of [R1]
Theorem S seen from the signed side.

**Theorem Q and Lemma M together.** Even if a signed floor were supplied by some other means, Theorem Q shows that the
near-line bins at density-hypothesis level re-impose 13/15: by RF7, a bin with count 1 − cδ costs σ_bulk − δh(c − c*),
c* = 1 − b/(2h), so DH bins (c = 1) are cheaper than the floor only by bδ/2.

### 3.6 Theorem SP and Corollary Q2: the profile map stops

**Theorem SP (PROVED for the LP; MODEL for the values).** Let R be any profile whose closing optimum (b, ℓ) has its
binding bins at δ ≤ 2B(R) − 1. Then B(R ∧ Z_{B(R)}) = B(R).

*Proof.* Z_{B(R)} only deletes bins with δ > 2B(R) − 1 (Step 4). For fixed counts the closing problem is a linear
programme in (b, ℓ) (plus one convex gate in XS); deleting constraints that are slack at an optimum leaves that point
feasible and locally optimal, hence globally optimal by convexity. ∎

Every computed optimum satisfies the hypothesis with room: B(R) > 13/15 gives 2B − 1 > 11/15 = 0.733, while the binding
objects are the bulk (δ = 0), the pivot (δ_c ≤ 0.389 paper, ≤ 0.470 XS) or scalar gates. At the optima the deleted bins
have max E between −1.56·10⁻² (paper, DH) and −4.10·10⁻² (paper, internal); XS internal −2.17·10⁻², XS (H) −1.75·10⁻²,
XS DH −2.90·10⁻² (MODEL, `tmp/rha-density-profile-slack.py` S1). The only remaining channel is the capacity κ = 2B − 1 of
Steps 4–5, which is round 1's scalar map: constant in the paper system (Lemma 18.1 is applied at κ = max(3/4, 2β* − 1),
and κ = 3/4 is already licensed by the 7/8 theorem) and contracting with ratio 0.00302 in XS. MODEL run
(`tmp/rha-density-profile-map.py`):

| k | κ_k | B(R_k) | B after deleting δ > 2B − 1 | binding bin (Re s) | pivot δ_c^XS |
|---|---|---|---|---|---|
| 0 | 0.75 | 0.8748869890 | 0.8748869890 | 0.7343 | 0.4694 |
| 1 | 0.7497739781 | 0.8748866475 | 0.8748866475 | 0.7343 | 0.4693 |
| 2 | 0.7497732949 | 0.8748866464 | 0.8748866464 | 0.7343 | 0.4693 |
| 3–5 | 0.7497732929 | 0.8748866464 | 0.8748866464 | 0.7347 | 0.4693 |

(The LP grid reproduces the exact fixed point 0.874886647040 of [R1] to 6·10⁻¹⁰; the κ-range below 29991/40000 is used
as in [R1] and is outside what PR #14 admits.)

**Corollary Q2 (the map never goes below DH near the line, so never below 13/15; PROVED within the exponent model,
revision 2).** Let R₀ = R_{3/4} and R_k = Φ^k(R₀), with Step 6′ replaced by any oracle for a floor bin at a_f < 2/3, with
Lemma 15.1's excess removed, and with every probe (including those of Step 6) at a geometry with M + ℓ ≤ 1, b ≥ 0 (the
region of the low side, which (6a) shares). Then R_k(δ, 1/2) ≥ 1 − δ for all δ ∈ (δ_f, 1/3] and all k, and
B(R_k) ≥ 13/15. (For floor oracles at Re s ∈ (2/3, 5/6) see Remark Q4: the closing bound weakens by at most
(3δ_f − 1)/80 < 1/80, and Step 6's blindness then rests on (6a) failing below 2/3, ARGUED. An oracle beyond Re s = 5/6
is the full signed row sum of Remark M2.)

*Proof.* By induction on k. R₀ = R* ≥ 1 − δ on [0, 5/6] (R* = 1 − δ + (α − δ)δP_x/(2J) with every term ≥ 0). Step 4
changes R only at δ > 2B − 1 > 11/15 and through κ; the internal counts R_κ are ≥ 1 − δ for every κ. Step 5 changes only
κ. Step 6 can lower R at δ only by counting all targets with β_η ≥ (1 + δ)/2, which needs (6b) at σ₀ = β_η for each of
them, including those with β_η just above (1 + δ)/2 ≤ 2/3. For such a target, (6b) needs every nonempty bin of η's rows
to satisfy σ_bin < β_η ≤ 2/3. Under the induction hypothesis a near-line bin (δ′ ≤ 1/3, x = 1/2) carries a count
≥ 1 − δ′ and therefore costs σ_bin ≥ σ_bin(DH) = σ_bulk − bδ′/2 = 2/3 + (2/3)(1 − M − ℓ) + ℓ + b(1/6 − δ′/2) ≥ 2/3
(RF5–RF7), whatever the floor treatment. So Step 6 produces nothing at δ ≤ 1/3, the hypothesis passes to R_{k+1}, and
Corollary Q1(i) gives B(R_{k+1}) ≥ 13/15. ∎

**Fixed points.** Every profile is a fixed point of Φ after one step, apart from the scalar κ channel. Starting from the
proved data the iteration ends at 0.8749570698 (paper system, unconditional given [OAI-7/8], MODEL beyond 7/8) and at
0.874886647040 (XS, conditional). Over all profiles the infimum of the fixed-point values is 13/15, reached exactly by the
DH-quality profiles (Corollary D1), which the map never produces; and no iterate goes below 13/15 even with oracles for
the floor bin (at Re s < 2/3) and the zero-loss excess (Corollary Q2).

### 3.7 The profile ladder

All values MODEL (LP on a 1201 × 11 (δ, x) grid, margin 10⁻¹²), validated against six published values (exact paper
ceiling to 3·10⁻⁹, 167/192, 13/15, B*(29991/40000) to 7·10⁻¹⁰, 0.8738174, 0.8734878).

| profile | paper system, floor 51/100 | paper, floor → 1/2 | XS (all imported gates) |
|---|---|---|---|
| internal (R*, resp. R_κ) | 0.8749570672 | 0.8749570655 | 0.8748866490 |
| DH only on δ ≥ 0.4 (Re s ≥ 7/10) | 0.8749570672 (no gain, [HS] Prop G) | — | — |
| DH only on δ ≥ 0.3 | 0.8746596214 | — | — |
| uniform saving ε = 0.005, all row norms | 0.8741898478 | 0.8741898471 | 0.8742284 ([HS] §13) |
| ε = 1/120 ((H)-sized) | 0.8736804263 (floor binds) | 0.8736719106 | 0.8738174210 |
| ε = 0.02 | 0.8732342681 | 0.8718173467 | 0.8734878258 (cap) |
| ε = 0.04 | 0.8725657117 | 0.8702443083 (bulk binds) | cap |
| ε = 0.10 | 0.8705600423 | 0.8682021027 | cap |
| ε = 0.15 | 167/192 | 13/15 (b ↓ 0; bulk, ℓ ≤ 1/5, b > 0 tight) | cap |
| DH in every bin | 167/192 | 13/15 | 0.8734878258 |
| RH profile | 167/192 | 13/15 | 0.8734878258 |

(Savings ε here are relative to the internal counts R*, which lie above DH; the savings s of Proposition Q3 are relative
to DH. The XS saving is applied on δ ≥ 1/8 as PR #14 states (H); the paper-system saving is applied consistently at every
row norm, including the d ≤ 1/2 range of (20.11), `tmp/rha-density-profile-paper-saving.py`. If a count improvement is
applied only at the top row norm d = h, the d ≤ 1/2 range, with its internal count 76/75 − 2δ/3, binds together with the
floor bin at 0.8739028246 for every ε ≥ 1/120 (`tmp/rha-density-profile-ladder.py` L1–L2): a profile must be valid at
every row norm to be worth anything below that value.)

### 3.8 The fourth moment (H) and the (H_θ) ladder

**Dictionary (EXACT, X11).** XS bounds the reflected numerator average over a detected class 𝓑 by Hölder,
Σ_{u∈𝓑} |S_m| ≤ (#𝓑)^{3/4} (Σ|S_m|⁴|Q_sel|²)^{1/4}, which is the source of the count weight 3h/4 ([HS] §10). With #𝓑 ≤ U^R
and a restricted fourth moment U^{θ+ε} the exponent is (3R + θ)/4 = (3(R − ε) + 1)/4 with **ε = (1 − θ)/3**. PR #14's
(H), θ = 39/40, is ε = 1/120 (η = 1/160 per unit d, `TARGET_0874.md`).

**Ladder (MODEL, conditional on XS).**

| θ (restricted fourth moment U^θ) | 1 | 0.99 | 39/40 = (H) | 0.97 | ≤ θ* |
|---|---|---|---|---|---|
| B | 0.8748866490 | 0.8744418467 | 0.8738174210 | 0.8736191282 | 0.8734878258 |

θ* = 0.966626 (ε* = 0.011125): every restricted moment U^{θ+ε} with θ ≤ θ* gives the gate cap 0.8734878 and nothing
lower (MODEL, L5). Needed exponent for a target B (bisection, L3): B = 0.8748: θ = 0.99810; 0.8745: 0.99134; 0.874:
0.97950; 0.8738: 0.97457; 0.8736: 0.96951; 0.8735: 0.96694. Paper system, saving applied at every row norm
(`tmp/rha-density-profile-paper-epsB.py`, floor → 1/2): ε(0.874) = 0.0062, ε(0.872) = 0.0189, ε(0.870) = 0.0472,
ε(0.868) = 0.1059, ε(0.867) = 0.1353, and a uniform saving reaches 13/15 only in the limit (ε ≈ 0.15); with the floor
51/100 the limit is 167/192.

**Why the profile map does not produce (H) or any rung.**
1. Steps 3–4 change the profile only at δ > 2B − 1 > 0.733, and (H) is a statement at the pivot δ_c^XS ≈ 0.469
   (Re s ≈ 0.735, rows with a zero there).
2. Step 5 changes only κ, whose total effect is the 0.003-contraction.
3. Step 6 outputs counts, not moments. PR #14's saturation example (`TARGET_0874.md`) shows that #𝓑 ≤ U^R together with
   the global fourth moment U cannot force any saving; (H) needs a joint detector/numerator estimate on the detected
   class. A count output can replace (H) only by being a count saving itself: DH at the pivot is a saving of
   R_κ(δ_c) − (1 − δ_c) = 0.590332 − 0.530655 = 0.0597 > 1/120, which reaches the gate cap, and in the paper system 13/15.

So (H) is the first rung of a count/moment ladder whose last rung (DH) is the floor of Theorems P and Q. Every rung of the
ladder leaves the counts at or above DH, so by Theorem Q none of them, alone or together, acts below 13/15.

### 3.9 Step 5 (capacity) in detail

READ (l. 9558–9603): "Under the hypothesis s_κ ≥ β*, the global part of Lemma 4.9 gives … L′/L(s_κ + e + it, ψ) ≪
log(2Q_ψ(3 + |t|)²) … move its contour to Re s = s_κ + e … Here … 2s_κ − 1 = κ … For κ < 1 the hypothesis remains
β* ≤ (1 + κ)/2." The half-plane enters Lemma 18.1 through this pointwise prime-sum bound per row (the rest of §18 was
not searched line by line for further uses). Step 5's exceptional-row splitting is a legitimate way to feed a profile
into the same place, but its maximal effect is the effect of the capacity itself: [HS] §8 prices capacity (1 − 2m)/2 at
0.874177 and all moment levers together at 0.870209 (MODEL), and by Theorem P no capacity, however large, gives a closing
abscissa ≤ 13/15. Step 5 is not where the attempt fails, but it cannot carry the contraction.

### 3.10 Step 6 (averaged continuation) in detail

1. **Target-uniformity (READ).** Prop 2.1 lets "the implied constants, lower thresholds, excluded set, and function H_η
   depend on η" (l. 403); Prop 20.3 chooses the arithmetic data, τ_η, N_η and Z_{0,η} after the target (l. 11820). (6a)
   needs a loss Q^{A₀} with A₀ explicit, and (6b)–(6c) need Z_{0,η} ≤ Q^{O(1)}. None of this is in the manuscript.
2. **Scale mismatch (PROVED from the definitions).** To feed the output back as the row profile, the targets must have
   conductor ≍ U = Z^d with d near h ≈ 0.8 (the binding dyad), so the argument must run at Z ≍ Q^{1/d} ≈ Q^{1.25}. Prop 2.1
   is built for a fixed target and Z → ∞; any loss Q^{A₀} = Z^{A₀ d} must be below the exponent margins, which are of size
   10⁻⁴–10⁻³ ((20.10): 49/440640). This forces A₀ ≲ 10⁻³: conductor-aspect uniformity with essentially no loss.
3. **The high side must be relative to the target's own zero.** (2.5) is measured against C(β*), the global supremum
   (l. 389–395). A target whose rightmost zero is at β_η ≈ 0.73 < β* has |f_η| ≈ Z^{C(β_η)}, invisible against an error
   Z^{C(β*)−σ}. (6b) is the closing system at σ₀ = β_η for that target; with a count floor it needs σ_bulk(g) < β_η,
   possible only for β_η > 2/3 (Remark P3); with any floor treatment and near-line counts at or above DH it needs
   β_η > 2/3 as well (proof of Corollary Q2). Since σ_low(g) ≥ 13/15 on all of 𝒢, the per-target low side is unusable for
   every β_η < 13/15, so everything rests on the unproved (6a).
4. **Output type (PROVED).** Step 6 outputs counts ≪ Q^{c}, c > 0. A count bound with c > 0 excludes no individual zero;
   by MV-CAP Theorem C a window replacement moves a density count by at most 1. The only zero-free output of Φ is
   Z_{B(R)} from Step 3, and B(R) ≥ 13/15 (Corollary Q2; 13/15 − 1/80 with an oracle floor at Re s ∈ (2/3, 5/6)).
   Even an ideal Step 6 delivering DH at every scale gives 13/15 (Corollary D1, Theorem Q).

### 3.11 The other architectures, briefly

* **Möbius route ([OAI-11/12], [R1] Attempt II).** The resonant rows u = ζa⁶ carry the target L(s, ν) with multiplicity
  ≍ H^{1/6} ([R1] Lemma II.1). A multiplicity-weighted profile with A(σ)(1 − σ) < 1/6 on (σ₁, 1] therefore already
  excludes zeros of the target on (σ₁, 1]: the profile needed for contraction contains the conclusion ([R1] Lemma II.4,
  now pointwise in σ). Circular.
* **Landau functionals ([R1] Attempt III).** The growth exponents of D, the box floor and the Möbius energy are all
  functions of the scalar Θ = sup Re ρ ([R1] Theorem III.1, Lemma III.2, Proposition III.3). Their "profile" has no
  degrees of freedom beyond Θ, so round 1's F(θ) = θ is the whole story there.

---

## 4. What a working step would need

In this architecture the requirements below 13/15 are now explicit (Theorems P and Q, Proposition Q3):

1. **The low side beyond the zero-loss range.** On 2M ≥ 1 + 3ℓ the low side is ≥ 13/15. Removing Lemma 15.1's excess
   lowers the base formula's floor to 5/6 (on l_x ≥ ℓ); σ₀ < 5/6 needs a Poisson row range h > 1 (attempt-b §2, READ in
   [R1]). This is an estimate for cubic-theta sums; it contains no L-function zero.
2. **A non-count floor.** The U^{1−o(1)} rows near the critical line must be summed with cancellation, which means
   modifying Lemma 10.4 so that the floor set's row sum stays signed with the reciprocal inside (Step 6′). By Lemma M, in
   this architecture that needs a family estimate for reciprocal approximants longer than Z. This is an instance of the
   atlas closing line's "genuine all-scale signed arithmetic estimate".
3. **A profile below the density hypothesis near the line.** Every nonempty bin with δ ≤ 1/3 (zeros with real part
   ≤ 2/3) must have count at most 1 − δ − 5(13/15 − B)/h. The exchange rate is exact (Proposition Q3): saving s gives
   13/15 − 4s/(5(5 − 6s)). This is a family zero-density estimate beyond the density hypothesis in σ ∈ (1/2, 2/3]; for
   ζ itself the density hypothesis is not known on that range (RECALLED: Ingham's exponent 3/(2 − σ) is above 2 there).

All three are needed together (with any two of them the third keeps B ≥ 13/15), the first two contain no zero, and the
profile map produces none of them (an oracle floor at Re s ∈ (2/3, 5/6) would be worth less than 1/80, Remark Q4; one
beyond 5/6 is the full signed row sum, Remark M2).
A profile bootstrap through this architecture therefore stops at 13/15 or above whatever the profile, and it cannot pass
5/6 in any case without a new probe. RH is out of reach of this architecture by a margin of 1/3 in the abscissa.

---

## 5. The walls

**(1) Flow-blindness (`src/data/flow-blindness-no-go.js`, SL2).** SL2 rules out proofs whose hypotheses on the profile
Φ survive Φ ↦ e^{−εu²}Φ. The attempt uses Hecke Euler products, sextic reciprocity, Patterson's cubic theta coefficients
and the twist structure of the family (rows are members of 𝓕); the backward-heat-flowed Ξ_ε has none of them, so SL2
does not apply. The places where the argument is stopped are those where the method uses size only: the count-times-size
bound over rows (Lemma 20.1) and the zero-blind low side.

**(2) NS-RIGID (`src/data/imp-95530-native-span-arithmetic-input-rigidity.js`).** No Hermitian form on the twin-ladder
native span is built; the input is Dirichlet coefficients of the family, the module's loophole class. The module
predicts that this class produces mean-value/proportion statements whose passage to every zero is the pointwise wall.
The profile is exactly such a statement, and Theorems P and Q quantify the wall here: the pointwise device (Prop 2.1) has
a zero-blind threshold of 13/15 that no profile at or above DH moves, and the price of every profile below DH is exact.

**(3) Verified-height wall.** No finite-height or finite-support input is used; all exponents are uniform in height,
conductor and character. The finite certificates of the whole-even and spectral-repair modules are not used (atlas §9).
Not blocked; the failure is unrelated to verified height.

**(4) Pointwise / MV-CAP (`src/data/route-42-formal-mv-cap-2026-10-10.js`, `formalization/paper/mv-cap-theorem.md`).** The
profile is a family density statement, the class whose window sensitivity MV-CAP Theorem C bounds by 1. The attempt
claimed to pass the wall through Prop 2.1's pointwise device fed by the profile. The attack shows the device's threshold
is set by zero-blind estimates (Theorem P), that the profile is worth something below that threshold only beyond the
density hypothesis near the line (Theorem Q), and that the density output of Step 6 cannot certify any single zero
(§3.10 (4)). MV-CAP is not contradicted; the attempt stops at the family-to-single passage, as predicted.

**Vortex trapping = RH (`research-checkpoints/vortex-blocker-reduction-2026-11-01/README.md`).** Not used; no heat flow.

**Davenport–Heilbronn test.** A function with the functional equation but no Euler product has no twist family, so the
architecture does not apply to it; the test is not informative here. The obstructions found are zero-blind or
count-type and would be the same for any family with the same size parameters.

---

## 6. Reproduction, checks, referee record, limits

### 6.1 Commands

```
.venv-arb/bin/python tmp/rha-density-profile-exact.py tmp/rha-density-profile-exact.json        # X1–X13, EXACT (sympy/Fraction), < 1 s
.venv-arb/bin/python tmp/rha-density-profile-map.py tmp/rha-density-profile-map.json            # MODEL: ladder, XS gate readings, Phi iteration, 6 validations, ~16 s
.venv-arb/bin/python tmp/rha-density-profile-paper-saving.py tmp/rha-density-profile-paper-saving.json  # MODEL: consistent paper-system savings, ~2 s
.venv-arb/bin/python tmp/rha-density-profile-ladder.py tmp/rha-density-profile-ladder.json      # MODEL: binding diagnostics, eps(B), pivots, theta*, bulk alone, ~8 min
.venv-arb/bin/python tmp/rha-density-profile-paper-epsB.py tmp/rha-density-profile-paper-epsB.json  # MODEL: paper-system eps(B), consistent saving, ~45 s
.venv-arb/bin/python tmp/rha-density-profile-crosscheck.py tmp/rha-density-profile-crosscheck.json  # independent code: grid over general geometry, random profiles, pencil, DH identity, ~5 s
.venv-arb/bin/python tmp/rha-density-profile-slack.py tmp/rha-density-profile-slack.json            # MODEL: slack of deleted bins (Theorem SP), XS binding gates for the RH profile, ~3 s
# revision 2
.venv-arb/bin/python tmp/rha-density-profile-referee.py tmp/rha-density-profile-referee.json        # RF1–RF13: EXACT re-derivation + certificates + Theorem Q + sharpness + scalar contour; scipy LPs; ~3 s
.venv-arb/bin/python tmp/rha-density-profile-thmQ.py tmp/rha-density-profile-thmQ.json              # MODEL: oracle regime (excess removed / floor signed or deleted), Theorem Q bound checked, ~2 s
.venv-arb/bin/python tmp/rha-density-profile-thmQ-bigfloor.py tmp/rha-density-profile-thmQ-bigfloor.json  # MODEL: oracle floors beyond Re s = 2/3 (Remark Q4), ~2 s
.venv-arb/bin/python tmp/rha-density-profile-scalar-channel.py tmp/rha-density-profile-scalar-channel.json  # MODEL: Remark M2 approximant length nu_min, ~60 s
```

Logs: `tmp/rha-density-profile-{exact,map,paper-saving,paper-epsB,ladder,crosscheck,slack,referee,thmQ,thmQ-bigfloor,scalar-channel}.log` and the
matching `.json`. The revision-2 re-runs of the revision-1 scripts are in `tmp/rha-density-profile-rerun/`. One process
at a time, < 200 MB. Nothing committed, nothing sent off the machine.

### 6.2 Exact checks (all PASS)

Revision 1 (`exact.py`): X1 bin requirement and bulk; X2 DH identity σ_bin(DH) = σ_bulk − bδ/2 at general geometry; X3
E(δ = 0, R = 1) = C0 in both endpoints; X4 exact LP floor 13/15 with unique minimiser; X5 triple coincidence; X6 pencil
pivot and slopes; X7 DH tuning and the 13/15 criterion; X8 the paper ceiling is the pivot; X9 167/192; X10 XS pivot and
PR #14's closed form; X11 (H_θ) dictionary; X12 both endpoints ≡ δ(x − 1/2)/5 on DH at (0, 1/5) and floor-bin dominance;
X13 the pivot condition with a slack low side.

Revision 2 (`referee.py`, code independent of revision 1): RF1 general-contour exponent from the proof of Lemma 10.4,
reducing to (10.15); RF2 paper anchors ((20.4) second line with C0 = −1/48, (20.5) = −7/1200, (20.6) = −79/800,
σ_low = 7/8 at (17/48, 1/8, 1/6)); RF3 optimality of the paper's w-contour, slope 1 in Re s; RF4 the dual certificate
and its family λ ∈ [4/5, 1]; RF5 the bulk identity (floor 2/3); RF6 the Theorem Q identity; RF7 the near-line slope c*;
RF8 the pencil and the A(σ) form; RF9 the XS bulk and gate; RF10 the contour-price bookkeeping; RF11 four independent
scipy LPs (13/15 with and without the zero-loss constraint, bulk 2/3, low side 5/6, dual weights 4/5 and 1/5); RF12
sharpness of Theorem Q (closed form B(s)); RF13 the scalar common contour at Re s = 1 (≥ 85/96, Remark M2).

### 6.3 Revision-2 referee record

The revision-2 agent had not seen revision 1 before this pass and acted as its referee. Same model family; this is a
second same-model check, not an independent external referee.

* **Re-runs.** All seven revision-1 scripts re-run; logs identical (`exact`: 13/13 PASS; `map`, `crosscheck`, `slack`,
  `paper-saving`, `paper-epsB`, `ladder`: identical apart from the runner's EXIT line).
* **READ lines re-checked against `paper.txt`:** 381–403 (Prop 2.1; constants may depend on η), 2699–2714 (ξ), 3430,
  3434–3436 (reciprocal bound U^{ε₁} right of a + 6e), 3438–3440 (bins; reflected bound U^{a−1/2+12e}), 3483 (floor bin
  by trivial count), 4387–4396 ((10.5) and W), 4650, 4663 (≤ C(1 + log Z)^D sets), 4669 ((10.13)), 4716–4737 (proof of
  Lemma 10.4: triangle inequality over the original row sum at 4723, reciprocal at 4725–4726, outside factor and C(σ₀)),
  9364 and 9379 (Lemma 18.1: 3/4 ≤ κ ≤ 1; hypothesis β* ≤ (1 + κ)/2), 9558–9603 (its use), 11476–11495 (Lemma 20.1),
  11549 (count multiplication), 11567–11571 (floor bin (20.5)), 11820 (Prop 20.3). All accurate.
* **Lemma 10.4 reading (confirmed).** Revision 1 says that rows enter Lemma 10.4 "through (10.13), a bound on the sum of
  absolute values over each pointwise set". The display (10.13) has no absolute values, so this was checked against the
  proof (l. 4716–4737): the triangle inequality is applied "to the original row sum" (l. 4723), and the reciprocal
  1/L^S(s, ηχ•(u)), which is not part of (10.13), is bounded pointwise by U^{ε_d} (l. 4725–4726). Pulling a
  row-dependent factor out of a set sum is possible only after absolute values have been taken row by row, so (10.13)
  is used as a bound on absolute sums, and Lemma 20.1 verifies it by count times pointwise size (l. 11549). Revision 1's
  reading is correct. Consequence for this revision: a signed floor is not a different verification of (10.13) but a
  modification of Lemma 10.4 itself, which is how Step 6′ is now stated.
* **Corrections.**
  * C1 (scope of X4). The 13/15 floor needs only M + ℓ ≤ 1 and b ≥ 0 (RF4) and survives removal of the zero-loss
    excess. A strengthening, not an error.
  * C2 (§4 item 2 of revision 1). The signed bulk was left HEURISTIC ("returns a scalar channel of round-1 type"). It is
    replaced by Lemma M and Remark M2 (bookkeeping EXACT, conclusion ARGUED) and by Theorem Q.
  * C3 (Step 5 READ claim). Revision 1 said the hypothesis is used "in exactly one place". The text supports the use at
    l. 9558–9603; the rest of §18 was not searched line by line, and the claim is now stated that way.
* **Result of the pass.** No error found that changes a number or the conclusion. All revision-1 values reproduce.

### 6.4 Self-referee items kept from revision 1 (same agent)

1. *Is the pigeonhole legitimate?* Yes: Lemma 10.4 allows at most C(1 + log Z)^D pointwise sets (l. 4663); the true count
   of one of them is U^{1−o(1)}, and any valid upper bound is at least that.
2. *Could a profile shrink the bulk count?* No: the bulk set is large because most rows are well behaved; better
   profiles make it larger, not smaller.
3. *Is monotonicity of σ_bin in δ, q, R valid on all of 𝒢?* Coefficients (1 − l_y)/2 + h/2, ℓ, h are positive for
   l_y < 1, ℓ ≥ 0, h > 0 (X1).
4. *Does Theorem P depend on M + ℓ = 1?* No: RF4 needs only M + ℓ ≤ 1; the cross-check C1 also allows the low-side
   excesses outside the zero-loss range.
5. *Is the floor 1/2 legitimate?* For external counts the floor 51/100 only marks the trivially counted bin; lowering it
   can only lower B, and Theorem P holds for every floor ≥ 1/2.
6. *Does Lemma 10.4's restriction σ₀ ≥ 7/8 invalidate the use below 7/8?* It restricts the method further, so it can only
   raise the floor; the exponent itself is affine bookkeeping in σ₀ (l. 4735).
7. *Is idempotence an artefact of grid resolution?* The deleted bins (δ > 2B − 1 ≥ 0.733) have slack ≥ 1.5·10⁻² at
   every computed optimum (S1); Theorem SP is a statement about slack constraints of an LP.
8. *Is the XS small-δ gate a count gate?* Unknown without the source; both readings are reported (§1, §3.7).
9. *Is Step 6 unfairly dismissed?* Its first failure is a READ gap (uniformity); by Corollary Q2 it is blind at
   Re s ≤ 2/3, which is where Theorem Q needs it, so it is irrelevant for passing 13/15 even if repaired. Its value as a
   source of density estimates for σ ∈ (2/3, 1) is not assessed.
10. *Does any part of Part II use cancellation between rows?* No. Rows enter Lemma 10.4 through the triangle inequality
    on the original row sum and (10.13), used as a bound on the absolute sum over each pointwise set (l. 4655–4672,
    4723–4726); Lemma 20.1 verifies it by count times pointwise size (l. 11549); the moments of §§17–18 and the sextic
    large sieve bound the number of rows with large witnesses (Prop 19.2), not the signed row sum. The bulk loss is
    therefore a feature of the architecture, not of the count estimates. (Re-checked in revision 2, §6.3.)

### 6.5 Referee status

No argument survives, so nothing reaches the fresh-referee gate for a claimed result. The revision-1 results were
checked by the revision-2 agent (§6.3). The revision-2 results (the certificate of Theorem P, Corollary D3, Theorem Q,
Proposition Q3, Remark Q4, Corollary Q2, Lemma M, Remark M2) are checked only by their author, through the exact and
model scripts. Items for an independent referee: Lemma P1 and Theorem P with the READ lines 4663, 4723–4726, 11549,
3440; Theorem Q and Corollary Q2 (including whether every nonempty near-line bin is verified by counts in Lemma 20.1, and
the induction step for Step 6); Lemma M items 2 and 4 and Remark M2 (the size of the approximant error and the absence
of family averages for N > U), which are ARGUED, not proved.

### 6.6 Limits

All closing values rest on the exponent model of Lemmas 10.4/20.1 and Prop 15.3′ at general geometry (as in [R1] and
[HS]); Part II's lemmas are not re-proved below 7/8. XS values rest on the PR #14 encoding, and XS's analytic inputs are
unverified; the κ-range below 29991/40000 is outside what PR #14 admits. Steps 5, 6 and 6′ are written as arguments, not
proofs. Theorems P and Q are statements about this architecture (Prop 2.1 with Lemma 10.4 as stated, Lemma 20.1's counts
on the non-floor bins, and Prop 15.3′'s low side; Theorem Q also allows Lemma 10.4 to be modified on the floor set), not
about the truth of any density or zero-free statement below 13/15. The oracle-regime numbers of Proposition Q3 use only the structural constraints (low side, bins, floor); the
other gates of the paper system (d ≤ 1/2 range, small rows, slot supply) are not included there and can only raise B.
