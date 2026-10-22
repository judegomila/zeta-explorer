# Vortex-route collision checkpoint

22 October 2026. Exact identities and conditional certificates, not an RH proof, an improved Newman bound, or a novelty claim.

## Results and remaining gap

- [Determinant obstruction](DETERMINANT_OBSTRUCTION.md): the determinant satisfies an exact evolution law whose source has the wrong sign for the proposed backward positivity argument. Two positive-kernel countermodels separate the limitations of log-concavity and tail control. Neither is the theta kernel.
- [Adjacent-gap certificate](ADJACENT_GAP_CERTIFICATE.md): a rigorous integrating-factor reserve excludes a proposed first collision when the required trajectory bounds are supplied. The proof allows singular exterior contributions at higher multiplicities. Finite-neighbor truncation is safe in the stated direction, but certified tubes and coverage of all candidate collisions are still required.
- The unresolved theta-specific target is strict positivity of the signed oscillatory determinant, or sufficiently strong time-uniform adjacent-gap reserves with tail and boundary control. No such global estimate is proved here.

Classical zero dynamics, Hermite splitting, Laguerre differences, and the de Bruijn–Newman transition are attributed in the notes. These results should not be presented as newly discovered theorems merely because they have been independently derived here.

## Reproduce the included symbolic checks

The scripts require Python 3 and SymPy. The checked environment was Python 3.12.14 with SymPy 1.14.0 and its mpmath 1.3.0 dependency; the isolated requirements file records those package versions and does not change application dependencies.

From this directory, in an environment with the requirement installed:

```sh
python3 check_determinant.py
python3 check_collision_identities.py
```

`check_determinant.py` verifies the symbolic determinant evolution, the quartic-Gaussian transform identity, and its discriminant. `check_collision_identities.py` verifies the heat equation and determinant evolution for the four displayed polynomial/cosine counterexamples. These are exact symbolic regression checks, not proof-assistant verification, a theta positivity certificate, or a numerical sweep of zeta zeros. The analytic arguments and conditional estimates must also be read and checked.

No large data archive is needed for these small checks. This follow-up neither uses nor reconstructs the omitted arithmetic bundle; the parent [artifact-availability correction](../REPRODUCIBILITY.md#artifact-availability-correction-21-october-2026) remains in effect. All files here are covered by the parent `SHA256SUMS` and its verifier.
