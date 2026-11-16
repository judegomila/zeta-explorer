# Eventual positivity of shift-Taylor coefficients at each fixed degree

This structural statement eliminates an infinite tail of shift-Taylor matrix coefficients at any fixed polynomial degree. It does not prove the remaining finite coefficient matrices positive, give a uniform degree bound, or prove RH. It uses actual signed theta densities and an independently available fixed-degree local-tail theorem, not an unknown integrated target pivot.

## 1. Exact coefficient family

For either fixed finite parity space, let L(u) be its real symmetric complete-theta local matrix, including the factor2u²psi(u)². Its normalized shifted tail Gram is
 B(a,H)=integral_H^infinity sinhc(2au)L(u)du
       =sum_(k>=0) (2a)^(2k)/(2k+1)! T_k(H),
 T_k(H)=integral_H^infinity u^(2k)L(u)du.            (1)
For every bounded complex a set, complete theta and all finitely many derivatives decay faster than any exponential in u. Hence entrywise absolute domination permits this power-series interchange and uniform convergence on compact a sets. No Fourier positivity is assumed.

The coefficients are signed integrated matrices. In particular, positive scalar factors u^(2k) do not by themselves make T_k positive.

## 2. A paid core-versus-window estimate

Fix degree first. The independently audited Gaussian-tail argument in QUANTITATIVE_ADMISSIBLE_PARTITION.md supplies a finite R>0 such that L(u)>0 for all u>=R. This is local positivity at this fixed degree, not a universal local tail for all degrees.

Choose any R<S<T and a verified positive matrix reserve
 integral_S^T L(u)du >=lambda I, lambda>0.
Such a lambda exists by continuity and pointwise positivity on the compact window. An explicit enclosure can use the same complete-theta Gaussian lower bound or direct interval integration. Let M be any finite verified bound satisfying
 integral_0^R ||L(u)|| du <=M.
A coefficient-wise absolute row-sum integral gives one computable M without evaluating an unknown target Schur sign.

For every0<=H<=R and every integerk>=0, split the integral into the possibly indefinite core and the positive region. Since L(u)>=0 for u>=R,
 T_k(H) >= [lambda S^(2k)-M R^(2k)] I.             (2)
Indeed the core negative part is bounded below by -M R^(2k)I. On[S,T], u^(2k)>=S^(2k) in Loewner order because L is positive there; the other regions beyond R are nonnegative. No signed core contribution is declared positive or dropped without its debit.

Therefore any integer K with
                 (S/R)^(2K)>M/lambda              (3)
ensures T_k(H)>0 for ALL k>=K, uniformly0<=H<=R. For finite H>=R, positivity follows directly from the positive local tail, so the same eventual coefficient conclusion covers every finite cutoff H>=0. The lower bound in(2) is only stated on H<=R, where the chosen positive window is included.

All quantities in(2)-(3) are finite-degree, explicit-in-principle theta quantities. Neither the next integrated pivot nor positivity of any earlier T_k is a premise. This is a one-sided sufficient bound; it need not give the smallest K.

## 3. Finite remainder of the shift problem

For a fixed finite degree, the infinite shift series splits exactly into
 B(a,H)=P_<K(a,H)+R_K(a,H),
 P_<K=sum_(k=0)^(K-1) (2a)^(2k)/(2k+1)! T_k(H),
 R_K>=0 for real a and finite H>=0.                (4)
For a>0 the tail is strictly positive once at least one coefficient covered by(3) is included. Thus a verified nonnegative finite matrix polynomial P_<K would suffice for full positive-shift positivity at that degree. Proving each early coefficient positive is a stronger sufficient test, not a necessary condition; their signs and cancellations must be evaluated honestly. Formula(4) does not assert that either test succeeds.

This can supply a finite-degree alternative to endlessly sampling a: the high coefficient tail is analytically paid, leaving a finite correlated polynomial matrix problem. It is compatible with the direct signed shift-slab certificates, which currently give more efficient quantitative bounds in the tested low degrees.

## 4. Why this does not close the all-degree gap

The available R, the positive-window eigenvalue lambda and the negative-core envelope M depend on degree and on the chosen coordinates. Their combined ratio in(3) can be very large. The existing constructive Gaussian admissibility estimate has log Z_loc of order n² log n and does not supply a uniformly small coefficient cutoff K. No numerical K or early-coefficient positivity certificate is claimed here.

An all-degree proof would still need a uniform structural inequality controlling the finite signed remainder P_<K across degree, or a substantially sharper degree-dependent mechanism whose early matrices can be proved positive without checking an unbounded list. Eventual positivity in k at each fixed degree cannot exchange the quantifiers and become positivity for every degree at a fixed k. Neither the observed success of finite shift slabs nor the theorem(2) permits that exchange.
