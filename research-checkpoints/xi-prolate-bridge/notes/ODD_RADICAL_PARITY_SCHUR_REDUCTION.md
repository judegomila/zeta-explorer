# Odd radical lift and parity-coupled Schur reduction

## 0. Claim boundary and outcome

This note gives two exact finite reductions of the raw-low odd Schur target
in `notes/ODD_LOCKED_HIGH_FESHBACH_REDUCTION.md`.

1. The radical-admissible Möbius lift used for the retained even theorem
   extends to every inversion-odd finite Fourier vector.  It defines a
   canonical odd exterior-tail operator and rewrites the complete all-shift
   odd Schur family as a signed exterior coframe problem.
2. If the same raw Fourier cutoff is used in both parities, the source
   rank-two commutator survives exact high elimination.  The two retained
   Schur complements obey a rank-one rectangular displacement identity.

Neither statement supplies the missing sign.  The reduced parity identity is
not a congruence, and an exact `N=1` Cauchy-displacement model has a positive
even block and a negative odd block.  Thus even retained positivity and the
source commutator alone do not prove odd retained positivity.

For the actual arithmetic matrix, every formula below uses the complete
source-pinned pole--archimedean--prime form.  The pole is negative in the odd
sector, the prime block retains the minus sign of source equation (3.19), and
every prime power through the inclusive endpoint `n<=lambda^2` is retained.
No zero table or global Weil positivity is used.  This note proves neither an
odd floor on an unbounded schedule, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, nor the
Riemann hypothesis.  The formal project state remains `P0_INVALIDATED`.

## 1. Source conventions and the odd sign

Fix `lambda>1`, put `L=2 log(lambda)`, and use the centered logarithmic
interval

\[
 I=[-L/2,L/2]
\]

with Lebesgue measure and zero extension.  Multiplicatively the interval is
`I_lambda=[lambda^(-1),lambda]` with measure `du/u`.  Inversion is

\[
 (Jv)(x)=v(-x),\qquad (Jv)^\times(u)=v^\times(u^{-1}).       \tag{1.1}
\]

The locked Fourier transform is

\[
 \widehat v(z)=\int_I v(x)e^{-izx}\,dx.                   \tag{1.2}
\]

On the inversion sectors, the exact pole form is

\[
 P_\epsilon(f,g)
 =2\epsilon\,\overline{\widehat f(i/2)}\widehat g(i/2),
 \qquad \epsilon\in\{+1,-1\}.                           \tag{1.3}
\]

Thus, with `p_-(x)=sinh(x/2)`, the odd pole is

\[
 \boxed{P_-=-2|p_-\rangle\langle p_-|.}                  \tag{1.4}
\]

The nonpole real-axis multiplier is

\[
 2\theta'(t)-2\sum_{1<n\leq\lambda^2}
       {\Lambda(n)\over\sqrt n}\cos(t\log n),            \tag{1.5}
\]

so (1.5) keeps the source minus-prime sign before any estimate is made.
All operators below are compressions of this complete signed form.

## 2. The Möbius lift works in the odd sector

Let `V=E_N^-` and let `v in V`.  In multiplicative coordinates put

\[
 v^\times(u)=v(\log u),\qquad u\in I_\lambda.             \tag{2.1}
\]

On the visible positive source interval define

\[
 r_v(x)=\sum_{n\leq\lambda/x}\mu(n)
       {v^\times(nx)\over\sqrt{nx}},
 \qquad \lambda^{-1}\leq x\leq\lambda,                  \tag{2.2}
\]

and extend it additively evenly:

\[
 r_v^{\rm ev}(x)
 =1_{\{\lambda^{-1}\leq|x|\leq\lambda\}}r_v(|x|).       \tag{2.3}
\]

Choose an even
`chi in C_c^infinity({1/4<|x|<3/4})` with full-line integral one, and set

