# Enlarged correlated-score projection

## Scope and outcome

The two-generator auxiliary is negative at the actual complete-theta even
residual of degree ten although the signed target pivot is positive.  The
smallest useful enlargement is already enough:

\[
 \boxed{U_3=\operatorname {span}\{q',tq,t^2q'\}.}
\]

A complete-orbit Arb calculation proves

\[
 \mathcal H_{\{q',tq\}}[n]<-1.0189\,10^{14},\qquad
 \mathcal H_{U_3}[n]>6.3933\,10^{13}.
\]

One added direction is therefore cardinality-minimal at this rung.  The
single prior-residual features `q_4'` and `t q_4` also work, but they are not
needed for the cleanest certificate.  This is a finite-rung result, not a
uniform theorem or an RH claim.

## 1. Exact finite-dictionary identity

Let `W` be the real even complete-theta profile and let `q` be a real
polynomial.  Put

\[
 a=q'W,\qquad s=-q'W-2qW',\qquad A=\|a\|_2^2.
\]

For linearly independent opposite-parity polynomials `r_1,...,r_m`, set
`f_i=r_iW`, `V=span{f_i}`, and

\[
 K_{ij}=\int r_ir_jW^2dt.
\]

`K` is positive definite because `W` is nonzero on an interval.  Schwartz
decay removes the boundary term in `integral (q r_i W^2)'`, giving the exact
division-free correlation

\[
 \boxed{y_i=\langle s,f_i\rangle=\int q r_i'W^2dt.}             \tag{1}
\]

Hence `||P_V s||^2=y^T K^(-1)y`.  Direct expansion, together with
`integral (q q' W^2)'=0`, gives the normalization

\[
 8\pi\mathcal S[q]=\|s\|_2^2-A.
\]

Therefore

\[
 \boxed{
 \mathcal H_V={1\over4}(y^TK^{-1}y-A),\qquad
 2\pi\mathcal S[q]-\mathcal H_V
 ={1\over4}\|(I-P_V)s\|_2^2\geq0.}              \tag{2}
\]

This audits the factor `1/4`: for `(r_1,r_2)=(q',tq)`,

\[
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix},\qquad
 y=\binom{B}{C+E},
\]

which is exactly the previous two-generator formula.  Exact dependencies
must be deleted (or handled with `K`'s Moore--Penrose inverse); a floating
condition number is not a rank test.

The quotient notation `X=q'/q`, `L=W'/W`, and `Z=L+X/2` creates no domain
problem: it is only shorthand under `d nu=q^2W^2dt/C`.  Equation (1) is the
primary definition.  If `q'` is in the dictionary, (2) is equivalently

\[
 {\mathcal H_V\over C}=\|P_VZ\|_\nu^2-{1\over4}\|X\|_\nu^2,
 \qquad
 2\pi\mathcal S-\mathcal H_V=C\|(I-P_V)L\|_\nu^2.
\]

Thus enlarging `V` retains a precisely identified part of the orthogonal
reserve; it does not assume its sign.

## 2. Moment formulas and noncircularity

For `q=sum q_c t^c`, `r_i=sum r_(i,a)t^a`, and
`J_l=integral t^(2l)W^2dt`, terms with odd or negative subscripts omitted,

\[
 \boxed{
 \begin{aligned}
 K_{ij}&=\sum_{a,b}r_{i,a}r_{j,b}J_{(a+b)/2},\\
 y_i&=\sum_{c,a}a q_cr_{i,a}J_{(c+a-1)/2},\\
 A&=\sum_{c,d}cd q_cq_dJ_{(c+d-2)/2}.
 \end{aligned}}                                      \tag{3}
\]

All projection entries use only residual coefficients and positive `W^2`
moments.

For parity `epsilon`, write

\[
 q_{N,\epsilon}=t^{2N+\epsilon}
 +\sum_{j=0}^{N-1}c_jt^{2j+\epsilon},\qquad
 \mathcal A(t^{2j})=M_j.
\]

Old-space orthogonality gives

\[
 (M_{i+j+\epsilon})_{i,j<N}c
 =-(M_{i+N+\epsilon})_{i<N}.                       \tag{4}
\]

The solve uses moments only through `M_(2N-1+epsilon)`.  The new signed pivot
uses `M_(2N+epsilon)` and is absent from (4).  The previous residual uses two
fewer moment indices.  Dictionaries built from the current and prior
residuals, multiplication by `t^2`, and the positive moments in (3) are
therefore old-data constructions.  The checker reports the target pivot only
for comparison; it never uses it in `H_V`.

Adjoining `s` itself, choosing features from the unknown target sign, or
invoking only dense-space saturation would instead be target-equivalent.

## 3. Exact one-feature gain

Let `U` be a baseline dictionary.  For one feature `v=rW`, define

\[
 \sigma=\|(I-P_U)v\|^2=d-k^TK_U^{-1}k,
\]

\[
 \delta=\langle s,(I-P_U)v\rangle
 =\langle s,v\rangle-k^TK_U^{-1}y_U.
\]

Block inversion gives

\[
 \boxed{\mathcal H_{U+v}=\mathcal H_U
       +{1\over4}{\delta^2\over\sigma}.}            \tag{5}
\]

Thus a negative baseline is repaired exactly when
`delta^2 >= -4 H_U sigma`.  For `v=t^2q'W`,

\[
 k=\binom{\int t^2q'^2W^2}{\int t^3qq'W^2},\quad
 d=\int t^4q'^2W^2,
\]

\[
 \langle s,v\rangle=\int q(2tq'+t^2q'')W^2.          \tag{6}
\]

Equations (5)--(6) are the clean theta-specific analytic obligation suggested
by the degree-ten repair.

For a block `R`, its Schur complement and innovation are

\[
 \Sigma=K_{RR}-K_{RU}K_U^{-1}K_{UR},\qquad
 z=y_R-K_{RU}K_U^{-1}y_U,
\]

and the gain is `z^T Sigma^(-1)z/4`.  The Rayleigh quotient shows that one
residualized combination, with coefficient vector `Sigma^(-1)z`, captures the
entire block gain.  If the full block fails then no subset or combination can
work; if it succeeds, one adaptive old-data direction suffices for that rung.

## 4. One-step recurrence closure, not a finite invariant state

Let `M:r -> t^2r`, `a_N=q_N'`, and `b_N=tq_N`.  The forward dictionary

\[
 \{a_N,b_N,Ma_N,Mb_N,a_{N-1},b_{N-1}\}              \tag{7}
\]

needs positive moments through `J_(kappa+3)`.  At degree ten the current
boxes through `J_11` already cover `Ma_N=t^2q_N'` and the prior pair, but not
the full `Mb_N=t^3q_N` Gram.

The residual recurrence

\[
 q_N=(M-\alpha)q_{N-1}-\beta q_{N-2}
\]

implies

\[
 \boxed{
 \begin{aligned}
 Ma_{N-1}&=a_N+\alpha a_{N-1}-2b_{N-1}+\beta a_{N-2},\\
 Mb_{N-1}&=b_N+\alpha b_{N-1}+\beta b_{N-2}.
 \end{aligned}}                                      \tag{8}
\]

Consequently

\[
 \{a_N,b_N,a_{N-1},b_{N-1},a_{N-2},b_{N-2}\}        \tag{9}
\]

contains the first multiplication layer of the prior pair and requires only
`J_(kappa+1)`, the baseline depth.  This is exact **one-step operator
recurrence closure**.  It is not an invariant finite scalar Gram state: the
next step creates another multiplication layer, and no nonzero finite space
of polynomial multiples is invariant under multiplication by `t^2`.  The
recurrence supplies (8), not a uniform positivity bound for (5).

## 5. Complete-orbit bounded results

`src/verify_enlarged_score_projection.py` reconstructs each residual from
the outward-padded signed archive and evaluates (3) using certified boxes

\[
 n_j=\|\psi^{(j)}\|^2_{h\geq0},\qquad 0\leq j\leq11.
\]

The boxes use the exact orbit block `1,...,8` and an analytic norm tail
containing every orbit `n>=9`.  There is no finite-orbit substitution or
quadrature.  The archive normalization is corrected as `mu_j=4^j M_j`
before solving (4).

The spectral moments are `J_j=m_j=4*pi*n_j`.  This common positive factor
multiplies `K`, `y`, `A`, and `H` by `4*pi`, preserving every sign.  The
following concise enclosures are in the half-line `n_j` scale.

### Even ladder

| `kappa` | baseline `H_(q',tq)` | after adding `t^2q'` |
|---:|---:|---:|
| 2 | `[3.9431854840,3.9431854841]` | dependent |
| 4 | `[3.1797627314e3,3.1797627315e3]` | `[3.2965303290e3,3.2965303291e3]` |
| 6 | `[7.7038945276e6,7.7038945277e6]` | `[9.4246936545e6,9.4246936546e6]` |
| 8 | `[1.2630757134e11,1.2630757143e11]` | `[1.5167442285e11,1.5167442311e11]` |
| 10 | `[-1.0191547405e14,-1.0189895180e14]` | `[6.3933727580e13,6.3954807774e13]` |

At degree ten, `q_4'` alone gives
`H>9.8151593160e13`, and `tq_4` alone gives `H>4.4447159566e13`.
For the cleaner `t^2q_5'` feature, the certified Schur data are

\[
 \sigma>5.0307470801\,10^{20},\qquad
 |\delta|>5.7770116710\,10^{17},
\]

so the gain in (5) exceeds `1.6584916100e14`, strictly more than the base
deficit.

### Odd ladder

| `kappa` | baseline `H_(q',tq)` | after adding `t^2q'` |
|---:|---:|---:|
| 1 | `[1.8100658904e-1,1.8100658905e-1]` | dependent |
| 3 | `[1.1399462844e2,1.1399462845e2]` | `[1.1478437754e2,1.1478437755e2]` |
| 5 | `[6.8176984863e4,6.8176984864e4]` | `[6.8868124036e4,6.8868124037e4]` |
| 7 | `[1.2384110653e9,1.2384110655e9]` | `[1.6772495072e9,1.6772495073e9]` |
| 9 | `[3.8614463366e12,3.8614465280e12]` | `[4.0676821015e12,4.0676823907e12]` |

Thus every available low actual odd rung is already positive in the baseline;
the multiplication feature remains positive where it is an independent third
direction.  This is route selection only, not evidence of uniformity.

The primary and replay receipts are generated at 720-bit Arb precision and
are byte-identical:

```text
results/enlarged_score_projection_actual_rungs.json
results/enlarged_score_projection_actual_rungs_replay.json
sha256 f48debd201f0a234900b9217e9a2f7693a8803a5b4ded601df8ec15a82905bf0
```

## 6. Remaining obligation and nonclaims

The exact analytic deliverables are (2), the one-feature sufficient
inequality (5), and the one-step recurrence identities (8).  The finite
certificate proves that one feature is sufficient and cardinality-minimal at
the actual degree-ten rung.  It does not prove that `t^2q'`, a prior feature,
or an adaptive block has a uniform lower bound.

A general theorem still needs complete-theta arithmetic proving (5), or its
block version, at every rung without using the new signed pivot.  Finite
checks with all theta orbits included do not establish that statement and do
not prove RH.
