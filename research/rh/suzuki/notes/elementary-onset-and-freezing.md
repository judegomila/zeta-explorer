# Elementary onset for the all-future prime-credit compression budget

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## 1. An elementary lower bound for the actual Chebyshev count

For every integer n>=1, each exponent in the prime-power factorization of the central binomial coefficient is

\[
 \lfloor2n/p^k\rfloor-2\lfloor n/p^k\rfloor\in\{0,1\}.
\]

Therefore

\[
 \psi(2n)\ge\log {2n\choose n}
                 \ge2n\log2-\log(2n+1).
\]

The second inequality uses that the central coefficient is the largest among 2n+1 nonnegative coefficients summing to \(4^n\). For real x, take \(n=\lfloor x/2\rfloor\), giving

\[
 \psi(x)\ge(x-2)\log2-\log(x+1)\ge x/2\qquad(x\ge32).    \tag{1}
\]

The final scalar inequality holds at 32 and persists because its derivative after subtraction of x/2 is \(\log2-1/(x+1)-1/2>0\). It holds for the left limit at an event as well, by approaching from below.

Combining (1) with exact weighted partial summation gives

\[
 S(x)\ge\frac12\sqrt x+\frac14\int_{32}^x t^{-1/2}dt
              =\sqrt x-\sqrt8,\qquad x\ge32.            \tag{2}
\]

Since \(-b>2\), the full weighted state is at least \(\sqrt x-1\).

## 2. Renormalized ordinary-prime state bounds from X=10000 onward

The exact even/odd proper-power decomposition gives

\[
 B(r)=\sum_{n\le e^{r/2}}\Lambda(n)/n
              +\sum_{p^k\le e^r,\ k\ge3\ {\rm odd}}\log p/p^{k/2}.
\]

The existing elementary upper bound \(\psi(x)\le3x\) yields
\(\sum_{n\le y}\Lambda(n)/n\le3+3\log y\). The complete odd sum is less than 10 by the convergent integer majorant in the variation note. Consequently

\[
 B(r)\le13+3r/2.
\]

For the actual ordinary-prime state
\(H(r)=P(r)+r/2+\kappa-b\), with \(-1<\kappa<10\), (2) gives

\[
 H(r)\ge e^{r/2}-r-15\ge\tfrac34e^{r/2},
 \quad r\ge\log10000.                                    \tag{3}
\]

The elementary upper bound gives \(H(r)\le6e^{r/2}+r/2+10\le7e^{r/2}\) on the same range. The onset gates
\(e^{r/2}/4>r+15\) and \(e^{r/2}>r/2+10\) hold at \(r=\log10000\) and have positive difference derivatives thereafter. Thus, uniformly for all real r in this range and at both event limits,

\[
 \tfrac34e^{r/2}\le H(r)\le7e^{r/2},\qquad
 |r-2\log(H(r)/2)|\le3.                                  \tag{4}
\]

No quantitative PNT theorem or zero-height result is needed for (1)--(4).

## 3. Explicit future budgets with the weaker lower constant

The exact derivative estimate from the variation note remains
\(|f'|\le(5/2)re^{-r/2}\). Only the event-jump constant changes:

\[
 |\Delta f|\le2w^2/H\le\tfrac83r^2e^{-3r/2}.
\]

Repeating the same Stieltjes argument with \(\theta(x)\le3x\) gives, for \(X=e^L\ge10000\),

\[
 \sum_{p_n\ge X}|c_{n+1}-c_n|
                  \le(29L+42)e^{-L/2},                   \tag{5}
\]

and, for \(0\le\alpha<1/2\), \(\delta=1/2-\alpha\),

\[
 \sum_{p_n\ge X}p_n^\alpha|c_{n+1}-c_n|
 \le e^{-\delta L}\left[8L+\frac{21}{2}
               \left(\frac L\delta+\frac1{\delta^2}\right)\right].
                                                               \tag{6}
\]

At critical exponent, for \(B>2\) and \(L\ge\max(\log10000,2B)\),

\[
 \boxed{\quad
 \sum_{p_n\ge X}{\sqrt{p_n}\over(\log p_n)^B}|c_{n+1}-c_n|
       \le8L^{1-B}+\frac{21}{2(B-2)}L^{2-B}.\quad}         \tag{7}
\]

In particular B=3 gives the all-future compression-error budget

\[
 \boxed{E_{\rm freeze}(X)=8/(\log X)^2+21/(2\log X).}       \tag{8}
\]

It applies to consecutive-prime blocks which are either singletons or have length
\(K\le\sqrt p/(\log p)^3\), where p is the first prime in the block. Singletons have exactly zero freezing error and may be used until the displayed length is >=1 (or whenever finer resolution is desired). This caveat matters at X=10^6: the critical weight is still below 1 there, so the asymptotic block-size rule is not advertised as a useful large finite block at that cutoff.

For a completely specified infinite recurrence one can take
\(K_j=\max(1,\lfloor\sqrt{p_{N_j}}/(\log p_{N_j})^3\rfloor)\)
and freeze the next K_j actual prime credits to the first. The infinite signed block recurrence differs from the true prime-credit prefixes by a convergent correction whose future absolute tail is bounded by (8). The blocks and primes beyond the computed head remain unevaluated; their signs are not inferred from the error bound.

At X=10^6, outward evaluation gives \(E_{\rm freeze}<0.801930\). This is far larger than the finite scalar floor 1/100. More importantly, even a smaller compression error would not control the retained signed block sum. There is no all-future positivity conclusion.

## 4. Relation to the finite head

The finite block-hull certificate in the companion note treats every prime-power event through X=10^6 and verifies its actual scalar reserve. It does not rely on (8) for that finite range. Formula (8) supplies a rigorously bounded **all-future representation error** for an explicitly defined prime-only continuation; the proper-power credit error and convexity debt are separately summable by the accepted reduction.

This is the finite-head/infinite-error separation the construction can honestly provide. The remaining unbounded number of signed block credits is still the RH-strength arithmetic obstacle.
