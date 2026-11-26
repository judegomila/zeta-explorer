# Cross-review of the source map and snapshot audit

Date: 20 November 2026 (America/Los_Angeles). Reviewed source pin: c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2.

## Verdict

S76_CLOSURE.md and S76_CLOSURE_MAP.json are suitable as a **qualified source-inspection report**. I found no contradiction between their principal endpoint claims and the source bodies independently inspected. They do not constitute a compiled dependency graph, an axiom audit, or independent mathematical verification of the announced proof; their existing status language correctly says this.

The source-map author added the requested fixed-analytic-level and import-reachability clarifications during this review. The inventory script and JSON are suitable for reproducible **byte, module-import and lexical checks**. Their counts and negative keyword findings must retain that scope in the paper and app.

## 1. Independently checked facts

- The 30 file SHA-256 hashes and byte counts in S76_CLOSURE_MAP.json match the checkout.
- All 47 recorded declaration line locations contain the named declaration at the recorded line.
- The 48 recorded edges carry separate types for explicit applications, record transport, premise/conclusion types, and a wrapper application. This is appropriate: a premise-type edge does not claim that its inhabitant has been constructed.
- I independently read Main.lean, Statements.lean, Supplements/Kernels/MainTheorems.lean, CharacterBoxes/MainConclusion.lean, the UpperTheory.EveryCharacter definition, ThirdPlaceSeries/TopPlug.lean, CharacterBoxes/ZeroFreeAllOfTopG.lean, and the relevant declarations in TotientGaloisClasses/TopWin.lean and Window.lean.
- These bodies support the report's visible route through zeroFreeAll_of_topG and zeroFreeOn_of_tiedWin_cyc; TopPlug explicitly supplies \(\lambda=3/2\).
- UpperTheory.EveryCharacter is about the usual DirichletCharacter.LFunction with real part greater than one half and the explicit principal-character/pole exception. Main's RH declaration passes through Formalism.VW.rh_of_every allChi. This supports the endpoint-identification claim; it does not validate every intermediate definition.
- The command audit_source_snapshot.py --self-test passes its supplied tests for imports, nested comments, strings, explicit admission tokens and malformed input.

I did not independently re-audit every deep supplier in the 19-component package, every implicit Fact instance, or every mathematical theorem below the family construction. Those remain outside this cross-review, just as they are outside the source report's full verification boundary.

## 2. Fixed analytic level versus changing auxiliary family

The following distinction is necessary and has now been added to §5 of S76_CLOSURE.md:

> The analytic level \(\Lambda\), hence the averaged function \(\Lambda.Gm\), remains fixed while applying the window zero-free theorem. In level_of_tiedWin, a putative zero determines a sufficiently small \(\varepsilon\); the theorem then chooses an auxiliary family \(Fm\) whose EFamC comparison controls that same fixed \(\Lambda.Gm\), and whose window property supplies arbitrarily large intervals. Such dependence of the auxiliary family on \(\varepsilon\) is permitted. Replacing the fixed analytic function by unrelated functions on successive windows would require another theorem.

The inspected source explicitly distinguishes:

- HasWindows: arbitrarily large intervals \([Y,Y^\lambda]\).
- WinAll: every sufficiently large point belongs to the window set.
- ChebyshevInequalityAtWindowScale: auxiliary family and bound with the former quantifiers.
- TiedAll: stronger full-tail family availability.

Consequently, the report correctly avoids deriving a full-ray estimate by regularity alone. The independent LADDER_COMPLETION.md supplies a precise sufficient mesh condition and a counterexample showing that bounded derivative and convexity do not manufacture the missing coverage.

## 3. Generic S76, the selected route, and import reachability

The distinction between the located generic conditional supplier and the separately traced selected supplier is useful and appropriately qualified.

The important terminology is **visible theorem-application route**, rather than exclusive dependency route. The static inventory reports that every tracked project Lean module except Challenge belongs to Main's textual import closure. Therefore the generic S76 and full-ray modules are import-reachable from Main. This does not prove that their theorems occur in the final elaborated proof term, nor does it prove that the visible selected route is the only one.

Recommended publication wording:

> A generic S76 supplier has been located. The visible applications leading from Main use the selected arithmetic-family route and the window endpoint. The exact elaborated theorem dependency graph has not been extracted.

The report makes the corresponding limitation about tactics, generated declarations and instance resolution. Retain it when compressing the report into app copy.

Minor schema observation: the non_edges_and_boundaries entry from s76Family to main uses the opposite orientation from the main edge list's consumer-to-supplier convention. Its explanatory text is understandable, but consistent consumer/supplier fields would reduce ambiguity if the map is later rendered as a graph. This is not a mathematical error.

## 4. How to interpret the snapshot counts

The recorded values are:

| Inventory field | Value | Correct meaning |
|---|---:|---|
| all_lean_files | 175,188 | Tracked .lean files under src in the pinned tree. |
| all_lean_lines | 17,374,242 | Physical lines in those files, using bytes.splitlines(). |
| all_lean_bytes | 1,030,533,076 | Sum of their byte lengths. |
| main_import_closure_files | 175,187 | Project modules reached by parsed textual imports starting at Main. |
| outside_main_import_closure | Challenge | The sole project module outside that static import graph. |
| external_imports | 348 distinct names | Direct external import targets encountered from the project closure; their transitive contents are not scanned. |
| matching listed keywords in Main's closure | 0 | No match to the script's particular token regex after its masking pass. |
| matching listed keywords outside the closure | 5 | Five sorry occurrences in Challenge. |

The 175,187 count is not a count of proved lemmas, necessary final proof dependencies, discharged proof obligations, or independently verified files. Zero keyword matches does not establish an axiom-free or correct proof.

Both recorded src tree hashes equal 24df20b62d9976ccd20da819bc20b16f808f0fdd, and the src diff against the earlier pin is empty. This supports “the inspected source tree is unchanged between these pins.” It does not imply that verification status, repository metadata, build tools, or external dependencies are unchanged.

## 5. Audit-script strengths and limitations

The script checks the actual bytes of each tracked Lean file against its Git blob before using them, records a SHA-256 manifest, distinguishes project-local and external import targets, detects cycles in the parsed local import graph, and does not execute Lean. These are meaningful integrity checks for this purpose.

Its parser is deliberately lexical, not Lean's parser. The comment/string masker and import regex have finite syntax coverage; the self-test checks representative cases, not every Lean lexical form. The project/external distinction uses top-level module roots present in the inventory, so an unknown top-level import is classified as external rather than automatically proved to exist. External modules, toolchain binaries, package locks, Lake configuration, generated proof terms, compiled object files and imported axioms are outside the scan.

The suspicious-token list is also finite. For example, absence of the literal text sorry or axiom is not a substitute for extracting the actual axiom closure of the elaborated final declaration. Conversely, some listed tokens can appear in legitimate Lean code, so a match would require inspection rather than being an automatic proof defect.

No defect in the inspected script changes the stated static inventory findings. The limitations above are reasons to keep the existing narrow scope and conclusion fields, not reasons to represent the report as a full verifier.

## 6. Release recommendation

Publish this work as progress in locating and specifying the source's arithmetic suppliers and analytic endpoint. Preserve the exact verification level and label the static file count precisely. Do not turn “located theorem body” into “independently proved theorem,” or the unchanged source-tree pin into a new mathematical discovery.

No public repository edits were made as part of this cross-review.
