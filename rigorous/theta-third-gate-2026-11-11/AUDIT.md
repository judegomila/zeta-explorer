# Audit: third theta origin and compensation continuation

## Scope and result

All twelve gates in `run_checks.py` passed in the final integrated replay.
The checkpoint establishes, relative to the immutable project inputs in
`SOURCES.md`:

1. Positive third-origin curvature for every positive triple of canonical
   anchors, including every coalescence and tuples crossing the compact
   versus infinite-tail boundary.
2. Positive `t^6`-normalized limits of both next sources for every positive
   pair of anchors, including coalescence and pairs crossing that boundary.
3. Total nonnegativity of every finite order for the auxiliary Peano
   compensation kernel, variation diminution, and its preservation under
   absolutely convergent finite compositions.
4. An exact equivalence between the next two global source signs and two
   mixed logarithmic-derivative inequalities in one anchor and one spatial
   variable.
5. Persistent failure of the stronger positive higher-source hierarchy
   at sufficiently large first anchors, and a rigorous obstruction to any
   nonzero globally nonnegative constant combination of the two original
   signed source densities.

The remaining two source signs throughout the positive spatial axis are
open. The established real Pick order remains five. This checkpoint does
not prove third full preservation, six-node positivity, arbitrary-depth
canonical preservation, or RH.

## Final integrated verification

Command, run from this directory:

```sh
python run_checks.py
```

The recorded run used Python 3.12.14, SymPy 1.14.0, python-flint 0.9.0,
and mpmath 1.3.0, and completed in 136.779 seconds. The runner rejects
optimized Python mode because assertions are proof gates. It also rejects
different package versions. It accepts a component only after its explicit
success result; one algebra component uses `passed: true`, while the others
use `status: passed`.

| Verification category | Recorded count |
| --- | ---: |
| New exact symbolic checks, including rational positivity checks | 85 |
| Third-origin tail exact rational checks | 32 |
| Source-origin tail assertions | 1,436 |
| New compact-anchor cells | 8,192 |
| New spatial derivative-bound cells | 2,048 |
| New tail Bernstein-coefficient interval checks | 768 |
| Replayed fixed-dependency interval cells | 6,144 |
| Fresh shared positive moment coefficients | 602 |
| Extra independent origin-moment calculations | 2 |
| Rigorous source-span point witnesses | 3 |

The 1,436 tail assertions include interval comparisons and bookkeeping;
they are not 1,436 symbolic identities. The 768 coefficient checks are
included in that assertion count. Other categories also overlap in their
inputs, so the rows are not an additive number of independent tests.

The 85 new exact checks comprise 26 compensation checks, 14 source
criterion identities, 12 next-source algebra identities, 10 third-origin
identities, 17 source-origin identities, and 6 signed-span identities.
Six compensation checks verify positivity of exact rational minors;
the remaining checks verify identities used in the proofs. The all-order compensation
theorem is an analytic argument, not an extrapolation from finitely many
symbolic checks.

### Fresh inputs and precision

The runner recomputes all 602 moment coefficients from the theta kernel.
It shares the freshly calculated Arb objects between the two new compact
certificates; it never reads a stored replay or diagnostic cache as a proof
input. The compact certificates use 384-bit balls on 4,096 closed cells
each. Their positive-coefficient model remainders include the required
anchor derivatives and the deflated series at zero.

The tail routines run after the compact routines, set their own 256-bit
precision, and replay the explicit error estimates. The third-origin tail
replays the earlier global twelfth-derivative certificate on 4,096 cells.
The new source-origin tail proves the global fourteenth-derivative bound
on 2,048 cells plus an analytic spatial tail. Its unbounded anchor range
is mapped to a compact parameter rectangle and certified using 768
Bernstein-coefficient interval checks. No finite anchor cutoff is used
as a substitute for the infinite tail.

The other 2,048 replayed fixed cells belong to the previous second-origin
compact certificate. The two additional independent origin moments feed
the new source-origin tail and the signed-source span certificate.

