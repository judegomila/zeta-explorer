# High-side row counts at the binding bin: the 7/8 paper system and the Xu–Sang system

Campaign note, 2026-11-01, revision 2. Lever: sharper high-side row counts at the binding row bin of the endpoint
certificate (Lemma 20.2 of the 7/8 paper), used together with the zero-loss range 2M ≥ 1 + 3ℓ. Internal working note.
Not refereed, nothing committed.

## Revision note: the route atlas was read first

Revision 1 of this note (12:59 the same day) was written without the user's route atlas (PR #27). It did not cite the
atlas, PR #14 or Xu–Sang. Revision 2 was written after reading, in this order:

* all ten atlas snapshots, `/tmp/atlas-snap-*.md`: `historical-routes`, `PUBLICATION_SCOPE_2026-10-30`,
  `arithmetic-foundation`, `spectral-head-theory`, `signed-complement`, `whole-even-certificate`,
  `spectral-denominator-repair`, `suzuki-recurrence`, `prime-memory`, `finite-suzuki-certificate`;
* the PR #14 package `refs/pr/14:rigorous/mobius_bridge_reduction/`: README, the six-page report PDF,
  `certify_parameters.py`, `parameter_certificate.json`, `target_obstruction.json`, `TARGET_0874.md`, `target_0874.py`
  and `SIGNED_PHASE_FILTER.md`;
* the V7 Landau section `refs/pr/27:research/rh/foundation/source/03-landau.tex`.

What changed as a result:

1. **Revision 1's ceiling is scoped.** Its "exact ceiling" 0.874957 is the ceiling of the 7/8 paper's own inequalities.
   Atlas §10 records PR #14, which certifies B = 0.87488665 in a different high-side system (Xu–Sang v2, imported and
   unverified). That value lies below 0.874957. Revision 1's results are kept, scoped to the paper system (Part I).
2. **The binding bin depends on the system.** In the Xu–Sang system the binding bin is at δ\* = 0.46934, which means
   row zeros at Re s = 0.7347 > 7/10, not at δ\* = 0.389. Revision 1's Proposition G ("Guth–Maynard-type estimates give
   exactly zero gain") holds in the paper system and fails in the Xu–Sang system. Part II replaces it by a
   quantitative bound.
3. **New results.** Part II adds:
   * an exact closed form of the Xu–Sang ceiling and a sharp obstruction;
   * the locking configuration at the new binding bin;
   * the Guth–Maynard-range envelope and a family-GM pricing;
   * the (H) re-tune, the κ bootstrap and the per-bin hybrid;
   * two exact certificates.
4. **The V7 floor.** The floor reduction of atlas §10 is an equivalent reformulation for the box direction, not a
   separate lever (§18).

Every overlap with the atlas is listed with its section in §2.

**Sources.**

* The 7/8 manuscript `~/lean-deps/qrh-verify/paper.txt` (openai/math family 003). Line numbers refer to this file.
* The 11/12 manuscript `~/lean-deps/qrh-verify/paper2.txt` and the Lean library `~/lean-deps/qrh-verify/lean`.
* Prior analysis: `src/data/beat-seven-eighths-2026-10-08.js`, `src/data/beat78-prop152-2026-10-09.js`,
  `formalization/paper/beat78-*.md` and `formalization/paper/qrh-improvement-attempt-{a,b}.md`.
* PR #14 (`refs/pr/14`, commit 05cfffbbd) and the atlas (PR #27, `refs/pr/27`).
* Xu–Sang, *Amplified moments and a refinement of the quasi-Riemann hypothesis*, arXiv:2610.15291v2.
  * The source text is **not on this machine** and was not consulted, since this campaign sends nothing off the machine.
  * Every Xu–Sang statement below is the endpoint formula, gates and κ-range exactly as PR #14 imported them from eqs.
    (10), (21), (28), Sec. 6.2 and Lemma 8.1.

The 7/8 and 11/12 manuscripts are Lean-formalised by their authors and unrefereed. The 7/8 theorem is taken as
correct throughout.

## 0. Outcome

**No rigorous gain.** 7/8 remains the unconditional abscissa. PT Λ ≤ 0.2 stands, RH is open, and no QED is claimed.

Two high-side inequality systems are on record. Both share the low side σ₀ = B = 11/12 − ℓ/4 on M + ℓ = 1 and the range
ℓ ≤ 1/5 (that is, 2M ≥ 1 + 3ℓ).

| system | status of inputs | re-tune ceiling | binding bin | count there |
|---|---|---|---|---|
| 7/8 paper, (20.4) + Lemma 20.2 | proved in the paper; the lemmas are not all re-verified at the new geometry (§9.3) | (1507 − 2√921)/1653 = 0.874957070 | δ\* = 0.388584, a\* = 0.694292 < 7/10 | 2/3 |
| Xu–Sang v2, as imported by PR #14 (atlas §10) | imported analytic inputs, unverified here and in PR #14 | 0.8748866496166 at κ = 29991/40000 | δ\* = 0.469345, a\* = 0.734672 > 7/10 | 0.590332 |

New results, all in the Xu–Sang system and all conditional on its imported inputs:

1. **Exact ceiling (Prop E′, §11).** The ceiling is B\*(κ) = 11/12 − ℓ\*/4, where
   * ℓ\* = (5 − 6δ\*)/(9 + 6δ\*(1 + c)) and c = 1/(3κ);
   * δ\* is the root in (0, 5/6) of (216 − 18c²)δ² + (30c² + 108c − 504)δ + 200 − 80c.

   Values:
   * at κ = 3/4, B\* = 49619/53814 − √715621/17938 = 0.874886989358;
   * at the source minimum κ = 29991/40000, B\* = 0.874886649616631.

   PR #14 reported this second value only as an exploratory float. Within the imported system every B < B\*(κ) is
   infeasible, because at the single bin (δ\*, 1/2) the endpoint does not depend on b; this sharpens PR #14's
   "B ≤ 0.8748 infeasible". An exact certificate passes at B = 0.8748866497 (§17 A). The ceiling is therefore pinned to
   [B\*, B\* + 8.3·10⁻¹¹]. PR #14's certified 0.87488665 is 3.8·10⁻¹⁰ above B\*.
2. **Why the binding bin moves (§10).** The count enters the Xu–Sang endpoint with weight 3h/4 instead of h (exact
   identity). The count at which b drops out ("b-neutral") falls from 2/3 to 5/9 + δxc/3. The binding bin moves from
   0.389 to 0.469, into the range a > 7/10.
