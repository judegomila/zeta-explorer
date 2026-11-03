# All-degree theorem target

The overnight goal is not a longer list of positive finite matrices.  For the
complete theta profile `psi`, each parity polynomial `p`, and
`0 < a <= 1/2`, define

```text
T_+ p(u) = sqrt(u) exp(+a u) p(D+a) psi(u),
T_- p(u) = sqrt(u) exp(-a u) p(D-a) psi(u),  u > 0.
```

The theorem-shaped target is the sharp reflected contraction

```text
||T_- p||_2 <= ||T_+ p||_2
```

for every finite polynomial, with no degree-dependent hypothesis.  At the
normalized endpoint `a=0`, this is

```text
||p'(D) psi||_2^2
  <= ||2u p(D) psi + p'(D) psi||_2^2.
```

Equivalently, one seeks an explicit complete-theta factorization
`T_+*T_+ - T_-*T_- = L*L`, a contractive intertwiner `T_- = U T_+`, or an
exact border recurrence whose positive budget can approach zero but never be
exhausted.  A uniform strict contraction is not assumed and may be false.

## What the jobs are allowed to establish

1. `operator_mining.py` asks whether the parent-whitened signed operator has
   bounded displacement rank, bandwidth, or a stable boundary-square pattern.
   Stability under degree, shift, and quadrature doubling is required even to
   call a pattern conjectural.
2. `parity_residue.py` targets the unresolved parity restriction in the exact
   modular-residue obstruction.  Divergence in both parity ladders would rule
   out paying the residue with a raw orbit Gram and would identify the
   adversarial family an eventual proof must retain.
3. `structural_generator.py` produces exact recurrence data and hashes for
   arbitrary-degree formula mining.  Its identities are algebraic substrate,
   not positivity evidence.

Any stable pattern must be stated and proved for an arbitrary index before it
can advance the theorem.  A finite run cannot prove RH.

## Analytically dead routes

- pointwise positivity of the reflected integrand;
- a degree-independent strict contraction gap;
- paying an absolute core deficit only from the remote positive tail;
- fixed-orbit or sub-square-root-in-degree theta truncations;
- replacing the complete bridge metric by a raw polynomial orbit Gram;
- treating a fixed Euler-symmetrized approximant as a positive reference: its
  endpoint layer leaves a signed degree-dependent error at every degree, so
  that error must remain coupled to the main term;
- inferring closure from arbitrarily many finite jet certificates.
