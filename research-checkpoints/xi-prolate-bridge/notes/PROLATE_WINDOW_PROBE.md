# Prolate-defined energy-window probe

This note records one finite, non-certified diagnostic.  It defines every
low-energy coordinate before assembling the Weil matrix and never uses a
Weil eigenvector or Weil spectral projector to choose a basis.  It does not
prove an estimate on an unbounded schedule and does not prove RH.

## 1. Correct source-limit normalization

All prolate inputs are spatially even eigenfunctions on
`[-lambda,lambda]`, normalized in `L2(dx)`.  The sign of
`h_(n,lambda)` is chosen to match the locked normalized Hermite value
`h_n(0)`, whose sign is `(-1)^(n/2)`.  This sign matters for labels 2 and 6.

The two source-limit families are equation (29) of the pinned
`CCM-PROLATE-2023` PDF:

\[
 \psi_\ell^+=h_{4\ell}-\frac{h_{4\ell}(0)}{h_0(0)}h_0,
 \qquad
 \psi_\ell^-=-h_{4\ell+2}
      +\frac{h_{4\ell+2}(0)}{h_2(0)}h_2.
\]

The superscript minus denotes Fourier eigenvalue minus one, not spatial
oddness.  At finite lambda the implemented deformation uses integral ratios,

\[
 \psi_{\ell,\lambda}^+
 =h_{4\ell,\lambda}
  -\frac{\int h_{4\ell,\lambda}}{\int h_{0,\lambda}}h_{0,\lambda},
\]

\[
 \psi_{\ell,\lambda}^-
 =-h_{4\ell+2,\lambda}
  +\frac{\int h_{4\ell+2,\lambda}}{\int h_{2,\lambda}}h_{2,\lambda}.
\]

Thus every input has exactly zero integral at the working precision, while
the coefficient of the high-index mode remains fixed to the source-limit
choice `+1` or `-1`.  This is an explicit finite deformation, not a source
theorem uniform in growing indices.

Apply the locked arithmetic map, and only then impose inversion parity:

\[
 k^\pm(t)=\frac{E(\psi)(e^t/\lambda)
                 \mathbin{\pm}E(\psi)(\lambda e^{-t})}{2},
 \qquad 0\le t\le L=2\log\lambda.
\]

No finite-lambda parity is assumed.  The plus projection uses cosine
coordinates in

\[
 e_0,\quad (V_n+V_{-n})/\sqrt2,
\]

and the minus projection uses sine coordinates, equivalently a harmless
global phase times `(V_n-V_-n)/sqrt(2)`.

The comparison anchor is the label-4 plus window.  It is algebraically the
locked P0 state divided by the positive scalar `a4`.  The higher plus windows
are first deflated by `(I-kappa kappa^T)`.  If `W` contains the resulting raw
columns, the basis is the symmetric Gram basis

\[
 B=W(W^TW)^{-1/2}.
\]

Only after `B` is fixed is `Q` assembled from the pole, archimedean, and prime
formulas.  The remaining high basis is obtained by twice reorthogonalizing
canonical coordinate vectors against the anchor and prolate windows.

## 2. An invisible codimension-two corrector

There is a stronger correction than changing the prolate comparison state.
Choose the explicit even smooth bump

\[
 \phi(x)=
 \begin{cases}
  \exp(1-(1-x^2)^{-1}),&|x|<1,\\
 0,&|x|\ge1,
 \end{cases}
 \qquad
 \psi(x)=2\phi(2x)-\phi(x).
\]

Then `psi(0)=1` and

\[
 \int\psi=2\cdot\frac12\int\phi-\int\phi=0.
\]

Put `a=1/(2lambda)`, `psi_a(x)=psi(x/a)`, and

\[
 \widetilde h_\lambda
 =h_\lambda-h_\lambda(0)\psi_a.
\]

This gives

\[
 \widetilde h_\lambda(0)=0,
 \qquad
 \int\widetilde h_\lambda=0.
\]

More importantly, for every `u` in `[1/lambda,lambda]` and every integer
`m>=1`,

\[
 mu\ge 1/\lambda=2a>a.
\]

Every arithmetic sample therefore misses the support of `psi_a`, so

\[
 E(\widetilde h_\lambda)(u)=E(h_\lambda)(u)
 \quad\hbox{throughout }[1/\lambda,\lambda].
\]

