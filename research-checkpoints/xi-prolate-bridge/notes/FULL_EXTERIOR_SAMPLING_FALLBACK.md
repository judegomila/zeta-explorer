# Full exterior-sampling fallback with explicit two-defect loss

## 1. Claim boundary

This note proves the strongest presently available **unconditional** version
of the full source-coordinate exterior sampling estimate.  It retains the
entire sampling Gram, including every cross term, and uses the exact
source-normalized arithmetic map.  The result is a valid fallback for the
quotient construction in `notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md`.

Its constant is exponentially enormous.  The final alignment bound contains
two inverse powers of the all-index Logvinenko--Sereda defect floor.  It does
not have the required `O(1/d_8)` scale and therefore does not close equation
(6.8d) of `DIRECT_RH_ATTACK.md`, either signed sector comparison, equation
(5.2), or locally uniform determinant convergence.  The repository state
remains `P0_INVALIDATED`; no RH proof is claimed.

The exact conventions, dependency hashes, and formula contract are in
`FULL_EXTERIOR_SAMPLING_SOURCE_LOCK.json`.

## 2. Explicit norm bound for the arithmetic map

Let `f` be supported in `[-lambda,lambda]`, with Lebesgue measure, and put

\[
 I_\lambda=[\lambda^{-1},\lambda],\qquad
 (A_\lambda f)(u)=\sqrt u\sum_{1\le m\le\lambda/u}f(mu).
                                                               \tag{2.1}
\]

The physical measure is `du/u`.  Therefore

\[
 \|A_\lambda f\|_2^2
 =\int_{1/\lambda}^{\lambda}
   \left|\sum_{m\le\lambda/u}f(mu)\right|^2du .             \tag{2.2}
\]

Cauchy--Schwarz and `floor(lambda/u)<=lambda/u` give

\[
\begin{aligned}
 \|A_\lambda f\|_2^2
 &\le \lambda\sum_{m\le\lambda^2}
     \int_{1/\lambda}^{\lambda/m}|f(mu)|^2{du\over u}\\
 &=\lambda\sum_{m\le\lambda^2}
     \int_{m/\lambda}^{\lambda}|f(x)|^2{dx\over x}\\
 &=\lambda\int_{1/\lambda}^{\lambda}
     \lfloor\lambda x\rfloor |f(x)|^2{dx\over x}\\
 &\le\lambda^2\int_0^\lambda|f(x)|^2dx.                   \tag{2.3}
\end{aligned}
\]

For an additive-even source function this is exactly

\[
\boxed{
 \|A_\lambda f\|_{L^2(I_\lambda,du/u)}^2
 \le {\lambda^2\over2}
       \|f\|_{L^2(-\lambda,\lambda,dx)}^2.}                \tag{2.4}
\]

Without evenness the safe last constant is `lambda^2`; the factor one half
must not be used.  The inversion `Jg(u)=g(u^(-1))` is unitary for `du/u`, so
both `S_sigma=(I+sigma J)/2` and the log-Fourier projector `P_N` are
contractions.  A state-invisible correction supported in
`|x|<1/(2 lambda)` does not change (2.1): for `u>=1/lambda` and `m>=1`,
`mu>=1/lambda`.

## 3. Source defect and quotient norm

Let `C` synthesize any finite family from orthonormal additive-even prolate
modes.  Put

\[
 B=C^*C,\qquad
 D_{\rm ext}=C^*\operatorname {diag}(d_n)C,\qquad
 W=P_NS_\sigma A_\lambda C.                                \tag{3.1}
\]

The pinned all-index Logvinenko--Sereda floor is

\[
 d_{\rm LS}(\lambda)
 =6\,96^{-5-(320\pi/\log2)\lambda^2}.                       \tag{3.2}
\]

Thus `D_ext >= d_LS B`.  Equations (2.4) and (3.1) give the Loewner chain

\[
\boxed{
 W^*W\preceq{\lambda^2\over2}B
 \preceq{\lambda^2\over2d_{\rm LS}}D_{\rm ext}.}           \tag{3.3}
\]

On the positive source quotient this proves

\[
\boxed{
 M:=\|W D_{\rm ext}^{-1/2}\|^2
 \le {\lambda^2\over2d_{\rm LS}}.}                        \tag{3.4}
\]

If `C` has a kernel, then
`ker C=ker B=ker D_ext`; (3.3)--(3.4) are read on its orthogonal quotient,
or with the Moore--Penrose inverse on the positive support.  If `W` has a
further kernel, the physical quotient preconditioner is restricted to
`ran(W)`.  No ambient zero eigenvalue is treated as a spectral floor.

## 4. Explicit compact-window sampling constant

Put

\[
 L=2\log\lambda,\qquad
 V_N^0={2\pi N+2\sqrt{2N+1}\over\sqrt L},\qquad
 H_N=\max\{1,(V_N^0+\tfrac34\sqrt L)^2\}.                  \tag{4.1}
\]

