# Prescribed residue coframe, analytic-intersection, and shell-rate audit

## 0. Status and claim boundary

Claim class: `PRESCRIBED_RESIDUE_COFRAME_AUDIT`.

This note audits the actual residue-separated arithmetic--prolate source
families.  It proves four limited statements.

1. It records the exact determinant and normalized adjoint-tail criteria for
   the prescribed `0 mod 4` plus family and `2 mod 4` minus family.
2. It proves that the image of any finite analytic source inventory has
   trivial intersection with every finite-dimensional space of physical
   functions analytic across the unmatched breakpoint.  This yields a
   fixed-`lambda` principal-angle obstruction to replacing the required
   shell estimate by qualitative projection convergence.
3. It gives a necessary principal-angle inequality when both the declared
   shell and the projection tail are controlled relative to one source
   metric.
4. It proves that the currently locked periodic-BV certificate is too large
   to satisfy the required `epsilon/gamma=o(1/lambda)` rate on the central
   cutoff, independently of how favorable the compatible certified low
   floor is.

The fourth statement invalidates only the **current BV upper-bound
certificate**.  It is not a lower bound for the actual optimized shell
tangent.  Likewise, the analytic-intersection theorem is a fixed-inventory
statement; it supplies no uniform lower bound for the principal angle as
`lambda` grows.

This note proves neither prescribed one-residue map onto, nor proves that
either one fails to be onto after a declared finite Fourier projection.  It
proves no signed sector floor, residual estimate, shifted-resolvent bound,
equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
convergence, or Riemann-hypothesis conclusion.  The repository state remains
`P0_INVALIDATED`.

The conventions and prior results used below are locked in:

- `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md`;
- `notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md`;
- `notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md`;
- `notes/PHYSICAL_MAP_CONDITIONING_REDUCTION.md`;
- `notes/GROWING_WINDOW_THEOREM.md`;
- `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md`;
- `notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md`; and
- `notes/COVARIANCE_TANGENT_GRAPH_SPILL.md`.

## 1. Prescribed residue families and physical maps

Use the locked half-integer schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad L=2\log\lambda.                                  \tag{1.1}
\]

On the source interval `[-lambda,lambda]`, use Lebesgue measure, zero
extension, and the orthonormal even prolate modes `h_(n,lambda)`.  Put

\[
 I_n=\int_{-\lambda}^{\lambda}h_{n,\lambda}(x)\,dx.       \tag{1.2}
\]

On the physical interval

\[
 I_\lambda=[\lambda^{-1},\lambda],
 \qquad \mathcal G=L^2(I_\lambda,du/u),                  \tag{1.3}
\]

the arithmetic map and inversion projections are

\[
 (A_\lambda f)(u)=\sqrt u\sum_{m\leq\lambda/u}f(mu),
 \qquad (Jg)(u)=g(u^{-1}),
 \qquad S_\sigma={I+\sigma J\over2}.                    \tag{1.4}
\]

The plus raw residue space and its zero-integral part have the form

\[
 E_+=\operatorname {span}\{h_0,h_4,h_8,\ldots\},
 \qquad F_+=E_+\cap1^\perp,                              \tag{1.5}
\]

with the declared finite strict endpoint imposed when a finite inventory is
used.  The anchor and the remaining zero-integral columns are

\[
 c_4=h_4-{I_4\over I_0}h_0,
 \qquad c_t=h_t-{I_t\over I_0}h_0,
 \qquad t\in\{8,12,16,\ldots\}.                         \tag{1.6}
\]

After physical anchor deflation, the exact source columns are

\[
 \widetilde c_t=h_t-\alpha_t h_4+b_t h_0,
 \qquad b_t=-{I_t\over I_0}+{I_4\over I_0}\alpha_t,     \tag{1.7}
\]

and their source Gram is

\[
 B_+=I+\alpha\alpha^*+bb^*.                              \tag{1.8}
\]

