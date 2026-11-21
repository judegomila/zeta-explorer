# S76 and the actual Main proof route: source audit

## Finding and verification level

The earlier audit boundary can be narrowed substantially. The announced source contains an explicit theorem body supplying the conditional `AdmissibleBoundsFromSource.PeriodFamilyStatement` interface. More importantly, tracing the visible proof of `riemannHypothesis` in `Main.lean` reaches a different, selected arithmetic construction that supplies the corresponding off-diagonal estimate and then `LinkS`. This report distinguishes these two routes.

This is a **source inspection**, at commit `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2` of `https://github.com/leanprover-community/riemann-hypothesis`. No Lean source was executed, no compilation or independent kernel replay was performed, and no compiled proof-term dependency graph was obtained. The theorem bodies and arguments described below are present in that checkout. Their presence is stronger evidence than a declaration of a proposition, and weaker evidence than a successfully replayed, semantically audited proof of RH.

The correct update is therefore:

> A supplier for the generic S76 interface has been located. The explicit Main route also has a located selected-family supplier and a located family constructor. The remaining audit boundary is now the correctness and dependency closure of those suppliers, their imported instances, and independent checking of the final theorem.

It would be inaccurate to retain “the source has no S76 supplier.” It would also be inaccurate to replace that sentence with “we have independently verified the announced RH proof.”

## 1. The generic S76 interface and its actual supplier

Let `A` abbreviate the source module `src/Formalism/SharpRestriction/CuspSpanNormBounds/AdmissibleBoundsFromSource.lean` and `B` abbreviate `src/Formalism/SharpRestriction/CuspSpanNormBounds/BruhatCellsKronecker/ShiftedParametersOfDifferingLetters.lean`.

The following source declarations have different logical roles:

| Declaration | Role | What has been checked here |
|---|---|---|
| `AdmissibleBoundsFromSource.PeriodFamilyStatement`, A:376 | Definition of a conditional proposition | Its assumptions and conclusion were read. |
| `BridgeLemma.theorem_S_of_numerical_inequalities`, B:327 | Pointwise theorem | Its matrix decomposition and inequality proof body were read. |
| `BridgeLemma.assembly_numerics_of_large`, B:779 | Numerical absorption theorem | Its growth thresholds and use in the family theorem were read. |
| `BridgeLemma.theorem_S_family`, B:862 | Theorem inhabiting `PeriodFamilyStatement` | Its finite-threshold construction and invocation of the pointwise theorem were read. |
| `BridgeLemma.theorem_S_of_large_parameters`, B:963 | Pointwise `IntegralityFromMetric` supplier | Its explicit large-parameter hypotheses and construction were read. |
| `BridgeLemma.theorem_S_closed_form`, B:977 | Closed-family packaging of the supplier | Its constant-demand witness and invocation of `theorem_S_family` were read. |

The interface has the logical form

\[
\operatorname{Good}(g)\land\operatorname{Good}(a;g)
\land\bigl(\max(C_E,C_N)+1\le C_\Gamma\bigr)
\land\operatorname{FirstFiltrationHypotheses}(F,g,a)
\ \Longrightarrow\ \operatorname{ConclusionF1}(F,g).
\]

`ConclusionF1` is eventual in the family parameter and remains conditional on the standing pointwise hypotheses. The first-filtration package includes the generic arithmetic estimate `admF9`, nongeneric bounds, structural identities, dimension/Vandermonde statements, the twelfth hypothesis, and thirteenth through fifteenth hypotheses. Giving the conditional S76 theorem does not by itself prove those inputs for a particular arithmetic family.

### 1.1 The mathematical content of this assembly theorem

The pointwise conclusion comprises four assertions. In abbreviated notation, with the source's dimensions (d_u), denominator (D_*), scale (b), and growth factor \(\Gamma\), they are:

\[
K_{++}(u,v)=0\quad(u\ne v),
\]

\[
\|K_{++}(u,u)\|_{\mathrm{HS}}^2
\le d_u\exp(-kf\log k),
\]

\[
\|K(u,v)-K_{++}(u,v)\|_{\mathrm{HS}}^2
\le(1+b^{-6})\frac{d_ud_v}{D_*}\quad(u\ne v),
\]

