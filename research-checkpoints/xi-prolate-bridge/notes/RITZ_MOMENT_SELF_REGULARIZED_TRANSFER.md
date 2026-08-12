# Ritz-moment self-regularization at the lower variational shift

## 0. Scope and exact outcome

This note repairs a specific scope gap in
`SECANT_BULK_POSITIVE_DETERMINANT_RESPONSE.md`.  An arbitrary lower shift
`U<q` does not inherit the coefficient-one Rayleigh residual ridge.  The
mandatory two-vector Ritz shift carries one additional moment inequality,
however, and that inequality gives a finite residual-ridged transfer with an
explicit multiplier.

Let

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad {\mathbb C}\kappa\oplus{\cal K},
 \qquad r=\|b\|>0,
 \qquad w={b\over r}.                                  \tag{0.1}
\]

Let `u` be the lower Ritz value of the compression to
`span{kappa,w}`.  Take a real shift

\[
 u\leq U\leq q,
 \qquad d=q-U,
 \qquad B=A-UI\succ0.                                  \tag{0.2}
\]

The choice `U=u` is the exact mandatory shift.  A rigorously rounded upper
enclosure of `u` is also allowed, provided it still satisfies `U<=q` and
the shifted signs are proved with that same `U`.

If `mu` is the even ground value, put

\[
 h=U-\mu\geq0,
 \qquad z=(B+hI)^{-1}b.                                \tag{0.3}
\]

The coefficient-normalized ground line is `kappa-z`.  The first main result
is the exact Ritz moment inequality

\[
 \boxed{d\langle w,Bw\rangle\leq r^2.}                \tag{0.4}
\]

Together with the Feshbach equation, (0.4) gives a sharp generic norm bound

\[
 \boxed{\|z\|^2\leq C_{\rm R}(d/r)^2}                 \tag{0.5}
\]

and the residual-ridged Loewner estimate

\[
 \boxed{
 zz^*\preceq A_{\rm R}(d/r)\,r(B+rI)^{-1}.}          \tag{0.6}
\]

Here the explicit safe multiplier is

\[
 \boxed{
 A_{\rm R}(x)=
 \begin{cases}
  1+x+\tfrac12x(1+x)^2,&0\leq x\leq1,\\
  1+x+2x^2,&x\geq1.
 \end{cases}}                                         \tag{0.7}
\]

At the Rayleigh endpoint `d=0`, `C_R(0)^2=A_R(0)=1`, so (0.6) is exactly
the coefficient-one theorem in
`RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md`.  If `d/r->0`, then
`A_R(d/r)->1`.  A branch-free, outward-rounding-friendly bound is

\[
 \boxed{A_{\rm R}(x)\leq(1+x)(1+2x).}                \tag{0.8}
\]

For every positive observation `K`, (0.6) implies

\[
 \boxed{
 \langle z,Kz\rangle
 \leq A_{\rm R}(d/r)\,r
       \operatorname {tr}\{(B+rI)^{-1}K\}.}         \tag{0.9}
\]

Thus the positive finite determinant increment from checkpoint 0.66 is a
valid Ritz-ground observable after the factor `A_R(d/r)` is retained.  It is
not merely algebra on an unrelated ridge.  For the fixed-window transform
route, a sufficient response rate is

\[
 \boxed{
 A_{\rm R}(d/r)^{3/2}L^{3/2}{\cal F}_\theta
 \longrightarrow0.}                                  \tag{0.10}
\]

Here `L=2 log(lambda)` and `F_theta` is the complete positive increment in
(6.5) below.  When `A_R` is bounded, (0.10) reduces to the existing
`F_theta=o(L^(-3/2))` target.  If `A_R` grows, its factor cannot be
suppressed.

This is a localized observable transfer.  It does not by itself make
`||z||` tend to zero and therefore does not prove equation (5.2) of
`DIRECT_RH_ATTACK.md`.  Taking `K=I` in (0.9) gives a valid but stronger full
`L2` sufficient condition; no current source estimate proves it.  The two
shifted sector signs and the arithmetic determinant-response decay on an
unbounded schedule remain open.

