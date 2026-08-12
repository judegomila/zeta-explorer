# Natural outer-shell large sieve and inverse-spread barrier

## 0. Exact outcome and claim boundary

On the natural odd-halfgrid schedule

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad M_p={p+1\over2},\qquad N_p=M_p+1={p+3\over2},                 \tag{0.1}
\]

this note proves an unconditional mean-square estimate for every fixed or
polylogarithmic prefix of the **actual outer even source column**.  If
`Pi_R` denotes the even projection onto modes `0,...,R`, then, uniformly for
integers `1<=R<=P/4`,

\[
 \boxed{
 {1\over|{\cal C}_P|}\sum_{p\in{\cal C}_P}
       \|\Pi_Rh_p\|^2
 \ll { (R+1)(\log P)^6\over P}
       +{R^3(\log P)^2\over P^2},}
 \qquad
 {\cal C}_P=\{p:P<p\leq2P,\ p\ \mathrm {odd}\}.             \tag{0.2}
\]

Thus a polylogarithmic raw prefix has the desired `P^(-1)` scale, up to a
fixed logarithmic loss.  The proof keeps the inclusive prime-power
inventory, the source minus sign through the combined discrepancy, and the
ordinary Chebyshev error before taking an absolute value.  Its only new
external theorem is the classical Montgomery--Vaughan mean-value theorem
for Dirichlet polynomials, stated precisely in Section 4.

The estimate (0.2) is **pre-inverse** and unweighted.  On the active simple
outer-shell branch, an exact Schur calculation below converts the
checkpoint-1.57 weighted-projector target into

\[
 \sum_{p\in{\cal G}_P}\chi_p
   \|\overline P_pR_ph_p\|^2
 \ll { (\log P)^B\over P}
 \sum_{p\in{\cal G}_P}\chi_p|s_p|^2.                 \tag{0.3}
\]

Here `R_p` is the adaptive low-block resolvent, `overline P_p` removes the
prolate direction, and `chi_p|s_p|^2=|a_p|^2` is exactly the canonical
visibility weight.  A normalized inverse-spread estimate which upgrades
(0.2) to (0.3) is isolated in Section 7; it is not proved.

An exact positive all-dimensional source-Cauchy family in Section 8 has
arbitrarily small fixed prefixes of its outer column, a simple visible even
ground, a strict even complement, and bounded Ritz ratio, while its
projective alignment tends to one.  This synthetic family is not the
actual pole--archimedean--minus-prime matrix.  It proves only that raw
prefix decay cannot replace the adaptive inverse-spread theorem.

No finite-good actual index, actual visibility, inverse-spread bound,
determinant limit, zeta-zero theorem, Riemann hypothesis, converse, or
de Bruijn--Newman bound is proved.  The standard eight are unchanged and
the formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs and external source

