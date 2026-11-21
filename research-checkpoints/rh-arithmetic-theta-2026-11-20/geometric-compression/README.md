# Arithmetic lattices and twin-ladder geometry

Jude Gomila research program · 20 November 2026

## Result

The [10-page manuscript](RH_Geometric_Compression.pdf) gives complete proofs of a finite geometric module and a precise conditional arithmetic completion target. It is **not a completed proof of RH**. The source's arithmetic family estimates and the required cost bound have not been independently established by this continuation.

The useful compression is concrete: normalize the source's actual period maps to obtain a Gram kernel, control the frame energy lost under two projections, and separate the arithmetic index of an integral map from its metric cost. A further packing lemma makes an arithmetic mechanism transparent: integrality prevents embedding vectors from clustering multiplicatively, and weighted geometric packing bounds their contribution.

The twin-ladder model enters in two precise ways. Its Schur residual would be a squared distance once the complete target form is independently realized by arithmetic maps. Its prime-power ramp already has an exact scalar expression and can be encoded in an explicit integer with square-root rounding error. Neither encoding by itself supplies the missing arithmetic saving.

Read the [public app research page](https://exploreriemann.com/#/rh-arithmetic-theta-geometry). The analytic endpoints used in Section 6 are available in the [earlier manuscript](../release-v0.1/RH_Arithmetic_Theta_Completion.pdf) and its [editable source](../release-v0.1/RH_Arithmetic_Theta_Completion.tex); the [ramp derivation](../twin-ladder-refinement/RAMP_AND_AVERAGING.md) is also public. Historical MathExplorer links record provenance and may require access to the old repository.

## Files

| File | Contents |
|---|---|
| [RH_Geometric_Compression.pdf](RH_Geometric_Compression.pdf) | Ten-page paper with statements, proofs, source comparison, and explicit completion conditions. |
| [RH_Geometric_Compression.tex](RH_Geometric_Compression.tex) | Editable LaTeX source. |
| [FRAME_GEOMETRY.md](FRAME_GEOMETRY.md) | Full frame theorem, source dictionary, singular Schur formula, limiting criterion, and countercontrols. |
| [LATTICE_AND_TWIN_LADDER.md](LATTICE_AND_TWIN_LADDER.md) | Covolume/slope accounting, arithmetic trace-dual bound, product-formula normalization, and prime-ladder encoding. |
| [SOURCE_DEPENDENCY_AUDIT.md](SOURCE_DEPENDENCY_AUDIT.md) | Actual source suppliers, constants, quantifiers, packing proof, and the precise remaining inspection boundary. |
| [REVIEW.md](REVIEW.md) | Review scope, validation, and unresolved obligations. |
| [check_frame_geometry.py](check_frame_geometry.py) | Ten exact finite geometry checks. |
| [check_lattice_bridge.py](check_lattice_bridge.py) | Ten exact lattice and arithmetic normalization checks. |
| [FRAME_GEOMETRY_CHECKS.json](FRAME_GEOMETRY_CHECKS.json) | Recorded frame check results. |
| [LATTICE_BRIDGE_CHECKS.json](LATTICE_BRIDGE_CHECKS.json) | Recorded lattice check results. |
| [requirements.txt](requirements.txt) | Symbolic-check dependency. |
| [SHA256SUMS](SHA256SUMS) | Checksums of the files in this continuation. |

## What is proved

1. **Frame energy survives controlled deletions.** For actual maps with the stated diagonal and pairwise Gram bounds, the proof reproduces the source's `AF` and `BF` constants. It also proves the intermediate second-moment inequality before the extra ambient-dimension factor is inserted. The source-projection loss only needs an aggregate rank bound. Positivity comes from the Gram representation before the moment argument; no spectral gap is asserted.
2. **The Schur residual is a squared distance.** The formula uses a Moore–Penrose inverse and remains valid with a singular even block. A separate whole-form limit handles approximation without controlling perturbed inverses.
3. **Arithmetic index has a full metric cost.** The determinant identity retains the saturation index and both lattice covolumes. The Hilbert–Schmidt bound gives an exact target for an arithmetic slope argument. A trace-dual lower bound retains the discriminant squared and lattice-index factors.
4. **Multiplicative separation gives weighted packing.** A half-unit cell argument proves the source's packing bound, including its stronger intermediate constant. This proves a geometric consequence of separation; the application must establish the correct embedding and integral-minor hypotheses.
5. **The ladder has an explicit integer encoding.** For the prime-power ramp and an integer parameter (m), (m) times the ramp minus the logarithm of the constructed integer is bounded by the Chebyshev prime sum. Taking (m=\lceil\sqrt X\rceil) makes the normalized rounding loss (O(\sqrt X)). This is an elementary encoding, not a derivation of the external theta-chain length.

## What remains open in this synthesis

The scalar route needs independently constructed arithmetic lattices and maps whose complete metric cost bounds the encoded prime sum by its main term plus (O_\varepsilon(X^{1/2+\varepsilon})), for every fixed (\varepsilon>0) on a sufficiently large full ray. The paper states this target with all normalization terms. A one-dimensional multiplication map merely makes the lattice inequality an equality and provides no saving.

The alternative positivity route needs independently constructed arithmetic maps matching the complete Weil/Pick form, including all mixed terms, with errors tending to zero for each fixed finite test family. The source's positive frame has not been identified with that different target form.

The source audit is pinned to [Deicyde/riemann-hypothesis at 712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9](https://github.com/Deicyde/riemann-hypothesis/tree/712a6aef8fe265fb6f3a5fa1f3101a017aec8fe9). It traces actual theorems converting kernel estimates into `LinkS`. The inspected higher assembly receives `PeriodFamilyStatement` as `S76`; its ultimate implementation and full import closure were not checked here. This is an inspection boundary, not evidence of a source gap. The dimension window, separate ambient row count, and eventual family uniformity remain explicit.

## Reproduce the finite checks

From this directory, with the dependency in `requirements.txt` installed:

```sh
python check_frame_geometry.py
python check_lattice_bridge.py
sha256sum -c SHA256SUMS
```

Both scripts pass all ten checks. General proofs are in the paper and notes; finite examples do not prove the general theorems. These scripts do not verify RH, the analytic endpoint proofs, or the external Lean import graph. No Lean replay was performed.

The original release and the earlier twin-ladder refinement are preserved. No novelty claim is made for standard frame inequalities, Schur geometry, lattice determinant identities, or the product formula. The value of this continuation is the explicit compression, normalization, and exact connection to the project's remaining arithmetic target.