\[
 \chi_\lambda(x)=\lambda\chi(\lambda x),\qquad
 j_v=\int_{\mathbb R}r_v^{\rm ev}(x)\,dx,\qquad
 f_v=r_v^{\rm ev}-j_v\chi_\lambda.                       \tag{2.4}
\]

The full-line integral in `j_v` is mandatory.  Using only the positive half
would miss a factor two.

Let

\[
 (\mathcal A_\lambda f)(u)
 =\sqrt u\sum_{m\leq\lambda/u}f(mu),\qquad
 (\mathcal E f)(u)=u^{1/2}\sum_{m\geq1}f(mu),             \tag{2.5}
\]

and put `S_-=(I-J)/2`.

### Theorem 2.1 (odd radical-admissible right inverse)

The source `f_v` is additive-even, compactly supported, piecewise `C^1`, and
of bounded variation.  It is zero near the origin and satisfies

\[
 f_v(0)=0,\qquad f_v(x)=O(x^2),\qquad
 \int_{\mathbb R}f_v(x)\,dx=0.                           \tag{2.6}
\]

Moreover,

\[
 \boxed{\mathcal A_\lambda f_v=v^\times.}                \tag{2.7}
\]

Consequently

\[
 K_v=S_-\mathcal E(f_v),\qquad R_v=K_v-\widetilde v      \tag{2.8}
\]

satisfy

\[
 \boxed{C_\lambda K_v=v,\qquad
        R_v=(1-C_\lambda)K_v.}                           \tag{2.9}
\]

Here `widetilde v` denotes the zero extension of `v` to the full
multiplicative line.  The vector `K_v` lies in the two-sided global Weil
radical, without any assumption that the zero parameters are real.

**Proof.**  The support of `chi_lambda` is contained in

\[
 {1\over4\lambda}<|x|<{3\over4\lambda},
\]

whereas every sample in (2.5) has `mu>=lambda^(-1)`.  The correction is
therefore exactly invisible to `mathcal A_lambda`.  Finite divisor
convolution gives, for `u in I_lambda`,

\[
\begin{aligned}
 \mathcal A_\lambda(r_v^{\rm ev})(u)
 &=\sum_{k\leq\lambda/u}{v^\times(ku)\over\sqrt k}
       \sum_{n\mid k}\mu(n)\\
 &=v^\times(u),
\end{aligned}                                             \tag{2.10}
\]

which proves (2.7).  Equation (2.4) gives zero full-line integral, and the
finite breakpoints `x=lambda/n` give bounded variation.  The central hole
makes `f_v` identically zero near zero, proving (2.6).

Restriction commutes with inversion.  Since `v` is inversion odd,

\[
 C_\lambda K_v=S_-\mathcal A_\lambda f_v=S_-v=v,          \tag{2.11}
\]

which proves (2.9).

The BV Mellin lemma applies to `f_v`.  At a nontrivial-zero parameter `s`,
the Mellin transform of `mathcal E(f_v)` vanishes at both `s` and `-s`
(and at the two conjugate evaluations): the zeta factors are respectively
`zeta(1-rho)` and `zeta(rho)`.  Inversion interchanges these two
evaluations.  Hence both `mathcal E(f_v)` and
`S_-mathcal E(f_v)` lie in the two-sided radical.  No reality of `s` was
used.  \(\square\)

The additive-even source in (2.3) is not an assumption that the physical
state is inversion even.  Additive source parity is imposed before the
arithmetic map; physical inversion parity is imposed afterward by `S_-`.
This distinction is why the same source lift serves both physical sectors.

## 3. Canonical odd exterior-tail operator

Let `mathcal L^-` be any fixed finite odd observation space contained in
`V`; below it will be the raw low Fourier space.  For `u in mathcal L^-` and
`v in V`, define

\[
 \langle u,T_{\rm ext}^-v\rangle
 =\mathcal W_Z(u,R_v).                                  \tag{3.1}
\]

### Theorem 3.1 (odd exterior cancellation)

The polarized zero-sampling series in (3.1) is canonically defined and

