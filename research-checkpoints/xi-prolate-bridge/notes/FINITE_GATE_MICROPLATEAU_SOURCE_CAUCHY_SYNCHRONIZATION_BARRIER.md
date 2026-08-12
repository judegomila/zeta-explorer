# Finite-gate microplateau and source-Cauchy synchronization barrier

## 0. Exact outcome and claim boundary

Fix the centered modes -N,...,N, put d=2*N+1, and let eta be the all-one
source boundary vector.  This note proves a quantitative stability theorem
for the finite gates on a fixed-dimensional L interval.  If the matrix,
lower-Ritz value, boundary projector, strict denominator, and reserve have
moduli of continuity smaller than their respective margins, then the
simple-even, boundary, shifted-sector, denominator, and reserve gates persist.
For the adaptive constant-N microplateau of length A/t, the exact sufficient
conditions are displayed in Section 5.

None of the required relative margins or moduli is supplied by the frozen
adaptive or aggregate theorem.  This absence is sharp at the level of the
exact source-Cauchy and parity algebra.  For every dimension and every
positive a and epsilon, the matrix

\[
 Q_0=aI+\varepsilon\left(I-|g\rangle\langle g|\right),
 \qquad g={\eta\over\sqrt d},                       \tag{0.1}
\]

has a simple even ground, nonzero boundary normalization, both strict
shifted sectors, positive finite-selector denominators, and a positive
projected-anchor complement reserve on the nonzero anchor-overlap branch.
Adding a regular exact source-Cauchy selector extension gives

\[
 Q(s)=Q_0+sH_\rho,
 \qquad (H_\rho)_+=|u_\rho\rangle\langle u_\rho|,
 \qquad (H_\rho)_-=-\rho|v_\rho\rangle\langle v_\rho|. \tag{0.2}
\]

The simple-even gate fails for some

\[
 0<s\leq {\varepsilon\over\rho\|v_\rho\|^2}.       \tag{0.3}
\]

The derivative dQ/ds=H_rho is independent of epsilon.  Hence the finite-good
radius can be arbitrarily small even under a fixed Lipschitz bound.  Scaling
a and epsilon below any prescribed absolute prolate Rayleigh envelope does
not repair the missing relative margin.

There is also an exact nested rational countermodel.  A positive N=1
source-Cauchy matrix has a simple even ground, while its positive N=2
principal extension has an odd ground.  Padding by source modes with zero
new source coefficients and a sufficiently large diagonal preserves the odd
ground for an arbitrarily long adjacent-cutoff window.

For the actual pole--archimedean--minus-prime matrix, dependence on L is not
globally analytic.  At L=log(q), an inclusive prime power enters with zero
value but a rank-one derivative jump of exact norm

\[
 {2(2N+1)\Lambda(q)\over L\sqrt q}.                 \tag{0.4}
\]

Thus a generic analytic-transversality slogan is not a substitute for the
missing quantitative moduli and margins.

This is an unbound post-checkpoint-1.45 theorem/barrier note/test pair.  It
changes no standard eight file and adds no serialized numerical artifact.
The models are exact source-Cauchy structural matrices, not the actual
prime-power/archimedean matrices and not actual zeta-zero Grams.  The finite
selector scalar D_n^(sel) proved positive below is not the Stokes zero-row
denominator D_N^(St).  This note proves no actual finite gate, no actual gate
failure, no finite-gate/arithmetic-winner intersection, no decay or failure
of eta_N^pr, no actual arithmetic sign, no new zeta-zero theorem, no RH
implication or converse, and no de Bruijn--Newman Lambda bound.  The formal
state remains P0_INVALIDATED.

## 1. Minimal frozen inputs

Exactly three frozen theorem/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md | ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f |
| tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py | e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d |
| notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md | 2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87 |
| tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py | d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97 |
| notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md | e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26 |
| tests/test_source_cauchy_selector_cone_projective_tradeoff.py | f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee |

