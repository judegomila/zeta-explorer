# Gevrey prolate remainder and exponential projection audit

## 1. Scope and conclusion

This note asks whether the fixed-order construction in
`notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` can be truncated at an
order which grows with `lambda`.  The answer is yes, at a qualitative
asymptotic level.

The Hermite recursion admits a Gevrey-one bound; a Gevrey-two estimate would
be a needlessly weak description.  One power of the Hermite index is removed
by the reduced harmonic-oscillator resolvent.  In fact a unique raising path
gives a factorial lower bound, so one is the minimal Gevrey order and the
least-term scale is `M=Theta(lambda^2)`.

There are constants `delta,c,C>0` such that, with

\[
 \epsilon=\lambda^{-2},\qquad
 M=\lfloor\delta\lambda^2\rfloor,
\]

the source-normalized, zero-extended prolate combination has a finite
Hermite approximation `H_(lambda,M)` satisfying

\[
 \|h_\lambda-H_{\lambda,M}\|_2
 \leq C\exp(-c\lambda^2).                         \tag{1.1}
\]

The constants and starting threshold are not effective, because the exact
prolate branch identification and the pinned concentration asymptotic have
noncomputed thresholds.  The coefficient majorants themselves are
effective in principle.

The arithmetic transform costs only the elementary factor `lambda`.  A
separate analytic-strip estimate controls the log-Fourier projection of the
growing Hermite polynomial.  Two polynomial diagonals result.  With
`L=2 log(lambda)`:

\[
\begin{array}{c|c|c}
N(\lambda)&\hbox{formal truncation used}&e_{\lambda,N}\\ \hline
\lceil\lambda L^3\rceil&J=\lfloor\delta_1\lambda L\rfloor
 &O(\exp(-c_1\lambda L^2)),\\[2mm]
\lceil D\lambda^2L^2\rceil&M=\lfloor\delta\lambda^2\rfloor
 &O(\exp(-c_2\lambda^2)).
\end{array}                                             \tag{1.2}
\]

Here `D` is a sufficiently large fixed constant.  The admitted compact-BV
sampler preserves these exponential classes, as does the fixed-index
physical-outer defect.  Thus the corresponding positive sampling shift is
exponentially small in the same sense.

This is still an absolute upper bound.  It does not lower-bound the growing
odd sector, prove the relative comparison between the Rayleigh value and
that sector, prove either shifted sector sign, control the shifted solve, or
establish determinant convergence.  The formal project state remains
`P0_INVALIDATED`.

## 2. The reduced Hermite operator loses one index power

Retain the locked convention and notation

\[
 A_\epsilon=H+\epsilon V,\qquad
 Hh_m=E_mh_m,\qquad E_m=2\pi(2m+1),
\]

\[
 Vh_m={\sqrt{m(m-1)(m-2)(m-3)}\over4}h_{m-4}
 -{2m^2+2m+3\over4}h_m
 +{\sqrt{(m+1)(m+2)(m+3)(m+4)}\over4}h_{m+4}.       \tag{2.1}
\]

Fix `n=0` or `n=4`, and let

\[
 R_n=(H-E_n)^{-1}(1-\Pi_n).
\]

If `f` is supported on the Hermite labels congruent to `n` modulo four and
not exceeding `n+4j`, the three nonzero rows in (2.1), followed by the
denominator

\[
 |E_m-E_n|=4\pi|m-n|,
\]

give, by the Schur test,

\[
 \|R_nVf\|_2\leq C_n(j+1)\|f\|_2,\qquad
 \|Vf\|_2\leq D_n(j+1)^2\|f\|_2.                    \tag{2.2}
\]

This can be made completely explicit.  Write the output label as
`m=n+4q`, omit `q=0`, and multiply an entry of `R_n V` by `pi`.  Each of
its at most three nonzero entries is at most

\[
 2(|q|+1).                                               \tag{2.2a}
\]

For `q>=1`, use `m<=4(q+1)`, `m+4<=4(q+2)`, and square the
off-diagonal inequalities; the sole possible negative value is
`(n,q)=(4,-1)` and is checked directly.  Row and column sums therefore give
the convenient uniform choice

