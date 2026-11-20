# Vortex, horizon, and scalar-tail reconciliation

Combining these viewpoints does not currently prove RH. Their useful content is a set of exact interfaces and conditional criteria, not the missing global arithmetic estimate.

## Distinguish the objects that evolve

Let `X(w)=xi(1/2+w)`. A trajectory in the phase or modulus field of fixed `X` moves a test point, not a zero. Away from zeros, Cauchy–Riemann gives `grad(arg X)=J grad(log|X|)`, so pure phase motion preserves modulus. Adding amplitude descent produces local traps around off-line zeros too.

A genuine de Bruijn–Newman flow changes the entire function `H_tau` and its zeros. Only `tau=0` represents the original xi in the chosen coordinates. Positive-time capture does not show that the initial zeros were real: `z(z^2+b^2-6tau)` is an exact backward-heat polynomial whose off-real pair reaches the real line at positive time `b^2/6`, with total multiplicity preserved. Positive-time capture is compatible with `Lambda>=0`, not contradictory to it. See [Polymath, section 3](https://arxiv.org/html/1904.12438v2).

A conjugation-invariant contour domain enclosing exactly one zero forces that zero to be real. To make this global requires boundary nonvanishing, full coverage, multiplicity control, and an exterior-tail theorem. The phrase “event horizon” supplies none of those hypotheses. Conditional contraction estimates require a bound on the full external zero field and control of escape and collisions; they cannot assume all other zeros are real to prove that conclusion.

The pinned [visualization source](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/pages/VizWindingDysonFlowPage.jsx) contains two corrections to review separately: its positive-threshold contradiction with `Lambda>=0` is invalid, and `buildZeros` replaces one simple zero by two as the slider becomes negative despite a conserved-winding claim. This checkpoint does not modify that source or claim to verify the deployed bundle.

## Scalar tail: a valid criterion is not its proof

Use Suzuki's scalar `Psi` normalized by

`integral_0^infinity exp(-wt) Psi(t) dt = X'(w)/(w^2 X(w))`, initially `Re w>1/2`.

Its arithmetic form is an explicit archimedean function minus the prime-power ramp sum `sum_(log n<=t) [Lambda(n)/sqrt(n)](t-log n)`. Here `t` is logarithmic delay and `exp(t)` an arithmetic cutoff, not zero height. [Suzuki's scalar framework](https://arxiv.org/html/2206.03682v4) supplies the relevant positivity/transform background.

Finite total negative area, and suitable global one-sided subexponential lower envelopes, are valid sufficient RH targets. In the reserve calculation after `t>=log 2`, squared prime-jump charges are summable. The mixed charge minus continuous recovery remains uncontrolled globally. Bounding the pieces separately loses the signed cancellation. Curvature is not positive on the entire initial delay interval, which must be treated separately.

The recovered finite-event archive was incomplete: initial mathematical notes passed their record CRC checks, but the complete event data and verifier could not be recovered and replayed. Its reported finite certificate is not promoted to a newly verified result here. No raw archive or conversation content is included.

## Exact local transfer from the full Weil form

For the centered box `b_u=1_[-u/2,u/2]`, the exact normalization is `Q[b_u]=2Psi(u)` and `||b_u||_2^2=u`. Boxes belong to the logarithmic form domain: their Fourier tails are `O(1/|frequency|)`. Contracting then mollifying inside the same support justifies the endpoint case.

Thus the internally replayed `Q_(6/5)>=epsilon I`, `epsilon=10^-55`, implies

`Psi(u)>=epsilon u/2`, for `0<=u<=12/5`,

and, for `h>0`, `W_h(t)=(1/h)integral_t^(t+h)Psi(u)du` satisfies

`W_h(t)>=epsilon(t/2+h/4)` whenever `0<=t` and `t+h<=12/5`.

This is a local consequence, not a larger support certificate or a new global bound. Windowing does not deform xi: its transform multiplier `(exp(hw)-1)/(hw)` has no zeros in `Re w>0`, so it does not erase right-half-plane logarithmic-derivative poles.

The network transform restricted to the even box gives the exact interface

`2Psi(2L)=J_c[1/c]+integral_(-L)^L D_c(x)dx+32sinh^2(L/2)`.

The odd pole vanishes, but the signed row defect remains. The next substantive task is to bound this combined expression or its window average, not to replace it by separate positive pieces. Taking a second finite difference of the window average yields a nonnegative compact quadratic B-spline weight on prime powers between `exp(t)` and `exp(t+3h)`, canceling earlier prime history. No required bound on the centered cumulative signed forcing is established by that identity alone.

Explicitly, with `q_n=Lambda(n)/sqrt(n)` and `Abar_h` the window average of the archimedean part of `Psi`,

`W_h(t+2h)-2W_h(t+h)+W_h(t) = Abar_h(t+2h)-2Abar_h(t+h)+Abar_h(t) - sum_(exp(t)<n<exp(t+3h)) q_n K_h(log n-t)`.

Here `K_h(s)` is zero outside `[0,3h]` and equals `s^2/(2h)`, `(-2s^2+6hs-3h^2)/(2h)`, and `(3h-s)^2/(2h)` on the three successive length-`h` intervals. Its mass is `h^2`. If `F_k=W_(k+2)-2W_(k+1)+W_k` along a fixed phase, reconstruction is `W_n=W_0+n(W_1-W_0)+sum_(k=0)^(n-2)(n-1-k)F_k`. The included block checker checks these identities on rational synthetic events only; it proves no bound for actual primes.

## Prior overlap and coordinate caution

The inspected unrefereed preprint by Rainer Andreas Mittermeier, *A Zero-Side Positivity Certificate for Suzuki's Screw Function through 4·10^20: Window Means and One-Sided Criteria — Companion to Part 5*, 19 October 2026, [Zenodo v1](https://zenodo.org/records/23481975), already contains window and one-sided criteria: Theorem 1.2/Proposition 5.1, Lemma 4.1, and Theorem 4.2. No novelty claim for those criteria is justified here.

Its title's `4·10^20` is `exp(t)`, not a zero height. Its finite claims concern delay through `47.48` (sharpened to `47.484375` in Theorem 6.3) and separately unit-window starting delay through `104.63`. The deposited PDF was read and its MD5 matched the record, but its numerical certificates were not replayed. These remain attributed preprint claims, not established numerical records or results of this checkpoint.