The adaptive pair supplies the exact constant-N interval of length A/t, the
O(L) schedule, analytic projection stability, and the previously identified
finite-gate barrier.  The adjacent pair supplies the aggregate arithmetic
selection problem.  The source-Cauchy pair supplies the exact regular
selector extension used in Section 4.  No zero table, numerical matrix, RH
premise, external theorem, or source-lock artifact is imported.

## 2. Source-Cauchy and parity conventions

Use the real centered source basis V_n, -N<=n<=N, with inversion
J V_n=V_(-n).  An inversion-symmetric source-Cauchy matrix has

\[
 Q_{nn}=a_n,
 \qquad Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad a_{-n}=a_n,
 \qquad b_{-n}=-b_n.                                \tag{2.1}
\]

The normalized parity bases are

\[
 e_0^+=V_0,
 \qquad e_n^+={V_n+V_{-n}\over\sqrt2},
 \qquad e_n^-={V_n-V_{-n}\over\sqrt2}
 \quad(1\leq n\leq N).                             \tag{2.2}
\]

Write Q_+ and Q_- for the corresponding even and odd blocks.  The boundary
vector and its normalized constant direction are

\[
 \eta=V_0+\sum_{n=1}^N(V_n+V_{-n}),
 \qquad d=2N+1,
 \qquad g={\eta\over\sqrt d}.                       \tag{2.3}
\]

All comparisons between different L values at fixed N use the coefficient
identification of these centered source bases.  This is the identification
in which the parity subspaces and eta are fixed.

## 3. A favorable fixed-N source-Cauchy anchor

Let a>0 and epsilon>0, and define Q_0 by (0.1).  Its entries are

\[
 (Q_0)_{nm}=
 \begin{cases}
 a+\varepsilon(1-d^{-1}),&n=m,\\
 -\varepsilon d^{-1},&n\ne m.
 \end{cases}                                       \tag{3.1}
\]

Equation (2.1) holds exactly with

\[
 b_n^{(0)}=-{\varepsilon n\over d},
 \qquad a_n^{(0)}=a+\varepsilon(1-d^{-1}).          \tag{3.2}
\]

The parity blocks are

\[
 (Q_0)_+=a|g\rangle\langle g|
 +(a+\varepsilon)(I_+-|g\rangle\langle g|),
 \qquad (Q_0)_-=(a+\varepsilon)I_-.                \tag{3.3}
\]

Consequently g is the unique global ground, its value is a, and every
even-complement and odd direction has value a+epsilon.  The unit and
boundary-normalized ground vectors obey

\[
 \langle\eta,g\rangle=\sqrt d,
 \qquad \Phi_0={\eta\over d},
 \qquad \langle\eta,\Phi_0\rangle=1.               \tag{3.4}
\]

Put T_0=Q_0-aI.  Its source diagonal and row give, for 1<=n<=N,

\[
 d_n^{(0)}=\varepsilon(1-d^{-1}),
 \qquad b_n^{(0)}=-{\varepsilon n\over d},
 \qquad D_n^{\rm sel}:=d_n^{(0)}-{b_n^{(0)}\over n}
 =\varepsilon>0.                                   \tag{3.5}
\]

This D_n^(sel) is the finite selector diagonal used in source-Cauchy
localization.  It is not the Stokes denominator defined in Section 6.

Now let kappa be any real unit inversion-even projected-prolate anchor and
put

\[
 \alpha=\langle g,\kappa\rangle,
 \qquad q_\kappa=\langle\kappa,Q_0\kappa\rangle
 =a+\varepsilon(1-\alpha^2).                       \tag{3.6}
\]

The exact residual is

\[
 (Q_0-q_\kappa I)\kappa
 =\varepsilon\{\alpha^2\kappa-\alpha g\}.          \tag{3.7}
\]

If alpha is nonzero, the Ritz space generated by kappa and this residual
contains g; if kappa=g, it already is the ground line.  In either case the
lower Ritz value is u=a, and