For every actual-source specialization, the centered interval is
`[-L/2,L/2]`, the measure is Lebesgue measure, functions are extended by
zero, inversion is reflection, and

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.     \tag{0.11}
\]

The complete pole, archimedean, and minus-prime blocks are combined before
an inverse, determinant, or absolute value is formed.  Every prime power
`1<n<=lambda^2` is included.  The projected state comes from the locked
source normalization, not a unit normalization of `h_lambda`.  No zeta-zero
table and no global Weil positivity are used.  The finite theorems below do
not establish an asymptotic source estimate, locally uniform determinant
convergence, or the Riemann hypothesis.  The formal project state remains
`P0_INVALIDATED`.

## 1. Ritz moment forced by the mandatory shift

Write

\[
 a=\langle w,Aw\rangle,
 \qquad m=\langle w,Bw\rangle=a-U.                   \tag{1.1}
\]

The compression of `Q_+` to `span{kappa,w}` is

\[
 R=\begin{pmatrix}q&r\\r&a\end{pmatrix}.             \tag{1.2}
\]

Let its eigenvalues be `u<=v`.  Its characteristic polynomial in determinant
normalization is

\[
 p(s)=(q-s)(a-s)-r^2=(s-u)(s-v).                    \tag{1.3}
\]

### Lemma 1.1 (Ritz secant moment)

Under (0.2), equation (0.4) holds.

**Proof.**  Because `r>0`, the upper Ritz value satisfies `v>q`.  Hence
`u<=U<=q<v`, so `p(U)<=0`.  But

\[
 p(U)=(q-U)(a-U)-r^2=dm-r^2.                        \tag{1.4}
\]

This proves `dm<=r^2`.  Positivity of `B` separately gives `m>0`.
\(\square\)

The premise `U>=u` is essential.  Knowing only that `U` is some variational
upper bound for the true ground does not imply (0.4).  The exact mandatory
Ritz value and a certified upward rounding of that value do imply it.

When `U=u`, equation (1.4) is an equality:

\[
 d\langle w,Bw\rangle=r^2.                           \tag{1.5}
\]

## 2. Ground displacement and its automatic ridge

Assume additionally that the odd shifted block satisfies

\[
 Q_- -UI\succ0.                                      \tag{2.1}
\]

Then the ordinary interlacing argument makes the global ground simple and
even.  Its value `mu` is no larger than `u`, hence no larger than `U`.
Eliminating the complementary coordinate from the ground equation gives

\[
 \boxed{
 d+h=\langle b,(B+hI)^{-1}b\rangle.}                \tag{2.2}
\]

The odd sign is needed to identify the global ground; the algebraic
identities for the even block use only `B>0`.

### Lemma 2.1 (automatic displacement ridge)

Put

\[
 \rho(d,r)={\sqrt{d^2+4r^2}-d\over2}.               \tag{2.3}
\]

Then

\[
 \boxed{0\leq h\leq\rho(d,r)\leq r.}                \tag{2.4}
\]

**Proof.**  For `h>0`, positivity of `B` and (2.2) give

\[
 d+h\leq{r^2\over h},
 \qquad h(d+h)\leq r^2.                             \tag{2.5}
\]

Solving the quadratic inequality gives the first upper bound.  The second
follows from `rho(d,r)<=rho(0,r)=r`.  The case `h=0` is immediate.
\(\square\)

The scalar `rho` is optimal if only `d` and `r` are retained: in dimension
one, take `B=epsilon I` and let `epsilon` decrease to zero.

## 3. Sharp generic norm bound

For `d>0`, define

\[
 \alpha={r^2\over d^2}.                              \tag{3.1}
\]

Set

\[
 \boxed{
 C_{\rm R}^2=
 \begin{cases}
  1+2/\alpha,
     &0<\alpha\leq\tfrac12,\\[2mm]
  1+\displaystyle
    {4(2\sqrt{1+6\alpha}-1)
     \over3(\sqrt{1+6\alpha}-1)^2},
     &\alpha\geq\tfrac12.
 \end{cases}}                                       \tag{3.2}
\]