The minus raw residue space and zero-integral columns are

\[
 E_-=\operatorname {span}\{h_2,h_6,h_{10},\ldots\},
 \qquad F_-=E_-\cap1^\perp,                              \tag{1.9}
\]

\[
 c_t^-=-h_t+{I_t\over I_2}h_2,
 \qquad t\in\{6,10,14,\ldots\},                        \tag{1.10}
\]

with exact source Gram

\[
 B_-=I+aa^*,\qquad a_t={I_t\over I_2}.                  \tag{1.11}
\]

These are source normalizations, not optional coordinate choices.  In
particular, neither Gram may be replaced by the identity.

For one inversion parity and one finite physical target `X`, define the
full-source operator

\[
 T=P_XS_\sigma A_\lambda:
 \mathcal H_0^{\rm ev}\longrightarrow X,                \tag{1.12}
\]

where

\[
 \mathcal H_0^{\rm ev}
 =\{f\in L^2[-\lambda,\lambda]:f(-x)=f(x),\ \langle1,f\rangle=0\}.
                                                                    \tag{1.13}
\]

For a prescribed finite synthesis `C`, put

\[
 D=C^*C,\qquad F=\operatorname {ran}C,\qquad W=TC,
 \qquad R=TT^*.                                         \tag{1.14}
\]

## 2. Exact coframe and determinant criteria

The full-source right inverse proves

\[
 {1\over2\lambda^2M_\mu(\lambda)^2}I_X
 \preceq R\preceq{\lambda^2\over2}I_X,
 \qquad
 M_\mu(\lambda)=
 \sum_{n\leq\lfloor\lambda^2\rfloor}{|\mu(n)|\over\sqrt n}
 \leq2\lambda.                                         \tag{2.1}
\]

In particular,

\[
 R\succeq{1\over8\lambda^4}I_X.                        \tag{2.2}
\]

This is a theorem for the full even zero-integral source space.  The exact
finite-restriction identity is instead

\[
 TP_FT^*=WD^\dagger W^*.                                \tag{2.3}
\]

Put

\[
 Z=R^{-1/2}T,\qquad ZZ^*=I_X,
 \qquad \mathcal L_F=Z(I-P_F)Z^*.                       \tag{2.4}
\]

Then

\[
 \boxed{
 R^{-1/2}WD^\dagger W^*R^{-1/2}=I_X-\mathcal L_F,}      \tag{2.5}
\]

and hence

\[
 \boxed{
 \operatorname {ran}W=X
 \quad\Longleftrightarrow\quad
 \|\mathcal L_F\|<1.}                                  \tag{2.6}
\]

More quantitatively, for `0<gamma<=1`,

\[
 \boxed{
 WD^\dagger W^*\succeq\gamma R
 \quad\Longleftrightarrow\quad
 \|\mathcal L_F\|\leq1-\gamma.}                       \tag{2.7}
\]

Thus the full-source constant (2.2) survives the finite restriction only
after a strictly positive relative reserve has been proved.  Full-source
surjectivity by itself supplies no such reserve.

At matched Fourier bandwidth, the smallest current qualitative one-residue
tests are the actual physical determinants from Section 8 of
`notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md`:

\[
 D_+(p)=\det\left[
  \langle\psi_n^+,A_\lambda c_{4j}\rangle
 \right]_{0\leq n\leq N,\ 1\leq j\leq N+1},            \tag{2.8}
\]

where the source labels are `4,8,...,4N+4`, and

\[
 D_-(p)=\det\left[
  \langle\psi_n^-,A_\lambda c_{4j+2}^-\rangle
 \right]_{1\leq n\leq N,\ 1\leq j\leq N}.            \tag{2.9}
\]

Nonvanishing of (2.8) is equivalent to a nonzero plus anchor followed by
span of its exact deflated complement.  Nonvanishing of (2.9) is equivalent
to odd row span.  A quantitative certificate must source-whiten with
(1.8) or (1.11) and target-whiten with `R`, as in Theorem 3.1 of
`notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md`.

