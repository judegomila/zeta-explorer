# Initial findings and route decisions

These are diagnostics used to choose an analytic route.  None is an
all-degree result or evidence that proves RH.

## Why the finite atlas was stopped

Eight low-cost complete-theta regional jobs finished before the priority
change.  Degree 7 reproduced the signed-payment mechanism on 10 of 128 splits
at 4,096 cells and 11 splits at 16,384 cells.  Degree 9 had no certified split
at 4,096 cells but certified the adjacent splits `13/64` and `27/128` at
16,384 cells.  Degrees 11, 13, 15, and 17 had no certified signed-payment split
at 4,096 cells.  These observations can suggest mechanisms, but refining them
cannot establish uniform degree control.

The inherited spatial-tail composition preflight was strengthened with a
valid auxiliary floor `z=170 < pi*exp(4)`.  It passes through degree 17, while
degree 19 still fails the current sufficient composition bound.  That is a
specific analytic-envelope blocker, not a failure of the target inequality.

The cell-count ladder was therefore stopped cleanly; its 65,536 through
16,777,216 jobs are not part of the overnight analytic queue.

## Reflected-operator smoke result

At degree 6, shift `a=1/4`, and 512 Gauss--Legendre nodes, the exploratory
parent-whitened signed minima were approximately

- even: `0.024015749978993025`;
- odd: `0.026363396718192943`.

The commutator/anticommutator numerical ranks were `4/4` in the even block and
`2/3` in the odd block.  Degree-16 runs at 512 and 1,024 nodes agreed on their
minimum relative eigenvalues to roughly 11--12 decimal digits and gave the
same reported ranks.  This supports continuing the displacement-rank search;
it is not an interval certificate.  The multiplication compression is not
exactly self-adjoint and is reported with an explicit adjoint-defect flag.

## Parity-residue smoke result

The exact `A_j,c_j` recurrence and high-precision interpolation worker passed
cross-precision tests. The completed sweep confirms an enormous and
precision-stable even-grade signal at `h=0`. The odd-grade signal instead
decays rapidly through the resolved `N=24` replay. Its `N=32` and `N=40`
numerical replays reach the cancellation floor, so the initially reported
high-degree odd value must not be treated as an asymptotic measurement.

The odd-center decay is now explained by an exact parity identity, not by
extrapolating the finite sweep: every odd-grade combination satisfies a
degree-uniform raw-orbit bound at `h=0`, with a sharper Gaussian tail bound
when its first `N` orbit samples vanish. Away from the center, at `h=1/4` and
`h=1/2`, both parities show strong obstruction patterns before approximate
root residuals overtake the ideal exact-zero tail. This shift structure rules
out paying the modular residue with separate raw pointwise orbit Grams; an
eventual proof must retain the `h` integration and signed cross-orbit
compensation. See `ODD_CENTER_LEMMA.md` and `RESULTS_SUMMARY.md`.

## Promotion gate

A useful numerical pattern must become an exact identity with a fixed
arbitrary index, or a rigorously bounded sequence in the reflected border
recurrence.  Rank growth, bandwidth growth, sign loss, or precision-sensitive
parity behavior rejects an ansatz.  It does not reject RH.

## Euler-symmetrized reference guardrail

The fixed Euler-symmetrized approximant has been eliminated as an automatic
positive reference: an endpoint layer survives at every degree.  Subsequent
factorization or comparison jobs must retain the resulting signed,
degree-dependent error and its correlations.  Positivity of the approximant
alone is not an admissible premise.  This rejects that transfer ansatz, not the
complete-theta reflected contraction.
