# All-future interpolation budget for the actual prime-power reserve

> Curated mathematical source, 30 October 2026. Historical numerical cutoffs and producer statements below retain their original scope; the app module and bundled review identify the accepted current result. Internal review is not external peer review. References to original audit workspaces describe historical evidence; the publication manifest identifies which files are included here. Source and publication hashes are recorded in the manifest.

## 1. A useful quantitative form of the exact block hull

Use the original actual event reserve

\[
 R_i=J_i-F(H_i)-4+T_\infty,\qquad
 F(H)=2H[\log(H/2)-1],\quad F''(H)=2/H>0.
\]

Consider a block whose new events have log locations in [ell,u], with total positive mass D and moment Q. Set \(\mu=Q/D\in[\ell,u]\) when D>0. At prefix mass t, the exact moment bounds give

\[
 J_i-J_a\ge\max\{\ell t,Q-u(D-t)\}.
\]

The straight chord moment is \(\mu t\). Its greatest distance above the lower hull is

\[
 E_{\rm hull}
 =D\frac{(\mu-\ell)(u-\mu)}{u-\ell}
 \le\frac14D(u-\ell).                                   \tag{1}
\]

To verify the first identity, the two hull lines meet at
\(t_*=D(u-\mu)/(u-\ell)\); the maximum gap equals
\((\mu-\ell)t_*\). The upper bound is the elementary product inequality at fixed sum \((\mu-\ell)+(u-\mu)=u-\ell\).

Convexity of F yields

\[
 J_a+\mu t-F(H_a+t)-4+T_\infty
 \ge(1-t/D)R_a+(t/D)R_b.
\]

Hence every intermediate event reserve satisfies the positive estimate

\[
 \boxed{\quad R_i\ge\min(R_a,R_b)-E_{\rm hull}
                  \ge\min(R_a,R_b)-D(u-\ell)/4.\quad}     \tag{2}
\]

Empty blocks have zero loss. A singleton block needs no loss for its actual event prefixes, though the general upper bound remains valid. This is a quantitative interpolation estimate, not reserve monotonicity.

## 2. A fully specified infinite grid with summable losses

Choose a real starting point \(L\ge\log10000\) and a rational \(0<\eta\le1\). Define

\[
 t_0=L,\qquad
 t_{j+1}=t_j+h(t_j),\qquad
 h(t)=\eta e^{-t/2}/t^2.                                  \tag{3}
\]

The increasing sequence tends to infinity: a finite limit would leave a positive limiting step size. Put each future prime-power event q in the unique half-open block
\(t_j<\log q\le t_{j+1}\); any event at the initial cutoff is part of the finite head. Empty blocks are allowed. Let D_j be its actual weighted mass \(\sum\Lambda(q)/\sqrt q\), and let \(E_j\) be the exact hull loss in (1), or zero for a block with no interior event prefix.

Since \(|(\log h)'|=1/2+2/t<1\) on this range and \(h(t)\le e^{-L/2}\le1/100\), every event with r=log q in its block obeys

\[
 h(t_j)\le e^{1/100}h(r)<2\eta e^{-r/2}/r^2.
\]

Using (1), preserving all actual prime-power weights,

\[
 \sum_{j\ge0}E_j
 \le\frac14\sum_jD_jh(t_j)
 \le\frac\eta2\sum_{q>e^L}{\Lambda(q)\over q(\log q)^2}.  \tag{4}
\]

The elementary bound \(\psi(x)\le3x\), applied by Stieltjes integration to the decreasing function \(g(x)=1/[x(\log x)^2]\), gives

\[
 \sum_{q>e^L}{\Lambda(q)\over q(\log q)^2}
 \le3\left[e^Lg(e^L)+\int_{e^L}^{\infty}g(x)dx\right]
 =3(L^{-2}+L^{-1}).                                      \tag{5}
\]

Only a nonpositive lower boundary is dropped. The sum is over prime powers with the actual Lambda weight; no ordinary-prime replacement is made. Combining (4)--(5),

\[
 \boxed{\quad\sum_{j\ge0}E_j
     \le\frac{3\eta}{2}\left(\frac1L+\frac1{L^2}\right).
 \quad}                                                   \tag{6}
\]

This all-future budget uses neither a PNT error theorem nor an RH-size bound. The physical x-width of a late block is asymptotically \(\eta\sqrt x/(\log x)^2\); at the currently computed head many future blocks may initially be empty or singletons. It is a theoretical continuation rule, not a claim that all future blocks have been evaluated.

## 3. Attach the budget to the finite head without claiming propagation

For the fixed choice \(\eta=1/20\), at the certified cutoff X=10^7, (6) is less than 0.004942. At X=10^6 it is less than 0.005822. These bounds concern all future **within-block reserve interpolation losses**, not signed endpoint movement.

If an independent future theorem proved all grid endpoint reserves \(R(e^{t_j})\ge K\), then (2) and (6) would imply every future event reserve is at least

\[
 K-\frac{3\eta}{2}(L^{-1}+L^{-2}).
\]

The previously proved gamma/conjugate enclosure adds only the single uniform error \(\epsilon(H(e^L))\), since H and the admissible event index increase and epsilon decreases. The actual between-event Psi cells are bounded below by those exact event minima. This is a valid **conditional interpolation transfer**.

The required endpoint theorem is not established by the finite certificate. The future endpoint reserves retain the entire unresolved signed arithmetic. In particular, choosing a small eta merely makes the grid finer; it does not constrain its unknown endpoint values. The numerical fact that (6) is smaller than the finite 1/100 floor is not a proof of future positivity.

## 4. Why this is useful despite the remaining endpoint problem

This combines a modest exact finite head with an all-future representation whose local interpolation debt has a rigorously finite budget directly in the original prime-power recurrence. It avoids unknown kappa in the continuation, avoids dropping proper-power memory, and exposes exactly what cannot be inferred: signed movement of the coarse endpoint reserves.

The program can use the sharper exact three-point hull rather than (2) on any computed finite block. Formula (6) is a uniform tail guarantee when blocks beyond the computed head are only specified analytically. Neither replaces exact prime accounting at a node.

`check_future_hull_budget.py` checks the algebraic gap identity, scalar grid gates, and the two displayed budget values using Arb at 192 and 256 bits. It does not evaluate any uncomputed future prime or reserve. See the bundled independent review.
