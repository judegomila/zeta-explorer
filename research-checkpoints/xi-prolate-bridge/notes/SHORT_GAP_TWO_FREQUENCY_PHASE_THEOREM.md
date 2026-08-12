# Short-gap two-frequency phase synchronization

## 0. Outcome and fail-closed boundary

This note closes a parameter-uniform part of the two-frequency phase problem.
Fix integers `1 <= p < q`, positive `B, omega`, and positive orbit weights.
If

\[
 q<2p,
\]

then some phase satisfies

\[
 P>0,\qquad {\cal C}=PW-V^2<0.                    \tag{0.1}
\]

The proof is exact.  A denominator-free Bezout remainder shows that the
self-inversive polynomial lifts of `P` and `V` have at most `2(q-p)` common
roots, counted with multiplicity.  A distinct-sign version of the
Sturm--Hurwitz argument shows that `P` has at least `2p` **distinct**
sign-changing zeros.  If (0.1) failed, every one of those zeros would be a
common zero of `P` and `V`, contradicting `q<2p`.

Combining this strict short-gap theorem with the frozen exact `1:2` theorem
gives the same conclusion for

\[
 \boxed{q\leq 2p}                                 \tag{0.2}
\]

after primitive reduction.  In particular, the primitive pair `(p,q)=(2,3)`
has no global hull antipode but has (0.1) for every positive `B, omega` and
every positive weight ratio.  Thus every common-zero candidate ratio for
`2:3` is harmless: the candidate set and the failure set are not the same.
The argument does not require the candidate set to be empty.

This is an abstract finite-edge phase theorem.  It does **not** prove that an
actual zeta right edge is finite, has exactly two conjugate orbits, or has
commensurable ordinates with ratio at most `2`.  It proves neither RH nor its
negation, no Lambda bound, no routing contraction, no positive full
Laplacian, and not equation (5.2) of `DIRECT_RH_ATTACK.md`.  The formal state
remains `P0_INVALIDATED`.  No numerical search, source lock, replay, status,
or integration artifact is created here.

## 1. Frozen dependencies and normalized signals

