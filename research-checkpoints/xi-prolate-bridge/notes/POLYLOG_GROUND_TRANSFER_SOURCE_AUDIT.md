# Source audit and minimal ground-transfer gate

## 0. Scope and conclusion

This checkpoint-0.59 note independently audits the conditional chain in
`notes/HEIGHT_PROFILE_SOURCE_CANCELLATION_ATTACK.md` against the pinned bytes
of Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1:

```text
vendor/CCM-ZST-2511.22755v1.pdf
sha256 c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b
```

The finite source chain is valid.  Source Theorem 5.10 really gives the
complete real zero multiset of the zero-extended transform of a simple
global inversion-even lowest eigenvector.  It does so through a
self-adjoint finite quotient in the shifted Weil metric and the unchanged
real Fourier lattice outside the finite mode window.  No reality assumption
on zeta zeros, global Weil positivity, or list of zeros occurs in that
argument.

The audit also isolates a strictly weaker conditional transfer theorem.
The two strict sector signs and

```text
||(A-U I)^(-1)b|| = O(L^(-5/2))
```

are a source-reconstructible sufficient package, but they are not the
logical minimum.  If the simple global even ground line is established,
local uniform determinant convergence already follows from

```text
sqrt(L) ||f-p||_2 -> 0.
```

No separate second-moment hypothesis is needed.  Real-axis convergence on a
fixed zero-free interval around the origin, combined with the source's
complete paired real-zero product, bounds the inverse-square zero trace and
hence supplies normality.  In Feshbach form this lowers the sufficient solve
rate to `o(L^(-1/2))`.  The older `O(L^(-5/2))` rate is sharp only for the
linear origin-curvature estimate that bounds the second moment by the full
`L2` norm; it is not sharp for the determinant topology once source
real-rootedness is used.

There is an even weaker projective form.  For a Fourier cutoff `M` it is
enough that the low correction obey
`sqrt(L)||P_M(f-p)|| -> 0` and the complete correction obey
`sqrt(L/M)||f-p|| -> 0`.  With `M` of order `lambda`, the complete shifted
solve may grow below the scale `sqrt(lambda/L)`; only its low observable must
be `o(L^(-1/2))`.

No current source estimate proves the simple-even property and this weaker
correction condition on one unbounded schedule.  This note proves
no unconditional determinant limit, equation (5.2), or Riemann-hypothesis
statement.  The formal state remains `P0_INVALIDATED`.

## 1. Pinned finite source chain

Fix `lambda>1`, put `L=2 log(lambda)`, and use the source modes

\[
 V_n(u)=L^{-1/2}\exp(2\pi i n\log(\lambda u)/L),
 \qquad |n|\leq N,
\]

in `L2([lambda^(-1),lambda],du/u)`.  Let `M V_n=nV_n` and
`J V_n=V_(-n)`.

Source Lemma 5.1, equation (5.2), gives the exact real Cauchy form

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad
 a_{-n}=a_n,\quad b_{-n}=-b_n.                    \tag{1.1}
\]

The entries are those of the complete pole--archimedean--minus-prime Weil
form.  Equation (1.1) implies both `JQ=QJ` and source Lemma 5.2(ii),

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,
 \qquad
 \eta=\sum_{|n|\leq N}V_n,
 \quad
 \beta=\sum_{|n|\leq N}b_nV_n.                   \tag{1.2}
\]

Let `mu` be the actual global lowest eigenvalue.  Suppose it is simple and
has an inversion-even eigenvector `xi`.  Then

\[
 T=Q-\mu I\geq0,
 \qquad \ker T=\mathbb C\xi,
 \qquad J\xi=\xi.                                 \tag{1.3}
\]

The paragraph after source Definition 5.3 applies (1.2) to (1.3).  If
`M xi=0`, then `xi` is a multiple of `V_0` and pairs nontrivially with
`eta`.  Otherwise `M xi` is odd and cannot lie in the even one-dimensional
kernel, so

\[
 0\ne-TM\xi=[M,T]\xi
 =\beta\langle\eta,\xi\rangle.
\]

In either case

\[
 \langle\eta,\xi\rangle\ne0,
 \qquad
 \delta_N(\xi)\ne0,
 \qquad
 \delta_N=L^{-1/2}\eta.                           \tag{1.4}
\]

This is qualitative nonvanishing; it is not a uniform boundary reserve.

Source Lemma 5.4 puts the positive definite quotient metric induced by `T`
on

\[
 E'_N=E_N/\mathbb C\xi.                            \tag{1.5}
\]

After normalizing `<eta,xi>=1`, the rank-one perturbation

\[
 M'=M-|M\xi\rangle\langle\eta|                   \tag{1.6}
\]

