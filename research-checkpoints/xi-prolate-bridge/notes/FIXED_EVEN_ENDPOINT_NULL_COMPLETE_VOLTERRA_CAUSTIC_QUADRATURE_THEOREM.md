# Fixed-even endpoint-null complete Volterra caustic and quadrature theorem

## 0. Exact outcome and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad A=\lambda^2,
 \qquad L=\log A=2\log\lambda .                 \tag{0.1}
\]

Let `H_v` be the additive Fourier transform of the corrected, fully
metric-normalized label-`8/12` endpoint-null source from the fixed-prefix
construction.  Its one-tail complete sampled physical profile and the
correlation used by the already-combined explicit kernel are

\[
 B_\lambda(s)={\sqrt{\lambda e^s}\over2}
       \sum_{m\geq1}H_v(m\lambda e^s),
 \qquad g_\lambda(s)=e^{s/2}B_\lambda(s),        \tag{0.2}
\]

\[
 C_\lambda(y)=(g_\lambda*g_\lambda)(y),
 \qquad s,y\geq0.                               \tag{0.3}
\]

The factor `e^(s/2)` is mandatory.  Equation (4.3) of the frozen physical
outer theorem says that the reflected cross-tail correlation is
`2*epsilon*lambda*C_lambda(y)`.  Thus `C_lambda` is not the raw convolution
`B_lambda*B_lambda`; rather,

\[
 C_\lambda(y)=e^{y/2}(B_\lambda*B_\lambda)(y).  \tag{0.4}
\]

This note proves the following fixed-label complete-profile theorem.
There are absolute `c_0>=1`, `eta in (0,log(2)/4)`, and `K<infinity` such
that, on (0.1) with `c>=c_0`,

\[
\boxed{
 |C_\lambda(y)|\leq K\left\{
 c^{-1/4}{\mathbf1_{|y-\log2|\leq\eta}
       \over(1+c^{1/2}|y-\log2|)^{1/2}}
 +c^{-1/2}(1+y)e^{-y}\right\},\quad y\geq0 .}   \tag{0.5}
\]

The first term is caused by one and only one quartic caustic: the positive
phase, sample pair `(m,l)=(1,1)`, at

\[
 y=\log2,\qquad s={1\over2}\log2,
 \qquad x_1(s)=1.                               \tag{0.6}
\]

At the center of that caustic the exact locked phase gives

\[
\boxed{
 C_\lambda(\log2)
 ={\Gamma(1/4)\cos(\pi/8)\over4\pi}c^{-1/4}
 +o(c^{-1/4})>0.}                               \tag{0.7}
\]

For comparison, the raw one-tail convolution has the constant in (0.7)
divided by `sqrt(2)`.  No reflected-tail factor is used to obtain (0.7):
the missing `sqrt(2)` is exactly the kernel normalization (0.4).

The complete scalar in the combined explicit kernel has the exact prime
quadrature

