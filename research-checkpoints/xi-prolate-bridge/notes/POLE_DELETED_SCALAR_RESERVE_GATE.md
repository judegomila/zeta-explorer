# Pole-deleted scalar reserve gate

## 1. Scope

Checkpoint 0.49 reduced bounded zero-height trace for the actual finite Weil
ground line to one height-`1/2` pole-leverage ratio.  This note removes the
pole algebraically and proves that the entire target is equivalent to one
mixed inverse entry of the remaining complete source multiplier.

The reduction is exact and eigenvector-free once the inverse is formed.  It
does not prove the required lower bound for the arithmetic matrices.  An
exact Cauchy countermodel shows that the finite sign, conditioning,
pointwise-positivity, and commutator hypotheses do not imply that bound.
The formal project state remains `P0_INVALIDATED`.

## 2. Locked finite domain

Let `E_N^+` and `E_N^-` be the inversion-even and inversion-odd sectors of
the source Fourier space.  Assume the checkpoint-0.49 finite domain:

- the complete real-axis source matrix is assembled as pole plus
  archimedean multiplier minus prime, including every prime power
  `n<=lambda^2`;
- its lowest eigenvalue `epsilon` is simple with a real inversion-even ground
  vector `x`;
- `T_+=Q_+-epsilon*I` is positive semidefinite with kernel `C*x`;
- `T_-=Q_--epsilon*I` is positive definite;
- the source boundary scalar `c=<eta,x>` and zero coefficient
  `x_0=<e_0^+,x>` are nonzero.

Let

\[
 \ell_+(f)=\widehat f(i/2),\qquad
 \ell_-(f)=\widehat f(i/2),                       \tag{2.1}
\]

on the respective parity sectors, and let their finite Riesz vectors be

\[
 p_+=P_{E_N^+}\cosh(y/2),\qquad
 p_-=P_{E_N^-}\sinh(y/2).                        \tag{2.2}
\]

The locked Fourier sign is
`hat(f)(z)=integral f(y)*exp(-i*z*y)dy`.  The source pole form restricts to

\[
 P_+=2|p_+\rangle\langle p_+|,
 \qquad
 P_-=-2|p_-\rangle\langle p_-|.                  \tag{2.3}
\]

The projections in (2.2) are mandatory.  Replacing them by continuum Riesz
vectors changes the finite matrices.

Put

\[
 h=\langle p_+,x\rangle=\widehat x(i/2).          \tag{2.4}
\]

The quotient product from checkpoint 0.49 is positive at height `1/2`, so
the declared odd-positive and `x_0!=0` domain gives `h!=0`.

## 3. The pole-deleted even operator

Define

\[
 \boxed{S_+=T_+-2|p_+\rangle\langle p_+|.}        \tag{3.1}
\]

This deletes only the pole after the complete source matrix and its ground
shift have been assembled.  It is the finite even compression of the
combined real-axis multiplier `m_lambda-epsilon`; the archimedean and
minus-prime terms remain together.

### Theorem 3.1 (invertibility, inertia, and inverse ground line)

The operator `S_+` is invertible and

\[
 (n_+(S_+),n_-(S_+),n_0(S_+))=(N,1,0).            \tag{3.2}
\]

Moreover,

\[
 \boxed{S_+^{-1}p_+=-{x\over2h},}                 \tag{3.3}
\]

and

\[
 \boxed{\langle p_+,S_+^{-1}p_+\rangle=-{1\over2}.}       \tag{3.4}
\]

**Proof.**  The ground equation and (3.1) give

\[
 S_+x=-2p_+h,                                     \tag{3.5}
\]

which proves (3.3)--(3.4) once invertibility is known.

If `S_+y=0`, then `T_+y=2p_+<p_+,y>`.  Pairing with `x` and using `h!=0`
gives `<p_+,y>=0`; hence `T_+y=0`, so `y` is a multiple of `x`, and the same
pairing forces `y=0`.  Thus `S_+` is invertible.

On the codimension-one space `p_+^perp`, the quadratic forms of `S_+` and
`T_+` agree.  This restriction is positive definite because the kernel
vector `x` is not orthogonal to `p_+`.  Therefore `S_+` has at most one
negative direction.  Equation (3.5) gives