No locked theorem proves (2.8) or (2.9) nonzero on an unbounded sequence of
locked half-integers.  The Andreief formulas in
`notes/SOFT_DEFECT_PROLATE_ANGLE_REDUCTION.md` do not supply a sign proof:
the sparse prolate Slater systems have too many sign changes to be ordinary
Chebyshev systems, and the arithmetic rows have both smooth cell pieces and
arithmetic jumps.

## 3. Why the full-source, Mobius, and jump-jet facts do not imply a residue coframe

The explicit full-source right inverse begins, on the visible positive
source interval, with

\[
 (R_\lambda g)(x)=
 \sum_{n\leq\lambda/x}\mu(n){g(nx)\over\sqrt{nx}}.       \tag{3.1}
\]

It satisfies

\[
 A_\lambda R_\lambda g=g,
 \qquad
 \|R_\lambda g\|_2\leq M_\mu(\lambda)\|g\|_\mathcal G. \tag{3.2}
\]

Evenization and removal of its integral on the central hole give the full
zero-integral right inverse used in (2.1).  At every visible breakpoint

\[
 x_n={\lambda\over n},\qquad \mu(n)\ne0,                \tag{3.3}
\]

the one-sided jump is exactly

\[
 \boxed{
 R_\lambda g(x_n^-)-R_\lambda g(x_n^+)
 =\mu(n){g(\lambda)\over\sqrt\lambda}.}                 \tag{3.4}
\]

Every finite prolate span is analytic on the source interval.  Thus, when
`g(lambda)!=0`, the particular lift (3.1) is not contained in either finite
residue inventory, or in any finite mixed analytic prolate inventory.  More
importantly, the norm bound (3.2) contains no estimate of

\[
 \|(I-P_{F_\sigma})Z^*\|,                               \tag{3.5}
\]

which is the quantity that occurs in (2.5)--(2.7).  Projecting (3.1) into a
residue space changes its physical image, and no locked estimate controls
that change at the required relative scale.

The exact arithmetic-adjoint jump formula also does not repair this gap.
For the centered Fourier row `K_n` and the breakpoint `y_m=m/lambda`,

\[
 [K_n^{(r)}]_{y_m}
 =\sqrt{\lambda\over L}{(-\lambda)^r\over m^{r+1}}
   \left({1\over2}+i\omega_n\right)_r.                  \tag{3.6}
\]

Suitable derivative orders give nonzero confluent Vandermonde determinants
in both physical parities.  These are local continuous-function data, not
the determinants (2.8)--(2.9).  The exact countermodel in Section 8 of
`notes/MATCHED_BREAKPOINT_DIRECTIONAL_MOMENT_AUDIT.md` retains an identity
jump-jet matrix while every declared finite Fourier projection is zero:

\[
 h_j=(I-P_{N,\sigma})q_j,
 \qquad [h_j^{(r_k)}]_\tau=\delta_{jk},
 \qquad P_{N,\sigma}h_j=0.                              \tag{3.7}
\]

Likewise, the finite model in Section 10.1 of
`notes/MATCHED_HIGH_MOMENT_COFRAME_REDUCTION.md` has a full-source onto map,
a continuously injective augmentation, and at least as many selected
columns as physical rows, while the selected physical range is exactly
`p^perp`.  These models do not disprove the actual prolate determinants.
They prove that the full-source constants, counts, continuous injectivity,
and jump jets do not imply their nonvanishing.

There is a separate shell obstruction to inference.  In the exact model

\[
 P_M=|e_0\rangle\langle e_0|,
 \qquad W=e_0+A e_1,
 \qquad \mathsf H=1,                                    \tag{3.8}
\]

the raw low coframe floor is one, but the unique graph lift has shell spill
`A^2`.  Thus even a perfect low floor does not imply a relative shell rate.