\[
 \boxed{
 \mathcal W_Z(u,v)=-\mathcal W_Z(u,R_v),
 \qquad
 T_{\rm ext}^-=-P_{\mathcal L^-}Q_-|_V.}                 \tag{3.2}
\]

The right side of (3.1) is independent of the chosen radical-admissible
global lift with compact restriction `v`.

**Proof.**  At every zero evaluation, radicality of
`K_v=widetilde v+R_v` gives
`R_v=-v`.  Compact finite-Fourier BV transforms are
`O((1+|gamma|)^(-1))` uniformly in the critical strip.  The classical zero
count therefore makes the polarized compact series absolutely convergent,
and termwise cancellation proves the first identity in (3.2).

Two admissible lifts with the same compact restriction differ by a global
radical with zero restriction.  Its pairing with `u` vanishes.  Finally the
finite compact Weil pairing is exactly the source matrix pairing, giving the
operator identity in (3.2).  No Weil distribution is applied directly to a
noncompact exterior vector.  \(\square\)

The sign audit is worth making explicit.  In the odd sector, `Q_-` contains
the negative pole (1.4) and the minus-prime block (1.5).  Thus
`T_ext^-=-P_L Q_-` contains their opposite signs, but the Schur formula below
uses `-T_ext^-`; it restores exactly the negative pole and source
minus-prime sign.

## 4. Exact all-shift odd coframe criterion

Put

\[
 B_-=Q_--UI                                                    \tag{4.1}
\]

on `E_N^-`, where `U` is the live nonnegative Ritz upper shift (the quantity
called `beta` in the odd high-Feshbach note).  Use the raw decomposition

\[
 E_N^-=\mathcal L^-\oplus\mathcal F^-,\qquad
 B_-=
 \begin{bmatrix}A_-&C_-^*\\ C_-&H_-\end{bmatrix},
 \qquad H_-\succ0.                                      \tag{4.2}
\]

At the honest high-coercivity cutoff, `H_->0` is already proved.  For
`sigma>=0`, define

\[
 \mathsf E_\sigma^-y
 =\left(y,-(H_-+\sigma I)^{-1}C_-y\right),               \tag{4.3}
\]

\[
 \Sigma_\sigma^-
 =A_-+\sigma I-C_-^*(H_-+\sigma I)^{-1}C_-.             \tag{4.4}
\]

Block multiplication and (3.2) give

\[
 (B_-+\sigma I)\mathsf E_\sigma^-y
 =i_-\Sigma_\sigma^-y,                                  \tag{4.5}
\]

\[
 \boxed{
 \Sigma_\sigma^-
 = (\sigma-U)I-T_{\rm ext}^-\mathsf E_\sigma^-.}        \tag{4.6}
\]

Here `i_-:mathcal L^- -> E_N^-` is the inclusion.

Let `Delta_->0` be any fixed positive source-defined metric on `E_N^-` and
put

\[
 \mathcal D_\sigma^-
 =\left((\mathsf E_\sigma^-)^*\Delta_-^2
                    \mathsf E_\sigma^-\right)^{1/2}.     \tag{4.7}
\]

Define the exact odd exterior coframe constant

\[
 \boxed{
 \vartheta_-
 =\inf_{\substack{\sigma\geq0\\y\ne0}}
 {\|(\sigma-U)y-T_{\rm ext}^-\mathsf E_\sigma^-y\|
  \over
  \|\Delta_-\mathsf E_\sigma^-y\|}.}                   \tag{4.8}
\]

### Theorem 4.1 (odd sign equals the odd exterior coframe)

For every fixed finite parameter for which `H_->0`, one has

\[
 \boxed{
 \vartheta_->0
 \quad\Longleftrightarrow\quad
 B_-=Q_--UI\succ0
 \quad\Longleftrightarrow\quad
 \Sigma_0^-\succ0.}                                     \tag{4.9}
\]

Moreover, with a singular shifted matrix assigned the extended inverse norm
`+infinity`, the optimal constant satisfies

