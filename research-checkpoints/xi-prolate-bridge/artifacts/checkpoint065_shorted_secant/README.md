# Checkpoint 0.65 graph-shorted secant artifacts

These files are finite arbitrary-precision point diagnostics at the locked
pilot point

```text
lambda = 2
N      = 4
T      = 1
dps    = 40 and 80
```

The producer rebuilds the exact finite Weil matrix, source-normalized prolate
state, limiting arithmetic state, and fixed-window operator through the
checkpoint-0.64 source path.  The replay independently rebuilds those objects
through the verifier's source formulas, differential-form prolate quadrature,
closed Si/Ci time-band formula, and incomplete-gamma limiting-state projection.
The two paths share `mpmath` transcendental arithmetic and linear algebra.

At 80 digits, the regularized one-step Feshbach split is

```text
delta_r                         7.9319998056222095e-5
delta_r / (epsilon + r)         1.8999596792637329e-1
rank-one soft contribution      7.8728425740203516e-2
deflated-bulk soft contribution 6.6691545281448067e-5
normalized rank-one reserve     4.8253842994210483
normalized deflated reserve     4.0876256889370325e-3
```

The unregularized split gives

```text
delta_0                         2.6237263052264800e-5
rank-one H0 contribution        4498.6414604334730
deflated-bulk H0 contribution   1.2621396141783000
```

Thus the large reserve at this one pilot is primarily the graph-shorted
rank-one extension, not the deflated bulk.  This is a diagnostic observation,
not an asymptotic estimate.  The scripts also verify the exact determinant,
inverse-Rayleigh, affine-minimum, graph-load, reserve-envelope, and regularized
and unregularized trace identities.

Every producer value is serialized as exact decimal text.  Both precisions
replay successfully; the largest scaled producer/replay discrepancies are
approximately `7.36e-34` at 40 digits and `3.96e-74` at 80 digits.

No interval enclosure, uniform schedule estimate, shifted-sector theorem, or
locally uniform determinant limit is claimed.  The formal state remains
`P0_INVALIDATED`.
