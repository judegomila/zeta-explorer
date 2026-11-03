# Independent audit: root-inverse Volterra trace

Analytic PASS for n>=1 in the ambient obstruction, 2026-11-03. No numerical run or acquired code execution. The n=0 deletion sum is empty and is not part of the obstruction.

The equation (iD-r)h=g is h'+irh=-ig, yielding exactly the two stated primitive formulas. Their equality uses G(r)=0 and not a bounded ambient resolvent. Complete theta residuals lie in this range. Squaring the appropriate right or left primitive, integrating the half-line, and interchanging the absolutely integrable sums gives min(v,w) with phase exp(ir sigma(v-w)), hence precisely D_R(sigma(v-w)). Spectral deletion cost is 2pi times this physical sum by the stated Fourier convention. The actual comparison constant is 2 in front of ||ug||^2.

Half-line integration by parts gives ||H||^2=2Re integral u exp(iru)g conjugate H and therefore ||H||<=2||ug||. The corresponding squared bound is 4 per root, or 4n after summation. The actual range condition removes the opposite-end constant primitive. The calculation does not improve the constant using root correlations or theta arithmetic.

For L>2pi the Dirichlet Rayleigh infimum pi^2/L^2 is below 1/4, so a compactly supported smooth chi with the stated strict inequality exists. The log change x=epsilon exp(y) gives derivative energy 2 integral |chi'+chi/2|^2 and potential integral |chi|^2. The integrated cross term vanishes. Thus their difference is exactly 2||chi'||^2-||chi||^2/2, independent of epsilon and negative. The norm is epsilon^2 integral exp(2y)|chi|^2. Other root potentials are nonpositive contributions; sufficiently small support avoids all roots. Normalization therefore gives unbounded negative energy.

For the symmetric actual root set, reflected disjoint copies have either parity and retain the energy and range conditions. The inverse Fourier transform of a smooth compactly supported test is Schwartz. Dividing by p is harmless because support avoids every root. Hermite partial sums converge in Schwartz topology; multiplication by p, differentiation, and multiplication by each q_j preserve convergence in the relevant L2 norms. Thus entire polynomial-times-Gaussian tests divisible by p can also have negative energy, with parity retained. They are not the original theta transform or its inverse-selected residual vector.

Accepted scope: an exact nonlocal formulation for the actual theta deletion trace, an unconditional but insufficient 4n estimate, and failure of the desired ambient norm inequality even using actual roots. This does not exclude a theta-specific arithmetic inequality on the much smaller actual residual class, nor does it establish negativity of an unknown theta pivot.

## Subsequent Section 4: original theta polynomial cyclic space

Separately accepted 2026-11-03. The compact negative test can be chosen sufficiently near a selected root but away from it and from all zeros of F: the zeros of a nonzero entire function are isolated, even if the selected root itself is one. Hence division by pF on the support, followed by zero extension, gives a real smooth compactly supported f. Reflected tests with the parity of p make f even when desired.

For 0<c<pi/2, the actual Gamma decay exp(-pi|t|/4), with polynomial factors absorbed in the strict exponent gap, bounds pF, (pF)', and q_jF by C exp(-c|t|/2). Polynomial density in L2(exp(-c|t|)dt) follows by the analytic bilateral Laplace transform of an orthogonal weighted density on |Re z|<c/2 and Fourier uniqueness. Real approximation of f' and anchored integration yield r_m. Integration by parts on each half-line gives ||r_m-f||_w <= (2/c)||r_m'-f'||_w; boundaries vanish because the difference is polynomial outside a compact set and zero at the anchor. Thus convergence holds in weighted H1.

The displayed decay bounds transfer this convergence to ordinary H1 for p r_m F and to L2 for every q_j r_m F. The quadratic form therefore converges to the negative compact-test value. Odd derivative approximants preserve even f and the chosen target parity. This proves existence of a polynomial multiple of the ORIGINAL theta transform with negative fixed-root-frame form.

The potential remains the roots of the original fixed p. The multiplier r_m p is not asserted to be the actual inverse-selected residual at its higher degree. This does not demonstrate a negative theta pivot. It strengthens the ambient obstruction to the full polynomial cyclic space without changing the unresolved one-vector assertion for the actual pF.
