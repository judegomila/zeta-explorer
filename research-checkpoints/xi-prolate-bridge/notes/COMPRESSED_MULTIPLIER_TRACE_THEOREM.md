# Exact finite-compression multiplier trace theorem

## 1. Scope

This note proves a source-admitted, finite-compression replacement for the
global phase-volume bound in
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`.  The proof is self-contained:
it uses the elementary discrete Hilbert-transform multiplier, exact dyadic
bookkeeping, and the already pinned FKS Chebyshev constants.  It does not
use the unpinned Montgomery--Vaughan theorem recorded in the older candidate
note.

On a polynomial Fourier schedule it proves an `O(lambda^2)` upper scale for
the dimension of the compressed multiplier-dangerous space.  It does **not**
prove that this space is captured by the physical prolate range, sign its
finite Schur complement, prove either shifted parity floor, establish
equation (5.2) of `DIRECT_RH_ATTACK.md`, or prove locally uniform determinant
convergence.  The repository state therefore remains `P0_INVALIDATED`.

Fix `lambda>1` and put

\[
 x=\lambda^2,\qquad L=\log x=2\log\lambda.                 \tag{1.1}
\]

Every arithmetic sum below includes each prime power `n<=x`; no endpoint is
dropped and `x` is never replaced by `lambda`.  The Fourier convention is

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(y)e^{-ity}\,dy.           \tag{1.2}
\]

Thus the complete source multiplier, with the minus sign on the prime block,
is

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=\sum_{1<n\le x}{\Lambda(n)\over\sqrt n}
                                      \cos(t\log n).       \tag{1.3}
\]

## 2. A self-contained logarithmic Hilbert inequality

For a sequence supported on the integers `2<=n<=x` define

\[
 H_{\log}(b)=\sum_{n\ne m}{b_n\overline{b_m}\over
                                      \log n-\log m},
 \qquad
 W(b)=\sum_n n|b_n|^2.                                    \tag{2.1}
\]

Let

\[
 B_j=\{n:2^j\le n<2^{j+1},\ n\le x\},\qquad
 P_j=\sum_{n\in B_j}|b_n|.                                \tag{2.2}
\]

The discrete Hilbert transform

\[
 (Hv)_n=\sum_{m\ne n}{v_m\over n-m}                       \tag{2.3}
\]

has Fourier multiplier

\[
 \sum_{r\ne0}{e^{-ir\vartheta}\over r}
 =i(\vartheta-\pi),\qquad0<\vartheta<2\pi,                \tag{2.4}
\]

and hence operator norm at most `pi` on `ell^2(Z)`.  No
external Hilbert-inequality theorem is being cited here.  The exact
logarithmic-mean identity

\[
 {1\over\log n-\log m}
 =\int_0^1{n^s m^{1-s}\over n-m}\,ds                       \tag{2.5}
\]

then gives the following finite inequality:

\[
\boxed{
 |H_{\log}(b)|
 \le2\pi\left(1+{\sqrt2\over\log2}\right)W(b)
 +{2\over\log2}
  \sum_{k\ge j+2}{P_jP_k\over k-j-1}.}                    \tag{2.6}
\]

Here and below a repeated pair `j,k` in a displayed dyadic sum means the
finite sum over all nonempty blocks satisfying the displayed restriction.

For completeness, the constants in (2.6) are obtained as follows.  For each
fixed `s`, apply the bilinear version of (2.3) to
`u_n=n^s b_n` and `v_n=n^(1-s)b_n`; no entrywise operator domination is
used.  Inside one block, if `Y=2^j`, then

\[
 \|u\|_2\|v\|_2\le2Y\sum_{n\in B_j}|b_n|^2
 \le2\sum_{n\in B_j}n|b_n|^2.                              \tag{2.5a}
\]

Thus one block costs at most `2*pi*sum_(B_j)n|b_n|^2`.  For
adjacent blocks, apply the same bilinear Hilbert bound to the ordered
high--low pairing and then add its negative conjugate.  The corresponding
norm product is at most
`2^s Y sqrt(E_j E_(j-1))`, where
`E_j=sum_(B_j)|b_n|^2`.  Integration of `2^s` gives `1/log 2`;
Cauchy--Schwarz and
`2 sqrt(W_j W_(j-1))<=W_j+W_(j-1)` give the total adjacent cost
`2*pi*sqrt(2)*W/log 2`.  If `k>=j+2`, then

\[
 |\log(n/m)|>(k-j-1)\log2
 \quad(n\in B_k,\ m\in B_j),                               \tag{2.7}
\]

so the two orientations cost the second term of (2.6).  This accounts for
every ordered pair exactly once.

Let `psi_C(y)=sum_(n<=y) Lambda(n)`.  The FKS estimate pinned in
`P3_SOURCE_LOCK.json` has the form used in the parity-multiplier reduction.
Maximizing `z^3 exp(-0.8476836 z)` at
`z=3/0.8476836`, and checking the trivial range `1<=y<=2`, gives the
all-range consequence

\[
 \psi_C(y)\le C_\psi y,\qquad
 C_\psi=1+9.22022\left({3\over0.8476836}\right)^3e^{-3}.
                                                                    \tag{2.8}
\]

For the source coefficients `|b_n|=Lambda(n)/sqrt(n)`, (2.8) gives

\[
 P_j\le2C_\psi 2^{j/2}.                                   \tag{2.9}
\]

Define the exact geometric constant

\[
 c_*= {1\over\sqrt2}
       \log{1\over1-1/\sqrt2}.                             \tag{2.10}
\]

Writing `h=k-j-1`, summing
`2^{-(h+1)/2}/h`, and using
`sum_(k<=floor(log_2 x))2^k<2x` proves

\[
 {2\over\log2}\sum_{k\ge j+2}{P_jP_k\over k-j-1}
 \le {16c_*\over\log2}C_\psi^2x.                         \tag{2.11}
\]

## 3. Exact finite mean-square bound

Put

\[
 D_\lambda(t)=\sum_{1<n\le x}{\Lambda(n)\over\sqrt n}
                                      e^{it\log n},        \tag{3.1}
\]

\[
 A_2=\sum_{1<n\le x}{\Lambda(n)^2\over n},\qquad
 B_2=\sum_{1<n\le x}\Lambda(n)^2,\qquad
 \Sigma=\sum_{1<n\le x}{\Lambda(n)\over\sqrt n}.        \tag{3.2}
\]

For `R>0`, take
`b_n=Lambda(n)n^(-1/2)e^(iR log n)` in (2.6).  Then
`W(b)=B_2`.  If

\[
 H_R=\sum_{n\ne m}{b_n\overline{b_m}\over\log n-\log m},
                                                                    \tag{3.3}
\]

direct endpoint expansion gives the exact sign and factor

\[
 \int_{-R}^{R}|D_\lambda(t)|^2dt=2RA_2-2iH_R.             \tag{3.4}
\]

Also `log(nm)>=log 4`, so

\[
 \left|\int_{-R}^{R}D_\lambda(t)^2dt\right|
 \le {\Sigma^2\over\log2}.                                \tag{3.5}
\]

Since `(Re D)^2=(|D|^2+Re(D^2))/2`, equations
(2.6), (2.11), and (3.4)--(3.5) prove

\[
\boxed{
 M_2(R):={1\over2\pi}\int_{-R}^{R}S_\lambda(t)^2dt
 \le {RA_2\over2\pi}
 +\left(1+{\sqrt2\over\log2}\right)B_2
 +{8c_*\over\pi\log2}C_\psi^2x
 +{\Sigma^2\over4\pi\log2}.}                             \tag{3.6}
\]

Every term in (3.6) is a finite source parameter; there is no unspecified
constant.

Useful all-range consequences of (2.8), obtained by partial summation, are

\[
 A_2\le C_\psi L(1+L),\qquad
 B_2\le C_\psi xL,
 \qquad
 \Sigma\le C_\psi(2\sqrt x-1).                            \tag{3.7}
\]

## 4. The compressed multiplier trace

Let `P_N` be the centered Fourier compression on `|n|<=N`, where `N>=1`,
and put

\[
 d=2N+1,\qquad \Omega={2\pi N\over L},\qquad
 R=(1+\zeta)\Omega,\quad\zeta>0,                           \tag{4.1}
\]

and define

\[
 K_N(t)=\sum_{|n|\le N}|\widehat\phi_n(t)|^2,\qquad
 \widehat\phi_n(t)={2\sin(tL/2)\over
                         \sqrt L(t-2\pi n/L)}.             \tag{4.2}
\]

The removable values are taken by continuity.  Partial fractions and
Plancherel give

\[
 0\le K_N(t)\le L,\qquad
 \int_{\mathbb R}K_N(t){dt\over2\pi}=d,                   \tag{4.3}
\]

and, for `|t|>=R`,

\[
 K_N(t)\le {4d\over L(|t|-\Omega)^2}.                      \tag{4.4}
\]

For a real shift `U` and `g>0`, set

\[
 B=U+g,\qquad v(t)=[B-m_\lambda(t)]_+,                    \tag{4.5}
\]

\[
 c_0=\psi_{\rm dig}(1/4)-\log\pi,\qquad
 C_+=(B-c_0)_+,\qquad A_+=(B+2\Sigma-c_0)_+.              \tag{4.6}
\]

The exact digamma lower bound from the parity-multiplier reduction gives,
on `|t|<=R`,

\[
 v(t)\le
 \left[B-c_0-\tfrac12\log(1+4t^2)\right]_+
 +2|S_\lambda(t)|,                                        \tag{4.7}
\]

and globally `v(t)<=A_+`.  Define `F(0)=0` and

\[
 F(C)=\sqrt{e^{2C}-1}-\arctan\sqrt{e^{2C}-1}
 \quad(C>0).                                                \tag{4.8}
\]

Use the explicit archimedean central bound

\[
 H_N:=\min\left\{dC_+,\ {L\over2\pi}F(C_+)\right\}.       \tag{4.9}
\]

Weighted Cauchy--Schwarz, (3.6), and the tail integral of (4.4) now prove
the fully finite estimate

\[
\boxed{
 \operatorname {tr}(P_NT_vP_N)
 \le H_N+2\sqrt{dL M_2(R)}
       +{2dA_+\over\pi^2\zeta N}.}                        \tag{4.10}
\]

The prime cancellation is retained through the single source polynomial
`S_lambda` until its finite second moment is taken.  Equation (4.10) is not a
triangle inequality over the pole, archimedean, and individual prime blocks.

## 5. Dangerous-rank consequence

Let `0<delta<g`.  Compress the positive operator `T_v` to either finite
parity sector and form its spectral projector at `[g-delta,infinity)` as in
equation (5.3) of the parity-multiplier reduction.  Compression cannot
increase trace, so (4.10) gives

\[
 \boxed{
 \dim\mathcal L_{N,+}\le
 {\mathcal T_{\lambda,N}(U,g,\zeta)\over g-\delta},}       \tag{5.1}
\]

where `mathcal T` denotes the displayed right side of (4.10).  In the odd
sector, adjoining the exact pole representer costs at most one direction:

\[
 \boxed{
 \dim\mathcal L^\sharp_{N,-}\le
 {\mathcal T_{\lambda,N}(U,g,\zeta)\over g-\delta}+1.}     \tag{5.2}
\]

These are real upper bounds; an integer certificate may take their ceilings
and cap them by the corresponding ambient sector dimensions.

For fixed `zeta>0`, a schedule satisfying

\[
 N\asymp x,\qquad U=o(L),\qquad
 g=\kappa L,\quad0<\kappa<1,
 \qquad\delta=\rho g,\quad0<\rho<1,                       \tag{5.3}
\]

has, by (3.6)--(3.7),

\[
 M_2(R)=O(xL),\qquad
 \mathcal T_{\lambda,N}=O(xL),                            \tag{5.4}
\]

and hence

\[
 \boxed{
 \dim\mathcal L_{N,+}=O(x),\qquad
 \dim\mathcal L^\sharp_{N,-}=O(x).}                      \tag{5.5}
\]

This is the first admitted polynomial-scale finite-compression
dangerous-rank theorem.  It is a scale statement, not a favorable finite
fraction: the explicit constants can make (5.1) larger than the whole
compression, in which case only the ambient dimension cap is informative.
Moreover, (5.5) is tied to `N asymptotic x`.  Substituting the project's
separate exponential projection schedule into (4.10) does not preserve the
`O(x)` conclusion.

## 6. Exact capture and quotient-gluing criteria

The rank theorem does not by itself connect the dangerous space to the
physical prolate range.  The exact missing geometry can nevertheless be
stated without a smallest physical Gram.

Let, on one parity sector,

\[
 B_{\rm sh}=Q-U I\succeq gI-R,\qquad R\succeq0,             \tag{6.1}
\]

and let `Pi_>=1_(g-delta,infinity)(R)`, with a strict lower endpoint.
Its rank is at most the rank of the inclusive dangerous projector used in
(5.1)--(5.2).  For a physical low range `K`, put

\[
 s=\|\Pi_>P_{K^\perp}\|,\qquad r=\|R\|.                   \tag{6.2}
\]

Spectral calculus gives

\[
 R\preceq(g-\delta)I+
       [r-(g-\delta)]_+\Pi_>.                              \tag{6.3}
\]

Therefore

\[
\boxed{
 P_{K^\perp}B_{\rm sh}P_{K^\perp}
 \succeq
 \left\{\delta-[r-g+\delta]_+s^2\right\}P_{K^\perp}.}    \tag{6.4}
\]

The strict endpoint is essential: an eigenvector with eigenvalue exactly
`g-delta` already has floor `delta` and need not be captured.  In particular,
exact capture `Ran(Pi_>) subset K` gives that floor.  If
`dim Ran(Pi_>)>dim K`, then `Ran(Pi_>) intersect K^perp` is nonzero and
`s=1`; a rank estimate alone does not prove capture.

Finally let `Delta_L` be the already proved block quotient metric on `K`,
write `H=K^perp`, and suppose

\[
 B_{KK}\succeq\mu\Delta_L,\qquad
 B_{HH}\succeq\eta I,\qquad \mu,\eta>0.                  \tag{6.5}
\]

With the complete cross block retained, define

\[
 \chi=\|\eta^{-1/2}B_{HK}\Delta_L^{-1/2}\|.              \tag{6.6}
\]

If `chi^2<mu`, the normalized two-block estimate gives

\[
\boxed{
 B_{\rm sh}\succeq
 \nu(\Delta_L\oplus\eta I),\qquad
 \nu={\mu+1-\sqrt{(\mu-1)^2+4\chi^2}\over2}>0.}          \tag{6.7}
\]

This factor is sharp from the three scalar inputs and uses the same quotient
metric as the low positive-sampling theorem.  Neither (6.4) nor (6.7) is
asserted to hold with favorable source parameters: the missing work is a
phase-sensitive capture bound, the signed low comparison in (6.5), and the
quotient-relative cross estimate in (6.6).

## 7. Status and replay boundary

The producer serializes exact half-integer inputs, the inclusive prime-power
inventory, raw outward `mpmath.iv` dyadics for (3.2), (3.6), and (4.6)--(4.10),
and exact rational models of (6.4)--(6.7).  Before serialization, each
nondegenerate interval is enlarged on both sides by the exact dyadic

\[
  2^{s-\lceil d\,3321928094887363/10^{15}\rceil+16},
  \qquad
  s=\max\{0,\lfloor\log_2\max(|a|,|b|)\rfloor\},          \tag{7.1}
\]

where `[a,b]` is the raw interval at `d` decimal digits; degenerate exact
intervals are left unchanged.  This guard tends to zero with the requested
precision.  The verifier rejects a submitted interval unless it contains
the independently reconstructed interval, so overlap alone is never treated
as evidence of outwardness.  It also retains a precision-scaled upper-width
test.

The verifier reconstructs prime powers by a separate integer-factorization
path and imports neither producer code nor a cached matrix.  Both paths share
the pinned `mpmath.iv` runtime; that common transcendental library is an
explicit limitation.

The finite pilot values are diagnostics for the proved inequalities only.
They do not certify a strict transition-space budget, a physical capture
angle, a signed sector floor, the residual--gap limit, or a determinant
limit.  No numerical agreement is promoted to an asymptotic theorem.
