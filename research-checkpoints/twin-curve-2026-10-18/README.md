# Twin-ladder curve: one-sided criteria and localization limits

**Status, 18 October 2026:** internally reviewed mathematical reductions and limitations. The requested all-height zero-free curve crossing 7/8 remains unproved. These notes claim neither a new literature record nor a proof of RH. No numerical sampling or formal Lean verification is presented here.

## Aim

Jude Gomila's original proposal is a height-dependent cut, with reflection across the critical line, rather than a small constant retuning. A representative target is

b(T) = 7/8 - 1/(4.896 log T).

The classical zero-free region near real part 1 does not automatically transfer to this proposed curve. The twin-ladder interpretation must supply a valid analytic transfer and a signed arithmetic estimate.

## Reading order

1. [One-sided Euler/harmonic criterion](one-sided-euler-harmonic-criterion.md): exact finite Euler logarithm, a cutoff-uniform higher-prime-power bound, and a finite-rectangle sufficient condition involving a clipped harmonic average. The displayed exponent-budget comparisons are conditional on explicit analytic boundary inputs.
2. [Pointwise prime-input scope](pointwise-prime-input-scope.md): a primary-source actual-prime theorem has the needed carrier range but does not provide enough saving when used separately on fixed-power prime blocks. This is a limitation of that application, not a lower bound on actual primes.
3. [Gaussian carrier localization](gaussian-carrier-localization.md): exact square-completion identities show why broad positive Gaussian smoothing limits amplification of an off-line zero. Complex demodulation preserves the signal but returns a narrower version of the difficult prime packet.

4. [Twin reflection and clipping](twin-reflection-clipping.md): reflecting an oriented shift reciprocates the completed ratio; clipping retains excursions, and consistent deterministic completion leaves the original residual unchanged.

5. [Harmonic variance](harmonic-variance-fixed-prime.md): an exact actual-prime covariance target for the clipped average.
6. [Poisson prime-tail energy](poisson-prime-tail-energy.md): safe domination of the finite left boundary, exact cancellation of the sum-frequency covariance, and a positive integrated tail-energy identity.
7. [Smooth-density payment](smooth-density-tail-payment.md): an explicit uniform payment for the continuum component, retaining the full actual-prime discrepancy.
8. [Sharp moment budget](sharp-moment-discrepancy-budget.md): the strongest bound using only the first two moments, with the higher-prime-power remainder paid once.

## What is proved here

- The original Euler-product method can ask for a one-sided complete fixed-coefficient prime sum, rather than a family of stronger arbitrary block/endpoint estimates.
- A precise clipped harmonic average suffices on a finite rectangle, with the right and horizontal boundary terms retained.
- Cancellation in the linear average alone cannot remove the positive clipping penalty.
- Within the stated interpolation, even a free prime-product cost requires a prime cutoff exponent above 26/63 in the limiting geometry. An easy polylogarithmic cutoff does not close that method.
- The Gaussian smoothing and demodulation formulas, and their individual-signal limitation, are exact.

- Poisson domination removes the sum-frequency covariance exactly and expresses the remaining variance as an integrated squared tail of the actual fixed prime coefficients.
- The smooth density contributes at most (K^2/2) T^(-917/500) to that energy when Q<=sqrt(T). Subtracting it does not itself reduce the difficult arithmetic norm: the two square-root energies differ by at most the displayed decaying continuum payment.
- The sharp two-moment clipping inequality avoids requiring a positive mean and avoids charging higher prime powers twice.

## What must still be proved

The central missing estimate is a uniform upper bound for the actual clipped harmonic average in equation (4) of the first note, small enough to make its full boundary budget negative at every target. A sufficient stronger alternative is the one-sided weighted prime sum in equations (1)--(2), together with all stated analytic boundary hypotheses.

The new sharper sufficient target is equation (5) of the eighth note: with the actual prime discrepancy Delta and its integrated energy E_Delta, establish B>0, a0<B, and (sqrt(E_Delta)+e_energy)^2<4B(B-a0), uniformly at every target carrier. The deterministic payments are explicit; the one-sided discrepancy mean and its energy are still unbounded at the required strength. The Poisson formulation does not import a zeta bound outside the finite rectangle or omit its horizontal edges.

For the Gaussian route, the remaining task is the signed large-forward-prime energy estimate described in the third note. The new identities do not establish that estimate.

An eventual proof must give effective constants and onset, cover every carrier and required rectangle edge, and cover the entire intervening height range. Neither a density-one result nor finitely many checked heights supplies this coverage. Comparison with stronger published bounds is required before making any novelty claim.

## Attribution and review

The research direction is Jude Gomila's twin-ladder/reflected-curve proposal. The Euler-product transfer is developed in the context of the OpenAI quasi-RH framework; its earlier exponent input is deliberately retained as a hypothesis here. Standard ingredients include Euler products, the maximum principle and harmonic measure, Gaussian Fourier transforms, and the primary-source pointwise estimate cited in the second note. The current algebraic reductions and scope checks were developed with OpenAI assistance and checked in separate internal mathematical reviews. They have not undergone external peer review.

`provenance.json` binds the eight reviewed source versions to these release copies. Changes in the copies only clarify provenance and review status; the mathematical content is unchanged. `SHA256SUMS` binds the released documentation. No application code, deployment, historical proof package, or existing branch is changed by this addition.
