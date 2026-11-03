# The two-generator criterion as a correlated score projection

## Scope and result

This note gives a geometric form of the five-scalar condition in
`THETA_SOBOLEV_AUXILIARY_NEXT.md`.  It does not estimate the five scalars
separately.  Instead, it keeps the two correlations as one vector in the
exact Gram metric.

For the actual signed Galerkin residual `q`, normalize the positive measure

\[
 d\nu(t)={q(t)^2W(t)^2\over C}\,dt,
 \qquad C=\int_{\mathbb R}q^2W^2dt,
 \qquad W=2\Xi .                                  \tag{1}
\]

On this probability space put

\[
 X={q'\over q},\qquad T=t,\qquad L={W'\over W},
 \qquad Z=L+{X\over2}.                            \tag{2}
\]

All quotients in (2) are understood `nu`-almost everywhere.  This creates no
domain problem: multiplication by `q^2W^2` removes the apparent poles, and
the resulting products are polynomial times a Schwartz function.  Values at
the discrete zeros of `qW` may be assigned arbitrarily.

Let `P_U` be orthogonal projection in `L^2(nu)` onto

\[
 U=\operatorname {span}\{X,T\}.                  \tag{3}
\]

Then the old-data two-generator margin and the exact next signed pivot are

\[
 \boxed{
 \begin{aligned}
 {\mathcal H_{N,\epsilon}\over C}
  &=\|P_UZ\|_\nu^2-{\|X\|_\nu^2\over4},\\
 {2\pi\mathcal S_{N,\epsilon}\over C}
  &=\|Z\|_\nu^2-{\|X\|_\nu^2\over4}.
 \end{aligned}}                                  \tag{4}
\]

Consequently

\[
 \boxed{
 2\pi\mathcal S_{N,\epsilon}-\mathcal H_{N,\epsilon}
 =C\|(I-P_U)L\|_\nu^2\geq0.}                    \tag{5}
\]

Thus the sufficient lemma is precisely a lower bound on the *joint* score
projection.  It is not a pair of Cauchy estimates, and (5) identifies exactly
what those estimates would discard.  The condition remains unproved.  No
new Xi--Laguerre sign, all-degree theorem, or RH conclusion is claimed.

## 1. Exact domain and Gram matrix

Retain the notation

\[
 \begin{aligned}
 A&=\int q'^2W^2dt,& B&=\int qq''W^2dt,\\
 C&=\int q^2W^2dt,& D&=\int t^2q^2W^2dt,\\
 E&=\int tqq'W^2dt,
 \end{aligned}                                   \tag{6}
\]

for a nontrivial rung `kappa=2N+epsilon>=1`.  Since `q` is a nonzero
polynomial and `W` is not identically zero, `C>0`.  Moreover

\[
 {K\over C}
 =\begin{pmatrix}
   \langle X,X\rangle_\nu&\langle X,T\rangle_\nu\\
   \langle X,T\rangle_\nu&\langle T,T\rangle_\nu
  \end{pmatrix},
 \qquad
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix}.         \tag{7}
\]

The matrix is positive definite.  Equality in its Gram determinant would
make `q'=lambda*t*q` as polynomials on an open set, which is impossible for a
nonzero polynomial at `kappa>=1`.

The two exact integrations by parts from the preceding note become

\[
 \begin{aligned}
 C\langle X,L\rangle_\nu
  &=-{A+B\over2}=:u,\\
 C\langle T,L\rangle_\nu
  &=-{C+2E\over2}=:v.                             \tag{8}
 \end{aligned}
\]

There are no boundary terms because `W` is Schwartz and `q` is polynomial.
If `Y=P_UL`, the normal equations and (7)--(8) give

\[
 \|Y\|_\nu^2={1\over C}r^TK^{-1}r,
 \qquad r=(u,v)^T.                               \tag{9}
\]

Since `X` belongs to `U`,

\[
 \langle X,L\rangle_\nu=\langle X,Y\rangle_\nu.
                                                               \tag{10}
\]

Using `u=-(A+B)/2` in the definition of `mathcal H` therefore yields

\[
 \begin{aligned}
 {\mathcal H_{N,\epsilon}\over C}
 &=\|Y\|_\nu^2+\langle X,Y\rangle_\nu\\
 &=\left\|Y+{X\over2}\right\|_\nu^2
   -{\|X\|_\nu^2\over4}\\
 &=\|P_UZ\|_\nu^2-{\|X\|_\nu^2\over4}.
 \end{aligned}                                   \tag{11}
\]

This proves the first line of (4).

## 2. The exact pivot and the missing orthogonal component

The Sobolev identity is

\[
 2\pi\mathcal S_{N,\epsilon}
 =\int\left\{q^2W'^2-{q'^2+qq''\over2}W^2\right\}dt.
                                                               \tag{12}
\]

Equations (1), (2), and (8) give

\[
 {2\pi\mathcal S_{N,\epsilon}\over C}
 =\|L\|_\nu^2+\langle X,L\rangle_\nu
 =\left\|L+{X\over2}\right\|_\nu^2
  -{\|X\|_\nu^2\over4}.                        \tag{13}
\]

Because `X/2` lies in `U`, subtracting (11) from (13) proves (5).  It also
shows that the square minimized in the two-generator construction is exactly