\[
\boxed{
\begin{split}
 \mathcal M_{v,A}
 ={}&-\int_0^\infty C_\lambda(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
      C_\lambda\!\left(\log{n\over A}\right)
 +R_{v,{\rm ar}}(A),\\
 R_{v,{\rm ar}}(A)
 ={}&A^{-3}\int_0^\infty
 {e^{-3y}C_\lambda(y)\over1-A^{-2}e^{-2y}}\,dy .
\end{split}}                                             \tag{0.8}
\]

The pinned FKS estimate, used together with elementary lattice counting
only in a shrinking neighborhood of `n=2A`, proves

\[
 \boxed{\mathcal M_{v,A}=O(c^{-1/2})=O(\lambda^{-1}).}    \tag{0.9}
\]

Thus the mandatory reflected prefactor `2*lambda` leaves a bounded
complete fixed-`8/12` outer contribution.  Equations (0.7)--(0.9) do
**not** give its sign or limit: (0.8) is a signed prime quadrature error,
and the proof of (0.9) takes absolute values.  This note proves no signed
floor, no growing-rest floor, no residual action estimate, no physical
high-complement comparison, no low/high reduction, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no RH conclusion.  The formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies and exact endpoint-null coefficients

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_BERNOULLI_PRIME_QUADRATURE_BOUND.md` | `ba3aa9777c61883424eed8404f814abf6a9974f2846424e26529661c89ab3a0b` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` | `b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11` |
| `notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md` | `49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

For a pure prolate label `j` write

\[
 e_j=h_{j,\lambda}(\lambda),\qquad
 F_j(t)={\widehat h_{j,\lambda}(t)\over e_j},
 \qquad \Theta_j=\Theta_{j,\lambda}.             \tag{1.1}
\]

Expand the corrected endpoint-null source in labels `0,4,8,12` and put
`q_j` equal to its label-`j` coefficient times `e_j`.  The endpoint is
exactly zero, so

\[
 \boxed{q_0+q_4+q_8+q_{12}=0.}                  \tag{1.2}
\]

The fixed coefficient and endpoint asymptotics give

\[
 q_8=\sqrt{\pi\lambda}\,(1+o(1)),\qquad
 q_{12}=-q_8+O(\lambda^{-7/2}),                 \tag{1.3}
\]

\[
 q_4=O(\lambda^{-7/2}),\qquad q_0=o(q_4).       \tag{1.4}
\]

The full-metric unit renormalization is a scalar `1+o(1)` and preserves
(1.2).  The source-interior invisible correction preserves every endpoint
jet.  After defect whitening its amplitude is exponentially small, and it
will be denoted by `H_b` below.

Using (1.2), the complete additive exterior profile has the exact
divided-difference form

\[
\boxed{
 H_v(t)=q_8(F_8-F_{12})(t)+q_4(F_4-F_{12})(t)
       +q_0(F_0-F_{12})(t)+H_b(t).}              \tag{1.5}
\]

This identity, rather than a separately truncated endpoint series, is the
source of both endpoint and infinity cancellation.

## 2. Exact divided-difference equation and far Jost bound

Put

\[
 p(t)=t^2-\lambda^2,\qquad k=2\pi\lambda,
\]

\[
 \mathcal L_jY=(pY')'+(k^2t^2-\Theta_j)Y.       \tag{2.1}
\]

Every `F_j` satisfies `L_j F_j=0` on `t>lambda`.  If

\[
 \Delta_{jr}=\Theta_j-\Theta_r,
 \qquad W_{jr}={F_j-F_r\over\Delta_{jr}},        \tag{2.2}
\]

then direct subtraction gives both exact resolvent identities

\[
 \boxed{\mathcal L_rW_{jr}=F_j,
        \qquad \mathcal L_jW_{jr}=F_r.}          \tag{2.3}
\]

There is no endpoint coefficient in (2.3): normalization by `e_j` makes
the outgoing Jost amplitudes common, so their order-`t^(-1)` terms cancel
in `F_j-F_r`.

For fixed labels divisible by four and all sufficiently large locked
`lambda`, the exterior monotone amplitude gives

\[
 |\sqrt{p(t)}F_j(t)|\leq{1\over\pi},\qquad t\geq2\lambda. \tag{2.4}
\]

After the Liouville substitution `Z=sqrt(p) W`, the outgoing Green kernel
on this range has modulus at most `2/k`.  Moreover,

\[
 {1\over\sqrt{p(t)}}\leq{2\over\sqrt3t},
 \qquad \int_t^\infty{ds\over p(s)}\leq{4\over3t}.       \tag{2.5}
\]

Applying the Green kernel to (2.3), then (2.4)--(2.5), proves the explicit
complete Jost estimate

\[
\boxed{
 |F_j(t)-F_r(t)|
 \leq {16\over3\pi\sqrt3}
       {|\Delta_{jr}|\over k t^2},
 \qquad t\geq2\lambda.}                         \tag{2.6}
\]

For clarity, the four factors in the constant are respectively the Green
bound `2/k`, the source bound `1/(pi*p)`, the integral `4/(3t)`, and
`1/sqrt(p)<=2/(sqrt(3)t)`.

The fixed eigenvalue expansion

\[
 \Theta_j=(2j+1)c+O_j(1)                         \tag{2.7}
\]

and (1.3)--(1.5), together with the rapid bump transform, now give

\[
 \boxed{|H_v(t)|\leq K_0\lambda^{3/2}t^{-2},
        \qquad t\geq2\lambda.}                  \tag{2.8}
\]

Consequently every sample with `m>=2`, and the `m=1` sample after
`s>=log(2)`, obeys

\[
 |g_{\lambda,m}(s)|\leq K_1m^{-2}e^{-s}.         \tag{2.9}
\]

In particular the complete series in (0.2) converges absolutely there,
and its sample envelopes are summable.  The exact additive leakage identity
also retains the pre-sum check

\[
 \|B_v^{(1)}\|_2^2
 ={1\over4}\int_\lambda^\infty|H_v(u)|^2\,du
 ={1\over8}+o(1).                                \tag{2.10}
\]

Thus the single channel has constant physical size; it was not discarded
or replaced by a finite endpoint expansion.

## 3. Radial Jost expansion with a summable error

For `t=lambda*sqrt(1+x^2)` set

\[
 \beta(x)=\arctan(1/x),\qquad
 \nu_j={\Theta_j\over2c}.                        \tag{3.1}
\]

The exact radial equation is

\[
 F_j''+\left({1\over x}+{x\over1+x^2}\right)F_j'
 +\left(c^2-{\Theta_j\over1+x^2}\right)F_j=0.   \tag{3.2}
\]

With

\[
 U_j(x)=\{x\sqrt{1+x^2}\}^{1/2}F_j(x),          \tag{3.3}
\]

equation (3.2) becomes

\[
 U_j''+\left(c^2-{\Theta_j\over1+x^2}+Q(x)\right)U_j=0, \tag{3.4}
\]

\[
 Q(x)={1\over4x^2}-{1+x^2/4\over(1+x^2)^2}.      \tag{3.5}
\]

Define the approximate Jost phase

\[
 \phi_j(x)=cx+\nu_j\beta(x).                    \tag{3.6}
\]

It has `phi_j'=c-nu_j/(1+x^2)`.  Substitution of `sin(phi_j)` into
(3.4) leaves exactly

\[
 \phi_j''\cos\phi_j+
 \left(Q-{\nu_j^2\over(1+x^2)^2}\right)\sin\phi_j.       \tag{3.7}
\]

For fixed `j`, the `L1[x,infinity)` norm of (3.7) is at most `K_j/x`.
The exact outgoing Volterra resolvent for (3.4) costs at most `K_j/c`:
indeed

\[
 {1\over c}\int_x^\infty
 \left|{\Theta_j\over1+z^2}-Q(z)\right|dz=O_j(1)
 \quad(x\geq c^{-1/4}),                          \tag{3.8}
\]

and the usual Volterra iteration is bounded by the exponential of this
fixed quantity.  Matching the common outgoing amplitude at infinity gives

\[
\boxed{
 F_j(\lambda\sqrt{1+x^2})
 ={1\over\pi\lambda}\{x\sqrt{1+x^2}\}^{-1/2}
 \{\sin\phi_j(x)+E_j(x)\},}                     \tag{3.9}
\]

\[
 \boxed{|E_j(x)|\leq{K_j\over cx},
        \qquad x\geq c^{-1/4}.}                 \tag{3.10}
\]

This is a Jost estimate, not a fixed number of endpoint integrations by
parts.  In particular it is uniform to infinity.

For a sample put

\[
 x_m(s)=\sqrt{m^2e^{2s}-1}.                      \tag{3.11}
\]

After multiplication by the exact factor in `g_lambda`, the error in
(3.10) is bounded by

\[
 {K(1+x_m^2)^{1/4}\over c m x_m^{3/2}}.          \tag{3.12}
\]

Since

\[
 ds={x\,dx\over1+x^2},                           \tag{3.13}
\]

(3.12) has `L1(ds)` norm `O(c^(-1))` for `m=1` and
`O(c^(-1)m^(-2))` for `m>=2`.  Therefore

\[
 \sum_{m\geq1}\|g_{\lambda,m}-g_{\lambda,m}^{\rm Jost}\|_1
 =O(c^{-1}).                                     \tag{3.14}
\]

The decay required in (0.5) does not follow from the \(L^1\) statement
(3.14) alone, so we retain the pointwise Jost error.  For \(m=1\) start
the Jost piece at

\[
 s_c={1\over2}\log(1+c^{-1/2}),\qquad
 x_1(s_c)=c^{-1/4},                              \tag{3.15}
\]

and extend that error by zero below \(s_c\).  For
\(c^{-1/4}\leq x_1\leq1\), (3.12) is at most \(Kc^{-5/8}\).
For \(x_m\geq1\), the identity
\(1+x_m^2=m^2e^{2s}\) turns (3.12) into
\(Kc^{-1}m^{-2}e^{-s}\).  Thus, after increasing \(K\),

\[
\boxed{\quad
 \sum_{m\geq1}
 |g_{\lambda,m}(s)-g_{\lambda,m}^{\rm Jost}(s)|
 {\bf1}_{\{x_m(s)\geq c^{-1/4}\}}
 \leq Kc^{-1/2}e^{-s}.\quad}                    \tag{3.16}
\]

The complete leading Jost profile is \(O(e^{-s})\), by the
\(m^{-2}e^{-s}\) amplitude bound and summation in \(m\).  Consequently
the two cross convolutions and the error self-convolution are bounded
pointwise by

\[
 Kc^{-1/2}(1+y)e^{-y}.                           \tag{3.17}
\]

The compact hard-edge piece omitted in (3.16) is handled next; its
\(L^1\) mass gives the same, or a smaller, decaying convolution bound.

## 4. Hard edge and the complete leading profile

The radial Jost expansion is not used at `x=0`.  Put `z=cx`.  On
`0<=x<=c^(-1/4)`, equation (3.2) is exactly

\[
 {d^2F_j\over dz^2}
 +\left({1\over z}+{z\over c^2+z^2}\right){dF_j\over dz}
 +\left(1-{\Theta_j\over c^2+z^2}\right)F_j=0.  \tag{4.1}
\]

Its unperturbed regular solution is
`J_0(sqrt(1-Theta_j/c^2)*z)`.  On the displayed range, the integrated
first-derivative perturbation is `O(c^(-1/2))` and the integrated phase
perturbation is `O(c^(-3/4))`.  Bessel variation of parameters, together
with

\[
 |J_1(w)|\leq K\min\{w,w^{-1/2}\},              \tag{4.2}
\]

therefore gives, for fixed `j,r`,

\[
\boxed{
 |F_j-F_r|\leq K_{jr}\min\{cx^2,c^{-1/2}x^{1/2}\}
       +O(e^{-\kappa c}),
 \quad 0\leq x\leq c^{-1/4}.}                  \tag{4.3}
\]

The exponentially small term is the difference of the finite-Fourier
endpoint eigenvalues.  Notice that the two bounds in the minimum meet at
`x=c^(-1)`.

After (1.3) and the normalization in (0.2), equation (4.3) yields

\[
 |g_{\lambda,1}(s)|\leq K\sqrt{x_1(s)}
       +O(e^{-\kappa'c})
 \quad(x_1(s)\leq c^{-1/4}).                    \tag{4.4}
\]

Here \(\kappa'>0\); the polynomial normalization multiplying the last
term of (4.3) has been absorbed by decreasing \(\kappa\).
In particular, \(g_{\lambda,1}(0)\) is exponentially small, not
identically zero.  Its omitted hard-edge `L1` mass is at most

\[
 K\int_0^{c^{-1/4}}x^{1/2}{x\,dx\over1+x^2}
       +O(e^{-\kappa'c})
 =O(c^{-5/8})+O(e^{-\kappa'c}).                  \tag{4.5}
\]

Since this piece is supported on \(0\leq s\leq s_c\), convolution with
the \(O(e^{-s})\) complete leading profile, as well as its
self-convolution, is

\[
 O(c^{-5/8}e^{-y})+O(e^{-\kappa'c}e^{-y})
 =O(c^{-1/2}e^{-y}).                             \tag{4.5a}
\]

Together with (3.17), this proves the decaying error term in (0.5).
It also verifies the singular edge without extending (3.9) through it.

On the Jost range, use (1.5) and first retain the dominant `8/12` pair.
The eigenvalue expansion gives

\[
 \nu_8={17\over2}+O(c^{-1}),\qquad
 \nu_{12}={25\over2}+O(c^{-1}),
 \qquad \bar\nu={\nu_8+\nu_{12}\over2}
 ={21\over2}+O(c^{-1}).                         \tag{4.6}
\]

The identity

\[
 \sin\phi_8-\sin\phi_{12}
 =2\cos\!\left(cx+\bar\nu\beta\right)
   \sin\!\left({\nu_8-\nu_{12}\over2}\beta\right)     \tag{4.7}
\]

and `sin(2*beta)=2x/(1+x^2)` give

\[
 g_{\lambda,m}^{(8,12)}(s)
 =-a_m(s)\cos\Phi_m(s)+r_m(s),                 \tag{4.8}
\]

\[
 \Phi_m(s)=cx_m(s)+\bar\nu\beta(x_m(s)),        \tag{4.9}
\]

Here the exact leading amplitude is

\[
 a_m(s)=-{\sqrt\lambda q_8\over\pi\lambda}e^s
 \{x_m(s)\sqrt{1+x_m(s)^2}\}^{-1/2}
 \sin\!\left({\nu_8-\nu_{12}\over2}\beta(x_m(s))\right).
                                                               \tag{4.10}
\]

Uniformly on fixed compact radial intervals it has the asymptotic

\[
 a_m(s)={2\sqrt{x_m(s)}\over
  \sqrt\pi\,m(1+x_m(s)^2)^{3/4}}\{1+o(1)\}.   \tag{4.11}
\]

The `o(1)` in (4.11) is bounded uniformly and tends to zero for every
fixed compact radial interval.  The exact amplitude and its total
variation satisfy the summable bounds

\[
 |a_m(s)|\leq Km^{-2}e^{-s},\qquad
 \|a_m\|_\infty+\operatorname {Var}(a_m)\leq Km^{-2}.     \tag{4.12}
\]

The `q_4` and `q_0` divided differences have the same endpoint and infinity
zeros.  By (1.4) they are `O(c^(-2))` relative to (4.8).  Equations
(2.9), (3.14), (4.5), and (4.12) now prove the useful complete bounds

\[
 \boxed{\|g_\lambda\|_1+\|g_\lambda\|_\infty\leq K,
        \qquad |g_\lambda(s)|\leq Ke^{-s}.}      \tag{4.13}
\]

They also justify every interchange of the sample sums with the
correlation integral below.

## 5. Stationary classification and the unique quartic caustic

Differentiate the leading radial geometry:

\[
 {dx_m\over ds}=x_m+{1\over x_m},\qquad
 {d\beta(x_m)\over ds}=-{1\over x_m}.            \tag{5.1}
\]

Thus

\[
 \Phi_m'(s)=cx_m+{c-\bar\nu\over x_m}.           \tag{5.2}
\]

In a product of two cosines, the difference phase has derivative equal to
the sum of two positive quantities in (5.2).  The first-derivative test and
(4.12) bound all such integrals by a summable `O(c^(-1))`.

For the sum phase, first discard the bounded `bar(nu)` perturbation.  Put

\[
 f(x)=x+x^{-1},\qquad h(x)=x-x^{-3}.             \tag{5.3}
\]

A stationary point satisfies `f(x_1)=f(x_2)`, hence

\[
 x_1=x_2\quad\hbox{or}\quad x_1x_2=1.           \tag{5.4}
\]

The normalized second derivative there is `h(x_1)+h(x_2)`.  On the first
branch it vanishes only at `x_1=x_2=1`.  On the second branch,

\[
 h(x)+h(x^{-1})=(x+x^{-1})\{4-(x+x^{-1})^2\},   \tag{5.5}
\]

which again vanishes only at `x=1`.  Since `m e^s=sqrt(1+x_m^2)`, the
nonnegative sample domain permits `x_m=1` only for `m=1`.  Therefore the
only degenerate sample point is precisely (0.6).  If one of `m,l` is at
least two, its radial coordinate is at least `sqrt(3)`, giving a uniform
curvature separation.  The `bar(nu)` term in (5.2) shifts the unique
degenerate point by only `O(c^(-1))`.

Away from a fixed neighborhood of (0.6), the first- and second-derivative
tests, a bounded finite partition at the ordinary stationary points, and
(4.12) give

\[
 Kc^{-1/2}m^{-2}l^{-2}(1+y)e^{-y}.              \tag{5.6}
\]

The double sum of (5.6) converges.

It remains to make the degeneracy uniform in `y`.  Set

\[
 s_0={1\over2}\log2,\qquad s=s_0+z.
\]

Direct Taylor expansion gives

\[
 x_1(s_0+z)+x_1(s_0-z)=2-4z^4+O(z^6).           \tag{5.7}
\]

For `y-log(2)=delta`, center instead at `s=y/2+z`.  The more precise
unfolding is

\[
 x_1(y/2+z)+x_1(y/2-z)
 =X_0(\delta)+4\delta z^2-4z^4
 +O(\delta^2z^2+|\delta|z^4+z^6).               \tag{5.8}
\]

In particular the `delta*z^2` coefficient is nonzero.  Split first at

\[
 |z|\leq c^{-1/4},\qquad
 |z|\asymp2^jc^{-1/4},                           \tag{5.9}
\]

and, when `delta` dominates, at `|z|` comparable to `sqrt(|delta|)`.
The core costs `O(c^(-1/4))`.  On every remaining shell the second
derivative test costs `O(c^(-1/2)(|delta|+z^2)^(-1/2))`; summing the
geometric shells proves

\[
 \boxed{|I_{11,+}(y)|\leq
 Kc^{-1/4}(1+c^{1/2}|y-\log2|)^{-1/2}.}          \tag{5.10}
\]

The `O(c^(-1))` shift of the exact caustic is smaller than the
`c^(-1/2)` unfolding scale and is absorbed by (5.10).  Combining
(3.17), (4.5a), (5.6), and (5.10) proves (0.5).

## 6. The positive locked caustic constant

At (0.6), equation (4.11) gives

\[
 a_1(s_0)={2^{1/4}\over\sqrt\pi}+o(1),\qquad
 {a_1(s_0)^2\over2}={1\over\sqrt2\pi}+o(1).     \tag{6.1}
\]

The factor one half is the sum-phase coefficient in `cos(alpha)cos(beta)`.
Because `p` is odd, `p^2=1 mod 8`, and

\[
 2c+{21\over2}{\pi\over2}
 =\pi p^2+{21\pi\over4}
 ={\pi\over4}\pmod {2\pi}.                     \tag{6.2}
\]

Equation (5.7) supplies the oscillatory quartic `-4cz^4`.  Its exact
full-line integral is

\[
 \int_{\mathbb R}e^{-i4cz^4}\,dz
 ={\Gamma(1/4)\over2\sqrt2}
   c^{-1/4}e^{-i\pi/8}.                          \tag{6.3}
\]

Multiplying (6.1)--(6.3) gives

\[
 {1\over\sqrt2\pi}
 {\Gamma(1/4)\over2\sqrt2}
 \cos\!\left({\pi\over4}-{\pi\over8}\right)
 ={\Gamma(1/4)\cos(\pi/8)\over4\pi}.           \tag{6.4}
\]

which proves (0.7).  All other phase/sample pairs are `O(c^(-1/2))` by
Section 5; the hard-edge and Jost errors are smaller.  Equation (0.4)
shows explicitly that the corresponding raw `B*B` constant is (6.4)
divided by `sqrt(2)`.

## 7. Local absolute continuity and exact Stieltjes quadrature

The regularity needed for the prime integration is exact and does not come
from differentiating a conditionally convergent sample series.  Let
`f_v` denote the corrected endpoint-null source.  The radical-domain
correction gives

\[
 \int_{\mathbb R}f_v=0,\qquad f_v(0)=0,\qquad
 f_v(\lambda)=f_v(-\lambda)=0.                  \tag{7.1}
\]

Poisson summation at `u=lambda*e^s` therefore gives

\[
 \sum_{m\geq1}\widehat f_v(mu)
 ={1\over2u}\sum_{n\in\mathbb Z}f_v(n/u).       \tag{7.2}
\]

On every compact `u` interval the sum on the right is finite.  When a new
lattice point enters at `n/u=+/-lambda`, its value is zero by (7.1).
Hence the right side is continuous and piecewise `C1`, with locally
integrable derivative.  Thus `g_lambda` and `C_lambda` are locally
absolutely continuous.  Also

\[
 C_\lambda(0)=0,\qquad C_\lambda(y)\longrightarrow0,     \tag{7.3}
\]

the second assertion following from (4.13).

Retain the already-combined kernel

\[
 \delta_*(x)=1-e^{-x}\psi_C(e^x)
 -{1\over2}e^{-x}\log(1-e^{-2x}).               \tag{7.4}
\]

Define

\[
 \mathcal M_{v,A}=\int_0^\infty
 \delta_*(L+y)\{C_\lambda'(y)-C_\lambda(y)\}\,dy.        \tag{7.5}
\]

The envelope (0.5) justifies the infinite limit.  Put
`F(y)=e^(-y)C_lambda(y)`.  The continuous part of (7.4) gives
`-integral C_lambda`.  Stieltjes integration of the Chebyshev term gives

\[
 {1\over A}\int_0^\infty F(y)\,d\psi_C(Ae^y)
 =\sum_{n>A}{\Lambda(n)\over n}
    C_\lambda\!\left(\log{n\over A}\right).     \tag{7.6}
\]

There is no boundary term: (7.3), `psi_C(x)=O(x)`, and (0.5) handle both
ends.  A final ordinary integration by parts in the logarithmic term of
(7.4) gives exactly `R_(v,ar)` in (0.8).  This proves the quadrature
identity with the right-continuous Chebyshev convention.

## 8. The caustic prime lattice and the `lambda^(-1)` bound

Integrating (0.5) over the fixed caustic neighborhood gives

\[
 c^{-1/4}\int_0^\eta(1+c^{1/2}r)^{-1/2}\,dr
 =O(c^{-1/2}).                                   \tag{8.1}
\]

The decaying term in (0.5) has the same bound.  Therefore the continuous
term in (0.8) is `O(c^(-1/2))`, and the archimedean remainder is smaller.

It remains to keep the prime atoms from losing the caustic width.  Outside
the fixed neighborhood of `n=2A`, the all-range bound
`psi_C(X)<=C_psi*X` and unit logarithmic blocks applied to the second term
of (0.5) give `O(c^(-1/2))`.

Inside that neighborhood set

\[
 r=\left|\log{n\over A}-\log2\right|,
 \qquad r_0=c^{-1/2},                            \tag{8.2}
\]

and use dyadic shells `r about 2^j*r_0`.  The core has at most
`O(A*r_0+1)` integer lattice points.  Since `Lambda(n)<=log(n)`, its total
`Lambda(n)/n` mass is

\[
 O(c^{-1/2}\log c),                              \tag{8.3}
\]

and its contribution is

\[
 O(c^{-3/4}\log c)=O(c^{-1/2}).                 \tag{8.4}
\]

For the shells define the pinned relative FKS error scale

\[
 \epsilon_c=K_{\rm FKS}(\log c)^{3/2}
                   e^{-\alpha\sqrt{\log c}},
 \qquad \alpha=0.8476836.                       \tag{8.5}
\]

Uniformly on the fixed neighborhood, differencing the FKS estimate shows
that a shell of width `r>=epsilon_c` has
`Lambda(n)/n` mass `O(r)`.  Its correlation height is
`O(c^(-1/2)r^(-1/2))`; summing these shells costs `O(c^(-1/2))`.

For `r<epsilon_c`, elementary lattice counting gives mass `O(r*log(c))`.
The geometric shell sum is bounded by

\[
 O\!\left(c^{-1/2}\epsilon_c^{1/2}\log c\right)
 =O(c^{-1/2}),                                   \tag{8.6}
\]

because `epsilon_c^(1/2)*log(c)` tends to zero.  Equations
(8.3)--(8.6) use no short-interval prime-number theorem.  They use the
FKS estimate only after the interval is at least its admitted relative
error scale, and use the actual integer lattice below that scale.

All three terms in (0.8) are now `O(c^(-1/2))`.  Since
`c=2*pi*lambda^2`, equation (0.9) follows.

## 9. Origin bump, compact projection, and exact frontier

The invisible origin bump in (7.1) is supported strictly inside the source
interval and changes no endpoint jet.  Its coefficient after whitening is
exponentially small; its Fourier transform is Schwartz at the sampling
scale.  Its self- and cross-correlations are therefore absorbed by the
`O(c^(-1))` error in Section 3.

The compact `P_N` projection remainder is a central logarithmic component,
not part of the physical outer profile (0.2).  The frozen fixed-prefix
projection theorem already makes its normalized norm exponentially `o(1)`
on the locked schedule.  It neither creates another radial sample pair nor
changes the caustic constant.

The complete fixed-`8/12` Volterra correlation and its scalar quadrature
are now bounded at their required own-defect scale.  This is a magnitude
theorem only.  The positive local coefficient in (0.7) does not determine
the sign of the signed quadrature (0.8), whose continuous and prime pieces
occur with opposite orientations.  No sign, limit, floor, action transfer,
growing-depth theorem, equation (5.2), or RH conclusion follows.