\[
 \|R_nVf\|_2\leq{6(j+2)\over\pi}\|f\|_2.              \tag{2.2b}
\]

Likewise the three entries of `V` give, for example,
`||Vf||_2<=3(n+4j+8)^2||f||_2`.  Sharp constants are irrelevant below.

The first estimate is the important one.  Using only the uniform norm of
`R_n` would leave the quadratic factor and give a false Gevrey-two
majorant.  Division by the *output* gap removes one index power.  Rows near
the deleted target are finite in number and are absorbed into `C_n`.

For the raw recursion

\[
 w_{n,0}=h_n,\qquad
 \mu_{n,j}=\langle h_n,Vw_{n,j-1}\rangle,
\]

\[
 w_{n,j}=R_n\left(-Vw_{n,j-1}
       +\sum_{k=1}^j\mu_{n,k}w_{n,j-k}\right),          \tag{2.3}
\]

put `a_j=||w_(n,j)||_2`.  Symmetry of `V` is useful here:

\[
 |\mu_{n,j}|=|\langle Vh_n,w_{n,j-1}\rangle|
 \leq d_n a_{j-1},                                      \tag{2.4}
\]

where `d_n=||Vh_n||_2` is fixed.  Since the nonzero gaps in this residue
class are at least `16*pi`, (2.2)--(2.4) imply

\[
 a_j\leq C_nj a_{j-1}
   +C'_n\sum_{p+q=j-1}a_pa_q.                            \tag{2.5}
\]

The elementary convolution inequality

\[
 \sum_{p+q=r}p!q!\leq3r!                                \tag{2.6}
\]

now closes an induction.  For an explicit sufficiently large `B_n`,

\[
 \boxed{\|w_{n,j}\|_2\leq B_n^j j!,\qquad
 |\mu_{n,j}|\leq d_nB_n^{j-1}(j-1)!.}                  \tag{2.7}
\]

Formal multiplication, reciprocal, and composition by a scalar analytic
function preserve a `C B^j j!` majorant.  This follows from (2.6), first for
products and then recursively for a reciprocal with nonzero constant term.
Consequently the formally unit-normalized coefficients `v_(n,j)`, the
origin-value quotient coefficients, and the locked source coefficients
`g_j` all satisfy

\[
 \|v_{n,j}\|_2+|v_{n,j}(0)|+\|g_j\|_2
 \leq C B^j j!.                                        \tag{2.8}
\]

For the point value, use

\[
 {|h_{2k}(0)|\over h_0(0)}
 ={\sqrt{(2k)!}\over2^kk!}\leq1
\]

and Cauchy--Schwarz over the `O(j)` occupied labels; the extra polynomial
factor is absorbed by increasing `B`.

### 2.1 The factorial order is sharp

The coefficient of the highest label `h_(n+4j)` in `w_(n,j)` has only one
source.  Neither an eigenvalue-convolution term nor formal normalization
can reach that label.  Iterating the raising entry in (2.1) gives exactly

\[
 \boxed{
 c_{n,j}=(-1)^j{\sqrt{(n+4j)!/n!}\over(64\pi)^j j!}.}   \tag{2.9}
\]

In the source correction `g_j`, the still higher label `h_(4j+4)` occurs
with coefficient `a_4 c_(4,j)` and cannot cancel against the label-zero
branch.  Grouping the integers in blocks of four gives

\[
 {(n+4j)!\over n!}\geq(j!)^4,
\]

and hence

\[
 |c_{n,j}|\geq{j!\over(64\pi)^j}.                       \tag{2.10}
\]

Stirling's formula sharpens (2.9) to
`|c_(n,j)|=(4*pi)^(-j)j!` times a fixed power of `j` and an
`n`-dependent constant.  Thus the formal series has zero radius and is
genuinely Gevrey one.  Its least-term order is proportional to
`epsilon^(-1)=lambda^2`, not to `lambda`.

## 3. A growing-order quasimode

Let

