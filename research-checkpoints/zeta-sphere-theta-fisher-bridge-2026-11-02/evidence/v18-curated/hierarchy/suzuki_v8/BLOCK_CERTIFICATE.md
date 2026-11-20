# Signed small-shift Hankel block certificate across the first arithmetic threshold

Status: computation PASS and independent analytic/code review PASS; see signed_head_v5/suzuki_review/. This note is the analytic justification and numerical error budget for certify_block.py. It uses only Suzuki's explicit finite kernel, not RH or global innerness.

## Reviewed scoped theorem

Let m=4,000,000, R=m log2/(m−1), and A_*=exp(R/2)>sqrt2. For omega=2/5, the finite arithmetic Hankel compression with kernel h_omega(xy) on L²(0,A_*) has norm at most .9999. Consequently the same bound holds at every smaller A by orthogonal compression. The independently reviewed parameter argument below gives norm≤.99991 throughout omega∈[2/5−10^−8,2/5+10^−8]. This proves bounded inverses I±H on these finite intervals only. It does not prove a small-shift determinant formula, canonical-system limit, RH, or the campaign C_a positivity.

Definitions and the exact logarithmic representation are in HANKEL_THRESHOLD.md. On [0,R] the symmetric kernel is k(x+y−R), where k(s)=q(s)+c2 q(s−log2), supported s≥0, c2=(2^omega−2^(−omega))/sqrt2. No n≥3 term occurs since R<1<log3.

## 1. A rigorous finite-block criterion

Let P project onto n=100 equal-cell constants, Q=I−P, A=PHP, B=QHP, D=QHQ, G=B*B. If ||D||≤d<rho and both finite matrices

    rho I ± A − G/(rho−d)

are positive semidefinite, then ||H||≤rho. Proof: the high block rho I±D≥(rho−d)I, and the displayed condition implies positivity of both full block operators rho I±H by the Schur complement. This retains all signs and requires no positivity of H itself.

The chosen budgets are rho=.9999, d=.656. Approximation errors satisfy ||A−Ahat||≤ae=.00001 and ||G−Ghat||≤ge=2(.114)(.000215)+(.000215)²+10^−7. Since

    ae + ge/(rho−d) < E=.0002,

the code validates the stronger matrices

    (.9999−.0002)I ± Ahat − Ghat/(.9999−.656)>0

by interval Cholesky, widening every stored entry of Ahat and Ghat by10^−10. Every pivot interval has positive lower endpoint. The saved data and pivot certificates are independently replayable; the large fine-grid calculation need not be repeated to check these last finite tests.

## 2. Analytic high-block bound

Write q=q1−q2 as in HANKEL_THRESHOLD.md. At omega=.4, q1 is strictly decreasing and q2 is increasing, because

    q2'=.1q2+.8q1>0.

Thus q decreases. The actual value q(R−h)<0 is enclosed by the same elementary evaluation used below (explicitly asserted in the code); monotonicity makes q negative throughout [R−h,R]. For 0<delta≤h=R/100, q is positive on [0,delta]. Indeed q1≥c r^(omega−1)e^(−2.1r), q2≤2c e^(r/2)r^omega, giving q2/q1≤2r e^(2.6r)<.015 for r≤h<.007.

Extend q|_[0,R] by zero. Its translation modulus is exactly

    ||q(.−delta)−q(.)||_1
       =2 integral_0^delta q(r)dr −2 integral_(R−delta)^R q(r)dr
       ≤2 Qprim(delta)+2delta|q(R)|,

where Qprim(r)=integral_0^r q. This uses monotonicity in the middle overlap and the known endpoint signs. The right side increases for delta≤h. The new n=2 term is positive on its support [log2,R], so its translation modulus is bounded by twice its mass, 2c2 Qprim(R−log2).

For a function g, its cell-average projection satisfies

    ||(I−P)g||²
      =(1/(2h)) sum_cells integral_cell integral_cell |g(x)−g(y)|² dxdy
      ≤(1/h) integral_0^h ||g(.+delta)−g(.)||² ddelta.

