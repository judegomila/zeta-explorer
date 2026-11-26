# Review and verification record

**Version 0.2 · 20 November 2026 · AI-assisted internal review; not external peer review.**

## Mathematical review

The earlier frame/projection, singular Schur and lattice/trace-dual proofs remain part of the paper. This revision adds complete proofs of CM minor separation, the minor-label packing estimate without a support factor, exact logarithmic costs, the rank/prime-window calculation, exact complete-cost minimization, the scalar/lattice equivalence and its RH dependencies, a quantified mesh bridge, and a C² convex-window obstruction.

Separate assistant reviews checked the arithmetic and completion derivations. The coordinating review checked the revised LaTeX statements and proofs and applied five precision improvements: explicit positive rank in the unrestricted minimum, root-discriminant assumptions in the coarse cost, fixed nonnegative mesh constant, covolume notation, and the correct distinction between a source file and a theorem namespace.

The review retains necessary qualifications:

- The packing improvement sums **distinct label sequences**. Coordinate zero is fixed at one and the tail vanishes; object multiplicities need a separate bound. The case `j=0` is covered.
- Constant 18 was already present in the source's packing proof. No historical novelty is claimed.
- The determinant cost is invariant under arbitrary metrics; the Hilbert–Schmidt upper cost is invariant under uniform rescaling and can vary with anisotropy.
- The unrestricted lattice target is an RH-equivalent reformulation. Its independent arithmetic hypotheses have not been proved.
- The counterexample is C² and globally Lipschitz with a convex uncentred ramp. It challenges a generic window-to-full-ray shortcut, not the source's special analytic window theorem.
- The fixed analytic level and averaged function remain fixed even if an auxiliary arithmetic family depends on epsilon.

Detailed records: [arithmetic review](CROSS_REVIEW_ARITHMETIC.md), [completion review](CROSS_REVIEW_LADDER.md), and [source review](CROSS_REVIEW_SOURCE.md). These are internal checks by collaborating assistants, not independent human refereeing.

## Source inspection and reproducibility

At `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2`, actual bodies supplying generic S76, selected Main off-diagonal estimates, family construction and the character-window endpoint were located. The map's 30 source-file fingerprints and 47 declaration locations were independently rechecked. Its 48 edges describe explicit source applications, record transport or declared roles; they do not constitute a compiled proof graph.

The root read the actual selected closed-hypothesis constructor, off-diagonal supplier and fixed-level window endpoint. The deep theorem and implicit-instance closure was not independently validated. The source tree was compared with the earlier pin and found identical.

The read-only snapshot script verified all tracked Lean file bytes and parsed an acyclic project import graph with 175,187 files reachable from Main. The extra Challenge file is outside that closure and contains intentional placeholders. No scanned admission/unsafe keywords were found in the parsed Main closure. The lexer self-tests passed. External package contents, elaboration, proof terms, axiom closure and kernel replay are outside this static audit.

## Exact executable checks

The following were executed successfully from the revised public checkpoint, using Python and SymPy 1.14.0 where needed:

| Checker | Actual result | Scope |
|---|---|---|
| `check_frame_geometry.py` | 10/10 | Noncommuting projections, trace losses, singular pseudoinverse, whole-form limits and negative controls. |
| `check_lattice_bridge.py` | 10/10 | Covolumes, saturation, determinant bound, slope and trace-dual normalization, exact rounding and uniform rescaling. |
| `check_ladder_completion.py` | 21/21 | Exact cost/slack, metric choices, prime rounding, tail antiderivative and the C² window obstruction. |
| `check_arithmetic_compression.py` | All checks passed | 252 product cases / 26,910 points; injectivity negative controls; 180 Gaussian minors and 179 nonzero differences; 3,321 exponent identities; 10,560 rational cost comparisons; 711 dimension cases. |
| `audit_source_snapshot.py --self-test` | Passed | Comment/string masking, import recognition and lexical control cases. |

The JSON reports contain the finite results. Universal mathematical statements rest on the proofs, not on enumeration. No checker here verifies RH or the external formalization.

## Manuscript quality

The revised manuscript compiled in two successful final passes to **15 pages**, with no undefined references, overfull boxes or compilation warnings on the final pass. All 15 pages were rendered and visually inspected; the new packing, equivalence and source-route pages were additionally inspected at full rendering size. No clipping, missing symbols or unresolved citations were found. Build logs and render intermediates are excluded from the public package.

## Remaining claim boundary

The [proof-obligation register](PROOF_OBLIGATIONS.md) and [verification protocol](VERIFICATION_PROTOCOL.md) control future status changes. A specified arithmetic complete-cost bound or a direct whole-form twin-ladder comparison is still unproved here. Deep source validation and independent formal replay remain outstanding.

No Lean build, export, axiom-closure check or independent kernel replay was performed. The source's reported large-resource build and judging workflow could not be reproduced in this session's environment. The release records a concrete protocol and acceptance artifacts rather than claiming a partial operation as a complete verdict.
