# Checkpoint 0.66 finite increment response

This directory records one locked finite point:

- `lambda = 2`, `N = 4`, `T = 1`;
- source-normalized 30-mode prolate Galerkin state;
- arithmetic limiting-state cutoff `32` inherited from checkpoint 0.64;
- decimal point arithmetic at 40 and 80 digits.

The producer rebuilds the source matrix and fixed-window operator through the
checkpoint-0.64 live path.  The verifier independently rebuilds them through
the checkpoint-0.64 replay path, including the distributional matrix formula,
differential-form prolate quadrature, closed Si/Ci time-band formula, and
incomplete-gamma limiting projection.  It does not import the checkpoint-0.66
producer or read a cached matrix, eigensystem, or zeta-zero table.

For each of the raw Rayleigh shift `q` and the lower two-vector Ritz shift
`u`, the artifact forms

```text
B_U = B_q + (q-U) I,
A_U = B_U + r I,
X_U = r A_U^(-1/2) K_T A_U^(-1/2),
S_U = tr(X_U),
F_U = log det(A_U+rK_T) - log det(A_U).
```

At the fixed homotopy endpoint `theta=1`, it checks

```text
F_U <= S_U <= F_U/log(2).
```

The canonical limiting-state secant further gives the Schur decomposition

```text
F_U = G_U + J_U,
S_U = H_bulk,U + H_graph,U,
```

with the bulk and nonlinear graph bounds

```text
G_U <= H_bulk,U <= G_U/log(2),
exp(J_U)-1 <= H_graph,U <= 2(1-exp(-J_U)).
```

Representative 80-digit point values are approximately:

| shift | `S_U` | `F_U` | `H_graph` | `H_bulk` |
|---|---:|---:|---:|---:|
| `q` | `0.0787951172855` | `0.0758447905407` | `0.0787284257402` | `0.0000666915452814` |
| `u` | `0.0787783596799` | `0.0758292567879` | `0.0787116681595` | `0.0000666915203325` |

The lower two-vector Ritz shift is reconstructed from the live residual:

```text
u = 0.0000000631035991579360750153536284...
q-u = 0.0000000168320620784059191308070823...
```

Both shifted even-complement and odd-sector gaps are recorded and positive at
this finite point.

The interpretation of the two rows is deliberately asymmetric.  At `U=q`,
the residual ridge has coefficient one.  For the Ritz shift `U=u<q`, the
Feshbach equation has the extra term `q-U`, so coefficient one is false.
Checkpoint 0.67 proves that the Ritz secant moment supplies the repaired
localized transfer after multiplying the `u`-row response by the explicit
factor `A_R((q-u)/r)`.  This 0.66 artifact does not serialize that factor,
and neither checkpoint proves the required weighted decay on an unbounded
source schedule or the full `L2` equation (5.2).

This checkpoint also does **not** numerically replay the actual-source
Cauchy factors `det O_s`, `m_s`, `sigma_s`, and `delta_s`.  It checks only
the even-block `F/G/J` factorization.  The values are diagnostics only: they
are not outward-rounded intervals, do not control an unbounded schedule, and
do not establish locally uniform determinant convergence.  Producer and
verifier also share mpmath transcendental arithmetic and linear algebra.