The two branches both equal `5` at `alpha=1/2`.  Define `C_R^2=1` when
`d=0`.

### Theorem 3.1 (sharp Ritz-moment norm bound)

Under (0.1)--(0.3), (0.5) holds.  The constant (3.2) is the sharp supremum
over finite complex Hermitian systems satisfying only the displayed
hypotheses.

**Proof.**  The case `d=0` is the Rayleigh fixed-point argument: metric
Cauchy--Schwarz and (2.2) give `||z||^2<=1`.  Suppose `d>0`.

Decompose `K=Cw direct-sum F` and write

\[
 B=\begin{pmatrix}m&c^*\\c&C\end{pmatrix},
 \qquad z=xw+y.                                      \tag{3.3}
\]

Put `S=d+h`.  Equations (2.2) and `(B+hI)z=rw` give

\[
 x={S\over r},
 \qquad y=-(C+hI)^{-1}cx.                            \tag{3.4}
\]

The Schur equation is

\[
 s:=\langle c,(C+hI)^{-1}c\rangle=m-a_0,
 \qquad a_0={r^2\over S}-h>0.                       \tag{3.5}
\]

The strict positivity in (3.5) follows from `hS<r^2` when `h>0`.  If
`c=0`, then `y=0` and the desired estimate is immediate.  Otherwise set

\[
 t=\langle c,C^{-1}c\rangle,
 \qquad
 v=\langle c,(C+hI)^{-2}c\rangle.                   \tag{3.6}
\]

Schur positivity of `B` gives `t<m`.  Complex Cauchy--Schwarz, applied to
`C^(-1/2)c` and `C^(1/2)(C+hI)^(-1)c`, gives

\[
 s^2\leq t(s-hv).                                    \tag{3.7}
\]

Consequently

\[
 hv\leq{s(t-s)\over t}
      <{s(m-s)\over m}
      ={a_0(m-a_0)\over m}.                         \tag{3.8}
\]

Lemma 1.1 gives `m<=M:=r^2/d`.  The last expression in (3.8) is increasing
in `m`, so

\[
 \|y\|^2=x^2v
 \leq{(r^2-hS)(r^2+dS)\over r^4}.                   \tag{3.9}
\]

Combining (3.4) and (3.9) yields

\[
 \boxed{
 \|z\|^2\leq
 F(h):=1+{2d(d+h)\over r^2}
          -{dh(d+h)^2\over r^4}.}                  \tag{3.10}
\]

When `h=0`, (2.2) says
`<w,B^(-1)w>=d/r^2=1/M`.  Jensen and
`<w,Bw>=m<=M` force equality, so `w` is a `B` eigenvector and
`||z||^2=d^2/r^2`; this is below (3.2).

For `h>0`, put `t_0=h/d`.  The feasibility condition in (2.5) is

\[
 0<t_0<T,
 \qquad T(1+T)=\alpha.                              \tag{3.11}
\]

Equation (3.10) becomes

\[
 F=1+{2(1+t_0)\over\alpha}
       -{t_0(1+t_0)^2\over\alpha^2},               \tag{3.12}
\]

with

\[
 F'={2\alpha-(1+t_0)(1+3t_0)\over\alpha^2},
 \qquad F''<0.                                      \tag{3.13}
\]

If `alpha<=1/2`, the supremum is the limit at `t_0=0`, namely
`1+2/alpha`.  If `alpha>1/2`, the unique interior maximizer is

\[
 t_0^*={\sqrt{1+6\alpha}-2\over3}.                  \tag{3.14}
\]

Substitution gives the second branch of (3.2).  This proves (0.5).

For sharpness, fix `d,r>0` and any `h` strictly between zero and `rho`.
Take `U=0`, `q=d`, and put

\[
 M={r^2\over d},
 \quad S=d+h,
 \quad a_0={r^2\over S}-h,
 \quad s=M-a_0.                                     \tag{3.15}
\]

For `s<tau<M`, define