\[
 \Phi_{n,M}=\sum_{j=0}^M\epsilon^jv_{n,j},\qquad
 \nu_{n,M}=E_n+\sum_{j=1}^M\epsilon^j\mu_{n,j},
\]

where scalar normalization of the eigenvector series leaves the eigenvalue
series unchanged.  Coefficient cancellation is algebraic and therefore
remains valid when `M` depends on `epsilon`.  Equations (2.2), (2.6), and
(2.8) give

\[
 \|(A_\epsilon-\nu_{n,M})\Phi_{n,M}\|_2
 \leq C(B\epsilon)^{M+1}(M+1)!                         \tag{3.1}
\]

whenever `2B*epsilon*M` is smaller than a fixed constant.  Here is the
coefficient bookkeeping.  After increasing `B`, (2.7)--(2.8) read

\[
 \|v_{n,j}\|_2\leq CB^jj!,\qquad
 |\mu_{n,j}|\leq CB^jj!.                               \tag{3.1a}
\]

All coefficients through degree `M` cancel.  Write the remaining defect as

\[
 (A_\epsilon-\nu_{n,M})\Phi_{n,M}
 =\sum_{\ell=M+1}^{2M}\epsilon^\ell
       {\cal R}_{\ell,M}.                              \tag{3.1b}
\]

For `ell>M+1`, `R_(ell,M)` consists only of terms
`mu_(n,k)*v_(n,ell-k)`.  Their norm is at most

\[
 C B^\ell\sum_{k=0}^\ell k!(\ell-k)!
 \leq C B^\ell\ell!.                                   \tag{3.1c}
\]

At `ell=M+1` there is in addition the final unresolvented term `V*v_(n,M)`.
The second estimate in (2.2) gives

\[
 \|Vv_{n,M}\|_2\leq C(M+1)^2B^MM!
 \leq C(2B)^{M+1}(M+1)!,                               \tag{3.1d}
\]

where `M+1<=2^(M+1)`; enlarge `B` once more.  Thus every coefficient in
(3.1b) is bounded by `C*B^ell*ell!`.  If
`B*epsilon*(2M+1)<=1/2`, successive scalar majorants satisfy

\[
 {(B\epsilon)^{\ell+1}(\ell+1)!
   \over(B\epsilon)^\ell\ell!}
 =B\epsilon(\ell+1)\leq\tfrac12.                       \tag{3.1e}
\]

Their sum is at most twice its first term, which proves (3.1).  This also
shows explicitly why the unresolvented `V` changes only the Gevrey constant,
not the Gevrey order.

The same check is needed for normalization.  The formal scalar multiplier
was chosen so that the complete formal coefficient of
`<Phi_n,Phi_n>` is one.  After truncation at `M`, only product coefficients
of degrees `M+1,...,2M` remain.  Equations (2.6) and (3.1a), with exactly
the ratio estimate (3.1e), give

\[
 \left|\|\Phi_{n,M}\|_2^2-1\right|
 \leq C(B\epsilon)^{M+1}(M+1)!.                         \tag{3.1f}
\]

Thus no algebraic scalar-normalization error remains at growing order.

Choose `delta>0` so small that

\[
 2B\delta<\tfrac12,
 \qquad 4\delta\log2<\pi/3.                             \tag{3.2}
\]

For `M=floor(delta/epsilon)`, factorial comparison in (3.1) gives

\[
 \|(A_\epsilon-\nu_{n,M})\Phi_{n,M}\|_2
 \leq C e^{-c/\epsilon},
 \qquad
 \|\Phi_{n,M}-h_n\|_2=O(\epsilon).                     \tag{3.3}
\]

The second inequality follows because the successive majorant terms are
geometrically decreasing from the first correction onward.

### 3.1 Moving endpoints

Every finite Hermite combination belongs, after restriction, to the natural
prolate domain: `(1-epsilon*x^2) Phi'(x)` vanishes at `x=+/-lambda`.
There is no boundary distribution in (3.1).

What is new at growing order is the need to control the part of the formal
combination beyond the moving endpoints.  The scaled Mehler identity is

