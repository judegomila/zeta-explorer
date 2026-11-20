# Parity-resolved Ewald tail compensation

## Scope and outcome

The Bessel-cell theorem proves that, for every fixed actual monic residual
of degree `kappa`, the complete left Ewald cells have eventual sign

\[
 \operatorname {sgn}e_n=(-1)^{\kappa+1}.
\]

The existing head--tail estimate treats the remote cells as if both signs
could still occur.  Once an effective Bessel sign threshold has been
certified, that loses the main placement information.  This note gives the
exact one-sided reduction.

For odd `kappa`, the eventual positive tail automatically improves the Abel
seed and derivative.  Only its centered first moment must be paid in the
aggregate `D`.  For even `kappa`, the eventual negative tail automatically
improves `D`; only its mass and derivative mass must be paid in the seed and
derivative.  In particular, the even aggregate needs no absolute-value tail
payment at all.

This is an all-index analytic reduction, not an all-degree sign theorem.
The remaining degree-uniform problem is to control the finite head margins
and the degree dependence of an effective Bessel threshold.  Nothing here
proves a pivot or RH.

## 1. Notation and exact head split

Let

\[
 S(z)=\sum_{n\geq1}e_nz^n=P(z)-N(z),\qquad
 D(z)=P'(z)N(z)-P(z)N'(z),                       \tag{1}
\]

where `P` and `N` are formed from the positive and negative parts of the
already assembled complete cells.  Choose `K` beyond a rigorously certified
eventual-sign threshold and put

\[
 P_K=\sum_{n\leq K}e_n^+z^n,\quad
 N_K=\sum_{n\leq K}e_n^-z^n,\quad
 S_K=P_K-N_K,\quad
 D_K=P_K'N_K-P_KN_K'.                            \tag{2}
\]

All following statements hold pointwise for `0<z<=1`, hence on the required
Abel interval `1/2<=z<=1`.

## 2. Odd degree: only a centered positive-tail moment is harmful

For odd `kappa`, write the certified positive tail as

\[
 A(z)=\sum_{n>K}e_nz^n,\qquad e_n\geq0\quad(n>K).
\]

Then

\[
 P=P_K+A,\qquad N=N_K,qquad
 S=S_K+A,qquad S'=S_K'+A'.                     \tag{3}
\]

Thus `S_K(1/2)>=0` and `S_K'>=0` are already sufficient for the full seed
and derivative; the infinite tail cannot damage either condition.

For the aggregate, direct expansion gives the exact identity

\[
 \boxed{D=D_K+A'N_K-AN_K'.}                     \tag{4}
\]

If `N_K(z)>0`, define its Abel-tilted mean index