The deductions are bound to these exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md` | `ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1` |
| `notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md` | `00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff` |
| `notes/TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md` | `6a704c20640a9c113836904e91c7fafbe12bee0a03d31f623faad988bd306959` |

For `n in {p,q}`, put

\[
 b_n=(B+in\omega)^{-2}.                            \tag{1.1}
\]

With positive weights `r_p,r_q` and `z=e^{it}`, define

\[
 \begin{aligned}
 P(t)&=2\Re\{r_pb_pz^p+r_qb_qz^q\},\\
 V(t)&=2\Re\{r_pb_p^2z^p+r_qb_q^2z^q\},\\
 W(t)&=2\Re\{r_pb_p^3z^p+r_qb_q^3z^q\},\\
 {\cal C}(t)&=P(t)W(t)-V(t)^2.
 \end{aligned}                                     \tag{1.2}
\]

Divide all three linear signals by `r_p` and put

\[
 R={r_q\over r_p}>0,\qquad
 a=b_p,\quad c=b_q,\quad A=\overline a,\quad
 C=\overline c,\quad d=q-p.                       \tag{1.3}
\]

Then `P=r_pP_0`, `V=r_pV_0`, `W=r_pW_0`, and
`PW-V^2=r_p^2(P_0W_0-V_0^2)`.  The factor is positive, so normalization
changes none of the signs in (0.1).  The normalized signals are

\[
 \begin{aligned}
 P_0(t)&=az^p+Az^{-p}+Rcz^q+RCz^{-q},\\
 V_0(t)&=a^2z^p+A^2z^{-p}+Rc^2z^q+RC^2z^{-q},
 \end{aligned}                                     \tag{1.4}
\]

with the analogous `W_0` and
`C_0=P_0W_0-V_0^2`.  In particular,

\[
 P_0(t_0)=0\quad\Longrightarrow\quad
 {\cal C}_0(t_0)=-V_0(t_0)^2.                     \tag{1.5}
\]

## 2. Boundary transversality, including repeated odd roots

Call `t_0` a sign-changing zero of `P_0` if every neighborhood of `t_0` on
the phase circle contains points where `P_0` is positive and points where it
is negative.  This definition counts a zero of odd multiplicity
`1,3,5,...` once and ignores a tangent zero of even multiplicity.

Suppose (0.1) fails.  Then every sign-changing zero of `P_0` is also a zero
of `V_0`.  Indeed, if `V_0(t_0) != 0`, (1.5) gives a strict negative value of
`C_0` at `t_0`.  By continuity, `C_0<0` throughout a neighborhood of `t_0`.
The positive side of the sign change supplies a nearby phase with
`P_0>0,C_0<0`, contrary to failure.  Hence

\[
 \boxed{\text{failure forces }V_0(t_0)=0
 \text{ at every sign-changing zero of }P_0.}      \tag{2.1}
\]

No simplicity assumption occurs in this reduction.

## 3. A distinct-sign Sturm--Hurwitz lemma

We need a form of Sturm--Hurwitz that counts distinct sign boundaries, not
zeros with algebraic multiplicity.

**Lemma.**  Let `f` be a nonzero real trigonometric polynomial whose Fourier
coefficients vanish in every mode `|k|<p`, where `p>=1`.  Then `f` has at
least `2p` distinct sign-changing zeros on the phase circle.

To prove the lemma, first note that the zero constant coefficient makes
`f` have mean zero.  Thus `f` assumes both signs.  Its zeros are isolated,
and its distinct sign-changing zeros occur in an even number, say

\[
 t_1,\ldots,t_{2m}.                                \tag{3.1}
\]

If `m<p`, form

\[
 Q(t)=\prod_{j=1}^{2m}\sin {t-t_j\over2}.          \tag{3.2}
\]

Each half-angle sine factor is antiperiodic under `t -> t+2*pi`.  Because
the number `2m` of factors is even, their product `Q` is `2*pi`-periodic.
Expanding each half-angle sine in exponentials shows that `Q` is a trigonometric
polynomial of degree at most `m`: the half-integer exponents add to the
integer modes `-m,...,m`.  After multiplying `Q` by one global sign, `Q` and
`f` have the same sign on every complementary arc.  Therefore `fQ>=0`
everywhere and `fQ>0` on an open subarc.  Hence

\[
 \int_0^{2\pi}f(t)Q(t)\,dt>0.                     \tag{3.3}
\]

But `m<p`, so every Fourier mode of `Q` is orthogonal to every Fourier mode
of `f`, making the same integral zero.  This contradiction proves `m>=p`.

The proof uses the distinct points (3.1).  In particular, replacing a simple
sign-changing root by a triple or quintuple root does not weaken the lower
bound.  Non-sign-changing tangent roots play no role.

The first nonzero harmonic of `P_0` is exactly `p`, because its coefficient
`a` is nonzero.  The lemma therefore gives

\[
 \boxed{P_0\text{ has at least }2p
 \text{ distinct sign-changing zeros}.}           \tag{3.4}
\]

## 4. Exact self-inversive lifts

Multiplying (1.4) by the nonzero unit `z^q` produces two degree-`2q`
polynomials with exactly four displayed terms:

\[
 \begin{aligned}
 F(z)&=z^qP_0(t)
   =Rc z^{2q}+a z^{p+q}+A z^d+RC,\\
 G(z)&=z^qV_0(t)
   =Rc^2 z^{2q}+a^2 z^{p+q}+A^2 z^d+RC^2.
 \end{aligned}                                     \tag{4.1}
\]

They are self-inversive:

\[
 z^{2q}\overline{F(1/\overline z)}=F(z),\qquad
 z^{2q}\overline{G(1/\overline z)}=G(z).          \tag{4.2}
\]

For `|z|=1`, a common zero of `P_0,V_0` is exactly a common unit-circle
zero of `F,G`.  Multiplication by `z^q` preserves the local zero order.

Set

\[
 L(z)=cF(z)-G(z).                                  \tag{4.3}
\]

The top coefficient cancels, leaving

\[
 L(z)=a(c-a)z^{p+q}+A(c-A)z^d+RC(c-C).            \tag{4.4}
\]

Now take the following denominator-free polynomial combination:

\[
 H(z)=(Rc z^d+a)L(z)-a(c-a)F(z).                  \tag{4.5}
\]

The terms of degrees `2q` and `p+q` cancel exactly.  Direct expansion gives
the complete three-term identity

\[
 \boxed{
 \begin{aligned}
 H(z)={}&RcA(c-A)z^{2d}\\
 &+\{aA(a-A)+R^2cC(c-C)\}z^d\\
 &+RaC(a-C).
 \end{aligned}}                                   \tag{4.6}
\]

This is an exact Bezout/subresultant certificate.  It uses no division by
`c-a` or by a parameter-dependent expression.  Every common divisor of
`F` and `G` divides `L` and hence divides `H`.

## 5. The remainder has degree exactly `2(q-p)`

All possible coefficient degeneracies in (4.6) can be disposed of exactly.
First,

\[
 \Im b_n={-2Bn\omega\over(B^2+n^2\omega^2)^2}<0. \tag{5.1}
\]

Next, `c` cannot equal `A`.  Equality would imply

\[
 (B+iq\omega)^2=(B-ip\omega)^2,
\]

whereas the difference of the two sides factors as

\[
 i(p+q)\omega\{2B+i(q-p)\omega\}\neq0.           \tag{5.2}
\]

The harmless overall sign of this displayed difference is irrelevant; both
factors are nonzero.  Thus the leading coefficient in (4.6) is nonzero.
Conjugation also gives `a!=C`, so the constant coefficient is nonzero.  More
precisely, if `h_{2d}` and `h_0` denote those two coefficients, then

\[
 h_0=-\overline{h_{2d}}\neq0.                     \tag{5.3}
\]

Even the middle coefficient cannot vanish, because

\[
 \begin{aligned}
 h_d
 &=|a|^2(a-\overline a)+R^2|c|^2(c-\overline c)\\
 &=2i\{|a|^2\Im a+R^2|c|^2\Im c\},
 \end{aligned}                                     \tag{5.4}
\]

whose imaginary coefficient is strictly negative by (5.1).  Consequently
`H` is a nonzero polynomial of degree exactly `2d=2(q-p)` with nonzero
constant term.  It follows that

\[
 \boxed{
 \deg\gcd(F,G)\leq2(q-p),
 \quad\#\{\text{distinct common roots of }F,G\}
 \leq2(q-p).}                                     \tag{5.5}
\]

The first inequality counts common roots with their minimum algebraic
multiplicity.  The second, weaker inequality is the one needed below.  It
remains valid if `F`, `G`, or `H` has repeated roots.

## 6. The strict short-gap theorem

Assume for contradiction that (0.1) fails.  By (3.4), `P_0` has at least
`2p` distinct sign-changing zeros.  By (2.1), `V_0` vanishes at every one of
them.  The corresponding distinct unit phases are common roots of `F,G`.
Equation (5.5) therefore forces

\[
 2p\leq2(q-p).                                    \tag{6.1}
\]

But `q<2p` is equivalent to `q-p<p`, which contradicts (6.1).  Hence

\[
 \boxed{
 1\leq p<q<2p
 \quad\Longrightarrow\quad
 \text{some phase has }P>0,\ PW-V^2<0.}           \tag{6.2}
\]

The proof covers every positive weight ratio, including every ratio in the
finite common-zero candidate set `E_{p,q}(B,omega)` from the frozen
two-frequency transversality theorem.  Candidate membership is necessary
for possible failure in general, but it is not sufficient here.

## 7. Primitive reduction and the saturated boundary `q=2p`

The preceding proof does not require `p,q` to be coprime.  For clarity, let

\[
 g=\gcd(p,q),\qquad p=gp_0,qquad q=gq_0,qquad
 \Omega=g\omega,qquad s=gt.                      \tag{7.1}
\]

Then

\[
 (B+ip\omega)^{-2}=(B+ip_0\Omega)^{-2},\qquad
 (B+iq\omega)^{-2}=(B+iq_0\Omega)^{-2},           \tag{7.2}
\]

and the original phase circle is exactly the primitive `p_0:q_0` circle,
traversed `g` times.  Thus primitive reduction changes neither the available
phases nor the existence assertion (0.1).

When `q=2p`, primitive reduction gives `(p_0,q_0)=(1,2)`.  In this saturated
case the two counts in (6.1) are equal, so the short-gap contradiction alone
does not close the problem.  The frozen
`TWO_FREQUENCY_PHASE_TRANSVERSALITY_THEOREM.md` supplies the missing exact
quotient-circle argument and proves the universal `1:2` result.  Combining
that boundary theorem with (6.2) yields

\[
 \boxed{
 1\leq p<q\leq2p
 \quad\Longrightarrow\quad
 \text{some phase has }P>0,\ PW-V^2<0.}           \tag{7.3}
\]

For a primitive pair, the equality case is already `(1,2)`.

## 8. The primitive non-antipodal `2:3` corollary

For the primitive `2:3` hull, the integer relation lattice is generated by
`(3,-2)`.  Its coordinate sum is odd.  Equivalently, no phase can multiply
both coordinate characters by `-1`, so the global hull antipode is absent.
Nevertheless `3<2*2`, and (6.2) proves

\[
 \boxed{
 \text{For every }B,\omega,r_2,r_3>0\text{ on the }2:3\text{ hull,}
 \quad P>0,\quad PW-V^2<0
 \text{ at some phase}.}                          \tag{8.1}
\]

Thus no `2:3` common-zero candidate ratio is a true synchronization failure.
The mechanism is not an antipodal sign flip: it is the mismatch between the
`4` distinct sign boundaries forced by the lowest harmonic and the at most
`2` common roots allowed by (4.6).

## 9. Exact boundary of the claim

For `q>2p`, the root budget (5.5) is too large to contradict the
Sturm--Hurwitz lower bound.  This argument therefore does not classify the
common-zero candidate ratios in that long-gap range.  It also does not
control three or more phase-locked frequencies, an arbitrary finite or
countable attained edge, or a nonattained edge.

If an actual zeta right edge were separately proved to be finite and to
consist of exactly two conjugate orbits with the geometry in (7.3), the
frozen recurrence, strict-grid transfer, and residual estimates could use
this phase theorem in the same conditional way as the earlier `1:2` theorem.
No such actual-zeta geometry is proved here.  In particular, (7.3) makes no
unconditional assertion about zeta zeros and changes no formal project
status.  All computations in the regression are exact standard-library
arithmetic; floating searches are neither used nor cited as evidence.
