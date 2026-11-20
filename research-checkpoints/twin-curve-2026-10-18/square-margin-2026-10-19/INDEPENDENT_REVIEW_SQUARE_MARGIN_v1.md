# Independent review: square variance and full rectangle margin

19 October 2026. Reviewed source: `SQUARE_VARIANCE_AND_FULL_MARGIN_v1.md`, SHA256 `daa0eaeaac2b0a455830807e538bbbc9e2d403680499493e8003d4bc4f5c2b17`.

## Verdict

Pass for the stated bounded derivation. No mathematical correction required. The source is unchanged. This review establishes neither the missing all-carrier prime estimates nor a new zero-free curve.

## Independent checks

1. **Mean and absolute bounds.** With s>1/2, h>0, x>0, b=s+x, and every square of a prime p<=Q retained, |S2|<=Z(2s)/2=D and |E S2|<=Z(2b)/2=D_b. Strict decrease of Z on r>1 gives D_b<D.

2. **Tail bound and endpoints.** For v>=4 put M=ceil(sqrt(v)). The decreasing integer-tail estimate gives
   sum_(n>=M)n^(-2b) <= M^(-2b)+M^(1-2b)/(2b-1)
   <= v^(-b)+v^(1/2-b)/(2b-1).
   Including the coefficient factor 1/2 produces the source's bound for A2. The lower endpoint term is included, and at v=4 this bound agrees with D_b. For 1<=v<=4 the constant D_b is valid.

3. **Exact integral constants.** The interval [1,4] contributes D_b^2(4^(2x)-1)/2. After expanding the squared tail majorant, the three remaining integrand powers are v^(-2s-1), v^(-2s-1/2), and v^(-2s). Their integrals from 4 to infinity have denominators 2s, 2s-1/2, and 2s-1, respectively. Together with the outer factor x/4 and the middle cross coefficient 2, they give exactly K(s,x). All converge for s>1/2. The bound is independent of Q, T, and h; no cancellation or unproved prime estimate is used.

4. **Numerical transcription.** Direct ordinary evaluation reproduces all displayed rounded values at s=.834 and b=.86796 or .875. These checks are not interval certification and make no interval-wide numerical claim. The exact expression proves the bound.

5. **Covariance and variance bounds.** Cauchy applied to the centered sums gives |Cov(S1,S2)|<=sqrt(v1 v2)<=sqrt(K v1). The upper and lower variance bounds in equation (2) follow from the two triangle inequalities in the centered L2 norm. All mixed terms remain present. Neither independence nor a favorable sign is assumed.

6. **Complete clipping bounds.** The pointwise upper remainder payment yields (c+L_Q)_+ <= (c+C3-S1-S2)_+. The sharp two-moment inequality then gives U_exact. Paying |S2| absolutely gives U_abs. Monotonicity of Phi in both arguments gives U_joint, since -m2<=D_b and the joint variance is at most (sqrt(v1)+sqrt(K))^2. Positive-part Lipschitz continuity and E|S2|<=sqrt(m2^2+v2)<=sqrt(D_b^2+K) give U_lip. Their minimum is a valid upper bound on the same Poisson-averaged clipped integral. The remainder C3 is paid only once.

7. **Strict comparison.** For U=U_abs>0, its defining quadratic identity is v1=4U(U-A-D). Also U>=A+D>A+D_b. Applying the sharp-moment threshold test at U gives exactly
   U_joint<U_abs if and only if K+2sqrt(K v1)<4U_abs(D-D_b).
   The source correctly verifies U_abs>0 here: the positive-coefficient finite prime sum is nonconstant and the Poisson density is positive everywhere, so v1>0. No premise claims that a favorable pair (A,v1) occurs at any actual carrier.

8. **Size of the actual square effect.** The pointwise Lipschitz difference of the two clipped expressions is at most D. Hence its Poisson average is also at most D, uniformly in T, Q, and x at fixed s>1/2. Square separation alone cannot change their leading logarithmic term. At fixed s and x, the bounded square standard deviation also cannot cancel a leading prime standard deviation growing like log T. The stated deterioration of D and this K bound as s approaches 1/2 is real; the cutoff-uniform C3 bound at 1/2 does not cure it.

9. **Analytic prerequisites.** The same residual and finite-rectangle certificate are used. Denominator zero-freeness on a neighborhood of the closed rectangle, its positive lower carrier height, the left-ratio estimate, right and horizontal boundary bounds, target width x=Re(z)-s, carrier T=Im(z), effective onset, and every-target coverage remain necessary for the proposed use. Changing s or h does not license reuse of earlier analytic estimates. The Poisson arithmetic extension asserts no zeta bound outside the finite rectangle.

## Additional checked comparison at a fixed edge budget

This is a review observation, not an edit to the frozen source. For a positive fixed B=Bstar, define

a_abs=A+D,
a_exact=A-m2,
Delta_abs=4B(B-a_abs)-v1,
Delta_exact=4B(B-a_exact)-(v1+v2+2Cov(S1,S2)).

Then the exact identity is

Delta_exact-Delta_abs=4B(D+m2)-v2-2Cov(S1,S2).

It states the complete change in the variance-inequality slack. The separate required mean condition a<B must still be checked. Although D+m2>=0, the uncontrolled sign of the covariance prevents inferring an unconditional net improvement. This agrees with the source's choice to retain the minimum of available valid bounds.

## Remaining frontier

The signed actual-prime mean and variance, or equivalent discrepancy energy, still must be bounded strongly enough at every target to make the full rectangle budget negative. This review gives no global 7/8 improvement, effective onset, new height exponent, RH result, or publication approval. No external service was modified and no large computation was performed.
