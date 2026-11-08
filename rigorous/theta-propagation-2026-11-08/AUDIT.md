# Mathematical audit and verification record

Date: 8 November 2026. This is a research-session audit, not a proof-assistant
formalization, peer-review claim, or claim of novelty.

## Actual pulse upper bound

The finite-feature comparison was checked directly from unitarity and the
exact action of C0 on translates of h+. The rational witness uses centers
0, 3/10, 3/5 and coefficients -2, 5, -9/8. The coefficient absolute sum is
65/8. Every translated quadrature argument has modulus at most four.

Two independent mathematical reviews checked the derivative recurrence and
integer caps, the positive omitted theta remainder, Simpson error constants,
mesh parity, translated spatial-tail limits, and the double-exponential tail
integral. The denominator 2*pi*exp(3)-49/10 comes from the stated polynomial
factor and theta-square exponential. The exact rational derivative-polynomial
recurrence was also verified separately.

The staged certificate replay passed. Its JSON matches the source output.
The actual leakage is bounded between zero and 0.124030166; the lower endpoint
of the computed triangle-expression enclosure is not a lower leakage bound.

## Actual preimages and Hardy formula

The preimage proof was checked using the stated Fourier normalization. D(it)
is Schwartz, while the box transform has inverse-linear peaks on infinitely
many intervals. Monotone convergence proves L2 divergence. Fixed-frequency
lower bounds prove L1 divergence; the bounded total integral then forces both
signed masses to diverge. The absence of a tempered-distribution limit follows
from the smoothing property of convolution by a Schwartz function.

The inner quotient factorization retains common-zero cancellation and audits
the bounded zero strip, Blaschke convergence, and possible exponential factor.
The Hardy norm is (1/(4*pi))*integral |Y(it)|^2 dt, so the evaluation kernel is
2/(z+conjugate(p)) and its squared norm is 1/Re(p). This gives the stated
one-pole and Cauchy-Gram factors. Only the combined correction is assigned a
limit. The inverse-Blaschke example is explicitly a toy, not an xi model.

## Uniform separated-tail theorem

An independent derivation checked the complete theta envelope and all factors
in the normalized error bound. The normalized endpoint integral lies between
the two stated bounds, giving the relative error eta_R. The geometric
prefactor is bounded by 1+|U-V|^2/(8R^2).

The triangular Fourier window gives the claimed lower bound for every
delta-separated sech Gram matrix. The two off-diagonal Schur row estimates
were recomputed, including the factor 32 in E_(R,delta). The exact diagonal
error vanishes. The three restrictions are preserved: fixed positive spacing,
one tail at a time, and a start depending on that spacing. The interval replay
passed for all five listed choices.

## Analytic localization and the finite jet

The L2-valued theta feature map has the stated connected holomorphic strip.
Its compact-substrip domination controls the large-r tail and the remaining
bounded interval, permitting the scalar identity theorem and the equality of
closed feature spans. The derivative-span argument likewise requires every
order; a finite jet does not suffice.

The 3-by-3 jet matrix was recomputed by differentiation and integration by
parts. Its odd entry is 2*I1-kappa(0)^2; its mixed even entry is -2*I1. The
certificate's derivative recurrence, eight-term theta remainder, integral
tail, and fourth-derivative Simpson bounds were checked. The staged replay
passed with the odd entry and even-block determinant strictly positive.

## Open result

No review or replay establishes zero pulse leakage, the required exponentially
weighted energy, full kernel PSD, or uniformity over all derivative orders.
Those statements remain open and are labeled accordingly in this checkpoint.
