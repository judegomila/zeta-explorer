# Compact projection--projection Weil bound on the locked diagonal

Status: analytic component theorem.  This note proves that the pure compact
Fourier projection--projection term is negligible at the geometric-mean
prolate-defect scale for fixed labels `0` and `4` on the locked diagonal.  It
does not treat a physical outer remainder, an outer--projection cross term, a
sector floor, equation (5.2) of `DIRECT_RH_ATTACK.md`, or a determinant limit.

The two inputs are:

1. `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md`, including its exact source
   lock and schedule; and
2. `notes/HIGH_FOURIER_COERCIVITY.md`, derived from the pinned
   Connes--Consani--Moscovici finite matrix with
   `Q=W_0,2-W_R-W_p`.

No positivity of the Weil form is used.

## 1. Locked states and schedule

Let

\[
 \lambda_j=j+\frac12,
 \qquad N_j=2^{2400(2j+1)^2},
 \qquad j\in\mathbb Z,\quad j\geq2.                         \tag{1.1}
\]

Put `ell=log(lambda)`, `L=2ell`, and use exactly the source orthonormal
Fourier basis

\[
 V_r(t)=L^{-1/2}\exp\!\left(2\pi i r(t+\ell)/L\right).        \tag{1.2}
\]

For each fixed normalized prolate label \(n\in\{0,4\}\), let

\[
 K_n(t)=\frac{E(h_{n,\lambda})(e^t)+E(h_{n,\lambda})(e^{-t})}{2},
 \qquad
 P_{n,j}=(I-P_{N_j})K_n.                                    \tag{1.3}
\]

Thus `P_(n,j)` is the compact log-Fourier projection remainder; it is not the
physical remainder outside the source interval.  Let

\[
 d_n=1-\chi_n(\lambda_j)^2.                                  \tag{1.4}
\]

The defect-relative theorem defines the explicit quantity

\[
 \rho_j=R_{\rm bulk}(\lambda_j,N_j)
       +R_{\rm jump}(\lambda_j,N_j),                          \tag{1.5}
\]

with the formulas in its equation (6.2), and proves

\[
 \frac{\|P_{n,j}\|_2}{\sqrt{d_n}}\leq\rho_j,                 \tag{1.6}
\]

as well as

\[
 \sum_{|r|>N_j}\log(2+|r|)|p_{n,j,r}|^2
 \leq d_n\rho_j^2 W_j,                                      \tag{1.7}
\]

where

\[
 W_j=\log(3N_j)+1
 =1+\log3+2400(2j+1)^2\log2.                                 \tag{1.8}
\]

The coefficient `p_(n,j,r)` in (1.7) uses (1.2), including its shift by
`ell`; no unit-circle normalization is substituted.

## 2. Closure of the infinite Cauchy form

For every symmetric finite mode range `[-R,R]`, source Lemma 5.1 gives

\[
 Q_{rr}=a_r,
 \qquad Q_{rs}=\frac{b_r-b_s}{r-s}\quad(r\ne s).              \tag{2.1}
\]

The coefficients are restrictions of single sequences indexed by
\(\mathbb Z\).  Define on \(\ell^2(\mathbb Z)\)

\[
 H_{rs}=\begin{cases}(r-s)^{-1},&r\ne s,\\0,&r=s,
 \end{cases}
 \qquad D_b=\operatorname{diag}(b_r).                         \tag{2.2}
\]

The Fourier multiplier of `H` is, up to the locked harmless sign,
`i(theta-pi)` on `(0,2pi)`, so

\[
 \|H\|=\pi.                                                   \tag{2.3}
\]

The explicit source estimate in `HIGH_FOURIER_COERCIVITY.md` proves

\[
 \sup_r|b_r|\leq B_b(\lambda),
 \qquad
 \|D_bH-HD_b\|\leq c_\lambda:=2\pi B_b(\lambda).             \tag{2.4}
\]

It also proves, for every \(r\ne0\),

\[
 |a_r|\leq\log(2+|r|)+C_{|a|}(\lambda),                       \tag{2.5}
\]

where, with

\[
 \sigma_L=\log\!\left(\frac{L}{2\tanh(L/2)}\right),
\]

