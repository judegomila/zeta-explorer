# The `q`-shifted sector signs already contain the Weil criterion

## 0. Claim boundary and exact outcome

This note concerns the **stronger Rayleigh-shift route**

\[
 B_q:=P_{\kappa^\perp}(Q_+-qI)P_{\kappa^\perp}>0,
 \qquad C_q:=Q_--qI>0,                              \tag{0.1}
\]

where

\[
 q=\langle\kappa,Q_+\kappa\rangle,
 \qquad b=(Q_+-qI)\kappa,
 \qquad r=\|b\|.                                    \tag{0.2}
\]

It is not the weaker Ritz-shift route in `DIRECT_RH_ATTACK.md`, where the
common shift may be `U=u<q`.  The distinction is essential.

There are three exact conclusions.

1. At every finite parameter, (0.1) implies the full matrix lower bound

   \[
    \boxed{Q\succeq(q-r)I.}                           \tag{0.3}
   \]

   The coefficient of `r` is sharp without a quantitative complement
   floor.
2. On the source-normalized Gevrey diagonal

   \[
    L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil, \tag{0.4}
   \]

   the already admitted estimate `|q|+r=O(exp(-c lambda L^2))` and the
   widening Fourier-core property imply that (0.1), if proved eventually,
   would force nonnegativity of the global Weil form on every compact smooth
   convolution square.
3. By the Weil criterion, that derived global nonnegativity would force all
   nontrivial zeta zeros onto the critical line.  Thus a proof of both
   `q`-shifted signs on (0.4) is already an RH-level theorem.  Passing to a
   sparse unbounded subsequence does not avoid this implication.

These are conditional implications.  This note does **not** establish either
sign in (0.1), does not assume global Weil positivity, and does not prove the
Riemann hypothesis.  It also does not show that the original `u`-shifted
signs alone imply global positivity: an uncontrolled lowering `q-u` is
precisely excluded from the argument below.  The formal project state remains
`P0_INVALIDATED`.

All finite matrices are the complete source-pinned pole--archimedean--prime
matrices.  The prime block keeps the minus sign of source equation (3.19),
and every prime power through `n<=lambda^2` remains included.  No zero table,
zero-reality premise, or cached matrix is used.

## 1. Exact finite lower bound

Let `Q=Q_+ direct_sum Q_-` be Hermitian in the inversion decomposition, let
`kappa` be a unit even vector, and use (0.2).  Put

\[
 \mathcal K=H_+\cap\kappa^\perp.
\]

Relative to `H_+=C kappa direct_sum mathcal K`, the Rayleigh identity gives

\[
 Q_+-qI=
 \begin{bmatrix}0&b^*\\ b&B_q\end{bmatrix}.          \tag{1.1}
\]

### Theorem 1.1 (Rayleigh-sector floor)

If `B_q` and `C_q` are positive semidefinite, then

\[
 \boxed{Q_+\succeq(q-r)I,\qquad Q_-\succeq qI,
        \qquad Q\succeq(q-r)I.}                     \tag{1.2}
\]

The same conclusion holds, a fortiori, under the strict signs (0.1).

**Proof.**  Write an even vector as `x=a kappa+v`, with `v in mathcal K`.
Equation (1.1) gives

\[
 \begin{aligned}
 \langle x,(Q_+-qI)x\rangle
 &=2\operatorname {Re}\{\overline a\langle b,v\rangle\}
   +\langle v,B_qv\rangle\\
 &\geq-2r|a|\,\|v\|\\
 &\geq-r(|a|^2+\|v\|^2)=-r\|x\|^2.                \tag{1.3}
 \end{aligned}
\]

This proves the even bound.  The odd assumption is exactly
`Q_- >= qI`, which is stronger than `Q_- >= (q-r)I`.  Inversion reduces
`Q`, so the two sector bounds prove (1.2).  No lower eigenvalue of either
sector was inserted.  \(\square\)

There is a sum-of-squares version of (1.3).  If `r>0`, put `e=b/r`.  After
discarding the nonnegative `B_q` term,