\[
 \boxed{
 \vartheta_-^{-1}
 =\sup_{\sigma\geq0}
 \|\Delta_-(B_-+\sigma I)^{-1}i_-\|.}                   \tag{4.10}
\]

**Proof.**  Whenever the inverses exist, (4.5) gives

\[
 (B_-+\sigma I)^{-1}i_-
 =\mathsf E_\sigma^-(\Sigma_\sigma^-)^{-1}.             \tag{4.11}
\]

Thus (4.8) and (4.10) are the same optimal singular-value statement.

If `B_->0`, then every `B_-+sigma I` and every `Sigma_sigma^-` is positive.
The quotient in (4.8) is continuous on compact `sigma` intervals and on the
unit sphere.  Uniformly as `sigma->infinity`,

\[
 \Sigma_\sigma^-=\sigma I+A_-+O(\sigma^{-1}),\qquad
 \mathsf E_\sigma^-=(I,O(\sigma^{-1})),                  \tag{4.12}
\]

so the quotient tends to infinity.  Its global infimum is therefore
positive.

Conversely, if `B_-` is not positive, take
`sigma_0=max(0,-lambda_min(B_-))`.  Then
`B_-+sigma_0 I` is singular while `H_-+sigma_0 I>0`.
Schur elimination makes `Sigma_(sigma_0)^-` singular, and (4.6) makes the
quotient in (4.8) zero.  The last equivalence in (4.9) is ordinary Schur
complementation of `H_-`.  \(\square\)

Taking `Delta_-=I` gives the smallest sign-only target.  A stronger metric
may be useful for a later inverse estimate, but no choice of positive metric
changes the equivalence (4.9).

The exact weighted-PNT normal form gives a cancellation-preserving arithmetic
version.  Let

\[
 W(X)=\sum_{1<n\leq X}{\Lambda(n)\over\sqrt n},
 \qquad
 (K_tw)(x)=\widetilde w(x+t)+\widetilde w(x-t),           \tag{4.13}
\]

where `widetilde w` is the zero extension of `w`.  With

\[
 C_{u,w}(t)=\langle u,K_t w\rangle,\qquad
 D_\lambda(t)=W(e^t)-2(e^{t/2}-1),                       \tag{4.14}
\]

`D_lambda(0)=0` and `C_(u,w)(L)=0`.  The complete source identity
`Q=c_*I+A_tail-T_D`, including its already-cancelled pole and continuous
prime density, yields

\[
\begin{aligned}
 \vartheta_-
 =\inf_{\substack{\sigma\geq0\\y\ne0}}
 \sup_{\substack{u\in\mathcal L^-\\\|u\|=1}}
 {1\over\|\Delta_-\mathsf E_\sigma^-y\|}
 \Bigg|{}&(c_*+\sigma-U)\langle u,y\rangle
 +\mathfrak a_{\rm tail}(u,\mathsf E_\sigma^-y)\\
 &+\int_0^L D_\lambda(t)
       {d\over dt}C_{u,\mathsf E_\sigma^-y}(t)\,dt
 \Bigg|.                                                \tag{4.15}
\end{aligned}
\]

The integral has a plus sign because
`T_D=int C dD=-int D C'`, whereas `Q=c_*I+A_tail-T_D`.
The prime inventory remains inclusive at `n=lambda^2` even though the
endpoint correlation vanishes.  Formula (4.15) is an exact restatement of
the odd Schur family, not a lower bound for it.

## 5. The source commutator survives high elimination

Use the normalized parity bases

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2},\qquad
 e_n^-={V_n-V_{-n}\over\sqrt2}.                         \tag{5.1}
\]

Let

\[
 \mathcal D e_0^+=0,\qquad \mathcal D e_n^+=n e_n^-     \tag{5.2}
\]

be the plus-to-minus mode map.  The exact source Cauchy form gives

\[
 \boxed{
 \mathcal D(Q_+-UI)-(Q_--UI)\mathcal D
 =|\boldsymbol b\rangle\langle\eta|,}                   \tag{5.3}
\]

where