\[
 (Q_0)_--uI=\varepsilon I_-,
 \qquad (Q_0)_+-uI=\varepsilon I
 \quad\hbox{on }g^\perp.                            \tag{3.8}
\]

Moreover, if P_(kappa^perp) is the orthogonal projection onto the anchor
complement, the exact nonzero compression floor is

\[
 \lambda_{\min}\left(
 P_{\kappa^\perp}T_0P_{\kappa^\perp}
 \bigm|_{\kappa^\perp}\right)
 =\varepsilon\alpha^2>0.                            \tag{3.9}
\]

Thus the anchor passes the simple-even, boundary, strict shifted even,
strict shifted odd, finite-selector-denominator, and positive complement
reserve gates whenever alpha is nonzero.  If alpha=0, the residual vanishes
at the complement value a+epsilon, the lower-Ritz strict gate already fails,
and no synchronization theorem may silently discard that branch.

Finally, (3.6) shows that choosing

\[
 a+\varepsilon\leq U                              \tag{3.10}
\]

makes q_kappa<=U for every unit anchor.  Therefore an arbitrarily small
absolute Gevrey or sampling upper envelope does not create a relative gate
margin.

## 4. Exact selector perturbation and arbitrarily small good radius

Fix rho>0 and gamma>0.  The regular selector extension from the frozen
source-Cauchy theorem has entries

\[
 (H_\rho)_{nm}=
 {\gamma\rho(\rho-nm)\over
  (\rho+n^2)(\rho+m^2)}.                            \tag{4.1}
\]

Its source data are

\[
 b_n^{(\rho)}={\gamma n\rho\over\rho+n^2},
 \qquad
 a_n^{(\rho)}={\gamma\rho(\rho-n^2)\over
                         (\rho+n^2)^2}.             \tag{4.2}
\]

For n different from m, direct subtraction gives

\[
 {b_n^{(\rho)}-b_m^{(\rho)}\over n-m}
 ={\gamma\rho(\rho-nm)\over
  (\rho+n^2)(\rho+m^2)}.                            \tag{4.3}
\]

Define the raw even and odd vectors

\[
 (u_\rho)_n={\sqrt\gamma\,\rho\over\rho+n^2},
 \qquad
 (v_\rho)_n={\sqrt\gamma\,n\over\rho+n^2}.         \tag{4.4}
\]

Then u_rho is even, v_rho is odd, both are nonzero for N>=1, and

\[
 H_\rho=|u_\rho\rangle\langle u_\rho|
 -\rho|v_\rho\rangle\langle v_\rho|.              \tag{4.5}
\]

Thus Q(s)=Q_0+sH_rho remains an exact real inversion-symmetric
source-Cauchy matrix and its blocks are

\[
 Q_+(s)=(Q_0)_++s|u_\rho\rangle\langle u_\rho|,
 \qquad
 Q_-(s)=(a+\varepsilon)I_-
 -s\rho|v_\rho\rangle\langle v_\rho|.              \tag{4.6}
\]

In particular,

\[
 Q_+(s)\succeq aI_+
 \qquad(s\geq0).                                    \tag{4.7}
\]

At

\[
 s_1={\varepsilon\over\rho\|v_\rho\|^2},          \tag{4.8}
\]

the unit odd vector v_rho/||v_rho|| has Rayleigh value

\[
 \left\langle{v_\rho\over\|v_\rho\|},
 Q_-(s_1){v_\rho\over\|v_\rho\|}\right\rangle=a. \tag{4.9}
\]

Equations (4.7)--(4.9) show that the unique global simple-even ground has
failed at or before s=s_1: at s_1 the odd floor is at most a, while the
even floor is at least a.  All matrices remain positive at the first
crossing because a>0.

Set s=nu*(L-L_0) with nu>0.  Then