\[
 \langle x,S_+x\rangle=-2|h|^2<0,
\]

so it has exactly one.  This proves (3.2).  \(\square\)

## 4. The mixed inverse entry

Define

\[
 d_0=\langle e_0^+,S_+^{-1}p_+\rangle.            \tag{4.1}
\]

Equation (3.3) gives

\[
 d_0=-{x_0\over2h}.                               \tag{4.2}
\]

Since

\[
 {M_N(1/2)\over M_N(0)}={h\over\sqrt L\,x_0}>0,
\]

one has

\[
 \boxed{d_0<0,\qquad
 {M_N(1/2)\over M_N(0)}=-{1\over2\sqrt L\,d_0}.} \tag{4.3}
\]

With `alpha=L/(4*pi)` and the exact odd response

\[
 A(a)=1+\langle g_a,T_-^{-1}\beta\rangle,
\]

checkpoint 0.49 gives

\[
 \boxed{
 {A(\alpha)\over A(0)}
 =-{\sqrt L\over8\sinh(L/4)d_0}.}                 \tag{4.4}
\]

Thus the relative-response target is exactly the natural mixed-resolvent
reserve

\[
 \boxed{-d_0\gg L^{-1/2}.}                        \tag{4.5}
\]

No schedule assumption is needed for the algebraic equivalence between
(4.4) and (4.5).

## 5. Exact zero-height reserve equivalence

Retain the mandatory exterior product

\[
 E=E_N(1/2)=\prod_{n>N}
 \left(1+{1\over4(2\pi n/L)^2}\right),            \tag{5.1}
\]

and the quotient-root product

\[
 B=\prod_{k=1}^{N}\left(1+{1\over4\rho_k^2}\right).      \tag{5.2}
\]

Since `M_N(1/2)/M_N(0)=E*B`, (4.3) becomes

\[
 \boxed{d_0=-{1\over2\sqrt L\,E B}.}              \tag{5.3}
\]

Consequently, the checkpoint-0.49 product sandwich is

\[
 \boxed{
 4\log\left(-{1\over2\sqrt L\,E d_0}\right)
 \leq Z_{\lambda,N}^{(0)}
 \leq4\left(-{1\over2\sqrt L\,E d_0}-1\right).} \tag{5.4}
\]

Because `E>=1` and `B>=1`, the matching upper scale is automatic:

\[
 \boxed{0<-d_0\leq{1\over2\sqrt L}.}              \tag{5.5}
\]

Also

\[
 \log E\leq{L^2\over16\pi^2}
              \sum_{n>N}{1\over n^2}
 \leq {L^2\over16\pi^2N}.                       \tag{5.6}
\]

Hence, on every schedule for which `N/L^2` is bounded away from zero,
`E` is uniformly bounded.  In that domain,

\[
 \boxed{
 \sup Z_{\lambda,N}^{(0)}<\infty
 \quad\Longleftrightarrow\quad
 \inf(-\sqrt L\,d_0)>0.}                         \tag{5.7}
\]

This is an equivalence of uniform finite-family bounds, not a proof that the
right side holds for the arithmetic family.

## 6. Eigenvector-free determinant and diagonal replacement

The mixed inverse entry can be reconstructed from the pole-deleted matrix as

\[
 d_0={\langle e_0^+,\operatorname {adj}(S_+)p_+\rangle
             \over\det S_+}.                     \tag{6.1}
\]

More symmetrically, for every `tau>0`, the matrix determinant lemma and
(3.4) give

\[
 \boxed{
 \det(T_++\tau|e_0^+\rangle\langle e_0^+|)
 =-2\tau d_0^2\det S_+.}                          \tag{6.2}
\]

The left side is positive because `e_0^+` is not orthogonal to the ground
line; the right side has the same sign because `S_+` has one negative
eigenvalue.

Define the diagonal pole-deleted resolvent entry

\[
 c_0=\langle e_0^+,S_+^{-1}e_0^+\rangle.          \tag{6.3}
\]

