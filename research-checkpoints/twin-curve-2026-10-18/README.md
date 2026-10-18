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

## What is proved here

- The original Euler-product method can ask for a one-sided complete fixed-coefficient prime sum, rather than a family of stronger arbitrary block/endpoint estimates.
- A precise clipped harmonic average suffices on a finite rectangle, with the right and horizontal boundary terms retained.
- Cancellation in the linear average alone cannot remove the positive clipping penalty.
- Within the stated interpolation, even a free prime-product cost requires a prime cutoff exponent above 26/63 in the limiting geometry. An easy polylogarithmic cutoff does not close that method.
- The Gaussian smoothing and demodulation formulas, and their individual-signal limitation, are exact.

## What must still be proved

The central missing estimate is a uniform upper bound for the actual clipped harmonic average in equation (4) of the first note, small enough to make its full boundary budget negative at every target. A sufficient stronger alternative is the one-sided weighted prime sum in equations (1)--(2), together with all stated analytic boundary hypotheses.

For the Gaussian route, the remaining task is the signed large-forward-prime energy estimate described in the third note. The new identities do not establish that estimate.

An eventual proof must give effective constants and onset, cover every carrier and required rectangle edge, and cover the entire intervening height range. Neither a density-one result nor finitely many checked heights supplies this coverage. Comparison with stronger published bounds is required before making any novelty claim.

## Attribution and review

The research direction is Jude Gomila's twin-ladder/reflected-curve proposal. The Euler-product transfer is developed in the context of the OpenAI quasi-RH framework; its earlier exponent input is deliberately retained as a hypothesis here. Standard ingredients include Euler products, the maximum principle and harmonic measure, Gaussian Fourier transforms, and the primary-source pointwise estimate cited in the second note. The current algebraic reductions and scope checks were developed with OpenAI assistance and checked in separate internal mathematical reviews. They have not undergone external peer review.

`provenance.json` binds the three reviewed source versions to these release copies. Changes in the copies only clarify provenance and review status; the mathematical content is unchanged. `SHA256SUMS` binds the released documentation. No application code, deployment, historical proof package, or existing branch is changed by this addition.
