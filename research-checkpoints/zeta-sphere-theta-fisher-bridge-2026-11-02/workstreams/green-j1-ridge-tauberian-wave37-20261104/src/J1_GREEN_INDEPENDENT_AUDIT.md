# Independent audit of the finite-J=1 Green proof

## Verdict

PASS.  The topology proof and analytic-domination proof are mutually
consistent and together establish

\[
 \psi'F_1'-\psi''F_1>0\quad\text{on }\{F_1>0\},
\]

with `F_1` positive through the unique maximum of `f=-h psi'`, one positive
interval, and no positive re-entry.  The earlier level-pairing argument then
gives the strict finite-cell correlation `I_1>0`.  No finite scan is used.

## Checks reproduced

1. For `x=pi exp(2h)`, `y=pi^2/x`, differentiating
   `R=b(x)/(-b(y))` proves strict monotonicity after `y<1`, with endpoint
   limits zero and infinity.  Hence `F_1` has exactly one positive zero.
2. At `H=(1/2)log pi`, every theta shell satisfies
   `A_1(z)+H A_2(z)>A_1(z)+(1/2)A_2(z)>0` for `z>=pi^2>9`.
   Therefore the unique theta hump precedes `H`, while the response zero
   follows `H`.
3. Direct symbolic differentiation reproduces the stated generic shell
   Wronskian with `C_(N,x),C_(N,y)` exactly.
4. The reflected first-shell positivity proof passes on all four domains:
   `[pi,4]`, `[4,5]`, `[5,pi^2]`, and `[pi^2,4pi]`.  In particular the
   rational polynomial in the middle domain has the three stated positive
   shift bounds.
5. The first direct reserve `C_(1,x)>=4x^3` is correct for `x>=pi`.
6. The higher-shell estimates give exactly
   `(4pi+9)S`, with
   `S<4/125+1/1,500,000<1/31`.  Thus the loss is below `151/217`, leaving
   more than `66/217` of the first direct contribution.

## Scope

This closes the finite `J=1` Green blocker only.  It does not prove the
independent all-degree signed `Q/X` spectral-load estimate and does not imply
the Riemann hypothesis.  This is an AI-assisted analytic audit, not external
peer review or formal verification.