Exactly three repository theorem/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` | `ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450` |
| `tests/test_natural_cutoff_signed_ground_alignment.py` | `3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb` |
| `notes/NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md` | `d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf` |
| `tests/test_natural_crossroot_weighted_projector_average_target.py` | `36a70f9de303fe49ac60dfd1285542486615f696dfd66566fe73158eeba9a390` |
| `notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md` | `39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329` |
| `tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py` | `4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3` |

The first pair supplies the exact combined Chebyshev-error formula.  The
second supplies the weighted target and its `N=M+1` Gram identity.  The
third supplies the explicit actual bound

\[
 |\beta_{p,n}|\leq B_b(\lambda_p)\ll\lambda_pL_p       \tag{1.1}
\]

for every retained source-Cauchy coefficient.

The sole non-elementary external analytic-number-theory theorem is the
Montgomery--Vaughan mean-value theorem, derived from their weighted
Hilbert inequality:

> H. L. Montgomery and R. C. Vaughan, "Hilbert's Inequality",
> *Journal of the London Mathematical Society* (2) **8** (1974), 73--82,
> <https://doi.org/10.1112/jlms/s2-8.1.73>.

The elementary Chebyshev bound `psi(x)<<x` is also used and is not reproved
here.  Section 4 states the exact corollary required here and derives both
the separated-value and varying-endpoint forms, so no maximal large-sieve
theorem is hidden.

## 2. Universal Chebyshev error and the exact source coefficient

Put

\[
 G(t)=e^t-\psi_C(e^t)-{1\over2}\log(1-e^{-2t}),\qquad t>0,             \tag{2.1}
\]

where `psi_C(x)=sum_(m<=x) Lambda(m)` is right-continuous.  This is one
universal function; the parameter `p` only truncates it at `L_p`.  Define

\[
 \tau(t)={e^{-5t/2}\over1-e^{-2t}},\qquad
 F_{\rm align}(t)=D_{\lambda_p}(t)-\int_t^\infty\tau(u)\,du.           \tag{2.2}
\]

The exact combined-source identity is

\[
 dF_{\rm align}(t)=-e^{-t/2}\,dG(t)
 =\sum_{1<m\leq\lambda_p^2}{\Lambda(m)\over\sqrt m}
       \delta_{\log m}(dt)
   +\{\tau(t)-e^{t/2}\}\,dt.                         \tag{2.3}
\]

Let `beta_(p,n)` denote the actual source-Cauchy displacement coefficient
at mode `n`, so that raw entries satisfy

\[
 Q_{nm}={\beta_{p,n}-\beta_{p,m}\over n-m}\quad(n\ne m),
 \qquad \beta_{p,-n}=-\beta_{p,n}.                    \tag{2.4}
\]

For `omega_(p,n)=2*pi*n/L_p`, the source lock gives

\[
 \beta_{p,n}={1\over\pi}\int_{(0,L_p]}
       \sin(\omega_{p,n}t)\,dF_{\rm align}(t).         \tag{2.5}
\]

Since `omega_(p,n)L_p=2*pi*n`, the upper endpoint in Stieltjes integration
by parts vanishes.  For `0<t<log 2`, equation (2.1) gives
`G(t)=O(1+|log t|)`, while
`e^(-t/2)sin(omega_(p,n)t)=O(t)`, so the lower endpoint also vanishes.
Consequently

\[
 \boxed{
 \beta_{p,n}={1\over\pi}\int_0^{L_p}G(t)\,
 d\{e^{-t/2}\sin(\omega_{p,n}t)\}.}                  \tag{2.6}
\]

Equivalently, with every prime power retained,

\[
 \boxed{
 \begin{aligned}
 \beta_{p,n}={1\over\pi}\{&
 \sum_{1<m\leq\lambda_p^2}{\Lambda(m)\over\sqrt m}
       \sin(\omega_{p,n}\log m)\\
 &+\int_0^{L_p}\{\tau(t)-e^{t/2}\}
       \sin(\omega_{p,n}t)\,dt\}.
 \end{aligned}}                                      \tag{2.7}
\]

The inclusive endpoint convention is unchanged.  On the odd-halfgrid,
`lambda_p^2=p^2/4` is not an integer, so equality cannot occur; even without
that observation, the endpoint sine in (2.5) is zero.

## 3. The actual one-dimensional outer even column

Use the orthonormal even basis

\[
 e_0=V_0,\qquad e_n={V_n+V_{-n}\over\sqrt2}\quad(n\geq1).             \tag{3.1}
\]

Write the even source at `N=N_p` as

\[
 A_p=\begin{pmatrix}C_p&h_p\\h_p^*&\alpha_p\end{pmatrix}
 \quad\hbox{on}\quad H_{M_p,+}\oplus\mathbb C e_{N_p}.              \tag{3.2}
\]

Direct substitution in (2.4) gives the exact outer column

\[
 \boxed{(h_p)_0={\sqrt2\,\beta_{p,N_p}\over N_p},}                  \tag{3.3}
\]

\[
 \boxed{(h_p)_n=
 {2\{N_p\beta_{p,N_p}-n\beta_{p,n}\}\over N_p^2-n^2}}
 \qquad(1\leq n\leq M_p).                           \tag{3.4}
\]

Equations (2.6), (3.3), and (3.4) express `h_p` as one vector-valued
linear statistic of the common `G`.  The low block `C_p`, its bottom root,
and its inverse remain functions of the same complete source.

## 4. Montgomery--Vaughan input and maximal partial sums

We use the following standard mean-value form.  If

\[
 D(t)=\sum_{m\leq X}c_m m^{it},                       \tag{4.1}
\]

and `I` is any real interval of length `T`, then

\[
 \boxed{
 \int_I|D(t)|^2dt\ll(T+X)\sum_{m\leq X}|c_m|^2.}     \tag{4.2}
\]

The implied constant is absolute and the estimate is uniform under
translation of `I`.  This is the precise Montgomery--Vaughan input.

If `(t_j)` is one-separated in an interval of length `T`, apply (4.2) to
`D` and to

\[
 D'(t)=i\sum_{m\leq X}c_m(\log m)m^{it}.             \tag{4.3}
\]

Choose `u_j` in the unit interval centered at `t_j` at which `|D(u_j)|^2`
does not exceed its local integral.  The fundamental theorem of calculus
and Cauchy--Schwarz give

\[
 |D(t_j)|^2\leq\int_{I_j}|D|^2
 +2\left(\int_{I_j}|D|^2\int_{I_j}|D'|^2\right)^{1/2}.               \tag{4.4}
\]

The intervals have disjoint interiors.  Summing (4.4), using (4.2), and
using `log m<=log X` proves

\[
 \boxed{
 \sum_j|D(t_j)|^2
 \ll(T+X)\log(2X)\sum_{m\leq X}|c_m|^2.}             \tag{4.5}
\]

Now allow an independently chosen endpoint `1<=y_j<=X`.  Complete `X` to
a power of two.  Every interval `[1,y_j]` is the disjoint union of at most
`K=ceil(log_2 X)+1` aligned binary intervals, at most one from each level.
Cauchy--Schwarz costs `K`.  Dropping the endpoint-dependent selection and
summing (4.5) over the `K` tree levels costs a second `K`; at each level
the coefficient supports are disjoint.  Hence

\[
 \boxed{
 \sum_j\left|\sum_{m\leq y_j}c_mm^{it_j}\right|^2
 \ll(T+X)\{\log(2X)\}^3
       \sum_{m\leq X}|c_m|^2.}                       \tag{4.6}
\]

Thus the varying prime-power endpoint costs exactly two safe logarithms
beyond (4.5).

## 5. Outer-frequency separation and the prime mean

At the outer mode,

\[
 \Omega(p):=\omega_{p,N_p}
 ={\pi(p+3)\over2\log(p/2)}.                         \tag{5.1}
\]

If `ell=log(p/2)`, then

\[
 \Omega'(p)={\pi\over2}{\ell-1-3/p\over\ell^2}.      \tag{5.2}
\]

For all sufficiently large `P` and `P<p<=2P`,

\[
 {\pi\over4\log P}\leq\Omega'(p)
 \leq {C\over\log P}.                               \tag{5.3}
\]

Consecutive odd indices are therefore separated by at least
`pi/(2 log P)`, and all the `Omega(p)` lie in an interval of length
`O(P/log P)`.  Partition the odd indices into `J=O(log P)` classes, each
one-separated.

In (4.6), take

\[
 X=P^2,\qquad y_p=\lambda_p^2,qquad
 c_m={\Lambda(m)\over\sqrt m}.                       \tag{5.4}
\]

Chebyshev's `psi(x)<<x` and partial summation give

\[
 \sum_{m\leq X}{\Lambda(m)\over m}\ll\log X,
 \qquad
 \sum_{m\leq X}{\Lambda(m)^2\over m}\ll(\log X)^2. \tag{5.5}
\]

Apply (4.6) on each of the `J` classes and take imaginary parts.  Because
`X` dominates the frequency-interval length, this proves

\[
 \sum_{p\in{\cal C}_P}\left|
 \sum_{m\leq\lambda_p^2}{\Lambda(m)\over\sqrt m}
       \sin(\Omega(p)\log m)\right|^2
 \ll P^2(\log P)^6.                                 \tag{5.6}
\]

The six safe logarithms are: one in (4.5), two from binary maximality, one
from the separation partition, and two from (5.5).

For the continuous part of (2.7), direct integration gives

\[
 \int_0^{L_p}e^{t/2}\sin(\Omega(p)t)\,dt
 ={\Omega(p)(1-\lambda_p)\over\Omega(p)^2+1/4}
 =O(L_p).                                             \tag{5.7}
\]

Also `tau(t)<<t^(-1)` on `(0,1]` and
`tau(t)<<e^(-5t/2)` on `[1,infinity)`.  Splitting at `1/Omega(p)` gives

\[
 \int_0^{L_p}\tau(t)\sin(\Omega(p)t)\,dt
 =O\{1+\log\Omega(p)\}=O(L_p).                       \tag{5.8}
\]

Combining (2.7), (5.6)--(5.8), and `|C_P|=O(P)` yields

\[
 \boxed{
 \sum_{p\in{\cal C}_P}|\beta_{p,N_p}|^2
 \ll P^2(\log P)^6.}                                \tag{5.9}
\]

## 6. Proof of the unconditional prefix theorem

Take `1<=R<=P/4`.  Since `N_p asymp P`, this ensures `R<=N_p/2` throughout
the dyadic block.  Equations (3.3)--(3.4) and (1.1) give, uniformly for
`1<=n<=R`,

\[
 |(h_p)_n|\ll { |\beta_{p,N_p}|\over P}
                 +{n\log P\over P}.                  \tag{6.1}
\]

The same first term bounds `(h_p)_0`.  Squaring, summing the prefix, and
using `sum_(n<=R)n^2<<R^3` gives

\[
 \|\Pi_Rh_p\|^2
 \ll { (R+1)|\beta_{p,N_p}|^2\over P^2}
       +{R^3(\log P)^2\over P^2}.                    \tag{6.2}
\]

Average (6.2), use (5.9), and use `|C_P| asymp P`.  This proves (0.2).
No gate or spectral datum has entered.

## 7. Exact one-shell identities and the missing inverse-spread mean

Assume for one `p` on the active simple branch that

\[
 \mu_p=\lambda_{\min}(A_p)                           \tag{7.0}
\]

and that

\[
 \mu_p<\lambda_{\min}(C_p),\qquad
 R_p=(C_p-\mu_pI)^{-1},\qquad r_p=R_ph_p.             \tag{7.1}
\]

Then `R_p>0`,

\[
 v_p=(r_p,-1),\qquad
 (A_p-\mu_pI)v_p=0,\qquad
 \alpha_p-\mu_p=h_p^*R_ph_p,                         \tag{7.2}
\]

and the lowest line is simple with unit vector
`g_p=v_p/(1+||r_p||^2)^(1/2)`.

Put

\[
 \bar\kappa_p=P_{M_p}\kappa_p,\quad
 c_p=\langle e_{N_p},\kappa_p\rangle,\quad
 k_p=\|\bar\kappa_p\|^2,
 \quad \bar\eta_p=P_{M_p}\eta_p,                    \tag{7.3}
\]

Assume `k_p>0`, as is mandatory before the normalized Gram quotient, and
put

\[
 \overline P_p=I-{|\bar\kappa_p\rangle
                        \langle\bar\kappa_p|\over k_p},             \tag{7.4}
\]

\[
 s_p=\langle\kappa_p,v_p\rangle
 =\langle\bar\kappa_p,r_p\rangle-\overline {c_p},
 \qquad
 t_p=\langle v_p,\eta_p\rangle
 =\langle r_p,\bar\eta_p\rangle-\sqrt2,             \tag{7.5}
\]

\[
 \chi_p={|t_p|^2\over(1+\|r_p\|^2)^2}.              \tag{7.6}
\]

The conjugate on `c_p` in (7.5) follows from
`c_p=<e_(N_p),kappa_p>` and the convention that the first inner-product
slot is conjugate linear.  Since

\[
 {\cal L}_p=\operatorname {span}\{e_{N_p},\kappa_p\}^{\perp}
 =\{(y,0):\langle\bar\kappa_p,y\rangle=0\},           \tag{7.7}
\]

one has `P_(L_p)v_p=(overline P_p r_p,0)`.  Moreover

\[
 P_p\eta_p={v_p\langle v_p,\eta_p\rangle
                   \over1+\|r_p\|^2}.                \tag{7.8}
\]

Substitution in the checkpoint-1.57 Gram identity gives, with no omitted
normalization,

\[
 \boxed{{\Delta_p\over k_p}
       =\chi_p\|\overline P_pr_p\|^2,\qquad
       |a_p|^2=\chi_p|s_p|^2.}                        \tag{7.9}
\]

Let `G_P` be any finite-good subset on this active branch, and put

\[
 H_{P,R}=\sum_{p\in{\cal C}_P}\|\Pi_Rh_p\|^2,
 \qquad
 W_P=\sum_{p\in{\cal G}_P}\chi_p|s_p|^2.             \tag{7.10}
\]

When `H_(P,R)W_P>0`, define the dimensionless gate-weighted inverse-spread
mean

\[
 \boxed{
 {\cal I}_{P,R}:=
 {|{\cal C}_P|\over W_PH_{P,R}}
 \sum_{p\in{\cal G}_P}\chi_p
       \|\overline P_pR_ph_p\|^2.}                   \tag{7.11}
\]

The exact new input is the polylogarithmic estimate

\[
 \boxed{{\cal I}_{P,R}\ll(\log P)^D}                \tag{7.12}
\]

for some fixed `D` and some `R=(log P)^A`.  Indeed, (0.2), (7.11), and
(7.12) imply (0.3) with `B=A+D+6` after enlarging `B` to absorb the second
term of (0.2).

Estimate (7.12) is not a classical large sieve.  The resolvent `R_p`, the
root `mu_p`, the gate, `chi_p`, and `s_p` all depend on the same complete
source as `h_p`.  It must also control the response to
`(I-Pi_R)h_p`; thus it includes high-to-low inverse spread, not merely low
leverage.  If `mu_p=lambda_min(C_p)`, (7.1) fails and the multiplicity-safe
cofactor form must be retained.

## 8. Exact positive source-Cauchy no-go family

This section is purely structural.  Fix an integer `N>=4` and use the raw
basis `V_(-N),...,V_N`.  Set

\[
 \beta_0=0,\qquad \beta_n=0\ (1\leq n<N),\qquad
 \beta_N=1,\qquad \beta_{-n}=-\beta_n,              \tag{8.1}
\]

\[
 d_0=1,\qquad d_1=N^{-2},\qquad d_n=1\ (2\leq n<N),\tag{8.2}
\]

\[
 h_0={\sqrt2\over N},\qquad
 h_n={2N\over N^2-n^2}\quad(1\leq n<N),\qquad
 \alpha=\sum_{n=0}^{N-1}{h_n^2\over d_n}.          \tag{8.3}
\]

Choose the raw diagonal

\[
 a_0=1,\qquad a_{\pm1}=N^{-2},\qquad
 a_{\pm n}=1\ (2\leq n<N),\qquad
 a_{\pm N}=\alpha-{1\over N},                     \tag{8.4}
\]

and, off the diagonal, put

\[
 Q_{nm}={\beta_n-\beta_m\over n-m}.                \tag{8.5}
\]

Thus (8.5) is an exact real inversion-symmetric source-Cauchy matrix.
Its diagonal is deliberately free and is not the actual arithmetic
diagonal.

### 8.1 Exact parity blocks and positivity

In the even basis `e_0,e_1,...,e_N`, direct substitution in (8.5) gives

\[
 Q_+=\begin{pmatrix}C&h\\h^T&\alpha\end{pmatrix},
 \qquad C=\operatorname {diag}(d_0,\ldots,d_{N-1}). \tag{8.6}
\]

The Schur complement is exactly

\[
 \alpha-h^TC^{-1}h=0.                              \tag{8.7}
\]

Hence `Q_+>=0`, its kernel is the simple line generated by

\[
 v=(r,-1),\qquad r=C^{-1}h,\qquad
 \mu=0<\lambda_{\min}(C)=N^{-2}.                  \tag{8.8}
\]

In the odd basis `e_n^-=(V_n-V_(-n))/sqrt(2)`, `1<=n<=N`, one has

\[
 Q_-=\begin{pmatrix}D&g\\g^T&\alpha-2/N\end{pmatrix},
 \quad D=\operatorname {diag}(d_1,\ldots,d_{N-1}),
 \quad g_n={2n\over N^2-n^2}.                     \tag{8.9}
\]

Its Schur complement is

\[
 \begin{aligned}
 S_-&=\alpha-{2\over N}-g^TD^{-1}g\\
 &= {2\over N^2}+
    \sum_{n=1}^{N-1}{4\over (N^2-n^2)d_n}-{2\over N}.
 \end{aligned}                                     \tag{8.10}
\]

The `n=1` summand is `4N^2/(N^2-1)>4`; all other summands are
nonnegative.  Thus `S_->4-2/N>0`.  Therefore `Q_->0`, the full raw matrix
is positive semidefinite, and its unique global ground line is the even
line in (8.8).  This checks the odd Schur complement rather than inferring
full positivity from the even block alone.

### 8.2 Small prefixes and amplified response

For every integer `0<=R<=N/2`, (8.3) gives the exact elementary bound

\[
 \boxed{
 \|\Pi_Rh\|^2={2\over N^2}
 +\sum_{n=1}^R{4N^2\over(N^2-n^2)^2}
 \leq {2+(64/9)R\over N^2}
 \leq {8(R+1)\over N^2}.}                         \tag{8.11}
\]

On the other hand,

\[
 r_0={\sqrt2\over N},\qquad
 r_1={2N^3\over N^2-1}=2N+O(N^{-1}),\qquad
 r_n=h_n\quad(2\leq n<N).                         \tag{8.12}
\]

Since `h_n<=2/(N-n)`, one has

\[
 \sum_{n=2}^{N-1}h_n^2\leq{2\pi^2\over3},
 \qquad \sum_{n=2}^{N-1}h_n=O(\log N).            \tag{8.13}
\]

Take the unit low anchor and the canonical finite-section source to be

\[
 \bar\kappa=q={e_0+e_1\over\sqrt2},\qquad c=0,
 \qquad
 \bar\eta=e_0+\sqrt2\sum_{n=1}^{N-1}e_n,
 \qquad \langle e_N,\eta\rangle=\sqrt2.           \tag{8.14}
\]

Thus `k=1`, `overline P=P_(q^perp)`, and, with
`D_v=1+||r||^2`, the exact variables in Section 7 are

\[
 s={r_0+r_1\over\sqrt2},\qquad
 t=r_0+\sqrt2\sum_{n=1}^{N-1}r_n-\sqrt2,
 \qquad \chi={t^2\over D_v^2}.                    \tag{8.15}
\]

Equations (8.12)--(8.13) imply

\[
 {t\over r_1}\longrightarrow\sqrt2,\qquad
 {D_v\over r_1^2}\longrightarrow1,\qquad
 {s^2\over r_1^2}\longrightarrow{1\over2},
 \qquad
 {\|P_{q^\perp}r\|^2\over r_1^2}\longrightarrow{1\over2}.       \tag{8.16}
\]

The exact one-shell identities (7.9) therefore give

\[
 \boxed{
 {\Delta\over k}\longrightarrow1,qquad
 |a|^2\longrightarrow1,qquad
 {\Delta/k\over|a|^2}
 ={\|P_{q^\perp}r\|^2\over s^2}\longrightarrow1.}               \tag{8.17}
\]

Visibility is genuine, not produced by a vanishing normalization:

\[
 {D_v\over s^2}\longrightarrow2,qquad
 \|P_E\eta\|^2={t^2\over D_v}\longrightarrow2,qquad
 a={ts\over D_v}\longrightarrow1.                \tag{8.18}
\]

### 8.3 A uniform finite gate and bounded Ritz ratio

Factor `Q_+=T^*T`, where

\[
 T=[C^{1/2},C^{-1/2}h],\qquad w=C^{-1/2}h.          \tag{8.19}
\]

The nonzero eigenvalues of `Q_+` are those of `C+ww^T`.  Here
`w_1=Nh_1=2N^2/(N^2-1)>=2` and `||w_(1^perp)||<3`.  If a unit vector has
coordinates `(x_1,x_(1^perp))`, then either
`||x_(1^perp)||>=|x_1|/4`, which gives the `C`-energy at least `1/17`, or

\[
 |w^Tx|\geq2|x_1|-3\|x_{1^\perp}\|>{5\over4}|x_1|,
 \qquad |x_1|^2>{16\over17}.                       \tag{8.20}
\]

Consequently

\[
 Q_+\geq {1\over17}P_{g^\perp},qquad
 g={v\over\sqrt {D_v}}.                           \tag{8.21}
\]

Moreover, (8.12)--(8.13) give `D_v<=r_1^2+8`, so

\[
 |\langle q,g\rangle|^2={s^2\over D_v}
 \geq {r_1^2\over2(r_1^2+8)}>{1\over3}\quad(N\geq4).              \tag{8.22}
\]

It follows that the compression of `Q_+` to `q^perp` has floor at least
`1/51`.

For completeness, let `u` be the lower Ritz value on
`span{q,Q_+q}`.  Put `delta=N^(-2)` and `H=h_0+h_1`.  Its Rayleigh datum
and residual are exactly

\[
 q_0=\langle q,Q_+q\rangle={1+\delta\over2},
 \qquad
 \rho^2=\|(Q_+-q_0I)q\|^2
 ={(1-\delta)^2+2H^2\over4}.                       \tag{8.23}
\]

The trial vector

\[
 y=q-Q_+q={(1-\delta)e_1-He_N\over\sqrt2}          \tag{8.24}
\]

belongs to that Ritz plane and satisfies

\[
 \|y\|^2={(1-\delta)^2+H^2\over2},                \tag{8.25}
\]

\[
 y^TQ_+y={1\over2}\{
 \delta(1-\delta)^2-2(1-\delta)Hh_1+\alpha H^2\}. \tag{8.26}
\]

For `N>=4`, `h_1<=(32/15)N^(-1)`, `H<(18/5)N^(-1)`,
`alpha<12`, and `||y||^2>225/512`.  Positivity and (8.26) therefore give

\[
 0\leq u\leq {y^TQ_+y\over\|y\|^2}<{196\over N^2}.               \tag{8.27}
\]

Also `q_0<=17/32` and `rho>15/32`, whence

\[
 0<{q_0-u\over\rho}<{17\over15}<2                \tag{8.28}
\]

once the strict gate holds.  For `N>=101`, (8.27) gives `u<1/51`; together
with (8.22), the compressed shifted operator on `q^perp` is strictly
positive.  Thus the full finite gate, a bounded lower-Ritz ratio, and
uniform visibility coexist with (8.17).

Adding an arbitrary scalar multiple of the identity shifts `mu`, `q_0`,
`u`, and every sector eigenvalue together.  It leaves `C-mu I`, `R`, `h`,
`r`, (8.17), the shifted gate, and the Ritz ratio unchanged.  A common
diagonal lower bound therefore does not repair this family.

### 8.4 Dyadic failure and source scope

Place this model at every odd `p` with `N=(p+3)/2`.  For every fixed or
polylogarithmic `R<=N/2`, (8.11) gives

\[
 \sum_{p\in{\cal C}_P}\|\Pi_Rh_p\|^2=O(R/P),       \tag{8.29}
\]

whereas (8.17) gives

\[
 \sum_{p\in{\cal C}_P}{\Delta_p\over k_p}\asymp P,
 \qquad
 \sum_{p\in{\cal C}_P}|a_p|^2\asymp P.            \tag{8.30}
\]

For every fixed `B`, the right side of the desired weighted target is only
`O((log P)^B)`, while its left side is comparable to `P`.  Thus even a
prefix bound stronger than (0.2) does not imply (0.3).

Only (8.1) and (8.5) are source-Cauchy structural data; (8.4) is a chosen
positive completion.  Nothing in this section asserts that these
coefficients arise from the universal `G`, from the inclusive prime-power
formula (2.7), or from the actual arithmetic diagonal.  Likewise
`kappa=(q,0)` in (8.14) is a synthetic anchor, not the natural prolate
vector.  The counterfamily is an exact algebraic no-go for a prefix-only
inference, not a counterexample to the actual-arithmetic target.

## 9. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. identifies the synthetic family in Section 8 with the actual source;
2. omits the continuous term or the inclusive prime-power inventory in
   (2.7);
3. treats `p` as prime rather than as an odd integer index;
4. removes any of the six safe logarithms in (5.6) without a replacement
   proof;
5. substitutes the unweighted pre-inverse mean (0.2) for (7.12);
6. divides by `W_P` when visibility has not been proved positive;
7. applies the ordinary inverse in (7.1) at a low-block collision;
8. drops `chi_p`, the conjugate in `s_p`, or either normalization factor in
   (7.9);
9. infers a finite-good actual index, determinant convergence, a zeta-zero
   theorem, RH, a converse, or a de Bruijn--Newman bound.

The proved actual-arithmetic content is exactly (0.2).  The missing
source-specific content is (7.12), together with gate and visibility
nonvacuity.  The formal state remains `P0_INVALIDATED`.