kills the radical and descends to a self-adjoint finite operator on (1.5).
This is self-adjointness in the shifted quotient metric, not in the original
`L2` metric.

With the source Mellin convention

\[
 \widehat\xi(z)=\int_0^\infty\xi(u)u^{-iz}{du\over u},             \tag{1.7}
\]

zero extension outside `[lambda^(-1),lambda]`, and boundary normalization
`delta_N(xi)=1`, source Proposition 5.9 and Theorem 5.10 give

\[
 \det_{\rm reg}(D_{\log}^{(\lambda,N)}-z)
 =-i\lambda^{-iz}\widehat\xi(z).                  \tag{1.8}
\]

The phase in (1.8) is nowhere zero.  More importantly, the determinant
factors into

1. the characteristic polynomial of the self-adjoint quotient operator on
   `E'_N`; and
2. the regularized determinant of the unperturbed scaling operator on
   `E_N^perp`, whose zeros are exactly
   `2*pi*n/L`, `|n|>N`.

Therefore `widehat(xi)` is entire and every one of its zeros is real, with
multiplicity.  Arbitrary nonzero rescaling of `xi` preserves this conclusion.
The complete Fourier lattice cannot be omitted from its paired product.

## 2. Source errata do not invalidate the finite chain

The two locked errata have different effects.

1. The printed archimedean formula (4.14) differs from the defining formula
   by a scalar identity.  The corrected exact matrix must be used, but
   subtracting its own lowest eigenvalue leaves `T`, the ground line,
   commutator (1.2), quotient operator, and determinant zeros unchanged.
2. The printed Section 7 formulas give `widehat(E(h))=Xi/4`, not `Xi`.
   The bridge must therefore retain the source state and multiply the final
   characteristic function by four.  This nonzero scalar changes no zero.

The logarithmic interval, measure, Fourier sign, and reflection are also
consistent.  Writing `x=log u` gives `x in [-L/2,L/2]`; inversion is
`x -> -x`, and an inversion-even source ground has an even transform.  No
finite-lambda inversion symmetry is assumed for the arithmetic prolate
state before the explicit evenization `k_lambda^+=(k_lambda+Jk_lambda)/2`.

## 3. What the sector signs actually do

For a unit even anchor `kappa`, write

\[
 Q_+=\begin{bmatrix}q&b^*\\b&A\end{bmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\kappa^\perp.              \tag{3.1}
\]

If `U` is a variational upper bound for the lowest even eigenvalue and

\[
 A-U I>0,
 \qquad Q_--U I>0,                                \tag{3.2}
\]

then interlacing gives one simple even eigenvalue below the even complement,
and the odd sign puts every odd eigenvalue strictly above it.  Hence (3.2)
is a convenient certified route to the simple global even hypothesis of
Section 1.

The finite source theorem itself does not mention `U` or (3.2).  They may be
replaced by any direct proof that the global lowest line is simple and even.
Likewise, once the coefficient-normalized ground correction is controlled
directly, the determinant argument does not require an upper-shift
resolvent.  This does not make (3.2) dispensable in the current program: no
alternative unbounded-schedule proof of the simple-even source ground is
known.

## 4. A real-axis ratio supplies normality

Use centered logarithmic coordinates and write

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(x)e^{-izx}\,dx.                  \tag{4.1}
\]

Consider a sequence `lambda_j -> infinity`, with `L_j=2 log(lambda_j)`.
Let `p_j` be real even comparison states and let `f_j` be real nonzero
representatives of simple global inversion-even source ground lines.  Assume

\[
 4\widehat p_j(t)\longrightarrow\Xi(t)             \tag{4.2}
\]

locally uniformly for real `t`.  Put `d_j=f_j-p_j`.

### Lemma 4.1 (zero-free-interval endpoint ratio)

Let `F` be a nonzero even entire function of order at most one whose zeros
are all real, paired with multiplicity as `+/-rho`.  Suppose `F` has no zero
on `[-t_0,t_0]`, where `t_0>0`, and choose its real scalar so that
`F(0)>0`.  If `F` is positive on that interval, then

\[
 {F(t_0)\over F(0)}
 =\prod_{\rho\in R}\left(1-{t_0^2\over\rho^2}\right)\in(0,1],   \tag{4.3}
\]

and

\[
 \boxed{
 t_0^2\sum_{\rho\in R}{1\over\rho^2}
 \leq-\log{F(t_0)\over F(0)}.}                    \tag{4.4}
\]

**Proof.**  Hadamard factorization for an order-at-most-one entire function
pairs the genus-one factors at `rho` and `-rho`:

\[
 E_1(z/\rho)E_1(-z/\rho)=1-z^2/\rho^2.
\]

