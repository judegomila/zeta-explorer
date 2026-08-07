# Growing transition-family sampling and projection theorem

Status: source-locked positive Loewner component theorem.  This note lifts
the transition-mode bounds to arbitrary corrected source combinations,
retains all zero-sampling cross terms, and includes the compact log-Fourier
projection remainder on the existing exponential schedule.

It proves the previously missing defect-relative sampling constants for the
split plus blocks.  It does not identify a block-diagonal quotient metric
with a full cross-block exterior Gram, prove either shifted signed Weil
comparison, establish equation (5.2), or prove determinant convergence.  The
project state remains `P0_INVALIDATED`; no RH conclusion is made.

## 1. Corrected source combinations

Fix the locked schedule

\[
 \lambda={p\over2},\qquad p\ge5\text{ odd},
 \qquad c=2\pi\lambda^2.                                  \tag{1.1}
\]

Let `I` contain `q` even prolate labels in one residue class modulo four,
all strictly below the pinned transition index `n_star`.  For coefficients
`a_n`, put

\[
 g=\sum_{n\in I}a_nh_{n,\lambda},
 \qquad D(a)=\sum_{n\in I}d_n|a_n|^2,                       \tag{1.2}
\]

and suppose

\[
 \int_{\mathbb R}g=0.                                     \tag{1.3}
\]

For an arbitrary one-residue-class analytic family, necessarily

\[
 1\le q\le\left\lceil{n_*\over4}\right\rceil.             \tag{1.3a}
\]

This bound is replaced in the executable certificate by the sharper
split-plus inventory

\[
 q\le q_+(\lambda):=\left\lfloor{n_*-1\over4}\right\rfloor. \tag{1.3b}
\]

It contains the singleton inventory q <= 3 and the remaining plus-block
inventory in Section 4.  The analytic inequalities below apply to any
eligible fixed residue class, but the producer and verifier reject unused
larger inventories rather than extending the artifact claim beyond the split
plus application.

The previous theorem gives `mu_n<3c^2` for every `n<n_star`; no converse to
the KRD high-sector implication is used here.

Let

\[
 v_n=h_{n,\lambda}(0),\qquad
 I_n=\int h_{n,\lambda}=\sigma\chi_nv_n,                   \tag{1.4}
\]

where `sigma=(-1)^(n/2)` is constant on the residue class.  Equation (1.3)
therefore gives

\[
 A:=g(0)=\sum_na_n(1-\chi_n)v_n.                           \tag{1.5}
\]

The point evaluation is controlled without assuming `d_n<1/2`.  Rescale

\[
 y_n(z)=\sqrt\lambda\,h_{n,\lambda}(\lambda z).
\]

On `[-1/2,1/2]`, the differential form and `mu_n<3c^2` give

\[
 \int_{-1/2}^{1/2}|y_n'|^2\le4c^2.                         \tag{1.6}
\]

Some point of that unit interval has `|y_n|<=1`.  Integrating `(y_n^2)'`
from that point to zero gives

\[
 |v_n|^2\le V_0(\lambda),
 \qquad
 \boxed{V_0(\lambda)={1\over\lambda}+8\pi\lambda.}        \tag{1.7}
\]

Since

\[
 {(1-\chi_n)^2\over d_n}={1-\chi_n\over1+\chi_n}\le1,
\]

weighted Cauchy--Schwarz in (1.5) proves

\[
 \boxed{|A|^2\le qV_0(\lambda)D(a).}                       \tag{1.8}
\]

Apply the fixed invisible correction

\[
 f(x)=g(x)-A\psi(2\lambda x).                              \tag{1.9}
\]

Then `f(0)=integral(f)=0`.  Its support lies in
`|x|<1/(2lambda)`, so it is exactly invisible to the semilocal arithmetic
state on `C_lambda`; it must nevertheless remain inside the global radical
remainder.

## 2. Complete corrected outer bound

Use the fixed constants from the admitted weighted-translation theorem:

\[
 C_2={40\,3^{-1/4}e^{-(1+\sqrt3)/2}\over
                    (1-1/\sqrt3)^2},                       \tag{2.1}
\]

