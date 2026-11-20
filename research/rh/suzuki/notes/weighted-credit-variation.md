# Positive actual-arithmetic estimate: weighted prime-credit variation and near-square-root block freezing

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Useful result first

Let \(p_n\) enumerate ordinary primes after 2, \(r_n=\log p_n\), and \(c_n=\widetilde c_{p_n}\) be the renormalized credits from `../suzuki_prime_only_renormalization/PROPER_POWER_CREDIT_TAIL_AND_PRIME_MEMORY.md`. For every real \(X=e^L\) with \(L\ge512\),

\[
 \boxed{\quad\sum_{p_n\ge X}|c_{n+1}-c_n|
              \le{23L+34\over\sqrt X}.\quad}             \tag{1}
\]

More strongly, for every fixed \(0\le\alpha<1/2\), put \(\delta=1/2-\alpha\). Then

\[
 \boxed{\quad
 \sum_{p_n\ge X}p_n^\alpha|c_{n+1}-c_n|
 \le e^{-\delta L}\left[6L+\frac{17}{2}
                       \left({L\over\delta}+{1\over\delta^2}\right)\right].
 \quad}                                                   \tag{2}
\]

A critical-exponent version is also available. For any \(B>2\) and \(L\ge\max(512,2B)\),

\[
 \boxed{\quad
 \sum_{p_n\ge X}{\sqrt{p_n}\over(\log p_n)^B}|c_{n+1}-c_n|
       \le6L^{1-B}+{17\over2(B-2)}L^{2-B}.
 \quad}                                                   \tag{3}
\]

Thus the actual signed credit sequence can be frozen on consecutive prime-index blocks of up to \(\sqrt p/(\log p)^3\) events at a **finite total absolute error**, whose future tail is at most \(6/L^2+17/(2L)\). This is a proved compression error, not a bound on the retained signed block credits.

Both credit Jordan sums still diverge. The new positive estimate concerns **variation between neighboring credit values**, not the sum of their magnitudes; those quantities must not be confused.

## 1. Exact state and uniform tail bounds

Keep the renormalized arithmetic state

\[
 P(r)=\sum_{p\le e^r}{\log p\over\sqrt p},\quad
 H(r)=P(r)+r/2+\kappa-b,
 \quad w(r)=re^{-r/2},
\]

\[
 f(r)=w(r)\left[r-2\log(H(r)/2)\right].                  \tag{4}
\]

The event credit is the left limit \(c_n=f(r_n-)\). The right-continuous H has a jump of size \(w(r_n)\) at p_n and derivative \(1/2\) between primes. This is exactly the state of the prime-only reserve

\[
 \mathcal R(r)=J_P(r)+r^2/4
              -2H(r)[\log(H(r)/2)-1]-4+T_\infty;
\]

neither deterministic counterterm is omitted.

The existing unconditional PNT onset estimate and the proper-power memory bounds imply, for **every real** \(r\ge512\),

\[
 e^{r/2}\le H(r-)\le H(r)\le7e^{r/2}.                    \tag{5}
\]

Here is the constant check, so (5) is not a new unproved prime bound. The full weighted state is between \((3/2)e^{r/2}\) and \(6e^{r/2}\); the lower bound follows from the parent's relative error envelope, and the upper bound from \(\psi(x)\le3x\). Its omitted proper-power memory is at most \(r^3\). Therefore the prime-only state before adding \(r/2+\kappa\) is at least \((5/4)e^{r/2}\), since \(e^{r/2}\ge4r^3\) on this range. Also \(-1<\kappa<10\): for the upper bound,

\[
 \sum_p{\log p\over\sqrt p(p-1)}
 \le2\sum_{n\ge2}{\log n\over n^{3/2}}<10,
\]

using that \((\log x)x^{-3/2}\) decreases for \(x\ge2\), its integral over \([1,\infty)\) is 4, and its value at 2 is below 1. The extra \(r/2+\kappa\) is bounded by \(e^{r/2}\), and its lower bound is greater than -1. These elementary inequalities prove (5), including the left limits at events. The existing relative-error proof applies without an event subtraction at other real points, so no interpolation of a finite scan is involved.

