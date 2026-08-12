# Favorable odd direction at the locked exponential bandwidth

## 0. Claim boundary

`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md` proves an unconditional,
source-selected infinite subsequence on which the complete unprojected odd
pole-axis form is positive with linear reserve.  Its finite Fourier transfer
chooses a non-effective cutoff separately at every selected parameter.

This note proves that, on the locked grid

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
\]

the already locked exponential cutoff

\[
 N_{\exp}(\lambda)=2^{9600\lambda^2}                    \tag{0.1}
\]

is eventually sufficient on that same subsequence.  The proof uses the
exact pole coefficients and the closed Cauchy-form estimate; the pole,
archimedean, and minus-prime terms remain combined in the complete form.

The conclusion is one positive odd direction.  It is not an odd-sector
floor and does not control the transverse harmonic short.  It proves neither
equation (5.2), locally uniform determinant convergence, nor the Riemann
hypothesis.  The formal project state remains `P0_INVALIDATED`.

## 1. Locked pole vector and Fourier coefficients

Put

\[
 \ell=\log\lambda,
 \qquad L=2\ell,
 \qquad I_\lambda=[-\ell,\ell],
 \qquad p_\lambda(x)=\sinh(x/2).                         \tag{1.1}
\]

Its exact norm is

\[
 \mu_\lambda=\|p_\lambda\|_2^2
 ={\lambda-\lambda^{-1}-L\over2}.                       \tag{1.2}
\]

Use the centered source modes

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{2\pi inx/L},
 \qquad \omega_n={2\pi n\over L}.                       \tag{1.3}
\]

Direct integration gives, for every integer `n`,

\[
 \boxed{
 c_n:=\langle\phi_n,p_\lambda\rangle
 ={2i\omega_n\sinh(\ell/2)
   \over\sqrt L(\omega_n^2+1/4)}.}                     \tag{1.4}
\]

In particular, `c_0=0` and `c_(-n)=-c_n`.

For `N>=1`, let

\[
 p_N=P_Np_\lambda,
 \qquad r_N=(I-P_N)p_\lambda.                            \tag{1.5}
\]

Define

\[
 A_N={2L\sinh^2(\ell/2)\over\pi^2N}.                   \tag{1.6}
\]

### Lemma 1.1 (explicit pole tails)

One has

\[
 \boxed{\|r_N\|_2^2\leq A_N.}                           \tag{1.7}
\]

Let `C_|a|(lambda)` be the exact diagonal constant in equation (2.6) of
`notes/COMPACT_PROJECTION_WEIL_BOUND.md`, and put

\[
 \mathcal E_\lambda(v)
 =\sum_{n\ne0}
  \bigl(\log(2+|n|)+C_{|a|}(\lambda)\bigr)|v_n|^2.      \tag{1.8}
\]

Then

\[
 \boxed{
 \mathcal E_\lambda(r_N)
 \leq E_{\rm tail}:=
 A_N\bigl(\log(3N)+1+C_{|a|}(\lambda)\bigr),}          \tag{1.9}
\]

and

\[
 \boxed{
 \mathcal E_\lambda(p_\lambda)
 \leq E_{\rm full}:=
 {4L\sinh^2(\ell/2)\over\pi^2}\zeta(3/2)
 +C_{|a|}(\lambda)\mu_\lambda.}                       \tag{1.10}
\]

**Proof.**  Equation (1.4) gives

\[
 |c_n|^2
 \leq {L\sinh^2(\ell/2)\over\pi^2n^2}
 \qquad(n\ne0).                                        \tag{1.11}
\]

Retaining both signs and using
`sum_(n>N)n^(-2)<=1/N` proves (1.7).  For `n>=1`,
`log(n+2)<=log(3n)`.  For `N>=2`, `log(x)/x^2` is decreasing on every
interval used by the integral test, and

\[
 \sum_{n>N}{\log n\over n^2}
 \leq\int_N^\infty{\log x\over x^2}\,dx
 ={\log N+1\over N},                                    \tag{1.12}
\]

so equation (1.9) follows.  Finally, the elementary inequality
`log(n+2)<=2*sqrt(n)` and Parseval give

\[
 \sum_{n\ne0}\log(2+|n|)|c_n|^2
 \leq {4L\sinh^2(\ell/2)\over\pi^2}\zeta(3/2),         \tag{1.13}
\]

while the constant part is exactly
`C_|a|(lambda)*mu_lambda`.  This proves (1.10).  \(\square\)

For `N=1`, write `f(x)=log(x)/x^2`.  Since `f` decreases on `[2,infinity)`,

\[
 \sum_{n=2}^\infty{\log n\over n^2}
 \leq f(2)+f(3)+\int_3^\infty f(x)\,dx
 ={1\over3}+{\log2\over4}+{4\log3\over9}
 <{359\over360}<1,                                      \tag{1.14}
\]

