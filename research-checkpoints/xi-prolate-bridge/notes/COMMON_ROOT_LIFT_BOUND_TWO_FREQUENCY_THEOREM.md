# Common-root lift bound for two-frequency phase synchronization

## 0. Exact outcome and claim boundary

This note gives a parameter-uniform common-root bound for the abstract
two-frequency phase problem.  Fix `1 <= p < q`, positive `B, omega`, and
positive orbit weights.  Put `d=q-p`.  The number of **distinct** common
phase roots of the scalar signals `P` and `V` is at most

\[
 \boxed{2\gcd(d,2p).}                              \tag{0.1}
\]

The bound includes the degenerate branch on which the lifted equation for
`P` vanishes identically over one value of `z^d`: on that branch the lifted
equation for `V` still fixes `z^(2p)`.  No false modulus exclusion is used.

For a primitive mixed-parity pair, `d` is odd and
`gcd(p,d)=gcd(p,q)=1`, so (0.1) is `2`.  If `p>=2`, the distinct-sign
Sturm--Hurwitz bound gives at least `2p>=4` sign-changing roots of `P`.
Failure of synchronization would force all of them to be common roots of
`P,V`, which is impossible.  Hence

\[
 \boxed{\gcd(p,q)=1,\quad p\not\equiv q\pmod2,\quad p\geq2
 \Longrightarrow \exists t:\ P(t)>0,\quad P(t)W(t)-V(t)^2<0.} \tag{0.2}
\]

If a primitive pair has the same parity, both integers are odd and the
phase shift by `pi` is the global antipode.  The frozen antipodal argument
then gives the same favorable phase.  Thus every primitive two-frequency
pair with lower frequency `p>=2` is synchronized for every positive
parameter and weight ratio.

The lift bound alone is saturated when `p=1` and `q` is even.  The primitive
`1:2` case is already closed by the frozen exact quotient-circle theorem;
`1:4` requires its separate elimination argument; and the cases `1:q` with
even `q>=6` remain open here.  This note neither asserts a failure in those
cases nor promotes a numerical candidate to a theorem.

This is an abstract finite-edge phase theorem.  It does **not** prove that an
actual zeta right edge is finite, has exactly two commensurable ordinates,
or realizes any specified ratio.  It proves neither RH nor its negation, no
Lambda bound, no routing contraction, no positive full Laplacian, and not
equation (5.2) of `DIRECT_RH_ATTACK.md`.  The formal state remains
`P0_INVALIDATED`.  No status, replay, source lock, integration manifest, or
checkpoint artifact is changed.

## 1. Frozen dependencies and normalized signals

