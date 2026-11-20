# An LP transform with infinitely many nonhyperbolic Fourier-cardinal sections

## 0. Exact outcome and claim boundary

Laguerre--Polya membership of the square-variable compact-support transform
does **not** imply eventual hyperbolicity of the prescribed Fourier-cardinal
numerators.  The even indicator of `[-pi/2,pi/2]` in `[-pi,pi]` gives an
exact counterfamily: its raw numerator \(p_N\) is nonhyperbolic for every

\[
             \boxed{N=4r-1\quad\hbox{or}\quad N=4r,
                    \qquad r\geq1.}                     \tag{0.1}
\]

The certificate is not numerical.  After the forced even lattice factors
are removed, the sum of the squared reciprocals of the remaining roots is
strictly negative.  This is impossible when all of those roots are real.

This result strengthens the single `N=3` fixture in
`ADAPTIVE_OUTER_CUTOFF_HYPERBOLICITY_BARRIER.md`.  It does not prove that the
complementary sections are nonhyperbolic, exclude a cofinal hyperbolic
subsequence, or say that the actual prolate states have this behavior.  It
does not prove an adaptive schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`,
the Riemann hypothesis, or a Lambda bound.  The formal state remains
`P0_INVALIDATED`.

## 1. The compact-support LP fixture

Let

\[
 X(t)={\bf1}_{[-\pi/2,\pi/2]}(t),\qquad -\pi\leq t\leq\pi. \tag{1.1}
\]

Up to a positive constant, its square-variable transform is

\[
 E(y)={\sin(\pi\sqrt y/2)\over\sqrt y}
     ={\pi\over2}\prod_{k\geq1}
       \left(1-{y\over4k^2}\right).                    \tag{1.2}
\]

The product has only real zeros and
\(\sum_{k\geq1}(4k^2)^{-1}<\infty\); hence
\(E\in\mathcal {LP}\).

Use the centered basis convention from
`ADAPTIVE_OUTER_CUTOFF_HYPERBOLICITY_BARRIER.md`.  After a common harmless
normalization, the raw coordinates are

\[
 x_0={\pi\over2},\qquad
 x_{2j}=0,\qquad
 x_{2j-1}={(-1)^j\over2j-1}\quad(j\geq1).              \tag{1.3}
\]

For

\[
 D_N(y)=\prod_{n=1}^N(y-n^2),                            \tag{1.4}
\]

the prescribed numerator is

\[
 p_N(y)=x_0D_N(y)+2y\sum_{n=1}^Nx_n
                 \prod_{\substack{1\leq m\leq N\\m\ne n}}(y-m^2).
                                                               \tag{1.5}
\]

This is the same Fourier-cardinal map as in the frozen adaptive-cutoff
package; only the explicit test function is specialized.

## 2. Removing the forced real factors

Put \(a_j=2j-1\), and define

\[
 D_M^{\rm o}(y)=\prod_{j=1}^M(y-a_j^2),                 \tag{2.1}
\]

\[
 q_M(y)=D_M^{\rm o}(y)
 \left\{{\pi\over2}+2y\sum_{j=1}^M
 {(-1)^j\over a_j(y-a_j^2)}\right\}.                   \tag{2.2}
\]

Every zero even coordinate in (1.3) leaves its lattice factor untouched,
so direct substitution in (1.5) gives

\[
 p_{2M-1}(y)=\prod_{k=1}^{M-1}(y-4k^2)\,q_M(y),         \tag{2.3}
\]

\[
 p_{2M}(y)=(y-4M^2)p_{2M-1}(y).                         \tag{2.4}
\]

The leading coefficient of \(q_M\) is

\[
 c_M={\pi\over2}+2\sum_{j=1}^M{(-1)^j\over a_j}
    =2\left\{{\pi\over4}-
       \sum_{j=1}^M{(-1)^{j-1}\over a_j}\right\}.      \tag{2.5}
\]

The alternating-series remainder is nonzero.  In particular, when \(M\)
is even, \(c_M>0\), and \(q_M\) has degree \(M\).  Also

\[
 q_M(0)={\pi\over2}(-1)^M\prod_{j=1}^Ma_j^2\ne0.       \tag{2.6}
\]

Thus all roots of \(q_M\) are finite and nonzero on the even-\(M\) branch.

## 3. A negative reciprocal-square Newton sum

Define the finite sums

\[
 A_{4,M}=\sum_{j=1}^M{1\over a_j^4},\qquad
 B_{s,M}=\sum_{j=1}^M{(-1)^{j-1}\over a_j^s}
 \quad(s=3,5).                                          \tag{3.1}
\]

### Lemma 3.1 (exact Newton identity)

If \(\rho_{1,M},\ldots,\rho_{M,M}\) are the roots of \(q_M\), counted with
multiplicity, then

\[
 \boxed{
 \sum_{j=1}^M\rho_{j,M}^{-2}
 =A_{4,M}+{16\over\pi^2}B_{3,M}^2
             -{8\over\pi}B_{5,M}.}                    \tag{3.2}
\]

**Proof.**  Near the origin,

\[
 {D_M^{\rm o}(y)\over D_M^{\rm o}(0)}
 =\prod_{j=1}^M\left(1-{y\over a_j^2}\right),          \tag{3.3}
\]

whereas the bracket in (2.2), divided by \(\pi/2\), is

\[
 1+{4\over\pi}B_{3,M}y
   +{4\over\pi}B_{5,M}y^2+O(y^3).                      \tag{3.4}
\]

On the other hand,

\[
 {q_M(y)\over q_M(0)}
 =\prod_{j=1}^M\left(1-{y\over\rho_{j,M}}\right).      \tag{3.5}
\]

Comparing the first two coefficients and using

\[
 \left(\sum_j\rho_{j,M}^{-1}\right)^2
 -2\sum_{i<j}(\rho_{i,M}\rho_{j,M})^{-1}
 =\sum_j\rho_{j,M}^{-2}                                \tag{3.6}
\]

cancels the mixed terms and gives (3.2).  \(\square\)

### Theorem 3.2 (uniform even-\(M\) obstruction)

For every even \(M\geq2\),

\[
             \boxed{\sum_{j=1}^M\rho_{j,M}^{-2}<0.}     \tag{3.7}
\]

Consequently \(q_M\) is not real-rooted.

**Proof.**  The classical exact sums are

\[
 A_{4,\infty}={\pi^4\over96},\qquad
 \beta(3)={\pi^3\over32},\qquad
 \beta(5)={5\pi^5\over1536}.                           \tag{3.8}
\]

For even \(M\), set

\[
 \delta_4=A_{4,\infty}-A_{4,M},\qquad
 \delta_s=\beta(s)-B_{s,M}\quad(s=3,5),                \tag{3.9}
\]

and let \(b=2M+1\geq5\).  Each alternating remainder starts with its
positive \(b^{-s}\) term, so

\[
 0<\delta_s<b^{-s}.                                     \tag{3.10}
\]

Moreover, \(\delta_5<\delta_3\): their difference is the positive
alternating remainder whose decreasing terms are

\[
 a^{-3}-a^{-5}>0,qquad a=b,b+2,b+4,\ldots .            \tag{3.11}
\]

Substituting (3.8)--(3.9) in (3.2), the infinite constants cancel exactly,

\[
 {\pi^4\over96}+{16\over\pi^2}
       \left({\pi^3\over32}\right)^2
 -{8\over\pi}{5\pi^5\over1536}=0,                    \tag{3.12}
\]

and leaves

\[
 \sum_j\rho_{j,M}^{-2}
 =-\delta_4-\pi\delta_3
   +{16\over\pi^2}\delta_3^2+{8\over\pi}\delta_5.   \tag{3.13}
\]

The two positive terms are strictly dominated separately.  Since
\(\pi^2>8\) and \(\delta_5<\delta_3\),

\[
 {8\over\pi}\delta_5<\pi\delta_3.                     \tag{3.14}
\]

Also \(\delta_4\geq b^{-4}\), while (3.10), \(b\geq5\), and \(\pi>3\)
give

\[
 {16\over\pi^2}\delta_3^2
 <{16\over\pi^2b^6}<b^{-4}\leq\delta_4.               \tag{3.15}
\]

Equations (3.13)--(3.15) prove (3.7).  If every \(\rho_{j,M}\) were real,
then (2.6) would make every \(\rho_{j,M}^{-2}\) strictly positive, contrary
to (3.7).  \(\square\)

## 4. Exact subsequence and what remains open

Take \(M=2r\).  Equations (2.3)--(2.4) add only real lattice roots to the
nonreal-rooted factor \(q_{2r}\).  Therefore \(p_N\) is nonhyperbolic for
both \(N=4r-1\) and \(N=4r\), proving (0.1).

This closes one logical gap sharply:

\[
 \boxed{\mathcal E\in\mathcal {LP}
 \quad\not\Longrightarrow\quad
 \hbox{eventual hyperbolicity of its prescribed Fourier sections}.} \tag{4.1}
\]

The obstruction is escape-sensitive: (3.7) is a Newton sum at the origin,
not a compact zero-limit argument.  The theorem does not classify the
odd-\(M\) factors and therefore does not exclude a specially selected
cofinal subsequence.  Any actual-source adaptive theorem still needs a
source-specific hyperbolicity or no-escape argument; ordinary LP membership
alone cannot supply eventual section hyperbolicity.