\[
 \sum_{m\geq0}r^m|h_m(x)|^2
 ={\sqrt2\over\sqrt{1-r^2}}
  \exp\left(-2\pi{1-r\over1+r}x^2\right),
 \qquad0<r<1.                                           \tag{3.4}
\]

If `F` has Hermite support at most `K`, Cauchy--Schwarz in its coefficients
therefore gives

\[
 \|1_{|x|\geq\lambda}F\|_2^2
 \leq {\sqrt2\,r^{-K}\over\sqrt{1-r^2}}
 \int_{|x|\geq\lambda}
   \exp\left(-2\pi{1-r\over1+r}x^2\right)dx\,\|F\|_2^2.
                                                               \tag{3.5}
\]

Take `r=1/2`.  The support of `Phi_(n,M)` is at most
`K=n+4M`.  The second inequality in (3.2) leaves a fixed positive exponent
in (3.5), so its omitted endpoint tail is `O(exp(-c lambda^2))`.
The same argument applies after a fixed number of `x partial_x`
derivatives; those derivatives enlarge the support by only a fixed amount
and cost a polynomial in `K`.

The fixed-index prolate eigenvalues have a uniform isolating gap for all
sufficiently large `lambda`, by the form-convergence argument already given
in the all-order note.  Also `nu_(n,M)=E_n+O(epsilon)`.  The spectral theorem
applied to (3.3), followed by the source phase choice, gives

\[
 \left\|f_{n,\lambda}-\Phi_{n,M}\right\|_{L^2(-\lambda,\lambda)}
 \leq Ce^{-c\lambda^2}.                                 \tag{3.6}
\]

Uniform interior ellipticity on a fixed neighborhood of zero upgrades
(3.6) to the same point-value estimate.

### 3.2 Source ratio and concentration defect

For fixed `n=0,4`, the pinned concentration formula is

\[
 1-\chi_{n,\lambda}^2
 \sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2}.              \tag{3.7}
\]

Together with

\[
 \int_{-\lambda}^{\lambda}f_{n,\lambda}(x)dx
 =\chi_{n,\lambda}f_{n,\lambda}(0),                    \tag{3.8}
\]

equations (3.6)--(3.8) show that the integral quotient differs from its
truncated formal point-value quotient by `O(exp(-c lambda^2))`.  The
denominator stays separated from zero because its leading term is
`h_0(0)`.  The formal reciprocal itself introduces no larger error: after
truncation its numerator-minus-quotient-times-denominator coefficients again
start at degree `M+1`, and (3.1c)--(3.1e) give the same exponential bound.

Let

\[
 H_{\lambda,M}=\sum_{j=0}^M\lambda^{-2j}g_j.
\]

The locked coefficient `a_4`, rather than unit normalization of the
combination, is retained.  Combining (3.5)--(3.8) proves (1.1).

## 4. Nonoptimal truncation and arithmetic transfer

For any `J<=M`, the decreasing Gevrey majorant gives

\[
 \left\|H_{\lambda,M}-H_{\lambda,J}\right\|_2
 \leq C\left({B(J+1)\over\lambda^2}\right)^{J+1}.
                                                               \tag{4.1}
\]

For a source supported in `[0,lambda]`, the elementary arithmetic estimate
is

\[
 \|E(f)\|_{L^2([\lambda^{-1},\lambda],du/u)}
 \leq\lambda\|f\|_2.                                   \tag{4.2}
\]

The outside-source arithmetic sum has the following explicit bound.  Put

\[
 a_r=2\pi{1-r\over1+r},\qquad b_r=a_r/2,
\]

and let `F` have Hermite support at most `K`.  The pointwise form of (3.4)
is

\[
 |F(x)|\leq C_r r^{-K/2}e^{-b_rx^2}\|F\|_2.            \tag{4.2a}
\]

For `F_>(x)=1_(x>lambda)F(x)` and every `u>0`, monotonicity of the Gaussian
gives

\[
\begin{aligned}
 |E(F_>)(u)|
 &\leq C_r r^{-K/2}\|F\|_2u^{1/2}
   \sum_{m:\,mu>\lambda}e^{-b_r(mu)^2}\\
 &\leq C_r r^{-K/2}\|F\|_2u^{1/2}
 \left(e^{-b_r\lambda^2}
       +{1\over u}\int_\lambda^\infty e^{-b_rx^2}dx\right).
                                                               \tag{4.2b}
\end{aligned}
\]

