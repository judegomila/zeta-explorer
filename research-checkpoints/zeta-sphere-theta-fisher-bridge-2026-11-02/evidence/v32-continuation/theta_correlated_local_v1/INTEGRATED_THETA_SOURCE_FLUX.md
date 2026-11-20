# Exact integrated theta source flux and actual boundary payment

This companion links the signed spatial sources over a whole recovery interval. It gives an all-degree exact identity, finite full-theta tests in both parities, and an obstruction to discarding boundary flux. It does not establish a uniform lower bound for source minus adaptation.

## 1. All-degree density identity

Let D=d/du and let g_j be the reviewed midpoint moment density, so
 psi(u)^2 g_j(u)=(-1/4)^j partial_r^(2j)[psi(u+r)psi(u-r)] at r=0.
For every j>=0,
 psi² g_j=sum_{k=0}^j binom(j,k)(-1/4)^k D^(2k)[(D^(j-k)psi)²]. (1)
Proof: for P_m(u,r)=psi^(m)(u+r)psi^(m)(u-r), partial_r²P_m=D²P_m-4P_(m+1). The spatial derivative and index-raising operations commute. Apply the binomial theorem and set r=0. No positivity of any moment matrix is used.

Define f_(j,k)=(D^(j-k)psi)² and, for j>=1,
 F_j(u)=sum_{k=1}^j binom(j,k)(-1/4)^k [u² D^(2k-1)f_(j,k)-2u D^(2k-2)f_(j,k)+2 1_(k>=2)D^(2k-3)f_(j,k)],
with F0=0. Repeated integration by parts, using D³(u²)=0, gives exactly
 integral_a^b u²psi²g_j
 =integral_a^b [u²(psi^(j))²-(j/2)(psi^(j-1))²]+F_j(b)-F_j(a). (2)
For j=0 the negative term is absent. The owned symbolic checker independently solves for the differential polynomial flux and matches this explicit general formula through j=7; the general proof is the commuting identity(1).

## 2. Actual inverse-selected polynomial and finite-width transport

Fix the initial actual core optimizer z0 at a=1/8 in odd7 or even6, and let p be its monic polynomial. Write p(t)²=sum_j d_j t^(2j). Coefficients d_j may have either sign; no real-root or coefficient-positivity assumption is made.

The initial-optimizer signed source over[a,b], b=1/2, from the reviewed finite-width identity is
 J=B+DeltaF,
 B=2sum_j d_j integral_a^b [u²(psi^(j))²-(j/2)(psi^(j-1))²],
 DeltaF=2sum_j d_j(F_j(b)-F_j(a)).                       (3)
The true optimized gain remains J-K=B+DeltaF-K with the actual adaptation cost K=r^TA_b^-1r. Neither B nor DeltaF is dropped.

The endpoint checker reads only initial old/cross moments to obtain p. It evaluates full-theta jets through order16 using the previously reviewed complete-orbit error bounds, then evaluates the exact rational-coefficient flux. For B it uses the exact identity B=J-DeltaF and the already-certified source interval. Therefore these finite B bounds are correlated bookkeeping of existing integration, not an independent bulk quadrature or new proof of the target pivot.

## 3. Actual finite results

All units are h/(4pi), and all intervals below are conservative directed enclosures.

Odd7:
- DeltaF in(59080269549,92729703950).
- B in(82855091188,127225069813).
- K in(171601275310,182110794031).
Thus B alone is strictly smaller than K, and DeltaF alone is also strictly smaller than K. The reviewed correlated J-K is nevertheless positive. Both bulk and endpoint flux must be retained; independently widened subtraction does not resolve that small final surplus.

Even6:
- DeltaF in(140237779,142602532).
- B in(8076367,11159986).
- K in(103423429,104002529).
Thus B<K, whereas DeltaF-K>36235250 and B>8076367. Here the endpoint flux already covers the adaptation cost; the positive bulk adds reserve. These statements concern this actual initial-inverse polynomial, not arbitrary coefficients or all degrees.

Consequently a proposed source estimate that omits the finite-interval flux in this explicit diagonal-derivative integration-by-parts normal form and asks its bulk energy to pay adaptation fails in BOTH actual examples. This does not rule out a different decomposition with a different flux. The even6 finite recovery is consistent with its earlier certified adverse interval; no monotonicity was assumed.

## 4. Modular reflection links the regions but gives no free global reserve

For complete theta, psi is even, so each (psi^(m))² is even. Every surviving derivative in F_j(0) is odd, and the u,u² terms vanish: F_j(0)=0. At infinity every fixed derivative is superexponentially decaying, so F_j(infinity)=0. Thus for any fixed p, the boundary fluxes telescope to zero over a partition of the whole positive half-line. Internal positive transfers are offset elsewhere.

This is visible in the actual data. For even6, the combined flux 2sum d_j F_j(1/8) lies between-188532325 and-187659110, and at1/2 between-47421331 and-45929793. Its positive increment over the recovery interval partly reverses the earlier negative increment from0. For odd7, the combined flux at1/2 is between182083341035 and203762564524, so its increment from1/2 to infinity is strictly negative. These are actual theta counterexamples to assigning a nonnegative boundary increment to every spatial region.

Reflection therefore supplies an exact transfer law, not an extra positive term. A uniform correlated estimate must control where this transfer is spent together with B and K. The finite even6 boundary payment is useful evidence about the mechanism but not evidence of all-degree success. No target-pivot normalization, cumulative-tail positivity, or unproved sign continuation is used.

## 5. Moving optimizers incur an additional signed transport term

The reflection telescoping above is for the same fixed polynomial, including the initial optimizer used in J. If instead p follows the actual core optimizer z(u), let Phi(u,z)=2sum d_j(z)F_j(u) and let beta(u,z) denote the corresponding full-line bulk density in(3). At each fixed z the source density is beta+partial_u Phi. Hence, whenever the actual old matrix is positive and z is differentiable throughout[a,b],
 integral_a^b source(u,z(u))du
 =integral_a^b beta(u,z(u))du+Phi(b,z(b))-Phi(a,z(a))
   -integral_a^b (gradient_z Phi)^T z'(u)du.             (4)
Using z'=-A^-1(Lz+l), the last contribution is
 +integral_a^b (gradient_z Phi)^T A^-1(Lz+l)du.
It is a signed mixed term, not an automatically positive action. Thus allowing the polynomial to change between regions does not justify reusing the fixed-polynomial cancellation without a correction. No sign bound for this new mixed term is asserted; the numerical tests above deliberately use one fixed initial polynomial.