3. **Locking (§12).** At (δ\*, 1/2) the count 0.590332 is fixed by two configurations:
   * A = (r, m) = (0.745700, 0.418254) at t\* = 1.163954;
   * B_t = (t ≥ t\*, 0), the long amplified inverse witness.

   No recombination of the paper's certificates lowers it (Prop O′, checked to 1.6·10⁻⁶).
4. **The Guth–Maynard range is live but small (§13–14).**
   * No count improvement confined to a ≥ 7/10 can push B below 0.8742841 (envelope, LP). That is at most 6.0·10⁻⁴
     below the ceiling and 7.2·10⁻⁴ below 7/8.
   * A family Guth–Maynard-type large-values estimate (H-GM_fam) would lower the binding count from 0.5903 to 0.5649
     and give B ≈ 0.87441 [HEUR]. It is unproved, and to the author's recollection no version is known for this family.
   * The long witness of configuration B_t has length t > 1, beyond the family size. Guth–Maynard is weaker than p⁶
     amplification there, and that witness keeps the count above the density hypothesis.
5. **The gate cap (§13).** Even perfect counts in every adaptive bin cannot push B below 0.8734878. The Xu–Sang
   capacity gate ℓ/h < 1/(6κ) and the small-δ gate bind. No row-count improvement in this system passes 0.87349.
6. **(H) as a count saving (§15).** PR #14's open hypothesis (H) (atlas §10: restricted fourth moment U^{39/40+ε}) is the
   same as a uniform count saving of 1/120 on δ ≥ 1/8. Re-tuned, it reaches B = 0.87382, with an exact certificate
   conditional on (H) and Xu–Sang (§17 B). PR #14 stated 0.874.
7. **Zero-gain items (§16).**
   * The per-bin hybrid min(E_paper, E_XS) gives no gain.
   * The κ bootstrap κ → 2B − 1 converges to 0.874886647040. That is 3.0·10⁻⁹ below PR #14's certified value, and it
     needs the source's κ-range extended below 29991/40000.

**Λ.** No conditional Λ changes and none of the numbers below is a bound. At the stated rate (0.003 of Λ per 0.01 of
θ):

| scenario | θ gain | Λ gain |
|---|---|---|
| Xu–Sang ceiling vs 7/8 (conditional on Xu–Sang) | 1.13·10⁻⁴ | 3.4·10⁻⁵ |
| GM-range envelope | 7.2·10⁻⁴ | 2.1·10⁻⁴ |
| H-GM_fam | 5.9·10⁻⁴ | 1.8·10⁻⁴ |
| (H) re-tuned | 1.18·10⁻³ | 3.5·10⁻⁴ |
| Xu–Sang gate cap | 1.51·10⁻³ | 4.5·10⁻⁴ |

**Answer for the lever.** In neither system can the binding bin be moved with known estimates. The largest count lever
on record, an improvement confined to the Guth–Maynard range in the Xu–Sang system, is worth at most 6.0·10⁻⁴ in θ.
It would rest on two inputs that are not established: the imported Xu–Sang analysis and a new family large-values
estimate.

## 1. Status labels

| label | meaning |
|---|---|
| **[EXACT]** | exact rational or sympy algebraic computation within the stated inequality system |
| **[P-rel]** | proved here relative to lemmas of the 7/8 paper as stated, with line references |
| **[IMP]** | relative to the Xu–Sang endpoint, gates and κ-range as imported by PR #14; the source is not verified here |
| **[RECALLED]** | a literature fact recalled, not re-checked; no external sources were consulted |
| **[NUM]** | floating-point scan or LP on a fine grid; accuracy stated |
| **[HEUR]** | a hypothetical input priced in the model; nothing about it is proved |

## 2. Overlaps with the route atlas (PR #27)

| atlas | what it records | overlap with this lever | what is different here |
|---|---|---|---|
| §10, PR #14 | B = 17497733/20000000 = 0.87488665, conditional on Xu–Sang v2. Exact gates; "B ≤ 0.8748 infeasible in the source's system"; float optimum "near 0.8748866496166" ("not an optimality theorem") | Same target. Same low side (B = 11/12 − ℓ/4, ℓ < 1/5, the range 2M ≥ 1 + 3ℓ of revision 1 §2). Same count formula R_κ (Prop 19.2 with 6κ in place of 9/2) | Closed form of the ceiling; a sharp single-bin obstruction at B\*(κ); a certificate within 8.3·10⁻¹¹ of B\*; the binding-bin location relative to 7/10; Guth–Maynard pricing; locking (§11–14) |
| §10, `TARGET_0874` | B = 0.874 needs an unproved restricted fourth moment U^{39/40+ε}, the hypothesis (H). The existing count plus the fourth moment cannot supply it (a saturation example) | (H) is a moment lever, not a count. Its exponent effect equals a uniform count saving ε = 4η/3 | (H) is not re-attempted. Re-tuning at the same (H) gives 0.87382 (§15, §17 B). The saturation example is the moment analogue of the count locking of §12 |
| §10, signed phase filter | The sixth-phase filter equals 1 on the principal phase. The sixth-power-residue subspace keeps eigenvalue one | None for the high side. It reaches the same structural fact as the duality S5 of 2026-10-09: a filter that keeps the principal response must keep every sixth-power class, and the exceptional coset of Prop 15.2 is the ξ⁶ = 1 class that carries the signal | Not re-attempted. The low side (P_a^{1/6}) is untouched by this lever |
| §10, Möbius energy and the V7 floor | ∫_j^{j+1}\|S\|² ≤ Ce^{0.7496j} would give B = 0.8748 (open). A floor ε₀(λ) ≥ −C(1 + log λ)^m λ^p gives Re s > (1 + p)/2 | Same target B | The pair-correlation estimate is not attempted. Prop V (§18) shows that the floor exponent of the box direction is equivalent to the zero-free abscissa, so it is not a separate lever |
| §9 | Fixed-support positivity needs actual signed lower bounds; negative surrogates are not negative actual forms | No direct overlap | The same discipline is applied here. Every ceiling below is a ceiling of an inequality system. It says nothing about the location of zeros |
| §11 | A uniform strictly positive scalar margin is the wrong target for RH | None | The margins here are fixed exponent margins at a fixed θ′ > 1/2, where they are legitimate. The §11 caution concerns θ = 1/2 |
| closing line | The open task is an all-scale signed arithmetic estimate, a cofinal actual-form floor, or an exhaustive theta certificate | The count lever reduces to an all-scale arithmetic estimate: H-GM_fam (§14) or (H) (§15) | No finite computation here replaces such an estimate |
| §2–§8 | twin ladder, information, synchronisation, vortices, theta boxes, discrete rigidity, twistor/Hankel | none | — |

---