The rank-one completion `T_+=S_++2|p_+><p_+|>=0` and (3.4) imply

\[
 \boxed{c_0+2d_0^2\geq0.}                         \tag{6.4}
\]

Therefore the source-specific diagonal estimate

\[
 c_0\leq-\kappa/L\qquad(\kappa>0)                \tag{6.5}
\]

would imply

\[
 -d_0\geq\sqrt{\kappa/2}\,L^{-1/2}.              \tag{6.6}
\]

Equation (6.5) is only an alternative target.  It is not proved by the
index-one inertia statement.

### 6.1 Exact Schur coordinates and parity collapse

Write the singular positive block relative to
`C*e_0^+ direct-sum H`, where `H=(e_0^+)^perp`, as

\[
 T_+=\begin{bmatrix}a&b^*\\b&C\end{bmatrix}.       \tag{6.7}
\]

Because `x_0!=0`, the principal block `C` is positive definite.  The kernel
equation gives

\[
 a=\langle b,C^{-1}b\rangle,
 \qquad x=x_0(1,-C^{-1}b).                       \tag{6.8}
\]

Write `p_+=(p_0,p)` in the same decomposition and put

\[
 p_0={4\sinh(L/4)\over\sqrt L},\qquad
 g=p_0-\langle p,C^{-1}b\rangle,qquad
 \mu=\langle p,C^{-1}p\rangle.                  \tag{6.9}
\]

Then `h=x_0*g`, so

\[
 \boxed{d_0=-{1\over2g}.}                        \tag{6.10}
\]

The change of variables `y=w-C^(-1)b*s` congrues `S_+` to

\[
 \begin{bmatrix}0&0\\0&C\end{bmatrix}
 -2|(g,p)\rangle\langle(g,p)|.
\]

Consequently, with `C_p=C-2|p><p|`,

\[
 \boxed{
 \det S_+=-2g^2\det C,qquad
 \det C_p=(1-2\mu)\det C,}                      \tag{6.11}
\]

and the diagonal identity sharpens to

\[
 \boxed{
 c_0=-{1-2\mu\over2g^2}
     =-2(1-2\mu)d_0^2,qquad
 c_0+2d_0^2=4\mu d_0^2.}                        \tag{6.12}
\]

Thus `c_0<0` is equivalent to `mu<1/2`; it does not follow from index-one
inertia and is stronger than the mixed reserve actually needed.

There is also an exact parity identity.  Let
`D_0 e_n^+=n e_n^-` on `H`, and retain
`alpha=L/(4*pi)`.  The centered source phase gives

\[
 p_-={i\over\alpha}D_0p.                         \tag{6.13}
\]

The phase disappears from the rank-one pole form.  Therefore

\[
 \boxed{
 D_0C_pD_0+\alpha^2S_-
 =D_0CD_0+\alpha^2T_-=:H_\alpha\succ0.}          \tag{6.14}
\]

The source displacement and parity-pencil determinant give

\[
 \boxed{
 {A(\alpha)\over A(0)}
 ={\det H_\alpha
   \over\det C\,\det(D_0^2+\alpha^2I)}
 ={g\over p_0}.}                                \tag{6.15}
\]

Here `A(0)=det(C)/det(T_-)`, while the same boundary normalization gives
`x_0=A(0)` and `h=p_0*A(alpha)`, proving the last equality.

Hence the principal-minor/odd-block route is exactly the existing response
gate in different coordinates.  Positivity of `H_alpha` does not control its
determinant relative to the two denominator determinants.  In the exact
Cauchy countermodel below, `C_11=3/4` and
`p_1/p_0=sqrt(2)*alpha^2/(alpha^2+1)`, so
`mu>=(4/3)*p_1^2` grows and `c_0` is eventually positive.  The
negative-diagonal route is not a generic consequence of the locked finite
structure.

## 7. Odd pole-deleted Woodbury form

The odd pole has the opposite sign.  Define

\[
 S_-=T_-+2|p_-\rangle\langle p_-|\succ0,          \tag{7.1}
\]

and

\[
 \kappa_-=\langle p_-,S_-^{-1}p_-\rangle,
 \qquad \delta_-=1-2\kappa_->0.                  \tag{7.2}
\]