\[
\|K(u,u)-K_{++}(u,u)-I\|_{\mathrm{HS}}^2
\le\Gamma\frac{d_u^2}{D_*}.
\]

The proof decomposes the kernel into the identity, exceptional, nongeneric, and generic terms. The identity and exceptional terms are handled by hypotheses already supplied in the first-filtration package. The remaining sums are combined with the weighted Hilbert-space inequality

\[
\|X+Y\|_{\mathrm{HS}}^2
\le(1+t)\|Y\|_{\mathrm{HS}}^2+(1+t^{-1})\|X\|_{\mathrm{HS}}^2,
\qquad t>0.
\]

For different words, injectivity of the word encoding supplies a letter where the words differ. The corresponding shifted spectral parameters differ by a prescribed separation. The proof chooses an explicit interval with endpoints (5/2-v) and \(\Delta/2-v\); this supplies the cut demanded by the generic arithmetic estimate. The local datum `s76x` and global ideal datum `s76L` are explicitly defined. `s76L` uses powers of the codifferent and the inverse of a principal ideal generated by the level parameter, with phase parameter zero. These witnesses make the abstract generic bound applicable; they do not replace the proof of that bound.

The numerical conditions include

\[
2(1030C_A+3)\le k,\quad 3000\le k,\quad C_A'\le k^{c_5},
\]

\[
1\le c_L\log k,\quad 1\le c_N\log k,\quad
13+8C_A+8C_e\le b.
\]

Under the standing inequalities these are sufficient to absorb the generic correction, loop term, and nongeneric term into the stated (1+b^{-6}) or \(\Gamma\) budgets. The theorem is not merely a renaming of its conclusion.

The family proof extracts eventual thresholds for each first-filtration component, adds thresholds ensuring the numerical conditions, and takes one finite maximum. The resulting threshold works for every allowed index (i) at every later family parameter. This makes its quantifier order useful for compression: a uniform family theorem is obtained from finitely many uniform eventual estimates and growth of the scale parameters. An estimate proved separately for each index with index-dependent thresholds would not justify this step.

### 1.2 What this does not establish about Main

A whole-source textual search for `theorem_S_family` and `theorem_S_closed_form` found their definitions and the call from the latter to the former, but no explicit use elsewhere. There are also generic structures whose fields are named `p76` or `s76`, and conditional consumers of those fields. A field declaration is not a construction of its value.

This textual observation is **not** a proof that these declarations are absent from the elaborated proof term. Typeclass resolution, tactics, and generated declarations can hide dependencies from simple name searches. The static import audit places these modules, along with every submitted project Lean module, in Main's import closure; only the added `Challenge` module lies outside it. Import membership and use in the final theorem's proof term are different questions. The more useful finding is positive: the actual explicit route from Main to `LinkS` can be followed through the selected construction below. The generic S76 theorem should be described as an available conditional module until compiled dependency information establishes more.

## 2. The visible Main proof route

All paths in this section are relative to `src/`. Long common path segments are abbreviated only for readability:

- `Third/` means `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/`.
- `Char/` means `Development/AutomorphicArithmetic/CharacterBoxes/`.
- `Flag/` means `Formalism/LocalToGlobal/SiegelLatticeTheory/FlagStabilizerTensors/`.
- `Measures/` means `Development/AbelianVarietyTheory/Proofs/FlagMeasures/`.

The arrows in the following table are **visible source applications or explicit record-field transport**, not a claim to be an exhaustive compiled dependency graph.

