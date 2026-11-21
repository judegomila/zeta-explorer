# Arithmetic Lattices and Twin-Ladder Geometry

**Version 0.2 · 20 November 2026 · Conditional research compression.** The finite mathematical statements are proved in the manuscript. The deep arithmetic completion and direct twin-ladder comparison remain open in this synthesis. This is not an unconditional RH proof, an external peer review, or a complete Lean replay.

Read the [manuscript](RH_Geometric_Compression.pdf), its [editable source](RH_Geometric_Compression.tex), or the [live research module](https://exploreriemann.com/#/rh-arithmetic-theta-geometry). The earlier [arithmetic-theta manuscript](../release-v0.1/RH_Arithmetic_Theta_Completion.pdf) supplies the sparse Pick and full-ray Mellin–Landau endpoints.

## What this revision accomplishes

| Item | Result and verification level |
|---|---|
| Integral CM minors | Independent proof of mixed-minor integrality and exact CM norm separation; source suppliers located. |
| Minor-label packing | A single product argument removes the extra support factor `2^j`. Distinct labels, fixed coordinate zero and zero tail are essential. |
| Packing cost | Exact logarithmic cost and a smaller explicit coarse exponent, retaining field degree and scale assumptions. |
| Dimension window | Exact rank and the prescribed prime window imply `1/2 ≤ d Γ²/D* ≤ e`. Those arithmetic inputs remain necessary. |
| Complete lattice cost | Cost equals log index plus nonnegative singular-value slack. Its unrestricted minimum is exactly `log Q`. |
| Completion target | The unrestricted lattice condition is equivalent to the full-ray prime-ramp criterion, hence to RH with the stated analytic dependencies. A specified arithmetic family still needs an independent estimate. |
| Window boundary | A quantified mesh condition suffices; a C², Lipschitz example with convex uncentred ramp shows that arbitrary large windows alone do not. |
| External suppliers | Generic S76, selected Main off-diagonal construction, family constructor and character-window endpoint are located at source-body level. Deep verification is outstanding. |

The constant 18 was already present inside the source's packing proof. The improvement is removal of the support split and explicit cost accounting; no historical novelty claim is made.

## Proofs and audit files

| File | Purpose |
|---|---|
| [FRAME_GEOMETRY.md](FRAME_GEOMETRY.md) | Frame normalization, projections and singular Schur geometry. |
| [LATTICE_AND_TWIN_LADDER.md](LATTICE_AND_TWIN_LADDER.md) | Determinant, trace-dual and prime-encoding derivations. |
| [ARITHMETIC_FAMILY.md](ARITHMETIC_FAMILY.md) | CM minors, improved packing, exponents, dimension window, product formula and covolume conventions. |
| [LADDER_COMPLETION.md](LADDER_COMPLETION.md) | Exact minimum, metric distinctions, RH equivalence, mesh lemma and window obstruction. |
| [S76_CLOSURE.md](S76_CLOSURE.md) | Generic and actual selected-source routes, with retained deep inputs. |
| [S76_CLOSURE_MAP.json](S76_CLOSURE_MAP.json) | 47 declarations, 48 typed source edges and 30 file fingerprints; not a compiled proof graph. |
| [SOURCE_DEPENDENCY_AUDIT.md](SOURCE_DEPENDENCY_AUDIT.md) | Generic kernel dictionary and downstream geometric adapters, updated for v0.2. |
| [PROOF_OBLIGATIONS.md](PROOF_OBLIGATIONS.md) | Proved, located and unresolved statements, with exact acceptance conditions. |
| [VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md) | Formal verification protocol and required verdict artifacts; not an executed replay. |
| [REVIEW.md](REVIEW.md) | Internal mathematical, source and document review. |

## Source pin and static verification

The source is [leanprover-community/riemann-hypothesis at c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2](https://github.com/leanprover-community/riemann-hypothesis/tree/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2). Its `src` tree is byte-identical to the earlier inspected pin `712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`.

The read-only [snapshot](SOURCE_SNAPSHOT.json) verifies tracked source bytes, an acyclic parsed Main import closure of **175,187 Lean files**, and no occurrences of its scanned admission/unsafe keywords in that closure. There are 175,188 tracked Lean files overall: the extra `Challenge` module is outside Main's closure and contains the intended comparison placeholders. Imports are not proof-term dependencies or verified theorems. External package bytes, elaboration, axiom closure and kernel verification are outside this static check.

The positively traced Main route uses selected arithmetic data and a character-window theorem. Generic S76 is separately located conditional machinery. No third-party Lean source is redistributed.

## Reproduce the checks

From this directory:

```sh
python -m pip install -r requirements.txt
python check_frame_geometry.py
python check_lattice_bridge.py
python check_arithmetic_compression.py
python check_ladder_completion.py
python audit_source_snapshot.py --self-test
sha256sum -c SHA256SUMS
```

The original frame and lattice scripts each record 10 passing checks; the completion script records 21. The arithmetic script records 252 finite-product cases over 26,910 points, injectivity negative controls, 180 Gaussian-integer minors, 3,321 exponent identities, 10,560 rational cost comparisons, and 711 dimension-window cases. Universal statements rest on the written proofs.

For the separate static audit, supply the exact pinned checkout with the earlier comparison commit present:

```sh
python audit_source_snapshot.py /path/to/pinned/source --output SOURCE_SNAPSHOT.json
```

This reads source bytes and Git metadata without executing Lean. A standard LaTeX installation can build the manuscript with `pdflatex`; build and render intermediates are not included.

## Completion boundary

A direct scalar proof needs **specified arithmetic lattices, maps, integral structures, saturation and independently proved complete cost bounds**. Allowing arbitrary maps and metrics only restates the desired ramp estimate.

A direct twin-ladder positivity proof needs **independent arithmetic Gram maps and a whole-form lower comparison with vanishing error for every fixed Pick prefix**, including mixed terms. No uniform spectral gap is needed, but a positive diagonal or an average does not supply the comparison.

A full compression of the external proof requires validation of its selected suppliers, implicit instances, family uniformity and special analytic window theorem. A formal verification claim additionally requires the recorded build, axiom and independent-kernel verdicts. These are not marked complete here.