## 4. An unmatched-breakpoint analytic-intersection theorem

The following theorem is an actual property of the locked arithmetic map,
not an abstract countermodel.

### Theorem 4.1 (finite analytic ranges miss analytic physical features)

Let `lambda=p/2` with odd `p>=5`.  Let `mathcal F` be any finite-dimensional
source space whose elements are analytic on `[-lambda,lambda]`, and let

\[
 \mathcal K_\sigma=S_\sigma A_\lambda\mathcal F
 \subset L^2(I_\lambda,du/u).                            \tag{4.1}
\]

Let `mathcal Q` be any finite-dimensional physical space whose elements are
analytic in `u` on a neighborhood of

\[
 u_0={\lambda\over2}.                                   \tag{4.2}
\]

Then

\[
 \boxed{\mathcal K_\sigma\cap\mathcal Q=\{0\}.}        \tag{4.3}
\]

**Proof.**  For `u` in a sufficiently small neighborhood of `u_0`, the two
analytic branches of the forward arithmetic state differ by exactly the
term which enters or leaves at index two:

\[
 (A_\lambda f)_-(u)-(A_\lambda f)_+(u)
 =\sqrt u\,f(2u).                                      \tag{4.4}
\]

The reflected state `A_lambda f(u^(-1))` has a breakpoint at `u_0` only if

\[
 {2\over\lambda}={\lambda\over m}
 \quad\text{for some integer }m,
 \quad\text{equivalently}\quad
 m={\lambda^2\over2}.                                  \tag{4.5}
\]

For `lambda=p/2`, this last number is `p^2/8`, which is not an integer
because an odd square is one modulo eight.  Hence the reflected state has
one analytic branch across `u_0`.  The two branches of the parity projection
therefore differ by

\[
 (S_\sigma A_\lambda f)_-(u)
 -(S_\sigma A_\lambda f)_+(u)
 ={1\over2}\sqrt u\,f(2u).                             \tag{4.6}
\]

Suppose `S_sigma A_lambda f=q` almost everywhere for `q in mathcal Q`.
Equality of analytic functions on each side makes the two branch
continuations equal to the single analytic continuation of `q`.  Equation
(4.6) then vanishes identically on a one-sided neighborhood of `u_0`.
Thus `f` vanishes on an interval adjacent to `lambda`, and analyticity gives
`f=0`.  Consequently `q=0`, proving (4.3).  `square`

Every finite raw, zero-integral, or anchor-deflated prolate inventory meets
the hypothesis on `mathcal F`.  The physical Legendre features used in the
central covariance reduction are polynomials in `log u`; they are analytic
in `u>0`, so they meet the hypothesis on `mathcal Q`.

Because both spaces in (4.3) are finite-dimensional, the smallest
principal-angle sine

\[
 \boxed{
 a_{\lambda,\sigma}(\mathcal F,\mathcal Q)
 :=\inf_{\substack{q\in\mathcal Q\\\|q\|=1}}
       \|(I-P_{\mathcal K_\sigma})q\|}                 \tag{4.7}
\]

is strictly positive at each fixed `lambda` and fixed inventory.
Theorem 4.1 gives no effective lower bound for (4.7), and the inventory
itself grows with `lambda` in the prescribed application.  Therefore it
does not prove that (4.7) stays away from zero on an asymptotic schedule.

## 5. Principal-angle necessity for shell plus projection control

The fixed-`lambda` angle becomes operational only when the complete tail of
the physical source range is controlled.  Let

\[
 V=S_\sigma A_\lambda C:\mathbb C^q\longrightarrow\mathcal G,
 \qquad \mathcal K=\operatorname {ran}V,                \tag{5.1}
\]

and let `mathsf H=mathsf H^*>0` be a source-coordinate metric.  For centered
physical Fourier projections `P_M<=P_N`, put

\[
 B=P_MV,qquad E=(P_N-P_M)V,qquad F_N=(I-P_N)V.          \tag{5.2}
\]