| Consumer | Explicit supplier / construction | Source |
|---|---|---|
| `riemannHypothesis` | `rhOfAll` | `Main.lean` |
| `rhOfAll` | `Formalism.VW.rh_of_every allChi` | `Supplements/Kernels/MainTheorems.lean` |
| `allChi` | `UpperTheory.FinalTheorems.everyCharacter` | Same file |
| `everyCharacter` | `everyCharacter_of_row galoisLocalGlobalStrong_recParameter` | `Char/MainConclusion.lean` |
| `everyCharacter_of_row` | Builds the three-field `OpenLiteratureStatements` record and calls `every_character_of_literature_of_vWin`, with `vwin_of_row` | Same file |
| `every_character_of_literature_of_vWin` | Supplies the eigen/theta packages, theta-integral agreement, local matching, covolume theorem, local Langlands existence and `VWin` to `every_character_of_theta_integrals_local_matching` | `Third/EveryCharacterOfLiteratureOfVWin.lean` |
| `every_character_of_theta_integrals_local_matching` | `every_character_of_green_v_win`, supplied with a constructed nonempty `HypsAlt` | `Third/SiegelEisensteinSecondTermHypotheses.lean` |
| `every_character_of_green_v_win` | Primitive-character zero-freeness followed by the imprimitive transfer | `Third/TopPlug.lean` |
| `zero_free_all_of_green_v_win` | `forall_goal_of_shape_of_hyps`, `shape_closed_link_n_of_green`, and character-host supply; fixes the window exponent to (3/2) | Same file |
| `shape_closed_link_n_of_green` | Constructs the closed `LinkDIV`, design, rank, irreducibility, `LinkS`, and `LinkGLOBAL` ingredients and invokes `topDesWin` | `Third/TopShape.lean` |
| its `LinkS` ingredient | `GlobalTheory.Top.link_alt_alt_bis` | `Third/LinkAltAltBis.lean` |
| `link_alt_alt_bis` | `ThmSOwn.theoremS_transport_link_zero` with the selected `sO` and `sLp` fields | Same file; `Flag/LinkSPos.lean` |

The final `UpperTheory.EveryCharacter` definition is a statement about the usual `DirichletCharacter.LFunction`: nonvanishing for real part greater than one half with the expected principal-character pole exception. The endpoint is therefore not merely a proposition named “RH” with no connection to the zeta function. However, checking the endpoints does not validate all intermediate definitions or proof bodies.

### 2.1 The top-level row input is supplied in source

`Char/MainConclusion.lean` does not leave `Row0b` as an uninstantiated hypothesis of its final `everyCharacter` theorem. It explicitly calls `UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter` from

`Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/RowSrc.lean`.

That theorem calls `galoisRepresentations_of_thetaLift` with `UpperTheory.TP.K.tLiftK`. The former calls `galoisLocalGlobalStrong_of_geometry_lift` with `Geo.geoOne_holds`; the latter obtains the stronger row statement from `Row0.row0b` and a `Row0` construction. The `Row0` construction in `IntegralStructures/Development.lean` invokes `coreAll_of`, then `rest`; their inputs include a geometric seed, congruence theorem, theta lift, closed-phi statement, descent, limits, and local-global compatibility.

`Row0b` itself, in `TypeConditions/WeightsConjBis.lean`, quantifies over CM fields and regular algebraic polarized cuspidal data and asserts existence of a Galois representation with continuity, semisimplicity, local compatibility, and weight properties. It is not definitionally RH. We have traced the named constructors at this level; the full geometric/theta/congruence subtree has not been audited here.

The `VWin` branch is separately supplied through `vwin_of_row`, `automorphic_window_of_inputs`, and `v_window_of_depth_zero_residual_bc_cm`, which assembles local, automorphic, cohomological, and CM packages. Locating these constructors closes an “unlocated top-level input” boundary. It does not independently establish their deep inputs.

## 3. The actual selected off-diagonal theorem

`ThmSOwn.TheoremSSelected`, defined at `Flag/ThmSOwn.lean:669`, is an eventual bound for the **chosen** spectral data. With (T_{x,i}) denoting that choice and (u\ne v), it asserts

\[
\|K_0(T_{x,i};u,v)\|^2
\le(1+b_{x,i}^{-6})\frac{d_{u,x,i}d_{v,x,i}}{D_{*,x,i}},
\]

under the standing hypotheses and after both the family and the selection thresholds. The source uses the norm of `K0`; conversion to the kernel/Hilbert–Schmidt formulation is made by separate transport identities in `ThmSOwn` and `LinkSPos`. Keeping those identities explicit avoids silently identifying different norms or different realizations.

The actual supplier chain is:

