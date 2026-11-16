---
date: 2026-11-09
ticket: none
kind: research-direction
model: GPT-6-Astra-Pro
artifact:
  - rigorous/torus-heat-antibridge-2026-11-09/README.md
  - rigorous/torus-heat-antibridge-2026-11-09/analytic_continuation.md
  - rigorous/torus-heat-antibridge-2026-11-09/collective_certificate.md
  - rigorous/torus-heat-antibridge-2026-11-09/validation.json
---

# Preserve theta corrections and certify collective zero contraction

## Question

Can heat flow on the twin-ladder torus use the frozen infinity meeting points
and the opposite anti-bridge to strengthen a de Bruijn–Newman bound?

## Alternatives considered

| Route | Assessment |
|---|---|
| Use the frozen geometric anchors alone | The finite anchors have positive function value; the essential punctures and normalized endpoint data survive time shifts. These data do not locate the threshold. |
| Upgrade fixed-packet tail limits through entrywise error bounds | An exact leading-model counterexample rules out the required uniform relative positivity argument. |
| Prove unrestricted positivity of the actual kernel on a tail interval | Valid as a formulation, but analytic propagation shows that it is already equivalent to the full threshold condition. |
| Retain the true theta correction and certify nearby zero clusters | Selected diagnostics show the correction repairs the tested bad directions; the contour certificate gives a concrete interface to a conditional quantitative bound. |

## Verdict

Preserve the exact torus and heat identities, the fixed-finite two-end result,
and the new obstruction. Continue toward a certificate on the actual function
with explicit approximation errors and uniform tail control. Do not promote
bounded-size packet positivity to positivity at all orders.

The directly usable upper-bound route is the collective contour estimate in
`collective_certificate.md`. The local kernel formulation remains a useful
exact reduction, with its RH-strength clearly stated. Neither route currently
provides a new numerical value of Lambda.

## Evidence

- Exact rational arithmetic verifies a negative three-point form for
  `M(p,q)=(p+q)/(exp(p)+exp(q))`, with every point above 1. A harmonic-sum
  identity yields negative Taylor directions at any finite positive center.
- The actual theta flux has a sesquiholomorphic extension to a connected
  strip. Neeb–Ólafsson's Theorem A.1 propagates all-order positivity from any
  open real interval. The supplied Hardy-space argument identifies global
  positivity with real-rootedness at the stated heat time.
- Independently replayed finite-theta-sum diagnostics are positive on the
  particular leading-model negative directions tested. They are not interval
  certificates and do not establish unrestricted positivity.
- Eighteen exact symbolic checks verify the normalization, zero-dynamics
  constants, logarithmic-derivative error identity, integrated slab formula,
  and scalar theta-tail constants.
- Polymath's published proof already uses the opposite-reflection sign.
  The torus interpretation is not a new zero interaction.

## Honest scope and risk

The analytic arguments are research derivations for independent review. The
automated checks verify the stated finite identities, not every analytic
hypothesis. There is no certified global initial strip, uniform tail exclusion,
or positive contour margin in this change. Small entrywise errors can dominate
high-order signed packets. Duplicating a zero on two sheets does not create a
second arithmetic zero.

This lane starts from `main` and cites the immutable PR #43 checkpoint. It
does not change the application's bound claims or import another branch's
unfinished implementation.

## Follow-ups

1. Choose a published, normalized initial-strip certificate and an analytic
   tail exclusion valid on the full proposed time interval.
2. Cover the remaining possible top zeros by finite target boxes; choose
   disjoint nearby zero-cluster contours and analytic collars.
3. Implement directed interval bounds for the normalized approximation,
   derivative error, contour quadrature, and common contraction margin.
4. Evaluate the resulting slab formula against the same input strip's ordinary
   de Bruijn bound. Report a new number only when every global hypothesis is
   covered.
5. For the structural kernel route, investigate identities controlling the
   complete theta correction in unbounded Taylor order. The exact jet
   recurrence supplies a constraint, not complete initialization or positivity.
