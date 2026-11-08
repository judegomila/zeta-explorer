# Mathematical and publication audit

Date: 8 November 2026.

## Mathematical scope

The complete theta propagation inequality remains open. This checkpoint
contains analytic results that sharpen the route and exclude specific
unsupported identifications. A positive modular state and an independently
positive logarithmic endpoint model are constructed, but neither is
identified with the full xi spectral response.

## Reviews completed

| Item | Checks and qualifications |
|---|---|
| Modular normalization | Theta differential identities, E2 normalization, kappa/H, parity, and recurrence checked; exact polynomial identities replayed symbolically |
| Volterra energy | Signs proved only on the actual theta trajectory; endpoints and convergence checked; this state energy is not the arbitrary-derivative form |
| Canonical mismatch | Riccati comparison checked independently; signs of the Weyl ratio and fixed real boundary transformations checked |
| Rational cusps | Poisson expansion, nonzero odd-modulus Gauss sum, differentiated leading powers, cross-multiplied identity, and interior accumulation checked |
| Required endpoint | Primary EKT statements read; coordinate rotation, finite-limit inverse, averaged matrix, and nonzero-a.e. Hamiltonian assumption checked |
| Logarithmic prototype | Scaling, weighted-square-norm correspondence, cumulative trace normalization, and canonical continuity independently checked; only leading growth is asserted |
| Operator domains | Dense derivative core, translated graph closure, skew-adjoint full-line multiplier, adjoint support condition, and hypothetical-zero graph mode checked |
| Operator exclusions | Nonsymmetry and nonsectoriality are unconditional; closability iff RH is a domain diagnosis, not an independent proof of RH |
| Gaussian contours | Outer-line bound, inverse-transform factor and sign, good-height grouping, multiplicities, domain differences, and weighted Fubini argument checked |
| Weight threshold | Strictly below and strictly above d proved; equality at d left open; no absolute convergence of individual residue terms asserted |

The endpoint proof received a separate final review. Its small requested
clarification was incorporated: the canonical Hamiltonian is nonzero
almost everywhere. The staging edits also make the Weyl norm mapping
explicit and cross-link the strengthened boundary-normalization result.

The operator note cites only the unconditional existence of critical-line
zeros for its pole-based nonsectorial argument. This fact was checked in
DLMF 25.10(i), including the paragraph after equation 25.10.2.

## Executed verification

Runtime: Python 3.12.14, SymPy 1.14.0, mpmath 1.3.0.

Command, run from this directory without optimized assertion removal:

```bash
python theta_modular_system_20261108.py
```

Exit status: 0. Exact symbolic identities passed. Fifteen comparisons
against separately implemented theta sums at 70-digit working precision
had maximum absolute error `4.2018351e-69` (reporting precision only).

The comparisons have fixed finite sum cutoffs and are normalization
diagnostics, not rigorous truncation certificates. They do not test all
polynomial degrees or certify signs of the target energy. The script's
symbolic assertions check algebra; the mathematical scope of the analytic
proofs comes from the arguments in the four notes.

No application code or existing test behavior is changed. Existing
repository CI, when run on the new PR, is reported separately in its body
and is not described as verification of the RH argument.

## Publication integrity

Base main commit: `942ba1760c4ef54a519750ab91c37a661c31e0ce`.
Base tree: `d94ea0ebf222f4af4c2599d5f094288fe5c49094`.

Only the new directory `rigorous/theta-endpoint-2026-11-08/` and the new
decision `thinking/decisions/2026-11-08-theta-endpoint.md` are included.
Their paths and branch name were checked absent before creation.

`MANIFEST.json` records SHA-256 hashes and sizes for every checkpoint file
except itself. A separate upload manifest is used to compare Git blob
hashes with the uploaded commit before the branch and PR are created.
The PR is a draft research checkpoint for review; no merge is requested.

## Remaining proof obligation

Prove the exact all-polynomial energy inequality, or derive a positive
system with the exact xi Weyl response and valid domains. Matching the
leading logarithm, checking finitely many derivatives, assuming closure
of the natural derivative operator, or omitting contour residues cannot
replace that obligation.