Put

\[
 v=S_-^{-1}p_-,\qquad y=S_-^{-1}\beta,
 \qquad \zeta=\langle p_-,y\rangle.              \tag{7.3}
\]

Woodbury gives

\[
 T_-^{-1}\beta=y+{2\zeta\over\delta_-}v.         \tag{7.4}
\]

Thus

\[
 A(a)={\mathcal B(a)\over\delta_-},              \tag{7.5}
\]

where

\[
 \mathcal B(a)=
 \delta_-\{1+\langle g_a,y\rangle\}
 +2\zeta\langle g_a,v\rangle,                   \tag{7.6}
\]

and consequently

\[
 \boxed{{A(\alpha)\over A(0)}
 ={\mathcal B(\alpha)\over\mathcal B(0)}.}       \tag{7.7}
\]

Positivity and norm control of `S_-^(-1)` do not bound this ratio: the target
is a cancellation among all three terms in (7.6).

## 8. Exact source-multiplier target

Let

\[
 v_+=S_+^{-1}p_+.                                 \tag{8.1}
\]

For every `f in E_N^+`, the exact weak equation is

\[
 \langle f,S_+v_+\rangle=\langle f,p_+\rangle.   \tag{8.2}
\]

Using the complete source multiplier representation, its left side is

\[
\begin{aligned}
 \int_{\mathbb R}
 &\overline{\widehat f(t)}\widehat v_+(t)
 \left[
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)
 -\log\pi\right.\\
 &\left.\qquad
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
       \cos(t\log n)-\epsilon
 \right]{dt\over2\pi}.                           \tag{8.3}
\end{aligned}
\]

The unresolved arithmetic statement is precisely

\[
 -\langle e_0^+,v_+\rangle\gg L^{-1/2}.           \tag{8.4}
\]

The operator `S_+` necessarily has one negative direction, so a global
nonnegative symbol floor is impossible; separate block-norm bounds alone do
not control the mixed orientation.  A valid argument must preserve the
combined archimedean--minus-prime response.

### 8.1 Exact Bernstein--Levy form and its spectral obstruction

The combined nonpole multiplier has more positivity before the ground shift
than is visible in (8.3).  Put

\[
 m_0=\psi(1/4)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n},
 \qquad u_j=j+{1\over4}.                          \tag{8.5}
\]

The digamma series and the exact minus-prime sign give

\[
 \boxed{
 m_\lambda(t)-m_0
 =\Phi(t^2)+2\sum_{1<n\leq\lambda^2}
 {\Lambda(n)\over\sqrt n}\{1-\cos(t\log n)\},} \tag{8.6}
\]

where

\[
 \Phi(s)=\sum_{j=0}^{\infty}{s\over u_j(s+4u_j^2)}
 =\int_{(0,\infty)}{s\over s+r}\,
   \sum_{j=0}^{\infty}{\delta_{4u_j^2}(dr)\over u_j}.     \tag{8.7}
\]

The representing measure satisfies
`sum_j 1/(u_j*(1+4*u_j^2))<infinity`, so `Phi` is a complete Bernstein
function and

\[
 \Phi(t^2)\geq{16t^2\over1+4t^2}.                \tag{8.8}
\]

Equivalently, define the symmetric Levy measure

\[
 \nu_\lambda(dh)=
 {e^{-|h|/2}\over1-e^{-2|h|}}\,dh
 +\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
   (\delta_{\log n}+\delta_{-\log n})(dh).       \tag{8.9}
\]

It satisfies the Levy integrability condition
`integral min(1,h^2)*nu_lambda(dh)<infinity` for every finite `lambda`.
For the mandatory zero extension `tilde(f)`, the compression
`mathscr A=m_lambda(D)-m_0*I` has the exact Dirichlet form

\[
 \boxed{
 \langle f,\mathscr Af\rangle
 ={1\over2}\int_{\mathbb R}\!\int_{\mathbb R}
 |\widetilde f(x+h)-\widetilde f(x)|^2
 \,\nu_\lambda(dh)\,dx\geq0.}                  \tag{8.10}
\]

