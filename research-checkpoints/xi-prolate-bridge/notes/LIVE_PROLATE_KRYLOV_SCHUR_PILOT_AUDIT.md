# Live projected-prolate Krylov--Schur pilot audit

## 0. Outcome and claim boundary

This audit replays the actual source-normalized projected prolate state at
`lambda=2` for the already existing `N=3` and `N=4` pilots.  It does not use
the eigenvalues, eigenvectors, residual-gap fields, or pass booleans stored in
those pilot files.

The point results are:

1. At `N=3`, both the raw Rayleigh shift `q` and the mandatory two-vector
   Ritz shift `u` fail the odd Schur short.  The three-vector even Krylov
   shift `U_3` makes the short positive.  The three-vector space is proper:
   the next orthogonalization pivot is about `0.00650`, while the full even
   dimension is four.
2. At `N=4`, the raw `q` shift already has a positive transverse floor and
   positive Schur short.  The shifts `u` and `U_3` lower the even upper bound
   and monotonically improve the short.
3. The `N=4` Weil matrix is enclosed by four overlapping Arb outputs from
   two assembly paths and two precisions.  This checkpoint-0.55 replay uses
   only its historical 35-digit projected-state output.  Consequently all
   state-dependent values below are **point diagnostics only**.  The later
   checkpoint-0.56 state balls are a separate replay and do not retroactively
   enclose the Krylov, inverse-load, or Schur calculations in this note.

No zero table, assumed real zero, global Weil positivity, or real-axis
determinant surrogate is used.  No unbounded schedule, equation (5.2), or
locally uniform determinant limit is proved.  The formal project state
remains `P0_INVALIDATED`.

## 1. Locked inputs and independent reconstruction

The standalone replay
`verifier/live_prolate_krylov_schur_audit.py` hard-codes and checks the SHA-256
hashes of:

- the `lambda=2,N=3,dps=35` source-block/prolate output;
- the `lambda=2,N=4,dps=35` source-block/prolate output;
- the `N=4` producer and verifier Arb matrices at 256 and 512 bits; and
- the vendored `CCM-ZST-v1` PDF named by `P0_SOURCE_LOCK.json`.

For each decimal pilot it checks, before doing spectral arithmetic,

- `lambda` is the decimal string `"2"`, not binary64;
- the Fourier convention is `exp(+2*pi*i*n*x/L)`;
- inversion reflection and evenization are present;
- the source domain is `[-lambda,lambda]` with Lebesgue measure and zero
  extension;
- the source prolate normalization is retained;
- the prime sign is minus;
- the inclusive prime-power list is exactly `2,3,4`;
- the displayed von Mangoldt values agree with `log(2),log(3),log(2)`;
- every matrix is symmetric and inversion-reflected;
- the complete matrix is reconstructed as
  `Q = Q_pole - Q_archimedean - Q_prime`; and
- the off-diagonal source Cauchy formula is recovered from
  `b_n=n Q_(n,0)`.

The largest decimal defects in the block and Cauchy checks are below
`2.7e-35` and `1.1e-35`, respectively.  The projected vector is reconstructed
from the serialized Fourier coefficients and independently renormalized;
the cached `kappa` field is used only as a consistency check.

At `N=4`, all four Arb intervals have a nonempty entrywise intersection.
The point calculation uses the exact rational midpoint of that intersection,
not the cached decimal matrix.  The source-block point reconstruction differs
from it by at most `8.21e-33`.  This rigorously authenticates the matrix input,
but it does not create missing balls for `kappa`.

The original decimal state producer and this point replay both use mpmath.
The replay is independent at the formula and control-flow level, but it is
not an independent arithmetic-library check of the prolate coefficients.
The `N=4` matrix balls supply the separate FLINT/Arb path only for `Q` in
this historical replay.  Checkpoint 0.56 later supplies separate prolate
coefficient balls without changing the inputs or claims made here.

## 2. Replayed quantities

Let `Q_+` and `Q_-` be reconstructed in the normalized inversion-even and
inversion-odd bases.  From the independently renormalized projected state
`kappa`, put

\[
 q=\langle\kappa,Q_+\kappa\rangle,
 \qquad b=(Q_+-qI)\kappa,
 \qquad
 {\cal K}_m=\operatorname{span}\{\kappa,Q_+\kappa,\ldots,
 Q_+^{m-1}\kappa\}.
\]

The replay orthogonalizes this chain with two deterministic modified
Gram--Schmidt passes and recomputes

\[
 U_m=\lambda_{\min}(Q_+|_{{\cal K}_m}),
 \qquad U_1=q,\quad U_2=u.
\]

No stored Ritz value is read.  For the odd endpoint chart, let

\[
 y={D\kappa\over\|D\kappa\|},\qquad G=y^\perp,
\]

where `D V_n=nV_n`, and define at any replayed shift `U`

\[
 B_U=P_G(Q_--UI)P_G|_G,
 \quad a_U=\langle y,(Q_--UI)y\rangle,
 \quad c=P_GQ_-y.
\]

The exact finite Schur short and its two solve scales are

\[
 \Phi(U)=a_U-\langle c,B_U^{-1}c\rangle,
 \qquad
 \sigma_{\rm odd}(U)=\|B_U^{-1}c\|,
\]

\[
 \tau_{\rm even}(U)
 =\|(A-UI)^{-1}b_K\|,
\]

where `A` is the even compression to `kappa^perp` and `b_K` is the
corresponding residual coordinate.  The latter is the point version of the
shifted solve appearing in the finite sector bridge.  Both linear-system
residuals and the determinant identity

\[
 \det(Q_--UI)=\det(B_U)\Phi(U)
\]

are replayed at 100 decimal digits.

## 3. Point results

