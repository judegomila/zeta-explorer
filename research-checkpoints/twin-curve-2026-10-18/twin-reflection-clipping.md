# Twin reflection, clipping, and deterministic compensation

18 October 2026. New exact check of whether the functional equation removes the positive clipping penalty in the one-sided Euler/harmonic criterion. Independently checked in an internal mathematical review; external peer review remains outstanding. No zero-free curve is proved.

## 1. The reflected shift reverses the ratio

Let h>0, xi(s)=K(s) zeta(s), with
K(s)=s(s-1) Gamma(s/2) pi^(-s/2)/2.
On the positive-height rectangles under consideration K is analytic and nonzero. The standard functional equation and conjugation symmetry give
xi(1-conj(s))=conj(xi(s)).
These identities are recorded in DLMF 25.4.3--4:
https://dlmf.nist.gov/25.4.E3 and https://dlmf.nist.gov/25.4.E4.

Define B(s)=xi(s)/xi(s+h), and reflect the WHOLE oriented segment by setting s*=1-conj(s)-h. Wherever the two sides are finite and nonzero,

B(s*)=1/conj(B(s)).                                           (1)

Proof: the numerator at s* is conj(xi(s+h)), and its denominator is conj(xi(s)). The identity extends meromorphically. Reflection about the critical line reverses the segment orientation; it does not give two independent copies of the same analytic nonvanishing assertion.

At a target zero xi(s)=0 with xi(s+h) nonzero, B(s)=0 and B(s*) has a pole. Thus any argument that applies an analytic maximum principle to BOTH reciprocal ratios on neighborhoods containing these reflected points has already assumed away the target zero. The formal cancellation log|B(s)|+log|B(s*)|=0 is valid away from zeros/poles, but cannot regularize a zero/pole into a nonvanishing theorem.

## 2. Even the best scalar opposite-sign cancellation leaves clipping

Grant opposite real excursions x and -x at paired rails, with a common deterministic budget c>=0. Their clipped contributions obey the exact identity

(c+x)_+ +(c-x)_+ = c+max(c,|x|) >= 2c.                       (2)

For unequal deterministic budgets a,b, the sum (a+x)_++(b-x)_+ is at least (a+b)_+, but grows without bound as |x| grows. Neither exact opposite signs nor a fixed deterministic compensation provides a uniform upper bound for the combined clipping cost. A proof must still control excursions with the actual joint arithmetic measure. This scalar statement is not a claim that actual prime values attain arbitrary excursions at a prescribed height.

In particular one cannot first cancel signed logarithms and then apply positive-part clipping: these operations do not commute. Equation (2) shows the loss explicitly even in the perfectly symmetric idealization.

## 3. Completion factors cannot be counted as a free gain

For the same finite product V_Q(s) as in the original-route note, define the correctly completed model
M_Q(s)=[K(s)/K(s+h)]V_Q(s).
Then, identically,

B(s)/M_Q(s)-1 = zeta(s)/[V_Q(s) zeta(s+h)]-1 = G(s).          (3)

Thus passing from zeta to xi and compensating the model consistently leaves the entire residual, its boundary values, and its harmonic certificate unchanged. A deterministic gamma-factor improvement counted on only one side of (3) is a normalization error. This is exact and does not require an asymptotic Stirling estimate.

One can force a reciprocal reflected model by defining M_Q(s*)=1/conj(M_Q(s)) on the reflected domain. The normalized full ratio then also inverts, and inherits the zero/pole issue in Section 1. This constructed reflected model must not be identified with the original finite Euler product evaluated at s*: finite Euler products have no zeta functional equation. Any discrepancy between those models is an additional term requiring a bound.

## 4. Scope

The twin geometry provides an exact symmetry and transfers a proved right zero-free region to its reflected left region. It does not, by these identities alone, shrink the right region. The checked shortcuts fail for three precise reasons: reversal exchanges zeros with poles, clipping retains absolute excursions, and consistent deterministic completion leaves G unchanged.

A genuinely new twin-rail improvement would have to control the remaining signed prime/model discrepancy or the clipped harmonic average itself, while preserving analyticity and every-carrier coverage. This note does not rule out such an arithmetic improvement. It settles only the proposed automatic cancellation from reflection and deterministic completion.
