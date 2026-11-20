# Growing-transition locked-carrier flat scalar-sum theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2={\pi p^2\over2},
 \qquad \omega_M(m)=\left(1-{m\over M+1}\right)_+ .       \tag{0.1}
\]

Since `p^2=1 mod 8`, the exact far carrier is

\[
 \boxed{e^{icN}=i^N,\qquad N\in\mathbb Z.}                 \tag{0.2}
\]

For `N>1`, the frozen flat Weber transform is

\[
 F_0(N,\alpha)={-i\over\sqrt{N^2-1}}
 \exp\left\{{i\alpha\over4}\log{N+1\over N-1}\right\}.
                                                               \tag{0.3}
\]

Put

\[
 a={1\over2}+{i\alpha\over4},\qquad
 b={1\over2}-{i\alpha\over4},                             \tag{0.4}
\]

and

\[
 \boxed{
 c_k(\alpha)=\sum_{j+r=k}
 { (a)_j\over j!}{(-1)^r(b)_r\over r!}.}                   \tag{0.5}
\]

Then the exact convergent expansion for every integer `N>=2` is

\[
 \boxed{
 F_0(N,\alpha)=-i\sum_{k\geq0}{c_k(\alpha)\over N^{k+1}}.} \tag{0.6}
\]

This note also sums the locked carrier against the ordered finite-Fejer
prime coefficient.  For `Re s>1`, define