All table entries are rounded displays of independently recomputed point
values.  The column `theta_U` is the least eigenvalue of `B_U`.

### `lambda=2,N=3`

The full even dimension is four, `||D kappa||=0.7890310049`, and the first
four Krylov orthogonalization pivots are

\[
 1,quad 1.2778109273\,10^{-3},\quad
 7.6300265386\,10^{-1},\quad 6.5000382909\,10^{-3}.
\]

Thus the three-vector space is genuinely proper.

| shift | `U` | odd floor minus `U` | `theta_U` | `Phi(U)` | `sigma_odd(U)` | `tau_even(U)` |
|---|---:|---:|---:|---:|---:|---:|
| `q=U_1` | `5.540602507e-6` | `-2.187256503e-6` | `9.675851285e-3` | `-2.202936214e-6` | `8.467754141e-2` | `5.977772729e-2` |
| `u=U_2` | `3.733021911e-6` | `-3.796759068e-7` | `9.677658866e-3` | `-3.823971682e-7` | `8.466172868e-2` | `5.939306076e-2` |
| `U_3` | `9.885027019e-7` | `2.364843302e-6` | `9.680403385e-3` | `2.381788103e-6` | `8.463773090e-2` | `5.881845534e-2` |

The transverse block is positive at all three shifts.  The sign change is
entirely in the inverse-weighted Schur short.  This is a concrete instance
where higher source-defined Krylov lowering helps before cyclic closure.

### `lambda=2,N=4`

The full even dimension is five, `||D kappa||=0.7891328894`, and the first
four Krylov pivots are

\[
 1,quad 5.2902271332\,10^{-5},\quad
 3.0282422391\,10^{-1},\quad 6.0276438777\,10^{-1}.
\]

Again the three-vector space is proper.

| shift | `U` | odd floor minus `U` | `theta_U` | `Phi(U)` | `sigma_odd(U)` | `tau_even(U)` |
|---|---:|---:|---:|---:|---:|---:|
| `q=U_1` | `7.993566124e-8` | `2.234650931e-7` | `1.156073095e-3` | `2.237833996e-7` | `3.773775371e-2` | `3.099783528e-2` |
| `u=U_2` | `6.310359916e-8` | `2.402971552e-7` | `1.156089927e-3` | `2.406394325e-7` | `3.773720541e-2` | `3.097791868e-2` |
| `U_3` | `4.600886059e-8` | `2.573918937e-7` | `1.156107022e-3` | `2.577585153e-7` | `3.773664857e-2` | `3.095771750e-2` |

This pilot does not need higher Krylov lowering to pass the point odd gate:
the `q` gate is already positive.  The lowering behaves exactly as the live
transport predicts: `B_U=B_q+(q-U)I`, while the transverse coupling is
unchanged, so both the floor and the short improve.

## 4. What these pilots do and do not establish

The `N=3` sign change proves only a finite numerical diagnostic about the
stored projected state.  It supports higher Krylov lowering as a legitimate
finite route and shows that the two-vector value can be needlessly weak.  It
does not bound any unseen sector on an unbounded sequence.

The `N=4` margin is small compared with the separate diagonal and inverse
load:

\[
 a_q\approx2.91709\,10^{-6},\qquad
 \langle c,B_q^{-1}c\rangle\approx2.69331\,10^{-6},
\]

whose difference is only about `2.24e-7`.  Therefore decimal agreement of
`kappa` is not a substitute for outward-rounded propagation.  The rigorous
matrix balls alone cannot sign a nonlinear expression whose direction,
shift, and complement all depend on an unenclosed state.

Nothing in the two pilots supplies the asymptotic requirement
`tau_even=O(lambda^(-1/2))` or the weighted convergence in equation (5.2).
Two fixed values at one `lambda` cannot estimate an exponent.

## 5. Exact additional interval input needed

To upgrade the complete `N=4` Krylov--Schur point gate to a finite interval
result, the following propagation is necessary.  Checkpoint 0.56 separately
supplies the first source-state balls, but does not perform all later steps.

1. Consume the independent 256- and 512-bit checkpoint-0.56 balls for every
   Fourier coefficient, projected norm, and normalized state component;
   reusing the historical point vector with artificial radii is forbidden.
2. Propagate those balls to `q`, `b`, and `D kappa`, including a positive
   lower bound for `||D kappa||`.  The later raw-`q` odd-floor replay is only
   a first finite consequence, not this full chart.
3. For each requested Krylov dimension, enclose the Krylov Gram matrix with
   positive pivots and isolate the lowest generalized Ritz root.  This is
   required to prove that `U_3` is a valid upper shift rather than merely a
   point eigenvalue.
4. Construct an interval orthogonal chart for `(D kappa)^perp`, prove the
   shifted transverse block positive by ball LDL or Sylvester data, and
   verify a ball solve for `B_U^{-1}c`.  The resulting outward-rounded upper
   inverse load must lie strictly below the lower endpoint-scalar bound.
5. Independently verify the even solve `(A-UI)z=b_K`, including a positive
   lower bound for `A-UI` and the residual enclosure from equation (4.15) of
   `DIRECT_RH_ATTACK.md`.

For `N=3`, the same list is required together with source-matrix balls,
which currently exist only for `N=4`.  Until those data exist, the honest
classification of every number in Section 3 is point diagnostic.

## 6. Replay

Run

```text
python3 verifier/live_prolate_krylov_schur_audit.py
python3 -m unittest tests.test_live_prolate_krylov_schur_audit -v
```

The adversarial tests reject a changed prime sign, an omitted endpoint prime
power, a changed Fourier sign, binary64 coefficient input, a broken inversion
reflection, or any locked-input hash mutation.  A separate regression mutates
all cached spectral numbers and pass booleans and verifies that the replayed
gates are unchanged.
