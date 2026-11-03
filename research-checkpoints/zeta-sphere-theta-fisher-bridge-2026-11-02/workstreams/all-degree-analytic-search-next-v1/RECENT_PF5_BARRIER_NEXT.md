# The certified PF5 barrier for the complete-theta source

## Scope and outcome

This note records a recent primary-source obstruction that is distinct from
the coefficient and endpoint-Hankel questions already audited in this
workstream. Michalowski's revised 2026 preprint proves that the even
de Bruijn--Newman source kernel

\[
 K_{\rm dBN}(u)=\Phi(|u|)
\]

is not a Polya-frequency function of order five. The result transfers by an
exact dilation and positive scalar to the complete-theta source `psi` used in
this checkpoint. It therefore retires any all-degree argument whose premise is
translation-kernel total positivity of `psi` at order five or higher.

The theorem concerns Toeplitz translation minors of the positive source. It
does not concern the endpoint Hankel moments, the associated Turan profile,
the parallel-sum metric, or the first Xi Laguerre sign directly. It is not a
counterexample to RH.

Primary source: W. Michalowski, *On the Polya Frequency Order of the
de Bruijn--Newman Kernel: Certified Failure at Order Five*, arXiv:2602.20313v2,
<https://arxiv.org/abs/2602.20313>.

## Exact normalization transfer

The present workstream uses

\[
 \psi(h)=\sum_{n\ge1}4z_n(2z_n-3)e^{h/2-z_n},
 \qquad z_n=\pi n^2e^{2h}.
\]

The source uses

\[
 \Phi(t)=\sum_{n\ge1}\pi n^2
 (2\pi n^2e^{4t}-3)e^{5t-\pi n^2e^{4t}}.
\]

Termwise substitution gives the already audited identity

\[
 \boxed{\psi(2t)=4\Phi(t).}                       \tag{1}
\]

Because `psi` is even,

\[
 \boxed{K_{\rm dBN}(u)={1\over4}\psi(2u).}        \tag{2}
\]

Positive scalar multiplication and a positive dilation preserve every
Polya-frequency order: for ordered points `x_i,y_j`, each `r` by `r` minor of
`c f(a(x_i-y_j))` is `c^r` times the corresponding minor of `f` at the ordered
points `a x_i,a y_j`. Thus `K_dBN` is `PF_r` if and only if `psi` is `PF_r`.

## The certified witness and its scaled form

The source's Theorem 1.1 encloses the Toeplitz determinant

\[
 D_5=\det[K_{\rm dBN}(0.01+(i-j)0.05)]_{i,j=0}^4
\]

in

\[
 \boxed{
 D_5\in[-1.8472496\,10^{-9},-1.8472225\,10^{-9}]<0.}       \tag{3}
\]

Using (2), the same witness in this checkpoint's source normalization is

\[
 \det[\psi(0.02+(i-j)0.10)]_{i,j=0}^4=4^5D_5,
\]

so

\[
 \boxed{
 \det[\psi(0.02+(i-j)0.10)]_{i,j=0}^4
 \in[-1.8915835904\,10^{-6},
      -1.89155584\,10^{-6}]<0.}                   \tag{4}
\]

The revised paper reports an outward-rounded 80-digit interval computation,
a proved theta-series truncation bound, and a second determinant evaluation.
It also gives eight further certified negative configurations. A local
100-digit `mpmath` recomputation from the displayed theta series gives

\[
 D_5=-1.847236073442658733310137\ldots\,10^{-9},   \tag{5}
\]

and, after the scaling in (4),

\[
 4^5D_5=-1.891569739205282542909580\ldots\,10^{-6}.
\]

These midpoint values reproduce the source but are not an independent
interval certificate. The rigorous sign claimed here is the primary source's
v2 theorem together with the exact algebraic transfer (1)--(4).

## What the witness retires

For `r>=5`, the definition of `PF_r` includes every minor of order at most
five. Therefore (4) implies

\[
 \boxed{\psi\notin PF_r\quad\hbox{for every }r\ge5.}        \tag{6}
\]

Consequently none of the following can be a valid premise for the live
all-degree trace inequality:

1. total positivity of the translation kernel `psi(x-y)`;
2. a variation-diminishing theorem that requires `psi in PF_infinity`;
3. an all-order positive Toeplitz decomposition of the raw complete-theta
   source;
4. an argument that imports `PF_r` for every finite `r` from pointwise
   positivity, log-concavity, or the modular reflection law.

This obstruction is compatible with the fourth- and fifth-wave conclusions.
The successful finite H5 block is an integrated derivative/Hankel statement,
not a five-by-five translation minor. The paid-Schur target uses the associated
conditional-variance/Turan profile and a corrected global residual, not the
raw translation kernel `psi(x-y)`.

## Distinctions from the other PF statements

Three different uses of “Polya frequency” must not be merged.

- The theorem above concerns the continuous source kernel `psi(x-y)`.
- The recent coefficient results concern Toeplitz minors of the Taylor
  coefficient sequence of Xi. `COEFFICIENT_TAIL_TRANSFER_NEXT.md` already
  shows that those coefficient signs do not imply the spectral Laguerre sign.
- The reciprocal-Xi results concern positive densities whose Laplace
  transforms are `1/Xi` or its relatives. They do not make the original theta
  source `psi` a `PF_5` function.

Thus (6) neither contradicts the coefficient theorems nor strengthens their
conclusions. It closes a separate continuous-kernel shortcut.

## Revision and provenance guardrails

Version 2 explicitly withdraws version 1's claimed certified global sign and
unique zero for the small-spacing coefficient `C_5(u)`. The paper records
three defects: derivative control stopped below the required order fourteen,
an inserted derivative-tail bound was false, and a grid was treated as an
interval certificate. Those withdrawn statements are not used here.

Only the direct finite-spacing determinant enclosure (3), which the revision
retains and re-verifies, is transferred. The source's positive determinants of
orders two, three, and four occur at one configuration only and do not prove
global `PF_4`.

## Consequence for the live blocker

The combined-vector parallel trace inequality cannot be obtained by placing
the raw source in a totally positive translation cone and then applying a
generic variation-diminishing theorem. A viable proof may still use lower-order
or source-specific determinant identities, but it must preserve the assembled
corrected residual, integrated cross-region compensation, or arithmetic
structure not implied by `PF_r`.

This barrier does not decide any of the live source-specific targets:

- the exact assembled H5 scalar payment;
- the integrated Ewald sign or its stronger fractional-placement route;
- the alternating-lattice sign of the associated correlation kernel;
- alignment of the actual Galerkin residual with the full signed
  background/exterior compensation retained.

## Nonclaims

- The witness is not a negative endpoint Hankel minor.
- It does not show that the associated Turan profile is not positive
  definite.
- It does not refute `PF_2`, `PF_3`, or `PF_4` globally.
- It does not provide a negative paid-Schur pivot or a counterexample to Xi.
- It does not prove or disprove RH.