# Part I. The 7/8 paper system (revision 1 results, scoped)

## 3. The low side at general geometry: the zero-loss range 2M ≥ 1 + 3ℓ  [P-rel]

Notation (Definition 10.1, (12.4), (15.1)):

* X = Z^{l_x} and Y = Z^{l_y}, with M = l_x + l_y and b = l_y − l_x;
* ℓ is the total slot length, and h = 1 − l_x + ℓ;
* for a rescaled subset J of slots of total length d, put M′ = M − 2d and ℓ′ = ℓ − d.

**3.1 Lemma 15.1 at general geometry.** The proof (lines 6200–6290) produces two bounds for each dyad.

* First branch (s_hyb = z_a): E_ref ≤ M′ − O/2 − ΔH + o(1).
* Second branch: E_ref ≤ M′ + (1 + 3ℓ′ − 2M′ − 2ΔH + θ_N)/4 + o(1). This follows from (15.3) and z_a ≤ ℓ′.

Substituting ℓ′ = ℓ − d and M′ = M − 2d gives 1 + 3ℓ′ − 2M′ = 1 + 3ℓ − 2M + d. The paper writes the loss as
((d − 1/6)/4)₊, which is this expression at ℓ = 1/6, M = 5/6.

The geometry enters beyond these two displays in only one place: the step T_d − (H − 3d) ≤ 2ε_Z + |θ_N|. That step
uses M′ + ℓ′ − 1 = −3d, that is, M + ℓ = 1.

* When M + ℓ < 1 the dual is only shorter.
* When M + ℓ > 1 the reflected dual diagonal (the column branch) costs M′ + ℓ′ − 1; see the LP in
  `beat78-meansquare.md` §4.1.

Hence, for M + ℓ ≤ 1, Σ |B^J_{m,σ}(Z)|² ≪ Z^{M′ + λ(d) + ε} with λ(d) = ((1 + 3ℓ − 2M + d)/4)₊.

**3.2 Prop 15.3 at general geometry.** The proof (lines 6457–6515) bounds the J-summand by a product of two factors.

* There are Z^{d+ε} rescaled tuples, each with coefficient O(Z^{−3d/2}).
* Cauchy–Schwarz with Prop 15.2 gives (X′)^{1/2}P_a^{1/12}Z^{λ(d)/2}, where (X′)^{1/2} ≍ X^{1/2}Z^{−d/2}. The factor
  P_a does not depend on d.

The exponent relative to X^{1/2}P_a^{1/12} is therefore f(d) = −d + λ(d)/2. From this:

* if 2M ≥ 1 + 3ℓ, then f(d) ≤ −7d/8 ≤ 0 on [0, ℓ];
* if 2M < 1 + 3ℓ, the term J = ∅ (d = 0) loses (1 + 3ℓ − 2M)/8 > 0.

So the zero-loss range is exactly 2M ≥ 1 + 3ℓ. The other length conditions at general geometry are
b > 0, l_x − ℓ > 0, l_y − ℓ − 11b/6 > 0 and M − 2ℓ > 0.

**Proposition 15.3′ [P-rel: Lemma 14.3, Prop 15.2 and the proof of Lemma 15.1, as stated].** Suppose 2M ≥ 1 + 3ℓ,
M + ℓ ≤ 1 and the length conditions above hold. Then |I_{η,modified}(Z)| ≪ Z^{l_x/2 + b/12 + ε}, and the low side
gives σ₀ ≥ σ_low = 1 − h/6 + b/12 = 5/6 + M/12 − ℓ/6. On M + ℓ = 1 this is 11/12 − ℓ/4, valid for ℓ ≤ 1/5.

The Xu–Sang system as imported by PR #14 uses the same low side: B = 11/12 − ℓ/4 with the gate ℓ < 1/5.

## 4. The high side of the paper at general geometry

**4.1 Exponent.** Lemma 10.4, (10.15), gives, for a bin (δ, x) with count exponent R,

  E(d) = a − σ₀ + h(z₀ − 1/6) − a·l_y − ℓ/2 + xδℓ + d(R + δ/2 − z₀),  with a = (1 + δ)/2 and z₀ = 17/50.

The slope in d is positive, so d = h binds. On M + ℓ = 1 with σ₀ = 11/12 − ℓ/4 this becomes, exactly,

  **E_paper = C0 + δ/2 + δℓ + δxℓ − h(1 − R)**,  C0 = −1/4 + b/6 + 5ℓ/4,  h = (1 + b + 3ℓ)/2.

At the paper geometry this is the second line of (20.4), with C0 = −1/48.

The other requirements are:

* the floor bin (20.5);
* the endpoint δ = α (20.7);
* the range d ≤ 1/2 (20.11);
* small rows (20.6);
* the supply ℓ/h > 7/37.

**4.2 Validation [EXACT].** `tmp/zf-high-side-model.py` passes 15/15 checks. They reproduce every number printed in
Sections 15 and 20, including the identity (20.9) at 561 points and min(−E\*) = 35√16354/12696 − 1491/4232.

## 5. The row count R\*: structure, optimality, locking

**5.1 Origin of the count.** Prop 8.3 gives, for each detector parameter t ∈ [1, 3/2], an inverse witness M_r and a
plain witness S_m with

  r ≤ t,  r + m ≥ t,  0 ≤ m ≤ 1/2,  |M_r|² ≥ U^{δr},  |S_m|² ≥ U^{δm}.

The slot amplitude is q = xδ.

| | source | count exponent |
|---|---|---|
| C1 | Lemma 17.1 + selected slots | 1 − δr − 2xδ·min(z_M(r), S), with z_M = min((1 − r)/2, (3 − 2r)/8) |
| C2 | Lemma 17.6 | e(r) − δr, with e(r) = max(1, (1 + 5r)/6) |
| C3 | Lemma 18.1, two plain copies + slots | 1 − 2δm − 2xδ·min((1 − 2m)/(6κ), S) |
| C3′ | Lemma 18.1, one copy + slots | 1 − δm − 2xδ·min((1 − m)/(6κ), S) |
| C4 | sextic large sieve on M_r^k or S_m^k | 1 − kδr or 1 − kδm, for k·length ≤ 1/2 |

Here S is the slot supply. Prop 19.2 and (20.8) give

  R\*(δ, x) = 1 − δ + (α − δ)δP_x/(2J),  J = (α − δ)D_x + δP_x,  α = 5/6.

This is min over t of max(R_short(t), L(t)), where L(t) = 1 − α + (α − δ)t is C2 at r = t (lines 11125–11330).

