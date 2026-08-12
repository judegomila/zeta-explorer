# Checkpoint 0.63 moment-angle and constrained-ground pilot

This directory records one deterministic finite diagnostic at `lambda=2`,
`N=4`, and a 30-term even Legendre prolate basis. It is evaluated at 40 and
80 decimal digits with Python 3.14.6 and mpmath 1.4.1. The formal state
remains `P0_INVALIDATED`: these are point values, not interval/ball
enclosures, an asymptotic estimate, or an RH proof.

The producer reconstructs the source Weil matrix, recurrence prolate state,
physical even moments, and pole vectors directly. The verifier imports no
producer code. It uses a differential-form prolate assembly, closed moment
and pole-vector coefficients, and a separate source-matrix path whose
archimedean integral is transformed by `x=L*t^2` with its analytic origin
value. Both paths share mpmath transcendental arithmetic and eigensolvers.

For `m=1,2,3,4`, the artifacts contain the regularized moment Schur floor,
the complete-Schur and determinant cross-checks, `r/c_(r,m)`, and six
declared `eta_m(u)` samples. Covariance-weighted `Theta/Phi`, `K_m`, and
`K_T` are deliberately not computed in this checkpoint.

At 80 digits, selected point values are:

- `q = 7.9935661236341994146160710699257411e-8`
- `r = 5.2902271331806892721323218727314160e-5`
- `c_(r,1) = 1.4068221882668342573611847473172739e-4`
- `c_(r,4) = 7.9050189090045263193959824603242459e-5`
- constrained nonpole ground `zeta = 8.3141572417475417704198929305099443`
- labelled critical load `s_c = 1.0000002059810406136813850953287828`
- source-load margin `s_c-1 = 2.0598104061368138509532878277691e-7`
- source odd-minus-even ground gap `= 3.0170121866267145197083136661478e-7`

The serialized actual-ground `B_U`, `chi_U`, and load reserve use the
reconstructed constrained ground itself. They are explicitly an existential
identity regression at this one point, not a constructive trial, an
independent orientation proof, or a uniform source theorem.
