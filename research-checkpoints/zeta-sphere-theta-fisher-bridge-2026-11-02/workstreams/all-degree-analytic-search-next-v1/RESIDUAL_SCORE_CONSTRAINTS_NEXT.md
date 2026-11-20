# What the two residual score constraints do not prove

## Scope and outcome

`SOBOLEV_SCORE_PROJECTION_NEXT.md` reduces the two-generator sufficient
condition to the correlated inequality

\[
 \left\|K^{-1/2}\binom{B}{C+E}\right\|^2\geq A, \qquad
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix},          \tag{1}
\]

and observes that the actual degree-`kappa` Galerkin residual supplies the
two exact old-space identities obtained from

\[
 p_1=q'',\qquad p_2=tq'-\kappa q.                \tag{2}
\]

This note determines the logical strength of those identities before any
complete-theta orbit or Ewald input is added.

There are three exact conclusions.

1. The identities from (2) are reparametrizations of old-space Galerkin
   orthogonality.  By themselves they add no inequality to the stipulated
   old block.
2. An explicit positive even entire Schwartz source has an actual degree-two
   residual for which the old block and the new signed pivot are both
   positive, and both identities in (2) hold, but (1) fails strictly.
   Thus even positivity of the target pivot does not force this stronger
   two-generator certificate.
3. For the same source, the old even block through degree two is positive.
   At the degree-four extension the two polynomials in (2) are linearly
   independent and their exact identities both hold, but the next signed
   pivot is negative.  Hence independence of the two constraints and old
   prefix positivity still do not supply the target sign.

The source is not the complete theta profile.  The countermodel does not
decide (1) for `W=2Xi`; it proves that a successful argument must use a
genuinely new Jacobi-orbit or assembled Ewald relation, not only (2),
integration by parts, and old-block positivity.  No finite calculation is
promoted to an Xi--Laguerre sign, all-degree theorem, or RH conclusion.

## 1. The constraints are exactly old orthogonality

Let `W` be a nonzero real even Schwartz function and put

