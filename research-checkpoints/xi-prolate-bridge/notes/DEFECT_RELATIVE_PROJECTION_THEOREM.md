# Defect-relative Fourier projection on an exponential diagonal

## 1. Scope

This note proves an ordinary and a logarithmically weighted Fourier-tail
bound for the source-normalized prolate labels `0` and `4`.  On the exact
diagonal

\[
 \lambda_j=j+\frac12,\qquad
 N_j=2^{2400(2j+1)^2},\qquad j\in\mathbb Z,\ j\geq2,             \tag{1.1}
\]

both tails are little-oh of the square root of the corresponding prolate
concentration defect.  The same conclusion transfers, with an explicit
polynomial coefficient, to the source `0/4` combination.

This is a relative **projection** theorem only.  It does not prove that the
complete signed Weil distribution is continuous in the weighted norm below,
does not bound an `O-P` or `P-P` pairing, does not prove a high-mode sector
floor, and does not establish locally uniform determinant convergence.  The
project status remains `P0_INVALIDATED`.

## 2. Exact source pin and conventions

The external input is Egidi--Seelmann, *An abstract Logvinenko--Sereda type
theorem for spectral subspaces*, arXiv:2010.11901v2, Theorem 1.2.  The exact
arXiv v2 source is vendored as
`vendor/EGIDI-SEELMANN-LS-2010.11901v2.tex.gz`.  Its hashes are

\[
\begin{array}{ll}
 \text{compressed SHA-256}
  &\mathtt{8cad2763fb84f09e44c7309ebecffa295e8b193ba9e506749451b305b50adf5c},\\
 \text{uncompressed TeX SHA-256}
  &\mathtt{b459dd2a485b061edb1dc94e5313830acf6e12b2af07098e3f8642993e676907}.
\end{array}
\]

All substitutions into that theorem are serialized in
`DEFECT_RELATIVE_PROJECTION_SOURCE_LOCK.json`.  The producer and verifier
hash both the compressed and uncompressed bytes.

Keep the project additive Fourier transform

\[
 \mathcal F_+f(\xi)=\int_{\mathbb R}f(x)e^{+2\pi ix\xi}\,dx.    \tag{2.1}
\]

Let `h_(n,lambda)`, `n=0,4`, be real, even, unit normalized in Lebesgue
measure on `[-lambda,lambda]`, and zero outside that interval.  Put

\[
 H_n=\mathcal F_+h_{n,\lambda},\qquad
 c=2\pi\lambda^2,\qquad
 d_n=1-\chi_n^2.                                      \tag{2.2}
\]

The locked finite-Fourier relation has positive sign for both labels:

\[
 1_{[-\lambda,\lambda]}H_n=\chi_n h_{n,\lambda}.      \tag{2.3}
\]

For `u>0`, use

\[
 E(h)(u)=u^{1/2}\sum_{m\geq1}h(mu),                   \tag{2.4}
\]

and on `I_lambda=[-ell,ell]`, `ell=log(lambda)`, set

\[
 g_n(t)=E(h_{n,\lambda})(e^t),\qquad
 K_n(t)=\frac{g_n(t)+g_n(-t)}2.                       \tag{2.5}
\]

No inversion symmetry of `g_n` is assumed.  Formula (2.5) is the required
inversion evenization.  Its endpoint traces agree, so `K_n` is a periodic BV
function on the circle of length

\[
 L=2\log\lambda.                                      \tag{2.6}
\]

The locked orthonormal modes are
`L^(-1/2) exp(+2*pi*i*r*(t+ell)/L)`, `r in Z`; `P_N` keeps `|r|<=N`.

## 3. Periodic BV projection, including a logarithmic weight

Let `F` be periodic BV on a circle of length `L`, let `V` be its circular
total variation, and let `c_r` be its coefficients in the preceding
orthonormal basis.  Stieltjes integration by parts has no boundary term and
gives, for `r!=0`,

\[
 |c_r|\leq\frac{\sqrt L}{2\pi|r|}V.                  \tag{3.1}
\]

Since `sum_(r>N) r^(-2)<=1/N`, for every integer `N>=1`,

\[
 \boxed{
 \|(I-P_N)F\|_2\leq\frac{\sqrt L}{\pi\sqrt{2N}}V.}  \tag{3.2}
\]

There is also a useful weighted consequence.  For `r>=1`,
`log(2+r)<=log(3r)`, and `log(3x)/x^2` is decreasing on `[1,infinity)`.
Therefore