| Stage | Actual named construction |
|---|---|
| Chosen-family order bound | `GlobalTheory.LocalRows.at_choice_alt` in `Third/AtChoice.lean` |
| Main estimate | `GlobalTheory.CarrierGap.offDiag` in `Measures/OffK0Closed.lean:673` |
| Closed hypotheses supplied | `theoremS_leaves_of_carrierG` in the same file, with `carrierP` |
| Pointwise theorem | `TheoremSConclusion.theoremS_of_conj` → `PoincareAmplitudeLowerBounds.theoremS_closedP` |
| Conclusion projection | `ThmSOwn.theoremS_distinct_of_closed` |
| Uniform family transfer | `ThmSOwn.offDiagonalK0_of_rows` in `Flag/LinkSFinalP.lean:58` |
| Conversion into the four kernel clauses and the arithmetic rank link | `ThmSOwn.theoremS_transport_link_zero` in `Flag/LinkSPos.lean:131` |

`offDiag` has explicit inputs `SWXS`, `RowNGP`, `RowsFinDim`, a selection, local compatibility, rank information, and loop bounds. Its proof creates the closed pointwise theorem from a 19-component hypothesis package and then supplies the family sizes, threshold theorem, and absolute convergence to `offDiagonalK0_of_rows`.

The 19-component package is genuinely constructed in `theoremS_leaves_of_carrierG`; it is not simply assumed under a different name. Its immediate suppliers include:

| Package component | Visible immediate supplier |
|---|---|
| Local models | `localModelAt_holds` |
| Density inputs | `densInputT_holds` |
| Arithmetic rows | `rowsInputP_of_dataCut`, `rowsInputP_of_normProd`, `Closed.NormProd_holds`, `rowsDatumP_of_deep`, `Closed.CutLeavesDeep_outright` |
| Nongeneric rows | The supplied `RowNGP` theorem |
| Exceptional off-diagonal vanishing | `Closed.KppOffC_holds` |
| Carrier | `carrierP`, constructed using compact models, leaf data, Bessel uniqueness, and finite-vector nonvanishing |
| Kernel exponent agreement | `kExpTiedS_holds`, proved from folding, fundamental domains, orbital integrals, kernel expansion and convergence |
| Folding / orbital integration / absolute convergence | `Closed.FoldOKC_outright`, `Closed.OOIntAllC_outright`, `Closed.AbsConvC_outright` |
| Finite row spaces and decay | `finXC_of`, using `WuDecayOfGap` and `RowsFinDim` |
| Choices and counting formula | `choicesC_holds`, `formulaCT_holds` |
| Row sums and row form | `rowsSum_of_formula_volume`, `rowFormAllP_of`, `Closed.volume_determined`, `vIndepAtAllP_ofG` |
| Positive normalizing constants | `NcAllC.normalizing_constants_all` with `Closed.CovolRef_outright` and `SWXS` |
| Mass data | `massDataInputsAll_of`, positivity, volume, product convergence, typedness and real-place input constructors |
| Linking and splitting | `linkAll_holds`, `splitAll_holds` |

This table gives the next exact audit boundary. It does not declare each named supplier proved independently just because its name ends in `_holds` or `_outright`. Several suppliers also receive implicit `Fact` instances. The theorem at `OffK0Closed.lean:633` explicitly has instance parameters for unramified Hermitian representation, local coefficient bounds, Bessel nonvanishing, low-degree decay, finite-vector density, gauge volume, limiting weights, and coefficient caps. Their resolution must be included in a genuine proof-term audit.

### 3.1 How uniformity is maintained on this route

`offDiagonalK0_of_rows` first extracts constants from `TheoremSDistinctWords`, chooses threshold functions depending on the permitted constant list, and combines the selected-data, size, loop, and admissibility eventual bounds. It uses the maximum of four family thresholds. It then supplies the same chosen datum to all parts of the pointwise theorem.

This is useful for a human compression because it separates two duties:

1. Prove the pointwise arithmetic and analytic statement with constants whose allowed dependencies are recorded.
2. Prove the chosen arithmetic family eventually satisfies all premises with one common threshold.

The final bound does not follow merely from knowing that some datum works for each word pair. The source transfer preserves the actual selection and its compatibility information.

### 3.2 The Siegel–Weil input is also constructed, but not fully re-audited

On the actual path, `hypotheses_nonempty_of_unramified_exponents_alt` passes `published_results_eigen.siegelWeilUnitaryConvergent2` to the selected-row construction. In `Third/EveryCharacterOfLiteratureOfVWin.lean`, that field is supplied by `siegelWeilU_unitary_convergent_of_literature`, whose body is `GlobalTheory.CompanionTheory.SW.siegelWeilUnitaryConvergent`.

