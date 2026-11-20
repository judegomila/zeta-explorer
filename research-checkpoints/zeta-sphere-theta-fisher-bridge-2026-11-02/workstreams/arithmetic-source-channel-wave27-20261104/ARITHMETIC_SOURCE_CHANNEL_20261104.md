# Arithmetic source-channel comparison

Date: 2026-11-04 UTC.

## Result and scope

Let `D=d/du`, and use the arithmetic translate operator from the audited
theta-orbit calculation

\[
 (Uh)(u)=e^{2u}\sum_{m\ge1}J_2(m)m^{-1/2}h(u+\log m),
 \qquad B=U\psi,
\]

on the positive half-line.  Here `J_2(m)` denotes exactly the arithmetic
coefficient and normalization in that orbit calculation; this checkpoint
does not replace it by a differently normalized Jordan function.  Put

\[
 L_2=(D-5/2)(D-3/2),\qquad A=D+5/2.
\]

The independently audited orbit identity and weighted operator estimate are

\[
 L_2\psi=-2\pi UA\psi,                                      \tag{1}
\]

and, on the admissible source domain used in that audit,

\[
 0.9\left\|{e^u h\over\sqrt\psi}\right\|_2
 \leq
 \left\|{Uh\over\sqrt B}\right\|_2
 \leq
 1.1\left\|{e^u h\over\sqrt\psi}\right\|_2.               \tag{2}
\]

The norms in (2) are over `u>=0`.  Equation (2) is retained with its audited
domain; it is not asserted here for arbitrary functions outside that domain.

For every polynomial `q`, the exact all-degree extension is

\[
 L_2q(D)\psi=-2\pi U A q(D+2)\psi.                           \tag{3}
\]

Indeed `DU=U(D+2)`, so `q(D)U=Uq(D+2)`.  Constant-coefficient
operators commute, and (3) follows from (1).  No recurrence coefficient,
finite-degree estimate, or asymptotic passage is used.

There is also a useful local form.  The same intertwining gives

\[
 U(D+5/2)=(D+1/2)U,
 \qquad Uq(D+2)=q(D)U.
\]

Therefore (3) is equivalently

\[
 \boxed{L_2q(D)\psi=-2\pi(D+1/2)q(D)B.}              \tag{3a}
\]

This removes the arithmetic sum from the right side after the single
positive profile `B=U psi` has been formed.  It may be useful for the
remaining correlated transfer, but it still supplies only a square norm,
not the sign of the target cross term.

For a decaying source packet `g=q(D)B`, the right-decaying Green kernel of
`L_2` is positive:

\[
 K(t)=e^{-3t/2}-e^{-5t/2},\qquad
 L_2^{-1}f(u)=\int_0^\infty K(t)f(u+t)\,dt.           \tag{3b}
\]

Applying (3b) to (3a) and integrating the derivative once gives the exact
one-sided transfer

\[
 q(D)\psi(u)=-2\pi\int_0^\infty
 \underbrace{\{2e^{-3t/2}-3e^{-5t/2}\}}_{R(t)}
 q(D)B(u+t)\,dt.                                     \tag{3c}
\]

The boundary term vanishes because `K(0)=0` and the theta packets decay.
Crucially,

\[
 R(t)=e^{-3t/2}(2-3e^{-t})
\]

is negative for `0<=t<log(3/2)` and positive afterward.  Thus even the
positive Green kernel becomes a signed transfer after the required
`D+1/2` source operator is moved off `g`.  This is an exact description of
the remaining compensation problem, not a sign theorem.

For a precise innovation formulation, let `P_n^mon` be the affine space of
monic real polynomials of degree `n`, and define

\[
 H_n=\inf_{q\in P_n^{\rm mon}}
      \left\|{L_2q(D)\psi\over\sqrt B}\right\|_2^2,
\]

\[
 J_n=\inf_{q\in P_n^{\rm mon}}
      \left\|{e^u A q(D+2)\psi\over\sqrt\psi}\right\|_2^2.
\]

Translation `q(x)->q(x+2)` is a bijection of the full monic degree-`n`
prefix, so this definition loses no lower polynomial coefficient.  Applying
(2) additionally requires every packet
`h_q=A q(D+2)psi` used in the infimum to belong to the imported estimate's
admissible domain.  This checkpoint preserves that domain restriction but
does not independently prove that it is closed under all such
constant-coefficient polynomial derivatives.  Under that explicit domain
premise, squaring (2) and taking the infimum gives, for every `n`,

\[
 0.81\,4\pi^2J_n\leq H_n\leq1.21\,4\pi^2J_n.                \tag{4}
\]

Thus, conditionally on the imported domain premise, the arithmetic transform
does not degrade the positive source innovation by a degree-dependent
constant.  It reduces this source-channel part of an all-degree argument to
the positive quantity `J_n`.

