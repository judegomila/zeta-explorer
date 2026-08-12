# RH actual-ground Christoffel and commutator response barrier

## 0. Exact outcome and claim boundary

Assume RH only where the actual zero-evaluation formulas are invoked.  This
note sharpens the two actual-ground statistics left by the frozen parity and
saturation records.  It does not orient either statistic.

For the odd ground, put

\[
 \omega_-:=\nu_e-\lambda_-\sigma_e,
 \qquad
 \lambda_-={\nu_e(yp_-^2)\over\sigma_e(yp_-^2)}.       \tag{0.1}
\]

The odd Euler equation has the stronger boundary form

\[
 \boxed{\omega_-(p_-r)=r(0)\omega_-(p_-)
        \quad(\deg r\leq N).}                         \tag{0.2}
\]

Consequently the frozen mean determinant is

\[
 \boxed{
 \Delta_N=-\sigma_e(yp_-^2)p_-(0)\omega_-(p_-)
          =-\sigma_e(yp_-^2)^2\lambda_-'(0).}          \tag{0.3}
\]

Here `lambda_-(t)` is the smallest generalized eigenvalue after replacing
the Christoffel factor `y` by `y+t`; the derivative formula is stated on a
simple odd-ground branch.  Thus the missing sign is exactly

\[
 p_-(0)\omega_-(p_-)<0,
 \qquad\hbox{equivalently}\qquad \lambda_-'(0)<0.       \tag{0.4}
\]

The source commutator turns the same condition into one central residual
product, but supplies no sign for it.

For the positive-index even ground `h_(alpha,K)`, the twice-clamped
primitive gives the exact identity

\[
 \boxed{
 \alpha_K\|\mathcal R_Kh_{\alpha,K}\|_2^2(\Theta_K-1)
 ={\rm one\ explicit\ source\ boundary\ scalar}.}      \tag{0.5}
\]

Section 5 gives that scalar in the integer-mode coordinates.  Section 6
also identifies the low-zero mass as a logarithmic derivative of the true
ground after low-row deletion.  These are exact reductions, not estimates
which close the gate.

The exact `N=2` positive integer-multiplicity real-evaluation Gram in the
frozen parity record makes the odd scalar have the opposite sign.  A second
exact positive `N=2` source-Cauchy matrix makes the even scalar positive and
has `Theta=159/67>1`.  These are structural countermodels only.  They are
not the zeta divisor, do not satisfy the locked prime inventory, and do not
assert an HSW-compatible common prefix.

RH, HSW zero counting, separate moment positivity, the source commutator,
the strict Stokes theorem for one projected-prolate vector, and the bottom
cluster do not prove (0.4) or a useful upper bound for `Theta_K`.  A new
actual theorem must control a ground-weighted source correlation or a
relative ground response.  No first finite gate, determinant convergence,
literal ceiling result, RH proof, converse from RH, or de Bruijn--Newman
bound is obtained.  All unresolved gates remain false and the formal state
remains `P0_INVALIDATED`.

## 1. Frozen inputs

Exactly the following two frozen pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/RH_ACTUAL_ODD_GROUND_PRIMITIVE_CHRISTOFFEL_PARITY_BARRIER.md` | `29475ddb8b57f227530b6aa296b088f07c4ac9db0cadd1a2d230b40a780b3157` |
| `tests/test_rh_actual_odd_ground_primitive_christoffel_parity_barrier.py` | `c03b4325d8f04266091dc3cd8ad17f6bf4f91ca97773cf7dfcaedb44f46caeb6` |
| `notes/ADAPTIVE_PROLATE_SATURATION_DIVERGENCE_ORIENTATION_BARRIER.md` | `7882db630232ec094318e52689b0b12bf28b0d74ee2c012259a6e91fe666268b` |
| `tests/test_adaptive_prolate_saturation_divergence_orientation_barrier.py` | `5efe525cd79bc7279fe5198ae9af8ec9da8941e5bd3a4f1baa4479de56336798` |

The first pair supplies the exact even and odd functionals, their
Christoffel relation, the endpoint-zero primitive, the source commutator,
and the integer-multiplicity `N=2` evaluation countermodel.  The second pair
supplies the true positive-index even ground, the twice-clamped primitive,
the bottom cluster, and the statistic `Theta_K`.

No zero table, numerical ordinate, external source, new source lock, or
standard-eight byte is imported.

## 2. Odd Euler equation and the exact boundary functional

Retain the frozen notation

\[
 d\sigma_o=2y\,d\sigma_e,
 \qquad d\nu_o=2y\,d\nu_e,                           \tag{2.1}
\]

and let `p=p_-` be any odd minimizing polynomial of degree at most `N-1`.
With `lambda=lambda_-` and `omega=omega_-`, minimality gives

\[
 \omega(yq^2)\geq0\quad(q\in\mathcal P_{N-1}),
 \qquad
 \omega(ypq)=0\quad(q\in\mathcal P_{N-1}).          \tag{2.2}
\]

Thus the shifted Hankel matrix

\[
 H_1=\bigl(\omega(y^{i+j+1})\bigr)_{0\leq i,j<N}
 \succeq0,
 \qquad H_1p=0.                                     \tag{2.3}
\]

For any `r in P_N`, the polynomial

\[
 q(y)={r(y)-r(0)\over y}                             \tag{2.4}
\]

belongs to `P_(N-1)`.  Substitution in (2.2) proves

\[
 \omega(pr)-r(0)\omega(p)=\omega(ypq)=0,            \tag{2.5}
\]

which is (0.2).  In particular,

\[
 \boxed{\omega(p^2)=p(0)\omega(p).}                 \tag{2.6}
\]

The mean determinant from the frozen parity record satisfies

\[
\begin{aligned}
 \Delta_N
 &=\nu_e(yp^2)\sigma_e(p^2)
   -\nu_e(p^2)\sigma_e(yp^2)\\
 &=-\sigma_e(yp^2)\omega(p^2)\\
 &=-\sigma_e(yp^2)p(0)\omega(p).
\end{aligned}                                       \tag{2.7}
\]

Therefore `p(0)=0` forces `Delta_N=0`; it cannot yield the strict parity
comparison.  If `p(0)` is nonzero, the complete missing sign is the single
boundary product in (0.4).

## 3. Christoffel response and the Geronimus boundary mass

For `t` near zero define

\[
 \lambda_-(t)=\min_{0\ne q\in\mathcal P_{N-1}}
 {\nu_e((y+t)q^2)\over\sigma_e((y+t)q^2)}.           \tag{3.1}
\]

The denominator pencil is positive definite at `t=0` and remains so in a
neighborhood of zero.  If the smallest generalized eigenvalue is simple,
the generalized Hellmann--Feynman formula gives

\[
\begin{aligned}
 \lambda_-'(0)
 &={\nu_e(p^2)\sigma_e(yp^2)
       -\nu_e(yp^2)\sigma_e(p^2)
    \over\sigma_e(yp^2)^2}\\
 &={\omega(p^2)\over\sigma_e(yp^2)}.
\end{aligned}                                       \tag{3.2}
\]

Combining (2.7) and (3.2) proves the second equality in (0.3).  This is a
response identity, not a monotonicity theorem.  Neither positivity of the
two original measures nor positivity of `H_1` fixes the derivative sign.

There is a precise truncated-moment explanation.  Define

\[
 \ell(q)=\omega(yq).                                 \tag{3.3}
\]

Suppose, for clarity, that `H_1` has rank `N-1`, its leading principal
minor of that order is positive, `p(0)` is nonzero, and its flat Hamburger
representation is

\[
 \ell(q)=\int q(x)\,d\rho(x),                        \tag{3.4}
\]

where the positive measure `rho` is supported on the `N-1` real nonzero
roots of `p`.  If those roots are positive, (3.4) is also a Stieltjes
representation.  For every polynomial in the represented degree range,

\[
 \omega(q)=q(0)\omega(1)
 +\int {q(x)-q(0)\over x}\,d\rho(x).                \tag{3.5}
\]

Since `p` vanishes on the support of `rho`,

\[
 \boxed{
 \omega(p^2)=p(0)^2
 \left\{\omega(1)-\int x^{-1}\,d\rho(x)\right\}.}  \tag{3.6}
\]

Thus inverse Christoffel transformation leaves one Geronimus boundary
mass at zero.  The shifted positive matrix `H_1` does not see it.  Adding a
multiple of evaluation at zero changes the braces in (3.6) without changing
`H_1`, its kernel, or any odd Euler equation.  Markov, Hamburger, Stieltjes,
and total-positivity arguments applied only after multiplication by `y`
therefore stop at the exact inequality

\[
 \omega(1)<\int x^{-1}\,d\rho(x).                   \tag{3.7}
\]

That inequality is new input, not a consequence of (2.2).

## 4. The same odd sign in source coordinates

Use the normalized source parity basis

\[
 e_0^+=V_0,
 \qquad e_n^+={V_n+V_{-n}\over\sqrt2},
 \qquad e_n^-={V_n-V_{-n}\over\sqrt2}.              \tag{4.1}
\]

Let `M V_n=nV_n`, `eta=sum_(|n|<=N)V_n`, and write the exact source matrix
as

\[
 Q_{00}=a_0,
 \qquad Q_{n0}={b_n\over n},
 \qquad b_{-n}=-b_n.                                \tag{4.2}
\]

Then

\[
 \langle e_0^+,Qe_n^+\rangle={\sqrt2b_n\over n},
 \qquad
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                \tag{4.3}
\]

Let the real odd ground be

\[
 u=\sum_{n=1}^Nu_ne_n^-,
 \qquad Q_-u=\lambda_-u,
 \qquad \|u\|_2=1,                                 \tag{4.4}
\]

and put

\[
 S_1=\sum_{n=1}^N{u_n\over n},
 \qquad
 B_2=\sum_{n=1}^N{b_nu_n\over n^2},                \tag{4.5}
\]

\[
 f=\sqrt2S_1e_0^+-\sum_{n=1}^N{u_n\over n}e_n^+.
                                                               \tag{4.6}
\]

This is the integer-mode version of the endpoint-zero primitive.  It obeys

\[
 \langle\eta,f\rangle=0,
 \qquad Mf=-u.                                      \tag{4.7}
\]

The rank-one parity commutator vanishes on `f`, so

\[
 M(Q_+-\lambda_-I)f=0.
\]

Since the even kernel of `M` is the central mode,

\[
 \boxed{(Q_+-\lambda_-I)f=re_0^+,}                  \tag{4.8}
\]

where its central coordinate is exactly

\[
 r=\sqrt2\{(a_0-\lambda_-)S_1-B_2\}.               \tag{4.9}
\]

Taking the quadratic form gives

\[
 \boxed{
 \langle f,(Q_+-\lambda_-I)f\rangle
 =2S_1\left\{(a_0-\lambda_-)S_1-B_2\right\}.}      \tag{4.10}
\]

The physical primitive differs from (4.6) only by the positive scale
`L/(2*pi)` and a fixed parity phase.  Comparing with (2.7) therefore gives

\[
 \boxed{
 \Delta_N>0
 \quad\Longleftrightarrow\quad
 S_1\left\{(a_0-\lambda_-)S_1
       -\sum_{n=1}^N{b_nu_n\over n^2}\right\}<0.}   \tag{4.11}
\]

Every `b_n` contains the full pole--archimedean--minus-prime source data.
Equation (4.11) is therefore an exact actual arithmetic correlation, but
the displacement identity itself supplies no sign for it.

There is also a useful negative-Sobolev form.  With

\[
 G_{-,N}=\Omega_N^2\|Pu\|_2^2,
 \qquad
 d\nu_-(\gamma)={m_\gamma|\widehat u(\gamma)|^2
  \over\sum_{\beta>0}m_\beta|\widehat u(\beta)|^2}, \tag{4.12}
\]

the primitive criterion is exactly

\[
 \boxed{
 \Delta_N>0
 \quad\Longleftrightarrow\quad
 \int\left({\Omega_N\over\gamma}\right)^2
        d\nu_-(\gamma)<G_{-,N}.}                    \tag{4.13}
\]

If `rho_-(T)=nu_-((0,T])`, `T>Omega_N`, and `gamma_*` is the least positive
ordinate, support alone gives

\[
 \int\left({\Omega_N\over\gamma}\right)^2d\nu_-
 \leq a_2+(b_2-a_2)\rho_-(T),                       \tag{4.14}
\]

\[
 a_2=\left({\Omega_N\over T}\right)^2,
 \qquad b_2=\left({\Omega_N\over\gamma_*}\right)^2. \tag{4.15}
\]

Thus `rho_-(T)<(G_{-,N}-a_2)/(b_2-a_2)` is sufficient when
`G_{-,N}>a_2`.
It is a ground-weighted relative mass condition, not a zero-count theorem.

## 5. The true even ground and the squared commutator scalar

Now use a separate cutoff `K`.  Let

\[
 h=\sum_{n=1}^Kh_ne_n^+,
 \qquad A_K^\circ h=\alpha_Kh,
 \qquad \|h\|_2=1,                                 \tag{5.1}
\]

where `A_K^circ` is the positive-index even block.  Define the unscaled
twice-clamped primitive

\[
 f_2=\sqrt2S_2e_0^+-\sum_{n=1}^K{h_n\over n^2}e_n^+,
 \qquad S_j=\sum_{n=1}^K{h_n\over n^j}.             \tag{5.2}
\]

Then

\[
 \langle\eta,f_2\rangle=0,
 \qquad
 \|f_2\|_2^2=2S_2^2+\sum_{n=1}^K{h_n^2\over n^4}, \tag{5.3}
\]

and `mathcal R_K h=(L/(2*pi))^2f_2`.  Put

\[
 B_j=\sum_{n=1}^K{b_nh_n\over n^j}.                 \tag{5.4}
\]

The positive-index ground equation and the central row give

\[
 Q_+h=\alpha_Kh+\sqrt2B_1e_0^+.                    \tag{5.5}
\]

Applying the squared commutator to the endpoint-zero vector `f_2`, or
checking the source-Cauchy entries directly, yields

\[
\boxed{
 (Q_+-\alpha_KI)f_2
 =\sqrt2\{(a_0-\alpha_K)S_2-B_3\}e_0^+
  +2B_1\sum_{n=1}^K{e_n^+\over n^2}.}              \tag{5.6}
\]

Taking its quadratic form proves

\[
\boxed{
 \langle f_2,(Q_+-\alpha_KI)f_2\rangle
 =2\{(a_0-\alpha_K)S_2^2-S_2B_3-B_1S_4\}.}        \tag{5.7}
\]

The frozen definition of `Theta_K` is exactly the Rayleigh quotient of the
twice-clamped primitive divided by `alpha_K`.  Hence

\[
\boxed{
 \alpha_K\|f_2\|_2^2(\Theta_K-1)
 =2\{(a_0-\alpha_K)S_2^2-S_2B_3-B_1S_4\}.}         \tag{5.8}
\]

For any `0<tau<1`, the quantitative target `Theta_K<=tau` is equivalent to

\[
\boxed{
 2\{(a_0-\alpha_K)S_2^2-S_2B_3-B_1S_4\}
 \leq-(1-\tau)\alpha_K\|f_2\|_2^2.}               \tag{5.9}
\]

Thus the source commutator reduces the problem to four ground-weighted
coefficient moments.  It does not orient their combination.

There is an equivalent second-Christoffel formulation.  A positive-index
even state has even numerator `yq(y)`, with `deg q<=K-1`.  For its ground
polynomial put

\[
 \omega_\alpha=\nu_e-\alpha_K\sigma_e.              \tag{5.10}
\]

Then

\[
 \omega_\alpha(y^2rq)=0\quad(r\in\mathcal P_{K-1}),
 \qquad
 \omega_\alpha(y^2r^2)\geq0,                       \tag{5.11}
\]

and

\[
 \Theta_K-1={\omega_\alpha(q^2)
                   \over\alpha_K\sigma_e(q^2)}.    \tag{5.12}
\]

Since `q-q(0)-q'(0)y` is divisible by `y^2`, (5.11) gives

\[
 \boxed{
 \omega_\alpha(q^2)
 =q(0)\omega_\alpha(q)+q'(0)\omega_\alpha(yq).}    \tag{5.13}
\]

The second Christoffel transform therefore leaves two unoriented boundary
moments.  Positivity after multiplication by `y^2` cannot determine them.

## 6. Low-row mass is a relative ground response

Split the positive-index actual Gram at a height `T`:

\[
 A_K^\circ=A_{>T}+A_{\leq T},
 \qquad
 A(s)=A_{>T}+sA_{\leq T},
 \qquad
 \alpha(s)=\lambda_{\min}(A(s)).                    \tag{6.1}
\]

If the ground at `s=1` is simple, Hellmann--Feynman gives

\[
 \boxed{
 \rho_{\alpha,T}
 :={\langle h,A_{\leq T}h\rangle\over\alpha_K}
 ={\alpha'(1)\over\alpha(1)}
 =\left.\partial_{\log s}\log\alpha(s)\right|_{s=1}.} \tag{6.2}
\]

The smallest eigenvalue of an affine Hermitian pencil is concave.  Its
tangent inequality between zero and one gives

\[
 \alpha(0)\leq\alpha(1)-\alpha'(1),
\]

and hence

\[
 \boxed{
 \rho_{\alpha,T}\leq1-{\alpha(0)\over\alpha(1)}.}   \tag{6.3}
\]

This identifies a concrete zeta-specific route: prove relative stability
of the true floor when all rows through `T` are deleted.

Retain the dimensionless primitive norm

\[
 G_K=\Omega_K^4\|\mathcal R_Kh\|_2^2\geq1.          \tag{6.4}
\]

For `T>Omega_K>gamma_*`, put

\[
 a_4=\left({\Omega_K\over T}\right)^4,
 \qquad
 b_4=\left({\Omega_K\over\gamma_*}\right)^4.        \tag{6.5}
\]

Then the frozen inverse-fourth-moment split is

\[
 \boxed{
 \Theta_K\leq{a_4+(b_4-a_4)\rho_{\alpha,T}\over G_K}.} \tag{6.6}
\]

Therefore a sufficient condition for `Theta_K<=tau` is

\[
 \boxed{
 \rho_{\alpha,T}\leq{\tau G_K-a_4\over b_4-a_4},
 \qquad \tau G_K>a_4.}                              \tag{6.7}
\]

Equations (6.3) and (6.7) convert the missing theorem into a relative
row-deletion floor estimate together with the coefficient statistic `G_K`.
HSW controls neither quantity.  The bottom-cluster theorem supplies upper
eigenvalue bounds; it gives no lower ratio `alpha(0)/alpha(1)`, no relative
ground gap, and no ground angle.

## 7. Exact opposite-sign structural models

The frozen parity pair gives an exact `N=2` real-evaluation Gram with
integer multiplicities at the reflected points

\[
 \{(1/2)^{[1]},(3/2)^{[2]},(9/2)^{[18]}\}.           \tag{7.1}
\]

Its scaled parity blocks obey

\[
 E\succ18I,
 \qquad
 0<\lambda_{\min}(O)<18.                            \tag{7.2}
\]

For its odd ground, every even trial, including the endpoint-zero
primitive, has Rayleigh quotient strictly larger than `lambda_-`.  Thus

\[
 \boxed{
 \Delta_2<0,
 \qquad
 \lambda_-'(0)>0,
 \qquad
 S_1\{(a_0-\lambda_-)S_1-B_2\}>0.}                 \tag{7.3}
\]

This proves that positive evaluation-Gram structure, integer
multiplicities, source-Cauchy displacement, and separate moment positivity
do not sign (0.4).

There is an equally small exact obstruction for the twice-primitive scalar.
Take `N=2` and source parameters

\[
 b_1=1,
 \qquad b_2=0,
 \qquad a_0=10,
 \qquad a_1={8\over3},
 \qquad a_2={11\over3}.                             \tag{7.4}
\]

The normalized parity blocks are

\[
 Q_+=
 \begin{pmatrix}
 10&\sqrt2&0\\
 \sqrt2&11/3&-2/3\\
 0&-2/3&11/3
 \end{pmatrix},
 \qquad
 Q_-=
 \begin{pmatrix}
 5/3&-4/3\\
 -4/3&11/3
 \end{pmatrix}.                                    \tag{7.5}
\]

Their leading positivity data are

\[
 10,
 \qquad {104\over3},
 \qquad {368\over3},
 \qquad
 \det Q_-={13\over3}.                              \tag{7.6}
\]

Thus the full source-Cauchy matrix is positive definite.  The vector
`h=(1,1)` is the positive-index even ground with

\[
 \alpha=3,
 \qquad \lambda_2(A^\circ)={13\over3}.              \tag{7.7}
\]

Identity (5.8) is homogeneous in `h`, so the unnormalized representative
keeps the arithmetic rational.  For this vector,

\[
 S_2={5\over4},
 \quad S_4={17\over16},
 \quad B_1=B_3=1,
 \quad \|f_2\|_2^2={67\over16}.                    \tag{7.8}
\]

Equation (5.8) gives

\[
 \alpha\|f_2\|_2^2(\Theta-1)={69\over4},
 \qquad
 \boxed{\Theta={159\over67}>1.}                    \tag{7.9}
\]

The underlying source-basis matrix has rational entries.  It is a
source-Cauchy structural model, not the actual zeta Gram.  The frozen
shifted-hyperplane model gives the same no-go at arbitrary dimension: large
dimension and positivity do not repair the absent actual correlation.

## 8. Minimal new inputs and fail-closed stopping line

The exact remaining alternatives are narrow.

For odd parity, it is enough to prove on a cofinal actual sequence any one
of

\[
 \lambda_-'(0)<0,
 \qquad p_-(0)\omega_-(p_-)<0,
 \qquad
 S_1\{(a_0-\lambda_-)S_1-B_2\}<0,                  \tag{8.1}
\]

or the ground-weighted low-row inequality in (4.13)--(4.15).  Strict
parity would then force a simple inversion-even global ground and boundary
nonvanishing by the frozen source theorem.

For the true even reserve, it is enough to prove either the quantitative
source inequality (5.9) or the response/primitive conditions (6.3)--(6.7)
at the required scale.  These statements couple the actual ground to the
zeta rows.  They are substantially stronger than an unweighted count.

Any downstream use must reject a claimed pass if it

1. infers a sign for `omega(p^2)` from `H_1>=0` alone;
2. drops the Geronimus boundary mass in (3.6);
3. treats the response identity (3.2) as a monotonicity theorem;
4. replaces the actual odd ground by the projected-prolate Stokes vector;
5. infers relative low-row mass from absolute smallness of the ground;
6. turns the bottom-cluster upper bounds into a relative gap or angle;
7. drops `G_K` from (6.6), or uses (6.7) when `tau G_K<=a_4`;
8. identifies either `N=2` structural model with the zeta divisor;
9. infers an HSW-compatible divisor, prefix, padding theorem, finite gate,
   literal ceiling result, determinant convergence, RH, a converse from RH,
   or a de Bruijn--Newman bound.

The terminal conclusion is only an exact scalar reduction and a sharp
no-go for the presently frozen inputs.  The formal state remains
`P0_INVALIDATED`.