Consequently, with \(\ell(r)=r-2\log(H(r)/2)\),

\[
 |\ell(r)|\le3,\qquad |f(r)|\le3re^{-r/2}.               \tag{6}
\]

The logarithm range follows from \(H/(2e^{r/2})\in[1/2,7/2]\) and \(2\log(7/2)<3\).

## 2. Exact continuous derivative and downward event jump

Between primes, differentiate (4), retaining \(H'=1/2\):

\[
 f'(r)=w'(r)\ell(r)+w(r)[1-1/H(r)].                       \tag{7}
\]

Since \(H\ge1\), \(|1-1/H|\le1\). For \(r\ge512\),
\(|w'|=(r/2-1)e^{-r/2}\le(r/2)e^{-r/2}\). Thus

\[
 |f'(r)|\le{5\over2}re^{-r/2}.                           \tag{8}
\]

At a prime event, with H the pre-event state and w=w(r), the jump is exactly

\[
 f(r+)-f(r-)=-2w\log(1+w/H),
 \qquad |f(r+)-f(r-)|\le{2w^2\over H}
                                  \le2r^2e^{-3r/2}.       \tag{9}
\]

For consecutive primes there are no omitted intermediate prime jumps:

\[
 c_{n+1}-c_n=[f(r_n+)-f(r_n-)]
                         +\int_{r_n}^{r_{n+1}}f'(r)dr.   \tag{10}
\]

Equations (8)--(10), rather than a prime-gap upper bound or random-gap model, are the core of the estimate.

## 3. Weighted variation proof

For a nonnegative increasing weight G on the log tail, (10) gives

\[
 \sum_{r_n\ge L}G(r_n)|c_{n+1}-c_n|
 \le{5\over2}\int_L^\infty G(r)r e^{-r/2}dr
            +2\sum_{p\ge e^L}G(\log p){(\log p)^2\over p^{3/2}}.
                                                               \tag{11}
\]

If the first prime is strictly beyond e^L, extending the integral down to L only enlarges it. The last interval is handled by monotone limits. There is no discarded endpoint atom.

### Subcritical power weights

Take \(G(r)=e^{\alpha r}\). Put \(\beta=3/2-\alpha=1+\delta\). For the prime term, use the actual nonnegative Chebyshev measure \(d\theta(x)\), with \(\theta(x)\le3x\), and the decreasing function \(g(x)=(\log x)x^{-\beta}\):

\[
 \sum_{p\ge X}{(\log p)^2\over p^\beta}
 =\int_{[X,\infty)}g(x)d\theta(x)
 \le3\left[Xg(X)+\int_X^\infty g(x)dx\right]
 =3e^{-\delta L}
        \left[L+{L\over\delta}+{1\over\delta^2}\right].   \tag{12}
\]

This bound follows by integration by parts, dropping only the nonpositive lower boundary \(-\theta(X-)g(X)\), and then using \(-g'\ge0\). The continuous integral in (11) is

\[
 {5\over2}e^{-\delta L}
                      (L/\delta+1/\delta^2).
\]

Combining with twice (12) proves (2). Setting \(\alpha=0\) gives exactly (1).

### Critical power with logarithmic saving

Take \(G(r)=e^{r/2}/r^B\), increasing once \(r\ge2B\). The continuous contribution is

\[
 {5\over2}\int_L^\infty r^{1-B}dr
                  ={5\over2(B-2)}L^{2-B}.
\]

The prime term in (11) becomes \(2\sum_{p\ge X}(\log p)^{2-B}/p\). Apply the same Stieltjes argument to
\(g(x)=(\log x)^{1-B}/x\), which is decreasing for x>1:

\[
 \sum_{p\ge X}{(\log p)^{2-B}\over p}
 \le3\left[L^{1-B}+{L^{2-B}\over B-2}\right].             \tag{13}
\]

This proves (3). No claim is made that B>2 is a sharp threshold for the sampled credit sequence; it is the proved range of this absolute continuous/jump estimate.

## 4. Consequence: growing consecutive-prime blocks at finite total error

Partition a tail of the prime indices into arbitrary consecutive finite blocks
\(I_j=\{N_j,\ldots,N_{j+1}-1\}\), of lengths K_j. Freeze all credits in block j to \(c_{N_j}\). If

\[
 K_j\le {\sqrt{p_{N_j}}\over(\log p_{N_j})^B},\quad B>2,
                                                               \tag{14}
\]

then for the entire tail beginning at \(p_{N_0}\ge e^L\),

\[
 \begin{aligned}
 \sum_{j\ge0}\sum_{n\in I_j}|c_n-c_{N_j}|
 &\le\sum_j K_j\sum_{n=N_j}^{N_{j+1}-2}|c_{n+1}-c_n|\\
 &\le\sum_{p_n\ge e^L}{\sqrt{p_n}\over(\log p_n)^B}|c_{n+1}-c_n|\\
 &\le6L^{1-B}+{17\over2(B-2)}L^{2-B}.                   \tag{15}
 \end{aligned}
\]

The second inequality uses only the proved monotonicity of G and \(p_n\ge p_{N_j}\), not an assumption on prime gaps inside a block. There is an analogous version with \(K_j\le p_{N_j}^\alpha\) and the tail (2).

Thus the actual credit prefix differs by a convergent correction from the block sum

\[
 \sum_{j<J}K_j c_{N_j}.                                  \tag{16}
\]

Unfinished blocks do not hide large excursions: (6) and (14) give

\[
 K_j|c_{N_j}|\le3(\log p_{N_j})^{1-B}\to0.
\]

For the concrete choice B=3, the compression allows up to \(\sqrt p/(\log p)^3\) consecutive prime events per block, with total future absolute freezing error at most \(6/L^2+17/(2L)\). The fixed starting threshold is far beyond any computed scan; the assertion is analytic and all-scale.

This does **not** assert that (16) is bounded. The coefficients retain their actual signs and coherent long-log-scale oscillation. The gain is a rigorously cheap event-scale compression, not a cancellation theorem for the retained macroscopic blocks.

## 5. Consequence: what adjacent-rank pairing does and does not cancel

Equation (1) implies

\[
 \sum_j|c_{2j+1}-c_{2j}|<\infty,                         \tag{17}
\]

after any finite initial adjustment. More generally, each fixed periodic zero-mean weighting of the prime **indices** has a convergent credit sum, by summation by parts with the finite variation of c and \(c_n\to0\).

Therefore the credit sums on even- and odd-indexed primes differ by a convergent correction. Each carries half the full unresolved prefix, rather than furnishing opposite phases whose sum cancels. Likewise each fixed index-residue class carries 1/k of the full prefix up to a convergent correction. Since the full positive and negative Jordan sums both diverge, finite blockwise perturbations show that each such fixed class retains both divergences.

This positively identifies the microstructure: neighboring ordinary-prime credits are asymptotically almost equal in total variation. Successful matching must couple separated stages of the accumulated mismatch, not expect cancellation merely from nearest-neighbor or fixed-rank parity pairing.

## Evidence and next use

`check_variation_constants.py` verifies the exact derivative/jump algebra, Stieltjes antiderivatives, rational constants, and the new scalar state-envelope gates with Arb at 192 and 256 bits. It does not enumerate primes or certify a global prefix bound. The general inequalities are proved above. No previously pinned file is changed.

The strongest next arithmetic target is now a genuinely signed comparison of the retained block credits (16), at scales coarse enough to include an actual mismatch phase change. The local freezing error is no longer an uncontrolled cost. A proposed storage can be falsified or estimated on this compressed flow without assuming that its two divergent signed budgets converge separately.