## Independent algebra audit

The companion standard-library verifier independently checks through a
generic coefficient model that:

1. `D U=U(D+2)` implies `q(D)U=Uq(D+2)` coefficient by coefficient;
2. `A` commutes with every shifted polynomial `q(D+2)`;
3. translation by two preserves degree, leading coefficient, and the full
   polynomial prefix;
4. the norm constants square exactly to `81/100` and `121/100`.
5. translating `A(x)q(x+2)` back by two gives exactly
   `(x+1/2)q(x)`, which audits (3a).
6. the Green multiplier and integration-by-parts constants in (3b)-(3c),
   including the single sign change at `log(3/2)`.

This audit verifies the algebraic passage from the base orbit identity and
operator estimate to (3)-(4).  It does not recompute the theta-orbit
derivation of (1), the analytic kernel estimate in (2), or the inclusion of
all polynomial packets in (2)'s admissible domain.  Interchanging derivatives
with the infinite arithmetic sum, applying the decaying inverse, and using
Fubini below also retain the complete-theta differentiability and absolute
decay assumptions; the local exact-algebra replay does not establish them.

## What remains blocked

`H_n` and `J_n` are positive source-channel innovations.  The RH campaign's
unclosed term is the **signed target** commutator/cross contribution, denoted
`X_n` (and, in the two-channel formulation, `Y_n`).  No inequality in this
note compares `J_n` with that signed target or with the finite Ewald head.
Consequently (4) does not sign a next pivot, prove an Xi-Laguerre inequality,
or prove RH.

The next analytic task is a correlated transfer inequality that pays the
signed target from `J_n` without separate Cauchy estimates.  A finite check
can guide that lemma but cannot replace it.

## Direct transfer to the actual signed angle

The fixed kernel above gives such a transfer in exact one-dimensional form.
Use the wave-25 endpoint notation

\[
 F_n=T_n(D)\psi,\qquad
 q_n=T'_{n+1}-(n+1)T_n,\qquad
 g_n=q_n(D)B,
\]

and let `sigma_n>0` be the known current pivot.  Define the shifted
correlation

\[
 \mathcal K_n(t)=\int_0^\infty uF_n(u)g_n(u+t)\,du.    \tag{5}
\]

Schwartz decay permits Fubini in (3c).  Since

\[
 X_n={1\over\sigma_n}\int_0^\infty
       uF_n(u)q_n(D)\psi(u)\,du,
\]

one obtains the exact reduction

\[
 \boxed{X_n=-{2\pi\over\sigma_n}\int_0^\infty
                 R(t)\mathcal K_n(t)\,dt.}           \tag{6}
\]

Consequently the missing directional bound is equivalently

\[
 \int_0^\infty R(t)\mathcal K_n(t)\,dt
 \leq-{\sigma_n\over2\pi}(A_n-nB_n).                 \tag{7}
\]

The one-cell finite-head gate becomes

\[
 H^0_{n,J}+E_{n,J}
 -{8\pi\over\sigma_n}\int_0^\infty
          R(t)\mathcal K_n(t)\,dt
 >4(A_n-nB_n).                                       \tag{8}
\]

This is not yet a proof of (7) or (8).  Its value is structural: every
degree now faces the same fixed two-lobe kernel `R`; the degree dependence is
confined to one actual-theta correlation `mathcal K_n`.  A successful proof
must retain cancellation between `0<t<log(3/2)` and the positive tail, rather
than bounding the lobes separately by absolute values.

There is a precise localization form.  Put

\[
 C_n(a)=\int_0^\infty e^{-at}\mathcal K_n(t)\,dt.
\]

Then (6) is simply

\[
 \boxed{X_n={2\pi\over\sigma_n}
       \{3C_n(5/2)-2C_n(3/2)\}.}                    \tag{9}
\]

Thus the exact quantitative target is

\[
 3C_n(5/2)-2C_n(3/2)
 \geq {\sigma_n\over2\pi}(A_n-nB_n).                \tag{10}
\]

Conditionally, if `mathcal K_n(t)>=0` and is not zero, define the probability
measure proportional to
`e^(-5t/2) mathcal K_n(t)dt`.  Then

\[
 X_n\geq0
 \quad\Longleftrightarrow\quad
 {C_n(3/2)\over C_n(5/2)}\leq{3\over2}
 \quad\Longleftrightarrow\quad
 \mathbb E_n[e^t]\leq{3\over2}.                    \tag{11}
\]

This isolates a possible proof route into two actual-theta lemmas: positivity
of the shifted correlation and exponential-moment localization relative to
the kernel zero.  The expectation bound does not require literal support
inside `t<=log(3/2)`.  Neither lemma is currently proved, and (11) must not be
used if `mathcal K_n` has a negative part.  The signed inequality (10), not
the conditional probability interpretation, remains the primary target.

