# Global theta positivity on an explicit all-degree Gaussian–Hermite cone

Status: independent analytic audit PASS for both the all-degree cone and the quadratic cone. This is not all-polynomial positivity or RH.

Let ψ be the complete theta profile, F=ψ̂, λ=2(F'²−FF''), and R the positive complete-theta modular conditional-variance kernel. Then λ=8 R̂ and R(u)>0 for all real u. The full two-theta source and every orbit cross term are retained.

Fix any s>0. Let P be any nonzero even real polynomial satisfying P(u)≥0 for all u, and set

 f(u)=P(u) exp(−u²/(2s)).

Its Fourier transform has the form f̂(t)=q(t)exp(−st²/2), where q is a real even polynomial of the same degree. Because f≥0 and is nonzero, f*f≥0 and is not zero. Plancherel/convolution therefore gives the exact signed-integral positivity

 ∫_R λ(t)|q(t)|²e^(−st²)dt =16π∫_R R(u)(f*f)(u)du >0.          (1)

This defines a concrete convex cone of even q for each s, obtained by Fourier-transforming nonnegative even Gaussian-polynomial functions. Its complex scalar multiples also satisfy (1). For example P(u)=u^(2m) gives q(t) proportional to the probabilists' Hermite polynomial He_(2m)(√s t); thus the cone contains a nonzero test at every even polynomial degree. More generally P may be any nonnegative even polynomial, including sums of polynomial squares. No complete-monotonicity or pointwise sign of λ is assumed.

There is also a simple, somewhat larger explicit quadratic cone. For 0≤r≤4/3, put q_r(t)=1−rs t². Its squared Gaussian window has Fourier transform

 √(π/s)e^(−y) P_r(y),  y=u²/(4s),
 P_r(y)=r²y²+(2r−3r²)y+1−r+3r²/4.

Its discriminant is 2r³(3r−4)≤0, so P_r≥0 for every y≥0, including the endpoint r=4/3. The nonnegative-inverse cone above contains this quadratic family only for 0≤r≤1; the Fourier-square argument adds 1<r≤4/3. Since R>0, ∫λ q_r²e^(−st²)>0. Evenness of λ and the separately proved positive t² Gaussian-window moment permit arbitrary complex linear combinations A q_r+Bt for (A,B)≠(0,0); all such forms are positive.

## Sharp limitation

The cone is not the whole polynomial space and no containment of the inverse-selected theta residuals is claimed. An independently audited auxiliary source F(t)=e^(−t²)+e³e^(−4t²) has a positive even physical profile with strict log-curvature bounded above by a negative constant, yet its signed λ is negative near t=1 and ∫t¹⁰λ(t)dt<0. A spatial rescaling makes its curvature exceed 17 while preserving the negative degree-five monomial form. Thus neither positivity of R nor the stronger curvature-based modular monotonicity implies all-degree polynomial positivity. The cone remains valid in that countermodel, establishing its strict limitation independently of RH.

The window s>0 is essential to the stated all-degree construction. Taking s→0 at fixed m does not make this cone cover arbitrary unwindowed monomials or selected polynomials. No complete monotonicity in s is asserted; the negative tenth moment in the model rules it out under the generic assumptions.
