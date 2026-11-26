# Proof-obligation register — compression v0.2

Date: **2026-11-20** (user locale).

## Release status

This release contains proved elementary reductions, a sharper finite minor-label estimate, and a more complete source map. It does **not** certify the announced RH formalization or establish an independent twin-ladder proof of RH. The source map now identifies actual theorem bodies and a selected-family constructor; the earlier description of those suppliers as “not located” is superseded.

The inspected external source is `leanprover-community/riemann-hypothesis` at commit **`c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`**. Its pinned [verification notes](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md) report a build in progress, not a completed Comparator verdict. No Lean compilation, proof-term dependency extraction, axiom-closure check, or independent kernel replay was performed for this release.

## Status vocabulary

| Status | Meaning |
|---|---|
| **Proved independently** | A complete mathematical proof is provided in this release under its displayed hypotheses. This does not assert a new literature result or a Lean-checked proof. |
| **Source body located** | A definition and an actual theorem constructor were read at the pinned source. The entire dependency subtree has not thereby been independently verified. |
| **Static check completed** | File identity, import information, or a textual property was checked. This is not elaboration, proof-term extraction, or kernel checking. |
| **Open in this audit** | The necessary argument, exact identification, or independent verification has not been completed here. This does not assert the external author failed to supply it. |
| **Not performed** | A verification operation has no result in this release. It must not be counted as a pass. |

## 1. Independent mathematical results

| ID | Obligation | Status and evidence | Limits to preserve |
|---|---|---|---|
| M00 | Finite frame projections, singular Schur distance and stable whole-form limits | **Proved independently** in the manuscript and `FRAME_GEOMETRY.md` | The actual arithmetic Gram identification and required defect estimates remain hypotheses. |
| M01 | Exact lattice index, covolume and determinant identity | **Proved independently** in `LADDER_COMPLETION.md`, Theorem 1 | Requires an injective integral map of positive rank, saturation, and the displayed source/target metrics. |
| M02 | Complete Hilbert–Schmidt cost and anisotropy slack | **Proved independently** in the same theorem | Uniform rescaling leaves this upper cost unchanged; general anisotropic metric changes can alter it. The determinant/index cost remains invariant. |
| M03 | Minimum unrestricted realization cost equals \(\log Q\) | **Proved independently** in Theorem 2 | A rank-one map already realizes the minimum. Existence of an arbitrary integral map cannot supply the missing arithmetic estimate. |
| M04 | Equivalence of the unrestricted lattice target and full-ray prime-ramp upper bound | **Proved independently**, using the previously established rounding ledger | This is a reformulation of the analytic target. A bound obtained by assuming that target is not a new proof. |
| M05 | CM integral minor labels and multiplicative separation | **Proved independently** in `ARITHMETIC_FAMILY.md`, Proposition A | The two frames must lie in a common integral Hermitian lattice. The norm comparison uses one embedding from each conjugate pair. |
| M06 | Weighted packing and removal of the support factor \(2^j\) | **Proved independently**, Lemma B and Proposition C; independently cross-reviewed | Applies to distinct label sequences with \(a_0=1\) and a zero tail. It does not remove multiplicities of underlying geometric objects. |
| M07 | Exact and coarse logarithmic packing costs | **Proved independently**, Corollary D; independently cross-reviewed | The exact formula requires its displayed positive-height/discriminant assumptions. The coarse bound retains \(j\le r\le m\), \(r\ge1\), and the root-discriminant bound. |
| M08 | Dimension window from exact rank and prime window | **Proved independently**, Proposition E; independently cross-reviewed | The arithmetic rank formula and prime-selection interval remain hypotheses. The Gram inequality alone does not supply them. |
| M09 | Mesh condition sufficient to extend a good-point bound to a full ray | **Proved independently** in `LADDER_COMPLETION.md`, Lemma 5 | The quantitative mesh condition is necessary to this argument. Arbitrarily large windows alone do not imply it. |
| M10 | C² convexity obstruction to an unrestricted window-to-full-ray shortcut | **Proved independently**, Proposition 6 | The example concerns general functions. It does not contradict a window theorem using the special meromorphic transform of the prime ramp. |

The exact checkers exercise finite instances and relevant negative controls. They support the algebra and implementation; the proofs supply the universal claims. The conditional RH corollary also uses the earlier project's one-sided Mellin/Landau theorem and a cited classical RH estimate. Those dependencies must remain explicit rather than being relabelled as finite algebra proved anew in v0.2.

## 2. Source identity and located suppliers

