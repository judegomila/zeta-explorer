# Exact pivot-resolved variation and actual theta admissibility-boundary obstruction

This companion uses the original signed theta core matrices, not a positive parent surrogate. It gives an exact inverse-conditioning recursion and proves that a degree-only bound cannot hold over all admissible cutoff intervals, already at the known four-dimensional prefixes of both parities. It does not exclude uniformly controlled, carefully selected degree-dependent partitions.

## 1. Resolve one known prefix pivot, retaining the actual cross forcing

Let B(H)=[[A,b],[b^T,c]] be an actual positive prefix, with A>0, z=-A^-1b, s=c-b^TA^-1b>0. All entries and derivatives are taken in a fixed polynomial basis. Set L=A', l=b', r=Lz+l and q=(z,1)^T B'(z,1)=s'. The constant-at-the-evaluation-point congruence T=[[I,z],[0,1]] gives
 T^T B T=diag(A,s),
 T^T B' T=[[L,r],[r^T,s']].                         (1)
No derivative of T is being taken in(1). Therefore the generalized eigenvalues of (B',B) equal the eigenvalues of
 K=[[C,w],[w^T,d]],
 C=A^-1/2 L A^-1/2, w=A^-1/2 r/sqrt(s), d=s'/s.    (2)
The actual relative operator norm tau_B=||B^-1/2 B' B^-1/2|| is exactly ||K||. With tau_A=||C|| and E=r^TA^-1r,
 max(tau_A,|s'/s|,sqrt(E/s)) <= tau_B
 <= max(tau_A,|s'/s|)+sqrt(E/s).                    (3)
The upper bound follows by separating diagonal and off-diagonal blocks; the lower bounds follow from compressions and applying K to its last coordinate. No sign of L or B' is required. E is the actual regression forcing, not a parent norm. These quantities are unchanged by constant old-basis transformations and constant scaling of the newly appended polynomial.

For nested positive prefixes B_0,...,B_n this yields the degree-explicit sufficient variation estimate
 integral tau_n <= integral tau_0
 +sum_(j=1)^n integral |s_j'/s_j|
 +sum_(j=1)^n integral sqrt(E_j/s_j).               (4)
The sharper recursive max form in(3) can be retained instead. Every s_j here is a KNOWN prefix pivot. Applying(4) to the next unknown target by assuming s_next>0 would be circular and is not done. Formula(4) identifies logarithmic pivot variation and forcing divided by a known square-root reserve as the intrinsic debts. It does not prove either debt bounded uniformly in degree. In particular, signed determinant-log cancellation cannot erase either term in(3).

## 2. A genuine theta singular boundary occurs in both parity examples

Use H in[1/8,1/2] and full-theta moments M_j(H)=2 integral_0^H u^2 psi(u)^2 g_j(u) du. Consider these known four-dimensional matrices:
 B_even=[M_(i+j)]_(i,j=0..3), on 1,t^2,t^4,t^6;
 B_odd =[M_(i+j+1)]_(i,j=0..3), on t,t^3,t^5,t^7.
Their leading three-dimensional A blocks are positive throughout this interval: the starting core is positive, and the archived local even3x3 and odd3x3 positivity results give A'>0 here. The precise positive-congruence convention and sources are in RELATIVE_FLOW_CONDITIONING.md Section4.

The independently certified regional data in REGIONAL_METRIC_COMPENSATION.md give:
 even: -743414<s(1/8)<-735368, and s(1/2)>46555344;
 odd:  -347755655<s(1/8)<-342212016, and s(1/2)>3729767162.
These are the even6 and odd7 known core pivots, not the unknown even8 or odd9 target pivots. Thus each B has inertia(3+,1-) at1/8 and is positive at1/2.

Complete theta and its finite derivatives are real analytic on this compact positive-H interval. Consequently s is real analytic because A stays invertible. It is not identically zero. Its zeros on this interval are finite; endpoints are nonzero. Let H_* be its largest zero. Then
 1/8<H_*<1/2, and B(H)>0 for H in(H_*,1/2].
There is an integer m>=1 and a real analytic a with a(H_*)>0 such that
 s(H)=(H-H_*)^m a(H) near H_* on its right.         (5)
No claim that m is odd or that there are no other zeros is needed.

## 3. Unbounded actual relative variation, including indefinite local densities

By(3), for any H_*<a<b<=1/2,
 integral_a^b tau_B >= integral_a^b |s'/s|
 >= |log(s(b)/s(a))|.                             (6)
For fixed b, (5) therefore gives
 integral_a^b tau_B >= m log(1/(a-H_*))+O(1),
 as a decreases to H_*.
This is an actual complete-theta obstruction in both parity ladders. Already in dimension four, no bound depending only on degree can cover ALL positive-prefix intervals in this fixed compact spatial range. The interval remains admissible at every a>H_*; its intrinsic conditioning budget nevertheless diverges. Neither monomial scaling nor replacing a Euclidean eigenvalue by the invariant metric removes this singularity. Equation(6) does not assume B'>=0 and remains valid where its local density is indefinite.

There is also a nonasymptotic form without root multiplicity estimates. For any finite certified M>=sup_[H_*,b]|s'|, the mean-value theorem gives s(a)<=M(a-H_*), hence
 integral_a^b tau_B >= log(s(b)/(M(a-H_*)))          (7)
whenever the right side is positive. M exists and is bounded using only the known three-dimensional A inverse, known full-theta local target matrix, and q=s'. This note does not provide a numerical enclosure of H_* or M; its logarithmic obstruction is analytic, with the endpoint signs rigorously certified already.

## 4. Scope for the source problem

These B matrices are precisely possible OLD metrics for the next even8/odd9 targets. Their vanishing known prefix pivot is therefore a noncircular obstruction to an unrestricted inverse bound before either new target is considered. It is not a counterexample to either next target sign. Choosing H=1/2 avoids this particular singularity, as the existing regional certificates already show.

A successful uniform partition argument must keep its actual pivots away from such boundaries in an intrinsic sense, or pay the exact variation/forcing costs in(3)-(4). The quantitative remote-tail construction supplies existence but has its separately established expensive comparison cost. The present result does not prove that an inexpensive nearby choice is impossible. Conditioning control, source quadrature accuracy, and positivity of the complete correlated source remain different tasks.
