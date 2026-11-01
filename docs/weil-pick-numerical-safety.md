# Weil/Pick numerical safety correction (2026-11-01)

This correction covers the `imp-2440` producer and the `imp-2442` / `imp-2454`
finite-model records. It is not a proof of RH or a new arithmetic certificate.
The original history remains in Git; the records also retain the invalidated
`7,10,0,20` sequence and the producer retains its old odd-margin description,
explicitly separated from current output.

## 1. Odd pole term

For real odd `f_i`, define `H_i = integral f_i(x) exp(-x/2) dx` and
`S_i(z) = integral f_i(x) sin(z x) dx`. Oddness gives
`H_i = -integral f_i(x) sinh(x/2) dx`. Consequently

```
S_i(i/2) = -i H_i,    S_i(-i/2) = i H_i,
h_ij(i/2) + h_ij(-i/2) = -2 H_i H_j,    h_ij = S_i S_j.
```

For the even cosine-product convention the contribution remains `+2 H_i H_j`.
The old unconditional `+2 HH^T` therefore added `4 HH^T` to the intended odd
matrix. Its odd output is invalidated; this does not assert that a correctly
assembled odd block is negative. `H=(1,2)` gives odd `[[-2,-4],[-4,-8]]` and
even `[[2,4],[4,8]]` exactly.

The corrected full Weil sweep has **not** been rerun for this repair. The finite
prime-support identity and even convention are unchanged, but transform tails,
Simpson error, digamma error and roundoff are not rigorously enclosed. The
script's summary now follows the actual finite/convergence flags and tolerance;
it cannot emit the old unconditional positivity paragraph after a failed block.
Neither a floating positive margin nor a floating negative eigenvalue is an
actual Weil certificate or an RH result. The chosen conditioning floor is only
a diagnostic threshold, not a proved error bound or a continuum lower bound.

## 2. Numerical and domain contract

The two Pick records use the same dependency-free helper. It rejects empty,
malformed, nonfinite and non-Hermitian matrices and nodes outside the open upper
half-plane. Known poles are checked before evaluation; thrown or nonfinite
function values fail closed. In particular, the third original node set includes
`8+2i`, exactly the surrogate pole. It now returns `status: invalid` and
`negIndex: null`, never zero.

The scaled Jacobi routine uses a nonzero sign at equal diagonals. It correctly
rotates `[[0,1],[1,0]]` to eigenvalues `[-1,1]`, unlike the old `sign(0)` step.
It checks convergence and eigenpair residuals against the original matrix.
Hermitian real embedding `[[A,-B],[B,A]]` doubles every eigenvalue; the negative
count is halved only if it is even. Invalid/nonconvergent output has no index.

These checks are **floating diagnostics, not rigorous eigenvalue enclosures**.
The retained relative threshold `1e-9 * maxAbsEigenvalue` can hide small negative
eigenvalues. Near-zero values are not certified zeros. A finite sampled index is
not automatically the global negative-square supremum. The full app's two record
assertion arrays continue to exercise safety and finite-model regressions; they
do not prove an arithmetic identification.

## 3. A pole in C+ does not exclude finite negative index

Generalized Nevanlinna kernels are evaluated on the function's regular
meromorphic domain, excluding its poles. Consider

```
m(z) = 1/(i-z) + 1/(-i-z) = -2z/(z^2+1).
K(z,w) = (m(z)-conj(m(w)))/(z-conj(w))
       = 2 (z conj(w)-1) / ((z^2+1)(conj(w)^2+1)).
```

This is one positive rank-one feature minus one negative rank-one feature,
so every admissible finite matrix has at most one negative eigenvalue. At the
regular nodes `2i,3i` it is

```
[[2/3, 5/12], [5/12, 1/4]],    determinant = -1/144.
```

Hence this rational model has exactly one negative square, despite a pole at
`i`. This exact algebra disproves the earlier blanket pole exclusion, not the
following more specific proposition.

### The particular unpaired surrogate still has unbounded negative index

The records' contrast is a sum of positive real point masses **plus**
`1/(8+2i-z)`; it does not move a baseline atom or add the conjugate pole. At any
real `x` away from the baseline atoms, its boundary imaginary part is
`-2/((8-x)^2+4) < 0`. Choose any number `n` of distinct such real points and
nodes `z_j=x_j+i epsilon`. As `epsilon` decreases to zero, the Pick diagonals
`Im(m(z_j))/epsilon` tend to negative infinity, while all off-diagonal entries
remain bounded. For sufficiently small positive epsilon the Hermitian matrix
is strictly negative definite by diagonal dominance. This works for every fixed
`n`, proving unbounded negative index for this **specific** model.

It is this negative boundary behavior, not merely a C+ pole, that proves the
claim. Four finite node sets, especially one containing a pole, do not prove it.
The current finite array is not labeled a complete non-saturation certificate.

## 4. Exact finite models remain valid, but are not actual zero injections

For `m(z)=z^(2k+1)`, the Pick kernel is a polynomial with coefficient matrix the
reversal matrix in the basis `1,z,...,z^(2k)`. Its signature is `(k+1,k)`.
Every finite set has at most `k` negative eigenvalues; a full-column-rank
Vandermonde evaluation attains `k`. The four selected sets have enough distinct
nodes for `k=0,...,3`. This algebra is stronger than the floating diagnostics.
It does not assert attainment on **every** set: for `m=z^3`, the one-node
matrix at `1+i` is `[2]` and has index zero.

For the signed rational model, each positive real atom contributes
`1/((t-z)(t-conj(w)))`; adding `y^2/(z-x)` contributes
`-y^2/((z-x)(conj(w)-x))`. Distinct negative real atoms disjoint from the positive
support give at most `kappa` negative squares. A square Cauchy evaluation matrix
on `12+kappa` distinct upper-half-plane nodes is invertible, so the upper bound
is attained. In particular, the original 24- and 30-node sets attain the global
index in exact arithmetic. Smaller arbitrary sets need not do so.

The manufactured coordinates `x +/- i*y` are not shown to solve the perturbed
m-function's zero equation. The term `y^2/(z-x)` alone is nonzero at `x+i*y`.
Only the *different* expression `(z-x)+y^2/(z-x)` has numerator
`(z-x)^2+y^2`; the source never identifies its baseline with `z-x`. The records
therefore retain these coordinates as legacy model metadata, not actual
completed-zeta or Hermite–Biehler zeros. An arithmetic kernel identification,
zero-count theorem and independent global positivity argument remain open.

## Checks

Run the focused repair suite without installing dependencies:

```
node --test scripts/weil-pick-safety.test.mjs
```

It covers the parity block, failed/nonfinite summary, Jacobi equal diagonals,
residual/convergence failure, complex Hermitian multiplicities, own-pole and
nonfinite evaluation, the rational counterexample, record assertions and
historical invalidation. Importing the producer for tests does not run its
expensive sweep. Existing app build/full historical checks are separate gates;
a focused pass is not a full application or mathematical certification.
