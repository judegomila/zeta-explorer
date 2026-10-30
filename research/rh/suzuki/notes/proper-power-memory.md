# Proper-power credits are summable; an ordinary-prime recurrence with exact logarithmic memory

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## Result first

Keep the audited closed reserve and event convention:

\[
 R_{n+1}-R_n=c_q-d_q,\quad
 c_q={\Lambda(q)\over\sqrt q}\log{q\over(H(q-)/2)^2},\quad
 H(q-)=\sum_{p^k<q}{\log p\over p^{k/2}}-b,
 \qquad -3<b<-2.
\]

The already proved convexity debts satisfy \(d_q\ge0\) and \(\sum d_q<\infty\). The following are new estimates for this lane:

1. **All proper-power event credits have finite absolute total:**
   \[
   \sum_{p}\sum_{k\ge2}|c_{p^k}|<\infty.                 \tag{A}
   \]
   An explicit all-future tail is supplied below. Thus the infinite positive and negative credit variations previously proved for the full recurrence both persist among ordinary-prime events alone.
2. Define the finite, absolutely convergent constant
   \[
   \kappa=-\gamma+\sum_p{\log p\over\sqrt p(p-1)}.
   \]
   At an ordinary prime \(p\), set
   \[
   \widetilde H_p=\sum_{\ell<p,\ \ell\ {\rm prime}}
             {\log\ell\over\sqrt\ell}
             +\tfrac12\log p+\kappa-b,
   \qquad
   \widetilde c_p={\log p\over\sqrt p}
             \log{p\over(\widetilde H_p/2)^2}.             \tag{B}
   \]
   Then \(\widetilde H_p>0\) for every prime, and
   \[
   \sum_p|c_p-\widetilde c_p|<\infty.                    \tag{C}
   \]
   Consequently, as the real cutoff \(X\to\infty\),
   \[
   \boxed{\quad
   R(X)-\sum_{2<p\le X}\widetilde c_p\longrightarrow C_*\in\mathbb R.
   \quad}                                                \tag{D}
   \]
   This is unconditional even though neither term in the difference is known to remain bounded.
3. Dropping proper powers from the predictor **without** their logarithmic memory creates a false favorable drift. If \(H_p^{(0)}=\sum_{\ell<p}\log\ell/\sqrt\ell-b\) and \(c_p^{(0)}\) uses that predictor, then
   \[
   \sum_{2<p\le X}(c_p^{(0)}-c_p)
      ={(\log X)^2\over4}+\kappa\log X+C_0+o(1).          \tag{E}
   \]

The difficult all-scale arithmetic remains the signed ordinary-prime prefixes in (D). This removes lower-order sectors at a proved finite total cost; it does **not** change the square-root cancellation obstacle into an easier proven estimate.

## 1. Inputs