\[
 C_b={2C_2^2+(C_{\psi,3}+4C_2)^2\over36},
 \quad C_{\psi,3}=9(222816\sqrt e).                        \tag{2.2}
\]

Put

\[
 L_\lambda=1+\log(2+2\pi\lambda^2),
 \qquad E_0=1062724.                                      \tag{2.3}
\]

The modewise theorem, Hilbert-space Cauchy--Schwarz, and (1.8) give the
finite constants

\[
 \boxed{
 \mathcal E_q(\lambda)=q\left(
 \sqrt{E_0\lambda}\,L_\lambda
       +{C_2\sqrt{V_0}\over24\sqrt2}\right)^2,}           \tag{2.4}
\]

\[
 \boxed{
 \mathcal D_q(\lambda)=q\left(
 \sqrt{D_{\rm tr}(\lambda)}
       +\sqrt{{V_0C_b\over2}}\right)^2.}                   \tag{2.5}
\]

For every real `|y|<1/2`, `epsilon=1/2-|y|`, and `0<h<=1/2`, the complete
corrected outer state, including both reflected tails, satisfies

\[
 \|e^{y\,\cdot}O_f\|_2^2
 \le\mathcal E_q\epsilon^{-1}D(a),                         \tag{2.6}
\]

\[
 \|\tau_h(e^{y\,\cdot}O_f)-e^{y\,\cdot}O_f\|_2^2
 \le\mathcal D_q\epsilon^{-1}h^\epsilon D(a).             \tag{2.7}
\]

These are combined-state inequalities.  They do not discard modal or bump
cross terms.

Insert (2.6)--(2.7) into the already source-locked dyadic zero-sampling
argument.  With its exact `Z_finite`, `Z_j`, `delta_j`, and `phi_j`, define

\[
\boxed{
\begin{aligned}
 B_{{\rm out},q}(\lambda)={}&256Z_{\rm finite}\mathcal E_q\\
 &+\sum_{j\ge0}Z_j\delta_j^{-3}
 \min\left\{{512\over3}\mathcal E_q,
 {5120\over3}\mathcal D_qe^{-\phi_j}\right\}.
\end{aligned}}                                             \tag{2.8}
\]

This is an exact convergent positive series, not a numerical truncation.
Because both constants in the minimum are exactly linear in `q`,

\[
 B_{{\rm out},q}=qB_{{\rm out},1}
 =O\!\left(q\lambda\operatorname {polylog}\lambda\right). \tag{2.9}
\]

The qualitative estimate uses the explicit threshold proof already pinned
with (2.8); the finite theorem is (2.8).

## 3. Uniform compact projection remainder

Let

\[
 L=2\log\lambda,
 \qquad N=2^{2400p^2}=2^{9600\lambda^2},                   \tag{3.1}
\]

and retain the pinned all-index floor

\[
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2}.            \tag{3.2}
\]

We first give a uniform circular-variation bound.  The natural endpoint ODE
implies

\[
 |y_n'(z)|\le3c^2\|y_n\|_\infty.                           \tag{3.3}
\]

On a one-sided interval of length `1/(6c^2)` from a maximum, (3.3) keeps
`|y_n|` at least half its maximum.  Unit norm then gives

\[
 \|y_n\|_\infty\le\sqrt{24}\,c,
 \qquad \|Dh_{n,\lambda}\|_2\le23c^3.                    \tag{3.4}
\]

The arithmetic-piece variation and every hard endpoint jump therefore obey

\[
 \boxed{\operatorname {TV}_{\rm circle}(K_n)
       \le V_*(\lambda):=46\lambda c^3+108\pi\lambda^2.}  \tag{3.5}
\]

For the combination (1.2), ordinary Cauchy--Schwarz and (3.2) give

\[
 V(K_g)^2\le {qV_*^2\over d_{\rm LS}}D(a).                 \tag{3.6}
\]

The invisible correction changes neither `K_g` nor its projection.  Let
`P_f=(I-P_N)K_g`, zero extended from the compact logarithmic interval.  The
periodic BV tail theorem gives

