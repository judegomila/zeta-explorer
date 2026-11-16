# Exact rank-one Euler sieving and its compulsory bridge defect

Status: independent analytic review PASS. This is a rank-one-specific intermediate identity and a counterexample to a positive-operator shortcut. It does not assert negativity of the original theta bridge.

## 1. A property specific to the square-orbit arithmetic

Let
 f(u)=4exp(u/2)[2pi^2 exp(4u)-3pi exp(2u)]exp(-pi exp(2u)).
The original complete theta profile has the exact dilation/translation expansion
 psi(u)=sum_(n>=1)n^(-1/2)f(u+log n).                    (1)
For a finite set of primes P, set r_p=p^(-1/2), L_p=log p, and let T_h g(u)=g(u+h). Define the finite operator
 A_P=product_(p in P)(I-r_p T_(L_p)).
Möbius inclusion-exclusion gives exactly
 A_P psi(u)=sum_(n>=1, gcd(n,product P)=1)n^(-1/2)f(u+log n). (2)
All sums and their fixed-order u derivatives converge absolutely at every fixed real u, so this finite operation involves no formal infinite Fourier Euler product. Since f(u+log n)>0 for u>=0, the right side is strictly positive on the positive half-line. The operator commutes with every fixed derivative polynomial p(iD), so the actual selected residual is not replaced by an auxiliary one.

This arithmetic sieve uses the rank-one square spectrum and multiplicative integer indices; it is additional information beyond modular profile positivity. However (2) supplies no positivity statement on the negative half-line and no bridge quadratic inequality.

## 2. Positive symmetric Euler operator and the exact cost

On L2(R), translations are unitary and T_h^*=T_(-h). Thus
 B_P=A_P^* A_P
is a bounded strictly positive invertible operator for every finite P. In Fourier variables its multiplier is
 R_P(t)=product_(p in P)(1-2r_p cos(tL_p)+r_p^2)>0.        (3)
It preserves real even functions. Let F be the actual theta transform and G_P=R_P F. For any real smooth F and positive real R, direct differentiation gives
 [G'^2-GG'']/R^2=(F'^2-FF'')-F^2(log R)''.              (4)
All mixed F F' terms cancel exactly. For our prime product,
 (log R_P)''=sum_(p in P) k_p(t),
 k_p(t)=2r_p L_p^2[(1+r_p^2)cos(tL_p)-2r_p]
                    /(1-2r_p cos(tL_p)+r_p^2)^2.       (5)
Each k_p changes sign. These signed terms cannot be discarded merely because B_P is a positive Hilbert-space operator or because the unsymmetrized orbit sum in(2) is positive on u>=0.

For every real polynomial q, the exact bridge comparison is therefore
 integral q^2(G_P'^2-G_P G_P'')
 =integral q^2 R_P^2(F'^2-FF'')
       -integral q^2 R_P^2 F^2 sum_p k_p.              (6)
The same actual inverse-selected q may be inserted. This formula preserves its coefficient correlations; it does not assume the first integral is positive or substitute a parent norm for the target.

## 3. A rigorous actual-theta obstruction at the center

At t=0,
 k_p(0)=2r_p(log p)^2/(1-r_p)^2>0.
The sum over all primes diverges. An elementary reason is that k_p(0)>=1/p for all sufficiently large p and sum_p1/p diverges: otherwise the finite Euler products product_(p<=x)(1-1/p)^(-1) would remain bounded, while their positive expansions contain every integer n<=x and hence dominate the divergent harmonic sums.

For the original complete theta,
 F(0)=integral psi>0,
 F'(0)=0,
 -F''(0)=integral u^2 psi>0,
so C_theta=(F'^2-FF'')(0)/F(0)^2 is a finite positive constant. Choose a finite prime cutoff with sum k_p(0)>C_theta. Equation(4) then proves
                         (G_P'^2-G_P G_P'')(0)<0.       (7)
This is an existence theorem about applying the specified positive Euler operator to the actual theta transform; no RH assumption or unknown pivot sign is used. It does not require a numerical prime cutoff. Continuity gives a negative spectral interval. Because finite trigonometric multiplication preserves the exponential real-axis decay, polynomial-density detection produces negative moment directions in both parities at some finite degree.

The original transform F has not been shown negative. Rather, the explicitly positive symmetric sieve operator is not positivity-preserving for the bridge. The diverging quantity is the *relative* compulsory debit in(4)-(5); no claim that the unnormalized negative value diverges is made.

## 4. What a viable Euler-product lemma would still need

The arithmetic identity(2) is real additional structure. A successful use of it must pay the complete signed prime-curvature term in(6), including its growing central debit, with a correlated source estimate. Treating the Euler sieve as a bridge contraction or a positive bridge-preserving map is disproved by(7). Sending the prime cutoff to infinity with a fixed relative reserve is likewise unavailable. No bound paying this defect for the actual residual family is proved here; retaining the original polynomial and every term of(6) is necessary for any subsequent attempt.