\[
 \sum_{r=N+1}^{\infty}\frac{\log(2+r)}{r^2}
 \leq\int_N^\infty\frac{\log(3x)}{x^2}\,dx
 =\frac{\log(3N)+1}{N}.
\]

Using both signs in (3.1),

\[
 \boxed{
 \sum_{|r|>N}\log(2+|r|)|c_r|^2
 \leq\frac{LV^2}{2\pi^2N}\bigl(\log(3N)+1\bigr).}   \tag{3.3}
\]

The normalization in (3.2)--(3.3) is exactly the locked length-`L`
orthonormal normalization; no unit-length Fourier convention is mixed in.

## 4. Circular variation of the arithmetic prolate state

Write

\[
 D=\frac12+x\frac d{dx}.                            \tag{4.1}
\]

On every smooth piece of the finite arithmetic sum,

\[
 g_n'(t)=e^{t/2}\sum_{m\leq\lambda e^{-t}}
                   (Dh_{n,\lambda})(me^t).          \tag{4.2}
\]

The sum changes at every threshold

\[
 t_m=\log(\lambda/m),\qquad 1\leq m\leq\lambda^2.   \tag{4.3}
\]

Thus (4.2) alone is not the BV derivative: the hard zero extension produces
a jump of magnitude

\[
 \sqrt{\lambda/m}\,|h_{n,\lambda}(\lambda)|         \tag{4.4}
\]

at each interior threshold.  If `lambda^2` is an integer, the threshold at
the endpoint is included harmlessly by one-sided traces; changing an isolated
endpoint value does not change Fourier coefficients.  Hence **all** arithmetic
jumps satisfy

\[
 V_{\rm jump}(g_n)
 \leq\sqrt\lambda|h_{n,\lambda}(\lambda)|
       \sum_{m\leq\lambda^2}m^{-1/2}
 \leq2\lambda^{3/2}|h_{n,\lambda}(\lambda)|.         \tag{4.5}
\]

For the absolutely continuous pieces, substitute `x=me^t` and interchange
the nonnegative finite sum and integral:

\[
\begin{aligned}
 V_{\rm ac}(g_n)
 &\leq\sum_{m\leq\lambda^2}m^{-1/2}
      \int_{m/\lambda}^{\lambda}|Dh_{n,\lambda}(x)|x^{-1/2}\,dx\\
 &=\int_{1/\lambda}^{\lambda}|Dh_{n,\lambda}(x)|x^{-1/2}
        \sum_{m\leq\lambda x}m^{-1/2}\,dx\\
 &\leq2\sqrt\lambda\int_{1/\lambda}^{\lambda}
                    |Dh_{n,\lambda}(x)|\,dx\\
 &\leq2\lambda\|Dh_{n,\lambda}\|_{L^2(-\lambda,\lambda)}.
                                                               \tag{4.6}
\end{aligned}
\]

The last line is deliberately a slightly loose full-interval bound.  It is
uniform and avoids inserting parity into the estimate.

### The interior dilation-generator bound

Differentiate the *full* Fourier transform in (2.1):

\[
 H_n'(\xi)=2\pi i\,\mathcal F_+(xh_{n,\lambda})(\xi),
 \qquad \|H_n'\|_{L^2(\mathbb R)}
       =2\pi\|xh_{n,\lambda}\|_2\leq2\pi\lambda.   \tag{4.7}
\]

On `[-lambda,lambda]`, (2.3) may be differentiated classically, so

\[
 \chi_nDh_{n,\lambda}=DH_n.
\]

Using (4.7) only after restricting the multiplier `|xi|` to this finite
interval gives

\[
\begin{aligned}
 \chi_n\|Dh_{n,\lambda}\|_2
 &=\|DH_n\|_{L^2(-\lambda,\lambda)}\\
 &\leq\frac12\|H_n\|_{L^2(-\lambda,\lambda)}
       +\lambda\|H_n'\|_{L^2(-\lambda,\lambda)}\\
 &\leq\frac12+2\pi\lambda^2.                       \tag{4.8}
\end{aligned}
\]

This is the required finite-Fourier differentiation argument.  It does not
assert a global bound on `xi H_n'`; only the restricted interval is used.

The pinned KRD insertion already proved in
`notes/PROLATE_TAIL_ENVELOPE.md` gives `d_0<=d_4<=1/2` for `lambda>=2`.
Consequently `chi_n>=1/sqrt(2)` and

\[
 \|Dh_{n,\lambda}\|_2
 \leq\sqrt2\left(2\pi\lambda^2+\frac12\right).      \tag{4.9}
\]

