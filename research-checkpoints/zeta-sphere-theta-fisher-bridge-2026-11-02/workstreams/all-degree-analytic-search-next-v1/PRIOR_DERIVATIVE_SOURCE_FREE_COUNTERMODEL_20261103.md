# The prior-derivative repair needs complete-theta arithmetic

## Outcome and scope

The recurrence-aware space

\[
 V_N^{\rm prior}=\operatorname {span}\{q_N',tq_N,q_{N-1}'\}
 \tag{1}
\]

is positive on all thirteen available complete-theta rungs.  This note shows
that its prospective all-degree proof cannot come from old signed-block
positivity, positivity of the current target, and generic Schwartz geometry
alone.

There is an exact positive even entire Schwartz profile whose degree-four
signed Galerkin residual has

- a positive old signed block;
- a positive current signed target; but
- a strictly negative auxiliary on (1).

The profile is not the complete theta profile.  The result does not refute
any of the thirteen theta certificates.  It isolates the new arithmetic
input that a uniform proof still needs and proves no all-degree theta result
or RH statement.

## 1. Exact countermodel

Put

\[
 \boxed{W(t)=e^{-t^2/2}\left(1+{4t^2\over5}\right).}       \tag{2}
\]

This function is positive, even, entire, and Schwartz on the real line.  If
`Lambda=W'^2-WW''`, direct differentiation gives

\[
 \boxed{
 W^2=e^{-t^2}\left(1+{8t^2\over5}+{16t^4\over25}\right),
 \qquad
 \Lambda=e^{-t^2}\left(-{3\over5}+{72t^2\over25}
                              +{16t^4\over25}\right).}     \tag{3}
\]

Remove the common positive factor `sqrt(pi)` from every integral and write

\[
 M_j={1\over\sqrt\pi}\int_{\mathbb R}t^{2j}\Lambda(t)dt.
\]

The Gaussian recurrence gives exactly

\[
 (M_0,M_1,M_2,M_3,M_4)
 =\left({33\over25},{153\over50},{183\over20},
        {1467\over40},{2961\over16}\right).                \tag{4}
\]

The old even block through degree two is strictly positive:

\[
 M_0={33\over25}>0,
 \qquad
 \det\begin{pmatrix}M_0&M_1\\M_1&M_2\end{pmatrix}
 ={3393\over1250}>0.                                      \tag{5}
\]

Its monic degree-two residual and the next monic residual are

\[
 q_1(t)=t^2-{51\over22},
 \qquad
 q_2(t)=t^4-{2835\over377}t^2+{15835\over1508}.           \tag{6}
\]

The two defining old-space equations
`integral q_2 Lambda=integral t^2q_2 Lambda=0` hold exactly.  More strongly,
the new signed pivot is positive:

\[
 \boxed{
 {1\over\sqrt\pi}\int_{\mathbb R}q_2(t)^2\Lambda(t)dt
 ={4035\over754}>0.}                                      \tag{7}
\]

Thus this is not merely a negative-target example.

## 2. The prior-derivative auxiliary is negative

Use the ordered basis

\[
 (q_2',tq_2,q_1')
\]

in the positive inner product induced by `W^2dt`.  After removing one
`sqrt(pi)` factor from every entry, its Gram determinant is

\[
 \det K_3={17734914\over125}>0.                            \tag{8}
\]

Let `y_i=integral q_2 p_i'W^2/sqrt(pi)` and
`A=integral (q_2')^2W^2/sqrt(pi)`.  Exact rational elimination gives

\[
 \boxed{
 {1\over4}\{y^TK_3^{-1}y-A\}
 =-{14131991108769\over2800717324340}<0.}                 \tag{9}
\]

Restoring normalization multiplies (9) by the positive number `sqrt(pi)`.
The inverse-free bordered determinant has the opposite strict sign,

\[
 \det\begin{pmatrix}K_3&y\\y^T&A\end{pmatrix}
 ={254375839957842\over88830625}>0,                       \tag{10}
\]

and (10) equals `-4` times (9) times (8).  Hence no floating inverse or
near-zero decision is involved.