\[
 C\|(I-P_U)L\|_\nu^2.                            \tag{14}
\]

This is a useful noncircular distinction.  Positivity of the full norm in
(13) at the threshold is the desired pivot.  Positivity of the smaller
projected norm in (11) is a strictly stronger old-data lemma.  Projection
does not manufacture the target sign; it quantifies the reserve that the
two-generator rule deliberately refuses to use.

## 3. Collapse to one combined vector

The score-shifted correlations simplify further.  From (7)--(8),

\[
 \boxed{
 C\binom{\langle X,Z\rangle_\nu}
          {\langle T,Z\rangle_\nu}
 =-{1\over2}\binom{B}{C+E}.}                    \tag{15}
\]

Thus (11) is equivalently

\[
 \boxed{
 \mathcal H_{N,\epsilon}
 ={1\over4}
 \left\{
  \binom{B}{C+E}^{\!T}K^{-1}\binom{B}{C+E}-A
 \right\}.}                                     \tag{16}
\]

The exact all-degree sufficient condition is therefore the single
Mahalanobis-norm inequality

\[
 \boxed{
  \left\|K^{-1/2}\binom{B}{C+E}\right\|^2\geq A.} \tag{17}
\]

Clearing the positive determinant `AD-E^2` gives

\[
 \boxed{
 DB^2-2EB(C+E)+A(C+E)^2
 \geq A(AD-E^2).}                                \tag{18}
\]

This is algebraically the five-scalar inequality in the preceding note, but
(15)--(18) display its correlation structure directly.  Keeping only the
first coordinate recovers the derivative-only test `B^2>=A^2`.  Keeping only
the second coordinate gives a separate drift test.  Neither one-coordinate
bound retains the off-diagonal `E`; the joint inverse metric in (17) is the
quantity that must be controlled.

## 4. Two exact old-space identities for the actual residual

The projection formula applies to any polynomial `q`.  The actual Galerkin
residual has additional exact information which a theta-specific proof can
use.  Write

\[
 \Lambda=W'^2-WW''=-W^2L'.                       \tag{19}
\]

On its parity ladder the monic residual satisfies

\[
 \int_{\mathbb R}q(t)p(t)\Lambda(t)dt=0          \tag{20}
\]

for every old same-parity polynomial `p` of degree at most `kappa-2`.
For `kappa>=2`, two canonical choices are

\[
 p_1=q'',\qquad p_2=tq'-\kappa q.                \tag{21}
\]

Both have the required parity and degree; the leading term in `p_2` cancels.
Dividing (20) only after inserting the positive measure (1) gives the
division-free identities

\[
 \boxed{
 \begin{aligned}
 \mathbb E_\nu\!\left[{q''\over q}(-L')\right]&=0,\\
 \mathbb E_\nu\!\left[(TX-\kappa)(-L')\right]&=0.
 \end{aligned}}                                  \tag{22}
\]

At a zero of `q`, (22) means the original polynomial products in (20), not a
principal value.  For any such quotient `R=p/q`, integration by parts also
gives the equivalent joint form

\[
 \boxed{
 0=\mathbb E_\nu[R'L+2R(X+L)L].}                 \tag{23}
\]

Equations (22)--(23) are not the new pivot: their test polynomials are in the
old space, so they are already fixed by the stipulated old block.  They do,
however, couple the logarithmic theta curvature `-L'` to precisely the
polynomial dilation and derivative features that occur in (17).  This is
residual-dependent information not encoded in the source-free countermodels
above; by itself it is not theta-specific.

The base `kappa=1` has no nonzero old polynomial in (21); it must be handled
directly.  The even base `kappa=0` is already positive and lies outside the
nontrivial two-generator construction.

## 5. Surviving analytic obligation

The next useful lemma is now sharply separated from both target-equivalent
and coordinatewise statements:

\[
 \boxed{
 \text{derive (17) for the complete-theta residual from an assembled use of
 (22)--(23) and the theta orbit/Ewald identities.}}               \tag{24}
\]

A proof should keep the vector `(B,C+E)` intact until after applying the
inverse Gram metric.  Bounding `B`, `C+E`, `E`, or `AD-E^2` independently can
lose the cross compensation in (18).  Likewise, replacing `P_U Z` by `Z`
returns (13) and is exactly the unknown pivot.

The identities here do not show (17).  They provide a canonical correlated
quantity and two exact actual-residual constraints on which a complete-theta
argument can act.  A finite check of (17) would only test the proposed route;
it would not prove its all-degree validity.

## Self-audit and nonclaims

- The apparent logarithmic derivatives in (2) and (22) are only shorthand
  for integrable division-free products under `q^2W^2dt`.
- Expanding (11) and using (8) reproduces
  `r^T K^(-1) r-(A+B)/2` exactly.
- Expanding (16) and clearing `det K` reproduces (18), hence the earlier
  denominator-free five-scalar condition.
- Equation (5) is the Pythagorean identity for `P_U`; it is not a new source
  of positivity for the target.
- Equations (22)--(23) use only old-space Galerkin orthogonality and do not
  insert the unknown newest moment.
- No finite computation, first Xi--Laguerre sign, higher-rung theorem, or RH
  conclusion is asserted.
