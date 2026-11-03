# The joint orbit-score payment as a mean square minus two exact costs

## Scope and outcome

This note keeps together the four pieces which cannot be signed separately:

- the top even covariant score in the newest Bell coefficient;
- all lower Bell contractions;
- the score drift/covariance recursion;
- the actual old-space regression polynomial.

The result is an exact complete-theta identity.  Let `P_N` be the monic
old-space residual in either parity ladder and let

\[
 q(t)=t^rP_N(t^2),\qquad r\in\{0,1\}.
\]

There is one raw orbit observable `U_P(n,h)`, built from the same residual,
for which the full next Schur pivot is

\[
 \boxed{
 \mathcal S_{N,r}
 =2\int_0^\infty h^2\psi(h)^2
       \{E_h[U_P]\}^2\,dh
 +{1\over4\pi}\int_{\mathbb R}
       \{q q''-q'^2\}W^2\,dt,}
 \tag{1}
\]

where `W=widehat(psi)=2Xi`.  The square in (1) contains the complete orbit
sum before it is squared.  Its score expansion is exactly the integrated
assembly of the top even score, the lower Bell polynomial, and the old
regression terms.

There is also a sharp obstruction.  Under the natural coupled old-prefix
hypotheses

\[
 H_{N-1}^{(r)}>0,\qquad H_{N-1}^{(r+1)}>0,
\]

the residual `P_N` has positive simple zeros, hence `q` has only real simple
zeros.  The second term in (1) is then strictly negative.  The joint payment
is therefore exactly the complete-theta Hardy inequality

\[
 2\int_0^\infty h^2\psi^2\{E_h[U_P]\}^2dh
 \ge {1\over4\pi}\int_{\mathbb R}
        \{q'^2-q q''\}W^2dt.                    \tag{2}
\]

Expanding the mean square under the positive orbit law gives a second exact
form: a positive raw-orbit energy minus an orbit-dispersion cost and the
strict Hardy cost.  Thus positivity of the orbit weights and ordinary
variance do not pay the border; Jensen has the wrong orientation for that
shortcut.

Equations (1)--(2) are noncircular reductions but not a proof of (2).  No
finite orbit packet, finite-degree experiment, next-pivot sign, or RH claim
is used.

## 1. The actual residual keeps the old regression assembled

Use the Bell moments

\[
 m_j=\int_{\mathbb R}h^2c_j(h)\,dh
 =2\int_0^\infty h^2c_j(h)\,dh.                 \tag{3}
\]

Fix `r in {0,1}` and `N>=2`, and put

\[
 \kappa=r+2N.                                    \tag{4}
\]

In the notation of `ALL_DEGREE_ASSEMBLED_SCALAR_NEXT.md`, this is
`kappa=k+2`, the index of the newest moment.  Assume the old same-parity
block is nonsingular and let

\[
 P_N(x)=\sum_{i=0}^Np_ix^i,\qquad p_N=1,          \tag{5}
\]

be its monic Galerkin residual:

\[
 \sum_{i=0}^Np_i m_{r+i+j}=0
 \qquad(0\leq j<N).                              \tag{6}
\]

The coefficients in (5) use moments only through `m_(kappa-1)`.  The exact
new Schur pivot is

\[
 \boxed{
 \mathcal S_{N,r}
 =\sum_{i,j=0}^Np_ip_jm_{r+i+j}.}                \tag{7}
\]

Thus `P_N` already contains the entire old regression; no orbitwise or
pointwise regression will be introduced.

Let

\[
 A_s=\mathscr T^{s-1}\sigma,
 \qquad E_h[A_s]=\ell^{(s)},\qquad \ell=\log\psi,
 \tag{8}
\]

be the exact covariant scores.  Define the locally assembled Bell fiber

\[
 \mathcal C_P(h)
 =\sum_{i,j=0}^Np_ip_jc_{r+i+j}(h).              \tag{9}
\]

Only the pair `(i,j)=(N,N)` reaches `c_kappa`.  Since its coefficient is
one, the triangular Bell-score formula gives

\[
 \boxed{
 {\mathcal C_P\over\psi^2}
 ={2(-1)^\kappa\over4^\kappa}E_h[A_{2\kappa}]
 +\mathcal Q_P\bigl(E_h[A_1],\ldots,
                    E_h[A_{2\kappa-2}]\bigr).}
 \tag{10}
\]

Here `mathcal Q_P` contains both the lower part of the newest complete Bell
polynomial and every old-regression term in (9).  Nothing in (10) is assigned
a separate sign.  Equations (3), (7), and (9) give

\[
 \boxed{
 \mathcal S_{N,r}=\int_{\mathbb R}h^2\mathcal C_P(h)\,dh.}
 \tag{11}
\]

Thus (10)--(11) are precisely the joint orbit-score payment, before any
change of coordinates.

## 2. Raw orbit jets retain drift and covariance

On `h>=0`, retain every positive Jacobi orbit

\[
 \phi_a(h)=4z_a(2z_a-3)e^{h/2-z_a},\qquad
 z_a=\pi a^2e^{2h},\qquad p_a={\phi_a\over\psi}. \tag{12}
\]

Define its raw derivative jets

\[
 R_s(a,h)={\phi_a^{(s)}(h)\over\phi_a(h)},
 \qquad R_0=1.                                   \tag{13}
\]

They satisfy the division-free recurrence after multiplication by `phi_a`,

\[
 R_{s+1}=R_s'+\sigma_aR_s,                       \tag{14}
\]

and are the ordinary complete Bell polynomials in the raw score and its
derivatives.  Summing all orbits first gives

\[
 \boxed{
 E_h[R_s]={\psi^{(s)}\over\psi}
 =B_s\bigl(E_h[A_1],\ldots,E_h[A_s]\bigr).}
 \tag{15}
\]

The score drift and covariance are still present.  Indeed, the expectation
recursion and (14) give the exact identity

\[
\begin{aligned}
 {d\over dh}E_h[R_s]
 &=E_h[R_s']+\operatorname{Cov}_h(R_s,\sigma)\\
 &=E_h[R_{s+1}]-E_h[\sigma]E_h[R_s].
\end{aligned}                                    \tag{16}
\]

Thus passing from raw jets to (15) does not delete either drift or
covariance; it combines them before the next derivative is taken.

Insert the actual regression coefficients only after forming these complete
orbit jets:

\[
 \boxed{
 U_P(a,h)=\sum_{i=0}^Np_i(-1)^iR_{r+2i}(a,h).}
 \tag{17}
\]

Then

\[
\begin{aligned}
 E_h[U_P]
 &=\sum_{i=0}^Np_i(-1)^i
 B_{r+2i}\bigl(E_h[A_1],\ldots,E_h[A_{r+2i}]\bigr)\\
 &={D^rP_N(-D^2)\psi(h)\over\psi(h)}.
\end{aligned}                                    \tag{18}
\]

Equation (18) is a complete-orbit mean.  Squaring an individual `U_P(a,h)`
or fitting `P_N` separately on an orbit would change it.

## 3. Exact collapse of the joint Bell payment

Put

\[
 F_P(h)=D^rP_N(-D^2)\psi(h),
 \qquad q(t)=t^rP_N(t^2),
 \qquad W(t)=\widehat\psi(t).                    \tag{19}
\]

The Fourier transform of `F_P` is

\[
 \widehat F_P(t)=i^r q(t)W(t).                   \tag{20}
\]

Complete-theta Schwartz decay justifies Plancherel and all integrations by
parts below.  First,

\[
\begin{aligned}
 \int_{\mathbb R}h^2F_P(h)^2dh
 &={1\over2\pi}\int_{\mathbb R}
       \{q'W+qW'\}^2dt\\
 &={1\over2\pi}\int_{\mathbb R}
       \{q^2W'^2-q q''W^2\}dt.
\end{aligned}                                    \tag{21}
\]

The cross term in the first line was integrated as

\[
 \int q q'(W^2)'dt
 =-\int(q'^2+q q'')W^2dt.                       \tag{22}
\]

On the other hand, summing the exact Bell--Sobolev moment formula with the
same residual coefficients gives

\[
 \mathcal S_{N,r}
 ={1\over2\pi}\int_{\mathbb R}
 \left\{q^2W'^2-{(q^2)''\over4}W^2\right\}dt.   \tag{23}
\]

Since `(q^2)''/4=(q'^2+q q'')/2`, subtracting (21) from (23) proves

\[
 \boxed{
 \mathcal S_{N,r}
 =\int_{\mathbb R}h^2F_P(h)^2dh
 +{1\over4\pi}\int_{\mathbb R}
        \{q q''-q'^2\}W^2dt.}                   \tag{24}
\]

The profile `psi` is even, so `F_P` has parity `r` and `h^2F_P^2` is even.
Using (18) on the positive half-line turns (24) into (1).

This proves an exact **half-order collapse**.  The left side of (11) contains
the linear top score `E[A_(2kappa)]` from (10), every lower Bell contraction,
and the old regression.  Only after their complete integral is assembled do
they become the square of the all-orbit mean (18), which uses scores only
through order `kappa`, plus the one coefficient-curvature term in (24).
No top-score envelope or componentwise Cauchy estimate is used.

Modular smoothness is also retained in the required order.  Individual
positive-half-line orbits have a seam when evenized, but (18), (21), and
(24) sum all orbit indices into the smooth `psi` before reflection or
integration by parts.  Hence no unrecorded center boundary term occurs.

## 4. The orbit-dispersion identity

For each fixed `h>=0`, the positive complete-orbit law gives

\[
 \{E_h[U_P]\}^2
 =E_h[U_P^2]-\operatorname{Var}_h(U_P),           \tag{25}
\]

with

\[
 2\operatorname{Var}_h(U_P)
 =E_{h,a,b}\bigl[(U_P(a,h)-U_P(b,h))^2\bigr].    \tag{26}
\]

Substitution in (1) yields the fully assembled all-orbit formula

\[
\boxed{
\begin{aligned}
 \mathcal S_{N,r}
 &=2\int_0^\infty h^2\psi^2E_h[U_P^2]dh\\
 &\quad-\int_0^\infty h^2\psi^2
 E_{h,a,b}\bigl[(U_P(a,h)-U_P(b,h))^2\bigr]dh\\
 &\quad+{1\over4\pi}\int_{\mathbb R}
       \{q q''-q'^2\}W^2dt.
\end{aligned}}
\tag{27}
\]

Both orbit indices in (26)--(27) range over the complete infinite Jacobi
family.  Formula (27) is not a limit of finite orbit packets.

The sign mechanism supplied by ordinary probability is now exact and has
the wrong orientation for a shortcut.  The raw orbit energy is positive,
but the orbit variance is a *subtracted* dispersion payment.  Replacing the
square of the complete mean by the mean of the orbit squares would increase
the claimed pivot and is therefore an invalid lower bound.

## 5. Old two-prefix positivity makes the curvature a strict cost

The last term in (24) also has a definite adverse sign under the natural
coupled old-prefix hypotheses.  Define the old Hankel matrices

\[
 H_{N-1}^{(s)}=(m_{s+i+j})_{i,j=0}^{N-1}.
 \tag{28}
\]

Assume

\[
 \boxed{H_{N-1}^{(r)}>0,
 \qquad H_{N-1}^{(r+1)}>0.}                     \tag{29}
\]

Neither matrix in (29) contains the newest moment `m_kappa`: the largest
index is `r+2N-1=kappa-1`.

Let `L_r[x^j]=m_(r+j)`.  The first matrix in (29) makes

\[
 \langle f,g\rangle_r=L_r[fg]
\]

an inner product on polynomials of degree below `N`.  Compress multiplication
by `x` to that space.  Its Jacobi matrix `J_N` is real symmetric, and the
second matrix in (29) gives

\[
 \langle J_Nf,f\rangle_r=L_r[xf^2]>0             \tag{30}
\]

for every nonzero `f` of degree below `N`.  Thus `J_N>0`.  The standard
Gram--Schmidt determinant identity identifies the monic polynomial (5) with
the characteristic polynomial of `J_N`.  Its zeros are therefore positive;
the positive old Gram determinants make the Jacobi matrix irreducible, so
the zeros are simple.

It follows that

\[
 q(t)=t^rP_N(t^2)
\]

has only real simple zeros.  If those zeros are `rho_1,...,rho_kappa`, then
away from them

\[
 \boxed{
 q'(t)^2-q(t)q''(t)
 =q(t)^2\sum_{j=1}^{\kappa}{1\over(t-\rho_j)^2}>0.}
 \tag{31}
\]

Both sides extend polynomially across the zeros, where the left side equals
`q'(rho_j)^2>0`.  Since `W^2` is positive almost everywhere except at its
discrete real zeros,

\[
 \boxed{
 \mathfrak D_q:={1\over4\pi}\int_{\mathbb R}
       \{q'^2-q q''\}W^2dt>0.}                  \tag{32}
\]

Consequently (1) becomes

\[
 \boxed{
 \mathcal S_{N,r}
 =2\int_0^\infty h^2\psi^2\{E_h[U_P]\}^2dh
 -\mathfrak D_q,}                                \tag{33}
\]

and the joint payment is equivalent to (2).

This is a sharp orbit-preserving obstruction to a naive square proof.  Under
the very old-prefix positivity one wants to propagate, the only non-orbit
term in the exact square identity is not a reserve but a strict cost.  The
complete-orbit mean square must pay it.  In the dispersion form (27), the
raw orbit energy must pay both the all-orbit variance and `mathfrak D_q`.

## 6. What remains genuinely source-specific

The reduction identifies one theorem-shaped continuation which does not
split the newest Bell datum from the regression:

\[
 \boxed{
 2\int_0^\infty h^2\psi(h)^2
 \left\{
  E_h\!\left[\sum_{i=0}^Np_i(-1)^i
  B_{r+2i}(\sigma,\sigma',\ldots,
                   \sigma^{(r+2i-1)})\right]
 \right\}^{\!2}dh
 \geq\mathfrak D_q.}                             \tag{34}
\]

For the single term `r=i=0` in (34), the convention is `B_0=1` and the
derivative list is empty.

All coefficients `p_i` in (34) are the single global old regression from
(6); every orbit index is summed before the square; and the raw score Bell
jets obey the exact drift/covariance identity (16).  A proof of (34) would
therefore be a genuine complete-theta joint payment.

The identities above also rule out three proposed simplifications.

- **Orbitwise regression:** replacing `P_N` by orbit-dependent regressions
  changes `U_P` and loses the Schur residual (7).
- **Jensen positivity:** replacing `{E U_P}^2` by `E[U_P^2]` drops the
  negative dispersion payment in (27) and gives an upper bound, not the
  required lower bound.
- **Positive coefficient curvature:** under (29), equations (31)--(33) show
  that the coefficient-curvature term is strictly negative.

What is still missing is an arithmetic inequality for the *mean* complete
orbit feature in (34).  Monotone-likelihood-ratio ordering of the individual
score, modular odd-jet cancellation at the center, and positivity of raw
orbit squares do not provide that lower bound.  A viable continuation would
need a modular/Ewald relation that controls the complete mean relative to
the real-root curvature `mathfrak D_q`, without resolving the orbit sum into
finite packets.

## Self-audit and nonclaims

- The target index is `kappa=r+2N=k+2`; hence the newest `c_kappa` contributes
  the top covariant score `A_(2kappa)` in (10).
- The Fourier multiplier in (20) is exact:
  `D^rP(-D^2)` transforms to `(it)^rP(t^2)=i^r q(t)`.
- Expanding the first line of (21) and using (22) leaves
  `q^2W'^2-q q''W^2`; subtracting it from (23) gives the factor `1/(4pi)`
  and the sign in (24).
- The factor in the dispersion term of (27) follows from
  `Var(U)=E[(U_a-U_b)^2]/2` and the outer factor `2` in (1).
- The shifted old block in (29) stops at `m_(kappa-1)`, so the real-rootedness
  lemma does not assume the newest moment whose pivot is being tested.
- Every orbit expectation and pair expectation is over the complete infinite
  positive Jacobi law.  The full sum is formed before modular reflection,
  differentiation across the center, regression, or squaring.

Equations (1), (24), (27), and (33) are exact reductions.  Inequality (34)
remains unproved and is equivalent to the next pivot under (29).  No finite
degree or finite orbit evidence is used, and no all-degree endpoint sign or
RH conclusion is claimed.
