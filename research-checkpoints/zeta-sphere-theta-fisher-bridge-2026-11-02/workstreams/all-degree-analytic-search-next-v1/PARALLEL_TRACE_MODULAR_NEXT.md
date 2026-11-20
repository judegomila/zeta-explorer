# Modular shorting of the parallel-trace target

## Scope

This note inserts the exact modular-reflection quotients into the
parallel-sum metric of `ANGLE_THETA_VECTOR_NEXT.md`.  The result is a
domain-controlled quotient-space realization of the old trace metric and a sharp
two-channel Cauchy identity.  It also identifies a precise obstruction: the
best constant supplied by that Cauchy argument is the mismatch payment
`C_XY` itself, while replacing it by the innovation gap is exactly the
unknown signed Schur pivot.  Thus calling the construction a conditional
variance does not prove its sign.

The modular formulas do add useful information.  They show that every
feature, residue, and residue-drift term stays assembled inside two modular
determinants.  They also show why generic independent-channel shorting cannot
be performed pointwise in `h`: the local density of the old signed metric has
one positive and one negative direction at every `h>0`.  Any argument using
that generic shorting must work only after the full spatial integration,
retaining cross-region and complete-theta compensation; a stronger
theta-specific restriction of the admissible pointwise graph is not excluded.

No all-degree inequality, endpoint sign, or RH conclusion is proved.

## The two assembled modular channels

Fix one finite old polynomial prefix `P` of parity
`epsilon in {+1,-1}` and assume its actual target block is positive.  Put

\[
 U_a=a(D)\psi=\Psi_a-e(a)\chi,
 \qquad
 J_a=a'(D)\psi=\Psi_{a'}-d(a)\chi,                \tag{1}
\]

where `d(a)=e(a')`.  Thus

\[
 Xa=2hU_a+J_a,
 \qquad Ya=J_a.                                   \tag{2}
\]

For `sigma in {+1,-1}` define

\[
 D_\sigma(h)=\chi(-h)-\sigma\chi(h).              \tag{3}
\]

The complete-theta modular identities give

\[
 D_{-1}=q>0,
 \qquad D_{+1}=2q'>0\quad(h>0),                   \tag{4}
\]

with the `D_(+1)` quotient read by its removable center limit.  Define the
two raw modular determinants

\[
 \Omega_a(h)=
 \chi(-h)\Psi_a(h)-\chi(h)\Psi_a(-h),             \tag{5}
\]

\[
 \Delta_a(h)=
 \chi(-h)\Psi_{a'}(h)-\chi(h)\Psi_{a'}(-h).       \tag{6}
\]

Reflection of the corrected features gives the exact assembled formulas

\[
 \boxed{
 U_a={\Omega_a\over D_\epsilon},
 \qquad
 J_a={\Delta_a\over D_{-\epsilon}}.}              \tag{7}
\]

For example, the first identity follows immediately from
`Psi_a=U_a+e(a)chi` and `U_a(-h)=epsilon U_a(h)`:

\[
 \chi(-h)\Psi_a(h)-\chi(h)\Psi_a(-h)
 =D_\epsilon(h)U_a(h).
\]

No raw feature, residue, or drift is estimated separately in (7).

## The old metrics in modular coordinates

Use the half-line inner product and write

\[
 G_Y(a,b)=\langle J_a,J_b\rangle,
 \qquad
 Q(a,b)=\langle Xa,Xb\rangle-\langle Ya,Yb\rangle. \tag{8}
\]

On `P`, `Q>0` by the old-target hypothesis and `G_X=Q+G_Y>0`.  Equations
(2) and (7) give

\[
 \boxed{
 G_Y(a,b)=\int_0^\infty
 {\Delta_a\over D_{-\epsilon}}
 \overline{{\Delta_b\over D_{-\epsilon}}}\,dh,}  \tag{9}
\]

and

\[
\boxed{
\begin{aligned}
 Q(a,b)=\int_0^\infty\bigg{&
 4h^2 {\Omega_a\over D_\epsilon}
       \overline{{\Omega_b\over D_\epsilon}}\\
 &+2h {\Omega_a\over D_\epsilon}
       \overline{{\Delta_b\over D_{-\epsilon}}}
 +2h {\Delta_a\over D_{-\epsilon}}
       \overline{{\Omega_b\over D_\epsilon}}
 \bigg\}\,dh .
\end{aligned}}                                    \tag{10}
\]