The endpoint theorem in the same note gives

\[
 |h_{n,\lambda}(\lambda)|
 \leq16\pi\sqrt{\lambda d_n}.                       \tag{4.10}
\]

Finally, reflection preserves BV variation and averaging is a contraction:

\[
 \operatorname {TV}_{\rm circle}(K_n)
 \leq\operatorname {TV}(g_n).
\]

Equations (4.5)--(4.10), with `2sqrt(2)<=4`, prove the fully explicit bound

\[
 \boxed{
 V_n:=\operatorname {TV}_{\rm circle}(K_n)
 \leq4\lambda\left(2\pi\lambda^2+\frac12\right)
       +32\pi\lambda^2\sqrt{d_n}.}                  \tag{4.11}
\]

This calculation preserves the combined arithmetic state: it never splits a
Weil pole, archimedean, or prime block, because no Weil pairing is used here.

## 5. An explicit lower bound for the prolate defect

Although `H_n` is not compactly supported, its angular-frequency Fourier
transform is supported in `[-2*pi*lambda,2*pi*lambda]`: it is, up to the
unitary normalization and reflection, the zero-extended `h_(n,lambda)`.
Thus `H_n` belongs to the spectral subspace of the pure Laplacian on
`Omega=R` at energy

\[
 \mathcal E=(2\pi\lambda)^2.                         \tag{5.1}
\]

Take

\[
 \omega=\mathbb R\setminus[-\lambda,\lambda],
 \qquad\gamma=\frac12,\qquad\rho=4\lambda.          \tag{5.2}
\]

Every interval of length `4lambda` meets `[-lambda,lambda]` in measure at
most `2lambda`; hence (5.2) is `(gamma,rho)`-thick.  Cover `R`, up to its
endpoints of measure zero, by the disjoint open intervals

\[
 Q_k=(4\lambda k,4\lambda(k+1)),\qquad k\in\mathbb Z.
\]

This is an exact Egidi--Seelmann covering with

\[
 \kappa=1,\qquad l_1=\rho=4\lambda,
 \qquad\eta=1,qquad\tau_1=2.                       \tag{5.3}
\]

For the pure Laplacian their Bernstein sum is

\[
 h(\mathcal E)=\exp(10l_1\sqrt{\mathcal E})
                =\exp(80\pi\lambda^2).              \tag{5.4}
\]

The base and exponent in their Theorem 1.2 therefore become, exactly,

\[
 \frac{24(1)(2)(4\lambda)}{(1/2)(1)(4\lambda)}=96,
 \qquad 5+\frac{320\pi}{\log2}\lambda^2.            \tag{5.5}
\]

Plancherel, (2.3), and unit normalization give

\[
 \|H_n\|_2^2=1,qquad
 \|H_n\|_{L^2(\omega)}^2=1-\chi_n^2=d_n.            \tag{5.6}
\]

Substitution into the pinned theorem yields the all-index, fully explicit
lower bound

\[
 \boxed{
 d_n\geq6\,96^{-5-(320\pi/\log2)\lambda^2}.}        \tag{5.7}
\]

Equivalently, with

\[
 A=\frac{160\pi\log96}{\log2},\qquad
 C_0=\sqrt6\,96^{-5/2},                              \tag{5.8}
\]

one has `sqrt(d_n)>=C_0 exp(-A lambda^2)`.  This very weak bound is used only
to choose a rigorous diagonal; it is not a sharp prolate asymptotic.

## 6. Relative projection on the locked diagonal

Combining (3.2), (4.11), and (5.7) gives

\[
 \frac{\|(I-P_N)K_n\|_2}{\sqrt{d_n}}
 \leq R_{\rm bulk}(\lambda,N)+R_{\rm jump}(\lambda,N), \tag{6.1}
\]

where

\[
\begin{aligned}
 R_{\rm bulk}
 &=\frac{\sqrt{2\log\lambda}}{\pi\sqrt{2N}}
   4\lambda\left(2\pi\lambda^2+\frac12\right)
   \frac{96^{5/2}}{\sqrt6}e^{A\lambda^2},\\
 R_{\rm jump}
 &=\frac{\sqrt{2\log\lambda}}{\pi\sqrt{2N}}
   32\pi\lambda^2.                                  \tag{6.2}
\end{aligned}
\]

More generally, write `N=2^(K(2j+1)^2)=exp(4K log(2) lambda^2)` on the
half-integer diagonal.  The exact exponent margin is

