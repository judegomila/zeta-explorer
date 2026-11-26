# Arithmetic kernel source audit and geometric compression

**Source pin:** leanprover-community/riemann-hypothesis, commit `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`. The source tree is byte-identical to the earlier inspected pin `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`.
**Inspection date:** 20 November 2026.
**Scope:** the arithmetic kernel branch leading to `AdmissibleBoundsFromSource.Conclusion1` and `LinkS`, with a bounded examination of actual suppliers. This is an audit of source statements and selected proof bodies, not a Lean kernel check of the full theorem or its import closure.

## 1. Result and precise verification boundary

There is a concrete finite geometric compression here. The source kernel is exactly an adjoint Gram kernel after its stated scalar normalization. Several actual proofs convert its arithmetic kernel estimates into diagonal and off-diagonal Hilbert–Schmidt bounds and then into the uniform `LinkS` statement. These are not merely names for desired propositions.

One arithmetic child is especially transparent: multiplicative separation of integral embedding vectors gives a weighted lattice-packing bound. Its Lean file imports only Mathlib. A further actual proof uses that bound to control weighted minor-label sums. The packing argument and its constants are explained below independently of the source's larger framework.

**Version 0.2 update.** The earlier unlocated-supplier boundary is closed at source-body level. `BridgeLemma.theorem_S_family` supplies the generic `PeriodFamilyStatement`, retaining its first-filtration inputs. The visible Main theorem uses a separately located selected route through `CarrierGap.offDiag`, `TheoremSSelected`, and `theoremS_transport_link_zero`. Actual family constructors and the final character-window endpoint have also been located. [S76_CLOSURE.md](S76_CLOSURE.md) and its [typed source map](S76_CLOSURE_MAP.json) record that path. This note preserves the detailed generic kernel dictionary; it is not a claim that the generic S76 theorem is the explicit Main dependency.

The remaining boundary is independent validation of the selected suppliers, their implicit instances, the family and analytic window arguments, and the final kernel replay. The [static snapshot](SOURCE_SNAPSHOT.json) records source-byte and textual import checks only.

The independent frame theorem in `FRAME_GEOMETRY.md` therefore compresses a proved conditional geometric module. It does not yet independently establish the arithmetic hypotheses needed to apply that module to RH.

## 2. The exact kernel and dimension dictionary

The definitions in [RelevantZeroGramTerms.lean][gram] use finite-dimensional complex inner-product spaces \(C_u,H\), maps \(P_u:C_u\to H\), and
\[
c_u=\frac{\operatorname{volN}(u)\operatorname{volH}(u)}
{\dim\Pi(u)},\qquad
K_{uv}=(c_uc_v)^{-1/2}P_u^*P_v.
\]
The two volumes are positive fields of [DataS.lean][data]. The denominator is a product of natural dimensions, so \(c_u\ge0\). With Lean's totalized zero convention, define
\[
T_u=\begin{cases}c_u^{-1/2}P_u,&c_u>0,\\0,&c_u=0.\end{cases}
\]
Then \(K_{uv}=T_u^*T_v\) exactly, including the zero case. The source's `KD` is this same `Kmat`. The normalized `Q0` is exactly the projected positive frame operator, because its coefficient is \(c_u^{-1}\), also zero when \(c_u=0\).

The same file defines `PiU` as the inclusion of `ramCu` composed with orthogonal projection onto it. Thus the projection interpretation is an actual source identity.

The structure `D7` in [RhoDetPrimeEqMuTildeMulChiPow.lean][d7] supplies the dimension ties:

- `s_HH`: \(\dim_\mathbb C H=D_{\rm all}\).
- `s_Cu`: a complex-linear equivalence \(C_u\simeq(\mathrm{mem}\ u).A.\mathrm{Mu0}\).
- `duS`: the dimension of the latter space.
- `GamP_eq`: every word's \(\Gamma\) equals that of the distinguished word.
- `Dstar_eq`: the common \(D_*\) equals the local normalization.

The actual proof of `S.diag_unproj` uses the local declarations `one_lt_gammaP` and `Dstar_pos`, obtaining \(\Gamma>1\) and \(D_*>0\). These positivity assumptions are available in the source application; they are not inferred from notation.

Consequently, identifying the frame operator itself requires no new arithmetic conjecture. The hard input is its **quantitative near-orthogonality**, not its basic positive semidefiniteness. An identification of this operator with a particular Weil, Pick, or twin-ladder quadratic form would still require a separate arithmetic identity.

## 3. Actual proof bodies downstream of the kernel estimate

