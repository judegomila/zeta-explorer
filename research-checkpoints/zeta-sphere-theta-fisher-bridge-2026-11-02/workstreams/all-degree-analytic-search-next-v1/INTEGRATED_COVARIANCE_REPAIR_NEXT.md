# Integrated covariance repair for the Bell-fiber Hankel extension

## Scope and outcome

This note isolates the exact mechanism by which integration can repair the
negative near-center odd-H5 Bell fiber.  It works at the level of the next
Schur pivot and does not assume the endpoint spectral sign `f>=0`.

There are two versions.

1. If the old lower block is positive on each spatial piece, the global
   pivot is the sum of the regional pivots plus an exact regression-variance
   term.  For a core/tail split this variance is a parallel-sum quadratic
   form, with no lost constant.
2. At higher order the core lower block can itself be indefinite.  Then a
   positive auxiliary anchor gives an exact identity requiring positivity
   only of the *complete* old block, which is precisely the induction
   hypothesis.  Optimized scalar anchors expose a directional covariance
   reserve and a concrete signed-budget lemma.

The audited H5 signs imply analytically that every sufficiently small center
interval has a negative regional pivot.  The established positive integrated
H5 pivot is therefore a genuine tail-plus-covariance repair, not an integral
of positive fibers.  This supplies a low-order consistency test of the exact
identity.  It does not prove the proposed all-degree signed-budget lemma, any
new Hankel determinant, the endpoint sign, or RH.

## 1. Bell-fiber block notation

For `r` in `{0,1}` and `n>=1`, put

\[
 K_{n,r}(h)=2h^2\bigl(c_{r+i+j}(h)\bigr)_{i,j=0}^{n},
 \qquad
 M_{n,r}=\int_0^\infty K_{n,r}(h)\,dh=2H_n^{(r)}.       \tag{1}
\]

The complete-theta decay makes every entry absolutely integrable.  Split
the density and its integral as

\[
 K(h)=
 \begin{pmatrix}A(h)&b(h)\\ b(h)^*&d(h)\end{pmatrix},
 \qquad
 M=
 \begin{pmatrix}A&b\\b^*&d\end{pmatrix},             \tag{2}
\]

where the old block has size `n`, and

\[
 A=\int A(h)dh,\qquad b=\int b(h)dh,\qquad
 d=\int d(h)dh.                                      \tag{3}
\]

Assume only the old integrated prefix `A>0`.  Its next pivot is

\[
 \boxed{\mathcal S_{n,r}=d-b^*A^{-1}b
 =2\frac{D_n^{(r)}}{D_{n-1}^{(r)}}.}                 \tag{4}
\]

Thus positivity of (4) is exactly the next Hankel extension, not a surrogate
for it.  No sign of an individual `K(h)`, or of `f`, has entered.

The algebraic Schur and anchor identities below remain valid after
multiplication of `K(h)` by any fixed nonnegative spatial weight for which
their displayed integrals converge.  This includes the positive shift
weights used in the finite H5 theorem.  The later unweighted center
asymptotics use the specific `2h^2` density and are not asserted for an
arbitrary reweighting.

## 2. Exact law of total Schur variance

Let a finite measurable partition, or a countable one for which every
displayed sum below converges, give integrated pieces

\[
 M_j=\begin{pmatrix}A_j&b_j\\b_j^*&d_j\end{pmatrix},
 \qquad M=\sum_jM_j.                                 \tag{5}
\]

First suppose every `A_j>0`.  Define

\[
 \alpha_j=A_j^{-1}b_j,
 \qquad
 \bar\alpha=A^{-1}b,
 \qquad A=\sum_jA_j,\quad b=\sum_jb_j.             \tag{6}
\]

Direct expansion gives the exact conditional-variance identity

\[
 \boxed{
 \mathcal S(M)=
 \sum_j\bigl(d_j-b_j^*A_j^{-1}b_j\bigr)
 +\sum_j(\alpha_j-\bar\alpha)^*A_j
             (\alpha_j-\bar\alpha).}               \tag{7}
\]