| ID | Obligation | Current status | Next acceptance condition |
|---|---|---|---|
| S01 | Identify the exact source version | **Static check completed** | Retain source commit, tree identity, tracked-file fingerprints, and dependency pins with every future verification result. |
| S02 | Compare the earlier and current source snapshots | **Static check completed** | The `src` tree is identical between `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9` and the inspected pin: Git tree `24df20b62d9976ccd20da819bc20b16f808f0fdd`. Any later source change requires a new audit record. |
| S03 | Resolve project imports and distinguish the challenge | **Static check completed** | The snapshot contains 175,188 Lean files; 175,187 are in Main's import closure. Only the added `Challenge` module lies outside. The project import graph is acyclic with no unresolved project imports. This says nothing by itself about proof validity. |
| S04 | Locate generic `PeriodFamilyStatement` supplier | **Source body located** | `BridgeLemma.theorem_S_family` and its numerical/closed-family constructors are recorded in `S76_CLOSURE.md`. Preserve the first-filtration assumptions. |
| S05 | Locate the supplier used by the visible Main route | **Source body located** | `CarrierGap.offDiag` supplies `TheoremSSelected`, which is transported by `theoremS_transport_link_zero`. Obtain the elaborated proof dependencies, including implicit arguments, during independent checking. |
| S06 | Locate actual family and selection construction | **Source body located** | `classSel` → `HypsAlt` → `topDesWin` supplies the actual class/selection and chooses `Fm`/`CH`. Independently validate the deep existence, counting, and compatibility inputs. |
| S07 | Locate arithmetic norm, minor, local row and covolume suppliers | **Source bodies located** | `NormLB`, `MinorInt`, `NormProd`, deep-cut/frame-patching and covolume constructors are distinguished in `ARITHMETIC_FAMILY.md`. Complete the deep dependency audit or obtain an accepted independent formal verification. |
| S08 | Identify the Main analytic endpoint | **Source body located** | The observed path uses `zeroFreeOn_of_tiedWin_cyc`. Preserve the exact fixed-level/window comparison and validate the analytic window theorem. |
| S09 | Prove the generic S76/full-ray modules occur in the final theorem's proof term | **Open in this audit** | A compiled dependency report is required. Their presence in Main's import closure is already established; it is a different fact. |

## 3. Remaining substantive obligations

### O1. Deep arithmetic and analytic suppliers

The located selected-family route still depends on theorem subtrees for local models and densities, product formulas, integral frame patching, row counts, Bessel/carrier constructions, normalizing constants, covolume estimates, Galois/automorphic inputs, and the design/family theorem. The release identifies immediate bodies and a bounded portion of their dependencies. It does not independently establish the entire chain.

**Acceptance condition:** for every assertion imported into the human compression, either supply a complete proof with its hypotheses and allowed constant dependencies, or cite a precise theorem whose formal verification and mathematical interpretation have been established. Definitions of propositions, record fields, and suggestive declaration names are not substitute proofs.

### O2. Implicit instances and theorem dependencies

`Fact` instances occur in the selected supplier's declarations. They include arithmetic representation, coefficient bounds, Bessel nonvanishing, decay, density, volume and cap conditions. Their resolved values belong to the proof's dependency chain even when an application omits their names.

**Acceptance condition:** obtain and retain elaborated dependency information and an axiom report for the final targets. Distinguish real theorem assumptions from automatically resolved proofs. Do not infer absence of dependencies from a text search.

### O3. Fixed analytic level and windows

The source endpoint fixes an analytic level \(\Lambda\) and its function \(\Lambda.G_m\). It may choose a small \(\varepsilon\) after considering a proposed zero, then choose an auxiliary arithmetic family. That family's `EFamC` comparison must control the same fixed analytic function on arbitrarily large windows. Auxiliary variation with \(\varepsilon\) is permitted; variation of the analytic target inside the window limit would require an additional argument.

**Acceptance condition:** independently validate the comparison and the precise `FormBAt`/Landau-window theorem, with all quantifiers and pole/transform hypotheses. To use the separate full-ray endpoint, prove an actual full-ray bound or a valid bridge. The mesh lemma is sufficient when its additional hypothesis is proved; arbitrary windows do not supply it.

### O4. A direct twin-ladder arithmetic map

No exact map has been constructed here from the user's twin-ladder residual or finite Pick/Weil form to the selected arithmetic kernel. Matching terminology, a common determinant identity, or positivity of a different Gram matrix is insufficient.

**Acceptance condition:** specify the spaces, vectors/maps, integral lattices, saturation, conjugations, prime/archimedean normalizations, and metrics; prove the exact identity or whole-form comparison being used. For a limiting comparison, control the error for every vector in each fixed finite test space and justify the limit. A finite positive diagonal or an averaged positive matrix does not establish this.

### O5. Independent cost control for a specified arithmetic construction

The unrestricted realization theorem shows why manufacturing a lattice map from \(Q_{X,m}\) is insufficient: its best possible cost is already \(\log Q_{X,m}\). Metric optimization may reduce anisotropy slack but cannot erase that index cost.

**Acceptance condition:** construct a specified arithmetic family with the required divisibility/index property and prove its complete cost bound independently of the desired prime-ramp estimate or RH. Preserve the allowed dependence of constants and the uniform family threshold. No such construction and estimate is claimed in this release.

### O6. Independent formal verification

**Not performed.** Use `VERIFICATION_PROTOCOL.md` for the separate clean challenge, untrusted solution build/export, axiom check and independent judging procedure. A source scan, cache restoration, successful export, or an upstream smoke test is not a successful check of the final RH targets.

## 4. Claim gates for later releases

| Proposed claim | Required evidence |
|---|---|
| “Conditional compression with independent elementary improvements” | The displayed proofs, assumptions, source pin, cross-reviews and open obligations in this release. |
| “Independently checked formalization of the announced result” | Accepted final-target verification artifacts, protected clean challenge/dependencies, and semantic review of the statements. This status is presently absent. |
| “Faithful human compression of the announced proof” | The preceding evidence plus a complete argument-to-theorem correspondence, preserved hypotheses/quantifiers, and reviewed explanations of the substantive arithmetic and analytic inputs. |
| “A direct twin-ladder proof of RH” | O4 for the whole-form route, or O5 with its exact index/normalization theorem for the scalar route; either must be fully proved and connected to a valid endpoint. No such theorem is supplied by the elementary Gram or lattice identities alone. |

The next concrete acceptance target is to complete independent verification and the fixed-level analytic/deep arithmetic audit, while keeping the direct twin-ladder map as a separate open mathematical obligation.
