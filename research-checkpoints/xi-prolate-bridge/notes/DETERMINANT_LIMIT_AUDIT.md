# Source-pinned finite determinant theorem and scale-free limit audit

Status: the finite theorem is reproduced from the pinned source, and the
normalization needed for the conditional limit is made explicit.  This note
does not prove the simple-even hypotheses on an unbounded schedule, equation
(5.2) of `DIRECT_RH_ATTACK.md`, locally uniform convergence, or the Riemann
hypothesis.  The project terminal state remains `P0_INVALIDATED` because the
locked source errata remain in force.

The binding source is Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
All page references below are to the printed pages, which coincide with the
PDF page numbers.

## 1. Exact source chain

| Source location | Input used here |
|---|---|
| pp. 15--16, (5.1), Lemma 5.1, (5.2) | The truncated Weil matrix has the real Cauchy off-diagonal form. |
| pp. 16--17, Lemma 5.2, (5.3), Definition 5.3 | Inversion commutation and the rank-two commutator. |
| p. 17, paragraph after Definition 5.3, (5.4) | A simple even null vector has nonzero boundary pairing. |
| pp. 17--18, Lemma 5.4, (5.5)--(5.7) | The quotient metric, induced self-adjoint operator, and finite determinant. |
| pp. 19--20, Corollary 5.6, (5.15) | The exact finite boundary vector `delta_N=L^(-1/2) eta`. |
| p. 20, Proposition 5.7 | The unique rank-one perturbation. |
| pp. 21--22, (5.16)--(5.24), Lemma 5.8 | The spectral cut and periodic regularized determinant. |
| pp. 22--24, Proposition 5.9, (5.25)--(5.27), Theorem 5.10 | The Fourier--Mellin determinant identity and its real zero set. |
| pp. 27--32, (7.1)--(7.12), Lemmas 7.1--7.3 | The proposed prolate limit, subject to the repairs in Section 6 below. |

The finite proof in Section 5 is elementary once the Cauchy matrix form is
known; it does not import a list of zeta zeros or global Weil positivity.

## 2. Precise finite hypotheses

Fix `lambda>1`, put `L=2 log(lambda)`, and let

\[
 V_n(u)=L^{-1/2}\exp(2\pi i n\log(\lambda u)/L),
 \qquad |n|\leq N,
\]

in `L2([lambda^(-1),lambda],du/u)`.  Write `E_N=span{V_n:|n|<=N}`,
`M V_n=nV_n`, and `J V_n=V_(-n)`.  The source requires the exact real
symmetric matrix form

\[
 Q_{nm}=\begin{cases}
 a_n,&n=m,\\
 (b_n-b_m)/(n-m),&n\ne m,
 \end{cases}
 \qquad a_{-n}=a_n,\quad b_{-n}=-b_n.             \tag{2.1}
\]

Consequently `JQ=QJ` and

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,
 \quad
 \eta=\sum_{|n|\leq N}V_n,
 \quad
 \beta=\sum_{|n|\leq N}b_nV_n.                 \tag{2.2}
\]

Let `epsilon_N` be the actual lowest eigenvalue of `Q`.  The theorem assumes
that it is simple and that a corresponding nonzero eigenvector is exactly
inversion even.  It then uses

\[
 T=Q-\epsilon_N I\geq0,
 \qquad \ker T=\mathbb C\xi,
 \qquad J\xi=\xi.                                \tag{2.3}
\]

The shift in (2.3) is mandatory.  Positivity of `T` is finite spectral
calculus and is not an assumption of global Weil positivity.  Conversely,
Hermitian symmetry and inversion commutation without (2.1)--(2.2) do not
give the source boundary lemma.

The exact boundary vector is

\[
 \delta_N=L^{-1/2}\eta,
 \qquad
 \delta_N(f)=\langle\delta_N,f\rangle=f(\lambda)=f(\lambda^{-1})
 \quad(f\in E_N).                                 \tag{2.4}
\]

The commutator proof reproduced in
`notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` gives

\[
 \delta_N(\xi)\ne0.                               \tag{2.5}
\]

Thus `xi` can, and in the literal source determinant formula must, be
rescaled so that `delta_N(xi)=1`.

## 3. The induced Hilbert space and self-adjoint operator

The positive semidefinite form

\[
 \langle f,g\rangle_T=\langle Tf,g\rangle_{L^2}
\]

has radical `C xi`.  It therefore gives a positive definite inner product on

\[
 E'_N=E_N/\mathbb C\xi.                            \tag{3.1}
\]

This quotient metric is the restriction of
`QW_lambda^N-epsilon_N <.|.>`; it is not the original `L2` metric.

For the integer mode operator, first normalize `xi'` by
`<eta,xi'>=1` and put

\[
 M'=M-|M\xi'\rangle\langle\eta|.                  \tag{3.2}
\]

Equations (2.2)--(2.3) give

\[
 TM'=M'^*T,\qquad M'\xi'=0.                       \tag{3.3}
\]

