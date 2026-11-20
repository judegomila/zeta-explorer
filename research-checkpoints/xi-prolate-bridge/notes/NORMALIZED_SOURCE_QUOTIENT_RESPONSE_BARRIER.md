# Normalized source-quotient response structure barrier

## 0. Exact outcome and claim boundary

This note asks whether the two strict shifted-sector signs and real-rootedness
of the source quotient can bound the cancellation-preserving normalized
profile

\[
 G_\mu(r):={\mathcal A_\mu(r)\over p_\mu},
 \qquad p_\mu=\langle V_0,\Phi_\mu\rangle .       \tag{0.1}
\]

They cannot.  An exact one-parameter `N=2` source-Cauchy family has both
strict signs, a simple boundary-normalized even ground, and four real simple
quotient roots.  Multiplying its source matrix by the family parameter makes
every relevant positive gap at least one without changing the ground or the
profile, while

\[
 \boxed{G_0(i)=1+{3a\over5}\longrightarrow\mathord+\infty.}  \tag{0.2}
\]

This is a structural nonimplication.  The family is not assembled from the
actual prime-power and archimedean source.

There is also a precise positive result.  For the favorable uniform family
`T_N=I-|eta><eta|/(2N+1)`, the function `G_0(i sqrt(t))` is complete
Bernstein, `G_0(i sqrt(t))/t` and its reciprocal are Stieltjes functions in
the stated senses, and the quotient polynomial gives a Hermite--Biehler
function with a positive de Branges kernel.  Those qualitative structures
still do not control the physical entire response.  After the same
uniform-gap scaling, exact cardinal samples have size `sqrt(L)`, and at a
fixed imaginary point in a strict strip the response grows like
`sqrt(L) cosh(yL/2)`.

