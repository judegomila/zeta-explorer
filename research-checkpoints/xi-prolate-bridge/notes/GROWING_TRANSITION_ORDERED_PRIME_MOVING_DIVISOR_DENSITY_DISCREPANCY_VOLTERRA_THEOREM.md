# Growing-transition ordered-prime moving-divisor density--discrepancy Volterra theorem

## 0. Result and scope

Use the locked schedule

\[
 \lambda={p\over2},\quad p\geq5\text{ odd},\quad
 A=\lambda^2,\quad L=\log A,\quad
 \sigma:=hC,\quad {1\over2}<\sigma<1,\quad
 T_L={A^{hC}\over L^{2m}}={A^\sigma\over L^{2m}}.   \tag{0.1}
\]

Use the corrected endpoint-null source, exact exterior-defect whitening,
and seven-row space `E` of the frozen moving-divisor edge theorem.  All
ordered limits below are taken at fixed `lambda` before `lambda` grows.
Define the exact direct profiles

\[
 \mathfrak a_x(s)={\sqrt\lambda\over2}C_x(\lambda e^{-s}),
 \quad 0\leq s\leq L,                               \tag{0.2}
\]

and

\[
 \mathfrak b_x(t)={\sqrt\lambda e^t\over2}
       \sum_{l\geq1}H_x(l\lambda e^t),
 \quad t\geq0.                                      \tag{0.3}
\]

Put

\[
 \mu=\sum_{n\geq2}{\Lambda(n)\over n}\delta_{\log n},
 \qquad \mu_D=\mu-dr,                              \tag{0.4}
\]

and

\[
 (\mathcal V_\nu b)(s)=\int_{[s,\infty)}b(r-s)\,d\nu(r).
                                                               \tag{0.5}
\]

Then the complete prime upper orientation and Hermitian form are exactly

\[
 \boxed{Q_p^\uparrow=2\mathfrak a^*\mathcal V_\mu\mathfrak b,
 \qquad Q_{\rm mov}=\mathsf S(\mathfrak a,
                         \mathcal V_\mu\mathfrak b),}          \tag{0.6}
\]

where `mathsf S(U,V)=U^*V+V^*U`.  For the ordinary low rows

\[
 \mathcal A_0x=\int_0^L\mathfrak a_x(s)\,ds,
 \qquad \mathcal B_0x=\int_0^\infty\mathfrak b_x(t)\,dt,      \tag{0.7}
\]

Lebesgue density is the constant Volterra row

\[
 \mathcal V_{dr}\mathfrak b=\mathbf1_{[0,L]}\mathcal B_0.   \tag{0.8}
\]

Consequently

\[
 \boxed{Q_{\rm mov}=\mathsf S(\mathcal A_0,\mathcal B_0)
 +\mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b).}    \tag{0.9}
\]

The continuous form has the exact pole decomposition

\[
 Q_{\rm cont}=-\mathsf S(\mathcal A_0,\mathcal B_0)
 +\sum_{z=3,5,\ldots}\mathsf S(\mathcal A_z,\mathcal B_z).   \tag{0.10}
\]

Thus the density main in (0.9) cancels the continuous pole with the exact
sign and factor.  On `E`, the imposed complete row `mathcal A_1=0` and
the frozen continuation identity give

\[
 \mathcal A_0=\lambda\mathcal A_1=0.                \tag{0.11}
\]

Therefore

\[
 \boxed{\left.Q_{\rm mov}\right|_E
 =\left.\mathsf S(\mathfrak a,
             \mathcal V_{\mu_D}\mathfrak b)\right|_E.}       \tag{0.12}
\]

The edge theorem becomes the discrepancy feature-angle statement

\[
 \boxed{\left\|P_E\{\mathsf S(\mathfrak a,
       \mathcal V_{\mu_D}\mathfrak b)+Q_{\rm cont}\}P_E\right\|
 =o(T_L).}                                           \tag{0.13}
\]

It also gives

