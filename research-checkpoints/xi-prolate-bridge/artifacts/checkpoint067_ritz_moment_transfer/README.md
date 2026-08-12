# Checkpoint 0.67 Ritz-moment transfer

This directory records one locked finite point:

- `lambda = 2`, `N = 4`, `T = 1`;
- source-normalized 30-mode prolate Galerkin state;
- arithmetic limiting-state cutoff `32` inherited from checkpoint 0.64;
- arbitrary-precision point arithmetic at 40 and 80 decimal digits.

The producer rebuilds the complete pole-minus-archimedean-minus-prime Weil
matrix, source-normalized prolate state, and fixed-window operator through the
checkpoint-0.64 live path.  The verifier imports no checkpoint-0.67 producer
and reconstructs the objects through the independent checkpoint-0.64 source,
differential-prolate, closed-Si/Ci, and incomplete-gamma path.  Neither path
reads a cached matrix, eigensystem, or zeta-zero table.

For the exact lower two-vector Ritz value `u`, put

```text
d = q-u,
B_u = P_(kappa^perp)(Q_+-uI)P_(kappa^perp),
delta = d/r.
```

The run checks the exact Ritz moment `d<w,B_u w>=r^2`, the Feshbach ground
diagnostic, the automatic ridge `0<=u-mu<=rho(d,r)<=r`, and

```text
z z* <= A_R(delta) r (B_u+rI)^(-1).
```

It evaluates both the fixed-window observation `K_T` and the identity:

```text
H_K = r tr((B_u+rI)^(-1)K),
F_K = log det(B_u+rI+rK) - log det(B_u+rI),
F_K <= H_K <= F_K/log(2),
<z,Kz> <= A_R(delta) H_K.
```

Representative 80-digit point values are approximately:

| quantity | value |
|---|---:|
| `d/r` | `0.000318172767532683` |
| `A_R(d/r)` | `1.000477360401314` |
| `||z||^2` | `0.000955148631167967` |
| `H_(K_T)` | `0.0787783596798519` |
| `F_(K_T)` | `0.0758292567878547` |
| `<z,K_T z>` | `0.000106522199936584` |
| `H_I` | `0.670383014089719` |
| `F_I` | `0.513574324085855` |

The artifact also serializes the pointwise unrestricted envelope at
`sigma=rho`, using the disjoint spectral partition `(0,d)` and `[d,infinity)`.
At this pilot the strict low-band count is zero.  Tests separately include a
low-band example and reject coefficient one and arbitrary non-Ritz shifts.

All values are nondirected point evaluations.  They are not interval or ball
enclosures, the 30-mode prolate tail is not enclosed, and producer and replay
share mpmath transcendental arithmetic and linear algebra.  The finite
transfer proves no source response decay on an unbounded schedule, equation
(5.2), complex-strip convergence, locally uniform determinant convergence,
or RH.  The formal status remains `P0_INVALIDATED`.
