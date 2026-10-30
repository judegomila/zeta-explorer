# All-real finite Suzuki positivity through X = 10⁷

**Status: accepted finite scalar certificate.** This concerns the constant-box direction only. It is not whole-even-form positivity, an all-scale arithmetic bound, or RH.

Let \(\Psi,M_n,R_n,H_n,\epsilon\) have the definitions in the recurrence module and put \(a_0=\log(5/4)\).

## Certified theorem

\[
\Psi(0)=0,\qquad
\Psi(r)\ge\frac{r}{100\log(5/4)}\quad(0\le r\le a_0),\qquad
\Psi(r)>\frac1{100}\quad(a_0\le r\le\log10^7).
\]
Thus \(\Psi(r)>0\) for every real \(0<r\le\log10^7\), not merely sampled event points. No positive constant floor is asserted at zero.

## 1. Exact block-prefix hull

Set \(F(H)=2H[\log(H/2)-1]\). For an event block \(a<b\), define
\[
D=S_b-S_a,\quad Q=J_b-J_a,\quad\ell=\log q_{a+1},\quad u=\log q_b.
\]
At an intermediate prefix \(i\), let \(t=S_i-S_a\). Positivity and ordering of the actual weights give
\[
J_i-J_a\ge\ell t,\qquad J_i-J_a\ge Q-u(D-t).
\]
If there are at least two new events, \(\ell<Q/D<u\) and
\[
t_*=(uD-Q)/(u-\ell)\in(0,D).
\]
On each side of \(t_*\), the function
\[
J_a+\max\{\ell t,Q-u(D-t)\}-F(H_a+t)-4+T_\infty
\]
is concave because \(F''(H)=2/H>0\). Its minimum is attained at one of \(0,t_*,D\). Therefore
\[
R_i\ge\min\{R_a,R_b,J_a+\ell t_*-F(H_a+t_*)-4+T_\infty\}.
\]
Subtract the decreasing enclosure error \(\epsilon(H_a)\) to get a common lower bound for every exact reserve \(M_i\). Single-transition blocks use only the endpoints. No reserve monotonicity is assumed.

## 2. Finite outward computation

An integer sieve enumerates all records \((q,p,k)\) with \(q=p^k\le10^7\). The weight is \(\log p/\sqrt q\), not \(k\log p/\sqrt q\). Arb accumulates every weighted count and first moment. Blocks pass only if **every** lower enclosure is strictly above the predetermined rational \(1/100\); a failed block is bisected and a failed singleton aborts.

| Quantity | Verified value |
|---|---:|
| Ordinary primes | 664,579 |
| Distinct prime-power events | 665,134 |
| Accepted blocks | 2,732 |
| Distinct endpoint evaluations | 2,733 |
| Crossing evaluations, including rejected parents | 2,865 |
| Last event | 9,999,991 |

Both 192-bit and 256-bit runs pass. An independently written 384-bit audit uses a linear least-prime-factor sieve, direct integer prime-power classification, direct \(\log q\), and **every-event** reserve tests without the coarse hull; all 665,134 tests pass. It reproduces the event digest

`4c24e9f9cdf8411292143f0e81281da86dabcf08ad0c20c6064bcdffd3da06c1`.

On each real cell \([\log q_n,\log q_{n+1}]\), \(\Psi\ge M_n\), so the certificate covers every interevent point. The final held cell reaches \(\log10^7\). The smallest accepted block test is about 0.01048536; this is **not** identified with the actual minimum of \(\Psi\).

## 3. Closing the origin interval

Before the first event,
\[
\Psi(r)=4e^{r/2}+br-4+\sum_{k\ge1}\frac{1-e^{-(2k+1/2)r}}{(2k+1/2)^2}.
\]
Dominated convergence gives \(\Psi(0)=0\). For \(0<r\le a_0\), the sign of
\[
\Psi''(r)=e^{r/2}-\frac{e^{-5r/2}}{1-e^{-2r}}
\]
is the sign of \(e^{3r}-e^r-1<0\); at \(e^r=5/4\), that polynomial equals \(-19/64\). Thus \(\Psi\) is concave on \([0,a_0]\), including zero by continuity. Retaining 128 positive series terms proves \(\Psi(a_0)>1/100\), so the chord yields the linear lower bound. On \([a_0,\log2]\), 256 closed Arb cells cover every real argument; the same positive truncation is above \(1/100\) on every cell. The omitted tail is nonnegative.

## 4. Reproduction and limits

The package includes the coarse checker, origin checker, independent direct-event checker, and receipts. `REPRODUCE.md` gives the exact commands and distinguishes clean-package replays from the historical audit. python-flint/Arb, not floating-point sampling, makes the sign decisions.

A separate all-future interpolation lemma bounds representation losses. It does not bound future endpoint reserves or signed credits. In particular, a future loss budget smaller than 0.01 cannot by itself propagate this finite floor to infinity. The earlier 10⁴ and 10⁶ ranges are superseded **as finite coverage**, not invalidated.
