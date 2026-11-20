# Audit: proved results, external inputs, and open estimates

Date: 9 November 2026.

## Established in this checkpoint

1. Under the preceding strict three-node hypotheses, positivity of every
   four-node real xi Pick matrix is equivalent to two nonnegative
   Schwarzian numerators of h and j=uh. The reciprocal-divided-difference
   argument proves global sufficiency, including both node orientations
   and the removable-anchor limits.
2. Both numerators are strictly positive for the actual xi function on
   the whole positive axis. A verified real spectral head controls the
   bounded interval; direct gamma and prime-series bounds control the
   unbounded half-line. Four distinct positive nodes therefore give a
   positive definite matrix.
3. The corresponding theta third-derivative moment inequality holds
   strictly. The preceding arithmetic energy inequality now holds for
   every nonzero test using at most four distinct exponential rates
   greater than one half.
4. The full xi quadratic form is an absolutely convergent rational
   reflection energy. The symmetric and antisymmetric components of a
   nonfixed reflection orbit contribute with opposite signs.
5. A verified head with m distinct positive real zero frequencies has
   rank exactly min(N,2m) on N distinct rate nodes. Its nullspace is
   explicitly the rational functions whose numerator is divisible by
   the head zero polynomial. At N=2m+1 there is a nonzero head-null test.
6. A hypothetical off-axis quartet has inertia (2,2) on four distinct
   rate nodes when considered as an individual component. A separate
   conditional interpolation construction shows that any off-axis xi
   zero would yield a negative full-xi finite test using rates in any
   prescribed short interval above one half. No such zero is exhibited.
7. The first canceled numerator has an exact positive symmetrized Stein
   representation. The second sources have two sufficient pointwise
   ratio conditions, equivalently one explicit flux band of positive
   width. The actual flux has not been shown to lie in that band.
8. Both alternating coupled-kernel recurrences and their sufficient
   single-step ratio conditions are exact. The initial theta pair
   satisfies the first set. Preservation of the required conditions is
   open.
9. The natural second numerator or denominator cannot reproduce the
   second response as a constant multiple of its logarithmic derivative,
   even after a rational multiplier. This obstruction is limited to
   that stated class of candidate kernels.

## Mathematical dependencies

The fourth-stage theorem uses the strict three-node theorem at the
immutable PR #48 commit, which in turn uses the two-node theorem of
PR #47. The present PR is based on main and links those preceding proof
files explicitly; it does not rely on them having been merged.

The bounded-interval proof imports Platt--Trudgian's published
finite-height theorem through 3 times 10^12 and the first-zero enclosures
(14,15) and (21,22). These computations were not rerun. The classical
strip controls all higher zeros without assuming their real parts vanish.
The moment bound is obtained from the exact xi value at s=1 in the
preceding note. No explicit high-zero counting bound is needed.

The polygamma series and digamma estimate come from standard gamma
identities; all estimates used here are displayed in the proof. The
large-axis argument differentiates the gamma term with the factor 1/16
at the third derivative of L. Prime-series errors are bounded uniformly
for x at least 100.

The squared-variable theta concavity used for the starting pair is the
established input recorded in the earlier checkpoints. The Stein
representation is derived directly by integration by parts; no
unproved monotonicity of Stein kernels is imported.

Kozlovski--Sands supplies prior context for Schwarzian derivatives and
finite-order matrix monotonicity. Suzuki supplies prior context for
screw functions and Weil positivity. The relevant finite algebra and
conditional witness are proved here; general equivalence statements
are not presented as new.

## Independent review and checks

The fourth-stage transfer was checked separately from the actual sign
proof. Review explicitly addressed the reduced response condition
|xR'|<R: it does not require R'>0. The tangent denominator in the
reciprocal divided-difference proof is positive in both orientations.
Confluent limits and strict inequalities at the anchor are included.

The actual sign proof was independently audited twice. The review
checked conjugate spectral summation, the tail-sector signs, the two
retained head margins, all error factors, the gamma derivative factors,
the uniform bounds for L, xL', x^2L'', x^3L''', and both coordinate
polynomials. Every reported rational margin is checked exactly.

The reflection-energy normalization was checked against the preceding
arithmetic form. The finite-head null vector is kept distinct from the
actual full-xi Schur residual. The conditional witness proof uses only
four nonzero interpolation data, a fixed finite interpolation set, and
an absolutely summable tail bound; its nearby-pole limit is justified
by dominated convergence. These points prevent replacing the unknown
tail by an assumed positive form.

The pair identities, flux expressions, and asymptotic discrepancy were
checked independently and symbolically. The auxiliary examples in the
audit are explicitly labeled: they verify identities and obstructions,
not actual off-axis xi zeros.

## Executable verification

```bash
python -m pip install -r requirements.txt
python run_checks.py
```

The runner executes three exact suites:

- `theta_fourth_checks_20261109.py`: Schur and Schwarzian identities,
  theta conversion, spectral factors, coordinate polynomials, and
  rational proof constants.
- `theta_pair_checks_20261109.py`: alternating reductions, source
  cancellations, flux-band identities, and the asymptotic coefficient.
- `theta_rational_residual_checks_20261109.py`: reflection algebra,
  exact head rank and null test, zero head Schur defect, and an auxiliary
  quartet with an exact negative witness and inertia (2,2).

The output is captured in `checks_replay.json`. These scripts audit
algebra and finite constants. The analytic arguments, convergence
proofs, and imported finite-height theorem are separate proof inputs.
Repository CI is reported in the PR; passing application CI is not
mathematical proof certification.

## Remaining scope

No fifth-stage theorem, arbitrary-order positivity, RH proof, or novelty
claim is made. The exact all-orders energy identity remains signed.
The two next actual-theta ratio inequalities remain unproved, and their
validity at one stage would still not prove their preservation.

The finite-head rank result rules out a uniform coercivity argument from
a fixed finite head. It does not rule out an argument that enlarges the
head with the order and proves adequate quantitative bounds, or an
intrinsic theta or arithmetic estimate controlling the whole form.

The single-kernel obstruction applies to the natural second U and V
with constant and rational normalization. It does not exclude a
different realization or a successful invariant for the coupled pair.

## Publication scope

Base main commit: `942ba1760c4ef54a519750ab91c37a661c31e0ce`.
Base tree: `d94ea0ebf222f4af4c2599d5f094288fe5c49094`.

The checkpoint adds only this research directory and the new decision
record `thinking/decisions/2026-11-09-theta-fourth-stage.md`.
`MANIFEST.json` hashes every other delivered file. Uploaded Git blob
hashes and the PR changed-path set are checked before completion.