The sole quantitative prime-distribution input is the unconditional theorem of Fiori--Kadiri--Swidinsky, [Corollary 1.4, v3](https://arxiv.org/html/2204.02588v3#S1.SS2), re-opened directly on 30 October:

\[
 |\psi(y)-y|\le A y(\log y)^{3/2}e^{-c\sqrt{\log y}},
 \quad y>2,\qquad A=9.22022,\ c=0.8476836.                 \tag{1}
\]

Their theorem uses published rigorous finite-height computation; no such computation is repeated or made a new assumption. No RH-size prime error is imported. The elementary project input \(\psi(y)\le3y\) is also used. Euler's constant and the standard Laurent expansion of zeta at 1 enter only to identify one convergent constant.

## 2. A uniform relative predictor estimate

Put \(r=\log q\), \(E(y)=\psi(y)-y\), and \(a=59/100\). Exact partial summation gives

\[
 S(q)-2\sqrt q=-1+{E(q)\over\sqrt q}
                  +\tfrac12\int_1^q E(v)v^{-3/2}\,dv.
\]

At a prime-power event use \(S(q-)=S(q)-\Lambda(q)/\sqrt q\). Split the integral at \(\sqrt q\). Below the split, \(|E(v)|\le2v\); above it, use (1), \(\log v\le r\), and \(\log v\ge r/2\). Since \(|1+b|<2\) and \(\Lambda(q)\le r\), this gives, for \(r\ge512\),

\[
 \left|{H(q-)\over2\sqrt q}-1\right|
 \le A r^{3/2}e^{-c\sqrt{r/2}}
           +e^{-r/4}+e^{-r/2}+\tfrac12re^{-r}
 \le 10r^{3/2}e^{-a\sqrt r}+2e^{-r/4}=:\Delta(r).          \tag{2}
\]

Here \(c/\sqrt2>a\). Each term in the final envelope decreases on this range, and outward-rounded evaluation gives \(\Delta(512)<0.185<1/4\). Also \(2e^{-r/4}\le r^{3/2}e^{-a\sqrt r}\) on the range; its ratio is decreasing and is already tiny at 512. Therefore

\[
 \left|\log{q\over(H(q-)/2)^2}\right|
 \le {8\over3}\Delta(r)
 \le30r^{3/2}e^{-a\sqrt r}.                              \tag{3}
\]

The large numerical onset is intentional; no useful finite-range optimization or extensive prime scan is claimed. The derivation is uniform in real r and uses only (1) and the elementary bound.

## 3. Explicit proper-power event-credit tail

Let \(L\ge512\), \(s=\sqrt L\). For squares, (3), monotonicity, and \(\theta(y)\le3y\) give

\[
 \sum_{p^2\ge e^L}|c_{p^2}|
 \le90e^{-as}\left[
 s^3+{s^4\over a}+{4s^3\over a^2}+{12s^2\over a^3}
                 +{24s\over a^4}+{24\over a^5}\right]
 =:T_2(L).                                                \tag{4}
\]

For completeness the endpoint-inclusive Stieltjes bound behind (4) is

\[
 \int_{[Y,\infty)}{f(2\log y)\over y}\,d\theta(y)
 \le3f(2\log Y)+\tfrac32\int_{2\log Y}^{\infty}f(v)\,dv,
 \quad f(v)=30v^{3/2}e^{-a\sqrt v},\quad Y=e^{L/2}.
\]

The lower boundary is \(-\theta(Y-)f(2\log Y)/Y\le0\), not an omitted positive atom. The displayed upper bound follows by dropping it and using \(-g'\ge0\) for \(g(y)=f(2\log y)/y\). The integral is an elementary incomplete-gamma polynomial, yielding (4).

For all exponents \(k\ge3\), let

\[
 R_3(x)=\sum_{p^k\le x,\ k\ge3}\log p
 \le{x^{1/3}(\log x)^2\over\log2}.
\]

This simply counts at most \(\log x/\log2\) exponents and at most \(x^{1/3}\) integer bases per exponent. The elementary predictor bounds \(2<H(q-)<6\sqrt q\) imply \(1<(H/2)^2<9q\). Thus for \(\log q\ge512\), the logarithm in the credit has absolute value at most \(\log q\). Stieltjes integration against the decreasing \((\log x)/\sqrt x\), retaining the correct lower endpoint, now gives

\[
 \sum_{p^k\ge e^L,\ k\ge3}|c_{p^k}|
 \le {3\over\log2}e^{-L/6}
              (L^3+18L^2+216L+1296)=:T_3(L).             \tag{5}
\]

Indeed it is enough to integrate
\((2\log2)^{-1}\int_{e^L}^\infty x^{-7/6}(\log x)^3dx\).
Hence

\[
 \boxed{\ \sum_{p^k\ge e^L,\ k\ge2}|c_{p^k}|
             \le T_2(L)+T_3(L)
             =O(L^2e^{-0.59\sqrt L}).\ }                 \tag{6}
\]

The finitely many earlier events have finite credits. This proves (A). Notice that no sign of their individual credits was asserted.

## 4. Exact proper-power memory: even exponents expose the constant

Write the accumulated proper-power memory

\[
 B(r)=\sum_{p^k\le e^r,\ k\ge2}{\log p\over p^{k/2}}.
\]

Split **even** and **odd** exponents, rather than approximating every power separately. Exactly,

\[
 B(r)=\sum_{n\le e^{r/2}}{\Lambda(n)\over n}
       +\sum_{p^k\le e^r,\ k\ge3\ {\rm odd}}
                       {\log p\over p^{k/2}}.             \tag{7}
\]

The complete odd-exponent sum is the absolutely convergent series

\[
 \sum_{p}\sum_{j\ge1}{\log p\over p^{(2j+1)/2}}
       =\sum_p{\log p\over\sqrt p(p-1)}.                  \tag{8}
\]

For \(A_1(y)=\sum_{n\le y}\Lambda(n)/n\), exact partial summation gives

\[
 A_1(y)=\log y+C+{E(y)\over y}
                      -\int_y^\infty{E(v)\over v^2}dv,
 \quad C=1+\int_1^\infty{E(v)\over v^2}dv.
\]

The integral converges by (1). To identify C, Abel summation implies
\(-\zeta'/\zeta(1+\varepsilon)=1/\varepsilon+C+o(1)\).
The Laurent expansion gives \(1/\varepsilon-\gamma+O(\varepsilon)\), so \(C=-\gamma\). This is a constant-term identity in the absolutely convergent half-plane, not a use of zeta zeros.

Define, for \(v>0\),

\[
 J_c(v)=v^{3/2}e^{-c\sqrt v}
                       +\int_v^\infty u^{3/2}e^{-c\sqrt u}du,
\]

\[
 B_0(r)=A J_c(r/2)
       +{3\over\log2}e^{-r/6}(r^2+12r+72).                \tag{9}
\]

Both integrals are elementary finite-polynomial incomplete-gamma expressions. The same \(R_3\) count bounds the missing odd tail, now integrating the weight \(x^{-1/2}\). Equations (7)--(9) prove, for all \(r\ge512\),

\[
 \boxed{\quad |B(r)-r/2-\kappa|\le B_0(r)
                    =O(r^2e^{-0.59\sqrt r}).\quad}        \tag{10}
\]

The actual exponential in the first term is \(c/\sqrt2>0.59\). In particular, the proper-power memory grows like \(r/2\) even though its event credits have finite total variation. These are different objects.

## 5. Removing all proper powers from the predictor at finite total cost

At an ordinary prime \(p\), no proper power equals p, so the exact identity is

\[
 H(p-)=\sum_{\ell<p}{\log\ell\over\sqrt\ell}-b+B(\log p).
                                                               \tag{11}
\]

Thus \(H(p-)-\widetilde H_p=B(\log p)-(\log p)/2-\kappa\).
Since \(0<\gamma<1\) and the series in (8) is positive, \(\kappa>-1\). Therefore (B) is strictly positive even at the first prime, without an asymptotic qualification.

For the tail estimates both predictors are at least \(\sqrt p\) when \(r=\log p\ge512\). Here is an elementary uniform check. The proper-power count
\(R_2(x)\le\sqrt x(\log x)^2/\log2\), followed by partial summation, gives \(B(r)\le r^3\) for \(r\ge6\). Equation (2) gives \(H(p-)\ge(3/2)\sqrt p\). The scalar inequality \(e^{r/2}\ge4r^3\) holds at 512 and persists because its logarithmic derivative is \(1/2-3/r>0\). Consequently \(H_p^{(0)}\ge(5/4)\sqrt p\) and \(\widetilde H_p=H_p^{(0)}+r/2+\kappa\ge\sqrt p\).

The mean-value theorem for log and (10) therefore yield

\[
 |c_p-\widetilde c_p|
   \le {2\log p\over p}B_0(\log p),\qquad\log p\ge512.    \tag{12}
\]

The function \(B_0\) decreases on this range: \(J_c'=f'-f<0\), and the other derivative is a negative multiple of \(r^2e^{-r/6}\). Stieltjes integration with \(\theta(y)\le3y\), including an endpoint prime if present, gives the explicit bound

\[
 \boxed{\quad
 \sum_{p\ge e^L}|c_p-\widetilde c_p|
  \le6\left[B_0(L)+\int_L^\infty B_0(r)dr\right]
  =O(L^{5/2}e^{-0.59\sqrt L}),\quad L\ge512.
 \quad}                                                   \tag{13}
\]

This proves (C). Combine (6), (13), and the already proved summability of debts with exact event telescoping to obtain (D). A bound on its convergence error is the sum of these two explicit tails and the previous closed-debt tail bound at the relevant H value. The displayed arithmetic formula may also define a p=2 credit, but (D) starts after p=2, exactly as the audited post-first-event recurrence; any such initial term is absorbed into the finite constant.

## 6. Why naive deletion manufactures a quadratic drift

Let \(H_p^{(0)}\) and \(c_p^{(0)}\) be as in (E). Since \(B(r)\ge0\),

\[
 c_p^{(0)}-c_p
   ={2\log p\over\sqrt p}
                \log\left(1+{B(r)\over H_p^{(0)}}\right)\ge0.
                                                               \tag{14}
\]

Equations (2), (10), and the elementary \(B(r)\le r^3\) bound show

\[
 c_p^{(0)}-c_p
   ={\log p\over p}(r/2+\kappa)+e_p,
 \qquad \sum_p|e_p|<\infty.                               \tag{15}
\]

Details of the error statement: the log Taylor remainder is
\(O((\log p)r^6/p^{3/2})\); replacing \(2\sqrt p/H_p^{(0)}\) by 1 costs
\(O((\log p)/p\cdot r^3[\Delta(r)+r^3e^{-r/2}])\); replacing B by its main term costs (12). All three sums converge by \(\theta(y)\le3y\) and the displayed exponentially decaying log-scale envelopes.

The unconditional PNT error (1) and the elementary proper-power count imply the same integrable relative error for theta, with an additional exponentially decaying term. Partial summation therefore gives finite constants \(C_\theta,C_1\) such that

\[
 \sum_{p\le X}{\log p\over p}=\log X+C_\theta+o(1),\qquad
 \sum_{p\le X}{(\log p)^2\over p}
                  ={(\log X)^2\over2}+C_1+o(1).
\]

For the second identity the stronger tail furnished by (1) makes \(r\) times the first remainder tend to zero and its log-scale integral converge. Summing (15) proves (E). Thus a prime-only numerical or analytic recurrence that forgets \(r/2+\kappa\) can look increasingly favorable for an entirely deterministic, incorrect reason.

## 7. What remains, and the next storage test

By the previously independently audited oscillation theorem, both Jordan sums of the full credits diverge. Removing (A) and perturbing by (C) preserves both divergences for \(\widetilde c_p\). A successful ordinary-prime storage must still compare two divergent prefixes, not bound all negative events separately.

The new reduction uses actual arithmetic and proves finite total errors; it is not merely another sufficient condition. Nevertheless its remaining signed prefix is no weaker a global obstacle than the original recurrence: (D) and the prior Landau bridge make a finite one-sided bound RH-strength. The logarithmic memory is now explicit, so a next state-dependent candidate can be tested without separately carrying square/odd-power events.

A bounded storage made only from a PNT-normalized, exponentially smoothed relative theta error would tend to a limit under (1). If it represented the remaining credits up to a convergent cumulative remainder, (D) would force R to converge, contradicting the already proved actual reserve oscillation. Thus that simple conservative architecture cannot work. A one-sided-prefix remainder is not excluded, but bounding it is the original signed arithmetic task, not a consequence of small relative error. The earlier positive-filter and convex-entropy obstructions still apply.

## Reproducibility and scope

`check_prime_only_algebra.py` checks the exact even/odd generating-function identity, the tail antiderivative identities, and the symbolic drift coefficient; it also uses 192- and 256-bit Arb to prove the finitely many scalar onset inequalities. It does not enumerate primes, certify a new finite positivity range, or test an all-scale signed conjecture numerically. The general estimates and all-real-scale extension are analytic above. The bundled independent review determines the accepted scope.