\[
 P(s)=\sum_{n\geq2}{\Lambda(n)\over n^s}
     =-{\zeta'(s)\over\zeta(s)},\qquad
 Q_r(s)=\sum_{n\geq2}{\Lambda(n)i^{rn}\over n^s},
 \quad r\in\mathbb Z/4\mathbb Z.                         \tag{0.7}
\]

Let `chi_4` be the primitive character modulo four, put

\[
 E(s)=(\log2){2^{-s}\over1-2^{-s}},\qquad
 E_1(s)=(\log2)\left\{-2^{-s}+{2^{-2s}\over1-2^{-s}}\right\},
                                                               \tag{0.8}
\]

and write `L(s,chi_4)` for its Dirichlet `L`-function.  Direct residue-class
separation gives

\[
 \boxed{
 \begin{aligned}
 Q_0(s)&=P(s),\\
 Q_1(s)&=-i{L'\over L}(s,\chi_4)+E_1(s),\\
 Q_2(s)&=-P(s)+2E(s),\\
 Q_3(s)&=+i{L'\over L}(s,\chi_4)+E_1(s).
 \end{aligned}}                                           \tag{0.9}
\]

For the ordered prime sampler put

\[
 \ell_M(N)=\sum_{n\mid N}\Lambda(n)\omega_M(N/n),
 \qquad
 L_{M,i}(s)=\sum_{N\geq2}{\ell_M(N)i^N\over N^s}.          \tag{0.10}
\]

Absolute convergence in `Re s>1` permits the exact factorization

\[
 \boxed{
 L_{M,i}(s)=\sum_{1\leq l\leq M}
 {\omega_M(l)\over l^s}Q_{l\bmod4}(s).}                  \tag{0.11}
\]

The finite-cutoff center coefficient from the exact both-miss
inclusion--exclusion is

\[
 C_M(N)=2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N).    \tag{0.12}
\]

Consequently its locked-carrier Dirichlet transform is

\[
 \boxed{
 C_{M,i}(s):=\sum_{N\geq2}{C_M(N)i^N\over N^s}
 =2\omega_M(1)L_{M,i}(s)-\omega_M(1)^2Q_1(s).}            \tag{0.13}
\]

Finally, for every `sigma>0`, the absolutely convergent scalar flat sum

\[
 {\cal S}_{M,\sigma}(\alpha)
 :=\sum_{N\geq2}C_M(N)i^NF_0(N,\alpha)N^{-\sigma}          \tag{0.14}
\]

has the exact moment expansion

\[
 \boxed{
 {\cal S}_{M,\sigma}(\alpha)
 =-i\sum_{k\geq0}c_k(\alpha)
       C_{M,i}(k+1+\sigma).}                             \tag{0.15}
\]

Equations (0.9), (0.11), and (0.15) are the complete conclusion of this
package.  They show that the ordinary locked-carrier `N>=2` scalar sum is
an infinite tower of additive-twisted zeta and `L(s,chi_4)` logarithmic
derivatives.  It is not the untwisted product `P(s)Z_M(s)`, where

\[
 Z_M(s)=\sum_m\omega_M(m)m^{-s},                         \tag{0.16}
\]

and it is not a finite-`M` Xi Christoffel--Darboux numerator.

The statement is deliberately scalar and flat.  It does **not** promote
`F_0` through the variable far Jost coefficient, the cutoff, or the exact
exterior metric; prove the complete pre-Hermitian physical assembly `PA`;
orient the masks `R,C_R,C_L,B` in the physical left/right slots; take
`sigma` down to zero; take `M` to infinity; continue to the critical line;
cancel the upper conjugated-Hilbert channel; prove a complete edge floor;
or prove RH.  The formal project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

No external source or zero table is used.  The exact scalar transform,
local upper channel, complete Chebyshev transform, and finite-Fejer center
coefficient are frozen at these bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md` | `16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0` |
| `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` | `fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md` | `c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9` |

The identities below are elementary consequences of those frozen formulas.
In particular, (0.9)--(0.15) use only absolutely convergent series in
`Re s>1` and `sigma>0`.

## 2. Exact Weber power series

Factor (0.3) as

\[
 \begin{aligned}
 F_0(N,\alpha)
 &=-i(N-1)^{-1/2-i\alpha/4}
       (N+1)^{-1/2+i\alpha/4}\\
 &=-iN^{-1}(1-N^{-1})^{-a}(1+N^{-1})^{-b}.             \tag{2.1}
 \end{aligned}
\]

The two binomial series are absolutely convergent for `|N^(-1)|<1`:

\[
 (1-x)^{-a}=\sum_{j\geq0}{(a)_j\over j!}x^j,
 \qquad
 (1+x)^{-b}=\sum_{r\geq0}{(-1)^r(b)_r\over r!}x^r.    \tag{2.2}
\]

Their Cauchy product is (0.5), proving (0.6).  The first coefficients are

\[
 c_0=1,\qquad c_1={i\alpha\over2},\qquad
 c_2={1\over2}-{\alpha^2\over8}.                       \tag{2.3}
\]

For `alpha` in a fixed compact set, the product in (2.1) is analytic on
`|x|<1`; hence its Taylor series is uniformly absolutely convergent on
`|x|<=1/2`.  This is the uniformity needed to insert (0.6) into (0.14).

## 3. Exact modulo-four carrier decomposition

For odd `n`,

\[
 i^n=i\chi_4(n),\qquad
 i^{3n}=-i\chi_4(n),\qquad i^{2n}=-1.                  \tag{3.1}
\]

The only even integers on which `Lambda` is nonzero are `n=2^k`.  Their
total Dirichlet series is

\[
 \sum_{k\geq1}{\log2\over2^{ks}}=E(s).                \tag{3.2}
\]

For the carrier `i^n`, the first power `2` has sign `-1`, while all powers
`2^k`, `k>=2`, have sign `+1`.  Their contribution is therefore

\[
 (\log2)\left\{-2^{-s}+\sum_{k\geq2}2^{-ks}\right\}
 =E_1(s).                                               \tag{3.3}
\]

The same even contribution occurs for `i^(3n)`.  Also

\[
 -{L'\over L}(s,\chi_4)
 =\sum_{n\geq2}{\Lambda(n)\chi_4(n)\over n^s},
 \qquad \Re s>1.                                      \tag{3.4}
\]

Equations (3.1)--(3.4) prove all four rows of (0.9).  Notice that the
two-adic correction is part of the exact carrier.  Replacing `i^n` by
`i chi_4(n)` at even prime powers is false.

## 4. Ordered finite-Fejer convolution

Using `N=ln` in (0.10) and absolute convergence gives

\[
 \begin{aligned}
 L_{M,i}(s)
 &=\sum_{l\leq M}\sum_{n\geq2}
 {\omega_M(l)\Lambda(n)i^{ln}\over(ln)^s}\\
 &=\sum_{l\leq M}{\omega_M(l)\over l^s}
       Q_{l\bmod4}(s),
 \end{aligned}                                         \tag{4.1}
\]

which is (0.11).  Multiplying the exact center identity (0.12) by
`i^N N^(-s)` and summing proves (0.13).

This ordered twist is not multiplicative.  Already at `M=1`,

\[
 L_{1,i}(s)=\omega_1(1)Q_1(s),\qquad
 P(s)Z_1(s)=\omega_1(1)P(s),                            \tag{4.2}
\]

and the coefficient of `2^(-s)` has opposite sign in the two expressions.
Thus the locked scalar carrier cannot be replaced by the untwisted
identity `L_M=PZ_M`.

For `sigma>0`, one has `C_M(N)=O_M(log N)` and
`F_0(N,alpha)=O_alpha(N^(-1))`.  Thus (0.14) is absolutely convergent.
Uniform absolute convergence of (0.6) for `N>=2`, followed by Fubini,
proves (0.15).

The restriction `sigma>0` is substantive.  In (0.11), the coefficient of
the zeta pole `P(s)` is

\[
 A_M(s)=\sum_{\substack{l\leq M\\l\equiv0\ (4)}}
          {\omega_M(l)\over l^s}
       -\sum_{\substack{l\leq M\\l\equiv2\ (4)}}
          {\omega_M(l)\over l^s}.                     \tag{4.3}
\]

It is generally nonzero.  For example,
`A_2(s)=-omega_2(2)2^(-s)`.  The isolated scalar Abel limit can therefore
retain a pole at `s=1`.  The pole--main--Archimedean completion must be made
before any claim that `sigma` may tend to zero.

## 5. The `N=0` and `N=1` boundary of the scalar theorem

For every real integer `N>=2`,

\[
 r_N={1\over4}\log{N+1\over N-1}
 \in\left(0,{\log3\over4}\right],                     \tag{5.1}
\]

so the energy factor in (0.3) is the oscillatory translation
`exp(i alpha r_N)`.  At `N=1`, both `(N^2-1)^(-1/2)` and `r_N` are singular.
The exact theorem for `F_0` excludes that point.  It is precisely the
degenerate affine sampler `tau_1(u)=u`, whose local two-edge treatment
produces the logarithmic Carleman kernel.

There is a useful diagnostic, but not an allowed continuation.  On a chosen
branch,

\[
 {1\over4}\log{0+1\over0-1}={i\pi\over4}=ih,
 \qquad h={\pi\over4},                                 \tag{5.2}
\]

so the **phase factor** at the formal point `N=0` becomes
`exp(-h alpha)`; the opposite branch gives `exp(+h alpha)`.  This is the
exponential scale in the conjugated-Hilbert factors `E_h` and `E_h^(-1)`.
Equation (5.2) is not an extension of the scalar theorem to a sampler index
zero.

With the `m=l=1` Fejer weights restored, the frozen local pre-Hermitian
upper coefficient is

\[
 U_{11,M}={\lambda\omega_M(1)^2\over2c}
 \mathsf Z(I+\mathsf X)E_h\mathsf H E_h^{-1}
 \mathsf X\mathsf Z,                                  \tag{5.3}
\]

where `mathsf X=diag(chi_0(alpha_j))`,
`mathsf Z=diag(e_j/sqrt(d_j))`, and
`mathsf H_(jk)=1/(alpha_j-alpha_k)` off the diagonal.  The two physical
boundaries add in (5.3); reflection supplies the adjoint orientation.

Equations (5.1)--(5.3) give only the fail-closed conclusion:
an ordinary sum of the proved real-index `N>=2` scalar channels does not
establish cancellation of (5.3).  Such a cancellation, if true, must come
from a completed pre-Hermitian physical identity which also contains the
singular `N=1` channel, the pole and Archimedean pieces, reflected slots,
and the retained boundary rows.  This note neither proves nor disproves
that identity.

## 6. Rows and physical information not contained in the scalar sum

The exact oriented endpoint row is

\[
 2\Gamma_{\rm in}^*\rho,
 \qquad \rho=\beta_0-\lambda\beta_L,                   \tag{6.1}
\]

and its Hermitian part is

\[
 \Gamma_{\rm in}^*\rho+\rho^*\Gamma_{\rm in}.         \tag{6.2}
\]

It is not contained in (0.15).  Nor are the two finite-Fejer midpoint
half-rows.  At the exact endpoints `rho=0` and `rho=y_N`, under the
additional restriction

\[
 A<N<2A,                                                \tag{6.3}
\]

their scalar size is

\[
 E_{N,M}=\omega_M(1)
 \{\ell_M(N)-\omega_M(1)\Lambda(N)\},                 \tag{6.4}
\]

and the midpoint coefficient is

\[
 C_M(N)-{1\over2}E_{N,M}.                              \tag{6.5}
\]

The restriction in (6.3) is essential.  If `N>=2A`, a proper divisor
`n>=A` can be omitted from the endpoint boundary layer, so the second
equality in (6.4) need not hold.

These rows travel with the Plemelj boundary assembly.  The existing shear
`eta(f)=f(lambda)` only makes `Gamma_in=Gamma_out` on endpoint-null columns;
it does not annihilate their common sampler trace.

There is a second independent loss of information.  The fixed-product
coefficient `G_{N,M}` is invariant under exchange of the two sampler slots.
It cannot distinguish the pre-Hermitian products

\[
 Z_M(s)L_M(t)\qquad\hbox{and}\qquad L_M(s)Z_M(t).       \tag{6.6}
\]

The exact Weber masks determine the signs of two logarithmic coordinates,
but the frozen post-fold formulas do not say which coordinate is the
physical inward or outward slot after Poisson recombination and reflection.
Therefore (0.15) is not `U_(complete,M)`, and it supplies no proof of `PA`.

## 7. Consequence

The locked carrier can be summed exactly at the scalar flat level, but the
answer is the twisted tower (0.15), not a single zeta product.  The two-adic
terms, the `chi_4` logarithmic derivatives, the possible Abel pole, the
singular local channel, and the endpoint/midpoint rows all survive the exact
bookkeeping.  A complete cancellation claim must start before the
physical-boundary fold and must prove a joint ordered boundary-value and
weighted-composition theorem.  None of those steps follows from the scalar
identity proved here.
