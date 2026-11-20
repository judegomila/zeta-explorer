# Whole-line first-theta positive reference: independent audit

2 November 2026. Analytic PASS for the precise reference D_a, for 0<a<=1/2 and its normalized a=0 limit. No positive comparison with the complete modular bridge is proved.

## Constants and transforms

Expanding the first-summand product gives 64 pi^4 exp(9h) exp(-lambda cosh(2v)) [1-6cosh(2v)/lambda+9/lambda²], where lambda=2pi exp(2h). The Jacobian d h=d lambda/(2lambda) yields exactly A=32pi^4(2pi)^(-9/2) and q=9/2+s. Combining the Gamma integrals gives coefficient 9-6(q-2)=21-6q. Convergence requires q>2, satisfied on the claimed strip.

Independently deriving the beta Fourier transform of sech(2v)^p gives 2^(p-2)|Gamma(p/2+ik/4)|²/Gamma(p). Applying it to the two powers and the Gamma recurrence reduces their prefactor to (q-5)²+k²/4. Thus equation (2), including the Fourier convention and powers of two, checks. Differentiating I_s introduces 2h; the sinh difference and initial half factor therefore give precisely Dhat=A[f'(a)-f'(-a)]/8.

The whole negative-h extension is essential. Replacing it by even reflection or truncating lambda below at 2pi invalidates these formulas. Absolute convergence with derivatives in s follows from exponential decay at negative infinity and doubly exponential decay at positive infinity; Fourier interchange also follows by the original two-variable linear change of coordinates.

## Convexity for every frequency

The logarithmic derivative B=-log pi+Re digamma(x+iy) and T=(1/2)Re trigamma(x+iy), with x=(q-2)/2 and y=k/4, are correct. The polynomial derivatives give f''/g=(B²+T)(r²+4y²)+4rB+2 exactly.

For x=1 the reflection/recurrence identity gives 2 Re trigamma(1+iy)=1/y²-pi²/sinh²(pi y)>0, with the positive limiting value at zero. Its real part is harmonic in x>1. Uniform decay follows directly from the absolute series bound 1/(x²+y²)+integral_0^infinity dt/((x+t)²+y²)=O(1/|x+iy|), uniformly x>=1. Minimum principles on expanding half-disks give nonnegativity inside, and the strong principle gives strict positivity. No unjustified monotonicity in x is needed.

For y²<=1/2, the digamma series difference is bounded by y² sum(n+x)^(-3). Monotonicity of the real digamma on positive arguments and the stated elementary constants yield Re digamma<19/24<log pi. Hence B>0 implies P=r²+4y²>2. When B<=0, r<=0 makes all terms nonnegative and the final 2 strict. When B>0, completing the square yields P(B+2r/P)²+2-4r²/P>0, since |r|<=1. The endpoint r=y=0 is separately harmless: f''=2g>0.

Consequently f' is strictly increasing throughout s in [-1/2,1/2], and the reference Fourier density is strictly positive for every real k. Its Gamma factors have exponential frequency decay, including polynomial/log factors from differentiation. This proves strict positivity of finite distinct-node and finite confluent Grams via linearly independent exponential-polynomials. The normalized zero-shift density is A f''(0)/4>0.

## Fixed cosh fibers versus their mixtures

The claimed non-PD obstruction for each fixed lambda is valid: its signed-moment generating function exp(lambda(1-cos t)) is entire and returns to 1 at 2pi, whereas nonnegative even Taylor coefficients and its positive second coefficient would force a value greater than 1. The Gamma mixture equals sech(2v)^p and has the stated strictly positive Fourier density. These facts illustrate repair by integration, not positivity of individual fibers.

## Scope and sources

The exact remainder E_a includes higher theta terms, all their cross terms, and the negative-h modular closure correction. No bound E_a >= -D_a or degree-uniform relative contraction has been established. Reference positivity alone therefore does not prove positivity of C_a or RH.

Primary identity references checked: NIST DLMF https://dlmf.nist.gov/5.15 (polygamma series, recurrence, reflection), and https://dlmf.nist.gov/5.9 (Gamma/digamma integral representations). The transforms and convexity inequalities above were independently derived. Numerical checks are sanity diagnostics, not the proof. No acquired executable code was run.
