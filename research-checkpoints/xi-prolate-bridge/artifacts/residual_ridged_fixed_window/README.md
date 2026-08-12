# Residual-ridged fixed-window pilot

This directory records one deterministic finite diagnostic at
`lambda=2`, `N=4`, exact `T=1`, and a 30-term even Legendre prolate basis.
It is evaluated at 40 and 80 decimal digits with Python 3.14.6 and mpmath
1.4.1. The formal state remains `P0_INVALIDATED`; these point computations
are neither interval/ball enclosures nor an asymptotic claim.

The producer assembles the exact finite Weil matrix directly from the locked
pole, archimedean, and inclusive prime-power formulas and constructs `K_T`
by arbitrary-precision evaluation-vector quadrature. The replay imports no
producer code: it independently reconstructs the source matrix and prolate
state, then assembles `K_T` from closed Si/Ci antiderivatives. Both paths
share mpmath transcendental arithmetic, which is an explicit limitation.

At 80 digits, selected raw values are:

- `q = 7.9935661236341994146160710699257411497665e-8`
- `r = 5.2902271331806892721323218727314160436868e-5`
- even complementary gap at `q = 2.6147917758238370472636605875928298075465e-5`
- odd-sector gap at `q = 2.2346509307537462553925162166639098641235e-7`
- `tr(S_r K_T) = 0.07879511728548496397686605575994556118`
- `L^(3/2) tr(S_r K_T) = 0.12861229599853134313542518664197391203`
- physical-splice slack `= 0.34297352811541069193942507032588500075`

Every producer artifact contains the exact inputs, source/code dependency
hashes, raw-value hashes, normalization audit values, structural defects,
and the full matrices/vectors needed for replay. The replay rejects promoted
claim labels, binary64 parameters, malformed prime inventories, altered
formula declarations, repaired-hash derived-value tampering, or failed
finite positivity/contraction gates.