\[
 \left\|{dQ\over dL}\right\|=\nu\|H_\rho\|,
 \qquad
 R_{\rm good}\leq
 {\varepsilon\over\nu\rho\|v_\rho\|^2}.            \tag{4.10}
\]

The derivative bound in (4.10) is independent of epsilon, while the right
side tends to zero with epsilon.  Given the adaptive microplateau
0<=L-L_0<=A/t, one may choose

\[
 0<\varepsilon<{\nu\rho\|v_\rho\|^2A\over t},       \tag{4.11}
\]

so a finite strict gate fails inside the plateau.  Simultaneously choosing
a+epsilon below the absolute envelope in (3.10) preserves the admitted
small-Rayleigh scale.  This is a structural nonimplication, not a statement
that the actual arithmetic path follows Q(s).

## 5. Quantitative fixed-dimension synchronization theorem

Let L_0 be fixed, retain one dimension N, and identify the coefficient
spaces as in Section 2.  At L_0, write the ordered relevant eigenvalues as

\[
 \mu_1^+=\lambda_1(Q_+),
 \qquad \mu_2^+=\lambda_2(Q_+),
 \qquad \mu_1^-=\lambda_1(Q_-).                    \tag{5.1}
\]

Assume the ground is simple and even, and let u be the finite lower-Ritz
value at the same point.  Define the simple-ground and shifted margins

\[
 g_+=\mu_2^+-\mu_1^+,
 \qquad g_-=\mu_1^--\mu_1^+,
 \qquad \sigma_+=\mu_2^+-u,
 \qquad \sigma_-=\mu_1^--u.                        \tag{5.2}
\]

Let P_g(L) be the rank-one ground projector when it exists, and define the
orientation-free boundary quantity

\[
 B(L)=\langle\eta,P_g(L)\eta\rangle.                \tag{5.3}
\]

Let D^(St)(L) denote the strict Stokes zero-row denominator required by the
endpoint quotient, and let mathcal R(L) be whichever Hermitian reserve
operator the downstream finite theorem requires.  At the anchor put

\[
 B_0=B(L_0)>0,
 \qquad D_0^{\rm St}=D^{\rm St}(L_0)>0,
 \qquad r_0=\lambda_{\min}(\mathcal R(L_0))>0.      \tag{5.4}
\]

For a one-sided radius R, define exact moduli

\[
 \begin{aligned}
 \omega_Q(R)&=\sup_{0\leq x\leq R}
 \max_{\pm}\|Q_\pm(L_0+x)-Q_\pm(L_0)\|,\\
 \omega_u(R)&=\sup_{0\leq x\leq R}|u(L_0+x)-u(L_0)|,\\
 \omega_B(R)&=\sup_{0\leq x\leq R}|B(L_0+x)-B_0|,\\
 \omega_D(R)&=\sup_{0\leq x\leq R}
 |D^{\rm St}(L_0+x)-D_0^{\rm St}|,\\
 \omega_{\mathcal R}(R)&=\sup_{0\leq x\leq R}
 \|\mathcal R(L_0+x)-\mathcal R(L_0)\|.
 \end{aligned}                                      \tag{5.5}
\]

Here omega_u includes the motion of the projected anchor and of its Ritz
space; it is not implied by omega_Q unless that additional dependence has
been controlled.

### Theorem 5.1 (finite-gate transport)

If

\[
 2\omega_Q(R)<\min(g_+,g_-),                        \tag{5.6}
\]

\[
 \omega_Q(R)+\omega_u(R)<\min(\sigma_+,\sigma_-),  \tag{5.7}
\]

and

\[
 \omega_B(R)<B_0,
 \qquad \omega_D(R)<D_0^{\rm St},
 \qquad \omega_{\mathcal R}(R)<r_0,               \tag{5.8}
\]

then throughout L_0<=L<=L_0+R the global ground remains simple and even,
the shifted even and odd signs remain strict, the boundary pairing remains
nonzero, D^(St)(L)>0, and mathcal R(L)>0.

Indeed, Weyl's inequality gives