The modular denominators in (9)--(10) have controlled signs, but (10) is
not pointwise positive.  This distinction is essential below.

The old parallel sum

\[
 H=G_Y:Q=G_Y-G_YG_X^{-1}G_Y                       \tag{11}
\]

is exactly the quotient norm

\[
 \boxed{
 H[q]=\inf_{a+b=q}\{Q[a]+G_Y[b]\}.}               \tag{12}
\]

Substituting (9)--(10) into (12) is a complete-theta modular representation
of `H`.  The split `a+b=q` is a split of polynomial coefficients and is the
same at every spatial point.  Its unique `Q`- and `G_Y`-range representative
is the prefix-dependent global regression split recorded in
`ANGLE_THETA_VECTOR_NEXT.md`; it is not a pointwise choice in `h`.

## The exact direct-sum Riesz vector

Let `p` be the new polynomial, `q_X` its positive `X` regression, and

\[
 R_X=p-q_X.
\]

The mismatch covector has both assembled representations

\[
 \boxed{
 r(q)=\langle J_q,J_{R_X}\rangle=-Q(q,R_X)
 \qquad(q\in P).}                                 \tag{13}
\]

The first equality is, in modular coordinates,

\[
 r(q)=\int_0^\infty
 {\Delta_q\over D_{-\epsilon}}
 \overline{{\Delta_{R_X}\over D_{-\epsilon}}}\,dh. \tag{14}
\]

Define the two old regression disagreements

\[
 s=Q^{-1}r=q_X-q_A,
 \qquad
 \delta=G_Y^\dagger r=q_Y-q_X\pmod{\ker G_Y}.     \tag{15}
\]

Then

\[
 Q(q,s)=r(q),
 \qquad
 \langle J_q,J_\delta\rangle=r(q)                 \tag{16}
\]

for every old `q`.  The second relation says

\[
 J_\delta=P_{J P}J_{R_X};                         \tag{17}
\]

it is the derivative-channel projection of the actual assembled residual.

For any coefficient split `a+b=q`, equations (16) give the correlated
identity

\[
 \boxed{
 r(q)=Q(a,s)+\langle J_b,J_\delta\rangle.}         \tag{18}
\]

Applying Cauchy only once, in the direct sum of the `Q` completion and the
assembled modular `J` channel, yields

\[
 |r(q)|^2
 \leq\{Q[a]+G_Y[b]\}
       \{Q[s]+\|J_\delta\|^2\}.                   \tag{19}
\]

The second factor is exactly

\[
 Q[s]+\|J_\delta\|^2
 =r^*Q^{-1}r+r^*G_Y^\dagger r
 =C_{XY}.                                         \tag{20}
\]

Taking the infimum in (19) therefore gives

\[
 \boxed{|r(q)|^2\leq C_{XY}H[q].}                 \tag{21}
\]

This estimate is sharp, not merely a loose generic bound.  Put
`q_0=s+delta`.  In the possibly singular case the exact statement is

\[
 Hq_0=r,
 \qquad
 H^\dagger r=P_{\operatorname {ran}H}q_0,
 \qquad
 q_0-H^\dagger r\in\ker H=\ker G_Y.              \tag{22}
\]

Thus `q_0` is the natural quotient-space representative of the dual Riesz
vector; it need not equal the Moore--Penrose representative as a coefficient
vector when `G_Y` is singular.  For `q=q_0`, the minimizing split in (12) is
exactly `(s,delta)`, both factors in (19) equal `C_XY`, and equality holds in
(21).  Thus the modular reflection plus the optimally correlated direct-sum
Cauchy argument cannot produce any constant smaller than `C_XY`.

## Why the conditional-variance interpretation is circular

The desired bordered trace condition is

\[
 g\geq0,
 \qquad |r(q)|^2\leq gH[q]\quad(q\in P),
 \qquad g=A_X-B_Y.                                \tag{23}
\]

The separate scalar condition `g>=0` is essential when `H=0`: in that case
`r=0`, so the family of quadratic inequalities alone is vacuous.  With that
condition retained, sharpness of (21) shows that (23) is equivalent in both
the singular and nonsingular cases to

\[
 C_{XY}\leq g.                                    \tag{24}
\]

There is an exact residual identity showing what (24) contains.  Put

\[
 \pi=R_X+s=p-q_A.                                 \tag{25}
\]