\[
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \boldsymbol b=\sum_{|n|\leq N}b_nV_n.                 \tag{5.4}
\]

The scalar shift cancels from (5.3).

Fix `1<=M<N` and use the same raw cutoff in both parities:

\[
\begin{array}{ll}
 \mathcal L^+=\operatorname {span}\{e_0^+,\ldots,e_M^+\},
 &\mathcal F^+=\operatorname {span}\{e_{M+1}^+,\ldots,e_N^+\},\\
 \mathcal L^-=\operatorname {span}\{e_1^-,\ldots,e_M^-\},
 &\mathcal F^-=\operatorname {span}\{e_{M+1}^-,\ldots,e_N^-\}.
\end{array}                                               \tag{5.5}
\]

Thus

\[
 \dim\mathcal L^+=M+1,\quad \dim\mathcal L^-=M,
 \quad \dim\mathcal F^+=\dim\mathcal F^-=N-M.          \tag{5.6}
\]

Write `mathcal D_L` and `mathcal D_H` for the corresponding diagonal blocks
of `mathcal D`.  In particular `mathcal D_L` is surjective with kernel
`C e_0^+`, while `mathcal D_H` is invertible.

Write the two complete shifted matrices as

\[
 B_\pm=Q_\pm-UI
 =\begin{bmatrix}A_\pm&C_\pm^*\\C_\pm&H_\pm\end{bmatrix},
 \qquad H_\pm\succ0,                                    \tag{5.7}
\]

and set

\[
 \Sigma_\pm=A_\pm-C_\pm^*H_\pm^{-1}C_\pm.             \tag{5.8}
\]

Split the source vectors as

\[
 \boldsymbol b=\boldsymbol b_L+\boldsymbol b_H,
 \qquad \eta=\eta_L+\eta_H,                            \tag{5.9}
\]

and define their high-shorted representatives

\[
 \widetilde{\boldsymbol b}_-
 =\boldsymbol b_L-C_-^*H_-^{-1}\boldsymbol b_H,
 \qquad
 \widetilde\eta_+
 =\eta_L-C_+^*H_+^{-1}\eta_H.                           \tag{5.10}
\]

### Theorem 5.1 (rank-one parity-coupled Schur displacement)

Under (5.3)--(5.10),

\[
 \boxed{
 \mathcal D_L\Sigma_+-\Sigma_-\mathcal D_L
 =|\widetilde{\boldsymbol b}_-\rangle
       \langle\widetilde\eta_+|.}                      \tag{5.11}
\]

More precisely, if

\[
 \mathsf E_+y=(y,-H_+^{-1}C_+y),\qquad
 \mathsf E_-z=(z,-H_-^{-1}C_-z),                        \tag{5.12}
\]

then

\[
 \boxed{
 \mathcal D\mathsf E_+y
 =\mathsf E_-\mathcal D_Ly
 -i_{\mathcal F^-}H_-^{-1}\boldsymbol b_H
      \langle\widetilde\eta_+,y\rangle.}               \tag{5.13}
\]

**Proof.**  Apply (5.3) to the plus harmonic lift.  Since

\[
 B_+\mathsf E_+y=i_{\mathcal L^+}\Sigma_+y,
 \qquad
 \langle\eta,\mathsf E_+y\rangle
 =\langle\widetilde\eta_+,y\rangle,                    \tag{5.14}
\]

one obtains

\[
 B_-\mathcal D\mathsf E_+y
 =i_{\mathcal L^-}\mathcal D_L\Sigma_+y
 -\boldsymbol b\langle\widetilde\eta_+,y\rangle.       \tag{5.15}
\]

The low component of `mathcal D E_+y` is `mathcal D_Ly`.  Subtract
`mathsf E_-mathcal D_Ly`; the difference is purely high.  The high row of
(5.15), together with `H_->0`, makes that difference exactly the last term
of (5.13).

Now take the low row of (5.15) and insert (5.13).  It gives