Indeed the second sum is

\[
 \sum_j\alpha_j^*A_j\alpha_j-\bar\alpha^*A\bar\alpha
 =\sum_jb_j^*A_j^{-1}b_j-b^*A^{-1}b,                \tag{8}
\]

which proves (7).  The regional full matrices may be indefinite: only their
old blocks are assumed positive, and their regional pivots in the first sum
may have either sign.

For a core/tail split, (7) has the sharper closed form

\[
 \boxed{
 \mathcal S(M)=\mathcal S(M_C)+\mathcal S(M_T)
 +(\alpha_C-\alpha_T)^*(A_C:A_T)(\alpha_C-\alpha_T),} \tag{9}
\]

where

\[
 A_C:A_T=(A_C^{-1}+A_T^{-1})^{-1}
          =A_C-A_C(A_C+A_T)^{-1}A_C>0.              \tag{10}
\]

Equation (9) is the matrix version of the law of total variance.  It is the
canonical repair identity when both regional old blocks are positive.

There is also a pointwise version.  If `A(h)>0` almost everywhere on a
region `E`, and both displayed integrands below are integrable there (it is
enough in the present finite-dimensional setting to require
`b(h)^*A(h)^{-1}b(h)` integrable together with the entrywise integrability
already assumed for `A,b,d`), set `alpha(h)=A(h)^{-1}b(h)` and
`alpha_E=A_E^{-1}b_E`.  Approximation by finite partitions in (7), or direct
expansion, gives

\[
 \mathcal S(M_E)=
 \int_E\bigl[d(h)-b(h)^*A(h)^{-1}b(h)\bigr]dh
 +\int_E(\alpha(h)-\alpha_E)^*A(h)
                 (\alpha(h)-\alpha_E)dh.            \tag{11}
\]

This shows precisely how variation of the local regression vector repairs
negative local pivots within one region.

### Scalar low-order check

For the first nontrivial odd extension the old block is scalar.  The exact
theta identity

\[
 c_1(h)=-\tfrac12\psi(h)^2(\log\psi)''(h)>0          \tag{12}
\]

implies
\[
 A_E=2\int_E h^2c_1(h)\,dh>0
\]
on every
positive-measure region.  Thus (9) applies to every core/tail split, and its
covariance term reduces exactly to

\[
 \frac{A_CA_T}{A_C+A_T}
 \left|\frac{b_C}{A_C}-\frac{b_T}{A_T}\right|^2
 =\frac{|A_Tb_C-A_Cb_T|^2}{A_CA_T(A_C+A_T)}.         \tag{13}
\]

This direct scalar expansion checks both the sign and the constant in (9).

## 3. The actual odd-H5 center has a negative regional pivot

For odd H5, remove the harmless positive diagonal congruence and write

\[
 \mathcal K(h)=\bigl(c_{1+i+j}(h)\bigr)_{i,j=0}^{2}
 =\begin{pmatrix}\mathcal A(h)&\beta(h)\\
                  \beta(h)^*&\delta(h)\end{pmatrix}. \tag{14}
\]

The independently audited center signs are

\[
 \mathcal A(0)>0,
 \qquad \det\mathcal K(0)<0.                        \tag{15}
\]

Consequently the pointwise center pivot

\[
 \sigma_0=\delta(0)-\beta(0)^*\mathcal A(0)^{-1}
                    \beta(0)
          =\frac{\det\mathcal K(0)}{
                  \det\mathcal A(0)}<0.             \tag{16}
\]

This uses only the strict audited inequalities; the approximate determinant
value is irrelevant.

The Bell fiber is even and real analytic in `h`.  For the small core
`C_H=[0,H]`, therefore,

\[
 M_C(H)=\int_0^H2h^2\mathcal K(h)dh
       =\lambda_H\mathcal K(0)+O(H^5),
 \qquad \lambda_H=\frac{2H^3}{3}.                   \tag{17}
\]

