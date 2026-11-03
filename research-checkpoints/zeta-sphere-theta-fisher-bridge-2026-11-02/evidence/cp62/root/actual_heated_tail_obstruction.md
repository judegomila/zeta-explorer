# CP62: an actual positive-time tail obstruction and its finite-rank consequence

Status: original analytic consequence of the source-verified v15 certificate, with explicit rational gates. This is a theorem about a spatially truncated theta kernel, NOT the complete theta kernel, critical covariance, Weil form or RH. No imported verifier is run.

## T1. Source and exact normalization

The v15 archive `libfile_b03b6820cea881919787c807c6e54dbb` has SHA256 cbb9e402553adaa5de6b9ef76f82ca53765fcd7307a1263ebdc7eb768db3e57c. Its original positive-shift proof and supplied independent replay record certify, at

    H=1, a*=1/10000, nu=7005081715/1000000, xi*=2nu,
    exp(pi nu/2) hat K_(1,a*,0)(xi*) < -B,  B=51718939276867.

Here, in exactly CP61's C/a convention,

    K_(H,a,tau)(v) = exp(tau v^2/2) integral_H^infinity
                      2h^2 [sinh(2ah)/(2ah)] exp(tau h^2/2)
                      psi(h-v) psi(h+v) dh.                         (T1)

Fourier convention: hat K(xi)=integral_R K(v) exp(-i xi v) dv. The removable a=0 limit is understood. The v15 proof already normalizes the tail by a; do not divide by a a second time because of its index synopsis. Tau denotes true heat time, not nu. The full even theta profile is used before and after the deformation.

The existing certificate is imported as a verified source input; this turn reads and hash-verifies the source/audits, not a new Arb replay. The following positive-heat extension and finite-rank consequence are new analytic statements.

## T2. A full-theta Gaussian majorant with elementary constants

For real u>=0, put z=pi exp(2u). The exact theta series gives

    psi(u)=8 exp(u/2) sum_(n>=1) [z^2 n^4-(3/2)z n^2] exp(-z n^2).

Both positive polynomial-exponential majorants have successive ratio at most 16 exp(-3z)<1/2 for z>=pi>3. Thus, with evenness for u<0,

    |psi(u)| <= 8 exp(|u|/2) [2 z^2+3z] exp(-z)
              <= 352 exp((9/2)|u|-3 exp(2|u|)).

Using exp(2r)>=1+2r+2r^2, r>=0, and exp(3)>20 proves

    |psi(u)| < 18 exp(-6u^2).                              (T2)

The constants are deliberately coarse but uniform; no finite theta truncation is used. The individual series coefficients are positive for real u>=0, and exact evenness gives psi>0 on the real line, although positivity is not needed for the absolute estimates below.

For 0<=a<=1/2 and 0<=tau<=1/2,

    sinh(2ah)/(2ah) <= exp(h),
    exp(h) <= exp(h^2+1/4) < 2 exp(h^2).

Equation T1 and T2 therefore imply, for every H>=0,

    |K_(H,a,tau)(v)| <= 1296 exp(-11v^2)
                                integral_0^infinity h^2 exp(-10h^2) dh,
    |partial_tau K_(H,a,tau)(v)| <= 648 exp(-11v^2)
                    integral_0^infinity h^2(h^2+v^2) exp(-10h^2) dh.     (T3)

Both positive-time factors are included; the derivative has the factor (h^2+v^2)/2. With pi<4, sqrt(10)>3 and sqrt(11)>3, the exact Gaussian integrals obey

    integral_0^infinity h^2 exp(-10h^2) dh < 1/60,
    integral_0^infinity h^4 exp(-10h^2) dh < 1/400,
    integral_R exp(-11v^2) dv < 2/3,
    integral_R v^2 exp(-11v^2) dv < 1/33,
    integral_R |v| exp(-11v^2) dv = 1/11.