where the strict rational bound uses `log(2)<7/10` and `log(3)<11/10`.
Thus (1.12), in the only form needed for (1.9), also holds at `N=1`; no
asymptotic starting index is hidden.

## 2. Quantitative complete-form transfer

Let `q_lambda` be the closed complete source form on the logarithmic Fourier
domain, including the negative odd pole.  On odd vectors its finite
compressions agree with the exact finite odd Weil matrices.  Let

\[
 c_\lambda=2\pi B_b(\lambda)                              \tag{2.1}
\]

be the exact bounded-Cauchy constant from
`notes/HIGH_FOURIER_COERCIVITY.md`.

The closed form estimate in equation (2.9) of
`notes/COMPACT_PROJECTION_WEIL_BOUND.md` is

\[
 |q_\lambda(x,y)|
 \leq\sqrt{\mathcal E_\lambda(x)
                   \mathcal E_\lambda(y)}
      +c_\lambda\|x\|\,\|y\|.                         \tag{2.2}
\]

### Theorem 2.1 (explicit pole-axis projection error)

For every `lambda>1` and integer `N>=1`,

\[
\boxed{
\begin{aligned}
 |q_\lambda(p_\lambda,p_\lambda)
      -q_\lambda(p_N,p_N)|
 \leq{}&E_{\rm tail}+c_\lambda A_N\\
 &+2\sqrt{E_{\rm full}E_{\rm tail}}
 +2c_\lambda\sqrt{\mu_\lambda A_N}.
\end{aligned}}                                           \tag{2.3}
\]

**Proof.**  Since `p_lambda=p_N+r_N` and the form is Hermitian,

\[
 q_\lambda(p_\lambda,p_\lambda)-q_\lambda(p_N,p_N)
 =q_\lambda(r_N,r_N)+2\operatorname {Re}q_\lambda(p_N,r_N).
                                                               \tag{2.4}
\]

Apply (2.2), Lemma 1.1,
`mathcal E_lambda(p_N)<=mathcal E_lambda(p_lambda)<=E_full`,
and `||p_N||<=sqrt(mu_lambda)`.  \(\square\)

For fixed `lambda`, the right side of (2.3) tends to zero.  Equations
(6.4)--(6.5) of `notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md` identify the
same finite compressions with the unprojected complete pole form.  Therefore

\[
 \boxed{q_\lambda(p_\lambda,p_\lambda)=\mathcal G_\lambda.} \tag{2.5}
\]

The energy-form estimate (2.2) is applied only after the source blocks have
been assembled.  Equation (2.3) is not obtained by taking separate norms of
the pole, archimedean, and prime matrices.

## 3. The locked exponential cutoff

On the locked half-integer grid write

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad N_{\exp}=2^{2400p^2}=2^{9600\lambda^2}.           \tag{3.1}
\]

The explicit source constants satisfy

\[
 C_{|a|}(\lambda)=O(\lambda\log\lambda),
 \qquad c_\lambda=O(\lambda\log\lambda),
 \qquad \mu_\lambda=O(\lambda).                         \tag{3.2}
\]

Also

\[
 A_{N_{\exp}}
 =O\!\left({\lambda\log\lambda\over N_{\exp}}\right),
 \qquad
 \log N_{\exp}=O(\lambda^2).                            \tag{3.3}
\]

Equations (1.9)--(1.10) and (3.2)--(3.3) show that every term on the right
of (2.3) tends to zero.  Thus

\[
 \boxed{
 q_\lambda(p_{\lambda,N_{\exp}},p_{\lambda,N_{\exp}})
 -q_\lambda(p_\lambda,p_\lambda)\longrightarrow0}      \tag{3.4}
\]

along the full locked half-integer grid.

The locked cutoff is large enough to make this transfer effective from the
first parameter.  For `lambda>=5/2`, elementary inequalities give

\[
 1<L\leq\lambda,
 \qquad 0\leq\sigma_L\leq L,
 \qquad \sinh^2(\ell/2)\leq{\lambda\over4},
 \qquad \mu_\lambda<{\lambda\over2}.                    \tag{3.5}
\]

Here `sigma_L` is the exact constant in equation (2.1) of
`notes/HIGH_FOURIER_COERCIVITY.md`.  Its displayed formulas, together with
`tanh(L/2)>1/2` and `log(coth(L/2))<1`, give the finite bounds

\[
 C_{|a|}(\lambda)\leq9\lambda^2,
 \qquad c_\lambda\leq7\lambda^2.                         \tag{3.6}
\]

Indeed, the two right sides before simplification are respectively
`4*lambda^2+11*lambda+2` and `4*lambda^2+6*lambda+2`.
Since `zeta(3/2)<3`, equations (1.6), (1.9), and (1.10), at the locked
cutoff, now give

