# Independent finite oscillatory-sector audit

PASS, 2026-11-03. Actual-profile inequality with explicit finite-frequency scope.

On v>0, the complete-theta curvature bound yields Hess W>=34I for W=-log psi(r+v)-log psi(r-v)-2log v. Subtracting17r² leaves a convex function because its Hessian subtracts only diag(34,0). Its marginal exp(17r²)C(r)/2 is log-concave by the ordinary marginal theorem on a convex half-plane. The integrand vanishes quadratically at v=0 and has integrable tails. Thus (log C)''<=-34. All differentiability needed follows from the full profile bounds.

Linear tilt by2sr preserves that curvature, so the actual positive midpoint law has variance<=1/34 by Brascamp–Lieb. Its characteristic function is exactly D(s+it)/D(s), since D(z)=4 integral exp(2zr)C(r)dr. Differentiation gives m_s=D'(s)/(2D(s)); D(s)>0. Centering the characteristic function and applying cos x>=1-x²/2 gives real part>=1-2t² variance>=1-t²/17. Hence D has no zeros at any real s with |t|<sqrt17. This is an exact expectation inequality, not continuation of an order relation.

At s=0, evenness removes the phase and D(it)=F'^2-FF'' under F(t)=M(it), yielding the stated actual Lambda lower bound. The complex arithmetic factorization may be used only with its correct domain/analytic interpretation; the entire numerator formulation avoids division at zeros. The s-derivative covariance identity has factor2 and does not supply a favorable sign.

Integrating the local Lambda lower bound against the actual squared residual polynomial and subtracting the absolute high-frequency part proves the stated sufficient bound. The odd target requires its t² factor on both parts. The omitted high-frequency cost is not paid by the sector inequality, and shifting real s does not extend the original-axis window for free.

The auxiliary exp(-17r²-289r4) has curvature34+3468r² and fourth derivative12*289-24*289=-3468 at zero. Its Fourier transform is Schwartz. Nonnegative Fourier density would force a nonnegative fourth moment/inversion derivative, so it must be negative somewhere. This tests only the curvature-to-all-frequency inference, not actual theta or RH.

Accepted: genuine phase-aware finite strip control and a precisely retained residual cost. No all-frequency sign, all-degree moment positivity, or RH proof follows.