Consequently the useful bounds are

    ||K||_1 < 72/5 < 15,
    || |v| K ||_1 < 108/55 < 2,
    ||partial_tau K||_1 < 387/275 < 2.                    (T4)

Dominated differentiation/Fubini on these stated real parameter bands are justified by T3. No complex-strip or unbounded-time conclusion is inferred.

## T3. A fully explicit positive-time negative spectral rectangle

Define the exact positive rational

    epsilon = B / 3^14012.                               (T5)

It is less than one. Since nu<7006, pi<4 and exp(1)<3,

    exp(pi nu/2) < 3^14012.

The v15 certificate therefore gives hat K_(1,a*,0)(xi*) < -epsilon. For the SAME fixed H=1 and a*, T4 implies

    |hat K_(1,a*,tau)(xi)-hat K_(1,a*,0)(xi*)|
        <= 2 tau + 2 |xi-xi*|.                           (T6)

Thus

    hat K_(1,a*,tau)(xi) < -epsilon/2
    whenever 0<=tau<=epsilon/8 and |xi-xi*|<=epsilon/8.   (T7)

By reality and evenness, the reflected frequency interval also has this sign. This is an ACTUAL true-positive-time spatial-tail obstruction, not an arbitrary model or a formal evolution of undeformed prime terms. It includes strict positive heat times, but only an extremely small explicitly stated range. It says nothing about the sign of the complete spatial integral.

The CP61 large phase-carrier theorem requires R>=16 exp(256/tau_lower), tau_lower>0. The present frequency is xi*=14010.16343 and is not in that paid large-carrier regime. T7 does not refute the CP61 contour-band margin and does not pay its boundary budget. Its use is to falsify universal positive-time tail and finite-rank-repair premises at their actual source.

## T4. Infinite negative index on the reflection-even source class

Fix a time in the T7 range. The convolution operator by K_(1,a*,tau) is bounded and self-adjoint on L2(R), with norm <15. Its form, with the above Fourier normalization, is

    q_tail(f) = (1/(2pi)) integral_R hat K(xi) |hat f(xi)|^2 dxi.

For any integer m, choose m linearly independent smooth Fourier functions supported in disjoint symmetric pairs of subintervals strictly inside the two T7 intervals. Choose them even; normalize their inverse Fourier transforms in L2. They are even Schwartz functions, mutually orthogonal, and their whole span obeys

    q_tail(f) <= -(epsilon/2) ||f||_2^2.                  (T8)

For a reflection-even chi in C_c^infinity, equal to one near zero, the cutoff chi(v/L) approximates these m functions in L2 as L tends to infinity. Since the span is finite-dimensional and the convolution operator has norm <15, choose a finite L so the compressed Gram remains strictly negative definite. These are complex reflection-even C_c^infinity sources. This establishes arbitrarily large negative subspaces of the truncated-tail form even on the union of compact supports. No numerical finite L is certified here.

Let now any correction have the finite-functional form

    q_corr(f) = ell(f)^* M ell(f),

where ell consists of r fixed complex-linear functionals defined on these test sources and M is a fixed Hermitian r-by-r matrix; no favorable sign is needed. Their boundedness on the entire test space is not required for this finite-dimensional argument. Take m=r+1 in the preceding construction. The linear map ell on that finite negative span has a nonzero kernel, so for some nonzero f,

    q_tail(f)+q_corr(f)=q_tail(f)<0.                      (T9)

This covers any genuinely finite-rank positive correction and any finite-head inverse term whose source dependence factors through finitely many such functionals. It does NOT identify this convolution form with the actual physical Weil form, nor assert that actual Schur feedback is finite rank on this entire source class. Domain/source maps must be proved before transferring it.

## T5. Precise consequence for the integrated-anchor route

A finite matrix-valued anchor cannot by itself turn the complete H=1 tail into a nonnegative convolution kernel if the claimed correction has finite functional rank and the central term has been discarded. The obstruction persists at positive shift and the true small positive heat times in T7. Infinite-rank corrections, restricted finite test spans, frequency restrictions, and the exact signed central contribution are outside that failed claim.

