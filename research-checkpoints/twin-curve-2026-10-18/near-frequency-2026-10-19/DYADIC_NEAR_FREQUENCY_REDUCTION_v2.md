# A near-frequency sufficient target for the first-prime Poisson variance

19 October 2026. Bounded, self-contained derivation extending the reviewed Poisson tail identity. Version 2 makes the constant loss and comparison with the existing exact criterion explicit. Prepared for independent review. No all-height bound, improved exponent, or publication is claimed.

## 1. Setup and exact diagonal/off-diagonal decomposition

Fix s>1/2, h>0, x>0, Q>=2, and a real carrier T. Put b=s+x,

a_p=(1-p^(-h))p^(-s),
S(t)=sum_(p<=Q) a_p cos(t log p),
z_p=a_p p^(-x-iT).

All moments use the complete Poisson probability measure of width x centered at T. The reviewed identities give

m=E S=Re sum_(p<=Q) z_p,
V=Var(S)=x integral_1^Q v^(2x-1)|sum_(v<=p<=Q)z_p|^2 dv.

Equivalently, define for p<q

W_x(p,q)=(p/q)^x-(pq)^(-x)=(p^x-p^(-x))q^(-x)>0.

Then

V=D_diag+sum_(p<q<=Q) a_p a_q W_x(p,q) cos(T log(q/p)),       (1)
D_diag=(1/2)sum_(p<=Q) a_p^2(1-p^(-2x)).

The diagonal is explicit, nonnegative, and at most Z(2s)/2, where Z(r)=2^(-r)+2^(1-r)/(r-1). Individual off-diagonal terms are signed. Nonnegativity of V does not license discarding any such term in an upper bound.

For a literal dyadic ratio decomposition, partition the pairs in (1) by 2^ell<=q/p<2^(ell+1), ell=0,1,... . The resulting finite sum is exact, but positivity alone supplies no useful individual upper bound for its signed ratio bands. The additional ordered-block structure below is what permits a rigorous far-frequency payment.

## 2. Ordered blocks make every separated mixed term rank one

Let R=2^M for any positive integer M, let L=log R, and fix an offset theta in [0,L). Partition the positive real axis into blocks

I_j=[exp(theta+jL), exp(theta+(j+1)L)), j in Z.

Use only primes p<=Q. Write the lower and upper endpoints as L_j and U_j. Only finitely many blocks are nonempty. For each block define

G_j=sum_(p in I_j,p<=Q) z_p,
F_j=sum_(p in I_j,p<=Q) z_p(p^(2x)-1),
A_j(v)=sum_(p in I_j,p<=Q,p>=v) z_p,
E_j=Var(sum_(p in I_j,p<=Q) a_p cos(t log p))
   =x integral_1^(U_j) v^(2x-1)|A_j(v)|^2 dv.

Empty blocks have zero energy and zero sums. A nonempty block has U_j>1. For j<k every prime in I_j is smaller than every prime in I_k. Consequently the exact cross term is

2 Cov(S_j,S_k)=Re(F_j conj(G_k)),
V=sum_j E_j+sum_(j<k) Re(F_j conj(G_k)).                    (2)

No partial-endpoint estimate is used in this factorization. It follows directly from the ordered-pair factorization of W_x in (1), with every coefficient and carrier phase retained.

## 3. Positivity pays far blocks with an explicit cutoff-independent constant

Set H(y)=(y^(2x)-1)/2 for y>=1. The tail formula implies

|F_j|^2<=4 H(U_j) E_j.                                    (3)

Indeed F_j=2x integral_1^(U_j) v^(2x-1)A_j(v)dv, and Cauchy proves (3). If I_k has a nonempty lower block, then L_k>1, and the constant tail on [1,L_k] gives

|G_k|^2<=E_k/H(L_k).                                      (4)

Thus for j<k with nonzero terms,

|Re(F_j conj(G_k))|
 <=2 sqrt(H(U_j)/H(L_k)) sqrt(E_j E_k)
 <=2 R^(-x(k-j-1)) sqrt(E_j E_k).                         (5)

The last step uses U_j<=L_k and
(U_j^(2x)-1)/(L_k^(2x)-1)<=(U_j/L_k)^(2x).
The possible first block extending below 1 creates no gap: its lower endpoint is never used in (4) against an earlier nonempty block.

Define E(theta)=sum_j E_j and the exact block-distance contribution

C_d(theta)=sum_j Re(F_j conj(G_(j+d))), d>=1.

Equation (2) becomes V=E(theta)+sum_(d>=1)C_d(theta). For any integer m>=1,

|sum_(d>=m) C_d(theta)|
 <=[2 R^(-x(m-1))/(1-R^(-x))] E(theta).                  (6)

To prove this, first use (5) and sum_j sqrt(E_j E_(j+d))<=E(theta), then sum the geometric series. All actual sums are finite; extending the positive allowance is harmless. This is a rigorous near/far decomposition by block distance, retaining the near terms exactly and paying the complete far tail.

In particular,

V<=C(x,R) E(theta),
C(x,R)=1+2/(1-R^(-x)).                                   (7)

The constant is independent of Q, T, and h. No sign of a mixed term is presumed. The estimate can lose useful cancellation between blocks, so it is a sufficient bound, not an equality or an improvement over the exact tail norm in every instance. Adjacent blocks have no decay allowance: their correlation factor in (5) is at most 1. For fixed R, C(x,R) is asymptotic to 2/(x log R) as x decreases to zero; the estimate is not uniform in that limit.

## 4. Average the offset to obtain a single near-frequency arithmetic target

Average (7) over the continuous real offset theta uniformly in [0,L), not over only finitely many integer dyadic offsets. A pair p<q lies in the same block for the fraction