Hence `M'` descends to a symmetric, and therefore self-adjoint,
finite-dimensional operator `M''` on (3.1).  If `xi_delta` denotes the same
null line normalized by `delta_N(xi_delta)=1`, then
`xi'=L^(-1/2)xi_delta`.  Restoring the physical scale gives

\[
 D_{\log}^{(\lambda,N)}
 =D_{\log}^{(\lambda)}
  -|D_{\log}^{(\lambda)}\xi_\delta\rangle
       \langle\delta_N|,                          \tag{3.4}
\]

with the same domain as the periodic scaling operator.  It is self-adjoint
on

\[
 \mathcal H_{\lambda,N}=E'_N\oplus E_N^\perp,     \tag{3.5}
\]

using the quotient metric on the first summand and the ordinary `L2` metric
on the second.  The restriction to `E_N^perp` is the unperturbed periodic
scaling operator.  Equation (3.5), rather than the original `L2` space with
its original metric, is the exact self-adjointness assertion.

## 4. Determinant, phase, and real zeros

The Fourier--Mellin convention is

\[
 \widehat f(z)=\int_0^\infty f(u)u^{-iz}\,\frac{du}{u}.             \tag{4.1}
\]

For `xi=sum_(|j|<=N) xi_j V_j`, zero-extended outside the source interval,
direct integration gives source (5.25):

\[
 \widehat\xi(z)=\frac{2}{\sqrt L}\sin(zL/2)
       \sum_{|j|\leq N}\frac{\xi_j}{z-2\pi j/L}.                  \tag{4.2}
\]

The apparent poles are removable, so this is entire.  The source defines the
regularized determinant using the negative-axis choice

\[
 (-1)^{-w}=e^{-i\pi w}.                            \tag{4.3}
\]

With this cut the full periodic operator has

\[
 \det_{\rm reg}(D_{\log}^{(\lambda)}-z)=1-e^{-izL}.                \tag{4.4}
\]

Lemma 5.4's finite determinant identity, the direct-sum factorization, and
(4.2)--(4.4) yield, for the boundary-normalized vector,

\[
 \boxed{
 \det_{\rm reg}(D_{\log}^{(\lambda,N)}-z)
   =-i\lambda^{-iz}\widehat\xi_\delta(z).}         \tag{4.5}
\]

Here `lambda^(-iz)=exp(-izL/2)` is a nowhere-zero entire phase.  Choosing the
opposite spectral cut changes the phase formula and is not the literal
identity (4.5), although it does not create nonreal zeros.

The zero statement follows from an exact factorization, not from numerical
eigenvalue agreement:

