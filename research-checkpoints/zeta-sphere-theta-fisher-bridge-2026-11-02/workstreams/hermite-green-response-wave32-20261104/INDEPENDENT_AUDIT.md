# Independent audit

## Verdict

PASS for the squeezed-Hermite expansion, Hausdorff Jacobian, endpoint
cancellation, Green normalization, and the all-cutoff left-response theorem,
subject to the already imported complete-theta decay/Fubini domain.

Two independent derivations checked the Hermite generating function and the
Green identity.  They found no missing commutator, parity sign, factor two, or
half-line factor.  In particular,

\[
 \langle g_h,\phi_{2k}\rangle
 =2^{-1/4}\operatorname {sech}(h)^{1/2}(-\tanh h)^k
 {\sqrt{(2k)!}\over2^k k!},
\]

which gives the coefficient in the main note after `h -> -h`
symmetrization.  The substitution `z=tanh^2 h` gives exactly the powers
`z^(r-1/2)(1-z)^(-3/4)`.

Starting from the wave-29 direct-source formula, adjointing `T_m(D)` gives
`(-1)^m`, and adjointing `D^2-1/4` gives no further sign.  The Wronskian
identity then gives precisely `4(-1)^(m+1)/sigma_n` in the half-line Green
formula.

The left-response proof was audited line by line.  The audit explicitly
isolated the one cell containing the maximum of `q=partial_h p_h`; that cell
may have either sign but cannot create a second cell-error transition.  It
verified the exact first-cell numerator, the coefficient/exponential
comparison, the theta modular endpoint, and locally uniform passage to the
infinite cutoff.  Therefore

\[
 (R_J^L)'(h)>0\qquad(h>0,\ J\ge1)
\]

is rigorous.

## Analytic obligations retained

The checkpoint does not reprove the earlier strong domain.  A standalone
version would still need to establish:

- the original direct-source formula and `sigma_x=(D^2-1/4)G_h`;
- parity of `T_m`;
- complete-theta derivative decay through the adjointed order;
- Fubini for the finite head, for which `int |W_m| C < infinity` suffices;
- the Wronskian boundary limits; and
- absolute endpoint Hermite convergence for the both-sign conclusion.

These are the same imported wave-29 hypotheses stated in the main note.  No
audit established global trapezoidal response monotonicity or the remaining
signed theta correlation.

The later trapezoidal audit independently checked the Rayleigh survival
representation, chord derivative, every term of `g_J''`, the endpoint
asymptotics, and the full `J=1` proof.  It caught and rejected a proposed
shortcut `M<D_1+D_infinity`: unimodality justifies only
`M<2 min(D_1,D_infinity)` without an additional phase-sensitive lemma.  The
main note records the corrected condition.