The last integral is at most
`e^(-b_r*lambda^2)/(2*b_r*lambda)`.  Squaring (4.2b) and integrating
`du/u` from `lambda^(-1)` to `lambda` therefore yields

\[
 \boxed{
 \|E(F_>)\|_{L^2([\lambda^{-1},\lambda],du/u)}
 \leq C_r\lambda^{1/2}
 \exp\left[-{a_r\lambda^2-K\log(1/r)\over2}\right]
 \|F\|_2.}                                             \tag{4.2c}
\]

For `F=H_(lambda,J)`, the coefficient norm is uniformly bounded by the
decreasing Gevrey sum, and `K<=4M+4`.  Conditions (3.2), with `r=1/2`, make
the exponent in (4.2c) a fixed positive multiple of `lambda^2`.  Thus no
infinite arithmetic tail is hidden in the next step.  If

\[
 G_{\lambda,J}(t)=E(H_{\lambda,J})(e^t),
\]

then exact inversion evenization and (1.1), (4.1)--(4.2) give

\[
 \|k_\lambda^+(e^{\,\cdot})-G_{\lambda,J}\|_{L^2(-L/2,L/2)}
 \leq C\lambda e^{-c\lambda^2}
 +C\lambda\left({B(J+1)\over\lambda^2}\right)^{J+1}.
                                                               \tag{4.3}
\]

Each `g_j` is Fourier invariant and has both zero value and zero integral.
Thus `G_(lambda,J)` is exactly even by Poisson summation; no finite-parameter
inversion symmetry is assumed for the original prolate state.

## 5. Uniform projection of a growing Hermite polynomial

It remains to project `G_(lambda,J)`.  A fixed-order integration-by-parts
constant is not uniform when `J` grows, so we use analyticity.

Let `F` be a Fourier-invariant Hermite combination supported on labels at
most `K`, with `F(0)=integral(F)=0` and bounded coefficient norm, and put
`G(t)=E(F)(e^t)`.  For every fixed `0<sigma<pi/4`, `G` is analytic on
`|Im(t)|<sigma`.  The explicit formula

\[
 h_m(z)={2^{1/4}\over\sqrt{2^m m!}}
 H_m(\sqrt{2\pi}z)e^{-\pi z^2}
\]

and

\[
 |H_m(w)|\leq m!e^{1+2|w|}
\]

give the deliberately coarse but sufficient strip bound

\[
 \int_{\mathbb R}|G(t+is)|dt
 \leq\exp(C_\sigma K\log(K+2)),\qquad |s|\leq\sigma.    \tag{5.1}
\]

For `t>=0`, this follows by direct Gaussian summation.  For `t<=0`, use the
complexified Poisson identity

\[
 G(t+is)=G(-t-is),                                       \tag{5.2}
\]

which is valid because both exceptional Poisson terms vanish.  Identity
(5.2) first holds on the positive real scale and then throughout the sector
by analytic continuation.

Let `a=L/2`, `omega_n=2*pi*n/L`, and let `P_N` be the centered periodic
projection on `[-a,a]`.  Moving the whole-line Fourier contour in (5.1)
gives

\[
 |\widehat G(\omega)|
 \leq\exp(C_\sigma K\log(K+2)-\sigma|\omega|).           \tag{5.3}
\]

The restriction to `[-a,a]` introduces no uncontrolled endpoint series.
Indeed, evenness and `omega_n*a=pi*n` give, after two integrations by parts,

