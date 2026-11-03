# Audit of the proposed `N=1` tilted commutator criterion

## Scope and verdict

The proposed criterion uses, for the actual positive half-line theta profile,

\[
 d\nu_b(h)\ \mathrel{\propto}\
 h e^{2bh}\psi(h)^2\,dh,\qquad
 v=-{\psi'\over\psi},                                    \tag{1}
\]

and

\[
 A_b=\mathbb E_{\nu_b}{1\over h^{-2}+2v'},\qquad
 B_b=\mathbb E_{\nu_b}{4v^2(v')^2\over h^{-2}+2v'}.       \tag{2}
\]

One part of the proposal is independently valid: `A_b` and `B_b` give an
exact asymmetric Brascamp--Lieb bound for the tilt derivative of
`E_(nu_b)[v^2]`, with the claimed factor `2`.  In particular, for every
finite `a>0`,

\[
 \boxed{
 \left|\mathbb E_{\nu_a}[v^2]-
       \mathbb E_{\nu_{-a}}[v^2]\right|
 \leq 2\int_{-a}^a\sqrt{A_bB_b}\,db.}                    \tag{3}
\]

The advertised implication

\[
 2I_+\int_{-a}^a\sqrt{A_bB_b}\,db
 <a(P_++P_-)
 \quad\Longrightarrow\quad
 \text{``the integrated commutator is negative''}         \tag{4}
\]

cannot presently be certified.  Neither `I_\pm` nor `P_\pm` is defined in
the supplied statement or anywhere in this checkpoint, and no source
identity connects (3) to the archived modular commutator.  Several inequivalent
tilted mass, derivative-energy, and shifted-derivative conventions are
possible, so identifying the symbols by analogy would not audit the constant
or sign in (4).

Thus (3) is a proved conditional tool.  Formula (4) remains an unlinked
candidate until its missing definitions and exact bridge identity are
supplied.  Nothing here proves an `N=1` pivot, an all-degree statement, or RH.

## 1. Exact normalization and domain of the positive law

To remove the proportionality ambiguity in (1), define

\[
 Z_b=\int_0^\infty h e^{2bh}\psi(h)^2\,dh,
 \qquad
 d\nu_b={h e^{2bh}\psi(h)^2\over Z_b}\,dh.                \tag{5}
\]

For the actual complete theta profile, `psi` is smooth, strictly positive on
`[0,infinity)`, even at the modular center, and has super-exponential decay.
Consequently `0<Z_b<infinity` for every finite real `b`, and differentiation
in `b` is legitimate on compact real intervals.

The already audited complete-theta log-curvature estimate is

\[
 (\log\psi)''<-17.
\]

Therefore `v'=-(log psi)''>17`, and the potential of (5), up to an additive
normalizing constant, is

\[
 U_b(h)=-\log h-2bh-2\log\psi(h),
 \qquad
 U_b''(h)=h^{-2}+2v'(h)>h^{-2}+34.                       \tag{6}
\]

In particular, every denominator in (2) is strictly positive.  The
expectations are finite.  Near zero, evenness gives `v(h)=O(h)` and
`v'(h)=O(1)`, while the density in (5) is `O(h)`; at infinity the complete
theta decay dominates every fixed exponential tilt and the derivatives in
(2).

## 2. The covariance calculation

The one-dimensional asymmetric Brascamp--Lieb covariance inequality for the
strictly log-concave law (5) gives

\[
 |\operatorname {Cov}_{\nu_b}(f,g)|
 \leq
 \left(\mathbb E_{\nu_b}{(f')^2\over U_b''}\right)^{1/2}
 \left(\mathbb E_{\nu_b}{(g')^2\over U_b''}\right)^{1/2}. \tag{7}
\]

Apply (7) with `f(h)=h` and `g(h)=v(h)^2`.  Since `f'=1` and
`g'=2vv'`, equations (2) and (6) give exactly

\[
 |\operatorname {Cov}_{\nu_b}(h,v^2)|\leq\sqrt{A_bB_b}.   \tag{8}
\]

For

\[
 M(b)=\mathbb E_{\nu_b}[v^2],
\]

the observable is independent of `b`, whereas the normalized density has
score `2(h-E_(nu_b)h)`.  Hence

\[
 M'(b)=2\operatorname {Cov}_{\nu_b}(h,v^2).               \tag{9}
\]

Integrating (8)--(9) proves (3).  The factor `2` is forced by the exponent
`e^(2bh)`; it is not a convention-dependent Cauchy constant.

The endpoint at `h=0` creates no omitted boundary term.  One may apply (7)
on compact intervals and pass to the limit.  The density vanishes linearly,
the quantities above have the stated Taylor behavior, and all tails are
dominated by complete-theta decay.

This step is noncircular: it uses the positive law (5) and the audited
pointwise log-curvature of the actual theta profile, not the sign of a signed
target pivot or commutator.

## 3. The exact archived commutator framework

The closest exact object in the checkpoint is the both-parity modular
Christoffel--Darboux construction of
`modular_cd_flux_v1/MODULAR_REFLECTION.md`.  Under its positive-prefix
hypothesis it defines

\[
 C=GX-XG
\]

and proves that `C` has exactly one negative direction for every `N>=1`.
The audited boundary elimination in
`modular_innovation_payment_v1/BOUNDARY_ELIMINATION.md` retains the complete
weighted commutator as

\[
 \boxed{
 \mathcal C_N
 =\int_0^\infty h e^{-4ah}Y(h)^TCY(h)\,dh
 =4a\,\operatorname {tr}H-2\eta^THe_N.}                  \tag{10}
\]

Here `H`, `eta`, `Y`, and the pivot normalization are defined by that packet.
The sign of (10) is explicitly left open.  The archive also warns that a
boundary-only term is not the complete commutator because the signed
derivative-of-weight contribution can cancel it.

No checked file derives an `N=1` specialization of (10) in the notation
`I_\pm,P_\pm`, or expresses it through
`M(a)-M(-a)`.  Consequently (3) cannot by itself establish the sign of (10).

## 4. Information needed to certify the proposed implication

A complete audit of (4) requires all of the following.

1. Exact definitions of `I_+`, `I_-`, `P_+`, and `P_-`, including the
   half-line weight, exponential tilt, whether derivatives are shifted by
   `b`, and whether the quantities are raw or normalized.
2. A definition of the claimed ``integrated commutator'', including its sign,
   weight, feature normalization, and whether it is exactly `mathcal C_1` in
   (10) or a different scalar.
3. An algebraic identity or one-sided inequality connecting that scalar to
   `M(a)-M(-a)` and the four `I/P` quantities.  This is where the factor
   `I_+`, the factor `a`, and the sign in (4) must be checked.
4. The parameter domain and hypotheses: at minimum `a>0`; if (10) is meant,
   also the stated positive old-prefix and pivot-normalization assumptions.
   A normalized `a=0` limit requires the separate archived limit theorem.
5. Confirmation that the profile is the undeformed actual complete theta
   `psi` used in (5).  A heat-deformed or residual-dependent profile changes
   `v'` and requires a new curvature/domain proof.

Once these items are supplied, (3) can be inserted without further loss.
Until then, calling (4) a verified sufficient `N=1` test would guess the
missing bridge rather than prove it.

## Provenance

- `evidence/v18-curated/fisher_bridge_v1/FISHER_BRIDGE.md` and
  `fisher_bridge_audit/AUDIT.md`: audited actual-theta log curvature,
  one-dimensional Brascamp--Lieb use, endpoint truncation, and theta-tail
  integrability.
- `evidence/v20-v26-continuation/modular_cd_flux_v1/MODULAR_REFLECTION.md`
  and `modular_cd_flux_audit/AUDIT.md`: exact both-parity modular
  commutator and its one-negative-direction inertia.
- `evidence/v20-v26-continuation/modular_innovation_payment_v1/BOUNDARY_ELIMINATION.md`
  and `modular_innovation_payment_audit/AUDIT.md`: exact complete integrated
  commutator (10) and the warning against dropping the signed weight term.

This is an internal mathematical audit, not community peer review or
proof-assistant formalization.