the finite constant is exactly

\[
\begin{aligned}
 C_{|a|}(\lambda)={}&
 \frac{8(\lambda+\lambda^{-1}-2)}{L}
 +\lambda+2\sigma_L+4L(\lambda-1)\\
 &+\log\coth(L/2)+\frac1{2\pi}.                              \tag{2.6}
\end{aligned}
\]

Here `C_a(lambda)` denotes the first line of (2.6), before the final
`log(coth(L/2))+1/(2*pi)` absolute-value additions, exactly as in the
high-mode theorem.

There is no unspecified finite diagonal constant in (2.6).

Let

\[
 \mathcal D_{\log}=
 \left\{x=(x_r):
   \sum_r\log(2+|r|)|x_r|^2<\infty\right\}.                   \tag{2.7}
\]

For `x,y` in this space define

\[
 q_\lambda(x,y)=
 \sum_r a_r\overline{x_r}y_r
 +\langle x,(D_bH-HD_b)y\rangle.                              \tag{2.8}
\]

The diagonal series is absolutely convergent by weighted Cauchy--Schwarz,
and the second term is well defined by (2.4).  More precisely, for vectors
whose zero coordinate vanishes, put

\[
 \mathcal E_\lambda(x)=
 \sum_r\bigl(\log(2+|r|)+C_{|a|}(\lambda)\bigr)|x_r|^2.
\]

Then

\[
 |q_\lambda(x,y)|
 \leq\sqrt{\mathcal E_\lambda(x)\mathcal E_\lambda(y)}
      +c_\lambda\|x\|_2\|y\|_2.                             \tag{2.9}
\]

This is ordinary Cauchy--Schwarz for the explicit positive diagonal weight,
not Cauchy--Schwarz in the sign-indefinite Weil form.

For completeness, the form-domain assertion is two-sided rather than merely
an upper estimate.  Put

\[
 D_\lambda=C_a(\lambda)+\frac1{2\pi},
 \qquad
 R_\lambda=\left\lceil
 2\exp\!\left(\max\{2D_\lambda,\log4\}\right)\right\rceil.
\]

The lower diagonal estimate (4.7) of the high-mode theorem implies, for
`|r|>=R_lambda`,

\[
 a_r\geq\frac14\log(2+|r|)>0.                                \tag{2.10}
\]

Together with (2.5), this makes the form domain of the semibounded diagonal
operator exactly `D_log`; the finitely many smaller modes do not alter the
domain.  In particular, the single finite source entry `a_0` changes neither
the domain nor the tail estimate.  Finite sequences are dense in its form
norm.

To identify (2.8), let `x^(R),y^(R)` be symmetric finite Fourier
truncations.  The diagonal tails converge by (2.5), and the off-diagonal
tails converge because `D_bH-HD_b` is bounded.  Hence

\[
 q_\lambda(x,y)=\lim_{R\to\infty}
 \langle x^{(R)},Q_{\lambda,R}y^{(R)}\rangle.                 \tag{2.11}
\]

On trigonometric polynomials the right side is exactly the complete signed
source distribution, with its pole, archimedean, and minus-prime terms.
The precise pinned-source chain is:

1. CCM-ZST-v1 p. 8, Proposition 3.3 states that `QW_lambda` is lower
   bounded and lower semicontinuous;
2. p. 8, Proposition 3.4 states that the space `E` generated by all `V_r`
   is a core for `QW_lambda`; and
3. p. 9, the paragraph immediately after the four equivalent conditions
   explicitly says that Proposition 3.3 supplies condition (3), hence the
   form is closed, and then invokes the representation theorem for lower
   semibounded closed forms.

Thus the source semilocal Weil form is unconditionally closed and lower
semibounded and has the stated trigonometric core.  The lower diagonal
estimate from the high-mode theorem shows that
the diagonal form in (2.8) is itself lower semibounded and closed on
`D_log`; adding the bounded operator in (2.4) preserves those properties.
Uniqueness of the closure of the common core therefore identifies (2.8) with
the source semilocal Weil form on `D_log`.

This closure step invokes semiboundedness, not positivity.  No zeta-zero
location or zero table enters it.

