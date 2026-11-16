# Endpoint-corrected arithmetic approximation, uniform over the critical shift interval

Status: independent analytic review PASS. This removes the demonstrated arithmetic boundary layer and supplies uniform-in-shift error control at each finite polynomial degree. It does not prove the approximant's signed higher-degree form positive.

## 1. Retain the arithmetic mean correction explicitly

Use the bounded primitive H_N of ARITHMETIC_BOUNDARY_LAYER.md. Define the trapezoid-corrected expression
 Z_N(s)=A(s)[sum_(n<=N)n^(-s)+N^(1-s)/(s-1)-(1/2)N^(-s)],
 T_N(s)=(Z_N(s)+Z_N(1-s))/2.                              (1)
The pole at s=1 is canceled before evaluation. The exact remainder is
 xi(s)-Z_N(s)=A(s)delta_N(s),
 delta_N(s)=-s(s+1)integral_N^infinity H_N(x)x^(-s-2)dx.   (2)
This integral converges for Re s>-1, including the closed strip0<=Re s<=1 needed by both reflected terms. No zero information enters.

The correction is compulsory arithmetic information, not a fitted reserve. Exact endpoint values are
 Z_N(0)=Z_N(1)=1/2,
               2T_N(0)=2T_N(1)=1.                        (3)
Thus the spurious endpoint value1/2 of the previous Fourier approximant is repaired to the correct complete-theta value1 for every N.

## 2. Explicit derivative error envelopes

For sigma=Re s>=0 set, for k>=0,
 B_k(sigma,N)=(N^(-sigma-1)/8)
       *sum_(j=0)^k binomial(k,j)(log N)^(k-j) j!/(sigma+1)^(j+1),
and B_k=0 for k<0. Differentiation under the integral in(2) gives
 |delta_N^(r)(s)| <= |s(s+1)|B_r
             +r|2s+1|B_(r-1)+r(r-1)B_(r-2).             (4)
In particular r=0,1,2 provide fully explicit bounds for the remainder and its first two derivatives. Multiplication by A and the finite Leibniz formula give bounds for e=xi-Z_N and e',e''. For T_N, average the corresponding bounds at s and1-s; reflected derivatives have the expected alternating signs, irrelevant to absolute error envelopes.

For any fixed real polynomial p, the weighted L2 error norms E_r=||p(xi-T_N)^(r)||_2 satisfy
 sup_(0<=sigma<=1) E_r(sigma)
                 =O_p((1+log N)^r/N), r=0,1,2.           (5)
To justify uniformity, A and its derivatives are regular at s=0 and1 after cancellation, uniformly bounded on compact t sets, and have exponential Gamma decay times polynomial/logarithmic factors as |t| tends to infinity, uniformly in this compact sigma strip. The factors in(4) add only fixed powers of |t|. Hence their weighted squared integrals are finite uniformly in sigma. Constants depend on the actual polynomial coefficients and degree; no uniform actual-prefix conditioning is asserted.

## 3. Uniform error for the normalized bridge, including a=0

Freeze p. Write X=xi, Y=T_N, e=X-Y and define
 D_p(sigma)=integral p(t)^2 (|X(sigma+it)|^2-|Y(sigma+it)|^2)dt.
Both X and Y obey real functional symmetry. Their moduli are pointwise symmetric under sigma->1-sigma, so D_p'(1/2)=0, even when p is not a parity polynomial.

For each sigma the exact differentiation and Cauchy estimate give
 |D_p''| <= 4||pY'|| E1+2E1^2
       +2||pY''|| E0+2||pY|| E2+2E2 E0 =: Q_p(sigma,N).    (6)
No unknown target sign enters this bound. Let Q_* be any upper bound for Q_p on1/2<=sigma<=1. Since K_X-K_Y=D_p'/2, the fundamental theorem of calculus gives
 |K_X[p]-K_Y[p]|/a <= Q_*/2,
       a=sigma-1/2 in(0,1/2].                            (7)
The same bound holds in the continuous a=0 limit. With the established L_a=8K normalization,
 |(L_a^X[p^2]-L_a^Y[p^2])/a| <=4Q_* .                    (8)
The right side is O_p((1+log N)^2/N) uniformly over the entire closed critical shift interval. Thus the previously demonstrated endpoint boundary layer is absent in this corrected approximation, and division by a creates no artificial loss at the normalized origin. This is an error theorem, not a positivity theorem.

## 4. Exact physical profile and retained signed tail

The Fourier profile for2Z_N(1/2+iz) is
 phi_N^corr=psi_N+g_N-(1/2)f_N,
and that for2T_N is its even part. The last correction subtracts half the Nth complete theta orbit, exactly matching the arithmetic trapezoid term. Its negative-end expansion is
 phi_N^corr(u)=-2pi N exp(5u/2)+O_N(exp(9u/2)), u->-infinity.
Thus its even part still has a negative tail -pi N exp(-5u/2). Endpoint correction does NOT turn the finite profile positive or make the logarithmic-curvature theorem applicable. Scalar Hardy positivity still follows from its real even profile; higher-degree signed payment remains unproved.

## 5. Exact remaining requirement

A sufficient analytic all-degree result would give, for each actual inverse-selected p_n and a degree/shift-compatible N, a positive lower bound for the corrected normalized form L_a^Y[p_n^2]/a exceeding4Q_*. Equations(1)-(8) supply explicit independently verifiable error control without zeros and without the next pivot. They do not supply that signed lower bound. The constants remain tied to p_n and its actual inverse, so taking a uniform-in-degree limit without controlling them is not justified.
