# Checkpoint 0.68 Ritz projective low-mode determinant gate

This directory records one locked finite point:

- `lambda = 2`, `N = 4`, symmetric low-mode cutoff `M = 2`;
- determinant homotopy parameter `theta = 1`;
- compact diagnostic rectangle parameters `B = 1`, `eta = 1/4`;
- source-normalized 30-mode prolate Galerkin state;
- arbitrary-precision point arithmetic at 40 and 80 decimal digits.

The producer rebuilds checkpoint 0.64 through its live
pole-minus-archimedean-minus-prime source assembly and source-normalized
prolate path.  The verifier imports no checkpoint-0.68 producer and
reconstructs the matrix, state, Ritz shift, parity blocks, full ambient
Fourier cutoff, true-ground diagnostic, and determinant factors through the
independent checkpoint-0.64 replay path.  Neither path reads a cached matrix,
eigensystem, artifact, zeta-zero table, or binary64 parameter.

For the lower two-vector Ritz shift `U=u`, the files check

```text
d <w,B_U w> = r^2,
z = (B_U+hI)^(-1)b,
s xi-kappa = -Wz,
z z* <= A_R(d/r) r (B_U+rI)^(-1).
```

With `Pi_M` the full ambient centered projector and
`K_M=W^T Pi_(M,+) W`, they then reconstruct

```text
||Pi_M(s xi-kappa)||^2 = <z,K_M z>,
H = r tr((B_U+rI)^(-1)K_M),
F = log det(B_U+rI+rK_M) - log det(B_U+rI),
F <= H <= F/log(2),
<z,K_M z> <= A_R(d/r) H <= A_R(d/r) F/log(2).
```

The source response uses the full homotopy `Q+t Pi_M` at
`t=0,theta*r`.  Both parity sectors and the anchor self and cross terms are
retained.  At each endpoint the producer and replay check

```text
det O_t = det A_t m_t = det D_t sigma_t m_t,
```

and the resulting odd-boundary-anchor response equals the direct complement
log-determinant increment `F`.  A complement-only homotopy is not accepted.
The three compact-transform error terms and their Ritz upper bounds are
serialized separately, including the squared low-mode rate scalar.

Selected 80-digit serialized point values are:

```text
d/r                    = 0.00031817276753268308249457940020258025606050945398361349224456837520503585417805912
A_R(d/r)               = 1.0004773604013139606868646445916929668548386533268557923229181659654058166015082
||z||^2                = 0.00095514863116796676302928816843531349725615409905647102296283218418050658406565993
||Pi_M Wz||^2          = 0.00094850859659858471292635207668493957379576974826175968545241780715410561787840909
H                      = 0.66709732054598744373139212115441135889850011946834809605412114287104487079282633
F                      = 0.51141906899341088254996771004737843132348565186814813928622071169047235052677536
F from source factors  = 0.51141906899341088254996771004737843132348565186814813928622071169047235052677094
source-factor residual = 4.4192893778022353356469222422923919680320158114888783649925982601253340867745232e-78
exact compact sum      = 0.025905771352965656343916173278882993582647523255023643560509711287751955678309771
theorem compact bound  = 1.1862649699993762300774894267310327305541226946078500211102074548449059787209456
```

The values are nondirected `mpmath` point evaluations, not interval or ball
enclosures.  Producer and verifier share `mpmath` transcendental arithmetic
and linear algebra, and the 30-mode prolate tail is not enclosed.  This one
finite point proves no unbounded response decay, complete `L2` equation
(5.2), locally uniform determinant convergence, or RH.  The formal status is
`P0_INVALIDATED`.
