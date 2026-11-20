# Independent audit of the adaptive-score finite-degree barrier

## Verdict

**PASS**, with the stated source-free scope.

The block Schur identity, its one-direction realization, the conditioning
bound for best-coordinate selection, the recurrence-aware prior-residual
formulas, and the all-fixed-degree Gaussian barrier in
`ADAPTIVE_SCORE_FINITE_DEGREE_BARRIER_NEXT.md` are correct.

The barrier proves that no polynomial candidate rule with one fixed degree
ceiling can be justified from positive-even-Schwartz geometry alone, even if
the rule chooses its coefficients from all old positive moments.  The
counterprofiles are not the complete theta profile.  The result does not
refute a theta-specific rule, a degree-growing dictionary, the true target,
or RH.

## 1. Block gain and one adaptive direction

Residualizing a candidate block `R` against the old space `U` gives

\[
 \Sigma=K_{RR}-K_{RU}K_U^{-1}K_{UR},\qquad
 z=y_R-K_{RU}K_U^{-1}y_U.
\]

Direct block inversion gives the exact gain

\[
 \mathcal H_{U+R}-\mathcal H_U={1\over4}z^T\Sigma^{-1}z.
                                                               \tag{A1}
\]

If `z` is nonzero, put `c=Sigma^(-1)z` and
`r_*=sum c_jr_j`.  The residualized feature has both squared norm and score
correlation equal to

\[
 c^T\Sigma c=z^T\Sigma^{-1}z.
\]

Its one-feature gain is therefore exactly the right side of (A1).  If `z=0`,
the block gain is zero and there is no successful direction to compress;
this is the harmless degenerate case implicit in the source note.

For `D=diag(Sigma)`, `mathcal R=D^(-1/2)Sigma D^(-1/2)`, and
`x=D^(-1/2)z`, write

\[
 G=x^T\mathcal R^{-1}x,\qquad B=\max_jx_j^2.
\]

Singleton-subspace monotonicity gives `B<=G`, while

\[
 G\le {\|x\|^2\over\lambda_{\min}(\mathcal R)}
 \le {mB\over\lambda_{\min}(\mathcal R)}.
\]

Thus

\[
 {\lambda_{\min}(\mathcal R)\over m}G\le B\le G           \tag{A2}
\]

with no missing square or reversed eigenvalue.  Best-coordinate selection
needs a separate uniform conditioning estimate; the adaptive combination in
(A1) does not.

## 2. Recurrence-aware candidate audit

For

\[
 U_N=\operatorname{span}\{q_N',tq_N\},\qquad
 r=q_{N-1}',
\]

the residualized norm and score correlation in the note are precisely the
one-feature Schur data.  The raw score entry is

\[
 \langle s_N,q_{N-1}'W\rangle
 =\int q_Nq_{N-1}''W^2,
\]

so the displayed subtraction by the old Gram projection is correct.  At
degree `kappa>=3`, the leading degrees `kappa+1`, `kappa-1`, and `kappa-3`
prove exact rank three before any numerical Gram test.

Differentiating

\[
 q_N=(t^2-\alpha_N)q_{N-1}-\beta_Nq_{N-2}
\]

and solving for the multiplication layer gives

\[
 t^2q_{N-1}'=q_N'+\alpha_Nq_{N-1}'-2tq_{N-1}
                  +\beta_Nq_{N-2}',                       \tag{A3}
\]

including the correct signs.

## 3. Audit of the fixed-degree barrier

The profile

\[
 W_L=e^{-t^2/2}+L^{-1}e^{-t^2/(2L^2)}
\]

is strictly positive, even, and Schwartz.  For a trial polynomial normalized
by `int p^2W_L^2=1`, put `P_L(u)=p(Lu)=sum b_ju^(2j)`.  The square of the
broad component alone gives

\[
 L^{-1}\int P_L(u)^2e^{-u^2}du\le1.                       \tag{A4}
\]

On the fixed finite-dimensional space, (A4) implies
`b_j=O_d(sqrt L)`.  The three parts of
`int tp'(t)W_L(t)^2dt` then scale as follows:

- broad square, after `t=Lu`: `O_d(L^(-1/2))`;
- narrow square: the constant derivative vanishes and the first possible
  term is `O_d(L^(-3/2))`;
- cross term: its explicit amplitude contributes one further `L^(-1)`, so it
  is `O_d(L^(-5/2))`.

The complete numerator is `O_d(L^(-1/2))`; after squaring and taking the
supremum, the full even-polynomial projection satisfies

\[
 \Pi_d(L)=O_d(L^{-1}).                                    \tag{A5}
\]

Odd features have zero score correlation by parity, so this full even space
dominates every polynomial menu with the same degree ceiling, including
moment-dependent adaptive coefficients.

The broad perturbation tends to zero both in `L^2` and under `tD`.  Hence
`W_L` tends to `e^(-t^2/2)` in the two norms needed for the target, and

\[
 s_L\longrightarrow(-1+2t^2)e^{-t^2/2},\qquad
 \|s_L\|_2^2-\|W_L\|_2^2\longrightarrow\sqrt\pi>0.        \tag{A6}
\]

Equations (A5)--(A6) prove the simultaneous positive target and negative
full-space auxiliary for every fixed degree ceiling at sufficiently large
`L`.

## 4. Closed-form and replay checks

Expanding `W_L^2` into its narrow square, broad square, and cross term gives

\[
 {m_k(L)\over\sqrt\pi}
 ={(2k-1)!!\over2^k}(1+L^{2k-1})
 +{2\sqrt2(2k-1)!!L^{2k}\over(L^2+1)^{k+1/2}},            \tag{A7}
\]

so the moment formula in the source note is exact.  Differentiating the two
Gaussian components gives

\[
 {1\over\sqrt\pi}\int t^2(W_L')^2dt
 ={3\over4}+{3\,2^{3/2}L^2\over(L^2+1)^{5/2}}
              +{3\over4L},                               \tag{A8}
\]

with the correct cross coefficient and power.  Together with
`8pi S_L[t]=4J_L-2m_0(L)`, (A7)--(A8) reproduce the target limit in (A6).

I reran the 110-digit standard-library checker independently.  All stored
degree-ceiling samples passed their positive-target and negative-auxiliary
assertions.  The replay and source SHA-256 values at audit time were

```text
checker source
  eab3a1943a9caed5073b00217a0852b11fbd1e18db1ef1ad24588278bc314f11
independent /tmp receipt
  c418f268177a8b857c002297e0b7b37040ead056b8fc77e4d970cf7249e09018
```

The finite samples support the algebra and sign separation.  The proof for
every fixed degree ceiling is the norm-scaling argument (A4)--(A6), not the
sample table.