The verified degree-19 finite moment result is not contradicted. It uses a particular finite span and H=1/16 with all stated couplings. An integrated lower-block anchor may still help a finite actual boundary family, but it must retain the signed central-tail pairing and the complete covariance remainder. T9 rules out only making the entire omitted tail harmless through a finite-head correction. All Schur/inverse domains, exceptional directions, normalizations and shrinking-reserve comparisons remain open obligations.

## T6. An actual joint positive band with a negative tail

The same source certificate has a genuine TWO-SIDED full-density enclosure, distinct from its tail upper-bound expression. Its independently replayed lower endpoint is 3194699959754.6482204... on the normalized scaled axis. The read-only producer formula includes the complete signed first-derivative Euler--Maclaurin error. The safe enclosing integer is

    A=3194699959754,  epsilon_plus=A/3^14012,
    exp(pi nu/2) hat K_(0,a*,0)(xi*) > A.                 (T10)

The incoming v15 audit and exact producer/source bindings are part of the receipt; this is not a new numerical evaluation. The same bound T6 applies to H=0. Since 0<A<B, throughout the narrower rectangle

    0<=tau<=epsilon_plus/8,
    |xi-xi*|<=epsilon_plus/8

one obtains the JOINT actual-source statements

    hat K_(0,a*,tau)(xi) > epsilon_plus/2,
    hat K_(1,a*,tau)(xi) < -epsilon/2,
    hat K_core,(1,a*,tau)(xi) > (epsilon_plus+epsilon)/2. (T11)

Here K_core=K_(0,a*,tau)-K_(1,a*,tau) is the exact central spatial integral. Thus the positive core and negative tail are both explicitly retained; the first line is a signed estimate of their actual sum, not separate positivity. It holds also on the reflected frequency interval. All theta terms and both heat factors are included.

For any L2 amplitude with Fourier support in these two intervals, the complete-kernel convolution form has lower bound (epsilon_plus/2)||f||_2^2, while the tail has upper bound -(epsilon/2)||f||_2^2. All cross terms inside such a spectral subspace are included. This supplies an actual positive integrated anchor on this restricted source class. These are spectral support conditions; no nonzero function is asserted simultaneously compactly supported in space and frequency. This restricted complete-kernel anchor is not the physical Weil complement and does not cover the CP61 phase-carrier family.

One actual denominator bound follows on the SAME fixed-shift boundary line. From H(tau,z)=integral_0^infinity psi_tau(h)cos(zh/2)dh/8, T2 gives, for 0<=tau<=1/2, |Im z|<=1,

    |H_y(tau,z)| <= (18/16) integral_0^infinity
                   h exp(-(6-tau/4)h^2+|Im z|h/2) dh < 9/32.

Indeed exp(h/2)<=exp(h^2+1/16)<2 exp(h^2), and the remaining Gaussian exponent is strictly below -4h^2. At y*=2a*=1/5000 and x=xi in the T11 interval,

    S=a* hat K_(0,a*,tau)(x)/128 > a* epsilon_plus/256,
    S=Re(H_y conjugate H) <= |H_y| sqrt(D).

Consequently

    D(tau,x+iy*) > (a* epsilon_plus/72)^2.               (T12)

This is a proved local numerator and denominator gate, not a sign of f_xx, partial_x(S/D), the joint pole term, or V-G_B. It is on one fixed y line, not a complete positive-time chart/tube. Even the resulting inverse-denominator allowance grows like epsilon_plus^-2; no shrinking reserve is paid by declaring it finite. Spatial/time switches, exceptional poles and the physical inverse remain untouched.

T11 is a concrete nontrivial instance of complete signed core-tail compensation under true heat. Its tiny fixed frequency/time window is explicitly outside CP61's large reference-phase regime; it does not give support exhaustion or an unbounded-height mechanism.