The remaining zero-free factor is `exp(a z+b)`.  Both `F` and the paired
product are even, so `a=0`; normalization at zero removes `exp(b)`.  Since
there is no zero in the interval, every factor in (4.3) belongs to `(0,1)`.
Finally `-log(1-x)>=x` for `0<=x<1`, and summation gives (4.4).
\(\square\)

The zero-free-interval hypothesis is essential.  Two endpoint values alone,
even when their ratio is positive, do not exclude an even number of real
zeros inside the interval; then some factors in (4.3) are negative and the
logarithmic inequality is unavailable.  In Theorem 4.2 the interval is
proved zero-free by uniform real-axis convergence to the positive target,
not inferred from the endpoints.

For a source ground transform, `R` in Lemma 4.1 is the **complete**
half-paired multiset: it contains both the finite quotient eigenvalues and
the exterior lattice `2*pi*n/L`, `|n|>N`.  The exterior part alone gives

\[
 \sum_{n>N}{1\over(2\pi n/L)^2}
 ={L^2\over4\pi^2}\sum_{n>N}{1\over n^2}
 \geq {L^2\over4\pi^2(N+1)}.                      \tag{4.5}
\]

Thus a bounded ratio in (4.4) automatically forces `N=Omega(L^2)`; omitting
the exterior lattice would erase this necessary consequence.
`N/L^2 -> infinity` is sufficient for the lattice trace to vanish but is not
logically necessary for the ratio gate.  The scale `N` comparable to `L^2`
is the sharp order for keeping the exterior contribution bounded; this
observation does not prove the arithmetic ground transfer at that scale.

### Theorem 4.2 (real-axis ground transfer)

If

\[
 4\widehat f_j(t)\longrightarrow\Xi(t)             \tag{4.6}
\]

locally uniformly for real `t`, then, for every fixed `0<b<1/2`,

\[
 \boxed{
 \Xi(ib){\widehat f_j(z)\over\widehat f_j(ib)}
 \longrightarrow\Xi(z)}                            \tag{4.7}
\]

locally uniformly on the whole complex plane.

**Proof.**  In particular,

\[
 \widehat f_j(0)\longrightarrow\Xi(0)/4\ne0.       \tag{4.8}
\]

Since `Xi(0)>0`, continuity supplies a fixed `t_0>0` on which `Xi(t)>0`.
Uniform real-axis convergence makes `widehat(f_j)` positive and zero-free on
`[-t_0,t_0]` for all large `j`.  Moreover,

\[
 {\widehat f_j(t_0)\over\widehat f_j(0)}
 \longrightarrow{\Xi(t_0)\over\Xi(0)}>0.           \tag{4.9}
\]

Apply Lemma 4.1 to the all-real complete source divisor.  Equation (4.9)
gives

\[
 Z_j^{(0)}:=\sum_{\rho\in R_j}{1\over\rho^2}
 \leq-{1\over t_0^2}
       \log{\widehat f_j(t_0)\over\widehat f_j(0)}
 =O(1).                                             \tag{4.10}
\]

Consequently

\[
 \sum_{\rho\in R_j}{1\over\rho^2+b^2}\leq Z_j^{(0)}=O(1).        \tag{4.11}
\]

The zero-normalized paired products

\[
 H_j(z)={\widehat f_j(z)\over\widehat f_j(0)}
\]

therefore form a normal family on the whole plane.  On the real axis they
converge to `Xi(z)/Xi(0)`, so every subsequential limit is that function by
the identity theorem.  In particular
`H_j(ib)->Xi(ib)/Xi(0)!=0`; here `0<b<1/2` puts the classical xi argument
strictly between `0` and `1/2`, where its defining real expression is
nonzero.  Therefore

\[
 \Xi(ib){\widehat f_j(z)\over\widehat f_j(ib)}
 =\Xi(ib){H_j(z)\over H_j(ib)}\longrightarrow\Xi(z).
\]

This proves (4.7).  \(\square\)

### Corollary 4.3 (complete-norm gate)

Under the comparison hypothesis (4.2), it is sufficient that

\[
 \boxed{\sqrt {L_j}\,\|d_j\|_2\longrightarrow0.}   \tag{4.12}
\]

Indeed, real-axis evaluation on the source interval has norm `sqrt(L_j)`,
so (4.2) and (4.12) imply (4.6).

There is a substantially weaker projective version.  Let `P_M` be the
orthogonal projection onto the centered source modes `|n|<=M`.  For every
fixed `T>0`, if `M>=T L/pi`, direct integration of a centered mode gives,
uniformly for `|t|<=T`,

\[
 \left|\widehat{(I-P_M)d}(t)\right|
 \leq {2\sqrt2\over\pi}\sqrt{L\over M}\,\|d\|_2.                 \tag{4.13}
\]

To see this, the transform of
`(-1)^n L^(-1/2)exp(2*pi*i*n*x/L)` has magnitude