\[
 \det_{\rm reg}(D_{\log}^{(\lambda,N)}-z)
 =\det(D_{\log}^{(\lambda,N)}|_{E'_N}-z)\,
  \det_{\rm reg}(D_{\log}^{(\lambda)}|_{E_N^\perp}-z).             \tag{4.6}
\]

The first factor is the characteristic polynomial of a self-adjoint finite
operator in the quotient metric.  The second has zeros exactly at
`2*pi*j/L`, `|j|>N`.  All zeros of (4.6), and therefore all zeros of
`widehat(xi_delta)`, are real, with multiplicity.  This is a finite theorem;
it says nothing about convergence to zeta zeros.

## 5. Scaling audit: unit vectors versus boundary normalization

Let `x` be any unit eigenvector on the simple even lowest eigenspace and put
`d=delta_N(x)`, which is nonzero by (2.5).  Then
`xi_delta=x/d`, and (4.5) becomes

\[
 \det_{\rm reg}(D_{\log}^{(\lambda,N)}-z)
 =-i\lambda^{-iz}d^{-1}\widehat x(z).             \tag{5.1}
\]

Equivalently,

\[
 \widehat x(z)=i\,d\,\lambda^{iz}
 \det_{\rm reg}(D_{\log}^{(\lambda,N)}-z).        \tag{5.2}
\]

Thus the transform of the unit vector is a nowhere-zero entire multiple of
the literal regularized determinant and has the same real zero set.  No
uniform lower bound for `|d|` is needed for this zero-set statement.

This formulation is invariant under arbitrary nonzero rescaling.  If
`y=a x`, `a!=0`, then `delta_N(y)=a d`; boundary normalization gives the same
vector `y/delta_N(y)=x/d`.  Likewise any limit function formed from `y` must
use the reciprocal coefficient `a^(-1)`.  An arbitrary *uncompensated*
sequence of scalars can destroy locally uniform convergence and is not
harmless.

Consequently there are two distinct routes:

1. Literal convergence of the boundary-normalized determinants would require
   quantitative control of `d` and of the phase in (5.1).
2. The zero-set route may use unit vectors, explicitly dephase (5.1), and
   choose the comparison scale directly.  It requires only the strict finite
   nonvanishing (2.5), not a uniform boundary reserve.

`DIRECT_RH_ATTACK.md` uses the second route.

## 6. Corrected prolate limit

The printed Section 7 assertion needs two explicit repairs already present in
this repository.

First, formulas (3.5), (7.1), and (7.2) give

\[
 \widehat{E(h)}(z)=\Xi(z)/4,                       \tag{6.1}
\]

not the `Xi` asserted in Lemmas 7.1 and 7.3.  This is the locked discrepancy
in `P0_SOURCE_ERRATA.md`.

Second, the displayed comparison in the proof of Lemma 7.3 omits the terms
`m>lambda/u`: `h_lambda` is zero-extended while its Hermite limit `h` is not.
`notes/PROJECTION_RATE_THEOREM.md`, equations (3.2)--(3.5), restores the
complete split and proves that the omitted Gaussian lattice tail is
exponentially small.  Together with the pinned qualitative estimate
`delta_lambda=O(lambda^(-2))`, the same bounds are uniform whenever
`|Im z|<=eta<1/2`.  The tails of `E(h)` outside
`[lambda^(-1),lambda]` are uniform on such a closed substrip by Poisson
inversion and Gaussian decay.

Finite-`lambda` inversion parity is not assumed.  Since

\[
 \widehat{Jf}(z)=\widehat f(-z),
 \qquad k_\lambda^+=(k_\lambda+Jk_\lambda)/2,
\]

and `Xi` is even, the repaired statement is

\[
 4\widehat{k_\lambda^+}(z)\longrightarrow\Xi(z)   \tag{6.2}
\]

locally uniformly on the open strip `|Im z|<1/2`.

## 7. Exact conditional locally uniform step

Choose a sequence `lambda_j->infinity` and finite dimensions `N_j`.  Put

\[
 k_j=k_{\lambda_j}^+,
 \quad p_j=P_{N_j}k_j\ne0,
 \quad \kappa_j=p_j/\|p_j\|,
 \quad e_j=\|p_j-k_j\|.                            \tag{7.1}
\]

Let `x_j` be the unit simple-even lowest eigenvector, with phase chosen so
that `<kappa_j,x_j>` is positive, and suppose a proved finite bridge gives

\[
 \|x_j-\kappa_j\|\leq d_j.                         \tag{7.2}
\]

Then the correctly scaled physical vectors obey the elementary identity

\[
 \big\|\,\|p_j\|x_j-k_j\big\|
 \leq e_j+\|p_j\|d_j.                              \tag{7.3}
\]

For a function supported in the source interval, (4.1) and
Cauchy--Schwarz give, uniformly on `|Im z|<=eta`,

\[
 |\widehat f(z)|
 \leq\sqrt{2\log\lambda_j}\,\lambda_j^\eta\|f\|_2.                \tag{7.4}
\]

Define

\[
 F_j(z)=4\|p_j\|\widehat{x_j}(z).                  \tag{7.5}
\]

Every `F_j` is entire and has only real zeros by Sections 4--5.  More
precisely, if `deltaj=delta_(N_j)(x_j)`, then

\[
 F_j(z)=4i\|p_j\|\,\delta_j\,\lambda_j^{iz}
 \det_{\rm reg}(D_{\log}^{(\lambda_j,N_j)}-z),    \tag{7.6}
\]

so (7.5) is the explicitly scaled and dephased determinant, not the literal
boundary-normalized expression.

Equations (7.3)--(7.4) give the exact compact-substrip estimate

\[
 \sup_{|\Im z|\leq\eta}
 |F_j(z)-4\widehat{k_j}(z)|
 \leq4\sqrt{2\log\lambda_j}\,\lambda_j^\eta
       \left(e_j+\|p_j\|d_j\right).               \tag{7.7}
\]

It is therefore sufficient that, for every fixed `eta<1/2`,

\[
 \sqrt{\log\lambda_j}\,\lambda_j^\eta
 \left(e_j+\|p_j\|d_j\right)\longrightarrow0.     \tag{7.8}
\]

Combining (7.7)--(7.8) with (6.2) proves `F_j->Xi` locally uniformly.  The
argument is unchanged if any `x_j` is replaced by `a_j x_j`, provided
(7.5) is multiplied by `a_j^(-1)`.  This is the precise scale-invariant
content of the phrase "harmless normalization."

In the current bridge theorem one takes `d_j=D(T_j)`.  The projection part
of (7.8) has been proved, but the required unbounded-schedule shifted-sector
and resolvent estimates have not.  Hence (7.8), local uniform convergence,
and the final Hurwitz step remain open.

## 8. Audit conclusions and remaining dependencies

The finite determinant theorem is valid subject to these exact hypotheses:

1. the source Cauchy matrix and rank-two commutator, including the locked
   Fourier convention;
2. a genuinely simple lowest eigenvalue and exact inversion evenness;
3. the shift by that eigenvalue;
4. the quotient Hilbert metric induced by the shifted form;
5. the exact boundary vector and its qualitative nonvanishing; and
6. the spectral cut (4.3) for the literal phase in (4.5).

The finite theorem does **not** need an assumed zero table, global Weil
positivity, or a quantitative boundary reserve.  The conditional limit needs
the repaired `Xi/4` prolate theorem, the omitted-tail correction, and the full
weighted error (7.8).  Real-axis eigenvalue agreement, strong-resolvent
convergence, or uncontrolled rescaling supplies none of these.
