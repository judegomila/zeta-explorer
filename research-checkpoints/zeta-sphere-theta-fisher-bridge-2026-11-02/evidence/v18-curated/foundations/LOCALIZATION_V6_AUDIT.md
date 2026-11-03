# Independent review and strengthening: relative localization v6

2 November 2026. Reviewed hierarchy/localization_v6/RELATIVE_LOCALIZATION.md. Exact finite-dimensional Schur criterion, fixed-boundary asymptotics, averaged localization lemma and polynomial example PASS.

## Fixed-boundary obstruction, including uniform small-shift strengthening

For fixed A>1/2, absolute Euler convergence on sigma_A=1/2+A and Stirling give |xi(sigma_A+it)|^2 comparable to exp(-pi|t|/2)|t|^(sigma_A+3), while Re(xi'/xi)=.5log|t|+O_A(1). Thus W_A is comparable to exp(-pi|t|/2)|t|^(7/2+A)log|t|. Restricting the positive Poisson convolution to |s-t|<=1 gives the stated lower bound for B_a. The interior product |xi xi'| is at most exp(-pi|t|/2)|t|^(4+epsilon) for every epsilon>0, without division by zeta. All exponents check.

There is a useful stronger conclusion, uniform in the complete small-shift range. With F(w)=xi(1/2+w), W_0(t)=0 and

W_a(t)/a = integral_0^1 ( |F'(sa+it)|^2 + Re(F''(sa+it) conjugate(F(sa+it))) ) ds.

Uniform derivative convexity for zeta through order two and Stirling give

sup_(0<a<=1/2) |W_a(t)|/a <= C_epsilon exp(-pi|t|/2)|t|^(4+epsilon).

For fixed A>1/2, P_A^upper(a,u)/a has a strictly positive minimum on 0<=a<=1/2, |u|<=1, using its removable value at a=0. Hence

inf_(0<a<=1/2) B_a(t)/a >= c_A exp(-pi|t|/2)|t|^(7/2+A)log|t|.

Consequently, for every 0<epsilon<A-1/2,

sup_(0<a<=1/2) |W_a(t)/B_a(t)| <= C_(A,epsilon) |t|^(-(A-1/2-epsilon))/log|t| -> 0.

Thus K_a/B_a approaches one uniformly down to a=0. A fixed strict contraction q<1 is impossible for this particular boundary transfer, even if RH holds. No assertion is made at A=1/2; its polynomial advantage disappears. Constants may depend on A and epsilon, not on a.

Classical derivative input was checked directly in Daodao Yang, “Extreme values of derivatives of the Riemann zeta function”, Lemma 2: https://pmc.ncbi.nlm.nih.gov/articles/PMC10234456/ . The uniform conclusion above is an independent deduction from that classical estimate, the exact Green representation and Euler/Stirling bounds, not a theorem attributed to that paper.

## Averaged localization

For a<=A/2, |P'|<=pi P/A is correct: the denominator has nonnegative cosine term. Thus |B'|<=cB, c=pi/A. If r=K/B is L-Lipschitz on [t0-h,t0+h], its weighted average gives r(t0)<=1-delta+L d_B. Writing w(u)=B(t0+u)+B(t0-u) gives w'<=cw; w(u)e^(-cu) decreases. The normalized w-density is stochastically dominated by normalized e^(cu), proving

d_B <= h/(1-exp(-ch))-1/c = h/2+ch^2/12+O(c^3h^4).

This is a valid constructive sufficient local criterion, conditional on the averaged cancellation and derivative bounds. Neither bound is supplied globally by a small absolute tail.

## Other checks and scope

The signed Schur complement uses D=-K_NN>=0 and range(K_NR) contained in range(D); replacing it by ker(B) contained in ker(K) is invalid unless K is PSD. The displayed formula is correct.

For f(z)=z^2+b^2, the stated W, interval averages, harmonic boundary transfer B, and K=(8/3)a(A^2-a^2) agree by direct differentiation and boundary matching. They correctly disprove propagation from fixed-resolution average positivity.

No global RH sign claim follows. The uniform obstruction concerns one strict-gap strategy, not q=1, variable gaps, the endpoint boundary, or alternative arithmetic groupings.