\[
 A_{N_{\exp}}\leq{\lambda^2\over N_{\exp}},
 \qquad E_{\rm tail}\leq{10000\lambda^4\over N_{\exp}},
 \qquad E_{\rm full}<5\lambda^3.                         \tag{3.7}
\]

Let `c_0` be the exact positive constant defined in (4.1).  Insert
(3.6)--(3.7) into (2.3).  Using
`2*sqrt(50000)<448`, `14/sqrt(2)<10`, and `lambda>=1` yields

\[
\begin{aligned}
 |q_\lambda(p_\lambda,p_\lambda)
      -q_\lambda(p_{\lambda,N_{\exp}},p_{\lambda,N_{\exp}})|
 &<{10007\lambda^4\over N_{\exp}}
   +{458\lambda^{7/2}\over\sqrt{N_{\exp}}}\\
 &<{11000\lambda^4\over\sqrt{N_{\exp}}}
  <{\lambda\over1000}
  <{c_0\lambda\over8}.                                  \tag{3.8}
\end{aligned}
\]

For completeness, the penultimate inequality contains no numerical
assumption.  The function
`2^(4800*lambda^2)/lambda^3` is increasing for `lambda>=5/2`, while at
`lambda=5/2` the required polynomial is below `2^28` and the exponential is
`2^30000`.  The last inequality follows from the elementary bounds already
used in the source-selected subsequence theorem:
`gamma_E>57/100` and `log(2*sqrt(pi))<127/100`, which give `c_0>3/200`.

## 4. Common-schedule favorable subsequence

Recall the exact positive constant

\[
 c_0=1+{\gamma_E\over2}-\log(2\sqrt\pi)>0.               \tag{4.1}
\]

The source-selected subsequence theorem proves that infinitely many locked
parameters satisfy

\[
 \mathcal G_\lambda
 =q_\lambda(p_\lambda,p_\lambda)
 >{c_0\over2}\lambda.                                  \tag{4.2}
\]

### Theorem 4.1 (favorable direction on the residual schedule)

On every locked parameter satisfying (4.2),

\[
 \boxed{
 q_\lambda(p_{\lambda,N_{\exp}},p_{\lambda,N_{\exp}})
 \geq {3c_0\over8}\lambda.}                            \tag{4.3}
\]

If

\[
 v^{\rm pole}_{\lambda,N_{\exp}}
 ={p_{\lambda,N_{\exp}}
    \over\|p_{\lambda,N_{\exp}}\|},                    \tag{4.4}
\]

then the exact finite odd matrix obeys

\[
 \boxed{
 \langle v^{\rm pole}_{\lambda,N_{\exp}},
 Q_{\lambda,N_{\exp}}v^{\rm pole}_{\lambda,N_{\exp}}\rangle
 \geq {3c_0\over4}.}                                  \tag{4.5}
\]

**Proof.**  Equation (3.8), combined with (4.2), proves (4.3) without an
asymptotic threshold.  Orthogonal projection gives

\[
 \|p_{\lambda,N_{\exp}}\|^2
 \leq\mu_\lambda<\lambda/2.                             \tag{4.6}
\]

Dividing (4.3) by (4.6) proves (4.5).  \(\square\)

### Theorem 4.2 (neutral-subsequence pole-axis limit)

On the source-selected neutral locked subsequence of Theorem 4.3 in
`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`,

\[
 \boxed{
 {q_\lambda(p_{\lambda,N_{\exp}},p_{\lambda,N_{\exp}})
  \over\lambda}\longrightarrow c_0,
 \qquad
 \left\langle v^{\rm pole}_{\lambda,N_{\exp}},
 Q_{\lambda,N_{\exp}}v^{\rm pole}_{\lambda,N_{\exp}}
 \right\rangle\longrightarrow2c_0.}                    \tag{4.7}
\]

**Proof.**  The neutral theorem gives
`mathcal G_lambda/lambda->c_0`.  Equation (3.4) makes the complete-form
projection error tend to zero, so it is also `o(lambda)`.  Finally,
`||p_(lambda,N_exp)||^2/lambda->1/2` by the exact pole-tail bound and
(1.2).  Divide the first limit by this norm limit.  \(\square\)

The parameter selection reads only the source quantities used in (4.2).
The Fourier bandwidth is now the fixed formula (3.1); there is no second
cutoff search.

## 5. What remains open

Theorem 4.1 removes one schedule mismatch: the favorable pole-axis direction
now lives at the same bandwidth as the complete-remainder sampling,
projection, low graph-action, and far-Fourier theorems.

It does not prove the odd shifted floor.  Relative to the normalized pole
direction, that still requires positivity of the complete transverse block
and a strict inverse-weighted harmonic-short reserve.  Nor does (4.5) prove
the even-complement sign or the graph-observability estimate in
`notes/SIGNED_GRAPH_OBSERVABILITY_REDUCTION.md`.  Those are the remaining
common-schedule signed obligations.