\[
 \begin{aligned}
 g_+(L)&\geq g_+-2\omega_Q(R),\\
 g_-(L)&\geq g_--2\omega_Q(R),\\
 \sigma_\pm(L)&\geq
 \sigma_\pm-\omega_Q(R)-\omega_u(R).
 \end{aligned}                                      \tag{5.9}
\]

The remaining conclusions follow directly from (5.8) and the minimum
eigenvalue version of Weyl's inequality.  For an exact source-Cauchy path,
qualitative boundary nonvanishing already follows from the preserved simple
even ground by the source commutator argument.  The omega_B condition is
still needed when a quantitative boundary-normalization reserve is used.

If the five quantities in (5.5) have Lipschitz bounds

\[
 \omega_Q(R)\leq K_QR,
 \quad \omega_u(R)\leq K_uR,
 \quad \omega_B(R)\leq K_BR,
 \quad \omega_D(R)\leq K_DR,
 \quad \omega_{\mathcal R}(R)\leq K_{\mathcal R}R, \tag{5.10}
\]

then a sufficient strict radius is

\[
 R<R_{\rm sync}:=\min\left\{
 {\min(g_+,g_-)\over2K_Q},
 {\min(\sigma_+,\sigma_-)\over K_Q+K_u},
 {B_0\over K_B},
 {D_0^{\rm St}\over K_D},
 {r_0\over K_{\mathcal R}}
 \right\},                                         \tag{5.11}
\]

with a zero denominator interpreted as +infinity when the corresponding
modulus vanishes identically.  Therefore full coverage of the adaptive
constant-N plateau follows from the explicit new condition

\[
 {A\over t}<R_{\rm sync}.                            \tag{5.12}
\]

The frozen all-order and Gevrey projection estimates are absolute estimates.
They supply none of the positive numerators in (5.11), none of the five
Lipschitz constants, and no comparison proving (5.12).

## 6. The actual prime-threshold derivative jump

For the actual finite source matrix, the prime block uses the kernel

\[
 q_{nm}(x,L)=
 \begin{cases}
 2(1-x/L)\cos(2\pi nx/L),&n=m,\\
 {\sin(2\pi mx/L)-\sin(2\pi nx/L)\over\pi(n-m)},&n\ne m.
 \end{cases}                                       \tag{6.1}
\]

At the moving support boundary,

\[
 q_{nm}(L,L)=0
 \qquad\hbox{for every }n,m.                        \tag{6.2}
\]

Holding x fixed while differentiating the second argument gives, in both
branches of (6.1),

\[
 \left.\partial_Lq_{nm}(x,L)\right|_{L=x}
 ={2\over L}.                                       \tag{6.3}
\]

The inclusive prime-power block is

\[
 P_N(L)=\sum_{q\leq e^L}{\Lambda(q)\over\sqrt q}
 \bigl(q_{nm}(\log q,L)\bigr)_{-N\leq n,m\leq N}.  \tag{6.4}
\]

Equation (6.2) makes P_N(L) continuous when L crosses log(q), but (6.3)
gives the exact one-sided derivative jump

\[
 P_N'(L+)-P_N'(L-)
 ={2\Lambda(q)\over L\sqrt q}|\eta\rangle\langle\eta|
 \qquad(L=\log q).                                  \tag{6.5}
\]

Since the complete matrix is pole-arch-prime, its jump has the opposite
sign, and

\[
 \|Q_N'(L+)-Q_N'(L-)\|
 ={2d\Lambda(q)\over L\sqrt q}.                    \tag{6.6}
\]

The smooth pole and archimedean terms cannot cancel this jump.  Thus the
actual coefficient matrix is continuous and piecewise smooth, but it is not
globally real analytic across the prime thresholds.  A useful transversality
theorem would have to control the number and orientation of these pieces as
well as the relative margins.  No such theorem is frozen.

For clarity, the Stokes denominator mentioned in (5.4) is