\[
 \left|\int_{|t|>a}G(t)e^{-i\omega_nt}dt\right|
 \leq{2\over\omega_n^2}
 \left(|G'(a)|+\int_a^\infty|G''(t)|dt\right).           \tag{5.4}
\]

When `K<=kappa*lambda^2` with
`kappa*log(2)<2*pi/3`, the derivative form of (3.4) bounds the parenthesis
in (5.4) by `poly(K) exp(-c_kappa lambda^2)`.  Summing (5.3)--(5.4) at the
periodic frequencies yields

\[
 \boxed{
 \|(1-P_N)G\|_2
 \leq C\exp(C_\sigma K\log(K+2)-\sigma\Omega_N)
 +C\,\operatorname {poly}(\lambda,K,N)e^{-c_\kappa\lambda^2},}
                                                               \tag{5.5}
\]

where `Omega_N=2*pi*(N+1)/L`.  More explicitly, the squared endpoint term
contains only `O(L^3N^(-3)e^(-2c_kappa lambda^2))`.

### 5.1 The two diagonals

On `N=ceil(lambda*L^3)`, take
`J=floor(delta_1*lambda*L)`, where `delta_1>0` is a sufficiently small
fixed constant.  Then

\[
 K=O(\lambda L),\qquad
 \Omega_N\asymp\lambda L^2,qquad
 \left({B(J+1)\over\lambda^2}\right)^{J+1}
 =O(e^{-c\lambda L^2}).
\]

Indeed, `log(lambda/(B*delta_1*L))>=L/4` eventually, while
`K*log(K+2)<=C*delta_1*lambda*L^2`; choosing `delta_1` after the strip
constant makes the negative Fourier exponent dominate.  Equations (4.3)
and (5.5) give the first line of (1.2).

For `J=M=floor(delta*lambda^2)`, one has

\[
 K=O(\lambda^2),\qquad K\log(K+2)=O(\lambda^2L).
\]

Choose the fixed constant `D` in
`N=ceil(D*lambda^2*L^2)` large enough that the negative term
`-sigma*Omega_N` dominates the constant in (5.5).  The projection term is
then smaller than `exp(-c lambda^2)`, and (4.3) gives the second line of
(1.2).  This diagonal is polynomial; no exponential Fourier cutoff is
needed.

## 6. Arithmetic sampling consequence and exact limitation

The existing variation estimate

\[
 \operatorname {TV}(R_N^{\rm proj})
 \leq3A_\lambda^{\rm src}V_*(\lambda)(1+\sqrt{2N})      \tag{6.1}
\]

is polynomial on both diagonals.  In the monotone compact-BV theorem, the
only additional loss is logarithmic in the ratio of (6.1) to the squared
`L2` error.  Multiplying an exponentially small squared error by that
logarithm preserves its exponential class.  The fixed-index physical-outer
bound is a polynomial times
`d_4=Theta(lambda^9 exp(-4*pi*lambda^2))`.  The projected-state norm stays
bounded below by the already-proved source-normalized limit.  Therefore

\[
\begin{array}{ll}
N=\lceil\lambda L^3\rceil:
 &U_Z=O(e^{-c\lambda L^2}),\\[1mm]
N=\lceil D\lambda^2L^2\rceil:
 &U_Z=O(e^{-c\lambda^2}),
\end{array}                                              \tag{6.2}
\]

with possibly smaller positive constants `c`.

On the conditional all-critical branch the signed scalar satisfies
`q_N=U_Z/2`.  Equation (6.2) removes the earlier *absolute-envelope*
conflict with the known degree-`O(L)` odd upper witness.  It does not give a
lower frame bound.  Higher-dimensional carrier locking or a much smaller
odd singular value remains possible, and no current source theorem compares
either value in (6.2) with the actual odd minimum.  The required relative
inequality therefore remains open.

## 7. Claim boundary

1. The proof establishes a qualitative Gevrey-one majorant and growing-order
   quasimode.  It does not Borel-sum the formal series and does not identify
   an optimal exponential constant.
2. Formula (2.9) proves the least-term *scale* is `Theta(lambda^2)`.  The
   endpoint-safe choice (3.2) is a smaller fixed multiple and is not claimed
   to be the exact least term.
3. The noncomputed fixed-index spectral and concentration thresholds prevent
   finite interval certification from this note alone.
4. Exponentially small positive sampling is not a signed sector theorem, a
   relative gap estimate, a shifted-resolvent estimate, or the locally
   uniform determinant limit required by the direct attack.
