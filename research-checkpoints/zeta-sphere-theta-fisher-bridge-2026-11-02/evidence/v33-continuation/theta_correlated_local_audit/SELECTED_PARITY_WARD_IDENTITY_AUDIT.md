# Independent audit: selected-parity Ward identity

Analytic PASS, 2026-11-03. No numerical computation or acquired code execution.

The actual p_n is orthogonal to degree <=n-1, so L[p_n p_(n-1)']=0. The polynomial p_n'-n p_(n-1) has degree <=n-2 and is orthogonal to p_(n-1), giving L[p_n' p_(n-1)]=n h_(n-1). Integration by parts is justified by full-theta spectral decay and gives the negative sign in (1). Since t p_(n-1)-p_n has degree <=n-1, equation (2) equals h_n with no positivity assumed for it. Differentiating Lambda yields F'F''-F F'''; adding 2ct Lambda therefore gives exactly 2c h_n=n h_(n-1)+E. Evenness of the signed measure and uniqueness of the monic prefix-selected polynomials gives their stated parity; no positive ambient measure is needed.

The proposed one-sided lower bound, if proved independently from known data, implies the strict next-pivot estimate with the displayed factor 2c. Choosing its epsilon from the unknown positive h_n would be circular. The packet correctly identifies an exact remaining target rather than claiming a bound.

At n=1 the independently accepted complete-profile curvature inequality h_1>(17/2)h_0 gives E_(1,c)>(17c-1)h_0. Thus c>=2/17 already contradicts the suggested strict absolute bound |E|<h_0, including equality in the c threshold because the underlying h ratio is strict. This is a beneficial positive contribution, not a target failure.

For F=sech t, direct differentiation gives Lambda=sech^4 t and Lambda'/Lambda=-4tanh t. Cauchy-Schwarz in that genuinely positive measure yields n h_(n-1)<=4sqrt(h_n h_(n-1)), hence beta_n>=n^2/16. Consequently E/h_(n-1)>=c n^2/8-n>n for n>16/c. This benchmark refutes necessity of a uniform fixed-c absolute-defect criterion while all pivots are positive. The Gaussian comparison also checks: Lambda=exp(-t^2), D_1=0, and beta_n=n/2.

Accepted scope: exact normalized-origin coupling of the actual parity ladders and two limitations of absolute-defect estimates. No theta-specific all-degree one-sided correlation bound, positive-shift extension, or new finite pivot is established.

## Subsequent Section 6: fixed positive shift

Separately accepted. Expanding F'(t+ia) conjugate(F(t+ia)) at zero gives imaginary part a(F''F-F'^2)+O(a^3), hence the specified normalized density tends to Lambda with no factor missing. Real-even entire symmetry gives F(-t+ia)=conjugate F(t+ia) and the corresponding derivative sign, making Lambda_a even. At every fixed positive a with positive actual lower prefix, the same t-integration by parts proves the displayed identity with frozen polynomial coefficients. Fixed-shift decay provides the boundary limits. No a derivative, limiting-polynomial argument, or uniform shift/degree bound is introduced. The earlier numerical constants remain origin-only.
