# Identical-marginals no-go for the anisotropic Schur target

## 0. Exact result and claim boundary

This note records one exact obstruction to the direct signed-sector route in
`PHYSICAL_LEVERAGE_SHORTED_SCHUR.md`.  The diagonal negative-block data
`R_KK`, `R_HH`, the high norm `rho`, and the high leverage trace `V_H` do not
determine the anisotropic Schur condition (7.8), even when `V_H<g`.  An exact
two-dimensional pair has identical values of all those marginals but opposite
Schur signs because its low--high negative coupling differs.

The cap-free excess identity, central-band lower bound, and resulting
`O(L/lambda)` trace scale are already proved in Sections 2--4 of
`PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md`.  They are dependencies and
context here, not new results.  In particular, that scale is necessary for
the cap-free excess sufficient route under its stated hypotheses; this note
does not promote it to a necessary condition for positivity of the full
operator.

The counterpair is abstract.  It proves that marginal negative-block data
alone cannot establish (7.8).  It does not say that the actual prolate--Weil
source fails, because source-specific cross information or positive coupling
may change the answer.  No signed-sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, Riemann-hypothesis claim, or Lambda
bound is proved.  This theorem-only package creates no source lock or
numerical artifact and changes no status or replay file.  The formal project
state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` | `39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3` |
| `notes/PHYSICAL_SOFT_SHORT_SIGNED_SCHUR.md` | `cf847b2f73d18244158ee0238714f677c74358068a658c637a40477b3e0a38ca` |
| `notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md` | `d773afb7c38119d775f772ba91af02cf76372eaf3bfb89ccf461017fee2c8669` |

## 2. The exact target

Let a finite Hilbert space split orthogonally as `K direct-sum H`.  For

\[
 B=gI+C-R,\qquad g>0,\qquad C\succeq0,\quad R\succeq0,                 \tag{2.1}
\]

shorting the positive part to `K` gives the lower comparison

\[
 B\succeq {\cal M}:=
 \begin{pmatrix}
  gI-R_{KK}+C_{/K}&-R_{KH}\\
  -R_{HK}&gI-R_{HH}
 \end{pmatrix}.                                                       \tag{2.2}
\]

When `gI-R_HH` is positive definite, positivity of this comparison is
equivalent to the anisotropic condition

\[
 gI-R_{KK}+C_{/K}
 -R_{KH}(gI-R_{HH})^{-1}R_{HK}\succ0.                                \tag{2.3}
\]

This is equation (7.8) of `PHYSICAL_LEVERAGE_SHORTED_SCHUR.md`.  The cross
block in (2.3) is not determined by the two diagonal compressions.

## 3. Exact identical-marginals counterpair

Take one-dimensional `K` and `H`, set `g=1`, and take `C=0`, hence
`C_{/K}=0`.  Define

\[
 R_0=\begin{pmatrix}3/5&0\\0&3/5\end{pmatrix},
 \qquad
 R_1={3\over5}\begin{pmatrix}1&1\\1&1\end{pmatrix}.                  \tag{3.1}
\]

Both negative blocks are positive semidefinite.  Their eigenvalues are
`3/5,3/5` and `0,6/5`, respectively.  They have identical diagonal
compressions and identical high marginal statistics:

\[
 R_{KK}=R_{HH}=3/5,
 \qquad \rho=\lVert R_{HH}\rVert=V_H=3/5<g.                           \tag{3.2}
\]

Their low diagonal reserve and high block also agree:

\[
 g-R_{KK}+C_{/K}=2/5,
 \qquad g-R_{HH}=2/5>0.                                                \tag{3.3}
\]

For `R_0`, expression (2.3) is

\[
 {2\over5}>0.                                                         \tag{3.4}
\]

For `R_1`, the same expression is instead

\[
 {2\over5}-{(3/5)^2\over2/5}=-{1\over2}<0.                           \tag{3.5}
\]

Because `C=0`, the comparison (2.2) equals the full operator in this model.
Indeed,

\[
 I-R_0=\begin{pmatrix}2/5&0\\0&2/5\end{pmatrix},
 \qquad
 I-R_1=\begin{pmatrix}2/5&-3/5\\-3/5&2/5\end{pmatrix},               \tag{3.6}
\]

whose determinants are `4/25` and `-1/5`.  Thus one is positive definite
and the other is indefinite despite the identical data in (3.2)--(3.3).

For completeness, with quotient metric `Delta=1` the scalar sufficient
test (7.6) also receives the same inputs for both matrices:

\[
 \rho\beta={9\over25},
 \qquad \eta\mu={4\over25}.                                           \tag{3.7}
\]

It rejects both, as a sufficient test may; the sharper anisotropic target
distinguishes them only after the cross block is supplied.

## 4. Consequence for the open analytic target

The leverage deficit (4.7) remains a useful sufficient high-block target.
Separately, the existing defect-adjoint note gives the cap-free excess
route's central-band necessary scale.  But diagonal leverage, trace, norm,
and low-reserve bounds cannot by themselves settle (7.8).  Any proof through
the anisotropic route must additionally control the actual source-dependent
low--high negative coupling, or use an exact residualized signed
factorization that retains the corresponding orientation data.