Put
\[
d_u=\dim C_u,\quad
q=e^{-kf\log k},\quad
\eta_0=b^{-6},\quad
e_F=\frac{2C_0}{\Gamma}+2q.
\]
In [AdmissibleBoundsFromSource.lean][admissible], `Conclusion1` consists of four assertions, for all words of the given datum:
\[
K^{\rm pp}_{uv}=0\quad(u\ne v),\qquad
\|K^{\rm pp}_{uu}\|_{\rm HS}^2\le d_uq,
\]
\[
\|K_{uv}-K^{\rm pp}_{uv}\|_{\rm HS}^2
 \le(1+\eta_0)\frac{d_ud_v}{D_*}\quad(u\ne v),
\]
\[
\|K_{uu}-K^{\rm pp}_{uu}-I\|_{\rm HS}^2
 \le\Gamma\frac{d_u^2}{D_*}.
\tag{1}
\]

The relevant `hyp` is the conjunction of `StandingNumericalData D C0`, `StandingHypotheses` with its size constants, and \(1\le C_0\). In particular, its dimension upper bound is
\[
d_u\le C_0D_*/\Gamma^2.
\tag{2}
\]

[StandingHypothesesHoldFamily.lean][standing] contains the following actual theorem bodies.

| Declaration, namespace `Formalism.MainNotions.S` | Inputs actually received | Output |
|---|---|---|
| `hsNormSq_add_le` | Two continuous linear maps between the specified Hilbert spaces | \(\|A+B\|_{\rm HS}^2\le2\|A\|_{\rm HS}^2+2\|B\|_{\rm HS}^2\) |
| `diag_unproj` | `hyp` and `Conclusion1` | \(\|K_{uu}-I\|_{\rm HS}^2\le e_Fd_u\) |
| `linkS_concl` | The preceding inputs and the separate `FrobeniusProjectedBounds.adm7` row-count estimate | Both kernel bounds and \(D_{\rm all}\le(1+\eta_1)D_*\) |
| `eF_nonneg_and_le_exp_neg` | The size hypotheses and two explicit scalar threshold inequalities | \(e_F\ge0\) and \(\eta_0,\eta_1,\sqrt{e_F}\le e^{-y}\) |
| `linkS_of_standing_hypotheses` | Uniform standing hypotheses, uniform `Conclusion1`, and uniform row count | `LinkS Fm C0` |

The key diagonal step is elementary:
\[
\begin{aligned}
\|K_{uu}-I\|_{\rm HS}^2
&\le 2\Gamma d_u^2/D_*+2qd_u\\
&\le(2C_0/\Gamma+2q)d_u.
\end{aligned}
\tag{3}
\]
The off-diagonal bound follows from the vanishing of \(K^{\rm pp}_{uv}\). The ambient dimension estimate is **not** obtained from (1): it uses a separate theorem whose error is
\[
|D_{\rm all}-D_*|
 \le e^{-c_7rf\log r}D_*.
\tag{4}
\]
Thus \(\eta_1=e^{-c_7rf\log r}\).

For the family parameter \(x\), the source sets \(y=x^{\varepsilon/8}\) and proves that its scale \(L=y^8\). Its scalar threshold lemma chooses \(Y_0\) such that, for all \(y\ge Y_0\),
\[
(2C_0+2)e^{-C_\Gamma y^8}\le e^{-2y},
\qquad y\le c_7(8C_\Gamma y^8).
\tag{5}
\]
Together with the standing size inequalities, these give the required exponentially small errors.

### Quantifier and window qualification