\[
 \Sigma_-\mathcal D_Ly
 -C_-^*H_-^{-1}\boldsymbol b_H
       \langle\widetilde\eta_+,y\rangle
 =\mathcal D_L\Sigma_+y
 -\boldsymbol b_L\langle\widetilde\eta_+,y\rangle,
\]

which is (5.11).  \(\square\)

If

\[
 y\longmapsto
 \left(\langle\widetilde\eta_+,y\rangle,
       \mathcal D_Ly\right)                             \tag{5.16}
\]

is an isomorphism (equivalently
`<widetilde eta_+,e_0^+>!=0`), then (5.11) puts `Sigma_+` in block upper-row
coordinates whose lower row is exactly

\[
 [\,\widetilde{\boldsymbol b}_-\quad\Sigma_-\,].         \tag{5.17}
\]

This is a similarity-coordinate quotient relation, not a Hermitian
congruence.  It gives a relative determinant identity after one more scalar
Schur complement, but it does not transfer inertia or positivity.

## 6. Minimal exact-Cauchy obstruction to sign transfer

The failure of sign transfer already occurs for `N=1`, where there is no
high block and the retained Schur complements are the parity blocks
themselves.  In the source Cauchy form choose

\[
 b_{-1}=-1,\qquad b_0=0,\qquad b_1=1,
 \qquad a_{-1}=a_1=0,\qquad a_0=10.                    \tag{6.1}
\]

In the ordered complex basis `(V_(-1),V_0,V_1)`,

\[
 Q_{nm}=\begin{cases}
 a_n,&n=m,\\[1mm]
 (b_n-b_m)/(n-m),&n\ne m
 \end{cases}
 =\begin{bmatrix}
 0&1&1\\
 1&10&1\\
 1&1&0
 \end{bmatrix}.                                         \tag{6.2}
\]

This real Hermitian matrix commutes with inversion and has the exact source
rank-two Cauchy displacement.  In the parity bases,

\[
 Q_+=\begin{bmatrix}10&\sqrt2\\\sqrt2&1\end{bmatrix},
 \qquad Q_-=[-1].                                      \tag{6.3}
\]

The even block is positive because its leading minor is `10` and its
determinant is `8`; the odd block is strictly negative.  Moreover,

\[
 \mathcal D_L=[0\ \ 1],\qquad
 \boldsymbol b=\sqrt2e_1^-,\qquad
 \eta=e_0^++\sqrt2e_1^+,                               \tag{6.4}
\]

and directly

\[
 \mathcal D_LQ_+-Q_-\mathcal D_L
 =[\sqrt2\ \ 2]
 =|\sqrt2e_1^-\rangle
   \langle e_0^++\sqrt2e_1^+|.                         \tag{6.5}
\]

Thus even strict positivity plus the exact rank-one parity displacement does
not imply odd positivity.  This is a structural Cauchy model, not the
arithmetic Weil matrix; it changes no conclusion about the actual signed
prime inventory.  Its role is only to prove that a sign argument must use
additional arithmetic information beyond (5.11).

## 7. Exact remaining odd theorem

For the locked odd high-Feshbach setup, take `mathcal L^-` to be the raw low
space in equation (2.22) of
`notes/ODD_LOCKED_HIGH_FESHBACH_REDUCTION.md`, `U=U_Z`, and `H_-=H_0`.
Then the previously open condition

\[
 \Sigma_0\succ0                                           \tag{7.1}
\]

is exactly either of the following:

\[
 \boxed{\vartheta_->0}                                   \tag{7.2}
\]

for the actual odd exterior-tail coframe (4.8), or injectivity of every
all-shift signed operator in (4.6), followed by the large-shift homotopy.
Equation (4.15) is the cancellation-preserving prime-side version.

The parity displacement (5.11) can transfer any future source-specific
estimate between the two retained systems while paying only one explicit
shorted boundary/source direction.  It cannot create the required sign.
The remaining analytic input must orient the actual signed discrepancy on
all retained odd directions, not merely on the favorable pole direction and
not merely through an absolute PNT envelope.