Thus a proof for the actual arithmetic family needs quantitative information
beyond strict signs and quotient real-rootedness: at minimum, control of the
ground--anchor overlap and of the quotient-zero placement strong enough to
survive the lattice-zero cancellation.  This note proves no failure of an
actual arithmetic matrix, no failure of either actual strict sign, no actual
response lower bound, no determinant limit, no zero theorem, no Riemann
hypothesis conclusion, and no de Bruijn--Newman `Lambda` bound.  The formal
state remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following current repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md` | `ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3` |
| `tests/test_capture_free_actual_ground_parity_response_barrier.py` | `477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772` |
| `notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md` | `9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13` |
| `tests/test_source_quotient_pick_herglotz_interlacing_barrier.py` | `86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658` |
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `tests/test_source_boundary.py` | `a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808` |
| `notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` | `1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755` |
| `notes/ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md` | `3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce` |
| `tests/test_actual_ground_fixed_mode_residue_sign_barrier.py` | `5ea8d73b2641f6fe31e494bcd4ab0e524940bc7575d6c5b8a784e7e415201216` |
| `notes/SOURCE_COMPATIBLE_MIXED_COFACTOR_DEFORMATION_BARRIER.md` | `cfc5585292a8880f43003280900e85f052951195c563c01ed48cdd49f27aa4d9` |
| `tests/test_source_compatible_mixed_cofactor_deformation_barrier.py` | `d91f134ebc3d8a33e38a7cb3acd6354a25a0293233bf111f7983710076db5af7` |

The checkpoint-1.27 pair fixes the source quotient and its exact residue
classification.  The capture-free pair fixes the response normalization.
The two checkpoint-1.28 admitted pairs fix, respectively, the conditional
actual-ground residue obstruction and the source-compatible mixed-cofactor
deformation barrier.  The source-boundary and paired-trace inputs fix the
finite source algebra and the favorable family.  No numerical artifact,
zero table, RH premise, or actual arithmetic eigenvector is imported.

## 2. Normalized quotient formula and product stopping line

Use modes `-N,...,N`, the centered mode operator `DV_n=nV_n`, and a simple
boundary-normalized even ground

\[
 \Phi_\mu=\sum_{n=-N}^{N}\xi_nV_n,
 \qquad \xi_{-n}=\xi_n,
 \qquad \xi_0+2\sum_{n=1}^{N}\xi_n=1.            \tag{2.1}
\]

With anchor `kappa=V_0`, one has `p_mu=xi_0`.  The source-boundary identity
and odd resolvent formula give

\[
 \mathcal A_\mu(r)
 =1-2\sum_{n=1}^{N}{n^2\xi_n\over n^2-r^2},
 \qquad \mathcal A_\mu(0)=\xi_0=p_\mu.           \tag{2.2}
\]

Suppose `p_mu` is nonzero and the even quotient polynomial has nonzero real
roots `+-rho_1,...,+-rho_N`.  Equality of the poles, zeros, leading
coefficients, and the value at zero gives the exact factorization

\[
 \boxed{
 G_\mu(r)
 ={\mathcal A_\mu(r)\over p_\mu}
 ={\displaystyle\prod_{k=1}^{N}
       \left(1-{r^2\over\rho_k^2}\right)
   \over
   \displaystyle\prod_{n=1}^{N}
       \left(1-{r^2\over n^2}\right)},
 \qquad
 \prod_{k=1}^{N}\rho_k^2=p_\mu(N!)^2.}          \tag{2.3}
\]

Real-rootedness alone only places the `rho_k` on the real line.  Formula
(2.3) does not bound their separation from the integer poles, their escape,
or the small product caused by `p_mu`.  A compact bound for `G_mu` therefore
requires a new quantitative zero-placement theorem; self-adjointness of the
quotient supplies no such theorem.

## 3. Exact `N=2` uniform-gap counterfamily

Fix `a>0` and modes `(-2,-1,0,1,2)`.  Use the source row

\[
 (b_{-2},b_{-1},b_0,b_1,b_2)=(-2,1,0,-1,2)      \tag{3.1}
\]

and diagonal

\[
 (a_{-2},a_{-1},a_0,a_1,a_2)
 =\left({1\over a}+{7\over3},
        {1\over a}+{13\over3},
        4a,
        {1\over a}+{13\over3},
        {1\over a}+{7\over3}\right).            \tag{3.2}
\]

Set `Q_nn=a_n` and `Q_nm=(b_n-b_m)/(n-m)` for `n!=m`.  Explicitly,

\[
 Q(a)=\begin{pmatrix}
 {1\over a}+{7\over3}&3&1&{1\over3}&1\\
 3&{1\over a}+{13\over3}&-1&-1&{1\over3}\\
 1&-1&4a&-1&1\\
 {1\over3}&-1&-1&{1\over a}+{13\over3}&3\\
 1&{1\over3}&1&3&{1\over a}+{7\over3}
 \end{pmatrix}.                                  \tag{3.3}
\]

It kills the boundary-normalized even vector

\[
 \boxed{\Phi(a)=(-a,a,1,a,-a)^T,
 \qquad \langle\eta,\Phi(a)\rangle=1,
 \qquad p_0=1.}                                  \tag{3.4}
\]

In normalized parity coordinates the blocks are

\[
 Q_+(a)=\begin{pmatrix}
 4a&-\sqrt2&\sqrt2\\
 -\sqrt2&{1\over a}+{10\over3}&{10\over3}\\
 \sqrt2&{10\over3}&{1\over a}+{10\over3}
 \end{pmatrix},                                  \tag{3.5}
\]

\[
 Q_-(a)=\begin{pmatrix}
 {1\over a}+{16\over3}&{8\over3}\\
 {8\over3}&{1\over a}+{4\over3}
 \end{pmatrix}.                                  \tag{3.6}
\]

Their exact spectra are

\[
 \boxed{
 \operatorname {spec}Q_+(a)
 =\left\{0,4a+{1\over a},{20\over3}+{1\over a}\right\},
 \qquad
 \operatorname {spec}Q_-(a)
 =\left\{{1\over a},{20\over3}+{1\over a}\right\}.}     \tag{3.7}
\]

For `kappa=V_0`, the even anchor-complement block is

\[
 B_0(a)=\begin{pmatrix}
 {1\over a}+{10\over3}&{10\over3}\\
 {10\over3}&{1\over a}+{10\over3}
 \end{pmatrix},
 \qquad
 \operatorname {spec}B_0(a)
 =\left\{{1\over a},{20\over3}+{1\over a}\right\}.       \tag{3.8}
\]

The genuine anchor/coupling Ritz matrix is

\[
 \begin{pmatrix}4a&2\\2&1/a\end{pmatrix},       \tag{3.9}
\]

with eigenvalues `0` and `4a+1/a`.  Hence `u=mu=0`, the ground is simple,
and both strict shifted-sector signs hold.

Now scale the entire source matrix by `a`:

\[
 \widetilde Q(a)=aQ(a).                          \tag{3.10}
\]

The source row scales to `ab`, but the kernel and its boundary normalization
do not change.  The positive spectra relevant to the two strict signs become

\[
 \boxed{
 \operatorname {spec}(aB_0)
 =\operatorname {spec}(aQ_-)
 =\left\{1,1+{20a\over3}\right\},
 \qquad
 \operatorname {spec}_{+}(aQ_+)
 =\left\{1+4a^2,1+{20a\over3}\right\}.}          \tag{3.11}
\]

Thus all these positive gaps have the parameter-independent floor one.
Nevertheless (2.2), using `xi_1=a` and `xi_2=-a`, gives

\[
 \boxed{
 G_0(r)=\mathcal A_0(r)
 =1-{6ar^2\over(1-r^2)(4-r^2)},
 \qquad G_0(i)=1+{3a\over5}.}                    \tag{3.12}
\]

The quotient polynomial is

\[
 P_a(r)=r^4-(5+6a)r^2+4.                        \tag{3.13}
\]

Its squared roots are positive and distinct: their sum is `5+6a`, their
product is `4`, and the polynomial in `x=r^2` is positive at `x=0` and
negative at both `x=1` and `x=4`.  Hence

\[
 0<\rho_1<1<2<\rho_2.                            \tag{3.14}
\]

Real quotient roots, strict signs, and uniform gaps therefore do not bound
the normalized profile even at the single compact point `r=i`.

## 4. Favorable family: exact positive function theory

Put `M=2N+1`,

\[
 q_N(r)=\prod_{j=-N}^{N}(r-j)
       =r\prod_{n=1}^{N}(r^2-n^2),               \tag{4.1}
\]

and on modes `-N,...,N` set

\[
 T_N=I-{1\over M}|\eta\rangle\langle\eta|,
 \qquad b_n=-{n\over M},
 \qquad \Phi_N={\eta\over M},
 \qquad p_0={1\over M}.                         \tag{4.2}
\]

This is a source-Cauchy matrix with simple ground `Phi_N`, odd block `I_N`,
and both strict signs.  Its quotient and normalized profile are

\[
 P_N(r)={q_N'(r)\over M},
 \qquad
 \boxed{G_N(r)={\mathcal A_0(r)\over p_0}
 ={rq_N'(r)\over q_N(r)}
 =1+2r^2\sum_{n=1}^{N}{1\over r^2-n^2}.}         \tag{4.3}
\]

Writing

\[
 q_N'(r)=M\prod_{k=1}^{N}(r^2-s_k^2),            \tag{4.4}
\]

the logarithmic derivative is strictly decreasing between consecutive
positive lattice points and has opposite infinite endpoint limits.  Thus

\[
 \boxed{k-1<s_k<k,
 \qquad \prod_{k=1}^{N}s_k^2={(N!)^2\over M}.}   \tag{4.5}
\]

In the variable `t=-r^2`, for `t>0`,

\[
 \boxed{
 G_N(i\sqrt t)=1+2t\sum_{n=1}^{N}{1\over t+n^2}
 =M{\prod_{k=1}^{N}(t+s_k^2)
       \over\prod_{n=1}^{N}(t+n^2)}.}            \tag{4.6}
\]

This is a complete Bernstein function by its displayed finite positive
representation.  Moreover

\[
 {G_N(i\sqrt t)\over t}
 ={1\over t}+2\sum_{n=1}^{N}{1\over t+n^2}       \tag{4.7}
\]

is Stieltjes, and so is

\[
 {1\over G_N(i\sqrt t)}
 ={1\over M}+\sum_{k=1}^{N}{d_k\over t+s_k^2},
 \qquad
 d_k={1\over M}
 {\displaystyle\prod_{n=1}^{N}(n^2-s_k^2)
  \over
  \displaystyle\prod_{\ell\ne k}(s_\ell^2-s_k^2)}>0.      \tag{4.8}
\]

The positivity in (4.8) follows directly from `k-1<s_k<k`: numerator and
denominator have the same `k-1` negative factors.  These finite Stieltjes
representations also give positive finite continued fractions.

There is an equally exact Hermite--Biehler formulation.  Put

\[
 E_N(z)=q_N(z)+i{q_N'(z)\over M}.                 \tag{4.9}
\]

Because all zeros of `q_N` are real and simple, `q_N'/q_N` has negative
imaginary part in the upper half-plane.  Hence `E_N` is
Hermite--Biehler.  Its de Branges kernel is