[LeSCSCl.lean][eventual] defines `OwnEv` by
\[
\exists x_0\ \forall x\ge x_0\ \forall i\in I_x:
 P(C'_{\rm fam},C_{\ell,\rm fam},x,i).
\tag{6}
\]
The constants \(C'_{\rm fam}\) and \(C_{\ell,\rm fam}\) are fixed from the family. The threshold must work for **every admissible index at every larger \(x\)**; pointwise estimates with thresholds depending on \(i\) do not suffice.

[GlobalTheoremInputs.lean][inputs] defines `LinkS_at` as an implication with antecedent
\[
\forall u,\quad C_0^{-1}
 \le d_u\Gamma^2/D_*\le C_0.
\tag{7}
\]
The family theorem legitimately uses a trivial implication when this window fails. Consequently `LinkS` alone does not prove that the desired data satisfy the dimension window. The eventual construction and use of the chosen family must supply that fact separately. This logical scope should survive any shortened exposition.

## 4. The generic arithmetic interface and its retained hypotheses

The exact `PeriodFamilyStatement Fm gc ca` interface in [AdmissibleBoundsFromSource.lean][admissible] says:

1. `gc.Ok`, meaning \(C_0\ge1\), \(C_g,c_b,C_u,c_T>0\), and \(c_T\le C_T\);
2. `ca.Ok gc.Cg`;
3. \(\max(C_E,C_N)+1\le C_\Gamma\);
4. `FirstFiltrationHypotheses Fm gc ca`;

together imply the uniform `ConclusionF1` defined using (6).

For clarity, the auxiliary constant package requires
\[
\begin{gathered}
1\le A_5,\quad C_1,C_2\le A_5,\quad c_L,c_N>0,\quad C_N,C_E\ge0,\\
C_A,C_A'>0,\quad C_e\ge0,\quad2C_g\le A_7,\quad C_7,c_{b7},c_7>0,\\
0<\epsilon_0<\tfrac12,\quad C_V\ge0,\quad c_5>0.
\end{gathered}
\tag{8}
\]
These are actual constant restrictions, not placeholders for arbitrary choices.

The first-filtration package contains expansion and identity formulas, diagonal exceptional-term estimates, loop-pair and nongeneric bounds, generic scalar-pair estimates, Weyl/Vandermonde comparisons, a Siegel mass-ratio input, volume comparisons, term-vanishing conditions, and absolute summability.

A particularly consequential member is `adm9`. For each pair of distinct words, compatible local real data and global lattice data, and the prescribed cut intervals and size assumptions, it requires a sharp generic main-term estimate of the form
\[
\operatorname{genScal}(u,v)
 \le
 \left[1+C_A(r+1)(C_A/\Theta_A)^f\right]
 (1+e_{\rm sum}(C_e))\,f_3\,\frac{d_ud_v}{D_*}.
\tag{9}
\]
Its hypotheses include \((r+1)(C_A/\Theta_A)^f\le1\), \(C_A'\le\Theta_A\), an outer interval width at least
\(C_A[kN(r+1)^2+N^2(r+1)^2+N^3]\), and an inner width at least \(N^3/2\), besides the stated local and global matching conditions. An elementary Gram-factorization argument does not supply this arithmetic normalization or its leading coefficient.

[ThresholdCubicInequalitySignPattern.lean][threshold] contains actual adapters that derive first-filtration components from named source inputs. Its `AdmissibleBoundsFromSource.family_first_package_of_source` assembles that package. Its `S0.family_statements_all` then **applies an argument `s76`** to the assembled hypotheses. Similarly, `S.linkS_of` and the structure behind `S.linkS_all` receive `S76`/`s76`. These files establish useful conditional implications, but these particular declarations are not themselves the base implementation of S76.

The small top-level [Main.lean][main] invokes `rhOfAll` after importing the theorem bundle. Reading that endpoint does not close the uninspected dependency boundary. No full Lean build or axiom/import audit was performed here.

## 5. A genuine arithmetic child: integral separation becomes geometric packing

There is an actual, readily understandable theorem in [WeightedLatticeSum.lean][weighted], namespace `Formalism.MainNotions.WeightedLatticeSum`. It imports only Mathlib.

Let \(I\) be finite, \(P\subset\mathbb C^I\) finite, and \(R\ge1\). Suppose
\[
p\ne q\quad\Longrightarrow\quad
 \prod_{i\in I}|p_i-q_i|\ge1.
\tag{10}
\]
Then `latSum` proves
\[
\sum_{p\in P}\prod_{i\in I}
 \max(1,|p_i|/R)^{-3}
 \le(64R)^{2|I|}.
\tag{11}
\]

### Independent reading of its proof

Assign each complex coordinate to the square indexed by
\((\lfloor2\Re z\rfloor,\lfloor2\Im z\rfloor)\). If two vectors have the same square in every coordinate, each coordinate difference has norm \(<1\), contradicting (10). Thus the square-address map is injective.

For \(m\ge0\), define
\[
w_R(m)=\max\!\left(1,\frac{m-1}{2R}\right)^{-3/2}.
\]
Each complex radial weight is bounded by the product of the two corresponding real square-address weights. A one-dimensional sum satisfies
\(\sum_{m\in A}w_R(m)\le9R\) for every finite \(A\subset\mathbb N\). To see the constants, take \(N=\lceil2R\rceil\). The first \(N+2\) terms contribute at most \(N+2<2R+3\); the remaining decreasing-power tail is at most \(4R\), by the telescoping reciprocal-square-root estimate. Since \(R\ge1\), the total is at most \(9R\). Splitting integer addresses into the two signs gives \(18R\).

After the injection, discard the restriction to the occupied squares and factor the nonnegative sum over the \(2|I|\) integer coordinates. This yields
\[
\sum_{p\in P}\prod_i\max(1,|p_i|/R)^{-3}
 \le(18R)^{2|I|}
 \le(64R)^{2|I|}.
\tag{12}
\]
The stronger intermediate constant already occurs in the source proof; it is not a new claimed improvement.

[LatticeSumBound.lean][latsupply] contains the actual theorem `LatticeSumConvergence.LatSum_holds` supplying the `KTwoMinorIntegrality.LatSum` interface from this proof.

### Its arithmetic use is also an actual proof

[KTwoMinorIntegrality.lean][minor] separates two arithmetic inputs:

- `NormLB`: for every datum and every nonzero algebraic integer \(a\),
  \(\prod_{\tau}|\tau(a)|^2\ge1\).
- `MinorInt`: under the specified frame hypothesis, the relevant minors of the two frames are algebraic integers for every minor index \(\ell\le r_S\).

[KTwoCosetCount.lean][cosets] contains an actual theorem `cosets_sum`. It receives these two inputs and `LatSum`, a nonempty embedding set, positive root discriminant, the source `TermTie` and `TieOK`, \(H_1>0\), and \(j\le r_S\). For **every finite set of labels** whose members arise from the specified inertia/cyclotomic-generator terms with index \(j\), it proves
\[
\sum_{\delta\in T}\mathrm{k2S}(D,H_1,j,\delta)^{-3r_S}
 \le 2^j\prod_{\ell=1}^{j}(64R_\ell)^{2f},
\tag{13}
\]
where \(f\) here denotes the cardinality of the source embedding set and
\[
R_\ell=\max\!\left\{
1,\operatorname{rd}_E^{\,2\,\mathrm{frameExp}(r_S,\ell)}
 (2H_1)^{2r_S}\right\}.
\tag{14}
\]

The proof derives integral labels and their finite support from the minor input, partitions by the subset of nonzero minor coordinates, and applies (11) separately to each active coordinate. NormLB applied to differences gives (10), because the unsquared norm product is nonnegative. There are at most \(2^j\) support patterns, producing the coefficient in (13).

This is a concrete arithmetic-to-geometric mechanism: **integral minors prevent embedding vectors from clustering multiplicatively; weighted packing then bounds a kernel contribution**. It is a plausible component of a clean exposition.

The v0.2 inspection locates `MinorIntegralityTorus.NormLB_holds` and `MinorInt_holds`, with the exact CM-type pairing convention. [ARITHMETIC_FAMILY.md](ARITHMETIC_FAMILY.md) gives independent proofs and source matching. It also removes the support factor `2^j` in (13), since zero coordinates have weight one and the first `j` coordinates determine the distinct label sequence. This improvement is a paper proof, not a modification replayed through the external Lean tree. The complete selected Main arithmetic package has additional product-formula, local-support and frame-patching inputs.

## 6. What can be compressed, and what must be retained

The source supports the following division of work:

1. **Exact finite geometry:** normalize the actual period maps, recognize their Gram kernel, prove the frame/projection inequalities, and control the two rank-removal losses. This part is now an independently understandable theorem.
2. **Integral geometry:** prove the norm/product and minor-integrality facts, then convert them into separation and weighted packing. The inspected source contains a genuine proof of the packing and its use in (13).
3. **Arithmetic normalization and uniformity:** establish the near-sharp generic main term (9), exceptional-term decay, the ambient row count (4), dimension window (7), and a common eventual threshold. These remain indispensable.

No contradiction or counterexample to the inspected proof bodies was found. Three qualifications constrain a proposed short proof:

- The cost in (11)–(14) grows exponentially with the number of embeddings. A fixed-dimensional packing slogan cannot replace the source's bookkeeping when the field and ranks grow.
- Positive Gram structure alone does not imply small off-diagonal blocks or the correct \(D_*\) normalization. Nor do trace bounds identify a different target form.
- A theorem valid only under the dimension window, or only after a threshold depending on a family, must not be silently promoted to an unconditional estimate or to uniformity over all families.

The source search has now located the generic supplier and the selected Main construction. The next acceptance conditions are recorded in [PROOF_OBLIGATIONS.md](PROOF_OBLIGATIONS.md): validate the actual deep inputs and normalizations, retain all uniformity and window quantifiers, and obtain an independent formal verdict if formal verification is claimed. A direct twin-ladder proof additionally needs its own arithmetic map and whole-form or complete-cost comparison. The present compression remains conditional.

## Pinned sources

[gram]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/RelevantZeroGramTerms.lean
[data]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/DataS.lean
[d7]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/LocalRingCardinality/RhoDetPrimeEqMuTildeMulChiPow.lean
[admissible]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/AdmissibleBoundsFromSource.lean
[standing]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/StandingHypothesesHoldFamily.lean
[eventual]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/LeSCSCl.lean
[inputs]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/GlobalTheoremInputs.lean
[threshold]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/ThresholdCubicInequalitySignPattern.lean
[weighted]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/WeightedLatticeSum.lean
[latsupply]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/LatticeSumBound.lean
[minor]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/KTwoMinorIntegrality.lean
[cosets]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/KTwoCosetCount.lean
[main]: https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Main.lean

