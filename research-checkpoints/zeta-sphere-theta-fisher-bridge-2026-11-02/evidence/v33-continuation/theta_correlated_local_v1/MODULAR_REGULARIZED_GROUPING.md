# Functional-equation grouping of the regularized arithmetic approximant

Status: independent analytic review PASS. This grouping repairs the known scalar failure while retaining every counterterm. It proves no higher-degree target sign.

## 1. Symmetrize before estimating

Use X_N(s)=A(s)[sum_(n<=N)n^(-s)+N^(1-s)/(s-1)] from REGULARIZED_ARITHMETIC_PAYMENT.md, and define
                     Y_N(s)=(X_N(s)+X_N(1-s))/2.             (1)
Then Y_N(1-s)=Y_N(s) and Y_N(conjugate s)=conjugate(Y_N(s)). For 0<Re s<1 both terms are regular, and the exact xi function is approximated without a zero-side assumption. This is not deletion of the integral counterterm: it is present in both summands.

For s=sigma+it, 1/2<sigma<1, let tau=1-sigma>0. The previous Euler error bounds at sigma and tau yield
 ||p(xi-Y_N)||_2 <= (E0_sigma+E0_tau)/2=:E0_sym,
 ||p(xi'-Y_N')||_2 <= (E1_sigma+E1_tau)/2=:E1_sym.            (2)
The sign in Y_N' is minus for the reflected term, but the error bound uses its absolute norm. Complex conjugation handles the reflected -t, with the same real polynomial weight. Therefore
 |K[p]-Re integral p^2 Y_N' conjugate(Y_N)|
 <=||pY_N'||E0_sym+||pY_N||E1_sym+E0_sym E1_sym.             (3)
This is noncircular and applies to the actual fixed inverse-selected polynomial. It converges at rate O(N^(-min(sigma,tau))log N) for each fixed degree and shift, uniformly on compact subintervals of0<sigma<1 with polynomial fixed. No uniform control in the actual degree-dependent coefficients is asserted.

## 2. Exact theta-side realization

Let f_n(u)=4 exp(u/2)[2pi^2 n^4 exp(4u)-3pi n^2 exp(2u)]
                         *exp(-pi n^2 exp(2u)),
 psi_N(u)=sum_(n=1)^N f_n(u),
 g_N(u)=4pi N^3 exp(5u/2)exp(-pi N^2 exp(2u)),
 phi_N(u)=psi_N(u)+g_N(u),
 chi_N(u)=(phi_N(u)+phi_N(-u))/2.                           (4)
A direct Mellin integral gives
 integral_R phi_N(u)exp(izu)du=2X_N(1/2+iz),
 integral_R chi_N(u)exp(izu)du=2Y_N(1/2+iz).                 (5)
Indeed the extra g_N has transform
 s pi^(-s/2)Gamma(s/2)N^(1-s),
which is exactly twice the counterterm A(s)N^(1-s)/(s-1). Nothing has been discarded. Formula(5) initially holds in the convergent Mellin domain and the symmetric formula is valid in |Im z|<5/2. The profiles are real, and chi_N is even.

## 3. Scalar repair and an actual obstruction to a stronger shortcut

Let F_N(z)=2Y_N(1/2+iz). Evenness of chi_N and Parseval give, for every0<a<5/2,
 d/da integral_R |F_N(t+ia)|^2dt
              =8pi integral_0^infinity u sinh(2au)chi_N(u)^2du>0.  (6)
The scalar bridge for this grouped approximant is thus strictly positive. This repairs the N=1 scalar counterexample of the unsymmetrized approximant analytically, without a finite certificate.

However chi_N is not a positive theta profile. At u=0, every f_n(0)>0 and g_N(0)>0. At the opposite physical end, expansion of the finite series gives
 phi_N(u)=-2pi N(3N+1)exp(5u/2)+O_N(exp(9u/2)), u->-infinity.
The forward end is superexponentially small. Hence
 chi_N(u)=-pi N(3N+1)exp(-5u/2)+O_N(exp(-9u/2)), u->+infinity. (7)
It follows that chi_N has a real zero and is negative sufficiently far out, for EVERY finite N. This is an exact arithmetic-profile obstruction: the positive full-theta logarithmic-curvature argument cannot be transferred to chi_N. Scalar positivity in(6) uses a square and does not imply positive profile values or higher-degree bridge positivity.

## 4. Every fixed N has a negative spectral bridge somewhere in the critical shift strip

There is a stronger exact obstruction, not just negative physical profile values. At s=0 the regularized D_N(0)=N-N=0 and A has a finite limit, so X_N(0)=0. At s=1 the pole-counterterm cancellation gives X_N(1)=1/2. Therefore
                         F_N(i/2)=1/2.                    (8)
At the center,
 F_N(0)=(1/4)pi^(-1/4)Gamma(1/4) b_N,
 b_N=2sqrt(N)-sum_(k=1)^N k^(-1/2).
Here b_1=1 and
 b_(N+1)-b_N=2/(sqrt(N+1)+sqrt(N))-1/sqrt(N+1)>0.
Also Gamma(1/4)>integral_0^1 x^(-3/4)(1-x)dx=16/5, and pi<4. Hence
                   F_N(0)>4/(5sqrt(2))>1/2.               (9)
The continuously differentiable function |F_N(ia)|^2 has strictly decreased between a=0 and a=1/2. Thus for EVERY fixed finite N there is some a_N in(0,1/2) at which
               partial_a |F_N(ia)|^2 at a_N <0.            (10)
This is negative spectral bridge density at t=0. Continuity gives a negative open t interval. The density is even and has exponential decay in t, by the Gamma factors in the finite sum. The exponential-moment polynomial-density argument from HARDY_ZERO_PAIR_SUM_RULE.md therefore finds a negative polynomial quadratic form, in each parity, at some finite degree. This does not identify which degree or shift, nor the sign of any particular actual-theta residual.

Consequently no single fixed N in this grouped family can prove every degree throughout0<a<1/2. The scalar positivity(6) is fully consistent with this: the integral of the density is positive, while some polynomial weights detect its negative part. A degree-adaptive N could still work; that requires a further quantitative theorem rather than assigning this family all-order positivity.

## 5. Remaining all-degree question

This is a concrete functional-equation grouping rather than another zero-side criterion. It preserves the counterterm, supplies a rigorously controlled complete-xi limit, and passes the scalar test that the previous grouping failed. To become an all-degree payment proof, one must show that its signed higher-degree quadratic form exceeds the error(3) on each actual residual, with explicit degree-dependent margins. No such lower bound is proved. The negative tails(7) must remain in that analysis; asserting finite grouped profiles are positive or uniformly log-concave is false.