Apply Young's inequality to the full-line convolution representation (after the unitary reflection). It follows that

    ||QH|| ≤ 2Qprim(h)+2h|q(R)|+2c2 Qprim(R−log2)<.656.

Thus ||QHQ||≤d. This is an L1/translation estimate, valid below the Hilbert–Schmidt threshold.

## 3. Exact primitive and singularity-aligned finite approximation

For general omega≠1/2 put

    Q1(r)=pi^omega/Gamma(omega) B_(1−e^(−2r))(omega,5/4−omega/2),
    Qprim(r)=[(1/2+omega)Q1(r)−q2(r)]/(1/2−omega).

Differentiate using q2'=(1/2−omega)q2+2omega q1 to verify the primitive, with Qprim(0)=0. Set Qprim(r)=0 for r≤0 when used in activation formulas.

The j-th normalized coarse indicator has H-image

    V_j(x)=[Qprim(x+(j+1)h−R)−Qprim(x+jh−R)]/sqrt(h)
       +c2[Qprim(x+(j+1)h−R−log2)
                   −Qprim(x+jh−R−log2)]/sqrt(h).

Use m fine cells of width dx=R/m; m is divisible by100, and log2=(m−1)dx exactly. Thus all activations and coarse-cell endpoints align with the fine grid. The arithmetic n=2 correction affects only the last fine x-cell and the last coarse basis column.

Every n=1 component V_j increases on its initial activation cell (where its upper argument≤h and q>0, as proved above), then decreases once the lower argument is positive, since q(hi)−q(lo)<0. There is no unhandled q-root cell. Each component is therefore monotone on every fine cell. The n=2 component has the same property. If vL,vR are endpoint values and ran is the sum of absolute component endpoint changes, then the endpoint-average approximation Vhat satisfies

    |V−Vhat|≤ran/2

componentwise on that fine cell. The code accumulates

    e_step²=(dx/4)sum_(fine cells,j) ran²,
    (EA)_ij=dx/(2sqrt(h)) sum_(fine cells in coarse i) ran_j.

Consequently ||HP−Vhat||≤||HP−Vhat||_HS≤e_step and

    ||A−Ahat|| ≤ sqrt(||EA||_1 ||EA||_infinity),

where Ahat=P Vhat. Also Rhat=(I−P)Vhat and Ghat=Rhat*Rhat are computed by the finite weighted Gram formula S−Ahat* Ahat. The certified elementary-evaluation allowances below enlarge the resulting bounds to

    ||HP−Vhat||≤.000215,
    ||A−Ahat||≤.00001,
    ||Rhat||≤.114.

Then ||G−Ghat||≤2(.114)(.000215)+(.000215)², with an extra10^−7 for matrix accumulation rounding. All singular behavior is integrated via the exact primitive; no divergent kernel sample is used.

## 4. Elementary evaluation and floating-point error budget

This part is deliberately conservative. The certificate uses standard IEEE binary64 arithmetic without overflow, underflow or NaNs; the finite Cholesky step separately uses mpmath.iv at50 decimal digits. No accuracy of scipy special functions is assumed (none are used by certify_block.py).

At omega=2/5, z=1−e^(−2r), y=z^(2/5), C=pi^(2/5)/Gamma(2/5), and

    Qprim(r)=C y [9 F_(1/20)(z)−8e^(r/10)F_(1/10)(z)],
    F_alpha(z)=sum_(k≥0) p_k z^k/(2/5+k),
    p_0=1, p_k=p_(k−1)(k−1−alpha)/k.

This follows by expanding (1−t)^alpha in the beta integral. On the complete mesh 0≤r≤R<.7 and 0≤z<.76. The series is truncated at k=128. Since |p_k|≤1 and ratios thereafter are<1, its remainder is at most .76^129/[129(1−.76)]<10^−15.

