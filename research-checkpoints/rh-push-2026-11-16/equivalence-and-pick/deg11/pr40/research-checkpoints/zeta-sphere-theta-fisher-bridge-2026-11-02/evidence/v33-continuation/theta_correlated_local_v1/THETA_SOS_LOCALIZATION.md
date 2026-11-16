# Uniform arithmetic denominator control for localized theta SOS certificates

Status: independent analytic review PASS. This proves a uniform bound for a known normalization factor and constructs an exact quadratic flux identity. It does not bound the missing all-degree Schur remainder.

Use the audited normalized module of THETA_SOS_DEGREE_SELECTION.md. In particular P_j=y T_j, T0=1+3v/2, mu=A^(1/2)y², b=9x/2+4z, and Ghat=∂_L+V+b. All derivatives V below are along the distinguished complete-theta trajectory. No unknown pivot is used as a denominator.

## 1. A uniform rank-one arithmetic bound

For every real L,

                         2/5<T0(L)<2.                         (1)

Here is an elementary full-theta proof. By reflection it suffices to take q=e^L≥1. Let Theta(q)=theta3(q), E=exp(−pi q). Exact differentiation and the theta-product expression for y give

T0=16 Σ_(n≥1) n^4[1−3/(2pi q n²)]exp(−pi q n²)
       /[Theta(q) theta2(q)^4 theta4(q)^4].                  (2)

Every numerator term is positive. Keep n=1. The alternating theta4 series gives 0<theta4(q)<1. Also

theta2(q)=2 exp(−pi q/4) Σ_(m≥0)exp(−pi q m(m+1))
          ≤2 exp(−pi q/4)/(1−exp(−2pi q)),
Theta(q)≤1+2exp(−pi q)/(1−exp(−3pi q)).

Thus

T0≥[1−3/(2pi q)](1−exp(−2pi q))^4/Theta(q).

Use pi>3 and exp(3)>20. Then E<1/20, Theta<1+(1/10)/(1−1/8000)<9/8, and (1−exp(−2pi q))^4>(399/400)^4>9/10. Therefore T0>(1/2)(9/10)/(9/8)=2/5. The estimate retains the full theta denominator; it does not replace the bridge or the actual selected polynomial by the first orbit.

A matching coarse upper bound is also elementary. Theta≥1, theta2^4≥16E and theta4>1−2E>9/10. The numerator factors in square brackets are less than one. Since n^4≤16^(n−1) and n²−1≥3(n−1),

T0 < (10/9)^4 Σ_(n≥1)n^4 E^(n²−1)
    ≤(10/9)^4/(1−16/8000)<2.

Consequently T0^(−m)≤(5/2)^m for every integer m≥0, uniformly over the whole spatial line. The positive weights mu and mu T0² are therefore comparable with constants 4/25 and 4. This is a normalization bound, not a lower bound for any signed prefix eigenvalue or target pivot.

## 2. Rational fluxes are safe, but their drift must be retained

For any polynomial R(L,x,y,z,v) and fixed nonnegative integer m,

Ghat(R/T0^m)=(Ghat R)/T0^m−m R(VT0)/T0^(m+1).               (3)

Every such flux has zero weighted boundary: mu R/T0^m→0 at both ends. Its derivative is integrable by (1) and the existing superexponential theta tails. Thus localization at T0 is legitimate, with explicit denominator growth rather than hidden conditioning.

For example a proposed rational certificate
Bhat=Ghat(R/T0^(2m))+S/T0^(2m)
is exactly the polynomial identity

T0^(2m+1)Bhat=T0 Ghat R−2m R VT0+T0 S.                      (4)

The middle term cannot be discarded. Equation (4) is an identity used to recover the original unweighted-in-T0 budget; it is NOT permission to multiply the original integral by T0^(2m+1) and infer the sign of the original integral.

## 3. A concrete flux and localized square test at degree two

This reexpresses an already independently proved quadratic curvature payment; it is not a new degree certificate. Put p=t²−alpha with real alpha. For alpha≥0 the root-deletion source is

Bhat=(L²/2)(T2+alpha T0)²−2T1²−2alpha T0².

For arbitrary real alpha the same polynomial source follows by the integrated pp''−p'^2 formula, without requiring real roots. Define

R=(L²/8)(5T1T2−T0T3)+(L/2)(−3T1²+T0T2)−T0T1
       +alpha(L²T0T1−2L T0²),
K=T0T2−T1²,
E4=T0T4−4T1T3+3T2².

The product rule Ghat(Tj Tk)=(T_(j+1)Tk+Tj T_(k+1))/2 gives the exact identity

Bhat=Ghat R+(L²/2)[alpha²T0²+alpha K+E4/8].                 (5)

The flux has total degree≤7 and source/remainder degree≤8, as in the preceding trial degree bounds. Coefficients alpha are fixed parameters and no next norm enters.

Let ell=log psi, with derivatives here in the original u coordinate. Then ell''=K/T0², and

Wnum=T0³T4−4T0²T1T3+T0²T2²+4T0T1²T2−2T1^4
     =T0^4[4(ell'')²+ell''''].

The prior independently audited THETA_CURVATURE_PAYMENT.md proves 4(ell'')²+ell''''>1254 for the original full theta. Hence g2=Wnum−1254 T0^4 is strictly positive on its distinguished orbit. The remainder in (5) is exactly

 [L(2alpha T0²+K)/(2sqrt(2)T0)]²
 +[L/(4T0)]² g2
 +(1254/16)L²T0².                                          (6)

This is a valid localized SOS with an independently proved positive generator. Bound (1) pays its denominator uniformly. It preserves alpha, both signed cross terms, and the polynomial boundary flux; it does not simply demand that every raw jet be positive.

For comparison, the exact normalized jet ratio recurrence is
R_j=T_j/T0,
R_(j+1)=2V R_j+a R_j, a=T1/T0,
−2V a=(T1²−T0T2)/T0²>17.                                  (7)

Although quotient differentiation creates apparent higher denominators, the exact recurrence reduces each R_j back to the single denominator T0. This is algebraic cancellation, not positivity of the ladder map.

## 4. Remaining all-degree question

Equations (1)–(7) supply a conditioned localization and an exact tested flux mechanism. They do not prove that higher-degree remainders have representations in a positive cone generated by already known inequalities. Additional generators cannot be asserted positive merely because they resemble g2: nonpositive normalized jets and the independently known indefinite local bridge matrices prohibit that shortcut.

Actual inverse-selection and exact degree must still be retained. Bound (1) controls neither the coefficients of the selected p_n nor its true prefix inverse, and the finite-constraint cyclic counterexample remains applicable to any invalid enlargement of that class. The missing step is an independently established, degree-controlled correlated remainder inequality, or a uniform construction of the localized certificate. No such construction is asserted here, at zero or positive shift.