Set

\[
 R_{\mathsf H}=B\mathsf H^{-1}B^*,
 \qquad P_R=\mathbf1_{(0,\infty)}(R_{\mathsf H}).       \tag{5.3}
\]

Assume

\[
 P_M\mathcal Q\subseteq\operatorname {ran}R_{\mathsf H},
 \qquad
 R_{\mathsf H}\succeq\gamma P_R,
 \qquad \gamma>0,                                      \tag{5.4}
\]

and assume the two relative tail bounds

\[
 E^*E\preceq\epsilon\mathsf H,
 \qquad
 F_N^*F_N\preceq\zeta\mathsf H.                         \tag{5.5}
\]

Define the feature Fourier tail

\[
 \tau_M(\mathcal Q)=\|(I-P_M)P_\mathcal Q\|.           \tag{5.6}
\]

### Theorem 5.1 (principal-angle lower condition)

Under (5.4)--(5.5),

\[
 \boxed{
 {\epsilon+\zeta\over\gamma}
 \geq
 \left(a_{\lambda,\sigma}(\mathcal F,\mathcal Q)
       -\tau_M(\mathcal Q)\right)_+^2.}                \tag{5.7}
\]

**Proof.**  For a unit vector `q in mathcal Q`, the minimum-`mathsf H` lift

\[
 y=\mathsf H^{-1}B^*R_{\mathsf H}^\dagger P_Mq         \tag{5.8}
\]

satisfies `By=P_Mq` and

\[
 \langle y,\mathsf H y\rangle
 =\langle P_Mq,R_{\mathsf H}^\dagger P_Mq\rangle
 \leq\gamma^{-1}\|P_Mq\|^2
 \leq\gamma^{-1}.                                     \tag{5.9}
\]

The shell and beyond-`N` ranges are orthogonal, so (5.5) gives

\[
 \|(I-P_M)Vy\|^2
 =\|Ey\|^2+\|F_Ny\|^2
 \leq(\epsilon+\zeta)\langle y,\mathsf H y\rangle.     \tag{5.10}
\]

Since the low projections of `q` and `Vy` agree,

\[
 \begin{aligned}
 a_{\lambda,\sigma}
 &\leq\|(I-P_\mathcal K)q\|
 \leq\|q-Vy\|\\
 &\leq\|(I-P_M)q\|+\|(I-P_M)Vy\|\\
 &\leq\tau_M(\mathcal Q)
       +\sqrt{(\epsilon+\zeta)/\gamma}.
 \end{aligned}                                         \tag{5.11}
\]

Rearrangement proves (5.7).  `square`

This theorem explains why setting `N=M` is not by itself a shell theorem.
It makes `epsilon=0` but moves the complete unmodeled source tail into
`zeta`.  If a common asymptotic argument proves

\[
 {\epsilon_\lambda\over\gamma_\lambda}
 =o(\lambda^{-1}),
 \qquad
 {\zeta_\lambda\over\gamma_\lambda}
 =o(\lambda^{-1}),
 \qquad
 \tau_{M(\lambda)}(\mathcal Q_\lambda)
 =o(\lambda^{-1/2}),                                    \tag{5.12}
\]

then (5.7) makes the new approximation-angle estimate

\[
 \boxed{a_{\lambda,\sigma}=o(\lambda^{-1/2})}           \tag{5.13}
\]

necessary.  No current source lock proves (5.13) for either prescribed
residue family.

Theorem 5.1 concerns the full shell plus projection tail.  It does not
contradict the exact covariance-tangent theorem, which may need only a
weighted collection of physical directions and can be strictly smaller
than a uniform principal-angle bound.

## 6. Scale no-go for the current periodic-BV certificate

This section audits the explicit fallback in Section 4.1 of
`notes/COVARIANCE_TANGENT_GRAPH_SPILL.md`.  It does not estimate the true
optimized shell.

