# Independent correlated eta payment audit

PASS, 2026-11-03. Exact correlated evaluation and full-space sharpness, not a signed-pivot proof.

For c=sqrt2, kappa/L²=(4-c cos)/(3-2c cos)=1/2+(5/2)/B. The inverse Poisson series1/B=1+2sum q^m cos yields3+5sum q^m cos. Fourier translation by+mL multiplies hat g by exp(itmL); real Parseval gives the stated2pi correlation factor. The geometric tail bound follows |C_m|<=||g||². Substituting C_m=||g||²-(1/2)||g(.+mL)-g||² gives coefficient5pi L² and kappa_max=L²(8+5sqrt2); the minimum isL²(8-5sqrt2).

Multiplying the finite Poisson polynomial by B leaves exactly1+4[q^(M+2)cos(Mtheta)-q^(M+1)cos((M+1)theta)], including M0. With N=B Lambda, the joint approximation error is bounded by4(1+q)q^(M+1)integral p²|Lambda|. Parseval for pF', pF, pF'' and Cauchy–Schwarz give the positive norm bound with factor2pi. No separate cancellation estimate or unknown pivot denominator is hidden.

The derivative L² bound implies the even spectral moments are at most2pi*64²(j!)²(8/3)^(2j). Expanding cosh and using(j!)²/(2j)!<=1 proves a positive exponential moment for epsilon<3/8; exp(epsilon|t|)<=2cosh(epsilon t). A fixed polynomial weight preserves a smaller positive exponential moment. Cauchy–Schwarz then supplies an exponential moment for the measure induced by any orthogonal even L² function. Its Fourier transform is analytic in a strip; all even moments vanish by orthogonality and odd moments by symmetry, so it vanishes identically. This proves the needed even-polynomial density for F² and for t²F².

Approximating symmetric indicators near continuous extrema of kappa yields sharp Rayleigh constants. Actual F is analytic and nonzero as a function, so each interval has positive weight, even if its center is an isolated zero or t=0 for the odd weighted formulation. Consequently kappa_min,max are optimal over the full polynomial parity spaces. This does not establish attainment by the inverse-selected orthogonal residual sequence or by a fixed finite-degree space.

Accepted: controlled translation-correlation and joint-cancellation evaluations, plus a rigorous limitation on universal parent-norm-only improvements. Degree-independent relative accuracy of the positive cost does not imply degree-independent accuracy of a small signed pivot. Uniform filtered-term domination remains open.

Final Section5 base-residual addition also PASS. Strong log-concavity gives ell(u+h)+ell(u-h)-2ell(u)<=-17h². With h=tau/2 and a midpoint change of variables, this bounds the positive base autocorrelation by exp(-17tau²/4) times its zero-lag value. Every C_m is positive, so the base cost ratio is at least3L². The weighted Gaussian series is bounded by the geometric series with r=q exp(-17L²/4)<q using m²>=m; its upper bound is strictly below the full-space kappa_max. This is only for g=psi. Derivative residuals need not retain positivity or curvature, and differentiating this bound would not prove their analogue.