For completeness, let `g` be a unit vector in the `2N+1` dimensional
log-Fourier window on `[0,L]`, zero-extended to the real line.  Parseval gives
`||g'||_2<=(2*pi*N/L)||g||_2`, while Cauchy--Schwarz on the Fourier
coefficients gives
`|g(0)|,|g(L)|<=sqrt((2N+1)/L)||g||_2`.  Therefore its full-line variation,
including both endpoint jumps, satisfies

\[
 \operatorname {TV}_{\mathbb R}(g)
 \leq\sqrt L\,\|g'\|_2+|g(0)|+|g(L)|
 \leq V_N^0.                                               \tag{4.1a}
\]

For reference, retain the exact pinned overlap constants

\[
\begin{aligned}
 U&=61220092002,\\
 M_0(t)&={t\over2\pi}\log{t\over2\pi e},\\
 R_0(t)&=0.103787\log t+0.257297\log\log t+9.367419,\\
 Z_{\rm finite}&=1+M_0(U)-\tfrac18+R_0(U),\\
 C_Z&=1+\pi^{-1}+2(0.103787+0.257297)+2(9.367419).
                                                               \tag{4.2}
\end{aligned}
\]

Equation (2.17) of `notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md`, applied to a
unit vector in `E_N`, gives

\[
\boxed{
\begin{aligned}
 B_{\rm abs}(\lambda,N)
 ={}&192\sqrt e\,\lambda(1+\log\lambda)^2\\
 &\times\left[Z_{\rm finite}+{C_Z\over\pi}
 \left((\pi+1)\log(H_N+2)+1\right)\right].                 \tag{4.3}
\end{aligned}}
\]

This same constant applies to the complexification of either fixed real
parity sector.  Indeed, write `v=a+i b` with real `a,b` of the same parity.
For every paired sample `s,conjugate(s)`, parity and realness give the
parallelogram identity

\[
 |F_v(s)|^2+|F_v(\overline s)|^2
 =2(|F_a(s)|^2+|F_b(s)|^2).                                \tag{4.4}
\]

The paired real seminorms have the same factor two, so their two estimates
add to `B_abs*(||a||^2+||b||^2)`.  There is no additional factor two.  This
argument is sectorwise; it does not silently identify the two parities.

## 5. The full-`Y` Gram and the explicit failure of scale

Let `L_global` be the corrected global radical synthesis and define

\[
 Y=(I-P_NC_\lambda)L_{\rm global},\qquad
 W=P_NC_\lambda L_{\rm global}.                            \tag{5.1}
\]

For the paired zero-sampling analysis `Z`, exact two-sided radicality gives

\[
 ZL_{\rm global}=0,\qquad ZY=-ZW.                           \tag{5.2}
\]

Consequently the **combined** Gram is preserved before taking norms:

\[
 Y^*Z^*ZY=W^*Z^*ZW.                                        \tag{5.3}
\]

Applying (4.3) to the whole physical vector, not column by column, retains
every coherent cross term.  Equations (3.3) and (5.3) yield

\[
\boxed{
 Y^*Z^*ZY
 \preceq C_{\rm ext}D_{\rm ext},\qquad
 C_{\rm ext}
 \le {B_{\rm abs}\lambda^2\over2d_{\rm LS}}
 ={\lambda^2B_{\rm abs}\over12}
   96^{5+(320\pi/\log2)\lambda^2}.}                        \tag{5.4}
\]

The quotient-alignment theorem then gives only

\[
\boxed{
 C_{\rm ext}M
 \le {B_{\rm abs}\lambda^4\over4d_{\rm LS}^2}.}           \tag{5.5}
\]

This is a genuine unconditional full-`Y` estimate, but it pays the same
inverse defect once in (3.4) and once again in (5.4).  It is therefore the
precise source-explicit form of the generic two-defect-loss obstruction, not
the desired defect-relative theorem

\[
 C_{\rm ext}M=O(d_8^{-1}).                                  \tag{5.6}
\]

The corrected bump need not have exterior norm equal to (3.1), and no such
identity is used: it is retained inside `Y`, while its invisibility keeps
`W` unchanged and (5.2) transfers its zero samples to the compact physical
vector.  No positivity of the Weil form, real-zero list, or global zero
reality enters the proof.

## 6. Independent replay

`src/full_exterior_sampling_fallback.py` evaluates (3.2), (4.1)--(4.3), and
(5.4)--(5.5) from exact rational source parameters.  It serializes exact
dyadic endpoints of outward `mpmath.iv` intervals; decimal strings are
display-only.  The independent replay imports no producer code, re-hashes the
complete source-lock dependency inventory, and reconstructs every
transcendental interval through a separate logarithmic assembly before
checking overlap.  Both paths use `mpmath.iv`; this shared arithmetic library
is an independence limitation.  The analytic inequalities, rather than a
finite point artifact, are the theorem input.

The adversarial tests reject binary64 inputs, loss of the even factor one
half, a changed Fourier sign or unpaired sampling convention, omission of
cross terms, an ordinary inverse on a source kernel, either missing inverse
defect factor, an extra parity factor two, and any promotion of the formal
status.