\[
 C_0={hs\over\tau-s},
 \qquad c=(\tau C_0)^{1/2},
 \qquad
 B_\tau=\begin{pmatrix}M&c\\c&C_0\end{pmatrix}.   \tag{3.16}
\]

Then `B_tau>0`.  With `b=(r,0)^T`, the full even matrix at shift zero is

\[
 Q_+=\begin{pmatrix}
 d&r&0\\
 r&M&c\\
 0&c&C_0
 \end{pmatrix}.                                     \tag{3.17}
\]

Its two-vector compression has determinant zero, so its lower Ritz value is
exactly `u=U=0`.  Also

\[
 {c^2\over C_0+h}=s,                                \tag{3.18}
\]

which makes the global even ground value `-h`.  As `tau` increases to `M`,
the norm of its coefficient-normalized correction tends to `F(h)`.  Choosing
the maximizing `h`, or taking `h` down to zero in the boundary branch,
approaches (3.2).  The construction is an abstract Hermitian sharpness
family, not a pinned Weil or source-Cauchy family. \(\square\)

## 4. Residual-ridged Loewner transfer

### Theorem 4.1 (Ritz self-regularization)

For every `sigma>=h`, the least scalar `c_sigma` for which

\[
 zz^*\preceq c_\sigma(B+\sigma I)^{-1}              \tag{4.1}
\]

is

\[
 \boxed{
 c_\sigma=\langle z,(B+\sigma I)z\rangle
 =d+h+(\sigma-h)\|z\|^2.}                          \tag{4.2}
\]

Consequently

\[
 \boxed{
 zz^*\preceq
 \{d+\sigma C_{\rm R}^2\}(B+\sigma I)^{-1}.}       \tag{4.3}
\]

Taking `sigma=r` gives the valid, but slightly larger, multiplier
`d/r+C_R^2`.

**Proof.**  Congruence by `(B+sigma I)^(1/2)` shows that the least coefficient
in (4.1) is `||(B+sigma I)^(1/2)z||^2`.  Since
`(B+hI)z=b` and `<z,b>=d+h`, this is (4.2).  Theorem 3.1 and
`C_R^2>=1` give

\[
 c_\sigma
 \leq d+h+(\sigma-h)C_{\rm R}^2
 \leq d+\sigma C_{\rm R}^2.                         \tag{4.4}
\]

Lemma 2.1 permits `sigma=r`. \(\square\)

### Corollary 4.2 (smaller joint Ritz multiplier)

The piecewise multiplier (0.7) proves (0.6).

**Proof.**  Put

\[
 \delta={d\over r},
 \qquad \eta={h\over r}\in[0,1].                    \tag{4.5}
\]

Equation (4.2) at `sigma=r` is

\[
 {c_r\over r}=\delta+\eta+(1-\eta)\|z\|^2.          \tag{4.6}
\]

Dropping the final nonpositive term in (3.10) gives

\[
 \|z\|^2\leq1+2\delta(\delta+\eta).                 \tag{4.7}
\]

Therefore

\[
 {c_r\over r}
 \leq1+\delta+2\delta(1-\eta)(\delta+\eta).         \tag{4.8}
\]

For `0<=delta<=1`, the quadratic factor on the right is at most
`(1+delta)^2/4`; for `delta>=1`, it is at most `delta`.  These are exactly
the two branches in (0.7). \(\square\)

The norm theorem also gives the useful branch-free estimate

\[
 C_{\rm R}^2
 \leq1+2{d\over r}+2{d^2\over r^2}.                 \tag{4.9}
\]

Thus, if interval arithmetic proves `0<=d<=d_U` and `r>=r_L>0`, the safely
rounded choice

\[
 X={d_U\over r_L},
 \qquad A_{\rm cert}=(1+X)(1+2X)                    \tag{4.10}
\]

is valid without evaluating the piecewise sharp formula.

## 5. The optimal unrestricted displacement envelope

The Ritz moment is what makes the single residual ridge possible.  There is
also an exact envelope which uses only the Feshbach equation and a certified
`sigma>=h`, with no Ritz moment.

Metric Cauchy--Schwarz gives