Let `C` synthesize one declared residue block in orthonormal raw prolate
coordinates and use the positive defect metric

\[
 \mathsf H=C^*\operatorname {diag}(d_n)C,
 \qquad d_n=1-\chi_n^2.                                 \tag{6.1}
\]

The locked all-index floor gives

\[
 \mathsf H\succeq d_{\rm LS}C^*C,
 \qquad
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2}.         \tag{6.2}
\]

For the low synthesis `B=P_MS_sigma A_lambda C`, the arithmetic operator
bound and (6.2) give, for every coefficient vector `y`,

\[
 \begin{aligned}
 \|By\|^2
 &\leq{\lambda^2\over2}\|Cy\|^2\\
 &\leq{\lambda^2\over2d_{\rm LS}}
        \langle y,\mathsf H y\rangle.
 \end{aligned}                                         \tag{6.3}
\]

Consequently

\[
 B\mathsf H^{-1}B^*
 \preceq{\lambda^2\over2d_{\rm LS}}I.                 \tag{6.4}
\]

Any certified positive lower floor on a nonzero target therefore obeys

\[
 \boxed{\gamma\leq{\lambda^2\over2d_{\rm LS}}.}        \tag{6.5}
\]

The existing uniform circular-variation estimate is

\[
 V_\lambda^{\rm old}={qV_*(\lambda)^2\over d_{\rm LS}},
 \qquad
 V_*(\lambda)=368\pi^3\lambda^7+108\pi\lambda^2,       \tag{6.6}
\]

where `q` is the raw modal-row count used by the block.  The periodic
Fourier-tail theorem produces the certified shell constant

\[
 \epsilon_{\rm BV}
 ={LqV_*(\lambda)^2\over
   2\pi^2M d_{\rm LS}}.                                 \tag{6.7}
\]

Combining (6.5)--(6.7) gives the certificate-level lower bound

\[
 \boxed{
 {\epsilon_{\rm BV}\over\gamma}
 \geq{LqV_*(\lambda)^2\over
          \pi^2M\lambda^2}.}                            \tag{6.8}
\]

On the central cutoff

\[
 M=\lceil\lambda L\rceil,                              \tag{6.9}
\]

equation (6.8) is `Omega(q*lambda^11)`.  For the full prescribed
transition inventory, `q` has order `lambda^2`, so the displayed
certificate ratio has order at least `lambda^13`.  It is not
`o(lambda^(-1))`.

If one instead asks for a coframe on the entire consecutive low parity
space, rank forces its dimension to be no larger than the source-column
count, hence `M=O(q)`.  Equation (6.8) then has the still larger generic
scale

\[
 \Omega(L\lambda^{12}).                                 \tag{6.10}
\]

Equivalently, even without a full-low-space rank requirement, (6.8) could
meet `o(lambda^(-1))` only at a cutoff satisfying

\[
 M\gg {LqV_*(\lambda)^2\over\lambda},                  \tag{6.11}
\]

which is of order larger than `q*L*lambda^13` for the displayed `V_*`.
No current theorem puts the central feature range inside the projected
prescribed source range at such a cutoff.

The logical scope of (6.8) is essential.  The actual smallest `epsilon` in

\[
 E^*E\preceq\epsilon\mathsf H                            \tag{6.12}
\]

may be much smaller than (6.7), and the exact covariance-weighted tangent
may be smaller still.  Equations (6.8)--(6.11) reject promotion of the
**existing BV fallback** to the required rate; they are not an impossibility
theorem for the physical residue map.

## 7. An augmented endpoint-jet target

The unmatched-breakpoint proof also suggests a cancellation-preserving
constructive target.  Let

\[
 \mathcal J_Kf=
 \left(f(\lambda),f'(\lambda),\ldots,
                 f^{(K-1)}(\lambda)\right).             \tag{7.1}
\]