Equation (13) makes `pi` `Q`-orthogonal to the old prefix.  Moreover,
`J_(R_X)` decomposes orthogonally as

\[
 J_{R_X}=J(p-q_Y)+J_\delta,
 \qquad \|J(p-q_Y)\|^2=B_Y.                       \tag{26}
\]

Since `A_X=||X R_X||^2`, equations (15), (25), and (26) give

\[
\begin{aligned}
 g
 &=Q[R_X]+\|J_\delta\|^2\\
 &=Q[\pi]+Q[s]+\|J_\delta\|^2\\
 &=\boxed{Q[\pi]+C_{XY}.}                         \tag{27}
\end{aligned}
\]

Consequently

\[
 \boxed{g-C_{XY}=Q[\pi]=2\mathfrak q[\pi]=2S.}   \tag{28}
\]

The quotient norm (12) is a legitimate global shorted metric, and
`C_XY` is the squared norm of its exact dual Riesz vector.  But the proposed
"remaining conditional variance" is the signed quantity `Q[pi]` in (28).
Declaring the bordered matrix in (23) to be a covariance Gram is therefore
equivalent to assuming its Schur complement `2S>=0`.  It is not an
independent probabilistic proof.

## A pointwise obstruction to local shorting

The failure of a generic independent-channel local covariance proof is
already visible before the regressions.  At a fixed `h>0`, the quadratic
density in (10) is

\[
 Q_h[U,J]
 =4h^2|U|^2+4h\operatorname {Re}(U\overline J)
 =
 \begin{pmatrix}\overline U&\overline J\end{pmatrix}
 \begin{pmatrix}4h^2&2h\\2h&0\end{pmatrix}
 \begin{pmatrix}U\\J\end{pmatrix}.               \tag{29}
\]

The coefficient matrix has

\[
 \det\begin{pmatrix}4h^2&2h\\2h&0\end{pmatrix}
 =-4h^2<0.                                         \tag{30}
\]

Hence it has one positive and one negative direction at every `h>0`.
Substituting the modular quotients in (7) only performs a real diagonal
congruence.  Away from removable centers, the determinant becomes

\[
 {-4h^2\over D_\epsilon(h)^2D_{-\epsilon}(h)^2}<0. \tag{31}
\]

Thus positivity of `q`, `q'`, and the denominators does not turn the signed
old metric on independent `(U,J)` channels into a pointwise covariance.  Its
positivity on the stipulated finite old prefix is an integrated,
graph-restricted fact.  The determinant calculation does not rule out a
stronger theta-specific pointwise restriction on the actually admissible
`(U,J)` graph; none is supplied here.

In particular, one may not interchange the global infimum in (12) with the
spatial integral and choose an `h`-dependent split.  Such a split is not a
polynomial decomposition, and the local `Q` form to which a parallel-sum
concavity theorem would have to be applied is indefinite.  A Cholesky square
root of the already-positive finite `Q` block exists, but it is
prefix-dependent and merely repackages the old hypothesis; it supplies no
theta-local estimate for the new border.

## Resulting proof target

The modular-reflection route gives a clean exact coordinate system:

1. `H` is the quotient norm (12) with `G_Y` represented by the assembled
   determinant `Delta/D` and `Q` by the correlated pair (10).
2. The mismatch is represented by the single modular inner product (14).
3. The optimal direct-sum Riesz vector is the two-regression pair
   `(q_X-q_A, Y(q_Y-q_X))`, with squared norm `C_XY`.
4. The gap between its sharp Cauchy constant and the available innovation is
   exactly the signed new pivot `Q[pi]`.

Therefore a noncircular continuation must add a complete-theta estimate that
proves `Q[pi]>=0` on the actual graded residual graph.  The generic
independent-channel shorting argument must retain the spatial integration and
keep `Omega`, `Delta`, residue, and drift assembled.  Positivity of the
modular denominators or an abstract conditional-variance label cannot supply
that estimate.  A genuinely theta-specific restriction of the admissible
pointwise graph would be additional input and remains a possible route.

## Nonclaims

- The pointwise matrix obstruction concerns independent assembled channels;
  it does not say that the old integrated `Q` block is negative.
- The sharp inequality (21) is an identity for the dual norm, not the desired
  replacement of `C_XY` by `g`.
- Prefix-dependent square roots or Schur factorizations remain valid but are
  tautological as new-pivot sign arguments.
- No finite computation, endpoint sign, or RH conclusion is used.
