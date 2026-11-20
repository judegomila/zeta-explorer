# Positive heat transport on actual theta orbits, with its exact signed jet remainder

This is an exact positive-half-line operator identity, not an all-degree bridge inequality. It identifies a candidate transport and the noncommuting remainder that cannot be omitted.

For h>=0 write z_n=pi n^2 exp(2h) and

    f_n(h)=4 exp(h/2) z_n(2z_n-3) exp(-z_n)>0,
    psi(h)=sum_(n>=1) f_n(h).

For s>=0 and lambda=exp(2s), define the positive diagonal multiplier

    m_s(z)=lambda^(5/4) [(2lambda z-3)/(2z-3)] exp(-(lambda-1)z).

Then f_n(h+s)=m_s(z_n)f_n(h) exactly. This is the actual heat damping exp(-(lambda-1)z_n), dressed by the full profile's polynomial factor; it retains every lattice orbit. It is not asserted that m_s<=1. Its supremum on z>=pi is finite, and division by that supremum yields a positive contraction on ordinary orbit l2. That orbit norm is not the complete lower-jet metric used by common anchors.

Let D=d/dh act on z_n by 2z_n partial_z. For every finite j the actual derivative feature has the exact transport

    psi^(j)(h+s)
     = sum_n m_s(z_n) f_n^(j)(h)
       + sum_(r=1)^j binom(j,r) sum_n [(2z_n partial_z)^r m_s(z_n)] f_n^(j-r)(h).

All sums converge locally uniformly on h>=0, s>=0, including at s=0. Thus differentiating the positive orbit multiplier creates an explicitly signed triangular jet remainder. There is no reason for it to be positive in the complete lower-block metric.

For computation the multiplier derivatives can be generated without numerical differentiation. Set L=log m_s and

    ell_1(z)=2z[2lambda/(2lambda z-3)-2/(2z-3)-(lambda-1)],
    ell_(r+1)=2z partial_z ell_r.

Then (2z partial_z)^r m_s=m_s times the r-th complete exponential Bell polynomial in ell_1,...,ell_r. All denominators stay separated from zero for z>=pi. Together with the polynomial recurrence and incomplete-gamma tail estimates in JACOBI_AND_ARITHMETIC_COUPLING.md, this supplies explicit finite-degree enclosures of the signed transport remainder on any specified pair of positive-h regions.

One can also normalize the positive masses as probabilities p_n(h)=f_n(h)/psi(h). The exact transported distribution is

    p_n(h+s)=m_s(z_n)p_n(h)/sum_m m_s(z_m)p_m(h).

This preserves positivity and all arithmetic correlations. But a positive change of probability law is not a contraction for the vector of differentiated features: the displayed signed Bell remainder is still present. Any claim that positive heat damping alone proves the common-anchor graph budget would therefore be missing this term.

The concrete next estimate is a relative bound on that remainder after whitening by the actual complete lower-degree block A, jointly with the regional cross-column directions. Neither an ordinary orbit-l2 contraction nor an absolute entrywise bound supplies that relative estimate. No uniform-in-degree bound is proved here; the certified negative H=1 spectral tail further prohibits promoting this transport to an all-region positivity theorem.

## A genuine cross-region order inequality

The multiplier is strictly decreasing in z when s>0, since its logarithmic derivative simplifies to

    (2z partial_z)log m_s
      =-2z(lambda-1)[1+6/((2lambda z-3)(2z-3))]<0.

Consequently, for any real increasing function V(n) with the required finite expectations,

    sum_n p_n(h+s)V(n) <= sum_n p_n(h)V(n).

This is an actual all-orbit monotone-likelihood-ratio statement between distinct positive h. To prove it, subtract the expectations and use

 Cov_p(m,V)=(1/2)sum_(n,m) p_n p_m [m_s(z_n)-m_s(z_m)][V(n)-V(m)]<=0.

Thus heat transport gives a signed covariance inequality on the increasing-function cone, not merely a formal positive multiplier. For a decreasing V the inequality reverses. Here V is a fixed function of the orbit index; if V also depends on h, its explicit change must additionally be retained.

For example the one-orbit logarithmic h-score is

    S(z)=f_n'(h)/f_n(h)=9/2+6/(2z-3)-2z,
    S'(z)=-2-12/(2z-3)^2<0.

At a fixed base h its expectation increases under this orbit reweighting. The full shifted score is S(lambda z), so there is also a negative explicit drift. Infinitesimally the exact complete-profile balance is

    (log psi)''(h)=E_p[-4z-24z/(2z-3)^2]+Var_p(S(z)).

This retains the positive arithmetic variance rather than discarding it. Higher differentiated features P_j(z)/P_0(z) need not lie in a common monotone cone, and whitening by A mixes them. Extending the displayed monotone-cone covariance control to those actual whitened features, while paying their explicit drift and Bell remainder, is the precise missing step; the order inequality alone does not establish the matrix-anchor budget.