No prime term has been bounded separately in (8.6)--(8.10); its exact
translation energy is retained.  Nevertheless this does not put the desired
resolvent on the positive side of the spectrum.  If

\[
 z=\epsilon-m_0,
 \qquad \mathscr A_\pm=P_{E_N^\pm}\mathscr A P_{E_N^\pm},
\]

then

\[
 S_+=\mathscr A_+-zI,
 \qquad S_-=\mathscr A_--zI.                     \tag{8.11}
\]

The proved inertia and odd positivity say

\[
 \boxed{
 \lambda_1(\mathscr A_+)<z<\lambda_2(\mathscr A_+),
 \qquad z<\lambda_1(\mathscr A_-).}              \tag{8.12}
\]

Thus the even inverse is evaluated in the first spectral gap, not below the
ground energy.  The standard below-spectrum positivity-preserving resolvent
and maximum-principle route therefore does not directly control this signed
mixed entry.  For the absolute exponential weight `exp(alpha*|x|)`, the
archimedean part of the standard uniform conjugation penalty is
`-Phi(-alpha^2)` for `0<alpha<1/2`; it diverges as `alpha` tends to `1/2`.
Using the sharp supremum
`abs(alpha*abs(x+h)-alpha*abs(x))<=alpha*abs(h)`, the prime part of
the same uniform penalty is

\[
 \sum_{1<n\leq\lambda^2}\Lambda(n)n^{\alpha-1/2}
       (1-n^{-\alpha})^2
\]

for weight `exp(alpha*|x|)`.  At `alpha=1/2` the exact cost becomes
`sum Lambda(n)*(1-n^(-1/2))^2` through `n<=lambda^2`; replacing it by an
absolute bound loses the prime cancellation scale.  An absolute-value Agmon
route therefore does not directly prove the mixed reserve.

## 9. Exact structural countermodel

The locked Cauchy family in
`notes/GROUND_TRANSFORM_TILT_JET_REDUCTION.md` has

\[
 x={3\over4}e_0^++{\sqrt2\over8}e_1^+,            \tag{9.1}
\]

with boundary-normalized ground polynomial

\[
 {1\over2}\leq{3\over4}-{1\over4}
       \cos(2\pi y/L)\leq1.                      \tag{9.2}
\]

It has exact source Cauchy displacement, a simple even ground, and uniformly
conditioned positive odd block

\[
 {9\over16}I\prec T_-\prec{9\over4}I.             \tag{9.3}
\]

Its response is

\[
 A_N(a)={a^2+3/4\over a^2+1},                    \tag{9.4}
\]

so

\[
 {A_N(a)\over A_N(0)}
 ={4a^2+3\over3(a^2+1)}
 ={4\over3}-{1\over3(a^2+1)}.                   \tag{9.5}
\]

At `alpha=L/(4*pi)`, (9.5) tends to `4/3`, not to zero, even on schedules
with `N/alpha^2->infinity`.  The mixed pole-deleted entry is

\[
 d_0=-{3\sqrt L(\alpha^2+1)
        \over8\sinh(L/4)(4\alpha^2+3)}
 \sim-{3\sqrt L\over16e^{L/4}},                  \tag{9.6}
\]

and hence `-sqrt(L)*d_0->0`.

For each `L,N`, use the actual finite Riesz vectors `p_+` and `p_-` in this
algebraic decomposition.  This retains the exact projected pole signs but not
the arithmetic nonpole multiplier.

This defeats every generic inference from a simple even ground, positive and
uniformly conditioned odd block, pointwise ground positivity, exact Cauchy
commutation, these exact projected pole signs, or a quadratic schedule.  The
family is not the arithmetic source multiplier; it proves that the combined
arithmetic symbol in (8.3) is indispensable.

There is also a two-dimensional rational index-one model.  For `0<t<1`, let

\[
 x=(t,1)^T,\qquad p=(1,1)^T,
 \qquad T=(1,-t)^T(1,-t).                         \tag{9.7}
\]

Then `T>=0`, `ker(T)=C*x`, and `S=T-2pp^T` has inertia `(1,1,0)`, while