Schur complementation of (17) gives the analytic asymptotic

\[
 \boxed{\mathcal S(M_C(H))
       =\lambda_H\sigma_0+O(H^5)<0}                 \tag{18}
\]

for every sufficiently small positive `H`.  Hence the vanishing bridge
weight `h^2` suppresses but does not change the sign of an arbitrarily small
center region.

Equation (11) refines this conclusion.  On a sufficiently small core,
`\mathcal A(h)>0`, and

\[
 \alpha(h)=\mathcal A(h)^{-1}\beta(h)
           =\alpha_0+O(h^2).                        \tag{19}
\]

The within-core covariance in (11) is therefore `O(H^7)`, whereas

\[
 \int_0^H2h^2\sigma(h)dh
 =\lambda_H\sigma_0+O(H^5).                         \tag{20}
\]

Thus covariance confined to a shrinking center cannot erase its leading
negative pivot.

Let `A,b` now denote the complete old odd-H3 block and border, and put
`\alpha=A^{-1}b`.  The old integrated block is positive.  For small `H`, both
`A_C(H)>0` and `A_T(H)=A-A_C(H)>0`, so (9) applies.  Its covariance term has
the matching leading scale

\[
 \begin{aligned}
 \mathcal C_{C,T}(H)
 &=(\alpha_C-\alpha_T)^*(A_C:A_T)
                     (\alpha_C-\alpha_T)\\
 &=\lambda_H(\alpha_0-\alpha)^*\mathcal A(0)
                    (\alpha_0-\alpha)+O(H^5).       \tag{21}
 \end{aligned}
\]

The audited integrated H5 theorem has `\mathcal S(M)>0`.  Combining it with
(9) and (18) proves, for all sufficiently small `H`,

\[
 \boxed{
 \mathcal S(M_T(H))+\mathcal C_{C,T}(H)
 >-\mathcal S(M_C(H))>0.}                           \tag{22}
\]

This is the promised analytic low-fiber test: the known H5 result is
literally a tail-pivot plus regression-covariance repair of a negative center
pivot.  Equation (22) does **not** say that covariance alone pays the cost;
the tail pivot and covariance must remain coupled unless separate estimates
are proved.

## 4. Domain-safe all-degree anchor identity

The positive-piece hypothesis in (7) cannot be used at every degree.  The
audited odd-degree-19 core has an indefinite old regional block.  A domain-
safe identity must therefore invert only the complete old block `A>0`.

Let `R(h)>0` be any measurable auxiliary matrix density satisfying

\[
 \int_0^\infty R(h)dh=A,                            \tag{23}
\]

and suppose the following integrals converge.  Set

\[
 r(h)=R(h)^{-1}b(h),\qquad \bar r=A^{-1}b.           \tag{24}
\]

Then direct completion of squares gives the exact identity

\[
 \boxed{
 \mathcal S(M)=
 \int_0^\infty\!
   \bigl[d(h)-b(h)^*R(h)^{-1}b(h)\bigr]dh
 +\int_0^\infty\!
   (r(h)-\bar r)^*R(h)(r(h)-\bar r)dh.}             \tag{25}
\]

The second term is nonnegative.  The auxiliary replacement of `A(h)` by
`R(h)` is exactly neutral after integration; no local Bell block is declared
positive.

For a scalar anchor `R(h)=\rho(h)A`, where `\rho>0` and
`\int\rho=1`, define

\[
 u(h)=A^{-1/2}b(h),\qquad a(h)=\|u(h)\|,
 \qquad U=\int u(h)dh,\qquad L=\int a(h)dh.        \tag{26}
\]

The anchor cost is `\int a(h)^2/\rho(h)\,dh`.  Cauchy--Schwarz gives its
exact infimum

\[
 \inf_\rho\int\frac{a(h)^2}{\rho(h)}dh=L^2,         \tag{27}
\]