The latter theorem is in `CompanionTheory/SpectralGeometry/LocalGlobalProofs/AdelicAnalysis/Imports.lean`. Its body combines `finVol_unitaryGroup` with `GlobalTheory.T.siegel_densities_of_hermitian_form`. The density statement wraps `TopDens.siegelDensities`, which has a substantive proof using standard local measures, self-dual scaling, Gram-fibre measures, Euler products, a Siegel–Weil measure identity and mean-value integrability. This removes another possible ambiguity: the field is not left unfilled at the visible top-level assembly.

The proof of the underlying Siegel–Weil measure identity, the finite-volume subtree and every required instance remain outside this report's independently inspected boundary.

## 4. An actual arithmetic family is constructed in the Main route

The selected bounds are not only proved for an arbitrary uninstantiated family. The following explicit record construction is present:

1. `nonempty_hyps_definite_side_of_closed_bound` in `Third/SiegelEisensteinSecondTermHypotheses.lean` constructs row rationality, a Fourier-fit condition, an evaluation grid, open parameters, functional conditions and covolume conditions, then calls `hypotheses_nonempty_of_unramified_exponents_alt`.
2. The latter, in `Third/HypothesesNonemptyOfUnramifiedExponents.lean`, obtains large-unramified-exponent bundles and calls `allRows_of_open0_alt` and `nonempty_hyps_of_allRows_alt`.
3. `allRows_of_open0_alt`, in `Third/LinkROfIsLinked.lean`, obtains `loc := lg1_sLp_sO_hTF ...` and assigns `sLp := loc.1`, `sO := loc.2.1`, and `hTF := loc.2.2` in the actual row record. It also supplies period entries, prime valuations, ranks, counting constants and norm conditions.
4. `nonempty_hyps_of_allRows_alt`, in `Third/NonemptyHypsOfAllRows.lean`, invokes `UpperTheory.Top.classSel` on the assembled conjunction. That invocation returns a family class, a raw selection, an existence statement, duty statements and all the selected row properties. The theorem constructs the `HypsAlt` record and explicitly stores `sO`, `sLp`, the selection, and the other fields.
5. `goal_of_shape_of_hyps`, in `Third/ShapeOf.lean`, passes the record fields to `shape_closed_link_n_of_green`.
6. `topDesWin`, in `Char/DesWin.lean`, combines the closed statements, invokes `DesignExists` with their common demand, chooses `Fm` and `CH`, obtains `ChosenE`, `TuSize` and `DGamSize`, and applies the assembled `LinkGLOBAL` statement. Its conclusion is `FamilyClassConnected`.

These are located theorem constructors, not a proof that the family exists by the meaning of a name. Conversely, the full proofs below `classSel`, large unramified bundles, the design theorem, and the global arithmetic links have not all been independently checked here.

## 5. The analytic endpoint is a window theorem on the visible Main route

The explicit Main route uses `UpperTheory.Top.zeroFreeAll_of_topG`, which calls

`Formalism.HC.zeroFreeOn_of_tiedWin_cyc`

from `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean`. Its supplied window exponent is (3/2). `TopG` receives actual character-host supplies and `FamilyClassConnected` statements, then supplies the tied families to the window theorem.

In `TopWin.level_of_tiedWin`, the analytic level \(\Lambda\) and its averaged function \(\Lambda.G_m\) are fixed. For a proposed zero, the proof first chooses a sufficiently small \(\varepsilon\), then obtains an auxiliary family `Fm`. The `EFamC` comparison ties that family's estimates to the same fixed \(\Lambda.G_m\), and its windows are arbitrarily large for that choice. Auxiliary families may therefore vary with \(\varepsilon\); that variation is not itself a quantifier defect. The comparison and fixed analytic target are the essential conditions.

The separately located full-ray declarations `GrowthSizeBound` and `GrowthBoundGivesRiemannHypothesis` are useful comparison interfaces. Their membership in Main's static import closure does not show that the final theorem's proof term uses them. A compression must retain the exact window richness and quantifier order of whichever endpoint it claims to implement. It must not silently replace a window hypothesis by an unproved full-ray estimate or conversely infer a valid window theorem from an arbitrary sparse subsequence.