w_L(p,q)=(1-log(q/p)/L)_+

of offsets. Therefore the averaged local energy is exactly

E_near=D_diag+N_near>=0,
N_near=sum_(p<q<=Q) a_p a_q W_x(p,q)
       * (1-log(q/p)/L)_+ * cos(T log(q/p)),               (8)

and

V<=C(x,R)[D_diag+N_near].                                (9)

Every off-diagonal pair in (8) satisfies q/p<R. The triangular weight is essential to this exact averaged identity. Pairs straddling arbitrary block boundaries are handled by the averaging, not omitted.

One may also split the original sum in (1) exactly as V=E_near+O_remaining, where O_remaining uses the complementary weight 1-w_L. Equations (8)--(9) imply

-E_near<=O_remaining<=[C(x,R)-1]E_near.

This does not assert that the remaining pairs are small individually or that they have a favorable sign. Their collective effect is controlled by the positive local energies, with the stated constant loss. Positivity only implies N_near>=-D_diag; the required upper bound for N_near remains an arithmetic problem.

For R=2 the constant may be large when x is small. At the illustrative current widths x=.86796-.834 and x=.875-.834, ordinary evaluation gives C approximately 86.97 and 72.38, respectively. These rounded values are not interval certificates. One can choose the dyadic grouping M=ceil(1/(x log 2)), giving R^(-x)<=exp(-1) and C(x,R)<=1+2/(1-exp(-1)), approximately 4.164. The corresponding near-frequency window has log R at least 1/x. This choice trades a broader ratio window for a smaller constant and supplies no cancellation estimate. As x tends to zero it requires an expanding window; when R>=Q/2, essentially all prime ratios in the cutoff are retained and localization gives little benefit.

## 5. Exact use in the full finite-rectangle criterion

For s>1/2, the previously reviewed absolute square split gives

C_rem(s)=Z(2s)/2+C3(s),
|L_Q+S|<=C_rem(s).

Keep all original analytic hypotheses, and suppose m>=m_lower has been certified at the target. Set

a0=c+C_rem(s)-m_lower,
Bstar=-w_L log 2-w_R R_right-w_H B_horizontal,
J=4 Bstar(Bstar-a0).

A sufficient arithmetic test is

Bstar>0, a0<Bstar,
N_near<J/C(x,R)-D_diag.                                  (10)

Indeed (9) gives V<J, and the sharp two-moment clipping test proves the required Poisson-dominated finite-rectangle inequality. The new near-energy condition is a stronger sufficient condition than the existing exact requirement V<J: its constant loss can matter decisively. It is not an automatically weaker arithmetic criterion or an established net gain. The mean condition is separate and has not been estimated here. Alternatively, the upper bound (9) can replace v1 in each monotone square-refinement bound from the previous note.

Denominator zero-freeness on a neighborhood of the closed rectangle, its positive lower carrier height, the left-ratio bound, the right and horizontal boundary bounds, x equal to the target's horizontal distance, the actual carrier T, effective onset, and every-target coverage remain required. No zeta bound outside that rectangle is imported.

## 6. Relation to uniform endpoint bounds and the existing checkpoint

The target (10) controls one aggregate signed near-frequency pair sum and a separate signed mean. It requires no upper bound for every individual prime block, endpoint, or ratio band. For comparison, a uniform tail envelope |A_j(v)|<=M_j implies E_j<=H(U_j)M_j^2, so a family of such bounds with a sufficiently small summed payment implies (7)'s criterion. The integrated aggregate condition does not recover those same pointwise envelopes.

This distinction is genuinely strict as a statement about the kinds of information, even using actual prime coefficients. For example take Q=3, 0<b<1, and T=(2n+1)pi/log(3/2). Put d_p=a_p p^(-x). The two phases are opposite, and d_2/d_3<(3/2)^b<3/2, so |d_2-d_3|<d_3. The exact tail energy is

E=H(2)(d_2-d_3)^2+[H(3)-H(2)]d_3^2<H(3)d_3^2.

Choose M between sqrt(E/H(3)) and d_3. Then E<H(3)M^2, while the tail on (2,3] has modulus d_3>M. Thus an integrated energy allowance need not give the corresponding uniform endpoint allowance. This small-cutoff example is only a logical non-equivalence check; it is not evidence that (10) holds for the large cutoff and all carriers required by the proposed curve.

The existing release_v3 already established the exact full covariance and the positive integrated tail norm, and already explained why uniform endpoint estimates are stronger than necessary. The additional result here is the ordered-block factorization (2), the explicit far-block payment (6), and the averaged near-only sufficient target (8)--(10). This is a localized alternative with a constant loss, not a sharper version of the exact full-energy criterion. The logical endpoint non-equivalence example does not establish any new ordering of the arithmetic difficulty at the target cutoff, or any quantitative advantage over the previously reviewed condition.

Reusing a pointwise exponent estimate still gives the old threshold. For a block at scale P, a tail envelope of size P^(theta-b)(log T)^k yields an energy allowance of size P^(2(theta-s))(log T)^(2k), up to fixed R,x constants. Summing blocks has a positive cutoff power when theta>s, logarithmic growth at equality, and a bounded scale sum when theta<s. The x gain cancels exactly as in release_v3. No new prime exponent, effective onset, or all-height certificate follows.

## Outcome

Far-frequency interactions can be paid rigorously through positive block energies. The remaining variance target can be localized to one explicit triangularly weighted near-prime-pair sum. Its required upper bound, and the separate signed mean bound, are not proved. All diagonal and mixed terms are accounted for; no favorable covariance sign or empirical sample is used as proof.
