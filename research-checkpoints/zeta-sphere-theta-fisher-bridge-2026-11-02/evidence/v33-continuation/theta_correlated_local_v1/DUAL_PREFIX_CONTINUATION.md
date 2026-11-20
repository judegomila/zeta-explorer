# Prefix-only continuation of a selected supporting-plane certificate

Status: independent analytic review PASS. This gives a sufficient transfer test, not a proof that the test reaches critical shifts in every degree.

## 1. Fixed local theta data and actual selection

Fix n=epsilon+2N with N>=1, and write the actual monic selected polynomial as p_c=t^n+sum_(i<N)c_i t^(epsilon+2i). Define the complete-theta local matrix and column
A_loc(u)=[g_(epsilon+i+j)(u)]_(i,j<N),
b_loc(u)=[g_(epsilon+N+i)(u)]_(i<N),
d_loc(u)=g_n(u).
Then f_c=d_loc+2c^T b_loc+c^T A_loc c and z_c=b_loc+A_loc c.

At any shift a with known positive old block A(a), the actual c(a)=-A(a)^-1 b(a), where A and b are integrals against the positive spatial weight. Thus E_(rho_a) z_(c(a))=0, regardless of the unknown next pivot. The local data g_j do not change with a. A_loc need not be positive.

Suppose at one coefficient c0 an independently established pointwise certificate exists:
q0(u)=f_(c0)(u)-2v0^T z_(c0)(u)>=ell>0 for every u>=0.       (1)
Here v0 is a fixed supporting-plane vector. This premise can be supplied by the audited eventual margin theorem at each fixed degree, or by a separate complete-theta certificate. It is not inferred from positivity of the integrated target norm.

## 2. Exact signed transport, no next target input

Let c1=c0+d and choose the transported supporting plane v1=v0+d. Expansion gives exactly

f_(c1)-2v1^T z_(c1)=q0-2v0^T A_loc d-d^T A_loc d.           (2)

Both cross terms with b_loc cancel. The correction uses only the local old block, even when that block is indefinite. For two shifts with known old A1>0,

d=-A1^-1[(A1-A0)c0+(b1-b0)].                              (3)

This retains the actual signed prefix inverse. Neither d_loc's integral nor the next Schur complement enters (3). Each parity is treated with its own genuine old block; no comparison of auxiliary and signed inverse metrics is made.

## 3. Explicit sufficient transfer radius

Define the finite nonnegative constant

C0=sup_(u>=0) ||A_loc(u)||op/(1+q0(u)).                     (4)

Finiteness is theta-specific at infinity and follows from the already audited local asymptotics g_j(u)~[(2j)!/j!]Z^j, Z=pi exp(2u). Since p_c is monic, q0 has positive leading term [(2n)!/n!]Z^n; its supporting-plane subtraction has degree at most n-1 in Z. The largest old-block entry has degree n-2. Thus the ratio in (4) tends to zero. On a compact interval the denominator is at least 1+ell, so the ratio is bounded there too. C0 can be bounded using complete-orbit compact enclosures plus the existing explicit local tail estimates; no assertion of a degree-uniform bound is made.

If D>=||d||2 is a verified actual coefficient-displacement bound, put
eta=C0(2||v0||2 D+D^2).
For eta<1, (2) yields

f_(c1)-2v1^T z_(c1) >= (1-eta)q0-eta
                         >= ell-eta(1+ell).                (5)

Therefore

eta < ell/(1+ell)                                         (6)

is a noncircular sufficient condition for positive optimized dual margin at the new shift, with lower bound ell-eta(1+ell). It follows by integrating the verified supporting plane against rho_(a1), whose z_(c1) mean is exactly zero. All boundary conditions are those of the previously established moment/duality representation; no new integration by parts occurs.

Equation (2) is the sharper signed comparison. Equations (4)-(6) are conservative bounds, not claims that the correction is positive or small at arbitrary shifts. A uniform proof would require quantitative control of ell, C0, v0 and the actual inverse displacement (3) along a chain of transfers. Such control has not been proved. Repeated transfer may exhaust the margin; no finite or infinite successful chain is assumed.

This provides an actual-prefix continuation criterion without any fixed-shift Hermite approximation. Its existence alone neither improves known degree coverage nor establishes a fixed critical shift for all degrees.

## 4. Falsification probes and their limitations

Uncertified exterior a=1 probes tested degree24,26,28,30,32 finite atomic dual problems. A high-precision revised simplex on 240 quadrature nodes returned positive objectives with positive reconstructed weights in each case. These are upper bounds for a sampled or approximate dual problem, NOT lower bounds for the true continuum optimized margin. Neither the finite theta orbit sum nor the quadrature was interval-certified in these probes. No negative candidate was obtained and no theorem follows from their signs.

Earlier ordinary floating LP bases beyond degree24 acquired negative weights when reconstructed in high precision; those bases are explicitly invalid witnesses. They are preserved only to prevent future mistaken reuse. A positive exact atomic objective would still not prove lambda*>0. No optimized dual counterexample with positive actual pivot is established by this work.

Owned diagnostic files are probe_exterior_dual_high_UNCERTIFIED.py/.txt and probe_exterior_dual_simplex_UNCERTIFIED.py/.txt. They are excluded from mathematical proof evidence and from the accepted analytic manifest.
