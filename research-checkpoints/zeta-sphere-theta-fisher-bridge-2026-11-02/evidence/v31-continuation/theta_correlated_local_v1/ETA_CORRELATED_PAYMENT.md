# Correlated eta payment in the actual residual space

Independently reviewed analytic PASS, including Section5. It gives a convergent correlated cost evaluation and a sharp limitation on norm-only substitutes, not a uniform positivity theorem.

Fix L=log2, q=1/sqrt2, c=sqrt2, B(t)=|1-c exp(itL)|². Use the exact paired identity
 Lambda=W_H/B-kappa F²,
 kappa=cL²(2c-cos(tL))/B.
Let p be the actual even residual P_N(t²) or actual odd residual tQ_N(t²), with all actual prefix-inverse coefficients retained. Put g=p(-iD)psi, so hat g=p(t)F(t).

## 1. Exact translation-correlation form of the subtraction

The Poisson series, uniformly absolutely convergent on real t, gives
 kappa(t)=L²[3+5 sum_(m>=1)q^m cos(mtL)].            (1)
Define C_m=Re integral g(u+mL)conjugate(g(u))du and C_0=||g||². Then
 E[p]:=integral p² kappa F²
 =2pi L²[3C_0+5 sum_(m>=1)q^m C_m].               (2)
The SAME residual g appears in all terms; no auxiliary projection replaces it. Both parity cases are valid since |pF|² is even.

If E_M denotes truncation after m=M,
 |E[p]-E_M[p]| <=5L² q^(M+1)/(1-q) * integral p²F². (3)
This is a degree-independent RELATIVE error for the positive-parent cost, not for the possibly tiny signed pivot. It follows from |C_m|<=C_0.

There is also an exact translation-difference form:
 E[p]=2pi kappa_max||g||²
        -5pi L² sum_(m>=1)q^m||g(.+mL)-g||²,
 kappa_max=L²(8+5sqrt2), kappa_min=L²(8-5sqrt2).    (4)
The nonnegative translation differences quantify the improvement over the worst-case parent-norm cost. They do not make E negative or prove the filtered curvature dominates it.

## 2. Joint truncation preserves the cancellation between filtered terms

Rather than approximate W_H/B and kappa F² independently, define
 P_M(t)=1+2 sum_(m=1)^M q^m cos(mtL),
 N(t)=W_H(t)-cL²(2c-cos(tL))F(t)²=B(t)Lambda(t).
(The factor1/(c²-1) in the general Poisson inverse is1 here.) The joint approximation is
 J_M[p]=integral p² P_M N.
Finite geometric summation gives exactly
 B P_M=1+4[q^(M+2)cos(MtL)-q^(M+1)cos((M+1)tL)].
Therefore
 |h[p]-J_M[p]|<=4(1+q)q^(M+1) A[p],
 A[p]=integral p²|Lambda|.                         (5)
An explicit non-signed bound for this error scale is
 A[p]<=2pi{||p(-iD)(u psi)||²
                 +||p(-iD)psi|| ||p(-iD)(u²psi)||}. (6)
This follows from |Lambda|<=|F'|²+|F F''|, Parseval and Cauchy–Schwarz. The previously audited full-theta positive-parent spatial bounds control all three finite norms with the actual coefficients. No unknown next norm occurs in (5)-(6).

The joint approximation retains the actual subtraction before estimating its error. It does not establish the sign of J_M, and the required M for a pivot certificate depends on the ratio A[p]/h[p] or a separately proved lower margin. Degree-independent relative accuracy for E is not degree-independent accuracy for h.

## 3. Sharp obstruction to a stronger parent-norm-only constant

On the FULL actual-theta even polynomial space, the best possible constants in
 c_low integral p²F² <= E[p] <= c_high integral p²F²
are exactly kappa_min and kappa_max. The same is true for the odd polynomial space. Thus theta structure alone cannot improve these constants uniformly over that entire space; a useful improvement must use correlations or the particular actual inverse-selected residual.

Here is a justification using the actual theta weight. The audited derivative estimate ||psi^(j)||_2<=64j!(8/3)^j implies
 integral exp(epsilon|t|)F(t)²dt<infinity for every0<epsilon<3/8:
expand cosh, use Parseval for its even moments, and (j!)²/(2j)!<=1. Multiplication by t² retains a smaller positive exponential moment.

Even polynomials in t are dense in the even subspace of L²(F²dt). Indeed an even orthogonal function induces a finite signed measure with an exponential moment whose every moment vanishes. Its Fourier transform is analytic near the real axis with zero Taylor series, hence identically zero. The same argument for weight t²F² proves density of Q(t²) in the odd-polynomial formulation p=tQ(t²).

Approximate a symmetric narrow frequency window about a maximizer of kappa, and separately a minimizer, by these polynomials. The actual F is analytic and not identically zero, so every such interval has positive weight even if its center is an isolated zero; shrinking the window makes the Rayleigh ratio approach the corresponding continuous extremum. The bounds are therefore sharp in both parity spaces.

This does NOT say that the actual orthogonal residual sequence attains either endpoint. It rules out replacing its missing correlated estimate by a better universal norm-only constant. A fixed-degree finite matrix can have narrower extrema; a uniform all-degree improvement needs additional information about the inverse-selected residuals.

## 4. Remaining signed requirement

Equations(2)-(6) provide controlled ways to evaluate the eta subtraction without discarding correlations. They preserve the actual residual and all parent-energy payment. The original odd arithmetic tail is unaffected and must still be paid if a divisor certificate is used. No inequality proving that the filtered term dominates this correlated cost for all actual residuals is established.

## 5. A genuine theta-specific improvement for the base residual only

For p=1, g=psi, the actual log-curvature bound gives for every tau
 psi(u+tau/2)psi(u-tau/2)<=exp(-17tau²/4)psi(u)².
After integration,
 0<C_m/C_0<=exp(-17m²L²/4).
Consequently the actual base subtraction obeys
 3L² <= E[1]/integral F²
 <=L²[3+5 sum_(m>=1)q^m exp(-17m²L²/4)]
 <=L²[3+5r/(1-r)], r=q exp(-17L²/4).              (7)
This is strictly below the worst-case kappa_max; it uses real complete-theta shape rather than a generic operator norm. The geometric last step uses m²>=m.

This base improvement is NOT asserted for derivative residuals: g=p(-iD)psi can change sign and need not retain psi's log-curvature. In particular an upper bound on the base autocorrelation cannot simply be differentiated into the analogous bound for p=t or higher polynomials. The sharpness result in Section3 rules out the same universal improvement over the full polynomial space. Extending(7) specifically to the actual inverse-selected residuals would require a new correlated derivative estimate.
