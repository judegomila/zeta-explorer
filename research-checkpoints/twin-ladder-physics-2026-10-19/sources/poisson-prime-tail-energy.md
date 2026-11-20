# Poisson domination removes the sum-frequency covariance channel

18 October 2026. New structural lemma for the original finite-rectangle curve criterion. Independently checked in an internal mathematical review. The remaining actual-prime energy estimate is not proved.

## 1. Safe domination of the finite-domain left edge

Translate the left edge to Re(s)=0. Let the target be z=x+iT, x>0, inside the finite rectangle D. Let omega_L be its unnormalized harmonic measure on the left edge, with mass w_L. Define the probability measure on the whole vertical line

dP_x(u)=x/[pi(x^2+(u-T)^2)] du.

For every bounded continuous nonnegative function f on that line,

integral_left f d omega_L <= integral_R f dP_x.                 (1)

Proof: the Poisson extension of f is nonnegative harmonic on the right half-plane. On the left edge it agrees with f; on the other three edges it is nonnegative. It therefore majorizes the rectangle's harmonic function whose boundary values are f on the left and zero on the other edges. The maximum principle proves (1). Bounded nonnegative measurable data follow by the usual limiting argument. We only use continuous data here.

Take f=(c+L_Q)_+, which is bounded and continuous for each finite Q. The finite-rectangle bound therefore gives the sufficient condition

w_L log 2 + integral_R (c+L_Q(u))_+ dP_x(u)
                 + w_R R + w_H B <0.                          (2)

The right and horizontal terms are retained exactly. No bound on zeta outside the finite rectangle is required: only the explicitly defined finite Euler product is extended in f. The measure in (1) is unnormalized on the finite left edge; an erroneous normalization would lose the factor w_L in (2).

## 2. Exact Poisson moments of the full finite Euler logarithm

Write n=p^j with p<=Q, j>=1, and set
b_n=(1-p^(-jh))p^(-j s0)/j; set b_n=0 otherwise.
Then L_Q(u)=-sum_(n>=2) b_n cos(u log n), and sum b_n<infinity.
The Fourier transform of P_x is exp(-x|lambda|), so

mu_x=integral L_Q dP_x=-Re sum_n b_n n^(-x-iT)
     =log|1/V_Q(s0+x+iT)|.                                  (3)

For any m,n>=2, direct multiplication of cosines and subtraction of their means yields

Cov_Px(cos(u log m),cos(u log n))
 =cos(T log(m/n))/2 * [(min(m,n)/max(m,n))^x-(mn)^(-x)].       (4)

The entire sum-frequency term cancels because exp(-x log(mn))=m^(-x)n^(-x). This cancellation is exact; it is not a sign assumption about prime correlations.

Define the actual weighted prime-power tail
A(v)=sum_(n>=v) b_n n^(-x-iT).
The variance consequently has the positive representation

v_x=Var_Px(L_Q)
   =x integral_1^infinity v^(2x-1)|A(v)|^2 dv.                (5)

Indeed x integral_1^min(m,n) v^(2x-1)dv=(min(m,n)^(2x)-1)/2, which is exactly the coefficient in (4) after multiplying by (mn)^(-x). The expanded integral is absolutely summable, since its absolute coefficient is at most b_m b_n/2; hence all exchanges are justified. The sign convention in A is immaterial for its modulus.

For the first-prime part alone, let a_p=(1-p^(-h))p^(-s0). Equation (5) becomes

v_x,prime=x integral_1^Q v^(2x-1)
       |sum_(v<=p<=Q) (1-p^(-h))p^(-(s0+x)-iT)|^2 dv.        (6)

The full higher-power remainder obeys the previously derived |R|<=C(s0), so
sqrt(v_x)<=sqrt(v_x,prime)+C(s0), and its mean costs at most C(s0). No prime-power tail is discarded.

## 3. A concrete sufficient arithmetic budget

Set a=c+mu_x. If a>0, the elementary clipping inequality gives

integral (c+L_Q)_+ dP_x <= a+v_x/(4a).                       (7)

Thus (2) follows if

a>0 and w_L log 2+a+v_x/(4a)+w_R R+w_H B<0.                 (8)

Equations (3) and (5), or the prime-only version (6) with the explicit higher-power payment, are the exact arithmetic quantities to estimate. They involve the actual fixed coefficients and one positive integrated endpoint energy. A supremum over all prime blocks or every partial endpoint is unnecessary. Every target carrier and all analytic boundary inputs are still required.

## 4. What this gain does and does not buy

The harmonic geometry has genuinely removed one covariance channel and has converted the other into a transparent positive tail energy. It has also avoided a potentially expensive truncation of the Poisson carrier tails by the domination argument. It has not bounded the tail energy or the signed mean.

For scale checking only, suppose a stronger block/endpoint estimate bounds unweighted prime sums at scale P by C P^theta (log T)^kappa, uniformly on the tails needed for summation by parts, with theta<s0+x. Then the corresponding weighted tail allowance is O(v^(theta-s0-x)(log T)^kappa), apart from initial bounded scales. Substitution into (6) gives an integral with power

v^(2(theta-s0)-1).

The x-dependent gain in the shifted coefficients cancels against the v^(2x) weight. Thus merely reusing a pointwise exponent does not improve its critical threshold theta<s0. At theta=s0 the integral has logarithmic growth; at theta>s0 it has a positive cutoff power. This is a check on that stronger input, not an assertion that (6) requires a pointwise exponent bound. Joint cancellation inside the nested tails can still make (6) smaller than separate endpoint allowances.

The known local mean-value and fixed-prime pointwise estimates checked in the companion notes do not establish (8). The new research question is an effective uniform bound for this particular integrated actual-prime tail energy and its signed mean, small enough for the exact finite-rectangle budget. No all-height curve or new literature record is claimed.
