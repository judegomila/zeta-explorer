# Independent Euler boundary-layer audit

Analytic PASS, with requested scope wording clarification, 2026-11-03.

For integer N, the primitive of fractional-part minus1/2 is H=(r^2-r)/2 on every unit cell, between-1/8 and0. Integration by parts gives R_N=-N^-s/2-s(s+1) integral H x^(-s-2), so delta is nonnegative and <=s N^(-s-1)/8. Differentiating under the absolutely convergent integral and using the explicit logarithmic moment gives exactly the displayed delta-prime upper bound. No sign of the derivative is assumed.

At epsilon=c/logN, A(epsilon)->-1, xi(epsilon)->1/2, R_N(epsilon)->-e^-c/2, and R_N'(epsilon)/logN->e^-c/2. Thus e_N(epsilon)->e^-c/2 and e_N'(epsilon)/logN->-e^-c/2. The reflected e_N(1-epsilon) and its derivative vanish with the stated sufficient rates. Since d/da=-d/depsilon, differentiating2xi(epsilon)-e_N(epsilon)-e_N(1-epsilon) has leading e_N'(epsilon), not its negative. Hence both limits(4),(5) and U/logN=F*(d_aF/logN) are correct and strictly negative as claimed.

The estimates are uniform when c ranges over a fixed compact positive interval. They therefore certify negative bands of width(c2-c1)/logN and height comparable to logN. Requested clarification: this does not bound the ENTIRE negative region's width from above or locate all its endpoints. Take N large enough that epsilon<1/2 to retain positive shifts. The failure is nonuniform convergence of this finite arithmetic approximant near the boundary, not a negative complete-theta value or an all-degree payment theorem. No numerical certificate or external code execution is involved.
