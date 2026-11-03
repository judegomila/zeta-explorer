# Independent audit of the 20:44 sphere continuation

Date: 2 November 2026. Status: PASS for the analytic H2, separated-node and close-pair results, with precisely the restrictions below. This is a mathematical audit, not machine-checked formal verification and not a proof of RH.

## Sources and procedure

Original source: originating private research thread; conversation and message identifiers redacted for repository publication.

Source archive: `libfile_ae2cf83bf86c81918d150a2c5ef078e9`, version 0, 24,398 bytes. SHA256 `711a7aa7841691cf22ccffd71b06940d04782b963834837449b5dba5118dfa85`.

Read both complete LaTeX sources. The acquired Python checker was NOT executed or imported. Independently authored `independent_algebra.py` recomputes the differential identities and rational estimates and passes. The analytic arguments below were checked separately; the finite script is not a substitute for them.

## 1. Full-profile curvature and fourth logarithmic derivative: PASS

For u >= 0, all f_n are positive, z=pi exp(2u)>3. The exact mixture curvature identity is valid by locally uniform differentiated theta convergence. The polynomial certificate for each component's curvature being below -19 is algebraically correct. Centering the variance at the first slope is an upper bound, not an equality. The ratio bound f_n/f_1 <= 2n^4 exp(-z(n^2-1)) and slope difference <= 2z(n^2-1)+2 are valid. The n=2 term and geometric ratio estimates give the full variance <160000/99999<2. Smooth modular evenness extends ell''<-17 to the negative axis.

The positive Laplace representation of f_n/f_1 is exact. Its differentiated factors P1 through P4 are nonnegative at lambda*z>=9 and bounded by the corresponding powers. The shift-integrated derivative majorants, monotonicity in s>=9, n=2 constants and successive-n geometric bounds all check. In particular |r'|<0.1, 0<=r''<2, |r'''|<40 and r''''>=0 keep the complete infinite tail. The independent identity L''''-4L''=-3456z^2/(2z-3)^4 and its lower bound -384 hold. The log(1+r) expansion and discarded nonnegative terms give its correction >-180003/5000>-37. Thus ell''''>=4ell''-421 is justified.

## 2. H2 confluent matrix: PASS, every a>0 and the normalized a=0 endpoint

The positive probability weight rho_a is well-defined for every fixed a>0 because of double-exponential profile decay. Differentiation at lag zero gives C''/C0=2 E(ell'') and C''''/C0=2 E(ell'''')+12 E(ell''^2). The normalized determinant is 2 E(ell'''')+12 Var(ell'')+8 E(ell'')^2. Consequently it is at least 8m^2+8m-842 >=1334 for m<=-17. Equivalently the pointwise reserve ell''''+4ell''^2>=667 yields the same result. The middle channel -C''/C0>=34 and the even 2x2 block prove H2 positive definite.

This does NOT establish H3, all-order positivity, or a uniform smallest eigenvalue for arbitrarily large a. It does hold for every nonnegative h-weight for which the same integrals and differentiations exist, not only the bridge weight.

## 3. Separated configurations and Schur complements: PASS

Strong log concavity gives the actual complete-kernel envelope C_a(v)/C_a(0)<=exp(-17v^2). For nodes separated by 1/4, each row and column is controlled by 2 sum exp(-17n^2/16)<5600/7657<3/4. The Taylor lower bound for exp(17/16) and the inequality n^2>=3n-2 are correct. The countable extension is a bounded self-adjoint operator by the row-and-column Schur test. The lower bound G>=C0 I/4 implies the same lower bound for every coordinate Schur complement, by minimization over the eliminated variables. There is no assumption of global positive definiteness in this derivation.

The test-node separation is in the lag coordinate; it is NOT a zero-spacing or height statement, and arbitrarily many separated tests do not exhaust dense configurations.

## 4. Close pairs: PASS under the stated bounded-shift conditions

For r=0,1,2, the derivative majorants |psi^(r)(u)|<=2*10^6 exp(-5u^2) are conservative and valid. Their three polynomial coefficient sums are independently recomputed. The normalized bridge-weight bound for 0<=a<=1/2, Gaussian integral bound I<1/10, and kappa_a(0)>1e-7 justify |c_a^(r)(v)|<=2*10^19 exp(-10v^2).

The exact average/slope within-pair block is diag((1+c(2h))/2,(1-c(2h))/(40h^2)), and is >=I/2 for 0<h<=0.1. The divided-difference integral formulas remove all inverse-width losses. Cross-block norms are bounded by 2M exp(-10(d-0.2)^2). Center separation >=2.5 yields off-diagonal norm <0.01, hence relative norm <0.02 and G>=0.49 I. This holds through arbitrary pair collisions and for countably many pairs. It does NOT give fixed coercivity in the original coalescing point basis, for which congruence degenerates.

## 5. Exhaustive derivative criterion: PASS, no circular spectral positivity assumption

The complete theta kernel is holomorphic in |Im v|<pi/4, with uniform horizontal Gaussian decay on each smaller strip. Contour shifting yields finite absolute exponential spectral moments. The signed spectral measure therefore has dense polynomials in L2 of its absolute variation, by the analytic Fourier transform uniqueness argument given. All Hankel/confluent matrices PSD implies its density is nonnegative. This requires EVERY order for each shift. H0-H2 alone do not supply it.

## Other source checks and scope

The raw finite rectangular beta factorization has the correct 1/4 constant. Its zero-frequency parameter derivative is strictly negative on 0<a<1/2, so the reported raw-group obstruction is genuine and does not apply to the fully renormalized kernel. The midpoint section was read and its main Peano, endpoint-normalization and shear-product error derivations checked for consistency; the principal assigned audit concerns Sections 2-4 and the hierarchy, and no all-height relative margin is claimed for midpoint errors.

## Next handoff

The first genuinely unpaid new local condition remains C'' C^(6) - (C^(4))^2 >=0. The positive Laplace ratio signs through order four cannot simply be extrapolated to higher order; the relevant differential polynomials have new sign changes. Any H3 argument should retain its sixth logarithmic derivative and all mixed terms, specify the shift range and be checked independently before being promoted. All-order positivity remains the global blocker.