\[
 D_N^{\rm St}(L)=\sum_{\gamma>0}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 \left|H_N\left({\gamma L\over2\pi}\right)\right|^2. \tag{6.7}
\]

It depends on the actual projected-prolate rational rows and the zero
weights.  It is not the finite selector quantity in (3.5), and positivity
of one does not prove positivity or a modulus for the other.

## 7. Exact source-Cauchy parity flip under principal extension

At N=1, take

\[
 a_0=1,
 \qquad a_1={11\over10},
 \qquad b_1={1\over5}.                              \tag{7.1}
\]

Use odd reflection for the negative modes and b_0=0.  In the parity bases
(2.2), the blocks are

\[
 E_1=\begin{pmatrix}
 1&\sqrt2/5\\
 \sqrt2/5&13/10
 \end{pmatrix},
 \qquad O_1=\begin{pmatrix}9/10\end{pmatrix}.       \tag{7.2}
\]

Their spectra are

\[
 \operatorname {spec}(E_1)
 =\left\{{23-\sqrt{41}\over20},
          {23+\sqrt{41}\over20}\right\},
 \qquad \operatorname {spec}(O_1)=\left\{{9\over10}\right\}. \tag{7.3}
\]

Since sqrt(41)>5, the positive N=1 matrix has a simple even ground.  Its
boundary pairing is nonzero, either directly from (7.2) or from the exact
source commutator theorem.

Extend the same source data to N=2 by

\[
 a_2=5,
 \qquad b_2=-{4\over5}.                             \tag{7.4}
\]

No old entry changes.  The new parity blocks are

\[
 E_2=\begin{pmatrix}
 1&\sqrt2/5&-2\sqrt2/5\\
 \sqrt2/5&13/10&-6/5\\
 -2\sqrt2/5&-6/5&23/5
 \end{pmatrix},                                    \tag{7.5}
\]

and

\[
 O_2=\begin{pmatrix}
 9/10&-4/5\\
 -4/5&27/5
 \end{pmatrix}.                                    \tag{7.6}
\]

Their characteristic polynomials factor as

\[
 \det(xI-E_2)=(x-1)
 \left(x^2-{59\over10}x+{207\over50}\right),
 \qquad
 \det(xI-O_2)=x^2-{63\over10}x+{211\over50}.       \tag{7.7}
\]

Therefore

\[
 \operatorname {spec}(E_2)
 =\left\{1,{59-5\sqrt{73}\over20},
             {59+5\sqrt{73}\over20}\right\},     \tag{7.8}
\]

and

\[
 \operatorname {spec}(O_2)
 =\left\{{63-\sqrt{2281}\over20},
          {63+\sqrt{2281}\over20}\right\}.        \tag{7.9}
\]

All five values are positive.  Moreover,

\[
 {63-\sqrt{2281}\over20}
 <{59-5\sqrt{73}\over20},                          \tag{7.10}
\]

because

\[
 2281-(4+5\sqrt{73})^2
 =40(11-\sqrt{73})>0.                               \tag{7.11}
\]

Thus the positive N=2 principal extension has an odd ground.  This is an
exact source-Cauchy principal-extension countermodel, stronger than a pair
of unrelated positive parity blocks.  Multiplying the whole nested family
by any positive scalar preserves the parity flip while making every
Rayleigh value against any prescribed prolate anchor arbitrarily small.

## 8. Arbitrarily long bad adjacent-cutoff windows

The preceding pair can be padded without restoring the finite gate.  For
every new index k>=3, set

\[
 b_k=0,
 \qquad a_k=M,                                      \tag{8.1}
\]

with odd/even reflection as in (2.1).  If 1<=m<k, the parity couplings are

\[
 E_{mk}={2(kb_k-mb_m)\over k^2-m^2},
 \qquad
 O_{mk}={2(mb_k-kb_m)\over k^2-m^2}.                \tag{8.2}
\]

