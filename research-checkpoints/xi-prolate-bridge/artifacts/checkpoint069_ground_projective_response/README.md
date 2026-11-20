# Checkpoint 0.69 source-compatible ground-projective response

This directory records one locked finite point:

- `lambda = 2`, `N = 4`, symmetric low-mode cutoff `M = 2`;
- source-normalized 30-mode prolate Galerkin state;
- bordered gauges `(rho,s)=(1,1)` and `(2,1/2)`, with finite secant
  parameter `tau=1`;
- arbitrary-precision point arithmetic at 40 and 80 decimal digits.

The producer rebuilds checkpoint 0.64 through its live
pole-minus-archimedean-minus-prime source assembly and source-normalized
prolate path.  The verifier imports no checkpoint-0.69 producer.  It rebuilds
the source and state through the independent checkpoint-0.64 replay path,
locates the ground by determinant/inertia bisection, and reconstructs the
ground vector and adjugate from direct minors.  Neither path reads a cached
matrix, eigensystem, artifact, zeta-zero table, or binary64 parameter.

At the true simple even ground, the files check

```text
H = Q_+ - mu I,
C = adj(H) = c x x^T,
<kappa,x> = 1,
E_M = ||Pi_M(x-kappa)||^2
    = ((C kappa-c kappa)^T Pi_M (C kappa-c kappa))/c^2.
```

They independently reconstruct the equivalent combined mixed-minor sum and
the singular unbordered response

```text
S_M = partial_t det(H+t Pi_M)|_0 / c,
S_M-k00 = E_M - 2 <(I-Pi_M)kappa,(I-Pi_M)(x-kappa)>.
```

The sign of the high cross term is retained.  A wrong sign is rejected.
The odd source resolvent reconstructs the coefficient-normalized ground and
the cofactor normalization `c` from the odd determinant and boundary data.

For each bordered gauge, literal bordered determinants and direct positive
solves check

```text
E_M = (1+s(q-mu)) Phi_s'(0)/s,
(alpha_0-alpha_tau)/tau <= E_M
    <= (1+tau Lambda_full)(alpha_0-alpha_tau)/tau.
```

The full finite spectral cap is serialized honestly; it is not relabelled a
cyclic cap.  No cap-free asymptotic inference is made.  The exact even and
odd Ritz-shifted Schur gates and their complete finite margins are also
serialized.

Selected 80-digit point values are:

```text
mu                         = 1.6995356490451677145809657508708619852e-9
c                          = 1.4021281413031909749915593905261994003e-6
E_M                        = 0.00094850859659858471292635207668493957380
S_M                        = 1.0009395435002614893418419544295242447
k00                        = 0.99995989200462908441315483421714794169
S_M-k00                    = 0.00097965149563240492868712021237630300
high cross                 = -0.000015571449516910107880384067845681712
even short minimum         = 0.000026170882543996702897406818227335141
odd transverse minimum     = 0.0011560899274609240658779840954862815
odd Schur scalar           = 0.00000024063943252817725167251432905968751
odd shifted minimum        = 0.00000024029715515378054467005870393848378
replay max scaled defect   = 4.7557536713930394522e-75
independent replay gates   = 52 / 52
```

These are nondirected `mpmath` point evaluations, not interval or ball
enclosures.  Producer and verifier share `mpmath` transcendental arithmetic
and linear algebra, literal adjugate minors may be ill-conditioned beyond
this small pilot, and the 30-mode prolate tail is not enclosed.  This finite
point proves no unbounded cofactor-response rate, either shifted-sector sign
on a schedule, complete `L2` equation (5.2), locally uniform convergence, or
RH.  The formal status is `P0_INVALIDATED`.
