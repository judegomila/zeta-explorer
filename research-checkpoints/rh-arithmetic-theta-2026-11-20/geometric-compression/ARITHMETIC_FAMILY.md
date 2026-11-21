# Arithmetic-family compression audit and proved sublemmas

Date: 20 November 2026 (America/Los_Angeles). Source inspected: `leanprover-community/riemann-hypothesis`, commit `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`.

This report supplements the previous geometric-compression audit. It contains independent mathematical derivations and bounded source inspection. No Lean compilation, kernel replay, or verification of the entire transitive dependency graph was performed. A theorem body has a stronger evidentiary status than a declaration name, but inspecting its body does not certify all its imported inputs.

## 1. What is now concrete

1. The source has explicit proofs of the two arithmetic hypotheses previously left as interfaces: `MinorIntegralityTorus.NormLB_holds` and `MinorIntegralityTorus.MinorInt_holds`.
2. The CM-type convention is exact: one embedding from each conjugate pair, with squared absolute values, gives the full absolute field norm. There is no missing factor of two in the exponent.
3. Integral mixed minors of frames in a common unimodular Hermitian lattice give the algebraic-integer labels to which multiplicative packing applies.
4. The source's zero-support decomposition in the minor-label sum is unnecessary. Its coordinate weight is exactly one at zero. Extending the product to every coordinate removes the factor `2^j`. This is proved below, with the same label assumptions.
5. The dimension window has a short independent proof once the source's exact rank formula and prime-size window are supplied. The natural constants are `1/2` and `e`; the source weakens the first to `e^{-1}` to use a symmetric window.
6. The actual Main branch also uses a different product-of-local-moduli theorem (`NormProd`) and deep local-to-global frame patching. These should not be conflated with `NormLB` or the generic S76 interface.

The remaining endpoint question is not settled by these sublemmas: the construction of the selected family, its global analytic estimates, and its eventual prime/character consequence still have to be connected with all their hypotheses. Nor has an identification of these source lattices with the user's `Q_{X,m}` or full Weil quadratic form been proved.

## 2. CM integral minors and multiplicative separation

### Proposition A: exact arithmetic source of separation

Let `E` be a CM number field of degree `2f`, let `Phi` contain one embedding from each complex-conjugate pair, and let `O_E` be its ring of integers. Let `Lambda` be an integral Hermitian `O_E`-lattice in a Hermitian `E`-space: `h(Lambda,Lambda) subset O_E`. Suppose two frames `e_1,...,e_r` and `e'_1,...,e'_r` lie in `Lambda`. For `1 <= l <= r`, put