The code computes z without cancellation as x times the degree29 polynomial for (1−e^(−x))/x, x=2r. It computes e^(r/10) and e^(−2.1R) with degree30 exponential polynomials. Taylor remainders are<10^−24 for |argument|≤1.5. Horner and coefficient-rounding errors obey the usual gamma_k=ku/(1−ku), u=2^−53, bound. Since absolute polynomial sums are<5 and at most260 arithmetic steps enter any beta polynomial, a conservative absolute polynomial allowance10^−12 and relative z allowance10^−12 cover coefficient generation, input rounding and Horner evaluation. Values of C, log2 and c2 are independently enclosed by50-digit interval arithmetic; conversion errors are below10^−14.

The candidate y is generated by numpy.power, but its accuracy is NOT presumed: the script checks y>0 for positive z implicitly through the positive residual computation, and verifies max|y^5/z²−1|<10^−12, evaluating the powers by explicit multiplication. Standard operation-rounding bounds turn this into a relative y error<10^−12 (the fifth-root derivative provides ample slack). The r=0 value is set exactly to zero. Combining these deliberately loose bounds gives

    |computed Qprim(r)−exact Qprim(r)| <10^−9

uniformly at all mesh endpoints. The same formulas give |computed q(R)−exact q(R)|<10^−8. The code reserves10^−6 in the high-block d comparison, far more than these errors require.

A primitive error10^−9 changes each endpoint basis-image value by less than5×10^−8, since h>.0069 and the only second arithmetic component has c2<1/2. Enlarging both endpoint ranges and their centers changes the HS error by at most2 sqrt(nR)(5×10^−8)<10^−6 (the code reserves2×10^−6), and changes the low-matrix bound by at most2n sqrt(h)(5×10^−8)<10^−6. These are exactly the inflations applied in the code.

For accumulated Gram matrices, every diagonal of S is checked<1. Hence Cauchy–Schwarz bounds each absolute weighted product sum by1. Even treating all m products as a single arbitrary-order accumulation gives entry error bounded by gamma_(2m), and the row-sum error is below10^−7 for n=100,m=4×10^6. Ahat*Ahat uses only100 products per entry and fits the same allowance. Other positive sums defining e_step and EA have relative error below10^−8 and are absorbed by the preceding much larger inflations. Stored-matrix interval widening10^−10 per entry additionally covers serialization and the small remaining arithmetic errors in the Cholesky input; the global10^−7 Gram allowance has already been included in ge.

These are implementation-level floating bounds, not a claim of formally verified hardware/software. The mathematical certificate is conditional on standard correctly rounded basic arithmetic and the documented mpmath.iv implementation, as with earlier campaign interval certificates.

## 5. Compact omega interval below1/2

A conservative parameter estimate on .39≤omega≤.41, 0<R≤1 is

    integral_0^R |partial_omega q_omega(r)|dr <150.

Here |digamma(omega)|<4 follows from its convergent series and .39≤omega≤.41. Differentiating q1 gives the bound c r^(omega−1)(9+|logr|), whose integral is<50 using c≤4omega. Differentiating q2 under its beta integral gives at most2c e^(r/2)r^omega(17+|logr|), whose integral is<85. For the second arithmetic coefficient, |c2'|<2 and c2<1/2; also integral_0^1|q|≤12 by(1) in HANKEL_THRESHOLD.md. Thus the full finite kernel has parameter derivative L1 norm<150+24+75<250, and1000 is a safe round bound.

Young's inequality therefore gives

    ||H_omega−H_(2/5)||≤1000|omega−2/5|

on the same finite logarithmic interval. The compact range omega∈[2/5−10^−8,2/5+10^−8] has norm≤.99991. All corresponding I±H are invertible by a norm-convergent Neumann series. No determinant class or full canonical-system representation is inferred.

## Final explicit interval and resolvent consequence

For omega∈[39999999/100000000,40000001/100000000] and every0<A≤2^(2000000/3999999), the norm is at most99991/100000. Thus I±H≥(9/100000)I and ||(I±H)^−1||≤100000/9. The cutoff is approximately1.4142136849053989; its square is approximately2.000000346573707, so the second arithmetic term is genuinely present. This is a very narrow but explicit crossing, not an all-support theorem.
