# Adjacent theta Turan bounds do not control the correlated Schur reserve

## Result

A natural source-only continuation of the proved derivative-norm anchors is

\[
 (2j-1)n_{j-1}n_{j+1}<(2j+3)n_j^2,
 \qquad n_j=\|\psi^{(j)}\|_{L^2(0,\infty)}^2.    \tag{1}
\]

The complete-theta boxes satisfy (1) strictly through `j=5`, and the cases
`j=1` and `j=4` are already proved analytically. Nevertheless, even granting
every adjacent inequality needed through `j=5` would not supply the
residual-correlated reverse-Schur bound. This note gives a strict truncated
Stieltjes countermodel to that finite implication. The spectral moments are
`m_j=4pi n_j`; all signs and normalized ratios below are invariant under
that common scaling.

The result is now a supporting route obstruction rather than the main one:
`REVERSE_SCHUR_ACTUAL_FAILURE_NEXT.md` proves that the reverse-Schur
auxiliary itself fails at the actual degree-ten theta residual. The present
calculation explains why source-only moment ratios could not have repaired
the missing correlation even at an earlier positive rung.

## Actual `(2,1)` cap versus the adjacent ceiling

For the certified actual residual

\[
 q(t)=t(t^4+at^2+b),
\]

write `D=D_low+n_6`, `G=A^2-B^2`, and `R=AC+E(A-B)`. In the nonautomatic
branch, its exact newest-moment obligation is

\[
 n_6\le U_q:={E^2\over A}+{R^2\over AG}-D_{\rm low}.          \tag{2}
\]

The frozen 420-bit all-orbit receipt gives

\[
\begin{aligned}
n_6&=4.1328206262\times10^9\ \pm 8.87\times10^{-2},\\
U_q&=4.167339574\times10^9\ \pm 2.62\times10^{-1}.
\end{aligned}                                                  \tag{3}
\]

Thus the actual theta value satisfies (2), but the adjacent `j=5` inequality
only yields

\[
 n_6<{13\over9}{n_5^2\over n_4}
 =4.945421832\times10^9\ \pm4.05\times10^{-1}.                \tag{4}
\]

After normalization by `n_5^2/n_4`, the correlated cap is
`1.217184439...`, while the adjacent constant is `13/9=1.44444...`.
The source-only ratio discards the small reserve actually used by (2).

## Strict moment-cone non-implication

Keep the certified complete-theta values `n_0,...,n_5` and the same actual
signed residual coefficients, but set only

\[
 \widetilde n_6=4,500,000,000.                                \tag{5}
\]

Outward Arb arithmetic proves simultaneously:

1. every adjacent inequality (1) through `j=5` remains strict;
2. all leading minors of `(n_(i+j))_(0<=i,j<=3)` are positive;
3. all leading minors of `(n_(i+j+1))_(0<=i,j<=2)` are positive;
4. the two-generator Gram determinant `AD-E^2` remains positive; and
5. the correlated numerator is strictly negative,

\[
 F=R^2-(AD-E^2)G
 =-9.02891070\times10^{27}\ \pm8.25\times10^{18}<0.          \tag{6}
\]

The ordinary and shifted Hankel tests put (5) strictly inside the relevant
truncated Stieltjes moment cone. Hence the failure is not a loss of positive
moment geometry. It is exactly a loss of residual correlation.

## Consequence for the next analytic space

Neither adjacent norm ratios nor ordinary Hankel/J-fraction bounds retain
the reserve missing from the two-generator projection. Within this Sobolev
projection route, a viable replacement must enlarge the correlated subspace
before taking norms; the signed cell/Hardy route remains a separate option. The exact
three-term transfer points to multiplication layers and the prior residual,
for example

\[
 \operatorname{span}\{a_q,b_q,Ma_q,Mb_q,a_{q_-},b_{q_-}\},   \tag{7}
\]

where `M` is multiplication by `t^2`, `a_q=q'W`, `b_q=tqW`, and `q_-` is
the preceding same-parity residual. Equation (7) is a candidate space, not
a proved lemma. More generally, the polynomial-square hierarchy in
`ALL_DEGREE_SOBOLEV_SQUARE_NEXT.md` shows that linearly growing auxiliary
dimension can recover more of the orthogonal reserve, but unrestricted
growth saturates back to the target and is circular without a separate
theta margin.

The route requirement is therefore precise: construct a finite,
degree-dependent correlated subspace that contains enough complete-theta
arithmetic to pay the orthogonal reserve, and prove its projected norm bound
without assuming the signed pivot. Source-only one-dimensional moment ratios
cannot do this.

## Replay and scope

Run from the checkpoint root:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_theta_turan_schur_no_go.py \
  --root . --precision-bits 420 \
  --output workstreams/all-degree-analytic-search-next-v1/results/theta_turan_schur_no_go.json
```

The verifier hashes the independent 420-bit actual `(2,1)` receipt before
using it. The modified value (5) is not asserted to be the complete-theta
moment; it proves only non-implication from (1) plus positive truncated
moment geometry. No all-degree theta theorem, first Xi--Laguerre inequality,
or RH statement is claimed.