\[
 \begin{aligned}
 &r|a|^2+2\operatorname {Re}\{\overline a\langle b,v\rangle\}
       +r\|v\|^2\\
 &\qquad=r|a+\langle e,v\rangle|^2
       +r\{\|v\|^2-|\langle e,v\rangle|^2\}\geq0. \tag{1.4}
 \end{aligned}
\]

This also verifies the complex-inner-product convention directly.

### Sharpness

Take a one-dimensional complement, `b=[r]`, and `B_q=[epsilon]` with
`r>0`, `epsilon>0`.  The two eigenvalues of (1.1) are

\[
 {\epsilon\mathbin\pm\sqrt{\epsilon^2+4r^2}\over2}. \tag{1.5}
\]

The lower one tends to `-r` as `epsilon` decreases to zero.  Consequently
no universal bound `Q_+ >= (q-c r)I` with `c<1` follows from the qualitative
sign `B_q>0`.  A better coefficient requires a quantitative complement
floor or an inverse-weighted orientation estimate.

## 2. One eigenvector-free simultaneous sign polynomial

The conjunction (0.1) can be reconstructed from source entries and the
projected anchor without a stored eigenvector or eigenvalue.  Define the
monic degree-`2N` polynomial

\[
 \mathcal P_q(s)=\det(B_q+sI)\det(C_q+sI)
                =\sum_{j=0}^{2N}c_js^j.              \tag{2.1}
\]

Both factors are characteristic polynomials of Hermitian matrices, so all
zeros of `mathcal P_q` are real.

### Theorem 2.1 (simultaneous coefficient cone)

At every fixed finite parameter,

\[
 \boxed{B_q>0\ \hbox{and}\ C_q>0
 \quad\Longleftrightarrow\quad
 c_j>0\quad(0\leq j\leq2N).}                       \tag{2.2}
\]

**Proof.**  If both matrices are positive, (2.1) is a product of factors
`s+nu` with `nu>0`, so every coefficient is positive.  Conversely, positive
coefficients make `mathcal P_q(s)>0` for every `s>=0`.  A negative eigenvalue
of either matrix would give a positive zero of (2.1), and a zero eigenvalue
would make `c_0=0`.  Both are impossible.  \(\square\)

The two factors have source-adjugate reconstructions.  With

\[
 S_q=Q_+-qI,
\]

the orthogonal-compression identity is

\[
 \det(B_q+sI)
 =\langle\kappa,\operatorname {adj}(S_q+sI)\kappa\rangle. \tag{2.3}
\]

Let `delta(f)=<eta,f>`, let `e_0=V_0`, and retain `delta(e_0)=1`.  The exact
source characteristic-ratio identity in
`notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md` gives

\[
 \det(C_q+sI)
 =\delta\!\left(\operatorname {adj}(S_q+sI)e_0\right). \tag{2.4}
\]

Equations (2.1), (2.3), and (2.4) therefore reconstruct the complete finite
gate from the combined source matrix before any absolute value is taken.
The criterion is not an asymptotic sign estimate: proving its whole growing
coefficient cone is exactly the missing arithmetic work.  A positive
determinant alone is insufficient because an even number of negative
eigenvalues leaves the constant coefficient positive.

## 3. The widening centered-Fourier spaces are a Weil-form core

Use the additive interval

\[
 I_L=[-L/2,L/2]
\]

with Lebesgue measure and zero extension.  The locked source modes are

\[
 V_n(x)=L^{-1/2}\exp\!\left({2\pi in(x+L/2)\over L}\right)
       =(-1)^nL^{-1/2}e^{2\pi inx/L}.                \tag{3.1}
\]

Thus the centered phase changes coefficients but not the Fourier subspace.
Let `P_(L,N)` be the orthogonal projection onto their span.

Fix first a real `f in C_c^infinity(R)`.  For all sufficiently large `L`, the function
`f` vanishes on a neighborhood of both endpoints of `I_L`, so it is a
smooth periodic function there.  With the locked transform

\[
 \widehat f(t)=\int_{\mathbb R}f(x)e^{-itx}\,dx,      \tag{3.2}
\]

its centered Fourier coefficient is exactly

