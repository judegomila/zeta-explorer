# Actual-selection parity Ward identity and the one-sided defect

Status: independent analytic review PASS. The identity gives an explicit known-prefix reserve; its all-degree theta defect estimate remains unproved.

## 1. Use the actual inverse-selection, not the ambient cyclic space

At normalized shift a=0, let Λ=F′²−FF″ for the original full theta transform. Let L[r]=∫rΛ and assume the full polynomial prefix through degree n−1 is positive definite, n≥1. Let p_n be its actual orthogonality-selected monic extension, and p_{n−1} its preceding monic polynomial. Write h_j=L[p_j²]; h_{n−1}>0 is known, whereas h_n has no assumed sign.

Orthogonality and monicity imply the exact two identities

∫p_n p_{n−1}′Λ=0,
∫p_n′ p_{n−1}Λ=n h_{n−1}.

All boundary terms vanish by complete-theta/Gamma decay. Hence

−∫p_n p_{n−1}Λ′=n h_{n−1}.                                  (1)

Also t p_{n−1}−p_n has degree≤n−1, so

∫t p_n p_{n−1}Λ=h_n.                                         (2)

For any c>0, introduce the pole-free signed defect

D_c(t)=Λ′(t)+2ctΛ(t)
      =F′F″−FF‴+2ct(F′²−FF″).

Combining (1)–(2) gives

2c h_n=n h_{n−1}+E_{n,c},
E_{n,c}=∫p_n(t)p_{n−1}(t)D_c(t)dt.                           (3)

This couples the two parity ladders: Λ is even, D_c is odd, and p_n p_{n−1} is odd, so the integrand is even. No division by F or Λ, no next norm, and no positive-measure interpretation of Λ is used. Only the actual inverse-selected orthogonality is essential; (3) does not hold for arbitrary polynomial multiples from the preceding counterexample.

## 2. A precise target and its circular version

A useful sufficient arithmetic estimate would be an independently proved one-sided bound

E_{n,c_n}≥−(1−ε_n)n h_{n−1},  c_n>0, ε_n>0,                 (4)

with explicit c_n,ε_n controlled from already established theta data and the known prefix. It would imply h_n≥ε_n n h_{n−1}/(2c_n)>0.

The fact that E is a complete-theta integral does not by itself prove (4). Using (3) to choose ε_n from an assumed h_n>0 would be circular. Calling (4) a lower-pivot consequence without bounding D_c would merely restate the missing inequality. This packet supplies the exact signed target and known positive reserve, not an all-degree estimate.

The parameter c is a reference slope, not a new approximation to theta. The defect retains the entire kernel and all its derivatives. Degree-dependent c_n is allowed, but selecting it from an unknown target pivot would again fail the intended noncircular construction.

## 3. An absolute-defect bound already loses the actual base case

The previously independently established full-theta curvature inequality gives h_1>(17/2)h_0. Consequently at n=1,

E_{1,c}=2c h_1−h_0>(17c−1)h_0.

In particular E_{1,1}>16h_0. Therefore replacing the one-sided task by |E_{1,1}|<h_0 fails for actual theta, despite the target being positive. This is a large beneficial term, not a negative defect or a failure of the selected identity. More generally the same obstruction to that absolute criterion applies at n=1 for c≥2/17. No claim is made against smaller or degree-adaptive c.

## 4. Analytic benchmark: every pivot positive, absolute perturbation eventually impossible

Take F(t)=sech t, so Λ(t)=sech⁴t>0 and Λ′/Λ=−4tanh t. This is only a benchmark for the logic of the defect estimate, not a replacement for theta. All monic orthogonal polynomials and their norms h_j are well defined and positive.

Equation (1), followed by Cauchy–Schwarz in this genuinely positive benchmark measure, gives

n h_{n−1}=4∫p_n p_{n−1}tanh(t)Λ(t)dt
≤4 sqrt(h_n h_{n−1}).

Thus β_n=h_n/h_{n−1}≥n²/16, without using explicit polynomial formulas. For every fixed c>0,

E_{n,c}/h_{n−1}=2cβ_n−n≥c n²/8−n>n  whenever n>16/c.

So no fixed-c criterion |E_{n,c}|<n h_{n−1} can be uniformly necessary for positivity. Its failure is provably a positive correlated surplus. This tests both parity ladders simultaneously and requires no finite numerical certificate.

For comparison, the Gaussian benchmark F=e^{−t²/2} has Λ=e^{−t²}, D_1=0, and (3) gives the exact Hermite ratio h_n=(n/2)h_{n−1}. Thus (3) isolates precisely the non-Gaussian signed forcing rather than assuming it is small.

## 5. Relation to root-deletion payment

The target h_n in (3) is exactly the full position-minus-root-deletion form in the preceding packets. The Ward identity does not separately estimate those two large terms. It trades their difference for a known lower pivot plus a signed adjacent-parity correlation against D_c. The negative central common-scale contribution remains present within that complete correlation; no sign was assigned to it or to individual arithmetic pairs.

The open analytic question is a theta-specific lower bound for E_{n,c_n}, rather than a small absolute bound or ambient operator positivity. No such all-degree lower bound, all-shift result, or new finite pivot is established here.

## 6. Fixed positive shifts do not alter the selection identity

For a>0 define the normalized bridge density Λ_a(t)=−Im(F′(t+ia) conjugate(F(t+ia)))/a, with Λ_0=Λ as its continuous limit. It is even in t. For any fixed a at which the actual lower prefix is positive, the same proof gives

2c h_n(a)=n h_{n−1}(a)+∫p_n(t;a)p_{n−1}(t;a)[∂_tΛ_a(t)+2ctΛ_a(t)]dt.

All coefficients are frozen at that shift when integrating by parts in t. Fixed-shift Gamma decay gives the needed boundary limits; no derivative with respect to a or unknown limiting polynomial is used. Thus the exact identity is available at every fixed positive shift, but no estimate uniform in a or n follows. The numerical constants in Sections 3 and 4 concern a=0 only.