\[
 \mu_-(z)={zN_K'(z)\over N_K(z)}.
\]

Equation (4) becomes

\[
 \boxed{
 D(z)=D_K(z)+N_K(z)\sum_{n>K}
       (n-\mu_-(z))e_nz^{n-1}.}                 \tag{5}
\]

Every summand in (5) is nonnegative because `mu_-(z)<=K<n`.  Hence the
positive far tail is precisely the harmful aggregate correction; there is
no tail--tail term and no dependence on the positive head mass.

Let `m` be any certified lower bound for `mu_-(z)` on the Abel interval.
The smallest negative-head index is always such a bound.  If

\[
 U_m(z)\geq\sum_{n>K}(n-m)e_nz^{n-1},            \tag{6}
\]

then (5) yields the sufficient all-index condition

\[
 \boxed{D_K(z)+N_K(z)U_m(z)\leq0.}              \tag{7}
\]

Compared with the generic total-variation estimate, (7) removes every
`P_K T_1`, `P_K'T_0`, and `T_0T_1` payment.  At `kappa=1`, where the only
negative cell in the separately studied conditional pattern is at index
two, `m=2` recovers the centered multiplier `n-2` in the exact
one-negative-cell identity.  The unconditional `kappa=1` certificate does
not assume that remote sign pattern.

If `N_K=0`, then `D=0`; strict reverse order necessarily requires a
nonempty negative head.

## 3. Even degree: the negative tail helps the aggregate

For even `kappa`, write

\[
 B(z)=\sum_{n>K}(-e_n)z^n,\qquad -e_n\geq0\quad(n>K).
\]

Now

\[
 P=P_K,\qquad N=N_K+B,qquad
 S=S_K-B,qquad S'=S_K'-B',                     \tag{8}
\]

and

\[
 D=D_K+P_K'B-P_KB'.                             \tag{9}
\]

Every positive-head index is at most `K`, whereas every index in `B` is
larger than `K`.  The pairwise form of (9) therefore gives

\[
 P_K'B-P_KB'
 =\sum_{i\leq K<j}(i-j)e_i^+(-e_j)z^{i+j-1}\leq0.
\]

Consequently

\[
 \boxed{D(z)\leq D_K(z).}                       \tag{10}
\]

Thus a finite-head proof `D_K<=0` is automatically an all-index proof at
even degree, independent of the size of the remote tail.  Only the other
two gates need quantitative tail bounds:

\[
 \boxed{
 S_K(1/2)>B(1/2),\qquad
 S_K'(z)>B'(z),\qquad D_K(z)\leq0.}             \tag{11}
\]

This cleanly separates the even-degree analytic work: Bessel size bounds
pay the seed and derivative, while sign placement pays the aggregate for
free.

## 4. Explicit geometric majorants

The Bessel theorem also supplies an effectively certifiable `rho` and `K`
with

\[
 0<\rho<1,qquad |e_{n+1}|\leq\rho|e_n|
 \quad(n\geq K+1).
\]

Let `E` be any certified upper bound for `|e_(K+1)|`.  For `0<z<=1`,
summing the geometric series gives

\[
 T_0(z):=\sum_{n>K}|e_n|z^n
 \leq {Ez^{K+1}\over1-\rho z},                 \tag{12}
\]

\[
 T_1(z):=\sum_{n>K}n|e_n|z^{n-1}
 \leq Ez^K\left\{{K+1\over1-\rho z}
              +{\rho z\over(1-\rho z)^2}\right\},          \tag{13}
\]

and, for `m<=K`,

\[
 U_m(z)\leq Ez^K\left\{{K+1-m\over1-\rho z}
              +{\rho z\over(1-\rho z)^2}\right\}.          \tag{14}
\]

Equations (12)--(14) are sharper than an arbitrary-sign power tail once the
eventual sign threshold is known.  They also expose the only odd-degree
penalty: the centered moment `U_m`, not the full derivative moment.

## 5. The theorem-shaped continuation target

For each actual residual, first certify a Bessel threshold `K_kappa` and a
geometric pair `(E_kappa,rho_kappa)` using the complete physical-orbit
representation.  It is then sufficient to prove the following finite-head
inequalities uniformly on `1/2<=z<=1`:

- odd `kappa`: `S_K(1/2)>0`, `S_K'(z)>0`, and
  `D_K(z)+N_K(z)U_m(z)<0`;
- even `kappa`: `S_K(1/2)>T_0(1/2)`,
  `S_K'(z)>T_1(z)`, and `D_K(z)<0`.

These statements include the entire infinite cell sequence.  A finite head
is not being substituted for the complete object; the omitted cells are
handled analytically by (3)--(14).

The current fixed-residual Bessel asymptotic is not uniform in `kappa`:
its differentiated remainder constants depend on the residual coefficients
and derivative order.  Therefore the displayed reduction does not by
itself prove the needed all-degree theorem.  The remaining analytic lemma
is an explicit degree-dependent threshold and head-margin estimate strong
enough to make the parity-resolved inequalities above uniform.  Enlarging a
floating cell table cannot replace that lemma.