\[
 \langle V_n,f\rangle
 =(-1)^nL^{-1/2}\widehat f(2\pi n/L).                \tag{3.3}
\]

Put `f_(L,N)=P_(L,N)f` on `I_L`, extend it by zero, and set
`g_(L,N)=f_(L,N)-f`.  Repeated integration by parts in (3.2), Parseval, and
the integral test give, for every integer `m>=2`, with

\[
 \Omega={2\pi(N+1)\over L},                           \tag{3.4}
\]

the bounds

\[
 \|g_{L,N}\|_2\leq C_{f,m}\Omega^{-m+1/2},           \tag{3.5}
\]

\[
 \operatorname {TV}_{\mathbb R}(g_{L,N})
 \leq C_{f,m}\{\sqrt L\,\Omega^{-m+3/2}
                         +\Omega^{-m+1}\}.           \tag{3.6}
\]

The second term includes the two zero-extension jumps.  Indeed the complete
periodic Fourier series has endpoint value zero, so the partial-sum endpoint
value is the omitted coefficient tail and is bounded by the second term.
The first term follows from Cauchy--Schwarz and the `L2` derivative tail.

For every `|v|<=3/4`, multiplication by `e^(vx)` costs at most

\[
 e^{3L/8}=\lambda^{3/4}.                              \tag{3.7}
\]

On (0.4), `Omega` is asymptotic to `2*pi*lambda*L^2`.  Since `m` in
(3.5)--(3.6) is arbitrary, their exponentially weighted versions decrease
faster than any prescribed power of `lambda` after `m` is chosen.

Apply the unconditional compact-BV two-evaluation sampler from
`notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` to `g_(L,N)`.  Substitution of
(3.5)--(3.6) in its explicit equation (2.17) is made using the monotonicity
proved in equations (3.14)--(3.15) of that note:

\[
 x\longmapsto x\log\{2+\max(1,a/x)\}
 \quad\hbox{is increasing for every fixed }a\geq0.  \tag{3.7a}
\]

Thus upper bounds for the tail norm and variation may be inserted without
silently dividing one upper bound by another; no lower bound for the actual
tail norm is required.  For `Omega>=1` this gives

\[
 \|g_{L,N}\|_{\mathfrak Z}^2
 \leq C_{f,m}\lambda L^2\Omega^{-2m+1}
       \{1+\log(L\Omega^2+2)\}.                     \tag{3.7b}
\]

The factor `lambda` is the sampler's complete strip-weight cost; the
logarithm contains the variation-to-`L2` quotient and the zero-extension
jumps.  Since `Omega` is asymptotic to `2*pi*lambda*L^2`, the right side
tends to zero (indeed faster than any prescribed power after `m` is
chosen).  Hence

\[
 \boxed{\|g_{L,N}\|_{\mathfrak Z}\longrightarrow0}    \tag{3.8}
\]

on (0.4).  This is a positive absolute-sampling statement, not assumed
Weil positivity.  Sequence Cauchy--Schwarz for the two zero evaluations
then gives

\[
 \boxed{\mathcal W(f_{L,N},f_{L,N})
             \longrightarrow\mathcal W(f,f).}       \tag{3.9}
\]

Indeed, expand with `f_(L,N)=f+g_(L,N)`; the fixed smooth function has finite
absolute sampling norm, and every term containing `g_(L,N)` tends to zero
by (3.8).  Equations (3.3)--(3.9) prove the required Weil-form core property
with the locked Fourier sign, centered phase, Lebesgue measure, and zero
extension all retained.  Complex test functions follow by applying the same
argument to real and imaginary parts and using polarization.

The argument only needs an unbounded schedule whose cutoff makes the
right-hand sides of (3.5)--(3.7) beat the sampler prefactor.  In particular,
it applies to every subsequence of (0.4); no density of the selected values
of `L` is used.

## 4. Conditional passage to global Weil positivity