\[
 zz^*\preceq(d+h)(B+hI)^{-1}.                       \tag{5.1}
\]

For a scalar `x>0`,

\[
 {d\over dh}{d+h\over x+h}={x-d\over(x+h)^2}.       \tag{5.2}
\]

Hence the least spectral envelope uniform over `0<=h<=sigma` is

\[
 \boxed{
 F_{\rm opt}(B)
 =(d+\sigma)(B+\sigma I)^{-1}
 +\sigma(dI-B)_+B^{-1}(B+\sigma I)^{-1}.}           \tag{5.3}
\]

Equivalently, use the disjoint partition `1_(0,d)(B)` and
`1_[d,infinity)(B)`: the scalar branches are `d/x` below `d` and
`(d+sigma)/(x+sigma)` at and above `d`.  Writing both indicators with a
closed endpoint would double-count the eigenspace `B=d`.

The low-band correction in (5.3) cannot be absorbed universally into the
ridged first term.  The clean source-separable bound is

\[
 \boxed{
 F_{\rm opt}(B)
 \preceq dB^{-1}+\sigma(B+\sigma I)^{-1}.}           \tag{5.4}
\]

For the mandatory Ritz shift, Theorem 4.1 is stronger in the sense relevant
to checkpoint 0.66: it returns to the single source-compatible ridge `r` at
the cost of the scalar factor `A_R(d/r)`.

## 6. Positive determinant response

Let `0<=K<=I` be a finite positive observation and put

\[
 S_r=r(B+rI)^{-1},
 \qquad
 {\cal H}=\operatorname {tr}(S_rK).                 \tag{6.1}
\]

For any fixed `theta>0`, define

\[
 X=r(B+rI)^{-1/2}K(B+rI)^{-1/2},
 \qquad0\preceq X\preceq I,                         \tag{6.2}
\]

\[
 \boxed{
 {\cal F}_\theta
 =\log{\det(B+rI+\theta rK)\over\det(B+rI)}
 =\operatorname {tr}\log(I+\theta X).}             \tag{6.3}
\]

The scalar chord bounds on `log(1+theta*x)` give

\[
 \boxed{
 {{\cal F}_\theta\over\theta}
 \leq{\cal H}
 \leq{{\cal F}_\theta\over\log(1+\theta)}.}       \tag{6.4}
\]

Combining (0.9) and (6.4) proves the finite Ritz-ground determinant gate

\[
 \boxed{
 \langle z,Kz\rangle
 \leq {A_{\rm R}(d/r)\over\log(1+\theta)}
       {\cal F}_\theta.}                             \tag{6.5}
\]

For the exact time-band matrix `K_T`, the source-Cauchy identity is preserved
by `Q+sK_T`.  At the spectral point `U-r`, the source parity and Schur
factorizations give the combined response already derived in checkpoint
0.66:

\[
 {\cal F}_\theta
 =\log{\det O_{\theta r}\over\det O_0}
 -\log{m_{\theta r}\sigma_{\theta r}
        \over m_0\sigma_0}.                         \tag{6.6}
\]

The full determinant response in (6.6) must be kept combined.  Bounding the
odd, boundary, and anchor factors separately loses the observed source
cancellation.  Positivity of `B` gives the even factors; positivity of the
odd logarithms still requires the independent odd shifted sign.

Let

\[
 F_r(t)=\langle g_t,S_rg_t\rangle,
 \qquad
 {\cal H}_T=\operatorname {tr}(S_rK_T).             \tag{6.7}
\]

The evaluation-vector tent estimate from
`RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md` is

\[
 \sup_{|t|\leq T}F_r(t)
 \leq\{16\pi C_L{\cal H}_T\}^{2/3}
       +{8\pi\over T}{\cal H}_T,
 \qquad C_L={L^{3/2}\over\sqrt {12}}.               \tag{6.8}
\]

Equations (0.6) and (6.8) give

\[
 \sup_{|t|\leq T}|\widehat z(t)|^2
 \leq A_{\rm R}(d/r)
 \left[
   \{16\pi C_L{\cal H}_T\}^{2/3}
   +{8\pi\over T}{\cal H}_T
 \right].                                           \tag{6.9}
\]