\[
 a_l=\det\bigl(h(e'_i,e_j)\bigr)_{1\le i,j\le l}.
\]

Then every `a_l` is in `O_E`. For any two distinct integral labels `a,b` obtained in this way, or any two distinct elements of `O_E`,

\[
 \prod_{\sigma\in\Phi}|\sigma(a-b)|^2
   =|N_{E/\mathbb Q}(a-b)|\ge1,
 \qquad
 \prod_{\sigma\in\Phi}|\sigma(a-b)|\ge1. \tag{A}
\]

**Proof.** Every matrix entry is integral. The determinant is a polynomial with integer coefficients in these entries, so it is integral. The nonzero element `a-b` has a nonzero integer norm. Pairing each embedding with its conjugate proves the displayed norm identity. The final inequality follows by taking the nonnegative square root. No positivity of the Hermitian form is required for this argument. Unimodularity is sufficient to make the lattice integral, but integrality alone is the precise assumption used. QED.

**Source connection.** In `src/Formalism/SharpRestriction/CuspSpanNormBounds/MinorIntegralityTorus.lean`:

- `prod_norm_emb_eq_abs_norm` proves the all-embeddings norm identity.
- `one_le_abs_norm` uses the nonzero integer norm of an integral element.
- `prod_cm` pairs a CM type with its conjugate complement.
- `NormLB_holds` transports the source's `Tau` indexing to `D.host.cmType`, using `D.eTau` and `Formalism.BasicNotions.factEmb`, and combines those identities.
- `one_mem_zpow`, `e_mem_XS`, and `e_mem_lam` place the flag vectors in the lattice, using inverse powers of the different.
- `pair_int` derives integrality of pairings from unimodularity.
- `det_isIntegral` and `MinorInt_holds` finish the mixed-minor argument from `FrameHyp`.

The concrete, non-interface version is `minorInt_conc`, followed by `labFacts_conc`, in `src/Formalism/LocalToGlobal/SiegelLatticeTheory/CokernelGLCounts/RankPointCounts/KloostermanCosetSumLe.lean`. There, `Y.rowsOK` gives the row lattice, `t.rep` gives the second frame's membership, and both belong to the same unimodular lattice. The resulting label sequence has integral entries, vanishes above `j`, and equals one at coordinate zero.

This is a closed arithmetic ingredient at the level of the inspected theorem bodies. It is not a new proof of RH or a proof that every prospective geometric model has the required common lattice.

## 3. The packing bound and a shorter minor-label sum

### Lemma B: weighted packing in a CM type

For any finite `A subset O_E` and `R >= 1`,

\[
 \sum_{a\in A}\prod_{\sigma\in\Phi}
   \max\{1,|\sigma(a)|/R\}^{-3}
 \le (18R)^{2f}. \tag{B}
\]

More generally the same inequality holds for a finite subset of `C^f` whose distinct points satisfy product separation as in (A).

**Proof.** Assign each complex coordinate to its half-unit square using `(floor(2 Re z), floor(2 Im z))`. Two distinct points cannot have the same tuple of squares: every coordinate difference would have absolute value less than one, contradicting product separation. Set

\[
 w_R(n)=\max\{1,(n-1)/(2R)\}^{-3/2},\qquad n\ge0.
\]

For a complex coordinate `z`, its weight is bounded above by

\[
 w_R(|\lfloor2\Re z\rfloor|)
 w_R(|\lfloor2\Im z\rfloor|).
\]

Indeed `(|floor(2x)|-1)/(2R) <= |x|/R`, and

\[
 \max(1,|z|/R)^{-3}
 \le\max(1,|\Re z|/R)^{-3/2}
      \max(1,|\Im z|/R)^{-3/2}.
\]

Put `N=ceil(2R)`. The first `N+2` nonnegative integer terms contribute at most `N+2 < 2R+3`. For the tail, the elementary telescoping estimate

\[
 t^{-3/2}\le2\big((t-1)^{-1/2}-t^{-1/2}\big),\qquad t\ge2,
\]

gives a tail at most `4R`. Hence the nonnegative integer sum is at most `9R` for `R>=1`; summing over positive and negative integers gives at most `18R`. Injectivity of the cell map and the product of these one-dimensional sums give `(18R)^{2f}`. Proposition A supplies the needed separation for `A subset O_E`. QED.

**Source connection.** `WeightedLatticeSum.lean` imports only Mathlib and proves the cell and telescoping arguments. The displayed theorem `latSum` states `(64R)^{2f}`, but its proof reaches `(18R)^{2f}` immediately before its final weakening. Thus the constant 18 is already present in the source proof; no priority or novelty claim is made for that constant. `KTwoCosetCount.sum_one_coord` transports integral labels to CM embeddings and applies the stated 64-bound.

### Proposition C: no zero-support factor is needed

Let `0 <= j <= r`, and let `T` be a finite set of distinct sequences `(a_0,a_1,...)` in `O_E` such that `a_0=1` and `a_l=0` for `l>j`. Let positive real numbers `s_l` be fixed for `1<=l<=j`. Define

\[
 \Sigma_\sigma(a)=\max\left(1,
     \max_{\substack{1\le l\le j\\a_l\ne0}}
        \frac{|\sigma(a_l)|}{s_l}\right),
 \quad K(a)=\prod_{\sigma\in\Phi}\Sigma_\sigma(a),
 \quad R_l=\max(1,s_l).
\]

The maximum over an empty set contributes nothing beyond the initial one. Then

\[
 \boxed{\quad
   \sum_{a\in T}K(a)^{-3r}
       \le\prod_{l=1}^{j}(18R_l)^{2f}.
 \quad} \tag{C}
\]

The weaker bound with 64 in place of 18 uses the source's published packing interface directly.

**Proof.** For each `sigma`, every factor `max(1,|sigma(a_l)|/s_l)` is at most `Sigma_sigma(a)`, including a zero coordinate, whose factor is exactly one. Since `Sigma_sigma(a)>=1` and `j<=r`,

\[
 \Sigma_\sigma(a)^{-3r}
 \le\prod_{l=1}^{j}\max(1,|\sigma(a_l)|/s_l)^{-3}.
\]

Multiply over embeddings and interchange the finite products. Define

\[
 W_l(t)=\prod_{\sigma\in\Phi}
         \max(1,|\sigma(t)|/s_l)^{-3}.
\]

The first `j` coordinates determine the entire sequence, so the set `T` injects into the product of its coordinate projections `A_l={a_l:a in T}`. All weights are nonnegative. Consequently,

\[
 \sum_{a\in T}K(a)^{-3r}
 \le\sum_{a\in T}\prod_l W_l(a_l)
 \le\prod_l\sum_{t\in A_l}W_l(t)
 \le\prod_l(18R_l)^{2f}.
\]

The last inequality uses `s_l<=R_l`, the negative exponent, and Lemma B. This also handles `j=0`: there is at most one possible sequence. QED.

**Exact source specialization.** Take

\[
 e_l=\sum_{a=1}^l(r+1-a),\qquad
 s_l=\operatorname{rd}_E^{2e_l}(2H)^{2r},\qquad H>0.
\]

The source definitions `absReal`, `k2sg`, `k2S`, `wl`, and `Rl` then agree with the quantities used above. In particular `wl(H,l,0)=1`. The existing theorem `KTwoCosetCount.cosets_sum` and its concrete counterpart `cosets_sum_gen` divide the labels according to the nonzero-coordinate subset and bound each subset separately. Their `2^j` loss can be removed by the proof above. The algebra is valid for all the source labels because `lab_facts` / `labFacts_conc` supply exactly the required integrality, fixed coordinate zero, and zero tail. The unchanged finite-product comparison already exists as `KTwoCosetCount.sum_prod_le`.

This shortens one real arithmetic estimate. It does not by itself establish the generic main-term asymptotic, the dimension formula, or the global endpoint.

### Corollary D: explicit logarithmic cost

The frame exponents have the exact sums

\[
 e_l=\frac{l(2r+1-l)}2,
 \qquad
 \sum_{l=1}^j e_l=\frac{j(j+1)(3r+1-j)}6. \tag{D1}
\]

If `rd_E>=1` and `2H>=1`, the logarithm of the bound in (C) is exactly

\[
 2fj\log18+
 \frac{2f}{3}j(j+1)(3r+1-j)\log\operatorname{rd}_E+
 4frj\log(2H). \tag{D2}
\]

For an explicit uniform coarsening, let `b=exp(L)`, `L>1`, `m>=2`, `1<=r<=m`, `0<=j<=r`, `rd_E>=1`, `log rd_E <= L/C_l` with `C_l>0`, and `H=b^{C_H m}` for any real `C_H`. Then

\[
 \boxed{\quad
 \sum_{a\in T}K(a)^{-3r}
   \le b^{(4+4/C_l+4|C_H|)\,f m^2 r}.
 \quad} \tag{D3}
\]

**Proof.** Since `e_l<=r^2` and

\[
 R_l\le\operatorname{rd}_E^{2r^2}
                  \max(1,2H)^{2r},\qquad
 \log\max(1,2H)\le L(1+|C_H|m),
\]

the logarithm in (C) is at most

\[
 L\{6fj+(4/C_l)fjr^2+4frj(1+|C_H|m)\}.
\]

Divide the expression in braces by `f m^2 r`. Its four terms are bounded by `3/2`, `4/C_l`, `2`, and `4|C_H|`, respectively. Their sum is at most `4+4/C_l+4|C_H|`. Here `log18<3`, `m>=2`, and `j<=r<=m` have been used. QED.

For `C_l>=1`, one can replace the coefficient in (D3) by `8+4|C_H|`. The source's `cosetsC_holds` uses the looser exponent `(21+4|C_H|)^2 f m^2 r`, via `Hb(b,C,m,f)^{Cr}`. This comparison is about the numerical cost in this estimate; it does not assert that the endpoint improves by an equivalent amount. The exact cost (D2), when applicable, is preferable to either coarse constant.

## 4. The dimension window compressed to one elementary lemma

### Proposition E: prime window plus exact rank gives normalized dimension

Let `f,k` be positive integers, with `2f<=2^k`. Let `D_*>0`, `d_*>0`, `Gamma>=1`, and set

\[
 Y=\left(\frac{D_*}{d_*\Gamma^2}\right)^{1/(fk)}.
\]

Suppose `T>=2` satisfies

\[
 Y\le T\le Y\left(1+\frac1{fk}\right),\qquad
 d=d_*(T^k-1)^f.
\]

Then

\[
 \boxed{\qquad \frac12\le\frac{d\Gamma^2}{D_*}\le e.\qquad} \tag{E}
\]

**Proof.** `d_*Y^{fk}=D_*Gamma^{-2}`. For the upper bound,

\[
 (T^k-1)^f\le T^{fk}
 \le Y^{fk}(1+1/(fk))^{fk}\le eY^{fk}.
\]

For the lower bound, Bernoulli's inequality and `T^k>=2^k>=2f` give

\[
 (T^k-1)^f=T^{fk}(1-T^{-k})^f
 \ge T^{fk}(1-fT^{-k})\ge\tfrac12Y^{fk}.
\]

Multiply by `d_*Gamma^2/D_*`. QED.

**Actual source mapping.**

- `GlobalSchurBounds/TopDensityNGeSixteen.lean`: `LinkB.RankM` is the exact rank identity `duS u = duStarU D u * (T_u^k-1)^f`.
- `rank_formula_of_part_four` derives it from `StandardLattice.Conclusion4f` plus `RankHyp`: the auxiliary primes are sufficiently large and split as required, and the local `Mu0Tie` holds.
- `GlobalSchurBounds/StandardLattice.lean`: `factDuStar_fam` and `factDstar_fam` read the exact normalization identities from `Fm.ex x hx i`.
- `GlobalSchurBounds/MainSup.lean`: `proviso_e` invokes `GenusMassVolumes.mass_corollary`, using `D.T_win`, `RankM`, and those two exact identities. Its lower bound is weakened from `1/2` to `e^{-1}`.
- `chosenProviso_sup` takes `FamilyPartFour` and `RankHypF`, chooses one threshold `max(x0,Fm.x1+1)`, and obtains the window for every later `x`, every `i`, and every word `u`. Any `C0>=e` is allowed.
- The elementary numerical proof of `mass_corollary` is in `src/Formalism/GL3MeanSquares/HookFormulaTorsion/OneAddInvPowLeExpOne.lean`.

Thus the dimension window is not a consequence of the generic Gram inequality alone. It is a consequence of an arithmetic rank identity and a short prime interval, followed by this elementary argument. The source may supply those earlier inputs elsewhere, but this bounded report does not claim to have verified all their constructors or the actual Main-to-family path.

## 5. Gram normalization, ambient row count, and generic main term

The inspected normalization remains

\[
 c_u=\frac{\operatorname{volN}(u)\operatorname{volH}(u)}{\dim\Pi(u)},
 \quad T_u=c_u^{-1/2}P_u,
 \quad K_{uv}=T_u^*T_v.
\]

The source uses totalized inverse zero if a scalar vanishes; its positive-setting applications also supply positivity. This is an analytic Gram matrix of period maps, not by definition the user's Weil matrix.

The distinct-row estimate targets the natural scale `d_u d_v/D_*`; the diagonal estimate targets the identity on the actual `d_u`-dimensional column. For the correction `K^{pp}`, the four-part `AdmissibleBoundsFromSource.Conclusion1` is

\[
 K^{pp}_{uv}=0\quad(u\ne v),\quad
 \|K^{pp}_{uu}\|_{HS}^2\le d_u q,\quad q=e^{-kf\log k},
\]
\[
 \|K_{uv}-K^{pp}_{uv}\|_{HS}^2\le(1+b^{-6})d_ud_v/D_*,
 \quad
 \|K_{uu}-K^{pp}_{uu}-I\|_{HS}^2\le\Gamma d_u^2/D_*.
\]

Proposition E, or its symmetric `C0` variant, gives

\[
 \|K_{uu}-I\|_{HS}^2
 \le(2C_0/\Gamma+2q)d_u.
\]

This is the precise point at which the arithmetic dimension window supplies the diagonal part of finite-frame near-orthogonality.

### Ambient row count remains a separate estimate

`AdmissibleBoundsFromSource.adm10` is the implication from `CountTheoremHypotheses` to

\[
 |D_{\rm all}-D_*|\le e^{-crf\log r}D_*.
\]

`BridgeCountE.CountRowsClass` spells out the source of that implication: an actual automorphic row datum tied to `D`, a Hida setting, a uniform spectral gap at least `C r^{19}f^5 log(b rd_E)`, and growth inequalities `log f<=sqrt(r)` and `log log b<=c_b r f log r`. `admissibility_ten_of_rows_class` transports this row-count estimate along the exact row identifications. `countOwn_of_rowsP` then makes the family threshold uniform, provided the row data and the family count theorem have been supplied. These are genuine extra arithmetic/analytic inputs; finite Gram positivity does not prove them.

### Generic main term: a proof body, with its retained inputs

`LocalBesselAndTopKernel.Conclusion1`, then `AdmissibleBoundsFromSource.adm9`, asserts

\[
 \operatorname{genScal}(u,v)
 \le\left[1+C_A(r+1)(C_A/\Theta_A)^f\right]
      (1+e_{\rm sum}(C_e))\,f_3\,\frac{d_ud_v}{D_*}, \quad u\ne v,
\]

under the specified interlacing cuts, widths, global lattice identities, and lower bound on `Theta_A`.

`BridgeLemma.theorem_S_of_estimates` in `BruhatCellsKronecker/SmoothBigCellSectionsExist.lean` is a substantive supplier of the generic inequality, rather than a restatement. Its proof performs this chain:

1. Obtain the Bessel-coefficient realization and the absolutely summable unfolded spectral formula.
2. Obtain matching finite-place models, a global lattice, the required congruence and coprimality, and the pointwise arithmetic weight identity.
3. Bound the local density by a common `Dsup<=1+eSum(Ce0)`.
4. Dominate the spectral form by a positive row form and apply the local analytic theorem `admA` to its cut intervals.
5. Identify the product of local errors with `Dsup`.
6. Use `ConstantBoundAlt` to normalize the integral by `exp(8qS)*d_ud_v/D_*`.
7. Absorb `(1+eSum(Ce0))*exp(8qS)` into `1+eSum(Ce)` and restore the typed-prime Euler factor `f3`.

The outstanding inputs to this inspected proof body are explicit: the Bessel realization, density bound, positive row decomposition, global lattice/rank data, local analytic `admA`, and normalized mass bound. They must not be deleted when compressing the theorem.

`SchurRelationsDiscreteSeries.schur_family_of_open` supplies the family version from eventual `AmplitudeIsBesselCoefficient`, `ColumnDecomposition`, and `ParamsBound`, plus the first-filtration hypotheses. It uses concrete prime-sum absorption and `Ce>=8`. Its `SmoothBigCellSectionsExist.family_theorem_S_of_pointwise` chooses a common threshold by taking the maximum of the supplied threshold and the threshold for `m>=max(8,128|CA|)`; it retains universal quantification over every `i` at every later `x`.

This generic branch was inspected to sharpen the previous audit. The separate S76/Main tracer has found that the actual Main path goes through selected `TheoremSSelected` data and a different closed-input assembly; no claim is made here that the above named generic family theorem is the exact theorem invoked by Main.

## 6. Actual Main-branch arithmetic: distinctions and concrete normalization

The sibling trace identified `GlobalTheory.CarrierGap.theoremS_leaves_of_carrierG` and `offDiag` in `src/Development/AbelianVarietyTheory/Proofs/FlagMeasures/OffK0Closed.lean` as the selected off-diagonal branch. Inspection of that body confirms that it assembles actual local models, local densities, `RowsInputP`, nongeneric rows, projection corrections, integral/convergence data, coefficient formulas, and mass normalizations.

### 6.1 `NormProd` is not `NormLB`

`Formalism.L2.SG.SupportG.NormProd D` states, for any nonzero `x in E`,

\[
 \prod_{p\ {
m finite}}\operatorname{modK}_p(x)
      =|N_{E/\mathbb Q}x|^{-1}.
\]

`Closed.NormProd_holds` in `ClosedVolumeStatements/VolumeNormalizedOne.lean` applies `local_product_formula` to the quadratic extension and the matching local models. It does not assume `x` integral and does not assert a norm lower bound. It gives global equality of norms when local kernel support forces equality of every finite-place modulus. `SupportG.supportLemma_of_loc` uses exactly this mechanism.

This theorem and Proposition A use the same norm arithmetic in different ways. Product formula plus integrality can yield separation, but the source's Main-branch row input needs the product formula, local support, and frame patching together. The minor packing result alone does not substitute for that package.

### 6.2 Deep cut leaves are supplied by local/global frame patching

`Closed.CutLeavesDeep_outright` calls `FStar.cutLeavesDeep_of_betaInt`, with `FStar.betaInt_holds`.

- `cutLeavesDeep_of_betaInt` proves local count/unimodular steps, supplies stabilizer approximation, and invokes integral frame patching.
- `betaInt_holds` uses `spanOm_holds`, `pinOm_holds`, and `localOrthogonal_holds` to provide the integral global compatibility.
- `Coef.rowsDatumP_of_deep` also uses finite eligible terms, partner counts, orbit/fiber identities, local phases, and density formulas.
- `DataCut.rowsInputP_of_normProd` then combines that row datum with the actual product formula.

The bounded inspection reached these precise bodies. It did not independently re-prove every local-count, approximation, and patching theorem in their imports. These are not equivalent to the two elementary norm/minor lemmas.

### 6.3 A concrete covolume formula, including the powers of two

`Closed.CovolRef_outright` is assembled from `coordCovol_of`, `kapLaw_holds`, `NOf.nofib_holds`, `CovB.blockCovol_holds`, and a reference-box/frame-row result. The body of `DualFamilyCounting/RowBlockCovolOf.lean` is particularly useful for prose compression.

For a row block of complex dimension `k+1` at each real place of `F`, put `f_F=[F:Q]`, `Delta_F=|disc(F)|`, and let `b` be the block index. Its stated covolume in the source's standard complex-coordinate Lebesgue measure is

\[
 T^{f_F}\,2^{-f_F(k+1)}\,
 \Delta_F^{(k+1)(1-2(r-b))}. \tag{F}
\]

The proof first makes the integral row basis explicit, establishes the trace-pairing identity

\[
 Q_{\operatorname{diag}(1,\ldots,1,-1/T)}
       (\operatorname{rowV}x,\operatorname{rowV}y)
      =\tfrac12\operatorname{Tr}_{E/\mathbb Q}h(x,y),
\]

and then applies a real Gram-determinant/covolume identity. The factor `2^{-f_F(k+1)}` comes from the half trace; the factor `T^{f_F}` comes from the absolute determinant of the signature matrix. The discriminant and fractional-ideal scaling come from `TrDetUnimod`.

`TrDetPfH.detHOne_holds` proves the relevant pairing determinant is a unit by constructing trace-dual vectors with the adjugate and determinant of an integral Gram matrix. `rowBlockCovol_of` then uses the trace determinant, full real rank, and exact coordinate identifications to obtain (F).

This is a concrete arithmetic covolume computation. Its form is indefinite before taking an absolute determinant, and it is not automatically a positive definite realization of the user's analytic residual. Compressing it as merely “a lattice covolume is controlled” would lose meaningful factors and hypotheses.

## 7. Uniformity and honest compression boundary

The quantifier order to preserve is

\[
 \exists X_0\ \forall x\ge X_0\ \forall i\in I_x\ \forall u,v\in W_{x,i}:
       \text{the required identities and estimates hold}.
\]

A finite maximum of independently supplied thresholds is legitimate when each threshold is already uniform in `i,u,v`. A collection of pointwise thresholds depending on a moving family member is insufficient. The inspected `chosenProviso_sup`, `family_theorem_S_of_pointwise`, and row-count transports explicitly preserve the appropriate uniform quantifiers; they still require their input families.

The shortest defensible arithmetic section can therefore contain:

1. Proposition A, making the integral source of multiplicative separation explicit.
2. Lemma B and Proposition C, replacing support-by-support counting by one product argument.
3. Corollary D, recording the exact logarithmic cost rather than concealing it in nested constants.
4. Proposition E, isolating how exact arithmetic rank and prime selection produce the dimension window.
5. The actual norm-product, trace-dual/covolume, and frame-patching inputs, with all arithmetic matching and uniformity assumptions retained.

These improvements make the compression more precise and shorter. They do not authorize a title or conclusion asserting a completed RH proof. A full proof compression needs a certified chain from the actual selected family, through the complete analytic/arithmetic bounds and terminal prime/character theorem, to the stated RH endpoint. A proof that additionally claims to use the twin-ladder model needs an exact arithmetic map and metric identity for that model; the material above supplies useful building blocks but does not construct that map.

## 8. Exact finite checks

The accompanying `check_arithmetic_compression.py` ran successfully and writes `arithmetic_compression_checks.json`. It uses integer arithmetic and `fractions.Fraction`, with no numerical tolerances.

- 252 finite-product cases, comprising 26,910 points, check extension across zero coordinates and the injective coordinate-projection sum bound. 16,782 of those points have zero coordinates or are the zero-coordinate case.
- Negative controls demonstrate failure if the fixed initial coordinate or the zero-tail condition is removed; a duplicate-row check also confirms the necessity of set/injectivity assumptions.
- 180 Gaussian-integer mixed minors and 179 nonzero differences check the arithmetic mechanism in `Q(i)`.
- 3,321 frame-exponent identities and 10,560 rational comparisons check the logarithmic-cost algebra.
- 711 rational prime-window examples check the normalized-dimension inequalities against the exact upper factor `(1+1/(fk))^{fk}`; the standard comparison of that factor with `e` is in Proposition E's proof.

These checks support the implementation and expose relevant degeneracies. The universal statements rest on the proofs above. The checks are not a Lean replay, exhaustive source verification, or numerical evidence sufficient to settle RH.