At the arithmetic breakpoint `u_m=lambda/m`, the branch which enters or
leaves is

\[
 b_m(u)=\sqrt u\,f(mu).                                 \tag{7.2}
\]

With `D_u=u*d/du` and `y=mu`, one has the exact identity

\[
 \left.D_u^r b_m(u)\right|_{u=u_m}
 =\sqrt{\lambda\over m}
   \left.\left({1\over2}+y{d\over dy}\right)^r
                  f(y)\right|_{y=\lambda}.              \tag{7.3}
\]

Therefore

\[
 \mathcal J_Kf=0
 \quad\Longrightarrow\quad
 [D_u^rA_\lambda f]_{u_m}=0
 \quad(0\leq r<K)                                      \tag{7.4}
\]

at every forward arithmetic breakpoint; the reflected statement follows
after applying `J`.  Thus exact endpoint-jet cancellation removes the first
`K` jump orders before a periodic Sobolev or repeated-integration-by-parts
Fourier-tail estimate is applied.

The endpoint jets are independently nondegenerate on any collection of
distinct raw prolate modes.  In the rescaled `[-1,1]` convention, if `y_j`
have distinct differential eigenvalues `mu_j`, then

\[
 \det[y_j^{(k)}(1)]_{0\leq k,j<r}
 =\left(\prod_jy_j(1)\right)
  \left(\prod_{k=0}^{r-1}{1\over2^kk!}\right)
  \prod_{i<j}(\mu_j-\mu_i),                              \tag{7.5}
\]

up to the fixed Vandermonde orientation.  Every factor is nonzero.  Hence
`mathcal J_K C` has row rank `K` when at least `K` distinct prescribed
modes are available.

Equation (7.5) does **not** prove the required joint transversality with the
low physical moment rows.  A precise next source theorem would be a positive
source-metric coframe for the augmented map

\[
 \boxed{
 \mathcal A_{M,K}
 =\begin{bmatrix}
    P_MS_\sigma A_\lambda C\\
    \mathcal J_KC
   \end{bmatrix},}                                      \tag{7.6}
\]

on the target pairs

\[
 \begin{bmatrix}U_M\\0\end{bmatrix}.                  \tag{7.7}
\]

Such a theorem must prove both range inclusion and a quantitative floor,
retain the full source Gram, and use the actual plus anchor deflation or
minus zero-integral columns.  It must then be combined with an explicit
`K`th-derivative variation bound in (7.3).  Source-column surplus and the
jet determinant (7.5) alone do not prove (7.6).

## 8. Diagonal selection and exact remaining claim

A finite ball certificate that (2.8) and (2.9) are nonzero at one locked
`p` proves only one finite coframe.  Analytic dependence on a continuous
parameter would not by itself prove nonvanishing at infinitely many locked
half-integers; a nonzero analytic function can vanish on that discrete grid.
An unbounded source-selectable diagonal therefore still requires an
analytic nonvanishing, principal-angle, or augmented-coframe theorem.

The qualitative mixed-prefix theorem has the quantifier form

\[
 \text{for fixed }(\lambda,X),\quad
 \text{some finite mixed prefix spans }X.                \tag{8.1}
\]

It supplies neither a one-residue prefix nor a terminal-label bound.  In
particular, (8.1) does not imply that the terminal label lies below the
prescribed transition cutoff as `lambda` and `X` grow together.

The exact smallest current alternatives are therefore:

1. prove a nonzero normalized determinant or normalized adjoint-tail reserve
   for each prescribed residue family on one unbounded common schedule;
2. prove the covariance-weighted tangent target directly, without demanding
   a uniform low coframe on irrelevant directions; or
3. prove the augmented endpoint-jet coframe (7.6) with a derivative-tail
   estimate strong enough to replace the rejected BV constant.

No result in this note establishes any of these asymptotic statements.  In
particular, it does not promote counts, fixed-point determinants, jump jets,
or numerical agreement to the common-schedule bridge.
