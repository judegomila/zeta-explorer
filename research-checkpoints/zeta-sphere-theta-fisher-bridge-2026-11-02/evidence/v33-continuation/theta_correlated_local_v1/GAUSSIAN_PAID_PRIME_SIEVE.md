# Sharp Gaussian compensation of a finite Euler sieve

Status: independent analytic review PASS. This controls the sieve defect on a fixed compact shift strip but does not prove positivity of the original bridge.

Use the actual complete-theta F and the real-even prime multiplier R_P from PRIME_SIEVE_BRIDGE_DEFECT.md. Fix0<=eta<1/2 and define
 K_P(eta)=sum_(p in P) [2(log p)/eta] sum_(k>=1)p^(-k/2)sinh(k eta log p),  (1)
with the continuous eta=0 value
 K_P(0)=sum_p 2p^(-1/2)(log p)^2/(1-p^(-1/2))^2.
The geometric series converges because eta<1/2. It can equivalently be evaluated as
 K_p(eta)=2r L sinh(eta L)/[eta(1-2r cosh(eta L)+r^2)].
Set
 S_P(z)=R_P(z)/R_P(0) * exp(-K_P(eta)z^2/2).           (2)
No zero or unknown pivot of F is used in this choice.

## 1. Exact signed phase bound on the complete compact strip

For z=t+ia,0<a<=eta, let theta=t log p, q_+=p^(-1/2+a), q_-=p^(-1/2-a). Both are less than1. The two factors of R_p give the absolutely convergent expansion
 -Im(R_p'/R_p)(t+ia)
       =-(log p) sum_(k>=1)(q_+^k-q_-^k)cos(k theta).        (3)
All coefficients q_+^k-q_-^k are positive. Therefore its minimum over t is attained at t=0 and equals -a K_p(a). Furthermore sinh(k a L)/a is increasing for a>=0, so K_p(a)<=K_p(eta). Thus
          -Im(S_P'/S_P)(t+ia)>=a[K_P(eta)-K_P(a)]>=0.      (4)
There are no R_P zeros in |Im z|<1/2. The exact product identity, with U_a(H)=-Im(H' conjugate H), now gives
 U_a(S_P F)/|S_P|^2
       =U_a(F)+|F|^2[-Im(S_P'/S_P)]>=U_a(F).              (5)
All source and correction terms are retained. For any polynomial, multiplying this identity by its squared value and integrating retains the same actual polynomial; it does not replace its inverse-selected coefficients.

The Gaussian constant is sharp within this class: at t=0,a=eta equality holds in the lower phase estimate for R_P. Any smaller K in exp(-Kz^2/2) makes the correction negative there. At eta=0 the statement follows by the continuous normalized limit.

## 2. Normalized origin and actual contraction domain

On the real axis the same calculation gives
 (log R_P)''(t)<=K_P(0)<=K_P(eta).
Hence log S_P is concave, even, and vanishes at0; in particular0<S_P(t)<=1. Thus multiplication by S_P is an ordinary L2 contraction. This is different from claiming the unmodified Euler sieve is a bridge contraction.

In the normalized origin limit,
 [ (S_P F)'^2-(S_P F)(S_P F)'' ]/S_P^2
        =(F'^2-FF'')+F^2[K_P(eta)-(log R_P)''].
The added term is nonnegative. This correctly pays the previously divergent central sieve defect. The comparison goes in the wrong direction to infer positivity of F from positivity of S_P F: recovering the original requires subtracting this nonnegative term. It is not a free reserve.

## 3. Two limits obstruct using this as an all-degree proof

First, for any nonempty finite P, K_P(eta) tends to infinity as eta approaches1/2 from below. Already one q_+ tends to1 in(3). No finite Gaussian constant of this type controls the entire open shift strip0<a<1/2 at once. An eta-dependent construction is possible, but this is not a uniform endpoint estimate.

Second, even for fixed eta, the compensated multipliers collapse as P expands through all primes. For p sufficiently large r<=1/2, and for every real t,
 log(R_p(t)/R_p(0))<=2log((1+r)/(1-r))<=8r,
 K_p(eta)>=K_p(0)>=2r(log p)^2.
For any fixed t!=0, summing the resulting bound
 log S_P(t)<=sum_(p in P) r[8-t^2(log p)^2]
(with harmless finitely many initial terms) tends to minus infinity. Indeed beyond a fixed prime the bracket is at most -1, and sum_p p^(-1/2) diverges, as follows already from divergence of sum_p1/p. Therefore
 S_P(t)->0 for every t!=0, while S_P(0)=1.
Since0<S_P<=1, dominated convergence gives
                    ||S_P q F||_2 ->0                    (6)
for every fixed polynomial q. This is strong convergence to the zero multiplier, not a nonzero limiting factorization of the theta transform. No claim about a normalized delta limit or unknown-pivot norm is made.

## 4. Exact useful result and remaining gap

There is a rigorous, optimal Gaussian compensation of the prime phase defect on each compact shift strip, with independently explicit constants. It preserves all original theta terms in the product identity. However it changes the function, yields only the forward inequality(5), has an endpoint-divergent cost and a zero large-prime limit. To prove the original target, one still needs a correlated lower bound for the compensated source that exceeds the explicitly subtracted term on the actual residual family. No such all-degree lower bound is supplied here.
