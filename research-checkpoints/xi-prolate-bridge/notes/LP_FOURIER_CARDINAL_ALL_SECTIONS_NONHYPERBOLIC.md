# An LP transform whose every nontrivial Fourier-cardinal section is nonhyperbolic

## 0. Exact outcome and claim boundary

This note closes the complementary-parity loophole left by
`LP_FOURIER_CARDINAL_INFINITE_NONHYPERBOLIC_SUBSEQUENCE.md` without changing
that frozen package.  For the even indicator of `[-pi/2,pi/2]` in
`[-pi,pi]`, every prescribed Fourier-cardinal numerator satisfies

\[
                 \boxed{p_N\ \hbox{is nonhyperbolic for every }N\geq3.}
                                                               \tag{0.1}
\]

The earlier package proves this when the number `M` of retained odd modes is
even.  Here a reciprocal-root Hankel determinant is strictly negative for
every odd `M>=3`.  The proof is uniform from the first case onward: it uses
exact beta-value cancellation, integral tail bounds, and rational bounds for
`pi`; no numerical root finder or finite floating-point sweep enters.

This is a theorem about one explicit compact-support Laguerre--Polya fixture.
It proves that LP membership does not even guarantee a good cofinal
subsequence of the prescribed Fourier sections.  It does not say that the
actual projected prolate anchors have this behavior, prove or disprove their
eventual hyperbolicity, establish equation (5.2) of `DIRECT_RH_ATTACK.md`,
prove the Riemann hypothesis, or give a Lambda bound.  The formal state
remains `P0_INVALIDATED`.

The centered basis, raw coordinates, and Fourier-cardinal map are exactly
those of the frozen adaptive-cutoff and indicator packages.  The binding
source and normalization bytes in `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md` are unchanged.

## 1. Odd-mode factor and reciprocal-root moments

Put `a_j=2*j-1` and

\[
 D_M^{\rm o}(y)=\prod_{j=1}^M(y-a_j^2),               \tag{1.1}
\]

\[
 q_M(y)=D_M^{\rm o}(y)
 \left\{{\pi\over2}+2y\sum_{j=1}^M
 {(-1)^j\over a_j(y-a_j^2)}\right\}.                 \tag{1.2}
\]

The zero even Fourier coordinates give the exact factorizations

\[
 p_{2M-1}(y)=\prod_{k=1}^{M-1}(y-4k^2)q_M(y),
 \qquad
 p_{2M}(y)=(y-4M^2)p_{2M-1}(y).                       \tag{1.3}
\]

The leading coefficient of `q_M` is the nonzero alternating remainder

\[
 c_M={\pi\over2}+2\sum_{j=1}^M{(-1)^j\over a_j},       \tag{1.4}
\]

and

\[
 q_M(0)={\pi\over2}(-1)^M\prod_{j=1}^Ma_j^2\ne0.       \tag{1.5}
\]

Thus `q_M` has degree `M` and all its roots are finite and nonzero.  Let
those roots, with multiplicity, be `rho_(1,M),...,rho_(M,M)`, and define

\[
 S_k(M)=\sum_{j=1}^M\rho_{j,M}^{-k}.                  \tag{1.6}
\]

For positive integers `r,s`, write

\[
 A_{r,M}=\sum_{j=1}^Ma_j^{-r},
 \qquad
 B_{s,M}=\sum_{j=1}^M{(-1)^{j-1}\over a_j^s}.         \tag{1.7}
\]

Near the origin, the normalized polynomial has the exact product

\[
 {q_M(y)\over q_M(0)}
 =\prod_{j=1}^M\left(1-{y\over a_j^2}\right)
 \left\{1+{4\over\pi}\sum_{k\geq1}B_{2k+1,M}y^k\right\}.
                                                               \tag{1.8}
\]

Comparing the first four coefficients of its logarithm with
`-sum_(k>=1) S_k*y^k/k` gives

\[
 \boxed{
 S_2=A_{4,M}+{16\over\pi^2}B_{3,M}^2
                 -{8\over\pi}B_{5,M},}               \tag{1.9}
\]

\[
 \boxed{
 S_3=A_{6,M}-{12\over\pi}B_{7,M}
       +{48\over\pi^2}B_{3,M}B_{5,M}
       -{64\over\pi^3}B_{3,M}^3,}                    \tag{1.10}
\]

\[
 \boxed{
 \begin{aligned}
 S_4={}&A_{8,M}-{16\over\pi}B_{9,M}
 +{64B_{3,M}B_{7,M}+32B_{5,M}^2\over\pi^2}\\
 &-{256\over\pi^3}B_{3,M}^2B_{5,M}
 +{256\over\pi^4}B_{3,M}^4.
 \end{aligned}}                                      \tag{1.11}
\]

