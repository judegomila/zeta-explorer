# Independent analytic audit: arithmetic refinement order

Accepted 2026-11-03. Analytic review only; no numerical ladder or acquired code execution.

The exact corrected remainder is delta_N=s(s+1) integral_N^infinity h(x)x^(-s-2)dx, with h(k+r)=r(1-r)/2. On 0<s<1, A(s)<0, so B=-A s(s+1)>0. Subtracting successive corrected approximants gives the positive symmetric cell formula in (1). The removable values B(0)=B(1)=0 preserve the fixed endpoints. Hence T_N>T_(N+1)>xi on the open real segment.

With Delta=T_N-T_(N+1) and V=T_N+T_(N+1), W=Delta V. Symmetry gives Delta'=V'=0 at 1/2. The uniform holomorphic cell expansion I_N=N^(-s-2)/12 times (1+O(1/N)), with the stated derivative bounds on its relative error, yields Delta''~B(1/2)N^(-5/2)(log N)^2/12. Since V tends to 2xi and V'' stays bounded, W''=Delta''V+Delta V'' has precisely the coefficient 2xi(1/2)B(1/2)/12. The second term is lower by (log N)^2. This proves eventual positivity immediately right of 1/2 without an explicit threshold.

For every N, W(1/2)>0 and W(1)=0 imply a negative derivative at some interior point by the mean-value theorem. Together with the preceding large-N conclusion, this excludes either direction of pointwise bridge monotonicity across all critical shifts. At fixed shift the real-even density difference has exponential moments by the finite Gamma/Dirichlet formulas. Polynomial density in L2 of its absolute measure converts either open sign interval into a corresponding finite polynomial-square test (also separately in each parity, if desired). This requires no sign assumption on an unknown next moment.

Accepted scope: failure of monotone bridge-form ordering for this specific corrected arithmetic family, despite positive real Mellin-cell value increments. The positive derivative and the exclusion of decreasing ordering are asserted only for sufficiently large N. There is no negative actual-theta target, no computed threshold, no specified polynomial degree, and no conclusion for an actual inverse-selected residual. All-degree correlated payment remains open.
