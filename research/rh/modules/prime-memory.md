# Prime-only renormalization, logarithmic memory, and finite variation

**Status: accepted scoped arithmetic estimates.** The remaining signed prime-credit prefix is **open**. Summable approximation costs do not establish its lower bound.

Use the pre-event recurrence \(\Delta R=c_q-d_q\) from the Suzuki module. All statements concern the actual von Mangoldt weights, not a random-prime or positive-density surrogate.

## 1. Proper powers have summable credits but unbounded memory

Define
\[
B(r)=\sum_{p^k\le e^r,\ k\ge2}\frac{\log p}{p^{k/2}},\qquad
\kappa=-\gamma+\sum_p\frac{\log p}{\sqrt p(p-1)}.
\]
The second series converges absolutely. The exact even/odd exponent split is
\[
B(r)=\sum_{n\le e^{r/2}}\frac{\Lambda(n)}n+
\sum_{p^k\le e^r,\ k\ge3\text{ odd}}\frac{\log p}{p^{k/2}}.
\]
**Theorem.** Unconditionally,
\[
\sum_p\sum_{k\ge2}|c_{p^k}|<\infty,\qquad
B(r)=r/2+\kappa+O(r^2e^{-0.59\sqrt r}).
\]
These are different quantities: removing proper-power **credits** costs a convergent correction, but removing their predictor **memory** without a counterterm is invalid.