If all roots were real, the real numbers `r_j=1/rho_(j,M)` would obey
Cauchy--Schwarz:

\[
 \boxed{
 H_M:=S_2S_4-S_3^2
 =\left(\sum_jr_j^2\right)\left(\sum_jr_j^4\right)
  -\left(\sum_jr_j^3\right)^2\geq0.}                 \tag{1.12}
\]

It is therefore enough to prove `H_M<0`.

## 2. Exact odd-`M` tail expansion

Assume from now on that `M>=3` is odd, and put

\[
 b=2M+1\geq7.                                         \tag{2.1}
\]

The first omitted beta term has negative sign.  Define the positive tails

\[
 e_s=B_{s,M}-\beta(s)
 =\sum_{k\geq0}{(-1)^k\over(b+2k)^s},                 \tag{2.2}
\]

\[
 a_r=A_{r,\infty}-A_{r,M}
 =\sum_{k\geq0}{1\over(b+2k)^r}.                     \tag{2.3}
\]

Use the exact constants

\[
 A_{4,\infty}={\pi^4\over96},\quad
 A_{6,\infty}={\pi^6\over960},\quad
 A_{8,\infty}={17\pi^8\over161280},                  \tag{2.4}
\]

\[
 \beta(3)={\pi^3\over32},\quad
 \beta(5)={5\pi^5\over1536},\quad
 \beta(7)={61\pi^7\over184320},\quad
 \beta(9)={1385\pi^9\over41287680}.                 \tag{2.5}
\]

The infinite parts of (1.9)--(1.11) cancel.  Direct expansion leaves

\[
 \boxed{
 S_2=-a_4+\pi e_3+{16\over\pi^2}e_3^2-{8\over\pi}e_5,}
                                                               \tag{2.6}
\]

\[
 \boxed{
 \begin{aligned}
 S_3={}&-a_6-{\pi^3\over32}e_3+{3\pi\over2}e_5
 -{12\over\pi}e_7+{48\over\pi^2}e_3e_5\\
 &-6e_3^2-{64\over\pi^3}e_3^3,
 \end{aligned}}                                      \tag{2.7}
\]

and

\[
 \boxed{
 \begin{aligned}
 S_4={}&-a_8+{\pi^5\over2880}e_3-{\pi^3\over24}e_5
 +2\pi e_7-{16\over\pi}e_9\\
 &+{64\over\pi^2}e_3e_7+{32\over\pi^2}e_5^2
 -16e_3e_5+{2\pi^2\over3}e_3^2\\
 &-{256\over\pi^3}e_3^2e_5+{32\over\pi}e_3^3
 +{256\over\pi^4}e_3^4.
 \end{aligned}}                                      \tag{2.8}
\]

These identities retain all cancellations before any absolute value is
taken.

## 3. Uniform rational tail bounds

The alternating tail has the integral representation

\[
 e_s={1\over\Gamma(s)}\int_0^\infty
 {t^{s-1}e^{-bt}\over1+e^{-2t}}\,dt.                 \tag{3.1}
\]

Since

\[
 {1\over1+e^{-2t}}={1+\tanh t\over2},
 \qquad 0\leq\tanh t\leq t,
\]

one obtains the sharp-enough elementary enclosure

\[
 \boxed{
 {1\over2b^s}\leq e_s\leq {1+s/b\over2b^s}.}         \tag{3.2}
\]

Integral comparison for the positive step-two tail gives

\[
 \boxed{
 {1\over2(r-1)b^{r-1}}\leq a_r\leq
 {1\over2(r-1)b^{r-1}}+{1\over b^r}.}                \tag{3.3}
\]

Put `x=1/b`, so `0<x<=1/7`, and use the classical rational enclosure

\[
 p_-={333\over106}<\pi<{355\over113}=p_+.             \tag{3.4}
\]

It follows from (2.6), (3.2), and (3.3) that

\[
 b^3S_2\geq
 F_2^-(x):=-{1\over6}-x+{p_-\over2}
 -{4\over p_-}(1+5x)x^2,                             \tag{3.5}
\]

\[
 b^3S_2\leq
 F_2^+(x):=-{1\over6}+{p_+\over2}(1+3x)
 -{4\over p_+}x^2
 +{4\over p_-^2}(1+3x)^2x^3.                        \tag{3.6}
\]

The lower function is decreasing and the upper function is increasing on
`[0,1/7]`.  Exact rational arithmetic at the right endpoint gives

\[
 F_2^-(1/7)={3273481\over2690492}>0,                  \tag{3.7}
\]