The deductions are bound to these exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md` | `ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1` |
| `notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md` | `a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc` |
| `notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md` | `00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff` |
| `notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md` | `6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959` |
| `notes/SHORT_GAP_TWO_FREQUENCY_PHASE_THEOREM.md` | `60e1f3fed5218b37a03532cf48db3c26049269a7559bcbede2bf6690e43c3fc7` |

Put

\[
 b_n=(B+in\omega)^{-2},\qquad n\in\{p,q\}.        \tag{1.1}
\]

After division by the positive weight `r_p`, write

\[
 R={r_q\over r_p}>0,\qquad a=b_p,\quad c=b_q,
 \quad A=\overline a,\quad C=\overline c.          \tag{1.2}
\]

For `z=e^(it)`, the normalized signals are

\[
 \begin{aligned}
 P_0(t)&=az^p+Az^{-p}+Rcz^q+RCz^{-q},\\
 V_0(t)&=a^2z^p+A^2z^{-p}+Rc^2z^q+RC^2z^{-q},\\
 W_0(t)&=a^3z^p+A^3z^{-p}+Rc^3z^q+RC^3z^{-q}.
 \end{aligned}                                     \tag{1.3}
\]

Multiplication by the positive factors `r_p` and `r_p^2` changes none of
the relevant signs.  At a sign-changing root of `P_0`,

\[
 P_0W_0-V_0^2=-V_0^2.                              \tag{1.4}
\]

Consequently, if no phase has `P_0>0` and `P_0W_0-V_0^2<0`, every
sign-changing root of `P_0` must also be a root of `V_0`.

## 2. Exact quadratic remainder in `y=z^(q-p)`

Multiplying `P_0,V_0` by the nonzero unit `z^q` gives

\[
 \begin{aligned}
 F(z)&=Rc z^{2q}+a z^{p+q}+A z^d+RC,\\
 G(z)&=Rc^2z^{2q}+a^2z^{p+q}+A^2z^d+RC^2,
 \end{aligned}\qquad d=q-p.                       \tag{2.1}
\]

Set `L=cF-G` and take the denominator-free combination

\[
 H(z)=(Rc z^d+a)L(z)-a(c-a)F(z).                  \tag{2.2}
\]

The terms of degrees `2q` and `p+q` cancel.  With `y=z^d`, direct
expansion gives

\[
 \boxed{H(z)=h_2y^2+h_1y+h_0,}                    \tag{2.3}
\]

where

\[
 \begin{aligned}
 h_2&=RcA(c-A),\\
 h_1&=aA(a-A)+R^2cC(c-C),\\
 h_0&=RaC(a-C).
 \end{aligned}                                     \tag{2.4}
\]

Every common root of `F,G` is a root of `H`.  The quadratic is genuine.
Indeed, `c!=A`: otherwise

\[
 (B+iq\omega)^2=(B-ip\omega)^2,
\]

whose difference has the two nonzero factors
`i(p+q)omega` and `2B+i(q-p)omega`.  Conjugation similarly gives
`a!=C`.  Thus `h_2h_0!=0`, and there are at most two possible values of
`y=z^d` above all common roots.

## 3. Every `y` has at most `gcd(d,2p)` common lifts

Because `q=p+d`, equations (2.1) can be regrouped exactly as

\[
 \begin{aligned}
 F(z)&=z^{2p}U(y)+T(y),\\
 G(z)&=z^{2p}U_2(y)+T_2(y),                       \tag{3.1}
 \end{aligned}
\]

with

\[
 \begin{array}{ll}
 U(y)=Rc y^2+ay,&T(y)=Ay+RC,\\
 U_2(y)=Rc^2y^2+a^2y,&T_2(y)=A^2y+RC^2.
 \end{array}                                      \tag{3.2}
\]

Fix one nonzero value of `y`; for a phase root it has `|y|=1`.  There are
three exhaustive cases.

1. If `U(y)!=0`, the equation `F=0` fixes the single value

   \[
    z^{2p}=-{T(y)\over U(y)}.                      \tag{3.3}
   \]

2. If `U(y)=0` and `T(y)!=0`, there is no root of `F` above `y`.

3. If `U(y)=T(y)=0`, the first equation in (3.1) imposes no condition on
   `z^(2p)`.  This is the degenerate branch that must not be discarded.
   Since `y!=0`, the equality `U=0` gives `Rc y=-a`, and hence

   \[
   \begin{aligned}
    U_2(y)
      &=y\{Rc^2y+a^2\}\\
      &=ay(a-c)\neq0.                              \tag{3.4}
   \end{aligned}
   \]

   Here `a!=c`, since equality of their inverse squares would force either
   `p=q` or `2B+i(p+q)omega=0`.  Therefore the second equation in (3.1)
   fixes

   \[
    z^{2p}=-{T_2(y)\over U_2(y)}.                  \tag{3.5}
   \]

In every case admitting a common phase root, its lift belongs to a system

\[
 z^d=y,\qquad z^{2p}=w                             \tag{3.6}
\]

for one fixed `w`.  If `z_1,z_2` are two solutions, their quotient satisfies

\[
 (z_1/z_2)^d=(z_1/z_2)^{2p}=1.                   \tag{3.7}
\]

The intersection of the groups of `d`-th and `2p`-th roots of unity has
exactly `gcd(d,2p)` elements.  Thus (3.6) has at most that many solutions.
Combining this lift count with the two possible roots of (2.3) proves
(0.1).

Notice what is *not* asserted in the degenerate case: the modulus of the
right side of (3.5) is not claimed to differ from one.  It can equal one;
compatibility with `z^d=y` is then a genuine phase condition.  The lift
count remains valid because (3.5), rather than (3.3), fixes `z^(2p)`.

## 4. Primitive mixed parity with `p>=2`

Assume `gcd(p,q)=1` and `p,q` have opposite parity.  Then `d=q-p` is odd,
and

\[
 \gcd(p,d)=\gcd(p,q-p)=\gcd(p,q)=1.               \tag{4.1}
\]

It follows that

\[
 \gcd(d,2p)=1.                                    \tag{4.2}
\]

Therefore (0.1) permits at most two distinct common phase roots.

On the other hand, `P_0` is a nonzero real trigonometric polynomial whose
first nonzero harmonic is exactly `p`.  The frozen distinct-sign
Sturm--Hurwitz lemma gives at least `2p` distinct sign-changing roots.  If
synchronization failed, (1.4) and continuity would force `V_0` to vanish at
all of them.  For `p>=2`, this would give at least four distinct common
roots, contradicting (0.1).  This proves (0.2).

The requested large-gap primitive examples `(2,5)` and `(2,7)` are covered
uniformly: their differences are respectively `3` and `5`, so their exact
common-root bounds are both `2`, while `P_0` has at least `4` distinct sign
boundaries.  No search over `x=omega/B` or `R` is needed.

## 5. Primitive same parity and the complete `p>=2` class

If a primitive pair has the same parity, it cannot contain two even
integers.  Hence `p,q` are both odd.  The shift `t -> t+pi` sends

\[
 (P_0,V_0,W_0)\longmapsto(-P_0,-V_0,-W_0)         \tag{5.1}
\]

and leaves the covariance `P_0W_0-V_0^2` unchanged.  Its phase mean is

\[
 -4\{|a|^2(\Im a)^2+R^2|c|^2(\Im c)^2\}<0.      \tag{5.2}
\]

Thus the covariance is negative at some phase.  If `P_0` is nonzero there,
one of that phase and its antipode has `P_0>0`.  If `P_0=0`, strict
negativity persists on a neighborhood, and the nonzero analytic function
`P_0` is nonzero at a nearby phase; apply the same antipodal choice there.

This covers the requested `(1,5)` and `(3,7)` pairs.  Combining it with
Section 4 shows that **every primitive pair with `p>=2`** has a favorable
phase for every positive `B,omega,R`.

## 6. Exact surviving boundary

For primitive mixed parity with `p=1`, the upper bound (0.1) and the
Sturm--Hurwitz lower bound are both `2`.  The counting argument is therefore
saturated and cannot distinguish a true synchronization failure from a
candidate with two shared boundary roots.  Since primitivity and mixed
parity then mean exactly that `q` is even, the surviving family is

\[
 (p,q)=(1,q),\qquad q\geq2\text{ even}.           \tag{6.1}
\]

The frozen quotient-circle theorem closes `q=2`.  The `q=4` member has a
separate exact elimination analysis and is not a consequence of the lift
count.  This note leaves every even `q>=6`, including the requested `1:6`
case, open.  High-precision branch searches do not alter that logical
boundary and are not premises of this theorem.

For nonprimitive pairs one may first divide by `gcd(p,q)` and reparametrize
the same phase circle, exactly as in the frozen short-gap theorem.  No
actual-zeta edge geometry follows from that elementary reduction.

## 7. Fail-closed conclusion

The result is the exact common-root budget (0.1), the primitive
mixed-parity synchronization theorem (0.2), and the combination with the
same-parity antipode.  It does not classify the saturated family (6.1),
does not assert that a common-zero candidate is a failure, and does not use
floating diagnostics as proof.  A countably infinite attained edge, a
nonattained edge, higher Schur pivots, full-section connectivity, Laplacian
positivity, and routing contraction remain outside this theorem.  The
formal state remains `P0_INVALIDATED`.