## 3. Defect-relative projection--projection theorem

By (1.6)--(1.7),

\[
 \frac{\mathcal E_{\lambda_j}(P_{n,j})}{d_n}
 \leq\rho_j^2\bigl(W_j+C_{|a|}(\lambda_j)\bigr).              \tag{3.1}
\]

Because `P_(n,j)=(I-P_(N_j))K_n` and `N_j>=0`, its zero Fourier coordinate
vanishes exactly.  Thus the hypothesis used in (2.9) is satisfied.

Apply (2.9) to labels \(n,m\in\{0,4\}\).  This proves the explicit finite
bound

\[
 \boxed{
 \frac{|QW_{\lambda_j}(P_{n,j},P_{m,j})|}
      {\sqrt{d_nd_m}}
 \leq
 \mathcal B_j,}                                               \tag{3.2}
\]

where

\[
 \boxed{
 \mathcal B_j=\rho_j^2
 \left(W_j+C_{|a|}(\lambda_j)+c_{\lambda_j}\right).}          \tag{3.3}
\]

All three blocks remain combined in the left side.  The right side is an
absolute continuity bound for that complete signed form; no sign is assigned
to it.

**Theorem 3.1.** For every fixed \(n,m\in\{0,4\}\), on (1.1),

\[
 \boxed{
 \frac{QW_{\lambda_j}(P_{n,j},P_{m,j})}
      {\sqrt{d_nd_m}}\longrightarrow0.}                       \tag{3.4}
\]

**Proof.** The locked projection theorem gives

\[
 \rho_j=\operatorname{poly}(\lambda_j,\sqrt{\log\lambda_j})
             e^{-M_{2400}\lambda_j^2}
       +\operatorname{poly}(\lambda_j,\sqrt{\log\lambda_j})
             e^{-4800\log2\,\lambda_j^2},                    \tag{3.5}
\]

with the exact positive margin

\[
 M_{2400}=4800\log2-\frac{160\pi\log96}{\log2}>0.
\]

This is only shorthand for the exact displayed formula (6.2) of the input
theorem; no finite constant is hidden.  Equation (1.8) is quadratic in
`lambda_j`.  Equations (2.4), (2.6), and (2.3) of the high-mode input theorem
show explicitly that `c_lambda` and `C_|a|` grow at most like a fixed
polynomial times `log(lambda_j)`.  Therefore the exact right side of (3.3)
tends to zero exponentially.  Equation (3.2) proves (3.4). \(\square\)

## 4. Exact source-combination corollary

For completeness, retain the source scalar

\[
 a_4=\frac{\sqrt3}{2^{11/4}},
 \qquad
 K_\lambda=a_4K_4-a_{0,\lambda}K_0,
 \qquad
 \left|a_{0,\lambda}/a_4\right|\leq2\sqrt2\lambda.            \tag{4.1}
\]

Let `P_(lambda,j)=(I-P_(N_j))K_lambda`.  Since `d_0<=d_4`, bilinearity and
(3.2) give

\[
 \frac{|QW_{\lambda_j}(P_{\lambda,j},P_{\lambda,j})|}{d_4}
 \leq a_4^2(1+2\sqrt2\lambda_j)^2\mathcal B_j
 \longrightarrow0.                                           \tag{4.2}
\]

This uses the source normalization and is not a unit-norm replacement.

## 5. Independent replay and limitations

`src/compact_projection_weil_bound.py` evaluates (3.3) with outward dyadic
intervals after validating both source locks.  The independent replay
reconstructs the schedule, relative projection terms, Cauchy constants, and
combined multiplier directly from `j`; it does not read a matrix or trust a
producer pass boolean.  Both paths use the `mpmath.iv` library, and report
that shared-library limitation.

This result itself closes exactly one of the four remainder correlations:
the compact projection--projection term.  The successor theorem
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` closes both mixed orientations
for the actual corrected, source-normalized combined `0/4` state by applying
the two-sided radical identity before the coefficient estimates.  That
successor is not a modewise radical assertion or a generic outer multiplier
theorem.  The physical outer--outer term and the signed low-sector floor
remain open.
