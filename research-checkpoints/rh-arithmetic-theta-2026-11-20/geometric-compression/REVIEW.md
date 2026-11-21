# Review and verification record

20 November 2026 · AI-assisted internal review; not external peer review.

## Mathematical review

The root derivation and two separate assistant reviews checked the finite frame inequalities and exact source dictionary. A further review checked the lattice determinant identity, slope signs, trace-dual discriminant/index factors, conditional scalar completion target, singular Schur control, and the weighted packing proof.

One definition was corrected before release: the prime-power ramp is defined for (X\ge1), including its zero extension below the first prime, because the exact Mellin transform integrates from 1. The strict rounding bound remains stated for (X\ge2). The printed order of the source's `BF` arguments was also corrected to match the pinned declaration.

The packing review checked the half-unit cell injection, the coordinate-weight inequality, the tail indices, and the constants (9U), (18U), and ((18U)^{2d}). No further mathematical correction was identified in these reviewed results.

The finite theorem in `FRAME_GEOMETRY.md` permits an aggregate source rank-loss bound. The paper states the simpler sufficient individual bounds and obtains the same constants. The note uses alpha for the frame second-moment constant and kappa for the source rank loss; the paper uses (a) and alpha, respectively. These are explicit local notation choices, not different assertions.

## Source inspection

Source pin: `Deicyde/riemann-hypothesis@712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9`.

The source audit distinguishes actual theorem bodies from proposition interfaces and adapters receiving proof arguments. Inspected facts include the normalized adjoint Gram kernel, the projection definition, dimension and common-scale ties, diagonal-defect conversion, separate ambient row count, eventual quantifiers, weighted packing, and a conditional arithmetic minor-label application.

The audit did not locate and check the ultimate implementation of the `S76` argument. It therefore does not certify the external source's full arithmetic kernel theorem or its RH endpoint. It also does not allege that an implementation is absent. The scalar full-ray analytic criterion in this paper is the earlier project criterion; it is not silently substituted for the external multiplicative-window theorem.

## Exact executable checks

Executed with Python and SymPy 1.14.0:

| Script | Result | Main controls |
|---|---|---|
| `check_frame_geometry.py` | 10/10 pass | Complex noncommuting projections; source and ambient losses; zero-weight normalization; singular pseudoinverse; absence of a spectral-gap conclusion; average versus subfamily control; signed-matrix countercontrol; stable whole-form limits. |
| `check_lattice_bridge.py` | 10/10 pass | Nonorthonormal covolumes; saturation index; Hilbert–Schmidt determinant bound; slope normalization; sharp Gaussian-integer trace-dual example; exact prime encoding; rounding scale; cost cancellation under metric rescaling. |

The JSON reports record exact examples and their qualifications. They validate algebra and normalization. They do not replace the general written proofs or establish any RH-equivalent positivity assertion.

## Manuscript quality check

The LaTeX manuscript compiled in two successful final passes to a 10-page PDF. The final pass had no undefined references, overfull boxes, or compilation warnings. All ten pages were rendered and visually inspected for clipping, missing symbols, and layout. Build intermediates are not included in the research package.

## Explicit unresolved obligations

1. A concrete arithmetic construction and useful bound for the complete lattice metric cost in the scalar completion corollary, with its full-ray quantifiers.
2. Alternatively, an independent arithmetic realization or comparison of the entire Weil/Pick form, including mixed terms and vanishing finite-family error.
3. For a self-contained compression of the external route: the ultimate arithmetic kernel supplier, all embedding/minor normalizations, the dimension window and row count, and uniform control through the whole theta chain.
4. A full external Lean build and dependency/axiom check, if formal verification of that released proof is to be claimed. Lean and Lake were not available in this execution environment; no such replay was performed.

The finite geometry gives a clean exposition of a real module. It does not establish the remaining arithmetic obligations or justify calling this a complete proof of RH.