\[
 {33\over16}-F_2^+(1/7)
 ={10460413609237\over1196204539738320}>0.            \tag{3.8}
\]

For (2.7), discard only terms which are nonpositive and bound the two
remaining positive terms.  This gives

\[
 b^3S_3\leq F_3(x):=-{p_-^3\over64}
 +{3p_+\over4}(1+5x)x^2
 +{12\over p_-^2}(1+3x)(1+5x)x^5.                   \tag{3.9}
\]

The function `F_3` is increasing, and

\[
 -{2\over5}-F_3(1/7)
 ={797489670449391743\over436996798491065863680}>0.  \tag{3.10}
\]

Finally, retain the negative `-pi^3*e_5/24` term in (2.8), discard the other
negative terms, and bound every positive term.  With

\[
 A={p_+^5\over5760},\qquad B={p_-^3\over48},          \tag{3.11}
\]

the result is

\[
 \begin{aligned}
 b^3S_4\leq F_4(x):={}&A(1+3x)-Bx^2
 +p_+(1+7x)x^4\\
 &+{16\over p_-^2}(1+3x)(1+7x)x^7
 +{8\over p_-^2}(1+5x)^2x^7\\
 &+{p_+^2\over6}(1+3x)^2x^3
 +{4\over p_-}(1+3x)^3x^6
 +{16\over p_-^4}(1+3x)^4x^9.
                                                               \tag{3.12}
 \end{aligned}
\]

All omitted summands in the derivative are nonnegative, and

\[
 F_4'(x)\geq3A-2Bx+{p_+^2\over2}x^2.                 \tag{3.13}
\]

The quadratic on the right is everywhere positive because its discriminant
is

\[
 -{94659082817413134972874512509
 \over64074544082187618689659613184}<0.              \tag{3.14}
\]

Thus `F_4` is increasing, and exact rational arithmetic gives

\[
 {19\over250}-F_4(1/7)
 ={43917328230225517403879861572711173047
 \over52286703643634855977515802478452324272000}>0.  \tag{3.15}
\]

Equations (3.5)--(3.15) prove, uniformly for every odd `M>=3`,

\[
 \boxed{
 0<S_2<{33\over16}b^{-3},\qquad
 S_3<-{2\over5}b^{-3},\qquad
 S_4<{19\over250}b^{-3}.}                            \tag{3.16}
\]

The rational enclosure (3.4) is itself elementary.  Define

\[
 T_K(z)=\sum_{k=0}^K{(-1)^kz^{2k+1}\over2k+1}.
                                                               \tag{3.17}
\]

The alternating-series remainder gives

\[
 T_{2r+1}(z)<\arctan z<T_{2r}(z)\qquad(0<z<1).       \tag{3.18}
\]

If `alpha=arctan(1/5)`, then the double-angle formula gives
`tan(2*alpha)=5/12` and `tan(4*alpha)=120/119`.  Therefore

\[
 \tan\left(4\alpha-\arctan{1\over239}\right)
 ={120/119-1/239\over1+(120/119)(1/239)}=1.
\]

The angle lies in `(0,pi/2)`, proving Machin's identity

\[
 {\pi\over4}=4\arctan{1\over5}-\arctan{1\over239}.  \tag{3.19}
\]

Using (3.18) with the displayed truncation indices gives the wholly rational
certificate

\[
 {333\over106}
 <16T_7(1/5)-4T_2(1/239)
 <\pi
 <16T_8(1/5)-4T_1(1/239)
 <{355\over113}.                                    \tag{3.20}
\]

Both outside comparisons in (3.20) are ordinary integer cross-
multiplications.  Thus no numerical value of `pi` is assumed anywhere in
the proof.

## 4. All sections from `N=3` onward fail

Because `S_2>0`, (3.16) implies

\[
 \begin{aligned}
 H_M&=S_2S_4-S_3^2\\
 &<\left({33\over16}{19\over250}-{4\over25}\right)b^{-6}
 =-{13\over4000}b^{-6}<0.                            \tag{4.1}
 \end{aligned}
\]

This contradicts the real-root necessary condition (1.12), so `q_M` is
nonhyperbolic for every odd `M>=3`.  The frozen predecessor proves the same
statement for every even `M>=2`.  Equation (1.3) adds only real lattice
roots, and every integer `N>=3` is either `2M-1` or `2M` for one `M>=2`.
This proves (0.1).

The conclusion is deliberately fixture-specific.  It eliminates the good-
cofinal loophole for this LP indicator, not for the actual prolate anchor.
An actual-source adaptive theorem still requires source-specific root or
no-escape information.  The formal state remains `P0_INVALIDATED`.