\[
 \boxed{P_E\mathsf S(\mathfrak a,
       \mathcal V_{\mu_D}\mathfrak b)P_E
 \succeq {c'_m\over8}T_LP_E.}                      \tag{0.14}
\]

Equivalently, uniformly for `x in E`,

\[
 \operatorname {Re}\langle\mathfrak a_x,
        \mathcal V_{\mu_D}\mathfrak b_x\rangle
 \geq {c'_m\over16}T_L\|x\|_D^2.                 \tag{0.15}
\]

This is a compressed physical feature forced by complete matching.  It
is not a positive-measure square, a pointwise PNT estimate, a global Pick
kernel, or an RH equivalence.  The state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_ORDERED_PRIME_EDGE_UNION_MOVING_DIVISOR_REDUCTION_THEOREM.md` | `47dd1decdb3a099cdb15ad929426d293f3f34ccb799b177ae02308c2051fa68c` |
| `tests/test_growing_transition_ordered_prime_edge_union_moving_divisor_reduction_theorem.py` | `6b37ecbf1534d0d140294bb995d0be1ad1da39a185ae4e5ae32bf7aee49fcdb6` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md` | `aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723` |
| `tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py` | `1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74` |

No PNT, short-interval estimate, zero table, external FIO theorem, or
numerical prolate datum is added.

## 2. Exact factor ledger and convergence

The moving row is

\[
 (Px)(u)=\sum_{n\geq\lambda/u}\Lambda(n)
             \sum_{l\geq1}H_x(lnu),
 \qquad u\in[\lambda^{-1},\lambda].                \tag{2.1}
\]

Set `u=lambda*e^(-s)`.  For `n>=e^s`, put `t=log(n)-s`.  Equation (0.3)
gives

\[
 \sum_{l\geq1}H_x(lnu)
 ={2e^s\over\sqrt\lambda n}\mathfrak b_x(\log n-s). \tag{2.2}
\]

Substitution in the exact oriented form gives

\[
\begin{aligned}
 Q_p^\uparrow(x,y)
 &={1\over2}\int_{\lambda^{-1}}^\lambda
                 \overline{C_x(u)}P_y(u)\,du\\
 &=2\int_0^L\overline{\mathfrak a_x(s)}
   \sum_{n\geq e^s}{\Lambda(n)\over n}
          \mathfrak b_y(\log n-s)\,ds.
\end{aligned}                                      \tag{2.3}
\]

This proves the upper identity in (0.6).  Hermitian averaging of the coefficient `2` gives

\[
 {2\mathfrak a^*\mathcal V_\mu\mathfrak b
  +2(\mathcal V_\mu\mathfrak b)^*\mathfrak a\over2}
 =\mathsf S(\mathfrak a,\mathcal V_\mu\mathfrak b). \tag{2.4}
\]

Thus the factor `2` in the upper form and the factor in (0.6) are exact;
no unnormalized adjoint is added.

After the ordered Poisson limit, the profiles are

\[
\begin{aligned}
 \mathfrak a_f(s)
 &= {\sqrt\lambda\over2}\sum_{m\geq1}f(m\lambda e^{-s})
 +{e^s\over2\sqrt\lambda}\sum_{m\geq1}f(me^s/\lambda),\\
 \mathfrak b_f(t)
 &= {1\over2\sqrt\lambda}\sum_{m\geq1}f(me^{-t}/\lambda).
\end{aligned}                                                   \tag{2.5}
\]

These are exactly the frozen continuous profiles, not abstract
generators.  Endpoint-null regularity gives
`mathfrak b_f(t)=O_f(e^(-t))`, and hence

\[
 \sum_{n\geq e^s}{\Lambda(n)\over n}
       |\mathfrak b_f(\log n-s)|
 \ll_{\lambda,f}\sum_{n\geq2}{\Lambda(n)\over n^2}<\infty. \tag{2.6}
\]

The atomic and Lebesgue pieces pair separately and ordinarily.  These
formulas are asserted only after the prime cutoff and ordered Fejer limit
at fixed `lambda`, not coefficientwise at finite Fejer cutoff.

## 3. Density cancellation and exact edge removal

Translation in the Lebesgue piece gives

\[
 (\mathcal V_{dr}\mathfrak b_x)(s)
 =\int_s^\infty\mathfrak b_x(r-s)\,dr=\mathcal B_0x. \tag{3.1}
\]

Therefore

\[
 \mathfrak a^*\mathcal V_{dr}\mathfrak b
 =\mathcal A_0^*\mathcal B_0,                      \tag{3.2}
\]

which proves (0.9).  The exact continuous upper orientation is

\[
 Q_{\rm cont}^\uparrow=-2\mathcal A_0^*\mathcal B_0
 +2\sum_{z=3,5,\ldots}\mathcal A_z^*\mathcal B_z. \tag{3.3}
\]

Hermitian averaging proves (0.10), and addition yields

\[
 \boxed{Q_X=\sum_{z=3,5,\ldots}
 \mathsf S(\mathcal A_z,\mathcal B_z)
 +\mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b).}    \tag{3.4}
\]

The cancellation is global in the complete ordered row.  It does not
assign the density main to either half of the low/hard edge split.

The edge theorem has the coordinate identity

\[
 Q_{{\rm off},{\rm edge}}=Q_{\rm mov}-Q_{>>}^{\rm raw}
             -Q_{p,11}-Q_{{\rm res},\leq A}.         \tag{3.5}
\]

Using (0.12), its compression is

\[
\begin{aligned}
 P_EQ_{{\rm off},{\rm edge}}P_E
 =P_E\{&\mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b)
 -Q_{>>}^{\rm raw}-Q_{p,11}\\
 &-Q_{{\rm res},\leq A}\}P_E.
\end{aligned}                                      \tag{3.6}
\]

The removed blocks satisfy

\[
 \|P_EQ_{>>}^{\rm raw}P_E\|=o(T_L),\quad
 \|P_EQ_{p,11}P_E\|=o(T_L),\quad
 \|P_EQ_{{\rm res},\leq A}P_E\|=O_m(L^2)=o(T_L). \tag{3.7}
\]

This proves that the discrepancy feature retains the exact edge matching
and the lower scale (0.13)--(0.15).

Its only automatic square decomposition is indefinite:

\[
 \mathcal G_{D,\pm}
 ={\mathfrak a\pm\mathcal V_{\mu_D}\mathfrak b\over\sqrt2}. \tag{3.8}
\]

Indeed,

\[
 \mathsf S(\mathfrak a,\mathcal V_{\mu_D}\mathfrak b)
 =\mathcal G_{D,+}^*\mathcal G_{D,+}
  -\mathcal G_{D,-}^*\mathcal G_{D,-}.              \tag{3.9}
\]

Consequently (0.14) implies

\[
 \mathcal G_{D,+}^*\mathcal G_{D,+}
 \succeq {c'_m\over8}T_LI_E,
 \quad s_{\min}(\mathcal G_{D,+}|_E)
 \geq\sqrt{{c'_mT_L\over8}}.                      \tag{3.10}
\]

No separate lower frame for either factor follows.

## 4. Exact Mellin finite-tail formula

For `Re z>0`, define

\[
 \Phi(z)=\int_0^\infty e^{-zr}\,d\mu(r)
 =-\frac{\zeta'(1+z)}{\zeta(1+z)},                 \tag{4.1}
\]

\[
 E(z)=\int_0^\infty e^{-zr}\,d\mu_D(r)
 =-\frac{\zeta'(1+z)}{\zeta(1+z)}-{1\over z},     \tag{4.2}
\]

and

\[
 T_{D,L}(z)=\int_{[L,\infty)}e^{-zr}\,d\mu_D(r)
 =\sum_{n>A}{\Lambda(n)\over n^{1+z}}-{A^{-z}\over z}.       \tag{4.3}
\]

There is no atom at `L`, because `A=p^2/4` is not an integer.  For
`Re p,Re q>0`, `p!=q`, direct integration over
`0<=s<=min(L,r)` gives

\[
 \boxed{\int_0^L e^{-ps}
 (\mathcal V_{\mu_D}e^{-q\,\cdot})(s)\,ds
 ={E(q)-E(p)+T_{D,L}(p)-e^{-(p-q)L}T_{D,L}(q)
       \over p-q}.}                                 \tag{4.4}
\]

The diagonal is its continuous divided-difference limit.  The
corresponding atomic tail before density subtraction is

\[
 T_{\mu,L}(z)=\sum_{n>A}{\Lambda(n)\over n^{1+z}}. \tag{4.5}
\]

The Lebesgue contribution is exactly

\[
 \int_0^L e^{-ps}(\mathcal V_{dr}e^{-q\,\cdot})(s)\,ds
 ={1-e^{-pL}\over pq}.                              \tag{4.6}
\]

Dropping `T_(D,L)` replaces the physical carrier by a different
infinite-half-line problem.

## 5. Threshold geometry and finite rows

The low and hard atomic rows are

\[
 (\mathcal V_{\leq A}b)(s)
 =\sum_{e^s\leq n\leq A}{\Lambda(n)\over n}b(\log n-s),      \tag{5.1}
\]

and

\[
 (\mathcal V_{>A}b)(s)
 =\sum_{n>A}{\Lambda(n)\over n}b(\log n-s).        \tag{5.2}
\]

At `s=L-y`, the local upper edge is exactly

\[
 (\mathcal V_{\leq A}b)(L-y)
 =\sum_{Ae^{-y}\leq n\leq A}{\Lambda(n)\over n}
       b\!\left(y+\log{n\over A}\right).           \tag{5.3}
\]

This is a source-weighted short multiplicative prime interval, not an
available local asymptotic.  On `E`,

\[
 \mathfrak b_x(0)=\Gamma_{\rm out}(x)=0.            \tag{5.4}
\]

Thus the trace null removes the value of every threshold atom when it
enters or leaves (5.1).  It does not make any summand in the interior of
(5.3) vanish.  The row `A_0=0` removes the density cross, and
`Gamma_out=0` removes the common endpoint value; finitely many such rows
do not algebraically annihilate the distributed Volterra feature.
Moreover, every nonzero further subspace of `E` inherits (0.14).

## 6. No square, Pick, or PNT shortcut

For one atom `R=log n<=L`, the profile operator is

\[
 (J_Rb)(s)=\mathbf1_{[0,R]}(s)b(R-s).               \tag{6.1}
\]

On `L^2([0,R])`,

\[
 J_R^2=I,                                           \tag{6.2}
\]

and both the even and odd reflection sectors occur.  A positive atomic
coefficient therefore does not turn the inward--outward cross into a
square.  The signed discrepancy measure supplies no alternative
accretivity.

The function `E` in (4.2) is pole-deleted prime discrepancy, not the
completed logarithmic derivative.  It is holomorphic on `Re z>0` in the
ordinary Euler-product half-plane, regardless of RH.  Critical-line Pick
positivity requires gamma completion, critical-variable reflection, all
generator points, and the completed infinite-half-line carrier.  Formula
(4.4) instead has a binding finite tail and is tested only after one
finite physical packet compression.  It is not a global Pick condition,
so no RH equivalence follows.

A pointwise discrepancy envelope enters (0.5) only after Stieltjes
integration by parts, which creates derivatives and endpoint norms of
the growing prolate profiles.  Those norms are not controlled at scale
`T_L`.  Consequently neither an ordinary pointwise PNT envelope nor an
RH-scale pointwise discrepancy estimate is claimed to prove (0.13).

## 7. Conclusion

The moving-divisor row is exactly a log-prime Volterra operator.  Its
Lebesgue-density component is `S(A_0,B_0)` and cancels the continuous
pole.  The null `A_1=0` exposes the forced edge compensation as the
source-coupled discrepancy feature in (0.12).  Its lower bound comes from
the proved complete matching, not positivity of the measure or Mellin
transform.  No complete central sign, determinant conclusion, RH
statement, or von Mangoldt bound is proved.