\[
 L={W'\over W},\qquad
 \Lambda=W'^2-WW''=-W^2L'.                       \tag{3}
\]

Quotients are used only as shorthand on the set where `W` is nonzero;
every formula below has the division-free form involving `Lambda`, so no
assumption on the zero set is needed.

Let `q` be a monic parity-`epsilon` polynomial of degree `kappa` satisfying

\[
 \int_{\mathbb R}q(t)p(t)\Lambda(t)dt=0          \tag{4}
\]

for every same-parity polynomial `p` of degree at most `kappa-2`.  This is
the defining old-space Galerkin condition.  Since both polynomials in (2)
have the same parity as `q` and degree at most `kappa-2`, (4) immediately
gives

\[
 \int qq''\Lambda=0,
 \qquad
 \int q(tq'-\kappa q)\Lambda=0.                 \tag{5}
\]

After normalization by `q^2W^2dt`, equations (5) are exactly the two score
identities in the preceding note.  Conversely, they are only two members of
the already imposed family (4).  No sign enters their derivation.

This does not make (5) useless: a complete-theta identity may combine them
with new orbit information.  It does show that any implication based on
(5), old-block positivity, and source-free integration by parts alone must
hold for every source satisfying (3)--(4).  The next sections give an exact
countermodel to such an implication.

## 2. A positive entire Schwartz source with rational Gaussian moments

Take

\[
 \boxed{W(t)=e^{-t^2/2}(1+2t^2).}                \tag{6}
\]

This source is positive, even, entire, and Schwartz on the real axis.  Its
positive and signed weights are

\[
 \begin{aligned}
 W(t)^2&=e^{-t^2}(1+4t^2+4t^4),\\
 \Lambda(t)&=W'^2-WW''
  =e^{-t^2}(4t^4+12t^2-3).
 \end{aligned}                                   \tag{7}
\]

The signed density is allowed to change sign; old-prefix positivity will be
checked exactly rather than inferred pointwise.

Put

\[
 \mu_n=\int_{\mathbb R}t^{2n}e^{-t^2}dt
 =\sqrt\pi\,{(2n-1)!!\over2^n}.                 \tag{8}
\]

Then

\[
 \begin{aligned}
 J_n&:=\int t^{2n}W^2dt
     =\mu_n+4\mu_{n+1}+4\mu_{n+2},\\
 M_n&:=\int t^{2n}\Lambda dt
     =-3\mu_n+12\mu_{n+1}+4\mu_{n+2}.           \tag{9}
 \end{aligned}
\]

Writing `s=sqrt(pi)`, the needed moments are

\[
 \begin{array}{c|rrrrrr}
 n&0&1&2&3&4&5\\ \hline
 J_n/s&6&11&69/2&585/4&6195/8&78435/16\\
 M_n/s&6&15&93/2&765/4&7875/8&97335/16.
 \end{array}                                     \tag{10}
\]

Every value in (10) follows from the one-step recurrence
`mu_(n+1)=(2n+1)mu_n/2`; no numerical quadrature is involved.

## 3. Degree two: the target is positive but the score criterion fails

The old even space is the constants.  It is strictly positive because

\[
 M_0=6s>0.                                       \tag{11}
\]

The unique monic degree-two residual is

\[
 \boxed{q_2(t)=t^2-{M_1\over M_0}=t^2-{5\over2},} \tag{12}
\]

and indeed `integral q_2 Lambda=0`.  Its new signed pivot is

\[
 \boxed{
 \int q_2^2\Lambda
 =M_2-5M_1+{25\over4}M_0=9s>0.}                 \tag{13}
\]

In the campaign Sobolev normalization,

\[
 2\pi\mathcal S_{1,0}={1\over2}\int q_2^2\Lambda
 ={9\over2}s>0.                                  \tag{14}
\]

Thus this rung has a genuinely positive target, independently of any
auxiliary construction.

The five positive-weight scalars in (1) are nevertheless

\[
 \boxed{
 (A,B,C,D,E)=s\left(44,-8,17,{85\over2},14\right).} \tag{15}
\]

They follow by inserting `q_2`, `q_2'=2t`, and `q_2''=2` into their defining
integrals and using (10).  In particular,

\[
 \det K=(AD-E^2)=1674s^2>0.                      \tag{16}
\]

For the denominator-free left-minus-right side of (1), put

\[
 \Phi:=DB^2-2EB(C+E)+A(C+E)^2-A(AD-E^2).        \tag{17}
\]

Equations (15)--(16) give the exact strict failure

\[
 \boxed{\Phi=-21708s^3<0.}                       \tag{18}
\]

Equivalently, the two-generator margin is

\[
 \boxed{
 \mathcal H_2={\Phi\over4\det K}
 =-{201\over62}s<0.}                             \tag{19}
\]

Both proposed residual constraints hold.  Here

\[
 q_2''=2,
 \qquad tq_2'-2q_2=5,                            \tag{20}
\]

so (5) reduces in both cases to the exact Galerkin equation in (12).  This
example proves

\[
 \boxed{
 \text{old positivity + actual residual + (5) + positive new pivot}
 \not\Longrightarrow (1).}                      \tag{21}
\]

The failure is consistent with the projection identity: (1) is sufficient
but not necessary, and the positive orthogonal score component omitted by
the two-generator projection pays the target in this model.

## 4. Degree four: the two constraints are independent

One might object that the two tests in (20) are proportional because the old
space is one-dimensional.  The same source also gives a two-dimensional old
block.  In the basis `(1,t^2)` it is

\[
 G_{\rm old}
 =s\begin{pmatrix}6&15\\15&93/2\end{pmatrix},
 \qquad
 \det G_{\rm old}=54s^2>0.                      \tag{22}
\]

Thus every old even quadratic has strictly positive signed norm.  Solving
the two exact equations against `1` and `t^2` gives the actual monic
degree-four residual

\[
 \boxed{
 q_4(t)=t^4-{25\over3}t^2+{157\over12}.}         \tag{23}
\]

Indeed,

\[
 M_2-{25\over3}M_1+{157\over12}M_0=0,
 \qquad
 M_3-{25\over3}M_2+{157\over12}M_1=0.           \tag{24}
\]

Now the two special old polynomials are

\[
 q_4''=12t^2-{50\over3},
 \qquad
 tq_4'-4q_4={50\over3}t^2-{157\over3}.          \tag{25}
\]

Their coefficient determinant in the basis `(1,t^2)` is

\[
 \det\begin{pmatrix}-50/3&12\\-157/3&50/3\end{pmatrix}
 ={3152\over9}\ne0.                             \tag{26}
\]

Hence (5) supplies two linearly independent identities at this rung.  They
still do not force a sign: direct use of (10) gives

\[
 \boxed{\int q_4^2\Lambda=-s<0.}                \tag{27}
\]

The associated positive-weight data are

\[
 (A,B,C,D,E)
 =s\left({7160\over9},-{2912\over9},{2375\over9},
          {6103\over18},-{148\over9}\right),     \tag{28}
\]

with

\[
 \det K={2425204\over9}s^2>0,
 \qquad
 \Phi=-{398409656\over3}s^3<0.                 \tag{29}
\]

Thus the combined score condition also fails.  More importantly, (22),
(25), and (26) prove the exact logical no-go

\[
 \boxed{
 \text{old-block positivity + two independent identities (5)}
 \not\Longrightarrow\text{ the next signed pivot.}}             \tag{30}
\]

This is a source-free countermodel, not a claim about any Xi rung.

## 5. What a theta-specific continuation must add

The identities in (5) can still be useful after they are paired with a new
complete-theta relation.  The countermodel identifies what that relation
cannot be:

- it cannot follow from evenness, real analyticity, Schwartz decay, or
  positivity of `W`;
- it cannot be only the definition of the actual Galerkin residual;
- it cannot be only positivity of the stipulated old signed block; and
- even adding the sign of the current target does not imply the stronger
  projected certificate (1), as (13)--(21) show.

A surviving theorem-shaped route must use arithmetic absent from (6), for
example an all-orbit Jacobi relation or a seam-free Ewald pairing which
controls the *combined* vector `(B,C+E)` in the metric `K^(-1)`.  Such an
identity would have to fail explicitly for the Gaussian-polynomial source
(6).  Testing this failure is a useful audit condition for any proposed
theta lemma.

The present result does not show that (1) fails for the complete theta
residual.  It shows only that equations (2)--(5) cannot prove it without a
new theta-specific input.

## Self-audit and nonclaims

- All moment values are exact rational multiples of `sqrt(pi)` obtained from
  (8); no rounded quadrature or finite-degree extrapolation is used.
- Equations (12) and (23) are the unique monic Galerkin residuals for their
  respective positive old blocks.
- Expanding the definitions of `A,B,C,D,E` reproduces (15) and (28).
- Substitution in (17) gives (18) and (29) exactly.
- The source (6) is not a theta profile and has no Jacobi-orbit or modular
  Ewald arithmetic.  It is a method countermodel only.
- No Xi pivot, first Xi--Laguerre sign, all-degree positivity result, or RH
  conclusion is asserted.