The quantitative input is the unconditional estimate
\[
|\psi(x)-x|\le9.22022x(\log x)^{3/2}e^{-0.8476836\sqrt{\log x}},\qquad x>2,
\]
from [Fiori–Kadiri–Swidinsky, Corollary 1.4](https://arxiv.org/html/2204.02588v3#S1.SS2). That theorem uses published finite-height computation; this package does not independently rerun that external computation or assume RH.

### Derivation

Partial summation, with \(E(x)=\psi(x)-x\), gives exactly
\[
S(x)-2\sqrt x=-1+E(x)/\sqrt x+\tfrac12\int_1^xE(t)t^{-3/2}\,dt.
\]
Splitting at \(\sqrt x\) and using \(\psi(x)\le3x\) on the initial part yields, at an event \(r=\log q\ge512\),
\[
\left|\frac{H(q-)}{2\sqrt q}-1\right|
\le\Delta(r):=10r^{3/2}e^{-0.59\sqrt r}+2e^{-r/4}<\tfrac14.
\]
Hence \(|\log(q/(H/2)^2)|\le30r^{3/2}e^{-0.59\sqrt r}\). Stieltjes integration against \(\theta(x)\le3x\) makes the square-credit tail integrable; counting higher powers with
\(\sum_{p^k\le x,k\ge3}\log p\le x^{1/3}(\log x)^2/\log2\)
handles all \(k\ge3\). Explicit finite-polynomial tail constants appear in the full source note.

For memory, partial summation gives
\[
\sum_{n\le y}\frac{\Lambda(n)}n=\log y+C+E(y)/y-\int_y^\infty E(t)t^{-2}\,dt.
\]
The displayed unconditional error is integrable. Abel summation and the Laurent expansion of \(-\zeta'/\zeta\) at 1 identify \(C=-\gamma\). The full odd-exponent series equals \(\sum_p\log p/[\sqrt p(p-1)]\); its omitted tail is exponentially small in \(r\). This proves the memory formula.

## 2. Corrected ordinary-prime recurrence

At an ordinary prime \(p\), set
\[
\widetilde H_p=\sum_{\ell<p,\ \ell\text{ prime}}\frac{\log\ell}{\sqrt\ell}
 +\frac12\log p+\kappa-b,\qquad
\widetilde c_p=\frac{\log p}{\sqrt p}\log\frac{p}{(\widetilde H_p/2)^2}.
\]
Since \(\kappa>-1\) and \(-b>2\), every predictor is positive. The exact discrepancy from \(H(p-)\) is \(B(\log p)-\tfrac12\log p-\kappa\). On the tail both predictors exceed \(\sqrt p\), so the mean-value theorem for logarithms gives a summable error
\[
\sum_p|c_p-\widetilde c_p|<\infty.
\]
Combining this with summable proper-power credits and positive debts proves
\[
R(X)-\sum_{2<p\le X}\widetilde c_p\longrightarrow C_*\in\mathbb R.
\]
No assertion that either term is bounded is hidden in this convergence-of-the-difference statement.

The naive predictor \(H_p^{(0)}=\sum_{\ell<p}\log\ell/\sqrt\ell-b\) instead manufactures a positive drift:
\[
\sum_{2<p\le X}(c_p^{(0)}-c_p)
=\tfrac14(\log X)^2+\kappa\log X+C_0+o(1).
\]
Indeed the exact difference is \(2(\log p)/\sqrt p\,\log(1+B/H_p^{(0)})\); Taylor expansion has absolutely summable remainder, and its leading term is \((\log p)/p[(\log p)/2+\kappa]\). Partial summation gives the two displayed polynomial terms. Favorable numerics from deleting this memory would test the wrong recurrence.

## 3. Actual credit variation and block freezing

Let \(p_n>2\) enumerate ordinary primes and \(c_n=\widetilde c_{p_n}\). For \(X=e^L\), \(L\ge512\),
\[
\sum_{p_n\ge X}|c_{n+1}-c_n|\le(23L+34)e^{-L/2}.
\]
For any \(B>2\) and \(L\ge\max(512,2B)\),
\[
\sum_{p_n\ge X}\frac{\sqrt{p_n}}{(\log p_n)^B}|c_{n+1}-c_n|
\le6L^{1-B}+\frac{17}{2(B-2)}L^{2-B}.
\]
To prove these, use the right-continuous state
\[
H(r)=\sum_{p\le e^r}\frac{\log p}{\sqrt p}+r/2+\kappa-b,\quad
f(r)=re^{-r/2}[r-2\log(H(r)/2)].
\]
On the specified tail, \(e^{r/2}\le H(r\pm)\le7e^{r/2}\), so the logarithmic factor has absolute value at most 3. Between primes \(H'=1/2\), whence
\[
|f'(r)|\le\tfrac52re^{-r/2}.
\]
At a prime, with pre-event \(H\) and \(w=re^{-r/2}\),
\[
f(r+)-f(r-)=-2w\log(1+w/H),\quad |\Delta f|\le2r^2e^{-3r/2}.
\]
Since \(c_n=f(r_n-)\), its next difference is the jump at \(r_n\) plus the integral to \(r_{n+1}\). Sum these disjoint intervals with the increasing weight \(e^{r/2}/r^B\). The continuous integral contributes \(5L^{2-B}/[2(B-2)]\); Stieltjes integration of the jump measure contributes at most \(6L^{1-B}+6L^{2-B}/(B-2)\). This proves the critical bound.

A consecutive-prime block beginning at \(p_N\), of length \(K\le\sqrt{p_N}/(\log p_N)^B\), may freeze every credit to \(c_N\). Telescoping bounds its total absolute error by \(K\) times its internal variation. Summing blocks gives the same finite bound. Unfinished frozen blocks are harmless because \(K|c_N|\le3(\log p_N)^{1-B}\to0\).

The tail must start at a **fresh block head**; an arbitrary cut through an existing block adds a carry error. This result is finite total **variation/freezing error**, not absolute summability of the credits or a lower bound for their signed block sum. Fixed-index parity pairing captures almost equal, not opposite, credits and does not solve the cancellation problem.

## Evidence boundaries

The source and independent audit are supplied for both the memory theorem and variation theorem, with original-to-published hashes. The prime-only audit restricts a related storage no-go to potentials that actually converge; it does not exclude arbitrary bounded nonlinear storage. The variation audit independently verifies the jump identity, which the original producer algebra receipt did not itself test. These qualifications are part of the accepted scope.
