# The predecessor alignment is a symmetric orbit-pair derivative

## Scope and outcome

Let `q=q_N` be a complete-theta same-parity Galerkin residual,
`r=q_(N-1)`, and

\[
 U=\operatorname {span}\{q',hq\},\qquad
 p=(I-P_U)r'
 \tag{1}
\]

in `L^2(psi^2 dh)`. The prior-derivative repair is paid by

\[
 \mathcal A_N=\int_{\mathbb R}v(h)q(h)p(h)\psi(h)^2\,dh,
 \qquad v=-{\psi'\over\psi}.
 \tag{2}
\]

This note gives an exact complete-orbit representation of (2), including
every diagonal and cross-orbit pair. It also identifies a sharp obstruction
to using the known monotone-likelihood-ratio order of the Jacobi orbits:
that order controls the **antisymmetric** score difference, whereas (2)
contains only the **symmetric** pair score. The antisymmetric contribution
cancels identically before integration.

For every orbit pair the symmetric score is a total derivative. Hence the
alignment is exactly

\[
 \boxed{
 \mathcal A_N
 =\sum_{n,m\geq1}\int_0^\infty (qp)'(h)\phi_n(h)\phi_m(h)\,dh.}
 \tag{3}
\]

The old-space condition forces `qp` and `(qp)'` to change sign on the
positive half-line. Thus (3) is not a hidden sum of positive orbit blocks.
Moreover, remote orbit pairs are governed by the first nonzero center jet of
`(qp)'`, not by score ordering. A successful all-degree theorem must
therefore control the assembled signed pair sum in (3), or construct a
genuinely orbit-dependent lift of the predecessor before symmetrization.

This is an analytic route reduction. It does not prove the all-degree prior
inequality, a first Xi--Laguerre sign, or RH.

## 1. Complete theta orbit law

On `h>=0`, put

\[
 z_n=\pi n^2e^{2h},\qquad
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},\qquad
 \psi=\sum_{n\geq1}\phi_n.
 \tag{4}
\]

Every `phi_n` is positive there. Its logarithmic score is

\[
 \sigma_n={\phi_n'\over\phi_n}
 ={3\over2}-d_n+{6\over d_n},
 \qquad d_n=2z_n-3.
 \tag{5}
\]

If `P_h(n)=phi_n(h)/psi(h)`, then

\[
 \mu(h)=\mathbb E_h\sigma={\psi'\over\psi}=-v(h).
 \tag{6}
\]

The exact Jacobi order is

\[
 \sigma_1(h)>\sigma_2(h)>\cdots,
 \tag{7}
\]

because `partial sigma/partial d=-1-6/d^2<0`. This is the available
source-specific monotone-likelihood-ratio input.

The polynomials `q` and `r` have the same parity, so `p` has the parity
opposite to `q`. Therefore

\[
 F:=qp\text{ is odd},\qquad F(0)=0.
 \tag{8}
\]

The projection also gives

\[
 \int_{\mathbb R}q'p\,\psi^2=0,
 \qquad
 \int_{\mathbb R}hqp\,\psi^2=0.
 \tag{9}
\]

In particular, for every real `lambda`,

\[
 \int_{\mathbb R}(v-\lambda h)qp\,\psi^2=\mathcal A_N.
 \tag{10}
\]

No new signed target moment is used in (1), (9), or (10).

## 2. Exact complete orbit-pair identity

By parity, (2) is twice its positive-half-line integral. Equations (4)--(6)
give

\[
 \begin{aligned}
 \mathcal A_N
 &=-2\sum_{n,m\geq1}\int_0^\infty
       F\,\sigma_n\phi_n\phi_m\,dh\\
 &=-\sum_{n,m\geq1}\int_0^\infty
       F(\sigma_n+\sigma_m)\phi_n\phi_m\,dh.
 \end{aligned}
 \tag{11}
\]

More generally, (10) has the exact pair form

\[
 \mathcal A_N=-\sum_{n,m\geq1}\int_0^\infty
 F(\sigma_n+\sigma_m+2\lambda h)\phi_n\phi_m\,dh.
 \tag{11a}
\]

The `lambda` term vanishes only after the complete double sum, through the
second orthogonality in (9); it does not vanish orbit pair by orbit pair.

The second line is the required complete symmetrization; it must not be
replaced by a finite positive-orbit packet. Since

\[
 (\phi_n\phi_m)'=(\sigma_n+\sigma_m)\phi_n\phi_m,
 \tag{12}
\]

integration by parts pair by pair yields

\[
 -\int_0^\infty F(\sigma_n+\sigma_m)\phi_n\phi_m\,dh
 =\int_0^\infty F'\phi_n\phi_m\,dh.                       \tag{13}
\]

There is no boundary term: (8) kills the endpoint `h=0`, and the
double-exponential orbit tail kills `h=infinity`. Summing (13) proves (3).
It also recovers the division-free score identity without a quotient:

\[
 \begin{aligned}
 \mathcal A_N
 &=\int_0^\infty (qp)'\psi^2\,dh\\
 &={1\over2}\int_{\mathbb R}(q'p+qp')\psi^2\,dh
 ={1\over2}\int_{\mathbb R}qp'\psi^2\,dh,
 \end{aligned}
 \tag{14}
\]

where the last equality is (9).

All interchanges are absolute. Indeed,

\[
 \sum_{n,m}\int_0^\infty |F'|\phi_n\phi_m
 =\int_0^\infty |F'|\psi^2<\infty,                       \tag{15}
\]

and the score side is dominated by
`2 |F| psi sum_n |sigma_n| phi_n`, which is integrable because the orbit
weights have Gaussian decay in `n` and double-exponential decay in `h`.

## 3. Why orbit-score ordering does not pay (3)

At a fixed `h`, the predecessor factor `F(h)` is independent of the orbit
index. Hence its conditional score covariance is identically zero:

\[
 \operatorname {Cov}_h(F,\sigma)=0.                       \tag{16}
\]

Equivalently, the entire antisymmetric score-gap contribution vanishes
pointwise:

\[
 \boxed{
 \sum_{n,m\geq1}F(h)(\sigma_n-\sigma_m)
       \phi_n(h)\phi_m(h)=0.}                             \tag{17}
\]

The pair formula for covariance shows the same obstruction. If the orbit
observable is `G_n(h)=F(h)`, then

\[
 {1\over2}\sum_{n,m}P_h(n)P_h(m)
 (G_n-G_m)(\sigma_n-\sigma_m)=0.                          \tag{18}
\]

Thus the strict ordering (7), which signs products containing
`sigma_n-sigma_m`, has no nonzero quantity on which to act. The alignment
uses `sigma_n+sigma_m` in (11), and (12)--(13) turn that symmetric score into
the signed derivative `F'`. This is not a loss caused by Cauchy--Schwarz; it
is an exact cancellation at the level of the complete orbit law.

A viable correlation theorem must therefore first replace the orbit-blind
factor `F(h)` by an orbit-dependent lift `G_n(h)` whose expectation restores
`F` while retaining the covariance with `sigma`. Proving positivity for a
finite orbit packet is not such a lift, because it breaks the complete
cross-orbit assembly in (11).

## 4. The old signed metric has the opposite pair geometry

The orbit expansion of the old Galerkin density makes the mismatch more
explicit. Put

\[
 \Lambda=\psi'^2-\psi\psi''=v'\psi^2.
 \tag{19}
\]

Expanding both derivatives before summing gives the exact complete-pair
identity

\[
 \boxed{
 \Lambda(h)=\sum_{n,m\geq1}\kappa_{nm}(h)
                   \phi_n(h)\phi_m(h),\qquad
 \kappa_{nm}=-{1\over2}
 \{(\sigma_n-\sigma_m)^2+\sigma_n'+\sigma_m'\}.}
 \tag{20}
\]

This is the place where the antisymmetric score gap actually survives. Its
sign is a **cost**, not a free covariance payment. In terms of `d_n`,

\[
 \begin{aligned}
 \kappa_{nm}
 &=(d_n+3)\left(1+{6\over d_n^2}\right)
  +(d_m+3)\left(1+{6\over d_m^2}\right)\\
 &\quad-{(d_n-d_m)^2\over2}
       \left(1+{6\over d_nd_m}\right)^2.
 \end{aligned}
 \tag{21}
\]

The pair sign pattern is exact on the whole positive half-line:

\[
 \boxed{\kappa_{nn}>0,\qquad \kappa_{nm}<0\quad(n\ne m).}
 \tag{22}
\]

For the diagonal, (21) gives
`kappa_nn=2(d_n+3)(1+6/d_n^2)>0`. For `m>n`, write
`x=e^(2h)>=1`. Since every `d_n>3`, the two positive terms in (21) are less
than `(5/3)(d_n+d_m+6)`. The squared factor in the last term is greater
than one, so

\[
 \kappa_{nm}
 <2\pi x\left\{{5\over3}(n^2+m^2)
       -\pi x(m^2-n^2)^2\right\}<0.                      \tag{23}
\]

The last sign uses
`(m^2-n^2)^2>m^2+n^2` and `pi*x>3>5/3`.

The double series in (20), and the series after multiplication by any fixed
polynomial `qs`, are absolutely integrable on the positive half-line. The
scores and their derivatives grow only polynomially in `z_n+z_m`, whereas
`phi_n phi_m` contains `exp(-pi(n^2+m^2)e^(2h))`. Thus the sum is
Gaussian-summable at `h=0` and double-exponentially dominated as `h` tends
to infinity.

Together with the audited complete-theta curvature `v'(h)>17`, (20)--(22)
give the pointwise diagonal-versus-cross compensation

\[
 \boxed{
 \sum_n\kappa_{nn}\phi_n^2
 -2\sum_{n<m}|\kappa_{nm}|\phi_n\phi_m
 =v'\psi^2>17\psi^2.}                                   \tag{23a}
\]

This is a genuine all-orbit inequality. It does not by itself survive
multiplication by a signed Galerkin product, which is precisely why the
predecessor correlation remains necessary.

The curvature input is proved directly in
`evidence/v18-curated/source_2122_audit/relative_modular_bridge_bounds.tex`
(SHA-256
`956c7554ddd52023ed7f1657ca75013cf2e21517c209d0dc63df6d56153d2073`).
Its exact rational constant checks are recorded in
`evidence/v18-curated/source_2122_audit/bridge_gram_exact_checks.json`
(SHA-256
`a947615f5ac2051b13f7de57247379ce2fadbbe572b327473a65bd285744395a`).
`MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md` supplies the later campaign audit
and normalization cross-check.

Consequently all old Galerkin equations retain a diagonal-minus-cross-orbit
assembly. For every admissible old same-parity polynomial `s`,

\[
 0=\int_{\mathbb R}qs\,\Lambda\,dh
 =2\sum_{n,m\geq1}\int_0^\infty
       qs\,\kappa_{nm}\phi_n\phi_m\,dh.                  \tag{24}
\]

Thus `q` and its predecessor are selected by the signed pair kernel (20),
whereas their drift alignment is evaluated with the all-positive pair
kernel in (3). This is a source-specific, noncircular comparison problem.
Dropping the off-diagonal terms in (24) changes the old residuals; taking
absolute values in (3) changes the alignment.

## 5. The old-space constraint forces a signed pair integrand

The polynomial `p` is nonzero. Indeed, `r'` has degree `kappa-3`, whereas
the two generators in `U` have distinct degrees `kappa-1` and `kappa+1`;
no nontrivial combination of them equals `r'`.

Since `hF psi^2` is even, the second identity in (9) becomes

\[
 \int_0^\infty hF(h)\psi(h)^2\,dh=0.                     \tag{25}
\]

The weight is strictly positive and `F` is not the zero polynomial, so `F`
must take both signs on `(0,infinity)`. Since `F(0)=0`, the mean-value
theorem then implies that `F'` also takes both signs there. Consequently
every pair integrand in (3) has the same signed polynomial factor `F'`; no
termwise positivity follows from `phi_n phi_m>0`.

This sign change is forced by the noncircular old feature `hq` itself. It
cannot be removed by choosing the free linear drift in (10).

## 6. Remote pairs see the modular-center jet, not the orbit order

There is also a useful endpoint asymptotic. Let `j>=0` be minimal such that

\[
 F'(h)=c h^{2j}+O(h^{2j+2})\quad(h\longrightarrow0),
 \qquad c\ne0.                                           \tag{26}
\]

Such a `j` exists because `F'` is a nonzero even polynomial. Set

\[
 S_{nm}=\pi(n^2+m^2),\qquad
 K_{nm}=\int_0^\infty F'(h)\phi_n(h)\phi_m(h)\,dh.
 \tag{27}
\]

Then, as `S_nm` tends to infinity through arbitrary orbit pairs,

\[
 \boxed{
 K_{nm}
 ={c(2j)!\over(2S_{nm})^{2j+1}}
   \phi_n(0)\phi_m(0)\{1+o(1)\}.}                       \tag{28}
\]

To see this, put `h=u/(2S_nm)`. Formula (5) gives, uniformly for bounded
`u`,

\[
 {\phi_n(u/(2S_{nm}))\phi_m(u/(2S_{nm}))
  \over\phi_n(0)\phi_m(0)}\longrightarrow e^{-u}.        \tag{29}
\]

Moreover each `sigma_n` decreases with `h`; for sufficiently large
`S_nm`, the pair score at zero is at most `-S_nm`. This supplies an
integrable exponential majorant after the rescaling. Dominated convergence
and (26) then give (28), since
`integral_0^infinity u^(2j)e^(-u)du=(2j)!`.

In particular, all sufficiently remote diagonal and cross pairs have the
sign of the first nonzero center jet `c`. Their sign is not the
anti-association sign coming from (7). They are exponentially small in
`S_nm`, so (28) does not sign the complete sum; the finite orbit head may
still reinforce or cancel them. It does rule out a proof which assigns the
remote payment solely from score-gap ordering.

Modular evenness supplies a separate complete center cancellation:

\[
 \sum_{n,m\geq1}(\sigma_n(0)+\sigma_m(0))
       \phi_n(0)\phi_m(0)=(\psi^2)'(0)=0.                \tag{29a}
\]

No nonempty finite orbit packet has this identity automatically. Thus an
orbit-dependent lift must preserve the modularly complete center sum as
well as the off-diagonal old-metric terms in (20).

## 7. Exact surviving all-degree lemma

Let

\[
 \Sigma_N=\int_{\mathbb R}p(h)^2\psi(h)^2\,dh,
 \qquad
 \mathcal H_U=\mathcal H_{\operatorname {span}\{q',hq\}}.
 \tag{30}
\]

The prior feature gives exactly

\[
 \mathcal H_{V_N^{\rm prior}}
 =\mathcal H_U+{\mathcal A_N^2\over\Sigma_N}.             \tag{31}
\]

Therefore the only open rungs are those with `H_U<0`, and on them the
complete-theta theorem-shaped obligation can be written without any score
quotient as

\[
 \boxed{
 \left[
   \sum_{n,m\geq1}\int_0^\infty
      (q_Np_N)'\phi_n\phi_m\,dh
 \right]^2
 \geq-\mathcal H_U
       \int_{\mathbb R}p_N^2\psi^2\,dh.}                 \tag{32}
\]

The weak inequality in (32) is exactly the condition
`H_(V_N^prior)>=0`. If the intended auxiliary conclusion is strict
positivity, the inequality in (32) must likewise be strict; no other term or
normalization changes because `Sigma_N>0`.

Here `q_N`, `q_(N-1)`, and `p_N` are fixed entirely by old signed data and
positive Gram data. Equation (32) retains every cross-orbit term before
squaring. Separate orbit absolute values, a diagonal-only estimate, or the
conditional score order (7) does not imply it.

The productive next target is therefore narrower than a generic drift
bound: construct an orbit-dependent predecessor lift with a nonzero signed
score covariance whose complete expectation equals the unsquared bracket in
(32), or prove (32) directly from a seam-free modular/Ewald grouping. The
raw Jacobi score ordering by itself is exactly orthogonal to the needed
channel.