\[
 \langle e_0,S^{-1}p\rangle=-{t\over2(t+1)}
 \longrightarrow0.                               \tag{9.8}
\]

Thus index-one geometry and the exact leverage `-1/2` do not control the
mixed orientation.

The same failure persists inside a positive killed jump form with a positive
constant ground.  For `P>1`, put

\[
 p=(P,1)^T,\quad x=(1,1)^T,\quad v=(1,-1)^T,
 \quad T=vv^T,\quad S=T-2pp^T,                   \tag{9.9}
\]

and set

\[
 z=2P^2+2P+1,
 \qquad \mathscr A=S+zI.                         \tag{9.10}
\]

Then

\[
 u^T\mathscr Au
 =(2P+1)(u_1-u_2)^2+u_1^2+(2P^2-1)u_2^2,        \tag{9.11}
\]

so `mathscr A` is a strictly positive symmetric killed-graph Dirichlet form,
while

\[
 \mathscr A+2pp^T=zI+T                           \tag{9.12}
\]

has the simple positive constant ground `x`.  For
`e=(1,1)^T/sqrt(2)`, however,

\[
 \boxed{
 \langle e,S^{-1}p\rangle
 =-{1\over\sqrt2(P+1)}\longrightarrow0.}         \tag{9.13}
\]

The exact pole leverage remains `<p,S^(-1)p>=-1/2`.
Taking `P=cosh(L/4)` even gives exponential collapse.  This is a structural
countermodel, not the arithmetic Levy measure (8.9).  It proves that the
Bernstein--Levy rewrite needs new phase-sensitive control of its negative
spectral direction; positivity of the unshifted Dirichlet form and a positive
ground do not suffice.

## 10. Finite reconnaissance only

The already stored `N=3*ceil(lambda^2)` diagnostics give the following
derived values.  They were recomputed from the complete matrices through
the pole leverage, centered transform, and odd-response paths.

| `(lambda,N)` | `B=M(1/2)/(M(0)E)` | `Z^(0)` | `A(alpha)/A(0)` | `L^(5/2)*tau_U` |
|---|---:|---:|---:|---:|
| `(1.75,12)` | `1.00332709158294` | `0.01329072905779` | `0.990981892746487` | `0.00281291` |
| `(2,12)` | `1.00345389179988` | `0.01379629251803` | `0.984601469848401` | `0.00276468` |
| `(2.25,18)` | `1.00383181816527` | `0.01530256720618` | `0.977724790173885` | `0.00261086` |
| `(2.75,24)` | `1.00404707793293` | `0.01616024837309` | `0.963498428627007` | `0.00128916` |

The displayed zero-height diagnostics lie inside the mandatory sandwich
(5.4) to the shown point precision.  The derived ground quantities and the
underlying four table matrices are not ball-enclosed.  Matched same-pair
doubled-precision artifacts are not currently serialized for all four points,
and the available independent point-formula paths share `mpmath`.  Native
FLINT/Arb enclosures elsewhere in P0 cover smaller pilot matrices and do not
certify this table.  The four points prove no exponent or asymptotic
statement.

The orientation-free `r/gamma` diagnostic grows from approximately `0.05`
to `8.9*10^7` across the same points while the oriented `tau_U` decreases.
This illustrates why the mixed inverse orientation, rather than a gap-only
bound, is the correct numerical target.  It is not evidence that the
arithmetic lower reserve (8.4) holds on an unbounded schedule.

## 11. Remaining obligation

Checkpoint 0.49 proved that the projected source-normalized anchor has the
correct zero-height coefficient rate.  This note proves that the actual
ground rate is equivalent to (8.4), and that generic finite structure cannot
prove it.

A closing theorem must therefore estimate the signed solution of the
combined pole-deleted source multiplier, or prove an equivalent complete
middle/full graph comparison.  The existing high-Fourier coercivity begins
only beyond a large cutoff, while the intervening middle window has neither
a signed floor nor a source-metric action estimate.  The exact principal
Schur, parity-pole, and Bernstein--Levy identities above all collapse back to
the same mixed orientation and do not fill that gap.  No current repository
theorem does.
