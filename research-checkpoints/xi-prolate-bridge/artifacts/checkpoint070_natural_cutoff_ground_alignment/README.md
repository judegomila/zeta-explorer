# Checkpoint 0.70 natural-cutoff signed ground alignment

This directory records one locked finite point:

- `lambda = 2`, `N = 8`, and the natural centered cutoff
  `M = ceil(lambda) = 2`;
- source-normalized prolate state from a 60-dimensional even Legendre
  truncation;
- arbitrary-precision point arithmetic at 40 and 80 decimal digits.

The producer rebuilds the complete finite Weil matrix through both direct
and split pole-minus-archimedean-minus-prime paths.  It also rebuilds the
weighted-PNT-discrepancy normal form

```text
Q = c_* I + A_tail - T_D
```

with every prime power `1<n<=lambda^2`, including the endpoint, retained.
The prolate anchor, true finite even ground, exact lower two-vector Ritz
shift, both shifted sector signs, literal adjugate, and natural-cutoff
projector are computed live.  No stored matrix, eigensystem, artifact, zeta
zero table, or binary64 parameter is read.

The central response is formed without separating the source inverse.  With
`B_mu` the true-ground complement and `P_L` the low anchor-transverse
projector, the files check

```text
b_D = b_A - b_T,
z_D = B_mu^(-1) b_D,
A_M = ||P_L x||^2 = ||P_L z_D||^2,
S_M-k00 = A_M + |h_M|^2/k00 - 2 Re(h_M).
```

The two large block responses are serialized before subtraction, together
with their signed cross term and the much smaller combined response.  The
same ground action is also reconstructed directly from `A_tail-T_D` and
checked against `(mu-c_*)P_L x`.

The standalone verifier imports no checkpoint-0.70 producer.  It rebuilds
the source through the independent checkpoint-0.64 distributional path,
the prolate state through differential-operator quadrature, the discrepancy
normal form through a separately coded prime-power sieve and translation
kernel, the ground by inertia bisection and a direct principal minor, and the
adjugate by literal cofactors.  Producer values and booleans are used only
for comparison.

Selected 80-digit point values are:

```text
d/r                                      = 7.92705892613007707698e-8
A_M                                      = 4.58694122325858228031e-7
E_M                                      = 4.58694254043295006129e-7
S_M-k00                                  = -2.67149108172262889590e-7
h_M                                      = 3.62921681107778947860e-7
|h_M|^2/k00                              = 1.31717436778098593604e-13
even exact-u complement floor            = 3.60624952552603497126e-7
odd exact-u shifted floor                = 1.32163760512222252759e-9
separate resolved response norm (A_tail) = 1.1770174542123040e6
separate resolved response norm (T_D)    = 1.1770174548895734e6
combined resolved response norm          = 6.772696082992786e-4
resolved triangle-loss factor            = 3.475772248e9
replay max scaled defect                 = 8.56898e-72
independent replay gates                 = 37 / 37
```

These files are nondirected `mpmath` point evaluations, not interval or ball
enclosures.  Producer and verifier share `mpmath` transcendental arithmetic
and linear algebra.  The admitted Gevrey theorem proves the natural cutoff
only beyond a noncomputed asymptotic threshold, and the finite point does not
prove the required `O(lambda^(-1))` signed alignment response, either sector
sign on an unbounded arithmetic schedule, equation (5.2), or locally uniform
convergence.  The formal status is `P0_INVALIDATED`.