\[
 {2|\sin(tL/2)|\sqrt L\over|2\pi n-tL|}
 \leq {2\sqrt L\over\pi|n|}
 \qquad(|n|>M),                                    \tag{4.14}
\]

and the square sum over both tails is at most
`8L/(pi^2 M)`.  The low part obeys the elementary bound

\[
 |\widehat{P_Md}(t)|\leq\sqrt L\,\|P_Md\|_2.       \tag{4.15}
\]

Consequently, for any integers `M_j<=N_j` with `M_j/L_j -> infinity`, the
two projective conditions

\[
 \boxed{
 \sqrt {L_j}\,\|P_{M_j}d_j\|_2\longrightarrow0,
 \qquad
 \sqrt{L_j/M_j}\,\|d_j\|_2\longrightarrow0}       \tag{4.16}
\]

imply (4.6) locally uniformly on the real axis and hence imply the
whole-plane limit (4.7).  No complete small-angle or complete small-norm
condition is present in (4.16).

For the projected source-normalized prolate anchor

\[
 p_j=P_{N_j}k_{\lambda_j}^+,
\]

the repository already proves (4.2) when
`N_j/L_j^2 -> infinity`, with the explicit factor four retained.  Theorem
4.2 itself only needs the real-axis convergence in (4.2); its complete trace
bound then enforces the necessary exterior-lattice scale through (4.5).

## 5. Feshbach corollary and rate comparison

Suppose

\[
 p_j=a_j\kappa_j,
 \qquad
 f_j=a_j(\kappa_j-z_j),
 \qquad
 a_j\longrightarrow a_\infty\in(0,\infty).        \tag{5.1}
\]

Then Corollary 4.3 needs only

\[
 \boxed{\sqrt {L_j}\,\|z_j\|\longrightarrow0.}    \tag{5.2}
\]

When the shifted signs (3.2) hold, the actual Feshbach correction satisfies

\[
 z_j=(A_j-\mu_jI)^{-1}b_j,
 \qquad
 \|z_j\|\leq\|(A_j-U_jI)^{-1}b_j\|.              \tag{5.3}
\]

A direct sufficient source target is therefore

\[
 \boxed{
 \|(A_j-U_jI)^{-1}b_j\|=o(L_j^{-1/2}).}            \tag{5.4}
\]

The projective alternative (4.16) is stronger still.  For a cutoff
`M_j<=N_j`, it is enough to prove

\[
 \boxed{
 \sqrt {L_j}\,\|P_{M_j}z_j\|\longrightarrow0,
 \qquad
 \sqrt{L_j/M_j}\,\|z_j\|\longrightarrow0.}        \tag{5.4a}
\]

The second condition may use the complete enclosure
`||z_j||<=||(A_j-U_jI)^(-1)b_j||`; the first is an oriented low-mode solve
and does not follow from a projected Loewner comparison.  If
`M_j` is comparable to `lambda_j`, (5.4a) asks for a low component
`o(L_j^(-1/2))` while allowing the complete solve to be
`o(sqrt(lambda_j/L_j))`.  The already-proved anchor projection estimate is
still required separately in (4.2).

No origin-moment estimate is needed for this route.  By contrast, if one
insists on producing normality from the origin curvature by a linear
Cauchy--Schwarz estimate, then

\[
 \left|{1\over2}\int x^2z_j(x)\,dx\right|
 \leq {L_j^{5/2}\over8\sqrt5}\,\|z_j\|.           \tag{5.5}
\]

This is why the earlier origin-curvature package used
`O(L_j^(-5/2))`.  That exponent is sharp for (5.5), but Lemma 4.1 bypasses
(5.5) by exploiting the nonlinear real-zero product.  The weaker little-o
rate (5.4) is not currently known for the arithmetic ground correction.

## 6. Hidden-assumption audit

The chain above uses none of the following:

- a list of real zeta zeros;
- positivity of the unshifted global Weil form;
- a quantitative lower bound for the source boundary value;
- unit normalization of `h_lambda`;
- finite-lambda inversion parity of `E(h_lambda)`;
- real-axis eigenvalue agreement as a replacement for determinant normality.

It does use, and cannot silently remove:

- the exact source Cauchy form and Fourier sign;
- the actual lowest-eigenvalue shift and positive quotient metric;
- a simple global inversion-even ground line at every large stage;
- the complete exterior Fourier lattice in (4.8)--(4.10);
- the source-normalized factor-four comparison state;
- a normal-family gate, supplied here by the fixed real ratio (4.9) and
  source real-rootedness.

The last three bullets are precisely where an apparently weak real-axis
comparison can otherwise conceal an RH-equivalent assumption.  Here they are
explicit hypotheses or already proved anchor facts; none is inferred from
numerical agreement.
