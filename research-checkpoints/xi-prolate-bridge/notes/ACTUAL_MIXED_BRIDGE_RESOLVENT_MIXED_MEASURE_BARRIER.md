# Actual mixed-bridge resolvent mixed-measure barrier

## 0. Outcome and claim boundary

Let `H` be the pole-free odd block, let `p` be the odd hyperbolic pole,
and let `w` be the raw mixed bridge.  Below the spectrum of `H`, put

\[
 R_z=(H-zI)^{-1},\qquad
 m(z)=\langle p,R_zp\rangle,\qquad
 F(z)=\langle w,R_zp\rangle.                         \tag{0.1}
\]

At a pole-created eigenvalue `mu` of

\[
 Q_t=H-t|p\rangle\langle p|,\qquad t>0,              \tag{0.2}
\]

the secular equation is `t*m(mu)=1`, and the normalized eigenvector is

\[
 g_\mu={R_\mu p\over\sqrt{m'(\mu)}}.                 \tag{0.3}
\]

Consequently the desired bridge overlap is exactly

\[
 \boxed{\left|\langle w,g_\mu\rangle\right|^2
 ={ |F(\mu)|^2\over m'(\mu)}.}                       \tag{0.4}
\]

For the source load `t=2`, the transverse Feshbach scalar in the preceding
checkpoint is

\[
 \boxed{
 \langle B_\mu^{-1}r,w^\perp\rangle
 ={\beta\over\sqrt M}-2\sqrt M\,F(\mu),\qquad
 1+\|B_\mu^{-1}r\|^2=4M m'(\mu),}                    \tag{0.5}
\]

where `M=||p||^2` and `beta=<p,w>`.  Thus exact transverse cancellation is
the single statement `F(mu)=0`.

The scalar `F` is the Cauchy transform of the signed mixed spectral measure

\[
 \nu_{p,w}(A)=\langle w,E_H(A)p\rangle,
 \qquad F(z)=\int_{\mathbb R}{d\nu_{p,w}(x)\over x-z},
 \qquad \beta=\nu_{p,w}(\mathbb R).                   \tag{0.6}
\]

The actual pole-row asymptotic therefore controls only the total mass of
the mixed measure.  It does not control the phases of that measure across
the spectrum.

This note proves that this distinction is sharp.  For every prescribed
`M>0`, `beta>0`, and bridge norm `W` satisfying

\[
 W^2\geq {4\beta^2\over M},                            \tag{0.7}
\]

there are two positive, compact-resolvent, simple-spectrum models with
the same `H`, the same cyclic pole `p`, the same complete diagonal spectral
measures of `p` and `w`, the same positive pole row, the same pole-load
branch and every load derivative, a gap comparable to `M`, and a bounded
normalization denominator.  In one model `F(0)=0` exactly; in the other
`F(0)>0`.  At every spectral atom the matrix-valued measure saturates
Cauchy--Schwarz.  Only its sign changes.

The literal arithmetic synthesis does retain one structure absent from
that model.  For every odd `g`, define its exact positive-half row by

\[
 r_g(v)
 ={1\over\sqrt v}\sum_{1\leq n\leq\lambda v}
 {g(\log(v/n))\over\sqrt n},
 \qquad \lambda^{-1}\leq v\leq\lambda.              \tag{0.8}
\]

This row is not by itself the Hilbert adjoint on the full even source
space.  With the source norm on `[-lambda,lambda]`, that adjoint is

\[
 \boxed{
 ({\cal E}_{\lambda,{\rm ev}}^*g)(x)
 ={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}r_g(|x|).}
                                                               \tag{0.9}
\]

Its projection to the even zero-integral source space is

\[
 \boxed{
 ({\cal E}_{\lambda,0}^*g)(x)
 ={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}r_g(|x|)-c_g,
 \qquad
 c_g={1\over2\lambda}
       \int_{\lambda^{-1}}^\lambda r_g(v)\,dv.}       \tag{0.10}
\]

The usual harmonic pole row is `r_p`; the unresolved mixed row is
`r_(R_mu*p)`.  A source-specific sign or anti-cancellation theorem for
that generalized harmonic row is the exact way the arithmetic source
could defeat the countermodel.

No such theorem is proved here.  No lower bound for (0.4), no bottom
projector floor, no new zero statement, and no Riemann-hypothesis
conclusion follows.  The standard eight are untouched, and the formal
state remains `P0_INVALIDATED`.

## 1. Frozen inputs

No external source or zero table is used.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_MIXED_BRIDGE_POLE_ROW_RESOLVENT_CANCELLATION_REDUCTION.md` | `610aa2b58734ab191e561bbaa7529f0558e1f979fa67461273e69f6d6253cde2` |
| `tests/test_actual_mixed_bridge_pole_row_resolvent_cancellation_reduction.py` | `678e6da6c989c536ba6131fdfd38fe5927c60d464b29e8d358d94af0a9c0f2a4` |
| `notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md` | `703c19f9cbadd73e6b60672a6f836fc2bd0bf7d43eaa5f60ac5806dd1cdc0d18` |
| `notes/ODD_KRYLOV_TRANSVERSE_CRITICAL_LOAD.md` | `c5134b4fb80bf2fcb654a1b31a7422aa089973a664cda90707d30ce7e469ddcc` |
| `notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md` | `157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9` |
| `tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py` | `d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae` |

The first pair supplies the actual bridge pole row, its limiting sign, and
the pole-axis Feshbach identity.  The odd-pole note supplies the literal
arithmetic synthesis and the inclusive endpoint convention.  The odd
Krylov note supplies the split-Chebyshev pole action and the locked
prime-threshold jumps.  The full-source adjoint pair supplies the exact
evenization factor and zero-integral constant projection.  The arguments
below use no claim beyond those frozen inputs.

## 2. Exact mixed-resolvent dictionary

Work first in a real Hilbert space.  Let `H=H*` be bounded below, let
`z<inf sigma(H)`, and let `p` and `w` be nonzero vectors.  Define

\[
 M=\|p\|^2,\qquad \beta=\langle p,w\rangle,
 \qquad n(z)=\langle w,R_zw\rangle.                   \tag{2.1}
\]

The spectral theorem gives (0.6), together with the positive diagonal
measures

\[
 d\mu_p(x)=d\langle p,E_H(x)p\rangle,
 \qquad d\mu_w(x)=d\langle w,E_H(x)w\rangle.          \tag{2.2}
\]

Their `2 by 2` matrix-valued measure is positive, so

\[
 |\nu_{p,w}(A)|^2\leq\mu_p(A)\mu_w(A).                \tag{2.3}
\]

This is an upper bound.  It supplies neither a sign nor a lower bound for
the Cauchy transform in (0.6).

### Theorem 2.1 (secular root, residue, and Feshbach scalar)

Suppose `mu<inf sigma(H)` and

\[
 t m(\mu)=1.                                           \tag{2.4}
\]

Then `mu` is the unique pole-created eigenvalue of `Q_t` below the
pole-free spectrum, it is simple, and (0.3)--(0.4) hold.  Moreover,

\[
 (Q_t-zI)^{-1}
 =R_z+{tR_z|p\rangle\langle p|R_z\over1-tm(z)},       \tag{2.5}
\]

and hence

\[
 \langle w,(Q_t-zI)^{-1}w\rangle
 =n(z)+{tF(z)^2\over1-tm(z)}.                         \tag{2.6}
\]

The residue of (2.6) at `z=mu` is the negative of (0.4).

To recover the transverse formula, put `e=p/sqrt(M)` and write

\[
 H-\mu I=
 \begin{bmatrix}A&r^*\\r&B\end{bmatrix}
 \quad\hbox{on }\mathbb Re\oplus e^\perp,
 \qquad x=B^{-1}r.                                    \tag{2.7}
\]

The scalar Schur complement is `s=A-r^*B^(-1)r`.  Block inversion and
(2.4) give

\[
 s=tM,\qquad
 R_\mu p={1\over t\sqrt M}(e-x),\qquad
 m'(\mu)={1+\|x\|^2\over t^2M}.                      \tag{2.8}
\]

Writing

\[
 w={\beta\over\sqrt M}e+w^\perp                       \tag{2.9}
\]

now gives

\[
 F(\mu)={\beta\over tM}
 -{\langle x,w^\perp\rangle\over t\sqrt M}.          \tag{2.10}
\]

Equations (0.4)--(0.5) follow when `t=2`.

**Proof.**  The derivative identity

\[
 m'(z)=\|R_zp\|^2>0                                   \tag{2.11}
\]

makes the secular root simple.  The eigenvalue equation gives a vector
proportional to `R_mu*p`, proving (0.3)--(0.4).  Formula (2.5) is the
rank-one resolvent identity, and (2.6) follows by taking its bridge
diagonal.  Finally, block inversion gives

\[
 m(\mu)={M\over s},\qquad
 R_\mu p={\sqrt M\over s}(e-B^{-1}r).                 \tag{2.12}
\]

Substitution of (2.4) proves (2.8)--(2.10).  `square`

### 2.1 What load and derivative sum rules see

Let `mu(t)` denote the simple secular branch.  Differentiating (2.4), or
using Hellmann--Feynman, gives

\[
 \boxed{
 \mu'(t)=-{1\over t^2m'(\mu(t))}
 =-|\langle p,g_{\mu(t)}\rangle|^2.}                  \tag{2.13}
\]

Every derivative with respect to the scalar load is determined by the
diagonal measure `mu_p`; none sees `nu_(p,w)`.  The mixed measure appears
only when the pole vector itself is sheared.  Put

\[
 p_\epsilon=p+\epsilon w,
 \qquad Q_{t,\epsilon}=H-t|p_\epsilon\rangle
                              \langle p_\epsilon|.     \tag{2.14}
\]

For the associated simple branch,

\[
 \boxed{
 \left.{\partial\mu(t,\epsilon)\over\partial\epsilon}
 \right|_{\epsilon=0}
 =-{2F(\mu(t))\over m'(\mu(t))}.}                    \tag{2.15}
\]

Thus the desired mixed response is exactly the missing pole-shear
derivative.  Scalar load monotonicity cannot sign it.

There is a corresponding Ward identity, but it requires an operator
relation absent from the bridge construction.  If `D*=-D` and `w=Dp`, then

\[
 2\operatorname {Re}F(z)
 =-\langle R_zp,[H,D]R_zp\rangle.                     \tag{2.16}
\]

In particular, commutation would make the derivative response zero, not
positive.  The actual mixed bridge is an arithmetic synthesis of a
prolate label combination; it is not `Dp` for the hyperbolic pole.

If a source parameter changes both `H` and `p`, then at fixed `z`

\[
 {d\over d\lambda}\langle p,R_zp\rangle
 =2\operatorname {Re}\langle \dot p,R_zp\rangle
 -\langle R_zp,\dot H R_zp\rangle.                   \tag{2.17}
\]

Even an identity `dot(p)=w` would therefore leave the complete source
variation term.  No such pole/bridge identity is frozen.

### 2.2 The sharp scalar-data bound

Decompose

\[
 R_\mu p={m(\mu)\over M}p+v,
 \qquad
 w={\beta\over M}p+u,
 \qquad u,v\perp p.                                   \tag{2.18}
\]

Then

\[
 \|v\|^2=m'(\mu)-{m(\mu)^2\over M},qquad
 \|u\|^2=\|w\|^2-{\beta^2\over M},                  \tag{2.19}
\]

and hence

\[
 \boxed{
 |F(\mu)|\geq
 \left(
 {\beta m(\mu)\over M}
 -\sqrt{\left(\|w\|^2-{\beta^2\over M}\right)
              \left(m'(\mu)-{m(\mu)^2\over M}\right)}
 \right)_+.}                                          \tag{2.20}
\]

This is sharp: in dimension at least three, the angle between `u` and `v`
can attain every value allowed by Cauchy--Schwarz.  Thus diagonal data give
a positive lower bound only when the first term strictly dominates the
full orientation radius.  The actual frozen inputs provide no such
dominance.

## 3. Simple-spectrum cyclic counterpair with fixed diagonal measures

### Theorem 3.1 (only the mixed spectral phase changes)

Fix `M>0`, `beta>0`, and `W` satisfying (0.7).  There exist positive
numbers `p_1,...,p_4` such that

\[
 \sum_{j=1}^4p_j^2=M,
 \qquad {\beta^2\over4}\sum_{j=1}^4{1\over p_j^2}=W^2. \tag{3.1}
\]

Put

\[
 a={\beta\over2},\qquad
 (\rho_1,\rho_2,\rho_3,\rho_4)=(1,2,4,7),
 \qquad S=\sum_{j=1}^4p_j^2\rho_j,                    \tag{3.2}
\]

and on `R^4` define

\[
 R={1\over2S}\operatorname {diag}(1,2,4,7),
 \qquad H=R^{-1},
 \qquad p=(p_1,p_2,p_3,p_4)^T.                       \tag{3.3}
\]

Finally define

\[
 w^{(0)}=a\left({1\over p_1},{1\over p_2},
                 {1\over p_3},-{1\over p_4}\right)^T,
 \qquad
 w^{(1)}=a\left(-{1\over p_1},{1\over p_2},
                 {1\over p_3},{1\over p_4}\right)^T. \tag{3.4}
\]

Then all of the following hold.

1. `H` is positive with four distinct eigenvalues, `p` is cyclic for `H`,
   and

\[
 {2M\over7}\leq\inf\sigma(H)={2S\over7}\leq2M,
 \qquad
 2M\leq\|H\|=2S\leq14M.                              \tag{3.5}
\]

2. The Birman--Schwinger equation at `mu=0`, `t=2` is exact:

\[
 \langle p,Rp\rangle={1\over2}.                       \tag{3.6}
\]

Therefore `Q=H-2|p><p|` is positive semidefinite with one-dimensional
kernel `R p`; its ground is simple and pole-created below `sigma(H)`.

3. The normalization denominator is uniformly controlled:

\[
 1\leq4M\|Rp\|^2
 ={M\sum_jp_j^2\rho_j^2\over S^2}\leq7.             \tag{3.7}
\]

4. Both bridge vectors have the prescribed row and norm:

\[
 \langle p,w^{(0)}\rangle
 =\langle p,w^{(1)}\rangle=\beta,
 \qquad
 \|w^{(0)}\|=\|w^{(1)}\|=W.                         \tag{3.8}
\]

5. Their complete diagonal spectral measures are identical:

\[
 \mu_{w^{(0)}}=\mu_{w^{(1)}}
 =\sum_{j=1}^4{a^2\over p_j^2}\delta_{2S/\rho_j}.    \tag{3.9}
\]

At each atom, the two mixed measures have weights

\[
 d\nu_0=a(+,+,+,-),\qquad
 d\nu_1=a(-,+,+,+),                                  \tag{3.10}
\]

so every atom saturates (2.3).  Nevertheless,

\[
 \boxed{
 F_0(0)={a\over2S}(1+2+4-7)=0,
 \qquad
 F_1(0)={a\over2S}(-1+2+4+7)={3\beta\over S}>0.}     \tag{3.11}
\]

**Proof.**  On the positive sphere `sum p_j^2=M`, the continuous function
`sum p_j^(-2)` has minimum `16/M` at equal coordinates and tends to
infinity at the boundary.  This proves the existence assertion in (3.1).
The spectrum in (3.3) is simple, and every coordinate of `p` is nonzero,
so its Krylov matrix is a scaled Vandermonde matrix and `p` is cyclic.
The bounds (3.5) follow from

\[
 M\leq S\leq7M.                                       \tag{3.12}
\]

Equation (3.6) follows directly from the definition of `S`.  Also

\[
 Q=H^{1/2}
 \left(I-2|H^{-1/2}p\rangle\langle H^{-1/2}p|\right)
 H^{1/2},                                              \tag{3.13}
\]

and `||H^(-1/2)p||^2=1/2`; hence the middle factor is an
orthogonal projector with a one-dimensional kernel.  Cauchy--Schwarz gives
the lower bound in (3.7), while `rho_j^2<=7*rho_j` gives its upper bound.
Equations (3.8)--(3.11) are direct substitutions.  `square`

The two models have the same functions `m(z)` and `n(z)`, not merely the
same values at the live root.  They also have the same determinant
`1-t*m(z)`, the same complete pole-load eigenvalue branch, and the same
load derivatives (2.13) of every order.  What differs is only the
off-diagonal measure `nu_(p,w)`.

The exact zero is not the only obstruction to a quantitative estimate.
Replacing the last spectral weight `7` by `7+epsilon` gives

\[
 F_0(0)=-{a\epsilon\over2S_\epsilon},                 \tag{3.14}
\]

while the gap, condition number, and denominator remain bounded by fixed
multiples of `M` for `0<epsilon<=1`.  Taking, for example,
`epsilon=exp(-lambda^2)` defeats every structural lower bound at the
`exp(-o(lambda^2))` scale, even after exact zero is excluded.

### 3.1 Positive-coordinate cancellation with a reflected-atom sign

There is a complementary three-dimensional model showing that positivity
of the two profiles in a coordinate cone does not repair the implication.
For prescribed `M,beta>0`, put

\[
 H=2M\begin{bmatrix}5&2&0\\2&1&0\\0&0&1\end{bmatrix},
 \qquad
 p=\sqrt{M/2}(1,1,0)^T,
 \qquad
 k={\beta\over2\sqrt{2M}}.                            \tag{3.15}
\]

If `W^2>=5*beta^2/(4M)`, set

\[
 w=\left(3k,k,
 \sqrt{W^2-{5\beta^2\over4M}}\right)^T.              \tag{3.16}
\]

Both `p` and `w` are coordinatewise nonnegative, `H>0`, and the positive
off-diagonal entry has the same sign as a reflected odd prime atom.  Yet

\[
 H^{-1}={1\over2M}
 \begin{bmatrix}1&-2&0\\-2&5&0\\0&0&1\end{bmatrix},
 \qquad
 \langle p,H^{-1}p\rangle={1\over2},
 \qquad
 \langle w,H^{-1}p\rangle=0.                         \tag{3.17}
\]

Moreover `H-2|p><p|` has eigenvalues `0,10M,2M`,

\[
 \inf\sigma(H)=2M(3-2\sqrt2),
 \qquad 4M\|H^{-1}p\|^2=5.                           \tag{3.18}
\]

Thus even positive profiles, a linear pole-free gap, and a constant
normalization denominator coexist with complete cancellation.  This is an
abstract sign-compatible model, not a replacement for the source matrix.

## 4. Literal source adjoint and the generalized harmonic row

Return to the locked physical interval with

\[
 a=\log\lambda,
 \qquad ({\cal E}_\lambda f)(y)
 =e^{y/2}\sum_{n\geq1}f(ne^y),
 \qquad -a\leq y\leq a,                               \tag{4.1}
\]

where the even source `f` is extended by zero and supported in
`[-lambda,lambda]`.  Let `g` be an odd `L2` function on the interval.
Since `S_-g=g`, direct substitution `v=n*e^y` gives

\[
\begin{aligned}
 \langle S_-{\cal E}_\lambda f,g\rangle
 &=\sum_{n\geq1}\int_{n/\lambda}^{n\lambda}
 f(v){\overline{g(\log(v/n))}\over\sqrt{nv}}\,dv\\
 &=\int_{\lambda^{-1}}^\lambda f(v)\overline{r_g(v)}\,dv.
\end{aligned}                                         \tag{4.2}
\]

Thus (0.8) is the exact positive-half row.  It is not the full-even Hilbert
adjoint: the source norm counts the positive half twice.  Therefore

\[
 \boxed{
 ({\cal E}_{\lambda,{\rm ev}}^*g)(x)
 ={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}r_g(|x|).}
                                                               \tag{4.3}
\]

Writing `H_0^ev` for the even zero-integral source space, orthogonal
projection subtracts the exact constant

\[
 \boxed{
 ({\cal E}_{\lambda,0}^*g)(x)
 ={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}r_g(|x|)-c_g,
 \qquad
 c_g={1\over2\lambda}
       \int_{\lambda^{-1}}^\lambda r_g(v)\,dv.}       \tag{4.4}
\]

For a zero-integral even source such as `b_lambda`, the constant term
pairs to zero and the two reflected half-factors add back to the
positive-half pairing (4.2).  Hence the bridge formulas below retain their
original normalization.  The upper arithmetic index is inclusive.  For
`0<v<1/lambda` the sum is empty.

For the hyperbolic pole `p(y)=sinh(y/2)`, every summand reduces to

\[
 {1\over\sqrt{nv}}p(\log(v/n))
 ={1\over2}\left({1\over n}-{1\over v}\right).       \tag{4.5}
\]

Thus, with `N=floor(lambda*v)`, (4.2) gives exactly

\[
 \langle S_-{\cal E}_\lambda f,p\rangle
 ={1\over2}\int_{1/\lambda}^{\lambda}
 f(v)\left(H_N-{N\over v}\right)dv.                  \tag{4.6}
\]

For `f=b_lambda`, this is the frozen bridge pole row `beta_lambda`.

Now let `H=H_-` and let `mu` be the pole-created live root.  Since
`R_mu*p` is odd, the same calculation gives the exact source formula

\[
 \boxed{
 F_\lambda(\mu)
 =\int_{1/\lambda}^{\lambda}b_\lambda(v)
 {1\over\sqrt v}\sum_{1\leq n\leq\lambda v}
 {(R_\mu p_\lambda)(\log(v/n))\over\sqrt n}\,dv.}    \tag{4.7}
\]

More generally, for every Borel set `A`,

\[
 \nu_{p,w}(A)
 =\int_{1/\lambda}^{\lambda}b_\lambda(v)
 r_{E_H(A)p_\lambda}(v)\,dv.                         \tag{4.8}
\]

Equation (4.8) is the complete source constraint on the mixed spectral
measure.  Formula (4.6) is only its total-mass case `A=R`.  Proving that
the generalized row in (4.7) retains a controlled phase relative to (4.6)
would defeat Theorem 3.1.  No frozen estimate does so.

## 5. Why the locked prime jumps do not supply the phase

On a locked grid, the unprojected centered residual

\[
 r={1\over\sqrt M}P_{p^\perp}Hp                       \tag{5.1}
\]

has, at every prime-power threshold `x_n=log(n/lambda)`, the positive jump

\[
 J_n={\Lambda(n)\over\sqrt{nM}}\sinh(a/2)>0.          \tag{5.2}
\]

This proves `r!=0`, but the transverse scalar is

\[
 \langle B_\mu^{-1}r,w^\perp\rangle
 =\langle r,B_\mu^{-1}w^\perp\rangle.                 \tag{5.3}
\]

The jump list does not sign (5.3).  Indeed, let `Sigma` be any finite set
of thresholds and let `u` be a nonzero transverse `L2` vector.  Smooth
functions supported away from `Sigma` and orthogonal to `p` are dense in
the transverse space.  Hence one can choose such a `phi` with
`<phi,u>!=0`.  The functions

\[
 r_c=r_0+c\phi                                         \tag{5.4}
\]

have exactly the same jumps and the same transversality as `r_0`, while
`<r_c,u>` assumes every real value.  This is a logical statement about the
jump data, not a modification of the actual source residual.  It shows
that the complete split-Chebyshev profile and the Green response in (5.3),
not merely its threshold atoms, must enter any proof.

Equivalently, on a subinterval where the prime action is of bounded
variation, let `U(x)=integral_(-a)^x u(s)ds`.  Integration by parts makes
the atomic part of (5.3)

\[
 -\sum_n J_n U(x_n),                                   \tag{5.5}
\]

along with boundary and continuous-profile terms.  The odd folded
resolvent is not inverse-positive, so neither the signs of `U(x_n)` nor
the signs of those remaining terms are frozen.

## 6. Exact remaining source obligation

The pole row gives

\[
 \beta_\lambda=2^{-5/4}\log\lambda+O(1),
 \qquad M_\lambda\sim{\lambda\over2}.                 \tag{6.1}
\]

It therefore fixes a positive, polynomial-scale total mass for
`nu_(p,w)`.  Theorem 3.1 shows that total mass, both complete diagonal
measures, cyclicity, simple spectrum, pole-load derivatives, a polynomial
gap, and a bounded denominator still permit exact cancellation.

An actual proof must use (4.7)--(4.8), or an equivalent source identity,
to establish a bound such as

\[
 |F_\lambda(\mu_\lambda)|
 \geq e^{-o(\lambda^2)}
 \quad\hbox{and}\quad
 m_\lambda'(\mu_\lambda)\leq e^{o(\lambda^2)},        \tag{6.2}
\]

or directly prove the quotient lower bound in (0.4).  Sufficient stronger
inputs would include a one-phase theorem for `nu_(p,w)`, a signed Green-row
comparison between (4.7) and (4.6), or a source commutator identity with a
controlled remainder.  None is currently available.

The countermodels do not alter the source matrix and do not prove that the
actual mixed row cancels.  They prove only the exact nonimplication from
the declared diagonal/load/pole-row data.  In particular, this note proves
no bottom overlap, no source angle, no parity sign, no determinant theorem,
no zero theorem, and no Riemann hypothesis.  The formal state remains
`P0_INVALIDATED`.
