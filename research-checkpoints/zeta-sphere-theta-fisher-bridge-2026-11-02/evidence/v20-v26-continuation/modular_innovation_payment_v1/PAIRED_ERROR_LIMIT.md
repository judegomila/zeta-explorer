# Paired dual-error derivative: a finite prefix-only normalized payment test

Status: new exact sufficient inequality awaiting independent review. Positive normalized prefix assumed; no next-pivot positivity.

The unilateral bound L_+(a)<=delta_+(a) must NOT be inserted at a=0 while retaining the entire delta_-(a). In current-pivot normalization both innovations are of order1/a, and any fixed positive approximation error in L_+ causes a spurious negative error/a. Use the following paired unnormalized construction instead.

## 1. Preserve the common approximation error

Use unnormalized monic current F(a,h)=T_N(a,D)g_a(h), source q=D F, and old next-parity features V(a). Their coefficients are even analytic in a under the positive normalized-prefix hypothesis. The chosen augmented design has a locally fixed independent span: at h->infinity, the actual first theta orbit gives the monic current degree-N feature one higher exponential-polynomial derivative power than any old degree<=N-1 feature. The h³F and hF coefficients must therefore vanish successively in any linear dependence, followed by the distinct old derivative powers. Fixed-degree full-orbit tails are negligible in this asymptotic argument. Thus both weighted and unweighted design Grams are positive definite near zero; no rank-changing pseudoinverse is differentiated. On h>0, inner product is integral h fg. Add the fixed spatial features hF,h³F to obtain design U. Let gamma minimize ||q-U gamma||² and let e=q-U gamma, E=||e||². Let delta be the old-V innovation and L=delta-E its projected-witness gain.

Reflection and parity imply delta_minus(a)=delta(-a), E_minus(a)=E(-a), L_minus(a)=L(-a) (column sign changes do not alter the spans). Thus
 delta(a)-delta(-a)=[L(a)-L(-a)]+[E(a)-E(-a)]
without loss of the leading common error. At zero delta'=L'+E'; the error derivative is SIGNED and may not be discarded.

## 2. Error derivative needs only current-prefix forcing

At a=0 polynomial-coefficient derivatives vanish. If K_N=T_N'(D)psi and K_j=T_j'(D)psi, then
 F_a=hF+K_N,
 q_a=hq+F+D K_N,
 U_a=hU+K_U,
 K_U=(K_old, hK_N,h³K_N).
Hence, by positive regression orthogonality,
 E'(0)=2<e,q_a-U_a gamma>
      =2 integral h²e²+2 integral h e L_forcing,
 L_forcing=F+D K_N-K_U gamma.
Every term of L_forcing has differential degree<=N, with the stated spatial weights. The augmented regression gamma itself is prefix-computable: inner products of q with V or h^rF are integrated by parts as in PREFIX_DUAL_PAYMENT.md.

Since <e,U>=0 in the h-weighted inner product, one may replace L_forcing by L_forcing-U eta for ANY eta. Choose eta as its orthogonal projection coefficients onto U in UNWEIGHTED L2(dh), and call the remaining function L_res. Completion of the square gives
 E'(0)=2 integral [h e+L_res/2]² -(1/2) integral L_res²
      >= -(1/2)||L_res||_L2(dh)².
No unproved sign of E' is assumed, and the resulting cost uses only prefix functions. Inverses are restricted to the actual nonzero design spans.

## 3. Keep the true normalized inverse-feedback cost

Let A(a)=<V,V>, c(a)=<V,q>, alpha=A^-1c. At zero the positive normalized old target implies A'(0)>0; in this raw convention the normalized old block itself is 2A'(0). Define the actual drift cost
 f=alpha'(0)^T A(0) A'(0)^-1 A(0) alpha'(0).
The exact raw next signed pivot has normalized limit
 sigma_(N+1)=lim_(a->0) s_(N+1)(a)/a=2[delta'(0)-f].
The factor2 is because this packet uses the raw plus-minus difference, not the half-difference convention of some prior bridge notes.

Let kappa0=4N+||d_perp||² from the audited modular defect, and M_N=integral_0^infinity h F_N(0,h)²dh. The actual current-normalized negative-cost limit is kappa0 M_N/sigma_N, while the next pivot ratio tends to sigma_(N+1)/sigma_N. Therefore the following is a NONCIRCULAR, entirely prefix-computable sufficient payment test:

 2[L'(0)-f] - ||L_res||² >= kappa0 M_N.

It implies sigma_(N+1)>=kappa0 M_N, hence the next signed surplus pays the explicit modular negative-cost term in the same current normalization. Neither sigma_(N+1)>0 nor an auxiliary parent inverse is used to derive the test. L' can be computed by differentiating the finite positive spatial-witness Grams after the prefix integration-by-parts reduction.

This is a candidate sufficient inequality, not a proved theta-uniform bound. It also does not authorize dropping the signed w' term from the separate integrated modular conservation law. Its purpose is a normalization-correct scalar target for joint inverse-feedback testing.


## Prefix-only evaluation formula and finite sanity values

Let c_U=<U,q>, B=<U,U>, gamma=B^-1c_U, and c=<V,q>, alpha=A^-1c. The dual gain derivative can be evaluated WITHOUT q² or any next-degree function norm:
 L'=2c_U'^T gamma-gamma^T B'gamma-2c'^T alpha+alpha^TA'alpha.
For old columns, c_j=-integral F(V_j+hV_j'); differentiate this expression, using F_a=hF+K_N and (V_j)_a=hV_j+K_j. For spatial columns h^rF, c_r=-(r+1)/2 integral h^rF² and c_r'=-(r+1) integral h^r F F_a. All required functions have degree<=N. This is the intended noncircular implementation; an independently computed next pivot may be used only as a sanity cross-check.

Floating original-theta normalized-a0 checks at the already-verified rungs N2->3,N4->5,N5->6, with witnesses hF,h³F, give the sufficient payment margin divided by the current normalized pivot approximately +11.5253,+12.5621,+17.0058. These are not interval/full-tail certificates or all-degree evidence. The exact innovation-drift formula matches separately computed next pivots to about7e-16 on this floating mesh. One spatial witness is insufficient at N4 and N5; the paid error term is essential.
