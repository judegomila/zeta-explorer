# N=1 weighted modular log-concavity: research checkpoint

This append-only checkpoint records AI-assisted analytic research and interval
replays. It is not human peer review or a machine-formal proof. Historical
internal-review labels in the preserved notes are source claims, not an
additional independent certification by this repository.

For the actual undeformed complete theta profile, each fixed a>0 with the
physical pivots s₀(a), s₁(a)>0 has a strictly log-concave N=1 h-weighted
modular metric density on h>0. The proof keeps the off-diagonal metric term,
uses a universal bound for α>0, and combines interval enclosures on 0≤h≤0.7
with an analytic tail. Positive old pivots are an explicit assumption; no next
pivot is assumed or certified here.

The Gaussian N=2 note is a separate auxiliary-model counterexample. It shows
that generic strong profile log-concavity and positive pivots do not force the
weighted metric density to be log-concave at every degree; it does not assert
failure for the actual theta N=2 case. Neither result proves the integrated
commutator sign, the next Schur pivot, all-degree positivity, or RH, nor do
they rule out theta-specific matrix or correlated estimates.

## Replays

`WEIGHTED_N1_LOGCONCAVITY.md` states the full argument, including complete-orbit
tails and the analytic h≥0.7 estimate. `check_origin_jets_mpfi.py` covers the
origin and `check_universal_alpha_mpfi.py` covers 6,900 interval cells from
0.01 to 0.7. Both were rerun with Python 3.12.14, MPFI 1.5.4 and MPFR 4.2.2:

- Origin: 18.6061 < v′ < 18.8577 and −1.9045 < v″ < 3.4358.
- Universal bound: worst upper endpoint of H* is −0.7240006423838816,
  below the asserted −0.7.

The displayed decimal bounds are outward summaries of the interval output;
the scripts' strict assertions and the analytic tail are the certificate.
`GAUSSIAN_N2_WEIGHTED_NO_GO.md` records the auxiliary Gaussian calculation,
whose exact curvature at y=3/5 is 61/4107>0.
