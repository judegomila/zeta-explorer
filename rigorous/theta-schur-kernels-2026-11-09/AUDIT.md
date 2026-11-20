# Audit, proof inputs, and remaining scope

Date: 9 November 2026.

## Established in this checkpoint

1. The first exact Schur reduction admits strictly positive even numerator
   and denominator kernels after cancellation. The denominator kernel
   strictly decreases, and the two kernels satisfy an exact positive
   decomposition of the integrated theta kernel.
2. Given the preceding strict two-node theorem, all three-node real Pick
   matrices are PSD exactly when two scalar curvatures have the stated
   signs. Strict signs give PD for every three distinct positive nodes.
3. Both signs hold for the actual xi response over the full positive
   axis. The sector argument proves one sign; a finite real head and a
   controlled unknown tail prove the other on a bounded interval; gamma
   and prime-series estimates complete the unbounded interval.
4. The resulting strict theta mixed-moment inequality is an exact
   corollary for the actual kernel, with all scale factors displayed.
5. The actual Schur defect has a convergent gamma square factorization
   plus a signed pole/prime contribution. Combining the latter gives a
   compensated-count integral with justified boundary terms.
6. The three-node theorem proves the resulting energy inequality for
   every nonzero finite exponential combination with at most three
   distinct rates greater than one half.
7. Exact auxiliary calculations show that generic ordinary and
   squared-variable kernel log-concavity can fail already at the third
   Pick stage. An integer certificate separately proves that the
   compensated prime count changes sign.

## What is still open

No fourth-stage or arbitrary-order actual-xi Pick theorem is proved here.
The complex-domain positive-realness of a ratio of positive integral
transforms is not inferred. No intrinsic kernel class has been shown
both to imply the needed energy signs and to survive every reduction.
The all-orders normal-family construction from PR #47 therefore remains
conditional on its missing positivity hypothesis.

The theorem is a finite-order consequence of existing finite-height zero
information. It is not an extension of the verified zero height and does
not furnish an independent proof of that imported finite theorem. No RH
or novelty claim is made. The second reduced pair in README is an exact
formula and a follow-up target, not an asserted positive-kernel theorem.

## External inputs and their role

- The positive theta kernel and its squared-variable log-concavity are
  taken from Csordas, arXiv:1309.0055v2, with the scale convention stated
  in the notes. The preceding two-node covariance proof is linked at the
  immutable PR #47 commit.
- Platt--Trudgian's published rigorous verification through height
  3 times 10^12 is used as a theorem. It makes the finite head real.
  The computation was not rerun. Unknown higher zeros remain in the
  signed tail and are bounded using only their strip location.
- The first-zero intervals (14,15) and (21,22) and the ordering of those
  zeros are imported from published rigorous zero-isolation examples.
  FLINT documents isolation and counting and gives enclosing intervals;
  Odlyzko's first-zero table independently agrees. No new zero-isolation
  run is claimed.
- The genus-zero product for xi in the squared coordinate, the
  classical zero strip, and standard gamma/Euler-product formulas are
  used explicitly. The proof obtains its reciprocal-moment bound from
  the exact value at s=1, so no explicit zero-counting estimate is needed.
- Suzuki's arithmetic-to-xi representation supplies established context.
  The finite exponential energy identities are derived directly from
  the exact gamma and Euler-product split, with absolute convergence.
- The recent Sra papers are discussed only to distinguish related
  positivity statements. Neither is an input to the three-node proof,
  and neither paper's interval computations were replayed here.

## Independent mathematical review

The Green-function normalization, cancellations at both real anchors,
crossing-point positivity argument, and exact kernel decomposition were
checked independently. The strict decrease of the denominator kernel
does not become an unsupported sign claim for the numerator derivative.

The Schur congruence, tangent-line reduction, strictness at removable
anchors, and both curvature conversions were independently checked. The
compact-interval proof was reviewed by two additional derivations. They
checked the representative-zero convention, conjugation of the sums,
normalization at u=1/4, positivity of the omitted tail terms, coefficient
8 in the pairwise variance, and the tail constants. The large-argument
gamma proof was derived and cross-checked separately.

The gamma and pole factorization identities were checked by algebra and
by the boundary-storage calculation. Absolute convergence requires all
exponential rates greater than one half; this domain is kept throughout
the arithmetic note. The actual residual constraints are recorded and
are not replaced by a zero initial-value condition.

The auxiliary kernel obstruction was independently rederived. Its
negative third-order coefficient, confluent determinant, and quartic
perturbation are exact analytic arguments. It is not a negative direction
for the actual theta kernel.

## Executable verification

```bash
python -m pip install -r requirements.txt
python theta_schur_checks_20261109.py
```

The script checks symbolic identities for the Schur complement, curvature
conversion, both kernel pairs, theta scaling, gamma squares, pole boundary
term, and auxiliary Taylor coefficients. It verifies the compact and
large-argument proof margins with exact rational arithmetic. It also runs
the integer compensated-count certificate. No floating-point grid is used
as a proof of a continuum inequality.

The captured output is in `theta_schur_checks_replay.json`. External
finite-height zero verification is an imported mathematical input, not
part of this replay. Repository CI is reported separately in the PR and
is not a mathematical validation service.

## Publication scope

Base main commit: `942ba1760c4ef54a519750ab91c37a661c31e0ce`.
Base tree: `d94ea0ebf222f4af4c2599d5f094288fe5c49094`.

Only this new research directory and a new decision record are added.
The earlier research branches and application code are not edited.
MANIFEST.json records the other files in this checkpoint. Uploaded blob
hashes and the changed-path set are verified before reporting completion.
