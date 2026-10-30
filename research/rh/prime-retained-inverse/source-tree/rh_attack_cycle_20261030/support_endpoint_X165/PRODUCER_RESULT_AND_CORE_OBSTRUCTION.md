# X=33/2: failed sufficient core, not a new accepted endpoint

## Result first

The one complete producer attempt at exact X=33/2 **fails**. At 1000-bit working precision, the first 2048 permuted core LDL pivots pass, but the final pivot is rigorously negative:

    p_2048 = [-7.56758329019876510251072658097121460147183732155496097540529e-77
              +/- 3.80e-137].

The separate 72-dimensional coefficient-H factor passes. The final whitened-Schur test is not run because the core is not positive. Runtime is 220.995813 seconds. There is no new support acceptance; the accepted reflection-even endpoint stays sqrt(161/10). Independent isolated failure replay is requested separately.

This is a failed **sufficient diagonal-inverse lower surrogate**, not a negative vector of the actual canonical physical Weil form. In particular it is not an upper bound on the true support range of positivity and is not evidence against RH.

## What passed and why this run was justified

One support was selected: X=33/2=16.5, lambda=sqrt(33/2). No support or precision sweep occurred.

- Fresh literal actual-prime entries, active prime-power inclusion, Cbeta and B gates passed.
- Exact phase classification and the global all-separated majorant were independently reviewed.
- Exact quotient-phase grouping lowered the AA Abel constant from7.38615233797 to6.77537554547 while retaining every nonconstant channel.
- The full fresh inverse-step profile includes48 finite bands and its infinite plateau. No moment cache from another X was imported or read; all identity Hurwitz moments were recomputed with the new weights.
- The exact eighth-power prime envelope is3.820104. The actual entire-tail lower floor exceeds0.7061304911532.
- The final grouped 33-mode direct-dense/generator/core/H/Schur gate passed. Independent isolated replay matched every mathematical field and preserved source pins before the complete run was cleared.
- An independent eighth-power enumeration has since matched every nontiming field, including2,630,076 exact path states and19,196 endpoints.

The small gate checks implementation and low-head feasibility, not the full worst direction. It was not treated as support positivity.

## Identified obstruction and one defensible next repair

The failed matrix is

    C=A_actual-K_near* diag(1/d_j) K_near-rem I,

before the additional all-head far charge P*H*P is subtracted. Consequently **changing only retained-phase moments, phase grouping, or Abel charges inside H cannot make this C positive**. The bounded attempt therefore backs out of far-phase polishing. This is a stronger localization than merely observing a negative final whitened pivot.

The existing analytic comparison still proves D_actual>=diag(d_j)>0. However it only yields D_actual^-1<=diag(1/d_j); the latter may be too costly in the near block. A defensible repair is to strengthen this near inverse comparison, while leaving actual entries and the entire already valid far majorant fixed. For example, a newly proved smaller whole-prime envelope P_new=P_old-Delta would imply d_new,j=d_old,j+Delta and reduce every exact near charge. The old far majorant would remain conservative by inverse order.

No sufficient Delta has been established at this new support. The next admissible cheap decision gate should be a fresh exact rational failed-core-direction budget for conditional Delta, followed by **one** targeted stronger prime-norm calculation only if that budget makes it plausible. A blind ninth/higher-power sweep or another full positivity run is not justified by this receipt. Alternatively, a genuinely sharper actual-tail inverse comparison would require a separate analytic design/review; it is not supplied here.

The finite isotropic remainder is part of C. This note does not infer that removing it alone is impossible from the pivot's raw magnitude: such a statement would need a normalized direction or spectral bound. The proved exclusion here is specifically H-only polishing, which cannot change C at all.

## Evidence and preservation

Primary artifacts in this directory:

- `SCALAR_PHASE_GATE.json`, `X165_POWER8_TARGETED.json`;
- `generic_full_inputs.py`, `support_config.py`, `certify_generic_support.py`;
- `GENERIC_SMALL_DENSE_GATE.json`;
- `GENERIC_FULL_EVEN_CERTIFICATE.json` and its terminal log;
- `ALL_SEPARATED_PHASE_METHOD.md`;
- independent clearance/scalar/prime replay evidence in `independent_review/`.

All complete-run source hashes agree before and after. The old accepted X161 repair dependencies are independently hash-checked unchanged. The valid ungrouped preflight and the recovered inexact-ball-equality assertion failure remain in separate preserved directories. No external writes, repository upload, publication, merge or app-route change was made. No permission denial or uncertain external action occurred.