\[
 M_K=2K\log2-\frac{160\pi\log96}{\log2}.             \tag{6.3}
\]

The exact safety condition is

\[
 K>\frac{80\pi\log96}{(\log2)^2}
   =2387.6337258956233799\ldots .                    \tag{6.4}
\]

Thus `2387` is the largest unsafe integer and `2388` is the first integer
with positive asymptotic exponent margin.  The repository deliberately locks
the reserve `K=2400`, for which

\[
 \boxed{
 M_{2400}=4800\log2-\frac{160\pi\log96}{\log2}
 =17.14329605896023403855\ldots>0.}                  \tag{6.5}
\]

In (6.2), the bulk term is now a polynomial times `exp(-M_2400 lambda^2)`;
the jump term has the much stronger exponent `4800 log(2)`.  Consequently

\[
 \boxed{
 \frac{\|(I-P_{N_j})K_n\|_2}{\sqrt{d_n}}\longrightarrow0,
 \qquad n=0,4.}                                      \tag{6.6}
\]

The producer also verifies outwardly that the right side is decreasing for
`lambda>=2` and is below one there.  At the first schedule point
`lambda_2=5/2`, its interval upper endpoint is approximately
`1.311e-40`; this decimal is only a diagnostic display of the serialized
dyadic interval, not a replacement for (6.1).

### Log-weighted tail

The square root of (3.3), divided by `sqrt(d_n)`, is at most the right side
of (6.1) multiplied by

\[
 \sqrt{\log(3N_j)+1}
 =\sqrt{1+\log3+2400(2j+1)^2\log2}=O(\lambda_j).     \tag{6.7}
\]

The positive exponent margin is unchanged.  Therefore

\[
 \boxed{
 \frac1{d_n}\sum_{|r|>N_j}\log(2+|r|)|c_{n,r}|^2
 \longrightarrow0.}                                \tag{6.8}
\]

This answers the narrow weighted-projection question.  Equation (6.8) is not
an `O-P` or `P-P` theorem: such a theorem still needs a source-derived
continuity estimate for the complete signed distribution in this precise
weighted space.

## 7. Transfer to the source `0/4` combination

Keep the source normalization

\[
 a_4=\frac{\sqrt3}{2^{11/4}},\qquad
 a_{0,\lambda}=a_4\frac{\int h_{4,\lambda}}
                            {\int h_{0,\lambda}},
 \qquad h_\lambda=a_4h_{4,\lambda}-a_{0,\lambda}h_{0,\lambda}. \tag{7.1}
\]

The ground mode is positive, so the denominator in (7.1) is nonzero.  The
source-boundary calculation in `notes/PROLATE_TAIL_ENVELOPE.md`, equations
(5.6)--(5.7), proves for every `lambda>=2`

\[
 \left|\frac{a_{0,\lambda}}{a_4}\right|
 \leq2\sqrt2\lambda.                                 \tag{7.2}
\]

Because `d_0<=d_4`, linearity, (6.1), and (7.2) give the explicit combined
bound

\[
 \frac{\|(I-P_N)K_\lambda\|_2}{\sqrt{d_4}}
 \leq a_4(1+2\sqrt2\lambda)
       \bigl(R_{\rm bulk}+R_{\rm jump}\bigr),        \tag{7.3}
\]

where `K_lambda=a4 K_4-a0,lambda K_0`.  The extra factor is only polynomial,
so (7.3) tends to zero on (1.1).  The same coefficient multiplies the square
root of the log-weighted bound.  This is the source scalar, not a unit-norm
replacement; the normalization regression elsewhere in the repository
remains in force.

## 8. Independent replay and successor status

`src/defect_relative_projection.py` produces exact integer inputs, outward
intervals with raw dyadic endpoints, and both source hashes.
`verifier/defect_relative_projection_replay.py` imports no producer code; it
reconstructs the thickness, angular-frequency energy, base `96`, exponent,
schedule, and intervals from `j`.  Both paths currently use `mpmath.iv`, and
the artifacts disclose that shared-arithmetic-library limitation.

The theorem removes the ordinary and log-weighted Fourier projection rate as
an obstruction if one accepts the enormous diagonal (1.1).  It does not by
itself control any signed pairing.  The successor notes
`notes/COMPACT_PROJECTION_WEIL_BOUND.md` and
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` now close P--P and both mixed
orientations on the same schedule.  The mixed result is for the actual
corrected combined `0/4` radical state, not for individual-mode radicals or
generic outer multipliers.  The O--O pairing and uniform shifted-sector
comparison remain open.