The inversion-evenized state and its finite Fourier projection are unchanged
exactly.  At `(lambda,N)=(2,8)`, the correction amplitude is about
`2.28201e-14`, its quadrature L2 norm is about `9.09868e-15`, and all replayed
arithmetic correction samples are exactly zero.

This proves the two algebraic conditions and the state-invisibility identity.
The bounded-variation Mellin extension and the resulting spectral-tail
identity are proved in `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.  What still
requires separate control is passage of the noncompact tail through the
individual pole, archimedean, and prime distributions; the spectral-tail
pairing is not a positive closed Weil form.

For comparison, the optional prolate-only correction

\[
 g_\lambda=h_{2,\lambda}-(I_2/I_0)h_{0,\lambda},
 \quad
 f_\lambda=h_\lambda-c_\lambda g_\lambda,
 \quad
 c_\lambda=h_\lambda(0)/g_\lambda(0)
\]

was also reproduced.  With
`I_n=(-1)^(n/2) chi_n h_(n,lambda)(0)`, its independently checked formula is

\[
 c_\lambda=a_4\frac{h_{4,\lambda}(0)}{h_{2,\lambda}(0)}
 \frac{\chi_0-\chi_4}{\chi_0+\chi_2}.
\]

Recurrence and quadrature prolate assemblies agree in coefficients to about
`1.04e-30` in the pilot.  This route is retained only as a cross-check because
the bump correction preserves the arithmetic state exactly.

## 3. The `(2,8)` window result

Use plus labels 8 and 12 and minus labels 6 and 10.  The raw Gram condition
numbers are about `1.67` and `1.98`; hence no severe Gram degeneracy occurs at
this point.

At the diagnostic Ritz shift `u`, the deterministic prolate low/high split
gives:

| sector | low floor `a` | high floor `G` | `||C||` | scalar `a-||C||^2/G` | exact point Schur floor |
|---|---:|---:|---:|---:|---:|
| even complement | `3.620868e-7` | `5.929900e-1` | `2.662871e-2` | `-1.195423e-3` | `3.6062401246e-7` |
| odd | `1.345851e-9` | `1.417803e-1` | `8.422476e-4` | `-5.002036e-6` | `1.3216376053e-9` |

The exact point Schur complements recover the two tiny shifted sector floors
without defining the windows from Weil eigenvectors.  However, the scalar
operator-norm Schur estimate is negative in both sectors.  This is negative
information about the scalarization, not about the window split.  Keeping the
complete coupling Gram gives the rigorous matrix lower model

\[
 S_0=L-C^*C/G\le L-C^*H^{-1}C.                  \tag{3.1}
\]

Its point floors are

\[
 \lambda_{\min}(S_{0,+})
 =3.57955575357621668\times10^{-7},
\]

\[
 \lambda_{\min}(S_{0,-})
 =1.30078383718587625\times10^{-9}.              \tag{3.2}
\]

Both are positive and close to the exact point Schur floors in the table.
Thus the one-number estimate `a-||C||^2/G` destroys the anisotropic effect,
whereas the matrix criterion already succeeds at this pilot.  The theorem and
its forced-resolvent version are proved in
`notes/PRECONDITIONED_RESOLVENT_PROGRAM.md`.

Only about `3.81121e-4` of the raw residual squared lies in the selected plus
window span.  Nevertheless, the block resolvent solution has

\[
 \|x_L\|\approx6.79977431496\times10^{-4},
 \qquad
 \|x_H\|\approx1.09881372\times10^{-7},
\]

and total norm

\[
 6.7997744037458301259\times10^{-4}.
\]

The block solve and an independent solve of the complete deterministic
complement compression differ by about `3.74e-33`.  Thus the weighted
resolvent response is almost entirely carried by the two explicit plus
prolate windows even though their unweighted residual capture is small.  This
is precisely the energy-weighting phenomenon the preconditioned program was
designed to retain.

Using `D=S_(0,+)`, the exact point high solve as the high parametrix, and the
anisotropic forced-resolvent theorem gives

\[
 T_{\rm AS}=6.920089970753575\times10^{-4},       \tag{3.3}
\]

about `1.8 percent` above the direct point solve.  This is a genuine finite
upper-bound formula in exact arithmetic, but the displayed inputs remain
point approximations rather than outward-rounded enclosures.

There is also a source-defined positive additive concentration model.  If
the uncorrected low source windows have prolate coefficient matrix `A`, its
raw Gram is exactly

\[
 G_{\rm add}=A^*\operatorname{diag}(1-\chi_n^2)A. \tag{3.4}
\]

After finite-state deflation and the same symmetric Gram congruence used for
the physical low basis, the generalized point spectra of the exact Schur
complement relative to `G_add` are

\[
 \{1.45766946493937,3.50565991762816\}
 \quad\hbox{(even)},                              \tag{3.5}
\]

\[
 \{1.64274034835164,3.19914009117426\}
 \quad\hbox{(odd)}.                               \tag{3.6}
\]

For the certifiable-form lower matrices `S_0` rather than the exact point
Schur complements, the corresponding spectra are still bounded away from
one:

\[
 \{1.42305004185896,3.31786316044242\}
 \quad\hbox{(even)},
\]

\[
 \{1.58886977113079,3.17359090232018\}
 \quad\hbox{(odd)}.                               \tag{3.7}
\]

Thus `S_(0,+)-G_add,+` and `S_(0,-)-G_add,-` are both positive at the
pilot.  For two windows this can be checked without eigenvalue
scalarization by positivity of one diagonal entry and of the `2 by 2`
determinant.

This close two-sided comparison identifies a concrete anisotropic model for
the low windows.  It does not identify the positive additive Gram with the
signed Weil form.  Formula (3.4) uses the uncorrected prolate representatives;
the state-invisible origin bumps change additive leakage, so a corrected-lift
version must retain every bump cross term.

### 3.1 Growing-window stress at `(2.25,12)`

Keeping only the two labels in each sector is not stable at the next
intermediate point.  For labels `(8,12)` and `(6,10)`, the `X=0` lower floors
at `(2.25,12)` are approximately `-9.58745e-7` and `-1.05771e-6`, although
the exact Schur floors are positive near `7.07205e-12` and `1.43920e-14`.
This sign pattern is stable at 35 and 70 decimal digits.

Here the prolate parameter is `c=2 pi lambda^2`, so the Shannon index is
`2c/pi=4 lambda^2=20.25`.  Enlarging the deterministic source windows through
that threshold to labels

\[
 (8,12,16,20),\qquad(6,10,14,18)
\]

raises the point high-block floors to about `0.8865` and `0.8282` and makes
the complete matrix lower floors positive:

\[
 6.8603838645\times10^{-12},
 \qquad 1.4145337819\times10^{-14}.              \tag{3.8}
\]

The complete 35- and 60-decimal producers agree on these floors to better
than `1.1e-33`; the independent raw-block replay disagrees with the lower
matrices by less than `9e-36`.  This is a stability check, not an interval
enclosure.

The lower-model generalized spectra relative to `G_add` are contained in
`[0.5434,3.9123]` and `[0.8980,3.8487]`.  The selected even window now captures
about `0.1193` of the residual squared.  Nevertheless its forced `X=0` bound
is about `8.3890e-4`, compared with the direct solve `1.4637e-4`; the final
Euclidean conversion still loses important forcing orientation.

This diagnostic identifies the correct scale of the low-space dimension:
an asymptotic proof must control a family growing through the transition
index, not a permanently fixed pair.  It does not prove that such control is
possible uniformly.

## 4. What remains open

The pilot is a structural diagnostic, not a positivity certificate.  The
remaining obligations include:

1. interval or ball enclosure of the prolate modes, projections, Gram basis,
   and shifted block calculations;
2. analytic positive comparison bounds for the exact Schur matrices, with
   explicit remainders relative to their exponentially small eigenvalues;
3. recursive control of all fixed, transition, and high prolate windows on an
   explicit unbounded schedule;
4. the full odd-sector analogue and preconditioned Galerkin errors;
5. a direct explicit-form estimate for the combined noncompact tail,
   including endpoint and regularization control for the pole,
   archimedean, and far-prime terms.

The first reproducible point artifact is
`artifacts/prolate_window_probe/lambda2_N8_dps30.json`; the two-window failure
and growing-window follow-up are the `lambda2p25_N12_*` artifacts in the same
directory.  The implementation and tests are `src/prolate_window_probe.py`,
`src/anisotropic_schur.py`,
`verifier/anisotropic_schur_replay.py`, and the corresponding test modules.
The overall repository state remains
`P0_INVALIDATED` for the previously recorded pinned-source inconsistencies.
