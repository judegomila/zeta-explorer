# Twin-ladder physics: finite engineered correspondences

This separately reviewed physics exploration does not establish RH, a global zero-free curve, a new physical law, a novelty claim, or an experimental hardware result. Internal independent review is included.

## Results and scope

- `delay/`: an exact ideal passive scattering realization of the attenuated inverse finite Euler ratio, with prime-indexed delays. Finite means finitely many components; ideal delay loops retain infinitely many longitudinal modes. The attenuation and dump ports are part of the model.
- `poisson/`: an exact two-quadrature zero-start Ornstein–Uhlenbeck realization of the finite Poisson covariance, a linear-time variance recurrence, and the triangular/sinc-squared filtering correspondence. Covariance equivalence is not equality of probability laws: the common-Cauchy ensemble has different higher cumulants.
- The completed-xi bridge, full twin pairing, twistor/dual intertwiner, self-adjoint zeta Hamiltonian and infinite-cutoff transfer are not constructed here. The app's additive ladder sum is distinguished from the finite Euler product.

## Reproduce the bounded checks

Use Python 3 with NumPy and SymPy available. From this directory, run:

```sh
sha256sum -c SHA256SUMS
python delay/verify_passive_delay.py
python poisson/check_poisson_ou.py
python audit/portable_independent_checks.py
```

The first author script uses only the standard library. These scripts perform exact algebraic/rational checks and ordinary floating-point finite diagnostics; they are not interval certificates. They write sibling JSON outputs. Run in a disposable copy if preserving the release bytes. The portable independent checker writes a separate portable replay receipt and retains the frozen original audit. Package versions used in the release replay are recorded in replay_environment.json.

## Evidence and provenance

All three final v2 notes and their original review/test receipts are copied without changes. The original audit script and hash manifest are retained as historical evidence; its absolute preparation paths are not needed to run the portable copy. The provenance map connects those historical research-file paths to this release. Preparation-time references to pending review or no publication are historical status, superseded by the included final review and authorized draft PR delivery. No personal data or private conversation is included.

`sources/` contains pinned project source snapshots. The two source sidecars and audit/source_binding.json bind the original app/Euler inputs. Additional Poisson/dyadic source snapshots are pinned to PR12 commit 5a23eaa65afd6a53ad637eaac0ebe625bdb4e1e2. They are included so this separate branch is reproducible without merging PR12. Established prior-art links are in the notes. No first-in-literature claim is made.

No application code, existing proof artifact, deployment, or previous research checkpoint is changed.
