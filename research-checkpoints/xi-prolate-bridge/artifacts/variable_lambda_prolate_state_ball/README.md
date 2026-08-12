# Variable-`lambda` prolate-state ball artifacts

Finite diagnostic balls only.  The terminal state is `P0_INVALIDATED`.

`lambda5over2_N3/` contains producer and independent replay outputs at 256
and 512 bits for the exact inputs

```text
lambda=5/2, N=3, M=79, K=85.
```

The executable resource contract is
`1 <= floor(lambda^2) <= 10000`; it is serialized in every raw output and
checked independently on replay.  This finite allocation guard is not part of
the analytic theorem and does not provide an unbounded-`lambda` implementation.

The producer uses the normalized-Legendre Jacobi recurrence, real
sine/cosine antiderivatives, and aggregated power sums.  The verifier uses
exact Legendre-polynomial differential-form integration, complex-power
antiderivatives, and direct arithmetic Laurent cells.  It reconstructs and
checks every interface matrix entry before accepting the trial witnesses.

Both paths use FLINT 3.6.0 / Arb transcendental arithmetic.  These artifacts
certify a finite source state and projection-error ball; they do not certify
an asymptotic schedule, a shifted Weil solve, determinant convergence, or RH.