attained by `\rho=a/L` away from zeros of `a`; positive approximants give the
same identity if `a` vanishes.  At this optimum, (25) becomes

\[
 \boxed{\mathcal S(M)=\int d(h)dh-L^2+\Gamma,
 \qquad \Gamma=L^2-\|U\|^2\ge0.}                   \tag{28}
\]

If `L>0`, let `dnu=a(h)dh/L` and `e(h)=u(h)/a(h)` on the support of `a`.
Then the reserve is exactly the directional variance

\[
 \boxed{
 \Gamma=L^2\bigl(1-\|\mathbb E_\nu e\|^2\bigr)
 =\frac{L^2}{2}\mathbb E_{\nu\otimes\nu}
       \|e(H)-e(H')\|^2.}                          \tag{29}
\]

Equivalently,

\[
 \Gamma=\iint
 \bigl[a(h)a(k)-\operatorname{Re}u(h)^*u(k)\bigr]
 \,dh\,dk.                                         \tag{30}
\]

Equations (25)--(30) are valid at every degree under the induction
hypothesis `A>0`, even when the center fiber or the center integrated old
block is indefinite.

For estimates it is often better to use a finite spatial partition rather
than the continuum optimum.  Put

\[
 b_j=\int_{E_j}b(h)dh,\quad d_j=\int_{E_j}d(h)dh,
 \quad u_j=A^{-1/2}b_j,\quad a_j=\|u_j\|,
 \quad L_{\mathcal P}=\sum_j a_j.                  \tag{31}
\]

Optimizing the regional anchors `R_j=w_jA` yields

\[
 \boxed{
 \mathcal S(M)=
 \sum_j(d_j-L_{\mathcal P}a_j)
 +2\sum_{i<j}
   \bigl(a_i a_j-\operatorname{Re}u_i^*u_j\bigr).} \tag{32}
\]

Terms with `a_j=0` are omitted from the anchor optimization and recovered by
the evident zero-weight limit; then `u_j=0`, so every formula remains exact.

This avoids inverting every regional old block and retains the actual signed
regional diagonal masses.  The two terms in (32) depend on the chosen
partition, although their sum does not.  Refinement can enlarge both the
anchor cost and its compensating covariance, so estimates must keep them
paired at one fixed, source-adapted partition.

## 5. A precise all-degree repair lemma to prove

Equation (32) converts the missing analytic step into a theta-specific
angular budget with exact constants.  Suppose a degree-dependent partition
has bounds

\[
 \operatorname{Re}u_i^*u_j
 \le (1-\delta_{ij})a_i a_j,
 \qquad 0\le\delta_{ij}\le2,                       \tag{33}
\]

for selected pairs.  Every omitted pair in (32) is nonnegative by Cauchy.
Therefore the following is a sufficient next-pivot condition:

\[
 \boxed{
 \sum_j(d_j-L_{\mathcal P}a_j)
 +2\sum_{(i,j)\in\mathcal E}\delta_{ij}a_i a_j
 \ge0.}                                            \tag{34}
\]

For a core/tail split this reads

\[
 (d_C-La_C)+(d_T-La_T)+2\delta a_Ca_T\ge0,
 \quad L=a_C+a_T.                                  \tag{35}
\]

Thus a usable theorem may bound a negative core remainder by a positive
tail remainder plus the angular separation of the actual theta border
vectors.  It need not make either regional Bell matrix positive.

The degree-dependent outer theorem supplies a natural tail boundary
`H_J=log J+O(1)` once `J` is chosen to cover the current block.  A viable
all-degree program is therefore:

* partition `[0,H_J]` according to changes in the direction of
  `A^{-1/2}b(h)`, leaving `[H_J,\infty)` as the positive outer region;
* prove the signed regional remainders in (34) directly from complete-theta
  arithmetic;
* prove only the cross-region angular separations needed to pay the negative
  remainders.

This is a candidate lemma, not a proved estimate.  The exact identity shows
that separately taking absolute values of the border entries would discard
the only available covariance reserve.

## 6. Why two tempting substitutes do not close the repair

### Brascamp--Lieb has the wrong direction

The quantity needed in (29) is a **lower** bound on a vector variance.
Ordinary Brascamp--Lieb or Poincare estimates under a curvature lower bound
give an upper bound on variance in terms of derivatives.  No positive lower
bound can depend on the spatial measure alone: even for a Gaussian measure,
the admissible direction field `e(h)=e_0` is constant and makes `\Gamma=0`.
Theta-specific rotation or separation of the border direction is therefore
indispensable.  A curvature estimate for the scalar weight cannot replace
(33).

### Determinant integrals retain the same signed mixed terms

For `m=n+1`, define the normalized mixed discriminant

\[
 \mathfrak D(B_1,\ldots,B_m)=\frac1{m!}
 \left.\partial_{t_1}\cdots\partial_{t_m}
 \det\!\left(\sum_{j=1}^m t_jB_j\right)\right|_{t=0}. \tag{36}
\]

It satisfies `\mathfrak D(B,\ldots,B)=\det B`.  Multilinearity gives the exact
Bell-fiber determinant integral

\[
 \det M_{n,r}=\int_{[0,\infty)^m}
 \mathfrak D\bigl(K(h_1),\ldots,K(h_m)\bigr)
 \,dh_1\cdots dh_m.                                \tag{37}
\]

At odd H5, the unweighted fiber `\mathcal K(h)` from (14) has negative
determinant for every sufficiently small `h`.  Hence, for sufficiently small
positive `h`,
\[
 \mathfrak D(K(h),K(h),K(h))
 =\det K(h)=(2h^2)^3\det\mathcal K(h)<0.            \tag{38}
\]
By continuity, the mixed integrand in (37) is negative on a punctured
neighborhood of the center diagonal (and vanishes at the exact origin
because of the spatial weight).  Thus (37) is not a positive determinant
representation; cross-fiber mixed discriminants must repair it.

The spectral Andreief formula has the same issue in a different coordinate:

\[
 D_n^{(r)}=\frac1{(n+1)!(2\pi)^{n+1}}
 \int_{\mathbb R^{n+1}}
 \prod_{j=0}^{n}\bigl[t_j^{2r}f(t_j)\bigr]
 \prod_{0\le i<j\le n}(t_j^2-t_i^2)^2
 \,dt_0\cdots dt_n.                                 \tag{39}
\]

Without `f>=0`, the product in (39) is signed.  Assuming its positivity is
therefore not an independent covariance repair.

## 7. Limits and exact next target

The canonical identity (9) explains the successful H5 integration and gives
the strongest formula whenever regional old blocks are positive.  It is not
an all-degree framework by itself: the certified degree-19 core old block is
already indefinite, so it is unavailable as a positive regional metric and
the `A_j>0` premise of (7)--(11) fails there.

The anchor identity (25), or its regional form (32), is the surviving
all-degree statement.  It reduces the open problem to proving (34) for a
theta-derived, degree-dependent partition, with the complete old Hankel
prefix as the only positivity input.  Standard curvature inequalities do
not provide the required lower directional variance, and determinant
integrals do not remove the signed center contribution.

No finite-degree positivity is extrapolated here.  The H5 evidence is used
only to test the exact repair identity, and the degree-19 evidence is used
only to reject a positive-regional-block premise.

The theta normalization and pointwise obstruction are those of
`THETA_MOMENT_STRUCTURE_NEXT.md` and
`evidence/v18-curated/post_v7_audit/POINTWISE_H5_AUDIT.md`; the positive
integrated comparison is
`evidence/v18-curated/integrated_h5_v1/INTEGRATED_H5_PROOF.md`.  The
indefinite higher-order core input is
`evidence/v18-curated/core_inertia_v2/PROOF.md`.