Every numerical margin quoted in the notes is rounded outward. The
fourteenth-derivative core maximum is recorded using the upper interval
endpoint. The source-origin tail clearly distinguishes its cleared
functions and its anchor-derivative determinant from the unscaled
even-anchor functions and determinant.

### Endpoint and domain checks

- The divided-difference simplex has area one half. Coincident triples
  therefore give `M_xx/2`; the factor is retained in the curvature formula.
- A general pair uses the range of `aR(a)` as its matrix-curve domain.
  Only the actual theta specialization identifies that range with the
  full positive axis.
- Source-origin positivity is proved through monotonicity of a scalar
  ratio on the connected anchor axis. This covers distinct, coincident,
  and split-straddling pairs without a gap between regions.
- The exact two-variable source equivalence includes coalescent anchors.
  Strict increase on distinct anchors alone would not imply a strictly
  positive derivative at every anchor.
- Spatial and anchor endpoint zeros are removed algebraically in the
  even variables before interval evaluation.
- The source comparison has the required finite-step decay: the canceled
  Volterra formula propagates positive theta leading forms and finite-jet
  bounds through the already established pairs. This does not infer lower
  bounds for arbitrary derivative-prefix reciprocals from upper bounds.

## Independent internal review

The main derivations and proof boundaries received separate internal
reviews. The third-origin algebra, matrix criterion, compact and tail
certificates were checked independently of their initial derivation.
The compensation proof was reviewed for nonsmooth-knot regularization,
all-order Wronskians, the Sylvester factor, infinite-endpoint domination,
and the distinction between a fixed operator and successive canonical
source prefixes. The source criterion was checked for orientation,
prefactors, coalescence, and both even-variable deflations. The source
origin tail was reviewed for its global derivative bound, remainder
normalization, parameter rectangle, Bernstein coefficients, and endpoint
coverage. The signed-span obstruction was checked for the common positive
density factor, the positive null vector, and the rank condition.

The resulting domain, normalization, and rounding corrections are
incorporated in these files. These reviews are internal mathematical
cross-checks, not external peer review or formal proof-assistant validation.

## Diagnostics and proof dependencies

The high-precision source probes under `diagnostics/` are explicitly
exploratory. They include 16 samples of the desired source signs and 7
illustrations of the stronger-source obstruction. Precision comparisons
provide numerical consistency checks only. Neither a positive sample nor
agreement between precisions is an input to a rigorous sign certificate.

Five proof helpers are copied byte-for-byte from the immutable PR #53
commit listed in `SOURCES.md`. Their shared origin moments, second-origin
compact bounds, and global twelfth-derivative bound are replayed as
described above. This checkpoint does not claim to re-prove every earlier
analytic theorem or to rerun every earlier certificate. The precise earlier
theorems remain declared dependencies. The two copied diagnostic helpers
are identified separately in the manifest.

`MANIFEST.json` hashes every other committed file in this research lane,
plus the decision record, and records the copied-helper provenance. It
excludes itself to avoid a self-referential hash. The publication process
also compares remote Git blob identifiers with the exact local payload.
The PR records the resulting commit and the separate repository CI status.

## Remaining obligation

With the original `H=C/kappa`, `B=4C''/kappa`, and `N=n_a/kappa`, define

\[
f_H=(H''/H')N_t-N_{tt}>0,\qquad
f_P=N_{tt}-(B''/B')N_t>0.
\]

The next proof target is exactly

\[
f_j(f_j)_{at}-(f_j)_a(f_j)_t>0
\quad\text{for }j=H,P\text{ and all }a,t>0.
\]

The endpoint certificates prove the required positive origin limits;
they do not establish these inequalities on the whole positive quadrant.
Proving them would close the third full-preservation step and give
six-node positivity. RH still requires a valid mechanism at every finite
canonical depth. No literature-novelty claim is made.