\[
 K_{E_N}(z,w)
 ={q_N'(\overline w)q_N(z)-q_N(\overline w)q_N'(z)
   \over\pi M(z-\overline w)},                  \tag{4.10}
\]

and on the real axis

\[
 K_{E_N}(x,x)
 ={q_N'(x)^2-q_N(x)q_N''(x)\over\pi M}>0.        \tag{4.11}
\]

These statements are favorable-family structure, not consequences of the
two strict signs plus real-rootedness.  They do not give an `N,L`-uniform
point-evaluation constant or a lower bound for the actual `p_mu`.

For comparison with (3.11), scale the favorable matrix without changing its
ground:

\[
 \widetilde T_N=MT_N=MI-|\eta\rangle\langle\eta|.             \tag{4.12}
\]

Its odd block is `MI_N`; its even anchor-complement block has spectrum
`{1,M,...,M}`; and the anchor/coupling Ritz plane has eigenvalues `0,M`.
Thus this family too has a uniform strict-gap floor one while retaining the
same `G_N`.

## 5. Exact physical continuation and compact-strip failure

Let

\[
 r={zL\over2\pi},
 \qquad
 K_L(z)={2\sin(zL/2)\over z\sqrt L},
 \qquad
 \operatorname {sinc}(u)={\sin(\pi u)\over\pi u},             \tag{5.1}
\]

with the continuous values at zero.  For the favorable family the
cancellation-preserving entire factor is

\[
 \boxed{
 H_{N,L}(z):=K_L(z)G_N(r)
 ={\sqrt L\over\pi}\sin(\pi r){q_N'(r)\over q_N(r)}
 =\sqrt L\sum_{j=-N}^{N}(-1)^j
       \operatorname {sinc}(r-j).}               \tag{5.2}
\]

For `kappa=V_0`, the complete response is

\[
 R_{N,L}(z)=K_L(z)-H_{N,L}(z).                   \tag{5.3}
\]

At every retained lattice sample,

\[
 \boxed{
 H_{N,L}\left({2\pi j\over L}\right)=\sqrt L(-1)^j,
 \quad
 R_{N,L}(0)=0,
 \quad
 R_{N,L}\left({2\pi j\over L}\right)
 =-\sqrt L(-1)^j\quad(0<|j|\leq N).}             \tag{5.4}
\]

Thus every fixed real interval of positive length contains retained grid
points of response magnitude `sqrt(L)` once `L` is large and `N/L` stays
large.

The fixed imaginary-axis obstruction is stronger.  The partial-fraction
identity

\[
 {q_N'(r)\over q_N(r)}
 =\pi\cot(\pi r)-\sum_{n>N}{2r\over r^2-n^2}     \tag{5.5}
\]

gives, uniformly for `z` in a fixed compact set and `|r|<=N/2`,

\[
 H_{N,L}(z)
 =\sqrt L\cos(zL/2)
  +O_\Omega\left({L^{3/2}e^{|\operatorname {Im}z|L/2}\over N}\right),       \tag{5.6}
\]

\[
 R_{N,L}(z)
 ={2\sin(zL/2)\over z\sqrt L}
  -\sqrt L\cos(zL/2)
  +O_\Omega\left({L^{3/2}e^{|\operatorname {Im}z|L/2}\over N}\right).       \tag{5.7}
\]

Consequently, if `L` tends to infinity, `N/L` tends to infinity, and
`0<y<1/2` is fixed, then

\[
 \boxed{
 R_{N,L}(iy)
 =-\sqrt L\cosh(yL/2)
  +{2\sinh(yL/2)\over y\sqrt L}
  +o\!\left(\sqrt L e^{yL/2}\right),
 \qquad
 |R_{N,L}(iy)|\sim\sqrt L\cosh(yL/2).}           \tag{5.8}
\]

The positive Bernstein, Stieltjes, continued-fraction, and de Branges
structures therefore do not imply the compact strict-strip bound required
by the actual response route.  This remains true after the uniform-gap
scaling (4.12).

## 6. Cancellation warning and strict stopping line

Write `C_mu=mathcal A_mu-1`.  The complete normalized factor is not `C_mu`
and is not generally `C_mu/p_mu`.  In the favorable family,

\[
 \boxed{
 G_N-1={\mathcal A_0-p_0\over p_0}
       =M C_0+(M-1)
       ={C_0\over p_0}+(M-1).}                  \tag{6.1}
\]

Discarding the constant `M-1` destroys the exact origin cancellation
`G_N(0)=1` and the cardinal identity (5.2).  Any continued-fraction,
Christoffel--Darboux, reproducing-kernel, or de Branges argument must be
applied to the complete `G_mu` and then transported through `K_L`; a bound
for the mixed cofactor alone is not a response bound.

The strict stopping line is now exact.  A successful actual-arithmetic
argument needs at least one new input that rules out both countermechanisms:

1. quantitative control of `p_mu` and of the quotient zeros relative to the
   integer poles, strong enough to bound the product (2.3); and
2. a cancellation-preserving physical estimate for `K_LG_mu`, strong enough
   to overcome (5.4)--(5.8), rather than positivity of an auxiliary kernel
   alone.

Neither input follows from the two strict signs, quotient real-rootedness,
or the favorable positive-function structures proved here.  Conversely,
the structural families do not show that either input fails for the actual
prime-power matrix.  No actual-arithmetic failure claim is made.

## 7. Reproduction and self-audit

Run

    python3 -B -m unittest \
      tests.test_normalized_source_quotient_response_barrier -v

The test module checks the frozen hashes, exact source matrices and ground,
all displayed spectra, the scaled gap floor, quotient roots and profile
blowup, the favorable Bernstein/Stieltjes/Hermite--Biehler identities,
cardinal samples, physical imaginary-axis growth, product and cancellation
formulas, displayed TeX, ASCII/raw-byte hygiene, Python AST parsing, and the
fail-closed claim boundary.  It writes no cache artifact.