\[
 \|P_f\|_2^2\le X_q(\lambda)D(a),
 \qquad
 \boxed{X_q={qLV_*^2\over2\pi^2Nd_{\rm LS}}.}              \tag{3.7}
\]

Also put

\[
 A_N=3(1+\sqrt{2N})+{3L\over4\pi\sqrt{2N}},                \tag{3.8}
\]

\[
 H_N=\max\left\{1,{2\pi^2NA_N^2\over L}\right\}.         \tag{3.9}
\]

The first term in (3.8) includes the complete zero-extension variation;
the second includes the weighted norm term in the compact BV theorem.
Crucially, the common factor `q*V_*^2/d_LS` cancels in (3.9).  There is no
second inverse-defect loss.

With the source-locked zero-count constants `Z_finite` and `C_Z`, define

\[
\boxed{
\begin{aligned}
 B_{{\rm proj},q}={}&192\sqrt e\,\lambda(1+\log\lambda)^2X_q\\
 &\times\left[Z_{\rm finite}+{C_Z\over\pi}
 \left((\pi+1)\log(H_N+2)+1\right)\right].
\end{aligned}}                                             \tag{3.10}
\]

Then

\[
 \|ZP_f\|^2\le B_{{\rm proj},q}D(a).                      \tag{3.11}
\]

On (3.1), `1/(N*d_LS)` has the same strictly positive exponent reserve
`2*M_2400` as the admitted projection theorem.  All remaining factors in
(3.10) are polynomial or logarithmic.  Hence

\[
 B_{{\rm proj},q}
 =O\!\left(q\operatorname {poly}(\lambda,\log\lambda)
              e^{-2M_{2400}\lambda^2}\right).              \tag{3.12}
\]

## 4. Loewner theorem and block scales

The complete radical remainder is `Y_f=O_f+P_f`.  Sequence Hilbert-space
Minkowski, not Weil positivity, gives

\[
 \boxed{C_q(\lambda)=
       \left(\sqrt{B_{{\rm out},q}}+
             \sqrt{B_{{\rm proj},q}}\right)^2,}            \tag{4.1}
\]

\[
 \boxed{\|ZY_f\|^2\le C_q(\lambda)D(a),
 \qquad C_q=O(q\lambda\operatorname {polylog}\lambda).}   \tag{4.2}
\]

Equivalently, for any coefficient synthesis `C` whose range consists of the
zero-integral combinations above,

\[
 \boxed{Y_C^*Z^*ZY_C
 \preceq C_q\,C^*\operatorname {diag}(d_n)C.}               \tag{4.3}
\]

All cross terms remain in (4.3).

For an arbitrary plus-anchor deflation,

\[
 \widetilde c_t=e_t-\alpha_te_4
       +(\rho_t-\rho_4\alpha_t)e_0,                         \tag{4.4}
\]

the exact source metric is

\[
 D_{\rm block}=D_T+d_4\alpha\alpha^*+d_0bb^*.              \tag{4.5}
\]

No estimate on `alpha` is needed.  The singleton target `8` uses at most
three modal rows, so

\[
 \boxed{C_8=O(\lambda\operatorname {polylog}\lambda).}     \tag{4.6}
\]

For the remaining targets `{12,16,...,<n_star}`, the modal-row count obeys

\[
 q\le\left\lfloor{n_*-1\over4}\right\rfloor
 \le {3\over2}\lambda^2.                                  \tag{4.7}
\]

Therefore

\[
 \boxed{C_{\rm rest}
 =O(\lambda^3\operatorname {polylog}\lambda).}             \tag{4.8}
\]

## 5. Exact claim boundary

This theorem closes the defect-relative outer and compact-projection
sampling input, including the transition buffer, origin correction, arbitrary
anchor deflation, and every cross term.

It does not permit replacing a full exterior source Gram by its diagonal
block compressions.  A blockwise quotient argument must explicitly define a
block-diagonal source metric; otherwise cross-block source entries can change
the inverse action.  Physical synthesis factors and both shifted signed Weil
comparisons remain separate.  Nothing here proves equation (5.2), locally
uniform determinant convergence, or RH.
