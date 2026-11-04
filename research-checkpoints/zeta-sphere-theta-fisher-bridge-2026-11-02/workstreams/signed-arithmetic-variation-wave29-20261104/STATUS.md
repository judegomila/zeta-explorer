# Status

- This workstream tests the exact signed arithmetic-variation identity on the
  two mechanism-discriminating rungs `n=3,5`; it does not escalate degree.
- The primary and replay use the same floating implementation at independently
  increased quadrature resolution and truncation range. The replay is a
  resolution check, not an independent proof.
- Direct, Laplace, Abel, and common-scale Stieltjes forms are compared before
  any structural diagnostic is accepted.
- The exact arithmetic audit passes: the Jordan divisor identity, Abel closed
  form, first-cell sign change, and Stieltjes derivative/jump constants agree.
- A noncircular `O(log(x)/x^2)` Jordan-weight bound and two tail lower bounds
  are proved.  Arithmetic positivity alone is insufficient because the weight
  derivative already has both signs in the first cell.
- The angle and Ewald head admit one exact combined source.  Conditional on
  the imported analytic complete-orbit transfer lemma, its parity-adapted tail
  is positive after an `O(n log n)` onset.
- Exact decombination shows that subtracting the threshold source returns the
  direct next-pivot Ewald source. A linear combined-head proof would therefore
  restate the target; a nonlinear actual-theta inequality is still required.
- Conditional on the same imported analytic transfer lemma, the direct source
  itself has a positive parity tail after `O(n log n)`. Its first `O(n log n)`
  cells are the clean remaining linear finite-head problem.
- Exact analytic countermodels show that Ewald domain conditions, remote-tail
  signs, and positive current recurrence are jointly insufficient; the finite
  head proof must use the actual complete-theta bilinear/modular coupling.
- The finite computations are nonrigorous mechanism probes. They do not prove
  a uniform angle bound, a next-pivot theorem, or the Riemann hypothesis.
- Runtime files live under `run/` and are excluded from version control. The
  shared governor admits at most one owned worker against a sampled 50% total-
  Mac target and never signals the protected 4CT processes.

