# Full audit of the `N=1` integrated modular commutator test

## Verdict

With the now-supplied definitions

\[
 I_\pm=\int_0^\infty h e^{\pm2ah}\psi(h)^2\,dh,
 \qquad
 P_\pm=\int_0^\infty e^{\pm2ah}\psi(h)^2\,dh,            \tag{1}
\]

the proposed implication is correct, with important hypotheses and a narrow
conclusion.  In the archive's normalization, the exact `N=1` specialization
of the complete integrated modular commutator is

\[
 \boxed{
 \mathcal C_1=
 {4aI_-\over s_0s_1}
 \left\{
 I_+\bigl(M(a)-M(-a)\bigr)-a(P_++P_-)
 \right\},}                                               \tag{2}
\]

where

\[
 M(b)=\mathbb E_{\nu_b}[v^2],\quad
 d\nu_b={h e^{2bh}\psi^2\over I_b}\,dh,\quad
 v=-{\psi'\over\psi},                                    \tag{3}
\]

and `s_0,s_1` are the actual raw bridge pivots through degree one.  Therefore,
conditional on `a>0` and the archived positive-prefix hypothesis `s_0,s_1>0`,

\[
 2I_+\int_{-a}^a\sqrt{A_bB_b}\,db<a(P_++P_-)             \tag{4}
\]

does imply `mathcal C_1<0`.

This does **not** prove either pivot positive.  In particular, positivity of
`s_1` is an input needed to form the real current-pivot normalization, and the
next pivot `s_2` does not occur in (2).  The archived packet calls this
commutator an unpaid transfer term.  Its negative sign is a signed defect, not
a next-pivot payment.  Nothing here proves an all-degree statement or RH.

## 1. Domain, normalization, and the already-audited covariance bound

Take the undeformed actual complete-theta profile `psi`, which is even,
strictly positive, smooth, and super-exponentially decreasing.  Fix a finite
`a>0`.  Write `I_b,P_b` for (1) with `+/-a` replaced by a real `b`, and put

\[
 K_b=\int_0^\infty h e^{2bh}\psi^2v^2\,dh,
 \qquad M(b)={K_b\over I_b}.                              \tag{5}
\]

All of these integrals are finite for every finite real `b`.  The archived
curvature theorem gives `v'>17`, so the tilted potential satisfies

\[
 U_b''=h^{-2}+2v'>h^{-2}+34.                              \tag{6}
\]

Consequently

\[
 A_b=\mathbb E_{\nu_b}{1\over h^{-2}+2v'},\qquad
 B_b=\mathbb E_{\nu_b}{4v^2(v')^2\over h^{-2}+2v'}       \tag{7}
\]

are positive and finite.  The normalized tilt has score
`2(h-E_(nu_b)h)`, hence

\[
 M'(b)=2\operatorname {Cov}_{\nu_b}(h,v^2).               \tag{8}
\]

The asymmetric one-dimensional Brascamp--Lieb covariance inequality, applied
to `h` and `v^2`, gives

\[
 |M'(b)|\le2\sqrt{A_bB_b},
 \quad
 |M(a)-M(-a)|\le2\int_{-a}^a\sqrt{A_bB_b}\,db.           \tag{9}
\]

The factor two in (9) comes from the exponent `e^(2bh)`.  At the origin,
`v=O(h)` and the density is `O(h)`; at infinity theta decay dominates every
finite tilt.  Thus interval truncation followed by dominated convergence
introduces no endpoint term.

The modular archive omits one common target factor `pi/2`.  Equations
(1)--(2) follow that convention.  If `c=pi/2` is restored consistently in
both the pivots and the commutator integration measure, the factors cancel
and the pivot-normalized scalar is invariant.  If only the feature
normalization is changed while the displayed raw-`dh` integral is retained,
the scalar is multiplied by `c^(-1)`.  Either convention leaves its sign and
criterion (4) unchanged.  The endpoint `a=0` is not covered: raw `s_0`
vanishes there, and the archive requires its separate normalized limit.

## 2. Exact lineage from the archived commutator

The source is
`evidence/v20-v26-continuation/modular_cd_flux_v1/MODULAR_REFLECTION.md`:

- lines 14--22 define `T_j,F_j,s_j,Y_j` and assume the actual positive prefix;
- lines 24--41 define `R,r` and the rank-one reflection defect;
- lines 63--77 define `G`, `C=GX-XG`, and `eta=R^Tr`;
- lines 79--89 identify the one negative commutator direction and explicitly
  leave its pivot payment open.

The complete, rather than boundary-only, integrated scalar is equation (25)
of
`evidence/v20-v26-continuation/modular_innovation_payment_v1/BOUNDARY_ELIMINATION.md`:

\[
 \mathcal C_N
 =\int_0^\infty h e^{-4ah}Y(h)^TCY(h)\,dh
 =4a\operatorname {tr}H-2\eta^THe_N,                    \tag{10}
\]

where `y(h)=Y(-h)` and
`H=integral_0^infinity h y(h)y(h)^T dh`.  The signed derivative-of-weight
term has already been included in (10); no boundary-only substitution is
being made here.

For `N=1`, evenness of the moment functional gives

\[
 T_0(x)=1,\qquad T_1(x)=x,qquad
 T_2(x)=x^2+{s_1\over s_0}.                               \tag{11}
\]

Since `F_0=g=e^(au)psi` and `F_1=g'`, direct half-line splitting gives

\[
 s_0=\int_{\mathbb R}u g(u)^2\,du=I_+-I_-,               \tag{12}
\]

and, with

\[
 Q_+=\int_0^\infty h e^{2ah}\psi^2(a-v)^2\,dh,
 \quad
 Q_-=\int_0^\infty h e^{-2ah}\psi^2(a+v)^2\,dh,         \tag{13}
\]

\[
 \begin{aligned}
 Q_+&=K_+-aP_+-a^2I_+,\\
 Q_-&=K_-+aP_--a^2I_-,\\
 s_1&=Q_+-Q_-\\
    &=K_+-K_--a(P_++P_-)-a^2(I_+-I_-).                  \tag{14}
 \end{aligned}
\]

The signs in (13) are physical derivative signs: `g'(h)=e^(ah)psi(a-v)`
but `g'(-h)=e^(-ah)psi(a+v)`.

Put `rho=sqrt(s_0/s_1)`.  Substituting (11) in the archive's polynomial
reflection definitions gives, without using a next pivot,

\[
 R=\begin{pmatrix}1&0\\2a\rho&-1\end{pmatrix},\qquad
 r=\binom{4a^2\rho}{-4a},\qquad
 \eta=R^Tr=\binom{-4a^2\rho}{4a}.                        \tag{15}
\]

In particular `R^2=I`, `eta=-r`, and, with
`X_1=[[0,rho^(-1)],[-rho^(-1),0]]`,

\[
 C_1=GX_1-X_1G
 =\begin{pmatrix}4a&4a^2\rho\\4a^2\rho&-4a\end{pmatrix}.
                                                               \tag{16}
\]

For `N=1` this matrix also equals its reflected congruence `R^TC_1R`, as
one verifies directly.  Thus (16) and (10) have the same signs and factors.

## 3. Half-line Gram and factorization

The negative-side feature vector is

\[
 y(h)=Y(-h)=
 \binom{e^{-ah}\psi/\sqrt{s_0}}
       {e^{-ah}\psi(a+v)/\sqrt{s_1}}.                    \tag{17}
\]

One integration by parts, retaining the endpoint behavior, gives

\[
 \int_0^\infty h e^{-2ah}\psi^2(a+v)\,dh={P_-\over2}.
                                                               \tag{18}
\]

Therefore the entries needed in (10) are exactly

\[
 H_{00}={I_-\over s_0},\qquad
 H_{01}={P_-\over2\sqrt{s_0s_1}},\qquad
 H_{11}={Q_-\over s_1}.                                  \tag{19}
\]

Equations (10), (15), and (19) first give

\[
 \mathcal C_1
 =4a{I_-\over s_0}-4a{Q_-\over s_1}
   +4a^2{P_-\over s_1}.                                  \tag{20}
\]

Using (14) and `K_-=I_-M(-a)` then yields

\[
 \begin{aligned}
 \mathcal C_1
 &= {4aI_-\over s_0s_1}
    \{s_1+a^2s_0-s_0M(-a)\}\\
 &= {4aI_-\over s_0s_1}
    \{I_+[M(a)-M(-a)]-a(P_++P_-)\},                     \tag{21}
 \end{aligned}
\]

which is (2).  This is the exact bridge that was missing from the earlier
conditional audit.

For `a>0`, positivity of `psi` gives `I_->0`, while

\[
 I_+-I_-=2\int_0^\infty h\sinh(2ah)\psi^2\,dh>0.         \tag{22}
\]

Thus `s_0>0` is automatic.  The strict positivity of `s_1` is the remaining
current-prefix hypothesis.  Under it, the prefactor in (21) is strictly
positive.

Let `L=integral_(-a)^a sqrt(A_bB_b) db`.  Equation (9) and (4) give

\[
 I_+[M(a)-M(-a)]-a(P_++P_-)
 \le 2I_+L-a(P_++P_-)<0,                                 \tag{23}
\]

and (21) proves `mathcal C_1<0` with no missing factor or reversed sign.

## 4. A related normalized derivative difference is not the archive scalar

For `f_b=e^(bh)psi`, integration by parts gives

\[
 \mathbb E_{\nu_b}v=b+{P_b\over2I_b},\qquad
 {1\over I_b}\int_0^\infty h|f_b'|^2\,dh
 =M(b)-b^2-b{P_b\over I_b}.                              \tag{24}
\]

Consequently the plus/minus normalized shifted-derivative difference is

\[
 D_a=M(a)-M(-a)
       -a\left({P_+\over I_+}+{P_-\over I_-}\right).     \tag{25}
\]

Condition (4) also implies `D_a<0`, because `I_+>I_-`.  But `D_a` is not
`mathcal C_1`; the exact relation to the bracket in (21) is

\[
 I_+[M(a)-M(-a)]-a(P_++P_-)
 =I_+D_a+aP_-\left({I_+\over I_-}-1\right).              \tag{26}
\]

The final term is positive.  Identifying (25) with the archived scalar would
therefore lose a real normalization term.  The stronger common-`I_+`
condition (4) controls the actual bracket in (21), so no such identification
is needed.

## 5. Analytic theta bounds tried

The criterion remains conditional; this audit did not replace (4) by a
floating finite check.  Two analytic reductions do sharpen the next task.

For `h>=0`, write the full positive orbit expansion

\[
 \psi(h)=\sum_{n\ge1}4z_n(2z_n-3)e^{h/2-z_n},
 \qquad z_n=\pi n^2e^{2h}.                               \tag{27}
\]

The logarithmic slope of one orbit is

\[
 S(z)={9\over2}+{6\over2z-3}-2z,qquad
 -\partial_hS=4z+{24z\over(2z-3)^2}.                    \tag{28}
\]

If `w=-S`, then for `z>=pi>157/50`,

\[
 (-\partial_hS)-2w
 =9+{12\over2z-3}+{24z\over(2z-3)^2}
 \le {33054\over1681}<20.                               \tag{29}
\]

The rational function on the middle line is strictly decreasing for `z>3`,
so its right endpoint is obtained by inserting `157/50`.

The exact mixture-curvature identity is
`v'=E(-partial_h S)-Var(S)`.  Hence, together with the audited lower bound,

\[
 17<v'(h)<2v(h)+20.                                      \tag{30}
\]

This is a genuine complete-theta bound, not a one-orbit replacement.  It
also gives `v(h)>17h>=0`, since evenness gives `v(0)=0`.  It
implies the analytic estimates

\[
 A_b\le {1\over34},\qquad
 B_b\le4\mathbb E_{\nu_b}v^3+40M(b),                    \tag{31}
\]

and therefore

\[
 \sqrt{A_bB_b}
 \le\sqrt{{2\over17}\mathbb E_{\nu_b}v^3
                  +{20\over17}M(b)}.                    \tag{32}
\]

This proves finiteness and supplies a theta-specific majorant, but the
unpaid third moment makes (32) too coarse to establish (4).

A more targeted identity follows by integrating
`(h e^(2bh) psi^2 v)'`:

\[
 M(b)=b^2+b{P_b\over I_b}+{\psi(0)^2\over4I_b}
       +{1\over2}\mathbb E_{\nu_b}v'.                   \tag{33}
\]

Substitution in the exact bracket of (21) gives

\[
 \begin{aligned}
 &I_+[M(a)-M(-a)]-a(P_++P_-)\\
 &\quad={I_+\over2}
  \left(\mathbb E_{\nu_a}v'-\mathbb E_{\nu_{-a}}v'\right)
 -\left({I_+\over I_-}-1\right)
  \left({\psi(0)^2\over4}-aP_-\right).                 \tag{34}
 \end{aligned}
\]

Strong log concavity and evenness give
`psi(h)^2<=psi(0)^2 exp(-17h^2)`.  In the campaign range
`0<a<=1/4`, using `sqrt(pi)<2` and `sqrt(17)>4`,

\[
 aP_-\le a\psi(0)^2{\sqrt\pi\over2\sqrt{17}}
 <{\psi(0)^2\over16}.                                   \tag{35}
\]

Thus the second term in (34) has a rigorously favorable negative margin.  A
clean analytic proof of (4), or directly of the bracket sign, can now target
the single correlated tilt estimate

\[
 {I_+\over2}
 \left(\mathbb E_{\nu_a}v'-\mathbb E_{\nu_{-a}}v'\right)
 <\left({I_+\over I_-}-1\right)
  \left({\psi(0)^2\over4}-aP_-\right).                  \tag{36}
\]

Bounds (30)--(35) do not yet prove (36): available global derivative
envelopes do not control the correlated tilt variation of `v'` sharply
enough.  This is the remaining analytic theta inequality, not a request for
higher-degree finite certificates.

## 6. What the negative commutator says about pivots

Equation (21) is current-prefix data.  It assumes `s_1>0`; it cannot prove
that assumption.  Indeed, with the bracket in braces denoted by `B`, (14)
also gives

\[
 s_1=B+s_0\bigl(M(-a)-a^2\bigr),                         \tag{37}
\]

so `B<0` alone has no sign consequence for `s_1`.

Nor does `mathcal C_1<0` prove the next pivot `s_2>0`.  The next feature and
its signed Schur surplus are absent from (21).  The modular-reflection source
explicitly describes comparison of the one negative commutator direction
with the next-pivot/boundary reserve as unpaid, and
`BOUNDARY_ELIMINATION.md` warns that its separate dual-innovation criterion
must not be identified with the integrated commutator.  A next-pivot result
would require that additional payment inequality.

Accordingly, the valid conclusion is exactly:

> given the positive raw prefix through degree one, condition (4) is a
> noncircular sufficient test for negativity of the archived complete
> `N=1` integrated modular commutator.

It is not a pivot theorem, an all-degree induction, or an RH proof.

## Replay

`src/verify_modular_commutator_n1_bridge.py` is a standard-library exact
Laurent-polynomial replay.  It checks `R^2`, `R^Tr`, the `2x2` commutator,
the cleared half-line factorization, and the distinction (26), without
floating arithmetic or third-party algebra.  Its recorded output is
`results/modular_commutator_n1_bridge_replay.out`.

Equation-manifest SHA-256:
`2f25016acac8f4d3eb7d0ad79c41114b76aef82b42fd148824039ba50e40f459`.

Replay file SHA-256 values:

- checker: `a111617e6ac8969908599db18dabc68d6062356f5570d3e9fecc2c82e0dc91a1`;
- recorded output: `75babc9a0b122f564ebe0f1fd5f3a597643bc3c1dc6dd2681c878035816f4c87`.

This is an internal mathematical audit, not proof-assistant formalization or
external peer review.