On (0.4), let `kappa_(lambda,N)` be the source-normalized projected prolate
anchor and let `q_(lambda,N),r_(lambda,N)` be (0.2).  Equations (4.7a)--(4.8)
of `notes/PROLATE_ENDPOINT_SCHUR_SINGULAR_ASYMPTOTICS.md`, equivalently
equation (5.1) of
`notes/PROLATE_COMPLETE_LEAKAGE_HIGHER_RITZ_NO_GO.md`, prove the admitted
non-effective bound

\[
 \boxed{|q_{\lambda,N}|+r_{\lambda,N}
       =O\!\left(e^{-c\lambda L^2}\right)}            \tag{4.1}
\]

for some qualitative `c>0`.  This estimate uses the source normalization;
unit-normalizing `h_lambda` is not an admissible replacement.

### Theorem 4.1 (`q`-shift signs imply the Weil criterion)

Assume that both strict signs (0.1) hold for every sufficiently large member
of an unbounded subsequence of (0.4).  Then

\[
 \mathcal W(f,f)\geq0\qquad(f\in C_c^\infty(\mathbb R)). \tag{4.2}
\]

Consequently the Weil criterion places every nontrivial zeta zero on the
critical line.

**Proof.**  Fix `f` and take the finite vector `f_(L,N)` from Section 3.
The exact finite matrix represents its compact Weil form, so Theorem 1.1
gives

\[
 \mathcal W(f_{L,N},f_{L,N})
 \geq(q_{\lambda,N}-r_{\lambda,N})\|f_{L,N}\|_2^2. \tag{4.3}
\]

Parseval and (3.5) give `||f_(L,N)||_2 -> ||f||_2`.  The right side of
(4.3) tends to zero by (4.1).  Passing to the limit with (3.9) proves (4.2).
The last statement is the classical Weil positivity criterion.  Positivity
has been derived from the finite hypotheses; it was not inserted as an
assumption.  \(\square\)

The theorem explains the exact limitation of a shrinking-floor campaign.
The first odd Fourier mode can have favorable sign on a sparse subsequence
even in the right-zero branch, as audited in
`notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md`.  The **two complete
sector signs** cannot exploit that escape: together they give the full lower
bound (0.3), and the widening Fourier core tests every fixed compact
direction along the same sparse subsequence.

## 5. Why the original Ritz-shift route is different

Let `U<=q` be another common shift and suppose instead that

\[
 P_{\kappa^\perp}(Q_+-UI)P_{\kappa^\perp}>0,
 \qquad Q_--UI>0.                                    \tag{5.1}
\]

The proof of Theorem 1.1 gives only

\[
 \boxed{Q\succeq(U-r)I.}                             \tag{5.2}
\]

Indeed the additional diagonal term `(q-U)|a|^2` is nonnegative, but it
does not replace the unknown value of `U`.  Therefore (5.1) yields the Weil
criterion by this argument only with the additional asymptotic input

\[
 U-r\longrightarrow0
 \quad\hbox{from below, for example}\quad
 |q|+(q-U)+r\longrightarrow0.                        \tag{5.3}
\]

For the mandatory two-vector Ritz value `u`, the lowering `q-u` depends on
the normalized beyond-all-orders residual direction and is not controlled
by (4.1).  The original shifted signs in `DIRECT_RH_ATTACK.md` therefore do
not, by themselves, fall under Theorem 4.1.  Their separate weighted ground
comparison in equation (5.2) remains essential.

## 6. Exact frontier

For the stronger `q`-shift route used in the checkpoint-0.65 soft-trace
decomposition, the sign obligation cannot be treated as a preliminary
technical lemma below the RH threshold.  On the admitted source-normalized
diagonal, proving both signs already derives the global Weil criterion.

The smallest eigenvector-free finite source gate isolated here is the full
coefficient cone (2.2), reconstructed by the two adjugate responses
(2.3)--(2.4).  No fixed collection of moments, finite height samples,
absolute prime-number-theorem envelope, or shrinking unsigned floor can
replace that signed growing cone: existing exact Cauchy countermodels allow
an even number of negative directions while preserving a positive
determinant and any preassigned compact response window.

This identifies the honest stopping point.  A successful proof of the
`q`-shift signs must contain genuinely RH-level signed arithmetic
information.  The present note supplies the implication and its exact
finite lower bound, not that missing information.