Therefore (0.10) is sufficient.  For a full `L2` route one may take `K=I`
in (0.9).  A direct sufficient replacement for the ground part of equation
(5.2) is

\[
 \sqrt{\log\lambda}\,\lambda^\eta
 \{A_{\rm R}(d/r)r\operatorname {tr}(B+rI)^{-1}\}^{1/2}
 \longrightarrow0
 \quad(\eta<1/2),                                    \tag{6.10}
\]

together with the already proved projection contribution.  Equation (6.10)
is not established by the fixed-window checkpoint and is not presently
proved on an arithmetic schedule.

For the source-scaled correction `a z`, the right side of (6.9) is multiplied
by `a^2`; the corresponding sufficient tent rate contains `a^3`.  The locked
projected-state theorem makes `a` bounded, so (0.10) is unchanged on the
declared source schedule.  Without that separate normalization theorem the
factor may not be omitted.

## 7. Mandatory regressions and structural obstructions

### 7.1 Coefficient one remains false

Take

\[
 Q_+=\begin{pmatrix}1&2\\2&1\end{pmatrix},
 \qquad\kappa=e_1,
 \qquad U=u=-1.                                      \tag{7.1}
\]

Then `d=r=B=2`, `h=0`, and `z=1`.  The coefficient-one substitution would
give

\[
 |z|^2\leq {r\over B+r}={1\over2},                  \tag{7.2}
\]

which is false.  The multiplier in Theorem 4.1 is not optional.

### 7.2 The Ritz premise is indispensable

Fix `d,r>0` and `0<c_0<d`.  For small `epsilon>0`, put

\[
 B=\operatorname {diag}\left(
 \epsilon,{r^2-c_0\epsilon\over d-c_0}\right),
 \qquad
 b=\begin{pmatrix}
 \sqrt{c_0\epsilon}\\
 \sqrt{(d-c_0)B_{22}}
 \end{pmatrix}.                                     \tag{7.3}
\]

Then `||b||=r` and

\[
 \langle b,B^{-1}b\rangle=d.                        \tag{7.4}
\]

Thus `h=0` is a valid Feshbach root for an arbitrary ground upper shift, but
the first component of `z=B^(-1)b` has squared magnitude `c_0/epsilon`.
No finite ridge multiplier depending only on `d,r` survives as `epsilon`
decreases to zero.  This family violates (0.4), equivalently `U>=u`, and
therefore does not contradict Theorem 4.1.

### 7.3 Scalar decay does not close the bridge

Choose a sequence `x_j=d_j/r_j->0`, for example `r_j=x_j` and
`d_j=x_j^2`, and take the sharp family (3.15)--(3.17) at the interior
maximizer.  Then

\[
 q_j,r_j,d_j\longrightarrow0,
 \qquad A_{\rm R}(d_j/r_j)\longrightarrow1,
 \qquad \|z_j\|^2\longrightarrow1.                 \tag{7.5}
\]

An independent positive odd block makes both finite sector signs strict.
Hence decay of the scalar shift and residual, even with `A_R->1`, does not
make the ground correction small.  The source-oriented soft trace or its
combined determinant response is the indispensable remaining estimate.

## 8. Honest frontier

This note changes one logical classification: checkpoint 0.66's Ritz
finite-increment trace is a valid localized ground-transfer observable after
the explicit factor `A_R(d/r)`.  It does not change the project terminal
state.
The remaining direct analytic work is to prove, on one deterministic
unbounded source schedule,

1. the even-complement and odd-sector shifted signs at a certified
   `U in [u,q]`;
2. an analytic bound on `d/r`, or else retain its exact growing factor;
3. the combined source determinant-response decay in (0.10), or the stronger
   full-`L2` response (6.10);
4. the already declared normalization and projection conditions needed for
   the Xi limit.

Finite pilot agreement, a small value of `A_R` at `lambda=2,N=4`, or real-axis
eigenvalue agreement is not an asymptotic theorem.