**5.2 Ingham identity [EXACT].** R\*(δ, 0) = 1 − 2αδ/(3α − δ). At α = 1 this is Ingham's 3(1 − σ)/(2 − σ) written in
δ = 2σ − 1.

**5.3 Proposition O (optimality of R\* among the paper's certificates) [P-rel; brute-force NUM].** No strategy using
C1–C4 at any finite set of detector parameters certifies a count below R\*(δ, x).

*Proof.* The argument partitions the rows by witness lengths and has no link between witnesses produced at different
t. Its value is therefore min over t of the maximum, over admissible (r, m), of the best certificate. For t ≤ t\*,
the crossing configuration (r\*(t), t − r\*(t)) holds every certificate at or above R_short(t) ≥ R\*. For t ≥ t\*,
the configuration (t, 0) holds every certificate at or above L(t) ≥ R\*. ∎

The minimax was recomputed in revision 2 with the adversary also allowed m > t − r, which matters only for
non-monotone certificates (`zf-high-side-xs-levers.py`). It reproduces R_κ to 1.6·10⁻⁶ at 15 bins, for κ = 29991/40000
as well as 3/4 (§12).

**5.4 Proposition L (locking at the paper's binding bin) [EXACT].** At (δ\*, 1/2) with δ\* = (49 − √921)/48:

| quantity | value |
|---|---|
| t\* | 1.124228 |
| r\* | 0.715632 |
| m\* | 0.408596 |
| z_M | 0.142184 |
| z_P | 0.040624 |
| supply | 0.205476 |

Configuration A = (r\*, m\*) holds:

* C1 = C3 = 2/3;
* C2 = 0.7219;
* C3′ = 0.7902;
* the conjectural optimal sextic large sieve on M_r·S_m gives t\*(1 − δ\*) = 0.6874;
* the conjectural sixth moment of S_m is unavailable, since m\* > 1/3.

Configuration B_t = (t ≥ t\*, 0) holds L(t) ≥ 2/3. So the count stays at 2/3 under all of these
(`tmp/zf-high-side-locking.py`).

## 6. Proposition E: the paper-system ceiling  [EXACT]

On M + ℓ = 1 the x = 1/2 margin is m(δ) = 1/4 − 5ℓ/4 − b/6 + δb/2 − h·(R\*(δ, 1/2) − (1 − δ)). The optimum
is found as follows.

* Stationarity in b gives R\* = 2/3, that is, 288δ² − 588δ + 185 = 0, so δ\* = (49 − √921)/48.
* Stationarity in δ fixes b.
* m = 0 gives ℓ\* = (5 − 6δ\*)/(9 + 18δ\*) = 11/551 + 8√921/1653.

Result:

  **σ₀\* = 11/12 − ℓ\*/4 = (1507 − 2√921)/1653 = 0.874957069799169**,

with b\* = 0.123405437 and h\* = 0.811960. The global scan returns the same value; the LP of revision 2 returns
0.8749570686. Under the paper's own range 2M ≥ 1 + 4ℓ it returns exactly 7/8.

## 7. Proposition G (paper system): improvements above 7/10 give zero gain  [EXACT]

For a bin with count R, G = E(h) + σ₀ is affine in the geometry. At (δ\*, 1/2) the count is 2/3, so G does not depend
on b. The linear programme max(5/6 + M/12 − ℓ/6, G(δ\*, 1/2)) → min over M + ℓ ≤ 1 has value exactly σ₀\*. The KKT
multipliers are (0.8124, 0.1876) and 0.0625.

Since δ\* = 0.3886 < 2/5, every count improvement acting only where σ_eff > 7/10 leaves σ₀\* unchanged. This covers
family versions of Huxley, Guth–Maynard and Bourgain [thresholds RECALLED].

Revision 2 cross-check (LP): deleting, or setting to DH, every bin with δ ≥ 0.4 returns 0.8749570686, unchanged.

**Scope.** This proposition concerns the paper's endpoint (20.4) only. It fails for the Xu–Sang endpoint (§13).

## 8. Lever pricing in the paper system  [HEUR, revision 1]

The prior notes were computed with mode "+ah" (the adaptive count also used for d ≤ 1/2) and re-optimised geometry.
Accuracy is about 10⁻⁶.

| hypothetical input | σ₀ | gain |
|---|---|---|
| none (paper counts) | 0.8749571 (exact) | 4.3·10⁻⁵ |
| Lemma 17.1 inverse capacity (3/4)(1 − r) or 1 − r (supply-capped) | 0.873183 | 1.8·10⁻³ |
| Lemma 18.1 plain capacity (1 − 2m)/2 | 0.874177 | 8.2·10⁻⁴ |
| α = 1/2 in Lemma 17.6 | 0.872227 | 2.77·10⁻³ |
| sixth moment of S_m; optimal sextic large sieve on M_r·S_m | 0.8749571 | 0 (Prop L) |
| all moment levers together | 0.870209 | 4.79·10⁻³ |
| density-hypothesis counts in every adaptive bin | 167/192 | 5.21·10⁻³ (the floor bin binds) |

Bin-deletion envelope (all bins with δ ≥ δc removed):

| δc | 0.40 | 0.35 | 0.30 | 0.20 | ≤ 0.10 |
|---|---|---|---|---|---|
| σ₀ | 0.874957 | 0.874492 | 0.873756 | 0.871884 | 167/192 |

## 9. Endgame certificate in the paper system (revision 1)

**9.1 Point and checks.** At σ₀ = 7/8 − 21/500000 = 0.874958, with ℓ = 62563/375000, M = 1 − ℓ and b = 617/5000, an
exact certificate passes 27/27 checks:

* Lemma 20.2-style quadratic, Sturm-certified;
* floor, (20.7), (20.11), small rows and supply;
* the length conditions of Prop 15.3′;
* the exponents of Lemma 7.1.

`tmp/zf-high-side-certificate.py` runs it.

**9.2 Status.** It covers the Section-20 inequalities only. The ledger is in §9.3.

**9.3 Ledger at σ₀ < 7/8 (paper system).**

| lemma | status |
|---|---|
| Lemma 15.1 / Prop 15.3 | re-derived at general geometry (§3) [P-rel] |
| Lemma 7.1 region (7.15) | exponents checked exactly: −2.2397 and −1.8150 (≤ −9/5); ramified exponents ≤ −0.825 |
| Lemma 10.6 small-row line | Re(s + w) > 1 + 37/100 (checked) |
| Lemmas 10.3–10.6 (stated for σ₀ ∈ [7/8, 1)) | uses of 7/8 replaced as in attempt-a P4; not re-proved line by line |
| Section 16 (−7/8 in (16.13), Lemma 16.2) | becomes −σ₀; κ_P = 7ℓ/(16K) < σ₀ℓ/K (attempt-a P6); cited, not re-proved |
| Lemmas 17.1, 17.6, 18.1 | stated with generic bounded parameters; a hidden use of the paper geometry is not excluded |
| Prop 19.2 / Prop 20.3 | supply 0.2055 > 7/37 (checked); order of choices not re-written |
| Lean | not attempted; the geometry is hard-coded (`Parameters.lean`, `ParametersHighData`) |

So the §9 certificate is an endgame certificate and not a theorem. The Xu–Sang system (Part II) reaches lower, under
a different and unverified set of inputs.

---

# Part II. The Xu–Sang system (atlas §10, PR #14)

## 10. The imported endpoint and its exact relation to (20.4)

**10.1 The imported system [IMP].** This is `endpoint` and the gates of PR #14's `certify_parameters.py`.

* Endpoint. Put c = 1/(3κ), D = 3 − (1 + 2c)x, P = (2 − 2cx)(1 − x) and J = (5/6 − δ)D + δP. Then
  R_κ = 1 − δ + (5/6 − δ)δP/(2J), and

  **E_XS = C0 + δ/2 + δx(ℓ + c(h/4 − l_y/2)) − (3h/4)(1 − R_κ)**,

  with the same C0, h and l_y = (1 + b − ℓ)/2 as in §4.
* Requirement: E_XS < −g on [0, 5/6] × [0, 1/2], and B = 11/12 − ℓ/4.
* Gates (all > 0):
  * b;
  * ℓ − 1/6 and 1/5 − ℓ;
  * l_x − ℓ and l_y − ℓ − 11b/6;
  * 6κℓ − 3/4;
  * **1/(6κ) − ℓ/h** (the capacity gate);
  * ℓ/(h + ζ) − 21/100;
  * l_y − h/2 and 1/2 − l_y;
  * g − 2ζ − g\*;
  * **small-δ**: −1/250 − max(C0, C0 + A_sm/8), where A_sm = 1/2 + (ℓ/2)(1/2 + 2ℓ/h) − h/2;
  * floor: −1/100 − (C0 + (1 + 3ℓ)/100);
  * small rows: −1/20 − (h(17/50 − 1/6) − l_y/2 + 1/50).
* κ-range: κ ∈ [29991/40000, 3/4]. The lower end is licensed by Xu–Sang's stage-0 boundary 69991/80000 = (1 + κ)/2.

R_κ is Prop 19.2's count with the plain capacity (1 − 2m)/(6κ). In the paper κ := 2β\* − 1 = 3/4 + 2Δ, with
κ ∈ (3/4, 5/6] ((12.1), line 5155; line 11068). Xu–Sang allow κ < 3/4.

**10.2 Validation [EXACT].** `tmp/zf-high-side-xs-model.py` passes 11/11 checks. It reproduces exactly:

* PR #14's integer witness polynomials A, Bp and C, the multiplier 112086563940000000000, and the discriminant 4AC − Bp²;
* all 15 scalar margins of the new stage;
* the boundary 17497733/20000000 and the stage-0 boundary 69991/80000;
* all four obstruction corners at δ = 9387/20000.

It also checks R_κ(·, ·, 3/4) against the paper's R\*, and E_paper against the validated (10.15) model.

**10.3 Identity [EXACT].** On M + ℓ = 1 with σ₀ = 11/12 − ℓ/4,

  **E_XS − E_paper = −δℓ + δxc(h/4 − l_y/2) + (h/4)(1 − R)**

(symbolic identity in b, ℓ, κ, δ, x and an arbitrary count R, `zf-high-side-xs-closedform.py`; also checked at 54
exact points in `zf-high-side-xs-model.py`).

Xu–Sang give up a quarter of the count weight and in exchange remove the δℓ term from the row-size exponent. In PR #14's
words, the numerator average is bounded by Hölder with a fourth moment, which gives the exponent (3R + 1)/4. That source
mechanism is not verified here. Two consequences:

* ∂E_XS/∂b = 1/6 − δxc/8 − (3/8)(1 − R). So the **b-neutral count is 5/9 + δxc/3**; in the paper system it is 2/3.
* Since R_κ decreases in δ, the bin at which the count meets the b-neutral value moves from δ = 0.389 to δ = 0.469.

## 11. Proposition E′: the Xu–Sang ceiling, sharp obstruction and binding bin  [EXACT, IMP]

Fix κ in the source range and put c = 1/(3κ). Let δ\* be the root in (0, 5/6) of

  q_c(δ) = (216 − 18c²)δ² + (30c² + 108c − 504)δ + (200 − 80c),

which is the condition R_κ(δ, 1/2) = 5/9 + δc/6 cleared of denominators.

**(i) The binding bin does not depend on b.** At (δ\*, 1/2), E_XS has b-coefficient 0. It equals

  E_XS(δ\*, 1/2; b, ℓ) = (3/4 + δ\*/2 + δ\*c/2)·ℓ − (5/12 − δ\*/2)

(sympy identity in `zf-high-side-xs-closedform.py`: the b-coefficient and the difference are both 0).

**(ii) Sharp obstruction.** The ℓ-coefficient is positive, so E_XS(δ\*, 1/2) > 0 whenever
ℓ > ℓ\* = (5 − 6δ\*)/(9 + 6δ\*(1 + c)), whatever b is. The imported system requires E_XS < −g at every bin of
[0, 5/6] × [0, 1/2], so every B < B\*(κ) = 11/12 − ℓ\*/4 is infeasible in that system. This
sharpens PR #14's obstruction (B ≤ 0.8748 at the test point δ = 9387/20000).

**(iii) Monotonicity in κ.** B\*(κ) is strictly increasing on the source range: it was checked at 101 points, and
dB\*/dκ = 1.5095·10⁻³ at κ = 3/4. So the ceiling over the range is B\*(29991/40000).

**(iv) Closed forms.**

| κ | δ\* | B\* |
|---|---|---|
| 3/4 | (1519 − √715621)/1434 = 0.469355752 | 49619/53814 − √715621/17938 = 0.8748869893579015 |
| 29991/40000 | (151802815309 − √7146978282893490933181)/143312533122 = 0.469344941 | 4958945540633/5378212290522 − √7146978282893490933181/1792737430174 = **0.8748866496166314** |

At κ = 29991/40000 the optimum is ℓ\* = 0.1671200682, b\* = 0.0865349232 and h\* = 0.793948. Every PR #14 gate is
positive there; the tightest non-margin gate is small-δ, at 1.8·10⁻⁴.

**(v) Feasibility from above.** The certificate of §17 A passes at B = 0.8748866497 = B\* + 8.3·10⁻¹¹. With (ii) this
pins the system's ceiling to [B\*, B\* + 8.3·10⁻¹¹]. A global float scan confirms that the maximiser is unique, at
(δ\*, 1/2) (`zf-high-side-xs-ceiling.py`).

**Binding bin.** It is δ\* = 0.4693449, which means row zeros at Re s = a\* = 0.7346725, with x = 1/2 and count
R_κ = 0.5903323. Compare δ\* = 0.3886 and a\* = 0.6943 in the paper system.

## 12. Locking at the Xu–Sang binding bin (Prop L′, O′)  [EXACT values; NUM minimax]

At (δ\*, 1/2) with κ = 29991/40000 (`tmp/zf-high-side-xs-locking.py`):

| quantity | value |
|---|---|
| t\* | 1.16395364 |
| r\* | 0.74569995 |
| m\* | 0.41825369 |
| z_M | 0.12715003 |
| z_P | 0.03634260 |
| supply ℓ\*/h\* | 0.210493 (gates: > 0.21 and < 1/(6κ) = 0.222289) |

* **Configuration A = (r\*, m\*)**, admissible for every t ∈ [1, t\*]. Certificate values:

  | certificate | value at A |
  |---|---|
  | C1 | 0.590332 |
  | C3 | 0.590332 |
  | C2 | 0.650010 |
  | C3′ | 0.743001 |
  | C4 (S¹) | 0.803695 |

* **Configuration B_t = (t, 0)** for t ≥ t\*. Only C2 = L(t) ≥ 0.590332 applies. The witness is the inverse polynomial
  of length t > 1, above the family size U, amplified by p⁶ (Lemma 17.6).

Prop O′: the minimax over C1–C4 (including m > t − r) reproduces R_κ to within 1.6·10⁻⁶ at 15 bins. So, exactly as in
the paper system, the count is locked against recombination. Lowering it needs either a better certificate for
configuration A at σ_eff = a\* = 0.7347, or a better one for long amplified witnesses (α < 5/6).

## 13. The Guth–Maynard range is live, and the envelope bounds it  [EXACT-LP model, NUM ≈ 10⁻⁹]

Both endpoints are affine in (b, ℓ) at each bin once the count is fixed. For any count model, the re-tune ceiling is
therefore a linear programme: maximise ℓ subject to E_i(b, ℓ) ≤ 0 at every bin on a 3334 × 26 grid, plus the linear
gates. The convex small-δ gate is enforced by tangent cuts (`tmp/zf-high-side-xs-levers.py`). The baseline reproduces
0.8748866487 (exact value 0.8748866496).

| count model in the Xu–Sang system | B | binding / tight |
|---|---|---|
| R_κ (baseline) | 0.8748866 | δ = 0.4694, x = 1/2 |
| bins with δ ≥ 0.50 deleted | 0.8748866 | unchanged |
| bins with δ ≥ 0.45 deleted | 0.8747314 | δ = 0.4498; capacity gate |
| **bins with δ ≥ 0.40 deleted, or DH there** (all of a ≥ 7/10) | **0.8742841** | δ = 0.3998; capacity gate ℓ/h < 1/(6κ) |
| bins with δ ≥ 0.35 deleted | 0.8737950 | δ = 0.3498; capacity gate |
| bins with δ ≥ 0.30 deleted, or every adaptive bin deleted | **0.8734878** | capacity gate + small-δ gate |
| uniform count saving ε = 0.005 (δ ≥ 1/8) | 0.8742284 | δ = 0.490; small-δ gate |
| ε = 1/120 (equivalent to (H), §15) | 0.8738174 | δ = 0.503; small-δ gate |
| ε = 0.01 | 0.8736191 | δ = 0.509; small-δ gate |
| ε ≥ 0.02 | 0.8734878 | gate cap |

Readings:

1. **Prop G fails in this system.** Improvements confined to a ≥ 7/10 do move B, by at most 6.02·10⁻⁴ (to 0.8742841).
   The binding then returns to the a = 7/10 boundary and the capacity gate.
2. **The gate cap is 0.8734878.** It holds for any counts, because the capacity gate and the small-δ gate of the
   imported system bind. The paper system's corresponding cap is the floor bin, 167/192 = 0.8698, which is lower.
3. **Paper system, same LP.** Deleting δ ≥ 0.4 changes nothing (0.8749570686), and δ ≥ 0.35 gives 0.8744916, agreeing
   with revision 1.

## 14. A family Guth–Maynard-type count  [HEUR]

**Hypothesis H-GM_fam (unproved).** Let W(u) be a witness polynomial of length N = U^n over the rows u of the family
(family size U), and suppose |W(u)|² ≥ U^S on a set of rows. Then that set has at most
U^{max(n − S, 8n/5 − 2S, 1 + 2n/5 − 2S) + ε} elements.

This is the Guth–Maynard large-values estimate (2024) with T replaced by U [RECALLED; not checked against the
2024–2026 literature]. It improves on the mean-value count 1 − S only when S > 2n/5 (σ_eff > 7/10), S > 8n/5 − 1 and
n < 1.

**What it would need.** To the author's recollection, no version is known for families of sextic Hecke characters of
ℚ(√−3) [RECALLED].
The Guth–Maynard argument rests on two inputs:

* zeta-moment control of Σ_n n^{i(t − t′)};
* the additive structure of the large-values set.

Here these would become bounds for character sums of χ_u χ̄_{u′}, which have conductor up to U², together with a
multiplicative-energy substitute.

**Model.** In C1, C3 and C3′ the polynomial is the witness times the selected slots, with lengths n = r + z, 2m + z or
m + z and spikes S = δr + 2qz, 2δm + 2qz or δm + 2qz. Its count becomes min(mean-value bound, H-GM_fam bound), with
the slot length z ∈ [0, capacity] optimised. The optimum is attained at an endpoint or at a breakpoint of the
piecewise-linear maximum. C2 (long amplified witnesses) and C4 are unchanged. GM is weaker than p⁶ amplification for
t > 1. Example at r = t\*: GM count 0.7697 against L(t\*) = 0.5903.

**At the binding bin (δ\*, 1/2):**

* C1-GM = 4/3 − 5δ\*/3 = 0.551092 (optimal length n = 5/6, inside [r\*, r\* + z_M] = [0.7457, 0.8728]);
* C3-GM = 0.553191 (n = 2m\* = 0.8365 > 5/6);
* the minimax count falls from 0.590332 to **0.564875**, removing 42.7 % of the gap to DH (0.530655);
* the new balance is at t_GM = 1.09401, where the long amplified witness still binds.

For comparison, for ζ at σ = 0.7347 [RECALLED exponents], Guth–Maynard's 15(1 − σ)/(3 + 5σ) = 0.5964 removes 33.2 % of
the Ingham-to-DH gap (Ingham 0.6291, DH 0.5307).

**System value.** On the δ ≥ 0.4 grid with x ∈ {0, 0.25, 0.35, 0.42, 0.46, 0.5}, the H-GM_fam counts give
**B ≈ 0.87441 (±10⁻⁵)**. That is 4.8·10⁻⁴ below the Xu–Sang ceiling and 80 % of the δ ≥ 0.4 envelope.

* The binding moves to δ ≈ 0.413, x = 1/2, where σ_eff barely exceeds 7/10, and the capacity gate is tight.
* Paper capacities and natural capacities (n ≤ 1) give the same value, since n = 5/6 already fits.

## 15. (H) of PR #14 as a count saving  [EXACT model; HEUR input]

In the Xu–Sang endpoint the count enters as −(3h/4)(1 − R), and the (H) saving enters as −ηh (TARGET_0874: "E_new = E −
h/160"). Hence a uniform count saving ε on δ ≥ 1/8 is the same as (H) with η = 3ε/4, so η = 1/160 corresponds to
ε = 1/120. This is not a new route: TARGET_0874's saturation example shows that the present count together with the
fourth moment cannot supply either saving.

Re-tuning the geometry at (H) gives B = 0.8738174 (§13), against PR #14's B = 0.874 at its own point. An exact
certificate at B = 0.87382 passes (§17 B). It is conditional on (H) and on Xu–Sang, and (H) is applied only on
1/8 ≤ δ ≤ 5/6, as TARGET_0874 states it. The unchanged endpoint is certified separately on 0 ≤ δ ≤ 1/8.

## 16. Two zero-gain checks

**16.1 Per-bin hybrid [NUM].** Choosing per bin the better of E_paper and E_XS (with the Xu–Sang gates) returns
0.8748866492, which is the Xu–Sang ceiling (`zf-high-side-xs-hybrid.py`).

At the Xu–Sang optimum, E_paper − E_XS takes these values along x = 1/2:

| δ | 0.1 | 0.3 | 0.389 | 0.469 | 0.55 | 0.65 | 0.75 |
|---|---|---|---|---|---|---|---|
| E_paper − E_XS | +0.00113 | +0.00197 | +0.00149 | +0.00040 | −0.00151 | −0.00543 | −0.01190 |

The paper endpoint is better only for δ ≳ 0.52, where nothing binds. Mixing the two arguments per bin, whose legitimacy
would in any case need the Xu–Sang source, gives nothing.

**16.2 κ bootstrap [EXACT within IMP].** Xu–Sang's Lemma 18.1 uses κ = 2β\* − 1 with β\* the zero-free abscissa for the
whole Hecke family. Iterating κ_{n+1} = 2B\*(κ_n) − 1 from κ = 3/4 gives:

| n | κ_n | B\*(κ_n) | step |
|---|---|---|---|
| 0 | 0.75 | 0.8748869893579 | — |
| 1 | 0.7497739787 | 0.8748866480741 | 3.41·10⁻⁷ |
| 2 | 0.7497732961 | 0.8748866470431 | 1.03·10⁻⁹ |
| 3 | 0.7497732941 | 0.8748866470400 | 3.1·10⁻¹² |

κ₁ already lies below the source minimum 29991/40000 = 0.749775, because the exact stage-0 ceiling 0.8748869894 is
below Xu–Sang's stage-0 value 69991/80000 = 0.8748875. The contraction factor is 2·dB\*/dκ = 3.02·10⁻³. The fixed
point is **κ∞ = 0.749773294080, B∞ = 0.874886647040**, which is 3.0·10⁻⁹ below PR #14's certified value. It requires the source's κ-range to extend below 29991/40000, and each stage
must be proved for the whole family. It is negligible.

## 17. Lemma-20.2-style exact certificates in the Xu–Sang system  [EXACT; conditional]

`tmp/zf-high-side-xs-certificate.py` passes 17/17 checks, including 6 negative controls. All acceptance uses `Fraction`.

**A. B = 8748866497/10¹⁰ = 0.8748866497.** This is conditional on Xu–Sang only.

| item | value |
|---|---|
| κ | 29991/40000 |
| ℓ | 1253400509/7500000000 |
| b | 8653492321/10¹¹ |
| g, ζ, g\* | 10⁻¹⁰, 10⁻¹², 5·10⁻¹¹ |

* The witness 2MJ(−E − g) = A(y)δ² + Bp(y)δ + C(y), with y = 1/2 − x, has A and 4AC − Bp² coefficientwise positive.
  Completing the square gives −E > 10⁻¹⁰ on the whole rectangle.
* The identity is checked on the exact 5 × 5 grid (bidegree ≤ (2, 3)). J > 0.
* All PR #14 gates are positive; the tightest non-margin gate is small-δ, at 1.8·10⁻⁴.
* The point is 3.0·10⁻¹⁰ below PR #14's certified value and 8.3·10⁻¹¹ above the exact ceiling.

**B. B = 43691/50000 = 0.87382.** This is conditional on Xu–Sang and on (H) with η = 1/160.

| item | value |
|---|---|
| κ | 29991/40000 |
| ℓ | 6427/37500 |
| b | 481/10000 |
| h | 78113/100000 |
| g, ζ, g\* | 10⁻⁶, 10⁻⁸, 5·10⁻⁷ |

* Exact Bernstein expansion in (δ, y) with bisection:
  * −E > g on 0 ≤ δ ≤ 1/8 (1 box, no saving used);
  * −(E − ηh) > g on 1/8 ≤ δ ≤ 5/6 (19 boxes).
* All PR #14 gates and the three TARGET_0874 gates are positive: modified slope, short-block supply with the extra
  saving, and supply comparison.

**Negative controls (each must fail, and does).**

* Bernstein rejects B = 0.8748866495 < B\*, and E_XS(δ\*, 1/2) > 0 there (exact).
* Bernstein rejects the Part B geometry without (H), and E_XS(1/2, 1/2) > 0 there (exact).
* The routine accepts 1 + δ² + y and rejects (δ − 1/3)² − 1/100 on the unit square.

Both certificates cover the endpoint system only. Their analytic content is Xu–Sang's, which is not verified here.

---

# Part III. Dictionary, obstruction, ledger

## 18. Proposition V: the V7 floor is the same target  [standard; sketch]

Let D(W) = Σ_{n<e^W} Λ(n)n^{−1/2}(W − log n) − ∫_0^W e^{r/2}(W − r)dr (V7 `03-landau.tex`). V7's Theorem gives:
D(W) ≤ C(1 + W)^m e^{αW} implies no zeros in Re s > 1/2 + α.

Conversely, the once-integrated explicit formula gives

  D(W) = −Σ_ρ e^{(ρ−1/2)W}/(ρ − 1/2)² + O(W),

with Σ_ρ |ρ − 1/2|^{−2} < ∞ [standard; the contour shift of M(q) = q^{−2}[−ζ′/ζ(q + 1/2) − 1/(q − 1/2)] is not
re-derived here]. So a zero-free half-plane Re s > 1/2 + α gives |D(W)| ≪ e^{αW} for α > 0.

For the box test vector (Q_W[e₀] = A₀₀ − 2D(W)/W), the floor exponent p = 2α and the zero-free abscissa (1 + p)/2 are
therefore equivalent. The floor route of atlas §10 cannot reach θ < 7/8 more cheaply than the half-plane itself.

Dictionary:

| abscissa | floor exponent p |
|---|---|
| 7/8 | 3/4 |
| 0.87488665 (PR #14, conditional) | 0.7497733 |
| 0.87441 (H-GM_fam) | 0.7488 |

## 19. Precise obstruction (summary)

1. **Paper system.** The binding bin is (δ\*, 1/2) = ((49 − √921)/48, 1/2), with a\* = 0.6943 < 7/10 and count 2/3.
   * The count is locked by A = (0.716, 0.409) and B_t (Prop L) and optimal among the paper's certificates (Prop O).
   * Improvements acting only above σ = 7/10 give exactly zero (Prop G).
   * The ceiling is 0.874957 (Prop E).
2. **Xu–Sang system** (atlas §10; imported and unverified). The binding bin is (0.469345, 1/2), with a\* = 0.7347 > 7/10
   and count 0.590332. The ceiling is exactly B\*(κ_min) = 0.8748866496166 (Prop E′, sharp obstruction plus
   certificate). The count is locked by A = (0.7457, 0.4183) and B_t (t ≥ 1.1640).
3. **Guth–Maynard range (Xu–Sang system).** A family large-values estimate of Guth–Maynard strength is the only count
   input that acts at that bin.
   * It is not available for this family [RECALLED].
   * Even granted, it gives B ≈ 0.87441.
   * No improvement confined to a ≥ 7/10 can go below 0.8742841. The reason is the long p⁶-amplified witness of
     length t > 1, beyond the family size, where Guth–Maynard-type bounds are weaker than amplification. That witness
     keeps every count at or above L(1) = 1 − δ.
4. **Gate cap (Xu–Sang system).** No count improvement passes 0.8734878. The capacity gate ℓ/h < 1/(6κ) and the
   small-δ gate of the imported admissibility system bind. Going further needs a change in those Xu–Sang conditions,
   which are not row counts.
5. **Moments.** (H) of PR #14 is the moment counterpart of a uniform count saving of 1/120 and reaches 0.87382 when
   re-tuned. It stays open: atlas §10 and TARGET_0874's saturation example.
6. **Low side.** Both systems share σ₀ = 11/12 − ℓ/4 with ℓ ≤ 1/5. Below 13/15 the low side and the P_a^{1/6} term of
   Prop 15.2 bind. That term is the ξ⁶ = 1 coset (duality S5); atlas §10's eigenvalue-one subspace reaches the same
   structural fact independently. It is out of reach of any row-count lever.

So the high-side row-count lever is worth at most 6.0·10⁻⁴ in θ in any recorded system, under inputs not established
here. It is not a route to a Λ improvement of practical size.

## 20. Lemma ledger for Part II

| item | status |
|---|---|
| Xu–Sang endpoint E_XS, count R_κ for κ < 3/4, gates, κ-range | [IMP] from PR #14, which imports Xu–Sang v2 eqs. (10), (21), (28), Sec. 6.2, Lemma 8.1. Source not on this machine; not re-proved; unrefereed preprint |
| Prop E′, Prop L′/O′, §13 envelopes, §16 | exact or NUM consequences of the imported system only |
| H-GM_fam | unproved hypothesis; not known for this family [RECALLED] |
| (H) | unproved hypothesis of PR #14 (atlas §10) |
| Prop V | standard explicit formula plus V7 Theorem 3.2; converse direction sketched |
| Lean | nothing in Part II is formalised |

## 21. Reproduction

All scripts are in `tmp/` and run with `.venv-arb/bin/python`. PR #14 inputs are extracted with
`git show refs/pr/14:rigorous/mobius_bridge_reduction/<file> > /tmp/zfhs-pr14/<file>`, for `parameter_certificate.json`
and `target_obstruction.json`. Each run takes under 90 s, except the GM scenarios, which take about 4 min each.

**Part I (revision 1).**

| script | result |
|---|---|
| `zf-high-side-model.py` | 15/15 |
| `zf-high-side-exact-optimum.py` | σ₀\* closed form |
| `zf-high-side-single-bin.py` | Prop G LP |
| `zf-high-side-locking.py` | Prop L |
| `zf-high-side-optimize.py`, `zf-high-side-levers.py` | §8 tables |
| `zf-high-side-product-ls.py` | C5 zero change |
| `zf-high-side-certificate.py` | 27/27 |

**Part II (revision 2).**

| script | content | result / log |
|---|---|---|
| `zf-high-side-xs-model.py` | imported endpoint, gates, witness; validation against PR #14 and against (20.4) | 11/11 |
| `zf-high-side-xs-ceiling.py` | exact ceiling at κ = 3/4 and κ_min, binding bin, gate check, bootstrap, global float check | `zf-high-side-xs-ceiling.log` |
| `zf-high-side-xs-closedform.py` | general-c quadratic, closed forms, dB\*/dκ, monotonicity on the κ-range, b-neutral identity, symbolic E_XS − E_paper identity | `zf-high-side-xs-closedform.log` |
| `zf-high-side-xs-levers.py <system> <models>` | LP ceilings for count models (`xs`, `del:`, `dh:`, `eps:`, `epsge:`, `gma`, `gmb`) in `xs` or `paper` | `zf-high-side-xs-levers-{envelopes,gm,paper}.log` |
| `zf-high-side-xs-locking.py` | witness configuration, certificate values with and without H-GM_fam, ζ comparison | `zf-high-side-xs-locking.log` |
| `zf-high-side-xs-hybrid.py` | per-bin hybrid | `zf-high-side-xs-hybrid.log` |
| `zf-high-side-xs-certificate.py` | certificates A and B plus negative controls | 17/17, `zf-high-side-xs-certificate.log` |