Equations (5), (7), and (9) prove the exact logical obstruction

\[
 \boxed{
 \text{old signed-block positivity + positive current target}
 \not\Longrightarrow \mathcal H_{V_N^{\rm prior}}>0}
 \tag{11}
\]

for general positive even entire Schwartz profiles.

## 3. Exact correlated lemma that remains for theta

The obstruction is easiest to locate in the score geometry.  For a current
residual `q=q_N`, prior residual `r=q_(N-1)`, and

\[
 d\nu={q^2W^2\over C}dt,
 \quad C=\int q^2W^2,
 \quad X={q'\over q},\quad T=t,\quad
 J={r'\over q},\quad Z={W'\over W}+{X\over2},             \tag{12}
\]

all quotients are interpreted only after multiplication by `q^2W^2`; no
principal values occur.  The prior auxiliary is exactly

\[
 \boxed{
 {\mathcal H_{V_N^{\rm prior}}\over C}
 =\|P_{\operatorname {span}\{X,T,J\}}Z\|_\nu^2
   -{1\over4}\|X\|_\nu^2.}                              \tag{13}
\]

Let `U=span{X,T}`, `J_perp=(I-P_U)J`, and
`Z_perp=(I-P_U)Z`.  When the two-feature baseline is negative, (13) is
equivalent to the one correlated innovation inequality

\[
 \boxed{
 \langle Z_\perp,J_\perp\rangle_\nu^2
 \ge \|J_\perp\|_\nu^2
 \left\{{\|X\|_\nu^2\over4}-\|P_UZ\|_\nu^2\right\}.}    \tag{14}
\]

Positivity of the target only controls the full norm
`||Z||_nu^2-||X||_nu^2/4`; it does not force the missing norm to align with
`J_perp`.  The countermodel makes exactly this angle failure explicit.

There is also a useful division-free form of the same obstruction.  Put

\[
 v=-{W'\over W},\qquad
 s=-q'W+2vqW,
\]

let `P_U` now denote projection in `L^2(W^2dt)` onto
`U=span{q',tq}`, and set

\[
 p=(I-P_U)r',\qquad \sigma=\|pW\|_2^2.
\]

The residual score innovation is exactly

\[
 \boxed{
 \delta=\langle s,pW\rangle
 =\int q p'W^2
 =2\int (v-\lambda t)q pW^2
 \quad\text{for every real }\lambda.}                    \tag{15}
\]

The last equality uses `p` orthogonal to both `q'` and `tq`.  Therefore

\[
 \boxed{
 \mathcal H_{V_N^{\rm prior}}
 =\mathcal H_{\operatorname {span}\{q',tq\}}
  +{\left|\int(v-\lambda t)q pW^2\right|^2\over\sigma}.} \tag{16}
\]

Thus the prior feature is paid only by its alignment with the nonlinear part
of the logarithmic drift.  Recurrence or Christoffel--Darboux geometry
determines `p`, but cannot by itself lower-bound this alignment: the weight's
complete-theta drift must enter jointly with the predecessor channel.

Consequently a uniform proof of the observed theta repair must prove (14)
from complete-theta data that are absent from (2).  In the parity variable
`x=t^2`, `J` contains the derivative of the Christoffel--Darboux predecessor,
so a viable result must be a correlated theta/CD inequality, not merely
Favard positivity, target positivity, or a separate Cauchy estimate on its
two factors.

## 4. Reproduction

From the workstream directory run

```text
python3 src/verify_prior_derivative_source_free_countermodel_20261103.py \
  --output /tmp/prior_derivative_source_free_countermodel.json
```

The verifier uses only the Python standard library and exact `Fraction`
arithmetic.  The frozen hashes are

```text
verifier source
  ffadda9b2765a50bdb4c9b63eb5b114adfe3d0dfbe09db4ad3e43e3116a5f60f
frozen receipt
  38bfc145beb130154d122b50f1a1fface451a11dd0292b5fd92d40b9f3e0480e
```

The receipt records the complete rational Gram matrix, score vector,
projection coefficients, determinants, residuals, and signed moments.  This
is an exact method counterexample, not a finite test of RH.