## 6. Consequences for the twin-ladder compression

The source audit supports a more precise compression programme. The ladder model may provide a concise coordinate description of pairwise blocks, a determinant or Gram-form identity, and a clean explanation of how a completed arithmetic estimate produces the final inequality. The newly located supplier shows where that description would need to attach:

- At the selected row kernel `K0`, or at a fully justified isometric transport of it.
- With the actual dimension and mass normalization (d_ud_v/D_*).
- With the quantitative error (1+b^{-6}), including a uniform threshold for the chosen family.
- With local compatibility, integrality/arithmetic rows, and period normalization preserved.
- With the correct window-family endpoint.

An elegant finite-dimensional identity does not automatically establish the arithmetic row package, Bessel/carrier input, mass normalization, or the existence and uniformity of the selected family. The source supplies named constructions for these jobs, but incorporating them into a release as proved mathematics requires their independent validation and correct translation.

This report therefore establishes **source-map progress**, not a new proof of those deep inputs and not priority for them. The relevant new editorial result is that the proposed compression no longer has to treat S76 or the actual family supplier as an unnamed black box. Its remaining black boxes can be stated at a smaller and much more explicit boundary.

## 7. What is closed, and what remains open in this audit

| Audit obligation | Status after this inspection |
|---|---|
| Locate a theorem inhabiting generic `PeriodFamilyStatement` | Closed at source-body level: `BridgeLemma.theorem_S_family`. |
| Determine whether the generic interface definition alone supplies the theorem | Closed: it does not; the located theorem is a separate construction. |
| Locate the explicit Main-to-`LinkS` path | Closed at visible source-application level. |
| Locate the actual selected off-diagonal supplier | Closed at source-body level: `CarrierGap.offDiag` and its closed-hypothesis constructor. |
| Locate actual family/selection and simultaneous property assembly | Closed at source-constructor level: `classSel` → `HypsAlt` → `topDesWin`. |
| Identify correct Main endpoint form | Closed at visible source level: character-window theorem. |
| Prove generic S76 is in the elaborated Main dependency graph | Unverified; no explicit external call found, and textual nonoccurrence is not conclusive. |
| Check every deep theorem and implicit instance on the selected route | Unverified. Immediate suppliers are recorded above. |
| Independently compile and replay the final proof | Not performed. |
| Independently audit every definition against its mathematical meaning | Not completed. |
| Derive an unconditional RH proof from the user's ladder work alone | Not established by this audit. |

## 8. Reproduction and source handling

The companion `S76_CLOSURE_MAP.json` records the pin, source paths, line locations, SHA-256 hashes and selected explicit edges. It is a source map, not a Lean-generated dependency graph. The following read-only searches reproduce the central distinction:

```sh
git rev-parse HEAD
rg -n 'PeriodFamilyStatement|theorem_S_family|theorem_S_closed_form' src
rg -n 'theoremS_transport_link_zero|TheoremSSelected|theoremS_distinct_of_closed' src
rg -n 'lg1_sLp_sO_hTF|at_choice_alt|theorem offDiag' src
rg -n 'everyCharacter_of_row|every_character_of_literature_of_vWin' src
rg -n 'nonempty_hyps_of_allRows_alt|topDesWin|zeroFreeOn_of_tiedWin_cyc' src
```

The source's `verification/NOTES.md` distinguishes source inventory from build, export and independent comparator replay. It reports substantial resource demands and a build in progress at this pin. Those external project notes are not this audit's successful verification record. Because this work did not execute the source, it cannot certify the absence of elaboration-time or kernel-level issues.

This report is independently authored commentary and mathematical paraphrase. It does not redistribute the external Lean source. Public citations should use commit-pinned links, starting with:

- [Generic S76 supplier](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Formalism/SharpRestriction/CuspSpanNormBounds/BruhatCellsKronecker/ShiftedParametersOfDifferingLetters.lean).
- [Actual selected off-diagonal supplier](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Development/AbelianVarietyTheory/Proofs/FlagMeasures/OffK0Closed.lean).
- [Actual top-level theorem assembly](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/src/Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean).
- [Verification notes at the inspected pin](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md).