Only b_1 and b_2 are nonzero.  Hence the squared total couplings from the
low N=2 blocks to all padded modes obey

\[
 C_+^2:=\sum_{k=3}^\infty\sum_{m=1}^2
 \left({2mb_m\over k^2-m^2}\right)^2<\infty,
 \qquad
 C_-^2:=\sum_{k=3}^\infty\sum_{m=1}^2
 \left({2kb_m\over k^2-m^2}\right)^2<\infty.       \tag{8.3}
\]

Let the strict parity gap at N=2 be

\[
 \delta_*={\sqrt{2281}-4-5\sqrt{73}\over20}>0.     \tag{8.4}
\]

For eigenvalues below 2, the Schur-complement corrections caused by the
padded diagonal MI have norms at most

\[
 {C_+^2\over M-2},
 \qquad {C_-^2\over M-2}.                           \tag{8.5}
\]

Choose M once so that both quantities in (8.5) are smaller than
min(delta_*/4,lambda_min(O_2)/4).  This choice is independent of the number
of padded modes.  The even and odd ground values remain positive, and the
odd one remains strictly smaller, for every finite cutoff N>=2.
Consequently an adjacent candidate block of any prescribed finite length,
including an O(L) length, can contain no finite-good cutoff under the
available structural hypotheses.

This padding is not the actual arithmetic principal chain.  It proves that
source-Cauchy form, positivity, nesting, and an absolute prolate Rayleigh
upper scale do not imply any positive density of finite-good cutoffs.

## 9. What an aggregate arithmetic theorem must add

Let K be the candidate cutoff block selected by the aggregate arithmetic
reduction, and let G be its subset on which all finite gates hold.  A total
block inequality does not force its winning cutoff to lie in G: all favorable
row energy may be carried by K minus G.

A direct sufficient synchronization condition is the restricted inequality

\[
 0<\sum_{n\in G}|e_n|^2,
 \qquad
 \sum_{n\in G}D_n^{\rm act}
 \geq c h^{-2}\sum_{n\in G}|e_n|^2
 \quad(c>0).                                       \tag{9.1}
\]

Then some finite-good cutoff has the desired quotient.  Alternatively, if
the total theorem gives

\[
 \sum_{n\in K}D_n^{\rm act}
 \geq C h^{-2}\sum_{n\in K}|e_n|^2,                \tag{9.2}
\]

it is sufficient to prove that the good-set endpoint energy is positive and
a bad-set leakage bound

\[
 \sum_{n\in K\setminus G}D_n^{\rm act}
 \leq\theta C h^{-2}\sum_{n\in K}|e_n|^2,
 \qquad 0\leq\theta<1.                             \tag{9.3}
\]

Equations (9.2)--(9.3) give (9.1) with at least the constant
(1-theta)*C.  Neither a count of good indices nor pointwise continuity of
the finite gates supplies (9.3).  For a continuous L average, the analogous
new input is a gate-restricted arithmetic lower bound or an upper bound for
the arithmetic energy on the gate-bad set.

Thus there are only three currently rigorous synchronization routes:

1. prove the finite gates uniformly on every candidate cutoff;
2. cover the complete constant-N plateau by (5.6)--(5.12); or
3. prove a gate-restricted arithmetic theorem such as (9.1) or (9.3).

## 10. Stopping line

The fixed-dimensional perturbation question is closed at the abstract
level.  Quantitative margins plus quantitative moduli give the exact
transport theorem, and without those data an exact source-Cauchy path can
lose the simple-even gate on an arbitrarily small scale while passing all
listed anchor gates.  The adjacent-cutoff question is also closed at the
structural level: exact positive source-Cauchy principal extensions can flip
ground parity and can remain bad through arbitrarily long padded windows.

The actual research obligation is not another qualitative continuity or
interlacing statement.  It is a relative arithmetic theorem supplying the
specific margins and moduli in (5.11), or a gate-restricted aggregate
estimate such as (9.1).  No such actual synchronization theorem is proved
here.
